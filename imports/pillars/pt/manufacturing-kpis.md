# SEO metadata

| Field | Value |
|---|---|
| Meta title | KPIs de Manufatura: Fórmulas, Exemplos e Guia Power BI |
| Meta description | KPIs de manufatura com fórmulas e exemplos práticos: takt time, cycle time, lead time, OEE, refugo, FPY, OTIF, MTBF, TRIR e um dashboard no Power BI. |
| Slug | `manufacturing-kpis` |

# KPIs de Manufatura: O Guia Completo de Métricas de Produção, Fórmulas, Exemplos Práticos e Dashboards no Power BI

> **Resposta curta:** KPIs de manufatura são medidas que expressam em números a velocidade, a qualidade, a entrega, o custo e a segurança de uma operação produtiva. Os mais importantes são takt time, cycle time, lead time de manufatura, OEE, taxa de refugo, first pass yield, entrega no prazo e completa (OTIF), dias de cobertura, MTBF/MTTR, custo por unidade e uma taxa de segurança como o TRIR. Eles só funcionam quando cada KPI tem uma definição única e acordada, dados confiáveis e uma rotina fixa de reuniões em que os desvios se transformam em ações.

> **Principais conclusões**
> - **Defina antes de construir um dashboard:** a ISO 22400-2:2014 descreve 34 KPIs para a gestão de operações de manufatura, cada um com fórmula, unidade e periodicidade [1][38]. A ISA-95 posiciona esses KPIs no Nível 3, entre a camada de controle e o ERP [40]. Na Alemanha, a diretriz VDMA 66412-1 acrescenta definições de KPIs de MES [4].
> - **Takt time não é tempo de máquina:** o takt é o tempo disponível dividido pela demanda do cliente [9]. O cycle time é medido; o lead time inclui também todo o tempo de fila e espera [10].
> - **OEE = Disponibilidade × Performance × Qualidade.** A popular meta de 85 % de "classe mundial" é atribuída a Nakajima, mas não é um benchmark universal [6][8].
> - **A Lei de Little** relaciona estoque, produtividade e lead time: se você não reduzir o WIP, não encurtará o lead time por muito tempo [13].
> - **Segurança em primeiro lugar, com uma fórmula padrão dos EUA:** a taxa de incidência da OSHA é casos × 200.000 ÷ horas trabalhadas [42]. Em 2025, a indústria privada dos EUA registrou 2,3 casos registráveis totais por 100 trabalhadores equivalentes a tempo integral [43].
> - **Menos é mais (recomendação):** de cinco a oito KPIs por nível, organizados por Segurança, Qualidade, Custo, Entrega e Pessoas (SQCDP), são suficientes para conduzir uma operação.
> - **KPIs usados como metas perdem seu valor** quando são recompensados em vez de compreendidos (lei de Goodhart) [23][24].
> - **O Power BI** funciona bem para dashboards de KPIs se o modelo de dados for um esquema em estrela e o OEE for calculado a partir de tempos somados, não de médias de percentuais [27].

## Sumário

1. O que são KPIs de manufatura?
2. Guia rápido de KPIs de manufatura: todas as fórmulas em resumo
3. O exemplo prático "Linha 3": dados de entrada
4. Métricas de tempo: takt time, cycle time, lead time, tempo de processamento, fator de fluxo
5. Takt time vs. cycle time vs. lead time
6. Tempo de troca, SMED e micro paradas
7. OEE: como calcular a eficiência global do equipamento
8. KPIs de qualidade: taxa de refugo, first pass yield, taxa de retrabalho, PPM
9. KPIs de entrega e estoque: OTIF, aderência ao cronograma, WIP, dias de cobertura
10. Capacidade e produtividade: utilização, eficiência de utilização, produtividade da mão de obra
11. KPIs de manutenção: MTBF, MTTR e disponibilidade inerente
12. Energia, segurança (TRIR, DART, LTIFR) e custo por unidade
13. Sistemas de KPIs: hierarquia, indicadores antecedentes e defasados, SQCDP
14. Coleta de dados e qualidade dos dados
15. Visualização: quadros no chão de fábrica e dashboards no Power BI
16. Como definir metas de KPIs
17. Erros comuns e como evitá-los
18. Roteiro: implantar KPIs de manufatura em 90 dias
19. KPIs a partir da modelagem do fluxo de valor: iFAKT Polaris
20. Glossário
21. FAQ: KPIs de manufatura
22. Conclusão

## 1. O que são KPIs de manufatura?

KPIs de manufatura (também chamados de métricas de manufatura, KPIs de produção ou indicadores-chave de desempenho na manufatura) são números condensados que tornam mensurável um aspecto da produção. Com que velocidade um pedido percorre a fábrica? Quanto do tempo planejado uma máquina realmente gasta produzindo peças boas? Quantas entregas chegam ao cliente no prazo e completas? Cada KPI é composto por quatro elementos: uma **definição** (o que exatamente é contado), uma **fórmula**, uma **unidade** e um **período de tempo**. Se um deles faltar, surge a conhecida reunião em que dois departamentos usam o mesmo nome para dois números diferentes.

Nem toda métrica é um [indicador-chave de desempenho (KPI)](https://www.m365.fm/entity/key-performance-indicator/). Um KPI é uma métrica diretamente ligada a uma meta e que orienta decisões com regularidade. O número de peças produzidas é uma métrica. A entrega no prazo ao cliente é um KPI para a maioria das fábricas, porque a receita e a retenção de clientes dependem dela.

### As normas por trás das fórmulas: ISO 22400, ISA-95, SEMI e VDMA 66412

Você não precisa criar as definições dos seus KPIs do zero. A norma internacional **ISO 22400-2:2014** "Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions" define um conjunto de KPIs comuns, com fórmula, periodicidade, unidade, grupo de usuários e a metodologia de produção à qual se aplicam [1]. Fontes secundárias contam 34 KPIs [38][3]. A ISO indica que a norma está "em revisão"; a Emenda 1 acrescentou um conjunto de KPIs de energia em 2017 [1].

A norma trabalha com um modelo de tempo preciso. Kang et al., em um artigo publicado pelo Instituto Nacional de Padrões e Tecnologia dos EUA (NIST), apresentam as fórmulas centrais como: disponibilidade = tempo real de produção (APT) ÷ tempo de operação planejado (PBT), e efetividade = tempo de execução planejado por item (PRI) × quantidade produzida (PQ) ÷ APT [3]. Ou seja, a norma diz "efetividade" onde a literatura de TPM diz "desempenho".

Para leitores dos EUA, a **ISA-95** (ANSI/ISA-95, internacionalmente IEC 62264) fornece a arquitetura em torno desses KPIs. Baseada no modelo de referência de Purdue, ela define cinco níveis, do processo físico (Nível 0) passando por sensoriamento, controle supervisório e **Nível 3, gestão de operações de manufatura (MOM), onde vivem MES e SCADA**, até o planejamento empresarial e a logística no ERP (Nível 4) [40]. Os KPIs da ISO 22400 são, pelo próprio nome, KPIs de gestão de operações de manufatura, portanto são calculados no Nível 3 da ISA-95 e reportados para cima. Em fábricas de semicondutores, a SEMI E10 (confiabilidade, disponibilidade, manutenibilidade e utilização de equipamentos) e a SEMI E79 (produtividade de equipamentos, incluindo OEE) são as referências específicas do setor [41].

Na Alemanha, um grupo de trabalho da VDMA (associação da indústria alemã de engenharia mecânica) publicou a diretriz **VDMA 66412-1 "Manufacturing Execution Systems (MES) – KPIs"** (edição 2009-10, 36 páginas, alterada por A1:2010-05) [4]. Ela define KPIs padrão e como calculá-los a partir dos estados das máquinas [5]. A mensagem para você, como profissional, é a mesma em todos os países: adote os termos padronizados sempre que possível e documente todo desvio. Isso facilita muito a comparação entre fábricas e a integração com MES.

### Para que servem os KPIs de manufatura

Os KPIs cumprem três funções. Eles **tornam visível** o que se perde no dia a dia, por exemplo, que uma máquina funciona o tempo todo, mas entrega apenas dois terços de sua produção possível. **Focalizam a atenção** na maior alavanca, porque decompõem as perdas em categorias. E **testam as contramedidas**: o novo método de troca de ferramentas realmente reduziu o tempo de setup, ou a perda apenas se deslocou para a fase de partida? Sem um número, essa pergunta continua sendo questão de opinião.

Uma quarta função costuma ser esquecida: os KPIs são uma **ferramenta de comunicação**. Na [gestão à vista do chão de fábrica](https://www.m365.fm/entity/shop-floor-management/), eles são a linguagem comum entre operadores, supervisores de turno e a liderança da fábrica. Eles só cumprem esse papel se todos conhecerem a definição e enxergarem o mesmo número.

## 2. Folha de referência de KPIs de manufatura: todas as fórmulas de relance

A tabela resume todos os KPIs abordados neste guia. "Nível" indica o nível gerencial típico (M = máquina/posto de trabalho, L = linha/área, P = planta). As fórmulas seguem as fontes citadas em cada seção.

| KPI | Fórmula (forma resumida) | Unidade | Direção | Nível |
|---|---|---|---|---|
| Takt time | tempo de produção disponível ÷ demanda do cliente | s/unidade | um dado de entrada, não algo a otimizar | L |
| Cycle time | tempo medido entre duas unidades acabadas | s/unidade | ≤ takt | M, L |
| Lead time de manufatura | fim − início (pedido ou peça); em média WIP ÷ throughput | h, dias | ↓ | L, P |
| Tempo de processamento | soma dos tempos em que a peça é efetivamente trabalhada | s, min | ↓ (sem perda de qualidade) | M, L |
| Flow factor (Wiendahl) | lead time ÷ tempo de operação | razão (≥ 1) | ↓ | L |
| Razão de valor agregado (VSM) | tempo de processamento ÷ lead time × 100 | % | ↑ | L, P |
| Tempo de troca (changeover) | última peça boa da corrida antiga até a primeira peça boa da corrida nova | min | ↓ | M |
| Participação do changeover | tempo de changeover ÷ tempo de produção planejado × 100 | % | ↓ | M, L |
| Micro-paradas | número ou duração de paradas curtas abaixo de um limite definido | contagem, min | ↓ | M |
| Disponibilidade (OEE) | tempo de funcionamento ÷ tempo de produção planejado | % | ↑ | M |
| Desempenho (OEE) | tempo de ciclo ideal × contagem total ÷ tempo de funcionamento | % | ↑ | M |
| Taxa de qualidade (OEE) | contagem de boas ÷ contagem total | % | ↑ | M |
| OEE | disponibilidade × desempenho × qualidade | % | ↑ | M, L |
| TEEP | OEE × carregamento (tempo planejado ÷ tempo de calendário) | % | ↑ | M, P |
| Taxa de sucata | contagem de sucata ÷ contagem total × 100 | % | ↓ | M, L, P |
| First pass yield (FPY) | unidades boas na primeira passagem ÷ contagem total × 100 | % | ↑ | M, L |
| Taxa de retrabalho | contagem retrabalhada ÷ contagem total × 100 | % | ↓ | M, L |
| PPM | peças defeituosas ÷ peças inspecionadas ou expedidas × 1.000.000 | ppm | ↓ | P |
| OTIF | linhas entregues no prazo e completas ÷ todas as linhas com entrega devida × 100 | % | ↑ | P |
| Aderência ao cronograma (produção) | pedidos concluídos no prazo ÷ todos os pedidos com entrega devida × 100 | % | ↑ | L, P |
| WIP | quantidade ou valor de produtos em processo | unidades, US$ | ↓ (até o mínimo necessário) | L |
| Dias de cobertura | estoque ÷ consumo médio diário | dias | ↓ (até o nível de segurança) | L, P |
| Utilização da capacidade | carga ÷ capacidade disponível × 100 | % | faixa-alvo, não máximo | L, P |
| Eficiência de utilização (ISO) | tempo real de produção ÷ tempo real de ocupação da unidade | % | ↑ | M |
| Produtividade da mão de obra | contagem de boas ÷ horas de mão de obra | unidades/h | ↑ | L, P |
| MTBF | tempo de funcionamento ÷ número de falhas | h, min | ↑ | M |
| MTTR | tempo total de reparo ÷ número de falhas | min | ↓ | M |
| Energia por unidade | energia consumida ÷ contagem de boas | kWh/unidade | ↓ | M, P |
| TRIR (OSHA) | casos registráveis × 200.000 ÷ horas trabalhadas | por 100 FTE | ↓ | P |
| DART rate (OSHA) | casos DART × 200.000 ÷ horas trabalhadas | por 100 FTE | ↓ | P |
| LTIFR | lesões com afastamento ÷ horas trabalhadas × 1.000.000 | por 1 milhão de h | ↓ | P |
| Custo por unidade | custo do período ÷ contagem de boas | US$/unidade | ↓ | L, P |

## 3. O exemplo trabalhado "Linha 3": dados de entrada

Para manter as fórmulas concretas, este guia calcula todos os KPIs em uma única linha de montagem fictícia. Os números foram escolhidos para que se verifiquem entre si: se o OEE estiver correto, ele precisa corresponder à contagem de peças boas, e se o lead time estiver correto, ele precisa corresponder ao WIP e à taxa de produção.

| Entrada | Valor |
|---|---|
| Padrão de turnos | 2 turnos de 8 h (480 min), 5 dias por semana |
| Pausas por turno | 30 min (não são tempo de produção planejado) |
| Tempo de produção planejado por turno | 450 min |
| Demanda do cliente | 900 unidades por dia, ou seja, 450 unidades por turno |
| Tempo de ciclo ideal (estação gargalo) | 50 s/unidade |
| Paradas por quebra por turno | 25 min |
| Trocas de ferramenta por turno | 2 trocas de 10 min = 20 min |
| Contagem total por turno | 432 unidades |
| das quais boas na primeira passagem | 410 unidades |
| das quais retrabalhadas e depois boas | 12 unidades |
| das quais sucata | 10 unidades |
| Equipe | 6 operadores por turno |

Essas entradas reaparecem em todas as seções. Cada cálculo foi revisado; o arredondamento ocorre apenas no resultado. Os custos da Seção 12 são apresentados em dólares americanos; os valores são ilustrativos, assim como a própria linha.

## 4. Métricas de tempo: takt time, tempo de ciclo, lead time, tempo de processamento, fator de fluxo

As métricas de tempo são os KPIs de manufatura mais frequentemente confundidos. Os termos soam parecidos, e as empresas os usam de maneiras diferentes na prática. Registre uma vez as definições para a sua fábrica e vincule essa definição em todos os painéis.

### Como calcular o takt time

O [takt time](https://www.m365.fm/entity/takt-time/) indica com que frequência uma unidade acabada precisa sair da linha para atender à demanda do cliente. O Lean Enterprise Institute (LEI) o define como o tempo de produção disponível dividido pela demanda do cliente [9]. Rother e Shook apresentam "Produza no seu takt time" como a primeira diretriz para um fluxo de valor enxuto e descrevem o takt como um substituto da demanda do cliente [2][12].

> **Takt time = tempo de produção disponível por período ÷ demanda do cliente por período**

A palavra vem do alemão ("Takt" significa batida ou compasso). Segundo o LEI, o takt foi usado pela primeira vez como ferramenta de gestão da produção na indústria aeronáutica alemã nos anos 1930 [9].

**Exemplo da Linha 3:** tempo disponível por turno 450 min = 27.000 s; demanda por turno 450 unidades.
Takt time = 27.000 s ÷ 450 unidades = **60 s/unidade**.

Como verificação cruzada, o exemplo do LEI: 480 minutos por dia e demanda de 240 unidades resultam em um takt time de 2 minutos [9].

**Erros comuns:**
- **Não subtrair as pausas.** Usar 480 em vez de 450 minutos resulta em um takt de 64 s. No papel, a linha seria projetada lenta demais.
- **Subtrair paradas não planejadas.** Quebras não devem entrar no tempo disponível para o takt. Elas são uma perda que a linha precisa absorver por meio de sua reserva de capacidade. Subtraí-las esconde o problema dentro do takt.
- **Tratar o takt como algo a otimizar.** O cliente define o takt, não a produção. O que se otimiza é o tempo de ciclo, para que ele atenda de forma confiável ao takt.
- **Confundir takt com taxa.** O takt é tempo por unidade, não unidades por tempo. Seu inverso (1 unidade a cada 60 s = 60 unidades por hora) é a taxa de saída exigida.

### Tempo de ciclo

Segundo o LEI, o [tempo de ciclo](https://www.m365.fm/entity/cycle-time/) é "o tempo necessário para produzir uma peça ou concluir um processo, medido por medição real" [10]. No mapeamento do fluxo de valor, ele descreve com que frequência um processo conclui uma peça. A palavra-chave é "medido": o tempo de ciclo é um valor real. O **tempo de ciclo ideal** (também chamado de tempo padrão, de projeto ou de placa de identificação) é o menor tempo tecnicamente possível e a base do desempenho no cálculo do OEE.

> **Tempo de ciclo real médio = tempo de operação ÷ unidades produzidas**

**Exemplo da Linha 3:** tempo de operação 405 min (450 min menos 25 min de quebras menos 20 min de trocas) = 24.300 s; 432 unidades produzidas.
Tempo de ciclo real = 24.300 s ÷ 432 = **56,25 s/unidade**.
O tempo de ciclo ideal é 50 s. A diferença de 6,25 s por unidade está nas micro-paradas e na redução de velocidade, ou seja, na perda de desempenho (Seção 7).

Para máquinas, o LEI também define o **tempo de ciclo efetivo da máquina**: tempo de ciclo da máquina mais o tempo de carga e descarga mais o tempo de troca, dividido pelo número de peças produzidas entre trocas [10]. Isso indica se uma máquina consegue manter o takt, considerando a frequência das trocas.

**Erro comum:** tratar tempo de ciclo e takt time como se fossem a mesma coisa. Ambos são medidos em segundos por unidade, mas o takt é um indicador de demanda e o tempo de ciclo é um indicador de processo. Pelo menos uma página em inglês de alto ranking apresenta a fórmula do tempo de ciclo invertida (peças ÷ tempo de execução); isso é uma taxa, não um tempo de ciclo.

### Como calcular o lead time de manufatura

O [lead time](https://www.m365.fm/entity/lead-time/) de produção (também chamado de tempo de atravessamento) é "o tempo necessário para que um produto percorra todo o processo ou toda a cadeia de valor, do início ao fim" [10]. Além do processamento, ele inclui todos os tempos de transporte, fila e espera. A engenharia de produção alemã divide esse tempo em tempo de operação (preparação e processamento), tempo de transição (fila e transporte) e tempo de espera entre operações [15]. Hans-Peter Wiendahl tornou o lead time o conceito central do controle da produção com seu modelo de funil [15][14].

Há duas formas de determiná-lo:

**1. Diretamente, por ordem ou peça:**

> **Lead time = carimbo de conclusão − carimbo de início (ou liberação da ordem)**

Defina se você contará dias corridos, dias úteis (dias de calendário de fábrica) ou horas, e a partir de qual momento o relógio começa (lançamento do pedido, liberação, primeira operação). Pontos de partida diferentes são a causa mais comum de discussões entre vendas e produção sobre "o" lead time.

**2. Indiretamente, com a Lei de Little:**

Em 1961, John D. C. Little provou que, em um sistema estável, o número médio de itens no sistema é igual à taxa de chegada multiplicada pelo tempo médio de permanência no sistema (L = λW) [13]. Aplicada à manufatura:

> **Lead time médio = WIP médio ÷ throughput médio**

**Exemplo da Linha 3:** em média, 2.700 peças estão na linha e em seus buffers; a linha expede em média 900 peças por dia útil.
Lead time = 2.700 ÷ 900 = **3 dias úteis**.

A Lei de Little vale para médias em um período suficientemente longo, durante o qual o WIP não cresce nem diminui continuamente. WIP e throughput devem usar a mesma unidade (peças ou dólares, sem misturar). Seu grande valor prático: mostra que, com throughput constante, um lead time menor só é possível com menos WIP. Máquinas mais rápidas, por si só, pouco ajudam enquanto as peças esperam na frente delas.

### Tempo de processamento e tempo padrão (REFA)

**Tempo de processamento** é o tempo em que o produto está de fato sendo trabalhado [10]; normalmente é uma pequena fração do lead time. Para planejamento e custeio, as fábricas alemãs usam as categorias de tempo da REFA, a associação alemã para desenho do trabalho e engenharia industrial (comparável, em função, às convenções de tempo padrão da engenharia industrial dos EUA). A REFA divide o tempo da ordem em tempo de preparação e tempo de execução, cada um composto por componentes básicos, de descanso e de tolerância; o equivalente do lado da máquina é chamado de tempo de ocupação do equipamento [16][17]:

> **Tempo da ordem T = tempo de preparação t_r + tempo de execução t_a**, com **t_a = quantidade da ordem m × tempo por unidade t_e**

**Exemplo:** uma ordem de 400 unidades roda no posto gargalo: preparação de 20 min, tempo por unidade de 50 s.
T = 20 min + 400 × 50 s ÷ 60 = 20 + 333,3 = **353,3 min** (cerca de 5,9 h).

Nyhuis e Wiendahl derivam o **tempo de operação** de uma etapa de trabalho a partir do tempo da ordem e o expressam em dias de calendário de fábrica, relacionando o tempo da ordem com a capacidade diária do sistema de trabalho [14]. [unverified: notação exata da fórmula em Nyhuis/Wiendahl, seção 2.1.1, verificada apenas pelo sumário e pela lista de abreviaturas] Para manter os exemplos comparáveis, este guia simplifica e calcula em minutos de tempo operacional; para uma única máquina, o tempo de operação então é igual ao tempo da ordem.

### Fator de fluxo e razão de valor agregado

Dois indicadores diferentes circulam com nomes parecidos, e você não deve confundi-los.

**Fator de fluxo segundo Wiendahl (visão logística):** a razão entre o lead time e o tempo de operação de uma etapa de trabalho ou ordem [14][15]. Um valor de 1 significa que a ordem foi processada sem espera; um valor de 6 significa que ela ficou seis vezes mais tempo no sistema do que a preparação e o processamento exigiam.

> **Fator de fluxo = lead time ÷ tempo de operação**

**Exemplo:** a ordem do exemplo da REFA tem um tempo de operação de 353,3 min. Ela espera dois dias úteis antes da operação (2 × 900 min = 1.800 min de tempo operacional).
Lead time da operação = 1.800 + 353,3 = 2.153,3 min. Fator de fluxo = 2.153,3 ÷ 353,3 = **6,09**.

**Índice de valor agregado (visão do fluxo de valor):** no [mapeamento do fluxo de valor](https://www.m365.fm/entity/value-stream-mapping/), é comum a visão inversa: a participação do tempo de processamento no lead time, em percentual. (O "tempo que agrega valor" da LEI, mais restrito, conta apenas os elementos de trabalho pelos quais o cliente está disposto a pagar [10].) A Wikipédia em alemão chama essa razão de "Fließgrad", seu inverso de "Flussgrad", e situa a participação de atividades que agregam valor na indústria alemã entre 5 e 15 por cento [15]. [unverified: fonte primária para esta faixa não claramente documentada na Wikipédia] Alguns livros didáticos de fluxo de valor também chamam o percentual de fator de fluxo. Por isso, sempre verifique se se pretende um valor acima de 1 ou abaixo de 100 %.

> **Índice de valor agregado = tempo de processamento ÷ lead time × 100 %**

**Exemplo da linha 3:** os tempos de processamento das quatro estações somam 190 s. O lead time é de 3 dias úteis de 900 min de tempo operacional cada = 162.000 s.
Índice de valor agregado = 190 ÷ 162.000 × 100 % = **0,117 %**.

Valores abaixo de um por cento são normais em operações com estoques intermediários e lotes. O que importa são a tendência e a base de tempo: em tempo de calendário, o valor cai ainda mais. O método está detalhado no guia [Mapeamento do Fluxo de Valor](https://www.m365.fm/en/learn/value-stream-mapping/).

## 5. Takt time vs. cycle time vs. lead time

"Qual é a diferença entre takt time e cycle time?" é uma das perguntas mais comuns sobre KPIs de manufatura. A tabela coloca os três lado a lado. A LEI resume a ordem assim: "Usually, value-creating time is less than cycle time, which is less than production lead time" [10].

| Atributo | Takt time | Cycle time | Lead time |
|---|---|---|---|
| Pergunta | De quanto em quanto tempo uma peça **precisa** ficar pronta? | De quanto em quanto tempo uma peça **fica** pronta? | Quanto tempo uma peça **leva** para atravessar o sistema? |
| Fonte | demanda do cliente e tempo de trabalho | medição no processo | registros de data e hora ou Lei de Little |
| Fórmula | tempo disponível ÷ demanda | tempo de execução ÷ unidades (medido) | fim − início, ou WIP ÷ throughput |
| Unidade típica | s/unidade | s/unidade | h, dias |
| Linha 3 | 60 s | 56,25 s (ideal 50 s) | 3 dias úteis |
| Quem influencia? | vendas, cliente, padrão de turnos | engenharia, método, manutenção | programação, WIP, tamanhos de lote |
| Direção sensata | nenhuma; é o dado de partida | ≤ takt, com margem | o mais curto possível |
| Erro comum | paradas não subtraídas | uso do valor ideal em vez do valor real | ponto de início não definido |

**Insight-chave do exemplo:** o cycle time real de 56,25 s está abaixo do takt de 60 s. Ainda assim, a linha 3 não atinge a demanda, como mostram as próximas seções, porque o cycle time só se aplica ao tempo de execução. Quebras, trocas de setup e refugo ficam de fora dessa visão. Para o projeto de linha, o que conta é o **cycle time efetivo por peça boa**, ou seja, o tempo de produção planejado dividido pela quantidade de peças boas.

## 6. Tempo de troca, SMED e micro-paradas

### Tempo de troca e participação da troca

O [tempo de troca](https://www.m365.fm/entity/setup-time/) (tempo de setup) é o tempo necessário para mudar uma máquina ou linha de um produto para outro. Na prática, medir desde a última peça boa da produção anterior até a primeira peça boa da nova produção funciona melhor, porque inclui o ajuste e a fase de aquecimento até o regime. [unverified: esta convenção é difundida na prática, mas não está declarada textualmente nas fontes consultadas aqui.] No sistema REFA, o tempo de setup faz parte do tempo de ordem [16].

> **Participação da troca = tempo de troca ÷ tempo de produção planejado × 100 %**

**Exemplo da Linha 3:** 20 min de troca ÷ 450 min = **4,44 %**.

### SMED: trocas em minutos de um dígito

O [SMED](https://www.m365.fm/entity/smed/) (Single-Minute Exchange of Die) é um método para tornar as trocas o mais curtas possível; o objetivo é um tempo de troca de um dígito em minutos, ou seja, abaixo de dez minutos [11]. Shigeo Shingo desenvolveu as ideias centrais nas décadas de 1950 e 1960: ele separou o setup interno, que só pode ser feito com a máquina parada, do setup externo, que pode ser feito com a máquina em funcionamento, e transferiu o máximo possível para o externo [11].

**Exemplo da Linha 3:** se ambas as trocas caírem de 10 para 6 min, a linha ganha 8 min de tempo de operação por turno. Com o desempenho inalterado de 88,9 %, isso representa 8 × 60 ÷ 50 × 0,889 = **cerca de 8,5 peças adicionais** por turno. Alternativamente, a linha pode manter o mesmo tempo total de troca, trocar com mais frequência e produzir lotes menores, o que reduz o WIP e o lead time.

**Erro comum:** tratar o tempo de troca apenas como perda. Trocas mais curtas são, acima de tudo, uma alavanca para lotes menores. Se todo o tempo ganho for usado para lotes maiores, abre-se mão do benefício logístico.

### Micro-paradas

As [micro-paradas](https://www.m365.fm/entity/micro-stops/) (paradas menores) são interrupções curtas, como uma peça travada ou um sensor desarmado, que dificilmente são registradas uma a uma. No framework TPM de Nakajima, elas pertencem às seis grandes perdas como "perdas por marcha lenta e paradas menores" e reduzem o desempenho, não a disponibilidade [7]. Cada empresa define seu próprio limite entre uma micro-parada e uma quebra; limites de alguns minutos são comuns. [unverified: não foi encontrado nenhum padrão com limite vinculante.] Muchiri e Pintelon apontam que o registro manual frequentemente deixa passar pequenas paradas [7].

**Exemplo da Linha 3:** a perda total de desempenho é o tempo de operação menos o tempo ideal das unidades produzidas: 405 min − 432 × 50 s ÷ 60 = 405 − 360 = **45 min**. O controlador da máquina registra 120 micro-paradas de 15 s cada = 30 min. Os 15 min restantes são de redução de velocidade. Sem a captura automática de dados, esses 30 minutos de micro-paradas provavelmente teriam sido registrados no relatório do turno como "linha em operação".

## 7. OEE: como calcular a eficiência global do equipamento

A eficiência global do equipamento (OEE, na sigla em inglês) é o KPI de manufatura mais conhecido. O termo remonta a Seiichi Nakajima e é um elemento central da [Manutenção Produtiva Total (TPM)](https://www.m365.fm/entity/total-productive-maintenance/) [8][6]. O glossário da ASQ descreve o OEE como uma medida de quão bem uma unidade produtiva desempenha em relação à sua capacidade projetada durante os períodos em que está programada para operar, combinando disponibilidade, velocidade e a parcela de produção boa [36]. O OEE responde a uma pergunta: que parcela do tempo de produção planejado foi usada para fabricar peças boas na velocidade ideal?

### Os três fatores

> **OEE = Disponibilidade × Desempenho × Qualidade**

| Fator | Fórmula | Perdas que captura |
|---|---|---|
| Disponibilidade | tempo de operação ÷ tempo de produção planejado | quebras, preparação e ajustes |
| Desempenho (ISO: eficácia) | tempo de ciclo ideal × contagem total ÷ tempo de operação | paradas momentâneas, redução de velocidade |
| Qualidade | contagem de boas peças ÷ contagem total | sucata, retrabalho, perdas de partida |

Muchiri e Pintelon definem disponibilidade como o tempo de operação em porcentagem do tempo de carga, desempenho como o tempo de ciclo teórico multiplicado pela produção real dividido pelo tempo de operação, e a taxa de qualidade como a produção total menos os defeitos em relação à produção total [7]. A ISO 22400-2 usa a mesma lógica, com seus próprios termos de tempo [3].

### As seis grandes perdas

Nakajima atribui as perdas a seis categorias [7]:

1. **Quebras** (perdas por quebra) → disponibilidade
2. **Preparação e ajuste** → disponibilidade
3. **Ociosidade e paradas menores** → desempenho
4. **Redução de velocidade** → desempenho
5. **Defeitos de qualidade e retrabalho** → qualidade
6. **Redução de rendimento na partida** → qualidade

Esse mapeamento é o verdadeiro valor do OEE. O total, isoladamente, diz pouco; somente o detalhamento mostra se a manutenção, a equipe de troca de ferramentas ou a qualidade tem a alavanca mais importante.

### Como calcular o OEE: o exemplo da Linha 3

**Passo 1, disponibilidade:** tempo de produção planejado de 450 min; quebras de 25 min, trocas de 20 min; tempo de operação de 405 min.
Disponibilidade = 405 ÷ 450 = **90,0 %**.

**Passo 2, desempenho:** 432 unidades × 50 s = 21.600 s de tempo ideal; tempo de operação de 405 min = 24.300 s.
Desempenho = 21.600 ÷ 24.300 = **88,9 %**.

**Passo 3, qualidade:** 410 peças boas na primeira passagem de um total de 432 unidades.
Qualidade = 410 ÷ 432 = **94,9 %**.

**Passo 4, OEE:** 0,900 × 0,8889 × 0,9491 = **75,9 %**.

**Verificação cruzada pelo tempo:** contagem de boas peças multiplicada pelo tempo de ciclo ideal, dividida pelo tempo de produção planejado = 410 × 50 s ÷ 27.000 s = 20.500 ÷ 27.000 = **75,9 %**. Os dois caminhos devem dar o mesmo resultado; se não derem, os dados de entrada estão errados.

**O que o OEE significa para o takt:** o tempo de ciclo efetivo por peça boa é 50 s ÷ 0,759 = 65,9 s, acima do takt de 60 s. Em 27.000 s, a linha produz 410 peças boas na primeira passagem, ou 422 incluindo as 12 peças retrabalhadas. A demanda de 450 unidades por turno fica 28 unidades abaixo. Para atendê-la apenas com peças boas na primeira passagem, a Linha 3 precisaria de um OEE de 450 × 50 ÷ 27.000 = 83,3 %.

### Retrabalho: bom ou ruim?

Na lógica do TPM, o retrabalho é uma perda de qualidade [7]; por isso o exemplo conta apenas as 410 peças que estavam boas na primeira passagem. Kang et al. usam uma taxa de qualidade que considera as peças retrabalhadas como boas [3]. Com 422 em vez de 410 peças, a qualidade subiria para 97,7 % e o OEE para 78,1 %. As duas variantes são defensáveis, mas é preciso escolher uma delas e não se pode comparar fábricas que usem definições diferentes.

### TEEP: OEE em relação ao tempo de calendário

A eficácia total do equipamento (TEEP, na sigla em inglês) relaciona o OEE ao tempo total de calendário, e não apenas ao tempo planejado [8]:

> **TEEP = OEE × carregamento**, com **carregamento = tempo de produção planejado ÷ tempo de calendário**

**Exemplo da Linha 3:** 10 turnos × 450 min = 4.500 min de tempo planejado por semana; tempo de calendário 7 × 24 × 60 = 10.080 min.
Carregamento = 4.500 ÷ 10.080 = 44,6 %. TEEP = 75,9 % × 44,6 % = **33,9 %**.

O TEEP é o KPI adequado para decisões de investimento: antes de comprar uma segunda máquina, ele mostra quanto tempo de calendário ocioso o equipamento existente ainda tem. Observe que algumas páginas em inglês atribuem a OEE, OOE e TEEP a mesma fórmula; isso está errado, pois as três diferem na base de tempo.

### Qual é um bom OEE? De onde vem o benchmark de 85 % e por que ele é contestado

A cifra de 85 % como "OEE de classe mundial" é regularmente atribuída a Nakajima em artigos do setor, frequentemente construída a partir de 90 % de disponibilidade, 95 % de desempenho e 99,9 % de qualidade (0,90 × 0,95 × 0,999 = 85,4 %) [37]. Nas fontes primárias e de revisão consultadas para este artigo, a divisão por componentes não pôde ser encontrada literalmente. [unverified: passagem original em Nakajima 1988] A Wikipédia em inglês afirma explicitamente que 85 % não é o alvo correto em muitos casos, por exemplo quando nem todas as perdas são capturadas ou quando os requisitos de qualidade do setor são mais altos [8].

Outros pontos de crítica [8]:

- O OEE se comporta como uma média geométrica e penaliza fatores desiguais: 20 % × 80 % = 16 %, 50 % × 50 % = 25 %.
- As definições diferem entre empresas, por isso o OEE é pouco adequado para comparações entre plantas ou tipos de máquina.
- O OEE não é uma medida do desempenho individual de funcionários.

Use o OEE como um KPI de melhoria para o mesmo ativo ao longo do tempo, não como uma tabela de classificação. Uma planta de processo contínuo operando 24/7 e uma oficina de produção sob encomenda com muitas trocas de ferramental têm valores estruturalmente diferentes.

### Consolidando o OEE de várias máquinas corretamente

Um erro comum em relatórios é calcular a média dos percentuais de OEE. Exemplo: a máquina A tem 80 % de OEE com 450 min de tempo planejado, a máquina B tem 50 % com 150 min.

- Errado (média simples): (80 % + 50 %) ÷ 2 = 65,0 %
- Correto (ponderado pelo tempo): (0,80 × 450 + 0,50 × 150) ÷ (450 + 150) = (360 + 75) ÷ 600 = **72,5 %**

A abordagem mais limpa é recalcular o OEE em cada nível a partir dos tempos somados: soma do tempo que agrega valor (contagem de peças boas × tempo de ciclo ideal) dividida pela soma do tempo planejado. A seção 15 mostra a fórmula DAX correspondente.

## 8. KPIs de qualidade: taxa de sucata, rendimento na primeira passagem, taxa de retrabalho, PPM

Os KPIs de qualidade respondem a duas perguntas diferentes: quanto material e tempo são perdidos dentro da planta (interno) e quantos defeitos chegam ao cliente (externo)? Cada visão exige seus próprios KPIs. A ISO 22400-2 inclui, entre outros, a razão de qualidade, a razão de sucata, a razão de retrabalho e um rendimento na primeira passagem [3]; as razões de sucata e de retrabalho também aparecem na lista de 34 KPIs da ISO elaborada pela Fabrico [38].

### Fórmula da taxa de sucata

A [taxa de sucata](https://www.m365.fm/entity/scrap-rate/) mede a fração de peças que não podem mais ser utilizadas e são descartadas ou recicladas. Na apresentação de Kang et al., a fórmula ISO é a quantidade de sucata dividida pela quantidade produzida [3].

> **Taxa de sucata = contagem de sucata ÷ contagem total × 100 %**

**Exemplo da linha 3:** 10 peças sucateadas ÷ 432 peças × 100 % = **2,31 %**.

**Erros comuns:**
- **Mudar a base.** Às vezes se usa a contagem total, às vezes a contagem de peças boas (10 ÷ 422 = 2,37 %). Com taxas baixas a diferença é pequena; com taxas altas ela importa.
- **Não contar a sucata de partida.** Peças descartadas durante o ajuste após uma troca de ferramental frequentemente não são contabilizadas. No entanto, elas mostram se as trocas estão sob controle.
- **Contar apenas peças, sem valor.** Uma peça sucateada no fim da cadeia de valor custa muitas vezes mais que uma peça bruta. Inclua o custo da sucata na taxa por peça.

### Rendimento na primeira passagem (FPY)

O rendimento na primeira passagem (também "first time through" ou "right first time") mede a fração de unidades que passam por um processo na primeira vez, sem retrabalho e sem sucata. A ASQ descreve o FPY, também chamado de taxa de qualidade, como a porcentagem de unidades que concluem um processo e atendem às diretrizes de qualidade sem serem sucateadas, reprocessadas, retestadas, devolvidas ou desviadas para uma área de reparo fora da linha [36]. Kang et al. apresentam a fórmula como quantidade boa na primeira passagem dividida pela quantidade produzida [3].

> **FPY = unidades boas na primeira passagem ÷ contagem total × 100 %**

**Exemplo da linha 3:** 410 ÷ 432 × 100 % = **94,9 %**.

Para várias etapas do processo, multiplique os valores de FPY das etapas individuais para obter o **rendimento de throughput acumulado (RTY, rolled throughput yield)**. Três estações com FPY de 98 % cada resultam em 0,98 × 0,98 × 0,98 = 94,1 %. O RTY mostra quantas peças atravessam toda a cadeia sem nenhuma correção. [unverified: o RTY é amplamente usado na literatura de Six Sigma, mas não foi verificado em uma fonte primária para este artigo.]

**Qualidade do OEE vs. FPY:** se você trata o retrabalho como perda, o FPY e a taxa de qualidade do OEE são idênticos (ambos 94,9 % no exemplo). Se você conta o retrabalho como bom, a qualidade do OEE iguala o rendimento final: (410 + 12) ÷ 432 = 97,7 %.

### Taxa de retrabalho

> **Taxa de retrabalho = contagem retrabalhada ÷ contagem total × 100 %**

**Exemplo da linha 3:** 12 ÷ 432 × 100 % = **2,78 %**.

A verificação: FPY + taxa de retrabalho + taxa de sucata = 94,91 % + 2,78 % + 2,31 % = 100 %. Essa verificação de soma deve ser executada automaticamente em todo painel; se não fechar, há transações faltando.

O retrabalho costuma ser subestimado porque a peça acaba ficando boa. Mas ele consome pessoas, cria WIP e aumenta o lead time. Registre o tempo de retrabalho assim como a quantidade retrabalhada.

### PPM (partes por milhão)

A ASQ define PPM como uma métrica que informa o número de defeitos normalizado para uma população de um milhão, para facilitar a comparação [36]. Ela é usada principalmente para reclamações de clientes e avaliações de fornecedores.

> **PPM = peças defeituosas ÷ peças expedidas (ou inspecionadas) × 1.000.000**

**Exemplo:** em um trimestre, a planta expede 250.000 peças; o cliente rejeita 18. PPM = 18 ÷ 250.000 × 1.000.000 = **72 ppm**.

Combine com o cliente se contam as peças rejeitadas, os embarques rejeitados ou as reclamações aceitas. Expressar a sucata interna em PPM (Linha 3: 10 ÷ 432 × 1.000.000 = 23.148 ppm) é possível, mas pouco intuitivo; nesse caso, o percentual funciona melhor.

## 9. Indicadores de entrega e estoque: OTIF, aderência ao cronograma, WIP, dias de cobertura

### Entrega no prazo e OTIF

O desempenho de entrega mede a confiabilidade com que a planta cumpre suas promessas aos clientes. A forma mais comum é o **OTIF** (no prazo e completo, do inglês *on time in full*): uma entrega só conta se for no prazo **e** completa.

> **OTIF = linhas de pedido entregues no prazo e completas ÷ todas as linhas de pedido com entrega devida × 100 %**

Não existe uma definição padrão vinculante. A McKinsey observou em 2019 que, sem uma definição padrão, o OTIF é interpretado de formas muito diferentes; em uma pesquisa com 24 grandes varejistas e fabricantes de bens de consumo norte-americanos, 79 % preferiram uma métrica OTIF combinada única em vez de medição separada, e não houve consenso sobre a amplitude da janela de entrega [18].

**Exemplo:** em um mês, 200 linhas de pedido estão com entrega devida. 184 foram entregues no prazo, 190 completas, 178 no prazo e completas.
- No prazo = 184 ÷ 200 = 92,0 %
- Completas = 190 ÷ 200 = 95,0 %
- OTIF = 178 ÷ 200 = **89,0 %**

Observe que o OTIF não é o produto das duas taxas (0,92 × 0,95 = 87,4 %); ele é contado a partir das linhas que atenderam às duas condições ao mesmo tempo.

**Você precisa definir:** a data de referência (data solicitada ou data confirmada), a janela de tolerância (por exemplo ±1 dia), o nível (pedido, linha, quantidade) e se entregas antecipadas contam como no prazo. Grandes clientes frequentemente definem as regras por você: o Walmart, por exemplo, exigiu em 2019 que os fornecedores entregassem carretas completas dentro de uma janela de dois dias em 87 % das vezes e aplicava multas de 3 % do custo dos produtos vendidos nas falhas [47]. Esses programas mudam, por isso verifique a definição atual de cada cliente antes de comparar.

### Aderência ao cronograma na produção

A aderência ao cronograma (conclusão da produção no prazo) mede se as ordens de produção são concluídas na data planejada. É um KPI interno e um indicador antecedente do OTIF com o cliente.

> **Aderência ao cronograma = ordens de produção concluídas no prazo ÷ todas as ordens de produção com vencimento × 100 %**

**Exemplo:** 102 das 120 ordens com vencimento foram concluídas no prazo: **85,0 %**.

Nyhuis e Wiendahl justificam seu modelo de curvas de operação logística em parte pelo desempenho insatisfatório das metas logísticas em muitas empresas [14]. [unverified: resumo truncado na versão recuperada após esta parte da frase] Acrescente à taxa o desvio médio do cronograma em dias; 85 % de aderência com um dia de atraso é algo diferente de 85 % com duas semanas de atraso.

### WIP (trabalho em processo)

O trabalho em processo abrange todos os produtos inacabados entre a liberação do material e a conclusão. Ele é informado em peças (para controle) ou em dólares (para finanças). A Lei de Little vincula diretamente o WIP ao lead time [13]: a Linha 3 tem 2.700 peças de WIP com vazão diária de 900 peças, portanto 3 dias de lead time. Se a equipe reduzir o WIP para 1.800 peças mantendo a mesma vazão, o lead time cai para 2 dias.

### Dias de cobertura (cobertura de estoque)

> **Dias de cobertura = estoque ÷ uso médio diário (ou demanda)**

**Exemplo:** estoque de produtos acabados de 2.250 unidades, demanda de 900 unidades por dia. Dias de cobertura = 2.250 ÷ 900 = **2,5 dias**.

Matematicamente, os dias de cobertura são a Lei de Little aplicada a um único ponto de estoque. Use a demanda prevista quando a demanda oscilar fortemente; caso contrário, a cobertura baseada no histórico pode parecer enganosamente alta ou baixa.

## 10. Capacidade e produtividade: utilização, eficiência de utilização, produtividade da mão de obra

### Utilização da capacidade

A utilização compara a carga (capacidade necessária segundo os tempos padrão) com a capacidade disponível.

> **Utilização da capacidade = carga ÷ capacidade disponível × 100 %**

**Exemplo:** as ordens com 4.050 min de tempo padrão estão programadas no posto gargalo para a semana; a capacidade disponível é de 4.500 min. Utilização = 4.050 ÷ 4.500 = **90,0 %**.

**Por que 100 % não é uma meta:** as curvas operacionais logísticas de Nyhuis e Wiendahl descrevem a relação entre WIP, produção e lead time de um sistema de trabalho [14]. À medida que a utilização se aproxima do limite de capacidade, as filas e os lead times crescem de forma desproporcional, porque cada interrupção e cada flutuação já não podem ser absorvidas. O gargalo deve operar com alta utilização; os não gargalos precisam de reserva. Defina uma faixa-alvo em vez de um máximo.

### Utilização não é eficiência de utilização

Os termos são frequentemente confundidos. **Utilização da capacidade** é um indicador de planejamento (quanto trabalho está carregado na capacidade?). **Eficiência de utilização** (ISO 22400) é um indicador de execução: a razão entre o tempo real de produção (APT) e o tempo real de ocupação da unidade (AUBT) [3]. Uma máquina pode estar 95 % carregada e, ainda assim, ter baixa eficiência de utilização se grande parte do tempo ocupado for perdida em paradas e esperas. Para a Linha 3, a razão entre tempo de operação e tempo ocupado é 405 ÷ 450 = 90 %, que, neste caso simples, equivale à disponibilidade do OEE; em plantas que registram separadamente os tempos de setup e de ocupação, os valores diferem.

### Produtividade

Produtividade é a razão entre produção e insumos. Na manufatura, costuma-se medir **produtividades parciais**, porque os fatores de insumo não podem ser somados de forma significativa.

> **Produtividade da mão de obra = quantidade boa ÷ horas de mão de obra trabalhadas**

**Exemplo da Linha 3:** 422 peças boas (incluindo retrabalhadas) ÷ (6 operadores × 8 h) = 422 ÷ 48 = **8,79 unidades por hora de mão de obra**.

**Erros comuns:** confundir produtividade com razão de desempenho (produção real versus padrão é uma razão de desempenho ou eficiência, não produtividade), contar a produção total em vez da produção boa e comparar produtividade entre produtos com conteúdos de trabalho diferentes. Para plantas de alto mix, horas padrão ganhas por hora apontada é uma medida mais adequada.

## 11. KPIs de manutenção: MTBF, MTTR e disponibilidade inerente

A ISO 22400 inclui MTBF e MTTR como KPIs de manutenção [38][3]. Eles decompõem a perda de disponibilidade causada por quebras em duas perguntas: com que frequência a máquina falha e quanto tempo leva até voltar a funcionar?

> **MTBF (tempo médio entre falhas) = tempo de funcionamento ÷ número de falhas**
> **MTTR (tempo médio para reparo) = tempo total de reparo ÷ número de falhas**

**Exemplo da Linha 3, um mês:** 40 turnos de 405 min de funcionamento cada = 16.200 min; 40 falhas totalizando 1.000 min.
- MTBF = 16.200 ÷ 40 = **405 min** (6,75 h)
- MTTR = 1.000 ÷ 40 = **25 min**

A partir desses valores é possível derivar a **disponibilidade inerente (técnica)**, que considera apenas as quebras:

> **Disponibilidade inerente = MTBF ÷ (MTBF + MTTR)**

405 ÷ (405 + 25) = 405 ÷ 430 = **94,2 %**. A disponibilidade de 90 % do OEE é menor porque também inclui o tempo de troca de ferramentas.

**Erros comuns:** o MTTR pode medir apenas o reparo, não o tempo de resposta até a chegada do técnico; defina qual tempo você quer medir e meça resposta e reparo separadamente. Uma média calculada sobre poucos eventos também é altamente aleatória; o MTBF só se torna confiável ao longo de vários meses. E não confunda MTBF com MTTF (tempo médio até a falha), que se aplica a itens não reparáveis; algumas páginas em inglês muito bem ranqueadas misturam os dois conceitos.

## 12. Energia, segurança (TRIR, DART, LTIFR) e custo por unidade

### Energia por unidade

Em muitas fábricas, a energia tornou-se um bloco de custo que merece seu próprio KPI. A ISO 22400-2 foi estendida com KPIs de energia em 2017 [1]; para a gestão de energia, a ISO 50006:2023 (segunda edição, substituindo a versão de 2014) descreve como construir indicadores de desempenho energético (EnPIs) e linhas de base energéticas [22][34].

> **Consumo específico de energia = energia consumida no período ÷ contagem de peças boas**

**Exemplo da Linha 3:** 1.520 kWh por turno ÷ 422 peças boas = **3,60 kWh por unidade**.

Atenção à carga base: uma linha que mantém ar comprimido e aquecimento em funcionamento enquanto parada parece muito pior por unidade em baixa produção. Uma reta de regressão simples, com um componente de carga base e outro dependente do volume, informa mais do que a razão simples.

### KPIs de segurança: TRIR e taxa DART da OSHA

Em um sistema de KPIs SQCDP, a segurança vem em primeiro lugar. Nos EUA, a referência é a norma de registros da OSHA (29 CFR Parte 1904). A OSHA calcula as taxas de incidência com uma única fórmula [42]:

> **Taxa de incidência = número de lesões e doenças × 200.000 ÷ horas trabalhadas pelos empregados**

O 200.000 corresponde às horas que 100 empregados trabalham, à razão de 40 horas por semana durante 50 semanas por ano [42]; assim, o resultado se lê como "casos por 100 trabalhadores equivalentes em tempo integral". Duas variantes são padrão:

- **TRIR** (taxa total de incidentes registráveis, também chamada taxa total de casos de incidentes): todos os casos registráveis. Casos registráveis são lesões e doenças relacionadas ao trabalho que resultem em morte, perda de consciência, dias afastados, trabalho restrito ou transferência de função, ou tratamento médico além de primeiros socorros, entre outros critérios [46].
- **Taxa DART:** apenas os casos com dias afastados, atividade de trabalho restrito ou transferência de função [46].

**Exemplo:** 5 casos registráveis, 3 deles casos DART, em uma fábrica com 420.000 horas trabalhadas por ano.
TRIR = 5 × 200.000 ÷ 420.000 = **2,38**. Taxa DART = 3 × 200.000 ÷ 420.000 = **1,43**.

Para contexto: segundo o Bureau of Labor Statistics, a indústria privada dos EUA registrou uma taxa total de casos registráveis de 2,3 casos por 100 trabalhadores equivalentes em tempo integral em 2025 (divulgado em 18 de novembro de 2026) [43]. O gráfico do BLS para 2025 mostra 2,5 casos por 100 trabalhadores em tempo integral para a manufatura, com 304.200 casos [44][43]. São médias nacionais, não referências para a sua fábrica; compare com o seu setor industrial NAICS.

Separadamente das taxas, a OSHA exige que os empregadores comuniquem uma morte relacionada ao trabalho em até 8 horas e uma internação hospitalar, amputação ou perda de olho em até 24 horas (29 CFR 1904.39) [45].

### LTIFR e a taxa alemã por 1.000 trabalhadores

Grupos multinacionais também costumam usar a **LTIFR** (taxa de frequência de lesões com afastamento), que usa como base um milhão de horas em vez de 200.000:

> **LTIFR = número de lesões com afastamento ÷ horas trabalhadas × 1.000.000**

A Safe Work Australia define a LTIFR como o número de lesões com afastamento por milhão de horas trabalhadas; uma lesão com afastamento é aquela que resulta em pelo menos um dia ou turno completo fora do trabalho [21].

**Exemplo:** 3 acidentes com afastamento e 420.000 horas trabalhadas por ano: 3 ÷ 420.000 × 1.000.000 = **7,14**. Observe que esta é a mesma fábrica mencionada acima: uma taxa DART de 1,43 e uma LTIFR de 7,14 descrevem os mesmos três casos (1,43 × 5 = 7,14) se os três casos DART envolveram dias de afastamento do trabalho. A DART também conta os casos de trabalho restrito e de transferência de função, que a maioria das definições de LTI exclui. Sempre informe a base ao comparar unidades.

As fábricas alemãs reportam a "taxa por 1.000 trabalhadores": acidentes notificáveis por 1.000 equivalentes em tempo integral. Um acidente é notificável na Alemanha se o segurado morrer ou ficar incapaz de trabalhar por mais de três dias (Seção 193 (1) do Código Social Alemão, Livro VII) [20]. A associação de seguro de acidentes do trabalho alemã DGUV informou 19,9 acidentes de trabalho notificáveis por 1.000 equivalentes em tempo integral para 2025, 3,2 % abaixo do ano anterior [19]. **Exemplo:** 4 acidentes notificáveis com 250 equivalentes em tempo integral resultam em 4 ÷ 250 × 1.000 = **16,0**. Como os limites de notificação são diferentes, essa taxa não pode ser comparada diretamente com uma taxa da OSHA.

Complemente esses indicadores atrasados com indicadores antecedentes, como quase acidentes reportados e ações de segurança concluídas. Um número decrescente de quase acidentes reportados pode ser um sinal de alerta se refletir uma cultura de reporte mais fraca.

### Custo por unidade

> **Custo por unidade = custo do período ÷ quantidade de peças boas**

**Exemplo da Linha 3, um turno (valores ilustrativos em dólares americanos):**
- Mão de obra: 6 × 8 h × US$ 45/h = US$ 2.160
- Máquina (depreciação, manutenção, área ocupada): 8 h × US$ 60/h = US$ 480
- Material: 432 peças × US$ 4,00 = US$ 1.728 (a sucata também consome material)
- Total: US$ 4.368

Custo por unidade = US$ 4.368 ÷ 422 peças boas = **US$ 10,35 por unidade**.

O cálculo mostra a ligação com a OEE: se todas as 432 peças fossem boas na primeira passagem, o custo por unidade cairia para US$ 4.368 ÷ 432 = US$ 10,11 sem que nenhuma taxa mudasse. Com custos fixos, o volume de produção tem o papel principal, por isso o custo por unidade é difícil de interpretar sem considerar o volume. Para decisões de fazer ou comprar ou de precificação, você também precisa dos custos fixos e variáveis separadamente. Como transformar melhorias em um caso de negócio sólido está abordado no post [The Business Case for Operational Excellence: How to Prove ROI](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roi-business-case/).

## 13. Sistemas de KPI: hierarquia, indicadores antecedentes e defasados, SQCDP

KPIs individuais são medições. Um **sistema de KPI** organiza essas medições de modo que cada nível veja os números que pode influenciar, e os números dos níveis inferiores se agreguem logicamente aos dos níveis superiores.

### Hierarquia: planta, área, linha, posto de trabalho

| Nível | KPIs típicos | Cadência | Fórum |
|---|---|---|---|
| Planta | OTIF, custo por unidade, PPM de cliente, TRIR, dias de cobertura | semanal, mensal | reunião da liderança da planta |
| Área | aderência ao cronograma, lead time, OEE do gargalo, custo de sucata, produtividade | diária, semanal | reunião de área (Tier 3) |
| Linha | unidades planejadas vs. realizadas por hora, OEE, FPY, principais motivos de parada, ações abertas | por turno | reunião de linha (Tier 2) |
| Posto de trabalho/máquina | unidades por hora vs. takt, quebras, micro-paradas, desvios de qualidade | horária, por turno | reunião rápida da equipe (Tier 1) |

Os níveis estão ligados por cadeias de causa e efeito: a queda do OTIF no nível da planta pode ser rastreada pela aderência ao cronograma na área, até o OEE e os motivos de parada de uma única máquina. Essa é exatamente a cadeia que uma [reunião em tiers](https://www.m365.fm/entity/tier-meeting/) utiliza: cada nível analisa seus números, escalona o que não consegue resolver sozinho e recebe retorno do nível superior. O guia [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/) descreve essas rotinas em detalhes.

### Indicadores antecedentes e defasados

**Indicadores defasados** medem resultados que já ocorreram: OTIF, custo por unidade, a taxa de sucata do mês, TRIR. Eles são importantes para o atingimento de metas, mas chegam tarde demais para contramedidas.

**Indicadores antecedentes** medem os fatores que predizem o resultado: aderência ao cronograma do processo a montante, WIP antes do gargalo, tempo de troca, conformidade da manutenção preventiva, quase acidentes, unidades por hora em relação ao takt. A Fabrico destaca corretamente que um KPI precisa disparar uma ação [35]; os indicadores antecedentes fazem isso enquanto ainda há tempo para agir.

Uma boa regra prática: os indicadores antecedentes predominam nos níveis inferiores, e os defasados, no nível da planta. Cada KPI defasado no nível da planta deve ter pelo menos um indicador antecedente atribuído no nível da linha.

### SQCDP: uma estrutura para painéis e reuniões

Muitas plantas organizam seus KPIs pelo **SQCDP**: Safety (segurança), Quality (qualidade), Cost (custo), Delivery (entrega) e People (pessoas). A ordem é deliberada: segurança antes de qualidade, qualidade antes de custo. [unverified: o SQCDP é uma convenção de prática, não um padrão; sua origem não pode ser documentada com clareza.] As plantas também usam variantes com outra ordem ou sem People (por exemplo, SQDC).

| Categoria | Linha 3, KPIs de exemplo |
|---|---|
| S | lesões e quase acidentes do turno, ações de segurança abertas |
| Q | FPY 94,9 %, taxa de sucata 2,31 %, reclamações de clientes |
| C | custo por unidade US$ 10,35, energia 3,60 kWh/unidade |
| D | planejado 450 / realizado 422 peças boas, OEE 75,9 %, aderência ao cronograma |
| P | presença, matriz de habilidades, ideias de melhoria implementadas |

As categorias protegem contra uma fixação unilateral na produção. Se você mede apenas a produção, obtém produção às custas da qualidade e da segurança.

## 14. Coleta de dados e qualidade dos dados

A melhor fórmula é inútil se os dados de entrada estiverem errados. Na prática, projetos de KPI fracassam com mais frequência por causa dos dados do que por causa do método.

### Comparação dos métodos de coleta de dados

| Método | Descrição | Pontos fortes | Pontos fracos |
|---|---|---|---|
| Manual (folha de contagem, registro de turno, Excel) | operadores anotam contagens e paradas | rápido de começar, gera conscientização, não exige TI | micro-paradas ficam de fora, arredondamentos, lançamentos feitos depois, alto esforço |
| Terminais de dados de produção | terminais para início/fim de ordem, quantidades, motivos de parada | motivos estruturados, contexto da ordem | depende da disciplina no apontamento |
| Coleta de dados de máquina | sinais do controlador (operando, parada, contador) | tempos completos, inclusive paradas curtas | motivos ausentes sem a entrada do operador |
| MES | integra dados de produção e de máquina, controle de qualidade e de ordens; KPIs conforme ISO 22400, ISA-95 Nível 3 (VDMA 66412-1 na Alemanha) | definições consistentes, tempo real | esforço de implantação, manutenção dos dados mestres |
| Retrofit com IoT | sensores e gateways em máquinas existentes, dados em uma plataforma em nuvem | funciona com máquinas antigas, escalável | o contexto (ordem, produto) precisa ser acrescentado |

A rota pragmática é uma combinação: sinais das máquinas fornecem tempos e contagens, enquanto os operadores registram no terminal o motivo de uma parada e as decisões de qualidade. Muchiri e Pintelon apontam a precisão da coleta de dados como um dos maiores desafios da medição de OEE [7]. Como conectar tecnicamente máquinas, MES e nuvem é tratado no guia [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/).

### Cinco regras para KPIs confiáveis

1. **Um único modelo de tempos para todos.** Defina quais tempos pertencem ao tempo planejado de produção (pausas? manutenção? testes? sem ordens?). A ISO 22400-2 e a VDMA 66412-1 oferecem um modelo [1][4].
2. **Um catálogo de motivos de parada com no máximo dois níveis.** Motivos demais levam a "outros"; motivos de menos resultam em Paretos sem significado. Associe cada motivo claramente a uma única categoria de perda de OEE.
3. **Manter os tempos de ciclo ideais atualizados.** O desempenho do OEE depende inteiramente desses dados mestres. Um padrão generoso demais leva a desempenho acima de 100 % ou oculta perdas.
4. **Automatizar verificações de plausibilidade.** FPY + retrabalho + refugo = 100 %; tempo de operação ≤ tempo planejado; desempenho ≤ 100 %; soma das paradas ≤ duração do turno.
5. **Tornar a definição visível.** Cada KPI tem uma ficha de definição com finalidade, fórmula, fonte de dados, responsável, periodicidade e meta.

### A ficha de definição do KPI

| Campo | Exemplo: OEE Linha 3 |
|---|---|
| Finalidade | tornar visíveis as perdas da máquina gargalo e priorizá-las |
| Fórmula | disponibilidade × desempenho × qualidade; verificação cruzada: quantidade boa × tempo de ciclo ideal ÷ tempo planejado |
| Fonte de dados | dados da máquina (operando/parado, contador), terminal (motivo de parada, refugo, retrabalho) |
| Definições | tempo planejado = turno menos pausas; trocas de ferramental contam como perda de disponibilidade; retrabalho conta como perda de qualidade |
| Responsável | supervisor de turno da Linha 3 |
| Periodicidade | por turno, tendência semanal |
| Meta | 80 % até o fim do 2º trimestre (linha de base 75,9 %, ver Seção 16) |
| Escalonamento | dois turnos consecutivos abaixo de 70 % → reunião de Nível 2 |

## 15. Visualização: painéis no chão de fábrica e dashboards no Power BI

### O painel do chão de fábrica

Na estação de trabalho, a legibilidade em poucos segundos importa mais do que a completude. [Gestão visual](https://www.m365.fm/entity/visual-management/) aqui significa: planejado e realizado por hora, um vermelho/verde claro em relação à meta, os três principais motivos de parada e uma lista de ações com responsáveis e prazos. Painéis hora a hora funcionam bem: a equipe registra a quantidade planejada e a realizada para cada hora (Linha 3: 60 peças em cada hora cheia de produção com takt de 60 s, correspondentemente menos nas horas com pausa) e dá imediatamente um breve motivo para cada desvio. Como unir fluxo e painel é descrito no post [Otimização do Chão de Fábrica: Caminhos para Melhorar o Fluxo](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/).

Painéis digitais não substituem automaticamente o quadro branco. Eles compensam quando os dados já são capturados automaticamente, quando vários turnos ou locais precisam da mesma visão e quando as ações precisam ser acompanhadas. A discussão em equipe continua a mesma.

### Dashboard no Power BI: estrutura

Para o nível de área e de fábrica, o Power BI é uma ferramenta óbvia se a empresa já usa o Microsoft 365. Uma estrutura de três páginas comprovada:

1. **Visão geral (fábrica):** indicadores SQCDP com realizado, meta e tendência; semáforos apenas onde uma meta está definida.
2. **Linha:** OEE como gráfico em cascata, do tempo planejado passando pelas seis categorias de perda até o tempo que agrega valor; Pareto dos motivos de parada; FPY e sucata ao longo do tempo.
3. **Detalhe e ações:** tabelas por turno e por ordem com drill-through, vinculadas à lista de ações.

Para metas, check-ins e responsáveis, o Power BI também oferece scorecards com metas. Segundo a Microsoft, criar e compartilhar scorecards é um recurso do Pro; a visualização é possível com licença Pro ou como usuário gratuito em um workspace em capacidade Premium ou Fabric F64 ou superior [29].

### Modelo de dados: esquema estrela

A Microsoft recomenda um esquema estrela para o Power BI: tabelas de dimensão descrevem entidades de negócio e são usadas para filtrar e agrupar; tabelas de fatos armazenam eventos e são usadas para agregação [27]. Para os KPIs de manufatura, isso significa:

| Tabela | Tipo | Conteúdo (colunas de exemplo) |
|---|---|---|
| FactProduction | fato | Date, ShiftID, LineID, ProductID, PlannedMin, BreakdownMin, ChangeoverMin, TotalQty, GoodFirstPass, Rework, Scrap, IdealCycleSec |
| FactDowntime | fato | Start, End, DurationMin, LineID, ReasonID |
| DimDate | dimensão | Date, Week, Month, WorkingDay sim/não |
| DimShift | dimensão | ShiftID, Name, Start, End |
| DimLine | dimensão | LineID, Line, Area, Plant |
| DimProduct | dimensão | ProductID, Product, ProductFamily |
| DimDowntimeReason | dimensão | ReasonID, Reason, LossCategory (quebra, troca de ferramental, microparadas …) |

A coluna LossCategory na dimensão de motivos é a chave da cascata de perdas: ela associa cada motivo de parada a uma das seis grandes perdas.

### Exemplo de DAX: agregando o OEE corretamente

As medidas a seguir calculam o OEE de forma que ele se consolide corretamente em todos os níveis (turno, linha, semana, fábrica), pois é construído a partir de tempos somados e não de médias. `DIVIDE` retorna BLANK em vez de erro quando o denominador é zero [25]; a Microsoft recomenda a função quando o denominador pode ser zero ou vazio, e o operador `/` quando o denominador é uma constante [26].

```dax
Planned Min =
SUM ( FactProduction[PlannedMin] )

Run Min =
[Planned Min]
    - SUM ( FactProduction[BreakdownMin] )
    - SUM ( FactProduction[ChangeoverMin] )

Ideal Min =
SUMX (
    FactProduction,
    FactProduction[TotalQty] * FactProduction[IdealCycleSec] / 60
)

Value Adding Min =
SUMX (
    FactProduction,
    FactProduction[GoodFirstPass] * FactProduction[IdealCycleSec] / 60
)

Availability =
DIVIDE ( [Run Min], [Planned Min] )

Performance =
DIVIDE ( [Ideal Min], [Run Min] )

Quality (time-weighted) =
DIVIDE ( [Value Adding Min], [Ideal Min] )

OEE =
DIVIDE ( [Value Adding Min], [Planned Min] )
```

**Por que a qualidade é ponderada pelo tempo aqui:** para um único produto, `Value Adding Min ÷ Ideal Min` é idêntico a contagem de boas ÷ contagem total. Com vários produtos que têm tempos ideais diferentes, esta forma pondera cada peça pelo seu tempo ideal. Só assim disponibilidade × desempenho × qualidade = OEE vale exatamente em todos os níveis de agregação, porque o tempo de operação e o tempo ideal se cancelam. Uma taxa de qualidade baseada em peças é útil como medida adicional, mas não deve entrar na multiplicação do OEE.

**Verificação com a Linha 3:** tempo planejado 450, tempo de operação 405, tempo ideal 432 × 50 ÷ 60 = 360, tempo que agrega valor 410 × 50 ÷ 60 = 341,67 min. Disponibilidade 90,0 %, desempenho 88,9 %, qualidade 94,9 %, OEE 341,67 ÷ 450 = 75,9 %. As medidas reproduzem o cálculo manual da Seção 7.

Mais uma medida para a verificação do takt:

```dax
Effective Cycle Time per Good Part Sec =
DIVIDE (
    [Planned Min] * 60,
    SUM ( FactProduction[GoodFirstPass] )
)
```

Para a Linha 3, isso dá 27.000 ÷ 410 = 65,9 s, acima do takt de 60 s.

Os KPIs de qualidade da Seção 8 seguem o mesmo padrão:

```dax
FPY =
DIVIDE (
    SUM ( FactProduction[GoodFirstPass] ),
    SUM ( FactProduction[TotalQty] )
)

Scrap Rate =
DIVIDE (
    SUM ( FactProduction[Scrap] ),
    SUM ( FactProduction[TotalQty] )
)

Rework Rate =
DIVIDE (
    SUM ( FactProduction[Rework] ),
    SUM ( FactProduction[TotalQty] )
)

Quality Sum Check =
[FPY] + [Scrap Rate] + [Rework Rate]
```

`Quality Sum Check` deve ser igual a 100 %; a formatação condicional que sinaliza desvios em vermelho torna imediatamente visíveis as transações ausentes.

**Dois pontos de atenção para desenvolvedores do Power BI:**
- **Contagem dupla de paradas.** Se os minutos de quebra e de troca de ferramental estiverem armazenados tanto em `FactProduction` quanto em `FactDowntime`, calcule o tempo de operação a partir de apenas uma das duas tabelas. A abordagem mais robusta é manter `FactProduction` na granularidade de turno, linha e produto, e agregar ali os minutos de parada de `FactDowntime` no Power Query.
- **Granularidade do tempo planejado.** Se mais de um produto for produzido em um turno, o tempo planejado precisa ser dividido entre os produtos (por exemplo, pelas datas de início e fim da ordem). Se o tempo total do turno estiver em cada linha de produto, ele será contado várias vezes na soma.

### Observações sobre licenciamento

Segundo a Microsoft Learn (página atualizada em 24 de agosto de 2026): usuários com licença gratuita podem criar relatórios para uso próprio, mas não podem compartilhá-los. Publicar e compartilhar exige o Power BI Pro. Usuários gratuitos só podem visualizar conteúdo compartilhado se ele estiver em um workspace em capacidade Power BI Premium ou capacidade Fabric F64 ou superior. Com o Premium Per User (PPU), o conteúdo só pode ser compartilhado com outros usuários PPU, a menos que esteja em uma capacidade Premium [28]. Para um painel de chão de fábrica que muitos supervisores apenas consultam, o licenciamento é, portanto, uma decisão de arquitetura. Verifique os preços e as condições atuais com a Microsoft; eles intencionalmente não são citados aqui.

## 16. Como definir metas de KPI

As metas são o ponto em que os KPIs mais costumam causar danos. Três princípios ajudam.

**1. Parta da sua própria linha de base, não de um benchmark.** Meça com precisão por pelo menos quatro a oito semanas antes de definir uma meta. A Linha 3 com 75,9 % de OEE pouco se beneficia de uma meta de classe mundial de 85 % enquanto ninguém souber qual perda atacar primeiro.

**2. Derive as metas da demanda.** No exemplo, a meta decorre diretamente do cliente: para 450 peças boas por turno, a Linha 3 precisa de um OEE de 83,3 % se apenas as peças boas na primeira passagem forem contadas (Seção 7). Uma meta intermediária sensata é 80 %; isso representa 4,1 pontos percentuais de distância. Matematicamente, equivale a (0,800 − 0,759) × 450 min = cerca de 18,3 min de tempo de agregação de valor por turno, por exemplo por meio de menos microparadas (potencial de 30 min) ou trocas de ferramenta mais curtas (potencial de 8 min com SMED).

**3. Use faixas de meta em vez de valores pontuais para KPIs com compensações.** Utilização, WIP e dias de cobertura não seguem a lógica de "quanto maior, melhor". Uma faixa (por exemplo, dias de cobertura de 2 a 3 dias) impede que uma equipe reduza estoques a ponto de prejudicar a entrega. Drees e Sack descrevem exatamente essa tensão entre redução de estoque, produtividade dos recursos, capacidade de entrega e redução do lead time para os KPIs do fluxo de valor [32].

**Sobre benchmarks externos:** os valores setoriais de OEE, refugo ou MTTR citados em muitas páginas de fornecedores geralmente vêm de dados próprios de clientes, sem método divulgado [37]. Use-os no máximo como orientação aproximada, nunca como meta. A exceção são estatísticas oficiais com método publicado, como as taxas de lesões do BLS por setor NAICS [43].

## 17. Erros comuns e como evitá-los

| Erro | Consequência | Contramedida |
|---|---|---|
| Sobrecarga de KPIs: 30 KPIs no painel | ninguém sabe o que importa; reuniões viram palestras | 5 a 8 KPIs por nível, organizados por SQCDP |
| KPI sem definição | cada área calcula de um jeito; comparações não têm valor | ficha de definição, termos conforme ISO 22400 (VDMA 66412-1 na Alemanha) |
| Média de percentuais | OEE da fábrica distorcido | recalcular os KPIs em cada nível a partir das somas |
| KPI como avaliação de desempenho individual | manipulação de dados, paradas ocultas | KPIs para processos, não para pessoas |
| Meta sem caminho | frustração, maquiagem dos números | cada meta sustentada por análise de perdas e plano de ação |
| Apenas indicadores atrasados | contramedidas chegam tarde demais | atribuir um indicador antecedente a cada indicador atrasado |
| Tempos padrão generosos demais | desempenho acima de 100 % ou perdas ocultas | justificar tecnicamente os tempos ideais e revisá-los anualmente |
| Dados sem rotina | o painel deixa de ser consultado após três meses | cadências fixas de reunião com os KPIs como pauta |
| Comparar taxas de segurança com bases diferentes | TRIR, DART, LTIFR e taxas alemãs misturadas | sempre informar fórmula e base (200.000 h, 1 milhão de h, 1.000 FTE) |

### Lei de Goodhart

Em 1975, o economista britânico Charles Goodhart observou que qualquer regularidade estatística observada tende a entrar em colapso quando é submetida a pressão para fins de controle [24]. A antropóloga Marilyn Strathern condensou isso em 1997 na conhecida frase "Quando uma medida se torna uma meta, ela deixa de ser uma boa medida" [23]. No chão de fábrica, isso se manifesta assim: se o OEE estiver vinculado a bônus, as trocas de ferramenta são evitadas (lotes maiores, mais estoque), as paradas são reclassificadas como "planejadas" ou os tempos padrão são esticados. O KPI sobe; a fábrica não melhora.

Três antídotos: sempre analisar um KPI junto com um contra-KPI (OEE com estoque e OTIF), manter as definições centralizadas e registrar as mudanças, e usar os KPIs nas reuniões como motivo para fazer perguntas, não como veredito.

## 18. Roteiro: implantar KPIs de manufatura em 90 dias

O roteiro a seguir funciona como uma estrutura para uma linha ou uma área. Ele não exige software; o software acelera as fases 2 e 3.

**Fase 1, semanas 1 a 3: propósito e definições**
- Esclarecer os objetivos da área (o que o cliente quer? onde estão as maiores perdas?).
- Selecionar de 5 a 8 KPIs, pelo menos um por categoria SQCDP.
- Definir o modelo de tempo, o catálogo de motivos de parada e as fichas de definição; verificar os tempos de ciclo ideais.

**Fase 2, semanas 4 a 8: medir e aprender**
- Iniciar a coleta de dados, manualmente ou, no início, de forma semiautomática, se necessário.
- Verificar a plausibilidade diariamente; refinar as definições sempre que surgirem dúvidas.
- Estabelecer linhas de base ao longo de pelo menos quatro semanas.

**Fase 3, semanas 9 a 12: gerenciar**
- Derivar as metas a partir da demanda e da linha de base.
- Construir o quadro de gestão e, quando for útil, um relatório no Power BI.
- Estabelecer rotinas em níveis: Nível 1 por turno, Nível 2 diariamente, Nível 3 semanalmente.
- Escolher os primeiros temas de melhoria a partir dos Pareto de perdas e trabalhá-los com PDCA.

**Depois disso:** verificar trimestralmente se cada KPI ainda orienta uma decisão. KPIs que ninguém usa são descartados. A integração dos KPIs em um sistema de melhoria mais amplo é tratada nos guias [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) e [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/). As metas para o gargalo também alimentam diretamente o sequenciamento, veja [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

## 19. KPIs a partir da modelagem do fluxo de valor: iFAKT Polaris

> **Nota: O autor trabalha na iFAKT GmbH.**

A [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), com sede em Stuttgart, Alemanha, desenvolve software para planejamento e otimização de processos logísticos e produtivos com base na tecnologia da Microsoft [33]. A empresa trabalha com KPIs há muito tempo: em 2011, Jörg Drees e Christoph Sack demonstraram na revista alemã ZWF (Zeitschrift für wirtschaftlichen Fabrikbetrieb) que os KPIs do fluxo de valor facilmente entram em conflito entre redução de estoques, produtividade dos recursos, capacidade de entrega e redução do lead time, e que um conjunto de KPIs escolhido deliberadamente, combinado com métodos lean, permite circuitos de controle duradouros [32].

Segundo o fornecedor, a família de software [iFAKT Polaris](https://www.m365.fm/entity/polaris/) inclui Value Stream Mapping, Business Swim Lane Mapping, Designer, Simulator, Optimizer, Operator e Analyzer [31]. Dois deles são relevantes para KPIs de manufatura:

- **[Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)**, segundo o ifakt.de, reúne KPIs de todos os módulos do Polaris em painéis estruturados, visualiza lead times, utilização, gargalos e status de projetos, mostra limites de capacidade e potencial de melhoria, e compara cenários, planos e desempenho real [30]. A página do fornecedor não traz informações sobre integrações, modelo de implantação ou preços.
- **Polaris VSM**, segundo o fornecedor, calcula automaticamente KPIs lean como lead time, tempo de ciclo, WIP, razão de valor agregado e fator de fluxo a partir do modelo do fluxo de valor, oferece painéis para lead time, WIP, razão de valor agregado e OEE, e compara lado a lado os KPIs de cenários [31].

**Avaliação:** uma ferramenta desse tipo não substitui definições claras nem a rotina de reuniões. Seu valor está em calcular os KPIs de forma consistente a partir de um único modelo e em comparar cenários antes da implementação, por exemplo o efeito de um limite de WIP sobre o lead time e o OTIF. Se ela se adequa à sua fábrica deve ser verificado como qualquer outra solução: com base nos seus dados, no seu cenário de TI e nas decisões que os KPIs devem apoiar. Mais sobre a família de produtos está no guia [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/).

## 20. Glossário

| Termo | Explicação |
|---|---|
| Disponibilidade (OEE) | tempo de operação ÷ tempo planejado de produção [7] |
| Tempo de ciclo | tempo medido para concluir uma unidade em um processo [10] |
| Taxa DART | taxa OSHA de casos com dias afastados, trabalho restrito ou transferência de função por 100 FTE [42][46] |
| Dias de cobertura | estoque ÷ consumo médio diário |
| Efetividade (ISO 22400) | corresponde ao desempenho do OEE: tempo de operação planejado por item × quantidade ÷ tempo real de produção [3] |
| Fator de fluxo | lead time ÷ tempo de operação (Wiendahl) [14][15] |
| FPY | first pass yield, percentual de unidades boas sem retrabalho ou sucata [36] |
| ISA-95 | ANSI/ISA-95 (IEC 62264); Nível 3 = gestão de operações de manufatura [40] |
| Indicador atrasado | KPI que mede um resultado que já ocorreu |
| Lead time | tempo do início ao fim de uma ordem, incluindo todo o tempo de espera, fila e transporte [10][15] |
| Indicador antecedente | KPI que prevê um resultado futuro |
| Lei de Little | L = λW: WIP médio = vazão × lead time médio [13] |
| Carregamento | tempo planejado de produção ÷ tempo de calendário; fator do TEEP [8] |
| MES | sistema de execução da manufatura; ISA-95 Nível 3 [40]; diretriz de KPI VDMA 66412-1 na Alemanha [4] |
| MTBF / MTTR | tempo médio entre falhas / tempo médio para reparo |
| OEE | disponibilidade × desempenho × qualidade [7] |
| Tempo de operação | tempo de preparação somado ao tempo de processamento de uma etapa de trabalho (Wiendahl) [14][15] |
| Tempo de ordem (REFA) | tempo de preparação mais tempo de execução (quantidade × tempo por unidade) [16][17] |
| OTIF | on time in full; sem definição padrão [18] |
| PPM | partes por milhão, defeitos normalizados para um milhão [36] |
| SMED | método de troca de ferramental que visa menos de dez minutos [11] |
| SQCDP | Segurança, Qualidade, Custo, Entrega, Pessoas: esquema de ordenação para KPIs |
| Takt time | tempo disponível ÷ demanda do cliente [9] |
| TEEP | OEE × carregamento [8] |
| TRIR | taxa total registrável de incidentes da OSHA: casos registráveis × 200.000 ÷ horas trabalhadas [42] |
| WIP | trabalho em processo |

## 21. FAQ: KPIs de manufatura

**O que são KPIs de manufatura?**
KPIs de manufatura são medidas que quantificam o tempo, a produção, a qualidade, a entrega, o custo e a segurança de uma operação produtiva, por exemplo takt time, OEE, taxa de sucata ou OTIF. Cada KPI precisa de uma definição, fórmula, unidade e período de tempo.

**Qual é a diferença entre um KPI e uma métrica?**
Todo KPI é uma métrica, mas nem toda métrica é um KPI. Um KPI está diretamente ligado a uma meta e orienta decisões regularmente, como OTIF ou OEE do gargalo. A quantidade de peças produzidas é uma métrica; sozinha raramente dispara uma ação.

**Quais são os KPIs mais importantes na manufatura?**
Para a maioria das fábricas, um conjunto inicial basta: OEE do gargalo, FPY ou taxa de sucata, OTIF, lead time ou WIP, custo por unidade e uma taxa de segurança como o TRIR. Quais KPIs são "os mais importantes" depende de onde estão suas maiores perdas.

**Quais são os 5 principais indicadores de desempenho na manufatura?**
Não existe um top cinco oficial. Um conjunto prático cobre um KPI por categoria do SQCDP: TRIR (segurança), first pass yield (qualidade), custo por unidade (custo), OTIF (entrega) e uma métrica de pessoas, como ideias de melhoria implementadas, além do OEE do gargalo.

**Como se calcula o takt time?**
Takt time = tempo de produção disponível ÷ demanda do cliente. Exemplo: 450 min (27.000 s) de tempo disponível por turno e demanda de 450 unidades resultam em 60 s por unidade. Subtraia as pausas, mas não as paradas não planejadas.

**Qual é a diferença entre takt time e tempo de ciclo?**
O takt time vem da demanda do cliente e indica com que frequência uma peça precisa ser concluída. O tempo de ciclo é medido no processo e indica com que frequência uma peça é realmente concluída. O tempo de ciclo deve ficar abaixo do takt, com uma folga.

**Como se calcula o lead time de manufatura?**
Diretamente, como carimbo de conclusão menos carimbo de início por ordem, ou indiretamente pela Lei de Little: WIP médio ÷ vazão média. 2.700 peças de WIP com vazão diária de 900 peças resultam em 3 dias úteis.

**Como se calcula o OEE?**
OEE = disponibilidade × desempenho × qualidade. Com 90 % de disponibilidade, 88,9 % de desempenho e 94,9 % de qualidade, o OEE é 75,9 %. Verificação cruzada: quantidade boa × tempo de ciclo ideal ÷ tempo planejado de produção.

**Qual é um bom resultado de OEE?**
85 % costuma ser citado como "classe mundial" e atribuído a Nakajima, mas o número é contestado e depende do setor [8]. Uma meta melhor é aquela derivada da sua própria linha de base e da demanda do cliente.

**Como você calcula a taxa de refugo?**
Taxa de refugo = quantidade de refugo ÷ quantidade total × 100 %. 10 peças refugadas em 432 produzidas resultam em 2,31 %.

**Qual é a diferença entre taxa de refugo e first pass yield?**
A taxa de refugo conta apenas as peças que são finalmente descartadas. O FPY conta apenas as peças que estavam boas sem nenhuma correção, portanto também sem retrabalho. FPY, taxa de retrabalho e taxa de refugo somam 100 %.

**O que significa OTIF?**
On time in full: a parcela de entregas ou linhas de pedido que chegam ao cliente no prazo e completas. Não existe uma definição padronizada; é preciso definir a data de referência, a tolerância e o nível [18].

**Como você calcula o TRIR?**
TRIR = número de casos registráveis pela OSHA × 200.000 ÷ total de horas trabalhadas [42]. 5 casos registráveis com 420.000 horas resultam em 2,38. Os 200.000 representam 100 funcionários em tempo integral trabalhando 40 horas por semana durante 50 semanas.

**Qual é a diferença entre utilização de capacidade e eficiência de utilização?**
A utilização de capacidade é um indicador de planejamento (carga em relação à capacidade). A eficiência de utilização mede, durante a execução, quanto do tempo ocupado foi de fato produtivo. Alta utilização não é um objetivo em si, porque os lead times aumentam bruscamente perto do limite de capacidade.

**Quantos KPIs uma fábrica deve acompanhar?**
De cinco a oito KPIs por nível gerencial, organizados por SQCDP, com cada indicador defasado mapeado para um indicador antecedente. Mais KPIs aumentam o esforço de coleta de dados sem melhorar o controle.

**Qual norma define os KPIs de manufatura?**
A ISO 22400-2:2014 define KPIs para a gestão de operações de manufatura, com fórmulas, unidades e periodicidade [1]. A ISA-95 define o contexto de Nível 3 em que eles são calculados [40]; na Alemanha, a diretriz VDMA 66412-1 sobre KPIs de MES também é amplamente utilizada [4].

**Posso criar KPIs de manufatura no Power BI?**
Sim. O que importa é um esquema em estrela com tabelas de fatos e de dimensões [27] e medidas que calculem os KPIs a partir de tempos somados. O compartilhamento exige o Power BI Pro; visualizadores sem licença Pro precisam de conteúdo em capacidade Premium ou Fabric F64 ou superior [28].

**O que são MTBF e MTTR?**
MTBF é o tempo médio de funcionamento entre duas falhas, e MTTR é o tempo médio para restabelecer a máquina. 16.200 min de tempo de funcionamento e 40 falhas com duração total de 1.000 min resultam em um MTBF de 405 min e um MTTR de 25 min.

## 22. Conclusão

Os KPIs de manufatura não são um fim em si mesmos. Seu valor vem de três fatores: uma definição inequívoca baseada na ISO 22400-2 (e na ISA-95 para o contexto do sistema), uma base de dados confiável a partir de sinais das máquinas e de registros dos operadores, e uma rotina em que os desvios levam a perguntas e ações. O exemplo da Linha 3 mostra o quanto os KPIs estão conectados: um tempo de ciclo abaixo do takt não garante a entrega enquanto paradas, trocas de ferramenta e perdas de qualidade reduzem a OEE para 75,9 %; as 28 peças faltantes por turno podem ser rastreadas até categorias de perda e minutos individuais. Comece com poucos KPIs, calcule-os em todos os níveis a partir de somas, defina metas a partir da demanda do cliente, coloque a segurança em primeiro lugar com uma taxa corretamente fundamentada e trate cada KPI como um motivo para uma conversa no gemba.

### Leitura complementar no m365.fm

- Guias: [Gestão do Chão de Fábrica](https://www.m365.fm/en/learn/shop-floor-management/) · [Excelência Operacional](https://www.m365.fm/en/learn/operational-excellence/) · [Mapeamento do Fluxo de Valor](https://www.m365.fm/en/learn/value-stream-mapping/) · [TI de Manufatura com Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) · [Manufatura Enxuta](https://www.m365.fm/en/learn/lean-manufacturing/) · [Programação da Produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/) · [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- Blog: [Otimização do Chão de Fábrica: Formas de Melhorar o Fluxo](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/) · [O Caso de Negócio para a Excelência Operacional: Como Comprovar o ROI](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-roi-business-case/)
- Termos: [Takt Time](https://www.m365.fm/entity/takt-time/) · [Tempo de Ciclo](https://www.m365.fm/entity/cycle-time/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Tempo de Setup](https://www.m365.fm/entity/setup-time/) · [Micro Paradas](https://www.m365.fm/entity/micro-stops/) · [Taxa de Refugo](https://www.m365.fm/entity/scrap-rate/) · [Indicador-Chave de Desempenho](https://www.m365.fm/entity/key-performance-indicator/) · [Manutenção Produtiva Total](https://www.m365.fm/entity/total-productive-maintenance/) · [SMED](https://www.m365.fm/entity/smed/) · [Gestão do Chão de Fábrica](https://www.m365.fm/entity/shop-floor-management/) · [Gestão Visual](https://www.m365.fm/entity/visual-management/) · [Reunião de Nível](https://www.m365.fm/entity/tier-meeting/) · [Mapeamento do Fluxo de Valor](https://www.m365.fm/entity/value-stream-mapping/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** é o apresentador do m365.fm e trabalha na [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) em Stuttgart, Alemanha. No m365.fm, ele escreve sobre manufatura enxuta, KPIs de manufatura, métodos de fluxo de valor e a digitalização da manufatura com Microsoft 365, Power BI e Azure. Seu foco é como definir e visualizar KPIs para que levem a decisões no chão de fábrica.

**Nota: O autor trabalha na iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Sources [1] to [39] keep the German numbering; [35], [36] and [38] now point to English sources, and [40] to [47] were added for the US version. All new or replaced sources were verified online.

1. ISO 22400-2:2014 Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions. Edition 1, 2014-01; status "to be revised"; Amendment 1:2017 "Key performance indicators for energy management". https://www.iso.org/standard/54497.html
2. Rother, M.; Shook, J.: 6 Guidelines for Moving Toward a Lean Value Stream. Lean Enterprise Institute, The Lean Post, October 19, 2022. https://www.lean.org/the-lean-post/articles/6-guidelines-for-moving-toward-a-lean-value-stream/
3. Kang, N.; Zhao, C.; Li, J.; Horst, J. A.: A Hierarchical structure of key performance indicators for operation management and continuous improvement in production systems. International Journal of Production Research 54 (21), 2016, pp. 6333–6350. NIST version: https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=919754
4. VDMA 66412-1:2009-10 Manufacturing Execution Systems (MES) – Kennzahlen (KPIs). 36 pages; amended by VDMA 66412-1/A1:2010-05. DIN Media: https://6sku3uaup9f9.din.de/en/technical-rule/vdma-66412-1/122410632
5. Schließmann, A.; Strahlberger, M.: Kennzahlen und Prozessgrößen wohl definiert. MES-Kennzahlen basierend auf Maschinenzuständen (well-defined KPIs: MES KPIs based on machine states). ZWF 109 (7–8), 2014, pp. 549–551. DOI: 10.3139/104.111180. https://www.degruyterbrill.com/document/doi/10.3139/104.111180/html
6. Nakajima, S.: Introduction to TPM: Total Productive Maintenance. Productivity Press, Cambridge (MA) 1988, ISBN 978-0-915299-23-2 (bibliographic data per [8]).
7. Muchiri, P.; Pintelon, L.: Performance measurement using overall equipment effectiveness (OEE): literature review and practical application discussion. International Journal of Production Research 46 (13), 2008, pp. 3517–3535. DOI: 10.1080/00207540601142645. https://scispace.com/pdf/performance-measurement-using-overall-equipment-3udssbfefm.pdf
8. Overall equipment effectiveness. Wikipedia (English), with references to Nakajima 1982/1988/1989 and Hartmann 1992 (TEEP). https://en.wikipedia.org/wiki/Overall_equipment_effectiveness
9. Takt Time (lexicon term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/takt-time/
10. Cycle Time (lexicon term, with lead time, processing time, value-creating time, effective machine cycle time). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/cycle-time/
11. Single Minute Exchange of Die (lexicon term). Lean Enterprise Institute, referring to Shingo, S.: A Revolution in Manufacturing: The SMED System. Productivity Press, 1985. https://www.lean.org/lexicon-terms/single-minute-exchange-of-die/
12. Rother, M.; Shook, J.: Learning to See: Value Stream Mapping to Create Value and Eliminate Muda. Lean Enterprise Institute, Brookline (MA) 1998 (Shingo Research Prize 1999); current edition LEI 2018. https://www.lean.org/store/workbooks/learning-to-see/
13. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (3), 1961, pp. 383–387. DOI: 10.1287/opre.9.3.383. https://ideas.repec.org/a/inm/oropre/v9y1961i3p383-387.html
14. Nyhuis, P.; Wiendahl, H.-P.: Logistische Kennlinien. Grundlagen, Werkzeuge und Anwendungen. 3rd ed., Springer, Berlin/Heidelberg 2012 (VDI-Buch), ISBN 978-3-540-92838-6 (English edition: Fundamentals of Production Logistics: Theory, Tools and Applications, Springer, Berlin/Heidelberg 2009, ISBN 978-3-540-34210-6). Sample (table of contents and abbreviations): https://lesejury.de/media/samples/393/9783540928393_leseprobe.pdf · Chapter "Zusammenfassung und Ausblick": https://rd.springer.com/content/pdf/10.1007%2F978-3-540-92839-3_10.pdf
15. Durchlaufzeit. Wikipedia (German), referring to Wiendahl, H.-P.: Fertigungsregelung. Hanser, Munich 1997, ISBN 3-446-19084-8. https://de.wikipedia.org/wiki/Durchlaufzeit
16. REFA (ed.): Lexikon der Betriebsorganisation. Carl Hanser, Munich 1993, ISBN 3-446-17523-7, p. 195 (bibliographic data per [17]).
17. Auftragszeit. Wikipedia (German). https://de.wikipedia.org/wiki/Auftragszeit
18. Davies, A.; Lal, S.; Perez, F.; Potdar, S.: Defining 'on-time, in-full' in the consumer sector. McKinsey & Company, June 13, 2019. https://www.mckinsey.com/capabilities/operations/our-insights/defining-on-time-in-full-in-the-consumer-sector
19. DGUV: Unfallrisiko bei der Arbeit 2025 erneut gesunken (workplace accident risk fell again in 2025). Press release, September 22, 2026. https://dguv.de/de/mediencenter/pm/pressearchiv/2026/quartal_3/details_3_713348.jsp
20. Section 193 SGB VII (German Social Code, Book VII): employer's duty to report an insured event. https://www.gesetze-im-internet.de/sgb_7/__193.html
21. Lost time injury frequency rates (LTIFR). Safe Work Australia. https://data.safeworkaustralia.gov.au/node/33
22. ISO 50006:2023 Energy management systems – Evaluating energy performance using energy performance indicators and energy baselines. https://www.iso.org/standard/79367.html
23. Strathern, M.: 'Improving ratings': audit in the British University system. European Review 5 (3), 1997, pp. 305–321. DOI: 10.1002/(SICI)1234-981X(199707)5:3<305::AID-EURO184>3.0.CO;2-4
24. Goodhart, C.: Problems of Monetary Management: The UK Experience. Papers in Monetary Economics, Vol. 1, Reserve Bank of Australia, Sydney 1975 (bibliographic data per https://en.wikipedia.org/wiki/Goodhart%27s_law).
25. DIVIDE function (DAX). Microsoft Learn. https://learn.microsoft.com/en-us/dax/divide-function-dax
26. DIVIDE function vs. divide operator (/) in DAX. Microsoft Learn. https://learn.microsoft.com/en-us/dax/best-practices/dax-divide-function-operator
27. Understand star schema and the importance for Power BI. Microsoft Learn (updated December 30, 2024). https://learn.microsoft.com/en-us/power-bi/guidance/star-schema
28. Power BI service per-user and capacity-based licenses. Microsoft Learn (updated August 24, 2026; re-checked November 20, 2026). https://learn.microsoft.com/en-us/power-bi/service-features-license-type
29. Get started with goals and scorecards in Power BI. Microsoft Learn (updated March 5, 2026). https://learn.microsoft.com/power-bi/create-reports/service-goals-introduction
30. Polaris Analyzer (vendor page). iFAKT GmbH. https://www.ifakt.de/en/solutions/analyzer
31. Polaris VSM (vendor page, with overview of the Polaris suite). iFAKT GmbH. https://www.ifakt.de/en/software/vsm/
32. Drees, J.; Sack, C. (iFAKT GmbH): Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung (production optimization through value stream modeling KPIs). ZWF 106 (6), 2011, pp. 466–470. DOI: 10.3139/104.110589. https://www.degruyterbrill.com/document/doi/10.3139/104.110589/html
33. About iFAKT (company page). iFAKT GmbH. https://www.ifakt.de/en/company/
34. ISO 50006:2023, preview pages (second edition 2023-05, replaces ISO 50006:2014). ANSI Webstore. https://webstore.ansi.org/preview-pages/ISO/preview_ISO+50006-2023.pdf
35. Manufacturing KPIs: The Metrics That Actually Drive the Floor. Fabrico (vendor blog), published June 29, 2026, updated October 26, 2026. https://www.fabrico.io/blog/manufacturing-kpis/
36. Quality Glossary of Terms, Acronyms & Definitions (entries "first pass yield", "overall equipment effectiveness", "parts per million"). ASQ. https://asq.org/quality-resources/quality-glossary
37. World-Class OEE: What Is It and How Close Are You Actually? TEEPTRAK (vendor page, benchmarks from own data). https://teeptrak.com/en/world-class-oee-benchmark/
38. ISO 22400 KPI Selection Guide. Fabrico (secondary source for the count of 34 KPIs and the categories). https://www.fabrico.io/blog/iso-22400-kpi-selection-guide/
39. Competitor pages: https://netsuite.com/portal/resource/articles/erp/manufacturing-kpis-metrics.shtml · https://www.insightsoftware.com/blog/30-manufacturing-kpis-and-metric-examples/ · https://www.dataparc.com/blog/manufacturing-kpi-examples-10-formulas-for-measuring-success/ · https://machinemetrics.com/blog/manufacturing-kpis · https://tulip.co/blog/manufacturing/how-to-calculate-34-manufacturing-kpis/ · https://www.cascade.app/blog/manufacturing-kpis · https://scw.ai/blog/manufacturing-kpis/ · https://upkeep.com/learning/what-are-the-best-metrics-and-kpis-for-manufacturing-companies/ · https://safetyculture.com/topics/kpi/manufacturing-kpis/ (redirects to mitti.com) · https://www.vorne.com/learning-center/kpi.htm
40. ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264; Purdue-based Levels 0–4, Level 3 = manufacturing operations management). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
41. Equipment Performance Metrics (SEMI E10 RAM and utilization; SEMI E79 equipment productivity incl. OEE). SEMI. https://semi.org/en/products-services/standards/step/equipment-performance-metrics
42. OSHA: Clarification on how the formula is used by OSHA to calculate incident rates. Standard interpretation letter, August 23, 2016. https://www.osha.gov/laws-regs/standardinterpretations/2016-08-23
43. U.S. Bureau of Labor Statistics: Employer-Reported Workplace Injuries and Illnesses – 2025. News release, November 18, 2026. https://www.bls.gov/news.release/osh.nr0.htm
44. U.S. Bureau of Labor Statistics: Number and rate of nonfatal work injuries and illnesses in private industries, 2025 (chart). https://www.bls.gov/charts/injuries-and-illnesses/number-and-rate-of-nonfatal-work-injuries-and-illnesses-by-industry.htm
45. 29 CFR 1904.39 – Reporting fatalities, hospitalizations, amputations, and losses of an eye as a result of work-related incidents to OSHA. https://www.osha.gov/laws-regs/regulations/standardnumber/1904/1904.39
46. U.S. Bureau of Labor Statistics: Occupational Safety and Health Definitions (recordable cases, DART, days away from work). https://www.bls.gov/iif/definitions/occupational-safety-and-health-definitions.htm
47. Supply Chain Dive: news brief on Walmart's on-time, in-full requirement for suppliers (87 %, two-day window, 3 % fine). March 8, 2019. https://www.supplychaindive.com/news/walmart-on-time-in-full-87-suppliers/550083/
