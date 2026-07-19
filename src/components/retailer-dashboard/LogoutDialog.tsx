"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoaderCircle, LogOut } from "lucide-react";
import { useState } from "react";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => Promise<unknown> };

export default function LogoutDialog({ open, onOpenChange, onConfirm }: Props) {
  const [pending, setPending] = useState(false);
  const confirm = async () => {
    setPending(true);
    try { await onConfirm(); } finally { setPending(false); }
  };
  return <Dialog open={open} onOpenChange={pending ? undefined : onOpenChange}><DialogContent className="max-w-md border-[#765225] bg-[#2d1a08] text-[#f4dfa8] shadow-[0_24px_80px_rgba(0,0,0,.65)]"><DialogHeader className="items-center text-center"><span className="mb-2 grid h-14 w-14 place-items-center rounded-full border border-red-400/30 bg-red-500/10 text-red-400"><LogOut size={24}/></span><DialogTitle className="font-playfair text-2xl">Ready to leave?</DialogTitle><DialogDescription className="max-w-sm text-[#b89a67]">You will be signed out of your retailer dashboard. Your saved shop data will remain secure.</DialogDescription></DialogHeader><DialogFooter className="mt-3 flex-row justify-center gap-3 sm:justify-center sm:space-x-0"><button type="button" disabled={pending} onClick={() => onOpenChange(false)} className="h-10 min-w-28 rounded border border-[#9b7947] px-4 text-xs font-semibold transition hover:bg-[#513719] disabled:opacity-50">Stay logged in</button><button type="button" disabled={pending} onClick={confirm} className="inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded bg-red-500 px-4 text-xs font-semibold text-white transition hover:bg-red-600 disabled:opacity-60">{pending ? <><LoaderCircle className="animate-spin" size={15}/>Signing out...</> : <><LogOut size={15}/>Log out</>}</button></DialogFooter></DialogContent></Dialog>;
}
