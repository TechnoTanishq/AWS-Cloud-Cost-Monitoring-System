import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const API = "http://localhost:8000";

export default function Dashboard() {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  // 🔥 HANDLE GOOGLE TOKEN (FIRST THING)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.location.replace("/dashboard"); // 🔥 HARD RESET
    }
  }, []);

  // 🔥 GET TOKEN
  const token = localStorage.getItem("token");

  // ❗ BLOCK EVERYTHING UNTIL TOKEN EXISTS
  if (!token) {
    return <div className="p-6">Waiting for login...</div>;
  }

  // 🔥 SAFE HOOK CALLS (NOW TOKEN EXISTS)
  const { data: stats, loading: statsLoading } = useDashboardStats();
  const { data: monthly, loading: monthlyLoading } = useMonthlyCosts();
  const { data: services, loading: servicesLoading } = useServiceCosts();

  // 🔥 IAM CHECK
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch(`${API}/iam/connection`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();

        if (!data.connected && !data.is_connected) {
          navigate("/dashboard/iam");
          return;
        }

        setAllowed(true);
      } catch {
        navigate("/login");
      } finally {
        setChecking(false);
      }
    };

    checkAccess();
  }, [navigate, token]);

  // 🔒 UI BLOCK
  if (checking) {
    return <div className="p-6">Checking access...</div>;
  }

  if (!allowed) {
    return null;
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