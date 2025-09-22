import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Define the file path
    const filePath = path.join(process.cwd(), 'emails.txt');

    // Append the email to the file
    fs.appendFile(filePath, `${email}\n`, (err) => {
      if (err) {
        console.error('Error saving email:', err);
        return res.status(500).json({ message: 'Failed to save email' });
      }
      return res.status(200).json({ message: 'Email saved successfully' });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}