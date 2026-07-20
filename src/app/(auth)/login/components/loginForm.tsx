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
import { getSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
  rememberMe: z.boolean(),
});

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  // console.log(isLoading)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        rememberMe: values.rememberMe,
        redirect: false,
      });

      if (!res || !res.ok || res.error) {
        throw new Error(res?.error || "Unable to sign in. Please try again.");
      }

      const session = await getSession();
      toast.success("Login successful!");
      router.replace(session?.user?.isSubscription ? "/onboarding" : "/subscription");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

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
          Welcome Back
        </h3>
        <p className="mt-1 text-center text-xs font-normal text-white/90">
          Sign in to your humidor account
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 pt-5"
          >
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
                      className="h-10 w-full rounded-[6px] border-0 bg-[#5A461D]/80 px-3 text-sm text-white shadow-none placeholder:text-[#D6C9A7] focus-visible:ring-1 focus-visible:ring-[#CBA24A]"
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
                  <FormLabel className="text-xs font-normal text-white">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="h-10 w-full rounded-[6px] border-0 bg-[#3B2D16]/80 px-3 pr-10 text-sm text-white shadow-none placeholder:text-[#B7A887] focus-visible:ring-1 focus-visible:ring-[#CBA24A]"
                        placeholder="Enter Password..."
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B7A887] transition-colors hover:text-[#CBA24A]"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
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
              name="rememberMe"
              render={({ field }) => (
                <div className="flex w-full items-center justify-between pt-0.5">
                  <FormItem className="flex items-center space-y-0 gap-2">
                    <FormControl>
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="h-3.5 w-3.5 rounded-[2px] border-[#CBA24A] data-[state=checked]:bg-[#CBA24A] data-[state=checked]:text-[#241A0C]"
                      />
                    </FormControl>
                    <label
                      className="cursor-pointer text-xs font-normal text-white"
                      htmlFor="rememberMe"
                    >
                      Remember Me
                    </label>
                  </FormItem>
                  <Link
                    className="text-xs font-normal text-[#D5AB48] hover:underline"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}
            />
            <Button
              disabled={isLoading}
              className="h-10 w-full rounded-[6px] bg-[#D5AB48] text-sm font-semibold text-[#241A0C] shadow-none hover:bg-[#E2BA5A]"
              type="submit"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <p className="pt-2 text-center text-xs font-normal text-white">
              Don&apos;t have an account?{" "}
              <Link className="text-[#D5AB48] hover:underline" href="/sign-up">
                Register Here
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
