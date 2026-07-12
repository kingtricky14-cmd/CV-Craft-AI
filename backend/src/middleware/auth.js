import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '../config/supabase.js';

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

/**
 * requireAuth
 * - Expects header: Authorization: Bearer <supabase_access_token>
 * - Verifies the token against Supabase Auth.
 * - Attaches:
 *    req.user       -> the authenticated user object
 *    req.supabase   -> a Supabase client scoped to this user's token,
 *                       so every query still goes through Row Level
 *                       Security instead of using admin privileges.
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid or expired session.' });
    }

    req.user = data.user;

    // Per-request client that carries the user's own JWT, so RLS
    // policies (auth.uid() = user_id) apply normally.
    req.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    next();
  } catch (err) {
    next(err);
  }
}
