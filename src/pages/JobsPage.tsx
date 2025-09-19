import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Briefcase,
  Search,
  Filter,
  ArrowLeft,
  Users,
  Building,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import DynamicFooter from '@/components/DynamicFooter';
import SEOHead from '@/components/SEOHead';
import { useNavigate } from 'react-router-dom';

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
}

const JobsPage = () => {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobOpening[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, selectedDepartment, selectedLocation, selectedJobType]);

  useEffect(() => {
    // Auto-select first job when filtered jobs change
    if (filteredJobs.length > 0 && !selectedJob) {
      setSelectedJob(filteredJobs[0]);
    } else if (filteredJobs.length > 0 && selectedJob && !filteredJobs.find(job => job.id === selectedJob.id)) {
      setSelectedJob(filteredJobs[0]);
    } else if (filteredJobs.length === 0) {
      setSelectedJob(null);
    }
  }, [filteredJobs, selectedJob]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .eq('is_active', true)
        .order('is_urgent', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        setJobs(getFallbackJobs());
        return;
      }

      setJobs(data || getFallbackJobs());
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs(getFallbackJobs());
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackJobs = (): JobOpening[] => [
    {
      id: '1',
      title: 'Senior Oracle Fusion Developer',
      department: 'Engineering',
      location: 'Remote / Hybrid',
      type: 'Full-time',
      experience: '5+ years',
      skills: ['Oracle Fusion', 'PL/SQL', 'Java', 'REST APIs', 'OIC'],
      description: 'Lead Oracle Fusion development projects and mentor junior developers in creating scalable enterprise solutions. Work with cutting-edge Oracle technologies to deliver innovative business solutions.',
      requirements: '• 5+ years of Oracle Fusion development experience\n• Strong expertise in PL/SQL and Java\n• Experience with Oracle Integration Cloud (OIC)\n• Knowledge of REST APIs and web services\n• Bachelor\'s degree in Computer Science or related field',
      is_urgent: true,
      is_active: true,
      created_at: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      title: 'Oracle EBS Functional Consultant',
      department: 'Consulting',
      location: 'Onsite / Remote',
      type: 'Full-time',
      experience: '3-5 years',
      skills: ['Oracle EBS', 'Financials', 'Supply Chain', 'HRMS', 'Business Analysis'],
      description: 'Work with clients to implement and optimize Oracle EBS modules for business process improvements. Lead functional requirements gathering and system configuration.',
      requirements: '• 3-5 years of Oracle EBS functional experience\n• Expertise in Financials, Supply Chain, or HRMS modules\n• Strong business analysis skills\n• Client-facing experience\n• Excellent communication skills',
      is_urgent: false,
      is_active: true,
      created_at: '2024-01-10T00:00:00Z'
    },
    {
      id: '3',
      title: 'Cloud Integration Specialist',
      department: 'Cloud Solutions',
      location: 'Remote',
      type: 'Contract',
      experience: '4+ years',
      skills: ['OIC', 'Oracle Cloud', 'Integration', 'SOA', 'APIs'],
      description: 'Design and implement cloud integration solutions using Oracle Integration Cloud and related technologies. Build robust integration patterns for enterprise applications.',
      requirements: '• 4+ years of integration experience\n• Expertise in Oracle Integration Cloud (OIC)\n• Knowledge of SOA architecture\n• API development and management\n• Cloud technologies experience',
      is_urgent: false,
      is_active: true,
      created_at: '2024-01-08T00:00:00Z'
    },
    {
      id: '4',
      title: 'Oracle Database Administrator',
      department: 'Infrastructure',
      location: 'Hybrid',
      type: 'Full-time',
      experience: '3+ years',
      skills: ['Oracle Database', 'Performance Tuning', 'Backup & Recovery', 'RAC', 'DataGuard'],
      description: 'Manage and optimize Oracle database environments. Ensure high availability, performance, and security of mission-critical database systems.',
      requirements: '• 3+ years of Oracle DBA experience\n• Performance tuning expertise\n• Backup and recovery procedures\n• RAC and DataGuard knowledge\n• 24/7 support availability',
      is_urgent: false,
      is_active: true,
      created_at: '2024-01-05T00:00:00Z'
    },
    {
      id: '5',
      title: 'Oracle Project Manager',
      department: 'Management',
      location: 'Onsite',
      type: 'Full-time',
      experience: '6+ years',
      skills: ['Project Management', 'Oracle Implementation', 'PMP', 'Agile', 'Stakeholder Management'],
      description: 'Lead Oracle implementation projects from initiation to completion. Manage cross-functional teams and ensure successful delivery of complex enterprise solutions.',
      requirements: '• 6+ years of project management experience\n• Oracle implementation project experience\n• PMP certification preferred\n• Agile/Scrum methodologies\n• Strong leadership and communication skills',
      is_urgent: true,
      is_active: true,
      created_at: '2024-01-03T00:00:00Z'
    }
  ];

  const filterJobs = () => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(job => job.department === selectedDepartment);
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(job => job.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    // Job type filter
    if (selectedJobType !== 'all') {
      filtered = filtered.filter(job => job.type === selectedJobType);
    }

    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('all');
    setSelectedLocation('all');
    setSelectedJobType('all');
  };

  const getUniqueDepartments = () => {
    const departments = [...new Set(jobs.map(job => job.department))];
    return departments.sort();
  };

  const getUniqueJobTypes = () => {
    const types = [...new Set(jobs.map(job => job.type))];
    return types.sort();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const JobDetailPanel = () => {
    if (!selectedJob) {
      return (
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Select a Job</h3>
            <p className="text-muted-foreground">
              Choose a position from the list to view detailed information
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="border-b pb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">{selectedJob.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span>{selectedJob.department}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedJob.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{selectedJob.experience}</span>
                  </div>
                </div>
              </div>
              {selectedJob.is_urgent && (
                <Badge className="bg-gradient-accent text-white font-semibold">
                  Urgent Hiring
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              Posted {formatDate(selectedJob.created_at)}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {selectedJob.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          {selectedJob.description && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Job Description</h3>
              <p className="text-muted-foreground leading-relaxed">{selectedJob.description}</p>
            </div>
          )}

          {/* Requirements */}
          {selectedJob.requirements && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Requirements</h3>
              <div className="text-muted-foreground space-y-1">
                {selectedJob.requirements.split('\n').map((req, index) => (
                  <p key={index}>{req}</p>
                ))}
              </div>
            </div>
          )}

          {/* Apply Button */}
          <div className="pt-6 border-t">
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={() => navigate('/submit-resume')}
            >
              Apply for this Position
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Oracle Jobs - Open Positions at Vijay Apps Consultants"
        description="Explore Oracle career opportunities at Vijay Apps Consultants. Find Oracle developer, consultant, and specialist positions with competitive benefits and growth opportunities."
        keywords="Oracle Jobs, Oracle Careers, Oracle Developer Jobs, Oracle Consultant Jobs, Oracle Employment, Oracle Fusion Jobs, Oracle EBS Jobs"
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/jobs` : ''}
      />
      <Header />
      <main className="py-16 lg:py-24">
        {/* Main Content */}
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex h-[calc(100vh-200px)]">
            {/* Left Sidebar - Job List */}
            <div className="w-1/3 border-r bg-background">
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-4 border-b">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/careers')}
                    size="sm"
                    className="mb-3 -ml-2"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Careers
                  </Button>
                  <div>
                    <h1 className="text-xl font-bold mb-1">
                      Job <span className="text-button-gradient">Openings</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {filteredJobs.length} positions available
                    </p>
                  </div>
                </div>

                {/* Filters */}
                <div className="p-4 border-b space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {getUniqueDepartments().map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="onsite">Onsite</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Job Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {getUniqueJobTypes().map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {(searchTerm || selectedDepartment !== 'all' || selectedLocation !== 'all' || selectedJobType !== 'all') && (
                    <Button variant="outline" onClick={clearFilters} size="sm" className="w-full">
                      Clear Filters
                    </Button>
                  )}
                </div>

                {/* Job List */}
                <div className="flex-1 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : filteredJobs.length > 0 ? (
                    <div className="space-y-1">
                      {filteredJobs.map((job) => (
                        <div
                          key={job.id}
                          className={`p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors ${
                            selectedJob?.id === job.id ? 'bg-muted border-l-4 border-l-primary' : ''
                          }`}
                          onClick={() => setSelectedJob(job)}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold text-sm leading-tight">{job.title}</h3>
                              {job.is_urgent && (
                                <Badge className="bg-gradient-accent text-white text-xs ml-2">
                                  Urgent
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <div className="flex items-center space-x-1">
                                <Building className="h-3 w-3" />
                                <span>{job.department}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{job.experience}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {job.skills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs px-1.5 py-0.5">
                                  {skill}
                                </Badge>
                              ))}
                              {job.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                  +{job.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-center p-4">
                      <div>
                        <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No jobs found</p>
                        <Button variant="outline" onClick={clearFilters} size="sm" className="mt-2">
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Job Details */}
            <div className="flex-1 bg-background">
              <JobDetailPanel />
            </div>
          </div>
        </div>
      </main>
      <DynamicFooter />
    </div>
  );
};

export default JobsPage;