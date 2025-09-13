-- Create storage bucket for media uploads if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('hero-media', 'hero-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for media uploads
CREATE POLICY "Media files are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hero-media');

CREATE POLICY "Authenticated users can upload media"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'hero-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update their media"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'hero-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete their media"
ON storage.objects
FOR DELETE
USING (bucket_id = 'hero-media' AND auth.uid() IS NOT NULL);