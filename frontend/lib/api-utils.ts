/**
 * API utility functions for handling fetch responses and errors
 */

// Use relative path for API calls to avoid browser local network permission prompt
// In production, this will be proxied through Next.js server
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

/**
 * Validates if a fetch response is successful
 * @param response The fetch Response object
 * @throws Error if response is not ok
 */
export async function checkResponse(response: Response): Promise<void> {
  if (!response.ok) {
    // Try to get error details from response body
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;

    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        // FastAPI typically returns errors in a "detail" field
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string'
            ? errorData.detail
            : JSON.stringify(errorData.detail);
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = JSON.stringify(errorData);
        }
      }
    } catch (parseError) {
      // If we can't parse the error, use the default message
      console.error("Failed to parse error response:", parseError);
    }

    console.error("API Error Details:", {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      message: errorMessage
    });

    throw new Error(errorMessage);
  }
}

/**
 * Validates if a fetch response is successful (Icelandic error message)
 * @param response The fetch Response object
 * @throws Error if response is not ok (with Icelandic message)
 */
export async function checkResponseIs(response: Response): Promise<void> {
  if (!response.ok) {
    // Try to get error details from response body
    let errorMessage = `Villa kom upp: ${response.status} ${response.statusText}`;

    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        // FastAPI typically returns errors in a "detail" field
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string'
            ? `Villa: ${errorData.detail}`
            : `Villa: ${JSON.stringify(errorData.detail)}`;
        } else if (errorData.message) {
          errorMessage = `Villa: ${errorData.message}`;
        }
      }
    } catch (parseError) {
      console.error("Gat ekki lesið villuskilaboð:", parseError);
    }

    console.error("API Villa:", {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      message: errorMessage
    });

    throw new Error(errorMessage);
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
  await checkResponse(response);

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  // Check if response has JSON content
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  // Return empty object for non-JSON responses
  return {} as T;
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
  await checkResponseIs(response);

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  // Check if response has JSON content
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  // Return empty object for non-JSON responses
  return {} as T;
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