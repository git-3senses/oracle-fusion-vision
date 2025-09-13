import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Users, 
  Globe, 
  Target, 
  CheckCircle, 
  TrendingUp,
  Database,
  Cog,
  Play
} from 'lucide-react';
import teamImage from '@/assets/team-modern.jpg';

const About = () => {
  const [counters, setCounters] = useState({
    experience: 0,
    clients: 0,
    projects: 0,
    countries: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

  const finalCounts = {
    experience: 15,
    clients: 500,
    projects: 1200,
    countries: 50
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.2 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounters({
        experience: Math.floor(finalCounts.experience * progress),
        clients: Math.floor(finalCounts.clients * progress),
        projects: Math.floor(finalCounts.projects * progress),
        countries: Math.floor(finalCounts.countries * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(finalCounts);
      }
    }, stepDuration);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-8" ref={aboutRef}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            About Vijay Apps Consultants
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 animate-fade-in">
            Transforming Enterprises with 
            <span className="text-gradient-primary"> Oracle Excellence</span>
          </h2>
          <p className="text-subtitle animate-fade-in" style={{animationDelay: '0.2s'}}>
            With over 15 years of expertise, we've helped 500+ global organizations achieve 
            digital transformation through Oracle E-Business Suite and Fusion implementations.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-6">
              <h3 className="text-2xl lg:text-3xl font-bold">
                Your Trusted Oracle Transformation Partner
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Vijay Apps Consultants stands at the forefront of Oracle consulting, 
                delivering enterprise-grade solutions that drive business growth and 
                operational excellence. Our certified team combines deep Oracle expertise 
                with industry best practices to ensure successful implementations.
              </p>
            </div>

            {/* Key Points */}
            <div className="space-y-4">
              {[
                'Oracle Certified Partners with proven track record',
                'AI-enhanced implementations for future-ready solutions',
                'End-to-end support from planning to go-live and beyond',
                'Global delivery model with 24/7 support capabilities'
              ].map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{point}</span>
                </div>
              ))}
            </div>

            {/* Video CTA */}
            <div className="flex items-center space-x-4 pt-4">
              <Button 
                variant="premium" 
                size="lg"
                onClick={() => scrollToSection('services')}
                className="hover-lift"
              >
                Explore Our Services
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                className="text-primary hover:text-primary-dark"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Our Story
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-scale-in" style={{animationDelay: '0.4s'}}>
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl transform rotate-3" />
            <img 
              src={teamImage} 
              alt="Our Expert Team" 
              className="relative w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-premium"
            />
            
            {/* Floating Cards */}
            <div className="absolute -top-6 -left-6 bg-card rounded-xl p-4 shadow-lg border border-border animate-fade-in" style={{animationDelay: '0.8s'}}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Oracle Certified</div>
                  <div className="text-xs text-muted-foreground">Gold Partner</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-card rounded-xl p-4 shadow-lg border border-border animate-fade-in" style={{animationDelay: '1s'}}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-sm">99% Success</div>
                  <div className="text-xs text-muted-foreground">Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { key: 'experience', label: 'Years Experience', icon: Target, suffix: '+' },
            { key: 'clients', label: 'Happy Clients', icon: Users, suffix: '+' },
            { key: 'projects', label: 'Projects Delivered', icon: Cog, suffix: '+' },
            { key: 'countries', label: 'Countries Served', icon: Globe, suffix: '+' }
          ].map((item, index) => (
            <div key={item.key} className="text-center card-premium hover-lift" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-xl mb-4">
                <item.icon className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {counters[item.key as keyof typeof counters]}{item.suffix}
              </div>
              <div className="text-muted-foreground font-medium">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Expertise Areas */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Database,
              title: 'Oracle ERP Excellence',
              description: 'Complete E-Business Suite and Fusion implementations with industry-specific customizations.',
              color: 'primary'
            },
            {
              icon: Cog,
              title: 'AI-Enhanced Solutions',
              description: 'Cutting-edge AI integrations to automate processes and enhance decision-making capabilities.',
              color: 'feature'
            },
            {
              icon: Globe,
              title: 'Global Delivery',
              description: '24/7 support with teams across multiple time zones ensuring seamless project execution.',
              color: 'accent'
            }
          ].map((area, index) => (
            <div key={index} className="card-premium hover-lift text-center animate-fade-in" style={{animationDelay: `${index * 0.2}s`}}>
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-${area.color} rounded-xl mb-6`}>
                <area.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">{area.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;