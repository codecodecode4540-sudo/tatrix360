import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

export async function POST(req: Request) {
  let email: string;
  try { email = String((await req.json())?.email || '').trim().toLowerCase(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });

  try {
    const res = await fetch(`${STRAPI_URL}/api/newsletter-subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}) },
      body: JSON.stringify({ data: { email } }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('Strapi newsletter submit failed:', res.status, text);
      return NextResponse.json({ error: 'Could not subscribe' }, { status: 502 });
    }
  } catch (e) {
    console.error('Strapi unreachable:', e);
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
