import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/site/theme-provider';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { RouteTransition } from '@/components/site/route-transition';
import { NavigationEvents } from '@/components/site/navigation-events';
import { getMenu } from '@/lib/strapi';

export const metadata: Metadata = {
  title: { default: 'Tatrix360 — Tech, decoded.', template: '%s — Tatrix360' },
  description: 'Sharp reporting on AI, gadgets, and the platforms shaping our digital lives.',
  metadataBase: new URL('https://tatrix360.com'),
  openGraph: {
    title: 'Tatrix360',
    description: 'Tech, decoded.',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menu = await getMenu();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <NavigationEvents />
          <SiteHeader menu={menu} />
          <main className="flex-1">
            <RouteTransition>{children}</RouteTransition>
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
