import { Bookmark } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface Job {
  title: string;
  type: "FULL-TIME" | "PART-TIME" | "INTERNSHIP";
  salary: string;
  company: string;
  location: string;
}

const jobs: Job[] = [
  {
    title: "Technical Support Specialist",
    type: "PART-TIME",
    salary: "$20,000 - $25,000",
    company: "Google Inc.",
    location: "Dhaka, Bangladesh",
  },
  {
    title: "Senior UX Designer",
    type: "FULL-TIME",
    salary: "$20,000 - $25,000",
    company: "Google Inc.",
    location: "Dhaka, Bangladesh",
  },
  {
    title: "Marketing Officer",
    type: "INTERNSHIP",
    salary: "$20,000 - $25,000",
    company: "Google Inc.",
    location: "Dhaka, Bangladesh",
  },
  // Add more jobs as needed
];

const FeaturedJobs = () => {
  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Featured job</h2>
        <a href="#" className="text-primary hover:underline">
          View All →
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <Card key={index} className="group hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <img
                    src="/lovable-uploads/9efed962-e3da-400b-9f2a-57861ca8355c.png"
                    alt={job.company}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-primary transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-4">
                <Badge 
                  variant="secondary" 
                  className={
                    job.type === "FULL-TIME" ? "bg-green-100 text-green-800" :
                    job.type === "PART-TIME" ? "bg-blue-100 text-blue-800" :
                    "bg-orange-100 text-orange-800"
                  }
                >
                  {job.type}
                </Badge>
                <p className="mt-2 text-sm text-muted-foreground">
                  Salary: {job.salary}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {job.location}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedJobs;