-- Create storage bucket for hero media
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-media', 'hero-media', true);

-- Create hero_banners table to store banner configurations
CREATE TABLE public.hero_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video')) DEFAULT 'image',
  media_url TEXT,
  overlay_opacity DECIMAL(3,2) DEFAULT 0.7,
  text_color TEXT DEFAULT 'white',
  cta_text TEXT,
  cta_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

-- Create policies for hero_banners
CREATE POLICY "Hero banners are viewable by everyone" 
ON public.hero_banners 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage hero banners" 
ON public.hero_banners 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create storage policies for hero-media bucket
CREATE POLICY "Hero media are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'hero-media');

CREATE POLICY "Authenticated users can upload hero media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'hero-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update hero media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'hero-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete hero media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'hero-media' AND auth.uid() IS NOT NULL);

-- Insert default hero banner data
INSERT INTO public.hero_banners (page_name, title, subtitle, media_type, cta_text, cta_link) VALUES
('home', 'Transform Your Enterprise with Oracle Excellence', 'Leading Oracle E-Business Suite & Fusion consulting firm delivering enterprise-grade solutions, AI-enhanced implementations, and strategic business transformation for global organizations.', 'image', 'Start Your Transformation', '#contact'),
('about', 'About Vijay Apps Consultants', 'Your trusted Oracle transformation partner with 20+ years of expertise and 10+ certified experts helping global organizations achieve digital transformation.', 'image', 'Learn More', '#services'),
('services', 'Comprehensive Oracle Solutions', 'From implementation to optimization, we provide end-to-end Oracle consulting services that transform your business operations.', 'image', 'Explore Services', '#contact'),
('careers', 'Join Our Team', 'Be part of a dynamic team shaping the future of Oracle consulting and enterprise solutions.', 'image', 'View Positions', '#contact'),
('contact', 'Get In Touch', 'Ready to transform your business? Let''s discuss how our Oracle expertise can drive your digital transformation.', 'image', 'Contact Us', '#contact-form');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_hero_banners_updated_at
BEFORE UPDATE ON public.hero_banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();