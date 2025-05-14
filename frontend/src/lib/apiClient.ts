import { supabase } from "./supabaseClient";

/**
 * Makes a request to your backend with the Supabase access token in the Authorization header.
 * @param path API endpoint (e.g., /me/profile)
 * @param method HTTP method, default is GET
 * @param body Optional JSON body
 */
export async function fetchWithToken(
  path: string,
  method: string = "GET",
  body?: any
) {
  const renderBaseUrl = process.env.REACT_APP_RENDER_BASE_URL;
  if (!renderBaseUrl) {
    throw new Error("Missing Render environment REACT_APP_RENDER_BASE_URL");
  }

  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) throw new Error("Missing access token");

  const res = await fetch(
    `${renderBaseUrl}${path}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error.message || `Request failed with status ${res.status}`
    );
  }

  return res.json();
}
