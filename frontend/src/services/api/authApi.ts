import {apiClient} from './apiClient';
import type {AuthSession, Customer} from '../../types/customer.types';

export const authApi = {
  register: async (name: string, email: string, password: string) =>
    (await apiClient.post<AuthSession>('/auth/register', {name, email, password})).data,
  login: async (email: string, password: string) =>
    (await apiClient.post<AuthSession>('/auth/login', {email, password})).data,
  me: async () => (await apiClient.get<Customer>('/auth/me')).data,
  updateProfile: async (name: string, email: string) =>
    (await apiClient.patch<Customer>('/auth/me', {name, email})).data,
  logout: async () => apiClient.post('/auth/logout'),
};
