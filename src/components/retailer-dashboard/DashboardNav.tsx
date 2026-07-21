"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, LayoutDashboard, Package, QrCode, Search, Settings, Sparkles, Star, Thermometer, TrendingDown } from "lucide-react";

const links = [
  ["Today", LayoutDashboard, "/retailer-dashboard"],
  ["Receive & Manage Inventory", Package, "/retailer-dashboard/inventory"],
  ["Humidor Management", Thermometer, "/retailer-dashboard/humidors"],
  ["QR Management", QrCode, "/retailer-dashboard/qr-management"],
  ["Inventory Opportunities", TrendingDown, "/retailer-dashboard/inventory-opportunities"],
  ["Business Insights", BarChart3, "/retailer-dashboard/business-insights"],
  ["Customer-Style Search", Search, "/retailer-dashboard/customer-search"],
  ["Staff Picks", Star, "/retailer-dashboard/staff-picks"],
  ["New Arrivals", Sparkles, "/retailer-dashboard/new-arrivals"],
  ["Daily Featured", CalendarDays, "/retailer-dashboard/daily-featured"],
  ["Settings", Settings, "/retailer-dashboard/settings"],
] as const;

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 gap-2 overflow-x-auto scrollbar-hide lg:mt-1 lg:w-full lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto" aria-label="Retailer dashboard navigation">
      {links.map(([label, Icon, href]) => {
        const active = pathname === href || (href !== "/retailer-dashboard" && pathname.startsWith(`${href}/`));
        return <Link key={label} href={href} aria-current={active ? "page" : undefined} className={`flex h-11 w-11 shrink-0 items-center justify-center gap-3 rounded-md no-underline transition-all hover:no-underline focus:no-underline lg:h-10 lg:w-full lg:justify-start lg:px-3 lg:text-sm lg:font-semibold lg:leading-[120%] ${active ? "bg-gradient-to-r from-[#6a4a1e] to-[#553918] text-[#ffe8ad] shadow-[inset_3px_0_0_#f3dda4]" : "text-[#8f7145] hover:translate-x-0.5 hover:bg-[#3d270f] hover:text-[#e1b95f]"}`}><Icon size={16} strokeWidth={1.4} className="shrink-0"/><span className="hidden lg:block">{label}</span></Link>;
      })}
    </nav>
  );
}
