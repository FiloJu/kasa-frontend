"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import type { AuthUser } from "@/types/auth";
import {
  getMe,
  login as apiLogin,
  register as apiRegister,
  logoutRequest,
} from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
export { AuthContext };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


    /* -------------------------------------------------------
      Load the current user from /auth/me when an auth cookie is present.
    -------------------------------------------------------- */
  const refreshUser = useCallback(async () => {


  // Avoid the /auth/me request when the auth token cookie is absent.
 const hasAuthCookie = document.cookie.includes("auth-token=");
  if (!hasAuthCookie) {
  
    setUser(null);
    setLoading(false);
    return;
  }

  

  try {
    const data = await getMe();
 
    setUser(data.user);
  } catch {
   
    setUser(null);
  } finally {
  
    setLoading(false);
  }
}, []);

/* -------------------------------------------------------
  Restore the signed-in user once when the provider mounts.
-------------------------------------------------------- */
useEffect(() => {

  refreshUser();
}, [refreshUser]);

    /* -------------------------------------------------------
      Sign in and store the authenticated user in context.
    -------------------------------------------------------- */
  async function login(email: string, password: string) {
    setError(null);
    setLoading(true);

    try {
      const data = await apiLogin(email, password);
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
      Register a new account and store the returned user in context.
    -------------------------------------------------------- */
  async function register(name: string, email: string, password: string) {
    setError(null);
    setLoading(true);

    try {
      const data = await apiRegister(name, email, password);
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

    /* -------------------------------------------------------
      Sign out, clear locally cached user data, and redirect to login.
    -------------------------------------------------------- */
  async function logout() {
    setLoading(true);

    try {
      await logoutRequest();
    } catch {
      // Clear the local session even if the backend logout request fails.
    }

    // Remove shared cached authentication and messaging data.
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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}