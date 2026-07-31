'use client';

import { useState, useEffect } from 'react';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { PostCard } from '@/components/site/post-card';
import type { Post } from '@/lib/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="container-page py-8 sm:py-12">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Search</p>
      <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl">Find a story</h1>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-input bg-card px-5 py-4 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
        <SearchIcon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full bg-transparent text-lg outline-none placeholder:text-muted-foreground"
        />
        {loading && <Loader2 className="h-5 w-5 flex-shrink-0 animate-spin text-muted-foreground" />}
      </div>

      {!loading && query && results.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">No results for &quot;{query}&quot;.</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different search term.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}
