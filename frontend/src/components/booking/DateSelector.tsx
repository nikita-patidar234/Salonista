import React, {useMemo, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {colors, radius, spacing, typography} from '../../theme';
import {
  getCalendarGridDates,
  isWithinDateRange,
  toDateKey,
} from '../../utils/dateUtils';

interface DateSelectorProps {
  minDate: Date;
  maxDate: Date;
  selectedDate?: string;
  onSelect: (date: string) => void;
}

const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function DateSelector({
  minDate,
  maxDate,
  selectedDate,
  onSelect,
}: DateSelectorProps) {
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(minDate.getFullYear(), minDate.getMonth(), 1),
  );
  const dates = useMemo(
    () => getCalendarGridDates(visibleMonth),
    [visibleMonth],
  );
  const monthLabel = new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
  }).format(visibleMonth);
  const firstAllowedMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const lastAllowedMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  const canGoPrevious = visibleMonth > firstAllowedMonth;
  const canGoNext = visibleMonth < lastAllowedMonth;
  const todayKey = toDateKey(minDate);

  return (
    <View style={styles.container}>
      <View style={styles.monthHeader}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          accessibilityState={{disabled: !canGoPrevious}}
          disabled={!canGoPrevious}
          onPress={() =>
            setVisibleMonth(
              month => new Date(month.getFullYear(), month.getMonth() - 1, 1),
            )
          }
          style={[styles.monthButton, !canGoPrevious && styles.navDisabled]}>
          <Text style={styles.monthArrow}>‹</Text>
        </Pressable>
        <Text style={styles.monthTitle}>{monthLabel}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          accessibilityState={{disabled: !canGoNext}}
          disabled={!canGoNext}
          onPress={() =>
            setVisibleMonth(
              month => new Date(month.getFullYear(), month.getMonth() + 1, 1),
            )
          }
          style={[styles.monthButton, !canGoNext && styles.navDisabled]}>
          <Text style={styles.monthArrow}>›</Text>
        </Pressable>
      </View>

      <View style={styles.weekdays}>
        {weekdays.map((weekday, index) => (
          <Text key={`${weekday}-${index}`} style={styles.weekday}>
            {weekday}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {dates.map(date => {
          const dateKey = toDateKey(date);
          const allowed = isWithinDateRange(dateKey, minDate, maxDate);
          const selected = dateKey === selectedDate;
          const today = dateKey === todayKey;
          const inVisibleMonth = date.getMonth() === visibleMonth.getMonth();
          return (
            <Pressable
              key={dateKey}
              accessibilityRole="button"
              accessibilityLabel={new Intl.DateTimeFormat('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }).format(date)}
              accessibilityState={{selected, disabled: !allowed}}
              disabled={!allowed}
              onPress={() => onSelect(dateKey)}
              style={[
                styles.dayCell,
                today && styles.todayCell,
                selected && styles.selectedCell,
                today && selected && styles.selectedTodayCell,
                !allowed && styles.disabledCell,
              ]}>
              <Text
                style={[
                  styles.dayNumber,
                  !inVisibleMonth && styles.outsideMonth,
                  !allowed && styles.disabledText,
                  selected && styles.selectedText,
                  today && !selected && styles.todayText,
                ]}>
                {date.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.todayDot]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.selectedDot]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  monthButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.mutedSurface,
  },
  navDisabled: {
    opacity: 0.35,
  },
  monthArrow: {
    color: colors.primaryDark,
    fontSize: 28,
    lineHeight: 30,
  },
  monthTitle: {
    ...typography.cardTitle,
  },
  weekdays: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  weekday: {
    ...typography.caption,
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  todayCell: {
    borderColor: colors.accent,
  },
  selectedCell: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectedTodayCell: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  disabledCell: {
    opacity: 0.35,
  },
  dayNumber: {
    ...typography.label,
  },
  outsideMonth: {
    color: colors.textSecondary,
  },
  disabledText: {
    color: colors.disabled,
  },
  selectedText: {
    color: colors.white,
  },
  todayText: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  legend: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  todayDot: {
    backgroundColor: colors.accent,
  },
  selectedDot: {
    backgroundColor: colors.primary,
  },
  legendText: {
    ...typography.caption,
  },
});
