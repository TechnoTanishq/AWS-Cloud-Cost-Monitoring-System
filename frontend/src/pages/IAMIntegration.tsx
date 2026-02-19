import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Shield, Copy, Link2 } from "lucide-react";

export default function IAMIntegration() {
  const [accountId, setAccountId] = useState("");
  const [roleArn, setRoleArn] = useState("");
  const externalId = "finsight-ext-" + "a3b7c9d2e4f6";
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    if (!accountId.trim() || !roleArn.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!/^\d{12}$/.test(accountId.trim())) {
      toast.error("AWS Account ID must be 12 digits.");
      return;
    }
    // Mock connection
    setConnected(true);
    toast.success("AWS account connected successfully (mock).");
  };

  const copyExternalId = () => {
    navigator.clipboard.writeText(externalId);
    toast.success("External ID copied to clipboard.");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="text-xl font-bold mb-1">IAM Integration</h2>
          <p className="text-sm text-muted-foreground">Connect your AWS account securely using IAM roles.</p>
        </div>

        {/* Instructions */}
        <div className="card-elevated p-5 space-y-4">
          <h3 className="font-semibold text-sm">How it works</h3>
          <div className="space-y-3">
            {[
              { step: 1, title: "Create IAM Role", desc: "In your AWS account, create a new IAM role with a trust policy that allows FinSight to assume it." },
              { step: 2, title: "Attach Cost Explorer Policy", desc: "Attach the AWS managed policy 'AWSCostAndUsageReportAutomationPolicy' or a custom read-only cost policy." },
              { step: 3, title: "Enter Role ARN", desc: "Copy your Role ARN and AWS Account ID below and click Connect." },
            ].map((s) => (
              <div key={s.step} className="flex gap-3">
                <div className="h-7 w-7 rounded-full gradient-bg flex items-center justify-center shrink-0 text-xs font-bold text-primary-foreground">
                  {s.step}
                </div>
                <div>
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External ID */}
        <div className="card-elevated p-5">
          <Label className="text-xs text-muted-foreground mb-2 block">External ID (use in your trust policy)</Label>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded-md bg-muted text-sm font-mono">{externalId}</code>
            <Button variant="outline" size="sm" onClick={copyExternalId}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Connection form */}
        {!connected ? (
          <div className="card-elevated p-5 space-y-4">
            <h3 className="font-semibold text-sm">Connect AWS Account</h3>
            <div className="space-y-2">
              <Label htmlFor="accountId">AWS Account ID</Label>
              <Input id="accountId" value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="123456789012" maxLength={12} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleArn">Role ARN</Label>
              <Input id="roleArn" value={roleArn} onChange={(e) => setRoleArn(e.target.value)} placeholder="arn:aws:iam::123456789012:role/FinSightRole" maxLength={256} />
            </div>
            <Button onClick={handleConnect} className="gap-2">
              <Link2 className="h-4 w-4" /> Connect AWS Account
            </Button>
          </div>
        ) : (
          <div className="card-elevated p-5 border-l-4 border-l-chart-3">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-chart-3" />
              <div>
                <p className="font-semibold text-sm">AWS Account Connected</p>
                <p className="text-xs text-muted-foreground">Account {accountId} · Role validated (mock)</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 rounded-lg bg-muted/50 text-xs text-muted-foreground">
          <p><strong>Security Note:</strong> FinSight never requests or stores your AWS Access Key or Secret Key. All access is performed via IAM role assumption with temporary STS credentials.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
