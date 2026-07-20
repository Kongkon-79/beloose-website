import { inputClassName, labelClassName, type OnboardingStepProps } from "./onboarding-types";

const QrCodeStep = ({ data, onChange }: OnboardingStepProps) => (
  <div className="space-y-4">
    <label>
      <span className={labelClassName}>QR code style</span>
      <select className={inputClassName} name="qrStyle" value={data.qrStyle} onChange={onChange}>
        <option>Classic Gold</option>
        <option>Minimal Black</option>
        <option>Light Label</option>
      </select>
    </label>
    <label>
      <span className={labelClassName}>QR placement</span>
      <select className={inputClassName} name="qrPlacement" value={data.qrPlacement} onChange={onChange}>
        <option>At each shelf</option>
        <option>On each product</option>
        <option>At humidor entrance</option>
      </select>
    </label>
  </div>
);

export default QrCodeStep;
