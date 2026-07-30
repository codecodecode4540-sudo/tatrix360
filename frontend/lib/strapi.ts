import type { Post, Category, Author, Tag, MenuItem } from '@/lib/types';
import { demoPosts, demoCategories, demoAuthors, demoTags, demoMenu } from '@/lib/demo-data';

const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://tatrix360.vercel.app";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

// Your Strapi content-type is "Article" -> REST endpoint is /api/articles (not /api/posts).
const ARTICLES_PATH = '/articles';

// Cache "is Strapi up" for a short window only — not forever — so one bad
// request doesn't lock the app into demo-data mode until the server restarts.
let strapiAvailable: boolean | null = null;
let strapiCheckedAt = 0;
const STRAPI_CHECK_TTL_MS = 10_000;

async function strapiFetch(path: string): Promise<any | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error(`[strapi] GET /api${path} -> ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`[strapi] fetch failed for /api${path}:`, err);
    return null;
  }
}

async function isStrapiUp(): Promise<boolean> {
  const now = Date.now();
  if (strapiAvailable !== null && now - strapiCheckedAt < STRAPI_CHECK_TTL_MS) {
    return strapiAvailable;
  }
  try {
    const res = await fetch(`${STRAPI_URL}/api${ARTICLES_PATH}?pagination[pageSize]=1`, {
      headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
      cache: 'no-store',
    });
    strapiAvailable = res.ok;
    if (!res.ok) {
      console.error(`[strapi] health check failed: ${STRAPI_URL}/api${ARTICLES_PATH} -> ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    strapiAvailable = false;
    console.error(`[strapi] health check could not reach ${STRAPI_URL}:`, err);
  }
  strapiCheckedAt = now;
  return strapiAvailable;
}

// --- Strapi "Blocks" rich text -> Markdown ---------------------------------
// Article.content comes back as Strapi's Blocks JSON (an array of nodes), e.g.:
// [{ type: "paragraph", children: [{ type: "text", text: "## Design" }] }, ...]
// ASSUMPTION: your frontend renders post.content as Markdown/plain text.
// If it instead expects raw Strapi Blocks (e.g. via @strapi/blocks-react-renderer),
// tell me and mapPost can pass p.content straight through instead.
function textNodeToMarkdown(node: any): string {
  let text = node.text ?? '';
  if (node.code) text = `\`${text}\``;
  if (node.bold) text = `**${text}**`;
  if (node.italic) text = `*${text}*`;
  if (node.strikethrough) text = `~~${text}~~`;
  return text;
}

function inlineChildrenToMarkdown(children: any[] = []): string {
  return children
    .map((child) =>
      child.type === 'link'
        ? `[${inlineChildrenToMarkdown(child.children ?? [])}](${child.url})`
        : textNodeToMarkdown(child)
    )
    .join('');
}

function blockToMarkdown(block: any): string {
  switch (block.type) {
    case 'heading':
      return `${'#'.repeat(block.level ?? 2)} ${inlineChildrenToMarkdown(block.children)}`;
    case 'quote':
      return `> ${inlineChildrenToMarkdown(block.children)}`;
    case 'code':
      return `\`\`\`\n${(block.children ?? []).map((c: any) => c.text ?? '').join('')}\n\`\`\``;
    case 'list':
      return (block.children ?? [])
        .map((item: any, i: number) =>
          `${block.format === 'ordered' ? `${i + 1}.` : '-'} ${inlineChildrenToMarkdown(item.children)}`
        )
        .join('\n');
    case 'paragraph':
    default:
      return inlineChildrenToMarkdown(block.children);
  }
}

function blocksToMarkdown(blocks: any): string {
  if (!blocks) return '';
  if (typeof blocks === 'string') return blocks;
  if (!Array.isArray(blocks)) return '';
  return blocks.map(blockToMarkdown).join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}
// ----------------------------------------------------------------------------

function mapPost(p: any): Post {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    subtitle: p.excerpt ?? p.subtitle ?? '',
    content: blocksToMarkdown(p.content),
    // category/author: not present on your Article schema yet (see note above) —
    // this stays undefined until you confirm the real field names.
    category: p.category ? mapCategory(p.category) : undefined,
    tags: p.tags ? p.tags.map(mapTag) : [],
    author: p.author ? mapAuthor(p.author) : undefined,
    heroImage: p.featuredImage?.url || p.heroImage?.url || undefined,
    postType: p.postType,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    featured: p.featured,
    publishedAt: p.publishedDate || p.publishedAt,
    // Article has no `status` field — Strapi's public API already excludes
    // drafts, so anything returned here is definitionally published.
    status: p.status ?? 'Published',
    views: p.views ?? 0,
  };
}
function mapCategory(c: any): Category { return { id: c.id, name: c.name, slug: c.slug, description: c.description }; }
function mapAuthor(a: any): Author { return { id: a.id, name: a.name, slug: a.slug, bio: a.bio, avatar: a.avatar?.url, role: a.role }; }
function mapTag(t: any): Tag { return { id: t.id, name: t.name, slug: t.slug }; }

export async function getPosts(opts: { featured?: boolean; pageSize?: number; categorySlug?: string } = {}): Promise<Post[]> {
  if (await isStrapiUp()) {
    const params = new URLSearchParams({
      populate: '*',
      'pagination[pageSize]': String(opts.pageSize ?? 10),
      'sort[0]': 'publishedAt:desc',
    });
    if (opts.featured) params.set('filters[featured][$eq]', 'true');
    if (opts.categorySlug) params.set('filters[category][slug][$eq]', opts.categorySlug);
    const data = await strapiFetch(`${ARTICLES_PATH}?${params.toString()}`);
    if (data?.data) return data.data.map(mapPost);
  }
  let posts = [...demoPosts].filter((p) => p.status === 'Published');
  if (opts.featured) posts = posts.filter((p) => p.featured);
  if (opts.categorySlug) posts = posts.filter((p) => p.category?.slug === opts.categorySlug);
  return posts.slice(0, opts.pageSize ?? 10);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (await isStrapiUp()) {
    const data = await strapiFetch(`${ARTICLES_PATH}?filters[slug][$eq]=${slug}&populate=*`);
    if (data?.data?.[0]) return mapPost(data.data[0]);
  }
  return demoPosts.find((p) => p.slug === slug) || null;
}

export async function getTrendingPosts(limit = 5): Promise<Post[]> {
  if (await isStrapiUp()) {
    const data = await strapiFetch(`${ARTICLES_PATH}?sort[0]=views:desc&pagination[pageSize]=${limit}&populate=*`);
    if (data?.data) return data.data.map(mapPost);
  }
  return [...demoPosts].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  if (await isStrapiUp()) { const data = await strapiFetch('/categories'); if (data?.data) return data.data.map(mapCategory); }
  return demoCategories;
}

export async function getAuthors(): Promise<Author[]> {
  if (await isStrapiUp()) { const data = await strapiFetch('/authors?populate=*'); if (data?.data) return data.data.map(mapAuthor); }
  return demoAuthors;
}

export async function getTags(): Promise<Tag[]> {
  if (await isStrapiUp()) { const data = await strapiFetch('/tags'); if (data?.data) return data.data.map(mapTag); }
  return demoTags;
}

export async function getMenu(): Promise<MenuItem[]> {
  // Nav links are hardcoded, not CMS-managed — no Strapi call needed.
  // Edit the actual links/labels/order in lib/demo-data.ts (the `demoMenu` array).
  return demoMenu;
}

export async function searchPosts(query: string): Promise<Post[]> {
  const q = query.toLowerCase();
  if (await isStrapiUp()) {
    const data = await strapiFetch(`${ARTICLES_PATH}?filters[title][$containsi]=${encodeURIComponent(q)}&populate=*`);
    if (data?.data) return data.data.map(mapPost);
  }
  return demoPosts.filter((p) => p.title.toLowerCase().includes(q) || p.subtitle?.toLowerCase().includes(q));
}