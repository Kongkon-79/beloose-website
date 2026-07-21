"use client";

import {
  ArrowLeft,
  ArrowRight,
  Box,
  Check,
  PackagePlus,
  QrCode,
  Rocket,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import BusinessInformationStep from "./business-information-step";
import FirstHumidorStep from "./first-humidor-step";
import InventoryStep from "./inventory-step";
import QrCodeStep from "./qr-code-step";
import ReadyToLaunchStep from "./ready-to-launch-step";
import type {
  BusinessInformationField,
  InventoryField,
  OnboardingData,
} from "./onboarding-types";

const initialData: OnboardingData = {
  storeName: "",
  address: "",
  city: "",
  phoneNumber: "",
  description: "",
  retailerId: "",
  humidorName: "",
  humidorLocation: "",
  humidorDescription: "",
  shelfes: [{ name: "", description: "" }],
  humidorId: "",
  inventoryName: "",
  inventoryBrand: "",
  inventoryStrength: "medium",
  inventoryWrapper: "",
  inventorySize: "",
  inventoryDescription: "",
  inventoryShelfName: "",
  inventoryQuantity: "",
  inventoryPrice: "",
  lowStockThreshold: "5",
  isStaffPick: false,
  staffPickNote: "",
  staffPickBy: "",
  isNewArrival: false,
  arrivalDate: "",
  isDailyFeatured: false,
  featuredNote: "",
  inventoryId: "",
  qrStyle: "Classic Gold",
  qrPlacement: "At each shelf",
};

const steps = [
  { title: "Business Information", short: "Business Info", icon: Store },
  { title: "Create First Humidor", short: "First Humidor", icon: Box },
  { title: "Import / Add Inventory", short: "Inventory", icon: PackagePlus },
  { title: "Generate QR Codes", short: "QR Codes", icon: QrCode },
  { title: "Ready to Launch!", short: "Launch", icon: Rocket },
];

const requiredFields: (keyof OnboardingData)[][] = [
  ["storeName", "address", "city", "phoneNumber", "description"],
  ["humidorName", "humidorLocation", "humidorDescription"],
  ["inventoryName", "inventoryBrand", "inventoryStrength", "inventoryWrapper", "inventorySize", "inventoryDescription", "inventoryShelfName", "inventoryQuantity", "inventoryPrice", "lowStockThreshold"],
  [],
  [],
];

const normalizePhoneNumber = (value: string) => {
  const phoneNumber = value.trim().replace(/[\s()-]/g, "");

  if (/^01[3-9]\d{8}$/.test(phoneNumber)) {
    return `+88${phoneNumber}`;
  }
  if (/^8801[3-9]\d{8}$/.test(phoneNumber)) {
    return `+${phoneNumber}`;
  }

  return phoneNumber;
};

const isValidPhoneNumber = (value: string) => {
  const phoneNumber = normalizePhoneNumber(value);

  if (phoneNumber.startsWith("+880")) {
    return /^\+8801[3-9]\d{8}$/.test(phoneNumber);
  }

  return /^\+[1-9]\d{7,14}$/.test(phoneNumber);
};

const OnboardingContainer = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [inventoryImage, setInventoryImage] = useState<File | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("humidor411-onboarding");
    if (saved) {
      try {
        setData({ ...initialData, ...JSON.parse(saved) });
      } catch {
        localStorage.removeItem("humidor411-onboarding");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("humidor411-onboarding", JSON.stringify(data));
  }, [data]);

  const update = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setData((current) => ({ ...current, [name]: value }));
  };

  const updateBusinessField = (
    field: BusinessInformationField,
    value: string,
  ) => {
    setData((current) => ({ ...current, [field]: value }));
  };

  const updateInventoryField = (
    field: InventoryField,
    value: string | boolean,
  ) => {
    setData((current) => ({ ...current, [field]: value }));
  };

  const updateShelf = (
    index: number,
    field: "name" | "description",
    value: string,
  ) => {
    setData((current) => ({
      ...current,
      shelfes: current.shelfes.map((shelf, shelfIndex) =>
        shelfIndex === index ? { ...shelf, [field]: value } : shelf,
      ),
    }));
  };

  const addShelf = () => {
    setData((current) => ({
      ...current,
      shelfes: [...current.shelfes, { name: "", description: "" }],
    }));
  };

  const removeShelf = (index: number) => {
    setData((current) => ({
      ...current,
      shelfes: current.shelfes.filter((_, shelfIndex) => shelfIndex !== index),
    }));
  };

  const { mutateAsync: createRetailer, isPending: isCreatingRetailer } =
    useMutation({
      mutationKey: ["create-retailer"],
      mutationFn: async () => {
        if (!session?.accessToken) {
          throw new Error("Your session has expired. Please log in again.");
        }

        const apiUrl =
          process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:8081/api/v1";
        const response = await fetch(`${apiUrl}/retailer`, {
          method: "POST",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storeName: data.storeName.trim(),
            address: data.address.trim(),
            phoneNumber: normalizePhoneNumber(data.phoneNumber),
            city: data.city.trim(),
            description: data.description.trim(),
          }),
        });

        const result = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: { _id?: string };
          errorSources?: Array<{ message?: string }>;
        };

        if (!response.ok || !result.success || !result.data?._id) {
          throw new Error(
            result.errorSources?.[0]?.message ||
              result.message ||
              "Could not create retailer profile",
          );
        }

        return result;
      },
    });

  const { mutateAsync: createHumidor, isPending: isCreatingHumidor } =
    useMutation({
      mutationKey: ["create-humidor"],
      mutationFn: async () => {
        if (!session?.accessToken) {
          throw new Error("Your session has expired. Please log in again.");
        }

        const apiUrl =
          process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:8081/api/v1";
        const response = await fetch(`${apiUrl}/humidor`, {
          method: "POST",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.humidorName.trim(),
            location: data.humidorLocation.trim(),
            description: data.humidorDescription.trim(),
            shelfes: data.shelfes.map((shelf) => ({
              name: shelf.name.trim(),
              description: shelf.description.trim(),
            })),
          }),
        });

        const result = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: { _id?: string };
        };

        if (!response.ok || !result.success || !result.data?._id) {
          throw new Error(result.message || "Could not create humidor");
        }

        return result;
      },
    });

  const { mutateAsync: createInventory, isPending: isCreatingInventory } =
    useMutation({
      mutationKey: ["create-inventory"],
      mutationFn: async () => {
        if (!session?.accessToken) {
          throw new Error("Your session has expired. Please log in again.");
        }
        if (!data.humidorId) {
          throw new Error("Please create a humidor before adding inventory.");
        }
        if (!inventoryImage) {
          throw new Error("Please select a cigar image.");
        }

        const formData = new FormData();
        formData.append("name", data.inventoryName.trim());
        formData.append("brand", data.inventoryBrand.trim());
        formData.append("strength", data.inventoryStrength);
        formData.append("wrapper", data.inventoryWrapper.trim());
        formData.append("size", data.inventorySize.trim());
        formData.append("description", data.inventoryDescription.trim());
        formData.append("humidorId", data.humidorId);
        formData.append("shelfName", data.inventoryShelfName);
        formData.append("quantity", data.inventoryQuantity);
        formData.append("price", data.inventoryPrice);
        formData.append("lowStockThreshold", data.lowStockThreshold);
        formData.append("isStaffPick", String(data.isStaffPick));
        formData.append("staffPickNote", data.staffPickNote.trim());
        formData.append("staffPickBy", data.staffPickBy.trim());
        formData.append("isNewArrival", String(data.isNewArrival));
        formData.append("arrivalDate", data.arrivalDate);
        formData.append("isDailyFeatured", String(data.isDailyFeatured));
        formData.append("featuredNote", data.featuredNote.trim());
        formData.append("image", inventoryImage);

        const apiUrl =
          process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:8081/api/v1";
        const response = await fetch(`${apiUrl}/inventory`, {
          method: "POST",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: formData,
        });
        const result = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: { _id?: string };
        };

        if (!response.ok || !result.success || !result.data?._id) {
          throw new Error(result.message || "Could not create inventory item");
        }
        return result;
      },
    });

  const next = async () => {
    const missing = requiredFields[step].some((field) => {
      const value = data[field];
      return typeof value !== "string" || !value.trim();
    });
    if (missing) {
      toast.error("Please complete all required fields");
      return;
    }

    if (step === 0 && !isValidPhoneNumber(data.phoneNumber)) {
      toast.error(
        "Enter a valid phone number, for example 01712345678 or +8801712345678",
      );
      return;
    }

    if (
      step === 1 &&
      data.shelfes.some((shelf) => !shelf.name.trim() || !shelf.description.trim())
    ) {
      toast.error("Please complete the name and description for every shelf");
      return;
    }

    if (step === 2 && !inventoryImage && !data.inventoryId) {
      toast.error("Please select a cigar image");
      return;
    }
    if (step === 2 && data.isStaffPick && (!data.staffPickBy.trim() || !data.staffPickNote.trim())) {
      toast.error("Please complete the staff pick details");
      return;
    }
    if (step === 2 && data.isNewArrival && !data.arrivalDate) {
      toast.error("Please select the arrival date");
      return;
    }
    if (step === 2 && data.isDailyFeatured && !data.featuredNote.trim()) {
      toast.error("Please add a featured note");
      return;
    }

    if (step === 0 && !data.retailerId) {
      try {
        const result = await createRetailer();
        setData((current) => ({
          ...current,
          retailerId: result.data?._id || "",
        }));
        toast.success(result.message || "Business information saved");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not save business information",
        );
        return;
      }
    }

    if (step === 1 && !data.humidorId) {
      try {
        const result = await createHumidor();
        setData((current) => ({
          ...current,
          humidorId: result.data?._id || "",
        }));
        toast.success(result.message || "Humidor saved successfully");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not save humidor",
        );
        return;
      }
    }

    if (step === 2 && !data.inventoryId) {
      try {
        const result = await createInventory();
        setData((current) => ({
          ...current,
          inventoryId: result.data?._id || "",
        }));
        toast.success(result.message || "Inventory saved successfully");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not save inventory",
        );
        return;
      }
    }

    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (step < steps.length - 1) {
      void next();
      return;
    }
    localStorage.removeItem("humidor411-onboarding");
    toast.success("Your Humidor411 workspace is ready!");
    router.replace("/retailer-dashboard");
  };

  const CurrentIcon = steps[step].icon;
  return (
    <main className="relative isolate min-h-screen overflow-hidden text-white">
      <Image
        src="/assets/images/auth_bg.png"
        alt="Premium cigar lounge"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-black/45" />

      <header className="flex h-[68px] items-center justify-between border-b border-[#CBA24A]/30 bg-[#130f09]/75 px-5 backdrop-blur-md sm:px-10">
        <div className="font-playfair text-2xl font-semibold text-[#D5AB48]">
          Humidor411
        </div>
        <div className="text-sm text-[#9e9994]">
          Onboarding · Step {step + 1} of {steps.length}
        </div>
      </header>

      <div className="px-5 pb-14 pt-6 sm:px-10">
        <div className="h-1.5 overflow-hidden rounded-full bg-[#3B2D16]/80">
          <div
            className="h-full rounded-full bg-[#D5AB48] transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <nav className="mx-auto mt-10 flex max-w-[1000px] items-start overflow-x-auto pb-3">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const active = index === step;
            const complete = index < step;
            return (
              <div key={item.title} className="flex min-w-0 flex-1 items-start">
                <button
                  type="button"
                  onClick={() => index <= step && setStep(index)}
                  className="flex min-w-[92px] flex-col items-center"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                      active
                        ? "border-[#D5AB48] bg-[#241A0C]/80 text-[#D5AB48]"
                        : complete
                          ? "border-[#D5AB48] bg-[#D5AB48] text-[#241A0C]"
                          : "border-[#6f5528] bg-[#3B2D16]/80 text-[#B7A887]"
                    }`}
                  >
                    {complete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </span>
                  <span className={`mt-2 text-center text-xs ${active ? "text-[#F5E7C2]" : "text-[#B7A887]"}`}>
                    {item.title}
                  </span>
                </button>
                {index < steps.length - 1 ? (
                  <span className="mt-5 h-px min-w-4 flex-1 bg-[#CBA24A]/30" />
                ) : null}
              </div>
            );
          })}
        </nav>

        <form
          onSubmit={submit}
          className="mx-auto mt-10 w-full max-w-[672px] rounded-[15px] border border-[#CBA24A] bg-[rgba(19,15,9,0.86)] px-6 py-10 shadow-[0_12px_35px_rgba(0,0,0,0.55)] backdrop-blur-[7px] sm:px-10"
        >
          <div className="flex items-center gap-4">
            <CurrentIcon className="h-8 w-8 text-[#D5AB48]" />
            <div>
              <h1 className="font-playfair text-[28px] text-[#F5E7C2]">{steps[step].title}</h1>
              <p className="text-sm text-[#B7A887]">
                {step === 0
                  ? "Tell us about your shop"
                  : step === steps.length - 1
                    ? "You're all set"
                    : `Complete your ${steps[step].short.toLowerCase()} setup`}
              </p>
            </div>
          </div>

          <div className="mt-7">
            {step === 0 && (
              <BusinessInformationStep
                data={data}
                onFieldChange={updateBusinessField}
              />
            )}
            {step === 1 && (
              <FirstHumidorStep
                data={data}
                onChange={update}
                onShelfChange={updateShelf}
                onAddShelf={addShelf}
                onRemoveShelf={removeShelf}
              />
            )}
            {step === 2 && (
              <InventoryStep
                data={data}
                image={inventoryImage}
                onFieldChange={updateInventoryField}
                onImageChange={setInventoryImage}
              />
            )}
            {step === 3 && <QrCodeStep />}
            {step === 4 && <ReadyToLaunchStep />}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => (step === 0 ? router.back() : setStep((current) => current - 1))}
              className="flex items-center gap-2 text-sm text-[#B7A887] hover:text-[#F5E7C2]"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="submit"
              disabled={isCreatingRetailer || isCreatingHumidor || isCreatingInventory}
              className="flex h-11 items-center justify-center gap-2 rounded-[12px] bg-[#D5AB48] px-7 text-sm font-semibold text-[#241A0C] hover:bg-[#E2BA5A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreatingRetailer || isCreatingHumidor || isCreatingInventory
                ? "Saving..."
                : step === steps.length - 1
                  ? "Go to Dashboard"
                  : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default OnboardingContainer;
