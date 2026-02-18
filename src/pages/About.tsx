import { PublicLayout } from "@/components/PublicLayout";
import { Shield, Lock, Key, Server, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const securityFeatures = [
  { icon: Shield, title: "IAM Role-Based Access", desc: "Connect via IAM roles with STS AssumeRole — no long-lived credentials." },
  { icon: Lock, title: "No Permanent Credentials", desc: "We never ask for or store AWS Access Keys or Secret Keys." },
  { icon: Key, title: "Least Privilege Model", desc: "Roles are scoped to read-only cost and billing APIs only." },
  { icon: Server, title: "Data Encryption", desc: "All data encrypted at rest and in transit. SOC 2 ready architecture." },
];

const principles = [
  "External ID verification for cross-account access",
  "Session tokens expire automatically",
  "Audit trail for all API calls",
  "Role ARN validated before any data retrieval",
  "No write access to your AWS resources",
];

export default function About() {
  return (
    <PublicLayout>
      <section className="section-padding">
        <div className="container-tight max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">About FinSight</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              FinSight is an intelligent AWS cloud cost monitoring and alerting system built as part of a cloud engineering internship project. 
              It combines real-time cost tracking with ML-powered predictions to help engineering teams stay ahead of their cloud spend.
            </p>

            {/* Architecture Overview */}
            <div className="card-elevated-lg p-6 mb-10">
              <h2 className="text-xl font-semibold mb-4">Architecture Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {[
                  { label: "Frontend", tech: "React + TypeScript", detail: "Tailwind CSS, Recharts" },
                  { label: "Backend", tech: "FastAPI + SQLAlchemy", detail: "JWT Auth, REST API" },
                  { label: "ML Engine", tech: "Moving Avg & Regression", detail: "Anomaly Detection" },
                ].map((block) => (
                  <div key={block.label} className="p-4 rounded-lg bg-muted">
                    <p className="text-xs font-medium text-primary mb-1">{block.label}</p>
                    <p className="font-semibold text-sm">{block.tech}</p>
                    <p className="text-xs text-muted-foreground mt-1">{block.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <h2 className="text-2xl font-bold mb-6">Security-First Design</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {securityFeatures.map((f) => (
                <div key={f.title} className="card-elevated p-5 flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Principles */}
            <div className="card-elevated-lg p-6">
              <h3 className="font-semibold mb-4">Security Principles</h3>
              <ul className="space-y-2">
                {principles.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
