import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pet } from '@/types/database';

interface PetFilters {
  category?: number;
  gender?: 'Male' | 'Female';
  size?: 'Small' | 'Medium' | 'Large' | 'Extra Large';
  age?: string;
  goodWithChildren?: boolean;
  goodWithPets?: boolean;
}

interface PetStore {
  // State
  filters: PetFilters;
  favorites: string[];
  
  // Actions
  setFilter: (key: keyof PetFilters, value: any) => void;
  resetFilters: () => void;
  addFavorite: (petId: string) => void;
  removeFavorite: (petId: string) => void;
  toggleFavorite: (petId: string) => void;
  hasFavorite: (petId: string) => boolean;
}

// Check if window exists to avoid SSR issues
const isBrowser = typeof window !== 'undefined';

export const usePetStore = create<PetStore>()(
  persist(
    (set, get) => ({
      // Initial state
      filters: {},
      favorites: [],
      
      // Actions
      setFilter: (key, value) => set(state => ({
        filters: { ...state.filters, [key]: value }
      })),
      
      resetFilters: () => set({ filters: {} }),
      
      addFavorite: (petId) => set(state => {
        const newFavorites = [...state.favorites, petId];
        return { favorites: newFavorites };
      }),
      
      removeFavorite: (petId) => set(state => {
        const newFavorites = state.favorites.filter(id => id !== petId);
        return { favorites: newFavorites };
      }),
      
      toggleFavorite: (petId) => {
        const hasFavorite = get().hasFavorite(petId);
        if (hasFavorite) {
          get().removeFavorite(petId);
        } else {
          get().addFavorite(petId);
        }
      },
      
      hasFavorite: (petId) => get().favorites.includes(petId)
    }),
    {
      name: 'pet-store', // name for the persisted state
      skipHydration: true, // Skip automatic hydration
    }
  )
); 