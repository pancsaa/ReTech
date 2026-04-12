import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth(); 
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await axios.post('/api/authorise/login', {
        email: loginForm.email,
        password: loginForm.password,
      });

      const { accessToken } = res.data;
      authLogin(accessToken); 

      setSuccess('Sikeres bejelentkezés!');
      setTimeout(() => navigate('/'), 1200);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Hibás email vagy jelszó. Próbáld újra!'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('username', registerForm.username);
    formData.append('email', registerForm.email);
    formData.append('password', registerForm.password);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await axios.post('/api/authorise/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Sikeres regisztráció! Most már bejelentkezhetsz.');
      setTab('login'); 
      setRegisterForm({ username: '', email: '', password: '' });
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Regisztráció sikertelen. Lehet, hogy foglalt az email?'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              tab === 'login'
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Bejelentkezés
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              tab === 'register'
                ? 'text-white border-b-2 border-indigo-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Regisztráció
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-900/40 border border-red-700 text-red-300 rounded-xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-900/40 border border-green-700 text-green-300 rounded-xl text-sm">
              {success}
            </div>
          )}

          <form
            onSubmit={tab === 'login' ? handleLogin : handleRegister}
            className="space-y-5"
          >
            {tab === 'register' && (
              <>
                <div className="flex flex-col items-center mb-2">
                  <label htmlFor="avatar" className="cursor-pointer group flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-gray-700 group-hover:border-indigo-500 transition overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 group-hover:text-indigo-400">
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="8" r="5" />
                            <path d="M20 21a8 8 0 0 0-16 0" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-400 group-hover:text-indigo-400 text-center">
                      {imageFile ? imageFile.name : 'Profilkép feltöltése'}
                    </p>
                  </label>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center bg-gray-800 border border-gray-700 rounded-full h-12 px-5 gap-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="8" r="5" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                  <input
                    type="text"
                    name="username"
                    placeholder="Felhasználónév"
                    value={registerForm.username}
                    onChange={handleRegisterChange}
                    className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
                    required
                    minLength={3}
                  />
                </div>
              </>
            )}

            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-full h-12 px-5 gap-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
              </svg>
              <input
                type="email"
                name="email"
                placeholder={tab === 'login' ? 'Email cím' : 'Email cím'}
                value={tab === 'login' ? loginForm.email : registerForm.email}
                onChange={
                  tab === 'login' ? handleLoginChange : handleRegisterChange
                }
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
                required
              />
            </div>

            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-full h-12 px-5 gap-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                name="password"
                placeholder="Jelszó"
                value={tab === 'login' ? loginForm.password : registerForm.password}
                onChange={
                  tab === 'login' ? handleLoginChange : handleRegisterChange
                }
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
                required
                minLength={6}
              />
            </div>

            {tab === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  Elfelejtett jelszó?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-full transition flex items-center justify-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              )}
              {tab === 'login' ? 'Bejelentkezés' : 'Regisztráció'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            {tab === 'login'
              ? 'Nincs még fiókod?'
              : 'Már van fiókod?'}{' '}
            <button
              type="button"
              onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {tab === 'login' ? 'Regisztrálj' : 'Jelentkezz be'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}