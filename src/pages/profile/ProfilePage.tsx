
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  User, 
  MapPin, 
  BriefcaseBusiness, 
  Linkedin, 
  Github, 
  FileText, 
  Upload, 
  Pencil, 
  Save, 
  Loader2, 
  Bookmark, 
  FileCheck 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const fetchUserProfile = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/profile`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Not authenticated');
    }
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
};

const updateUserProfile = async (data) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
  
  return response.json();
};

const uploadResume = async (formData) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/profile/resume`, {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload resume');
  }
  
  return response.json();
};

const removeSavedJob = async (jobId) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/profile/saved-jobs/${jobId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove saved job');
  }
  
  return response.json();
};

const ProfilePage = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    location: "",
    linkedinUrl: "",
    githubUrl: ""
  });
  
  const { toast } = useToast();
  
  const { data: userProfile, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    retry: false
  });
  
  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditMode(false);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive"
      });
    }
  });
  
  const resumeMutation = useMutation({
    mutationFn: uploadResume,
    onSuccess: () => {
      toast({
        title: "Resume Uploaded",
        description: "Your resume has been successfully uploaded.",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload resume.",
        variant: "destructive"
      });
    }
  });
  
  const removeSavedJobMutation = useMutation({
    mutationFn: removeSavedJob,
    onSuccess: () => {
      toast({
        title: "Job Removed",
        description: "The job has been removed from your saved jobs.",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove job.",
        variant: "destructive"
      });
    }
  });
  
  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || "",
        bio: userProfile.bio || "",
        location: userProfile.location || "",
        linkedinUrl: userProfile.linkedinUrl || "",
        githubUrl: userProfile.githubUrl || ""
      });
    }
  }, [userProfile]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };
  
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('resume', file);
      resumeMutation.mutate(formData);
    }
  };
  
  const handleRemoveSavedJob = (jobId) => {
    removeSavedJobMutation.mutate(jobId);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (isError) {
    const errorMessage = error?.message === 'Not authenticated' 
      ? "You need to log in to view your profile." 
      : "Failed to load profile information.";
    
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-destructive">
              {error?.message === 'Not authenticated' ? 'Authentication Required' : 'Error'}
            </h1>
            <p className="mt-4 text-lg">{errorMessage}</p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild>
                <a href="/auth/login">Log In</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/auth/signup">Sign Up</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const calculateProfileCompleteness = () => {
    let completedFields = 0;
    const totalFields = 6; // avatar, displayName, bio, location, linkedin, github
    
    if (userProfile.avatar) completedFields += 1;
    if (userProfile.displayName) completedFields += 1;
    if (userProfile.bio) completedFields += 1;
    if (userProfile.location) completedFields += 1;
    if (userProfile.linkedinUrl) completedFields += 1;
    if (userProfile.githubUrl) completedFields += 1;
    
    return Math.round((completedFields / totalFields) * 100);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar with user info */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden mb-4">
                    {userProfile.avatar ? (
                      <img 
                        src={userProfile.avatar} 
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 text-primary" />
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold">{userProfile.displayName || "User"}</h2>
                  <p className="text-muted-foreground">{userProfile.email}</p>
                  
                  {userProfile.location && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{userProfile.location}</span>
                    </div>
                  )}
                  
                  <div className="flex gap-3 mt-4">
                    {userProfile.linkedinUrl && (
                      <a 
                        href={userProfile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    
                    {userProfile.githubUrl && (
                      <a 
                        href={userProfile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-400"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  
                  <div className="w-full mt-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Profile Completeness</span>
                      <span>{calculateProfileCompleteness()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${calculateProfileCompleteness()}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {userProfile.resume ? (
                    <div className="mt-6 w-full">
                      <a 
                        href={userProfile.resume} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-primary hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                        View Resume
                      </a>
                    </div>
                  ) : (
                    <div className="mt-6 w-full">
                      <p className="text-sm text-muted-foreground mb-2">You haven't uploaded a resume yet</p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => document.getElementById('resume-upload').click()}
                        disabled={resumeMutation.isPending}
                      >
                        {resumeMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Resume
                          </>
                        )}
                      </Button>
                      <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleResumeUpload}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div className="md:col-span-2">
            <Tabs defaultValue="profile">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
                <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Profile Information</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditMode(!isEditMode)}
                    >
                      {isEditMode ? (
                        <>Cancel</>
                      ) : (
                        <>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isEditMode ? (
                      <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="displayName" className="text-sm font-medium">Display Name</label>
                          <Input
                            id="displayName"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="bio" className="text-sm font-medium">Bio</label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="location" className="text-sm font-medium">Location</label>
                          <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="linkedinUrl" className="text-sm font-medium">LinkedIn URL</label>
                          <Input
                            id="linkedinUrl"
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="githubUrl" className="text-sm font-medium">GitHub URL</label>
                          <Input
                            id="githubUrl"
                            name="githubUrl"
                            value={formData.githubUrl}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Display Name</h3>
                          <p className="mt-1">{userProfile.displayName || "Not provided"}</p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                          <p className="mt-1">{userProfile.bio || "Not provided"}</p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                          <p className="mt-1">{userProfile.location || "Not provided"}</p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">LinkedIn</h3>
                          <p className="mt-1">
                            {userProfile.linkedinUrl ? (
                              <a 
                                href={userProfile.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {userProfile.linkedinUrl}
                              </a>
                            ) : (
                              "Not provided"
                            )}
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">GitHub</h3>
                          <p className="mt-1">
                            {userProfile.githubUrl ? (
                              <a 
                                href={userProfile.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {userProfile.githubUrl}
                              </a>
                            ) : (
                              "Not provided"
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="saved">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userProfile.savedJobs?.length > 0 ? (
                      <div className="space-y-4">
                        {userProfile.savedJobs.map(job => (
                          <div key={job._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{job.title}</h3>
                                <p className="text-sm text-muted-foreground">{job.company}</p>
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
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleRemoveSavedJob(job._id)}
                                >
                                  Remove
                                </Button>
                                <Button asChild size="sm">
                                  <a href={`/jobs/${job._id}`}>View</a>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No saved jobs yet</h3>
                        <p className="text-muted-foreground mt-1">
                          Jobs you save will appear here for easy access.
                        </p>
                        <Button asChild className="mt-4">
                          <a href="/jobs">Browse Jobs</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="applied">
                <Card>
                  <CardHeader>
                    <CardTitle>Applied Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userProfile.appliedJobs?.length > 0 ? (
                      <div className="space-y-4">
                        {userProfile.appliedJobs.map(({ job, appliedAt }) => (
                          <div key={job._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{job.title}</h3>
                                <p className="text-sm text-muted-foreground">{job.company}</p>
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
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Applied: {new Date(appliedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Button asChild size="sm">
                                <a href={`/jobs/${job._id}`}>View</a>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No applied jobs yet</h3>
                        <p className="text-muted-foreground mt-1">
                          Jobs you apply to will be tracked here.
                        </p>
                        <Button asChild className="mt-4">
                          <a href="/jobs">Browse Jobs</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
