import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts, buyProduct } from "../service/service";
import { useAuth } from "./AuthContext";
import type { Product } from "../types/types";

const API_BASE_URL = "http://localhost:3000";

export default function Home() {
  const navigate = useNavigate();
  const { token, user, isAuthenticated, refreshUser } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Hiba a termékek lekérésekor:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleBuy = async (product: Product) => {
    if (!token || !isAuthenticated || !user) {
      alert("A vásárláshoz be kell jelentkezned.");
      navigate("/login");
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
        prev.map((p) => (p.id === selectedProduct.id ? { ...p, status: "SOLD" } : p))
      );

      setSelectedProduct(null);
      setShippingAddress("");

      alert("Sikeres vásárlás!");
    } catch (error: any) {
      console.error("Vásárlási hiba:", error);
      alert(
        error?.response?.data?.message || "Nem sikerült megvásárolni a terméket."
      );
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <>
      <div className="hero min-h-screen bg-gradient-to-br from-[#0b1026] via-[#1b1f4b] to-[#3b1d5c]">
        <div className="hero-content text-center px-6 py-20 md:py-28 lg:py-32 max-w-5xl mx-auto">
          <div className="flex flex-col items-center gap-8 md:gap-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Második esély az elektronikának
            </h1>

            <div className="w-40 sm:w-56 md:w-72 h-1.5 md:h-2 bg-teal-400 rounded-full my-4 md:my-6"></div>

            <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-100 max-w-4xl leading-relaxed">
              Online piactér elektronikai eszközök eladására, cseréjére és adományozására.
            </p>

            <p className="text-lg sm:text-xl md:text-2xl text-blue-100/90 max-w-4xl leading-relaxed">
              Környezetbarát és közösségközpontú platformot építünk, ahol az elektronikai eszközök nem hulladékká válnak, hanem új gazdánál kapnak második esélyt.
            </p>

            <div className="flex gap-4 flex-wrap justify-center mt-6">
              <button
                onClick={() => navigate("/products")}
                className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-full transition"
                type="button"
              >
                Termékek böngészése
              </button>

              <button
                onClick={() => navigate("/about")}
                className="border border-white/20 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-full transition"
                type="button"
              >
                Tudj meg többet
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-br from-[#0b1026] via-[#1b1f4b] to-[#3b1d5c] px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
            Legfrissebb hirdetések
          </h2>

          {products.length === 0 ? (
            <div className="bg-white/10 border border-white/10 rounded-3xl p-8 text-blue-100">
              Még nincs feltöltött hirdetés.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const isOwnProduct = product.seller_id === user?.userid;
                const isSold = product.status === "SOLD";
                const hasEnoughRecoin =
                  (user?.recoin_balance ?? 0) >= product.price_recoin;

                return (
                  <div
                    key={product.id}
                    className="card rounded-3xl bg-white/10 backdrop-blur-sm shadow-xl border border-white/10 overflow-hidden hover:scale-[1.02] transition p-2"
                  >
                    <figure className="flex items-center justify-center px-4 pt-4 pb-2 h-60"
                     style={{ userSelect: "none" }}
                     >
                      <img
                        src={`${API_BASE_URL}${product.image_url}`}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain rounded-2xl"
                      />
                    </figure>

                    <div className="card-body px-4 pb-4 pt-2 flex flex-col justify-between">
                      <h2 className="card-title text-white text-xl mb-2">
                        {product.title}
                      </h2>

                      <div className="flex flex-wrap gap-2 mt-2 text-sm min-h-[80px] content-start">
                        <span className="bg-white/10 px-3 py-1 rounded-full text-white/80">
                          {product.brand}
                        </span>

                        <span className="bg-white/10 px-3 py-1 rounded-full text-white/80">
                          {product.model}
                        </span>

                        <span className="bg-white/10 px-3 py-1 rounded-full text-white/80">
                          {product.condition}
                        </span>

                        <span className="bg-white/10 px-3 py-1 rounded-full text-white/80">
                          {product.category}
                        </span>

                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                          Ellenőrzött
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-3 gap-3">
                        <span className="font-bold text-white bg-teal-500/20 px-4 py-2 rounded-full"
                        style={{ userSelect: "none" }}
                        >
                          {product.price_recoin} Recoin
                        </span>

                        {isSold ? (
                          <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full font-semibold"
                          style={{ userSelect: "none" }}>
                            Elkelt
                          </div>
                        ) : isOwnProduct ? (
                          <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-full font-semibold"
                           style={{ userSelect: "none" }}
                           >
                            Saját hirdetés
                          </div>
                        ) : !isAuthenticated ? (
                          <button
                            onClick={() => navigate("/login")}
                            type="button"
                            className="bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded-full font-semibold transition"
                            style={{ userSelect: "none" }}
                          >
                            Megveszem
                          </button>
                        ) : !hasEnoughRecoin ? (
                          <div className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full font-semibold"
                           style={{ userSelect: "none" }}>
                            Nincs elég ReCoin
                          </div>
                        ) : (
                          <button
                            onClick={() => handleBuy(product)}
                            disabled={buyingId === product.id}
                            type="button"
                            className="bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-white px-4 py-2 rounded-full font-semibold transition"
                          >
                            {buyingId === product.id ? "Folyamatban..." : "Megveszem"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div className="bg-black/20 backdrop-blur-sm py-10 text-center text-blue-5aa00 border-t border-white/10">
        <p className="text-lg md:text-xl font-medium flex items-center justify-center gap-3">
          ♻️ • Kevesebb hulladék • Több esély • Környezetbarát megoldás ♻️
        </p>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#141b3a] p-6 shadow-2xl text-white">
            <h2 className="text-2xl font-bold mb-2">Szállítási cím megadása</h2>

            <p className="text-blue-100/80 mb-5">
              Add meg a szállítási címet a vásárláshoz.
            </p>

            <label className="block text-sm mb-2 text-blue-100">
              Szállítási cím (Telefonszám)
            </label>

            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows={4}
              className="w-full rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder:text-blue-100/50 outline-none"
              placeholder="Pl.: 1234 Budapest, Példa utca 12. 3/5 (+36 30 333 3333)"
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
                {buyingId === selectedProduct.id ? "Folyamatban..." : "Véglegesítés"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}