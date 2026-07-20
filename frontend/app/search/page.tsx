'use client';

import { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
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
    <div className="container-page py-8">
      <h1 className="font-serif text-3xl font-bold">Search</h1>
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-input bg-background px-4 py-3">
        <SearchIcon className="h-5 w-5 text-muted-foreground" />
        <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles..." className="w-full bg-transparent text-lg outline-none placeholder:text-muted-foreground" />
      </div>

      {loading && <p className="mt-6 text-muted-foreground">Searching...</p>}
      {!loading && query && results.length === 0 && <p className="mt-6 text-muted-foreground">No results for &quot;{query}&quot;.</p>}
      {results.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  );
}
