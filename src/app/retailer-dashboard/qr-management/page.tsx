import DashboardShell from "@/components/retailer-dashboard/DashboardShell";
import QRManagement from "@/components/retailer-dashboard/QRManagement";

export default function QRManagementPage() {
  return <DashboardShell title="QR Management" subtitle="Download, print, or regenerate your retailer store QR code."><QRManagement /></DashboardShell>;
}
