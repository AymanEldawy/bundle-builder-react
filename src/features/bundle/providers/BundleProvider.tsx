import { useCallback, useReducer, type ReactNode } from 'react';
import type { BundleAction, BundleState } from '../types/bundle.types';
import { bundleReducer } from '../state/bundleReducer';
import { seedState } from '../state/initialState';
import { BundleContext } from './BundleContext';

const STORAGE_KEY = 'bundle-builder-config-v1';

function loadSavedState(): BundleState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as BundleState;
  } catch {
    return null;
  }
}

function saveState(state: BundleState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors (e.g. private mode).
  }
}

interface BundleProviderProps {
  children: ReactNode;
}

export function BundleProvider({ children }: BundleProviderProps) {
  const [state, dispatch] = useReducer(bundleReducer, seedState, (initial) => {
    if (typeof window === 'undefined') return initial;
    return loadSavedState() ?? initial;
  });

  const wrappedDispatch = useCallback(
    (action: BundleAction) => {
      if (action.type === 'SAVE') {
        saveState(state);
        return;
      }
      dispatch(action);
    },
    [state]
  );

  return (
    <BundleContext.Provider value={{ state, dispatch: wrappedDispatch }}>
      {children}
    </BundleContext.Provider>
  );
}
