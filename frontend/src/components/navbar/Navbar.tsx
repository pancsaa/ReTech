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
  const userMenuRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Főoldal', path: '/' },
    { name: 'Termékek', path: '/' },
    { name: 'Kapcsolat', path: '/' },
    { name: 'Rólunk', path: '/' },
  ];

  const getNavbarStyle = () =>
    isScrolled
      ? { backgroundColor: '#ffffff', background: '#ffffff' }
      : { background: 'linear-gradient(to right, #a8e6cf, #ffffff)', transition: 'background 0.5s ease' };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled ? 'shadow-md backdrop-blur-lg py-3 md:py-4' : 'py-4 md:py-6'
      }`}
      style={getNavbarStyle()}
    >
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

      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <a
            key={i}
            href={link.path}
            className={`group flex flex-col gap-0.5 transition-colors duration-300 ${
              isScrolled ? 'text-gray-700 hover:text-green-500' : 'text-gray-800 hover:text-green-500'
            }`}
          >
            {link.name}
            <div
              className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 ${
                isScrolled ? 'bg-green-500' : 'bg-green-500'
              }`}
            />
          </a>
        ))}
      </div>

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
                recoinBalance={user?.recoint_balance ?? 0}
                myProducts={user?.myProducts || []}
                onLogout={onLogout}
                isLoading={userLoading}
              />
            )}
          </div>
        ) : null}

        {!isLoggedIn && (
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

      {/* Mobil nézet */}
      <div className="flex items-center gap-3 md:hidden">
        {isLoggedIn ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`p-2 ${isScrolled ? 'text-gray-800' : 'text-gray-800'}`}
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
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.username?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="font-bold">{user?.username || 'Betöltés...'}</h3>
                    <p className="text-xs text-gray-600">Balance: {user?.recoint_balance ?? 0} R$</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full py-2 bg-red-50 text-red-600 rounded font-medium"
                >
                  Kijelentkezés
                </button>
              </div>
            )}
          </div>
        ) : null}

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

      <div
        className={`fixed inset-0 bg-white flex flex-col items-center justify-center gap-8 text-2xl font-medium text-gray-800 transition-transform duration-500 md:hidden z-50 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button className="absolute top-6 right-6 text-3xl" onClick={() => setIsMenuOpen(false)}>
          ×
        </button>

        {navLinks.map((link, i) => (
          <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </a>
        ))}

        {isLoggedIn ? (
          <div className="text-center mt-8">
            <div className="w-20 h-20 bg-green-400 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
              {user?.username?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <p className="text-xl font-bold">{user?.username}</p>
            <p className="text-lg text-gray-600 mb-6">Balance: {user?.recoint_balance ?? 0} R$</p>
            <button
              onClick={() => {
                onLogout();
                setIsMenuOpen(false);
              }}
              className="bg-red-500 text-white px-10 py-4 rounded-full text-xl hover:bg-red-600"
            >
              Kijelentkezés
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onLoginClick();
            }}
            className="bg-green-500 text-white px-10 py-4 rounded-full text-xl hover:bg-green-600 mt-8"
          >
            Bejelentkezés
          </button>
        )}
      </div>
    </nav>
  );
}