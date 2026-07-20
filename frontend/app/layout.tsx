import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
// Suppress TS error about missing type declarations for CSS modules
// as declarations are provided inline above.
// @ts-ignore
import './globals.css';
import { ThemeProvider } from '@/components/site/theme-provider';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { getMenu } from '@/lib/strapi';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const merriweather = Merriweather({ subsets: ['latin'], variable: '--font-merriweather', weight: ['400', '700'] });

export const metadata: Metadata = {
  title: { default: 'Tatrix360 — Tech, decoded.', template: '%s — Tatrix360' },
  description: 'Sharp reporting on AI, gadgets, and the platforms shaping our digital lives.',
  metadataBase: new URL('https://tatrix360.com'),
  openGraph: { title: 'Tatrix360', description: 'Tech, decoded.', type: 'website' },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const menu = await getMenu();
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${merriweather.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SiteHeader menu={menu} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
