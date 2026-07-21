export type RetailerQrCode = {
  _id: string;
  qrcodeUrl: string;
  retailerId?: { _id: string; storeName?: string; storeSlug?: string };
};

export class QrCodeApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

async function parseError(response: Response) {
  const result = await response.json().catch(() => null);
  throw new QrCodeApiError(result?.message || "QR code request failed", response.status);
}

export async function getMyQrCode(token: string, signal?: AbortSignal) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/qrcodes/me`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  if (!response.ok) return parseError(response);
  const result = await response.json();
  return result.data as RetailerQrCode;
}

export async function regenerateMyQrCode(token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/qrcodes/regenerate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return parseError(response);
  const result = await response.json();
  return result.data as RetailerQrCode;
}

export async function downloadMyQrCode(token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/qrcodes/me/download`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return parseError(response);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "beloose-store-qr.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
