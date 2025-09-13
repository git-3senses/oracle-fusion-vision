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
import { saveSiteSettings } from '@/utils/settingsCache';
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
  const [failedKeys, setFailedKeys] = useState<Set<string>>(new Set());
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
      // Cache for public pages fallback and instant reflection
      const compact: Record<string, string> = {};
      Object.values(settingsMap).forEach((row) => {
        if (row.setting_value != null) compact[row.setting_key] = row.setting_value;
      });
      saveSiteSettings(compact);
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
    // Optimistic local update so controls feel responsive
    const prev = settings[key];
    const exists = !!prev;
    const nextRow = exists
      ? { ...prev, setting_value: value }
      : { id: key as any, setting_key: key, setting_value: value, setting_type: 'text' as const, description: key.replace(/_/g, ' ') } as any;
    setSettings(prevMap => ({ ...prevMap, [key]: nextRow }));

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: key,
          setting_value: value,
          setting_type: 'text',
          description: key.replace(/_/g, ' '),
        }, { onConflict: 'setting_key' });
      if (error) throw error;
      // Update cache and broadcast change
      const compact: Record<string, string> = {};
      Object.entries(settings).forEach(([k, v]) => {
        if (v?.setting_value != null) compact[k] = v.setting_value as string;
      });
      if (value != null) compact[key] = value;
      saveSiteSettings(compact);
      setFailedKeys(prev => {
        const n = new Set(prev);
        n.delete(key);
        return n;
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      // Revert optimistic change and notify admin that server write failed
      setSettings(prevMap => ({ ...prevMap, ...(prev ? { [key]: prev } : (() => { const { [key]: _, ...rest } = prevMap; return rest; })()) } as any));
      setFailedKeys(prev => new Set(prev).add(key));
      toast({ title: 'Error', description: 'Failed to update setting on server. Please check Supabase policies.', variant: 'destructive' });
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

  // Sync selected site settings into footer_content table
  const syncFooterFromSettings = async () => {
    const get = (k: string) => settings[k]?.setting_value || '';
    try {
      // Build payloads from settings
      const rows: any[] = [];

      // Company info
      if (get('company_name') || get('company_tagline')) {
        rows.push({
          section_type: 'company_info',
          title: get('company_name') || 'Company',
          content: get('company_tagline') || null,
          link_url: null,
          link_text: null,
          icon_name: null,
          order_index: 0,
          is_active: true,
        });
      }

      // Contact info
      const email = get('primary_email');
      const phone = get('primary_phone');
      const address = get('address');
      let contactIndex = 0;
      if (email) rows.push({ section_type: 'contact_info', title: 'Email', content: email, link_url: `mailto:${email}` , link_text: email, icon_name: 'mail', order_index: contactIndex++, is_active: true });
      if (phone) rows.push({ section_type: 'contact_info', title: 'Phone', content: phone, link_url: `tel:${phone}` , link_text: phone, icon_name: 'phone', order_index: contactIndex++, is_active: true });
      if (address) rows.push({ section_type: 'contact_info', title: 'Address', content: address, link_url: null , link_text: null, icon_name: 'map-pin', order_index: contactIndex++, is_active: true });

      // Social links
      const linkedin = get('linkedin_url');
      const twitter = get('twitter_url');
      const youtube = get('youtube_url');
      let socialIndex = 0;
      if (linkedin) rows.push({ section_type: 'social_links', title: 'LinkedIn', content: null, link_url: linkedin, link_text: 'LinkedIn', icon_name: 'linkedin', order_index: socialIndex++, is_active: true });
      if (twitter) rows.push({ section_type: 'social_links', title: 'Twitter', content: null, link_url: twitter, link_text: 'Twitter', icon_name: 'twitter', order_index: socialIndex++, is_active: true });
      if (youtube) rows.push({ section_type: 'social_links', title: 'YouTube', content: null, link_url: youtube, link_text: 'YouTube', icon_name: 'youtube', order_index: socialIndex++, is_active: true });

      // Legal
      const copyright = get('footer_copyright_text') || `© ${new Date().getFullYear()} ${get('company_name')}`;
      const certifications = get('footer_certifications_text');
      const privacy = get('footer_privacy_url');
      const terms = get('footer_terms_url');
      let legalIndex = 0;
      if (copyright)
        rows.push({ section_type: 'legal', title: 'Copyright', content: copyright, link_url: null, link_text: null, icon_name: null, order_index: legalIndex++, is_active: true });
      if (certifications)
        rows.push({ section_type: 'legal', title: 'Certifications', content: certifications, link_url: null, link_text: null, icon_name: null, order_index: legalIndex++, is_active: true });
      if (privacy)
        rows.push({ section_type: 'legal', title: 'Privacy Policy', content: '#', link_url: privacy, link_text: 'Privacy Policy', icon_name: null, order_index: legalIndex++, is_active: true });
      if (terms)
        rows.push({ section_type: 'legal', title: 'Terms of Service', content: '#', link_url: terms, link_text: 'Terms of Service', icon_name: null, order_index: legalIndex++, is_active: true });

      // Replace existing content for managed sections
      const { error: delError } = await supabase
        .from('footer_content')
        .delete()
        .in('section_type', ['company_info','contact_info','social_links','legal']);
      if (delError) throw delError;

      if (rows.length > 0) {
        const { error: insError } = await supabase
          .from('footer_content')
          .insert(rows);
        if (insError) throw insError;
      }

      toast({ title: 'Footer updated', description: 'Footer content synced from Site Settings.' });
    } catch (error) {
      console.error('Error syncing footer:', error);
      toast({ title: 'Error', description: 'Failed to update footer content', variant: 'destructive' });
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
        <TabsList className="grid w-full grid-cols-7">
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
          <TabsTrigger value="footer" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Footer</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>SEO</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Appearance</span>
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

        <TabsContent value="footer">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Footer Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Copyright Text</Label>
                  <Textarea
                    value={settings['footer_copyright_text']?.setting_value || ''}
                    onChange={(e) => updateSetting('footer_copyright_text', e.target.value)}
                    rows={3}
                    placeholder={`© ${new Date().getFullYear()} ${settings['company_name']?.setting_value || 'Your Company'}`}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Certifications Text</Label>
                  <Textarea
                    value={settings['footer_certifications_text']?.setting_value || ''}
                    onChange={(e) => updateSetting('footer_certifications_text', e.target.value)}
                    rows={3}
                    placeholder="ISO 27001 | SOC 2 | Oracle Partner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Privacy Policy URL</Label>
                  <Input
                    value={settings['footer_privacy_url']?.setting_value || ''}
                    onChange={(e) => updateSetting('footer_privacy_url', e.target.value)}
                    placeholder="/privacy-policy or https://..."
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Terms of Service URL</Label>
                  <Input
                    value={settings['footer_terms_url']?.setting_value || ''}
                    onChange={(e) => updateSetting('footer_terms_url', e.target.value)}
                    placeholder="/terms or https://..."
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={syncFooterFromSettings} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Update Footer Content
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  This will overwrite Company, Contact, Social and Legal sections in footer to match settings above.
                </p>
              </div>
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

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Theme & Hero Defaults
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Default Theme</Label>
                  <div className="mt-2">
                    <select
                      className="px-3 py-2 border rounded w-full"
                      value={settings['default_theme']?.setting_value || 'light'}
                      onChange={(e) => updateSetting('default_theme', e.target.value)}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-6 md:mt-0">
                  <Switch
                    checked={(settings['theme_follow_system']?.setting_value || 'false') === 'true'}
                    onCheckedChange={(checked) => updateSetting('theme_follow_system', checked ? 'true' : 'false')}
                  />
                  <Label>Follow system theme if user has no preference</Label>
                  {failedKeys.has('theme_follow_system') && (
                    <Button variant="outline" size="sm" onClick={() => updateSetting('theme_follow_system', settings['theme_follow_system']?.setting_value || 'false')}>Retry</Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Default Hero Overlay Opacity</Label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={parseFloat(settings['hero_default_overlay_opacity']?.setting_value || '0.7')}
                    onChange={(e) => updateSetting('hero_default_overlay_opacity', e.target.value)}
                    className="w-full mt-2"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {(parseFloat(settings['hero_default_overlay_opacity']?.setting_value || '0.7') * 100).toFixed(0)}%
                  </div>
                  {failedKeys.has('hero_default_overlay_opacity') && (
                    <Button variant="outline" size="sm" onClick={() => updateSetting('hero_default_overlay_opacity', settings['hero_default_overlay_opacity']?.setting_value || '0.7')}>Retry</Button>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Default Hero Text Color</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="color"
                      value={settings['hero_default_text_color']?.setting_value || '#ffffff'}
                      onChange={(e) => updateSetting('hero_default_text_color', e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={settings['hero_default_text_color']?.setting_value || '#ffffff'}
                      onChange={(e) => updateSetting('hero_default_text_color', e.target.value)}
                    />
                  </div>
                  {failedKeys.has('hero_default_text_color') && (
                    <Button variant="outline" size="sm" onClick={() => updateSetting('hero_default_text_color', settings['hero_default_text_color']?.setting_value || '#ffffff')}>Retry</Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Pages can override these defaults in Hero Banner settings. Defaults are used when page-specific values are not set.
              </p>
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
