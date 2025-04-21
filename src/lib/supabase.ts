'use client'; // This utility is for creating browser clients

import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js'; // Keep User type export if needed

// Define a function to create a Supabase client for client components
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
  }

  // Create a new browser client instance
  return createBrowserClient(supabaseUrl, supabaseKey);
}

// Re-export User type
export type { User };
