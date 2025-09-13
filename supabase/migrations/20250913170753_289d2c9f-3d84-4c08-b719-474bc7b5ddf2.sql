-- Update hero banner CTA links to point to correct section IDs
UPDATE hero_banners 
SET cta_link = '#careers-content' 
WHERE page_name = 'careers';

UPDATE hero_banners 
SET cta_link = '#contact' 
WHERE page_name IN ('home', 'about', 'services', 'contact');

UPDATE hero_banners 
SET cta_link = '#services' 
WHERE page_name = 'home';