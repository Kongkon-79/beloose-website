import { Check } from "lucide-react";

const actions = [
  "Manage inventory",
  "Track QR scans",
  "Set staff picks",
  "View business insights",
];

const ReadyToLaunchStep = () => (
  <div className="pb-2 pt-7 sm:pt-8">
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#176b39] bg-[#123321] text-[#39df7d]">
      <Check className="h-10 w-10" strokeWidth={2} />
    </div>

    <div className="mt-5 text-center">
      <h2 className="font-playfair text-[28px] leading-tight text-[#ece7e2]">
        You&apos;re All Set!
      </h2>
      <p className="mt-3 text-sm text-[#96918d]">
        Your humidor is ready. Here&apos;s what you can do now:
      </p>
    </div>

    <div className="mx-auto mt-7 grid max-w-[510px] gap-x-16 gap-y-3 sm:grid-cols-2">
      {actions.map((action) => (
        <div key={action} className="flex items-center gap-3 text-sm text-[#ddd8d3]">
          <Check className="h-4 w-4 shrink-0 text-[#d2a64e]" strokeWidth={2} />
          <span>{action}</span>
        </div>
      ))}
    </div>
  </div>
);

export default ReadyToLaunchStep;
