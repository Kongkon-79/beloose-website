import DashboardShell from "@/components/retailer-dashboard/DashboardShell";
import InventoryFeatureManager from "@/components/retailer-dashboard/InventoryFeatureManager";

export default function StaffPicksPage() { return <DashboardShell title="Staff Picks Management" subtitle="Select cigars that appear as staff picks on the customer landing page."><InventoryFeatureManager kind="staff-picks"/></DashboardShell>; }
