import { useEffect, useState } from "react";
import { API } from "@/lib/api";

function useFetch(url: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    setLoading(true);
    setData(null);
    setError(null);
    setIsMock(false);

    const token = localStorage.getItem("token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(url, { headers })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => {
        if (d && d.mock === true) {
          setIsMock(true);
          setData(d.data !== undefined ? d.data : d);
        } else {
          setData(d);
        }
        setLoading(false);
      })
      .catch(e => { setError(String(e)); setLoading(false); });
  }, [url]);

  return { data, loading, error, isMock };
}

export const useDashboardStats = () => useFetch(`${API}/costs/stats`);
export const useMonthlyCosts = () => useFetch(`${API}/costs/monthly`);
export const useServiceCosts = () => useFetch(`${API}/costs/by-service`);
export const useDailyCosts = () => useFetch(`${API}/costs/daily`);
export const useMlInsights = () => useFetch(`${API}/costs/ml-insights`);
