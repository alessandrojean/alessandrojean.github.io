---
layout: post
title: "Implementando uma Fila"
description:
date: 2018-12-16 22:35:58
main_category: ed
permalink: /ed/estruturas/fila/

tags:
  - c
  - implementação
categories:
  - "Estruturas de Dados"
---

Depois de um tempo, vamos finalmente retomar a série de 
Estruturas de Dados. Dando continuidade, a próxima estrutura
é a Fila, conhecida também como *Queue*, e, assim como a Pilha, 
também será implementada com uma Lista Simplesmente Ligada.

## Conteúdo

{:.no_toc}

1. Conteúdo
{:toc}

## Definição

A Fila é uma estrutura que permite operações em $O(1)$ em suas 
operações de inserção e remoção. Possui um comportamento FIFO 
[^fifo], ou seja, o primeiro elemento a entrar na fila será 
consequentemente o primeiro a sair da fila.

> Filas são conjuntos dinâmicos onde o elemento removido 
> do conjunto pela operação `delete` é pré-especificado. 
> Em uma **fila**, o elemento removido é sempre aquele que 
> está no conjunto há mais tempo: a fila implementa uma 
> política *first-in, first-out*, ou **FIFO**. 
>
> <cite>CORMEN, T. H et al</cite>

Existem algumas implementações usuais: utilizando um vetor 
sequencial, um vetor circular e a Lista Ligada. Como dito
anteriormente, este artigo visa implementar esta estrutura 
com uma Lista Simplesmente Ligada, já implementada anteriormente.

[^fifo]: Sigla para *First-In, First-Out*.

## Operações

A Fila possui duas operações que caracterizam-a: 
`enfileirar` e `desenfileirar`.

- `enfileirar`: também conhecida como *enqueue*, esta operação 
  adiciona o novo elemento ao fim da fila;
- `desenfileirar`: também conhecida como *dequeue*, esta operação 
  remove o primeiro elemento da fila e o retorna.

Ambas as operações podem ser feitas em tempo $O(1)$.

## Criando o arquivo de cabeçalho

Assim como os outros artigos da série, vamos criar um arquivo 
de cabeçalho para a implementação da Fila, o `queue.h`.

```c
// queue.h

#ifndef QUEUE_H_
#define QUEUE_H_

// Para o tipo bool.
#include <stdbool.h>

// Precisamos utilizar a Lista Ligada.
#include "linkedlist.h"

#endif // QUEUE_H_
```

### Estrutura da Fila

A estrutura da Fila possui dois atributos base: o início e fim. 
Ambos são ponteiros para um nó da Lista Ligada.

```c
// queue.h

typedef struct queue_t queue_t;

struct queue_t {
  linked_node_t* start;
  linked_node_t* end;
};
```

É um padrão, no entanto não tão comum, utilizar o sufixo `_t`, 
que vem de *type*, quando se define algum tipo de dados em C,
por isto, o utilizamos para explicitar que `queue_t` é um 
tipo de dados.

### Métodos da Fila

Assim como a Pilha, a implementação da Fila também terá ao 
todo oito métodos, com propósitos parecidos.

```c
// queue.h

// Métodos essenciais.
queue_t* queue_create();
bool queue_is_empty(queue_t* queue);
int queue_size(queue_t* queue);
// Métodos de manipulação.
void queue_enqueue(queue_t* queue, void* data);
void* queue_start(queue_t* queue);
void* queue_end(queue_t* queue);
void* queue_dequeue(queue_t* queue);
// Métodos de liberação da memória.
void queue_free(queue_t* queue, void (*free_element)(void*));
```

## Implementando os métodos

Agora, precisamos criar o arquivo de implementação do cabeçalho, 
o `queue.c`. Precisamos importar alguns cabeçalhos essenciais para 
seu funcionamento.

```c
// queue.c

// Utilização do malloc e free.
#include <stdlib.h>
// Tipo bool.
#include <stdbool.h>
// Lista Simplesmente Ligada.
#include "linkedlist.h"
// Métodos da Fila.
#include "queue.h"
```

### Criando uma Fila

Para criar uma nova Fila, precisamos alocar dinamicamente uma
`queue_t`, definindo ambos `start` e `end` como `NULL`, para 
definir que a fila não possui elementos em seu conjunto.

```c
// queue.c

queue_t* queue_create() {
  // Alocamos dinamicamente uma queue_t.
  queue_t* new_queue = malloc(sizeof(queue_t));
  // Verificamos se conseguimos alocar.
  if (NULL == new_queue) return NULL;
  // A fila está vazia.
  new_queue->start = NULL;
  new_queue->end = NULL;
    
  return new_queue;
}
```

Aqui outro padrão comum é sempre colocar a constante na parte 
esquerda da comparação, para evitar uma atribuição indesejada.
Por exemplo, poderíamos ter escrito `new_queue = NULL`, que 
atribuiria `NULL` a `new_queue` e então a comparação retornaria 
`false`. Mas este não é o comportamento que queremos, queremos 
apenas verificar se `new_queue` é `NULL`, então devemos usar 
o `==`. Colocando a constante do lado esquerdo, caso apenas um 
igual seja digitado, o compilador reclamará e indicará facilmente 
seu erro, já que não é possível atribuir um valor a uma constante.

### Verificando se a Fila tem elementos

Este é um método relativamente simples, e sua função é
facilmente entendível.

```c
// queue.c

bool queue_is_empty(queue_t* queue) {
  return NULL == queue || NULL == queue->start;
}
```

Aqui um "truque" de comparação é utilizado. O compilador 
analiza o `ou` da esquerda para a direita na execução. 
Ou seja, se a fila for `NULL`, ele já retornará `true` e
não tentará acessar o atributo `start` da fila, que geraria
uma falha de segmentação.

### Tamanho da Fila

Para obter quantos elementos há na fila, basta contá-los.

```c
// queue.c

int queue_size(queue_t* queue) {
  if (queue_is_empty(queue)) return 0;
  
  int size = 0;
  for (linked_node_t* i = queue->start;
       i != NULL; i = i->next, size++);
  
  return size;
}
```

Não é uma prática muito comum, mas o `for` pode não ter um 
corpo de comandos. Estamos utilizando sua própria estrutura 
para incrementar a variável contadora.

Como temos que iterar por todos os elementos da Lista Ligada, 
o método possui complexidade linear, ou seja, $O(n)$.

### Enfileirando um elemento

Para adicionar um novo elemento ao fim da fila, precisamos 
fazer com que o último elemento aponte para o novo e atualizar 
então o ponteiro do último.

```c
// queue.c

void queue_enqueue(queue_t* queue, void* data) {
  if (NULL == queue) return;
  // Inserimos após o final.
  linked_node_t* el = insert_after(queue->end, data);
  // Agora redefinimos o final.
  queue->end = el;
}
```

Como já desenvolvemos um método de inserir após um nó 
arbitrário na Lista Ligada, apenas reaproveitamos. Ele 
já se encarrega de criar um novo nó dinamicamente e 
manipular os ponteiros para nós.

### Espiando o início da Fila

Quando queremos apenas observar quem é o primeiro 
elemento da Fila, mas sem removê-lo do conjunto, 
utilizamos este método.

```c
// queue.c

void* queue_start(queue_t* queue) {
  if (queue_is_empty(queue)) return NULL;
  return queue->start->value;
}
```

Você pode se perguntar porque criar um método que 
apenas retorna um atributo da estrutura, sendo que 
pode-se acessá-lo diretamente. Bem, é apenas um método 
de deixar o código um pouco mais legível e implementar 
(bem porcamente) uma espécie de orientação a objetos em C.

### Espiando o fim da Fila

Similar ao método anterior, apenas acessamos o final e o retornamos.

```c
// queue.c

void* queue_end(queue_t* queue) {
  if (queue_is_empty(queue)) return NULL;
  return queue->end->value;
}
```

### Desenfileirando um elemento

Este método faz a fila avançar, removendo o início e o retornando.

```c
// queue.c

void* queue_dequeue(queue_t* queue) {
  if (queue_is_empty(queue)) return NULL;
  // Guardamos o início da fila.
  linked_node_t* start = queue->start;
  // Andamos a fila.
  queue->start = start->next;
  // Pegamos o valor.
  void* value = start->value;
  // Agora podemos liberar da memória.
  free(start);
  
  return value;
}
```

O funcionamento é exatamente igual uma fila na vida real. 
Pegamos o primeiro elemento, que está na fila há mais tempo,
e a fila anda.

### Liberando a Fila da memória

Precisamos sempre liberar da memória a estrutura após 
ter terminado o seu uso. 

```c
// queue.c

void queue_free(queue_t* queue, void (*free_element)(void*)) {
  if (NULL == queue) return;
  // Basta liberarmos a lista ligada.
  free_list(queue->start, free_element);
  // E depois liberarmos a fila.
  free(queue);
}
```

Ao contrário de outras linguagens, o C não possui um 
coletor de lixo, ou seja, as variáveis e seus conteúdos 
ficarão sempre em uso e não serão automaticamente liberadas 
após um tempo de inatividade. Se não liberarmos, nosso 
programa sempre estará utilizando esta memória, que poderia 
ser utilizada para outras coisas.

## Um caso-exemplo simples

Desta vez, implementaremos utilizaremos a fila para, bem, 
representar uma fila na vida real, como, por exemplo, a 
de um mercadinho.

Para implementar, precisamos incluir as bibliotecas, assim 
como definir um macro para obter o tamanho de um vetor.

```c
// main.c

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "queue.h"

#define ARRAY_SIZE(x) sizeof(x) / sizeof(x[0])
```

### A estrutura base

Bem, a fila é composta por pessoas. Para isto, vamos 
representar de uma maneira simples uma pessoa.

```c
// main.c

typedef struct person_t person_t;
struct person_t {
  char name[50];
  int age;
};
```

### O método principal

Nosso programa consiste em uma simples simulação de uma fila 
de um caixa de um mercadinho. Para isto, criaremos as pessoas, 
enfileiraremos elas e logo após iremos atendendo, esvaziando 
a fila. Os códigos a seguir devem serem escritos no método `main`.

Primeiramente, precisamos criar algumas pessoas. Para 
facilitar o processo de enfileiramento, é mais fácil criar 
um vetor e iterar por ele, enfileirando.

```c
person_t pessoa1 = { "Beatriz", 20 };
person_t pessoa2 = { "Pedro", 10 };
person_t pessoa3 = { "Larissa", 25 };

person_t pessoas[] = {pessoa1, pessoa2, pessoa3};
int n = ARRAY_SIZE(pessoas);
```

Agora, precisamos criar a fila e iterar pelo vetor `pessoas`, 
enfileirando o elemento na fila.

```c
queue_t* queue = queue_create();
// Enfileiraremos as pessoas na fila.
for (int i = 0; i < n; i++) {
  queue_enqueue(queue, &pessoas[i]);
}
```

Agora que a fila está formada, podemos simular o atendimento 
da fila do caixa.

```c
// Enquanto há pessoas na fila, atenda-as.
while (!queue_is_empty(queue)) {
  person_t* pessoa = (person_t*) queue_dequeue(queue);
  printf("Atendendo %s, que tem %d anos.\n", pessoa->name, pessoa->age);
  // Como não vamos mais usar, já liberamos.
  free(pessoa);
}
```

E não podemos esquecer de liberar a estrutura após seu uso. 
Como já liberamos todos os elementos, podemos passar `NULL` 
como a função de liberação do item.

```c
// Agora liberamos a fila.
queue_free(queue, NULL);
```

### Compilando

Para compilar, precisamos *linkar* os arquivos de implementação. 
Desta vez, estou considerando que os arquivos da Lista Ligada 
estão no mesmo diretório.

```bash
# Compila o arquivo main.
gcc -o main main.c queue.c linkedlist.c
# Executa-o.
./main
```

Torna-se mais fácil utilizar um *Makefile*, como eu expliquei 
no artigo anterior. Pretendo em breve fazer um outro artigo 
explicando a criação de um simples para C/C++.

## Implementações em bibliotecas padrões

Desta vez, um exemplo da biblioteca padrão do C++ para a fila.

```cpp
#include <iostream>
#include <queue>

using namespace std;

int main() {
  queue<int> fila;
  // Em C++, o método push é o enfileirar.
  fila.push(1);
  fila.push(2);
  
  cout << "Nº de elementos: " << fila.size() << endl;
  
  // Desenfileirando o início.
  cout << "Início: " << fila.pop() << endl;
  
  return EXIT_SUCCESS;
}
```

## Conclusões

A Fila é uma estrutura fundamental para o estudo de Estruturas 
de Dados. Seus métodos de manipulação possuem complexidade $O(1)$. 
A implementação feita é uma simples, no entanto, a Fila possui 
algumas variações, como a Fila de Prioridades, implementada com 
*heaps*, outra estrutura que não pretendo abordar.



## Bibliografia

- CORMEN, T. H. et al. *Algoritmos: Teoria e Prática*, 3ª Edição. 
  Editora Elsevier, 2002.
- Anotações de aula das disciplinas:
  - *Algoritmos e Estruturas de Dados I*, BCC/UFABC.
