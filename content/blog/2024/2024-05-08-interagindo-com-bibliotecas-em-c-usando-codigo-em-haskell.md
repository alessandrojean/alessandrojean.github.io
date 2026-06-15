---
title: Interagindo com bibliotecas em C usando código em Haskell
category: Programação
description: Uma breve introdução ao recurso de interoperabilidade da linguagem Haskell, mostrando a conversão entre os tipos das linguagens por meio de exemplos com as bibliotecas em C do FFmpeg e do VLC.
language: pt-BR
created_at: 2024-05-08
tags:
  - c
  - haskell
  - implementação
---

Uma necessidade comum em algumas aplicações específicas é poder utilizar alguma biblioteca nativa do sistema operacional diretamente, mesmo não utilizando a linguagem que ela foi escrita (normalmente C ou C++). A maioria das linguagens de programação modernas permitem que tais funções sejam utilizadas através do recurso de interoperabilidade.

O objetivo deste tutorial é :mark[demonstrar como a interoperabilidade funciona no Haskell] no sentido de utilizar bibliotecas existentes em C, bem como a :mark[conversão entre os tipos de ambas as linguagens]. Para tal, serão mostrados alguns exemplos onde serão criadas algumas bibliotecas próprias, e outros onde serão alguns exemplos mais objetivos através da utilização do :mark[FFmpeg e VLC].

O código final deste artigo está disponível no GitHub no repositório :github-mention{repo="alessandrojean/haskell-c-interop"}.

::note
Este tutorial foi escrito como um dos projetos da disciplina [*Desenvolvimento Guiado a Tipos*](https://folivetti.github.io/teaching/2024-summer-teaching-1) do Bacharelado em Ciência da Computação na UFABC em Abril de 2024.
::

## Conteúdo

## Definição

> Interoperabilidade é a capacidade de duas linguagens de programação diferentes interagirem de maneira nativa como parte de um mesmo sistema e operar com os mesmos tipos de estruturas de dados.
> 
> :cite[— [Wikipédia](https://en.wikipedia.org/wiki/Language_interoperability) (em inglês)]

O Haskell oferece a interoperabilidade através do método de *interfaces de funções externas* (FFI), o que permite que nosso código em Haskell possa chamar funções escritas em C ou C++. Essas interfaces permitem que sejam construídas bibliotecas em Haskell que ofereçam funcionalidades de bibliotecas em C, facilitando o acesso e inclusive permitindo um estilo que seja mais idiomático para o Haskell, com (mas não limitado somente) a conversão para o paradigma funcional ([Wikipédia](https://en.wikipedia.org/wiki/Language_interoperability)). Tais bibliotecas são comumente conhecidas como *wrappers* ou *bindings*.

## Criando o projeto

Similar ao tutorial anterior, iremos utilizar o [Haskell Stack](https://docs.haskellstack.org/en/stable/) para a criação do projeto. Todo o pacote de desenvolvimento foi instalado através do [GHCup](https://www.haskell.org/ghcup/). Para iniciar a pasta do projeto, utilizamos o comando:

```console
$ stack new c-interop simple
```

Após as dependências e o *template* terem sido baixados, podemos abrir a pasta em um editor de código com suporte a Haskell e C/C++, como o Visual Studio Code.

## Um exemplo introdutório

Começando com um exemplo simples, utilizaremos uma biblioteca própria que só vai ter uma função. Para este exemplo, vamos criar uma biblioteca de matemática que irá exportar a função exponencial ($e ^ x$) definida como `my_exp`.

Primeiramente, precisaremos criar o arquivo de cabeçalho que irá definir todas as funções que nossa biblioteca exportará para o uso de outros programas.

```c [my_math/my_math.h]
#ifndef MY_MATH_H
#define MY_MATH_H

extern double my_exp(double);

#endif // my_math
```

A diferença significativa deste código para o que é comumente utilizado em arquivos de cabeçalho em C é a utilização da palavra-chave `extern` antes da definição da função. Ela que irá indicar quais funções ficarão acessíveis por outros programas.

Com o cabeçalho pronto, podemos implementar a nossa função em um arquivo separado.

```c [my_math/my_math.c]
#include <math.h>
#include "my_math.h"

#define EULER_NUM 2.71828

double my_exp(double number) {
  return pow(EULER_NUM, number);
}
```

Este código não tem muito segredo: utilizamos a biblioteca `libmath` do C para usar somente a função `pow`, permitindo que façamos a operação `e ^ number`. Poderíamos implementá-la manualmente, mas para fins de simplificação do código, é mais rápido utilizar a função oficial.

### Compilando a biblioteca de modo dinâmico

Para poder compilar a biblioteca, utilizaremos um fluxo em duas etapas: primeiro criaremos o objeto (`my_math.o`) para aí sim poder criar a biblioteca (`libmy_math.so`).

Para criar o objeto, utilizaremos o `gcc` do mesmo modo que seria utilizado para compilar um arquivo simples qualquer. A diferença, é que utilizaremos a *flag* `-fpic`, ideal para o uso em bibliotecas, pois [evita alguns possíveis conflitos](https://stackoverflow.com/a/5311538) com outras bibliotecas.

```console
$ gcc -c -Wall -Werror -fpic my_math.c
```

O comando irá produzir um arquivo `my_math.o`, que será utilizado em sequência no `gcc` para criar a biblioteca com o comando a seguir.

```console
$ gcc -shared -o ../libs/libmy_math.so my_math.o
```

Com isso, temos a biblioteca compilada, podemos utilizá-la no nosso código em Haskell.

### Incluindo a biblioteca

Para poder compilar o projeto com o `stack`, é necessário adicionar algumas *flags* ao compilador do Haskell, o `ghc`. No arquivo `c-interop.cabal` na raiz do projeto, é necessário incluir as seguintes linhas na propriedade `ghc-options`:

```cabal [c-interop.cabal]
ghc-options: -- Demais flags omitidas.
             -- Define um diretório extra para as bibliotecas. -- [!code ++]
             -L./libs                                          -- [!code ++]
             -- Define um diretório extra para os cabeçalhos.  -- [!code ++]
             -I./my_math                                       -- [!code ++]
             -- Utiliza a biblioteca my_math na compilação.    -- [!code ++]
             -lmy_math                                         -- [!code ++]
```

Temos este pequeno trabalho a ser feito por conta dos arquivos não estarem em diretórios comuns do sistema operacional, mas veremos no próximos exemplo que não será necessário especificar estes diretórios ao utilizar dependências instaladas globalmente de maneira direta.

### Utilizando a função

Agora finalmente poderemos modificar o código em Haskell. Primeiramente, é necessário usar duas diretivas de linguagem para habilitar a chamada de funções externas, bem como importar os tipos primitivos do C.

```haskell [src/Main.hs]
{-# LANGUAGE ForeignFunctionInterface, CApiFFI #-}
module Main (main) where

import Foreign.C.Types
```

Os tipos primitivos nos possibilitarão uma melhor definição das funções externas até por conta das diferenças de tamanho entre os tipos do Haskell e do C, que também podem ter diferenças entre os processadores e sistemas operacionais. Tendo feito as importações, podemos definir no arquivo o acesso a função `my_exp` da nossa biblioteca utilizando o código a seguir.

```haskell [src/Main.hs]
foreign import capi "my_math.h my_exp" c_myExp :: CDouble -> CDouble
```

Essa importação é especial, pois explicita que a função irá vir de uma dependência externa, bem como define que será feito uma chamada a uma função em C, especificada juntamente ao cabeçalho da função. Como o compilador do Haskell não consegue prever a tipagem da função, é necessário deixar a tipagem explícita.

Pode-se utilizar tanto a palavra-chave `capi` quando `ccall`, com a diferença que ao utilizar `capi`, os tipos serão checados com o compilador do C na hora de fazer o *link* entre as duas linguagens. Para um ambiente mais seguro em relação a tipos, torna-se interessante utilizar o `capi`, que inclusive é o recomendado pela [documentação do Haskell](https://downloads.haskell.org/ghc/9.0.1/docs/html/users_guide/exts/ffi.html?highlight=capiffi#extension-CApiFFI) atualmente.

É uma convenção do Haskell utilizar o prefixo `c_` para indicar funções e/ou constantes que sejam de bibliotecas externas em C, por isso ela é nomeada assim. Após a importação, podemos utilizá-la como uma função qualquer em Haskell, com a diferença que será necessário lidar com alguns tipos especiais, como o `CString` e `Ptr` ao utilizá-los.

```haskell [src/Main.hs]
main :: IO ()
main = do
  print $ c_myExp 5
```

### Compilando o código Haskell e executando

Para compilar utilizaremos o `stack` novamente, mas com algumas diferenças.

```console
$ stack build
```

Após a compilação ter sido concluída, podemos executar o arquivo.

```console
$ LD_LIBRARY_PATH=./libs stack exec c-interop
148.41265995084171
```

Aqui tem uma diferença no comando: é necessário especificar o local das bibliotecas externas nesse caso por conta de não ser o comum do sistema operacional. Como as bibliotecas são carregadas em tempo de execução, o programa precisa saber novamente onde as encontrar.

Ao executar, obtemos o resultado correto de `148.41265995084171` impresso na tela.

## Usando a biblioteca `math.h` diretamente

Na seção anterior, criamos uma biblioteca nossa e chamamos a função no código em Haskell. Nesta, iremos utilizar uma biblioteca da linguagem C que já está disponível globalmente no sistema operacional, onde teremos diferenças e simplificações na hora de compilação e execução.

A principal diferença é que não precisaremos modificar as *flags* de compilação do `ghc` no arquivo `c-interop.cabal` para incluir os diretórios dos cabeçalhos e da nossa biblioteca, mas sim apenas será necessário a utilização da `libmath` do próprio C. As linhas podem ser comentadas ou removidas neste caso, pois não serão mais utilizadas.

```cabal [c-interop.cabal]
ghc-options: -- Demais flags omitidas.
             -L./libs     -- [!code --]
             -I./my_math  -- [!code --]
             -lmy_math    -- [!code --]
             -lmath       -- [!code ++]
```

De maneira similar, iremos importar a função `exp` da biblioteca `math.h` no código Haskell.

```haskell [src/Main.hs]
foreign import capi "math.h exp" c_exp :: CDouble -> CDouble

main :: IO ()
main = do
  print $ c_exp 5
```

Para compilar e executar, basta usarmos os comandos padrões do `stack`:

```console
$ stack build
$ stack exec c-interop
148.4131591025766
```

Veja como não é necessário também definir a variável de ambiente `LD_LIBRARY_PATH` na hora de execução, visto que o programa sabe onde encontrar a biblioteca `libmath.so` na pasta padrão do sistema operacional, pois é uma biblioteca instalada globalmente.

## Utilizando a biblioteca do FFmpeg

Nesta seção, utilizaremos a API do [FFmpeg](https://ffmpeg.org/) para criar um programa simples que imprime os metadados de um arquivo suportado pela ferramenta. 

O FFmpeg é uma ferramenta de código aberto vastamente utilizada por diversos sistemas de multimídia, programado em C e Assembly para uma melhor performance. Ela permite a conversão entre formatos (`ffmpeg`), visualização de metadados (`ffprobe`) e reprodução de arquivos (`ffplay`). Todos os grandes *players* no mercado como YouTube e Netflix utilizam-o em algum dado momento nos seus fluxos.

::large-figure
![Quadrinho do XKCD.](./posts/2024/2024-05-08-interagindo-com-bibliotecas-em-c-usando-codigo-em-haskell/xkcd.jpeg)

#caption
Um quadrinho que brinca sobre a dependência de vários sistemas com o FFmpeg.
[Post](https://twitter.com/nixcraft/status/1758890917862514957) baseado numa tirinha do [XKCD](https://xkcd.com/2347/).
::

O intuito deste exemplo é construir uma espécie simplificada da ferramenta `ffprobe` disponível pelo FFMpeg. O `ffprobe` é um utilitário que exibe informações de um arquivo passado pela linha de comando. Ao usar em um arquivo de exemplo, podemos observar a saída abaixo.

```console
$ ffprobe big_buck_bunny.mp4
ffprobe version 6.0-6ubuntu1 Copyright (c) 2007-2023 the FFmpeg developers
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from '/home/alessandro/Downloads/bbb_sunflower_1080p_30fps_normal.mp4':
  Metadata:
    major_brand     : isom
    minor_version   : 1
    compatible_brands: isomavc1
    creation_time   : 2013-12-16T17:44:39.000000Z
    title           : Big Buck Bunny, Sunflower version
    artist          : Blender Foundation 2008, Janus Bager Kristensen 2013
    comment         : Creative Commons Attribution 3.0 - http://bbb3d.renderfarming.net
    genre           : Animation
    composer        : Sacha Goedegebure
  Duration: 00:10:34.60, start: 0.000000, bitrate: 3481 kb/s
  Stream #0:0[0x1](und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(progressive), 1920x1080 [SAR 1:1 DAR 16:9], 2998 kb/s, 30 fps, 30 tbr, 30k tbn (default)
    Metadata:
      creation_time   : 2013-12-16T17:44:39.000000Z
      handler_name    : GPAC ISO Video Handler
      vendor_id       : [0][0][0][0]
  Stream #0:1[0x2](und): Audio: mp3 (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 160 kb/s (default)
    Metadata:
      creation_time   : 2013-12-16T17:44:42.000000Z
      handler_name    : GPAC ISO Audio Handler
      vendor_id       : [0][0][0][0]
  Stream #0:2[0x3](und): Audio: ac3 (ac-3 / 0x332D6361), 48000 Hz, 5.1(side), fltp, 320 kb/s (default)
    Metadata:
      creation_time   : 2013-12-16T17:44:42.000000Z
      handler_name    : GPAC ISO Audio Handler
      vendor_id       : [0][0][0][0]
    Side data:
      audio service type: main
```

Para utilizar a API do FFmpeg, iremos precisar da `libavformat` e `libavutil` instaladas. Também iremos utilizar a `libavcodec`, mas ela já vem inclusa na instalação de ambas as bibliotecas, que estão disponíveis nos repositórios das distribuições Linux. Como exemplo do Ubuntu, elas estão disponíveis no `apt` e podem ser instaladas utilizando o comando abaixo.

```console
$ sudo apt install libavformat-dev libavutil-dev
```

Utilizamos as variantes com o sufixo `-dev` pois queremos que os arquivos de cabeçalho também sejam baixados e disponibilizados para serem usados em programas que vamos escrever.

O código deste exemplo é baseado em um exemplo oficial do FFmpeg que pode ser visto na íntegra [neste link](https://github.com/FFmpeg/FFmpeg/blob/08781ebe1aabe99b94e2ee949ca0c95c1443c756/doc/examples/show_metadata.c) no repositório do GitHub do projeto. No código, o arquivo passado como primeiro argumento na linha de comando é aberto como um *input*, onde seus metadados são processados, iterados, e exibidos na tela.

Para poder replicar este código em Haskell, criaremos uma interface escrita em C para intermediar (e facilitar) a comunicação entre nosso programa em Haskell e a biblioteca do FFmpeg. Esse programa intermediador irá expor duas funções para ler as informações do arquivo e uma `struct` especial com menos campos para facilitar a declaração dos tipos no Haskell.

### Criando o arquivo de cabeçalho

De maneira similar ao exemplo anterior, iremos criar um arquivo de cabeçalho `ffmpeg.h`.

```c [ffmpeg/ffmpeg.h]
#ifndef FFMPEG_H
#define FFMPEG_H

#include <libavformat/avformat.h>
#include <libavutil/dict.h>

struct FfmpegInput {
  AVDictionary * metadata;
  AVDictionary * format_metadata;
  AVDictionary ** streams_metadata;
  int nb_streams;
  AVFormatContext * context;
};

typedef struct FfmpegInput FfmpegInput;

extern FfmpegInput * load_input(const char *);
extern void free_input(FfmpegInput *);

#endif // ffmpeg_h
```

Explicando resumidamente, a `struct FfmpegInput` irá guardar três informações: um dicionário com os metadados do arquivo (`metadata`), um segundo dicionário com os metadados do formato do arquivo (`format_metadata`) e o contexto original da biblioteca, que será utilizado apenas para liberar a memória no final do uso do programa e não será acessado no código em Haskell.

### Carregando um arquivo e lendo os metadados

Partindo para a implementação da primeira função, iremos utilizar uma abordagem similar a do exemplo no repositório do FFmpeg.

```c [ffmpeg/ffmpeg.c]
#include <stdio.h>
#include <libavformat/avformat.h>
#include <libavutil/dict.h>
#include <libavcodec/codec.h>
#include <libavcodec/codec_desc.h>
#include "ffmpeg.h"

FfmpegInput * load_input(const char * file_name) {
  AVFormatContext * format_context = NULL;

  // Tenta abrir o arquivo, retorna um inteiro > 0 se deu algum erro.
  if (avformat_open_input(&format_context, file_name, NULL, NULL)) {
    return NULL;
  }

  // Tenta ver se há alguma trilha de vídeo e/ou áudio no arquivo.
  // Retorna valores negativos se deu algum erro.
  if (avformat_find_stream_info(format_context, NULL) < 0) {
    av_log(NULL, AV_LOG_ERROR, "Cannot find stream information\n");
    return NULL;
  }

  FfmpegInput * input = malloc(sizeof (FfmpegInput));

  if (input == NULL) {
    fprintf(stderr, "Failed to allocate necessary bytes for input\n");
    return NULL;
  }

  // Cria um dicionário que irá ter alguns metadados do arquivo.
  AVDictionary * metadata = NULL;
  av_dict_copy(&metadata, format_context->metadata, AV_DICT_DONT_OVERWRITE);
  create_file_dict(&metadata, format_context);  

  // Cria um dicionário que irá ter alguns metadados do formato.
  AVDictionary * format_metadata = NULL;
  create_format_dict(&format_metadata, format_context->iformat);

  // Cria um vetor de dicionários que irão ter alguns metadados das streams.
  AVDictionary ** streams_metadata = calloc(format_context->nb_streams, sizeof(AVDictionary *));
  create_streams_dict(streams_metadata, format_context);

  input->context = format_context;
  input->metadata = metadata;
  input->format_metadata = format_metadata;
  input->nb_streams = format_context->nb_streams;
  input->streams_metadata = streams_metadata;  

  return input;
}
```

Como explicado anteriormente, o código é baseado num exemplo oficial. A maior diferença é que estamos obtendo algumas informações da biblioteca e passando-as para um tipo de nosso domínio que é bem mais simplificado. Isso é feito porque os tipos da biblioteca do FFmpeg possuem macros e condicionais nas declarações, tornando a declaração no Haskell mais complexa e necessitando de ferramentas externas no fluxo de compilação.

A função `create_format_dict` chamada no meio do código é apenas uma função auxiliar que preenche o dicionário com alguns atributos básicos do formato.

```c [ffmpeg/ffmpeg.c]
void create_format_dict(AVDictionary ** dict, const AVInputFormat * iformat) {
  av_dict_set(dict, "name", iformat->name, AV_DICT_DONT_OVERWRITE);
  av_dict_set(dict, "long_name", iformat->long_name, AV_DICT_DONT_OVERWRITE);
  av_dict_set(dict, "extensions", iformat->extensions, AV_DICT_DONT_OVERWRITE);
  av_dict_set(dict, "mime_type", iformat->mime_type, AV_DICT_DONT_OVERWRITE);
}
```

De modo similar, as funções `create_streams_dict` e `create_file_dict` criam dicionários que conterão metadados das *streams* e do arquivo, respectivamente. O código delas foi omitido por simplificação, mas está disponível no repositório no GitHub do tutorial.

Não é necessário alocar a memória para o tipo `AvDictionary` explicitamente, pois o FFmpeg já faz isso por padrão na primeira chamada da função `av_dict_set`, segundo a documentação.

> `pm` — Pointer to a pointer to a dictionary struct. If `*pm` is `NULL` a dictionary struct is allocated and put in `*pm`.

### Liberando a memória

A função de liberação de memória é bem simples e concisa.

```c [ffmpeg/ffmpeg.c]
void free_input(FfmpegInput * input) {
  avformat_free_context(input->context);
  av_dict_free(&input->format_metadata);
  av_dict_free(&input->metadata);

  for (int i = 0; i < input->nb_streams; i++) {
    av_dict_free(&input->streams_metadata[i]);
  }

  free(input);
}
```

Aqui são utilizados duas funções específicas do FFmpeg para a liberação da memória tanto do contexto quanto do dicionário. A biblioteca lida com todos os campos internos de ambas as *structs*. Por fim, é necessário liberar o espaço de memória da nossa *struct* também.

### Compilando a biblioteca intermediária

Idêntico ao primeiro exemplo, vamos criar uma biblioteca `libffmpeg.so` para ser acessada no nosso código em Haskell.

```console
$ gcc -c -Wall -Werror -fpic -lavformat -lavutil -lavcodec ffmpeg.c
$ gcc -shared -o ../libs/libffmpeg.so ffmpeg.o
```

Também é necessário incluir a biblioteca nas *flags* do GHC.

```cabal [c-interop.cabal]
ghc-options: -- Demais flags omitidas
             -L./libs    -- [!code ++]
             -I./ffmpeg  -- [!code ++]
             -lffmpeg    -- [!code ++]
             -lavutil    -- [!code ++]
             -lavformat  -- [!code ++]
             -lavcodec   -- [!code ++]
```

### Instalando algumas dependências externas do Hackage

Para este segundo exemplo precisaremos usar duas bibliotecas externas disponíveis no Hackage. Para definir a dependência, precisamos primeiramente informar ao `stack` sobre elas, editando o arquivo de metadados do `stack` do nosso projeto.

```yaml [stack.yaml]
extra-deps:
  - c-storable-deriving-0.1.3 # [!code ++]
  - pretty-terminal-0.1.0.0   # [!code ++]
```

Tendo informado ao `stack`, podemos declarar a dependência ao `cabal` também.

```cabal [c-interop.cabal]
build-depends: base >= 4.7 && < 5,
               containers,          -- [!code ++]
               c-storable-deriving, -- [!code ++]
               pretty-terminal      -- [!code ++]
```

A biblioteca `c-storable-deriving` nos ajudará a criar a conversão dos tipos do C e Haskell mais facilmente no código final, enquanto a `pretty-terminal` irá ajudar a deixar a saída no terminal mais elegante com algumas cores. O `containers` por sua vez é declarado por conta do tipo `Map`, que será utilizado para acessar os dicionários do FFmpeg mais facilmente após uma conversão.

### O módulo `FFmpeg` no Haskell

Neste módulo iremos utilizar quatro diretivas de linguagem. Além das já utilizadas anteriormente `ForeignFunctionInterface` e `CApiFFI`, precisaremos de duas relacionadas a `Generics`: `DeriveGeneric` e `DeriveAnyClass`.

```haskell [src/FFmpeg.hs]
{-# LANGUAGE ForeignFunctionInterface, CApiFFI #-}
{-# LANGUAGE DeriveGeneric, DeriveAnyClass #-}
module FFmpeg where

import Control.Monad (forM_, join)
import Data.Maybe
import Foreign
import Foreign.C.Types
import Foreign.C (CString, withCString, peekCString)
import Foreign.CStorable (CStorable(..))
import GHC.Generics
import Data.Map (Map)
import qualified Data.Map as Map

import PrettyPrint
```

### Definindo os tipos da biblioteca intermediária no Haskell

Iremos começar replicando os tipos próprios do FFmpeg, mais especificamente os dicionários.

O tipo `AVDictionary` de `libavutil/dict.h` é uma *struct* vazia, como pode-se observar no código da biblioteca no trecho abaixo.

```c [libavutil/dict.h]
typedef struct AVDictionary AVDictionary;
```

Como a *struct* não tem campos, podemos representá-la no Haskell como um ponteiro para `void` no C (`void *`). Tal representação é feita usando o tipo `Ptr ()`, que vem da biblioteca `Foreign`.

```haskell [src/FFmpeg.hs]
type AvDictionary = Ptr ()
```

O tipo `AVDictionaryEntry` de `libavutil/dict.h` por sua vez, é uma *struct* simples com apenas dois campos: `key` e `value`, ambos do tipo `char *`. Por possuir dois campos, podemos representar esta *struct* com um *record* semelhante.

```haskell [src/FFmpeg.hs]
data AvDictionaryEntry = AvDictionaryEntry
  { avDictKey :: CString
  , avDictValue :: CString
  }
```

Para poder fazer a conversão entre as linguagens, as estruturas de dados precisarão providenciar uma instância da classe `Storable`. Essa instância pode ser implementada explicitamente, mas para poder implementar, é necessário ter conhecimento nos tamanhos dos tipos e de seus *paddings*, caso existam, nas estruturas do C, que podem ser consultados na tabela abaixo.

| Tipo     | Arquitetura | Tamanho (*byte*) | *Padding* (*byte*) | Total (*byte*) |
| :------- | :---------: | ---------------: | -----------------: | -------------: |
| `char`   | -           |                1 |                  3 |              4 |
| `int`    | -           |               16 |                  0 |             16 |
| `long`   | -           |               32 |                  0 |             32 |
| `float`  | -           |                4 |                  0 |              4 |
| `double` | -           |                8 |                  0 |              8 |
| `void *` | 32 *bits*   |                4 |                  0 |              4 |
| `void *` | 64 *bits*   |                8 |                  0 |              8 |

Simplificando bastante e considerando uma arquitetura de 32 *bits*, o *padding* é usado em estruturas no C para alinhar seus membros internos aos limites de endereço naturais, ou seja, fazendo com que os endereços na memória de cada membro seja um múltiplo de 4. O *padding* é adicionado por padrão pelo compilador do C, mas pode ser desativado.

::tip
[Esta pergunta](https://stackoverflow.com/q/4306186) no StackOverflow possui algumas explicações interessantes sobre como o *padding* e *packing* funcionam na linguagem C.
::

Tendo essas informações em mente, podemos implementar nossa própria instância de `Storable` para nosso tipo `AvDictionaryEntry`.

```haskell [src/FFmpeg.hs]
instance Storable AvDictionaryEntry where
  alignment _ = 8
  sizeOf _ = 16
  peek ptr = AvDictionaryEntry
    <$> peekByteOff ptr 0
    <*> peekByteOff ptr 8
  poke ptr (AvDictionaryEntry k v) = do
    pokeByteOff ptr 0 k
    pokeByteOff ptr 8 v
```

Explicando detalhadamente cada uma das funções de `Storable`, temos:

1. `alignment` deve retornar o alinhamento da estrutura. É representado como o mínimo múltiplo comum entre todos os alinhamentos de seus tipos internos. Como na arquitetura 64 *bits* temos que um ponteiro representa 8 *bytes*, e o nosso tipo contém duas variáveis do tipo ponteiro, temos `mmc(8, 8) = 8`.
2. `sizeOf` deve retornar o tamanho total em *bytes* ocupado pela estrutura. Como temos dois ponteiros, temos o total de 16 *bytes*.
3. `peek` é a função que fará a leitura dos dados do ponteiro `ptr` e irá criar a instância do tipo do Haskell. Para tal feito, podemos utilizar a função `peekByteOff`, onde também é necessário informar o *offset* inicial da leitura. Esse *offset* é calculado usando o tamanho do tipo anterior na estrutura e seu possível *padding* (como acontece em variáveis do tipo `char`).
4. `poke` é a função que irá escrever os dados no endereço de memória armazenado no ponteiro. De maneira similar ao `peek`, usamos a função `pokeByteOff` também passando o *offset* e seguindo a ordem da declaração do tipo.

Apesar da implementação de `Storable` para nosso tipo ser relativamente fácil e direta, ainda assim ela requer do programador um conhecimento prévio nos tipos do C para saber seus tamanhos, e ainda apresenta algumas dificuldades específicas como ter que lidar com o tamanho dos ponteiros caso esteja usando uma arquitetura diferente. Para evitar possíveis implementações erradas caso algum cálculo esteja incorreto, podemos utilizar a biblioteca `c-storable-deriving`.

Para utilizar tal biblioteca, faremos com que o nosso tipo derive os tipos `Generic` e `CStorable`.

```haskell [src/FFmpeg.hs]
data AvDictionaryEntry = AvDictionaryEntry
  { avDictKey :: CString
  , avDictValue :: CString
  }                               -- [!code --]
  } deriving (Generic, CStorable) -- [!code ++]
```

É necessário que nosso tipo seja totalmente compatível com `CStorable`, ou seja, os tipos internos precisam ter uma implementação de `Storable` também, por isso utilizamos os tipos do C `CString` no lugar de `String` do Haskell. Agora, podemos simplificar a implementação de `Storable` usando funções da biblioteca.

```haskell [src/FFmpeg.hs]
instance Storable AvDictionaryEntry where
  alignment _ = 8                       -- [!code --]
  alignment = cAlignment                -- [!code ++]
  sizeOf _ = 16                         -- [!code --]
  sizeOf = cSizeOf                      -- [!code ++]
  peek ptr = AvDictionaryEntry          -- [!code --]
    <$> peekByteOff ptr 0               -- [!code --]
    <*> peekByteOff ptr 8               -- [!code --]
  peek = cPeek                          -- [!code ++]
  poke ptr (AvDictionaryEntry k v) = do -- [!code --]
    pokeByteOff ptr 0 k                 -- [!code --]
    pokeByteOff ptr 8 v                 -- [!code --]
  poke = cPoke                          -- [!code ++]
```

As funções funcionam da exata mesma maneira da nossa implementação explicita anterior, mas será criada automaticamente em tempo de compilação, além de prevenir erros de cálculo e não mais depender do tamanho dos tipos do C.

::note
A documentação da biblioteca pode ser encontrada no [Hackage](https://hackage.haskell.org/package/c-storable-deriving-0.1.3/docs/Foreign-CStorable.html).
::

De modo similar, podemos agora definir o tipo que representará a `struct FfmpegInput`, já usando a implementação com a biblioteca `c-storable-deriving`.

```haskell [src/FFmpeg.hs]
data FfmpegInput = FfmpegInput
  { ffMetadata :: AvDictionary
  , ffFormat :: AvDictionary
  , ffStreamsMetadata :: Ptr AvDictionary
  , ffStreamsNb :: CInt
  , ffContext :: Ptr ()
  } deriving (Generic, CStorable)

instance Storable FfmpegInput where
  peek = cPeek
  poke = cPoke
  alignment = cAlignment
  sizeOf = cSizeOf
```

### Importando as funções externas do C

No nosso código em Haskell utilizaremos as duas funções expostas pela nossa biblioteca intermediária, bem como a `av_dict_get` para poder ler os valores nos dicionários.

```haskell [src/FFmpeg.hs]
foreign import capi "ffmpeg.h load_input"
  c_loadInput :: CString -> IO (Ptr FfmpegInput)

foreign import capi "ffmpeg.h &free_input"
  c_freeInput :: FunPtr (Ptr FfmpegInput -> IO ())

foreign import capi "libavutil/dict.h av_dict_get"
  c_avDictGet :: AvDictionary -> CString -> Ptr AvDictionaryEntry -> CInt -> IO (Ptr AvDictionaryEntry)

foreign import capi "libavutil/dict.h value AV_DICT_IGNORE_SUFFIX"
  c_avDictIgnoreSuffix :: CInt
```

Note que na declaração de tipos sempre utilizamos os tipos do C que vem de `Foreign.C.Types` para representar a diferença com os tipos do Haskell. Também são utilizados ponteiros para representar as funções exatamente como são declaradas no C.

Aqui cabe uma atenção especial a função `c_freeInput`. Ela é importada e declarada de uma maneira diferente das outras porque será utilizada em conjunto posteriormente com o tipo `ForeignPtr`. O Haskell é conhecido por ter um ótimo compilador e fazer um bom uso da memória, entretanto se tratando de ponteiros externos, a linguagem não tem como saber quando é necessário liberar a memória dessas estruturas, cabendo a nós liberarmos a memória manualmente. Porém, o Haskell nos disponibiliza o `ForeignPtr` justamente para essas situações: são ponteiros especiais que já liberam a memória automaticamente quando não há mais nenhum uso da variável, similar ao que acontece com classes que implementam o `Closeable` no Java.

A última importação, por sua vez, utiliza o modificador especial `value`, que permite que sejam importados valores no lugar de funções, sejam esses uma variável ou até mesmo uma constante definida com um macro `#define` no compilador do C.

### Criando funções auxiliares no Haskell

Para evitar ter que usar as funções importadas do C diretamente, podemos criar algumas funções auxiliares para evitar ter que ficar usando ponteiros de tipos primitivos nos outros módulos.

A primeira função que iremos criar é a `loadInput`, que será um *wrapper* ao redor de `c_loadInput` do C.

```haskell [src/FFmpeg.hs]
loadInput :: String -> IO (Maybe (ForeignPtr FfmpegInput))
loadInput file = do
  inputPtr <- withCString file $ \c_file -> c_loadInput c_file
  foreignPtr <- newForeignPtr c_freeInput inputPtr
  return $ if inputPtr == nullPtr then Nothing else Just foreignPtr
```

Observe que a partir de agora praticamente todas as operações estarão dentro do escopo de `IO`, visto que a maioria das funções de leitura e escrita de ponteiros opera neste escopo.

Como a função `c_loadInput` depende de uma `CString`, é necessário alocar uma. A biblioteca `Foreign` oferece uma função auxiliar chamada `withCString` que permite alocar uma `CString` temporária que será liberada da memória no fim de seu uso. Usando-a, podemos chamar a `c_loadInput` com o `file` convertido de `[Char]` do Haskell para `CString`.

Tendo um ponteiro comum, transformamos-o em um `ForeignPtr`, informando que a função `c_freeInput` que será usada quando a memória poder ser liberada. No fim, verificamos se a chamada retornou um ponteiro não-nulo, e se for o caso podemos tirar vantagem do `Maybe` para evitar ter que ficar fazendo comparações diretas com `nullPtr`, o equivalente do `NULL` do C.

A segunda função auxiliar que iremos criar é um *wrapper* ao redor de `c_avDictGet`.

```haskell [src/FFmpeg.hs]
dictGet :: AvDictionary -> Ptr AvDictionaryEntry -> IO (Ptr AvDictionaryEntry)
dictGet dict previous = withCString "" $ \c_str ->
  c_avDictGet dict c_str previous avDictIgnoreSuffix
```

De maneira similar a `loadInput`, utilizamos novamente a `withCString`.

A última função auxiliar faltando é a de conversão do tipo `AvDictionary` para um `Map String String` do Haskell, que permitirá um uso mais fácil dessa estrutura de dados. Essa função, chamada de `dictToMap`, será dividida em duas: a função simples e a recursiva. A simples será a "porta de entrada" que começará a recursividade.

No exemplo oficial do FFmpeg, para poder ler um `AVDictionary`, é necessário usar um `while`.

```c [examples/show_metadata.c]
const AVDictionaryEntry * tag = NULL;

while ((tag = av_dict_get(fmt_ctx->metadata, "", tag, AV_DICT_IGNORE_SUFFIX))) {
  printf("%s=%s\n", tag->key, tag->value);
}
```

Para simular este comportamento e iterar sobre todos os itens do dicionário no Haskell, será necessário usar o paradigma funcional e, portanto, utilizar recursão.

```haskell [src/FFmpeg.hs]
dictToMap' :: AvDictionary -> Map String String -> Ptr AvDictionaryEntry -> IO (Map String String)
dictToMap' dict mp tagPtr | tagPtr == nullPtr = pure mp
                          | otherwise         = nextCall
  where
    key = peek tagPtr >>= \t -> peekCString $ avDictKey t
    value = peek tagPtr >>= \t -> peekCString $ avDictValue t
    newMap = liftA2 (\k v -> Map.insert k v mp) key value
    nextTag = dictGet dict tagPtr
    nextCall = join $ liftA2 (dictToMap' dict) newMap nextTag
```

A ideia dessa função é ir iterando sobre todas as entradas no dicionário, adicionando-as num mapa até chegar na última entrada. Similar ao `while`, temos como condição de parada da recursão o ponteiro para a próxima entrada ser nulo, então é necessário comparar `tagPtr` com `nullPtr`.

Aqui começamos o uso das funções de leituras de ponteiros, utilizamos `peek` para poder ler o valor de `tagPtr`, que nos colocará no contexto de `IO`. Também é necessário, em seguida, utilizar a `peekCString` para ler o valor da `CString` tanto de `key` quando de `value`. No final, teremos ambos como `IO String`.

Como ambas as *strings* estão no contexto `IO`, precisamos chamar a função `Map.insert` dentro deste contexto. Para isso, podemos usar a função `liftA2` que permite fazer o *unbox* de duas variáveis no mesmo contexto, aplicar uma função com os valores internos e então retornar ao contexto anterior. No final, teremos um `IO (Map String String)`. Por baixo dos panos, a função `liftA2` está fazendo a mesma coisa do código abaixo.

```haskell
newMap = do
  k <- key
  v <- value
  return $ Map.insert k v
```

Agora podemos fazer a próxima chamada recursiva, mas como temos ambos o `newMap` e `nextTag` no contexto `IO`, precisamos usar o `join` em conjunto com o `liftA2` para poder acessar os valores de ambas para aí sim poder chamar a própria função novamente. O `join` neste caso irá extrair uma "camada" do `IO` do tipo, transformando um `IO (IO ())` em `IO ()`, por exemplo.

Com a recursividade pronta, podemos criar a função simples de entrada.

```haskell [src/FFmpeg.hs]
dictToMap :: AvDictionary -> IO (Map String String)
dictToMap dict = do
  firstTag <- dictGet dict nullPtr
  dictToMap' dict Map.empty firstTag
```

Nesta função, precisamos obter a primeira entrada para iniciar a recursividade corretamente, caso contrário, estaríamos passando um `nullPtr` diretamente e a recursão nem iria começar. Agora com esta função, podemos converter um `AvDictionary` para `Map String String`, permitindo um acesso mais fácil no nosso código Haskell.

A última função que iremos criar neste módulo é a responsável por enfim imprimir os metadados. Ela será chamada no módulo `Main` posteriormente. Para deixar a saída no terminal um pouco mais bonita, duas funções são usadas: `prettyTitle` e `prettyTitle`. O código dessas duas funções se encontra no módulo `PrettyPrint` e está disponível no repositório do GitHub deste tutorial. Para fins de simplificação, optei por não incluir a implementação aqui, mas o importante de saber sobre elas é que, como o nome sugere, uma irá imprimir um título de modo "bonito" e o outro imprimirá todas as entradas do `Map String String` de modo "bonito" também.

A lógica dessa função segue o seguinte algoritmo:

1. Obter o nome do arquivo da linha de comando;
2. Ler o arquivo usando o FFmpeg;
3. Obter os metadados do arquivo e do formato;
4. Imprimir ambos de formato "bonito".

```haskell [src/FFmpeg.hs]
printMetadata :: String -> IO ()
printMetadata fileName = do
  inputPtr' <- loadInput fileName
  let inputForeignPtr = fromJust inputPtr'

  withForeignPtr inputForeignPtr $ \inputPtr -> do
    input <- peek inputPtr  
    metadata <- dictToMap $ ffMetadata input
    formatMetadata <- dictToMap $ ffFormat input

    let nbStreams = fromIntegral . toInteger $ ffStreamsNb input
        streamsMetadataPtr = ffStreamsMetadata input

    streamsMetadata <- peekArray nbStreams streamsMetadataPtr

    prettyTitle "File metadata"
    prettyPrint metadata
    putStrLn ""

    prettyTitle "Format metadata"
    prettyPrint formatMetadata
    putStrLn ""

    forM_ (zip [0..nbStreams-1] streamsMetadata) $ \(i, sMetadataPtr) -> do
      sMetadata <- dictToMap sMetadataPtr

      prettyTitle $ "Stream #" ++ show i
      prettyPrint sMetadata
      putStrLn ""
```

Para fazer aproveitar da vantagem do `ForeignPtr`, utilizamos a função `withForeignPtr`, que nos permite ter acesso a um ponteiro `Ptr` comum, o qual podemos acessar e/ou modificar seus conteúdos. Toda a lógica que acessa os dados do nosso tipo `FFmpegInput` é feita dentro dessa função anônima que é passada para a função.

Para iterar no vetor de ponteiros que representa o vetor dos dicionários das *streams*, precisamos primeiramente converter o tipo `Ptr [AvDictionary]` (que é igual a `Ptr [Ptr ()]`) para uma lista do Haskell, para poder iterar posteriormente, obtendo um `[AvDictionary]`. Tendo esta lista de ponteiros, podemos iterar usando o `forM_`, assim imprimindo os metadados de cada *stream*.

Por conta das funções auxiliares no módulo `FFmpeg`, nosso código ficou muito mais legível e fácil de entender mesmo para quem não tem tanta familiaridade com as minúcias do C.

### Criando o arquivo principal

Com o módulo `FFmpeg` pronto, podemos finalmente editar o nosso arquivo `Main.hs`. Iremos ler o caminho do arquivo da linha do comando do usuário.

```haskell [src/Main.hs]
module Main (main) where

import System.Environment
import FFmpeg
import Vlc

main :: IO ()
main = do
  args <- getArgs

  let fileName = head args
  printMetadata fileName
```

A implementação é bem direta ao ponto, obtemos os argumentos da linha de comando assumindo que o primeiro deles é um caminho válido para um arquivo existente. Tendo este caminho, basta utilizá-lo na chamada da função `printMetadata`. Note que por conta das funções auxiliares do módulo `FFmpeg`, não precisamos interagir com nada relacionado a linguagem C no módulo `Main`.

### Compilando e executando

Com nosso código pronto, podemos compilar e executar de maneira similar ao primeiro exemplo.

```console
$ stack build
$ LD_LIBRARY_PATH=./libs stack exec c-interop big_buck_bunny.mp4
```

Ao observar a saída, vemos que o texto no terminal está colorido e também está seguindo a sintaxe de arquivos `.ini`, como pode-se observar abaixo na íntegra. O arquivo testado é o curta "Big Buck Bunny" da Blender Foundation, na versão "Sunflower", disponível [neste link](https://download.blender.org/demo/movies/BBB/bbb_sunflower_1080p_30fps_normal.mp4.zip) para *download* gratuito no site oficial.

```ini
[File metadata]
artist = Blender Foundation 2008, Janus Bager Kristensen 2013
bit_rate = 3481058 bit/s
comment = Creative Commons Attribution 3.0 - http://bbb3d.renderfarming.net
compatible_brands = isomavc1
composer = Sacha Goedegebure
creation_time = 2013-12-16T17:44:39.000000Z
duration = 0:10:34.600000
genre = Animation
major_brand = isom
minor_version = 1
streams_nb = 3
title = Big Buck Bunny, Sunflower version

[Format metadata]
extensions = mov,mp4,m4a,3gp,3g2,mj2,psp,m4b,ism,ismv,isma,f4v,avif
long_name = QuickTime / MOV
name = mov,mp4,m4a,3gp,3g2,mj2

[Stream #0]
codec_long_name = H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10
codec_name = h264
codec_tag_string = avc1
creation_time = 2013-12-16T17:44:39.000000Z
duration = 0:10:34.533333
frame_rate = 30/1
handler_name = GPAC ISO Video Handler
language = und
resolution = 1920 x 1080
start_time = 0:00:00.066667
time_base = 1/30000
type = video
vendor_id = [0][0][0][0]

[Stream #1]
channels = 2
codec_long_name = MP3 (MPEG audio layer 3)
codec_name = mp3
codec_tag_string = mp4a
creation_time = 2013-12-16T17:44:42.000000Z
duration = 0:10:34.200000
frame_rate = 0/0
handler_name = GPAC ISO Audio Handler
language = und
sample_rate = 48000 Hz
start_time = 0:00:00.000000
time_base = 1/48000
type = audio
vendor_id = [0][0][0][0]

[Stream #2]
channels = 6
codec_long_name = ATSC A/52A (AC-3)
codec_name = ac3
codec_tag_string = ac-3
creation_time = 2013-12-16T17:44:42.000000Z
duration = 0:10:34.144000
frame_rate = 0/0
handler_name = GPAC ISO Audio Handler
language = und
sample_rate = 48000 Hz
start_time = 0:00:00.000000
time_base = 1/48000
type = audio
vendor_id = [0][0][0][0]
```

O arquivo de entrada é lido corretamente e a saída é o esperado: é identificado que o vídeo é do formato `mp4` e as informações do formato são apresentadas, bem como alguns metadados interessantes como `artist` e `genre`. Também são impressos os metadados individuais de cada *stream* no arquivo, que neste caso possui um vídeo e duas trilhas de áudio.

## Reproduzindo o arquivo com a biblioteca do VLC

Para complementar o exemplo anterior, podemos usar a `libvlc` para reproduzir o começo do arquivo em uma janela separada após exibir os metadados. Este exemplo é mais simples visto que não é necessário usar nenhuma conversão de tipos entre as linguagens, e podemos usar a `libvlc` diretamente no código em Haskell com as importações corretas.

É necessário ter a `libvlc` instalada no sistema. Em distribuições como o Ubuntu, pode-se instalar usando o `apt`.

```console
$ sudo apt install libvlc-dev
```

Este exemplo é baseado no código de exemplo oficial, disponível [neste link](https://wiki.videolan.org/LibVLC_Tutorial/#Sample_libVLC_code).

### Adicionando as *flags* de compilação

É necessário adicionar a *flag* `-lvlc` no arquivo Cabal do projeto.

```cabal [c-interop.cabal]
ghc-options: -- Demais flags omitidas
             -lvlc -- [!code ++]
```

### Criando o módulo

Como no exemplo do FFmpeg, vamos criar um módulo `Vlc` que fará as importações das funções de `vlc/vlc.h` para usarmos.

```haskell [src/Vlc.hs]
module Vlc where

import Control.Concurrent (threadDelay)
import Foreign
import Foreign.C.Types
import Foreign.C.String
import Foreign.C.ConstPtr

-- Cria uma nova instância do VLC
foreign import capi "vlc/vlc.h libvlc_new" c_vlcNew :: CInt -> Ptr (ConstPtr CString) -> IO (Ptr ())
-- Cria uma mídia a partir de um caminho
foreign import capi "vlc/vlc.h libvlc_media_new_path" c_vlcMediaNewPath
  :: Ptr () -> CString -> IO (Ptr ())
-- Cria uma instância de um player a partir de uma mídia
foreign import capi "vlc/vlc.h libvlc_media_player_new_from_media" c_vlcMediaPlayerNewFromMedia
  :: Ptr () -> IO (Ptr ())

-- Reproduz o arquivo no player
foreign import capi "vlc/vlc.h libvlc_media_player_play" c_vlcMediaPlayerPlay
  :: Ptr () -> IO ()
-- Pausa a reprodução do arquivo no player
foreign import capi "vlc/vlc.h libvlc_media_player_stop" c_vlcMediaPlayerStop
  :: Ptr () -> IO ()

-- Libera da memória a mídia
foreign import capi "vlc/vlc.h &libvlc_media_release" c_vlcMediaRelease
  :: FunPtr (Ptr () -> IO ())
-- Libera da memória o player
foreign import capi "vlc/vlc.h &libvlc_media_player_release" c_vlcMediaPlayerRelease
  :: FunPtr (Ptr () -> IO ())
-- Libera da memória a instância do VLC
foreign import capi "vlc/vlc.h &libvlc_release" c_vlcRelease
  :: FunPtr (Ptr () -> IO ())
```

Note que iremos apenas utilizar funções já disponíveis na biblioteca do VLC, e que também não precisaremos lidar com dados visto que a biblioteca utiliza *structs* vazias. O importante vai ser trabalhar com os ponteiros para `void`.

### Criando as funções auxiliares

O módulo `Vlc` fará um uso maior de `ForeignPtr` por conta de ter 3 ponteiros diferentes para utilizar e liberar da memória. Para facilitar o uso, é mais fácil criar funções auxiliares que usam tipos do Haskell em sua maioria para chamar internamente as funções do C, um conceito também conhecido como *binding*.

```haskell [src/Vlc.hs]
vlcNew :: CInt -> Ptr (ConstPtr CString) -> IO (ForeignPtr ())
vlcNew argc argv = c_vlcNew argc argv >>= newForeignPtr c_vlcRelease

vlcMediaNewPath :: ForeignPtr () -> String -> IO (ForeignPtr ())
vlcMediaNewPath inst file = 
  withForeignPtr inst (withCString file . c_vlcMediaNewPath) 
    >>= newForeignPtr c_vlcMediaRelease

vlcMediaPlayerNewFromMedia :: ForeignPtr () -> IO (ForeignPtr ())
vlcMediaPlayerNewFromMedia media = 
  withForeignPtr media c_vlcMediaPlayerNewFromMedia 
    >>= newForeignPtr c_vlcMediaPlayerRelease

vlcMediaPlayerPlay :: ForeignPtr () -> IO ()
vlcMediaPlayerPlay player = withForeignPtr player c_vlcMediaPlayerPlay

vlcMediaPlayerStop :: ForeignPtr () -> IO ()
vlcMediaPlayerStop player = withForeignPtr player c_vlcMediaPlayerStop
```

Assim como no módulo `FFmpeg`, utilizaremos as funções `withForeignPtr` para ter acesso a um ponteiro comum e `newForeignPtr` para transformar os ponteiros comuns resultantes das chamadas das funções do C para um ponteiro externo.

### Criando a função de reprodução no Haskell

Nosso módulo `Vlc` terá apenas uma função em Haskell, a responsável por reproduzir o arquivo por um certo tempo e então liberar as instâncias da memória.

```haskell [src/Vlc.hs]
playFile :: String -> IO ()
playFile fileName = do
  inst <- vlcNew 0 nullPtr
  m <- vlcMediaNewPath inst fileName
  mp <- vlcMediaPlayerNewFromMedia m

  vlcMediaPlayerPlay mp
  threadDelay $ 10 * 1000000
  vlcMediaPlayerStop mp

  return ()
```

Note que o código é bem semelhante a estrutura do exemplo em C, com excessão que não precisamos nos preocupar com o gerenciamento e liberação da memória dos ponteiros. As mesmas funções são chamadas e na mesma ordem, com pequenas diferenças entre as linguagens tais como o uso de `threadDelay` no lugar do `sleep` do C.

### Usando o módulo no módulo principal

Agora podemos chamar a função `playFile` logo em seguida da impressão dos metadados.

```haskell [src/Main.hs]
main :: IO ()
main = do
  args <- getArgs
  
  let fileName = head args
  printMetadata fileName
  playFile fileName -- [!code ++]
```

Basta adicionar a chamada de `playFile` logo após a impressão dos metadados.

### Compilando e executando

Usaremos os mesmos comandos do `stack` para compilar e executar.

```console
$ stack build
$ LD_LIBRARY_PATH=./libs stack exec c-interop big_buck_bunny.mp4
```

Ao executar, pode-se observar que uma janela gráfica com o vídeo é aberta e a reprodução começa imediatamente. Após 10 segundos, o vídeo é fechado e encerrado.

::large-figure
![Janela do VLC](./posts/2024/2024-05-08-interagindo-com-bibliotecas-em-c-usando-codigo-em-haskell/vlc-screenshot.png)

#caption
Trecho do curta ["Big Buck Bunny"](https://www.youtube.com/watch?v=aqz-KE-bpKQ) da Blender Foundation na janela do VLC.
::

## Conclusão

Utilizar a interoperabilidade pode ser vantajoso em casos onde é necessário performance ou se deseja utilizar uma biblioteca em código nativo já compilada e/ou disponível no sistema operacional. Através dos recursos do Haskell, torna-se fácil ter o acesso a tais funções e dados retornados visto que a linguagem já possui tal recurso implementado em seu núcleo. Apesar do código necessitar em casos mais avançados de um conhecimento intermediário em gerenciamento de memória em C, ainda assim é possível para usuários mais leigos fazer uso de funções mais simples para criar um conhecimento mais aprofundado posteriormente.

## Bibliografia

- WIKIPÉDIA. *"Language interoperability"*. Wikipédia, disponível [neste link](https://en.wikipedia.org/wiki/Language_interoperability).
- O'SULLIVAN, Bryan et al. *"Interfacing with C: the FFI"*. Real World Haskell, disponível [neste link](https://book.realworldhaskell.org/read/interfacing-with-c-the-ffi.html).
- HASKELL. *Foreign Function Interface*. Haskell Wiki, disponível [neste link](https://wiki.haskell.org/Foreign_Function_Interface).
- MOREIRA, Leandro. *FFmpeg libavformat tutorial*. GitHub, disponível [neste link](https://github.com/leandromoreira/ffmpeg-libav-tutorial).
- VLC. *LibVLC Tutorial*. VLC Wiki, disponível [neste link](https://wiki.videolan.org/LibVLC_Tutorial).
- UFABC. *Grupo de estudos em Haskell da UFABC*. Pesquisa UFABC, disponível [neste link](https://haskell.pesquisa.ufabc.edu.br).
