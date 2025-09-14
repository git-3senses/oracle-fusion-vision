-- Remove overly permissive RLS policies that allow any authenticated user to modify critical website content

-- Remove the permissive policy from footer_content table
DROP POLICY IF EXISTS "Allow authenticated users full access to site settings" ON public.footer_content;

-- Remove the permissive policy from hero_banners table  
DROP POLICY IF EXISTS "Allow authenticated users full access to hero banners" ON public.hero_banners;

-- Remove the permissive policy from page_content table
DROP POLICY IF EXISTS "Allow authenticated users full access to site settings" ON public.page_content;

-- Remove the permissive policy from page_images table
DROP POLICY IF EXISTS "Allow authenticated users full access to site settings" ON public.page_images;

-- Remove the permissive policy from site_settings table
DROP POLICY IF EXISTS "Allow authenticated users full access to site settings" ON public.site_settings;

-- Remove the permissive policy from job_openings table
DROP POLICY IF EXISTS "Allow authenticated users full access to job openings" ON public.job_openings;

-- Remove the permissive policy from testimonials table
DROP POLICY IF EXISTS "Allow authenticated users full access to testimonials" ON public.testimonials;

-- Ensure testimonials has proper admin-only management policy
CREATE POLICY "Only admins can manage testimonials" ON public.testimonials
FOR ALL USING (
  is_user_admin((
    SELECT users.email
    FROM auth.users
    WHERE users.id = auth.uid()
  )::text)
) WITH CHECK (
  is_user_admin((
    SELECT users.email
    FROM auth.users
    WHERE users.id = auth.uid()
  )::text)
);

-- Add public read access for active testimonials only
CREATE POLICY "Public can view active testimonials" ON public.testimonials
FOR SELECT USING (is_active = true);