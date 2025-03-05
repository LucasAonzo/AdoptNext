'use client';

import Link from "next/link";
import Image from "next/image";
import { Pet, PetCategory } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PawPrint, Heart, Clock, Star, CheckCircle, MapPin, Calendar } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui/button';

// Define a type that correctly handles pet_categories
export interface PetWithCategory extends Omit<Pet, 'pet_categories'> {
  pet_categories: PetCategory;
}

interface FilteredPetsListProps {
  pets: PetWithCategory[];
  totalCount: number;
}

export default function FilteredPetsList({ pets, totalCount }: FilteredPetsListProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(petId => petId !== id) 
        : [...prev, id]
    );
  };
  
  const getCategoryEmoji = (category: string): string => {
    switch(category) {
      case 'Perros': return '🐕';
      case 'Gatos': return '🐈';
      case 'Aves': return '🦜';
      case 'Reptiles': return '🦎';
      case 'Pequeños mamíferos': return '🐹';
      case 'Otros': return '🐾';
      default: return '🐾';
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Results count */}
      <div className="text-sm text-adopt-gray-600">
        Mostrando <span className="font-medium">{pets.length}</span> de <span className="font-medium">{totalCount}</span> mascotas
      </div>
      
      {/* Pet cards grid */}
      {pets.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {pets.map((pet) => {
            // Replace "Pequeños mamíferos" with "Otros" and handle null categories
            const categoryName = pet.pet_categories?.name === "Pequeños mamíferos" 
              ? "Otros" 
              : pet.pet_categories?.name || "Otros";
              
            return (
              <motion.div 
                key={pet.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-adopt-gray-100 flex flex-col h-full"
              >
                {/* Favorite button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(pet.id);
                  }}
                  className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white transition-colors"
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      favorites.includes(pet.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-adopt-gray-400 group-hover:text-adopt-gray-600'
                    } transition-colors`} 
                  />
                </button>
                
                {/* Image container with fixed height */}
                <div className="relative w-full h-48 overflow-hidden">
                  <Link href={`/pets/${pet.id}`}>
                    <Image
                      src={pet.main_image_url || '/images/pet-placeholder.jpg'}
                      alt={pet.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </Link>
                  
                  {/* Category badge */}
                  <div className="absolute bottom-3 left-3">
                    <Badge 
                      className="bg-adopt-purple-600/90 hover:bg-adopt-purple-700 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm"
                    >
                      <span className="text-sm">{getCategoryEmoji(categoryName)}</span>
                      <span className="hidden sm:inline">{categoryName}</span>
                    </Badge>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex flex-col flex-grow p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Link href={`/pets/${pet.id}`} className="hover:underline">
                      <h3 className="font-semibold text-lg text-adopt-gray-800 line-clamp-1">{pet.name}</h3>
                    </Link>
                    <Badge 
                      variant="outline" 
                      className={`
                        ml-2 px-2 py-0.5 text-xs font-medium rounded-full
                        ${pet.gender === 'Male' 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'bg-pink-50 text-pink-700 border-pink-200'
                        }
                      `}
                    >
                      {pet.gender === 'Male' ? 'Macho' : 'Hembra'}
                    </Badge>
                  </div>
                  
                  {/* Location and age */}
                  <div className="flex flex-col gap-1 mb-3 text-sm text-adopt-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1.5 text-adopt-gray-400" />
                      <span className="line-clamp-1">Madrid</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-adopt-gray-400" />
                      <span>{pet.age || '2 años'}</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-adopt-gray-600 mb-4 line-clamp-2 flex-grow">
                    {pet.description || 'Esta adorable mascota está esperando un hogar. ¡Conócela y enamórate de su personalidad única!'}
                  </p>
                  
                  {/* Footer */}
                  <div className="mt-auto pt-3 border-t border-adopt-gray-100">
                    <Link href={`/pets/${pet.id}`} className="w-full">
                      <Button 
                        variant="default" 
                        className="w-full bg-adopt-purple-600 hover:bg-adopt-purple-700 text-white"
                      >
                        Conocer más
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="bg-adopt-purple-50 p-6 rounded-full mb-4">
            <PawPrint className="h-12 w-12 text-adopt-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-adopt-gray-800 mb-2">No se encontraron mascotas</h3>
          <p className="text-adopt-gray-600 max-w-md">
            No hay mascotas que coincidan con tus filtros. Intenta ajustar los criterios de búsqueda para ver más resultados.
          </p>
          <Button 
            variant="outline" 
            className="mt-6 border-adopt-purple-200 text-adopt-purple-700 hover:bg-adopt-purple-50"
            onClick={() => window.location.href = '/pets'}
          >
            Ver todas las mascotas
          </Button>
        </div>
      )}
    </div>
  );
} 