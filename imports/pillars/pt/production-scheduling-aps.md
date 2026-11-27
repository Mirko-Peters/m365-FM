# SEO metadata

| Field | Value |
|---|---|
| Meta title | Software de Programação da Produção: Guia APS (2026) |
| Meta description | Software de programação da produção e APS explicados: capacidade finita, gargalos, tambor-pulmão-corda, EOQ, estoque de segurança, exemplos e checklist. |
| Slug | `production-scheduling-aps` |

# Software de programação da produção e APS: o guia completo para cronogramas que se sustentam no chão de fábrica

> **Resposta curta:** Softwares de programação da produção com APS (advanced planning and scheduling, ou planejamento e programação avançados) planejam ordens de fabricação considerando, ao mesmo tempo, capacidade finita e disponibilidade de material. A lógica clássica de MRP em um sistema ERP assume capacidade ilimitada e prazos de entrega fixos. Um APS modela máquinas, pessoas, ferramentas, trocas de setup, turnos e gargalos, de modo que a sequência e as datas que ele produz são datas que a sua fábrica consegue de fato cumprir.

É segunda-feira de manhã no controle da produção. A execução do MRP do fim de semana gerou 140 ordens de trabalho com data de início "nesta semana". A célula de usinagem tem quase duas semanas de trabalho pendente, a montagem está esperando peças, e o comercial quer uma data de embarque que ninguém consegue prometer com seriedade. Então o cronograma é refeito: no Excel, no quadro branco, numa conversa no corredor com o supervisor do turno. Até quarta-feira, ele já está desatualizado de novo.

Se isso soa familiar, a causa raramente é falta de disciplina. É a lógica de planejamento. O planejamento de necessidades de materiais (MRP) foi construído para responder a uma única pergunta: *De qual material eu preciso, e quando?* Ele responde apenas de forma aproximada, ou não responde, à segunda pergunta: *A minha fábrica consegue de fato executar este trabalho nesta sequência?* É para essa segunda pergunta que servem a programação detalhada e o APS.

Este guia trata dos fundamentos do planejamento e controle da produção, das fragilidades estruturais do MRP, da física de uma fábrica, de como funcionam os sistemas APS, da teoria das restrições (TOC) com drum-buffer-rope (DBR), dos blocos de construção do lean como heijunka e balanceamento de linha, das fórmulas clássicas de tamanho de lote e estoque de segurança com exemplos numéricos, e de como selecionar e implantar softwares de programação da produção com capacidades de APS. Para uma definição curta, veja a página de entidade da m365.fm [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/).

### Principais conclusões

- **O ERP planeja material; o APS planeja viabilidade.** A lógica de MRP dentro de um ERP, em sua forma básica, assume capacidade ilimitada e prazos de entrega planejados fixos. Um APS programa considerando capacidade finita e disponibilidade de material ao mesmo tempo.
- **O lead time é, em sua maior parte, tempo de espera.** A Lei de Little diz que lead time = trabalho em processo (WIP) ÷ vazão [9]. Reduza o WIP sem deixar o gargalo sem material e os lead times caem.
- **Alta utilização custa tempo.** O tempo de fila cresce com o fator u/(1−u), não linearmente. Com 95% de utilização, a espera é quase cinco vezes maior do que com 80% [10][11].
- **O gargalo define o ritmo.** A teoria das restrições (TOC) e o drum-buffer-rope (DBR) alinham a liberação de ordens e o sequenciamento com a restrição [1][2].
- **As fórmulas clássicas são pontos de partida, não verdades absolutas.** O lote econômico de compra (EOQ) e a fórmula do estoque de segurança se apoiam em premissas simplificadoras. A curva de custo do EOQ é plana, e o tempo de setup costuma ser a alavanca mais importante.
- **Um APS é tão bom quanto os seus dados mestres.** Roteiros, tempos padrão, matrizes de troca e calendários de capacidade determinam a qualidade do cronograma mais do que o algoritmo.

### Por onde começar, por função

| Você é … | Leia primeiro |
|---|---|
| Um planejador ou programador da produção preso a cronogramas irreais do ERP | Seções 3, 4 e 5 (fragilidades do MRP, física da fábrica, como funciona o APS) |
| Do controle da produção, da engenharia de manufatura ou da liderança do chão de fábrica | Seções 7 e 8 (gargalo, DBR, takt, heijunka) |
| Da cadeia de suprimentos, de materiais ou do planejamento de estoques | Seções 9 e 10 (tamanho de lote, estoque de segurança) |
| Responsável pela seleção ou implantação de um APS | Seções 13 a 16 (seleção, dados, roteiro, erros comuns) |
| Gerente de fábrica ou executivo de operações | Resposta curta, Seção 11 (KPIs) e Seção 21 (Conclusão) |

## Índice

1. [Por que os cronogramas do ERP falham no chão de fábrica](#1-por-que-os-cronogramas-do-erp-falham-no-chão-de-fábrica)
2. [Fundamentos: o que cobre o planejamento e controle da produção](#2-fundamentos-o-que-o-planejamento-e-controle-da-produção-abrange)
3. [As fraquezas da lógica clássica de MRP](#3-as-fraquezas-da-lógica-clássica-do-mrp)
4. [Física da fábrica: Lei de Little, curvas de operação e variabilidade](#4-física-da-fábrica-lei-de-little-curvas-operacionais-e-variabilidade)
5. [O que é um sistema APS e como ele calcula](#5-o-que-é-um-sistema-aps-e-como-ele-calcula)
6. [ERP vs. APS vs. MES](#6-erp-vs-aps-vs-mes)
7. [Teoria das restrições, drum-buffer-rope e gestão de buffers](#7-teoria-das-restrições-tambor-pulmão-corda-e-gerenciamento-de-pulmões)
8. [Blocos de construção Lean no sequenciamento: takt, heijunka, balanceamento de linha, pull](#8-blocos-de-construção-lean-no-sequenciamento-takt-heijunka-balanceamento-de-linha-pull)
9. [Dimensionamento de lotes: EOQ, exemplo resolvido e limites](#9-dimensionamento-de-lotes-eoq-exemplo-resolvido-e-limites)
10. [Estoque de segurança: fórmula e exemplo resolvido](#10-estoque-de-segurança-fórmula-e-exemplo-resolvido)
11. [KPIs de planejamento da produção](#11-kpis-de-planejamento-da-produção)
12. [Gêmeo digital e simulação](#12-gêmeo-digital-e-simulação)
13. [Como escolher software de programação da produção: critérios e checklist](#13-como-escolher-software-de-programação-da-produção-critérios-e-checklist)
14. [Requisitos de dados e qualidade dos dados mestres](#14-requisitos-de-dados-e-qualidade-dos-dados-mestres)
15. [Roteiro de implementação de APS](#15-roteiro-de-implementação-do-aps)
16. [Erros comuns e como evitá-los](#16-erros-comuns-e-como-evitá-los)
17. [Evidências: o que estudos e usuários relatam](#17-evidências-o-que-estudos-e-usuários-relatam)
18. [Planejamento baseado em restrições com iFAKT Polaris](#18-planejamento-baseado-em-restrições-com-o-ifakt-polaris)
19. [Glossário](#19-glossário)
20. [FAQ: software de programação da produção e APS](#20-faq-software-de-programação-da-produção-e-aps)
21. [Conclusão](#21-conclusão)

## 1. Por que os cronogramas do ERP falham no chão de fábrica

A maioria dos fabricantes planeja a produção no sistema ERP, e por um bom motivo: é ali que ficam os pedidos de clientes, as estruturas de produto, os roteiros e o estoque. Um sistema de [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) é o sistema de registro para quantidades, valores e datas. A lógica de planejamento da maioria dos sistemas ERP, porém, é construída sobre um método desenvolvido nas décadas de 1960 e 1970 e documentado por Joseph Orlicky em seu texto padrão de 1975: o planejamento das necessidades de materiais (MRP) [24].

Os planejadores reconhecem os sintomas assim que essa lógica atinge seus limites:

- **Centros de trabalho sobrecarregados no papel:** O ERP programa ordens para uma semana em que a capacidade do centro de trabalho já se esgotou.
- **Datas de expedição por intuição:** As datas prometidas se baseiam em prazos padrão, não na carga atual.
- **Programação paralela em Excel:** O cronograma detalhado real vive fora do ERP, em planilhas, em quadros brancos ou na cabeça de supervisores experientes.
- **Ordens urgentes empurram todo o resto:** Cada urgência cria novos atrasos em outro lugar.
- **Estoque alto e ainda assim faltas:** Há material suficiente no chão de fábrica, só que não é o que a montagem precisa naquele momento.
- **Planejadores como bombeiros:** Grande parte da semana vai para reprogramação em vez de planejamento.

A dimensão desse problema aparece em uma pesquisa que a IDC conduziu para o fornecedor de software de planejamento Kinaxis. A IDC entrevistou mais de 1.800 líderes de cadeia de suprimentos em nove países, incluindo EUA e Canadá, em dezembro de 2023; 83% disseram que sua organização não conseguia responder a uma disrupção na cadeia de suprimentos em 24 horas [32]. Entre os 200 respondentes alemães, a revista especializada alemã Logistik Heute informou que 37% dependiam apenas do Excel ou do Excel combinado com ferramentas independentes para o planejamento da cadeia de suprimentos, e 89% não conseguiam responder a disrupções em 24 horas [25]. O estudo é patrocinado por fornecedor e abrange o planejamento da cadeia de suprimentos em geral, não especificamente o sequenciamento no chão de fábrica, e o comunicado publicado não traz um percentual específico para os EUA em relação às planilhas. Ainda assim, ele mostra a escala do problema.

A boa notícia: as causas são bem conhecidas. Elas estão em três áreas que este guia aborda em sequência: a lógica de planejamento (Seção 3), a física de filas e estoques (Seção 4) e a falta de foco no gargalo (Seção 7). Uma versão mais curta do primeiro argumento está no post do m365.fm [Beyond MRP: Why Enterprise Resource Planning Fails at Finite Production Scheduling](https://www.m365.fm/community/u/mirko-p/blog/beyond-mrp-enterprise-resource-planning-finite-scheduling/).

## 2. Fundamentos: o que o planejamento e controle da produção abrange

### 2.1 Definições

**Planejamento e controle da produção (PCP)** abrange todas as tarefas que uma empresa usa para decidir *o quê*, *quanto*, *quando* e *onde* produzir, além de disparar e monitorar a execução. O planejamento cria as metas; o controle executa essas metas no chão de fábrica e reage aos desvios. Na prática norte-americana, o mesmo escopo costuma ser chamado de manufacturing planning and control (MPC). O corpo de conhecimento profissional é mantido pela ASCM, a Association for Supply Chain Management, por meio da certificação APICS CPIM, cujos módulos incluem planejamento de vendas e operações, suprimento interno, estoques e programações detalhadas [33].

Dois termos geram confusão frequente: **planejamento** e **programação**. O planejamento (rough-cut ou planejamento agregado) trabalha com quantidades agregadas, em períodos semanais ou mensais e por grupos de centros de trabalho. A **programação detalhada** decide, para cada operação individual, em qual recurso ela roda, em que sequência e em que momento. Ela trabalha em dias, turnos ou minutos e é o núcleo do que um sistema APS faz. A prática alemã usa o par *Grobplanung* e *Feinplanung* para a mesma distinção; você verá "Feinplanung" na literatura de fornecedores alemães.

### 2.2 Os níveis de planejamento em resumo

A literatura organiza o planejamento de forma hierárquica, do plano longo de vendas e capacidade até a sequência em uma única máquina [7][12]. A tabela resume os níveis. Os horizontes são ordens de grandeza típicas e variam conforme o setor e o tipo de produção.

| Nível | Horizonte típico | Pergunta-chave | Saída | Sistema típico |
|---|---|---|---|---|
| Planejamento de vendas e operações (S&OP) | 12 a 24 meses | O que vamos vender e de que capacidade precisamos? | Plano de vendas e capacidade por família de produtos | ERP, ferramentas de planejamento, Excel |
| Programa-mestre de produção (MPS) | semanas a meses | Quais produtos finais fabricamos, quando e em que quantidade? | Demanda independente, programa de produção | ERP |
| Planejamento das necessidades de materiais (MRP) | semanas | Quais conjuntos, peças e matérias-primas precisamos, e quando? | Demanda dependente, ordens planejadas, requisições de compra | ERP |
| Planejamento das necessidades de capacidade (CRP) | dias a semanas | Quando as operações rodam e há capacidade suficiente? | Datas de marcos, carga de capacidade | ERP (grosseiro), APS (preciso) |
| Programação detalhada | horas a dias, com rolagem para algumas semanas | Qual operação roda em qual recurso, em que sequência? | Programação de recursos, sequência (gráfico de Gantt) | APS, módulo de programação do MES, quadro de programação |
| Controle de atividades de produção / despacho | turno a minuto | Qual ordem é liberada e o que acontece quando algo quebra? | Liberações, confirmações, gatilhos de reprogramação | MES, APS, chão de fábrica |

Hermann Lödding, pesquisador alemão de controle da produção, divide o controle da produção em quatro tarefas: geração de ordens, liberação de ordens, controle de capacidade e sequenciamento [12]. A divisão é útil porque mostra que uma boa programação, por si só, não basta. A decisão de *quando* uma ordem entra na fábrica muitas vezes afeta o WIP e o lead time mais do que a sequência em qualquer máquina isolada.

### 2.3 Modelos de referência: ISA-95, ASCM e o modelo PPC de Aachen

Os fabricantes norte-americanos geralmente se orientam por dois arcabouços. A hierarquia de planejamento ASCM/APICS mostrada na tabela acima (S&OP, MPS, MRP, CRP, programação detalhada, execução) é a linguagem comum de planejadores e profissionais de cadeia de suprimentos [33]. A ANSI/ISA-95 (publicada internacionalmente como IEC 62264) traça a linha entre planejamento empresarial e logística (Nível 4, tipicamente ERP) e gestão de operações de manufatura (Nível 3, tipicamente MES e programação). A Parte 3, ANSI/ISA-95.00.03-2013, descreve os modelos de atividades da gestão de operações de manufatura e define a programação de capacidade finita como um método em que o trabalho é programado para um conjunto de recursos de manufatura de modo que nenhuma capacidade programada exceda a capacidade disponível [31].

Nos países de língua alemã, o modelo de referência predominante é o **Modelo PPC de Aachen** (*Aachener PPS-Modell*), do instituto FIR da RWTH Aachen University. Ele é descrito em várias edições do texto padrão em alemão *Produktionsplanung und -steuerung*; a quarta edição foi editada por Günther Schuh e Volker Stich em 2012 [7]. O modelo agrupa as tarefas de planejamento e controle em três categorias:

- **Tarefas de rede:** projeto estratégico da rede de produção, como decisões sobre locais de instalação e fornecedores.
- **Tarefas centrais:** as tarefas que fazem uma ordem avançar, a saber, planejamento do programa de produção, planejamento das necessidades de produção, planejamento e controle da produção interna e planejamento e controle da aquisição externa.
- **Tarefas transversais:** gestão de pedidos, gestão de estoques e controladoria, que integram e otimizam entre as funções.

O valor dessas três estruturas está na separação clara das tarefas. Elas ajudam a responder qual sistema deve ser responsável por cada função: o ERP normalmente cobre o planejamento de programa e de necessidades, um APS cobre o sequenciamento detalhado da produção interna, e um MES cobre a execução e as confirmações.

### 2.4 Do MRP ao MRP II e ao APS

A história dos sistemas de planejamento explica muitos dos problemas atuais:

1. **Pontos de reposição e fórmulas de tamanho de lote (desde 1913):** Ford Whitman Harris publicou a fórmula do lote econômico em 1913 [17]. Nos países de língua alemã, ela ficou conhecida por meio de Kurt Andler (1929) e ainda é chamada de *fórmula de Andler* por lá [18].
2. **MRP (décadas de 1960 e 1970):** Os computadores tornaram possível explodir a demanda por meio das estruturas de produtos e deslocá-la no tempo pelos prazos de entrega planejados. Orlicky descreveu o método de forma abrangente em 1975 [24].
3. **MRP II (início da década de 1980):** O planejamento dos recursos de manufatura acrescentou o plano-mestre de produção, o planejamento aproximado de capacidade, o planejamento das necessidades de capacidade (CRP) e a ligação com o planejamento financeiro. A verificação de capacidade continuava, porém, sendo uma etapa posterior: primeiro programar, depois exibir a carga [10].
4. **ERP (décadas de 1990):** Os sistemas ERP integraram finanças, vendas, compras e RH. O núcleo de planejamento frequentemente permaneceu como MRP II.
5. **APS (desde a década de 1990):** Os sistemas avançados de planejamento atacam a verificação de capacidade posterior, planejando material e capacidade em conjunto com métodos de otimização. Eles não substituem o ERP; acrescentam um planejamento que respeita a capacidade finita [13].

## 3. As fraquezas da lógica clássica do MRP

A lógica do MRP não está errada. Para decidir qual material é necessário, em que quantidade, ela é indispensável. O problema surge quando sua saída é usada sem verificação como programação de produção. Wallace Hopp e Mark Spearman criticam, em *Factory Physics*, que o modelo básico do MRP assume prazos de entrega fixos que não dependem da carga. No entanto, prazos fixos só seriam possíveis com capacidade ilimitada [10].

### 3.1 Capacidade infinita

O MRP programa cada ordem planejada retrocedendo o prazo de entrega planejado a partir da data de vencimento. Ele não verifica se o centro de trabalho está livre naquele momento. Isso é chamado de **planejamento de capacidade infinita**. O planejamento de necessidades de capacidade (CRP), a jusante, mostra as sobrecargas, mas não as resolve. Essa tarefa fica com o planejador.

**Exemplo prático: a sobrecarga que o MRP não enxerga**

Um centro de usinagem opera em dois turnos, cinco dias por semana, com 8 horas por turno: 80 horas de capacidade por semana. A execução do MRP gera esta carga:

| Semana | Capacidade (h) | Carga do MRP (h) | Diferença (h) | Carga |
|---|---|---|---|---|
| Semana 12 | 80 | 112 | −32 | 140% |
| Semana 13 | 80 | 54 | +26 | 68% |
| Semana 14 | 80 | 96 | −16 | 120% |
| **Total** | **240** | **262** | **−22** | **109%** |

Mesmo que o planejador nivele perfeitamente e antecipe trabalho da semana 12 para a semana 13, restam 22 horas que não podem ser realizadas nas três semanas. Então são planejadas horas extras, terceirização ou uma máquina alternativa, ou pelo menos uma ordem termina com atraso. O ERP, porém, continua mostrando cada ordem com sua data original, e o comercial promete datas de expedição com base nela. Um APS programaria as ordens contra 80 horas por semana e informaria a data de conclusão mais cedo realisticamente possível.

### 3.2 Prazos de entrega planejados fixos

A segunda premissa é um **prazo de entrega planejado fixo** por item ou roteiro, por exemplo "fresamento: 5 dias úteis". Na realidade, o prazo de entrega depende fortemente da carga atual, como mostra a Seção 4. Quando a fábrica está vazia, uma ordem flui em dois dias. Quando está cheia, leva duas semanas. Um valor fixo é, portanto, quase sempre longo demais (resultado: estoque alto, liberação antecipada) ou curto demais (resultado: ordens atrasadas).

O prazo de entrega planejado também costuma conter grande parcela de tempo de movimentação e de fila. Peter Nyhuis e Hans-Peter Wiendahl, da Universidade Leibniz de Hannover, distinguem entre tempo de operação (preparação e processamento) e tempo entre operações (espera antes e depois do processamento, mais transporte) [8]. Em oficinas por encomenda, o tempo entre operações costuma ser a maior parte. Registrar esse tempo de espera nos dados mestres como uma constante fixa o torna permanente.

### 3.3 A síndrome do prazo de entrega

O que acontece quando os planejadores reagem a ordens atrasadas aumentando os prazos de entrega planejados? O efeito é conhecido há décadas como **síndrome do prazo de entrega** e é discutido principalmente no contexto do MRP [23]:

1. As ordens terminam com atraso.
2. Os planejadores aumentam os prazos de entrega planejados para se prevenir.
3. Como consequência, as ordens são liberadas antes.
4. Há mais ordens na fábrica ao mesmo tempo; o WIP aumenta.
5. De acordo com a Lei de Little, com vazão constante, o prazo de entrega real aumenta.
6. As ordens voltam a terminar com atraso, e o ciclo recomeça.

Em 2023, Matthias Thürer, Nuno Fernandes, Stefan Haeussler e Mark Stevenson usaram simulação para testar se o ajuste dinâmico dos prazos de entrega planejados prejudica fábricas de produção sob encomenda. A resposta: sim, mas não da forma que se esperaria. O dano vem principalmente da redução dos prazos planejados em períodos de baixa carga, o que então aumenta a carga em períodos posteriores de alta carga [23]. Na prática: ajustar os prazos de entrega planejados sem controlar a liberação de ordens apenas desloca o problema.

Os remédios são a liberação de ordens baseada em carga ou em gargalo (Seções 7 e 8) e o sequenciamento com capacidade finita, que deriva os prazos de entrega da programação real em vez de prescrevê-los.

### 3.4 Planejamento sequencial

A terceira fraqueza é o **planejamento sequencial**: primeiro o programa, depois o material, depois as datas, depois a capacidade. Cada etapa toma o resultado anterior como fixo. O retorno de informação, como "esta máquina está cheia, então eu movo a necessidade e, com ela, a ordem de compra", não faz parte do desenho. O resultado são planos consistentes em cada etapa, mas inviáveis como um todo.

| Premissa do MRP | Realidade do chão de fábrica | Consequência |
|---|---|---|
| A capacidade é ilimitada | A capacidade é limitada em todos os centros de trabalho | semanas sobrecarregadas, datas irreais |
| Os lead times são fixos | Os lead times dependem da carga | ordens liberadas cedo demais ou tarde demais |
| Os tamanhos de lote são independentes da sequência | Os tempos de setup dependem da variante anterior | capacidade perdida no gargalo |
| As etapas de planejamento ocorrem uma após a outra | Material, capacidade e datas interagem | planos que só funcionam no papel |
| Demanda e estoque são conhecidos com exatidão | As previsões variam e os registros de estoque contêm erros | nervosismo, faltas, folgas de segurança |

## 4. Física da fábrica: Lei de Little, curvas operacionais e variabilidade

Para entender por que os cronogramas falham, você precisa de três relações que valem independentemente do setor ou do software. Hopp e Spearman resumiram-nas sob o nome *Factory Physics* [10].

### 4.1 Lei de Little: WIP, throughput e lead time de ciclo

Em 1961, John D. C. Little demonstrou uma relação que vale para qualquer sistema estável com chegadas e saídas [9]. Em termos de produção:

> **Tempo de ciclo (CT) = trabalho em processo (WIP) ÷ throughput (TH)**

A fórmula vale para médias de longo prazo, independentemente da distribuição dos tempos de processamento ou da regra de sequenciamento. Observação sobre os termos: na Lei de Little, "tempo de ciclo" significa o tempo que uma ordem permanece no sistema (seu tempo de fluxo ou lead time de fabricação), e não o tempo de ciclo da estação, que é comparado com o takt time na Seção 8.

**Exemplo resolvido:** Uma oficina de peças conclui, em média, 40 ordens de trabalho por dia útil. Em média, 600 ordens liberadas e ainda não concluídas estão no chão de fábrica.

- CT = 600 ÷ 40 = **15 dias úteis**

Se a liberação controlada de ordens reduzir o WIP para 320 ordens, mantendo o gargalo totalmente abastecido e o throughput em 40 ordens por dia:

- CT = 320 ÷ 40 = **8 dias úteis**

O lead time caiu quase pela metade sem que uma única máquina funcionasse mais rápido. Por isso o controle de WIP e a liberação de ordens estão entre as alavancas mais eficazes e baratas do planejamento da produção. Para mais informações sobre a métrica, veja a página de entidade [Lead Time](https://www.m365.fm/entity/lead-time/).

**Ressalva importante:** A Lei de Little não diz que toda redução de WIP reduz o lead time sem efeitos colaterais. Se o WIP à frente do gargalo cair a ponto de ele ficar sem material, o throughput também cai. As curvas operacionais descrevem exatamente essa relação.

### 4.2 Curvas operacionais e o modelo de funil

Pesquisadores do Institute of Production Systems and Logistics (IFA) da Universidade Leibniz de Hannover desenvolveram o **modelo de funil**: um centro de trabalho é tratado como um funil, no qual as ordens entram e de onde saem após o processamento. O **diagrama de throughput** derivado mostra WIP, saída e lead time ao longo do tempo [8]. Com base nele, Nyhuis e Wiendahl formularam as **curvas operacionais logísticas**, que mostram como a saída e o lead time de um sistema de trabalho dependem do WIP [8]:

- Com **WIP baixo**, a saída cresce quase linearmente a cada ordem adicionada, e o lead time permanece próximo do tempo puro de operação. Mas o centro de trabalho corre o risco de ficar sem material.
- A partir de um **WIP médio**, a saída se aproxima do máximo. Mais WIP acrescenta quase nada à saída.
- Com **WIP alto**, a saída permanece estável enquanto o lead time continua crescendo em proporção ao WIP. O WIP extra é puro tempo de espera.

Isso leva a uma regra central de planejamento: cada centro de trabalho tem uma faixa de WIP em que a saída é garantida e o lead time ainda é curto. O sequenciamento e a liberação devem buscar manter a fábrica nessa faixa. Hopp e Spearman descrevem um conceito relacionado, o **WIP crítico**: o nível de WIP em que uma linha ideal acabou de atingir o throughput máximo com o tempo de ciclo mínimo [10]. Nyhuis e Wiendahl reúnem explicitamente as duas abordagens e ligam a teoria das curvas operacionais à Lei de Little [8].

### 4.3 Variabilidade e utilização: por que 95% pode ser demais

A terceira lei diz respeito ao tempo de espera em frente a um recurso. John Kingman publicou em 1961 uma aproximação para filas sob tráfego intenso [11]. Hopp e Spearman a utilizam em *Factory Physics* como a **equação VUT** (variabilidade × utilização × tempo) [10]:

> **Tempo médio de fila no recurso ≈ V × U × T**
>
> V = (c_a² + c_e²) ÷ 2 (variabilidade das chegadas e dos tempos de processamento)
> U = u ÷ (1 − u) (fator de utilização, u = utilização entre 0 e 1)
> T = t_e (tempo médio efetivo de processamento)

c_a e c_e são os coeficientes de variação (desvio padrão dividido pela média) dos tempos entre chegadas e dos tempos de processamento. A aproximação se aplica a um único recurso e é mais precisa em alta utilização.

**Exemplo trabalhado:** Uma máquina tem um tempo médio efetivo de processamento de 1 hora por pedido. As chegadas e os tempos de processamento variam moderadamente; ambos os coeficientes de variação são 1, logo V = (1 + 1) ÷ 2 = 1.

| Utilização u | U = u ÷ (1 − u) | Tempo médio de fila (h) | Tempo na máquina incl. processamento (h) |
|---|---|---|---|
| 80% | 4,0 | 4,0 | 5,0 |
| 85% | 5,7 | 5,7 | 6,7 |
| 90% | 9,0 | 9,0 | 10,0 |
| 95% | 19,0 | 19,0 | 20,0 |

Passar de 80% para 95% de utilização acrescenta 15 pontos percentuais de carga, mas multiplica o tempo de fila em quase cinco vezes. Três lições de planejamento decorrem disso:

1. **Utilização total em todos os recursos não é um objetivo sensato.** Programar todos os centros de trabalho a 95% resulta em prazos de entrega longos e altamente variáveis.
2. **Reduzir a variabilidade funciona como acrescentar capacidade.** Reduzir V pela metade, por exemplo por meio de preparações mais estáveis, lotes menores e mais uniformes ou liberação suavizada, reduz o tempo de fila pela metade na mesma utilização.
3. **Alta utilização é desejável no gargalo, mas somente com um colchão.** O gargalo nunca deve ficar sem alimentação. Isso só funciona se houver um colchão dimensionado deliberadamente à frente dele e se os demais recursos tiverem capacidade ociosa (Seção 7).

## 5. O que é um sistema APS e como ele calcula

### 5.1 Definição

**Planejamento e programação avançados (APS, na sigla em inglês)** refere-se a sistemas de software e métodos que planejam e programam ordens de produção considerando, ao mesmo tempo, a disponibilidade de materiais e a capacidade finita. A literatura de cadeia de suprimentos usa uma definição mais ampla: Bernhard Fleischmann, Herbert Meyr e Michael Wagner situam o planejamento avançado em uma matriz de planejamento que vai desde o projeto de rede de longo prazo até a programação de curto prazo, abrangendo compras, produção, distribuição e vendas [13]. No chão de fábrica, "APS" geralmente significa a parte responsável pela programação detalhada e pelo sequenciamento da produção. Muitos produtos listados como "software de programação da produção" em diretórios de software dos EUA cobrem essa camada, seja como produto independente, seja como módulo de um ERP ou MES; outros na mesma lista são planejadores de projetos ou de recursos (Seção 13.1).

A palavra **"avançado"** refere-se a três diferenças em relação à lógica clássica do MRP:

- **Programação com capacidade finita:** Cada recurso tem uma capacidade limitada e dependente do calendário. Uma operação é programada apenas onde o recurso está livre. A ISA-95 define a programação com capacidade finita exatamente nesses termos: nenhuma capacidade programada pode exceder a capacidade disponível [31].
- **Planejamento simultâneo:** Material, capacidade e datas são considerados em conjunto. Se faltar material, a operação é adiada; se a máquina estiver ocupada, a necessidade de material é adiada.
- **Otimização:** Em vez de calcular uma única resposta, o sistema busca, entre muitas soluções viáveis, uma boa solução, idealmente a melhor segundo objetivos definidos.

### 5.2 Programação baseada em restrições: o que um APS modela

Um APS não programa contra "capacidade" como um número único, mas contra uma rede de restrições. Isso se chama **[programação baseada em restrições](https://www.m365.fm/entity/constraint-based-scheduling/)**. Restrições típicas:

| Restrição | Exemplo | Por que importa |
|---|---|---|
| Capacidade de recursos | Máquina A: 2 turnos, de segunda a sexta-feira | base de toda programação detalhada |
| Recursos alternativos | Peça pode rodar na máquina A ou B, 20% mais lenta na B | saída quando um recurso está sobrecarregado |
| Mão de obra e habilidades | Apenas três operadores são certificados na bancada de teste | a mão de obra costuma ser o gargalo real |
| Ferramentas e dispositivos de fixação | Apenas um molde de injeção por variante | duas máquinas não podem rodar a mesma variante ao mesmo tempo |
| Setups dependentes da sequência | Cor clara para escura: 10 min; escura para clara: 45 min | a sequência determina a capacidade disponível |
| Sequência de operações e sobreposição | Montagem só começa após a pintura; transferência em lotes parciais permitida | lead time e sincronização |
| Tempos mínimos e máximos de espera | Adesivo deve curar por 24 h; peça pode ficar no máximo 4 h entre lavagem e revestimento | tempos tecnológicos mínimos e máximos |
| Material e itens comprados | Componentes eletrônicos chegam na quinta-feira | o material limita o início mais cedo possível |
| Zonas e área de piso | Apenas duas seções de fuselagem cabem em uma zona de montagem ao mesmo tempo | típico na montagem de grandes equipamentos e aeroespacial |
| Campanhas e lotes | Forno roda apenas lotes completos na mesma temperatura | agrupamento versus datas de entrega |

Quanto mais dessas restrições se aplicarem, menos confiável será a construção de uma programação manual ou no Excel, e maior o benefício de um APS.

### 5.3 Tamanho do problema: explosão combinatória

Mesmo em uma única máquina, o número de sequências possíveis cresce com o fatorial do número de ordens:

- 4 ordens: 4! = 24 sequências
- 10 ordens: 10! = 3.628.800 sequências
- 15 ordens: 15! = 1.307.674.368.000 sequências, ou cerca de 1,3 trilhão

Em um job shop real, com dezenas de máquinas, centenas de ordens e roteiros de múltiplas etapas, testar todas as opções é inviável. Em 1976, Michael Garey, David Johnson e Ravi Sethi mostraram que minimizar o makespan é NP-completo em um flow shop com três ou mais máquinas e em um job shop com duas ou mais máquinas [14]. Para tais problemas, não se conhece método que garanta encontrar o ótimo para instâncias arbitrariamente grandes em tempo razoável. Por isso os sistemas APS combinam regras, heurísticas e otimização.

### 5.4 Métodos: de regras de despacho à otimização matemática

**Regras de despacho** (regras de prioridade) decidem qual ordem em espera será executada a seguir. São simples, rápidas e transparentes:

| Regra | Lógica | Ponto forte | Ponto fraco |
|---|---|---|---|
| FIFO (primeiro a entrar, primeiro a sair) | primeiro a chegar, primeiro a ser atendido | justa, simples, baixa variância | ignora datas de entrega |
| EDD (menor data de entrega) | menor data de entrega primeiro | em uma máquina, minimiza o atraso máximo | ignora tempos de processamento |
| SPT (menor tempo de processamento) | operação mais curta primeiro | em uma máquina, minimiza o tempo médio de fluxo | ordens longas podem ficar sem execução |
| CR (razão crítica) | tempo restante até a data de entrega ÷ trabalho restante | considera data de entrega e trabalho restante | instável com reprogramações frequentes |
| Folga (slack) | tempo até a data de entrega menos tempo de processamento restante, menor primeiro | boa para ordens de múltiplas etapas | exige tempos restantes confiáveis |
| Otimizada para setup | agrupa ordens da mesma família de setup | economiza tempo de setup no gargalo | pode violar datas de entrega |

Que a EDD minimiza o atraso máximo e a SPT minimiza o tempo médio de fluxo em uma única máquina são resultados clássicos da teoria de programação [29].

**Exemplo resolvido: três regras, quatro ordens, uma máquina**

Quatro ordens aguardam em uma máquina no tempo 0, na ordem de chegada A, B, C, D. Tempos em horas:

| Ordem | Tempo de processamento | Entrega |
|---|---|---|
| A | 4 | 6 |
| B | 2 | 4 |
| C | 6 | 14 |
| D | 3 | 9 |

| Regra | Sequência | Tempos de conclusão | Atraso | Ordens atrasadas | Atraso total | Tempo médio de fluxo |
|---|---|---|---|---|---|---|
| FIFO | A, B, C, D | A 4, B 6, C 12, D 15 | B 2, D 6 | 2 | 8 h | (4+6+12+15)÷4 = 9,25 h |
| SPT | B, D, A, C | B 2, D 5, A 9, C 15 | A 3, C 1 | 2 | 4 h | (2+5+9+15)÷4 = 7,75 h |
| EDD | B, A, D, C | B 2, A 6, D 9, C 15 | C 1 | 1 | 1 h | (2+6+9+15)÷4 = 8,00 h |

Mesma máquina, mesmo trabalho, mesma capacidade: somente a sequência define se uma ou duas ordens ficam atrasadas e se o atraso total é de 1 ou 8 horas. A SPT dá o menor tempo médio de fluxo, a EDD o melhor desempenho em datas de entrega. Qual regra é "a certa" depende do objetivo. Em um chão de fábrica com múltiplas etapas e setups dependentes da sequência, nenhuma regra isolada basta, e é aí que um APS começa a compensar.

**Heurísticas** entregam rapidamente boas soluções, mas não garantidamente ótimas. Incluem métodos construtivos, que montam um cronograma ordem por ordem (por exemplo, gargalo primeiro: carregar o gargalo e alinhar os demais recursos a ele), e métodos de melhoria, que alteram um cronograma existente passo a passo.

**Metaheurísticas**, como algoritmos genéticos, recozimento simulado (simulated annealing) ou busca tabu, exploram o espaço de soluções de forma sistemática e conseguem escapar de ótimos locais. São comuns em sistemas APS comerciais para otimização de sequenciamento.

**Otimização matemática** formula o problema de programação como um modelo com função objetivo e restrições, por exemplo como um programa linear inteiro misto (MILP) ou um modelo de programação por restrições (CP). Os solvers encontram soluções ótimas para problemas pequenos e médios ou, no mínimo, fornecem um limite de quão distante a solução encontrada pode estar do ótimo. Problemas grandes e detalhados de programação costumam ser decompostos, por exemplo por janela de tempo ou por grupo de recursos.

A **inteligência artificial** desempenha vários papéis nos sistemas APS: prever tempos de processamento e de setup a partir de dados reais, prever perturbações, aprender políticas de programação (por exemplo, com aprendizado por reforço) e interação em linguagem natural. Fornecedores confiáveis a utilizam para melhorar os dados de entrada e acelerar a busca, e não para substituir a otimização. A programação assistida por IA só é tão boa quanto os dados de confirmação do chão de fábrica a partir dos quais ela aprende.

### 5.5 Objetivos e trade-offs

Um APS nunca otimiza "o cronograma"; ele otimiza uma combinação ponderada de objetivos. Objetivos típicos:

- entrega no prazo (minimizar atraso ou atraso ponderado)
- lead times curtos e baixo WIP
- alta utilização do gargalo
- baixo tempo de setup
- pouca hora extra e carga de trabalho equilibrada para as pessoas
- estabilidade do cronograma (poucas mudanças em relação ao cronograma anterior)

Esses objetivos entram em conflito. A literatura empresarial alemã chama o núcleo desse conflito de "dilema da programação" (*Dilemma der Ablaufplanung*): alta utilização exige filas, lead times curtos exigem capacidade ociosa. A Seção 4.3 mostra por que isso é matematicamente assim. Uma das tarefas mais importantes em uma implantação de APS é, portanto, acordar a ponderação dos objetivos com vendas, produção e logística.

### 5.6 Direção de programação, ATP e CTP

A pergunta "quais são os tipos de programação da produção?" normalmente se resume a dois pares: capacidade finita versus capacidade infinita (Seção 3.1) e a direção da programação:

- **Programação para frente (forward scheduling):** As operações são programadas a partir do início mais cedo possível. O resultado é a data de conclusão mais cedo possível.
- **Programação para trás (backward scheduling):** As operações são programadas de trás para frente a partir da data de entrega. O resultado é o início mais tarde possível, o que economiza estoque, mas não deixa folga.
- **Programação baseada no gargalo (bottleneck-based scheduling):** O gargalo é carregado primeiro; as operações a montante são então programadas para trás e as operações a jusante para frente.

Duas funções são especialmente valiosas para vendas:

- **Available to promise (ATP):** Qual quantidade pode ser prometida até qual data, a partir do estoque e dos recebimentos planejados?
- **Capable to promise (CTP):** Qual data é alcançável para um novo pedido, considerando material *e* capacidade?

O CTP é uma função típica do APS porque testa o agendamento de um novo pedido contra a carga atual. Ele transforma as promessas de data de embarque de uma estimativa em um cálculo.

## 6. ERP vs. APS vs. MES

Os três tipos de sistema não competem entre si; eles se complementam. A ANSI/ISA-95 posiciona o ERP no Nível 4 (planejamento empresarial e logística) e o gerenciamento de operações de manufatura no Nível 3; os modelos de atividades da Parte 3 cobrem o cronograma de trabalho (chamado de "programação detalhada da produção" na edição de 2005) e sua execução [31]. A diretriz alemã VDI 5600 Parte 1 (outubro de 2016), amplamente usada na Europa, vai além e lista explicitamente "planejamento detalhado e controle detalhado" como uma das dez tarefas de um sistema de execução da manufatura, ao lado de gestão de pedidos, gestão de equipamentos, gestão de materiais, gestão de pessoal, aquisição de dados, análise de desempenho, gestão da qualidade, gestão da informação e gestão de energia [15]. Na prática, o sequenciamento detalhado é entregue no MES, em um APS independente ou em um módulo APS do ERP.

| Característica | ERP (módulo de planejamento) | APS | MES |
|---|---|---|---|
| Função principal | quantidades, valores, materiais, datas de marcos | datas e sequências viáveis sob restrições | execução, apontamento, visibilidade em tempo real |
| Horizonte de planejamento | semanas a meses | horas a semanas, em regime de rolagem | turno a minuto |
| Modelo de capacidade | infinita em sua forma básica, exibição de carga a jusante | finita, muitos recursos simultaneamente | mede a capacidade efetivamente utilizada |
| Granularidade de tempo | dias, semanas | minutos a horas | segundos a minutos |
| Lógica de planejamento | MRP, sequenciamento regressivo com prazos fixos | heurísticas, metaheurísticas, otimização matemática | regras de liberação e despacho, por vezes seu próprio sequenciador |
| Pergunta típica | O que deve ser feito até quando, qual material está faltando? | Qual operação roda, quando, em qual recurso? | O que está rodando agora, qual o avanço de cada ordem, por que a máquina parou? |
| Dados | dados mestres, pedidos de clientes e ordens planejadas | dados do ERP mais matrizes de troca de ferramental, calendários, restrições, apontamentos | dados de máquinas, produção e qualidade |
| Resposta a perturbações | próxima rodada de planejamento, frequentemente durante a noite | replanejamento em minutos, comparação de cenários | captura, alarme, gatilho de replanejamento |
| Usuários | planejamento de materiais, compras, vendas, finanças | planejamento da produção, controle da produção, cadeia de suprimentos | supervisores, operadores, manutenção, qualidade |
| Limitação | planeja com base em premissas, não na realidade | exige bons dados mestres e apontamentos | frequentemente planeja apenas no curto prazo e localmente |

**Como os sistemas trabalham juntos:** O ERP transmite pedidos, listas de materiais, roteiros e estoques ao APS. O APS programa com base em capacidade finita e devolve datas e sequências realistas, que o ERP utiliza para datas de expedição e necessidades de materiais. O MES executa a sequência no chão de fábrica e reporta ao APS e ao ERP os tempos reais, as quantidades e as perturbações. Somente esse ciclo fechado torna um cronograma confiável. Como o caminho do ERP até o chão de fábrica pode ser fechado com um gêmeo digital é descrito na postagem [From ERP to Shop Floor: Why Production Plans Need a Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/).

**Quando o ERP é suficiente?** Se seus pedidos têm poucas operações, os tempos de troca quase não dependem da sequência, um gargalo claramente visível pode ser operado com uma regra de liberação simples e a capacidade raramente está apertada, um plano de ERP bem mantido somado a um quadro de programação costuma ser suficiente. Quanto mais restrições da Seção 5.2 se aplicarem, mais clara será a justificativa para um APS.

## 7. Teoria das restrições, tambor-pulmão-corda e gerenciamento de pulmões

### 7.1 Teoria das restrições

Eliyahu M. Goldratt apresentou a **[teoria das restrições](https://www.m365.fm/entity/theory-of-constraints/)** (TOC) em 1984 no romance de negócios *The Goal*, escrito em coautoria com Jeff Cox [1]. A mensagem central: todo sistema tem pelo menos uma restrição que limita sua vazão. Uma hora perdida no gargalo é uma hora perdida para todo o sistema. Uma hora economizada em um recurso que não é gargalo não tem valor, desde que não alivie o gargalo.

Goldratt formulou cinco passos de foco, conhecidos como processo de melhoria contínua (POOGI) [3]:

1. **Identificar** a restrição do sistema.
2. **Explorar** a restrição: sem tempo ocioso, sem processamento de refugo, preparações fora do tempo do gargalo sempre que possível.
3. **Subordinar** todo o restante à restrição: a liberação, os tamanhos de lote e as sequências dos demais recursos seguem o gargalo.
4. **Elevar** a restrição: só então acrescentar turnos, investir ou terceirizar.
5. **Evitar a inércia:** se a restrição tiver se deslocado, voltar ao passo 1.

A ordem importa. Muitas empresas pulam diretamente para o passo 4 e compram uma nova máquina, embora o gargalo existente ainda perca capacidade por tempo ocioso, espera por material, sequências ruins ou preparações desnecessárias.

### 7.2 Encontrar o gargalo: análise de gargalo na prática

O gargalo nem sempre é a máquina com mais quebras ou com o maior preço. Indicadores comprovados:

- **Filas:** Pedidos se acumulam permanentemente diante do gargalo, enquanto os recursos posteriores ficam ociosos.
- **Carga versus capacidade:** Para cada recurso, comparar a carga planejada (incluindo tempos de preparação) com a capacidade disponível ao longo de várias semanas. O recurso com a maior razão é o candidato.
- **Diagramas de vazão:** Onde o WIP permanece alto e a curva de produção ainda não fica mais inclinada, há um gargalo de capacidade [8].
- **Perguntar aos especialistas e depois verificar:** Os supervisores geralmente sabem onde as coisas travam. Confirme com dados, porque gargalos "percebidos" costumam ser recursos com muitas quebras visíveis.

Atenção aos **gargalos móveis**. Com um mix de produtos variável, o gargalo pode migrar entre recursos de uma semana para outra. O controle estático do gargalo não basta nesse caso, e um APS que calcula a carga futura por recurso para a carteira de pedidos atual torna-se especialmente valioso. Gargalos também nem sempre são máquinas: frequentemente são pessoas qualificadas, estações de inspeção, ferramentas ou o próprio departamento de planejamento.

### 7.3 Tambor-pulmão-corda

Em *The Race* (1986), Goldratt e Robert E. Fox descreveram um método de controle que traduz os cinco passos para o controle do chão de fábrica: **tambor-pulmão-corda** (DBR) [2]. A metáfora vem de *The Goal*, em que um grupo de escoteiros só consegue caminhar tão rápido quanto seu membro mais lento:

- **Tambor:** O gargalo define o ritmo. Sua programação é a única programação detalhada que precisa ser cumprida.
- **Pulmão:** Um **pulmão de tempo** fica à frente do gargalo (e à frente dos pontos de expedição e montagem onde as peças do gargalo se encontram com outras peças). Ele protege o gargalo da variabilidade a montante.
- **Corda:** O material é liberado para a fábrica apenas na velocidade em que o gargalo consegue processá-lo. A corda vincula a liberação à programação do gargalo, deslocada pelo tempo do pulmão.

**Exemplo prático de liberação DBR:** O gargalo é uma operação de tratamento térmico. A ordem 4711 está programada para começar ali na quinta-feira às 6:00. O pulmão de tempo à frente do gargalo é de 3 dias úteis. Assim, o material da ordem 4711 é liberado na segunda-feira às 6:00, e não antes. Liberar antes apenas aumenta o WIP e, pela Lei de Little, o lead time, sem acrescentar vazão.

O pulmão de tempo é definido de forma pragmática no início. Um valor inicial frequentemente citado na prática da TOC é cerca de metade do lead time atual até o gargalo [unverified: valor inicial citado na prática da TOC, sem fonte primária verificada]. Ele é então ajustado por meio do gerenciamento de pulmões.

### 7.4 Gerenciamento de pulmões

O **[gerenciamento de pulmões](https://www.m365.fm/entity/buffer-management/)** é o mecanismo de realimentação do DBR [4]. Para cada ordem liberada, acompanha-se quanto do seu pulmão de tempo já foi consumido. Uma divisão em três zonas é comum:

| Zona | Pulmão consumido | Significado | Resposta |
|---|---|---|---|
| Verde | até cerca de um terço | ordem dentro do prazo | nenhuma ação |
| Amarela | cerca de um a dois terços | ordem começando a apertar | identificar a causa, preparar ação |
| Vermelha | mais de dois terços | o gargalo pode ficar sem material ou a data de entrega está em risco | acelerar: priorizar a ordem, remover o obstáculo |

A divisão em terços é uma convenção difundida, não uma lei da natureza. Dois benefícios são os mais importantes:

1. **Prioridades do dia a dia:** Em vez de muitas listas de prioridades conflitantes, existe uma única regra: pedidos vermelhos primeiro, depois amarelos e, por fim, verdes.
2. **Melhoria sistemática:** Registrar e analisar as causas dos pedidos vermelhos gera uma lista de Pareto das fontes de perturbação. Se muitos pedidos estão sempre em vermelho, o buffer é pequeno demais ou o processo é instável demais. Se quase todos estão em verde, o buffer pode ser reduzido, o que diminui o WIP e o lead time.

A variante **DBR simplificado** (S-DBR), voltada a fabricantes sob encomenda, dispensa um cronograma detalhado do gargalo e trabalha com um buffer de expedição mais uma verificação de carga do gargalo no momento da aceitação do pedido. Ela é descrita no *Theory of Constraints Handbook*, ao lado do DBR clássico [4].

### 7.5 DBR e APS: opostos ou complementares?

Os praticantes da TOC foram, por muito tempo, céticos em relação ao software complexo de planejamento, pois um cronograma detalhado de cada recurso fica desatualizado rapidamente quando surgem perturbações. Os sistemas APS modernos, porém, conseguem modelar bem os princípios do DBR: o sequenciamento baseado no gargalo, a liberação com buffer de tempo e a exibição do status do buffer são configuráveis em muitos sistemas. Por outro lado, o DBR se beneficia de um APS quando o gargalo muda, quando as sequências de setup no gargalo precisam ser otimizadas ou quando muitas restrições se aplicam ao mesmo tempo. A postura sensata: o DBR fornece a filosofia de controle, e o APS fornece a capacidade de cálculo.

## 8. Blocos de construção Lean no sequenciamento: takt, heijunka, balanceamento de linha, pull

Produção Lean e APS costumam ser apresentados como opostos: de um lado, pull e controle visual; do outro, planejamento centralizado por algoritmo. Na prática, eles se complementam. O Lean estabiliza o fluxo e reduz a variabilidade; o APS planeja onde o fluxo sozinho não basta, por exemplo com alta variedade de produtos, lead times longos ou recursos compartilhados. Para o lado Lean em profundidade, veja o guia do m365.fm [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/).

### 8.1 Tempo takt

O **[tempo takt](https://www.m365.fm/entity/takt-time/)** é o intervalo em que uma unidade precisa ser concluída para atender à demanda do cliente:

> **Tempo takt = tempo de trabalho disponível por período ÷ demanda do cliente por período**

**Exemplo resolvido:** Uma linha de montagem opera em dois turnos de 7,5 horas líquidas de trabalho cada (após as pausas planejadas), totalizando 900 minutos por dia. A demanda do cliente é de 450 unidades por dia.

- Tempo takt = 900 min ÷ 450 unidades = **2,0 minutos por unidade** (120 segundos)

O tempo takt é uma taxa de demanda, não uma medida de desempenho. O tempo de ciclo real de cada estação precisa ficar abaixo dele para que a demanda seja atendida.

### 8.2 Balanceamento de linha

O **[balanceamento de linha](https://www.m365.fm/entity/line-balancing/)** distribui o conteúdo de trabalho entre as estações de modo que cada uma fique abaixo do tempo takt, com o mínimo possível de tempo ocioso. Nils Boysen, Malte Fliedner e Armin Scholl classificaram sistematicamente as muitas variantes do problema [22].

**Exemplo resolvido (continuação):** O conteúdo total de trabalho por unidade é de 9,6 minutos.

- Número mínimo teórico de estações = 9,6 min ÷ 2,0 min = 4,8, arredondado para cima: **5 estações**
- Por causa do grafo de precedências e dos elementos de trabalho indivisíveis, na prática são necessárias **6 estações**.
- Eficiência de balanceamento = 9,6 min ÷ (6 × 2,0 min) = 9,6 ÷ 12,0 = **80%**
- Atraso de balanceamento = 100% − 80% = **20%** da capacidade da linha

Para o sequenciamento, isso significa: com 6 estações a linha cobre 450 unidades por dia, mas cada estação espera, em média, 20% do tempo. Se a demanda subir, a linha precisa ser rebalanceada ou o tempo de trabalho precisa ser estendido.

### 8.3 Heijunka

O **[heijunka](https://www.m365.fm/entity/heijunka/)** (do japonês, nivelamento) é um princípio central do Sistema Toyota de Produção, descrito por Taiichi Ohno [20]. O Lean Enterprise Institute o define como o nivelamento do tipo e da quantidade de produção ao longo de um período fixo de tempo [34]. Em vez de produzir grandes lotes de uma variante após outra, o mix é distribuído uniformemente ao longo do tempo.

**Exemplo:** Uma fábrica produz por semana 200 unidades da variante A, 100 da variante B e 100 da variante C, ao longo de cinco dias.

| Abordagem | Segunda | Terça | Quarta | Quinta | Sexta |
|---|---|---|---|---|---|
| Lote a lote | 80 A | 80 A | 40 A, 40 B | 60 B, 20 C | 80 C |
| Nivelado (heijunka) | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C | 40 A, 20 B, 20 C |

No plano nivelado, a carga de pico nos processos a montante diminui, o estoque de produtos acabados por variante se reduz e os clientes de todas as variantes podem ser atendidos diariamente. O preço é a maior frequência de trocas de ferramental. Heijunka, portanto, exige tempos de setup curtos, e é aqui que o lean e o APS se encontram: um APS pode calcular, dentro de um dia, a sequência mais favorável a setups para um mix nivelado.

### 8.4 Kanban, pull e CONWIP

Um **[sistema pull](https://www.m365.fm/entity/pull-system/)** limita o WIP, iniciando novo trabalho somente quando um consumidor a jusante sinaliza demanda. A forma mais conhecida é o **[kanban](https://www.m365.fm/entity/kanban/)**: cartões ou sinais eletrônicos entre processos disparam a reposição, e o número de cartões limita o estoque.

O kanban é adequado para itens com demanda regular e um número administrável de variantes. Em job shops e na produção de alto mix e baixo volume, ele atinge seus limites, porque cada variante precisaria de estoque. Uma alternativa é o **CONWIP** (constant work in process, trabalho em processo constante), proposto em 1990 por Mark Spearman, David Woodruff e Wallace Hopp como alternativa pull ao kanban [21]. O CONWIP não limita o estoque por item, mas sim o número total de ordens em uma linha: uma nova ordem só é liberada quando outra termina. A Lei de Little se torna uma regra de controle. Um método relacionado do IFA em Hannover é a **liberação de ordens orientada à carga** (*belastungsorientierte Auftragsfreigabe*), que libera ordens somente enquanto a carga de trabalho à frente de um centro de trabalho permanecer abaixo de um limite de carga; Lödding a descreve junto com o CONWIP e o controle de gargalo como métodos de liberação de ordens [12]. Na pesquisa em língua inglesa, essa família de métodos costuma ser discutida sob o título de controle de carga de trabalho (workload control).

**O que isso significa para o sequenciamento:** Kanban e CONWIP decidem *quando* liberar e limitam o WIP. Um APS decide *o que* produzir, em qual sequência, e se os prazos são alcançáveis. Muitas fábricas usam ambos: itens padronizados rodam em um circuito kanban, enquanto pedidos específicos de clientes são sequenciados no APS e liberados sob um limite de WIP.

## 9. Dimensionamento de lotes: EOQ, exemplo resolvido e limites

### 9.1 O problema básico

Todo lote carrega custos fixos de setup, de tratamento de pedidos e de arranque, independentemente da quantidade. Lotes grandes diluem esses custos por muitas unidades, mas elevam o estoque e o capital imobilizado. Lotes pequenos reduzem o estoque, mas implicam setups mais frequentes. O **[tamanho de lote](https://www.m365.fm/entity/batch-size/)** é, portanto, um clássico trade-off.

### 9.2 A fórmula clássica: Harris (EOQ) e Andler

Ford Whitman Harris publicou a fórmula da raiz quadrada para o tamanho econômico de lote em 1913, na revista *Factory, The Magazine of Management*. Hoje ela é conhecida como lote econômico de compra (economic order quantity, EOQ); Donald Erlenkotter rastreou sua autoria em 1990 [17]. Quando a fórmula é usada para lotes de produção em vez de pedidos de compra, os textos norte-americanos costumam chamá-la de lote econômico de produção (economic production ou economic lot size). Nos países de língua alemã, é conhecida como **fórmula de Andler**, em referência ao livro de Kurt Andler de 1929 [18]:

> **Q* = √(2 × D × S ÷ H)**
>
> Q* = tamanho ótimo de lote (unidades)
> D = demanda por período (unidades por ano)
> S = custo fixo por lote, ou seja, custo de setup e de pedido (US$ por lote)
> H = custo de manutenção por unidade e por período (US$ por unidade por ano), frequentemente calculado como custo unitário × taxa de custo de manutenção

A fórmula minimiza a soma dos custos de setup (D ÷ Q × S) e dos custos de manutenção (Q ÷ 2 × H). No ótimo, as duas componentes de custo são iguais.

### 9.3 Exemplo resolvido

Uma peça torneada (torno) tem demanda anual de 12.000 unidades. Um setup custa US$ 300, incluindo o tempo de máquina e de mão de obra. O custo unitário é de US$ 40, e a taxa de custo de manutenção é de 20% ao ano. (O original em alemão usa os mesmos valores em euros; os números são ilustrativos, não convertidos.)

- H = US$ 40 × 0,20 = US$ 8 por unidade por ano
- Q* = √(2 × 12.000 × 300 ÷ 8) = √(7.200.000 ÷ 8) = √900.000 ≈ **949 unidades**
- Lotes por ano = 12.000 ÷ 949 ≈ 12,6
- Custo de setup por ano = 12.000 ÷ 949 × US$ 300 ≈ US$ 3.793
- Custo de manutenção por ano = 949 ÷ 2 × US$ 8 = US$ 3.796
- **Custo total ≈ US$ 7.589** por ano

Qual é a sensibilidade do custo a desvios em relação a Q*?

| Tamanho do lote | Custo de setup (US$/ano) | Custo de manutenção (US$/ano) | Custo total (US$/ano) | Desvio em relação ao ótimo |
|---|---|---|---|---|
| 500 | 7.200 | 2.000 | 9.200 | +21,2% |
| 600 | 6.000 | 2.400 | 8.400 | +10,7% |
| 949 | 3.793 | 3.796 | 7.589 | 0% |
| 1.200 | 3.000 | 4.800 | 7.800 | +2,8% |
| 2.000 | 1.800 | 8.000 | 9.800 | +29,1% |

O custo total na região do ótimo é plano: um tamanho de lote cerca de um quarto maior custa menos de 3% a mais. Na prática, é possível arredondar os tamanhos de lote para valores práticos, como quantidades de contêiner ou demanda diária, sem uma penalidade de custo relevante.

**A redução do tempo de setup é a alavanca mais importante:** Se a redução do setup reduzir à metade o custo de setup, de US$ 300 para US$ 150, o tamanho de lote ótimo cai para √(2 × 12.000 × 150 ÷ 8) ≈ **671 unidades**. O custo total cai para cerca de US$ 5.367 por ano, ou aproximadamente 29% a menos, porque o custo total no ótimo é proporcional à raiz quadrada de S. O estoque médio de ciclo também cai cerca de 29%. Métodos de redução de setup, como o SMED (troca de ferramenta em minutos de um único dígito), portanto, compensam duas vezes. Mais detalhes na página da entidade [Setup Time](https://www.m365.fm/entity/setup-time/).

### 9.4 Limites da fórmula do EOQ

A fórmula é um ponto de partida útil, mas suas premissas quase nunca são atendidas no chão de fábrica:

- **Demanda constante e conhecida:** A demanda real flutua e é incerta.
- **Capacidade ilimitada:** A fórmula ignora que os setups consomem capacidade no gargalo. Em um gargalo, uma hora de setup é uma hora de throughput perdido; em um não gargalo, custa quase nada. A TOC conclui que os lotes devem tender a ser maiores no gargalo e menores nos não gargalos.
- **Produto único, sem interações:** Vários produtos compartilham máquinas; setups dependentes da sequência não são modelados.
- **Produção instantânea:** Na forma básica, o lote inteiro está disponível de uma só vez. Para uma taxa de produção finita, existe uma fórmula estendida (quantidade econômica de produção), na qual os custos de manutenção são ponderados pelo fator (1 − taxa de demanda ÷ taxa de produção).
- **Nenhum efeito sobre o lead time:** Lotes grandes alongam o lead time de todas as ordens seguintes na mesma máquina e aumentam a variabilidade. Esse efeito não aparece no cálculo de custos.
- **Taxas de custo difíceis de determinar:** O custo de setup e a taxa de custo de manutenção de estoque são, com frequência, valores imputados com ampla margem de discricionariedade.

Para demanda dinâmica existem métodos como o algoritmo de Wagner-Whitin e heurísticas como o balanceamento de períodos-parte e o Silver-Meal. Um APS vai um passo além: decide tamanhos de lote e sequência em conjunto, considerando capacidade, matrizes de troca e datas de entrega.

## 10. Estoque de segurança: fórmula e exemplo resolvido

### 10.1 Para que serve o estoque de segurança

O **[estoque de segurança](https://www.m365.fm/entity/safety-stock/)** protege contra duas incertezas: a variação da demanda durante o lead time de reposição e a variação do próprio lead time. Ele não é uma solução para um planejamento deficiente, mas um seguro deliberadamente pago contra a aleatoriedade.

### 10.2 Fórmula para demanda variável

Se a demanda diária for aproximadamente normalmente distribuída e o lead time de reposição for constante [19]:

> **SS = z × σ_D × √L**
>
> SS = estoque de segurança (unidades)
> z = fator de segurança da distribuição normal padrão para o nível de serviço desejado
> σ_D = desvio padrão da demanda diária (unidades)
> L = lead time de reposição (dias)

O nível de serviço usado aqui é o **nível de serviço de ciclo** (probabilidade de não haver ruptura durante um ciclo de reposição, chamado de nível de serviço α nos textos em alemão). Ele não é o mesmo que a **taxa de atendimento** (fração da quantidade demandada entregue imediatamente a partir do estoque, o nível de serviço β). Confundi-los leva a um dimensionamento sistematicamente incorreto do estoque.

**Exemplo resolvido:** Uma peça comprada é consumida em média a 100 unidades por dia; o desvio padrão é de 30 unidades por dia. O lead time de reposição é de 9 dias úteis.

| Nível de serviço de ciclo | z | Cálculo | Estoque de segurança |
|---|---|---|---|
| 90% | 1,282 | 1,282 × 30 × √9 = 1,282 × 30 × 3 | ≈ 115 unidades |
| 95% | 1,645 | 1,645 × 30 × 3 | ≈ 148 unidades |
| 99% | 2,326 | 2,326 × 30 × 3 | ≈ 209 unidades |

Passar de 95% para 99% custa mais de 40% a mais de estoque de segurança. Níveis de serviço altos ficam desproporcionalmente caros.

### 10.3 Fórmula para demanda variável e lead time variável

Se o lead time também variar, a fórmula é estendida [19]:

> **SS = z × √(L × σ_D² + d² × σ_L²)**
>
> d = demanda diária média, σ_L = desvio padrão do lead time (dias)

**Exemplo resolvido (continuação):** O fornecedor entrega em 9 dias em média, mas com desvio padrão de 2 dias.

- L × σ_D² = 9 × 30² = 8.100
- d² × σ_L² = 100² × 2² = 40.000
- √(8.100 + 40.000) = √48.100 ≈ 219,3
- SS (95%) = 1,645 × 219,3 ≈ **361 unidades**

Os estoques de segurança sobem de 148 para 361 unidades, quase duas vezes e meia, unicamente por causa do lead time pouco confiável. A variação do lead time responde por cerca de 83% da variância aqui. Melhorar a pontualidade de entrega do fornecedor frequentemente reduz o estoque mais do que qualquer melhoria na previsão.

### 10.4 Limites da fórmula

- A distribuição normal se ajusta mal à demanda intermitente (muitos períodos sem consumo). Outras distribuições ou simulação são mais adequadas nesses casos.
- A fórmula pressupõe demanda independente. Para itens com demanda dependente de estruturas de produto (BOM), o estoque de segurança normalmente não é a ferramenta certa; lead time de segurança ou buffers em pontos-alvo funcionam melhor.
- Estoque de segurança que é consumido constantemente não é estoque de segurança, mas um erro de planejamento. Verifique regularmente com que frequência e por que ele é violado.

## 11. KPIs de planejamento da produção

Sem KPIs, não é possível comprovar o valor de um APS nem melhorar o planejamento. Defina cada KPI de forma inequívoca antes da implantação e meça uma linha de base. Um guia separado do m365.fm sobre [KPIs de manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/) cobre o conjunto mais amplo.

| KPI | Fórmula | O que informa | Armadilhas |
|---|---|---|---|
| On time in full (OTIF) | linhas entregues no prazo e completas ÷ todas as linhas com entrega prevista | visão do cliente | defina a referência: data solicitada ou confirmada; estabeleça uma janela de tolerância |
| On-time delivery (OTD) | linhas entregues no prazo ÷ todas as linhas com entrega prevista | semelhante ao OTIF, mas sem o critério de quantidade | remessas parciais distorcem o quadro |
| Lead time (tempo de ciclo de fabricação) | conclusão menos liberação (por ordem), média e dispersão | velocidade do fluxo | a média não basta; a dispersão determina a confiabilidade da data de expedição |
| Flow factor | lead time médio ÷ tempo médio de operação | quanto mais tempo uma ordem espera do que é trabalhada [8] | use a mesma unidade de tempo (horas de trabalho ou horas corridas) |
| Work in process (WIP) | número ou conteúdo de trabalho das ordens liberadas e não concluídas | fator de lead time segundo a Lei de Little | meça em horas de conteúdo de trabalho, não apenas em unidades |
| Utilização | tempo ocupado ÷ tempo disponível | uso da capacidade | alta utilização em não gargalos não é sucesso |
| Utilização do gargalo | tempo produtivo no gargalo ÷ tempo disponível no gargalo | o KPI de utilização mais importante na TOC | informe separadamente o tempo de setup e de ociosidade no gargalo |
| Setup ratio | tempo de setup ÷ (tempo de setup + tempo de processamento) | capacidade perdida com trocas | especialmente crítico no gargalo |
| Overall equipment effectiveness (OEE) | disponibilidade × desempenho × qualidade | eficácia de uma máquina | adequado a equipamentos, não à avaliação de um cronograma |
| Schedule adherence (aderência ao cronograma) | operações iniciadas ou concluídas conforme o cronograma ÷ todas as operações programadas | quão realista e estável é o cronograma? | defina uma tolerância, p. ex., ± 1 turno |
| Schedule stability (estabilidade do cronograma) | operações alteradas no horizonte congelado ÷ todas as operações | nervosismo do planejamento | muitas alterações apontam para dados ruins ou para a falta de uma zona congelada |
| Buffer status | parcela de ordens em vermelho, amarelo e verde | alerta antecipado na gestão por buffers | só é significativo com buffers definidos |

**Exemplo resolvido, desempenho de entregas:** Em outubro, 480 linhas de pedido tinham entrega prevista na data confirmada. 432 foram expedidas no prazo; dessas, 410 também foram expedidas completas.

- On-time delivery = 432 ÷ 480 = **90,0%**
- OTIF = 410 ÷ 480 ≈ **85,4%**

**Exemplo resolvido, setup ratio e flow factor:** Em uma semana, o gargalo gastou 18 horas em setups e 62 horas em processamento. Setup ratio = 18 ÷ (18 + 62) = **22,5%**. Uma ordem com 6 horas de tempo de operação passou 120 horas de trabalho (15 dias de 8 horas) no chão de fábrica. Flow factor = 120 ÷ 6 = **20**: a ordem ficou no chão de fábrica vinte vezes mais tempo do que alguém trabalhou nela.

**Conjunto de KPIs para a implantação de um APS:** No mínimo, meça OTIF, lead time (média e dispersão), WIP e utilização do gargalo antes do go-live e mensalmente depois. Esses quatro estão ligados pela Lei de Little e pelas curvas de operação e, juntos, mostram se um cronograma melhor levou a um fluxo melhor.

## 12. Gêmeo digital e simulação

**Simulação** modela um sistema de produção e o executa ao longo do tempo. A diretriz alemã VDI 3633 Parte 1 trata dos fundamentos da simulação de sistemas de logística, fluxo de materiais e produção [16]. A simulação responde a perguntas que um cálculo estático de capacidade não consegue responder, porque considera aleatoriedade, interrupções e interações: como uma quebra de máquina afeta as datas de expedição nas próximas duas semanas? O que um terceiro turno no gargalo entrega? Como um novo mix de produtos altera os lead times?

Um **gêmeo digital da produção** vai além: é um modelo continuamente sincronizado com dados de ERP, MES e máquinas. Para o sequenciamento da produção, ele cumpre três funções:

1. **Base de planejamento:** O APS programa sobre um modelo que reflete recursos, restrições e o status real em tempo real.
2. **Análise de cenários:** Antes de uma decisão, como aceitar um pedido urgente ou fazer um investimento, alternativas são simuladas e comparadas por KPIs.
3. **Ciclo de aprendizado:** Os desvios entre plano e realizado retroalimentam e melhoram os tempos padrão e as restrições.

Distinga entre um modelo de simulação construído uma vez para um estudo e um gêmeo mantido continuamente e usado na operação. O segundo gera mais valor, mas exige integração de dados estável e responsabilidade clara pela manutenção do modelo. Como os dados do ERP, o gêmeo e o chão de fábrica podem ser conectados é mostrado no post [Do ERP ao Chão de Fábrica: Por Que os Planos de Produção Precisam de um Gêmeo Digital](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/). O guia do m365.fm [Gêmeo Digital na Manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/) aprofunda o tema; o lado de nuvem e dados é coberto em [Azure para Manufatura](https://www.m365.fm/en/learn/manufacturing-it-azure/).

**Primeiro, o mapeamento do fluxo de valor:** Antes de modelar um gêmeo ou um APS, mapeie o fluxo de valor. Ele mostra onde está o estoque, onde se suspeita que esteja o gargalo e quais fluxos de informação orientam hoje o planejamento. Veja o guia [Mapeamento do Fluxo de Valor](https://www.m365.fm/en/learn/value-stream-mapping/).

## 13. Como escolher software de programação da produção: critérios e checklist

### 13.1 Antes da lista curta: esclareça objetivos e ponto de partida

Quer você pesquise "software de programação da produção", "software APS", "software de programação de capacidade finita" ou "software de planejamento de capacidade", o que importa na manufatura é se o sistema programa a capacidade como finita e com suas restrições reais. Muitas ferramentas que aparecem nessas buscas são ferramentas de gestão de projetos ou de planejamento de recursos de equipe. Elas são úteis para projetos, mas normalmente não modelam roteiros, setups dependentes da sequência nem disponibilidade de material. As listas de "melhor software de programação da produção" no google.com misturam as duas categorias, por isso verifique cada candidato contra a tabela de restrições da Seção 5.2.

Antes de falar com fornecedores, responda a três perguntas:

1. **Qual problema deve ser resolvido?** Por exemplo: elevar o OTIF de 78% para mais de 90%, reduzir o lead time pela metade, diminuir o esforço de planejamento, oferecer datas de expedição confiáveis já na entrada do pedido.
2. **Quais restrições realmente importam?** Percorra a tabela da Seção 5.2 e marque o que se aplica à sua fábrica.
3. **Qual a qualidade dos seus dados?** Verifique roteiros, tempos padrão e a qualidade das apontações antes da seleção (Seção 14).

### 13.2 Critérios de seleção

| Critério | Pergunta a fazer | Peso (exemplo) |
|---|---|---|
| Modelagem de restrições | O sistema modela todas as restrições relevantes sem código personalizado? | alto |
| Qualidade do sequenciamento | Quão boas são as programações para *os seus* dados, medidas pelos seus objetivos? | alto |
| Tempo de processamento | Quanto tempo leva um reprogramação completa com volume realista de dados? | médio a alto |
| Programação interativa | Os planejadores podem arrastar e soltar ordens, e o sistema verifica as consequências imediatamente? | alto |
| Explicabilidade | Os planejadores conseguem ver por que uma ordem está programada onde está? | alto |
| Cenários e simulação | Variantes podem ser calculadas em paralelo e comparadas por KPIs? | médio |
| Integração com ERP | Existem conectores padrão para o seu ERP, em que direção e com que frequência? | alto |
| Integração com MES e apontamentos | Como os dados reais chegam ao APS, e com que rapidez? | alto |
| Usabilidade | Os planejadores e supervisores aceitam a interface? | alto |
| Escalabilidade | Múltiplas fábricas, mais recursos, mais ordens? | médio |
| Operações e segurança | Nuvem ou local, região de hospedagem, certificações (por exemplo, ISO/IEC 27001, SOC 2), modelo de funções e permissões, adequação à sua estrutura de segurança (por exemplo, NIST CSF 2.0 [35]); para fornecedores de defesa dos EUA, requisitos CMMC aplicáveis aos dados envolvidos [36] | médio |
| Fornecedor e parceiros | Experiência no setor, referências com produção comparável, suporte, roteiro de produtos | médio |
| Custo total de propriedade | Licenças, implantação, limpeza de dados, treinamento, operação ao longo de 5 anos | médio |

**E quanto ao preço?** Os preços nesta categoria variam de assinaturas SaaS por usuário, para ferramentas simples, a cotações corporativas para APS multifábrica, e a maioria dos fornecedores de APS não publica preços de tabela. Os diretórios de software que ranqueiam para o termo principal mostram o mesmo padrão: muitas listagens dizem "preço sob consulta", e pelo menos um diretório de ranqueamento ainda exibe dados de preços coletados em 2019. Compare o custo total de propriedade em cinco anos, incluindo o esforço interno para limpeza de dados e integração, em vez de considerar apenas o preço da licença.

### 13.3 Checklist de seleção

Use a lista como checklist para reuniões com fornecedores e testes de prova de conceito:

- [ ] Metas e KPIs com valores de referência estão documentados.
- [ ] As restrições relevantes estão priorizadas (obrigatórias, desejáveis, opcionais).
- [ ] Um conjunto de dados de teste representativo, com ordens, roteiros e tempos de setup reais, está pronto.
- [ ] Cada fornecedor programa o **mesmo** conjunto de dados de teste; os resultados são comparados pelos mesmos KPIs.
- [ ] Um cenário de interrupção foi testado (quebra de máquina, pedido urgente, atraso de material).
- [ ] O tempo de processamento de uma reprogramação completa foi medido.
- [ ] Os seus próprios planejadores trabalharam com o sistema na prática, e não apenas assistiram a uma demonstração.
- [ ] A interface com o ERP está especificada (objetos, direção, frequência, tratamento de erros).
- [ ] O caminho de apontamento a partir do chão de fábrica está definido (MES, terminal, aplicativo móvel).
- [ ] O sistema explica suas decisões de programação de forma que os planejadores consigam acompanhar.
- [ ] Funções e permissões podem ser modeladas (quem pode programar, liberar, congelar?).
- [ ] Pelo menos uma referência com um tipo de produção comparável foi entrevistada pessoalmente.
- [ ] O custo total em cinco anos foi calculado, incluindo o esforço interno.
- [ ] Proteção de dados, hospedagem e segurança da informação foram acordadas com a TI (e, para trabalhos de defesa, com o responsável pela conformidade CMMC).
- [ ] Uma opção de saída (exportação de dados, prazo contratual) foi esclarecida.

**Dica:** O teste mais revelador é um **piloto com os seus próprios dados**. Demonstrações de fornecedores com dados de exemplo limpos dizem pouco sobre como um sistema lida com seus roteiros incompletos e casos especiais.

## 14. Requisitos de dados e qualidade dos dados mestres

Um APS calcula com precisão, inclusive com dados errados. Uma programação baseada em tempos padrão que estão 30% fora da realidade é precisamente errada. A qualidade dos dados é, portanto, a causa mais comum de projetos de APS levarem mais tempo do que o planejado.

| Objeto de dados | Requisito mínimo | Lacunas típicas | Como verificar |
|---|---|---|---|
| Roteiros | sequência completa de operações, grupo de centros de trabalho correto | operações ausentes, recursos obsoletos | comparar amostras com o fluxo real do chão de fábrica |
| Tempos padrão (processamento) | desvio em relação ao real dentro de uma faixa de tolerância definida | padrões vindos da contabilidade de custos em vez de medição | planejado vs. realizado a partir das confirmações |
| Tempos de setup | dependentes da sequência, quando relevante (matriz de troca) | um único tempo de setup fixo por operação | analisar os registros de setup |
| Recursos e calendários | turnos, pausas, janelas de manutenção, paradas programadas da fábrica | calendários não mantidos no ERP | comparar com a escala de turnos |
| Recursos alternativos | alternativas permitidas com fator de desempenho | conhecidos apenas pelos supervisores | entrevistas e, em seguida, manutenção no sistema |
| Mão de obra e competências | matriz de competências, planejamento de presença | não disponíveis em formato digital | elaborar uma matriz de competências |
| Ferramentas e dispositivos de fixação | quantidade, atribuição às operações | não modelados como recurso | conciliar com a lista de ferramentas |
| Estoque e datas de compra | estoque correto, datas de entrega confiáveis | atrasos de lançamento, datas de entrega não confirmadas | variações de contagem cíclica, pontualidade de entrega dos fornecedores |
| Confirmações | pontuais, por operação, com quantidade e tempo | confirmação em lote no fim do turno ou inexistente | medir a taxa de confirmação e o atraso |
| Ordens e prioridades | datas de vencimento claras, prioridade do cliente | datas antecipadas "por precaução" | revisar o histórico de datas de vencimento |

**Regra prática para a sequência:** comece pelo gargalo. Se os roteiros, os tempos padrão e os tempos de setup dos recursos gargalo estiverem corretos, a programação já será muito melhor do que antes, mesmo que os recursos não gargalo ainda tenham imprecisões. Depois, avance ao longo do fluxo de materiais.

**As confirmações são a chave:** sem confirmações pontuais no chão de fábrica, o APS não sabe onde está uma ordem e programa com base em um estado que não existe mais. Igualmente importante: somente as confirmações permitem a comparação entre planejado e realizado, que melhora os tempos padrão ao longo do tempo.

## 15. Roteiro de implementação do APS

O roteiro abaixo descreve fases comprovadas. As durações são valores orientativos para uma fábrica de porte médio com uma única planta e dependem fortemente da qualidade dos dados, do esforço de integração e dos recursos do projeto [unverified: nenhum estudo robusto sobre a duração da implementação foi encontrado].

| Fase | Conteúdo | Resultado | Valor orientativo |
|---|---|---|---|
| 1. Diagnóstico | metas, KPIs com linhas de base, fluxo de valor e gargalos, restrições, qualidade dos dados | especificação de requisitos, constatações sobre os dados, business case | 4 a 8 semanas |
| 2. Seleção | lista longa de fornecedores, conjunto de dados de teste, prova de conceito, referências de clientes | decisão sobre o sistema, contrato | 6 a 12 semanas |
| 3. Limpeza de dados | roteiros, tempos padrão e de preparação, calendários, habilidades; começando pelo gargalo | dados mestres programáveis | em paralelo às fases 2 e 4, frequentemente o bloco mais longo |
| 4. Modelagem e integração | modelo de recursos, restrições, pesos dos objetivos, interfaces com ERP e MES | modelo de programação em funcionamento | 8 a 16 semanas |
| 5. Piloto | uma área, idealmente incluindo o gargalo; operação paralela com o processo antigo | comprovação da qualidade do cronograma, aceitação pelos usuários | 6 a 12 semanas |
| 6. Expansão | outras áreas, desativação da programação paralela, regras de liberação, zona congelada | operação em produção | depende do escopo |
| 7. Melhoria contínua | previsto vs. realizado, manutenção dos tempos padrão, análise das causas dos buffers, revisão dos KPIs | um sistema de planejamento que aprende | contínuo |

**Fatores de sucesso em todas as fases:**

- **Envolver os planejadores desde o primeiro dia.** Um APS em que os planejadores não confiam será contornado, e a planilha de Excel continuará em uso.
- **Definir as regras de planejamento antes do software.** Quem pode alterar prioridades? Qual é a duração da zona congelada? Qual regra governa a liberação?
- **Começar pequeno, aprender rápido.** Um piloto no gargalo mostra em semanas se os dados e o modelo se sustentam.
- **Medir o sucesso.** Sem linhas de base, o valor não pode ser comprovado, e a discussão do projeto se torna uma questão de opinião.
- **Envolver o chão de fábrica.** Um cronograma só ajuda se chegar ao chão de fábrica como tarefas, e as confirmações voltarem. Para as rotinas diárias que tornam isso possível, veja o guia [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

## 16. Erros comuns e como evitá-los

| Erro | Consequência | Melhor abordagem |
|---|---|---|
| Usar o APS como substituto da melhoria de processos | processos instáveis apenas são programados com mais precisão | estabilizar primeiro preparações, paradas e liberações; programar em paralelo |
| Modelar todas as restrições de uma só vez | o projeto atrasa, o modelo se torna incompreensível | começar pelas restrições que atuam no gargalo |
| Obter os tempos padrão a partir da contabilidade de custos | os cronogramas são sistematicamente otimistas ou pessimistas demais | usar os valores reais das confirmações e atualizá-los regularmente |
| Programar todos os recursos à utilização máxima | filas longas, prazos de entrega erráticos | carregar totalmente o gargalo, deixar folga nos não gargalos |
| Ausência de horizonte congelado | reprogramação constante, nervosismo no chão de fábrica | definir uma zona congelada, por exemplo, os próximos 1 a 3 turnos |
| Liberação sem limite de WIP | síndrome do tempo de espera, acúmulo de estoque em processo | liberar conforme o gargalo ou sob um limite de WIP |
| Aumentos generalizados dos prazos planejados quando as ordens atrasam | liberações antecipadas elevam o WIP e os atrasos | corrigir as causas no gargalo, controlar a liberação |
| Objetivos não acordados | vendas, produção e logística avaliam o cronograma de forma diferente | acordar e documentar os pesos dos objetivos em conjunto |
| Planejadores não envolvidos | o sistema é contornado, a programação paralela continua | envolver os planejadores na seleção, na modelagem e no piloto |
| Confirmações apenas ao final do turno | o APS programa com base em um estado desatualizado | confirmação oportuna por operação |
| Sucesso não medido | o valor permanece como uma afirmação | coletar linhas de base antes do início da operação |
| Otimização de caixa-preta | os planejadores não entendem nem confiam no cronograma | escolher um sistema com decisões de programação explicáveis |

**Ganhos rápidos sem novo software:** Se você quiser começar amanhã, cinco passos não exigem investimento:

1. Durante as últimas oito semanas, compare a carga e a capacidade de cada recurso e identifique o gargalo.
2. Conte o WIP e use a Lei de Little para calcular o lead time médio. Se ele se afastar bastante dos lead times planejados no ERP, você saberá por que as datas não se cumprem.
3. Defina uma regra de liberação: novas ordens só entram na fábrica quando a fila à frente do gargalo estiver abaixo de um limite definido.
4. No gargalo, priorize por data de entrega e família de setup, e não por quem grita mais alto.
5. Verifique os tempos padrão e de setup no gargalo em relação aos valores reais e corrija os maiores desvios.

## 17. Evidências: o que estudos e usuários relatam

**Teoria das Restrições na literatura:** Victoria Mabin e Steven Balderstone analisaram mais de 80 aplicações bem-sucedidas de TOC com resultados quantitativos relatados na literatura [5]. Segundo o resumo de Roberto Panizzolo, esses casos relataram melhorias médias de 70% no lead time do pedido à entrega, 65% no tempo de ciclo de fabricação, 49% nos estoques, 63% na produtividade ou receita e 44% no desempenho de datas de entrega [6]. Leia esses números com cuidado: somente histórias de sucesso publicadas foram analisadas, e nenhum fracasso foi encontrado na literatura [5]. Trata-se de uma seleção positiva, não da média esperada de qualquer implementação. A direção dos resultados ainda é consistente com a Lei de Little e com as curvas de operação: menos WIP, com um gargalo protegido, significa lead times mais curtos.

**Relatos de usuários de fornecedores de APS:** Os fornecedores publicam muitos exemplos de casos. O fornecedor alemão de MES MPDV, por exemplo, relata para seu cliente VACOM, que programa cerca de 1.200 ordens com até 20 operações cada, uma economia de tempo de aproximadamente 50% no planejamento [30]. Esses números são alegações de fornecedores sem método de medição divulgado. Eles mostram quais efeitos são possíveis, mas não substituem um piloto com seus próprios dados. O mesmo vale para os números de casos nas páginas de fornecedores norte-americanos que aparecem nas buscas por "production scheduling software".

**Aeroespacial como caso extremo:** A manufatura aeroespacial combina lead times longos, zonas de montagem com espaço limitado, requisitos de habilidades e certificação e rastreabilidade completa. A programação nesse setor precisa proteger não apenas as datas, mas também os registros. Os requisitos de lead time e rastreabilidade são descritos no post [Production Planning for Aerospace Suppliers: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/). Um guia completo: [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/).

**O que se generaliza:** Entre estudos e relatórios, três padrões se repetem. Primeiro, a maior parte do benefício não vem do algoritmo, mas da transparência sobre capacidade e sobre o gargalo. Segundo, os limites de WIP e a liberação controlada funcionam rápido e a baixo custo. Terceiro, a sustentação dos resultados depende de as confirmações no chão de fábrica e a comparação entre planejado e realizado continuarem funcionando.

## 18. Planejamento baseado em restrições com o iFAKT Polaris

> **Nota: O autor trabalha na iFAKT GmbH.**

A [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), com sede em Stuttgart, Alemanha, desenvolve a família de software [iFAKT Polaris](https://www.m365.fm/entity/polaris/). De acordo com o site da empresa, o Polaris conecta dados de ERP a um gêmeo digital da produção e lista como funções o planejamento baseado em restrições (recursos, competências, turnos, buffers), simulações do tipo "e se" para interrupções e mudanças de mix, e um cockpit de KPIs com lead time, WIP, utilização e pontualidade de entrega [28]. O site cita como setores aeroespacial, automotivo, máquinas e automação, e energia e infraestrutura [28]. Dois módulos são relevantes para os temas deste guia:

**[Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/)**, de acordo com a página do fornecedor, cria uma programação de produção otimizada e executável a partir de dados de ERP, disponibilidade de recursos e restrições operacionais [26]. Capacidades listadas:

- programação automática de máquinas, funcionários e ferramentas, considerando turnos, zonas, competências e capacidades
- detecção de gargalos, priorização de ordens e visibilidade de pedidos atrasados e riscos de entrega
- análise de impacto e reotimização após interrupções, inclusive com base em feedback do chão de fábrica
- um módulo de otimização de tamanho de lote que determina tamanhos de lote por variante e máquina, uma sequência otimizada para setups, e níveis de estoque equilibrando custo de armazenagem e prontidão para entrega
- suporte ao planejamento operacional de curto prazo e à previsão de capacidade de longo prazo

**[Polaris Operator](https://www.m365.fm/entity/polaris-operator/)**, de acordo com a página do fornecedor, recebe as programações otimizadas e as entrega como tarefas com base em tempo para operadores e líderes de turno no chão de fábrica [27]. Estão listados uma visão individual de tarefas por operador, visibilidade do caminho crítico para líderes de turno, instruções de trabalho incorporadas às tarefas, a opção de pausar, bloquear ou sinalizar tarefas com feedback estruturado, e uma visão de WIP em tempo real para planejadores. O feedback sobre andamento, atrasos e interrupções retorna ao planejamento [27].

As funções descritas, portanto, atendem a dois pontos que este guia identifica como críticos: a programação em face de restrições reais (Seção 5.2) e o ciclo fechado de planejamento, execução e feedback (Seções 6 e 14). A iFAKT GmbH exibe em seu site as certificações ISO 9001 e ISO/IEC 27001 [27]. As páginas de produto não informam número de clientes nem resultados quantificados com método divulgado [26][27]. Todas as afirmações de capacidade acima são alegações do fornecedor.

**Perspectiva:** o Polaris é uma entre muitas soluções disponíveis no mercado. Avalie-o como qualquer outro sistema, com a lista de verificação da Seção 13.3 e um piloto com seus próprios dados. Um guia dedicado, [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/), está em preparação.

## 19. Glossário

| Termo | Explicação |
|---|---|
| APS (advanced planning and scheduling) | software e métodos para programação com capacidade finita e disponibilidade de materiais, com otimização |
| ATP (available to promise) | quantidade que pode ser prometida a partir do estoque e de recebimentos planejados |
| Buffer management | controle baseado no consumo de buffers de tempo em zonas (verde, amarela, vermelha) |
| Changeover matrix | tabela de tempos de setup dependentes da sequência entre variantes |
| CONWIP | controle puxado com número total constante de ordens em uma linha |
| CTP (capable to promise) | data de expedição alcançável considerando materiais e capacidade |
| CRP (capacity requirements planning) | etapa de planejamento de capacidade no MRP II; mostra a carga, mas não resolve sobrecargas |
| Cycle time (Little's Law) | tempo que uma ordem permanece no sistema desde a liberação até a conclusão; ver [Lead Time](https://www.m365.fm/entity/lead-time/) |
| Detailed scheduling | programação de operações individuais em recursos, com sequência e tempo (alemão: *Feinplanung*) |
| Drum-buffer-rope (DBR) | controle da TOC: o gargalo define o ritmo, um buffer de tempo o protege, e a liberação é atrelada a ele |
| EOQ (economic order quantity) | fórmula de lote econômico da raiz quadrada, de Harris (1913); chamada de fórmula de Andler em textos alemães |
| Finite capacity scheduling | programação em que nenhuma capacidade programada excede a capacidade disponível (ISA-95) |
| Flow factor | razão entre o lead time e o tempo de operação |
| Frozen zone | horizonte de planejamento congelado, no qual não ocorre mais reprogramação |
| Heijunka | nivelamento de volume e mix ao longo do tempo |
| Lead time syndrome | círculo vicioso de lead times planejados mais longos, liberação antecipada, mais WIP e lead times ainda maiores |
| Little's Law | tempo de ciclo = WIP ÷ vazão |
| Lot size | quantidade produzida sem interrupção por um setup; ver [Batch Size](https://www.m365.fm/entity/batch-size/) |
| MES (manufacturing execution system) | sistema para execução, coleta de dados e controle de chão de fábrica (ISA-95 Nível 3; VDI 5600) |
| MPS (master production schedule) | programa de produção para itens finais |
| MRP (material requirements planning) | planejamento de materiais por explosão de BOM com lead times planejados |
| MRP II (manufacturing resource planning) | extensão do MRP com programação mestre, capacidade e planejamento financeiro |
| OTIF (on time in full) | percentual de linhas entregues no prazo e completas |
| PPC | planejamento e controle da produção (alemão: PPS) |
| Setup time | tempo para trocar um recurso entre duas ordens; ver [Setup Time](https://www.m365.fm/entity/setup-time/) |
| Safety stock | estoque mantido para proteger contra variações de demanda e de lead time |
| Takt time | tempo disponível ÷ demanda do cliente |
| Bottleneck (constraint) | recurso que limita a vazão de todo o sistema |
| TOC (theory of constraints) | abordagem de gestão que alinha o sistema à sua restrição |
| WIP (work in process) | ordens liberadas e ainda não concluídas no chão de fábrica |

## 20. FAQ: software de programação da produção e APS

### O que é software de programação da produção?

O software de programação da produção decide qual operação roda em qual máquina ou centro de trabalho, em que sequência e em que horário. Boas ferramentas programam com base em capacidade finita e restrições reais, como turnos, habilidades, ferramentas e tempos de preparação dependentes da sequência. Muitas ferramentas vendidas com esse nome são planejadores de projetos ou de recursos; para a manufatura, verifique se elas modelam roteiros, preparações e disponibilidade de material.

### O que é um sistema APS?

Um APS (advanced planning and scheduling, planejamento e programação avançados) é um software de planejamento que programa as ordens de fabricação com base na capacidade finita de máquinas, pessoas e ferramentas e na disponibilidade de material. Ele cria sequências e datas viáveis usando heurísticas e otimização matemática.

### Qual é a diferença entre APS e MRP?

O MRP calcula qual material é necessário e quando, ao explodir as listas de materiais e retroceder a partir de prazos de entrega planejados fixos. Em sua forma básica, ele assume capacidade ilimitada. O APS programa as operações considerando simultaneamente a capacidade finita e o material, de modo que suas datas são viáveis. O MRP responde "do que precisamos"; o APS responde "o que realmente conseguimos produzir e quando".

### Qual é a diferença entre APS e ERP? O APS substitui o ERP?

Não, o APS não substitui o ERP. O ERP é o sistema de registro de pedidos, material, estoque e finanças. Sua lógica de planejamento (MRP) assume capacidade ilimitada e prazos fixos em sua forma básica. Um APS acrescenta a programação com base na capacidade real e nas restrições e devolve ao ERP datas realistas.

### Qual é a diferença entre APS e MES?

Um APS planeja o que deve rodar, quando e em qual recurso. Um MES controla e registra a execução em tempo real. A ISA-95 situa tanto a programação do trabalho quanto sua execução no gerenciamento de operações de manufatura (Nível 3) [31], e a alemã VDI 5600 lista a programação detalhada como uma tarefa do MES [15]. Na prática, a programação é feita por um módulo do MES ou por um APS independente que troca dados com o MES.

### Qual é a diferença entre planejamento da produção e programação da produção?

O planejamento trabalha com quantidades agregadas, em períodos semanais ou mensais e por grupos de centros de trabalho, para definir o programa e as necessidades de material. A programação atribui operações individuais a recursos, com uma sequência e um horário de início, normalmente em horas ou turnos.

### Quais são os tipos de programação da produção?

As distinções mais úteis são a programação com capacidade finita versus infinita e a direção da programação: programação para frente (início mais cedo, término mais cedo), programação para trás (a partir da data de entrega, início mais tarde) e programação baseada no gargalo (carregar primeiro o gargalo e, em seguida, programar as etapas anteriores para trás e as posteriores para frente).

### Excel é suficiente para a programação da produção?

Às vezes. Com poucas ordens, preparações pouco dependentes da sequência e um gargalo estável, uma planilha ou um quadro de programação, somados a um controle disciplinado do gargalo (DBR), costumam funcionar. O software torna-se necessário quando o número de restrições e reprogramações supera o que o planejamento manual consegue lidar com confiabilidade, o que a tabela de restrições na Seção 5.2 ajuda a avaliar.

### Quando um APS se paga?

Normalmente quando vários destes pontos se aplicam: muitas operações por ordem, preparações dependentes da sequência, gargalos que se alternam ou são múltiplos, mão de obra qualificada escassa, pedidos urgentes frequentes, grande esforço de reprogramação e entregas no prazo que decepcionam apesar de estoques elevados. Não existe um limite universal de porte da empresa.

### O APS é adequado para pequenas e médias fabricantes?

Sim. A complexidade do planejamento importa mais do que o porte da empresa. Para pequenas e médias fabricantes, sistemas com conectores padrão de ERP, configuração sem código personalizado e um início gradual pelo gargalo são uma boa opção.

### Quanto custa um software de programação da produção?

Não existe um parâmetro público confiável de preços. Ferramentas simples são vendidas por assinatura por usuário; a maioria dos fornecedores de APS cota por planta, recursos e escopo. Oriente o orçamento pelo custo total de propriedade em cinco anos, incluindo a limpeza de dados, a integração, o treinamento e o esforço interno, e peça a todos os fornecedores que cotem sobre o mesmo escopo.

### Como encontro o gargalo na minha planta?

Para cada recurso, compare a carga planejada, incluindo preparações, com a capacidade disponível ao longo de várias semanas, observe onde as filas se formam de forma permanente e verifique qual recurso deixa áreas a jusante ociosas. Os gargalos também podem ser pessoas, estações de inspeção ou ferramentas, e eles se deslocam quando o mix muda.

### O que é drum-buffer-rope, em termos simples?

O gargalo é o tambor que define o ritmo. Um buffer de tempo à frente dele o protege contra perturbações. A corda (rope) amarra a liberação de material ao cronograma do gargalo, de modo que não entre na fábrica mais trabalho do que o gargalo consegue processar [2].

### Como posso reduzir o lead time de manufatura?

A alavanca mais rápida costuma ser limitar o WIP, pois, pela Lei de Little, o lead time cai proporcionalmente ao WIP com vazão constante [9]. Outras alavancas são lotes menores com preparações curtas, menor variabilidade e manter a utilização dos recursos não gargalo abaixo do ponto em que as filas explodem.

### Como melhorar a entrega no prazo?

Programe com base em capacidade finita, para que as datas prometidas sejam viáveis, controle a liberação no gargalo, priorize o trabalho diário conforme o status do buffer e analise sistematicamente as causas dos pedidos atrasados. Meça o desempenho de entrega de forma consistente, por exemplo como OTIF em relação à data confirmada.

### Como se calcula o lote econômico de compra (EOQ)?

A fórmula clássica do EOQ é Q* = √(2 × demanda anual × custo de preparação ou de pedido por lote ÷ custo de manutenção por unidade por ano). Com demanda de 12.000 unidades, custo de preparação de US$ 300 e custo de manutenção de US$ 8, o resultado é cerca de 949 unidades. A fórmula ignora capacidade e sequenciamento e serve apenas como valor inicial.

### Como se calcula o estoque de segurança?

Com demanda variável e lead time constante: SS = z × σ_D × √L. Com desvio padrão de 30 unidades por dia, lead time de 9 dias e nível de atendimento de ciclo de 95% (z = 1,645), obtém-se cerca de 148 unidades. Se o lead time também variar, o valor sobe drasticamente.

### A IA pode assumir o sequenciamento da produção?

A IA melhora as previsões de tempos de processamento e de preparação, detecta padrões de perturbação e acelera a busca por bons cronogramas. Ela não substitui dados mestres consistentes nem o acordo sobre objetivos e regras. Sem dados de apontamento confiáveis, a IA também aprende com dados ruins.

### Quanto tempo leva uma implementação de APS?

Depende principalmente da qualidade dos dados, do esforço de integração e do escopo. Um piloto em uma área gargalo pode entrar em operação em alguns meses; uma implantação completa em várias áreas leva mais tempo. Não existe um estudo independente robusto sobre os tempos típicos de implementação.

### O APS substitui os planejadores de produção?

Não. Um APS assume o cálculo, não as decisões. Os planejadores definem prioridades, mantêm regras e dados, tratam exceções e decidem entre cenários. Em implantações bem-sucedidas, os planejadores passam menos tempo refazendo cronogramas e mais tempo nas causas dos atrasos.

## 21. Conclusão

Os cronogramas de produção raramente fracassam porque os planejadores não se esforçam o suficiente. Eles fracassam porque a lógica de planejamento assume capacidade ilimitada e prazos de entrega fixos. A física da fábrica é clara: o lead time decorre do WIP e da taxa de produção, as filas explodem em alta utilização, e o gargalo determina o que a fábrica consegue entregar.

Um APS resolve exatamente esse problema. Ele programa com base em capacidade finita e restrições reais, torna as datas de expedição calculáveis e mostra as consequências de interrupções e pedidos urgentes antes que elas aconteçam. Ele só entrega resultados em conjunto com três fatores que nenhum software oferece: um foco claro no gargalo, liberação controlada de ordens e dados mestres e confirmações que correspondam à realidade.

Portanto, comece de forma simples: identifique o gargalo, meça e limite o WIP, organize os dados do gargalo e, em seguida, teste um software de programação da produção com recursos de APS em um piloto com os seus próprios dados. Assim, a planilha Excel paralela não será substituída por uma nova caixa-preta, mas por um cronograma em que a produção, as vendas e os clientes possam confiar.

## Leituras complementares no m365.fm

**Publicações**

- [Além do MRP: por que o Enterprise Resource Planning falha no sequenciamento finito da produção](https://www.m365.fm/community/u/mirko-p/blog/beyond-mrp-enterprise-resource-planning-finite-scheduling/)
- [Do ERP ao chão de fábrica: por que os planos de produção precisam de um gêmeo digital](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Planejamento da produção para fornecedores aeroespaciais: lead time e rastreabilidade](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)

**Páginas de entidades**

[Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Buffer Management](https://www.m365.fm/entity/buffer-management/) · [Constraint-based Scheduling](https://www.m365.fm/entity/constraint-based-scheduling/) · [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [Line Balancing](https://www.m365.fm/entity/line-balancing/) · [Batch Size](https://www.m365.fm/entity/batch-size/) · [Safety Stock](https://www.m365.fm/entity/safety-stock/) · [Lead Time](https://www.m365.fm/entity/lead-time/) · [Setup Time](https://www.m365.fm/entity/setup-time/) · [Takt Time](https://www.m365.fm/entity/takt-time/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Pull System](https://www.m365.fm/entity/pull-system/) · [Polaris](https://www.m365.fm/entity/polaris/) · [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [iFAKT](https://www.m365.fm/entity/ifakt/)

**Guias relacionados**

- [Gêmeo Digital na Manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Mapeamento do Fluxo de Valor](https://www.m365.fm/en/learn/value-stream-mapping/)
- [KPIs de Manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [Planejamento da Produção Aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [Azure para Manufatura](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Manufatura Enxuta](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Gestão do Chão de Fábrica](https://www.m365.fm/en/learn/shop-floor-management/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** é o apresentador do m365.fm e trabalha na iFAKT GmbH. No m365.fm, ele escreve sobre planejamento e programação da produção, manufatura enxuta e a transformação digital da manufatura. Na [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), desenvolvedora do [iFAKT Polaris](https://www.m365.fm/entity/polaris/), ele trabalha em como o planejamento baseado em restrições, os gêmeos digitais e o feedback do chão de fábrica se integram para que os cronogramas se sustentem na prática.

**Nota: O autor trabalha na iFAKT GmbH.**

# Sources

All online sources accessed November 20, 2026.

1. Goldratt, Eliyahu M.; Cox, Jeff: The Goal. A Process of Ongoing Improvement. North River Press 1984 (3rd rev. ed. 2004, ISBN 978-0-88427-178-9).
2. Goldratt, Eliyahu M.; Fox, Robert E.: The Race. North River Press 1986, 179 pp., ISBN 0-88427-062-9. Reference: https://buresund.nu/books/the-race
3. Theory of Constraints Institute: Five Focusing Steps. https://www.tocinstitute.org/five-focusing-steps.html
4. Cox, James F. III; Schleier, John G. (eds.): Theory of Constraints Handbook. McGraw-Hill, New York 2010, ISBN 978-0-07-166554-4; ch. 8: Srikanth, Mokshagundam L.: DBR, Buffer Management, and VATI Flow Classification; ch. 9: From DBR to Simplified-DBR for Make-to-Order. Chapter reference: https://www.toc-goldratt.com/en/product/dbr-buffer-management-and-vati-flow-classification-chapter-8-of-the-theory-of-constraints-handbook
5. Mabin, Victoria J.; Balderstone, Steven J.: The performance of the theory of constraints methodology: Analysis and discussion of successful TOC applications. International Journal of Operations & Production Management 23 (2003) 6, pp. 568–595. DOI: 10.1108/01443570310476636
6. Panizzolo, Roberto: Theory of Constraints (TOC) Production and Manufacturing Performance. International Journal of Industrial Engineering and Management 7 (2016) 1, pp. 15–23. https://www.research.unipd.it/retrieve/e14fb26b-f0bc-3de1-e053-1705fe0ac030/ijiem_vol7_no1_3.pdf
7. Schuh, Günther; Stich, Volker (eds.): Produktionsplanung und -steuerung 1. Grundlagen der PPS [Production planning and control 1: Fundamentals]. 4th rev. ed., Springer Vieweg, Berlin/Heidelberg 2012, ISBN 978-3-642-25422-2. (German)
8. Nyhuis, Peter; Wiendahl, Hans-Peter: Logistische Kennlinien. Grundlagen, Werkzeuge und Anwendungen. 3rd ed., Springer Vieweg, Berlin/Heidelberg 2012, ISBN 978-3-540-92838-6. DOI: 10.1007/978-3-540-92839-3 (German). English edition: Nyhuis, Peter; Wiendahl, Hans-Peter: Fundamentals of Production Logistics. Theory, Tools and Applications. Springer, Berlin/Heidelberg 2009 (published October 2008), ISBN 978-3-540-34210-6, DOI: 10.1007/978-3-540-34211-3
9. Little, John D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (1961) 3, pp. 383–387. DOI: 10.1287/opre.9.3.383
10. Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337
11. Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57 (1961) 4, pp. 902–904. DOI: 10.1017/S0305004100036094
12. Lödding, Hermann: Verfahren der Fertigungssteuerung. Grundlagen, Beschreibung, Konfiguration [Production control methods]. 3rd ed., Springer Vieweg, Berlin/Heidelberg 2016, ISBN 978-3-662-48458-6 (print), 978-3-662-48459-3 (e-book). (German)
13. Fleischmann, Bernhard; Meyr, Herbert; Wagner, Michael: Advanced Planning. In: Stadtler, Hartmut; Kilger, Christoph; Meyr, Herbert (eds.): Supply Chain Management and Advanced Planning. Concepts, Models, Software, and Case Studies. 5th ed., Springer, Berlin/Heidelberg 2015, pp. 71–95. DOI: 10.1007/978-3-642-55309-7_4 (book: DOI 10.1007/978-3-642-55309-7)
14. Garey, M. R.; Johnson, D. S.; Sethi, Ravi: The Complexity of Flowshop and Jobshop Scheduling. Mathematics of Operations Research 1 (1976) 2, pp. 117–129. DOI: 10.1287/moor.1.2.117
15. VDI 5600 Part 1: Manufacturing Execution Systems (MES). Edition October 2016. https://www.din.de/en/wdc-beuth:din21:251310997 ; table of contents: https://www.vdi.de/fileadmin/pages/vdi_de/redakteure/richtlinien/inhaltsverzeichnisse/2436698.pdf (German guideline of the Association of German Engineers)
16. VDI 3633 Part 1: Simulation of systems in materials handling, logistics and production – Fundamentals. Edition December 2014. https://din.de/de/wdc-beuth:din21:149034959 (German guideline)
17. Harris, Ford W.: How Many Parts to Make at Once. Factory, The Magazine of Management 10 (1913) 2, pp. 135–136; and Erlenkotter, Donald: Ford Whitman Harris and the Economic Order Quantity Model. Operations Research 38 (1990) 6, pp. 937–946. DOI: 10.1287/opre.38.6.937
18. Andler, Kurt: Rationalisierung der Fabrikation und optimale Losgröße. Oldenbourg, Munich/Berlin 1929 [unverified: bibliographic details and first name not verified online, original not consulted; formula and assumptions per University of Duisburg-Essen, exercise "Statische Losgröße – Andler-Modell": https://www.uni-due.de/imperia/md/content/tul/de_ss2013_lm01_uebung_statische_losgroesse_andler_modell.pdf].
19. Silver, Edward A.; Pyke, David F.; Thomas, Douglas J.: Inventory and Production Management in Supply Chains. 4th ed., CRC Press, Boca Raton 2017, ISBN 978-1-4665-5861-8.
20. Ohno, Taiichi: Toyota Production System. Beyond Large-Scale Production. Productivity Press, Cambridge (MA) 1988, ISBN 978-0-915299-14-0.
21. Spearman, Mark L.; Woodruff, David L.; Hopp, Wallace J.: CONWIP: a pull alternative to kanban. International Journal of Production Research 28 (1990) 5, pp. 879–894. DOI: 10.1080/00207549008942761
22. Boysen, Nils; Fliedner, Malte; Scholl, Armin: A classification of assembly line balancing problems. European Journal of Operational Research 183 (2007) 2, pp. 674–693. Reference: https://econpapers.repec.org/RePEc:eee:ejores:v:183:y:2007:i:2:p:674-693
23. Thürer, Matthias; Fernandes, Nuno O.; Haeussler, Stefan; Stevenson, Mark: Dynamic planned lead times in production planning and control systems: does the lead time syndrome matter? International Journal of Production Research 61 (2023) 4, pp. 1268–1282. DOI: 10.1080/00207543.2022.2034193
24. Orlicky, Joseph: Material Requirements Planning. The New Way of Life in Production and Inventory Management. McGraw-Hill, New York 1975.
25. Logistik Heute: SCM-Studie: Mehr als ein Drittel der deutschen Unternehmen nutzt Excel als Rückgrat für die Lieferkettenplanung (IDC for Kinaxis), April 18, 2024. https://logistik-heute.de/news/scm-studie-mehr-als-ein-drittel-der-deutschen-unternehmen-nutzt-excel-als-rueckgrat-fuer-die-lieferkettenplanung-104313.html (German)
26. iFAKT GmbH: Polaris Optimizer. https://www.ifakt.de/en/solutions/optimizer
27. iFAKT GmbH: Polaris Operator. https://www.ifakt.de/en/solutions/operator
28. iFAKT GmbH: Home page. https://www.ifakt.de/
29. Pinedo, Michael L.: Scheduling. Theory, Algorithms, and Systems. 5th ed., Springer, Cham 2016. DOI: 10.1007/978-3-319-26580-3
30. MPDV Mikrolab GmbH: APS-Systeme einfach erklärt (Smart Factory glossary, with VACOM customer example). https://www.mpdv.com/industrie-4-0/smart-factory-glossar/advanced-planning-and-scheduling-system-aps (German)
31. ANSI/ISA-95.00.03-2013: Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management. International Society of Automation. Preview incl. clause 3.1 definition of finite capacity scheduling: https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf
32. Kinaxis Inc.: New Research Finds 83% of Supply Chains Can't Respond to Disruptions in 24 Hours (IDC research commissioned by Kinaxis, 1,800 respondents in nine countries incl. USA and Canada, fielded December 2023), press release, April 16, 2024. https://investors.kinaxis.com/news-releases/news-release-details/2024/New-Research-Finds-83-of-Supply-Chains-Cant-Respond-to-Disruptions-in-24-Hours
33. ASCM (Association for Supply Chain Management): APICS Certified in Planning and Inventory Management (CPIM), 2026 certification brochure. https://www.ascm.org/globalassets/ascm_website_assets/docs/credentials/2026-certification_brochures_cpim.pdf
34. Lean Enterprise Institute: Lean Lexicon, "Heijunka." https://www.lean.org/lexicon-terms/heijunka/
35. National Institute of Standards and Technology (NIST): The NIST Cybersecurity Framework (CSF) 2.0. NIST CSWP 29, February 26, 2024. https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final
36. U.S. Department of Defense: Defense Federal Acquisition Regulation Supplement: Assessing Contractor Implementation of Cybersecurity Requirements (DFARS Case 2019-D041), final rule. Federal Register 90 (2025) 173, September 10, 2025, effective November 10, 2025. https://www.govinfo.gov/content/pkg/FR-2025-09-10/html/2025-17359.htm
