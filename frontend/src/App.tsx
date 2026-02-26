import { useState, useEffect } from 'react';
import './App.css';
import AboutUs from './components/AboutUs';
import Card from './components/ui/Card';
import Navbar from './components/navbar/Navbar';
import LoginModal from './components/login/LoginModal';

interface User {
  user_id: number;
  username: string;
  email: string;
  recoint_balance: number;           // ← konzisztens névvel (korábban recoins_balance volt máshol)
  register_date: string;
  myProducts?: Array<{
    product_id: number;
    title: string;
    status: string;
    price_recoint: number;
  }>;
}

const API_BASE = '/api';  // ← Proxy miatt így legyen (vite.config.ts-ben beállítva)

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Scroll hatás
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // kezdeti állapot
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auth állapot betöltése induláskor
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        setUserLoading(false);
        return;
      }

      setUserLoading(true);
      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();

          // Típusbiztosítás + fallback
          const safeUser: User = {
            user_id: data.user_id ?? 0,
            username: data.username ?? 'Ismeretlen',
            email: data.email ?? '',
            recoint_balance: data.recoint_balance ?? 0,
            register_date: data.register_date ?? '',
            myProducts: data.myProducts ?? [],
          };

          setUser(safeUser);
          setIsLoggedIn(true);
        } else {
          // Token érvénytelen vagy lejárt → töröljük
          localStorage.removeItem('authToken');
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (token: string, userData: User) => {
    localStorage.setItem('authToken', token);
    setUser(userData);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUser(null);
    // opcionálisan: redirect vagy toast üzenet
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isScrolled={isScrolled}
        isLoggedIn={isLoggedIn}
        userLoading={userLoading}
        user={user}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Fő tartalom */}
      <main>
        <AboutUs />
        <Card />
        {/* egyéb oldalak/komponensek később */}
      </main>

      {/* Login/Regisztráció modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleLoginSuccess}  // ugyanaz a handler, ha reg után is bejelentkezik
      />
    </div>
  );
}

export default App;