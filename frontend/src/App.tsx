import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AwsProvider } from "@/contexts/AwsContext";
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
import GoogleCallback from "./pages/GoogleCallback";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("finsight_user");
  if (!isAuthenticated && !storedToken && !storedUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/costs" element={<ProtectedRoute><CostBreakdown /></ProtectedRoute>} />
      <Route path="/dashboard/ml" element={<ProtectedRoute><MLInsights /></ProtectedRoute>} />
      <Route path="/dashboard/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
      <Route path="/dashboard/iam" element={<ProtectedRoute><IAMIntegration /></ProtectedRoute>} />
      <Route path="/dashboard/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<NotFound />} />
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
          <AwsProvider>
            <AppRoutes />
          </AwsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;