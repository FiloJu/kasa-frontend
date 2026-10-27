import { apiFetch } from "@/lib/api";
import { Property } from "@/types/property";
import mockProperties from "@/data/mock-properties.json";

// Use mock favorites in production (Vercel) as fallback
const USE_MOCK_FAVORITES = process.env.NODE_ENV === "production";

/**
 * Fetches the favorite properties saved by a user.
 *
 * @async
 * @function getFavorites
 * @param {string} userId - Numeric identifier of the user whose favorites should be fetched.
 * @returns {Promise<Property[]>} The user's favorite properties, or an empty array for an invalid ID.
 */
export async function getFavorites(userId: string): Promise<Property[]> {
  // In production, use localStorage
  if (USE_MOCK_FAVORITES) {
    const favoriteIds = JSON.parse(localStorage.getItem(`favorites_${userId}`) || "[]");
    const allProps = mockProperties as Property[];
    return allProps.filter(p => favoriteIds.includes(p.id));
  }

  // Avoid making an API request when the user ID is missing or not numeric.
  if (!userId || userId === "null" || userId === "undefined" || isNaN(Number(userId))) {
    return [];
  }

  return apiFetch<Property[]>(`/api/users/${userId}/favorites`);
}

/**
 * Adds a property to or removes it from the user's favorites.
 *
 * @async
 * @function toggleFavorite
 * @param {string} propertyId - Identifier of the property to update.
 * @param {boolean} isFavorite - Whether the property is currently saved as a favorite.
 * @returns {Promise<{ success: boolean }>} The API result, or `false` when the property ID is missing.
 * @throws {Error} If the API request fails.
 */
export async function toggleFavorite(
  propertyId: string,
  isFavorite: boolean,
  userId?: string
): Promise<{ success: boolean }> {
  if (!propertyId) return { success: false };

  // In production, use localStorage
  if (USE_MOCK_FAVORITES && userId) {
    const favoriteIds = JSON.parse(localStorage.getItem(`favorites_${userId}`) || "[]");
    if (isFavorite) {
      // Remove
      const updated = favoriteIds.filter((id: string) => id !== propertyId);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(updated));
    } else {
      // Add
      if (!favoriteIds.includes(propertyId)) {
        favoriteIds.push(propertyId);
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(favoriteIds));
      }
    }
    return { success: true };
  }

  return apiFetch(`/api/properties/${propertyId}/favorite`, {
    method: isFavorite ? "DELETE" : "POST",
  });
}