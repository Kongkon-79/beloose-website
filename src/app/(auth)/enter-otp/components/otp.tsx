"use client";

import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface AuthActionResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    message: string;
  };
}

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export default function OtpForm() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(59);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const searchParams = useSearchParams();
  const email = searchParams.get("email")?.trim().toLowerCase() ?? "";
  const router = useRouter();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(
      () => setSecondsLeft((seconds) => Math.max(0, seconds - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: async (values: { email: string; otp: string }) => {
      let response: Response;

      try {
        response = await fetch(`${apiUrl}/auth/verify`, {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
      } catch {
        throw new Error("Unable to connect to the verification service");
      }

      let result: AuthActionResponse;

      try {
        result = (await response.json()) as AuthActionResponse;
      } catch {
        throw new Error("The verification service returned an invalid response");
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "OTP verification failed");
      }

      return result;
    },
    onSuccess: (result, values) => {
      toast.success(result.message || "Email verified successfully");
      router.push(
        `/change-password?email=${encodeURIComponent(values.email)}&otp=${encodeURIComponent(values.otp)}`,
      );
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "OTP verification failed. Please try again.",
      );
    },
  });

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = () => {
    const otpValue = otp.join("");
    if (!email) {
      toast.error("Email address is missing. Please request a new OTP.");
      return;
    }
    if (otpValue.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP.");
      return;
    }
    mutate({ email, otp: otpValue });
  };

  const resendOtp = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (email: string) => {
      let response: Response;

      try {
        response = await fetch(`${apiUrl}/auth/forgot-password`, {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
      } catch {
        throw new Error("Unable to resend the OTP");
      }

      const result = (await response.json()) as AuthActionResponse;

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to resend the OTP");
      }

      return result;
    },

    onSuccess: (result) => {
      toast.success(result.message || "Email sent successfully");
      setSecondsLeft(59);
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to resend the OTP. Please try again.",
      );
    },
  });



  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="flex w-full max-w-[590px] flex-col rounded-[10px] border border-[#CBA24A] bg-[rgba(19,15,9,0.78)] px-5 py-4 shadow-[0_4px_18px_rgba(0,0,0,0.45)] backdrop-blur-[5px] sm:px-6 sm:py-5">
        <div className="mb-2 flex items-center justify-center">
          <Link href="/">
            <Image
              src="/assets/images/logo.png"
              alt="Logo"
              width={76}
              height={76}
              className="h-[76px] w-[76px] object-contain"
              priority
            />
          </Link>
        </div>

        <h3 className="text-center font-[family-name:var(--font-playfair)] text-[30px] font-semibold leading-tight text-[#D5AB48]">
          Verify Email
        </h3>
        <p className="mt-1 text-center text-xs text-white/90">
          Enter OTP to verify your email address
        </p>

        <div className="mt-5 grid grid-cols-6 gap-2 sm:gap-4">
          {otp.map((digit, index) => (
            <Input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className={`h-12 w-full rounded-[5px] border bg-[#21170D]/70 p-0 text-center text-xl font-semibold shadow-none transition-colors focus-visible:ring-1 focus-visible:ring-[#CBA24A] sm:h-[68px] sm:text-2xl ${
                digit
                  ? "border-[#CBA24A] text-[#D5AB48]"
                  : "border-white/70 text-white"
              }`}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-white/90">
          <span>
            00:{secondsLeft.toString().padStart(2, "0")}
          </span>
          <p>
            Didn&apos;t get a code?{" "}
            <button
              type="button"
              onClick={() => resendOtp.mutate(email)}
              className="text-[#D5AB48] hover:underline disabled:opacity-60"
              disabled={resendOtp.isPending}
            >
              {resendOtp.isPending ? "Resending..." : "Resend"}
            </button>
          </p>
        </div>

        <Button
          disabled={isPending}
          onClick={handleVerify}
          className="mt-4 h-10 w-full rounded-[6px] bg-[#D5AB48] text-sm font-semibold text-[#241A0C] shadow-none hover:bg-[#E2BA5A]"
        >
          {isPending ? "Verifying..." : "Verify"}
        </Button>
      </div>
    </div>
  );
}
