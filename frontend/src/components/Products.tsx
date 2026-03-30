import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getAllProducts, buyProduct } from "../service/service";
import type { Product } from "../types/types";

const API_BASE_URL = "http://localhost:3000";

export default function Products() {
  const { token, user, isAuthenticated, refreshUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Termékek betöltési hiba:", error);
        alert("Nem sikerült betölteni a termékeket.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleBuy = async (product: Product) => {
    if (!token || !isAuthenticated || !user) {
      alert("A vásárláshoz be kell jelentkezned.");
      return;
    }

    if (product.seller_id === user.userid) {
      alert("A saját hirdetésedet nem veheted meg.");
      return;
    }

    if ((user.recoin_balance ?? 0) < product.price_recoin) {
      alert("Nincs elég ReCoin az egyenlegeden.");
      return;
    }

    setSelectedProduct(product);
    setShippingAddress("");
  };

  const handleConfirmBuy = async () => {
    if (!selectedProduct || !token || !user) return;

    if (!shippingAddress.trim()) {
      alert("Add meg a szállítási címet.");
      return;
    }

    try {
      setBuyingId(selectedProduct.id);

      await buyProduct(
        {
          product_id: selectedProduct.id,
          shipping_address: shippingAddress.trim(),
        },
        token
      );

      await refreshUser();

      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id ? { ...p, status: "SOLD" } : p
        )
      );

      setSelectedProduct(null);
      setShippingAddress("");

      alert("Sikeres vásárlás!");
    } catch (error: any) {
      console.error("Vásárlási hiba:", error);
      alert(
        error?.response?.data?.message || "Nem sikerült megvenni a terméket."
      );
    } finally {
      setBuyingId(null);
    }
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
        <h1 className="text-4xl font-bold mb-10">Termékek</h1>

        {products.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl border border-white/10 p-8 shadow-xl">
            Jelenleg nincs elérhető termék.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {products.map((product) => {
              const isOwnProduct = product.seller_id === user?.userid;
              const isSold = product.status === "SOLD";
              const hasEnoughRecoin =
                (user?.recoin_balance ?? 0) >= product.price_recoin;

              return (
                <div
                  key={product.id}
                  className="rounded-3xl bg-white/10 backdrop-blur-sm shadow-xl border border-white/10 overflow-hidden hover:scale-[1.02] transition p-4 h-full flex flex-col"
                >
                  <div className="flex items-center justify-center h-64 mb-4"  style={{ userSelect: "none" }}>
                    <img
                      src={`${API_BASE_URL}${product.image_url}`}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain rounded-2xl"
                    />
                  </div>

                  <h2 className="text-white text-2xl font-bold mb-3 px-2">
                    {product.title}
                  </h2>

                  <p className="text-blue-100/80 px-2 mb-4 min-h-[56px]">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-2 px-2 mb-4 min-h-[72px] content-start">
                    <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm">
                      {product.brand}
                    </span>

                    <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm">
                      {product.model}
                    </span>

                    <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm">
                      {product.condition}
                    </span>

                    <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-sm">
                      {product.category}
                    </span>

                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                      Ellenőrzött
                    </span>
                  </div>

                  <div className="mt-auto flex justify-between items-center gap-3 px-2">
                    <span className="font-bold text-white bg-teal-500/20 px-4 py-2 rounded-full whitespace-nowrap"  style={{ userSelect: "none" }}>
                      {product.price_recoin} ReCoin
                    </span>

                    {isSold ? (
                      <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full font-semibold whitespace-nowrap" style={{ userSelect: "none" }}>
                        Elkelt
                      </div>
                    ) : isOwnProduct ? (
                      <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full font-semibold whitespace-nowrap" style={{ userSelect: "none" }}>
                        Saját hirdetés
                      </div>
                    ) : !hasEnoughRecoin ? (
                      <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full font-semibold whitespace-nowrap" style={{ userSelect: "none" }}>
                        Nincs elég ReCoin
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBuy(product)}
                        disabled={buyingId === product.id}
                        type="button"
                        className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white px-4 py-2 rounded-full font-semibold transition whitespace-nowrap"
                      >
                        {buyingId === product.id
                          ? "Folyamatban..."
                          : "Megveszem"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#141b3a] p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">
              Szállítási cím megadása
            </h2>

            <p className="text-blue-100/80 mb-5">
              Add meg a szállítási címet a vásárláshoz.
            </p>

            <label className="block text-sm mb-2 text-blue-100">
              Szállítási cím
            </label>

            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={4}
              className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder:text-blue-100/50 outline-none"
              placeholder="Pl.: 1234 Budapest, Példa utca 12. 3/5"
            />

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setShippingAddress("");
                }}
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20"
                type="button"
              >
                Mégse
              </button>

              <button
                onClick={handleConfirmBuy}
                disabled={buyingId === selectedProduct.id}
                className="px-4 py-2 rounded-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50"
                type="button"
              >
                {buyingId === selectedProduct.id
                  ? "Folyamatban..."
                  : "Véglegesítés"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}