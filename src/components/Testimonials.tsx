import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  project: string;
}

const Testimonials = () => {
  const demo: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      position: 'IT Director',
      company: 'Global Manufacturing Corp',
      content: 'Vijay Apps Consultants transformed our entire Oracle EBS implementation. Their expertise in supply chain optimization helped us reduce costs by 30% while improving efficiency. The team\'s professionalism and deep Oracle knowledge made the complex migration seamless.',
      rating: 5,
      project: 'Oracle EBS R12 Implementation'
    },
    {
      id: '2',
      name: 'Michael Chen',
      position: 'CFO',
      company: 'TechStart Solutions',
      content: 'Outstanding Oracle Fusion Cloud implementation. The AI-enhanced reporting solutions they built gave us real-time insights we never had before. The ROI was evident within 6 months. Highly recommend their services.',
      rating: 5,
      project: 'Oracle Fusion Cloud Migration'
    },
    {
      id: '3',
      name: 'Amanda Rodriguez',
      position: 'VP Operations',
      company: 'Retail Dynamics Inc',
      content: 'Their managed support service is exceptional. 24/7 availability, proactive monitoring, and quick issue resolution. Since partnering with Vijay Apps, our Oracle system uptime improved to 99.9%. The team feels like an extension of our IT department.',
      rating: 5,
      project: 'Managed Oracle Support'
    },
    {
      id: '4',
      name: 'David Kim',
      position: 'CTO',
      company: 'Enterprise Logistics',
      content: 'The custom Oracle integrations they developed streamlined our entire logistics operation. Complex business requirements were understood and implemented flawlessly. Their post-implementation support has been outstanding.',
      rating: 5,
      project: 'Custom Oracle Development'
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      position: 'HR Director',
      company: 'People First Corp',
      content: 'Oracle HCM implementation was smooth and well-planned. The team provided excellent training to our staff and the system adoption was remarkable. Payroll processing time reduced by 60%.',
      rating: 5,
      project: 'Oracle HCM Implementation'
    },
    {
      id: '6',
      name: 'Robert Singh',
      position: 'IT Manager',
      company: 'Financial Services Ltd',
      content: 'Cloud migration project was executed perfectly. Zero downtime during the transition and all data integrity maintained. Their expertise in Oracle Cloud infrastructure is impressive.',
      rating: 5,
      project: 'Oracle Cloud Migration'
    }
  ];

  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('id, name, role, company, content, rating')
          .eq('is_active', true)
          .order('order_index', { ascending: true })
          .limit(3);
        if (error) throw error;
        const mapped = (data || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          position: row.role || '',
          company: row.company || '',
          content: row.content,
          rating: row.rating ?? 5,
          project: ''
        }));
        if (mapped.length > 0) setItems(mapped as Testimonial[]);
        else setItems(demo.slice(0, 3));
      } catch {
        setItems(demo.slice(0, 3));
      }
    };
    fetchTestimonials();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            Client Testimonials
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 animate-fade-in">
            Trusted by Leading
            <span className="text-button-gradient"> Organizations Worldwide</span>
          </h2>
          <p className="text-subtitle animate-fade-in" style={{animationDelay: '0.2s'}}>
            See what our clients say about their Oracle transformation journey with us.
            Real results from real businesses across various industries.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">99%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">15+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {items.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="card-premium hover-lift animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <Quote className="h-8 w-8 text-primary mb-3" />
                  <p className="text-foreground leading-relaxed mb-4">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center mb-3">
                  {renderStars(testimonial.rating)}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                      <p className="text-sm font-medium text-primary">{testimonial.company}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.project}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-hero rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Join Our Success Stories?
            </h3>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-6">
              Let's discuss how we can help transform your business with Oracle expertise.
            </p>
            <div className="flex items-center justify-center space-x-2 mb-6">
              {renderStars(5)}
              <span className="text-white/90 ml-2">Rated 4.9/5 by our clients</span>
            </div>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center px-8 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors font-semibold"
            >
              Start Your Success Story
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
