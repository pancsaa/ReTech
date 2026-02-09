// src/components/login/AnimatedLoginPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { SimpleInput } from '../ui/SimpleInput';
import { SimpleButton } from '../ui/SimpleButton';
import { SimpleLabel } from '../ui/SimpleLabel';

const API_BASE = 'http://localhost:3001/api';

interface AnimatedLoginPageProps {
  onLoginSuccess: (token: string, user: any) => void;
  onSwitchToRegister: () => void;
}

export default function AnimatedLoginPage({
  onLoginSuccess,
  onSwitchToRegister,
}: AnimatedLoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mouseX, setMouseX] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);

  const purpleRef = useRef<HTMLDivElement | null>(null);
  const blackRef = useRef<HTMLDivElement | null>(null);
  const yellowRef = useRef<HTMLDivElement | null>(null);
  const orangeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMouseX(e.clientX);
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculatePosition = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const deltaX = mouseX - centerX;
    return { bodySkew: Math.max(-6, Math.min(6, -deltaX / 120)) };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  const getLookDirection = () => {
    if (isTyping) return { x: 3, y: 0 };
    if (showPassword && password.length > 0) return { x: -4, y: -2 };
    return { x: 0, y: 0 };
  };

  const lookDirection = getLookDirection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Bejelentkezés sikertelen');
      }

      const data = await res.json();
      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Hiba történt a bejelentkezés során');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full">
      {/* FIGURÁK – mobilban felül, desktopban bal oldalon */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-gray-50 to-indigo-50/30 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden min-h-[260px] sm:min-h-[320px] lg:min-h-auto">
        <div className="relative w-full max-w-[520px] h-[260px] sm:h-[340px] lg:h-[420px]">
          {/* Lila figura */}
          <div
            ref={purpleRef}
            className="absolute bottom-0 transition-all duration-300 ease-out"
            style={{
              left: '8%',
              width: '28%',
              height: '95%',
              backgroundColor: '#1A365D',
              borderRadius: '16px 16px 0 0',
              zIndex: 1,
              transform: `skewX(${purplePos.bodySkew}deg)`,
              transformOrigin: 'bottom center',
            }}
          >
            <div className="absolute top-[18%] left-1/2 -translate-x-1/2 flex gap-3 sm:gap-5">
              <div className="w-3 sm:w-4 h-3 sm:h-4 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <div
                  className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full transition-transform duration-150"
                  style={{ transform: `translate(${lookDirection.x}px, ${lookDirection.y}px)` }}
                />
              </div>
              <div className="w-3 sm:w-4 h-3 sm:h-4 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <div
                  className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full transition-transform duration-150"
                  style={{ transform: `translate(${lookDirection.x}px, ${lookDirection.y}px)` }}
                />
              </div>
            </div>
          </div>

          {/* Fekete figura */}
          <div
            ref={blackRef}
            className="absolute bottom-0 transition-all duration-300 ease-out"
            style={{
              left: '35%',
              width: '24%',
              height: '82%',
              backgroundColor: '#111827',
              borderRadius: '14px 14px 0 0',
              zIndex: 2,
              transform: `skewX(${blackPos.bodySkew * 1.3}deg)`,
              transformOrigin: 'bottom center',
            }}
          >
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 flex gap-3 sm:gap-5">
              <div className="w-3 sm:w-4 h-3 sm:h-4 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <div
                  className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full transition-transform duration-150"
                  style={{ transform: `translate(${lookDirection.x}px, ${lookDirection.y}px)` }}
                />
              </div>
              <div className="w-3 sm:w-4 h-3 sm:h-4 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <div
                  className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full transition-transform duration-150"
                  style={{ transform: `translate(${lookDirection.x}px, ${lookDirection.y}px)` }}
                />
              </div>
            </div>
          </div>

          {/* Narancs figura */}
          <div
            ref={orangeRef}
            className="absolute bottom-0 transition-all duration-300 ease-out"
            style={{
              left: '5%',
              width: '32%',
              height: '52%',
              backgroundColor: '#F97316',
              borderRadius: '9999px 9999px 0 0',
              zIndex: 3,
              transform: `skewX(${orangePos.bodySkew}deg)`,
              transformOrigin: 'bottom center',
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4 sm:gap-6">
              <div className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 bg-black rounded-full" />
              <div className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 bg-black rounded-full" />
            </div>
          </div>

          {/* Sárga figura – javított verzió (hosszabb, ívelt aljú, vonalas száj) */}
          <div
            ref={yellowRef}
            className="absolute bottom-0 transition-all duration-300 ease-out"
            style={{
              right: '5%',
              width: '34%',
              height: '70%',
              backgroundColor: '#FCD34D',
              borderRadius: '50% 50% 40% 40% / 60% 60% 0 0',
              zIndex: 4,
              transform: `skewX(${yellowPos.bodySkew * 0.7}deg)`,
              transformOrigin: 'bottom center',
            }}
          >
            {/* Száj vonal – hosszabb, középen */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full"
              style={{
                top: '55%',
                width: '60%',
                height: '5px',
                maxWidth: '90px',
              }}
            />

            {/* Két szem – kicsit lejjebb és közelebb egymáshoz */}

            <div className="absolute top-[38%] left-1/2 -translate-x-1/2 flex gap-5 sm:gap-7">
              <div className="w-3.5 sm:w-4.5 h-3.5 sm:h-4.5 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                <div
                  className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full transition-transform duration-150"
                  style={{ transform: `translate(${lookDirection.x * 0.8}px, ${lookDirection.y}px)` }}
                />
              </div>
              <div className="w-3.5 sm:w-4.5 h-3.5 sm:h-4.5 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm">
                <div
                  className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full transition-transform duration-150"
                  style={{ transform: `translate(${lookDirection.x * 0.8}px, ${lookDirection.y}px)` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BEJELENTKEZŐ FORM */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900">Üdvözöllek újra!</h1>
            <p className="text-gray-600 mt-3 text-lg">Add meg az adataidat a belépéshez</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <SimpleLabel htmlFor="email">Email cím</SimpleLabel>
              <SimpleInput
                id="email"
                type="email"
                placeholder="pelda@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <SimpleLabel htmlFor="password">Jelszó</SimpleLabel>
              <div className="relative mt-1">
                <SimpleInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsTyping(true)}
                  onBlur={() => setIsTyping(false)}
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword);
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 800);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-indigo-600 active:scale-95 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-1"
                >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <SimpleButton
              type="submit"
              className="w-full py-3 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Belépés folyamatban...' : 'Belépés'}
            </SimpleButton>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Nincs fiókod?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-emerald-600 hover:text-emerald-800 font-medium underline transition-colors"
            >
              Regisztrálj itt
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}