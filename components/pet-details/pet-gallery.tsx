'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, X, ChevronLeft, ChevronRight, ExpandIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pet, PetCategory, PetImage } from '@/types/database';

// Define PetWithCategory locally instead of importing from page
interface PetWithCategory extends Omit<Pet, 'pet_categories'> {
  pet_categories: PetCategory;
}

interface PetGalleryProps {
  pet: PetWithCategory;
  images: PetImage[];
}

export default function PetGallery({ pet, images }: PetGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  // Combine main image with other images and ensure we have at least one
  const allImages = images.length > 0 
    ? images 
    : [{ id: 'main', pet_id: pet.id, image_url: pet.main_image_url || '/images/pet-placeholder.jpg', is_main: true, created_at: '' }];
  
  // Set default selected image to main image or first in the array
  const mainImage = allImages.find(img => img.is_main) || allImages[0];
  const mainImageUrl = mainImage?.image_url || pet.main_image_url || '/images/pet-placeholder.jpg';
  
  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setLightboxOpen(true);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setLightboxOpen(false);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };
  
  // Navigate through images in lightbox
  const navigateImage = (direction: 'prev' | 'next') => {
    const currentIndex = allImages.findIndex(img => img.image_url === selectedImage);
    
    if (direction === 'prev') {
      const prevIndex = currentIndex <= 0 ? allImages.length - 1 : currentIndex - 1;
      setSelectedImage(allImages[prevIndex].image_url);
    } else {
      const nextIndex = currentIndex >= allImages.length - 1 ? 0 : currentIndex + 1;
      setSelectedImage(allImages[nextIndex].image_url);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Back button */}
      <div className="mb-4">
        <Link 
          href="/pets" 
          className="inline-flex items-center text-adopt-gray-600 hover:text-adopt-gray-900 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a todas las mascotas
        </Link>
      </div>
      
      {/* Main image container */}
      <div 
        className="relative aspect-[3/2] w-full overflow-hidden rounded-xl shadow-md cursor-pointer group"
        onClick={() => openLightbox(mainImageUrl)}
      >
        <Image
          src={mainImageUrl}
          alt={pet.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        
        {/* Status badge */}
        {pet.status !== 'Available' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-black/70 text-white px-6 py-3 rounded-lg font-bold uppercase text-xl">
              {pet.status === 'Adopted' ? 'Adoptado' : 'En proceso'}
            </div>
          </div>
        )}
        
        {/* Expand overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-2">
            <ExpandIcon className="h-6 w-6 text-adopt-gray-800" />
          </div>
        </div>
      </div>
      
      {/* Thumbnail gallery */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mt-4">
          {allImages.map((image, index) => (
            <div 
              key={image.id || index}
              className={`
                relative aspect-square overflow-hidden rounded-lg cursor-pointer
                border-2 ${image.image_url === selectedImage ? 'border-adopt-purple-600' : 'border-transparent'}
                hover:opacity-90 transition-opacity
              `}
              onClick={() => openLightbox(image.image_url)}
            >
              <Image
                src={image.image_url || '/images/pet-placeholder.jpg'}
                alt={`${pet.name} - Imagen ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 100px"
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 z-50 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full transition-colors"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Navigation buttons */}
            <button 
              className="absolute left-4 z-50 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button 
              className="absolute right-4 z-50 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Image */}
            <div 
              className="relative h-full w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                src={selectedImage || ''}
                alt={pet.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
              {allImages.findIndex(img => img.image_url === selectedImage) + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 