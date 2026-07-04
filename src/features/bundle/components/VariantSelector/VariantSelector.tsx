import type { ProductVariant } from "../../types/bundle.types";
import "./VariantSelector.css";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string;
  onSelect: (variantId: string) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  if (variants.length === 1 && variants[0].id === "default") {
    return null;
  }

  return (
    <div
      className="variant-selector"
      role="group"
      aria-label="Choose a variant"
    >
      {variants.map((variant) => (
        <button
          key={variant.id}
          type="button"
          className={`variant-chip ${variant.id === selectedVariantId ? "variant-chip-active" : ""}`}
          aria-pressed={variant.id === selectedVariantId}
          onClick={() => onSelect(variant.id)}
        >
          {variant.image && (
            <img
              className="variant-swatch"
              src={variant.image}
              alt=""
              width={20}
              height={20}
            />
          )}
          <span className="variant-label">{variant.label}</span>
        </button>
      ))}
    </div>
  );
}
