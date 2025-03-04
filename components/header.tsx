"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, User, LogOut, Heart, ChevronDown, LogIn } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    }
    return user?.email ? user.email[0].toUpperCase() : "U"
  }

  return (
    <header className="bg-white border-b border-adopt-purple-100 sticky top-0 z-50 shadow-sm backdrop-blur-lg bg-white/90">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-2xl text-adopt-purple-700 flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 10.5C4.5 8.01472 6.51472 6 9 6C11.4853 6 13.5 8.01472 13.5 10.5C13.5 12.9853 11.4853 15 9 15C6.51472 15 4.5 12.9853 4.5 10.5Z" fill="#8B5CF6"/>
              <path d="M16.5 13.5C16.5 11.0147 18.5147 9 21 9C23.4853 9 25.5 11.0147 25.5 13.5C25.5 15.9853 23.4853 18 21 18C18.5147 18 16.5 15.9853 16.5 13.5Z" fill="#8B5CF6" fillOpacity="0.6"/>
              <path d="M10.5 16.5C10.5 14.0147 12.5147 12 15 12C17.4853 12 19.5 14.0147 19.5 16.5C19.5 18.9853 17.4853 21 15 21C12.5147 21 10.5 18.9853 10.5 16.5Z" fill="#8B5CF6" fillOpacity="0.8"/>
            </svg>
            AdoptMe
          </Link>

          <nav className="hidden md:flex items-center">
            <ul className="flex space-x-0">
              <li>
                <Link 
                  href="/" 
                  className="text-adopt-gray-700 font-medium hover:text-adopt-purple-600 transition-colors px-5 py-2 block border-b-2 border-transparent hover:border-adopt-purple-500"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  href="/pets" 
                  className="text-adopt-gray-700 font-medium hover:text-adopt-purple-600 transition-colors px-5 py-2 block border-b-2 border-transparent hover:border-adopt-purple-500"
                >
                  Mascotas
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-adopt-gray-700 font-medium hover:text-adopt-purple-600 transition-colors px-5 py-2 block border-b-2 border-transparent hover:border-adopt-purple-500"
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link 
                  href="/resources" 
                  className="text-adopt-gray-700 font-medium hover:text-adopt-purple-600 transition-colors px-5 py-2 block border-b-2 border-transparent hover:border-adopt-purple-500"
                >
                  Recursos
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-adopt-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Buscar mascotas..."
              className="pl-10 pr-4 py-2 rounded-full w-[240px] bg-white border-adopt-purple-200 focus-visible:ring-adopt-purple-300 focus-visible:border-adopt-purple-400"
              aria-label="Buscar mascotas"
            />
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1 h-9 rounded-full hover:bg-adopt-purple-50">
                    <Avatar className="h-8 w-8 border border-adopt-purple-200">
                      <AvatarImage src={profile?.avatar_url || ""} alt={`${profile?.first_name || user.email}`} />
                      <AvatarFallback className="bg-adopt-purple-100 text-adopt-purple-700">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 ml-1 text-adopt-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                  <div className="px-3 py-2 text-sm font-medium text-adopt-gray-800 border-b border-adopt-gray-100">
                    {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user.email}
                  </div>
                  <DropdownMenuItem onSelect={() => router.push('/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push('/profile?tab=favorites')} className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Favoritos</span>
                  </DropdownMenuItem>
                  {profile?.is_admin && (
                    <DropdownMenuItem onSelect={() => router.push('/admin')} className="cursor-pointer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-4 w-4"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m12 14 4-4" />
                        <path d="M3.34 19a10 10 0 1 1 17.32 0" />
                      </svg>
                      <span>Administración</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={() => router.push("/pets")}
                variant="primary"
                size="pill"
              >
                Adoptar Ahora
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/auth/sign-in")}
                variant="outline"
                size="pill"
                className="font-medium"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Button>
              <Button
                onClick={() => router.push("/auth/sign-up")}
                variant="primary"
                size="pill"
              >
                Crear Cuenta
              </Button>
            </div>
          )}
        </div>

        <button 
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-adopt-purple-50 text-adopt-purple-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? (
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
            >
              <path d="M18 6L6 18"></path>
              <path d="M6 6L18 18"></path>
            </svg>
          ) : (
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
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white p-6 shadow-lg border-t border-adopt-purple-100 animate-slideDown">
          <nav className="flex flex-col space-y-4 mb-6">
            <Link 
              href="/" 
              className="text-adopt-gray-700 font-medium hover:text-adopt-purple-600 transition-colors p-2 hover:bg-adopt-purple-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              href="/pets" 
              className="text-adopt-gray-700 font-medium hover:text-adopt-purple-600 transition-colors p-2 hover:bg-adopt-purple-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Mascotas
            </Link>
            <Link 
              href="/about" 
              className="text-adopt-gray-700 font-medium hover:text-adopt-purple-600 transition-colors p-2 hover:bg-adopt-purple-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link 
              href="/resources" 
              className="text-adopt-gray-700 font-medium hover:text-adopt-purple-600 transition-colors p-2 hover:bg-adopt-purple-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Recursos
            </Link>
            
            {user && (
              <>
                <Link 
                  href="/profile" 
                  className="text-adopt-gray-700 font-medium hover:text-adopt-purple-600 transition-colors p-2 hover:bg-adopt-purple-50 rounded-lg flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Mi Perfil
                </Link>
                <Link 
                  href="/profile?tab=favorites" 
                  className="text-adopt-gray-700 font-medium hover:text-adopt-purple-600 transition-colors p-2 hover:bg-adopt-purple-50 rounded-lg flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Favoritos
                </Link>
                {profile?.is_admin && (
                  <Link 
                    href="/admin" 
                    className="text-adopt-gray-700 font-medium hover:text-adopt-purple-600 transition-colors p-2 hover:bg-adopt-purple-50 rounded-lg flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m12 14 4-4" />
                      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
                    </svg>
                    Administración
                  </Link>
                )}
              </>
            )}
          </nav>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-adopt-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar mascotas..."
                className="pl-10 pr-4 py-2 rounded-full w-full bg-white border-adopt-purple-200"
                aria-label="Buscar mascotas"
              />
            </div>
            
            {user ? (
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    router.push("/pets");
                    setIsMenuOpen(false);
                  }}
                  variant="primary"
                  className="text-white rounded-full px-6 w-full font-medium h-12"
                >
                  Adoptar Ahora
                </Button>
                <Button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="text-adopt-gray-700 rounded-full px-6 w-full font-medium h-12 border-adopt-gray-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    router.push("/auth/sign-in");
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="border-adopt-purple-300 text-adopt-purple-600 rounded-full px-6 w-full font-medium h-12"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </Button>
                <Button
                  onClick={() => {
                    router.push("/auth/sign-up");
                    setIsMenuOpen(false);
                  }}
                  variant="primary"
                  className="text-white rounded-full px-6 w-full font-medium h-12"
                >
                  Crear Cuenta
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

