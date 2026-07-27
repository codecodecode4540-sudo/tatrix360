import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts, getMenu } from '@/lib/strapi';
import { formatDate } from '@/lib/utils';
import { NewsletterBox } from '@/components/site/newsletter-box';
import { CompactCard } from '@/components/site/post-card';
import { Eye, Clock } from 'lucide-react';

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts({ pageSize: 50 });
  return posts.map((p) => ({
    category: p.category?.slug || 'uncategorized',
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.subtitle,
    openGraph: {
      title: post.title,
      description: post.subtitle,
      images: post.heroImage ? [{ url: post.heroImage }] : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const [post, menu, related] = await Promise.all([
    getPostBySlug(params.slug),
    getMenu(),
    getPosts({ pageSize: 4 }),
  ]);

  if (!post) notFound();

  const relatedPosts = related
    .filter(
      (p) =>
        p.slug !== post.slug &&
        p.category?.slug === post.category?.slug
    )
    .slice(0, 3);

  return (
    <article className="container-page py-6 sm:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: post.title,
            datePublished: post.publishedAt,
            author: post.author
              ? {
                  '@type': 'Person',
                  name: post.author.name,
                }
              : undefined,
            image: post.heroImage ? [post.heroImage] : undefined,
          }),
        }}
      />

      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>

        <span className="mx-2">/</span>

        <Link
          href={`/category/${post.category?.slug}`}
          className="hover:text-foreground"
        >
          {post.category?.name}
        </Link>
      </nav>

      {post.category && (
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">
          {post.category.name}
        </span>
      )}

      <h1 className="mt-2 font-serif text-3xl font-bold leading-tight sm:text-4xl">
        {post.title}
      </h1>

      {post.subtitle && (
        <p className="mt-3 text-lg text-muted-foreground">
          {post.subtitle}
        </p>
      )}

      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        {post.author && (
          <div className="flex items-center gap-2">
            {post.author.avatar && (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            )}

            <span className="font-medium text-foreground">
              {post.author.name}
            </span>
          </div>
        )}

        <span>{formatDate(post.publishedAt)}</span>

        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          5 min read
        </span>

        <span className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          {post.views ?? 0}
        </span>
      </div>

      {post.heroImage && (
        <div className="mt-6 overflow-hidden rounded-2xl">
          <Image
            src={post.heroImage}
            alt={post.title}
            width={1200}
            height={675}
            className="aspect-[16/9] w-full object-cover"
            priority
          />
        </div>
      )}

      {post.content && (
        <div className="prose-article mt-8 max-w-3xl text-lg leading-relaxed">
          {post.content.split('\n').map((line, i) => {
            if (line.startsWith('## '))
              return (
                <h2
                  key={i}
                  className="mt-8 font-serif text-2xl font-bold"
                >
                  {line.slice(3)}
                </h2>
              );

            if (line.startsWith('- '))
              return (
                <li key={i} className="ml-6 list-disc">
                  {line.slice(2)}
                </li>
              );

            if (line.trim() === '') return null;

            return (
              <p key={i} className="mt-4">
                {line}
              </p>
            );
          })}
        </div>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {relatedPosts.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="font-serif text-2xl font-bold">
            Related stories
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {relatedPosts.map((p) => (
              <CompactCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-12">
        <NewsletterBox />
      </div>
    </article>
  );
}