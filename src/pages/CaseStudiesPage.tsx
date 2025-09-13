import React from 'react';
import Header from '@/components/Header';
import DynamicFooter from '@/components/DynamicFooter';
import SEOHead from '@/components/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  Building,
  BarChart3,
  Target,
  Award
} from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  metrics: {
    label: string;
    value: string;
    improvement: string;
  }[];
  duration: string;
  services: string[];
  image?: string;
}

const CaseStudiesPage = () => {
  const caseStudies: CaseStudy[] = [
    {
      id: '1',
      title: 'Global Manufacturing ERP Transformation',
      client: 'Fortune 500 Manufacturing Corp',
      industry: 'Manufacturing & Supply Chain',
      challenge: 'Legacy Oracle EBS R11 system causing operational inefficiencies, manual processes, and poor visibility across global operations. Multiple instances with inconsistent data and reporting.',
      solution: 'Complete Oracle EBS R12 upgrade and consolidation, implementing integrated financial, supply chain, and manufacturing modules with real-time analytics dashboard.',
      results: [
        'Consolidated 5 separate EBS instances into unified global system',
        'Automated 80% of manual financial processes',
        'Implemented real-time supply chain visibility',
        'Created executive dashboard with KPI tracking',
        'Established standardized business processes globally'
      ],
      metrics: [
        { label: 'Cost Reduction', value: '30%', improvement: 'in operational costs' },
        { label: 'Process Efficiency', value: '60%', improvement: 'faster reporting' },
        { label: 'Inventory Optimization', value: '25%', improvement: 'reduction in carrying costs' },
        { label: 'ROI Achievement', value: '18 months', improvement: 'payback period' }
      ],
      duration: '14 months',
      services: ['Oracle EBS Implementation', 'System Integration', 'Change Management', 'Training']
    },
    {
      id: '2',
      title: 'Cloud-First Digital Transformation',
      client: 'Technology Startup (Series B)',
      industry: 'Technology & SaaS',
      challenge: 'Rapidly scaling startup needed enterprise-grade Oracle Cloud infrastructure to support 10x growth projections while maintaining agility and cost efficiency.',
      solution: 'Oracle Fusion Cloud implementation with AI-enhanced analytics, automated workflows, and scalable architecture designed for rapid growth and international expansion.',
      results: [
        'Implemented Oracle Fusion HCM and Financials in cloud',
        'Built AI-powered forecasting and budgeting system',
        'Created automated approval workflows',
        'Established multi-currency and multi-entity support',
        'Integrated with existing SaaS tools and APIs'
      ],
      metrics: [
        { label: 'Scalability', value: '500%', improvement: 'user capacity increase' },
        { label: 'Time to Market', value: '40%', improvement: 'faster feature deployment' },
        { label: 'Operational Costs', value: '35%', improvement: 'reduction vs on-premise' },
        { label: 'Data Accuracy', value: '99.7%', improvement: 'financial reporting accuracy' }
      ],
      duration: '8 months',
      services: ['Oracle Fusion Cloud', 'AI Integration', 'API Development', 'Cloud Migration']
    },
    {
      id: '3',
      title: 'Healthcare System Integration & Compliance',
      client: 'Regional Healthcare Network',
      industry: 'Healthcare & Life Sciences',
      challenge: 'Complex healthcare network with multiple Oracle systems needed unified patient data management, regulatory compliance (HIPAA), and integrated billing across facilities.',
      solution: 'Oracle Health Sciences integration with existing EBS financials, custom patient data warehouse, and compliance-focused security implementation.',
      results: [
        'Unified patient records across 12 healthcare facilities',
        'Implemented HIPAA-compliant data governance',
        'Created integrated billing and insurance processing',
        'Built clinical analytics and reporting platform',
        'Established disaster recovery and backup systems'
      ],
      metrics: [
        { label: 'Patient Satisfaction', value: '45%', improvement: 'increase in satisfaction scores' },
        { label: 'Billing Accuracy', value: '98%', improvement: 'first-pass accuracy rate' },
        { label: 'Compliance Audit', value: '100%', improvement: 'regulatory compliance score' },
        { label: 'Data Processing', value: '70%', improvement: 'faster claims processing' }
      ],
      duration: '12 months',
      services: ['Oracle EBS Healthcare', 'Data Integration', 'Compliance Management', 'Security Implementation']
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Oracle Case Studies - Real Client Success Stories"
        description="Explore Oracle implementation case studies and success stories. See how we've helped Fortune 500 companies and startups achieve digital transformation with Oracle solutions."
        keywords="Oracle Case Studies, Oracle Success Stories, Oracle Implementation Examples, ERP Success Stories, Oracle ROI, Digital Transformation Results"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/case-studies` : ''}
      />
      <Header />

      <main className="pt-6">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-hero text-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 bg-white/10 border-white/30 text-white">
                Success Stories
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in">
                Real Results from Real
                <span className="block text-accent"> Oracle Implementations</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
                Discover how we've helped organizations across industries achieve remarkable results
                with Oracle solutions. From Fortune 500 companies to growing startups, these case studies
                showcase measurable business impact and ROI.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="text-sm text-white/80">Successful Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">99%</div>
                  <div className="text-sm text-white/80">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">$50M+</div>
                  <div className="text-sm text-white/80">Cost Savings Achieved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">15+</div>
                  <div className="text-sm text-white/80">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="space-y-20">
              {caseStudies.map((study, index) => (
                <Card key={study.id} className="card-premium">
                  <CardContent className="p-8 lg:p-12">
                    <div className="grid lg:grid-cols-3 gap-12">
                      {/* Main Content */}
                      <div className="lg:col-span-2 space-y-8">
                        {/* Header */}
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <Badge variant="secondary">{study.industry}</Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {study.duration}
                            </Badge>
                          </div>
                          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                            {study.title}
                          </h2>
                          <p className="text-lg text-muted-foreground">
                            {study.client} • {study.industry}
                          </p>
                        </div>

                        {/* Challenge */}
                        <div>
                          <h3 className="text-xl font-semibold mb-3 flex items-center">
                            <Target className="h-5 w-5 mr-2 text-destructive" />
                            Challenge
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {study.challenge}
                          </p>
                        </div>

                        {/* Solution */}
                        <div>
                          <h3 className="text-xl font-semibold mb-3 flex items-center">
                            <Building className="h-5 w-5 mr-2 text-primary" />
                            Solution
                          </h3>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            {study.solution}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {study.services.map((service, serviceIndex) => (
                              <Badge key={serviceIndex} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Results */}
                        <div>
                          <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <Award className="h-5 w-5 mr-2 text-success" />
                            Key Results
                          </h3>
                          <div className="space-y-3">
                            {study.results.map((result, resultIndex) => (
                              <div key={resultIndex} className="flex items-start space-x-3">
                                <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                                <span className="text-foreground">{result}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Metrics Sidebar */}
                      <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                          <div className="bg-gradient-primary rounded-xl p-6 text-white">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                              <BarChart3 className="h-5 w-5 mr-2" />
                              Key Metrics
                            </h3>
                            <div className="space-y-4">
                              {study.metrics.map((metric, metricIndex) => (
                                <div key={metricIndex} className="border-b border-white/20 pb-4 last:border-b-0">
                                  <div className="text-2xl font-bold mb-1">
                                    {metric.value}
                                  </div>
                                  <div className="text-sm text-white/90 font-medium">
                                    {metric.label}
                                  </div>
                                  <div className="text-xs text-white/70">
                                    {metric.improvement}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Card className="border-primary/20">
                            <CardContent className="p-6">
                              <h4 className="font-semibold mb-3">Industry Impact</h4>
                              <p className="text-sm text-muted-foreground mb-4">
                                Similar results can be achieved in your {study.industry.split(' &')[0].toLowerCase()} organization.
                              </p>
                              <Button className="w-full" onClick={() => {
                                const contactElement = document.getElementById('contact');
                                if (contactElement) {
                                  contactElement.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                  window.location.href = '/contact';
                                }
                              }}>
                                Discuss Your Project
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Create Your Success Story?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Let's discuss how we can help you achieve similar results with a customized Oracle solution
                designed for your specific business needs and objectives.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="default"
                  size="lg"
                  className="hover-lift"
                  onClick={() => window.location.href = '/contact'}
                >
                  Start Your Project
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/services'}
                >
                  View Our Services
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <DynamicFooter />
    </div>
  );
};

export default CaseStudiesPage;
