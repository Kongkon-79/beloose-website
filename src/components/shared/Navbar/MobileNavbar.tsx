"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-[5px] border border-[#d6a629]/70 bg-[#1b120b]/45 text-[#f2d58d] shadow-[0_10px_28px_rgba(0,0,0,0.2)] backdrop-blur-sm hover:bg-[#2a1a0a] hover:text-[#f7e5b6] focus-visible:ring-[#d6a629]"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[min(88vw,390px)] border-l border-[#6d4519] bg-[#150d05] p-4 text-[#e8d4a4] sm:p-5"
      >
        <div className="flex h-full flex-col pt-5">
             <Link href="/">
            <Image
              src="/assets/images/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="w-[48px] h-[45px]"
            />
          </Link>

          {/* <form
            onSubmit={handleSearch}
            className="mt-8 flex h-12 items-center rounded-[5px] border border-[#d6a629]/35 bg-[#241609] px-4"
          >
            <Search className="h-5 w-5 flex-none text-[#d8b75c]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search cigars, brands ..."
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-[#f8e7bd] outline-none placeholder:text-[#b69a68]"
            />
          </form> */}

          <div className="mt-8 space-y-3 border-t border-[#6d4519] pt-5">
            <Link
              href="#"
              onClick={closeSheet}
              className="flex h-12 items-center justify-center gap-3 rounded-[5px] bg-[#d7a73c] px-4 text-base font-semibold text-[#150d05] transition hover:bg-[#e5ba4f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6a629]"
            >
              <Store className="h-5 w-5" />
              Retailer
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;
