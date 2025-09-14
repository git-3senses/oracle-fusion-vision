import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import OptimizedVideo from './OptimizedVideo';
import heroFallback from '@/assets/hero-modern.jpg';
import { useTheme } from '@/contexts/ThemeContext';
import { loadSiteSettings, onSiteSettingsUpdated } from '@/utils/settingsCache';
import { loadBanner, onBannerUpdated } from '@/utils/bannerCache';

interface HeroBannerProps {
  pageName: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  showUpload?: boolean;
  defaultCtaText?: string;
  defaultCtaLink?: string;
}

interface HeroBannerData {
  id: string;
  title: string;
  subtitle: string | null;
  media_type: 'image' | 'video';
  media_url: string | null;
  overlay_opacity: number;
  text_color: string;
  cta_text: string | null;
  cta_link: string | null;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ 
  pageName, 
  defaultTitle = "Welcome", 
  defaultSubtitle = "", 
  showUpload = false,
  defaultCtaText,
  defaultCtaLink,
}) => {
  const [bannerData, setBannerData] = useState<HeroBannerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [defaultOverlay, setDefaultOverlay] = useState<number>(0.7);
  const [defaultTextColor, setDefaultTextColor] = useState<string>('white');
  const { applyTemporaryTheme } = useTheme();

  useEffect(() => {
    fetchBannerData();
    // Fetch hero defaults from site settings
    (async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['hero_default_overlay_opacity','hero_default_text_color']);
        const map = new Map<string, string>();
        (data || []).forEach((row: any) => map.set(row.setting_key, row.setting_value));
        const op = parseFloat(map.get('hero_default_overlay_opacity') || '0.7');
        if (!Number.isNaN(op)) setDefaultOverlay(Math.min(1, Math.max(0, op)));
        const col = map.get('hero_default_text_color');
        if (col) setDefaultTextColor(col);
      } catch {
        const cached = loadSiteSettings();
        if (cached) {
          const op = parseFloat(cached['hero_default_overlay_opacity'] || '0.7');
          if (!Number.isNaN(op)) setDefaultOverlay(Math.min(1, Math.max(0, op)));
          const col = cached['hero_default_text_color'];
          if (col) setDefaultTextColor(col);
        }
      }
    })();
    // Fetch per-page theme override
    (async () => {
      try {
        const key = `page_theme_${pageName}`;
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', key)
          .maybeSingle();
        if (error) {
          // Non-fatal; just don't override theme
          applyTemporaryTheme(null);
          return;
        }
        const val = (data?.setting_value || '').toLowerCase();
        if (val === 'light' || val === 'dark') {
          applyTemporaryTheme(val as 'light' | 'dark');
        } else {
          applyTemporaryTheme(null);
        }
      } catch {
        // Try cache
        const cached = loadSiteSettings();
        const key = `page_theme_${pageName}`;
        const val = (cached?.[key] || '').toLowerCase();
        if (val === 'light' || val === 'dark') applyTemporaryTheme(val as any);
        else applyTemporaryTheme(null);
      }
    })();
    // Clear override on unmount
    return () => applyTemporaryTheme(null);
  }, [pageName]);

  // React to admin updates
  useEffect(() => {
    const off = onSiteSettingsUpdated(() => {
      const cached = loadSiteSettings();
      if (cached) {
        const op = parseFloat(cached['hero_default_overlay_opacity'] || `${defaultOverlay}`);
        if (!Number.isNaN(op)) setDefaultOverlay(Math.min(1, Math.max(0, op)));
        const col = cached['hero_default_text_color'];
        if (col) setDefaultTextColor(col);
      }
    });
    return () => off();
  }, [defaultOverlay]);

  const fetchBannerData = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .eq('page_name', pageName)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching banner data:', error);
        // Try cache fallback
        const cached = loadBanner(pageName);
        if (cached) {
          setBannerData({
            id: 'cached',
            title: cached.title,
            subtitle: cached.subtitle,
            media_type: cached.media_type,
            media_url: cached.media_url,
            overlay_opacity: cached.overlay_opacity,
            text_color: cached.text_color,
            cta_text: cached.cta_text,
            cta_link: cached.cta_link,
          } as any);
          setIsLoading(false);
          return;
        }
        setIsLoading(false);
        return;
      }

      setBannerData(data as HeroBannerData || null);
    } catch (err) {
      console.error('Error:', err);
      const cached = loadBanner(pageName);
      if (cached) {
        setBannerData({
          id: 'cached',
          title: cached.title,
          subtitle: cached.subtitle,
          media_type: cached.media_type,
          media_url: cached.media_url,
          overlay_opacity: cached.overlay_opacity,
          text_color: cached.text_color,
          cta_text: cached.cta_text,
          cta_link: cached.cta_link,
        } as any);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for banner updates from Admin
  useEffect(() => {
    const off = onBannerUpdated(pageName, fetchBannerData);
    return () => off();
  }, [pageName]);

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    if (!isVideo && !isImage) {
      toast({
        title: "Invalid file type",
        description: "Please select an image or video file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file under 50MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${pageName}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hero-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('hero-media')
        .getPublicUrl(fileName);

      // Update or create banner data
      const updateData = {
        page_name: pageName,
        title: bannerData?.title || defaultTitle,
        subtitle: bannerData?.subtitle || defaultSubtitle,
        media_type: isVideo ? 'video' as const : 'image' as const,
        media_url: publicUrl,
        overlay_opacity: bannerData?.overlay_opacity || 0.7,
        text_color: bannerData?.text_color || 'white',
        cta_text: bannerData?.cta_text,
        cta_link: bannerData?.cta_link
      };

      const { data, error } = await supabase
        .from('hero_banners')
        .upsert(updateData, { onConflict: 'page_name' })
        .select()
        .single();

      if (error) throw error;

      setBannerData(data as HeroBannerData);
      toast({
        title: "Media uploaded successfully",
        description: `${isVideo ? 'Video' : 'Image'} has been set as hero banner`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    console.log('Home page - Scrolling to section:', sectionId);

    let targetId = sectionId;
    if (sectionId.startsWith('#')) {
      targetId = sectionId.substring(1);
    }

    const element = document.getElementById(targetId);
    console.log('Home page - Found element:', element);

    if (element) {
      // Account for fixed header height
      const headerHeight = 80; // Approximate header height
      const elementPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    } else {
      console.log('Home page - Element not found for ID:', targetId);
    }
  };


  if (isLoading) {
    return (
      <section className="relative min-h-[70vh] sm:min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="animate-pulse text-white text-lg">Loading...</div>
      </section>
    );
  }

  const title = bannerData?.title || defaultTitle;
  const subtitle = bannerData?.subtitle || defaultSubtitle;
  const mediaUrl = bannerData?.media_url;
  const mediaType = bannerData?.media_type || 'image';
  const overlayOpacity = (bannerData?.overlay_opacity ?? defaultOverlay);
  const textColor = bannerData?.text_color || defaultTextColor;
  const ctaText = bannerData?.cta_text ?? defaultCtaText ?? undefined;
  const ctaLink = bannerData?.cta_link ?? defaultCtaLink ?? undefined;

  return (
    <section className="relative min-h-[70vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 overflow-hidden">
        {mediaType === 'video' && mediaUrl ? (
          <OptimizedVideo
            src={mediaUrl}
            poster={heroFallback}
            alt={`${pageName} hero background video`}
            className="w-full h-full"
            autoPlay={true}
            muted={true}
            loop={true}
            controls={false}
            lazyLoad={false}
            onLoadStart={() => { if (import.meta.env.DEV) console.log('Hero video loading started for:', mediaUrl); }}
            onLoadEnd={() => { if (import.meta.env.DEV) console.log('Hero video loaded for:', mediaUrl); }}
            onError={(error) => { if (import.meta.env.DEV) console.error('Hero video error:', error, 'URL:', mediaUrl); }}
          />
        ) : (
          <img 
            src={mediaUrl || heroFallback} 
            alt={`${pageName} hero background`}
            className="w-full h-full object-cover"
            loading="eager"
          />
        )}
        
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-primary dark:bg-black"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* Upload Overlay for Admin */}
      {showUpload && (
        <div className="absolute top-4 right-4 z-20">
          <label className="inline-flex items-center px-4 py-2 bg-black/50 text-white rounded-lg cursor-pointer hover:bg-black/70 transition-colors">
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Media'}
            <input 
              type="file" 
              accept="image/*,video/*" 
              onChange={handleMediaUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>
      )}


      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 
            className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in"
            style={{ color: textColor }}
          >
            {title}
          </h1>
          
          {subtitle && (
            <p
              className="text-lg lg:text-xl max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up font-light text-white/80"
              style={{ animationDelay: '0.2s' }}
            >
              {subtitle}
            </p>
          )}

          {ctaText && ctaLink && (
            <div className="animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <Button 
                variant="accent" 
                size="xl"
                onClick={() => scrollToSection(ctaLink)}
                className="hover-lift group"
              >
                {ctaText}
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </div>
      </div>

    </section>
  );
};

export default HeroBanner;
