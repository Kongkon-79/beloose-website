import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const PaymentSuccessContainer = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#100f0e] px-4 py-8">
      <section className="w-full max-w-[448px] rounded-[17px] border border-[#393532] bg-[#191716] px-7 py-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#17733a] bg-[#123622] text-[#3ee67f]">
          <Check className="h-10 w-10" strokeWidth={2.2} />
        </div>

        <h1 className="mt-5 font-playfair text-[28px] font-normal text-[#eee9e4]">
          Payment Successful!
        </h1>
        <p className="mx-auto mt-2 max-w-[340px] text-base leading-6 text-[#9c9894]">
          Welcome to Humidor411. Your 14-day free trial has started.
        </p>

        <Link
          href="/onboarding"
          className="mx-auto mt-6 flex h-12 w-full max-w-[224px] items-center justify-center gap-3 rounded-[12px] bg-[#d0a653] text-sm font-semibold text-black transition hover:bg-[#dfb661] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0cf8d]"
        >
          Set Up Your Shop
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
};

export default PaymentSuccessContainer;
