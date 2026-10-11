import {useCallback, useEffect, useState} from 'react';

import {bookingApi} from '../services/api/bookingApi';
import type {BookingHistoryItem} from '../types/booking.types';

interface UseBookingsResult {
  bookings: BookingHistoryItem[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const bookingHistoryErrorMessage = 'We could not load your bookings right now.';

export function useBookings(): UseBookingsResult {
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState(0);

  const refresh = useCallback(() => {
    setRequestId(current => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    bookingApi
      .getBookings()
      .then(result => {
        if (!cancelled) {
          setBookings(result);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(bookingHistoryErrorMessage);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestId]);

  return {bookings, isLoading, error, refresh};
}
