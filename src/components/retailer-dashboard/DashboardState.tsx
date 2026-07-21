import { CircleAlert, Store } from "lucide-react";

type Props = { type: "error" | "empty"; title?: string; message: string; onRetry?: () => void };

export default function DashboardState({ type, title, message, onRetry }: Props) {
  const Icon = type === "error" ? CircleAlert : Store;
  return <div className="min-h-[calc(100vh-72px)] bg-[#3b2918] p-4 sm:p-5"><div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-[#6d512f] bg-[#2d1a08] px-6 text-center"><span className="grid h-14 w-14 place-items-center rounded-full bg-[#513719] text-[#d7a73c]"><Icon size={25}/></span><h2 className="mt-4 font-playfair text-xl font-semibold">{title || (type === "error" ? "Couldn’t load profile" : "Profile data not found")}</h2><p className="mt-2 max-w-md text-sm text-[#b89a67]">{message}</p>{onRetry && <button type="button" onClick={onRetry} className="mt-5 h-10 rounded bg-[#d2a13d] px-5 text-xs font-semibold text-[#291806]">Try again</button>}</div></div>;
}
