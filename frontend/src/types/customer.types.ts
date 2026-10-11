export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  customer: Customer;
  token: string;
  expiresAt: string;
}
