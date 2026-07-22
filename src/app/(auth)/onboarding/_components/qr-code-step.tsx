"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useSession } from "next-auth/react";

type QrCodeResponse = {
  success?: boolean;
  message?: string;
  data?: {
    _id: string;
    qrcodeUrl: string;
    retailerId: {
      _id: string;
      storeName: string;
      storeSlug: string;
    };
  };
};

const getMyQrCode = async (accessToken: string) => {
  const apiUrl =
    process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:8081/api/v1";

  let response: Response;

  try {
    response = await fetch(`${apiUrl}/qrcodes/me`, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch {
    throw new Error("Unable to connect to the QR code service");
  }

  let result: QrCodeResponse;

  try {
    result = await response.json();
  } catch {
    throw new Error("The QR code service returned an invalid response");
  }

  if (!response.ok || !result.success || !result.data?.qrcodeUrl) {
    throw new Error(result.message || "Could not load your QR code");
  }

  return result.data;
};

const QrCodeStep = () => {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken;
  const {
    data: qrCode,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-qr-code", session?.user?.id],
    queryFn: () => getMyQrCode(accessToken!),
    enabled: Boolean(accessToken),
  });

  return (
    <div>
      <div className="flex min-h-[280px] items-center justify-center rounded-[12px] border border-[#6f5528] bg-[#3B2D16]/55 p-5 text-center">
        {status === "loading" || isLoading ? (
          <p className="text-sm text-[#96918c]">Loading your QR code...</p>
        ) : status === "unauthenticated" || !accessToken ? (
          <p className="text-sm text-red-400">
            Your session has expired. Please log in again.
          </p>
        ) : error ? (
          <div className="space-y-3">
            <p className="text-sm text-red-400">
              {error instanceof Error
                ? error.message
                : "Could not load your QR code"}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded-lg border border-[#d0a653] px-4 py-2 text-xs font-semibold text-[#d0a653] hover:bg-[#d0a653] hover:text-black"
            >
              Try again
            </button>
          </div>
        ) : qrCode ? (
          <div className="space-y-3">
            <Image
              src={qrCode.qrcodeUrl}
              alt={`${qrCode.retailerId.storeName} QR code`}
              width={220}
              height={220}
              className="mx-auto h-[220px] w-[220px] rounded-lg bg-white object-contain p-2"
            />
            <div>
              <p className="text-sm font-medium text-[#ece7e2]">
                {qrCode.retailerId.storeName}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QrCodeStep;
