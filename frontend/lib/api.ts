import { getSession } from "next-auth/react";
import { BACKEND_URL } from "./config";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const session = await getSession();
  const token = (session as any)?.user?.token;

  const headers = new Headers(options.headers || {});
  
  // Apply authorization bearer header if user is logged in
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "API request failed");
  }

  return result;
}

export default apiFetch;
