import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured');
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            signal: options.signal || AbortSignal.timeout(10000),
          });
        },
      },
    });
  }
  return supabaseInstance;
};

export const supabase = getSupabase();

export type Review = {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  location: string | null;
  service_type: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};
