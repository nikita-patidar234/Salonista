import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {colors, radius, spacing, typography} from '../../theme';

export interface TimeSlotOption {
  time: string;
  available: boolean;
}

interface TimeSlotSelectorProps {
  slots: TimeSlotOption[];
  selectedTime?: string;
  onSelect: (time: string) => void;
}

export function TimeSlotSelector({
  slots,
  selectedTime,
  onSelect,
}: TimeSlotSelectorProps) {
  return (
    <View style={styles.grid}>
      {slots.map(slot => {
        const selected = slot.time === selectedTime;

        return (
          <Pressable
            key={slot.time}
            accessibilityRole="radio"
            accessibilityState={{selected, disabled: !slot.available}}
            disabled={!slot.available}
            onPress={() => {
              if (slot.available) {
                onSelect(slot.time);
              }
            }}
            style={[
              styles.slot,
              selected && styles.selected,
              !slot.available && styles.unavailable,
            ]}>
            <Text
              style={[
                styles.label,
                selected && styles.selectedLabel,
                !slot.available && styles.unavailableLabel,
              ]}>
              {slot.time}
            </Text>
            {!slot.available ? (
              <Text style={styles.unavailableHint}>Unavailable</Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slot: {
    minWidth: 98,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unavailable: {
    backgroundColor: colors.mutedSurface,
    borderColor: colors.border,
  },
  label: {
    ...typography.label,
  },
  selectedLabel: {
    color: colors.white,
  },
  unavailableLabel: {
    color: colors.disabled,
    textDecorationLine: 'line-through',
  },
  unavailableHint: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
});
