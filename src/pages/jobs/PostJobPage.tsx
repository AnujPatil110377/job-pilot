
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { 
  Building, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clipboard, 
  Mail, 
  Link, 
  Upload, 
  File, 
  Trash2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
const LOCATIONS = ["Remote", "Hybrid", "On-site"];

const createJob = async (formData) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/jobs`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to create job');
  }
  
  return response.json();
};

const PostJobPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "",
    salaryMin: "",
    salaryMax: "",
    skills: "",
    description: "",
    applicationLink: "",
    contactEmail: ""
  });
  
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      toast({
        title: "Job Posted",
        description: "Your job has been successfully posted.",
      });
      navigate("/jobs");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post job. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = [
      'title', 'company', 'location', 'jobType', 
      'skills', 'description', 'applicationLink', 'contactEmail'
    ];
    
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      toast({
        title: "Missing Fields",
        description: `Please fill in all required fields: ${emptyFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    // Create form data object for sending
    const submitFormData = new FormData();
    
    for (const key in formData) {
      submitFormData.append(key, formData[key]);
    }
    
    if (logo) {
      submitFormData.append('logo', logo);
    }
    
    mutation.mutate(submitFormData);
  };
  
  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Post a New Job</h1>
          <p className="text-muted-foreground">Fill out the form below to list a new job opening.</p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. Senior Frontend Developer"
                      className="pl-10"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="company"
                      name="company"
                      placeholder="e.g. Acme Inc."
                      className="pl-10"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-muted-foreground" />
                    <Select 
                      value={formData.location} 
                      onValueChange={(value) => handleSelectChange('location', value)}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map(location => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Job Type */}
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type <span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.jobType} 
                    onValueChange={(value) => handleSelectChange('jobType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Salary Range */}
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Salary Range (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="salaryMin"
                        name="salaryMin"
                        type="number"
                        placeholder="Min"
                        className="pl-10"
                        value={formData.salaryMin}
                        onChange={handleChange}
                      />
                    </div>
                    <span className="text-muted-foreground">to</span>
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-3 text-muted-foreground" />
                      <Input
                        id="salaryMax"
                        name="salaryMax"
                        type="number"
                        placeholder="Max"
                        className="pl-10"
                        value={formData.salaryMax}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Skills */}
                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Clipboard className="absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="skills"
                      name="skills"
                      placeholder="e.g. React, JavaScript, CSS (comma separated)"
                      className="pl-10"
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Enter skills separated by commas</p>
                </div>
                
                {/* Application Link */}
                <div className="space-y-2">
                  <Label htmlFor="applicationLink">Application Link <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Link className="absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="applicationLink"
                      name="applicationLink"
                      placeholder="https://..."
                      className="pl-10"
                      value={formData.applicationLink}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                {/* Contact Email */}
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      placeholder="contact@company.com"
                      className="pl-10"
                      value={formData.contactEmail}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                {/* Company Logo */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="logo">Company Logo (Optional)</Label>
                  {logoPreview ? (
                    <div className="flex items-center gap-4">
                      <img 
                        src={logoPreview} 
                        alt="Company Logo Preview" 
                        className="w-16 h-16 object-contain border rounded"
                      />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm"
                        onClick={removeLogo}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-4 flex text-sm justify-center">
                        <label
                          htmlFor="logo-upload"
                          className="relative cursor-pointer rounded-md bg-background font-medium text-primary focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="logo-upload"
                            name="logo"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleLogoChange}
                          />
                        </label>
                        <p className="pl-1 text-muted-foreground">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Job Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Job Description <span className="text-destructive">*</span></Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the job responsibilities, requirements, benefits, etc."
                  rows={8}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="min-w-[120px]"
                >
                  {mutation.isPending ? 'Posting...' : 'Post Job'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PostJobPage;
