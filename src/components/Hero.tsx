import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Shield, Award, Users, Globe } from 'lucide-react';
import heroImage from '@/assets/hero-modern.jpg';

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay - Optimized for CLS */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Enterprise Oracle Consulting" 
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          style={{
            aspectRatio: '16/9',
            backgroundColor: '#1a1a1a'
          }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Hero Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-fade-in">
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Oracle Certified Partners</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-hero mb-6 animate-slide-up">
            Transform Your Enterprise with
            <span className="block text-button-gradient">
              Oracle Excellence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-subtitle text-white/90 max-w-2xl mx-auto mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
            Leading Oracle E-Business Suite & Fusion consulting firm delivering enterprise-grade solutions, 
            AI-enhanced implementations, and strategic business transformation for global organizations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Button 
              variant="accent" 
              size="xl"
              onClick={() => scrollToSection('contact')}
              className="hover-lift group"
            >
              Start Your Transformation
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="xl"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={() => scrollToSection('about')}
            >
              <Play className="h-5 w-5 mr-2" />
              Watch Our Story
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-3 shadow-lg backdrop-blur-sm border border-white/20">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-white/80">Global Clients</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-3 shadow-lg backdrop-blur-sm border border-white/20">
                <Award className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">15+</div>
              <div className="text-sm text-white/80">Years Experience</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-3 shadow-lg backdrop-blur-sm border border-white/20">
                <Globe className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-white/80">Countries Served</div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-3 shadow-lg backdrop-blur-sm border border-white/20">
                <Shield className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">99%</div>
              <div className="text-sm text-white/80">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Section - Hidden */}
      <div className="hidden absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-sm border-t border-white/10 py-6">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-4">Trusted by leading enterprises worldwide</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              {/* Placeholder for client logos */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-24 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white/60 text-xs font-medium">Logo {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-1 h-8 bg-white/30 rounded-full" />
      </div>
    </section>
  );
};

export default Hero;
