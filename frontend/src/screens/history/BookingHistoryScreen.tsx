import React from 'react';
import {RefreshControl, SafeAreaView, ScrollView, Text, View} from 'react-native';

import {AppHeader} from '../../components/common/AppHeader';
import {EmptyState} from '../../components/common/EmptyState';
import {ErrorMessage} from '../../components/common/ErrorMessage';
import {LoadingIndicator} from '../../components/common/LoadingIndicator';
import {strings} from '../../constants/appConstants';
import {useBookings} from '../../hooks/useBookings';
import type {BookingHistoryItem} from '../../types/booking.types';
import {formatShortDate} from '../../utils/dateUtils';

import {styles} from './BookingHistoryScreen.styles';

interface BookingHistoryScreenProps {
  onBack: () => void;
}

function formatBookingDate(date: string): string {
  return formatShortDate(new Date(`${date}T00:00:00`));
}

function BookingCard({booking}: {booking: BookingHistoryItem}) {
  return (
    <View style={styles.card}>
      <Text style={styles.salonName}>
        {booking.salonName}
      </Text>

      <Text style={styles.serviceName}>
        {booking.serviceName}
      </Text>

      <Text style={styles.details}>
        {formatBookingDate(booking.date)} · {booking.time}
      </Text>

      <View style={styles.status}>
        <Text style={styles.statusText}>
          {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
        </Text>
      </View>
    </View>
  );
}

export function BookingHistoryScreen({onBack}: BookingHistoryScreenProps) {
  const {bookings, isLoading, error, refresh} = useBookings();

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (error) {
      return (
        <View style={styles.error}>
          <ErrorMessage message={error} onRetry={refresh} />
        </View>
      );
    }

    if (!bookings.length) {
      return (
        <EmptyState
          title={strings.history.emptyTitle}
          description={strings.history.emptyDescription}
          actionLabel={strings.actions.retry}
          onAction={refresh}
        />
      );
    }

    return (
      <View style={styles.list}>
        {bookings.map(booking => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} />
        }>
        <View style={styles.header}>
          <AppHeader title={strings.history.title} onBack={onBack} />
        </View>

        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}
