// API client utilities

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
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
