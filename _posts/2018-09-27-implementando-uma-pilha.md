---
layout: post
title: "Implementando uma Pilha"
description: 'Implementação utilizando uma Lista Ligada'
date: 2018-09-27 20:44:54
main_category: ed
cover: '/blog/assets/img/series/ed/ed-stack.png'
permalink: /ed/estruturas/pilha/
tags:
  - c
  - implementação
categories:
  - "Estruturas de Dados"
---

Dando continuidade a nossa série de Estruturas de Dados,
agora que implementamos uma Lista Simplesmente Ligada,
vulgo *Linked List*, podemos usá-la para criar uma outra
estrutura, a Pilha, também conhecida como *Stack*.

## Conteúdo
{:.no_toc}

1. Conteúdo
{:toc}

## Definição

A Pilha é uma estrutura que nos permite fazer operações
em $O(1)$ em inserção e remoção. Sua principal característica
é seu comportamento **LIFO**, sigla para ***L**ast **I**n, **F**irst **O**ut*.
Ou seja, o último elemento inserido sempre vai ficar no topo e,
quando formos remover algum elemento, este será o resultado.

Pode-se fazer uma analogia com o mundo real. Em uma pilha de pratos,
o topo da pilha sempre será o último prato que foi colocado e,
para chegarmos até o último prato, precisamos ir desempilhando
os pratos até chegarmos no último, que foi o primeiro a
ser colocado.

Esta é uma estrutura que tem duas implementações usuais: uma
com uma Lista Ligada e outra com vetor. Este *post* abordará
a implementação com *Lista Ligada*. Portanto, iremos
utilizar a mesma Lista Simplesmente Ligada desenvolvida
no primeiro *post* da série.

## Operações

A Pilha possui duas operações que a definem: `empilhar`
e `desempilhar`.

{% include figure.html src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Lifo_stack.png"
   description="Representação simples em execução de uma pilha com operações de empilhar e desempilhar.
                Fonte: Wikipédia." %}

- `empilhar`: também conhecida como *push*, esta operação
  empilha um elemento no topo da pilha;
- `desempilhar`: também conhecida como *pop*, esta operação
  desempilha o elemento do topo da pilha, retornando-o.

Ambas as operações, como explicado anteriormente,
tem complexidade de $O(1)$.

## Criando nosso arquivo de cabeçalho

Seguindo a mesma prática explicada no *post* anterior,
vamos criar um arquivo de cabeçalho para as
definições de estruturas e assinaturas dos métodos
que a Pilha terá. Para isto, iremos criar o
`stack.h`.

### Evitando redefinições

Um erro comum que pode acontecer quando trabalhamos
com arquivos de cabeçalho é, ao incluí-lo em vários
arquivos, ele ser redefinido e o compilador apresentar
um erro e não compilar. Para evitar isto, utilizaremos
uma definição de simbolo e uma diretiva de compilação
no início e fim do arquivo `stack.h`.

```c
#ifndef _H_STACK
#define _H_STACK

// Para a utilização da Lista Ligada.
#include "linkedlist.h"

// Constantes, estruturas, assinaturas de métodos etc. vão aqui.

#endif
```

Em uma explicação simples, o compilador verifica
se não existe algum simbolo definido com o nome `_H_STACK`.
Se for o caso, ele o define e utiliza os conteúdos
do cabeçalho no arquivo final. No entanto, se algum
outro arquivo já incluiu a `stack.h`, o símbolo
`_H_STACK` já estará definido, fazendo com que
o `#ifndef` retorne falso, assim não colocando
o conteúdo do arquivo novamente.

### Estrutura da Pilha

A estrutura da Pilha é relativamente simples, é
apenas uma `struct` que age como um *wrapper*
para uma Lista Ligada. 

```c
typedef struct stack Stack;

struct stack {
  LinkedList * elements;
};
```

Algumas implementações colocam uma variável de
`tamanho` da pilha, para controlar a quantidade
de itens nela, mas este não será o caso, apesar 
de não ser difícil de ser implementado. No entanto,
criaremos uma função que nos retorna a
quantidade de elementos posteriormente.

### Métodos da Pilha

Criaremos sete métodos ao todo. Suas implementações
e explicações de funcionamento serão feitas
posteriormente. Por enquanto, nosso arquivo
de cabeçalho `stack.h`, assim que incluídas
as assinaturas dos métodos, está pronto.

```c
/* Métodos essenciais. */
Stack * create_stack();
int stack_is_empty(Stack * stack);
int stack_size(Stack * stack);
/* Métodos de manipulação. */
void push_to_stack(Stack * stack, void * value);
void * peek_on_stack(Stack * stack);
void * pop_from_stack(Stack * stack);
/* Métodos de liberação. */
void free_stack(Stack * stack, void (* free_element)(void *));
```

## Criando nosso arquivo de implementação

Agora que criamos o cabeçalho com as estruturas
e métodos essenciais para a Pilha, podemos
criar o `stack.c` para implementar os métodos.
Neste arquivo, precisaremos importar tanto
`stack.h`, para a Pilha, quando `linkedlist.h`
para trabalhar com os métodos da Lista Ligada.

```c
/* Utilização de malloc e free. */
#include <stdlib.h>
/* Lista Simplesmente Ligada. */
#include "linkedlist.h"
/* Nosso cabeçalho. */
#include "stack.h"
```

Na hora da compilação posteriormente, podemos
não necessariamente ter os arquivos da
Lista Ligada no mesmo diretório, até porque
seria uma bagunça. Então, no devido momento,
informaremos ao compilador onde encontrar
os arquivos da Lista Ligada.

### Criando uma Pilha

Criar a pilha consiste em alocarmos dinamicamente
uma `Stack`, que nada mais é do que uma `struct stack`
e definirmos o seu atributo `elements` para `NULL`,
para indicar que a pilha não possui nenhum elemento
e está vazia.

```c
Stack * create_stack() {
  // Alocamos dinamicamente uma Stack.
  Stack * newStack = malloc(sizeof(Stack));
  // Se ocorreu algum erro, por falta
  // de memória ou similares, retornamos NULL.
  if (newStack == NULL)
    return NULL;
  // Definimos que não há elementos.
  newStack->elements = NULL;

  return newStack;
}
```

Uma solução para tratar os erros que possam
acontecer é sempre verificar o resultado
das operações. Para isto que retornamos
`NULL` caso algo dê errado, para quem
estiver utilizando a biblioteca poder
saber e tratar o erro. Uma implementação
seria verificar o retorno e imprimir
uma mensagem de erro e, por exemplo,
tentar criar novamente ou sair do programa.

```c
// Tenta criar a pilha.
Stack * stack = create_stack();
// Verifica se teve erros.
if (stack == NULL) {
  // Imprime na saída de erros.
  fprintf(stderr, "Não há memória, erro de alocação.\n");
  // Saímos do programa, indicando que deu erro.
  exit(EXIT_FAILURE);
}
```

### Verificando se a pilha está vazia

É importante haver alguma maneira de verificar
se a pilha contém elementos. Geralmente,
usam-se pilhas em laços de repetição,
onde podem acontecer casos que precisamos
continuar iterando enquanto a pilha
não estiver vazia. 

Bem, verificar isto não é difícil. Basta
verificar se a pilha em si não é nula
ou se `elements` é `NULL`, o que indica
que não há itens na Lista Ligada. 

```c
int stack_is_empty(Stack * stack) {
  return stack == NULL || stack->elements == NULL;
}
```

A ordem da operação lógica `ou` aqui é importante.
Se a `stack` for nula, a operação `ou` já terá
um valor `true`, e, neste caso, na implementação
da Linguagem C, ela nem verifica as outras
condições do `ou`, assim não teremos
um *Segmentation Fault* tentando acessar
`elements` de um conteúdo nulo. Em resumo,
a segunda condição só será testada se a
primeira retornar `false`.

### Obtendo a quantidade de itens na pilha

Ora, já temos um método que nos permite
verificar se a lista está vazia. Neste caso,
é óbvio, a lista não possui elementos,
logo seu tamanho é `0`. Se não for o caso,
basta iterar por todos os nós da Lista
Ligada e ir incrementando uma variável
contadora.

```c
int stack_size(Stack * stack) {
  // Se a pilha está vazia, 0 elementos.
  if (stack_is_empty(stack))
    return 0;

  int size = 0;
  // Para cada nó da lista ligada,
  // incrementaremos size em 1.
  for (LinkedNode * i = stack->elements; i != NULL; i = i->next, size++);

  return size;
}
```

Desta forma, o método tem complexidade $O(n)$. Isto
pode ser evitado se você criar um atributo
a mais na estrutura da Pilha, digamos `size`.
Então, cada vez que um elemento for empilhado,
incrementa-se este atributo. Quando algum
elemento for desempilhado, decrementa-se.

No entanto, como o C não é orientado a
objetos, e não podemos encapsular o atributo,
quem estiver usando a biblioteca poderia
chegar em alguma Pilha e simplesmente alterar
o tamanho. Até onde eu saiba, não há como
impedir isto. Portanto, optei por criar
um método que conta quantos elementos há mesmo.

### Empilhando um elemento

Empilhar um elemento na pilha consiste em colocá-lo
no topo da mesma. Isto pode ser feito utilizando
o método de inserção no início da Lista Ligada.
Quando inserimos um elemento no início da Lista,
consequentemente alteramos o início dela. Portanto,
precisamos obter o resultado do método, que é
o início novo, e substituir o antigo início
da Pilha pelo novo, que agora contém o elemento
mais recente inserido.

```c
void push_to_stack(Stack * stack, void * value) {
  // Se a Pilha é nula, nada a se fazer.
  if (stack == NULL)
    return;
  // Inserimos no início da lista ligada.
  LinkedNode * newNode = insert_at_start(stack->elements, value);
  // Agora pegamos o novo início da lista
  // e redefinimos o início dos elementos
  // na pilha.
  stack->elements = newNode;
}
```

Esta versão do método é relativamente curta pois
já desenvolvemos na Lista Ligada um método
com o comportamento igual ao `push`. 
Então esta função serve mais como um *wrapper*
para a outra.

### Espiando o topo da Pilha

Este método serve para quando queremos apenas
observar, obter o valor do elemento ao topo
da pilha, mas não queremos removê-lo de lá.
Sua implementação é curta e simples de entender.

```c
void * peek_on_stack(Stack * stack) {
  if (stack_is_empty(stack))
    return NULL;
  // Retornamos o conteúdo do topo.
  return stack->elements->value;
}
```

Muitas vezes esse método é usado quando queremos
primeiro avaliar se precisaremos usar o elemento
do topo, se sim, aí de fato nós o desempilhamos.

### Desempilhando um elemento

Quando queremos desempilhar o elemento do topo da
lista, utilizamos a função `pop`. O que ela faz
é retirar o primeiro nó da Lista Ligada, definir
o começo novo dela como o próximo item, isto é,
o item que o topo aponta, seja este `NULL` ou não.
Então, após pegar seu valor e liberar da memória
o nó, retornamos ele.

```c
void * pop_from_stack(Stack * stack) {
  if (stack_is_empty(stack))
    return NULL;
  // Pegamos o nó do elemento do topo.
  LinkedNode * top = stack->elements;
  // Removemos ele da lista, definindo
  // o começo dela como o próximo item.
  stack->elements = top->next;
  // Pegamos o valor do item.
  void * value = top->value;
  // Agora podemos liberar o nó da lista.
  free(top);

  return value;
}
```

A razão de não usarmos um método de remoção
da Lista Ligada, como o de remoção por índice,
é porque nós precisamos do valor que o nó
contém. As funções de remoção não nos retornam
o nó removido, e sim o possível novo começo
da lista.

### Liberando a Pilha da memória

Após o seu uso, para liberarmos uma pilha
da memória, basta liberar a Lista Ligada,
utilizando a função de liberação individual
do tipo de dados que é passada como referência
e depois liberar a pilha em si.

```c
void free_stack(Stack * stack, void (* free_element)(void *)) {
  if (stack == NULL)
    return;
  // Basta liberarmos a lista ligada, com
  // a função respectiva do tipo de dados.
  free_list(stack->elements, free_element);
  // Agora podemos liberar a pilha em si.
  free(stack);
}
```

Assim como na Lista Ligada, se não queremos
liberar os valores, mas sim apenas a estrutura,
basta passarmos `NULL` como valor do
segundo parâmetro.

## Um exemplo simples: expressões pós-fixas

Expressões pós-fixas representam alguma expressão
matemática na forma `<a><b><op>`, onde `a` e `b`
são números e `op` é a operação matemática.
Uma vantagem desta notação é que ela não necessita
do uso de parêntesis para priorizar os elementos.
Um exemplo de equivalência:

```
  Infixa: ((5 + 4) * 9) / 2
Pós-fixa: 54+9*2/
```

É muito fácil resolver expressões nesta notação
se utilizarmos uma Pilha. A lógica é a seguinte:
se percorre a `string` com a expressão e verifica-se
cada caractere. Se é um número, empilhe-o na pilha.
Se for um operador, desempilhe dois números da pilha,
realize o cálculo e empilhe o resultado na pilha.
Ao fim, se a pilha conter mais de um item ou
estiver vazia, a expressão é inválida. Caso contrário,
o único elemento restante na pilha é o resultado final.
Você pode observar o funcionamento da pilha abaixo:

```
Expressão: 54+9*2/

Caractere [0]: 5, empilhe
| 5 |

Caractere [1]: 4, empilhe
| 4 | 5 |

Caractere [2]: +, desempilhe 2, resultado empilhe
b: 4, a: 5 -> 4 + 5 = 9
| 9 |

Caractere [3]: 9, empilhe
| 9 | 9 |

Caractere [4]: *, desempilhe 2, resultado empilhe
b: 9, a: 9 -> 9 * 9 = 81
| 81 |

Caractere[5]: 2, empilhe
| 2 | 81 |

Caractere[6]: /, desempilhe 2, resultado empilhe
b: 2, a: 81 -> 81 / 2 = 40 (divisão inteira)
| 40 |
```

Como pode-se perceber, é bem simples a lógica para
resolver estas expressões. Se a expressão for inválida e,
por exemplo, conter menos que dois números para uma
operação, tentaremos fazer um `pop` e a pilha
estará vazia. Neste caso, sabemos que a expressão
é inválida.

### Implementação

Iremos incluir em nosso `main.c`, além das
bibliotecas padrões, nosso cabeçalho `stack.h`.
Vamos também definir duas mensagens de erro.

```c
#include <stdio.h>
#include <stdlib.h>
#include "stack.h"

#define INV_EXP "Expressão Inválida"
#define INV_OP "Operador Inválido"
```

Vamos também criar algumas funções auxiliares
para o funcionamento da lógica.

```c
void * create_int(int value);
int * calculate(char * expression);
void extract_numbers(Stack * stack, int * a, int * b);
int * do_operation(char operation, int a, int b);
void print_error(char * message, Stack * stack);
```

Agora podemos desenvolver e dar um foco em
explicar o funcionamento e função de cada uma.

### Criar um ponteiro para um inteiro arbitrário

Essa função ajudará a, dado um valor inteiro
já existente, criar uma cópia dele e obter o ponteiro.

```c
void * create_int(int value) {
  int * vl = malloc(sizeof(int));
  *vl = value;

  return (void *) vl;
}
```

Neste caso, estamos ignorando os possíveis erros
que o `malloc` pode gerar, mas, lembre-se
de sempre checar se o resultado da função
não é `NULL`.

### Imprimindo erros e finalizando o programa

Sempre que algum tipo de erro acontecer,
seja por ser uma expressão inválida por
ser incompleta ou por usar operadores
inválidos, chamaremos essa função com
a mensagem que queremos imprimir na saída
padrão de erros, a `stderr`, junto com
a `Stack` para ser liberada antes de
finalizar o programa.

```c
void print_error(char * message, Stack * stack) {
  fprintf(stderr, message);
  free_stack(stack, &free);
  exit(EXIT_FAILURE);
}
```

Neste caso, estamos armazenando ponteiros
para `int` dentro da Pilha. Então não é necessário
criar uma função para liberar cada elemento,
podemos passar por referência a própria função
`free` do C.

### Calculando uma operação

Esta função faz a simples aplicação
de uma das quatro operações elementares
em dois números `a` e `b`.

```c
int * do_operation(char operation, int a, int b) {
  switch (operation) {
    case '+':
      return create_int(a + b);
    case '-':
      return create_int(a - b);
    case '*':
      return create_int(a * b);
    case '/':
      return create_int(a / b);
    default:
      return NULL;
  }
}
```

Sempre que atingirmos um operador na interpretação
da `string`, desempilharemos dois elementos
da Pilha e faremos a operação com eles.

### Desempilhando números da Pilha

Quando atingirmos um operador, chamaremos esta
função para desempilhar dois números da pilha
para nós. Se eventualmente ele tentar extrair
de uma Pilha vazia, automaticamente a função
de erro será chamada e o programa finalizado.

```c
void extract_numbers(Stack * stack, int * a, int * b) {
  // Temos que desempilhar ao contrário,
  // por causa da propriedade LIFO.
  int * numB = (int *) pop_from_stack(stack),
      * numA = (int *) pop_from_stack(stack);
  // Se a pilha estava vazia, deu erro, expressão inválida.
  if (numA == NULL || numB == NULL)
    print_error(INV_EXP, stack);
  // Defina os valores de a e b.
  *a = *numA;
  *b = *numB;
}
```

O interessante a se observar é que os dois
números devem ser extraídos na ordem inversa
por causa da propriedade **LIFO**. Ou seja,
eles estarão armazenados na ordem `b`, `a`.

### Calculando a expressão

Esta é a função principal do processamento
do programa. Ela recebe como parâmetro
uma `string` e faz o processamento,
retornando um ponteiro para um
`int`, que contém o resultado se a
expressão é válida. Caso contrário,
também chama a função de erro.

```c
int * calculate(char * expression) {
  Stack * stack = create_stack();
  char curr;
  int a, b;
  // Para cada caractere na string.
  for (int i = 0; expression[i] != '\0'; i++) {
    curr = expression[i];
    // Se é um dígito de 0 a 9, adicione o
    // número na pilha.
    if (curr >= '0' && curr <= '9') {
      push_to_stack(stack, create_int(curr - '0'));
    } 
    // Se for um dos quatro operadores, efetue
    // o cálculo com os números da pilha.
    else if (curr == '+' || curr == '-' || curr == '*' || curr == '/') {
      // Desempilha dois números em a e b.
      extract_numbers(stack, &a, &b);
      // Faz a operação encontrada em a e b.
      int * res = do_operation(curr, a, b);
      // Empilha de volta na pilha.
      push_to_stack(stack, res);
    } 
    // Encontrou algum caractere inválido.
    else {
      print_error(INV_OP, stack);
    }
  }
  // No fim, se a pilha estiver vazia,
  // ou tiver mais de dois elementos,
  // a expressão é inválida também.
  if (stack_is_empty(stack) || stack_size(stack) > 1)
    print_error(INV_EXP, stack);
  // Desempilha o último elemento,
  // que agora é o resultado.
  int * result = (int *) pop_from_stack(stack);
  // Libera a Pilha da memória,
  // mas NÃO os elementos.
  free_stack(stack, NULL);

  return result;
}
```

Sempre que tivermos uma expressão em uma `string`
e quisermos tentar calculá-la, basta chamarmos
esta função.

### Função principal

Agora que criamos todas as funções de processamento,
podemos criar o nosso `main` e calcular as expressões.
Desta vez, vamos fazer com que o programa obtenha
a expressão dos parâmetros de chamada, ou seja,
da variável `argv`.

```c
int main (int argc, char **argv) {
  // Verificamos se o usuário passou o
  // parâmetro da expressão, senão
  // imprimimos uma ajuda e finalizamos.
  if (argc < 2) {
    printf("Uso inválido.\nSintaxe: ./stack expressao\n");
    return EXIT_FAILURE;
  }
  // Obtemos a expressão.
  char * expression = argv[1];
  // E calculamos ela, obtendo o possível resultado.
  int * result = calculate(expression);

  printf("Resultado: %d\n", *result);  
  // Não vamos mais usar o resultado,
  // devemos liberá-lo da memória.
  free(result);

  return EXIT_SUCCESS;
}
```

Com o uso de uma Pilha, conseguimos facilmente resolver
uma expressão pós-fixa.

### Compilando

Agora que estamos usando mais de um arquivo de cabeçalho,
`linkedlist.h`, que está em outro diretório, e `stack.h`,
devemos informar ao compilador onde encontrar os
arquivos de cabeçalho e devemos passar também
a localização do arquivo `linkedlist.c` que implementa
a Lista Simplesmente Ligada.

Para isto, devemos usar a *flag* `-I` do `gcc`. Ela
informa ao compilador que também deve olhar
a pasta informada ao procurar pelos arquivos
de cabeçalho. No meu caso, a Lista Ligada
está em uma pasta um nível acima, portanto
usaríamos a *flag* assim:

```
-I../linked-list/
```

O caminho dos arquivos de cabeçalho deve ser
colocado logo após o `I`, não deve ter
espaços entre ele e a *flag*. Agora, podemos
juntar tudo e compilar nosso programa.

```bash
$ gcc main.c stack.c ../linked-list/linkedlist.c -o main -I../linked-list/
```

Quando estamos trabalhando com vários
arquivos de cabeçalho, torna-se mais
prático utilizar um *Makefile*. Não
é o intuito deste *post* explicar
sua utilização, mas pretendo fazer um
futuramente sobre.

## Implementações prontas

Em Java, nós temos a `Stack` que já
implementa as funções essenciais para o funcionamento.
Similarmente, em C++, temos a `stack`. Abaixo você
encontra um exemplo de uso em Java.

```java
import java.util.Stack;
import java.util.Arrays;

class Main {
  public static void main(String[] args) {
    // Criamos uma pilha de inteiros.
    Stack<Integer> pilha = new Stack<>();
    // Agora adicionamos os elementos 1, 2, 3.
    pilha.addAll(Arrays.asList(1, 2, 3));
    // Enquanto tiver elementos na pilha.
    while (!pilha.empty()) {
      // Desempilhe-os e imprima.
      System.out.println(pilha.pop());
    }
  }
}
```

Recomenda-se sempre que utilize as implementações
prontas das linguagens quando desenvolver aplicações.
As implementações das linguagens já foram utilizadas
por muitas pessoas e, na maioria das vezes, as
linguagens, por serem *open source*, contribuem
fazendo com que desenvolvedores aprimorem e deixem
cada vez mais estas implementações mais eficientes.

## Conclusões

A Pilha é uma estrutura de dados que possui inúmeras
utilidades. Ela é a principal base da recursão
nas linguagens de programação. Quando excedemos
demais o limite da Pilha de recursão, a linguagem
emite uma exceção, a `StackOverflow`, origem
do nome do famoso site de perguntas e respostas
de programação.

A implementação feita neste *post* é feita
com uma Lista Ligada, mas tradicionalmente
utiliza-se um vetor, onde guarda-se o índice
do elemento do topo, que também é o indicador
de tamanho de elementos na pilha, e vai
incrementando ou decrementando quando
empilhamos e desempilhamos, respectivamente.

## Bibliografia

- CORMEN, T. H et al. *Algoritmos: Teoria e Prática*, 3ª Edição. Editora Elsevier, 2002.
- Anotações de aula das disciplinas:
  - *Algoritmos e Estruturas de Dados I*, BCC/UFABC.