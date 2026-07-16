import DashboardOverview from "@/components/retailer-dashboard/DashboardOverview";
import DashboardShell from "@/components/retailer-dashboard/DashboardShell";

export default function RetailerDashboardPage() {
  return (
    <DashboardShell
      title="Dashboard Overview"
      subtitle="Good morning — here's your business snapshot for today."
    >
      <DashboardOverview />
    </DashboardShell>
  );
}
