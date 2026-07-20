"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, LayoutDashboard, Package, QrCode, Settings, Thermometer, UsersRound } from "lucide-react";

const links = [
  ["Dashboard Overview", LayoutDashboard, "/retailer-dashboard"],
  ["Inventory Management", Package, "/retailer-dashboard/inventory"],
  ["Humidor Management", Thermometer, "/retailer-dashboard/humidors"],
  ["Shelf Management", Archive, "/retailer-dashboard/shelves"],
  ["QR Management", QrCode, "/retailer-dashboard/qr-management"],
  ["Slow Stock", UsersRound, "/retailer-dashboard/slow-stock"],
  ["Settings", Settings, "/retailer-dashboard/settings"],
] as const;

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 gap-2 overflow-x-auto scrollbar-hide lg:mt-1 lg:w-full lg:flex-none lg:flex-col lg:overflow-visible" aria-label="Retailer dashboard navigation">
      {links.map(([label, Icon, href]) => {
        const active = pathname === href || (href !== "/retailer-dashboard" && pathname.startsWith(`${href}/`));
        return <Link key={label} href={href} aria-current={active ? "page" : undefined} className={`flex h-11 w-11 shrink-0 items-center justify-center gap-3 rounded-md no-underline transition-all hover:no-underline focus:no-underline lg:h-12 lg:w-full lg:justify-start lg:px-3 lg:text-sm lg:font-semibold lg:leading-[120%] ${active ? "bg-gradient-to-r from-[#6a4a1e] to-[#553918] text-[#ffe8ad] shadow-[inset_3px_0_0_#f3dda4]" : "text-[#8f7145] hover:translate-x-0.5 hover:bg-[#3d270f] hover:text-[#e1b95f]"}`}><Icon size={17} strokeWidth={1.4} className="shrink-0"/><span className="hidden lg:block">{label}</span></Link>;
      })}
    </nav>
  );
}
