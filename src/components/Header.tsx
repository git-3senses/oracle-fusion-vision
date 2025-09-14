import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ThemeToggle from '@/components/ThemeToggle';
import { loadSiteSettings, onSiteSettingsUpdated } from '@/utils/settingsCache';

const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const solid = scrolled || isMenuOpen;
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchSiteSettings();
    // Listen for admin updates (localStorage broadcast)
    const off = onSiteSettingsUpdated(() => fetchSiteSettings());
    return () => off();
  }, []);

  // Toggle transparent header at top, opaque when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchSiteSettings = async () => {
    try {
      setIsLoading(true);
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
      // Fallback to cached values if available
      const cached = loadSiteSettings();
      if (cached) {
        setSiteSettings(cached);
      } else {
        // Fallback to defaults
        setSiteSettings({
          company_name: 'Vijay Apps Consultants',
          company_tagline: 'Oracle E-Business Suite & Fusion Specialists',
          cta_button_text: 'Get Free Consultation'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navItems = useMemo(() => [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' }
  ], []);

  const handleNavigation = useCallback((path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  }, [navigate]);

  return (
    <>
      {/* Skip Links for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:p-2 focus:bg-primary focus:text-primary-foreground focus:no-underline"
      >
        Skip to main content
      </a>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          solid ? 'bg-white dark:bg-black border-b border-border shadow-lg' : 'bg-transparent'
        }`}
        role="banner"
      >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div 
              className="relative cursor-pointer select-none"
              role="button"
              aria-label="Go to home"
              tabIndex={0}
              onClick={() => handleNavigation('/')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavigation('/'); }}
            >
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
              {isLoading ? (
                <>
                  <div className="h-6 lg:h-7 w-48 bg-muted rounded animate-pulse mb-1" />
                  <div className="h-3 w-64 bg-muted/60 rounded animate-pulse hidden lg:block" />
                </>
              ) : (
                <>
                  <h1 className={`hidden md:block text-lg lg:text-xl font-bold ${solid ? 'text-foreground' : 'text-white'}`}>
                    {siteSettings.company_name || 'Vijay Apps Consultants'}
                  </h1>
                  <p className={`text-xs hidden lg:block ${solid ? 'text-muted-foreground' : 'text-white/80'}`}>
                    {siteSettings.company_tagline || 'Oracle E-Business Suite & Fusion Specialists'}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`transition-colors font-medium ${
                  location.pathname === item.path
                    ? (solid ? 'text-primary' : 'text-white')
                    : (solid ? 'text-foreground hover:text-primary' : 'text-white/90 hover:text-white')
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* CTA Button & Theme Toggle */}
          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle className={solid ? 'text-foreground' : 'text-white'} />
            <Button
              variant="premium"
              size="lg"
              className={`hover-lift hover-glow ${solid ? '' : 'ring-1 ring-white/20'}`}
              onClick={() => handleNavigation('/contact')}
            >
              {siteSettings.cta_button_text || 'Get Free Consultation'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-lg hover:bg-muted transition-all duration-200 hover-scale ${
              solid ? 'text-foreground' : 'text-white'
            }`}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className={`lg:hidden py-6 border-t border-border animate-fade-in ${solid ? 'bg-white dark:bg-black' : 'bg-black/70 backdrop-blur-sm'} overflow-x-hidden px-6`}
          >
            <nav
              className="flex flex-col space-y-2 max-w-full"
              role="navigation"
              aria-label="Mobile navigation"
            >
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className={`block w-full text-left transition-all duration-200 font-medium py-3 px-4 rounded-lg ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground hover:text-primary hover:bg-muted/50'
                  }`}
                >
                {item.name}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-border/50 space-y-3">
              <div className="flex items-center justify-center">
                <ThemeToggle className={solid ? 'text-foreground' : 'text-white'} />
              </div>
              <Button
                variant="premium"
                size="lg"
                className="w-full hover-lift hover-glow"
                onClick={() => handleNavigation('/contact')}
              >
                {siteSettings.cta_button_text || 'Get Free Consultation'}
              </Button>
            </div>
            </nav>
          </div>
        )}
      </div>
    </header>
    </>
  );
});

Header.displayName = 'Header';

export default Header;
