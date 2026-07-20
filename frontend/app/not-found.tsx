import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="font-display text-7xl font-extrabold text-primary/30">404</span>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you are looking for may have been moved, deleted, or never
        existed.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Home className="h-4 w-4" /> Back home
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:border-primary"
        >
          <Search className="h-4 w-4" /> Search
        </Link>
      </div>
    </div>
  );
}
