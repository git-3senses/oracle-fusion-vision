-- Security fix: tighten RLS on contact_submissions by removing permissive ALL policy
-- Ensure RLS is enabled (safe if already enabled)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop the conflicting policy that granted full access to any authenticated user
DROP POLICY IF EXISTS "Allow authenticated users full access to contact submissions" ON public.contact_submissions;

-- Note: Existing policies remain:
--   - "Anyone can submit contact forms" (INSERT, WITH CHECK true)
--   - "Only admins can view contact submissions" (SELECT using is_user_admin)
--   - "Only admins can update contact submissions" (UPDATE using/with check is_user_admin)
-- This preserves public form submission while restricting read/update to admins only.
