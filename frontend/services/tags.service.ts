/**
 * Tags API Service
 * Handles all API calls related to tags
 */

import { buildApiUrl, fetchAndCheck } from "@/lib/api-utils";

export type Tag = {
  id: string;
  name: string;
};

export type TagCreateInput = {
  name: string;
};

/**
 * Fetch all tags
 * @param query Optional search query to filter tags by name
 */
export async function fetchTags(query?: string): Promise<Tag[]> {
  const params = new URLSearchParams();
  if (query?.trim()) {
    params.append("q", query.trim());
  }
  
  const url = buildApiUrl(`/tags${params.toString() ? `?${params.toString()}` : ''}`);
  return fetchAndCheck<Tag[]>(url, {
    method: "GET",
    credentials: "include",
  });
}

/**
 * Create a new tag
 */
export async function createTag(input: TagCreateInput): Promise<Tag> {
  const url = buildApiUrl("/tags");
  return fetchAndCheck<Tag>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: input.name.trim() }),
    credentials: "include",
  });
}

/**
 * Get a single tag by ID
 */
export async function fetchTagById(id: string): Promise<Tag> {
  const url = buildApiUrl(`/tags/${id}`);
  return fetchAndCheck<Tag>(url, {
    method: "GET",
    credentials: "include",
  });
}

/**
 * Update a tag
 */
export async function updateTag(id: string, name: string): Promise<Tag> {
  const url = buildApiUrl(`/tags/${id}`);
  return fetchAndCheck<Tag>(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name.trim() }),
    credentials: "include",
  });
}

/**
 * Delete a tag
 */
export async function deleteTag(id: string): Promise<void> {
  const url = buildApiUrl(`/tags/${id}`);
  await fetchAndCheck(url, {
    method: "DELETE",
    credentials: "include",
  });
}

/**
 * Extract tag names from Tag objects
 */
export function extractTagNames(tags: Tag[]): string[] {
  return tags.map(tag => tag.name);
}
