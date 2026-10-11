import type {TextStyle} from 'react-native';

import {colors} from './colors';

export const typography: Record<
  | 'display'
  | 'screenTitle'
  | 'sectionTitle'
  | 'cardTitle'
  | 'body'
  | 'bodySecondary'
  | 'label'
  | 'button'
  | 'caption'
  | 'price',
  TextStyle
> = {
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    color: colors.text,
  },
  screenTitle: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.text,
  },
  cardTitle: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: colors.text,
  },
  bodySecondary: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.text,
  },
  button: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.white,
  },
  caption: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  price: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.primaryDark,
  },
};
