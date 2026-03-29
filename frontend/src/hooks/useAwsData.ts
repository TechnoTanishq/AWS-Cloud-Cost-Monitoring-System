import { useEffect, useState } from "react";

const API = "http://localhost:8000";

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
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => {
        if (d && d.mock === true) {
          setIsMock(true);
          // unwrap array responses
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

function buildUrl(path: string, roleArn?: string) {
  if (roleArn) return API + path + "?role_arn=" + encodeURIComponent(roleArn);
  return API + path;
}

export const useDashboardStats = (roleArn?: string) => useFetch(buildUrl("/costs/stats", roleArn));
export const useMonthlyCosts = (roleArn?: string) => useFetch(buildUrl("/costs/monthly", roleArn));
export const useServiceCosts = (roleArn?: string) => useFetch(buildUrl("/costs/by-service", roleArn));
export const useDailyCosts = (roleArn?: string) => useFetch(buildUrl("/costs/daily", roleArn));
export const useMlInsights = (roleArn?: string) => useFetch(buildUrl("/costs/ml-insights", roleArn));
