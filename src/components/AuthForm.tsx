"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";

interface AuthFormProps {
  mode: "Login" | "Signup";
  onSubmit: (data: { email: string; password: string }) => void;
}

const AuthForm = ({ mode, onSubmit }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit({ email, password });
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "Login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "Login" 
            ? "Enter your credentials to access your account" 
            : "Welcome! Please fill in the details to get started."}
        </p>
      </div>

      <div className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full py-6 text-sm font-medium" 
          onClick={() => {}} 
          disabled={isLoading}
        >
          <Icons.gitHub className="w-5 h-5 mr-3" />
          Continue with GitHub
        </Button>

        <Button 
          variant="outline" 
          className="w-full py-6 text-sm font-medium" 
          onClick={() => {}} 
          disabled={isLoading}
        >
          <Icons.google className="w-5 h-5 mr-3" />
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              or continue with
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
              className="py-5"
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
            <Input
              type="password"
              placeholder="Enter your password"
              className="py-5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <Button 
            className="w-full py-6 text-sm font-medium bg-primary" 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="w-4 h-4 mr-2 animate-spin" />
            )}
            {mode === "Login" ? "Sign in" : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;