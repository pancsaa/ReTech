export interface User {
  user_id: number | string;
  username: string;
  email: string;
  password?: string;
  role: 'user' | 'admin' | 'seller' | string;  
  recoins_balance: number;
  recoins_balance_date?: string;  
  register_date: string;      
  products?: Product[];       
}

export interface Product {
  product_id: number | string;
  seller_id: number | string;         // FK → seller
  title: string;
  description?: string;
  condition: 'new' | 'used' | 'like_new' | 'damaged' | string;
  category: string;
  brand?: string;
  model?: string;
  price: number;
  price_recoins?: number;
  status: 'active' | 'sold' | string;
  upload_date?: string;                
  images?: string;
}

export interface Transaction {
  transaction_id: number | string;
  buyer_id: number | string;
  product_id: number | string;
  seller_id?: number | string;
  amount: number; 
  recoins_amount?: number; 
  transaction_date: string;
  type: 'purchase' | 'refund' | string;
  title?: string; 
}

export interface Recycle {
  recycle_id: number | string;
  user_id: number | string;
  product_type: string;    
  condition: string;
  recoins_reward: number;
  date: string;
}

export type UserProfile = Omit<User, 'password'>; 

export interface UserWithStats extends UserProfile {
  productCount: number;
  transactionCount: number;
  recycleCount: number;
}