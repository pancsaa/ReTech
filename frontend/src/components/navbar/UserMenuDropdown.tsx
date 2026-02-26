import React, { useState } from 'react';

interface Product {
  product_id: number | string;
  title: string;
  status: string;
  price_recoint: number;
}

interface UserMenuDropdownProps {
  username: string;
  email: string;
  recoinBalance: number;
  myProducts: Product[];
  onLogout: () => void;          // Ezt a prop-ot a szülő adja át (App.tsx / Navbar.tsx)
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
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('');
  const [recoinAmount, setRecoinAmount] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAddClick = () => {
    setIsAddPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsAddPanelOpen(false);
    // Mezők resetelése
    setBrand('');
    setType('');
    setRecoinAmount(0);
    setImageFile(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Itt majd a valódi API hívás jön (FormData-val)
    console.log('Új hirdetés adatok:', {
      brand,
      type,
      recoinAmount,
      image: imageFile?.name,
    });

    // Példa API hívás (később bővíthető):
    // const formData = new FormData();
    // formData.append('brand', brand);
    // formData.append('model', type);
    // formData.append('price_recoins', recoinAmount.toString());
    // if (imageFile) formData.append('image', imageFile);
    // fetch('/api/products', { method: 'POST', body: formData });

    handleClosePanel();
  };

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
    <>
      <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
        {/* Fejléc: profil infó */}
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

        {/* ReCoin egyenleg */}
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

        {/* Saját termékek lista */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-700">Saját termékeim</h4>
            <button
              onClick={handleAddClick}
              className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1"
            >
              + Hirdetés hozzáadása
            </button>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto">
            {myProducts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Még nincs terméked
              </p>
            ) : (
              myProducts.map((product) => (
                <div
                  key={product.product_id}
                  className="flex justify-between items-center text-sm"
                >
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

        {/* Kijelentkezés gomb – most már működik */}
        <div className="p-4">
          <button
            onClick={onLogout}  // Ezt a prop-ot használja → App.tsx vagy Navbar kezeli a logikát
            className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Kijelentkezés
          </button>
        </div>
      </div>

      {/* Jobbról becsúszó panel – hirdetés hozzáadása */}
      {isAddPanelOpen && (
        <>
          {/* Blur + sötét overlay (kívül kattintás zárja) */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={handleClosePanel}
          />

          <div
            className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
              isAddPanelOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Hirdetés hozzáadása</h2>
                <button
                  onClick={handleClosePanel}
                  className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Márka
                  </label>
                  <input
                    id="brand"
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                    placeholder="pl. Samsung, Apple, Nike..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Típus / Modell
                  </label>
                  <input
                    id="type"
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                    placeholder="pl. Galaxy S23, iPhone 14 Pro..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="recoin" className="block text-sm font-medium text-gray-700 mb-1.5">
                    ReCoin összeg
                  </label>
                  <input
                    id="recoin"
                    type="number"
                    value={recoinAmount}
                    onChange={(e) => setRecoinAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                    placeholder="pl. 450"
                    min={1}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Kép feltöltése
                  </label>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer transition"
                  />
                  {imageFile && (
                    <p className="mt-2 text-sm text-gray-600 truncate">
                      Kiválasztott: {imageFile.name}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition shadow-md"
                >
                  Hirdetés létrehozása
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}