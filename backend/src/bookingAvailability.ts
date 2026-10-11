import {BOOKING_TIME_SLOTS} from './bookingConstants.js';

export const BOOKING_TIME_ZONE = process.env.BOOKING_TIME_ZONE ?? 'Asia/Kolkata';

export interface BookingDateBounds {
  today: string;
  lastBookableDate: string;
}

function dateKeyFromParts(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function dateKeyInTimeZone(
  instant: Date,
  timeZone = BOOKING_TIME_ZONE,
): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instant);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return dateKeyFromParts(Number(values.year), Number(values.month), Number(values.day));
}

export function addOneMonthClamped(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const targetMonthIndex = month;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const normalizedMonth = (targetMonthIndex % 12) + 1;
  const lastDay = new Date(Date.UTC(targetYear, normalizedMonth, 0)).getUTCDate();
  return dateKeyFromParts(targetYear, normalizedMonth, Math.min(day, lastDay));
}

export function getBookingDateBounds(
  now = new Date(),
  timeZone = BOOKING_TIME_ZONE,
): BookingDateBounds {
  const today = dateKeyInTimeZone(now, timeZone);
  return {today, lastBookableDate: addOneMonthClamped(today)};
}

export function isBookableDate(
  dateKey: string,
  now = new Date(),
  timeZone = BOOKING_TIME_ZONE,
): boolean {
  const {today, lastBookableDate} = getBookingDateBounds(now, timeZone);
  return dateKey >= today && dateKey <= lastBookableDate;
}

export function isValidBookingTime(time: string): boolean {
  return (BOOKING_TIME_SLOTS as readonly string[]).includes(time);
}

export function canFinishByClosing(time: string, durationMinutes: number): boolean {
  const match = time.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
  if (!match || !Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    return false;
  }

  const hour = (Number(match[1]) % 12) + (match[3] === 'PM' ? 12 : 0);
  const startMinutes = hour * 60 + Number(match[2]);
  return startMinutes + durationMinutes <= 20 * 60;
}
