import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {getMyProducts,deleteProduct,createProduct,} from "../service/service";
import type { Product, CreateProductPayload } from "../types/types";

const API_BASE_URL = "http://localhost:3000";

const initialForm: CreateProductPayload = {
  title: "",
  description: "",
  condition: "",
  category: "",
  brand: "",
  model: "",
  price_recoin: 0,
};

export default function MyAds() {
  const { token, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<CreateProductPayload>(initialForm);

  const loadMyProducts = async () => {
    if (!token || !isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      const data = await getMyProducts(token);
      setProducts(data);
    } catch (error) {
      console.error("Saját hirdetések betöltési hiba:", error);
      alert("Nem sikerült betölteni a hirdetéseidet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyProducts();
  }, [token, isAuthenticated]);

  const handleDelete = async (id: number) => {
    if (!token) return;

    const confirmed = window.confirm("Biztosan törölni szeretnéd ezt a hirdetést?");
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteProduct(id, token);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (error: any) {
      console.error("Hirdetés törlési hiba:", error);
      alert(error?.response?.data?.message || "Nem sikerült törölni a hirdetést.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "price_recoin" ? Number(value) : value,
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;
    if (!imageFile) {
      alert("Kép feltöltése kötelező.");
      return;
    }

    try {
      setSubmitting(true);
      await createProduct(form, imageFile, token);

      alert("A hirdetésed rögzítve lett. Admin jóváhagyás után fog megjelenni.");
      setForm(initialForm);
      setImageFile(null);
      setShowCreateForm(false);
      await loadMyProducts();
    } catch (error: any) {
      console.error("Hirdetés létrehozási hiba:", error);
      alert(error?.response?.data?.message || "Nem sikerült létrehozni a hirdetést.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeClass = (
    status: "PENDING" | "AVAILABLE" | "REJECTED" | "SOLD" | undefined
  ) => {
    if (status === "PENDING") return "bg-yellow-500/20 text-yellow-300";
    if (status === "AVAILABLE") return "bg-green-500/20 text-green-300";
    if (status === "REJECTED") return "bg-red-500/20 text-red-300";
    if (status === "SOLD") return "bg-blue-500/20 text-blue-300";
    return "bg-white/10 text-white";
  };

  const getStatusLabel = (
    status: "PENDING" | "AVAILABLE" | "REJECTED" | "SOLD" | undefined
  ) => {
    if (status === "PENDING") return "FÜGGŐBEN";
    if (status === "AVAILABLE") return "ELFOGADVA";
    if (status === "REJECTED") return "ELUTASÍTVA";
    if (status === "SOLD") return "ELKELT";
    return "ISMERETLEN";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b1026] via-[#1b1f4b] to-[#3b1d5c] flex items-center justify-center text-white">
        Betöltés...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1026] via-[#1b1f4b] to-[#3b1d5c] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h1 className="text-4xl font-bold">Hirdetéseim</h1>

          {products.length > 0 && (
            <button
              onClick={() => setShowCreateForm((prev) => !prev)}
              className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-full transition"
              type="button"
            >
              {showCreateForm ? "Űrlap bezárása" : "+ Hirdetés hozzáadása"}
            </button>
          )}
        </div>

        {products.length === 0 && !showCreateForm ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/10 p-12 shadow-xl flex flex-col items-center justify-center text-center">
            <p className="text-xl text-blue-100">
              Még nincs feltöltött hirdetésed.
            </p>

            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-8 bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-4 rounded-full transition text-lg"
              type="button"
            >
              Első hirdetés feltöltése
            </button>
          </div>
        ) : null}

        {showCreateForm && (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/10 p-8 shadow-xl mb-10">
            <p className="text-teal-300 uppercase tracking-[0.3em] text-sm font-semibold">
              Új hirdetés
            </p>

            <h2 className="text-3xl font-bold mt-2 mb-6">Hirdetés létrehozása</h2>

            <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm mb-2 text-blue-100">Cím</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-blue-100">Ár (ReCoin)</label>
                <input
                  type="number"
                  name="price_recoin"
                  value={form.price_recoin}
                  onChange={handleChange}
                  required
                  min={1}
                  className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-blue-100">Márka</label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-blue-100">Modell</label>
                <input
                  type="text"
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-blue-100">Állapot</label>
                <input
                  type="text"
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  required
                  placeholder="Pl. Újszerű"
                  className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-blue-100">Kategória</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  placeholder="Pl. Telefon"
                  className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-blue-100">Leírás</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-blue-100">Kép</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  required
                  className="w-full text-white"
                />
              </div>

              <div className="md:col-span-2 flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white px-6 py-3 rounded-full font-semibold transition"
                >
                  {submitting ? "Feltöltés..." : "Hirdetés mentése"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold transition"
                >
                  Mégse
                </button>
              </div>
            </form>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden shadow-xl"
              >
                <img
                  src={`${API_BASE_URL}${product.image_url}`}
                  alt={product.title}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="text-xl font-bold">{product.title}</h3>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadgeClass(
                        product.status
                      )}`}
                    >
                      {getStatusLabel(product.status)}
                    </span>
                  </div>

                  <p className="text-blue-100/80 mt-2">{product.description}</p>

                  <p className="mt-3 text-sm text-teal-300">
                    {product.brand} • {product.model}
                  </p>

                  <p className="mt-2 font-semibold">
                    {product.price_recoin} ReCoin
                  </p>

                  <p className="mt-2 text-sm text-blue-100/70">
                    Állapot: {product.condition}
                  </p>

                  <p className="mt-1 text-sm text-blue-100/70">
                    Kategória: {product.category}
                  </p>

                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="mt-5 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white px-4 py-2 rounded-full transition"
                    type="button"
                  >
                    {deletingId === product.id ? "Törlés..." : "Hirdetés törlése"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}