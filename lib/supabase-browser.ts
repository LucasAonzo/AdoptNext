'use client';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  
  return createSupabaseClient(supabaseUrl, supabaseKey);
}; 