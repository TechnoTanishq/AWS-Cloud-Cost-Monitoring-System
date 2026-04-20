import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface AwsConnection {
  accountId: string;
  roleArn: string;
}

interface AwsContextType {
  connection: AwsConnection | null;
  isConnected: boolean;
  loading: boolean;
  connect: (accountId: string, roleArn: string) => Promise<{ ok: boolean; error?: string }>;
  disconnect: () => Promise<void>;
  reset: () => void; // clears state on logout
}

const AwsContext = createContext<AwsContextType | null>(null);
const API = "http://localhost:8000";

export const useAws = () => {
  const ctx = useContext(AwsContext);
  if (!ctx) throw new Error("useAws must be used within AwsProvider");
  return ctx;
};

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const AwsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<AwsConnection | null>(null);
  const [loading, setLoading] = useState(true);

  // Load connection state from backend on mount and whenever token changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); setConnection(null); return; }

    setLoading(true);
    fetch(`${API}/iam/connection`, { headers: getAuthHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.connected) {
          setConnection({ accountId: data.account_id, roleArn: data.role_arn });
        } else {
          setConnection(null);
        }
      })
      .catch(() => setConnection(null))
      .finally(() => setLoading(false));
  }, []);

  const connect = useCallback(async (accountId: string, roleArn: string) => {
    try {
      const res = await fetch(`${API}/iam/connect`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ account_id: accountId, role_arn: roleArn }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.detail || "Connection failed." };
      setConnection({ accountId, roleArn });
      return { ok: true };
    } catch {
      return { ok: false, error: "Could not reach backend." };
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await fetch(`${API}/iam/disconnect`, { method: "DELETE", headers: getAuthHeaders() });
    } catch {}
    setConnection(null);
  }, []);

  // Called on logout — clears in-memory state without hitting the API
  const reset = useCallback(() => {
    setConnection(null);
  }, []);

  return (
    <AwsContext.Provider value={{ connection, isConnected: !!connection, loading, connect, disconnect, reset }}>
      {children}
    </AwsContext.Provider>
  );
};
