import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Bell } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Budgets() {
  const [budget, setBudget] = useState(8000);
  const [threshold, setThreshold] = useState(80);
  const currentCost = 6200;
  const utilization = Math.round((currentCost / budget) * 100);
  const isOverThreshold = utilization >= threshold;

  const handleSave = () => {
    if (budget <= 0) {
      toast.error("Budget must be greater than 0.");
      return;
    }
    toast.success("Budget settings updated.");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="text-xl font-bold mb-1">Budgets & Alerts</h2>
          <p className="text-sm text-muted-foreground">Configure your monthly budget and alert thresholds.</p>
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
                Budget utilization ({utilization}%) has exceeded your alert threshold ({threshold}%).
              </p>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="card-elevated p-5 space-y-5">
          <h3 className="font-semibold text-sm">Budget Settings</h3>
          <div className="space-y-2">
            <Label htmlFor="budget">Monthly Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              min={1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="threshold">Alert Threshold (%)</Label>
            <Input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              min={1}
              max={100}
            />
            <p className="text-xs text-muted-foreground">
              You'll be alerted when spending reaches this percentage of your budget.
            </p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Bell className="h-4 w-4" /> Save Settings
          </Button>
        </div>

        {/* Alert simulation */}
        <div className="card-elevated p-5">
          <h3 className="font-semibold text-sm mb-3">Alert Simulation</h3>
          <div className="space-y-2">
            {[80, 90, 100].map((pct) => {
              const triggered = utilization >= pct;
              return (
                <div key={pct} className={`flex items-center justify-between p-3 rounded-lg border ${
                  triggered ? "bg-destructive/5 border-destructive/20" : "bg-muted/50"
                }`}>
                  <span className="text-sm font-medium">{pct}% threshold</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    triggered ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                  }`}>
                    {triggered ? "TRIGGERED" : "OK"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
