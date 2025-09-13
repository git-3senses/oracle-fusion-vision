-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_user_admin(user_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE email = user_email
  );
$$;

-- Drop the overly permissive existing policy
DROP POLICY IF EXISTS "Admin users can view themselves" ON public.admin_users;

-- Create a proper restrictive policy for admin users
CREATE POLICY "Users can only view their own admin record"
ON public.admin_users
FOR SELECT
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Create admin activity logging table
CREATE TABLE public.admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text,
  action text NOT NULL,
  resource text,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin activity logs
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view activity logs
CREATE POLICY "Admins can view activity logs"
ON public.admin_activity_logs
FOR SELECT
USING (
  public.is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid()))
);

-- Allow authenticated users to insert activity logs (for logging purposes)
CREATE POLICY "Authenticated users can insert activity logs"
ON public.admin_activity_logs
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);