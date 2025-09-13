-- Create site settings table for global website configuration
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'text', -- 'text', 'image', 'boolean', 'json'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for site_settings
CREATE POLICY "Site settings are viewable by everyone" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create trigger for updated_at column
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description) VALUES
('company_name', 'Vijay Apps Consultants', 'text', 'Company name displayed in header'),
('company_tagline', 'Oracle E-Business Suite & Fusion Specialists', 'text', 'Company tagline displayed in header'),
('logo_url', null, 'image', 'Company logo URL'),
('primary_phone', '+1-555-0123', 'text', 'Primary contact phone number'),
('primary_email', 'contact@vijayapps.com', 'text', 'Primary contact email'),
('address', '123 Business Center, Tech City, CA 90210', 'text', 'Company address'),
('facebook_url', '#', 'text', 'Facebook profile URL'),
('linkedin_url', '#', 'text', 'LinkedIn profile URL'),
('twitter_url', '#', 'text', 'Twitter profile URL'),
('youtube_url', '#', 'text', 'YouTube channel URL'),
('cta_button_text', 'Get Free Consultation', 'text', 'Main CTA button text'),
('enable_floating_cta', 'true', 'boolean', 'Show floating CTA button'),
('google_analytics_id', null, 'text', 'Google Analytics tracking ID'),
('meta_description', 'Leading Oracle consulting firm specializing in E-Business Suite and Fusion applications', 'text', 'Default meta description'),
('meta_keywords', 'Oracle consulting, EBS, Fusion, implementation, support', 'text', 'Default meta keywords');