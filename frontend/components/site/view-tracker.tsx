'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export function ViewTracker({ slug }: { slug: string }) {
  const recorded = useRef(false);
  useEffect(() => {
    if (recorded.current || !slug) return;
    recorded.current = true;
    supabase.from('post_views').insert({ slug }).then(({ error }) => {
      if (error) console.warn('view track failed', error.message);
    });
  }, [slug]);
  return null;
}
