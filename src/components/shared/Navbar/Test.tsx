// "use client";

// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Menu, Search, Store } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { FormEvent, useState } from "react";

// const MobileNavbar = () => {
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);
//   const [query, setQuery] = useState("");

//   const closeSheet = () => setIsOpen(false);

//   const handleSearch = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const params = new URLSearchParams();
//     if (query.trim()) params.set("q", query.trim());

//     closeSheet();
//     router.push(`/services${params.toString() ? `?${params}` : ""}`);
//   };

//   return (
//     <Sheet open={isOpen} onOpenChange={setIsOpen}>
//       <SheetTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="h-11 w-11 rounded-[5px] border border-[#d6a629]/70 bg-[#1b120b]/45 text-[#f2d58d] shadow-[0_10px_28px_rgba(0,0,0,0.2)] backdrop-blur-sm hover:bg-[#2a1a0a] hover:text-[#f7e5b6] focus-visible:ring-[#d6a629]"
//         >
//           <Menu className="h-5 w-5" />
//           <span className="sr-only">Open navigation menu</span>
//         </Button>
//       </SheetTrigger>
//       <SheetContent
//         side="right"
//         className="w-[min(88vw,390px)] border-l border-[#6d4519] bg-[#150d05] p-4 text-[#e8d4a4] sm:p-5"
//       >
//         <div className="flex h-full flex-col pt-5">
//              <Link href="/">
//             <Image
//               src="/assets/images/logo.png"
//               alt="Logo"
//               width={100}
//               height={100}
//               className="w-[48px] h-[45px]"
//             />
//           </Link>

//           <form
//             onSubmit={handleSearch}
//             className="mt-8 flex h-12 items-center rounded-[5px] border border-[#d6a629]/35 bg-[#241609] px-4"
//           >
//             <Search className="h-5 w-5 flex-none text-[#d8b75c]" />
//             <input
//               type="search"
//               value={query}
//               onChange={(event) => setQuery(event.target.value)}
//               placeholder="Search cigars, brands ..."
//               className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-[#f8e7bd] outline-none placeholder:text-[#b69a68]"
//             />
//           </form>

//           <div className="mt-5 space-y-3 border-t border-[#6d4519] pt-5">
//             <Link
//               href="#"
//               onClick={closeSheet}
//               className="flex h-12 items-center justify-center gap-3 rounded-[5px] bg-[#d7a73c] px-4 text-base font-semibold text-[#150d05] transition hover:bg-[#e5ba4f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6a629]"
//             >
//               <Store className="h-5 w-5" />
//               Retailer
//             </Link>
//           </div>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default MobileNavbar;



// "use client";

// import { Search, Store } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import MobileNavbar from "./MobileNavbar";
// import { FormEvent, useEffect, useState } from "react";
// import Image from "next/image";

// const Navbar = () => {
//   const router = useRouter();
//   const [query, setQuery] = useState("");
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 24);
//     };

//     handleScroll();
//     window.addEventListener("scroll", handleScroll, { passive: true });

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleSearch = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const params = new URLSearchParams();
//     if (query.trim()) params.set("q", query.trim());

//     router.push(`/services${params.toString() ? `?${params}` : ""}`);
//   };

//   return (
//     <header
//       className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
//         isScrolled
//           ? "border-b border-[#d6a629]/20 bg-[#0d0703]/90 shadow-[0_18px_45px_rgba(0,0,0,0.32)] backdrop-blur-xl"
//           : "bg-transparent"
//       }`}
//     >
//       <div className="container flex h-[72px] items-center justify-between gap-3 px-4 sm:px-6 lg:h-20 lg:px-8 xl:px-10">
//         <div className="flex min-w-0 flex-1 items-center">
//             <Link href="/">
//             <Image
//               src="/assets/images/logo.png"
//               alt="Logo"
//               width={100}
//               height={100}
//               className="w-[48px] h-[45px]"
//             />
//           </Link>
//         </div>

//         <form
//           onSubmit={handleSearch}
//           className={`hidden h-12 min-w-0 flex-[1.7] items-center rounded-[5px] px-4 text-white shadow-[0_12px_32px_rgba(0,0,0,0.16)] backdrop-blur-md transition-all duration-300 md:flex lg:max-w-[560px] xl:max-w-[620px] ${
//             isScrolled
//               ? "border border-[#d6a629]/35 bg-[#1a1008]/78"
//               : "border border-[#C7C8CB] bg-[#3F3834]/40 backdrop-blur-sm"
//           }`}
//         >
//           <Search className="h-4 w-4 flex-none text-white/80" />
//           <input
//             type="search"
//             value={query}
//             onChange={(event) => setQuery(event.target.value)}
//             placeholder="Search cigars, brands ..."
//             className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-[#f8e7bd] outline-none placeholder:text-white/72"
//           />
//         </form>

//         <div className="hidden flex-1 items-center justify-end lg:flex">
//           <Link
//             href="#"
//             className="inline-flex h-12 min-w-[150px] items-center justify-center gap-2.5 rounded-[4px] bg-primary px-6 text-base lg:text-lg font-medium leading-normal text-[#1E1409] shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition hover:bg-[#e5ba4f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0cf76]"
//           >
//             <Store className="h-6 w-6" />
//             Retailer
//           </Link>
//         </div>

//         <div className="flex justify-end lg:hidden">
//           <MobileNavbar />
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

