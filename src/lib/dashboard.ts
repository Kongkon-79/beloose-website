export type DashboardAlert = {
  type: string;
  title: string;
  message: string;
  items?: unknown[];
};

export type RetailerDashboard = {
  greetingName: string;
  date: string;
  urgent: DashboardAlert[];
  needsAttention: DashboardAlert[];
  snapshot: { totalProducts: number; totalStock: number; totalSearches: number };
  topSearched: Array<{ _id: string; name: string; searches: number; stockStatus: string }>;
  quickActions: {
    dailyFeatured: { isSet: boolean; items: unknown[] };
    staffPicks: { count: number; items: unknown[] };
    newArrivals: { count: number; items: unknown[] };
  };
};

export type BusinessInsights = {
  year: number;
  retailer: { _id: string; name: string; storeName: string; storeSlug: string; logo?: string };
  cards: { totalRevenue: number; unitsSold: number; avgOrderValue: number; slowStock: number };
  salesTrend: Array<{ month: string; revenue: number }>;
  unitsSoldByMonth: Array<{ month: string; unitsSold: number }>;
  strengthDistribution: Array<{ strength: string; quantity: number; items: number; percentage: number }>;
  topProducts: Array<{ rank: number; _id: string; name?: string; brand?: string; unitsSold: number; revenue: number }>;
};

export class DashboardApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function getRetailerDashboard(token: string, signal?: AbortSignal) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/retailer/today`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  const result = await response.json();
  if (!response.ok) throw new DashboardApiError(result?.message || "Failed to load dashboard overview", response.status);
  return result?.data as RetailerDashboard | null;
}

export async function getBusinessInsights(token: string, year: number, signal?: AbortSignal) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/retailer/business-insights?year=${year}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new DashboardApiError(result?.message || "Failed to load business insights", response.status);
  return result?.data as BusinessInsights;
}
