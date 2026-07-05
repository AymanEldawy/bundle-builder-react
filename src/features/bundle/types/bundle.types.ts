export type StepId = "cameras" | "plan" | "sensors" | "accessories";

export interface StepConfig {
  shortTitle: string;
  id: StepId;
  title: string;
  icon: string;
  order: number;
}

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  swatch?: string;
  image?: string;
  srcSet?: string;
  sizes?: string;
}

export interface Product {
  id: string;
  stepId: StepId;
  title: string;
  description?: string;
  image: string;
  srcSet?: string;
  sizes?: string;
  badge?: string;
  selectedVariantId: string;
  variants: ProductVariant[];
}

export interface BundleState {
  products: Product[];
  expandedStepId: StepId;
}

export type BundleAction =
  | { type: "SET_VARIANT"; payload: { productId: string; variantId: string } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; variantId: string; quantity: number };
    }
  | { type: "NEXT_STEP" }
  | { type: "TOGGLE_STEP"; payload: { stepId: StepId } }
  | { type: "SAVE" }
  | { type: "RESTORE"; payload: BundleState };

export interface CartItem {
  product: Product;
  variant: ProductVariant;
}
