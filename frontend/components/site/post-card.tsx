import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/types';
import { formatDate, formatViews } from '@/lib/utils';
import { Eye } from 'lucide-react';

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      <Link href={`/${post.category?.slug}/${post.slug}`} className="relative aspect-[16/9] overflow-hidden">
        {post.heroImage ? (
          <Image src={post.heroImage} alt={post.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
        {post.category && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{post.category.name}</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/${post.category?.slug}/${post.slug}`}>
          <h3 className="font-serif text-lg font-bold leading-snug group-hover:text-primary">{post.title}</h3>
        </Link>
        {post.subtitle && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.subtitle}</p>}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatDate(post.publishedAt)}</span>
          <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{formatViews(post.views)}</span>
        </div>
      </div>
    </article>
  );
}

export function CompactCard({ post }: { post: Post }) {
  return (
    <Link href={`/${post.category?.slug}/${post.slug}`} className="group flex items-center gap-3 py-3">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
        {post.heroImage ? (
          <Image src={post.heroImage} alt="" fill className="object-cover" sizes="64px" />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>
      <div className="min-w-0">
        <h4 className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-primary">{post.title}</h4>
        <p className="mt-1 text-xs text-muted-foreground">{formatViews(post.views)} views</p>
      </div>
    </Link>
  );
}
