import bundleData from '../../../data/bundle.json';
import type { BundleState, StepConfig, Product } from '../types/bundle.types';

const typedSteps = (bundleData.steps as StepConfig[]).slice().sort((a, b) => a.order - b.order);
const typedProducts = bundleData.products as Product[];

export const steps = typedSteps;
export const seedProducts = typedProducts;

export const seedState: BundleState = {
  products: typedProducts,
  expandedStepId: typedSteps[0]?.id ?? 'cameras',
};
