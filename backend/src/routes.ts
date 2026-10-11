import {Router} from 'express';
import {z} from 'zod';

import {
  createSessionToken,
  hashPassword,
  hashSessionToken,
  requireAuth,
  sessionExpiry,
  verifyPassword,
} from './auth.js';
import {database} from './database.js';
import {BOOKING_TIME_SLOTS} from './bookingConstants.js';
import {
  BOOKING_TIME_ZONE,
  canFinishByClosing,
  isBookableDate,
  isValidBookingTime,
} from './bookingAvailability.js';

export const apiRouter = Router();
const authRouter = Router();

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});
const registrationSchema = credentialsSchema.extend({
  name: z.string().trim().min(2).max(80),
});

async function issueSession(customerId: string) {
  const token = createSessionToken();
  const expiresAt = sessionExpiry();
  await database.query(
    'INSERT INTO auth_sessions (token_hash, customer_id, expires_at) VALUES ($1, $2, $3)',
    [hashSessionToken(token), customerId, expiresAt],
  );
  return {token, expiresAt: expiresAt.toISOString()};
}

authRouter.post('/register', async (request, response, next) => {
  const parsed = registrationSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({error: 'Enter a name, valid email, and password of at least 8 characters.'});
    return;
  }

  try {
    const input = parsed.data;
    const passwordHash = await hashPassword(input.password);
    const inserted = await database.query<{id: string; name: string; email: string}>(
      `INSERT INTO customers (name, email, password_hash)
       VALUES ($1, lower($2), $3)
       RETURNING id, name, email`,
      [input.name, input.email, passwordHash],
    );
    const customer = inserted.rows[0];
    const session = await issueSession(customer.id);
    response.status(201).json({customer, ...session});
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      response.status(409).json({error: 'An account with that email already exists.'});
      return;
    }
    next(error);
  }
});

authRouter.post('/login', async (request, response, next) => {
  const parsed = credentialsSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({error: 'Enter a valid email and password.'});
    return;
  }

  try {
    const input = parsed.data;
    const found = await database.query<{
      id: string;
      name: string;
      email: string;
      passwordHash: string | null;
    }>(
      `SELECT id, name, email, password_hash AS "passwordHash"
       FROM customers WHERE lower(email) = lower($1)`,
      [input.email],
    );
    const candidate = found.rows[0];
    const matches = candidate?.passwordHash
      ? await verifyPassword(input.password, candidate.passwordHash)
      : (await hashPassword(input.password), false);
    if (!candidate || !matches) {
      response.status(401).json({error: 'Email or password is incorrect.'});
      return;
    }

    const session = await issueSession(candidate.id);
    response.json({
      customer: {id: candidate.id, name: candidate.name, email: candidate.email},
      ...session,
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/logout', requireAuth, async (request, response, next) => {
  try {
    await database.query('DELETE FROM auth_sessions WHERE token_hash = $1', [request.auth!.sessionHash]);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', requireAuth, (_request, response) => {
  const {id, name, email} = _request.auth!;
  response.json({id, name, email});
});

authRouter.patch('/me', requireAuth, async (request, response, next) => {
  const parsed = z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email().max(254),
  }).safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({error: 'Enter a name and valid email address.'});
    return;
  }

  try {
    const updated = await database.query<{id: string; name: string; email: string}>(
      `UPDATE customers SET name = $1, email = lower($2)
       WHERE id = $3 RETURNING id, name, email`,
      [parsed.data.name, parsed.data.email, request.auth!.id],
    );
    response.json(updated.rows[0]);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
      response.status(409).json({error: 'An account with that email already exists.'});
      return;
    }
    next(error);
  }
});

apiRouter.use('/auth', authRouter);

const serviceSelect = `
  SELECT
    id,
    salon_id AS "salonId",
    name,
    description,
    duration_minutes AS "durationMinutes",
    price
  FROM services
`;

const salonSelect = `
  SELECT
    salons.id,
    salons.name,
    salons.location,
    salons.address,
    salons.phone,
    salons.rating::float8 AS rating,
    0::integer AS "reviewCount",
    salons.image_url AS "imageUrl",
    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'id', services.id,
            'salonId', services.salon_id,
            'name', services.name,
            'description', services.description,
            'durationMinutes', services.duration_minutes,
            'price', services.price
          )
          ORDER BY services.price
        )
        FROM services
        WHERE services.salon_id = salons.id
      ),
      '[]'::json
    ) AS services
  FROM salons
`;

const bookingSelect = `
  SELECT
    bookings.id,
    bookings.customer_id AS "customerId",
    bookings.salon_id AS "salonId",
    bookings.service_id AS "serviceId",
    to_char(bookings.starts_at AT TIME ZONE $2, 'YYYY-MM-DD') AS date,
    to_char(bookings.starts_at AT TIME ZONE $2, 'HH12:MI AM') AS time,
    bookings.payment_method AS "paymentMethod",
    bookings.status,
    bookings.created_at AS "createdAt",
    salons.name AS "salonName",
    string_agg(services.name, ' + ' ORDER BY booking_services.position) AS "serviceName"
  FROM bookings
  JOIN salons ON salons.id = bookings.salon_id
  JOIN booking_services ON booking_services.booking_id = bookings.id
  JOIN services ON services.id = booking_services.service_id
`;

apiRouter.get('/salons', async (_request, response, next) => {
  try {
    const result = await database.query(
      `${salonSelect} ORDER BY salons.rating DESC`,
    );
    response.json(result.rows);
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/salons/:id', async (request, response, next) => {
  try {
    const result = await database.query(
      `${salonSelect} WHERE salons.id = $1`,
      [request.params.id],
    );
    if (!result.rows[0]) {
      return response.status(404).json({error: 'Salon not found.'});
    }
    return response.json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

apiRouter.get('/salons/:id/services', async (request, response, next) => {
  try {
    const result = await database.query(
      `${serviceSelect} WHERE salon_id = $1 ORDER BY price`,
      [request.params.id],
    );
    response.json(result.rows);
  } catch (error) {
    next(error);
  }
});

const availabilityQuerySchema = z.object({
  date: z.iso.date(),
  serviceIds: z.string().min(1),
});

apiRouter.get('/salons/:id/availability', async (request, response, next) => {
  const parsed = availabilityQuerySchema.safeParse(request.query);
  if (!parsed.success) {
    response.status(400).json({error: 'Choose a valid date and service.'});
    return;
  }

  const salonId = z.string().uuid().safeParse(request.params.id);
  const serviceIds = parsed.data.serviceIds.split(',');
  if (
    !salonId.success ||
    serviceIds.some(id => !z.string().uuid().safeParse(id).success) ||
    new Set(serviceIds).size !== serviceIds.length
  ) {
    response.status(400).json({error: 'Choose a valid salon and service.'});
    return;
  }

  if (!isBookableDate(parsed.data.date)) {
    response.status(400).json({
      error: 'Choose a date from today through one month from today.',
    });
    return;
  }

  try {
    const serviceResult = await database.query<{
      durationMinutes: number;
      serviceCount: number;
    }>(
      `SELECT
         SUM(duration_minutes)::integer AS "durationMinutes",
         COUNT(*)::integer AS "serviceCount"
       FROM services
       WHERE salon_id = $1 AND id = ANY($2::uuid[])`,
      [salonId.data, serviceIds],
    );
    const durationMinutes = serviceResult.rows[0]?.durationMinutes;
    if (
      !durationMinutes ||
      serviceResult.rows[0]?.serviceCount !== serviceIds.length
    ) {
      response.status(404).json({error: 'Service not found.'});
      return;
    }

    const offeredValues = BOOKING_TIME_SLOTS.map(
      (_slot, index) => `($${index + 1}::text)`,
    ).join(', ');
    const availability = await database.query<{time: string; available: boolean}>(
      `WITH offered(time) AS (VALUES ${offeredValues})
       SELECT
         offered.time,
         (
           proposed.starts_at > now()
           AND proposed.ends_at <= proposed.closes_at
           AND NOT EXISTS (
             SELECT 1
             FROM bookings
             WHERE bookings.salon_id = $${BOOKING_TIME_SLOTS.length + 1}
               AND bookings.status <> 'CANCELLED'
               AND tstzrange(bookings.starts_at, bookings.ends_at, '[)')
                 && tstzrange(proposed.starts_at, proposed.ends_at, '[)')
           )
         ) AS available
       FROM offered
       CROSS JOIN LATERAL (
         SELECT
           (($${BOOKING_TIME_SLOTS.length + 3}::date + offered.time::time)
             AT TIME ZONE $${BOOKING_TIME_SLOTS.length + 4}) AS starts_at,
           ((($${BOOKING_TIME_SLOTS.length + 3}::date + offered.time::time)
             + make_interval(mins => $${BOOKING_TIME_SLOTS.length + 2}))
             AT TIME ZONE $${BOOKING_TIME_SLOTS.length + 4}) AS ends_at,
           (($${BOOKING_TIME_SLOTS.length + 3}::date + TIME '20:00')
             AT TIME ZONE $${BOOKING_TIME_SLOTS.length + 4}) AS closes_at
       ) AS proposed
       ORDER BY offered.time::time`,
      [
        ...BOOKING_TIME_SLOTS,
        salonId.data,
        durationMinutes,
        parsed.data.date,
        BOOKING_TIME_ZONE,
      ],
    );

    response.json({date: parsed.data.date, slots: availability.rows});
  } catch (error) {
    next(error);
  }
});

const bookingSchema = z.object({
  salonId: z.string().uuid(),
  serviceId: z.string().uuid().optional(),
  serviceIds: z.array(z.string().uuid()).min(1).optional(),
  date: z.iso.date(),
  time: z
    .string()
    .regex(/^(?:([01]\d|2[0-3]):[0-5]\d|(0?[1-9]|1[0-2]):[0-5]\d (?:AM|PM))$/),
  paymentMethod: z.literal('PAY_AT_SALON'),
})
  .refine(input => Boolean(input.serviceIds?.length || input.serviceId), {
    path: ['serviceIds'],
  })
  .refine(
    input =>
      !input.serviceIds ||
      new Set(input.serviceIds).size === input.serviceIds.length,
    {path: ['serviceIds']},
  )
  .transform(input => ({
    ...input,
    serviceIds: input.serviceIds ?? [input.serviceId as string],
  }));

function toTwentyFourHourTime(time: string): string {
  const match = time.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
  if (!match) {
    return time;
  }

  const hour = (Number(match[1]) % 12) + (match[3] === 'PM' ? 12 : 0);
  return `${String(hour).padStart(2, '0')}:${match[2]}`;
}

apiRouter.post('/bookings', requireAuth, async (request, response, next) => {
  try {
    const input = bookingSchema.parse(request.body);
    if (!isBookableDate(input.date)) {
      return response.status(400).json({
        error: 'Choose a date from today through one month from today.',
      });
    }
    if (!isValidBookingTime(input.time)) {
      return response.status(400).json({error: 'Choose a valid appointment time.'});
    }
    const time24Hour = toTwentyFourHourTime(input.time);
    const client = await database.connect();

    try {
      await client.query('BEGIN');
      const servicesResult = await client.query<{
        id: string;
        durationMinutes: number;
      }>(
        `
          SELECT
            id,
            duration_minutes AS "durationMinutes"
          FROM services
          WHERE salon_id = $1 AND id = ANY($2::uuid[])
        `,
        [input.salonId, input.serviceIds],
      );

      if (servicesResult.rows.length !== input.serviceIds.length) {
        await client.query('ROLLBACK');
        return response.status(404).json({error: 'Service not found.'});
      }

      const selectedServices = input.serviceIds.map(serviceId =>
        servicesResult.rows.find(service => service.id === serviceId),
      );
      const totalDuration = selectedServices.reduce(
        (total, service) => total + (service?.durationMinutes ?? 0),
        0,
      );
      if (!canFinishByClosing(input.time, totalDuration)) {
        await client.query('ROLLBACK');
        return response.status(400).json({
          error: 'The selected services must finish by 8:00 PM.',
        });
      }
      const futureCheck = await client.query<{
        isFuture: boolean;
        finishesByClosing: boolean;
      }>(
        `SELECT
           (($1::date + $2::time) AT TIME ZONE $3) > now() AS "isFuture",
           ($1::date + $2::time + make_interval(mins => $4))
             <= ($1::date + TIME '20:00') AS "finishesByClosing"`,
        [input.date, time24Hour, BOOKING_TIME_ZONE, totalDuration],
      );
      if (!futureCheck.rows[0]?.isFuture) {
        await client.query('ROLLBACK');
        return response.status(400).json({
          error: 'Choose an appointment time that has not passed.',
        });
      }
      if (!futureCheck.rows[0]?.finishesByClosing) {
        await client.query('ROLLBACK');
        return response.status(400).json({
          error: 'The selected services must finish by 8:00 PM.',
        });
      }
      const result = await client.query(
        `
        INSERT INTO bookings (
          customer_id,
          salon_id,
          service_id,
          starts_at,
          ends_at,
          payment_method
        )
        SELECT
          $1,
          $2,
          $3,
          (($4::date + $5::time) AT TIME ZONE $8),
          (($4::date + $5::time) AT TIME ZONE $8)
            + make_interval(mins => $6),
          $7
        RETURNING
          id,
          customer_id AS "customerId",
          salon_id AS "salonId",
          service_id AS "serviceId",
          to_char(starts_at AT TIME ZONE $8, 'YYYY-MM-DD') AS date,
          to_char(starts_at AT TIME ZONE $8, 'HH12:MI AM') AS time,
          payment_method AS "paymentMethod",
          status,
          created_at AS "createdAt"
      `,
      [
        request.auth!.id,
        input.salonId,
        input.serviceIds[0],
        input.date,
        time24Hour,
        totalDuration,
        input.paymentMethod,
        BOOKING_TIME_ZONE,
      ],
      );
      const booking = result.rows[0];
      if (!booking) {
        await client.query('ROLLBACK');
        return response.status(409).json({
          error: 'That appointment time is no longer available.',
        });
      }

      await client.query(
        `
          INSERT INTO booking_services (booking_id, service_id, position)
          SELECT $1, selected.service_id, selected.position::integer
          FROM unnest($2::uuid[]) WITH ORDINALITY
            AS selected(service_id, position)
        `,
        [booking.id, input.serviceIds],
      );
      await client.query('COMMIT');
      return response.status(201).json(booking);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return response.status(400).json({
        error: 'Please check the booking details and try again.',
      });
    }

    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = error.code;
      if (code === '23P01') {
        return response.status(409).json({
          error: 'That appointment time is no longer available.',
        });
      }
      if (code === '23503') {
        return response.status(400).json({
          error: 'The selected customer, salon, or service is invalid.',
        });
      }
    }

    return next(error);
  }
});

async function getCustomerBookings(customerId: string, response: import('express').Response, next: import('express').NextFunction) {
  try {
    const result = await database.query(
      `
        ${bookingSelect}
        WHERE bookings.customer_id = $1
        GROUP BY bookings.id, salons.name
        ORDER BY bookings.starts_at DESC
      `,
      [customerId, BOOKING_TIME_ZONE],
    );
    response.json(result.rows);
  } catch (error) {
    next(error);
  }
}

apiRouter.get('/bookings', requireAuth, (request, response, next) => {
  void getCustomerBookings(request.auth!.id, response, next);
});

apiRouter.get('/bookings/:customerId', requireAuth, (request, response, next) => {
  if (request.params.customerId !== request.auth!.id) {
    response.status(403).json({error: 'You cannot access another customer’s bookings.'});
    return;
  }
  void getCustomerBookings(request.auth!.id, response, next);
});
