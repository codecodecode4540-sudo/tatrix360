#!/usr/bin/env node
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const TOKEN = process.env.STRAPI_API_TOKEN;

if (!TOKEN) { console.error('Set STRAPI_API_TOKEN env var.'); process.exit(1); }

async function api(path, method, body) {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) { console.error(`${method} ${path} -> ${res.status}: ${text}`); return null; }
  return text ? JSON.parse(text) : null;
}

const categories = [
  { name: 'AI', slug: 'ai', description: 'Artificial intelligence, machine learning, and the models reshaping software.' },
  { name: 'Android & iOS', slug: 'android-ios', description: 'Mobile OS news, updates, and deep dives.' },
  { name: 'Gadgets', slug: 'gadgets', description: 'Hardware reviews and hands-on impressions.' },
  { name: 'Deals', slug: 'deals', description: 'The best tech deals, vetted.' },
  { name: 'How-To', slug: 'how-to', description: 'Practical guides and tutorials.' },
];
const authors = [
  { name: 'Jabid Ali', slug: 'jabid-ali', role: 'Editor-in-Chief', bio: "Jabid leads Tatrix360's editorial coverage of AI and consumer tech." },
  { name: 'Mira Chen', slug: 'mira-chen', role: 'Senior Writer', bio: 'Mira covers mobile platforms and the gadget beat.' },
  { name: 'Dev Patel', slug: 'dev-patel', role: 'Reviews Editor', bio: 'Dev tests the hardware so you don\'t have to.' },
];
const tags = [
  { name: 'OpenAI', slug: 'openai' }, { name: 'Google', slug: 'google' }, { name: 'Apple', slug: 'apple' },
  { name: 'Android', slug: 'android' }, { name: 'iOS', slug: 'ios' }, { name: 'Review', slug: 'review' },
];
const menu = [
  { label: 'AI', url: '/category/ai', order: 1 }, { label: 'Android & iOS', url: '/category/android-ios', order: 2 },
  { label: 'Gadgets', url: '/category/gadgets', order: 3 }, { label: 'Deals', url: '/category/deals', order: 4 },
  { label: 'How-To', url: '/category/how-to', order: 5 }, { label: 'About', url: '/about', order: 6 },
];
const posts = [
  { title: "OpenAI's new model explained: what's actually different", slug: 'openai-new-model-explained', subtitle: 'Faster, cheaper, and surprisingly good at reasoning.', categorySlug: 'ai', authorSlug: 'jabid-ali', tagSlugs: ['openai', 'google'], postType: 'News', featured: true, views: 1240, content: 'OpenAI dropped a new model this week...\n\n## Speed and cost\n\nThe new model is roughly 2x faster.' },
  { title: 'Android 16 stable rollout: which phones get it first', slug: 'android-16-stable-rollout', subtitle: "Google's latest is out.", categorySlug: 'android-ios', authorSlug: 'mira-chen', tagSlugs: ['google', 'android'], postType: 'News', featured: false, views: 890, content: 'Android 16 has reached stable channel.' },
  { title: 'iOS 19 beta 4 hands-on: the surprises worth waiting for', slug: 'ios-19-beta-4-hands-on', subtitle: 'The biggest visual refresh in years.', categorySlug: 'android-ios', authorSlug: 'mira-chen', tagSlugs: ['apple', 'ios'], postType: 'Review', featured: false, views: 1560, content: 'iOS 19 beta 4 landed this week.' },
  { title: 'The best budget wireless earbuds under $50', slug: 'best-budget-wireless-earbuds', subtitle: "You don't need to spend $200.", categorySlug: 'gadgets', authorSlug: 'dev-patel', tagSlugs: ['review'], postType: 'Guide', featured: false, views: 2100, content: 'Budget earbuds have gotten shockingly good.' },
  { title: 'How to automate your home without the cloud', slug: 'automate-home-without-cloud', subtitle: 'Local-first smart home setup.', categorySlug: 'how-to', authorSlug: 'dev-patel', tagSlugs: ['google'], postType: 'Guide', featured: false, views: 670, content: 'Cloud-dependent smart homes break.' },
  { title: 'Prime Day tech deals actually worth buying', slug: 'prime-day-tech-deals', subtitle: 'We sorted the real discounts.', categorySlug: 'deals', authorSlug: 'dev-patel', tagSlugs: ['google'], postType: 'News', featured: false, views: 3400, content: 'Prime Day is back.' },
  { title: "Google's Gemini 3 vs GPT-6: a developer's comparison", slug: 'gemini-3-vs-gpt-6', subtitle: 'Two frontier models, one practical test.', categorySlug: 'ai', authorSlug: 'jabid-ali', tagSlugs: ['openai', 'google'], postType: 'Review', featured: false, views: 1890, content: 'Both models are excellent.' },
  { title: 'Setting up a self-hosted password manager', slug: 'self-hosted-password-manager', subtitle: 'Vaultwarden on a $35 board.', categorySlug: 'how-to', authorSlug: 'dev-patel', tagSlugs: [], postType: 'Guide', featured: false, views: 450, content: 'Stop paying for a password manager.' },
];

async function main() {
  console.log('Seeding Tatrix360 Strapi backend...');
  for (const c of categories) { await api('/categories', 'POST', { data: c }); console.log(`  category: ${c.name}`); }
  for (const a of authors) { await api('/authors', 'POST', { data: a }); console.log(`  author: ${a.name}`); }
  for (const t of tags) { await api('/tags', 'POST', { data: t }); console.log(`  tag: ${t.name}`); }
  for (const m of menu) { await api('/menu-items', 'POST', { data: m }); console.log(`  menu: ${m.label}`); }

  const catRes = await api('/categories?pagination[pageSize]=100', 'GET');
  const authRes = await api('/authors?pagination[pageSize]=100', 'GET');
  const tagRes = await api('/tags?pagination[pageSize]=100', 'GET');
  const catMap = Object.fromEntries(catRes.data.map((c) => [c.slug, c.id]));
  const authMap = Object.fromEntries(authRes.data.map((a) => [a.slug, a.id]));
  const tagMap = Object.fromEntries(tagRes.data.map((t) => [t.slug, t.id]));

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    await api('/posts', 'POST', { data: {
      title: p.title, slug: p.slug, subtitle: p.subtitle, content: p.content, postType: p.postType,
      featured: p.featured, views: p.views, status: 'Published',
      publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
      category: catMap[p.categorySlug], author: authMap[p.authorSlug],
      tags: p.tagSlugs.map((s) => tagMap[s]).filter(Boolean),
      seoTitle: p.title, seoDescription: p.subtitle,
    }});
    console.log(`  post: ${p.title}`);
  }
  console.log('\nDone! 8 posts, 5 categories, 3 authors, 6 tags, 6 menu items seeded.');
}
main().catch((e) => { console.error(e); process.exit(1); });
