'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase-browser';
import { Pet, PetCategory } from '@/types/database';
import { usePetStore } from '@/store/pet-store';

// Keys for React Query cache
const QUERY_KEYS = {
  pets: 'pets',
  petDetails: 'petDetails',
  petCategories: 'petCategories',
};

// Fetch all pets with optional filtering
export function usePets(limit: number = 50) {
  const filters = usePetStore(state => state.filters);
  
  return useQuery({
    queryKey: [QUERY_KEYS.pets, filters, limit],
    queryFn: async () => {
      try {
        const supabase = createClient();
        
        let query = supabase
          .from('pets')
          .select('*')
          .eq('status', 'Available')
          .order('created_at', { ascending: false });
        
        // Apply filters
        if (filters.category) {
          if (filters.category === -1) {
            // Special case for "other" categories
            // First, fetch all categories
            const { data: categories } = await supabase
              .from('pet_categories')
              .select('id, name');
              
            if (categories) {
              const dogCatIds = categories
                .filter(cat => 
                  cat.name.toLowerCase().includes('perro') || 
                  cat.name.toLowerCase().includes('gato')
                )
                .map(cat => cat.id);
                
              if (dogCatIds.length > 0) {
                query = query.not('category_id', 'in', `(${dogCatIds.join(',')})`);
              }
            }
          } else {
            // Normal category filter
            query = query.eq('category_id', filters.category);
          }
        }
        
        if (filters.gender) {
          query = query.eq('gender', filters.gender);
        }
        
        if (filters.size) {
          query = query.eq('size', filters.size);
        }
        
        if (filters.goodWithChildren) {
          query = query.eq('is_good_with_children', true);
        }
        
        if (filters.goodWithPets) {
          query = query.eq('is_good_with_other_pets', true);
        }
        
        // Apply limit
        query = query.limit(limit);
        
        const { data, error } = await query;
        
        if (error) {
          throw new Error(error.message);
        }
        
        return data as Pet[];
      } catch (error) {
        console.error('Error fetching pets:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch a single pet by ID
export function usePetDetails(petId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEYS.petDetails, petId],
    queryFn: async () => {
      if (!petId) return null;
      
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('id', petId)
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        return data as Pet;
      } catch (error) {
        console.error('Error fetching pet details:', error);
        throw error;
      }
    },
    enabled: !!petId,
  });
}

// Fetch pet categories
export function usePetCategories() {
  return useQuery({
    queryKey: [QUERY_KEYS.petCategories],
    queryFn: async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('pet_categories')
          .select('*')
          .order('name');
        
        if (error) {
          throw new Error(error.message);
        }
        
        return data as PetCategory[];
      } catch (error) {
        console.error('Error fetching pet categories:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
} 