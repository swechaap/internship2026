import { createClient } from '@supabase/supabase-js';

// Fallback logic for dynamic setup
const getCredentials = () => {
  const url = import.meta.env.VITE_SUPABASE_URL || window.localStorage.getItem('SB_URL') || '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || window.localStorage.getItem('SB_KEY') || '';
  return { url, key };
};

const creds = getCredentials();
export let supabaseClient = null;

if (creds.url && creds.key) {
  try {
    supabaseClient = createClient(creds.url, creds.key);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
}

export const initializeSupabaseClient = (url, key) => {
  try {
    supabaseClient = createClient(url, key);
    return supabaseClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client dynamically:', err);
    throw err;
  }
};
