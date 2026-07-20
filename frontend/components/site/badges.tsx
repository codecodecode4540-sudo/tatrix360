import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Category } from '@/lib/types';

const CATEGORY_COLORS: Record<string, string> = {
  'android-ios': 'bg-green-500/10 text-green-600 dark:text-green-400 ring-green-500/20',
  ai: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/20',
  gadgets: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20',
  os: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-violet-500/20',
  guides: 'bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20',
};

export function CategoryBadge({
  category,
  className,
  withLink = true,
}: {
  category: Category;
  className?: string;
  withLink?: boolean;
}) {
  const color =
    CATEGORY_COLORS[category.slug] ||
    'bg-primary/10 text-primary ring-primary/20';
  const cls = cn(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset',
    color,
    className
  );
  if (!withLink) return <span className={cls}>{category.name}</span>;
  return (
    <Link href={`/category/${category.slug}`} className={cls}>
      {category.name}
    </Link>
  );
}

const POST_TYPE_STYLES: Record<string, string> = {
  News: 'bg-primary text-primary-foreground',
  Review: 'bg-amber-500 text-white',
  Guide: 'bg-emerald-500 text-white',
  Opinion: 'bg-violet-500 text-white',
};

export function PostTypeBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider',
        POST_TYPE_STYLES[type] || 'bg-secondary text-secondary-foreground'
      )}
    >
      {type}
    </span>
  );
}

export function TagPill({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/category/${slug}`}
      className="inline-flex items-center rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
    >
      #{name}
    </Link>
  );
}
