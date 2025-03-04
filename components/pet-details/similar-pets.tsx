'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Pet, PetCategory } from '@/types/database';

// Define PetWithCategory for use in this component
interface PetWithCategory extends Omit<Pet, 'pet_categories'> {
  pet_categories: PetCategory;
}

interface SimilarPetsProps {
  currentPetId: string;
  similarPets: PetWithCategory[];
}

export default function SimilarPets({ currentPetId, similarPets }: SimilarPetsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Filter out the current pet if it's in the similar pets list
  const filteredPets = similarPets.filter(pet => pet.id !== currentPetId);
  
  // Adjust visible cards based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const maxIndex = Math.max(0, filteredPets.length - visibleCards);
  
  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };
  
  // If there are no similar pets, don't render the component
  if (filteredPets.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-adopt-gray-900">Mascotas similares</h2>
        
        {filteredPets.length > visibleCards && (
          <div className="flex space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-white border border-adopt-gray-200 text-adopt-gray-600 hover:bg-adopt-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Ver mascotas anteriores"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="p-2 rounded-full bg-white border border-adopt-gray-200 text-adopt-gray-600 hover:bg-adopt-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Ver más mascotas"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      
      <div className="relative overflow-hidden">
        <div 
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
        >
          {filteredPets.map((pet) => (
            <motion.div
              key={pet.id}
              className="flex-none w-full sm:w-1/2 lg:w-1/3 p-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link 
                href={`/pets/${pet.id}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full"
              >
                <div className="relative aspect-video">
                  <Image
                    src={pet.main_image_url || '/images/pet-placeholder.jpg'}
                    alt={pet.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  
                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 text-xs font-medium bg-white/80 backdrop-blur-sm text-adopt-gray-900 rounded-full">
                      {pet.pet_categories?.name || 'Sin categoría'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg text-adopt-gray-900 mb-1">{pet.name}</h3>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {pet.age && (
                      <span className="px-2 py-1 text-xs bg-adopt-purple-50 text-adopt-purple-700 rounded-full">
                        {pet.age === 'Young' ? 'Joven' : 
                         pet.age === 'Adult' ? 'Adulto' : 
                         pet.age === 'Senior' ? 'Adulto mayor' : 
                         pet.age === 'Baby' ? 'Cachorro' : pet.age}
                      </span>
                    )}
                    
                    {pet.gender && (
                      <span className="px-2 py-1 text-xs bg-adopt-purple-50 text-adopt-purple-700 rounded-full">
                        {pet.gender === 'Male' ? 'Macho' : 'Hembra'}
                      </span>
                    )}
                    
                    {pet.size && (
                      <span className="px-2 py-1 text-xs bg-adopt-purple-50 text-adopt-purple-700 rounded-full">
                        {pet.size === 'Small' ? 'Pequeño' : 
                         pet.size === 'Medium' ? 'Mediano' : 
                         pet.size === 'Large' ? 'Grande' : 
                         pet.size === 'Extra Large' ? 'Muy grande' : pet.size}
                      </span>
                    )}
                  </div>
                  
                  {/* Short description */}
                  <p className="text-adopt-gray-600 mt-2 line-clamp-2 text-sm">
                    {pet.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 