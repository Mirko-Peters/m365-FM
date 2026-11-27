# SEO metadata

| Field | Value |
|---|---|
| Meta title | Kanban na Manufatura: Sistema Pull Lean, Dimensionamento, Regras |
| Meta description | Kanban na manufatura explicado: como funciona um sistema kanban como pull lean, tipos de cartão, fórmula do kanban, e-kanban, CONWIP, implantação e KPIs. |
| Slug | `kanban-pull-system` |

# Sistema Kanban na Manufatura: Como Funcionam os Sistemas Pull, Como Dimensioná-los e Quando Usar Outra Abordagem

> **Resposta curta:** Um sistema kanban é uma forma de controle de produção e de movimentação de materiais baseada em puxada, na qual um sinal (um cartão, um recipiente vazio ou uma mensagem eletrônica) autoriza um processo a montante a fabricar ou movimentar uma quantidade fixa somente depois que o processo a jusante a tiver consumido. O número de sinais em um circuito limita o estoque. O Lean Enterprise Institute define um kanban como "um dispositivo de sinalização que dá autorização e instruções para a produção ou retirada (transporte) de itens em um sistema puxado" [1]; o método foi desenvolvido na Toyota por Taiichi Ohno [7][10].

> **Principais pontos**
> - Um sistema puxado é definido por uma única propriedade: ele limita explicitamente o trabalho em processo (WIP) [2]. O kanban é o sistema puxado mais conhecido, mas CONWIP, POLCA e drum-buffer-rope também se enquadram nessa definição.
> - O kanban de manufatura (cartões, recipientes, supermercados) não é o mesmo que um quadro Kanban de software, embora o método de quadro tenha sido derivado dele [22].
> - Tipos principais: kanban de produção, kanban de retirada (movimentação), kanban de sinalização (triângulo) e kanban de fornecedor [1]. Sistemas de dois recipientes e e-kanban são formas física e digital da mesma lógica.
> - Dimensionamento básico: número de kanbans = demanda × lead time de reposição × (1 + fator de segurança) ÷ quantidade do recipiente, arredondado para cima. Circuitos reais também precisam de kanbans para os intervalos de coleta e para os tamanhos de lote a montante [12][13][15].
> - O kanban exige demanda estável e repetitiva por número de peça, trocas rápidas e processos confiáveis. Para trabalhos de alto mix e baixo volume, CONWIP ou POLCA geralmente se adequam melhor [3][20].
> - ERP/MRP e kanban não são concorrentes: o MRP planeja capacidade e materiais de lead time longo, enquanto o kanban executa a reposição diária. A maioria dos sistemas ERP possui um módulo de kanban com sua própria fórmula de dimensionamento [15][16].
> - O kanban elimina o excesso de estoque; buffers estratégicos contra interrupções são uma decisão de risco separada. A própria Toyota mantém um buffer deliberado de semicondutores desde um plano de continuidade introduzido após 2011 [26].

## Sumário

1. [O que é um sistema kanban?](#o-que-é-um-sistema-kanban)
2. [Kanban de manufatura vs. quadros Kanban: esclarecendo a confusão nas buscas](#kanban-de-manufatura-vs-quadros-kanban-esclarecendo-a-confusão-da-busca)
3. [Empurrar vs. puxar: o que realmente é um sistema puxado](#empurrar-vs-puxar-o-que-é-realmente-um-sistema-puxado)
4. [História: da oficina de usinagem da Toyota à prática global](#história-da-oficina-de-máquinas-da-toyota-à-prática-global)
5. [Como funciona um circuito kanban, passo a passo](#como-funciona-um-ciclo-kanban-passo-a-passo)
6. [Tipos de kanban](#tipos-de-kanban)
7. [As seis regras do kanban da Toyota](#as-seis-regras-do-kanban-da-toyota)
8. [Como calcular o número de kanbans: fórmulas e exemplos práticos](#como-calcular-o-número-de-kanbans-fórmulas-e-exemplos-resolvidos)
9. [Supermercados, linhas FIFO e o processo marcapasso](#supermercados-filas-fifo-e-o-processo-marca-passo)
10. [Heijunka: nivelando o programa do qual o kanban depende](#heijunka-nivelando-o-programa-do-qual-o-kanban-depende)
11. [Além do kanban: CONWIP, POLCA e drum-buffer-rope](#além-do-kanban-conwip-polca-e-drum-buffer-rope)
12. [E-kanban e a integração ERP/MRP](#e-kanban-e-a-interação-erpmrp)
13. [Modelos: cartão, planilha de dimensionamento, checklist de supermercado, auditoria](#modelos-cartão-planilha-de-dimensionamento-checklist-de-supermercado-auditoria)
14. [Como implementar kanban na manufatura: um roteiro de 26 semanas](#como-implementar-kanban-na-manufatura-um-roteiro-de-26-semanas)
15. [KPIs de kanban e a visão financeira](#kpis-de-kanban-e-a-visão-financeira)
16. [Erros comuns com kanban e como corrigi-los](#erros-comuns-com-kanban-e-como-corrigi-los)
17. [Limites: quando o kanban é a ferramenta errada](#limites-quando-o-kanban-é-a-ferramenta-errada)
18. [Glossário de kanban](#glossário-de-kanban)
19. [FAQ: perguntas sobre sistema kanban e sistema puxado](#faq-perguntas-sobre-sistema-kanban-e-sistema-puxado)
20. [Conclusão e primeiros passos](#conclusão-e-primeiros-passos)

## O que é um sistema kanban?

Um sistema kanban é um conjunto de regras e sinais que vincula a produção e a movimentação de materiais ao consumo real. Quando um processo a jusante usa um contêiner de peças, o contêiner vazio ou seu cartão retorna à montante. Esse sinal é a única autorização para fabricar ou movimentar uma reposição. Sem sinal, não há produção. A palavra japonesa kanban significa "sinal" ou "placa de sinalização" [1]. Na prática, kanban é um sistema visual. Um contêiner vazio ou um cartão em um posto é um sinal visual, uma das pistas visuais mais simples do chão de fábrica: qualquer pessoa pode lê-lo sem relatório ou tela.

Três elementos fazem um sistema kanban funcionar:

1. **Um número fixo de sinais por ciclo.** Cada cartão ou contêiner representa um recipiente com quantidade fixa. O número de cartões em circulação é o estoque máximo que aquele ciclo pode conter.
2. **Um ponto de armazenagem definido.** As peças aguardam em um supermercado ou no ponto de uso, em um endereço impresso no cartão [1].
3. **Regras que todos seguem.** Nada é fabricado sem um kanban, o cartão permanece com as peças, defeitos não são repassados [10][11].

Um cartão kanban normalmente mostra o nome da peça, o número da peça, o fornecedor externo ou o processo interno fornecedor, a quantidade de embalagem, o endereço de armazenagem e o endereço do processo consumidor [1]. Os kanbans podem ser cartões de papel, placas metálicas, contêineres vazios, bolinhas coloridas ou mensagens eletrônicas; o meio importa menos que a disciplina.

### Kanban, pull e just-in-time: como os termos se relacionam

Os três termos são frequentemente usados como sinônimos. Não são:

| Termo | O que é | Relação |
|---|---|---|
| Just-in-time (JIT) | Um princípio de produção: fabricar apenas o que é necessário, quando é necessário, na quantidade necessária [8] | Um dos dois pilares do Sistema Toyota de Produção, ao lado do jidoka [8] |
| Sistema pull | Uma lógica de controle que limita explicitamente o WIP, de modo que o trabalho só é iniciado quando há espaço ou demanda a jusante [2] | O mecanismo que torna o JIT possível |
| Kanban | Um dispositivo de sinalização específico e um conjunto de regras que implementa o pull [1] | Uma forma de construir um sistema pull; outras são CONWIP, POLCA e drum-buffer-rope |

A Toyota descreve em termos simples o ciclo de abastecimento por trás do JIT: um mínimo de peças fica na linha, e os processos a montante reabastecem o que os processos a jusante consomem, de modo que apenas o que é vendido é fabricado (parafraseado da página do TPS da Toyota) [8]. O kanban é o sistema de instruções que sustenta esse ciclo. Por isso o kanban é uma das ferramentas centrais da manufatura enxuta: ele transforma o princípio lean de pull em uma rotina diária. O kanban não elimina desperdícios por si só, mas limita a superprodução, um dos sete desperdícios de Ohno, e torna visíveis os desperdícios remanescentes.

### Benefícios de um sistema kanban na manufatura

Os benefícios do kanban decorrem do limite de WIP, não dos cartões:

- **Estoque menor e previsível.** O ciclo não pode conter mais que cartões × quantidade do contêiner, o que limita o estoque excedente, o espaço de armazenagem e os custos de estoque.
- **Lead time menor.** Pela lei de Little, o lead time médio é igual ao WIP médio dividido pela vazão [6]. Limitar o WIP limita o lead time.
- **Problemas visíveis.** Quando um ciclo fica sem peças, todos veem. Esse é o objetivo da regra da Toyota de reduzir os kanbans gradualmente [10].
- **Menos esforço de programação.** Apenas um processo, o processo marcapasso, recebe uma programação; os processos a montante seguem os sinais.
- **Menos emergências de expedição.** O reabastecimento torna-se rotina, em vez de exceção.

Esses benefícios são condicionais. Muitas páginas da web citam reduções de 25 por cento no estoque ou de 50 por cento no lead time sem informar a planta, a base de comparação ou o método. Este guia não repete tais números. O que é mensurável na sua própria planta é apresentado na seção de KPIs, com as fórmulas.

## Kanban de manufatura vs. quadros Kanban: esclarecendo a confusão da busca

Se você pesquisou "sistema kanban" e esperava notas adesivas em um quadro branco ou uma ferramenta de gerenciamento de projetos, chegou ao lado da manufatura de uma mesma árvore genealógica. O significado de software, muitas vezes escrito com K maiúsculo como "the Kanban Method", é descrito na Wikipedia como "um método enxuto para gerenciar e melhorar o trabalho em sistemas humanos"; o livro de David J. Anderson de 2010, *Kanban: Successful Evolutionary Change for Your Technology Business*, descreveu como ele evoluiu a partir de projetos na Microsoft e na Corbis, e o método remonta às suas raízes na produção just-in-time da Toyota [22].

Os dois compartilham a ideia de limitar a quantidade de trabalho em processamento (WIP). Diferem em quase todo o restante:

| Aspecto | Kanban de manufatura | Quadro Kanban (trabalho intelectual) |
|---|---|---|
| O que flui | Peças físicas em contêineres padronizados | Tarefas, chamados, histórias de usuário |
| O sinal | Cartão, caixa vazia ou mensagem eletrônica que autoriza uma quantidade fixa | Um cartão representando um item de trabalho; limites de WIP por coluna |
| Quem puxa | O processo a jusante retira as peças; o a montante repõe exatamente essa quantidade | Um membro da equipe puxa o próximo item quando há capacidade livre |
| Dimensionamento | Fórmula baseada na demanda, tempo de reposição, tamanho do contêiner e segurança | Limites de WIP definidos pelo julgamento da equipe e métricas de fluxo |
| Falha típica | Ruptura de estoque, supermercados transbordando, cartões perdidos | Colunas sobrecarregadas, trabalho oculto |
| Principais textos de referência | Livro de Ohno sobre o TPS, léxico do LEI, manuais da Toyota [1][9][11] | Anderson (2010) e a literatura posterior do Kanban Method [22] |

Algumas páginas da web misturam os dois significados, por exemplo comparando kanban com Scrum em uma página sobre estoque de manufatura. Isso confunde os leitores da fábrica. O restante deste guia trata do sistema kanban de manufatura: peças, contêineres, laços, fórmulas. Se você precisar criar um quadro kanban para uma equipe de engenharia ou de escritório, ou para um fluxo de trabalho de software ágil, os princípios de limites de WIP e de um fluxo de trabalho visível se aplicam, mas as fórmulas de dimensionamento abaixo não.

## Empurrar vs. puxar: o que é realmente um sistema puxado

A explicação do dia a dia é "empurrar produz para a previsão, puxar produz para a demanda." Isso se aproxima do conceito, mas não é preciso o bastante para projetar um sistema. Wallace Hopp e Mark Spearman propuseram uma definição mais clara: "Um sistema de produção puxado é aquele que limita explicitamente a quantidade de trabalho em processo que pode estar no sistema" [2]. O artigo deles argumenta que a literatura praticada simplificou demais o pull e o lean, e que o pull é, no fundo, uma forma de limitar o WIP [2].

Essa definição tem consequências práticas:

- **Uma linha make-to-stock com kanban é pull,** porque os cartões limitam o WIP e o estoque de produtos acabados.
- **Uma linha make-to-order também pode ser pull,** se os pedidos entram apenas quando um limite de WIP permite (CONWIP, POLCA).
- **Uma fábrica que "produz sob pedido do cliente", mas libera cada pedido para o chão de fábrica assim que é registrado, é push,** mesmo que a demanda seja real. O WIP cresce com a carteira de pedidos.

A abordagem tradicional da manufatura é push. Um sistema de planejamento, geralmente o planejamento das necessidades de materiais dentro de um pacote de planejamento de recursos empresariais (ERP), usa previsões e dados históricos para determinar o volume de produção e libera ordens de trabalho antes de receber um pedido do cliente. Em um sistema pull, as atividades de produção só começam quando o consumo a jusante ou um pedido do cliente libera espaço sob o limite de WIP. Em termos simples, um sistema pull é um método de controle da produção orientado pelo consumo real; os dois sistemas diferem menos nos dados do que naquilo que dispara o trabalho.

### A lei de Little: por que limitar o WIP limita o lead time

John Little publicou a demonstração da fórmula de filas L = λW em 1961 [6]. Em termos de fábrica: WIP médio = vazão × lead time médio, ou lead time = WIP ÷ vazão.

**Exemplo resolvido.** Uma célula de usinagem expede 400 peças por dia. Uma contagem no chão de fábrica encontra 3.200 peças de WIP entre a serra e a inspeção final. Lead time médio = 3.200 ÷ 400 = 8 dias. Se um sistema pull limita o WIP em 1.200 peças e a vazão permanece em 400 por dia, o lead time médio cai para 1.200 ÷ 400 = 3 dias. As máquinas não ficaram mais rápidas. As peças simplesmente esperam menos.

A lei de Little vale para médias de longo prazo em um sistema estável [6]. Ela não informa até onde é possível reduzir o WIP antes que a vazão sofra. Isso depende da variabilidade, e por isso sistemas pull precisam de algum colchão e por que as fórmulas de dimensionamento incluem termos de segurança.

### Push vs. pull: principais diferenças e híbridos

| Critério | Push (liberação por MRP) | Pull (kanban, CONWIP, POLCA) |
|---|---|---|
| Gatilho para a produção | Liberação de ordem planejada a partir da previsão ou dos pedidos | Consumo ou uma autorização livre de WIP |
| WIP | Não limitado; segue o plano e seus erros | Limitado pelo número de cartões ou autorizações [2] |
| Lead time | Variável, frequentemente cresce com a carga | Estável enquanto o limite de WIP for mantido (lei de Little) [6] |
| Resposta ao erro de previsão | Superprodução ou falta | Autocorrigível dentro da faixa do ciclo |
| Necessidades de dados | BOMs, roteiros, lead times e estoque precisos | Contagem precisa de contêineres, disciplina com cartões |
| Adequado para | Lead times longos, BOMs complexas, baixo volume por item | Demanda repetitiva, tempos de reposição curtos |

A maioria das fábricas opera com híbridos. Um artigo do IndustryWeek escrito por um fornecedor sustenta que uma combinação de push e pull pode ser a melhor opção quando a demanda é volátil [25]. Na prática, isso normalmente significa que o MRP planeja a capacidade e as compras de longo prazo, enquanto o kanban ou o CONWIP controla a liberação diária. A seção sobre ERP abaixo mostra como. Escolher entre push ou pull raramente é uma decisão única para a fábrica inteira; ela é tomada por número de peça e por etapa do processo.

## História: da oficina de máquinas da Toyota à prática global

O kanban surgiu do Sistema Toyota de Produção. A Toyota atribui a Kiichiro Toyoda (1894–1952) o conceito de just-in-time e afirma que ele introduziu o fluxo por transportador de corrente na montagem de teares em 1927 e na linha de montagem de carrocerias da Planta Koromo em 1938 [8]. A legenda de uma foto na página do TPS da Toyota atribui a Taiichi Ohno (1912–1990) a criação da "estrutura básica do método Just-in-Time" [8].

Segundo o artigo sobre kanban da Wikipédia, a Toyota aplicou a lógica do kanban na oficina de máquinas de sua planta principal em 1953 [10]. O mesmo artigo afirma que a Toyota estudou supermercados no final da década de 1940, com a ideia de aplicar técnicas de reposição de prateleiras ao chão de fábrica; essa frase não tem citação no artigo, portanto trate a data como [unverified: frase sem citação no artigo-fonte]. A analogia com o supermercado é tão central que "supermercado" passou a ser o termo lean para um ponto de estoque controlado.

A primeira descrição acadêmica em inglês veio de engenheiros da Toyota. Sugimori e três coautores publicaram "Toyota production system and Kanban system: Materialization of just-in-time and respect-for-human system" no *International Journal of Production Research* em 1977 [7]. O artigo apresenta duas características: a produção just-in-time, na qual apenas os produtos necessários são feitos no tempo necessário, na quantidade necessária, e um sistema de "respeito às pessoas", no qual os trabalhadores usam plenamente suas capacidades participando da operação e da melhoria de sua oficina [7]. O livro de Ohno, *Toyota Production System: Beyond Large-Scale Production*, saiu em inglês em 1988 [9].

A partir da década de 1980, pesquisadores ocidentais passaram a analisar e variar o método. Spearman, Woodruff e Hopp introduziram o CONWIP em 1990 como "uma alternativa pull ao kanban" [3]. Co e Moosa examinaram em 1997 a própria fórmula de kanban da Toyota [14]. Rajan Suri, que fundou e dirigiu o Center for Quick Response Manufacturing da Universidade de Wisconsin–Madison de 1993 a 2007, criou o POLCA para oficinas de alto mix e baixo volume [20][21]. Uma revisão da literatura de 2010, de Lage Junior e Godinho Filho, contou 32 variações publicadas do sistema kanban e encontrou uma grande distância entre propostas teóricas e práticas [17]. A lógica central do ciclo da década de 1950 sobreviveu a todas elas.

## Como funciona um ciclo kanban, passo a passo

O projeto clássico da Toyota usa dois tipos de cartões: kanbans de retirada, que levam peças do supermercado até o consumidor, e kanbans de produção, que informam ao processo fornecedor que ele deve fabricar substitutos [1]. A seguir, um ciclo completo entre uma linha de montagem e uma célula de estampagem e soldagem que fornece suportes.

| Etapa | Onde | O que acontece | Sinal |
|---|---|---|---|
| 1 | Linha de montagem, ponto de uso | O operador retira o último suporte de um contêiner; o contêiner vazio vai para o rack de retorno | O kanban de retirada é destacado e colocado no posto de kanban |
| 2 | Posto de kanban | Um operador de movimentação recolhe os kanbans de retirada em uma rota fixa, por exemplo a cada 30 ou 60 minutos | Kanbans de retirada recolhidos |
| 3 | Supermercado após a célula de suportes | O operador retira um contêiner cheio para cada kanban de retirada; o kanban de produção desse contêiner é removido e colocado no posto de kanban de produção | O kanban de retirada vai para o contêiner cheio; o kanban de produção vai para a célula |
| 4 | Linha de montagem | O contêiner cheio chega ao seu endereço de ponto de uso | O kanban de retirada segue junto com as peças |
| 5 | Célula de suportes | Os kanbans de produção são alinhados em sequência, muitas vezes em um quadro heijunka ou em um trilho simples | Cada kanban de produção autoriza um contêiner |
| 6 | Célula de suportes | A célula fabrica exatamente a quantidade indicada no cartão e devolve o contêiner cheio, com o kanban de produção preso a ele, ao supermercado | Kanban de produção de volta ao contêiner |

Duas características são fáceis de passar despercebidas:

- **O supermercado é o amortecedor, não a linha.** A linha mantém apenas o que consome entre as entregas. O supermercado absorve a diferença entre o ritmo de lotes da célula e o consumo constante da linha.
- **Os cartões medem o estoque.** Se existirem 12 kanbans de produção para o suporte B-200 e 3 estiverem aguardando na célula, 9 contêineres estão cheios no supermercado, em trânsito ou na linha. Uma contagem rápida mostra se cartões foram perdidos ou se contêineres estão sendo acumulados.

Uma variante mais simples, com um único cartão, dispensa o kanban de retirada: o consumidor retira um contêiner de um depósito próximo e o contêiner vazio ou um cartão de produção volta diretamente ao processo fornecedor. É mais simples e funciona bem quando fornecedor e consumidor estão próximos entre si.

## Tipos de kanban

O Lean Enterprise Institute identifica duas famílias básicas, o kanban de produção e o kanban de retirada, com o kanban de sinal como um tipo especial de kanban de produção e o kanban de fornecedor como um tipo especial de kanban de retirada [1]. Fornecedores de software e livros didáticos acrescentam outros nomes, e por isso as listas de tipos de kanban variam de página para página. A tabela os classifica pelo que autorizam.

| Tipo | Autoriza | Uso típico | Observações |
|---|---|---|---|
| Kanban de produção | O processo a montante a produzir o tipo e a quantidade indicados no cartão para um processo a jusante [1] | Células e máquinas com trocas rápidas que conseguem produzir um contêiner por vez | Um cartão = um contêiner |
| Kanban de sinal (kanban triangular) | Produção de um lote quando o estoque cai até o ponto de disparo, "quando uma quantidade mínima de contêineres é atingida" [1] | Prensas, moldagem, tratamento térmico, pintura: processos com trocas longas que precisam operar em lotes | Pendurado no ponto de reposição na pilha de contêineres; muitas vezes são placas metálicas triangulares |
| Kanban de retirada (kanban de movimentação, kanban de transporte) | Transporte de peças até um processo a jusante [1] | Entre o supermercado e a linha | Kanban interno ou interprocessos [1] |
| Kanban de fornecedor | Retirada de um fornecedor externo [1] | Peças compradas com consumo regular | O LEI observa que os kanbans de fornecedores distantes normalmente assumem forma eletrônica [1] |
| Sistema de dois recipientes (e de três recipientes) | Reposição de um recipiente quando ele está vazio, enquanto o segundo recipiente cobre o consumo | Fixadores, consumíveis, itens C de baixo custo | O recipiente vazio é o sinal; a Wikipedia descreve o sistema de dois recipientes como a origem mais simples do kanban e também descreve uma variante de três recipientes (linha, almoxarifado da fábrica, fornecedor) [10] |
| Kanban de emergência ou expresso | Uma reposição extra única após uma falta ou defeito | Recuperação de sucata ou de uma entrega perdida | Deve ser retirado após o uso; caso contrário, o ciclo cresce silenciosamente |
| Kanban pontual (de evento, uso único) | Peças extras para uma demanda conhecida e excepcional | Promoções, uma ordem de serviço, a fabricação de um protótipo | O Microsoft Dynamics 365 trata esses casos como kanbans de uso único sinalizados por uma regra de quantidade fixa, além de kanbans de evento para demandas excepcionais acima de uma quantidade definida [15] |
| Kanban de passagem (túnel) | Produção e retirada combinadas em um único cartão | Dois processos intimamente ligados que operam como um só, por exemplo forjaria e tratamento térmico | Citado pela Cin7 entre seus seis tipos; a terminologia varia entre as fontes |
| Cartão CONWIP | Liberação de qualquer ordem em uma linha; o cartão retorna ao início da linha quando uma ordem é concluída [5] | Linhas com muitos números de peça, mas com uma rota comum | Não é específico por peça; veja a seção sobre CONWIP |
| E-kanban | Qualquer um dos anteriores como mensagem eletrônica | Fornecedores distantes, ciclos longos, reposição integrada ao ERP | Elimina erros de cartão perdido e de digitação manual [10] |

### Qual tipo de kanban para cada ciclo

| Situação | Tipo recomendado | Motivo |
|---|---|---|
| Célula de fornecedor ao lado da linha, troca de ferramenta abaixo de 10 minutos | Kanban de produção, cartão único | Pode produzir contêiner por contêiner |
| Setor de prensas com trocas de 45 minutos alimentando várias linhas | Kanban de sinal com supermercado | O tamanho do lote é definido pela economia de troca, não pelo tamanho do contêiner |
| Armazém central que abastece várias células | Kanban de retirada mais uma rota (milk run) | Separa a movimentação da produção |
| Peças padronizadas compradas, consumo regular, fornecedor a 800 km | E-kanban de fornecedor | Cartões de papel viajam devagar demais |
| Parafusos, arruelas, etiquetas, luvas | Dois recipientes | Sinal mais barato possível, sem contagem |
| Muitas variantes em uma mesma rota, demanda irregular por variante | Cartões CONWIP | Cartões específicos por peça encheriam o chão de fábrica de estoque de baixa rotação |
| Job shop com muitas rotas | Cartões POLCA | Controla o fluxo entre pares de células |

## As seis regras do kanban da Toyota

Quase toda página da web lista "seis regras". Circulam duas versões, e vale conhecer ambas.

**Versão 1, conforme resumida na Wikipédia** (citando a Toyota) [10]:

1. Cada processo emite pedidos (kanban) a seus fornecedores quando consome seus insumos.
2. Cada processo produz de acordo com a quantidade e a sequência dos pedidos recebidos.
3. Nenhum item é fabricado ou transportado sem um pedido.
4. O pedido associado a um item está sempre anexado a ele.
5. Os processos não devem enviar itens defeituosos, para garantir que os produtos acabados estejam livres de defeitos.
6. Limitar o número de pedidos pendentes torna o processo mais sensível e revela ineficiências.

**Versão 2, conforme o *Toyota Production System Handbook* (1973, traduzido por Mark Warren), tal como apresentada por Christoph Roser** [11]:

1. Não envie produtos defeituosos ao processo produtivo subsequente.
2. O processo produtivo subsequente vem buscar.
3. Produza apenas a quantidade retirada pelo processo subsequente.
4. Reduza as flutuações.
5. O kanban é um meio de ajuste fino.
6. Estabilize e racionalize o processo produtivo.

Roser observa que "existem diferentes versões das Regras Toyota para o Kanban" e acrescenta uma regra que aprendeu na Toyota e que não aparece em nenhuma das duas listas: qualquer material no sistema deve ter um cartão kanban anexado [11]. Ele também aponta que a versão do manual mistura pré-requisitos (ausência de defeitos, processos estáveis) com regras de operação [11].

### O que as regras significam no chão de fábrica

| Regra (combinada) | Comportamento no chão de fábrica | Violação típica | Consequência |
|---|---|---|---|
| O processo posterior puxa | O consumidor ou operador busca; o fornecedor não entrega sem ser solicitado | A célula a montante "ajuda" empurrando contêineres extras | Supermercado transborda, os cartões deixam de mostrar o estoque real |
| Produzir apenas o que foi retirado | Os kanbans de produção definem a quantidade e a sequência | Rodar um turno inteiro "enquanto prepara" | Superprodução oculta, um dos sete desperdícios de Ohno |
| Nenhuma peça sem cartão | Todo contêiner cheio carrega seu cartão | Contêineres sem identificação em um canto, "estoque de segurança" | Estoque em circulação desconhecido; as contagens de cartões mentem |
| O cartão permanece com as peças | Separar somente no momento definido | Cartões em bolsos, sobre mesas, em gavetas | Cartões perdidos = reposição perdida = ruptura de estoque |
| Nenhum defeito para o processo posterior | Peças ruins são paradas e sinalizadas na origem | Peças defeituosas misturadas em um contêiner cheio | O consumidor fica sem peças com um contêiner "cheio" |
| Reduzir cartões gradualmente | Remover um cartão, observar, resolver, repetir | Cortar metade dos cartões de uma só vez | Linha para, perda de confiança, retorno ao empurrar |
| Nivelar e estabilizar | Demanda no processo puxador é nivelada; os processos são capazes | Grandes oscilações diárias na montagem final | O kanban amplifica as oscilações a montante (ver heijunka) |

A regra 6 da versão 1 é a que as fábricas ocidentais mais costumam aplicar de forma inadequada. Roser argumenta, em uma resposta a leitores, que a Toyota "tem a) muito menos problemas e b) muito mais mão de obra para corrigi-los", por isso fábricas sem essa capacidade de solução de problemas devem manter kanbans suficientes, em vez de cortá-los para provocar problemas que ainda não sabem resolver [12]. Remover um cartão é um experimento. Execute-o somente quando alguém estiver preparado para corrigir o que ele revelar.

## Como calcular o número de kanbans: fórmulas e exemplos resolvidos

Esta é a pergunta que a maioria dos pesquisadores faz e que a maioria das páginas evita. As seções abaixo começam pela fórmula básica, mostram como a prática profissional a refina, comparam as fórmulas usadas por fornecedores de ERP e outros guias sobre os mesmos dados, e então trabalham seis casos. Todos os seis exemplos de kanban são ilustrativos: usam dados típicos de fábrica, não casos reais de uma empresa identificada, para que você possa acompanhar cada passo e substituir os números pelos seus.

Antes de tudo, um alerta, nas palavras de Roser: "O cálculo do kanban não é nada mais do que uma estimativa bastante grosseira que usa muitas premissas" [12]. A fórmula fornece um ponto de partida. Em seguida, o circuito é ajustado observando-o em funcionamento.

### A fórmula básica

> **Número de kanbans N = (D × L × (1 + α)) ÷ C**, arredondado para cima
>
> D = demanda média por unidade de tempo (por exemplo, peças por dia)
> L = lead time de reposição na mesma unidade de tempo: desde o momento em que um contêiner é esvaziado (ou o seu cartão é liberado) até o contêiner cheio retornar ao seu ponto de armazenagem
> α = fator de segurança (por exemplo, 0,10 para 10 por cento)
> C = quantidade do contêiner (peças por kanban)

Essa estrutura, demanda durante o lead time de reposição mais uma folga de segurança, dividida pela quantidade do contêiner, é a base usada pelo Microsoft Dynamics 365 Supply Chain Management, com um "+1" adicional em suas principais variantes [15]. O Smartsheet usa uma variante com o estoque de segurança expresso em dias: C = [D × (L + SSD)] ÷ S, em que SSD são os dias de estoque de segurança e S a quantidade por caixa [23]. A própria prática da Toyota, conforme analisada por Co e Moosa, define o número de kanbans a partir da demanda média durante um ciclo de pedido, multiplicada por um fator constante de superplanejamento [14].

**Exemplo resolvido 1: circuito básico.** A linha de montagem final usa o suporte B-200. Demanda diária D = 960 peças em dois turnos. Lead time de reposição a partir da célula de suportes L = 0,25 dia. Fator de segurança α = 0,10. Quantidade do contêiner C = 40.

N = 960 × 0,25 × 1,10 ÷ 40 = 264 ÷ 40 = 6,6, arredondado para cima: **7 kanbans**.

O circuito nunca pode conter mais de 7 × 40 = 280 suportes, o que equivale a 280 ÷ 960 = 0,29 dia de demanda. Pela lei de Little, o tempo médio que um suporte permanece no circuito é de no máximo cerca de 0,29 dia, aproximadamente 4,4 horas de trabalho em um dia de 15 horas [6].

### De onde vem realmente o L: o detalhamento do tempo de reposição

A fórmula básica esconde a entrada mais difícil. O L não é o tempo de ciclo da máquina que abastece. Roser divide o tempo de reposição em lead time do fluxo de material mais atrasos de informação: tempo de espera do kanban até o cartão ser recolhido, espera até que kanbans suficientes se acumulem para formar um lote, tempo de fila atrás de outros códigos de peça, trocas de ferramenta e transporte [12]. Em seguida, ele acrescenta kanbans extras para a formação do tamanho de lote, para a espera atrás de outros lotes, para o agrupamento de pedidos do cliente e para a demanda de pico, além de uma margem de segurança opcional [13].

| Componente do tempo de reposição | Como medir | Ponto cego típico |
|---|---|---|
| Tempo de espera do cartão no posto kanban | Intervalo de coleta da rota; use o intervalo completo para uma estimativa conservadora | Supor que os cartões circulam instantaneamente |
| Espera para formação de lote | Se a célula trabalha com lotes de n contêineres, até n – 1 cartões esperam | Ignorar os tamanhos de lote do fornecedor |
| Fila atrás de outros códigos de peça | Observar a sequência da célula; contar os outros lotes à frente | Supor que a célula está livre quando o cartão chega |
| Troca de ferramenta | Estudo de tempos ou linha de base SMED | Deixar as trocas de fora porque "são curtas" |
| Tempo de processamento de um lote | Tempo de ciclo × quantidade do lote | Usar uma peça em vez do lote inteiro |
| Transporte e colocação em posição | Tempo de rota até o supermercado | Esquecer esperas de empilhadeira e pausas de turno |

**Exemplo resolvido 2: o mesmo suporte com o tempo de reposição completo.** Dois turnos dão 900 minutos de tempo disponível, portanto o takt = 900 ÷ 960 = 0,9375 minuto (56,25 segundos) por suporte.

- Coleta de cartão a cada 60 minutos: conservadoramente 60 minutos de espera
- Fila na célula de suportes atrás de outros códigos de peça: 90 minutos
- Processamento de um contêiner: 40 peças × 30 segundos = 20 minutos
- Transporte e colocação em posição: 15 minutos
- Tempo de reposição sem efeitos de lote: 60 + 90 + 20 + 15 = 185 minutos

Peças consumidas durante esse tempo: 185 ÷ 0,9375 = 197,3 peças, que é 197,3 ÷ 40 = 4,93 kanbans.

A célula executa lotes de quatro contêineres para limitar as trocas de ferramenta. Até três cartões podem esperar a formação de um lote, portanto some 3 kanbans: 4,93 + 3 = 7,93. Acrescente uma margem de segurança de 10 por cento sobre a parte baseada em tempo (0,49): 8,42, arredondado para cima para **9 kanbans**.

A fórmula básica deu 7. A diferença de dois cartões vem quase inteiramente do tamanho do lote na célula fornecedora. Por isso o SMED, que permite lotes menores, é a alavanca habitual para reduzir kanbans, e não regras mais rígidas. Mais sobre trocas de ferramenta no [guia de SMED e redução de tempo de troca](https://www.m365.fm/en/learn/smed-changeover-reduction/).

### Mesmos dados, fórmulas diferentes

As fábricas costumam discutir a "fórmula certa" quando na verdade discordam sobre os dados de entrada. Esta tabela aplica as fórmulas publicadas aos dados do exemplo 1 (D = 960 por dia, L = 0,25 dia, α = 0,10, C = 40). Para a fórmula da Smartsheet, o fator de segurança de 10 por cento é convertido em dias de segurança: 0,1 × 0,25 = 0,025 dia.

| Fonte | Fórmula como publicada | Cálculo | Resultado |
|---|---|---|---|
| Forma básica de livro-texto | D × L × (1 + α) ÷ C | 960 × 0,25 × 1,1 ÷ 40 = 6,6 | 7 |
| Smartsheet [23] | D × (L + SSD) ÷ S | 960 × (0,25 + 0,025) ÷ 40 = 6,6 | 7 |
| Microsoft Dynamics 365 SCM, sem estoque de segurança [15] | (demanda média × tempo de reposição × (fator de segurança + 1)) ÷ quantidade por unidade de manuseio + 1, arredondado para cima | 6,6 + 1 = 7,6 | 8 |
| Oracle JD Edwards, Equação 1 [16] | tamanho do kanban = demanda diária alta × (dias de tempo de entrega + dias de delta de leitura) + estoque de segurança; cartões = tamanho do kanban ÷ tamanho do contêiner | com demanda diária alta de 1.100, tempo de reposição de 0,25 dia, delta de leitura 0, estoque de segurança 40: (1.100 × 0,25 + 40) ÷ 40 = 7,9 | 8 |
| Roser por etapas [12][13] | tempo de reposição ÷ takt ÷ peças por kanban + kanbans extras + segurança | ver exemplo 2 | 9 |

Os resultados variam de 7 a 9. A diferença vem de três escolhas: se um cartão extra é acrescentado para o contêiner que está sendo consumido (o +1 do Dynamics 365), se a demanda de pico ou a média é usada (o JD Edwards usa a demanda do período mais alto na janela do MRP [16]) e se os efeitos do tamanho do lote são considerados (Roser [13]). Defina esses três pontos uma vez, registre-os no seu padrão de kanban e aplique-os a todos os circuitos.

### Exemplo trabalhado 3: kanban de fornecedor

Para peças compradas, o tempo de reposição inclui o intervalo de pedido (com que frequência cartões ou sinais são enviados), o prazo de entrega do fornecedor e o tempo de transporte. Uma forma comum é:

> **N = D × (intervalo de pedido + prazo de entrega do fornecedor + tempo de segurança) ÷ C**

Um alojamento é usado à razão de 300 peças por dia. Os sinais são enviados ao fornecedor uma vez por dia (intervalo de pedido de 1 dia), o fornecedor precisa de 3 dias do sinal até a entrega, e a fábrica quer 1 dia de tempo de segurança. Os contêineres comportam 100 peças.

N = 300 × (1 + 3 + 1) ÷ 100 = 1.500 ÷ 100 = **15 kanbans**. O estoque máximo do circuito é de 1.500 peças, ou 5 dias de consumo, a maior parte dele em trânsito no fornecedor ou no caminhão, e não na fábrica.

Se a fábrica passar de sinais diários para sinais duas vezes ao dia (intervalo de pedido de 0,5 dia), N = 300 × 4,5 ÷ 100 = 13,5, portanto 14 kanbans. Se o prazo de entrega do fornecedor cair de 3 dias para 2, N = 300 × 4 ÷ 100 = 12. O prazo de entrega do fornecedor costuma ser a alavanca mais importante.

### Exemplo trabalhado 4: kanban de sinal para um processo em lote

Os kanbans de sinal são dimensionados de forma diferente, porque o processo fornecedor produz um lote muito maior do que um contêiner. São necessários dois números: o ponto de disparo (quando iniciar um lote) e o tamanho do lote (quanto produzir).

Uma prensa de estampagem fornece a peça P-17, entre outras. A demanda é de 1.200 peças por dia em 900 minutos disponíveis, ou seja, 1,333 peça por minuto. Os contêineres comportam 60 peças, portanto a linha usa 20 contêineres por dia. Como a prensa precisa de 40 minutos para trocar a ferramenta, o planejamento fixou um lote de 10 contêineres (600 peças).

- Espera pela prensa (outras peças à frente): até 120 minutos
- Troca de ferramenta: 40 minutos
- Execução de 600 peças a 3 segundos cada: 30 minutos
- Transporte até o supermercado: 10 minutos
- Tempo de reposição: 200 minutos

Demanda durante a reposição = 200 × 1,333 = 267 peças = 4,44 contêineres. Com um contêiner de segurança, o ponto de disparo é 5,44, arredondado para cima para 6 contêineres. O kanban triangular fica pendurado no sexto contêiner a partir da base da pilha. Quando a linha chega a ele, a prensa recebe seu sinal.

Estoque máximo = ponto de disparo + lote = 6 + 10 = 16 contêineres = 960 peças, cerca de 0,8 dia de demanda. Se o SMED reduzir a troca para 10 minutos e o planejamento reduzir o lote para 4 contêineres, o estoque máximo cai para cerca de 6 + 4 = 10 contêineres, supondo que a fila da prensa permaneça a mesma. A lógica de dimensionamento de lotes em si é abordada no [guia de dimensionamento de lotes](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/).

### Exemplo resolvido 5: sistema de duas caixas para peças C

Parafusos M6 são usados em cerca de 1.500 peças por semana em uma estação de trabalho. O distribuidor reabastece uma caixa vazia em até uma semana após a caixa vazia ser colocada na prateleira de retirada. Cada caixa deve cobrir a demanda durante o reabastecimento mais uma margem.

Tamanho da caixa = 1.500 × 1 semana × 1,2 = 1.800 parafusos. Duas caixas de 1.800 comportam 3.600 parafusos no total. Quando a primeira caixa está vazia, o operador passa para a segunda e coloca a caixa vazia, com sua etiqueta, na prateleira. Ninguém conta os parafusos. Se a segunda caixa esvaziar regularmente antes do retorno da primeira, o tamanho da caixa ou o tempo de reabastecimento está errado, e a correção é medir ambos, não acrescentar informalmente uma terceira caixa.

### Exemplo resolvido 6: qual a sensibilidade do circuito?

Usando o exemplo 1 como caso base (D = 960, L = 0,25 dia, α = 0,10, C = 40), a tabela mostra quantos kanbans a fórmula básica fornece quando uma variável muda.

| Mudança | N (sem arredondamento) | Kanbans | Estoque máximo do circuito |
|---|---|---|---|
| Caso base | 6,6 | 7 | 280 |
| Lead time de reabastecimento reduzido pela metade para 0,125 dia | 3,3 | 4 | 160 |
| Lead time de reabastecimento dobrado para 0,5 dia | 13,2 | 14 | 560 |
| Quantidade por contêiner reduzida pela metade para 20 | 13,2 | 14 | 280 |
| Quantidade por contêiner dobrada para 80 | 3,3 | 4 | 320 |
| Demanda 25 por cento maior, para 1.200 | 8,25 | 9 | 360 |
| Fator de segurança 0,25 em vez de 0,10 | 7,5 | 8 | 320 |

Duas lições decorrem disso. Primeiro, o lead time de reabastecimento tem o efeito mais forte sobre o estoque: reduzi-lo pela metade corta o estoque máximo de 280 para 160. Segundo, contêineres menores não reduzem muito o estoque máximo por si só (14 × 20 = 280); eles principalmente suavizam o fluxo e tornam os problemas visíveis mais cedo, enquanto dobrar os contêineres para 80 aumenta o estoque porque o arredondamento desperdiça mais.

### Arredondamento, mínimos e recálculo

- **Arredonde para cima e depois avalie.** Arredondar 6,6 para 7 é óbvio. Roser arredondaria para baixo um resultado de 61,2 kanbans em um circuito grande, mas arredondaria 61,9 para cima [13]. Em circuitos pequenos, sempre arredonde para cima.
- **Mínimo de dois kanbans.** Um circuito com um único cartão para o consumidor toda vez que o cartão está em trânsito. Dois é o mínimo prático; algumas fábricas adotam três como regra interna.
- **Recalcule com periodicidade.** A demanda muda. Recalcule os tamanhos dos circuitos mensalmente ou quando a previsão de demanda mudar além de um limite acordado (por exemplo, 15 por cento). Os módulos de kanban dos ERPs podem fazer isso a partir dos períodos de demanda [15].
- **Inclua e remova cartões formalmente.** Toda alteração passa pela pessoa responsável pela lista mestre de kanbans, com data. Caso contrário, os cartões se multiplicam.
- **Planeje os picos explicitamente.** Para picos sazonais, acrescente cartões temporários de cor diferente com data de término, ou use kanbans de uso único [15].

## Supermercados, filas FIFO e o processo marca-passo

Os cartões são a parte visível de um sistema puxado. Sua estrutura é definida antes, no mapa do fluxo de valor do estado futuro: onde colocar os supermercados, onde conectar os processos com filas FIFO e qual processo único recebe o programa. Se você ainda não desenhou esse mapa, comece pelo [guia de mapeamento do fluxo de valor](https://www.m365.fm/en/learn/value-stream-mapping/); os símbolos kanban (kanban de produção, kanban de retirada, kanban de sinalização, posto kanban) são explicados ali.

### Tipos de sistemas puxados: três formas básicas

| Forma | Como funciona | Adequado para | Estoque mantido |
|---|---|---|---|
| Puxada por supermercado (reposição puxada) | Cada processo mantém um supermercado de suas saídas; o processo posterior retira, o anterior repõe o que foi retirado | Muitos códigos de peça repetitivos com demanda estável | Todo código de peça ativo é estocado |
| Puxada sequencial | Os pedidos são liberados no início de uma cadeia na sequência em que devem ser fabricados; os processos são ligados por filas FIFO com quantidade máxima | Muitas variantes, baixo volume por variante, lead time curto e previsível | Pouco ou nenhum estoque de produto acabado; WIP limitado pelo tamanho das filas |
| Puxada mista | Itens de alto giro em supermercados, itens de baixo giro fabricados sob pedido em sequência | A maioria das fábricas reais | Estoque apenas para os itens de alto giro |

### Segmentando os códigos de peça antes de projetar os laços

Nem todo código de peça pertence a um supermercado. Uma divisão prática usa volume e regularidade da demanda, frequentemente chamados de runners, repeaters e strangers.

| Segmento | Perfil (limites de exemplo, defina os seus) | Método de controle |
|---|---|---|
| Runners | Demanda todos os dias, baixa variação (por exemplo, coeficiente de variação abaixo de 0,5) | Supermercado com kanban de produção ou kanban de sinalização |
| Repeaters | Demanda na maioria das semanas, variação moderada | Supermercado com menos cartões, ou fabricação sob pedido com um pequeno buffer FIFO |
| Strangers | Esporádicos, específicos de cliente ou novos | Fabricação sob pedido, liberada por autorização CONWIP ou POLCA, ou planejada por MRP |

O coeficiente de variação é o desvio padrão da demanda diária (ou semanal) dividido pela sua média. Uma peça com média de 100 por dia e desvio padrão de 30 tem CV = 0,3. Uma peça com média de 10 por dia e desvio padrão de 15 tem CV = 1,5 e é um candidato ruim para kanban: seu laço precisaria manter estoque suficiente para picos raros, de modo que na maior parte do tempo os contêineres simplesmente ficariam parados.

### Projetando um supermercado

| Ponto de projeto | Regra prática | Por quê |
|---|---|---|
| Localização | Ao lado do processo fornecedor, não do consumidor | O fornecedor vê o próprio estoque e o repõe; o operador de movimentação o busca |
| Endereçamento | Cada código de peça tem um endereço fixo (corredor, estante, nível, posição) impresso no cartão [1] | Contêineres extraviados ficam visíveis; a reposição é rápida |
| Capacidade | Posições físicas para exatamente o número máximo de contêineres do laço, nem mais | A superprodução não tem para onde ir; ela se torna visível |
| Direção do fluxo | Abastecer por trás, retirar pela frente (estantes de fluxo por gravidade) | Primeiro a entrar, primeiro a sair por projeto |
| Máx/mín visual | Marcas coloridas ou posição do kanban de sinalização na estante | Qualquer pessoa vê o status sem um sistema |
| Padrão de contêiner | Contêiner acordado por código de peça com quantidade fixa; peso ergonômico | Contagem por contêineres em vez de por peças |
| Segurança e ergonomia | Manter contêineres pesados entre a altura do joelho e a do ombro; verificar levantamento e alcance conforme a orientação de ergonomia da OSHA [28] | Os operadores de movimentação repetem esses movimentos centenas de vezes por turno |

### Filas FIFO: dimensionando a fila

Uma fila FIFO é uma fila com quantidade máxima entre dois processos. Quando está cheia, o processo fornecedor para; quando está vazia, o consumidor espera. Diferentemente de um supermercado, ela não mantém estoque por código de peça, apenas uma sequência de ordens de produção.

**Exemplo de dimensionamento.** Uma linha de pintura recebe ordens de uma célula de soldagem. A soldagem produz uma ordem a cada 10 minutos; a pintura consome na mesma taxa média, mas para por 90 minutos em cada troca de cor, duas vezes por turno. A fila FIFO precisa absorver a produção da soldagem durante uma troca de cor: 90 ÷ 10 = 9 ordens. Com uma margem de 3, a fila comporta 12 ordens. Pela lei de Little, uma ordem espera no máximo cerca de 12 × 10 = 120 minutos na fila [6].

Se a fila está frequentemente cheia, a pintura é o gargalo ou a troca de cor é longa demais. Se frequentemente está vazia, o problema é a soldagem. Em ambos os casos, a fila torna isso visível. Essa é a sua função.

### O marca-passo: um ponto de programação

Em um sistema puxado, apenas um processo recebe um programa de produção: o marca-passo. Normalmente é a montagem final ou o último processo de fluxo contínuo antes da expedição. Tudo o que vem antes segue os sinais do kanban; tudo o que vem depois flui em FIFO. Programar o marca-passo é o ponto em que o [guia de programação da produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/) se encontra com este: o APS ou o planejador decide o que o marca-passo produz e em que ordem, e os circuitos kanban decidem o que o restante da fábrica repõe.

### A rota do operador de movimentação

Os supermercados precisam de alguém que movimente cartões e contêineres em um ciclo fixo. Essa função costuma ser chamada de water spider ou mizusumashi. A rota é cronometrada conforme o pitch (veja abaixo): a cada intervalo de pitch, o operador pega a próxima instrução de produção na caixa heijunka, a entrega, recolhe os vazios e os kanbans de retirada e leva os contêineres cheios até a linha. Uma rota fixa transforma o intervalo de coleta da fórmula de dimensionamento em um valor conhecido, e não em uma estimativa. Cronometre a rota com o operador e reserve uma margem para atrasos e pausas; uma rota que nunca cabe dentro do pitch é sobrecarga (muri), e ela será ignorada justamente quando a linha estiver mais ocupada. Para rotas internas à fábrica e milk runs com mais profundidade, veja o [guia de logística interna](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/).

## Heijunka: nivelando o programa do qual o kanban depende

O kanban reage ao consumo. Se o marca-passo produz 300 unidades do modelo A na segunda-feira e nenhuma na terça-feira, cada circuito a montante do modelo A registra um pico seguido de nada. Os circuitos precisam ser dimensionados para o pico, e o estoque cresce. Nivelar o programa do marca-passo evita isso.

O Lean Enterprise Institute define heijunka como "nivelar o tipo e a quantidade de produção ao longo de um período fixo de tempo" [18]. Seus dois exemplos são a referência padrão:

- **Nivelamento de volume:** um produtor recebe 500 pedidos por semana, variando de 200 na segunda-feira a 50 na quarta e na sexta, mantém um pequeno estoque de produtos acabados próximo à expedição e produz um ritmo constante de 100 por dia [18].
- **Nivelamento de mix:** com demanda semanal de 5 A, 3 B, 2 C e 2 D, um produtor de massa executa todos os A, depois todos os B; um produtor enxuto intercala os modelos em uma sequência repetitiva [18].

O LEI lista como benefícios prazos de entrega menores, um consumo mais estável de peças, o que alivia a demanda sobre os fornecedores, lotes menores que limitam a propagação de defeitos e cargas de trabalho mais uniformes para os operadores [18].

### Pitch: a unidade de tempo de um sistema puxado

O LEI define pitch como "o tempo necessário em uma área de produção para fabricar um contêiner de produtos", calculado como takt time × quantidade por contêiner; com takt de um minuto e 20 peças por contêiner, o pitch é de 20 minutos [19].

### Exemplo prático: uma caixa heijunka para a linha de suportes

Continuemos com a linha de dois turnos da seção de dimensionamento: takt de 0,9375 minuto, contêineres de 40 peças.

- Pitch = 0,9375 × 40 = 37,5 minutos
- Posições por dia = 900 ÷ 37,5 = 24 (12 por turno)
- Demanda diária de 960 peças = 24 contêineres

A linha fabrica quatro modelos com demanda diária de A = 480, B = 240, C = 160 e D = 80 peças, o que equivale a 12, 6, 4 e 2 contêineres por dia, ou 6, 3, 2 e 1 por turno.

Um programa em lotes por turno seria A A A A A A B B B C C D. Um programa nivelado distribui cada modelo ao longo do turno:

| Posição (a cada 37,5 min) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Modelo | A | B | A | C | A | B | A | C | A | B | A | D |

Conferência de contagem: A aparece 6 vezes, B 3, C 2, D 1. Na caixa heijunka, cada posição contém o kanban de produção de um contêiner. O operador retira um kanban a cada 37,5 minutos. Se um kanban ainda estiver na caixa quando a próxima posição começar, a linha está atrasada, e todos podem ver quanto.

A sequência nivelada exige 11 trocas de modelo por turno, em vez de 3. Isso só é econômico quando as trocas no marca-passo levam segundos ou poucos minutos, que é o motivo concreto para o SMED vir antes do nivelamento de mix. O [guia de manufatura enxuta](https://www.m365.fm/en/learn/lean-manufacturing/) apresenta a sequência geral como estabilidade antes do fluxo, fluxo antes do puxar, puxar antes do nivelamento. Na prática, o nivelamento de volume no marca-passo costuma começar junto com os primeiros circuitos kanban, e o nivelamento fino de mix vem depois, quando as trocas permitirem.

### O que acontece a montante quando você nivela

Compare os lotes do modelo D. No cronograma em lotes, as 40 peças do D são consumidas em um único bloco de 37,5 minutos no fim do turno, e o circuito precisa cobrir uma demanda de 80 por dia em até duas rajadas. No cronograma nivelado, o consumo continua em 80 por dia, mas distribuído ao longo do dia. A demanda de pico durante o tempo de reposição cai, e cai também a folga de segurança necessária. Somados vários números de peça, essa diferença costuma ser maior do que qualquer otimização da quantidade de cartões.

## Além do kanban: CONWIP, POLCA e drum-buffer-rope

Circuitos de kanban específicos por número de peça funcionam quando cada número de peça tem demanda regular. Quando uma linha produz centenas de variantes, um supermercado para cada uma manteria mais estoque do que a fábrica tinha antes. Três alternativas mantêm o limite de WIP sem estocar cada número de peça.

### CONWIP: um limite de WIP para a linha inteira

CONWIP significa constant work in process (trabalho em processo constante). Spearman, Woodruff e Hopp o descreveram em 1990 no *International Journal of Production Research* como "um novo sistema de produção puxado", apoiado em argumentos teóricos e estudos de simulação [3]. O mecanismo: nenhum job pode entrar na linha sem um cartão; quando um job concluído sai da última estação, seu cartão volta para a primeira estação e autoriza o job seguinte [5]. Dentro da linha, os jobs fluem em ordem FIFO, como em uma linha empurrada.

A comparação feita no artigo sobre CONWIP da Wikipedia é útil: o kanban mantém um controle de WIP mais apertado por meio de cartões individuais em cada estação de trabalho, enquanto o CONWIP é mais fácil de implantar e ajustar porque apenas um conjunto de cartões gerencia o WIP do sistema [5]. Em 2022, os mesmos três autores publicaram "CONWIP Redux", fazendo um balanço de 30 anos de desenvolvimento e abordando mal-entendidos comuns [4].

**Exemplo resolvido: definindo o nível de CONWIP.** Uma linha de cinco estações tem uma taxa de gargalo de 60 unidades por hora. O tempo bruto de processamento de uma unidade por todas as cinco estações, sem nenhuma espera, é de 25 minutos (0,417 hora). Pela lei de Little, o WIP necessário para manter o gargalo ocupado, caso não houvesse nenhuma variabilidade, é 60 × 0,417 = 25 unidades [6]. Linhas reais têm variabilidade, então a fábrica começa com 35 cartões e acompanha a vazão.

Se a vazão se mantiver em cerca de 60 por hora, o lead time médio = 35 ÷ 60 = 0,58 hora, cerca de 35 minutos. Em seguida, a equipe retira cartões em passos de dois. Se a vazão cair abaixo da taxa do gargalo com 29 cartões, ela volta para 31. Compare com uma linha sem limite, com 150 unidades: mesma produção, lead time de 150 ÷ 60 = 2,5 horas.

### POLCA: puxada para fábricas de alto mix e baixo volume

POLCA significa paired-cell overlapping loops of cards with authorization (laços sobrepostos de cartões com autorização entre células pareadas) [21]. Rajan Suri a criou por meio de seu trabalho no Center for Quick Response Manufacturing da University of Wisconsin–Madison [21]. Seu *Practitioner's Guide to POLCA* a descreve como "um sistema de controle visual baseado em cartões que gerencia o fluxo de jobs pelo chão de fábrica", "especialmente adequado para empresas que fabricam produtos de alto mix, baixo volume e customizados", e observa que o kanban "não funciona bem com produção de baixo volume ou sob encomenda" [20].

O mecanismo, em resumo: cada par de células que passa trabalho uma para a outra compartilha um laço de cartões (por exemplo, "Fresa–Solda"). Um job só pode começar na célula de fresamento quando sua data de liberação tiver chegado e houver um cartão Fresa–Solda livre, o que sinaliza que a solda tem capacidade para ele. Quando a solda termina o job, o cartão volta para a fresa. Como os laços se sobrepõem, cada célula é coberta pelos cartões de seus pares a montante e a jusante. A POLCA combina datas de liberação planejadas vindas do ERP com um sinal de capacidade vindo do chão de fábrica.

### Drum-buffer-rope: puxada a partir do gargalo

Drum-buffer-rope (DBR) é o método de controle de produção da teoria das restrições, associado a Eliyahu Goldratt (fontes no guia da teoria das restrições linkado abaixo). A restrição (o drum) define o ritmo; um time buffer a protege de perturbações a montante; a rope amarra a liberação de material ao consumo do drum. O DBR limita o WIP apenas à frente da restrição, o que o torna um sistema puxado no sentido de Hopp e Spearman [2]. O guia da Veryable lista CONWIP e DBR como as duas principais alternativas ao kanban [24]. O DBR é explicado em detalhes no [guia da teoria das restrições](https://www.m365.fm/en/learn/theory-of-constraints/).

### Tabela de decisão: qual sistema de puxada se encaixa?

| Critério | Kanban (supermercado) | CONWIP | POLCA | Drum-buffer-rope |
|---|---|---|---|---|
| Mix de produtos | Baixo a médio, números de peça repetidos | Médio a alto, roteiro comum | Mix alto, sob encomenda, muitos roteiros | Qualquer, com uma restrição clara |
| Demanda por número de peça | Regular | Irregular é aceitável | Irregular é aceitável | Irregular é aceitável |
| Estoca produtos acabados | Sim, em supermercados | Não (produção sob pedido é possível) | Não | Não; pulmão de tempo antes da restrição |
| Controle de WIP | Por loop, por número de peça | Linha inteira | Entre cada par de células | Antes da restrição |
| Precisa de datas de liberação do planejamento | Não para itens de giro | Sim, uma sequência de backlog | Sim, datas de liberação | Sim, cronograma da restrição |
| Facilidade de configuração | Média (muitos loops para dimensionar) | Fácil (um número por linha) | Média (loops por par de células) | Média (a restrição precisa ser estável) |
| Falha típica | Supermercados para itens de terceiros | Sequência errada no backlog | Loops demais, confusão de cartões | A restrição muda com o mix |

A maioria das fábricas combina os sistemas: kanban para itens de giro e componentes C comprados, CONWIP ou POLCA para variantes sob encomenda, e DBR onde um recurso limita claramente a produção.

## E-kanban e a interação ERP/MRP

### O que é o e-kanban

O kanban eletrônico substitui os cartões físicos por sinais eletrônicos. A Wikipedia observa que isso ajuda a eliminar problemas comuns, como erros de digitação manual e cartões perdidos [10]. O LEI aponta que os kanbans de fornecedores distantes "geralmente assumiram uma forma eletrônica" [1]. A lógica não muda: um número fixo de sinais de puxada por loop, disparados pelo consumo.

**Como funciona um loop típico de e-kanban:**

1. Cada contêiner tem uma etiqueta com código de barras, QR code ou tag RFID que identifica o kanban (número da peça, loop, número do cartão).
2. Quando um contêiner é esvaziado, o operador ou o movimentador o escaneia, ou um sensor detecta a posição vazia (balança, barreira de luz, portal RFID).
3. O ERP ou uma aplicação dedicada de kanban muda o status desse kanban para "vazio" e cria um sinal de reposição: uma ordem de produção ou job para um fornecedor interno, ou uma liberação contra um pedido de compra em bloco para um fornecedor externo.
4. O processo fornecedor vê o sinal em sua fila, em uma tela (um quadro digital de kanban na célula) ou em um cartão impresso.
5. Quando o contêiner cheio é recebido e escaneado em seu endereço de armazenagem, o kanban volta para "cheio".

### Físico vs. eletrônico: quando migrar

| Fator | Manter cartões físicos | Migrar para e-kanban |
|---|---|---|
| Distância fornecedor-consumidor | Mesmo prédio, a algumas centenas de pés | Outro site, fornecedor externo, outro país |
| Número de loops | Dezenas | Centenas ou milhares |
| Taxa de perda de cartões | Baixa, os cartões são fáceis de auditar | Perdas recorrentes de cartões, faltas de estoque rastreadas até os cartões |
| Necessidade de dados | Controle visual é suficiente | Precisa de tempos de reposição, desempenho de loops, histórico de demanda |
| Maturidade | Equipe ainda aprendendo as regras | Regras estáveis e seguidas |
| Ambiente TI/OT | Sem escaneamento ou rede confiáveis no chão de fábrica | Scanners, rede e módulo de kanban do ERP disponíveis |

Um erro frequente é começar pelo e-kanban. A tela esconde o que uma prateleira cheia de cartões mostra: quem está com os cartões, qual loop transborda, qual regra é quebrada. Nossa recomendação: opere um loop em papel até que as regras se sustentem e então digitalize.

### Como os sistemas ERP tratam o kanban

Os principais sistemas ERP incluem funções de kanban. Dois exemplos publicados mostram como os cálculos diferem bastante.

- **Microsoft Dynamics 365 Supply Chain Management** calcula a quantidade de kanban a partir de uma política de cálculo de quantidade de kanban, usando demanda média em um período de demanda definido, lead time, um fator de segurança e, opcionalmente, estoque de segurança derivado de um nível de serviço; com nível de serviço de 90 por cento, usa z = 1,29 [15]. Distingue regras de kanban de quantidade fixa, kanbans de uso único e kanbans de evento [15]. Os cartões circulantes são impressos uma vez e depois se movem entre a origem e o ponto de consumo, muitas vezes várias vezes por dia [15].
- **Oracle JD Edwards** oferece várias equações de kanban, por exemplo "tamanho de contêiner fixo e alta demanda", em que o tamanho do kanban é igual à demanda diária alta × (dias de lead time de entrega + dias de delta de escaneamento) + estoque de segurança, e o número de cartões é igual ao tamanho do kanban dividido pelo tamanho do contêiner [16]. A demanda diária alta é obtida do maior valor de demanda por período na janela do MRP, ajustada pelas divisões por fornecedor e local [16].

Antes de confiar nas quantidades de cartões sugeridas pelo ERP, verifique três pontos: qual demanda ele usa (média ou pico, passada ou futura), se acrescenta um cartão para o contêiner em uso e como trata os tamanhos de lote no processo fornecedor. Essas escolhas explicam a maior parte das diferenças entre o número do ERP e a experiência do chão de fábrica.

### MRP e kanban: quem faz o quê

O MRP (planejamento das necessidades de materiais) desdobra um plano mestre de produção pela estrutura de materiais (BOM) e cria ordens planejadas por data. O kanban substitui apenas a última etapa, para as peças controladas por kanban: a liberação de ordens individuais. Uma divisão de trabalho viável:

| Tarefa | MRP / ERP | Ciclo kanban |
|---|---|---|
| Planejamento de capacidade e materiais de longo prazo | Sim: S&OP, plano mestre, capacidade aproximada (rough-cut) | Não |
| Contratos com fornecedores, pedidos em aberto, previsões aos fornecedores | Sim: compartilhar as quantidades previstas para o planejamento de capacidade | Não |
| Itens de longo lead time e itens fora do kanban | Sim: ordens planejadas | Não |
| Liberação diária das peças kanban | Não: suprimir as ordens planejadas para essas peças | Sim: sinal de consumo |
| Transações de estoque | Sim: entradas, saídas, frequentemente com baixa automática (backflushing) | Gera as transações (leitura por scanner) |
| Dimensionamento dos ciclos | Calcula sugestões a partir da demanda | O chão de fábrica valida e ajusta |
| Custeio e avaliação | Sim | Não |

Dois pontos técnicos são importantes:

- **Evite o planejamento duplicado.** Se o MRP continuar criando ordens planejadas para uma peça que também está no kanban, compradores e programadores recebem dois sinais contraditórios. A maioria dos sistemas ERP permite marcar a peça como controlada por kanban, de modo que o MRP a planeje apenas para fins de capacidade e previsão. As configurações variam conforme o sistema; consulte a documentação do seu ERP.
- **A baixa automática exige BOMs precisas.** Quando o sistema deduz os componentes automaticamente em um ponto de apontamento, quantidades erradas na BOM aparecem como faltas fantasmas no ciclo kanban. Corrija a BOM, não a quantidade de cartões.

MRP e S&OP são tratados em profundidade no [guia de S&OP, MRP e planejamento da produção](https://www.m365.fm/en/learn/sop-mrp-production-planning/), e a política de estoque, incluindo o cálculo do estoque de segurança, no [guia de gestão de estoques na manufatura](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/).

### Onde o e-kanban se encaixa na arquitetura TI/TO

O e-kanban toca várias camadas de sistemas: o ERP (planejamento, compras, avaliação de estoque), o MES ou aplicativo do chão de fábrica (sinais de produção, confirmações), scanners e sensores no chão de fábrica, e portais de fornecedores ou links EDI com fornecedores externos. O modelo ISA-95 para integrar sistemas corporativos e de controle é uma forma útil de decidir qual sistema é dono de cada dado do kanban; veja o [guia de MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/). Duas regras práticas:

- **Um sistema é dono dos dados mestres do kanban** (ciclos, quantidades de cartões, quantidades por contêiner). Duplicatas em Excel, MES e ERP se distanciam em poucas semanas.
- **Proteja-se contra sinais duplicados.** Um contêiner lido duas vezes, ou um sensor que oscila, cria dois sinais de reposição para um mesmo contêiner vazio. Permita apenas um sinal aberto por ID de kanban e registre cada mudança de status.
- **Planeje para falhas.** Se a rede ou o aplicativo de kanban falhar, o chão de fábrica precisa de cartões impressos ou de um procedimento manual de contingência para cada ciclo. Qualquer dispositivo de leitura e conexão com fornecedores também faz parte da superfície de ataque da fábrica; o [guia de cibersegurança de OT](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) explica como segmentar e proteger essas conexões. Para opções de integração em nuvem, veja o [guia de Azure para manufatura](https://www.m365.fm/en/learn/manufacturing-it-azure/).

### Simulando os ciclos antes de implantá-los

Para fábricas com muitos ciclos ou forte variação de demanda, uma simulação de eventos discretos pode testar quantidades de cartões, tamanhos de supermercado e intervalos de rota com a demanda histórica antes que qualquer coisa mude no chão de fábrica. O [guia de simulação de manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) explica como esses modelos são construídos. Softwares de mapeamento de fluxo de valor podem ajudar a manter os mapas de estado futuro, com supermercados e ciclos kanban, consistentes entre as unidades; o [guia do iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) descreve uma dessas ferramentas e suas limitações. **Nota: O autor trabalha na iFAKT GmbH.**

## Modelos: cartão, planilha de dimensionamento, checklist de supermercado, auditoria

Copie estas tabelas para uma planilha ou para a documentação do chão de fábrica. Elas são propositalmente simples: um sistema kanban deve funcionar com uma impressora e uma plastificadora antes de precisar de software.

### Modelo 1: layout do cartão kanban

| Campo | Exemplo | Observações |
|---|---|---|
| Número e nome da peça | B-200, suporte esquerdo | Fonte grande; legível a 6 pés (cerca de 2 m) |
| Tipo de kanban | Kanban de produção | Código de cores por tipo (por exemplo, branco = produção, amarelo = retirada, vermelho = emergência) |
| Número do cartão | 3 de 9 | Mostra o tamanho do ciclo e revela cartões perdidos |
| Quantidade do contêiner | 40 peças | Nunca escrever "aprox." |
| Tipo de contêiner | Caixa azul 600 × 400 mm | Compatível com a posição da prateleira |
| Processo fornecedor ou fornecedor | Célula W2 (estampagem e solda) | Para kanban de fornecedor: nome e ID do fornecedor |
| Endereço de armazenagem (supermercado) | SM-W2, prateleira 3, nível B, posição 07 | Local para onde o contêiner cheio retorna [1] |
| Endereço do processo consumidor | Linha 1, estação 14, prateleira esquerda | Ponto de uso [1] |
| Código de barras ou QR code | ID do ciclo + número do cartão | Para e-kanban ou leituras de auditoria |
| Revisão e data | Rev. 4, nov. 2026 | Alterado quando o ciclo é redimensionado |

### Modelo 2: planilha de dimensionamento de ciclos

| Linha | Entrada | Unidade | Exemplo (suporte B-200) |
|---|---|---|---|
| 1 | Demanda média diária | peças/dia | 960 |
| 2 | Tempo disponível por dia | minutos | 900 |
| 3 | Takt (linha 2 ÷ linha 1) | minutos/peça | 0,9375 |
| 4 | Quantidade do contêiner | peças | 40 |
| 5 | Intervalo de coleta de cartões | minutos | 60 |
| 6 | Fila no processo fornecedor | minutos | 90 |
| 7 | Troca de ferramental por lote (se não estiver na fila) | minutos | 0 |
| 8 | Tempo de processamento por contêiner | minutos | 20 |
| 9 | Transporte e reposição | minutos | 15 |
| 10 | Tempo de reposição (linhas 5 a 9) | minutos | 185 |
| 11 | Kanbans para o tempo de reposição (linha 10 ÷ linha 3 ÷ linha 4) | kanbans | 4,93 |
| 12 | Tamanho do lote no processo fornecedor | contêineres | 4 |
| 13 | Kanbans extras para formação de lote (linha 12 – 1) | kanbans | 3 |
| 14 | Margem de segurança (10% da linha 11) | kanbans | 0,49 |
| 15 | Total (linhas 11 + 13 + 14), arredondado para cima | kanbans | 9 |
| 16 | Estoque máximo do ciclo (linha 15 × linha 4) | peças | 360 |
| 17 | Dias de cobertura (linha 16 ÷ linha 1) | dias | 0,375 |
| 18 | Próxima data de revisão | data | mensal |

### Modelo 3: checklist de projeto do supermercado

| # | Verificação | Sim / Não |
|---|---|---|
| 1 | Todo número de peça no supermercado atende aos critérios de itens de giro (demanda regular, baixa variação) | |
| 2 | Todo número de peça tem exatamente um endereço fixo | |
| 3 | A capacidade da prateleira é igual ao tamanho máximo do ciclo por número de peça, sem posições extras | |
| 4 | As prateleiras são abastecidas por trás e retiradas pela frente | |
| 5 | As posições dos sinais kanban ou as marcas de mínimo/máximo estão visíveis | |
| 6 | Pesos dos contêineres e alturas de manuseio revisados conforme orientações ergonômicas [28] | |
| 7 | Os corredores permitem acesso seguro para carrinhos ou rebocadores, separados das passagens de pedestres | |
| 8 | Posto kanban no consumidor e no processo fornecedor | |
| 9 | A rota do abastecedor e o intervalo de coleta estão documentados e cronometrados | |
| 10 | O caminho de retorno dos contêineres vazios está definido | |
| 11 | Uma pessoa de contato e um substituto estão nomeados para o supermercado | |
| 12 | O procedimento e a cor do kanban de emergência estão definidos | |

### Modelo 4: auditoria semanal de kanban

| Verificação | Como | Meta | Ação se não atendida |
|---|---|---|---|
| Contagem de cartões por ciclo | Contar os cartões nos postos, no fornecedor, nos contêineres cheios e na linha | Igual à lista mestre | Procurar; se perdido, substituir e registrar a causa |
| Contêineres sem identificação | Percorrer o supermercado e a linha | Zero | Identificar ou remover; descobrir quem os criou |
| Excesso no supermercado | Contêineres fora das posições fixas | Zero | Interromper a superprodução; verificar a regra 3 |
| Falta de material | Paradas de linha ou faltas causadas por ciclos vazios | Zero; registrar a contagem | Causa raiz: cartão, dimensionamento, fornecedor, qualidade |
| Kanbans de emergência em uso | Contar cartões vermelhos | Zero após a recuperação | Retirar; analisar o gatilho |
| Tempo de reposição | Registros de horário ou amostra de 10 cartões | Dentro do valor usado no dimensionamento | Redimensionar o ciclo ou eliminar o atraso |
| Peças defeituosas nos contêineres | Verificação por amostragem no ponto de uso | Zero | Contenção de qualidade na origem |

### Modelo 5: regras de kanban para o quadro do chão de fábrica

| # | Regra | Quem |
|---|---|---|
| 1 | Retiramos peças somente do nosso endereço de ponto de uso | Operadores |
| 2 | Quando um contêiner está vazio, seu cartão vai imediatamente para o posto kanban | Operadores |
| 3 | Produzimos somente o que os kanbans de produção autorizam, na sequência deles | Célula fornecedora |
| 4 | Um contêiner cheio sempre leva seu cartão | Todos |
| 5 | Peças defeituosas nunca entram em um contêiner; paramos e chamamos | Todos |
| 6 | Cartões são adicionados ou removidos somente pelo responsável do circuito, com data | Líder de materiais |
| 7 | Cartões vermelhos de emergência voltam ao responsável do circuito após o uso | Líder de materiais |
| 8 | Se o sistema e a prateleira divergirem, confiamos na prateleira e reportamos a diferença | Todos |

## Como implementar kanban na manufatura: um roteiro de 26 semanas

Implementar um sistema puxado começa com um processo produtivo estável, e não com cartões. O roteiro abaixo é uma sequência típica para uma cadeia de valor e sua equipe de manufatura em uma fábrica de porte médio. As durações são premissas de planejamento, não benchmarks; fábricas com experiência prévia em lean avançam mais rápido, e fábricas com processos instáveis, mais devagar.

| Fase | Semanas | Objetivo | Atividades principais | Critérios de saída |
|---|---|---|---|---|
| 0. Selecionar e estabelecer linha de base | 1–2 | Escolher o piloto, medir a situação atual | Escolher uma família de produtos; mapa do estado atual; medir WIP, lead time, rupturas de estoque, valor de estoque | KPIs de linha de base aprovados por operações e finanças |
| 1. Estabilizar | 3–6 | Tornar o processo capaz de operar em puxada | 5S no fornecimento e no ponto de uso; corrigir as principais causas de parada; reduzir trocas de ferramenta no processo fornecedor; definir os contêineres | O processo fornecedor atinge a produção planejada em 9 de cada 10 dias |
| 2. Projetar | 7–10 | Estado futuro e projeto dos circuitos | Segmentar as peças (runners, repeaters, strangers); escolher os tipos de circuito; dimensionar os circuitos com a planilha; projetar supermercado e rota | Lista de circuitos com quantidade de cartões, endereços e responsáveis |
| 3. Piloto | 11–14 | Operar de 5 a 15 circuitos | Imprimir cartões, treinar operadores e movimentadores, iniciar os circuitos; revisão diária no quadro; ajustar dimensionamentos | Duas semanas sem rupturas causadas pelo projeto dos circuitos |
| 4. Expandir | 15–22 | Cobrir a cadeia de valor | Adicionar os runners restantes; primeiros kanbans de fornecedores; conectar a programação do pacemaker; nivelar o mix | 80% dos números de peça runner em kanban; ordens planejadas do MRP suprimidas para eles |
| 5. Melhorar e digitalizar | 23–26 e contínuo | Reduzir WIP, adicionar dados | Remover cartões um a um; reduzir tamanhos de lote; e-kanban para fornecedores distantes; redimensionamento mensal | Reduções de cartões documentadas; e-kanban para circuitos selecionados |

### Pré-requisitos que você não pode pular

| Pré-requisito | Por que o kanban precisa dele | Onde ler mais |
|---|---|---|
| Processos fornecedores estáveis e capazes | Um circuito dimensionado para 0,25 dia falha se a máquina parar por meio dia | [Guia de TPM e OEE](https://www.m365.fm/en/learn/tpm-oee/) |
| Trocas de ferramenta rápidas | O tamanho do lote define a quantidade de cartões (exemplo 2) | [Guia de SMED](https://www.m365.fm/en/learn/smed-changeover-reduction/) |
| Organização do posto de trabalho | Endereços fixos, prateleiras claras, status visível | [Guia de 5S e gestão visual](https://www.m365.fm/en/learn/5s-visual-management/) |
| Trabalho padronizado para movimentadores e operadores | Intervalos de rota e manuseio de cartões precisam ser repetíveis | [Guia de trabalho padronizado](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) |
| Programação pacemaker nivelada | Demanda não nivelada infla os circuitos | Seção de heijunka acima |
| Dados confiáveis | Quantidades por contêiner, BOMs e histórico de demanda | [Guia de KPIs de manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/) |

### Escolhendo os circuitos do piloto

Bons primeiros circuitos compartilham cinco características: demanda diária, um processo fornecedor próximo, trocas de ferramenta abaixo de cerca de 15 minutos, uma peça que tenha causado faltas visíveis ou excesso de estoque, e um líder de equipe que queira experimentar. Evite a peça do gargalo mais crítico da fábrica para o primeiro circuito; um erro de projeto ali para a linha inteira.

### Envolvendo operadores, movimentadores e seus representantes

Um sistema kanban altera o trabalho diário de operadores e movimentadores de materiais. O comprometimento deles define se as regras se sustentam.

- **Explique o objetivo antes das regras.** Pessoas que veem as faltas de material e os racks transbordando geralmente entendem rapidamente por que um limite de WIP ajuda. Pessoas que recebem a ordem de "seguir o cartão" sem contexto não entendem.
- **Deixe os operadores definirem as posições dos contêineres e as alturas dos racks.** Eles sabem onde alcançar e levantar causa dor. Use os recursos de ergonomia da OSHA como referência para a revisão [28].
- **Combine o que acontece com o tempo e a mão de obra liberados.** Se a movimentação de estoque diminuir, as pessoas se preocupam com os empregos. Declare isso logo no início e, por escrito se houver um acordo coletivo de trabalho com sindicato, informe como a capacidade liberada será usada. O [guia de manufatura enxuta](https://www.m365.fm/en/learn/lean-manufacturing/) trata do contexto trabalhista dos EUA, incluindo os comitês de participação dos funcionários sob a NLRA.
- **Torne segura a regra de parada.** A regra 5 (sem defeitos a jusante) só funciona se parar e pedir ajuda nunca for punido.
- **Use o quadro diário.** Problemas de loops pertencem à reunião diária escalonada; veja o [guia de gestão do chão de fábrica](https://www.m365.fm/en/learn/shop-floor-management/).

### Buscando ajuda externa

Fabricantes dos EUA, especialmente os pequenos e médios, podem procurar o centro Manufacturing Extension Partnership (MEP) do NIST em seu estado para apoio em manufatura enxuta e melhoria de processos; o NIST MEP lista a melhoria de processos e a manufatura enxuta entre seus serviços [27]. Métodos de melhoria contínua para manter os loops evoluindo são tratados no [guia de kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/).

## KPIs de kanban e a visão financeira

### KPIs operacionais

| KPI | Fórmula | Exemplo | Direção da meta |
|---|---|---|---|
| Estoque do loop (máx.) | Kanbans × quantidade do contêiner | 9 × 40 = 360 peças | Para baixo ao longo do tempo |
| Dias de cobertura | Estoque máximo do loop ÷ demanda diária média | 360 ÷ 960 = 0,375 dia | Para baixo, dentro dos limites de segurança |
| Faltas de material por semana | Contagem de paradas de linha ou faltas causadas por um loop vazio | 2 | Zero |
| Precisão dos cartões | Cartões encontrados na auditoria ÷ cartões na lista mestre | 87 ÷ 90 = 96,7% | 100% |
| Aderência ao tempo de reposição | Kanbans reabastecidos dentro do tempo dimensionado ÷ todos os kanbans | 182 ÷ 200 = 91% | Para cima |
| Kanbans de emergência | Quantidade emitida por mês | 4 | Para baixo |
| WIP (fluxo de valor) | Soma das peças entre o primeiro e o último processo | 3.200 -> 1.200 | Para baixo |
| Lead time (lei de Little) | WIP ÷ vazão [6] | 1.200 ÷ 400 = 3 dias | Para baixo |
| Giro de estoque | Custo anual dos produtos vendidos ÷ valor médio do estoque | US$ 24 mi ÷ US$ 3 mi = 8 | Para cima |
| Entrega no prazo | Pedidos enviados no prazo ÷ todos os pedidos | 95% | Para cima ou estável |
| Kanbans removidos | Cartões retirados após melhoria, por trimestre | 12 | Acompanhar, não é uma cota |

Observe os pares. Um estoque em queda com aumento das faltas de material significa que os loops foram cortados demais ou que o processo ainda não é estável o suficiente. Entrega no prazo em alta com estoque estável pode indicar que os loops estão adequados e que a melhoria veio do nivelamento. Definições de KPIs e painéis para a fábrica como um todo são tratados no [guia de KPIs de manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/).

### A visão financeira: caixa, custo de carregamento e lucro reportado

Um controller de fábrica observa três efeitos.

**1. Liberação de caixa pontual.** Suponha que 120 números de peça de produção regular passem de pontos de reposição mín./máx. para kanban, e que o estoque médio em mãos de cada loop caia US$ 3.000 ao custo padrão. Isso libera 120 × US$ 3.000 = US$ 360.000 de capital de giro, uma única vez. Não se repete todo ano.

**2. Economia contínua de custo de carregamento.** O custo de carregamento abrange custo de capital, armazenagem, movimentação, seguros, obsolescência e quebra. O percentual varia muito de empresa para empresa e de setor para setor; use o número do seu próprio controller. Com 20% ao ano como ilustração (uma premissa deste exemplo, não um benchmark), a redução de US$ 360.000 economiza cerca de US$ 72.000 por ano.

**3. Um impacto temporário no lucro reportado sob custeio por absorção.** No custeio por absorção, os produtos acabados e o WIP carregam parte dos custos fixos de fabricação. Quando o estoque cai, os custos indiretos que haviam sido capitalizados em períodos anteriores passam para o custo dos produtos vendidos, de modo que o lucro reportado pode cair nos trimestres em que o WIP e os produtos acabados diminuem, mesmo que o caixa melhore. Relatórios internos baseados em custeio variável (direto) não mostram essa queda, o que é uma das razões para exibir as duas visões na revisão do piloto. Explique isso à liderança antes do piloto, ou o primeiro trimestre com kanban pode parecer um fracasso. Matérias-primas e peças compradas não carregam custos indiretos absorvidos, então o efeito vem principalmente do WIP e dos produtos acabados.

**Custos a orçar.** Contêineres, racks e prateleiras de fluxo (capex ou opex, dependendo do seu limite de capitalização), impressão e plastificação de cartões, tempo de treinamento, possivelmente scanners e licenças do módulo kanban do ERP para e-kanban (normalmente opex em modelo de assinatura) e a rota do operador de movimentação de materiais. Um piloto típico de 10 a 15 loops é, na maior parte, custo de mão de obra e de contêineres; o dimensionamento e as regras não custam nada, exigem apenas disciplina.

**Exemplo de business case para um piloto (todos os valores são ilustrativos):**

| Item | Valor |
|---|---|
| Contêineres e racks de fluxo para 15 loops | US$ 18.000 |
| Treinamento: 40 pessoas × 4 horas × US$ 45 de taxa com encargos | US$ 7.200 |
| Tempo de engenharia e coaching, 8 semanas em tempo parcial | US$ 20.000 |
| **Custo total do piloto** | **US$ 45.200** |
| Redução única de estoque, 15 loops × US$ 3.000 | US$ 45.000 |
| Economia anual de custo de manutenção de estoque a uma taxa assumida de 20% | US$ 9.000 |
| Frete evitado de expedição emergencial (dados próprios da planta, exemplo) | US$ 12.000 por ano |

Nesse exemplo, o piloto praticamente se paga em caixa já no primeiro ano. O caso mais relevante costuma ser a expansão para todo o fluxo de valor e a redução de lead time que vem junto.

## Erros comuns com kanban e como corrigi-los

| Erro | Sintoma | Correção |
|---|---|---|
| Kanban antes da estabilidade | Faltas frequentes porque a máquina fornecedora está parada ou o refugo é alto | Estabilizar primeiro (TPM, qualidade na fonte); enquanto isso, dimensionar os loops pelo tempo real de reposição |
| Supermercados para itens esporádicos | Racks cheios de itens de baixa rotação, estoque alto apesar do "puxar" | Segmentar os itens; usar produção sob pedido com CONWIP ou POLCA para os esporádicos |
| Dimensionar com o tempo de ciclo da máquina em vez do tempo de reposição | Os loops sempre ficam curtos | Medir o tempo de reposição de ponta a ponta (linhas 5 a 10 da planilha) |
| Ignorar o tamanho de lote no fornecedor | Loops curtos quando o fornecedor produz em lotes | Adicionar kanbans de formação de lote ou reduzir o tamanho do lote com SMED |
| Nunca recalcular | Loops grandes demais após queda de demanda, pequenos demais após alta | Revisão mensal; sugestões de recálculo baseadas no ERP [15] |
| Cartões extras informais | O loop cresce e a superprodução retorna | Lista mestra de cartões, responsável pelo loop, cartões coloridos de emergência retirados após o uso |
| Retirar cartões rápido demais | A linha para, a confiança se perde | Retirar um cartão por vez, quando alguém conseguir resolver o problema exposto [12] |
| Pedidos planejados do MRP em paralelo | Compradores pedem as peças de kanban duas vezes | Sinalizar as peças de kanban no ERP; usar o MRP apenas para previsão e capacidade |
| Puxador não nivelado | Os loops a montante recebem picos grandes | Caixa heijunka com pitch; lotes menores no puxador |
| E-kanban como atalho | Problemas escondidos em um sistema que ninguém observa | Operar loops em papel até que as regras funcionem; só então digitalizar com um quadro visual |
| Falta de responsabilidade | Ninguém percebe cartões perdidos | Responsável nomeado pelo loop e auditoria semanal (modelo 4) |
| Fornecedor não envolvido | O fornecedor perde sinais ou envia a mais | Acordo conjunto sobre o método de sinalização, lead time, contêiner e quantidade; começar com poucas peças |
| Lotes ou revisões misturados em um mesmo contêiner | Rastreabilidade perdida quando um lote é suspeito ou sofre recall; revisão errada na linha | Um lote e uma revisão por contêiner; número de lote ou código de data na etiqueta; racks FIFO; regra de contenção que congela os cartões do loop para o lote suspeito |

## Limites: quando o kanban é a ferramenta errada

O kanban se adequa a uma situação específica. Fábricas que usam kanban na manufatura fora dela enfrentam os seguintes problemas.

**Produção de alto mix e baixo volume, e sob encomenda.** O guia de Suri afirma claramente que o kanban "não funciona bem com produção de baixo volume ou sob encomenda" [20]. Um ciclo específico para uma peça pedida duas vezes por ano é apenas estoque com um cartão em cima. CONWIP e POLCA foram desenvolvidos para esses casos [3][20].

**Demanda altamente variável.** O tamanho do ciclo escala com a demanda durante o tempo de reposição mais a segurança. Se a demanda oscila em um fator de três de semana para semana e não pode ser nivelada, o ciclo precisa ser dimensionado para os picos, e na maior parte do tempo ele mantém estoque em excesso. Ou se nivela a demanda no pacemaker, ou se usa controle planejado (MRP), ou se redimensionam os ciclos dinamicamente.

**Reposição longa e pouco confiável.** Kanbans de fornecedores com fornecedores no exterior e tempos longos de trânsito colocam muitas semanas de estoque no ciclo; o sinal chega tarde demais para reagir a mudanças reais. Nesse caso, previsões e liberações planejadas do MRP, combinadas com um buffer local, costumam funcionar melhor.

**Ciclos de vida curtos de produtos e mudanças de engenharia.** Um ciclo cheio de peças na revisão antiga vira sucata quando o projeto muda. Planeje a descontinuação: congele o ciclo, esgote os cartões e depois introduza o novo número de peça com novos cartões.

**Risco de suprimento e resiliência.** Sistemas puxados reduzem o estoque que cobre a variação normal. Eles não são projetados para cobrir interrupções como um incêndio em fornecedor ou uma escassez de chips. A Toyota, origem do kanban, introduziu um plano de continuidade de negócios após o terremoto de 2011, pelo qual os fornecedores mantêm de dois a seis meses de estoque de semicondutores, dependendo da peça [26]. Decidir quais peças precisam de um buffer estratégico fora do ciclo kanban é uma decisão de risco; veja o [guia de resiliência da cadeia de suprimentos](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/).

**Teoria e prática.** A literatura acadêmica sobre kanban é extensa. Lage Junior e Godinho Filho revisaram 32 variações do sistema kanban e constataram uma grande diferença entre o número de propostas teóricas e práticas [17]. Muitas variantes otimizadas nunca foram testadas em uma fábrica. Para a maioria dos profissionais, o ciclo clássico com dimensionamento honesto e regras disciplinadas é o ponto de partida adequado.

**Onde o kanban se situa em ambientes regulados e de projetos.** Na indústria aeroespacial e de defesa, os baixos volumes, os longos prazos de entrega e os requisitos de rastreabilidade limitam o kanban clássico a hardware padrão, consumíveis e subconjuntos repetitivos; veja o [guia de planejamento de produção aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/). Em indústrias de processo, kanbans de sinalização em tanques ou silos podem funcionar onde os tamanhos de lote são grandes e as trocas são longas.

## Glossário de Kanban

| Termo | Definição |
|---|---|
| Quantidade do contêiner (quantidade de embalagem) | Número fixo de peças por kanban; a unidade do circuito |
| CONWIP | Constant work in process (trabalho em processo constante); sistema puxado com um único conjunto de cartões para uma linha inteira [3][5] |
| Drum-buffer-rope (DBR) | Método de controle da teoria das restrições: o gargalo define o ritmo, um buffer de tempo o protege, e a liberação é vinculada a ele |
| E-kanban | Sinal kanban eletrônico, acionado por leitura de código ou sensor [10] |
| Kanban de emergência | Cartão extra temporário para recuperar-se de uma falta; retirado após o uso |
| Fila FIFO | Fila com quantidade máxima entre dois processos, primeiro a entrar, primeiro a sair |
| Heijunka | Nivelamento do tipo e da quantidade de produção em um período fixo [18] |
| Caixa heijunka | Programação visual com tipos de produto em um eixo e faixas de tempo (pitch) no outro [18] |
| Just-in-time (JIT) | Produzir apenas o necessário, quando necessário, na quantidade necessária [8] |
| Kanban | Dispositivo de sinalização que autoriza a produção ou a retirada em um sistema puxado; em japonês, "sinal" ou "placa de sinalização" [1] |
| Posto kanban | Caixa ou suporte onde os kanbans são recolhidos para retirada |
| Lei de Little | WIP médio = vazão × lead time médio [6] |
| Circuito | Uma relação fornecedor-consumidor para um número de peça, com seu conjunto de kanbans |
| Marca-passo | O único processo que recebe o programa de produção |
| Pitch | Tempo para produzir um contêiner: takt time × quantidade de embalagem [19] |
| POLCA | Paired-cell overlapping loops of cards with authorization (circuitos sobrepostos de cartões com autorização entre células pareadas); puxada para ambientes de alta variedade e baixo volume [20][21] |
| Kanban de produção | Cartão que autoriza um processo a produzir um tipo e uma quantidade [1] |
| Sistema puxado | Sistema de produção que limita explicitamente o WIP [2] |
| Sistema empurrado | Sistema que libera trabalho conforme um cronograma, sem limite de WIP |
| Lead time de reposição | Tempo desde o esvaziamento de um contêiner (liberação de seu cartão) até o retorno do contêiner cheio ao seu ponto de armazenagem |
| Runners, repeaters, strangers | Segmentação de peças pela regularidade da demanda, usada para escolher entre kanban e produção sob encomenda |
| Fator de segurança | Percentual acrescido à demanda durante a reposição para cobrir variações |
| Kanban de sinal (kanban triangular) | Cartão que dispara um lote quando o estoque atinge o ponto de gatilho [1] |
| Supermercado | Ponto de estoque controlado, com endereços fixos e quantidades máximas, do qual o processo a jusante faz a retirada |
| Kanban de fornecedor | Kanban de retirada para um fornecedor externo, frequentemente eletrônico [1] |
| Takt time | Tempo disponível dividido pela demanda do cliente |
| Sistema de duas caixas | Dois contêineres por peça; um recipiente vazio é o sinal de reposição [10] |
| Water spider (mizusumashi) | Operador de movimentação de materiais em rota fixa, que transporta kanbans e contêineres |
| Kanban de retirada | Cartão que autoriza a movimentação de peças para um processo a jusante [1] |
| WIP | Work in process (trabalho em processo): material iniciado mas não concluído |

## FAQ: perguntas sobre sistema kanban e sistema puxado

### O que é um sistema kanban na manufatura?

Um sistema kanban controla a produção e a movimentação de materiais com sinais disparados pelo consumo. Quando um processo a jusante usa um contêiner, seu cartão ou o contêiner vazio retorna ao processo a montante e autoriza exatamente uma reposição. O número de cartões limita o estoque em cada ciclo [1].

### Quais informações constam em um cartão kanban?

Normalmente o nome e o número da peça, o processo ou fornecedor que abastece, a quantidade por contêiner (pack-out), o endereço de armazenagem e o endereço do processo consumidor [1]. A maioria das fábricas também inclui o número do cartão dentro do ciclo (por exemplo, 3 de 9), o tipo de kanban e um código de barras para auditorias ou e-kanban.

### Quais são os principais tipos de kanban?

Kanban de produção (produza esta quantidade), kanban de retirada ou movimentação (mova esta quantidade), kanban de sinal ou triângulo (inicie um lote em um ponto de disparo) e kanban de fornecedor (faça o pedido a um fornecedor externo) [1]. Sistemas de duas caixas, kanbans de emergência, kanbans únicos e e-kanban são variantes desses tipos.

### Como se calcula o número de cartões kanban?

Comece com N = demanda × lead time de reposição × (1 + fator de segurança) ÷ quantidade do contêiner e arredonde para cima. Exemplo: 960 × 0,25 × 1,1 ÷ 40 = 6,6, portanto 7 cartões. Em seguida, verifique se os intervalos de coleta e os tamanhos de lote no processo que abastece exigem cartões adicionais; no exemplo acima, eles elevam a contagem para 9 [12][13].

### Quais são as seis regras do kanban da Toyota?

Na versão mais difundida: o processo a jusante retira o que utiliza, o processo a montante produz na quantidade e na sequência dos kanbans, nada é fabricado ou movimentado sem um kanban, o kanban sempre acompanha as peças, peças defeituosas nunca são repassadas e o número de kanbans é reduzido gradualmente para expor problemas [10]. Uma segunda versão, do manual da Toyota de 1973, formula essas regras de outro modo e acrescenta "reduzir flutuações" e "estabilizar e racionalizar o processo produtivo" [11].

### Qual é a diferença entre sistemas empurrados e sistemas puxados?

Um sistema puxado limita explicitamente o trabalho em processo; um sistema empurrado libera o trabalho conforme um cronograma, sem esse limite [2]. Puxar não é o mesmo que produzir sob encomenda: um ciclo kanban de produção para estoque é puxado, e uma oficina de produção sob encomenda que libera todos os pedidos de uma só vez é empurrada.

### Kanban é o mesmo que just-in-time?

Não. Just-in-time é o princípio de produzir apenas o necessário, quando necessário, na quantidade necessária [8]. Kanban é o sistema de sinalização que a Toyota desenvolveu para colocar esse princípio em prática [7].

### O que é um sistema kanban de duas caixas?

Cada peça tem dois contêineres no ponto de uso. Quando o primeiro está vazio, o operador passa a usar o segundo e envia a caixa vazia de volta como sinal de reposição. Cada caixa contém o suficiente para cobrir a demanda durante o tempo de reabastecimento mais uma margem. É a forma mais simples de kanban e se adequa a consumíveis de baixo custo [10].

### O que é um supermercado kanban?

Um ponto de estoque controlado, normalmente ao lado do processo que abastece, em que cada número de peça tem um endereço fixo e uma quantidade máxima. O processo a jusante ou um operador de movimentação retira do estoque, e o fornecedor repõe apenas o que foi retirado.

### O que é e-kanban?

O kanban eletrônico substitui os cartões físicos por leituras, sensores ou mensagens do sistema. Ajuda a eliminar erros de lançamento manual e cartões perdidos [10] e é a forma usual para fornecedores distantes [1]. Execute primeiro um ciclo em papel; digitalize quando as regras estiverem consolidadas.

### Qual é a diferença entre kanban e MRP?

O MRP planeja materiais e capacidade a partir de um plano-mestre de produção e de listas de materiais, por data. O kanban libera a reposição pelo consumo. Na maioria das fábricas, o MRP cuida do planejamento de longo prazo, das previsões para fornecedores e das peças fora do kanban, enquanto o kanban executa a reposição diária das peças de giro [15][16].

### O que é CONWIP e como ele difere do kanban?

CONWIP (constant work in process, trabalho em processo constante) usa um único conjunto de cartões para uma linha inteira: um trabalho entra somente quando há um cartão livre, e o cartão retorna ao início quando o trabalho termina [3][5]. O kanban usa cartões específicos de cada peça em cada etapa. O CONWIP é mais fácil de implantar e se adequa a linhas com muitas variantes; o kanban oferece controle mais rígido por etapa [5].

### Quando não se deve usar kanban?

Quando a demanda por peça é esporádica ou muito variável, quando os produtos são sob medida ou de baixo volume, quando os lead times de reposição são longos e não confiáveis, ou quando as peças mudam de revisão com frequência. Nesses casos, use produção sob encomenda com CONWIP ou POLCA, ou controle planejado por MRP [20].

### Um kanban de manufatura é o mesmo que um quadro Kanban?

Não. Ambos limitam o trabalho em progresso, mas um quadro Kanban gerencia tarefas em trabalho do conhecimento e é dimensionado pelo julgamento da equipe, enquanto o kanban de manufatura gerencia peças físicas e é dimensionado por fórmula. O método de quadro tem suas raízes no sistema de produção da Toyota [22].

### Quantos kanbans um loop deve ter, no mínimo?

Dois. Com apenas um cartão, o consumidor precisa esperar sempre que o cartão estiver em trânsito. Algumas fábricas definem um mínimo interno de três para kanbans de produção.

### Quanto tempo leva para implementar o kanban?

Para uma cadeia de valor, um piloto de 5 a 15 loops pode ser executado em cerca de três meses, desde que os processos fornecedores sejam estáveis; a cobertura completa de uma cadeia de valor normalmente leva cerca de seis meses no roteiro acima. Processos instáveis e trocas de ferramental longas estendem esse prazo.

### O kanban pode funcionar com fornecedores?

Sim, por meio de kanbans de fornecedores, geralmente eletrônicos para fornecedores distantes [1]. Acorde o método de sinalização, o lead time, o contêiner, a quantidade e o que acontece em picos de demanda. Compartilhe as previsões do MRP para que o fornecedor possa planejar sua capacidade, enquanto o kanban dispara as entregas efetivas.

### O just-in-time é um sistema puxado ou empurrado?

Puxado. A Toyota descreve o JIT como um loop no qual os processos a montante reabastecem apenas o que os processos a jusante consumiram [8], e o kanban é a ferramenta que o executa [7]. Uma fábrica pode se chamar de JIT e ainda assim empurrar, por exemplo liberando cada ordem assim que ela é registrada; o teste é se o WIP é limitado [2].

### O que são sistemas empurrados e puxados na gestão da cadeia de suprimentos?

A mesma lógica aplicada entre empresas. Em uma cadeia de suprimentos empurrada, matérias-primas e produtos acabados são movimentados e estocados de acordo com previsões. Em uma cadeia puxada, a reposição segue a demanda real, por exemplo por meio de kanbans de fornecedores [1]. A maioria das cadeias combina os dois: previsões planejam a capacidade e as compras de longo lead time, e os sinais de consumo disparam as entregas.

### Um sistema puxado pode funcionar sem previsões de demanda?

Não totalmente. A reposição diária depende do consumo, mas os tamanhos dos loops são calculados a partir da demanda esperada, os módulos de kanban do ERP recalculam esses tamanhos a partir de períodos de demanda [15], e os fornecedores precisam de previsões para planejar sua capacidade. O sistema puxado substitui a liberação de ordens orientada por previsão, não a previsão em si.

### O kanban é lean ou Six Sigma?

Lean. O kanban vem do Sistema Toyota de Produção [7][8], a principal fonte da produção enxuta. O Six Sigma é um método separado, baseado em estatística, para reduzir variação e defeitos. Muitas fábricas usam os dois, porque processos estáveis e capazes permitem loops de kanban menores; veja o [guia de Six Sigma e análise de causa raiz](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).

### O kanban é japonês ou chinês?

Japonês. Kanban é a palavra japonesa para "sinal" ou "placa de sinalização" [1], e o método foi desenvolvido na Toyota, no Japão [7][10].

## Conclusão e primeiros passos

Um sistema kanban é um limite de WIP tornado visível. Seus cartões, caixas e supermercados transformam uma ideia simples da oficina de máquinas da Toyota dos anos 1950 em prática diária: produzir e movimentar apenas o que o processo seguinte consumiu. A definição mais importante para o projeto vem de Hopp e Spearman: um sistema puxado limita explicitamente o trabalho em processo [2]. O kanban faz isso número de peça por número de peça. CONWIP, POLCA e drum-buffer-rope fazem isso para linhas, pares de células e restrições, e servem onde laços específicos por peça apenas armazenariam itens de baixa rotatividade.

A parte difícil é o tempo de reposição por trás de cada cartão, o tamanho do lote no processo fornecedor, uma programação de marcapasso nivelada e a disciplina para seguir as regras. Dimensione os laços a partir dos tempos de reposição medidos, compare a sugestão do seu ERP com sua própria planilha, remova cartões somente quando alguém puder corrigir o que isso expõe, e mantenha buffers estratégicos fora dos laços onde o risco de suprimento exigir.

**Seus primeiros passos nos próximos 30 dias**

- [ ] Percorra uma família de produtos da expedição até o recebimento e conte o WIP entre cada processo
- [ ] Calcule o lead time atual com a lei de Little (WIP ÷ produtividade diária)
- [ ] Segmente os números de peça da família em runners, repeaters e strangers usando a demanda diária e seu coeficiente de variação
- [ ] Escolha de três a cinco laços de runners ao lado de um processo fornecedor estável
- [ ] Meça o tempo de reposição de cada laço de ponta a ponta e preencha a planilha de dimensionamento
- [ ] Imprima e plastifique os cartões, marque os espaços do supermercado e treine operadores e movimentadores nas oito regras do chão de fábrica
- [ ] Combine com a controladoria como a redução de estoque será reportada, incluindo o efeito do custeio por absorção
- [ ] Verifique com a TI se seu ERP possui um módulo de kanban e como ele calcula os tamanhos dos laços; evite que o MRP planeje as peças de kanban duas vezes
- [ ] Revise os laços diariamente no quadro do chão de fábrica por duas semanas, depois semanalmente com o modelo de auditoria
- [ ] Se precisar de apoio externo, entre em contato com o centro MEP do NIST do seu estado [27]

---

## Leitura complementar no m365.fm

**Guias desta trilha de aprendizagem**
- [Lean Manufacturing: Princípios, Ferramentas, Implementação e Limites](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Mapeamento do Fluxo de Valor](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Programação da Produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Planejamento de Vendas e Operações, MRP e Planejamento da Produção](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [Teoria das Restrições e Drum-Buffer-Rope](https://www.m365.fm/en/learn/theory-of-constraints/)
- [SMED e Redução de Troca de Ferramental](https://www.m365.fm/en/learn/smed-changeover-reduction/)
- [TPM e OEE](https://www.m365.fm/en/learn/tpm-oee/)
- [5S e Gestão Visual](https://www.m365.fm/en/learn/5s-visual-management/)
- [Gestão do Chão de Fábrica e Gemba Walks](https://www.m365.fm/en/learn/shop-floor-management/)
- [KPIs de Manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)
- [Cibersegurança de OT e ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/)
- [Azure para Manufatura](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Planejamento da Produção Aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

**Aprofundamentos**
- [Dimensionamento de Lotes](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Gestão de Estoque na Manufatura e Estoque de Segurança](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)
- [Intralogística e Milk Runs](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Simulação da Manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)
- [Resiliência da Cadeia de Suprimentos](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/)
- [Trabalho Padronizado](https://www.m365.fm/en/learn/shop-floor-management/standard-work/)
- [Kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/)

**Termos do glossário (entidades)**
[Kanban](https://www.m365.fm/entity/kanban/) · [Sistema puxado](https://www.m365.fm/entity/pull-system/) · [Just-in-time](https://www.m365.fm/entity/just-in-time/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [5S](https://www.m365.fm/entity/5s/) · [Trabalho padronizado](https://www.m365.fm/entity/standard-work/) · [Teoria das Restrições](https://www.m365.fm/entity/theory-of-constraints/) · [Gestão Lean](https://www.m365.fm/entity/lean-management/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** é o apresentador do m365.fm e trabalha na iFAKT GmbH. No m365.fm, ele escreve sobre manufatura enxuta, planejamento de produção e a transformação digital da produção, com foco em como modelos de fluxo de valor, simulação e análise de KPIs ajudam as fábricas a projetar fluxo e pull.

**Nota: O autor trabalha na iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Sources marked (V) were opened and checked for this article on that date. Sources marked (V-sister) were opened and checked on the same date for the related guide `lean-manufacturing.md`; our fetch budget ran out before a second check for this article, so the fact checker flagged them for a quick re-check before publication.

1. Kanban. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/kanban/ (V)
2. Hopp, W. J.; Spearman, M. L.: To Pull or Not to Pull: What Is the Question? *Manufacturing & Service Operations Management* 6 (2004) 2, pp. 133–148. DOI: 10.1287/msom.1030.0028. https://pubsonline.informs.org/doi/pdf/10.1287/msom.1030.0028 (V)
3. Spearman, M. L.; Woodruff, D. L.; Hopp, W. J.: CONWIP: a pull alternative to kanban. *International Journal of Production Research* 28 (1990) 5, pp. 879–894. DOI: 10.1080/00207549008942761. Reprint and abstract: Project Production Institute Journal, Vol. 3 (2018). https://projectproduction.org/journal/conwip-a-pull-alternative-to-kanban/ (V; volume, issue and pages as verified for the related guide `production-scheduling-aps.md`)
4. Spearman, M. L.; Woodruff, D. L.; Hopp, W. J.: CONWIP Redux: reflections on 30 years of development and implementation. *International Journal of Production Research* 60 (2022) 1, pp. 381–387. DOI: 10.1080/00207543.2021.1954713. https://econpapers.repec.org/RePEc:taf:tprsxx:v:60:y:2022:i:1:p:381-387 (V)
5. CONWIP. Wikipedia. https://en.wikipedia.org/wiki/CONWIP (V)
6. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. *Operations Research* 9 (1961) 3, pp. 383–387. DOI: 10.1287/opre.9.3.383. https://ideas.repec.org/a/inm/oropre/v9y1961i3p383-387.html (V)
7. Sugimori, Y. et al. (four authors): Toyota production system and Kanban system: Materialization of just-in-time and respect-for-human system. *International Journal of Production Research* 15 (1977) 6, pp. 553–564. DOI: 10.1080/00207547708943149. https://scispace.com/papers/toyota-production-system-and-kanban-system-materialization-2c0g0kt2j0 (V; the record names Y. Sugimori plus three co-authors)
8. Toyota Production System. Toyota Motor Corporation. https://global.toyota/en/company/vision-and-philosophy/production-system/index.html (V)
9. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press / Routledge (English edition 1988). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140 (V-sister)
10. Kanban. Wikipedia. https://en.wikipedia.org/wiki/Kanban (V)
11. Roser, C.: Toyota's Six Rules for Kanban. AllAboutLean. https://www.allaboutlean.com/toyotas-six-rules/ (V)
12. Roser, C.: How Many Kanbans? The Kanban Formula, Part 1. AllAboutLean. https://www.allaboutlean.com/kanban-formula-part1/ (V)
13. Roser, C.: How Many Kanbans? The Kanban Formula, Part 2. AllAboutLean. https://www.allaboutlean.com/kanban-formula-part2/ (V)
14. Co, H. C.; Moosa, S.: Overplanning Factor in Toyota's Formula for Computing the Number of Kanban. *IIE Transactions* 29 (1997) 5, pp. 409–415. DOI: 10.1080/07408179708966346. https://ink.library.smu.edu.sg/lkcsb_research/892 (V)
15. Kanban quantity calculations and circulating kanbans (Dynamics 365 Supply Chain Management training module). Microsoft Learn. https://learn.microsoft.com/en-us/training/modules/create-process-fixed-kanbans-dyn365-supply-chain-mgmt/5-calculations (V)
16. Kanban Equation 1: Fixed Container Size and High Demand. Oracle JD Edwards EnterpriseOne Kanban Management 9.2 documentation. https://docs.oracle.com/en/applications/jd-edwards/supply-chain-manufacturing/9.2/eoakm/kanban-equation-1-fixed-container-size-and-high-demand.html (V)
17. Lage Junior, M.; Godinho Filho, M.: Variations of the kanban system: Literature review and classification. *International Journal of Production Economics* 125 (2010) 1, pp. 13–21. Elsevier, ScienceDirect PII S0925-5273(10)00019-8. https://ideas.repec.org/a/eee/proeco/v125y2010i1p13-21.html (V; DOI not shown on the record page)
18. Heijunka. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/heijunka/ (V)
19. Pitch. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/pitch/ (V)
20. Suri, R.: The Practitioner's Guide to POLCA: The Production Control System for High-Mix, Low-Volume and Custom Products. Productivity Press / Taylor & Francis. https://www.taylorfrancis.com/books/9781351170765
21. Rajan Suri, Professor Emeritus, Industrial and Systems Engineering (POLCA, Center for Quick Response Manufacturing). University of Wisconsin–Madison, College of Engineering. https://engineering.wisc.edu/?p=27657 (V)
22. Kanban (development). Wikipedia. https://en.wikipedia.org/wiki/Kanban_(development) (V)
23. How the Kanban System of Inventory Management Works. Smartsheet. https://www.smartsheet.com/understanding-kanban-inventory-management-and-its-uses-across-multiple-industries (V; vendor page)
24. Kanban in manufacturing: cards, boards and supermarkets. Veryable. https://www.veryableops.com/blog/kanban-manufacturing-cards-boards-supermarkets (V; vendor page)
25. Plex: Push vs. Pull Manufacturing: Is a Kanban Pull System Right for Your Company? IndustryWeek, July 28, 2017. https://www.industryweek.com/cloud-computing/article/22023873/push-vs-pull-manufacturing-is-a-kanban-pull-system-right-for-your-company (V; vendor byline)
26. Shirouzu, N.: How Toyota thrives when the chips are down. Reuters, via nippon.com (March 2021). https://www.nippon.com/en/news/reu20210309KBN2B1004/ (V-sister)
27. Lean and Process Improvement. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/lean-and-process-improvement (V)
28. Ergonomics. Occupational Safety and Health Administration (OSHA), US Department of Labor. https://www.osha.gov/ergonomics (V)
