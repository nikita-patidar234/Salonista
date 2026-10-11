import React from 'react';
import {StyleSheet, View} from 'react-native';

import {strings} from '../../constants/appConstants';
import {spacing} from '../../theme';
import {AppInput} from '../common/AppInput';

interface SalonSearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
}

export function SalonSearchBar({value, onChangeText}: SalonSearchBarProps) {
  return (
    <View style={styles.container}>
      <AppInput
        accessibilityLabel={strings.discovery.searchPlaceholder}
        placeholder={strings.discovery.searchPlaceholder}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
});
