// req.supabase is scoped to the logged-in user's JWT (see middleware/auth.js),
// so Row Level Security guarantees these queries only ever touch rows the
// user owns.

// GET /api/cover-letters
export async function listCoverLetters(req, res, next) {
  try {
    const { data, error } = await req.supabase
      .from('cover_letters')
      .select('id, company, position, hiring_manager, created_at, updated_at')
      .order('updated_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    res.json({ coverLetters: data });
  } catch (err) {
    next(err);
  }
}

// GET /api/cover-letters/:id
export async function getCoverLetter(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await req.supabase
      .from('cover_letters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Cover letter not found.' });

    res.json({ coverLetter: data });
  } catch (err) {
    next(err);
  }
}

// POST /api/cover-letters  body: { company?, position?, hiringManager?, letter?, resumeId? }
export async function createCoverLetter(req, res, next) {
  try {
    const { company = '', position = '', hiringManager = '', letter = '', resumeId = null } = req.body;

    const { data, error } = await req.supabase
      .from('cover_letters')
      .insert({
        user_id: req.user.id,
        company,
        position,
        hiring_manager: hiringManager,
        letter,
        resume_id: resumeId,
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ coverLetter: data });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/cover-letters/:id  body: { company?, position?, hiringManager?, letter? }
export async function updateCoverLetter(req, res, next) {
  try {
    const { id } = req.params;
    const { company, position, hiringManager, letter } = req.body;

    const patch = { updated_at: new Date().toISOString() };
    if (company !== undefined) patch.company = company;
    if (position !== undefined) patch.position = position;
    if (hiringManager !== undefined) patch.hiring_manager = hiringManager;
    if (letter !== undefined) patch.letter = letter;

    const { data, error } = await req.supabase
      .from('cover_letters')
      .update(patch)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ coverLetter: data });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cover-letters/:id
export async function deleteCoverLetter(req, res, next) {
  try {
    const { id } = req.params;
    const { error } = await req.supabase.from('cover_letters').delete().eq('id', id);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: 'Cover letter deleted.' });
  } catch (err) {
    next(err);
  }
}
