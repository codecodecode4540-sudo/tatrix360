import { NewsletterBox } from '@/components/site/newsletter-box';

export const metadata = { title: 'Subscribe' };

export default function SubscribePage() {
  return (
    <div className="container-page max-w-2xl py-12">
      <h1 className="font-serif text-4xl font-bold">Subscribe</h1>
      <p className="mt-2 text-lg text-muted-foreground">Join thousands of readers getting the sharpest tech reporting in their inbox every week.</p>
      <div className="mt-8">
        <NewsletterBox />
      </div>
    </div>
  );
}
