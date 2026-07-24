import type { Metadata } from 'next';
import localFont from 'next/font/local';
// @ts-ignore: allow importing global CSS without type declarations
import './globals.css';
import { ThemeProvider } from '@/components/site/theme-provider';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { getMenu } from '@/lib/strapi';

const inter = localFont({
  src: [
    {
      path: './fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});

const merriweather = localFont({
  src: [
    {
      path: './fonts/Merriweather-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Merriweather-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-merriweather',
  display: 'swap',
});

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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${merriweather.variable}`}
    >
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