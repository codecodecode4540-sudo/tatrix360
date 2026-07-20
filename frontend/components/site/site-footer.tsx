import Link from 'next/link';
import { Twitter, Github, Rss } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/30">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <div className="flex items-center gap-2 font-serif text-lg font-bold">
          <span className="text-primary">Tatrix</span>360
        </div>
        <p className="text-sm text-muted-foreground">Tech, decoded. &copy; {new Date().getFullYear()} Tatrix360.</p>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Link href="https://twitter.com" aria-label="Twitter" className="hover:text-foreground"><Twitter className="h-5 w-5" /></Link>
          <Link href="https://github.com" aria-label="GitHub" className="hover:text-foreground"><Github className="h-5 w-5" /></Link>
          <Link href="/rss.xml" aria-label="RSS" className="hover:text-foreground"><Rss className="h-5 w-5" /></Link>
        </div>
      </div>
    </footer>
  );
}
