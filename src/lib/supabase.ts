
import { createClient } from '@supabase/supabase-js';

// Public Supabase keys can be safely stored in client-side code
// Private keys should be stored in environment variables or Supabase Edge Functions
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
