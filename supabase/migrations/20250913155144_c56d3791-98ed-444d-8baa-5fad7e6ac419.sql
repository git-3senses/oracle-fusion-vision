-- Create content management tables for pages
CREATE TABLE public.page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL,
  section_name TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  image_url TEXT,
  image_alt TEXT,
  button_text TEXT,
  button_link TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(page_name, section_name, order_index)
);

-- Create footer content management table
CREATE TABLE public.footer_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_type TEXT NOT NULL, -- 'company_info', 'contact_info', 'social_links', 'quick_links', 'services', 'legal'
  title TEXT,
  content TEXT,
  link_url TEXT,
  link_text TEXT,
  icon_name TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create page images table for better image management
CREATE TABLE public.page_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL,
  section_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_alt TEXT,
  image_caption TEXT,
  image_type TEXT DEFAULT 'content', -- 'hero', 'content', 'gallery', 'background'
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for page_content
CREATE POLICY "Page content is viewable by everyone" 
ON public.page_content 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage page content" 
ON public.page_content 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for footer_content
CREATE POLICY "Footer content is viewable by everyone" 
ON public.footer_content 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage footer content" 
ON public.footer_content 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for page_images
CREATE POLICY "Page images are viewable by everyone" 
ON public.page_images 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage page images" 
ON public.page_images 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create triggers for updated_at columns
CREATE TRIGGER update_page_content_updated_at
BEFORE UPDATE ON public.page_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_footer_content_updated_at
BEFORE UPDATE ON public.footer_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_images_updated_at
BEFORE UPDATE ON public.page_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default footer content
INSERT INTO public.footer_content (section_type, title, content, order_index) VALUES
('company_info', 'Vijay Apps Consultants', 'Leading Oracle E-Business Suite & Fusion consulting firm delivering enterprise-grade solutions and strategic business transformation for global organizations.', 1),
('contact_info', 'Email', 'Vijay@2025apps', 1),
('contact_info', 'Support Email', 'Avbhaskarreddy@gmail.com', 2),
('contact_info', 'Support', 'Global 24/7 Support', 3),
('social_links', 'LinkedIn', '#', 1),
('social_links', 'Twitter', '#', 2),
('social_links', 'YouTube', '#', 3),
('quick_links', 'Home', '#home', 1),
('quick_links', 'About Us', '#about', 2),
('quick_links', 'Services', '#services', 3),
('quick_links', 'Contact', '#contact', 4),
('services', 'Oracle ERP Implementation', '#', 1),
('services', 'AI-Enhanced Solutions', '#', 2),
('services', 'System Customization', '#', 3),
('services', 'Managed Support', '#', 4),
('services', 'Cloud Migration', '#', 5),
('legal', 'Privacy Policy', '#', 1),
('legal', 'Terms of Service', '#', 2),
('legal', 'Copyright', '© 2025 Vijay Apps Consultants. All rights reserved.', 3),
('legal', 'Certifications', 'Oracle Certified Gold Partner | ISO 27001 Certified', 4);

-- Insert sample page content for existing pages
INSERT INTO public.page_content (page_name, section_name, title, subtitle, content, order_index) VALUES
('about', 'hero', 'About Vijay Apps Consultants', 'Your trusted Oracle transformation partner with 15+ years of expertise helping global organizations achieve digital transformation.', '', 1),
('about', 'mission', 'Our Mission', 'Transforming Business Through Technology', 'We empower organizations to achieve operational excellence through innovative Oracle solutions and strategic consulting services.', 1),
('about', 'values', 'Our Values', 'Excellence, Innovation, Partnership', 'We believe in delivering exceptional value through cutting-edge technology, deep expertise, and long-term partnerships.', 1),
('services', 'hero', 'Comprehensive Oracle Solutions', 'From implementation to optimization, we provide end-to-end Oracle consulting services that transform your business operations.', '', 1),
('services', 'overview', 'Our Services', 'Complete Oracle Ecosystem Solutions', 'We provide comprehensive Oracle consulting services from strategy to implementation and ongoing support.', 1),
('careers', 'hero', 'Join Our Team', 'Build your career with a leading Oracle consulting firm', 'We are always looking for talented professionals to join our growing team of Oracle experts.', 1),
('contact', 'hero', 'Get In Touch', 'Ready to transform your business?', 'Contact us today for a free consultation and discover how we can help optimize your Oracle environment.', 1);