"use client";

import { Store } from "lucide-react";
import Link from "next/link";
import MobileNavbar from "./MobileNavbar";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/store/")) return null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-[#d6a629]/20 bg-[#0d0703]/90 shadow-[0_18px_45px_rgba(0,0,0,0.32)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-[72px] items-center justify-between gap-3 px-4 sm:px-6 lg:h-20 lg:px-8 xl:px-10">
        <div className="flex min-w-0 flex-1 items-center">
            <Link href="/">
            <Image
              src="/assets/images/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="w-[48px] h-[45px]"
            />
          </Link>
        </div>

        {/* <form
          onSubmit={handleSearch}
          className={`hidden h-12 min-w-0 flex-[1.7] items-center rounded-[5px] px-4 text-white shadow-[0_12px_32px_rgba(0,0,0,0.16)] backdrop-blur-md transition-all duration-300 md:flex lg:max-w-[560px] xl:max-w-[620px] ${
            isScrolled
              ? "border border-[#d6a629]/35 bg-[#1a1008]/78"
              : "border border-[#C7C8CB] bg-[#3F3834]/40 backdrop-blur-sm"
          }`}
        >
          <Search className="h-4 w-4 flex-none text-white/80" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search cigars, brands ..."
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-[#f8e7bd] outline-none placeholder:text-white/72"
          />
        </form> */}

        <div className="hidden flex-1 items-center justify-end lg:flex">
          <Link
            href={status === "authenticated" ? "/retailer-dashboard" : "/login"}
            className="inline-flex h-12 min-w-[150px] items-center justify-center gap-2.5 rounded-[4px] bg-primary px-6 text-base lg:text-lg font-medium leading-normal text-[#1E1409] shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition hover:bg-[#e5ba4f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0cf76]"
          >
            <Store className="h-6 w-6" />
            {status === "authenticated" ? "Dashboard" : "Retailer Login"}
          </Link>
        </div>

        <div className="flex justify-end lg:hidden">
          <MobileNavbar />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
