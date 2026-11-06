-- Hardening migration for databases where the initial schema was already applied.
-- Safe to apply after 202611060001_initial_schema.sql. Never grants role mutation.
revoke all on public.user_profiles from anon, authenticated;
revoke all on public.service_listings from anon, authenticated;
revoke all on public.service_requests from anon, authenticated;
grant select on public.user_profiles to authenticated;
grant update (display_name) on public.user_profiles to authenticated;
grant select on public.service_listings to anon, authenticated;
grant insert (owner_id,title,description,category,city,price,status), update (title,description,category,city,price,status), delete on public.service_listings to authenticated;
grant select, insert (company_id,professional_id,listing_id,message), update (status) on public.service_requests to authenticated;

create or replace function public.is_professional_profile(target_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.user_profiles p where p.id = target_id and p.role = 'professional')
$$;
revoke all on function public.is_professional_profile(uuid) from public;
grant execute on function public.is_professional_profile(uuid) to authenticated;

-- Remove legacy policies that allowed wider request updates or duplicate checks.
drop policy if exists "Users read own profile or admin reads profiles" on public.user_profiles;
drop policy if exists "Users update own display name" on public.user_profiles;
drop policy if exists "Published listings are public; owners and admins can read all" on public.service_listings;
drop policy if exists "Professionals create their own listings" on public.service_listings;
drop policy if exists "Professionals update their own listings" on public.service_listings;
drop policy if exists "Professionals delete their own listings" on public.service_listings;
drop policy if exists "Participants and admins read requests" on public.service_requests;
drop policy if exists "Companies create requests for professionals" on public.service_requests;
drop policy if exists "Request participants update requests" on public.service_requests;
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
  and public.is_professional_profile(professional_id));
create policy "Professionals respond to requests" on public.service_requests for update to authenticated
using (professional_id = (select auth.uid()) and status = 'pending')
with check (professional_id = (select auth.uid()) and status in ('accepted','declined'));
