-- Fix hero banner CTA links to scroll to correct sections on their respective pages
-- About page should scroll to #about section, Services page should scroll to #services section

UPDATE public.hero_banners
SET cta_link = '#about'
WHERE page_name = 'about';

UPDATE public.hero_banners
SET cta_link = '#services'
WHERE page_name = 'services';