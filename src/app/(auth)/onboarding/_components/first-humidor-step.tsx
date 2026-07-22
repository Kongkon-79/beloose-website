import { Plus, Trash2 } from "lucide-react";
import type { ChangeEvent } from "react";
import {
  inputClassName,
  labelClassName,
  textareaClassName,
  type OnboardingStepProps,
} from "./onboarding-types";

type FirstHumidorStepProps = OnboardingStepProps & {
  onShelfChange: (
    index: number,
    field: "name" | "description",
    value: string,
  ) => void;
  onAddShelf: () => void;
  onRemoveShelf: (index: number) => void;
};

const FirstHumidorStep = ({
  data,
  onChange,
  onShelfChange,
  onAddShelf,
  onRemoveShelf,
}: FirstHumidorStepProps) => (
  <div className="space-y-5">
    <label>
      <span className={labelClassName}>Humidor name</span>
      <input
        className={inputClassName}
        name="humidorName"
        value={data.humidorName}
        onChange={onChange}
        placeholder="Main Humidor"
      />
    </label>

    <label>
      <span className={labelClassName}>Location</span>
      <input
        className={inputClassName}
        name="humidorLocation"
        value={data.humidorLocation}
        onChange={onChange}
        placeholder="Front of Store"
      />
    </label>

    <label>
      <span className={labelClassName}>Description</span>
      <textarea
        className={textareaClassName}
        name="humidorDescription"
        value={data.humidorDescription}
        onChange={onChange}
        placeholder="Temperature Controlled Humidor"
      />
    </label>

    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-[#e5e1dc]">Shelves</h2>
          <p className="mt-0.5 text-xs text-[#8f8a85]">
            Add the shelves available inside this humidor.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddShelf}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-[#d0a653]/60 px-3 text-xs font-medium text-[#d0a653] transition hover:bg-[#d0a653]/10"
        >
          <Plus className="h-4 w-4" /> Add Shelf
        </button>
      </div>

      <div className="space-y-3">
        {data.shelfes.map((shelf, index) => (
          <div
            key={index}
            className="relative rounded-xl border border-[#6f5528] bg-[#3B2D16]/55 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#d0a653]">
                Shelf {index + 1}
              </span>
              {data.shelfes.length > 1 ? (
                <button
                  type="button"
                  onClick={() => onRemoveShelf(index)}
                  aria-label={`Remove shelf ${index + 1}`}
                  className="text-[#8f8a85] transition hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                className={inputClassName}
                value={shelf.name}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onShelfChange(index, "name", event.target.value)
                }
                placeholder="Top Shelf"
                aria-label={`Shelf ${index + 1} name`}
              />
              <input
                className={inputClassName}
                value={shelf.description}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  onShelfChange(index, "description", event.target.value)
                }
                placeholder="Premium Cigars"
                aria-label={`Shelf ${index + 1} description`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FirstHumidorStep;
