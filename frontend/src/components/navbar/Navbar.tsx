// src/components/navbar/Navbar.tsx
import React, { useState, useRef } from 'react';
import UserMenuDropdown from './UserMenuDropdown';

interface NavbarProps {
  isScrolled: boolean;
  isLoggedIn: boolean;
  userLoading: boolean;
  user: any;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Navbar({
  isScrolled,
  isLoggedIn,
  userLoading,
  user,
  onLoginClick,
  onLogout,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  // Kiválasztott értékek
  const [selectedMarka, setSelectedMarka] = useState<string | null>(null);
  const [selectedTipus, setSelectedTipus] = useState<string | null>(null);
  const [selectedTarhely, setSelectedTarhely] = useState<string | null>(null);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const otherLinks = [
    { name: 'Főoldal', path: '/' },
    { name: 'Kapcsolat', path: '/kapcsolat' },
    { name: 'Rólunk', path: '/rolunk' },
  ];

  const getNavbarStyle = () =>
    isScrolled
      ? { backgroundColor: '#ffffff', background: '#ffffff' }
      : { background: 'linear-gradient(to right, #a8e6cf, #ffffff)', transition: 'background 0.5s ease' };

  const handleSearch = () => {
    if (!selectedMarka || !selectedTipus || !selectedTarhely) return;

    const query = `marka=${selectedMarka.toLowerCase()}&tipus=${selectedTipus.toLowerCase()}&tarhely=${selectedTarhely.replace(/\s/g, '')}`;
    window.location.href = `/keres?${query}`;

    // Reset választások és bezárás
    setSelectedMarka(null);
    setSelectedTipus(null);
    setSelectedTarhely(null);
    setIsProductsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled ? 'shadow-md backdrop-blur-lg py-3 md:py-4' : 'py-4 md:py-6'
      }`}
      style={getNavbarStyle()}
    >
      {/* Logó */}
      <a href="/" className="flex items-center gap-3">
        <img
          src="./img/retech_logo.ico"
          alt="ReTech"
          width="50"
          height="50"
          className={`transition-all duration-500 ${isScrolled ? 'filter invert opacity-80' : ''}`}
        />
        <span className={`font-bold text-xl ${isScrolled ? 'text-gray-800' : 'text-gray-800'}`}>
          ReTech
        </span>
      </a>

      {/* Desktop nézet */}
      <div className="hidden md:flex items-center gap-6 lg:gap-10">
        {otherLinks.map((link, i) => (
          <a
            key={i}
            href={link.path}
            className={`font-medium transition-colors ${
              isScrolled ? 'text-gray-700 hover:text-green-600' : 'text-gray-800 hover:text-green-600'
            }`}
          >
            {link.name}
          </a>
        ))}

        {/* Termékek dropdown */}
        <div className="relative" ref={productsRef}>
          <button
            onClick={() => setIsProductsOpen(!isProductsOpen)}
            className={`flex items-center gap-1 font-medium px-3 py-2 rounded-md transition-colors ${
              isScrolled
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-800 hover:bg-gray-100/30'
            }`}
          >
            Termékek
            <svg
              className={`w-4 h-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isProductsOpen && (
            <div className="absolute top-full left-0 mt-2 w-[720px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 p-6 grid grid-cols-[180px_1fr_220px] gap-6 text-sm">
              
              {/* Márkák */}
              <div className="space-y-3 border-r border-gray-100 pr-4">
                <h4 className="font-bold text-gray-800 mb-2">Márka</h4>
                {['Apple', 'Samsung', 'Nokia'].map((marka) => (
                  <button
                    key={marka}
                    onClick={() => setSelectedMarka(marka)}
                    className={`block w-full text-left py-1.5 px-3 rounded transition-colors ${
                      selectedMarka === marka ? 'bg-green-100 text-green-800 font-medium' : 'hover:bg-gray-50 text-gray-700'
                    } flex items-center gap-2`}
                  >
                    • {marka}
                  </button>
                ))}
              </div>

              {/* Típusok */}
              <div className="border-l border-gray-100 pl-4">
                <h4 className="font-bold text-gray-800 mb-2">Típus</h4>
                <ul className="space-y-2 text-gray-600">
                  {['Telefon', 'Tablet', 'Laptop'].map((tipus) => (
                    <li key={tipus}>
                      <button
                        onClick={() => setSelectedTipus(tipus)}
                        className={`w-full text-left hover:text-green-600 flex items-center gap-2 transition-colors ${
                          selectedTipus === tipus ? 'text-green-700 font-medium' : ''
                        }`}
                      >
                        • {tipus}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tárhelyek */}
              <div className="border-l border-gray-100 pl-4">
                <h4 className="font-bold text-gray-800 mb-2">Tárhely</h4>
                <ul className="space-y-2 text-gray-600">
                  {['32 GB', '64 GB', '128 GB', '256 GB', '512 GB', '1 TB'].map((tarhely) => (
                    <li key={tarhely}>
                      <button
                        onClick={() => setSelectedTarhely(tarhely)}
                        className={`w-full text-left hover:text-green-600 flex items-center gap-2 transition-colors ${
                          selectedTarhely === tarhely ? 'text-green-700 font-medium' : ''
                        }`}
                      >
                        • {tarhely}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Keresés gomb – jobb alsó */}
              <div className="col-span-3 mt-4 flex justify-end">
                <button
                  onClick={handleSearch}
                  disabled={!selectedMarka || !selectedTipus || !selectedTarhely}
                  className={`px-8 py-3 rounded-lg font-medium transition-all shadow-md ${
                    selectedMarka && selectedTipus && selectedTarhely
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Keresés
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Jobb oldal: User / Bejelentkezés */}
      <div className="hidden md:flex items-center gap-4">
        {isLoggedIn ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`p-2 rounded-md transition-all duration-500 ${
                isScrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-gray-800 hover:bg-gray-100'
              }`}
              aria-label="Felhasználói menü"
              disabled={userLoading}
            >
              {userLoading ? (
                <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
            </button>

            {isUserMenuOpen && (
              <UserMenuDropdown
                username={user?.username || 'Betöltés...'}
                email={user?.email || ''}
                recoinBalance={user?.recoins_balance ?? 0}
                myProducts={user?.myProducts || []}
                onLogout={onLogout}
                isLoading={userLoading}
              />
            )}
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${
              isScrolled ? 'text-black bg-green-300 hover:bg-green-400' : 'text-black bg-green-300 hover:bg-green-400'
            }`}
          >
            Bejelentkezés
          </button>
        )}
      </div>

      {/* Mobil nézet – hamburger */}
      <div className="flex items-center gap-3 md:hidden">
        <svg
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`h-6 w-6 cursor-pointer ${isScrolled ? 'text-gray-800' : 'text-gray-800'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </div>

      {/* Mobil teljes képernyős menü */}
      <div
        className={`fixed inset-0 bg-white flex flex-col items-center justify-center gap-8 text-2xl font-medium text-gray-800 transition-transform duration-500 md:hidden z-50 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button className="absolute top-6 right-6 text-3xl" onClick={() => setIsMenuOpen(false)}>
          ×
        </button>

        {otherLinks.map((link, i) => (
          <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </a>
        ))}

        {/* Mobil kereső – egyszerű select-ek */}
        <div className="w-4/5 max-w-md px-6 mt-8">
          <p className="text-2xl font-bold mb-6 text-center">Termék keresése</p>

          <select
            value={selectedMarka || ''}
            onChange={(e) => setSelectedMarka(e.target.value || null)}
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Válassz márkát</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Nokia">Nokia</option>
          </select>

          <select
            value={selectedTipus || ''}
            onChange={(e) => setSelectedTipus(e.target.value || null)}
            className="w-full p-4 mb-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Válassz típust</option>
            <option value="Telefon">Telefon</option>
            <option value="Tablet">Tablet</option>
            <option value="Laptop">Laptop</option>
          </select>

          <select
            value={selectedTarhely || ''}
            onChange={(e) => setSelectedTarhely(e.target.value || null)}
            className="w-full p-4 mb-6 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Válassz tárhelyet</option>
            <option value="32 GB">32 GB</option>
            <option value="64 GB">64 GB</option>
            <option value="128 GB">128 GB</option>
            <option value="256 GB">256 GB</option>
            <option value="512 GB">512 GB</option>
            <option value="1 TB">1 TB</option>
          </select>

          <button
            onClick={() => {
              handleSearch();
              setIsMenuOpen(false);
            }}
            disabled={!selectedMarka || !selectedTipus || !selectedTarhely}
            className={`w-full py-4 rounded-full text-xl font-medium transition-all ${
              selectedMarka && selectedTipus && selectedTarhely
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            Keresés indítása
          </button>
        </div>

        {isLoggedIn ? (
          <button
            onClick={() => {
              onLogout();
              setIsMenuOpen(false);
            }}
            className="mt-8 px-12 py-4 bg-red-500 text-white rounded-full text-xl hover:bg-red-600"
          >
            Kijelentkezés
          </button>
        ) : (
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onLoginClick();
            }}
            className="mt-8 px-12 py-4 bg-green-500 text-white rounded-full text-xl hover:bg-green-600"
          >
            Bejelentkezés
          </button>
        )}
      </div>
    </nav>
  );
}