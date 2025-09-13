import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  Globe, 
  Award,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Heart
} from 'lucide-react';

const Careers = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openPositions = [
    {
      title: 'Senior Oracle ERP Consultant',
      department: 'Consulting',
      location: 'Hyderabad / Remote',
      type: 'Full-time',
      experience: '5+ years',
      skills: ['Oracle ERP', 'Fusion Cloud', 'Implementation', 'Business Analysis'],
      urgent: true
    },
    {
      title: 'Oracle Fusion Technical Lead',
      department: 'Technical',
      location: 'Bangalore / Remote',
      type: 'Full-time',
      experience: '7+ years',
      skills: ['Oracle Fusion', 'PL/SQL', 'Integration', 'Technical Architecture'],
      urgent: false
    },
    {
      title: 'AI Solutions Architect',
      department: 'Innovation',
      location: 'Remote',
      type: 'Full-time',
      experience: '6+ years',
      skills: ['AI/ML', 'Oracle Cloud', 'Python', 'Data Analytics'],
      urgent: true
    },
    {
      title: 'Oracle Support Specialist',
      department: 'Support',
      location: 'Chennai / Remote',
      type: 'Full-time',
      experience: '3+ years',
      skills: ['Oracle Support', 'Troubleshooting', 'Customer Service', 'Documentation'],
      urgent: false
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Compensation',
      description: 'Industry-leading salaries with performance bonuses and equity options'
    },
    {
      icon: GraduationCap,
      title: 'Learning & Development',
      description: 'Oracle certifications, training programs, and conference attendance'
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness programs'
    },
    {
      icon: Globe,
      title: 'Remote Flexibility',
      description: 'Hybrid work model with flexible hours and global collaboration opportunities'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Clear advancement paths with mentorship and leadership development'
    },
    {
      icon: Users,
      title: 'Inclusive Culture',
      description: 'Diverse, collaborative environment that values innovation and creativity'
    }
  ];

  const values = [
    {
      title: 'Excellence',
      description: 'We strive for the highest quality in everything we deliver'
    },
    {
      title: 'Innovation',
      description: 'We embrace new technologies and creative problem-solving'
    },
    {
      title: 'Integrity',
      description: 'We conduct business with honesty, transparency, and ethical practices'
    },
    {
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and shared success'
    }
  ];

  return (
    <section id="careers" className="py-16 lg:py-24 bg-background">{/* Reduced padding */}
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <Badge variant="outline" className="mb-4">
            Join Our Team
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 animate-fade-in">
            Build Your Career with 
            <span className="text-gradient-primary"> Oracle Experts</span>
          </h2>
          <p className="text-subtitle animate-fade-in" style={{animationDelay: '0.2s'}}>
            Join a dynamic team of Oracle professionals who are passionate about delivering 
            innovative solutions and transforming businesses worldwide.
          </p>
        </div>

        {/* Company Culture */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                Why Choose 
                <span className="text-gradient-primary"> Vijay Apps?</span>
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We're not just another consulting firm. We're a team of passionate Oracle experts 
                who believe in the power of technology to transform businesses and create meaningful impact.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="p-4 border border-border rounded-lg hover:bg-card transition-colors animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <h4 className="font-semibold mb-2 text-primary">{value.title}</h4>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Employee Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-4 p-6 card-premium hover-lift animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              Current <span className="text-gradient-primary">Opportunities</span>
            </h3>
            <p className="text-lg text-muted-foreground">
              Join our growing team and make an impact from day one
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {openPositions.map((position, index) => (
              <div 
                key={index} 
                className="relative card-premium hover-lift animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {position.urgent && (
                  <div className="absolute -top-3 left-6">
                    <Badge className="bg-gradient-accent text-white font-semibold">
                      Urgent Hiring
                    </Badge>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold mb-2">{position.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{position.department}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{position.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{position.type} • {position.experience}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {position.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full group"
                  onClick={() => scrollToSection('contact')}
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Don't see a perfect match? We're always looking for talented professionals.
            </p>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => scrollToSection('contact')}
            >
              Send Us Your Resume
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-hero rounded-2xl p-12 lg:p-16 text-white">
          <h3 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Make an Impact?
          </h3>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join our mission to transform businesses through innovative Oracle solutions. 
            Let's build the future together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="accent" 
              size="xl"
              onClick={() => scrollToSection('contact')}
              className="hover-lift"
            >
              Start Your Journey
            </Button>
            <Button 
              variant="outline" 
              size="xl"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Learn About Our Culture
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Careers;