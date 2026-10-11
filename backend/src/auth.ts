import {createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual} from 'node:crypto';
import type {NextFunction, Request, Response} from 'express';

import {database} from './database.js';

const SESSION_LIFETIME_DAYS = 30;
const SCRYPT_COST = 16_384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const HASH_BYTES = 64;

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      HASH_BYTES,
      {N: SCRYPT_COST, r: SCRYPT_BLOCK_SIZE, p: SCRYPT_PARALLELIZATION},
      (error, key) => error ? reject(error) : resolve(key as Buffer),
    );
  });
}

export interface AuthCustomer {
  id: string;
  name: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthCustomer & {sessionHash: string};
    }
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = await deriveKey(password, salt);

  return [
    'scrypt',
    SCRYPT_COST,
    SCRYPT_BLOCK_SIZE,
    SCRYPT_PARALLELIZATION,
    salt.toString('base64url'),
    derivedKey.toString('base64url'),
  ].join('$');
}

export async function verifyPassword(
  password: string,
  encodedHash: string,
): Promise<boolean> {
  const [algorithm, costText, blockSizeText, parallelText, saltText, keyText] =
    encodedHash.split('$');
  if (
    algorithm !== 'scrypt' ||
    costText !== String(SCRYPT_COST) ||
    blockSizeText !== String(SCRYPT_BLOCK_SIZE) ||
    parallelText !== String(SCRYPT_PARALLELIZATION) ||
    !saltText ||
    !keyText
  ) {
    return false;
  }

  const salt = Buffer.from(saltText, 'base64url');
  const expected = Buffer.from(keyText, 'base64url');
  if (salt.length !== 16 || expected.length !== HASH_BYTES) {
    return false;
  }

  const actual = await deriveKey(password, salt);
  return timingSafeEqual(actual, expected);
}

export function createSessionToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function sessionExpiry(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_LIFETIME_DAYS);
  return expiresAt;
}

export async function requireAuth(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authorization = request.header('authorization');
  const match = authorization?.match(/^Bearer ([A-Za-z0-9_-]{40,})$/);
  if (!match) {
    response.status(401).json({error: 'Please sign in to continue.'});
    return;
  }

  const sessionHash = hashSessionToken(match[1]);
  try {
    const result = await database.query<AuthCustomer>(
      `
        SELECT customers.id, customers.name, customers.email
        FROM auth_sessions
        JOIN customers ON customers.id = auth_sessions.customer_id
        WHERE auth_sessions.token_hash = $1
          AND auth_sessions.expires_at > now()
      `,
      [sessionHash],
    );
    if (!result.rows[0]) {
      response.status(401).json({error: 'Your session has expired. Please sign in again.'});
      return;
    }

    request.auth = {...result.rows[0], sessionHash};
    next();
  } catch (error) {
    next(error);
  }
}
