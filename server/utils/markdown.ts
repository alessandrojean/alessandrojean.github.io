import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { h } from 'hastscript';
import type { ComponentFunction } from 'rehype-components';
import rehypeComponents from 'rehype-components';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkMdc from 'remark-mdc';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkSmartypants from 'remark-smartypants';
import remarkToc from 'remark-toc';
import { unified } from 'unified';

const BASE_URL = 'https://alessandrojean.github.io/';

export async function markdownToHtml(fileName: string) {
  const filePath = join(process.cwd(), 'content', `${fileName}.md`);
  const markdown = await readFile(filePath, 'utf-8');

  const result = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkGfm)
    .use(remarkMdc)
    .use(remarkToc, {
      heading: 'conteúdo',
      maxDepth: 2,
      ordered: true,
    })
    .use(remarkSmartypants)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeComponents, {
      components: {
        'social-media-post': SocialMediaPost,
        'large-figure': LargeFigure,
        'github-mention': GithubMention,
        'note': Callout('note'),
        'tip': Callout('tip'),
        'warning': Callout('warning'),
        'caution': Callout('caution'),
      },
    })
    .use(rehypeStringify)
    .process(markdown);

  const html = String(result)
    .replace(/src="\.\//g, `src="${BASE_URL}`)
    .replace(/src="\//g, `src="${BASE_URL}`)
    .replace(/href="\//g, `href="${BASE_URL}`);

  return html;
}

const SocialMediaPost: ComponentFunction = (properties, children) => h(
  'blockquote',
  { cite: properties.url },
  [
    ...children,
    h(
      'cite',
      properties.subtitle
        ? `— ${properties.author}, ${properties.subtitle}`
        : `— ${properties.author}`,
    ),
  ],
);

const LargeFigure: ComponentFunction = (_, children) => h(
  'figure',
  children[0]!.children[0],
  h('figcaption', children[1]!.children[0]!.children[0]),
);

const calloutTitle: Record<string, string> = {
  note: 'Nota',
  tip: 'Dica',
  warning: 'Atenção',
  caution: 'Cuidado',
};

function Callout(tag: string): ComponentFunction {
  return (_, children) => h('div', [
    h('p', h('strong', `${calloutTitle[tag]}:`)),
    ...children,
  ]);
}

const GithubMention: ComponentFunction = (properties, _) => h(
  'a',
  { href: `https://github.com/${properties.repo}` },
  properties.repo as string,
);
