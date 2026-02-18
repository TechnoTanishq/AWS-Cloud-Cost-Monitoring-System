import { DashboardLayout } from "@/components/DashboardLayout";
import { dashboardStats, monthlyCosts, serviceCosts, projectCosts } from "@/data/mockData";
import { DollarSign, TrendingUp, Target, FolderOpen } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

const statCards = [
  { label: "Current Month Cost", value: `$${dashboardStats.currentMonthCost.toLocaleString()}`, icon: DollarSign, change: null },
  { label: "Predicted Month-End", value: `$${dashboardStats.predictedMonthEnd.toLocaleString()}`, icon: TrendingUp, change: `+${dashboardStats.monthOverMonthChange}%` },
  { label: "Budget Utilization", value: `${dashboardStats.budgetUtilization}%`, icon: Target, change: null },
  { label: "Active Projects", value: dashboardStats.activeProjects.toString(), icon: FolderOpen, change: null },
];

const COLORS = projectCosts.map((p) => p.color);

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
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
          {/* Monthly Trend */}
          <div className="card-elevated p-5">
            <h3 className="font-semibold text-sm mb-4">Monthly Cost Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyCosts}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(220, 13%, 90%)" }} />
                <Line type="monotone" dataKey="cost" stroke="hsl(220, 72%, 50%)" strokeWidth={2} dot={{ r: 4 }} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="hsl(200, 80%, 50%)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Service Breakdown */}
          <div className="card-elevated p-5">
            <h3 className="font-semibold text-sm mb-4">Service-wise Breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={serviceCosts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis dataKey="service" type="category" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" width={80} />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(220, 13%, 90%)" }} />
                <Bar dataKey="cost" fill="hsl(220, 72%, 50%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Breakdown */}
        <div className="card-elevated p-5">
          <h3 className="font-semibold text-sm mb-4">Project-wise Breakdown</h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={240} className="max-w-xs">
              <PieChart>
                <Pie data={projectCosts} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {projectCosts.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "0.5rem" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {projectCosts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">${p.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
