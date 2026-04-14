import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import adminProfile from "../assets/admin-profile.jpg";

const API_BASE_URL = "";

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
    : null;

  const profileInitial =
    user?.username?.trim()?.charAt(0)?.toUpperCase() || "U";

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
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-teal-900 via-teal-700 to-teal-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-3"
              type="button"
            >
              <img
                src="/img/retech_logo.ico"
                alt="ReTech logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-white text-2xl font-bold">ReTech</span>
            </button>

            <div className="hidden md:flex items-center gap-8 text-white">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;

                return (
                  <button
                    key={link.path}
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
                );
              })}
            </div>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-300 flex items-center justify-center bg-teal-800 text-white font-bold"
                  type="button"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg">{profileInitial}</span>
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-teal-900 rounded-2xl shadow-2xl border border-teal-700 overflow-hidden">
                    <div className="px-4 py-4 border-b border-teal-700">
                      <p className="text-white font-bold">{user.username}</p>
                      <p className="text-teal-100 text-sm">{user.email}</p>
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
                          Admin újrahasznosítás
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

                        <div className="px-4 py-3 text-teal-100 border-t border-teal-700">
                          ReCoin pénztárca:{" "}
                          <span className="font-bold text-white">
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

          {isMobileMenuOpen && (
            <div className="md:hidden pb-4">
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

        <div
          className="h-1 bg-white/80 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </nav>

      <div className="h-20" />
    </>
  );
}