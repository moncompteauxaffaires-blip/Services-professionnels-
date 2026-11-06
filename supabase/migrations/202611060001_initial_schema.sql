-- Create in the Supabase SQL editor. All client access is governed by RLS.
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'professional' check (role in ('admin', 'company', 'professional')),
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
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.user_profiles(id) on delete cascade,
  professional_id uuid not null references public.user_profiles(id) on delete cascade,
  listing_id uuid references public.service_listings(id) on delete set null,
  message text not null default '',
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'completed')),
  created_at timestamptz not null default now()
);

-- Auth signup creates a profile with a fixed, least-privileged default role.
-- Never trust user-editable auth metadata for authorization roles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_profiles (id, display_name, role)
  values (new.id, nullif(new.raw_user_meta_data ->> 'display_name', ''), 'professional');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- SECURITY DEFINER helper avoids recursive profile RLS checks. It only returns
-- the role of the currently authenticated user and is not a role mutation API.
create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.role from public.user_profiles p where p.id = (select auth.uid())
$$;

revoke all on function public.current_app_role() from public;
grant execute on function public.current_app_role() to authenticated;

alter table public.user_profiles enable row level security;
alter table public.service_listings enable row level security;
alter table public.service_requests enable row level security;

-- Do not grant UPDATE on role. Authenticated users can only update display_name.
revoke all on public.user_profiles from anon, authenticated;
grant select on public.user_profiles to authenticated;
grant update (display_name) on public.user_profiles to authenticated;
create policy "Users read own profile or admin reads profiles"
  on public.user_profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.current_app_role()) = 'admin');
create policy "Users update own display name"
  on public.user_profiles for update to authenticated
  using (id = (select auth.uid()) and role <> 'admin')
  with check (id = (select auth.uid()) and role <> 'admin');

revoke all on public.service_listings from anon, authenticated;
grant select on public.service_listings to anon, authenticated;
grant insert, update, delete on public.service_listings to authenticated;
create policy "Published listings are public; owners and admins can read all"
  on public.service_listings for select to anon, authenticated
  using (
    status = 'published'
    or owner_id = (select auth.uid())
    or (select public.current_app_role()) = 'admin'
  );
create policy "Professionals create their own listings"
  on public.service_listings for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and (select public.current_app_role()) = 'professional'
  );
create policy "Professionals update their own listings"
  on public.service_listings for update to authenticated
  using (owner_id = (select auth.uid()) and (select public.current_app_role()) = 'professional')
  with check (owner_id = (select auth.uid()) and (select public.current_app_role()) = 'professional');
create policy "Professionals delete their own listings"
  on public.service_listings for delete to authenticated
  using (owner_id = (select auth.uid()) and (select public.current_app_role()) = 'professional');

revoke all on public.service_requests from anon, authenticated;
grant select, insert, update on public.service_requests to authenticated;
create policy "Participants and admins read requests"
  on public.service_requests for select to authenticated
  using (
    company_id = (select auth.uid())
    or professional_id = (select auth.uid())
    or (select public.current_app_role()) = 'admin'
  );
create policy "Companies create requests for professionals"
  on public.service_requests for insert to authenticated
  with check (
    company_id = (select auth.uid())
    and (select public.current_app_role()) = 'company'
    and exists (
      select 1 from public.user_profiles p
      where p.id = professional_id and p.role = 'professional'
    )
  );
create policy "Request participants update requests"
  on public.service_requests for update to authenticated
  using (
    company_id = (select auth.uid()) or professional_id = (select auth.uid())
  )
  with check (
    company_id = (select auth.uid()) or professional_id = (select auth.uid())
  );

-- Roles are intentionally not self-service. Provision company/admin only from
-- a trusted administrative context (e.g. Supabase SQL editor/secure backend).
-- Never put a service_role key in Vite, browser code, or a VITE_* variable.
