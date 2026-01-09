// API client utilities

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_RUL;

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

interface AuthFetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
}

export async function apiClient<T>(
  endpoint: string, 
  options: FetchOptions = {}
): Promise<T> {
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
    'Content-Type': 'application/json',
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
    apiClient<T>(endpoint, { method: 'GET', params }),
    
  post: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    
  patch: <T>(endpoint: string, body: unknown) =>
    apiClient<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
    
  delete: <T>(endpoint: string) =>
    apiClient<T>(endpoint, { method: 'DELETE' }),
};

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
      // Token expired or invalid - redirect to login
      window.location.href = "/auth/login";
      throw new Error("Authentication required");
    }
    throw new Error(`API error: ${response.statusText}`);
  }

  // For DELETE and other methods that may not return JSON
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  // Return empty object for responses without JSON
  return {} as T;
}
