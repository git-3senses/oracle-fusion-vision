-- Drop the overly permissive policies on contact_submissions
DROP POLICY IF EXISTS "Authenticated users can view all submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Authenticated users can update submissions" ON public.contact_submissions;

-- Create admin-only policies for viewing and updating contact submissions
CREATE POLICY "Only admins can view contact submissions"
ON public.contact_submissions
FOR SELECT
USING (
  public.is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid()))
);

CREATE POLICY "Only admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
USING (
  public.is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid()))
)
WITH CHECK (
  public.is_user_admin((SELECT email FROM auth.users WHERE id = auth.uid()))
);

-- Keep the existing INSERT policy for public form submissions
-- (Already exists: "Anyone can submit contact forms")