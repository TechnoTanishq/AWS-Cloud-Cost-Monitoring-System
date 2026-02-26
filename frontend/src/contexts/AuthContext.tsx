import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";
interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, organization: string) => Promise<boolean>;
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

  const API_URL = "http://localhost:8000"

const login = useCallback(async (email: string, password: string) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      toast.error(data.detail || "Invalid email or password");   // 👈 SHOW ERROR
      return false;
    }

    const accessToken = data.access_token;
    const userData = data.user;

    if (!accessToken) {
      toast.error("Login failed");
      return false;
    }

    setUser(userData);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("finsight_user", JSON.stringify(userData));

    return true;
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Server not reachable");
    return false;
  }
}, []);
  const register = useCallback(async (name: string, email: string, password: string, organization: string) => 
  {
    try{
      const response = await fetch(`${API_URL}/register`,{
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,email,password,organization
        }),
      });

      if(!response.ok)
      {
        return false;
      }
      return true;
    }
    catch(error)
    {
      console.error("Register error:", error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("finsight_user");
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
