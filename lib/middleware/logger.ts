/**
 * Request/Response Logging Middleware
 * Logs all API requests and responses for debugging
 */

import { AxiosError, AxiosResponse } from 'axios';

interface LogEntry {
  timestamp: string;
  method: string;
  url: string;
  status?: number;
  duration: number;
  error?: string;
}

const logs: LogEntry[] = [];
const MAX_LOGS = 100;

export const logRequest = (method: string, url: string): number => {
  return Date.now();
};

export const logResponse = (method: string, url: string, status: number, startTime: number): void => {
  const duration = Date.now() - startTime;
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    method,
    url,
    status,
    duration,
  };

  logs.push(entry);
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    const color = status >= 400 ? '🔴' : status >= 300 ? '🟡' : '✅';
    console.debug(`${color} [${method}] ${url} ${status} (${duration}ms)`);
  }
};

export const logError = (method: string, url: string, error: AxiosError | Error, startTime: number): void => {
  const duration = Date.now() - startTime;
  let errorMessage = '';

  if (error instanceof AxiosError) {
    errorMessage = error.response?.data?.message || error.message;
  } else {
    errorMessage = error.message;
  }

  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    method,
    url,
    duration,
    error: errorMessage,
  };

  logs.push(entry);
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }

  console.error(`🔴 [${method}] ${url} ERROR: ${errorMessage} (${duration}ms)`);
};

export const getLogs = (): LogEntry[] => {
  return [...logs];
};

export const clearLogs = (): void => {
  logs.length = 0;
};

/**
 * Get logs for export (debugging/monitoring)
 */
export const exportLogs = (): string => {
  return JSON.stringify(logs, null, 2);
};
