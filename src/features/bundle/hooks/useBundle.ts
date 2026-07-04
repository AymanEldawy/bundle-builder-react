import { useContext } from 'react';
import { BundleContext } from '../providers/BundleContext';

export function useBundle() {
  const context = useContext(BundleContext);
  if (!context) {
    throw new Error('useBundle must be used within a BundleProvider');
  }
  return context;
}
