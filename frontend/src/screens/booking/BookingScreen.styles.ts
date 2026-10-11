import {StyleSheet} from 'react-native';

import {colors, spacing, typography} from '../../theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  sectionTitle: {
    ...typography.sectionTitle,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },

  error: {
    ...typography.body,
    color: colors.error,
    marginTop: spacing.md,
  },

  helper: {
    ...typography.bodySecondary,
    marginTop: spacing.xs,
  },

  submit: {
    marginTop: spacing.xl,
  },
});
