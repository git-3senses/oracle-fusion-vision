import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  MapPin, 
  Clock, 
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  skills: string[];
  description: string | null;
  requirements: string | null;
  is_urgent: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const JobOpeningsManager: React.FC = () => {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    experience: '',
    skills: '',
    description: '',
    requirements: '',
    is_urgent: false,
    is_active: true
  });

  useEffect(() => {
    fetchJobOpenings();
  }, []);

  const fetchJobOpenings = async () => {
    try {
      // Check if user is authenticated first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('Not authenticated - showing demo data');
        setJobOpenings(getDemoJobOpenings());
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        // Fallback to demo data if RLS prevents access
        setJobOpenings(getDemoJobOpenings());
        toast({
          title: "Info",
          description: "Showing demo data - database access restricted",
          variant: "default"
        });
      } else {
        setJobOpenings(data || getDemoJobOpenings());
      }
    } catch (error) {
      console.error('Error fetching job openings:', error);
      setJobOpenings(getDemoJobOpenings());
      toast({
        title: "Info",
        description: "Showing demo data due to connection issue",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDemoJobOpenings = (): JobOpening[] => [
    {
      id: '1',
      title: 'Senior Oracle Fusion Developer',
      department: 'Engineering',
      location: 'Remote / Hybrid',
      type: 'Full-time',
      experience: '5+ years',
      skills: ['Oracle Fusion', 'PL/SQL', 'Java', 'REST APIs', 'OIC'],
      description: 'Lead Oracle Fusion development projects and mentor junior developers in creating scalable enterprise solutions.',
      requirements: 'Bachelor\'s degree in Computer Science or related field. 5+ years of Oracle Fusion development experience.',
      is_urgent: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Oracle EBS Functional Consultant',
      department: 'Consulting',
      location: 'Onsite / Remote',
      type: 'Full-time',
      experience: '3-5 years',
      skills: ['Oracle EBS', 'Financials', 'Supply Chain', 'HRMS', 'Business Analysis'],
      description: 'Work with clients to implement and optimize Oracle EBS modules for business process improvements.',
      requirements: 'Experience with Oracle EBS R12, functional knowledge of Finance or SCM modules.',
      is_urgent: false,
      is_active: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '3',
      title: 'Cloud Integration Specialist',
      department: 'Cloud Solutions',
      location: 'Remote',
      type: 'Contract',
      experience: '4+ years',
      skills: ['OIC', 'Oracle Cloud', 'Integration', 'SOA', 'APIs'],
      description: 'Design and implement cloud integration solutions using Oracle Integration Cloud and related technologies.',
      requirements: 'Strong experience with Oracle Integration Cloud, REST/SOAP services, and cloud architectures.',
      is_urgent: false,
      is_active: false,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  const handleEdit = (job: JobOpening) => {
    setSelectedJob(job);
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      skills: job.skills.join(', '),
      description: job.description || '',
      requirements: job.requirements || '',
      is_urgent: job.is_urgent,
      is_active: job.is_active
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedJob(null);
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      experience: '',
      skills: '',
      description: '',
      requirements: '',
      is_urgent: false,
      is_active: true
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    // Check authentication before attempting save
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save job openings.",
        variant: "destructive"
      });
      return;
    }

    // Validate form data
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Job title is required.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.department.trim()) {
      toast({
        title: "Validation Error",
        description: "Department is required.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const jobData = {
        title: formData.title,
        department: formData.department,
        location: formData.location,
        type: formData.type,
        experience: formData.experience,
        skills: skillsArray,
        description: formData.description || null,
        requirements: formData.requirements || null,
        is_urgent: formData.is_urgent,
        is_active: formData.is_active
      };

      let dbSuccess = false;

      if (selectedJob) {
        // Update existing job
        const { error } = await supabase
          .from('job_openings')
          .update(jobData)
          .eq('id', selectedJob.id);

        if (error) {
          console.warn('Database update failed, will show error but continue with local fallback');
          throw error;
        }

        dbSuccess = true;
        toast({
          title: "Success",
          description: "Job opening updated successfully"
        });
      } else {
        // Create new job
        const { error } = await supabase
          .from('job_openings')
          .insert([jobData]);

        if (error) {
          console.warn('Database insert failed, will show error but continue with local fallback');
          throw error;
        }

        dbSuccess = true;
        toast({
          title: "Success",
          description: "Job opening created successfully"
        });
      }

      setIsDialogOpen(false);
      fetchJobOpenings();
    } catch (error: any) {
      console.error('Error saving job opening:', error);
      console.error('Error details:', {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        statusCode: error?.statusCode
      });

      let errorMessage = "Failed to save job opening";

      if (error?.code === '42501' || error?.message?.includes('permission')) {
        errorMessage = "Permission denied. You may not have access to modify job openings.";
      } else if (error?.code === '42P01') {
        errorMessage = "The job_openings table doesn't exist in the database. Please contact support.";
      } else if (error?.code === '23505') {
        errorMessage = "A job opening with this title already exists.";
      } else if (error?.code === 'PGRST301') {
        errorMessage = "Database connection issue. Please try again.";
      } else if (error?.message?.includes('JWT')) {
        errorMessage = "Your session has expired. Please log in again.";
      } else if (error?.message?.includes('RLS')) {
        errorMessage = "Database security policies prevent this action. Contact support.";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Save Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('job_openings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job opening deleted successfully"
      });

      fetchJobOpenings();
    } catch (error) {
      console.error('Error deleting job opening:', error);
      toast({
        title: "Error",
        description: "Failed to delete job opening",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return <div className="p-6">Loading job openings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Job Openings Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Job Opening
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedJob ? 'Edit Job Opening' : 'Add New Job Opening'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Senior Oracle Developer"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="e.g., Technical"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Remote / Hyderabad"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Job Type</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    placeholder="e.g., Full-time"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="experience">Experience Required</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="e.g., 5+ years"
                />
              </div>

              <div>
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => handleInputChange('skills', e.target.value)}
                  placeholder="e.g., Oracle ERP, PL/SQL, JavaScript"
                />
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role and responsibilities..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="List the requirements and qualifications..."
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_urgent"
                    checked={formData.is_urgent}
                    onCheckedChange={(checked) => handleInputChange('is_urgent', checked)}
                  />
                  <Label htmlFor="is_urgent">Urgent Hiring</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving || !formData.title.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {jobOpenings.map((job) => (
          <Card key={job.id} className="relative">
            {job.is_urgent && (
              <div className="absolute -top-2 left-4">
                <Badge className="bg-red-500 text-white">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Urgent
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center space-x-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{job.department}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{job.type} • {job.experience}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant={job.is_active ? 'default' : 'secondary'}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(job)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Job Opening</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{job.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(job.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {job.description && (
                  <p className="text-sm text-muted-foreground">
                    {job.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {jobOpenings.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No job openings found.</p>
              <Button className="mt-4" onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Job Opening
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobOpeningsManager;