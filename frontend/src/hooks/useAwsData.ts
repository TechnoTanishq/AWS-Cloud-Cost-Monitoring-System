import { useEffect, useState } from "react";

const API = "http://localhost:8000";

function useFetch(path: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ❗ DO NOT CALL API WITHOUT TOKEN
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(API + path, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 403) {
          setError("Unauthorized");
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

function buildUrl(path: string, roleArn?: string) {
  if (roleArn) return API + path + "?role_arn=" + encodeURIComponent(roleArn);
  return API + path;
}

export const useDashboardStats = () => useFetch("/costs/stats");
export const useMonthlyCosts = () => useFetch("/costs/monthly");
export const useServiceCosts = () => useFetch("/costs/by-service");
export const useDailyCosts = () => useFetch("/costs/daily");
export const useMlInsights = (roleArn?: string) =>
  useFetch(buildUrl("/costs/ml-insights", roleArn));