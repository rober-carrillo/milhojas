-- Demo data for local development (`supabase db reset`). Not pushed to the
-- hosted project. Three Pereira vendors, 12 products, a week of sales.
-- Sign in locally as any of them with a magic link; the email lands in the
-- local inbox (http://127.0.0.1:54324).

insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
                        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
                        created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-4111-8111-111111111111',
   'authenticated', 'authenticated', 'rosa@demo.milhojas.test', '', now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-4222-8222-222222222222',
   'authenticated', 'authenticated', 'jhon@demo.milhojas.test', '', now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-4333-8333-333333333333',
   'authenticated', 'authenticated', 'lucia@demo.milhojas.test', '', now(),
   '{"provider":"email","providers":["email"]}', '{}', now(), now());

insert into public.profiles (id, role, display_name, phone, locale)
values
  ('11111111-1111-4111-8111-111111111111', 'vendor', 'Rosa Marín', '+573001112233', 'es'),
  ('22222222-2222-4222-8222-222222222222', 'vendor', 'Jhon Ocampo', '+573104445566', 'es'),
  ('33333333-3333-4333-8333-333333333333', 'vendor', 'Lucía Giraldo', '+573207778899', 'es');

insert into public.businesses (id, owner_id, name, description, category, lat, lng,
                               is_open, whatsapp, currency)
values
  ('a1111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111',
   'Arepas Doña Rosa', 'Arepas de chócolo y aguapanela, junto a la Plaza de Bolívar.',
   'comida', 4.8143, -75.6946, true, '+573001112233', 'COP'),
  ('a2222222-2222-4222-8222-222222222222', '22222222-2222-4222-8222-222222222222',
   'Frutas La 19', 'Salpicón, jugos y fruta picada en la Calle 19.',
   'frutas', 4.8126, -75.6921, true, '+573104445566', 'COP'),
  ('a3333333-3333-4333-8333-333333333333', '33333333-3333-4333-8333-333333333333',
   'Tejidos Lucía', 'Manillas y mochilas tejidas a mano, Parque El Lago.',
   'artesanías', 4.8094, -75.6937, false, '+573207778899', 'COP');

insert into public.products (id, business_id, name, price, cost, is_active, sort_order)
values
  -- Arepas Doña Rosa
  ('b1000001-0000-4000-8000-000000000001', 'a1111111-1111-4111-8111-111111111111', 'Arepa de chócolo con quesito', 5000, 2200, true, 1),
  ('b1000001-0000-4000-8000-000000000002', 'a1111111-1111-4111-8111-111111111111', 'Arepa rellena de carne', 7000, 3500, true, 2),
  ('b1000001-0000-4000-8000-000000000003', 'a1111111-1111-4111-8111-111111111111', 'Aguapanela con queso', 3500, 1200, true, 3),
  ('b1000001-0000-4000-8000-000000000004', 'a1111111-1111-4111-8111-111111111111', 'Chocolate con arepa', 4500, 1800, false, 4),
  -- Frutas La 19
  ('b2000002-0000-4000-8000-000000000001', 'a2222222-2222-4222-8222-222222222222', 'Salpicón', 6000, 2500, true, 1),
  ('b2000002-0000-4000-8000-000000000002', 'a2222222-2222-4222-8222-222222222222', 'Mango biche con sal y limón', 4000, 1500, true, 2),
  ('b2000002-0000-4000-8000-000000000003', 'a2222222-2222-4222-8222-222222222222', 'Jugo de lulo', 4500, null, true, 3),
  ('b2000002-0000-4000-8000-000000000004', 'a2222222-2222-4222-8222-222222222222', 'Fresas con crema', 8000, 3800, true, 4),
  -- Tejidos Lucía
  ('b3000003-0000-4000-8000-000000000001', 'a3333333-3333-4333-8333-333333333333', 'Manilla tejida', 10000, 3000, true, 1),
  ('b3000003-0000-4000-8000-000000000002', 'a3333333-3333-4333-8333-333333333333', 'Mochila tejida', 120000, null, true, 2),
  ('b3000003-0000-4000-8000-000000000003', 'a3333333-3333-4333-8333-333333333333', 'Aretes de chaquira', 15000, 4000, true, 3),
  ('b3000003-0000-4000-8000-000000000004', 'a3333333-3333-4333-8333-333333333333', 'Llavero tejido', 6000, 1500, true, 4);

-- Last 7 days of tallies for Arepas Doña Rosa (active products only). The
-- snapshot trigger fills price_at_sale / cost_at_sale from the product.
insert into public.sales_entries (business_id, product_id, units, sold_on)
select p.business_id, p.id, 5 + ((d + p.sort_order * 3) % 9), current_date - d
  from public.products p
 cross join generate_series(0, 6) as d
 where p.business_id = 'a1111111-1111-4111-8111-111111111111'
   and p.is_active;
