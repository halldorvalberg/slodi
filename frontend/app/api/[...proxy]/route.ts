import { NextRequest, NextResponse } from 'next/server';

// Backend API URL - only used server-side, never exposed to browser
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * API Proxy Route
 * Proxies all /api/* requests to the backend server
 * This avoids browser local network permission prompts
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  return proxyRequest(request, params.proxy);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  return proxyRequest(request, params.proxy);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  return proxyRequest(request, params.proxy);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  return proxyRequest(request, params.proxy);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  return proxyRequest(request, params.proxy);
}

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
  try {
    // Build backend URL
    const path = pathSegments.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const backendUrl = `${BACKEND_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;

    // Get request body if present
    let body: string | undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.text();
    }

    // Forward headers (excluding host)
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'host') {
        headers.set(key, value);
      }
    });

    // Make request to backend
    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
    });

    // Get response body
    const responseBody = await response.text();

    // Forward response with headers
    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    );
  }
}
