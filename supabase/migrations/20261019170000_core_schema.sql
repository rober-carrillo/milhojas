-- Milhojas core schema (Phase 1): profiles, businesses, products, sales_entries.
-- Spec: docs/ARCHITECTURE.md. Every table has RLS enabled. Consumers browse
-- businesses and active products without signing in; everything else is
-- owner-only, and sales data is never readable by anyone but the owner.

-- Helpers used by policies and triggers. Not exposed through the API.
create schema if not exists private;
grant usage on schema private to authenticated;

-- ---------------------------------------------------------------------------
-- profiles: 1:1 with auth.users
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('vendor', 'consumer', 'admin')),
  display_name text not null check (char_length(trim(display_name)) between 1 and 80),
  phone text,
  locale text not null default 'es' check (locale in ('es', 'en')),
  created_at timestamptz not null default now()
);

-- Admin is granted and revoked from the dashboard or SQL editor only, never by
-- a signed-in user editing their own profile.
create function private.guard_profile_role()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and 'admin' in (new.role, old.role)
     and current_user in ('anon', 'authenticated') then
    raise exception 'admin role can only be changed by the service'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger profiles_guard_role
  before update of role on public.profiles
  for each row execute function private.guard_profile_role();

-- ---------------------------------------------------------------------------
-- businesses
-- ---------------------------------------------------------------------------
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  description text check (char_length(description) <= 500),
  category text not null check (char_length(trim(category)) between 1 and 40),
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),
  is_open boolean not null default false,
  whatsapp text not null check (whatsapp ~ '^\+[1-9][0-9]{7,14}$'),
  currency char(3) not null default 'COP' check (currency in ('COP', 'USD')),
  image_url text,
  created_at timestamptz not null default now(),
  constraint businesses_lat_lng_together check ((lat is null) = (lng is null))
);

create index businesses_owner_id_idx on public.businesses (owner_id);

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  price numeric(14, 2) not null check (price >= 0),
  cost numeric(14, 2) check (cost >= 0),
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  -- Lets sales_entries prove its product belongs to the same business.
  constraint products_id_business_id_key unique (id, business_id)
);

create index products_business_id_idx on public.products (business_id, sort_order);

-- ---------------------------------------------------------------------------
-- sales_entries: end-of-day tally, one row per product per day.
-- price_at_sale / cost_at_sale freeze history when prices change later.
-- ---------------------------------------------------------------------------
create table public.sales_entries (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  product_id uuid not null,
  units integer not null check (units between 0 and 100000),
  sold_on date not null,
  price_at_sale numeric(14, 2) not null check (price_at_sale >= 0),
  cost_at_sale numeric(14, 2) check (cost_at_sale >= 0),
  created_at timestamptz not null default now(),
  -- A product with sales history cannot be deleted on its own (deactivate it
  -- instead); deleting the whole business still removes both.
  constraint sales_entries_product_fkey foreign key (product_id, business_id)
    references public.products (id, business_id),
  -- Saving the same day again updates the row instead of duplicating it, which
  -- also makes offline retries idempotent.
  constraint sales_entries_product_day_key unique (product_id, sold_on)
);

create index sales_entries_business_day_idx on public.sales_entries (business_id, sold_on);

-- Fill the price/cost snapshot from the product when the client does not send one.
create function private.sales_entries_snapshot()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.price_at_sale is null then
    select p.price, p.cost
      into new.price_at_sale, new.cost_at_sale
      from public.products p
     where p.id = new.product_id
       and p.business_id = new.business_id;
  end if;
  return new;
end;
$$;

create trigger sales_entries_snapshot
  before insert on public.sales_entries
  for each row execute function private.sales_entries_snapshot();

-- ---------------------------------------------------------------------------
-- Policy helpers
-- ---------------------------------------------------------------------------
create function private.owns_business(target_business_id uuid)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1
      from public.businesses b
     where b.id = target_business_id
       and b.owner_id = (select auth.uid())
  );
$$;

create function private.is_vendor()
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1
      from public.profiles p
     where p.id = (select auth.uid())
       and p.role in ('vendor', 'admin')
  );
$$;

revoke all on function private.owns_business(uuid) from public;
revoke all on function private.is_vendor() from public;
grant execute on function private.owns_business(uuid) to authenticated;
grant execute on function private.is_vendor() to authenticated;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.products enable row level security;
alter table public.sales_entries enable row level security;

-- profiles: each user sees and edits only their own. Deleting the auth user
-- removes the profile, so there is no delete policy.
create policy "profiles: read own" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));

create policy "profiles: create own" on public.profiles
  for insert to authenticated
  with check (id = (select auth.uid()) and role in ('vendor', 'consumer'));

create policy "profiles: update own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- businesses: public browse; vendors create and manage their own.
create policy "businesses: public read" on public.businesses
  for select to anon, authenticated
  using (true);

create policy "businesses: vendor creates own" on public.businesses
  for insert to authenticated
  with check (owner_id = (select auth.uid()) and private.is_vendor());

create policy "businesses: owner updates" on public.businesses
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "businesses: owner deletes" on public.businesses
  for delete to authenticated
  using (owner_id = (select auth.uid()));

-- products: public sees active ones; the owner sees and manages all of theirs.
create policy "products: public reads active" on public.products
  for select to anon, authenticated
  using (is_active);

create policy "products: owner reads own" on public.products
  for select to authenticated
  using (private.owns_business(business_id));

create policy "products: owner creates" on public.products
  for insert to authenticated
  with check (private.owns_business(business_id));

create policy "products: owner updates" on public.products
  for update to authenticated
  using (private.owns_business(business_id))
  with check (private.owns_business(business_id));

create policy "products: owner deletes" on public.products
  for delete to authenticated
  using (private.owns_business(business_id));

-- sales_entries: owner only, for every operation.
create policy "sales_entries: owner only" on public.sales_entries
  for all to authenticated
  using (private.owns_business(business_id))
  with check (private.owns_business(business_id));

-- ---------------------------------------------------------------------------
-- Table privileges (defence in depth on top of RLS)
-- ---------------------------------------------------------------------------
-- Visitors who are not signed in only ever read businesses and products.
revoke all on public.profiles, public.sales_entries from anon;
revoke insert, update, delete on public.businesses, public.products from anon;
-- Nobody outside the service truncates or alters triggers through the API roles.
revoke truncate, references, trigger
  on public.profiles, public.businesses, public.products, public.sales_entries
  from anon, authenticated;

-- ---------------------------------------------------------------------------
-- nearby_businesses: consumer browse, ordered by distance (haversine, km).
-- Runs with the caller's rights, so RLS still applies.
-- ---------------------------------------------------------------------------
create function public.nearby_businesses(
  from_lat double precision,
  from_lng double precision,
  max_km double precision default 25,
  max_results integer default 50
)
returns table (
  id uuid,
  name text,
  description text,
  category text,
  lat double precision,
  lng double precision,
  is_open boolean,
  whatsapp text,
  currency char(3),
  image_url text,
  distance_km double precision
)
language sql
stable
set search_path = ''
as $$
  select b.id, b.name, b.description, b.category, b.lat, b.lng, b.is_open,
         b.whatsapp, b.currency, b.image_url, d.km
    from public.businesses b
   cross join lateral (
     select 6371 * 2 * asin(least(1, sqrt(
              power(sin(radians(b.lat - from_lat) / 2), 2)
              + cos(radians(from_lat)) * cos(radians(b.lat))
                * power(sin(radians(b.lng - from_lng) / 2), 2)
            )))
   ) as d (km)
   where b.lat is not null
     and d.km <= max_km
   order by d.km, b.id
   limit least(greatest(max_results, 1), 200);
$$;

grant execute on function public.nearby_businesses(double precision, double precision, double precision, integer)
  to anon, authenticated;
