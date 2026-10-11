import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {strings} from '../../constants/appConstants';
import {colors, radius, spacing, typography} from '../../theme';
import {AppButton} from './AppButton';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  message = strings.common.somethingWentWrong,
  onRetry,
}: ErrorMessageProps) {
  return (
    <View
      accessibilityRole="alert"
      style={styles.container}>
      <Text style={styles.message}>
        {message}
      </Text>

      {onRetry ? (
        <AppButton
          label={strings.actions.retry}
          onPress={onRetry}
          variant="text"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.mutedSurface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  message: {
    ...typography.body,
    color: colors.error,
    marginBottom: spacing.xs,
  },
});
