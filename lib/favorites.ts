const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { apiFetch } from "@/lib/api";
import { Property } from "@/app/types/property";

/**
 * Fetches the favorite properties saved by a user.
 *
 * @async
 * @function getFavorites
 * @param {string} userId - Numeric identifier of the user whose favorites should be fetched.
 * @returns {Promise<Property[]>} The user's favorite properties, or an empty array for an invalid ID.
 */
export async function getFavorites(userId: string): Promise<Property[]> {
  // Avoid making an API request when the user ID is missing or not numeric.
  if (!userId || userId === "null" || userId === "undefined" || isNaN(Number(userId))) {
    return [];
  }

  return apiFetch<Property[]>(`${API_URL}/api/users/${userId}/favorites`);
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
  isFavorite: boolean
): Promise<{ success: boolean }> {
  if (!propertyId) return { success: false };

  return apiFetch(`${API_URL}/api/properties/${propertyId}/favorite`, {
    method: isFavorite ? "DELETE" : "POST",
  });
}