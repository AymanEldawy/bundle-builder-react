import { useMemo } from "react";
import { useBundle } from "../../hooks/useBundle";
import { steps } from "../../state/initialState";
import {
  getCartItemsByStep,
  getSavings,
  getSubtotal,
  getTotal,
} from "../../state/selectors";
import type { CartItem, StepId } from "../../types/bundle.types";
import { Price } from "../Price/Price";
import { QuantityStepper } from "../QuantityStepper/QuantityStepper";
import "./ReviewPanel.css";

const REVIEW_ORDER: StepId[] = ["cameras", "sensors", "accessories", "plan"];

function ReviewLineItem({
  item,
  editable,
}: {
  item: CartItem;
  editable: boolean;
}) {
  const { dispatch } = useBundle();
  const { product, variant } = item;
  const totalPrice = variant.price * variant.quantity;
  const totalCompare =
    variant.compareAtPrice !== undefined
      ? variant.compareAtPrice * variant.quantity
      : undefined;
  const period = product.stepId === "plan" ? "mo" : undefined;

  return (
    <div className="review-line">
      <img
        className="review-line-thumb"
        src={variant.image ?? product.image}
        alt=""
        width={40}
        height={40}
      />
      <div className="review-line-info">
        <span className="review-line-name">{product.title}</span>
      </div>
      {editable ? (
        <QuantityStepper
          quantity={variant.quantity}
          onChange={(quantity) =>
            dispatch({
              type: "UPDATE_QUANTITY",
              payload: {
                productId: product.id,
                variantId: variant.id,
                quantity,
              },
            })
          }
        />
      ) : (
        <span className="review-line-qty">× {variant.quantity}</span>
      )}
      <div className="review-line-price">
        <Price
          price={totalPrice}
          compareAtPrice={totalCompare}
          period={period}
        />
      </div>
    </div>
  );
}

export function ReviewPanel() {
  const { state, dispatch } = useBundle();
  const subtotal = useMemo(() => getSubtotal(state), [state]);
  const total = useMemo(() => getTotal(state), [state]);
  const savings = useMemo(() => getSavings(state), [state]);
  const financing = useMemo(() => Math.max(1, Math.round(total / 12)), [total]);

  const stepTitleMap = useMemo(() => {
    return Object.fromEntries(steps.map((s) => [s.id, s.shortTitle])) as Record<
      StepId,
      string
    >;
  }, []);

  return (
    <aside className="review-panel" aria-label="Your security system">
      <div className="review-left">
        <div className="review-header">
          <span className="review-label">REVIEW</span>
          <h2 className="review-title">Your security system</h2>
          <p className="review-subtitle">
            Review your personalized protection system designed to keep what
            matters most safe.
          </p>
        </div>

        <div className="review-body">
          {REVIEW_ORDER.map((stepId) => {
            const items = getCartItemsByStep(state, stepId);
            if (items.length === 0) return null;
            return (
              <div key={stepId} className="review-group">
                <h3 className="review-group-title">{stepTitleMap[stepId]}</h3>
                {items.map((item, index) => (
                  <ReviewLineItem
                    key={`${item.product.id}-${item.variant.id}-${index}`}
                    item={item}
                    editable={stepId !== "plan"}
                  />
                ))}
              </div>
            );
          })}

          <div className="review-group">
            <h3 className="review-group-title">Shipping</h3>
            <div className="review-line">
              <img
                className="review-line-thumb shipping-thumb"
                src="/assets/figma/carbon_delivery.svg"
                alt=""
                width={40}
                height={40}
                aria-hidden="true"
              />
              <div className="review-line-info">
                <span className="review-line-name">Fast Shipping</span>
              </div>
              <span className="review-line-qty" />
              <div className="review-line-price">
                <Price price={0} compareAtPrice={6.99} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="review-right">
        <div className="review-footer-top">
          <img
            className="guarantee-badge-bottom"
            src="/assets/figma/Satisfaction Badge-05 1.svg"
            alt="100% Wyze satisfaction guarantee"
            width={84}
            height={84}
          />
          <div className="review-totals-right">
            <div className="review-financing">
              <span className="financing-pill">as low as ${financing}/mo</span>
            </div>
            <div className="review-total-price">
              <Price price={total} compareAtPrice={subtotal} />
            </div>
          </div>
        </div>

        <div className="review-footer-bottom">
          {savings > 0 && (
            <p className="savings-callout">
              Congrats! You&apos;re saving ${savings.toFixed(2)} on your
              security bundle!
            </p>
          )}
        </div>

        <button
          type="button"
          className="checkout-button"
          onClick={() => alert("Checkout is a placeholder in this prototype.")}
        >
          Checkout
        </button>

        <button
          type="button"
          className="save-link"
          onClick={() => dispatch({ type: "SAVE" })}
        >
          Save my system for later
        </button>
      </div>
    </aside>
  );
}
