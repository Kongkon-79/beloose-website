import {
  inputClassName,
  labelClassName,
  textareaClassName,
  type BusinessInformationData,
  type BusinessInformationField,
} from "./onboarding-types";

type BusinessInformationStepProps = {
  data: BusinessInformationData;
  onFieldChange: (field: BusinessInformationField, value: string) => void;
};

const BusinessInformationStep = ({
  data,
  onFieldChange,
}: BusinessInformationStepProps) => (
  <div className="space-y-4">
    <label>
      <span className={labelClassName}>Store name</span>
      <input className={inputClassName} name="storeName" value={data.storeName} onChange={(event) => onFieldChange("storeName", event.target.value)} placeholder="AB Super Shop" />
    </label>
    <label>
      <span className={labelClassName}>Address</span>
      <input className={inputClassName} name="address" value={data.address} onChange={(event) => onFieldChange("address", event.target.value)} placeholder="Mirpur 10, Dhaka" />
    </label>
    <div className="grid gap-4 sm:grid-cols-2">
      <label>
        <span className={labelClassName}>City</span>
        <input className={inputClassName} name="city" value={data.city} onChange={(event) => onFieldChange("city", event.target.value)} placeholder="Dhaka" />
      </label>
      <label>
        <span className={labelClassName}>Phone number</span>
        <input
          className={inputClassName}
          name="phoneNumber"
          value={data.phoneNumber}
          onChange={(event) =>
            onFieldChange("phoneNumber", event.target.value)
          }
          placeholder="01712345678 or +8801712345678"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
        />
        <span className="mt-1 block text-[11px] text-[#B7A887]">
          Use a valid Bangladesh mobile number.
        </span>
      </label>
    </div>
    <label>
      <span className={labelClassName}>Description</span>
      <textarea className={textareaClassName} name="description" value={data.description} onChange={(event) => onFieldChange("description", event.target.value)} placeholder="Tell customers about your store" />
    </label>
  </div>
);

export default BusinessInformationStep;
