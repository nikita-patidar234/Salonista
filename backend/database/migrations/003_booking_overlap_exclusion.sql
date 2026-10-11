CREATE EXTENSION IF NOT EXISTS btree_gist;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'bookings'::regclass
      AND contype = 'x'
      AND pg_get_constraintdef(oid) ILIKE '%salon_id WITH =%'
      AND pg_get_constraintdef(oid) ILIKE '%tstzrange(starts_at, ends_at%'
  ) THEN
    ALTER TABLE bookings
      ADD CONSTRAINT bookings_no_overlapping_salon_times
      EXCLUDE USING gist (
        salon_id WITH =,
        tstzrange(starts_at, ends_at, '[)') WITH &&
      )
      WHERE (status <> 'CANCELLED');
  END IF;
END
$$;
