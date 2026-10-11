import {StyleSheet} from 'react-native';

import {colors, radius, spacing, typography} from '../../theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  salonName: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  serviceName: {
    ...typography.body,
    marginTop: spacing.xxs,
  },
  details: {
    ...typography.bodySecondary,
    marginTop: spacing.sm,
  },
  status: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
    backgroundColor: colors.mutedSurface,
  },
  statusText: {
    ...typography.label,
    color: colors.primaryDark,
  },
  error: {
    marginTop: spacing.md,
  },
});
