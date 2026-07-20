"use client";

import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { LoaderCircle, LockKeyhole, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type StripePaymentFormProps = {
  planName: string;
  amount: number;
  clientSecret: string;
  customerName?: string | null;
  customerEmail?: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

const elementOptions = {
  style: {
    base: {
      color: "#b8bac4",
      fontFamily: "Inter, sans-serif",
      fontSize: "16px",
      lineHeight: "48px",
      "::placeholder": { color: "#8f9199" },
      iconColor: "#aaa8a2",
    },
    invalid: {
      color: "#f87171",
      iconColor: "#f87171",
    },
  },
};

const StripePaymentForm = ({
  planName,
  amount,
  clientSecret,
  customerName,
  customerEmail,
  onClose,
  onSuccess,
}: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const card = elements?.getElement(CardNumberElement);

    if (!stripe || !elements || !card) return;

    setIsSubmitting(true);
    setErrorMessage("");

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card,
          billing_details: {
            name: customerName || undefined,
            email: customerEmail || undefined,
          },
        },
      },
    );

    setIsSubmitting(false);

    if (error) {
      const message = error.message || "Payment could not be completed";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      sessionStorage.removeItem("beloosePaymentIntent");
      toast.success("Payment completed successfully");
      onSuccess();
      return;
    }

    if (paymentIntent?.status === "canceled") {
      onClose();
      return;
    }

    setErrorMessage("Payment is still processing. Please check again shortly.");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0b0a]/95 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-title"
    >
      <div className="relative w-full max-w-[448px] rounded-[17px] border border-[#393532] bg-[#191716] px-8 py-9 shadow-2xl sm:px-10">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close payment form"
          className="absolute right-4 top-4 text-[#8f8b87] transition hover:text-white disabled:cursor-not-allowed"
        >
          <X className="h-5 w-5" />
        </button>

        <h2
          id="payment-title"
          className="text-center font-playfair text-[28px] font-normal text-[#eee9e4]"
        >
          Payment
        </h2>
        <p className="mt-1 text-center text-sm text-[#9c9894]">
          Selected plan:{" "}
          <span className="font-semibold text-[#d3a84f]">{planName}</span>
        </p>
        <p className="mt-1 text-center text-xs text-[#77736f]">
          Amount due: ${amount.toFixed(2)}
        </p>

        <form className="mt-7" onSubmit={handleSubmit}>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#9c9894]">
            Card number
          </label>
          <div className="h-[52px] rounded-[13px] border border-[#373330] bg-[#1b1918] px-4">
            <CardNumberElement options={elementOptions} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="h-[52px] rounded-[13px] border border-[#373330] bg-[#1b1918] px-4">
              <CardExpiryElement options={elementOptions} />
            </div>
            <div className="h-[52px] rounded-[13px] border border-[#373330] bg-[#1b1918] px-4">
              <CardCvcElement options={elementOptions} />
            </div>
          </div>

          {errorMessage ? (
            <p className="mt-3 text-sm text-red-400" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!stripe || isSubmitting}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[12px] bg-[#d0a653] text-sm font-semibold text-black transition hover:bg-[#dfb661] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[#77736f]">
            <LockKeyhole className="h-3 w-3" />
            Secure payment powered by Stripe
          </p>
        </form>
      </div>
    </div>
  );
};

export default StripePaymentForm;
