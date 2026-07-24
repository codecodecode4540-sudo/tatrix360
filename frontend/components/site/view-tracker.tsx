'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

type ViewTrackerProps = {
  slug?: string;
};

export function ViewTracker({ slug }: ViewTrackerProps) {
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current || !slug) return;
    recorded.current = true;

    const trackView = async () => {
      const { error } = await supabase.from('post_views').insert({ slug });

      if (error) {
        console.warn('view track failed', error.message);
      }
    };

    void trackView();
  }, [slug]);

  return null;
}