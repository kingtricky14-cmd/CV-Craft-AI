import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.example to .env and fill in your project values.'
  );
}

// Admin client: uses the service role key, bypasses Row Level Security.
// ONLY used server-side (e.g. to verify JWTs, run trusted admin queries).
// Regular data access should still respect RLS by using the user's own
// JWT — see middleware/auth.js for how we build a per-request client.
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
