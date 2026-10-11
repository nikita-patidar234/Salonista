CREATE TABLE IF NOT EXISTS booking_services (
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id),
  position INTEGER NOT NULL CHECK (position > 0),
  PRIMARY KEY (booking_id, service_id),
  UNIQUE (booking_id, position)
);

INSERT INTO booking_services (booking_id, service_id, position)
SELECT id, service_id, 1
FROM bookings
ON CONFLICT (booking_id, service_id) DO NOTHING;
