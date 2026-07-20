import { CheckCircle2, LayoutPanelTop, MapPin, TriangleAlert } from "lucide-react";

const rows = [
  ["Row A — Main Display", [["Shelf A1","Cohiba Siglo I",true],["Shelf A2","Arturo Fuente",false],["Shelf A4","Padron 1964",true]]],
  ["Row B — Main Display", [["Shelf B1","Rocky Patel",true],["Shelf B2","Montecristo #2",false],["Shelf B3","Oliva Serie V",true]]],
  ["Row C — Main Display", [["Shelf C1","CAO Colombia",true],["Shelf C2","H. Upmann No. 2",true],["Shelf C3","Romeo y Julieta",false]]],
] as const;

export default function ShelfManagement() {
  return <div className="min-h-[calc(100vh-72px)] bg-[#3b2918] p-3 sm:p-5">
    <section className="grid grid-cols-1 gap-3 md:grid-cols-3">{[["48","Total Locations",LayoutPanelTop],["32","Stocked",CheckCircle2],["16","Empty / Low",TriangleAlert]].map(([value,label,Icon])=><article className="flex h-32 items-center justify-between rounded-xl border border-[#e4cf98] bg-[#34200e] p-5" key={label as string}><div><strong className="block text-3xl">{value as string}</strong><span className="text-[11px] text-[#a48656]">{label as string}</span></div><Icon size={36} strokeWidth={1.3} className="text-[#f1d89a]"/></article>)}</section>
    <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">{rows.map(([title,shelves])=><article className="rounded-lg border border-[#e0c78c] bg-[#34200e] p-5" key={title}><h2 className="font-playfair text-base font-semibold">{title}</h2><div className="mt-5 space-y-3">{shelves.map(([shelf,product,stocked])=><div className={`rounded-lg border p-4 ${stocked?"border-[#4e5331] bg-[#363722]":"border-[#78571b] bg-[#543b18]"}`} key={shelf}><strong className="flex items-center gap-1 text-xs"><MapPin size={14} className={stocked?"text-[#55c67b]":"text-[#d0a13d]"}/>{shelf}</strong><div className="mt-3 flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded border border-[#9a753a] bg-[#231407] text-[#d9aa43]">▥</span><span className="text-[11px] text-[#b8a37a]">{product}</span></div></div>)}</div></article>)}</section>
  </div>;
}
