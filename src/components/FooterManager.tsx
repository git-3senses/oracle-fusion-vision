import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  Plus, 
  Trash2, 
  Globe,
  ArrowUp,
  ArrowDown,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Youtube
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const FooterManager: React.FC = () => {
  const [footerContent, setFooterContent] = useState<FooterContentData[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('company_info');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<FooterContentData | null>(null);
  const { toast } = useToast();

  const sectionTypes = [
    { value: 'company_info', label: 'Company Information' },
    { value: 'contact_info', label: 'Contact Information' },
    { value: 'social_links', label: 'Social Links' },
    { value: 'quick_links', label: 'Quick Links' },
    { value: 'services', label: 'Services' },
    { value: 'legal', label: 'Legal Information' }
  ];

  const iconOptions = [
    { value: 'mail', label: 'Email', component: Mail },
    { value: 'phone', label: 'Phone', component: Phone },
    { value: 'map-pin', label: 'Location', component: MapPin },
    { value: 'linkedin', label: 'LinkedIn', component: Linkedin },
    { value: 'twitter', label: 'Twitter', component: Twitter },
    { value: 'youtube', label: 'YouTube', component: Youtube },
    { value: 'globe', label: 'Website', component: Globe }
  ];

  useEffect(() => {
    fetchFooterContent();
  }, [selectedSection]);

  const fetchFooterContent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('footer_content')
        .select('*')
        .eq('section_type', selectedSection)
        .order('order_index');

      if (error) throw error;
      setFooterContent(data || []);
    } catch (error) {
      console.error('Error fetching footer content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load footer content',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveFooterItem = async (item: Partial<FooterContentData>) => {
    try {
      setIsSaving(true);
      
      if (item.id) {
        // Update existing item
        const { error } = await supabase
          .from('footer_content')
          .update(item)
          .eq('id', item.id);
        
        if (error) throw error;
      } else {
        // Create new item
        const { error } = await supabase
          .from('footer_content')
          .insert({
            ...item,
            section_type: selectedSection,
            order_index: footerContent.length
          });
        
        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Footer content saved successfully'
      });

      fetchFooterContent();
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving footer content:', error);
      toast({
        title: 'Error',
        description: 'Failed to save footer content',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteFooterItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('footer_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Footer item deleted successfully'
      });

      fetchFooterContent();
    } catch (error) {
      console.error('Error deleting footer item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete footer item',
        variant: 'destructive'
      });
    }
  };

  const updateItemOrder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = footerContent.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= footerContent.length) return;

    try {
      const current = footerContent[currentIndex];
      const other = footerContent[newIndex];

      // Swap order_index values
      await Promise.all([
        supabase
          .from('footer_content')
          .update({ order_index: other.order_index })
          .eq('id', current.id),
        supabase
          .from('footer_content')
          .update({ order_index: current.order_index })
          .eq('id', other.id)
      ]);

      fetchFooterContent();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getIconComponent = (iconName: string | null) => {
    const icon = iconOptions.find(opt => opt.value === iconName);
    if (icon) {
      const IconComponent = icon.component;
      return <IconComponent className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Section Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Footer Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Label htmlFor="section-select">Select Section:</Label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sectionTypes.map((section) => (
                  <SelectItem key={section.value} value={section.value}>
                    {section.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Footer Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Footer Items</span>
            <Button
              onClick={() => setEditingItem({
                id: '',
                section_type: selectedSection,
                title: '',
                content: '',
                link_url: null,
                link_text: null,
                icon_name: null,
                order_index: footerContent.length,
                is_active: true
              })}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading footer content...</div>
          ) : footerContent.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No items found for this section
            </div>
          ) : (
            <div className="space-y-4">
              {footerContent.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getIconComponent(item.icon_name)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">
                          {item.title || item.content || 'Untitled Item'}
                        </h4>
                        {!item.is_active && (
                          <Badge variant="outline">Hidden</Badge>
                        )}
                      </div>
                      {item.link_url && (
                        <p className="text-sm text-muted-foreground">
                          → {item.link_url}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateItemOrder(item.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateItemOrder(item.id, 'down')}
                      disabled={index === footerContent.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingItem(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFooterItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Item Editor */}
      {editingItem && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingItem.id ? 'Edit Footer Item' : 'Add Footer Item'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem(prev => prev ? {
                    ...prev,
                    title: e.target.value
                  } : null)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingItem.is_active}
                  onCheckedChange={(checked) => setEditingItem(prev => prev ? {
                    ...prev,
                    is_active: checked
                  } : null)}
                />
                <Label>Active</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={editingItem.content || ''}
                onChange={(e) => setEditingItem(prev => prev ? {
                  ...prev,
                  content: e.target.value
                } : null)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="link-text">Link Text</Label>
                <Input
                  id="link-text"
                  value={editingItem.link_text || ''}
                  onChange={(e) => setEditingItem(prev => prev ? {
                    ...prev,
                    link_text: e.target.value
                  } : null)}
                />
              </div>
              <div>
                <Label htmlFor="link-url">Link URL</Label>
                <Input
                  id="link-url"
                  value={editingItem.link_url || ''}
                  onChange={(e) => setEditingItem(prev => prev ? {
                    ...prev,
                    link_url: e.target.value
                  } : null)}
                  placeholder="e.g., #contact, https://example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="icon-select">Icon</Label>
              <Select 
                value={editingItem.icon_name || ''} 
                onValueChange={(value) => setEditingItem(prev => prev ? {
                  ...prev,
                  icon_name: value || null
                } : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No icon</SelectItem>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      <div className="flex items-center space-x-2">
                        {React.createElement(icon.component, { className: 'h-4 w-4' })}
                        <span>{icon.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => saveFooterItem(editingItem)}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FooterManager;