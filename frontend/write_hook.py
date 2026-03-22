content = (
    'import { useEffect, useState } from "react";\n\n'
    'const API = "http://localhost:8000";\n\n'
    'function useFetch(url) {\n'
    '  const [data, setData] = useState(null);\n'
    '  const [loading, setLoading] = useState(true);\n'
    '  const [error, setError] = useState(null);\n'
    '  useEffect(() => {\n'
    '    setLoading(true);\n'
    '    fetch(url)\n'
    '      .then((r) => r.json())\n'
    '      .then((d) => { setData(d); setLoading(false); })\n'
    '      .catch((e) => { setError(String(e)); setLoading(false); });\n'
    '  }, [url]);\n'
    '  return { data, loading, error };\n'
    '}\n\n'
    'function buildUrl(path, roleArn) {\n'
    '  if (roleArn) return API + path + "?role_arn=" + encodeURIComponent(roleArn);\n'
    '  return API + path;\n'
    '}\n\n'
    'export const useDashboardStats = (roleArn) => useFetch(buildUrl("/costs/stats", roleArn));\n'
    'export const useMonthlyCosts = (roleArn) => useFetch(buildUrl("/costs/monthly", roleArn));\n'
    'export const useServiceCosts = (roleArn) => useFetch(buildUrl("/costs/by-service", roleArn));\n'
    'export const useDailyCosts = (roleArn) => useFetch(buildUrl("/costs/daily", roleArn));\n'
    'export const useMlInsights = (roleArn) => useFetch(buildUrl("/costs/ml-insights", roleArn));\n'
)
with open("src/hooks/useAwsData.ts", "w") as f:
    f.write(content)
print("done")
