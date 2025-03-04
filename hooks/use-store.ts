'use client';

import { useState, useEffect } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';

/**
 * Helper hook to safely use Zustand stores in Next.js components,
 * preventing hydration mismatch errors.
 * 
 * @example
 * // Instead of:
 * const value = useSomeStore(selector)
 * 
 * // Use:
 * const value = useStore(useSomeStore, selector)
 */
export function useStore<T, F>(
  store: UseBoundStore<StoreApi<T>>,
  selector: (state: T) => F
): F | undefined {
  const [state, setState] = useState<F>();
  
  // Connect to the store on mount
  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      setState(selector(state as T));
    });
    
    // Initial state
    setState(selector(store.getState() as T));
    
    return unsubscribe;
  }, [store, selector]);
  
  return state;
} 