'use client';

import { useEffect, useState } from 'react';
import { usePetStore } from '@/store/pet-store';

// This component ensures that any Zustand store with skipHydration
// is properly hydrated after the component mounts on the client
export function StoreHydration() {
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    // This runs only on the client
    const unsubHydrate = usePetStore.persist.onHydrate(() => {
      // Do something when the store hydrates
      console.log('Pet store hydrated');
    });
    
    // Hydrate the store
    usePetStore.persist.rehydrate();
    
    // Mark as hydrated
    setIsHydrated(true);
    
    return () => {
      unsubHydrate();
    };
  }, []);
  
  return null; // This component doesn't render anything
} 