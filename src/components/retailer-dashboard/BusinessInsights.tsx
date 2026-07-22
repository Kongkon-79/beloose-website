"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getBusinessInsights, type BusinessInsights as Insights } from "@/lib/dashboard";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Boxes, DollarSign, PackageSearch, ReceiptText, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import DashboardState from "./DashboardState";

const colors = ["#d2a13d", "#e17a24", "#c7594d", "#5f9f69", "#8d6fb3", "#8b7652"];

export default function BusinessInsights() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const { data: session, status } = useSession();
  const token = (session?.user as { accessToken?: string } | undefined)?.accessToken;
  const query = useQuery({ queryKey: ["business-insights", year], queryFn: ({ signal }) => getBusinessInsights(token!, year, signal), enabled: Boolean(token) });

  if (status === "loading" || query.isLoading || (status === "authenticated" && !token)) return <InsightsSkeleton/>;
  if (!token) return <DashboardState type="error" title="Couldn’t load business insights" message="Your session token is missing. Please log in again."/>;
  if (query.isError) return <DashboardState type="error" title="Couldn’t load business insights" message={query.error instanceof Error ? query.error.message : "Something went wrong while loading analytics."} onRetry={() => query.refetch()}/>;
  if (!query.data) return <DashboardState type="empty" title="No business insights found" message="Business analytics are not available yet."/>;

  return <div className="min-h-[calc(100vh-72px)] space-y-4 bg-[#3b2918] p-3 sm:p-4">
    <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-[#d5a744]"><BarChart3 size={18}/><p className="text-[10px] text-[#bca37b]">Real sales and inventory analytics for {query.data.retailer.storeName || "your store"}</p></div><Select value={String(year)} onValueChange={value => setYear(Number(value))}><SelectTrigger aria-label="Analytics year" className="h-9 w-28 border-[#80602f] bg-[#2d1a08] text-xs shadow-none focus:ring-[#d1a23f]"><SelectValue/></SelectTrigger><SelectContent className="border-[#80602f] bg-[#2d1a08] text-[#eadcb9]">{[0, 1, 2, 3].map(offset => <SelectItem key={currentYear - offset} value={String(currentYear - offset)} className="focus:bg-[#513719] focus:text-[#f3dda4]">{currentYear - offset}</SelectItem>)}</SelectContent></Select></div>
    <Cards data={query.data}/>
    <Panel title="Sales Trend" description={`Monthly revenue for ${year}`}><LineChart data={query.data.salesTrend}/></Panel>
    <div className="grid gap-4 xl:grid-cols-2"><Panel title="Strength Distribution" description="Current stock quantity by cigar strength"><StrengthChart data={query.data.strengthDistribution}/></Panel><Panel title="Top Products" description={`Best-selling products in ${year}`}><TopProducts data={query.data.topProducts}/></Panel></div>
    <Panel title="Units Sold by Month" description={`Monthly units recorded as sold in ${year}`}><UnitsChart data={query.data.unitsSoldByMonth}/></Panel>
  </div>;
}

function Cards({ data }: { data: Insights }) {
  const cards: Array<{ label: string; value: string; icon: LucideIcon; detail: string }> = [
    { label: "Total Revenue", value: money(data.cards.totalRevenue), icon: DollarSign, detail: `${data.year} sales` },
    { label: "Units Sold", value: data.cards.unitsSold.toLocaleString(), icon: Boxes, detail: `${data.year} total` },
    { label: "Avg. Order Value", value: money(data.cards.avgOrderValue), icon: ReceiptText, detail: "Revenue per unit" },
    { label: "Slow Stock", value: `${data.cards.slowStock} ${data.cards.slowStock === 1 ? "item" : "items"}`, icon: TrendingDown, detail: "At or below minimum" },
  ];
  return <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Business insight summary">{cards.map(card => <article key={card.label} className="rounded-lg border border-[#76552b] bg-[#2d1a08] p-4"><div className="flex items-center justify-between"><span className="grid h-8 w-8 place-items-center rounded bg-[#513719] text-[#d5a744]"><card.icon size={16}/></span><small className="text-[9px] text-[#806944]">{card.detail}</small></div><strong className="mt-3 block font-poppins text-xl font-semibold tabular-nums tracking-tight text-[#f1dbac]">{card.value}</strong><span className="mt-0.5 block text-[10px] text-[#a98b5c]">{card.label}</span></article>)}</section>;
}

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-[#76552b] bg-[#2d1a08] p-4 sm:p-5"><div className="mb-4"><h2 className="font-playfair text-lg font-semibold text-[#f1dbac]">{title}</h2><p className="mt-0.5 text-[10px] text-[#806944]">{description}</p></div>{children}</section>;
}

function LineChart({ data }: { data: Insights["salesTrend"] }) {
  const width = 1000, height = 250, left = 56, right = 18, top = 16, bottom = 34;
  const max = Math.max(1, ...data.map(item => item.revenue));
  const points = data.map((item, index) => ({ ...item, x: left + index * ((width - left - right) / Math.max(1, data.length - 1)), y: top + (1 - item.revenue / max) * (height - top - bottom) }));
  const hasData = data.some(item => item.revenue > 0);
  return <div className="relative h-64 w-full overflow-hidden" aria-label="Monthly revenue line chart"><svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-full w-full" role="img"><title>Monthly revenue for {data.map(item => `${item.month}: ${money(item.revenue)}`).join(", ")}</title>{[0, .25, .5, .75, 1].map(portion => { const y = top + portion * (height - top - bottom); const value = max * (1 - portion); return <g key={portion}><line x1={left} x2={width - right} y1={y} y2={y} stroke="#5f401d" strokeDasharray="3 5"/><text x={left - 8} y={y + 4} textAnchor="end" fill="#a98b5c" fontSize="11">{compact(value)}</text></g>; })}{points.map(point => <text key={point.month} x={point.x} y={height - 9} textAnchor="middle" fill="#a98b5c" fontSize="11">{point.month}</text>)}<path d={smoothPath(points, top, height - bottom)} fill="none" stroke="#d2a13d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>{hasData && points.map(point => <circle key={point.month} cx={point.x} cy={point.y} r="4" fill="#d2a13d" stroke="#2d1a08" strokeWidth="2" vectorEffect="non-scaling-stroke"><title>{point.month}: {money(point.revenue)}</title></circle>)}</svg>{!hasData && <ChartEmpty message="No sales revenue recorded for this year."/>}</div>;
}

function StrengthChart({ data }: { data: Insights["strengthDistribution"] }) {
  const active = data.filter(item => item.quantity > 0);
  if (!active.length) return <EmptyBlock message="No stocked cigars are available for strength analysis."/>;
  let cursor = 0;
  const stops = active.map((item, index) => { const start = cursor; cursor += item.percentage; return `${colors[index % colors.length]} ${start}% ${cursor}%`; });
  return <div className="flex min-h-56 flex-col items-center justify-center gap-6 sm:flex-row"><div role="img" aria-label={active.map(item => `${label(item.strength)} ${item.percentage}%`).join(", ")} className="relative h-40 w-40 shrink-0 rounded-full" style={{ backgroundImage: `conic-gradient(${stops.join(",")})` }}><span className="absolute inset-8 grid place-items-center rounded-full bg-[#2d1a08] text-center"><strong className="text-lg text-[#f1dbac]">{active.reduce((sum, item) => sum + item.quantity, 0)}</strong><small className="text-[9px] text-[#a98b5c]">in stock</small></span></div><div className="grid w-full gap-2">{active.map((item, index) => <div key={item.strength} className="flex items-center gap-2 text-xs"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}/><span className="capitalize text-[#c6ad7e]">{label(item.strength)}</span><span className="ml-auto text-[#f1dbac]">{item.percentage}%</span><small className="w-16 text-right text-[9px] text-[#806944]">{item.quantity} units</small></div>)}</div></div>;
}

function TopProducts({ data }: { data: Insights["topProducts"] }) {
  if (!data.length) return <EmptyBlock message="No product sales have been recorded for this year."/>;
  const max = Math.max(1, ...data.map(item => item.unitsSold));
  return <div className="space-y-4">{data.map(item => <div key={item._id} className="grid grid-cols-[20px_minmax(0,1fr)_auto] items-center gap-x-2"><span className="row-span-2 text-[10px] text-[#d5a744]">{item.rank}</span><div className="flex min-w-0 items-center justify-between gap-3"><strong className="truncate text-xs font-medium text-[#ead8ae]">{item.name || "Unnamed cigar"}</strong><span className="shrink-0 text-xs text-[#d5a744]">{money(item.revenue)}</span></div><span/><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#513719]"><span className="block h-full rounded-full bg-[#c99d4d]" style={{ width: `${(item.unitsSold / max) * 100}%` }}/></div><small className="text-[9px] text-[#a98b5c]">{item.unitsSold} units</small></div>)}</div>;
}

function UnitsChart({ data }: { data: Insights["unitsSoldByMonth"] }) {
  const max = Math.max(1, ...data.map(item => item.unitsSold));
  const hasData = data.some(item => item.unitsSold > 0);
  return <div className="relative h-64"><div className="flex h-full items-end gap-2 border-b border-l border-[#76552b] px-3 pt-4 sm:gap-4">{data.map(item => <div key={item.month} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"><span className="text-[9px] text-[#d5a744]">{item.unitsSold || ""}</span><span title={`${item.month}: ${item.unitsSold} units`} className="w-full max-w-20 rounded-t bg-[#c99d4d] transition hover:bg-[#ddb65f]" style={{ height: `${Math.max(item.unitsSold > 0 ? 5 : 0, (item.unitsSold / max) * 82)}%` }}/><small className="text-[9px] text-[#a98b5c]">{item.month}</small></div>)}</div>{!hasData && <ChartEmpty message="No units sold have been recorded for this year."/>}</div>;
}

function ChartEmpty({ message }: { message: string }) { return <div className="absolute inset-0 grid place-items-center"><span className="rounded border border-[#76552b] bg-[#34200e]/95 px-4 py-2 text-[10px] text-[#a98b5c]">{message}</span></div>; }
function EmptyBlock({ message }: { message: string }) { return <div className="flex min-h-52 flex-col items-center justify-center rounded border border-dashed border-[#76552b] px-5 text-center"><PackageSearch size={24} className="text-[#d5a744]"/><p className="mt-2 text-xs text-[#a98b5c]">{message}</p></div>; }
function money(value: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value || 0); }
function compact(value: number) { return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value); }
function label(value: string) { return value === "unknown" ? "Not set" : value.replaceAll("_", "-"); }
function smoothPath(points: Array<{ x: number; y: number }>, minY: number, maxY: number) {
  if (!points.length) return "";
  const clamp = (value: number) => Math.min(maxY, Math.max(minY, value));
  const tension = 3.25;
  return points.slice(0, -1).reduce((path, point, index) => {
    const previous = points[Math.max(0, index - 1)];
    const next = points[index + 1];
    const afterNext = points[Math.min(points.length - 1, index + 2)];
    const control1 = { x: point.x + (next.x - previous.x) / tension, y: clamp(point.y + (next.y - previous.y) / tension) };
    const control2 = { x: next.x - (afterNext.x - point.x) / tension, y: clamp(next.y - (afterNext.y - point.y) / tension) };
    return `${path} C ${control1.x},${control1.y} ${control2.x},${control2.y} ${next.x},${next.y}`;
  }, `M ${points[0].x},${points[0].y}`);
}

function InsightsSkeleton() {
  return <div className="min-h-[calc(100vh-72px)] space-y-4 bg-[#3b2918] p-3 sm:p-4" aria-label="Loading business insights"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[0,1,2,3].map(item => <Skeleton key={item} className="h-28 bg-[#513719]"/>)}</div><Skeleton className="h-80 bg-[#513719]"/><div className="grid gap-4 xl:grid-cols-2"><Skeleton className="h-72 bg-[#513719]"/><Skeleton className="h-72 bg-[#513719]"/></div><Skeleton className="h-80 bg-[#513719]"/></div>;
}
