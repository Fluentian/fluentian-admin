import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/lib/store/auth';
import { setAccessCookie, clearAccessCookie } from '@/lib/auth-cookie';
import { logRequest, logResponse, logError } from '@/lib/middleware/logger';
import { checkRateLimit, RATE_LIMITS } from '@/lib/middleware/rate-limiter';

// Validate API URL is configured
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_API_URL) {
  console.error('⚠️  NEXT_PUBLIC_API_URL is not configured. Using default localhost - this may be incorrect in production.');
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // Increased for file uploads
});

// Track if refresh is in progress to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (_error: any, _token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (_error) {
      prom.reject(_error);
    } else {
      prom.resolve(_token as string);
    }
  });
  isRefreshing = false;
  failedQueue = [];
};

// Request interceptor: attach the Bearer token. Callers retain control of any
// AbortSignal they pass, so component unmounts and user cancellation work.
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  // An expired access token is NOT a reason to log out here. This used to call
  // logout() and reject, which fired every 15 minutes and made the refresh
  // machinery in the response interceptor below unreachable. Send the request
  // anyway: the 401 handler will rotate the token and retry once.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log request - store start time in config for response logging
  const startTime = logRequest(config.method?.toUpperCase() || 'GET', config.url || '');
  (config as any)._startTime = startTime;
  
  return config;
});

// Response interceptor: handle 401, refresh token, and errors
apiClient.interceptors.response.use(
  (res) => {
    // Log successful response
    const startTime = (res.config as any)._startTime || Date.now();
    logResponse(
      res.config.method?.toUpperCase() || 'GET',
      res.config.url || '',
      res.status,
      startTime
    );
    return res;
  },
  async (error: AxiosError) => {
    // Log error
    const startTime = (error.config as any)?._startTime || Date.now();
    logError(
      error.config?.method?.toUpperCase() || 'GET',
      error.config?.url || '',
      error,
      startTime
    );
    
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Rotate both tokens through the backend refresh endpoint.
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        useAuthStore.getState().login(data);
        setAccessCookie(data.access_token);
        processQueue(null, data.access_token);
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearAccessCookie();
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    }

    // Log API errors for debugging
    if (error.response?.status && error.response.status >= 400) {
      console.error(`API Error [${error.response.status}]:`, error.response.data || error.message);
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.message);
    } else if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
