
import { createClient } from '@supabase/supabase-js';

// Use our Supabase project details
const supabaseUrl = 'https://pxmtihysjjjlbrdxcbyj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bXRpaHlzampqbGJyZHhjYnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2Mjg3NjIsImV4cCI6MjA2MDIwNDc2Mn0.9iNkaFwl5la-roPBUHT4afZdiaTyt7tcIFt4oIAyljo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
