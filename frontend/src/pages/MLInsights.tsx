import { DashboardLayout } from "@/components/DashboardLayout";
import { useMlInsights } from "@/hooks/useAwsData";
import { Link } from "react-router-dom";
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Zap, DollarSign, PiggyBank, Info, Shield, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
const SVC_COLORS = ["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#06b6d4","#ec4899"];
function ForecastTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (<div className="rounded-xl border border-border bg-card shadow-lg p-3 text-xs space-y-1 min-w-[140px]"><p className="font-semibold text-foreground mb-2">Day {label}</p>{payload.map((p: any) => p.value != null ? (<div key={p.name} className="flex items-center justify-between gap-4"><span className="text-muted-foreground capitalize">{p.name}</span><span className="font-medium" style={{ color: p.color }}>${Number(p.value).toLocaleString()}</span></div>) : null)}</div>);
}
export default function MLInsights() {
  const { data, loading, isMock } = useMlInsights();
  const trend = data?.trendPercentage ?? 0;
  const trendUp = trend >= 0;
  const todayIdx = (data?.forecast ?? []).findIndex((d: any) => d.actual == null && d.predicted != null);
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h2 className="text-xl font-bold flex items-center gap-2"><Brain className="h-5 w-5 text-violet-500" />ML Insights</h2><p className="text-sm text-muted-foreground mt-0.5">AI-powered cost predictions, anomaly detection and savings opportunities.</p></div>
        {isMock && !loading && (<div className="flex items-start justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4"><div className="flex items-start gap-3"><Info className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" /><p className="text-sm text-amber-700 dark:text-amber-400">Showing sample data — connect your AWS account to see real AI-powered insights.</p></div><Button asChild size="sm" className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white border-0 gap-2"><Link to="/dashboard/iam"><Shield className="h-3.5 w-3.5" />Connect AWS</Link></Button></div>)}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? Array.from({ length: 4 }).map((_, i) => (<div key={i} className="rounded-xl border border-border p-5 animate-pulse h-28 bg-muted/40" />)) : (<>
            <div className="relative overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-5"><div className="flex items-center justify-between mb-3"><span className="text-xs font-medium text-muted-foreground">Current Spend</span><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/60 text-blue-500"><DollarSign className="h-3.5 w-3.5" /></div></div><p className="text-2xl font-bold">${(data?.currentCost ?? 0).toLocaleString()}</p><p className="text-xs text-muted-foreground mt-1">This month so far</p></div>
            <div className="relative overflow-hidden rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-violet-600/5 p-5"><div className="flex items-center justify-between mb-3"><span className="text-xs font-medium text-muted-foreground">Predicted Month-End</span><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/60 text-violet-500"><Brain className="h-3.5 w-3.5" /></div></div><p className="text-2xl font-bold">${(data?.predictedCost ?? 0).toLocaleString()}</p><p className="text-xs text-muted-foreground mt-1">AI forecast</p></div>
            <div className={`relative overflow-hidden rounded-xl border p-5 ${trendUp ? "border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-600/5" : "border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5"}`}><div className="flex items-center justify-between mb-3"><span className="text-xs font-medium text-muted-foreground">MoM Change</span><div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-background/60 ${trendUp ? "text-red-500" : "text-emerald-500"}`}>{trendUp ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}</div></div><p className={`text-2xl font-bold flex items-center gap-1 ${trendUp ? "text-red-500" : "text-emerald-500"}`}>{trendUp ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}{trendUp ? "+" : ""}{trend}%</p><p className="text-xs text-muted-foreground mt-1">vs last month</p></div>
            <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-5"><div className="flex items-center justify-between mb-3"><span className="text-xs font-medium text-muted-foreground">Savings Opportunity</span><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/60 text-emerald-500"><PiggyBank className="h-3.5 w-3.5" /></div></div><p className="text-2xl font-bold text-emerald-600">${(data?.savingsOpportunity ?? 0).toLocaleString()}</p><p className="text-xs text-muted-foreground mt-1">Estimated savings</p></div>
          </>)}
        </div>
        
        {!loading && data?.explanation && (<div className="relative overflow-hidden rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-500/8 via-blue-500/5 to-transparent p-5"><div className="flex items-start gap-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-500/15"><Zap className="h-4 w-4 text-violet-500" /></div><div><p className="text-sm font-semibold mb-1">AI Analysis</p><p className="text-sm text-muted-foreground leading-relaxed">{data.explanation}</p></div></div><div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-400/10 blur-2xl" /></div>)}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-5"><div><h3 className="font-semibold text-sm">Cost Forecast</h3><p className="text-xs text-muted-foreground mt-0.5">Actual spend + AI-predicted trajectory with confidence band</p></div><div className="flex items-center gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><span className="inline-block h-2 w-5 rounded-full bg-blue-500" />Actual</span><span className="flex items-center gap-1.5"><span className="inline-block h-2 w-5 rounded-full bg-violet-400 opacity-70" />Predicted</span></div></div>
          {loading ? <div className="h-72 animate-pulse bg-muted/40 rounded-lg" /> : (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={data?.forecast ?? []} margin={{ top: 4, right: 4, bottom: 16, left: 0 }}>
                <defs><linearGradient id="confBand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.12} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(220,10%,70%)" axisLine={false} tickLine={false} label={{ value: "Day of Month", position: "insideBottom", offset: -8, fontSize: 10, fill: "hsl(220,10%,60%)" }} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(220,10%,70%)" axisLine={false} tickLine={false} tickFormatter={(v: number) => "$" + v.toLocaleString()} />
                <Tooltip content={<ForecastTooltip />} />
                {todayIdx >= 0 && <ReferenceLine x={todayIdx} stroke="hsl(220,10%,75%)" strokeDasharray="4 4" label={{ value: "Today", fontSize: 10, fill: "hsl(220,10%,60%)", position: "top" }} />}
                <Area dataKey="upper" stroke="none" fill="url(#confBand)" fillOpacity={1} legendType="none" />
                <Area dataKey="lower" stroke="none" fill="white" fillOpacity={1} legendType="none" />
                <Line type="monotone" dataKey="predicted" stroke="#a78bfa" strokeWidth={2} strokeDasharray="6 4" dot={false} activeDot={{ r: 4, fill: "#a78bfa" }} name="predicted" />
                <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }} activeDot={{ r: 5 }} name="actual" connectNulls={false} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {!loading && (data?.topDrivers?.length ?? 0) > 0 && (<div className="rounded-xl border border-border bg-card p-5"><h3 className="font-semibold text-sm mb-5">Top Cost Drivers</h3><div className="space-y-4">{(data?.topDrivers ?? []).map((d: any, i: number) => (<div key={d.service}><div className="flex items-center justify-between mb-1.5"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: SVC_COLORS[i % SVC_COLORS.length] }} /><span className="text-sm font-medium">{d.service}</span></div><div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">${(d.cost ?? 0).toLocaleString()}</span>{d.change !== 0 && (<span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${d.change > 0 ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}>{d.change > 0 ? "+" : ""}{d.change}%</span>)}<span className="text-xs font-medium w-9 text-right">{d.contribution}%</span></div></div><div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.contribution}%`, backgroundColor: SVC_COLORS[i % SVC_COLORS.length] }} /></div></div>))}</div></div>)}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-5"><h3 className="font-semibold text-sm">Anomaly Detection</h3>{!loading && (<span className={`text-xs font-medium px-2 py-0.5 rounded-full ${(data?.anomalies?.length ?? 0) > 0 ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}>{(data?.anomalies?.length ?? 0) > 0 ? `${data.anomalies.length} detected` : "All clear"}</span>)}</div>
            {loading ? (<div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-16 animate-pulse bg-muted/40 rounded-lg" />)}</div>) : (data?.anomalies?.length ?? 0) === 0 ? (<div className="flex flex-col items-center justify-center py-8 text-center gap-2"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10"><Zap className="h-5 w-5 text-emerald-500" /></div><p className="text-sm font-medium">No anomalies detected</p><p className="text-xs text-muted-foreground">Your costs are within expected ranges.</p></div>) : (<div className="space-y-3">{(data?.anomalies ?? []).map((a: any, i: number) => (<div key={i} className={`rounded-lg border p-3 ${a.severity === "high" ? "border-red-500/20 bg-red-500/5" : "border-amber-500/20 bg-amber-500/5"}`}><div className="flex items-start justify-between gap-2"><div className="flex items-center gap-2"><AlertTriangle className={`h-4 w-4 shrink-0 ${a.severity === "high" ? "text-red-500" : "text-amber-500"}`} /><span className="text-sm font-semibold">{a.service}</span></div><span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${a.severity === "high" ? "bg-red-500/15 text-red-500" : "bg-amber-500/15 text-amber-500"}`}>{a.severity}</span></div><div className="mt-2 grid grid-cols-3 gap-2 text-xs"><div><p className="text-muted-foreground">Actual</p><p className="font-semibold">${(a.actual ?? 0).toLocaleString()}</p></div><div><p className="text-muted-foreground">Expected</p><p className="font-semibold">${(a.expected ?? 0).toLocaleString()}</p></div><div><p className="text-muted-foreground">Deviation</p><p className="font-semibold text-red-500">+{a.deviation}%</p></div></div></div>))}</div>)}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
