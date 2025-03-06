
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPin, 
  Building, 
  Calendar, 
  Banknote, 
  Share2, 
  Bookmark, 
  ExternalLink
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const fetchJobDetails = async (id: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch job details');
  }
  return response.json();
};

const saveJob = async (jobId: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/profile/saved-jobs/${jobId}`, {
    method: 'POST',
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error('Failed to save job');
  }
  return response.json();
};

const trackAppliedJob = async (jobId: string) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/profile/applied-jobs/${jobId}`, {
    method: 'POST',
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error('Failed to track applied job');
  }
  return response.json();
};

const JobDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const { data: job, isLoading, isError } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobDetails(id || ''),
    enabled: !!id
  });
  
  const handleSaveJob = async () => {
    try {
      await saveJob(id || '');
      toast({
        title: "Job Saved",
        description: "This job has been added to your saved jobs.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "You must be logged in to save jobs.",
        variant: "destructive"
      });
    }
  };
  
  const handleApplyJob = async () => {
    try {
      if (job?.applicationLink) {
        await trackAppliedJob(id || '');
        window.open(job.applicationLink, '_blank');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "You must be logged in to track applications.",
        variant: "destructive"
      });
    }
  };
  
  const handleShareJob = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job: ${job?.title} at ${job?.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "URL Copied",
        description: "Job URL copied to clipboard",
      });
    }
  };
  
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-lg">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (isError || !job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-destructive">Error</h1>
            <p className="mt-4 text-lg">Failed to load job details.</p>
            <Button asChild className="mt-6">
              <Link to="/jobs">Back to Jobs</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-6 flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/jobs">← Back to job listings</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                      {job.logo ? (
                        <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                      ) : (
                        <Building className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">{job.title}</h1>
                      <p className="text-muted-foreground">{job.company}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge
                          variant="secondary"
                          className={
                            job.jobType === "Full-time" ? "bg-green-100 text-green-800" :
                            job.jobType === "Part-time" ? "bg-blue-100 text-blue-800" :
                            job.jobType === "Contract" ? "bg-purple-100 text-purple-800" :
                            "bg-orange-100 text-orange-800"
                          }
                        >
                          {job.jobType}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleShareJob} title="Share Job">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleSaveJob} title="Save Job">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: job.description }} />
                
                <h2 className="text-xl font-semibold mt-8 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Job Overview</h2>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <Building className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <span className="block text-sm text-muted-foreground">Company</span>
                      <span className="font-medium">{job.company}</span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <span className="block text-sm text-muted-foreground">Location</span>
                      <span className="font-medium">{job.location}</span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <span className="block text-sm text-muted-foreground">Job Type</span>
                      <span className="font-medium">{job.jobType}</span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Banknote className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <span className="block text-sm text-muted-foreground">Salary</span>
                      <span className="font-medium">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <span className="block text-sm text-muted-foreground">Posted On</span>
                      <span className="font-medium">{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-6 space-y-3">
                  <Button className="w-full flex items-center gap-1" onClick={handleApplyJob}>
                    Apply Now <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleSaveJob}>
                    Save Job
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <p className="text-sm">
                  For any questions regarding this position, please contact:
                </p>
                <p className="mt-2 font-medium">{job.contactEmail}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
