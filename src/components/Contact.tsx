import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  Upload,
  Calendar,
  Globe,
  Award,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { trackBusinessEvent } from '@/components/Analytics';

interface ContactForm {
  name: string;
  email: string;
  company: string;
  phone: string;
  serviceInterest: string;
  message: string;
  consultationRequested: boolean;
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    company: '',
    phone: '',
    serviceInterest: '',
    message: '',
    consultationRequested: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ContactForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email';
    if (!formData.message.trim()) return 'Message is required';
    return null;
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
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          phone: formData.phone || null,
          service_interest: formData.serviceInterest || null,
          message: formData.message,
          consultation_requested: formData.consultationRequested
        });

      if (error) {
        throw error;
      }

      setIsSubmitted(true);

      // Track analytics events
      trackBusinessEvent.contactFormSubmit();
      if (formData.consultationRequested) {
        trackBusinessEvent.consultationRequest();
      }
      if (formData.serviceInterest) {
        trackBusinessEvent.serviceInquiry(formData.serviceInterest);
      }

      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for your interest. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        serviceInterest: '',
        message: '',
        consultationRequested: false
      });

    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error sending your message. Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceOptions = [
    'Oracle ERP Implementation',
    'AI-Enhanced Solutions',
    'System Customization',
    'Managed Support',
    'Cloud Migration',
    'Business Intelligence',
    'Training & Consulting',
    'Other'
  ];

  if (isSubmitted) {
    return (
      <section id="contact" className="py-16 lg:py-24 bg-gradient-hero">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-success rounded-full mb-8 animate-scale-in">
              <CheckCircle className="h-12 w-12" />
            </div>

            {/* Main Success Message */}
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 animate-fade-in">
              Message Received Successfully!
            </h2>
            <p className="text-xl text-white/90 mb-12 animate-fade-in" style={{animationDelay: '0.2s'}}>
              Thank you for reaching out. Our Oracle experts will review your requirements
              and get back to you within 24 hours with a customized solution proposal.
            </p>

            {/* What Happens Next */}
            <div className="grid md:grid-cols-3 gap-8 mb-12 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Within 2 Hours</h3>
                <p className="text-sm text-white/80">
                  Confirmation email sent with your inquiry details
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Within 24 Hours</h3>
                <p className="text-sm text-white/80">
                  Detailed response from our Oracle specialists
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Next Step</h3>
                <p className="text-sm text-white/80">
                  {formData.consultationRequested ? 'Free consultation call scheduled' : 'Detailed proposal and next steps'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <Button
                variant="accent"
                size="lg"
                onClick={() => {
                  setIsSubmitted(false);
                  // Reset form data
                  setFormData({
                    name: '',
                    email: '',
                    company: '',
                    phone: '',
                    serviceInterest: '',
                    message: '',
                    consultationRequested: false
                  });
                }}
                className="hover-lift"
              >
                Send Another Message
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => window.location.href = '/services'}
              >
                Explore Our Services
              </Button>
            </div>

            {/* Contact Information */}
            <div className="mt-12 pt-8 border-t border-white/20 animate-fade-in" style={{animationDelay: '0.8s'}}>
              <p className="text-white/80 mb-4">
                Need immediate assistance? Contact us directly:
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href="mailto:vijay_adina@vijayappsconsultants.com"
                  className="flex items-center text-white hover:text-accent transition-colors"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  vijay_adina@vijayappsconsultants.com
                </a>
                <a
                  href="tel:+1234567890"
                  className="flex items-center text-white hover:text-accent transition-colors"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  +1 (234) 567-8900
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-16 lg:py-24 bg-background">{/* Reduced padding */}
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            Get In Touch
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 animate-fade-in">
            Ready to Transform Your 
            <span className="text-button-gradient"> Enterprise?</span>
          </h2>
          <p className="text-subtitle animate-fade-in" style={{animationDelay: '0.2s'}}>
            Let's discuss your Oracle implementation needs and create a customized solution 
            that drives growth and operational excellence.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Cards */}
            <div className="space-y-6">
              <div className="card-premium hover-lift">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      Send us a message anytime
                    </p>
                    <a href="mailto:vijay_adina@vijayappsconsultants.com" className="text-primary hover:text-primary-dark font-medium break-all">
                      vijay_adina@vijayappsconsultants.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="card-premium hover-lift">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      Speak with our experts
                    </p>
                    <a href="tel:+916303526930" className="text-primary hover:text-primary-dark font-medium">
                      +91 630 352 6930
                    </a>
                  </div>
                </div>
              </div>

              {/* Benefits card aligned and consistent with above */}
              <div className="card-premium hover-lift">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-feature rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="w-full">
                    <h3 className="font-semibold mb-1">Why Choose Us</h3>
                    <ul className="text-sm text-muted-foreground space-y-2 mt-2">
                      <li className="flex items-center"><Calendar className="h-4 w-4 text-primary mr-2" /> Free initial consultation</li>
                      <li className="flex items-center"><Globe className="h-4 w-4 text-primary mr-2" /> Global 24/7 support</li>
                      <li className="flex items-center"><Award className="h-4 w-4 text-primary mr-2" /> Oracle certified experts</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 min-w-0">
            <form onSubmit={handleSubmit} className="card-premium space-y-6 overflow-hidden max-w-full">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              
              {/* Name and Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
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
                    placeholder="Enter your email address"
                    className="h-12"
                    required
                  />
                </div>
              </div>

              {/* Company and Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Enter your company name"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className="h-12"
                  />
                </div>
              </div>

              {/* Service Interest */}
              <div className="space-y-2">
                <Label htmlFor="service">Service of Interest</Label>
                <Select value={formData.serviceInterest} onValueChange={(value) => handleInputChange('serviceInterest', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a service you're interested in" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us about your project requirements, timeline, and any specific questions you have..."
                  className="min-h-32 resize-none"
                  required
                />
              </div>

              {/* Consultation Checkbox */}
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="consultation" 
                  checked={formData.consultationRequested}
                  onCheckedChange={(checked) => handleInputChange('consultationRequested', !!checked)}
                />
                <div>
                  <Label htmlFor="consultation" className="font-medium">
                    Request Free Consultation
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Schedule a 30-minute consultation call with our Oracle experts
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="hero" 
                size="xl" 
                className="w-full hover-lift group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
