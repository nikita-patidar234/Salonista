import type {BookingDraft} from '../types/booking.types';
import {getBookingDateBounds, isWithinDateRange} from './dateUtils';

export function validateBooking(
  draft: Partial<BookingDraft>,
  now = new Date(),
): string | null {
  if (!draft.serviceIds?.length) {
    return 'Choose a service to continue.';
  }

  if (!draft.date || !draft.time) {
    return 'Choose a date and time to continue.';
  }

  const {today, lastBookableDate} = getBookingDateBounds(now);
  const dateIsInRange = isWithinDateRange(draft.date, today, lastBookableDate);

  if (!dateIsInRange) {
    return 'Choose a date from today through one month from today.';
  }

  if (!/^(?:0?[1-9]|1[0-2]):[0-5]\d (?:AM|PM)$/.test(draft.time)) {
    return 'Choose a valid appointment time.';
  }

  return null;
}
