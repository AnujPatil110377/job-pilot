
import { Bookmark } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

interface Job {
  id: string;
  title: string;
  type: "FULL-TIME" | "PART-TIME" | "INTERNSHIP" | "CONTRACT";
  salary: string;
  company: string;
  location: string;
  logo?: string;
}

const jobs: Job[] = [
  {
    id: "job1",
    title: "Senior Frontend Developer",
    type: "FULL-TIME",
    salary: "$90,000 - $130,000",
    company: "TechCorp Solutions",
    location: "Remote",
    logo: "/lovable-uploads/9efed962-e3da-400b-9f2a-57861ca8355c.png"
  },
  {
    id: "job2",
    title: "Backend Engineer",
    type: "FULL-TIME",
    salary: "$95,000 - $140,000",
    company: "DataFlow Systems",
    location: "Hybrid",
  },
  {
    id: "job3",
    title: "UX/UI Designer",
    type: "FULL-TIME",
    salary: "$75,000 - $110,000",
    company: "Creative Digital",
    location: "On-site",
  },
  {
    id: "job4",
    title: "DevOps Engineer",
    type: "CONTRACT",
    salary: "$100,000 - $150,000",
    company: "CloudNine Technologies",
    location: "Remote",
  },
  {
    id: "job5",
    title: "Product Manager",
    type: "FULL-TIME", 
    salary: "$105,000 - $145,000",
    company: "InnovateTech",
    location: "Hybrid",
  },
  {
    id: "job6",
    title: "Marketing Coordinator",
    type: "PART-TIME",
    salary: "$35,000 - $45,000",
    company: "GrowthHackers",
    location: "On-site",
  },
];

const FeaturedJobs = () => {
  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Featured Jobs</h2>
        <Link to="/jobs" className="text-primary hover:underline">
          View All →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="group hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                    {job.logo ? (
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {job.company.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
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
                    job.type === "CONTRACT" ? "bg-purple-100 text-purple-800" :
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
              
              <div className="mt-6">
                <Link to={`/jobs/${job.id}`} className="text-primary text-sm font-medium hover:underline">
                  View Details →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturedJobs;
