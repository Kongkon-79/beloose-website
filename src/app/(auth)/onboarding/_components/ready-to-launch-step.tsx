import type { OnboardingData } from "./onboarding-types";

const ReadyToLaunchStep = ({ data }: { data: OnboardingData }) => (
  <div className="space-y-3 rounded-xl border border-[#383431] bg-[#151312] p-5 text-sm text-[#aaa59f]">
    <p><span className="text-[#d2a64e]">Business:</span> {data.storeName}</p>
    <p><span className="text-[#d2a64e]">Humidor:</span> {data.humidorName}</p>
    <p><span className="text-[#d2a64e]">Inventory:</span> {data.inventoryName} · {data.inventoryQuantity} items</p>
    <p><span className="text-[#d2a64e]">QR setup:</span> {data.qrStyle} · {data.qrPlacement}</p>
  </div>
);

export default ReadyToLaunchStep;
