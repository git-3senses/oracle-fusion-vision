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
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
      <section id="contact" className="py-16 lg:py-24 bg-gradient-hero">{/* Reduced padding */}
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-success rounded-full mb-8">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Thank You for Your Interest!
            </h2>
            <p className="text-xl text-white/90 mb-8">
              We've received your message and will get back to you within 24 hours with 
              detailed information about how we can help transform your business.
            </p>
            <Button 
              variant="accent" 
              size="lg"
              onClick={() => setIsSubmitted(false)}
              className="hover-lift"
            >
              Send Another Message
            </Button>
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
            <span className="text-gradient-primary"> Enterprise?</span>
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
                    <a href="mailto:info@vijayapps.com" className="text-primary hover:text-primary-dark font-medium">
                      info@vijayapps.com
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
            </div>

            {/* Additional Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-sm">Free initial consultation</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-primary" />
                <span className="text-sm">Global 24/7 support</span>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm">Oracle certified experts</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card-premium space-y-6">
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