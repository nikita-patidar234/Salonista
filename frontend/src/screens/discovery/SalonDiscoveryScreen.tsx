import React, {useMemo, useState} from 'react';
import {RefreshControl, SafeAreaView, ScrollView, Text, View} from 'react-native';

import {EmptyState} from '../../components/common/EmptyState';
import {ErrorMessage} from '../../components/common/ErrorMessage';
import {LoadingIndicator} from '../../components/common/LoadingIndicator';
import {AppButton} from '../../components/common/AppButton';
import {SalonList} from '../../components/salon/SalonList';
import {SalonSearchBar} from '../../components/salon/SalonSearchBar';
import {APP_NAME, strings} from '../../constants/appConstants';
import {useSalons} from '../../hooks/useSalons';
import type {Salon} from '../../types/salon.types';
import {typography} from '../../theme';

import {styles} from './SalonDiscoveryScreen.styles';

interface SalonDiscoveryScreenProps {
  onSelectSalon: (salon: Salon) => void;
  onViewBookings: () => void;
  onProfile: () => void;
}

export function SalonDiscoveryScreen({
  onSelectSalon,
  onViewBookings,
  onProfile,
}: SalonDiscoveryScreenProps) {
  const [query, setQuery] = useState('');
  const {salons, isLoading, error, refresh} = useSalons();

  const filteredSalons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return salons;
    }

    return salons.filter(salon => {
      const searchableServices = salon.services
        ?.map(service => service.name)
        .join(' ')
        .toLowerCase();

      return [salon.name, salon.location, searchableServices]
        .filter(Boolean)
        .some(value => value?.includes(normalizedQuery));
    });
  }, [query, salons]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (error) {
      return (
        <ErrorMessage
          message={error}
          onRetry={refresh}
        />
      );
    }

    if (!filteredSalons.length) {
      return (
        <EmptyState
          title={strings.discovery.noResultsTitle}
          description={strings.discovery.noResultsDescription}
          actionLabel={strings.actions.retry}
          onAction={() => {
            if (query) {
              setQuery('');
            } else {
              refresh();
            }
          }}
        />
      );
    }

    return (
      <View style={styles.list}>
        <SalonList
          salons={filteredSalons}
          onSalonPress={onSelectSalon}
          onBookPress={onSelectSalon}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
          />
        }>
        <Text style={styles.brand}>
          {APP_NAME.toUpperCase()}
        </Text>

        <Text style={typography.screenTitle}>
          Find your next beauty ritual
        </Text>

        <Text style={styles.intro}>
          Exceptional salons, thoughtfully selected near you.
        </Text>

        <AppButton
          label={strings.actions.viewBookings}
          onPress={onViewBookings}
          variant="text"
        />
        <AppButton
          label="My profile"
          onPress={onProfile}
          variant="text"
        />

        <SalonSearchBar
          value={query}
          onChangeText={setQuery}
        />

        <Text style={styles.sectionTitle}>
          Popular near you
        </Text>

        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}
