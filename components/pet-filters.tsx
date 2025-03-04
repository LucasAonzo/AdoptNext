'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type FilterOption = {
  key: string;
  value: string;
  label: string;
};

interface PetFiltersProps {
  activeFilters?: FilterOption[];
  onFilterChange?: (filters: FilterOption[]) => void;
}

export default function PetFilters({ activeFilters = [], onFilterChange }: PetFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterOption[]>(activeFilters);
  
  // Initialize filters from URL params on component mount
  useEffect(() => {
    const urlFilters: FilterOption[] = [];
    
    // Parse search params into filter objects
    searchParams.forEach((value, key) => {
      if (key.startsWith('filter_')) {
        const filterKey = key.replace('filter_', '');
        // Handle multiple values for the same filter type (comma-separated)
        const values = value.split(',');
        
        values.forEach(val => {
          let label = val;
          
          // Map keys to user-friendly labels
          if (filterKey === 'gender') {
            label = val === 'Male' ? 'Macho' : 'Hembra';
          } else if (filterKey === 'size') {
            label = val === 'Small' ? 'Pequeño' : 
                   val === 'Medium' ? 'Mediano' : 
                   val === 'Large' ? 'Grande' : 
                   val === 'Extra Large' ? 'Extra grande' : val;
          } else if (filterKey === 'age_group') {
            label = val;
          } else if (filterKey.startsWith('is_')) {
            // For boolean filters like is_vaccinated
            label = filterKey === 'is_vaccinated' ? 'Vacunado' :
                   filterKey === 'is_neutered' ? 'Esterilizado' :
                   filterKey === 'is_house_trained' ? 'Adiestrado' :
                   filterKey === 'is_good_with_children' ? 'Bueno con niños' :
                   filterKey === 'is_good_with_other_pets' ? 'Bueno con otras mascotas' : filterKey;
          }
          
          urlFilters.push({
            key: filterKey,
            value: val,
            label
          });
        });
      }
    });
    
    if (urlFilters.length > 0) {
      setFilters(urlFilters);
      if (onFilterChange) onFilterChange(urlFilters);
    }
  }, [searchParams, onFilterChange]);
  
  // Update URL when filters change
  const updateUrl = useCallback((newFilters: FilterOption[]) => {
    // Group filters by key
    const filterGroups: Record<string, string[]> = {};
    
    newFilters.forEach(filter => {
      if (!filterGroups[filter.key]) {
        filterGroups[filter.key] = [];
      }
      filterGroups[filter.key].push(filter.value);
    });
    
    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams);
    
    // Clear existing filter params
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('filter_')) {
        params.delete(key);
      }
    });
    
    // Add new filter params
    Object.entries(filterGroups).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(`filter_${key}`, values.join(','));
      }
    });
    
    // Update the URL
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);
  
  // Remove a filter
  const removeFilter = (filterToRemove: FilterOption) => {
    const newFilters = filters.filter(
      f => !(f.key === filterToRemove.key && f.value === filterToRemove.value)
    );
    setFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
    updateUrl(newFilters);
  };
  
  // Add a filter
  const addFilter = (filterToAdd: FilterOption) => {
    // Check if filter already exists
    const exists = filters.some(
      f => f.key === filterToAdd.key && f.value === filterToAdd.value
    );
    
    if (!exists) {
      const newFilters = [...filters, filterToAdd];
      setFilters(newFilters);
      if (onFilterChange) onFilterChange(newFilters);
      updateUrl(newFilters);
    }
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setFilters([]);
    if (onFilterChange) onFilterChange([]);
    updateUrl([]);
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter, index) => (
        <Badge 
          key={`${filter.key}-${filter.value}-${index}`}
          variant="outline" 
          className="bg-adopt-purple-50 hover:bg-adopt-purple-100 text-adopt-purple-700 px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 cursor-pointer border-adopt-purple-200 hover:border-adopt-purple-300"
          onClick={() => removeFilter(filter)}
        >
          <span>{filter.label}</span>
          <X className="h-3 w-3" />
        </Badge>
      ))}
      
      {filters.length > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-adopt-gray-500 hover:text-adopt-gray-700 hover:bg-adopt-purple-50 p-0 h-auto"
          onClick={clearAllFilters}
        >
          Limpiar filtros
        </Button>
      )}
    </div>
  );
} 