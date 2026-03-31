import { useEffect, useState } from "react";

const API = "http://localhost:8000";

// 🔥 Generic fetch with JWT
function useFetch(path: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const token = localStorage.getItem("token");

      try {
        const res = await fetch(API + path, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 🔴 Handle unauthorized
        if (res.status === 403) {
          setError("Unauthorized");
          setLoading(false);
          return;
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [path]);

  return { data, loading, error };
}

// ✅ Hooks (NO roleArn)
export const useDashboardStats = () => useFetch("/costs/stats");
export const useMonthlyCosts = () => useFetch("/costs/monthly");
export const useServiceCosts = () => useFetch("/costs/by-service");
export const useDailyCosts = () => useFetch("/costs/daily");
export const useMlInsights = () => useFetch("/costs/ml-insights");