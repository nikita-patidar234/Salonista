export type PaymentMethod = 'PAY_AT_SALON';
export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface BookingDraft {
  salonId: string;
  serviceIds: string[];
  date: string;
  time: string;
  paymentMethod: PaymentMethod;
}

export interface Booking {
  id: string;
  customerId: string;
  salonId: string;
  serviceId: string;
  date: string;
  time: string;
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  createdAt: string;
}

export interface BookingHistoryItem extends Booking {
  salonName: string;
  serviceName: string;
}

export interface BookingAvailability {
  date: string;
  slots: Array<{
    time: string;
    available: boolean;
  }>;
}
