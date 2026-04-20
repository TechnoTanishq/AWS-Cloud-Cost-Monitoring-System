import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Download, History, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generatePDFReport, ReportData } from "@/lib/generateReport";
import { useAws } from "@/contexts/AwsContext";

const API = "http://localhost:8000";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function buildMonthOptions() {
  const options: { label: string; value: string; year: number; monthIndex: number }[] = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth(); // 0-indexed
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;
    options.push({ label: `${MONTHS[month]} ${year}`, value: key, year, monthIndex: month });
  }
  return options;
}

export function ExportReportButton() {
  const { connection } = useAws();
  const monthOptions = buildMonthOptions();
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[1].value); // default: last month
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API}/reports/history`, { headers: getAuthHeaders() });
      if (res.ok) setHistory(await res.json());
    } catch {}
  };

  useEffect(() => {
    if (historyOpen) fetchHistory();
  }, [historyOpen]);

  const handleExport = async () => {
    setGenerating(true);
    try {
      const opt = monthOptions.find(m => m.value === selectedMonth)!;
      const token = localStorage.getItem("token");
      const headers = getAuthHeaders();

      // Fetch all data in parallel
      const [statsRes, servicesRes, dailyRes, budgetRes] = await Promise.all([
        fetch(`${API}/costs/stats`, { headers }),
        fetch(`${API}/costs/by-service`, { headers }),
        fetch(`${API}/costs/daily`, { headers }),
        fetch(`${API}/budget/`, { headers }),
      ]);

      const statsRaw = await statsRes.json();
      const servicesRaw = await servicesRes.json();
      const dailyRaw = await dailyRes.json();
      const budgetRaw = budgetRes.ok ? await budgetRes.json() : [];

      // Unwrap mock wrapper if present
      const stats = statsRaw.mock ? statsRaw : statsRaw;
      const services = servicesRaw.mock ? servicesRaw.data : (Array.isArray(servicesRaw) ? servicesRaw : []);
      const daily = dailyRaw.mock ? dailyRaw.data : (Array.isArray(dailyRaw) ? dailyRaw : []);

      // Find budget for selected month
      const budget = Array.isArray(budgetRaw)
        ? budgetRaw.find((b: any) => b.month === selectedMonth) || null
        : null;

      const userEmail = localStorage.getItem("email") || "user@finsight.app";

      const reportData: ReportData = {
        month: opt.label,
        monthKey: opt.value,
        year: opt.year,
        userEmail,
        awsAccountId: connection?.accountId || "N/A",
        stats: {
          currentMonthCost: stats.currentMonthCost ?? 0,
          predictedMonthEnd: stats.predictedMonthEnd ?? 0,
          monthOverMonthChange: stats.monthOverMonthChange ?? 0,
          budgetUtilization: stats.budgetUtilization ?? 0,
          activeProjects: stats.activeProjects ?? 0,
        },
        services,
        daily,
        budget: budget ? { amount: budget.amount, month: budget.month } : null,
      };

      // Generate PDF
      generatePDFReport(reportData);

      // Save to history
      await fetch(`${API}/reports/save`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          month: opt.value,
          year: opt.year,
          total_cost: reportData.stats.currentMonthCost,
          predicted_cost: reportData.stats.predictedMonthEnd,
          mom_change: reportData.stats.monthOverMonthChange,
          top_service: services[0]?.service || null,
        }),
      });

      toast.success(`Report for ${opt.label} downloaded`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Month selector + Export button */}
      <div className="flex items-center gap-0 rounded-lg border border-border overflow-hidden shadow-sm">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="h-9 w-44 rounded-none border-0 border-r text-xs focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          onClick={handleExport}
          disabled={generating}
          className="h-9 rounded-none gap-2 px-4 bg-blue-600 hover:bg-blue-700 text-white border-0"
        >
          {generating
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <Download className="h-3.5 w-3.5" />
          }
          {generating ? "Generating..." : "Export PDF"}
        </Button>
      </div>

      {/* History button */}
      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <History className="h-3.5 w-3.5" />
            History
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Report History
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No reports generated yet.
              </p>
            ) : (
              history.map((r) => (
                <div key={r.id} className="rounded-lg border border-border p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">
                      {new Date(r.month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.generated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Total: <span className="text-foreground font-medium">${r.total_cost?.toLocaleString() ?? "—"}</span></span>
                    {r.top_service && <span>Top: <span className="text-foreground font-medium">{r.top_service}</span></span>}
                    {r.mom_change != null && (
                      <span className={r.mom_change >= 0 ? "text-red-500" : "text-emerald-500"}>
                        {r.mom_change >= 0 ? "+" : ""}{r.mom_change}% MoM
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
