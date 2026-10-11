import type {ViewStyle} from 'react-native';

export const shadows: Record<'card' | 'floating', ViewStyle> = {
  card: {
    elevation: 2,
    shadowColor: '#292126',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  floating: {
    elevation: 6,
    shadowColor: '#292126',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.14,
    shadowRadius: 14,
  },
};
