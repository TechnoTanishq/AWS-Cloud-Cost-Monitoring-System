import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, Circle, ChevronDown, ChevronUp, ArrowRight,
  Shield, Key, ClipboardCopy, Link2, Rocket, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

const EXTERNAL_ID = "finsight-ext-a3b7c9d2e4f6";

const steps = [
  {
    id: 1,
    icon: Rocket,
    color: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-500/10 text-blue-500",
    border: "border-blue-500/20",
    title: "Open AWS IAM Console",
    subtitle: "Navigate to the IAM Roles section in your AWS account",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Sign in to your AWS account and navigate to the IAM service. You'll create a role that allows FinSight to securely read your cost data — without ever sharing your access keys.
        </p>
        <a
          href="https://console.aws.amazon.com/iam/home#/roles"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
        >
          Open AWS IAM Console <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground border border-border">
          💡 Make sure you're logged into the AWS account whose costs you want to monitor.
        </div>
      </div>
    ),
  },
  {
    id: 2,
    icon: Shield,
    color: "from-violet-500 to-violet-600",
    iconBg: "bg-violet-500/10 text-violet-500",
    border: "border-violet-500/20",
    title: "Create a New IAM Role",
    subtitle: "Set up cross-account trust with FinSight",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Follow these steps in the IAM console:</p>
        <ol className="space-y-3">
          {[
            'Click "Create role"',
            'Select "AWS account" → "Another AWS account"',
            <>Enter FinSight Account ID: <CopyChip value="855025371191" /></>,
            <>Check "Require external ID" → Enter: <CopyChip value={EXTERNAL_ID} /></>,
            'Click "Next"',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-500 text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    ),
  },
  {
    id: 3,
    icon: Key,
    color: "from-emerald-500 to-emerald-600",
    iconBg: "bg-emerald-500/10 text-emerald-500",
    border: "border-emerald-500/20",
    title: "Attach Billing Permissions",
    subtitle: "Give the role read-only access to Cost Explorer",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          On the permissions screen, search for and attach this managed policy:
        </p>
        <CopyChip value="AWSBillingReadOnlyAccess" wide />
        <ol className="space-y-3">
          {[
            'Search "AWSBillingReadOnlyAccess" in the policy search box',
            "Check the checkbox next to it",
            'Click "Next"',
            'Name the role: "FinSightRole" (or any name you prefer)',
            'Click "Create role"',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    ),
  },
  {
    id: 4,
    icon: ClipboardCopy,
    color: "from-orange-500 to-orange-600",
    iconBg: "bg-orange-500/10 text-orange-500",
    border: "border-orange-500/20",
    title: "Copy Your Role ARN",
    subtitle: "You'll need this to connect in FinSight",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          After creating the role, open it and copy the ARN from the top of the page.
        </p>
        <div className="rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs text-muted-foreground">
          arn:aws:iam::<span className="text-orange-500">YOUR_ACCOUNT_ID</span>:role/FinSightRole
        </div>
        <ol className="space-y-3">
          {[
            'Go to IAM → Roles → click "FinSightRole"',
            'Find the "ARN" field at the top of the summary page',
            "Click the copy icon next to it",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-500 text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    ),
  },
  {
    id: 5,
    icon: Link2,
    color: "from-pink-500 to-pink-600",
    iconBg: "bg-pink-500/10 text-pink-500",
    border: "border-pink-500/20",
    title: "Connect in FinSight",
    subtitle: "Paste your details and start monitoring",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Head to the IAM Integration page and enter your details:
        </p>
        <ol className="space-y-3">
          {[
            "Enter your 12-digit AWS Account ID",
            "Paste the Role ARN you just copied",
            'Click "Connect AWS Account"',
            "Your real cost data will appear on the Dashboard immediately",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pink-500/15 text-pink-500 text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ol>
        <Button asChild className="gap-2 mt-2">
          <Link to="/dashboard/iam">
            <Link2 className="h-4 w-4" />
            Go to IAM Integration
          </Link>
        </Button>
      </div>
    ),
  },
];

function CopyChip({ value, wide = false }: { value: string; wide?: boolean }) {
  const copy = () => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };
  return (
    <button
      onClick={copy}
      className={`inline-flex items-center gap-2 rounded-md border border-border bg-muted/60 px-3 py-1.5 font-mono text-xs hover:bg-muted transition-colors ${wide ? "w-full justify-between" : ""}`}
    >
      <span className="truncate">{value}</span>
      <ClipboardCopy className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    </button>
  );
}

export default function AwsSetupGuide() {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const markDone = (id: number) => {
    setCompletedSteps(prev => new Set([...prev, id]));
    if (id < steps.length) setActiveStep(id + 1);
  };

  const toggle = (id: number) => {
    setActiveStep(prev => (prev === id ? 0 : id));
  };

  const allDone = completedSteps.size === steps.length;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold">AWS Setup Guide</h2>
          <p className="text-sm text-muted-foreground">
            Connect your AWS account in 5 simple steps. Takes about 3 minutes.
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{completedSteps.size} of {steps.length} steps completed</span>
            {allDone && <span className="text-emerald-500 font-medium">All done 🎉</span>}
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step) => {
            const isOpen = activeStep === step.id;
            const isDone = completedSteps.has(step.id);
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? `${step.border} shadow-sm` : "border-border"
                } ${isDone ? "opacity-80" : ""}`}
              >
                {/* Step header — always clickable */}
                <button
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
                  onClick={() => toggle(step.id)}
                >
                  {/* Status icon */}
                  <div className="shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    ) : (
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${step.iconBg}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Step number + title */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Step {step.id}</span>
                      {isDone && (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                          Done
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold truncate">{step.title}</p>
                    {!isOpen && (
                      <p className="text-xs text-muted-foreground truncate">{step.subtitle}</p>
                    )}
                  </div>

                  {/* Chevron */}
                  <div className="shrink-0 text-muted-foreground">
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-0 border-t border-border/50">
                    <div className="pt-4 space-y-4">
                      {step.content}

                      {/* Action buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        {!isDone ? (
                          <Button
                            size="sm"
                            className={`gap-2 bg-gradient-to-r ${step.color} text-white border-0 hover:opacity-90`}
                            onClick={() => markDone(step.id)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Mark as done
                            {step.id < steps.length && <ArrowRight className="h-3.5 w-3.5" />}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCompletedSteps(prev => {
                                const next = new Set(prev);
                                next.delete(step.id);
                                return next;
                              });
                            }}
                          >
                            Mark as undone
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* All done CTA */}
        {allDone && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm text-emerald-600">You're all set!</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your AWS account should now be connected. Head to the dashboard to see your real cost data.
              </p>
            </div>
            <Button asChild size="sm" className="shrink-0 bg-emerald-500 hover:bg-emerald-600 text-white border-0">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
