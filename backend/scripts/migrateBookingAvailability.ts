import 'dotenv/config';

import {readFile} from 'node:fs/promises';

import {database} from '../src/database.js';

async function migrateBookingAvailability() {
  const migration = await readFile(
    new URL('../database/migrations/003_booking_overlap_exclusion.sql', import.meta.url),
    'utf8',
  );
  const client = await database.connect();

  try {
    await client.query('BEGIN');
    await client.query(migration);
    await client.query('COMMIT');
    console.log('Booking availability migration applied.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await database.end();
  }
}

migrateBookingAvailability().catch(error => {
  console.error('Booking availability migration failed.');
  console.error(error instanceof Error ? error.message : 'Unknown error.');
  process.exitCode = 1;
});
