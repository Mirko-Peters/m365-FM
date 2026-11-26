# SEO metadata

| Field | Value |
|---|---|
| Meta title | Teoria das Restrições na Manufatura: 5 Passos e Gargalos |
| Meta description | Teoria das restrições na manufatura: cinco passos de foco, análise de gargalos, tambor-pulmão-corda com números, contabilidade de throughput e modelos. |
| Slug | `theory-of-constraints` |

# Teoria das Restrições: Os Cinco Passos de Foco, Gargalos e Tambor-Pulmão-Corda

> **Resposta curta:** A teoria das restrições (TOC, do inglês *theory of constraints*) é uma abordagem de gestão desenvolvida por Eliyahu M. Goldratt e apresentada no romance de negócios *The Goal*, de 1984. Ela afirma que a saída de qualquer sistema é limitada por muito poucas restrições, muitas vezes um único gargalo, de modo que o esforço de melhoria deve ser concentrado ali primeiro. A TOC coloca isso em prática com cinco passos de foco (identificar, explorar, subordinar, elevar, evitar a inércia), o método de programação drum-buffer-rope e a contabilidade de throughput [1][4][6].

> **Principais conclusões**
> - *The Goal*, de Eliyahu M. Goldratt e Jeff Cox, foi publicado pela primeira vez em 1984 pela North River Press; até 2011 havia vendido mais de 5 milhões de exemplares em 35 idiomas [1][2].
> - Os cinco passos de foco são: identificar a restrição, explorá-la, subordinar tudo o mais a ela, elevá-la e evitar que a inércia se torne a restrição [4].
> - Uma hora perdida na restrição é uma hora perdida para a fábrica inteira. Uma hora economizada em um não gargalo não muda nada, a menos que alivie a restrição.
> - O drum-buffer-rope (DBR) programa a restrição (*drum*), protege-a com um pulmão de tempo (*buffer*) e libera material apenas no ritmo que a restrição consegue absorver (*rope*) [6][8].
> - A contabilidade de throughput julga decisões pelo throughput (vendas menos custo realmente variável), pelo estoque/investimento e pelo custo operacional, e classifica os produtos pelo throughput por minuto de restrição, o que pode inverter a classificação dada pela contabilidade de custos padrão [6][19][20].
> - A detecção de gargalos deve ser baseada em dados: uma verificação de carga de capacidade, observação de filas e, quando existirem dados de estado das máquinas, o método do período ativo, que também mostra gargalos que se deslocam [13][14][15].
> - Uma revisão de 2003 de mais de 80 aplicações publicadas de TOC encontrou grandes ganhos operacionais e financeiros e nenhum fracasso relatado, o que também diz algo sobre quais casos são publicados [10].
> - TOC, lean e Six Sigma funcionam melhor juntos: a TOC indica onde concentrar o foco, o lean elimina desperdícios e cria fluxo, e o Six Sigma reduz a variação no ponto que importa.

## Sumário

1. [O que é a teoria das restrições? Definição e ideia central](#o-que-é-a-teoria-das-restrições-definição-e-ideia-central)
2. [História: Eliyahu Goldratt, OPT e The Goal](#história-eliyahu-goldratt-opt-e-the-goal)
3. [Restrição vs. gargalo: tipos de restrição](#restrição-vs-gargalo-tipos-de-restrições)
4. [Os cinco passos de foco](#os-cinco-passos-de-focalização)
5. [Exemplo da teoria das restrições: os cinco passos de foco em uma fábrica de manifolds](#exemplo-de-teoria-das-restrições-os-cinco-passos-de-foco-em-uma-fábrica-de-manifolds)
6. [Análise de gargalos: como identificar o gargalo (seis métodos)](#análise-de-gargalos-como-identificar-o-gargalo-seis-métodos)
7. [Programação drum-buffer-rope com números](#programação-tambor-pulmão-corda-com-números)
8. [Drum-buffer-rope simplificado (S-DBR) para make-to-order](#drum-buffer-rope-simplificado-s-dbr-para-produção-sob-encomenda)
9. [Gestão de buffers: o ciclo de realimentação](#gerenciamento-de-buffer-o-ciclo-de-realimentação)
10. [Física da fábrica por trás da TOC: Lei de Little e variabilidade](#física-da-fábrica-por-trás-do-toc-lei-de-little-e-variabilidade)
11. [Contabilidade de throughput vs. contabilidade de custos](#contabilidade-de-ganho-vs-contabilidade-de-custos)
12. [Os processos de pensamento](#os-processos-de-pensamento)
13. [TOC vs. lean vs. Six Sigma](#toc-vs-lean-vs-six-sigma)
14. [Além da fábrica: corrente crítica e reposição](#além-da-fábrica-corrente-crítica-e-reposição)
15. [Modelos para trabalhos com TOC](#modelos-para-trabalhos-de-toc)
16. [Roteiro de implementação: os primeiros seis meses](#roteiro-de-implementação-os-primeiros-seis-meses)
17. [KPIs da TOC: como medir o progresso](#toc-kpis-como-medir-o-progresso)
18. [Erros comuns](#erros-comuns)
19. [Críticas e limites da teoria das restrições](#críticas-e-limites-da-teoria-das-restrições)
20. [Pessoas e segurança na restrição](#pessoas-e-segurança-no-gargalo)
21. [TOC na fábrica digital: dados, simulação e APS](#toc-na-fábrica-digital-dados-simulação-e-aps)
22. [Glossário](#glossário)
23. [FAQ: perguntas sobre a teoria das restrições](#faq-perguntas-sobre-a-teoria-das-restrições)
24. [Conclusão e primeiros passos](#conclusão-e-primeiros-passos)

**Qual seção corresponde ao seu papel?**

| Você é... | Comece por |
|---|---|
| Gerente de fábrica ou diretor de operações | Seções 4, 5, 16 e 18 |
| Planejador ou programador da produção | Seções 6 a 10 |
| Controller da fábrica ou CFO | Seções 11 e 17 |
| Líder de CI, lean ou Six Sigma | Seções 12, 13 e 15 |
| Estudante ou novo em TOC | Seções 1 a 5, depois o glossário |

## O que é a teoria das restrições? Definição e ideia central

A teoria das restrições é uma forma de gerenciar uma organização como uma cadeia de etapas dependentes. Seu ponto de partida é simples: todo sistema que tem um objetivo possui pelo menos um fator que limita o quanto desse objetivo ele consegue alcançar. O TOC Institute usa a analogia da corrente: uma corrente só é tão forte quanto seu elo mais fraco, e fortalecer qualquer outro elo não a torna mais forte [4]. Os livros posteriores de Goldratt e a comunidade TOC estenderam a ideia do chão de fábrica para a distribuição, projetos, finanças e estratégia [6].

Em uma fábrica, o objetivo costuma ser expresso como ganhar dinheiro agora e no futuro. O fator limitante pode ser uma máquina, uma habilidade, um fornecedor, uma política ou o próprio mercado. A TOC chama isso de restrição. A afirmação central é que a maioria dos sistemas tem apenas uma ou muito poucas restrições em um dado momento. O TOC Institute afirma que a maioria dos sistemas tem um recurso com restrição de capacidade e raramente mais de dois ou três [4].

### A ideia central em um parágrafo

Se a produção de uma fábrica é limitada por um único recurso, então a produção da fábrica é igual à produção desse recurso. Cada minuto que esse recurso perde é um minuto de produção que a fábrica perde para sempre. Cada minuto economizado em outro ponto é, na melhor das hipóteses, capacidade ociosa, e na pior cria mais estoque esperando em frente à restrição. É por isso que a TOC afirma que as eficiências locais nos não gargalos não se somam ao desempenho da fábrica. Tentar otimizar cada etapa separadamente é esforço desperdiçado; a TOC melhora o sistema como um todo por meio de sua restrição.

### Teoria das restrições na manufatura: por que importa na prática

Três situações cotidianas de fábrica ilustram a ideia:

| Situação | Reação típica sem TOC | Reação com TOC |
|---|---|---|
| Pedidos atrasados, WIP em toda parte | acelerar, fazer hora extra em todos os setores, iniciar os pedidos mais cedo | identificar o único recurso que limita a produção e liberar trabalho no ritmo dele |
| Uma máquina que não é gargalo está ociosa | encontrar trabalho para ela manter a "eficiência" alta | deixá-la esperar; tempo ocioso em um não gargalo é normal e barato |
| Uma nova máquina é proposta | aprovar porque o departamento está ocupado | perguntar se ela adiciona capacidade na restrição e o que ela faz com a throughput |

### Benefícios da teoria das restrições

Os benefícios mais citados são lead times menores, melhor cumprimento de datas de entrega, menor estoque e maior throughput. Uma revisão de aplicações publicadas por Mabin e Balderstone, resumida por Panizzolo, relatou melhorias médias de 70% no lead time de pedido a entrega, 65% no cycle time de manufatura, 49% no estoque, 63% na throughput ou receita e 44% no cumprimento de datas de entrega [11]. Panizzolo atribui essas médias à revisão de Mabin e Balderstone em formato de livro, *The World of the Theory of Constraints* (2000); o artigo de periódico de 2003 dos mesmos autores analisa o mesmo conjunto de mais de 80 casos [10][11]. Trate esses números como o limite superior do que é possível: eles vêm de histórias de sucesso publicadas, e a revisão original não encontrou nenhum relato de fracasso [10]. A seção 19 discute o que isso significa.

Além dos números, a TOC oferece a uma fábrica uma resposta compartilhada para a pergunta "por onde devemos começar?". Essa costuma ser a maior mudança: menos projetos de melhoria de processo, direcionados ao ponto onde eles alteram o resultado.

## História: Eliyahu Goldratt, OPT e The Goal

Eliyahu M. Goldratt nasceu em 31 de março de 1947 e faleceu em 11 de junho de 2011, em sua casa em Israel. Ele possuía bacharelado pela Universidade de Tel Aviv e mestrado e doutorado pela Universidade Bar-Ilan [2][3]. Antes de a TOC ter esse nome, ele trabalhou com a Creative Output, empresa que comercializava a Optimized Production Technology (OPT), um software de programação da produção [3].

| Ano | Marco | Fonte |
|---|---|---|
| antes de 1984 | Software de programação OPT comercializado pela Creative Output, a raiz técnica do drum-buffer-rope (ano exato de lançamento [unverified: ano de lançamento não confirmado]) | [3] |
| 1984 | *The Goal: Excellence in Manufacturing*, de Goldratt e Jeff Cox, North River Press, 262 páginas | [1] |
| por volta de 1985 | Fundação do Avraham Y. Goldratt Institute após a saída de Goldratt da Creative Output | [3] |
| 1986 | *The Race* (com Robert E. Fox) descreve em detalhes o drum-buffer-rope; primeira edição revisada de *The Goal* | [3][7][8] |
| 1990 a 1991 | *The Haystack Syndrome*: throughput, estoque e despesa operacional como medidas de decisão | [3][20] |
| 1992 | segunda edição revisada de *The Goal* | [3][7] |
| 1994 | *It's Not Luck*: processos de pensamento para marketing e estratégia | [3][12] |
| 1997 | *Critical Chain*: TOC aplicada à gestão de projetos | [3] |
| 2000 | *Necessary But Not Sufficient*: TOC e software empresarial | [3] |
| 2004 | terceira edição revisada de *The Goal* | [7] |
| 2009 | *Isn't It Obvious?* (varejo e distribuição) | [3] |
| 2010 | *Theory of Constraints Handbook* (organizado por Cox e Schleier), a referência padrão sobre DBR, S-DBR e gestão de buffers | [9] |
| 2011 | Goldratt falece; a revista Time inclui *The Goal* entre os 25 livros de gestão empresarial mais influentes (lista da Time citada pela Wikipedia) | [2][7] |
| 2014 | quarta edição revisada (edição do 30º aniversário) de *The Goal* (lista de edições de um infobox sem citação) | [7] |

### The Goal: um romance como livro-texto

*The Goal* conta a história de Alex Rogo, gerente de uma fábrica que tem três meses para reverter a situação. Seu antigo professor de física, Jonah, o orienta por meio de perguntas, e não de respostas [7]. A cena mais citada é uma caminhada de escoteiros: o grupo só pode andar na velocidade do menino mais lento, Herbie, e as lacunas na fila aumentam à medida que os caminhantes rápidos ditam o ritmo. A solução de Rogo é colocar Herbie na frente, aliviar sua mochila e amarrar o grupo. Isso são os cinco passos de focalização e o drum-buffer-rope em uma única tarde: identificar Herbie, explorá-lo (mochila mais leve), subordinar a tropa ao ritmo dele e manter a fila curta.

O formato de romance tornou as ideias acessíveis a supervisores e operadores, e não apenas a engenheiros. Em 2011, a North River Press informou que o livro havia vendido mais de 5 milhões de exemplares em 35 idiomas [2].

### Do OPT a uma filosofia de gestão

A TOC cresceu em etapas. A primeira foi a programação (OPT, depois DBR). A segunda foi a medição (contabilidade de throughput). A terceira foi um método geral de resolução de problemas (os processos de pensamento). A quarta aplicou a lógica a projetos (corrente crítica) e à distribuição (reposição) [6][12]. Hoje, a Theory of Constraints International Certification Organization (TOCICO), uma organização sem fins lucrativos dos EUA (501(c)(3)), certifica profissionais em três níveis: exames de fundamentos, exames de praticante e uma avaliação de implementador [5].

## Restrição vs. gargalo: tipos de restrições

As palavras "restrição" e "gargalo" são frequentemente usadas como sinônimos. Elas não são exatamente a mesma coisa.

- Um **gargalo** é um recurso cuja capacidade é menor que a demanda colocada sobre ele. É um termo de capacidade.
- Uma **restrição** é tudo aquilo que limita o desempenho do sistema em direção à sua meta. Pode ser um gargalo, mas também pode ser o mercado, um material, uma política ou uma forma de pensar.
- Um **recurso com restrição de capacidade (CCR)** é um recurso que, em média, não é um gargalo, mas se torna um caso não gerenciado com cuidado, por exemplo por causa de picos no mix de produtos.

Todo gargalo limita a vazão somente se estiver no caminho dos pedidos que importam. Uma planta pode ter uma máquina "gargalo" sobrecarregada com trabalho de baixa prioridade enquanto a restrição real é o mercado. Por isso, a TOC pergunta primeiro: o que limita a meta?

### Tipos de restrições

| Tipo | Exemplo | Como se percebe | Primeira ação típica |
|---|---|---|---|
| Física: equipamento | um centro de usinagem de 5 eixos, um forno de tratamento térmico, uma linha de pintura | fila permanente à frente, recursos ociosos atrás | explorar: nenhum minuto perdido |
| Física: pessoas e habilidades | apenas dois soldadores certificados por turno | o trabalho espera por pessoas específicas | treinamento cruzado, programar em torno das habilidades |
| Material | uma fundição com prazo de 16 semanas | a montagem espera por uma peça | estoque de reposição, segunda fonte |
| Mercado | demanda abaixo da capacidade da planta | capacidade ociosa em toda parte, vendas abaixo do plano | a restrição está fora; melhorar a oferta e o prazo de entrega |
| Política | "rodar apenas lotes completos", "manter cada máquina acima de 85% de eficiência" | regras que forçam comportamentos errados | processos de pensamento, mudar a regra |
| Paradigma | "estoque é um ativo", "uma planta ocupada é uma boa planta" | resistência à ociosidade dos não gargalos | educação, jogos de simulação |

Na prática, as restrições de política merecem atenção especial: uma restrição física é frequentemente contida por uma regra (lotes mínimos, regras de liberação, metas de utilização) e não por sua capacidade real. O exemplo prático da Seção 5 mostra duas dessas regras.

### Gargalos estáticos, dinâmicos e móveis

Um gargalo **estático** permanece no mesmo recurso por meses. Um gargalo **dinâmico** ou **móvel** desloca-se entre recursos conforme o mix de produtos, as quebras ou a escalação de pessoal. A diferença importa para a escolha do método: um gargalo estático pode ser operado com uma configuração DBR fixa, enquanto um gargalo móvel precisa de dados e, muitas vezes, de um APS para calcular a carga por recurso para a carteira de pedidos atual [13][14]. A Seção 6 mostra como distingui-los.

### VATI: os tipos de planta moldam a restrição

A TOC classifica as plantas pelo formato do fluxo de material, conhecido como análise VATI [6][9]:

| Tipo | Formato do fluxo | Exemplo | Problema típico |
|---|---|---|---|
| V | poucas matérias-primas se divergem em muitos produtos | aço, papel, químicos, extrusão | má alocação: material comprometido com o produto errado cedo demais |
| A | muitas peças convergem para poucos produtos | montagem aeroespacial, construção de máquinas | peças chegam sem sincronia, a montagem espera pela última peça |
| T | poucos componentes, montados tardiamente em muitas variantes | eletrônicos, eletrodomésticos | peças disputadas entre variantes, descasamento de produtos acabados |
| I | linha reta | linhas simples de usinagem | comportamento clássico de gargalo |

A maioria das plantas reais são combinações. O tipo de planta indica onde devem ficar os estoques de proteção: antes da montagem em uma planta A, antes da divergência em uma planta V.

## Os cinco passos de focalização

Os cinco passos de focalização são o procedimento central da TOC. O TOC Institute os formula assim: identificar a restrição do sistema, explorar a restrição, subordinar tudo o mais à restrição, elevar a restrição e evitar que a inércia se torne a restrição [4]. Goldratt chamou o ciclo de processo de melhoria contínua (POOGI, na sigla em inglês), que também é o subtítulo das edições posteriores de *The Goal* [6]. Como o passo 5 leva de volta ao passo 1, os cinco passos formam um ciclo contínuo de melhoria: quando uma restrição do sistema é rompida, uma nova restrição aparece em outro ponto, e o trabalho recomeça.

Antes do passo 1, duas perguntas precisam de resposta: qual é o objetivo do sistema e como medimos o progresso em direção a ele? Em uma empresa, a TOC usa como medidas a produtividade (throughput), o estoque (ou investimento) e a despesa operacional (Seção 11).

| Passo | Pergunta | O que significa em uma fábrica | O que não significa |
|---|---|---|---|
| 1. Identificar | O que limita a produtividade agora? | encontrar o recurso, material, mercado ou política que define o ritmo | escolher a máquina com mais paradas ou o custo mais alto |
| 2. Explorar | Como tirar o máximo do que já temos? | nenhum minuto perdido, nenhum trabalho defeituoso, o mix de produtos certo | comprar capacidade |
| 3. Subordinar | Como tudo o mais apoia o passo 2? | liberação, tamanhos de lote, manutenção, qualidade e equipe seguem a restrição | manter todos os recursos ocupados |
| 4. Elevar | Se ainda não for suficiente, como acrescentar capacidade? | horas extras, terceirização, uma segunda máquina, um novo fornecedor | o primeiro reflexo |
| 5. Evitar a inércia | A restrição mudou? As regras antigas agora são a restrição? | voltar ao passo 1, revisar regras criadas para a restrição antiga | declarar vitória |

### Passo 1: Identificar a restrição

A restrição é o recurso cuja capacidade é menor em relação à demanda que recai sobre ele. Na prática, comece com um cálculo de carga (demanda multiplicada pelo tempo de processo, comparada ao tempo disponível) e depois confirme no chão de fábrica: onde o trabalho se acumula, onde as pessoas esperam por um recurso, sobre qual recurso os supervisores estão sempre perguntando? O TOC Institute acrescenta que uma restrição identificada de forma errada é fácil de corrigir sem dano duradouro, o que é um bom motivo para não esperar por dados perfeitos [4]. A Seção 6 aborda seis métodos de detecção.

### Passo 2: Explorar a restrição

Explorar significa tornar a restrição o mais produtiva possível sem gastar dinheiro significativo. O TOC Institute afirma que uma restrição costuma ser usada menos de 50% do tempo em base 24/7 e que os três primeiros passos normalmente revelam pelo menos 30% de capacidade oculta em poucos meses; ambas são afirmações sem um conjunto de dados publicado, portanto verifique-as na sua própria fábrica [4]. Medidas típicas de exploração:

- cobrir intervalos, trocas de turno e reuniões para que a restrição continue operando;
- transferir a preparação de troca de ferramentas para fora do tempo de operação da restrição (setup externo; veja o guia [Redução de SMED e de troca de ferramentas](https://www.m365.fm/en/learn/smed-changeover-reduction/));
- inspecionar antes da restrição para que ela nunca processe uma peça que já é sucata (em ambientes AS9100 ou IATF 16949, mover um ponto de inspeção exige atualizar o plano de controle e o PFMEA);
- verificar a qualidade logo após a restrição, pois uma peça sucateada depois custa tempo da restrição;
- manter um estoque de trabalho em processo à sua frente para que ela nunca fique sem material;
- dar-lhe prioridade em manutenção, programação, ferramental e movimentação de materiais;
- escolher o mix de produtos pela produtividade por minuto de restrição (Seção 11);
- transferir para outros recursos o trabalho que eles podem fazer, mesmo que com menor eficiência.

### Passo 3: Subordinar todo o restante

A subordinação é o passo mais difícil porque vai contra as métricas locais de eficiência. Os não restritivos precisam ter capacidade ociosa, e devem usá-la para proteger a restrição, não para formar estoque. Exemplos:

- **Liberação:** o material entra na fábrica no ritmo da restrição (a corda no DBR).
- **Tamanhos de lote:** os não restritivos podem operar com lotes pequenos e mais preparações porque têm capacidade ociosa; a restrição pode precisar de lotes maiores para economizar tempo de preparação.
- **Manutenção:** uma quebra na restrição recebe o próximo técnico disponível; a manutenção preventiva da restrição é programada em paradas planejadas.
- **Qualidade:** a aprovação da primeira peça na restrição tem prioridade sobre outras verificações de primeira peça.
- **Medição:** deixe de recompensar os departamentos não restritivos pela utilização ou pelas "horas ganhas".

O TOC Institute observa que restrições que mudam com frequência desestabilizam políticas, procedimentos e pessoas [4]. A subordinação deve, portanto, incluir a proteção da posição da restrição, por exemplo mantendo os demais recursos bem acima da capacidade da restrição.

### Passo 4: Elevar a restrição

Somente depois de executar os passos 2 e 3 você deve gastar dinheiro em capacidade. As opções de elevação incluem horas extras ou um turno extra apenas na restrição, terceirizar parte do seu trabalho, contratar pessoas, comprar equipamentos ou redesenhar o produto para exigir menos tempo da restrição. Muitas fábricas pulam direto para esta etapa e compram uma máquina enquanto a restrição existente ainda perde um quarto do seu tempo em pausas, preparações e falta de material.

### Passo 5: Impedir que a inércia se torne a restrição

Quando a exploração e a elevação funcionam, a restrição frequentemente se desloca e surge uma nova restrição: em outra máquina, em um fornecedor ou no mercado. Regras que estavam certas para a antiga restrição passam a causar prejuízo. Exemplos típicos de inércia: o tamanho de lote grande do antigo gargalo permanece no roteiro, uma regra de liberação ligada ao antigo tambor permanece no ERP, ou a equipe comercial continua racionando pedidos embora a fábrica agora tenha capacidade ociosa. Volte ao passo 1 e revise as regras.

## Exemplo de teoria das restrições: os cinco passos de foco em uma fábrica de manifolds

O exemplo a seguir foi construído para este guia. Os números são plausíveis para uma pequena oficina mecânica dos EUA, mas não são dados de uma empresa real.

### A fábrica

Uma fábrica com 60 pessoas no Centro-Oeste dos EUA produz blocos de manifold hidráulico em duas famílias de produtos:

- **Produto A** (manifold padrão): preço de US$ 900, matéria-prima e peças compradas de US$ 400.
- **Produto B** (manifold sob medida): preço de US$ 1.200, matéria-prima e peças compradas de US$ 450.

A fábrica opera dois turnos de 8 horas, cinco dias por semana: 80 horas, ou 4.800 minutos de tempo disponível por recurso por semana. A demanda semanal é de 100 unidades do A e 60 unidades do B. A despesa operacional (toda a mão de obra, salários, aluguel, energia, depreciação; tudo exceto material realmente variável) é de US$ 62.000 por semana.

### Passo 1: Identificar a restrição com uma tabela de carga

Tempos de processo em minutos por unidade, a partir dos roteiros e verificados por cronometragem no chão de fábrica:

| Recurso | A (min/unid.) | B (min/unid.) | Carga A (100 unid.) | Carga B (60 unid.) | Carga total (min) | Carga vs. 4.800 min |
|---|---|---|---|---|---|---|
| Serra | 8 | 10 | 800 | 600 | 1.400 | 29% |
| Célula CNC de 5 eixos | 25 | 40 | 2.500 | 2.400 | 4.900 | **102%** |
| Rebarbação e lavagem | 12 | 12 | 1.200 | 720 | 1.920 | 40% |
| Montagem | 15 | 20 | 1.500 | 1.200 | 2.700 | 56% |
| Teste de pressão | 10 | 15 | 1.000 | 900 | 1.900 | 40% |

**Cálculo para a célula CNC:** 100 × 25 + 60 × 40 = 2.500 + 2.400 = 4.900 minutos contra 4.800 disponíveis, uma carga de 4.900 ÷ 4.800 = 102 por cento. Mesmo no papel, a célula CNC não consegue atender à demanda.

A tabela de carga usa apenas o tempo teórico. O quadro real é pior. Um estudo de tempos de duas semanas na célula CNC (registro de turnos mais dados de estado das máquinas) mostrou para onde foram os 4.800 minutos:

| Uso do tempo CNC por semana | Minutos | Participação |
|---|---|---|
| Usinagem produtiva de peças boas | 3.600 | 75,0% |
| Pausas e passagem de turno não cobertas (2 turnos × 30 min × 5 dias) | 300 | 6,3% |
| Trocas de ferramenta/setup (15 por semana × 30 min) | 450 | 9,4% |
| Parada por falta: aguardando material, programas ou dispositivos | 250 | 5,2% |
| Paradas não planejadas | 100 | 2,1% |
| Peças usinadas depois sucateadas no teste de pressão | 100 | 2,1% |
| **Total** | **4.800** | **100%** |

Portanto, a capacidade efetiva da restrição é de 3.600 minutos por semana, contra uma demanda de 4.900. A fábrica consegue atender cerca de 73 por cento da demanda (3.600 ÷ 4.900).

O chão de fábrica confirmou os números: em média, 2,5 dias de trabalho aguardavam em frente à célula CNC, enquanto a montagem e o teste de pressão regularmente aguardavam peças. Os supervisores haviam apontado a montagem como o gargalo porque ela "estava sempre atrasada", mas a montagem estava atrasada porque era privada de material pela célula CNC.

### Passo 2a: Explorar pelo mix de produtos

Com 3.600 minutos efetivos, a fábrica não consegue fazer tudo. Quais produtos deve fazer primeiro? Aqui, a contabilidade por throughput e a contabilidade de custo padrão dão respostas diferentes (a Seção 11 explica a lógica em detalhes).

| | Produto A | Produto B |
|---|---|---|
| Preço | $900 | $1.200 |
| Custo variável real (material) | $400 | $450 |
| Throughput por unidade (T) | $500 | $750 |
| Minutos de CNC por unidade | 25 | 40 |
| **Throughput por minuto de CNC** | **$20,00** | **$18,75** |
| Margem de custo padrão por unidade (ver Seção 11) | $161,20 | $280,52 |

O Produto B parece melhor por unidade, pelos dois métodos. Mas por minuto de restrição, o A gera mais ganho.

- **Mix 1, B primeiro (o que o relatório de custos sugere):** 60 B usam 2.400 min; os 1.200 min restantes produzem 48 A. Throughput = 60 × $750 + 48 × $500 = $45.000 + $24.000 = **$69.000**. Lucro líquido = $69.000 − $62.000 = **$7.000 por semana**.
- **Mix 2, A primeiro (throughput por minuto de restrição):** 100 A usam 2.500 min; os 1.100 min restantes produzem 27 B (27 × 40 = 1.080 min). Throughput = 100 × $500 + 27 × $750 = $50.000 + $20.250 = **$70.250**. Lucro líquido = $70.250 − $62.000 = **$8.250 por semana**.

O mix baseado na restrição gera $1.250 a mais por semana, cerca de $65.000 por ano em 52 semanas, sem nenhum investimento. Ele também muda a conversa com a área comercial: clientes do B precisam de prazos de entrega cotados mais longos ou de um preço que reflita o uso da restrição pelo B.

### Etapa 2b: Explorar por meio do tempo perdido

A equipe então atacou as perdas do estudo de tempos:

| Medida | Custo | Minutos recuperados por semana |
|---|---|---|
| Escalonar as pausas; um operador de reforço treinado mantém a célula funcionando | $1.500 por semana (parte de um operador de reforço) | 300 |
| Preparação externa de setup: ferramentas, dispositivos e programas pré-ajustados e preparados antes de a máquina parar; troca de 30 para 18 min | cerca de $6.000 únicos para um pré-ajustador de ferramentas e carrinhos | 180 (15 × 12 min) |
| Material e programas preparados com um turno de antecedência (um pulmão de tempo, ver Seção 7) | nenhum | 200 |
| Dimensões críticas de furos verificadas logo após a usinagem, em vez de no teste de pressão | calibradores, cerca de $2.500 únicos | 70 |
| Manutenção preventiva transferida para a janela planejada do fim de semana | nenhum | 50 |
| **Total** | | **800** |

A capacidade efetiva sobe de 3.600 para 4.400 minutos por semana, um aumento de 22 por cento (800 ÷ 3.600). Com o Mix 2, a fábrica passa a produzir 100 A (2.500 min) e 47 B (47 × 40 = 1.880 min, total de 4.380 min).

Throughput = 100 × $500 + 47 × $750 = $50.000 + $35.250 = **$85.250 por semana**. O custo operacional sobe com o operador de reforço: $62.000 + $1.500 = $63.500. Lucro líquido = $85.250 − $63.500 = **$21.750 por semana**, ante $8.250. O gasto único de cerca de $8.500 é recuperado em menos de uma semana.

Este é o padrão típico da TOC: como o custo operacional é em grande parte fixo no curto prazo, cada minuto extra da restrição vai quase inteiramente para o lucro.

### Etapa 3: Subordinar o restante da fábrica

Para manter os 800 minutos, o restante da fábrica precisou mudar:

- A serra parou de cortar "para se manter ocupada". Agora corta apenas o que a programação do CNC exige, liberado com um turno de antecedência (a corda).
- A célula de CNC executa uma sequência semanal fixa que agrupa os produtos por família de dispositivos; a serra e a rebarbação seguem essa sequência.
- A manutenção atende primeiro aos chamados do CNC; a meta de resposta é de 10 minutos.
- O laboratório de qualidade faz as inspeções da primeira peça do CNC antes de qualquer outra solicitação.
- Os supervisores da serra e da rebarbação não são mais medidos pela utilização. Sua medida passa a ser "o CNC nunca espera por nós".

A utilização da serra cai de cerca de 45 por cento (ela estava formando estoque) para 29 por cento. Isso é intencional. Em termos da TOC, o tempo ocioso da serra é o preço de uma restrição protegida.

### Etapa 4: Elevar a restrição

Após a exploração, 13 unidades de B por semana ainda não são atendidas (60 − 47). Três opções de elevação:

| Opção | Minutos extras de restrição | Throughput extra por semana | Custo operacional extra por semana | Efeito líquido por semana | Comentário |
|---|---|---|---|---|---|
| Turno de sábado apenas na célula de CNC (8 h, com pessoal por inscrição voluntária ou pelas regras de hora extra do acordo trabalhista) | 480 | 12 B × $750 = $9.000 | $1.200 de adicional de hora extra e apoio | **+$7.800** | rápida, reversível |
| Terceirizar o desbaste do B para uma oficina externa, $180 por unidade | 13 B não precisam dos 40 min completos | 13 × ($750 − $180) = $7.410 | coordenação, cerca de $300 | **+$7.110** | T por unidade cai para $570, porque o custo da oficina externa é realmente variável |
| Comprar uma segunda máquina 5 eixos, $650.000 | 4.800 | 13 B × $750 = $9.750 (a demanda limita o ganho) | $4.000 (operador, depreciação, manutenção) | **+$5.750** | payback de cerca de $650.000 ÷ $5.750 = 113 semanas, a menos que a demanda cresça |

A tarefa de sábado vence. A segunda máquina só faz sentido se as vendas puderem preenchê-la, porque, uma vez instalada, a restrição passa para o mercado. A verificação financeira é simples: a opção aumenta T menos OE e, em quanto, em relação ao investimento? A seção 11 mostra as fórmulas.

### Passo 5: Evitar a inércia

Com o turno de sábado, a célula CNC tem 4.880 minutos efetivos, o suficiente para a demanda total de 4.900 menos alguns minutos, e agora a demanda é o limite. Novo quadro de carga:

| Recurso | Carga com demanda total | Carga em relação ao disponível |
|---|---|---|
| Célula CNC (com sábado) | 4.900 | cerca de 100% do tempo efetivo |
| Montagem | 2.700 | 56% |
| Teste de pressão | 1.900 | 40% |

A restrição está prestes a passar para o mercado. Duas armadilhas de inércia surgiram na revisão:

1. O ERP ainda mantinha o lote mínimo antigo de 40 para B, definido anos atrás para economizar preparações da CNC. Com trocas mais rápidas, ele bloqueava prazos curtos. O lote foi reduzido para 10.
2. As vendas ainda cotavam seis semanas para B "porque a fábrica está sempre cheia". O prazo cotado foi reduzido para três semanas, o que conquistou dois novos clientes de B em um trimestre.

Voltando ao passo 1: se os novos clientes de B elevarem a demanda, a célula CNC volta a ser a restrição e a opção da segunda máquina recebe um novo cálculo. Esse ciclo é o processo de melhoria contínua.

### O que o exemplo ensina

| Lição | Evidência no exemplo |
|---|---|
| O gargalo visível pode não ser a restrição | os supervisores culparam a montagem, que estava desabastecida |
| Explorar supera investir | 800 minutos por US$ 8.500 únicos mais US$ 1.500 por semana, versus US$ 650.000 |
| A contabilidade de custos pode classificar produtos de forma errada | B parecia melhor por unidade, mas A gera mais lucro por minuto de restrição |
| Os não gargalos devem ter tempo ocioso | a serra passou de 45% para 29% de utilização |
| Regras antigas sobrevivem a restrições antigas | o lote de 40 e a cotação de seis semanas |

## Análise de gargalos: como identificar o gargalo (seis métodos)

A análise de gargalos é o trabalho de encontrar o recurso que limita a produtividade, medir quanto de produção ele custa e verificar se ele se desloca. É o passo 1 dos cinco passos de foco e deve ser repetida sempre que o mix de produtos, a demanda ou a programação da produção mudarem.

O gargalo nem sempre é a máquina mais cara, aquela que mais quebra ou o departamento com o supervisor mais barulhento. Use mais de um método e verifique se eles concordam.

### Método 1: Cálculo de carga de capacidade

Para cada recurso, compare o tempo que a demanda exige com o tempo disponível.

**Fórmula:** Carga (%) = Σ (demanda por produto × tempo de processo por unidade, incluindo preparações) ÷ tempo disponível × 100

O recurso com a maior carga é o candidato a gargalo. A seção 5 mostra o cálculo; a célula CNC estava com 102% nos tempos teóricos. Dois refinamentos tornam o método confiável:

1. **Use tempo efetivo, não nominal.** Divida a carga teórica pela parcela do tempo em que o recurso realmente produz peças boas (disponibilidade × qualidade, ou uma parcela produtiva medida). Um recurso com 85% de carga no papel e 75% de parcela produtiva está, na realidade, em 113% (85 ÷ 0,75).
2. **Use o mix real de produtos do período planejado.** Um recurso pode ser o gargalo em uma semana com muito B e não em uma semana com muito A.

Vantagem: exige apenas roteiros, demanda e calendário. Fraqueza: os roteiros costumam estar errados, e o método ignora a variabilidade e os gargalos que se deslocam.

### Método 2: Observação de filas e WIP

O trabalho se acumula diante de um gargalo, e os recursos posteriores ficam esperando. Conte o trabalho à frente de cada recurso (em horas de trabalho, não em peças) no mesmo momento, em vários dias. Um recurso com uma fila grande e persistente, e com recursos a jusante desabastecidos, é o provável gargalo. Cuidado: uma fila também pode se formar à frente de um recurso alimentado em lotes grandes ou que tenha a política de produzir antecipadamente.

### Método 3: A caminhada pelo gargalo

Christoph Roser recomenda a caminhada pelo gargalo como método no chão de fábrica quando faltam dados de estado das máquinas [15]. Percorra a linha várias vezes por turno e anote, para cada processo, se ele está trabalhando, desabastecido (aguardando insumo) ou bloqueado (não consegue repassar o trabalho). Um processo que está majoritariamente trabalhando, com processos bloqueados antes dele e processos desabastecidos depois, é o gargalo. Repita ao longo de vários dias para verificar se ele se desloca.

| Passagem em | Serra | Célula CNC | Rebarbação | Montagem | Teste |
|---|---|---|---|---|---|
| 07:30 | bloqueada | operando | sem material | sem material | operando |
| 09:00 | operando | operando | operando | sem material | sem material |
| 10:30 | bloqueada | operando | sem material | operando | sem material |
| 13:00 | bloqueada | parada (ferramenta) | sem material | sem material | sem material |
| Padrão | frequentemente bloqueada | sempre operando | frequentemente sem material | frequentemente sem material | frequentemente sem material |

### Método 4: Utilização (percentual de tempo ativo)

Os dados de máquina de um MES, de uma plataforma IIoT ou do controle da máquina mostram a parcela de tempo em que cada recurso está ativo. O recurso com a maior parcela de tempo ativo é o candidato a gargalo. Roser, Nakano e Tanaka chamam isso de método da carga de trabalho e o usam como comparação em seu artigo de 2001 [13]. É fácil de automatizar, mas cego quanto à ordem em que os recursos interrompem uns aos outros: dois recursos com 85 por cento parecem iguais, mesmo que um deles pare o outro.

### Método 5: O método dos períodos ativos

O método dos períodos ativos foi publicado por Roser, Nakano e Tanaka na Winter Simulation Conference de 2001 e estendido para gargalos móveis em 2002 [13][14]. Ele exige um registro de estados com carimbo de tempo para cada recurso.

- **Estados ativos** são estados em que o recurso pode fazer os outros esperarem: processamento, mas também troca de ferramental, quebra, reparo e manutenção [14][15].
- **Estados inativos** são estados em que o recurso espera pelos outros: sem material (aguardando material ou transporte) e bloqueado [14][15].
- Um **período ativo** é uma sequência ininterrupta de estados ativos [13].
- A qualquer momento, **o recurso com o maior período ativo ininterrupto é o gargalo momentâneo** [14].
- Quando o período ativo do gargalo atual se sobrepõe ao do gargalo anterior ou seguinte, o gargalo está **alternando** entre os dois; fora das sobreposições, o recurso é o **único** gargalo [14].

**Exemplo trabalhado (duas horas de um registro de turno ilustrativo):**

| Recurso | Períodos ativos | Períodos inativos |
|---|---|---|
| Serra | 08:00–08:20, 08:35–08:55, 09:10–09:30, 09:45–10:00 | bloqueada entre eles |
| Célula CNC | 08:00–09:05 (65 min), 09:15–10:00 (45 min) | 09:05–09:15 sem material |
| Montagem | 08:00–08:10, 08:30–09:10 (40 min), 09:40–10:00 | sem material 08:10–08:30 e 09:10–09:40 |

Passo a passo:

1. 08:00–09:05: o período ativo de 65 minutos da célula CNC é o período contínuo mais longo, portanto a célula CNC é o gargalo momentâneo.
2. 09:05–09:10: a célula CNC está sem material. O período ativo mais longo neste momento é o da montagem (08:30–09:10). A montagem é o gargalo.
3. 09:10–09:15: apenas a serra está ativa (09:10–09:30). A serra é o gargalo.
4. 09:15–10:00: o segundo período da célula CNC (45 minutos) é o mais longo. A célula CNC é o gargalo.
5. Sobreposições: o período da CNC 08:00–09:05 se sobrepõe ao período da montagem 08:30–09:10 por 35 minutos (08:30–09:05), portanto o gargalo alterna entre CNC e montagem ali. O período da serra 09:10–09:30 se sobrepõe ao período da CNC 09:15–10:00 por 15 minutos, uma alternância entre serra e CNC.

| Recurso | Único gargalo | Gargalo alternante | Soma | Parcela de 120 min (único / soma) |
|---|---|---|---|---|
| Célula CNC | 08:00–08:30 e 09:30–10:00 = 60 min | 35 + 15 = 50 min | 110 min | 50% / 92% |
| Montagem | 09:05–09:10 = 5 min | 35 min | 40 min | 4% / 33% |
| Serra | 09:10–09:15 = 5 min | 15 min | 20 min | 4% / 17% |

Roser interpreta a parcela única como limite inferior e a soma como limite superior do efeito de uma melhoria: se a célula CNC é o único gargalo 50 por cento do tempo e o único ou alternante gargalo 92 por cento do tempo, um ganho de um minuto na célula CNC deve melhorar a produção do sistema em aproximadamente 0,5 a 0,9 minuto [15]. Duas horas de dados bastam apenas para mostrar a mecânica; uma análise real usa semanas de registros.

Compare com o Método 4: a célula CNC esteve ativa 110 dos 120 minutos (92 por cento), a serra 80 (67 por cento) e a montagem 70 (58 por cento). A utilização aponta para o mesmo recurso aqui, mas colocaria a serra à frente da montagem, embora a montagem faça parte com mais frequência de um gargalo alternante.

**De onde vêm os dados:** estados de máquina do MES, gateways IIoT que leem o controlador ou o log de eventos de uma simulação de eventos discretos. Roser observa que o método é mais fácil com simulação ou sistemas altamente automatizados e recomenda a caminhada pelo gargalo onde esses dados não existem [15]. O guia [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) explica como as fábricas coletam os estados dos equipamentos.

### Método 6: Simulação e testes de sensibilidade

Um modelo de simulação de eventos discretos da linha permite testar a questão diretamente: se cada recurso, por vez, receber 10 por cento a mais de capacidade, qual mudança aumenta a produção? O recurso cuja melhoria mais eleva a produção é a restrição para aquele mix. A simulação também mostra gargalos que se deslocam sob variabilidade, algo que as tabelas de carga estáticas não captam. O guia sobre [simulação de manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) explica como construir esse modelo.

### Causas comuns de gargalos

Uma análise de gargalos deve terminar com uma causa, não apenas com uma localização. As causas mais comuns numa fábrica:

- capacidade abaixo da demanda para o mix de produtos atual (uma restrição real de capacidade)
- paradas não planejadas e reparos lentos no recurso crítico
- trocas longas combinadas com regras de lotes grandes
- falta de habilidades ou de pessoal: apenas poucas pessoas conseguem operar ou preparar o recurso
- perdas de qualidade: sucata e retrabalho que consomem o tempo da restrição duas vezes
- inanição: material, ferramentas, programas ou trabalho a montante chegando atrasados
- políticas, como metas de utilização que mantêm os não gargalos ocupados enquanto o trabalho se acumula no lugar errado

A causa determina a correção. As cinco primeiras exigem primeiro a exploração (Seção 4, passo 2) e a elevação apenas se isso não bastar; a inanição exige subordinação (passo 3); as políticas exigem uma mudança de regra, muitas vezes com os processos de pensamento (Seção 12).

### Qual método usar e quando?

| Método | Dados necessários | Identifica gargalos que se deslocam | Esforço | Melhor uso |
|---|---|---|---|---|
| Carga de capacidade | roteiros, demanda, calendário | não | baixo | primeira verificação, planejamento, orçamentos |
| Observação de filas | contagens no chão de fábrica | parcialmente | baixo | confirmação |
| Caminhada do gargalo | caminhadas repetidas | parcialmente | baixo a médio | fábricas sem dados de máquinas |
| Utilização | estados das máquinas | não | baixo, após o fluxo de dados | painéis |
| Período ativo | estados com registro de data e hora | sim | médio | linhas automatizadas, dados de MES, simulação |
| Simulação | modelo mais dados | sim | médio a alto | mix elevado, decisões de investimento |

### Seis perguntas que expõem um falso gargalo

1. O recurso realmente funciona durante todo o tempo disponível, ou com frequência fica sem material?
2. A fila à sua frente é permanente ou apenas um lote que está chegando?
3. Os recursos a jusante esperam por ele, ou por outra coisa?
4. Se ele recebesse 10 por cento a mais de capacidade amanhã, as expedições aumentariam?
5. O "gargalo" está ocupado com trabalho que não é necessário agora?
6. O limite real é uma regra, como tamanhos mínimos de lote ou um padrão fixo de turnos?

## Programação tambor-pulmão-corda com números

Tambor-pulmão-corda (DBR, do inglês drum-buffer-rope) é o método da TOC para programar e controlar a produção. Goldratt e Robert E. Fox o descreveram em *The Race* (1986), baseando-se na metáfora da tropa de escoteiros de *The Goal* [3][8]. O *Theory of Constraints Handbook* descreve a forma atual, incluindo o gerenciamento de pulmões e a classificação de fluxo VATI [9].

- **Tambor:** a programação do gargalo. É a única programação detalhada da fábrica que precisa ser mantida.
- **Pulmão:** pulmões de tempo que protegem a vazão da fábrica contra a variabilidade. A DBR tradicional usa pulmões no gargalo, nos pontos de montagem onde peças do gargalo encontram peças de não gargalo, e na expedição [6].
- **Corda:** o mecanismo de liberação. O material entra na fábrica um pulmão de tempo antes de ser necessário no gargalo; liberar antes só aumenta o WIP [6].

Os pulmões na DBR são medidos em **tempo**, e não em peças [6]. Um pulmão de gargalo de 16 horas significa que o material é liberado 16 horas úteis antes de seu início programado no gargalo.

### Passo 1: Montar a programação do tambor

Voltando à fábrica de coletores, a célula CNC é o tambor. Sua programação para quarta-feira (turno 1: 06:00–14:00, turno 2: 14:00–22:00), com as trocas de 18 minutos da Seção 5:

| Ordem | Produto e quantidade | Preparação + execução (min) | Início CNC | Fim CNC |
|---|---|---|---|---|
| 1041 | A × 10 | 18 + 250 = 268 | Qua 06:00 | Qua 10:28 |
| 1042 | B × 5 | 18 + 200 = 218 | Qua 10:28 | Qua 14:06 |
| 1043 | A × 10 | 268 | Qua 14:06 | Qua 18:34 |
| 1044 | B × 4 | 18 + 160 = 178 | Qua 18:34 | Qua 21:32 |

A sequência segue a decisão de mix de produtos da Seção 5 e a demanda semanal, com lotes pequenos o bastante para manter os lead times curtos. Os 28 minutos que sobram no fim do turno são destinados a uma verificação planejada de ferramentas.

### Passo 2: Definir os pulmões

- **Pulmão do gargalo:** 16 horas úteis (dois turnos). A serra e a movimentação de material precisam de menos de uma hora de tempo de toque por ordem; o restante protege contra problemas na serra, falta de material e de programas.
- **Pulmão da expedição:** 16 horas úteis após a célula CNC. Rebarbação, montagem e teste precisam de cerca de uma hora de tempo de toque por ordem.
- **Área física de pulmão:** uma área demarcada no chão em frente à célula CNC, dimensionada para cerca de um dia de trabalho, com faixas FIFO por família de dispositivos. Se a área transbordar, a liberação está adiantada em relação à corda; se estiver vazia, a célula CNC corre risco.

Qual deve ser o tamanho de um pulmão no início? Gray, Felan, Umble e Umble observam que existem regras práticas, mas que, em sua experiência, os tamanhos de pulmão costumam ser definidos para obter um sistema estável e depois ajustados [24]; o gerenciamento de pulmões (Seção 9) faz esse ajuste. Um valor inicial frequentemente citado na prática da TOC é cerca de metade do lead time atual desse segmento [unverified for the initial buffer value cited in TOC practice]. No exemplo, o trabalho costumava esperar 2,5 dias em frente à célula CNC; a equipe começou com um dia e planejou ajustar.

### Passo 3: Atar a corda

Tempo de liberação = início programado no gargalo − pulmão do gargalo.

| Ordem | Início CNC | Pulmão do gargalo | Liberação para a serra | Data de expedição (fim CNC + pulmão da expedição) |
|---|---|---|---|---|
| 1041 | Qua 06:00 | 16 h | Ter 06:00 | Qui 10:28 |
| 1042 | Qua 10:28 | 16 h | Ter 10:28 | Qui 14:06 |
| 1043 | Qua 14:06 | 16 h | Ter 14:06 | Qui 18:34 |
| 1044 | Qua 18:34 | 16 h | Ter 18:34 | Qui 21:32 |

Nenhum material é liberado antes de seu tempo de liberação, por mais ociosa que esteja a serra. É isso que mantém o WIP e o lead time baixos.

### Passo 4: Operar a fábrica pelo status dos pulmões

Os não gargalos não recebem uma programação detalhada. Eles trabalham na ordem do status dos pulmões (Seção 9): as ordens cujo pulmão está mais consumido vão primeiro. A célula CNC segue a sua sequência.

### DBR vs. MRP empurrado: o que muda

| Tema | MRP empurrado | DBR |
|---|---|---|
| Liberação | lead times planejados por operação, muitas vezes inflados | programação do gargalo menos o pulmão |
| Programações detalhadas | para cada centro de trabalho | apenas para o gargalo |
| WIP | cresce quando os lead times são inflados | limitado pela corda |
| Prioridades no chão de fábrica | listas quentes, expedição urgente | cores de status dos pulmões |
| Resposta à variabilidade | mais lead time, mais WIP | pulmões em poucos pontos, dimensionados e ajustados |

O guia [production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) explica como a DBR se encaixa no planejamento de capacidade finita e quando um APS agrega valor.

### DBR em fábricas do tipo A (montagem)

Em uma fábrica do tipo A, as peças do recurso restritivo encontram as peças de não restritivos na montagem. O DBR tradicional adiciona um **pulmão de montagem**: as peças não restritivas são liberadas para que aguardem na montagem até que a peça restritiva chegue, de modo que a saída do recurso restritivo nunca espere por um suporte que esteja faltando [6][9]. Na indústria aeroespacial e na fabricação de máquinas, onde os conjuntos exigem centenas de peças, é frequentemente aqui que o DBR traz os maiores ganhos; o guia [aerospace production planning](https://www.m365.fm/en/learn/aerospace-production-planning/) aborda esse ambiente.

## Drum-buffer-rope simplificado (S-DBR) para produção sob encomenda

O drum-buffer-rope simplificado (S-DBR) foi desenvolvido para fábricas que produzem sob encomenda, nas quais geralmente o mercado, e não um recurso interno, é a restrição, ou nas quais a restrição interna não está severamente carregada. Ele usa apenas um pulmão, o **pulmão de expedição**, e substitui o cronograma detalhado do tambor por uma verificação de **carga planejada** no recurso restritivo da capacidade (CCR) [6][9].

### Como o S-DBR funciona

1. **Pulmão de expedição:** cada pedido é liberado um tempo fixo de pulmão antes da data de entrega.
2. **Carga planejada:** a fábrica mantém um total acumulado do trabalho já comprometido no CCR, expresso em dias.
3. **Cotação da data de entrega:** um novo pedido recebe uma data de entrega não anterior à data em que o CCR pode processá-lo, somada a parte do pulmão de expedição referente ao trabalho após o CCR. Uma convenção comum é a data da carga planejada mais metade do pulmão de expedição [unverified: convenção comum, sem fonte citada].
4. **O gerenciamento de pulmões** define as prioridades no chão de fábrica pela fração do pulmão de expedição já consumida.

### Exemplo prático: cotando uma data de entrega com o S-DBR

Suponha que a fábrica de coletores tenha passado a produzir sob encomenda e que o mercado seja a restrição na maioria das semanas. A célula CNC é tratada como o CCR, com 4.400 minutos efetivos por semana, ou 880 minutos por dia útil.

- Pedidos já comprometidos na célula CNC: 3.520 minutos. Carga planejada = 3.520 ÷ 880 = **4,0 dias úteis**.
- Pulmão de expedição: **6 dias úteis** (o lead time total atual é de 12 dias; a equipe começa com metade).
- Novo pedido: 10 unidades do produto B, 40 minutos cada = 400 minutos = 0,45 dia na célula CNC.

Data de entrega segura = hoje + carga planejada + tempo do novo pedido na célula CNC + metade do pulmão de expedição = 0 + 4,0 + 0,45 + 3,0 = **7,45, portanto 8 dias úteis**. Data de liberação = data de entrega − pulmão de expedição = dia 8 − 6 = **dia 2**.

Se o comercial quiser prometer 5 dias, a verificação mostra que o pedido furaria a fila na célula CNC e atrasaria outros pedidos. Essa conversa acontece na entrada do pedido, e não no chão de fábrica duas semanas depois.

### DBR ou S-DBR?

| Critério | DBR tradicional | S-DBR |
|---|---|---|
| Restrição | interna e fortemente carregada | mercado, ou interna mas moderadamente carregada |
| Pulmões | restrição, montagem, expedição | apenas expedição |
| Cronograma do recurso restritivo | sequência detalhada | verificação de carga planejada |
| Esforço | maior | menor |
| Aplicação típica | gargalo estável, fábricas do tipo A ou I | job shops sob encomenda, alto mix |

## Gerenciamento de buffer: o ciclo de realimentação

O gerenciamento de buffer é o ciclo de controle e melhoria do DBR e do S-DBR [9]. Para cada ordem em aberto, a fábrica acompanha quanto do seu buffer já foi consumido e a classifica de acordo com isso. O resumo da Wikipedia sobre a TOC descreve a codificação em vermelho, amarelo e verde pela penetração no buffer [6].

**Fórmula (para uma ordem que ainda não atingiu o ponto protegido):**
Penetração no buffer (%) = (1 − tempo restante até a chegada programada ao ponto protegido ÷ tamanho do buffer) × 100

| Zona | Penetração no buffer | Significado | Resposta |
|---|---|---|---|
| Verde | 0 a 33% | no prazo | nenhuma |
| Amarela | 33 a 67% | ficando apertada | verificar onde está a ordem, preparar ação |
| Vermelha | 67 a 100% | o ponto protegido pode ficar parado | acelerar: colocar a ordem na frente, corrigir a causa |
| Preta (algumas fábricas) | acima de 100% | já atrasada | escalar, informar o cliente se houver buffer de expedição |

A divisão em terços é uma convenção, não uma lei da natureza.

### Exemplo prático: situação do buffer na quarta-feira às 06:00

Buffer do recurso restritivo: 16 horas de trabalho. Nenhuma das quatro ordens chegou à célula CNC no início do turno.

| Ordem | Início programado no CNC | Horas de trabalho restantes | Penetração | Zona | Ação |
|---|---|---|---|---|---|
| 1041 | Qua 06:00 | 0 | 100% | vermelha/preta | o CNC vai parar; localizar a ordem agora |
| 1042 | Qua 10:28 | 4,5 | 1 − 4,5 ÷ 16 = 72% | vermelha | acelerar na serra |
| 1043 | Qua 14:06 | 8,1 | 1 − 8,1 ÷ 16 = 49% | amarela | verificar a situação |
| 1044 | Qua 18:34 | 12,6 | 1 − 12,6 ÷ 16 = 21% | verde | nenhuma |

Em um dia saudável, as ordens com prazo nas próximas horas já estão no buffer à frente da célula CNC. Se a ordem 1041 não estiver lá às 06:00, a célula CNC está prestes a perder tempo.

### Usando os dados do buffer para melhorar

Registre o motivo sempre que uma ordem ficar vermelha: falta de material, quebra da serra, programa não liberado, bloqueio de qualidade. Depois de algumas semanas, um gráfico de Pareto das causas é a lista de melhorias para os não restritivos. Duas regras práticas dimensionamento:

- Se muitas ordens estiverem vermelhas, o buffer é pequeno demais ou o processo a montante é instável demais. Corrija primeiro as principais causas e só depois considere um buffer maior.
- Se quase todas as ordens permanecerem verdes, o buffer é grande demais. Reduza-o em etapas; o WIP e o lead time caem junto com ele.

Para buffers de estoque na distribuição, a regra de gerenciamento dinâmico de buffer resumida na Wikipedia é reduzir o buffer em um terço se o estoque permanecer no terço superior durante um tempo completo de reposição e aumentá-lo em um terço se permanecer tempo demais no terço inferior [6].

## Física da fábrica por trás do TOC: Lei de Little e variabilidade

O TOC às vezes é ensinado como uma filosofia. Mas suas regras de programação também decorrem da teoria das filas.

### Lei de Little

John D. C. Little demonstrou em 1961 que, em um sistema estável, o número médio de itens no sistema é igual à taxa de chegada multiplicada pelo tempo médio no sistema [16]. Em termos de fábrica (Hopp e Spearman) [17]:

**WIP = vazão × lead time de fabricação**, ou **lead time de fabricação = WIP ÷ vazão**

**Exemplo resolvido (planta de coletores, antes e depois do DBR):**

| | Antes (empurrado) | Depois (DBR) |
|---|---|---|
| WIP entre a serra e a expedição | 640 unidades | 90 unidades |
| Vazão | 127 unidades por semana | 147 unidades por semana |
| Lead time de fabricação = WIP ÷ vazão | 640 ÷ 127 = 5,0 semanas | 90 ÷ 147 = 0,61 semana, cerca de 3 dias úteis |

O WIP caiu porque a corda deixou de liberar material antecipadamente; a vazão subiu porque o gargalo passou a ser explorado. O lead time caiu mais de 80 por cento. A Lei de Little também indica o limite: se o WIP à frente do gargalo cair tanto que ele fique sem material, a vazão também cai. É por isso que o DBR mantém um pulmão apenas no gargalo, e em nenhum outro ponto.

### Variabilidade e utilização

A aproximação de Kingman para uma única estação mostra por que os não gargalos precisam de capacidade ociosa [17][18]:

**Tempo de espera ≈ ((ca² + ce²) ÷ 2) × (u ÷ (1 − u)) × te**

em que ca e ce são os coeficientes de variação das chegadas e dos tempos de processo, u é a utilização e te o tempo médio de processo. Trata-se de uma aproximação para uma única estação com distribuições gerais de chegada e de tempo de processo (G/G/1), e é mais precisa em utilizações altas [17][18].

| Utilização u | u ÷ (1 − u) | Tempo de espera com ca = ce = 1, te = 40 min |
|---|---|---|
| 70% | 2,3 | 93 min |
| 85% | 5,7 | 227 min |
| 95% | 19,0 | 760 min |

Entre 85 e 95 por cento de utilização, o tempo de espera mais que triplica. Uma planta que empurra cada recurso para 95 por cento cria filas longas em todos os lugares. A resposta do TOC é operar o gargalo em utilização muito alta, protegido por um pulmão deliberado, e manter os não gargalos bem abaixo disso.

## Contabilidade de ganho vs. contabilidade de custos

A contabilidade de ganho é o sistema de medição do TOC. Goldratt apresentou suas três medidas em *A Meta* e em *The Haystack Syndrome* [20]; *Throughput Accounting*, de Thomas Corbett (North River Press), é o tratamento de referência em livro [21].

### As três medidas

| Medida | Definição (Goldratt, conforme resumida pela MAAW) [20] | Definição prática em uma planta |
|---|---|---|
| Ganho (T) | a taxa à qual o sistema gera dinheiro por meio de vendas | vendas menos custos totalmente variáveis, geralmente matéria-prima, componentes comprados, comissões e processos terceirizados por unidade [6][22] |
| Inventário (I), depois frequentemente chamado de "investimento" | dinheiro que o sistema aplica na compra de coisas que pretende vender | matéria-prima, WIP e produtos acabados avaliados pelo custo de material, além, na definição mais ampla, de equipamentos e edificações [22] |
| Despesa operacional (OE) | todo o dinheiro que o sistema gasta para transformar inventário em ganho | salários e ordenados (incluindo mão de obra direta), aluguel, energia, manutenção, depreciação |

A mão de obra direta faz parte de OE, não de T. Essa é a diferença essencial em relação ao custeio padrão: na maioria das plantas, a mão de obra não sobe nem desce com cada unidade adicional no curto prazo.

### Medidas derivadas

| Medida | Fórmula | Planta de coletores após a exploração (semanal) |
|---|---|---|
| Lucro líquido (NP) | T − OE | $85.250 − $63.500 = $21.750 |
| Retorno sobre o investimento (ROI) | (T − OE) ÷ I | com I = $1,2 milhão: $21.750 × 52 ÷ $1.200.000 = 94% ao ano |
| Produtividade | T ÷ OE | $85.250 ÷ $63.500 = 1,34 |
| Giros do investimento | T ÷ I | $85.250 × 52 ÷ $1.200.000 = 3,7 ao ano |

O resumo da Lean Production lista as mesmas medidas derivadas e a prioridade de decisão do TOC: aumentar o ganho primeiro, depois reduzir o investimento, e por fim reduzir a despesa operacional [22]. O valor de investimento de $1,2 milhão é uma premissa do exemplo.

### Regra de decisão: ganho por unidade de restrição

Quando existe uma restrição, os produtos devem ser ordenados pelo ganho por unidade de tempo do gargalo, e não pela margem por unidade. Nos livros de contabilidade, isso corresponde à conhecida "margem de contribuição por unidade de fator limitante"; a equipe examinadora da ACCA descreve a versão de ganho com o retorno por hora de fábrica e a razão de contabilidade de ganho (TPAR) [19]:

- **Retorno por hora de fábrica** = throughput por unidade ÷ horas por unidade no gargalo
- **Custo por hora de fábrica** = custo total da fábrica ÷ total de horas disponíveis no gargalo
- **TPAR** = retorno por hora de fábrica ÷ custo por hora de fábrica; normalmente deve ser maior que 1 [19].

### Exemplo prático: custeio padrão versus contabilidade de throughput

O custeio padrão, na fábrica de manifolds, aloca a despesa operacional aos produtos pelos minutos-padrão de mão de obra. Minutos-padrão orçados na demanda: A 70 minutos por unidade (8 + 25 + 12 + 15 + 10) × 100 unidades = 7.000; B 97 minutos (10 + 40 + 12 + 20 + 15) × 60 unidades = 5.820; total de 12.820 minutos. Taxa de rateio = $62.000 ÷ 12.820 = **$4,84 por minuto-padrão**.

| | Produto A | Produto B |
|---|---|---|
| Preço | $900,00 | $1.200,00 |
| Material | $400,00 | $450,00 |
| Mão de obra e overhead (70 × $4,84; 97 × $4,84) | $338,80 | $469,48 |
| **Margem padrão por unidade** | **$161,20** | **$280,52** |
| Margem padrão % | 17,9% | 23,4% |
| Throughput por unidade | $500 | $750 |
| Horas de CNC por unidade | 0,417 | 0,667 |
| **Retorno por hora de CNC** | **$1.200** | **$1.125** |

Custo por hora de fábrica, usando a despesa operacional após a exploração: $63.500 ÷ (4.400 ÷ 60 = 73,3 horas de CNC) = **$865,91**. TPAR A = 1.200 ÷ 865,91 = **1,39**; TPAR B = 1.125 ÷ 865,91 = **1,30**. Os dois produtos dão lucro, mas A gera mais por hora de restrição.

O custeio padrão diz "empurre B": ele tem a maior margem por unidade e em percentual. A contabilidade de throughput diz "preencha a restrição primeiro com A". A seção 5 mostrou o resultado: $1.250 a mais de lucro líquido por semana com o ranking de throughput. O custeio padrão não está errado como aritmética. Ele responde a outra pergunta (o custo total médio de uma unidade em um período), e essa não é a pergunta que uma decisão de mix de produtos sob restrição precisa responder.

### Exemplo prático: um pedido que usa apenas capacidade ociosa

Um cliente pede 40 placas adaptadoras por semana a $260 cada. O material custa $150. As placas precisam da serra (15 minutos), de rebarbação (10 minutos) e de montagem (25 minutos), mas **nenhum tempo de CNC**. Total: 50 minutos-padrão.

| | Visão do custo padrão | Visão de throughput |
|---|---|---|
| Material | $150,00 | $150,00 |
| Mão de obra e overhead (50 × $4,84) | $242,00 | não por unidade: a DO não muda, os recursos têm capacidade ociosa |
| Margem por unidade | $260 − $392 = **−$132** | T = $260 − $150 = **+$110** |
| Decisão | recusar | aceitar |
| Efeito no lucro líquido semanal (40 placas) | | +$4.400, desde que serra, rebarbação e montagem permaneçam abaixo de sua capacidade |

Verifique as cargas: serra +600 minutos (para 2.000, 42 por cento), rebarbação +400 (para 2.320, 48 por cento), montagem +1.000 (para 3.700, 77 por cento). A montagem se aproxima de se tornar uma restrição, portanto o pedido deve ser aceito com um limite de volume e acompanhado. Pelo custeio padrão, a fábrica teria recusado $4.400 por semana.

### Estoque e lucro reportado

Pelo custeio por absorção, o overhead é incorporado ao estoque. Se a fábrica de manifolds produzir 50 unidades extras de A para estoque, 50 × $338,80 = **$16.940** do overhead do período passam para o balanço patrimonial em vez de para a demonstração de resultado, e o lucro reportado sobe esse valor. O caixa cai pelo material comprado, 50 × $400 = $20.000. Pela contabilidade de throughput, o lucro líquido não muda e o estoque sobe $20.000. Por isso os praticantes da TOC alertam que acumular estoque pode fazer uma fábrica parecer melhor no papel enquanto piora em caixa e em prazo de entrega.

Nos Estados Unidos, a divulgação financeira externa exige que o overhead de produção seja incluído no custo do estoque (custeio por absorção): pela ASC 330, o custo do estoque é a soma dos desembolsos e encargos incorridos, direta ou indiretamente, para levar um item à sua condição e localização atuais, e o overhead fixo de produção é alocado ao estoque com base na capacidade normal das instalações produtivas [28][29]. Seu controller define como a fábrica aplica isso. A contabilidade de throughput é, portanto, uma ferramenta interna de decisão. A maioria das fábricas que a utiliza mantém demonstrações GAAP para divulgação externa e concilia as duas.

### O que o controller da planta deve acompanhar

| Risco | Por que importa | Mitigação |
|---|---|---|
| "Verdadeiramente variável" definido de forma restrita ou ampla demais | T fica superestimado ou subestimado | acordar por escrito uma lista: material, peças compradas, processos terceirizados, frete de saída se por unidade, comissões de vendas |
| OE tratado como fixo no longo prazo | grandes mudanças de volume de fato alteram o OE | revisar as premissas de OE para decisões além de um trimestre |
| Ignorar a localização da restrição | throughput por minuto de restrição não tem significado se a restrição se desloca | recalcular quando a tabela de carga mudar |
| Precificar abaixo do custo total de forma permanente | a capacidade ociosa desaparece e o OE precisa crescer | limites de volume, revisão a cada trimestre |
| Dois conjuntos de números | confusão nas reuniões de gestão | uma planilha de reconciliação; TA para decisões, GAAP para demonstrações |
| Mão de obra que realmente varia por unidade | pagamento por peça ou mão de obra temporária lançada por unidade é de fato variável | incluir no custo verdadeiramente variável; salários regulares permanecem no OE |

O guia de [KPIs de manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/) cobre giro de estoque e outras medidas financeiro-operacionais.

## Os processos de pensamento

Os processos de pensamento (TP) são as ferramentas da TOC para problemas que não são de capacidade: restrições de política, conflitos e gestão de mudanças. O romance de Goldratt *It's Not Luck* (1994) levou-as a um público amplo; Kim, Mabin e Davies revisaram a literatura de pesquisa sobre elas, de 1994, após esse livro, até o início de 2006, e constataram que a TOC se desenvolveu principalmente pela prática, com muitas áreas de aplicação e abordagens multimétodo [12].

Os TP respondem a três perguntas: o que mudar, para o que mudar e como provocar a mudança.

| Ferramenta | Pergunta | Lógica | Resultado |
|---|---|---|---|
| Árvore da realidade atual (CRT) | o que mudar? | causa e efeito ("se ... então ...") de algumas causas-raiz até muitos efeitos indesejados (UDEs) | o problema central |
| Nuvem que evapora (EC), diagrama de resolução de conflitos | para o que mudar? | necessidade ("para ... precisamos ...") | a premissa que, uma vez quebrada, resolve o conflito |
| Árvore da realidade futura (FRT) | para o que mudar? | suficiência, com injeções | a solução e seus efeitos colaterais (ramos negativos) |
| Árvore de pré-requisitos (PRT) | como provocar a mudança? | obstáculos e objetivos intermediários | a sequência de marcos |
| Árvore de transição (TrT) | como provocar a mudança? | ação, razão, efeito | um plano passo a passo |

### Exemplo trabalhado: nuvem que evapora sobre o tamanho do lote

Na planta de coletores, o supervisor do CNC e o gerente de vendas discutiam o tamanho do lote de B.

| Caixa | Conteúdo |
|---|---|
| A (objetivo comum) | operar uma planta lucrativa |
| B (necessidade 1) | usar bem a capacidade da célula CNC |
| C (necessidade 2) | entregar pedidos de B com rapidez |
| D (desejo 1, serve a B) | rodar lotes grandes de B (40) para economizar preparações |
| D' (desejo 2, serve a C) | rodar lotes pequenos de B (10) |
| Conflito | D e D' não podem ser feitos ao mesmo tempo |

A premissa sob B–D: "as preparações na célula CNC levam 30 minutos, então cada preparação extra custa 30 minutos de tempo da restrição." A injeção: reduzir a preparação para 18 minutos com preparação externa e agrupar as variantes de B por família de dispositivos de fixação, de modo que lotes pequenos custem pouco tempo da restrição. A nuvem "evapora" porque a premissa por trás do conflito deixa de ser verdadeira.

### Exemplo trabalhado: uma pequena árvore da realidade atual

Efeitos indesejados (UDEs) listados pela equipe de liderança: pedidos atrasados, alto WIP, urgências frequentes, horas extras na montagem, supervisores brigando por prioridades. Lendo a árvore de baixo para cima:

1. Se os supervisores são medidos pela utilização, então liberam trabalho cedo para manter suas máquinas ocupadas.
2. Se o trabalho é liberado cedo, então o WIP cresce e as filas diante da célula CNC aumentam.
3. Se as filas são longas, então a célula CNC executa o que está no topo, e não o que está vencendo.
4. Se a célula CNC executa as ordens erradas, então as ordens vencidas atrasam, e urgências e horas extras de montagem vêm em seguida.

Problema central: a medida de utilização (uma restrição de política). A correção não é mais capacidade, mas uma medida diferente e uma regra de liberação, que é o DBR.

### Usando bem os TP

- Mantenha as árvores pequenas no início. Cinco a dez UDEs bastam para uma área.
- Verifique cada seta: a causa realmente leva ao efeito? Há outras causas?
- Trabalhe em um grupo que inclua operadores; eles conhecem efeitos que os gerentes não veem.
- A nuvem que evapora é a ferramenta mais fácil para começar e a mais útil nos conflitos do dia a dia.

## TOC vs. Lean vs. Six Sigma

TOC, Lean e Six Sigma são frequentemente apresentados como concorrentes. Na prática, eles respondem a perguntas diferentes.

| Tema | Teoria das restrições | Lean | Six Sigma |
|---|---|---|---|
| Origem | Goldratt, década de 1980, Israel e EUA [1][3] | Sistema Toyota de Produção, Japão | Motorola, década de 1980, EUA [27] |
| Pergunta central | onde está a alavanca? | onde está o desperdício? | onde está a variação? |
| Foco | a restrição e a vazão global | fluxo e valor para o cliente ao longo do fluxo de valor | defeitos e capacidade do processo |
| Principais ferramentas | cinco passos de focalização, DBR, gestão de buffers, contabilidade de vazão, processos de pensamento | mapeamento do fluxo de valor, 5S, SMED, kanban, trabalho padronizado, kaizen | DMAIC, estatística, gráficos de controle, planejamento de experimentos |
| Visão de capacidade | proteger a capacidade excedente nos não restritos | balancear ao takt e reduzir a superprodução como desperdício | não é central |
| Visão de estoque | buffers de tempo em poucos pontos escolhidos | minimizar em toda parte | não é central |
| Visão financeira | vazão, estoque, despesa operacional | lead time, custo, qualidade | custo da má qualidade |
| Fraqueza típica | foco estreito pode ignorar desperdícios fora da restrição | aplicar as ferramentas em todo lugar ao mesmo tempo | projetos escolhidos sem visão sistêmica |

### Como trabalham juntos

1. **A TOC define o foco.** Os cinco passos de focalização escolhem o ponto onde a melhoria altera o resultado da fábrica.
2. **O Lean explora a restrição.** O SMED reduz as trocas de ferramental na restrição, o TPM eleva sua disponibilidade, e o trabalho padronizado e o 5S a estabilizam. Veja os guias [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/), [SMED](https://www.m365.fm/en/learn/smed-changeover-reduction/) e [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/).
3. **O Six Sigma remove a variação na restrição e antes dela.** Sucata na restrição e suprimento tardio e instável no seu buffer são bons projetos DMAIC. Veja [Six Sigma and root cause analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).
4. **A TOC mede o resultado.** A contabilidade de vazão mostra o que cada projeto fez para T, I e OE.

### Onde Lean e TOC realmente divergem

- **Balanceamento de linha.** O Lean balanceia o conteúdo de trabalho ao takt. A TOC mantém deliberadamente os não restritos desbalanceados, com capacidade ociosa, para proteger a restrição. Em uma linha de montagem cadenciada pelo takt, a linha como um todo atua como restrição; a divergência pesa mais em job shops.
- **Buffers.** O Lean trata o estoque como desperdício e o buffer como contramedida temporária. A TOC trata um buffer de tempo dimensionado na restrição como proteção permanente. Ambos reduzem o WIP total de forma acentuada em comparação com um sistema puxado por empurrão.
- **Mecanismos de puxada.** O kanban limita o WIP entre cada par de processos; o DBR limita-o entre a liberação e a restrição, de forma semelhante ao CONWIP, que Spearman, Woodruff e Hopp propuseram como alternativa de puxada ao kanban [23]. Veja o guia [kanban and pull system](https://www.m365.fm/en/learn/kanban-pull-system/).

### OEE na restrição

O OEE (disponibilidade × desempenho × qualidade) é mais útil na restrição, onde cada minuto perdido custa vazão. Em um não restrito, um OEE baixo pode significar apenas que ele espera, como deve ser. Se a sua fábrica reporta um único número de OEE para todas as máquinas, separe a restrição.

## Além da fábrica: corrente crítica e reposição

### Gestão de projetos pela corrente crítica

Em *Critical Chain* (1997), Goldratt aplicou a TOC a projetos [3]. As ideias em resumo:

- **A corrente crítica** é a cadeia mais longa de tarefas dependentes, levando em conta tanto as dependências entre tarefas quanto as dependências de recursos. Um caminho crítico ignora conflitos de recursos.
- **Estimativas agressivas de tarefas.** A folga de segurança é retirada das tarefas individuais.
- **Buffers agregados.** A folga retirada é reunida em um **buffer de projeto** no final e em **buffers de alimentação** nos pontos em que as cadeias não críticas se unem à corrente crítica.
- **Gestão de buffers.** O progresso é acompanhado por um gráfico de febre: buffer consumido versus cadeia concluída.
- **Sem multitarefa prejudicial.** Os recursos concluem uma tarefa antes de iniciar a seguinte.

O comparativo da PMI entre DBR e buffers de corrente crítica descreve a lógica comum: ambos protegem a restrição do sistema com buffers de tempo agregados, e não com segurança local em cada etapa [24]. Em projetos de ferramental, expansões de fábrica e lançamentos de novos produtos, a corrente crítica costuma ser a segunda aplicação da TOC, depois do DBR.

### Reposição e distribuição

Para itens produzidos para estoque e peças de reposição, a TOC substitui as previsões em cada local por buffers que são reabastecidos conforme o consumo real. O buffer é dimensionado pelo consumo máximo esperado dentro do tempo médio de reposição, mais uma margem para fornecimento não confiável; em seguida, é ajustado em um terço para cima ou para baixo, conforme o tempo que o estoque permanece nas zonas vermelha ou verde [6]. O guia [gestão de estoque na manufatura](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/) compara isso com as fórmulas clássicas de estoque de segurança, e o guia [S&OP e MRP](https://www.m365.fm/en/learn/sop-mrp-production-planning/) mostra onde isso se encaixa no planejamento.

## Modelos para trabalhos de TOC

Copie estas tabelas para uma planilha ou um quadro no chão de fábrica. Elas são deliberadamente simples.

### Modelo 1: Planilha de identificação de restrição

| Recurso | Carga orientada pela demanda (min/semana) | Disponível (min/semana) | Parcela produtiva | Carga efetiva % | Fila média à frente (horas de trabalho) | Caminhada do gargalo: % em operação | Período ativo: % exclusivo / soma | Veredito |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Modelo 2: Registro de perdas da restrição (por turno)

| Data | Turno | Minutos planejados | Minutos produtivos | Pausa não coberta | Troca de ferramental | Sem material | Bloqueado | Parado | Sucata/retrabalho | Observações |
|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | |

### Modelo 3: Mix de produtos por throughput por minuto de restrição

| Produto | Preço | Custo variável real | T por unidade | Minutos de restrição por unidade | T por minuto de restrição | Demanda | Classificação | Quantidade planejada |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Modelo 4: Painel de status dos buffers

| Pedido | Ponto protegido (restrição / montagem / expedição) | Prazo no ponto protegido | Tamanho do buffer (h) | Restante (h) | Penetração % | Zona | Localização atual | Responsável |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Modelo 5: Registro de causas de pedidos na zona vermelha

| Data | Pedido | Zona atingida | Categoria da causa (material, máquina, qualidade, programa, pessoas, outra) | Detalhe da causa | Minutos perdidos na restrição | Contramedida | Responsável |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Modelo 6: Planilha de decisão de elevação

| Opção | Minutos extras de restrição por semana | Δ T por semana | Δ OE por semana | Δ I (único) | Δ NP por semana (ΔT − ΔOE) | Payback em semanas (ΔI ÷ ΔNP) | Para onde a restrição vai em seguida? |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Modelo 7: Nuvem evaporante

| A: objetivo comum | B: necessidade 1 | C: necessidade 2 | D: o que se quer para atender B | D': o que se quer para atender C | Premissas B–D | Premissas C–D' | Premissas D vs. D' | Injeção |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Modelo 8: Reunião diária sobre a restrição (10 minutos, junto à restrição)

| Minuto | Tema | Entrada |
|---|---|---|
| 0–2 | ontem: minutos produtivos vs. plano, principal perda | Modelo 2 |
| 2–5 | buffer: pedidos vermelhos e amarelos, quem age | Modelo 4 |
| 5–8 | causas dos vermelhos, contramedidas em aberto | Modelo 5 |
| 8–10 | hoje: sequência, dimensionamento, janela de manutenção | cronograma do tambor |

O guia [gestão do chão de fábrica](https://www.m365.fm/en/learn/shop-floor-management/) mostra como incorporar essa reunião em reuniões em níveis.

## Roteiro de implementação: os primeiros seis meses

O roteiro abaixo é para uma fábrica ou um fluxo de valor. Ele pressupõe uma restrição física dentro da fábrica; se a análise do mês 1 mostrar que o mercado é a restrição, pule para o S-DBR e para o lado comercial.

| Fase | Semanas | Objetivos | Atividades principais | Critérios de saída |
|---|---|---|---|---|
| 0. Preparar | 1–2 | entendimento compartilhado | a liderança lê *A Meta* ou executa um jogo de simulação de TOC; acordar meta e medidas (T, I, OE); envolver cedo o sindicato ou os representantes dos funcionários | patrocinador definido, equipe central formada, medidas acordadas |
| 1. Identificar | 3–6 | encontrar a restrição com dados | tabela de carga (Método 1), contagem de filas, caminhadas de gargalo, dados de máquinas ou análise de período ativo, se disponíveis | restrição acordada pelos dados e pelo chão de fábrica |
| 2. Explorar | 5–12 | recuperar o tempo perdido da restrição | registro de perdas da restrição, quebras de cobertura, setup externo, qualidade antes e depois da restrição, prioridade de manutenção, mix de produtos por T por minuto de restrição | minutos produtivos aumentando, Pareto de perdas em uso |
| 3. Subordinar | 9–16 | proteger a restrição, reduzir WIP | piloto de DBR ou S-DBR: programa de tambor, buffers, liberação por corda; interromper metas de utilização nos não restritos | regra de liberação em uso diário, WIP caindo |
| 4. Gestão de buffers | 12–20 | controle diário e aprendizado | quadro de status dos buffers, registro de causas de pedidos vermelhos, reunião diária de 10 minutos sobre a restrição, primeiro ajuste do tamanho dos buffers | menos pedidos vermelhos, causas sendo corrigidas |
| 5. Medir e decidir | 16–24 | finanças no quadro | visão de contabilidade de throughput para decisões de mix e de pedidos, reconciliação com custeio padrão | TA usada em pelo menos uma decisão real |
| 6. Elevar e revisar | 20–26 | adicionar capacidade somente onde justificado; verificar a inércia | folha de decisão de elevação (Modelo 6), revisar roteiros, regras de lote, regras de orçamento | localização da restrição rechecada, próximo ciclo planejado |

### Papéis

| Papel | Responsabilidade |
|---|---|
| Patrocinador (gerente da fábrica) | meta, medidas, remoção de restrições de política, como metas de utilização |
| Responsável pela restrição (supervisor da restrição) | minutos produtivos diários, registro de perdas, reunião sobre a restrição |
| Planejador ou programador | programa de tambor, liberação, tamanhos de buffer, orçamento de prazos |
| Controller da fábrica | definições de T, I, OE; decisões de mix de produtos e de pedidos; reconciliação |
| Líder de manutenção | tempo de resposta à restrição, janelas de manutenção planejada |
| Líder de qualidade | inspeção antes e depois da restrição, causas de pedidos vermelhos na qualidade |
| Operadores na restrição e ao redor dela | motivos das perdas, melhoria de setup, ideias; eles são donos das contramedidas |

### Critérios para a área piloto

Escolha um fluxo de valor em que (1) uma restrição seja claramente visível, (2) a entrega ou o lead time prejudiquem os clientes, (3) o supervisor esteja disposto, e (4) existam dados ou eles possam ser coletados manualmente por algumas semanas. O guia de [mapeamento do fluxo de valor](https://www.m365.fm/en/learn/value-stream-mapping/) mostra como mapear o fluxo e ver onde a restrição se localiza no fluxo de valor.

## TOC KPIs: como medir o progresso

| KPI | Fórmula | Nível | Frequência | Comentário |
|---|---|---|---|---|
| Throughput (T) | vendas − custo verdadeiramente variável | fábrica | semanal, mensal | a principal medida de objetivo |
| Despesa operacional (OE) | todos os demais gastos | fábrica | mensal | deve crescer mais devagar que T |
| Estoque/investimento (I) | valor material do estoque e do WIP (mais os ativos na visão ampla) | fábrica | mensal | a parte do WIP deve cair com o DBR |
| Lucro líquido | T − OE | fábrica | mensal | |
| ROI | (T − OE) ÷ I | fábrica | trimestral | |
| Minutos produtivos do gargalo | minutos de peças boas no gargalo ÷ minutos disponíveis | gargalo | por turno | o batimento cardíaco diário |
| Aderência do cronograma do gargalo | ordens iniciadas dentro da janela planejada ÷ ordens planejadas | gargalo | diária | mostra se o tambor se sustenta |
| Participação de ordens vermelhas | ordens vermelhas ÷ ordens abertas | pulmão (buffer) | diária | muito alta: pulmão pequeno demais ou processo instável |
| Desempenho na data de entrega | ordens expedidas na data prometida ou antes ÷ ordens expedidas | cliente | semanal | o resultado mais visível |
| Lead time | liberação até expedição, mediana e 90º percentil | fluxo de valor | semanal | verificar com a Lei de Little |
| WIP em dias | WIP ÷ throughput médio diário | fluxo de valor | semanal | |
| Throughput-dólar-dias (TDD) | Σ (valor T da ordem atrasada × dias de atraso) | responsabilização | semanal | medida da TOC para "coisas que deveriam ter sido feitas"; origem no trabalho de medição de Goldratt [unverified: origem atribuída ao trabalho de medição de Goldratt, não confirmada] |
| Estoque-dólar-dias (IDD) | Σ (valor do estoque × dias retido) | responsabilização | semanal | mede "coisas que não deveriam ter sido feitas" [unverified: definição não confirmada nas fontes consultadas] |

Duas regras para o painel de KPIs: mostrar os KPIs do gargalo no próprio gargalo, e não apresentar a utilização dos não gargalos como meta de desempenho. O guia de [KPIs de manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/) define os KPIs padrão de produção que complementam estes.

## Erros comuns

| Erro | Por que prejudica | Melhor opção |
|---|---|---|
| Escolher o gargalo pelo instinto | o problema visível costuma ser um sintoma (a montagem estava sem material) | tabela de carga mais verificação no chão de fábrica, com dados de períodos ativos quando disponíveis |
| Pular para a etapa 4 | dinheiro gasto enquanto o gargalo ainda perde de 20 a 25% do seu tempo | explorar e subordinar primeiro |
| Manter metas de utilização nos não gargalos | liberação antecipada, mais WIP, o gargalo executa o trabalho errado | medir os não gargalos por "o gargalo nunca espera por nós" |
| Liberar trabalho cedo "por segurança" | WIP e lead times crescem; prioridades se perdem | liberação estrita pela corda (rope) |
| Pulmões definidos uma vez e esquecidos | grandes demais: o WIP fica alto; pequenos demais: vermelhos constantes | ajustar a partir dos dados de ordens vermelhas |
| Nenhum portão de qualidade antes do gargalo | o gargalo usina peças que já são sucata | inspeção ou poka-yoke antes do gargalo |
| Sucata descoberta longe a jusante | tempo do gargalo desperdiçado silenciosamente | verificar características críticas logo após o gargalo |
| Ignorar o gargalo de mercado | uma fábrica com capacidade ociosa em todo lugar continua "otimizando" máquinas | S-DBR, ofertas de lead time, envolvimento de vendas |
| Mix de produtos pela margem por unidade | menor lucro com a mesma capacidade | classificar pelo T por minuto de gargalo |
| Dois sistemas de prioridade concorrentes | listas urgentes e cores de pulmão entram em conflito | uma regra: status do pulmão |
| O gargalo se move, as regras permanecem | tamanhos de lote e cotações antigas bloqueiam o próximo ganho | revisão da etapa 5 a cada ciclo |
| Operadores do gargalo deixados de lado | as pessoas que veem as perdas não são consultadas | operadores são responsáveis pelas causas das perdas e pelas contramedidas |

## Críticas e limites da teoria das restrições

A TOC tem resultados práticos sólidos e um suporte mais fraco na pesquisa. Um guia sério precisa cobrir os dois aspectos.

### 1. Evidências: casos de sucesso e viés de publicação

Mabin e Balderstone analisaram mais de 80 aplicações bem-sucedidas da TOC publicadas e encontraram melhorias operacionais e financeiras significativas; apesar de buscas extensas, não encontraram relatos de fracassos [10]. Isso é um alerta tanto quanto um endosso. Os casos publicados são escritos por consultores, fornecedores e empresas entusiasmadas; implementações fracassadas raramente chegam à imprensa. Gupta e Snyder (2009) argumentaram que a TOC ainda não havia demonstrado sua eficácia na literatura acadêmica e pediram estudos que relacionem a implementação ao desempenho financeiro, conforme resumido na Wikipédia [6]. A pesquisa de Panizzolo com 61 fábricas europeias constatou que algumas práticas da TOC, especialmente DBR, recursos não gargalo com capacidade excedente e um plano-mestre baseado em restrições, estavam associadas a melhor desempenho, mas os resultados variaram por país e dependeram das avaliações dos próprios gestores [11].

### 2. Otimalidade e pesquisa em programação

Pesquisadores de pesquisa operacional criticaram as heurísticas da TOC por não serem ótimas. Trietsch argumentou que o DBR é inferior a métodos concorrentes, e Linhares (2009) argumentou que a regra de mix de produtos da TOC (ordenar pelo throughput por unidade de restrição) não pode garantir resultados ótimos em geral, porque o problema de mix de produtos com várias restrições é computacionalmente difícil [6]. A lição prática: a regra "T por minuto de restrição" é confiável com uma restrição clara e única. Com duas ou mais restrições interagindo, use programação linear ou um APS.

### 3. Originalidade

Críticos apontaram que muitas ideias da TOC já existiam antes: contribuição por fator limitante na contabilidade gerencial (Noreen, Smith e Mackey, 1995), elementos de dinâmica de sistemas e controle estatístico de processo, PERT/CPM na gestão de projetos [6]. O próprio Goldratt reconheceu trabalhos anteriores, em particular o Sistema Toyota de Produção e as ideias de fluxo de Ford, em seu artigo de 2009 "Standing on the Shoulders of Giants" [6]. Para um praticante, a originalidade importa menos do que o fato de a combinação funcionar; para um estudante, vale saber de onde vem cada peça.

### 4. Pessoas e políticas

Nave (2002) argumentou que a TOC tende a ignorar os funcionários e não trata políticas malsucedidas como restrições, conforme resumido na Wikipédia [6]. Na prática, o risco é que "subordinar" seja lido como "obedecer", e que os operadores do gargalo carreguem toda a pressão. A seção 20 trata disso.

### 5. Onde a TOC se encaixa menos bem

- **Linhas balanceadas e cadenciadas** com takt e pouca variabilidade: a própria linha é a restrição, e o balanceamento de linha lean é a ferramenta melhor.
- **Gargalos altamente móveis** em job shops de alto mix: um único tambor é difícil de definir. S-DBR, controle de carga de trabalho ou um APS se adaptam melhor.
- **Fábricas em que o mercado é a restrição** por anos: o DBR interno acrescenta pouco; a alavanca está em vendas, lead time e desenho de ofertas.
- **Maturidade de medição:** a contabilidade de throughput exige uma equipe financeira disposta a manter uma segunda visão. Sem ela, as decisões voltam ao custo padrão.

### 6. Contexto comercial

Grande parte da literatura sobre TOC é publicada pela North River Press e por consultorias fundadas por Goldratt ou por seus associados. Isso não a torna errada, mas significa que muitas fontes não são independentes. Este guia usa fontes revisadas por pares sempre que elas existem e rotula como tal as afirmações de praticantes (como o número de "30 por cento de capacidade oculta" do TOC Institute) [4].

## Pessoas e segurança no gargalo

A TOC pode melhorar ou piorar o trabalho das pessoas no gargalo. O método em si é neutro; a forma como é introduzido é que faz a diferença.

### O que os operadores percebem primeiro

- **Mais atenção:** os gerentes passam a se preocupar com cada minuto em uma única máquina. Isso pode dar a sensação de controle. Explique o motivo e deixe que os operadores registrem as perdas por conta própria.
- **Pausas:** "cobertura de pausas" significa que um operador substituto opera a máquina, e nunca que as pessoas deixam de fazer suas pausas.
- **Ociosidade em outras áreas:** os operadores de não gargalos podem se preocupar com seus empregos quando lhes é dito para não formar estoque. Deixe claro que a capacidade ociosa é intencional e use-a para treinamento, melhoria de setup, 5S, polivalência para o gargalo e trabalho de qualidade.
- **Reconhecimento:** as melhorias da equipe do gargalo (como a troca de ferramentas de 30 para 18 minutos) devem ser visíveis no quadro, com os nomes, se eles concordarem.

### As regras de segurança não se dobram ao gargalo

A pressão para manter o gargalo funcionando nunca deve levar a atalhos na segurança. A manutenção e os serviços em máquinas nas quais uma energização inesperada possa ferir pessoas estão sujeitos à norma da OSHA sobre controle de energia perigosa (bloqueio/etiquetagem, 29 CFR 1910.147) [25]. Trocas mais rápidas devem ser incorporadas ao procedimento (dispositivos de fixação de liberação rápida, ferramentas pré-ajustadas, material preparado em etapas), e não obtidas pulando o bloqueio. O mesmo vale para proteções e ergonomia: um operador substituto precisa do mesmo treinamento e da mesma qualificação que o operador regular.

### Contexto sindical e trabalhista

Em fábricas sindicalizadas, pausas escalonadas, operadores substitutos, turnos de sábado e mudanças nas medições frequentemente afetam o acordo coletivo de trabalho. Envolva o sindicato ou os representantes dos funcionários já na fase 0 do roteiro, explique o objetivo e acorde como as horas extras e os papéis de substituição serão atribuídos. Uma implantação da TOC que começa com uma reclamação sobre os horários de pausa perde meses.

### Respeito às pessoas em termos da TOC

A nuvem evaporada (Seção 12) é uma ferramenta prática de respeito às pessoas: ela parte do princípio de que ambos os lados de um conflito têm uma necessidade legítima e busca a premissa errada por trás do conflito. Usada em uma equipe que inclui operadores, ela transforma "operadores versus planejadores" em um problema compartilhado, com um objetivo compartilhado.

## TOC na fábrica digital: dados, simulação e APS

A TOC nasceu com software: a OPT era um programa de programação antes de ser uma filosofia [3]. Hoje, ferramentas digitais ajudam em quatro frentes.

### 1. Dados para a detecção de gargalos

Plataformas MES e IIoT fornecem os estados de máquina com carimbo de tempo que o método do período ativo precisa (Seção 6). A maioria das fábricas já possui os estados (em operação, ociosa, parada, preparação), mas não separa "faminta" e "bloqueada" de "ociosa". Acrescentar esses dois estados costuma ser a mudança única mais útil para a análise TOC. Combine com os operadores e, quando aplicável, com o sindicato que os dados de estado das máquinas servem para encontrar perdas do sistema, e não para avaliar pessoas individualmente. Colete os dados em modo somente leitura a partir dos controladores e mantenha o segmento de rede OT segregado; o guia [OT cybersecurity e ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) explica como. Verifique se os relógios estão sincronizados entre as máquinas, porque o método do período ativo compara carimbos de tempo entre recursos. Os guias [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) e [manutenção preditiva e IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/) explicam o caminho dos dados; o guia [manufacturing IT com Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) trata da análise em nuvem para esses dados.

### 2. Simulação para gargalos móveis e dimensionamento de buffers

Uma simulação de eventos discretos permite testar tamanhos de buffer, regras de liberação e opções de elevação antes de mexer no chão de fábrica. Roser, Nakano e Tanaka desenvolveram o método do período ativo com dados de simulação [13][14]. Perguntas típicas: com o mix do próximo trimestre, com que frequência o gargalo muda? Quão grande precisa ser o buffer da restrição para manter a parcela de pedidos vermelhos abaixo de 10 por cento? Uma segunda máquina transfere a restrição para a montagem? O guia [gêmeo digital na manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/) explica quando um modelo de simulação se torna um gêmeo digital.

### 3. APS para programação com drum

Um APS pode programar o drum com preparações dependentes da sequência, calcular datas de liberação a partir dos buffers e mostrar o status dos buffers. O DBR fornece a lógica de controle; o APS fornece a capacidade de cálculo, especialmente quando a restrição muda ou várias restrições interagem (onde a regra simples de mix de produtos falha, veja a Seção 19). O guia [programação da produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/) trata disso em profundidade, inclusive quando o ERP é suficiente.

### 4. Modelos de fluxo de valor para a visão do sistema

Um modelo digital de fluxo de valor mostra a restrição no contexto do fluxo completo: tempos de ciclo, disponibilidade, tamanhos de lote e estoques. Um exemplo desse tipo de software é o iFAKT Polaris, que combina modelagem de fluxo de valor e simulação; segundo o fornecedor, seus módulos incluem otimização de programação [26]. Trata-se de uma descrição do fornecedor, não de um teste independente. **Nota: o autor trabalha na iFAKT GmbH.** O guia [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) o descreve com mais detalhes; outras ferramentas de fluxo de valor e simulação podem fazer a mesma análise TOC.

### Sequência: primeiro o método, depois o software

Comece o registro de perdas da restrição e o quadro de buffers em papel ou em planilha. Automatize quando o método funcionar e as pessoas confiarem nos números. Uma tela de status de buffers que ninguém utiliza é pior do que um quadro branco que conduz a reunião diária.

## Glossário

| Termo | Definição |
|---|---|
| Período ativo | uma sequência ininterrupta de estados ativos de um recurso; base do método do período ativo [13] |
| Método do período ativo | método de detecção de gargalos: a qualquer momento, o recurso com o maior período ativo ininterrupto é o gargalo [13][14] |
| Buffer de montagem | buffer de tempo que faz as peças que não são restrição aguardarem na montagem pela peça restritiva |
| Gargalo | um recurso cuja capacidade é inferior à demanda que lhe é imposta |
| Caminhada do gargalo | método de chão de fábrica que registra os estados de trabalhando, faltando material e bloqueado em rondas repetidas [15] |
| Gestão de buffer | acompanhamento do consumo de buffer por zonas de cores para definir prioridades e encontrar as causas das melhorias [9] |
| Penetração do buffer | parcela de um buffer de tempo já consumida |
| Recurso com capacidade restrita (CCR) | um recurso que está próximo de sua capacidade e pode se tornar a restrição se não for gerenciado |
| Restrição | tudo o que limita o desempenho de um sistema em direção ao seu objetivo |
| Buffer de restrição | buffer de tempo em frente à restrição |
| CONWIP | constant work in process (trabalho em processo constante); um sistema puxado que limita o WIP total em uma linha [23] |
| Cadeia crítica | a cadeia mais longa de tarefas dependentes, considerando as dependências de tarefas e de recursos |
| Árvore da realidade atual (CRT) | ferramenta do processo de pensamento que liga efeitos indesejáveis a causas-raiz |
| Tambor | a programação da restrição, que define o ritmo da fábrica |
| Tambor-buffer-corda (DBR) | método de programação da TOC: programar a restrição, protegê-la com buffers de tempo e liberar material no ritmo dela [6][8] |
| Elevar | passo 4: adicionar capacidade na restrição |
| Nuvem evaporante (EC) | ferramenta do processo de pensamento para resolver um conflito questionando uma premissa |
| Explorar | passo 2: obter o máximo da restrição com os recursos existentes |
| Buffer de alimentação | na cadeia crítica, um buffer onde uma cadeia não crítica se junta à cadeia crítica |
| Cinco passos de foco | identificar, explorar, subordinar, elevar, prevenir a inércia [4] |
| Árvore da realidade futura (FRT) | ferramenta do processo de pensamento para testar uma solução e seus efeitos colaterais |
| Inércia | regras e hábitos que sobrevivem à restrição para a qual foram criados |
| Inventário/investimento (I) | dinheiro imobilizado em itens que o sistema pretende vender (e, na visão ampla, em ativos) [20] |
| Lei de Little | WIP = throughput × lead time de produção [16] |
| Despesa operacional (OE) | todo o dinheiro gasto para transformar inventário em throughput [20] |
| Carga planejada | no S-DBR, o trabalho comprometido no CCR expresso em tempo |
| POOGI | processo de melhoria contínua; os cinco passos de foco como um ciclo |
| Árvore de pré-requisitos (PRT) | ferramenta do processo de pensamento que lista obstáculos e objetivos intermediários |
| Buffer de projeto | na cadeia crítica, o tempo de segurança agregado no fim de um projeto |
| Corda | o mecanismo de liberação que vincula a liberação de material à programação da restrição |
| S-DBR (tambor-buffer-corda simplificado) | variante do DBR com um buffer de expedição e uma verificação de carga planejada, para produção sob encomenda [6][9] |
| Gargalo móvel | um gargalo que se desloca entre recursos ao longo do tempo [14] |
| Buffer de expedição | buffer de tempo que protege a data de entrega |
| Subordinar | passo 3: alinhar todos os não gargalos à restrição |
| Throughput (T) | taxa na qual o sistema gera dinheiro por meio de vendas: vendas menos custo totalmente variável [20] |
| Contabilidade de throughput | contabilidade gerencial baseada em T, I e OE |
| Razão de contabilidade de throughput (TPAR) | retorno por hora de fábrica ÷ custo por hora de fábrica [19] |
| Árvore de transição (TrT) | ferramenta do processo de pensamento para a implementação passo a passo |
| TOCICO | Theory of Constraints International Certification Organization, uma organização sem fins lucrativos dos EUA, 501(c)(3) [5] |
| Efeito indesejável (UDE) | um efeito negativo observado, usado como entrada para uma árvore da realidade atual |
| VATI | classificação de fábricas pela forma do fluxo de material: V, A, T, I [6] |

## FAQ: perguntas sobre a teoria das restrições

### O que é a teoria das restrições, em termos simples?

Todo sistema tem um ou poucos elos fracos que limitam o quanto consegue produzir. A teoria das restrições diz: encontre esse elo fraco, aproveite ao máximo, alinhe todo o resto a ele e só então invista nele. Foi desenvolvida por Eliyahu M. Goldratt e apresentada em *A Meta*, em 1984 [1].

### Quais são os 5 passos da teoria das restrições?

Identificar a restrição, explorar a restrição, subordinar todo o restante à restrição, elevar a restrição e evitar que a inércia se torne a restrição, e então recomeçar [4].

### Qual é um exemplo da teoria das restrições?

Na fábrica de coletores da Seção 5, uma célula de CNC limitava a produção. Cobrir as pausas, acelerar as trocas de ferramenta, sequenciar o fornecimento de material e antecipar as verificações de qualidade aumentaram seu tempo produtivo em 800 minutos por semana (22 por cento), e a mudança do mix de produtos para o ganho por minuto da restrição acrescentou lucro sem investimento. Uma segunda máquina, de US$ 650.000, revelou-se a opção mais fraca.

### Qual é a diferença entre gargalo e restrição?

Um gargalo é um recurso com capacidade menor do que a demanda sobre ele. Uma restrição é qualquer coisa que limite o objetivo do sistema: um gargalo, mas também o mercado, um material, uma política ou uma mentalidade. Todo gargalo que limita a produção é uma restrição; nem toda restrição é um gargalo.

### Como identificar um gargalo em um processo?

Comece com uma tabela de carga de capacidade (demanda × tempo de processo versus tempo disponível) e confirme no chão de fábrica com contagens de fila e uma caminhada pelo gargalo. Se você tiver registros de estado das máquinas com data e hora, use o método de períodos ativos, que também mostra gargalos móveis [13][14][15]. A Seção 6 compara seis métodos.

### O que é análise de gargalos?

A análise de gargalos identifica o recurso que limita um processo, quantifica quanta produção ele custa e verifica se ele se desloca ao longo do tempo. Em uma fábrica, comece com um cálculo de carga de capacidade, confirme-o com contagens de fila e uma caminhada pelo gargalo, e use dados de estado das máquinas com o método de períodos ativos quando os tiver (Seção 6).

### Como resolver um gargalo?

Siga os cinco passos de foco. Primeiro explore o gargalo (sem minutos perdidos, sem trabalho defeituoso, com o mix de produtos certo); depois subordine o restante da fábrica ao seu ritmo; e só então eleve o gargalo com horas extras, terceirização ou novos equipamentos. No exemplo dos coletores da Seção 5, apenas a exploração elevou o tempo produtivo na restrição em 22 por cento, antes de qualquer investimento.

### O que são restrições de produção?

Qualquer coisa que limite quanto uma fábrica pode produzir e expedir: capacidade de equipamentos, pessoas e competências, materiais e fornecedores, o mercado e as políticas próprias da fábrica, como regras de tamanho de lote ou de utilização. Uma restrição de produção nem sempre é uma máquina (Seção 3).

### Quais são os quatro tipos de restrições?

As listas variam. Agrupados em quatro, os tipos da Seção 3 são restrições físicas (equipamentos, pessoas, materiais), restrições de mercado, restrições de política e restrições de paradigma. A tabela da Seção 3 divide o tipo físico em três, o que resulta em seis.

### O que é drum-buffer-rope?

Drum-buffer-rope é o método de programação da TOC. O drum é o programa da restrição, o buffer é um buffer de tempo que protege a restrição e a data de expedição, e o rope libera material apenas um buffer de tempo antes de a restrição precisar dele [6][8]. A Seção 7 mostra um cronograma de liberação com números.

### O que é drum-buffer-rope simplificado (S-DBR)?

O S-DBR é uma variante para fábricas de produção sob encomenda. Usa apenas um buffer de expedição e verifica a carga planejada no recurso com restrição de capacidade quando as datas de entrega são prometidas, em vez de manter um programa detalhado da restrição [6][9].

### O que é gerenciamento de buffers?

O gerenciamento de buffers acompanha quanto do buffer de tempo de cada pedido já foi consumido e classifica os pedidos em verde, amarelo ou vermelho. Os pedidos vermelhos recebem prioridade, e as causas dos pedidos vermelhos tornam-se a lista de melhorias [9].

### O que é contabilidade de ganhos (throughput accounting)?

A contabilidade de ganhos é a contabilidade gerencial da TOC. Usa o ganho (vendas menos o custo variável real), o estoque ou investimento e as despesas operacionais; o lucro líquido é G − DO e o ROI é (G − DO) ÷ I [20][22]. Sob uma restrição, ela classifica os produtos pelo ganho por minuto da restrição.

### Como a contabilidade de throughput difere da contabilidade de custos?

A contabilidade de custos padrão distribui mão de obra e custos indiretos entre as unidades e classifica os produtos pela margem por unidade. A contabilidade de throughput trata mão de obra e custos indiretos como despesa operacional, que não muda com cada unidade no curto prazo, e classifica os produtos pelo throughput por unidade de tempo do constrangimento. As duas podem dar respostas opostas, como mostra o exemplo da Seção 11.

### Qual é a diferença entre lean e a teoria das restrições?

O lean busca desperdício em todo o fluxo de valor e cria fluxo e puxada. A TOC busca a única restrição e concentra a melhoria nela. O lean balanceia o trabalho ao takt; a TOC mantém capacidade ociosa nos não constrangimentos. Usadas em conjunto, a TOC indica às ferramentas lean, como SMED e TPM, por onde começar.

### TOC e Six Sigma podem ser combinados?

Sim. A TOC escolhe o local, e o Six Sigma reduz a variação nele, por exemplo a sucata no constrangimento ou o fornecimento instável para o seu buffer. A contabilidade de throughput então mostra o efeito financeiro de cada projeto.

### Quais são os processos de pensamento da TOC?

Um conjunto de ferramentas lógicas para problemas não físicos: a árvore da realidade atual, a nuvem de conflito (evaporating cloud), a árvore da realidade futura, a árvore de pré-requisitos e a árvore de transição. Elas respondem o que mudar, para o que mudar e como causar a mudança [12].

### O que é gestão de projetos por corrente crítica?

É a aplicação da TOC a projetos feita por Goldratt, a partir de seu livro de 1997, *Critical Chain* [3]. Ela programa a cadeia mais longa de dependências de tarefas e recursos, remove a folga de cada tarefa individual e a concentra em buffers de projeto e de alimentação.

### O que é a teoria das restrições na gestão da cadeia de suprimentos?

Nas cadeias de suprimentos, a TOC substitui o estoque orientado por previsão em cada local por buffers reabastecidos conforme o consumo real e redimensionados pelo status do buffer [6]. Ela trata o elo mais fraco, muitas vezes um fornecedor, uma fábrica ou o mercado, como a restrição que define o ritmo de todo o sistema. A Seção 14 resume as regras de reposição.

### Quais são as críticas à teoria das restrições?

As principais críticas são o viés de publicação nos estudos de sucesso, a falta de otimalidade das heurísticas da TOC quando várias restrições interagem, a originalidade limitada de algumas ideias e a tendência a negligenciar pessoas e políticas [6][10]. A Seção 19 aborda cada uma delas.

### A teoria das restrições ainda é relevante?

Sim. As fábricas ainda têm restrições, e a combinação de dados de máquinas mais precisos, simulação e APS facilita encontrar gargalos que se deslocam e programar um drum. O que mudou é que a TOC raramente é usada isoladamente; geralmente ela é combinada com lean, Six Sigma e planejamento digital.

### Quem criou a teoria das restrições?

Eliyahu M. Goldratt (1947 a 2011), físico e autor de negócios israelense. Ele introduziu a TOC em *The Goal* (1984), escrito em coautoria com Jeff Cox [1][2].

### Quanto tempo leva para implementar a teoria das restrições?

Em uma fábrica ou fluxo de valor, os primeiros resultados mensuráveis geralmente vêm da exploração em poucas semanas, pois exigem pouco investimento. Uma rotina DBR ou S-DBR estável, com gestão de buffers, leva vários meses; o roteiro da Seção 16 prevê seis meses para o primeiro ciclo completo. Essas durações são premissas de planejamento, não referências de um estudo.

### Existe certificação em teoria das restrições?

A TOCICO oferece certificação em três níveis: exames de fundamentos, exames de praticante e uma avaliação de implementador, em áreas como operações, cadeia de suprimentos, gestão de projetos (CCPM), processos de pensamento e finanças [5].

## Conclusão e primeiros passos

A teoria das restrições parte de uma observação simples: a produção de uma fábrica é determinada por um número muito pequeno de restrições, normalmente uma só. Isso muda o que os gestores devem fazer. Em vez de melhorar tudo ao mesmo tempo, encontre a restrição, pare de desperdiçar o tempo dela, faça o resto da fábrica servi-la e gaste dinheiro somente quando isso estiver resolvido. O tambor-pulmão-corda transforma essa lógica em um programa, o gerenciamento de pulmões a transforma em prioridades diárias, e a contabilidade de throughput a transforma em decisões financeiras que os relatórios de custo padrão podem interpretar de forma errada.

O exemplo trabalhado mostra a escala do que costuma ser possível sem investimento: 22% a mais de tempo da restrição, obtidos com pausas, setups, preparação de material e verificações de qualidade, além de uma mudança no mix de produtos que o custeio padrão não teria sugerido. Ele também mostra os limites: uma vez explorada, a restrição se desloca, e as regras antigas passam a ser o próximo problema. A TOC é mais forte com uma restrição clara e precisa de outras ferramentas (otimização, APS, balanceamento de linha lean) quando as restrições se deslocam ou interagem. A base de evidências é composta principalmente por casos de sucesso, portanto teste as afirmações na sua própria fábrica.

**Seus primeiros passos nos próximos 30 dias**

- [ ] Construa uma tabela de carga para sua principal família de produtos (demanda × tempo de processo vs. tempo disponível) e identifique o candidato a restrição
- [ ] Confirme-o com contagens de fila e três caminhadas de gargalo por turno durante uma semana
- [ ] Inicie um registro de perdas da restrição (Modelo 2) no candidato e preencha-o a cada turno por duas semanas
- [ ] Calcule o throughput por minuto de restrição para seus 10 principais produtos (Modelo 3) com o seu controller
- [ ] Escolha as duas maiores perdas e atue sobre elas (cobertura de pausas, setup externo, qualidade antes da restrição)
- [ ] Interrompa pelo menos uma meta de utilização em um não gargalo
- [ ] Informe os representantes sindicais ou dos funcionários sobre as metas, a cobertura de pausas e o papel da capacidade ociosa
- [ ] Pergunte à TI se os dados das máquinas conseguem separar "faltando material" e "bloqueado" de "ociosa" para o método de período ativo
- [ ] Realize uma reunião diária de 10 minutos na restrição (Modelo 8)

---

## Leitura complementar no m365.fm

**Guias relacionados**
- [Programação da Produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Manufatura Enxuta](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Mapeamento do Fluxo de Valor](https://www.m365.fm/en/learn/value-stream-mapping/)
- [KPIs de Manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Excelência Operacional](https://www.m365.fm/en/learn/operational-excellence/)
- [Gestão do Chão de Fábrica e Gemba Walks](https://www.m365.fm/en/learn/shop-floor-management/)
- [Gêmeo Digital na Manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [TI de Manufatura com Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Planejamento de Produção Aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

**Novos guias desta série**
- [SMED e Redução de Troca de Ferramental](https://www.m365.fm/en/learn/smed-changeover-reduction/)
- [TPM e OEE](https://www.m365.fm/en/learn/tpm-oee/)
- [Kanban e Sistemas Puxados](https://www.m365.fm/en/learn/kanban-pull-system/)
- [Six Sigma e Análise de Causa Raiz](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/)
- [S&OP, MRP e Planejamento da Produção](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)
- [Manutenção Preditiva e IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/)
- [Simulação de Manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)
- [Dimensionamento de Lote](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Gestão de Estoques na Manufatura](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)

**Termos do glossário (entidades)**
[Teoria das restrições](https://www.m365.fm/entity/theory-of-constraints/) · [Programação baseada em restrições](https://www.m365.fm/entity/constraint-based-scheduling/) · [Gerenciamento de pulmões](https://www.m365.fm/entity/buffer-management/) · [Takt time](https://www.m365.fm/entity/takt-time/) · [Mapeamento do fluxo de valor](https://www.m365.fm/entity/value-stream-mapping/) · [SMED](https://www.m365.fm/entity/smed/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Sistema puxado](https://www.m365.fm/entity/pull-system/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** é o apresentador do m365.fm e trabalha na iFAKT GmbH. No m365.fm, ele escreve sobre manufatura enxuta, excelência operacional, planejamento da produção e a transformação digital da produção, com foco em como modelos de fluxo de valor, simulação e análise de KPIs ajudam as fábricas a identificar e gerenciar suas restrições.

**Nota: O autor trabalha na iFAKT GmbH.**

# Sources

All online sources accessed November 20, 2026. Sources marked (S) were taken over from the source list of the related guide *Production Scheduling and APS* (`production-scheduling-aps.md`), where they were verified on the same date; they could not be re-fetched in this session because the shared web search and fetch budget ran out.

1. Goldratt, Eliyahu M.; Cox, Jeff: The Goal: Excellence in Manufacturing. North River Press, Croton-on-Hudson (NY) 1984, 262 pp., ISBN 978-0-88427-060-7, LCCN 85021827. Catalog record: Open Library. https://openlibrary.org/books/OL2540561M/The_goal
2. North River Press: Eliyahu M. Goldratt, Renowned Business Guru and Author of International Best Selling Business Novel The Goal, Dies at Age 64. Press release via PR Newswire, June 14, 2011. https://prnewswire.com/news-releases/eliyahu-m-goldratt-renowned-business-guru-and-author-of-international-best-selling-business-novel-the-goal-dies-at-age-64-123796619.html
3. Eliyahu M. Goldratt (biography, Creative Output and OPT, Avraham Y. Goldratt Institute, bibliography with years). Wikipedia. https://en.wikipedia.org/wiki/Eliyahu_M._Goldratt
4. Theory of Constraints Institute: Five Focusing Steps. https://www.tocinstitute.org/five-focusing-steps.html (and the overview page https://www.tocinstitute.org/theory-of-constraints.html)
5. Theory of Constraints International Certification Organization (TOCICO): About us (501(c)(3) status, certification levels, TOC Innovation Summit). https://www.tocico.org/about-us
6. Theory of constraints (five focusing steps, buffers and buffer management, DBR and S-DBR, VATI, throughput accounting, critical chain, criticism section citing Trietsch, Linhares 2009, Noreen/Smith/Mackey 1995, Gupta/Snyder 2009, Nave 2002 and Goldratt 2009). Wikipedia. https://en.wikipedia.org/wiki/Theory_of_constraints
7. The Goal (novel) (editions, characters, Time 2011 list citing Rawlings, N.: The 25 Most Influential Business Management Books, Time, August 9, 2011). Wikipedia. https://en.wikipedia.org/wiki/The_Goal_(novel)
8. (S) Goldratt, Eliyahu M.; Fox, Robert E.: The Race. North River Press 1986, 179 pp., ISBN 0-88427-062-9. Reference: https://buresund.nu/books/the-race
9. (S) Cox, James F. III; Schleier, John G. (eds.): Theory of Constraints Handbook. McGraw-Hill, New York 2010, ISBN 978-0-07-166554-4; ch. 8: Srikanth, M. L.: DBR, Buffer Management, and VATI Flow Classification; ch. 9: From DBR to Simplified-DBR for Make-to-Order. Chapter reference: https://www.toc-goldratt.com/en/product/dbr-buffer-management-and-vati-flow-classification-chapter-8-of-the-theory-of-constraints-handbook
10. Mabin, Victoria J.; Balderstone, Steven J.: The performance of the theory of constraints methodology: Analysis and discussion of successful TOC applications. International Journal of Operations & Production Management 23 (2003) 6, pp. 568–595. DOI: 10.1108/01443570310476636. https://www.emeraldinsight.com/doi/abs/10.1108/01443570310476636
11. Panizzolo, Roberto: Theory of Constraints (TOC) Production and Manufacturing Performance. International Journal of Industrial Engineering and Management 7 (2016) 1, pp. 15–23. https://www.research.unipd.it/retrieve/e14fb26b-f0bc-3de1-e053-1705fe0ac030/ijiem_vol7_no1_3.pdf
12. Kim, Sanghyun; Mabin, Victoria J.; Davies, John: The theory of constraints thinking processes: retrospect and prospect. International Journal of Operations & Production Management 28 (2008) 2, pp. 155–184. DOI: 10.1108/01443570810846883
13. Roser, Christoph; Nakano, Masaru; Tanaka, Minoru: A Practical Bottleneck Detection Method. In: Peters, B. A.; Smith, J. S.; Medeiros, D. J.; Rohrer, M. W. (eds.): Proceedings of the 2001 Winter Simulation Conference, pp. 949–953. https://informs-sim.org/wsc01papers/126.PDF
14. Roser, Christoph; Nakano, Masaru; Tanaka, Minoru: Shifting Bottleneck Detection. In: Yücesan, E.; Chen, C.-H.; Snowdon, J. L.; Charnes, J. M. (eds.): Proceedings of the 2002 Winter Simulation Conference, pp. 1079–1086. https://www.informs-sim.org/wsc02papers/145.pdf
15. Roser, Christoph: Mathematically Accurate Bottleneck Detection 2 – The Active Period Method. AllAboutLean.com, June 29, 2014 (updated May 13, 2026). https://www.allaboutlean.com/active-period-method
16. Little, John D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (1961) 3, pp. 383–387. DOI: 10.1287/opre.9.3.383 (bibliographic data confirmed via Crossref, November 20, 2026)
17. (S) Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337
18. (S) Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57 (1961) 4, pp. 902–904. DOI: 10.1017/S0305004100036094
19. ACCA (Performance Management examining team): Throughput accounting and the theory of constraints, part 2. Association of Chartered Certified Accountants, technical article. https://www.accaglobal.com/us/en/student/exam-support-resources/fundamentals-exams-study-resources/f5/technical-articles/throughput-constraints2.html
20. Murphy, Sean: Summary of Goldratt, E. M.: The Haystack Syndrome: Sifting Information Out of the Data Ocean. North River Press, New York 1990. Management and Accounting Web (MAAW, J. R. Martin). https://maaw.info/ArticleSummaries/ArtSumHaystackSyndrome90.htm
21. Corbett, Thomas: Throughput Accounting. North River Press, 174 pp., ISBN 978-0-88427-158-1 (retailer listing dated January 1, 1999; publisher page: https://www.toc-goldratt.com/en/product/Throughput-Accounting). Listing: https://www.booktopia.com.au/throughput-accounting-thomas-corbett/book/9780884271581.html
22. Theory of Constraints (TOC): throughput accounting measures, derived measures and decision priority. Lean Production (Vorne Industries). https://www.leanproduction.com/theory-of-constraints/
23. (S) Spearman, Mark L.; Woodruff, David L.; Hopp, Wallace J.: CONWIP: a pull alternative to kanban. International Journal of Production Research 28 (1990) 5, pp. 879–894. DOI: 10.1080/00207549008942761
24. Gray, Virginia; Felan, Joe; Umble, Elisabeth; Umble, Michael: A comparison of drum-buffer-rope (DBR) and critical chain (CC) buffering techniques. Paper presented at PMI Research Conference 2000, Paris. Project Management Institute. https://www.pmi.org/learning/library/drum-buffer-rope-critical-chain-buffering-8526
25. Occupational Safety and Health Administration (OSHA): 29 CFR 1910.147, The control of hazardous energy (lockout/tagout). US Department of Labor. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147
26. iFAKT GmbH: Polaris Optimizer (vendor page; site navigation also lists Simulator and Value Stream Mapping). https://www.ifakt.de/en/solutions/optimizer
27. National Institute of Standards and Technology (NIST): Malcolm Baldrige National Quality Award 1988 recipient profile, Motorola Inc. ("Six Sigma Quality"). https://www.nist.gov/system/files/documents/2017/10/11/1988_Motorola_Inc.pdf
28. PwC Viewpoint: Inventory guide, section 1.3 Cost (definition of inventory cost as the sum of applicable expenditures and charges directly or indirectly incurred; references ASC 330-10-30-3 to 30-8). https://viewpoint.pwc.com/dt/us/en/pwc/accounting_guides/inventory/Inventory-Guide/Chapter-1-Inventory-costing/1_3_Cost.html (accessed November 20, 2026)
29. RSM US LLP: Inventory valuation considerations in the forecasted economy, April 2023 (fixed production overhead allocated based on normal capacity; ASC 330-10-30-6 on abnormally low production). https://rsmus.com/content/dam/rsm/insights/financial-reporting/1pdf/Inventory-valuation-considerations-in-the-forecasted-economy.pdf (accessed November 20, 2026)
