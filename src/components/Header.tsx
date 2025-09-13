import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      const settingsMap = (data || []).reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value || '';
        return acc;
      }, {} as Record<string, string>);

      setSiteSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching site settings:', error);
      // Fallback to default values
      setSiteSettings({
        company_name: 'Vijay Apps Consultants',
        company_tagline: 'Oracle E-Business Suite & Fusion Specialists',
        cta_button_text: 'Get Free Consultation'
      });
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              {siteSettings.logo_url ? (
                <img 
                  src={siteSettings.logo_url} 
                  alt={`${siteSettings.company_name} Logo`} 
                  className="h-10 w-auto lg:h-12"
                />
              ) : (
                <div className="h-10 w-16 lg:h-12 lg:w-20 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm lg:text-base">VAC</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-lg lg:text-xl font-bold text-foreground">
                {siteSettings.company_name || 'Vijay Apps Consultants'}
              </h1>
              <p className="text-xs text-muted-foreground hidden lg:block">
                {siteSettings.company_tagline || 'Oracle E-Business Suite & Fusion Specialists'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`transition-colors font-medium ${
                  location.pathname === item.path 
                    ? 'text-primary' 
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button 
              variant="premium" 
              size="lg" 
              className="hover-lift"
              onClick={() => navigate('/contact')}
            >
              {siteSettings.cta_button_text || 'Get Free Consultation'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`block text-left transition-colors font-medium py-2 ${
                    location.pathname === item.path 
                      ? 'text-primary' 
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                {item.name}
              </button>
            ))}
            <Button 
              variant="premium" 
              size="lg" 
              className="w-full hover-lift mt-4"
                onClick={() => {
                  navigate('/contact');
                  setIsMenuOpen(false);
                }}
              >
                {siteSettings.cta_button_text || 'Get Free Consultation'}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;