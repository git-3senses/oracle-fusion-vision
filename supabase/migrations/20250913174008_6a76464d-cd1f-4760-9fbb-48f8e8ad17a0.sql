-- Security Fix 1: Restrict admin activity logs to admin users only
DROP POLICY IF EXISTS "Authenticated users can insert activity logs" ON public.admin_activity_logs;

CREATE POLICY "Only admins can insert activity logs" 
ON public.admin_activity_logs 
FOR INSERT 
WITH CHECK (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text));

-- Security Fix 2: Restrict content management to admin users only
DROP POLICY IF EXISTS "Authenticated users can manage page content" ON public.page_content;
DROP POLICY IF EXISTS "Authenticated users can manage page images" ON public.page_images;
DROP POLICY IF EXISTS "Authenticated users can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can manage hero banners" ON public.hero_banners;
DROP POLICY IF EXISTS "Authenticated users can manage footer content" ON public.footer_content;
DROP POLICY IF EXISTS "Authenticated users can manage job openings" ON public.job_openings;

CREATE POLICY "Only admins can manage page content" 
ON public.page_content 
FOR ALL 
USING (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text))
WITH CHECK (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text));

CREATE POLICY "Only admins can manage page images" 
ON public.page_images 
FOR ALL 
USING (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text))
WITH CHECK (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text));

CREATE POLICY "Only admins can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text))
WITH CHECK (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text));

CREATE POLICY "Only admins can manage hero banners" 
ON public.hero_banners 
FOR ALL 
USING (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text))
WITH CHECK (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text));

CREATE POLICY "Only admins can manage footer content" 
ON public.footer_content 
FOR ALL 
USING (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text))
WITH CHECK (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text));

CREATE POLICY "Only admins can manage job openings" 
ON public.job_openings 
FOR ALL 
USING (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text))
WITH CHECK (is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid())::text));