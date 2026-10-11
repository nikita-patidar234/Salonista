import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {AppButton} from '../../components/common/AppButton';
import {colors, radius, spacing, typography} from '../../theme';
import type {Salon} from '../../types/salon.types';
import type {Service} from '../../types/service.types';
import {formatCurrency} from '../../utils/currencyUtils';

interface ConfirmationScreenProps {
  salon: Salon;
  services: Service[];
  date: string;
  time: string;
  onExplore: () => void;
}

export function ConfirmationScreen({
  salon,
  services,
  date,
  time,
  onExplore,
}: ConfirmationScreenProps) {
  const totalDuration = services.reduce(
    (total, service) => total + service.durationMinutes,
    0,
  );
  const totalPrice = services.reduce(
    (total, service) => total + service.price,
    0,
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>
          BOOKING CONFIRMED
        </Text>

        <Text style={typography.display}>
          You’re all set.
        </Text>

        <Text style={styles.description}>
          Your appointment reference is SLN-{Date.now().toString().slice(-6)}.
        </Text>

        <View style={styles.card}>
          <Text style={typography.cardTitle}>
            {salon.name}
          </Text>

          {services.map(service => (
            <Text key={service.id} style={styles.detail}>
              {service.name} · {service.durationMinutes} min
            </Text>
          ))}

          <Text style={styles.detail}>
            Total · {totalDuration} min
          </Text>

          <Text style={styles.detail}>
            {date} at {time}
          </Text>

          <Text style={styles.detail}>
            {formatCurrency(totalPrice)} · Pay at salon
          </Text>
        </View>

        <AppButton
          label="Explore salons"
          onPress={onExplore}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },

  eyebrow: {
    ...typography.label,
    color: colors.success,
    letterSpacing: 1.3,
    marginBottom: spacing.sm,
  },

  description: {
    ...typography.bodySecondary,
    marginTop: spacing.sm,
  },

  card: {
    marginVertical: spacing.xxl,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },

  detail: {
    ...typography.bodySecondary,
    marginTop: spacing.sm,
  },
});
