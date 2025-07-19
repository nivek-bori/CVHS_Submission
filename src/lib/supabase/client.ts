import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import type { Database } from '../../types';

// Client-side Supabase client
export const supabase = createClient<Database>(config.supabase.url, config.supabase.anonKey);
