import {StyleSheet} from 'react-native';

import {colors, spacing, typography} from '../../theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingBottom: spacing.xxl,
  },

  header: {
    paddingHorizontal: spacing.lg,
  },

  image: {
    width: '100%',
    height: 260,
    marginTop: spacing.sm,
  },

  details: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  meta: {
    ...typography.bodySecondary,
    marginTop: spacing.xs,
  },

  address: {
    ...typography.caption,
    marginTop: spacing.xs,
  },

  contactActions: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.sm,
  },

  contactButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  contactButtonText: {
    ...typography.label,
    color: colors.primary,
  },

  sectionTitle: {
    ...typography.sectionTitle,
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },

  service: {
    marginBottom: spacing.sm,
  },

  bookingBar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  selectionSummary: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
});
