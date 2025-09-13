import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, Eye, EyeOff, Palette, HardDrive } from 'lucide-react';
import VideoUploadOptimizer from './VideoUploadOptimizer';
import MediaStorageManager from './MediaStorageManager';
import OptimizedVideo from './OptimizedVideo';

interface HeroBannerData {
  id: string;
  page_name: string;
  title: string;
  subtitle: string | null;
  media_type: 'image' | 'video';
  media_url: string | null;
  overlay_opacity: number;
  text_color: string;
  cta_text: string | null;
  cta_link: string | null;
}

const HeroBannerAdmin: React.FC = () => {
  const [banners, setBanners] = useState<HeroBannerData[]>([]);
  const [selectedBanner, setSelectedBanner] = useState<HeroBannerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .order('page_name');

      if (error) throw error;
      setBanners(data as HeroBannerData[] || []);
      if (data && data.length > 0) {
        setSelectedBanner(data[0] as HeroBannerData);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast({
        title: "Error",
        description: "Failed to load hero banners",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedBanner) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('hero_banners')
        .update({
          title: selectedBanner.title,
          subtitle: selectedBanner.subtitle,
          overlay_opacity: selectedBanner.overlay_opacity,
          text_color: selectedBanner.text_color,
          cta_text: selectedBanner.cta_text,
          cta_link: selectedBanner.cta_link
        })
        .eq('id', selectedBanner.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hero banner updated successfully",
      });

      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: "Error",
        description: "Failed to save hero banner",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOptimizedUpload = async (file: File) => {
    if (!selectedBanner) return;

    setIsUploading(true);
    setUploadProgress(0);

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedBanner.page_name}-${Date.now()}.${fileExt}`;
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hero-media')
        .upload(fileName, file);

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      setUploadProgress(95);

      const { data: { publicUrl } } = supabase.storage
        .from('hero-media')
        .getPublicUrl(fileName);

      const { error } = await supabase
        .from('hero_banners')
        .update({
          media_type: isVideo ? 'video' : 'image',
          media_url: publicUrl
        })
        .eq('id', selectedBanner.id);

      if (error) throw error;

      setSelectedBanner(prev => prev ? {
        ...prev,
        media_type: isVideo ? 'video' : 'image',
        media_url: publicUrl
      } : null);

      setUploadProgress(100);

      toast({
        title: "Success",
        description: "Media uploaded and optimized successfully",
      });

      fetchBanners();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload media",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading hero banner settings...</div>;
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Banner List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pages</h3>
        <div className="space-y-2">
          {banners.map((banner) => (
            <Card 
              key={banner.id}
              className={`cursor-pointer transition-colors ${
                selectedBanner?.id === banner.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedBanner(banner)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium capitalize">{banner.page_name}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {banner.title}
                    </p>
                  </div>
                  <Badge variant={banner.media_url ? 'default' : 'secondary'}>
                    {banner.media_type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Editor */}
      {selectedBanner && (
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Edit {selectedBanner.page_name.charAt(0).toUpperCase() + selectedBanner.page_name.slice(1)} Page
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>

            {previewMode ? (
            /* Preview Mode */
            <Card className="relative h-96 overflow-hidden">
              <div className="absolute inset-0">
                {selectedBanner.media_type === 'video' && selectedBanner.media_url ? (
                  <OptimizedVideo
                    src={selectedBanner.media_url}
                    className="w-full h-full"
                    autoPlay={true}
                    muted={true}
                    loop={true}
                    controls={false}
                    lazyLoad={false}
                  />
                ) : selectedBanner.media_url ? (
                  <img 
                    src={selectedBanner.media_url} 
                    alt="Hero background"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-hero" />
                )}
                
                <div 
                  className="absolute inset-0 bg-primary" 
                  style={{ opacity: selectedBanner.overlay_opacity }}
                />
              </div>
              
              <div className="relative z-10 flex items-center justify-center h-full text-center p-6">
                <div>
                  <h1 
                    className="text-2xl lg:text-4xl font-bold mb-4"
                    style={{ color: selectedBanner.text_color }}
                  >
                    {selectedBanner.title}
                  </h1>
                  {selectedBanner.subtitle && (
                    <p 
                      className="text-lg mb-6"
                      style={{ color: selectedBanner.text_color, opacity: 0.9 }}
                    >
                      {selectedBanner.subtitle}
                    </p>
                  )}
                  {selectedBanner.cta_text && (
                    <Button variant="accent">
                      {selectedBanner.cta_text}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            /* Edit Mode */
            <Tabs defaultValue="content" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                {/* Content Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={selectedBanner.title}
                        onChange={(e) => setSelectedBanner(prev => prev ? {
                          ...prev,
                          title: e.target.value
                        } : null)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="subtitle">Subtitle (optional)</Label>
                      <Textarea
                        id="subtitle"
                        value={selectedBanner.subtitle || ''}
                        onChange={(e) => setSelectedBanner(prev => prev ? {
                          ...prev,
                          subtitle: e.target.value || null
                        } : null)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cta-text">CTA Button Text</Label>
                        <Input
                          id="cta-text"
                          value={selectedBanner.cta_text || ''}
                          onChange={(e) => setSelectedBanner(prev => prev ? {
                            ...prev,
                            cta_text: e.target.value || null
                          } : null)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="cta-link">CTA Link (e.g., #contact)</Label>
                        <Input
                          id="cta-link"
                          value={selectedBanner.cta_link || ''}
                          onChange={(e) => setSelectedBanner(prev => prev ? {
                            ...prev,
                            cta_link: e.target.value || null
                          } : null)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Styling Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="h-5 w-5 mr-2" />
                      Styling
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="text-color">Text Color</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="text-color"
                            type="color"
                            value={selectedBanner.text_color}
                            onChange={(e) => setSelectedBanner(prev => prev ? {
                              ...prev,
                              text_color: e.target.value
                            } : null)}
                            className="w-16 h-10"
                          />
                          <Input
                            value={selectedBanner.text_color}
                            onChange={(e) => setSelectedBanner(prev => prev ? {
                              ...prev,
                              text_color: e.target.value
                            } : null)}
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="overlay-opacity">Overlay Opacity: {(selectedBanner.overlay_opacity * 100).toFixed(0)}%</Label>
                        <Input
                          id="overlay-opacity"
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={selectedBanner.overlay_opacity}
                          onChange={(e) => setSelectedBanner(prev => prev ? {
                            ...prev,
                            overlay_opacity: parseFloat(e.target.value)
                          } : null)}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" className="space-y-6">
                {/* Current Media Preview */}
                {selectedBanner.media_url && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Media</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                        {selectedBanner.media_type === 'video' ? (
                          <OptimizedVideo
                            src={selectedBanner.media_url}
                            className="w-full h-full"
                            autoPlay={false}
                            muted={true}
                            loop={false}
                            controls={true}
                            lazyLoad={false}
                          />
                        ) : (
                          <img 
                            src={selectedBanner.media_url} 
                            alt="Current background"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Enhanced Upload */}
                <VideoUploadOptimizer
                  onFileSelect={handleOptimizedUpload}
                  uploadProgress={uploadProgress}
                  isUploading={isUploading}
                  maxSizeMB={50}
                />
              </TabsContent>

              <TabsContent value="storage" className="space-y-6">
                <MediaStorageManager
                  bucketName="hero-media"
                  onFileSelect={(file) => {
                    const publicUrl = `https://invumsddzktxfvdfxscg.supabase.co/storage/v1/object/public/hero-media/${file.name}`;
                    const isVideo = file.metadata?.mimetype?.startsWith('video/') || false;
                    
                    setSelectedBanner(prev => prev ? {
                      ...prev,
                      media_type: isVideo ? 'video' : 'image',
                      media_url: publicUrl
                    } : null);

                    toast({
                      title: "Media selected",
                      description: "Media has been applied to the banner",
                    });
                  }}
                />
              </TabsContent>
            </Tabs>
          )}
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={selectedBanner.title}
                      onChange={(e) => setSelectedBanner(prev => prev ? {
                        ...prev,
                        title: e.target.value
                      } : null)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subtitle">Subtitle (optional)</Label>
                    <Textarea
                      id="subtitle"
                      value={selectedBanner.subtitle || ''}
                      onChange={(e) => setSelectedBanner(prev => prev ? {
                        ...prev,
                        subtitle: e.target.value || null
                      } : null)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cta-text">CTA Button Text</Label>
                      <Input
                        id="cta-text"
                        value={selectedBanner.cta_text || ''}
                        onChange={(e) => setSelectedBanner(prev => prev ? {
                          ...prev,
                          cta_text: e.target.value || null
                        } : null)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="cta-link">CTA Link (e.g., #contact)</Label>
                      <Input
                        id="cta-link"
                        value={selectedBanner.cta_link || ''}
                        onChange={(e) => setSelectedBanner(prev => prev ? {
                          ...prev,
                          cta_link: e.target.value || null
                        } : null)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Styling Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Styling
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="text-color">Text Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="text-color"
                          type="color"
                          value={selectedBanner.text_color}
                          onChange={(e) => setSelectedBanner(prev => prev ? {
                            ...prev,
                            text_color: e.target.value
                          } : null)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={selectedBanner.text_color}
                          onChange={(e) => setSelectedBanner(prev => prev ? {
                            ...prev,
                            text_color: e.target.value
                          } : null)}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="overlay-opacity">Overlay Opacity: {(selectedBanner.overlay_opacity * 100).toFixed(0)}%</Label>
                      <Input
                        id="overlay-opacity"
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={selectedBanner.overlay_opacity}
                        onChange={(e) => setSelectedBanner(prev => prev ? {
                          ...prev,
                          overlay_opacity: parseFloat(e.target.value)
                        } : null)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
        </div>
      )}
    </div>
  );
};

export default HeroBannerAdmin;