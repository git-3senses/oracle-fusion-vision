-- Create a simple admin user for demonstration
-- This creates a basic admin setup - in production you'd want proper user management

-- Create an admin_users table for basic admin management
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users
CREATE POLICY "Admin users can view themselves" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid()::text IN (SELECT auth.uid()::text));

-- No default admin users - must be added manually via Supabase dashboard
-- INSERT INTO public.admin_users (email) VALUES ('your-admin-email@company.com');