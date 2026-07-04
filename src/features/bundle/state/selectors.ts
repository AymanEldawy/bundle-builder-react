import type { BundleState, Product, ProductVariant, StepId, CartItem } from '../types/bundle.types';

export function getProductsByStep(state: BundleState, stepId: StepId): Product[] {
  return state.products.filter((product) => product.stepId === stepId);
}

export function getSelectedVariant(product: Product): ProductVariant {
  return (
    product.variants.find((variant) => variant.id === product.selectedVariantId) ?? product.variants[0]
  );
}

export function hasSelectedVariants(product: Product): boolean {
  return product.variants.some((variant) => variant.quantity > 0);
}

export function getSelectedCount(state: BundleState, stepId: StepId): number {
  return state.products.filter((product) => product.stepId === stepId && hasSelectedVariants(product))
    .length;
}

export function getCartItems(state: BundleState): CartItem[] {
  const items: CartItem[] = [];
  for (const product of state.products) {
    for (const variant of product.variants) {
      if (variant.quantity > 0) {
        items.push({ product, variant });
      }
    }
  }
  return items;
}

export function getCartItemsByStep(state: BundleState, stepId: StepId): CartItem[] {
  return getCartItems(state).filter((item) => item.product.stepId === stepId);
}

export function getSubtotal(state: BundleState): number {
  return getCartItems(state).reduce((sum, item) => {
    const base = item.variant.compareAtPrice ?? item.variant.price;
    return sum + base * item.variant.quantity;
  }, 0);
}

export function getTotal(state: BundleState): number {
  return getCartItems(state).reduce((sum, item) => sum + item.variant.price * item.variant.quantity, 0);
}

export function getSavings(state: BundleState): number {
  return getSubtotal(state) - getTotal(state);
}
