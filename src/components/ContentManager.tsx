import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  Plus, 
  Trash2, 
  FileText, 
  Image as ImageIcon,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import VideoUploadOptimizer from './VideoUploadOptimizer';

interface PageContentData {
  id: string;
  page_name: string;
  section_name: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  image_alt: string | null;
  button_text: string | null;
  button_link: string | null;
  order_index: number;
  is_active: boolean;
}

interface PageImageData {
  id: string;
  page_name: string;
  section_name: string;
  image_url: string;
  image_alt: string | null;
  image_caption: string | null;
  image_type: string;
  order_index: number;
  is_active: boolean;
}

const ContentManager: React.FC = () => {
  const [pageContent, setPageContent] = useState<PageContentData[]>([]);
  const [pageImages, setPageImages] = useState<PageImageData[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingContent, setEditingContent] = useState<PageContentData | null>(null);
  const [editingImage, setEditingImage] = useState<PageImageData | null>(null);
  const { toast } = useToast();

  const pages = [
    { value: 'home', label: 'Home Page' },
    { value: 'about', label: 'About Page' },
    { value: 'services', label: 'Services Page' },
    { value: 'careers', label: 'Careers Page' },
    { value: 'contact', label: 'Contact Page' }
  ];

  useEffect(() => {
    fetchPageContent();
    fetchPageImages();
  }, [selectedPage]);

  const fetchPageContent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_name', selectedPage)
        .order('order_index');

      if (error) throw error;
      setPageContent(data || []);
    } catch (error) {
      console.error('Error fetching page content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load page content',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPageImages = async () => {
    try {
      const { data, error } = await supabase
        .from('page_images')
        .select('*')
        .eq('page_name', selectedPage)
        .order('order_index');

      if (error) throw error;
      setPageImages(data || []);
    } catch (error) {
      console.error('Error fetching page images:', error);
    }
  };

  const saveContent = async (content: Partial<PageContentData>) => {
    try {
      setIsSaving(true);
      
      if (content.id) {
        // Update existing content (omit id from payload)
        const { id, ...updateFields } = content as any;
        const { error } = await supabase
          .from('page_content')
          .update(updateFields)
          .eq('id', content.id);
        
        if (error) throw error;
      } else {
        // Create new content
        const { error } = await supabase
          .from('page_content')
          .insert({
            page_name: selectedPage,
            section_name: content.section_name || 'default',
            title: content.title,
            subtitle: content.subtitle,
            content: content.content,
            image_url: content.image_url,
            image_alt: content.image_alt,
            button_text: content.button_text,
            button_link: content.button_link,
            order_index: pageContent.length,
            is_active: content.is_active !== undefined ? content.is_active : true
          });
        
        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Content saved successfully'
      });

      fetchPageContent();
      setEditingContent(null);
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Error',
        description: 'Failed to save content',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteContent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('page_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Content deleted successfully'
      });

      fetchPageContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete content',
        variant: 'destructive'
      });
    }
  };

  const handleImageUpload = async (file: File, imageData: Partial<PageImageData>) => {
    try {
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedPage}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('page-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('page-media')
        .getPublicUrl(fileName);

      // Save image data to database
      const { error } = await supabase
        .from('page_images')
        .insert({
          page_name: selectedPage,
          section_name: imageData.section_name || 'gallery',
          image_url: publicUrl,
          image_alt: imageData.image_alt,
          image_caption: imageData.image_caption,
          image_type: imageData.image_type || 'content',
          order_index: pageImages.length,
          is_active: imageData.is_active !== undefined ? imageData.is_active : true
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Image uploaded successfully'
      });

      fetchPageImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive'
      });
    }
  };

  const getStoragePathFromPublicUrl = (publicUrl: string, bucket: string) => {
    const marker = `/object/public/${bucket}/`;
    const idx = publicUrl.indexOf(marker);
    return idx !== -1 ? publicUrl.substring(idx + marker.length) : publicUrl;
  };

  const deletePageImage = async (image: PageImageData) => {
    try {
      // Remove storage object best-effort
      if (image.image_url) {
        const path = getStoragePathFromPublicUrl(image.image_url, 'page-media');
        await supabase.storage.from('page-media').remove([path]);
      }
    } catch (e) {
      console.warn('Failed to remove storage object for image:', image.id, e);
    } finally {
      await supabase
        .from('page_images')
        .delete()
        .eq('id', image.id);
      fetchPageImages();
    }
  };

  const updateContentOrder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = pageContent.findIndex(c => c.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= pageContent.length) return;

    try {
      const current = pageContent[currentIndex];
      const other = pageContent[newIndex];

      // Swap order_index values
      await Promise.all([
        supabase
          .from('page_content')
          .update({ order_index: other.order_index })
          .eq('id', current.id),
        supabase
          .from('page_content')
          .update({ order_index: current.order_index })
          .eq('id', other.id)
      ]);

      fetchPageContent();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Content Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Label htmlFor="page-select">Select Page:</Label>
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page.value} value={page.value}>
                    {page.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Page Content</TabsTrigger>
          <TabsTrigger value="images">Page Images</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          {/* Content Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Content Sections</span>
                <Button
                  onClick={() => setEditingContent({
                    id: '',
                    page_name: selectedPage,
                    section_name: '',
                    title: '',
                    subtitle: '',
                    content: '',
                    image_url: null,
                    image_alt: null,
                    button_text: null,
                    button_link: null,
                    order_index: pageContent.length,
                    is_active: true
                  })}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading content...</div>
              ) : pageContent.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No content sections found for this page
                </div>
              ) : (
                <div className="space-y-4">
                  {pageContent.map((content, index) => (
                    <div
                      key={content.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <Badge variant={content.is_active ? 'default' : 'secondary'}>
                            {content.section_name}
                          </Badge>
                          {!content.is_active && (
                            <Badge variant="outline">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Hidden
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-medium mt-2 truncate">
                          {content.title || 'Untitled Section'}
                        </h4>
                        {content.subtitle && (
                          <p className="text-sm text-muted-foreground truncate">
                            {content.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateContentOrder(content.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateContentOrder(content.id, 'down')}
                          disabled={index === pageContent.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingContent(content)}
                        >
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete this section?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteContent(content.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Editor */}
          {editingContent && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingContent.id ? 'Edit Content Section' : 'Add Content Section'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="section-name">Section Name</Label>
                    <Input
                      id="section-name"
                      value={editingContent.section_name}
                      onChange={(e) => setEditingContent(prev => prev ? {
                        ...prev,
                        section_name: e.target.value
                      } : null)}
                      placeholder="e.g., hero, about, features"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingContent.is_active}
                      onCheckedChange={(checked) => setEditingContent(prev => prev ? {
                        ...prev,
                        is_active: checked
                      } : null)}
                    />
                    <Label>Active</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingContent.title || ''}
                    onChange={(e) => setEditingContent(prev => prev ? {
                      ...prev,
                      title: e.target.value
                    } : null)}
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={editingContent.subtitle || ''}
                    onChange={(e) => setEditingContent(prev => prev ? {
                      ...prev,
                      subtitle: e.target.value
                    } : null)}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={editingContent.content || ''}
                    onChange={(e) => setEditingContent(prev => prev ? {
                      ...prev,
                      content: e.target.value
                    } : null)}
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="button-text">Button Text</Label>
                    <Input
                      id="button-text"
                      value={editingContent.button_text || ''}
                      onChange={(e) => setEditingContent(prev => prev ? {
                        ...prev,
                        button_text: e.target.value
                      } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="button-link">Button Link</Label>
                    <Input
                      id="button-link"
                      value={editingContent.button_link || ''}
                      onChange={(e) => setEditingContent(prev => prev ? {
                        ...prev,
                        button_link: e.target.value
                      } : null)}
                      placeholder="e.g., #contact, /about"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingContent(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => saveContent(editingContent)}
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          {/* Image Upload */}
          <VideoUploadOptimizer
            onFileSelect={(file) => handleImageUpload(file, {
              section_name: 'gallery',
              image_alt: file.name,
              image_caption: '',
              image_type: 'content',
              is_active: true
            })}
            maxSizeMB={20}
          />

          {/* Page Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Page Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pageImages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No images found for this page
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pageImages.map((image) => (
                    <div key={image.id} className="border rounded-lg overflow-hidden">
                      <div className="aspect-video relative">
                        {/\.(mp4|webm|mov)(\?|$)/i.test(image.image_url) ? (
                          <video
                            src={image.image_url}
                            className="w-full h-full object-cover"
                            controls
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={image.image_url}
                            alt={image.image_alt || ''}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant={image.is_active ? 'default' : 'secondary'}>
                            {image.image_type}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-3">
                        <h5 className="font-medium text-sm">{image.section_name}</h5>
                        {image.image_caption && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {image.image_caption}
                          </p>
                        )}
                        <div className="flex justify-end mt-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this image?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove the image and its storage object.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deletePageImage(image)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManager;
