export class RetailerApiError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function getMyRetailer(token: string, signal?: AbortSignal) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/retailer/me`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  const result = await response.json();
  if (!response.ok) throw new RetailerApiError(result?.message || "Failed to load retailer profile", response.status);
  return result?.data as { _id: string };
}
