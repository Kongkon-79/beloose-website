"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
type FormValues = z.input<typeof formSchema>;

interface ForgotPasswordResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: {
    message: string;
  };
}

const ForgotPasswordForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (email: string) => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

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
        throw new Error("Unable to connect to the password recovery service");
      }

      let result: ForgotPasswordResponse;

      try {
        result = (await response.json()) as ForgotPasswordResponse;
      } catch {
        throw new Error("The password recovery service returned an invalid response");
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to send the recovery email");
      }

      return result;
    },

    onSuccess: (result, email) => {
      toast.success(result.message || "Email sent successfully");
      router.push(`/enter-otp?email=${encodeURIComponent(email)}`);
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
    mutate(values.email.trim().toLowerCase());
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
          Forgot Password!
        </h3>
        <p className="mt-1 text-center text-xs text-white/90">
          Enter your email to recover your password
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-xs font-normal text-white">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="h-10 w-full rounded-[6px] border-0 bg-[#4A381A]/85 px-3 text-sm text-white shadow-none placeholder:text-[#C9B990] focus-visible:ring-1 focus-visible:ring-[#CBA24A]"
                      placeholder="Enter Your Email Address..."
                      {...field}
                    />
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
              {isPending ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
