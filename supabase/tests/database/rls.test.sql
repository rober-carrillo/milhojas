-- Row-level security: who can read and write what. Run with `pnpm db:test`.
-- Fixtures: vendors A and B (one business each), consumer C, and D, a signed-up
-- user with no profile yet.
begin;
create extension if not exists pgtap with schema extensions;
select plan(28);

insert into auth.users (id, email) values
  ('aaaaaaaa-0000-4000-8000-00000000000a', 'a@test.milhojas'),
  ('bbbbbbbb-0000-4000-8000-00000000000b', 'b@test.milhojas'),
  ('cccccccc-0000-4000-8000-00000000000c', 'c@test.milhojas'),
  ('dddddddd-0000-4000-8000-00000000000d', 'd@test.milhojas');

insert into public.profiles (id, role, display_name) values
  ('aaaaaaaa-0000-4000-8000-00000000000a', 'vendor', 'Vendor A'),
  ('bbbbbbbb-0000-4000-8000-00000000000b', 'vendor', 'Vendor B'),
  ('cccccccc-0000-4000-8000-00000000000c', 'consumer', 'Consumer C');

insert into public.businesses (id, owner_id, name, category, lat, lng, whatsapp) values
  ('aaaaaaaa-1111-4000-8000-00000000000a', 'aaaaaaaa-0000-4000-8000-00000000000a', 'Negocio A', 'comida', 4.81, -75.69, '+573000000001'),
  ('bbbbbbbb-1111-4000-8000-00000000000b', 'bbbbbbbb-0000-4000-8000-00000000000b', 'Negocio B', 'frutas', 4.82, -75.70, '+573000000002');

insert into public.products (id, business_id, name, price, cost, is_active) values
  ('aaaaaaaa-2222-4000-8000-0000000000a1', 'aaaaaaaa-1111-4000-8000-00000000000a', 'A activo', 5000, 2000, true),
  ('aaaaaaaa-2222-4000-8000-0000000000a2', 'aaaaaaaa-1111-4000-8000-00000000000a', 'A inactivo', 3000, null, false),
  ('bbbbbbbb-2222-4000-8000-0000000000b1', 'bbbbbbbb-1111-4000-8000-00000000000b', 'B activo', 6000, 2500, true),
  ('bbbbbbbb-2222-4000-8000-0000000000b2', 'bbbbbbbb-1111-4000-8000-00000000000b', 'B inactivo', 4000, null, false);

insert into public.sales_entries (id, business_id, product_id, units, sold_on) values
  ('aaaaaaaa-3333-4000-8000-00000000000a', 'aaaaaaaa-1111-4000-8000-00000000000a', 'aaaaaaaa-2222-4000-8000-0000000000a1', 10, '2026-10-01'),
  ('bbbbbbbb-3333-4000-8000-00000000000b', 'bbbbbbbb-1111-4000-8000-00000000000b', 'bbbbbbbb-2222-4000-8000-0000000000b1', 7, '2026-10-01');

select is(
  (select count(*)::int from pg_tables where schemaname = 'public' and not rowsecurity),
  0,
  'every table in public has RLS enabled'
);

-- ---------------------------------------------------------------------------
-- Visitor who is not signed in (anon)
-- ---------------------------------------------------------------------------
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';

select is(
  (select count(*)::int from public.businesses
    where id in ('aaaaaaaa-1111-4000-8000-00000000000a', 'bbbbbbbb-1111-4000-8000-00000000000b')),
  2,
  'anon reads businesses'
);

select is(
  array(select name from public.products
         where business_id in ('aaaaaaaa-1111-4000-8000-00000000000a', 'bbbbbbbb-1111-4000-8000-00000000000b')
         order by name),
  array['A activo', 'B activo'],
  'anon reads active products only'
);

select throws_ok(
  'select * from public.sales_entries',
  '42501', null,
  'anon cannot read sales_entries'
);

select throws_ok(
  'select * from public.profiles',
  '42501', null,
  'anon cannot read profiles'
);

select throws_ok(
  $$insert into public.businesses (owner_id, name, category, whatsapp)
    values ('aaaaaaaa-0000-4000-8000-00000000000a', 'Intruso', 'comida', '+573000000009')$$,
  '42501', null,
  'anon cannot create a business'
);

select throws_ok(
  $$update public.products set price = 1 where id = 'aaaaaaaa-2222-4000-8000-0000000000a1'$$,
  '42501', null,
  'anon cannot edit products'
);

select ok(
  (select count(*) from public.nearby_businesses(4.81, -75.69)) >= 2,
  'anon can call nearby_businesses'
);

-- ---------------------------------------------------------------------------
-- Vendor A
-- ---------------------------------------------------------------------------
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-0000-4000-8000-00000000000a","role":"authenticated"}';

select is(
  array(select id from public.sales_entries),
  array['aaaaaaaa-3333-4000-8000-00000000000a'::uuid],
  'vendor A reads only their own sales'
);

select is(
  (select count(*)::int from public.products where business_id = 'aaaaaaaa-1111-4000-8000-00000000000a'),
  2,
  'vendor A sees their own inactive products'
);

select is(
  (select count(*)::int from public.products where business_id = 'bbbbbbbb-1111-4000-8000-00000000000b'),
  1,
  'vendor A does not see vendor B''s inactive products'
);

select is(
  (select count(*)::int from public.profiles),
  1,
  'vendor A reads only their own profile'
);

select throws_ok(
  $$insert into public.products (business_id, name, price)
    values ('bbbbbbbb-1111-4000-8000-00000000000b', 'Intruso', 1)$$,
  '42501', null,
  'vendor A cannot add a product to vendor B''s business'
);

select throws_ok(
  $$insert into public.sales_entries (business_id, product_id, units, sold_on)
    values ('bbbbbbbb-1111-4000-8000-00000000000b', 'bbbbbbbb-2222-4000-8000-0000000000b1', 99, '2026-10-02')$$,
  '42501', null,
  'vendor A cannot log sales for vendor B''s business'
);

select throws_ok(
  $$insert into public.sales_entries (business_id, product_id, units, sold_on, price_at_sale)
    values ('aaaaaaaa-1111-4000-8000-00000000000a', 'bbbbbbbb-2222-4000-8000-0000000000b1', 1, '2026-10-02', 1)$$,
  '23503', null,
  'vendor A cannot log vendor B''s product under their own business'
);

select throws_ok(
  $$update public.products set business_id = 'bbbbbbbb-1111-4000-8000-00000000000b'
     where id = 'aaaaaaaa-2222-4000-8000-0000000000a1'$$,
  '42501', null,
  'vendor A cannot move a product into vendor B''s business'
);

select throws_ok(
  $$update public.businesses set owner_id = 'bbbbbbbb-0000-4000-8000-00000000000b'
     where id = 'aaaaaaaa-1111-4000-8000-00000000000a'$$,
  '42501', null,
  'vendor A cannot hand their business to someone else'
);

select throws_ok(
  $$update public.profiles set role = 'admin' where id = 'aaaaaaaa-0000-4000-8000-00000000000a'$$,
  '42501', null,
  'vendor A cannot make themselves admin'
);

select throws_ok(
  $$insert into public.profiles (id, role, display_name)
    values ('dddddddd-0000-4000-8000-00000000000d', 'vendor', 'Suplantado')$$,
  '42501', null,
  'vendor A cannot create a profile for another user'
);

-- These hit no rows under RLS; the results are checked below as the service.
update public.products set price = 1 where id = 'bbbbbbbb-2222-4000-8000-0000000000b1';
delete from public.products where id = 'bbbbbbbb-2222-4000-8000-0000000000b2';
update public.businesses set name = 'Hackeado' where id = 'bbbbbbbb-1111-4000-8000-00000000000b';
update public.sales_entries set units = 0 where id = 'bbbbbbbb-3333-4000-8000-00000000000b';
delete from public.sales_entries where id = 'bbbbbbbb-3333-4000-8000-00000000000b';

-- ---------------------------------------------------------------------------
-- Consumer C and new user D
-- ---------------------------------------------------------------------------
reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"cccccccc-0000-4000-8000-00000000000c","role":"authenticated"}';

select throws_ok(
  $$insert into public.businesses (owner_id, name, category, whatsapp)
    values ('cccccccc-0000-4000-8000-00000000000c', 'Tienda C', 'comida', '+573000000003')$$,
  '42501', null,
  'a consumer cannot create a business'
);

select is(
  (select count(*)::int from public.sales_entries),
  0,
  'a consumer reads no sales'
);

reset role;
set local role authenticated;
set local request.jwt.claims = '{"sub":"dddddddd-0000-4000-8000-00000000000d","role":"authenticated"}';

select throws_ok(
  $$insert into public.profiles (id, role, display_name)
    values ('dddddddd-0000-4000-8000-00000000000d', 'admin', 'D')$$,
  '42501', null,
  'a new user cannot sign up as admin'
);

select lives_ok(
  $$insert into public.profiles (id, role, display_name)
    values ('dddddddd-0000-4000-8000-00000000000d', 'vendor', 'D')$$,
  'a new user can create their own vendor profile'
);

select lives_ok(
  $$insert into public.businesses (owner_id, name, category, whatsapp)
    values ('dddddddd-0000-4000-8000-00000000000d', 'Negocio D', 'comida', '+573000000004')$$,
  'a new vendor can create their business'
);

-- ---------------------------------------------------------------------------
-- Vendor B's data is untouched (checked as the service, which bypasses RLS)
-- ---------------------------------------------------------------------------
reset role;

select is(
  (select price from public.products where id = 'bbbbbbbb-2222-4000-8000-0000000000b1'),
  6000.00,
  'vendor B''s product price is unchanged'
);

select ok(
  exists (select 1 from public.products where id = 'bbbbbbbb-2222-4000-8000-0000000000b2'),
  'vendor B''s product was not deleted'
);

select is(
  (select name from public.businesses where id = 'bbbbbbbb-1111-4000-8000-00000000000b'),
  'Negocio B',
  'vendor B''s business is unchanged'
);

select is(
  (select units from public.sales_entries where id = 'bbbbbbbb-3333-4000-8000-00000000000b'),
  7,
  'vendor B''s sales entry is unchanged and not deleted'
);

select * from finish();
rollback;
