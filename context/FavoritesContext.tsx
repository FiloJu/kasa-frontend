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
import { Property } from "@/types/property";

/**
 * Context value type for favorites management.
 */
interface FavoritesContextType {
  favorites: string[];
  properties: Property[];
  loading: boolean;
  error: string | null;
  isFavorite: (propertyId: string) => boolean;
  toggle: (propertyId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

/** React context that exposes the current user's favorites and actions. */
const FavoritesContext = createContext<FavoritesContextType | null>(null);
export { FavoritesContext };

/**
 * FavoritesProvider component that manages the user's favorite properties.
 * Fetches favorites from the API and caches them in context.
 * Provides optimistic UI updates with rollback on error.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {React.ReactElement} Provider wrapping child components with favorites context.
 */
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuthContext();
  const pathname = usePathname();

  const [favorites, setFavorites] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* -------------------------------------------------------
     FETCH FAVORITES + PROPERTIES
     Retrieves the user's favorite properties from the API.
     Uses queueMicrotask to batch state updates.
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
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Erreur lors du chargement des favoris"
      );
    } finally {
      queueMicrotask(() => setLoading(false));
    }
  }, [user, authLoading, pathname]);

  /* -------------------------------------------------------
     AUTO-LOAD WHEN USER CHANGES
     Fetches favorites whenever the authenticated user changes.
     Clears favorites when user logs out.
  -------------------------------------------------------- */
  useEffect(() => {
    if (!user) {
      // Clear favorites when user logs out
      setFavorites([]);
      setProperties([]);
      setError(null);
      setLoading(false);
      return;
    }
    if (pathname === "/login") return;
    if (authLoading) return;

    queueMicrotask(() => {
      void refreshFavorites();
    });
  }, [user, authLoading, refreshFavorites, pathname]);

  /* -------------------------------------------------------
     CHECK FAVORITE STATUS
     Returns true if a property ID is in the favorites list.
  -------------------------------------------------------- */
  const isFavorite = useCallback(
    (propertyId: string) => favorites.includes(propertyId),
    [favorites]
  );

  /* -------------------------------------------------------
     TOGGLE FAVORITE
     Optimistically updates the UI immediately, then syncs with the API.
     Rolls back if the API call fails.
  -------------------------------------------------------- */
  const toggle = useCallback(
    async (propertyId: string) => {
      if (!user) return;

      const currentlyFavorite = favorites.includes(propertyId);

      // Optimistic update: immediately reflect the change in the UI
      setFavorites((prev) =>
        currentlyFavorite
          ? prev.filter((id) => id !== propertyId)
          : [...prev, propertyId]
      );

      try {
        await toggleFavorite(propertyId, currentlyFavorite);
        refreshFavorites();
      } catch {
        // Rollback on error: revert to the previous state
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

/**
 * Hook to access the favorites context.
 *
 * @returns {FavoritesContextType} The favorites context value.
 * @throws {Error} If used outside FavoritesProvider.
 */
export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavoritesContext must be used within FavoritesProvider");
  return ctx;
}