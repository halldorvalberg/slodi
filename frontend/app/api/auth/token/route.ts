import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

/**
 * API route to get Auth0 access token for backend API calls
 * The token is obtained server-side from the session and returned to the client
 */
export async function GET() {
  try {
    // First check if user has a session
    const session = await auth0.getSession();

    if (!session) {
      return NextResponse.json(
        { error: "No active session - user not logged in" },
        { status: 401 }
      );
    }

    // Try to get access token using auth0 instance
    const { token } = await auth0.getAccessToken();

    if (!token) {
      console.error("Session exists but no access token available. This usually means:");
      console.error("1. AUTH0_AUDIENCE is not configured in .env.local");
      console.error("2. User needs to log out and log back in after configuring audience");
      console.error("3. Auth0 application is not authorized for the API");
      return NextResponse.json(
        { error: "No access token available - please log out and log back in" },
        { status: 401 }
      );
    }

    // Toggle this to enable/disable debug logging for token retrieval
    const DEBUG_TOKEN = false;

    if (DEBUG_TOKEN) {
      console.log("Token retrieved successfully");
      console.log("Token length:", token.length);
      console.log("Token starts with:", token.substring(0, 20) + "...");

      // Decode JWT to check contents (for debugging)
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
          console.log("Token payload:", {
            aud: payload.aud,
            iss: payload.iss,
            sub: payload.sub,
            exp: payload.exp,
            iat: payload.iat,
          });
        }
      } catch (e) {
        console.error("Failed to decode token:", e);
      }
    }

    return NextResponse.json({ accessToken: token });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to get access token";
    console.error("Error getting access token:", error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}