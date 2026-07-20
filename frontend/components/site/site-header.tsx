'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import type { MenuItem } from '@/lib/types';
import { ThemeToggle } from '@/components/site/theme-toggle';

export function SiteHeader({ menu }: { menu: MenuItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight">
          <span className="text-primary">Tatrix</span>360
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {menu.map((item) => (
            <Link key={item.id} href={item.url} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/search" className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background md:hidden">
          <div className="container-page flex flex-col py-2">
            {menu.map((item) => (
              <Link key={item.id} href={item.url} onClick={() => setOpen(false)} className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
