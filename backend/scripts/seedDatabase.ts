import 'dotenv/config';

import {readFile} from 'node:fs/promises';

import {database} from '../src/database.js';

async function seedDatabase() {
  const seed = await readFile(
    new URL('../database/seed.sql', import.meta.url),
    'utf8',
  );
  const client = await database.connect();

  try {
    await client.query('BEGIN');
    await client.query(seed);
    await client.query('COMMIT');
    console.log('Salonista demo data seeded.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await database.end();
  }
}

seedDatabase().catch(error => {
  console.error('Salonista database seed failed.');
  console.error(error instanceof Error ? error.message : 'Unknown error.');
  process.exitCode = 1;
});
