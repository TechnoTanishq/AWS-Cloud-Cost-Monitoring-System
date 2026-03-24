import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle OAuth callback errors and pre-fill email
 useEffect(() => {
  const params = new URLSearchParams(location.search);

  const token = params.get("token");
  const emailFromGoogle = params.get("email");

  // 👇 THIS PART WAS MISSING / WRONG
  if (token) {
    localStorage.setItem("token", token);

    if (emailFromGoogle) {
      localStorage.setItem("email", emailFromGoogle);
    }

    toast.success("Google login successful");

    navigate("/dashboard");
  }

  // existing logic (keep it)
  const error = params.get("error");

  if (error === "user_not_registered" && emailFromGoogle) {
    toast.error(`Email "${emailFromGoogle}" is not registered.`);
    setEmail(emailFromGoogle);
  }
}, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.ok) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        if (result.error?.includes("not registered")) {
          toast.error("You're not registered yet. Please create an account.");
          setTimeout(() => navigate("/register"), 1500);
        } else {
          toast.error(result.error || "Login failed");
        }
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      const backendBase = `${window.location.protocol}//${window.location.hostname}:8000/auth`;
      window.location.href = `${backendBase}/google/login`;
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900">FinSight</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Sign in</h1>
        <p className="text-slate-600 text-center text-sm">Use your email and password to sign in</p>
      </motion.div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-sm"
      >
        {/* Google Sign In Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 flex items-center justify-center gap-3 border border-slate-300 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 mb-6 bg-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-medium text-slate-700">Sign in with Google</span>
          </button>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="flex-1 h-px bg-slate-300" />
          <span className="text-xs text-slate-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-slate-300" />
        </motion.div>

        {/* Email/Password Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          {/* Email Field */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              maxLength={255}
              disabled={loading}
              className="h-10 rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Forgot?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              maxLength={128}
              disabled={loading}
              className="h-10 rounded-md border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </motion.form>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center text-sm text-slate-600 mt-8"
      >
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
          Create account
        </Link>
      </motion.p>
    </div>
  );
}