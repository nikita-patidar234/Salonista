import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {strings} from '../../constants/appConstants';
import {colors, spacing, typography} from '../../theme';

interface LoadingIndicatorProps {
  label?: string;
}

export function LoadingIndicator({
  label = strings.common.loading,
}: LoadingIndicatorProps) {
  return (
    <View
      accessibilityRole="progressbar"
      style={styles.container}>
      <ActivityIndicator color={colors.primary} />

      <Text style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },

  label: {
    ...typography.bodySecondary,
    marginTop: spacing.sm,
  },
});
