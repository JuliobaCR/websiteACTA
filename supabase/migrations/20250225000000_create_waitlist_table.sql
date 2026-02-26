-- Create public.waitlist table for storing waitlist signups
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),

  -- Form data
  email text not null unique,
  company_name text,
  use_case text,

  -- Timestamps
  created_at timestamptz not null default now()
);

-- Index for listing by date
create index waitlist_created_at_idx on public.waitlist (created_at desc);

-- Enable Row Level Security
alter table public.waitlist enable row level security;

-- Allow anonymous inserts (for the waitlist form)
create policy "Allow anonymous inserts" on public.waitlist
  for insert
  with check (true);

-- Restrict select to service role only (via supabase admin / service key)
create policy "Service role can read all" on public.waitlist
  for select
  using (auth.role() = 'service_role');
