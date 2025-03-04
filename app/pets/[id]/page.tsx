import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Pet, PetCategory, PetImage } from '@/types/database';

// Import our components
import PetGallery from '@/components/pet-details/pet-gallery';
import PetInformation from '@/components/pet-details/pet-information';
import PetActions from '@/components/pet-details/pet-actions';
import SimilarPets from '@/components/pet-details/similar-pets';
import PetDetailsSkeleton from '@/components/pet-details/pet-details-skeleton';

// Define the type for pet with properly typed category
export interface PetWithCategory extends Omit<Pet, 'pet_categories'> {
  pet_categories: PetCategory;
}

// Interface for the page component props
interface PetDetailsPageProps {
  params: {
    id: string;
  };
}

// Generate metadata for better SEO
export async function generateMetadata({ params }: PetDetailsPageProps): Promise<Metadata> {
  // Fetch the pet data
  const supabase = createServerComponentClient({ cookies });
  const { data: pet } = await supabase
    .from('pets')
    .select('name, description, pet_categories(name)')
    .eq('id', params.id)
    .single();
  
  if (!pet) {
    return {
      title: 'Mascota no encontrada',
      description: 'No pudimos encontrar la mascota que estás buscando.'
    };
  }
  
  return {
    title: `${pet.name} | AdoptMe - Adopción de mascotas`,
    description: pet.description?.substring(0, 160) || 'Conoce esta adorable mascota disponible para adopción en AdoptMe.',
    openGraph: {
      title: `${pet.name} | AdoptMe`,
      description: pet.description?.substring(0, 160) || 'Conoce esta adorable mascota disponible para adopción en AdoptMe.',
      type: 'website',
    },
  };
}

// Fetch function to get pet details
async function getPetDetails(id: string): Promise<PetWithCategory | null> {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: pet, error } = await supabase
    .from('pets')
    .select('*, pet_categories(*)')
    .eq('id', id)
    .single();
  
  if (error || !pet) {
    return null;
  }
  
  // Handle potential null category by providing a default
  if (!pet.pet_categories) {
    pet.pet_categories = {
      id: '',
      name: 'Sin categoría',
      created_at: '',
    };
  }
  
  return pet as unknown as PetWithCategory;
}

// Fetch function to get pet images
async function getPetImages(pet_id: string): Promise<PetImage[]> {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: images, error } = await supabase
    .from('pet_images')
    .select('*')
    .eq('pet_id', pet_id)
    .order('is_main', { ascending: false });
  
  if (error || !images) {
    return [];
  }
  
  return images;
}

// Fetch function to get similar pets
async function getSimilarPets(currentPet: PetWithCategory): Promise<PetWithCategory[]> {
  const supabase = createServerComponentClient({ cookies });
  
  // Get pets of the same category and similar characteristics
  const { data: similarPets, error } = await supabase
    .from('pets')
    .select('*, pet_categories(*)')
    .eq('pet_categories.id', currentPet.pet_categories.id)
    .neq('id', currentPet.id)
    .limit(6);
  
  if (error || !similarPets || similarPets.length === 0) {
    // If no pets in the same category, get pets from any category
    const { data: fallbackPets } = await supabase
      .from('pets')
      .select('*, pet_categories(*)')
      .neq('id', currentPet.id)
      .limit(6);
    
    if (!fallbackPets) return [];
    
    // Ensure all pets have a valid pet_categories property
    return fallbackPets.map(pet => ({
      ...pet,
      pet_categories: pet.pet_categories || {
        id: '',
        name: 'Sin categoría',
        created_at: '',
      }
    })) as PetWithCategory[];
  }
  
  // Ensure all pets have a valid pet_categories property
  return similarPets.map(pet => ({
    ...pet,
    pet_categories: pet.pet_categories || {
      id: '',
      name: 'Sin categoría',
      created_at: '',
    }
  })) as PetWithCategory[];
}

export default async function PetDetailsPage({ params }: PetDetailsPageProps) {
  // Fetch pet data and handle not found
  const pet = await getPetDetails(params.id);
  
  if (!pet) {
    notFound();
  }
  
  // Fetch additional data in parallel
  const [images, similarPets] = await Promise.all([
    getPetImages(params.id),
    getSimilarPets(pet),
  ]);
  
  return (
    <main className="bg-adopt-gray-50 min-h-screen pb-16">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<PetDetailsSkeleton />}>
          <div className="max-w-7xl mx-auto">
            {/* Modern two-column layout for desktop, single column for mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Gallery and main info - takes up more space */}
              <div className="lg:col-span-8 space-y-8">
                <PetGallery pet={pet} images={images} />
                <PetInformation pet={pet} />
              </div>
              
              {/* Actions sidebar - fixed position on large screens */}
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-24">
                  <PetActions pet={pet} />
                </div>
              </div>
            </div>
            
            {/* Similar pets section */}
            <div className="mt-16">
              <SimilarPets currentPetId={pet.id} similarPets={similarPets} />
            </div>
          </div>
        </Suspense>
      </div>
    </main>
  );
}

