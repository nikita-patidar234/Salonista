// Appointments start hourly during the 10 AM to 8 PM business window. The
// final start is 7 PM so services can finish by closing time.
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
