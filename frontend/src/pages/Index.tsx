import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { BarChart3, Shield, Brain, Layers, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: BarChart3,
    title: "Real-time Cost Monitoring",
    description: "Track your AWS spending in real-time with granular service-level breakdowns and instant visibility.",
  },
  {
    icon: Layers,
    title: "Service & Project Breakdown",
    description: "Analyze costs by AWS service, project tags, and custom dimensions to identify optimization opportunities.",
  },
  {
    icon: Brain,
    title: "ML-Powered Prediction",
    description: "Leverage moving averages and linear regression to forecast costs and detect anomalies before they escalate.",
  },
  {
    icon: Shield,
    title: "Security-First IAM Integration",
    description: "Connect via IAM roles and STS—no permanent credentials stored. Least-privilege access by design.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Index() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden section-padding">
        <div className="absolute inset-0 gradient-bg opacity-[0.03]" />
        <div className="container-tight relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-card text-xs font-medium text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full gradient-bg" />
              AWS Cloud Cost Intelligence
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Intelligent AWS Cloud{" "}
              <span className="gradient-text">Cost Monitoring</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Predict. Prevent. Optimize. — Gain full visibility into your AWS costs with ML-powered forecasting, automated alerts, and actionable insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="gap-2 px-8">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="https://youtube.com" target="_blank" rel="noreferrer">
                <Button variant="outline" size="lg" className="gap-2 px-8">
                  <Play className="h-4 w-4" /> See the Platform
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-card border-y">
        <div className="container-tight">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Why FinSight?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Enterprise-grade cost intelligence designed for modern cloud teams.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card-elevated-lg p-6 group hover:border-primary/20 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-tight">
          <div className="card-elevated-lg gradient-bg p-10 sm:p-14 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-3">
              Start optimizing your cloud costs today
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
              Set up in minutes. No permanent AWS credentials required.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="gap-2 px-8">
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
