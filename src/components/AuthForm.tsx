"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  mode: "Login" | "Signup";
  onSubmit: (data: { email: string; password: string }) => void;
}

const AuthForm = ({ mode, onSubmit }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit({ email, password });
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md space-y-6 bg-[#1A1F2C]/80 dark:bg-gray-900/50 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/10">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {mode === "Login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-gray-400">
          {mode === "Login" 
            ? "Welcome! Please enter your details to sign in." 
            : "Welcome! Please fill in the details to get started."}
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="w-full h-12 text-sm font-medium bg-white/5 hover:bg-white/10 text-white border-white/10" 
            onClick={() => {}} 
            disabled={isLoading}
          >
            <Icons.gitHub className="w-5 h-5 mr-2" />
            GitHub
          </Button>

          <Button 
            variant="outline" 
            className="w-full h-12 text-sm font-medium bg-white/5 hover:bg-white/10 text-white border-white/10" 
            onClick={() => {}} 
            disabled={isLoading}
          >
            <Icons.google className="w-5 h-5 mr-2" />
            Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#1A1F2C] dark:bg-gray-900 px-2 text-gray-400">
              or
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Email address
            </label>
            <Input
              type="email"
              placeholder="Enter your email address"
              className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button 
            className="w-full h-12 text-sm font-medium bg-[#7C3AED] hover:bg-[#6D28D9] text-white" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {mode === "Login" ? "Sign in" : "Continue"}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-400">
        {mode === "Login" ? (
          <>
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-[#7C3AED] hover:text-[#6D28D9] font-medium">
              Sign up
            </a>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <a href="/auth/login" className="text-[#7C3AED] hover:text-[#6D28D9] font-medium">
              Sign in
            </a>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthForm;