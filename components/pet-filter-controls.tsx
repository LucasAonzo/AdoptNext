'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  X, 
  Check, 
  ArrowDown, 
  ArrowUp,
  Filter,
  SlidersHorizontal,
  Search
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PetCategory } from "@/types/database";

export type FilterOption = {
  key: string;
  value: string;
  label: string;
};

export type SortOption = 'recent' | 'oldest' | 'alf_asc' | 'alf_desc';

interface PetFilterControlsProps {
  petCategories: string[];
  ageGroups: { label: string; ranges: string[]; icon: string; }[];
  genders: { value: string; label: string; icon: string; }[];
  sizes: { value: string; label: string; icon: string; }[];
  onFilterChange?: (filters: FilterOption[]) => void;
  onSortChange?: (sort: SortOption) => void;
}

export default function PetFilterControls({
  petCategories,
  ageGroups,
  genders,
  sizes,
  onFilterChange,
  onSortChange
}: PetFilterControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [activeSort, setActiveSort] = useState<SortOption>('recent');
  
  // Parse filters from URL on mount
  useEffect(() => {
    const urlFilters: FilterOption[] = [];
    let currentSort: SortOption = 'recent';
    
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('filter_')) {
        const filterKey = key.replace('filter_', '');
        const values = value.split(',');
        
        values.forEach(val => {
          let label = val;
          
          // Get appropriate label based on filter type
          if (filterKey === 'category') {
            label = val;
          } else if (filterKey === 'gender') {
            const genderItem = genders.find(g => g.value === val);
            if (genderItem) label = genderItem.label;
          } else if (filterKey === 'size') {
            const sizeItem = sizes.find(s => s.value === val);
            if (sizeItem) label = sizeItem.label;
          } else if (filterKey === 'age_group') {
            const ageItem = ageGroups.find(a => a.ranges.includes(val));
            if (ageItem) label = ageItem.label;
          }
          
          urlFilters.push({
            key: filterKey,
            value: val,
            label
          });
        });
      } else if (key === 'sort') {
        if (['recent', 'oldest', 'alf_asc', 'alf_desc'].includes(value)) {
          currentSort = value as SortOption;
        }
      }
    }
    
    setActiveFilters(urlFilters);
    setActiveSort(currentSort);
  }, [searchParams, ageGroups, genders, sizes]);
  
  // Update URL with current filters
  const updateUrl = useCallback((filters: FilterOption[], sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Clear existing filter params
    Array.from(params.keys()).forEach(key => {
      if (key.startsWith('filter_') || key === 'sort') {
        params.delete(key);
      }
    });
    
    // Group filters by key
    const filterGroups: Record<string, string[]> = {};
    filters.forEach(filter => {
      if (!filterGroups[filter.key]) {
        filterGroups[filter.key] = [];
      }
      filterGroups[filter.key].push(filter.value);
    });
    
    // Add filter groups to params
    Object.entries(filterGroups).forEach(([key, values]) => {
      params.set(`filter_${key}`, values.join(','));
    });
    
    // Add sort param
    params.set('sort', sort);
    
    // Update URL
    router.push(`?${params.toString()}`, { scroll: false });
    
    // Notify parent components
    if (onFilterChange) onFilterChange(filters);
    if (onSortChange) onSortChange(sort);
  }, [searchParams, router, onFilterChange, onSortChange]);
  
  // Add a new filter
  const addFilter = (key: string, value: string, label: string) => {
    const newFilter = { key, value, label };
    const exists = activeFilters.some(f => f.key === key && f.value === value);
    
    if (!exists) {
      const newFilters = [...activeFilters, newFilter];
      setActiveFilters(newFilters);
      updateUrl(newFilters, activeSort);
    }
  };
  
  // Remove a filter
  const removeFilter = (filterToRemove: FilterOption) => {
    const newFilters = activeFilters.filter(
      filter => !(filter.key === filterToRemove.key && filter.value === filterToRemove.value)
    );
    
    setActiveFilters(newFilters);
    updateUrl(newFilters, activeSort);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
    updateUrl([], activeSort);
  };
  
  // Change sort option
  const changeSort = (sort: SortOption) => {
    setActiveSort(sort);
    updateUrl(activeFilters, sort);
  };
  
  // Check if a filter is active
  const isFilterActive = (key: string, value: string) => {
    return activeFilters.some(f => f.key === key && f.value === value);
  };
  
  // Get sort label
  const getSortLabel = (sort: SortOption): string => {
    switch (sort) {
      case 'recent': return 'Más recientes';
      case 'oldest': return 'Más antiguos';
      case 'alf_asc': return 'Alfabético (A-Z)';
      case 'alf_desc': return 'Alfabético (Z-A)';
      default: return 'Más recientes';
    }
  };
  
  // Count active filters by type
  const getActiveFilterCount = (key: string): number => {
    return activeFilters.filter(f => f.key === key).length;
  };
  
  // Get total filter count
  const getTotalFilterCount = (): number => {
    return activeFilters.length;
  };
  
  return (
    <div className="space-y-4">
      {/* Mobile-optimized filter bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide md:hidden">
        {/* Category Pills - Horizontal scrolling on mobile */}
        <div className="flex gap-1.5 flex-nowrap">
          {petCategories.map((category) => {
            const isActive = isFilterActive('category', category);
            // Replace "Pequeños mamíferos" with "Otros"
            const displayCategory = category === "Pequeños mamíferos" ? "Otros" : category;
            
            return (
              <Button 
                key={category}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={`rounded-full py-1 px-3 text-xs whitespace-nowrap ${
                  isActive 
                    ? 'bg-adopt-purple-600 text-white hover:bg-adopt-purple-700' 
                    : 'bg-white border-adopt-purple-200 shadow-sm hover:bg-adopt-purple-50 text-adopt-purple-800'
                } flex items-center justify-center transition-all`}
                onClick={() => isActive 
                  ? removeFilter({ key: 'category', value: category, label: displayCategory }) 
                  : addFilter('category', category, displayCategory)
                }
              >
                {displayCategory}
                {isActive && <X className="ml-1 h-3 w-3" />}
              </Button>
            );
          })}
        </div>
        
        {/* Compact filter buttons */}
        <div className="flex gap-1.5 ml-auto">
          {/* All Filters Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full h-8 px-3 text-xs font-medium border-adopt-purple-200 shadow-sm hover:bg-adopt-purple-50 text-adopt-purple-800 whitespace-nowrap"
              >
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                Filtros
                {getTotalFilterCount() > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-adopt-purple-600 text-white text-[10px] rounded-full">
                    {getTotalFilterCount()}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-xl pt-6">
              <SheetHeader className="text-left mb-4">
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription>
                  Encuentra la mascota perfecta para ti
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-5 overflow-y-auto max-h-[calc(85vh-10rem)]">
                {/* Age Groups */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-adopt-gray-700">Edad</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {ageGroups.map(age => {
                      const isActive = isFilterActive('age_group', age.ranges[0]);
                      return (
                        <Button 
                          key={age.label}
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          className={`justify-start ${
                            isActive 
                              ? 'bg-adopt-purple-100 text-adopt-purple-800 hover:bg-adopt-purple-200' 
                              : 'bg-white hover:bg-adopt-purple-50 text-adopt-gray-700'
                          }`}
                          onClick={() => isActive 
                            ? removeFilter({ key: 'age_group', value: age.ranges[0], label: age.label }) 
                            : addFilter('age_group', age.ranges[0], age.label)
                          }
                        >
                          <span className="mr-2">{age.icon}</span>
                          {age.label}
                          {isActive && <Check className="ml-auto h-4 w-4" />}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Gender */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-adopt-gray-700">Género</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {genders.map(gender => {
                      const isActive = isFilterActive('gender', gender.value);
                      return (
                        <Button 
                          key={gender.value}
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          className={`justify-start ${
                            isActive 
                              ? 'bg-adopt-purple-100 text-adopt-purple-800 hover:bg-adopt-purple-200' 
                              : 'bg-white hover:bg-adopt-purple-50 text-adopt-gray-700'
                          }`}
                          onClick={() => isActive 
                            ? removeFilter({ key: 'gender', value: gender.value, label: gender.label }) 
                            : addFilter('gender', gender.value, gender.label)
                          }
                        >
                          <span className="mr-2">{gender.icon}</span>
                          {gender.label}
                          {isActive && <Check className="ml-auto h-4 w-4" />}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Size */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-adopt-gray-700">Tamaño</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {sizes.map(size => {
                      const isActive = isFilterActive('size', size.value);
                      return (
                        <Button 
                          key={size.value}
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          className={`justify-start ${
                            isActive 
                              ? 'bg-adopt-purple-100 text-adopt-purple-800 hover:bg-adopt-purple-200' 
                              : 'bg-white hover:bg-adopt-purple-50 text-adopt-gray-700'
                          }`}
                          onClick={() => isActive 
                            ? removeFilter({ key: 'size', value: size.value, label: size.label }) 
                            : addFilter('size', size.value, size.label)
                          }
                        >
                          <span className="mr-2">{size.icon}</span>
                          {size.label}
                          {isActive && <Check className="ml-auto h-4 w-4" />}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <SheetFooter className="flex-row justify-between mt-6 gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={clearFilters}
                  disabled={activeFilters.length === 0}
                >
                  Limpiar filtros
                </Button>
                <SheetClose asChild>
                  <Button className="flex-1">Aplicar</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          
          {/* Sort Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-full h-8 px-3 text-xs font-medium border-adopt-purple-200 shadow-sm hover:bg-adopt-purple-50 text-adopt-purple-800 whitespace-nowrap"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                className={`px-3 py-2 cursor-pointer ${activeSort === 'recent' ? 'bg-adopt-purple-50 text-adopt-purple-800' : ''}`}
                onClick={() => changeSort('recent')}
              >
                <span>Más recientes</span>
                {activeSort === 'recent' && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`px-3 py-2 cursor-pointer ${activeSort === 'oldest' ? 'bg-adopt-purple-50 text-adopt-purple-800' : ''}`}
                onClick={() => changeSort('oldest')}
              >
                <span>Más antiguos</span>
                {activeSort === 'oldest' && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`px-3 py-2 cursor-pointer ${activeSort === 'alf_asc' ? 'bg-adopt-purple-50 text-adopt-purple-800' : ''}`}
                onClick={() => changeSort('alf_asc')}
              >
                <span>Alfabético (A-Z)</span>
                {activeSort === 'alf_asc' && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`px-3 py-2 cursor-pointer ${activeSort === 'alf_desc' ? 'bg-adopt-purple-50 text-adopt-purple-800' : ''}`}
                onClick={() => changeSort('alf_desc')}
              >
                <span>Alfabético (Z-A)</span>
                {activeSort === 'alf_desc' && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Active filters count and clear - Mobile */}
      {activeFilters.length > 0 && (
        <div className="flex items-center justify-between md:hidden">
          <div className="text-sm text-adopt-gray-700">
            <span className="font-medium">{activeFilters.length}</span> {activeFilters.length === 1 ? 'filtro aplicado' : 'filtros aplicados'}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-adopt-purple-600 hover:text-adopt-purple-800 hover:bg-adopt-purple-50 px-2 py-1 h-7"
            onClick={clearFilters}
          >
            Limpiar todos
          </Button>
        </div>
      )}
      
      {/* Desktop filter UI - hidden on mobile */}
      <div className="hidden md:block space-y-6">
        {/* Categories - Visual Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {petCategories.map((category) => {
            // Replace "Pequeños mamíferos" with "Otros"
            const displayCategory = category === "Pequeños mamíferos" ? "Otros" : category;
            const isActive = isFilterActive('category', category);
            
            return (
              <Button 
                key={category}
                variant={isActive ? "default" : "outline"}
                className={`rounded-full py-1.5 px-4 text-sm font-medium ${
                  isActive 
                    ? 'bg-adopt-purple-600 text-white hover:bg-adopt-purple-700' 
                    : 'bg-white border-adopt-purple-200 shadow-sm hover:bg-adopt-purple-50 text-adopt-purple-800'
                } flex items-center justify-center transition-all`}
                onClick={() => isActive 
                  ? removeFilter({ key: 'category', value: category, label: displayCategory }) 
                  : addFilter('category', category, displayCategory)
                }
              >
                {displayCategory}
                {isActive && <X className="ml-1.5 h-3 w-3" />}
              </Button>
            );
          })}
        </div>
        
        {/* Divider */}
        <Separator className="my-6" />
        
        {/* Main Filter Controls */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <span className="text-sm font-medium text-adopt-gray-500">Filtrar por:</span>
          
          {/* Quick Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {/* Age filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="rounded-full h-9 px-4 text-sm font-medium border-adopt-purple-200 shadow-sm hover:bg-adopt-purple-50 text-adopt-purple-800"
                >
                  <span>Edad</span>
                  <ChevronDown className="h-3.5 w-3.5 ml-1 text-adopt-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 p-1">
                {ageGroups.map(age => {
                  const isActive = isFilterActive('age_group', age.ranges[0]);
                  return (
                    <DropdownMenuItem 
                      key={age.label} 
                      className={`px-3 py-2 rounded-md cursor-pointer ${
                        isActive ? 'bg-adopt-purple-50 text-adopt-purple-800' : ''
                      }`}
                      onClick={() => isActive 
                        ? removeFilter({ key: 'age_group', value: age.ranges[0], label: age.label }) 
                        : addFilter('age_group', age.ranges[0], age.label)
                      }
                    >
                      <span className="mr-2">{age.icon}</span>
                      <span>{age.label}</span>
                      {isActive && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Gender filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="rounded-full h-9 px-4 text-sm font-medium border-adopt-purple-200 shadow-sm hover:bg-adopt-purple-50 text-adopt-purple-800"
                >
                  <span>Género</span>
                  <ChevronDown className="h-3.5 w-3.5 ml-1 text-adopt-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 p-1">
                {genders.map(gender => {
                  const isActive = isFilterActive('gender', gender.value);
                  return (
                    <DropdownMenuItem 
                      key={gender.value} 
                      className={`px-3 py-2 rounded-md cursor-pointer ${
                        isActive ? 'bg-adopt-purple-50 text-adopt-purple-800' : ''
                      }`}
                      onClick={() => isActive 
                        ? removeFilter({ key: 'gender', value: gender.value, label: gender.label }) 
                        : addFilter('gender', gender.value, gender.label)
                      }
                    >
                      <span className="mr-2">{gender.icon}</span>
                      <span>{gender.label}</span>
                      {isActive && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Size filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="rounded-full h-9 px-4 text-sm font-medium border-adopt-purple-200 shadow-sm hover:bg-adopt-purple-50 text-adopt-purple-800"
                >
                  <span>Tamaño</span>
                  <ChevronDown className="h-3.5 w-3.5 ml-1 text-adopt-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 p-1">
                {sizes.map(size => {
                  const isActive = isFilterActive('size', size.value);
                  return (
                    <DropdownMenuItem 
                      key={size.value} 
                      className={`px-3 py-2 rounded-md cursor-pointer ${
                        isActive ? 'bg-adopt-purple-50 text-adopt-purple-800' : ''
                      }`}
                      onClick={() => isActive 
                        ? removeFilter({ key: 'size', value: size.value, label: size.label }) 
                        : addFilter('size', size.value, size.label)
                      }
                    >
                      <span className="mr-2">{size.icon}</span>
                      <span>{size.label}</span>
                      {isActive && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Sort dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="rounded-full h-9 px-4 text-sm font-medium border-adopt-purple-200 shadow-sm hover:bg-adopt-purple-50 text-adopt-purple-800 ml-auto"
                >
                  <span>Ordenar: {getSortLabel(activeSort)}</span>
                  <ChevronDown className="h-3.5 w-3.5 ml-1 text-adopt-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 p-1">
                <DropdownMenuItem 
                  className={`px-3 py-2 rounded-md cursor-pointer ${activeSort === 'recent' ? 'bg-adopt-purple-50 text-adopt-purple-800' : ''}`}
                  onClick={() => changeSort('recent')}
                >
                  <span>Más recientes</span>
                  {activeSort === 'recent' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`px-3 py-2 rounded-md cursor-pointer ${activeSort === 'oldest' ? 'bg-adopt-purple-50 text-adopt-purple-800' : ''}`}
                  onClick={() => changeSort('oldest')}
                >
                  <span>Más antiguos</span>
                  {activeSort === 'oldest' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`px-3 py-2 rounded-md cursor-pointer ${activeSort === 'alf_asc' ? 'bg-adopt-purple-50 text-adopt-purple-800' : ''}`}
                  onClick={() => changeSort('alf_asc')}
                >
                  <span>Alfabético (A-Z)</span>
                  {activeSort === 'alf_asc' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={`px-3 py-2 rounded-md cursor-pointer ${activeSort === 'alf_desc' ? 'bg-adopt-purple-50 text-adopt-purple-800' : ''}`}
                  onClick={() => changeSort('alf_desc')}
                >
                  <span>Alfabético (Z-A)</span>
                  {activeSort === 'alf_desc' && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Active filters - Desktop */}
        <div className="flex flex-wrap gap-2 mb-5">
          {activeFilters.map((filter, index) => (
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
          
          {activeFilters.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-adopt-gray-500 hover:text-adopt-gray-700 hover:bg-adopt-purple-50 px-2 py-1 h-7"
              onClick={clearFilters}
            >
              Limpiar todos
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 