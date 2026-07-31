'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [displayPath, setDisplayPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== displayPath) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setDisplayPath(pathname);
        setIsLoading(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname, displayPath]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-x-0 top-16 z-[60] h-0.5 overflow-hidden">
          <div className="h-full w-full origin-left animate-loading-bar bg-gradient-to-r from-primary via-cyan-400 to-primary" />
        </div>
      )}
      <div key={displayPath} className="animate-in-fade">
        {children}
      </div>
    </>
  );
}
