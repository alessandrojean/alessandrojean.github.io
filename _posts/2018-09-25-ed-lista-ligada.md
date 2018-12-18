---
layout: post
title: 'Implementando uma Lista Simplesmente Ligada'
description: ''
main_category: ed
#cover: '/blog/assets/img/series/ed/ed-linked-list.png'
#permalink: /ed/estruturas/lista-simplesmente-ligada/

tags:
  - c
  - implementação

categories:
  - "Estruturas de Dados"
---

Bem, estou resolvendo criar esta nova série de Estruturas de Dados
para implementar algumas das estruturas mais essenciais e básicas
que são ensinadas normalmente nesta disciplina. 

Minha intenção é ser o mais claro possível e, ao mesmo tempo, 
conseguir abordar alguns temas importantes da linguagem, 
além de criar estruturas genéricas, que servem para qualquer 
tipo de dados. Desta forma, além de eu conseguir passar meu
conhecimento adiante, ainda acabo aproveitando para estudar 
para Estruturas de Dados II.

## Conteúdo
{:.no_toc}

1. Conteúdo
{:toc}

## Definição

> Uma **lista ligada** é uma estrutura de dados
> na qual os objetos são organizados em ordem
> linear. Diferentemente de um vetor, no entanto,
> onde a ordem linear é determinada pelos
> índices do vetor, a ordem da lista ligada é
> determinada por um ponteiro em cada objeto.
> 
> <cite>CORMEN, T. H et al</cite>

Uma Lista Simplesmente Ligada consiste de vários nós com
dois atributos: o valor que ele armazena, o item em si, e
um ponteiro para o próximo nó.

{% include figure.html src='https://i.imgur.com/9xJ6wLs.png'
   description='Representação de uma lista simplesmente ligada.' %}

Em questões de complexidade, com exceção do primeiro e último
item, não temos um acesso direto como um vetor que é $O(1)$.
A maioria dos métodos tem complexidade de $O(n)$. No entanto,
não é o escôpo deste *post* falar sobre complexidade.

## Sobre o desenvolvimento

Como a grande maioria dos cursos desta disciplina, também
irei utilizar a Linguagem C para o desenvolvimento. Então,
certifique-se que você possui o `gcc` instalado e configurado
corretamente em seu sistema operacional.

## Definindo nosso arquivo de cabeçalho

É uma boa prática em C separar o máximo possível o que é
o desenvolvimento de bibliotecas com o programa principal.
Por isto, iremos criar um cabeçalho `linkedlist.h` onde
definiremos inicialmente todas as funções e a `struct`
que a Lista Ligada irá ter.

### Estrutura dos nós

Para não termos que nos referenciar como `struct linked_node_t*`
toda vez que iremos manipular instâncias de nós da lista,
vamos definir dois novos tipos: o `linked_node_t` e
o `linked_list_t`. Neste caso, `linked_list_t`, assim como
`linked_node_t`, são o *mesmo* tipo de dados. Apenas optei
por criar o tipo `linked_list_t` para ficar mais claro
no desenvolvimento qual o primeiro nó da lista e qual
é um nó qualquer.

```c
typedef struct linked_node_t linked_node_t;
typedef struct linked_node_t linked_list_t;
```

Agora, precisamos criar uma `struct` que será
responsável por cada nó de nossa lista, o `linked_node_t`.
Um nó de uma lista é bem simples, só possui dois
atributos: o dado que será guardado, neste caso
será um ponteiro para `void`, nos permitindo armazenar
qualquer tipo de dado dinamicamente alocado; e um
ponteiro para `linked_node_t`, que apontará para o
próximo nó da lista.

```c
struct linked_node {
  void* value;
  linked_node_t* next;
};
```

### Métodos

Minha intenção não é criar todos os métodos possíveis
e existentes que qualquer implementação pronta de uma
linguagem, como o Java, fornece já pronto, mas sim
alguns simples e essenciais, mas que ajudarão bastante
a entender o comportamento desta estrutura.
Portanto, selecionei as operações abaixo para esta
implementação.

```c
/* Métodos de criação */
linked_node_t* create_node(void* value);
/* Métodos de inserção */
linked_node_t* insert_at_start(linked_list_t* head, void* value);
linked_node_t* insert_at_end(linked_list_t* head, void* value);
linked_node_t* insert_before(linked_list_t* head, linked_node_t* node, void* value);
linked_node_t* insert_after(linked_node_t* node, void* value);
/* Métodos de busca */
linked_node_t* get_first_occurrence(linked_list_t* head, void* key, 
  int (*compare)(const void*, const void*));
linked_node_t* get_element_at(linked_list_t* head, int i);
/* Métodos de remoção */
linked_list_t* remove_first_occurrence(linked_list_t* head, void* key, 
  int (*compare)(const void*, const void*));
linked_list_t* remove_element_at(linked_list_t* head, int i);
/* Métodos de manipulação */
linked_list_t* reverse_list(linked_list_t* head);
/* Outros métodos */
void print_list(linked_list_t* head, void (*print_element)(const void*));
void free_list(linked_list_t* head, void (*free_element)(void*));
```

Conforme cada método for desenvolvido, explicarei
com mais detalhes a função de cada um, incluindo
seus parâmetros e retorno.

## Criando nosso arquivo de implementação

Agora que criamos o arquivo de cabeçalho `linkedlist.h`,
precisamos criar o `linkedlist.c` onde nossa implementação
de cada método será criada. Para isto, logo ao topo,
precisamos informar o compilador do C que iremos utilizar
os seguintes cabeçalhos:

```c
/* Utilização de malloc e free */
#include <stdlib.h>
/* Nosso cabeçalho */
#include "linkedlist.h"
```

### Criando um nó

Todos os métodos de inserção dependem deste método,
ele sempre será chamado quando queremos alocar
um novo `linked_node_t` na memória. Para isto,
utilizamos o `malloc`, que alocará na memória
um espaço com o tamanho de `linked_node_t`.

```c
linked_node_t* create_node(void* value) {
  // Tenta alocar dinamicamente um nó.
  linked_node_t* new_node = malloc(sizeof(linked_node_t));

  // Se não conseguiu alocar, retorne NULL.
  if (NULL == new_node)
    return new_node;
  
  // Define o valor do nó.
  new_node->value = value;
  // Importante: o nó não possui próximo elemento (ainda).
  new_node->next = NULL;

  return new_node;
}
```

Sobre o `malloc`, duas observações:
- Não é necessário fazer o *casting* de seu retorno
  para o ponteiro do tipo da variável que você alocou,
  o compilador do C já faz isto automaticamente;
- Sempre é necessário verificar se de fato ele
  conseguiu alocar na memória. Podem haver casos
  em que a memória não tem mais espaço disponível,
  assim seu retorno é igual a `NULL`.

Desta forma, sempre que quisermos criar um novo nó,
podemos simplesmente fazer:

```c
// Suponha que estamos utilizando uma lista de inteiros.
int* numero = malloc(sizeof(int));
*numero = 32;
// Criação de um novo nó.
linked_node_t* novo_no = create_node((void*) numero);
```

No entanto, não precisaremos fazer esse *casting*
de qualquer tipo de ponteiro para um ponteiro
de `void` sempre, já que o ponteiro será
passado diretamente como um parâmetro dos métodos
de inserção. Isto nos permite que a criação
do ponteiro, que pode ter outras definições,
como, por exemplo, zerar ou inicializar algumas
variáveis de uma `struct`, seja *externalizada*,
podendo ter um método de criação do ponteiro
para cada tipo que você irá utilizar na lista.

### Inserindo um nó no início da lista

Inserir no início é relativamente simples. Independentemente
de nossa lista estar vazia, ou seja, `head` ser um ponteiro
com valor `NULL`, ou não, o processo é o mesmo. Precisamos
criar um novo nó e fazer com que seu próximo item, `newNode->next`,
aponte para o início de nossa lista.

```c
linked_node_t* insert_at_start(linked_list_t* head, void* value) {
  // Alocamos um novo nó.
  linked_node_t* new_node = create_node(value);

  // Se não tivemos sucesso em alocar, retorne NULL.
  if (NULL == new_node)
    return new_node;

  // Estamos inserindo no início, logo
  // o próximo elemento depois deste
  // deve ser o início da lista.
  new_node->next = head;

  // Agora newNode é o início da lista,
  // precisamos retorná-lo.
  return new_node;
}
```

Como modificamos o início de nossa lista, precisamos fazer
com que a função retorne o novo início da lista, senão
acabariamos perdendo a referência para o início da lista.
Agora, sempre que quisermos adicionar um elemento ao início
da lista, podemos fazer das seguintes maneiras:

```c
int* novoValor = malloc(sizeof(int));
*novoValor = 32;

// Método 1: criando diretamente.
linked_list_t* lista1 = insert_at_start(NULL, (void*) novoValor);

// Método 2: utilizando um ponteiro nulo.
linked_list_t* lista2 = NULL;
lista2 = insert_at_start(lista2, (void*) novoValor);

// Cuidados: neste caso, ambas as listas
// referenciam no primeiro o nó o mesmo item,
// portanto se modificarmos ele, alteraremos em ambas!.
*novoValor = 65;
printf("%d\n", lista1->value == lista2->value); // => 1.
printf("%d\n", (int*) lista1->value == (int*) lista2-> value); // => 1
printf("%d\n", *(int*) lista1->value == *(int*) lista2->value); // => 1.
```

### Inserindo um nó no fim da lista

Este método requer um pouco mais de trabalho.
Precisaremos percorrer por todos os elementos
da lista ligada até chegar ao fim, ou seja,
quando atingirmos um elemento com o valor de
`value` como `NULL`, e aí fazer seu `value`
apontar para o novo nó criado.

Podemos percorrer uma lista ligada através
de seus nós utilizando tanto o laço `while`
quanto o `for`. No entanto, a implementação
utilizando o laço `for` é bem enxuta: apenas
1 linha!

```c
// Assuma que a lista não é nula e não é vazia.
linked_list_t* lista, *ultimo = NULL;
// Iterando utilizando o while.
ultimo = lista;
while (NULL != ultimo->next) {
  ultimo = ultimo->next;
}
// Iterando utilizando o for.
for (ultimo = lista; ultimo->next != NULL; ultimo = ultimo->next);
```

No fim de ambos os laços, `ultimo` apontará
para o último elemento da lista. No entanto,
temos um problema de implementação.
Se `lista` for `NULL`, teremos um
*Segmentation fault* ao tentar acessar o `next`
de um elemento nulo. Portanto, precisamos
tratar este caso antes de começar a iterar pela lista.

Sabendo disto, podemos implementar nosso método:

```c
linked_node_t* insert_at_end(linked_list_t* head, void* value) {
  linked_node_t* new_node = create_node(value), *last = NULL;

  // Se a lista está vazia, ou não conseguimos
  // alocar um novo nó, basta retornar.
  if (NULL == head || NULL == new_node)
    return new_node;

  // Devemos percorrer a lista até o último item.
  for (last = head; last->next != NULL; last = last->next);
  // Agora que achamos o último item,
  // basta fazer com que o próximo seja o nó novo.
  last->next = new_node;
  // Para eventuais usos, retornamos este nó novo.
  return new_node;
}
```

Para utilizarmos:

```c
// Valores que serão inseridos.
int* numero = malloc(sizeof(int));
*numero = 32;
// Aqui tanto faz se é uma lista nula ou não.
linked_node_t* lista;
// Para inserir no final.
linked_node_t* ultimo_no = insert_at_end(lista, (void*) numero);
```

Neste caso, estamos utilizando uma implementação
que tem custo $O(n)$. Podemos melhorar isto
para $O(1)$ se sempre que inserirmos
um nó novo ao fim de uma lista, guardarmos
este novo nó e usarmos algum método que insira
um nó após um nó arbitrário. Para isto desenvolveremos
uma função específica.

### Inserindo após um nó arbitrário

Este é outro caso relativamente simples, já que
possuimos uma referência a um nó arbitrário,
este podendo ser nulo ou não, basta analizar os
dois casos: 

1. Se o nó arbitrário é nulo, então há nada
   a ser feito, basta retornar o nó criado.
2. Se o nó arbitrário não é nulo, basta
   fazer com que o nó criado aponte para
   o `next` deste nó arbitrário e que
   o nó arbitrário agora aponte para o
   nó criado.

```c
linked_node_t* insert_after(linked_node_t* node, void* value) {
  linked_node_t* new_node = create_node(value);
  // Primeiro caso: o nó passado está nulo.
  if (NULL == node)
    return new_node;
  // Segundo caso: há um nó não nulo.
  if (new_node == NULL)
    return new_node;
  // Fazemos com que o novo nó
  // aponte para o próximo do nó arbitrário.
  new_node->next = node->next;
  // Agora o nó arbitrário aponta
  // para o novo nó criado.
  node->next = new_node;
  // Novamente, retornamos o nó criado.
  return new_node;
}
```

Agora, sempre que dependermos em inserir muitos items
sequencialmente ao fim da lista, podemos fazer isto
com um custo bem melhor. Por exemplo, suponha que
queremos popular a lista com os números de 1 a 10:

```c
linked_node_t *lista = NULL, *ultimo = NULL;
for (int i = 1; i <= 10; i++) {
  // Alocamos um inteiro novo.
  int* novo_valor = malloc(sizeof(int));
  *novo_valor = i;
  // Inserimos ao final.
  ultimo = insert_after(lista, (void*) novo_valor);
  // Na primeira iteração, precisamos
  // pegar a referência para o primeiro
  // nó, que será o ultimo.
  if (NULL == lista)
    lista = ultimo;
}
// Agora a lista possui os elementos:
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

Agora conseguimos tornar esta operação bem menos
custosa, com complexidade de $O(1)$, não precisamos
percorrer sempre a lista toda até o último item
para inserir após, já que sempre estamos mantendo
a referência ao último item e podemos inserir
logo em seguida dele e atualizá-lo.

### Buscando pela primeira ocorrência

Para procurar a primeira ocorrência de um dado valor
armazenado na lista, a lógica também é relativamente
simples e trivial: basta iterar pela lista até achar
o elemento e retorná-lo caso tenha êxito.

No entanto, estamos trabalhando com ponteiros para
`void`, nós não necessariamente teremos o valor, a
mesma referência da lista, até porque se tivéssemos, 
nem precisariamos buscar. Por exemplo, suponha que
estivessemos trabalhando com uma Lista Ligada que
armazena uma `struct Pessoa`, poderiamos buscar
por um atributo `id`, por exemplo, e assim o método
nos retornaria a `struct` completa com os outros 
atributos, como `nome`, `telefone` etc.

Para isto, a função precisa saber comparar o
valor temporariamente criado, `key`, com
os elementos da lista. Isto pode ser resolvido
de uma maneira bem simples: utilizando ponteiros
para funções! Ou seja, nós passamos uma referência
a uma função que dado dois elementos de um tipo
qualquer, ou seja, `void*`, os trate corretamente
e os compare com o critério necessário.

Se você programa em JavaScript, já deve estar acostumado
mais ou menos com a ideia, onde podemos passar funções
como parâmetros em funções, por exemplo:

```javascript
// Função que modifica um vetor com dada função.
const aplicarFuncao = (vetor, funcao) => {
  for (let i = 0; i < vetor.length; i++)
    // Aqui chamamos a função passada por
    // parâmetro e pegamos seu resultado.
    vetor[i] = funcao(vetor[i]);
}
// Função que recebe um salário e o aumenta em 10%.
const aumentarSalario = (salario) => salario * 1.1;
// Lista de salários.
const salarios = [1582, 3879, 900];
// Agora podemos aumentar os salários facilmente.
aplicarFuncao(salarios, aumentarSalario);
// Suponha agora que temos outra função parecida.
const diminuirSalario = (salario) => salario / 2;
// Podemos aplicar da mesma maneira.
aplicarFuncao(salarios, diminuirSalario);
```

Então, para passar uma função como ponteiro para
outra função em C, fazemos da mesma maneira
quando queremos pegar o ponteiro de uma variável,
usando o operador `&`. O exemplo anterior em
JavaScript seria escrito em C assim:

```c
// Obs: suponha que as funções estão declaradas
// fora do main(), e que as chamadas das mesmas
// estão dentro do main().

// Função que modifica um vetor com dada função.
void aplicar_funcao(int* vetor, int n,
    int (*funcao)(int)) {
  for (int i = 0; i < n; i++)
    vetor[i] = funcao(vetor[i]);
}
// Função que recebe um salário e o aumenta em 10%.
int aumentar_salario(int salario) {
  return salario * 1.1;
}
// Vetor de salários.
int salarios[] = {1582, 3879, 900};
// Agora podemos aumentar os salários facilmente.
aplicar_funcao(salarios, 3, &aumentar_salario);
```

Então sempre que pretendemos buscar pela primeira ocorrência, 
precisamos passar uma função comparadora
entre dois elementos `a` e `b`. A função deve retornar
um valor positivo se `a > b`, um valor negativo se
`a < b` e `0` se `a = b`. Por exemplo, se estivermos
usando uma lista de `int`, precisariamos passar
uma função com essa definição:

```c
int comparar_inteiros(const void* a, const void* b) {
  // Precisamos pegar os valores de a e b,
  // como inteiros, para isto, o casting.
  int *valor_a = (int*) a, *valor_b = (int*) b;
  // Para obter os valores corretos,
  // basta subtrair a de b :)
  return *valor_a - *valor_b;
}
```

Agora que revisamos os conceitos de ponteiros para funções,
podemos criar o método para busca finalmente. Portanto,
um de seus parâmetros será exatamente um ponteiro
para uma função que retorna `int` e tem como parâmetro
dois ponteiros para `void`, `a` e `b`.

```c
linked_node_t* get_first_occurrence(linked_list_t* head, void* key, 
    int (*compare)(const void*, const void*)) {
  // Nó resultado da busca.
  linked_node_t* element = NULL;
  // Itere por toda a lista enquanto há nós.
  for (linked_node_t* i = head; i != NULL; i = i->next) {
    // Se a função de comparação retornar
    // o valor 0, significa que são iguais.
    if ((*compare)(key, i->value) == 0) {
      // Achamos o elemento,
      // precisamos parar o laço.      
      element = i;
      break;
    }
  }
  // Key é somente um elemento temporário 
  // especialmente criado para buscar,
  // devemos liberar da memória após o uso.
  free(key);
  // Retorne o nó, tendo achado ou não.
  return element;
}
```

Seu uso também é relativamente simples.

```c
// Suponha que a lista tem elementos.
linked_list_t* lista;
int* elemento = malloc(sizeof(int));
// Queremos buscar o elemento com valor 8.
*elemento = 8;
// Basta chamarmos com a função comparar_inteiros.
linked_node_t* resultado = get_first_occurrence(lista, (void*) elemento, 
    &comparar_inteiros);
```

### Nó em um índice arbitrário

Suponha que queremos obter o elemento em um dado
índice `i` na lista. Para isto, basta iterarmos
pelos elementos da lista e indo incrementando
uma variável contadora, digamos `j`. Se `j`
for, em algum momento, igual a `i`, achamos
o item. Senão, a lista tem menos elementos
que o índice `i`.

```c
linked_node_t* get_element_at(linked_list_t* head, int i) {
  // Se a lista está vazia ou o 
  // índice é inválido, retorne NULL.
  if (NULL == head || i < 0)
    return NULL;
  // Itere pela lista enquanto o elemento
  // atual não for nulo e j <= i.
  int j = 0;
  for (linked_node_t* actual = head; actual != NULL; actual = actual->next) {
    // Se j chegou no índice i.
    if (j++ == i)
      return actual;
  }
  // Lista tem menos elementos que i.
  return NULL;
}
```

### Removendo a primeira ocorrência

Remover um item de uma lista é um pouco mais trabalhoso. Primeiramente
precisamos tratar um caso especial: se o item é o primeiro da lista.
Neste caso, precisamos, logo após removê-lo, retornar o novo
começo da lista. Nos outros casos, precisamos guardar o
item anterior a ocorrência, se existente, e, após removê-la,
fazer com que o item anterior aponte para o próximo da ocorrência.

```c
linked_list_t* remove_first_occurrence(linked_list_t* head, void* key, 
    int (*compare_equal)(const void*, const void*)) {
  // Caso único: o elemento é o primeiro da lista.
  if (NULL != head && (*compare)(key, head->value) == 0) {
    // Precisamos guardar o próximo item.
    linked_node_t* next = head->next;
    // Devemos liberar o nó da memória.
    free(head);
    // Também devemos liberar o elemento de busca.
    free(key);
    // A lista agora começa em next.
    return next;
  }
  // Precisamos iterar pela lista em busca do elemento,
  // mas desta vez, guardando o item anterior.
  linked_node_t* actual, *prev = NULL, *element = NULL;
  for (actual = head; actual != NULL; prev = actual, actual = actual->next) {
    if ((*compare)(key, actual->value) == 0) {
      element = actual;
      break;
    }
  }
  // Se o elemento não está na lista, nada a ser feito.
  if (NULL == element)
    return head;
  // Precisamos guardar o próximo item.
  linked_node_t* next = element->next;
  // Devemos liberar o nó da memória.
  free(element);
  // Agora o próximo depois do elemento anterior
  // deve ser o next que guardamos.
  prev->next = next;
  // Também devemos liberar o elemento de busca.
  free(key);
  return head;
}
```

Se não vamos mais usar um elemento após removê-lo da lista,
precisamos liberá-lo da memória também! O método apenas
remove da memória o nó da lista, fazendo com que você
perca a referência ao `value`, mas ele ainda está na memória.
Para solucionar isto, deve-se guardar o valor do ponteiro
de `value` e, após remover o nó, liberá-lo da memória.

```c
// Suponha que a lista possui items.
linked_list_t* lista;
int* elemento = malloc(sizeof(int));
// Queremos remover o elemento com valor 8.
*elemento = 8;
// Precisamos primeiro achar o nó.
linked_node_t* no8 = get_first_occurrence(lista, elemento,
    &comparar_inteiros);
// Ponteiro do valor de no8.
// Note que este é diferente de "elemento".
int* valor_no8 = no8->value;
// Agora podemos remover o no com elemento de valor 8.
// Note que: "elemento" já foi liberado da memória
// por causa de seu uso em get_first_occurrence.
// Agora, estamos usando o valorNo8, que também será
// liberado automaticamente por estar sendo usado
// como apenas um valor de busca.
lista = remove_first_occurrence(lista, valor_no8, 
    &comparar_inteiros);
```

### Removendo um nó em um índice arbitrário

Remover um nó em um índice arbitrário `i` é o mesmo procedimento
que remover a primeira ocorrência. A única mudança é o
método de busca, onde, assim como a busca de um índice
arbitrário, devemos usar um contador `j` que a cada
iteração é incrementado. Se `j` for igual a `i`, achamos
o elemento e devemos parar o laço. De resto, é exatamente
a mesma lógica de `remove_first_occurrence`.

```c
linked_list_t* remove_element_at(linked_list_t* head, int i) {
  // Se a lista está vazia ou o 
  // índice é inválido, retorne a lista.
  if (NULL == head || i < 0)
    return head;
  // Caso especial: se i = 0.
  if (i == 0) {
    // Devemos guardar o ponteiro para o próximo.
    linked_node_t* next = head->next;
    // Liberamos o nó.
    free(head);
    // Retornamos o novo início da lista.
    return next;
  }
  // Itere pela lista enquanto o elemento
  // atual não for nulo e j <= i.
  int j = 0;
  linked_node_t* actual, *prev = NULL;
  for (actual = head; actual != NULL; prev = actual, actual = actual->next) {
    if (j++ == i)
      break;
  }
  // Se a lista é menor que i, nada a se fazer.
  if (actual == NULL)
    return head;
  // Devemos guardar o ponteiro para o próximo.
  linked_node_t* next = actual->next;
  // Liberamos o nó.
  free(actual);
  // O elemento anterior deve apontar para o next.
  prev->next = next;
  return head;
}
```

Neste caso, também precisamos liberar o ponteiro do valor
armazenado no nó. Isto pode ser feito da seguinte maneira.

```c
// Assuma que a lista tem elementos.
linked_list_t* lista;
// Queremos o nó de índice 3.
linked_node_t* no_i3 = get_element_at(lista, 3);
// Guardamos o ponteiro do valor.
int* valor_i3 = (int*) no_i3->value;
// Podemos remover o nó no índice 3.
lista = remove_element_at(lista, 3);
// Agora liberamos o valorI3.
free(valor_i3);
```

### Invertendo uma lista

Para inverter uma lista, precisamos iterar por
cada item e fazer com que ele aponte para
seu item anterior. Para isto, enquanto iteramos,
vamos guardando o elemento anterior em uma variável,
fazendo que o atual aponte para o anterior. Também
antes disto, precisamos guardar o ponteiro para
o próximo elemento, para podemos continuar
iterando corretamente. 

```c
linked_list_t* reverse_list(linked_list_t* head) {
  linked_node_t *actual, *prev = NULL, *next = NULL;
  // Itere por todos os itens.
  for (actual = head; actual != NULL; actual = next) {
    // Guardamos o ponteiro para o próximo.
    next = actual->next;
    // Agora, o atual deve apontar para seu anterior.
    actual->next = prev;
    // E o anterior será o atual.
    prev = actual;
  }
  // Prev terá o último elemento da lista,
  // que agora é o primeiro da lista.
  return prev;
}
```

Como este método altera o início da lista, ao chamá-lo,
precisamos utilizar o resultado, que será o começo
novo da lista.

### Imprimindo uma lista

Este é um método não tão importante, mas pode ser
bem útil para os programas. Ele imprime a lista,
iterando por cada elemento e chamando uma
função passada como ponteiro que imprimirá
cada elemento da forma apropriada.

```c
void print_list(linked_list_t* head, void (*print_element)(const void*)) {
  printf("[");
  for (linked_node_t* i = head; i != NULL; i = i->next) {
    (*print_element)(i->value);
    // Aqui verificamos: se não é o
    // ultimo item, imprimimos a vírgula.
    printf("%s", (NULL == i->next) ? "" : ", ");
  }
  printf("]\n");
}
```

### Liberarando da memória uma lista

Sempre que utilizarmos a lista por total,
e não formos mais usá-la, precisamos liberar
os nós da lista. Isto deve ser feito
iterativamente, pois devemos liberar todos
os nós. Se liberássemos apenas o primeiro,
perderíamos a referência para o resto da lista.

Como a lista armazena ponteiros do tipo `void`,
também precisamos liberá-los da memória antes
de liberar o nó em si. No entanto, não
sabemos como liberar o valor. Imagine o seguinte
caso: a lista armazena valores do tipo
`struct filme`, mas dentro desta `struct`
temos ponteiros para outros atributos
alocados dinamicamente. Se liberássemos
somente a `struct`, perderíamos a referência
para estes atributos, e eles ficariam na
área de "lixo" da memória. Para resolver isto,
devemos então pedir como parâmetro uma
função que libere da memória o tipo
armazenado.

Agora, suponha que queremos liberar a lista,
mas, por algum motivo, ainda iremos usar
alguns elementos que buscamos antes. Podemos
criar uma função personalizada que só libera
certos elementos e mantém outros, ou, até
mesmo, passar simplesmente o valor `NULL`
caso quiséssemos que a lista somente
libere os nós da memória e mantivesse
os valores para algum uso futuro.

```c
void free_list(linked_list_t* head, void (*free_element)(void*)) {
  linked_node_t *actual, *next = NULL;
  // Para cada item.
  for (actual = head; actual != NULL; actual = next) {
    // Guardamos o próximo, que será perdido.
    next = actual->next;
    // Se uma função de liberação foi passada, chame-a.
    if (NULL != free_element)
      (*free_element)(actual->value);
    // E agora, podemos liberar o nó.
    free(actual);
  }
}
```

## Um exemplo simples

Agora iremos criar um arquivo principal, o `main.c`,
que fará o uso de nosso arquivo de cabeçalho da lista
ligada e de outras bibliotecas essenciais.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "linkedlist.h"
```

Vamos criar uma Lista Ligada de Animes, para isto,
criaremos uma `struct` que armazenará alguns dados
básicos para cada anime.

```c
typedef struct anime_t anime_t;

struct anime_t {
  int my_anime_list;
  char* title;
  int episode_count;
};
```

Para facilitar, criaremos algumas funções básicas para
trabalhar com nosso novo tipo de dados:

```c
// Função de comparação pelo ID do MyAnimeList.
int compare_animes_mal(const void* a, const void* b) {
  anime_t *anime_a = (anime_t*) a, *anime_b = (anime_t*) b;
  return anime_a->my_anime_list - anime_b->my_anime_list;
}

// Função de impressão do tipo Anime.
void print_anime(const void* anime) {
  anime_t* anime_pointer = (anime_t*) anime;
  printf("%s", anime_pointer->title);
}

// Função de criação de um Anime.
void* create_anime(int mal, char* title, int eps) {
  anime_t* anime = malloc(sizeof(anime_t));

  if (NULL == anime)
    return anime;

  anime->my_anime_list = mal;
  // Aqui precisamos alocar uma nova string
  // para o título de nosso Anime.
  // Precisa ter o tamanho da original + 1
  // para o caractere nulo, '\0'.
  anime->title = malloc(strlen(title) + 1);
  // Agora usamos a strcpy para copiar
  // os conteúdos de title para o title da struct.
  strcpy(anime->title, title);
  anime->episode_count = eps;

  return (void*) anime;
}

// Função de liberação de um anime da memória.
void free_anime(void* anime) {
  anime_t* anime_value = (anime_t*) anime;
  free(anime_value->title);
  free(anime_value);
}
```

Vamos então criar um `main`, onde criaremos
alguns animes, adicionaremos na lista,
removemos algum e, ao fim, liberamos
a lista.

```c
int main(int argc, char** argv) {
  // Vetor com nossos animes.
  void* animes = {
    create_anime(9253, "Steins;Gate", 24),
    create_anime(30484, "Steins;Gate 0", 23),
    create_anime(13601, "Psycho-Pass", 13601),
    create_anime(30, "Neon Genesis Evangelion", 26)
  };
  // Quantidade de itens no vetor.
  int n = 4;
  // Lista Ligada.
  linked_list_t* list = NULL;
  linked_node_t* last = NULL;
  // Para cada item no vetor,
  // vamos adicionar na lista ligada.
  for (int i = 0; i < n; i++) {
    // Pegamos o item criado, ele será
    // o último nó da lista.
    last = insert_after(last, animes[i]);
    // Se list é NULL, então é a primeira
    // iteração, precisamos guardar o início,
    // que será o mesmo do final neste caso.
    if (NULL == list)
      list = last;
  }
  // [Steins;Gate, Steins;Gate 0, Psycho-Pass, Neon Genesis Evangelion]
  print_list(list, &print_anime);

  // Elemento temporário para busca.
  anime_t* search = malloc(sizeof(anime_t));
  // 13601 = Psycho-Pass
  search->my_anime_list = 13601;
  // Nó resultado da busca.
  linked_node_t* result_node = get_first_occurrence(list, (void*) search, 
      &compare_animes_mal);
  // Anime contido dentro do nó resultado.
  anime_t* result = (anime_t*) result_node->value;
  // Result: Psycho-Pass
  printf("Result: %s\n", result->title);

  // Remoção do anime resultado da busca.
  list = remove_first_occurrence(list, result, &compare_animes_mal);
  // [Steins;Gate, Steins;Gate 0, Neon Genesis Evangelion]
  print_list(list, &print_anime);

  // Liberamos os nós, agora é seguro.
  free_list(list, &free_anime);

  return EXIT_SUCCESS;
}
```

Agora vamos compilar nosso código. Sempre que usamos
alguma biblioteca que não seja padrão do compilador,
precisamos passar como argumento ao `gcc` o arquivo
em que os métodos estão implementados.

```bash
$ gcc linkedlist.c main.c -o main
```

Para executá-lo, basta:

```
$ ./main

[Steins;Gate, Steins;Gate 0, Psycho-Pass, Neon Genesis Evangelion]
Result: Psycho-Pass
[Steins;Gate, Steins;Gate 0, Neon Genesis Evangelion]
```

Com isto, podemos verificar o funcionamento de alguns métodos
básicos da lista ligada, além de utilizar um tipo de dados
criado, comprovando o funcionamento genérico da lista.

## Conclusões

A Lista Ligada é uma estrutura relativamente simples
de ser implementada, mas bem poderosa. Possui
diversos usos, como, por exemplo, na implementação
de Pilhas e Filas. Implementamos apenas alguns
métodos, mas a possibilidade é gigante e,
claro, sempre podemos adaptar o uso e a implementação
para as regras de negócio do programa.

Um dos pontos mais legais desta implementação que
fizemos é o fato dela ser "genérica", permitindo
que possamos usar a mesma implementação para
uma lista de qualquer tipo de dados, incluindo
dados mesclados, mesmo que não recomendado.

Esta é uma implementação para fins didáticos,
se você está desenvolvendo uma aplicação, são raros
os casos em que precisamos implementar nossa
versão de alguma estrutura mais comum, geralmente
é mais fácil não reinventar a roda e utilizar
as prontas da linguagem, como `GList` para C
e `LinkedList<>` para Java, por exemplo.

## Bibliografia

- CORMEN, T. H et al. *Algoritmos: Teoria e Prática*, 3ª Edição. Editora Elsevier, 2002.
- Anotações de aula das disciplinas:
  - *Programação Estruturada*, BCC/UFABC;
  - *Algoritmos e Estruturas de Dados I*, BCC/UFABC.
- GeeksForGeeks. *[Function Pointer in C]*.

[Function Pointer in C]: https://www.geeksforgeeks.org/function-pointer-in-c/