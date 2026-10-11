ALTER TABLE salons ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT '';

INSERT INTO customers (id, name, email)
VALUES (
  '33333333-3333-4333-8333-333333333333',
  'Salonista Guest',
  'guest@salonista.local'
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    email = EXCLUDED.email;

INSERT INTO salons (id, name, location, address, phone, rating, image_url)
VALUES (
  '11111111-1111-4111-8111-111111111111',
  'Velvet Studio',
  'Bandra West, Mumbai',
  '14 Chapel Road, Bandra West, Mumbai',
  '+912226420101',
  4.8,
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=85'
), (
  '11111111-1111-4111-8111-111111111112',
  'Olive & Orchid',
  'Juhu, Mumbai',
  'Shop 3, Juhu Tara Road, Juhu, Mumbai',
  '+912226420102',
  4.7,
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85'
), (
  '11111111-1111-4111-8111-111111111113',
  'The Polish Room',
  'Lower Parel, Mumbai',
  'Unit 12, Mathuradas Mills Road, Lower Parel, Mumbai',
  '+912226420103',
  4.6,
  'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1200&q=85'
), (
  '11111111-1111-4111-8111-111111111114',
  'Mane & Muse',
  'Andheri West, Mumbai',
  '18 Lokhandwala Market, Andheri West, Mumbai',
  '+912226420104',
  4.5,
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=85'
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    location = EXCLUDED.location,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    rating = EXCLUDED.rating,
    image_url = EXCLUDED.image_url;

INSERT INTO services (id, salon_id, name, description, duration_minutes, price)
VALUES
  (
    '22222222-2222-4222-8222-222222222221',
    '11111111-1111-4111-8111-111111111111',
    'Signature Haircut',
    'Consultation, precision cut, and polished finish.',
    60,
    1800
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    'Root Touch-up',
    'Natural-looking colour refresh with a nourishing finish.',
    90,
    3200
  ),
  (
    '22222222-2222-4222-8222-222222222223',
    '11111111-1111-4111-8111-111111111111',
    'Silk Blowout',
    'A smooth, long-lasting blowout tailored to your hair.',
    45,
    1200
  ),
  (
    '22222222-2222-4222-8222-222222222224',
    '11111111-1111-4111-8111-111111111111',
    'Express Trim',
    'A quick shape-up and tidy finish between full cuts.',
    30,
    900
  ),
  (
    '22222222-2222-4222-8222-222222222225',
    '11111111-1111-4111-8111-111111111112',
    'Hydrating Facial',
    'A gentle cleanse and moisture treatment for a fresh glow.',
    60,
    2400
  ),
  (
    '22222222-2222-4222-8222-222222222226',
    '11111111-1111-4111-8111-111111111112',
    'Classic Manicure',
    'Nail shaping, cuticle care, and your choice of polish.',
    45,
    1100
  ),
  (
    '22222222-2222-4222-8222-222222222227',
    '11111111-1111-4111-8111-111111111113',
    'Gel Manicure',
    'Long-wear gel colour with careful nail preparation.',
    60,
    1600
  ),
  (
    '22222222-2222-4222-8222-222222222228',
    '11111111-1111-4111-8111-111111111113',
    'Spa Pedicure',
    'A relaxing soak, exfoliation, and polished finish.',
    60,
    1800
  ),
  (
    '22222222-2222-4222-8222-222222222229',
    '11111111-1111-4111-8111-111111111114',
    'Balayage Consultation',
    'A personalised colour consultation and hair assessment.',
    45,
    500
  ),
  (
    '22222222-2222-4222-8222-222222222230',
    '11111111-1111-4111-8111-111111111114',
    'Deep Conditioning Ritual',
    'A restorative treatment for softer, smoother hair.',
    45,
    1500
  )
ON CONFLICT (id) DO UPDATE
SET salon_id = EXCLUDED.salon_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    duration_minutes = EXCLUDED.duration_minutes,
    price = EXCLUDED.price;
