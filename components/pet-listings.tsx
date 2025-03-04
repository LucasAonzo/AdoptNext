'use client';

import { useState, useEffect } from 'react';
import { PetCard } from '@/components/pet-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePets, usePetCategories } from '@/hooks/use-pets';
import { usePetStore } from '@/store/pet-store';
import { Skeleton } from '@/components/ui/skeleton';

// Skeleton loader for pet cards
function PetCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

export function PetListings() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { data: pets = [], isLoading, error } = usePets(8); // Limit to 8 pets for the homepage
  const { data: categories = [], isLoading: isLoadingCategories } = usePetCategories();
  const setFilter = usePetStore(state => state.setFilter);
  const resetFilters = usePetStore(state => state.resetFilters);
  
  // Handle hydration issues by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    resetFilters();
    
    if (value === 'all') {
      // No filters
    } else if (value === 'dogs') {
      // Find dog category ID
      const dogCategory = categories.find(cat => cat.name.toLowerCase().includes('perro'));
      if (dogCategory) {
        setFilter('category', dogCategory.id);
      }
    } else if (value === 'cats') {
      // Find cat category ID
      const catCategory = categories.find(cat => cat.name.toLowerCase().includes('gato'));
      if (catCategory) {
        setFilter('category', catCategory.id);
      }
    } else if (value === 'others') {
      // Handle "others" category - this requires custom handling
      // We filter out dogs and cats on the client side
      const dogCatIds = categories
        .filter(cat => 
          cat.name.toLowerCase().includes('perro') || 
          cat.name.toLowerCase().includes('gato')
        )
        .map(cat => cat.id);
      
      // Filter pets on the client side
      const otherPets = pets.filter(pet => !dogCatIds.includes(pet.category_id));
      
      // Use a special value for the filter
      setFilter('category', -1);
    }
  };

  // If not mounted yet, return a placeholder
  if (!mounted) {
    return (
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Nuestros Amigos Adoptables</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Conoce a nuestros adorables amigos que están esperando un hogar amoroso.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <PetCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Nuestros Amigos Adoptables</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Conoce a nuestros adorables amigos que están esperando un hogar amoroso. ¡Encuentra a tu compañero perfecto!
            </p>
          </div>
          <Button asChild>
            <a href="/pets">Ver Todos</a>
          </Button>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-1">
          <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="dogs">Perros</TabsTrigger>
              <TabsTrigger value="cats">Gatos</TabsTrigger>
              <TabsTrigger value="others">Otros</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array(4).fill(0).map((_, i) => (
                    <PetCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">Error al cargar mascotas</div>
              ) : pets.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {pets.map((pet) => (
                    <PetCard
                      key={pet.id}
                      id={pet.id}
                      name={pet.name}
                      breed={pet.breed || ''}
                      gender={pet.gender}
                      age={pet.age}
                      image={pet.main_image_url || '/images/pet-placeholder.jpg'}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">No hay mascotas disponibles en este momento.</div>
              )}
            </TabsContent>
            <TabsContent value="dogs" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array(4).fill(0).map((_, i) => (
                    <PetCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">Error al cargar perros</div>
              ) : pets.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {pets.map((pet) => (
                    <PetCard
                      key={pet.id}
                      id={pet.id}
                      name={pet.name}
                      breed={pet.breed || ''}
                      gender={pet.gender}
                      age={pet.age}
                      image={pet.main_image_url || '/images/pet-placeholder.jpg'}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">No hay perros disponibles en este momento.</div>
              )}
            </TabsContent>
            <TabsContent value="cats" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array(4).fill(0).map((_, i) => (
                    <PetCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">Error al cargar gatos</div>
              ) : pets.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {pets.map((pet) => (
                    <PetCard
                      key={pet.id}
                      id={pet.id}
                      name={pet.name}
                      breed={pet.breed || ''}
                      gender={pet.gender}
                      age={pet.age}
                      image={pet.main_image_url || '/images/pet-placeholder.jpg'}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">No hay gatos disponibles en este momento.</div>
              )}
            </TabsContent>
            <TabsContent value="others" className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array(4).fill(0).map((_, i) => (
                    <PetCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">Error al cargar otras mascotas</div>
              ) : pets.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {pets.map((pet) => (
                    <PetCard
                      key={pet.id}
                      id={pet.id}
                      name={pet.name}
                      breed={pet.breed || ''}
                      gender={pet.gender}
                      age={pet.age}
                      image={pet.main_image_url || '/images/pet-placeholder.jpg'}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">No hay otras mascotas disponibles en este momento.</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

