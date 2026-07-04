import { describe, it, expect } from 'vitest';
import {
  getProductsByStep,
  getSelectedVariant,
  hasSelectedVariants,
  getSelectedCount,
  getCartItems,
  getCartItemsByStep,
  getSubtotal,
  getTotal,
  getSavings,
} from '../selectors';
import { mockState, mockCameraProduct } from './fixtures';
import type { Product } from '../types/bundle.types';

describe('selectors', () => {
  describe('getProductsByStep', () => {
    it('returns only products belonging to the requested step', () => {
      const cameras = getProductsByStep(mockState, 'cameras');
      expect(cameras).toHaveLength(1);
      expect(cameras[0].id).toBe('wyze-cam-v4');
    });

    it('returns an empty array when no products match the step', () => {
      const empty = getProductsByStep({ ...mockState, products: [] }, 'cameras');
      expect(empty).toEqual([]);
    });
  });

  describe('getSelectedVariant', () => {
    it('returns the variant matching selectedVariantId', () => {
      const variant = getSelectedVariant(mockCameraProduct);
      expect(variant.id).toBe('white');
    });

    it('falls back to the first variant when selectedVariantId is not found', () => {
      const product: Product = { ...mockCameraProduct, selectedVariantId: 'missing' };
      const variant = getSelectedVariant(product);
      expect(variant.id).toBe('white');
    });
  });

  describe('hasSelectedVariants', () => {
    it('returns true when at least one variant has a positive quantity', () => {
      expect(hasSelectedVariants(mockCameraProduct)).toBe(true);
    });

    it('returns false when no variants have a positive quantity', () => {
      const product: Product = {
        ...mockCameraProduct,
        variants: [
          { id: 'white', label: 'White', price: 27.98, quantity: 0 },
          { id: 'black', label: 'Black', price: 27.98, quantity: 0 },
        ],
      };
      expect(hasSelectedVariants(product)).toBe(false);
    });
  });

  describe('getSelectedCount', () => {
    it('counts products in the step with selected variants', () => {
      expect(getSelectedCount(mockState, 'cameras')).toBe(1);
      expect(getSelectedCount(mockState, 'plan')).toBe(1);
      expect(getSelectedCount(mockState, 'sensors')).toBe(1);
      expect(getSelectedCount(mockState, 'accessories')).toBe(0);
    });
  });

  describe('getCartItems', () => {
    it('returns one item per variant with a positive quantity', () => {
      const items = getCartItems(mockState);
      expect(items).toHaveLength(3);
      expect(items.map((i) => `${i.product.id}:${i.variant.id}:${i.variant.quantity}`)).toEqual(
        expect.arrayContaining([
          'wyze-cam-v4:white:1',
          'cam-unlimited:default:1',
          'wyze-sense-motion-sensor:default:2',
        ])
      );
    });

    it('returns an empty array when nothing is selected', () => {
      const empty = getCartItems({
        ...mockState,
        products: mockState.products.map((p) => ({
          ...p,
          variants: p.variants.map((v) => ({ ...v, quantity: 0 })),
        })),
      });
      expect(empty).toEqual([]);
    });
  });

  describe('getCartItemsByStep', () => {
    it('filters cart items by step', () => {
      const cameraItems = getCartItemsByStep(mockState, 'cameras');
      expect(cameraItems).toHaveLength(1);
      expect(cameraItems[0].product.id).toBe('wyze-cam-v4');
    });
  });

  describe('pricing selectors', () => {
    it('calculates subtotal from compareAtPrice when available', () => {
      // 1 white camera at compareAtPrice 35.98 + 1 plan at compareAtPrice 12.00 + 2 sensors at 29.99
      // = 35.98 + 12.00 + 59.98 = 107.96
      expect(getSubtotal(mockState)).toBeCloseTo(107.96, 2);
    });

    it('calculates total from current price', () => {
      // 1 white camera at 27.98 + 1 plan at 9.99 + 2 sensors at 29.99
      // = 27.98 + 9.99 + 59.98 = 97.95
      expect(getTotal(mockState)).toBeCloseTo(97.95, 2);
    });

    it('calculates savings as subtotal minus total', () => {
      expect(getSavings(mockState)).toBeCloseTo(getSubtotal(mockState) - getTotal(mockState), 2);
    });

    it('returns zero for all pricing selectors when cart is empty', () => {
      const empty = {
        ...mockState,
        products: mockState.products.map((p) => ({
          ...p,
          variants: p.variants.map((v) => ({ ...v, quantity: 0 })),
        })),
      };
      expect(getSubtotal(empty)).toBe(0);
      expect(getTotal(empty)).toBe(0);
      expect(getSavings(empty)).toBe(0);
    });
  });
});
