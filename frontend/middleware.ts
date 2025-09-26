import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
    return await auth0.middleware(request);
}

export const config = {
    matcher: [
        // Match all paths except:
        // - _next/static and _next/image
        // - favicon.ico
        // - robots.txt
        // - sitemap.xml and sitemap-*.xml
        // - api/auth (Auth0 callback/login/logout)
        // - the home page (/)
        // - about and optional subpaths (/about or /about/...)
        "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap\\.xml|sitemap-.*\\.xml|api/auth|about(?:/.*)?|$).*)",
 ],
};