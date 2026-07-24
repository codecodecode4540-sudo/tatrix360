import Image from 'next/image';
import { getPosts, getTrendingPosts, getMenu, getCategories } from '@/lib/strapi';
import { PostCard, CompactCard } from '@/components/site/post-card';
import { NewsletterBox } from '@/components/site/newsletter-box';
import { AdSlot } from '@/components/site/ad-slot';

export const revalidate = 60;

export default async function HomePage() {
  const [featured, latest, trending, menu, categories] = await Promise.all([
    getPosts({ featured: true, pageSize: 1 }),
    getPosts({ pageSize: 6 }),
    getTrendingPosts(5),
    getMenu(),
    getCategories(),
  ]);

  const hero = featured[0] || latest[0];
  const rest = latest.filter((p) => p.id !== hero?.id).slice(0, 5);

  return (
    <div className="flex flex-col gap-12 py-8">
      {hero && (
        <section>
          <a
            href={`/${hero.category?.slug}/${hero.slug}`}
            className="group block overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl">
              {hero.heroImage ? (
                <Image
                  src={hero.heroImage}
                  alt={hero.title}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full bg-muted" />
              )}
            </div>

            <div className="mt-4 max-w-3xl">
              {hero.category && (
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                  {hero.category.name}
                </span>
              )}
              <h1 className="mt-2 font-serif text-3xl font-bold leading-tight group-hover:text-primary sm:text-4xl">
                {hero.title}
              </h1>
              {hero.subtitle && (
                <p className="mt-3 text-lg text-muted-foreground">{hero.subtitle}</p>
              )}
            </div>
          </a>
        </section>
      )}

      <div className="container-page grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-2xl font-bold">Latest</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-8">
          <div>
            <h2 className="font-serif text-xl font-bold">Trending</h2>
            <div className="mt-2 divide-y divide-border border-b border-border">
              {trending.map((post) => (
                <CompactCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          <AdSlot />
          <NewsletterBox variant="compact" />
        </aside>
      </div>

      <div className="container-page">
        <NewsletterBox />
      </div>
    </div>
  );
}