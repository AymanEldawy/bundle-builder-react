import type { BundleState, Product, ProductVariant, StepId } from '../types/bundle.types';

export const STORAGE_KEY = 'bundle-builder-config-v1';

const VALID_STEP_IDS: StepId[] = ['cameras', 'plan', 'sensors', 'accessories'];

function isStepId(value: unknown): value is StepId {
  return typeof value === 'string' && VALID_STEP_IDS.includes(value as StepId);
}

function isValidVariant(value: unknown): value is ProductVariant {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    v.id.length > 0 &&
    typeof v.label === 'string' &&
    typeof v.price === 'number' &&
    Number.isFinite(v.price) &&
    typeof v.quantity === 'number' &&
    Number.isInteger(v.quantity) &&
    v.quantity >= 0
  );
}

function isValidProduct(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Record<string, unknown>;
  if (
    typeof p.id !== 'string' ||
    !isStepId(p.stepId) ||
    typeof p.title !== 'string' ||
    typeof p.image !== 'string' ||
    typeof p.selectedVariantId !== 'string' ||
    !Array.isArray(p.variants) ||
    p.variants.length === 0
  ) {
    return false;
  }
  return p.variants.every(isValidVariant);
}

interface PersistedData {
  products: Product[];
}

function isPersistedData(value: unknown): value is PersistedData {
  if (typeof value !== 'object' || value === null) return false;
  const data = value as Record<string, unknown>;
  return Array.isArray(data.products) && data.products.every(isValidProduct);
}

function mergeSavedProducts(seedProducts: Product[], savedProducts: Product[]): Product[] {
  const savedById = new Map(savedProducts.map((p) => [p.id, p]));

  return seedProducts.map((product) => {
    const saved = savedById.get(product.id);
    if (!saved) return product;

    const savedVariantsById = new Map(saved.variants.map((v) => [v.id, v]));
    let mergedSelectedVariantId = product.selectedVariantId;

    const mergedVariants = product.variants.map((variant) => {
      const savedVariant = savedVariantsById.get(variant.id);
      if (savedVariant) {
        if (variant.id === saved.selectedVariantId) {
          mergedSelectedVariantId = variant.id;
        }
        return { ...variant, quantity: savedVariant.quantity };
      }
      return variant;
    });

    // Fall back to the seed default if the saved selected variant no longer exists.
    const validSelectedId = mergedVariants.some((v) => v.id === mergedSelectedVariantId)
      ? mergedSelectedVariantId
      : product.selectedVariantId;

    return {
      ...product,
      selectedVariantId: validSelectedId,
      variants: mergedVariants,
    };
  });
}

export function loadSavedState(seedState: BundleState): BundleState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (!isPersistedData(parsed)) return null;

    return {
      ...seedState,
      products: mergeSavedProducts(seedState.products, parsed.products),
    };
  } catch {
    return null;
  }
}

export function saveState(state: BundleState): boolean {
  try {
    const persisted: PersistedData = { products: state.products };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    return true;
  } catch {
    // Ignore storage errors (e.g. private mode).
    return false;
  }
}
