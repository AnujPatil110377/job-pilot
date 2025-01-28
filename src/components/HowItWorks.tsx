import { UserPlus, Upload, Search, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="w-6 h-6 text-primary" />,
    title: "Create account",
    description: "Aliquam facilisis egestas sapien, nec tempor leo tristique at.",
  },
  {
    icon: <Upload className="w-6 h-6 text-primary" />,
    title: "Upload CV/Resume",
    description: "Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales.",
  },
  {
    icon: <Search className="w-6 h-6 text-primary" />,
    title: "Find suitable job",
    description: "Phasellus quis eleifend ex. Morbi nec fringilla nibh.",
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-primary" />,
    title: "Apply job",
    description: "Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales purus.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">How jobpilot work</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                  {step.icon}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5">
                  <div className="w-full h-full border-t-2 border-dashed border-primary/30" />
                </div>
              )}
              
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;