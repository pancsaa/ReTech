import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getAdminProducts, approveProductAdmin, rejectProductAdmin, } from "../service/service";
import type { Product } from "../types/types";

const API_BASE_URL = "http://localhost:3000";

type FilterStatus = "PENDING" | "AVAILABLE" | "REJECTED" | "SOLD";

export default function AdminProducts() {
  const { token, isAuthenticated, user, isAuthReady } = useAuth();

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<FilterStatus>("PENDING");
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const isAdmin = user?.role === "ADMIN";

  const loadData = async (status: FilterStatus) => {
    if (!token || !isAuthenticated || !isAdmin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getAdminProducts(token, status);
      setItems(data);
    } catch (error) {
      console.error("Admin hirdetés lista hiba:", error);
      alert("Nem sikerült betölteni a hirdetéseket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeStatus);
  }, [activeStatus, token, isAuthenticated, isAdmin]);

  const handleApprove = async (id: number) => {
    if (!token) return;

    try {
      setActionLoadingId(id);
      await approveProductAdmin(id, token);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Elfogadási hiba:", error);
      alert("Nem sikerült elfogadni a hirdetést.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!token) return;

    try {
      setActionLoadingId(id);
      await rejectProductAdmin(id, token);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Elutasítási hiba:", error);
      alert("Nem sikerült elutasítani a hirdetést.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadgeClass = (status: FilterStatus) => {
    if (status === "PENDING") return "bg-yellow-500/20 text-yellow-300";
    if (status === "AVAILABLE") return "bg-green-500/20 text-green-300";
    if (status === "SOLD") return "bg-blue-500/20 text-blue-300";
    return "bg-red-500/20 text-red-300";
  };

  const getStatusLabel = (status: FilterStatus) => {
    if (status === "PENDING") return "FÜGGŐBEN";
    if (status === "AVAILABLE") return "ELFOGADVA";
    if (status === "SOLD") return "ELKELT";
    return "ELUTASÍTVA";
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b1026] via-[#1b1f4b] to-[#3b1d5c] flex items-center justify-center text-white">
        Betöltés...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1026] via-[#1b1f4b] to-[#3b1d5c] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-teal-300 uppercase tracking-[0.3em] text-sm font-semibold">
              Admin panel
            </p>
            <h1 className="text-4xl font-bold mt-2">Hirdetés kérelmek</h1>
          </div>

          <div className="flex gap-2 flex-wrap">
            {(["PENDING", "AVAILABLE", "REJECTED", "SOLD"] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-4 py-2 rounded-full border transition ${activeStatus === status
                  ? "bg-teal-500 text-white border-teal-400"
                  : "bg-white/5 border-white/10 text-blue-100 hover:bg-white/10"
                  }`}
                type="button"
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bg-white/10 border border-white/10 rounded-3xl p-8 text-blue-100">
            Betöltés...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white/10 border border-white/10 rounded-3xl p-8 text-blue-100">
            Nincs megjeleníthető hirdetés ebben a státuszban.
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm overflow-hidden shadow-xl"
              >
                <img
                  src={`${API_BASE_URL}${item.image_url}`}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                   style={{ userSelect: "none" }}
                />

                <div className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="text-2xl font-bold">{item.title}</h2>
                      <p className="text-blue-100/75 mt-2">
                        {item.description || "Nincs leírás"}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                        item.status as FilterStatus
                      )}`}
                       style={{ userSelect: "none" }}
                    >
                      {getStatusLabel(item.status as FilterStatus)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-blue-100 mt-5">
                    <span>• Felhasználó: {item.seller?.username ?? "-"}</span>
                    <span>• Email: {item.seller?.email ?? "-"}</span>
                    <span>• Kategória: {item.category ?? "-"}</span>
                    <span>• Márka: {item.brand ?? "-"}</span>
                    <span>• Modell: {item.model ?? "-"}</span>
                    <span>• Állapot: {item.condition ?? "-"}</span>
                    <span>• Ár: {item.price_recoin ?? "-"} ReCoin</span>
                  </div>

                  {activeStatus === "PENDING" && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => handleApprove(item.id)}
                        disabled={actionLoadingId === item.id}
                        className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white px-5 py-2 rounded-full font-semibold transition"
                        type="button"
                        style={{ userSelect: "none" }}
                      >
                        {actionLoadingId === item.id ? "Folyamatban..." : "Elfogadás"}
                      </button>

                      <button
                        onClick={() => handleReject(item.id)}
                        disabled={actionLoadingId === item.id}
                        className="bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white px-5 py-2 rounded-full font-semibold transition"
                        type="button"
                        style={{ userSelect: "none" }}
                      >
                        {actionLoadingId === item.id ? "Folyamatban..." : "Elutasítás"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}