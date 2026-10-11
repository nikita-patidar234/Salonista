import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {colors, radius, spacing, typography} from '../../theme';
import {formatCurrency} from '../../utils/currencyUtils';

interface BookingSummaryProps {
  salonName: string;
  serviceName: string;
  durationMinutes: number;
  price: number;
  date?: string;
  time?: string;
}

export function BookingSummary({
  salonName,
  serviceName,
  durationMinutes,
  price,
  date,
  time,
}: BookingSummaryProps) {
  return (
    <View style={styles.card}>
      <Text style={typography.sectionTitle}>Booking summary</Text>
      <Text style={styles.salon}>{salonName}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>
          {serviceName} · {durationMinutes} min
        </Text>
        <Text style={typography.price}>{formatCurrency(price)}</Text>
      </View>
      {date && time ? (
        <Text style={styles.date}>
          {date} at {time}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.mutedSurface,
  },
  salon: {
    ...typography.bodySecondary,
    marginTop: spacing.xxs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  label: typography.body,
  date: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
