---
title: O desafio de usar a API oficial do Notion com NuxtJS v3
category: Programação
description: Como tentar utilizar a API oficial do Notion acabou gerando uma dor de cabeça extra por conta do NuxtJS v3 e como consegui contornar este problema.
language: pt-BR
created_at: 2022-10-15
tags:
  - notion
  - vue.js
  - nuxtjs
  - api
---

Este texto pretende ser uma continuação direta do meu [texto anterior](/post/utilizando-o-notion-como-um-cms) onde explico um pouco como reescrevi o código do site para utilizar o Notion como o CMS dos artigos.

Recapitulando um pouco, eu estava usando a API não oficial do Notion disponibilizada pela equipe da Splitbee. Originalmente ela foi criada quando a API oficial ainda estava fechada para testes e possui algumas limitações, como ser obrigatório que seus bancos de dados sejam públicos. Apesar de funcionar bem, sendo sincero, depois de um tempo eu fiquei um pouco receoso de utilizar e também percebi que por conta do *cache* configurado nela, novas alterações e páginas demoravam um pouco para aparecer lá, então aconteceu algumas vezes de eu precisar alterar alguma coisa e dar um *rebuild* no site e as alterações não estarem lá.

Muito bem, com essas limitações da API da Splitbee, resolvi me aventurar em utilizar a API oficial, apesar dos problemas mencionados anteriormente. Comecei seguindo o guia disponibilizado no site de desenvolvedores do Notion e criei uma integração, o que me gerou uma chave de acesso. Também ativei a integração nos bancos de dados e páginas que ela deveria ter acesso.

Fazer as chamadas a API em um ambiente Node.js se torna relativamente fácil já que existe um cliente oficial, o `@notionhq/client`, que já possui todas as tipagens em TypeScript, o que facilitou bastante o trabalho. Entretanto, consumir a estrutura de dados retornada se tornou um pouco trabalhoso.

## A tão temida recursividade

A versão atual da API não possui nenhum *endpoint* que retorna todos os blocos que uma página possui, já que é paginada e requer algumas chamadas para obter tudo o que você precisa. Não bastasse esse problema, o conceito de blocos do Notion permite que alguns tipos deles possam ter outros blocos dentro, e novamente, a API não retorna eles diretamente neste *endpoint*. Para cada bloco que possui "filhos", você precisa chamar outro *endpoint* individualmente.

Eu poderia ter abordado esta obtenção dos dados com um algoritmo recursivo, mas acabei optando por utilizar uma fila. A cada resposta da API eu percorro a lista de blocos retornados e os que tem filhos eu adiciono o `id` deles na fila. Enquanto a fila não está vazia, o ciclo se repete, fazendo mais chamadas a API e adicionando mais elementos na fila.

O *endpoint* de blocos retorna um vetor de objetos. Para facilitar um pouco o acesso a eles posteriormente, no final eu optei por transformar em uma tabela *hash* igual à API não oficial.

```ts
async function fetchBlocksFromPage(pageId: string) {
  // Obtém a primeira página de blocos da API.
  const firstPage = await notion.blocks.children.list({
    block_id: page.id
  })

  const blocks = firstPage.results as BlockWithContent[]
  let nextCursor = firstPage.next_cursor

  // Enquanto há uma próxima página, novas chamadas são feitas.
  while (nextCursor) {
    const result = await notion.blocks.children.list({
      block_id: page.id,
      start_cursor: next_cursor
    })

    // No fim todos os blocos no primeiro nível estarão em blocks.
    blocks.push(...(result.results as BlockWithContent[]))
    nextCursor = result.next_cursor
  }

  // Lista de blocos com filhos a serem visitados.
  const blocksWithChildren = [...blocks.entries()]
    .filter(([_, block]) => block.has_children)
    .map(([i, block]) => ({ i, id: block.id }))

  // Enquanto há blocos a serem visitados.
  while (blocksWithChildren.length > 0) {
    // Desenfileira o primeiro bloco da fila.
    const { i, id: current } = blocksWithChildren.shift()
    
    const result = await notion.blocks.children.list({
      block_id: current
    })

    const children = result.results as BlockWithContent[]
    
    const newBlocksToVisit = [...children.entries()]
      .filter(([_, block]) => block.has_children)
      .map(([i, block]) => ({ i: blocks.length + i, id: block.id }))

    blocksWithChildren.push(...newBlocksToVisit)
    blocks.push(...children)
    blocks[i].content = children.map((child) => child.id)
  }

  // Transforma a lista de blocos em uma "tabela hash".
  return Object.fromEntries(blocks.map((b) => [b.id, b]))
}
```

### Uma informação sobre as tipagens

Aqui vale a pena ressaltar sobre o tipo `BlockWithContent`. Por padrão, nas tipagens do `@notionhq/client`, os blocos do tipo `BlockObjectResponse` não possuem uma propriedade `content`, então eu criei um tipo novo baseado nele com esta nova propriedade.

```ts
export type BlockWithContent = BlockObjectResponse & { content?: string[] }
```

Outra observação importante talvez, mas nas versões atuais do cliente do Notion, por algum motivo os tipos não são exportados e não podem ser importados diretamente. Para poder acessá-las, precisei importar diretamente da pasta `build/src` do pacote. Provavelmente não é o método mais ideal, mas funciona enquanto eles não atualizarem o pacote para corrigir isso.

```ts
import type * as NotionApi from '@notionhq/client/build/src/api-endpoints'
```

Para facilitar o acesso nos demais pontos do código, também exportei para não ter que ficar fazendo a importação de dentro do pacote do cliente em vários lugares, até para centralizar tudo.

```ts
export * from '@notionhq/client/build/src/api-endpoints'
```

### A velocidade de resposta

Você já deve ter imaginado, mas a quantidade excessiva de chamadas a API do Notion obviamente iria ter algum efeito colateral. Dependendo do tamanho e complexidade da página que você está querendo obter os blocos, a API do site (disponível somente durante o *prerender* e em desenvolvimento local) demora um certo tempo. Artigos extensos como o  "Lendo mangás no Kindle" em alguns casos chegam a levar de 10 a 15 segundos para carregar.

Isto não é tanto um problema no meu caso já que o site é estático e a API só é chamada durante o *build* e *prerender*, mas para uma aplicação real com *Server Side Rendering*, isto poderia ser bastante problemático. O ideal neste outro caso seria configurar algum mecanismo de *cache*.

Além disso, muito provavelmente a API do Notion possui algum *rate limiting* configurado, mas não cheguei a esbarrar nele ainda. Pode ser um eventual problema futuro que terei que solucionar implementando um *rate limiting* localmente também.

## Consumindo os arquivos de mídia

Não vou me adentrar no tópico da renderização dos blocos, pois só precisei fazer algumas alterações no `NotionRenderer.vue`, já que a base já estava pronta. Entretanto, os blocos de imagem e vídeo acabaram se tornando uma dor de cabeça bem chata.

Para quaisquer arquivos hospedados no Notion, a API retorna uma URL com expiração de acesso de uma hora. Isso acaba se tornando um problema, pois se durante o *build* as URLs temporárias forem utilizadas, em pouquíssimo tempo elas ficarão indisponíveis e os usuários não poderão mais vê-las. A solução para isso seria extrair essas imagens no processo de *prerender* e copiá-las para a pasta `public`, assim elas farão parte do *build* do site.

O [Nuxt Image](https://v1.image.nuxtjs.org/) é um módulo oficial do NuxtJS que já se encarrega de fazer isso, porém este suporte a pré-renderização ainda não foi adicionado na `v1`, compatível com o NuxtJS v3. A solução então seria por enquanto eu criar meu próprio módulo local, responsável em alguma maneira de extrair as imagens dos artigos e copiá-las para a pasta `public`.

Eu demorei cerca de uns dois dias tentando diversas abordagens de como fazer isso, e sempre acaba esbarrando em alguma limitação do [Nitro](https://nitro.unjs.io/) ou do [h3](https://github.com/unjs/h3), pacotes que o NuxtJS usa por baixo dos panos para o servidor e para o *prerender*. Era frustrante sempre que eu parecia estar fazendo progresso, algo do NuxtJS ou dessas bibliotecas não tinha sido completamente implementado, como diversos *hooks* que estão documentados, mas não são chamados em nenhum lugar.

A solução que eu acabei encontrando foi disponibilizar um *event handler* customizado no módulo que força rotas da API no servidor a implementar também um método que devolve as imagens de uma dada resposta que devem ser salvas. Assim, a cada página que o Nitro visita durante o *prerender*, as imagens são extraídas e adicionadas numa fila global ao processo. Quando cada página é terminada de ser renderizada, as imagens são copiadas localmente. Nesta etapa eu inclusive aproveitei para utilizar o [Sharp](https://sharp.pixelplumbing.com/) e as convertê-las para `webp`.

```ts
export function addToQueue(result: ExtractorResult) {
  (global.mediaExtractorQueue as ExtractorResult[])?.push(result)
}

export function defineExtractorEventHandler<T = any>(args: ExtractorEventHandlerArgs<T>): EventHandler<T> {
  const { handler, extract } = args

  return defineEventHandler(async (event) => {
    const result = await handler(event)
    const extracted = await extract(result)

    // TODO: Check if is the prerender env.
    addToQueue(extracted)

    return result
  })
}
```

No lado do cliente, eu faço uma verificação do ambiente atual e transformo a URL do arquivo bloco. Em casos de desenvolvimento, exibo a imagem diretamente da URL temporária do Notion, mas em produção eu mapeio para a imagem copiada. Todas as imagens são salvas no formato `[id-do-bloco]-[data-de-modificação].webp`, então é fácil o cliente poder criar a URL correta já que ele tem tudo o que é preciso a partir das propriedades do bloco.

Como vantagem de ter criado este módulo próprio, também consegui copiar os vídeos, o que não seria possível se eu estivesse utilizando o Nuxt Image. Futuramente se precisar copiar outros arquivos que o Notion deixa serem hospedados, como PDFs, também será facilmente possível com menores alterações no código.

## Conclusões

Consumir a API oficial do Notion é relativamente simples se você deixar um pouco de lado a paginação e quantidade excessiva de chamadas necessárias. Os problemas que eu esbarrei foram por conta do ecossistema do NuxtJS v3 que, no momento, ainda se encontra em *release candidate*, então muitos dos módulos oficiais ainda não foram atualizados. Provavelmente se você é mais adepto a utilizar outros frameworks como o [Next.js](https://nextjs.org/), terá uma facilidade bem maior, pois ele te oferecerá um ecossistema mais estável.

Minha próxima aventura agora será tentar gerar as imagens do Open Graph automaticamente, similar a como o GitHub faz quando você compartilha um repositório no Twitter e uma imagem com o título, descrição e outras coisas é gerada automaticamente.

Te vejo numa próxima e obrigado por ler! ✌🏻
