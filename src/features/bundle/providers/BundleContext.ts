import { createContext } from 'react';
import type { BundleAction, BundleState } from '../types/bundle.types';

export interface BundleContextValue {
  state: BundleState;
  dispatch: (action: BundleAction) => boolean | void;
}

export const BundleContext = createContext<BundleContextValue | null>(null);
