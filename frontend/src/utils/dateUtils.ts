export interface BookingDateBounds {
  today: Date;
  lastBookableDate: Date;
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addOneMonthClamped(date: Date): Date {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(date.getDate(), lastDay));
}

export function getBookingDateBounds(now = new Date()): BookingDateBounds {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return {today, lastBookableDate: addOneMonthClamped(today)};
}

export function isWithinDateRange(
  dateKey: string,
  startDate: Date,
  endDate: Date,
): boolean {
  return dateKey >= toDateKey(startDate) && dateKey <= toDateKey(endDate);
}

export function getCalendarGridDates(visibleMonth: Date): Date[] {
  const firstDay = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1,
  );
  const mondayFirstOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(
    firstDay.getFullYear(),
    firstDay.getMonth(),
    1 - mondayFirstOffset,
  );

  return Array.from(
    {length: 42},
    (_, index) =>
      new Date(
        gridStart.getFullYear(),
        gridStart.getMonth(),
        gridStart.getDate() + index,
      ),
  );
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
}
