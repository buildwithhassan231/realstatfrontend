"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser, logoutUser, getMe } from "@/services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,            setUser]            = useState(null);
  const [token,           setToken]           = useState(null);
  const [isLoading,       setIsLoading]       = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  /* ── Hydrate on mount ────────────────────────────────────
     Strategy:
     1. Read token + cached user from localStorage immediately
        → Navbar renders correct state without any API call
     2. Then try to verify with backend (getMe)
        → If backend is up: refresh user data
        → If backend is down / 401: clear session
        → If network error (backend not running): keep cached data
  ── */
  useEffect(() => {
    async function hydrate() {
      const storedToken = localStorage.getItem("token");
      const storedUser  = localStorage.getItem("propfind_user");

      // No token — not logged in
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      // Immediately set from cache so Navbar renders correctly
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setToken(storedToken);
          setIsAuthenticated(true);
        } catch { /* bad JSON — ignore */ }
      }

      // Try to verify with backend
      try {
        const res = await getMe();
        // Support both { data: user } and { user } response shapes
        const freshUser = res.data || res.user || res;
        setUser(freshUser);
        setToken(storedToken);
        setIsAuthenticated(true);
        // Update cache with fresh data
        localStorage.setItem("propfind_user", JSON.stringify(freshUser));
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401) {
          // Token genuinely expired — clear everything
          localStorage.removeItem("token");
          localStorage.removeItem("propfind_user");
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
        // Any other error (network down, 500, etc.) — keep cached state
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  /* ── Login ── */
  const login = useCallback(async (credentials) => {
    const res = await loginUser(credentials);
    // Support both { token, data } and { token, user } response shapes
    const newToken = res.token;
    const userData = res.data || res.user;
    localStorage.setItem("token", newToken);
    localStorage.setItem("propfind_user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  }, []);

  /* ── Register ── */
  const register = useCallback(async (data) => {
    const res = await registerUser(data);
    const newToken = res.token;
    const userData = res.data || res.user;
    localStorage.setItem("token", newToken);
    localStorage.setItem("propfind_user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  }, []);

  /* ── Logout ── */
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Ignore — clear client state regardless
    }
    localStorage.removeItem("token");
    localStorage.removeItem("propfind_user");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
