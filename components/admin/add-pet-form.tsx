'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { PetCategory } from '@/types/database';

interface AddPetFormProps {
  categories: PetCategory[];
}

export default function AddPetForm({ categories }: AddPetFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    breed: '',
    age: '',
    gender: '',
    color: '',
    size: '',
    weight: '',
    description: '',
    medical_info: '',
    is_vaccinated: false,
    is_neutered: false,
    is_house_trained: false,
    is_good_with_children: false,
    is_good_with_other_pets: false,
    main_image_url: '',
    status: 'Available',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '' || !isNaN(Number(value))) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const supabase = createClient();

      // Submit pet data
      const { data: pet, error } = await supabase.from('pets').insert({
        name: formData.name,
        category_id: formData.category_id,
        breed: formData.breed || null,
        age: formData.age,
        gender: formData.gender,
        color: formData.color || null,
        size: formData.size || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        description: formData.description || null,
        medical_info: formData.medical_info || null,
        is_vaccinated: formData.is_vaccinated,
        is_neutered: formData.is_neutered,
        is_house_trained: formData.is_house_trained,
        is_good_with_children: formData.is_good_with_children,
        is_good_with_other_pets: formData.is_good_with_other_pets,
        main_image_url: formData.main_image_url || null,
        status: formData.status,
      }).select('id').single();

      if (error) throw error;

      toast({
        title: "Mascota añadida",
        description: "La mascota se ha añadido correctamente al sistema.",
        variant: "default",
      });

      // Redirect to pet list or pet detail page
      router.push('/admin/pets');

    } catch (error) {
      console.error('Error submitting pet data:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al añadir la mascota. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-adopt-purple-100 p-6">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-adopt-gray-900">Información Básica</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Nombre de la mascota"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="category_id">Categoría *</Label>
            <Select
              onValueChange={(value) => handleSelectChange('category_id', value)}
              value={formData.category_id}
              required
            >
              <SelectTrigger id="category_id" className="w-full mt-1">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="breed">Raza</Label>
            <Input
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder="Raza de la mascota"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="age">Edad *</Label>
            <Input
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              placeholder="Ej: 2 años, 5 meses"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="gender">Género *</Label>
            <Select
              onValueChange={(value) => handleSelectChange('gender', value)}
              value={formData.gender}
              required
            >
              <SelectTrigger id="gender" className="w-full mt-1">
                <SelectValue placeholder="Selecciona el género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Macho</SelectItem>
                <SelectItem value="Female">Hembra</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Color de la mascota"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="size">Tamaño</Label>
            <Select
              onValueChange={(value) => handleSelectChange('size', value)}
              value={formData.size}
            >
              <SelectTrigger id="size" className="w-full mt-1">
                <SelectValue placeholder="Selecciona el tamaño" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Small">Pequeño</SelectItem>
                <SelectItem value="Medium">Mediano</SelectItem>
                <SelectItem value="Large">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              name="weight"
              type="text"
              value={formData.weight}
              onChange={handleNumberChange}
              placeholder="Peso en kg"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe la personalidad y características de la mascota"
            className="mt-1"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="medical_info">Información Médica</Label>
          <Textarea
            id="medical_info"
            name="medical_info"
            value={formData.medical_info}
            onChange={handleChange}
            placeholder="Cualquier información médica relevante"
            className="mt-1"
            rows={3}
          />
        </div>

        <div className="border-t border-adopt-gray-100 pt-6">
          <h2 className="text-xl font-semibold text-adopt-gray-900 mb-4">Características</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is_vaccinated" 
                checked={formData.is_vaccinated}
                onCheckedChange={(checked) => handleCheckboxChange('is_vaccinated', checked as boolean)}
              />
              <Label htmlFor="is_vaccinated" className="cursor-pointer">Vacunado</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is_neutered" 
                checked={formData.is_neutered}
                onCheckedChange={(checked) => handleCheckboxChange('is_neutered', checked as boolean)}
              />
              <Label htmlFor="is_neutered" className="cursor-pointer">Esterilizado</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is_house_trained" 
                checked={formData.is_house_trained}
                onCheckedChange={(checked) => handleCheckboxChange('is_house_trained', checked as boolean)}
              />
              <Label htmlFor="is_house_trained" className="cursor-pointer">Adiestrado</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is_good_with_children" 
                checked={formData.is_good_with_children}
                onCheckedChange={(checked) => handleCheckboxChange('is_good_with_children', checked as boolean)}
              />
              <Label htmlFor="is_good_with_children" className="cursor-pointer">Bueno con niños</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is_good_with_other_pets" 
                checked={formData.is_good_with_other_pets}
                onCheckedChange={(checked) => handleCheckboxChange('is_good_with_other_pets', checked as boolean)}
              />
              <Label htmlFor="is_good_with_other_pets" className="cursor-pointer">Bueno con otras mascotas</Label>
            </div>
          </div>
        </div>

        <div className="border-t border-adopt-gray-100 pt-6">
          <h2 className="text-xl font-semibold text-adopt-gray-900 mb-4">Imagen y Estado</h2>
          
          <div className="mb-4">
            <Label htmlFor="main_image_url">URL de Imagen Principal</Label>
            <Input
              id="main_image_url"
              name="main_image_url"
              value={formData.main_image_url}
              onChange={handleChange}
              placeholder="URL de la imagen principal"
              className="mt-1"
            />
            <p className="text-xs text-adopt-gray-500 mt-1">
              Introduce la URL de la imagen. Podrás subir más imágenes después de crear la mascota.
            </p>
          </div>

          <div className="mb-4">
            <Label htmlFor="status">Estado *</Label>
            <Select
              onValueChange={(value) => handleSelectChange('status', value)}
              value={formData.status}
              required
            >
              <SelectTrigger id="status" className="w-full mt-1">
                <SelectValue placeholder="Selecciona el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Disponible</SelectItem>
                <SelectItem value="Processing">En Proceso</SelectItem>
                <SelectItem value="Adopted">Adoptado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t border-adopt-gray-100 pt-6 mt-6 flex justify-end">
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Mascota'}
          </Button>
        </div>
      </div>
    </form>
  );
} 