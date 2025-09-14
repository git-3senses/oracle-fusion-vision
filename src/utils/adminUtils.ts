import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AdminCheckResult {
  isAuthenticated: boolean;
  hasPermissions: boolean;
  user?: any;
  error?: string;
}

// Check if user is authenticated and has admin permissions
export const checkAdminPermissions = async (): Promise<AdminCheckResult> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      return {
        isAuthenticated: false,
        hasPermissions: false,
        error: 'Session error: ' + sessionError.message
      };
    }

    if (!session) {
      return {
        isAuthenticated: false,
        hasPermissions: false,
        error: 'Not authenticated'
      };
    }

    // For now, we'll assume any authenticated user has admin permissions
    // In a real app, you'd check user roles here
    return {
      isAuthenticated: true,
      hasPermissions: true,
      user: session.user
    };
  } catch (error: any) {
    return {
      isAuthenticated: false,
      hasPermissions: false,
      error: error.message || 'Unknown error'
    };
  }
};

// Show appropriate error message for common database errors
export const handleDatabaseError = (error: any, operation: string) => {
  console.error(`Database error during ${operation}:`, error);

  let title = "Database Error";
  let description = `Failed to ${operation}`;

  if (error?.code === '42501' || error?.message?.includes('permission')) {
    title = "Permission Denied";
    description = "You don't have permission to perform this action. Please check your authentication.";
  } else if (error?.code === 'PGRST301') {
    title = "Connection Error";
    description = "Unable to connect to the database. Please try again.";
  } else if (error?.code === '23503') {
    title = "Reference Error";
    description = "This item cannot be deleted because it's referenced by other data.";
  } else if (error?.code === '23505') {
    title = "Duplicate Error";
    description = "This item already exists. Please use a different name or value.";
  } else if (error?.message?.includes('JWT')) {
    title = "Session Expired";
    description = "Your session has expired. Please log in again.";
  } else if (error?.message?.includes('RLS')) {
    title = "Security Policy";
    description = "Database security policies prevent this action. Contact support if this persists.";
  } else if (error?.message) {
    description = error.message;
  }

  toast({
    title,
    description,
    variant: "destructive"
  });

  return { title, description };
};

// Wrapper function for admin operations with proper error handling
export const executeAdminOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  showSuccessToast: boolean = true
): Promise<T | null> => {
  try {
    const adminCheck = await checkAdminPermissions();

    if (!adminCheck.isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to perform admin operations.",
        variant: "destructive"
      });
      return null;
    }

    if (!adminCheck.hasPermissions) {
      toast({
        title: "Insufficient Permissions",
        description: "You don't have permission to perform this action.",
        variant: "destructive"
      });
      return null;
    }

    const result = await operation();

    if (showSuccessToast) {
      toast({
        title: "Success",
        description: `${operationName} completed successfully.`,
        variant: "default"
      });
    }

    return result;
  } catch (error: any) {
    handleDatabaseError(error, operationName);
    return null;
  }
};