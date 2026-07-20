import type { ChangeEvent } from "react";

export type OnboardingData = {
  storeName: string;
  address: string;
  city: string;
  phoneNumber: string;
  description: string;
  retailerId: string;
  humidorName: string;
  humidorLocation: string;
  humidorDescription: string;
  shelfes: Array<{ name: string; description: string }>;
  humidorId: string;
  inventoryName: string;
  inventoryBrand: string;
  inventoryStrength: string;
  inventoryWrapper: string;
  inventorySize: string;
  inventoryDescription: string;
  inventoryShelfName: string;
  inventoryQuantity: string;
  inventoryPrice: string;
  lowStockThreshold: string;
  isStaffPick: boolean;
  staffPickNote: string;
  staffPickBy: string;
  isNewArrival: boolean;
  arrivalDate: string;
  isDailyFeatured: boolean;
  featuredNote: string;
  inventoryId: string;
  qrStyle: string;
  qrPlacement: string;
};

export type OnboardingStepProps = {
  data: OnboardingData;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
};

export type BusinessInformationData = Pick<
  OnboardingData,
  "storeName" | "address" | "city" | "phoneNumber" | "description"
>;

export type BusinessInformationField = keyof BusinessInformationData;

export type InventoryData = Pick<
  OnboardingData,
  | "inventoryName"
  | "inventoryBrand"
  | "inventoryStrength"
  | "inventoryWrapper"
  | "inventorySize"
  | "inventoryDescription"
  | "inventoryShelfName"
  | "inventoryQuantity"
  | "inventoryPrice"
  | "lowStockThreshold"
  | "isStaffPick"
  | "staffPickNote"
  | "staffPickBy"
  | "isNewArrival"
  | "arrivalDate"
  | "isDailyFeatured"
  | "featuredNote"
  | "shelfes"
>;

export type InventoryField = Exclude<keyof InventoryData, "shelfes">;

export const inputClassName =
  "h-[50px] w-full rounded-[12px] border border-[#383431] bg-[#1b1918] px-4 text-sm text-[#e5e1dc] outline-none transition placeholder:text-[#9b9da6] focus:border-[#d1a54d]";

export const labelClassName =
  "mb-1.5 block text-xs font-medium uppercase tracking-[0.04em] text-[#96918c]";

export const textareaClassName =
  "min-h-[104px] w-full resize-none rounded-[12px] border border-[#383431] bg-[#1b1918] px-4 py-3 text-sm text-[#e5e1dc] outline-none transition placeholder:text-[#9b9da6] focus:border-[#d1a54d]";
