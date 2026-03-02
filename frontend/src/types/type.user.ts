// src/types/type.user.ts
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'seller';
  recoin_balance: number;
  register_date: string;
  profile_image?: string | null;
  products?: Product[];
}

export interface Product {
  id: number;
  seller_id: number;
  title: string;
  description?: string;
  condition: string;
  category: string;
  brand?: string;
  model?: string;
  price_recoin: number;
  status: 'active' | 'sold' | 'reserved' | 'deleted';
  upload_date: string;
  image_url?: string;
}

export interface Transaction {
  id: number;
  buyer_id: number;
  product_id: number;
  amount: number;
  transaction_date: string;
}

export interface Recycle {
  id: number;
  user_id: number;
  product_type: string;
  condition: string;
  recoin_reward: number;
  date: string;
}

export type UserProfile = Omit<User, 'password'>;