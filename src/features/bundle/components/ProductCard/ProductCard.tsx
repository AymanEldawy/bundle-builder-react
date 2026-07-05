import { useBundle } from "../../hooks/useBundle";
import { getSelectedVariant, hasSelectedVariants } from "../../state/selectors";
import type { Product } from "../../types/bundle.types";
import { Badge } from "../Badge/Badge";
import { Price } from "../Price/Price";
import { QuantityStepper } from "../QuantityStepper/QuantityStepper";
import { VariantSelector } from "../VariantSelector/VariantSelector";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useBundle();
  const activeVariant = getSelectedVariant(product);
  const isSelected = hasSelectedVariants(product);
  const period = product.stepId === "plan" ? "mo" : undefined;
  const productImage = activeVariant.image ?? product.image;

  const handleSelectVariant = (variantId: string) => {
    dispatch({
      type: "SET_VARIANT",
      payload: { productId: product.id, variantId },
    });
  };

  const handleQuantityChange = (quantity: number) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId: product.id, variantId: activeVariant.id, quantity },
    });
  };

  return (
    <article
      className={`product-card ${isSelected ? "product-card-selected" : ""}`}
    >
      {product.badge && <Badge text={product.badge} />}
      <img
        className="product-image"
        src={productImage}
        alt={product.title}
        loading="lazy"
      />
      <h3 className="product-title">{product.title}</h3>
      <p className="product-description">
        {product.description}{" "}
        <a
          className="product-learn-more"
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          Learn More
        </a>
      </p>
      <VariantSelector
        variants={product.variants}
        selectedVariantId={product.selectedVariantId}
        onSelect={handleSelectVariant}
      />
      <div className="product-footer">
        <QuantityStepper
          quantity={activeVariant.quantity}
          onChange={handleQuantityChange}
        />
        <Price
          price={activeVariant.price}
          compareAtPrice={activeVariant.compareAtPrice}
          period={period}
        />
      </div>
    </article>
  );
}
