-- Schema behaviour: sales snapshots, one tally row per product per day,
-- delete rules, input checks and nearby_businesses. Run with `pnpm db:test`.
begin;
create extension if not exists pgtap with schema extensions;
select plan(13);

insert into auth.users (id, email) values
  ('eeeeeeee-0000-4000-8000-00000000000e', 'e@test.milhojas');

insert into public.profiles (id, role, display_name) values
  ('eeeeeeee-0000-4000-8000-00000000000e', 'vendor', 'Vendor E');

-- Three businesses roughly 0, 1.1 and 11 km north of a point far from the seed data.
insert into public.businesses (id, owner_id, name, category, lat, lng, whatsapp) values
  ('eeeeeeee-1111-4000-8000-000000000001', 'eeeeeeee-0000-4000-8000-00000000000e', 'Cerca', 'comida', 10.00, -70.00, '+573000000011'),
  ('eeeeeeee-1111-4000-8000-000000000002', 'eeeeeeee-0000-4000-8000-00000000000e', 'Medio', 'comida', 10.01, -70.00, '+573000000012'),
  ('eeeeeeee-1111-4000-8000-000000000003', 'eeeeeeee-0000-4000-8000-00000000000e', 'Lejos', 'comida', 10.10, -70.00, '+573000000013'),
  ('eeeeeeee-1111-4000-8000-000000000004', 'eeeeeeee-0000-4000-8000-00000000000e', 'Sin mapa', 'comida', null, null, '+573000000014');

insert into public.products (id, business_id, name, price, cost) values
  ('eeeeeeee-2222-4000-8000-000000000001', 'eeeeeeee-1111-4000-8000-000000000001', 'Empanada', 2500, 900),
  ('eeeeeeee-2222-4000-8000-000000000002', 'eeeeeeee-1111-4000-8000-000000000001', 'Gaseosa', 3000, null);

set local role authenticated;
set local request.jwt.claims = '{"sub":"eeeeeeee-0000-4000-8000-00000000000e","role":"authenticated"}';

-- Snapshots ------------------------------------------------------------------
insert into public.sales_entries (business_id, product_id, units, sold_on) values
  ('eeeeeeee-1111-4000-8000-000000000001', 'eeeeeeee-2222-4000-8000-000000000001', 12, '2026-10-01');

select results_eq(
  $$select price_at_sale, cost_at_sale from public.sales_entries
     where product_id = 'eeeeeeee-2222-4000-8000-000000000001' and sold_on = '2026-10-01'$$,
  $$values (2500.00::numeric, 900.00::numeric)$$,
  'a sale without prices snapshots the product price and cost'
);

update public.products set price = 2800, cost = 1000 where id = 'eeeeeeee-2222-4000-8000-000000000001';

select is(
  (select price_at_sale from public.sales_entries
    where product_id = 'eeeeeeee-2222-4000-8000-000000000001' and sold_on = '2026-10-01'),
  2500.00,
  'changing the product price later does not change past sales'
);

insert into public.sales_entries (business_id, product_id, units, sold_on, price_at_sale, cost_at_sale) values
  ('eeeeeeee-1111-4000-8000-000000000001', 'eeeeeeee-2222-4000-8000-000000000002', 3, '2026-10-01', 2900, null);

select is(
  (select price_at_sale from public.sales_entries
    where product_id = 'eeeeeeee-2222-4000-8000-000000000002' and sold_on = '2026-10-01'),
  2900.00,
  'a price sent by the client (offline queue) is kept'
);

-- One row per product per day ------------------------------------------------
select throws_ok(
  $$insert into public.sales_entries (business_id, product_id, units, sold_on) values
    ('eeeeeeee-1111-4000-8000-000000000001', 'eeeeeeee-2222-4000-8000-000000000001', 1, '2026-10-01')$$,
  '23505', null,
  'a second row for the same product and day is rejected'
);

insert into public.sales_entries (business_id, product_id, units, sold_on) values
  ('eeeeeeee-1111-4000-8000-000000000001', 'eeeeeeee-2222-4000-8000-000000000001', 15, '2026-10-01')
on conflict (product_id, sold_on) do update set units = excluded.units;

select results_eq(
  $$select units, price_at_sale from public.sales_entries
     where product_id = 'eeeeeeee-2222-4000-8000-000000000001' and sold_on = '2026-10-01'$$,
  $$values (15, 2500.00::numeric)$$,
  'saving the same day again updates units and keeps the original snapshot'
);

-- Delete rules ---------------------------------------------------------------
select throws_ok(
  $$delete from public.products where id = 'eeeeeeee-2222-4000-8000-000000000001'$$,
  '23503', null,
  'a product with sales history cannot be deleted'
);

-- Input checks ---------------------------------------------------------------
select throws_ok(
  $$insert into public.businesses (owner_id, name, category, whatsapp) values
    ('eeeeeeee-0000-4000-8000-00000000000e', 'X', 'comida', '3001234567')$$,
  '23514', null,
  'WhatsApp numbers must be in +countrycode form'
);

select throws_ok(
  $$insert into public.businesses (owner_id, name, category, whatsapp, lat) values
    ('eeeeeeee-0000-4000-8000-00000000000e', 'X', 'comida', '+573001234567', 4.8)$$,
  '23514', null,
  'lat and lng are set together'
);

select throws_ok(
  $$insert into public.products (business_id, name, price) values
    ('eeeeeeee-1111-4000-8000-000000000001', 'X', -1)$$,
  '23514', null,
  'prices cannot be negative'
);

-- nearby_businesses ----------------------------------------------------------
select is(
  array(select name from public.nearby_businesses(10.00, -70.00)),
  array['Cerca', 'Medio', 'Lejos'],
  'nearby_businesses orders by distance and skips businesses without a location'
);

select is(
  array(select name from public.nearby_businesses(10.00, -70.00, max_km => 5)),
  array['Cerca', 'Medio'],
  'nearby_businesses respects max_km'
);

select ok(
  (select distance_km from public.nearby_businesses(10.00, -70.00) where name = 'Medio')
    between 1.0 and 1.2,
  'nearby_businesses distance is in kilometres'
);

-- Deleting the whole business removes its products and sales ------------------
delete from public.businesses where id = 'eeeeeeee-1111-4000-8000-000000000001';

select is(
  (select count(*)::int from public.sales_entries
    where business_id = 'eeeeeeee-1111-4000-8000-000000000001'),
  0,
  'deleting a business removes its products and sales'
);

select * from finish();
rollback;
