import DashboardShell from "@/components/retailer-dashboard/DashboardShell";
import ShelfManagement from "@/components/retailer-dashboard/ShelfManagement";

export default function ShelvesPage() {
  return <DashboardShell title="Shelf Management" subtitle="Interactive shelf map — assign products, manage locations, and generate QR codes."><ShelfManagement /></DashboardShell>;
}
