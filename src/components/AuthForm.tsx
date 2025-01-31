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
    <div className="w-full space-y-6 bg-white dark:bg-gray-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "Login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "Login" 
            ? "Welcome! Please enter your details to sign in." 
            : "Welcome! Please fill in the details to get started."}
        </p>
      </div>

      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full h-12 text-sm font-medium border-2 hover:bg-gray-50 dark:hover:bg-gray-800/50" 
          onClick={() => {}} 
          disabled={isLoading}
        >
          <Icons.gitHub className="w-5 h-5 mr-3" />
          Continue with GitHub
        </Button>

        <Button 
          variant="outline" 
          className="w-full h-12 text-sm font-medium border-2 hover:bg-gray-50 dark:hover:bg-gray-800/50" 
          onClick={() => {}} 
          disabled={isLoading}
        >
          <Icons.google className="w-5 h-5 mr-3" />
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">
              or
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-muted-foreground">
              Email address
            </label>
            <Input
              type="email"
              placeholder="Enter your email address"
              className="py-5 bg-transparent border-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="py-5 bg-transparent border-2 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
            className="w-full py-6 text-sm font-medium bg-primary hover:bg-primary/90" 
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

      <p className="text-center text-sm text-muted-foreground">
        {mode === "Login" ? (
          <>
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-primary hover:underline font-medium">
              Sign up
            </a>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <a href="/auth/login" className="text-primary hover:underline font-medium">
              Sign in
            </a>
          </>
        )}
      </p>
    </div>
  );
};

export default AuthForm;