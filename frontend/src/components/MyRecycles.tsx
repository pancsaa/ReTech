import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { createRecycle, getMyRecycles } from "../service/service";
import type { CreateRecyclePayload, RecycleRequest } from "../types/types";

const API_BASE_URL = "";

const productTypes = [
  { value: "PHONE", label: "Telefon" },
  { value: "LAPTOP", label: "Laptop" },
  { value: "TABLET", label: "Tablet" },
  { value: "OTHER", label: "Egyéb" },
];

const conditions = [
  { value: "NEW", label: "Új" },
  { value: "LIKE_NEW", label: "Újszerű" },
  { value: "GOOD", label: "Jó" },
  { value: "FAIR", label: "Közepes" },
  { value: "POOR", label: "Rossz" },
];

export default function MyRecycles() {
  const { token, isAuthenticated, isAuthReady } = useAuth();

  const [items, setItems] = useState<RecycleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState<CreateRecyclePayload>({
    product_type: "PHONE",
    condition: "GOOD",
    category: "Telefon",
    brand: "",
    model: "",
    description: "",
    note: "",
  });

  const loadData = async () => {
    if (!token || !isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getMyRecycles(token);
      setItems(data);
    } catch (error) {
      console.error("Recycle lista betöltési hiba:", error);
      alert("Nem sikerült betölteni az újrahasznosítási kérelmeket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token, isAuthenticated]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    try {
      setSubmitting(true);

      await createRecycle(form, token, imageFile ?? undefined);

      alert(
        "Az újrahasznosítási kérelmed rögzítve lett. Admin jóváhagyás szükséges."
      );

      setForm({
        product_type: "PHONE",
        condition: "GOOD",
        category: "Telefon",
        brand: "",
        model: "",
        description: "",
        note: "",
      });

      setImageFile(null);

      await loadData();
    } catch (error) {
      console.error("Recycle létrehozási hiba:", error);
      alert("Nem sikerült létrehozni a kérelmet.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status: RecycleRequest["status"]) => {
    if (status === "PENDING") return "bg-yellow-500/20 text-yellow-300";
    if (status === "APPROVED") return "bg-green-500/20 text-green-300";
    return "bg-red-500/20 text-red-300";
  };

  const getStatusLabel = (status: RecycleRequest["status"]) => {
    if (status === "PENDING") return "Függőben";
    if (status === "APPROVED") return "Elfogadva";
    return "Elutasítva";
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b1026] via-[#1b1f4b] to-[#3b1d5c] flex items-center justify-center text-white">
        Betöltés...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1026] via-[#1b1f4b] to-[#3b1d5c] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
        <div className="bg-white/10 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <p className="text-teal-300 uppercase tracking-[0.3em] text-sm font-semibold">
            Újrahasznosítás
          </p>
          <h1 className="text-3xl font-bold mt-2 mb-6" >
            Új újrahasznosítási kérelem
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-2 text-blue-100">
                Terméktípus
              </label>
              <select
                name="product_type"
                value={form.product_type}
                onChange={handleChange}
                className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-white"
              >
                {productTypes.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                    className="text-black"
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-blue-100">
                Állapot
              </label>
              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-white"
              >
                {conditions.map((condition) => (
                  <option
                    key={condition.value}
                    value={condition.value}
                    className="text-black"
                  >
                    {condition.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2 text-blue-100">
                Márka
              </label>

              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Pl. Apple"
                required
                className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-blue-100">
                Modell
              </label>

              <input
                type="text"
                name="model"
                value={form.model}
                onChange={handleChange}
                placeholder="Pl. iPhone 12"
                required
                className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-blue-100">
                Leírás
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                required
                className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-blue-100">
                Kép
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white px-6 py-3 rounded-full font-semibold transition"
               style={{ userSelect: "none" }}
            >
              {submitting ? "Folyamatban..." : "Kérelem beküldése"}
            </button>

          </form>
        </div>

        <div>

          <div className="mb-6">
            <p className="text-teal-300 uppercase tracking-[0.3em] text-sm font-semibold">
              Saját kérelmek
            </p>

            <h2 className="text-3xl font-bold mt-2">
              Újrahasznosítási előzmények
            </h2>
          </div>

          {items.length === 0 ? (
            <div className="bg-white/10 border border-white/10 rounded-3xl p-8">
              Még nincs újrahasznosítási kérelmed.
            </div>
          ) : (
            <div className="space-y-4">

              {items.map((item) => (

                <div
                  key={item.id}
                  className="rounded-3xl border border-white/10 bg-white/10 overflow-hidden shadow-xl"
                >

                  {item.image_url ? (
                    <img
                      src={`${API_BASE_URL}${item.image_url}`}
                      alt=""
                      className="w-full h-56 object-cover"
                       style={{ userSelect: "none" }}
                    />
                  ) : (
                    <div className="w-full h-56 bg-white/5 flex items-center justify-center"
                    style={{ userSelect: "none" }}>
                      Nincs kép
                    </div>
                  )}

                  <div className="p-6">

                    <div className="flex justify-between">

                      <h3 className="text-2xl font-bold">
                        {item.brand} {item.model}
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                          item.status
                        )}`}
                         style={{ userSelect: "none" }}
                      >
                        {getStatusLabel(item.status)}
                      </span>

                    </div>

                    <p className="text-blue-100/75 mt-2">
                      {item.description}
                    </p>

                    {item.status === "APPROVED" && (
                      <div className="mt-4 rounded-2xl bg-green-500/10 border border-green-400/30 p-4" >
                        <p className="text-sm text-green-100 leading-6"  style={{ userSelect: "none" }}>
                          <span className="font-semibold text-white">
                            Teendő:
                          </span>{" "}
                          Kérjük csomagold be a terméket és juttasd el erre a{" "}
                          <span className="font-semibold text-white">
                            címre:
                          </span>{" "}
                          <br />
                          <span className="font-semibold text-white">
                            Gyöngyös, Thán Károly u. 1, 3200
                          </span>
                          <br />
                          Fontos, hogy a terméket ugyanabban az állapotban add le, ahogy feltüntetted.
                        </p>
                      </div>
                    )}

                    {item.status === "REJECTED" && (
                      <div className="mt-4 rounded-2xl bg-red-500/10 border border-red-400/30 p-4" style={{ userSelect: "none" }}>
                        <p className="text-sm text-red-200">
                          Az admin elutasította ezt az újrahasznosítási kérelmet.
                        </p>
                      </div>
                    )}

                    {item.status === "PENDING" && (
                      <div className="mt-4 rounded-2xl bg-yellow-500/10 border border-yellow-400/30 p-4">
                        <p className="text-sm text-yellow-200">
                          A kérelmed admin jóváhagyásra vár.
                        </p>
                      </div>
                    )}

                    <p className="mt-4 text-xs text-blue-200/70">
                      Létrehozva:{" "}
                      {new Date(item.date).toLocaleString("hu-HU")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}