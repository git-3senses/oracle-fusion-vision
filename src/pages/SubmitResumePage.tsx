import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Send,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import DynamicFooter from '@/components/DynamicFooter';
import SEOHead from '@/components/SEOHead';
import { useNavigate } from 'react-router-dom';

interface ResumeFormData {
  full_name: string;
  email: string;
  phone: string;
  current_location: string;
  experience_years: string;
  current_role: string;
  preferred_position: string;
  oracle_skills: string;
  availability: string;
  expected_salary: string;
  cover_letter: string;
  resume_url: string;
}

const SubmitResumePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      title: 'Personal Info',
      description: 'Basic contact information',
      icon: User,
    },
    {
      id: 2,
      title: 'Professional',
      description: 'Experience and skills',
      icon: Briefcase,
    },
    {
      id: 3,
      title: 'Additional',
      description: 'Cover letter and details',
      icon: FileText,
    },
  ];

  const [formData, setFormData] = useState<ResumeFormData>({
    full_name: '',
    email: '',
    phone: '',
    current_location: '',
    experience_years: '',
    current_role: '',
    preferred_position: '',
    oracle_skills: '',
    availability: '',
    expected_salary: '',
    cover_letter: '',
    resume_url: ''
  });

  const handleInputChange = (field: keyof ResumeFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step: number): string | null => {
    switch (step) {
      case 1: // Personal Information
        if (!formData.full_name.trim()) return 'Full name is required';
        if (!formData.email.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email';
        if (!formData.phone.trim()) return 'Phone number is required';
        return null;
      case 2: // Professional Information
        if (!formData.experience_years) return 'Experience level is required';
        if (!formData.oracle_skills.trim()) return 'Oracle skills are required';
        return null;
      case 3: // Additional Information
        if (!formData.cover_letter.trim()) return 'Cover letter is required';
        return null;
      default:
        return null;
    }
  };

  const validateForm = (): string | null => {
    for (let step = 1; step <= 3; step++) {
      const stepError = validateStep(step);
      if (stepError) return stepError;
    }
    return null;
  };

  const handleNext = () => {
    const stepError = validateStep(currentStep);
    if (stepError) {
      toast({
        title: "Validation Error",
        description: stepError,
        variant: "destructive"
      });
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      current_location: '',
      experience_years: '',
      current_role: '',
      preferred_position: '',
      oracle_skills: '',
      availability: '',
      expected_salary: '',
      cover_letter: '',
      resume_url: ''
    });
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('resume_submissions')
        .insert({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          current_location: formData.current_location || null,
          experience_years: formData.experience_years,
          current_role: formData.current_role || null,
          preferred_position: formData.preferred_position || null,
          oracle_skills: formData.oracle_skills,
          availability: formData.availability || null,
          expected_salary: formData.expected_salary || null,
          cover_letter: formData.cover_letter,
          resume_url: formData.resume_url || null
        });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);

      toast({
        title: "Resume Submitted Successfully!",
        description: "Thank you for your interest. We'll review your application and get back to you soon.",
      });

      // Auto redirect after 5 seconds
      setTimeout(() => {
        navigate('/careers');
      }, 5000);

    } catch (error: any) {
      console.error('Error submitting resume:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your resume. Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const experienceOptions = [
    'Entry Level (0-1 years)',
    'Junior (1-3 years)',
    'Mid Level (3-5 years)',
    'Senior (5-8 years)',
    'Lead/Principal (8+ years)'
  ];

  const positionOptions = [
    'Oracle EBS Developer',
    'Oracle Fusion Developer',
    'Oracle Cloud Consultant',
    'Oracle Functional Consultant',
    'Oracle Technical Consultant',
    'Oracle Integration Specialist',
    'Oracle Database Administrator',
    'Project Manager',
    'Business Analyst',
    'Open to Any Position'
  ];

  const availabilityOptions = [
    'Immediately',
    'Within 2 weeks',
    'Within 1 month',
    'Within 2 months',
    'Within 3 months',
    'Open to discuss'
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title="Resume Submitted Successfully - Vijay Apps Consultants"
          description="Thank you for submitting your resume. Our team will review your application and contact you soon."
          keywords="Resume Submitted, Oracle Jobs, Thank You"
          canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/submit-resume` : ''}
        />
        <Header />
        <main className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-success rounded-full mb-8">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-6">
                Resume Submitted Successfully!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Thank you for your interest in joining our team. We'll review your application
                and contact you within 48 hours if your profile matches our current openings.
              </p>
              <div className="bg-muted/50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold mb-4">What happens next?</h3>
                <div className="grid gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Our HR team will review your application</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Technical screening if your profile matches our requirements</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Interview process with our Oracle experts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Final decision and onboarding</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="hero"
                  onClick={() => navigate('/careers')}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Careers
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full sm:w-auto"
                >
                  Go to Homepage
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                You will be redirected to careers page in 5 seconds...
              </p>
            </div>
          </div>
        </main>
        <DynamicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Submit Your Resume - Join Oracle Experts Team"
        description="Submit your resume to join Vijay Apps Consultants Oracle team. Apply for Oracle developer, consultant, and specialist positions with competitive benefits."
        keywords="Submit Resume, Oracle Jobs Application, Oracle Careers, Oracle Developer Jobs, Oracle Consultant Application"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/submit-resume` : ''}
      />
      <Header />
      <main className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <Button
                variant="ghost"
                onClick={() => navigate('/careers')}
                className="mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Careers
              </Button>
              <h1 className="text-3xl lg:text-5xl font-bold mb-6">
                Submit Your <span className="text-button-gradient">Resume</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join our team of Oracle experts and be part of transforming businesses
                through innovative enterprise solutions.
              </p>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Application Form</CardTitle>
                <CardDescription>
                  Please fill out all sections to complete your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Stepper */}
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div className={`
                            flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors
                            ${currentStep === step.id
                              ? 'bg-primary border-primary text-white'
                              : currentStep > step.id
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-muted-foreground text-muted-foreground'
                            }
                          `}>
                            <step.icon className="h-6 w-6" />
                          </div>
                          <div className="mt-3 text-center">
                            <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {step.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`
                            flex-1 h-0.5 mx-6 transition-colors
                            ${currentStep > step.id ? 'bg-green-500' : 'bg-muted'}
                          `} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Personal Information</h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="full_name">Full Name *</Label>
                          <Input
                            id="full_name"
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            placeholder="Enter your full name"
                            className="h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Enter your email"
                            className="h-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="Enter your phone number"
                            className="h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="current_location">Current Location</Label>
                          <Input
                            id="current_location"
                            type="text"
                            value={formData.current_location}
                            onChange={(e) => handleInputChange('current_location', e.target.value)}
                            placeholder="City, State/Country"
                            className="h-12"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Professional Information */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Professional Information</h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="experience_years">Experience Level *</Label>
                          <Select value={formData.experience_years} onValueChange={(value) => handleInputChange('experience_years', value)}>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              {experienceOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="current_role">Current Role</Label>
                          <Input
                            id="current_role"
                            type="text"
                            value={formData.current_role}
                            onChange={(e) => handleInputChange('current_role', e.target.value)}
                            placeholder="Your current job title"
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preferred_position">Preferred Position</Label>
                        <Select value={formData.preferred_position} onValueChange={(value) => handleInputChange('preferred_position', value)}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select your preferred position" />
                          </SelectTrigger>
                          <SelectContent>
                            {positionOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="oracle_skills">Oracle Skills & Technologies *</Label>
                        <Textarea
                          id="oracle_skills"
                          value={formData.oracle_skills}
                          onChange={(e) => handleInputChange('oracle_skills', e.target.value)}
                          placeholder="List your Oracle skills, certifications, and technologies (e.g., Oracle EBS, Fusion, PL/SQL, OIC, etc.)"
                          className="min-h-24"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Additional Information */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">Additional Information</h3>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="availability">Availability</Label>
                          <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="When can you start?" />
                            </SelectTrigger>
                            <SelectContent>
                              {availabilityOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expected_salary">Expected Salary Range</Label>
                          <Input
                            id="expected_salary"
                            type="text"
                            value={formData.expected_salary}
                            onChange={(e) => handleInputChange('expected_salary', e.target.value)}
                            placeholder="e.g., $80,000 - $100,000"
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="resume_url">Resume/CV Link</Label>
                        <Input
                          id="resume_url"
                          type="url"
                          value={formData.resume_url}
                          onChange={(e) => handleInputChange('resume_url', e.target.value)}
                          placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cover_letter">Cover Letter *</Label>
                        <Textarea
                          id="cover_letter"
                          value={formData.cover_letter}
                          onChange={(e) => handleInputChange('cover_letter', e.target.value)}
                          placeholder="Tell us about yourself, your experience, and why you'd like to join our team..."
                          className="min-h-40"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pt-8 border-t">
                    <div className="flex space-x-4">
                      {currentStep > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePrevious}
                          className="min-w-32"
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      {currentStep < 3 ? (
                        <Button
                          type="button"
                          variant="hero"
                          onClick={handleNext}
                          className="min-w-32"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          variant="hero"
                          disabled={isSubmitting}
                          className="min-w-32"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Submit Resume
                              <Send className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <DynamicFooter />
    </div>
  );
};

export default SubmitResumePage;