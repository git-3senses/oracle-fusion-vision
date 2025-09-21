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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import ThemeToggle from '@/components/ThemeToggle';
import HeroBannerAdmin from './HeroBannerAdmin';
import ContentManager from './ContentManager';
import FooterManager from './FooterManager';
import SiteSettingsManager from './SiteSettingsManager';
import JobOpeningsManager from './JobOpeningsManager';
import TestimonialsManager from './TestimonialsManager';

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
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize,] = useState<number>(10);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
    // Load site logo for header branding
    (async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'logo_url')
          .single();
        if (data?.setting_value) setLogoUrl(data.setting_value);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
      fetchActivityLogs();
    }
  }, [isAuthenticated]);

  const logActivity = async (action: string, resource?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from('admin_activity_logs').insert({
          user_id: user.id,
          user_email: user.email,
          action,
          resource,
          ip_address: 'client-side', // Could be enhanced with actual IP detection
          user_agent: navigator.userAgent
        });

        if (error) {
          console.log('Activity logging disabled due to RLS restrictions');
        }
      }
    } catch (error) {
      console.log('Activity logging failed:', error);
      // Don't throw error - logging is optional functionality
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
        console.error('Database error:', error);
        // Use demo data if RLS prevents access
        setSubmissions(getDemoSubmissions());
        toast({
          title: "Info",
          description: "Showing demo contact submissions - database access restricted",
          variant: "default"
        });
        return;
      }

      setSubmissions(data || getDemoSubmissions());
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      setSubmissions(getDemoSubmissions());
      toast({
        title: "Info",
        description: "Showing demo data due to connection issue",
        variant: "default"
      });
    }
  };

  const getDemoSubmissions = (): ContactSubmission[] => [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@techcorp.com',
      company: 'TechCorp Solutions',
      phone: '+1-555-0123',
      service_interest: 'Oracle Fusion Implementation',
      message: 'We need help implementing Oracle Fusion Cloud for our manufacturing operations. Looking for experienced consultants.',
      consultation_requested: true,
      status: 'new',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@globalltd.com',
      company: 'Global Industries Ltd',
      phone: '+1-555-0456',
      service_interest: 'Oracle EBS Support',
      message: 'Current EBS system needs optimization and support. Interested in your maintenance services.',
      consultation_requested: false,
      status: 'contacted',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@startup.io',
      company: 'StartupTech',
      phone: null,
      service_interest: 'Cloud Migration',
      message: 'Looking to migrate our on-premise Oracle systems to cloud. Need consultation on best practices.',
      consultation_requested: true,
      status: 'closed',
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ];

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

  const filteredSubmissions = submissions.filter(s => {
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const hay = `${s.name} ${s.email} ${s.company || ''} ${s.service_interest || ''}`.toLowerCase();
    const matchesSearch = hay.includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedSubmissions = filteredSubmissions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportSubmissionsCsv = () => {
    const rows = [
      ['Name','Email','Phone','Company','Service','Consultation Requested','Status','Date','Message'],
      ...filteredSubmissions.map(s => [
        s.name,
        s.email,
        s.phone || '',
        s.company || '',
        s.service_interest || '',
        s.consultation_requested ? 'Yes' : 'No',
        s.status,
        new Date(s.created_at).toISOString(),
        (s.message || '').replace(/\n/g,' ')
      ])
    ];
    const csv = rows.map(r => r.map(field => `"${String(field).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact_submissions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const fetchActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      if (error) throw error;
      setActivityLogs(data || []);
    } catch (e) {
      console.log('Activity logs unavailable; showing empty set');
      setActivityLogs([]);
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
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            {logoUrl && (
              <img src={logoUrl} alt="Logo" className="h-6 sm:h-8 w-auto rounded" />
            )}
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
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
            <TabsTrigger value="footer" className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Footer
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Job Openings
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center">
              <Image className="h-4 w-4 mr-2" />
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Site Settings
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Audit Logs
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

            {/* Filters & Actions */}
            <Card>
              <CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                  <select
                    className="px-2 py-1 border rounded w-full sm:w-auto"
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                  <Input
                    placeholder="Search name, email, company, service"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    className="w-full sm:w-64"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button variant="outline" onClick={exportSubmissionsCsv} className="w-full sm:w-auto">
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Submissions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Submissions ({filteredSubmissions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
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
                    {pagedSubmissions.map((submission) => (
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
                              setSelectedSubmission(submission);
                              setIsDialogOpen(true);
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </div>
                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
                  <span className="text-sm text-muted-foreground order-2 sm:order-1">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={currentPage <= 1}>
                      Prev
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={currentPage >= totalPages}>
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Submission Details Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                <DialogHeader>
                  <DialogTitle>Contact Submission Details</DialogTitle>
                </DialogHeader>
                {selectedSubmission && (
                  <div className="space-y-6">
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">Name</Badge>
                            <span className="font-medium">{selectedSubmission.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <a href={`mailto:${selectedSubmission.email}`} className="text-primary hover:underline">
                              {selectedSubmission.email}
                            </a>
                          </div>
                          {selectedSubmission.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                              <a href={`tel:${selectedSubmission.phone}`} className="text-primary hover:underline">
                                {selectedSubmission.phone}
                              </a>
                            </div>
                          )}
                          {selectedSubmission.company && (
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{selectedSubmission.company}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Submission Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">Status</Badge>
                            <select
                              value={selectedSubmission.status}
                              onChange={(e) => {
                                updateStatus(selectedSubmission.id, e.target.value);
                                setSelectedSubmission({...selectedSubmission, status: e.target.value});
                              }}
                              className="px-2 py-1 rounded border"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="in_progress">In Progress</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>
                          {selectedSubmission.service_interest && (
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">Service</Badge>
                              <Badge variant="secondary">{selectedSubmission.service_interest}</Badge>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(selectedSubmission.created_at).toLocaleDateString()} at {new Date(selectedSubmission.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          {selectedSubmission.consultation_requested && (
                            <div className="flex items-center">
                              <Badge variant="secondary" className="text-xs">
                                Consultation Requested
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Message */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="whitespace-pre-wrap">{selectedSubmission.message}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => window.open(`mailto:${selectedSubmission.email}?subject=Re: Your Oracle Consulting Inquiry`)}
                        className="w-full sm:w-auto"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                      {selectedSubmission.phone && (
                        <Button
                          variant="outline"
                          onClick={() => window.open(`tel:${selectedSubmission.phone}`)}
                          className="w-full sm:w-auto"
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                      )}
                      <Button onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
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

          <TabsContent value="footer">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Footer Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FooterManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <JobOpeningsManager />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsManager />
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Admin Activity Logs</CardTitle>
              </CardHeader>
              <CardContent>
                {activityLogs.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No logs to display.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>When</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Resource</TableHead>
                          <TableHead>IP</TableHead>
                          <TableHead>User Agent</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activityLogs.map((log: any) => (
                          <TableRow key={log.id}>
                            <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                            <TableCell>{log.user_email}</TableCell>
                            <TableCell><Badge>{log.action}</Badge></TableCell>
                            <TableCell>{log.resource || '-'}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{log.ip_address || '-'}</TableCell>
                            <TableCell className="text-xs text-muted-foreground max-w-[240px] truncate">{log.user_agent || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
