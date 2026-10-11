import {StyleSheet} from 'react-native';

import {colors, spacing, typography} from '../../theme';

export const authStyles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  content: {flexGrow: 1, justifyContent: 'center', padding: spacing.xl, gap: spacing.md},
  intro: {...typography.bodySecondary, marginBottom: spacing.sm},
  brand: {...typography.label, color: colors.primary, textAlign: 'left'},
  heading: {...typography.screenTitle, textAlign: 'left'},
  error: {...typography.body, color: colors.error},
  footer: {alignItems: 'center', marginTop: spacing.sm},
  footerText: {...typography.bodySecondary, textAlign: 'center'},
  footerAction: {...typography.label, color: colors.primary, marginTop: spacing.xs},
});
