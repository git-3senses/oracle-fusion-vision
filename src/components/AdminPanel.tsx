import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  LogOut, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  MessageSquare, 
  Image, 
  Settings,
  FileText,
  Globe
} from 'lucide-react';
import HeroBannerAdmin from './HeroBannerAdmin';
import ContentManager from './ContentManager';
import FooterManager from './FooterManager';
import SiteSettingsManager from './SiteSettingsManager';
import JobOpeningsManager from './JobOpeningsManager';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service_interest?: string;
  message: string;
  consultation_requested: boolean;
  status: string;
  created_at: string;
}

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const logActivity = async (action: string, resource?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('admin_activity_logs').insert({
          user_id: user.id,
          user_email: user.email,
          action,
          resource,
          ip_address: 'client-side', // Could be enhanced with actual IP detection
          user_agent: navigator.userAgent
        });
      }
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  const checkAuthStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await logActivity('admin_panel_access', 'dashboard');
    }
    setIsAuthenticated(!!session);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setIsAuthenticated(true);
      await logActivity('admin_login', 'authentication');
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel.",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logActivity('admin_logout', 'authentication');
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setSubmissions([]);
  };

  const fetchSubmissions = async () => {
    try {
      await logActivity('view_contact_submissions', 'contact_submissions');
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setSubmissions(data || []);
    } catch (error: any) {
      // If user is not an admin, they won't be able to access submissions
      if (error.message?.includes('row-level security')) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view contact submissions.",
          variant: "destructive"
        });
        handleLogout(); // Force logout if not admin
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch submissions.",
          variant: "destructive"
        });
      }
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);

      if (error) {
        throw error;
      }

      await logActivity('status_update', `contact_submission:${id}`);
      
      setSubmissions(prev => 
        prev.map(sub => sub.id === id ? { ...sub, status } : sub)
      );

      toast({
        title: "Status Updated",
        description: "Submission status has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'in_progress': return 'bg-orange-500';
      case 'closed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="submissions" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="hero-banners" className="flex items-center">
              <Image className="h-4 w-4 mr-2" />
              Hero Banners
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Page Content
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Job Openings
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Site Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-primary">
                    {submissions.length}
                  </div>
                  <p className="text-muted-foreground">Total Submissions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-500">
                    {submissions.filter(s => s.status === 'new').length}
                  </div>
                  <p className="text-muted-foreground">New</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-orange-500">
                    {submissions.filter(s => s.status === 'in_progress').length}
                  </div>
                  <p className="text-muted-foreground">In Progress</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-green-500">
                    {submissions.filter(s => s.consultation_requested).length}
                  </div>
                  <p className="text-muted-foreground">Consultation Requests</p>
                </CardContent>
              </Card>
            </div>

            {/* Submissions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{submission.name}</div>
                            {submission.consultation_requested && (
                              <Badge variant="secondary" className="text-xs">
                                Consultation Requested
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-2" />
                              {submission.email}
                            </div>
                            {submission.phone && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="h-3 w-3 mr-2" />
                                {submission.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {submission.company && (
                            <div className="flex items-center text-sm">
                              <Building className="h-3 w-3 mr-2" />
                              {submission.company}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {submission.service_interest && (
                            <Badge variant="outline" className="text-xs">
                              {submission.service_interest}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <select
                            value={submission.status}
                            onChange={(e) => updateStatus(submission.id, e.target.value)}
                            className="px-2 py-1 rounded text-xs border"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in_progress">In Progress</option>
                            <option value="closed">Closed</option>
                          </select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-2" />
                            {new Date(submission.created_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // Show message details
                              toast({
                                title: "Message",
                                description: submission.message,
                              });
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero-banners">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="h-5 w-5 mr-2" />
                  Hero Banner Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HeroBannerAdmin />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Site Settings & Logo Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SiteSettingsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Page Content Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContentManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <JobOpeningsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;