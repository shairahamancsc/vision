
import { createClient } from '@supabase/supabase-js';

// This function creates a Supabase client for server-side operations.
// It uses the service role key to bypass Row Level Security (RLS).
// This is suitable for admin-level tasks or when you need to access data
// without a user's session.
//
// IMPORTANT: This should only be used in server-side code (Server Components,
// API routes, Server Actions) and never exposed to the client.
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || supabaseUrl.includes('YOUR_SUPABASE_URL') || !serviceKey || serviceKey.includes('YOUR_SUPABASE_SERVICE_KEY')) {
    console.warn('Supabase credentials for admin client are not set or are placeholders. Data fetching will be skipped. Please update your .env file.');
    return null;
  }

  // Using the service role key bypasses RLS.
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
