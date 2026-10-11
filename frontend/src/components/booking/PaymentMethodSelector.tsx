import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {strings} from '../../constants/appConstants';
import {colors, radius, spacing, typography} from '../../theme';
import type {PaymentMethod} from '../../types/booking.types';

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({selected, onSelect}: PaymentMethodSelectorProps) {
  const active = selected === 'PAY_AT_SALON';

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{selected: active}}
      onPress={() => onSelect('PAY_AT_SALON')}
      style={[styles.card, active && styles.active]}>
      <View style={styles.radio}>
        {active ? <View style={styles.dot} /> : null}
      </View>
      <View>
        <Text style={typography.cardTitle}>{strings.booking.payAtSalon}</Text>
        <Text style={styles.description}>Pay directly when you arrive.</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  active: {
    borderColor: colors.primary,
    backgroundColor: colors.mutedSurface,
  },
  radio: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.round,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.round,
    backgroundColor: colors.primary,
  },
  description: {
    ...typography.caption,
    marginTop: spacing.xxs,
  },
});
