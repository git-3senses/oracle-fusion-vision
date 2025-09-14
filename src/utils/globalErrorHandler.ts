import { toast } from '@/hooks/use-toast';

// Global error handler setup
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);

    // Prevent default browser error handling
    event.preventDefault();

    // Show user-friendly error message
    toast({
      title: 'Unexpected Error',
      description: 'Something went wrong. Please try again.',
      variant: 'destructive'
    });
  });

  // Handle general JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);

    // Don't show toast for resource loading errors (images, scripts)
    if (event.target !== window) {
      return;
    }

    // Only show for serious errors
    if (event.error instanceof Error) {
      toast({
        title: 'Application Error',
        description: 'An unexpected error occurred. Please refresh the page.',
        variant: 'destructive'
      });
    }
  });

  // Handle network connectivity changes
  window.addEventListener('online', () => {
    toast({
      title: 'Connection Restored',
      description: 'You are back online.',
      variant: 'default'
    });
  });

  window.addEventListener('offline', () => {
    toast({
      title: 'Connection Lost',
      description: 'You are currently offline. Some features may not work.',
      variant: 'destructive'
    });
  });
};

// Cleanup function for removing event listeners
export const cleanupGlobalErrorHandlers = () => {
  // This would be called if we needed to remove listeners
  // For now, we'll keep them active throughout the app lifecycle
};