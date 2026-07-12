// All handlers here use req.supabase (see middleware/auth.js), which is
// scoped to the logged-in user's JWT — so Row Level Security guarantees
// a user can only ever touch their own rows. We never need to manually
// filter by user_id in the WHERE clause for that reason, but we still
// pass it on INSERT so the row is correctly owned.
//
// V1 is fully free — no plan limits or template locks. (A premium tier
// with resume limits, locked templates, and Stripe billing was prototyped
// and intentionally removed for V1; see project notes if reviving it for V2.)

const CHILD_TABLES = [
  'experience',
  'education',
  'skills',
  'languages',
  'certifications',
  'projects',
  'references',
];

// GET /api/resumes?search=google
export async function listResumes(req, res, next) {
  try {
    const { search } = req.query;
    let query = req.supabase
      .from('resumes')
      .select('id, title, template, created_at, updated_at')
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;
    if (error) return res.status(400).json({ error: error.message });

    res.json({ resumes: data });
  } catch (err) {
    next(err);
  }
}

// GET /api/resumes/:id  -> full resume with all sections
export async function getResume(req, res, next) {
  try {
    const { id } = req.params;

    const { data: resume, error: resumeError } = await req.supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (resumeError) return res.status(404).json({ error: 'Resume not found.' });

    const [personalInfo, ...children] = await Promise.all([
      req.supabase.from('personal_info').select('*').eq('resume_id', id).maybeSingle(),
      ...CHILD_TABLES.map((table) =>
        req.supabase.from(table).select('*').eq('resume_id', id)
      ),
    ]);

    const sections = {};
    CHILD_TABLES.forEach((table, i) => {
      sections[table] = children[i].data || [];
    });

    res.json({
      resume,
      personalInfo: personalInfo.data || null,
      ...sections,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/resumes  body: { title, template }
export async function createResume(req, res, next) {
  try {
    const { title = 'Untitled Resume', template = 'classic' } = req.body;

    const { data, error } = await req.supabase
      .from('resumes')
      .insert({ title, template, user_id: req.user.id })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    // Create an empty personal_info row so the builder has something to update
    await req.supabase.from('personal_info').insert({ resume_id: data.id });

    res.status(201).json({ resume: data });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/resumes/:id
// body: { title?, template?, personalInfo?, experience?, education?, skills?, languages?, certifications?, projects?, references? }
// Array sections are treated as "replace all" for simplicity in the MVP.
export async function updateResume(req, res, next) {
  try {
    const { id } = req.params;
    const { title, template, personalInfo, ...sections } = req.body;

    if (title !== undefined || template !== undefined) {
      const patch = {};
      if (title !== undefined) patch.title = title;
      if (template !== undefined) patch.template = template;
      patch.updated_at = new Date().toISOString();

      const { error } = await req.supabase.from('resumes').update(patch).eq('id', id);
      if (error) return res.status(400).json({ error: error.message });
    } else {
      await req.supabase
        .from('resumes')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', id);
    }

    if (personalInfo) {
      const { error } = await req.supabase
        .from('personal_info')
        .upsert({ ...personalInfo, resume_id: id });
      if (error) return res.status(400).json({ error: error.message });
    }

    for (const table of CHILD_TABLES) {
      if (sections[table] === undefined) continue;
      const rows = sections[table];

      // Replace-all strategy: wipe existing rows for this resume, insert fresh ones.
      const { error: deleteError } = await req.supabase.from(table).delete().eq('resume_id', id);
      if (deleteError) return res.status(400).json({ error: deleteError.message });

      if (Array.isArray(rows) && rows.length > 0) {
        const toInsert = rows.map(({ id: _drop, ...rest }) => ({ ...rest, resume_id: id }));
        const { error: insertError } = await req.supabase.from(table).insert(toInsert);
        if (insertError) return res.status(400).json({ error: insertError.message });
      }
    }

    res.json({ message: 'Resume updated.' });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/resumes/:id  (soft delete)
export async function deleteResume(req, res, next) {
  try {
    const { id } = req.params;
    const { error } = await req.supabase
      .from('resumes')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: 'Resume deleted.' });
  } catch (err) {
    next(err);
  }
}

// POST /api/resumes/:id/duplicate
export async function duplicateResume(req, res, next) {
  try {
    const { id } = req.params;

    const { data: original, error: fetchError } = await req.supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) return res.status(404).json({ error: 'Resume not found.' });

    const { data: copy, error: insertError } = await req.supabase
      .from('resumes')
      .insert({
        title: `${original.title} (Copy)`,
        template: original.template,
        user_id: req.user.id,
      })
      .select()
      .single();

    if (insertError) return res.status(400).json({ error: insertError.message });

    const { data: personalInfo } = await req.supabase
      .from('personal_info')
      .select('*')
      .eq('resume_id', id)
      .maybeSingle();

    if (personalInfo) {
      const { id: _drop, resume_id: _drop2, ...rest } = personalInfo;
      await req.supabase.from('personal_info').insert({ ...rest, resume_id: copy.id });
    }

    for (const table of CHILD_TABLES) {
      const { data: rows } = await req.supabase.from(table).select('*').eq('resume_id', id);
      if (rows && rows.length > 0) {
        const toInsert = rows.map(({ id: _drop, resume_id: _drop2, ...rest }) => ({
          ...rest,
          resume_id: copy.id,
        }));
        await req.supabase.from(table).insert(toInsert);
      }
    }

    res.status(201).json({ resume: copy });
  } catch (err) {
    next(err);
  }
}
