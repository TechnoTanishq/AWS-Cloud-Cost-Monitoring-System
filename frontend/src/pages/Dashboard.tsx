import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  useDashboardStats,
  useMonthlyCosts,
  useServiceCosts,
} from "@/hooks/useAwsData";
import { DollarSign, TrendingUp, Target, FolderOpen } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import { toast } from "sonner";

const COLORS = ["hsl(220,72%,50%)", "hsl(200,80%,50%)", "hsl(160,60%,45%)", "hsl(35,90%,55%)"];
const API = "http://localhost:8000";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  // ✅ ALWAYS CALL HOOKS (no condition)
  const { data: stats, loading: statsLoading } = useDashboardStats();
  const { data: monthly, loading: monthlyLoading } = useMonthlyCosts();
  const { data: services, loading: servicesLoading } = useServiceCosts();

  // 🔥 Google login handler
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
    }
  }, [location, navigate]);

  // 🔥 AUTH + IAM CHECK
  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API}/iam/connection`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("IAM check:", data);

        if (!data.connected) {
          toast.info("Please connect your AWS account.");
          navigate("/dashboard/iam");
          return;
        }

        setAllowed(true);
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setChecking(false);
      }
    };

    checkAccess();
  }, [navigate]);

  // 🚫 BLOCK UI SAFELY (after hooks)
  if (checking) {
    return <div className="p-6">Checking access...</div>;
  }

  if (!allowed) {
    return null; // redirect already triggered
  }

  const statCards = stats ? [
    { label: "Current Month Cost", value: `$${stats.currentMonthCost}`, icon: DollarSign },
    { label: "Predicted Month-End", value: `$${stats.predictedMonthEnd}`, icon: TrendingUp },
    { label: "Budget Utilization", value: `${stats.budgetUtilization}%`, icon: Target },
    { label: "Active Projects", value: stats.activeProjects, icon: FolderOpen },
  ] : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
              ))
            : statCards.map((s) => (
                <div key={s.label} className="card-elevated p-5">
                  <div className="flex justify-between">
                    <span className="text-xs">{s.label}</span>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                </div>
              ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="card-elevated p-5">
            <h3 className="mb-4">Monthly Cost</h3>
            {monthlyLoading ? (
              <div className="h-64 bg-muted animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={monthly || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cost" strokeWidth={2} />
                  <Line type="monotone" dataKey="predicted" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card-elevated p-5">
            <h3 className="mb-4">Service Breakdown</h3>
            {servicesLoading ? (
              <div className="h-64 bg-muted animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={services || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="service" type="category" />
                  <Tooltip />
                  <Bar dataKey="cost" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}