import DashboardShell from "@/components/retailer-dashboard/DashboardShell";
import HumidorManager from "@/components/retailer-dashboard/HumidorManager";

export default function HumidorsPage() {
  return (
    <DashboardShell
      title="Humidor Management"
      subtitle="Monitor climate conditions, capacity, and maintenance across all humidors."
    >
      <HumidorManager />
    </DashboardShell>
  );
}
