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
  const [threshold, setThreshold] = useState(80);
  const [currentCost, setCurrentCost] = useState(0); // ✅ no hardcoded value

  const utilization =
    budget > 0 ? Math.round((currentCost / budget) * 100) : 0;

  const isOverThreshold = utilization >= threshold;

  const token = localStorage.getItem("token");

  // ================================
  // FETCH BUDGET FROM BACKEND
  // ================================
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const res = await fetch("http://localhost:8000/budget/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.length > 0) {
          setBudget(data[0].amount);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchBudget();
  }, []);

  // ================================
  // FETCH AWS COST (REAL DATA)
  // ================================
  useEffect(() => {
    const fetchCost = async () => {
      try {
        const res = await fetch("http://localhost:8000/aws/cost");

        const data = await res.json();

        setCurrentCost(data.cost); // ✅ real AWS cost
      } catch (err) {
        console.log(err);
      }
    };

    fetchCost();
  }, []);

  // ================================
  // SAVE BUDGET
  // ================================
  const handleSave = async () => {
    if (budget <= 0) {
      toast.error("Budget must be greater than 0.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/budget/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: budget,
          month: new Date().toISOString().slice(0, 7),
        }),
      });

      if (res.ok) {
        toast.success("Budget saved successfully");
      } else {
        toast.error("Failed to save budget");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error saving budget");
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

          <Progress value={utilization} className="h-3" />

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
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
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

          <Button onClick={handleSave} className="gap-2">
            <Bell className="h-4 w-4" /> Save Settings
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