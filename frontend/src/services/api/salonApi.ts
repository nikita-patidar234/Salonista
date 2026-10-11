import {apiClient} from './apiClient';
import type {Salon} from '../../types/salon.types';
import type {Service} from '../../types/service.types';

export const salonApi = {
  getSalons: async (): Promise<Salon[]> =>
    (await apiClient.get<Salon[]>('/salons')).data,
  getSalon: async (salonId: string): Promise<Salon> =>
    (await apiClient.get<Salon>(`/salons/${salonId}`)).data,
  getServices: async (salonId: string): Promise<Service[]> =>
    (await apiClient.get<Service[]>(`/salons/${salonId}/services`)).data,
};
