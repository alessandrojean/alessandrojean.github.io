---
layout: post
title: 'Utilizando o Karaoke Templater'
description: 'Criando e aplicando um simples template'
main_category: karaoke
cover: 'https://i1.wp.com/www.kawaiikakkoiisugoi.com/wp-content/uploads/2015/12/kkwQb.jpg'
cover_caption: Kawaita kokoro de kakenukeru...

tags:
  - aegisub
  - fansubbing

categories:
  - "Karaokê no Aegisub"

download:
  - file: '/scripts/tutorial-1-karaoke-templater-karaoke-only.ass'
    title: 'Legenda'
  - file: '/scripts/tutorial-1-karaoke-templater-finished.ass'
    title: 'Legenda + template'
  - file: '/scripts/fonts.zip'
    title: 'Fontes'
---

<div class="notification">
  <p>
    O artigo é, em sua grande parte, uma tradução
    direta com algumas adaptações dos tutoriais
    oficiais de <em>Karaoke Templater</em> do
    Aegisub. Os <em>links</em> para os tutoriais
    originais estão disponíveis na bibliografia
    localizada ao fim do artigo.
  </p>
</div>

## Breve introdução

Até agora, sincronizamos as sílabas da música e aplicamos efeitos
básicos sobre ela, utilizando a tag `\k`. Neste tutorial, iremos
utilizar o *Karaoke Templater*, que nos permitirá criar efeitos
mais avançados utilizando outras *tags* de sobreposição que o
formato *Advanced Substantion Alpha* possui.

O *Karaoke Templater* é um *script* de automação incluso no
Aegisub. Seu objetivo principal é ajudar a criar efeitos
de karaokê com uma linguagem própria de *templates*.
O *Karaoke Templater* vem instalado e pronto para o uso
com as versões mais recentes do Aegisub.

Como todos os tutoriais anteriores, utilizaremos a mesma
abertura de Steins;Gate 0, que você pode baixar do
vídeo disponível abaixo ou cortar de algum episódio
anteriormente baixado.

<figure class="grid-ml">
  <div class="video-container-16by9">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/1xJbdY9B3A8" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
  </div>
  <figcaption>
    Abertura de Steins;Gate 0, base para o karaokê.
  </figcaption>
</figure>

## Automação

Antes de entendermos o *Karaoke Templater* completamente,
é importante entender o conceito de Automação que o Aegisub
possui. É interessante que você possua algum conhecimento,
mesmo que básico, em alguma linguagem de programação.

O único propósito da automação é, como o nome implica,
automatizar vários aspectos da criação e edição de legendas.
Originalmente, essa habilidade foi criada principalmente para
criar efeitos de karaokê, mas com o tempo foi expandida em
seu escôpo para suportar macros com propósitos mais gerais que,
quase sempre, adicionam novas funcionalidades ao Aegisub.

Alguns objetivos da automação:
- Macros para automatizar tarefas complexas de edição de legendas.
- Filtros de exportação para gerar efeitos complexos a partir
  de uma entrada simples.
  - Efeitos de karaokê.
  - Caixas de notas de tradução.
- E muitos outros usos ainda não explorados.

## Utilizando a automação

O Aegisub vem com vários *scripts* de automação já empacotados
e prontos para o uso. Isso inclui o *script* do *Karaoke
Templater* e uma coleção de macros para simplificar algumas
tarefas de edição.

Com o tempo, vários *scripts* são carregados após a inicialização
do programa. Você pode ver quais foram carregados e carregar/
descarregar mais através do Gerenciador de Automação,
disponível no menu Automation -> Automação.

Todos os *scripts* de automação também aparecem no Aegisub
de uma maneira ou de outra. Alguns aparecem como macros
no menu Automation e outros aparecem como filtros na parte
de exportação. Alguns *scripts* podem até aparecer nos
dois lugares.

## Automação para programadores

O Aegisub utiliza o [LuaJIT 2.0] complicado com a versão
5.2 da linguagem [Lua]. O [MoonScript] é nativamente suportado,
tanto que algumas partes das bibliotecas do Aegisub são
escritas com ele.

Existem vários *scripts* de exemplos inclusos no Aegisub para lhe
dar um começo para escrever seus próprios. A não ser que você
seja um programador experiente, o *script* `kara-templater.lua`
é um péssimo lugar para começar.

[LuaJIT 2.0]: http://luajit.org/
[Lua]: http://www.lua.org/manual/5.2/
[MoonScript]: http://www.moonscript.org/

## Localizando o *Karaoke Templater*

Você pode executar o *Karaoke Templater* de duas maneiras.
Por enquanto, concentraremos em apenas uma destas.

Se você olhar as opções do menu Automation do Aegisub,
deverá ver uma opção chamada Apply karaoke template,
mesmo que esteja desabilitada. Esta opção é a que
será usada para aplicar os *templates* que você
criará. Neste momento, está desabilitada pois você
não criou nenhum *template* ainda.

Sempre que você efetuar alguma modificação em seus
*templates*, você terá que executar o *Karaoke Templater*
novamente, para que ele possa processar suas modificações
e recriar os efeitos novamente.

## Criando um efeito simples

<div class="notification is-border-info">
  <p>
    Para uma visualização mais clara e para fins didáticos,
    todas as tags <code>\t</code> foram separadas em
    blocos, cada uma em uma linha própria. A área de
    edição do Aegisub não permite que você quebre linhas,
    mas você pode manter os blocos separados para uma melhor
    visualização lá também.
  </p>
  <p>
    Quando você copiar algum código e colar na área de edição,
    o Aegisub substituirá as quebras de linha por <code>\N</code>.
    É importante que você apague estas <em>tags</em> para o
    correto funcionamento dos <em>templates</em>.
  </p>
</div>

Para continuarmos, iremos utilizar as linhas de *romaji*
e de *kanji* que já tiveram suas sílabas sincronizadas
completamente. Se você preferir, pode baixar o arquivo
de legendas já sincronizado [aqui]. É interessante que
você também trabalhe com um vídeo e seu respectivo
áudio carregados no programa. Agora que tudo está 
pré-configurado, podemos começar a criar o *template* 
em si. Primeiro será criado um efeito, com os passos 
abaixo, e logo o funcionamento de cada parte será
explicado com detalhes.

Primeiramente, devemos inserir uma linha em branco antes
da primeira linha da letra da música. É uma convenção
comum que os usuários adotaram na qual todos os 
*templates* ficam nas primeiras linhas da legenda, logo
ao topo. Esta linha criada se tornará a linha de
*template* do karaokê. É importante se certificar 
para que esta linha possua o mesmo estilo das linhas 
que contém a letra. Caso contrário, o efeito pode ser 
aplicado em linhas erradas.

Como esta linha conterá códigos, não queremos que
ela apareça como uma legenda comum para todos verem
durante o vídeo, certo? Então devemos comentá-la
para que isso não aconteça. O Aegisub só reconhece
linhas comentadas como possíveis *templates*.

Para indicar que esta linha é de fato um *template*,
precisamos explicitar ao Aegisub. Isto é feito através
do campo de efeito. Essa indicação possui várias
variações que podem ser consultadas na documentação
do Aegisub, mas inicialmente, utilizaremos uma bem simples,
a `template line`.

Agora é a hora mais esperada, a de exercitar a criatividade
e escrever um template. A escrita de um template é feita
através de *tags*, e é escrita no mesmo campo do texto
da linha. Vamos utilizar um simples inicialmente:

```ass
{\r\t($start, $mid, \fscx120)}
{\t($mid, $end, \fscy100)}
```

Agora olhe novamente o menu Automation. Se você criou
corretamente a linha de *template*, a opção
*Apply karaoke template* agora estará disponível.
Selecione-a e observe o *Karaoke Templater* fazer seu
trabalho através da barra de progresso. Você pode
conferir o resultado abaixo:

<figure class="grid-ml">
  <div class="video-player"
       data-source="{{ site.baseurl }}/scripts/karaoke-templater/tutorial-1-karaoke-templater.mp4"
       data-poster="{{ site.baseurl }}/scripts/karaoke-templater/tutorial-1-karaoke-templater.png"
       data-width="550" data-height="80"></div>
  <figcaption>
    As silabas aumentam em torno do eixo y quando tem destaque.
  </figcaption>
</figure>

Note que a linha de *template* ficou intocada e as
linhas com as sílabas sincronizadas foram comentadas
e possuem o valor de `karaoke` em seu campo
de efeito. O *Karaoke Templater* preserva suas linhas
com as sílabas sincronizadas, permitindo que você
possa aplicar vários efeitos, utilizando as mesmas linhas.

## Melhorando um pouco mais o efeito

Desta vez, vamos fazer algo mais interessante,
vamos fazer com que além da sílaba aumentar em torno
de seu eixo *y*, que ela mude seu preenchimento
do padrão, atualmente branco, para um preenchimento
com a cor preta.

```ass
{\r\t($start, $end, \1c&H000000&)}
{\t($start, $mid, \fscy120)}
{\t($mid, $end, \fscy100)}
```

Com isto, obtemos um resultado um pouco mais aprimorado
em relação ao primeiro, onde a sílaba agora tem
um destaque mais apropriado e perceptível.

<figure class="grid-ml">
  <div class="video-player"
       data-source="{{ site.baseurl }}/scripts/karaoke-templater/tutorial-1-karaoke-templater-2.mp4"
       data-poster="{{ site.baseurl }}/scripts/karaoke-templater/tutorial-1-karaoke-templater-2.png"
       data-width="550" data-height="80"></div>
  <figcaption>
    As silabas aumentam em torno do eixo y e mudam de cor quando tem destaque.
  </figcaption>
</figure>

## Entendendo o *template*

Vamos entender o que está acontecendo, como este *template* foi aplicado
no tempo correto nas sílabas e como ele funciona?

O funcionamento do *Karaoke Templater* é muito simples, em termos
bem resumidos o que ele faz é interpretar seu código para cada
sílaba nas linhas do mesmo estilo, ou seja, para cada *tag*
`\k` que a linha possui, e inserir esse código interpretado
onde as *tags* `\k` originalmente ficavam.

Neste caso, estamos usando um *template* simples, que é
o estilo de linha, o `template line`, então as sílabas
ainda serão mantidas na mesma linha. A este ponto, você
deve estar se perguntando o porquê de quando uma sílaba
aumenta de tamanho, as outras são deslocadas para baixo.
É exatamente por usarmos um *template* de linhas que isto
acontece, pois todas as sílabas estão contidas em uma
única linha, logo, se aumentamos alguma, as outras
vão se deslocar por estarem no mesmo invólucro.

Os templates possuem uma propriedade legal, são
as variáveis de execução. Todas sempre começam
com um sifrão, como a `$start`, `$end` e `$mid`
que utilizamos. Existem inúmeras variáveis
para cada classe de *template*. Vamos entender
o que cada uma, neste contexto, guarda:

- A `$start` é o tempo de início, em milisegundos,
  de cada sílaba. O tempo é contado desde o início
  da linha que ela está, portanto é utilizável
  em *tags* como `\t`, `\move` e `\fad`, por exemplo.
- Semelhantemente, a `$end` é o tempo do fim de
  cada sílaba, que também está em milisegundos.
- A `$mid` é o tempo exatamente do meio do tempo
  de destaque, ou seja, equivale a `($end - $start) / 2`.
  Por se tratar de tempo, também é representada em
  milisegundos.

## O Poder da Matemática

Podemos ir mais além, podemos utilizar estas
variáveis que nos são fornecidas em expressões
matemáticas! Vamos testar na prática fazendo
um efeito de *fade-out* em cada sílaba após
o seu destaque, mas não durante. Então precisamos
fazer com que o *fade* comece em `$end` e termine
em `$end + 200`, supondo que queremos fazer o
efeito durante 200ms. Então vamos modificar
o *template* para tal:

```ass
{\r\t($start, $end, \1c&H000000&)}
{\t($start, $mid, \fscy120)}
{\t($mid, $end, \fscy100)}
{\t($end, !$end + 200!, \alpha&HFF&)}
```

Quando queremos fazer alguma expressão matemática,
precisamos colocá-la entre um par de exclamações,
como fizemos em `!$end + 200!`, na última linha.
O *Karaoke Templater* então realizará a conta e
colocará o resultado no lugar na linha resultado.

Você também pode estar se perguntando porque não
apenas colocar um `\fad(0, 200)` no lugar. Bem,
lembre-se que estamos utilizando um *template*
da classe de linha, portanto se colocássemos
a *tag* `\fad`, faríamos a linha inteira
ter o efeito. Portanto, precisamos aplicar
o efeito somente a sílaba, e isto pode ser feito
animando a *tag* `\alpha`, que controla a opacidade.

<figure class="grid-ml">
  <div class="video-player"
       data-source="{{ site.baseurl }}/scripts/karaoke-templater/tutorial-1-karaoke-templater-3.mp4"
       data-poster="{{ site.baseurl }}/scripts/karaoke-templater/tutorial-1-karaoke-templater-3.png"
       data-width="550" data-height="80"></div>
  <figcaption>
    <p>As silabas possuem um efeito de <em>fade-out</em> após o destaque.</p>
  </figcaption>
</figure>

## Melhorando o efeito de crescimento

Talvez você pode pensar que o efeito de destaque esteja um 
pouco estranho, já que o crescimento para bem no meio do 
período de destaque. Talvez ele pode ser melhorado se 
estivesse em sua altura máxima antes, e mais tempo 
fosse usado para diminuir para a altura normal. 
Agora, com expressões matemáticas, isso pode ser feito.

```ass
{\r\t($start, $end, \1c&H000000&)}
{\t($start, !$start + $dur * 0.3!, \fscy120)}
{\t(!$start + $dur * 0.3!, $end, \fscy100)}
```

Com este *template*, a parte no destaque do
crescimento no eixo *y* durará apenas
três décimos da duração da sílaba, e o efeito
de diminuir o resto do tempo, ou seja, sete décimos.
Aqui é utilizada uma nova variável, a `$dur`.
Ela representa a duração da sílaba em milisegundos.
Similarmente, existe também a `$kdur`, que é em
centisegundos. É importante ficar atento com as
unidades para os cálculos saírem corretos.

Note que o efeito de *fade-out* foi removido, pois
era mais para fins didáticos. Geralmente, na minha
visão, não é uma boa prática fazer a sílaba que já teve
seu destaque sumir, pois dá uma impressão
que a linha está "incompleta", mas fica a seu critério
se quiser adicionar novamente.

## Bibliografia

- Aegisub. *[Automation]*.
- Aegisub. *[Karaoke Templater Tutorial 1]*.
- Aegisub. *[Karaoke Templater Tutorial 2]*.

[Automation]: http://docs.aegisub.org/manual/Automation
[Karaoke Templater Tutorial 1]: http://docs.aegisub.org/manual/Karaoke_Templater_Tutorial_1
[Karaoke Templater Tutorial 2]: http://docs.aegisub.org/manual/Karaoke_Templater_Tutorial_2
