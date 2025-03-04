import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solicitud Enviada | AdoptMe",
  description: "Tu solicitud de adopción ha sido enviada correctamente.",
};

export default function ConfirmationPage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-8">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="40" 
            height="40" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-green-600"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-adopt-gray-900 mb-4">¡Solicitud enviada con éxito!</h1>
        
        <div className="bg-white rounded-xl p-8 border border-adopt-purple-100 mb-8">
          <p className="text-lg text-adopt-gray-700 mb-6">
            Gracias por tu interés en adoptar una mascota. Hemos recibido tu solicitud y la revisaremos lo antes posible.
          </p>
          <p className="text-adopt-gray-600 mb-6">
            Nuestro equipo evaluará tu solicitud y se pondrá en contacto contigo en un plazo de 48 a 72 horas para informarte sobre los siguientes pasos en el proceso de adopción.
          </p>
          <div className="border-t border-adopt-gray-100 pt-6 mt-6">
            <h2 className="text-xl font-semibold text-adopt-gray-900 mb-4">Próximos pasos</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-adopt-purple-100 flex items-center justify-center text-adopt-purple-700 font-semibold mt-0.5 mr-3">
                  1
                </div>
                <p className="text-adopt-gray-600">Verificaremos tu información y evaluaremos tu compatibilidad con la mascota.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-adopt-purple-100 flex items-center justify-center text-adopt-purple-700 font-semibold mt-0.5 mr-3">
                  2
                </div>
                <p className="text-adopt-gray-600">Te contactaremos para programar una entrevista virtual o presencial.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-adopt-purple-100 flex items-center justify-center text-adopt-purple-700 font-semibold mt-0.5 mr-3">
                  3
                </div>
                <p className="text-adopt-gray-600">Si todo va bien, coordinaremos una visita para que conozcas a la mascota.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-adopt-purple-100 flex items-center justify-center text-adopt-purple-700 font-semibold mt-0.5 mr-3">
                  4
                </div>
                <p className="text-adopt-gray-600">Finalizaremos el proceso de adopción y te ayudaremos con la transición.</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg-pill" asChild>
            <Link href="/profile/applications">
              Ver mis solicitudes
            </Link>
          </Button>
          <Button variant="outline" size="lg-pill" asChild>
            <Link href="/pets">
              Explorar más mascotas
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 