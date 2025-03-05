import { createClient } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AdoptionForm from "@/components/adoption/adoption-form";
import { Pet, PetCategory } from "@/types/database";
import { Metadata } from "next";

export const revalidate = 3600; // Revalidate every hour

// Dynamically generate metadata for SEO
export async function generateMetadata({ params: paramsInput }: { params: { id: string } }): Promise<Metadata> {
  const params = await paramsInput;
  const pet = await getPet(params.id);
  
  if (!pet) {
    return {
      title: "Solicitud de adopción | AdoptMe",
      description: "Formulario de solicitud para adoptar una mascota.",
    };
  }

  return {
    title: `Adoptar a ${pet.name} | AdoptMe`,
    description: `Completa el formulario para solicitar la adopción de ${pet.name}.`,
    openGraph: {
      images: pet.main_image_url ? [pet.main_image_url] : [],
    },
  };
}

async function getPet(id: string) {
  const supabase = await createClient();
  
  const { data: pet, error } = await supabase
    .from("pets")
    .select(`
      *,
      pet_categories(*)
    `)
    .eq("id", id)
    .single();
  
  if (error || !pet) {
    console.error("Error fetching pet:", error);
    return null;
  }

  return pet;
}

export default async function AdoptionPage({ params: paramsInput }: { params: { id: string } }) {
  const params = await paramsInput;
  const pet = await getPet(params.id);
  
  if (!pet) {
    notFound();
  }

  // If pet is not available, redirect to pet page
  if (pet.status !== 'Available') {
    redirect(`/pets/${params.id}`);
  }

  const category = pet.pet_categories as PetCategory;

  return (
    <div className="container mx-auto py-12 px-4">
      <Link 
        href={`/pets/${params.id}`} 
        className="inline-flex items-center text-adopt-purple-600 mb-6 hover:text-adopt-purple-700 transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="mr-2"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Volver al perfil de {pet.name}
      </Link>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-adopt-gray-900 mb-4">Solicitud de Adopción</h1>
          <p className="text-adopt-gray-600 max-w-2xl mx-auto">
            Por favor completa el siguiente formulario para iniciar el proceso de adopción. 
            Revisaremos tu solicitud y nos pondremos en contacto contigo pronto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Pet Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-adopt-purple-100 overflow-hidden sticky top-10">
              <div className="relative h-48 w-full">
                <Image
                  src={pet.main_image_url || '/images/pet-placeholder.jpg'}
                  alt={pet.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <div className="inline-block bg-adopt-purple-100 text-adopt-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                  {category.name}
                </div>
                <h2 className="text-xl font-bold text-adopt-gray-900 mb-1">{pet.name}</h2>
                <p className="text-adopt-gray-600 mb-3">{pet.breed || 'Mascota en adopción'}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-adopt-gray-600">Edad:</span>
                    <span className="font-medium">{pet.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-adopt-gray-600">Género:</span>
                    <span className="font-medium">{pet.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-adopt-gray-600">Tamaño:</span>
                    <span className="font-medium">{pet.size || 'No especificado'}</span>
                  </div>
                </div>

                <div className="border-t border-adopt-gray-100 pt-4 mt-4">
                  <p className="text-sm text-adopt-gray-500 mb-2">
                    Al enviar tu solicitud, aceptas nuestros términos y condiciones del proceso de adopción.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    asChild
                  >
                    <Link href="/adoption-policy" target="_blank">
                      Ver política de adopción
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Adoption Form */}
          <div className="lg:col-span-2">
            <AdoptionForm petId={pet.id} />
          </div>
        </div>
      </div>
    </div>
  );
} 