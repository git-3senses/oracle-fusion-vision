import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Facebook,
  Globe,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { loadSiteSettings, onSiteSettingsUpdated } from '@/utils/settingsCache';

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
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchFooterContent();
    fetchLogoUrl();
    const off = onSiteSettingsUpdated(fetchLogoUrl);
    return () => off();
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

      // Add default Quick Links when none are configured
      const withDefaults = { ...grouped } as Record<string, FooterContentData[]>;
      if (!withDefaults.quick_links || withDefaults.quick_links.length === 0) {
        withDefaults.quick_links = [
          { id: 'ql-home', section_type: 'quick_links', title: 'Home', content: null, link_url: '/', link_text: null, icon_name: null, order_index: 0, is_active: true },
          { id: 'ql-about', section_type: 'quick_links', title: 'About Us', content: null, link_url: '/about', link_text: null, icon_name: null, order_index: 1, is_active: true },
          { id: 'ql-services', section_type: 'quick_links', title: 'Services', content: null, link_url: '/services', link_text: null, icon_name: null, order_index: 2, is_active: true },
          { id: 'ql-careers', section_type: 'quick_links', title: 'Careers', content: null, link_url: '/careers', link_text: null, icon_name: null, order_index: 3, is_active: true },
          { id: 'ql-contact', section_type: 'quick_links', title: 'Contact', content: null, link_url: '/contact', link_text: null, icon_name: null, order_index: 4, is_active: true },
        ];
      }

      setFooterContent(withDefaults);
    } catch (error) {
      console.error('Error fetching footer content:', error);
      setFooterContent({});
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogoUrl = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'logo_url')
        .single();

      if (data?.setting_value) {
        setLogoUrl(data.setting_value);
      }
    } catch (error) {
      const cached = loadSiteSettings();
      if (cached?.logo_url) setLogoUrl(cached.logo_url);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkNavigation = (rawUrl: string | null) => {
    if (!rawUrl) return;
    const url = rawUrl.trim();

    // External links
    if (/^https?:\/\//i.test(url)) {
      window.open(url, '_blank');
      return;
    }

    // Hash or plain section id
    if (url.startsWith('#') || !url.startsWith('/')) {
      const id = url.startsWith('#') ? url.substring(1) : url;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      // Navigate to home with hash and attempt scroll after render
      const target = `/#${id}`;
      if (location.pathname !== '/') {
        navigate(target);
        setTimeout(() => {
          const elAfter = document.getElementById(id);
          if (elAfter) elAfter.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        return;
      }
      window.location.hash = `#${id}`;
      return;
    }

    // Internal route path
    if (url.startsWith('/')) {
      navigate(url);
    }
  };

  const getIconComponent = (iconName: string | null) => {
    switch (iconName) {
      case 'mail': return <Mail className="h-5 w-5 text-white" />;
      case 'phone': return <Phone className="h-5 w-5 text-white" />;
      case 'map-pin': return <MapPin className="h-5 w-5 text-white" />;
      case 'linkedin': return <Linkedin className="h-5 w-5" />;
      case 'facebook': return <Facebook className="h-5 w-5" />;
      case 'globe': return <Globe className="h-5 w-5 text-white" />;
      default: return null;
    }
  };

  const renderSection = (sectionType: string, items: FooterContentData[]) => {
    if (!items || items.length === 0) return null;

    switch (sectionType) {
      case 'company_info':
        // Skip rendering company info section as requested
        return null;

      case 'contact_info':
        return (
          <div className="space-y-6">
            {/* Logo above contact info */}
            {logoUrl && (
              <div className="mb-6">
                <img 
                  src={logoUrl} 
                  alt="Company Logo" 
                  className="h-12 w-auto"
                />
              </div>
            )}
            
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
          </div>
        );

      case 'social_links':
        return (
          <div className="flex items-center space-x-4">
            <a 
              href="https://linkedin.com" 
              className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://facebook.com" 
              className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
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
                  onClick={() => handleLinkNavigation(item.link_url || (item.title ? `#${(item.title || '').toLowerCase().replace(/\s+/g, '-')}` : null))}
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
                {otherLegalItems.map((item) => {
                  const title = item.title || item.content || '';
                  let href = item.link_url || '#';
                  if (!item.link_url && title) {
                    const t = title.toLowerCase();
                    if (t.includes('privacy')) href = '/privacy';
                    if (t.includes('terms')) href = '/terms';
                  }
                  return (
                    <a 
                      key={item.id}
                      href={href}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {title}
                    </a>
                  );
                })}
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
    <footer className="bg-primary-dark dark:bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative container mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
            {/* Contact Info with Logo */}
            {footerContent.contact_info && (
              <div className="flex-shrink-0">
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
            {footerContent.quick_links && (
              <div className="flex-shrink-0">
                {renderSection('quick_links', footerContent.quick_links)}
              </div>
            )}

            {/* Services */}
            {footerContent.services && (
              <div className="flex-shrink-0">
                {renderSection('services', footerContent.services)}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Footer */}
        {footerContent.legal && renderSection('legal', footerContent.legal)}
      </div>

    </footer>
  );
};

export default DynamicFooter;
