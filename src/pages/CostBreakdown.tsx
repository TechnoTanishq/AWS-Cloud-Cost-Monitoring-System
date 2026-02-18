import { DashboardLayout } from "@/components/DashboardLayout";
import { serviceCosts, dailyCosts } from "@/data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";

export default function CostBreakdown() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Cost Breakdown</h2>
          <p className="text-sm text-muted-foreground">Detailed analysis of your AWS spending by service and time period.</p>
        </div>

        {/* Daily costs */}
        <div className="card-elevated p-5">
          <h3 className="font-semibold text-sm mb-4">Daily Cost (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyCosts}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(220, 13%, 90%)" }} />
              <Area type="monotone" dataKey="cost" stroke="hsl(220, 72%, 50%)" fill="hsl(220, 72%, 50%)" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Service table */}
        <div className="card-elevated p-5">
          <h3 className="font-semibold text-sm mb-4">Service Cost Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Service</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Cost</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">% of Total</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {serviceCosts.map((s) => (
                  <tr key={s.service} className="border-b last:border-0">
                    <td className="py-3 px-2 font-medium">{s.service}</td>
                    <td className="py-3 px-2 text-right">${s.cost.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right">{s.percentage}%</td>
                    <td className="py-3 px-2">
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full gradient-bg" style={{ width: `${s.percentage}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service bar chart */}
        <div className="card-elevated p-5">
          <h3 className="font-semibold text-sm mb-4">Service Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={serviceCosts}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" />
              <XAxis dataKey="service" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "1px solid hsl(220, 13%, 90%)" }} />
              <Bar dataKey="cost" fill="hsl(200, 80%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
