import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {strings} from '../../constants/appConstants';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import type {Salon} from '../../types/salon.types';
import {formatCurrency} from '../../utils/currencyUtils';
import {AppButton} from '../common/AppButton';
import {SalonImage} from './SalonImage';

interface SalonCardProps {
  salon: Salon;
  onPress: () => void;
  onBook: () => void;
}

export function SalonCard({salon, onPress, onBook}: SalonCardProps) {
  const startingPrice = salon.services?.length
    ? Math.min(...salon.services.map(service => service.price))
    : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${salon.name}`}
      onPress={onPress}
      style={styles.card}>
      <SalonImage
        uri={salon.imageUrl}
        name={salon.name}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.topLine}>
          <Text
            numberOfLines={1}
            style={[typography.cardTitle, styles.name]}>
            {salon.name}
          </Text>
          <Text style={styles.rating}>{salon.rating.toFixed(1)} / 5</Text>
        </View>
        <Text numberOfLines={1} style={styles.location}>
          {salon.location}
        </Text>
        {salon.services?.length ? (
          <Text numberOfLines={1} style={styles.services}>
            {salon.services.map(service => service.name).join(' · ')}
          </Text>
        ) : null}
        <View style={styles.footer}>
          {startingPrice ? (
            <Text style={typography.price}>
              From {formatCurrency(startingPrice)}
            </Text>
          ) : (
            <View />
          )}
          <AppButton
            label={strings.actions.bookNow}
            onPress={onBook}
            style={styles.bookButton}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.card,
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: 164,
  },
  content: {
    padding: spacing.md,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    marginRight: spacing.sm,
  },
  rating: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  location: {
    ...typography.bodySecondary,
    marginTop: spacing.xxs,
  },
  services: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  bookButton: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
  },
});
