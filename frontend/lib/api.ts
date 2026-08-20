// API client utilities

const API_BASE_URL = process.env.API_BASE_URL;

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

interface AuthFetchOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query params
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean>) =>
    apiClient<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),

  patch: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) => apiClient<T>(endpoint, { method: "DELETE" }),
};

/**
 * An API failure that still knows its HTTP status.
 *
 * Callers used to have to pattern-match the message text to tell, say, an
 * undeployed route from a missing record — both arrive as "not found". Carrying
 * the status makes that a check rather than a guess. It extends Error, so any
 * existing `catch` that only reads `.message` is unaffected.
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Fetch with authentication
 * Automatically adds Authorization header with Bearer token
 */
export async function fetchWithAuth<T>(
  url: string,
  options: AuthFetchOptions = {},
  getToken: () => Promise<string | null>
): Promise<T> {
  const token = await getToken();

  if (!token) {
    throw new Error("No authentication token available");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) {
      const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/auth/login?returnTo=${returnTo}`;
      throw new Error("Authentication required");
    }

    // Try to get error details from response
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json().catch(() => ({}));
      // Pydantic 422 returns detail as an array of {loc, msg, type} objects
      if (Array.isArray(errorData.detail)) {
        const messages = errorData.detail
          .map((e: { loc?: string[]; msg?: string }) =>
            e.loc ? `${e.loc.slice(1).join(".")}: ${e.msg}` : e.msg
          )
          .join("; ");
        console.error(`[API ${response.status}]`, errorData.detail);
        throw new ApiError(messages || `API error: ${response.status}`, response.status);
      }
      const msg = errorData.detail || errorData.message || `API error: ${response.statusText}`;
      console.error(`[API ${response.status}]`, msg);
      throw new ApiError(msg, response.status);
    }

    throw new ApiError(`API error: ${response.statusText}`, response.status);
  }

  // Handle 204 No Content (common for DELETE requests)
  if (response.status === 204) {
    return undefined as T;
  }

  // Check if response has content
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    // Check if there's actually content to parse
    const text = await response.text();
    if (!text || text.trim() === "") {
      return undefined as T;
    }
    return JSON.parse(text) as T;
  }

  // Return undefined for non-JSON responses
  return undefined as T;
}
