import React, {useEffect, useState} from 'react';
import {Linking, Pressable, SafeAreaView, ScrollView, Text, View} from 'react-native';

import {AppButton} from '../../components/common/AppButton';
import {AppHeader} from '../../components/common/AppHeader';
import {EmptyState} from '../../components/common/EmptyState';
import {ErrorMessage} from '../../components/common/ErrorMessage';
import {LoadingIndicator} from '../../components/common/LoadingIndicator';
import {SalonImage} from '../../components/salon/SalonImage';
import {ServiceCard} from '../../components/salon/ServiceCard';
import {strings} from '../../constants/appConstants';
import {useSalon} from '../../hooks/useSalons';
import {formatCurrency} from '../../utils/currencyUtils';
import type {Salon} from '../../types/salon.types';
import type {Service} from '../../types/service.types';
import {typography} from '../../theme';

import {styles} from './SalonDetailsScreen.styles';

interface SalonDetailsScreenProps {
  salon: Salon;
  onBack: () => void;
  onBookServices: (salon: Salon, services: Service[]) => void;
}

export function SalonDetailsScreen({
  salon,
  onBack,
  onBookServices,
}: SalonDetailsScreenProps) {
  const {
    salon: fetchedSalon,
    isLoading,
    error,
    refresh,
  } = useSalon(salon.id);
  const displayedSalon = fetchedSalon ?? salon;
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(() =>
    salon.services?.[0] ? [salon.services[0].id] : [],
  );

  const selectedServices = displayedSalon.services?.filter(service =>
    selectedServiceIds.includes(service.id),
  ) ?? [];

  useEffect(() => {
    if (fetchedSalon?.services) {
      const availableIds = new Set(
        fetchedSalon.services.map(service => service.id),
      );
      setSelectedServiceIds(current =>
        current.filter(serviceId => availableIds.has(serviceId)),
      );
    }
  }, [fetchedSalon]);

  const handleBooking = () => {
    if (selectedServices.length) {
      onBookServices(displayedSalon, selectedServices);
    }
  };

  const openDirections = () => {
    const destination = encodeURIComponent(displayedSalon.address);
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${destination}`,
    ).catch(() => undefined);
  };

  const callSalon = () => {
    Linking.openURL(`tel:${displayedSalon.phone}`).catch(() => undefined);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds(current =>
      current.includes(serviceId)
        ? current.filter(id => id !== serviceId)
        : [...current, serviceId],
    );
  };

  const totalDuration = selectedServices.reduce(
    (total, service) => total + service.durationMinutes,
    0,
  );
  const totalPrice = selectedServices.reduce(
    (total, service) => total + service.price,
    0,
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <AppHeader
            title={displayedSalon.name}
            onBack={onBack}
          />
        </View>

        {isLoading ? (
          <LoadingIndicator label="Loading salon details…" />
        ) : null}

        {error ? (
          <ErrorMessage
            message={error}
            onRetry={refresh}
          />
        ) : null}

        <SalonImage
          uri={displayedSalon.imageUrl}
          name={displayedSalon.name}
          style={styles.image}
        />

        <View style={styles.details}>
          <Text style={typography.screenTitle}>
            {displayedSalon.name}
          </Text>

          <Text style={styles.meta}>
            {displayedSalon.location} · {displayedSalon.rating.toFixed(1)} / 5 (
            {displayedSalon.reviewCount} reviews)
          </Text>

          <Text style={styles.address}>
            {displayedSalon.address}
          </Text>

          <View style={styles.contactActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Get directions to ${displayedSalon.name}`}
              onPress={openDirections}
              style={styles.contactButton}>
              <Text style={styles.contactButtonText}>Get directions</Text>
            </Pressable>
            {displayedSalon.phone ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Call ${displayedSalon.name}`}
                onPress={callSalon}
                style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Call salon</Text>
              </Pressable>
            ) : null}
          </View>

          <Text style={styles.sectionTitle}>
            Choose services
          </Text>

          {displayedSalon.services?.length ? (
            displayedSalon.services.map(service => (
              <View
                key={service.id}
                style={styles.service}>
                <ServiceCard
                  service={service}
                  selected={selectedServiceIds.includes(service.id)}
                  onPress={() => toggleService(service.id)}
                />
              </View>
            ))
          ) : (
            <EmptyState
              title="No services listed"
              description="This salon has not added any services yet."
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.bookingBar}>
        {selectedServices.length ? (
          <Text style={styles.selectionSummary}>
            {selectedServices.length} service{selectedServices.length === 1 ? '' : 's'}
            {' · '}{totalDuration} min{' · '}{formatCurrency(totalPrice)}
          </Text>
        ) : null}

        <AppButton
          label={
            selectedServices.length > 1
              ? `Book ${selectedServices.length} services`
              : strings.actions.bookNow
          }
          onPress={handleBooking}
          disabled={!selectedServices.length}
        />
      </View>
    </SafeAreaView>
  );
}
