---
layout: post
title: 'Criando uma busca no Jekyll usando Vue.js'
description: ''
main_category: js

tags:
  - javascript
  - vuejs
  - jekyll
---

_Recentemente, ao construir este blog, eu entrei em um grande
dilema: como fazer uma busca, sendo que o [Jekyll] é um
gerador de sites estáticos?_

Só existe uma solução: fazê-la usando JavaScript. Existem diversas
maneiras de implementar isto: usando algum _script_ já pronto,
como o [Simple-Jekyll-Search]; fazendo um arquivo JSON simulando
uma API, mas com todos os _posts_ em seu conteúdo etc.

No entanto, eu queria criar uma solução original e simples,
em que eu mesmo pudesse desenvolver e mantê-la. Então foi
aí que resolvi utilizar meu querido [Vue.js]. Minha intenção
é fazer com que não seja necessário criar um arquivo JSON,
para evitar chamadas AJAX para este.

## Conteúdo
{:.no_toc}

1. Conteúdo
{:toc}

## Utilizando a CDN

Para não termos que nos preocupar de usar o `vue-cli` e ter
todo aquele trabalho de configuração de todo um projeto,
como é um projeto relativamente simples, compensa mais
utilizar uma CDN e programar direto mesmo.

```html
<script src="https://unpkg.com/vue@2.5.17"></script>
<script src="https://unpkg.com/lodash@4.16.0"></script>
```

Estou importando também o [Lodash] pois precisaremos de
sua função de `debounce`, onde explicarei melhor posteriormente.

## O container

Precisamos delimitar o _container_ onde o Vue irá agir,
criando um elemento e atribuindo um `id` para este.
A busca será bem simples: consiste de uma caixa de texto
e uma lista que serão os resultados.

```html
<div id="search">
  <input type="search" :value="search" @input="update" />
  <ul>
    <li v-for="post of posts" :key="post.url">
      <time :datetime="post.dateXml">${post.date}</time>
      &mdash; <a :href="post.url">${post.title}</a>
    </li>
  </ul>
</div>
```

Aqui já vem um grande macete, precisamos trocar o interpolador
padrão do Vue, o `{% raw %}{{{% endraw %}` e `}}` para um outro, pois este é o
mesmo utilizado pelo Liquid do Jekyll. Para isto, na
hora de criar o objeto do Vue, nos o informamos que queremos
que o interpolador tenha outra forma, digamos `${` e `}` [^interpolador].

## Criando a instância do Vue

Agora que temos uma estrutura básica onde o Vue irá agir,
precisamos criar uma instância do Vue. Para isto, utilizaremos
seu construtor e informaremos alguns parâmetros.

```html
<script type="text/javascript">
  new Vue({
    el: '#search',
    delimiters: ['${', '}'],
    data: function() {
      return {
        search: ''
      };
    }
  });
</script>
```

Aqui, como explicado anteriormente, informamos ao Vue, através
do atributo `delimiters`, que queremos usar o interpolador
que iremos passar e não o padrão.

Neste momento, se você tentar executar, perceberá que
talvez o Vue dê um erro em seu `console`. Isto acontece
porque não definimos o seu atributo `posts` que referenciamos
no _container_ para fazer o _loop_.

## Gerando o atributo _posts_

Agora, precisamos utilizar algumas funções do Liquid para
poder passar todos os _posts_ do _blog_ para o Vue na
sintaxe do Javascript. Para isto, dentro do atributo
`data`, logo após `search`, criamos um vetor de objetos
que será preenchido com o `for` do Liquid.

```javascript
// Código omitido.
posts: [{% raw %}
  {% for post in site.posts %}
  {
    date: "{{ post.date | date: '%d/%m/%Y' }}",
    dateXml: "{{ post.date | date_to_xmlschema }}",
    title: '{{ post.title }}',
    url: '{{ post.url | prepend: site.baseurl }}',
    category: '{{ post.category }}'
  },
  {% endfor %}{% endraw %}
]
```

Aqui as coisas começam a ficar interessantes. O que
acontecerá é que, quando o site for gerado, o Jekyll
iterará em todos os _posts_ e escreverá o arquivo
`html` final com uma estrutura parecida com esta abaixo.

```javascript
posts: [
  {
    date: '01/11/2018',
    dateXml: '2018-11-01T00:00:00-03:00',
    title: 'Busca no Jekyll usando Vue.js',
    url: '/busca-no-jekyll-usando-vuejs/',
    category: ''
  },
  {
    date: '27/09/2018',
    dateXml: '2018-09-27T17:44:54-03:00',
    title: 'Implementando uma Pilha',
    url: '/ed/estruturas/pilha/',
    category: ''
  }
  // E assim segue com os outros posts...
];
```

Ou seja, agora o atributo `posts` do Vue está preenchido
com um vetor de objetos, onde cada objeto representa um
_post_ do _blog_, e o mais importante: na sintaxe
correta do JavaScript. Agora, se você testar,
todos os posts são exibidos.

## Implementando a busca

Até agora, já fizemos com que o Vue exiba todos os _posts_,
no entanto, ainda não podemos filtrar por aqueles que
contenham um termo digitado no campo de busca.

Para implementar isto, vamos utilizar o conceito de
dados computados do Vue. Criaremos uma função que
pega o valor de `search` e nos retorna um vetor
ou com todos os elementos caso este seja vazio,
ou apenas com os elementos que possuem em seu
título ou categoria o termo buscado.

```javascript
computed: {
  filteredPosts: function () {
    // Se o termo é vazio, devolva todos os posts.
    if (this.search.length === 0)
      return this.posts;

    let titleLower;
    let categoryLower;
    const searchLower = this.search.toLowerCase();
    return this.posts
      .filter(x => {
        titleLower = x.title.toLowerCase();
        categoryLower = x.category.toLowerCase();
        // Aqui retornamos se o post x
        // contém o termo buscado na categoria
        // ou em seu título.
        return titleLower.includes(searchLower) ||
          categoryLower.includes(searchLower);
      });
  }
}
```

Precisamos agora trocar a lista no `v-for` da lista
que exibe os _posts_.

```html
<li v-for="post in filteredPosts" :key="post.url">
  <!-- Conteúdo -->
</li>
```

## Um pequeno problema

Aqui nós entramos em um problema. A operação de filtro
é linear, ou seja, dependendo de quantos _posts_ o seu
_blog_ tem, esta pode ser lenta. Caso usássemos a
implementação natural de _binding_ do Vue, através
do `v-model="search"`, sempre que apertarmos
uma tecla do teclado e alterarmos o conteúdo,
essa função de filtro será chamada novamente. Precisamos
evitar que isto seja repetido várias vezes a cada
tecla que pressionamos. Aí que entra o uso da função
`debounce` do Lodash.

> Cria uma função de debounce que atrasa a
> função invocada `func` até que `wait`
> milisegundos tenham se passado deste a
> última vez que a função de debounce
> foi chamada. [^debounce]

Ou seja, a função de _debounce_ irá atrasar
uma dada função até que um tempo dado tenha
passado. Mesmo que chamemos inúmeras vezes
esta mesma função, ela só será executada
uma vez após este tempo. Para isto que
aplicaremos ela no método `@input` da
caixa de busca.

## Aplicando _debounce_ na caixa de busca

Precisamos criar um método `update` que será chamado
sempre que houver alguma modificação na entrada
da caixa de busca. Neste método, aplicaremos
o _debounce_: só atualizaremos o valor de `search`
após 300 milisegundos, e, consequentemente,
o `filteredPosts`.

```javascript
methods: {
  update: _.debounce(function(e) {
    this.search = e.target.value;
  }, 300);
}
```

## Mostrando que a busca é vazia

Seria interessante mostrar ao usuário caso uma busca
não retorne nenhum resultado. Para isto, basta
criarmos qualquer elemento e utilizar a diretiva
`v-if`.

```html
<p v-if="!filteredPosts.length">
  Nenhum resultado encontrado.
</p>
```

Agora a busca está totalmente implementada e funcional.
Fica a seu cargo criar o estilo e melhorar a UX, este
é apenas um sistema bem simples para demonstrar o
conceito.

<p data-height="360" data-theme-id="0" data-slug-hash="XyrKaO" data-default-tab="result" data-user="alessandrojean" data-pen-title="Jekyll Vue.js search with debounce" data-preview="true" class="codepen">See the Pen <a href="https://codepen.io/alessandrojean/pen/XyrKaO/">Jekyll Vue.js search with debounce</a> by Alessandro Jean (<a href="https://codepen.io/alessandrojean">@alessandrojean</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Tente fazer buscas por termos que estão nos títulos dos
_posts_ ou pelo nome das categorias, você verá que
os resultados estão sendo filtrados corretamente.

Até uma próxima! :v:

[^interpolador]: Retirado de "Como criar um formulário de contato no Jekyll com Vue.js", disponível [aqui].
[^debounce]: [Documentação do Lodash].

[aqui]: https://www.rossener.com/fazendo-um-formulario-de-contato-no-jekyll-com-vue.js/
[documentação do lodash]: https://lodash.com/docs/4.17.11#debounce
[jekyll]: https://jekyllrb.com/
[simple-jekyll-search]: https://github.com/christian-fei/Simple-Jekyll-Search
[vue.js]: https://vuejs.org/
[lodash]: https://lodash.com/
