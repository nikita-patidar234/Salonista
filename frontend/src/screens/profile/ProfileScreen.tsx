import React, {useState} from 'react';
import axios from 'axios';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';

import {AppButton} from '../../components/common/AppButton';
import {AppHeader} from '../../components/common/AppHeader';
import {AppInput} from '../../components/common/AppInput';
import {authApi} from '../../services/api/authApi';
import type {Customer} from '../../types/customer.types';
import {colors, spacing, typography} from '../../theme';

const profileStyles = {
  screen: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, padding: spacing.lg, borderRadius: 16, gap: spacing.xs},
  error: {...typography.body, color: colors.error},
};

interface ProfileScreenProps {
  customer: Customer;
  onCustomerUpdated: (customer: Customer) => void;
  onBack: () => void;
  onBookings: () => void;
  onLogout: () => Promise<void>;
}

export function ProfileScreen({customer, onCustomerUpdated, onBack, onBookings, onLogout}: ProfileScreenProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await authApi.updateProfile(name.trim(), email.trim());
      onCustomerUpdated(updated);
      setEditing(false);
    } catch (requestError) {
      const message = axios.isAxiosError<{error?: string}>(requestError)
        ? requestError.response?.data?.error
        : undefined;
      setError(message ?? 'We could not update your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    setLoggingOut(true);
    await onLogout();
    setLoggingOut(false);
  };

  return (
    <SafeAreaView style={profileStyles.screen}>
      <ScrollView contentContainerStyle={profileStyles.content}>
        <AppHeader title="My profile" onBack={onBack} />
        {editing ? (
          <>
            <AppInput label="Name" value={name} onChangeText={setName} autoCapitalize="words" autoComplete="name" />
            <AppInput label="Email address" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
          </>
        ) : (
          <View style={profileStyles.card}>
            <Text style={typography.cardTitle}>{customer.name}</Text>
            <Text style={typography.bodySecondary}>{customer.email}</Text>
          </View>
        )}
        {error ? <Text accessibilityLiveRegion="polite" style={profileStyles.error}>{error}</Text> : null}
        {editing ? (
          <>
            <AppButton label="Save changes" onPress={save} loading={saving} />
            <AppButton label="Cancel" onPress={() => {setEditing(false); setName(customer.name); setEmail(customer.email); setError(null);}} variant="secondary" />
          </>
        ) : (
          <AppButton label="Edit profile" onPress={() => setEditing(true)} variant="secondary" />
        )}
        <AppButton label="My bookings" onPress={onBookings} />
        <AppButton label="Log out" onPress={logout} loading={loggingOut} variant="text" />
      </ScrollView>
    </SafeAreaView>
  );
}
