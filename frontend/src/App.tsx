import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CostBreakdown from "./pages/CostBreakdown";
import MLInsights from "./pages/MLInsights";
import Budgets from "./pages/Budgets";
import IAMIntegration from "./pages/IAMIntegration";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  // Allow the route to render if a token is present in the URL (OAuth callback)
  const params = new URLSearchParams(window.location.search);
  const tokenInUrl = params.get("token");
  // also allow if a valid token is stored locally (in case context is not yet hydrated)
  const storedToken = localStorage.getItem("token");
  if (!isAuthenticated && !tokenInUrl && !storedToken) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/login" element={<Login />} />
      {/* OAuth callback route - handled by AuthContext effect inside Login */}
      <Route path="/auth/google/callback" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/costs" element={<ProtectedRoute><CostBreakdown /></ProtectedRoute>} />
      <Route path="/dashboard/ml" element={<ProtectedRoute><MLInsights /></ProtectedRoute>} />
      <Route path="/dashboard/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
      <Route path="/dashboard/iam" element={<ProtectedRoute><IAMIntegration /></ProtectedRoute>} />
      <Route path="/dashboard/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
