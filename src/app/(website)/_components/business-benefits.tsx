import { Check } from "lucide-react";
import Image from "next/image";

const benefits = [
  "Increase sales and average ticket value",
  "Improve profitability per transaction",
  "Save employee time on routine questions",
  "Reduce customer wait times significantly",
  "Deliver a better premium shopping experience",
  "Manage inventory faster with fewer errors",
  "Engage premium customers more deeply",
];

const BusinessBenefits = () => {
  return (
    <section className="bg-[#1b1006] py-16 text-[#d7c08c] sm:py-20 lg:py-[92px]">
      <div className="container px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid items-center gap-9 md:grid-cols-[0.92fr_1.08fr] lg:gap-12 xl:gap-14">
          <div className="mx-auto w-full max-w-[520px] md:mx-0">
            <Image
              src="/assets/images/business-benefits.png"
              alt="Premium cigar retail spaces and cigar presentation"
              width={648}
              height={520}
              sizes="(min-width: 1024px) 520px, (min-width: 768px) 48vw, 100vw"
              className="aspect-[648/520] h-auto w-full object-contain"
            />
          </div>

          <div className="mx-auto w-full max-w-[560px] md:mx-0">
            <p className="mb-4 text-[9px] font-semibold uppercase leading-none tracking-[0.22em] text-[#bd9142]">
              Business Benefits
            </p>

            <h2 className="max-w-[520px] font-serif text-[37px] font-bold leading-[0.95] text-[#f4dfad] sm:text-[46px] lg:text-[52px]">
              Built to Help Retailers{" "}
              <span className="block">Sell More Cigars</span>
            </h2>

            <p className="mt-5 max-w-[590px] text-[13px] leading-[1.35] text-[#a98f5d] sm:text-sm">
              Humidor411 is not inventory software — it is a revenue-generating
              operating platform that makes your store smarter, your team more
              productive, and your customers more satisfied.
            </p>

            <ul className="mt-8 space-y-3">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 text-[13px] leading-none text-[#c4aa76]"
                >
                  <Check className="mt-[-1px] h-3.5 w-3.5 flex-none text-[#d0a13d]" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessBenefits;
