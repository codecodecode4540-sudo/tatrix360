import { supabase } from '@/lib/supabase';
import type { Post } from '@/lib/types';

export async function getPostViews(slugs: string[]): Promise<Record<string, number>> {
  if (!slugs.length) return {};
  const { data, error } = await supabase
    .from('post_views')
    .select('slug')
    .in('slug', slugs);
  if (error || !data) return {};
  const counts: Record<string, number> = {};
  for (const row of data) counts[row.slug] = (counts[row.slug] || 0) + 1;
  return counts;
}

export async function applyViewCounts(posts: Post[]): Promise<Post[]> {
  if (!posts.length) return posts;
  const counts = await getPostViews(posts.map((p) => p.slug));
  return posts.map((p) => ({ ...p, views: counts[p.slug] || p.views }));
}
