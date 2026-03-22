import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Shield, Copy, Link2, Unlink, AlertCircle } from "lucide-react";
import { useAws } from "@/contexts/AwsContext";

const EXTERNAL_ID = "finsight-ext-a3b7c9d2e4f6";
const API = "http://localhost:8000";

export default function IAMIntegration() {
  const { connection, isConnected, connect, disconnect } = useAws();
  const [accountId, setAccountId] = useState("");
  const [roleArn, setRoleArn] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendAccountId, setBackendAccountId] = useState<string | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  // Fetch FinSight backend account ID on mount
  useEffect(() => {
    fetch(`${API}/iam/info`)
      .then(r => r.json())
      .then(data => {
        setBackendAccountId(data.account_id);
        setLoadingInfo(false);
      })
      .catch(() => {
        setBackendAccountId("ERROR");
        setLoadingInfo(false);
      });
  }, []);

  const handleConnect = async () => {
    if (!accountId.trim() || !roleArn.trim()) { toast.error("Please fill in all fields."); return; }
    if (!/^\d{12}$/.test(accountId.trim())) { toast.error("AWS Account ID must be 12 digits."); return; }
    setLoading(true);
    const result = await connect(accountId, roleArn);
    setLoading(false);
    if (result.ok) toast.success("AWS account connected successfully.");
    else toast.error(result.error || "Connection failed.");
  };

  const handleDisconnect = () => {
    disconnect();
    setAccountId("");
    setRoleArn("");
    toast.success("AWS account disconnected.");
  };

  const copyExternalId = () => {
    navigator.clipboard.writeText(EXTERNAL_ID);
    toast.success("External ID copied.");
  };

  const copyAccountId = () => {
    if (backendAccountId && backendAccountId !== "NOT_CONFIGURED" && backendAccountId !== "ERROR") {
      navigator.clipboard.writeText(backendAccountId);
      toast.success("Account ID copied.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="text-xl font-bold mb-1">IAM Integration</h2>
          <p className="text-sm text-muted-foreground">Connect your AWS account securely using IAM roles.</p>
        </div>

        <div className="card-elevated p-5 space-y-4">
          <h3 className="font-semibold text-sm">How it works</h3>
          <div className="space-y-3">
            {[
              { step: 1, title: "Create IAM Role", desc: "In your AWS account, create a new IAM role with a trust policy that allows FinSight to assume it." },
              { step: 2, title: "Attach Cost Explorer Policy", desc: "Attach the AWS managed policy 'AWSBillingReadOnlyAccess'." },
              { step: 3, title: "Enter Role ARN", desc: "Copy your Role ARN and AWS Account ID below and click Connect." },
            ].map((s) => (
              <div key={s.step} className="flex gap-3">
                <div className="h-7 w-7 rounded-full gradient-bg flex items-center justify-center shrink-0 text-xs font-bold text-primary-foreground">{s.step}</div>
                <div>
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {backendAccountId === "NOT_CONFIGURED" && (
          <div className="card-elevated p-4 border-l-4 border-l-destructive bg-destructive/5">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-destructive">Backend Not Configured</p>
                <p className="text-xs text-muted-foreground mt-1">
                  FinSight backend AWS credentials are not configured. Please add AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY to backend/.env
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="card-elevated p-5 space-y-4">
          <h3 className="font-semibold text-sm">Trust Policy Configuration</h3>
          <p className="text-xs text-muted-foreground">Use these values when creating your IAM role:</p>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">FinSight Account ID (trust this account)</Label>
              <div className="flex items-center gap-2">
                {loadingInfo ? (
                  <div className="flex-1 px-3 py-2 rounded-md bg-muted animate-pulse h-9" />
                ) : (
                  <>
                    <code className="flex-1 px-3 py-2 rounded-md bg-muted text-sm font-mono">
                      {backendAccountId || "Loading..."}
                    </code>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyAccountId}
                      disabled={!backendAccountId || backendAccountId === "NOT_CONFIGURED" || backendAccountId === "ERROR"}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">External ID (use in your trust policy)</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded-md bg-muted text-sm font-mono">{EXTERNAL_ID}</code>
                <Button variant="outline" size="sm" onClick={copyExternalId}><Copy className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        </div>

        {!isConnected ? (
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
            <Button onClick={handleConnect} className="gap-2" disabled={loading}>
              <Link2 className="h-4 w-4" /> {loading ? "Connecting..." : "Connect AWS Account"}
            </Button>
          </div>
        ) : (
          <div className="card-elevated p-5 border-l-4 border-l-chart-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-chart-3" />
                <div>
                  <p className="font-semibold text-sm">AWS Account Connected</p>
                  <p className="text-xs text-muted-foreground">Account {connection?.accountId}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate max-w-xs">{connection?.arn}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleDisconnect} className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
                <Unlink className="h-4 w-4" /> Disconnect
              </Button>
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
