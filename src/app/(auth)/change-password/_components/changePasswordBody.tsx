"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

const formSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

interface ResetPasswordResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    message: string;
  };
}

const ChangePasswordBody = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email")?.trim().toLowerCase() ?? "";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["change-password"],
    mutationFn: async (values: {
      newPassword: string;
      email: string;
    }) => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

      let response: Response;

      try {
        response = await fetch(`${apiUrl}/auth/reset-password`, {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
      } catch {
        throw new Error("Unable to connect to the password reset service");
      }

      let result: ResetPasswordResponse;

      try {
        result = (await response.json()) as ResetPasswordResponse;
      } catch {
        throw new Error("The password reset service returned an invalid response");
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to reset your password");
      }

      return result;
    },
    onSuccess: (result) => {
      toast.success(result.message || "Password changed successfully");
      router.replace("/password-change-successfully");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!email) {
      toast.error("Email address is missing. Please restart password recovery.");
      return;
    }

    mutate({
      newPassword: values.newPassword,
      email,
    });
  };

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="w-full max-w-[590px] rounded-[10px] border border-[#CBA24A] bg-[rgba(19,15,9,0.78)] px-5 py-4 shadow-[0_4px_18px_rgba(0,0,0,0.45)] backdrop-blur-[5px] sm:px-6 sm:py-5">
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
          Change Password
        </h3>
        <p className="mt-1 text-center text-xs text-white/90">
          Enter your email to recover your password
        </p>

          <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 pt-5"
          >
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-normal text-white">
                    Create New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="h-10 w-full rounded-[6px] border-0 bg-[#3B2D16]/80 px-3 pr-10 text-sm text-white shadow-none placeholder:text-[#B7A887] focus-visible:ring-1 focus-visible:ring-[#CBA24A]"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B7A887] transition-colors hover:text-[#CBA24A]"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        tabIndex={-1}
                        aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                      >
                        {showNewPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-normal text-white">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repeat your password"
                        className="h-10 w-full rounded-[6px] border-0 bg-[#3B2D16]/80 px-3 pr-10 text-sm text-white shadow-none placeholder:text-[#B7A887] focus-visible:ring-1 focus-visible:ring-[#CBA24A]"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B7A887] transition-colors hover:text-[#CBA24A]"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? "Hide confirmed password" : "Show confirmed password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-400" />
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              className="h-10 w-full rounded-[6px] bg-[#D5AB48] text-sm font-semibold text-[#241A0C] shadow-none hover:bg-[#E2BA5A]"
              type="submit"
            >
              {isPending ? "Submitting..." : "Continue"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChangePasswordBody;
