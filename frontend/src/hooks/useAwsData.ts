import { useEffect, useState } from "react";

const API = "http://localhost:8000";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    fetch(url).then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(e => { setError(String(e)); setLoading(false); });
  }, [url]);
  return { data, loading, error };
}

function buildUrl(path, roleArn) {
  if (roleArn) return API + path + "?role_arn=" + encodeURIComponent(roleArn);
  return API + path;
}

export const useDashboardStats = (roleArn) => useFetch(buildUrl("/costs/stats", roleArn));
export const useMonthlyCosts = (roleArn) => useFetch(buildUrl("/costs/monthly", roleArn));
export const useServiceCosts = (roleArn) => useFetch(buildUrl("/costs/by-service", roleArn));
export const useDailyCosts = (roleArn) => useFetch(buildUrl("/costs/daily", roleArn));
export const useMlInsights = (roleArn) => useFetch(buildUrl("/costs/ml-insights", roleArn));
