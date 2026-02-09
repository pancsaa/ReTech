// src/components/login/LoginModal.tsx
import React, { useState } from 'react';
import AnimatedLoginPage from './AnimatedLoginPage';
import RegisterPage from './RegisterPage';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: any) => void;
  onRegisterSuccess: (token: string, user: any) => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterSuccess,
}: LoginModalProps) {
  const [view, setView] = useState<'login' | 'register'>('login');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-6xl h-[90vh] lg:h-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-50 p-3 rounded-full bg-gray-900/90 text-white hover:bg-gray-950 hover:scale-110 hover:shadow-lg active:scale-95 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Bezárás"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {view === 'login' ? (
            <AnimatedLoginPage
              onLoginSuccess={onLoginSuccess}
              onSwitchToRegister={() => setView('register')}
            />
          ) : (
            <RegisterPage
              onRegisterSuccess={onRegisterSuccess}
              switchToLogin={() => setView('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
}