import 'dotenv/config';

import {readFile} from 'node:fs/promises';

import {database} from '../src/database.js';

async function migrateBookingServices() {
  const migration = await readFile(
    new URL('../database/migrations/001_booking_services.sql', import.meta.url),
    'utf8',
  );
  const client = await database.connect();

  try {
    await client.query('BEGIN');
    await client.query(migration);
    await client.query('COMMIT');
    console.log('Booking services migration applied.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await database.end();
  }
}

migrateBookingServices().catch(error => {
  console.error('Booking services migration failed.');
  console.error(error instanceof Error ? error.message : 'Unknown error.');
  process.exitCode = 1;
});
