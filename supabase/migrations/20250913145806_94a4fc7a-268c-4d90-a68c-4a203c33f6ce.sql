-- Update admin email to the new address
UPDATE public.admin_users 
SET email = 'vijay_adina@vijayappsconsultants.com' 
WHERE email = 'admin@vijayapps.com';

-- Also update hero banners default data if needed
UPDATE public.hero_banners 
SET cta_link = '#contact-form' 
WHERE cta_link = '#contact';