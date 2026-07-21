import DashboardShell from "@/components/retailer-dashboard/DashboardShell";
import InventoryFeatureManager from "@/components/retailer-dashboard/InventoryFeatureManager";

export default function DailyFeaturedPage() { return <DashboardShell title="Daily Featured Management" subtitle="Set the featured cigars shown prominently on the customer landing page."><InventoryFeatureManager kind="daily-featured"/></DashboardShell>; }
