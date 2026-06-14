---
title: Utilizando o Notion como um CMS
category: Programação
description: Uma breve análise de como consegui fazer do Notion a ferramenta que uso para escrever e editar os artigos e outras seções deste site estático.
language: pt-BR
created_at: 2022-10-11
tags:
  - notion
  - cms
  - nuxtjs
  - vue.js
  - site
---

Uma das coisas que pessoalmente me causava um pouco de cansaço quando eu utilizava o Jekyll como o gerador das duas versões anteriores do meu site era ter que lidar com todo o processo de publicação manualmente por *commits* e arquivos [Markdown](https://pt.wikipedia.org/wiki/Markdown) no repositório no GitHub.

Não me entenda mal, eu pessoalmente gosto muito da linguagem Markdown e da facilidade que ela proporciona para escrever e focar no conteúdo, mas ao longo do tempo neste projeto em específico eu fui sentindo falta de uma facilidade maior de visualizar o resultado e usar um editor [WYSIWYG](https://pt.wikipedia.org/wiki/WYSIWYG) (*What You See Is What You Get*). Tudo bem que existem ótimos programas para isso focados em Markdown, como o [Typora](https://typora.io/), mas nunca consegui me adaptar direito.

Um dia desses eu estava navegando no Twitter e me deparei com um *tweet* do [Adam Wathan](https://twitter.com/adamwathan), um dos criadores do [Tailwind CSS](https://tailwindcss.com), comentando sobre a tentativa dele de usar o Notion como o CMS do [site dele](https://adamwathan.me/), e que infelizmente ele não conseguiu seguir dado a algumas limitações e a forma com que a API oficial e pública do Notion é estruturada.

::tweet{author="Adam Wathan" subtitle="Criador do Tailwind CSS" picture="./posts/2022/2022-10-11-utilizando-o-notion-como-um-cms/adam-wathan.jpg"}
Brincando um pouco com usar o Notion como um CMS para o meu site pessoal para reduzir a burocracia de publicação. É bem divertido, mas toda a abstração em 'blocos' e as coisas de paginação fazem ser um trabalho enorme só para extrair um conteúdo básico escrito pela API.
::

Um dos principais problemas é não haver (até o momento) um *endpoint* que retorne todos os blocos de uma vez ou, ainda melhor, retorne toda a página como um Markdown direto que possa ser utilizado para gerar o HTML final da página no site. Eu também cheguei a cogitar utilizar a [API oficial do Notion](https://developers.notion.com/), mas esbarrei nos exatos mesmos problemas: também achei muito excessivo a quantidade de chamadas a API que eu deveria fazer para conseguir obter todos os blocos de uma determinada página.

::tweet{author="Adam Wathan" subtitle="Criador do Tailwind CSS" picture="./posts/2022/2022-10-11-utilizando-o-notion-como-um-cms/adam-wathan.jpg"}
Certo, estou desistindo disso, é muito a se preocupar com o número de chamadas a API, *rate limiting*, transformar a estrutura de dados complexa que recebo de volta etc. Ainda gosto do Notion como Notion porém.
::

Felizmente consegui contornar este problema.

## Uma alternativa a API oficial

Um certo tempo antes do pessoal do Notion disponibilizar a API pública, a equipe da [Splitbee](https://splitbee.io/) criou uma API que utiliza os conceitos de *serverless functions* e permite acessar os conteúdos de tabelas e páginas públicas, a [notion-api-worker](https://github.com/splitbee/notion-api-worker), que está disponível para uso gratuito.

A API da Splitbee é muito mais prática de ser consumida e não esbarra nos problemas de paginação e nem de quantidade de requisições, ela retorna todas as páginas de uma tabela de uma vez, assim como todos os blocos de uma página.

```json
[
  {
    "id": "e649eca2-7309-46fc-9ca2-c246f1108dec",
    "Tags": ["notion", "cms", "nuxtjs", "vue.js", "site"],
    "Area": "Programação",
    "Created at": "2022-10-11",
    "Description": "Uma breve análise de como consegui fazer do Notion a ferramenta que uso para escrever e editar os artigos e outras seções deste site estático.",
    "Slug": "utilizando-o-notion-como-um-cms",
    "Name": "Utilizando o Notion como um CMS"
  }
]
```

O retorno é exatamente igual às propriedades que você configura no seu banco de dados do Notion, incluindo os exatos mesmos nomes, usados como as chaves do objeto.

::large-figure
![Propriedades da minha tabela de posts.](./posts/2022/2022-10-11-utilizando-o-notion-como-um-cms/Untitled.png)

#caption
Propriedades da minha tabela de posts.
::

Certo, então com este *endpoint* é relativamente fácil criar uma página que consuma os resultados e crie uma lista com todos os posts marcados como públicos (utilizando a propriedade `Public` que eu criei na tabela). Esta parte eu consegui fazer rapidamente no site sem maiores problemas de fato. Em compensação, a parte de montar a página de cada post foi bem mais complicada.

## Montando as páginas a partir dos blocos

Se por um lado o retorno do *endpoint* de páginas da tabela foi bem fácil de ser consumido, o dos blocos de uma página se tornou um verdadeiro pesadelo inicialmente para mim. A resposta que a API do Splitbee retorna é um objeto que é uma espécie de `HashMap` que relaciona o UUID de cada bloco com seu conteúdo. Seria relativamente fácil de consumir, mas como há alguns tipos especiais de blocos que possuem outros blocos dentro, você acaba tendo que utilizar alguma abordagem recursiva, já que o `HashMap` no fim acaba se tornando uma [árvore](https://pt.wikipedia.org/wiki/%C3%81rvore_(estrutura_de_dados)).

```json
{
	"e649eca2-7309-46fc-9ca2-c246f1108dec": {
    "role": "reader",
    "value": {
      "id": "e649eca2-7309-46fc-9ca2-c246f1108dec",
      "version": 301,
      "type": "page",
      "properties": {},
      "content": [
        "87dada78-c288-4a57-8dd0-c1dd219bbbfd",
        "5238f6e5-7fdd-4e9c-8f33-0e9d095aa7c7",
        "4c34f0e6-9d84-4032-af4a-a60df04a44af",
        "a5fbddb1-a537-40b4-b991-837e3dc881bc",
        "025eed20-014b-4ed4-8d3c-c7013a05bfcc",
        "255b9a9b-b8dd-404f-82a1-7f6dfb14d0cc",
        "a9036174-b836-4a78-aa2b-65a2ac6b8a85",
        "04d9f5ae-4d69-4d2e-a5d9-240839a45d2a",
        "56044e6e-6885-4d20-90bc-1b6544cc935c",
        "2a5fe49d-a944-4c57-b3d8-a69876dfc5cd",
        "e60e0fae-7fe3-4106-ae76-b60d4502b32c",
        "ce9a602c-4a9c-4956-a2a3-32a94656382f",
        "7ecb5844-c15e-4df0-b318-77b1da7c4906",
        "f78130bb-271b-48d3-b36b-9671e8d18860"
      ],
      "created_time": 1665539280000,
      "last_edited_time": 1665541500000,
      "parent_id": "dcfb4c07-20c3-43b6-9c0c-ee5f13822d80",
      "parent_table": "collection",
    }
  },
}
```

Eu tentei evitar ao máximo ter que montar manualmente a página, com certeza alguém já deve ter feito isso antes e eu não precisaria reinventar a roda. De fato, já existe um componente para Vue.js chamado `vue-notion`, criado pelo [janniks](https://github.com/janniks), que inclusive já tem suporte para Nuxt JS e foi originalmente inspirado no `react-notion`, criado pela Splitbee.

Maravilha, então, é só utilizá-lo com algumas estilizações de CSS pelo Tailwind e eu teria acabado rapidamente o desenvolvimento das páginas, certo?

Infelizmente não 😢. O `vue-notion` ainda não é compatível com o Vue.js v3 e muito menos com o Nuxt JS 3, que trouxeram diversas modificações em suas APIs. Gostaria que fosse só esse o problema, mas ele também acaba utilizando o [Prism.js](https://prismjs.com/) para os blocos de código. Não que o Prism.js seja ruim, mas eu já fiquei um pouco cansado dele desde as outras versões do site e também queria testar algo novo, o [Shiki](https://shiki.matsu.io/), que utiliza o [vscode-oniguruma](https://github.com/microsoft/vscode-oniguruma) e o [vscode-textmate](https://github.com/Microsoft/vscode-textmate) por baixo dos panos.

Certo, então depois de muito resistir, acabei realmente criando a página manualmente, incorporando partes do código do `vue-notion` e adaptando-as para o meu gosto e para a nova [API de composição do Vue.js](https://vuejs.org/guide/extras/composition-api-faq.html). Isso acabou dando um certo trabalho e algumas dores de cabeça devido à recursividade e algumas má-estruturações da API do Notion também.

## A recursividade da montagem

Eu nunca tinha desenvolvido algum componente no Vue.js que utilizava recursividade, e muito menos sabia que você pode usar o mesmo componente dentro dele mesmo. Entender inicialmente o código do `NotionRenderer.vue`, o componente raiz que monta a página, foi complicado no começo justamente por conta disso.

```vue
<template>
  <NotionBlock v-bind="pass" v-if="blockMap && value">
    <NotionRenderer
      v-for="(contentId, contentIndex) in value.content"
      v-bind="pass"
      :key="contentId"
      :level="level + 1"
      :content-id="contentId"
      :content-index="contentIndex"
    />
  </NotionBlock>
</template>
```

Para entender o funcionamento, é necessário pensar como uma estrutura de árvore funciona. O que o componente faz é criar um bloco para si próprio, e para cada folha que este nó atual possui, é criado outra instância do `NotionRenderer.vue` dentro de seu corpo, usando como nó raiz desta vez o nó folha atual do *loop*, e assim suscetivamente para cada bloco, até que a árvore seja completamente consumida. Tenho que admitir, é um código bastante inteligente, mas que realmente é difícil de se compreender numa primeira análise.

Por sua vez, o componente `NotionBlock.vue` é o encarregado de renderizar cada tipo de bloco diferente, seja ele o bloco de parágrafo, o de cabeçalho, o de código e por aí vai.

```vue
<template>
  <div v-if="isType('page')">
    <BlockPage v-bind="pass">
      <slot />
    </BlockPage>
  </div>
  <BlockHeader
    v-else-if="isType(['header', 'sub_header', 'sub_sub_header'])"
    v-bind="pass"
	/>
  <BlockCallout v-else-if="isType('callout')" v-bind="pass" />
  <BlockCode v-else-if="isType('equation')" v-bind="pass" />
  <BlockText v-else-if="isType('text')" v-bind="pass" />
  <!-- E por aí vai, pra cada outro tipo de bloco existente. -->
</template>
```

Note que blocos que possuem outros blocos dentro de seu corpo, como o do tipo página ou lista, disponibilizam o `<slot />`, que será acessado por cada um de seus blocos interiores pela recursividade. Por conta disso, é bem fácil acabar esbarrando em problemas de recursão infinita durante o desenvolvimento, causando um pouco de estresse.

Cada componente de bloco individual possui um código específico para se adequar as necessidades de poder renderizá-lo. Deixo como exemplo o de parágrafo.

```vue
<template>
  <p v-if="properties" :class="['notion-text', blockColorClass()]">
    <BlockTextRenderer :text="title" v-bind="pass" />
  </p>
  <div v-else class="notion-blank">&nbsp;</div>
</template>
```

De maneira similar ao `NotionBlock.vue`, o `BlockTextRenderer.vue` também percorre cada item da propriedade `title` do bloco para gerar o texto final, adicionando as *tags* necessárias como `<strong>`, `<code>`, dentre outras.

## Um problema memorável

Não sei o porquê, mas o Notion não cria listas como um bloco com seus itens dentro.

```yaml
bloco-de-lista: 
  Tipo: Super bloco de lista
  Conteúdo: ['item-1', 'item-2', 'item-3']
item-1:
  Tipo: Bloco de lista
  Texto: Item 1
  Conteúdo: ['item-1-1']
item-1-1:
  Tipo: Bloco de lista
  Texto: Item 1.1
item-2:
  Tipo: Bloco de lista
  Texto: Item 2
item-3:
  Tipo: Bloco de lista
  Texto: Item 3
```

Ao invés disso, esta é a estrutura, sem o "super bloco":

```yaml
item-1:
  Tipo: Bloco de lista
  Texto: Item 1
  Conteúdo: ['item-1-1']
item-1-1:
  Tipo: Bloco de lista
  Texto: Item 1.1
item-2:
  Tipo: Bloco de lista
  Texto: Item 2
item-3:
  Tipo: Bloco de lista
	Texto: Item 3
```

Isso acaba gerando um problema semântico no HTML gerado, pois são criados vários `<ul>` com um item só dentro seguidos um dos outros ao invés de um `<ul>` só com todos os itens.

```html
<ul>
  <li>Item 1</li>
  <ul>
    <li>Item 1.1</li>
  </ul>
</ul>
<ul>
  <li>Item 2</li>
</ul>
<ul>
  <li>Item 3</li>
</ul>
```

A maneira que eu consegui contornar isso foi percorrer a árvore de blocos e encontrar nós do tipo lista que eram seguidos um dos outros e transformar o primeiro no "super bloco" e retirar os demais do bloco raiz do tipo página, passando a responsabilidade da renderização destes itens internos do tipo lista para o `BlockList.vue` 

```vue
<ul
  v-else-if="isTopLevel && type === 'bulleted_list_group'"
  class="notion-list notion-list-disc"
>
  <li><BlockTextRenderer :text="title" v-bind="pass" /></li>
  <BlockNestedList v-if="value.content" v-bind="pass">
    <slot />
  </BlockNestedList>
  <template v-for="childId in properties.content" :key="childId">
    <li>
      <BlockTextRenderer
        :text="blockMap[childId].value.properties.title"
        v-bind="pass"
      />
    </li>
    <ul v-if="blockMap[childId].value.content">
      <NotionRenderer
        v-for="(contentId, contentIndex) in blockMap[childId].value.content"
        v-bind="pass"
        :key="contentId"
        :level="level + 1"
        :content-id="contentId"
        :content-index="contentIndex"
      />
    </ul>
  </template>
</ul>
```

Após corrigir, o HTML gerado ficou semanticamente correto.

```html
<ul>
  <li>Item 1</li>
  <ul>
    <li>Item 1.1</li>
  </ul>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

## Limitação de linguagens no bloco de código

Outra limitação que encontrei é que o Notion não tem algumas linguagens de programação como opção em seu bloco de código. Ao contrário do Markdown onde você pode especificar manualmente uma nova opção, isso não é possível no Notion.

A solução que eu encontrei foi novamente percorrer a árvore de blocos atrás dos blocos de código e efetuar alguns testes usando [Expressões Regulares](https://pt.wikipedia.org/wiki/Express%C3%A3o_regular) para substituir o valor de `lang`. Por exemplo, para o HTML específico do Vue, eu busco por blocos que tenham `lang` como HTML ou JavaScript e testo a expressão `/v-if|v-for|v-bind/`. Se a expressão for encontrada, eu substituo `lang` por `vue-html`, assim o Shiki consegue fazer seu trabalho corretamente.

Isso abre portas para adicionar novas linguagens também, como a linguagem de *tags* de legendas Advanced Substation Alpha do [Aegisub](https://github.com/aegisub/aegisub), que utilizo em um dos meus artigos. Na verdade, é possível adicionar qualquer nova linguagem, existente ou não, já que o Shiki consegue ler arquivos JSON de gramática no formato TextMate, assim como o VSCode.

```ass
{\t($start, $end, \fscy150)}
```

## O que ainda está faltando

O renderizador de blocos do Notion está quase perfeito, mas ainda faltam alguns tipos de blocos e algumas outras questões a serem tratadas, como o acesso a mídias. O Notion permite com que imagens sejam acessadas diretamente, mas parece que há um tempo máximo para que a validade de acesso do link expire. O ideal seria armazenar estas mídias juntamente ao repositório durante a geração do HTML, mas ainda não consegui pensar numa maneira ideal para isso.

Eu acabei me animando tanto quanto ao resultado que até acabei convertendo a página de Sobre e de Projetos para usar o Notion também, me dando uma liberdade ainda maior para editar o conteúdo delas também sem precisar mexer com *commits* diretamente.

Após escrever ou editar páginas, eu ainda preciso dar um *trigger* manual na *action* que configurei no repositório no GitHub, mas acredito que consiga um dia automatizar isso também. Além disso, também preciso adicionar uma URL de *preview* para posts em rascunho.

De todo modo, eu espero que utilizar o Notion como o CMS do site me dê uma maior facilidade para poder escrever e me anime mais em relação a isso. Escrever inicialmente parece dar um trabalho enorme dependendo do assunto, mas sempre acaba me ajudando a distrair (temporariamente) de problemas maiores, então é uma coisa que acaba me ajudando.

O intuito desse artigo não era ser um tutorial nem nada do tipo, e sim apenas um breve relato, que talvez tenha até se estendido demais. Entretanto, se lhe foi útil de alguma maneira, fico feliz.

Até uma próxima ✌🏻

::callout
**Atualização:** Este texto foi escrito quando o site estava utilizando a API não oficial do Notion disponibilizada pela equipe da Splitbee. Apesar de no texto eu mencionar sobre as dificuldades que a API oficial impõe, eu resolvi me aventurar e começar a utilizá-la para não depender de deixar a tabela e as páginas públicas, me dando uma liberdade e privacidade maior para os rascunhos. Você pode ler um pouco mais sobre o processo de transição [neste outro artigo](/post/o-desafio-de-usar-a-api-oficial-do-notion-com-nuxtjs-v3) que eu escrevi.
::
