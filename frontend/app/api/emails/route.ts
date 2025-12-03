import { NextRequest, NextResponse } from 'next/server';

// Allow a sensible default during local development/build so the route
// doesn't throw at build time when env vars aren't provided.
const API_BASE_URL = process.env.API_BASE_URL ?? 'http://127.0.0.1:8000';

if (!process.env.API_BASE_URL) {
    // Not fatal — warn so developers know they should set it for non-dev envs.
    // Using console.warn avoids failing the build while still surfacing the issue.
    console.warn('API_BASE_URL is not set; defaulting to http://127.0.0.1:8000');
}

function json(body: unknown, status = 200) {
    return NextResponse.json(body, { status });
}


function isValidEmail(value: unknown): value is string {
    if (typeof value !== "string") return false;
    if (value.length < 3 || value.length > 320) return false;

    // Simple but decent pattern, good enough for a signup form
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

export async function POST(request: NextRequest) {
    let body: unknown;
    try {
        // We expect the request body to be JSON with an "email" field
        body = await request.json();
    } catch {
        return json({ error: 'Invalid JSON body' }, 400);
    }

    const email = (body as { email?: unknown })?.email;
    if (!isValidEmail(email)) {
        return json({ message: "Invalid email format" }, 400);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/emaillist/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        let data: unknown = null;
        try {
            data = await response.json();
        }
        catch {
        // Ignore JSON parsing errors
        }

        if (!response.ok) {
            return json(
                { message: 'Failed to save email', details: data || response.statusText, status: response.status, upstream: data },
                response.status
            );
        }

        return json(
            data ?? { message: 'Email saved successfully' },
            201
        );
    } catch (error) {
        console.error('Error connecting to backend API:', error);
        return json(
            { message: 'Error connecting to backend API', details: (error as Error).message },
        );
    }
}

// the get function returns a list of all emails in the emaillist
export async function GET() {
    try {
        console.log("API URL: ", `${API_BASE_URL}/emaillist/`);
        const url = new URL("/emaillist", API_BASE_URL);

        const res = await fetch(url.toString());


        console.log('Received response from backend API with status', res.status);

        // If backend is up but returns error, propagate status + body as-is
        const data = await res.json();

        return NextResponse.json(data, {
            status: res.status,
        });
    } catch (err) {
        console.error("Error fetching email list:", err);
        return NextResponse.json(
            { message: "Failed to fetch email list" },
            { status: 500 },
        );
    }
}


// Run this route on the Node runtime
export const runtime = 'nodejs';
