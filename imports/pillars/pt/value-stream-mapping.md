# SEO metadata

| Field | Value |
|---|---|
| Meta title | Mapeamento do Fluxo de Valor: Símbolos, Métricas e Exemplo |
| Meta description | Mapeamento do fluxo de valor (VSM) passo a passo: símbolos, takt time, fórmulas de lead time, exemplo calculado, desenho do estado futuro e software VSM. |
| Slug | `value-stream-mapping` |

# Mapeamento do Fluxo de Valor: O Guia Completo sobre Símbolos VSM, Métricas, Design do Estado Futuro e Gestão do Fluxo de Valor

> **Resposta curta:** O mapeamento do fluxo de valor (MFV, em alemão *Wertstromanalyse*) é um método Lean para desenhar o fluxo de materiais e de informações de uma família de produtos, do fornecedor até o cliente, em uma única página, com símbolos padronizados. Uma linha do tempo com lead time, tempo de processamento e dias de estoque mostra o quão pouco do tempo total agrega valor. Um mapa do estado futuro então projeta um fluxo mais enxuto, e um plano de implementação faz isso acontecer.

Em muitas fábricas, um pedido permanece na planta por três ou quatro semanas, enquanto o trabalho efetivo sobre ele soma apenas alguns minutos. A Wikipédia em alemão apresenta um caso típico: quatro semanas de lead time contra dez minutos de tempo de processamento puro [27]. Se você olha apenas máquinas individuais, nunca enxerga essa lacuna. O mapeamento do fluxo de valor obriga a olhar o fluxo como um todo: onde o material fica parado? Por que fica ali? Quem diz a cada processo o que produzir a seguir, e quando?

Este guia explica o método desde o início. Você recebe o conjunto completo de símbolos, um guia passo a passo, todas as métricas importantes com sua fórmula e um exemplo totalmente calculado, as diretrizes de projeto para o estado futuro, os limites do método em papel, o mapeamento do fluxo de valor dinâmico e digital, o Value Stream 4.0, a gestão do fluxo de valor como tarefa de liderança e uma visão neutra das categorias de software. Para uma definição compacta, consulte a página de entidade do m365.fm [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/).

Uma observação sobre as fontes: o mapeamento do fluxo de valor (em alemão: *Wertstromanalyse*) tem forte tradição de pesquisa na Alemanha, no Fraunhofer IPA e na TU Darmstadt, entre outros. Quando uma fonte alemã acrescenta algo que a literatura em inglês não contempla, ela permanece no texto com uma breve explicação.

### Principais conclusões

- O mapeamento do fluxo de valor sempre analisa uma **família de produtos** e todo o fluxo da porta de entrada à porta de saída, não máquinas isoladas ou departamentos.
- Você desenha **a partir do cliente, para trás**, em direção a montante, a lápis, no chão de fábrica, no gemba (japonês para "o lugar real", aqui o chão de produção).
- As métricas centrais são **takt time, cycle time, dias de estoque, lead time e a razão de fluxo** (também chamada eficiência do ciclo de processo ou razão de atividade). Os dias de estoque decorrem da Lei de Little: estoque dividido pela demanda.
- O mapa do estado atual é apenas metade do método. Os resultados vêm do **mapa do estado futuro**, construído com diretrizes de projeto claras, e de um **plano de implementação** com responsáveis e prazos.
- O mapa clássico é um **retrato instantâneo** baseado em médias. Com alta variedade de produtos e demanda volátil, a simulação dinâmica e a coleta automática de dados ampliam a análise.
- A **gestão do fluxo de valor** transforma uma oficina pontual em uma tarefa de liderança contínua, com um gestor do fluxo de valor responsável.

### Caminhos de leitura para leitores com pouco tempo

| Você é … | Leia primeiro |
|---|---|
| Novo em Lean, ou estudante | Seções 1 a 4 (definição, histórico, objetivos, símbolos) |
| Um facilitador de primeira viagem ou coach Lean | Seções 5 a 8 (guia passo a passo com pauta da oficina, métricas, exemplo e projeto do estado futuro) e 14 (erros comuns) |
| Um gerente de planta ou líder de operações | Seção 7 (exemplo com números do estado atual e futuro), seções 10 a 13 (limites, MFV dinâmico e digital, Value Stream 4.0, gestão do fluxo de valor) |
| Um responsável de TI, MES ou Microsoft 365/Azure | Seções 11 (MFV dinâmico e digital), 12 (Value Stream 4.0) e 15 (categorias de software) |

## Sumário

1. O que é Value Stream Mapping? Definição e como ele se diferencia do mapeamento de processos
2. História: do diagrama de fluxo de material e informação da Toyota ao "Learning to See"
3. Objetivos e benefícios do Value Stream Mapping
4. Símbolos do Value Stream Mapping: tabela de referência completa
5. Como criar um mapa de fluxo de valor: guia passo a passo para o estado atual
6. Métricas e fórmulas do Value Stream Mapping
7. Exemplo de Value Stream Mapping: um fluxo de valor totalmente calculado
8. Mapeamento do estado futuro: diretrizes de projeto de Rother/Shook e Erlach
9. Encontrando desperdício: os 8 desperdícios e o diagrama de espaguete
10. Limites do Value Stream Mapping tradicional
11. Value Stream Mapping dinâmico e digital
12. Value Stream 4.0: logística da informação como segunda dimensão
13. Value Stream Management: gerenciar o fluxo de valor como tarefa de liderança
14. Erros comuns no Value Stream Mapping e como evitá-los
15. Software de Value Stream Mapping: categorias comparadas
16. Value Stream Mapping digital com iFAKT Polaris VSM e BSM
17. Value Stream Management no desenvolvimento de software: como difere
18. Evidências e publicações de pesquisa
19. FAQ: perguntas frequentes sobre Value Stream Mapping
20. Conclusão

## 1. O que é Value Stream Mapping? Definição e como ele se diferencia do mapeamento de processos

O Lean Enterprise Institute (LEI) define value stream mapping como "diagramar cada etapa envolvida nos fluxos de material e de informação necessários para levar um produto do pedido até a entrega" [45]. A ASQ o descreve como "uma ferramenta lean que utiliza um fluxograma documentando cada etapa do processo" [46]. De forma mais precisa: para uma família de produtos, um mapa de fluxo de valor mostra todas as atividades necessárias para levar um produto da matéria-prima até o cliente. Isso inclui atividades que agregam valor e atividades que não agregam valor, o fluxo físico de material e o fluxo de informação que o controla. O resultado cabe em uma folha grande, geralmente de 11 × 17 pol. (tabloide, próximo ao formato A3 usado na Europa), e é desenhado com símbolos padronizados.

O **fluxo de valor** é o conjunto dessas atividades. Em inglês, "value stream mapping" e "VSM" são os termos padrão; "value stream analysis" também é usado, principalmente para o trabalho sobre o estado atual. Klaus Erlach, do Fraunhofer Institute for Manufacturing Engineering and Automation IPA em Stuttgart, faz uma distinção clara entre **análise do fluxo de valor** (registrar e avaliar o estado atual) e **projeto do fluxo de valor** (projetar o estado futuro) [3][4]. Juntas, formam o método do fluxo de valor. A associação alemã de engenharia industrial REFA define a análise em termos semelhantes, como um método para mostrar todos os processos e fluxos de um processo que agrega valor [37].

Desde março de 2020 existe uma norma internacional, a **ISO 22468:2020 "Value stream management (VSM)"**. A ISO a descreve como diretrizes para coletar, avaliar e melhorar continuamente dados do fluxo de valor e para avaliar fluxos de valor com KPIs definidos, aplicáveis a processos relacionados a material, energia e dados [40]. O sumário (publicado pela DIN, o órgão de normalização alemão) estrutura o gerenciamento do fluxo de valor em procedimento básico, análise do fluxo de valor, projeto do fluxo de valor, planejamento do fluxo de valor e avaliação e ajuste dos fluxos de valor, com um anexo informativo sobre caixas de dados e exemplos de aplicação [40]. A ISO confirmou a norma como vigente em sua revisão de 2025 [40]. É uma referência útil se você quiser ancorar o método em um sistema de produção de toda a empresa.

### Como o VSM difere de métodos relacionados

| Método | Foco | Diferença em relação ao value stream mapping |
|---|---|---|
| Mapeamento de processos / fluxograma | procedimentos individuais, muitas vezes em um departamento | sem fluxo de informação, sem estoque, sem linha do tempo |
| Análise de fluxo de material | rotas de transporte, quantidades, layout | analisa a logística, não como a informação controla o fluxo |
| Análise de valor / engenharia de valor (na Alemanha: VDI 2800) | funções e custo de um produto | relacionado ao produto, não ao fluxo |
| Cadeia de valor de Porter | atividades estratégicas de uma empresa | modelo de gestão, não um diagrama de fluxo operacional; a Wikipédia em inglês faz a mesma distinção [49] |
| Diagrama de raias / BPMN | processos de negócio com responsabilidades | forte no escritório, mais fraco em estoque e takt |
| Simulação | comportamento de um sistema ao longo do tempo | dinâmica e detalhada, mas com mais esforço; complementa o VSM (ver seção 11) |

O que torna o mapeamento do fluxo de valor diferente é a combinação de três elementos em uma única página: o fluxo de materiais, o fluxo de informações e uma linha do tempo. A introdução de *Learning to See* explica que a Toyota ensina três fluxos na manufatura (materiais, informações e pessoas/processos) e que o método de mapeamento cobre os dois primeiros, para que os fabricantes "pensem em fluxo em vez de processos de produção discretos" [1].

## 2. Histórico: Do Diagrama de Fluxo de Materiais e Informações da Toyota a "Learning to See"

O mapeamento do fluxo de valor vem do Sistema Toyota de Produção. Na Toyota, a ferramenta é chamada de "Mapeamento de Fluxo de Materiais e Informações". Os praticantes da Toyota a usavam para representar os estados atual e ideal ao planejar implementações do Lean, e não como ferramenta de treinamento [1]. A expressão "fluxo de valor" em si quase não é ouvida na Toyota [1]. O léxico do LEI também descreve a ferramenta como um desenvolvimento da Toyota, que a empresa chama de diagrama de fluxo de materiais e informações [45].

Mike Rother percebeu o método de mapeamento ao estudar as práticas de implementação do Lean na Toyota, formalizou-o e construiu em torno dele um método de treinamento [1]. Junto com John Shook, que havia passado onze anos na Toyota no Japão e nos EUA [1], ele publicou o caderno de exercícios **"Learning to See"** pelo LEI em 1998 (a introdução é assinada em Ann Arbor, Michigan, e datada de maio de 1998; o subtítulo da primeira edição era "Value Stream Mapping to Create Value and Eliminate Muda", e o atual é "… to Add Value and Eliminate Muda") [1]. O livro recebeu o Shingo Research and Professional Publication Award em 1999 [1]. Seu estudo de caso sobre a fictícia estamparia "Acme Stamping" conduz o leitor do estado atual, passando pela busca de desperdícios, até o estado futuro [1]. A edição atual do LEI é de 2018 (ISBN 978-0-9667843-0-5, 148 páginas) [1].

Nos países de língua alemã, três livros moldaram a disseminação do método; um deles apareceu posteriormente em inglês:

- **Rother/Shook: "Sehen lernen"**, a edição alemã do caderno do LEI, publicada pelo Lean Management Institut em Aachen (versão 1.1, 2004, ISBN 978-3-9809521-1-8) [2].
- **Klaus Erlach: "Wertstromdesign. Der Weg zur schlanken Fabrik"** (Springer; 1ª ed. 2007, 2ª ed. 2010, ISBN 978-3-540-89867-2; 3ª ed. 2020, ISBN 978-3-662-58906-9) [3]. Erlach sistematiza o método para o planejamento de fábricas. Uma edição em inglês, **"Value Stream Design: The Way Towards a Lean Factory"**, foi publicada pela Springer em 2012 (copyright 2013, ISBN 978-3-642-12568-3) [4].
- **Thomas Klevers: "Wertstrom-Mapping und Wertstrom-Design"** (mi-Fachverlag, Landsberg am Lech 2007, ISBN 978-3-636-03097-9) [5].

O método foi posteriormente transferido para o trabalho administrativo e do conhecimento, sobretudo por Karen Martin e Mike Osterling em "Value Stream Mapping: How to Visualize Work and Align Leadership for Organizational Transformation" (McGraw-Hill, publicado em outubro de 2013, copyright 2014, ISBN 978-0-07-182891-8) [6].

Nos EUA, o método faz parte do conjunto-padrão de ferramentas do Lean ensinado pelo LEI, pela ASQ e pelo NIST Manufacturing Extension Partnership (MEP). O NIST MEP chama o VSM de "frequentemente o primeiro passo na aplicação de melhorias de processo lean" [47]. Na Alemanha, ele faz parte dos chamados sistemas holísticos de produção, cujos fundamentos são descritos na diretriz **VDI 2870 Parte 1** (julho de 2012), da Associação de Engenheiros Alemães (VDI). Segundo a VDI, a diretriz ainda é parcialmente válida e está em revisão [7].

## 3. Objetivos e benefícios do Value Stream Mapping

O objetivo geral é um fluxo alinhado ao cliente: o material deve percorrer a fábrica com o mínimo possível de espera, e cada processo deve produzir apenas o que o processo seguinte realmente precisa. Isso leva a metas concretas:

- **Reduzir o lead time.** A linha do tempo mostra quanto do lead time total é espera. Como o estoque geralmente responde pela maior parte do lead time, reduzi-lo é a alavanca mais forte.
- **Tornar os desperdícios visíveis.** Superprodução, estoque, espera e transporte desnecessário aparecem diretamente no mapa.
- **Simplificar o planejamento de produção.** O mapa mostra em quantos pontos o sistema ERP envia ordens. O objetivo é programar em um único ponto sempre que possível.
- **Criar uma linguagem comum.** Produção, logística, planejamento e vendas discutem o mesmo fluxo na mesma página.
- **Priorizar melhorias.** Em vez de otimização local, obtém-se um plano de implementação voltado ao fluxo inteiro.

### Quando vale a pena fazer o value stream mapping?

O método se adapta melhor à produção repetitiva e de mix misto, com produtos recorrentes, alto estoque e prazos de entrega longos; antes de mudanças de layout, novos projetos de fábrica ou investimentos em capacidade; quando a entrega no prazo é ruim apesar de alta utilização; e como ponto de partida de um programa Lean. A forma clássica se adapta menos bem à produção sob encomenda (job shop) ou de engenharia sob encomenda, com roteiros variáveis, porque uma família de produtos estável é difícil de definir nesses casos. Abordagens estendidas, como simulação ou análise orientada a dados, ajudam nessas situações (ver seção 11). Pequenos e médios fabricantes dos EUA que desejam facilitação externa podem recorrer aos NIST MEP Centers, que incluem o value stream mapping entre os métodos Lean que ajudam a aplicar [47].

### Prós e contras em resumo

| Prós | Contras |
|---|---|
| visão de ponta a ponta do fluxo, na perspectiva do cliente | retrato baseado em médias |
| símbolos simples e padronizados | pouco detalhe sobre variantes e sequências de troca |
| baixa barreira de entrada: papel, lápis, cronômetro | a coleta manual de dados consome tempo e fica defasada rapidamente |
| resultados quantitativos (lead time, índice de fluxo) | variabilidade, paradas e efeitos do tamanho de lote não são mostrados |
| conecta o fluxo de material e o fluxo de informação | estados futuros não podem ser testados no papel |
| base sólida para ações de melhoria e comunicação | o impacto depende de uma implementação disciplinada |

A coluna da direita é a razão pela qual a pesquisa e a indústria vêm estendendo o método em direções dinâmicas e digitais há mais de dez anos [16][23]. Mais sobre isso a partir da seção 10.

## 4. Símbolos do Mapeamento do Fluxo de Valor: Tabela de Referência Completa

Os símbolos remontam a *Learning to See* [1][2] e são deliberadamente simples, para que qualquer pessoa possa desenhá-los com lápis. Livros e bibliotecas de software diferem um pouco. O que importa é que sua equipe concorde com uma legenda e a use de forma consistente. As tabelas abaixo descrevem os símbolos comuns, conforme usados por Rother/Shook e Erlach [1][3].

### Símbolos de fluxo de processo e material

| Símbolo (aparência) | Nome | Significado e uso |
|---|---|---|
| prédio de fábrica com telhado em dente de serra | cliente / fornecedor (fonte externa) | cliente no canto superior direito, fornecedor no canto superior esquerdo; abaixo, uma caixa de dados com demanda, frequência de entrega e embalagem |
| retângulo com uma linha de cabeçalho e o nome do processo | caixa de processo | um processo pelo qual o material flui continuamente; uma nova caixa começa onde o fluxo para e o estoque se acumula |
| retângulo abaixo da caixa de processo | caixa de dados | dados do processo: tempo de ciclo, tempo de troca, tempo de funcionamento/disponibilidade, tamanho do lote, número de operadores, turnos, sucata |
| triângulo com um "I" | estoque | material entre dois processos; a quantidade e os dias de estoque são escritos abaixo dele |
| seta larga listrada | seta de empurrar | o material é empurrado pelo processo a montante conforme o próprio cronograma, e não conforme as necessidades do processo seguinte |
| seta larga vazada | embarque | matéria-prima do fornecedor para a fábrica, ou produtos acabados da fábrica para o cliente |
| caminhão (ou trem, avião, navio) | transporte externo | meio de transporte com frequência de entrega, por exemplo "2× por semana" |
| prateleira aberta à esquerda | supermercado | estoque de segurança controlado, do qual o processo cliente retira material; o processo fornecedor apenas repõe o que foi retirado |
| seta circular | retirada (puxar) | retirada física do supermercado pelo processo a jusante |
| seta com "FIFO" e uma quantidade máxima | faixa FIFO | fila limitada entre dois processos; as peças seguem a ordem de chegada, e o processo fornecedor para quando o máximo é atingido |
| triângulo com uma nota de segurança | estoque de segurança ou de amortecimento | estoque contra flutuações da demanda (amortecimento) ou paradas de processo (segurança) |
| círculo com a cabeça de um operador | operador | número de pessoas em um processo |

### Símbolos de fluxo de informação

| Símbolo (aparência) | Nome | Significado e uso |
|---|---|---|
| seta fina e reta | fluxo de informação manual | informação em papel ou verbal, por exemplo ordem de roteiro, nota de entrega, instrução verbal |
| seta em forma de raio (zigue-zague) | fluxo de informação eletrônico | mensagens EDI, ERP ou MES, e-mail |
| retângulo "Controle da Produção" | controle da produção | planejamento, MRP ou ERP, frequentemente com a frequência de planejamento |
| cartão com canto cortado, sólido | kanban de produção | sinal para um processo fabricar uma quantidade definida |
| cartão com canto cortado, hachurado ou marcado de outra forma conforme a biblioteca | kanban de retirada | instrução para um operador de movimentação buscar peças no supermercado |
| triângulo apoiado na ponta | kanban de sinal | dispara um lote quando o estoque do supermercado atinge o ponto de reposição; típico de processos com trocas de ferramental |
| símbolo semelhante a uma caixa de correio | posto de kanban | local onde os kanbans são recolhidos para retirada |
| seta tracejada com kanban | trajeto do kanban | rota dos cartões de volta ao processo fornecedor |
| caixa com grade de compartimentos "OXOX" | caixa heijunka (caixa de nivelamento de carga) | ferramenta para nivelar volume e mix no processo marca-passo |
| óculos | programação por inspeção visual | programação por verificação visual em vez de sinais sistemáticos; sinal de que é necessária melhoria |

### Símbolos gerais

| Símbolo (aparência) | Nome | Significado e uso |
|---|---|---|
| explosão irregular ("kaizen burst") | necessidade de melhoria | marca um ponto no mapa do estado atual ou futuro em que é necessária melhoria |
| onda quadrada ao longo da parte inferior | linha do tempo (escada de lead time) | tempos de espera (dias de estoque) em um nível, tempos de processamento no outro; totais de lead time e tempo de processamento à direita |

Alguns guias online descrevem a seta tracejada como fluxo de informação eletrônico [38]. Em *Learning to See*, a seta em forma de raio representa a informação eletrônica, e a seta fina e reta representa a informação manual [1]. Mantenha essa convenção para que os mapas continuem legíveis entre fábricas e ferramentas de software. Uma explicação ilustrada dos símbolos está no post [Value Stream Mapping Symbols and Icons Explained](https://www.m365.fm/community/u/mirko-p/blog/value-stream-mapping-symbols-icons/).

Para processos de escritório, como o tratamento de pedidos antes da produção, o Polaris BSM acrescenta raias de BPMN aos símbolos de fluxo de valor [30]. A pesquisa adotou a mesma ideia: a abordagem Value Stream Mapping 4.0 da TU Darmstadt inclui explicitamente todos os departamentos de tratamento de pedidos, a partir do primeiro contato com o cliente [14].

## 5. Como criar um mapa do fluxo de valor: guia passo a passo para o estado atual

O guia abaixo segue a lógica de Rother/Shook e Erlach [1][3] e acrescenta detalhes práticos. Para um primeiro mapa de um fluxo de valor gerenciável, planeje um a dois dias com uma pequena equipe [unverified: duração estimada com base em experiência prática, não em estudo]. As recomendações sobre o tamanho da equipe divergem: a ASQ considera ideal cerca de 10 membros e sugere um evento kaizen de três dias para o arranque [46], enquanto um guia alemão de prática da Mind Logistik prefere uma equipe pequena de até seis pessoas [42]. Ambas são recomendações de prática, não resultados de pesquisa. Escolha a equipe menor se o fluxo de valor for curto e a maior se muitos departamentos estiverem envolvidos.

> **Se você for facilitar pela primeira vez: uma agenda comprovada**
>
> - **Equipe:** pessoas da produção (supervisor ou líder de turno), logística, planejamento da produção, manutenção e qualidade; acrescente vendas ou gestão de pedidos se o prazo de entrega for o problema. O futuro responsável pelo fluxo de valor participa.
> - **Materiais:** papel 11 × 17 pol. ou rolo de papel pardo, lápis e borracha, prancheta, cronômetro, planilha de contagem de estoque e uma legenda de símbolos acordada antecipadamente.
> - **Esclareça antecipadamente:** família de produtos, demanda do cliente nos últimos meses, padrão de turnos e pausas. Anuncie a caminhada nas áreas afetadas e explique que se avaliam processos, não pessoas.
> - **Dia 1:** introdução ao objetivo e aos símbolos (cerca de uma hora), percorrer o fluxo de trás para frente, em duplas, a partir da expedição; unir os dados em um único mapa; calcular os indicadores.
> - **Dia 2 ou sessão de acompanhamento:** validar o mapa com as áreas, acrescentar kaizen bursts, responder às questões do estado futuro (seção 8) e iniciar o plano de implementação com responsáveis definidos.
>
> Duração e composição da equipe são valores de experiência e dependem do tamanho do fluxo de valor [unverified: valores de experiência, sem comprovação em estudo].

### Passo 1: Defina o objetivo e o escopo

Antes da primeira caminhada, decida qual pergunta o mapa deve responder. Exemplos: por que nosso prazo de entrega é de 15 dias quando o cliente espera 5? Quanto espaço de chão de fábrica ganhamos ao reduzir o estoque? Defina os limites. O escopo usual é "porta a porta", do recebimento à expedição dentro de uma única fábrica [1]. Um fluxo de valor que abranja várias fábricas ou fornecedores (fluxo de valor estendido) é o segundo passo, não o primeiro.

Nomeie também um responsável. Rother/Shook recomendam atribuir a responsabilidade pelo fluxo de valor a uma única pessoa, o gestor do fluxo de valor, em vez de dividi-la entre departamentos. A LEI define esse papel como "um indivíduo designado com responsabilidade clara pelo sucesso de um fluxo de valor" [10]. Mais sobre isso na seção 13.

### Passo 2: Defina a família de produtos

Uma família de produtos é um grupo de produtos que passam por etapas de processamento semelhantes em equipamentos compartilhados. A ferramenta para isso é a **matriz produto-processo**: produtos ou variantes nas linhas, processos nas colunas. Produtos que têm majoritariamente as mesmas marcações formam uma família. A ASQ sugere procurar produtos que compartilhem cerca de 80% de suas etapas [46]. Como regra prática, o conteúdo de trabalho dos produtos de uma mesma família não deve diferir muito [unverified: regra prática sem fonte de pesquisa]. A Wikipédia em alemão ressalta que os fluxos de valor são formados ao longo de cadeias de processos ou fluxos de material, e que dividi-los por função é incomum porque vai contra prazos de entrega curtos [27].

Para o seu primeiro mapa, escolha uma família com alta participação na receita ou um problema urgente. Uma análise de Pareto (ABC) por volume e receita ajuda.

### Passo 3: Capture a demanda do cliente

Comece o mapa no canto superior direito com o símbolo do cliente. Na caixa de dados, anote a demanda (por exemplo, peças por mês), o mix de variantes, o tamanho do lote ou a quantidade por embalagem, a frequência de entrega e o prazo de entrega exigido. A partir da demanda e do tempo de trabalho disponível, calcule o **takt time** (fórmula na seção 6). O takt time é a referência para todas as demais avaliações.

### Passo 4: Percorra o processo no gemba, de trás para frente, a partir da expedição

Percorra o fluxo na direção contrária, da expedição ao recebimento. Rother/Shook explicam que, dessa forma, você começa pelos processos mais próximos do cliente, que devem definir o ritmo [1]. A Wikipédia em alemão também descreve o registro de trás para frente, a partir do cliente, passando pelo produtor até o fornecedor [27].

Desenhe uma caixa de processo para cada seção em que o material flui continuamente. Onde o material fica parado, termina uma caixa de processo e começa um triângulo de estoque. Use suas próprias observações e um cronômetro, não dados do ERP. O sistema ERP conhece os tempos padrão das roteirizações, não o que realmente acontece na estação de trabalho.

### Passo 5: Preencha as caixas de dados

Registre pelo menos os seguintes dados para cada processo:

| Campo de dados | Abreviação | Explicação |
|---|---|---|
| Tempo de ciclo | C/T | tempo entre duas peças boas consecutivas na saída do processo |
| Tempo de processamento (tempo de agregação de valor) | P/T, VA | tempo durante o qual o trabalho efetivamente agrega valor à peça |
| Tempo de troca | C/O | tempo entre a última peça boa do lote antigo e a primeira peça boa do lote novo |
| Tempo de atividade / disponibilidade | | parcela do tempo planejado em que o equipamento realmente consegue produzir; defina se as trocas são incluídas ou registradas separadamente |
| Tamanho do lote / EPEI | | peças por lote, ou "every part every interval" (cada peça a cada intervalo): com que frequência cada variante é produzida |
| Operadores | | número de pessoas por turno |
| Turnos | | número de turnos e tempo disponível por turno após as pausas |
| Sucata / retrabalho | | parcela de peças defeituosas |

Para processos com várias máquinas em paralelo, anote o número de máquinas e calcule o tempo de ciclo efetivo do processo (tempo de ciclo por máquina dividido pelo número de máquinas).

### Passo 6: Contar o estoque

Conte o estoque no chão de fábrica, não no sistema. Anote a quantidade sob cada triângulo de estoque e converta-a em **dias de estoque**, usando a demanda diária. Conte também o estoque que "não aparece": peças em áreas de espera, em carrinhos, nos cantos de retrabalho. É frequentemente aí que se esconde a maior parte do tempo de espera.

### Passo 7: Adicione os fluxos de material externos

No canto superior esquerdo, desenhe o principal fornecedor (ou os fornecedores das matérias-primas mais importantes) e conecte fornecedor, recebimento, expedição e cliente com símbolos de caminhão e as frequências de entrega.

### Passo 8: Desenhe o fluxo de informação

O fluxo de informação é a parte que as equipes mais costumam negligenciar, embora explique por que o material fica parado. Pergunte em cada processo: como este processo sabe o que produzir em seguida? Respostas típicas são um cronograma semanal do ERP, uma lista diária do supervisor, um kanban, um grito do outro lado do corredor, ou "o que estiver ali". Desenhe o controle da produção no centro superior, conecte cliente e fornecedor com setas eletrônicas ou manuais e mostre qual informação chega a cada processo. Onde um processo recebe vários sinais ou cronogramas por observação visual, acrescente os óculos para programação go-see.

Em seguida, marque os fluxos de material entre processos como empurrado (seta listrada), FIFO ou puxado (supermercado e retirada).

### Passo 9: Desenhe a linha do tempo e calcule as métricas

A linha do tempo fica abaixo dos processos. Em um nível, registre os dias de estoque; no outro, os tempos de processamento dos processos. À direita, some ambos para obter o **lead time** e o **tempo de processamento** e calcule a **razão de fluxo**. Em fluxos de valor ramificados, o caminho mais longo determina o lead time [41].

### Passo 10: Marque os desperdícios e valide

Marque os problemas com explosões kaizen: processos com tempos de ciclo acima do takt, estoque elevado, trocas longas, baixa disponibilidade, múltiplos pontos de programação. Revise o mapa final com os funcionários das áreas afetadas. A validação pelas pessoas do chão de fábrica impede que a equipe de oficina desenhe um fluxo de valor que não existe na planta.

### Checklist do estado atual

- [ ] Objetivo, escopo e responsável pelo fluxo de valor definidos
- [ ] Família de produtos definida com uma matriz produto-processo
- [ ] Demanda do cliente, variantes e takt time determinados
- [ ] Todos os processos registrados no chão de fábrica e em sentido inverso
- [ ] Caixas de dados preenchidas com valores medidos
- [ ] Estoque contado e convertido em dias
- [ ] Fornecedores, cliente e transporte desenhados
- [ ] Fluxo de informação esclarecido para cada processo
- [ ] Linha do tempo, lead time, tempo de processamento e razão de fluxo calculados
- [ ] Explosões kaizen adicionadas e mapa validado com os funcionários

## 6. Métricas e fórmulas do mapeamento do fluxo de valor

As métricas tornam os mapas do fluxo de valor comparáveis. Na ZWF (Zeitschrift für wirtschaftlichen Fabrikbetrieb, uma revista alemã de engenharia de produção publicada pela De Gruyter), Jörg Drees e Christoph Sack mostram que métricas do fluxo de valor, como redução de estoque, utilização de recursos, capacidade de entrega e lead times curtos, parecem perseguir objetivos conflitantes mas, aplicadas corretamente, produzem recomendações consistentes. Eles propõem um conjunto central de métricas que, junto com métodos Lean direcionados, formam ciclos de controle [19]. As fórmulas abaixo cobrem esse conjunto central. Mais definições estão nas páginas de entidades [Lead Time](https://www.m365.fm/entity/lead-time/), [Cycle Time](https://www.m365.fm/entity/cycle-time/) e [Takt Time](https://www.m365.fm/entity/takt-time/).

**Uma nota sobre terminologia.** Os guias dos EUA usam vários nomes para a mesma razão. O que os textos alemães chamam de *Flussgrad* aparece em inglês como flow ratio, process cycle efficiency (PCE), value-added ratio, flow efficiency ou, na terminologia de Karen Martin, activity ratio ("a soma dos tempos de processo de todas as etapas individuais dividida pelo Total Lead Time") [44]. Este guia usa **flow ratio** em todo o texto. Da mesma forma, "inventory days", "days of supply" e "days of inventory" significam a mesma coisa.

### Takt time

> **Takt time = tempo de trabalho disponível por período ÷ demanda do cliente por período**

A LEI dá o exemplo de uma fábrica de widgets que opera 480 minutos por dia enquanto os clientes demandam 240 widgets por dia, o que resulta em um takt time de dois minutos [8]. A ASQ aplica a mesma fórmula com 22.000 segundos e 200 peças, o que resulta em 110 segundos por peça [46]. O tempo de trabalho disponível é o tempo do turno menos as pausas planejadas. Paradas não planejadas não são subtraídas; elas pertencem à disponibilidade. A palavra "takt" é alemã (significa batida ou pulso, como na música). Segundo a LEI, o takt foi usado pela primeira vez como ferramenta de gestão da produção na indústria aeronáutica alemã nos anos 1930 e foi amplamente adotado na Toyota nos anos 1950 [8].

### Cycle time e effective cycle time

Cycle time é o tempo entre duas peças boas na saída de um processo. Para compará-lo com o takt time, considere a disponibilidade e a sucata:

> **Effective cycle time = cycle time ÷ (disponibilidade × first-pass yield)**

Um processo com cycle time de 98 segundos e 85% de disponibilidade produz efetivamente uma peça a cada 115 segundos. Frente a um takt time de 117 segundos, ele está quase totalmente carregado, mesmo que o cycle time nominal sugira 16% de folga.

Atenção a uma confusão comum: alguns guias em inglês usam "cycle time" para o tempo total que uma unidade passa no processo, ou até para o prazo de entrega do fornecedor. Em um mapa do fluxo de valor, cycle time sempre significa o intervalo entre duas peças boas na saída de um processo.

### Inventory days e a Lei de Little

> **Inventory days = estoque (peças) ÷ demanda diária (peças por dia)**

A Wikipédia em alemão calcula 280 peças com demanda diária de 80 peças como 3,5 dias de estoque [27]. Esse cálculo aplica a **Lei de Little**, que John D. C. Little demonstrou em 1961 na revista Operations Research [12]:

> **L = λ × W**, reorganizada: **W = L ÷ λ**

L é o estoque médio no sistema, λ a taxa média de vazão e W o tempo médio no sistema. Aplicado a um fluxo de valor: o tempo médio que uma peça espera em um buffer é igual ao estoque dividido pela taxa de consumo. A Lei de Little vale para sistemas estáveis no longo prazo. Para dias isolados com picos de demanda, ou para um sistema durante o ramp-up, a fórmula é apenas uma aproximação. Essa é uma das razões para o mapeamento dinâmico do fluxo de valor (seção 11).

### Lead time

> **Lead time de produção = Σ inventory days + Σ tempos de processamento (ao longo do caminho mais longo)**

Como os tempos de processamento costumam ser medidos em segundos ou minutos e o estoque em dias, a soma dos inventory days domina o resultado. Uma tese de diploma na Hochschule Mittweida (uma universidade alemã de ciências aplicadas) resume a definição de Erlach para o lead time de produção como a soma dos tempos de processamento e dos tempos de processo mais as faixas de estoque, sendo decisivo o caminho mais longo [41]. O glossário de Martin formula de maneira mais geral: lead time é igual ao tempo de processo mais o tempo de espera [44].

### Processing time e process time

**Tempo de processamento** é o tempo durante o qual a peça está sendo trabalhada. Erlach também distingue **tempo de processo** para etapas como secagem, cura ou tratamento térmico, que consomem tempo sem que ninguém trabalhe na peça [41]. Ambos entram no cálculo da razão de fluxo.

### Razão de fluxo (eficiência de ciclo de processo)

> **Razão de fluxo = (tempo de processamento + tempo de processo) ÷ lead time × 100%**

A Wikipedia em alemão descreve a razão de fluxo como a parcela do tempo de processamento puro no lead time total e a chama de métrica-chave da análise de fluxo de valor [27]. Atenção à base de tempo. Se o lead time for informado em dias úteis, converta-o em segundos usando o tempo de trabalho diário, como faz a fórmula de Erlach com seu fator de "tempo de trabalho diário" [41]. Se você calcular em dias corridos, a razão de fluxo cai ainda mais. Escolha uma convenção e mantenha-a, ou os estados atual e futuro não serão comparáveis.

### Outras métricas

| Métrica | Fórmula / definição | Uso |
|---|---|---|
| Carga em relação ao takt | tempo de ciclo efetivo ÷ tempo takt | valores acima de 100% indicam um gargalo |
| Número de operadores necessários | Σ conteúdo de trabalho ÷ tempo takt | base para o balanceamento de linha |
| EPEI | tempo até que cada variante tenha sido produzida uma vez | mostra flexibilidade e efeitos do tamanho de lote |
| Parcela de troca de ferramental | (número de trocas × tempo de troca) ÷ tempo disponível | mostra quanta capacidade fica livre para lotes menores |
| Carga incluindo trocas | (demanda diária × tempo de ciclo + trocas × tempo de troca) ÷ (tempo disponível × disponibilidade) | verifica se um estado futuro com lotes pequenos ainda atende ao takt (exemplo na seção 7) |
| Entrega no prazo | pedidos entregues no prazo ÷ todos os pedidos | métrica de resultado sob a ótica do cliente |
| %C&A (percentual completo e correto) | parcela do trabalho que a etapa seguinte recebe completo e sem erros | qualidade das transferências; usada principalmente em fluxos de valor administrativos [44] |
| OEE | disponibilidade × desempenho × qualidade | eficácia dos equipamentos; a caixa de dados costuma reduzi-lo para uptime |

Um gráfico de balanceamento de operadores (um gráfico de barras dos tempos de ciclo efetivos com uma linha horizontal para o tempo takt) torna visíveis, de relance, os gargalos e o excesso de capacidade. Erlach o usa para mostrar o quanto a capacidade está alinhada ao takt [3]. A Wikipedia em alemão observa que tempos de ciclo próximos ao takt apontam para gargalos, e tempos de ciclo bem abaixo do takt apontam para excesso de capacidade e desperdício [27].

## 7. Exemplo de Mapeamento do Fluxo de Valor: Um Fluxo de Valor Completamente Calculado

O exemplo a seguir é **fictício e elaborado para este guia**. Ele mostra como as métricas se conectam e executa o estado atual e o estado futuro com os mesmos dados de base.

### Ponto de partida

Um fornecedor fabrica uma família de produtos de carcaças de válvulas hidráulicas em cinco variantes com o mesmo roteiro: serragem, torneamento, fresamento, lavagem, montagem. O cliente faz chamadas de entrega de uma média de 9.200 peças por mês, distribuídas em 20 dias úteis. A fábrica opera com dois turnos de 8 horas, cada um com uma pausa de 30 minutos.

**Passo A: Calcular o tempo takt**

- Demanda diária: 9.200 peças ÷ 20 dias = **460 peças por dia**
- Tempo de trabalho disponível: 2 × (480 min − 30 min) = 900 min = **54.000 s por dia**
- Tempo takt: 54.000 s ÷ 460 peças = **117,4 s por peça**

### Estado atual: dados do processo

| Processo | Tempo de ciclo | Tempo de troca | Disponibilidade | Tempo de ciclo efetivo | Carga vs. takt |
|---|---|---|---|---|---|
| Serragem | 45 s | 30 min | 95% | 47,4 s | 40% |
| Torneamento | 98 s | 60 min | 85% | 115,3 s | 98% |
| Fresamento | 125 s | 45 min | 90% | 138,9 s | **118%** |
| Lavagem | 40 s | 0 min | 98% | 40,8 s | 35% |
| Montagem | 105 s | 15 min | 95% | 110,5 s | 94% |

Simplificações: o tempo de processamento é igual ao tempo de ciclo aqui porque cada processo trabalha em uma peça após a outra. A sucata é ignorada. A disponibilidade cobre apenas as paradas por falha; as trocas são tratadas separadamente.

**Constatação do gargalo:** O fresamento já está acima do takt com um tempo nominal de 125 s e, com 138,9 s efetivos, está 18% acima. Em um dia, o fresamento produz 54.000 s × 0,90 ÷ 125 s = **389 peças** em vez das 460 necessárias. As trocas reduzem ainda mais esse número. A fábrica fecha a lacuna com turnos extras de sábado. O torneamento parece não crítico no papel (98 s), mas fica com carga de 98% quando a disponibilidade é incluída. Se você ignorar a disponibilidade, deixa passar este segundo quase gargalo.

### Estado atual: estoque e linha do tempo

| Estoque | Quantidade | Dias de estoque (quantidade ÷ 460) |
|---|---|---|
| Matéria-prima antes da serragem | 4.600 peças | 10,0 dias |
| Após a serragem | 1.380 peças | 3,0 dias |
| Após o torneamento | 920 peças | 2,0 dias |
| Após o fresamento | 690 peças | 1,5 dia |
| Após a lavagem | 460 peças | 1,0 dia |
| Produtos acabados | 1.150 peças | 2,5 dias |
| **Total** | **9.200 peças** | **20,0 dias** |

- **Tempo de processamento:** 45 + 98 + 125 + 40 + 105 = **413 s** (pouco menos de 7 minutos)
- **Lead time:** 20,0 dias úteis + 413 s ≈ **20 dias úteis**
- **Índice de fluxo (base em tempo de trabalho):** 413 s ÷ (20 × 54.000 s) = 413 ÷ 1.080.000 = **0,038%**
- **Índice de fluxo (base em calendário):** 20 dias úteis correspondem a cerca de 28 dias corridos; 413 s ÷ (28 × 86.400 s) = **0,017%**

**Verificação de plausibilidade com a Lei de Little:** estoque total de 9.200 peças ÷ vazão de 460 peças por dia = 20 dias [12]. A soma dos dias de estoque individuais e o cálculo geral coincidem. Se essa verificação não fechar no seu mapa, você ou deixou de contabilizar algum estoque ou misturou valores de referência.

**Constatação sobre o fluxo de informação:** O planejamento da produção envia um cronograma semanal para os cinco processos. Cada processo produz segundo o seu próprio cronograma e empurra o material adiante. Não há limite de quantidade entre os processos, e por isso o estoque se acumula diante do gargalo. O supervisor da montagem intervém diariamente com pedidos urgentes (programação por observação direta, *go-see scheduling*).

### Estado futuro: ações de melhoria

Com base nas diretrizes de projeto da seção 8, a equipe desenha este estado futuro:

1. **Eliminar o gargalo da fresagem:** melhorias em ferramentas e dispositivos de fixação reduzem o tempo de ciclo de 125 para 95 s; uma iniciativa de TPM (total productive maintenance, manutenção produtiva total, manutenção preventiva com participação dos operadores) eleva a disponibilidade de 90 para 95%.
2. **Estabilizar o torneamento:** a otimização do programa reduz o tempo de ciclo de 98 para 90 s; o TPM eleva a disponibilidade de 85 para 92%.
3. **Balancear a montagem:** o conteúdo de trabalho é redistribuído, e o tempo de ciclo cai de 105 para 95 s.
4. **Reduzir os tempos de troca (SMED):** como todas as variantes serão produzidas todos os dias, cada processo precisa de cinco trocas por dia. O SMED (single-minute exchange of die: preparação da troca com a máquina ainda em operação) reduz o tempo de troca no torneamento de 60 para 10 min, na fresagem de 45 para 10 min e na montagem de 15 para 5 min. Sem esta etapa, o estado futuro não seria viável: cinco trocas de 60 minutos cada não cabem na capacidade livre do torneamento.
5. **Ligações FIFO:** torneamento, fresagem, lavagem e montagem são conectados por três linhas FIFO com quantidades máximas de 60, 30 e 30 peças.
6. **Supermercado após o corte:** como o corte é muito mais rápido e precisa trocar de setup, um supermercado com meio dia de estoque (230 peças) o desacopla. Um kanban de sinalização dispara novos lotes.
7. **Montagem como processo puxador:** o planejamento envia os pedidos de clientes somente à montagem. Uma caixa heijunka distribui uniformemente as cinco variantes ao longo do dia. Com uma quantidade de embalagem de 20 peças, o pitch é 20 × 117,4 s ≈ 39 minutos.
8. **Supermercado de produtos acabados:** um dia de estoque (460 peças) amortece as flutuações nas solicitações de entrega dos clientes.
9. **Vínculo com fornecedores:** as entregas de matéria-prima aumentam de uma para duas vezes por semana; o estoque de matéria-prima cai para cinco dias (2.300 peças).

### Estado futuro: verificação de capacidade com trocas

Um estado futuro deve atender ao takt time mesmo com trocas diárias. A verificação calcula, portanto, dois valores: o tempo de ciclo efetivo em comparação com o takt e a carga incluindo as trocas.

> **Carga incluindo trocas = (demanda diária × tempo de ciclo + trocas × tempo de troca) ÷ (tempo disponível × disponibilidade)**

| Processo | Tempo de ciclo | Tempo de troca | Disponibilidade | Tempo de ciclo efetivo | Carga vs. takt | Carga incl. 5 trocas |
|---|---|---|---|---|---|---|
| Corte | 45 s | 30 min | 95% | 47,4 s | 40% | 58% |
| Torneamento | 90 s | 10 min | 92% | 97,8 s | 83% | 89% |
| Fresagem | 95 s | 10 min | 95% | 100,0 s | 85% | **91%** |
| Lavagem | 40 s | 0 min | 98% | 40,8 s | 35% | 35% |
| Montagem | 95 s | 5 min | 95% | 100,0 s | 85% | 88% |

Cálculo para a fresagem: (460 × 95 s + 5 × 600 s) ÷ (54.000 s × 0,95) = 46.700 ÷ 51.300 = 91%. Todos os processos permanecem abaixo de 100%, com o valor mais alto na fresagem. O processo puxador, a montagem, tem alguma reserva para flutuações nas solicitações de entrega, com 88%.

### Estado futuro: resultado

| Métrica | Atual | Futuro | Variação |
|---|---|---|---|
| Estoque total | 9.200 peças | 2.300 + 230 + 120 + 460 = 3.110 peças | −66% |
| Lead time (Little) | 20,0 dias úteis | 3.110 ÷ 460 = 6,8 dias úteis | −66% |
| Tempo de processamento | 413 s | 45 + 90 + 95 + 40 + 95 = 365 s | −12% |
| Razão de fluxo (base de tempo de trabalho) | 0,038% | 365 ÷ (6,76 × 54.000) = 0,100% | fator 2,6 |
| Gargalo | fresagem 118% (sem trocas) | maior carga na fresagem 91% incl. trocas | takt atendido sem turnos de sábado |
| Pontos de programação | 5 (programação semanal para todos) | 1 (montagem como processo puxador) | planejamento mais simples |

As linhas FIFO são contabilizadas em suas quantidades máximas (60 + 30 + 30 = 120 peças). Na operação, raramente estão cheias; portanto, o estoque futuro é um limite superior conservador.

Duas lições do exemplo. Primeiro, as medidas de programação e de estoque entregam a maior parte da redução do lead time, e não máquinas mais rápidas. O tempo de processamento cai 12%; o lead time, 66%. Segundo, mesmo a razão de fluxo melhorada de 0,1% ainda é baixa. Isso é típico de fábricas com um buffer de matéria-prima. O que importa é a direção e um takt time que possa ser atendido de forma confiável mesmo com trocas diárias.

## 8. Mapeamento do Estado Futuro: Diretrizes de Projeto de Rother/Shook e Erlach

O projeto do estado futuro responde à pergunta de como o fluxo de valor deve fluir. *Learning to See* leva o leitor do estado atual até um "mapa de um estado futuro mais enxuto" e até um plano de fluxo de valor que orienta a implementação e é revisado regularmente [1].

### Perguntas-chave para o estado futuro segundo Rother/Shook

Rother/Shook estruturam o projeto por meio de uma série de perguntas-chave [1] (parafraseadas):

1. Qual é o takt time?
2. Produzimos para um supermercado de produtos acabados ou diretamente para a expedição?
3. Onde podemos usar fluxo contínuo?
4. Onde precisamos de sistemas puxados por supermercado?
5. Em qual único ponto da cadeia produtiva (o processo marcapasso) programamos a produção?
6. Como nivelamos o mix de produção no processo marcapasso?
7. Qual incremento de trabalho liberamos e retiramos de forma consistente no marcapasso?
8. Quais melhorias de processo são necessárias para que o estado futuro funcione?

### As diretrizes de Rother e Shook

Em um artigo para o Lean Post do LEI (19 de outubro de 2022), Mike Rother e John Shook resumem as diretrizes para um fluxo de valor enxuto da seguinte forma [11]:

| Nº | Diretriz (redação original) | O que significa |
|---|---|---|
| 1 | "Produce to your takt time" | alinhar a produção com a demanda do cliente |
| 2 | "Develop continuous flow wherever possible" | criar fluxo de uma peça por vez sempre que possível |
| 3 | "Use supermarkets to control production where continuous flow does not extend upstream" | usar supermercados onde o fluxo não é possível |
| 4 | "Try to send the customer schedule only to one production process" | enviar os pedidos do cliente a apenas um processo (o marcapasso) |
| 5 | "Distribute the production of different products evenly over a set time at the pacemaker process" | nivelar o mix de produtos no marcapasso (heijunka) |
| 6 | "Create an 'initial pull' by releasing and withdrawing small, consistent increments of work at the pacemaker process" | nivelar o volume de produção |

Fontes secundárias citam uma sétima diretriz de *Learning to See*: a capacidade de fabricar toda peça todo dia nos processos a montante do marcapasso ("every part every day"), e depois a cada turno ou a cada hora [1] [unverified: não verificado no texto do livro]. O exemplo da seção 7 mostra por que essa diretriz exige tempos de troca curtos.

### As diretrizes de projeto de Erlach

Klaus Erlach organiza o projeto do fluxo de valor em oito diretrizes de projeto que se complementam [3]. Elas se dividem em três grupos: projeto dos processos produtivos (diretrizes 1 e 2), controle da produção (3 a 5) e planejamento da produção (6 a 8). Os nomes abaixo seguem o livro alemão de Erlach e a visão geral em seu site; a edição em inglês (Springer 2012/2013) é descrita por sua editora como apresentando "ten design guidelines" [4], portanto a numeração pode diferir no texto em inglês.

| Nº | Diretriz de projeto [3] | Pergunta-chave para o seu fluxo de valor |
|---|---|---|
| 1 | Alinhamento com o takt time | Todos os processos são projetados para atender o takt time de forma confiável, e onde há supercapacidade? |
| 2 | Integração de processos | Quais etapas de processo podem ser combinadas física e organizacionalmente em fluxo contínuo? |
| 3 | Acoplamento FIFO | Onde os processos podem ser ligados por faixas FIFO limitadas em vez de estoques ilimitados? |
| 4 | Controle kanban | Onde é necessário um supermercado com kanban porque os processos têm tempos de ciclo ou trocas diferentes? |
| 5 | Processo marcapasso | Em qual único processo os pedidos do cliente são programados? |
| 6 | Definição da unidade de liberação | Em qual incremento de tempo o trabalho é liberado no marcapasso (pitch)? |
| 7 | Nivelamento do mix de produção | Como as variantes são distribuídas de forma uniforme, e onde faz sentido formar campanhas? |
| 8 | Controle de gargalo | Como um gargalo remanescente é controlado para que nunca fique ocioso? |

A ordem segue a lógica dos três grupos: um mix de produção nivelado (diretriz 7) pressupõe que os processos estejam alinhados ao takt e que o controle por FIFO, kanban e marcapasso funcione (diretrizes 1 a 5).

### Termos do estado futuro em resumo

- **Fluxo contínuo (one-piece flow):** as peças se movem uma a uma de um processo para o seguinte, sem armazenamento intermediário.
- **Supermercado e kanban:** o processo a jusante retira, e o processo fornecedor repõe apenas o que foi retirado. Mais informações nas páginas de entidade [Kanban](https://www.m365.fm/entity/kanban/) e [Pull System](https://www.m365.fm/entity/pull-system/).
- **Faixa FIFO:** uma fila com quantidade máxima; quando está cheia, o processo fornecedor para. FIFO é mais simples que kanban e adequado para peças de alta variedade que não devem ser produzidas para estoque.
- **Processo marca-passo (pacemaker):** o único processo que recebe pedidos de clientes. Os processos a montante são controlados por puxada de supermercado ou faixas FIFO; os processos a jusante operam em fluxo contínuo ou FIFO.
- **Heijunka:** nivelamento de volume e mix, por exemplo com uma caixa heijunka que tem um espaço por incremento de tempo.
- **Pitch / unidade de liberação:** o incremento de tempo em que o trabalho é liberado e os produtos acabados são retirados: tempo takt × quantidade da embalagem; no exemplo da seção 7, 20 × 117,4 s ≈ 39 minutos.
- **SMED e TPM:** o SMED reduz os tempos de troca ao preparar o trabalho de troca enquanto a máquina ainda está em operação; o TPM eleva a disponibilidade por meio da manutenção preventiva. Ambos costumam ser pré-requisitos para um estado futuro com lotes pequenos.

### Do estado futuro ao plano de implementação

Um estado futuro sem plano é apenas um belo cartaz. Divida o estado futuro em **ciclos de fluxo de valor**: o ciclo do processo marca-passo (do marca-passo até o cliente) e os ciclos a montante até cada supermercado. Cada ciclo recebe metas, ações, responsáveis e datas. Rother e Shook recomendam começar pelo ciclo do marca-passo porque ele está mais próximo do cliente [unverified: não confirmado na fonte]. Planeje em ciclos de alguns meses e revise o progresso com regularidade, por exemplo em uma revisão mensal do fluxo de valor.

A valoração é um obstáculo comum. Busch, Niehues e Maassen descrevem na ZWF que a indústria frequentemente deixa de realizar o potencial do fluxo de valor porque o benefício é mal quantificado. Eles estendem o método de fluxo de valor com um modelo de valoração baseado em custos que relaciona indicadores operacionais e estratégicos [25]. Para o seu plano de implementação, isso significa: traduza a redução de estoque, a área de piso liberada e a redução do lead time em valores monetários antes de solicitar o orçamento.

## 9. Identificando o desperdício: os 8 desperdícios e o diagrama de espaguete

O mapeamento do fluxo de valor é uma ferramenta para identificar desperdício (em japonês: muda). A classificação dos sete desperdícios remonta a Taiichi Ohno [9][32]; a LEI os lista como superprodução, espera, transporte, processamento, estoque, movimentação e correção [9]. Jeffrey Liker acrescentou um oitavo em "The Toyota Way" (2004): criatividade e habilidades dos colaboradores não utilizadas [33]. Nos EUA, os oito costumam ser ensinados com o acrônimo DOWNTIME: defeitos, superprodução, espera, talento não utilizado, transporte, estoque, movimentação e processamento extra [51]. Uma visão resumida está na página de entidade [Eight Wastes](https://www.m365.fm/entity/eight-wastes/).

| Nº | Desperdício | Como identificá-lo no mapa do fluxo de valor |
|---|---|---|
| 1 | Superprodução | setas de empurrar, lotes grandes, estoque após processos rápidos; segundo a LEI, "a pior forma de desperdício, pois contribui para os outros seis" [9] |
| 2 | Espera | operadores esperam por máquinas, material ou aprovações; carga baixa em relação ao takt |
| 3 | Transporte | muitas setas de caminhão e transporte, armazenamento intermediário entre processos |
| 4 | Superprocessamento | etapas de processo sem valor para o cliente, inspeções duplicadas |
| 5 | Estoque | triângulos de estoque com muitos dias, supermercados sem quantidades máximas |
| 6 | Movimentação | longas caminhadas dos colaboradores, busca de peças e ferramentas (melhor visualizado em um diagrama de espaguete) |
| 7 | Defeitos / correção | sucata e retrabalho no quadro de dados, setas de fluxo de retorno |
| 8 | Talento não utilizado | agendamento de go-see, ausência de envolvimento na elaboração do mapa, nenhuma sugestão de melhoria |

### O diagrama de espaguete como complemento

O mapa do fluxo de valor mostra o fluxo em nível abstrato. Ele não mostra o quanto peças e pessoas realmente percorrem. É para isso que serve o **diagrama de espaguete**: em uma planta baixa em escala, traça-se com uma caneta cada trajeto de uma peça ou de uma pessoa. O resultado costuma parecer um prato de espaguete e torna visíveis, ao mesmo tempo, os desperdícios de transporte e de movimentação. A LEI relata o caso da Thrustmaster of Texas, fabricante sediada em Houston de equipamentos de propulsão marítima, em que um diagrama de espaguete da área de montagem dos propulsores revelou mais de sete milhas de caminhada e quase 10 horas de tempo sem valor agregado por unidade; após um redesenho do layout focado em fluxo e trabalho padronizado, a empresa relatou 100% de entregas no prazo 18 meses depois [43]. Use o diagrama de espaguete após o mapa do fluxo de valor para os processos com os kaizen bursts mais evidentes. Detalhes na página de entidade [Spaghetti Diagram](https://www.m365.fm/entity/spaghetti-diagram/).

## 10. Limites do Mapeamento do Fluxo de Valor Tradicional

O mapeamento do fluxo de valor em papel é simples por design. Essa simplicidade é sua força e também seu limite. A literatura discute principalmente cinco fraquezas.

**1. Fotografia instantânea.** O mapa mostra o estado de um dia ou de uma semana. Na ZWF, Lugert e Winkler observam que o caráter estático do mapeamento do fluxo de valor se torna um problema crescente diante das megatendências atuais da produção, e defendem uma gestão dinâmica do fluxo de valor [23]. O Fraunhofer IPA questiona se fotografias isoladas bastam para analisar um processo produtivo por completo [22].

**2. Médias em vez de distribuições.** As caixas de dados guardam médias. Tempos de ciclo oscilantes, paradas de máquina e picos de demanda desaparecem na média. A Lei de Little vale para a média de longo prazo de sistemas estáveis [12], mas nada diz sobre a dispersão de pedidos individuais.

**3. Variedade de produtos.** Já em 2011, Drees e Sack apontavam cadeias de valor mais complexas, número crescente de variantes de produto e flutuações cotidianas de demanda [19]. Com centenas de variantes e roteiros diferentes, torna-se quase impossível formar uma família de produtos com tempos de ciclo uniformes.

**4. Coleta manual de dados.** Segundo o Fraunhofer IPA, dados anotados em pranchetas e médias estimadas são menos atualizados, precisos e completos do que dados coletados digitalmente [22]. Em muitas empresas, os dados para o mapeamento do fluxo de valor são coletados manualmente e apenas como fotografia instantânea [21]. O esforço faz com que os mapas raramente sejam atualizados.

**5. Nenhum teste do estado futuro.** Se faixas FIFO de 30 peças são suficientes, ou se um supermercado fica vazio durante picos de demanda, isso não pode ser verificado no papel. Türck, Weimer, Schubert e Drees (iFAKT GmbH) perguntam, por isso, que novas oportunidades de otimização surgem quando o fator tempo é considerado [16].

Existe ainda uma lacuna de conteúdo: o método clássico melhora principalmente o fluxo de materiais. O fluxo de informações é desenhado, mas dificilmente avaliado. É aí que entra o Value Stream Mapping 4.0 (seção 12) [13][15].

## 11. Mapeamento do Fluxo de Valor Dinâmico e Digital

O método está evoluindo em dois eixos: **dinâmico** (simulação do comportamento no tempo e da variabilidade) e **digital** (coleta automática de dados e cálculo contínuo de métricas). Ambos os eixos complementam o método clássico; nenhum deles o substitui.

### Do mapa estático à simulação

Já em 2014, Stefan Türck, Andreas Weimer, Lars Schubert e Jörg Drees, da iFAKT GmbH, descreveram na ZWF o caminho da análise estática dos fluxos de valor e de suas métricas até a **simulação dinâmica** [16]. O ponto de partida deles era que a modelagem do fluxo de valor já está estabelecida em muitas empresas de manufatura e que as ferramentas digitais para isso ganham aceitação [16]. O mapeamento dinâmico do fluxo de valor pergunta não apenas qual é o estoque médio, mas como ele evolui ao longo do tempo quando os pedidos oscilam, as máquinas quebram ou as sequências de troca de ferramental mudam.

Na prática, o mapa do fluxo de valor torna-se um modelo em que cada símbolo tem comportamento. Um processo deixa de ter um tempo de ciclo fixo e passa a ter uma distribuição; um supermercado tem um ponto de reposição e um máximo; a demanda do cliente segue uma série temporal. A simulação mostra se o estado futuro funciona em condições realistas, onde os buffers são pequenos demais e qual distribuição de lead time esperar. Mais sobre simulação de fábrica em geral na página da entidade [Factory Simulation](https://www.m365.fm/entity/factory-simulation/).

### Comparação: mapeamento do fluxo de valor estático vs. dinâmico

| Critério | VSM estático (clássico) | VSM dinâmico / simulação |
|---|---|---|
| Base de dados | médias de uma única coleta no local | distribuições, séries temporais, dados de eventos |
| Referência temporal | fotografia instantânea | evolução ao longo de dias, semanas, meses |
| Variedade de produtos | família de produtos com valores uniformes | variantes com roteiros e sequências de troca próprios |
| Variabilidade e paradas | não representadas | modeladas por meio de distribuições e perfis de falhas |
| Métricas | lead time, razão de fluxo, dias de estoque como valores únicos | além disso, dispersão, percentis, carga ao longo do tempo |
| Teste do estado futuro | não possível, apenas julgamento de especialistas | cenários comparáveis antes da implementação |
| Esforço | baixo: papel e cronômetro | maior: modelagem e manutenção de dados |
| Ferramentas | papel, quadro branco, software de diagramação | software VSM especializado com vínculo a simulação, suítes de simulação |
| Ponto forte | compreensão, comunicação, engajamento | redução de riscos em investimentos e dimensionamento de buffers |
| Uso típico | introdução, oficina, treinamento em Lean | planejamento de fábrica, produção de alto mix, decisões de capacidade |

### Mapeamento digital do fluxo de valor: dados da fábrica em vez da prancheta

O segundo eixo é a coleta de dados. Na ZWF, Christian Urnauer mostra como a **mineração de processos** (process mining) pode derivar processos, suas ligações e métricas de desempenho a partir de carimbos de tempo da produção, dando ao mapeamento do fluxo de valor uma perspectiva orientada por dados [24].

O Fraunhofer IPA segue um caminho semelhante sob o lema "estamos automatizando a caminhada gemba": da captura digital de dados no chão de fábrica até métricas de fluxo de valor visualizadas, com análises atuais, métricas consistentes baseadas em dados e integração simples de KPIs de consumo de energia e pegada de carbono [22]. Fabricantes dos EUA também têm uma referência pública para o lado ambiental: o Lean & Environment Toolkit da EPA recomenda selecionar "um ou dois indicadores de desempenho ambiental a medir para cada processo do fluxo de valor", como a quantidade de resíduos perigosos por turno, e registrá-los nas caixas de processo ao lado do tempo de ciclo e da disponibilidade [48].

Em termos da ISA-95 (ANSI/ISA-95, conhecida internacionalmente como IEC 62264), os dados de um fluxo de valor digital vêm dos sistemas de negócio do Nível 4, como ERP, dos sistemas de operações de manufatura do Nível 3, como MES, e dos sistemas de controle e sensores do Nível 2 [50]. Essa estrutura em camadas ajuda ao discutir com a TI qual sistema fornece quais campos de dados para cada caixa.

Um exemplo concreto é o projeto de pesquisa **ECOWERT** ("análise do fluxo de valor orientada a tempo real para otimização de produção sustentável"), do Fraunhofer IPA e da iFAKT GmbH. Ele foi executado de 1º de setembro de 2021 a 31 de agosto de 2022, teve volume de €500.000 e foi financiado pelo estado alemão de Baden-Württemberg por meio do programa Invest BW [20]. O objetivo era uma análise do fluxo de valor que coletasse automaticamente dados de ERP, MES, máquinas e sensores, os atualizasse continuamente e acrescentasse dados energéticos do fluxo de valor [20]. Jörg Drees e Steffi Stambera (iFAKT) e Markus Böhm (Fraunhofer IPA) descrevem a arquitetura: os dados brutos seguem por um gateway IIoT e por MQTT (com a especificação de payload Sparkplug) até um banco de dados de séries temporais e são avaliados pelo software Polaris VSM. A conclusão deles: o resultado é uma abordagem capaz de produzir análises do fluxo de valor quase em tempo real, e a adaptação de máquinas com sensores simples já basta para gerar os dados [21].

Para reutilizar esses dados, Böhm, Drees, Sai, Erlach, Stambera e Teriete desenvolveram uma **interface de dados universal para serviços digitais de fluxo de valor**. Eles tratam os eventos do chão de fábrica como dados brutos estruturados para serviços de otimização e padronizam o fluxo de dados para que os serviços se conectem por meio de uma única interface. Um serviço de cálculo e visualização de métricas foi conectado no projeto ECOWERT [18]. Os autores incluem Klaus Erlach (Fraunhofer IPA), autor da obra de referência sobre projeto de fluxo de valor [18][3].

### Do fluxo de valor digital ao gêmeo digital

Quando o mapa do fluxo de valor é atualizado continuamente a partir de dados em tempo real e acoplado a um modelo de simulação, ele se torna um bloco de construção de um gêmeo digital da produção. A Siemens, por exemplo, oferece um complemento VSM Library para o Plant Simulation X que permite aos usuários "executar simulações dinâmicas de fluxos de valor" e "criar e comparar múltiplos cenários", como os estados atual e futuro [35]. Mais sobre o conceito na página de entidade [Digital Twin](https://www.m365.fm/entity/digital-twin/) e no guia [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/).

Como um fluxo de valor funciona como um modelo de dados vivo também é discutido no episódio do m365.fm [Value Stream Mapping with a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/).

**Ressalva importante:** a digitalização não corrige um fluxo ruim. A TU Darmstadt recomenda explicitamente estabelecer primeiro um fluxo enxuto e estável, com o desenho clássico do fluxo de valor, e só então tratar as melhorias digitais. Ela desaconselha digitalizar processos complexos antes que estejam estáveis [14].

## 12. Value Stream 4.0: Logística da Informação como Segunda Dimensão

O **Value Stream Mapping 4.0** foi desenvolvido no Institute of Production Management, Technology and Machine Tools (PTW) da TU Darmstadt, na Alemanha. Tobias Meudt, Joachim Metternich e Eberhard Abele o apresentaram em 2017 no CIRP Annals, sob o título "Value stream mapping 4.0: Holistic examination of value stream and information logistics in production" [13]. Um livro em inglês se seguiu: "Value Stream 4.0: A Systems View of Information Flow for Digitalization", de Metternich, Meudt e Hartmann (CRC Press, lançado em julho de 2025, copyright 2026) [15].

A ideia central: ao lado do fluxo de materiais, a **logística da informação** é analisada de forma sistemática. A informação deve estar disponível no momento certo, no lugar certo, na quantidade e qualidade certas, com o mínimo possível de desperdício [14]. Segundo o guia "Industrie 4.0 trifft Lean" (Indústria 4.0 encontra o Lean), da Associação Alemã da Indústria de Máquinas e Equipamentos (VDMA), desenvolvido cientificamente por Metternich, Meudt e Hartmann, o método inclui estes elementos [14]:

- **Escopo ampliado:** desde o primeiro contato com o cliente até o uso do produto, abrangendo todos os departamentos que tratam pedidos.
- **Caixas de processo estendidas:** com fontes de informação, intervalos de registro, tipo de registro (automatizado, semiautomatizado, manual) e valores atuais.
- **Meios de armazenamento como linhas:** papel, ERP, MES, Excel e outros meios de armazenamento são desenhados como linhas horizontais e conectados às fontes por linhas verticais.
- **Oito tipos de desperdício da logística da informação**, organizados ao longo do ciclo de vida dos dados: na criação e transferência (seleção de dados, qualidade dos dados, captura de dados, transferência de dados), no processamento e armazenamento (espera e estoque de informações; transporte, movimentação e busca) e no uso (análise de dados, apoio à decisão).
- **Métricas:** disponibilidade da informação, uso da informação e grau de digitalização.

No exemplo de um fabricante de máquinas especiais, a análise encontrou doze meios de armazenamento em uso, entrada manual e duplicada de dados, e um grau de digitalização e de uso de dados de zero por cento em cada caso [14].

Bega e colegas estenderam o Value Stream Mapping 4.0 em 2023 no periódico Production Engineering, para a identificação abrangente de fluxos de dados e informações [26]. Isso mostra que o Value Stream 4.0 não é um método acabado, mas um campo de pesquisa ativo.

Em 2018, Jörg Drees adotou uma visão relacionada, a partir da perspectiva de um fornecedor de software, na ZWF, sob o título "Wertstrom Management 4.0: Next Generation": a crescente interconexão de informações pela Indústria 4.0 e pela internet industrial das coisas (IIoT) cria novas expectativas, e o método e o software precisam se adaptar às novas formas de organizar e controlar a cadeia de valor [17].

## 13. Gestão do Fluxo de Valor: Conduzir o Fluxo de Valor como uma Função de Liderança

Um projeto de mapeamento do fluxo de valor tem início e fim. A **gestão do fluxo de valor** é contínua. Significa liderar um fluxo de valor através das fronteiras departamentais a longo prazo, com atualizações regulares do mapa, metas no nível do fluxo de valor e responsabilidades claramente definidas. Uma introdução detalhada está no artigo [What Is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/).

Lugert e Winkler defendem que soluções técnicas da Indústria 4.0, por si só, não bastam para transformar o mapeamento estático do fluxo de valor em uma abordagem gerencial dinâmica. Organização e pessoas devem ser consideradas igualmente [23]. A ISO 22468:2020 reflete esse ciclo em sua estrutura: análise, projeto, planejamento, avaliação e ajuste dos fluxos de valor [40].

### O ciclo da gestão do fluxo de valor

1. **Analisar:** registrar o estado atual, idealmente com dados coletados automaticamente.
2. **Projetar:** desenhar o estado futuro usando as diretrizes de projeto, idealmente validado por simulação.
3. **Planejar:** plano de implementação por ciclo do fluxo de valor, com metas e responsáveis.
4. **Implementar:** ações em eventos kaizen e no trabalho diário.
5. **Avaliar:** acompanhar indicadores continuamente e valorar o impacto em dinheiro [25].
6. **Ajustar:** atualizar o mapa e derivar o próximo estado futuro.

### O papel do gerente do fluxo de valor

A LEI descreve o gerente do fluxo de valor como "um indivíduo com responsabilidade clara pelo sucesso de um fluxo de valor". Essa pessoa identifica o valor na perspectiva do cliente, projeta o fluxo de valor e impulsiona em direção a um fluxo cada vez mais rápido. Como o dinheiro, os ativos e as pessoas normalmente estão sob os departamentos funcionais, o gerente do fluxo de valor "lidera pela influência, não pela posição". A LEI cita o engenheiro-chefe da Toyota como modelo para o papel [10].

Na prática, o gerente do fluxo de valor normalmente:

- é responsável pelos mapas do estado atual e futuro e pelo plano de implementação
- facilita a revisão regular do fluxo de valor
- acompanha os indicadores do fluxo de valor (lead time, estoque, entrega no prazo, produtividade)
- resolve conflitos de metas entre departamentos
- encaminha os obstáculos à gerência da planta

O artigo [Value Stream Manager: Role and Responsibilities](https://www.m365.fm/community/u/mirko-p/blog/value-stream-manager-role-responsibilities/) descreve em detalhes o perfil, a autoridade e as armadilhas típicas do papel. Como a gestão do fluxo de valor é apoiada por software na manufatura está coberto em [Value Stream Management Software in Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/).

A gestão do fluxo de valor está intimamente ligada à [gestão Lean](https://www.m365.fm/entity/lean-management/) como um todo; veja os guias [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) e [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/). As rotinas diárias que mantêm vivo um estado futuro, como reuniões em níveis hierárquicos e gemba walks, são o tema do guia [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

## 14. Erros comuns no Mapeamento do Fluxo de Valor e como evitá-los

| Erro | Consequência | Contramedida |
|---|---|---|
| mapear na mesa a partir de dados do ERP | o mapa mostra tempos padrão, não a realidade | registrar no gemba com cronômetro e contagens |
| família de produtos não definida | o mapa fica carregado e não pode ser avaliado | matriz produto-processo antes da primeira caminhada |
| detalhe excessivo | a equipe da oficina se perde em passos isolados | desenhar uma caixa de processo somente onde o fluxo para |
| fluxo de informação deixado de fora | a causa do estoque permanece obscura | perguntar em cada processo: como ele sabe o que produzir? |
| disponibilidade não incluída | gargalos passam despercebidos | comparar o tempo de ciclo efetivo com o takt time |
| apenas estado atual, sem estado futuro | análise sem impacto | projeto do estado futuro e plano de implementação são obrigatórios |
| estado futuro como imagem ideal sem plano | frustração, nada acontece | ciclos do fluxo de valor com metas, responsáveis e prazos |
| colaboradores não envolvidos | resistência, dados errados | validar o mapa junto com as áreas |
| projeto pontual sem responsável | o mapa fica desatualizado em poucas semanas | nomear um gestor do fluxo de valor e definir um ritmo de revisão |
| digitalizar antes de estabilizar | o desperdício é automatizado | estabilizar primeiro o fluxo, depois digitalizar [14] |
| bases de tempo diferentes para estado atual e futuro | índices de fluxo não comparáveis | fixar a convenção (dias úteis ou dias corridos) uma única vez |

## 15. Software de Mapeamento do Fluxo de Valor: categorias comparadas

Quem pesquisa por "software de mapeamento do fluxo de valor" quer, em sua maioria, saber qual ferramenta se encaixa, quais recursos ela deve ter e se existem opções gratuitas. Em vez de um ranking de produtos individuais, ajuda uma divisão por categorias, pois as ferramentas diferem menos no desenho do que no que acontece depois do desenho.

| Categoria | Exemplos típicos | Pontos fortes | Limites | Melhor para |
|---|---|---|---|---|
| Papel e quadro branco | papel pardo, notas adesivas, lápis | máximo envolvimento, não exige habilidades com ferramentas, gratuito | sem cálculo, difícil de compartilhar e versionar | primeiro mapa no gemba, treinamento |
| Software de diagramação geral e quadro branco | Microsoft Visio, Lucidchart, Miro, EdrawMax | bibliotecas de símbolos, colaboração, muitas vezes com níveis de entrada gratuitos | indicadores em geral manuais, sem lógica por trás dos símbolos | documentação, equipes distribuídas |
| Software VSM especializado com cálculo de indicadores | iFAKT Polaris VSM, SimVSM (SimPlan), visTable | símbolos com fórmulas integradas, linha do tempo automática, comparação de variantes e cenários | custos de licença, curva de aprendizado | trabalho regular com fluxo de valor, gestão do fluxo de valor |
| Software VSM com link para simulação | SimVSM Pro [34], Plant Simulation X com VSM Library [35] | análise dinâmica, teste do estado futuro | mais esforço de modelagem e de dados | produção de alto mix, decisões de investimento |
| Análise orientada a dados / process mining | ONIQ [36], abordagens de pesquisa como ECOWERT [20] | indicadores a partir de dados de produção, análise contínua em vez de pontual | qualidade dos dados e integração de TI são decisivas | fábricas com base de dados MES/ERP |
| Plataformas de gestão do fluxo de valor (entrega de software) | plataformas conforme a definição de mercado da Gartner [31] | medição de ponta a ponta da cadeia de entrega de software | não projetadas para produção física | organizações de TI e de software |

Leia as afirmações dos fornecedores de forma crítica. A ONIQ, por exemplo, afirma que a automação reduz o esforço da análise do fluxo de valor em até 90% [36]; nenhuma metodologia independente foi publicada. A SimPlan descreve o SimVSM como abrangendo registro digital e indicadores estáticos, com o SimVSM Pro acrescentando parâmetros dinâmicos e uma interface com simulação [34].

### Critérios de seleção

- **Símbolos:** A ferramenta oferece suporte aos símbolos comuns de Rother/Shook e é possível adicionar símbolos próprios?
- **Lógica de cálculo:** Takt time, dias de estoque, lead time e índice de fluxo são calculados automaticamente? As fórmulas são transparentes e ajustáveis?
- **Cenários:** É possível versionar e comparar os estados atual, futuro e intermediários?
- **Dinâmica:** Existe uma função de simulação ou um vínculo com uma ferramenta de simulação?
- **Conexão de dados:** A ferramenta pode começar sem conexão com ERP ou MES e assumir os dados automaticamente depois?
- **Implementação:** Ações, kaizen bursts e responsáveis são gerenciados na mesma ferramenta?
- **Colaboração e operação:** funções e permissões, multi-tenancy, nuvem ou instalação local, integração ao cenário de TI existente (para fábricas baseadas em Microsoft, veja o guia [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)).
- **Custo:** modelo de licenciamento, versão de teste, esforço de treinamento.

Uma boa pergunta de verificação: a ferramenta apenas ajuda a documentar o estado atual ou também apoia a condução do estado futuro enquanto a fábrica muda semana após semana?

## 16. Mapeamento digital do fluxo de valor com iFAKT Polaris VSM e BSM

> **Nota: O autor trabalha na iFAKT GmbH.**

A [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), com sede em Stuttgart, Alemanha, foi fundada em 2001, segundo a própria empresa [19]. Funcionários da empresa escreveram vários dos artigos da ZWF sobre mapeamento dinâmico e digital do fluxo de valor citados neste guia (visão geral na seção 18, "Publicações de pesquisa"). A família de software [iFAKT Polaris](https://www.m365.fm/entity/polaris/) surgiu desse trabalho; um guia separado está disponível em [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/). Dois módulos são relevantes para o mapeamento do fluxo de valor:

**[Polaris VSM](https://www.m365.fm/entity/polaris-vsm/)** é uma ferramenta digital de gestão Lean que fabricantes usam para mapear cadeias de suprimentos e fluxos de valor. De acordo com a publicação da Microsoft sobre sua listagem no AppSource, métricas podem ser calculadas, verificadas e visualizadas por meio de um sistema de fórmulas, complementadas por quadros Kanban e Kaizen e colaboração de qualquer local [29]. No ifakt.de, o fornecedor lista estas funções [28]:

- mapas do fluxo de valor com arrastar e soltar, símbolos padrão e hierarquias de vários níveis
- métricas automáticas como lead time, cycle time, índice de valor agregado e OEE em dashboards, com relatórios prontos para exportação
- cenários ilimitados, análise de sensibilidade, histórico de versões com reversão e comparação lado a lado de métricas
- permissões baseadas em funções, multi-tenancy e documentação PDCA
- início sem conexão com ERP ou MES, com conexão de dados opcional depois

No projeto de pesquisa ECOWERT, o Polaris VSM serviu como ferramenta de avaliação para dados coletados automaticamente (veja a seção 11) [21]. O fornecedor não lista uma função de simulação no sentido estrito; para análise dinâmica é preciso uma ferramenta da categoria "vínculo com simulação" (seção 15). Os números de benefício na página do fornecedor (como uma redução de 25% no lead time) não são repetidos aqui porque não é informada nenhuma metodologia.

O **[Polaris BSM](https://www.m365.fm/entity/polaris-bsm/)** (Business Swimlane Modeling) acrescenta processos de negócio à visão do fluxo de valor. Segundo a listagem no AppSource, as etapas do processo são agrupadas em pools e lanes, e fatores de tempo e métricas são registrados e comparados; os planos vão de "Read Only" a "Basic" (gravações BPMN, modelos de swimlane, fórmulas básicas, lead time e gráfico de balanceamento), passando por "Excellence" até "Integrate & Customize" [30]. Isso é útil quando o fluxo de valor não começa na produção, mas em orçamentação, engenharia e tratamento de pedidos.

Ambos os módulos estão listados no Microsoft AppSource [29][30]. O fornecedor não publica preços; uma demonstração está disponível mediante solicitação [30].

**Avaliação:** Uma ferramenta como o Polaris VSM não substitui ir ao gemba nem desenhar o estado futuro. Ela assume os cálculos, torna os cenários comparáveis e pode manter o mapa atualizado quando os dados fluem automaticamente. Se ela se encaixa na sua fábrica depende da variedade de produtos, dos dados disponíveis e do cenário de TI. Verifique-a com os critérios de seleção da seção 15, como qualquer outra solução.

## 17. Gestão do Fluxo de Valor no Desenvolvimento de Software: Em que Difere

Se você pesquisar "value stream mapping" ou "value stream management" no google.com, muitos resultados vêm do desenvolvimento de software e de DevOps. A Gartner descreve as plataformas de gestão de fluxo de valor como ferramentas que "permitem às organizações otimizar a entrega de produtos de ponta a ponta e melhorar os resultados de negócio"; elas são agnósticas quanto a ferramentas e se conectam às ferramentas existentes ao longo do ciclo de vida da entrega de software [31]. O Flow Framework de Mik Kersten, em "Project to Product" (IT Revolution, 2018), introduziu para esse contexto métricas como tempo de fluxo e carga de fluxo [39].

A ideia básica é a mesma da fábrica: tornar visível o fluxo desde a solicitação do cliente até a entrega e reduzir a espera. As diferenças, porém, são grandes. No desenvolvimento de software, itens de trabalho fluem em vez de materiais, o estoque são tickets não concluídos, e o takt time é difícil de definir de forma significativa. Martin e Osterling transferiram o método para o trabalho de escritório e o trabalho do conhecimento e colocaram no centro métricas como percent complete and accurate (%C&A): a parcela do trabalho que a etapa seguinte encontra completa e sem erros. Multiplicada por todas as etapas, ela resulta no %C&A acumulado (rolled %C&A), que o glossário de Martin chama de rolled first pass yield [6][44]. Para a manufatura, o método clássico com takt time, estoque e lead time continua sendo o ponto de referência.

## 18. Evidências e Publicações de Pesquisa

Números de casos robustos e publicados de forma independente sobre value stream mapping são mais raros do que sugerem as muitas alegações de sucesso encontradas online. Os seguintes estão documentados:

- **Fabricante de máquinas especiais (TU Darmstadt / VDMA):** doze meios de armazenamento e grau de digitalização de zero por cento (detalhes na seção 12) [14].
- **ECOWERT (Fraunhofer IPA e iFAKT):** análise do fluxo de valor quase em tempo real com sensores retrofitados (detalhes na seção 11) [20][21].
- **HELLA (ZWF 2018):** desenvolvimento de um modelo de valoração baseado em custos para ações de fluxo de valor, em conjunto com o fornecedor automotivo alemão HELLA GmbH & Co. KGaA, para priorizar melhorias concorrentes em termos de negócio [25].
- **Schaeffler (ZWF 2017):** Andreas Lugert, gestão Lean na Schaeffler AG, e Herwig Winkler (BTU Cottbus-Senftenberg) descrevem o caminho do value stream mapping estático até o value stream management dinâmico [23].
- **Thrustmaster of Texas (LEI):** relato de caso sobre o spaghetti chart como complemento à análise de fluxo, com 100% de entregas no prazo relatadas 18 meses depois [43].

O conhecido caso de livro didático "Acme Stamping", de *Learning to See*, é fictício [1], mas funciona bem para a prática.

### Publicações de pesquisa sobre value stream mapping dinâmico e digital

As seguintes publicações foram escritas por autores da iFAKT GmbH, em parte em conjunto com o Fraunhofer IPA. Estão em alemão e podem ser consultadas pelo DOI na editora. Juntas, elas traçam o desenvolvimento desde o cálculo de métricas até a simulação e uma interface de dados orientada a eventos:

| Ano | Título (tradução para o inglês) | Autores | Publicação |
|---|---|---|---|
| 2011 | Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung (Otimização da produção por meio de métricas de modelagem do fluxo de valor) | J. Drees, C. Sack | ZWF 106 (6), pp. 466–470, DOI 10.3139/104.110589 [19] |
| 2014 | Dynamische Simulation von Wertströmen (Simulação dinâmica de fluxos de valor) | S. Türck, A. Weimer, [L. Schubert](https://www.m365.fm/entity/lars-schubert/), [J. Drees](https://www.m365.fm/entity/jorg-drees/) | ZWF 109 (11), pp. 839–842, DOI 10.3139/104.111242 [16] |
| 2018 | Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation (Novas perspectivas para o método do fluxo de valor) | J. Drees | ZWF 113 (9), pp. 605–609, DOI 10.3139/104.111974 [17] |
| 2023 | Universelle Datenschnittstelle für digitale Wertstromdienste (Interface universal de dados para serviços digitais de fluxo de valor) | M. Böhm, J. Drees, B. Sai, K. Erlach, S. Stambera, T. Teriete | ZWF 118 (5), pp. 293–297, DOI 10.1515/zwf-2023-1062 [18] |
| 2023 | Daten für Wertstromanalysen automatisch erfassen (Coleta automática de dados para análises de fluxo de valor) | J. Drees, S. Stambera, M. Böhm | IT&Production, 12 de janeiro de 2023 [21] |

Outros artigos independentes da ZWF sobre a extensão do método incluem Lugert/Winkler (2017) [23], Busch/Niehues/Maassen (2018) [25] e Urnauer (2019) [24]. Em inglês, as principais linhas de pesquisa são Meudt et al. no CIRP Annals (2017) [13] e Bega et al. no Production Engineering (2023) [26].

## 19. FAQ: Perguntas frequentes sobre o mapeamento do fluxo de valor

### O que é o mapeamento do fluxo de valor, em termos simples?
Um mapa do fluxo de valor é um mapa de uma página do seu fluxo de produção. Símbolos simples mostram por quais processos um produto passa, onde o material fica parado, quanto tempo isso leva e quais informações controlam os processos. Ele mostra quão pouco do lead time realmente agrega valor.

### Quais são as etapas do mapeamento do fluxo de valor?
Definir objetivo e escopo, definir a família de produtos, levantar a demanda do cliente e o takt time, percorrer o processo de trás para frente a partir da expedição, preencher as caixas de dados, contar os estoques, incluir fornecedores e transporte, desenhar o fluxo de informações, desenhar a linha do tempo e calcular os indicadores, depois marcar os desperdícios e validar o mapa. Em seguida vêm o mapa do estado futuro e o plano de implementação. A seção 5 explica cada etapa.

### Qual é a diferença entre o mapa do estado atual e o mapa do estado futuro?
O mapa do estado atual registra como o material e a informação fluem hoje, com dados medidos. O mapa do estado futuro projeta como eles devem fluir, seguindo diretrizes como produzir no ritmo do takt time, fluxo contínuo sempre que possível, supermercados onde o fluxo não for possível e um processo marca-passo [11]. Juntos, eles formam o método do fluxo de valor, seguido de um plano de implementação.

### Qual é a diferença entre mapeamento do fluxo de valor e mapeamento de processos?
Um mapa de processo mostra as etapas de um procedimento, muitas vezes dentro de um único departamento. Um mapa do fluxo de valor cobre uma família de produtos de ponta a ponta e acrescenta o que falta a um mapa de processo: os estoques entre as etapas, o fluxo de informações que controla a produção e uma linha do tempo com lead time e tempo de processamento.

### Qual é a diferença entre mapeamento do fluxo de valor e gestão do fluxo de valor?
O mapeamento do fluxo de valor é um projeto: uma equipe registra o estado atual e projeta um estado futuro. A gestão do fluxo de valor é a liderança contínua do fluxo de valor por um gestor responsável, com um mapa atualizado regularmente, indicadores e revisões. A ISO 22468:2020 descreve esse ciclo de análise, projeto, planejamento, avaliação e ajuste [40].

### Quais símbolos são usados no mapeamento do fluxo de valor?
Os mais importantes são a caixa de processo, a caixa de dados, o triângulo de estoque, a seta de empurrar, o supermercado, a faixa FIFO, o caminhão, os símbolos de kanban, as setas de informação manual e eletrônica, a caixa heijunka, o kaizen burst e a linha do tempo. A tabela completa está na seção 4.

### Quais indicadores vão no mapa do fluxo de valor?
Por processo: tempo de ciclo, tempo de troca, disponibilidade (tempo de operação), tamanho do lote e dimensionamento de pessoal. Por ponto de estoque: quantidade e dias de estoque. Para o fluxo como um todo: takt time, lead time, tempo de processamento e índice de fluxo. As fórmulas estão na seção 6.

### Como se calcula a eficiência do ciclo do processo (índice de fluxo)?
Divida o tempo de processamento (acrescido de tempos de processo, como cura) pelo lead time e multiplique por 100%. Expresse ambos na mesma unidade e na mesma base (dias úteis ou dias corridos). No exemplo da seção 7: 413 s ÷ 1.080.000 s = 0,038%.

### Por que mapear a partir do cliente, de trás para frente?
Porque o cliente define o ritmo. Se você começar na expedição e percorrer o fluxo para trás, primeiro registra os processos que devem controlar o fluxo e avalia todos os demais em relação à demanda do cliente [1][27].

### Quanto tempo leva o mapeamento do fluxo de valor?
Para um fluxo de valor gerenciável em uma única fábrica, de um a dois dias para o estado atual e outra oficina para o estado futuro são realistas [unverified: estimativa baseada em prática comum, sem fonte específica]. A ASQ descreve um evento kaizen de três dias como ponto de partida [46]. O esforço real está na implementação, que leva meses.

### O mapeamento do fluxo de valor é Lean ou Seis Sigma?
É uma ferramenta Lean do Sistema Toyota de Produção, e a ASQ a classifica como Lean [46]. A Wikipedia em inglês a chama de "um método reconhecido, usado como parte das metodologias Lean Seis Sigma" [49]. Ele não precisa de estatística Seis Sigma para funcionar.

### Quais são as desvantagens do mapeamento do fluxo de valor?
É um retrato baseado em médias, mostra mal a variedade de produtos e a variabilidade, exige coleta manual de dados e não permite testar o estado futuro [22][23]. A simulação dinâmica e a coleta automática de dados fecham parte dessas lacunas.

### O que é o mapeamento dinâmico do fluxo de valor?
É o mapeamento do fluxo de valor que leva em conta o comportamento no tempo. Os processos recebem distribuições em vez de médias, a demanda segue séries temporais e uma simulação mostra como os estoques e os lead times evoluem ao longo do tempo [16].

### Existe um padrão para o mapeamento do fluxo de valor?
Sim. A ISO 22468:2020 "Value stream management (VSM)" cobre a análise, o projeto, o planejamento e a avaliação e ajuste de fluxos de valor [40]. A ISO confirmou sua vigência em 2025. Na Alemanha, a diretriz VDI 2870, sobre sistemas de produção holísticos, também é relevante [7].

### Existe software gratuito para mapeamento do fluxo de valor?
Muitas ferramentas gerais de diagramação oferecem faixas gratuitas de entrada com símbolos de VSM, e modelos em planilhas são comuns. Normalmente, elas não calculam métricas automaticamente. Softwares especializados em VSM costumam ser pagos, geralmente com período de teste. Para o seu primeiro mapa, papel e lápis continuam sendo a melhor opção gratuita.

### Um MES pode substituir o mapeamento do fluxo de valor?
Não. Um MES fornece dados valiosos, como tempos de ciclo, paradas e estoques, que podem alimentar um mapa digital do fluxo de valor [20]. Projetar o fluxo, ou seja, decidir sobre supermercados, faixas FIFO e o pacemaker, continua sendo tarefa do método do fluxo de valor e das pessoas que o aplicam.

## 20. Conclusão

Desde a publicação de "Learning to See", em 1998, o mapeamento do fluxo de valor tornou-se a ferramenta padrão para tornar o fluxo visível na produção [1]. Seu valor não está no mapa em si, mas no que ele desencadeia: uma compreensão compartilhada do fluxo completo, um número honesto para a razão de fluxo e um estado futuro projetado segundo diretrizes claras [3][11].

Fique com três pontos. Primeiro, calcule com cuidado. O takt time, o tempo de ciclo efetivo, os dias de estoque obtidos pela Lei de Little e uma razão de fluxo em uma base de tempo fixa transformam um desenho em uma base confiável para decisões. Segundo, não pare no estado atual. O projeto do estado futuro, um plano de implementação e um gestor de fluxo de valor responsável determinam se algo realmente muda. Terceiro, use as extensões onde o método clássico atinge seus limites. A simulação dinâmica, a coleta automática de dados e a visão de logística de informação do Value Stream 4.0 preparam o método para alta variedade de produtos e fábricas digitais [13][16][18], desde que o fluxo esteja estável antes [14].

Comece com papel, lápis e uma família de produtos. Passe para o digital quando quiser atualizar o mapa com regularidade.

## Leitura complementar no m365.fm

**Posts do blog**
- [What Is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/)
- [Value Stream Manager: Role and Responsibilities](https://www.m365.fm/community/u/mirko-p/blog/value-stream-manager-role-responsibilities/)
- [Value Stream Management Software in Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)
- [Value Stream Mapping Symbols and Icons Explained](https://www.m365.fm/community/u/mirko-p/blog/value-stream-mapping-symbols-icons/)

**Episódio de podcast**
- [Value Stream Mapping with a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Glossário**
[Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Eight Wastes](https://www.m365.fm/entity/eight-wastes/) · [Spaghetti Diagram](https://www.m365.fm/entity/spaghetti-diagram/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Cycle Time](https://www.m365.fm/entity/cycle-time/) · [Takt Time](https://www.m365.fm/entity/takt-time/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Pull System](https://www.m365.fm/entity/pull-system/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Lean Management](https://www.m365.fm/entity/lean-management/) · [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) · [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/)

**Empresas e pessoas**
[iFAKT GmbH](https://www.m365.fm/entity/ifakt/) · [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) · [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Guias relacionados**
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Excelência Operacional](https://www.m365.fm/en/learn/operational-excellence/)
- [Gêmeo Digital na Manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Programação da Produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Gestão do Chão de Fábrica](https://www.m365.fm/en/learn/shop-floor-management/)
- [KPIs de Manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [Azure para Manufatura](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Planejamento da Produção Aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** é o apresentador do m365.fm e trabalha na [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) em Stuttgart, Alemanha. No m365.fm ele escreve sobre gestão enxuta (lean), mapeamento do fluxo de valor e a digitalização da manufatura com Microsoft 365 e Azure. Seu foco é como ferramentas Lean comprovadas, como o mapeamento do fluxo de valor, funcionam em conjunto com dados em tempo real, simulação e plataformas de dados modernas, sem perder seu núcleo metodológico.

**Observação: o autor trabalha na iFAKT GmbH.** Os artigos de pesquisa da iFAKT citados podem ser verificados pelo DOI na ZWF.

# Sources

All sources accessed November 20, 2026. Sources marked "verified 11/20/2026" were opened for this English version; the others were verified for the German original on the same date and spot-checked.

1. Rother, M.; Shook, J.: Learning to See: Value Stream Mapping to Create Value and Eliminate Muda. Lean Enterprise Institute, 1998 (introduction dated May 1998, Ann Arbor); current edition subtitled "… to Add Value and Eliminate Muda", LEI, September 2018, 148 pages, ISBN 978-0-9667843-0-5. Publisher page (Shingo award 1999, Shook eleven years at Toyota): https://www.lean.org/store/workbooks/learning-to-see/ · Introduction (PDF): https://www.lean.org/wp-content/uploads/2021/01/Learning-to-See-introduction.pdf (verified 11/20/2026)
2. Rother, M.; Shook, J.: Sehen lernen. Mit Wertstromdesign die Wertschöpfung erhöhen und Verschwendung beseitigen. German edition, version 1.1. Lean Management Institut, Aachen 2004, ISBN 978-3-9809521-1-8 (German Digital Library catalog).
3. Erlach, K.: Wertstromdesign. Der Weg zur schlanken Fabrik. Springer, 1st ed. 2007; 2nd ed. 2010 (VDI-Buch), ISBN 978-3-540-89867-2; 3rd ed. Springer Vieweg, Berlin/Heidelberg 2020, ISBN 978-3-662-58906-9 (eBook 978-3-662-58907-6). Sample of 2nd ed.: https://lesejury.de/media/samples/672/9783540898672_leseprobe.pdf · Overview with the eight design guidelines: http://www.wertstromdesign.de/wertstromdesign.html (verified 11/20/2026)
4. Erlach, K.: Value Stream Design: The Way Towards a Lean Factory. Springer, Lecture Notes in Logistics, published September 2012 (copyright 2013), ISBN 978-3-642-12568-3 (hardcover), eBook 978-3-642-12569-0. https://link.springer.com/978-3-642-12568-3 · Publisher description ("ten design guidelines") via https://ebooks.mpdl.mpg.de/ebooks/Record/EB000384257 (verified 11/20/2026)
5. Klevers, T.: Wertstrom-Mapping und Wertstrom-Design. Verschwendung erkennen – Wertschöpfung steigern. mi-Fachverlag, Landsberg am Lech 2007, ISBN 978-3-636-03097-9 (bibliographic data per [27]).
6. Martin, K.; Osterling, M.: Value Stream Mapping: How to Visualize Work and Align Leadership for Organizational Transformation. McGraw-Hill, New York, published October 2013 (copyright 2014), ISBN 978-0-07-182891-8. https://www.mheducation.com/highered/mhp/product/value-stream-mapping-how-visualize-work-align-leadership-organizational-transformation.html (verified 11/20/2026)
7. VDI 2870 Part 1: Lean production systems; basic principles, introduction and review. VDI (Association of German Engineers), July 2012. https://vdi.de/richtlinien/details/vdi-2870-blatt-1-lean-production-systems-basic-principles-introduction-and-review
8. Takt Time (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/takt-time/ (verified 11/20/2026)
9. Seven Wastes (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/seven-wastes/ (verified 11/20/2026)
10. Value-Stream Manager (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/value-stream-manager/ (verified 11/20/2026)
11. Rother, M.; Shook, J.: 6 Guidelines for Moving Toward a Lean Value Stream. Lean Enterprise Institute, The Lean Post, October 19, 2022. https://www.lean.org/the-lean-post/articles/6-guidelines-for-moving-toward-a-lean-value-stream/ (verified 11/20/2026)
12. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (3), 1961, pp. 383–387. DOI: 10.1287/opre.9.3.383. https://econpapers.repec.org/RePEc:inm:oropre:v:9:y:1961:i:3:p:383-387 (verified 11/20/2026)
13. Meudt, T.; Metternich, J.; Abele, E.: Value stream mapping 4.0: Holistic examination of value stream and information logistics in production. CIRP Annals 66 (1), 2017, pp. 413–416. DOI: 10.1016/j.cirp.2017.04.005 (bibliographic data per the reference list of [26]).
14. VDMA / PTW TU Darmstadt (Metternich, J.; Meudt, T.; Hartmann, L.): Leitfaden Industrie 4.0 trifft Lean, excerpt on Value Stream Mapping 4.0 (German). https://www.ptw.tu-darmstadt.de/media/fachgebietptw/dokumente_3/wissenssammlung_ptw/leitfaeden_2/Leitfaden_I40_Lean.pdf
15. Metternich, J.; Meudt, T.; Hartmann, L.: Value Stream 4.0: A Systems View of Information Flow for Digitalization. CRC Press, released July 20, 2025 (copyright 2026), ISBN 978-1-032-95831-6. https://www.routledge.com/Value-Stream-40-A-Systems-View-of-Information-Flow-for-Digitalization/Metternich-Meudt-Hartmann/p/book/9781032958316 (verified 11/20/2026)
16. Türck, S.; Weimer, A.; Schubert, L.; Drees, J. (iFAKT GmbH): Dynamische Simulation von Wertströmen. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 109 (11), 2014, pp. 839–842. DOI: 10.3139/104.111242. https://www.degruyterbrill.com/document/doi/10.3139/104.111242/html (verified 11/20/2026)
17. Drees, J. (iFAKT GmbH): Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation. ZWF 113 (9), 2018, pp. 605–609. DOI: 10.3139/104.111974. https://www.degruyterbrill.com/document/doi/10.3139/104.111974/html
18. Böhm, M.; Drees, J.; Sai, B.; Erlach, K.; Stambera, S.; Teriete, T. (Fraunhofer IPA, iFAKT GmbH): Universelle Datenschnittstelle für digitale Wertstromdienste. Eventbasierte Wertstromanalyse als einheitliche Datenbasis für individuelle Dienste zur Produktionsoptimierung. ZWF 118 (5), 2023, pp. 293–297. DOI: 10.1515/zwf-2023-1062. https://www.degruyterbrill.com/document/doi/10.1515/zwf-2023-1062/html
19. Drees, J.; Sack, C. (iFAKT GmbH): Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung. ZWF 106 (6), 2011, pp. 466–470. DOI: 10.3139/104.110589. https://www.degruyterbrill.com/document/doi/10.3139/104.110589/html
20. ECOWERT – Echtzeitorientierte Wertstromanalyse für die nachhaltige Produktionsoptimierung (reference project). Fraunhofer IPA. https://www.ipa.fraunhofer.de/de/referenzprojekte/ECOWERT.html (verified 11/20/2026)
21. Drees, J.; Stambera, S.; Böhm, M.: Daten für Wertstromanalysen automatisch erfassen. IT&Production, January 12, 2023 (updated July 23, 2024). https://www.it-production.com/industrie-4-0-iot/wertstromanalyse-mit-iiot-anbindung/ (verified 11/20/2026)
22. Digitalized value stream analysis: We are automating the gemba walk. Fraunhofer IPA. https://www.ipa.fraunhofer.de/en/current-research/factory-planning-and-production-management/production-management-and-value-stream-mapping-and-design/WertstromDigital.html (verified 11/20/2026)
23. Lugert, A.; Winkler, H.: Von der Wertstromanalyse zum Wertstrommanagement. ZWF 112 (4), 2017, pp. 261–265. DOI: 10.3139/104.111703. https://www.degruyterbrill.com/document/doi/10.3139/104.111703/html
24. Urnauer, C.: Die digitale Wertstrommethode. ZWF 114, 2019 (issue and pages not shown at access). DOI: 10.3139/104.112203. https://www.degruyterbrill.com/document/doi/10.3139/104.112203/html
25. Busch, O.; Niehues, M.; Maassen, K.: Die monetäre Bewertung von Wertströmen. ZWF 113 (6), 2018, pp. 389–392. DOI: 10.3139/104.111935. https://www.degruyterbrill.com/document/doi/10.3139/104.111935/html
26. Bega, M.; Sapel, P.; Ercan, F.; Schramm, T.; Spitz, M.; Kuhlenkötter, B.; Hopmann, C.: Extension of value stream mapping 4.0 for comprehensive identification of data and information flows within the manufacturing domain. Production Engineering 17 (6), 2023, pp. 915–927. DOI: 10.1007/s11740-023-01207-5. https://link.springer.com/10.1007/s11740-023-01207-5
27. Wertstromanalyse. Wikipedia (German-language). https://de.wikipedia.org/wiki/Wertstromanalyse (verified 11/20/2026)
28. Polaris VSM – Digital Value Stream Tool in Lean Management (vendor page). iFAKT GmbH. https://www.ifakt.de/en/software/vsm/ (verified 11/20/2026)
29. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource (Polaris VSM). Microsoft Tech Community, Marketplace Blog, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536 (verified 11/20/2026)
30. Polaris BSM (Business Swimlane Modeling). Microsoft AppSource. https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1 (verified 11/20/2026)
31. Value Stream Management Platforms. Gartner Peer Insights. https://www.gartner.com/reviews/market/value-stream-management-platforms (verified 11/20/2026)
32. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press, 1988 (Japanese original 1978). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140
33. Liker, J. K.: The Toyota Way: 14 Management Principles from the World's Greatest Manufacturer. McGraw-Hill, New York 2004, ISBN 978-0-07-139231-0.
34. SimVSM – digital value stream analysis. SimPlan AG. https://www.simplan.de/en/software/simvsm (verified 11/20/2026)
35. Plant Simulation X – Value Stream Mapping. Siemens. https://www.siemens.com/en-us/products/tecnomatix/offerings/plant-simulation-x-value-stream-mapping/ (verified 11/20/2026)
36. Was ist eine Wertstromanalyse? (What is a value stream analysis?) ONIQ (German). https://oniq.com/de/ressourcen/was-ist-eine-wertstromanalyse (verified 11/20/2026)
37. Wertstromanalyse (REFA lexicon). REFA Bundesverband. https://refa.de/service/refa-lexikon/wertstromanalyse
38. Wertstromanalyse: Anleitung, Kennzahlen, Symbole. Industriezeitschrift (German). https://industriezeitschrift.de/qualitaet/wertstromanalyse/
39. Kersten, M.: Project to Product: How to Survive and Thrive in the Age of Digital Disruption with the Flow Framework. IT Revolution Press, Portland 2018, ISBN 978-1-942788-39-3.
40. ISO 22468:2020 Value stream management (VSM). ISO/TC 154, published March 9, 2020, confirmed June 25, 2025. https://committee.iso.org/standard/73292.html (verified 11/20/2026) · Table of contents (DIN): https://www.din.de/de/mitwirken/normenausschuesse/nia/veroeffentlichungen/wdc-beuth:din21:322285827/toc-3156892/download
41. Fuchs, H.-W.: Wertstrom-Methode (diploma thesis). Hochschule Mittweida. https://monami.hs-mittweida.de/frontdoor/deliver/index/docId/796/file/DA_Wertstrommethode.pdf
42. Wertstromanalyse (Value Stream Mapping). Mind Logistik (German). https://mind-logistik.de/knowhow/wertstromanalyse/
43. Small Chart, Big Impact: How a Simple Spaghetti Chart Led to Huge Wins at Thrustmaster of Texas. Lean Enterprise Institute, The Lean Post, February 4, 2016. https://www.lean.org/the-lean-post/articles/small-chart-big-impact-how-a-simple-spaghetti-chart-led-to-huge-wins-at-thrustmaster-of-texas/ (verified 11/20/2026)
44. The Karen Martin Group: Lean Terminology (glossary, PDF, 2014): definitions of activity ratio, lead time, process time, %C&A and rolled first pass yield. https://tkmg.com/wp-content/files/Lean-Terminology.pdf (verified 11/20/2026)
45. Value-Stream Mapping (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/value-stream-mapping/ (verified 11/20/2026)
46. Value Stream Mapping. ASQ, Quality Resources (adapted from "Lean Lessons: Value Stream Mapping – An Introduction", Quality Progress). https://asq.org/quality-resources/lean/value-stream-mapping (verified 11/20/2026)
47. Lean and Process Improvement. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/lean-and-process-improvement (verified 11/20/2026)
48. Lean & Environment Toolkit, Chapter 3 (Value Stream Mapping). US Environmental Protection Agency. https://epa.gov/sustainability/lean-environment-toolkit-chapter-3 (verified 11/20/2026)
49. Value-stream mapping. Wikipedia (English). https://en.wikipedia.org/wiki/Value-stream_mapping (verified 11/20/2026)
50. ISA-95 framework and layers. Siemens. https://www.siemens.com/en-us/technology/isa-95-framework-layers/ (verified 11/20/2026)
51. 8 Wastes (DOWNTIME). GoLeanSixSigma.com. https://goleansixsigma.com/8-wastes/ (verified 11/20/2026)
