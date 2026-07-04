import "./QuantityStepper.css";

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
}

export function QuantityStepper({ quantity, onChange }: QuantityStepperProps) {
  return (
    <div className="quantity-stepper">
      <button
        type="button"
        className="stepper-button"
        aria-label="Decrease quantity"
        disabled={quantity <= 0}
        onClick={() => onChange(quantity - 1)}
      >
        −
      </button>
      <span className="stepper-value" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className="stepper-button"
        aria-label="Increase quantity"
        onClick={() => onChange(quantity + 1)}
      >
        +
      </button>
    </div>
  );
}
