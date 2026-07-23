"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, CircleCheck } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import StripePaymentForm from "./stripe-payment-form";
import Link from "next/link";
import { getAuthenticatedRoute } from "@/lib/onboarding";
import { useEffect } from "react";

type Subscription = {
  _id: string;
  planName: string;
  price: number;
  plan: string;
  features: string[];
};

type SubscriptionResponse = {
  success: boolean;
  message?: string;
  data?: {
    data?: Subscription[];
  };
};

type PaymentResponse = {
  success: boolean;
  message?: string;
  data?: {
    clientSecret: string;
    paymentIntentId: string;
    amount: number;
  };
};

type PaymentDetails = NonNullable<PaymentResponse["data"]> & {
  planName: string;
};

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

const getSubscriptions = async (): Promise<Subscription[]> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

  let response: Response;

  try {
    response = await fetch(
      `${apiUrl}/subscribe?sortBy=createdAt&limit=10&page=1`,
      { headers: { accept: "*/*" } },
    );
  } catch {
    throw new Error("Unable to connect to the subscription service");
  }

  let result: SubscriptionResponse;

  try {
    result = await response.json();
  } catch {
    throw new Error("The subscription service returned an invalid response");
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Could not load subscription plans");
  }

  return result.data?.data ?? [];
};

const billingLabel = (plan: string) => {
  const normalizedPlan = plan.trim().toLowerCase();

  if (normalizedPlan === "monthly") return "Month";
  if (normalizedPlan === "yearly" || normalizedPlan === "annual") return "Year";

  return plan || "Plan";
};

const SubscriptionContainer = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null,
  );

  useEffect(() => {
    if (status === "authenticated" && session.user.isSubscription) {
      router.replace(getAuthenticatedRoute(session.user));
    }
  }, [router, session, status]);
  const {
    data: subscriptions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
  });

  const {
    mutate: createPayment,
    isPending,
    variables: selectedPlanId,
  } = useMutation({
    mutationKey: ["create-payment-intent"],
    mutationFn: async (subscriptionId: string) => {
      if (!session?.accessToken) {
        throw new Error("Please log in to continue with your subscription");
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

      let response: Response;

      try {
        response = await fetch(`${apiUrl}/payment/${subscriptionId}`, {
          method: "POST",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
      } catch {
        throw new Error("Unable to connect to the payment service");
      }

      let result: PaymentResponse;

      try {
        result = await response.json();
      } catch {
        throw new Error("The payment service returned an invalid response");
      }

      if (!response.ok || !result.success || !result.data?.clientSecret) {
        throw new Error(result.message || "Could not start the payment");
      }

      return result;
    },
    onSuccess: (result, subscriptionId) => {
      const plan = subscriptions.find(({ _id }) => _id === subscriptionId);

      if (!stripePromise) {
        toast.error("Stripe publishable key is not configured");
        return;
      }

      sessionStorage.setItem(
        "beloosePaymentIntent",
        JSON.stringify(result.data),
      );
      setPaymentDetails({
        ...result.data!,
        planName: plan?.planName || "Subscription",
      });
    },
    onError: (paymentError) => {
      toast.error(
        paymentError instanceof Error
          ? paymentError.message
          : "Could not start the payment",
      );

      if (!session?.accessToken) {
        router.push("/login?callbackUrl=/subscription");
      }
    },
  });

  return (
    <section className="relative isolate flex min-h-screen w-full items-center justify-center overflow-x-hidden px-4 py-8 sm:px-6">
      <Image
        src="/assets/images/auth_bg.png"
        alt="Premium cigar lounge"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-fill"
      />
      <div className="absolute inset-0 -z-10 bg-black/10" />

      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-center">
        {isLoading ? (
          <div className="rounded-lg border border-[#CBA24A]/70 bg-[#130f09]/85 px-8 py-6 text-sm text-[#F5E7C2] backdrop-blur-md">
            Loading subscription plans...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-400/60 bg-[#130f09]/90 px-8 py-6 text-center text-sm text-white backdrop-blur-md">
            {error instanceof Error
              ? error.message
              : "Could not load subscription plans"}
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="rounded-lg border border-[#CBA24A]/70 bg-[#130f09]/85 px-8 py-6 text-sm text-[#F5E7C2] backdrop-blur-md">
            No subscription plans are available right now.
          </div>
        ) : (
          <div className="flex w-full flex-wrap items-center justify-center gap-7">
            {subscriptions.map((subscription) => (
              <article
                key={subscription._id}
                className="flex min-h-[500px] w-full max-w-[560px] flex-col rounded-[9px] border border-[#CBA24A] bg-[rgba(18,12,7,0.82)] px-5 py-5 shadow-[0_12px_35px_rgba(0,0,0,0.55)] backdrop-blur-[7px]"
              >
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

                <h1 className="mt-4 text-center font-playfair text-[30px] font-semibold leading-tight text-[#D5AB48]">
                  {subscription.planName}
                </h1>
                <p className="mt-0.5 text-center text-xs text-white/80">
                  Perfect for getting started.
                </p>

                <div className="mt-6 flex items-end gap-1 text-[#FFF8E7]">
                  <span className="text-[42px] font-bold leading-none">
                    ${subscription.price}
                  </span>
                  <span className="mb-1 rounded-sm bg-[#FFF4D6] px-1.5 py-0.5 text-[9px] font-semibold leading-none text-[#4A3612]">
                    /{billingLabel(subscription.plan)}
                  </span>
                </div>

                <ul className="mt-6 flex-1 space-y-2">
                  {subscription.features.map((feature, index) => (
                    <li
                      key={`${subscription._id}-${index}`}
                      className="flex items-start gap-1.5 text-sm text-[#F8EFD9]"
                    >
                      <CircleCheck
                        aria-hidden="true"
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D5AB48]"
                        strokeWidth={1.8}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled={status === "loading" || isPending}
                  onClick={() => createPayment(subscription._id)}
                  className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-[5px] bg-[#D5AB48] text-xs font-semibold text-[#241A0C] transition-colors hover:bg-[#E2BA5A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF4D6] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending && selectedPlanId === subscription._id
                    ? "Starting Payment..."
                    : "Get Started"}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      {paymentDetails && stripePromise ? (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: paymentDetails.clientSecret }}
        >
          <StripePaymentForm
            planName={paymentDetails.planName}
            amount={paymentDetails.amount}
            clientSecret={paymentDetails.clientSecret}
            customerName={session?.user?.name}
            customerEmail={session?.user?.email}
            onClose={() => router.replace("/payment-cancel")}
            onSuccess={() => router.replace("/payment-success")}
          />
        </Elements>
      ) : null}
    </section>
  );
};

export default SubscriptionContainer;
