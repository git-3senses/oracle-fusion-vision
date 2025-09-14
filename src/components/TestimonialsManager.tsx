import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Save, ArrowUp, ArrowDown, Star } from 'lucide-react';

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  avatar_url: string | null;
  rating: number | null;
  is_active: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
};

const TestimonialsManager: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      // Demo fallback since testimonials table doesn't exist
      setItems([
        { id: 'd1', name: 'Jane Cooper', role: 'CIO', company: 'TechCorp', content: 'Vijay Apps transformed our Oracle stack with precision and speed.', avatar_url: null, rating: 5, is_active: true, order_index: 0 },
        { id: 'd2', name: 'Wade Warren', role: 'VP Operations', company: 'Global Industries', content: 'Outstanding Fusion implementation with measurable ROI in months.', avatar_url: null, rating: 5, is_active: true, order_index: 1 },
      ]);
      toast({ title: 'Info', description: 'Testimonials table not configured. Showing demo data.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelected({
      id: '',
      name: '',
      role: '',
      company: '',
      content: '',
      avatar_url: '',
      rating: 5,
      is_active: true,
      order_index: items.length,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (t: Testimonial) => {
    setSelected({ ...t });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selected) return;
    setIsSaving(true);
    try {
      const payload = {
        name: selected.name,
        role: selected.role || null,
        company: selected.company || null,
        content: selected.content,
        avatar_url: selected.avatar_url || null,
        rating: selected.rating ?? 5,
        is_active: selected.is_active,
        order_index: selected.order_index,
      };
      // Demo mode - no actual database operations
      if (selected.id) {
        toast({ title: 'Demo Mode', description: 'Testimonial updates disabled in demo mode' });
      } else {
        toast({ title: 'Demo Mode', description: 'Testimonial creation disabled in demo mode' });
      }
      setIsDialogOpen(false);
      fetchTestimonials();
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to save testimonial', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Demo mode - no actual database operations
    toast({ title: 'Demo Mode', description: 'Testimonial deletion disabled in demo mode' });
  };

  const updateOrder = async (id: string, dir: 'up' | 'down') => {
    const idx = items.findIndex(i => i.id === id);
    if (idx < 0) return;
    const ni = dir === 'up' ? idx - 1 : idx + 1;
    if (ni < 0 || ni >= items.length) return;
    // Demo mode - no actual database operations
    toast({ title: 'Demo Mode', description: 'Testimonial reordering disabled in demo mode' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Testimonials Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" /> Add Testimonial</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selected?.id ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={selected.name} onChange={e => setSelected({ ...selected, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Company</Label>
                    <Input value={selected.company || ''} onChange={e => setSelected({ ...selected, company: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Role / Title</Label>
                    <Input value={selected.role || ''} onChange={e => setSelected({ ...selected, role: e.target.value })} />
                  </div>
                  <div>
                    <Label>Avatar URL</Label>
                    <Input value={selected.avatar_url || ''} onChange={e => setSelected({ ...selected, avatar_url: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Testimonial</Label>
                  <Textarea rows={4} value={selected.content} onChange={e => setSelected({ ...selected, content: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <Label>Rating (1-5)</Label>
                    <Input type="number" min={1} max={5} value={selected.rating ?? 5} onChange={e => setSelected({ ...selected, rating: Math.max(1, Math.min(5, Number(e.target.value))) })} />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <Switch checked={selected.is_active} onCheckedChange={checked => setSelected({ ...selected, is_active: checked })} />
                    <Label>Active</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSave} disabled={isSaving}><Save className="h-4 w-4 mr-2" /> {isSaving ? 'Saving...' : 'Save'}</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="p-6">Loading testimonials...</div>
      ) : (
        <div className="space-y-4">
          {items.map((t, idx) => (
            <Card key={t.id}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {t.name}
                      {t.rating ? (
                        <span className="inline-flex items-center text-yellow-500 text-sm">
                          <Star className="h-4 w-4 mr-1" /> {t.rating}
                        </span>
                      ) : null}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {[t.role, t.company].filter(Boolean).join(' • ')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => updateOrder(t.id, 'up')} disabled={idx === 0}><ArrowUp className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => updateOrder(t.id, 'down')} disabled={idx === items.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(t)}><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete testimonial?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(t.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">{t.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;

