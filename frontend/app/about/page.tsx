import { NewsletterBox } from '@/components/site/newsletter-box';
import { Zap, Shield, PenTool } from 'lucide-react';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">About</p>
      <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
        Tatrix360 is tech, decoded.
      </h1>
      <p className="mt-4 text-lg text-muted-foreground lg:text-pretty">
        We&apos;re an independent tech publication covering AI, mobile platforms, and the gadgets that shape our digital lives. We cut through the hype to tell you what actually matters.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: Zap, title: 'Fast & sharp', text: 'News and analysis that respects your time.' },
          { icon: Shield, title: 'Honest reviews', text: 'No sponsored reviews disguised as opinion.' },
          { icon: PenTool, title: 'Clear writing', text: 'Expert topics, explained for everyone.' },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="prose-article mt-12">
        <h2 className="font-serif text-2xl font-bold">What we cover</h2>
        <p className="text-lg text-muted-foreground">
          AI models and their real-world impact. Mobile OS updates. Hardware reviews you can trust. And practical how-to guides that respect your time.
        </p>
        <h2 className="mt-8 font-serif text-2xl font-bold">Our promise</h2>
        <p className="text-lg text-muted-foreground">
          No press releases dressed up as news. No sponsored reviews disguised as opinion. Just clear, honest reporting.
        </p>
      </div>

      <div className="mt-12">
        <NewsletterBox />
      </div>
    </div>
  );
}
