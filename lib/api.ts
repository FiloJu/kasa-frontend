const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
      headers.set("Authorization", `Bearer ${token}`);
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