import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type ImageStyle,
  type StyleProp,
} from 'react-native';

import {colors, radius, typography} from '../../theme';

interface SalonImageProps {
  uri: string;
  name: string;
  style?: StyleProp<ImageStyle>;
}

export function SalonImage({uri, name, style}: SalonImageProps) {
  if (!uri) {
    return (
      <View style={[styles.fallback, style]}>
        <Text style={styles.initial}>{name.charAt(0).toUpperCase()}</Text>
      </View>
    );
  }

  return (
    <Image
      accessibilityLabel={`${name} interior`}
      source={{uri}}
      style={[styles.image, style]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.mutedSurface,
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.md,
  },
  initial: {
    ...typography.display,
    color: colors.white,
  },
});
