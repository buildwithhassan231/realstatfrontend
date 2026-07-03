import { useAuth as useAuthContext } from "@/context/AuthContext";

/**
 * Convenience hook — wraps AuthContext.
 * Returns: user, token, isLoading, isAuthenticated, login, logout, register
 */
export function useAuth() {
  return useAuthContext();
}
