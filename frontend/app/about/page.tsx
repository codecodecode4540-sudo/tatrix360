import { NewsletterBox } from '@/components/site/newsletter-box';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="font-serif text-4xl font-bold">About Tatrix360</h1>
      <div className="prose-article mt-6">
        <p className="text-lg text-muted-foreground">Tatrix360 is an independent tech publication covering AI, mobile platforms, and the gadgets that shape our digital lives. We cut through the hype to tell you what actually matters.</p>
        <h2 className="mt-8 font-serif text-2xl font-bold">What we cover</h2>
        <p>AI models and their real-world impact. Mobile OS updates. Hardware reviews you can trust. And practical how-to guides that respect your time.</p>
        <h2 className="mt-8 font-serif text-2xl font-bold">Our promise</h2>
        <p>No press releases dressed up as news. No sponsored reviews disguised as opinion. Just clear, honest reporting.</p>
      </div>
      <div className="mt-12">
        <NewsletterBox />
      </div>
    </div>
  );
}
