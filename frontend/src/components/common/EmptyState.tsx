import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {spacing, typography} from '../../theme';
import {AppButton} from './AppButton';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={typography.sectionTitle}>
        {title}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>

      {actionLabel && onAction ? (
        <AppButton
          label={actionLabel}
          onPress={onAction}
          variant="secondary"
          style={styles.action}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.xxl,
  },

  description: {
    ...typography.bodySecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  action: {
    marginTop: spacing.lg,
    minWidth: 144,
  },
});
