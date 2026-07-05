import type { BundleState, BundleAction } from '../types/bundle.types';
import { steps } from './initialState';

export function bundleReducer(state: BundleState, action: BundleAction): BundleState {
  switch (action.type) {
    case 'SET_VARIANT': {
      const { productId, variantId } = action.payload;
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === productId
            ? { ...product, selectedVariantId: variantId }
            : product
        ),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, variantId, quantity } = action.payload;
      const clamped = Math.max(0, quantity);
      return {
        ...state,
        products: state.products.map((product) => {
          if (product.id !== productId) return product;
          return {
            ...product,
            variants: product.variants.map((variant) =>
              variant.id === variantId ? { ...variant, quantity: clamped } : variant
            ),
          };
        }),
      };
    }

    case 'NEXT_STEP': {
      const currentIndex = steps.findIndex((step) => step.id === state.expandedStepId);
      const nextStep = steps[currentIndex + 1];
      if (!nextStep) return state;
      return { ...state, expandedStepId: nextStep.id };
    }

    case 'TOGGLE_STEP': {
      return { ...state, expandedStepId: action.payload.stepId };
    }

    case 'RESTORE': {
      return action.payload;
    }

    case 'SAVE':
    default:
      return state;
  }
}
