import { Briefcase, Building2, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import StatsCard from "@/components/StatsCard";
import FeaturedJobs from "@/components/FeaturedJobs";
import HowItWorks from "@/components/HowItWorks";
import PopularCategories from "@/components/PopularCategories";

const Index = () => {
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
          {/* Background Doodles - Optimized SVGs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="doodle top-20 left-10">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary/20">
                <circle cx="12" cy="12" r="5" strokeWidth="1.5" />
                <line x1="12" y1="1" x2="12" y2="3" strokeWidth="1.5" />
                <line x1="12" y1="21" x2="12" y2="23" strokeWidth="1.5" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth="1.5" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth="1.5" />
                <line x1="1" y1="12" x2="3" y2="12" strokeWidth="1.5" />
                <line x1="21" y1="12" x2="23" y2="12" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="doodle top-40 right-20">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary/20">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="doodle bottom-20 left-1/4">
              <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary/20">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

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
};

export default Index;
