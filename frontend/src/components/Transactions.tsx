import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getMyTransactions } from "../service/service";
import type { TransactionItem } from "../types/types";

const API_BASE_URL = "http://localhost:3000";

export default function Transactions() {
  const { token, isAuthenticated, isAuthReady, user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

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

              return (
                <div
                  key={transaction.id}
                  className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden shadow-xl"
                >
                  <img
                    src={`${API_BASE_URL}${transaction.product.image_url}`}
                    alt={transaction.product.title}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-5">
                    <h3 className="text-xl font-bold">{transaction.product.title}</h3>

                    <p className="mt-3 font-semibold">
                      {transaction.amount} ReCoin
                    </p>

                    <p className="mt-2 text-sm text-blue-100/80">
                      Vásárlás dátuma:{" "}
                      {new Date(transaction.transaction_date).toLocaleString("hu-HU")}
                    </p>

                    {isSeller && transaction.shipping_address && (
                      <p className="mt-2 text-sm text-blue-100/80">
                        <span className="font-semibold text-white">Szállítási cím, (Telefonszám):</span>{" "}
                        {transaction.shipping_address}
                      </p>
                    )}

                    <span className="inline-block mt-4 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-sm">
                      Sikeres vásárlás
                    </span>
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