import DashboardShell from "@/components/retailer-dashboard/DashboardShell";
import InventoryManager from "@/components/retailer-dashboard/InventoryManager";

export default function InventoryPage() {
  return (
    <DashboardShell
      title="Receive & Manage Inventory"
      subtitle="Track stock levels, locations, and retail pricing."
    >
      <InventoryManager />
    </DashboardShell>
  );
}
