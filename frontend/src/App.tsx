import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { useAuth } from "./components/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import CreateUser from "./components/CreateUser";
import Login from "./components/Login";
import AboutUs from "./components/AboutUs";
import MyAds from "./components/MyAds";
import Products from "./components/Products";
import AdminRecycles from "./components/AdminRecycles";
import MyRecycles from "./components/MyRecycles";
import Transactions from "./components/Transactions";
import AdminProducts from "./components/AdminProducts";



function AppRoutes() {
  const { user, isAuthReady } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0b1026] via-[#1b1f4b] to-[#3b1d5c] flex items-center justify-center text-white">
        Betöltés...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<CreateUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/my-ads" element={<MyAds />} />
          <Route path="/my-recycles" element={<MyRecycles />} />
          <Route path="/products" element={<Products />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route
            path="/admin/products"
            element={isAdmin ? <AdminProducts /> : <Navigate to="/" replace />}
          />
          <Route
            path="/admin/recycles"
            element={isAdmin ? <AdminRecycles /> : <Navigate to="/" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;