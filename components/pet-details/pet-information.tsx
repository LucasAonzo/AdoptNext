'use client';

import { motion } from 'framer-motion';
import { 
  CalendarDays, 
  Ruler, 
  User, 
  MapPin, 
  Activity,
  Heart, 
  CheckCircle2, 
  XCircle,
  PawPrint,
  Info,
  Clock
} from 'lucide-react';
import { Pet, PetCategory } from '@/types/database';

// Define PetWithCategory with nullish properties to handle undefined values
interface PetWithCategory extends Omit<Pet, 'pet_categories'> {
  pet_categories: PetCategory;
  // Add optional properties that might exist on Pet
  location?: string | null;
  activity_level?: string | null;
  is_vaccinated: boolean;
  is_sterilized: boolean;
  is_good_with_children: boolean;
  good_with_other_animals: boolean;
  is_house_trained: boolean;
  special_needs: boolean;
  special_needs_description?: string | null;
  background_story?: string | null;
  adoption_requirements?: string | null;
}

interface PetInformationProps {
  pet: PetWithCategory;
}

export default function PetInformation({ pet }: PetInformationProps) {
  const getAgeText = (age: string | null) => {
    if (!age) return 'Edad desconocida';
    
    if (age === 'Young') return 'Joven';
    if (age === 'Adult') return 'Adulto';
    if (age === 'Senior') return 'Adulto mayor';
    if (age === 'Baby') return 'Cachorro';
    
    return age;
  };
  
  const getSizeText = (size: string | null | undefined) => {
    if (!size) return 'Tamaño desconocido';
    
    if (size === 'Small') return 'Pequeño';
    if (size === 'Medium') return 'Mediano';
    if (size === 'Large') return 'Grande';
    if (size === 'Extra Large') return 'Muy grande';
    
    return size;
  };
  
  const getGenderText = (gender: string | null) => {
    if (!gender) return 'Género desconocido';
    
    if (gender === 'Male') return 'Macho';
    if (gender === 'Female') return 'Hembra';
    
    return gender;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Pet name and category header with gradient background */}
      <div className="bg-gradient-to-r from-adopt-purple-600/90 to-adopt-purple-800/90 p-6 text-white">
        <h1 className="text-3xl font-bold">{pet.name}</h1>
        <div className="flex items-center mt-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
            {pet.pet_categories?.name || 'Sin categoría'}
          </span>
          {pet.breed && (
            <span className="ml-2 text-white/80">
              {pet.breed}
            </span>
          )}
        </div>
      </div>
      
      {/* Quick info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-adopt-gray-100">
        <div className="flex flex-col items-center justify-center py-5 px-3 border-r border-b md:border-b-0 border-adopt-gray-100">
          <CalendarDays className="h-6 w-6 text-adopt-purple-600 mb-1" />
          <span className="text-sm text-adopt-gray-500">Edad</span>
          <span className="font-medium text-adopt-gray-900">{getAgeText(pet.age)}</span>
        </div>
        
        <div className="flex flex-col items-center justify-center py-5 px-3 border-b md:border-b-0 md:border-r border-adopt-gray-100">
          <Ruler className="h-6 w-6 text-adopt-purple-600 mb-1" />
          <span className="text-sm text-adopt-gray-500">Tamaño</span>
          <span className="font-medium text-adopt-gray-900">{getSizeText(pet.size)}</span>
        </div>
        
        <div className="flex flex-col items-center justify-center py-5 px-3 border-r border-adopt-gray-100">
          <User className="h-6 w-6 text-adopt-purple-600 mb-1" />
          <span className="text-sm text-adopt-gray-500">Género</span>
          <span className="font-medium text-adopt-gray-900">{getGenderText(pet.gender)}</span>
        </div>
        
        <div className="flex flex-col items-center justify-center py-5 px-3">
          <MapPin className="h-6 w-6 text-adopt-purple-600 mb-1" />
          <span className="text-sm text-adopt-gray-500">Ubicación</span>
          <span className="font-medium text-adopt-gray-900">{pet.location || 'No especificada'}</span>
        </div>
      </div>
      
      {/* Main content - scrollable sections */}
      <div className="p-6 space-y-10">
        {/* Overview section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-adopt-gray-900 flex items-center mb-4">
                <Info className="mr-2 h-5 w-5 text-adopt-purple-600" />
                Sobre {pet.name}
              </h2>
              <p className="text-lg text-adopt-gray-700 leading-relaxed">
                {pet.description}
              </p>
              
              {/* Activity level */}
              {pet.activity_level && (
                <div className="mt-6 bg-adopt-purple-50 rounded-lg p-4 flex items-start">
                  <Activity className="mr-3 mt-1 h-5 w-5 text-adopt-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-adopt-gray-900">Nivel de actividad</h3>
                    <p className="text-adopt-gray-700">{pet.activity_level}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </section>
        
        {/* Characteristics section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-adopt-gray-900 flex items-center mb-4">
              <PawPrint className="mr-2 h-5 w-5 text-adopt-purple-600" />
              Características
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CharacteristicItem 
                label="Vacunado" 
                value={pet.is_vaccinated}
                icon={<CheckCircle2 className="h-5 w-5 text-adopt-purple-600" />}
              />
              
              <CharacteristicItem 
                label="Esterilizado" 
                value={pet.is_sterilized}
                icon={<CheckCircle2 className="h-5 w-5 text-adopt-purple-600" />}
              />
              
              <CharacteristicItem 
                label="Se lleva bien con niños" 
                value={pet.is_good_with_children}
                icon={<Heart className="h-5 w-5 text-adopt-purple-600" />}
              />
              
              <CharacteristicItem 
                label="Se lleva bien con otros animales" 
                value={pet.good_with_other_animals}
                icon={<Heart className="h-5 w-5 text-adopt-purple-600" />}
              />
              
              <CharacteristicItem 
                label="Entrenado para casa" 
                value={pet.is_house_trained}
                icon={<CheckCircle2 className="h-5 w-5 text-adopt-purple-600" />}
              />
              
              <CharacteristicItem 
                label="Necesidades especiales" 
                value={pet.special_needs} 
                icon={<Info className="h-5 w-5 text-adopt-purple-600" />}
              />
            </div>
            
            {/* Special needs details */}
            {pet.special_needs && pet.special_needs_description && (
              <div className="mt-6 bg-amber-50 border border-amber-100 rounded-lg p-4">
                <h3 className="text-lg font-medium text-amber-800">Detalles de necesidades especiales</h3>
                <p className="text-amber-700 mt-2">{pet.special_needs_description}</p>
              </div>
            )}
          </motion.div>
        </section>
        
        {/* History section */}
        {pet.background_story && (
          <section>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-adopt-gray-900 flex items-center mb-4">
                <Clock className="mr-2 h-5 w-5 text-adopt-purple-600" />
                Historia
              </h2>
              <div className="bg-adopt-gray-50 rounded-lg p-5 border border-adopt-gray-100">
                <p className="text-adopt-gray-700 italic leading-relaxed">
                  {pet.background_story || 'No hay información disponible sobre la historia de esta mascota.'}
                </p>
              </div>
            </motion.div>
          </section>
        )}
        
        {/* Requirements section */}
        {pet.adoption_requirements && (
          <section>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-adopt-gray-900 flex items-center mb-4">
                <Heart className="mr-2 h-5 w-5 text-adopt-purple-600" />
                Requisitos para adoptar
              </h2>
              <div className="bg-adopt-purple-50 rounded-lg p-5 border border-adopt-purple-100">
                <p className="text-adopt-gray-700 leading-relaxed">
                  {pet.adoption_requirements || 'Para conocer los requisitos específicos, por favor contacta con el refugio.'}
                </p>
              </div>
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
}

// Helper component for characteristic items
function CharacteristicItem({ 
  label, 
  value, 
  icon 
}: { 
  label: string, 
  value: boolean, 
  icon: React.ReactNode 
}) {
  return (
    <div className={`flex items-center p-4 rounded-lg ${value ? 'bg-green-50' : 'bg-gray-50'}`}>
      {value ? (
        <div className="flex-shrink-0 mr-3 rounded-full p-2 bg-green-100">
          {icon}
        </div>
      ) : (
        <div className="flex-shrink-0 mr-3 rounded-full p-2 bg-gray-200">
          <XCircle className="h-5 w-5 text-gray-500" />
        </div>
      )}
      <div>
        <h4 className="text-sm font-medium text-adopt-gray-900">{label}</h4>
        <p className={`text-sm ${value ? 'text-green-700' : 'text-gray-500'}`}>
          {value ? 'Sí' : 'No'}
        </p>
      </div>
    </div>
  );
} 