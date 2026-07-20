import { Markdown } from './markdown';

export function ArticleBody({ content }: { content: string }) {
  return (
    <div className="prose-tatrix">
      <Markdown content={content} />
    </div>
  );
}
