import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AlertTriangle, Bell } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Budgets() {
  const [budget, setBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState<number | "">(0);
  const [savedBudget, setSavedBudget] = useState<number>(0);
  const [threshold, setThreshold] = useState(80);
  const [currentCost, setCurrentCost] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const utilization = savedBudget > 0
    ? Math.min(Math.round((currentCost / savedBudget) * 100), 999)
    : budget > 0 ? Math.min(Math.round((currentCost / budget) * 100), 999) : 0;

  const isOverThreshold = utilization >= threshold;

  const token = localStorage.getItem("token");

  const API = "http://localhost:8000";
  const currentMonth = new Date().toISOString().slice(0, 7);

  function authHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // ================================
  // FETCH BUDGET + COST
  // ================================
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [budgetRes, statsRes] = await Promise.all([
          fetch(`${API}/budget/current`, { headers: authHeaders() }),
          fetch(`${API}/costs/stats`, { headers: authHeaders() }),
        ]);

        if (budgetRes.ok) {
          const b = await budgetRes.json();
          if (b.amount != null) {
            setSavedBudget(b.amount);
            setBudgetInput(b.amount);
          }
        }

        if (statsRes.ok) {
          const s = await statsRes.json();
          if (typeof s.currentMonthCost === "number") {
            setCurrentCost(s.currentMonthCost);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ================================
  // SAVE BUDGET
  // ================================
  const handleSave = async () => {
    const amount = Number(budgetInput || budget);
    if (amount <= 0) {
      toast.error("Budget must be greater than 0.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/budget/add`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ amount, month: currentMonth }),
      });
      if (res.ok) {
        setSavedBudget(amount);
        setBudget(amount);
        toast.success(`Budget of $${amount.toLocaleString()} saved for ${currentMonth}`);
      } else {
        toast.error("Failed to save budget");
      }
    } catch {
      toast.error("Error saving budget");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="text-xl font-bold mb-1">Budgets & Alerts</h2>
          <p className="text-sm text-muted-foreground">
            Configure your monthly budget and alert thresholds.
          </p>
        </div>

        {/* Utilization */}
        <div className="card-elevated p-5">
          <h3 className="font-semibold text-sm mb-4">Budget Utilization</h3>

          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold">{utilization}%</span>
            <span className="text-sm text-muted-foreground">
              ${currentCost.toLocaleString()} / ${budget.toLocaleString()}
            </span>
          </div>

          {/* Custom progress bar with dynamic color */}
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                utilization >= 100 ? "bg-red-500" :
                utilization >= threshold ? "bg-amber-500" :
                "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            />
          </div>
          {isOverThreshold && (
            <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              <p className="text-sm text-destructive">
                Budget utilization ({utilization}%) exceeded threshold ({threshold}%)
              </p>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="card-elevated p-5 space-y-5">
          <h3 className="font-semibold text-sm">Budget Settings</h3>

          <div className="space-y-2">
            <Label>Monthly Budget ($)</Label>
            <Input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value === "" ? "" : Number(e.target.value))}
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Alert Threshold (%)</Label>
            <Input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              min={1}
              max={100}
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Bell className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>

        {/* Alert simulation */}
        <div className="card-elevated p-5">
          <h3 className="font-semibold text-sm mb-3">Alert Simulation</h3>

          {[80, 90, 100].map((pct) => {
            const triggered = utilization >= pct;

            return (
              <div
                key={pct}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  triggered
                    ? "bg-destructive/5 border-destructive/20"
                    : "bg-muted/50"
                }`}
              >
                <span className="text-sm font-medium">{pct}% threshold</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    triggered
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {triggered ? "TRIGGERED" : "OK"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}