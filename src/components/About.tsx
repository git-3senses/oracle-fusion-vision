import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const [counters, setCounters] = useState({
    experience: 0,
    clients: 0,
    projects: 0,
    countries: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

  const finalCounts = {
    experience: 20,
    clients: 10,
    projects: 20,
    countries: 5
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
    <section id="about" className="py-16 lg:py-24 bg-background">{/* Reduced padding */}
      <div className="container mx-auto px-6 lg:px-8" ref={aboutRef}>
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            About Vijay Apps Consultants
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 animate-fade-in dark:text-gradient-muted">
            Transforming Enterprises with 
            <span className="text-button-gradient"> Oracle Excellence</span>
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
              <h3 className="text-2xl lg:text-3xl font-bold dark:text-gradient-muted">
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
                'Oracle Certified Experts with proven track record',
                'AI-enhanced implementations for future-ready solutions',
                'End-to-end support from planning to go-live and beyond',
                'Global delivery model with support capabilities'
              ].map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{point}</span>
                </div>
              ))}
            </div>

            {/* Video CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4 w-full sm:w-auto">
              <Button
                variant="premium"
                size="lg"
                onClick={() => navigate('/services')}
                className="hover-lift w-full sm:w-auto"
              >
                Explore Our Services
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => scrollToSection('about-stats')}
                className="text-primary hover:text-primary-dark w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-scale-in overflow-visible" style={{animationDelay: '0.4s'}}>
            <div className="absolute inset-0 bg-gradient-primary rounded-2xl transform rotate-3" />
            <img 
              src={teamImage} 
              alt="Our Expert Team" 
              className="relative w-full aspect-[16/10] lg:aspect-auto h-auto lg:h-[500px] object-cover rounded-2xl shadow-premium"
            />
            
            {/* Floating Cards */}
            <div className="absolute -top-6 -left-6 bg-card rounded-xl p-4 shadow-lg border border-border animate-fade-in" style={{animationDelay: '0.8s'}}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Oracle Certified</div>
                  <div className="text-xs text-muted-foreground">Experts</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-card rounded-xl p-4 shadow-lg border border-border animate-fade-in" style={{animationDelay: '1s'}}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-semibold text-sm">100% Success</div>
                  <div className="text-xs text-muted-foreground">Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Counters */}
        <div id="about-stats" className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { key: 'experience', label: 'Years Experience', icon: Target, suffix: '+' },
            { key: 'clients', label: 'Certified Experts', icon: Users, suffix: '+' },
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
              description: 'Support with teams across multiple time zones ensuring seamless project execution.',
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
