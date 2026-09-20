import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchMe, logoutApi } from "../lib/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // CRITICAL: skip /auth/me when returning from OAuth — AuthCallback exchanges session_id first
    if (window.location.hash?.includes("session_id=")) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    try {
      await logoutApi();
    } catch {}
    localStorage.removeItem("pazooka_token");
    setUser(null);
    toast("SIGNED OUT");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, authModalOpen, setAuthModalOpen, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
