-- Security fix: Remove overly permissive policy from admin_activity_logs
-- This policy was allowing any authenticated user to access sensitive admin audit logs

-- Drop the conflicting policy that granted full access to any authenticated user
DROP POLICY IF EXISTS "Allow authenticated users full access to admin activity logs" ON public.admin_activity_logs;

-- Note: Existing secure policies remain:
--   - "Admins can view activity logs" (SELECT using is_user_admin)
--   - "Only admins can insert activity logs" (INSERT with check is_user_admin)
-- This ensures only admins can view sensitive audit information like IP addresses and user agents.