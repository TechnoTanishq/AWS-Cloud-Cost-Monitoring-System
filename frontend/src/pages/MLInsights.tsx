import { DashboardLayout } from "@/components/DashboardLayout";
import { useMlInsights } from "@/hooks/useAwsData";
import { useAws } from "@/contexts/AwsContext";
import { Brain, TrendingUp, AlertTriangle, Zap } from "lucide-react";
import {
  Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart,
} from "recharts";

export default function MLInsights() {
  const { connection } = useAws();
  const { data, loading } = useMlInsights(connection?.roleArn);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-1">ML Insights</h2>
          <p className="text-sm text-muted-foreground">AI-powered cost predictions and anomaly detection.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-elevated p-5 h-24 animate-pulse bg-muted/40 rounded-xl" />
            ))
          ) : (
            <>
              <div className="card-elevated p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Predicted Cost</span>
                </div>
                <p className="text-2xl font-bold">${data?.predictedCost.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
              </div>
              <div className="card-elevated p-5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">Trend</span>
                </div>
                <p className="text-2xl font-bold">{(data?.trendPercentage ?? 0) >= 0 ? "+" : ""}{data?.trendPercentage}%</p>
                <p className="text-xs text-muted-foreground mt-1">Month-over-month</p>
              </div>
              <div className="card-elevated p-5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-xs font-medium text-muted-foreground">Anomalies</span>
                </div>
                <p className="text-2xl font-bold">{data?.anomalies.length ?? 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Detected this period</p>
              </div>
            </>
          )}
        </div>

        {!loading && data && (
          <div className="card-elevated p-5 border-l-4 border-l-primary">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-sm mb-1">AI Analysis</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{data.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <div className="card-elevated p-5">
          <h3 className="font-semibold text-sm mb-4">30-Day Cost Forecast</h3>
          {loading ? (
            <div className="h-72 animate-pulse bg-muted/40 rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={data?.forecast ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
                <Tooltip contentStyle={{ borderRadius: "0.5rem" }} />
                <Area dataKey="upper" stroke="none" fill="hsl(220,72%,50%)" fillOpacity={0.05} name="Upper Bound" />
                <Area dataKey="lower" stroke="none" fill="hsl(220,72%,50%)" fillOpacity={0.05} name="Lower Bound" />
                <Line type="monotone" dataKey="actual" stroke="hsl(220,72%,50%)" strokeWidth={2} dot={{ r: 2 }} name="Actual" connectNulls={false} />
                <Line type="monotone" dataKey="predicted" stroke="hsl(200,80%,50%)" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Predicted" />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        {!loading && data && data.topDrivers.length > 0 && (
          <div className="card-elevated p-5">
            <h3 className="font-semibold text-sm mb-4">Top Cost Drivers</h3>
            <div className="space-y-4">
              {data.topDrivers.map((d) => (
                <div key={d.service} className="flex items-center gap-4">
                  <span className="font-medium text-sm w-20">{d.service}</span>
                  <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full gradient-bg transition-all" style={{ width: `${d.contribution}%` }} />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">{d.contribution}%</span>
                  {d.change !== 0 && <span className="text-xs font-medium text-primary">+{d.change}%</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && data && data.anomalies.length > 0 && (
          <div className="card-elevated p-5">
            <h3 className="font-semibold text-sm mb-4">Anomaly Detection</h3>
            <div className="space-y-3">
              {data.anomalies.map((a, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                  <AlertTriangle className={`h-4 w-4 shrink-0 ${a.severity === "high" ? "text-destructive" : "text-chart-4"}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.service} — {a.deviation}% above expected</p>
                    <p className="text-xs text-muted-foreground">Actual: ${a.actual} · Expected: ${a.expected} · {a.date}</p>
                  </div>
                  <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full ${
                    a.severity === "high" ? "bg-destructive/10 text-destructive" : "bg-chart-4/10 text-chart-4"
                  }`}>{a.severity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
