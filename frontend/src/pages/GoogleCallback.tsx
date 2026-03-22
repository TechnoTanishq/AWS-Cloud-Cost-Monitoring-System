import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const userEmail = searchParams.get("user");
    const verified = searchParams.get("verified");

    if (!token || !userEmail || verified !== "true") {
      navigate("/login?error=verification_failed", { replace: true });
      return;
    }

    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Invalid JWT");
      loginWithToken(token, userEmail);
      navigate("/dashboard", { replace: true });
    } catch {
      navigate("/login?error=invalid_token", { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 text-sm">Signing you in...</p>
      </div>
    </div>
  );
}
