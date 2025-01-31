import { Briefcase, Building2, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import StatsCard from "@/components/StatsCard";
import FeaturedJobs from "@/components/FeaturedJobs";
import HowItWorks from "@/components/HowItWorks";
import PopularCategories from "@/components/PopularCategories";

export default function Home() {
  const suggestions = [
    "Designer",
    "Programming",
    "Digital Marketing",
    "Video",
    "Animation",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Find a job that suits
                <br />
                your interest & skills.
              </h1>
              <p className="text-lg text-gray-600">
                Discover opportunities that align with your expertise and passions. Your next career move starts here.
              </p>
              
              <SearchBar />
              
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="text-gray-500">Suggestion:</span>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    className="text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    {suggestion}
                    {index < suggestions.length - 1 && ","}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative hidden md:block">
              <img src="/cutie.svg" alt="Cutie" className="w-12/4 h-auto object-contain" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              icon={<Briefcase className="w-6 h-6" />}
              value={175324}
              label="Live Jobs"
              delay={0}
            />
            <StatsCard
              icon={<Building2 className="w-6 h-6" />}
              value={97354}
              label="Companies"
              delay={200}
            />
            <StatsCard
              icon={<Users className="w-6 h-6" />}
              value={3847154}
              label="Candidates"
              delay={400}
            />
            <StatsCard
              icon={<Briefcase className="w-6 h-6" />}
              value={7532}
              label="New Jobs"
              delay={600}
            />
          </div>
        </div>

        {/* Featured Jobs Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedJobs />
        </div>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Popular Categories Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PopularCategories />
        </div>
      </main>
    </div>
  );
}