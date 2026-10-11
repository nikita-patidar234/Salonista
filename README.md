# Salonista

Salonista is a mobile salon discovery and appointment booking app. Customers can browse salons and services, select one or more services, book a time, and view their booking history.

The repository contains a React Native CLI mobile app in `frontend/` and a REST API in `backend/`. Customer accounts use backend scrypt password hashes and expiring bearer sessions. The mobile client stores its session token in iOS Keychain or Android Keystore.

## Technologies

- **Frontend:** React Native 0.87, React 19, TypeScript, React Navigation, Axios, `react-native-keychain`
- **Backend:** Node.js, Express 5, TypeScript, Zod, Node.js `scrypt` password hashing
- **Database:** PostgreSQL (including the `btree_gist` extension for appointment conflict checks)
- **Native tooling:** Xcode and CocoaPods for iOS; Android Studio and the Android SDK for Android

## Prerequisites

- Node.js 22.11 or later and npm
- PostgreSQL with permission to create the `btree_gist` extension
- For iOS: macOS, Xcode, and CocoaPods
- For Android: Android Studio, Android SDK, and an emulator or device

## Installation

Install frontend and backend packages separately:

```sh
cd frontend
npm ci
cd ../backend
npm ci
```

## Database setup

Create a PostgreSQL database named `salonista` (or choose another name and update `DATABASE_URL` below). For example, using `createdb`:

```sh
createdb salonista
```

Apply the schema and sample records from the repository root:

```sh
psql "postgresql://postgres:postgres@localhost:5432/salonista" -f backend/database/schema.sql
psql "postgresql://postgres:postgres@localhost:5432/salonista" -f backend/database/seed.sql
```

Replace the connection string with your PostgreSQL username, password, host, port, and database. The schema creates `btree_gist`; the database role must be allowed to install that extension. The seed adds a guest customer, four sample salons with demo phone numbers, and sample services. It is safe to rerun for the seeded IDs. The seed also adds the `phone` column to an existing `salons` table when needed. Replace demo contact data before using the app with real customers.

If you already have a database created from an older schema without multi-service booking support, run `npm run db:migrate:booking-services` from `backend/` after setting `DATABASE_URL`. For a fresh database, use `schema.sql` and skip this migration.

For older databases, ensure active bookings cannot overlap by running the availability migration from `backend/`:

```sh
npm run db:migrate:availability
```

For a database created before customer authentication was added, apply the auth migration from `backend/` after setting `DATABASE_URL`:

```sh
npm run db:migrate:auth
```

## Environment variables

Create the backend environment file:

```sh
cp backend/.env.example backend/.env
```

Set these backend variables in `backend/.env`:

| Variable | Purpose | Example |
| --- | --- | --- |
| `NODE_ENV` | Runtime environment | `development` |
| `PORT` | API listening port | `4000` |
| `DATABASE_URL` | PostgreSQL connection URL | `postgresql://postgres:postgres@localhost:5432/salonista` |
| `BOOKING_TIME_ZONE` | IANA time zone used to interpret salon booking dates and times | `Asia/Kolkata` |

The current React Native API client uses a platform-specific local API address in `frontend/src/services/api/apiClient.ts`. For a physical device, change the host to your development computer's LAN IP address before running the app:

- iOS Simulator: `127.0.0.1`
- Android Emulator: `10.0.2.2` (already configured)
- Physical device: your development computer's LAN IP address

On a physical device, ensure the phone and computer can reach each other on the network and that the API server is listening on a reachable interface.

## Run the backend

From `backend/`, with PostgreSQL running and `backend/.env` configured:

```sh
npm run dev
```

The API listens on `http://localhost:4000` by default. Check the database connection at `http://localhost:4000/api/health`. To run without watch mode, use `npm start`.

In development, the backend terminal logs each request's method, route, status, and duration. The React Native developer console logs failed API routes and HTTP/network status without logging passwords, request bodies, authorization headers, or session tokens.

Run the backend type check from `backend/` with `npm run typecheck`.

## Run the frontend

Start Metro in one terminal:

```sh
cd frontend
npm start
```

In another terminal, launch a simulator or connected device:

```sh
cd frontend
npm run ios
# or
npm run android
```

For iOS, install native dependencies on the first setup (and after native dependency changes):

```sh
cd frontend
bundle install
bundle exec pod install
```

Run the frontend type check from `frontend/` with `npx tsc --noEmit`.

Complete the [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment) for the platform you use. The API must be running and reachable from the simulator/device.

## API endpoints

All application endpoints are prefixed with `/api`. Responses use JSON.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Checks API and database availability |
| `POST` | `/api/auth/register` | Creates an account and returns a session |
| `POST` | `/api/auth/login` | Authenticates and returns a session |
| `POST` | `/api/auth/logout` | Revokes the current session |
| `GET` | `/api/auth/me` | Returns the signed-in customer's profile |
| `PATCH` | `/api/auth/me` | Updates the signed-in customer's name and email |
| `GET` | `/api/salons` | Lists salons, including their phone numbers and services |
| `GET` | `/api/salons/:id` | Gets salon details, phone number, and services; returns 404 if missing |
| `GET` | `/api/salons/:id/services` | Lists services for a salon |
| `GET` | `/api/salons/:id/availability?date=YYYY-MM-DD&serviceIds=<uuid,...>` | Checks the existing booking times against active bookings and selected service duration |
| `POST` | `/api/bookings` | Creates an appointment for the signed-in customer |
| `GET` | `/api/bookings` | Lists the signed-in customer's bookings |

Authenticated requests other than registration and login require `Authorization: Bearer <token>`. Registration accepts `name`, `email`, and a password between 8 and 128 characters. Booking requests accept `salonId`, `date` (`YYYY-MM-DD`), hourly start times from 10:00 AM through 7:00 PM, and `paymentMethod: "PAY_AT_SALON"`. Services must finish by 8:00 PM. Select services with `serviceIds` (a non-empty array of UUIDs) or the legacy single `serviceId` field. The customer is derived from the session; clients cannot choose a booking owner. Booking dates run from today through one calendar month from today in `BOOKING_TIME_ZONE`; submitted local date/time values are interpreted in that zone. A time conflict returns HTTP 409; invalid input returns HTTP 400.

Example:

```json
{
  "salonId": "11111111-1111-4111-8111-111111111111",
  "serviceIds": ["22222222-2222-4222-8222-222222222221"],
  "date": "2026-10-20",
  "time": "10:00 AM",
  "paymentMethod": "PAY_AT_SALON"
}
```

## Assumptions

- Salon discovery and details are available without an account; booking and customer profile/history actions require an account.
- Prices are stored as integer amounts and the seed data uses Indian rupees; no currency conversion is performed.
- Payment is collected at the salon. The API only accepts `PAY_AT_SALON`.
- Booking dates and times are salon-local date/time values interpreted in `BOOKING_TIME_ZONE` (default `Asia/Kolkata`).

## Known limitations

- Frontend API host configuration is hard-coded in the API client; physical device users must edit it to use their computer's LAN IP.
- The seeded guest account has no password and cannot sign in; create an account in the app to use authenticated features.
- Seed salon names, addresses, phone numbers, ratings, and images are sample content and do not represent verified businesses.
- There is no per-salon opening-hours model. The app uses the 10:00 AM–8:00 PM business window with hourly appointment starts; the last start is 7:00 PM so services can finish by closing. The API checks active booking overlaps and selected service duration. Adding salon-specific hours requires an opening-hours data model.
- Ratings are seeded/static and the API currently reports a review count of zero.
- There is no Docker or one-command setup; PostgreSQL and each app process are started separately.
- The API is configured for local HTTP development. Deployments must use HTTPS to protect passwords and bearer tokens in transit. Login rate limiting and automated cleanup of expired session rows are not implemented.
