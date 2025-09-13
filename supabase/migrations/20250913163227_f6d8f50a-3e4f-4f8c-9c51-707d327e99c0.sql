-- Update site settings with correct footer information
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('footer_email', 'vijay_adina@vijayappsconsultants.com', 'email', 'Footer contact email'),
('footer_phone', '+916303526930', 'text', 'Footer contact phone number'),
('footer_support_text', 'Global 24/7 Support', 'text', 'Footer support text')
ON CONFLICT (setting_key) DO UPDATE SET
setting_value = EXCLUDED.setting_value,
updated_at = now();

-- Clear existing footer content and add new correct data
DELETE FROM footer_content WHERE section_type IN ('contact_info', 'company_info');

-- Add logo/company info section
INSERT INTO footer_content (section_type, title, content, order_index, is_active) VALUES
('company_info', 'Vijay Apps Consultants', 'Leading Oracle consulting and enterprise solutions provider with global expertise.', 0, true);

-- Add contact information with correct details
INSERT INTO footer_content (section_type, content, icon_name, link_url, order_index, is_active) VALUES
('contact_info', 'vijay_adina@vijayappsconsultants.com', 'mail', 'mailto:vijay_adina@vijayappsconsultants.com', 1, true),
('contact_info', '+916303526930', 'phone', 'tel:+916303526930', 2, true),
('contact_info', 'Global 24/7 Support', 'globe', null, 3, true);