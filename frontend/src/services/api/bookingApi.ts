import {apiClient} from './apiClient';
import type {
  Booking,
  BookingAvailability,
  BookingDraft,
  BookingHistoryItem,
} from '../../types/booking.types';

export const bookingApi = {
  getAvailability: async (
    salonId: string,
    date: string,
    serviceIds: string[],
  ): Promise<BookingAvailability> => {
    return (
      await apiClient.get<BookingAvailability>(
        `/salons/${salonId}/availability`,
        {params: {date, serviceIds: serviceIds.join(',')}},
      )
    ).data;
  },
  createBooking: async (draft: BookingDraft): Promise<Booking> => {
    return (await apiClient.post<Booking>('/bookings', draft)).data;
  },
  getBookings: async (): Promise<BookingHistoryItem[]> => {
    return (
      await apiClient.get<BookingHistoryItem[]>('/bookings')
    ).data;
  },
};
