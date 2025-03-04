import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function AdoptionBanner() {
  return (
    <section className="py-20 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-adopt-purple-50 to-white z-0"></div>
      <div className="absolute inset-0 opacity-10 bg-[url('/paw-pattern.svg')] bg-repeat bg-center z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-adopt-purple-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-adopt-teal-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="p-8 lg:p-12">
              <span className="inline-block bg-adopt-purple-100 px-4 py-2 rounded-full text-adopt-purple-700 font-medium mb-6 shadow-sm">
                Simple y Efectivo
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-adopt-gray-900">
                Nuestro Proceso de <span className="text-adopt-purple-600">Adopción</span>
              </h2>
              <p className="text-adopt-gray-600 mb-10 text-lg leading-relaxed">
                Tenemos un proceso de adopción simple de 3 pasos diseñado para encontrarte la mascota perfecta. Nuestro objetivo es asegurar que tanto tú como tu nuevo compañero tengan una transición perfecta a su hogar para siempre.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-adopt-purple-50 rounded-2xl p-6 transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="w-14 h-14 bg-adopt-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-4 shadow-md">
                    1
                  </div>
                  <h3 className="font-bold text-adopt-gray-900 text-lg mb-2">Encuentra una Mascota</h3>
                  <p className="text-adopt-gray-600">Explora nuestras mascotas disponibles y encuentra tu compañero perfecto</p>
                </div>
                
                <div className="bg-adopt-teal-50 rounded-2xl p-6 transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="w-14 h-14 bg-adopt-teal-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-4 shadow-md">
                    2
                  </div>
                  <h3 className="font-bold text-adopt-gray-900 text-lg mb-2">Solicita</h3>
                  <p className="text-adopt-gray-600">Completa nuestro formulario de adopción y reúnete con un asesor</p>
                </div>
                
                <div className="bg-adopt-amber-50 rounded-2xl p-6 transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="w-14 h-14 bg-adopt-amber-500 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-4 shadow-md">
                    3
                  </div>
                  <h3 className="font-bold text-adopt-gray-900 text-lg mb-2">Bienvenido a Casa</h3>
                  <p className="text-adopt-gray-600">Lleva a tu nuevo amigo a casa y recibe nuestro apoyo continuo</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary"
                  size="lg-pill"
                  className="shadow-purple transition-all hover:-translate-y-1"
                  asChild
                >
                  <Link href="/adoption-process" className="inline-flex items-center justify-center gap-2 text-base px-8 py-3">
                    <span>Iniciar Proceso de Adopción</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-y-[1px]">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  size="lg-pill"
                  className="bg-white/90 transition-all hover:-translate-y-1"
                  asChild
                >
                  <Link href="/faqs" className="inline-flex items-center justify-center gap-2 text-base px-8 py-3">
                    <span>Preguntas Frecuentes</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-y-[1px]">
                      <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative h-[500px] md:h-full">
              <Image 
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop" 
                alt="Persona adoptando un perro de un refugio" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-adopt-purple-900/70 to-transparent flex flex-col justify-end p-8">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-md transform transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                          <div className="w-full h-full bg-adopt-purple-200"></div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs bg-adopt-purple-100 px-2 py-1 rounded-full text-adopt-purple-700">
                      Testimonios
                    </div>
                  </div>
                  <p className="text-adopt-gray-700 italic mb-3">"El proceso de adopción fue muy sencillo y el equipo fue increíblemente útil. ¡Estamos muy felices con nuestro nuevo miembro de la familia!"</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-adopt-gray-900">Sara y Max</p>
                    <div className="flex text-adopt-amber-500">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-white">
                  <p className="text-lg font-medium">Innumerables vidas salvadas</p>
                  <p className="text-sm opacity-90">Más de 2,000 mascotas encontraron su hogar para siempre el año pasado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

