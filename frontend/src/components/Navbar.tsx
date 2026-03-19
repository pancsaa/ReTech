import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import adminProfile from "../assets/admin-profile.jpg";

const API_BASE_URL = "http://localhost:3000";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const isAdmin = user?.role === "ADMIN";

  const profileImage = isAdmin
    ? adminProfile
    : user?.profile_image
    ? `${API_BASE_URL}${user.profile_image}`
    : "https://via.placeholder.com/40?text=User";

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (documentHeight <= 0) {
        setScrollProgress(0);
        return;
      }

      const progress = (scrollTop / documentHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Főoldal", path: "/" },
    { name: "Termékek", path: "/products" },
    { name: "Rólunk", path: "/about" },
  ];

  return (
    <nav className="bg-gradient-to-r from-teal-800 to-teal-500 fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-3"
          type="button"
        >
          <img src="/img/retech_logo.ico" className="h-8" alt="ReTech logo" />
          <span className="text-2xl font-semibold text-white">ReTech</span>
        </button>

        <div className="flex items-center md:order-2 space-x-4">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-300"
                type="button"
              >
                <img
                  src={profileImage}
                  alt="profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/40?text=User";
                  }}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-teal-900 rounded-lg shadow-xl py-1 z-50 overflow-hidden">
                  <div className="px-4 py-2 border-b border-teal-700">
                    <p className="text-white font-medium">{user.username}</p>
                    <p className="text-teal-300 text-sm truncate">
                      {user.email}
                    </p>
                  </div>

                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => {
                          navigate("/admin/products");
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-white hover:bg-teal-800"
                        type="button"
                      >
                        Admin hirdetések
                      </button>

                      <button
                        onClick={() => {
                          navigate("/admin/recycles");
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-white hover:bg-teal-800"
                        type="button"
                      >
                        Admin recycle
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          navigate("/my-ads");
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-white hover:bg-teal-800"
                        type="button"
                      >
                        Hirdetéseim
                      </button>

                      <button
                        onClick={() => {
                          navigate("/my-recycles");
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-white hover:bg-teal-800"
                        type="button"
                      >
                        Újrahasznosítás
                      </button>

                      <button
                        onClick={() => {
                          navigate("/transactions");
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-white hover:bg-teal-800"
                        type="button"
                      >
                        Tranzakciók
                      </button>

                      <div className="px-4 py-3 border-t border-teal-700 text-sm text-teal-100">
                        ReCoin pénztárca:{" "}
                        <span className="font-semibold text-white">
                          {user?.recoin_balance ?? 0} ReCoin
                        </span>
                      </div>
                    </>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                      navigate("/");
                    }}
                    className="block w-full text-left px-4 py-2 text-red-300 hover:bg-teal-800 border-t border-teal-700"
                    type="button"
                  >
                    Kijelentkezés
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-white bg-teal-900 hover:bg-teal-800 rounded-full px-5 py-2"
              type="button"
            >
              Bejelentkezés
            </button>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
            type="button"
          >
            ☰
          </button>
        </div>

        <div className="hidden md:block">
          <ul className="flex space-x-8 text-white">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    type="button"
                    className={`transition ${
                      isActive
                        ? "font-bold text-teal-100 underline underline-offset-8"
                        : "hover:text-teal-100"
                    }`}
                  >
                    {link.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {isMobileMenuOpen && (
          <div className="w-full md:hidden mt-4 bg-teal-700/80 p-4 rounded-lg">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-white py-2 hover:bg-teal-600 rounded px-2"
                type="button"
              >
                {link.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full h-[4px] bg-white/10">
        <div
          className="h-full bg-white transition-[width] duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </nav>
  );
}