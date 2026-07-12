-- =========================================================
-- CVCraft AI — Database Schema (Supabase / PostgreSQL)
-- =========================================================
-- NOTE: Supabase Auth already manages the `auth.users` table
-- (id, email, encrypted_password, etc). We do NOT duplicate
-- that table. Instead we keep a `profiles` table that stores
-- extra fields (first_name, last_name) and is linked 1:1 to
-- auth.users via the same UUID primary key.
-- =========================================================

-- Required for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- PROFILES  (extends auth.users)
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  first_name  text not null,
  last_name   text not null,
  plan        text not null default 'free' check (plan in ('free', 'premium', 'enterprise')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------
-- RESUMES  (parent record — one per resume draft)
-- ---------------------------------------------------------
create table if not exists public.resumes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null default 'Untitled Resume',
  template    text not null default 'classic' check (template in ('classic', 'modern', 'minimal', 'enhanced')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz -- soft delete
);

create extension if not exists pg_trgm;
create index if not exists idx_resumes_user_id on public.resumes(user_id);
create index if not exists idx_resumes_title_trgm on public.resumes using gin (title gin_trgm_ops);

-- ---------------------------------------------------------
-- PERSONAL INFO  (1:1 with resume)
-- ---------------------------------------------------------
create table if not exists public.personal_info (
  resume_id           uuid primary key references public.resumes(id) on delete cascade,
  first_name          text,
  last_name            text,
  professional_title  text,
  email               text,
  phone               text,
  country             text,
  city                text,
  linkedin            text,
  github              text,
  portfolio           text,
  photo_url           text,
  summary             text
);

-- ---------------------------------------------------------
-- EXPERIENCE  (1:many)
-- ---------------------------------------------------------
create table if not exists public.experience (
  id               uuid primary key default gen_random_uuid(),
  resume_id        uuid not null references public.resumes(id) on delete cascade,
  company          text,
  position         text,
  location         text,
  start_date       date,
  end_date         date,
  currently_working boolean not null default false,
  responsibilities text,
  sort_order       integer not null default 0
);

-- ---------------------------------------------------------
-- EDUCATION  (1:many)
-- ---------------------------------------------------------
create table if not exists public.education (
  id           uuid primary key default gen_random_uuid(),
  resume_id    uuid not null references public.resumes(id) on delete cascade,
  institution  text,
  degree       text,
  course       text,
  gpa          text,
  start_date   date,
  end_date     date,
  sort_order   integer not null default 0
);

-- ---------------------------------------------------------
-- SKILLS  (1:many, displayed as chips)
-- ---------------------------------------------------------
create table if not exists public.skills (
  id         uuid primary key default gen_random_uuid(),
  resume_id  uuid not null references public.resumes(id) on delete cascade,
  skill      text not null
);

-- ---------------------------------------------------------
-- LANGUAGES  (1:many)
-- ---------------------------------------------------------
create table if not exists public.languages (
  id         uuid primary key default gen_random_uuid(),
  resume_id  uuid not null references public.resumes(id) on delete cascade,
  language   text not null,
  level      text -- e.g. Native, Fluent, Intermediate
);

-- ---------------------------------------------------------
-- CERTIFICATIONS  (1:many)
-- ---------------------------------------------------------
create table if not exists public.certifications (
  id            uuid primary key default gen_random_uuid(),
  resume_id     uuid not null references public.resumes(id) on delete cascade,
  name          text,
  organization  text,
  date          date
);

-- ---------------------------------------------------------
-- PROJECTS  (1:many)
-- ---------------------------------------------------------
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  resume_id    uuid not null references public.resumes(id) on delete cascade,
  name         text,
  description  text,
  github       text,
  demo         text
);

-- ---------------------------------------------------------
-- REFERENCES  (1:many, optional)
-- ---------------------------------------------------------
create table if not exists public.references (
  id         uuid primary key default gen_random_uuid(),
  resume_id  uuid not null references public.resumes(id) on delete cascade,
  name       text,
  relationship text,
  email      text,
  phone      text
);

-- ---------------------------------------------------------
-- COVER LETTERS
-- ---------------------------------------------------------
create table if not exists public.cover_letters (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  resume_id       uuid references public.resumes(id) on delete set null,
  company         text,
  position        text,
  hiring_manager  text,
  letter          text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- =========================================================
-- ROW LEVEL SECURITY
-- Every table is locked down so a user can only ever read/
-- write rows that belong to them (via resumes.user_id or
-- cover_letters.user_id).
-- =========================================================

alter table public.profiles         enable row level security;
alter table public.resumes          enable row level security;
alter table public.personal_info    enable row level security;
alter table public.experience       enable row level security;
alter table public.education        enable row level security;
alter table public.skills           enable row level security;
alter table public.languages        enable row level security;
alter table public.certifications   enable row level security;
alter table public.projects         enable row level security;
alter table public.references       enable row level security;
alter table public.cover_letters    enable row level security;

-- PROFILES
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- RESUMES
create policy "Users can CRUD own resumes" on public.resumes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Generic helper pattern for all child tables: check ownership
-- via the parent resume's user_id.
create policy "Users can CRUD own personal_info" on public.personal_info
  for all using (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  );

create policy "Users can CRUD own experience" on public.experience
  for all using (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  );

create policy "Users can CRUD own education" on public.education
  for all using (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  );

create policy "Users can CRUD own skills" on public.skills
  for all using (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  );

create policy "Users can CRUD own languages" on public.languages
  for all using (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  );

create policy "Users can CRUD own certifications" on public.certifications
  for all using (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  );

create policy "Users can CRUD own projects" on public.projects
  for all using (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  );

create policy "Users can CRUD own references" on public.references
  for all using (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.resumes r where r.id = resume_id and r.user_id = auth.uid())
  );

-- COVER LETTERS
create policy "Users can CRUD own cover letters" on public.cover_letters
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
