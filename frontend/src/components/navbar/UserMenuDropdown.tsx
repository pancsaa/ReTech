interface Product {
  product_id: number;
  title: string;
  status: string;
  price_recoint: number;
}

interface UserMenuDropdownProps {
  username: string;
  email: string;
  recoinBalance: number;
  myProducts: Product[];
  onLogout: () => void;
  isLoading?: boolean;
}

export default function UserMenuDropdown({
  username,
  email,
  recoinBalance,
  myProducts,
  onLogout,
  isLoading = false,
}: UserMenuDropdownProps) {
  if (isLoading) {
    return (
      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
    >
      <div className="p-5 bg-gradient-to-r from-green-50 to-blue-50 border-b">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-inner">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{username}</h3>
            <p className="text-sm text-gray-600">{email}</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-gray-700">ReCoin Egyenleg</h4>
            <p className="text-xs text-gray-500">Aktuális egyenleg</p>
          </div>
          <div className="text-2xl font-bold text-green-700">
            {recoinBalance} <span className="text-sm font-normal text-gray-500">R$</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-b">
        <h4 className="font-semibold text-gray-700 mb-3">Saját termékeim</h4>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {myProducts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Még nincs terméked</p>
          ) : (
            myProducts.map((product) => (
              <div key={product.product_id} className="flex justify-between items-center text-sm">
                <span className="truncate pr-2">{product.title}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {product.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={onLogout}
          className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Kijelentkezés
        </button>
      </div>
    </div>
  );
}