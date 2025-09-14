-- Fix job_openings RLS policies - clean up existing policies first
-- Check what policies exist and remove them
DROP POLICY IF EXISTS "Only admins can manage job openings" ON public.job_openings;
DROP POLICY IF EXISTS "Job openings are viewable by everyone" ON public.job_openings;

-- Create simple, working policies for job_openings
-- Allow public to view active job openings (no auth.users access needed)
CREATE POLICY "Public can view active job openings" 
ON public.job_openings 
FOR SELECT 
USING (is_active = true);

-- Allow admins to manage job openings
CREATE POLICY "Admins can manage job openings" 
ON public.job_openings 
FOR ALL 
USING (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text))
WITH CHECK (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text));