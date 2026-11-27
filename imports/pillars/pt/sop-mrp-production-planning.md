# SEO metadata

| Field | Value |
|---|---|
| Meta title | Guia de S&OP, MPS e MRP: Planejamento de Vendas e Operações |
| Meta description | S&OP, MPS e MRP explicados: o ciclo mensal de S&OP, o cálculo de necessidades do MRP passo a passo, DDMRP, opções de ERP, KPIs e modelos. |
| Slug | `sop-mrp-production-planning` |

# Planejamento de Vendas e Operações (S&OP) e MRP: como funciona o planejamento da produção, do plano às peças

> **Resposta curta:** O planejamento de vendas e operações (S&OP, na sigla em inglês) é um processo gerencial mensal no qual vendas, operações, cadeia de suprimentos e finanças acordam um único plano de demanda, suprimento e estoque por família de produtos, normalmente com um horizonte rolante de 18 a 36 meses [5][6]; fontes acadêmicas descrevem seu núcleo tático como atingindo até cerca de 18 meses [1]. O programa mestre de produção (MPS) transforma esse plano em quantidades de itens finais por semana, e o planejamento das necessidades de materiais (MRP) desdobra o MPS pelas estruturas de produto (BOM) em ordens datadas para cada componente e matéria-prima [7][13]. Na maioria das fábricas, o MPS e o MRP rodam dentro do sistema ERP; o S&OP roda em um ciclo de reuniões apoiado por planilhas, ERP ou software dedicado de planejamento.

> **Principais conclusões**
> - O S&OP decide *quanto* por família de produtos e mês; o MPS decide *quais itens finais* por semana; o MRP decide *quais peças, quantas e quando*. O sequenciamento detalhado (sequência por máquina e hora) fica abaixo desse nível e é abordado no [guia de programação da produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/).
> - O conceito de S&OP remonta ao planejamento agregado da produção na década de 1950; consultores da Oliver Wight moldaram o S&OP moderno nos anos 1980 e cunharam o termo planejamento integrado de negócios (IBP) no início dos anos 2000 [1][2].
> - Joseph Orlicky formalizou o MRP em 1964; a Black & Decker foi a primeira usuária, e em 1981 cerca de 8.000 empresas utilizavam MRP [3][4]. A Oliver Wight estendeu-o para MRP II em 1983 [3].
> - Um ciclo mensal típico de S&OP tem cinco etapas: coleta de dados, revisão da demanda, revisão do suprimento, reunião de pré-S&OP (conciliação) e reunião executiva de S&OP [1].
> - O MRP assume capacidade infinita e lead times fixos; por isso precisa de uma verificação de capacidade grosseira acima dele e de um programador de capacidade finita abaixo [8][9].
> - Uma pequena mudança no MPS pode deslocar ordens em vários níveis da BOM ao mesmo tempo ("nervosismo"). Congelar o cronograma de curto prazo e aplicar regras de custo de mudança amortecem o efeito melhor do que estoque de segurança adicional [10].
> - O DDMRP substitui o desdobramento orientado por previsão, nos pontos de desacoplamento selecionados, por buffers dimensionados (vermelho, amarelo, verde) e uma equação de fluxo líquido [11][12].
> - Meça o S&OP com a acurácia da previsão (WMAPE) *e* o viés, a aderência ao plano, a estabilidade do cronograma e o nível de serviço. Uma previsão com 94% de acurácia que é sempre 2% alta ainda gera acúmulo de estoque.

## Sumário

1. [O que é planejamento de vendas e operações? Definição e escopo](#o-que-é-planejamento-de-vendas-e-operações-definição-e-escopo)
2. [A hierarquia de planejamento da produção: S&OP, MPS, RCCP, MRP e programação](#a-hierarquia-do-planejamento-da-produção-sop-mps-rccp-mrp-e-programação)
3. [História: do planejamento agregado e Orlicky ao IBP e DDMRP](#história-do-planejamento-agregado-e-do-orlicky-ao-ibp-e-ao-ddmrp)
4. [O processo de S&OP: o ciclo mensal passo a passo](#o-processo-de-sop-o-ciclo-mensal-passo-a-passo)
5. [Estratégias de suprimento: nivelada, perseguição ou híbrida (exemplo trabalhado)](#estratégias-de-abastecimento-nivelada-perseguição-ou-híbrida-exemplo-trabalhado)
6. [S&OP vs. IBP vs. S&OE](#sop-vs-ibp-vs-soe)
7. [Modelos de maturidade de S&OP](#modelos-de-maturidade-do-sop)
8. [Plano-mestre de produção (MPS) e disponível para prometer (ATP)](#plano-mestre-de-produção-mps-e-disponível-para-promessa-atp)
9. [Planejamento de capacidade grosseiro (RCCP)](#planejamento-de-capacidade-aproximado-rccp)
10. [Planejamento das necessidades de materiais (MRP): como funciona o cálculo](#planejamento-das-necessidades-de-materiais-mrp-como-o-cálculo-funciona)
11. [MRP II, CRP e o ciclo fechado](#mrp-ii-crp-e-o-ciclo-fechado)
12. [Nervosismo do MRP: por que os planos oscilam e como acalmá-los](#nervosidade-do-mrp-por-que-os-planos-oscilam-e-como-estabilizá-los)
13. [MRP orientado à demanda (DDMRP)](#mrp-orientado-pela-demanda-ddmrp)
14. [Planejamento da produção no ERP: o que os sistemas fazem e onde param](#planejamento-de-produção-no-erp-o-que-os-sistemas-fazem-e-onde-param)
15. [Modelos: calendário de S&OP, pautas, plano por família, registros de MPS e MRP](#modelos-calendário-sop-pautas-plano-de-famílias-registros-de-mps-e-mrp)
16. [KPIs de S&OP e MRP com exemplos trabalhados](#kpis-de-sop-e-mrp-com-exemplos-resolvidos)
17. [Roteiro de implementação: 12 meses até um S&OP e MRP em funcionamento](#roteiro-de-implementação-12-meses-até-um-sop-e-um-mrp-em-funcionamento)
18. [Erros comuns](#erros-comuns)
19. [Limites do S&OP e do MRP](#limites-do-sop-e-do-mrp)
20. [IA e planejamento digital: o que funciona hoje](#ia-e-planejamento-digital-o-que-funciona-hoje)
21. [Glossário](#glossário)
22. [FAQ: planejamento de vendas e operações e MRP](#faq-planejamento-de-vendas-e-operações-e-mrp)
23. [Conclusão e primeiros passos](#conclusão-e-primeiros-passos)

## O que é planejamento de vendas e operações? Definição e escopo

**Planejamento de vendas e operações (S&OP)** é um processo decisório recorrente que integra a previsão de demanda com o planejamento de suprimento em um único plano, ao qual vendas, marketing, operações, cadeia de suprimentos e finanças se alinham [1]. A literatura acadêmica descreve o processo como tático, com horizonte de até cerca de 18 meses, normalmente executado mensalmente ou disparado por eventos [1]. Fontes de fornecedores e de práticos costumam descrever um horizonte móvel de 18 a 36 meses [5][6]. A diferença não é uma contradição: os primeiros meses são planejados com mais detalhe, e os meses seguintes apenas por famílias e blocos de capacidade.

Três características distinguem o S&OP de uma reunião de previsão de vendas ou de uma reunião de produção:

- **Um único conjunto de números.** Demanda, suprimento, estoque ou backlog e o valor financeiro do plano são analisados em conjunto, por família de produtos, em unidades e em dólares.
- **Decisões, não relatórios.** O resultado é um conjunto de decisões: aprovar um aumento de capacidade, aceitar um nível de serviço menor para uma família lenta, adiar um lançamento, produzir antecipadamente antes de uma parada.
- **Integração em vez de coordenação.** Rogelio Oliva e Noel Watson mostraram, em um estudo de caso, que o S&OP agrega valor quando as funções planejam *juntas, contra metas compartilhadas*, e não quando apenas coordenam planos que cada função fez isoladamente [21].

O corpo profissional de conhecimento para S&OP, programação-mestre e MRP nos EUA é mantido pela ASCM (Association for Supply Chain Management, antiga APICS). Seu programa CPIM (Certified in Planning and Inventory Management) cobre S&OP, demanda, suprimento, estoque e programações detalhadas como módulos separados [24].

### Planejamento, não programação

O S&OP não é a programação de produção. Ele trabalha com famílias de produtos, períodos mensais e capacidade agregada, como "horas de soldagem" ou "turnos da linha 2." A pergunta "qual ordem roda primeiro na máquina 14 amanhã" pertence à programação detalhada, que o [guia de programação de produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/) trata em profundidade, incluindo programação de capacidade finita e tambor-pulmão-corda. Este artigo fica um nível acima e conecta o S&OP ao plano-mestre de produção e ao MRP.

### Para que serve o S&OP

A tabela mostra decisões típicas que só um S&OP multifuncional pode tomar, porque nenhuma função isolada é dona ao mesmo tempo do custo e do benefício.

| Decisão | Quem ganha | Quem paga | Por que precisa de S&OP |
|---|---|---|---|
| Adicionar um segundo turno na soldagem a partir de março | Vendas (nível de serviço) | Operações (custo de mão de obra), RH (contratações) | trade-off entre receita e custo |
| Produzir antecipadamente 2.000 unidades antes da parada de verão | Clientes, vendas | Finanças (capital de giro), armazém | o investimento em estoque precisa ser aprovado |
| Descontinuar uma variante de baixa margem | Operações (menos trocas de setup) | Vendas (receita perdida) | decisão de portfólio com impacto na margem |
| Aceitar um grande pedido promocional | Vendas, marketing | Operações (horas extras), compras | viabilidade de capacidade e de materiais |
| Qualificar um segundo fornecedor para uma peça crítica | Cadeia de suprimentos (risco) | Compras, qualidade (custo de qualificação) | resiliência versus custo unitário, veja [resiliência da cadeia de suprimentos](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/) |

### Quem participa

A reunião executiva é presidida pelo gerente geral ou pelo presidente da unidade de negócio. Os membros permanentes típicos são os responsáveis por vendas, marketing, operações, cadeia de suprimentos, finanças e, em produtos de engenharia, engenharia ou gestão de produtos. Abaixo da reunião executiva, o planejador de demanda, o programador mestre, o planejador de suprimentos e um analista financeiro realizam a maior parte do trabalho. A seção 4 descreve os papéis passo a passo.

## A hierarquia do planejamento da produção: S&OP, MPS, RCCP, MRP e programação

O planejamento e controle da manufatura (MPC) é organizado como uma hierarquia. Cada nível trabalha com um horizonte mais longo e com dados mais agregados do que o nível abaixo e repassa suas decisões como metas. O material do curso do MIT de Stanley Gershwin resume o MRP II dessa forma: uma hierarquia de planejamento de longo, médio e curto prazo, com gestão de demanda, previsão, planejamento de capacidade e controle de chão de fábrica em torno do núcleo MRP [8].

| Nível | Horizonte típico | Período | Objeto de planejamento | Pergunta-chave | Saída | Ferramenta típica |
|---|---|---|---|---|---|---|
| Estratégico e plano de negócios | 3–5 anos | ano | negócio, planta, rede | Quais mercados, plantas e investimentos em capacidade? | orçamento, plano de capex | ferramentas financeiras, Excel |
| S&OP / IBP | 18–36 meses [5][6] | mês | família de produtos, recurso agregado | Quanto vendemos e fabricamos, com que estoque e custo? | plano de família aprovado | software de S&OP, ERP, Excel |
| Plano mestre de produção (MPS) | de algumas semanas a vários meses, no mínimo o lead time acumulado | semana (dia no curto prazo) | item final ou item de planejamento | Quais itens finais, quantos, em qual semana? | MPS, ATP | ERP |
| Planejamento de capacidade grosseiro (RCCP) | igual ao MPS | semana ou mês | recursos críticos | O MPS é viável no gargalo? | carga versus capacidade por recurso-chave | ERP, Excel |
| Planejamento das necessidades de materiais (MRP) | igual ao MPS | dia ou semana | cada componente e material | Quais peças, quantas, quando pedir ou iniciar? | ordens planejadas, requisições de compra, mensagens de exceção | ERP |
| Planejamento das necessidades de capacidade (CRP) | semanas | dia ou semana | cada centro de trabalho | Há capacidade suficiente para todas as ordens planejadas e liberadas? | perfis detalhados de carga | ERP |
| Programação detalhada e despacho | horas a algumas semanas | hora, turno | operação em uma máquina | Em qual sequência cada operação é executada? | programação, lista de despacho | APS, MES |

Duas regras mantêm a hierarquia coerente:

1. **A desagregação precisa fechar.** A soma do MPS de todos os itens finais de uma família deve corresponder ao plano de família do S&OP para o mesmo mês, dentro de uma tolerância acordada (por exemplo, mais ou menos 5%). Caso contrário, a decisão do S&OP não tem efeito no chão de fábrica.
2. **A viabilidade é verificada em cada nível.** O S&OP verifica a capacidade agregada (planejamento de recursos), o MPS é verificado pelo planejamento de capacidade grosseiro, e a saída do MRP é verificada pelo planejamento das necessidades de capacidade ou por um programador de capacidade finita. O próprio MRP não verifica capacidade [8][9].

### Onde ficam ERP, APS e MES

A ANSI/ISA-95 separa planejamento de negócios e logística (Nível 4, tipicamente ERP) da gestão de operações de manufatura (Nível 3, tipicamente MES e programação detalhada) [25]. S&OP, MPS e MRP são funções de Nível 4. O [guia de MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) explica o lado do Nível 3, e o [guia de Azure para manufatura](https://www.m365.fm/en/learn/manufacturing-it-azure/) mostra como os dados entre os níveis podem ser integrados.

### Make-to-stock, assemble-to-order, make-to-order

O ambiente de produção decide onde o MPS fica na lista de materiais:

| Ambiente | Cliente espera por | MPS planejado em | Exemplo | Foco do S&OP |
|---|---|---|---|---|
| Make-to-stock (MTS) | nada (envio a partir do estoque) | item final | bens de consumo, bombas padrão | meta de estoque por família |
| Assemble-to-order (ATO) | montagem final | módulos e opções (planning bill) | mesas configuráveis, caminhões, PCs | mix de módulos, percentuais de opcionais |
| Make-to-order (MTO) | fabricação | item final ou subconjuntos-chave após o pedido | peças de máquinas sob encomenda | meta de backlog, lead time |
| Engineer-to-order (ETO) | projeto e fabricação | marcos do projeto, itens de longo lead time | máquinas especiais, interiores de aeronaves | capacidade de engenharia e testes, veja [planejamento da produção aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/) |

No MTS, o S&OP equilibra a demanda contra um estoque-alvo. No MTO e no ETO, ele equilibra a demanda contra um backlog-alvo ou um lead time cotado. Misturar essas lógicas em uma mesma família é uma causa comum de números de S&OP confusos.

## História: do planejamento agregado e do Orlicky ao IBP e ao DDMRP

### Planejamento agregado e os primeiros sistemas MRP (décadas de 1950–1960)

O S&OP começou no início dos anos 1950 como planejamento agregado da produção: ajustar uma taxa de produção agregada à demanda prevista, equilibrando estoque, variações de força de trabalho e horas extras [1]. Na mesma época, os fabricantes de motores aeronáuticos Rolls-Royce e General Electric informatizaram o planejamento de materiais [3].

Em 1964, Joseph Orlicky, engenheiro da IBM, formalizou o planejamento de necessidades de materiais (MRP) [4]. A primeira empresa a implementá-lo foi a Black & Decker, em 1964, com Dick Alban como líder de projeto [3]. O livro de Orlicky *Material Requirements Planning* (McGraw-Hill, 1975) tornou-se o texto padrão [13]. Sua terceira edição, uma atualização de 2011 por Carol Ptak e Chad Smith, introduziu o MRP orientado à demanda (DDMRP) [4].

A adoção cresceu rapidamente: cerca de 700 empresas usavam MRP em 1975 e cerca de 8.000 em 1981, segundo números citados na Wikipedia [3]. Em 1967, George Plossl e Oliver Wight, colega de Orlicky na IBM, escreveram em conjunto um livro sobre controle de produção e estoques [4].

### MRP II, ERP e S&OP (décadas de 1980–1990)

Em 1983, Oliver Wight expandiu o MRP para o **planejamento de recursos de manufatura (MRP II)**, acrescentando programação-mestre, planejamento de capacidade grosseira, planejamento de necessidades de capacidade, S&OP e a ligação com o planejamento financeiro [3]. A empresa de Oliver Wight descreve o S&OP como desenvolvido por Oliver Wight nos anos 1980 [2]; a Wikipedia atribui o termo e seu significado moderno a Richard (Dick) Ling, então consultor da Oliver Wight [1]. A Gartner cunhou o termo "enterprise resource planning" (ERP) em 1990 [4]. O ERP integrou finanças, vendas, compras e RH em torno de um núcleo de planejamento que continuava sendo o MRP II.

### IBP, DDMRP e planejamento concorrente (anos 2000 até hoje)

No início dos anos 2000, a Oliver Wight cunhou o **planejamento integrado de negócios (IBP)**, que estende o S&OP a toda a empresa, incluindo o planejamento de portfólio e financeiro, com um horizonte de pelo menos 24 meses [2]. Em 2011, Ptak e Smith publicaram a terceira edição do livro de Orlicky com o **MRP orientado à demanda (DDMRP)** [4], e fornecedores de ERP como a Microsoft incorporaram desde então o DDMRP em seus motores de planejamento [11]. Fornecedores de software de planejamento agora promovem o planejamento "concorrente" ou contínuo, que recalcula os planos em minutos em vez de em um lote mensal [16]; essa afirmação é uma alegação do fornecedor e é discutida na seção sobre IA.

| Ano | Marco | Fonte |
|---|---|---|
| início dos anos 1950 | planejamento agregado da produção; Rolls-Royce e GE informatizam o planejamento de materiais | [1][3] |
| 1964 | Orlicky formaliza o MRP na IBM; Black & Decker é a primeira usuária | [3][4] |
| 1967 | Plossl e Wight publicam sobre controle de produção e estoques | [4] |
| 1975 | *Material Requirements Planning*, de Orlicky; cerca de 700 usuários de MRP | [3][13] |
| 1981 | cerca de 8.000 usuários de MRP | [3] |
| 1983 | Oliver Wight define o MRP II | [3] |
| anos 1980 | S&OP desenvolvido por Oliver Wight (Dick Ling) | [1][2] |
| 1990 | Gartner cunha o termo "ERP" | [4] |
| início dos anos 2000 | Oliver Wight cunha o IBP | [2] |
| 2011 | terceira edição do livro de Orlicky, por Ptak e Smith, introduz o DDMRP | [4] |

## O processo de S&OP: o ciclo mensal passo a passo

A descrição acadêmica mais citada do processo de S&OP tem cinco etapas: coleta de dados, planejamento da demanda, planejamento da oferta, pré-reunião e reunião executiva [1][20]. Alguns autores acrescentam uma revisão de eventos ou produtos no início e uma etapa de revisão no fim [1]; a Anaplan, fornecedora de software de planejamento, descreve seis revisões: produto, demanda, oferta, finanças, pré-S&OP e S&OP executivo [15]. A Kinaxis descreve um ciclo mensal tradicional com cinco estágios [16]. As diferenças são sobretudo de rótulos: os ciclos cobrem os mesmos temas, na mesma ordem aproximada.

O calendário a seguir pressupõe que o mês fecha no último dia útil e que a reunião executiva ocorre na terceira semana.

| Dia útil | Etapa | Responsável | Entradas | Saídas | Duração da reunião |
|---|---|---|---|---|---|
| 1–3 | 1. Coleta de dados e atualização do portfólio | planejador de demanda, gestão de produtos | realizados do mês anterior (embarques, pedidos, produção, estoque), datas de lançamento e descontinuação de produtos | histórico atualizado, pacote de KPIs, alterações de produtos | nenhuma (trabalho de escritório) |
| 4–6 | 2. Revisão de demanda | VP de vendas ou marketing; planejador de demanda prepara | previsão estatística, insumos de vendas, eventos de marketing, planos de clientes-chave | plano de demanda consensual não restrito por família, em unidades e dólares, com premissas e riscos | 60–90 minutos |
| 7–9 | 3. Revisão de oferta | VP de operações ou cadeia de suprimentos; programador-mestre e planejador de oferta preparam | demanda consensual, metas de estoque ou backlog, capacidade por recurso-chave, restrições de fornecedores | plano de oferta restrito, problemas de capacidade e opções com custos | 60–90 minutos |
| 10–12 | 4. Reunião de pré-S&OP (conciliação) | responsável pelo processo de S&OP; analista financeiro | planos de demanda e oferta, lacunas, plano financeiro | plano conciliado em unidades e dólares, decisões preparadas com opções, questões em aberto | 90–120 minutos |
| 13–15 | 5. Reunião executiva de S&OP | gerente-geral | recomendações do pré-S&OP, KPIs | plano aprovado, decisões, escalonamentos encerrados | 60–120 minutos |
| 16–20 | Implantação | programador-mestre, planejadores | plano familiar aprovado | MPS atualizado, MRP executado, ações de compras e capacidade | nenhuma |

### Etapa 1: Coleta de dados e atualização do portfólio

O ciclo começa assim que o mês fecha. O planejador de demanda extrai embarques, pedidos recebidos, produção, estoque e backlog por família e SKU, limpa o histórico de eventos pontuais (um incêndio em um cliente, uma licitação única) e executa a previsão estatística. A gestão de produtos atualiza as datas de lançamento e descontinuação. Uma previsão que não sabe que uma variante será descontinuada no mês 4 continuará pedindo as peças dela.

**Checklist, etapa 1**

| Item | Concluído quando |
|---|---|
| Realizados carregados | embarques, pedidos, produção e estoque conciliam com o fechamento financeiro dentro da tolerância acordada |
| Histórico limpo | outliers sinalizados com motivo, não excluídos |
| Previsão estatística executada | modelo e parâmetros documentados por família |
| Alterações de portfólio | lançamentos, descontinuações, mudanças de engenharia com datas e responsáveis |
| Pacote de KPIs | acurácia e viés da previsão, atingimento do plano, nível de serviço, estoque vs. meta |

### Etapa 2: Revisão de demanda

A revisão de demanda produz o **plano de demanda consensual não restrito**: o que os clientes vão querer se a oferta fosse ilimitada. Vendas e marketing ajustam a previsão estatística com informações que o histórico não contém: mudanças de preço, promoções, um cliente perdido, um novo distribuidor. Cada ajuste é registrado com seu responsável e premissa. Esse registro mostra depois se os ajustes manuais melhoraram ou pioraram a acurácia.

Erros típicos nesta etapa são prever apenas em receita (a operação não produz dólares), prever por SKU para 24 meses (muito ruído) e confundir a meta de vendas com a previsão. Meta é o que a empresa deseja; previsão é o que ela espera. A diferença entre as duas é uma questão de negócio para a reunião executiva, não um número a ser escondido na previsão.

**Pauta da revisão de demanda (60–90 minutos)**

| Tempo | Tema | Responsável |
|---|---|---|
| 10 min | mês anterior: acurácia e viés da previsão por família, principais erros com causa raiz | planejador de demanda |
| 20 min | linha de base estatística vs. último consenso, mudanças acima do limite | planejador de demanda |
| 30 min | insumos de vendas e marketing por família: eventos, clientes, preços | vendas, marketing |
| 15 min | riscos e oportunidades com probabilidade e quantidade | VP de vendas |
| 5 min | consenso por família, itens em aberto, responsáveis | planejador de demanda |

### Etapa 3: Revisão de suprimento

A revisão de suprimento testa a demanda de consenso contra a capacidade, os materiais e as metas de estoque. Os planejadores traduzem os volumes por família em carga sobre os **recursos-chave** (centros de trabalho gargalo, fornecedores críticos, grupos de mão de obra qualificada) usando uma lista de recursos: horas por unidade por recurso. Quando a carga excede a capacidade, eles desenvolvem opções com custos: horas extras, um turno adicional, terceirização, produção antecipada, uma data de entrega posterior ou aceitar um nível de serviço mais baixo. A revisão de suprimento não decide entre opções com impacto financeiro significativo; ela as prepara para a reunião pré-S&OP. A Seção 5 mostra como tais opções são comparadas.

**Pauta da revisão de suprimento (60–90 minutos)**

| Horário | Tema | Responsável |
|---|---|---|
| 10 min | último mês: atingimento do plano, aderência ao MPS, desempenho dos fornecedores | programador-mestre |
| 25 min | carga vs. capacidade por recurso-chave e mês (rough-cut) | planejador de suprimento |
| 20 min | projeção de estoque e backlog vs. metas por família | programador-mestre |
| 20 min | restrições e opções com custo e risco | VP de operações |
| 5 min | plano de suprimento restrito, questões para o pré-S&OP | programador-mestre |

### Etapa 4: Reunião pré-S&OP (reconciliação)

A reunião pré-S&OP reúne demanda, suprimento e finanças. As finanças valoram o plano restrito pelo custo padrão e pelo preço de venda e o comparam com o orçamento ou a última previsão financeira. A equipe resolve o que pode dentro dos direitos de decisão acordados e prepara o restante como documentos de decisão: duas ou três opções, cada uma com impacto em volume, serviço, custo e capital de giro, além de uma recomendação. Um bom documento de decisão cabe em uma página.

### Etapa 5: Reunião executiva de S&OP

A reunião executiva analisa os KPIs, aprova o plano e toma as decisões preparadas. Não é o lugar para refazer números. Uma pauta típica:

| Horário | Tema |
|---|---|
| 10 min | revisão de KPIs: serviço, acurácia e viés da previsão, estoque e backlog vs. meta, atingimento do plano |
| 15 min | visão de negócio por família: plano de demanda vs. orçamento, plano de suprimento vs. demanda |
| 45 min | decisões: um documento de decisão por vez, opções, recomendação, decisão registrada |
| 10 min | riscos para os próximos 3–6 meses, status de novos produtos |
| 10 min | revisão do registro de decisões, responsáveis e prazos |

### Implantação: do plano aprovado ao MPS

Em poucos dias após a reunião executiva, o programador-mestre desagrega o plano de famílias aprovado em MPS por item final e semana (Seção 8), verifica-o com o planejamento de capacidade rough-cut (Seção 9) e executa o MRP (Seção 10). Compras recebe as ordens planejadas novas ou alteradas, e as decisões de capacidade (um segundo turno, horas extras) são liberadas por RH e pela fábrica. Sem essa implantação, o S&OP se transforma em uma apresentação mensal sem efeito no chão de fábrica.

### Papéis e direitos de decisão

| Papel | Responsabilidades |
|---|---|
| Patrocinador executivo (gerente geral ou presidente) | preside a reunião executiva, é dono das decisões finais, garante a presença e a disciplina nas decisões |
| Dono do processo de S&OP | executa o calendário, prepara o pré-S&OP, mantém os registros de decisões e premissas |
| Planejador de demanda | previsão estatística, processo de consenso, KPIs de previsão |
| Líderes de vendas e marketing | inteligência de mercado, responsabilidade pelo número de demanda de consenso |
| Programador-mestre | MPS, regras de ATP, capacidade rough-cut, desagregação |
| Planejadores de suprimento e materiais | exceções do MRP, capacidade dos fornecedores, pedidos de compra |
| Gerente de planta ou de operações | plano de capacidade, mão de obra, decisões de horas extras e turnos |
| Parceiro financeiro | valoração em dólares, reconciliação com o orçamento, capital de giro |
| Gestão de produtos ou engenharia | lançamentos, descontinuações, mudanças de engenharia |

Os direitos de decisão devem estar por escrito. Exemplo: a revisão de suprimento pode aprovar horas extras de até 10% da capacidade de um centro de trabalho; qualquer valor acima disso, e qualquer alteração nas metas de estoque, vai para a reunião executiva.

## Estratégias de abastecimento: nivelada, perseguição ou híbrida (exemplo trabalhado)

O planejamento agregado oferece três estratégias clássicas de abastecimento, que os guias de S&OP citam mas raramente calculam [6]:

- **Nivelada:** produzir a uma taxa constante e deixar o estoque absorver as oscilações da demanda.
- **Perseguição:** alterar a taxa de produção a cada mês para acompanhar a demanda, com horas extras, mão de obra temporária ou turnos adicionais, e manter o estoque estável.
- **Híbrida (mista):** alterar a taxa algumas vezes e aceitar algum acúmulo de estoque.

**Exemplo trabalhado (números ilustrativos).** Um fabricante de mesas planeja a família "mesas com estrutura de aço" para seis meses. O estoque inicial é de 800 unidades, o estoque final desejado é de 800 unidades, e um mínimo de 500 unidades deve estar disponível ao final de cada mês (estoque de segurança). A taxa de produção anterior era de 3.000 unidades por mês. A soldagem é o gargalo: 5 células de soldagem × 2 turnos × 8 horas × 20 dias = 1.600 horas por mês; cada mesa exige 0,4 hora de soldagem, portanto a taxa máxima é 1.600 / 0,4 = **4.000 mesas por mês**. Custos: manutenção de US$ 4 por unidade por mês sobre o estoque final; cada unidade de variação na taxa mensal (contratação, treinamento, preparação de horas extras ou demissão) custa US$ 5.

| Mês | Demanda | Nivelada: produção | Nivelada: estoque final | Perseguição: produção | Perseguição: estoque final | Híbrida: produção | Híbrida: estoque final |
|---|---|---|---|---|---|---|---|
| Jan | 3.000 | 3.800 | 1.600 | 3.000 | 800 | 3.500 | 1.300 |
| Fev | 3.200 | 3.800 | 2.200 | 3.200 | 800 | 3.500 | 1.600 |
| Mar | 4.200 | 3.800 | 1.800 | **4.200** | 800 | 4.000 | 1.400 |
| Abr | 4.800 | 3.800 | 800 | **4.800** | 800 | 4.000 | 600 |
| Mai | 4.000 | 3.800 | 600 | 4.000 | 800 | 4.000 | 600 |
| Jun | 2.800 | 3.800 | 1.600 | 2.800 | 800 | 3.000 | 800 |
| **Total** | **22.000** | **22.800** | **8.600 unidades-mês** | **22.000** | **4.800 unidades-mês** | **22.000** | **6.300 unidades-mês** |

Por que a taxa nivelada é 3.800: a demanda acumulada até maio é de 19.200 unidades; com 500 unidades necessárias ao final de maio e 800 disponíveis no início, a produção até maio deve ser de pelo menos 19.200 + 500 − 800 = 18.900, ou 3.780 por mês. Arredondado para 3.800, o plano nivelado termina junho com 1.600 unidades, 800 acima da meta.

| Elemento de custo | Nivelada | Perseguição | Híbrida |
|---|---|---|---|
| Variações de taxa (unidades × US$ 5) | 3.000 → 3.800: 800 → US$ 4.000 | +200, +1.000, +600, −800, −1.200 = 3.800 → US$ 19.000 | +500, +500, −1.000 = 2.000 → US$ 10.000 |
| Manutenção (unidades-mês × US$ 4) | 8.600 → US$ 34.400 | 4.800 → US$ 19.200 | 6.300 → US$ 25.200 |
| **Total** | **US$ 38.400** | **US$ 38.200** | **US$ 35.200** |
| Viável no gargalo de soldagem (≤ 4.000/mês)? | sim | **não** (março 4.200, abril 4.800) | sim |
| Estoque final vs. meta de 800 | +800 | na meta | na meta |

O plano de perseguição parece quase tão barato quanto o nivelado no papel, mas é inviável: março e abril excedem a capacidade de soldagem, a menos que a empresa adicione um terceiro turno, o que traria custo próprio. O plano híbrido é o mais barato entre as opções viáveis e mantém a soldagem exatamente a 100% por três meses, o que não deixa capacidade de proteção. As variações de taxa não são apenas uma linha de custo. Um plano de perseguição significa contratar, usar mão de obra temporária, demitir ou manter horas extras constantes; acordos sindicais, regras de aviso prévio para horas extras e limites de fadiga restringem a velocidade com que uma fábrica pode alterar sua taxa, e os operadores arcam com o custo de cada oscilação. A revisão de abastecimento deve perguntar à fábrica e ao RH o que é realista antes de modelar essa opção. As finanças acrescentarão um segundo efeito: sob custeio padrão, meses de baixa produção absorvem menos custos indiretos fixos, de modo que um plano de perseguição gera variações de absorção que um plano nivelado evita.

Essa é a decisão que a revisão de abastecimento deve levar à reunião executiva: aprovar o plano híbrido e decidir se vale qualificar um subcontratado de soldagem para 200–400 mesas por mês como seguro. Operar um gargalo com utilização total faz filas e prazos de entrega aumentarem bruscamente, como mostra a [seção do guia de APS sobre física da fábrica](https://www.m365.fm/en/learn/production-scheduling-aps/) com a Lei de Little e as curvas de operação, e o [guia da teoria das restrições](https://www.m365.fm/en/learn/theory-of-constraints/) explica como proteger o tambor.

## S&OP vs. IBP vs. S&OE

Os três termos descrevem escopos e horizontes diferentes.

| Aspecto | S&OP | Integrated business planning (IBP) | Sales and operations execution (S&OE) |
|---|---|---|---|
| Pergunta | Demanda e oferta batem por família? | O plano de negócio como um todo (portfólio, demanda, oferta, financeiro, estratégia) se sustenta? | O que mudamos esta semana para executar o plano? |
| Horizonte | Oliver Wight: tipicamente 6–12 meses; SAP e outros: 18–36 meses em rolagem [2][5] | no mínimo 24 meses [2] | 0–3 meses (semanas) [unverified: horizonte como usado comumente por profissionais] |
| Cadência | mensal | mensal | semanal |
| Unidades | unidades e dólares por família | principalmente dólares, além de unidades | unidades por SKU e cliente |
| Coordenação | Gerente geral ou VP de operações | CEO ou presidente da unidade de negócio | gerente de cadeia de suprimentos ou de planejamento |
| Origem | Oliver Wight, anos 1980 [1][2] | Oliver Wight, início dos anos 2000 [2] | termo de prática profissional, sem origem única verificada |

A Oliver Wight descreve o S&OP como centrado nos trade-offs da cadeia de suprimentos e o IBP como o que traz a empresa inteira para a visão, abrangendo portfólio, demanda, oferta e financeiro [2]. Muitas empresas usam os termos como sinônimos. O rótulo importa menos do que dois fatos: se finanças e portfólio fazem parte do processo e se a equipe executiva toma decisões nele. O S&OE é a ponte semanal entre o plano aprovado e o MPS: trata de mudanças de demanda de curto prazo, interrupções de oferta e alocação dentro das zonas congelada e pastosa do MPS (Seção 8).

**Agenda semanal do S&OE (30–45 minutos, ilustrativa)**

| Tempo | Tema | Responsável |
|---|---|---|
| 5 min | semana passada: aderência ao MPS, embarques vs. plano, três principais falhas | programador-mestre |
| 10 min | mudanças de demanda dentro da janela de tempo de planejamento: novos pedidos grandes, cancelamentos, alocação de oferta escassa | planejador de demanda, atendimento ao cliente |
| 10 min | problemas de oferta: atrasos de fornecedores, paradas de máquinas, bloqueios de qualidade, falta de material a partir de exceções do MRP | planejador de oferta, fábrica |
| 10 min | decisões dentro das regras do MPS; o que estiver fora das regras é escalado para a próxima etapa do S&OP | gerente de cadeia de suprimentos |
| 5 min | ações, responsáveis, datas | programador-mestre |

## Modelos de maturidade do S&OP

Modelos de maturidade ajudam a empresa a ver em que ponto está e qual é o próximo passo. Três são amplamente usados.

**Gartner.** A Gartner publica um roteiro de maturidade do S&OP com cinco níveis [17]. Sua página pública de visão geral não lista os nomes dos níveis; fontes secundárias descrevem os níveis de forma aproximada, do nível 1, sem objetivos compartilhados e com planejamento baseado em planilhas e descoordenado, passando por planejamento de vendas operacional, balanceamento de demanda e oferta em toda a cadeia de suprimentos e um mix de produtos orientado à demanda e rentável, até o nível 5, uma empresa conectada em que o S&OP faz parte do planejamento de negócios como um todo e as decisões são baseadas em cenários [18]. [unverified: nomes dos níveis próprios da Gartner; as descrições acima seguem o resumo da Jedox, fornecedora de software de planejamento.]

**Grimson e Pyke (2007).** J. Andrew Grimson e David Pyke propuseram um modelo com cinco dimensões e cinco estágios: sem processo de S&OP, reativo, padrão, avançado e proativo [1][19].

**Wagner, Ullrich e Transchel (2014).** Stephan Wagner e colegas descrevem quatro dimensões e seis estágios, do não desenvolvido ao proativo, junto com o processo de cinco etapas usado na Seção 4 [1][20].

Uma autoavaliação simples, derivada das dimensões que esses modelos têm em comum (reuniões e colaboração, organização, medição, tecnologia da informação, integração do plano):

| Dimensão | Estágio 1: nenhum ou reativo | Estágio 2: padrão | Estágio 3: avançado | Estágio 4: proativo |
|---|---|---|---|---|
| Reuniões | combate a incêndios, sem regularidade | ciclo mensal, executivo participa às vezes | ciclo completo de cinco etapas, executivo preside todo mês | ciclo inclui cenários e estratégia, executivos decidem entre opções |
| Organização | sem responsável | coordenador em tempo parcial | responsável dedicado pelo processo, direitos de decisão por escrito | o S&OP é a forma como o negócio é conduzido |
| Medição | nenhuma | serviço e estoque | acurácia e viés da previsão, atingimento do plano | KPIs ligados aos resultados financeiros e aos incentivos |
| TI | planilhas separadas | planilha compartilhada ou relatórios do ERP | ferramenta de planejamento integrada, reconciliação família/SKU | planejamento de cenários, fluxo de dados automatizado |
| Integração do plano | planos de vendas e de produção diferentes | um plano de volume | plano de volume reconciliado com o plano financeiro | um único plano orienta orçamento, MPS e capex |

A evidência de pesquisa sobre os efeitos do S&OP é favorável, mas não uniforme. Uma revisão de literatura de Antônio Márcio Tavares Thomé e coautores, no *International Journal of Production Economics*, sintetizou a literatura sobre S&OP até 2012 [22], e um estudo complementar relacionou o S&OP ao desempenho da empresa [23]. Trabalhos posteriores enfatizam que o desenho adequado do S&OP depende do contexto, como porte da empresa, complexidade do produto e incerteza da cadeia de suprimentos [34]. Alegações de melhorias percentuais fixas obtidas com o S&OP nas páginas de fornecedores devem ser lidas como alegações do fornecedor.

## Plano-mestre de produção (MPS) e disponível para promessa (ATP)

O **plano-mestre de produção** é uma declaração do que a empresa espera produzir, com base no plano tático e nas restrições orçamentárias, conforme a documentação do JD Edwards da Oracle afirma [7]. Ele fica entre o S&OP e o MRP: é específico o bastante (item final, semana) para orientar o planejamento de materiais e capacidade, e estável o bastante para proteger a fábrica do ruído diário. O MRP então calcula as necessidades líquidas faseadas no tempo de cada componente para dar suporte ao MPS [7].

### Desagregação: de família para item final

O plano de S&OP aprovado para "mesas de estrutura de aço" em abril é de 4.000 unidades. O programador-mestre o divide por item final usando o mix atual e os pedidos conhecidos: 55% D100 (2.200), 30% D120 (1.200) e 15% D140 (600), depois por semana. Listas de materiais de planejamento são usadas quando as opções são planejadas como percentuais, por exemplo 60% estruturas pretas e 40% brancas.

### Janelas de tempo (time fences)

O MPS é dividido em zonas com regras de mudança diferentes. Nomes e regras típicos de zonas (definições exatas e extensões das zonas variam conforme a empresa e o ERP):

| Zona | Extensão típica | O que pode mudar | Quem aprova |
|---|---|---|---|
| Congelada | de hoje até a janela de demanda (por exemplo, lead time da montagem final) | nada, exceto emergências | gerente da fábrica ou reunião de S&OE |
| Semicongelada | da janela de demanda até a janela de planejamento (por exemplo, lead time acumulado de componentes comprados de longo prazo) | mix dentro da família; quantidades dentro da tolerância acordada | programador-mestre |
| Livre | além da janela de planejamento | qualquer coisa consistente com o S&OP | sistema de planejamento e programador-mestre |

A zona congelada é o que os slides do MIT de Gershwin significam ao congelar a programação de curto prazo: ela reduz a instabilidade ao custo de flexibilidade [8]. A seção 12 quantifica por que isso acontece.

### Registro do MPS com saldo disponível projetado e ATP

**Exemplo trabalhado (números ilustrativos).** Item final D100, estoque físico de 60 unidades, tamanho de lote do MPS de 200, estoque de segurança 0, janela de demanda ao final da semana 2. Dentro da janela de demanda, a demanda projetada são apenas os pedidos de clientes; fora dela, é o maior valor entre a previsão e os pedidos de clientes.

| Semana | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Previsão | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| Pedidos de clientes | 90 | 70 | 40 | 20 | 10 | 0 | 0 | 0 |
| Demanda projetada | 90 | 70 | 100 | 100 | 100 | 100 | 100 | 100 |
| MPS (conclusões) | 200 | | | 200 | | 200 | | 200 |
| Saldo disponível projetado (PAB), inicial 60 | 170 | 100 | 0 | 100 | 0 | 100 | 0 | 100 |
| ATP discreto | 60 | | | 170 | | 200 | | 200 |
| ATP acumulado | 60 | 60 | 60 | 230 | 230 | 430 | 430 | 630 |

Como os números são obtidos:

- **PAB, semana 1:** 60 + 200 − 90 = 170. Semana 2: 170 − 70 = 100. Semana 3: 100 − 100 = 0. Na semana 4 o saldo iria para −100, então o MPS planeja um lote de 200: 0 + 200 − 100 = 100. E assim por diante.
- **ATP discreto** é calculado apenas nas semanas com recebimento do MPS: estoque físico (somente no primeiro período) mais a quantidade do MPS menos todos os pedidos de clientes até o próximo recebimento do MPS. Semana 1: 60 + 200 − (90 + 70 + 40) = 60. Semana 4: 200 − (20 + 10) = 170. Semanas 6 e 8: 200 − 0 = 200.
- **ATP acumulado** soma o ATP discreto ao longo do tempo: 60, depois 60 + 170 = 230, depois 430, depois 630.
- Alguns sistemas ERP usam uma variante de visão antecipada: se os pedidos de clientes em um período posterior excederem o recebimento do MPS desse período, a falta é deduzida do ATP dos períodos anteriores, para que as mesmas unidades não sejam prometidas duas vezes. Neste exemplo nenhum período está com excesso de promessas, portanto os dois métodos dão o mesmo resultado.

O que o comercial pode prometer: um cliente que quer 100 mesas na semana 2 pode receber no máximo 60 do plano atual; as 100 unidades completas estão disponíveis a partir da semana 4 (ATP acumulado de 230). O PAB de 0 na semana 3 não é um problema para a promessa, porque o ATP usa pedidos de clientes, e não a previsão. É um sinal para o programador-mestre de que o plano não tem folga caso os pedidos da semana 3 excedam a previsão. Sistemas ERP como o JD Edwards reportam o ATP e o ATP acumulado como saídas padrão do MPS [7].

### Regras de MPS que mantêm o cronograma confiável

| Regra | Motivo |
|---|---|
| A soma do MPS por família permanece dentro de ±5% do plano de S&OP (tolerância de exemplo) | caso contrário, as decisões de S&OP não chegam ao chão de fábrica |
| Sem sobrecarga: carga do RCCP ≤ capacidade demonstrada nos recursos-chave | um MPS superestimado torna fictícias as datas de ATP e de MRP |
| Mudanças dentro da zona congelada exigem aprovação nominal | protege material e capacidade já comprometidos |
| Ordens planejadas firmes para o curto prazo | a execução do MRP não consegue movê-las automaticamente |
| O ATP é verificado antes de cada promessa de pedido | evita prometer duas vezes a mesma capacidade |
| Revisão semanal do MPS na reunião de S&OE | detecta desvios antes que se tornem pedidos atrasados |

## Planejamento de capacidade aproximado (RCCP)

O planejamento de capacidade aproximado verifica o MPS contra alguns **recursos críticos** antes que o MRP o explode. É "aproximado" porque usa uma lista de recursos (horas por item final em cada recurso-chave), e não roteiros completos, e ignora a maioria dos deslocamentos de prazo de entrega.

**Exemplo trabalhado (números ilustrativos).** MPS semanal para os três modelos de mesa e sua lista de recursos em três recursos-chave:

| Modelo | MPS semana 14 | Soldagem (h/unid.) | Pintura a pó (h/unid.) | Montagem final (h/unid.) |
|---|---|---|---|---|
| D100 | 550 | 0,40 | 0,10 | 0,25 |
| D120 | 300 | 0,45 | 0,12 | 0,30 |
| D140 | 150 | 0,60 | 0,15 | 0,40 |

| Recurso | Cálculo da carga | Carga (h) | Capacidade semanal (h) | Utilização |
|---|---|---|---|---|
| Soldagem | 550 × 0,40 + 300 × 0,45 + 150 × 0,60 = 220 + 135 + 90 | 445 | 400 | **111%** |
| Pintura a pó | 550 × 0,10 + 300 × 0,12 + 150 × 0,15 = 55 + 36 + 22,5 | 113,5 | 160 | 71% |
| Montagem final | 550 × 0,25 + 300 × 0,30 + 150 × 0,40 = 137,5 + 90 + 60 | 287,5 | 320 | 90% |

A soldagem está sobrecarregada em 45 horas. Opções: mover 75 mesas D140 (75 × 0,60 = 45 h) para a semana 15, caso a semana 15 tenha folga e as datas dos clientes permitam; planejar 45 horas extras; ou transferir parte dos quadros D100 para o subcontratado previsto na revisão de suprimentos. A capacidade semanal de soldagem de 400 horas corresponde às 1.600 horas por mês usadas no S&OP (Seção 5), e esse é o ponto: o RCCP usa as mesmas definições de recursos da revisão de suprimentos do S&OP, de modo que os níveis possam ser conciliados.

Três técnicas de RCCP são comuns em livros-texto e sistemas ERP: planejamento de capacidade por fatores globais (percentuais históricos das horas totais por centro de trabalho), listas de capacidade ou listas de recursos (horas por unidade por recurso, como acima) e perfis de recursos que acrescentam deslocamentos de tempo. Quanto mais detalhado o método, mais ele se aproxima do planejamento de necessidades de capacidade (Seção 11).

## Planejamento das necessidades de materiais (MRP): como o cálculo funciona

**Planejamento das necessidades de materiais (MRP)** usa a lista de materiais e os registros de estoque para calcular necessidades líquidas escalonadas no tempo para cada componente e subconjunto, e sugere um plano de reposição que dá suporte ao MPS [7]. Sua lógica se apoia em uma ideia de Orlicky: a demanda por componentes é *dependente* da demanda do item final, portanto deve ser calculada, não prevista [13]. Se a fábrica produz 150 mesas na semana 3 e cada mesa tem quatro pernas, ela precisa de 600 pernas antes da semana 3, independentemente do que uma previsão estatística para pernas indicaria.

### As entradas

| Entrada | Conteúdo | Problema típico de qualidade de dados |
|---|---|---|
| Programa mestre de produção | itens finais, quantidades, datas | MPS não reconciliado com S&OP, ou com sobrecarga |
| Lista de materiais (BOM) | relações pai-componente, quantidade por, fatores de sucata, datas de vigência | BOM de engenharia usada no lugar da BOM de fabricação; montagens fantasma ausentes; desatualizada após alterações de engenharia |
| Registros de estoque | disponível, alocado, estoque de segurança | contagens erradas; sucata e consumo não lançados |
| Ordens em aberto (recebimentos programados) | ordens de produção e de compra liberadas, com datas de entrega | datas de entrega não mantidas; ordens encerradas com atraso |
| Dados de planejamento do cadastro de itens | lead time, regra de lote, múltiplos de pedido, mínimos, rendimento | lead times definidos anos atrás e nunca revisados |

Os slides do MIT de Gershwin listam os mesmos blocos de construção: necessidades brutas, recebimentos programados, estoque projetado, necessidades líquidas, recebimentos de ordens planejadas e liberações de ordens planejadas, deslocados pelo lead time [8].

### Os cinco passos para cada item

1. **Necessidades brutas:** o MPS para itens finais, ou as liberações de ordens planejadas de todos os pais multiplicadas pela quantidade por, para componentes.
2. **Balanceamento:** estoque projetado = estoque anterior + recebimentos programados − necessidades brutas. Quando ele ficaria abaixo do estoque de segurança, a diferença é a **necessidade líquida**.
3. **Dimensionamento de lote:** a necessidade líquida torna-se um **recebimento de ordem planejada** de acordo com a regra de lote (lote a lote, quantidade fixa de pedido, múltiplos, quantidade por período).
4. **Deslocamento:** o recebimento de ordem planejada é deslocado para trás pelo lead time do item para obter a **liberação de ordem planejada**.
5. **Explosão:** as liberações de ordens planejadas tornam-se necessidades brutas do próximo nível da BOM.

Os itens são processados nível a nível, na ordem de **código de baixo nível**: cada item recebe um código igual ao nível mais baixo em que aparece em qualquer BOM, de modo que todas as necessidades brutas de todos os pais sejam reunidas antes de o item ser balanceado [8]. O exemplo resolvido mostra por que isso importa.

### Exemplo resolvido: explosão e balanceamento do MRP em dois níveis da BOM

**Estrutura do produto (ilustrativa).** A mesa D100 é composta por um tampo T-20, um conjunto de pés F-10 e 1 metro de tubo de aço S-5 para uma travessa. Cada conjunto de pés F-10 é soldado com 4 metros de tubo de aço S-5. O S-5 aparece, portanto, no nível 1 (diretamente na D100) e no nível 2 (no F-10); seu código de baixo nível é 2.

```
D100 Mesa (nível 0)
├── T-20 Tampo, qtd 1 (nível 1, fabricado internamente, lead time 1 semana)
├── F-10 Conjunto de pés, qtd 1 (nível 1, soldado internamente, lead time 2 semanas)
│   └── S-5 Tubo de aço, 4 m (nível 2, comprado, lead time 2 semanas)
└── S-5 Tubo de aço, 1 m (nível 1, travessa)
```

Para manter as tabelas legíveis, a linha do MPS mostra a semana em que a montagem final da D100 começa; os componentes devem estar disponíveis no início dessa semana.

**MPS da D100 (início da montagem final):**

| Semana | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Total |
|---|---|---|---|---|---|---|---|---|---|
| Início da montagem da D100 | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 | 740 |

**Item T-20 Tampo.** Lote a lote, lead time 1 semana, estoque disponível 30, recebimento programado 100 na semana 1, estoque de segurança 0.

| Semana | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Necessidades brutas | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 |
| Recebimentos programados | 100 | | | | | | | |
| Estoque projetado (início 30) | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 0 |
| Necessidades líquidas | | | 140 | 100 | | 150 | 100 | 120 |
| Recebimentos de ordens planejadas | | | 140 | 100 | | 150 | 100 | 120 |
| Liberações de ordens planejadas | | 140 | 100 | | 150 | 100 | 120 | |

Semana 1: 30 + 100 − 120 = 10. Semana 3: 10 − 150 = −140, portanto 140 são necessárias e liberadas uma semana antes, na semana 2.

**Item F-10 Conjunto de pés.** Quantidade fixa de pedido 200 (um lote de solda), lead time 2 semanas, estoque disponível 120, sem recebimentos programados, estoque de segurança 0.

| Semana | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Necessidades brutas | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 |
| Estoque projetado (início 120) | 0 | 0 | 50 | 150 | 150 | 0 | 100 | 180 |
| Necessidades líquidas | | | 150 | 50 | | | 100 | 20 |
| Recebimentos de ordens planejadas | | | 200 | 200 | | | 200 | 200 |
| Liberações de ordens planejadas | 200 | 200 | | | 200 | 200 | | |

Semana 3: 0 − 150 = −150, portanto um lote de 200 chega, deixando 50. Semana 4: 50 − 100 = −50, outro lote de 200, deixando 150. A semana 6 consome exatamente os 150 restantes. As liberações são antecipadas em duas semanas.

**Item S-5 Tubo de aço (código de nível inferior 2).** Comprado, prazo de entrega de 2 semanas, pedido em múltiplos de 500 m, estoque de 1.400 m, recebimento programado de 500 m na semana 1, estoque de segurança de 100 m. As necessidades brutas combinam os dois itens pai:

| Semana | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Das liberações de F-10 (× 4 m) | 800 | 800 | | | 800 | 800 | | |
| Dos inícios de D100 (× 1 m) | 120 | | 150 | 100 | | 150 | 100 | 120 |
| **Necessidades brutas** | **920** | **800** | **150** | **100** | **800** | **950** | **100** | **120** |
| Recebimentos programados | 500 | | | | | | | |
| Estoque projetado (início 1.400) | 980 | 180 | 530 | 430 | 130 | 180 | 580 | 460 |
| Necessidades líquidas | | | 70 | | 470 | 920 | 20 | |
| Recebimentos de ordens planejadas | | | 500 | | 500 | 1.000 | 500 | |
| Liberações de ordens planejadas | 500 | | 500 | 1.000 | 500 | | | |

Semana 3: 180 − 150 = 30, abaixo do estoque de segurança de 100, portanto a necessidade líquida é 70 e um múltiplo de 500 é pedido (estoque projetado 530). Semana 6: 130 − 950 = −820; para terminar no mínimo em 100, a necessidade líquida é 920, arredondada para cima para 1.000.

**O que o exemplo mostra**

- **A demanda dependente é irregular.** A demanda de mesas é relativamente uniforme (100 a 150 por semana), mas a demanda de tubos salta entre 100 e 950 m por semana porque os lotes de soldagem de 200 estruturas consomem 800 m de uma só vez. Uma previsão estatística do consumo de tubos deixaria passar esses picos; a explosão da lista de materiais não deixa.
- **A codificação de nível inferior evita faltas.** Se o S-5 tivesse sido calculado no nível 1 (apenas com a demanda de travessas de 120 a 150 m por semana), o MRP não veria nenhuma necessidade até a semana 7, e as estruturas ficariam sem tubo na semana 2.
- **Os tamanhos de lote se multiplicam.** Duas regras de dimensionamento de lote (200 estruturas, múltiplos de 500 m) transformaram 740 mesas em 2.500 m de pedidos de tubo em cinco semanas. O [guia de dimensionamento de lotes](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/) explica como escolher essas regras; o [guia de gestão de estoque na manufatura](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/) trata do estoque de segurança.
- **A saída do ERP é uma lista de ações:** liberar 200 estruturas e comprar 500 m de tubo esta semana; liberar 140 tampos na semana que vem. O planejador trabalha com essas informações como **mensagens de exceção** (liberar, reprogramar para antecipar, reprogramar para adiar, cancelar) em vez de ler as tabelas completas.

### Pegging e mensagens de exceção

**Pegging** vincula cada necessidade à sua origem: a necessidade de tubo de 950 m da semana 6 está vinculada à liberação de F-10 na semana 6 (800 m) e ao início de D100 na semana 6 (150 m). Com o pegging, um planejador que não consegue obter 1.000 m de tubo na semana 6 vê quais mesas e quais pedidos de clientes estão em risco.

Mensagens de exceção típicas do MRP e o que fazer:

| Mensagem | Significado | Ação típica |
|---|---|---|
| Liberar ordem | a ordem planejada está dentro de sua janela de liberação | converter em ordem de produção ou de compra após verificar capacidade e material |
| Reprogramar para antecipar (expedite) | uma ordem em aberto vence depois do necessário | pedir ao fornecedor ou à fábrica para antecipar; se impossível, escalar para mudança no MPS |
| Reprogramar para adiar (de-expedite) | uma ordem em aberto vence antes do necessário | adiar para reduzir estoque e liberar capacidade |
| Cancelar | uma ordem em aberto não é mais necessária | cancelar ou reduzir; verificar as condições de cancelamento |
| Atrasada | a data de liberação ou de vencimento já passou | o plano é inviável como está: corrigir o MPS, não apenas a ordem |
| Abaixo do estoque de segurança | estoque projetado abaixo do nível de segurança | verificar se o estoque de segurança está correto antes de antecipar |

Uma fábrica com centenas de ordens planejadas atrasadas após cada execução do MRP não tem um problema de MRP. Tem um MPS que não é viável, ou prazos de entrega e tamanhos de lote que não refletem a realidade.

### MRP versus ponto de reposição e kanban

MRP não é a única forma de reabastecer peças. Sistemas de ponto de reposição e kanban reabastecem quando o estoque cai até um nível de disparo e funcionam bem para itens com demanda estável e de alta frequência. O MRP é mais adequado para demanda dependente irregular, prazos de entrega longos, baixo volume e produtos de engenharia. Muitas fábricas usam os dois: kanban para fixadores e peças de alta rotação na linha, MRP para peças de longo prazo e de alto custo. O [guia de kanban e sistema puxado](https://www.m365.fm/en/learn/kanban-pull-system/) e o [guia de manufatura enxuta](https://www.m365.fm/en/learn/lean-manufacturing/) explicam o lado do sistema puxado.

## MRP II, CRP e o ciclo fechado

**Planejamento dos recursos de manufatura (MRP II)** fecha o ciclo em torno do MRP: S&OP e o MPS acima dele, o planejamento de necessidades de capacidade (CRP) e o controle de chão de fábrica abaixo dele, e a ligação com o planejamento financeiro [3][8]. Oliver Wight o descreveu em 1983 [3].

**Planejamento de necessidades de capacidade (CRP)** pega todas as ordens planejadas e liberadas do MRP, aplica os roteiros completos (tempo de setup e de execução por operação e centro de trabalho) e calcula a carga por centro de trabalho e período. Ele mostra sobrecargas, mas não as resolve: o CRP, assim como o MRP, se apoia na premissa de capacidade infinita [8]. Wallace Hopp e Mark Spearman argumentam em *Factory Physics* que o modelo básico do MRP assume prazos de entrega que não dependem da carga, o que só é possível com capacidade ilimitada [9]. O guia de APS mostra um exemplo prático da sobrecarga que o MRP não enxerga e explica a **síndrome do lead time**: planejadores alongam os lead times planejados para cobrir ordens atrasadas, o que libera trabalho antes do necessário, aumenta o WIP e torna os lead times ainda mais longos [26]. Em vez de repetir essas seções, este guia remete a elas: veja [as fraquezas da lógica clássica do MRP](https://www.m365.fm/en/learn/production-scheduling-aps/).

| Elemento do ciclo fechado | Verifica | Retorno se falhar |
|---|---|---|
| Planejamento de recursos no S&OP | capacidade agregada por mês | alterar plano de famílias, decisão de capacidade |
| RCCP | recursos-chave por semana | alterar MPS |
| CRP | todos os centros de trabalho por dia ou semana | horas extras, roteiro alternativo, alterar MPS |
| Controle de entrada/saída e programação finita | filas e sequência reais | reprogramar, controle de liberação, escalar para o MPS |
| Retorno do chão de fábrica (MES) | conclusões, refugo e paradas reais | atualizar ordens abertas e estoque para a próxima execução do MRP |

## Nervosidade do MRP: por que os planos oscilam e como estabilizá-los

**Nervosidade** significa que pequenas mudanças no MPS ou no estoque provocam alterações grandes ou frequentes nas ordens planejadas dos níveis inferiores. Os slides de Gershwin descrevem o fenômeno como pequenos desvios causando grandes mudanças no cronograma [8]. As causas são a interação entre dimensionamento de lotes, deslocamentos de lead time e o horizonte de planejamento rolante, além de ruído nos registros de demanda, suprimento e estoque.

### Exemplo prático: 30 mesas a mais na semana 4

O comercial aceita um pedido extra: o início da montagem D100 na semana 4 passa de 100 para 130, uma variação de 4% do volume de oito semanas (30 de 740). Reexecutando o exemplo acima, obtém-se:

| Item | Antes | Depois | Variação |
|---|---|---|---|
| T-20 Tampo de mesa, liberações planejadas | sem 2: 140, sem 3: 100, sem 5: 150, sem 6: 100, sem 7: 120 | sem 2: 140, sem 3: **130**, sem 5: 150, sem 6: 100, sem 7: 120 | quantidade +30 |
| F-10 Estrutura de pé, liberações planejadas | sem 1, 2, **5**, 6 (200 cada) | sem 1, 2, **4**, 6 (200 cada) | um lote de soldagem antecipado em uma semana |
| S-5 Tubo de aço, liberações planejadas | sem 1: 500, **sem 3: 500**, sem 4: 1.000, sem 5: 500 | sem 1: 500, **sem 2: 500**, sem 4: 1.000, sem 5: 500 | uma ordem de compra antecipada em uma semana, agora com liberação prevista para a próxima semana |

As 30 unidades extras não alteraram nenhuma quantidade de tubos ou estruturas. Elas alteraram **datas** em dois níveis inferiores, porque o lote fixo de 200 estruturas agora se esgota uma semana antes. Em um BOM real, com centenas de componentes, algumas dessas alterações por dia geram milhares de mensagens de reprogramação, e os planejadores deixam de confiar no sistema. Isso é nervosidade.

### Soluções

Joseph Blackburn, Dean Kropp e Robert Millen compararam cinco estratégias para amortecer a nervosidade em um estudo de simulação publicado na *Management Science* em 1986: congelar o cronograma dentro do horizonte de planejamento, lote-a-lote abaixo do item final, estoque de segurança, previsão além do horizonte de planejamento e um procedimento de custo de mudança [10]. Para a nervosidade causada pelo horizonte rolante e pelo dimensionamento de lotes, estoque de segurança e lote-a-lote não foram economicamente eficazes, enquanto as estratégias de custo de mudança e de congelamento geralmente apresentaram o melhor desempenho [10]. O estudo não abordou a nervosidade causada por incertezas de demanda, suprimento ou lead time [10].

| Solução | Como funciona | Compensação |
|---|---|---|
| Zona congelada e time fences | nenhuma alteração automática dentro da zona congelada | menor capacidade de resposta a mudanças reais |
| Ordens planejadas firmes | o planejador fixa ordens selecionadas; o MRP não as altera | o planejador precisa mantê-las |
| Regras de custo de mudança ou de "amortecimento" | o MRP só propõe uma reprogramação se a variação de data superar um limite (por exemplo, 3 dias) ou se o custo da mudança compensar | pequenas divergências permanecem |
| Lote-a-lote nos níveis inferiores | elimina a interação do dimensionamento de lotes | mais setups e mais ordens; Blackburn et al. consideraram-na não econômica para a nervosidade causada pelo horizonte [10] |
| Estoque de segurança | absorve pequenas mudanças | custo de estoque; também não econômico nesse estudo [10] |
| Dados precisos | menos alterações artificiais causadas por estoques ou BOMs incorretos | exige contagem cíclica e disciplina nas mudanças de engenharia |
| Desacoplamento com buffers (DDMRP) | quebra a cadeia de dependências em pontos selecionados | estoque de buffer; método novo a ser aprendido |

## MRP orientado pela demanda (DDMRP)

**O planejamento das necessidades de materiais orientado pela demanda (DDMRP)** mantém a lógica de lista de materiais do MRP, mas interrompe a explosão das necessidades baseadas em previsão em pontos de desacoplamento selecionados, onde são posicionados estoques de segurança dimensionados e gerenciados ativamente. As ordens de suprimento são geradas a partir da demanda real e do status do estoque de segurança, e não apenas da previsão. O método vem dos consultores Carol Ptak e Chad Smith: a atualização de 2011 que eles fizeram do livro de Orlicky, *Orlicky's Material Requirements Planning, Third Edition*, acrescenta orientações para planejar a partir de pedidos de venda reais, e não de previsões, sob o nome DDMRP [4]. A TechTarget observa que alguns profissionais consideram a abordagem controversa [4]. Ptak e Smith também fundaram o Demand Driven Institute em 2011; a instituição avalia e certifica softwares quanto à conformidade com o DDMRP, sem cobrar dos fornecedores, e concede certificados de endosso profissional a indivíduos [35].

### Os cinco componentes

A documentação da Microsoft para o Dynamics 365 Supply Chain Management lista os cinco componentes do DDMRP [11]:

1. **Posicionamento estratégico de estoque:** identificar, na cadeia de suprimentos, os pontos de desacoplamento onde se mantém, monitora e repõe um estoque de segurança.
2. **Perfis e níveis de estoque de segurança:** dimensionar cada estoque de segurança (mínimo, máximo, ponto de reposição) e a quantidade de reposição.
3. **Ajustes dinâmicos do estoque de segurança:** ajustar os níveis do estoque de segurança para parâmetros operacionais em mudança ou eventos planejados.
4. **Planejamento orientado pela demanda:** gerar ordens de suprimento (produção, compra, transferência) conforme necessário.
5. **Execução altamente colaborativa e visível:** executar as ordens de suprimento com prioridade visual, normalmente por cor do estoque de segurança.

### Dimensionamento do estoque de segurança: exemplo trabalhado

Cada estoque de segurança tem três zonas, calculadas a partir do uso médio diário (ADU), do lead time desacoplado (DLT), de um fator de lead time e de um fator de variabilidade, conforme documentado pela Microsoft [12]:

| Zona | Fórmula [12] |
|---|---|
| Amarela | ADU × DLT |
| Vermelha base | ADU × DLT × fator de lead time |
| Vermelha de segurança | vermelha base × fator de variabilidade |
| Vermelha | vermelha base + vermelha de segurança |
| Verde | o maior entre: quantidade mínima de pedido; ADU × ciclo de pedido; ADU × DLT × fator de lead time |

A Microsoft recomenda fatores de lead time de 0,20–0,40 para lead times longos, 0,41–0,60 para médios e 0,61–1,00 para curtos, e fatores de variabilidade de 0,20–0,40 para baixa, 0,41–0,60 para média e 0,61–1,00 para alta variabilidade [12]. **Lead time desacoplado** é o tempo necessário para produzir ou receber um item quando os pontos de desacoplamento a montante estão com estoque; normalmente é bem menor que o lead time acumulado [12].

**Exemplo (números ilustrativos).** Uma cantoneira comprada B-7: ADU de 40 peças, lead time desacoplado de 10 dias, fator de lead time de 0,5 (médio), fator de variabilidade de 0,5 (médio), quantidade mínima de pedido de 300, ciclo de pedido de 7 dias.

| Zona | Cálculo | Tamanho | Acumulado (topo da zona) |
|---|---|---|---|
| Vermelha base | 40 × 10 × 0,5 | 200 | |
| Vermelha de segurança | 200 × 0,5 | 100 | |
| Vermelha | 200 + 100 | 300 | 300 |
| Amarela | 40 × 10 | 400 | 700 |
| Verde | máx(300; 40 × 7 = 280; 200) | 300 | 1.000 |

### A equação do fluxo líquido

O DDMRP decide a reposição com a **posição de fluxo líquido**: estoque disponível + em pedido − demanda qualificada de pedidos de venda [14]. A demanda qualificada normalmente inclui pedidos com vencimento hoje, pedidos atrasados e picos qualificados dentro de um horizonte definido. Se a posição de fluxo líquido cair abaixo do topo da zona amarela, cria-se uma ordem de suprimento para levá-la de volta ao topo da zona verde [14].

Continuando o exemplo: estoque disponível 350, em pedido 400, demanda qualificada 90. Posição de fluxo líquido = 350 + 400 − 90 = **660**. Está abaixo do topo da zona amarela (700), portanto o DDMRP propõe uma ordem de 1.000 − 660 = **340** peças. A ordem excede a quantidade mínima de pedido de 300, então é válida. A prioridade de execução é então definida pelo status do estoque disponível: 350 unidades estão logo acima do topo da zona vermelha (300), o que um planejador trataria como urgente.

### Quando o DDMRP se encaixa e quando não se encaixa

| Situação | Adequação do DDMRP | Motivo |
|---|---|---|
| Lead times acumulados longos, clientes esperam prazos curtos | boa | o desacoplamento comprime o lead time que o cliente percebe |
| Muitos componentes compartilhados, alta variabilidade, nervosismo frequente do MRP | boa | os buffers absorvem a variabilidade em vez de repassá-la pela BOM |
| Demanda estável e previsível, BOMs curtas | limitada | o MRP clássico ou o kanban podem ser mais simples |
| Projetos únicos de engenharia sob encomenda | limitada | poucos itens recorrentes para bufferizar; o planejamento de projeto domina |
| Acurácia de estoque e dados mestres fracos | ruim | buffers dimensionados com ADU ou lead times errados protegem os itens errados |

O DDMRP não substitui o S&OP. As políticas de buffer, a capacidade e o investimento em estoque ainda exigem uma decisão mensal multifuncional, e o ERP ainda precisa do MPS para os itens finais que não são bufferizados. No Dynamics 365, o DDMRP faz parte do módulo de planejamento mestre, usa seu próprio código de cobertura, não tem taxas adicionais de licença e requer o complemento Planning Optimization; a Microsoft ressalta que ele não substitui a funcionalidade de planejamento existente [11]. A SAP inclui o DDMRP entre os tópicos do seu material de MRP [27], e a IFS documenta o DDMRP no IFS Cloud [14]. As evidências independentes e revisadas por pares sobre os resultados do DDMRP ainda são mais escassas do que o material de fornecedores e consultorias; trate os percentuais de melhoria divulgados por fornecedores de DDMRP como alegações do fornecedor.

## Planejamento de produção no ERP: o que os sistemas fazem e onde param

Quase todo ERP de manufatura contém um motor de MPS e de MRP. O S&OP é tratado de três formas: no próprio ERP, em uma plataforma dedicada de S&OP ou IBP conectada ao ERP, ou em planilhas ao redor do ERP.

### Funções típicas de planejamento no ERP

| Função | O que procurar |
|---|---|
| Gestão de demanda e previsão | modelos estatísticos, consumo de previsão por pedidos, previsão por família e por SKU |
| MPS | time fences, ordens planejadas firmes, planning bills para opcionais, ATP e ATP cumulativo [7] |
| RCCP | bills of resources para recursos-chave, relatórios de carga vs. capacidade |
| MRP | execuções net change e regenerativas, códigos de nível mais baixo, regras de lote, pegging, mensagens de exceção |
| CRP | carga por centro de trabalho a partir dos roteiros |
| DDMRP | pontos de desacoplamento, perfis de buffer, net flow (onde suportado) [11] |
| Integração | com ferramenta de S&OP, APS, MES, portais de fornecedores, BI |

### Opções no mercado (exemplos, não um ranking)

| Categoria | Exemplos verificados para este guia | Observações |
|---|---|---|
| ERP com MPS/MRP | Oracle JD Edwards EnterpriseOne (MPS, MRP, ATP) [7]; Microsoft Dynamics 365 Supply Chain Management (planejamento mestre com Planning Optimization, DDMRP) [11]; SAP S/4HANA (MRP; o material da SAP cobre MRP preditivo e DDMRP) [27]; IFS Cloud (DDMRP) [14] | muitos outros fornecedores de ERP oferecem MRP; verifique a profundidade do planejamento em uma demonstração roteirizada |
| S&OP e IBP adjacentes ao ERP | SAP Integrated Business Planning [5]; Oracle Fusion Cloud Sales and Operations Planning [33] | mais forte quando o ERP é do mesmo fornecedor |
| Plataformas de S&OP / IBP independentes | Kinaxis, o9 Solutions, Blue Yonder, ToolsGroup, Board, Anaplan (lista de fornecedores segundo o guia de compradores de 2026 da Board, escrito por um dos fornecedores) [29][15] | rankings de fornecedores feitos pelos próprios fornecedores não são independentes; use relatórios de analistas com metodologia declarada |
| Planilhas | Excel com extrações do ERP; Power BI para relatórios de KPI | adequado para um primeiro ciclo de S&OP com poucas famílias; frágil em escala |

Para empresas centradas na Microsoft, uma configuração prática é executar o MPS e o MRP no ERP, preparar o S&OP no Excel ou em uma ferramenta de planejamento, e publicar o pacote de KPIs e o registro de decisões por meio do Power BI e do Teams. A Microsoft posiciona o Dynamics 365, o Microsoft 365 e o Azure em conjunto como "Microsoft for Manufacturing" [31], e os dados do Dataverse podem ser disponibilizados no Microsoft Fabric sem um pipeline de ETL separado [32]. O [guia de Azure para manufatura](https://www.m365.fm/en/learn/manufacturing-it-azure/) aborda a arquitetura.

### Como o ERP executa o MRP

A maioria dos sistemas ERP oferece dois modos de execução: uma execução **regenerativa**, que recalcula todos os itens do zero, frequentemente todas as noites ou semanalmente, e uma execução de **variação líquida** (net change), que recalcula apenas os itens cuja demanda, oferta ou dados mestres foram alterados. Em qualquer dos casos, o plano é tão atual quanto os dados que a execução enxerga: se o MES registra conclusões e sucata apenas uma vez por turno, mas o MRP roda às 2 h da manhã, a lista de exceções da manhã reflete o chão de fábrica do dia anterior. Alinhe o horário de execução do MRP com o ciclo de lançamentos do MES e do estoque, e mantenha o MPS estável durante a execução, para que os planejadores e o sistema não trabalhem em sentidos opostos. O [guia de MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) trata da troca de dados entre o Nível 3 e o Nível 4.

### Onde o planejamento do ERP para

- **Capacidade finita.** O MRP e o CRP do ERP planejam com capacidade infinita [8]. Quando um gargalo determina as datas de entrega, é necessário um programador de capacidade finita ou um APS; veja o [guia de APS](https://www.m365.fm/en/learn/production-scheduling-aps/).
- **Cenários.** Comparar três opções de suprimento com efeitos completos de materiais e capacidade é lento na maioria das execuções de MRP do ERP. Plataformas de planejamento anunciam recálculo rápido de cenários; a Kinaxis, por exemplo, descreve um planejamento concorrente que reduz ciclos de semanas para horas (afirmação do fornecedor) [16].
- **Resposta a interrupções.** Em uma pesquisa da IDC encomendada pela Kinaxis (1.800 respondentes em nove países, realizada em dezembro de 2023), 83% das cadeias de suprimentos não conseguiram responder a interrupções em até 24 horas (pesquisa encomendada pelo fornecedor) [30].
- **Execução.** Despacho, confirmações e WIP em tempo real pertencem ao MES (ISA-95 Nível 3) [25].

### Lista de verificação para seleção de software de S&OP e planejamento

| Pergunta | Por que importa |
|---|---|
| Ele consegue reconciliar automaticamente os planos de famílias com o MPS em nível de SKU? | o esforço manual mais comum em S&OP |
| Ele mostra os planos em unidades e em dólares lado a lado? | as finanças precisam fazer parte do processo |
| Quanto tempo leva para calcular um cenário completo (mudança de demanda + capacidade + materiais)? | determina se os cenários são usados nas reuniões |
| Quais integrações com ERP são padrão e quem as mantém? | a integração frequentemente custa mais do que as licenças |
| Os planejadores conseguem alterar dados mestres (lead times, tamanhos de lote) com trilha de auditoria? | a qualidade dos dados é o principal fator da qualidade do plano |
| O valor agregado da previsão (ajuste manual versus estatístico) é medido? | mostra se os ajustes por consenso ajudam |
| Qual é o prazo realista até o primeiro ciclo de S&OP em produção? | a Anaplan, por exemplo, orienta esperar valor demonstrável em 8 a 12 semanas (orientação do fornecedor) [15] |
| Custo total em 5 anos, incluindo a equipe interna | as taxas de licença costumam ser a parte menor [unverified: nenhum estudo independente de custos foi verificado] |

## Modelos: calendário S&OP, pautas, plano de famílias, registros de MPS e MRP

As tabelas abaixo podem ser copiadas para o Excel ou para uma lista do SharePoint como ponto de partida. As pautas da revisão de demanda, da revisão de suprimento e da reunião executiva estão na Seção 4.

### Modelo 1: plano da família de produtos (uma planilha por família, MTS)

| Linha | Real M-1 | M1 | M2 | M3 | M4–M6 (trimestre) | M7–M12 (semestre) | M13–M18 | Observações |
|---|---|---|---|---|---|---|---|---|
| Orçamento / plano financeiro (unidades) | | | | | | | | da área financeira |
| Previsão estatística (unidades) | | | | | | | | modelo, versão |
| Plano de demanda consensual (unidades) | | | | | | | | responsável: VP de vendas |
| Consenso do mês anterior (unidades) | | | | | | | | alteração visível |
| Plano de suprimento (unidades) | | | | | | | | responsável: VP de operações |
| Estoque final (unidades) | | | | | | | | |
| Meta de estoque (unidades ou dias de cobertura) | | | | | | | | política |
| Carga de recurso-chave (% da capacidade) | | | | | | | | ex.: soldagem |
| Receita ao preço padrão ($) | | | | | | | | financeiro |
| Custo dos produtos vendidos ao custo padrão ($) | | | | | | | | financeiro |
| Premissas e riscos | | | | | | | | link para o registro |

Para famílias sob encomenda (MTO), substitua as linhas de estoque por **backlog** e **meta de backlog (semanas)**. Backlog final = backlog inicial + novos pedidos − embarques.

### Modelo 2: registro de premissas

| ID | Família | Premissa | Responsável | Data de inclusão | Impacto se estiver errada (unidades, $) | Status / data de revisão |
|---|---|---|---|---|---|---|
| A-031 | mesas | aumento de preço do concorrente em abril se mantém | VP de vendas | 6 jan | −400 unidades/mês | revisar 3 fev |
| A-032 | mesas | subcontratado de soldagem qualificado até março | cadeia de suprimentos | 8 jan | −300 unidades em abril | em andamento |

### Modelo 3: registro de decisões

| ID | Reunião / data | Decisão | Opções consideradas | Responsável | Prazo | Efeito no plano | Status |
|---|---|---|---|---|---|---|---|
| D-014 | S&OP executivo, 15 jan | adotar plano híbrido, taxas 3.500 / 4.000 / 3.000 | nivelado, perseguição, híbrido | VP de operações | 31 jan | +2.000 unidades de alteração de taxa, $35.200 | aberto |
| D-015 | S&OP executivo, 15 jan | qualificar subcontratado de soldagem para 200–400 unidades/mês | nenhum / qualificar / terceiro turno | cadeia de suprimentos | 1 mar | redução de risco para mar–mai | aberto |

### Modelo 4: registro de MPS

| Item | Semana | 1 | 2 | 3 | … |
|---|---|---|---|---|---|
| | Previsão | | | | |
| | Pedidos de clientes | | | | |
| | Demanda projetada (regra por janela de tempo) | | | | |
| | MPS (firme / planejado) | | | | |
| | Saldo disponível projetado | | | | |
| | ATP / ATP acumulado | | | | |
| | Zona da janela de tempo | congelada | congelada | semicongelada | livre |

### Modelo 5: registro de MRP (por item)

| Item, LLC, lead time, regra de lote, estoque de segurança, estoque disponível | Semana | 1 | 2 | 3 | … |
|---|---|---|---|---|---|
| | Necessidades brutas | | | | |
| | Recebimentos programados | | | | |
| | Estoque disponível projetado | | | | |
| | Necessidades líquidas | | | | |
| | Recebimentos de ordens planejadas | | | | |
| | Liberações de ordens planejadas | | | | |

### Modelo 6: lista de verificação de prontidão do S&OP antes do primeiro ciclo

| Item | Pronto quando |
|---|---|
| Famílias de produtos definidas | 5–15 famílias por unidade de negócio, cada uma com recursos e drivers de demanda semelhantes |
| Recursos-chave definidos | 3–8 recursos que limitam a produção, com capacidade demonstrada por mês |
| Lista de recursos | horas por unidade por recurso-chave, por família |
| Fontes de dados | embarques, pedidos, estoque e produção por família disponíveis nos dias úteis 1–2 |
| Política de estoque ou backlog | meta por família aprovada pela área financeira |
| Calendário | 12 meses de datas reservadas para todas as cinco etapas |
| Direitos de decisão | limites por escrito para a revisão de suprimento, o pré-S&OP e a reunião executiva |
| Patrocinador executivo | nomeado, participa pessoalmente dos três primeiros ciclos |

## KPIs de S&OP e MRP com exemplos resolvidos

Um pacote de KPIs de S&OP eficaz é curto: cerca de dez medidas, cada uma com definição, responsável e meta. O [guia de KPIs de manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/) cobre medidas no nível da planta, como OEE e entrega no prazo; esta seção trata das medidas de planejamento.

### Acurácia da previsão, viés e MAPE: um conjunto de dados, cinco medidas

**Dados (ilustrativos).** Previsão mensal (F, feita com um mês de antecedência) e demanda real (A) da família de mesas:

| Mês | Previsão F | Real A | Erro e = F − A | Erro absoluto \|e\| | Erro percentual absoluto \|e\| / A |
|---|---|---|---|---|---|
| Jan | 3.000 | 2.850 | +150 | 150 | 5,26% |
| Fev | 3.200 | 3.350 | −150 | 150 | 4,48% |
| Mar | 4.200 | 3.900 | +300 | 300 | 7,69% |
| Abr | 4.800 | 5.100 | −300 | 300 | 5,88% |
| Mai | 4.000 | 3.700 | +300 | 300 | 8,11% |
| Jun | 2.800 | 2.650 | +150 | 150 | 5,66% |
| **Soma** | **22.000** | **21.550** | **+450** | **1.350** | **37,08%** |

| Medida | Fórmula | Cálculo | Resultado |
|---|---|---|---|
| MAPE (erro percentual absoluto médio) | média de \|e\| / A | 37,08% / 6 | **6,18%** |
| WMAPE (MAPE ponderado) | Σ\|e\| / ΣA | 1.350 / 21.550 | **6,26%** |
| Acurácia da previsão | 1 − WMAPE | 1 − 0,0626 | **93,7%** |
| Viés | Σe / ΣA | +450 / 21.550 | **+2,1% (superprevisão)** |
| MAD (desvio absoluto médio) | Σ\|e\| / n | 1.350 / 6 | **225 unidades** |
| Sinal de rastreamento | Σe / MAD | 450 / 225 | **+2,0** |

Como interpretar:

- **Acurácia e viés respondem a perguntas diferentes.** Uma acurácia de 93,7% parece boa. Mas quatro dos seis meses tiveram superprevisão, e o erro acumulado é de +450 unidades. Se o suprimento seguir a previsão, o estoque cresce cerca de 450 unidades em seis meses. O viés é a medida que mostra otimismo sistemático ou subestimação deliberada.
- **MAPE vs. WMAPE.** O MAPE dá o mesmo peso a cada mês; o WMAPE pondera pelo volume. No nível de SKU, o MAPE explode para itens pequenos: um SKU com previsão 10 e real 2 tem erro de 400%. Use WMAPE (ou MAD/média) para relatórios no nível de SKU e mantenha o MAPE para séries estáveis e de alto volume.
- **Sinal de rastreamento.** O erro acumulado dividido pelo MAD. Um valor que se afasta de zero de forma constante indica viés; uma regra prática considera o modelo funcionando corretamente enquanto o sinal de rastreamento permanecer entre −4 e +4 [36].
- **A agregação esconde erros.** Dois SKUs com previsões de 1.000 cada e reais de 1.200 e 800 resultam em erro de família igual a 0, mas em um WMAPE no nível de SKU de 400 / 2.000 = 20%. Reporte a acurácia no nível em que as decisões são tomadas: família para o S&OP, SKU e local para o MPS e a reposição.
- **O prazo importa.** Meça a previsão congelada no lead time que conta (por exemplo, a previsão feita três meses antes do mês para uma peça com lead time de três meses), e não a atualização de última hora.

### Valor agregado da previsão

O valor agregado da previsão (FVA, do inglês Forecast Value Added) compara o erro de cada etapa do processo de previsão com a etapa anterior. Se a previsão estatística tinha um WMAPE de 7,5% e a previsão de consenso, após os ajustes de vendas, tem 6,3%, o processo de consenso agregou 1,2 ponto percentual de acurácia. Se tiver 8,5%, a reunião piorou a previsão. O FVA transforma a revisão de demanda de uma disputa de opiniões em um processo mensurado.

### Conjunto de KPIs para S&OP e MRP

| KPI | Definição | Meta de exemplo (ilustrativa) | Responsável |
|---|---|---|---|
| Acurácia da previsão (1 − WMAPE), família, defasagem 1–3 | ver acima | ≥ 90% | planejador de demanda |
| Viés da previsão, família | Σ(F − A) / ΣA em 3–6 meses | dentro de ±3% | VP de vendas |
| Atingimento do plano de suprimento | produção real / produção planejada por família e mês | 95–105% | VP de operações |
| Aderência ao MPS | linhas do MPS concluídas na semana planejada / total de linhas do MPS | ≥ 95% | programador-mestre |
| Estabilidade do cronograma | alterações do MPS dentro da zona congelada por semana | tendência de queda | programador-mestre |
| Atendimento ao cliente | entrega no prazo e completa (OTIF) ou taxa de atendimento por família | por segmento | VP de vendas / cadeia de suprimentos |
| Estoque versus meta | estoque final / meta, ou dias de cobertura | 90–110% | cadeia de suprimentos |
| Acurácia dos registros de estoque | itens dentro da tolerância de contagem / itens contados | próxima de 97–99% | almoxarifado |
| Acurácia da BOM | BOMs verificadas como corretas / BOMs auditadas | próxima de 97–99% | engenharia |
| Carga de exceções do MRP | mensagens de exceção por planejador por semana | tendência de queda | gerente de materiais |
| Ordens planejadas em atraso | quantidade após cada execução do MRP | próxima de zero | gerente de materiais |
| Fechamento do registro de decisões | decisões encerradas até a data prevista / decisões previstas | ≥ 90% | responsável pelo processo de S&OP |

Alguns guias de MRP citam benchmarks "Classe A" da Oliver Wight, como 95% de acurácia de registros de estoque e 98% de acurácia de BOM [28]. Os mesmos limiares aparecem na literatura sobre programação-mestre: acurácia de registros de estoque de 95% como limiar de aceitabilidade (98% robusto) e acurácia de BOM de pelo menos 98% (99%+ bom) [37]. A lista de verificação atual da Oliver Wight não estava acessível para este guia, portanto a atribuição à Oliver Wight permanece [unverified: a lista de verificação atual não foi consultada]. Defina suas próprias metas a partir de uma linha de base medida.

### Visão financeira: o que o S&OP faz pelo capital de giro

As finanças normalmente fazem duas perguntas: quanto estoque o plano carrega e quanto isso custa? Com o plano híbrido da Seção 5, o estoque médio de fim de mês é 6.300 / 6 = 1.050 mesas. Com um custo padrão de US$ 180 por mesa (ilustrativo), isso representa US$ 189.000 imobilizados em média. O plano de nivelamento carrega 8.600 / 6 = 1.433 mesas, ou US$ 258.000. Com uma taxa de custo de manutenção de estoque de 20% ao ano (ilustrativa; use a taxa da sua empresa), a diferença de US$ 69.000 em estoque médio custa cerca de US$ 13.800 por ano. Esses números pertencem ao documento de decisão pré-S&OP, ao lado dos efeitos sobre serviço e capacidade.

## Roteiro de implementação: 12 meses até um S&OP e um MRP em funcionamento

| Fase | Meses | Atividades principais | Critérios de saída |
|---|---|---|---|
| 0. Avaliar | 0–1 | autoavaliação de maturidade (Seção 7), inventário de dados, entrevistas, comprometimento do patrocinador | patrocinador nomeado, escopo acordado, KPIs de referência medidos |
| 1. Projetar | 1–2 | famílias de produtos, recursos-chave, lista de recursos, calendário, direitos de decisão, definições de KPI, modelos | documento de projeto aprovado pelo patrocinador |
| 2. Base de dados | 1–4 (em paralelo) | acuracidade de estoque (contagem cíclica), auditoria de BOM incluindo a vigência de alterações de engenharia, revisão de lead times, regras de MPS e time fences no ERP | acuracidade de estoque e de BOM medidas e em melhora; lead times revisados para os 80% de maior valor |
| 3. Primeiros ciclos | 3–5 | executar o ciclo de cinco etapas com planilhas; três ciclos seguidos com presença da alta gestão | três ciclos concluídos no prazo, registro de decisões em uso |
| 4. Conectar ao MPS e ao MRP | 4–7 | regras de desagregação, MPS conciliado com o S&OP, RCCP nos recursos-chave, disciplina de exceções do MRP | MPS dentro da tolerância do S&OP; ordens planejadas em atraso diminuindo |
| 5. Medir e melhorar | 6–9 | acuracidade e viés da previsão, FVA, atingimento do plano; causas-raiz das falhas; regras de nervosismo | KPIs reportados mensalmente; pelo menos uma mudança de processo baseada nos resultados do FVA |
| 6. Expandir | 9–12 | integração com finanças (direção do IBP), cenários, reunião semanal de S&OE, avaliação de ferramenta caso as planilhas limitem o processo | plano em unidades e em dólares; S&OE em funcionamento; decisão sobre a ferramenta tomada com base em evidências |

**Notas práticas**

- **Comece com planilhas.** Uma ferramenta não corrige um processo que ainda não existe. A maioria das empresas só descobre o que precisa do software depois de três a seis ciclos.
- **Faça um piloto em uma unidade de negócio ou fábrica.** S&OP em cinco fábricas e vinte famílias desde o primeiro dia raramente sobrevive ao segundo mês.
- **O trabalho com dados ocorre em paralelo.** As decisões de S&OP só são tão boas quanto o MPS e o MRP que estão abaixo delas; a acuracidade de estoque e de BOM determina se a saída do MRP pode ser confiável.
- **Qualidade e controle de configuração.** Em ambientes regulados ou certificados (aeroespacial, automotivo, médico), as alterações de BOM também são uma questão do sistema de qualidade: uma alteração de engenharia precisa chegar à BOM do MRP com a data de vigência correta, ou o MRP vai comprar peças de uma revisão substituída. Envolva o líder de qualidade na auditoria de BOM; o [guia de planejamento de produção aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/) aborda o gerenciamento de configuração.
- **Gestão da mudança.** As equipes de vendas temem ser cobradas por uma previsão; as fábricas temem ser responsabilizadas por capacidade que nunca tiveram. Torne o viés visível sem culpar pessoas e reconheça as decisões tomadas cedo.
- **Treinamento.** Planejadores e programadores-mestres se beneficiam de treinamento estruturado em fundamentos de MPC; o programa CPIM da ASCM é a certificação comum nos EUA [24].

## Erros comuns

| Erro | Sintoma | Correção |
|---|---|---|
| S&OP como reunião de relatório | 40 slides, nenhuma decisão | documentos de decisão com opções; registro de decisões |
| Executivos não participam da reunião | os delegados não conseguem decidir; os problemas são empurrados para frente | presença do patrocinador como regra; pauta mais curta e focada em decisões |
| Previsão = meta de vendas | superprevisão sistemática, estoque crescente | separar meta e previsão; medir o viés |
| S&OP no nível de SKU | centenas de linhas, sem tempo para decisões | famílias para o S&OP, SKUs para o MPS |
| Finanças fora da sala | plano em unidades não bate com o orçamento | parceiro de finanças no pré-S&OP; plano em unidades e em dólares |
| MPS não reconciliado com o S&OP | o chão de fábrica segue um plano diferente | regra de desagregação e verificação de tolerância todo mês |
| MPS sobrecarregado | pedidos atrasados após cada execução do MRP | RCCP nos recursos-chave; MPS na capacidade demonstrada |
| Lead times planejados nunca revisados | liberações antecipadas ou atrasadas, WIP inflado | revisão trimestral de lead times; ver síndrome do lead time [26] |
| Dados errados de estoque e BOM | expedição urgente, faltas apesar de estoque "disponível" | contagem cíclica, auditorias de BOM, processo de mudança de engenharia |
| Reagir a cada mensagem de exceção | nervosismo, esgotamento dos planejadores | janelas de tempo (time fences), ordens planejadas firmes, limiares de amortecimento [10] |
| Comprar software primeiro | ferramenta cara, mesmas discussões | três a seis ciclos manuais antes |
| Ignorar o gargalo | plano viável em média, inviável nos meses de pico | carga do recurso-chave em toda revisão de suprimento; ver [teoria das restrições](https://www.m365.fm/en/learn/theory-of-constraints/) |

## Limites do S&OP e do MRP

**O S&OP é um processo mensal em um mundo que muda semanalmente.** Um plano aprovado no dia 15 pode estar desatualizado no dia 25. O S&OE e o S&OP orientado a eventos tratam disso, mas exigem disciplina para não replanejar tudo a cada semana.

**A agregação esconde problemas.** Um plano por família pode ser viável enquanto uma variante específica está em falta de um componente específico. Por isso o MPS e o MRP abaixo do S&OP importam, e por isso as definições de família devem agrupar itens que compartilham recursos.

**O MRP é determinístico; a realidade não é.** O MRP trata previsões, lead times e rendimentos como números fixos [8]. Estoque de segurança e lead time de segurança cobrem parte da variação, mas o MRP não representa a incerteza explicitamente. O DDMRP, modelos estocásticos e a simulação (ver [simulação de manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)) abordam o problema por ângulos diferentes.

**O MRP planeja com capacidade infinita.** O MRP e o CRP mostram sobrecargas, mas não as resolvem [8][9]. O sequenciamento finito e o APS preenchem essa lacuna no nível operacional.

**O MRP fixa lead times que na prática dependem da carga.** Os lead times planejados são entradas do MRP, mas resultados da carga de trabalho da fábrica. A síndrome do lead time mostra o que acontece quando os planejadores os tratam como alavancas [26].

**Dependência de dados.** O MRP amplifica erros de dados: uma quantidade por pai incorreta em uma BOM no nível 2 se propaga por todos os itens pais. Nenhum algoritmo compensa registros de estoque errados.

**Cultura.** A literatura acadêmica aponta barreiras organizacionais, como silos funcionais e falta de comprometimento executivo, entre as principais razões para iniciativas de S&OP estagnarem [1]. O software não elimina essas barreiras.

**Nem todo negócio precisa da pilha completa.** Uma job shop com lead times curtos e pedidos majoritariamente específicos do cliente pode precisar mais de uma boa captura de pedidos e de sequenciamento finito do que de um S&OP de 24 meses. Um distribuidor pode precisar mais de DRP do que de MRP. Adeque o método ao negócio.

## IA e planejamento digital: o que funciona hoje

Os fornecedores de software de planejamento e de ERP agora comercializam previsão de demanda com aprendizado de máquina, "demand sensing", agentes de planejamento e copilotos. Para uma fábrica, as perguntas úteis são qual decisão de planejamento melhora e como a melhoria é medida.

| Aplicação | O que faz | Onde ajuda | O que verificar |
|---|---|---|---|
| Previsão com aprendizado de máquina | usa muitos direcionadores (preço, promoções, clima, pedidos) além do histórico | muitos SKUs com direcionadores de demanda conhecidos | medir o FVA em relação a uma linha de base estatística simples; o ML frequentemente supera a linha de base em algumas famílias e não em outras |
| Demand sensing de curto prazo | ajusta a previsão de curto prazo com pedidos recentes e dados de ponto de venda | bens de consumo, distribuição | só é útil se o MPS e o S&OE puderem agir sobre mudanças semanais |
| Planejamento de cenários e recálculo rápido | recalcula os efeitos de uma decisão sobre demanda, capacidade e materiais | revisão de suprimentos, pré-S&OP | tempo de cálculo, latência dos dados, quem pode executar cenários [16] |
| Ajuste de parâmetros | sugere lead times, estoques de segurança, tamanhos de lote, fatores de buffer do DDMRP a partir de dados reais | manutenção de dados mestres do MRP | revisão do planejador antes de mudanças; trilha de auditoria |
| Triagem de exceções | ordena as mensagens de exceção do MRP pelo impacto nos pedidos de clientes | planejamento de materiais | taxa de aceitação das recomendações; tempo economizado |
| Assistentes de IA generativa | resumem pacotes de S&OP, redigem documentos de decisão, respondem "por que o plano mudou?" a partir dos dados de planejamento | preparação de reuniões | as respostas devem citar os dados usados; nenhuma mudança autônoma de plano sem aprovação |
| Gêmeo digital e simulação | testa opções de capacidade, buffer e layout antes de decidir | revisão de suprimentos para investimentos em capacidade | validação do modelo contra o desempenho real; veja o [guia de gêmeo digital](https://www.m365.fm/en/learn/digital-twin-manufacturing/) |

Quatro regras mantêm a IA útil no planejamento:

1. **Corrija o processo primeiro.** Uma previsão de IA inserida em um processo sem revisão de demanda, sem medição de viés e sem direitos de decisão produz confusão mais rápida.
2. **Meça o valor agregado.** Trate cada modelo como qualquer outra etapa de previsão e acompanhe seu FVA (Seção 16).
3. **Mantenha pessoas responsáveis pelas decisões.** As decisões de S&OP envolvem dinheiro, pessoas e clientes. As ferramentas podem preparar opções; a diretoria decide.
4. **Base de dados antes dos modelos.** A maioria dos projetos de IA para planejamento estagna na qualidade do histórico, nos dados mestres e na integração, e não nos algoritmos. Em ambientes Microsoft, as escolhas de plataforma como Fabric e Power BI são abordadas no [guia de Azure para manufatura](https://www.m365.fm/en/learn/manufacturing-it-azure/) [31][32].

### Uma configuração realista do Microsoft 365 para S&OP

| Elemento | Ferramenta | Observações |
|---|---|---|
| Calendário e reuniões | Outlook, Teams | séries recorrentes para as cinco etapas, agendadas com 12 meses de antecedência |
| Pacote de KPIs | relatório do Power BI a partir de dados do ERP e de planejamento | uma página por família; o mesmo layout todo mês |
| Planos de família e cenários | Excel (primeiros ciclos), depois uma ferramenta de planejamento | controle de versões: um arquivo por ciclo, somente leitura após aprovação |
| Premissas e registros de decisão | Microsoft Lists ou uma lista do SharePoint | responsável, prazo, status; vinculados à pauta executiva |
| Documentos de decisão | Word ou páginas do Loop, uma página por decisão | opções, impacto, recomendação |
| Apoio à preparação | resumos do Copilot do pacote de KPIs e dos registros | revisados pelo responsável do processo antes da distribuição |

## Glossário

| Termo | Definição |
|---|---|
| Planejamento agregado | planejamento das taxas de produção, da mão de obra e dos estoques para famílias de produtos no médio prazo; a origem do S&OP [1] |
| Disponível para promessa (ATP) | a parcela não comprometida do suprimento planejado que pode ser prometida a novos pedidos de clientes (Seção 8) |
| Lista de materiais (BOM) | lista de componentes, quantidades e estrutura necessários para fabricar um item pai |
| Lista de recursos | horas por unidade de um produto ou família em cada recurso-chave; usada no planejamento de recursos do S&OP e no RCCP |
| Planejamento de necessidades de capacidade (CRP) | cálculo detalhado da carga por centro de trabalho a partir das ordens do MRP e dos roteiros, com capacidade infinita [8] |
| Lead time cumulativo | o caminho mais longo de lead times através da BOM, desde a compra do primeiro material até a conclusão do item final |
| Ponto de desacoplamento | posição na BOM ou na cadeia de suprimentos onde um buffer do DDMRP separa a variabilidade do suprimento da variabilidade da demanda [11] |
| Barreira de tempo de demanda | limite do MPS dentro do qual apenas os pedidos de clientes, e não a previsão, contam como demanda |
| Demanda dependente | demanda calculada a partir da demanda de um item pai, em oposição à demanda independente (previsão) [13] |
| DDMRP | planejamento de necessidades de materiais orientado à demanda: buffers nos pontos de desacoplamento, dimensionados por zonas e reabastecidos pela equação de fluxo líquido [11][12] |
| Mensagem de exceção | recomendação do MRP para liberar, reprogramar ou cancelar uma ordem |
| Ordem planejada firme | ordem planejada fixada pelo planejador para que o MRP não a altere automaticamente |
| Viés da previsão | superprevisão ou subprevisão sistemática; Σ(F − A) / ΣA |
| Valor agregado da previsão (FVA) | variação do erro de previsão causada por uma etapa do processo de previsão |
| Necessidades brutas | demanda total de um item em um período, antes da compensação |
| Planejamento integrado de negócios (IBP) | termo da Oliver Wight para uma extensão do S&OP em toda a empresa, incluindo portfólio e financeiro, com horizonte de pelo menos 24 meses [2] |
| Código de nível baixo | o nível mais baixo da BOM em que um item aparece; determina a sequência de processamento do MRP [8] |
| Lote a lote | regra de dimensionamento de lotes que pede exatamente a necessidade líquida de cada período [8] |
| MAPE / WMAPE | erro percentual absoluto médio / MAPE ponderado (Seção 16) |
| Programa mestre de produção (MPS) | declaração do que a empresa espera produzir por item final e período, com base no plano tático [7] |
| MRP | planejamento de necessidades de materiais: cálculo com dimensionamento no tempo das necessidades líquidas de todos os componentes a partir do MPS, da BOM e dos estoques [7] |
| MRP II | planejamento de recursos de manufatura: MRP mais S&OP, MPS, RCCP, CRP, controle de chão de fábrica e integração financeira [3] |
| Posição de fluxo líquido | DDMRP: estoque disponível + em pedido − demanda qualificada [14] |
| Nervosismo | mudanças frequentes ou grandes nas ordens planejadas causadas por pequenas alterações nos dados de entrada [8][10] |
| Necessidades líquidas | necessidades brutas menos estoque disponível e recebimentos programados, mais estoque de segurança quando aplicável |
| Rastreamento de necessidade (pegging) | vínculo entre uma necessidade e sua demanda de origem |
| Liberação de ordem planejada | data e quantidade em que uma ordem planejada deve ser liberada, deslocada pelo lead time a partir da data de recebimento |
| Barreira de tempo de planejamento | limite além do qual o sistema de planejamento pode criar ou alterar ordens automaticamente |
| Saldo disponível projetado (PAB) | estoque esperado ao final de um período no MPS |
| Planejamento aproximado de capacidade (RCCP) | verificação do MPS contra os recursos-chave usando as listas de recursos |
| S&OE | execução de vendas e operações: processo semanal para executar o plano de S&OP no curto prazo |
| Planejamento de vendas e operações (S&OP) | processo mensal multifuncional para integrar os planos de demanda e suprimento por família, em unidades e em dólares [1] |
| Recebimento programado | ordem de produção ou de compra em aberto com data de entrega |
| Sinal de rastreamento | erro de previsão acumulado dividido pelo MAD; indica viés |

## FAQ: planejamento de vendas e operações e MRP

### O que é planejamento de vendas e operações em termos simples?

S&OP é um ciclo mensal de reuniões em que vendas, operações, cadeia de suprimentos e finanças acordam um único plano para o que a empresa vai vender, produzir e estocar nos próximos 18 a 36 meses, por família de produtos [1][5]. A equipe executiva o usa para fazer trade-offs, como acrescentar um turno ou formar estoque antes de uma parada.

### Quais são as etapas do processo de S&OP?

As cinco etapas comuns são coleta de dados, revisão da demanda, revisão da oferta, pré-S&OP (reconciliação) e reunião executiva de S&OP [1][20]. Algumas empresas acrescentam no início uma revisão de produtos ou de portfólio; a Anaplan, por exemplo, lista revisões de produto, demanda, oferta, finanças, pré-S&OP e executiva [15].

### Com que frequência o S&OP deve ser feito?

Mensalmente, em um calendário fixo [1][5]; a Anaplan, por exemplo, descreve ciclos mensais com contatos semanais para os principais participantes [15]. Uma reunião semanal de S&OE trata de mudanças de curto prazo entre os ciclos, e eventos importantes (um grande pedido, uma parada de fábrica) podem disparar uma revisão extra.

### Quem deve participar da reunião executiva de S&OP?

O gerente geral ou o presidente da unidade de negócios como coordenador, além dos responsáveis por vendas, marketing, operações, cadeia de suprimentos e finanças, e gestão de produtos ou engenharia quando decisões de portfólio estiverem na pauta. O responsável pelo processo de S&OP prepara e documenta a reunião.

### Qual é a diferença entre S&OP e IBP?

O IBP amplia o S&OP do balanceamento entre demanda e oferta para o plano de negócios como um todo, incluindo portfólio, estratégia e finanças, com horizonte de pelo menos 24 meses [2]. A Oliver Wight desenvolveu o S&OP na década de 1980 e cunhou o termo IBP no início dos anos 2000 [2].

### Qual é a diferença entre S&OP e MRP?

O S&OP decide os volumes por família de produtos e por mês, em nível transversal entre as funções. O MRP calcula, para cada componente, quantos comprar ou produzir e quando, a partir do plano-mestre de produção, das listas de materiais (BOMs) e do estoque [7]. O S&OP define a moldura; o MRP executa no nível de item.

### Qual é a diferença entre MPS e MRP?

O MPS planeja os itens finais (ou itens de planejamento) por semana; o MRP desdobra o MPS pelas BOMs para planejar componentes e materiais [7]. Ambos usam a mesma lógica de compensação (netting), mas o MPS é definido por um programador-mestre e o MRP é calculado pelo sistema.

### Como funciona o MRP?

Para cada item, nível a nível: obter as necessidades brutas, subtrair o estoque disponível e as recepções programadas, aplicar o estoque de segurança para obter as necessidades líquidas, dimensionar os lotes, deslocar pelo lead time para obter as liberações de ordens planejadas e transmiti-las aos componentes como necessidades brutas [8]. A Seção 10 apresenta um exemplo completo resolvido.

### Quais são as entradas do MRP?

O plano-mestre de produção, as listas de materiais (BOMs), os registros de estoque (disponível e estoque de segurança), as ordens abertas (recepções programadas) e os dados de planejamento de itens (lead times, regras de dimensionamento de lotes) [7][8].

### Qual é a diferença entre MRP e MRP II?

O MRP calcula as necessidades de materiais. O MRP II, definido pela Oliver Wight em 1983, acrescenta o S&OP, a programação-mestre, o planejamento de capacidade grosseiro e detalhado, o controle de chão de fábrica e a ligação com o planejamento financeiro [3].

### Qual é a diferença entre MRP e ERP?

O MRP é um método de planejamento e um módulo do ERP. O ERP é um sistema integrado de finanças, vendas, compras, RH e manufatura, tendo o MRP como núcleo de planejamento de materiais. O Gartner cunhou o termo ERP em 1990 [4].

### O que é DDMRP?

O MRP orientado pela demanda (DDMRP) posiciona buffers de estoque em pontos de desacoplamento selecionados, dimensiona-os em zonas vermelha, amarela e verde a partir do consumo médio diário e do lead time, e os reabastece pela equação de fluxo líquido (estoque disponível + em pedido − demanda qualificada) [11][12][14]. Ele foi concebido para reduzir a dependência de previsões e a nervosidade do MRP clássico; evidências independentes sobre os resultados ainda são limitadas.

### O que é available to promise?

O ATP é a parte da oferta planejada que ainda não está comprometida com pedidos de clientes e pode ser prometida a novos pedidos. No exemplo da Seção 8, um cliente que pede 100 unidades na semana 2 pode receber 60 de imediato e o restante a partir da semana 4.

### Quais KPIs medem o sucesso do S&OP?

Acurácia da previsão (1 − WMAPE) e viés no nível de família, atingimento do plano de oferta, aderência ao MPS, nível de serviço ao cliente (OTIF ou fill rate), estoque ou backlog em relação à meta e taxa de fechamento das decisões. A Seção 16 apresenta as fórmulas e um exemplo resolvido.

### Como você calcula a acurácia da previsão?

Uma fórmula comum é 1 − WMAPE, em que WMAPE = Σ|previsto − real| / Σ real. Com erros absolutos de 1.350 unidades sobre uma demanda real de 21.550, o WMAPE é 6,26% e a acurácia da previsão é 93,7%. Informe sempre o viés junto com ele.

### Por que os processos de S&OP falham?

Os motivos mais comuns são a falta de participação da alta direção, uma previsão que é na verdade uma meta de vendas, a ausência do financeiro, detalhe excessivo (SKUs em vez de famílias), nenhuma ligação com o MPS e a compra de software antes de o processo funcionar. A Seção 18 lista as correções.

### Um fabricante pequeno pode fazer S&OP sem software especial?

Sim. Uma empresa com poucas famílias de produtos pode executar o S&OP com extratos do ERP, Excel e um registro compartilhado de decisões. O software passa a compensar quando a reconciliação entre famílias e SKUs, os cenários ou a preparação dos dados consomem mais tempo do que as decisões.

### O que é nervosismo do MRP?

Nervosismo é a tendência de os planos do MRP mudarem com frequência quando as entradas sofrem pequenas alterações. No exemplo da Seção 12, 30 mesas extras alteraram as ordens em dois níveis inferiores da lista de materiais. Janelas de tempo, ordens planejadas firmes e regras de custo de mudança reduzem esse efeito [10].

### Quais são os benefícios do S&OP?

O S&OP substitui os números separados de vendas, produção e finanças por um único plano acordado para cada família de produtos. Decisões que transferem custo de uma função para outra, como um segundo turno, uma pré-produção ou a eliminação de uma variante, são tomadas por quem é responsável pelo custo e pelo benefício (Seção 1). O MPS e o MRP recebem um plano já verificado quanto à capacidade, de modo que menos ordens precisam ser aceleradas depois. As finanças enxergam o efeito no capital de giro antes que ele aconteça: no exemplo ilustrativo da Seção 16, o plano híbrido carrega em média cerca de 380 mesas a menos do que o plano de nível constante, o que equivale a cerca de US$ 13.800 por ano em custo de manutenção de estoque. Os percentuais de benefício publicados por fornecedores e pesquisas variam muito, por isso meça sua própria linha de base antes do primeiro ciclo.

### Quais são as saídas do MRP?

Para cada item fabricado e comprado, o MRP produz recebimentos de ordens planejadas e liberações de ordens planejadas distribuídos no tempo, deslocados pelo lead time [8]. Ele também produz mensagens de exceção para ordens em aberto (liberar, reprogramar para antecipar, reprogramar para postergar, cancelar, atrasada, abaixo do estoque de segurança) e o pegging, que vincula cada necessidade ao seu item pai e ao pedido do cliente. A Seção 10 mostra as três com um exemplo detalhado.

### Qual é a diferença entre MRP e JIT?

O MRP é um cálculo de planejamento: ele explode o plano-mestre de produção pelas listas de materiais e cria ordens datadas antes que a necessidade surja. Just-in-time (JIT) é uma abordagem de produção enxuta que repõe de acordo com o consumo real, normalmente com sinais kanban, e busca lotes pequenos e baixo estoque. As duas não são mutuamente exclusivas. Muitas fábricas usam o MRP para itens de longo lead time, caros e de demanda irregular, e kanban para itens de giro rápido na linha (Seção 10). O [guia sobre kanban e sistema puxado](https://www.m365.fm/en/learn/kanban-pull-system/) trata do lado puxado.

## Conclusão e primeiros passos

O planejamento de vendas e operações (S&OP) e o MRP resolvem o mesmo problema em dois níveis. O S&OP permite que a equipe de liderança decida, uma vez por mês, quanto vender, produzir e estocar por família, e quanto isso custa. O plano mestre de produção (MPS) transforma essa decisão em itens finais por semana, o planejamento de capacidade grossa (RCCP) verifica o plano contra o gargalo, e o MRP calcula do que cada componente precisa e quando. Cada nível precisa que o nível acima seja realista e que o nível abaixo seja executado. O sequenciamento detalhado e o chão de fábrica completam a cadeia.

Os métodos são antigos (Orlicky formalizou o MRP em 1964, Oliver Wight moldou o S&OP na década de 1980) e continuam sendo a base do planejamento em ERP [2][3][4]. Suas fragilidades são conhecidas: capacidade infinita, lead times fixos, nervosismo e dependência de dados. Janelas de tempo (time fences), RCCP, buffers do DDMRP e sequenciamento finito atacam esses pontos. Ferramentas de IA podem acelerar a previsão e a análise de cenários, mas somente onde o processo, os dados e os direitos de decisão já estão estabelecidos.

**Seus primeiros passos nos próximos 30 dias**

- [ ] Definir de 5 a 15 famílias de produtos e de 3 a 8 recursos-chave com sua capacidade mensal comprovada
- [ ] Extrair 24 meses de embarques e pedidos por família e medir a acurácia da previsão (1 − WMAPE) e o viés dos últimos 6 meses
- [ ] Verificar se a soma do seu MPS por família corresponde ao seu plano atual de vendas e produção
- [ ] Executar o seu MRP e contar as ordens planejadas em atraso e as mensagens de exceção por planejador; essa é a sua linha de base de nervosismo
- [ ] Auditar a acurácia de estoque dos 50 itens principais por valor e a acurácia das listas de materiais (BOM) dos 10 itens finais principais
- [ ] Reservar o calendário de S&OP de cinco etapas para os próximos 12 meses e nomear um patrocinador executivo e um dono do processo
- [ ] Executar o primeiro ciclo em planilhas com os modelos da Seção 15 e iniciar o registro de decisões na primeira reunião executiva

---

## Leitura complementar no m365.fm

**Guias desta trilha de aprendizado**
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/): sequenciamento detalhado, fragilidades do MRP, síndrome do lead time, capacidade finita
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/): puxar (pull), heijunka, kanban como alternativa ao planejamento empurrado (push)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/): OEE, entrega no prazo, medidas de estoque
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/): teste de cenários para decisões de capacidade
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/): integração de ERP, MES e plataforma de dados
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/): planejamento em ambientes engineer-to-order e de longo lead time
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/): gargalos e drum-buffer-rope
- [Kanban and Pull Systems](https://www.m365.fm/en/learn/kanban-pull-system/)
- [MES and ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)

**Aprofundamentos**
- [Lot Sizing: EOQ, EPQ and MRP Lot-Sizing Rules](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Manufacturing Inventory Management and Safety Stock](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)
- [Intralogistics and In-Plant Material Flow](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Supply Chain Resilience](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/)
- [Manufacturing Simulation](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** é o apresentador do m365.fm e trabalha na iFAKT GmbH. No m365.fm, ele escreve sobre manufatura enxuta, planejamento da produção e a transformação digital da manufatura, com foco em como processos de planejamento, modelos de fluxo de valor, simulação e análise de KPIs funcionam em conjunto na prática.

**Nota: O autor trabalha na iFAKT GmbH.**

# Sources

All online sources accessed November 20, 2026. Sources marked "via sibling pillar" were opened and verified on the same date for the m365.fm guide on production scheduling and APS or the Azure for manufacturing guide and are reused with their verified bibliographic data.

1. Sales and operations planning (history incl. aggregate production planning and Richard "Dick" Ling; definitions; five process steps after Wagner et al. 2014; tactical horizon up to 18 months; maturity models after Grimson and Pyke 2007 and Wagner et al. 2014; enablers and barriers). Wikipedia. https://en.wikipedia.org/wiki/Sales_and_operations_planning
2. What Is the Difference Between S&OP and IBP? Oliver Wight Americas (blog). https://www.oliverwight-americas.com/blog/difference-between-sop-and-ibp/
3. Material requirements planning (Rolls-Royce and GE in the early 1950s; Orlicky 1964; Black & Decker 1964 with Dick Alban; about 700 users by 1975 and about 8,000 by 1981; Oliver Wight's MRP II 1983). Wikipedia. https://en.wikipedia.org/wiki/Material_requirements_planning
4. Material requirements planning (MRP), definition and history (Harris 1913; Orlicky at IBM 1964; Plossl and Wight 1967; Orlicky's book 1975; Wight's MRP II 1983; Gartner coins ERP 1990; third edition by Ptak and Smith 2011 with DDMRP; re-checked in review round 3). TechTarget. https://www.techtarget.com/searcherp/definition/material-requirements-planning-MRP
5. What is sales and operations planning (S&OP)? (monthly cadence, rolling 18–36 month horizon; page within SAP's Integrated Business Planning section). SAP. https://www.sap.com/resources/sop-sales-and-operations-planning and https://www.sap.com/products/scm/integrated-business-planning/what-is-supply-chain-planning/sop-sales-operations.html
6. Sales and Operations Planning (S&OP): Process, Challenges, and Expert Tips (18–36 month horizon; level, chase and mixed strategies). Smartsheet. https://www.smartsheet.com/sales-operations-planning-101
7. Master Production Scheduling and Material Requirements Planning (definitions of MPS and MRP; ATP and cumulative ATP as outputs). Oracle JD Edwards EnterpriseOne Applications Requirements Planning Implementation Guide, release 9.2. https://docs.oracle.com/en/applications/jd-edwards/supply-chain-manufacturing/9.2/eoarp/master-production-scheduling-and-material-requirements-planning.html
8. Gershwin, Stanley B.: Material Requirements Planning (MRP) and MRP II, lecture slides, MIT 2.854 Introduction to Manufacturing Systems, Fall 2016 (based on Hopp and Spearman, Factory Physics). MIT OpenCourseWare. https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/4eec617bb52d64f4ea1bed6d9905bc00_MIT2_854F16_MatrialRequire.pdf
9. Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337 (via sibling pillar)
10. Blackburn, Joseph D.; Kropp, Dean H.; Millen, Robert A.: A Comparison of Strategies to Dampen Nervousness in MRP Systems. Management Science 32 (1986) 4, pp. 413–429. DOI: 10.1287/mnsc.32.4.413. Record: https://ideas.repec.org/a/inm/ormnsc/v32y1986i4p413-429.html
11. Demand Driven Material Requirements Planning (DDMRP) overview. Dynamics 365 Supply Chain Management, Microsoft Learn. https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/ddmrp-overview
12. Buffer profile and levels (DDMRP zone formulas, lead time and variability factor ranges, worked example). Dynamics 365 Supply Chain Management, Microsoft Learn. https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/ddmrp-buffer-profile-and-levels
13. Orlicky, Joseph: Material Requirements Planning. The New Way of Life in Production and Inventory Management. McGraw-Hill, New York 1975. (via sibling pillar; original not consulted)
14. The five steps of DDMRP (net flow equation, buffer zones). IFS blog. https://blog.ifs.com/the-five-steps-of-ddmrp/ ; DDMRP in IFS Cloud documentation: https://docs.ifs.com/ifsclouddocs/24r2/Planning/AboutDDMRP.htm
15. The ultimate guide to the sales and operations planning (S&OP) process (six reviews; deployment guidance of 8–12 weeks). Anaplan (vendor), July 24, 2023. https://anaplan.com/blog/the-myths-of-sop
16. What is sales and operations planning (S&OP)? (traditional monthly cycle with five stages; concurrent planning, vendor claim). Kinaxis (vendor), published January 6, 2023, modified December 3, 2025. https://www.kinaxis.com/en/sop
17. Supply Chain S&OP: Process Improvement (five levels of S&OP maturity). Gartner. https://www.gartner.com/en/supply-chain/trends/supply-chain-sop
18. The 5 S&OP maturity levels (secondary description of the Gartner S&OP maturity model). Jedox (planning software vendor). https://jedox.com/en/blog/5-sop-maturity-levels
19. Grimson, J. Andrew; Pyke, David F.: Sales and operations planning: an exploratory study and framework. The International Journal of Logistics Management 18 (2007) 3, pp. 322–346. DOI: 10.1108/09574090710835093 (bibliographic data confirmed via Crossref, November 20, 2026; full text not consulted)
20. Wagner, Stephan M.; Ullrich, Kristoph K. R.; Transchel, Sandra: The game plan for aligning the organization. Business Horizons 57 (2014) 2, pp. 189–201. DOI: 10.1016/j.bushor.2013.11.002 (bibliographic data confirmed via Crossref, November 20, 2026; full text not consulted)
21. Oliva, Rogelio; Watson, Noel: Cross-functional alignment in supply chain planning: A case study of sales and operations planning. Journal of Operations Management 29 (2011) 5, pp. 434–448. DOI: 10.1016/j.jom.2010.11.012 (bibliographic data confirmed via Crossref, November 20, 2026; key finding via Wikipedia [1]; full text not consulted)
22. Tavares Thomé, António Márcio; Scavarda, Luiz Felipe; Fernandez, Nicole Suclla; Scavarda, Annibal José: Sales and operations planning: A research synthesis. International Journal of Production Economics 138 (2012) 1, pp. 1–13. DOI: 10.1016/j.ijpe.2011.11.027 (DOI resolution to Elsevier record S0925527311004907 confirmed; bibliographic data and author list confirmed via Crossref, November 20, 2026; full text not consulted)
23. Tavares Thomé, António Márcio; Scavarda, Luiz Felipe; Fernandez, Nicole Suclla; Scavarda, Annibal José: Sales and operations planning and the firm performance. International Journal of Productivity and Performance Management 61 (2012) 4, pp. 359–381. DOI: 10.1108/17410401211212643 (bibliographic data and author list confirmed via Crossref, November 20, 2026; full text not consulted)
24. ASCM (Association for Supply Chain Management): APICS Certified in Planning and Inventory Management (CPIM), 2026 certification brochure. https://www.ascm.org/globalassets/ascm_website_assets/docs/credentials/2026-certification_brochures_cpim.pdf (via sibling pillar)
25. ANSI/ISA-95.00.03-2013: Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management. International Society of Automation, preview. https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf (via sibling pillar)
26. Thürer, Matthias; Fernandes, Nuno O.; Haeussler, Stefan; Stevenson, Mark: Dynamic planned lead times in production planning and control systems: does the lead time syndrome matter? International Journal of Production Research 61 (2023) 4, pp. 1268–1282. DOI: 10.1080/00207543.2022.2034193 (via sibling pillar)
27. What is material requirements planning (MRP)? (MRP vs. ERP; FAQ topics incl. MRP II, MPS, DDMRP, predictive MRP, APS). SAP. https://www.sap.com/products/erp/what-is-mrp.html
28. Material requirements planning (MRP) in manufacturing: A complete guide (cites Oliver Wight/APICS Class A benchmarks without link). Zoho Inventory Academy. https://www.zoho.com/inventory/academy/inventory-management/what-is-materials-requirement-planning-mrp-in-manufacturing.html
29. Best S&OP Software in 2026: Sales & Operations Planning Buyer's Guide (vendor list; written by Board, one of the listed vendors). Board International. https://www.board.com/guide/best-sop-software
30. Kinaxis Inc.: New Research Finds 83% of Supply Chains Can't Respond to Disruptions in 24 Hours (IDC research commissioned by Kinaxis), press release, April 16, 2024. https://investors.kinaxis.com/news-releases/news-release-details/2024/New-Research-Finds-83-of-Supply-Chains-Cant-Respond-to-Disruptions-in-24-Hours (via sibling pillar)
31. What is Microsoft for Manufacturing? Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/overview (via sibling pillar)
32. Link your Dataverse environment to Microsoft Fabric. Power Apps, Microsoft Learn. https://learn.microsoft.com/en-us/power-apps/maker/data-platform/azure-synapse-link-view-in-fabric (via sibling pillar)
33. Overview of Sales and Operations Planning. Oracle Fusion Cloud SCM documentation. https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/23d/fasop/overview-of-sales-and-operations-planning.html (existence of the product confirmed from the documentation title in search results; page content not fetched)
34. Kristensen, Jesper; Jonsson, Patrik: Context-based sales and operations planning (S&OP) research: A literature review and future agenda. International Journal of Physical Distribution & Logistics Management 48 (2018) 1, pp. 19–46. DOI: 10.1108/IJPDLM-11-2017-0352. https://www.emerald.com/insight/content/doi/10.1108/IJPDLM-11-2017-0352/full/html
35. About the Demand Driven Institute (founded in 2011 by Carol Ptak and Chad Smith; software compliance certification free of charge to vendors; professional endorsement certificates). Demand Driven Institute. https://demanddriveninstitute.com/about-us (accessed November 20, 2026)
36. Measuring Forecast Accuracy: Approaches to Forecasting: A Tutorial (tracking signal rule of thumb: between −4 and 4). Supply Chain Resource Cooperative, NC State University, January 25, 2011. https://scm.ncsu.edu/scm-articles/article/measuring-forecast-accuracy-approaches-to-forecasting-a-tutorial (accessed November 20, 2026)
37. World Class Master Scheduling: Best Practices and Lean Six Sigma Continuous Improvement, section "Data accuracy" (inventory record accuracy 95% acceptable, 98% robust; BOM accuracy 98% minimum, 99+% good). Excerpt on GlobalSpec Engineering360. https://www.globalspec.com/reference/47612/203279/data-accuracy (accessed November 20, 2026; author and publisher not shown on the excerpt page)
