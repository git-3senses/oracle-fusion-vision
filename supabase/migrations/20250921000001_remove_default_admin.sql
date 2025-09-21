-- Remove default admin user for security
-- Admin users should be added manually via Supabase dashboard

DELETE FROM public.admin_users WHERE email = 'admin@vijayapps.com';