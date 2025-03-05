import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdoptionApplication, Pet } from "@/types/database";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis Solicitudes de Adopción | AdoptMe",
  description: "Revisa el estado de tus solicitudes de adopción.",
};

export const revalidate = 0; // Dynamic route - do not cache

async function getApplications() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/auth/signin?redirect=/profile/applications");
  }
  
  // Get all user's applications with pet details
  const { data: applications, error } = await supabase
    .from("adoption_applications")
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
    console.error("Error fetching applications:", error);
    return [];
  }
  
  return applications || [];
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Approved":
      return "bg-green-100 text-green-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    case "In Review":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export default async function ApplicationsPage() {
  const applications = await getApplications();
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-adopt-gray-900 mb-8">Mis Solicitudes de Adopción</h1>
      
      {applications.length === 0 ? (
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-adopt-gray-900 mb-2">No tienes solicitudes de adopción</h2>
          <p className="text-adopt-gray-600 mb-6">
            Aún no has realizado ninguna solicitud para adoptar una mascota. 
            Explora nuestro catálogo de mascotas disponibles y encuentra a tu compañero ideal.
          </p>
          <Button variant="primary" size="lg-pill" asChild>
            <Link href="/pets">
              Explorar mascotas disponibles
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application: AdoptionApplication & { pets: Pet & { pet_categories: any } }) => (
            <div key={application.id} className="bg-white rounded-xl border border-adopt-purple-100 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-4">
                {/* Pet Image and Basic Info */}
                <div className="md:col-span-1 relative">
                  <div className="relative h-48 md:h-full w-full">
                    <Image
                      src={application.pets.main_image_url || '/images/pet-placeholder.jpg'}
                      alt={application.pets.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 text-sm font-medium text-adopt-purple-700 shadow-sm">
                      {application.pets.pet_categories?.name || 'Mascota'}
                    </div>
                  </div>
                </div>
                
                {/* Application Details */}
                <div className="md:col-span-3 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-adopt-gray-900">
                        {application.pets.name}
                      </h2>
                      <p className="text-adopt-gray-600">
                        {application.pets.breed || 'Mascota en adopción'}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium mt-2 md:mt-0 inline-block ${getStatusBadgeClass(application.status)}`}>
                      {application.status === 'Pending' ? 'Pendiente' :
                       application.status === 'Approved' ? 'Aprobada' :
                       application.status === 'Rejected' ? 'Rechazada' :
                       application.status === 'In Review' ? 'En revisión' : application.status}
                    </div>
                  </div>
                  
                  <div className="border-t border-adopt-gray-100 pt-4 mb-4">
                    <p className="text-sm text-adopt-gray-500 mb-2">
                      Solicitud enviada el {formatDate(application.created_at)}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                      <div>
                        <span className="text-adopt-gray-600 text-sm">Nombre:</span>
                        <span className="ml-2 font-medium">{application.first_name} {application.last_name}</span>
                      </div>
                      <div>
                        <span className="text-adopt-gray-600 text-sm">Email:</span>
                        <span className="ml-2 font-medium">{application.email}</span>
                      </div>
                      <div>
                        <span className="text-adopt-gray-600 text-sm">Teléfono:</span>
                        <span className="ml-2 font-medium">{application.phone}</span>
                      </div>
                      <div>
                        <span className="text-adopt-gray-600 text-sm">Ubicación:</span>
                        <span className="ml-2 font-medium">{application.city}, {application.state}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status specific information */}
                  {application.status === 'Pending' && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-4">
                      <p className="text-yellow-800">
                        Tu solicitud está siendo procesada. Te contactaremos pronto para los siguientes pasos.
                      </p>
                    </div>
                  )}
                  
                  {application.status === 'In Review' && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                      <p className="text-blue-800">
                        Tu solicitud está siendo revisada. Nos pondremos en contacto contigo para programar una entrevista.
                      </p>
                    </div>
                  )}
                  
                  {application.status === 'Approved' && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
                      <p className="text-green-800">
                        ¡Tu solicitud ha sido aprobada! Por favor contacta con el refugio para coordinar la adopción.
                      </p>
                    </div>
                  )}
                  
                  {application.status === 'Rejected' && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                      <p className="text-red-800">
                        Lo sentimos, tu solicitud no ha sido aprobada. Puedes contactar al refugio para más información.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="primary" size="sm-pill" asChild>
                      <Link href={`/pets/${application.pet_id}`}>
                        Ver perfil de la mascota
                      </Link>
                    </Button>
                    {(application.status === 'Pending' || application.status === 'In Review') && (
                      <Button variant="outline" size="sm-pill">
                        Cancelar solicitud
                      </Button>
                    )}
                    {application.status === 'Approved' && (
                      <Button variant="outline" size="sm-pill">
                        Contactar al refugio
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}