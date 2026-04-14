import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { User, AuthContextType } from "../types/types";
import { getMe } from "../service/service";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const loadCurrentUser = async (accessToken: string) => {
    try {
      const me = await getMe(accessToken);

      setUser({
        userid: me.id,
        username: me.username,
        email: me.email,
        profile_image: me.profile_image,
        role: me.role,
        recoin_balance: me.recoin_balance,
      });
    } catch (error) {
      console.error("Felhasználó betöltési hiba:", error);
      localStorage.removeItem("accessToken");
      setUser(null);
      setToken(null);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");

    const initAuth = async () => {
      if (storedToken) {
        try {
          jwtDecode(storedToken);
          setToken(storedToken);
          await loadCurrentUser(storedToken);
        } catch {
          localStorage.removeItem("accessToken");
        }
      }

      setIsAuthReady(true);
    };

    initAuth();
  }, []);

  const login = async (newToken: string) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
    await loadCurrentUser(newToken);
    setIsAuthReady(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setToken(null);
    setIsAuthReady(true);
  };

  const refreshUser = async () => {
    if (!token) return;
    await loadCurrentUser(token);
  };

  return (
    <AuthContext.Provider
      value={{user,token,login,logout,isAuthenticated: !!user,isAuthReady,refreshUser,}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("A useAuth paramétert az AuthProvider-en belül kell használni.");
  }

  return context;
};
