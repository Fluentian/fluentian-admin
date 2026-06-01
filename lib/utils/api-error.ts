/**
 * API Error Utilities
 * Provides consistent error handling across the application
 */

import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
}

/**
 * Extracts error message from various error types
 * Handles AxiosError, Error, and unknown types
 */
export const getErrorMessage = (error: unknown): string => {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse;
    return data?.message || data?.detail || data?.error || error.message || 'An error occurred';
  }

  // Handle standard JavaScript errors
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle object with message property
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as any).message;
  }

  return 'An unknown error occurred';
};

/**
 * Safely logs errors (respects production environment)
 */
export const logError = (context: string, error: unknown): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
  }

  // TODO: Send to error tracking service in production
  // if (process.env.NODE_ENV === 'production') {
  //   trackError(context, error);
  // }
};

/**
 * Checks if error is a network error (not response received)
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response;
  }
  return false;
};

/**
 * Checks if error is a specific HTTP status
 */
export const isHttpError = (error: unknown, statusCode: number): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === statusCode;
  }
  return false;
};
