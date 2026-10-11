import type {Service} from './service.types';

export interface Salon {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  services?: Service[];
}
