import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {strings} from '../../constants/appConstants';
import {colors, spacing, typography} from '../../theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function AppHeader({
  title,
  subtitle,
  onBack,
}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={strings.actions.back}
          hitSlop={spacing.sm}
          onPress={onBack}
          style={styles.back}>
          <Text style={styles.backText}>
            ‹
          </Text>
        </Pressable>
      ) : null}

      <View style={styles.copy}>
        <Text style={typography.screenTitle}>
          {title}
        </Text>

        {subtitle ? (
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  back: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: spacing.xs,
  },
  backText: {
    fontSize: 38,
    lineHeight: 40,
    color: colors.text,
  },
  copy: {
    flex: 1,
  },
  subtitle: {
    ...typography.bodySecondary,
    marginTop: spacing.xxs,
  },
});
