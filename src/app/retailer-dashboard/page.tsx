import DashboardOverview from "@/components/retailer-dashboard/DashboardOverview";
import DashboardShell from "@/components/retailer-dashboard/DashboardShell";

export default function RetailerDashboardPage() {
  return (
    <DashboardShell
      title="Today"
      subtitle="Welcome back to your retailer dashboard."
    >
      <DashboardOverview />
    </DashboardShell>
  );
}
