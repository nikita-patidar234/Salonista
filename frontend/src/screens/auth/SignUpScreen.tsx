import React, {useState} from 'react';
import axios from 'axios';
import {Pressable, SafeAreaView, ScrollView, Text} from 'react-native';

import {AppButton} from '../../components/common/AppButton';
import {AppHeader} from '../../components/common/AppHeader';
import {AppInput} from '../../components/common/AppInput';
import {authApi} from '../../services/api/authApi';
import type {AuthSession} from '../../types/customer.types';
import {authStyles} from './auth.styles';

interface SignUpScreenProps {
  onAuthenticated: (session: AuthSession) => Promise<void>;
  onLogin: () => void;
  onCancel: () => void;
}

function getRequestError(error: unknown): string {
  if (axios.isAxiosError<{error?: string}>(error)) {
    return error.response?.data?.error ?? 'We could not create your account. Please try again.';
  }
  return error instanceof Error ? error.message : 'We could not create your account. Please try again.';
}

export function SignUpScreen({onAuthenticated, onLogin, onCancel}: SignUpScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (name.trim().length < 2) {
      setError('Enter your name (at least 2 characters).');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 8 || password.length > 128) {
      setError('Use a password between 8 and 128 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onAuthenticated(await authApi.register(name.trim(), email.trim(), password));
    } catch (requestError) {
      setError(getRequestError(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.screen}>
      <ScrollView contentContainerStyle={authStyles.content} keyboardShouldPersistTaps="handled">
        <AppHeader title="Create account" onBack={onCancel} />
        <Text style={authStyles.heading}>Create your account</Text>
        <Text style={authStyles.intro}>Save your details and keep your salon bookings together.</Text>
        <AppInput label="Name" value={name} onChangeText={setName} autoCapitalize="words" autoComplete="name" />
        <AppInput label="Email address" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
        <AppInput label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" />
        <AppInput label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry autoComplete="new-password" />
        {error ? <Text accessibilityLiveRegion="polite" style={authStyles.error}>{error}</Text> : null}
        <AppButton label="Create account" onPress={submit} loading={loading} />
        <Pressable style={authStyles.footer} accessibilityRole="button" onPress={onLogin}>
          <Text style={authStyles.footerText}>Already have an account? <Text style={authStyles.footerAction}>Sign in</Text></Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
