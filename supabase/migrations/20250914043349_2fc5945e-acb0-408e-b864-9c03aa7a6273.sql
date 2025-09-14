-- Fix permission denied error for auth.users table access
-- Update the is_user_admin function to properly access auth.users with security definer
CREATE OR REPLACE FUNCTION public.is_user_admin(user_email text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE email = user_email
  );
$function$;

-- Grant necessary permissions for the function to work
GRANT USAGE ON SCHEMA auth TO postgres;
GRANT SELECT ON auth.users TO postgres;