import React, { createContext, useContext, useState, useCallback } from "react";

interface AwsConnection {
  accountId: string;
  arn: string;
  roleArn: string;
}

interface AwsContextType {
  connection: AwsConnection | null;
  isConnected: boolean;
  connect: (accountId: string, roleArn: string) => Promise<{ ok: boolean; error?: string }>;
  disconnect: () => void;
}

const AwsContext = createContext<AwsContextType | null>(null);

const STORAGE_KEY = "finsight_aws_connection";
const API = "http://localhost:8000";

export const useAws = () => {
  const ctx = useContext(AwsContext);
  if (!ctx) throw new Error("useAws must be used within AwsProvider");
  return ctx;
};

export const AwsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<AwsConnection | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const connect = useCallback(async (accountId: string, roleArn: string) => {
    try {
      const res = await fetch(`${API}/iam/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: accountId, role_arn: roleArn }),
      });
      const data = await res.json();
      if (!res.ok) return { ok: false, error: data.detail || "Connection failed." };

      const conn: AwsConnection = { accountId: data.account_id, arn: data.arn, roleArn };
      setConnection(conn);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conn));
      return { ok: true };
    } catch {
      return { ok: false, error: "Could not reach backend." };
    }
  }, []);

  const disconnect = useCallback(() => {
    setConnection(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AwsContext.Provider value={{ connection, isConnected: !!connection, connect, disconnect }}>
      {children}
    </AwsContext.Provider>
  );
};
