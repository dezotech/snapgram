/**
 * Centralized error handling utilities for Appwrite API calls
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public context?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Log error in development, silent in production
 */
export function logError(context: string, error: unknown): void {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
}

/**
 * Extract user-friendly message from error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Handle common Appwrite errors
    const message = error.message.toLowerCase();

    if (message.includes('network')) {
      return 'Network error. Please check your connection.';
    }
    if (message.includes('unauthorized') || message.includes('401')) {
      return 'Session expired. Please sign in again.';
    }
    if (message.includes('not found') || message.includes('404')) {
      return 'The requested resource was not found.';
    }
    if (message.includes('permission') || message.includes('403')) {
      return 'You do not have permission to perform this action.';
    }
    if (message.includes('duplicate') || message.includes('already exists')) {
      return 'This item already exists.';
    }
    if (message.includes('invalid')) {
      return 'Invalid data provided. Please check your input.';
    }

    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Handle API errors consistently
 * Returns null and logs the error
 */
export function handleApiError(context: string, error: unknown): null {
  logError(context, error);
  return null;
}

/**
 * Validate required parameters
 */
export function validateRequired(
  params: Record<string, unknown>,
  context: string
): void {
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      throw new AppError(`${key} is required`, 'VALIDATION_ERROR', context);
    }
  }
}
