import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
        window.location.href = data.reset_link;
      toast.success("Password reset request successful!");
    } catch (error) {
      toast.error("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your registered email to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Request Password Reset"}
          </Button>
        </form>

        {token && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = `/reset-password?token=${token}`)
              }
            >
              Continue to Reset Password
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;