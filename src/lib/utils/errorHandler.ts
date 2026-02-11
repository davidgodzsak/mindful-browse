/**
 * Error handling utilities for consistent error management across components
 */

/**
 * Extracts error message from various error types
 * Handles Error objects, strings, and unknown error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
}

/**
 * Logs error with context for debugging
 * @param context Brief description of where error occurred
 * @param error The error object
 */
export function logError(context: string, error: unknown): void {
  const message = getErrorMessage(error);
  console.error(`${context}:`, message);
}

/**
 * Standard error toast properties
 */
export function getErrorToastProps(
  message: string,
  title: string = "Error"
) {
  return {
    title,
    description: message,
    variant: "destructive" as const,
  };
}

/**
 * Standard success toast properties
 */
export function getSuccessToastProps(
  message: string,
  title: string = "Success"
) {
  return {
    title,
    description: message,
  };
}
