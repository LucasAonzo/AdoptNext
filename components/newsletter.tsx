import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="py-24 relative overflow-hidden bg-adopt-purple-900">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 left-1/2 w-40 h-40 bg-adopt-teal-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-adopt-purple-500/20 rounded-full blur-3xl -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-adopt-amber-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        {/* Animated dots pattern */}
        <div className="absolute inset-0">
          <div className="absolute h-1 w-1 bg-adopt-purple-300 rounded-full top-[20%] left-[25%] animate-pulse"></div>
          <div className="absolute h-1.5 w-1.5 bg-adopt-purple-300 rounded-full top-[30%] left-[45%] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute h-1 w-1 bg-adopt-purple-200 rounded-full top-[45%] left-[15%] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute h-2 w-2 bg-adopt-purple-300 rounded-full top-[65%] left-[35%] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute h-1 w-1 bg-adopt-purple-200 rounded-full top-[80%] left-[65%] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute h-1.5 w-1.5 bg-adopt-purple-300 rounded-full top-[25%] left-[85%] animate-pulse" style={{ animationDelay: '0.7s' }}></div>
          <div className="absolute h-1 w-1 bg-adopt-purple-200 rounded-full top-[50%] left-[75%] animate-pulse" style={{ animationDelay: '1.2s' }}></div>
          <div className="absolute h-2 w-2 bg-adopt-purple-300 rounded-full top-[70%] left-[90%] animate-pulse" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block bg-adopt-purple-800/70 backdrop-blur-sm px-5 py-2 rounded-full text-adopt-teal-300 font-medium mb-6 shadow-xl">
              Únete a nuestra comunidad
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Mantente <span className="text-adopt-teal-400">Informado</span>
            </h2>
            <p className="text-adopt-purple-200 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
              Suscríbete a nuestro boletín para recibir actualizaciones sobre nuevas mascotas, eventos especiales de adopción
              y consejos útiles para dueños de mascotas. ¡Únete a nuestra creciente comunidad hoy!
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-3xl mx-auto mb-10 transform transition-all duration-300 hover:shadow-purple/50 hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Input 
                  type="email" 
                  placeholder="Ingresa tu correo electrónico" 
                  className="bg-white/20 border-white/20 text-white placeholder:text-adopt-purple-200 focus-visible:ring-adopt-teal-400 rounded-full py-6 pl-5 pr-4 h-auto text-base"
                  aria-label="Correo para boletín"
                />
              </div>
              <Button className="bg-adopt-teal-500 hover:bg-adopt-teal-600 text-white rounded-full px-8 py-6 font-medium text-base min-w-max shadow-lg hover:shadow-adopt-teal-500/50 transition-all duration-300">
                Suscribirse Ahora
              </Button>
            </div>
            <p className="text-adopt-purple-200 mt-4 text-sm text-center">
              Respetamos tu privacidad. Cancela tu suscripción en cualquier momento.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center transform transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
              <div className="w-16 h-16 mx-auto mb-4 bg-adopt-purple-700 rounded-full flex items-center justify-center shadow-inner">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 9L13.9558 13.5662C13.5299 14.2051 12.5728 14.1455 12.2294 13.4587L11.7706 12.5413C11.4272 11.8545 10.4701 11.7949 10.0442 12.4338L7 17M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-4xl font-bold text-white mb-1">15k+</p>
              <p className="text-adopt-purple-300 font-medium">Suscriptores</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center transform transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
              <div className="w-16 h-16 mx-auto mb-4 bg-adopt-purple-700 rounded-full flex items-center justify-center shadow-inner">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 18V20M12 18V22M8 18V20M3 8H21M7 3H17L21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V8L7 3Z" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-4xl font-bold text-white mb-1">2.5k+</p>
              <p className="text-adopt-purple-300 font-medium">Adopciones</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center transform transition-all duration-300 hover:-translate-y-1 hover:bg-white/10">
              <div className="w-16 h-16 mx-auto mb-4 bg-adopt-purple-700 rounded-full flex items-center justify-center shadow-inner">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 21H21M5 21V7L13 3V21M13 21H21V9M13 9H20.4C20.7314 9 21 8.73137 21 8.4V3.6C21 3.26863 20.7314 3 20.4 3H13.6C13.2686 3 13 3.26863 13 3.6V8.4C13 8.73137 13.2686 9 13.6 9H13Z" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-4xl font-bold text-white mb-1">12+</p>
              <p className="text-adopt-purple-300 font-medium">Refugios</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

