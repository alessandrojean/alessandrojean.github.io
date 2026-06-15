---
title: Gerando imagens do Open Graph automaticamente com o Satori
category: Programação
description: Uma breve introdução a mais nova biblioteca da Vercel que permite a criação de imagens a partir de um componente React.
language: pt-BR
created_at: 2022-10-17
tags:
  - react
  - satori
  - open graph
  - svg
---

::note
Este artigo foi escrito quando o NuxtJS v3 ainda estava no estado de *release candidate*, fazendo com que muitas etapas do processo tivessem de ser feitas de modo manual, como depender de um módulo customizado.

Atualmente, há um módulo de terceiros criado justamente para este intuito, o [nuxt-og-image](https://github.com/harlan-zw/nuxt-og-image), que também usa o Satori e torna o processo muito mais simples e evita complicações desnecessárias, tais como escrever o *template* como um componente React dentro de um projeto Vue.js. Recomendo atualmente usar este módulo.
::

Compartilhamento em redes sociais são uma parte importante de todo acesso que os sites possuem, e disponibilizar uma imagem como parte dos atributos do Open Graph acaba se tornando cada vez mais primordial.

Pensando em facilitar o processo de geração destas imagens com base em algum conteúdo fixo, a Vercel acabou disponibilizando recentemente o [Satori](https://github.com/vercel/satori), uma biblioteca que permite a criação de arquivos SVG a partir de um componente React.

Apesar de ser mais ligado ao ecossistema do Next.js e, por consequência, ao React, você pode utilizá-lo em qualquer projeto, seja por usar o JSX ou TSX, ou utilizar a sintaxe de objetos do React.

::large-figure
![Um exemplo criado no Vercel OG Image Playground](./posts/2022/2022-10-17-gerando-imagens-do-open-graph-automaticamente-com-o-satori/fea56e91-350e-4495-8a69-21bf4c37f91f.png)

#caption
Um exemplo criado no [Vercel OG Image Playground](https://og-playground.vercel.app/).
::

## Conteúdo

## Um exemplo simples

O uso da biblioteca é bem simples, mas tem algumas obrigatoriedades. Se você pretende escrever algum texto, é necessário que você providencie *Buffers* para as fontes que deseja que sejam utilizadas, portanto, você precisará fazer alguma requisição extra ou possuir os arquivos localmente. No lado do servidor, torna-se relativamente simples esta última opção.

```ts
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { SatoriOptions } from 'satori'

type FontOptions = SatoriOptions['fonts'][number]

async function loadFonts(): FontOptions[] {
  const fontsPath = join(__dirname, 'fonts')
  
  return [{
    name: 'Inter',
    data: await readFile(join(fontsPath, 'Inter-Regular.otf')),
    weight: 400,
    style: 'normal',
  }]
}
```

Tendo as fontes carregadas, usar o Satori é bem fácil. A chamada da função requer dois parâmetros: um objeto `ReactNode` (ou o JSX/TSX direto se você configurou no seu transpilador), e as opções de renderização, onde será passado as fontes também.

```tsx
import satori from 'satori'

async function createSvg(title: string): string {
  const component = (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      { title }
    </div>
  )

  const options: SatoriOptions = {
    width: 800,
    height: 400,
    fonts: await loadFonts()
  }

  return await satori(component, options)
}
```

Com o SVG, basta utilizar alguma biblioteca como o Sharp para converter para um formato aceito pelas especificações do Open Graph, seja PNG ou JPG.

```tsx
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

async function saveImage(svg: string) {
  const imagePath = join(__dirname, 'image.png')
  const image = await sharp(Buffer.from(svg))
    .png({ quality: 90 })
    .toBuffer()

  await writeFile(imagePath, image)
}
```

## Utilizando o Tailwind CSS

Convenientemente, o Satori também suporta alguns dos utilitários do Tailwind CSS. Para utilizá-los, basta aplicar as classes nos elementos através do atributo `tw` ao invés do `className`.

```tsx
const component = (
  <div tw="bg-white w-full h-full flex items-center justify-center font-bold text-4xl">
    Hello, world!
  </div>
)
```

Apesar de poder utilizar o Tailwind permitir e facilitar muitas abordagens, atente-se que o Satori possui restrições de quais propriedades podem ser utilizadas no CSS. Para mais informações, consulte a [documentação](https://github.com/vercel/satori#css) no GitHub.

## Como criei a geração das imagens no NuxtJS

A criação das imagens deste site é feita a partir de um módulo customizado para o NuxtJS. O procedimento que acabei implementando é utilizar no ambiente de *prerender* o hook `prerender:generate` para obter informações da rota que acabou de ser gerada com seu HTML. 

Por sua vez, utilizo o pacote `open-graph-scraper` para fazer o *parse* desse HTML e me retornar todas as informações do Open Graph já declaradas previamente na página. É possível então extrair informações como o título, a descrição, a seção e data de publicação, repassados para o Satori no meio do template.

Apesar do Vite suportar a sintaxe do JSX/TSX, eu não consegui configurar corretamente a transpilação, então acabei optando por criar os objetos manualmente mesmo. Cada rota gera no final uma imagem no formato PNG, e a *tag* `<meta>` de `og:image` em ambiente de *prerender* ou produção aponta para ela. O nome do arquivo é gerado automaticamente a partir do `pathname` da rota, substituindo todas as barras por traços.

::large-figure
![Imagem gerada automaticamente para este post, seguindo o *template* que eu defini.](./posts/2022/2022-10-17-gerando-imagens-do-open-graph-automaticamente-com-o-satori/teste.webp)

#caption
Imagem gerada automaticamente para este post, seguindo o *template* que eu defini.
::

Adicionalmente eu fiz o processo ser pulado se é encontrada alguma *tag* `<meta>` de `og-image:skip` com valor `true`. Ela é útil em casos onde eu quero definir alguma imagem customizada para alguma rota ou post.

## Conclusões

O Satori abre várias possibilidades de automação da geração de imagens de compartilhamento. Apesar de ser criado em mente para ser usado em um ambiente Next.js ou React, nada impede de ser utilizado em outros *frameworks*, como o NuxtJS ou Vue.js. Inclusive, imagino que eventualmente deva surgir alguma biblioteca inspirada baseada no Vue, e que tornará seu uso no NuxtJS muito mais fácil. Quem sabe em breve não teremos um `@nuxtjs/og-image` 😁.

Ainda preciso melhorar as imagens geradas do site, mas acredito que os resultados iniciais foram muito satisfatórios e estou realmente feliz com eles. Só de não ter que ter o trabalho de gerar uma imagem manualmente para cada novo post já tira uma etapa a mais do processo de publicação e me deixa realmente aliviado.

## Referências

- "[*Introducing OG Image Generation: Fast, dynamic social card images at the Edge*](https://vercel.com/blog/introducing-vercel-og-image-generation-fast-dynamic-social-card-images)"
- [Vercel OG Image Playground](https://og-playground.vercel.app/)
- [Repositório no GitHub do Satori](https://github.com/vercel/satori)
