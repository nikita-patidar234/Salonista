import React, {useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import {SafeAreaView, ScrollView, Text} from 'react-native';

import {AppButton} from '../../components/common/AppButton';
import {AppHeader} from '../../components/common/AppHeader';
import {BookingSummary} from '../../components/booking/BookingSummary';
import {DateSelector} from '../../components/booking/DateSelector';
import {PaymentMethodSelector} from '../../components/booking/PaymentMethodSelector';
import {TimeSlotSelector} from '../../components/booking/TimeSlotSelector';
import type {TimeSlotOption} from '../../components/booking/TimeSlotSelector';
import {strings} from '../../constants/appConstants';
import {bookingApi} from '../../services/api/bookingApi';
import type {Booking, PaymentMethod} from '../../types/booking.types';
import type {Salon} from '../../types/salon.types';
import type {Service} from '../../types/service.types';
import {getBookingDateBounds} from '../../utils/dateUtils';
import {validateBooking} from '../../utils/validationUtils';

import {styles} from './BookingScreen.styles';

interface BookingScreenProps {
  salon: Salon;
  services: Service[];
  onBack: () => void;
  onComplete: (booking: Booking) => void;
}

export function BookingScreen({
  salon,
  services,
  onBack,
  onComplete,
}: BookingScreenProps) {
  const [date, setDate] = useState<string>();
  const [time, setTime] = useState<string>();
  const [slots, setSlots] = useState<TimeSlotOption[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PAY_AT_SALON');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const serviceIds = useMemo(
    () => services.map(service => service.id),
    [services],
  );
  const totalDuration = services.reduce(
    (total, service) => total + service.durationMinutes,
    0,
  );
  const totalPrice = services.reduce(
    (total, service) => total + service.price,
    0,
  );

  const dateBounds = getBookingDateBounds();

  useEffect(() => {
    let isCurrentRequest = true;

    if (!date) {
      setSlots([]);
      setAvailabilityError(null);
      setIsLoadingSlots(false);
      return () => {
        isCurrentRequest = false;
      };
    }

    setTime(undefined);
    setSlots([]);
    setAvailabilityError(null);
    setIsLoadingSlots(true);

    bookingApi
      .getAvailability(salon.id, date, serviceIds)
      .then(result => {
        if (isCurrentRequest) {
          setSlots(result.slots);
        }
      })
      .catch(requestError => {
        if (!isCurrentRequest) {
          return;
        }
        const apiMessage = axios.isAxiosError<{error?: string}>(requestError)
          ? requestError.response?.data?.error
          : undefined;
        setAvailabilityError(
          apiMessage ?? 'We could not load appointment times. Please try again.',
        );
      })
      .finally(() => {
        if (isCurrentRequest) {
          setIsLoadingSlots(false);
        }
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [date, salon.id, serviceIds]);

  const handleSubmit = async () => {
    const validationError = validateBooking({
      salonId: salon.id,
      serviceIds,
      date,
      time,
      paymentMethod,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!slots.some(slot => slot.time === time && slot.available)) {
      setError('That appointment time is unavailable. Choose another time.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const booking = await bookingApi.createBooking({
        salonId: salon.id,
        serviceIds,
        date: date as string,
        time: time as string,
        paymentMethod,
      });
      onComplete(booking);
    } catch (requestError) {
      const apiMessage = axios.isAxiosError<{error?: string}>(requestError)
        ? requestError.response?.data?.error
        : undefined;
      setError(apiMessage ?? strings.booking.bookingFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppHeader
          title="Complete your booking"
          onBack={onBack}
        />

        <BookingSummary
          salonName={salon.name}
          serviceName={services.map(service => service.name).join(' + ')}
          durationMinutes={totalDuration}
          price={totalPrice}
          date={date}
          time={time}
        />

        <Text style={styles.sectionTitle}>
          {strings.booking.selectDate}
        </Text>

        <DateSelector
          minDate={dateBounds.today}
          maxDate={dateBounds.lastBookableDate}
          selectedDate={date}
          onSelect={selectedDate => {
            setDate(selectedDate);
            setTime(undefined);
            setError(null);
          }}
        />

        <Text style={styles.sectionTitle}>
          {strings.booking.selectTime}
        </Text>

        {!date ? (
          <Text style={styles.helper}>Choose a date to see available times.</Text>
        ) : isLoadingSlots ? (
          <Text style={styles.helper}>Checking available times…</Text>
        ) : availabilityError ? (
          <Text style={styles.error}>{availabilityError}</Text>
        ) : slots.length ? (
          <TimeSlotSelector
            slots={slots}
            selectedTime={time}
            onSelect={selectedTime => {
              setTime(selectedTime);
              setError(null);
            }}
          />
        ) : (
          <Text style={styles.helper}>No appointment times are available.</Text>
        )}

        <Text style={styles.sectionTitle}>
          {strings.booking.paymentMethod}
        </Text>

        <PaymentMethodSelector
          selected={paymentMethod}
          onSelect={setPaymentMethod}
        />

        {error ? (
          <Text style={styles.error}>
            {error}
          </Text>
        ) : null}

        <AppButton
          label="Confirm booking"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting || isLoadingSlots || !date || !time || Boolean(availabilityError)}
          style={styles.submit}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
