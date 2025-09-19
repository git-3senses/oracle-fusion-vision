-- Create resume_submissions table
CREATE TABLE IF NOT EXISTS resume_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    current_location VARCHAR(255),
    experience_years VARCHAR(100) NOT NULL,
    current_role VARCHAR(255),
    preferred_position VARCHAR(255),
    oracle_skills TEXT NOT NULL,
    availability VARCHAR(100),
    expected_salary VARCHAR(100),
    cover_letter TEXT NOT NULL,
    resume_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_resume_submissions_email ON resume_submissions(email);
CREATE INDEX IF NOT EXISTS idx_resume_submissions_status ON resume_submissions(status);
CREATE INDEX IF NOT EXISTS idx_resume_submissions_created_at ON resume_submissions(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE resume_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow insert for all users (for form submissions)
CREATE POLICY "Allow public resume submissions" ON resume_submissions
    FOR INSERT WITH CHECK (true);

-- Create policy to allow admin users to view all submissions
CREATE POLICY "Allow admin users to view resume submissions" ON resume_submissions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE admin_users.email = auth.jwt() ->> 'email'
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_resume_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_resume_submissions_updated_at
    BEFORE UPDATE ON resume_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_resume_submissions_updated_at();

-- Add comment to table
COMMENT ON TABLE resume_submissions IS 'Stores resume/job application submissions from the careers page';