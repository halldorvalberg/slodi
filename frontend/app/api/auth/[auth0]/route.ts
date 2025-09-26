import type { NextRequest } from "next/server";
import { auth0 } from "@/lib/auth0";

export function GET(request: NextRequest) {
  // Delegate all Auth0 actions (login, logout, callback, me) to the SDK
  return auth0.middleware(request);
}

export function POST(request: NextRequest) {
  return auth0.middleware(request);
}
