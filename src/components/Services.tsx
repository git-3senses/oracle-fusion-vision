import React, { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Database,
  Settings,
  Brain,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle,
  Layers,
  BarChart3,
  Workflow,
  Cloud,
  Shield
} from 'lucide-react';
import { trackBusinessEvent } from '@/components/Analytics';
import oracleImage from '@/assets/oracle-modern.jpg';

// Move static data outside component to prevent re-creation
const CORE_SERVICES = [
    {
      icon: Database,
      title: 'Oracle ERP Implementation',
      description: 'Complete E-Business Suite and Fusion Cloud implementations tailored to your business needs.',
      features: [
        'End-to-end implementation strategy',
        'Business process optimization',
        'Data migration and integration',
        'User training and adoption'
      ],
      color: 'primary',
      popular: true
    },
    {
      icon: Brain,
      title: 'AI-Enhanced Solutions',
      description: 'Leverage artificial intelligence to automate processes and enhance Oracle system capabilities.',
      features: [
        'Intelligent automation workflows',
        'Predictive analytics integration',
        'Machine learning models',
        'Advanced reporting dashboards'
      ],
      color: 'feature',
      popular: false
    },
    {
      icon: Settings,
      title: 'System Customization',
      description: 'Customize Oracle applications to match your unique business requirements and workflows.',
      features: [
        'Custom module development',
        'Workflow configuration',
        'Report customization',
        'Interface modifications'
      ],
      color: 'accent',
      popular: false
    },
    {
      icon: Shield,
      title: 'Managed Support',
      description: '24/7 ongoing support and maintenance to keep your Oracle systems running smoothly.',
      features: [
        'Proactive system monitoring',
        'Performance optimization',
        'Security updates and patches',
        'Help desk support'
      ],
      color: 'success',
      popular: false
    }
  ];

const SPECIALIZATIONS = [
    {
      icon: BarChart3,
      title: 'Financial Management',
      description: 'Complete financial suite implementation including GL, AP, AR, and advanced financial reporting.'
    },
    {
      icon: Layers,
      title: 'Supply Chain Excellence',
      description: 'End-to-end supply chain optimization with inventory, procurement, and manufacturing modules.'
    },
    {
      icon: Users,
      title: 'Human Capital Management',
      description: 'Comprehensive HCM solutions covering HR, payroll, talent management, and workforce analytics.'
    },
    {
      icon: Cloud,
      title: 'Cloud Migration',
      description: 'Seamless migration from on-premise to Oracle Cloud with minimal business disruption.'
    },
    {
      icon: Workflow,
      title: 'Business Intelligence',
      description: 'Advanced analytics and reporting solutions to drive data-driven decision making.'
    },
    {
      icon: TrendingUp,
      title: 'Digital Transformation',
      description: 'Strategic business transformation using Oracle technologies to improve efficiency and growth.'
    }
  ];

const Services = memo(() => {
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section id="services" className="py-16 lg:py-24 bg-muted/30" role="region" aria-labelledby="services-heading">{/* Reduced padding */}
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <Badge variant="outline" className="mb-4">
            Our Services
          </Badge>
          <h2 id="services-heading" className="text-3xl lg:text-5xl font-bold mb-6 animate-fade-in">
            Comprehensive Oracle Solutions for
            <span className="text-button-gradient"> Enterprise Success</span>
          </h2>
          <p className="text-subtitle animate-fade-in" style={{animationDelay: '0.2s'}}>
            From implementation to optimization, we provide end-to-end Oracle consulting services 
            that transform your business operations and drive sustainable growth.
          </p>
        </div>

        {/* Core Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {CORE_SERVICES.map((service, index) => (
            <div 
              key={index} 
              className="relative card-premium hover-lift animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {service.popular && (
                <div className="absolute -top-3 left-6">
                  <Badge className="bg-gradient-accent text-accent-foreground font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <div className="flex items-start space-x-4 mb-6">
                <div className={`flex-shrink-0 w-14 h-14 ${service.color === 'primary' ? 'bg-gradient-primary' :
                  service.color === 'feature' ? 'bg-gradient-feature' :
                  service.color === 'accent' ? 'bg-gradient-accent' :
                  service.color === 'success' ? 'bg-gradient-success' :
                  'bg-gradient-primary'} rounded-xl flex items-center justify-center shadow-lg`}>
                  <service.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                className="w-full group"
                onClick={() => scrollToSection('contact')}
              >
                Learn More
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          ))}
        </div>

        {/* Specializations Section */}
        <div className="relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <Badge variant="outline" className="mb-4">
                  Industry Specializations
                </Badge>
                <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                  Deep Expertise Across 
                  <span className="text-button-gradient"> Business Functions</span>
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our specialized teams bring deep functional expertise across all major Oracle 
                  modules, ensuring best practices and industry-specific solutions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {SPECIALIZATIONS.map((spec, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-card transition-colors animate-fade-in"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <spec.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{spec.title}</h4>
                      <p className="text-sm text-muted-foreground">{spec.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                variant="premium" 
                size="lg"
                onClick={() => scrollToSection('contact')}
                className="hover-lift"
              >
                Discuss Your Requirements
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            {/* Image */}
            <div className="relative animate-scale-in overflow-hidden" style={{animationDelay: '0.6s'}}>
              <div className="absolute inset-0 bg-gradient-feature rounded-2xl transform -rotate-3" />
              <img 
                src={oracleImage} 
                alt="Oracle Dashboard Analytics" 
                className="relative w-full h-96 lg:h-[600px] object-cover rounded-2xl shadow-premium"
              />
              
              {/* Floating Success Metrics */}
              <div className="absolute top-6 left-6 bg-card rounded-xl p-4 shadow-lg border border-border animate-fade-in" style={{animationDelay: '1s'}}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99%</div>
                  <div className="text-xs text-muted-foreground">Implementation Success</div>
                </div>
              </div>

              <div className="absolute bottom-6 right-6 bg-card rounded-xl p-4 shadow-lg border border-border animate-fade-in" style={{animationDelay: '1.2s'}}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">40%</div>
                  <div className="text-xs text-muted-foreground">Average Efficiency Gain</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-hero rounded-2xl p-12 lg:p-16 text-white">
          <h3 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h3>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Let's discuss how our Oracle expertise can drive your digital transformation 
            and unlock new opportunities for growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="accent" 
              size="xl"
              onClick={() => scrollToSection('contact')}
              className="hover-lift"
            >
              Schedule Free Consultation
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => trackBusinessEvent.downloadBrochure()}
            >
              Download Service Brochure
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

Services.displayName = 'Services';

export default Services;
