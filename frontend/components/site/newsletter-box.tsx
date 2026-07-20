'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';

export function NewsletterBox({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (!res.ok) throw new Error();
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (variant === 'compact') {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <h3 className="font-serif text-base font-bold">Subscribe to the newsletter</h3>
        <p className="mt-1 text-sm text-muted-foreground">Get the best of Tatrix360 in your inbox weekly.</p>
        {status === 'success' ? (
          <p className="mt-3 flex items-center gap-2 text-sm font-medium text-primary"><CheckCircle2 className="h-4 w-4" />You&apos;re subscribed!</p>
        ) : (
          <form onSubmit={subscribe} className="mt-3 flex gap-2">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <button disabled={status === 'loading'} className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Join'}
            </button>
          </form>
        )}
        {status === 'error' && <p className="mt-2 text-sm text-destructive">Something went wrong. Try again.</p>}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-background p-8 text-center">
      <Mail className="mx-auto h-10 w-10 text-primary" />
      <h2 className="mt-4 font-serif text-2xl font-bold">Never miss a story</h2>
      <p className="mt-2 text-muted-foreground">Get the sharpest tech reporting delivered to your inbox every week. No spam, ever.</p>
      {status === 'success' ? (
        <p className="mt-6 flex items-center justify-center gap-2 text-lg font-medium text-primary"><CheckCircle2 className="h-5 w-5" />You&apos;re subscribed! Check your inbox.</p>
      ) : (
        <form onSubmit={subscribe} className="mx-auto mt-6 flex max-w-md gap-2">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 rounded-lg border border-input bg-background px-4 py-3" />
          <button disabled={status === 'loading'} className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Subscribe'}
          </button>
        </form>
      )}
      {status === 'error' && <p className="mt-3 text-sm text-destructive">Something went wrong. Please try again.</p>}
    </div>
  );
}
