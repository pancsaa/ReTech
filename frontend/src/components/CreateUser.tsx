import React, { useState } from 'react';
import type { PostUsers } from '../types/types';
import { postUser } from '../service/service';

const initialForm: PostUsers = {
  username: '',
  email: '',
  password: '',
};

const CreateUser = () => {
  const [form, setForm] = useState<PostUsers>(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await postUser(form, imageFile || undefined);
      setSuccess(true);
      setForm(initialForm);
      setImageFile(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Szerver hiba – próbáld újra!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body">
          <h2 className="card-title text-center text-2xl">Regisztráció</h2>

          {error && (
            <div className="alert alert-error shadow-lg">
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success shadow-lg">
              <span>Sikeres regisztráció! Most már bejelentkezhetsz.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Felhasználónév</span>
              </label>
              <input
                type="text"
                name="username"
                placeholder="Felhasználónév"
                className="input input-bordered w-full"
                value={form.username}
                onChange={handleChange}
                required
                minLength={3}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email cím</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                className="input input-bordered w-full"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Jelszó</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Jelszó (min. 6 karakter)"
                className="input input-bordered w-full"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Profilkép (opcionális)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
              />
              {imageFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Kiválasztott: {imageFile.name}
                </p>
              )}
            </div>

            <div className="card-actions justify-center mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-md"></span>
                ) : (
                  'Regisztráció'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;