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
import remarkStringify from 'remark-stringify';
import remarkToc from 'remark-toc';
import { unified } from 'unified';
import { matter } from 'vfile-matter';

const BASE_URL = 'https://alessandrojean.github.io/';

export async function markdownToHtml(fileName: string) {
  const filePath = join(process.cwd(), 'content', `${fileName}.md`);
  const markdown = await readFile(filePath, 'utf-8');

  const frontmatter = await parseFrontmatter(markdown);
  const language = frontmatter.language ?? 'pt-BR';

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
        'npm-mention': NpmMention,
        'note': Callout('note', language),
        'tip': Callout('tip', language),
        'warning': Callout('warning', language),
        'caution': Callout('caution', language),
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

async function parseFrontmatter(markdown: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkFrontmatter)
    .use(() => (_, file) => matter(file))
    .process(markdown);

  return file.data.matter as Record<string, string>;
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

type CalloutType = 'note' | 'tip' | 'warning' | 'caution';

const calloutTitle: Record<CalloutType, Record<string, string>> = {
  note: { 'pt-BR': 'Nota', 'en-US': 'Note' },
  tip: { 'pt-BR': 'Dica', 'en-US': 'Tip' },
  warning: { 'pt-BR': 'Atenção', 'en-US': 'Warning' },
  caution: { 'pt-BR': 'Cuidado', 'en-US': 'Caution' },
};

function Callout(tag: CalloutType, language: string): ComponentFunction {
  return (_, children) => h('div', [
    h('p', h('strong', `${calloutTitle[tag][language]}:`)),
    ...children,
  ]);
}

const GithubMention: ComponentFunction = (properties, _) => h(
  'a',
  { href: `https://github.com/${properties.repo}` },
  properties.repo as string,
);

const NpmMention: ComponentFunction = (properties, _) => h(
  'a',
  { href: `https://npmjs.com/package/${properties.pkg}` },
  properties.pkg as string,
);
