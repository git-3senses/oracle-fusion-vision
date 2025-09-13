-- Create job_openings table for managing career positions
CREATE TABLE public.job_openings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Full-time',
  experience TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  requirements TEXT,
  is_urgent BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;

-- Create policies for job openings
CREATE POLICY "Job openings are viewable by everyone" 
ON public.job_openings 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage job openings" 
ON public.job_openings 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_job_openings_updated_at
BEFORE UPDATE ON public.job_openings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample job openings
INSERT INTO public.job_openings (title, department, location, type, experience, skills, description, is_urgent) VALUES
('Senior Oracle ERP Consultant', 'Consulting', 'Hyderabad / Remote', 'Full-time', '5+ years', '{"Oracle ERP", "Fusion Cloud", "Implementation", "Business Analysis"}', 'Lead Oracle ERP implementations and provide expert consulting services.', true),
('Oracle Fusion Technical Lead', 'Technical', 'Bangalore / Remote', 'Full-time', '7+ years', '{"Oracle Fusion", "PL/SQL", "Integration", "Technical Architecture"}', 'Architect and develop Oracle Fusion solutions with technical leadership.', false),
('AI Solutions Architect', 'Innovation', 'Remote', 'Full-time', '6+ years', '{"AI/ML", "Oracle Cloud", "Python", "Data Analytics"}', 'Design AI-powered solutions using Oracle technologies.', true),
('Oracle Support Specialist', 'Support', 'Chennai / Remote', 'Full-time', '3+ years', '{"Oracle Support", "Troubleshooting", "Customer Service", "Documentation"}', 'Provide technical support and customer service for Oracle applications.', false);