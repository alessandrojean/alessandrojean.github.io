---
layout: post
title: "Lendo mangás no Kindle"
description: "Um pequeno guia de como converter e ler os mangás da maneira correta no Kindle."
date: 2019-06-20 22:56:03
main_category: kindle

tags:
  - kindle
  - mangás
---

*Recentemente eu adquiri um Kindle e, como uma pessoa que gosta de ler mangás,
claro que não poderia deixar de utilizá-lo para lê-los.*

<figure>
  <div class="figure-row is-spaced">
    <img src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img16.jpg">
    <img src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img17.jpg">
  </div>
  <figcaption>
    Leitura do mangá <em>Strobe Edge</em> no Kindle.
  </figcaption>
</figure>

O Kindle (infelizmente) não suporta a leitura direta dos mangás nos formatos
em que costumamos baixar: `zip`, `rar` etc. Para isto, precisamos realizar
algum processo de conversão do mangá para algum formato que o Kindle entenda.
Note que eu disse "algum", pois existem diversas maneiras.

A maneira mais simples que talvez você possa ter imaginado ou atualmente
faça é simplesmente jogar o arquivo baixado, talvez renomeado para `cbz`
ou `cbr`, diretamente no Calibre, fazendo com que ele já faça o trabalho
pesado da conversão e sincronização.

No entanto, esta talvez não seja a melhor maneira. E definitivamente não
é se você é chato e gosta de customizar os metadados e deixar tudo 
organizadinho e bonitinho, como eu sou. Por causa disso, eu consegui
chegar numa espécie de *workflow* que eu sempre acabo seguindo quando
quero converter meus mangás.

## Obtendo a fonte

Não é o escopo deste guia te ensinar a baixar ou mostrar sites que você
pode baixar o mangá, mas com certeza se você procurar bem no *tapa-olho*
você consegue achar com uma certa facilidade. Só mantenha em mente que
o que você precisa é o `zip` ou `rar` do volume todo ou cada capítulo
baixado separadamente.

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img01.png"
   description="Arquivos obtidos via <em>tapa-olho</em>." %}

Assim que você tiver baixado, extraia cada arquivo compactado em sua
respectiva pasta, gerando então ao fim uma pasta pra cada volume onde
subsequentemente cada pasta do volume terá outras pastas dentro com
os capítulos.

## Arrumando o mangá

Um problema frequente que acaba acontecendo em muitos arquivos é que
as vezes o *scanlator* nomeia os arquivos de cada capítulo sem o
zero a esquerda, ou seja, as páginas vem com a numeração `1`, `2`
nas páginas antes do `10`. Acaba que, como os gerenciadores de arquivo
leem os arquivos ordenando pela [ordem lexicográfica] em relação ao nome,
acontecerá que as páginas ficarão no fim na ordem `1`, `11`, `12` etc.

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img02.png"
   description="Note como a ordem das páginas está errada." %}

Para resolver isso, é necessário renomear cada um desses arquivos que
não tem o zero a esquerda para que eles passem a incluir. Pode ser
trabalhoso fazer isso manualmente para cada capítulo que precisar,
então é interessante utilizar alguma ferramenta de renomeação em massa.

Se você utiliza o Windows, recomendo dar uma olhada no [Bulk Rename].
Caso use Linux, pode-se utilizar o [perl-rename] para renomear os
arquivos em massa que seguem um padrão através de [expressões regulares].
Por exemplo, neste caso, bastaria fazer:

```bash
# Removendo o nome do scanlator (opcional).
perl-rename 's/\[Toshi wa Yume\](.*)/$1/g' *.jpg
# Adicionando o zero a esquerda.
perl-rename 's/(.*) \((\d{1})\).*/$1 (0$2).jpg/g' *.jpg
```

Caso você esteja meio em dúvida de qual será o resultado do comando,
pode-se adicionar o parâmetro `-n` para apenas simular o que acontecerá
com os arquivos, mostrando os novos nomes deles.

É bem importante seguir esta etapa, pois caso contrário, como o programinha
que utilizaremos posteriormente utiliza justamente a ordenação por ordem 
lexicográfica, as páginas irão ficar na ordem errada no resultado final.

[ordem lexicográfica]: https://pt.wikipedia.org/wiki/Ordem_lexicogr%C3%A1fica
[expressões regulares]: https://pt.wikipedia.org/wiki/Express%C3%A3o_regular
[Bulk Rename]: https://www.bulkrenameutility.co.uk/Main_Intro.php
[perl-rename]: https://www.archlinux.org/packages/community/any/perl-rename/

## Renomeando o índice

Agora precisamos renomear as pastas de cada capítulo, pois o nome destas
será o que irá aparecer no índice do volume quando este estiver no Kindle.
Similarmente, basta renomear em massa.

```bash
perl-rename -n 's/\[Toshi wa Yume\] .*_cap(\d{2})/Capítulo $1/g' *
```

Quando convertemos o volume, estes serão os nomes dos capítulos.
Aqui você pode deixar da maneira que quiser, inclusive se quiser
colocar os títulos dos capítulos, esta é a hora.

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img03.png"
   description="Nomes dos capítulos após renomear." %}

Convenhamos, bem melhor do que estava antes, não?

## Adicionando a capa

O *programinha* utiliza a primeira imagem de todas que ele encontrar
dentro do volume como a capa que aparecerá na biblioteca do Kindle.
Portanto, precisamos agora baixar a imagem que desejamos utilizar
como a capa e renomeá-la de modo que ela fique como a primeira de
todos.

Eu pessoalmente gosto de utilizar as capas em inglês, quando os
volumes foram lançados nos EUA ou Reino Unido. Neste caso, estou
convertendo alguns volumes de [Strobe Edge], que foi lançado lá.
Uma boa fonte para obter as imagens das capas em alta qualidade
(na maioria das vezes) é a Amazon.

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img04.png"
   description="Página de <em>Strobe Edge</em> vol. 01 na Amazon americana." %}

O truque aqui é clicar na imagem na *thumbnail* para que a janela
com a imagem em maior resolução abra. Assim, basta salvar a imagem
na pasta do primeiro capítulo do volume e renomeá-la para que esta 
fique em primeira posição da ordem lexicográfica.

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img05.png"
   description="Salve na pasta do primeiro capítulo do volume." %}
{:.without-shadow}

Neste caso, todos os arquivos da pasta começavam com a letra `S`,
além do de `Créditos`. Então, utilizar o nome `Cover` no arquivo
da capa fará com que ele seja o primeiro na ordem lexicográfica.

Apenas uma *observação*: não sei exatamente por qual motivo, mas na hora
da conversão não é utilizada a ordem lexicográfica comum, onde símbolos
vem antes das letras. Então, se suas páginas começam com colchetes,
como a maioria dos *scanlators* as nomeiam, não coloque o colchete
no nome da capa também, isso fará com que qualquer outro
arquivo sem colchete no início (como neste caso, o `Créditos.jpg`)
vá parar antes da capa, assim se tornando a primeira imagem e 
consequentemente virará a "capa" na biblioteca do Kindle.

[Strobe Edge]: https://myanimelist.net/manga/7378/Strobe_Edge

## Comprimindo o volume

Precisamos comprimir novamente a pasta na qual fizemos nossas
edições para facilitar a organização dos arquivos.

Aqui há um adendo, mas mais por questões de convenções mesmo. Como
estamos trabalhando com quadrinhos, há [algumas extensões] comumente
utilizadas por este meio. Por tanto, dependendo de qual tipo de
arquivo comprimido você criou, renomeie a extensão para a apropriada.

<table>
  <thead>
    <tr>
      <td align="right"></td>
      <td></td>
      <td align="left"></td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="right"><code>zip</code></td>
      <td>→</td>
      <td><code>cbz</code></td>
    </tr>
    <tr>
      <td align="right"><code>rar</code></td>
      <td>→</td>
      <td><code>cbr</code></td>
    </tr>
    <tr>
      <td align="right"><code>7z</code></td>
      <td>→</td>
      <td><code>cb7</code></td>
    </tr>
  </tbody>
</table>

[algumas extensões]: https://pt.wikipedia.org/wiki/Formatos_digitais_de_hist%C3%B3rias_em_quadrinhos

## Obtendo o *Kindle Comic Converter*

Finalmente utilizaremos o famoso *programinha* tão referido durante o guia.
O programa é o [Kindle Comic Converter], disponível para Windows, Linux
e macOS. Note que se você utiliza Linux como eu, terá que instalar o
pacote manualmente, visto que no momento da escrita deste guia os
desenvolvedores não estão disponibilizando os binários.

### Instalando no Linux

Eu utilizo uma distribuição baseada em Arch Linux, então talvez os processos
de instalação sejam diferentes dependendo da sua *distro*. Dito isto,
primeiro precisamos instalar as dependências do KCC.

```console
$ sudo pacman -Sy libpng libjpeg-turbo p7zip
$ sudo pip3 install --upgrade pillow
```

Agora basta instalarmos o KCC através do AUR.

```console
$ yay -S kcc
```

Quando quisermos executar, basta digitarmos

```console
$ kcc
```

ou abrirmos pelo menu de aplicativos também.

É interessante dar uma olhada nas [instruções no repositório] caso você 
utilize uma *distro* baseada no Debian, pois o processo de instalação 
nestes sistemas envolve outras dependências e a instalação via PyPI.

[instruções no repositório]: https://github.com/ciromattia/kcc#pypi

### Instalando no Windows e macOS

É uma instalação simples, a famosa *Next → Next → Next*.

### Instalando o *KindleGen*

O KCC depende do [KindleGen] para poder realizar a conversão final para
`mobi`, o formato que os Kindles lêem. Portanto, precisamos baixá-lo.

Independente de sistema operacional, quando você baixar, você obterá
um `zip` que deverá ser descomprimido. O que importa na pasta é o arquivo
`kindlegen`, que é um executável portátil. 

Caso esteja usando Windows ou macOS, basta mover este executável para 
a pasta de instalação do KCC. No Linux é necessário realizar outro 
procedimento. Primeiro, precisamos dar permissão de execução.

```console
$ sudo chmod +x kindlegen
```

Agora basta colocá-lo em um lugar na qual esteja definido no seu `$PATH`.

```console
$ sudo mv kindlegen /usr/bin/kindlegen
```

No entanto, se você utiliza Arch, há um AUR que já faz isso automaticamente
e que pode ser instalado através do comando abaixo.

```console
$ yay -S kindlegen
```

[Kindle Comic Converter]: https://kcc.iosphe.re/
[KindleGen]: https://www.amazon.com/gp/feature.html?ie=UTF8&docId=1000765211

## A interface de usuário do KCC

Assim que você abrir o KCC, se deparará com a seguinte tela.

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img06.png"
   description="<em>GUI</em> do Kindle Comic Converter." %}
{:.without-shadow}

Como o próprio programa sugere, talvez seja interessante você ler
a página [*Important tips*] da Wiki do projeto. 

O KCC é dividido em algumas funções:

Editor
: Permite a edição dos metadados de um arquivo, como nome, número do
  volume, autor etc. Abordaremos em específico isto posteriormente.

Área de saída
: Aqui podemos visualizar o progresso da conversão dos arquivos, bem
  como quais arquivos abrimos para converter.

Botões
: Aqui podemos escolher as ações que queremos fazer com o programa,
  como selecionar os arquivos, especificar a versão do Kindle etc.

Opções
: Aqui é a parte importante, onde selecionamos os parâmetros do arquivo
  `mobi` que será gerado, tais como habilitar o *modo mangá*, dividir
  as páginas duplas etc.

[*Important tips*]: https://github.com/ciromattia/kcc/wiki/Important-tips

## Editando os metadados

É importante definir detalhes como *nome da série*, *volume*, *autor* etc.
sempre que estamos convertendo o mangá para possibilitar uma melhor
organização, seja na biblioteca do Calibre ou na própria do Kindle.

Portanto, para isto, utilizamos a opção *Editor* do KCC. Assim que clicarmos,
primeiro precisamos escolher o arquivo (`cbz`, `cbr` ou `cb7`) do volume
que desejamos editar.

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img07.png"
   description="Interface de edição dos metadados." %}
{:.without-shadow}

Aqui não tem muito segredo, basta preencher as informações de acordo
com o mangá que você selecionou. Quando acabar, basta clicar em *Save*.
Lembrando que você pode abrir a qualquer momento algum mangá já editado
e alterar seus metadados.

## Importando os arquivos

Agora que já editamos os metadados, podemos selecionar os arquivos que 
desejamos converter. Para isto, utilize a opção *Add file* para selecionar
manualmente os arquivos que queres converter.

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img08.png"
   description="Arquivos selecionados através de <em>Add file</em>." %}

Observe que na área de saída, os arquivos que você abriu devem estar
listados corretamente. Caso não, você pode utilizar a opção *Clear list*
para limpar todos os arquivos selecionados e abrir os corretos depois.

## Selecionando as opções

O KCC possui algumas opções, logo abaixo dos botões, que podemos utilizar
para customizar a maneira de como nosso mangá se comportará em seu
resultado final no Kindle. Cada opção possui um *tooltip* que explica 
detalhadamente o que ela faz se você deixar o *mouse* por cima dela 
por um tempinho.

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img09.png"
   description="Opções disponíveis para a customização." %}

Uma coisa importante a se notar é que algumas opções são caixas de 
seleção de [três estados]. Isto é, você pode deixar ela desmarcada 
(quadrado vazio), marcada (quadrado com um *check* dentro) ou 
indefinida (quadrado com outro quadrado, ou um menos, dentro).

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img10.svg"
   description="Caixas de seleção de três estados. Marekich [CC BY-SA 3.0]." %}

Agora vamos a uma pequena descrição das opções disponíveis.

*Manga mode*
: Esta opção, se marcada, faz com que o sentido de leitura seja igual a
  de um mangá, da [direita para a esquerda], fazendo então que você
  tenha que apertar no canto esquerdo da tela para avançar a página.

*Webtoon mode*
: Se marcada, faz uma tratativa especial para os quadrinhos em formato
  [*webtoon*], que devem ser lidos de cima para baixo e possuem páginas
  gigantes verticalmente.

*W/B margins*
: Especifica a cor da margem ao redor da página, se será detectada 
  automaticamente (desmarcado), se será sempre preenchida com branco
  (indeterminado) ou com preto (marcado).

*Spread splitter*
: Define o comportamento relacionado as páginas duplas. 

  - Se desmarcado, páginas duplas serão divididas na metade e exibidas
    como páginas separadas, facilitando a leitura. 
  - Se indeterminado, páginas duplas serão exibidas duas vezes: a 
    primeira vez rotacionadas na horizontal e em seguida divididas. 
  - Se marcado, serão exibidas somente rotacionadas.

*Stretch/Upscale*
: Se indeterminado, redimensiona as imagens menores do que a resolução
  do dispositivo para o tamanho da tela, não respeitando a [proporção
  de tela] da imagem. Se marcado, faz com que a imagem seja redimensionada
  respeitando a proporção.

*Output split*
: Se marcado, cada subpasta, incluindo as dentro do arquivo do volume,
  será separada em um arquivo, fazendo então com que cada capítulo
  gere seu respectivo arquivo `mobi`.

*Panel View 2/4/HQ*
: Define o comportamento do *zoom* das páginas. Se desmarcado, permite
  um *zoom* em cada um dos quatro cantos. Se indeterminado, apenas no 
  canto superior e inferior. Se marcado, permite um *zoom* nos quatro 
  cantos, mas com uma qualidade maior.

*Custom gamma*
: Se marcado, permite com que seja especificado um gama para a correção
  manual das páginas em vez de um automático (desmarcado).

*Color mode*
: Se marcado, deixa as páginas coloridas como estão, não as transformando
  em preto e branco.

Eu opto por apenas utilizar as opções *Manga mode* e a *Stretch/Upscale*.

[três estados]: https://en.wikipedia.org/wiki/Checkbox#Tri-state_checkbox
[direita para a esquerda]: https://pt.wikipedia.org/wiki/Escrita_da_direita_para_a_esquerda
[*webtoon*]: https://pt.wikipedia.org/wiki/Webtoon
[proporção de tela]: https://pt.wikipedia.org/wiki/Propor%C3%A7%C3%A3o_de_tela

## Enfim convertendo

Agora que selecionamos as opções das tratativas para os arquivos, podemos
enfim converter para o Kindle. Para isso, você precisa escolher qual o
modelo do seu dispositivo (que não necessariamente precisa ser um Kindle,
o KCC tem suporte a outros *e-readers* de outras marcas).

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img11.png"
   description="Alguns dos Kindles compativeis." %}

No meu caso eu tenho um Kindle Paperwhite de décima geração, no entanto
não há uma opção específica para esta versão. O que eu faço é utilizar
a opção *Kindle PW 3/4* que é referente a terceira e quarta geração,
mas funciona perfeitamente com a atual pois praticamente nada mudou
nesses quesitos do formato do arquivo.

Assim que você selecionar o seu dispositivo, o campo *Output format*
mudará automaticamente para o melhor formato a ser utilizado. É importante
não mexer nesse campo, pois ele se altera automaticamente com base no
dispositivo.

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img12.png"
   description="Formatos disponíveis. Neste caso utiliza-se o <code>mobi</code>." %}

Agora é só clicar em *Convert* e esperar a conversão. O KCC pegará seu
arquivo, o transformará em um `epub` e utilizará este como base para
converter para `mobi`.

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img13.png"
   description="Se deu tudo certo, você terá uma saída como esta." %}

Aqui o tempo de conversão irá variar de acordo com a quantidade de páginas,
de poder de processamento do seu computador, dentre outras variáveis.

## Transferindo para o Kindle

Por algumas razões técnicas, a biblioteca dos Kindles mais novos não
exibem a capa que é definida dentro do `mobi`, mas sim utilizam um
*cache* especial para as capas. 

Este *cache* **não** é atualizado se você apenas conectar o Kindle no
computador e colocar o arquivo na pasta `documents` dele. Assim, desta
maneira o mangá ficará sem a capa que colocamos nele.

Para resolver este problema, basta importar o `mobi` no [Calibre] e
a partir dele sincronizar com seu Kindle. Desta maneira, todos os
metadados e a capa serão transferidos corretamente.

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img14.png"
   description="Mangás importados no Calibre." %}
{:.without-shadow}

Utilizar o Calibre te dá a vantagem de ainda poder editar mais metadados
nas quais o KCC não tem suporte, como adicionar o [ISBN], a editora etc.

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img15.png"
   description="Edição de metadados no Calibre." %}
{:.without-shadow}

Aqui há uns adendos sobre a utilização do Calibre com os arquivos gerados
pelo KCC, retirados da própria Wiki do KCC.

> - **Não converta arquivos criados pelo KCC com o Calibre!**
>   Qualquer processo de conversão irá corromper o arquivo!
> - Não use o leitor do Calibre para visualizar os arquivos 
>   criados pelo KCC. Ele não consegue abri-los corretamente.

Dito isto, basta sincronizar sua biblioteca do Calibre com a do Kindle
ou passar os arquivos manualmente selecionando-os na lista e arrastando
para o dispositivo no Calibre.

[Calibre]: https://calibre-ebook.com/
[ISBN]: https://pt.wikipedia.org/wiki/International_Standard_Book_Number

## Hora da leitura

Se você seguiu esse *(extenso)* guia até aqui, já pode ser feliz e ler
seus mangás convertidos no seu Kindle.

<figure>
  <div class="figure-row is-spaced">
    <img src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img18.jpg">
    <img src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img19.jpg">
  </div>
  <figcaption>
    Na esquerda, leitura de uma página do mangá. Na direita, índice
    que foi gerado com base nos nomes das pastas dos capítulos.
  </figcaption>
</figure>

Note que o KCC já se responsabilizou automaticamente por aparar as bordas
que as páginas tinham, fazendo com que a imagem ocupe o maior espaço
possível na tela do Kindle.

## Concluindo

Em resumo, o que você precisa são dois *softwares*: o KCC e o Calibre. 
Utilizando-os em conjunto você pode converter seus mangás e obter ótimos 
resultados no seu Kindle.

{% include figure.html 
   src="/assets/img/2019-06-20-lendo-mangas-no-kindle/img20.png"
   description="Programas utilizados neste guia." %}

No repositório do KCC você encontra algumas [amostras] de mangás convertidos
utilizando o programa. Assim você pode baixá-los e testá-los para ver
como o Kindle ou outro *e-reader* se comportam durante a leitura.

Espero que eu tenha ajudado ao mostrar como é meu *workflow* em relação
a leitura de mangás no meu Kindle. Se eu descobrir alguma técnica
melhor ou algum aperfeiçoamento, manterei este guia atualizado sobre tal.

[amostras]: https://github.com/ciromattia/kcc#sample-files-created-by-kcc

## *Links* úteis

Aqui deixo algumas referências e *links* que utilizei durante a escrita.

- [Guia original] que me baseei quando comecei a converter meus mangás.
- [Wiki] do KCC, com algumas dicas e aspectos do programa.

[Guia original]: https://medium.com/@pedroka196/kindle-e-quadrinhos-uma-uni%C3%A3o-pouco-explorada-69e86562c42b
[Wiki]: https://github.com/ciromattia/kcc/wiki

Até uma próxima e boa leitura :grin:.