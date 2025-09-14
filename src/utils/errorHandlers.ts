import { toast } from '@/hooks/use-toast';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface NetworkErrorOptions {
  showToast?: boolean;
  fallbackMessage?: string;
  onError?: (error: ApiError) => void;
}

// Enhanced error handling for API calls
export const handleApiError = (
  error: any,
  operation: string,
  options: NetworkErrorOptions = {}
): ApiError => {
  const {
    showToast = true,
    fallbackMessage = 'An unexpected error occurred',
    onError
  } = options;

  let apiError: ApiError = {
    message: fallbackMessage,
    code: error?.code,
    status: error?.status
  };

  // Handle different error types
  if (error?.message) {
    apiError.message = error.message;
  } else if (typeof error === 'string') {
    apiError.message = error;
  } else if (error?.error?.message) {
    // Supabase error format
    apiError.message = error.error.message;
  }

  // Handle network-specific errors
  if (!navigator.onLine) {
    apiError.message = 'You appear to be offline. Please check your internet connection.';
  } else if (error?.status === 0 || error?.code === 'NETWORK_ERROR') {
    apiError.message = 'Network error. Please check your internet connection and try again.';
  } else if (error?.status === 500) {
    apiError.message = 'Server error. Please try again later.';
  } else if (error?.status === 403) {
    apiError.message = 'Access denied. You may not have permission to perform this action.';
  } else if (error?.status === 404) {
    apiError.message = 'Resource not found.';
  }

  // Log error in development
  if (import.meta.env.DEV) {
    console.error(`Error in ${operation}:`, error);
  }

  // Show toast notification
  if (showToast) {
    toast({
      title: `Error: ${operation}`,
      description: apiError.message,
      variant: 'destructive'
    });
  }

  // Call custom error handler
  if (onError) {
    onError(apiError);
  }

  return apiError;
};

// Retry logic for failed operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry on authentication errors or client errors
      if (error?.status >= 400 && error?.status < 500) {
        throw error;
      }

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError;
};

// Handle image/media loading errors
export const handleMediaError = (
  element: HTMLImageElement | HTMLVideoElement,
  fallbackSrc?: string
) => {
  if (element instanceof HTMLImageElement && fallbackSrc) {
    element.src = fallbackSrc;
  }

  if (import.meta.env.DEV) {
    console.warn('Media failed to load:', element.src);
  }
};

// Network connectivity checker
export const checkNetworkConnectivity = async (): Promise<boolean> => {
  if (!navigator.onLine) {
    return false;
  }

  try {
    const response = await fetch('/ping', {
      method: 'HEAD',
      cache: 'no-cache',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Graceful degradation for failed component states
export const createFallbackData = <T>(
  defaultData: T,
  errorMessage?: string
): { data: T; error: string | null } => {
  return {
    data: defaultData,
    error: errorMessage || null
  };
};