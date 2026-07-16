"use client";

import { Download, Printer } from "lucide-react";
import QRCode from "react-qr-code";

export default function QRManagement() {
  const download = () => {
    const svg = document.querySelector("#store-qr svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); link.download = "beloose-store-qr.svg"; link.click(); URL.revokeObjectURL(link.href);
  };
  return <div className="min-h-[calc(100vh-72px)] bg-[#3b2918] p-3 sm:p-5"><section className="flex min-h-[650px] flex-col items-center justify-center rounded-2xl bg-[#34200e] px-5 py-10 text-center"><div id="store-qr" className="rounded-lg bg-white p-5"><QRCode value="https://beloose.com/store/olivia-rhye" size={245}/></div><h2 className="mt-12 font-playfair text-3xl font-semibold text-[#d2a13d]">Your Store QR Code</h2><p className="mt-5 max-w-2xl text-base leading-relaxed text-[#bea16b]">Customers scan this code to instantly browse your humidor<br className="hidden sm:block"/> inventory on their phone - no app download required.</p><div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2"><button onClick={download} className="flex h-12 items-center justify-center gap-2 bg-[#d2a13d] text-sm font-medium text-[#291806] transition hover:bg-[#e0b653]">Download QR <Download size={19}/></button><button onClick={()=>window.print()} className="flex h-12 items-center justify-center gap-2 border border-[#b68727] text-sm transition hover:bg-[#513719]"><Printer size={19}/> Print Label</button></div></section></div>;
}
