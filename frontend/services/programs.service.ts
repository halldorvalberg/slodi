/**
 * Program API Service
 * Handles all API calls related to programs
 */

import { buildApiUrl, fetchAndCheck, fetchAndCheckIs } from "@/lib/api-utils";

export type Program = {
  id: string;
  content_type: "program";
  name: string;
  description: string | null;
  public: boolean;
  like_count: number;
  created_at: string;
  author_id: string;
  image: string | null;
  workspace_id: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  workspace: {
    id: string;
    name: string;
  };
  tags?: string[];
  comment_count?: number;
};

export type ProgramCreateInput = {
  name: string;
  description?: string;
  public?: boolean;
  image?: string;
  imageFile?: File;
  tags?: string[];
  workspaceId?: string;
};

export type ProgramUpdateInput = {
  name?: string;
  description?: string;
  public?: boolean;
  image?: string;
  tags?: string[];
};

export type ProgramsResponse = Program[] | { programs: Program[] };

/**
 * Fetch all programs for a workspace
 */
export async function fetchPrograms(workspaceId: string): Promise<Program[]> {
  const url = buildApiUrl(`/workspaces/${workspaceId}/programs`);
  const data = await fetchAndCheck<ProgramsResponse>(url, {
    method: "GET",
    credentials: "include",
  });

  return Array.isArray(data) ? data : data.programs || [];
}

/**
 * Fetch a single program by ID
 */
export async function fetchProgramById(id: string): Promise<Program> {
  const url = buildApiUrl(`/programs/${id}`);
  return fetchAndCheck<Program>(url, {
    method: "GET",
    credentials: "include",
  });
}

/**
 * Create a new program
 */
export async function createProgram(
  input: ProgramCreateInput
): Promise<Program> {
  const formData = new FormData();
  
  formData.append("name", input.name.trim());
  if (input.description?.trim()) {
    formData.append("description", input.description.trim());
  }
  if (input.public !== undefined) {
    formData.append("public", String(input.public));
  }
  if (input.image?.trim()) {
    formData.append("image", input.image.trim());
  }
  if (input.imageFile) {
    formData.append("imageFile", input.imageFile);
  }
  if (input.tags && input.tags.length > 0) {
    formData.append("tags", JSON.stringify(input.tags));
  }

  const url = buildApiUrl(`/workspaces/${input.workspaceId || 'default'}/programs`);
  const data = await fetchAndCheckIs<Program | Program[]>(url, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  return Array.isArray(data) ? data[0] : data;
}

/**
 * Update an existing program
 */
export async function updateProgram(
  id: string,
  input: ProgramUpdateInput
): Promise<Program> {
  const url = buildApiUrl(`/programs/${id}`);
  return fetchAndCheckIs<Program>(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    credentials: "include",
  });
}

/**
 * Delete a program
 */
export async function deleteProgram(id: string): Promise<void> {
  const url = buildApiUrl(`/programs/${id}`);
  await fetchAndCheckIs(url, {
    method: "DELETE",
    credentials: "include",
  });
}

/**
 * Like or unlike a program
 */
export async function toggleProgramLike(
  programId: string,
  action: "like" | "unlike"
): Promise<{ liked: boolean; likeCount: number }> {
  const url = buildApiUrl(`/programs/${programId}/like`);
  return fetchAndCheck(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action }),
    credentials: "include",
  });
}

/**
 * Extract unique tags from programs list
 */
export function extractTags(programs: Program[]): string[] {
  return Array.from(new Set(programs.flatMap((p) => p.tags || [])));
}

/**
 * Filter programs by search query
 */
export function filterProgramsByQuery(
  programs: Program[],
  query: string
): Program[] {
  if (!query.trim()) return programs;
  
  const q = query.trim().toLowerCase();
  return programs.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q)
  );
}

/**
 * Filter programs by tags (OR logic - matches ANY selected tag)
 */
export function filterProgramsByTags(
  programs: Program[],
  selectedTags: string[]
): Program[] {
  if (selectedTags.length === 0) return programs;
  
  return programs.filter((p) => {
    const programTags = p.tags || [];
    return selectedTags.some((selectedTag) => programTags.includes(selectedTag));
  });
}

/**
 * Sort programs by specified criteria
 */
export function sortPrograms(
  programs: Program[],
  sortBy: "newest" | "oldest" | "most-liked" | "alphabetical"
): Program[] {
  const sorted = [...programs];
  
  switch (sortBy) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.created_at || 0).getTime() -
          new Date(b.created_at || 0).getTime()
      );
    case "most-liked":
      return sorted.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
    case "alphabetical":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "is"));
    default:
      return sorted;
  }
}
