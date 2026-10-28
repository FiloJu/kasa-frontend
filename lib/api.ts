const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Generic API fetch wrapper that handles authorization and error handling.
 * Automatically adds the Bearer token from localStorage if available.
 * For server-side calls, uses the API_URL environment variable.
 *
 * @async
 * @template T - The expected response data type.
 * @function apiFetch
 * @param {string} endpoint - API endpoint path (e.g., '/api/properties').
 * @param {RequestInit} [options] - Optional fetch configuration (headers, method, body, etc.).
 * @returns {Promise<T>} Parsed JSON response of type T.
 * @throws {Error} If the request fails; includes status and parsed error message from API.
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL n'est pas défini");
  }

  const path = `/${endpoint.replace(/^\/+/, "")}`;
  const url = /^https?:\/\//i.test(endpoint)
    ? endpoint
    : typeof window !== "undefined"
      ? path
      : `${API_URL.replace(/\/+$/, "")}${path}`;
  const headers = new Headers(options?.headers);

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token && !headers.has("Authorization")) {
      const bearer = "Bearer ";
      headers.set("Authorization", bearer + token);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Erreur API ${response.status} sur ${endpoint}`;
    try {
      const error = await response.json();
      message = error.message || error.error || message;
    } catch {
      // Keep the status-based message when the response is not JSON.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
