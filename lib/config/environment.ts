/**
 * Environment Variable Validation
 * Validates all required environment variables at application startup
 */

interface EnvironmentConfig {
  apiUrl: string;
  appName: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

export function validateEnvironment(): EnvironmentConfig {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  // Validate NEXT_PUBLIC_API_URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (isProduction && !apiUrl) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not configured. This is required for production builds.'
    );
  }

  if (!apiUrl && isDevelopment) {
    console.warn(
      '⚠️  NEXT_PUBLIC_API_URL not configured. Defaulting to http://localhost:8000/api/v1'
    );
  }

  // Validate NEXT_PUBLIC_APP_NAME
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Fluentian Admin';

  return {
    apiUrl: apiUrl || 'http://localhost:8000/api/v1',
    appName,
    isDevelopment,
    isProduction,
  };
}

// Validate on import
if (typeof window === 'undefined') {
  try {
    validateEnvironment();
  } catch (error) {
    console.error('Environment validation failed:', error);
    process.exit(1);
  }
}
