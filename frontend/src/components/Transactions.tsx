import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { confirmDelivery, getMyTransactions } from "../service/service";
import type { TransactionItem } from "../types/types";

const API_BASE_URL = "http://localhost:3000";

export default function Transactions() {
  const { token, isAuthenticated, isAuthReady, user, refreshUser } = useAuth();

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!token || !isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMyTransactions(token);
        setTransactions(data);
      } catch (error) {
        console.error("Tranzakciók betöltési hiba:", error);
        alert("Nem sikerült betölteni a tranzakciókat.");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [token, isAuthenticated]);

  const handleConfirmDelivery = async (transactionId: number) => {
    if (!token) return;

    try {
      setConfirmingId(transactionId);

      const updated = await confirmDelivery(transactionId, token);

      setTransactions((prev) =>
        prev.map((item) => (item.id === transactionId ? updated : item))
      );

      await refreshUser();
      alert("Sikeresen visszaigazoltad, hogy megérkezett a termék.");
    } catch (error: any) {
      console.error("Átvétel visszaigazolási hiba:", error);
      alert(
        error?.response?.data?.message ||
          "Nem sikerült visszaigazolni az átvételt."
      );
    } finally {
      setConfirmingId(null);
    }
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
        <h1 className="text-4xl font-bold mb-10">Tranzakciók</h1>

        {transactions.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/10 p-8 shadow-xl">
            Még nincs tranzakciód.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transactions.map((transaction) => {
              const isSeller = transaction.product.seller_id === user?.userid;
              const isBuyer = transaction.buyer?.id === user?.userid;

              return (
                <div
                  key={transaction.id}
                  className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden shadow-xl"
                >
                  <img
                    src={`${API_BASE_URL}${transaction.product.image_url}`}
                    alt={transaction.product.title}
                    className="w-full h-56 object-cover"
                     style={{ userSelect: "none" }}
                  />

                  <div className="p-5">
                    <h3 className="text-xl font-bold">
                      {transaction.product.title}
                    </h3>

                    <p className="mt-3 font-semibold">
                      {transaction.amount} ReCoin
                    </p>

                    <p className="mt-2 text-sm text-blue-100/80">
                      Vásárlás dátuma:{" "}
                      {new Date(transaction.transaction_date).toLocaleString(
                        "hu-HU"
                      )}
                    </p>

                    {isSeller && transaction.shipping_address && (
                      <p className="mt-2 text-sm text-blue-100/80">
                        <span className="font-semibold text-white">
                          Szállítási cím, (Telefonszám):
                        </span>{" "}
                        {transaction.shipping_address}
                      </p>
                    )}

                    {transaction.delivered_confirmed ? (
                      <div className="mt-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm"  style={{ userSelect: "none" }}>
                          Átvétel visszaigazolva
                        </span>

                        {transaction.delivered_at && (
                          <p className="mt-2 text-sm text-blue-100/80">
                            Visszaigazolás ideje:{" "}
                            {new Date(transaction.delivered_at).toLocaleString(
                              "hu-HU"
                            )}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-sm" style={{ userSelect: "none" }}>
                          Átvétel visszaigazolására vár
                        </span>
                      </div>
                    )}

                    {isBuyer && (
                      <label className="mt-4 flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-success"
                          checked={transaction.delivered_confirmed}
                          disabled={
                            transaction.delivered_confirmed ||
                            confirmingId === transaction.id
                          }
                          onChange={() => handleConfirmDelivery(transaction.id)}
                        />
                        <span className="text-sm text-white"  style={{ userSelect: "none" }}>
                          Megérkezett a termék
                        </span>
                      </label>
                    )}

                    {isSeller && !transaction.delivered_confirmed && (
                      <p className="mt-4 text-sm text-blue-100/80">
                        Az eladó ReCoin jóváírása akkor történik meg, ha a vevő
                        visszaigazolja az átvételt.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}