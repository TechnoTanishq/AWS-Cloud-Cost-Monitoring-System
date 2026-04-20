import { useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useDashboardStats, useMonthlyCosts, useServiceCosts } from "@/hooks/useAwsData";
import { useAws } from "@/contexts/AwsContext";
import { ExportReportButton } from "@/components/ExportReportButton";
import { DollarSign, TrendingUp, Target, FolderOpen, Info, AlertCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

const COLORS = ["hsl(220,72%,50%)", "hsl(200,80%,50%)", "hsl(160,60%,45%)", "hsl(35,90%,55%)"];

export default function Dashboard() {
  const { connection, loading: awsLoading } = useAws();
  const noIamConnected = !awsLoading && !connection?.roleArn;

  const { data: stats, loading: statsLoading, error: statsError, isMock: statsMock } = useDashboardStats();
  const { data: monthly, loading: monthlyLoading, isMock: monthlyMock } = useMonthlyCosts();
  const { data: services, loading: servicesLoading, isMock: servicesMock } = useServiceCosts();

  const isMockData = statsMock || monthlyMock || servicesMock;

  // Handle Google OAuth token on redirect
  // Handle Google OAuth token on redirect (legacy fallback)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  const validStats = stats && typeof stats.currentMonthCost === "number" ? stats : null;

  const statCards = validStats ? [
    { label: "Current Month Cost", value: "$" + validStats.currentMonthCost.toLocaleString(), icon: DollarSign, change: null },
    { label: "Predicted Month-End", value: "$" + validStats.predictedMonthEnd.toLocaleString(), icon: TrendingUp, change: "+" + validStats.monthOverMonthChange + "%" },
    { label: "Budget Utilization", value: validStats.budgetUtilization + "%", icon: Target, change: null },
    { label: "Active Projects", value: String(validStats.activeProjects), icon: FolderOpen, change: null },
  ] : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Top bar with export */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Overview</h2>
            <p className="text-xs text-muted-foreground">Your AWS cost summary</p>
          </div>
          <ExportReportButton />
        </div>

        {/* No IAM connected banner */}
        {noIamConnected && (
          <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  No AWS account connected — showing sample data
                </p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/70 mt-0.5">
                  Connect your AWS account via IAM Integration to see your real cost data.
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="shrink-0 gap-2 border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10">
              <Link to="/dashboard/iam">
                <Shield className="h-4 w-4" />
                Connect AWS
              </Link>
            </Button>
          </div>
        )}

        {/* Data not yet ingested banner (connected but no real data) */}
        {!noIamConnected && isMockData && !statsLoading && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-600 dark:text-blue-400">
              AWS Cost Explorer data is not yet available — it can take up to 24 hours after first enabling Cost Explorer.
              Showing sample data in the meantime.
            </p>
          </div>
        )}

        {/* Error banner */}
        {statsError && !statsLoading && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Could not load AWS cost data. Check your IAM role permissions.</span>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card-elevated p-5 animate-pulse h-24 bg-muted/40 rounded-xl" />
              ))
            : statCards.map((s) => (
                <div key={s.label} className="card-elevated p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
                    <s.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  {s.change && (
                    <p className="text-xs text-primary mt-1 font-medium">{s.change} vs last month</p>
                  )}
                </div>
              ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-elevated p-5">
            <h3 className="font-semibold text-sm mb-4">Monthly Cost Trend</h3>
            {monthlyLoading ? (
              <div className="h-64 animate-pulse bg-muted/40 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={Array.isArray(monthly) ? monthly : []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
                  <Tooltip contentStyle={{ borderRadius: "0.5rem" }} />
                  <Line type="monotone" dataKey="cost" stroke="hsl(220,72%,50%)" strokeWidth={2} dot={{ r: 4 }} name="Actual" />
                  <Line type="monotone" dataKey="predicted" stroke="hsl(200,80%,50%)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Predicted" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card-elevated p-5">
            <h3 className="font-semibold text-sm mb-4">Service-wise Breakdown</h3>
            {servicesLoading ? (
              <div className="h-64 animate-pulse bg-muted/40 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={Array.isArray(services) ? services : []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
                  <YAxis dataKey="service" type="category" tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" width={80} />
                  <Tooltip contentStyle={{ borderRadius: "0.5rem" }} />
                  <Bar dataKey="cost" fill="hsl(220,72%,50%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Service list */}
        {!servicesLoading && Array.isArray(services) && services.length > 0 && (
          <div className="card-elevated p-5">
            <h3 className="font-semibold text-sm mb-4">Service Cost Summary</h3>
            <div className="space-y-3">
              {services.slice(0, 6).map((s, i) => (
                <div key={s.service} className="flex items-center gap-4">
                  <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-medium w-28">{s.service}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full gradient-bg" style={{ width: s.percentage + "%" }} />
                  </div>
                  <span className="text-sm text-muted-foreground w-20 text-right">${s.cost.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground w-10 text-right">{s.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
