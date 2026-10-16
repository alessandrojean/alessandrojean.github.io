---
title: 'Um mês de homelab: minha experiência'
category: Homelab
description: Notas sobre a configuração e uso do meu homelab.
created_at: 2026-10-16
# updated_at: 2026-06-21T11:29:00
tags:
  - homelab
  - self-hosting
---

Há mais ou menos um mês atrás, recondicionei as peças do meu PC anterior para criar meu primeiro _homelab_. Comecei inicialmente apenas remontando em um gabinete :abbr{title="small form factor"}[SFF], e acabei escolhendo o [Bluecase BG-2005](https://www.bluecase.com.br/gabinete-slimdesk-com-fonte-200w-tfx-bg-2005). O principal fator da escolha foi o suporte ao HD de 3,5 polegadas.

O modelo escolhido veio com uma fonte genérica TFX de 200W, mas eu não senti muita confiança nela e acabei depois substituindo por uma de 300W da Seasonic. Essa troca foi uma ótima escolha, visto que reduziu praticamente todo o ruído do _cooler_ da fonte genérica, deixando o _homelab_ praticamente silencioso.

## _Software_

Deixando de lado a parte do _hardware_, para o SO acabei optando pelo Fedora Server, pela familiaridade. Instalar o Docker foi fácil pelo procedimento padrão, talvez a parte mais chata tenha sido configurar manualmente o servidor Samba para copiar os arquivos via rede, mas faz parte.

O Fedora Server veio com um painel de administração do projeto Cockpit, e este vem me ajudando bastante, e em conjunto com o Arcane, evitaram quase que completamente meu uso de SSH.

Eu cheguei a testar no começo o ZimaOS, mas enfrentei alguns problemas de lentidão e travamentos em aplicativos que usam o Intel QuickSync, e não consegui achar o motivo. Além disso, a loja deles constantemente está com os aplicativos em versões não atualizadas, acredito que isso seja uma grande desvantagem.

### Aplicativos

Em relação aos aplicativos, acabei configurando toda a suíte *arr, em conjunto com o já conhecido Jellyfin e o Navidrome. Ainda na parte de mídia, configurei o ErsatzTV para criar meus próprios canais de TV, em conjunto com o Dispatcharr.

Outros aplicativos que acabaram se tornando indispensáveis foram o Papra, para gestão de documentos, e o Memos, que estou usando como uma espécie de diário para anotações pessoais.

## Rede

Quem já passou pela experiência de ter um _homelab_, sabe que é bem inconveniente ter que ficar acessando a máquina pelo IP local e pelas portas de cada aplicativo. Para tentar contornar isso, configurei o Nginx Proxy Manager com um certificado HTTPS auto-assinado, que importei no meu PC principal. Para cada aplicativo, coloquei um _host_ diferente, no esquema `<app>.homelab.internal`.

Como ainda não configurei um serviço de DNS, adicionei manualmente as entradas no arquivo _hosts_ do PC principal. Essa é uma solução temporária, mas pretendo configurar corretamente quando começar a deixar o _homelab_ ligado 24h.

## Experiência e futuro

É muito legal poder ter total confiança nos aplicativos que você mesmo escolheu e configurou. Ainda estou sentindo um pouco a limitação de estar usando uma máquina com pouca RAM, então tenho que escolher bem o que vou rodar.

Uma coisa que vem me incomodando muito porém, é a quantidade de projetos legais que só oferecem suporte ao PostgreSQL. Pensava que a utilização do SQLite em projetos self-hosted era a norma, mas parece que estava enganado.

O processador atual da máquina acaba ainda consumindo muita energia, pois tem TDP de 65W. Meu plano é eventualmente trocar por um da mesma geração, só que com sufixo T, que costumam ter TDP de 35W. Eles tem um pouco menos de _clock_, mas é uma troca válida. Quando fizer essa mudança, finalmente vou deixar ligado 24h, como era a ideia inicial.

A quem se interessar, tem uma foto do projeto no [r/autohospedagem](https://www.reddit.com/r/autohospedagem/s/5HHRZxeuLb).
