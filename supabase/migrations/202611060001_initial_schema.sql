-- Supabase schema and row-level access policies for Services Professionnels.
-- Role changes are intentionally not available to authenticated clients.
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'professional' check (role in ('admin','company','professional')),
  created_at timestamptz not null default now()
);
create table if not exists public.service_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.user_profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null,
  city text not null default '',
  price numeric(10,2) check (price is null or price >= 0),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now()
);
create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.user_profiles(id) on delete cascade,
  professional_id uuid not null references public.user_profiles(id) on delete cascade,
  listing_id uuid references public.service_listings(id) on delete set null,
  message text not null default '',
  status text not null default 'pending' check (status in ('pending','accepted','declined','completed')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.user_profiles (id, display_name, role)
  values (new.id, nullif(new.raw_user_meta_data ->> 'display_name',''), 'professional');
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.current_app_role()
returns text language sql stable security definer set search_path = '' as $$
  select p.role from public.user_profiles p where p.id = (select auth.uid())
$$;
revoke all on function public.current_app_role() from public;
grant execute on function public.current_app_role() to authenticated;

alter table public.user_profiles enable row level security;
alter table public.service_listings enable row level security;
alter table public.service_requests enable row level security;
revoke all on public.user_profiles from anon, authenticated;
revoke all on public.service_listings from anon, authenticated;
revoke all on public.service_requests from anon, authenticated;
grant select on public.user_profiles to authenticated;
grant update (display_name) on public.user_profiles to authenticated;
grant select on public.service_listings to anon, authenticated;
grant insert (owner_id,title,description,category,city,price,status), update (title,description,category,city,price,status), delete on public.service_listings to authenticated;
grant select, insert (company_id,professional_id,listing_id,message), update (status) on public.service_requests to authenticated;

-- Drop policies by name so this migration can be safely re-applied.
drop policy if exists "Users read own profile or admin reads profiles" on public.user_profiles;
drop policy if exists "Users update own display name" on public.user_profiles;
drop policy if exists "Published listings are public; owners and admins can read all" on public.service_listings;
drop policy if exists "Professionals create their own listings" on public.service_listings;
drop policy if exists "Professionals update their own listings" on public.service_listings;
drop policy if exists "Professionals delete their own listings" on public.service_listings;
drop policy if exists "Participants read requests" on public.service_requests;
drop policy if exists "Companies create requests" on public.service_requests;
drop policy if exists "Professionals respond to requests" on public.service_requests;

create policy "Users read own profile or admin reads profiles" on public.user_profiles for select to authenticated
using (id = (select auth.uid()) or (select public.current_app_role()) = 'admin');
create policy "Users update own display name" on public.user_profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "Published listings are public; owners and admins can read all" on public.service_listings for select to anon, authenticated
using (status = 'published' or owner_id = (select auth.uid()) or (select public.current_app_role()) = 'admin');
create policy "Professionals create their own listings" on public.service_listings for insert to authenticated
with check (owner_id = (select auth.uid()) and (select public.current_app_role()) = 'professional');
create policy "Professionals update their own listings" on public.service_listings for update to authenticated
using (owner_id = (select auth.uid()) and (select public.current_app_role()) = 'professional')
with check (owner_id = (select auth.uid()) and (select public.current_app_role()) = 'professional');
create policy "Professionals delete their own listings" on public.service_listings for delete to authenticated
using (owner_id = (select auth.uid()) and (select public.current_app_role()) = 'professional');

create policy "Participants read requests" on public.service_requests for select to authenticated
using (company_id = (select auth.uid()) or professional_id = (select auth.uid()) or (select public.current_app_role()) = 'admin');
create policy "Companies create requests" on public.service_requests for insert to authenticated
with check (company_id = (select auth.uid()) and (select public.current_app_role()) = 'company'
  and exists (select 1 from public.user_profiles p where p.id = professional_id and p.role = 'professional'));
create policy "Professionals respond to requests" on public.service_requests for update to authenticated
using (professional_id = (select auth.uid()) and status = 'pending')
with check (professional_id = (select auth.uid()) and status in ('accepted','declined'));

-- Use Supabase SQL editor or a trusted backend to promote accounts. Never expose service_role in browser code.
