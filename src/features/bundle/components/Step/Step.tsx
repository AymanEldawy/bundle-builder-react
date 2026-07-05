import { useBundle } from "../../hooks/useBundle";
import type { Product, StepConfig } from "../../types/bundle.types";
import { ProductCard } from "../ProductCard/ProductCard";
import { StepIcon } from "../StepIcon/StepIcon";
import "./Step.css";

interface StepProps {
  step: StepConfig;
  index: number;
  totalSteps: number;
  isExpanded: boolean;
  selectedCount: number;
  products: Product[];
  nextStepTitle?: string;
}

export function Step({
  step,
  index,
  totalSteps,
  isExpanded,
  selectedCount,
  products,
  nextStepTitle,
}: StepProps) {
  const { dispatch } = useBundle();

  return (
    <div className={`step ${isExpanded ? "step-expanded" : ""}`}>
      <div className="step-label-container">
        <span className="step-label">
          STEP {index + 1} OF {totalSteps}
        </span>
      </div>
      <button
        type="button"
        className="step-header"
        onClick={() =>
          dispatch({ type: "TOGGLE_STEP", payload: { stepId: step.id } })
        }
        aria-expanded={isExpanded}
      >
        <div className="step-title-row">
          <StepIcon name={step.icon} className="step-icon" />
          <h2 className="step-title">{step.title}</h2>
        </div>
        <div className="step-status">
          <span className="step-count">{selectedCount} selected</span>
          <span className="step-chevron" aria-hidden="true">
            ▼
          </span>
        </div>
      </button>

      <div className="step-content-wrapper">
        <div className="step-content">
          <div className="product-grid">
            {products.map((product, productIndex) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={isExpanded && productIndex === 0}
              />
            ))}
          </div>
          {nextStepTitle && (
            <button
              type="button"
              className="step-next-button"
              onClick={() => dispatch({ type: "NEXT_STEP" })}
            >
              Next: {nextStepTitle}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
