import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import type { Database } from '../../types';

// Admin client for server-side operations
export const createAdminSupabaseClient = () => {
  return createClient<Database>(config.supabase.url, config.supabase.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
