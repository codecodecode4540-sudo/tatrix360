import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-serif text-8xl font-bold text-primary/20">404</p>
      <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-glow"
      >
        <Home className="h-5 w-5" />Back to home
      </Link>
    </div>
  );
}
