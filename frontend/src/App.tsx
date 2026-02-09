import { useState, useEffect } from 'react';
import './App.css';
import AboutUs from './components/AboutUs';
import Cards from '../src/components/ui/Card';
import Navbar from './components/navbar/Navbar';
import LoginModal from './components/login/LoginModal';


interface User {
  user_id: number;
  username: string;
  email: string;
  recoint_balance: number;
  register_date: string;
  myProducts?: Array<{
    product_id: number;
    title: string;
    status: string;
    price_recoint: number;
  }>;
}

const API_BASE = 'http://localhost:3001/api';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser({
            ...data,
            myProducts: data.myProducts || [],
          });
          setIsLoggedIn(true);
        } else {
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
  };

  return (
    <div>
      <div>

        <AboutUs />
      </div>
      <div>
        <Cards />
      </div>

      <Navbar
        isScrolled={isScrolled}
        isLoggedIn={isLoggedIn}
        userLoading={userLoading}
        user={user}
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleLoginSuccess}   // ugyanaz a függvény
      />
    </div>
  );
}

export default App;