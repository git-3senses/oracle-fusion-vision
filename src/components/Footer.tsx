import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Youtube,
  Globe,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-primary-dark text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative container mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4">Vijay Apps Consultants</h3>
                <p className="text-white/80 leading-relaxed max-w-md">
                  Leading Oracle E-Business Suite & Fusion consulting firm delivering 
                  enterprise-grade solutions and strategic business transformation 
                  for global organizations.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-accent" />
                  <a href="mailto:Vijay@2025apps" className="text-white/80 hover:text-white transition-colors">
                    Vijay@2025apps
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-accent" />
                  <a href="mailto:Avbhaskarreddy@gmail.com" className="text-white/80 hover:text-white transition-colors">
                    Avbhaskarreddy@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-accent" />
                  <span className="text-white/80">Global 24/7 Support</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <nav className="space-y-3">
                <button 
                  onClick={() => scrollToSection('home')}
                  className="block text-white/80 hover:text-white transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="block text-white/80 hover:text-white transition-colors"
                >
                  About Us
                </button>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="block text-white/80 hover:text-white transition-colors"
                >
                  Services
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block text-white/80 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </nav>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Services</h4>
              <nav className="space-y-3">
                <a href="#" className="block text-white/80 hover:text-white transition-colors">
                  Oracle ERP Implementation
                </a>
                <a href="#" className="block text-white/80 hover:text-white transition-colors">
                  AI-Enhanced Solutions
                </a>
                <a href="#" className="block text-white/80 hover:text-white transition-colors">
                  System Customization
                </a>
                <a href="#" className="block text-white/80 hover:text-white transition-colors">
                  Managed Support
                </a>
                <a href="#" className="block text-white/80 hover:text-white transition-colors">
                  Cloud Migration
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="text-white/60 text-sm">
                © 2025 Vijay Apps Consultants. All rights reserved.
              </p>
              <p className="text-white/60 text-sm">
                Oracle Certified Gold Partner | ISO 27001 Certified
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={scrollToTop}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Back to Top
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button 
          variant="accent" 
          size="lg"
          onClick={() => scrollToSection('contact')}
          className="shadow-premium hover-lift rounded-full animate-pulse"
        >
          Book Free Consultation
        </Button>
      </div>
    </footer>
  );
};

export default Footer;