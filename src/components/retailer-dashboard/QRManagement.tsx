"use client";

import { downloadMyQrCode, getMyQrCode, QrCodeApiError, regenerateMyQrCode } from "@/lib/qrCodes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, QrCode, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import DashboardState from "./DashboardState";
import { Skeleton } from "@/components/ui/skeleton";

export default function QRManagement() {
  const { data: session, status } = useSession();
  const token = (session?.user as { accessToken?: string } | undefined)?.accessToken;
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["retailer-qr-code"], queryFn: ({ signal }) => getMyQrCode(token!, signal), enabled: Boolean(token), retry: false });
  const regenerate = useMutation({
    mutationFn: () => regenerateMyQrCode(token!),
    onSuccess: data => { queryClient.setQueryData(["retailer-qr-code"], data); toast.success("QR code regenerated successfully"); },
    onError: showError,
  });
  const download = useMutation({ mutationFn: () => downloadMyQrCode(token!), onSuccess: () => toast.success("QR code downloaded"), onError: showError });

  if (status === "loading" || query.isLoading || (status === "authenticated" && !token)) return <QrSkeleton/>;
  if (!token) return <DashboardState type="error" title="Couldn’t load QR code" message="Your session token is missing. Please log in again."/>;
  if (query.error instanceof QrCodeApiError && query.error.status === 404) return <MissingQr pending={regenerate.isPending} generate={() => regenerate.mutate()}/>;
  if (query.isError) return <DashboardState type="error" title="Couldn’t load QR code" message={query.error instanceof Error ? query.error.message : "Something went wrong while loading your QR code."} onRetry={() => query.refetch()}/>;
  if (!query.data?.qrcodeUrl) return <MissingQr pending={regenerate.isPending} generate={() => regenerate.mutate()}/>;
  const qrCode = query.data;

  return <div className="min-h-[calc(100vh-72px)] bg-[#3b2918] p-3 sm:p-5"><section className="flex min-h-[650px] flex-col items-center justify-center rounded-xl border border-[#76552b] bg-[#34200e] px-5 py-10 text-center"><div className="relative h-[285px] w-[285px] rounded-lg bg-white p-5 shadow-[0_16px_45px_rgba(0,0,0,.28)]"><Image src={qrCode.qrcodeUrl} alt="Store QR code" fill sizes="285px" className="object-contain p-5" priority/></div><h2 className="mt-10 font-playfair text-2xl font-semibold text-[#d2a13d]">{qrCode.retailerId?.storeName ? `${qrCode.retailerId.storeName} QR Code` : "Your Store QR Code"}</h2><p className="mt-3 max-w-2xl text-xs leading-relaxed text-[#bea16b]">Customers can scan this code to browse your store inventory. Regenerating replaces the current QR image while keeping it linked to your store.</p><div className="mt-7 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2"><button type="button" disabled={download.isPending || regenerate.isPending} onClick={() => download.mutate()} className="flex h-11 items-center justify-center gap-2 rounded bg-[#d2a13d] text-xs font-semibold text-[#291806] transition hover:bg-[#e0b653] disabled:opacity-60">{download.isPending ? <RefreshCw size={16} className="animate-spin"/> : <Download size={17}/>} {download.isPending ? "Downloading..." : "Download QR"}</button><button type="button" disabled={regenerate.isPending || download.isPending} onClick={() => regenerate.mutate()} className="flex h-11 items-center justify-center gap-2 rounded border border-[#b68727] text-xs transition hover:bg-[#513719] disabled:opacity-60"><RefreshCw size={17} className={regenerate.isPending ? "animate-spin" : ""}/>{regenerate.isPending ? "Regenerating..." : "Regenerate"}</button></div></section></div>;
}

function MissingQr({ pending, generate }: { pending: boolean; generate: () => void }) { return <div className="min-h-[calc(100vh-72px)] bg-[#3b2918] p-4"><div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-[#76552b] bg-[#34200e] px-5 text-center"><span className="grid h-14 w-14 place-items-center rounded-full bg-[#513719] text-[#d2a13d]"><QrCode size={25}/></span><h2 className="mt-4 font-playfair text-xl">No store QR code yet</h2><p className="mt-2 text-xs text-[#a98b5c]">Generate a QR code linked to your retailer store.</p><button type="button" disabled={pending} onClick={generate} className="mt-5 flex h-10 items-center gap-2 rounded bg-[#d2a13d] px-5 text-xs font-semibold text-[#291806] disabled:opacity-60"><RefreshCw size={16} className={pending ? "animate-spin" : ""}/>{pending ? "Generating..." : "Generate QR Code"}</button></div></div>; }
function QrSkeleton() { return <div className="min-h-[calc(100vh-72px)] bg-[#3b2918] p-3 sm:p-5" aria-label="Loading store QR code"><div className="flex min-h-[650px] flex-col items-center justify-center rounded-xl bg-[#34200e]"><Skeleton className="h-[285px] w-[285px] bg-[#513719]"/><Skeleton className="mt-10 h-7 w-56 bg-[#513719]"/><Skeleton className="mt-4 h-4 w-96 max-w-[80%] bg-[#513719]"/><Skeleton className="mt-7 h-11 w-full max-w-2xl bg-[#513719]"/></div></div>; }
function showError(error: unknown) { toast.error(error instanceof Error ? error.message : "QR code request failed"); }
