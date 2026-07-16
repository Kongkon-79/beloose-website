import Image from "next/image";
import {
  LogOut,
} from "lucide-react";
import DashboardNav from "./DashboardNav";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function DashboardShell({ title, subtitle, children }: Props) {
  return (
    <main className="min-h-screen w-full bg-[#3b2816] font-poppins text-[#f4dfa8] lg:pl-[280px]">
      <aside className="sticky top-0 z-40 flex h-16 w-full items-center bg-[#291806] px-3 font-sans lg:fixed lg:inset-y-0 lg:left-0 lg:h-screen lg:w-[280px] lg:flex-col lg:px-4 lg:py-4">
        <div className="flex h-14 w-16 shrink-0 items-center justify-center lg:h-[70px] lg:w-full">
          <Image src="/assets/images/logo.png" alt="Beloose" width={72} height={72} className="h-12 w-12 object-contain lg:h-14 lg:w-14" />
        </div>

        <DashboardNav />

        <div className="mt-auto hidden w-full lg:block">
          <div className="flex items-center gap-2 px-0.5 py-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#c7963d] bg-gradient-to-br from-[#79402d] to-[#17100b] text-[9px] font-bold">JW</span>
            <span className="flex min-w-0 flex-col"><strong className="text-[10px] text-[#ead8ae]">Jenny Wilson</strong><small className="truncate text-[7px] text-[#80653c]">examplexyz@example.com</small></span>
          </div>
          <button className="flex h-9 w-full items-center justify-center gap-2 rounded border border-[#e63f4c] text-[11px] text-[#ff4554] transition hover:bg-[#e63f4c] hover:text-white"><LogOut size={17} /> Log out</button>
        </div>
      </aside>

      <section className="min-w-0">
        <header className="sticky top-16 z-30 flex h-[72px] items-center justify-between border-b border-[#5f401d] bg-[#2d1a08]/95 px-4 backdrop-blur-md sm:px-6 lg:top-0">
          <div><h1 className="text-lg font-bold leading-[120%]">{title}</h1><p className="mt-1 text-[11px] text-[#876d46]">{subtitle}</p></div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[#c7963d] bg-gradient-to-br from-[#79402d] to-[#17100b] text-[8px] font-bold">OR</span>
            <span className="hidden flex-col sm:flex"><strong className="text-xs text-[#ead4a4]">Olivia Rhye</strong><small className="text-[9px] text-[#8f7146]">olivia@untitledui.com</small></span>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
