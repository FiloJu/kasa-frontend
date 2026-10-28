"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import type { AuthUser } from "@/types/auth";
import { apiFetch } from "../lib/api";
import { login as apiLogin, register as apiRegister } from "@/lib/auth";

/**
 * Context value type for authentication operations.
 */
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  upgradeToOwner: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
export { AuthContext };

/**
 * AuthProvider component that manages user authentication state.
 * Stores authenticated user and token in localStorage for persistence.
 * Automatically restores user session on mount if localStorage contains valid data.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {React.ReactElement} Provider wrapping child components with auth context.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


    /* -------------------------------------------------------
      Load the current user from localStorage when an auth session exists.
      This allows users to remain logged in across page refreshes.
    -------------------------------------------------------- */
  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");

      if (!token || !storedUser) {
        setUser(null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        return;
      }

      setUser(JSON.parse(storedUser) as AuthUser);
    } catch {
      setUser(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    } finally {
      setLoading(false);
    }
  }, []);

/* -------------------------------------------------------
  Restore the signed-in user once when the provider mounts.
  Uses queueMicrotask to defer the refresh until after React renders.
-------------------------------------------------------- */
useEffect(() => {
  queueMicrotask(() => {
    void refreshUser();
  });
}, [refreshUser]);

    /* -------------------------------------------------------
      Sign in and store the authenticated user and token in localStorage.
      Token is needed for API requests; user data is needed for UI display.
    -------------------------------------------------------- */
  async function login(email: string, password: string) {
    setError(null);
    setLoading(true);

    try {
      const data = await apiLogin(email, password);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      setUser(data.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      setError("Erreur lors de la connexion");
      throw new Error("Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  }

    /* -------------------------------------------------------
      Register a new account and store the returned user and token in localStorage.
    -------------------------------------------------------- */
  async function register(name: string, email: string, password: string) {
    setError(null);
    setLoading(true);

    try {
      const data = await apiRegister(name, email, password);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      setUser(data.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      setError("Erreur lors de l'inscription");
      throw new Error("Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Upgrades the current user to an owner role.
   * Requires re-authenticating with password to verify identity.
   * Updates the user in context and localStorage on success.
   *
   * @async
   * @param {string} password - User's password for verification.
   * @throws {Error} If user is not authenticated or upgrade fails.
   */
  async function upgradeToOwner(password: string) {
    if (!user) throw new Error("Vous devez être connecté pour activer le profil hôte.");

    setError(null);
    setLoading(true);

    try {
      await apiFetch<AuthUser | { user: AuthUser }>(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "owner" }),
      });

      // Re-authenticate to get a new token with updated permissions
      const refreshedSession = await apiLogin(user.email, password);
      if (refreshedSession.user.role !== "owner" && refreshedSession.user.role !== "admin") {
        throw new Error("Le profil hôte n'a pas été activé. Contactez l'assistance.");
      }

      localStorage.setItem("auth_token", refreshedSession.token);
      localStorage.setItem("auth_user", JSON.stringify(refreshedSession.user));
      setUser(refreshedSession.user);
    } catch (err: unknown) {
      const message = err instanceof Error
        ? err.message
        : "Impossible d'activer le profil hôte.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

    /* -------------------------------------------------------
      Sign out, clear locally cached user data, and redirect to login.
      Removes auth token, user info, and any cached messaging/messaging data.
    -------------------------------------------------------- */
  async function logout() {
    setLoading(true);

    // Clear the local JWT session and cached messaging data.
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("messages");
    localStorage.removeItem("threads");

    if (user?.id) {
      localStorage.removeItem(`messages_${user.id}`);
      localStorage.removeItem(`threads_${user.id}`);
    }

    setUser(null);

    // Return the user to the login page after clearing local state.
    router.push("/login");

    queueMicrotask(() => setLoading(false));
  }

  /**
   * Clears the current error message.
   */
  function clearError() {
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        upgradeToOwner,
        logout,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access the authentication context.
 *
 * @returns {AuthContextType} The auth context value.
 * @throws {Error} If used outside AuthProvider.
 */
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}