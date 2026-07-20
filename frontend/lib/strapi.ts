import type { Post, Category, Author, Tag, MenuItem } from '@/lib/types';
import { demoPosts, demoCategories, demoAuthors, demoTags, demoMenu } from '@/lib/demo-data';

const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

let strapiAvailable: boolean | null = null;

async function strapiFetch(path: string): Promise<any | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function isStrapiUp(): Promise<boolean> {
  if (strapiAvailable !== null) return strapiAvailable;
  try {
    const res = await fetch(`${STRAPI_URL}/api/posts?pagination[pageSize]=1`, {
      headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
      next: { revalidate: 30 },
    });
    strapiAvailable = res.ok;
  } catch {
    strapiAvailable = false;
  }
  return strapiAvailable;
}

function mapPost(p: any): Post {
  return {
    id: p.id, title: p.title, slug: p.slug, subtitle: p.subtitle ?? '', content: p.content ?? '',
    category: p.category ? mapCategory(p.category) : undefined,
    tags: p.tags ? p.tags.map(mapTag) : [],
    author: p.author ? mapAuthor(p.author) : undefined,
    heroImage: p.heroImage?.url || undefined, postType: p.postType,
    seoTitle: p.seoTitle, seoDescription: p.seoDescription,
    featured: p.featured, publishedAt: p.publishedAt, status: p.status, views: p.views ?? 0,
  };
}
function mapCategory(c: any): Category { return { id: c.id, name: c.name, slug: c.slug, description: c.description }; }
function mapAuthor(a: any): Author { return { id: a.id, name: a.name, slug: a.slug, bio: a.bio, avatar: a.avatar?.url, role: a.role }; }
function mapTag(t: any): Tag { return { id: t.id, name: t.name, slug: t.slug }; }

export async function getPosts(opts: { featured?: boolean; pageSize?: number; categorySlug?: string } = {}): Promise<Post[]> {
  if (await isStrapiUp()) {
    const params = new URLSearchParams({
      'populate[0]': 'heroImage', 'populate[1]': 'category', 'populate[2]': 'author',
      'populate[3]': 'author.avatar', 'populate[4]': 'tags',
      'pagination[pageSize]': String(opts.pageSize ?? 10),
      'filters[status][$eq]': 'Published', 'sort[0]': 'publishedAt:desc',
    });
    if (opts.featured) params.set('filters[featured][$eq]', 'true');
    if (opts.categorySlug) params.set('filters[category][slug][$eq]', opts.categorySlug);
    const data = await strapiFetch(`/posts?${params.toString()}`);
    if (data?.data) return data.data.map(mapPost);
  }
  let posts = [...demoPosts].filter((p) => p.status === 'Published');
  if (opts.featured) posts = posts.filter((p) => p.featured);
  if (opts.categorySlug) posts = posts.filter((p) => p.category?.slug === opts.categorySlug);
  return posts.slice(0, opts.pageSize ?? 10);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (await isStrapiUp()) {
    const data = await strapiFetch(`/posts?filters[slug][$eq]=${slug}&populate[0]=heroImage&populate[1]=category&populate[2]=author&populate[3]=author.avatar&populate[4]=tags&populate[5]=gallery`);
    if (data?.data?.[0]) return mapPost(data.data[0]);
  }
  return demoPosts.find((p) => p.slug === slug) || null;
}

export async function getTrendingPosts(limit = 5): Promise<Post[]> {
  if (await isStrapiUp()) {
    const data = await strapiFetch(`/posts?filters[status][$eq]=Published&sort[0]=views:desc&pagination[pageSize]=${limit}&populate[0]=heroImage&populate[1]=category&populate[2]=author`);
    if (data?.data) return data.data.map(mapPost);
  }
  return [...demoPosts].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  if (await isStrapiUp()) { const data = await strapiFetch('/categories'); if (data?.data) return data.data.map(mapCategory); }
  return demoCategories;
}

export async function getAuthors(): Promise<Author[]> {
  if (await isStrapiUp()) { const data = await strapiFetch('/authors?populate[0]=avatar'); if (data?.data) return data.data.map(mapAuthor); }
  return demoAuthors;
}

export async function getTags(): Promise<Tag[]> {
  if (await isStrapiUp()) { const data = await strapiFetch('/tags'); if (data?.data) return data.data.map(mapTag); }
  return demoTags;
}

export async function getMenu(): Promise<MenuItem[]> {
  if (await isStrapiUp()) {
    const data = await strapiFetch('/menu-items?sort[0]=order:asc');
    if (data?.data) return data.data.map((m: any) => ({ id: m.id, label: m.label, url: m.url, order: m.order }));
  }
  return demoMenu;
}

export async function searchPosts(query: string): Promise<Post[]> {
  const q = query.toLowerCase();
  if (await isStrapiUp()) {
    const data = await strapiFetch(`/posts?filters[title][$containsi]=${encodeURIComponent(q)}&filters[status][$eq]=Published&populate[0]=heroImage&populate[1]=category&populate[2]=author`);
    if (data?.data) return data.data.map(mapPost);
  }
  return demoPosts.filter((p) => p.title.toLowerCase().includes(q) || p.subtitle?.toLowerCase().includes(q));
}
