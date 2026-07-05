import { useCallback, useReducer, type ReactNode } from 'react';
import type { BundleAction } from '../types/bundle.types';
import { bundleReducer } from '../state/bundleReducer';
import { seedState } from '../state/initialState';
import { BundleContext } from './BundleContext';
import { loadSavedState, saveState } from '../state/persistence';

interface BundleProviderProps {
  children: ReactNode;
}

export function BundleProvider({ children }: BundleProviderProps) {
  const [state, dispatch] = useReducer(bundleReducer, seedState, (initial) => {
    if (typeof window === 'undefined') return initial;
    return loadSavedState(initial) ?? initial;
  });

  const wrappedDispatch = useCallback(
    (action: BundleAction): boolean | void => {
      if (action.type === 'SAVE') {
        return saveState(state);
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
