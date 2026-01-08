/**
 * API utility functions for handling fetch responses and errors
 */

// Use relative path for API calls to avoid browser local network permission prompt
// In production, this will be proxied through Next.js server
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

/**
 * Validates if a fetch response is successful
 * @param response The fetch Response object
 * @throws Error if response is not ok
 */
export function checkResponse(response: Response): void {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
}

/**
 * Validates if a fetch response is successful (Icelandic error message)
 * @param response The fetch Response object
 * @throws Error if response is not ok (with Icelandic message)
 */
export function checkResponseIs(response: Response): void {
  if (!response.ok) {
    throw new Error(`Villa kom upp: ${response.status} ${response.statusText}`);
  }
}

/**
 * Fetches data and validates the response
 * @param url The URL to fetch from
 * @param options Fetch options
 * @returns The parsed JSON data
 * @throws Error if response is not ok
 */
export async function fetchAndCheck<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  checkResponse(response);
  return response.json();
}

/**
 * Fetches data and validates the response (Icelandic error messages)
 * @param url The URL to fetch from
 * @param options Fetch options
 * @returns The parsed JSON data
 * @throws Error if response is not ok (with Icelandic message)
 */
export async function fetchAndCheckIs<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  checkResponseIs(response);
  return response.json();
}

/**
 * Builds a full API URL from an endpoint path
 * @param endpoint The endpoint path (e.g., "/programs")
 * @param baseUrl Optional base URL (defaults to API_BASE)
 * @returns The complete URL
 */
export function buildApiUrl(endpoint: string, baseUrl: string = API_BASE): string {
  return new URL(endpoint, baseUrl).toString();
}

/**
 * Handles API errors by extracting useful error messages
 * @param error The error object
 * @param defaultMessage Default message if error cannot be parsed
 * @returns A user-friendly error message
 */
export function handleApiError(
  error: unknown,
  defaultMessage: string = "An unknown error occurred"
): string {
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}

/**
 * Handles API errors with Icelandic default message
 * @param error The error object
 * @param defaultMessage Default message if error cannot be parsed
 * @returns A user-friendly error message in Icelandic
 */
export function handleApiErrorIs(
  error: unknown,
  defaultMessage: string = "Óþekkt villa kom upp"
): string {
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}

/**
 * Creates a FormData object from a plain object
 * @param data The data to convert
 * @returns FormData object
 */
export function createFormData(data: Record<string, string | number | boolean | File | object | null | undefined>): FormData {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  return formData;
}

export { API_BASE };
