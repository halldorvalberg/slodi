import { NextRequest, NextResponse } from 'next/server';
import z4 from 'zod/v4';

const API_BASE_URL = process.env.API_BASE_URL;

if (!API_BASE_URL) {
    console.error('API_BASE_URL is not set. Check your environment configuration.');
    throw new Error('Missing API_BASE_URL');
}

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

const EmailBodySchema = z4.object({
    email: z4.email(),
});

function jsonResponse(body: unknown, status = 200) {
    return NextResponse.json(body, { status, headers: JSON_HEADERS });
}

export async function GET(req: NextRequest) {
    try {
        // You can inspect URL parameters if needed:
        // const searchParams = req.nextUrl.searchParams;
        // const limit = searchParams.get('limit');

        const res = await fetch(`${API_BASE_URL}/emails`, {
            method: 'GET',
            cache: 'no-store',
        });

        let data: unknown = null;
        try {
            data = await res.json();
        } catch {
            data = null;
        }

        if (!res.ok) {
            return jsonResponse(
                {
                    message: 'Failed to fetch emails from upstream API',
                    status: res.status,
                    upstream: data,
                },
                res.status,
            );
        }

        return jsonResponse(data, 200);
    } catch (error) {
        console.error('GET emails failed:', error);
        return jsonResponse({ message: 'Internal server error while fetching emails' }, 500);
    }
}

export async function POST(req: NextRequest) {
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return jsonResponse({ message: 'Invalid JSON payload' }, 400);
    }

    const parsed = await EmailBodySchema.safeParseAsync(body);
    if (!parsed.success) {
        return jsonResponse(
            {
                message: 'Invalid email payload',
                errors: parsed.error.flatten(),
            },
            400,
        );
    }

    const { email } = parsed.data;

    try {
        const res = await fetch(`${API_BASE_URL}/emails`, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ email }),
        });

        let data: unknown = null;
        try {
            data = await res.json();
        } catch {
            data = null;
        }

        if (!res.ok) {
            return jsonResponse(
                {
                    message: 'Failed to add email to upstream list',
                    status: res.status,
                    upstream: data,
                },
                res.status,
            );
        }

        return jsonResponse(data ?? { message: 'Email added successfully' }, 201);
    } catch (error) {
        console.error('POST emails failed:', error);
        return jsonResponse({ message: 'Internal server error while adding email' }, 500);
    }
}

// Run this route on the Node runtime
export const runtime = 'nodejs';
