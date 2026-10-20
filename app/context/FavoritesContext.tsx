"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { usePathname } from "next/navigation";

import { useAuthContext } from "./AuthContext";
import { getFavorites, toggleFavorite } from "@/lib/favorites";
import { Property } from "@/app/types/property";

interface FavoritesContextType {
  favorites: string[];
  properties: Property[];
  loading: boolean;
  error: string | null;
  isFavorite: (propertyId: string) => boolean;
  toggle: (propertyId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);
export { FavoritesContext };

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuthContext();
  const pathname = usePathname();

  const [favorites, setFavorites] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------------------------------
     FETCH FAVORIS + PROPRIÉTÉS
  -------------------------------------------------------- */
  const refreshFavorites = useCallback(async () => {
    if (!user) return;
    if (pathname === "/login") return;
    if (authLoading) return;

    setLoading(true);

    try {
      const data = await getFavorites(String(user.id));

      queueMicrotask(() => {
        setFavorites(data.map((p) => String(p.id)));
        setProperties(data);
        setError(null);
      });
    } catch  {
      setError("Erreur lors du chargement des favoris");
    } finally {
      queueMicrotask(() => setLoading(false));
    }
  }, [user, authLoading, pathname]);

  /* -------------------------------------------------------
     AUTO-LOAD QUAND USER CHANGE
  -------------------------------------------------------- */
  useEffect(() => {
    if (!user) return;
    if (pathname === "/login") return;
    if (authLoading) return;

    refreshFavorites();
  }, [user, authLoading, refreshFavorites, pathname]);

  /* -------------------------------------------------------
     CHECK FAVORI
  -------------------------------------------------------- */
  const isFavorite = useCallback(
    (propertyId: string) => favorites.includes(propertyId),
    [favorites]
  );

  /* -------------------------------------------------------
     TOGGLE FAVORI
  -------------------------------------------------------- */
  const toggle = useCallback(
    async (propertyId: string) => {
      if (!user) return;

      const currentlyFavorite = favorites.includes(propertyId);

      // Optimistic UI
      setFavorites((prev) =>
        currentlyFavorite
          ? prev.filter((id) => id !== propertyId)
          : [...prev, propertyId]
      );

      try {
        await toggleFavorite(propertyId, currentlyFavorite);
        refreshFavorites();
      } catch {
        // rollback
        setFavorites((prev) =>
          currentlyFavorite
            ? [...prev, propertyId]
            : prev.filter((id) => id !== propertyId)
        );
        setError("Erreur lors de la mise à jour des favoris");
      }
    },
    [favorites, user, refreshFavorites]
  );

  const value = useMemo(
    () => ({
      favorites,
      properties,
      loading,
      error,
      isFavorite,
      toggle,
      refreshFavorites,
    }),
    [favorites, properties, loading, error, isFavorite, toggle, refreshFavorites]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavoritesContext must be used within FavoritesProvider");
  return ctx;
}