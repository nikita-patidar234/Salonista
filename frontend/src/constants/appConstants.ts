export const APP_NAME = 'Salonista';

export const strings = {
  actions: {
    back: 'Back',
    bookNow: 'Book now',
    continue: 'Continue',
    retry: 'Try again',
    viewBookings: 'View my bookings',
    exploreSalons: 'Explore salons',
  },
  discovery: {
    searchPlaceholder: 'Search salons or services',
    noResultsTitle: 'No salons found',
    noResultsDescription: 'Try another name, location, or service.',
    loadError: 'We could not load salons right now.',
  },
  booking: {
    selectDate: 'Select a date',
    selectTime: 'Select a time',
    paymentMethod: 'Payment method',
    payAtSalon: 'Pay at salon',
    requiredFields: 'Choose a date and time to continue.',
    bookingFailed: 'We could not complete your booking. Please try again.',
  },
  history: {
    title: 'My bookings',
    loadError: 'We could not load your bookings right now.',
    emptyTitle: 'No bookings yet',
    emptyDescription: 'Your appointments will appear here once you book a service.',
  },
  common: {
    loading: 'Loading…',
    somethingWentWrong: 'Something went wrong',
    noItems: 'Nothing to show yet',
  },
} as const;
