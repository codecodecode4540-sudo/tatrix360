import type { Post } from '@/lib/types';

export async function getPostViews(slugs: string[]): Promise<Record<string, number>> {
  return {};
}

export async function applyViewCounts(posts: Post[]): Promise<Post[]> {
  return posts;
}