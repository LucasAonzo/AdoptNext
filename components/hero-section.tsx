import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[650px] flex items-center">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-adopt-purple-100/90 to-adopt-purple-50/80 z-0"></div>
      
      {/* Background image */}
      <div className="absolute inset-0 opacity-15 z-0 bg-[url('https://images.unsplash.com/photo-1556139943-4bdca53adf1e?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-adopt-purple-200/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-adopt-teal-200/30 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="max-w-xl">
            <div className="animate-fadeInUp">
              <span className="inline-block bg-adopt-purple-100 backdrop-blur-sm px-4 py-1.5 rounded-full text-adopt-purple-800 font-medium mb-6 shadow-sm">
                Encuentra tu compañero perfecto hoy
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-adopt-gray-900 mb-4">
                Un Amigo Más
                <span className="block text-adopt-purple-600 mt-3">Miles de Alegrías</span>
              </h1>
              <div className="w-20 h-1.5 bg-adopt-amber-400 rounded-full mb-7"></div>
              <p className="text-adopt-gray-600 mb-10 text-lg leading-relaxed max-w-[95%]">
                Tener una mascota significa tener más alegría, un nuevo amigo, una persona feliz que siempre estará contigo para divertirse.
                ¡Tenemos más de 200 mascotas diferentes que pueden satisfacer tus necesidades!
              </p>
              <div className="flex flex-wrap gap-6 items-center">
                <Button 
                  variant="primary" 
                  size="lg-pill" 
                  className="shadow-purple transition-all duration-200 hover:translate-y-[-2px]"
                  asChild
                >
                  <Link href="/pets" className="inline-flex items-center justify-center gap-2 text-base px-8 py-3">
                    <span>Ver Mascotas</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-y-[1px]">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg-pill" 
                  className="bg-white/90 hover:bg-adopt-purple-50 transition-all duration-200 hover:translate-y-[-2px]"
                  asChild
                >
                  <Link href="/about" className="inline-flex items-center justify-center gap-2 text-base px-8 py-3">
                    <span>Conocer Más</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-y-[-1px]">
                      <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-12 flex gap-6 items-center p-5 bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm">
                <div className="flex -space-x-4 rtl:space-x-reverse">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-adopt-purple-200 flex items-center justify-center">
                      <div className="w-full h-full bg-adopt-gray-100"></div>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-adopt-gray-800 font-semibold">+2,500 Personas</p>
                  <p className="text-adopt-gray-600 text-sm">Ya han adoptado</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative mt-10 md:mt-0 animate-fadeIn">
            <div className="relative h-[400px] md:h-[550px] rounded-2xl overflow-hidden shadow-xl group">
              <Image 
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1169&auto=format&fit=crop" 
                alt="Perro feliz con persona" 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-adopt-purple-900/50 via-transparent to-transparent"></div>
              
              {/* Pet details card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow-lg transform transition-transform duration-200 group-hover:translate-y-[-4px]">
                <div className="flex items-center gap-4">
                  <span className="w-14 h-14 rounded-full bg-adopt-purple-100 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 11C17.9853 11 20 8.98528 20 6.5C20 4.01472 17.9853 2 15.5 2C13.0147 2 11 4.01472 11 6.5C11 8.98528 13.0147 11 15.5 11Z" fill="#8B5CF6"/>
                      <path d="M8.5 9C10.433 9 12 7.43333 12 5.5C12 3.56667 10.4333 2 8.5 2C6.56667 2 5 3.56667 5 5.5C5 7.43333 6.56667 9 8.5 9Z" fill="#8B5CF6" fillOpacity="0.7"/>
                      <path d="M15.5 22C17.9853 22 20 19.9853 20 17.5C20 15.0147 17.9853 13 15.5 13C13.0147 13 11 15.0147 11 17.5C11 19.9853 13.0147 22 15.5 22Z" fill="#8B5CF6" fillOpacity="0.4"/>
                      <path d="M8.5 22C10.4333 22 12 20.4333 12 18.5C12 16.5667 10.4333 15 8.5 15C6.56667 15 5 16.5667 5 18.5C5 20.4333 6.56667 22 8.5 22Z" fill="#8B5CF6" fillOpacity="0.9"/>
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-adopt-gray-900">¿Listo para adoptar?</h3>
                    <p className="text-adopt-gray-600">Comienza tu aventura hoy</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative badges */}
            <div className="absolute -bottom-5 -right-8 bg-white p-4 rounded-lg shadow-lg rotate-3 hidden md:block">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-adopt-teal-100 rounded-full flex items-center justify-center text-adopt-teal-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-adopt-gray-500">Revisados por veterinarios</p>
                  <p className="text-sm font-medium text-adopt-gray-800">Mascotas Saludables</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -left-8 bg-white p-4 rounded-lg shadow-lg -rotate-3 hidden md:block">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-adopt-amber-100 rounded-full flex items-center justify-center text-adopt-amber-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-adopt-gray-500">Soporte experto</p>
                  <p className="text-sm font-medium text-adopt-gray-800">Ayuda 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 opacity-20">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,0 C300,90 600,100 1200,30 L1200,100 L0,100 Z" fill="currentColor" className="text-adopt-purple-200"></path>
        </svg>
      </div>
    </section>
  )
}

