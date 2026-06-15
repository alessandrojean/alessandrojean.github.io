---
title: Chegou a hora de aposentar o Notion como CMS
category: Programação
description: Descrição
language: pt-BR
created_at: 2026-06-14
updated_at: 2026-06-14T20:34:00
tags:
  - notion
  - nuxt
---

Há quase quatro anos atrás, eu comecei a utilizar o Notion como uma espécie de CMS para este _blog_ pessoal. Durante um tempo, esta abordagem funcionou bem, mas depois comecei a me sentir bastante limitado com os blocos que o Notion oferece para escrever os textos.

Apesar de facilitar um pouco o fluxo de publicação, a plataforma sempre ofereceu algumas barreiras em como eles entregam seu conteúdo pela API, seja por conta das muitas requisições necessárias para obter uma única página, ou até mesmo pelo prazo de expiração nas imagens enviadas.

Como não ando escrevendo mais com tanta frequência, acredito que vale a pena voltar a manter os _posts_ em formato Markdown diretamente no repositório. Isto acaba me oferecendo mais autonomia e também um controle maior da estrutura dos elementos que posso usar durante a escrita.

No aspecto técnico, acabei utilizando o [Nuxt Content](https://content.nuxt.com/) para fazer o gerenciamento do conteúdo. Converter o que estava no Notion foi relativamente fácil, já que agora eles permitem exportar os documentos em formato Markdown.

Uma mudança pequena, mas significativa que acabei fazendo na migração, foi remover os _embeds_ de _tweets_. Já não é de hoje que não me sinto mais confortável em usar o que o Twitter se tornou, então acredito que é justo também não colocar nenhum _script_ deles no meu site. Para o único post (por enquanto) que fazia uso desse tipo de conteúdo, optei por criar uma citação especial, inspirada no estilo do [Manual do Usuário](https://manualdousuario.net/).

::social-media-post
---
author: Alessandro Jean
subtitle: Autor deste site
picture: /img/avatar-okabe-small.webp
---
As citações de _posts_ de redes sociais agora são assim, o que também permite maior flexibilidade já que posso citar _posts_ de quaisquer sites.
::

Removi também a seção de comentários de filmes do site. Com meu uso mais frequente do [Letterboxd](https://Letterboxd.com/alessandrojean), creio que faz mais sentido postar meus comentários nos [_reviews_](https://letterboxd.com/alessandrojean/reviews/) por lá.

De coisas futuras a serem feitas, eu ainda quero melhorar um pouco a tipografia.
