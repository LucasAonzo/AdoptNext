// Script to add sample data to Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create a Supabase client with the service role key if available
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Generate a system user UUID
const SYSTEM_USER_ID = uuidv4();

// Pet categories
const categories = [
  { name: 'Perros', description: 'Dogs available for adoption' },
  { name: 'Gatos', description: 'Cats available for adoption' },
  { name: 'Aves', description: 'Birds available for adoption' },
  { name: 'Otros', description: 'Other animals available for adoption' },
  { name: 'Reptiles', description: 'Reptiles available for adoption' }
];

// Sample pets
const pets = [
  {
    name: 'Max',
    breed: 'Labrador Retriever',
    gender: 'Male',
    age: '3 years',
    description: 'Max is a friendly and energetic Labrador who loves to play fetch and go for long walks.',
    main_image_url: '/images/pet-placeholder.jpg',
    status: 'Available',
    weight: 30,
    size: 'Large',
    category_id: null, // Will be set after category insertion
    created_by: SYSTEM_USER_ID,
    is_vaccinated: true,
    is_neutered: true,
    is_house_trained: true,
    is_good_with_children: true,
    is_good_with_other_pets: true
  },
  {
    name: 'Luna',
    breed: 'Siamese',
    gender: 'Female',
    age: '2 years',
    description: 'Luna is a beautiful Siamese cat who enjoys lounging in sunny spots and playing with string toys.',
    main_image_url: '/images/pet-placeholder.jpg',
    status: 'Available',
    weight: 4,
    size: 'Medium',
    category_id: null, // Will be set after category insertion
    created_by: SYSTEM_USER_ID,
    is_vaccinated: true,
    is_neutered: true,
    is_house_trained: true,
    is_good_with_children: true,
    is_good_with_other_pets: true
  },
  {
    name: 'Rocky',
    breed: 'German Shepherd',
    gender: 'Male',
    age: '1 year',
    description: 'Rocky is a young German Shepherd who is intelligent and eager to learn. He would do well in a home with an active family.',
    main_image_url: '/images/pet-placeholder.jpg',
    status: 'Available',
    weight: 25,
    size: 'Large',
    category_id: null, // Will be set after category insertion
    created_by: SYSTEM_USER_ID,
    is_vaccinated: true,
    is_neutered: false,
    is_house_trained: true,
    is_good_with_children: true,
    is_good_with_other_pets: false
  },
  {
    name: 'Cleo',
    breed: 'Maine Coon',
    gender: 'Female',
    age: '4 years',
    description: 'Cleo is a majestic Maine Coon with a gentle personality. She enjoys being brushed and sitting in laps.',
    main_image_url: '/images/pet-placeholder.jpg',
    status: 'Available',
    weight: 6,
    size: 'Large',
    category_id: null, // Will be set after category insertion
    created_by: SYSTEM_USER_ID,
    is_vaccinated: true,
    is_neutered: true,
    is_house_trained: true,
    is_good_with_children: true,
    is_good_with_other_pets: true
  }
];

async function initData() {
  try {
    console.log('Starting data initialization...');
    
    // First, check if categories already exist
    console.log('Checking existing pet categories...');
    const { data: existingCategories, error: categoryError } = await supabase
      .from('pet_categories')
      .select('*');
    
    if (categoryError) {
      throw categoryError;
    }
    
    let categoryData = existingCategories;
    
    // If no categories exist, insert them
    if (!existingCategories || existingCategories.length === 0) {
      console.log('No existing categories found. Inserting pet categories...');
      const { data: newCategories, error: categoryError } = await supabase
        .from('pet_categories')
        .insert(categories)
        .select();
      
      if (categoryError) {
        throw categoryError;
      }
      
      categoryData = newCategories;
      console.log(`Inserted ${categoryData.length} categories`);
    } else {
      console.log(`Found ${existingCategories.length} existing categories`);
    }
    
    // Get category IDs
    const dogCategory = categoryData.find(cat => cat.name === 'Perros');
    const catCategory = categoryData.find(cat => cat.name === 'Gatos');
    
    if (!dogCategory || !catCategory) {
      throw new Error('Required categories (Perros or Gatos) not found');
    }
    
    // Assign category IDs to pets
    pets[0].category_id = dogCategory.id; // Max - Labrador
    pets[1].category_id = catCategory.id; // Luna - Siamese
    pets[2].category_id = dogCategory.id; // Rocky - German Shepherd
    pets[3].category_id = catCategory.id; // Cleo - Maine Coon
    
    // Check if pets already exist
    console.log('Checking existing pets...');
    const { data: existingPets, error: petsError } = await supabase
      .from('pets')
      .select('name');
    
    if (petsError) {
      throw petsError;
    }
    
    // Try to disable RLS for the pets table temporarily
    try {
      await supabase.rpc('disable_rls_for_pets');
      console.log('Temporarily disabled RLS for pets table');
    } catch (rlsError) {
      console.log('Could not disable RLS, continuing with insertion:', rlsError.message);
    }
    
    // Filter out pets that already exist
    const newPets = pets.filter(pet => 
      !existingPets.some(existingPet => existingPet.name === pet.name)
    );
    
    if (newPets.length > 0) {
      console.log(`Inserting ${newPets.length} new pets...`);
      
      // Insert pets
      const { error: insertError } = await supabase
        .from('pets')
        .insert(newPets);
      
      if (insertError) {
        throw insertError;
      }
      
      console.log(`Inserted ${newPets.length} pets`);
    } else {
      console.log('No new pets to insert');
    }
    
    // Try to re-enable RLS for the pets table
    try {
      await supabase.rpc('enable_rls_for_pets');
      console.log('Re-enabled RLS for pets table');
    } catch (rlsError) {
      console.log('Could not re-enable RLS:', rlsError.message);
    }
    
    console.log('Data initialization completed successfully');
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Run the initialization
initData(); 