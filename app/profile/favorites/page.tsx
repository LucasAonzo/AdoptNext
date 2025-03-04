import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pet, PetCategory } from "@/types/database";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis Favoritos | AdoptMe",
  description: "Revisa tus mascotas favoritas.",
};

export const revalidate = 0; // Dynamic route - do not cache

async function getFavorites() {
  const supabase = createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/auth/signin?redirect=/profile/favorites");
  }
  
  // Get all user's favorites with pet details
  const { data: favorites, error } = await supabase
    .from("favorites")
    .select(`
      *,
      pets(
        *,
        pet_categories(*)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
  
  return favorites || [];
}

export default async function FavoritesPage() {
  const favorites = await getFavorites();
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-adopt-gray-900 mb-8">Mis Favoritos</h1>
      
      {favorites.length === 0 ? (
        <div className="bg-white rounded-xl border border-adopt-purple-100 p-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-adopt-purple-100 rounded-full mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-adopt-purple-600"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-adopt-gray-900 mb-2">No tienes mascotas favoritas</h2>
          <p className="text-adopt-gray-600 mb-6">
            Aún no has añadido ninguna mascota a tus favoritos. 
            Explora nuestro catálogo y marca como favoritas las mascotas que más te gusten.
          </p>
          <Button variant="primary" size="lg-pill" asChild>
            <Link href="/pets">
              Explorar mascotas disponibles
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite: any) => {
            const pet = favorite.pets as Pet & { pet_categories: PetCategory };
            return (
              <div key={favorite.id} className="bg-white rounded-xl border border-adopt-purple-100 overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={pet.main_image_url || '/images/pet-placeholder.jpg'}
                    alt={pet.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 text-sm font-medium text-adopt-purple-700 shadow-sm">
                    {pet.pet_categories?.name || 'Mascota'}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white border-none shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-adopt-purple-600"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </Button>

                  {pet.status !== 'Available' && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <span className="bg-adopt-purple-600 text-white px-3 py-1 rounded-md font-bold text-sm uppercase">
                        {pet.status === 'Adopted' ? 'Adoptado' : 'En proceso'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h2 className="text-lg font-bold text-adopt-gray-900 truncate">{pet.name}</h2>
                  <p className="text-adopt-gray-600 mb-3 truncate">{pet.breed || 'Mascota en adopción'}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-adopt-purple-100"></div>
                      <span className="text-sm text-adopt-gray-600">{pet.age}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-adopt-purple-100"></div>
                      <span className="text-sm text-adopt-gray-600">{pet.gender}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1" asChild>
                      <Link href={`/pets/${pet.id}`}>
                        Ver detalles
                      </Link>
                    </Button>
                    {pet.status === 'Available' && (
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/adopt/${pet.id}`}>
                          Adoptar
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 