import { authClient } from "./auth-client";

let cachedToken = null;
let cachedAt = 0;
const TOKEN_TTL_MS = 10 * 60 * 1000; // refresh well before the 15-min JWT expiry

export async function getAuthToken() {
  const now = Date.now();
  if (cachedToken && now - cachedAt < TOKEN_TTL_MS) {
    return cachedToken;
  }

  const { data, error } = await authClient.token();
  if (error || !data?.token) {
    cachedToken = null;
    return null;
  }

  cachedToken = data.token;
  cachedAt = now;
  return cachedToken;
}

export function clearAuthToken() {
  cachedToken = null;
  cachedAt = 0;
}
