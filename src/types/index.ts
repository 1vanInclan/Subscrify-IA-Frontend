export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  billingPeriod: 'MONTHLY' | 'YEARLY';
  nextBillingDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateSubscriptionDto {
  name: string;
  price: number;
  currency?: string;
  category: string;
  billingPeriod: 'MONTHLY' | 'YEARLY';
  nextBillingDate: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  executedTools?: any[];
}

export type UpdateSubscriptionDto = Partial<CreateSubscriptionDto>;