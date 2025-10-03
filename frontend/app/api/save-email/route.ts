import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  return new Response(JSON.stringify({ message: 'To be implemented' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const runtime = 'nodejs';