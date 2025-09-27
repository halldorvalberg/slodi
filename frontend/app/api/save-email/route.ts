import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const { email } = await req.json();

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ message: 'Invalid email format' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Define the file path
  const filePath = path.join(process.cwd(), 'public', 'emails.txt');

  try {
    // Append the email to the file
    await fs.appendFile(filePath, `${email}\n`);
    return new Response(JSON.stringify({ message: 'Email saved successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error saving email:', err);
    return new Response(JSON.stringify({ message: 'Failed to save email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const runtime = 'nodejs';