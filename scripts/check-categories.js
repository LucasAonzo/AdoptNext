// Script to check existing categories in Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkCategories() {
  try {
    console.log('Checking existing pet categories...');
    const { data: categories, error } = await supabase
      .from('pet_categories')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    console.log('Existing categories:');
    console.log(JSON.stringify(categories, null, 2));
    
  } catch (error) {
    console.error('Error checking categories:', error);
  }
}

// Run the check
checkCategories(); 