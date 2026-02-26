// src/components/login/RegisterPage.tsx
import React, { useState } from 'react';
import { SimpleInput } from '../ui/SimpleInput';
import { SimpleButton } from '../ui/SimpleButton';
import { SimpleLabel } from '../ui/SimpleLabel';

const API_BASE = '/api';

interface RegisterPageProps {
  onRegisterSuccess: (token: string, user: any) => void;
  switchToLogin: () => void;
}

export default function RegisterPage({
  onRegisterSuccess,
  switchToLogin,
}: RegisterPageProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('A két jelszó nem egyezik!');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Regisztráció sikertelen');
      }

      onRegisterSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Valami hiba történt...');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-emerald-800">Regisztrálj most!</h1>
          <p className="text-emerald-700 mt-3 text-lg">
            Készíts fiókot pár kattintással
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-8 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <SimpleLabel htmlFor="username">Felhasználónév</SimpleLabel>
            <SimpleInput
              id="username"
              type="text"
              placeholder="peldauser"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              required
              minLength={3}
              className="mt-1.5 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-300"
            />
          </div>

          <div>
            <SimpleLabel htmlFor="email">Email cím</SimpleLabel>
            <SimpleInput
              id="email"
              type="email"
              placeholder="pelda@domain.hu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1.5 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-300"
            />
          </div>

          <div>
            <SimpleLabel htmlFor="password">Jelszó</SimpleLabel>
            <div className="relative mt-1.5">
              <SimpleInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Legalább 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-emerald-200 focus:border-emerald-400 focus:ring-emerald-300 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 hover:text-emerald-800"
              >
                {showPassword ? 'Elrejt' : 'Mutat'}
              </button>
            </div>
          </div>

          <div>
            <SimpleLabel htmlFor="confirm">Jelszó újra</SimpleLabel>
            <SimpleInput
              id="confirm"
              type={showPassword ? 'text' : 'password'}
              placeholder="Írd be újra"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1.5 border-emerald-200 focus:border-emerald-400 focus:ring-emerald-300"
            />
          </div>

          <SimpleButton
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/40 mt-2"
          >
            {isLoading ? 'Folyamatban...' : 'Regisztráció'}
          </SimpleButton>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Már van fiókod?{' '}
          <button
            type="button"
            onClick={switchToLogin}
            className="text-emerald-700 hover:text-emerald-800 font-medium underline"
          >
            Jelentkezz be
          </button>
        </p>
      </div>
    </div>
  );
}