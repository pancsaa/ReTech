// frontend/src/types/type.user.ts

export interface User {
  user_id: number | string;
  username: string;
  email: string;
  password?: string;                  // soha ne küldjük/mentsük a frontendnek
  role: 'user' | 'admin' | 'seller' | string;
  recoins_balance: number;
  recoins_balance_date?: string;      // ISO string pl. "2026-02-26T12:00:00Z"
  register_date: string;
  products?: Product[];               // lazy-loaded vagy joined esetén
}

export interface Product {
  product_id: number | string;
  seller_id: number | string;
  title: string;
  description?: string;
  condition: 'new' | 'used' | 'like_new' | 'damaged' | string;
  category: string;
  brand?: string;
  model?: string;
  price: number;                      // normál ár (ha van)
  price_recoins?: number;             // recoins ár
  status: 'active' | 'sold' | 'reserved' | 'deleted' | string;
  upload_date?: string;
  images?: string[];                  // jobb tömbként, ha több kép van (korábban string volt)
}

export interface Transaction { /* marad */ }
export interface Recycle { /* marad */ }

export type UserProfile = Omit<User, 'password'>;

export interface UserWithStats extends UserProfile {
  productCount: number;
  transactionCount: number;
  recycleCount: number;
}