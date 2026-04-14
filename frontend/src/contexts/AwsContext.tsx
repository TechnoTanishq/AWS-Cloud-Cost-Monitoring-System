// contexts/AwsContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface AwsConnection {
  accountId: string;
  roleArn?: string;
}

interface AwsContextType {
  connection: AwsConnection | null;
  isConnected: boolean;
  connect: (accountId: string, roleArn: string) => Promise<{ ok: boolean; error?: string }>;
  disconnect: () => Promise<void>;
}

const AwsContext = createContext<AwsContextType | null>(null);

const API = "http://localhost:8000";

// 👉 Helper to get token
const getToken = () => localStorage.getItem("token");

export const useAws = () => {
  const ctx = useContext(AwsContext);
  if (!ctx) throw new Error("useAws must be used within AwsProvider");
  return ctx;
};

export const AwsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<AwsConnection | null>(null);

  // ✅ Load connection from backend on app start
  useEffect(() => {
    const fetchConnection = async () => {
      try {
        const res = await fetch(`${API}/iam/connection`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const data = await res.json();

        if (data.connected) {
          setConnection({
            accountId: data.account_id,
            roleArn: data.role_arn,
          });
        }
      } catch (err) {
        console.error("Failed to fetch AWS connection");
      }
    };

    fetchConnection();
  }, []);

  // ✅ Connect (store in backend)
  const connect = useCallback(async (accountId: string, roleArn: string) => {
    try {
      const res = await fetch(`${API}/iam/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ account_id: accountId, role_arn: roleArn }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false, error: data.detail || "Connection failed." };
      }

      // ✅ Only store minimal info
      setConnection({
        accountId: accountId,
        roleArn: data.role_arn,
      });

      return { ok: true };
    } catch {
      return { ok: false, error: "Could not reach backend." };
    }
  }, []);

  // ✅ Disconnect (backend + state)
  const disconnect = useCallback(async () => {
    try {
      await fetch(`${API}/iam/disconnect`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
    } catch {}

    setConnection(null);
  }, []);

  return (
    <AwsContext.Provider value={{ connection, isConnected: !!connection, connect, disconnect }}>
      {children}
    </AwsContext.Provider>
  );
};

