import DashboardShell from "@/components/retailer-dashboard/DashboardShell";
import QRManagement from "@/components/retailer-dashboard/QRManagement";

export default function QRManagementPage() {
  return <DashboardShell title="QR Code Management" subtitle="Generate, manage, and track QR codes for shelves, products, and discovery flows."><QRManagement /></DashboardShell>;
}
