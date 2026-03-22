import React, { createContext, useContext, useState, useCallback } from "react";

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
  loginWithToken: (token: string, email: string) => void;
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

  const loginWithToken = useCallback((token: string, email: string) => {
    localStorage.setItem("token", token);
    const userData: User = {
      id: "google-user",
      name: email.split("@")[0],
      email,
      organization: "Google",
    };
    setUser(userData);
    localStorage.setItem("finsight_user", JSON.stringify(userData));
  }, []);

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
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginWithToken, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};