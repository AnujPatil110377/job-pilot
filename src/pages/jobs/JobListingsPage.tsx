
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  MapPin, 
  BriefcaseBusiness, 
  Banknote, 
  ArrowLeft, 
  ArrowRight, 
  Bookmark, 
  ExternalLink 
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";

const LOCATION_OPTIONS = ["Remote", "Hybrid", "On-site"];
const JOB_TYPE_OPTIONS = ["Full-time", "Part-time", "Contract", "Internship"];

// Sample job data to display while API is loading or as fallback
const SAMPLE_JOBS = [
  {
    _id: "job1",
    title: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    location: "Remote",
    jobType: "Full-time",
    salaryMin: 90000,
    salaryMax: 130000,
    skills: ["React", "TypeScript", "Redux", "Tailwind CSS"],
    description: "We are looking for an experienced Frontend Developer with strong React and TypeScript skills to join our remote team. You'll be responsible for building responsive user interfaces and implementing complex features for our enterprise clients.",
    logo: "/lovable-uploads/9efed962-e3da-400b-9f2a-57861ca8355c.png",
    applicationLink: "https://example.com/apply"
  },
  {
    _id: "job2",
    title: "Backend Engineer",
    company: "DataFlow Systems",
    location: "Hybrid",
    jobType: "Full-time",
    salaryMin: 95000,
    salaryMax: 140000,
    skills: ["Node.js", "Express", "MongoDB", "Docker", "AWS"],
    description: "Join our engineering team to build scalable backend services and APIs. You'll work on our core infrastructure, implement new features, and optimize performance for high-traffic applications.",
    logo: null,
    applicationLink: "https://example.com/apply"
  },
  {
    _id: "job3",
    title: "UX/UI Designer",
    company: "Creative Digital",
    location: "On-site",
    jobType: "Full-time",
    salaryMin: 75000,
    salaryMax: 110000,
    skills: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping"],
    description: "We're seeking a talented UX/UI Designer to create exceptional user experiences for our clients. You'll collaborate with product managers and developers to deliver intuitive and visually appealing interfaces.",
    logo: null,
    applicationLink: "https://example.com/apply"
  },
  {
    _id: "job4",
    title: "DevOps Engineer",
    company: "CloudNine Technologies",
    location: "Remote",
    jobType: "Contract",
    salaryMin: 100000,
    salaryMax: 150000,
    skills: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Monitoring"],
    description: "Help us build and maintain our cloud infrastructure and deployment pipelines. You'll be responsible for implementing automation, improving system reliability, and optimizing our development workflow.",
    logo: null,
    applicationLink: "https://example.com/apply"
  },
  {
    _id: "job5",
    title: "Product Manager",
    company: "InnovateTech",
    location: "Hybrid",
    jobType: "Full-time",
    salaryMin: 105000,
    salaryMax: 145000,
    skills: ["Product Strategy", "User Stories", "Roadmapping", "Agile", "Market Research"],
    description: "We're looking for a Product Manager to lead our product development efforts. You'll define product vision, gather requirements, and work closely with design and engineering teams to deliver valuable features to our users.",
    logo: null,
    applicationLink: "https://example.com/apply"
  },
  {
    _id: "job6",
    title: "Data Scientist",
    company: "Analytix",
    location: "Remote",
    jobType: "Full-time",
    salaryMin: 90000,
    salaryMax: 135000,
    skills: ["Python", "Machine Learning", "SQL", "Data Visualization", "Statistics"],
    description: "Join our data science team to analyze complex datasets and build predictive models. You'll extract meaningful insights from data and help drive business decisions through data-driven approaches.",
    logo: null,
    applicationLink: "https://example.com/apply"
  },
  {
    _id: "job7",
    title: "Mobile Developer (iOS)",
    company: "AppWorks",
    location: "On-site",
    jobType: "Full-time",
    salaryMin: 85000,
    salaryMax: 125000,
    skills: ["Swift", "UIKit", "CoreData", "REST APIs", "Git"],
    description: "We need a talented iOS developer to create and maintain mobile applications for our clients. You'll be responsible for implementing new features, fixing bugs, and ensuring high-quality user experiences on iOS devices.",
    logo: null,
    applicationLink: "https://example.com/apply"
  },
  {
    _id: "job8",
    title: "Quality Assurance Engineer",
    company: "SecureCode",
    location: "Hybrid",
    jobType: "Full-time",
    salaryMin: 70000,
    salaryMax: 100000,
    skills: ["Test Automation", "Selenium", "API Testing", "JIRA", "Agile"],
    description: "Join our QA team to ensure the quality and reliability of our software. You'll design and execute test plans, automate testing processes, and work closely with developers to identify and address issues.",
    logo: null,
    applicationLink: "https://example.com/apply"
  },
  {
    _id: "job9",
    title: "Technical Content Writer",
    company: "TechDocs",
    location: "Remote",
    jobType: "Part-time",
    salaryMin: 40000,
    salaryMax: 60000,
    skills: ["Technical Writing", "Markdown", "Documentation", "Research", "Editing"],
    description: "We're looking for a skilled technical writer to create clear and concise documentation for our software products. You'll work with engineers to understand complex technical concepts and explain them in accessible language.",
    logo: null,
    applicationLink: "https://example.com/apply"
  },
  {
    _id: "job10",
    title: "Marketing Coordinator",
    company: "GrowthHackers",
    location: "On-site",
    jobType: "Internship",
    salaryMin: 35000,
    salaryMax: 45000,
    skills: ["Social Media", "Email Marketing", "Content Creation", "Analytics", "SEO"],
    description: "Join our marketing team to help promote our products and services. You'll assist with social media campaigns, email marketing, content creation, and analyzing the effectiveness of our marketing efforts.",
    logo: null,
    applicationLink: "https://example.com/apply"
  }
];

// Function to fetch jobs
const fetchJobs = async (params: Record<string, string>) => {
  try {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    // Return formatted sample data as fallback
    return {
      jobs: SAMPLE_JOBS,
      total: SAMPLE_JOBS.length,
      totalPages: 1,
      currentPage: 1
    };
  }
};

// Function to save a job
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

const JobListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
    limit: "10"
  });
  
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    jobType: searchParams.get("jobType") || "",
    minSalary: searchParams.get("minSalary") || "0",
    maxSalary: searchParams.get("maxSalary") || "200000"
  });
  
  const { toast } = useToast();
  
  // Set up the query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['jobs', Object.fromEntries(searchParams)],
    queryFn: () => fetchJobs(Object.fromEntries(searchParams)),
  });
  
  useEffect(() => {
    // Update search params when filters change
    const newParams = { ...Object.fromEntries(searchParams) };
    
    if (filters.search) newParams.search = filters.search;
    else delete newParams.search;
    
    if (filters.location) newParams.location = filters.location;
    else delete newParams.location;
    
    if (filters.jobType) newParams.jobType = filters.jobType;
    else delete newParams.jobType;
    
    if (filters.minSalary !== "0") newParams.minSalary = filters.minSalary;
    else delete newParams.minSalary;
    
    if (filters.maxSalary !== "200000") newParams.maxSalary = filters.maxSalary;
    else delete newParams.maxSalary;
    
    setSearchParams(newParams);
  }, [filters]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };
  
  const handleSaveJob = async (jobId: string) => {
    try {
      await saveJob(jobId);
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
  
  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set('page', newPage.toString());
      return params;
    });
  };
  
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with filters */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Filter Jobs</h2>
              
              <div className="space-y-6">
                {/* Location filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Location</h3>
                  <div className="space-y-2">
                    {LOCATION_OPTIONS.map(option => (
                      <div key={option} className="flex items-center">
                        <input
                          type="radio"
                          id={`location-${option}`}
                          name="location"
                          className="mr-2"
                          checked={filters.location === option}
                          onChange={() => setFilters({ ...filters, location: option })}
                        />
                        <label htmlFor={`location-${option}`}>{option}</label>
                      </div>
                    ))}
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="location-all"
                        name="location"
                        className="mr-2"
                        checked={!filters.location}
                        onChange={() => setFilters({ ...filters, location: "" })}
                      />
                      <label htmlFor="location-all">All Locations</label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Job Type filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Job Type</h3>
                  <div className="space-y-2">
                    {JOB_TYPE_OPTIONS.map(option => (
                      <div key={option} className="flex items-center">
                        <input
                          type="radio"
                          id={`jobType-${option}`}
                          name="jobType"
                          className="mr-2"
                          checked={filters.jobType === option}
                          onChange={() => setFilters({ ...filters, jobType: option })}
                        />
                        <label htmlFor={`jobType-${option}`}>{option}</label>
                      </div>
                    ))}
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="jobType-all"
                        name="jobType"
                        className="mr-2"
                        checked={!filters.jobType}
                        onChange={() => setFilters({ ...filters, jobType: "" })}
                      />
                      <label htmlFor="jobType-all">All Job Types</label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Salary Range filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Salary Range</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>${parseInt(filters.minSalary).toLocaleString()}</span>
                      <span>${parseInt(filters.maxSalary).toLocaleString()}</span>
                    </div>
                    <div className="px-2">
                      <Slider
                        defaultValue={[parseInt(filters.minSalary), parseInt(filters.maxSalary)]}
                        min={0}
                        max={200000}
                        step={5000}
                        onValueChange={(values) => {
                          setFilters({
                            ...filters,
                            minSalary: values[0].toString(),
                            maxSalary: values[1].toString()
                          });
                        }}
                        className="mt-6"
                      />
                    </div>
                  </div>
                </div>
                
                <Button onClick={() => {
                  setFilters({
                    search: "",
                    location: "",
                    jobType: "",
                    minSalary: "0",
                    maxSalary: "200000"
                  });
                }} variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-3">
            {/* Search form */}
            <div className="mb-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search job title, company or skills..."
                    className="pl-10"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </div>

            {/* Results count */}
            {data && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {data.jobs.length} of {data.total} jobs
                </p>
              </div>
            )}
            
            {/* Job listings */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                  <p className="mt-4 text-lg">Loading jobs...</p>
                </div>
              ) : isError ? (
                <div className="text-center py-12">
                  <p className="text-lg text-destructive">Error loading jobs. Please try again.</p>
                </div>
              ) : data?.jobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg">No jobs found matching your criteria.</p>
                </div>
              ) : (
                data?.jobs.map((job) => (
                  <Card key={job._id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex justify-between">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                              {job.logo ? (
                                <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                              ) : (
                                <BriefcaseBusiness className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                {job.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {job.company}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleSaveJob(job._id)}
                            title="Save Job"
                          >
                            <Bookmark className="w-5 h-5" />
                          </Button>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
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
                            <Banknote className="w-3 h-3" />
                            {formatSalary(job.salaryMin, job.salaryMax)}
                          </Badge>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium text-sm mb-2">Required Skills:</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {job.description}
                          </p>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                          <a href={`/jobs/${job._id}`}>
                            <Button variant="outline" className="mr-2">
                              View Details
                            </Button>
                          </a>
                          <a href={job.applicationLink} target="_blank" rel="noopener noreferrer">
                            <Button className="flex items-center gap-1">
                              Apply Now <ExternalLink className="w-4 h-4 ml-1" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={data.currentPage <= 1}
                    onClick={() => handlePageChange(data.currentPage - 1)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  
                  <span className="mx-4 text-sm">
                    Page {data.currentPage} of {data.totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={data.currentPage >= data.totalPages}
                    onClick={() => handlePageChange(data.currentPage + 1)}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobListingsPage;
