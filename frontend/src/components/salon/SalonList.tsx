import React from 'react';
import {View} from 'react-native';

import type {Salon} from '../../types/salon.types';
import {SalonCard} from './SalonCard';

interface SalonListProps {
  salons: Salon[];
  onSalonPress: (salon: Salon) => void;
  onBookPress: (salon: Salon) => void;
}

export function SalonList({
  salons,
  onSalonPress,
  onBookPress,
}: SalonListProps) {
  return (
    <View>
      {salons.map(salon => (
        <SalonCard
          key={salon.id}
          salon={salon}
          onPress={() => onSalonPress(salon)}
          onBook={() => onBookPress(salon)}
        />
      ))}
    </View>
  );
}
