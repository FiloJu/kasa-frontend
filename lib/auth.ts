const API_URL = process.env.NEXT_PUBLIC_API_URL;
import type { AuthResponse, MeResponse } from "@/types/auth";

async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  if (!API_URL) {
    throw new Error("L’URL de l’API n’est pas configurée.");
  }

  try {
    return await fetch(`/auth/${path}`, {
      ...options,
      credentials: "include",
    });
  } catch {
    throw new Error(
      "Impossible de joindre le service d’authentification. Vérifiez que l’API est disponible."
    );
  }
}

async function getErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const error = await response.json();
    return error.message || error.error || fallback;
  } catch {
    return fallback;
  }
}

/**
 * Fetches the currently authenticated user using the HttpOnly session cookie.
 * A non-successful response is treated as an unauthenticated session and returns
 * `{ user: null }` instead of throwing.
 *
 * @async
 * @function getMe
 * @returns {Promise<MeResponse>} The current user data, or `null` when no valid session exists.
 */
export async function getMe(): Promise<MeResponse> {


  const res = await authFetch("me", {
    method: "GET",
  });



  if (!res.ok) {
   
    return { user: null }; // IMPORTANT : no exception thrown here, so the caller can handle unauthenticated sessions gracefully.
  }

  const data = await res.json();
 

  return data;
}

/**
 * Authenticates a user with an email address and password.
 * Includes credentials so the server can set the session cookie.
 *
 * @async
 * @function login
 * @param {string} email - Email address submitted for authentication.
 * @param {string} password - Password submitted for authentication.
 * @returns {Promise<AuthResponse>} The authentication response containing the user and token data.
 * @throws {Error} If the request fails; uses the server error message when available.
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await authFetch("login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, "Erreur de connexion"));
  }

  return res.json();
}

/**
 * Creates a new user account with the supplied name, email, and password.
 * Includes credentials so the server can set the session cookie.
 *
 * @async
 * @function register
 * @param {string} name - Name to associate with the new account.
 * @param {string} email - Email address for the new account.
 * @param {string} password - Password for the new account.
 * @returns {Promise<AuthResponse>} The registration response containing the user and token data.
 * @throws {Error} If registration fails; uses the server error message when available.
 */
export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await authFetch("register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, "Erreur lors de l'inscription"));
  }

  return res.json();
}

/**
 * Ends the current authenticated session by asking the server to clear its session cookie.
 *
 * @async
 * @function logoutRequest
 * @returns {Promise<void>}
 * @throws {Error} If the server does not accept the logout request.
 */
export async function logoutRequest(): Promise<void> {
  const res = await authFetch("logout", {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Erreur lors de la déconnexion");
  }
}