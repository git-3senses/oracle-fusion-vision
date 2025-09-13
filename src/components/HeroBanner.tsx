import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, Play, Pause } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import OptimizedVideo from './OptimizedVideo';
import heroFallback from '@/assets/hero-modern.jpg';

interface HeroBannerProps {
  pageName: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  showUpload?: boolean;
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
  showUpload = false 
}) => {
  const [bannerData, setBannerData] = useState<HeroBannerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBannerData();
  }, [pageName]);

  const fetchBannerData = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .eq('page_name', pageName)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching banner data:', error);
        setIsLoading(false);
        return;
      }

      setBannerData(data as HeroBannerData || null);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
    if (sectionId.startsWith('#')) {
      const element = document.getElementById(sectionId.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (sectionId) {
      // If it's just a section name without #, add it
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleVideoPlayback = () => {
    const video = document.getElementById('hero-video') as HTMLVideoElement;
    if (video) {
      if (video.paused) {
        video.play();
        setIsVideoPlaying(true);
      } else {
        video.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  if (isLoading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-hero">
        <div className="animate-pulse text-white text-lg">Loading...</div>
      </section>
    );
  }

  const title = bannerData?.title || defaultTitle;
  const subtitle = bannerData?.subtitle || defaultSubtitle;
  const mediaUrl = bannerData?.media_url;
  const mediaType = bannerData?.media_type || 'image';
  const overlayOpacity = bannerData?.overlay_opacity || 0.7;
  const textColor = bannerData?.text_color || 'white';
  const ctaText = bannerData?.cta_text;
  const ctaLink = bannerData?.cta_link;

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
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
            onLoadStart={() => console.log('Hero video loading started for:', mediaUrl)}
            onLoadEnd={() => console.log('Hero video loaded for:', mediaUrl)}
            onError={(error) => console.error('Hero video error:', error, 'URL:', mediaUrl)}
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
          className="absolute inset-0 bg-primary" 
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

      {/* Video Controls */}
      {mediaType === 'video' && mediaUrl && (
        <button
          onClick={toggleVideoPlayback}
          className="absolute bottom-6 left-6 z-20 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          {isVideoPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
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
              className="text-lg lg:text-xl max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up"
              style={{ color: textColor, opacity: 0.9, animationDelay: '0.2s' }}
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

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-1 h-8 bg-white/30 rounded-full" />
      </div>
    </section>
  );
};

export default HeroBanner;