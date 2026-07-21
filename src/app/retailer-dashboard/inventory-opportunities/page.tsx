import DashboardShell from "@/components/retailer-dashboard/DashboardShell";
import InventoryManager from "@/components/retailer-dashboard/InventoryManager";

export default function InventoryOpportunitiesPage() { return <DashboardShell title="Inventory Opportunities" subtitle="Review active, slow-moving inventory and take action."><InventoryManager mode="opportunities"/></DashboardShell>; }
