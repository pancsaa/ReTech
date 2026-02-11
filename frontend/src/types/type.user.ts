// src/types/user.ts

export interface User {
  user_id: number | string;         // PK
  username: string;
  email: string;
  password?: string;                // frontend általában nem kapja meg / nem tárolja
  role: 'user' | 'admin' | 'seller' | string;  // feltételezett értékek, bővíthető
  recoins_balance: number;          // receipt_balance → recoins/receipt egyenleg
  recoins_balance_date?: string;    // ISO date string pl. "2026-02-10T14:30:00Z"
  register_date: string;            // ISO date string
  // opcionális: kapcsolódó entitások (ha API-val lazy-loaded vagy joined)
  products?: Product[];             // általa feltöltött termékek
  transactionsAsBuyer?: Transaction[];
  transactionsAsSeller?: Transaction[];
  recoinsHistory?: RecoinHistory[];
  recycleEntries?: Recycle[];
}

// kapcsolódó típusok (ugyanabba a mappába érdemes tenni, vagy külön fájlba)

export interface Product {
  product_id: number | string;
  user_id: number | string;         // FK → seller
  title: string;
  description?: string;
  condition: 'new' | 'used' | 'like_new' | 'damaged' | string;
  category: string;
  brand?: string;
  model?: string;
  price: number;
  recoins?: number;                 // price_recoins → recoins ár
  status: 'active' | 'sold' | 'deleted' | 'reserved' | string;
  date?: string;                    // upload_date vagy created_at
  images?: ProductImage[];
}

export interface ProductImage {
  image_id: number | string;
  product_id: number | string;
  image_url: string;                // vagy cloudinary/aws url
}

export interface Transaction {
  transaction_id: number | string;
  buyer_id: number | string;
  product_id: number | string;
  seller_id?: number | string;      // sokszor a product.user_id-ból jön
  amount: number;                   // pénzbeni összeg
  recoins_amount?: number;          // recoins tranzakció esetén
  transaction_date: string;
  type: 'purchase' | 'recoin_topup' | 'recoin_spend' | 'refund' | string;
  title?: string;                   // termék címe (denormalizált)
}

export interface RecoinHistory {
  history_id: number | string;
  user_id: number | string;
  transaction_id?: number | string | null;
  change_amount: number;            // pozitív = jóváírás, negatív = levonás
  reason: string;                   // "purchase", "recycle reward", "top-up", stb.
  date: string;
}

export interface Recycle {
  recycle_id: number | string;
  user_id: number | string;
  product_id?: number | string | null;
  product_type: string;             // pl. "phone", "laptop", "battery"
  condition: string;
  recoins_reward: number;
  date: string;
}

// Hasznos típusok pl. API válaszokhoz / formokhoz

export type UserProfile = Omit<User, 'password'>;  // jelszó nélküli verzió

export interface UserWithStats extends UserProfile {
  productCount: number;
  transactionCount: number;
  recycleCount: number;
}