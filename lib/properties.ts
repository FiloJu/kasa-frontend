import { apiFetch } from "@/lib/api";
import { Property } from "@/types/property";

/**
 * Retrieves all properties available for viewing.
 *
 * @async
 * @function getProperties
 * @returns {Promise<Property[]>} Array of all properties.
 * @throws {Error} If the API request fails.
 */
export async function getProperties(): Promise<Property[]> {
  return apiFetch<Property[]>("/api/properties");
}

/**
 * Retrieves a specific property by its unique identifier.
 *
 * @async
 * @function getPropertyById
 * @param {string} id - The property's unique identifier.
 * @returns {Promise<Property>} The requested property object.
 * @throws {Error} If the property does not exist or the API request fails.
 */
export async function getPropertyById(id: string): Promise<Property> {
  return apiFetch<Property>(`/api/properties/${id}`);
}
