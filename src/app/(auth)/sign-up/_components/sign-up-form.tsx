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
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

const formSchema = z
  .object({
    fullName: z.string().min(1, { message: "Full name is required." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
    confirmPassword: z.string().min(1, { message: "Confirm password is required." }),
    // agreementAccepted: z
    //   .boolean()
    //   .refine((value) => value, { message: "Please accept the terms and conditions." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

type RegisterResponse = {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    newUser?: {
      _id: string;
      fullName: string;
      email: string;
      role: string;
      verfied: string;
      status: string;
      isSubscription: boolean;
    };
  };
};

const SignupForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      // agreementAccepted: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["register-user"],
    mutationFn: async (values: FormValues) => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

      let res: Response;

      try {
        res = await fetch(`${apiUrl}/auth/register`, {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: values.fullName.trim(),
            email: values.email.trim().toLowerCase(),
            password: values.password,
          }),
        });
      } catch {
        throw new Error("Unable to connect to the registration service");
      }

      let data: RegisterResponse;

      try {
        data = await res.json();
      } catch {
        throw new Error("The registration service returned an invalid response");
      }

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Registration failed");
      }

      return data;
    },
    onSuccess: async (data, values) => {
      toast.success(data?.message || "User registered successfully");

      const loginResult = await signIn("credentials", {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        redirect: false,
      });

      if (loginResult?.ok) {
        router.replace("/subscription");
        router.refresh();
        return;
      }

      toast.error("Account created. Please log in to continue.");
      router.push("/login?callbackUrl=/subscription");
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
    mutate(values);
  };

  const inputClassName =
    "h-10 w-full rounded-[6px] border-0 bg-[#3B2D16]/80 px-3 text-sm text-white shadow-none placeholder:text-[#B7A887] focus-visible:ring-1 focus-visible:ring-[#CBA24A]";
  const labelClassName =
    "text-xs font-normal text-white";

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
          Create your account
        </h3>
        <p className="mt-1 text-center text-xs text-white/90">
          Connect families with trusted care jobs in humidor today.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 pt-5"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClassName}>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      className={inputClassName}
                      placeholder="Sofia Lindström"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClassName}>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className={inputClassName}
                      placeholder="Enter Your Email Address..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={labelClassName}>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className={`${inputClassName} pr-10`}
                        placeholder="Create a strong password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B7A887] transition-colors hover:text-[#CBA24A]"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
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
                  <FormLabel className={labelClassName}>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        className={`${inputClassName} pr-10`}
                        placeholder="Repeat your password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B7A887] transition-colors hover:text-[#CBA24A]"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        tabIndex={-1}
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

            {/* <FormField
              control={form.control}
              name="agreementAccepted"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        id="agreementAccepted"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                        className="h-3.5 w-3.5 rounded-[2px] border-[#CBA24A] data-[state=checked]:bg-[#CBA24A] data-[state=checked]:text-[#241A0C]"
                      />
                    </FormControl>
                    <Label
                      className="cursor-pointer text-xs font-normal text-white"
                      htmlFor="agreementAccepted"
                    >
                      I agree to the{" "}
                      <span className="text-[#D5AB48]">Terms and Conditions</span>
                    </Label>
                  </div>
                  <FormMessage className="text-xs text-red-400" />
                </FormItem>
              )}
            /> */}
            <Button
              disabled={isPending}
              className="h-10 w-full rounded-[6px] bg-[#D5AB48] text-sm font-semibold text-[#241A0C] shadow-none hover:bg-[#E2BA5A]"
              type="submit"
            >
              {isPending ? "Signing up..." : "Sign up"}
            </Button>

            {/* <p className="pt-1 text-center text-xs font-normal text-white">
              Already have an account?{" "}
              <Link className="text-[#D5AB48] hover:underline" href="/login">
                Log In
              </Link>
            </p> */}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignupForm;
