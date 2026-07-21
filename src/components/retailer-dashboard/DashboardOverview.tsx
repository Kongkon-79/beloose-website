"use client";

import { getRetailerDashboard, type DashboardAlert, type RetailerDashboard } from "@/lib/dashboard";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, Box, CalendarDays, Clock3, Package, PackageSearch, Search, Sparkles, TrendingDown } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import DashboardState from "./DashboardState";
import OverviewSkeleton from "./OverviewSkeleton";

export default function DashboardOverview() {
  const { data: session, status } = useSession();
  const token = (session?.user as { accessToken?: string } | undefined)?.accessToken;
  const query = useQuery({
    queryKey: ["retailer-dashboard", "today"],
    queryFn: ({ signal }) => getRetailerDashboard(token!, signal),
    enabled: Boolean(token),
  });

  if (status === "loading" || query.isLoading || (status === "authenticated" && !token)) return <OverviewSkeleton/>;
  if (!token) return <DashboardState type="error" title="Couldn’t load Today" message="Your session token is missing. Please log in again."/>;
  if (query.isError) return <DashboardState type="error" title="Couldn’t load Today" message={query.error instanceof Error ? query.error.message : "Something went wrong while loading today’s dashboard."} onRetry={() => query.refetch()}/>;
  if (!query.data) return <DashboardState type="empty" title="Today’s data not found" message="No action dashboard is available for this retailer."/>;
  return <TodayContent dashboard={query.data}/>;
}

function TodayContent({ dashboard }: { dashboard: RetailerDashboard }) {
  const lowStock = findAlert(dashboard.needsAttention, "low_stock");
  const outOfStock = findAlert(dashboard.urgent, "out_of_stock");
  const opportunities = findAlert(dashboard.needsAttention, "inventory_opportunities");
  const approvals = findAlert(dashboard.needsAttention, "under_review");
  const paymentDue = findAlert(dashboard.urgent, "payment_due");
  const lowInventoryCount = itemCount(lowStock) + itemCount(outOfStock);
  const topSearch = dashboard.topSearched[0];
  const metrics = [
    [dashboard.snapshot.totalProducts, "Total Products", "Active cigar lines", Package],
    [dashboard.snapshot.totalStock, "Total Units", "Units currently in stock", Box],
    [itemCount(lowStock), "Low Stock Items", "At or below threshold", TrendingDown],
    [dashboard.snapshot.totalSearches, "Search Activity", "Across top searched cigars", Search],
  ] as const;

  return <div className="min-h-[calc(100vh-72px)] bg-[#3b2918] p-3 sm:p-4">
    <section><h2 className="font-playfair text-2xl font-semibold text-[#f2dca5]">What should I do today?</h2><p className="mt-1 text-xs text-[#a98b5c]">Here’s what needs your attention right now, {dashboard.greetingName}.</p></section>
    {paymentDue && <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/35 bg-amber-500/10 p-3 text-xs text-amber-100"><Clock3 size={16} className="mt-0.5 shrink-0"/><div><strong>{paymentDue.title}</strong><p className="mt-1 text-[10px] text-amber-200/75">{paymentDue.message}</p></div></div>}

    <section className="mt-6 grid grid-cols-2 gap-2.5 xl:grid-cols-4 xl:gap-4" aria-label="Today’s inventory summary">{metrics.map(([value, label, note, Icon]) => <article className="flex min-h-[108px] items-center justify-between rounded-lg border border-[#856a3c] bg-[#34200e] p-3 sm:p-[18px]" key={label}><div className="min-w-0"><Icon size={18} className="mb-3 text-[#d5a744]"/><strong className="block text-xl font-medium leading-none text-[#f7dfa6] sm:text-2xl">{value.toLocaleString()}</strong><span className="mt-2 block text-[11px] text-[#d9c08b]">{label}</span><small className="mt-0.5 hidden text-[9px] text-[#876d46] sm:block">{note}</small></div></article>)}</section>

    <section className="mt-7"><h3 className="flex items-center gap-2 font-playfair text-lg font-semibold text-[#f2dca5]"><AlertTriangle size={17} className="text-[#d5a744]"/>Actionable Items</h3><div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <ActionCard href="/retailer-dashboard/inventory" icon={AlertTriangle} tone="red" title="Low Inventory" description={lowInventoryCount ? `${lowInventoryCount} product${lowInventoryCount === 1 ? "" : "s"} need restocking` : "No products currently need restocking"} detail={alertItemNames(lowStock, outOfStock) || "Inventory levels look healthy"}/>
      <ActionCard href="/retailer-dashboard/inventory-opportunities" icon={PackageSearch} tone="gold" title="Products Needing Attention" description={itemCount(opportunities) ? "Slow-moving inventory needs a decision" : "No inventory opportunities waiting"} detail={`${itemCount(opportunities)} product${itemCount(opportunities) === 1 ? "" : "s"} need attention`}/>
      <ActionCard href="/retailer-dashboard/customer-search" icon={Search} tone="blue" title="Recent Customer Searches" description="What customers are looking for" detail={topSearch ? `${topSearch.name} · ${topSearch.searches} searches` : "No customer searches recorded yet"}/>
      <ActionCard href="/retailer-dashboard/inventory" icon={Clock3} tone="purple" title="Pending Approvals" description="Products awaiting admin review" detail={`${itemCount(approvals)} product${itemCount(approvals) === 1 ? "" : "s"} under review`}/>
      <ActionCard href="/retailer-dashboard/business-insights" icon={Search} tone="brown" title="Search Activity" description="Customer searches recorded in your inventory" detail={`${dashboard.snapshot.totalSearches.toLocaleString()} searches across ${dashboard.topSearched.length} top product${dashboard.topSearched.length === 1 ? "" : "s"}`}/>
      <ActionCard href="/retailer-dashboard/daily-featured" icon={CalendarDays} tone="green" title="Today’s Promotions" description="Staff picks, arrivals, and featured cigars" detail={`${dashboard.quickActions.staffPicks.count} staff picks · ${dashboard.quickActions.newArrivals.count} new arrivals · ${dashboard.quickActions.dailyFeatured.items.length} daily featured`}/>
    </div></section>
  </div>;
}

const tones = {
  red: "border-red-400/30 bg-red-950/25 text-red-300",
  gold: "border-amber-500/30 bg-amber-950/20 text-amber-300",
  blue: "border-blue-400/25 bg-blue-950/20 text-blue-300",
  purple: "border-purple-400/25 bg-purple-950/20 text-purple-300",
  brown: "border-[#755632] bg-[#34200e] text-[#d5a744]",
  green: "border-emerald-500/25 bg-emerald-950/20 text-emerald-300",
} as const;

function ActionCard({ href, icon: Icon, tone, title, description, detail }: { href: string; icon: typeof Sparkles; tone: keyof typeof tones; title: string; description: string; detail: string }) {
  return <Link href={href} className={`group min-h-[150px] rounded-lg border p-4 no-underline transition hover:-translate-y-0.5 hover:no-underline ${tones[tone]}`}><div className="flex items-center justify-between"><Icon size={20}/><ArrowRight size={16} className="opacity-60 transition group-hover:translate-x-1"/></div><h4 className="mt-5 font-playfair text-base text-[#f1dbac]">{title}</h4><p className="mt-1 text-[10px] text-[#9f8966]">{description}</p><strong className="mt-3 block text-xs font-medium">{detail}</strong></Link>;
}

function findAlert(alerts: DashboardAlert[], type: string) { return alerts.find(alert => alert.type === type); }
function itemCount(alert?: DashboardAlert) { return Array.isArray(alert?.items) ? alert.items.length : 0; }
function alertItemNames(...alerts: Array<DashboardAlert | undefined>) {
  return alerts.flatMap(alert => Array.isArray(alert?.items) ? alert.items : []).slice(0, 2).map(item => typeof item === "object" && item && "name" in item ? String(item.name) : "").filter(Boolean).join(", ");
}
