export const DEFAULT_WORKSPACE_ID = process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE_ID || "";
export const PROGRAMS_PER_PAGE = 12;

// Validation: warn if default workspace ID is not set
if (!DEFAULT_WORKSPACE_ID) {
	console.error("NEXT_PUBLIC_DEFAULT_WORKSPACE_ID is not configured");
}
