import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";

const LoginPage = () => {
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/password/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      setMessage(result.message);
      
      if (res.status === 200) {
        setIsSuccess(true);
        setTimeout(() => navigate('/'), 2000);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("An error occurred during login");
      setIsSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <div className="container relative flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md space-y-8">
          <AuthForm mode="Login" onSubmit={handleLogin} />
          
          {message && (
            <p
              className={`text-center text-sm ${
                isSuccess ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
          
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link 
              to="/auth/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 