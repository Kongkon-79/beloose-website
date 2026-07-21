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
