-- Fix job_openings RLS policies - remove problematic policies and create proper ones
-- Drop all existing conflicting policies
DROP POLICY IF EXISTS "Allow authenticated users full access to job openings" ON public.job_openings;
DROP POLICY IF EXISTS "public_select_active_job_openings" ON public.job_openings;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.job_openings;
DROP POLICY IF EXISTS "Policy with table joins" ON public.job_openings;

-- Create simple, working policies for job_openings
-- Allow public to view active job openings
CREATE POLICY "Public can view active job openings" 
ON public.job_openings 
FOR SELECT 
USING (is_active = true);

-- Only admins can manage job openings (insert, update, delete)
CREATE POLICY "Only admins can manage job openings" 
ON public.job_openings 
FOR ALL 
USING (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text))
WITH CHECK (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text));