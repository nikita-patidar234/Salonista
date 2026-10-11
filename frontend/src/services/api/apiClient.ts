import axios from 'axios';
import {Platform} from 'react-native';

// The Android app is being tested on a physical phone, so it must use the
// development computer's Wi-Fi address. Update this when the computer's IP
// changes. Android emulators should use 10.0.2.2 instead.
const host = Platform.OS === 'android' ? '192.168.1.117' : '127.0.0.1';
export const API_BASE_URL = `http://${host}:4000/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = null;

apiClient.interceptors.request.use(config => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (typeof __DEV__ !== 'undefined' && __DEV__ && axios.isAxiosError(error)) {
      const request = error.config;
      const location = `${request?.method?.toUpperCase() ?? 'REQUEST'} ${request?.url ?? 'unknown route'}`;
      if (error.response) {
        console.warn(`[Salonista API] ${location} returned HTTP ${error.response.status}`);
      } else {
        console.warn(`[Salonista API] ${location} could not connect`, {
          code: error.code ?? 'NETWORK_ERROR',
          baseURL: request?.baseURL ?? API_BASE_URL,
        });
      }
    }
    return Promise.reject(error);
  },
);

export function setAuthToken(token: string | null): void {
  authToken = token;
}
