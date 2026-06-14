---
title: Convertendo páginas do Notion para Markdown usando Haskell
category: Programação
description: Um tutorial introdutório que aborda o problema com a abordagem em uma linguagem com um paradigma de programação funcional.
language: pt-BR
created_at: 2024-03-12
tags:
  - notion
  - api
  - haskell
---

O [Notion](https://notion.so) possui um ótimo editor WYSIWYG (*What You See Is What You Get*), mas por baixo dos panos todos os blocos são armazenados individualmente e o serviço não oferece uma API que permita recuperar o conteúdo inteiro de uma página em particular em formatos mais abertos, tais como o [Markdown](https://www.markdownguide.org/getting-started/).

::large-figure
![Página inicial do site do Notion. Imagem por Unsplash.](https://images.unsplash.com/photo-1642132652859-3ef5a1048fd1?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb)

#caption
Página inicial do site do Notion. Imagem por Unsplash.
::

O intuito desse tutorial é demonstrar como é possível construir um programa usando [Haskell](https://www.haskell.org/) com o paradigma de programação funcional que seja capaz de pegar os blocos de uma página no Notion e convertê-los para Markdown ou outros formatos usando a API da biblioteca [Pandoc](https://pandoc.org/). 

Apesar de um esforço existir em relação a esse problema em Haskell pelo projeto https://github.com/dalpd/notion no GitHub, este não possibilita (ainda) obter os blocos de uma página e está em estado muito inicial, além de estar com pouca manutenção. Este repositório citado utiliza as mesmas bibliotecas em relação ao *parse* da API do Notion, mas seu código difere do criado neste tutorial.

Como exemplo de página para testes, será utilizada a desse próprio tutorial, que será o teste do programa em conseguir converter para Markdown no formato [*GitHub Flavored Markdown*](https://github.github.com/gfm/). O repositório com o código completo encontra-se disponível em https://github.com/alessandrojean/notion-doc.

::callout
Este tutorial foi escrito como um dos projetos da disciplina [*Desenvolvimento Guiado a Tipos*](https://folivetti.github.io/teaching/2024-summer-teaching-1) do Bacharelado em Ciência da Computação na UFABC em Março de 2024.
::

## Conteúdo

## Motivação por trás

A ideia deste tutorial veio de uma necessidade própria de ter uma maneira de conseguir fazer um *backup* se necessário do conteúdo desse site. Apesar do Notion ser super versátil e aumentar bastante a produtividade na escrita, é sempre bom poder ter controle dos dados se for necessário.

## Criando o projeto e instalando as dependências

Seguindo o recomendado para a construção de aplicações modernas com Haskell, iremos utilizar o [Haskell Stack](https://docs.haskellstack.org/en/stable/) para a criação do projeto e para a manutenção das dependências externas. Todo o pacote de desenvolvimento foi instalado através do [GHCup](https://www.haskell.org/ghcup/). Para iniciar a pasta do projeto, utilizamos o comando:

```console
$ stack init notion-doc simple
```

Após a ferramenta terminar de transferir os arquivos necessários do *template* `simple`, podemos referenciar as dependências externas no [Hackage](https://hackage.haskell.org/) necessárias ao editar o arquivo `notion-doc.cabal` e incluí-las na seção `build-depends`:

```cabal [notion-doc.cabal]
build-depends: base >= 4.7 && < 5
  , aeson
  , aeson-casing
  , http-conduit
  , http-client
  , http-client-tls
  , http-types
  , conduit
  , conduit-extra
  , bytestring
  , pandoc
  , pandoc-types
  , slugify
```

O `aeson` será utilizado para fazer o *parse* do JSON proveniente das respostas da API do Notion, enquanto o `http-conduit` será o cliente HTTP para fazer as requisições. Ambos são utilizados em conjunto. Por sua vez, o `pandoc` será utilizado para escrever o arquivo final em Markdown.

## Ideia básica

O algoritmo do programa consiste em fazer o *parse* dos blocos da API do Notion e convertê-los para blocos da API do Pandoc (a AST — [*Abstract Syntax Tree*](https://en.wikipedia.org/wiki/Abstract_syntax_tree)). Tendo a AST corretamente construída, é possível convertê-la para qualquer formato que o Pandoc suporte, seja ele Markdown, HTML, EPUB, dentre muitos outros.

O passo-a-passo, de uma forma resumida, é esse:

1. Requisitar as informações da página e os seus blocos da API do Notion;
2. Fazer o *parse* usando o `aeson` para as ADTs do projeto (módulo `NotionApiTypes`);
3. Converter os blocos do Notion (`[N.Block]`) para os blocos do Pandoc (`[P.Block]`);
4. Converter a AST do Pandoc para o formato desejado, o Markdown.

Este tutorial não vai seguir necessariamente esta ordem do algoritmo, mas pretende abordar uma boa parte de como ele funciona de modo geral ao focar nas partes primordiais do código.

## Obtendo uma chave de API

Para obter uma chave da API do Notion, é necessário [criar uma integração](https://developers.notion.com/docs/create-a-notion-integration) no *dashboard* e conectá-la as páginas que deseja [permitir seu acesso](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions). Para fins de simplificação, a chave será escrita diretamente no código, mas evite esta abordagem em códigos para produção, visto que é totalmente insegura: use variáveis de ambiente com a biblioteca `dotenv`.

Para agrupar as funções da API do Notion, no programa, torna-se mais fácil criar um módulo para isso, que por enquanto terá apenas algumas constantes.

```haskell [src/NotionApi.hs]
{-# LANGUAGE OverloadedStrings #-}
module NotionApi where

import qualified Data.ByteString.Char8 as S8

baseUrl :: String
baseUrl = "https://api.notion.com/v1"

apiVersion :: S8.ByteString
apiVersion = "2022-06-28"

apiKey :: S8.ByteString
apiKey = "sua_chave_da_api"
```

Aqui vale uma observação: a maioria das funções do `http-conduit` espera como parâmetros *strings* do tipo `ByteString` e não a `String` do Haskell. Para evitar conversões em tempo de execução, é melhor já deixar as constantes no formato necessário.

Também faz-se uso da linguagem de extensão `OverloadedStrings`, que permite escrever os literais das *strings* diretamente (usando aspas, de modo normal) e a conversão é feita em tempo de compilação, evitando o uso recorrente do `S8.pack`.

## Definindo os tipos da API

As páginas no Notion são compostas por diversos tipos de blocos, podendo ser, por exemplo, parágrafos, títulos, imagens etc. Cada bloco, por sua vez, tem particularidades específicas, como o de parágrafo que permite uma edição mais detalhada do texto, possibilitando o uso de recursos como negrito, itálico e sublinhado.

Para obter uma boa referência de todos os tipos possíveis de blocos e suas propriedades particulares, pode-se utilizar a biblioteca `@notionhq/client` disponível no NPM para a linguagem JavaScript e TypeScript. Os tipos na linguagem TypeScript podem ser encontrados no arquivo `src/api-endpoints.ts` no repositório da biblioteca no GitHub ([referência](https://github.com/makenotion/notion-sdk-js/blob/main/src/api-endpoints.ts)), mas também é possível consultá-los num formato mais amigável e sucinto na referência de API do [Block](https://developers.notion.com/reference/block).

Tomando como exemplo o bloco de parágrafo, temos:

```ts
type ParagraphBlock = {
  type: "paragraph"
  paragraph: { rich_text: Array<RichTextItemResponse>; color: ApiColor }
  id: string
  has_children: boolean
  // Outras propriedades omitidas.
}
```

E tomando como exemplo um bloco de título 1, temos:

```ts
type Heading1Block = {
  type: "heading_1"
  heading_1: {
    rich_text: Array<RichTextItemResponse>
    color: ApiColor
    is_toggleable: boolean
  }
  id: string
  has_children: boolean
  // Outras propriedades omitidas.
}
```

Por fim, o tipo genérico do bloco é do tipo soma.

```ts
// Outros tipos de blocos omitidos para simplificação.
type Block = ParagraphBlock | Heading1Block
```

Como explicado anteriormente, cada tipo de bloco possui propriedades específicas. No caso do parágrafo, a propriedade `paragraph` é única neste bloco, enquanto propriedades como `type`, `id` e `has_children` são comuns em todos os blocos. 

A propriedade `type` é a mais importante no nosso contexto, já que possibilitará a distinção do tipo do bloco, enquanto a `has_children` permitirá saber se será necessário fazer requisições extras para obter os blocos-filhos, no caso de blocos de listas de tópicos, por exemplo.

Em um paradigma orientado a objetos, o bloco seria uma classe abstrata, ou até mesmo uma interface, com essas propriedades que deveria ser herdado por classes para cada bloco. O desafio agora é converter estes tipos para tipos que sejam válidos na linguagem Haskell e que possibilitem o *parse* pela biblioteca `aeson`.

Todos os tipos do Notion ficarão no módulo `NotionApiTypes`, e alguns deles serão mostrados como exemplo nas próximas seções do texto.

### Fazendo *parse* de JSON com o `aeson`

A biblioteca `aeson`, em conjunto com a `aeson-casing`, permite transformar *strings* com JSON para tipos próprios no Haskell. Os tipos, por sua vez, devem ser instâncias da classe `FromJSON`, onde a implementação da função `parseJSON` pode ser tanto manual quanto derivada automaticamente (o que será utilizado geralmente).

Suponha que temos este objeto em JSON que representa uma pessoa.

```json
{
  "name": "John Doe",
  "email": "john.doe@example.org",
  "country": "US",
  "phone": null
}
```

Podemos representar em Haskell da seguinte maneira.

```haskell
{-# LANGUAGE DeriveGeneric #-}

import Data.Aeson
import GHC.Generics (Generic)

data Person = Person
  { name :: String
  , email :: String
  , country :: String
  , phone :: Maybe String
  } deriving (Generic)
  
instance Person FromJSON
```

Ao utilizar a extensão de linguagem `DeriveGeneric` em conjunto com o `deriving (Generic)`, o compilador ficará encarregado de implementar a função `parseJSON` automaticamente para esse tipo, poupando bastante tempo do desenvolvedor. Entretanto, isso pode ser um empecilho em alguns casos.

Suponha que uma das propriedades do objeto JSON fosse `country_of_origin` (em *snake_case*) ao invés de `country`, como faríamos para informar o compilador que `country_of_origin` deve virar `countryOfOrigin` para respeitar as convenções de nome do Haskell? Pior ainda, e se fosse necessário definir os atributos do tipo `Person` com um prefixo `person` para evitar ambiguidade (o que é comum neste caso do Notion), como fazer?

O primeiro caso é bem simples e pode ser resolvido sem muitas modificações com a biblioteca `aeson-casing`, que permite a transformação das chaves das propriedades.

```haskell
{-# LANGUAGE DeriveGeneric #-}

import Data.Aeson
import Data.Aeson.Casing
import GHC.Generics (Generic)

data Person = Person
  { name :: String
  , email :: String
  , countryOfOrigin :: String
  , phone :: Maybe String
  } deriving (Generic)

instance Person FromJSON where
  parseJSON = genericParseJSON $ aesonDrop 0 snakeCase
```

A função `aesonDrop` permite que se especifique o número de caracteres a serem removidos no início da chave e qual a transformação que deve ser aplicada, que neste caso é a `snakeCase`. Deste modo, a chave `country_of_origin` virará a `countryOfOrigin`. Usa-se a `aesonDrop` ao invés da `aesonPrefix snakeCase` por conta de um detalhe que será explicado em seguida.

O segundo caso também é facilmente resolvido com a `aeson-casing`.

```haskell
{-# LANGUAGE DeriveGeneric #-}

import Data.Aeson
import Data.Aeson.Casing
import GHC.Generics (Generic)

data Person = Person
  { personName :: String
  , personEmail :: String
  , personCountryOfOrigin :: String
  , personPhone :: Maybe String
  } deriving (Generic)
  
instance Person FromJSON where
  parseJSON = genericParseJSON $ aesonPrefix snakeCase
```

A função `aesonPrefix` permite que seja aplicado um transformador logo após remover um prefixo existente, que nesse caso por convenção da biblioteca são todos os caracteres em minúsculo no começo da chave. Assim que o primeiro caractere maiúsculo é encontrado, apenas o resto da *string* sofre a transformação. Este é o motivo de não ter sido utilizado o `aesonPrefix` no exemplo anterior, pois `countryOfOrigin` viraria `of_origin` apenas e daria erro no momento do *parse* por ser uma chave que não existe no objeto.

Em alguns casos também pode ser interessante renomear as propriedades, o que pode ser feito com *functors*, sendo a maneira manual de escrever o `parseJSON`.

```haskell
import Data.Aeson

data Person = Person
  { personName :: String
  , personEmail :: String
  , personCountry :: String
  , personPhone :: Maybe String
  }

instance Person FromJSON where
  parseJSON = withObject "Person" $ \v -> Person
    <$> v .: "name"
    <*> v .: "email"
    <*> v .: "country_of_origin"
    <*> v .?: "phone"
```

Essa sintaxe com o *functor* pode parecer um pouco confusa numa primeira vez, mas ela seria equivalente a fazer isto abaixo.

```haskell
instance Person FromJSON where
  parseJSON = withObject "Person" $ \v -> do
    name <- v .: "name"
    email <- v .: "email"
    country <- v .: "country_of_origin"
    phone <- v .?: "phone"
    
    pure $ Person name email country phone
```

O argumento `v` é do tipo `Object`, que por sua vez permite que valores sejam extraídos a partir de chaves com os operadores `.:` e `.?:` para chaves opcionais.

### Modelando os tipos dos blocos do Notion

Com essa base da biblioteca `aeson`, já é possível partir para alguns casos mais avançados, como o polimorfismo dos blocos a partir da propriedade `type`. Vamos começar definindo dois blocos iniciais, os mesmos citados como exemplo anteriormente, o parágrafo e título 1.

```haskell [src/NotionApiTypes.hs]
data Block = BlockParagraph { paragraph :: Text }
  | BlockHeading1 { heading1 :: Heading }
  deriving (Generic)
```

Aqui, ao invés de usarmos os atalhos da `aeson-casing`, precisaremos fazer algumas configurações do *parser* manualmente por meio de opções.

```haskell [src/NotionApiTypes.hs]
blockOptions :: Options
blockOptions = defaultOptions 
  { sumEncoding = TaggedObject { tagFieldName = "type", contentsFieldName = undefined }
  , constructorTagModifier = snakeCase . fixBlockType . drop 5
  , fieldLabelModifier = snakeCase . fixBlockType
  }
```

Explicando cada atributo, temos:

- `sumEncoding`: especifica detalhes adicionais sobre o tipo soma. Estamos informando o `aeson` que a diferenciação do tipo soma se dará por *tags* no objeto. Por padrão, o `aeson` utiliza a chave `tag`, mas como o Notion utiliza a chave `type`, temos que especificá-la.
- `constructorTagModifier`: faz a transformação do nome dos tipos no Haskell para os valores da propriedade `type` no JSON. Queremos que `BlockHeading1` seja o equivalente de `heading_1` no JSON, e isto é feito com a composição de funções.
- `fieldLabelModifier`: faz a transformação do nome dos atributos no Haskell para as chaves do objeto no JSON, o que a biblioteca `aeson-casing` faz por baixo dos panos.

Em especial, temos a função `fixBlockType` responsável por substituir `heading1` e seus derivados por `heading_1`, pois é um caso que a `snakeCase` não trata.

Tendo as opções, pode-se passá-las para o `parseJSON` da seguinte maneira.

```haskell [src/NotionApiTypes.hs]
instance FromJSON Block where
  parseJSON = genericParseJSON blockOptions
```

Os demais tipos como `Text` e `Heading` usados nos blocos foram omitidos para fins de simplificação, mas estão disponíveis no repositório do tutorial.

### Modelando os tipos das respostas da API

Iremos utilizar dois *endpoints* da API do Notion: [*retrieve a page*](https://developers.notion.com/reference/retrieve-a-page) e [*retrieve block children*](https://developers.notion.com/reference/get-block-children). Em relação ao primeiro *endpoint*, temos os seguintes tipos de retorno:

```haskell [src/NotionApiTypes.hs]
data Page = Page
  { pageId :: String
  , pageProperties :: PageProperties
  , pageCreatedTime :: String
  } deriving (Show)
  
instance FromJSON Page where
  parseJSON = genericParseJSON $ aesonPrefix snakeCase
```

O atributo `pageProperties` é um mapa de `String` para `Property` (no TypeScript), e dá acesso a todos os tipos de propriedades que uma página tem, e elas são polimórficas, similar aos blocos. Como só temos interesse na propriedade do tipo `title`, que tem sempre a chave `Name`, pode-se simplificar o tipo como abaixo.

```haskell [src/NotionApiTypes.hs]
newtype PageProperties = PageProperties { propName :: TitleProperty }
  deriving (Generic)

instance FromJSON PageProperties where
  parseJSON = genericParseJSON $ aesonPrefix pascalCase
  
newtype TitleProperty = TitleProperty { tpTitle :: [RichTextItem] }
  deriving (Generic)
  
instance FromJSON TitleProperty where
  parseJSON = genericParseJSON $ aesonPrefix snakeCase
```

Por sua vez, o segundo *endpoint* nos retorna este tipo abaixo.

```haskell [src/NotionApiTypes.hs]
data PageBlocks = PageBlocks
  { results :: [Block]
  , nextCursor :: Maybe String
  , hasMore :: Bool
  } deriving (Generic)
  
instance FromJSON PageBlocks where
  parseJSON = genericParseJSON $ aesonDrop 0 snakeCase
```

O atributo `nextCursor` retorna um cursor de paginação alfanumérico que pode ser utilizado para obter os próximos blocos, caso eles existam (`hasMore == True`).

## Fazendo as requisições na API

Tendo modelado todos os tipos necessários do Notion, podemos partir para a criação das funções responsáveis por fazer as requisições HTTPS para o Notion. Voltando ao módulo `NotionApi`, podemos começar definindo a função `retrieveNotionPage`.

A função `retrieveNotionPage` permitirá obter detalhes de uma página a partir de seu ID, e a resposta será utilizada para obter as propriedades da página, como o título.

```haskell [src/NotionApi.hs]
import Network.HTTP.Conduit
import Network.HTTP.Simple
import NotionApiTypes (Page, PageBlocks)

retrieveNotionPage :: String -> IO Page
retrieveNotionPage pageToFetch = do
  initialRequest <- parseRequest $ baseUrl ++ "/pages/" ++ pageToFetch
  let request
        = setRequestMethod "GET"
        $ addRequestHeader "Notion-Version" apiVersion
        $ setRequestBearerAuth apiKey initialRequest
  
  response <- httpJSON request
  return $ responseBody response
```

O `http-conduit` funciona como uma biblioteca de cliente HTTP qualquer em outra linguagem, tal qual o [OkHttp](https://square.github.io/okhttp/), [Ktor](https://ktor.io/) ou o [Axios](https://axios-http.com/). O fluxo segue o do protocolo: deve-se criar uma requisição para a URL que deseja, com o método e cabeçalhos necessários e então esperar pela resposta, que por sua vez será transformada nos tipos do Haskell pela função `httpJSON`. Note que o retorno da função é um `IO Page`, então é necessário chamar a função no mesmo contexto.

Ao utilizar a função `httpJSON`, o `http-conduit` já se encarrega de fazer a integração com o `aeson` e fazer o parse para o tipo do retorno informado no cabeçalho da função, que, neste caso, deve implementar a `FromJSON`.

De maneira similar, pode-se escrever a função `retrieveBlockChildren`, só alterando o retorno para `IO PageBlocks` e a URL do *endpoint* de *retrieve block children*.

```haskell [src/NotionApi.hs]
retrieveBlockChildren :: String -> Maybe String -> IO PageBlocks
retrieveBlockChildren blockToFetch startCursor = do
  initialRequest <- parseRequest $ baseUrl ++ "/blocks/" ++ blockToFetch ++ "/children"
  let request
        = setRequestMethod "GET"
        $ setRequestQueryString (blockChildrenParams startCursor)
        $ addRequestHeader "Notion-Version" apiVersion
        $ setRequestBearerAuth apiKey initialRequest

  response <- httpJSON request
  return $ responseBody response
```

A diferença é que esta função permite a passagem de um parâmetro extra, o cursor de início, usado para a paginação. Desta forma, é criado um *query parameter* de `?start_cursor=valor` quando `startCursor` não for `Nothing`.

Para facilitar obter todos os blocos de uma página sem ter que lidar com a paginação, podemos criar uma função que fará isso para nós com uma abordagem recursiva.

```haskell [src/NotionApi.hs]
retrieveAllBlockChildren :: String -> IO [Block]
retrieveAllBlockChildren bId = do
  first <- retrieveBlockChildren bId Nothing
  retrieveAllBlockChildren' bId (nextCursor first) (pure $ results first)

retrieveAllBlockChildren' :: String -> Maybe String -> IO [Block] -> IO[Block]
retrieveAllBlockChildren' bId (Just startCursor) bks = do
  acm <- bks
  crr <- retrieveBlockChildren bId (Just startCursor)
  retrieveAllBlockChildren' bId (nextCursor crr) (pure $ acm <> results crr)
retrieveAllBlockChildren' _ Nothing bks = bks
```

O intuito é que somente `retrieveAllBlockChildren` seja exportado do módulo. Esta função de entrada irá começar a recursão através de uma segunda função auxiliar. Basicamente o que é feito é obter os blocos anteriores no acumulador, obter os blocos da página atual e concatená-los. Esta nova lista de blocos é então passada para a chamada recursiva até chegar em uma resposta da API em que `nextCursor` seja `Nothing`.

## Convertendo os blocos

Em um novo módulo `Converter`, criaremos as funções responsáveis por converter o `Page` e `PageBlocks` para a AST `Pandoc`.

### Convertendo o tipo comum de texto

Começando em uma parte crucial, vamos criar as funções responsáveis por percorrer o tipo `[RichTextItem]` do Notion para criar os blocos `Inline` do Pandoc, responsáveis pela formatação, tal como o negrito, itálico etc.

Cada item do tipo `RichTextItem` possui um objeto que informa quais as formatações aplicadas no pedaço do texto do item. O objeto tem o seguinte tipo.

```haskell [src/NotionApiTypes.hs]
data AnnotationResponse = AnnotationResponse
  { bold :: Bool
  , italic :: Bool
  , strikethrough :: Bool
  , underline :: Bool
  , mono :: Bool -- originalmente `code` na API
  , color :: String
  }
```

Vamos criar uma função que nos ajude a "anotar" um dado texto com as anotações nos tipos do Pandoc, ou seja, `Inline` ([referência](https://hackage.haskell.org/package/pandoc-types-1.23.1/docs/Text-Pandoc-Definition.html#t:Inline)). A ideia é ser uma função recursiva que a cada propriedade como `True` encontrada, aplique tal formatação e defina-a como `False`, chamando a função novamente até que nenhuma formatação necessite ser aplicada.

```haskell [src/Converter.hs]
{-# LANGUAGE OverloadedStrings #-}
module Converter where

import qualified NotionApiTypes as N
import qualified Text.Pandoc.Definition as P

annotate :: String -> N.AnnotationResponse -> P.Inline
annotate txt an | N.bold an = P.Strong [annotate txt (an { N.bold = False })]
                | N.italic an = P.Emph [annotate txt (an { N.italic = False })]
                | N.strikethrough an = P.Strikeout [annotate txt (an { N.strikethrough = False })]
                | N.underline an = P.Underline [annotate txt (an { N.underline = False })]
                | N.mono an = P.Code P.nullAttr (T.pack txt)
                | otherwise = P.Str (T.pack txt)
```

Os textos também podem ter *links*, então é necessário criar um utilitário para isso.

```haskell [src/Converter.hs]
linkify :: Maybe String -> P.Inline -> P.Inline
linkify Nothing txt = txt
linkify (Just href) txt = P.Link P.nullAttr [txt] (T.pack href, "")
```

O tipo `RichTextItem` por sua vez é um tipo soma e pode ser tanto um `TextRichText` quanto um `EquationRichText`. Podemos agora escrever uma função auxiliar para converter.

```haskell [src/Converter.hs]
parseText :: N.Text -> [P.Inline]
parseText txt = parseInline $ N.txRichText txt

parseInline :: [N.RichTextItem] -> [P.Inline]
parseInline = map parseRichTextItem

parseRichTextItem :: N.RichTextItem -> P.Inline
parseRichTextItem (N.TextRichText txt href an _) = linkify href $ annotate txt an
parseRichTextItem (N.EquationRichText eq _ _ _) = P.Math P.InlineMath $ T.Pack eq
```

Com isso já é possível converter qualquer texto formatado do Notion para a formatação `Inline` do Pandoc, que é utilizada em praticamente todos os blocos. A implementação do `parseRichTextItem` para o tipo `EquationRichText` ignora a formatação nas anotações por conta que na maioria dos casos os documentos gerados pelo Pandoc não suportam tal recurso, gerando equações parecidas com o LaTeX diretamente.

### Convertendo os blocos

Agora que é possível converter os textos, podemos começar a implementar a conversão dos blocos. Começando pelos tipos mais simples, é fácil utilizar o *pattern matching* do Haskell para fazer as conversões diretamente, como no código abaixo.

```haskell [src/Converter.hs]
notionToPandoc :: N.Block -> P.Block
notionToPandoc (N.BlockParagraph pr) = P.Para (parseText pr)
notionToPandoc (N.BlockHeading h1) = P.Header 1 P.nullAttr (parseHeading h1)
-- Alguns blocos omitidos para simplificação.
-- Casos especiais: bulleted list item e numbered list item.
notionToPandoc (N.BlockBulletedListItem bli) = P.Plain (parseText bli)
notionToPandoc (N.BlockNumberedListItem nli) = P.Plain (parseText nli)
-- Outros blocos omitidos.
notionToPandoc _ = P.Para [P.Str "Unsupported block"]
```

Aqui vale uma observação em relação aos blocos de lista com marcadores e lista numerada. O Notion não possui um tipo que agrupa esses itens em um único bloco, eles são colocados sequencialmente na lista de blocos. Para isso, na conversão direta dos blocos, esses items são transformados em texto apenas, pois o texto será usado internamente no tipo de `BulletList` do Pandoc. É necessário, então, uma outra função que fará a conversão da lista e que possa tratar desses casos em particular.

```haskell [src/Converter.hs]
nToP :: [N.Block] -> [P.Block]
nToP [] = []
nToP ((N.BlockBulletedListItem bli) : bs) = blocks
  where
    notionBlock = N.BlockBulletedListItem bli
    firstItem = notionToPandoc notionBlock
    nextItems = map ((\b -> [b]) . notionToPandoc) $ takeWhile isBli
    finalItems = drop (length nextItems) bs
    blocks = P.BulletList ([firstItem] : nextItems) : nToP finalItems
nToP bs = notionToPandoc (head bs) : nToP (drop 1 bs)
```

A ideia é que a função `nToP` seja recursivamente chamada para cada bloco na lista, onde ela irá converter o primeiro bloco e concatenar em uma lista com os demais da chamada seguinte. Entretanto, se o primeiro item da lista atual for um bloco do tipo `BlockBulletedListItem`, será feito a conversão desse bloco e de todos os blocos seguintes na lista que forem desse mesmo tipo, que por sua vez serão adicionados dentro de um `BulletList` do Pandoc. Os demais itens da lista que não forem desse tipo serão convertidos normalmente pelo último *pattern matching*.

Para isso funcionar, é necessário uma função auxiliar que também faz uso do *pattern matching* para retornar se um dado bloco é do tipo `BlockBulletedListItem`. Isto é feito pois não há uma maneira mais direta de verificar em tempo de execução se um bloco é de dado tipo.

```haskell [src/Converter.hs]
isBli :: N.Block -> Bool
isBli (N.BlockBulletedListItem _) = True
isBli _ = FalsefindNextBli _ = []
```

De modo análogo, pode-se converter os blocos do tipo `BlockNumberedListItem` também.

### Criando a AST

Com a conversão dos blocos implementada, podemos partir para a etapa final da criação da AST.

```haskell [src/Converter.hs]
createAst :: N.Page -> [N.Block] -> P.Pandoc
createAst page bks = P.Pandoc meta children
  where
    meta = createMeta pageProperties
    titleProp = N.propName $ N.pageProperties page
    slugH1 = slugify $ T.pack $ stripPlainText $ N.tpTitle titleProp
    header1 = P.Header 1 (slugH1, [], []) (parseInline $ N.tpTitle titleProp)
    children = header1 : createChildren bks
```

A função `createAst` faz uso de duas funções auxiliares, uma responsável por criar os metadados do documento e outra por converter os blocos.

```haskell [src/Converter.hs]
createMeta :: N.Page -> P.Meta
createMeta (N.Page _ properties date) = P.Meta { P.unMeta = fromList metadata }
  where
    titleProp = N.propName properties
    title = T.pack $ stripPlainText $ N.tpTitle titleProp
    metadata = [
      ("title", P.MetaInlines [P.Str title]),
      ("date", P.MetaInlines [P.Str $ T.pack date])
      ]

createChildren :: [N.Block] -> [P.Block]
createChildren = nToP
```

A função de criação da AST, além de converter os blocos, também adiciona um cabeçalho de nível 1 no começo da lista, que sempre será o título da página no Notion, obtido das propriedades. Tendo a AST do tipo `Pandoc`, fica fácil converter e criar um arquivo Markdown.

## Criando o Markdown

Em um novo módulo `Formats`, vamos implementar uma função auxiliar para escrever a conversão do tipo `Pandoc` em um arquivo Markdown no disco.

```haskell [src/Formats.hs]
module Formats where

import Text.Pandoc
import qualified Data.Text as T

mdOptions :: WriterOptions
mdOptions = def { writerExtensions = githubMarkdownExtensions }

saveMarkdown :: String -> Pandoc -> IO ()
saveMarkdown fileName doc = do
  result <- runIO $ writeMarkdown mdOptions doc
  md <- handleError result
  writeFile fileName $ T.unpack md
```

A função `saveMarkdown` executa no contexto `IO` a conversão da AST para ou o conteúdo final do arquivo ou um erro de conversão. Caso tudo tenha dado certo, o conteúdo é escrito no arquivo especificado por `fileName`. As opções `mdOptions` utilizam as extensões do formato *GitHub Flavored Markdown*, comumente adotado por diversos sites.

## Juntando tudo

No módulo `Main`, agora torna-se fácil juntar tudo e fazer a conversão propriamente dita.

```haskell [src/Main.hs]
module Main (main) where

import NotionApi
import Converter
import Formats

tutorialPageId :: String
tutorialPageId = "7b85035517424c72ab58af014fecf6bc"

main :: IO ()
main = do
  page <- retrieveNotionPage tutorialPageId
  blocks <- retrieveAllBlockChildren tutorialPageId

  let ast = createAst page blocks
  saveMarkdown "page.md" ast
```

A função `main` segue o passo-a-passo determinado anteriormente e escreve corretamente o arquivo em Markdown. Como um exemplo, pode-se observar abaixo a conversão do início do texto deste tutorial:

```markdown [page.md]
# Convertendo páginas do Notion para Markdown usando Haskell

O [Notion](https://notion.so/) possui um ótimo editor WYSIWYG 
(*What You See Is What You Get*), mas por baixo dos panos todos 
os blocos são armazenados individualmente e o serviço não oferece
uma API que permita recuperar o conteúdo inteiro de uma página em
particular em formatos mais abertos, tais como o 
[Markdown](https://www.markdownguide.org/getting-started/).
```

## Conclusão

O sistema de tipos do Haskell é uma ferramenta poderosa que possibilitou a implementação de um conversor com um código com uma ótima legibilidade e com uma ótima performance. Ao ter uma AST do Pandoc, torna-se possível converter para qualquer formato que a biblioteca suporte, possibilitando um acesso fácil ao conteúdo da página no formato desejado no momento. Apesar de possuir ainda alguns recursos a serem implementados para um melhor aproveitamento da página, como usar as propriedades da página para gerar o *frontmatter* do Markdown, a abordagem se mostra como promissora para usos futuros.

## Bibliografia

- ZAKHARYASCHEV, Ivan. Resposta para “*Haskell :: Aeson :: parse ADT based on field value*”. Stack Overflow, disponível [neste link](https://stackoverflow.com/a/29286213).
- O'SULLIVAN, Bryan. *Data.Aeson*. Hackage, disponível [neste link](https://hackage.haskell.org/package/aeson-2.2.1.0/docs/Data-Aeson.html).
- RADEMACHER, Andrew. *Data.Aeson.Casing*. Hackage, disponível [neste link](https://hackage.haskell.org/package/aeson-2.2.1.0/docs/Data-Aeson.html).
- YAO, William. *A cheatsheet to JSON handling with Aeson*. WilliamYaoh.com, disponível [neste link](https://williamyaoh.com/posts/2019-10-19-a-cheatsheet-to-json-handling.html).
- PANDOC. *Using the Pandoc API*. Pandoc.org, disponível [neste link](https://pandoc.org/using-the-pandoc-api.html#a-simple-example).
- PANDOC. *Pandoc Filters*. Pandoc.org, disponível [neste link](https://pandoc.org/filters.html#a-simple-example).
- MACFARLANE, John. *Text.Pandoc.Definition*. Hackage, disponível [neste link](https://hackage.haskell.org/package/pandoc-types-1.23.1/docs/Text-Pandoc-Definition.html#t:Caption).
- SCHOOL OF HASKELL. *Parsing JSON with Aeson*. School of Haskell, disponível [neste link](https://www.schoolofhaskell.com/school/starting-with-haskell/libraries-and-frameworks/text-manipulation/json).
- UFABC. *Grupo de estudos em Haskell da UFABC*. Pesquisa UFABC, disponível [neste link](https://haskell.pesquisa.ufabc.edu.br/).
