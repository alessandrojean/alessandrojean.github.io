---
title: Criando um feed RSS com Nuxt Content
category: Programação
description: Um passo-a-passo simples em como criar um feed e também disponibilizar o HTML dos posts.
language: pt-BR
created_at: 2026-06-17
updated_at: 2026-06-19T18:36:00
tags:
  - nuxt
  - nuxt content
  - remark
  - rehype
  - rss
alternate: generating-an-rss-feed-with-nuxt-content
---

Disponibilizar um feed RSS quando você está utilizando o Nuxt Content não é difícil, mas você pode acabar encontrando alguns obstáculos no caminho.

## Gerando o feed

Iremos começar criando a rota no servidor que irá disponibilizar o RSS. Normalmente é conveniente colocar o feed no mesmo caminho que seu conteúdo está. Por exemplo, se sua lista de posts fica em `/blog`, o caminho `/blog/feed.xml` é uma boa escolha.

Usando o Nuxt, podemos criar essa rota ao criar o arquivo `server/routes/blog/feed.xml.get.ts`. 

::caution
Esta não é uma rota de API, então não deve ser colocada em `/server/api`.
::

O esqueleto do arquivo é basicamente este:

```ts [feed.xml.get.ts]
import { queryCollection } from '@nuxt/content/server';

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, 'blog')
    .order('created_at', 'DESC')
    .limit(10)
    .all();

  return posts;
});
```

O que queremos fazer é manipular as postagens tal que a rota na verdade retorne um feed RSS válido. Podemos usar o pacote :npm-mention{pkg="rss"} para nos ajudar, já que ele contém um construtor de RSS que facilita as coisas.

Nós iremos usar a classe `RSS`.

```ts [feed.xml.get.ts]
import RSS from 'rss';
```

Para começar, precisamos criar o feed e colocar algumas informações básicas.

```ts [feed.xml.get.ts]
const url = 'https://exemplo.org';

const feed = new RSS({
  title: 'Blog de exemplo',
  description: 'Somente um blog.',
  site_url: url,
  feed_url: `${url}/blog/feed.xml`,
  language: 'pt-BR',
  custom_elements: [
    { icon: `${url}/img/apple-touch-icon.png` },
  ],
  custom_namespaces: {
    content: 'http://purl.org/rss/1.0/modules/content/',
    dc: 'http://purl.org/dc/elements/1.1/',
    sy: 'http://purl.org/rss/1.0/modules/syndication/',
  },
});
```

Algumas das propriedades são bem diretas. Outras são só complementos, como a `custom_namespaces`, que permite que o XML gerado tenha _tags_ extras que não estão na especificação do RSS.

Como nós temos uma lista de postagens, podemos iterar sobre ela e criar cada item do feed.

```ts [feed.xml.get.ts]
for (const post of posts) {
  feed.item({
    title: post.title,
    guid: `${url}/post/${post.path}`,
    url: `${url}/post/${post.path}`,
    description: post.description,
    date: new Date(post.created_at),
    categories: post.category ? [post.category] : undefined,
    custom_elements: [
      { 'dc:creator': { _cdata: 'Fulano de Tal' } },
    ],
  });
}
```

Agora que o feed está completo, podemos definir o cabeçalho `Content-Type`.

```ts [feed.xml.get.ts]
setResponseHeader(event, 'Content-Type', 'text/xml');
```

Então nós podemos finalmente retornar o feed XML.

```ts [feed.xml.get.ts]
return feed.xml();
```

Como exemplo, você pode dar uma olhada no [RSS deste site](/blog/feed.xml){target="_blank"}.

## Pré-renderizando

Se seu site usa um _deploy_ com um servidor, já está tudo certo. Mas, se usa um _deploy_ como site estático, como o GitHub Pages, você precisa de uma etapa adicional.

Precisamos informar ao Nuxt para também pré-renderizar esta rota do servidor durante o _build_. Isso pode ser feito editando a propriedade `nitro` no arquivo `nuxt.config.ts`.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/blog/feed.xml'],
    },
  },
});
```

## Informando leitores de RSS sobre o feed

Você pode por um _link_ para o feed RSS na sua página, mas isso só vai funcionar se o usuário copiar e colar manualmente no seu leitor de RSS. Você pode deixar as coisas um pouco mais fáceis ao usar uma _tag_ `<link rel="alternate">` no `<head>` do seu HTML.

Com isso, se o usuário colar o URL de seu blog no leitor RSS, ele poderá obter o _link_ do RSS automaticamente. No Nuxt, isso pode ser feito com o _composable_ `useHead`.

```ts [blog.vue]
useHead({
  link: [{ 
    rel: 'alternate', 
    type: 'application/rss+xml', 
    title: 'Feed (RSS)', 
    href: '/blog/feed.xml',
  }],
});
```

Isso não é obrigatório, mas é considerado uma boa prática.

## Disponibilizando o HTML da postagem

O feed atual irá funcionar corretamente para todos os usuários, mas nós estamos somente disponibilizando os _links_: não há conteúdo para as postagens. A maioria dos sites faz somente isso, mas acredito que é uma boa pedida também disponibilizar o conteúdo completo da postagem, assim o usuário pode ler em seu ambiente preferido.

Esta é a parte mais difícil de ser feita com Nuxt Content. No momento que escrevo este artigo, o Nuxt Content não parece ter um método que retorna sua postagem renderizada em HTML no contexto do servidor. Precisamos fazer isso **manualmente**.

O Nuxt Content usa o :npm-mention{pkg="@nuxtjs/mdc"} por baixo dos panos, que por sua vez usa os projetos :npm-mention{pkg="remark"} e o :npm-mention{pkg="rehype"} do ecossistema do Unified.

Se você der uma olhada na propriedade `post.body`, pode notar que é uma Árvore Sintática Abstrata (ASA) do Minimark. Poderíamos usar o pacote :npm-mention{pkg="minimark"} para obter a _string_ do Markdown, mas eu encontrei alguns problemas de conversão quando tentei. É mais fácil obter o código-fonte do arquivo Markdown diretamente.

Para deixar as coisas reutilizáveis, iremos criar uma função utilitária no servidor chamada `markdownToHtml`.

```ts [utils/markdown.ts]
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function markdownToHtml(fileName: string) {
  const filePath = join(process.cwd(), 'content', `${fileName}.md`);
  const markdown = await readFile(filePath, 'utf-8');
}
```

A parte difícil é criar o _pipeline_ da biblioteca Unified de tal modo que ele faça uma conversão similar a que o Nuxt Content faz. Podemos começar importando os _plugins_.

```ts [utils/markdown.ts]
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdc from 'remark-mdc';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
```

E então criando o _pipeline_.

```ts [utils/markdown.ts]
const result = await unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ['yaml'])
  .use(remarkGfm)
  .use(remarkMdc)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeStringify)
  .process(markdown);

return String(result);
```

Isso irá fazer o _parse_ do Markdown, criar uma ASA, que então irá ser convertida para HAST e processada até que seja reduzida a uma _string_ final com o HTML.

Para a maioria dos casos, isso irá funcionar, mas o MDC suporta componentes Vue, o que é um problema neste caso. A abordagem que eu escolhi foi converter os componentes que eu uso em componentes simples e equivalentes que usam apenas _tags_ já existentes do HTML.

Se você tem algum componente no seu Markdown, o _pipeline_ existente irá colocá-lo no HTML como se ele fosse um elemento personalizado. Por exemplo, o `Note.vue`, chamado por `::note` no Markdown, irá ser transformado em `<note></note>`, que não é um elemento existente do HTML.

Podemos contornar isso usando o _plugin_ :npm-mention{pkg="rehype-components"}. Também iremos precisar instalar o pacote :npm-mention{pkg="hastscript"}.

O que esse _plugin_ faz é converter elementos personalizados em outros que você especifica. Podemos colocar ele no _pipeline_ com o seguinte código.

```ts [utils/markdown.ts]
.use(rehypeComponents, {
  components: {
    'note': Note,
  },
})
```

E então criamos um componente `Note` para a substituição. Neste caso, o elemento `Note` é originalmente um _callout_. A abordagem que eu escolhi foi transformá-lo numa `<div>` com `<p><strong>Nota:</strong></p>` no seu primeiro filho.

O componente `Note` pode ser definido como:

```ts [utils/markdown.ts]
import { h } from 'hastscript';
import type { ComponentFunction } from 'rehype-components';

const Note: ComponentFunction = (_, children) => h('div', [
  h('p', h('strong', 'Nota:')),
  ...children,
]);
```

Neste exemplo, o seguinte bloco `Note` no Markdown

```mdc
::note
Esta é uma nota
::
```

Será transformada no seguinte HTML:

```html
<div>
  <p><strong>Nota:</strong></p>
  <p>Esta é uma nota</p>
</div>
```

Como você deve ter imaginado, você irá precisar fazer isso para cada componente Vue que você usa nos seus arquivos Markdown.

Com a função completada, podemos colocar o resultado em cada item do feed:

```ts [feed.xml.get.ts]
feed.item({
  title: post.title,
  guid: `${url}/post/${slug}`,
  url: `${url}/post/${slug}`,
  description: post.description,
  date: new Date(post.created_at),
  categories: post.category ? [post.category] : undefined,
  custom_elements: [
    { 'dc:creator': { _cdata: 'Fulano de Tal' } },
    { 'content:encoded': { _cdata: await markdownToHtml(post.path) } }, // [!CODE ++]
  ],
});
```

Agora o feed RSS está completo com o conteúdo de suas postagens também.

## Outra abordagem que eu considerei

Uma idéia alternativa que eu tive para resolver este problema foi usar um dos _hooks_ do Nuxt após o _build_. Você pode escrever um _script_ personalizado que faça o _parse_ do HTML gerado para `/blog` para pegar os _links_, e então fazer o _parse_ de cada arquivo de postagem gerado para extrair a parte do texto.

Isso vai funcionar, mas dependendo dos seus elementos personalizados, você pode acabar obtendo um HTML sujo quando comparado ao fazer o _parse_ do Markdown. Por exemplo, alguns dos blocos `<pre>` que eu uso aqui são customizados para incluir uma janela bonitinha ao redor com o nome do arquivo e também um botão para copiar o código. Se você não tratar esses casos, os leitores RSS podem não renderizar o conteúdo de uma maneira correta.

## Conclusão

Seria legal se a equipe do Nuxt disponibilizasse uma maneira mais fácil de fazer isso, já que feeds RSS ainda são bem úteis e usados por algumas pessoas. Talvez com uma reescrita do módulo para usar Comark eles acabem implementando? Quem sabe.
