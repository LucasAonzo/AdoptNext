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

interface AdoptionFormProps {
  petId: string;
}

export default function AdoptionForm({ petId }: AdoptionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    housing_type: '',
    has_yard: false,
    has_other_pets: false,
    other_pets_details: '',
    has_children: false,
    children_ages: '',
    occupation: '',
    work_hours: '',
    experience: '',
    why_adopt: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    agrees_terms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agrees_terms) {
      toast({
        title: "Error",
        description: "Debes aceptar los términos y condiciones para continuar.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const supabase = createClient();

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Store form data in localStorage for after login
        localStorage.setItem('pendingAdoption', JSON.stringify({
          petId,
          formData
        }));
        router.push('/auth/signin?redirect=/adopt/' + petId);
        return;
      }
      
      // Create adoption application
      const { error } = await supabase.from('adoption_applications').insert({
        pet_id: petId,
        user_id: user.id,
        status: 'Pending',
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        housing_type: formData.housing_type,
        has_yard: formData.has_yard,
        has_other_pets: formData.has_other_pets,
        other_pets_details: formData.other_pets_details,
        has_children: formData.has_children,
        children_ages: formData.children_ages,
        occupation: formData.occupation,
        work_hours: formData.work_hours,
        experience: formData.experience,
        why_adopt: formData.why_adopt,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
      });

      if (error) throw error;

      // Also update the pet status to "Processing"
      await supabase
        .from('pets')
        .update({ status: 'Processing' })
        .eq('id', petId);

      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud de adopción ha sido enviada con éxito. Nos pondremos en contacto contigo pronto.",
      });

      // Redirect to confirmation page
      router.push('/adopt/confirmation');

    } catch (error) {
      console.error('Error submitting adoption application:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu solicitud. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-adopt-purple-100 p-6">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-adopt-gray-900">Información Personal</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="first_name">Nombre *</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              placeholder="Tu nombre"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="last_name">Apellidos *</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              placeholder="Tus apellidos"
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Tu número de teléfono"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Dirección *</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Tu dirección"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="city">Ciudad *</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Ciudad"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="state">Provincia/Estado *</Label>
            <Input
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              placeholder="Provincia"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="zip_code">Código Postal *</Label>
            <Input
              id="zip_code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              required
              placeholder="Código postal"
              className="mt-1"
            />
          </div>
        </div>

        <div className="border-t border-adopt-gray-100 pt-6 mt-6">
          <h2 className="text-xl font-semibold text-adopt-gray-900 mb-4">Información de Vivienda</h2>
          
          <div className="mb-4">
            <Label htmlFor="housing_type">Tipo de Vivienda *</Label>
            <Select
              onValueChange={(value) => handleSelectChange('housing_type', value)}
              value={formData.housing_type}
              required
            >
              <SelectTrigger id="housing_type" className="w-full mt-1">
                <SelectValue placeholder="Selecciona tu tipo de vivienda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">Casa</SelectItem>
                <SelectItem value="apartment">Apartamento</SelectItem>
                <SelectItem value="condo">Condominio</SelectItem>
                <SelectItem value="mobile">Casa Móvil</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <Checkbox 
              id="has_yard" 
              checked={formData.has_yard}
              onCheckedChange={(checked) => handleCheckboxChange('has_yard', checked as boolean)}
            />
            <Label htmlFor="has_yard" className="cursor-pointer">Tengo jardín o patio</Label>
          </div>
        </div>

        <div className="border-t border-adopt-gray-100 pt-6 mt-6">
          <h2 className="text-xl font-semibold text-adopt-gray-900 mb-4">Familia y Mascotas</h2>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox 
                id="has_children" 
                checked={formData.has_children}
                onCheckedChange={(checked) => handleCheckboxChange('has_children', checked as boolean)}
              />
              <Label htmlFor="has_children" className="cursor-pointer">Tengo niños</Label>
            </div>
            
            {formData.has_children && (
              <div className="mt-2 ml-6">
                <Label htmlFor="children_ages">Edades de los niños</Label>
                <Input
                  id="children_ages"
                  name="children_ages"
                  value={formData.children_ages}
                  onChange={handleChange}
                  placeholder="Ej: 3, 7, 12"
                  className="mt-1"
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox 
                id="has_other_pets" 
                checked={formData.has_other_pets}
                onCheckedChange={(checked) => handleCheckboxChange('has_other_pets', checked as boolean)}
              />
              <Label htmlFor="has_other_pets" className="cursor-pointer">Tengo otras mascotas</Label>
            </div>
            
            {formData.has_other_pets && (
              <div className="mt-2 ml-6">
                <Label htmlFor="other_pets_details">Detalles de las mascotas</Label>
                <Textarea
                  id="other_pets_details"
                  name="other_pets_details"
                  value={formData.other_pets_details}
                  onChange={handleChange}
                  placeholder="Tipo, edad y temperamento de tus mascotas actuales"
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-adopt-gray-100 pt-6 mt-6">
          <h2 className="text-xl font-semibold text-adopt-gray-900 mb-4">Ocupación y Experiencia</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <Label htmlFor="occupation">Ocupación *</Label>
              <Input
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
                placeholder="Tu ocupación actual"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="work_hours">Horario Laboral *</Label>
              <Input
                id="work_hours"
                name="work_hours"
                value={formData.work_hours}
                onChange={handleChange}
                required
                placeholder="Ej: 9:00 - 18:00, Lunes a Viernes"
                className="mt-1"
              />
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="experience">Experiencia con Mascotas *</Label>
            <Textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              placeholder="Describe tu experiencia previa con mascotas"
              className="mt-1"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="why_adopt">¿Por qué quieres adoptar esta mascota? *</Label>
            <Textarea
              id="why_adopt"
              name="why_adopt"
              value={formData.why_adopt}
              onChange={handleChange}
              required
              placeholder="Explica por qué quieres adoptar esta mascota en particular"
              className="mt-1"
            />
          </div>
        </div>

        <div className="border-t border-adopt-gray-100 pt-6 mt-6">
          <h2 className="text-xl font-semibold text-adopt-gray-900 mb-4">Contacto de Emergencia</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="emergency_contact_name">Nombre del Contacto *</Label>
              <Input
                id="emergency_contact_name"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
                required
                placeholder="Nombre del contacto de emergencia"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="emergency_contact_phone">Teléfono del Contacto *</Label>
              <Input
                id="emergency_contact_phone"
                name="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={handleChange}
                required
                placeholder="Teléfono del contacto de emergencia"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-adopt-gray-100 pt-6 mt-6">
          <div className="flex items-start space-x-2 mb-6">
            <Checkbox 
              id="agrees_terms" 
              checked={formData.agrees_terms}
              onCheckedChange={(checked) => handleCheckboxChange('agrees_terms', checked as boolean)}
              required
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor="agrees_terms" className="cursor-pointer">
                Acepto los términos y condiciones del proceso de adopción *
              </Label>
              <p className="text-sm text-adopt-gray-500">
                Al marcar esta casilla, confirmas que toda la información proporcionada es verídica y aceptas someterte al proceso de evaluación.
              </p>
            </div>
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando solicitud...' : 'Enviar Solicitud de Adopción'}
          </Button>
          <p className="text-center text-sm text-adopt-gray-500 mt-4">
            * Campos obligatorios
          </p>
        </div>
      </div>
    </form>
  );
} 