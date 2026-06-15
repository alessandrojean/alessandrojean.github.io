---
title: O processo de reescrita do site
category: Cotidiano
description: Algumas notas e observações do processo de reescrita do site.
language: pt-BR
created_at: 2022-10-07
tags:
  - notas
  - site
---

Depois de alguns anos com o site parado e até fora do ar, resolvi tomar coragem e tentar refazer do zero utilizando algum outro *framework* que não fosse o Jekyll. Por ter mais familiaridade com o Vue.js, acabei optando pelo NuxtJS em conjunto com o Tailwind CSS, que tenho utilizado cada vez mais em meus projetos no lugar no Bulma.

Eu só tinha usado o Tailwind em alguns projetos menores, então resolvi arriscar usar aqui também, e ainda bem que fiz esta escolha, tive uma grata surpresa. Assim como os criadores do *framework* alegam na descrição, realmente me senti mais produtivo em não ter que mexer em nenhuma linha de CSS fora o básico durante a configuração. Ainda tenho um pouco de dificuldades aqui e ali quanto a tentar transformar tudo em componentes o máximo que conseguir para evitar repetição de códigos, mas sinto que eventualmente conseguirei

No novo site eu queria dar mais destaque e fazer parecer mais uma espécie de portfólio e currículo, com algumas informações de conhecimentos e cursos. Ao mesmo tempo, também queria trazer de volta alguns dos textos que tinha escrito nas versões anteriores do blog. Acabei retirando o de como ler mangás no Kindle por enquanto pois tive algumas mudanças de pensamento e gostaria de revisitar e tentar evitar ao máximo remeter a pirataria, dando exemplos com quadrinhos que tenham licença da Creative Comics ou sejam de código aberto, como o [Pepper & Carrot](https://www.peppercarrot.com/pt/).

Outra experiência que resolvi testar foi utilizar o Notion como o "banco de dados" dos posts. Tinha visto um dos criadores do Tailwind comentar sobre em um *tweet* e achei a proposta muito interessante. Infelizmente a API do Notion não retorna o corpo inteiro da página em um formato mais comum como HTML ou até mesmo Markdown, mas sim em uma espécie de AST com os nós de cada bloco. Existem alguns pacotes no NPM como o `vue-notion`, mas infelizmente ele não está atualizado ainda para o Vue.js v3 e nem para o NuxtJS 3, o que acaba causando diversos erros de compilação.

::tweet
---
author: Adam Wathan
subtitle: Criador do Tailwind CSS
picture: ./posts/2022/2022-10-11-utilizando-o-notion-como-um-cms/adam-wathan.jpg
---
Brincando um pouco com usar o Notion como um CMS para o meu site pessoal para reduzir a burocracia de publicação. É bem divertido, mas toda a abstração em 'blocos' e as coisas de paginação fazem ser um trabalho enorme só para extrair um conteúdo básico escrito pela API.
::

Como eu não quis esperar com que uma atualização fosse lançada e também não queria utilizar o Prism, acabei por incorporar uma parte de seu código já adaptando a nova API de composição do Vue.js. O resultado acabou saindo bastante satisfatório, e ainda consegui aproveitar para testar um outro pacote de *syntax highlighting*, o Shiki, que utiliza os códigos do VSCode por baixo dos panos. A vantagem é que é possível utilizar qualquer tema do VSCode também, como meu querido Nord.

Ainda há algumas modificações que desejo fazer no site, como colocar uma parte de projetos com alguns sites que fiz para conhecidos, mas isso será feito lentamente. Quanto aos artigos, não sei se pretendo voltar a escrever, mas ter essa facilidade de usar o Notion talvez acabe me animando um pouco por um período, vamos ver.
