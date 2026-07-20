import { NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }

  const name = String(body?.name || '').trim();
  const email = String(body?.email || '').trim();
  const message = String(body?.message || '').trim();
  const company = String(body?.company || '').trim();

  if (company) return NextResponse.json({ ok: true });
  if (!name || !email || !message) return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  if (message.length > 5000) return NextResponse.json({ error: 'Message too long' }, { status: 400 });

  try {
    const res = await fetch(`${STRAPI_URL}/api/contact-submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}) },
      body: JSON.stringify({ data: { name, email, message } }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('Strapi contact submit failed:', res.status, text);
      return NextResponse.json({ error: 'Could not submit' }, { status: 502 });
    }
  } catch (e) {
    console.error('Strapi unreachable:', e);
    return NextResponse.json({ error: 'Backend unavailable' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
