import { describe, it, expect, vi } from 'vitest';
import { bundleReducer } from '../bundleReducer';
import { mockState } from './fixtures';
import * as initialStateModule from '../initialState';

vi.mock('../initialState', () => ({
  steps: [
    { id: 'cameras', title: 'Choose your cameras', icon: 'camera', order: 1 },
    { id: 'plan', title: 'Choose your plan', icon: 'shield', order: 2 },
    { id: 'sensors', title: 'Choose your sensors', icon: 'sensor', order: 3 },
    { id: 'accessories', title: 'Add extra protection', icon: 'shield-plus', order: 4 },
  ],
}));

const steps = initialStateModule.steps;

describe('bundleReducer', () => {
  it('returns the same state for SAVE', () => {
    const nextState = bundleReducer(mockState, { type: 'SAVE' });
    expect(nextState).toBe(mockState);
  });

  it('returns the same state for unknown actions', () => {
    // @ts-expect-error testing unknown action
    const nextState = bundleReducer(mockState, { type: 'UNKNOWN' });
    expect(nextState).toBe(mockState);
  });

  describe('SET_VARIANT', () => {
    it('updates the selected variant for the target product', () => {
      const nextState = bundleReducer(mockState, {
        type: 'SET_VARIANT',
        payload: { productId: 'wyze-cam-v4', variantId: 'black' },
      });

      const camera = nextState.products.find((p) => p.id === 'wyze-cam-v4');
      expect(camera?.selectedVariantId).toBe('black');
    });

    it('leaves other products unchanged', () => {
      const nextState = bundleReducer(mockState, {
        type: 'SET_VARIANT',
        payload: { productId: 'wyze-cam-v4', variantId: 'black' },
      });

      const plan = nextState.products.find((p) => p.id === 'cam-unlimited');
      expect(plan?.selectedVariantId).toBe('default');
    });

    it('preserves quantities of previously selected variants', () => {
      const stateWithWhiteSelected = bundleReducer(mockState, {
        type: 'UPDATE_QUANTITY',
        payload: { productId: 'wyze-cam-v4', variantId: 'white', quantity: 2 },
      });

      const stateAfterSwitchingToBlack = bundleReducer(stateWithWhiteSelected, {
        type: 'SET_VARIANT',
        payload: { productId: 'wyze-cam-v4', variantId: 'black' },
      });

      const camera = stateAfterSwitchingToBlack.products.find((p) => p.id === 'wyze-cam-v4');
      expect(camera?.selectedVariantId).toBe('black');
      expect(camera?.variants.find((v) => v.id === 'white')?.quantity).toBe(2);
      expect(camera?.variants.find((v) => v.id === 'black')?.quantity).toBe(0);
    });
  });

  describe('UPDATE_QUANTITY', () => {
    it('updates the quantity for the target variant', () => {
      const nextState = bundleReducer(mockState, {
        type: 'UPDATE_QUANTITY',
        payload: { productId: 'wyze-cam-v4', variantId: 'white', quantity: 3 },
      });

      const variant = nextState.products
        .find((p) => p.id === 'wyze-cam-v4')
        ?.variants.find((v) => v.id === 'white');
      expect(variant?.quantity).toBe(3);
    });

    it('clamps negative quantities to zero', () => {
      const nextState = bundleReducer(mockState, {
        type: 'UPDATE_QUANTITY',
        payload: { productId: 'wyze-cam-v4', variantId: 'white', quantity: -5 },
      });

      const variant = nextState.products
        .find((p) => p.id === 'wyze-cam-v4')
        ?.variants.find((v) => v.id === 'white');
      expect(variant?.quantity).toBe(0);
    });

    it('leaves other variants unchanged', () => {
      const nextState = bundleReducer(mockState, {
        type: 'UPDATE_QUANTITY',
        payload: { productId: 'wyze-cam-v4', variantId: 'white', quantity: 3 },
      });

      const blackVariant = nextState.products
        .find((p) => p.id === 'wyze-cam-v4')
        ?.variants.find((v) => v.id === 'black');
      expect(blackVariant?.quantity).toBe(0);
    });
  });

  describe('NEXT_STEP', () => {
    it('advances to the next step', () => {
      const nextState = bundleReducer(mockState, { type: 'NEXT_STEP' });
      expect(nextState.expandedStepId).toBe('plan');
    });

    it('stays on the current step when already on the last step', () => {
      const lastStepState = { ...mockState, expandedStepId: steps[steps.length - 1].id };
      const nextState = bundleReducer(lastStepState, { type: 'NEXT_STEP' });
      expect(nextState.expandedStepId).toBe(lastStepState.expandedStepId);
    });
  });

  describe('TOGGLE_STEP', () => {
    it('sets the expanded step to the requested id', () => {
      const nextState = bundleReducer(mockState, {
        type: 'TOGGLE_STEP',
        payload: { stepId: 'sensors' },
      });
      expect(nextState.expandedStepId).toBe('sensors');
    });
  });

  describe('RESTORE', () => {
    it('replaces state with the payload', () => {
      const restoredState = { ...mockState, expandedStepId: 'accessories' };
      const nextState = bundleReducer(mockState, {
        type: 'RESTORE',
        payload: restoredState,
      });
      expect(nextState).toBe(restoredState);
    });
  });
});
