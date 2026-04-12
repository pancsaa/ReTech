import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getAdminRecycles, approveRecycle, rejectRecycle, } from "../service/service";
import type { RecycleRequest } from "../types/types";

const API_BASE_URL = "";

type FilterStatus = "PENDING" | "APPROVED" | "REJECTED";

export default function AdminRecycles() {
  const { token, isAuthenticated, user, isAuthReady } = useAuth();

  const [items, setItems] = useState<RecycleRequest[]>([]);
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
      const data = await getAdminRecycles(token, status);
      setItems(data);
    } catch (error) {
      console.error("Admin recycle lista hiba:", error);
      alert("Nem sikerült betölteni a recycle kérelmeket.");
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
      await approveRecycle(id, token);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Elfogadási hiba:", error);
      alert("Nem sikerült elfogadni a kérelmet.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!token) return;

    try {
      setActionLoadingId(id);
      await rejectRecycle(id, token);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Elutasítási hiba:", error);
      alert("Nem sikerült elutasítani a kérelmet.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadgeClass = (status: RecycleRequest["status"]) => {
    if (status === "PENDING") return "bg-yellow-500/20 text-yellow-300";
    if (status === "APPROVED") return "bg-green-500/20 text-green-300";
    return "bg-red-500/20 text-red-300";
  };

  const getStatusLabel = (status: RecycleRequest["status"]) => {
    if (status === "PENDING") return "FÜGGŐBEN";
    if (status === "APPROVED") return "ELFOGADVA";
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
            <h1 className="text-4xl font-bold mt-2">Recycle kérelmek</h1>
          </div>

          <div className="flex gap-2 flex-wrap">
            {(["PENDING", "APPROVED", "REJECTED"] as FilterStatus[]).map((status) => (
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

        {items.length === 0 ? (
          <div className="bg-white/10 border border-white/10 rounded-3xl p-8 text-blue-100">
            Nincs megjeleníthető recycle kérelem ebben a státuszban.
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-sm overflow-hidden shadow-xl"
              >
                {item.image_url ? (
                  <img
                    src={`${API_BASE_URL}${item.image_url}`}
                    alt={`${item.brand} ${item.model}`}
                    className="w-full h-64 object-cover"
                     style={{ userSelect: "none" }}
                  />
                ) : (
                  <div className="w-full h-64 bg-white/5 flex items-center justify-center text-blue-100/70" style={{ userSelect: "none" }}>
                    Nincs kép
                  </div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {item.brand} {item.model}
                      </h2>
                      <p className="text-blue-100/75 mt-2">
                        {item.description || "Nincs leírás"}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                        item.status
                      )}`}
                       style={{ userSelect: "none" }}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm text-blue-100 mt-5">
                    <span>• Felhasználó: {item.user?.username ?? "-"}</span>
                    <span>• Email: {item.user?.email ?? "-"}</span>
                    <span>• Típus: {item.product_type ?? "-"}</span>
                    <span>• Állapot: {item.condition ?? "-"}</span>
                    <span>• Kategória: {item.category ?? "-"}</span>
                    <span>• Márka: {item.brand ?? "-"}</span>
                    <span>• Modell: {item.model ?? "-"}</span>
                    <span>• ReCoin jutalom: {item.recoin_reward ?? "-"}</span>
                  </div>

                  {item.note && (
                    <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-4">
                      <p className="text-sm text-blue-100/80">
                        <span className="font-semibold text-white">Megjegyzés:</span>{" "}
                        {item.note}
                      </p>
                    </div>
                  )}

                  {item.date && (
                    <p className="mt-4 text-xs text-blue-200/70">
                      Létrehozva: {new Date(item.date).toLocaleString("hu-HU")}
                    </p>
                  )}

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