import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const SuccessfullyApprovedModal = () => {
  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="w-full max-w-[590px] rounded-[10px] border border-[#CBA24A] bg-[rgba(19,15,9,0.88)] px-5 py-4 shadow-[0_4px_18px_rgba(0,0,0,0.45)] backdrop-blur-[5px] sm:px-6 sm:py-5">
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

        <h1 className="text-center font-[family-name:var(--font-playfair)] text-[27px] font-semibold leading-tight text-[#D5AB48]">
          Password Changed Successfully
        </h1>
        <p className="pb-5 pt-1 text-center text-xs font-normal text-white/90">
          Your password has been updated successfully
        </p>

        <Button
          asChild
          className="h-10 w-full rounded-[6px] bg-[#D5AB48] text-sm font-semibold text-[#241A0C] shadow-none hover:bg-[#E2BA5A]"
        >
          <Link href="/login">Back to Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessfullyApprovedModal;
