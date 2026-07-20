import Link from 'next/link';

function inline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2]) {
      nodes.push(<strong key={`${keyPrefix}-${i}`}>{m[2]}</strong>);
    } else if (m[3]) {
      nodes.push(<em key={`${keyPrefix}-${i}`}>{m[3]}</em>);
    } else if (m[4] && m[5]) {
      const href = m[5];
      const isInternal = href.startsWith('/');
      nodes.push(
        isInternal ? (
          <Link key={`${keyPrefix}-${i}`} href={href} className="font-medium text-primary underline-offset-2 hover:underline">
            {m[4]}
          </Link>
        ) : (
          <a key={`${keyPrefix}-${i}`} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline-offset-2 hover:underline">
            {m[4]}
          </a>
        )
      );
    } else if (m[6]) {
      nodes.push(
        <code key={`${keyPrefix}-${i}`} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">
          {m[6]}
        </code>
      );
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push(<h2 key={key++}>{inline(line.slice(3), `h2-${key}`)}</h2>);
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push(<h3 key={key++}>{inline(line.slice(4), `h3-${key}`)}</h3>);
      i++;
      continue;
    }
    if (line.startsWith('> ')) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quote.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <blockquote key={key++}>{inline(quote.join(' '), `bq-${key}`)}</blockquote>
      );
      continue;
    }
    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++}>
          {items.map((it, idx) => (
            <li key={idx}>{inline(it, `ul-${key}-${idx}`)}</li>
          ))}
        </ul>
      );
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      blocks.push(
        <ol key={key++}>
          {items.map((it, idx) => (
            <li key={idx}>{inline(it, `ol-${key}-${idx}`)}</li>
          ))}
        </ol>
      );
      continue;
    }
    if (line.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const rows = tableLines
        .filter((l) => !/^\|[\s:-]+\|[\s:-]+\|?$/.test(l))
        .map((l) =>
          l
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim())
        );
      if (rows.length >= 2) {
        blocks.push(
          <div key={key++} className="my-5 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {rows[0].map((c, idx) => (
                    <th key={idx} className="border-b border-border px-3 py-2 text-left font-semibold">
                      {inline(c, `th-${key}-${idx}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((r, ri) => (
                  <tr key={ri} className="border-b border-border last:border-0">
                    {r.map((c, ci) => (
                      <td key={ci} className="px-3 py-2">
                        {inline(c, `td-${key}-${ri}-${ci}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('- ') &&
      !lines[i].startsWith('> ') &&
      !/^\d+\.\s/.test(lines[i]) &&
      !lines[i].startsWith('|')
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(<p key={key++}>{inline(para.join(' '), `p-${key}`)}</p>);
  }

  return <>{blocks}</>;
}
