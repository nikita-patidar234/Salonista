import * as Keychain from 'react-native-keychain';

const keychainService = 'com.salonista.auth-session';

export async function readSessionToken(): Promise<string | null> {
  const credentials = await Keychain.getGenericPassword({service: keychainService});
  return credentials ? credentials.password : null;
}

export async function saveSessionToken(token: string): Promise<void> {
  const saved = await Keychain.setGenericPassword('session', token, {
    service: keychainService,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  if (!saved) {
    throw new Error('Could not save the session securely.');
  }
}

export async function clearSessionToken(): Promise<void> {
  await Keychain.resetGenericPassword({service: keychainService});
}
