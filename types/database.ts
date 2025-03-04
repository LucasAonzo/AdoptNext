export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  bio?: string;
  avatar_url?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type PetCategory = {
  id: number;
  name: string;
  description?: string;
  icon_url?: string;
  created_at: string;
};

export type Pet = {
  id: string;
  name: string;
  breed?: string;
  category_id: number;
  gender: 'Male' | 'Female';
  age: string;
  weight?: number;
  size?: 'Small' | 'Medium' | 'Large' | 'Extra Large';
  color?: string;
  description?: string;
  medical_info?: string;
  is_vaccinated: boolean;
  is_neutered: boolean;
  is_house_trained: boolean;
  is_good_with_children: boolean;
  is_good_with_other_pets: boolean;
  status: 'Available' | 'Pending' | 'Adopted';
  created_by?: string;
  main_image_url?: string;
  created_at: string;
  updated_at: string;
};

export type PetImage = {
  id: string;
  pet_id: string;
  image_url: string;
  is_main: boolean;
  created_at: string;
};

export type AdoptionApplication = {
  id: string;
  pet_id: string;
  user_id: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  application_data?: Record<string, any>;
  admin_notes?: string;
  submitted_at: string;
  updated_at: string;
};

export type Adoption = {
  id: string;
  pet_id: string;
  adopter_id: string;
  application_id?: string;
  adoption_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  pet_id: string;
  created_at: string;
};

export type Database = {
  profiles: Profile;
  pet_categories: PetCategory;
  pets: Pet;
  pet_images: PetImage;
  adoption_applications: AdoptionApplication;
  adoptions: Adoption;
  favorites: Favorite;
}; 