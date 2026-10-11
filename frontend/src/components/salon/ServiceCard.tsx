import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {colors, radius, spacing, typography} from '../../theme';
import type {Service} from '../../types/service.types';
import {formatCurrency} from '../../utils/currencyUtils';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onPress: () => void;
}

export function ServiceCard({
  service,
  selected = false,
  onPress,
}: ServiceCardProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={service.name}
      accessibilityState={{selected}}
      onPress={onPress}
      style={[styles.card, selected && styles.selected]}>
      <View style={styles.copy}>
        <Text style={typography.cardTitle}>{service.name}</Text>
        <Text style={styles.description}>{service.description}</Text>
        <Text style={styles.duration}>{service.durationMinutes} min</Text>
      </View>
      <Text style={typography.price}>{formatCurrency(service.price)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 92,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.mutedSurface,
  },
  copy: {
    flex: 1,
    marginRight: spacing.md,
  },
  description: {
    ...typography.caption,
    marginTop: spacing.xxs,
  },
  duration: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
