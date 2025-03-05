import { Suspense } from 'react';
import { createClient } from '@/lib/supabase-server';
import PetFilterControls from '@/components/pet-filter-controls';
import FilteredPetsList from '@/components/filtered-pets-list';
import { Pet, PetCategory } from '@/types/database';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Adopta una mascota | AdoptMe",
  description: "Encuentra tu compañero perfecto para adoptar en nuestra lista de mascotas disponibles.",  
};

export const revalidate = 3600; // Revalidate this page every hour

// Define a type that correctly handles pet_categories
export interface PetWithCategory extends Omit<Pet, 'pet_categories'> {
  pet_categories: PetCategory;
}

// Function to get pets with filtering
async function getPets(searchParamsInput: { [key: string]: string }) {
  'use server';
  
  const supabase = await createClient();
  const searchParams = await searchParamsInput;
  
  // Start with the base query
  let query = supabase
    .from('pets')
    .select(`
      *,
      pet_categories (*)
    `);
  
  // Apply filters from URL parameters
  const entries = Object.entries(searchParams);
  for (const [key, value] of entries) {
    if (key.startsWith('filter_')) {
      const filterKey = key.replace('filter_', '');
      const values = value.split(',');
      
      if (filterKey === 'category') {
        // Filter by pet category name
        query = query.in('pet_categories.name', values);
      } else if (filterKey === 'gender') {
        // Filter by gender
        query = query.in('gender', values);
      } else if (filterKey === 'size') {
        // Filter by size
        query = query.in('size', values);
      } else if (filterKey === 'age_group') {
        // Age group filtering would need more complex logic
        // For now, we'll just use the value directly
        query = query.in('age', values);
      } else if (filterKey.startsWith('is_')) {
        // Boolean filters like is_vaccinated
        const boolKey = filterKey;
        query = query.eq(boolKey, values[0] === 'true');
      }
    }
  }
  
  // Apply sorting
  const sortParam = searchParams?.sort || 'recent';
  switch (sortParam) {
    case 'recent':
      query = query.order('created_at', { ascending: false });
      break;
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'alf_asc':
      query = query.order('name', { ascending: true });
      break;
    case 'alf_desc':
      query = query.order('name', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }
  
  // Execute the query
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching pets:', error);
    return [];
  }
  
  // Add default processing for data with null categories
  const processedData = (data || []).map(pet => {
    // Ensure pet_categories is never null
    if (!pet.pet_categories) {
      pet.pet_categories = { id: 0, name: 'Otros', created_at: new Date().toISOString() };
    }
    return pet;
  });
  
  return processedData as PetWithCategory[];
}

// Function to filter pets client-side (for more complex filtering)
async function filterPets(pets: PetWithCategory[], searchParamsInput: { [key: string]: string }) {
  const searchParams = await searchParamsInput;
  
  return pets.filter(pet => {
    // We'll implement additional client-side filtering here if needed
    return true;
  });
}

export default async function PetsPage({
  searchParams: searchParamsInput,
}: {
  searchParams: { [key: string]: string };
}) {
  // Make sure searchParams is awaited before use
  const searchParams = await searchParamsInput;
  
  // Get pets from database with server-side filtering
  const allPets = await getPets(searchParams);
  
  // Apply any additional client-side filtering
  const filteredPets = await filterPets(allPets, searchParams);
  
  // Extract unique pet categories for filter options with null safety
  const petCategories = Array.from(
    new Set(
      allPets
        .filter(pet => pet.pet_categories !== null)
        .map(pet => pet.pet_categories?.name || 'Otros')
    )
  );
  
  // Add default category if not present
  if (petCategories.length === 0) {
    petCategories.push('Otros');
  }
  
  // Define age groups for filtering
  const ageGroups = [
    { label: 'Cachorro', ranges: ['Cachorro', 'Puppy', '0-6 meses', '6-12 meses'], icon: '🐣' },
    { label: 'Joven', ranges: ['Joven', 'Young', '1-2 años'], icon: '🐕' },
    { label: 'Adulto', ranges: ['Adulto', 'Adult', '3-7 años'], icon: '🦮' },
    { label: 'Senior', ranges: ['Senior', 'Anciano', '8+ años'], icon: '🧓' },
  ];
  
  // Define gender options
  const genders = [
    { value: 'Male', label: 'Macho', icon: '♂️' },
    { value: 'Female', label: 'Hembra', icon: '♀️' },
  ];
  
  // Define size options
  const sizes = [
    { value: 'Small', label: 'Pequeño', icon: '🐕‍' },
    { value: 'Medium', label: 'Mediano', icon: '🐕' },
    { value: 'Large', label: 'Grande', icon: '🦮' },
    { value: 'Extra Large', label: 'Extra grande', icon: '🐕‍🦺' },
  ];
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-adopt-gray-900 mb-6">Adopta una mascota</h1>
      
      {/* Filter controls */}
      <div className="mb-8">
        <PetFilterControls 
          petCategories={petCategories}
          ageGroups={ageGroups}
          genders={genders}
          sizes={sizes}
        />
      </div>
      
      {/* Pet listing */}
      <Suspense fallback={<div>Cargando mascotas...</div>}>
        <FilteredPetsList pets={filteredPets} totalCount={allPets.length} />
      </Suspense>
    </main>
  );
}

