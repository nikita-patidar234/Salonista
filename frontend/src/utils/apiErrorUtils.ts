import axios from 'axios';

import {API_BASE_URL} from '../services/api/apiClient';

export function getApiErrorMessage(error: unknown, resourceName: string, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  if (!error.response) {
    return `Cannot reach the Salonista API at ${API_BASE_URL}. Start the backend and check the device API address.`;
  }

  if (error.response.status >= 500) {
    return `The server could not load ${resourceName}. Check that the backend and database are running.`;
  }

  const responseError = error.response.data as {error?: unknown} | undefined;
  return typeof responseError?.error === 'string' ? responseError.error : fallback;
}
