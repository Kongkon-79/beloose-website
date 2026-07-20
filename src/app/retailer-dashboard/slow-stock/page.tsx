import DashboardShell from "@/components/retailer-dashboard/DashboardShell";
import SlowStockManager from "@/components/retailer-dashboard/SlowStockManager";

export default function SlowStockPage() {
  return <DashboardShell title="Slow Stock" subtitle="Comprehensive insights into business performance, product trends, and customer engagement."><SlowStockManager /></DashboardShell>;
}
