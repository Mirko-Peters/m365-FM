# SEO metadata

| Field | Value |
|---|---|
| Meta title | Software de Mapeamento de Fluxo de Valor: Guia + iFAKT Polaris |
| Meta description | Como escolher software de mapeamento de fluxo de valor: 5 categorias de ferramentas, critérios de seleção, checklist e uma análise do iFAKT Polaris e seus limites. |
| Slug | `ifakt-polaris` |

# Software de Mapeamento de Fluxo de Valor para Manufatura: Um Guia de Compra e uma Análise Baseada em Evidências do iFAKT Polaris

> **Nota: O autor trabalha na iFAKT GmbH.**

*Em 20 de novembro de 2026 · Toda afirmação sobre produto tem uma fonte; alegações dos fornecedores são identificadas como tal.*

> **Resposta curta:** Software de mapeamento de fluxo de valor vai desde ferramentas de desenho com símbolos lean, passando por ferramentas dedicadas de VSM que calculam métricas, até sistemas de simulação e planejamento. Qual categoria você precisa depende de querer documentar fluxos de valor, avaliá-los regularmente com dados, simulá-los ao longo do tempo ou transformá-los em cronogramas para o chão de fábrica. Ferramentas gratuitas de desenho, como Lucidchart e Miro, e o modelo do Visio bastam para oficinas; ferramentas dedicadas de VSM compensam quando você mapeia com regularidade; simulação e APS são categorias separadas. **iFAKT Polaris** é uma plataforma modular da iFAKT GmbH (Stuttgart, Alemanha) com sete módulos: VSM (fluxos de valor), BSM (raias de processo), Designer (modelo produto-processo-recurso), Simulator, Optimizer (programação com restrições), Operator (tarefas no chão de fábrica) e Analyzer (painéis de KPIs). Segundo o fornecedor, os módulos compartilham um único modelo de dados [3]. O autor não conhece testes comparativos independentes do Polaris. O que pode ser verificado inclui duas listagens na Microsoft AppSource [15][16], o segundo lugar na categoria Produção do Best of Technology Award 2025 do semanário de negócios alemão WirtschaftsWoche para o Polaris IMS [18] e uma série de artigos técnicos na revista de engenharia alemã ZWF [21][22][23][24].

Quem procura software de mapeamento de fluxo de valor esbarra primeiro em um problema de vocabulário. Sob os termos "value stream mapping software" ou "value stream management software", os fornecedores vendem coisas muito diferentes: programas de diagramação com biblioteca de símbolos, ferramentas lean com fórmulas, sistemas de simulação, plataformas para equipes de entrega de software e sistemas de planejamento com um gêmeo digital. Comparações que misturam essas categorias levam a compras ruins. Uma fábrica que mapeia seu fluxo de valor uma vez por ano em um evento kaizen precisa de algo diferente de um fabricante de alto mix que programa contra capacidade restrita toda semana.

Este guia tem, portanto, duas partes. **Parte A** mapeia o mercado de forma neutra: o que o software de mapeamento de fluxo de valor precisa fazer, quais categorias existem, como compará-las e quais erros são típicos na seleção e na implantação. **Parte B** descreve o iFAKT Polaris em detalhe, módulo por módulo, com as evidências de páginas do fornecedor, do Microsoft marketplace, da literatura técnica e de um júri de premiação, e com uma declaração clara do que não está documentado e de para quem o produto não se adequa.

Como o autor trabalha na iFAKT GmbH, uma regra simples vale para este texto: toda afirmação sobre o produto tem uma fonte, as alegações de benefício dos fornecedores são identificadas como tal e não tratadas como fato, e a Parte A foi escrita para funcionar como apoio à decisão mesmo que você nunca leia a Parte B.

### Principais conclusões

- **Categoria antes do produto:** Ferramentas de desenho, ferramentas dedicadas de VSM, software de simulação, sistemas APS e MES/BI resolvem problemas diferentes. Comece pela pergunta que o software precisa responder.
- **O desenho raramente é o gargalo.** O que importa é a conectividade de dados, a lógica de cálculo, os cenários, a capacidade de modelar variabilidade e mix de produtos, e se a análise se transforma em ações e cronogramas.
- **O mapeamento estático de fluxo de valor trabalha com médias.** Variabilidade, mix de produtos e recursos compartilhados exigem simulação; prazos sob restrições exigem algoritmos de programação.
- **Existem opções gratuitas** na categoria de desenho (Lucidchart, Miro, Creately e outras) e, para dois módulos, no iFAKT Polaris [3]. Verifique limites de usuários, exportação e propriedade dos dados.
- **O iFAKT Polaris** cobre, segundo o fornecedor, a cadeia que vai do mapeamento de fluxo de valor à simulação e programação, passando por tarefas no chão de fábrica e relatórios [3]. As páginas dos módulos listam funções, mas não apresentam cifras de benefício com metodologia divulgada.
- **Documentados** estão a certificação ISO 9001 desde outubro de 2014 [4], uma certificação ISO/IEC 27001 pela TÜV SÜD mencionada no site [1][3], a hospedagem de VSM e BSM no Microsoft Azure West Europe (região localizada nos Países Baixos) segundo as páginas dos módulos [6][7][43], duas listagens na AppSource [15][16] e o prêmio da WirtschaftsWoche [18].
- **Não documentados** nas páginas revisadas: uma função de simulação dentro do módulo VSM, integração nativa com Microsoft Teams ou Power BI, uma região de hospedagem nos EUA, um relatório SOC 2 e preços públicos.

## Índice

**Parte A: O que o software de mapeamento do fluxo de valor precisa fazer**

1. [Termos: mapeamento do fluxo de valor, desenho do estado futuro, gestão do fluxo de valor](#1-termos-mapeamento-do-fluxo-de-valor-desenho-do-estado-futuro-gestão-do-fluxo-de-valor)
2. [Por que papel e Excel chegam ao limite](#2-por-que-papel-e-excel-atingem-seus-limites)
3. [As cinco categorias de software de mapeamento do fluxo de valor](#3-as-cinco-categorias-de-software-de-mapeamento-do-fluxo-de-valor)
4. [Tabela comparativa das categorias](#4-tabela-comparativa-por-categoria)
5. [Como escolher software de mapeamento do fluxo de valor: critérios em detalhe](#5-como-escolher-software-de-mapeamento-de-fluxo-de-valor-critérios-em-detalhe)
6. [Checklist de seleção](#6-lista-de-verificação-para-seleção)
7. [Implantação em seis etapas](#7-implantação-em-seis-etapas)
8. [Erros comuns na seleção e na implantação](#8-erros-comuns-na-seleção-e-na-implantação)
9. [Um caso de negócio sem números inventados](#9-um-caso-de-negócio-sem-números-inventados)

**Parte B: iFAKT Polaris em detalhe**

10. [Contexto e método: dos indicadores aos dados de eventos](#10-contexto-e-método)
11. [Princípio da plataforma: um modelo de dados, sete módulos](#11-princípio-da-plataforma-um-modelo-de-dados-sete-módulos)
12. [Os módulos um a um](#12-os-módulos-um-a-um)
13. [Polaris IMS e o Best of Technology Award 2025](#13-polaris-ims-e-o-best-of-technology-award-2025)
14. [Setores segundo a empresa](#14-setores-segundo-a-empresa)
15. [Polaris no ecossistema Microsoft](#15-o-polaris-no-ecossistema-microsoft)
16. [Segurança, hospedagem e certificações](#16-segurança-hospedagem-e-certificações)
17. [O que o fornecedor promete e como testar](#17-o-que-o-fornecedor-promete-e-como-testar)
18. [Para quem o Polaris serve e para quem não serve](#18-para-quem-o-polaris-é-adequado-e-para-quem-não-é)
19. [FAQ](#19-perguntas-frequentes)
20. [Conclusão](#20-conclusão)

# Parte A: O que o software de mapeamento do fluxo de valor precisa fazer

## 1. Termos: mapeamento do fluxo de valor, desenho do estado futuro, gestão do fluxo de valor

**Mapeamento do fluxo de valor** (VSM, *value stream mapping*) mostra o fluxo de material e de informação de uma família de produtos, do fornecedor até o cliente, com símbolos padronizados. Sob cada caixa de processo ficam dados como tempo de ciclo, tempo de troca, disponibilidade e padrão de turnos; entre as caixas de processo ficam os estoques, convertidos em dias de cobertura. A linha do tempo na parte inferior mostra quanto do lead time total agrega valor. Nos EUA, o método está intimamente ligado a *Learning to See*, de Mike Rother e John Shook, publicado pelo Lean Enterprise Institute, que percorre o mapeamento do estado atual, o desenho do estado futuro e um plano de implementação para uma fábrica fictícia, a Acme Stamping; a obra recebeu o Shingo Research Prize em 1999 [41]. O método completo, com símbolos, fórmulas e um exemplo trabalhado, está no compêndio do m365.fm [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

**Desenho do estado futuro** usa o mapa do estado atual para projetar um alvo: fluxo contínuo onde for possível; puxada por supermercados onde o fluxo não for possível; um processo marcapasso que define o ritmo; produção nivelada. Somente o estado futuro e um plano de implementação transformam a análise em melhoria. Profissionais alemães costumam usar o termo *Wertstromdesign* para essa etapa, em referência ao livro-texto padrão de Klaus Erlach, do Fraunhofer IPA [40].

**Gestão do fluxo de valor** na manufatura significa administrar o negócio ao longo dos fluxos de valor de forma contínua: um gestor responsável pelo fluxo de valor mantém o estado atual e o futuro atualizados, acompanha indicadores e ações, e repete a análise quando o mix de produtos ou a demanda mudam. Desde 2020 existe uma norma internacional para isso, a ISO 22468:2020 "Value stream management (VSM)" [39]. Uma introdução curta está no post [What is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/).

**Uma distinção importante:** no desenvolvimento de software, "value stream management" nomeia uma categoria de produto própria. Essas plataformas medem o fluxo de itens de trabalho pelo pipeline de entrega de software, do ticket até a implantação. Se você pesquisa por "value stream management software" e quer dizer uma fábrica, observe com atenção: nos resultados de busca dos EUA, várias listas mesclam ferramentas de DevOps, como LinearB, Copado ou Plutora, com ferramentas de manufatura [50]. Essas plataformas não são feitas para material, estoque e máquinas. Este guia trata apenas de fluxos de valor na manufatura e nos processos de negócio ao redor dela.

## 2. Por que papel e Excel atingem seus limites

O mapeamento do fluxo de valor começou como um método de lápis e papel, e para um primeiro mapa essa ainda é a forma certa. Quem fica no gemba (o local onde o valor é criado, ou seja, o chão de fábrica) com um lápis e conta o estoque entende o fluxo melhor do que quem fica clicando em software. Ainda assim, o método em papel esbarra em limites em quatro situações.

**Primeiro: a fotografia.** Um mapa clássico do fluxo de valor mostra um único ponto no tempo. Ao apresentar o projeto de pesquisa alemão ECOWERT, Markus Böhm, do Fraunhofer IPA (um instituto alemão de pesquisa aplicada em engenharia de manufatura), afirmou (traduzido do alemão): "Basicamente, o mapeamento do fluxo de valor não é nada mais do que uma fotografia." Segundo o instituto, muitas empresas o fazem no máximo uma vez por ano [25]. Quando o mix de produtos, a demanda ou o padrão de turnos mudam, o mapa fica desatualizado.

**Segundo: médias em vez de distribuições.** No papel, cada caixa de processo traz um único tempo de ciclo, não a sua variação. Paradas, sequências de troca de ferramentas e recursos compartilhados desaparecem na média. Um fornecedor de simulação descreve a diferença assim: a simulação do fluxo de valor acrescenta à visão "sequências dependentes do tempo, variação e recursos compartilhados" (traduzido do alemão) [37]. Türck, Weimer, Schubert e Drees descreveram essa passagem da análise estática para a simulação dinâmica de fluxos de valor já em 2014, na ZWF, a *Zeitschrift für wirtschaftlichen Fabrikbetrieb*, uma revista alemã de engenharia de produção [22].

**Terceiro: variedade de produtos.** O método analisa uma família de produtos. Na manufatura de alto mix e baixo volume, porém, muitas variantes com roteiros diferentes passam pelos mesmos recursos. Um mapa por variante é impraticável; um mapa único para todas as variantes obscurece os gargalos.

**Quarto: esforço de cálculo e versões.** Takt time, dias de estoque, lead time e razão de fluxo podem ser calculados no Excel, mas cada mudança no mapa precisa ser transferida manualmente. Vários cenários, várias fábricas e vários editores logo geram versões de arquivo concorrentes.

A ordem das consequências importa. O software resolve o primeiro e o quarto problemas com relativa facilidade, desde que haja dados disponíveis. Somente um software que de fato modele a variabilidade e o mix de produtos resolve o segundo e o terceiro. E nenhum software substitui a discussão em equipe sobre como deve ser o estado futuro.

## 3. As cinco categorias de software de mapeamento do fluxo de valor

O verbete curto da Wikipedia sobre software de mapeamento do fluxo de valor distingue dois tipos básicos: ferramentas que ajudam a desenhar o mapa e ferramentas que realizam cálculos e análises [46]. Para uma decisão de compra, uma divisão mais fina em cinco categorias ajuda mais do que um ranking de produtos individuais. Os exemplos abaixo não são completos nem recomendações; eles mostram que tipo de ferramenta se pode esperar em cada categoria. Todas as afirmações sobre produtos baseiam-se nas próprias páginas dos fornecedores e nas listagens de marketplace.

### 3.1 Ferramentas de desenho e quadros brancos

**O que fazem:** Oferecem bibliotecas de símbolos para mapas do fluxo de valor e permitem que as equipes trabalhem em conjunto no navegador ou no desktop. O Microsoft Visio inclui um modelo de mapa do fluxo de valor; o artigo de suporte da Microsoft afirma que o modelo exige o Visio Professional (ou a edição Premium mais antiga) e não está incluído no Visio Standard, e o artigo lista o Visio Plan 2 em "Aplica-se a" [27]. O Lucidchart oferece uma biblioteca de formas de VSM em sua conta gratuita [28]; o Miro oferece um conjunto de modelos de mapa do fluxo de valor em seu quadro branco [29]. Creately, EdrawMax, SmartDraw e ferramentas semelhantes funcionam da mesma forma. Modelos de Excel e PowerPoint também pertencem a esta categoria.

**Pontos fortes:** baixa barreira de entrada, boa colaboração, muitas vezes níveis gratuitos de entrada, interface familiar.

**Limites:** normalmente não há lógica de cálculo por trás dos símbolos. As métricas são digitadas manualmente, os cenários são cópias do desenho e não há conexão de dados com ERP ou MES.

**Indicado para:** documentação, treinamento, primeiros workshops de kaizen, equipes distribuídas que precisam de uma visão compartilhada.

### 3.2 Ferramentas dedicadas de mapeamento do fluxo de valor (software de VSM com lógica de cálculo)

**O que fazem:** Combinam símbolos lean com lógica de cálculo. Métricas como dias de estoque, lead time e razão de valor agregado são calculadas automaticamente a partir de dados de processo, e cenários podem ser comparados lado a lado. Exemplos: o eVSM, que seu fornecedor descreve como "um kit completo de ferramentas lean para mapear, modelar e melhorar fluxos de valor de todos os tipos" (listagem de marketplace com recursos relatados por usuários, como mapeamento de modelos mistos e importação do Excel) [42]; o SimVSM da SimPlan (Alemanha), cuja versão básica suporta mapeamento digital do fluxo de valor "incluindo avaliações estáticas" (traduzido do alemão) [30] e calcula automaticamente indicadores como tempo de ciclo, throughput e estoque [31]; o visTable (Alemanha), que vincula fluxo de valor e layout da fábrica em um único modelo e, segundo o fornecedor, calcula lead times automaticamente a partir de dados de processo, ciclo e estoque [32]; e o Polaris VSM da iFAKT (ver Parte B).

**Pontos fortes:** menos erros de cálculo, cenários rápidos, versionamento, frequentemente acompanhamento de ações integrado.

**Limites:** custos de licença, curva de aprendizado, e o cálculo geralmente permanece estático: trabalha com médias, mesmo quando os dados entram automaticamente.

**Indicado para:** empresas que fazem trabalho de fluxo de valor regularmente e querem manter comparáveis vários fluxos de valor ou plantas.

### 3.3 Software de simulação

**O que faz:** A simulação de eventos discretos modela pedidos, recursos, buffers, turnos e paradas ao longo do tempo. Isso responde a perguntas que um mapa estático não consegue: Onde surge o gargalo com este mix de produtos? O buffer é suficientemente grande com esta taxa de paradas? O que um turno extra nos traz? Ferramentas conhecidas incluem o Siemens Tecnomatix Plant Simulation, o AnyLogic (modelagem multimétodo: baseada em agentes, dinâmica de sistemas e eventos discretos) e o FlexSim (eventos discretos com modelagem 3D) [34]. Alguns fornecedores conectam diretamente fluxo de valor e simulação: a Siemens oferece uma biblioteca de VSM para o Plant Simulation X com elementos de fluxo de valor pré-configurados, comparação de cenários e simulação dinâmica de fluxos de valor que coleta métricas como tempo de ciclo, lead time, WIP e utilização de recursos [33]; no SimVSM Pro, cenários podem ser simulados, por exemplo para avaliar medidas ou identificar gargalos [31].

**Pontos fortes:** variabilidade, mix de produtos e recursos compartilhados ficam visíveis; investimentos podem ser testados antes do comprometimento.

**Limites:** construir e validar um modelo exige tempo e especialização. Projetos clássicos de simulação costumam ser estudos pontuais cujo modelo não é mantido após a decisão.

**Indicado para:** decisões de capital e de layout, manufatura de alto mix, questões de capacidade com grande incerteza.

### 3.4 Sistemas APS (planejamento e programação avançados)

**O que fazem:** Os sistemas APS criam programações detalhadas sob restrições: capacidade de máquinas e mão de obra, habilidades, sequências de troca de ferramentas, disponibilidade de materiais e datas de entrega. A Siemens descreve o Opcenter Scheduling como um sistema que cria "programações de produção com base na disponibilidade de recursos, restrições e materiais exigidos pelo pedido" [36]. Uma visão detalhada está na coletânea [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

**Pontos fortes:** programações realistas e executáveis, em vez de planejamento aproximado com capacidade infinita; reprogramação rápida após interrupções.

**Limitações:** altas exigências de qualidade dos dados mestres (roteiros, tempos, recursos), esforço de integração com ERP e MES, e aceitação pelos planejadores.

**Indicado para:** empresas com recursos escassos e compartilhados, muitas variantes e pressão por prazos de entrega.

### 3.5 MES, process mining e BI

**O que fazem:** Os sistemas de execução de manufatura (MES) registram dados reais do chão de fábrica; ferramentas de BI e analytics orientado a dados os avaliam. Alguns fornecedores reconstroem fluxos de valor automaticamente a partir desses dados. A ONIQ, oferecida pela PwC Store na Alemanha, afirma que os dados de retorno dos sistemas de TI da produção "(por exemplo, MES, PDA, PPS, IIoT)" podem ser transferidos para um gêmeo digital do fluxo de valor "sem mapeamento manual" [35] (PDA é a aquisição de dados de produção; PPS é o termo alemão para os sistemas de planejamento e controle da produção).

**Pontos fortes:** dados reais em vez de estimativas, análise contínua em vez de avaliações pontuais.

**Limitações:** o resultado só é tão bom quanto os dados de retorno; o estado futuro e as programações não surgem automaticamente. Um MES não substitui o mapeamento do fluxo de valor; ele o alimenta com dados.

**Indicado para:** fábricas com uma boa base de dados que desejam acompanhar desvios e tendências continuamente. Mais sobre indicadores na coletânea [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/); sobre rotinas diárias no chão de fábrica na coletânea [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

### 3.6 Plataformas que abrangem várias categorias

Alguns fornecedores combinam várias dessas categorias em um só produto, como fluxo de valor e layout (visTable [32]), fluxo de valor e simulação (SimVSM Pro [31], biblioteca VSM do Plant Simulation X [33]) ou fluxo de valor, simulação, programação e execução (iFAKT Polaris, segundo o fornecedor [3]). A vantagem é a continuidade dos dados: o que se captura durante o mapeamento não precisa ser digitado novamente para a simulação. A desvantagem: em cada categoria isolada, uma ferramenta especializada pode ir mais fundo. Com plataformas, avalie cada categoria separadamente em relação às suas necessidades, em vez de tratar a amplitude como qualidade em si mesma.

## 4. Tabela comparativa por categoria

| Critério | Desenho/quadro branco | Ferramenta VSM dedicada | Software de simulação | Sistema APS | MES / process mining / BI |
|---|---|---|---|---|---|
| Pergunta principal | Como é o fluxo? | Onde estão os desperdícios e as alavancas? | Como o sistema se comporta ao longo do tempo? | Quem faz o quê e quando? | O que realmente aconteceu? |
| Símbolos Lean | sim (modelos) | sim, com lógica | parcialmente (bibliotecas VSM) | não | raramente |
| Métricas automáticas | não | sim (estáticas) | sim (dinâmicas, como distribuições) | métricas de planejamento (datas de entrega, utilização) | métricas reais |
| Variabilidade e paradas | não | em sua maioria não | sim | parcialmente (reprogramação) | visível somente depois |
| Variedade de produtos | fraca | média | boa | boa | boa (dados reais) |
| Conexão com dados de ERP/MES | não | opcional | importação, geralmente por projeto | obrigatória | obrigatória |
| Saída | desenho | mapa com métricas, cenários | avaliação de cenários | cronograma executável | relatórios, dashboards |
| Esforço típico | baixo | baixo a médio | médio a alto | alto | alto |
| Usuários típicos | coaches Lean, equipes de kaizen | gestores de fluxo de valor, engenheiros industriais | engenheiros de simulação, planejadores de instalações | planejadores de produção, programadores | gestão da planta, TI, finanças |

A tabela descreve perfis típicos. Produtos individuais podem diferir, e algumas plataformas cobrem várias colunas. Para a sua decisão, o que importa é qual coluna responde à sua pergunta mais importante.

### Guia rápido de decisão

- **Você quer documentar fluxos de valor para oficinas e treinamento** e mapeá-los no máximo uma vez por ano: uma ferramenta de desenho com modelo geralmente basta.
- **Você trabalha com fluxos de valor regularmente**, compara vários fluxos ou plantas e quer métricas sem manutenção de planilhas: uma ferramenta VSM dedicada.
- **Seus gargalos mudam com o mix de produtos**, ou você precisa justificar um investimento em equipamentos, pessoas ou estoques intermediários: simulação, de preferência com um modelo mantido após o estudo.
- **Seu problema são as datas de entrega**, porque muitas ordens disputam máquinas, ferramentas e competências escassas: um sistema APS.
- **Você não sabe o que realmente acontece no chão de fábrica**, porque as confirmações estão ausentes ou não são confiáveis: primeiro a coleta de dados (MES, coleta de dados de máquinas), depois a análise.
- **Mais de um desses cenários se aplica:** avalie plataformas que conectam várias categorias em um único modelo de dados e compare cada categoria com uma ferramenta especialista.

## 5. Como escolher software de mapeamento de fluxo de valor: critérios em detalhe

### 5.1 Conexão de dados com ERP, MES e chão de fábrica

A pergunta mais importante é: de onde vêm os dados e com que frequência são atualizados? Uma ferramenta que conhece apenas entrada manual continua sendo um retrato instantâneo. Uma ferramenta que não pode começar sem integração com o ERP adia qualquer benefício por meses. Uma boa solução começa sem integração e pode puxar dados depois. Pergunte especificamente sobre formatos de importação (Excel, CSV), conectores padrão para o seu sistema ERP (SAP, Microsoft Dynamics 365, Epicor, Infor, Oracle ou o que você utilizar), interfaces com MES e coleta de dados de máquinas, e a opção de conectar dados de máquinas por meio de um gateway IIoT (protocolos comuns são OPC UA, MTConnect e MQTT). Defina também quem constrói e mantém a interface: o fornecedor, um parceiro ou a sua própria equipe de TI.

### 5.2 Lógica de cálculo e métricas

Verifique quais métricas a ferramenta calcula e se as fórmulas estão visíveis. Takt time (tempo disponível dividido pela demanda do cliente), dias de estoque, lead time, índice de valor agregado (frequentemente expresso como eficiência do ciclo de processo, PCE), OEE e índice de fluxo devem ser rastreáveis. Métricas e fórmulas personalizadas são importantes porque cada fábrica mantém suas próprias definições. Um software cujos resultados ninguém consegue recalcular perde o primeiro argumento junto à área financeira.

### 5.3 Dinâmica e simulação

Esta é a distinção fundamental: a ferramenta calcula com médias ou simula a operação ao longo do tempo? Muitos fornecedores chamam de "simulação" uma comparação de cenários, embora apenas as métricas estáticas de duas variantes sejam comparadas. Pergunte se a variabilidade, as quebras, os padrões de turno, o mix de produtos e os recursos compartilhados são modelados ao longo do tempo, e o que é gerado como resultado: médias, distribuições, séries temporais de utilização. Com entradas estocásticas (quebras, tempos variáveis), o software deve ser capaz de avaliar várias replicações; uma única execução é apenas um resultado possível, não um resultado confiável.

### 5.4 Variedade de produtos e estrutura de produto

Quando muitas variantes passam pelos mesmos recursos, o modelo precisa de listas de materiais, roteiros e atribuições de recursos, e não apenas caixas de processo. Verifique se a ferramenta modela produtos, processos e recursos separadamente e os vincula (frequentemente chamado de modelo produto-processo-recurso, abreviado PPR) e se considera tempos de troca dependentes da sequência entre variantes.

### 5.5 Da análise à execução

Grande parte do valor é criada após a análise. Pergunte se ações, cartões kaizen, responsáveis e prazos são gerenciados na mesma ferramenta, se um ciclo PDCA pode ser documentado e se um estado futuro pode se transformar em um programa para o chão de fábrica.

### 5.6 Colaboração e governança

Papéis e permissões (leitura, edição, administração), histórico de versões, multilocação para várias fábricas ou entidades jurídicas, edição simultânea e trilha de auditoria das alterações são obrigatórios assim que mais de uma equipe utiliza a ferramenta.

### 5.7 Integração com a Microsoft

Muitos fabricantes dos EUA utilizam o Microsoft 365 e o Microsoft Entra ID (antigo Azure Active Directory), e alguns usam o Dynamics 365 como sistema ERP. As perguntas relevantes são: o software oferece suporte a single sign-on com o seu provedor de identidade? Existe um conector padrão para o Dynamics 365, ou apenas importação de arquivos? As métricas podem ser exportadas para a sua ferramenta de BI, como o Power BI? É possível adquirir a solução pelo Microsoft AppSource ou pelo Azure Marketplace? Uma listagem no AppSource significa que a solução é oferecida no marketplace da Microsoft; por si só, não diz nada sobre a profundidade de uma integração.

### 5.8 Hospedagem, proteção de dados e segurança da informação

Os dados de produção contêm capacidades, custos, pedidos de clientes e fornecedores. Defina onde os dados ficam armazenados (região, operador do data center), como os locatários são separados e quais certificações o fornecedor pode apresentar. Para compradores dos EUA, vale perguntar sobre quatro pontos:

- **Residência de dados.** Solicite por escrito a região de nuvem que hospeda seus dados. Se o fornecedor hospeda apenas na UE, verifique se isso atende aos seus contratos com clientes e às políticas internas. Se os dados do seu fluxo de valor incluem dados técnicos controlados pela ITAR ou pela EAR (comum em aeroespacial e defesa), envolva sua equipe de conformidade de exportação antes de colocar esses dados em qualquer serviço de nuvem.
- **Atestações.** Muitas equipes de segurança nos EUA pedem um relatório SOC 2, uma auditoria sob os critérios do AICPA para controles relevantes de segurança, disponibilidade, integridade de processamento, confidencialidade ou privacidade [45]. A alternativa internacional é uma certificação ISO/IEC 27001, que comprova um sistema de gestão de segurança da informação auditado. Qualquer uma pode ser aceitável; solicite o certificado com escopo e data de validade, ou o próprio relatório. O que importa é se o desenvolvimento e a operação do software estão dentro do escopo.
- **Seu próprio framework de risco.** O Cybersecurity Framework 2.0 do NIST, lançado em 26 de fevereiro de 2024, destina-se a organizações de todos os portes e setores e acrescentou uma função "Govern" às funções Identify, Protect, Detect, Respond e Recover [44]. Você pode usá-lo para estruturar suas próprias avaliações de fornecedores.
- **Lei europeia de proteção de dados.** Com um fornecedor europeu, você verá com frequência referências ao GDPR, o Regulamento Geral de Proteção de Dados da UE, e a um acordo de processamento de dados (DPA). Um DPA sob o GDPR é um contrato sobre como o fornecedor processa dados pessoais em seu nome; em ferramentas de produção, isso se refere principalmente a contas de usuários e nomes. Não é uma certificação de segurança.

### 5.9 Custo, teste e suporte

Pergunte sobre o modelo de licenciamento (por usuário, por planta, por módulo), uma versão gratuita ou um período de teste, o esforço de treinamento e implementação, e consultoria do fornecedor ou de um parceiro. Para compradores nos EUA de um fornecedor estrangeiro, pergunte também sobre o horário de suporte nos seus fusos horários e se há parceiros de implementação com sede nos EUA. Muitos fornecedores deste mercado não publicam preços; isso é comum, mas dificulta a comparação. Solicite um orçamento por escrito do custo total em três anos, incluindo a integração.

## 6. Lista de verificação para seleção

**Questão e escopo**
- [ ] A questão principal está registrada por escrito (documentar, avaliar, simular, programar ou monitorar).
- [ ] A categoria correspondente da Seção 3 foi escolhida.
- [ ] Uma área piloto com uma família de produtos e uma meta mensurável foi definida.

**Dados**
- [ ] Você consegue começar sem integração de sistemas.
- [ ] A importação de Excel/CSV foi testada com seus próprios dados.
- [ ] A conexão com seu ERP e MES está descrita (conector padrão ou projeto).
- [ ] A responsabilidade pela operação das interfaces está definida.

**Funcionalidade**
- [ ] Métricas e fórmulas estão visíveis e podem ser adaptadas.
- [ ] Cenários podem ser versionados e comparados.
- [ ] Dinâmicas (variabilidade, paradas, mix de produtos) são modeladas, se você precisar.
- [ ] Variantes, listas de materiais e sequências de troca podem ser modeladas, se você precisar.
- [ ] Ações e PDCA são acompanhados na ferramenta.

**Operação e segurança**
- [ ] A região de hospedagem e o operador do data center estão confirmados por escrito.
- [ ] Um relatório SOC 2 ou um certificado ISO/IEC 27001 com escopo está disponível.
- [ ] Um acordo de processamento de dados está disponível, quando dados pessoais estiverem envolvidos.
- [ ] As questões de controle de exportação (ITAR/EAR) foram esclarecidas, se relevante.
- [ ] O login único (single sign-on) e o modelo de perfis de acesso são compatíveis com sua TI.

**Economia**
- [ ] O custo total em três anos, incluindo integração e treinamento, é conhecido.
- [ ] As hipóteses de benefício são sustentadas por seus próprios valores de referência (veja a Seção 9).
- [ ] Você conversou com um cliente de referência do seu setor.

## 7. Implantação em seis etapas

**Etapa 1: Definir o objetivo e a área piloto.** Escolha uma família de produtos com um problema perceptível, como prazo de entrega longo ou baixo índice de entrega no prazo, e uma meta mensurável. Um piloto em todas as fábricas ao mesmo tempo normalmente fracassa por falta de coordenação.

**Etapa 2: Mapear o estado atual no gemba.** Vá ao chão de fábrica, conte os estoques, pergunte sobre os tempos. O software serve para capturar os dados, não para substituir a observação direta.

**Etapa 3: Enriquecer os dados.** Acrescente ao levantamento dados do ERP, do MES ou da coleta de dados de máquinas, primeiro em forma de arquivo. As diferenças entre o que você observou e o que os sistemas indicam já são um resultado: mostram onde os dados mestres estão errados.

**Etapa 4: Desenvolver o estado futuro e os cenários.** Defina um estado futuro em equipe e compare as variantes. Se a variabilidade ou o mix de produtos forem relevantes, teste as variantes com uma simulação.

**Etapa 5: Implementar e acompanhar as ações.** Transforme o estado futuro em ações com responsáveis e prazos. Se a solução cobrir programação e execução, teste na área piloto se as programações se sustentam no chão de fábrica.

**Etapa 6: Sustentar e expandir.** Defina quem mantém o fluxo de valor, com que frequência os indicadores são revisados e quando a análise é repetida. Só então vale a pena expandir para mais fluxos de valor.

## 8. Erros comuns na seleção e na implantação

- **Ferramenta antes do método:** Se a equipe ainda não domina o mapeamento do fluxo de valor, o software apenas ajuda a desenhar mapas errados mais rapidamente. Treine primeiro o método.
- **Confundir categorias:** Compra-se uma ferramenta de desenho quando a questão é programação, ou um sistema APS quando ninguém conhece ainda o fluxo de valor.
- **Confundir comparação de cenários com simulação:** Dois mapas estáticos lado a lado não mostram gargalos que só aparecem por causa da variabilidade.
- **Subestimar a qualidade dos dados:** Roteiros com tempos desatualizados produzem resultados irreais em qualquer software. Reserve tempo para a limpeza dos dados mestres.
- **Forçar a integração cedo demais:** Um projeto de interfaces que dura meses, antes do primeiro resultado, custa apoio interno. Comece com importação de arquivos.
- **Adotar os ganhos prometidos pelos fornecedores:** Percentuais como "até 50 por cento de prazo de entrega mais curto" descrevem casos individuais sob condições desconhecidas. Esses números são comuns em todo o mercado, desde suítes APS até ferramentas de VSM (a Seção 17 traz exemplos). Calcule com os seus próprios valores de referência.
- **Ninguém responde pelo fluxo de valor:** Sem um gestor do fluxo de valor, o melhor mapa digital fica desatualizado, assim como o papel pardo.
- **Deixar o chão de fábrica de fora:** Programações e tarefas que os operadores não entendem ou não conseguem confirmar permanecem apenas teóricas.

## 9. Um caso de negócio sem números inventados

Um caso de negócio credível para software de mapeamento de fluxo de valor se apoia nos seus próprios valores de referência, e não em percentuais de folhetos comerciais. A lógica pode ser dividida em cinco alavancas e três blocos de custo.

**Alavanca 1: estoque e lead time.** Pela Lei de Little, em regime permanente: trabalho em processo = vazão × lead time. Se você reduzir o lead time mantendo a vazão constante, reduz o estoque imobilizado na mesma proporção. Calcule com o seu WIP atual, o seu custo de capital e uma hipótese de meta que a equipe do projeto consiga defender.

**Alavanca 2: entrega no prazo.** Entregas atrasadas geram multas contratuais, frete expresso, pedidos urgentes e perda de confiança do cliente. Registre a taxa atual de entrega no prazo e o custo diretamente atribuível aos pedidos atrasados no último ano.

**Alavanca 3: capacidade e investimentos de capital evitados.** Se uma simulação mostrar que um aparente gargalo pode ser resolvido por sequenciamento ou buffers, um investimento deixa de ser necessário. Esta alavanca costuma ser a maior, mas é pontual e só conta se o investimento tiver de fato sido planejado.

**Alavanca 4: esforço de planejamento e análise.** Conte as horas gastas hoje em caminhadas de fluxo de valor, manutenção de planilhas e programação manual. Valorize a economia com cautela: o tempo liberado só é um benefício se for usado em outra atividade.

**Alavanca 5: qualidade das decisões.** Difícil de quantificar, mas real: investimentos ruins que deixam de ser feitos e decisões sobre mix de produtos testadas antecipadamente. Liste esta alavanca qualitativamente, em vez de preenchê-la com números inventados.

**Custos:** (1) licenças ou assinaturas durante o prazo previsto, (2) implantação, incluindo preparação de dados, interfaces, treinamento e consultoria, (3) tempo interno para o piloto, manutenção de dados mestre e responsabilidade contínua pelo fluxo de valor.

**Como proceder:** Para cada alavanca, defina uma referência de partida, uma meta conservadora e uma meta esperada, e calcule os dois cenários em relação aos custos. O piloto existe para testar as hipóteses com dados reais. Um fornecedor disposto a acordar um piloto com critérios mensuráveis é mais confiável do que um que apresenta números de benefício sem metodologia.

# Parte B: iFAKT Polaris em detalhes

> **Nota: O autor trabalha na iFAKT GmbH.**

As seções a seguir descrevem o [iFAKT Polaris](https://www.m365.fm/entity/polaris/) com base nas páginas de produto da [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) (em inglês e alemão, consultadas em 20 de novembro de 2026), nas fichas do Microsoft AppSource, em uma publicação da Microsoft Tech Community, nas páginas de premiação da WirtschaftsWoche e na literatura técnica. Quando uma afirmação vier apenas do fornecedor, o texto informa isso. O autor não conhece testes comparativos independentes nem avaliações de analistas sobre o Polaris.

## 10. Contexto e método

A iFAKT GmbH tem sede na Curiestrasse 2, 70563 Stuttgart, Alemanha (registro comercial: Tribunal Local de Stuttgart, HRB 22661) [5]. A página em inglês da empresa afirma que os escritórios ficam perto do Aeroporto de Stuttgart [4]. Segundo a empresa, ela trabalha há mais de 25 anos na otimização de processos produtivos e empresariais [3]. A página da empresa lista automotivo, aeroespacial, engenharia mecânica e tecnologia médica como setores de atuação [4].

Para avaliar o Polaris, o histórico da empresa importa menos do que o raciocínio metodológico por trás do software. Aqui existe uma trilha verificável: Jörg Drees, listado com a afiliação iFAKT GmbH no artigo da ZWF de 2023 [24], publicou diversos artigos com coautores na ZWF entre 2011 e 2023, o mais recente junto com o Fraunhofer IPA. A ZWF (*Zeitschrift für wirtschaftlichen Fabrikbetrieb*) é uma revista de engenharia em língua alemã cujo arquivo hoje é hospedado pela De Gruyter Brill; os títulos abaixo são traduzidos, e os títulos originais em alemão constam nas fontes. Os artigos traçam um caminho que aparece na estrutura de módulos do Polaris.

| Ano | Artigo (título traduzido) | Autores | Referência | Ligação com o Polaris |
|---|---|---|---|---|
| 2011 | Otimização da produção por meio de métricas de modelagem de fluxo de valor | Jörg Drees, Christoph Sack | ZWF 106 (6), pp. 466–470, DOI 10.3139/104.110589 [21] | cálculo de métricas no fluxo de valor (VSM) |
| 2014 | Simulação dinâmica de fluxos de valor | Stefan Türck, Andreas Weimer, Lars Schubert, Jörg Drees | ZWF 109 (11), pp. 839–842, DOI 10.3139/104.111242 [22] | passo da análise estática para a simulação |
| 2018 | Novas perspectivas para o método de fluxo de valor: Value Stream Management 4.0, Next Generation | Jörg Drees | ZWF 113 (9), pp. 605–609, DOI 10.3139/104.111974 [23] | método de fluxo de valor e software para produção conectada (Indústria 4.0, IIoT) |
| 2023 | Uma interface de dados universal para serviços digitais de fluxo de valor | Markus Böhm, Jörg Drees, Brandon Sai, Klaus Erlach, Steffi Stambera, Tim Teriete | ZWF 118 (5), pp. 293–297, DOI 10.1515/zwf-2023-1062 [24] | dados de eventos das máquinas como base de dados comum para serviços de fluxo de valor |

**2011: métricas.** Drees e Sack descrevem como as métricas da modelagem de fluxo de valor podem ser usadas para otimizar a produção [21]. Esse é o núcleo de uma ferramenta VSM dedicada: símbolos com lógica de cálculo por trás.

**2014: dinâmica.** Segundo seu resumo, o artigo de Türck, Weimer, [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) e [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) parte da visão de que a modelagem de fluxo de valor está migrando de uma análise estática de fluxos de valor e métricas para a simulação dinâmica, e pergunta quais novas possibilidades, incluindo o tempo, se abrem para a otimização da produção [22]. Essa ideia sobrevive no módulo Simulator, que, contudo, trabalha sobre o modelo produto-processo-recurso do Designer, e não sobre o mapa de fluxo de valor (Seção 12).

**2018: conectividade.** Drees pergunta como o método de fluxo de valor e seu software precisam evoluir agora que a Indústria 4.0 e a IIoT conectam informações em toda a fábrica [23].

**2021 a 2023: dados em tempo real com o Fraunhofer IPA.** No projeto de pesquisa ECOWERT (sigla alemã para "análise de fluxo de valor em tempo real para otimização sustentável da produção"), o Fraunhofer IPA trabalhou com a iFAKT GmbH em um software que consulta e exibe automaticamente dados de produção de sistemas ERP e de outras fontes, próximo ao tempo real. O estado alemão de Baden-Württemberg financiou o projeto de um ano, que foi até 31 de agosto de 2022, com cerca de 300.000 euros do programa Invest BW; a ESB Business School da Universidade de Reutlingen ajudou a construir um demonstrador [25]. Um artigo técnico de Drees, Stambera e Böhm descreve o caminho técnico: dados de máquinas em formato JSON por meio de um gateway IIoT (ele cita OPC UA, MTConnect, IO-Link e MQTT; o projeto usou MQTT com Sparkplug), um banco de dados de séries temporais e a ligação com a aplicação de fluxo de valor Polaris VSM, que calcula métricas por meio de uma árvore de KPIs para períodos e famílias de produtos selecionados [26]. O artigo da ZWF de 2023 generaliza essa abordagem em uma interface de dados universal; segundo os autores, um serviço de fluxo de valor para cálculo e visualização de métricas foi conectado dentro do ECOWERT [24]. Os autores incluem Klaus Erlach, do Fraunhofer IPA, autor do livro-texto alemão padrão sobre projeto de fluxo de valor [40].

**O que este rastro comprova e o que não comprova:** As publicações mostram que os autores trabalham há muito tempo com métricas, simulação e conectividade de dados para fluxos de valor, e que um instituto de pesquisa colaborou com a iFAKT. Elas não mostram que o software atual seja melhor do que outros. O Fraunhofer IPA também não avalia nenhum produto em seu comunicado de imprensa; ele descreve um projeto de pesquisa e, segundo o instituto, os aplicativos da época ainda não faziam "nenhuma sugestão" (traduzido do alemão) [25].

O mapeamento do fluxo de valor com dados em tempo real e um modelo de dados contínuo também é o tema do episódio de podcast [Value Stream Mapping with live data and a data model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) no m365.fm.

## 11. Princípio da plataforma: um modelo de dados, sete módulos

Segundo o FAQ do fornecedor, o Polaris é uma plataforma modular de software para fábricas inteligentes que cobre a otimização da produção, desde o mapeamento do fluxo de valor, passando pela simulação e pelo sequenciamento apoiado por IA, até a execução no chão de fábrica e os relatórios [3]. O site cita sete módulos: VSM, BSM, Designer, Simulator, Optimizer, Operator e Analyzer. Segundo o fornecedor, todos os módulos trabalham com o mesmo modelo de dados, de modo que simulação ou sequenciamento podem ser adicionados depois sem nova coleta de dados [3]. O fornecedor descreve o fluxo como um ciclo: "Map → Simulate → Optimize → Execute → Analyze" [3].

Na sua página inicial em inglês, a iFAKT resume a oferta assim: "Polaris combines ERP data with a manufacturing digital twin to optimize schedules" [1]. Os recursos principais listados são "Constraint-based scheduling (resources, skills, shifts, buffers)", "What-if simulation for disruptions and mix changes" e "KPI cockpit: lead time, WIP, utilization, OTD" [1]. A página destaca três princípios: conectar dados de ERP, Excel ou do chão de fábrica, ou começar com um modelo enxuto ("plug and play"); uma única plataforma para mapeamento, simulação, sequenciamento e execução, sem trocar de ferramenta; e a modelagem de complexidades como mix de produtos, trocas de setup, habilidades, turnos, sequências de operações, buffers e interrupções [1][2].

Para começar, o FAQ cita dois caminhos: os módulos VSM e BSM estão disponíveis em uma versão gratuita, sem necessidade de cartão de crédito; para Simulator, Optimizer e Operator, o fornecedor oferece uma demonstração personalizada e um período de teste [3]. Não é preciso adotar todos os módulos; segundo o fornecedor, muitas empresas começam pelo VSM porque ele não exige integração com sistemas [3]. Para simulação e sequenciamento, o FAQ indica um tempo típico de implantação de duas a quatro semanas, incluindo integração de dados, configuração do modelo e treinamento [3]. Esse prazo é uma afirmação do fornecedor; na prática, depende fortemente da qualidade dos dados mestres e das interfaces.

Para entender a arquitetura, ajuda relacionar os módulos às categorias da Parte A:

| Módulo | Categoria da Parte A | Base de dados segundo o fornecedor | Saída |
|---|---|---|---|
| VSM | ferramenta dedicada de VSM | captura manual, opcionalmente ERP, MES, coleta de dados de máquinas, data warehouse [6] | mapa do fluxo de valor com métricas e cenários |
| BSM | modelagem de processos (swimlanes) | modelagem manual [7] | mapa de processo com linha do tempo e métricas |
| Designer | modelagem (grafo PPR) | dados de ERP, listas de materiais, tempos de processo, recursos [8] | modelo produto-processo-recurso, diagrama de rede |
| Simulator | simulação | modelo PPR do Designer [9] | utilização, gargalos, cenários ao longo do tempo |
| Optimizer | APS | modelo PPR, dados de ERP, disponibilidade de recursos [10] | cronograma de produção executável |
| Operator | execução no chão de fábrica | cronograma do Optimizer [11] | tarefas por operador, confirmações |
| Analyzer | BI / métricas | métricas de todos os módulos [12] | painéis, planejado vs. realizado |

Para uma classificação como aplicação de negócio na taxonomia do m365.fm, consulte a página da entidade [Business Application](https://www.m365.fm/entity/business-application/).

## 12. Os módulos um a um

### 12.1 Polaris VSM: mapeamento digital do fluxo de valor

**Finalidade:** [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) é o módulo para mapeamento do fluxo de valor. A publicação da Microsoft sobre a listagem na AppSource descreve-o como uma "ferramenta digital de gestão Lean" que fabricantes usam para mapear cadeias de suprimentos e fluxos de valor; um sistema de fórmulas e quadros Kanban e Kaizen devem calcular, verificar e exibir KPIs, e as equipes podem colaborar remotamente [17].

**Funções segundo a página do fornecedor** [6][14]:
- importação de ERP, MES, sistemas de coleta de dados de máquinas e data warehouses por meio do Polaris IIoT Gateway, combinável com observações manuais no chão de fábrica
- cálculo automático de "mais de 25 KPIs padrão de VSM", incluindo lead time, razão de valor agregado, estoque, OEE e takt vs. tempo de ciclo; métricas e fórmulas personalizadas são possíveis
- "mais de 50 símbolos Lean predefinidos" com editor e codificação por cores
- três níveis hierárquicos: fluxo de valor de ponta a ponta (Nível 1), subprocessos (Nível 2) e operações detalhadas (Nível 3)
- "criação ilimitada de cenários (A, B, C, D…)", análise de sensibilidade e comparação lado a lado de métricas; fluxos de valor podem ser duplicados para testar mudanças sem tocar na produção
- papéis Admin, Editor e Viewer em uma arquitetura multilocatário, edição simultânea, histórico de versões, rastreamento de alterações e documentação PDCA das ações
- "exportação em múltiplos formatos (JPEG, Excel, SVG)" além de exportação criptografada para arquivamento
- suporte rotulado "AI-Support" na área de relatórios e painéis, sem descrição adicional

**Evidências fora do site do fornecedor:** listagem na AppSource [15][17]; uso como aplicação de fluxo de valor vinculada a um banco de dados de séries temporais no artigo especializado sobre dados de fluxo de valor capturados automaticamente [26].

**Afirmações do fornecedor sem metodologia:** "VSM completo em 2-4 horas (vs. 2-3 dias com papel pardo e Excel)", "100% de precisão dos dados (sem erros manuais de Excel)" e uma "redução de 30-40% no risco de implementação" [6]. A página do produto também fala em concluir projetos de fluxo de valor em um terço do tempo [14]. Nenhuma dessas afirmações vem acompanhada de metodologia. "100% de precisão dos dados" pode, com sentido, referir-se apenas à eliminação de erros de transcrição, e não à qualidade dos dados de entrada.

**Limites e o que não está documentado:** A página de VSM descreve cenários e análise de sensibilidade, mas **nenhuma simulação dinâmica** no sentido da Seção 5.3 [6]. Se você quiser estudar variabilidade, paradas ou mix de produtos ao longo do tempo, precisará do Simulator ou de outra ferramenta de simulação. A página não menciona integração com Microsoft Teams ou Power BI. Os preços não são publicados; segundo o FAQ, o VSM está disponível em um nível gratuito [3], cujo escopo a página do módulo não descreve.

**Leitura complementar:** compêndio [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/) · post [Value Stream Management Software for Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)

### 12.2 Polaris BSM: processos de negócio como swimlanes

**Finalidade:** [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/) (Business Swimlane Modeling) aplica a visão de fluxo de valor a processos de negócio, como cotação, engenharia, engenharia de manufatura ou processamento de pedidos (praticantes Lean nos EUA frequentemente chamam isso de mapeamento de fluxo de valor de escritório ou transacional). A listagem na AppSource descreve-o como uma "ferramenta digital de modelagem de processos de negócio para análise de processos na gestão Lean digital" [16].

**Funções segundo a página do fornecedor** [7]:
- pools como contêineres organizacionais, raias para papéis, competências ou departamentos, que podem ser exibidos ou ocultados
- modelagem de objetos de dados, repositórios de dados e sistemas de TI; quebras de mídia entre papel e digital ou entre sistemas tornam-se visíveis
- uma linha do tempo com durações de atividades no caminho crítico, além de tempos de espera e de antecipação (lead e lag)
- um gráfico de balanceamento de operadores (barras empilhadas com as parcelas do tempo de ciclo) para identificar desbalanceamentos
- cálculo automático do caminho crítico, lead time, tempo de ciclo e razão de valor agregado; segundo a página, "mais de 10" métricas padrão de processo e métricas personalizadas
- classificação como agregador de valor ou não agregador de valor, quantificação dos custos de desperdício
- cenários ilimitados (atual, futuro, alternativas) com análise de impacto
- cartões Kaizen criados durante a modelagem e vinculados às atividades, organizados em ciclos PDCA ou DMAIC

**Planos segundo o AppSource** [16]: P0 "Read Only" (ler todo o conteúdo), P1 "Basic" (gravações BPMN, modelos de swimlane, fórmulas básicas, lead time, gráfico de balanceamento, visualização de edição rápida), P2 "Excellence" (todos os recursos de P0 e P1) e P3 "Integrate & Customize" (sem descrição). A listagem não informa preços.

**Limites e o que não está documentado:** A página do módulo não menciona nenhum padrão de notação; somente a listagem do AppSource cita gravações BPMN no plano P1 [7][16]. Não está documentado se modelos BSM podem ser importados ou exportados em formato compatível com BPMN. A página do BSM não nomeia formatos de exportação. Se você procura uma suíte BPM completa com execução de processos (um motor de workflow), o BSM, pela descrição do próprio fabricante, é uma ferramenta de análise e melhoria, e não de automação de processos.

### 12.3 Polaris Designer: o modelo produto-processo-recurso

**Finalidade:** Segundo o fabricante, o [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) transforma dados de entrada em um grafo de conhecimento estruturado produto-processo-recurso (grafo de conhecimento PPR), que serve como base compartilhada para simulação e otimização [8]. Ele é o elo entre a visão do fluxo de valor e os módulos de simulação e programação.

**Funções segundo a página do fabricante** [8]:
- modelagem PPR: produto como lista de materiais de fabricação ou de engenharia (MBOM/EBOM), processo com tempos de setup, de máquina e de movimentação, recursos como estações, equipes e zonas
- dados de entrada: dados do ERP, listas de materiais de fabricação, tempos de processo, estruturas de recursos e restrições
- geração automática de um diagrama de rede a partir da lógica de produção, cálculo do caminho crítico
- cenários what-if e comparação entre lead time atual e otimizado
- zonas baseadas em produto, que agrupam processos por família de produtos e apoiam o balanceamento de capacidade

**Avaliação:** Para o problema de variantes descrito na Seção 5.4, um modelo PPR geralmente é mais adequado do que um mapa de fluxo de valor, porque as variantes são representadas por meio de suas listas de materiais e roteiros, e não por caixas de processo individuais. A página inicial usa o termo "gêmeo digital" para esse modelo [1]; para os diferentes significados de "gêmeo digital", veja o compêndio [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/).

**Limites e o que não está documentado:** A página não informa formatos ou mecanismo de importação, não apresenta resultados quantitativos e não descreve uma configuração explícita de variantes (como conjuntos de regras para produtos configuráveis) [8]. Permanece em aberto como as restrições são modeladas no grafo.

### 12.4 Polaris Simulator: cenários ao longo do tempo

**Finalidade:** Segundo o fabricante, o [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) executa os diagramas de rede do Designer por meio de modelos configuráveis de estação, linha e hall (nível de edifício), para uma ou várias linhas [9].

**Funções segundo a página do fabricante** [9]:
- simulação baseada na lógica real de processo do modelo PPR
- cenários de capacidade, dimensionamento de pessoal e buffers
- análise de mixes de produtos dinâmicos em recursos compartilhados
- identificação de gargalos e desequilíbrios de utilização ao longo do tempo
- utilização de pessoas e recursos técnicos em função do tempo, sobreutilização e subutilização
- transparência de capacidade entre turnos e cenários
- configuração flexível de estações e rotas de produção

**Avaliação:** O módulo cobre, portanto, as questões que a Parte A atribui à categoria de simulação, especialmente mix de produtos e recursos compartilhados. Uma citação de cliente na página inicial (Everllance) diz: "The Polaris simulation helped us identify problems in our planning data" [1]; trata-se de uma única citação no site do fabricante, não de um estudo.

**Limites e o que não está documentado:** A página não declara explicitamente o tipo de simulação (por exemplo, a eventos discretos), não define em detalhe métricas de saída como throughput ou WIP e não traz informações sobre entradas estocásticas, como distribuições de falhas [9]. Não se descreve se os resultados são apresentados como distribuições ou como valores únicos. Para sistemas de transportadores, robótica ou comissionamento virtual, as ferramentas especializadas da Seção 3.3 são a escolha indicada; o Polaris não se descreve como um simulador 3D de fluxo de materiais.

### 12.5 Polaris Optimizer: programação sob restrições

**Finalidade:** Segundo o fabricante, o [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) transforma o grafo PPR em uma programação de produção otimizada e executável, com base em dados do ERP e na disponibilidade de recursos [10]. Ele corresponde à categoria APS.

**Funções segundo a página do fornecedor** [10][13]:
- consideração de recursos, turnos, zonas, habilidades e capacidades; prioridades de pedidos definidas pelos planejadores
- programação de máquinas, trabalhadores e ferramentas
- exibição de pedidos atrasados e riscos de entrega
- dimensionamento de lotes por variante e máquina, sequenciamento por tempos de troca entre variantes
- equilíbrio entre estoque, custo de armazenagem e nível de serviço
- confirmações do chão de fábrica por meio do Operator, reotimização automática após interrupções com análise de impacto
- recursos compartilhados entre projetos
- programação operacional de curto prazo e visão de capacidade de longo prazo

Segundo a FAQ, o Polaris usa "algoritmos de otimização baseados em restrições" para gerar programações que levam em conta capacidade de máquinas, habilidades dos trabalhadores, turnos, materiais e datas de entrega [3]. A página de planejamento e execução também cita restrições de múltiplos recursos, sequências de troca e programação baseada em prioridades; para testes, os dados podem ser importados por arquivo, Excel ou exportação de ERP, e em produção há sincronização contínua com ERP, MES ou outros sistemas [13].

**Alegações do fornecedor sem metodologia:** A página de planejamento cita redução de 50 por cento no lead time, otimização de capacidade de 40 por cento e até 80 por cento menos esforço de planejamento manual [13]; a página do Optimizer fala em lead time mínimo e máxima eficiência de custo com um clique, e em redução considerável do tempo de troca [10]. Não são informados a linha de base, a amostra nem o método de medição.

**Limites e o que não está documentado:** O Optimizer é descrito como apoiado por IA (a página de planejamento tem o título "AI-powered production planning and scheduling"), sem nomear algoritmos ou métodos [10][13]. A página do módulo não traz detalhes concretos sobre a integração com ERP; a FAQ menciona interfaces padrão com SAP e Microsoft Dynamics [3]. Planejamento multiplanta ou de cadeia de suprimentos não é descrito. Mais contexto no compêndio [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/).

### 12.6 Polaris Operator: tarefas para o chão de fábrica

**Finalidade:** Segundo o fornecedor, o [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) pega a programação otimizada diretamente do Optimizer e a apresenta no nível de tarefa no chão de fábrica [11].

**Funções segundo a página do fornecedor** [11]:
- uma visão individual e atual de tarefas por trabalhador
- uma visão de caminho crítico para líderes de turno
- instruções de trabalho incorporadas às tarefas
- pausar ou bloquear tarefas, ou sinalizá-las com feedback estruturado
- confirmações em tempo real de progresso, atrasos, interrupções, escalação real e pausas
- uma visão ao vivo do trabalho em processo para os planejadores
- dados de produção realimentados na programação

**Avaliação:** O Operator foi concebido como o canal de retorno entre plano e execução: uma programação só é tão boa quanto o feedback sobre se ela se sustentou no chão de fábrica. Funcionalmente, sobrepõe-se a partes de um MES (fila de trabalho, confirmações), mas não se descreve como um MES.

**Limites e o que não está documentado:** A página não cita dispositivos suportados nem métricas de desempenho [11]. A relação com um MES existente (complementar, substituto ou paralelo) não é descrita; defina isso cedo em um projeto para evitar confirmações duplicadas. Mais sobre rotinas diárias no chão de fábrica no compêndio [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

### 12.7 Polaris Analyzer: painéis de KPIs

**Finalidade:** Segundo o fornecedor, o [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) reúne em painéis as métricas de todos os módulos do Polaris [12].

**Funções segundo a página do fornecedor** [12]:
- métricas centrais de todos os módulos do Polaris
- visualização de lead times, utilização, gargalos e status de projetos
- comparação de cenários, programações e desempenho real
- detecção de limites de capacidade e de potencial de melhoria

**Limites e o que não está documentado:** A página não cita fontes de dados fora dos módulos do Polaris, tipos de painel nem conexão com ferramentas externas de BI como o Power BI [12]. Se sua empresa usa um sistema central de BI, esclareça como as métricas chegam até ele. As definições de métricas estão no compêndio [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/).

### 12.8 Visão geral: o que está documentado por módulo

| Módulo | Descrição da função em ifakt.de | Evidências externas | Valores de benefício com metodologia | Questão aberta mais importante |
|---|---|---|---|---|
| VSM | detalhada [6][14] | AppSource [15], Tech Community [17], artigo de imprensa [26] | não | escopo da camada gratuita |
| BSM | detalhada [7] | AppSource com planos [16] | não | notação, exportação |
| Designer | média [8] | artigos de periódicos sobre a abordagem [22][24] (indireto) | não | formatos de importação, lógica de variantes |
| Simulator | média [9] | Prêmio WirtschaftsWoche para o Polaris IMS [18] (indireto) | não | tipo de simulação, estocástica |
| Optimizer | detalhada [10][13] | Prêmio WirtschaftsWoche para o Polaris IMS [18] (indireto) | não (valores sem metodologia) | algoritmos, integração com ERP |
| Operator | média [11] | Prêmio WirtschaftsWoche para o Polaris IMS [18] (indireto) | não | dispositivos, fronteira com o MES |
| Analyzer | breve [12] | nenhuma | não | conexão com BI externo |

## 13. Polaris IMS e o Best of Technology Award 2025

Além dos sete nomes de módulos, você encontrará o nome **Polaris IMS**. Sob esse nome, a iFAKT GmbH inscreveu-se no Best of Technology Award 2025 da WirtschaftsWoche, uma revista semanal alemã de negócios. Na página de vencedores da WirtschaftsWoche, a iFAKT com o Polaris IMS (descrito ali como um sistema de planejamento da produção) aparece em **segundo lugar na categoria Produção**, atrás da Skeleton Technologies e à frente da OMRON Electronics [18]. Outros finalistas da categoria foram remberg e UNWARE [19].

A descrição do júri (em alemão) apresenta o Polaris IMS como um sistema inteligente que constrói um gêmeo digital da produção e planeja automaticamente o uso eficiente de recursos; o plano é executado no chão de fábrica e monitorado com dados em tempo real, e, quando ocorrem interrupções, a IA propõe melhorias [18][19]. Na avaliação do autor, isso corresponde funcionalmente à interação entre Designer, Simulator, Optimizer e Operator. Uma citação de cliente na página inicial (Silhouette) também usa o nome: "The use of Polaris IMS was the next step towards the Smart Factory for our organization" [1]. Na página de patrocinadores do evento Lean Around The Clock 2025, a iFAKT se descreve com uma "POLARIS suite" composta pelos módulos IMS, BSM e VSM [20].

**Interpretação:** Com base nessas fontes, IMS é o nome da parte da plataforma que vai além da modelagem de fluxo de valor e de processos, abrangendo modelagem, simulação, programação e execução. O site atual divide essa parte em módulos individuais e usa o nome IMS apenas na citação de cliente [1]. O fornecedor não publicou um mapeamento oficial do IMS para os nomes atuais dos módulos; o mapeamento é interpretação do autor.

**O que o prêmio indica:** O Best of Technology Award é um prêmio de júri de uma publicação de negócios. Ele mostra que um júri avaliou o conceito como altamente positivo entre as inscrições da categoria Produção. Não é um teste funcional ou de desempenho e não substitui um teste com os seus próprios dados. Para leitores dos EUA: trata-se de um prêmio de uma publicação alemã, julgado entre as suas inscrições; deve ser tratado como um ponto de dados, não como um endosso de mercado.

## 14. Setores segundo a empresa

As informações a seguir vêm do site da iFAKT GmbH. São declaradas pela própria empresa; o escopo e a duração de cada relacionamento com clientes não são informados.

| Setor segundo ifakt.de | Descrição no site | Empresas citadas (logotipos, referências, depoimentos) |
|---|---|---|
| Aeroespacial e aviação | alta precisão para a indústria aeroespacial [2] | Airbus [1] |
| Automotivo e mobilidade | produção just-in-time e just-in-sequence, da fabricação de componentes à montagem final [2] | Magna, Vitesco, ZF, Junghans [1] |
| Engenharia mecânica e automação | engineer-to-order até pequenos lotes, BOMs e fabricação por variantes [2] | Karl Dungs, Pfannenberg, Weidmüller, GRASS [1] |
| Energia e infraestrutura | planejamento de produção para infraestrutura crítica [2] | MAN Energy, Siemens Energy, Liebherr [1] |

A faixa de logotipos na página inicial em inglês também mostra FFG, Fraunhofer, Helbling, Jumo, Liebherr, Pfannenberg, Silhouette, Airbus, Dungs e Eismann [1]. Os depoimentos vêm de Silhouette, Airbus e Everllance [1], e, na página de produto VSM, adicionalmente da Siemens Energy sobre o coaching da iFAKT [14]. A página da empresa também lista tecnologia médica como setor [4]. O FAQ afirma que o Polaris é "desenvolvido para empresas de manufatura nos setores aeroespacial, automotivo, engenharia mecânica e energia" e cita gerentes de produção, consultores lean e equipes de operações como usuários-alvo [3].

**O que se pode inferir:** o foco está na manufatura discreta e na montagem, com alta variedade e produtos complexos. Para indústrias de processo (química, farmacêutica, alimentos com receitas e bateladas), o fornecedor não cita referências. Os clientes nomeados são em sua maioria empresas europeias ou unidades europeias de grupos internacionais; as páginas analisadas não citam plantas nos EUA como referências.

## 15. O Polaris no ecossistema Microsoft

Para empresas que dependem fortemente da Microsoft, os pontos a seguir estão documentados:

- **Listagens no AppSource:** o Polaris VSM ("Polaris VSM - Digital Value Stream Mapping") e o Polaris BSM ("Polaris BSM - Business Swimlane Modeling") estão listados como soluções da iFAKT GmbH no Microsoft AppSource [15][16].
- **Microsoft Tech Community:** em 11 de julho de 2024, o blog de Marketplace da Tech Community publicou um post sobre o Polaris VSM em "ISV Success for Business Applications." Segundo a Microsoft, o programa oferece "plataformas, recursos e suporte desenvolvidos para ajudar parceiros a desenvolver, publicar e comercializar aplicativos de negócios" [17].
- **Hospedagem:** as páginas dos módulos VSM e BSM dizem "Hospedado no Microsoft Azure West Europe" [6][7]. A lista de regiões da Microsoft coloca a West Europe nos Países Baixos [43]. O FAQ fala de forma mais geral em "infraestrutura de nuvem europeia segura" [3].
- **Integração com ERP:** segundo o FAQ, o Polaris pode se conectar ao SAP, ao Microsoft Dynamics e a outras plataformas ERP por meio de interfaces padrão, e pode importar dados de planilhas e arquivos CSV [3].
- **Status de parceiro:** a página da empresa cita o status de Microsoft Gold Partner (alcançado em 2019) e a competência "Gold Application Development" pela décima vez consecutiva [4]. Segundo a Microsoft, as competências Gold e Silver só podiam ser renovadas até 30 de setembro de 2022; desde 3 de outubro de 2022, a Microsoft concede designações de Solutions Partner [38]. A afirmação, portanto, descreve um status histórico.

**Não documentado:** integração nativa com o Microsoft Teams, conector do Power BI, single sign-on com o Microsoft Entra ID ou disponibilidade como extensão do Dynamics 365 não são mencionados nas páginas analisadas. Uma listagem no AppSource significa que é possível comprar pelo marketplace da Microsoft, não automaticamente uma integração profunda. Se esses pontos forem importantes para você, peça confirmação por escrito durante a seleção. Mais informações de base sobre TI de manufatura no Azure estão no compêndio [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/).

## 16. Segurança, hospedagem e certificações

| Aspecto | Declaração | Fonte | Status |
|---|---|---|---|
| ISO 9001 | certificada conforme DIN EN ISO 9001, em vigor desde outubro de 2014 | página da empresa [4] | declaração do fornecedor, documentada no site |
| ISO/IEC 27001 | "TÜV SÜD – ISO 9001 & ISO/IEC 27001 Certified" (selo); FAQ: certificada conforme ISO 27001 e ISO 9001, auditada pela TÜV SÜD | página inicial, FAQ [1][2][3] | declaração do fornecedor; certificado com escopo não consultado publicamente |
| Hospedagem | Microsoft Azure West Europe, localizada nos Países Baixos (VSM, BSM); "infraestrutura de nuvem europeia segura" (FAQ) | páginas dos módulos, FAQ, lista de regiões da Microsoft [3][6][7][43] | declaração do fornecedor |
| Criptografia, papéis, auditorias | criptografia, controle de acesso baseado em papéis e auditorias de segurança regulares | FAQ [3] | declaração do fornecedor |
| Isolamento de tenants, autenticação | ambientes de tenant isolados, OAuth 2.0 | página do BSM [7] | declaração do fornecedor |
| GDPR | "100% em conformidade com a GDPR" | páginas do VSM e do BSM [6][7] | declaração do fornecedor; conformidade não é certificação |
| SOC 2 | não mencionada nas páginas analisadas | n/a | perguntar ao fornecedor |
| Região de hospedagem nos EUA | não mencionada nas páginas analisadas | n/a | perguntar ao fornecedor |

**Como interpretar:** Uma certificação ISO/IEC 27001 cobre o sistema de gestão de uma organização dentro de um escopo definido. Durante a seleção, peça para ver o certificado e verifique se o desenvolvimento e a operação do Polaris estão no escopo e por quanto tempo ele é válido. A TÜV SÜD é um organismo alemão de testes e certificação. "Em conformidade com a GDPR" é uma autoavaliação; o que conta é o contrato de tratamento de dados, a lista de subprocessadores e as medidas técnicas e organizacionais. Se a sua equipe de segurança exige um relatório SOC 2 (Seção 5.8), pergunte cedo; as páginas analisadas mencionam apenas certificações ISO. Se você precisa de uma instalação no seu próprio data center: uma opção on-premises não é mencionada nas páginas analisadas; a FAQ menciona apenas a operação em infraestrutura de nuvem europeia [3]. Para empresas dos EUA, isso também significa que, segundo as páginas analisadas, os dados são hospedados fora dos EUA; verifique isso em relação aos contratos com clientes e, em aeroespacial e defesa, às regras de controle de exportação.

## 17. O que o fornecedor promete e como testar

A página inicial apresenta como resultados uma redução de lead time de "Up To 50%" (descrita como "Average decrease in production cycle time"), uma otimização de capacidade de "Up To 40%" ("Improvement in machine utilization rates") e uma melhoria de qualidade de "Up To 25%" ("Reduction in schedule deviations and missed deadlines") [1]. A página de planejamento também cita até 80 por cento menos esforço manual de planejamento [13]. Para nenhum desses números são publicados a linha de base, o número de projetos ou o método de medição. Observe a redação da página inicial: "Up To 50%" ao lado de "Average decrease" mistura um máximo com uma média, mais uma razão para perguntar como o número foi calculado.

Esse tipo de afirmação é comum neste mercado. A Siemens, por exemplo, cita até 50 por cento menos estoque e até 50 por cento melhor cumprimento de prazos para o Opcenter APS [36]. Leia números como esses como um limite superior a partir de casos individuais, e não como um valor esperado, independentemente de qual fornecedor os apresente.

Como transformar promessas em afirmações testáveis:

1. **Peça o cálculo:** Quais valores de linha de base e de meta, em que período, em qual cliente, com qual definição de lead time?
2. **Peça uma chamada de referência** com um usuário do seu setor e tipo de manufatura, de preferência em uma unidade nos EUA, se isso for relevante para você.
3. **Combine um piloto com critérios de saída:** uma cadeia de valor, dados próprios, métricas e metas definidas antecipadamente.
4. **Compare planejado e realizado** no piloto: os cronogramas do Optimizer se sustentam no chão de fábrica? Com que frequência é preciso replanejar?
5. **Avalie o esforço com honestidade:** quanto tempo levou a limpeza dos dados mestres e quanto levou a interface?

Essas etapas de teste se aplicam igualmente a todos os fornecedores da Parte A.

## 18. Para quem o Polaris é adequado e para quem não é

**Com base na descrição de sua função, o Polaris vale a pena considerar se**
- você administra manufatura discreta ou montagem com muitas variantes, BOMs e recursos compartilhados,
- você quer conectar mapeamento do fluxo de valor, simulação e programação em um modelo de dados compartilhado, em vez de mover dados entre ferramentas,
- você quer começar com o mapeamento do fluxo de valor sem integração de sistemas e adicionar programação e execução depois,
- você quer analisar processos de negócio fora da produção (orçamentação, engenharia, processamento de pedidos) com a mesma lógica enxuta (BSM),
- uma solução em nuvem hospedada na UE se encaixa nas suas políticas de TI.

**O Polaris provavelmente é uma opção menos adequada se**
- você documenta mapas do fluxo de valor apenas ocasionalmente; nesse caso, uma ferramenta de desenho com modelo costuma ser suficiente (Seção 3.1),
- você precisa de simulação detalhada 3D de fluxo de materiais com transportadores, robótica ou comissionamento virtual; ferramentas especializadas de simulação são feitas para isso (Seção 3.3),
- você atua em indústrias de processo com receitas e lotes, para as quais o fornecedor não cita referências,
- você exige uma instalação em seu próprio data center ou em uma região de hospedagem nos EUA, nenhuma das quais é descrita nas páginas analisadas,
- você precisa de um relatório SOC 2 como pré-condição, o que as páginas analisadas não mencionam,
- você busca planejamento completo da cadeia de suprimentos ou de múltiplas fábricas, o que as páginas dos módulos não descrevem,
- você já opera um APS e um MES que respondem às suas questões de programação; nesse caso, pese o valor agregado separadamente em relação a uma ferramenta VSM pura,
- você exige preços públicos ou avaliações independentes de analistas antes de qualquer lista de candidatos.

**Alternativas por categoria:** para documentação pura, Visio, Lucidchart ou Miro [27][28][29]; para fluxos de valor com métricas e simulação opcional, eVSM [42], SimVSM [30][31] ou visTable com contexto de layout [32]; para fluxos de valor com simulação, Plant Simulation X com a biblioteca VSM [33]; para reconstrução de fluxos de valor orientada por dados, ONIQ [35]; para APS, por exemplo Opcenter APS [36]. Esta é uma seleção para orientação, não um ranking.

## 19. Perguntas frequentes

### O que é software de mapeamento do fluxo de valor?
Software de mapeamento do fluxo de valor apoia digitalmente o mapeamento do fluxo de valor e o desenho do estado futuro. A gama vai de ferramentas de desenho com símbolos lean, passando por ferramentas dedicadas com cálculo automático de métricas e cenários, até plataformas que incluem simulação e programação da produção (Seção 3).

### Qual é o melhor software de mapeamento do fluxo de valor?
Não existe uma única ferramenta melhor, porque as categorias respondem a perguntas diferentes. Para oficinas e documentação, uma ferramenta de desenho com modelo VSM costuma bastar. Para trabalho regular com fluxos de valor e métricas, uma ferramenta VSM dedicada é adequada. Para variabilidade e mix de produtos, você precisa de simulação, e para prazos de entrega sob restrições, um sistema APS. Use o guia de decisão da Seção 4 e a lista de verificação da Seção 6, e tenha cuidado com rankings escritos por fornecedores ou financiados por eles; as duas páginas de ranking mais longas nos EUA para essa palavra-chave são uma de cada tipo [47][48].

### Existe software gratuito de mapeamento do fluxo de valor?
Sim, em várias categorias. Ferramentas de desenho e quadros brancos como Lucidchart e Miro oferecem níveis gratuitos de entrada com formas ou modelos VSM [28][29]. No iFAKT Polaris, os módulos VSM e BSM estão disponíveis em um nível gratuito sem cartão de crédito, segundo a FAQ [3]; o fornecedor não descreve em detalhes o escopo desse nível. Em qualquer oferta gratuita, verifique limites de usuários, opções de exportação e armazenamento de dados.

### Posso fazer mapeamento do fluxo de valor no Excel ou no Visio?
Sim. Modelos de Excel funcionam para mapas pequenos e cálculos simples, mas cada alteração precisa ser transferida manualmente, e as versões se multiplicam rapidamente (Seção 2). O Microsoft Visio tem um modelo de mapa do fluxo de valor; segundo a Microsoft, ele exige o Visio Professional (ou a edição Premium mais antiga) e não está incluído no Visio Standard [27]. Nem o Excel nem o Visio simulam variabilidade.

### Qual é a diferença entre software de mapeamento do fluxo de valor e software de simulação?
O software de mapeamento do fluxo de valor geralmente calcula de forma estática, com médias: dias de estoque, lead time, razão de valor agregado. O software de simulação modela as operações ao longo do tempo, incluindo variabilidade, paradas, mix de produtos e recursos compartilhados [22][33][37]. Uma comparação lado a lado de dois mapas não é uma simulação.

### Qual é a diferença entre mapeamento de fluxo de valor e mapeamento de processos?
Um mapa de fluxo de valor acompanha uma família de produtos ao longo de todo o fluxo, do fornecedor ao cliente, e mostra o fluxo de materiais, o fluxo de informações, os estoques e uma linha de lead time. Um mapa de processos (como um diagrama de swimlanes ou um modelo BPMN) mostra em detalhe as etapas, os papéis e as decisões de um processo específico. Os dois podem ser combinados: no Polaris, o VSM cobre os fluxos de valor e o BSM cobre os mapas de processos em swimlanes [6][7].

### "Software de gestão de fluxo de valor" é a mesma coisa?
Nem sempre. Na manufatura, gestão de fluxo de valor significa a gestão contínua ao longo dos fluxos de valor (ISO 22468 [39]). No desenvolvimento de software, plataformas de "value stream management" medem o fluxo de itens de trabalho, do ticket até a implantação. Vários listicles dos EUA misturam os dois conceitos [50]. Verifique se a ferramenta trata materiais, estoques e máquinas antes de incluí-la na lista de candidatas.

### O que é o iFAKT Polaris?
Uma plataforma de software modular da iFAKT GmbH (Stuttgart, Alemanha) para otimização da produção, que vai do mapeamento do fluxo de valor à simulação e ao sequenciamento, passando pela execução no chão de fábrica e pelos relatórios. Segundo o fornecedor, ela é composta por sete módulos com um modelo de dados compartilhado: VSM, BSM, Designer, Simulator, Optimizer, Operator e Analyzer [3].

### O que é o Polaris IMS?
Sob o nome Polaris IMS, a iFAKT ficou em segundo lugar na categoria Produção do Best of Technology Award 2025 do semanário de negócios alemão WirtschaftsWoche [18]. A descrição do júri menciona um gêmeo digital da produção, planejamento automatizado de recursos, execução no chão de fábrica com monitoramento em tempo real e propostas de IA quando ocorrem interrupções [18][19]. No site atual, esse escopo está distribuído pelos módulos Designer, Simulator, Optimizer e Operator (Seção 13; o mapeamento é interpretação do autor).

### O Polaris VSM consegue simular?
A página do módulo Polaris VSM descreve cenários, análise de sensibilidade e comparação de métricas, mas não simulação dinâmica [6]. A simulação é oferecida pelo módulo separado Simulator, que trabalha sobre o modelo produto-processo-recurso do Designer [9].

### Quais dados o Polaris precisa, e preciso conectar meu ERP?
Não para VSM e BSM: segundo o fornecedor, não é necessária nenhuma integração de sistemas para começar [3]. A simulação e o sequenciamento precisam de dados de produtos, BOMs, tempos de processo e recursos; para testes, por arquivo, Excel ou exportação do ERP, e em produção, por sincronização contínua com ERP, MES ou outros sistemas [13]. Segundo o FAQ, existem interfaces padrão para SAP e Microsoft Dynamics [3].

### O Polaris é integrado ao Microsoft 365 ou ao Teams?
Estão documentados os listings no AppSource para Polaris VSM e BSM [15][16], uma publicação na Microsoft Tech Community [17] e a hospedagem de VSM e BSM no Microsoft Azure West Europe, segundo as páginas dos módulos [6][7]. A integração com Teams ou Power BI não é mencionada nas páginas analisadas.

### Onde o Polaris é hospedado, e a iFAKT tem SOC 2?
As páginas de VSM e BSM citam o Microsoft Azure West Europe [6][7], uma região localizada na Holanda [43]; o FAQ fala em infraestrutura de nuvem europeia [3]. O site informa certificações ISO 9001 (desde outubro de 2014) e ISO/IEC 27001 pela TÜV SÜD [1][3][4]. Um relatório SOC 2 e uma região de hospedagem nos EUA não são mencionados nas páginas analisadas. Solicite os certificados com o escopo indicado e pergunte diretamente sobre SOC 2 se a sua equipe de segurança exigir.

### Quanto tempo leva a implantação?
Segundo o fornecedor, VSM e BSM não exigem configuração; para simulação e sequenciamento, o FAQ indica um tempo típico de onboarding de duas a quatro semanas, incluindo integração de dados, configuração do modelo e treinamento [3]. A duração real depende principalmente da qualidade dos dados mestres e das interfaces.

### Quanto custa o Polaris?
O fornecedor não publica preços. O listing do BSM no AppSource cita planos de "Read Only" a "Integrate & Customize" sem valores [16]; para Simulator, Optimizer e Operator, o FAQ oferece uma demonstração com teste [3].

### Quais são as alternativas ao Polaris?
Depende da categoria: ferramentas de desenho como Visio, Lucidchart ou Miro para documentação [27][28][29]; ferramentas dedicadas como eVSM, SimVSM ou visTable [42][30][32]; simulação com Plant Simulation, AnyLogic ou FlexSim [33][34]; abordagens orientadas a dados como ONIQ [35]; e sistemas APS como o Opcenter APS [36]. A Seção 4 compara as categorias.

## 20. Conclusão

Se você está escolhendo software de mapeamento de fluxo de valor, não comece pelos nomes dos produtos; comece pela pergunta que o software precisa responder. Documentação, avaliação contínua com métricas, simulação dinâmica, programação sob restrições e análise contínua de dados reais são trabalhos diferentes, executados por categorias de software diferentes. A lista de verificação de seleção da Seção 6 e a lógica de caso de negócio da Seção 9 ajudam a tornar as propostas comparáveis sem depender de números de folhetos. Para compradores dos EUA, inclua logo no início a região de hospedagem, o escopo de SOC 2 ou ISO/IEC 27001 e, quando for o caso, o controle de exportação.

O iFAKT Polaris é uma das plataformas que conectam várias categorias em um modelo de dados compartilhado: análise de fluxo de valor e de processos (VSM, BSM), modelagem produto-processo-recurso (Designer), simulação, programação baseada em restrições (Optimizer), gestão de tarefas no chão de fábrica (Operator) e relatórios (Analyzer). O que pode ser verificado: as descrições de funções nas páginas do fornecedor, duas listagens na AppSource, uma postagem na Microsoft Tech Community, o segundo lugar na categoria Production do Best of Technology Award 2025, a colaboração em pesquisa ECOWERT com o Fraunhofer IPA e uma série de artigos da revista ZWF que abrange doze anos. Não documentados: números de benefícios com metodologia divulgada, simulação no módulo VSM, integração com Teams ou Power BI, uma região de hospedagem nos EUA, um relatório SOC 2 ou preços públicos.

Para fabricantes discretos com muitas variantes que desejam passar do fluxo de valor para a programação, o Polaris é, com base na sua descrição de funções, um candidato a projeto piloto. Para documentação pura, simulação 3D de fluxo de materiais ou indústrias de processo, outras categorias são mais adequadas. Em todos os casos: decida com base em um piloto com seus próprios dados e métricas definidas antecipadamente, não com base neste ou em qualquer outro texto.

## Leitura adicional no m365.fm

**Entidades**
- [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) · [Business Application](https://www.m365.fm/entity/business-application/)
- Módulos: [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) · [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/) · [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) · [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) · [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)
- Pessoas: [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) · [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) · [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Postagens e episódios**
- [Value Stream Management Software for Manufacturing](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)
- [What is Value Stream Management?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/)
- Podcast: [Value Stream Mapping with live data and a data model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Compêndios**
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** é o apresentador do m365.fm e trabalha na iFAKT GmbH. No m365.fm, ele escreve sobre gestão de fluxo de valor, programação da produção e a transformação digital da manufatura no ecossistema Microsoft.

> **Nota: O autor trabalha na iFAKT GmbH.**

*A iFAKT GmbH ([página da entidade](https://www.m365.fm/entity/ifakt/)) é a fornecedora do iFAKT Polaris.*

# Sources

All online sources retrieved on November 20, 2026. Titles of German-language sources are given in the original, with a translation in parentheses where helpful.

1. iFAKT GmbH: Polaris (home page, English). https://www.ifakt.de/en
2. iFAKT GmbH: Polaris (home page, German). https://www.ifakt.de/de
3. iFAKT GmbH: FAQ. https://www.ifakt.de/en/faq
4. iFAKT GmbH: About iFAKT (company page). https://www.ifakt.de/en/company/
5. iFAKT GmbH: Impressum (legal notice): iFAKT GmbH, Curiestr. 2, 70563 Stuttgart; Amtsgericht Stuttgart, HRB 22661. https://www.ifakt.de/de/imprint
6. iFAKT GmbH: Polaris VSM, Value Stream Mapping Software (module page, English and German). https://www.ifakt.de/en/solutions/value-stream-mapping-software · https://www.ifakt.de/de/solutions/value-stream-mapping-software
7. iFAKT GmbH: Polaris BSM, Business Swim Lane Modelling (module page). https://www.ifakt.de/en/solutions/business-swimlane-modelling
8. iFAKT GmbH: Polaris Designer (module page). https://www.ifakt.de/en/solutions/designer
9. iFAKT GmbH: Polaris Simulator (module page). https://www.ifakt.de/en/solutions/simulator
10. iFAKT GmbH: Polaris Optimizer (module page). https://www.ifakt.de/en/solutions/optimizer
11. iFAKT GmbH: Polaris Operator (module page). https://www.ifakt.de/en/solutions/operator
12. iFAKT GmbH: Polaris Analyzer (module page). https://www.ifakt.de/en/solutions/analyzer
13. iFAKT GmbH: Planning & Execution, AI-powered production planning and scheduling (application page). https://www.ifakt.de/en/software/ims/
14. iFAKT GmbH: Polaris VSM, Digital Value Stream Tool in Lean Management (product page). https://www.ifakt.de/en/software/vsm/
15. Microsoft AppSource: Polaris VSM - Digital Value Stream Mapping (iFAKT GmbH). https://appsource.microsoft.com/en-us/product/web-apps/ifaktgmbh.ifakt_vsm_1?tab=Overview
16. Microsoft AppSource: Polaris BSM - Business Swimlane Modeling (iFAKT GmbH). https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1
17. Microsoft Tech Community, Marketplace Blog: Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536
18. WirtschaftsWoche: Best of Technology Award, Gewinner 2025 (winners 2025), category Produktion (Production). https://award.wiwo.de/bot/gewinner-2025/
19. WirtschaftsWoche: Best of Technology Award, Finalisten 2025 (finalists 2025). https://award.wiwo.de/bot/finalisten-2025/
20. LeanBase: Lean Around The Clock 2025, sponsor iFAKT GmbH. https://leanbase.de/latc/sponsors/2025-ifakt
21. Drees, J.; Sack, C.: Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 106 (6), 2011, pp. 466–470. DOI: 10.3139/104.110589. https://www.degruyterbrill.com/document/doi/10.3139/104.110589/html
22. Türck, S.; Weimer, A.; Schubert, L.; Drees, J.: Dynamische Simulation von Wertströmen. ZWF 109 (11), 2014, pp. 839–842. DOI: 10.3139/104.111242. https://www.degruyterbrill.com/document/doi/10.3139/104.111242/html
23. Drees, J.: Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation. ZWF 113 (9), 2018, pp. 605–609. DOI: 10.3139/104.111974. https://www.degruyterbrill.com/document/doi/10.3139/104.111974/html
24. Böhm, M.; Drees, J.; Sai, B.; Erlach, K.; Stambera, S.; Teriete, T. (Fraunhofer IPA, iFAKT GmbH): Universelle Datenschnittstelle für digitale Wertstromdienste. Eventbasierte Wertstromanalyse als einheitliche Datenbasis für individuelle Dienste zur Produktionsoptimierung. ZWF 118 (5), 2023, pp. 293–297. DOI: 10.1515/zwf-2023-1062. https://www.degruyterbrill.com/document/doi/10.1515/zwf-2023-1062/html
25. Fraunhofer IPA: Die Wertstromanalyse wird ins digitale Zeitalter übertragen (value stream analysis is moving into the digital age), press release, July 5, 2022. https://www.ipa.fraunhofer.de/de/presse/presseinformationen/die-wertstromanalyse-wird-ins-digitale-zeitalter-uebertragen.html (an AI-translated English republication exists at reinraum.de: https://www.reinraum.de/en/news/the-value-stream-analysis-is-being-transferred-into-the-digital-age.html)
26. Drees, J.; Stambera, S.; Böhm, M.: Daten für Wertstromanalysen automatisch erfassen (capturing value stream data automatically). IT&Production, January 12, 2023. https://www.it-production.com/industrie-4-0-iot/wertstromanalyse-mit-iiot-anbindung/
27. Microsoft Support: Create a value stream map (Visio). https://support.microsoft.com/en-us/visio/create-a-value-stream-map
28. Lucid Software: Value stream mapping symbols and icons (Lucidchart VSM shape library). https://lucid.co/diagram/vsm/value-stream-mapping-symbols
29. Miro: Value stream mapping templates. https://miro.com/templates/value-stream-map
30. SimPlan AG: SimVSM, Wertstromanalyse und Simulation in einer App (German product page). https://www.simplan.de/software/simvsm/
31. SimPlan AG: Digital value stream mapping and analysis as the key to informed decisions (English). https://www.simplan.de/en/from-paper-to-digital-value-stream/
32. visTable GmbH: Wertstromanalyse Software (German product page). https://www.vistable.com/de/solutions/wertstromanalyse-software/
33. Siemens: Plant Simulation X value stream mapping (VSM library). https://www.siemens.com/en-us/products/tecnomatix/offerings/plant-simulation-x-value-stream-mapping/
34. Wikipedia: List of discrete event simulation software (entries AnyLogic, FlexSim, Plant Simulation). https://en.wikipedia.org/wiki/List_of_discrete_event_simulation_software
35. PwC Store: ONIQ value stream analysis (English). https://store.pwc.de/en/products/oniq-value-stream-analysis
36. Siemens: Opcenter Advanced Planning and Scheduling (APS). https://www.siemens.com/en-us/products/opcenter/advanced-planning-scheduling-aps/
37. ATS Pro / Simio: Wertstromanalyse und Simulation im Vergleich (value stream mapping vs. simulation, German). https://simio-simulation.de/simulation-vs-wertstromanalyse-vsm
38. Microsoft Tech Community (News from Microsoft Norway): Silver and Gold competency partners, guidance on renewal, April 28, 2023. https://techcommunity.microsoft.com/blog/newsfrommicrosoftnorway/silver-and-gold-competency-partners---guidance-on-renewal/3808345
39. ISO 22468:2020 Value stream management (VSM). International Organization for Standardization. https://committee.iso.org/standard/73292.html?browse=ics
40. Erlach, K.: Wertstromdesign. Der Weg zur schlanken Fabrik. 3rd ed., Springer Vieweg, Berlin/Heidelberg 2020, ISBN 978-3-662-58906-9 (bibliographic data taken from the m365.fm Value Stream Mapping compendium).
41. Lean Enterprise Institute: Learning to See, by Mike Rother and John Shook (book page). https://www.lean.org/store/book/learning-to-see/
42. G2: eVSM product listing and reviews (vendor description "a complete lean toolkit to map, model and improve value streams of every type"). https://www.g2.com/products/evsm/reviews
43. Microsoft Learn: List of Azure regions (West Europe: Netherlands). https://learn.microsoft.com/azure/reliability/regions-list
44. NIST: NIST Releases Version 2.0 of Landmark Cybersecurity Framework, February 26, 2024. https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-landmark-cybersecurity-framework
45. AICPA & CIMA: SOC 2 Reporting on an Examination of Controls at a Service Organization Relevant to Security, Availability, Processing Integrity, Confidentiality, or Privacy (guide). https://www.aicpa-cima.com/cpe-learning/publication/soc-2-reporting-on-an-examination-of-controls-at-a-service-organization-relevant-to-security-availability-processing-integrity-confidentiality-or-privacy
46. Wikipedia: Value-stream-mapping software. https://en.wikipedia.org/wiki/Value-stream-mapping_software
47. Lean Transition Solutions (Data Point): 7 Best Value Stream Mapping software for Manufacturing & Operations Teams (2026) (competitor, vendor-written). https://leandatapoint.com/blog/best-value-stream-mapping-software-for-manufacturing
48. Gitnux: Top 10 Best Value Stream Mapping Software of 2026 (competitor, labeled commissioned research). https://gitnux.org/best/value-stream-mapping-software/
49. ClickUp: 10 Value Stream Mapping Software to Improve Processes in 2026 (competitor, vendor-written). https://clickup.com/blog/value-stream-mapping-software/
50. Project-Management.com: Top Value Stream Mapping Tools & Software (competitor). https://project-management.com/value-stream-mapping-tools-software/
51. Lucidchart: Value stream mapping software (competitor, product page). https://www.lucidchart.com/pages/landing/value_stream_mapping
