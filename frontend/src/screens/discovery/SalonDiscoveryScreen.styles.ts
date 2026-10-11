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

  brand: {
    ...typography.label,
    color: colors.primary,
    letterSpacing: 1.5,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },

  intro: {
    ...typography.bodySecondary,
    marginTop: spacing.xs,
  },

  sectionTitle: {
    ...typography.sectionTitle,
    marginTop: spacing.lg,
  },

  list: {
    marginTop: spacing.xs,
  },
});
