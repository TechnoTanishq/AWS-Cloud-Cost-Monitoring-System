// Mock data for FinSight dashboard

export const monthlyCosts = [
  { month: "Aug", cost: 4200, predicted: 4100 },
  { month: "Sep", cost: 4800, predicted: 4600 },
  { month: "Oct", cost: 5100, predicted: 5000 },
  { month: "Nov", cost: 4900, predicted: 5200 },
  { month: "Dec", cost: 5600, predicted: 5400 },
  { month: "Jan", cost: 6200, predicted: 6100 },
  { month: "Feb", cost: null, predicted: 6800 },
];

export const serviceCosts = [
  { service: "EC2", cost: 2800, percentage: 38 },
  { service: "RDS", cost: 1400, percentage: 19 },
  { service: "S3", cost: 950, percentage: 13 },
  { service: "Lambda", cost: 720, percentage: 10 },
  { service: "CloudFront", cost: 580, percentage: 8 },
  { service: "DynamoDB", cost: 450, percentage: 6 },
  { service: "Other", cost: 300, percentage: 6 },
];

export const projectCosts = [
  { name: "Production", value: 3200, color: "hsl(220, 72%, 50%)" },
  { name: "Staging", value: 1400, color: "hsl(200, 80%, 50%)" },
  { name: "Development", value: 900, color: "hsl(160, 60%, 45%)" },
  { name: "Analytics", value: 700, color: "hsl(35, 90%, 55%)" },
];

export const dailyCosts = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  cost: 180 + Math.random() * 60 + (i > 20 ? 30 : 0),
}));

export const dashboardStats = {
  currentMonthCost: 6200,
  predictedMonthEnd: 6800,
  budgetUtilization: 78,
  activeProjects: 4,
  monthOverMonthChange: 14,
};

export const anomalies = [
  {
    service: "EC2",
    date: "2026-02-15",
    actual: 320,
    expected: 220,
    deviation: 45,
    severity: "high" as const,
  },
  {
    service: "Lambda",
    date: "2026-02-12",
    actual: 85,
    expected: 60,
    deviation: 42,
    severity: "medium" as const,
  },
];

export const mlInsights = {
  predictedCost: 6800,
  trendPercentage: 14,
  direction: "up" as const,
  topDrivers: [
    { service: "EC2", contribution: 45, change: 18 },
    { service: "RDS", contribution: 22, change: 8 },
    { service: "Lambda", contribution: 12, change: 25 },
  ],
  explanation:
    "Your projected cost for this month is 14% higher than last month, primarily due to increased EC2 usage across production workloads. Lambda invocations have also spiked by 25%, likely from the new data pipeline deployment.",
  forecast: Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    actual: i < 18 ? 200 + Math.random() * 40 : null,
    predicted: 200 + i * 2 + Math.random() * 20,
    lower: 180 + i * 1.5,
    upper: 230 + i * 2.5,
  })),
};
