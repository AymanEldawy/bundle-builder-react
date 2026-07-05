import { describe, it, expect, beforeEach } from 'vitest';
import { loadSavedState, saveState, STORAGE_KEY } from '../persistence';
import { mockState } from './fixtures';

describe('persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when nothing is saved', () => {
    expect(loadSavedState(mockState)).toBeNull();
  });

  it('returns null and does not throw on invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');
    expect(loadSavedState(mockState)).toBeNull();
  });

  it('returns null when saved data is missing products', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ expandedStepId: 'plan' }));
    expect(loadSavedState(mockState)).toBeNull();
  });

  it('returns null when saved products have invalid shape', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ products: [{ id: 'bad' }] }));
    expect(loadSavedState(mockState)).toBeNull();
  });

  it('restores quantities and selected variants from valid saved data', () => {
    const saved = {
      products: [
        {
          ...mockState.products[0],
          selectedVariantId: 'black',
          variants: [
            { id: 'white', label: 'White', price: 27.98, quantity: 2 },
            { id: 'black', label: 'Black', price: 27.98, quantity: 1 },
          ],
        },
      ],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    const restored = loadSavedState(mockState);
    const camera = restored?.products.find((p) => p.id === 'wyze-cam-v4');
    expect(camera?.selectedVariantId).toBe('black');
    expect(camera?.variants.find((v) => v.id === 'white')?.quantity).toBe(2);
    expect(camera?.variants.find((v) => v.id === 'black')?.quantity).toBe(1);
  });

  it('falls back to seed defaults when a saved variant no longer exists', () => {
    const saved = {
      products: [
        {
          ...mockState.products[0],
          selectedVariantId: 'green',
          variants: [
            { id: 'green', label: 'Green', price: 27.98, quantity: 5 },
            { id: 'white', label: 'White', price: 27.98, quantity: 0 },
          ],
        },
      ],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    const restored = loadSavedState(mockState);
    const camera = restored?.products.find((p) => p.id === 'wyze-cam-v4');
    expect(camera?.selectedVariantId).toBe('white');
    expect(camera?.variants.find((v) => v.id === 'white')?.quantity).toBe(0);
    expect(camera?.variants.find((v) => v.id === 'black')?.quantity).toBe(0);
    expect(camera?.variants.some((v) => v.id === 'green')).toBe(false);
  });

  it('does not persist expandedStepId', () => {
    saveState({ ...mockState, expandedStepId: 'accessories' });

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.expandedStepId).toBeUndefined();
    expect(parsed.products).toEqual(mockState.products);
  });
});
