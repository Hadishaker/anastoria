-- Reviews table
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id text not null,
  name text not null check (char_length(name) <= 100),
  email text not null check (char_length(email) <= 255),
  rating integer not null check (rating >= 1 and rating <= 5),
  body text not null check (char_length(body) <= 2000),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Newsletter subscribers table
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  email text not null unique check (char_length(email) <= 255),
  subscribed_at timestamptz not null default now()
);

-- Stars table (for sky page)
create table if not exists public.stars (
  id uuid default gen_random_uuid() primary key,
  x double precision not null check (x >= 0 and x <= 1),
  y double precision not null check (y >= 0 and y <= 1),
  name text not null check (char_length(name) >= 2 and char_length(name) <= 50),
  size double precision not null default 3,
  created_at timestamptz not null default now()
);

-- Row Level Security

-- Reviews: anyone can insert (pending approval), only approved rows readable publicly
alter table public.reviews enable row level security;

create policy "Public can insert reviews"
  on public.reviews for insert
  with check (approved = false);

create policy "Anyone can read approved reviews"
  on public.reviews for select
  using (approved = true);

-- Service role bypass (admin API uses service role key, bypasses RLS)

-- Newsletter: anyone can subscribe
alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

-- Stars: anyone can read and insert
alter table public.stars enable row level security;

create policy "Anyone can view stars"
  on public.stars for select
  using (true);

create policy "Anyone can claim a star"
  on public.stars for insert
  with check (true);

-- Enable realtime for stars
alter publication supabase_realtime add table public.stars;
