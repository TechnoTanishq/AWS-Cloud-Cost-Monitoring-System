import { DashboardLayout } from "@/components/DashboardLayout";
import { useDashboardStats, useMonthlyCosts, useServiceCosts } from "@/hooks/useAwsData";
import { useAws } from "@/contexts/AwsContext";
import { DollarSign, TrendingUp, Target, FolderOpen } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

const COLORS = ["hsl(220,72%,50%)", "hsl(200,80%,50%)", "hsl(160,60%,45%)", "hsl(35,90%,55%)"];

export default function Dashboard() {
  const { connection } = useAws();
  const roleArn = connection?.roleArn;
  const { data: stats, loading: statsLoading } = useDashboardStats(roleArn);
  const { data: monthly, loading: monthlyLoading } = useMonthlyCosts(roleArn);
  const { data: services, loading: servicesLoading } = useServiceCosts(roleArn);

  const statCards = stats ? [
    { label: "Current Month Cost", value: `$${stats.currentMonthCost.toLocaleString()}`, icon: DollarSign, change: null },
    { label: "Predicted Month-End", value: `$${stats.predictedMonthEnd.toLocaleString()}`, icon: TrendingUp, change: `+${stats.monthOverMonthChange}%` },
    { label: "Budget Utilization", value: `${stats.budgetUtilization}%`, icon: Target, change: null },
    { label: "Active Projects", value: stats.activeProjects.toString(), icon: FolderOpen, change: null },
  ] : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
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

        {/* Charts Row */}
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
        {!servicesLoading && services && Array.isArray(services) && services.length > 0 && (
          <div className="card-elevated p-5">
            <h3 className="font-semibold text-sm mb-4">Service Cost Summary</h3>
            <div className="space-y-3">
              {services.slice(0, 6).map((s, i) => (
                <div key={s.service} className="flex items-center gap-4">
                  <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-medium w-28">{s.service}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full gradient-bg" style={{ width: `${s.percentage}%` }} />
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
