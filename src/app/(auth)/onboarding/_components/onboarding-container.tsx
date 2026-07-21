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
  ["qrStyle", "qrPlacement"],
  [],
];

const OnboardingContainer = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = (session?.user as { accessToken?: string } | undefined)?.accessToken;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
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
        if (!accessToken) {
          throw new Error("Your session has expired. Please log in again.");
        }
        const response = await fetch(`${apiUrl}/retailer`, {
          method: "POST",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storeName: data.storeName.trim(),
            address: data.address.trim(),
            phoneNumber: data.phoneNumber.trim(),
            city: data.city.trim(),
            description: data.description.trim(),
          }),
        });

        const result = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: { _id?: string };
        };

        if (!response.ok || !result.success || !result.data?._id) {
          throw new Error(result.message || "Could not create retailer profile");
        }

        return result;
      },
    });

  const { mutateAsync: createHumidor, isPending: isCreatingHumidor } =
    useMutation({
      mutationKey: ["create-humidor"],
      mutationFn: async () => {
        if (!accessToken) {
          throw new Error("Your session has expired. Please log in again.");
        }
        const response = await fetch(`${apiUrl}/humidor`, {
          method: "POST",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${accessToken}`,
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
        if (!accessToken) {
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

        const response = await fetch(`${apiUrl}/inventory`, {
          method: "POST",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${accessToken}`,
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
    router.replace("/");
  };

  const CurrentIcon = steps[step].icon;
  return (
    <main className="min-h-screen bg-[#100f0e] text-white">
      <header className="flex h-[68px] items-center justify-between border-b border-[#2f2b28] px-5 sm:px-10">
        <div className="font-playfair text-2xl font-semibold text-[#d2a64e]">
          Humidor411
        </div>
        <div className="text-sm text-[#9e9994]">
          Onboarding · Step {step + 1} of {steps.length}
        </div>
      </header>

      <div className="px-5 pb-14 pt-6 sm:px-10">
        <div className="h-1.5 overflow-hidden rounded-full bg-[#302e2c]">
          <div
            className="h-full rounded-full bg-[#d0a34c] transition-all duration-300"
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
                        ? "border-[#d2a64e] text-[#d2a64e]"
                        : complete
                          ? "border-[#d2a64e] bg-[#d2a64e] text-black"
                          : "border-transparent bg-[#302e2c] text-[#99948f]"
                    }`}
                  >
                    {complete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </span>
                  <span className={`mt-2 text-center text-xs ${active ? "text-white" : "text-[#9c9893]"}`}>
                    {item.title}
                  </span>
                </button>
                {index < steps.length - 1 ? (
                  <span className="mt-5 h-px min-w-4 flex-1 bg-[#3a3734]" />
                ) : null}
              </div>
            );
          })}
        </nav>

        <form
          onSubmit={submit}
          className="mx-auto mt-10 w-full max-w-[672px] rounded-[15px] border border-[#393532] bg-[#191716] px-6 py-10 sm:px-10"
        >
          <div className="flex items-center gap-4">
            <CurrentIcon className="h-8 w-8 text-[#d2a64e]" />
            <div>
              <h1 className="font-playfair text-[28px] text-[#ece7e2]">{steps[step].title}</h1>
              <p className="text-sm text-[#96918d]">
                {step === 0 ? "Tell us about your shop" : `Complete your ${steps[step].short.toLowerCase()} setup`}
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
            {step === 3 && <QrCodeStep data={data} onChange={update} />}
            {step === 4 && <ReadyToLaunchStep data={data} />}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => (step === 0 ? router.back() : setStep((current) => current - 1))}
              className="flex items-center gap-2 text-sm text-[#9e9994] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              type="submit"
              disabled={isCreatingRetailer || isCreatingHumidor || isCreatingInventory}
              className="flex h-11 items-center justify-center gap-2 rounded-[12px] bg-[#d0a653] px-7 text-sm font-semibold text-black hover:bg-[#dfb661] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreatingRetailer || isCreatingHumidor || isCreatingInventory
                ? "Saving..."
                : step === steps.length - 1
                  ? "Launch Workspace"
                  : "Continue"}
              {step === steps.length - 1 ? <Rocket className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default OnboardingContainer;
