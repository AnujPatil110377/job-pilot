import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { getRandomQuote } from "@/lib/quotes";

const FEATURES = [
  { 
    title: "Easy Application", 
    desc: "One-click job applications",
    bg: "bg-[#E3F2FD]"
  },
  { 
    title: "Profile Analytics", 
    desc: "Track your application success",
    bg: "bg-[#E8F5E9]"
  },
  { 
    title: "Skill Assessment", 
    desc: "Evaluate your expertise",
    bg: "bg-[#FFF9C4]"
  },
  { 
    title: "Job Alerts", 
    desc: "Real-time opportunity notifications",
    bg: "bg-[#FFEBEE]"
  },
  { 
    title: "AI-Powered", 
    desc: "AI-powered job recommendations",
    bg: "bg-gradient-to-br from-[#BBDEFB] to-[#D1C4E9]"
  },
  { 
    title: "Customizable", 
    desc: "Tailor your job search",
    bg: "bg-[#FFCCBC]"
  },
];

const SignupPage = () => {
  const quote = getRandomQuote();
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (data: { email: string; password: string }) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/password/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      setMessage(result.message);
      
      if (res.status === 201) {
        setIsSuccess(true);
        setTimeout(() => navigate('/auth/login'), 2000);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("An error occurred during signup");
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Logo in Corner */}
      <div className="absolute top-8 left-8 z-50 flex items-center space-x-3">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          JobPilot
        </span>
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob dark:opacity-20"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 dark:opacity-20"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 dark:opacity-20"></div>

      <div className="container relative flex min-h-screen">
        {/* Left Section with Quote and Features */}
        <div className="hidden lg:flex lg:flex-col lg:w-1/2 p-12 justify-start relative">
          {/* Quote */}
          <div className="relative mt-24">
            <div className="absolute -left-8 -top-8">
              <svg className="w-16 h-16 text-gray-200 dark:text-gray-800" fill="currentColor" viewBox="0 0 32 32">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
            </div>
            <blockquote className="relative z-10 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
                {quote.text}
              </p>
              <footer className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                — {quote.author}
              </footer>
            </blockquote>
          </div>

          {/* Features */}
          <div className="space-y-6 mt-20">
            <h3 className=" text-center text-2xl text-gray-600 dark:text-gray-400 font-medium">Why choose JobPilot?</h3>
            <div className="grid grid-cols-2 gap-4">
              {FEATURES.map((feature) => (
                <div 
                  key={feature.title} 
                  className={`p-4 rounded-xl shadow-sm backdrop-blur-sm dark:bg-gray-800/50 ${feature.bg} dark:bg-opacity-10 transition-all duration-300 hover:scale-105`}
                >
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section with Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <AuthForm mode="Signup" onSubmit={handleSignup} />
            {message && (
              <p className={`text-center text-sm ${
                isSuccess ? "text-green-500" : "text-red-500"
              }`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 