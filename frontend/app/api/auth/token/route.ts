import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";

/**
 * API route to get Auth0 access token for backend API calls
 * The token is obtained server-side from the session and returned to the client
 */
export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "No access token available" },
        { status: 401 }
      );
    }

    return NextResponse.json({ accessToken: session.accessToken });
  } catch (error) {
    console.error("Error getting access token:", error);
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 500 }
    );
  }
}

