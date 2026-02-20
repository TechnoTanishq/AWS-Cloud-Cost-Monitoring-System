import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function Feedback() {
  const [form, setForm] = useState({ name: "", email: "", organization: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    // Mock submission
    setTimeout(() => {
      toast.success("Thank you for your feedback!");
      setForm({ name: "", email: "", organization: "", message: "" });
      setLoading(false);
    }, 800);
  };

  return (
    <PublicLayout>
      <section className="section-padding">
        <div className="container-tight max-w-lg">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold mb-2">Feedback</h1>
            <p className="text-muted-foreground mb-8">
              We'd love to hear your thoughts. Help us improve FinSight.
            </p>

            <form onSubmit={handleSubmit} className="card-elevated-lg p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" maxLength={255} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org">Organization</Label>
                <Input id="org" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Company name" maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your feedback..." rows={4} maxLength={1000} />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                <Send className="h-4 w-4" /> {loading ? "Sending..." : "Submit Feedback"}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
