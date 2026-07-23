import { ImagePlus, Package } from "lucide-react";
import type { ChangeEvent } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  inputClassName,
  labelClassName,
  textareaClassName,
  type InventoryData,
  type InventoryField,
} from "./onboarding-types";

type InventoryStepProps = {
  data: InventoryData;
  image: File | null;
  onFieldChange: (field: InventoryField, value: string | boolean) => void;
  onImageChange: (file: File | null) => void;
};

const Toggle = ({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#6f5528] bg-[#3B2D16]/55 p-4">
    <span>
      <span className="block text-sm font-medium text-[#e5e1dc]">{label}</span>
      <span className="mt-0.5 block text-xs text-[#8f8a85]">{description}</span>
    </span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="h-4 w-4 accent-[#d0a653]"
    />
  </label>
);

const InventoryStep = ({
  data,
  image,
  onFieldChange,
  onImageChange,
}: InventoryStepProps) => (
  <div className="space-y-7">
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#d0a653]">
        <Package className="h-4 w-4" /> Cigar Details
      </h2>
      <div className="space-y-4">
        <label>
          <span className={labelClassName}>Cigar name</span>
          <input className={inputClassName} value={data.inventoryName} onChange={(e) => onFieldChange("inventoryName", e.target.value)} placeholder="Padron 1964 Natural Toro" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label><span className={labelClassName}>Brand</span><input className={inputClassName} value={data.inventoryBrand} onChange={(e) => onFieldChange("inventoryBrand", e.target.value)} placeholder="Padron" /></label>
          <label><span className={labelClassName}>Size</span><input className={inputClassName} value={data.inventorySize} onChange={(e) => onFieldChange("inventorySize", e.target.value)} placeholder="Toro" /></label>
          <label><span className={labelClassName}>Wrapper</span><input className={inputClassName} value={data.inventoryWrapper} onChange={(e) => onFieldChange("inventoryWrapper", e.target.value)} placeholder="Natural Colorado" /></label>
          <div><span className={labelClassName}>Strength</span><Select value={data.inventoryStrength} onValueChange={(value) => onFieldChange("inventoryStrength", value)}><SelectTrigger aria-label="Strength" className={`${inputClassName} shadow-none`}><SelectValue placeholder="Select strength" /></SelectTrigger><SelectContent className="border-[#6f5528] bg-[#2b2112] text-[#e5e1dc]"><SelectItem className="focus:bg-[#4b391b] focus:text-[#f1d993]" value="mild">Mild</SelectItem><SelectItem className="focus:bg-[#4b391b] focus:text-[#f1d993]" value="medium">Medium</SelectItem><SelectItem className="focus:bg-[#4b391b] focus:text-[#f1d993]" value="full">Full</SelectItem></SelectContent></Select></div>
        </div>
        <label><span className={labelClassName}>Description</span><textarea className={textareaClassName} value={data.inventoryDescription} onChange={(e) => onFieldChange("inventoryDescription", e.target.value)} placeholder="A premium handmade Nicaraguan cigar." /></label>
      </div>
    </section>

    <section>
      <h2 className="mb-3 text-sm font-semibold text-[#d0a653]">Placement & Stock</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><span className={labelClassName}>Shelf</span><Select value={data.inventoryShelfName || undefined} onValueChange={(value) => onFieldChange("inventoryShelfName", value)}><SelectTrigger aria-label="Shelf" className={`${inputClassName} shadow-none`}><SelectValue placeholder="Select a shelf" /></SelectTrigger><SelectContent className="border-[#6f5528] bg-[#2b2112] text-[#e5e1dc]">{data.shelfes.map((shelf) => <SelectItem className="focus:bg-[#4b391b] focus:text-[#f1d993]" key={shelf.name} value={shelf.name}>{shelf.name}</SelectItem>)}</SelectContent></Select></div>
        <label><span className={labelClassName}>Quantity</span><input className={inputClassName} type="number" min="0" value={data.inventoryQuantity} onChange={(e) => onFieldChange("inventoryQuantity", e.target.value)} placeholder="10" /></label>
        <label><span className={labelClassName}>Price ($)</span><input className={inputClassName} type="number" min="0" step="0.01" value={data.inventoryPrice} onChange={(e) => onFieldChange("inventoryPrice", e.target.value)} placeholder="25.99" /></label>
        <label><span className={labelClassName}>Low stock alert</span><input className={inputClassName} type="number" min="0" value={data.lowStockThreshold} onChange={(e) => onFieldChange("lowStockThreshold", e.target.value)} placeholder="5" /></label>
      </div>
    </section>

    <section>
      <span className={labelClassName}>Product image</span>
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#8b6a32] bg-[#3B2D16]/55 p-4 transition hover:border-[#D5AB48]">
        <ImagePlus className="h-6 w-6 text-[#d0a653]" />
        <span className="min-w-0"><span className="block truncate text-sm text-[#ddd8d2]">{image?.name || "Choose a cigar image"}</span><span className="text-xs text-[#8f8a85]">PNG, JPG or WEBP</span></span>
        <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event: ChangeEvent<HTMLInputElement>) => onImageChange(event.target.files?.[0] || null)} />
      </label>
    </section>

    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-[#d0a653]">Highlights</h2>
      <Toggle label="Staff Pick" description="Feature this cigar as a staff recommendation" checked={data.isStaffPick} onChange={(value) => onFieldChange("isStaffPick", value)} />
      {data.isStaffPick ? <div className="grid gap-4 sm:grid-cols-2"><label><span className={labelClassName}>Picked by</span><input className={inputClassName} value={data.staffPickBy} onChange={(e) => onFieldChange("staffPickBy", e.target.value)} placeholder="Mike" /></label><label><span className={labelClassName}>Staff note</span><input className={inputClassName} value={data.staffPickNote} onChange={(e) => onFieldChange("staffPickNote", e.target.value)} placeholder="A customer favorite" /></label></div> : null}
      <Toggle label="New Arrival" description="Mark this cigar as recently added" checked={data.isNewArrival} onChange={(value) => onFieldChange("isNewArrival", value)} />
      {data.isNewArrival ? <label><span className={labelClassName}>Arrival date</span><input className={inputClassName} type="date" value={data.arrivalDate} onChange={(e) => onFieldChange("arrivalDate", e.target.value)} /></label> : null}
      <Toggle label="Daily Featured" description="Show this cigar in today's featured selection" checked={data.isDailyFeatured} onChange={(value) => onFieldChange("isDailyFeatured", value)} />
      {data.isDailyFeatured ? <label><span className={labelClassName}>Featured note</span><input className={inputClassName} value={data.featuredNote} onChange={(e) => onFieldChange("featuredNote", e.target.value)} placeholder="Try this with our new bourbon pairing" /></label> : null}
    </section>
  </div>
);

export default InventoryStep;
