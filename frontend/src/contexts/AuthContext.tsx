import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string, organization: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("finsight_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Handle OAuth callback
  useEffect(() => {
    const token = searchParams.get("token");
    const userEmail = searchParams.get("user");
    const verified = searchParams.get("verified");

    console.log("[AuthContext] searchParams on effect run", {
      raw: window.location.search,
      token,
      userEmail,
      verified,
    });

    if (token && userEmail && verified === "true") {
      console.log("[OAuth Callback] Received verified token from Google OAuth");

      try {
        const parts = token.split(".");
        if (parts.length !== 3) throw new Error("Invalid JWT token format");

        console.log("[OAuth Callback] ✓ Token format verified");
        localStorage.setItem("token", token);

        const userData: User = {
          id: "google-user",
          name: userEmail.split("@")[0],
          email: userEmail,
          organization: "Google",
        };

        setUser(userData);
        localStorage.setItem("finsight_user", JSON.stringify(userData));
        console.log("[OAuth Callback] ✓ Authentication successful! Navigating to dashboard...");
        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("[OAuth Callback] ✗ Error processing OAuth token:", error);
        localStorage.removeItem("token");
        navigate("/login?error=invalid_token", { replace: true });
      }
    } else if (token && userEmail && !verified) {
      console.warn("[OAuth Callback] ✗ Token not verified by backend");
      localStorage.removeItem("token");
      navigate("/login?error=verification_failed", { replace: true });
    }
  }, [searchParams, navigate]);

  const API_URL = "http://localhost:8000/auth";

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Login failed:", err);
        return { ok: false, error: err.detail || err.message || "Login failed" };
      }

      const payload = await res.json();
      const accessToken = payload.access_token || payload.token || payload.accessToken;
      const userData = payload.user || payload;

      if (!accessToken) {
        console.error("No access token returned");
        return { ok: false, error: "No access token returned" };
      }

      const userWithStringId: User = { ...userData, id: String(userData.id) };
      setUser(userWithStringId);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("finsight_user", JSON.stringify(userWithStringId));
      return { ok: true };
    } catch (e) {
      console.error("Login error:", e);
      return { ok: false, error: String(e) };
    }
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    organization: string
  ) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, organization }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.error("Registration failed:", err);
        return { ok: false, error: err.detail || err.message || "Registration failed" };
      }

      return { ok: true };
    } catch (error) {
      console.error("Register error:", error);
      return { ok: false, error: String(error) };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("finsight_user");
    localStorage.removeItem("token");
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem("finsight_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};