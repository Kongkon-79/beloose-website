import DashboardShell from "@/components/retailer-dashboard/DashboardShell";
import InventoryFeatureManager from "@/components/retailer-dashboard/InventoryFeatureManager";

export default function NewArrivalsPage() { return <DashboardShell title="New Arrivals Management" subtitle="Mark cigars that appear in the New Arrivals section for customers."><InventoryFeatureManager kind="new-arrivals"/></DashboardShell>; }
