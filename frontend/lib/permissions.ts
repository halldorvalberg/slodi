/**
 * Permission Utilities
 * Centralized permission checking logic for the application
 */

import type { User } from "@/services/users.service";
import type { Program } from "@/services/programs.service";

/**
 * Check if the current user is the owner of a program
 */
export function isOwner(user: User | null, program: Program): boolean {
  if (!user || !program) return false;
  return user.id === program.author_id;
}

/**
 * Check if the current user can edit a program
 * Currently same as isOwner, but could expand to include workspace admins
 */
export function canEditProgram(user: User | null, program: Program): boolean {
  return isOwner(user, program);
}

/**
 * Check if the current user can delete a program
 */
export function canDeleteProgram(user: User | null, program: Program): boolean {
  return isOwner(user, program);
}

/**
 * Check if the current user can view a program
 * Public programs can be viewed by anyone
 * Private programs only by owner and workspace members (TODO: workspace check)
 */
export function canViewProgram(
  user: User | null,
  program: Program
): boolean {
  // Public programs are viewable by anyone
  if (program.public) return true;

  // Private programs require authentication
  if (!user) return false;

  // Owner can always view
  if (isOwner(user, program)) return true;

  // TODO: Check if user is member of program's workspace
  // For now, allow authenticated users to view private programs
  return true;
}
