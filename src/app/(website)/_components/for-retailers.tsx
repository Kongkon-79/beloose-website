import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const retailerFeatures = [
  "Organize cigars by humidor, shelf, and row",
  "Real-time inventory tracking and alerts",
  "QR codes generated per product location",
  "Staff management and role-based access",
  "Sales analytics and trending product reports",
  "Multi-location humidor management",
];

const ForRetailers = () => {
  return (
    <section className="bg-[#150b04] py-14 text-[#d4bd86] sm:py-16 lg:py-[76px]">
      <div className="container px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className=" grid items-center gap-9 md:grid-cols-[1.08fr_0.92fr] lg:gap-12 xl:gap-14">
          <div className="relative overflow-hidden rounded-[5px] bg-[#241408] shadow-[0_28px_60px_rgba(0,0,0,0.22)]">
            <Image
              src="/assets/images/ForRetailers.png"
              alt="Cigar retailer holding a tray of cigars"
              width={755}
              height={520}
              sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
              className="aspect-[755/520] h-auto w-full object-cover"
            />
          </div>

          <div className="mx-auto w-full max-w-[520px] md:mx-0">
            <p className="mb-4 text-[9px] font-semibold uppercase leading-none tracking-[0.22em] text-[#c79a42]">
              For Retailers
            </p>

            <h2 className="max-w-[420px] font-serif text-[38px] font-bold leading-[0.95] text-[#f5dfaa] sm:text-[48px] lg:text-[56px]">
              Run Your Shop{" "}
              <span className="block text-[#d1a13c]">Smarter</span>
            </h2>

            <p className="mt-5 max-w-[560px] text-[13px] leading-[1.45] text-[#b79b67] sm:text-sm">
              Manage cigars, humidors, and inventory with precision.
              Humidor411 gives your team the tools to organize every product,
              every shelf, and every walk-in with confidence.
            </p>

            <ul className="mt-8 space-y-3">
              {retailerFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-[13px] leading-none text-[#c3aa78]"
                >
                  <Check className="mt-[-1px] h-3.5 w-3.5 flex-none text-[#d0a13d]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/services"
              className="mt-9 inline-flex h-10 items-center justify-center gap-3 rounded-[4px] bg-[#d4a43d] px-5 text-[12px] font-semibold text-[#1c1006] shadow-[0_16px_32px_rgba(0,0,0,0.18)] transition hover:bg-[#e0b657] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0cf76]"
            >
              Explore More Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForRetailers;
