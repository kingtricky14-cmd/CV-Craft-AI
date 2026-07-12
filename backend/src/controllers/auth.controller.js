import { supabaseAdmin } from '../config/supabase.js';

// POST /api/auth/register
// body: { firstName, lastName, email, password }
export async function register(req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'firstName, lastName, email and password are required.' });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // set to false if you want email verification required
      user_metadata: { first_name: firstName, last_name: lastName },
    });

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ user: data.user });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
// body: { email, password }
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required.' });
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });

    if (error) return res.status(401).json({ error: error.message });

    // Return the session so the frontend can store the access/refresh tokens
    res.json({ session: data.session, user: data.user });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/forgot-password
// body: { email }
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email is required.' });

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.CLIENT_URL}/reset-password`,
    });

    if (error) return res.status(400).json({ error: error.message });

    // Always respond with success to avoid leaking which emails are registered
    res.json({ message: 'If an account exists for this email, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me  (requires auth)
export async function me(req, res) {
  const { data: profile } = await req.supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();

  res.json({ user: req.user, profile });
}

// PATCH /api/auth/me  body: { firstName?, lastName? }  (requires auth)
export async function updateProfile(req, res, next) {
  try {
    const { firstName, lastName } = req.body;

    const patch = { updated_at: new Date().toISOString() };
    if (firstName !== undefined) patch.first_name = firstName;
    if (lastName !== undefined) patch.last_name = lastName;

    const { data, error } = await req.supabase
      .from('profiles')
      .update(patch)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ profile: data });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/auth/me  (requires auth)
// Permanently deletes the auth user. profiles/resumes/cover_letters all have
// `on delete cascade` foreign keys to auth.users, so this cleans up
// everything belonging to the account in one step.
export async function deleteAccount(req, res, next) {
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(req.user.id);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: 'Account deleted.' });
  } catch (err) {
    next(err);
  }
}
