import { Box, CircleHelp, Crown, DollarSign, QrCode, Sparkles, Tag, TrendingUp, TriangleAlert } from "lucide-react";

const metrics = [
  ["$1996", "Inventory Value", "Retail Value", DollarSign],
  ["3", "Featured Items", "Staff Picks & Daily Features", Sparkles],
  ["2", "Rare Finds", "5 or Fewer in Stock", Crown],
  ["0", "Slow Moving", "90+ days unsold", Tag],
  ["$1996", "Monthly Revenue", "", DollarSign],
  ["$27,800", "H411 Influenced", "", TrendingUp],
  ["$124,400", "Inventory Value", "", Box],
  ["7 Items", "Low Stock Alerts", "", TriangleAlert],
] as const;

export default function DashboardOverview() {
  return <div className="p-3 sm:p-4">
    <section className="rounded-xl bg-[#61401f] px-5 py-[18px]"><span className="text-[11px] font-semibold">♙ CURRENT PLAN</span><h2 className="text-2xl font-semibold leading-tight text-[#d9aa43]">Premium</h2><p className="mt-1.5 text-[11px] text-[#e4c994]">£700.00/month · Renews 1 February 2025</p><div className="mt-3.5 flex flex-wrap gap-1.5">{["Priority Directory","Featured Badge","Unlimited Enquiries","Analytics Access","20% Ad Discount"].map(x=><span className="rounded-full bg-[#795b3d] px-2.5 py-1.5 text-[10px] text-[#f4e3bd]" key={x}>✓ {x}</span>)}</div></section>
    <section className="mt-4 grid grid-cols-2 gap-2.5 xl:grid-cols-4 xl:gap-4">{metrics.map(([value,label,note,Icon])=><article className="flex h-[118px] items-center justify-between rounded-lg border border-[#e2c990] bg-[#34200e] p-3 sm:p-[18px]" key={`${label}-${value}`}><div className="flex flex-col"><span className="text-xs text-[#a68552]">{label}</span><strong className="text-xl leading-tight text-[#f7dfa6] sm:text-2xl">{value}</strong>{note&&<small className="mt-0.5 text-[10px] text-[#a98b5c]">{note}</small>}</div><Icon className="text-[#efd89e]" size={29} strokeWidth={1.25}/></article>)}</section>
    <section className="mt-4 rounded-lg border border-[#ddc690] bg-[#34200e] px-3 py-4 sm:px-5"><h3 className="flex items-center gap-1 text-sm font-semibold">Revenue Overview <CircleHelp size={15}/></h3><p className="mt-1 text-[11px] text-[#a68a59]">Monthly revenue vs Humidor411 influenced sales</p><RevenueChart/></section>
    <section className="mt-4 rounded-lg border border-[#ddc690] bg-[#34200e] px-3 pt-4 sm:px-5"><div className="flex items-center justify-between pb-3"><h3 className="text-sm font-semibold">Product Discovery</h3><a className="text-xs text-[#d5aa4b] underline" href="#">View All</a></div>{[["QR Code Scans Today","284"],["Guided Recommendations","67"],["Staff Pick Views","142"],["New Arrival Engagements","98"]].map(([label,value])=><div className="flex h-[50px] items-center justify-between border-t border-[#67461f] text-xs" key={label}><span className="flex items-center gap-2.5"><QrCode size={17} className="text-[#d4a13d]"/>{label}</span><strong className="font-medium text-[#dfc17b]">{value}</strong></div>)}</section>
  </div>;
}

function RevenueChart(){return <div className="mt-4 flex h-44 sm:h-52"><div className="flex w-10 flex-col justify-between pb-[18px] pt-1 text-[9px] text-[#a88d5f]">{["$20k","$15k","$10k","$5k","$0"].map(x=><span key={x}>{x}</span>)}</div><div className="relative min-w-0 flex-1"><div className="absolute inset-x-0 bottom-[18px] top-0 flex flex-col justify-between">{[1,2,3,4,5].map(x=><i className="border-t border-[#735022]" key={x}/>)}</div><svg className="absolute inset-x-0 bottom-[18px] h-[calc(100%-18px)] w-full overflow-visible" viewBox="0 0 1000 180" preserveAspectRatio="none"><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d7a33c" stopOpacity=".28"/><stop offset="100%" stopColor="#d7a33c" stopOpacity=".03"/></linearGradient></defs><path fill="url(#revenueFill)" d="M0 170 C55 155 90 120 145 120 S230 158 290 150 S340 102 390 99 S455 42 505 47 S560 39 610 66 S690 24 750 18 S815 75 855 76 S910 146 950 120 S980 102 1000 102 L1000 180 L0 180 Z"/><path fill="none" stroke="#d7a33c" strokeWidth="3" vectorEffect="non-scaling-stroke" d="M0 170 C55 155 90 120 145 120 S230 158 290 150 S340 102 390 99 S455 42 505 47 S560 39 610 66 S690 24 750 18 S815 75 855 76 S910 146 950 120 S980 102 1000 102"/></svg><div className="absolute inset-x-0 bottom-0 flex justify-between text-[9px] text-[#d7c293]">{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(x=><span key={x}>{x}</span>)}</div></div></div>}
