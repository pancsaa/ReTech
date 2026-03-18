export interface PostUsers {
  username: string;
  email: string;
  password: string;
}

export interface User {
  userid: number;
  username: string;
  email: string;
  profile_image?: string | null;
  role?: "USER" | "ADMIN";
  recoin_balance?: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  refreshUser: () => Promise<void>;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  condition: string;
  category: string;
  brand: string;
  model: string;
  price_recoin: number;
  image_url: string;
  seller_id: number;
  status?: "PENDING" | "AVAILABLE" | "SOLD" | "REJECTED";
  seller?: {
    id: number;
    username: string;
    email?: string;
    profile_image?: string | null;
  };
}

export interface CreateProductPayload {
  title: string;
  description: string;
  condition: string;
  category: string;
  brand: string;
  model: string;
  price_recoin: number;
}

export interface CreateRecyclePayload {
  product_type: string;
  condition: string;
  category: string;
  brand: string;
  model: string;
  description: string;
  note?: string;
}

export interface RecycleRequest {
  id: number;
  product_type: string;
  condition: string;
  category?: string | null;
  brand?: string | null;
  model?: string | null;
  description?: string | null;
  note?: string | null;
  image_url?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  recoin_reward: number;
  date: string;
  user?: {
    username: string;
    email: string;
  };
}

export interface BuyProductPayload {
  product_id: number;
  shipping_address: string;
}

export interface TransactionItem {
  id: number;
  amount: number;
  transaction_date: string;
  shipping_address?: string;
  product: {
    id: number;
    title: string;
    image_url: string;
    price_recoin: number;
    seller_id?: number;
  };
  buyer?: {
    id: number;
    username: string;
    email?: string;
  };
}