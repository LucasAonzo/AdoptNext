'use client';

import { useState } from 'react';
import { Heart, Share2, AlertCircle, BellRing, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Pet, PetCategory } from '@/types/database';

// Define PetWithCategory for use in this component
interface PetWithCategory extends Omit<Pet, 'pet_categories'> {
  pet_categories: PetCategory;
}

interface PetActionsProps {
  pet: PetWithCategory;
}

export default function PetActions({ pet }: PetActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [sharePopupOpen, setSharePopupOpen] = useState(false);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement actual favorite functionality with backend
  };
  
  const handleShare = () => {
    setSharePopupOpen(!sharePopupOpen);
  };
  
  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('¡Enlace copiado al portapapeles!');
      setSharePopupOpen(false);
    });
  };
  
  const shareOnSocialMedia = (platform: 'facebook' | 'twitter' | 'whatsapp') => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`¡Conoce a ${pet.name}, una adorable mascota en adopción!`);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
    }
    
    window.open(shareUrl, '_blank');
    setSharePopupOpen(false);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Status indicator */}
      <div className={`px-4 py-2 text-sm font-medium ${
        pet.status === 'Available' 
          ? 'bg-green-100 text-green-800' 
          : pet.status === 'Adopted' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-amber-100 text-amber-800'
      }`}>
        {pet.status === 'Available' 
          ? '✓ Disponible para adopción' 
          : pet.status === 'Adopted' 
            ? '✓ Mascota adoptada' 
            : '⌛ En proceso de adopción'}
      </div>
      
      <div className="p-6">
        {/* Adoption button */}
        {pet.status === 'Available' ? (
          <Link
            href={`/adoption-form?pet_id=${pet.id}`}
            className="w-full bg-adopt-purple-600 hover:bg-adopt-purple-700 text-white font-medium py-3.5 px-6 rounded-lg flex items-center justify-center transition-colors shadow-sm"
          >
            Iniciar proceso de adopción
          </Link>
        ) : (
          <button
            disabled
            className="w-full bg-adopt-gray-400 text-white font-medium py-3.5 px-6 rounded-lg flex items-center justify-center cursor-not-allowed"
          >
            {pet.status === 'Adopted' ? 'Mascota adoptada' : 'En proceso de adopción'}
          </button>
        )}
        
        {/* Alert if adoptable */}
        {pet.status === 'Available' && (
          <div className="mt-4 flex items-start p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm">
            <BellRing className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-amber-800">
              <p className="font-medium">Actúa rápido</p>
              <p>Las mascotas disponibles pueden ser adoptadas en cualquier momento.</p>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex justify-between mt-6 gap-3">
          <button
            onClick={toggleFavorite}
            className={`
              flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg transition-all shadow-sm
              ${isFavorite
                ? 'bg-adopt-pink-600 text-white'
                : 'bg-white text-adopt-gray-700 border border-adopt-gray-200 hover:border-adopt-gray-300'}
            `}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-white' : ''}`} />
            {isFavorite ? 'Guardado' : 'Guardar'}
          </button>
          
          <div className="relative flex-1">
            <button
              onClick={handleShare}
              className="w-full flex items-center justify-center px-4 py-2.5 bg-white text-adopt-gray-700 border border-adopt-gray-200 hover:border-adopt-gray-300 rounded-lg transition-all shadow-sm"
              aria-label="Compartir"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Compartir
            </button>
            
            {/* Share popup */}
            {sharePopupOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 overflow-hidden border border-adopt-gray-200">
                <div className="p-4 border-b border-adopt-gray-200">
                  <h5 className="font-medium text-adopt-gray-900">Compartir mascota</h5>
                  <p className="text-sm text-adopt-gray-600">Comparte a {pet.name} con tus amigos</p>
                </div>
                
                <div className="p-2">
                  <button
                    onClick={copyToClipboard}
                    className="w-full text-left px-3 py-2.5 hover:bg-adopt-gray-50 rounded-md transition-colors flex items-center"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-adopt-purple-100 text-adopt-purple-600 rounded-full mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </span>
                    Copiar enlace
                  </button>
                  
                  <button
                    onClick={() => shareOnSocialMedia('facebook')}
                    className="w-full text-left px-3 py-2.5 hover:bg-adopt-gray-50 rounded-md transition-colors flex items-center"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </span>
                    Facebook
                  </button>
                  
                  <button
                    onClick={() => shareOnSocialMedia('twitter')}
                    className="w-full text-left px-3 py-2.5 hover:bg-adopt-gray-50 rounded-md transition-colors flex items-center"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                      </svg>
                    </span>
                    Twitter
                  </button>
                  
                  <button
                    onClick={() => shareOnSocialMedia('whatsapp')}
                    className="w-full text-left px-3 py-2.5 hover:bg-adopt-gray-50 rounded-md transition-colors flex items-center"
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                      </svg>
                    </span>
                    WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Contact shelter */}
        <div className="mt-6 pt-4 border-t border-adopt-gray-200">
          <a 
            href="/contact" 
            className="flex items-center justify-center text-adopt-purple-700 hover:text-adopt-purple-800 font-medium transition-colors gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Contactar con el refugio
          </a>
        </div>
        
        {/* Report button */}
        <div className="mt-6 pt-4 border-t border-adopt-gray-200">
          <button
            onClick={() => alert('Función de reporte no implementada aún')}
            className="text-adopt-gray-500 hover:text-adopt-gray-700 text-sm flex items-center transition-colors"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Reportar un problema con esta mascota
          </button>
        </div>
      </div>
    </div>
  );
} 