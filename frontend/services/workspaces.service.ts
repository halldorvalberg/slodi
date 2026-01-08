/**
 * Workspace API Service
 * Handles all API calls related to workspaces
 */

import { buildApiUrl } from "@/lib/api-utils";

export type Workspace = {
  id: string;
  name: string;
  default_meeting_weekday?: string;
  default_start_time?: string;
  default_end_time?: string;
  default_interval?: string;
  season_start?: string;
  settings?: Record<string, unknown> | null;
  group_id?: string | null;
};

export type WorkspaceCreateInput = {
  name: string;
  default_meeting_weekday?: string;
  default_start_time?: string;
  default_end_time?: string;
  default_interval?: string;
  season_start?: string;
  settings?: Record<string, unknown> | null;
  group_id?: string | null;
};

/**
 * Get all workspaces for a user
 */
export async function getUserWorkspaces(
  userId: string,
  token: string
): Promise<Workspace[]> {
  const url = buildApiUrl(`/users/${userId}/workspaces`);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to get workspaces: ${response.status} - ${errorBody}`);
  }

  return response.json();
}

/**
 * Create a workspace for a user
 */
export async function createUserWorkspace(
  userId: string,
  workspace: WorkspaceCreateInput,
  token: string
): Promise<Workspace> {
  const url = buildApiUrl(`/users/${userId}/workspaces`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(workspace),
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to create workspace: ${response.status} - ${errorBody}`);
  }

  return response.json();
}

/**
 * Get or create a user's personal workspace
 * Returns the first workspace with "Personal" in the name, or creates one
 */
export async function getOrCreatePersonalWorkspace(
  userId: string,
  token: string
): Promise<Workspace> {
  const workspaces = await getUserWorkspaces(userId, token);
  
  // Look for existing personal workspace
  const personalWorkspace = workspaces.find(
    (ws) => ws.name.toLowerCase().includes("personal") || ws.name.toLowerCase().includes("mitt")
  );

  if (personalWorkspace) {
    return personalWorkspace;
  }

  // Create new personal workspace
  return createUserWorkspace(
    userId,
    {
      name: "Mitt vinnusvæði",
    },
    token
  );
}
