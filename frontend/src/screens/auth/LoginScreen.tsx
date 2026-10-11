import React, {useState} from 'react';
import axios from 'axios';
import {SafeAreaView, ScrollView, Text, Pressable, View} from 'react-native';

import {AppButton} from '../../components/common/AppButton';
import {AppHeader} from '../../components/common/AppHeader';
import {AppInput} from '../../components/common/AppInput';
import {authApi} from '../../services/api/authApi';
import type {AuthSession} from '../../types/customer.types';
import {authStyles} from './auth.styles';

interface LoginScreenProps {
  onAuthenticated: (session: AuthSession) => Promise<void>;
  onSignUp: () => void;
  onCancel: () => void;
}

function getRequestError(error: unknown, fallback: string): string {
  return axios.isAxiosError<{error?: string}>(error)
    ? error.response?.data?.error ?? fallback
    : error instanceof Error ? error.message : fallback;
}

export function LoginScreen({onAuthenticated, onSignUp, onCancel}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const normalizedEmail = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || !password) {
      setError('Enter a valid email address and your password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onAuthenticated(await authApi.login(normalizedEmail, password));
    } catch (requestError) {
      setError(getRequestError(requestError, 'We could not sign you in. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.screen}>
      <ScrollView contentContainerStyle={authStyles.content} keyboardShouldPersistTaps="handled">
        <AppHeader title="Sign in" onBack={onCancel} />
        <View>
          <Text style={authStyles.brand}>SALONISTA</Text>
          <Text style={authStyles.heading}>Welcome back</Text>
        </View>
        <Text style={authStyles.intro}>Sign in to manage your profile and bookings.</Text>
        <AppInput label="Email address" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" returnKeyType="next" />
        <AppInput label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" returnKeyType="done" onSubmitEditing={submit} />
        {error ? <Text accessibilityLiveRegion="polite" style={authStyles.error}>{error}</Text> : null}
        <AppButton label="Sign in" onPress={submit} loading={loading} />
        <Pressable style={authStyles.footer} accessibilityRole="button" onPress={onSignUp}>
          <Text style={authStyles.footerText}>New to Salonista? <Text style={authStyles.footerAction}>Create an account</Text></Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
