import DashboardShell from "@/components/retailer-dashboard/DashboardShell";
import InventoryManager from "@/components/retailer-dashboard/InventoryManager";

export default function InventoryPage() {
  return (
    <DashboardShell
      title="Inventory Management"
      subtitle="Track, manage, and optimize your cigar inventory."
    >
      <InventoryManager />
    </DashboardShell>
  );
}
