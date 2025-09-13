import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Upload,
  Settings,
  Building,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import VideoUploadOptimizer from './VideoUploadOptimizer';

interface SiteSettingData {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: string;
  description: string | null;
}

const SiteSettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, SiteSettingData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      // Convert array to object for easier access
      const settingsMap = (data || []).reduce((acc, setting) => {
        acc[setting.setting_key] = setting;
        return acc;
      }, {} as Record<string, SiteSettingData>);

      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load site settings',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string | null) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ setting_value: value })
        .eq('setting_key', key);

      if (error) throw error;

      // Update local state
      setSettings(prev => ({
        ...prev,
        [key]: { ...prev[key], setting_value: value }
      }));
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      toast({
        title: 'Success',
        description: 'Settings saved successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hero-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('hero-media')
        .getPublicUrl(fileName);

      // Update logo URL setting
      await updateSetting('logo_url', publicUrl);

      toast({
        title: 'Success',
        description: 'Logo uploaded successfully'
      });

      fetchSettings();
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload logo',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeLogo = async () => {
    try {
      await updateSetting('logo_url', null);
      toast({
        title: 'Success',
        description: 'Logo removed successfully'
      });
      fetchSettings();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove logo',
        variant: 'destructive'
      });
    }
  };

  const renderSettingInput = (key: string, setting: SiteSettingData) => {
    const value = setting.setting_value || '';

    switch (setting.setting_type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value === 'true'}
              onCheckedChange={(checked) => updateSetting(key, checked ? 'true' : 'false')}
            />
            <Label>{setting.description}</Label>
          </div>
        );

      case 'image':
        if (key === 'logo_url') {
          return (
            <div className="space-y-4">
              {value && (
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={value} 
                      alt="Current logo" 
                      className="h-16 w-auto border rounded-lg"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeLogo}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Logo
                  </Button>
                </div>
              )}
              <VideoUploadOptimizer
                onFileSelect={handleLogoUpload}
                isUploading={isUploading}
                maxSizeMB={5}
              />
            </div>
          );
        }
        return (
          <Input
            value={value}
            onChange={(e) => updateSetting(key, e.target.value)}
            placeholder="Enter image URL"
          />
        );

      default:
        if (setting.description && setting.description.includes('description')) {
          return (
            <Textarea
              value={value}
              onChange={(e) => updateSetting(key, e.target.value)}
              rows={3}
            />
          );
        }
        return (
          <Input
            value={value}
            onChange={(e) => updateSetting(key, e.target.value)}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading site settings...</div>
      </div>
    );
  }

  const companySettings = ['company_name', 'company_tagline', 'logo_url'];
  const contactSettings = ['primary_email', 'primary_phone', 'address'];
  const socialSettings = ['facebook_url', 'linkedin_url', 'twitter_url', 'youtube_url'];
  const generalSettings = ['cta_button_text', 'enable_floating_cta'];
  const seoSettings = ['meta_description', 'meta_keywords', 'google_analytics_id'];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="company" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Company</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>Contact</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Social</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>SEO</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {companySettings.map((key) => {
                const setting = settings[key];
                if (!setting) return null;

                return (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-medium">
                      {setting.description}
                    </Label>
                    {renderSettingInput(key, setting)}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {contactSettings.map((key) => {
                const setting = settings[key];
                if (!setting) return null;

                return (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-medium">
                      {setting.description}
                    </Label>
                    {renderSettingInput(key, setting)}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {socialSettings.map((key) => {
                const setting = settings[key];
                if (!setting) return null;

                return (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-medium">
                      {setting.description}
                    </Label>
                    {renderSettingInput(key, setting)}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {generalSettings.map((key) => {
                const setting = settings[key];
                if (!setting) return null;

                return (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-medium">
                      {setting.description}
                    </Label>
                    {renderSettingInput(key, setting)}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                SEO & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {seoSettings.map((key) => {
                const setting = settings[key];
                if (!setting) return null;

                return (
                  <div key={key} className="space-y-2">
                    <Label className="text-sm font-medium">
                      {setting.description}
                    </Label>
                    {renderSettingInput(key, setting)}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full"
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save All Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettingsManager;