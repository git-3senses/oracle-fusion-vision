import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

interface FooterContentData {
  id: string;
  section_type: string;
  title: string | null;
  content: string | null;
  link_url: string | null;
  link_text: string | null;
  icon_name: string | null;
  order_index: number;
  is_active: boolean;
}

const DynamicFooter = () => {
  const [footerContent, setFooterContent] = useState<Record<string, FooterContentData[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFooterContent();
  }, []);

  const fetchFooterContent = async () => {
    try {
      const { data, error } = await supabase
        .from('footer_content')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;

      // Group content by section type
      const grouped = (data || []).reduce((acc, item) => {
        if (!acc[item.section_type]) {
          acc[item.section_type] = [];
        }
        acc[item.section_type].push(item);
        return acc;
      }, {} as Record<string, FooterContentData[]>);

      setFooterContent(grouped);
    } catch (error) {
      console.error('Error fetching footer content:', error);
      // Fallback to default content if database fails
      setFooterContent({});
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith('#')) {
      const element = document.getElementById(sectionId.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getIconComponent = (iconName: string | null) => {
    switch (iconName) {
      case 'mail': return <Mail className="h-5 w-5 text-accent" />;
      case 'phone': return <Phone className="h-5 w-5 text-accent" />;
      case 'map-pin': return <MapPin className="h-5 w-5 text-accent" />;
      case 'linkedin': return <Linkedin className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'youtube': return <Youtube className="h-5 w-5" />;
      case 'globe': return <Globe className="h-5 w-5 text-accent" />;
      default: return null;
    }
  };

  const renderSection = (sectionType: string, items: FooterContentData[]) => {
    if (!items || items.length === 0) return null;

    switch (sectionType) {
      case 'company_info':
        const companyInfo = items[0];
        return (
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                {companyInfo.title || 'Vijay Apps Consultants'}
              </h3>
              <p className="text-white/80 leading-relaxed max-w-md">
                {companyInfo.content || 'Leading Oracle consulting firm.'}
              </p>
            </div>
          </div>
        );

      case 'contact_info':
        return (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                {getIconComponent(item.icon_name)}
                {item.link_url ? (
                  <a 
                    href={item.link_url} 
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {item.content}
                  </a>
                ) : (
                  <span className="text-white/80">{item.content}</span>
                )}
              </div>
            ))}
          </div>
        );

      case 'social_links':
        return (
          <div className="flex items-center space-x-4">
            {items.map((item) => (
              <a 
                key={item.id}
                href={item.link_url || '#'} 
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
              >
                {getIconComponent(item.icon_name)}
              </a>
            ))}
          </div>
        );

      case 'quick_links':
      case 'services':
        const title = sectionType === 'quick_links' ? 'Quick Links' : 'Services';
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">{title}</h4>
            <nav className="space-y-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => item.link_url && scrollToSection(item.link_url)}
                  className="block text-white/80 hover:text-white transition-colors text-left"
                >
                  {item.title || item.content}
                </button>
              ))}
            </nav>
          </div>
        );

      case 'legal':
        const copyrightItem = items.find(item => item.title === 'Copyright');
        const certificationItem = items.find(item => item.title === 'Certifications');
        const otherLegalItems = items.filter(item => 
          item.title !== 'Copyright' && item.title !== 'Certifications'
        );

        return (
          <div className="border-t border-white/10 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
              <div className="text-center lg:text-left">
                {copyrightItem && (
                  <p className="text-white/60 text-sm">
                    {copyrightItem.content}
                  </p>
                )}
                {certificationItem && (
                  <p className="text-white/60 text-sm">
                    {certificationItem.content}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-6">
                {otherLegalItems.map((item) => (
                  <a 
                    key={item.id}
                    href={item.link_url || '#'} 
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {item.title || item.content}
                  </a>
                ))}
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
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <footer className="bg-primary-dark text-white">
        <div className="container mx-auto px-6 lg:px-8 py-16">
          <div className="text-center">Loading footer...</div>
        </div>
      </footer>
    );
  }

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
            {footerContent.company_info && renderSection('company_info', footerContent.company_info)}
            
            {/* Contact Info */}
            {footerContent.contact_info && (
              <div className="lg:col-span-2">
                {renderSection('contact_info', footerContent.contact_info)}
                
                {/* Social Links */}
                {footerContent.social_links && (
                  <div className="mt-6">
                    {renderSection('social_links', footerContent.social_links)}
                  </div>
                )}
              </div>
            )}

            {/* Quick Links */}
            {footerContent.quick_links && renderSection('quick_links', footerContent.quick_links)}

            {/* Services */}
            {footerContent.services && renderSection('services', footerContent.services)}
          </div>
        </div>

        {/* Bottom Footer */}
        {footerContent.legal && renderSection('legal', footerContent.legal)}
      </div>

      {/* Floating CTA Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button 
          variant="accent" 
          size="lg"
          onClick={() => scrollToSection('#contact')}
          className="shadow-premium hover-lift rounded-full"
        >
          Book Free Consultation
        </Button>
      </div>
    </footer>
  );
};

export default DynamicFooter;