// Mirror the API's hourly starts from 10 AM through 7 PM; 8 PM is closing.
export const BOOKING_TIME_SLOTS = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
] as const;

export const PAYMENT_METHODS = ['PAY_AT_SALON'] as const;
export const BOOKING_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
] as const;
