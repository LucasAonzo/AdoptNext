import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Pet, PetCategory } from "@/types/database";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Heart, Calendar, MapPin, CheckCircle, Info, AlertCircle, ChevronRight } from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

// Dynamically generate metadata for SEO
export async function generateMetadata({ params: paramsInput }: { params: { id: string } }): Promise<Metadata> {
  const params = await paramsInput;
  const pet = await getPet(params.id);
  
  if (!pet) {
    return {
      title: "Mascota no encontrada | AdoptMe",
      description: "Lo sentimos, la mascota que buscas no está disponible.",
    };
  }

  return {
    title: `${pet.name} | AdoptMe`,
    description: pet.description || `Conoce a ${pet.name}, un ${pet.breed} disponible para adopción.`,
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

  // Get pet images
  const { data: images } = await supabase
    .from("pet_images")
    .select("*")
    .eq("pet_id", id)
    .order("is_main", { ascending: false });
  
  return { ...pet, images: images || [] };
}

export default async function PetDetailPage({ params: paramsInput }: { params: { id: string } }) {
  const params = await paramsInput;
  const pet = await getPet(params.id);
  
  if (!pet) {
    notFound();
  }

  const category = pet.pet_categories as PetCategory;
  const features = [
    { name: "Edad", value: pet.age, icon: <Calendar className="h-4 w-4" /> },
    { name: "Género", value: pet.gender, icon: <div className="h-4 w-4 flex items-center justify-center font-bold">{pet.gender === 'Male' ? '♂' : '♀'}</div> },
    { name: "Color", value: pet.color || "No especificado", icon: <div className="h-4 w-4 rounded-full bg-adopt-purple-200 border border-adopt-purple-300"></div> },
    { name: "Tamaño", value: pet.size || "No especificado", icon: <div className="h-4 w-4 flex items-center justify-center">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 3L22 7L17 11V8H8V16H11L7 21L3 16H6V8C6 6.89543 6.89543 6 8 6H17V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div> },
    { name: "Peso", value: pet.weight ? `${pet.weight} kg` : "No especificado", icon: <div className="h-4 w-4 flex items-center justify-center">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3V5M18 12H20M4 12H6M12 19V21M19 5L17.5 6.5M5 5L6.5 6.5M19 19L17.5 17.5M5 19L6.5 17.5M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div> }
  ];
  
  const characteristics = [
    { name: "Vacunado", value: pet.is_vaccinated },
    { name: "Esterilizado", value: pet.is_neutered },
    { name: "Adiestrado", value: pet.is_house_trained },
    { name: "Bueno con niños", value: pet.is_good_with_children },
    { name: "Bueno con otras mascotas", value: pet.is_good_with_other_pets }
  ];

  return (
    <div className="bg-adopt-purple-50/30 min-h-screen pb-16">
      {/* Pet Images Section */}
      <div className="relative w-full bg-adopt-purple-900">
        <div className="absolute top-0 left-0 right-0 z-10 pt-6 px-4 md:px-8">
          <Link 
            href="/pets" 
            className="inline-flex items-center text-white bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-black/40 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a todas las mascotas
          </Link>
        </div>
        
        <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
          <Image
            src={pet.main_image_url || '/images/pet-placeholder.jpg'}
            alt={pet.name}
            fill
            className="object-cover opacity-90"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
        </div>
        
        {/* Status badge */}
        {pet.status !== 'Available' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-black/70 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-bold uppercase text-xl">
              {pet.status === 'Adopted' ? 'Adoptado' : 'En proceso'}
            </div>
          </div>
        )}
        
        {/* Pet Info Preview */}
        <div className="container mx-auto px-4 relative -mt-24 z-10 pb-6">
          <Card className="rounded-xl overflow-hidden shadow-lg border-none">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Basic Info */}
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Badge variant="secondary" className="bg-adopt-purple-100 text-adopt-purple-800 rounded-full">
                      {category.name}
                    </Badge>
                    <Badge variant="outline" className={`
                      rounded-full
                      ${pet.status === 'Available' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-yellow-100 text-yellow-700 border-yellow-200'}
                    `}>
                      {pet.status === 'Available' ? 'Disponible' : 
                      pet.status === 'Adopted' ? 'Adoptado' : 'En proceso'}
                    </Badge>
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-adopt-gray-900 mb-2">{pet.name}</h1>
                  <p className="text-adopt-gray-600 text-lg">{pet.breed}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                    {features.map((feature) => (
                      <div key={feature.name} className="flex flex-col">
                        <div className="flex items-center gap-2 text-adopt-gray-600 mb-1">
                          {feature.icon}
                          <span className="text-sm">{feature.name}</span>
                        </div>
                        <div className="text-adopt-gray-900 font-medium">{feature.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Adoption Actions */}
                <div className="bg-adopt-purple-50 p-6 md:p-8 md:w-72 flex flex-col">
                  <h2 className="font-semibold text-adopt-purple-900 mb-4">¿Interesado en adoptar?</h2>
                  
                  {pet.status === 'Available' ? (
                    <>
                      <p className="text-adopt-gray-600 text-sm mb-6">
                        Completando un formulario sencillo, puedes iniciar el proceso para darle un hogar a {pet.name}.
                      </p>
                      <div className="space-y-4 mt-auto">
                        <Button className="w-full bg-adopt-purple-600 hover:bg-adopt-purple-700" size="lg" asChild>
                          <Link href={`/adopt/${pet.id}`}>
                            Solicitar Adopción
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full border-adopt-purple-200 hover:bg-adopt-purple-100" size="lg">
                          <Heart className="mr-2 h-5 w-5 text-adopt-purple-600" />
                          Añadir a Favoritos
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white rounded-lg p-4 mb-4 border border-yellow-200">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mb-2" />
                        <p className="text-adopt-gray-600 text-sm">
                          {pet.status === 'Adopted' 
                            ? 'Esta mascota ya ha sido adoptada.' 
                            : 'Esta mascota está en proceso de adopción.'}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full border-adopt-purple-200 hover:bg-adopt-purple-100 mt-auto"
                        size="lg"
                        asChild
                      >
                        <Link href="/pets">
                          Ver otras mascotas
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="mb-6 bg-white">
                <TabsTrigger value="about" className="data-[state=active]:text-adopt-purple-700">
                  Sobre {pet.name}
                </TabsTrigger>
                <TabsTrigger value="characteristics" className="data-[state=active]:text-adopt-purple-700">
                  Características
                </TabsTrigger>
                {pet.medical_info && (
                  <TabsTrigger value="medical" className="data-[state=active]:text-adopt-purple-700">
                    Info Médica
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="about" className="bg-white rounded-xl p-6 shadow-sm border border-adopt-purple-100/80">
                <h2 className="text-xl font-semibold text-adopt-gray-900 mb-4">Acerca de {pet.name}</h2>
                <p className="text-adopt-gray-600 leading-relaxed">
                  {pet.description || `${pet.name} es una adorable mascota en busca de un hogar cariñoso. Aunque no tenemos una descripción detallada, sabemos que tiene mucho amor para dar y está esperando encontrar una familia que le brinde el cuidado y la atención que merece.`}
                </p>
              </TabsContent>
              
              <TabsContent value="characteristics" className="bg-white rounded-xl p-6 shadow-sm border border-adopt-purple-100/80">
                <h2 className="text-xl font-semibold text-adopt-gray-900 mb-4">Características</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {characteristics.map((trait) => (
                    <div key={trait.name} className="flex items-center p-3 rounded-lg border border-adopt-gray-100">
                      {trait.value ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-3" />
                      )}
                      <span className="text-adopt-gray-700">{trait.name}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {pet.medical_info && (
                <TabsContent value="medical" className="bg-white rounded-xl p-6 shadow-sm border border-adopt-purple-100/80">
                  <div className="flex items-center mb-4">
                    <Info className="h-5 w-5 text-adopt-purple-600 mr-2" />
                    <h2 className="text-xl font-semibold text-adopt-gray-900">Información Médica</h2>
                  </div>
                  <p className="text-adopt-gray-600 leading-relaxed">
                    {pet.medical_info}
                  </p>
                </TabsContent>
              )}
            </Tabs>
            
            {/* Additional Images */}
            {pet.images && pet.images.length > 0 && (
              <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-adopt-purple-100/80">
                <h2 className="text-xl font-semibold text-adopt-gray-900 mb-4">Galería de fotos</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pet.images.map((image: any) => (
                    <div key={image.id} className="relative h-48 rounded-lg overflow-hidden group">
                      <Image
                        src={image.image_url || '/images/pet-placeholder.jpg'}
                        alt={pet.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-adopt-purple-100/80">
              <h2 className="text-xl font-semibold text-adopt-gray-900 mb-4">Proceso de adopción</h2>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-adopt-purple-100 text-adopt-purple-700 flex items-center justify-center font-semibold mr-3">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-adopt-gray-800">Solicitud</h3>
                    <p className="text-sm text-adopt-gray-600">Completa el formulario de adopción con tus datos</p>
                  </div>
                </li>
                <Separator className="bg-adopt-purple-100" />
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-adopt-purple-100 text-adopt-purple-700 flex items-center justify-center font-semibold mr-3">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-adopt-gray-800">Revisión</h3>
                    <p className="text-sm text-adopt-gray-600">Revisaremos tu solicitud y nos pondremos en contacto</p>
                  </div>
                </li>
                <Separator className="bg-adopt-purple-100" />
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-adopt-purple-100 text-adopt-purple-700 flex items-center justify-center font-semibold mr-3">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-adopt-gray-800">Visita</h3>
                    <p className="text-sm text-adopt-gray-600">Concierta una visita para conocer a {pet.name}</p>
                  </div>
                </li>
                <Separator className="bg-adopt-purple-100" />
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-adopt-purple-100 text-adopt-purple-700 flex items-center justify-center font-semibold mr-3">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium text-adopt-gray-800">Adopción</h3>
                    <p className="text-sm text-adopt-gray-600">¡Lleva a tu nueva mascota a casa!</p>
                  </div>
                </li>
              </ol>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-adopt-purple-100/80">
              <h2 className="text-xl font-semibold text-adopt-gray-900 mb-4">¿Necesitas ayuda?</h2>
              <p className="text-adopt-gray-600 text-sm mb-4">
                Si tienes preguntas sobre {pet.name} o el proceso de adopción, no dudes en contactarnos.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/contact">
                  <MapPin className="mr-2 h-4 w-4" />
                  Contactar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

