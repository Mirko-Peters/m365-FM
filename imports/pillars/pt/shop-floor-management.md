# SEO metadata

| Field | Value |
|---|---|
| Meta title | Shopfloor-Management e Gemba Walks: Um Guia Prático |
| Meta description | Shopfloor-Management explicado: reuniões em níveis, quadros SQDCP, KPIs, checklist de gemba walk, roteiro de implantação e quadro digital no Microsoft 365. |
| Slug | `shop-floor-management` |

# Shopfloor-Management und Gemba-Walks: Der vollständige Leitfaden für Führung dort, wo die Arbeit geschieht

*Última atualização: 20 de novembro de 2026 · Detalhes da Microsoft verificados no Microsoft Learn nesta data*

> **Resposta curta:** Shop floor management (também escrito shopfloor management, muitas vezes chamado de sistema de gestão diária ou gestão em níveis) é um sistema de liderança no qual os gestores conduzem as operações onde o valor é de fato criado: no chão de fábrica, no armazém ou no laboratório. Ele combina líderes presentes no gemba (o "lugar real"), KPIs visuais em um quadro de chão de fábrica, reuniões diárias curtas por nível que encaminham os problemas para cima na organização e resolução estruturada de problemas, de modo que os desvios sejam identificados todos os dias e corrigidos de forma definitiva. A caminhada no gemba é a rotina de liderança em seu centro.

Quase todo fabricante tem em algum lugar um quadro branco com números. Peter Gelbrich, citado pelo instituto alemão de treinamento CETPM, estima a partir de visitas a empresas que cerca de 80 por cento das empresas industriais possuem algum tipo de ferramenta visual de gestão do chão de fábrica [3]. Portanto, a verdadeira questão já não é se você tem um quadro, mas se ele funciona. Os desvios são tratados em horas e não em semanas? Os líderes aparecem no gemba com perguntas ou com respostas? E os problemas que a equipe não consegue resolver chegam de forma confiável ao nível seguinte no mesmo dia?

Este guia explica as origens e os princípios, descreve cada elemento em detalhes e apresenta uma matriz de reuniões por nível, um layout de quadro, um guia de caminhada no gemba com checklist, o trabalho padronizado do líder, um roteiro de implantação e uma arquitetura de referência para um quadro digital de chão de fábrica construído com Microsoft Teams, Power BI, Power Apps e Microsoft Fabric. Grande parte da pesquisa sobre shop floor management vem da Alemanha, onde o termo "Shopfloor Management" é vocabulário padrão nas fábricas; este guia utiliza essas fontes quando agregam valor e explica o contexto para leitores dos Estados Unidos. Uma definição resumida também está disponível na página de entidade [Shop floor management](https://www.m365.fm/entity/shop-floor-management/).

### Principais conclusões

- Shop floor management é um sistema de liderança, não um quadro e não um software. Consiste em líderes presentes no chão de fábrica, gestão visual, poucos KPIs, um ritmo fixo de reuniões, resolução de problemas e padrões.
- As reuniões de nível de equipe duram de 10 a 15 minutos e são escalonadas para que um problema do primeiro turno chegue ao gerente da fábrica no mesmo dia.
- Um quadro deve conter de quatro a seis KPIs que a equipe realmente consiga influenciar, normalmente organizados em SQDCP (segurança, qualidade, entrega, custo, pessoas).
- A caminhada no gemba é a principal rotina de liderança: tem um tema, baseia-se em observação e perguntas abertas e sempre termina com acompanhamento.
- Uma ação só é encerrada quando seu efeito aparece no KPI e o padrão foi atualizado.
- Rotina primeiro, digital depois. Um quadro digital no Microsoft 365 é um conjunto de ferramentas; licenças, intervalos de atualização, desenho dos dados e regras de monitoramento de funcionários determinam o esforço.

### Caminhos de leitura para leitores com pouco tempo

| Você é um(a) … | Leia primeiro |
|---|---|
| Líder de equipe, supervisor ou líder de turno | Seção 5 (reuniões por nível), 6 (quadro), 9 (caminhada no gemba), 10 (trabalho padronizado do líder) |
| Gerente de fábrica ou VP de operações | Seção 3 (benefícios), 13 (cultura e regras de monitoramento de funcionários), 14 (implantação), 15 (erros comuns) |
| Administrador de Microsoft 365 ou Azure | Seção 16 (analógico ou digital), 17 (Microsoft 365, incluindo o plano de construção), 18 (integração de dados) |
| Coach Lean, gerente de melhoria contínua ou líder de projeto | Seção 4 (elementos), 8 (resolução de problemas), 14 (roteiro com verificação de maturidade) |

## Índice

1. [O que é gestão do chão de fábrica? Definição e escopo](#o-que-é-gestão-do-chão-de-fábrica-definição-e-escopo)
2. [Origens: gemba, genchi genbutsu e o Sistema Toyota de Produção](#origens-gemba-genchi-genbutsu-e-o-sistema-toyota-de-produção)
3. [Objetivos e benefícios](#objetivos-e-benefícios)
4. [Os seis elementos da gestão do chão de fábrica](#os-seis-elementos-da-gestão-no-chão-de-fábrica)
5. [Reuniões em níveis: a cascata diária](#reuniões-em-cascata-o-escalonamento-diário)
6. [O quadro do chão de fábrica: estrutura, campos e um exemplo de layout](#o-quadro-do-chão-de-fábrica-estrutura-campos-e-um-layout-de-exemplo)
7. [KPIs do chão de fábrica: escolhendo métricas SQDCP que funcionem](#kpis-do-chão-de-fábrica-escolhendo-métricas-sqdcp-que-funcionam)
8. [Solução de problemas no chão de fábrica: da contenção ao padrão](#solução-de-problemas-no-chão-de-fábrica-da-contenção-ao-padrão)
9. [A caminhada no gemba: etapas, perguntas e checklist](#gemba-walk-etapas-perguntas-e-checklist)
10. [Trabalho padronizado do líder: liderança como rotina](#padrão-de-trabalho-do-líder-liderança-como-rotina)
11. [Andon: tornando os desvios visíveis em tempo real](#andon-tornando-os-desvios-visíveis-em-tempo-real)
12. [Papéis e responsabilidades](#papéis-e-responsabilidades)
13. [Cultura, segurança psicológica e regras de monitoramento de funcionários](#cultura-segurança-psicológica-e-regras-de-monitoramento-de-funcionários)
14. [Como implementar a gestão do chão de fábrica: um roteiro em seis fases](#como-implementar-o-gerenciamento-no-chão-de-fábrica-um-roteiro-em-seis-fases)
15. [Erros comuns e como corrigi-los](#erros-comuns-e-como-corrigi-los)
16. [Analógico ou digital? Gestão digital do chão de fábrica comparada](#analógico-ou-digital-gestão-à-vista-digital-comparada)
17. [Construindo um quadro digital do chão de fábrica com o Microsoft 365](#construindo-um-quadro-digital-de-chão-de-fábrica-com-o-microsoft-365)
18. [Integração de dados: MES, ERP e dados de máquinas](#integração-de-dados-mes-erp-e-dados-de-máquinas)
19. [Suporte de software: o exemplo do iFAKT Polaris](#suporte-de-software-o-exemplo-do-ifakt-polaris)
20. [Glossário](#glossário)
21. [FAQ: gestão do chão de fábrica e caminhadas no gemba](#faq-gestão-à-vista-no-chão-de-fábrica-e-gemba-walks)
22. [Conclusão](#conclusão)

## O que é gestão do chão de fábrica? Definição e escopo

O termo combina "shop floor" (a área de produção, de modo mais geral o local onde o valor é criado) e "gestão". Em fábricas dos EUA, a mesma prática costuma receber outros nomes: sistema de gestão diária, responsabilização em níveis, reuniões em níveis ou quadros de huddle. A ideia central é a mesma.

O Instituto Alemão de Ciência do Trabalho Aplicada (ifaa, instituto de pesquisa em engenharia industrial e ergonomia) descreve a gestão do chão de fábrica como liderar no ponto de criação de valor, reunindo planejamento, controle, melhoria e execução de tarefas no chão de fábrica para que o conhecimento dos "especialistas no local" seja aproveitado [2]. A Academia Alemã de Tecnologia de Produção (WGP) a chama de sistema de gestão integrado para o desenvolvimento sistemático de processos e funcionários no chão de fábrica [4]. Remco Peters, cujo livro de 2009 é uma referência padrão nos países de língua alemã, ressalta que a gestão do chão de fábrica "não é apenas uma ferramenta de controle, mas um instrumento de liderança holístico" [1][6].

Três características decorrem dessas definições e separam a verdadeira gestão do chão de fábrica de um painel de KPIs:

1. **Lugar:** A liderança acontece onde o valor é criado, não na sala de reuniões.
2. **Ritmo:** A comunicação é programada, curta e padronizada. Segue uma cascata fixa pelos níveis da organização.
3. **Efeito:** Todo desvio leva a uma ação com um responsável e um prazo, e o efeito é verificado.

### O que a gestão do chão de fábrica não é

Na prática, a gestão do chão de fábrica é frequentemente confundida com termos relacionados. Nos EUA, em particular, "shop floor management" também é usado por fornecedores de ERP e de programação para se referir ao controle do chão de fábrica: liberar, sequenciar e rastrear ordens de trabalho. A tabela abaixo separa os conceitos.

| Termo | Do que trata | Relação com a gestão do chão de fábrica |
|---|---|---|
| Controle do chão de fábrica / controle de produção | Sequenciamento, liberação de ordens, balanceamento de capacidade, acompanhamento de ordens de trabalho | Uma subtarefa; a gestão do chão de fábrica utiliza seus resultados, mas é um sistema de liderança |
| MES (sistema de execução da manufatura) | Sistema de TI para registrar e controlar a produção | Fonte de dados e ferramenta, não o próprio sistema de liderança |
| Gestão visual | Tornar visíveis o status e os desvios | Um elemento da gestão do chão de fábrica |
| Gemba walk | Um líder vai até onde o trabalho é feito, observa e faz perguntas | Um elemento e uma rotina de liderança dentro da gestão do chão de fábrica |
| Melhoria contínua / kaizen | Melhoria em pequenos passos contínuos | Resultado e impulsionador; a gestão do chão de fábrica fornece a plataforma diária |
| Manufatura enxuta (Lean) | Filosofia geral para eliminar desperdícios | A estrutura mais ampla; a gestão do chão de fábrica é seu sistema diário de liderança |

Para a estrutura mais ampla, veja a página de entidade [Lean management](https://www.m365.fm/entity/lean-management/) e o compêndio do m365.fm [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/). Na Alemanha, essa estrutura é frequentemente chamada de "sistema de produção holístico" (Ganzheitliches Produktionssystem). A série de diretrizes VDI 2870 da Associação de Engenheiros Alemães (VDI) descreve seus fundamentos (Parte 1, julho de 2012) e um catálogo de métodos (Parte 2, fevereiro de 2013). A VDI classificou as duas partes como parcialmente necessitando de revisão, e uma nova edição da Parte 2 está em andamento [27].

### Chão de fábrica, área de escritório e outras áreas

A gestão do chão de fábrica começou na manufatura, mas se transfere para qualquer área com trabalho recorrente e um resultado mensurável: logística, manutenção, laboratórios, enfermarias hospitalares, atendimento ao cliente, engenharia. Para áreas indiretas, o termo "gestão do escritório" (office floor management) se consolidou [3]. Os princípios permanecem os mesmos; os KPIs mudam. Em vez de produção e refugo, o quadro mostra, por exemplo, o lead time dos casos, a liberação pontual de desenhos ou o acúmulo de chamados.

## Origens: gemba, genchi genbutsu e o Sistema Toyota de Produção

### Gemba: o "local real"

"Gemba" (às vezes grafado "genba") é japonês para "o local real". No Lean, significa o lugar onde o trabalho que gera valor realmente acontece, normalmente o chão de fábrica [7][8]. Intimamente relacionado está **genchi genbutsu**, aproximadamente "local real, coisa real". O Lean Lexicon do Lean Enterprise Institute (LEI) define o termo como ir até a fonte para verificar os fatos por conta própria [8]. Michael Ballé, do LEI, faz a distinção desta forma: gemba é um lugar, genchi genbutsu é uma ação [8].

A importância central deste princípio para a Toyota aparece em "The Toyota Way 2001". Em abril de 2001, a Toyota apresentou dois pilares (melhoria contínua e respeito pelas pessoas) e cinco valores-chave. Ao lado de desafio, kaizen, respeito e trabalho em equipe, genchi genbutsu é explicitamente um deles, traduzido como "ir até a fonte para encontrar os fatos" [9].

### Taiichi Ohno e o círculo de giz

Taiichi Ohno (1912–1990) é considerado o arquiteto do Sistema Toyota de Produção; seu livro "Toyota Production System: Beyond Large-Scale Production" foi publicado em inglês pela Productivity Press em 1988 [13]. Uma história conhecida está associada a ele: diz-se que colocava novos engenheiros dentro de um círculo desenhado com giz no chão da fábrica e os fazia observar por horas até realmente enxergarem os problemas do processo. A história pode ter sido embelezada [12], mas captura o núcleo: a compreensão vem da observação no local, não de relatórios.

### Masaaki Imai e "Gemba Kaizen"

Masaaki Imai tornou o termo conhecido no Ocidente com seu livro "Gemba Kaizen: A Commonsense, Low-Cost Approach to Management" (McGraw-Hill, 1997) [10]. Os "princípios de ouro da gestão do gemba", conforme o resumo do Kaizen Institute [11], são os seguintes:

1. Quando surgir um problema, vá primeiro ao gemba.
2. Verifique o gembutsu (máquina, ferramenta, material, peça defeituosa).
3. Tome contramedidas provisórias no local.
4. Encontre a causa raiz.
5. Padronize para evitar a recorrência.

Esses cinco passos continuam sendo o modelo para a solução de problemas na gestão do chão de fábrica (veja a seção 8).

### Suzaki e a disseminação do termo

Kiyoshi Suzaki é considerado o pioneiro do termo "shop floor management" com o seu livro "The New Shop Floor Management: Empowering People for Continuous Improvement" (Free Press, 1993) [5]. O instituto alemão de formação CETPM cita Constantin May, que chama Suzaki de "pai do shop floor management" [3]. Suzaki acrescentou à liderança no local a boa comunicação entre gestores e colaboradores, a compreensão do cliente em toda a empresa, a capacidade de aprender e a exigência da mais alta qualidade [1]. Nos países de língua alemã, Remco Peters (2009) [6] e trabalhos na Technische Universität Darmstadt (incluindo Hertle et al. sobre desenvolvimento de competências no shop floor management [26]) moldaram a discussão. Nos EUA, as mesmas práticas se difundiram sobretudo sob os rótulos lean management system, daily management e leader standard work, em especial através do livro de David Mann "Creating a Lean Culture" [19].

### Quão difundido está hoje?

Segundo um estudo de 2018 citado pela WGP, cerca de 82,5 por cento das empresas participantes tinham introduzido o shop floor management, um aumento de cerca de 20 por cento em relação a três anos antes. Era usado sobretudo na produção e em áreas adjacentes, mas não em todos os níveis da hierarquia [4]. A WGP não identifica o estudo, por isso a amostra e o método não podem ser verificados. A constatação aponta para um problema central em muitas fábricas, que a seção 5 aborda: um quadro de equipe sem uma cascata funcional acima dele tem pouco efeito. Não foram encontrados, na pesquisa para este artigo, números representativos comparáveis dos EUA.

## Objetivos e benefícios

O shop floor management persegue cinco objetivos que dependem uns dos outros:

| Objetivo | O que de fato acontece | Medido por |
|---|---|---|
| Transparência | Meta e realizado ficam visíveis para todos de relance | Atualização do quadro, proporção de KPIs com meta |
| Resposta rápida | Desvios são identificados e tratados dentro de um turno | Tempo entre desvio e ação, prazo de escalonamento |
| Solução de problemas duradoura | Causas-raiz são eliminadas, não apenas sintomas | Taxa de reincidência do mesmo defeito |
| Envolvimento dos colaboradores | O conhecimento de quem executa o trabalho entra nas decisões | Número de ideias implementadas, participação nas reuniões curtas |
| Desenvolvimento da liderança | Líderes deixam de apagar incêndios e passam a atuar como coaches | Proporção de leader standard work concluído, taxa de gemba walks |

### Qual é a evidência?

Números sólidos e independentes sobre o benefício do shop floor management são raros, porque o seu efeito é difícil de separar de outras medidas lean. Os exemplos documentados ainda assim são instrutivos:

- **fischer (fabricante alemão de fixadores, fischerwerke):** Após um projeto de nove meses, a taxa de reclamações caiu 13 por cento e os custos de processo caíram 9 por cento; o número de entregas subiu 11 por cento, com a mesma força de trabalho e no prazo [3].
- **Schinko (fabricante austríaco de carcaças de chapa metálica):** Após a introdução de shop floor management digital, a produtividade no corte subiu 20 por cento; na dobra, onde o sistema era mais recente, o aumento no momento do relatório foi de 10 por cento. O artigo foi escrito pelo chefe de marketing do fornecedor de software envolvido, a GFT, e deve ser lido com essa ressalva [42].
- **Pesquisa sobre shop floor management digital:** O estudo do wbk Institute of Production Science do Karlsruher Institut für Technologie (KIT) e do instituto IPRI, no projeto ShopfloorPulse, indica que informações digitais quase em tempo real podem reduzir "consideravelmente" a latência até a correção de uma falha, enquanto o acompanhamento analógico de ações depende da disciplina individual [24][25]. O estudo baseia-se em 18 empresas e é, portanto, um retrato qualitativo, não uma pesquisa representativa.

Muitas páginas de fornecedores no google.com citam ganhos bem maiores (por exemplo, 25 a 35 por cento mais produtividade) sem nomear uma fonte. Este guia não repete tais números. A conclusão sóbria: o shop floor management não é uma ferramenta com ROI garantido, mas um sistema de liderança cujo efeito depende de quão consistentemente é executado. As seções seguintes mostram do que essa consistência depende.

## Os seis elementos da gestão no chão de fábrica

A literatura estrutura a gestão no chão de fábrica de maneiras diferentes. A ifaa distingue quatro blocos visíveis (gestão visual, KPIs, comunicação padronizada, resolução sistemática de problemas) e três fundamentos "invisíveis" (princípios de trabalho, compreensão dos papéis, sustentabilidade) [2]. Peters identificou quatro elementos centrais: liderar no local, reconhecer desvios, resolver problemas de forma sustentável e usar os recursos de forma otimizada [1]. A WGP cita estabilidade e padronização como pré-requisitos e, como elementos de gestão, a gestão de desempenho, a resolução de problemas e a gestão de melhorias, a liderança no local, a gestão visual e o desenvolvimento de competências [4]. Muitas páginas dos EUA costumam listar cinco "pilares" com conteúdo semelhante.

O modelo a seguir reúne essas visões e já se mostrou eficaz na prática:

| Elemento | Pergunta-chave | Principais ferramentas |
|---|---|---|
| 1. Líderes presentes no chão de fábrica | Os líderes veem a realidade com os próprios olhos? | Gemba walk, trabalho padronizado do líder |
| 2. Gestão visual | Qualquer pessoa consegue dizer em segundos se as coisas estão de acordo com o planejado? | Quadro do chão de fábrica, andon, 5S, luzes de status |
| 3. KPIs | Medimos aquilo que a equipe consegue influenciar? | SQDCP, OEE, first pass yield |
| 4. Cadência de reuniões (comunicação em níveis) | As informações fluem de forma confiável, para cima e para baixo, todos os dias? | Reuniões em níveis, regras de escalonamento |
| 5. Resolução de problemas | As causas-raiz são eliminadas de forma definitiva? | PDCA, 5 Porquês, diagrama de espinha de peixe (Ishikawa), A3 |
| 6. Padronização | O que aprendemos está incorporado ao processo? | Trabalho padronizado, instruções de trabalho |

### Elemento 1: Líderes presentes no chão de fábrica

A LEI descreve a mentalidade do gemba desta forma: você vai ao gemba para entender o trabalho, para liderar e para aprender [15]. Fujio Cho, ex-presidente e depois presidente do conselho da Toyota, resumiu a atitude dos líderes lean em três imperativos: "Vá ver, pergunte o porquê, demonstre respeito" [15]. Presença não significa controle; significa estar acessível e demonstrar interesse. A seção 9 descreve em detalhes como é a presença na forma de uma gemba walk.

### Elemento 2: Gestão visual

A LEI define a gestão visual como a colocação de todas as ferramentas, peças, atividades de produção e indicadores de desempenho "à vista", de modo que o estado do sistema possa ser compreendido de relance por todos os envolvidos [20]. A gestão visual, portanto, vai muito além do quadro: marcações no piso, painéis de sombra, cartões kanban, luzes andon e luzes de empilhamento nas máquinas fazem todas parte dela. O [5S](https://www.m365.fm/entity/5s/) costuma ser a base, porque os desvios só se destacam em um ambiente organizado. Mais: [Gestão visual](https://www.m365.fm/entity/visual-management/).

### Elemento 3: KPIs

Os KPIs tornam os desvios objetivos. Eles precisam atender a três critérios: a equipe consegue influenciá-los, estão disponíveis em tempo hábil e têm uma meta. A seção 7 trata de como escolhê-los. Os fundamentos estão na página de entidade [Indicador-chave de desempenho](https://www.m365.fm/entity/key-performance-indicator/) e no compêndio [KPIs de manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/).

### Elemento 4: Cadência de reuniões

A cadência de reuniões (as fontes em alemão a chamam de "Regelkommunikation", comunicação padronizada) significa reuniões curtas, agendadas e padronizadas junto ao quadro. Sua característica definidora é a cascata: informações e problemas fluem do nível da equipe para o nível do departamento e para o nível da planta, e o apoio e as decisões fluem de volta [3][58]. A seção 5 apresenta uma matriz completa.

### Elemento 5: Resolução de problemas

Sem resolução de problemas, a gestão no chão de fábrica degenera em uma sessão de relatórios. O que importa é separar a contenção rápida da eliminação duradoura das causas-raiz. A seção 8 percorre o caminho desde um ponto vermelho no quadro até um padrão atualizado.

### Elemento 6: Padronização

Os padrões são tanto pré-requisito quanto resultado. Sem um padrão não existe desvio, e sem a atualização do padrão cada melhoria se perde novamente. A WGP, por isso, cita explicitamente estabilidade e padronização como pré-requisitos [4]. Mais: [Trabalho padronizado](https://www.m365.fm/entity/standard-work/).

## Reuniões em cascata: o escalonamento diário

> **Em resumo:** Cada nível se reúne brevemente em seu quadro, resolve o que consegue e repassa o restante ao nível seguinte no mesmo dia. Isso exige horários fixos de reunião, gatilhos claros de escalonamento e a obrigação de dar resposta.

As reuniões em níveis (também chamadas de tier meetings, huddles por níveis, stand-ups ou reuniões diárias de responsabilização) são a espinha dorsal da cadência de reuniões. A ideia: cada nível se reúne brevemente, revisa seus KPIs, resolve o que consegue e escalona o restante para o nível seguinte, que se reúne um pouco mais tarde. O Kaizen Institute descreve a estrutura típica nos EUA como quatro níveis, das equipes de linha de frente (nível 1) passando pelos supervisores (nível 2) e gerentes de departamento (nível 3) até a liderança da fábrica (nível 4), com os problemas escalonados no mesmo dia para um responsável nomeado [58]. A CETPM descreve a cadência clássica em fábricas alemãs como diária ou por turno no nível de equipe, semanal no nível de departamento e mensal ou trimestral no nível da fábrica [3]. Em muitas fábricas enxutas, uma reunião diária também é hoje comum nos níveis 2 e 3, de modo que um problema do primeiro turno chegue ao gerente da fábrica na manhã seguinte. O estudo da ShopfloorPulse descreve a mesma estrutura: as reuniões sobem a partir do chão de fábrica em ritmos diários, semanais ou mensais [25]. Mais sobre o termo na página da entidade [Tier meeting](https://www.m365.fm/entity/tier-meeting/).

### Quanto deve durar uma reunião em níveis?

Existem valores de referência documentados. Gelbrich cita cerca de 10 a 12 minutos no nível operacional e 20 a 30 minutos no nível gerencial; Orth cita 10, no máximo 20 minutos para reuniões stand-up em áreas indiretas; Schwarz cita no máximo 15 minutos em seu exemplo prático, mas observa que as primeiras reuniões durante a implantação costumam levar 30 minutos ou mais [3]. Gelbrich inclui as reuniões que se estendem demais, especialmente durante a implantação, entre as dez razões mais comuns para o fracasso da gestão à vista no chão de fábrica [3].

### Matriz de reuniões em níveis (projeto de exemplo)

A matriz a seguir é um projeto de exemplo para uma fábrica que opera em turnos, baseado em práticas comuns. A cadência e a duração seguem os valores de referência documentados acima; os horários e os participantes são sugestões a serem adaptadas ao seu modelo de turnos e à sua organização.

| Característica | Nível 1: equipe | Nível 2: área / supervisor | Nível 3: departamento / gerente de produção | Nível 4: fábrica |
|---|---|---|---|---|
| Cadência | a cada turno, no início do turno | diária | diária (alternativamente semanal) | diária ou semanal, mais uma revisão mensal |
| Horário (exemplo: primeiro turno começa às 6h00) | 6h10 às 6h30, escalonado por linha | 8h30 | 9h15 | 10h00 |
| Duração | 10 a 15 minutos | 15 minutos | 15 a 20 minutos | 20 a 30 minutos |
| Local | quadro na linha | quadro da área | quadro do departamento no chão de fábrica | quadro da fábrica (sala obeya ou no chão de fábrica) |
| Facilitador | líder de equipe | supervisor / líder de turno | gerente de produção ou de departamento | gerente da fábrica |
| Participantes | equipe da linha ou célula | líderes de equipe da área, manutenção e qualidade conforme necessário | supervisores, representantes de qualidade, manutenção, logística, EHS (meio ambiente, saúde e segurança) | chefes de departamento, funções de apoio (qualidade, cadeia de suprimentos, compras, RH, finanças) |
| Horizonte de tempo | último turno, turno atual | últimas 24 horas, hoje | ontem, hoje, esta semana | semana, mês, tendência |
| KPIs típicos | eventos de segurança, meta vs. realizado de unidades por hora, sucata, paradas, presença | produção, OEE dos gargalos, rendimento de primeira passagem, backlog | entrega no prazo, custo da qualidade, produtividade, escalonamentos abertos | visão SQDCP da fábrica, reclamações de clientes, custo, status de projetos |
| Decisões | escalas de pessoal, contenção, ideias | realocação de pessoas entre linhas, prioridades de manutenção | recursos entre áreas, turnos extras, equipes de solução de problemas | gastos de capital, prioridades, mudanças de metas |
| Escalonar para cima quando | o problema não puder ser resolvido dentro do turno ou faltarem recursos | o problema afetar várias linhas ou exigir uma função de apoio | o problema afetar clientes, orçamento ou vários departamentos | corporativo, cliente, fornecedor |

**Segundo e terceiro turnos:** O nível 1 funciona em todos os turnos; os níveis 2 a 4 normalmente só durante o dia. Para que os problemas do segundo e do terceiro turno não se percam, o líder de turno registra os escalonamentos abertos no quadro ou no diário de turno e os repassa pessoalmente ao primeiro turno. A reunião matinal do nível 2 começa com esses itens.

### Regras de escalonamento que funcionam

Uma cascata só é tão boa quanto suas regras de escalonamento. Quatro princípios já se mostraram eficazes:

1. **Gatilhos claros em vez de intuição.** Defina para cada KPI quando escalar, por exemplo: "linha parada por mais de 30 minutos", "refugo acima do limite em duas horas consecutivas", "lesão ou quase acidente: sempre".
2. **Cronograma que se encaixa.** A reunião do nível superior ocorre depois da do nível inferior, para que as escalações cheguem no mesmo dia. O facilitador da reunião inferior repassa a escalação pessoalmente ou pelo quadro.
3. **Dever de resposta.** Toda escalação recebe uma resposta, no máximo na próxima reunião do nível inferior. O silêncio é a forma mais rápida de destruir uma cultura de escalação.
4. **A segurança vem primeiro.** Questões de segurança são escaladas imediatamente, independentemente da cascata.

A CETPM descreve uma ligação falha entre os níveis gestão à vista do chão de fábrica como um obstáculo típico [3]. Isso corresponde ao estudo do KIT e do IPRI: quando as ações são acompanhadas em papel, a escalação para níveis superiores se rompe e o acompanhamento de ações "depende da disciplina dos indivíduos" [24].

### Pauta padrão de uma reunião de nível 1 (no máximo 15 minutos)

A pauta usa o limite superior de 15 minutos. Equipes bem treinadas concluem em 10 a 12 minutos, a faixa que Gelbrich cita para o nível operacional [3].

| Minuto | Item | Pergunta orientadora |
|---|---|---|
| 0–2 | Segurança | Há lesões, quase acidentes ou condições inseguras? |
| 2–6 | KPIs de ontem / último turno | Onde estamos no vermelho, e por quê? |
| 6–9 | Plano para hoje | Qual é a meta de hoje? Há restrições de pessoas, material, equipamentos? |
| 9–12 | Ações | Quais ações abertas vencem, o que está concluído, o que precisa de ajuda? |
| 12–14 | Escalações | O que repassamos ao nível 2? |
| 14–15 | Encerramento | Quem faz o quê até quando? Algum reconhecimento por bom trabalho? |

Importante: a reunião de nível nomeia problemas, atribui responsáveis e acorda a contenção. A análise de causa raiz acontece depois, em um pequeno grupo junto ao equipamento.

## O quadro do chão de fábrica: estrutura, campos e um layout de exemplo

> **Em resumo:** Um bom quadro é legível a cerca de 3 m, mostra de quatro a seis KPIs com metas, segue a pauta da reunião da esquerda para a direita e vincula cada KPI vermelho a uma ação. A própria equipe o mantém.

O quadro do chão de fábrica (também chamado de quadro huddle, quadro de nível ou quadro de desempenho SQDCP) é a ferramenta central da cadência de reuniões. A ifaa descreve suas tarefas assim: ele visualiza KPIs selecionados de uma área, mostra ações de melhoria com seu status para que seu efeito nos KPIs possa ser rastreado, e contém informações de controle diárias, sobretudo a situação atual de pedidos e capacidade [2]. Como categorias de exemplo, a ifaa lista qualidade, custo, logística, segurança, pessoal, capacidade e situação de pedidos, além de metas e ações (melhoria contínua); KPIs de exemplo incluem first pass yield, taxas de ppm, OEE, entrega no prazo, números de acidentes, status de 5S e taxa de presença [2].

### Regras de design

- **Legível a cerca de 3 m:** Status em vermelho/verde e números grandes, nada de tabelas com 30 colunas.
- **Quatro a seis KPIs:** A CETPM recomenda cerca de quatro a seis KPIs que a equipe consiga influenciar [3]; o provedor alemão de treinamento Haufe Akademie cita de cinco a sete como limite superior [43].
- **Meta ao lado do realizado:** Todo KPI tem meta e tendência.
- **Contar a história da esquerda para a direita:** O quadro segue a pauta da reunião, então o facilitador simplesmente avança da esquerda para a direita.
- **Ações visíveis:** Todo KPI vermelho está vinculado a uma ação ou a uma folha de solução de problemas.
- **Pertence à equipe:** A equipe mantém o quadro por conta própria. Um quadro preenchido pelo financeiro ou pela TI, que ninguém da equipe entende, será ignorado.

### Layout de exemplo de um quadro de nível 1

O layout a seguir mostra um quadro para uma linha de montagem com três linhas e cinco colunas. Ele funciona tanto em um quadro branco (cerca de 2 × 1,2 m) quanto em uma tela.

| | Coluna A: Segurança (S) | Coluna B: Qualidade (Q) | Coluna C: Entrega (D) | Coluna D: Custo / produtividade (C) | Coluna E: Pessoas (P) |
|---|---|---|---|---|---|
| **Linha 1: status atual** | Cruz de segurança (calendário mensal, cada dia verde, amarelo ou vermelho) | Sucata e retrabalho por turno vs. meta | Meta do plano diário vs. realizado, backlog | Meta de unidades por hora vs. realizado (gráfico hora a hora) | Presença, matriz de habilidades (quem consegue fazer o quê) |
| **Linha 2: tendência** | Quase acidentes nas últimas 4 semanas | Índice de primeira passagem, 3 principais tipos de defeito (Pareto) | Entrega no prazo nesta semana | OEE do gargalo, 3 principais motivos de parada, [micro paradas](https://www.m365.fm/entity/micro-stops/) | Plano de férias e treinamento |
| **Linha 3: ações** | Ações de segurança em aberto | Folhas de solução de problemas / A3s em andamento | Escalonamentos para o nível 2 e respostas | Lista de ações (o quê, quem, até quando, status) | Ideias e sugestões com status |

A maioria dos quadros também tem um cabeçalho com o nome da equipe, a meta da área e a hora da última atualização, além de um campo de "padrões e auditorias" (por exemplo, o resultado da última auditoria 5S). Nota sobre a ordem das colunas: o original em alemão deste guia usa SQCDP, que coloca custo antes de entrega; fábricas nos EUA costumam escrever SQDCP. A ordem de C e D importa menos do que colocar a segurança em primeiro lugar.

### Conteúdo do quadro por nível

À medida que o nível sobe, o quadro fica mais agregado e o horizonte de tempo mais longo. O fornecedor de MES Symestic descreve isso como duas regras de consistência: os KPIs são condensados e revisados com menos frequência à medida que se sobe, mas devem remeter aos mesmos dados em todos os níveis [41].

| Nível | Detalhe | Horizonte de tempo típico | Exemplo de qualidade |
|---|---|---|---|
| Nível 1 | estação, hora | turno | defeitos por hora na estação 3 |
| Nível 2 | linha, turno | dia | taxa de sucata por linha |
| Nível 3 | área, dia | semana | índice de primeira passagem e custo da qualidade por área |
| Nível 4 | fábrica, semana | mês | reclamações de clientes em ppm, custo da má qualidade |

## KPIs do chão de fábrica: escolhendo métricas SQDCP que funcionam

A maioria dos quadros segue uma ordem fixa de dimensões. A mais comum é **SQDCP** (ou SQCDP): segurança, qualidade, entrega, custo e pessoas [41]. Variantes são SQDC (sem P), SQDCM (M de moral) ou SQDCE com meio ambiente. A CETPM lista temas de segurança, qualidade, custo, confiabilidade de entrega e pessoas como dimensões típicas [3]. A ordem é deliberada: a segurança sempre vem primeiro.

### Três perguntas norteadoras para escolher KPIs

Gelbrich sugere três perguntas a partir das quais os KPIs adequados podem ser derivados [3]:

1. Como deve ser a saída do meu processo em termos de tempo e qualidade?
2. Como posso demonstrar a eficiência das minhas ações em termos de custo e recursos?
3. O que reflete a execução responsável do meu processo em termos de segurança e meio ambiente?

Seu princípio central, formulado como uma variação de uma famosa citação de Drucker: o que a equipe não consegue influenciar não deveria ser medido no seu quadro [3].

### Catálogo de KPIs para o quadro do chão de fábrica

| Dimensão | KPI | Definição / cálculo | Nível |
|---|---|---|---|
| S | Dias desde o último acidente com afastamento | dias corridos desde o último caso registrável pela OSHA (ver nota abaixo) | 1–4 |
| S | Taxa total de incidentes registráveis (TRIR) | número de lesões e doenças registráveis × 200.000 / total de horas trabalhadas; 200.000 horas equivalem a 100 trabalhadores em tempo integral por um ano [51] | 3–4 |
| S | Quase acidentes (reportados) | reportes por semana (mais reportes são um bom sinal no início) | 1–3 |
| Q | Taxa de sucata | quantidade de sucata / quantidade total; ver [taxa de sucata](https://www.m365.fm/entity/scrap-rate/) | 1–3 |
| Q | Índice de primeira passagem (FPY) | peças boas na primeira passagem / peças iniciadas | 1–3 |
| Q | Reclamações de clientes | contagem ou ppm | 3–4 |
| D | Unidades meta vs. realizado | por hora ou por turno | 1–2 |
| D | Entrega no prazo | pedidos entregues no prazo / todos os pedidos | 2–4 |
| D | Backlog | quantidade em aberto vs. plano | 1–3 |
| C | OEE | disponibilidade × desempenho × qualidade [22] | 1–3 |
| C | Produtividade | peças boas por hora de trabalho | 2–4 |
| C | Tempo de troca | tempo entre a última peça boa do pedido anterior e a primeira peça boa do próximo pedido | 1–2 |
| P | Presença / lotação | funcionários presentes / escalados | 1–2 |
| P | Nível de polivalência | percentual de tarefas cobertas na matriz de habilidades | 1–2 |
| P | Ideias implementadas | sugestões de melhoria implementadas por mês | 1–3 |

**Nota sobre KPIs de segurança em fábricas dos EUA:** Os contadores de "dias sem lesão" são populares, mas a OSHA alertou que incentivos baseados em taxas (por exemplo, uma recompensa por um mês sem lesões) podem desencorajar a notificação. No seu memorando de 11 de outubro de 2018, a OSHA afirma que esses programas são permitidos nos termos de 29 CFR 1904.35(b)(1)(iv) somente se não forem implementados de maneira que desencorajem a notificação, e que uma política de não retaliação, por si só, "pode não ser, por si só, adequada" [50]. A OSHA recomenda um processo para a notificação de lesões, doenças, quase acidentes/incidentes evitados e perigos, incluindo uma opção anônima [49]. Para a diretoria, isso significa mostrar quase acidentes e relatos de perigo ao lado do número de lesões, e nunca vincular uma recompensa para a equipe apenas a um histórico de segurança sem ocorrências.

OEE (eficácia global do equipamento) vem da manutenção produtiva total; a LEI nomeia seis grandes perdas: quebras, preparação e ajuste, pequenas paradas, redução de velocidade, refugo e retrabalho [22]. Na lousa, o número de OEE em si importa menos do que a divisão por tipo de perda, porque a equipe pode derivar ações a partir dela. A coletânea m365.fm [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) trata dessas métricas em profundidade.

### O que a pesquisa mostra sobre KPIs na gestão do chão de fábrica

No estudo do KIT e do IPRI, 94 por cento das empresas pesquisadas acompanhavam KPIs de qualidade e produtividade na gestão do chão de fábrica, enquanto KPIs de custo raramente eram usados [24][25]. O uso digital de KPIs em tempo quase real foi a exceção, com pouco mais de 15 por cento das menções, e a previsão de desvios não era realidade em nenhuma das empresas pesquisadas [24].

## Solução de problemas no chão de fábrica: da contenção ao padrão

Um campo vermelho na lousa é o começo, não o fim. A solução de problemas na gestão do chão de fábrica segue um padrão derivado diretamente das regras de ouro da gestão gemba [11]:

| Etapa | O que acontece | Quem | Quando |
|---|---|---|---|
| 1. Detectar | O desvio torna-se visível na lousa ou via andon | equipe | imediatamente ou na reunião de nível |
| 2. Conter | A contenção protege o cliente (por exemplo, inspeção de 100 por cento, quarentena, peça de reposição) | líder de equipe | no mesmo turno |
| 3. Compreender | Verificar o gembutsu no local, coletar dados, observar o processo | pequena equipe junto ao equipamento | após a reunião |
| 4. Encontrar a causa raiz | 5 Porquês, diagrama de Ishikawa, A3 para problemas complexos | equipe de solução de problemas | de dias a semanas |
| 5. Corrigir | Implementar a contramedida permanente | responsável por item da lista de ações | conforme planejado |
| 6. Verificar o efeito | Acompanhar o KPI por um período definido | líder de equipe | após a implementação |
| 7. Padronizar | Atualizar padrão, instrução de trabalho e treinamento; compartilhar entre linhas (yokoten) | supervisor, dono do processo | após o efeito ser comprovado |

Uma ação só é considerada encerrada quando seu efeito aparece no KPI. A regra parece trivial, mas muitas fábricas a descumprem: listas de ações são reportadas como "verdes" enquanto o defeito volta na semana seguinte.

### Qual método para qual problema?

| Tipo de problema | Característica | Método | Tempo necessário |
|---|---|---|---|
| Simples, causa óbvia | causa e correção claras na reunião | ação direta com prazo | minutos |
| Recorrente, causa incerta | ocorre repetidamente, a equipe não tem certeza da causa | 5 Porquês, Ishikawa | horas |
| Complexo, multifuncional | várias causas, vários departamentos | solução de problemas A3 baseada em PDCA | semanas |
| Sistêmico, estratégico | afeta o fluxo de valor, o layout, o produto | evento kaizen, mapeamento do fluxo de valor | semanas a meses |

O A3 é especialmente valioso porque reúne problema, estado atual, análise da causa raiz, estado alvo, contramedidas e acompanhamento em uma única folha de papel A3 (297 × 420 mm, próximo do formato tabloide de 11 × 17 pol. que a maioria das fábricas dos EUA usa no lugar). A página de entidade [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) oferece uma introdução, e a coletânea [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) trata do nível sistêmico. O ciclo PDCA (planejar, fazer, checar, agir), normalmente atribuído a W. Edwards Deming (o próprio Deming creditava Walter A. Shewhart), é a base de todos os processos de solução de problemas [1].

## Gemba walk: etapas, perguntas e checklist

> **Em resumo:** Uma gemba walk tem um tema, começa no quadro, observa o trabalho ao longo de vários ciclos, faz perguntas abertas e termina com um retorno comprometido com a equipe. Sem tema e sem acompanhamento, é apenas um passeio.

A gemba walk é a rotina de liderança mais importante na gestão do chão de fábrica. O Lean Lexicon a define como "uma prática gerencial para compreender a situação atual por meio de observação direta e investigação antes de tomar qualquer ação" [7]. Uma introdução compacta também está disponível no post [What is a gemba walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/) e na página de entidade [Gemba walk](https://www.m365.fm/entity/gemba-walk/).

### Três tipos de gemba walk

Jim Womack, fundador da LEI, afirma que ele e Dan Jones usaram pela primeira vez o termo "gemba walk" no início da década de 1990, originalmente para gerentes que percorriam todo o fluxo de valor de um produto entre departamentos e empresas [14]. Hoje ele distingue duas formas e separa um terceiro uso do termo, atualmente difundido [14]:

| Tipo | Finalidade | Frequência típica | Quem |
|---|---|---|---|
| Caminhada pelo fluxo de valor | conscientizar sobre a melhoria fundamental de ponta a ponta | conforme necessário, p. ex., trimestral | liderança da planta e das áreas, todas as funções ao longo do fluxo de valor |
| Caminhada pelo sistema de gestão | verificar se o sistema de gestão consegue manter a estabilidade (quadros, padrões, escalonamentos) | semanal a diária | líderes de todos os níveis |
| Caminhada focada em problemas (genchi genbutsu) | chegar à raiz de um problema específico no local | conforme necessário | responsáveis pelo problema, especialistas |

Womack critica o terceiro uso e o aproxima de "management by walking around": se a gestão diária funciona, os problemas já deveriam ter sido resolvidos na cascata, em vez de gestores de topo e equipes de melhoria correndo ao gemba para apagar incêndios. O tempo deles é mais bem investido em caminhadas pelo fluxo de valor e pelo sistema de gestão [14].

### As três perguntas orientadoras da LEI: propósito, processo, pessoas

A LEI recomenda estruturar a gemba walk em torno de três dimensões [7]:

1. **Propósito:** Que problema este processo resolve para o cliente?
2. **Processo:** Como o trabalho realmente acontece, e não como o padrão o descreve?
3. **Pessoas:** Os colaboradores estão engajados em criar, sustentar e melhorar o processo?

A LEI também recomenda acompanhar uma família de produtos ou um processo voltado ao cliente do início ao fim e envolver todos os participantes, porque o valor flui horizontalmente entre departamentos [7].

### Gemba walk vs. management by walking around

A gemba walk costuma ser equiparada ao "management by walking around" (MBWA). O MBWA começou na Hewlett-Packard; o cofundador David Packard havia adotado a prática na General Electric. Tornou-se famoso pelo livro "In Search of Excellence", de Tom Peters e Robert Waterman (1982) [16]. As diferenças ainda são consideráveis:

| Característica | Gemba walk | Management by walking around |
|---|---|---|
| Finalidade | compreender o processo, identificar desvios do padrão, desenvolver capacidade de solução de problemas | proximidade com os colaboradores, troca informal, percepção do clima |
| Estrutura | tema, roteiro, perguntas orientadoras, acompanhamento | majoritariamente não estruturado e espontâneo |
| Referência | padrão, KPI, quadro | pessoas e conversa |
| Resultado | observações específicas, coaching, ações | relacionamento, informação |
| Ancorado em | trabalho padronizado do líder, ritmo fixo | estilo de liderança pessoal |

As duas abordagens não são mutuamente excludentes: uma conversa informal de passagem não substitui uma gemba walk, mas também não a prejudica. O post [Gemba walk vs. management by walking around](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/) compara os dois conceitos com mais detalhes.

### Como fazer uma gemba walk em sete etapas

**1. Defina um tema.** Toda gemba walk tem um foco, por exemplo "troca de ferramental na linha 4", "uso da nova instrução de inspeção" ou "efeito das ações da reunião de tier 3". Sem tema, a caminhada vira um tour.

**2. Prepare-se.** Revise os KPIs e o quadro da área, verifique as ações em aberto e leve o padrão (instrução de trabalho, folha de trabalho padronizado). Avise a equipe com antecedência para que a visita não seja vista como uma inspeção surpresa. O post [Gemba walk preparation: team and roles](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/) traz dicas.

**3. Comece pelo quadro.** O quadro mostra o que a própria equipe vê como problema. Pergunte: "O que o seu quadro está lhe dizendo hoje?"

**4. Observe.** Fique em uma estação de trabalho e acompanhe vários ciclos. Compare o que você vê com o padrão. Anote fatos, não interpretações.

**5. Faça perguntas.** Perguntas abertas e respeitosas para quem está executando o trabalho. Não ofereça soluções prontas.

**6. Resuma e agradeça.** Ao final, reflita brevemente sobre o que aprendeu e combine o que acontecerá com as observações.

**7. Faça o acompanhamento.** Documente as observações, encaminhe as ações para a reunião de nível adequado e dê feedback à equipe. Uma caminhada sem feedback corrói a confiança.

**Não esqueça o segundo e o terceiro turno.** Em uma fábrica com três turnos, líderes que caminham apenas no turno diurno veem um terço da operação. Agende uma caminhada nos turnos alternativos pelo menos de vez em quando; problemas com dimensionamento de pessoal, apoio da manutenção e passagens de turno costumam aparecer ali primeiro (recomendação prática).

**Quanto tempo deve durar um gemba walk?** As fontes utilizadas aqui não indicam um valor fixo. Na prática, uma caminhada focada de gestão em uma área leva de 20 a 45 minutos; uma caminhada pelo fluxo de valor de toda uma família de produtos pode levar meio dia. O dia de exemplo da seção 10 prevê 30 minutos. São valores práticos, não afirmações das fontes.

### Banco de perguntas para o gemba walk

**Propósito e objetivos**
- Quem é o cliente deste processo e do que ele precisa?
- Qual é a meta do seu turno hoje, e como você sabe se está atingindo-a?
- Qual KPI é mais importante para você agora, e por quê?

**Processo e padrão**
- Como esta etapa normalmente acontece? Pode me mostrar?
- Onde o padrão está documentado, e ele corresponde à realidade?
- Como você percebe imediatamente quando algo está errado aqui?
- O que acontece quando falta material ou a máquina para?
- Onde você espera, procura coisas ou precisa retrabalhar algo?

**Problemas e solução de problemas**
- Qual foi o último problema que você resolveu aqui?
- Qual problema está lhe custando mais tempo neste momento?
- O que acontece quando você comunica um problema? Com que rapidez chega ajuda?
- Qual ação no quadro está atrasada, e do que ela precisa?

**Pessoas**
- O que impede você de fazer bem o seu trabalho?
- O que você mudaria se a decisão fosse sua?
- Quem além de você consegue executar esta tarefa?
- O que eu posso fazer para apoiá-lo?

### Checklist do gemba walk

Imprima-o ou transforme-o em um formulário digital (veja a seção 17). Uma versão mais longa, com perguntas específicas por função, está no post [Gemba walk checklist and questions](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/).

- [ ] Tema e área definidos.
- [ ] KPIs, situação do quadro e ações em aberto revisados com antecedência.
- [ ] O padrão relevante está à mão (impresso ou em um tablet).
- [ ] A equipe ou o líder de equipe foi informado.
- [ ] Equipamentos de proteção individual (EPI) e as regras de segurança da área foram observados.
- [ ] Pelo menos uma estação de trabalho foi observada ao longo de vários ciclos.
- [ ] As perguntas foram abertas; nenhuma solução foi imposta.
- [ ] As observações foram anotadas como fatos (local, horário, o que foi visto).
- [ ] As boas práticas foram reconhecidas.
- [ ] Os acordos foram resumidos.
- [ ] As ações foram registradas na lista de ações ou na próxima reunião de nível.
- [ ] O feedback à equipe está agendado.

### Erros comuns no gemba walk

| Erro | Por que prejudica | Melhor abordagem |
|---|---|---|
| Gemba walk como inspeção | as pessoas escondem problemas | perguntar em vez de auditar; tratar os problemas como uma dádiva |
| Ditar soluções na hora | a equipe deixa de aprender a resolver problemas, e o líder vira gargalo | orientar com perguntas e deixar a equipe desenvolver a solução |
| Sem tema e sem roteiro | a caminhada fica superficial | definir um foco, levar o padrão |
| Só os líderes falam | o conhecimento dos especialistas não é aproveitado | ouvir 80% do tempo |
| Sem acompanhamento | perda de confiança, "nada acontece mesmo" | feedback em até uma semana |
| Caminhadas irregulares | a caminhada parece um evento especial | ritmo fixo no trabalho padronizado do líder |
| Culpabilização | medo, problemas são escondidos | questionar o processo e o sistema, não as pessoas |

Muitos desses erros têm a mesma causa: a caminhada é entendida como controle. O post [Gemba walk mistakes: when the walk becomes an inspection](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/) aprofunda o tema. Womack descreve a própria atitude assim: "Nunca inventei nada. Apenas caminho, comento o que vejo e dou coragem às pessoas para tentarem" (citado no prefácio de John Shook) [15].

## Padrão de trabalho do líder: liderança como rotina

O padrão de trabalho do líder aplica o princípio do trabalho padronizado aos líderes. A LEI o descreve como "kaizen para a gestão": combinado com os comportamentos de liderança certos, o padrão de trabalho do líder desloca o papel dos gestores de principais solucionadores de problemas para a construção da capacidade de solução de problemas de suas equipes [18].

Em "Creating a Lean Culture", David Mann nomeia quatro elementos principais de um sistema de gestão lean: padrão de trabalho do líder, controles visuais, um processo diário de accountability e disciplina de liderança [19]. A parcela do trabalho padronizado diminui a cada nível da hierarquia: operadores podem trabalhar conforme o padrão 100% do tempo, um supervisor cerca de 80% do dia; em níveis mais altos, a parcela cai ainda mais [19].

### Exemplo: padrão de trabalho do líder para um supervisor de produção

| Horário | Atividade | Evidência |
|---|---|---|
| 6:00–6:10 | Passagem de turno, verificação do quadro em todas as linhas | Registro de passagem assinado |
| 6:10–6:30 | Participar de duas das reuniões escalonadas de nível 1 (em rodízio) | Lista de presença |
| 6:30–6:45 | Confirmação de processo: verificar um padrão em uma linha | Cartão de auditoria |
| 6:45–8:15 | Presença no chão de fábrica: apoiar paradas, resolver faltas de material e de pessoal, verificar os quadros | Anotações, lista de ações |
| 8:30–8:45 | Conduzir a reunião de nível 2 | Quadro de nível 2 |
| 8:45–9:00 | Preparar escalonamentos para o nível 3 | Lista de escalonamentos |
| 9:15–9:35 | Participar da reunião de nível 3 | Quadro de nível 3 |
| 10:00–11:00 | Orientar uma equipe de solução de problemas (A3) | Status do A3 |
| 13:00–13:30 | Gemba walk sobre um tema de foco | Anotações, ações |
| 13:30–14:00 | Preparar a passagem de turno | Registro de passagem |

O plano é um exemplo de prática, não uma afirmação de fonte. Em um turno das 6:00 às 14:00, ele estrutura bem mais de dois terços do dia; Mann descreve cerca de 80% como alcançável nesse nível [19]. O restante fica deliberadamente aberto para o inesperado, questões de pessoas e projetos. O próprio padrão de trabalho do líder é visível: muitas fábricas afixam as rotinas padronizadas de seus líderes no quadro e marcam os itens concluídos. Isso cria accountability nos dois sentidos.

### Confirmação de processo (layered process audit)

Um bloco fundamental do padrão de trabalho do líder é a confirmação de processo: líderes de diferentes níveis verificam, de forma breve e em um ritmo fixo, se um padrão está sendo seguido e se o padrão ainda se adequa. Vários níveis verificam os mesmos processos com frequências diferentes, por exemplo, o líder de equipe diariamente, o supervisor semanalmente, o gerente da fábrica mensalmente. Nas fábricas dos EUA, especialmente nas cadeias de fornecimento automotivo, a prática costuma ser conhecida como layered process audit (LPA). Desvios não são punidos; são tratados como sinal de um padrão inadequado ou de treinamento faltante.

## Andon: tornando os desvios visíveis em tempo real

A LEI define andon como uma ferramenta de gestão visual que mostra o status das operações em uma área de relance e sinaliza sempre que ocorre uma anormalidade [17]. O sinal é acionado por um cordão ou botão na estação de trabalho, ou automaticamente por um sensor da máquina. Na Toyota, a linha continua funcionando depois que o cordão é puxado enquanto a equipe tenta resolver o problema; se isso não der certo dentro do ciclo, a linha para em uma posição fixa no fim da estação [17]. O número da estação acesa chama o líder de equipe, que deve responder rapidamente [17].

No gerenciamento do chão de fábrica, o andon preenche a lacuna entre as reuniões programadas: a reunião de tier analisa o dia anterior e planeja o dia atual, enquanto o andon trata do que está acontecendo agora. Na Toyota, um líder de equipe (hancho) lidera uma equipe de cinco a oito pessoas, responde às paradas de linha e aos chamados de andon, conduz atividades de melhoria e verifica diariamente a aderência ao trabalho padronizado com folhas de auditoria [21]. Isso é importante ao transferir o modelo para fábricas ocidentais: o líder de equipe da Toyota é um funcionário horista, sem autoridade disciplinar e sem posição fixa na linha; ele domina todas as tarefas da equipe e substitui em pausas, ausências ou acúmulos de trabalho [21]. Se você acumular esse papel sobre um operador líder totalmente preso ao tempo de ciclo da linha, não obterá uma resposta rápida do andon. O mesmo vale para um líder de equipe responsável por 25 pessoas.

Os eventos de andon pertencem ao quadro: número de chamados por turno, tempo médio de resposta e os motivos mais frequentes. Muitos chamados não são um mau sinal no início; eles mostram que a equipe está tornando os problemas visíveis.

## Papéis e responsabilidades

| Papel | Tarefas na gestão do chão de fábrica |
|---|---|
| Gerente da fábrica | modelo de referência, facilita o tier 4, vai ao gemba regularmente, decide sobre recursos para escalonamentos, desdobra metas (por exemplo, por meio de hoshin kanri) |
| Gerente de departamento / de produção | facilita o tier 3, orienta os supervisores, garante que os níveis estejam vinculados |
| Supervisor / líder de turno | facilita o tier 2, confirmação de processo, orienta os líderes de equipe |
| Líder de equipe | facilita o tier 1, mantém o quadro com a equipe, responde ao andon, implementa a contenção |
| Operadores e técnicos | reportam desvios, contribuem com ideias, são responsáveis por ações, mantêm partes do quadro |
| Funções de apoio (qualidade, manutenção, cadeia de suprimentos, SMS) | participam dos tiers 2 e 3, assumem problemas escalonados, fornecem dados |
| Coach do chão de fábrica / especialista em lean ou melhoria contínua | acompanha as reuniões, dá retorno sobre a facilitação, treina na solução de problemas |
| Representantes dos funcionários (sindicato, comitê de segurança; na Alemanha, o conselho de trabalhadores) | envolvidos desde o início; garantem que os KPIs não sejam usados para monitorar o comportamento ou o desempenho de indivíduos (ver seção 13) |

A CETPM descreve coaches do chão de fábrica que observam as reuniões e dão retorno depois [3]. Esse papel costuma ser subestimado durante a implantação: um líder de equipe que nunca facilitou uma reunião precisa de retorno concreto nas primeiras semanas.

### Como muda o papel do líder

| Antes | Na gestão do chão de fábrica |
|---|---|
| resolve os problemas pessoalmente | desenvolve a capacidade de solução de problemas da equipe |
| recebe relatórios no escritório | vê a realidade no chão de fábrica |
| pergunta "Quem fez isso?" | pergunta "O que no processo permitiu isso?" |
| responde escalonamentos por e-mail | responde escalonamentos na próxima reunião |
| julga os KPIs | usa os KPIs para iniciar uma conversa |

## Cultura, segurança psicológica e regras de monitoramento de funcionários

A gestão à vista no chão de fábrica só funciona quando os problemas são nomeados abertamente. Isso soa óbvio, mas não é o caso em muitas organizações. Um campo vermelho no quadro que leva a críticas à equipe será pintado de verde na próxima vez.

A pesquisadora em comportamento organizacional Amy Edmondson, de Harvard, desenvolveu o conceito de segurança psicológica em equipes: "uma crença compartilhada pelos membros de uma equipe de que a equipe é segura para assumir riscos interpessoais" [23]. Seu estudo com 51 equipes de trabalho em um fabricante de móveis com cerca de 5.000 funcionários foi publicado na Administrative Science Quarterly em 1999 [23] e está entre os trabalhos mais citados sobre comportamento de aprendizagem em equipes. A implicação para a gestão à vista no chão de fábrica: somente em equipes psicologicamente seguras os erros são reportados, os quase acidentes são documentados e os padrões são questionados.

### Como os líderes constroem segurança psicológica no quadro

- **Vermelho é bem-vindo.** Agradeça a cada problema tornado visível. A reação ao primeiro campo vermelho define todos os que vêm depois.
- **Processo, não pessoa.** Pergunte sobre as condições, não sobre os culpados.
- **Mostre os seus próprios erros.** Líderes que nomeiam abertamente as próprias falhas reduzem o limiar para os demais.
- **Responda às escalações.** Pessoas que escalam e nunca recebem resposta param de escalar.
- **Implemente as ideias.** A implementação visível de sugestões é a forma mais forte de reconhecimento. O estudo do KIT e do IPRI criticou o fato de que os funcionários muitas vezes não conseguiam ver o status de suas sugestões, o que reduz a motivação [24].
- **Não puna os relatos de segurança.** A OSHA espera que os trabalhadores "não sofram retaliação" ao relatar lesões, doenças e riscos [49]; a reação no quadro é onde essa expectativa se torna real.

O post [Cultura de excelência operacional no chão de fábrica](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/) descreve como ancorar essa cultura no longo prazo; o compêndio [Excelência operacional](https://www.m365.fm/en/learn/operational-excellence/) a coloca em um contexto mais amplo. A Haufe Akademie apresenta o hansei, a prática japonesa de reflexão autocrítica, como um dos pilares de uma cultura positiva em relação aos erros [43].

### Regras de monitoramento de funcionários: lei trabalhista dos EUA e conselhos de empresa alemães

Um quadro digital que exibe dados de máquinas ao lado de logins de usuários pode ser interpretado como um sistema de monitoramento. O quanto isso importa depende de onde fica a fábrica. As informações a seguir são de caráter geral, não constituem aconselhamento jurídico; submeta qualquer implantação digital à revisão de um advogado trabalhista.

**Nos EUA.** Não existe um direito geral de cogestão comparável ao da Alemanha, mas várias regras se aplicam:

- **Fábricas sindicalizadas:** O NLRB tratou a instalação e o uso de câmeras de vigilância ocultas como matéria obrigatória de negociação (Colgate-Palmolive, 1997), posição que o Sétimo Circuito manteve em National Steel Corp. v. NLRB (2003) [54]. Se um quadro digital específico com dados pessoais está sujeito ao dever de negociar é uma questão caso a caso; o caminho seguro é envolver o sindicato antes da implantação.
- **Fábricas não sindicalizadas:** Em outubro de 2022, o então Procurador-Geral do NLRB emitiu o memorando GC 23-02, que argumentava que o monitoramento eletrônico intrusivo pode interferir nos direitos previstos na Seção 7 da NLRA dos funcionários e pedia a divulgação das tecnologias de monitoramento [52]. Em 14 de fevereiro de 2025, o Procurador-Geral Interino revogou esse memorando (GC 25-05) [53]. A própria NLRA não mudou, por isso o monitoramento que tende a inibir atividades protegidas continua sendo um risco.
- **Leis estaduais de notificação:** Alguns estados exigem aviso sobre monitoramento eletrônico. Nova York, por exemplo, obriga os empregadores a dar aviso prévio por escrito, no momento da contratação, aos funcionários cujo uso de telefone, e-mail ou internet é monitorado [55]. Um aplicativo de chão de fábrica que registra o uso individual do sistema pode se enquadrar nessas regras.
- **Notificação de segurança:** Como mostrado na seção 7, as regras da OSHA protegem os funcionários que relatam lesões [49][50]. Um quadro que aponta a pessoa que reportou um incidente enfraquece essa proteção.

**Na Alemanha (relevante para empresas dos EUA com fábricas na Alemanha ou matriz alemã).** Envolver o conselho de trabalhadores (Betriebsrat, o órgão eleito de representação dos empregados com direitos legais de cogestão) não é uma formalidade. A ifaa recomenda envolvê-lo desde o início e desenhar os KPIs de forma que não surja medo de vigilância [2]. Com painéis digitais que usam dados de máquinas e dados pessoais, aplica-se o § 87, parágrafo 1, n.º 6 da Lei Alemã de Constituição das Empresas (BetrVG): o conselho de trabalhadores tem voz sobre "a introdução e o uso de dispositivos técnicos destinados a monitorar o comportamento ou o desempenho dos empregados" [44]. Segundo o Tribunal Federal do Trabalho (BAG), basta que um sistema seja objetivamente adequado para coletar dados de comportamento ou desempenho; a intenção do empregador de monitorar não importa [48]. Isso geralmente se aplica ao Power BI, Power Apps ou a um MES com logins de usuários. O RGPD aplica-se além disso. Na prática, um acordo de empresa (Betriebsvereinbarung) define os detalhes.

**O que funciona nos dois países:** uma regra escrita que defina quais dados são mostrados em qual nível de agregação, quem pode ver quais relatórios, por quanto tempo os dados são mantidos e que os KPIs avaliam processos, não pessoas. Esse é o mesmo conteúdo que um acordo de empresa alemão cobre, e dá a um sindicato ou a uma força de trabalho nos EUA uma resposta clara para "Isso vai ser usado contra nós?"

## Como implementar o gerenciamento no chão de fábrica: um roteiro em seis fases

> **Em resumo:** comece com uma área-piloto, desenhe o painel com a equipe, execute-o por cerca de três meses com coaching e construa o próximo nível somente quando o de baixo funcionar de forma confiável.

A ifaa descreveu um modelo de implantação em seis fases e o testou em várias pequenas e médias empresas; a avaliação mostrou que o conceito pode ser introduzido com meios simples [2]. O roteiro abaixo se baseia nesse modelo e acrescenta o gemba walk, a cascata e a digitalização.

| Fase | Conteúdo | Participantes | Duração (valor de referência) |
|---|---|---|---|
| 1. Definir metas | definir metas, área-piloto e critérios de sucesso; visita guiada à fábrica | alta direção, gerência de produção, líder do projeto, facilitador | meio dia segundo a ifaa [2] |
| 2. Informar e criar consciência | sessão informativa com perguntas e respostas; envolver representantes dos empregados | liderança, gerentes, funcionários da área-piloto, sindicato ou conselho de trabalhadores quando aplicável | meio dia segundo o dado da ifaa [2] |
| 3. Introduzir | desenhar o painel com a equipe, escolher KPIs, praticar a facilitação | gerentes e funcionários da área-piloto, de 6 a 8 pessoas | dois blocos de meio dia de no máximo 4 horas cada, segundo a ifaa [2] |
| 4. Teste | reuniões diárias no chão de fábrica, coaching, melhoria iterativa do painel | equipe-piloto, coach | cerca de 3 meses segundo a ifaa [2] |
| 5. Verificação | observação neutra das reuniões, feedback | observadores internos ou externos | regularmente durante o teste [2] |
| 6. Validar e expandir | oficina de avaliação, padronizar painel e reunião, construir a cascata, outras áreas | todos os participantes do projeto, depois outras áreas | oficina de 2 a 3 horas segundo a ifaa [2], expansão conforme o porte da fábrica |

### Recomendações práticas para cada fase

**Fase 1:** Escolha uma área-piloto com processo estável, liderança motivada e um problema visível. A ifaa fala de um "farol" que carrega a expansão posterior [2]. Uma área afogada em caos é inadequada, porque ali a estabilidade precisa vir primeiro.

**Fase 2:** Explique o porquê, não apenas o quê. Deixe claro que os KPIs avaliam processos, não pessoas.

**Fase 3:** Deixe a equipe desenhar o painel. Comece com no máximo quatro a seis KPIs [3] e uma lista de ações simples. Um painel perfeito no primeiro dia não é necessário nem útil.

**Fase 4:** As primeiras semanas decidem. As reuniões levam mais tempo no início do que deveriam [3]. Um coach observa a reunião e dá ao facilitador um feedback privado depois. Orth descreve cerca de 15 minutos para isso, cobrindo um ponto forte, uma área de desenvolvimento e uma tarefa concreta [3]. Nas primeiras semanas isso compensa diariamente, depois semanalmente. Os gemba walks pelo próximo nível de liderança começam nesta fase.

**Fase 5:** Use uma avaliação simples (veja a verificação de maturidade abaixo) para checar se o sistema funciona.

**Fase 6:** Construa o nível 2 somente quando o nível 1 funcionar de forma confiável, depois os níveis 3 e 4. Substitua reuniões existentes em vez de acrescentar novas. Gelbrich aponta isso como um erro típico quando o gerenciamento no chão de fábrica não é usado para substituir reuniões existentes [3].

### Pré-requisitos e fatores de sucesso segundo a ifaa

O ifaa cita como pré-requisitos o comprometimento da gestão, um orçamento de tempo e dinheiro, a comunicação do projeto dentro da empresa, um estado-alvo definido (visão e missão), a convicção das pessoas envolvidas e o envolvimento do conselho de trabalhadores [2]. Para o sucesso, o documento também destaca uma gestão que participa das reuniões no chão de fábrica, metas claramente comunicadas e desdobradas em todos os níveis, participação e treinamento dos colaboradores, além de disciplina, consistência e constância, porque o shop floor management não é uma campanha pontual [2]. Em plantas dos EUA sem conselho de trabalhadores, a mesma lógica se aplica ao sindicato or, em uma planta não sindicalizada, à comunicação antecipada e aberta com a força de trabalho.

### Verificação de maturidade: a gestão no chão de fábrica está funcionando?

- [ ] O quadro foi atualizado hoje, e a equipe consegue explicar cada KPI.
- [ ] Todo KPI em vermelho tem uma ação com responsável e prazo definidos.
- [ ] As reuniões começam no horário e respeitam o tempo previsto.
- [ ] As escalações chegam ao nível seguinte no mesmo dia e recebem resposta.
- [ ] Os líderes fazem gemba walks em uma cadência fixa.
- [ ] As ações só são encerradas depois que o efeito é comprovado.
- [ ] O número de problemas e quase acidentes reportados aumentou, e não diminuiu.
- [ ] Pelo menos uma reunião existente foi substituída pela reunião de nível.
- [ ] Os processos melhorados estão documentados em padrões atualizados.
- [ ] Os colaboradores conseguem acompanhar o status de suas ideias.

Oito ou mais respostas "sim" indicam um sistema eficaz; menos de cinco indicam um quadro que é mais ritual do que ferramenta de liderança.

## Erros comuns e como corrigi-los

A partir de observações desde 2015 em cerca de 50 empresas alemãs de diversos setores, Gelbrich identificou dez razões comuns para o fracasso do shop floor management [3]. A tabela associa cada uma delas a contramedidas.

| Erro (segundo Gelbrich [3]) | Contramedida |
|---|---|
| expectativas irrealisticamente altas sem engajamento direto da gestão | o gerente da planta facilita pessoalmente o nível 4 e vai ao gemba regularmente |
| vínculo falho entre os níveis do shop floor management | cascata interligada, gatilhos de escalação definidos, dever de resposta |
| sobrecarga de conteúdo com informações desnecessárias | quatro a seis KPIs; remover do quadro tudo o que não for necessário |
| atualizações de informação complicadas e demoradas | simplificar a coleta de dados e automatizar onde fizer sentido |
| KPIs irrelevantes para o processo | rederivar os KPIs com as três perguntas orientadoras |
| KPIs que a equipe não consegue influenciar | transferi-los para o nível hierárquico superior |
| ciclos longos de atualização e informações desatualizadas | tornar a atualização um item fixo da passagem de turno |
| nenhuma contramedida quando desvios são encontrados | regra: nenhum vermelho sem ação |
| reuniões no chão de fábrica que se estendem demais, especialmente durante a implantação | limite de tempo, reuniões em pé, resolução de problemas fora da reunião |
| o shop floor management não substitui reuniões existentes | inventário de reuniões, eliminação de duplicidades |

Outros três erros aparecem com frequência na prática:

- **Teatro de KPIs:** os KPIs são apresentados, mas não discutidos. Falta a pergunta "O que fazemos agora?".
- **Turismo no gemba:** os líderes percorrem a planta sem tema, sem perguntas e sem acompanhamento.
- **Digitalizar cedo demais:** uma planta introduz software antes de as rotinas estarem estabelecidas. O que é digitalizado é um processo que ninguém pratica.

## Analógico ou digital? Gestão à vista digital comparada

A pergunta "quadro branco ou tela?" costuma ser tratada como uma questão de princípio. Ela pode ser respondida com sobriedade. A pesquisa disponível sugere que o status quo é majoritariamente analógico: no estudo do KIT e do IPRI (18 empresas), a gestão à vista era conduzida principalmente em papel e apenas parcialmente com apoio digital; somente cerca de 10 por cento das reuniões utilizavam um quadro digital de chão de fábrica, e a exibição digital de KPIs normalmente começava apenas no nível da média gerência [24][25]. O estudo também descreve transferências interrompidas entre papel, Excel e OneNote, sem um sistema líder, o que dificulta o acompanhamento entre os níveis [24].

| Critério | Quadro analógico | Quadro digital |
|---|---|---|
| Custo inicial | muito baixo | licenças, hardware, integração |
| Apropriação prática | a equipe escreve nele, forte identificação | risco de a equipe apenas consumir a informação |
| Atualidade | depende da atualização manual | automática, até quase em tempo real |
| Qualidade dos dados | erros de transcrição, lacunas | consistentes, desde que as fontes sejam confiáveis |
| Escalonamento entre níveis | manual, sujeito a erros | integral, rastreável |
| Acompanhamento de ações | disciplina individual | apoiado por sistema, com prazos e lembretes |
| Equipes distribuídas, múltiplas unidades | não possível | possível |
| Histórico e análise | fotos, pastas | analisável, tendências, padrões |
| Resiliência | sempre funciona | depende de rede e sistemas |
| Regras para monitoramento de funcionários | normalmente pouco críticas | recomendadas regras escritas de dados (sindicato, legislação estadual; acordo de empresa na Alemanha) |
| Segurança de OT | não é um problema | necessárias segmentação de rede e controle de acesso (ver seção 18) |

### Qual abordagem usar e quando?

- **Comece analógico** quando as rotinas forem novas, a equipe for pequena e os KPIs forem fáceis de coletar manualmente. O quadro branco força você a manter o processo enxuto.
- **Adote o modelo híbrido** quando os dados das máquinas fluírem automaticamente para uma tela, mas as ações e ideias ainda forem mantidas manualmente no quadro. Para muitas fábricas, esta é a melhor solução de compromisso.
- **Expanda digitalmente** quando for preciso vincular vários níveis, turnos ou unidades, quando a coleta manual de dados exigir esforço excessivo ou quando ações se perderem entre os níveis.

A CETPM refere-se a um modelo de digitalização em cinco fases, de Müller-Seegers: definição do projeto e das metas, teste de fornecedores e seleção da ferramenta, piloto (quatro semanas no máximo), fase de ajustes (somente se necessária) e implantação e operação; no conjunto, ele estima cerca de seis meses [3]. Mais importante do que a ferramenta é a ordem: primeiro a rotina, depois o digital. A publicação [Shop floor optimization: ways to improve flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/) mostra como melhorar o fluxo de materiais em paralelo.

## Construindo um quadro digital de chão de fábrica com o Microsoft 365

> **Em resumo:** o Teams fornece o espaço, o Power BI o painel de KPIs, o Power Apps a captura de dados, as Listas a lista de ações e o Fabric os alertas em tempo real. As maiores alavancas são as licenças para visualizadores, o intervalo de atualização do Power BI e o modelo de dados.

Muitos fabricantes já usam o Microsoft 365 para e-mail, Teams e documentos. Faz sentido construir o quadro digital de chão de fábrica onde os funcionários já trabalham. Os blocos de construção a seguir estão documentados no Microsoft Learn; verifique os requisitos de licença e a disponibilidade no seu próprio tenant antes de iniciar um projeto. Fornecedores do setor público e de defesa dos EUA que usam as nuvens governamentais da Microsoft (GCC, GCC High) devem verificar separadamente a disponibilidade dos recursos nesses ambientes.

### Arquitetura de referência em resumo

| Função do quadro | Bloco de construção Microsoft | O que faz (segundo a documentação da Microsoft) |
|---|---|---|
| Espaço de comunicação por área | Microsoft Teams (uma equipe por área, um canal por linha ou nível) | canais com guias para quadro, ações e aplicativos |
| Visualizar KPIs | Power BI, incorporado como guia no Teams | relatórios interativos em canais e chats, pré-visualização de links, notificações no feed de atividades [28] |
| KPIs com metas | Métricas do Power BI (scorecards) | métricas com responsáveis, valor atual e meta, status, verificações; como guia em canais ou reuniões [31] |
| Captura de dados na estação de trabalho | Power Apps (aplicativo de tela como guia do Teams) | telas de entrada personalizadas, por exemplo, para motivos de parada, sucata, ideias [30] |
| Lista de ações, controle de problemas | Microsoft Lists (por exemplo, o modelo "Rastreador de problemas") ou Planner | listas com exibições, regras e notificações, armazenadas no SharePoint [38] |
| Tarefas padronizadas entre unidades | Planner com publicação de tarefas | distribui listas de tarefas a muitas equipes e acompanha a conclusão por local [37] |
| Comunicação de turno | Aplicativos do Teams para trabalhadores de linha de frente (Shifts, Walkie Talkie, Approvals, Updates) | escalas de turno, comunicação por pressionar para falar, aprovações, atualizações recorrentes [35][36] |
| Dados em tempo real e alertas | Microsoft Fabric Real-Time Intelligence (Eventstream, Eventhouse, Real-Time Dashboard, Activator) | captura, analisa e visualiza dados em streaming e age automaticamente sob determinadas condições [32][33] |

### Power BI como painel de KPIs

Relatórios do Power BI podem ser incorporados como guia em um canal do Teams, para que a equipe veja e discuta os KPIs onde já se comunica [28]. Três pontos são importantes na prática:

1. **Permissões:** incorporar um relatório no Teams não concede automaticamente aos usuários permissão para visualizá-lo; as permissões precisam ser concedidas explicitamente [28].
2. **Licenças:** usuários com licença gratuita do Fabric podem visualizar conteúdo em um workspace em uma capacidade Premium (SKU P) ou em uma capacidade Fabric F64 ou superior; criar e compartilhar exige Power BI Pro ou Premium Per User [28]. Abaixo de F64, portanto, cada visualizador precisa de uma licença Pro ou PPU. Com muitos visualizadores no chão de fábrica, este é o principal fator de custo; esclareça o licenciamento para telas de exibição na linha com seu parceiro de licenciamento Microsoft.
3. **Limitações:** painéis do Power BI (diferentemente dos relatórios) não podem ser incorporados na guia do Power BI, e a guia não oferece suporte a filtros por URL [28].

**Quão atual pode ser um quadro do Power BI?** A atualização automática de página funciona para fontes DirectQuery, Direct Lake e alguns cenários de conexão ao vivo, mas não para o modo de importação [29]. Em capacidade compartilhada (típica apenas com licenças Pro), o intervalo mínimo é de 30 minutos e a detecção de alterações não está disponível. Em capacidade dedicada (Fabric F, Premium P) e com Premium Per User, intervalos de até um segundo são possíveis com DirectQuery, se o administrador da capacidade permitir; o intervalo mínimo padrão é de cinco minutos, e de cinco segundos para detecção de alterações [29]. Isso basta para um quadro que mostra unidades por hora; para funções reais de andon, o Real-Time Intelligence é a escolha mais adequada.

### Power Apps para captura de dados na estação de trabalho

Aplicativos de tela criados com o Power Apps podem ser adicionados a um canal do Teams pela guia "Power Apps", desde que o aplicativo tenha sido compartilhado antes com os usuários [30]. Aplicativos típicos para o chão de fábrica:

- captura do motivo de parada com alguns botões grandes (por exemplo, "falta de material," "quebra de ferramenta," "qualidade"),
- captura de sucata e retrabalho por hora,
- ideias e sugestões de melhoria com foto,
- uma lista de verificação digital de gemba walk com observações e ações,
- confirmação de processo (auditoria de processo em camadas) em tablet.

A Microsoft lista limitações conhecidas, por exemplo que sensores como localização ou bússola não têm suporte no aplicativo desktop do Teams e que anexos não podem ser baixados no aplicativo móvel do Teams [30]. Importante para a decisão de arquitetura: os ambientes do Dataverse for Teams estão descontinuados [30]. Segundo a Microsoft, a partir de 15 de novembro de 2026 não é mais possível criar novos ambientes do Dataverse for Teams; ambientes que não tiverem sido atualizados são suspensos em 15 de setembro de 2027 e desativados em 30 de outubro de 2027 [45]. Novas soluções devem, portanto, ser construídas em um ambiente Dataverse regular, em listas do SharePoint ou em outras fontes de dados.

**A questão de licenciamento do Power Apps:** tabelas do Dataverse, conectores premium e gateways de dados locais (por exemplo, para um banco de dados MES na fábrica) exigem direitos premium do Power Apps [46]. Um aplicativo de captura baseado em listas do SharePoint normalmente funciona com os direitos incluídos no Microsoft 365; o Power Platform Licensing Guide descreve o escopo exato. Essa bifurcação frequentemente define o custo por usuário na linha.

### Ações e tarefas

O Microsoft Lists, utilizável como guia no Teams, é uma boa opção para a lista de ações. A Microsoft descreve o Lists como uma ferramenta para acompanhar informações como problemas, ativos, rotinas ou incidentes, com exibições, regras e notificações personalizáveis; há um modelo "Issue tracker" disponível, e os dados ficam no site de equipe do SharePoint [38]. Uma lista com as colunas problema, KPI, causa raiz, ação, responsável, data de vencimento, status, efeito verificado e nível de escalonamento espelha a coluna de ações do quadro. Um filtro por nível mostra exatamente os itens relevantes em cada reunião de cada nível.

Rotinas padronizadas, como verificações diárias de 5S ou confirmações semanais de processo em todas as linhas, podem ser distribuídas com a publicação de tarefas no Planner. A Microsoft descreve como gerentes de operações podem publicar listas de tarefas para equipes em uma hierarquia definida e acompanhar a conclusão por meio de relatórios por tarefa e por lista; as tarefas podem conter listas de verificação com até 20 itens [37].

### Tempo real e alertas com o Microsoft Fabric

Para fábricas que querem usar dados de máquinas em tempo real, o Microsoft Fabric Real-Time Intelligence oferece vários blocos de construção [32]:

- **Eventstream** captura, transforma e roteia grandes volumes de dados em tempo real sem código; os conectores incluem MQTT, Apache Kafka e captura de dados de alteração de bancos de dados. Fontes do Azure, como Event Hubs e IoT Hub, estão disponíveis no Real-Time hub.
- **Eventhouse** é otimizado para eventos de streaming baseados em tempo; as consultas usam KQL (Kusto Query Language) ou, no KQL queryset, T-SQL.
- **Real-Time Dashboard** visualiza dados em movimento.
- **Activator** monitora fluxos de dados com baixa latência (abaixo de um segundo para regras sem estado sobre dados de streaming) e dispara ações quando limites são atingidos ou padrões são detectados, incluindo a ausência de dados. As ações incluem mensagens no Teams para pessoas, grupos ou canais, e-mails, fluxos do Power Automate e itens do Fabric, como pipelines ou notebooks [33].

A Microsoft cita explicitamente manufatura e IoT como cenários [32]. Para a gestão no chão de fábrica, isso significa que uma regra do Activator pode, por exemplo, publicar uma mensagem no canal Teams da linha quando uma máquina estiver parada por mais tempo que um limite definido. Trata-se de um andon digital que chega ao líder de equipe em seu smartphone. Ele complementa o cordão de parada e a torre de sinalização na linha, mas não os substitui, enquanto nem todo líder de equipe tiver um telefone corporativo.

### Exemplo: um quadro de nível 1 no Teams

| Guia do canal | Conteúdo | Bloco de construção |
|---|---|---|
| "Board" | página SQDCP com status vermelho/verde, meta por hora vs. realizado, 3 principais motivos de parada | relatório do Power BI |
| "Capture" | motivos de parada, sucata, ideias | aplicativo de tela do Power Apps |
| "Actions" | lista de ações filtrada para o nível 1 | Microsoft Lists |
| "Routines" | verificações diárias, 5S, confirmação de processo | Planner (tarefas publicadas) |
| "Goals" | metas da área com check-ins | Métricas do Power BI |
| Publicações do canal | escalonamentos, mensagens andon, passagem de turno | Teams, Activator, Power Automate |

### Plano de implementação: seis etapas até o seu primeiro quadro digital de nível 1

Para administradores do Microsoft 365, a sequência a seguir já se mostrou eficaz. Ela pressupõe que a equipe piloto já trabalhe com um quadro analógico.

1. **Fotografe o quadro e defina os KPIs.** Copie os campos e KPIs do quadro analógico; para cada KPI, defina fórmula, fonte, meta e necessidade de atualização.
2. **Crie a equipe e os canais.** Uma equipe por área, um canal por linha ou nível; permissões por grupos em vez de por indivíduos.
3. **Monte a lista de ações no Microsoft Lists.** Colunas como em "Ações e tarefas" acima, uma visualização por nível, lembrete na data de vencimento.
4. **Crie o aplicativo de captura.** Um aplicativo de tela (canvas) com poucos botões grandes para motivos de parada e refugo; dados em listas do SharePoint ou no Dataverse (atenção à questão de licenciamento).
5. **Conecte o relatório do Power BI.** Uma página de relatório por quadro, lógica vermelho/verde em relação às metas, DirectQuery ou Direct Lake se for necessária atualização da página; incorpore como guia no canal e conceda acesso de leitura.
6. **Teste por quatro semanas na reunião e depois expanda.** Somente quando a equipe executar o quadro digital na própria reunião do nível 1 é que entram os alertas do Activator, as rotinas do Planner e a ligação com o nível 2.

Acorde as regras de dados com os representantes dos empregados antes da etapa 4 (e, na Alemanha, com o conselho de trabalhadores), pois a partir dessa etapa podem ser criados dados rastreáveis até indivíduos.

### O que o Microsoft 365 não substitui

O Microsoft 365 é um conjunto de ferramentas, não um sistema acabado de gestão à vista no chão de fábrica. Você mesmo precisa projetar a lógica de cascateamento, as regras de escalonamento, a ligação entre KPI, ação e efeito verificado, e a disciplina de facilitação. Sem um modelo de dados claro, rapidamente se chega a uma coleção de listas e relatórios desconectados, exatamente as quebras de passagem entre ferramentas que a pesquisa critica na gestão à vista analógica [24]. Verifique também cedo a questão do hardware: telas grandes na linha, tablets robustos e contas de dispositivo para equipamentos compartilhados geram esforço próprio.

## Integração de dados: MES, ERP e dados de máquinas

> **Em resumo:** Unidades e paradas vêm automaticamente da máquina ou do MES; os motivos de parada e as ideias são capturados de forma simples, manualmente. Cada KPI é definido uma única vez e calculado da mesma forma em todos os níveis.

Um quadro digital só é tão bom quanto os seus dados. Fontes típicas:

| Fonte | Dados para o quadro | Caminho típico |
|---|---|---|
| ERP (por exemplo, SAP, Microsoft Dynamics 365) | ordens, quantidades planejadas, datas de entrega, backlog | exportação de dados ou conector para Power BI ou Fabric |
| MES / coleta de dados de produção e máquinas | unidades, paradas, motivos de parada, OEE, refugo | conexão com banco de dados ou API, replicação no Fabric |
| Controles de máquina (CLP, OPC UA) | estados, contadores, valores de processo | gateway de borda, por exemplo, Azure IoT Operations com o conector OPC UA, depois via MQTT |
| Sistema de gestão da qualidade (QMS) | resultados de inspeção, reclamações | conexão com banco de dados ou API |
| Sistemas de RH e escalas / Turnos | presença, escala de turnos | interface, agregada |
| Captura manual | motivos de parada, ideias, eventos de segurança | Power Apps, Microsoft Lists |

Em termos da ISA-95 (ANSI/ISA-95, internacionalmente IEC 62264), o quadro se situa acima do nível 3 (gestão de operações de manufatura, como o MES) e do nível 4 (planejamento empresarial e logística, como o ERP); a norma trata principalmente da interface entre esses dois níveis [56]. Usar o seu vocabulário para ordens, materiais e equipamentos facilita alinhar o modelo de dados do quadro com o MES e o ERP.

Para a conexão de máquinas, a Microsoft descreve o conector para OPC UA no Azure IoT Operations: ele se conecta a servidores OPC UA, lê dados e os publica como mensagens JSON no formato OPC UA PubSub para o broker MQTT; também pode descobrir ativos automaticamente [34]. A partir daí, os fluxos de dados do Azure IoT Operations encaminham os dados para destinos como o Microsoft Fabric OneLake, o Azure Data Explorer ou um endpoint Kafka [47]. A documentação analisada aqui não descreve um conector OPC UA diretamente no Fabric; o caminho passa pelo gateway de borda.

Assim que as redes de máquinas são conectadas a serviços em nuvem, a segurança de OT passa a fazer parte do projeto. A série ISA/IEC 62443 trata da segurança de sistemas de automação e controle industrial e conecta operações e TI [57]; o NIST Cybersecurity Framework (CSF) 2.0, publicado em 26 de fevereiro de 2024, se descreve como uma taxonomia de resultados de alto nível em cibersegurança e pode servir de referência para governar esse trabalho [59]. Um quadro no chão de fábrica deve ler dados da rede OT, não abrir um caminho para dentro dela.

### Princípios para a arquitetura de dados

1. **Uma verdade por KPI.** Defina cada KPI uma única vez (fórmula, fonte, granularidade) e use essa definição em todos os níveis. Assim, o OEE no painel do nível 1 coincide com o OEE no relatório da fábrica.
2. **Automatize o que é estável.** Unidades e paradas vêm da máquina ou do MES. Os motivos de parada que exigem julgamento humano são registrados manualmente, de forma simples e rápida.
3. **Latência compatível com a decisão.** O nível 1 precisa de valores horários ou em tempo real; o nível 4, de valores diários ou semanais. Nem tudo precisa ser em tempo real.
4. **Privacidade e regras para os colaboradores desde o início.** Dados pessoais são agregados; papéis e permissões são documentados.

O compêndio [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) aborda essas questões de TI industrial em profundidade, e [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) mostra para onde os dados da fábrica em tempo real levam em seguida.

## Suporte de software: o exemplo do iFAKT Polaris

> **Nota: O autor trabalha na iFAKT GmbH.**

Além de construir o seu próprio painel com o Microsoft 365, existem softwares especializados em gestão lean digital. Um exemplo é o [Polaris](https://www.m365.fm/entity/polaris/), da [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), com sede em Stuttgart, Alemanha. As soluções Polaris estão listadas no Microsoft AppSource, incluindo o Polaris VSM, para mapeamento digital do fluxo de valor [39], e o Polaris BSM, para modelagem de processos de negócio na gestão lean digital [40]. O compêndio [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) descreve a família de produtos em detalhes.

Segundo o fornecedor, dois módulos são relevantes para a gestão no chão de fábrica [unverified: informação do fornecedor, não confirmada de forma independente]:

- **[Polaris Operator](https://www.m365.fm/entity/polaris-operator/)** leva as tarefas diretamente ao chão de fábrica, por exemplo ações de reuniões por níveis ou de gemba walks, para que cheguem aos responsáveis na linha e sua conclusão possa ser acompanhada.
- **[Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)** exibe KPIs em dashboards e dá suporte ao quadro de KPIs do painel nos diferentes níveis.

Avaliação: uma solução especializada também não desenha por você a cascata, as regras de escalonamento e a disciplina de facilitação, assim como uma solução própria não o faria. Ela pode, porém, pré-estruturar a ligação entre KPI, ação e efeito comprovado e, com isso, reduzir o trabalho de modelagem dos seus próprios dados. O que importa é se a solução se encaixa no seu ambiente de TI atual; a listagem no AppSource indica foco no ecossistema Microsoft.

Além do Polaris existem muitos outros fornecedores, como módulos de chão de fábrica de fornecedores de MES ou plataformas independentes de lean e de reuniões por níveis. Independentemente do fornecedor, estas perguntas ajudam na seleção:

- O software mapeia a cascata com escalonamento e resposta em vários níveis?
- Uma ação só pode ser encerrada depois que seu efeito for comprovado?
- Quais interfaces com ERP, MES e máquinas existem, e quem as mantém?
- O software consegue agregar KPIs da forma que suas regras de dados exigem (acordo sindical, legislação estadual, acordo de empresa)?
- O que acontece quando a rede na linha cai?
- Como as licenças de visualização são cobradas, e quanto custa uma tela na linha?

Sobre a empresa: a iFAKT GmbH tem sede na Curiestrasse 2, 70563 Stuttgart, Alemanha (registro comercial Stuttgart HRB 22661) [61]. Segundo a empresa, foi fundada em 2001 e tem cerca de 25 funcionários (informação da empresa, não verificada de forma independente). Seu site exibe o selo da TÜV SÜD para as certificações ISO 9001 e ISO/IEC 27001 [61], e ela ficou em segundo lugar na categoria de produção do Best of Technology Award 2025 do semanário de negócios alemão WirtschaftsWoche, com seu sistema Polaris IMS [60].

## Glossário

| Termo | Significado |
|---|---|
| A3 | solução de problemas em uma única folha de papel A3 (nos EUA, normalmente 11 × 17 pol.): problema, situação atual, causa raiz, meta, contramedidas, acompanhamento |
| Andon | sinal (cordão, botão, luz) que torna um desvio visível imediatamente e pede ajuda |
| Escalonamento | encaminhar um problema ao nível seguinte quando a equipe não consegue resolvê-lo sozinha |
| Gemba | termo japonês para "o lugar real"; onde o valor é criado |
| Gembutsu | a "coisa real" no gemba: máquina, ferramenta, material, peça defeituosa |
| Genchi genbutsu | ir ver com os próprios olhos e verificar os fatos no local |
| Hoshin kanri | método para desdobrar as metas da empresa em todos os níveis (também chamado de desdobramento de políticas) |
| Auditoria de processo em camadas (confirmação de processo) | verificação curta de um padrão por líderes de vários níveis, em um ritmo fixo |
| Trabalho padronizado do líder | rotinas diárias fixas e visíveis para os líderes |
| Obeya | "grande sala"; uma sala de reuniões com todos os KPIs e projetos nas paredes |
| OEE | eficácia global do equipamento: disponibilidade × desempenho × qualidade |
| SQDCP | estrutura de quadro por segurança, qualidade, entrega, custo, pessoas (também SQCDP) |
| Reunião de nível | reunião curta e regular no quadro, em um nível específico da hierarquia |
| TRIR | taxa total de incidentes registráveis: casos registráveis pela OSHA × 200.000 / horas trabalhadas |
| Yokoten | transferência de uma solução comprovada para outras linhas ou fábricas |
| DirectQuery / Direct Lake | modos de conexão do Power BI nos quais os dados são consultados diretamente, em vez de importados; necessários para a atualização automática de páginas |
| F64 | tamanho de uma capacidade do Microsoft Fabric a partir da qual os visualizadores podem ver o conteúdo sem licença paga do Power BI |

## FAQ: gestão à vista no chão de fábrica e gemba walks

### O que é gestão à vista no chão de fábrica, em termos simples?

Gestão à vista no chão de fábrica significa que os líderes conduzem onde o trabalho é feito. A equipe se reúne brevemente todos os dias diante de um quadro com alguns KPIs, discute os desvios, acorda ações e encaminha ao nível seguinte de liderança os problemas que não consegue resolver. Os líderes vão ao chão de fábrica regularmente para ver com os próprios olhos.

### Quais são os elementos da gestão à vista no chão de fábrica?

Seis elementos: líderes presentes no chão de fábrica (gemba), gestão visual, poucos KPIs que a equipe consegue influenciar, uma cadência fixa de reuniões em reuniões de nível, solução estruturada de problemas e padronização. Institutos de pesquisa alemães agrupam-nos de forma um pouco diferente [2][4], e páginas de fornecedores norte-americanos costumam falar em cinco pilares, mas o conteúdo é o mesmo.

### O que significa gemba?

Gemba (também genba) é uma palavra japonesa que significa "o lugar real". No lean, indica o local onde o valor é criado, normalmente o chão de fábrica [7][8]. Genchi genbutsu, "ir ver com os próprios olhos", é a ação relacionada: gemba é um lugar, genchi genbutsu é o que se faz nele [8].

### O que é um gemba walk?

Um gemba walk é uma visita planejada de um líder ao local onde o valor é criado. O líder observa o trabalho, compara-o com o padrão e faz perguntas abertas para entender a situação antes de agir [7]. Uma boa caminhada tem um tema, começa no quadro e termina com retorno à equipe.

### Quais são os três princípios de um gemba walk?

A versão mais citada vem do ex-presidente da Toyota, Fujio Cho: "Ir ver, perguntar por que, demonstrar respeito" [15]. A LEI acrescenta três aspectos a observar na caminhada: propósito (que problema o processo resolve para o cliente), processo (como ele realmente funciona) e pessoas (se estão engajadas em melhorá-lo) [7].

### Qual é a diferença entre gestão à vista no chão de fábrica e gemba walk?

A gestão à vista no chão de fábrica é todo o sistema de liderança: quadro, KPIs, reuniões de nível, solução de problemas e padrões. O gemba walk é uma rotina dentro desse sistema: o líder vai até onde o trabalho é feito, observa e faz perguntas para entender a situação antes de agir [7].

### Quanto deve durar uma reunião no chão de fábrica?

Cerca de 10 a 15 minutos no nível da equipe e 20 a 30 minutos no nível gerencial. Gelbrich cita 10 a 12 minutos no nível operacional e 20 a 30 minutos no nível gerencial; durante a implantação, as reuniões costumam ser mais longas [3].

### O que é uma reunião de nível 1, nível 2 e nível 3?

Uma reunião de nível é uma reunião curta e padronizada no quadro, em um nível da organização. O nível 1 é a equipe da linha de frente, o nível 2 são os supervisores de uma área, o nível 3 são os gerentes de departamento e o nível 4 é a liderança da fábrica [58]. As reuniões são escalonadas para que os problemas possam ser escalados para cima no mesmo dia.

### O que é um quadro de gestão à vista no chão de fábrica?

Um quadro de chão de fábrica (também chamado de huddle board ou quadro SQDCP) é o quadro branco ou a tela onde a equipe se reúne para a reunião de nível. Ele mostra alguns KPIs com meta e tendência, ações abertas com responsáveis e prazos, e escalonamentos para o nível seguinte. Um layout típico tem colunas por SQDCP e linhas para status, tendência e ações.

### O que significa SQDCP?

SQDCP significa segurança, qualidade, entrega (delivery), custo e pessoas (também escrito SQCDP). A ordem é a mensagem: a segurança é discutida em primeiro lugar em toda reunião. Existem variantes como SQDC, SQDCM (moral) ou SQDCE (meio ambiente).

### Quais KPIs devem estar em um quadro de chão de fábrica?

Quatro a seis KPIs que a equipe consegue influenciar [3], organizados por SQDCP: segurança (lesões registráveis, quase acidentes), qualidade (sucata, rendimento de primeira passagem), entrega (meta vs. realizado, entrega no prazo), custo ou produtividade (OEE, unidades por hora) e pessoas (presença, polivalência, ideias).

### Com que frequência se deve fazer um gemba walk?

Não existe um número universal. O que importa é um ritmo fixo e confiável, ancorado no trabalho padronizado dos líderes. Na prática, supervisores e líderes de turno fazem uma caminhada diária focada em um tema, gerentes de departamento várias vezes por semana e gerentes de fábrica pelo menos semanalmente; caminhadas pelo fluxo de valor acontecem conforme a necessidade. Os líderes de equipe já estão no gemba o dia inteiro e usam, em vez disso, a confirmação diária de processo. Mais importante que a frequência é que cada caminhada tenha um tema e um acompanhamento.

### Quem deve fazer um gemba walk?

Líderes em todos os níveis, cada um com um foco diferente: supervisores e gerentes de departamento fazem principalmente caminhadas sobre o sistema de gestão (os quadros, padrões e escalonamentos estão funcionando?), a liderança da fábrica faz caminhadas pelo fluxo de valor entre funções, e especialistas fazem caminhadas focadas em problemas [14]. Os líderes de equipe trabalham no gemba de qualquer forma e usam a confirmação de processo. Leve junto as pessoas que atuam no processo, como recomenda a LEI [7].

### Quanto tempo deve durar um gemba walk?

As fontes analisadas não indicam uma duração fixa. Uma caminhada focada em uma área costuma levar de 20 a 45 minutos; uma caminhada pelo fluxo de valor de uma família de produtos pode levar meio dia. Observar vários ciclos em um mesmo posto de trabalho importa mais do que percorrer muitas áreas.

### Que perguntas fazer em um gemba walk?

Perguntas abertas funcionam melhor, como "Como este passo normalmente acontece?", "Como você percebe que algo está errado?", "Qual foi o último problema que você resolveu aqui?" e "O que eu posso fazer para apoiar você?". O banco completo de perguntas está na seção sobre gemba walk.

### Um gemba walk é o mesmo que management by walking around?

Não. O MBWA vem da Hewlett-Packard e ficou conhecido por meio de "In Search of Excellence" (1982) [16]; ele trata principalmente de proximidade e troca informal. O gemba walk é mais estruturado, referencia padrões e KPIs e serve para entender o processo e desenvolver a capacidade de resolução de problemas.

### A gestão visual de chão de fábrica funciona em pequenas empresas?

Sim. O ifaa testou seu modelo de implantação em várias empresas pequenas e médias e constatou que ele pode ser introduzido com meios simples [2]. Em pequenas empresas, dois níveis costumam ser suficientes: uma reunião de equipe e uma reunião de liderança.

### Preciso de software para a gestão de chão de fábrica?

Não para começar. Um quadro branco, ímãs e marcadores bastam para criar as rotinas. O software compensa quando vários níveis, turnos ou unidades precisam estar conectados, quando a coleta manual de dados exige esforço demais ou quando as ações se perdem entre os níveis [24].

### Posso montar um quadro digital de chão de fábrica com Microsoft Teams e Power BI?

Sim. Relatórios do Power BI podem ser incorporados como abas em canais do Teams [28], o Power Apps cuida da coleta de dados na estação de trabalho [30], o Microsoft Lists gerencia a lista de ações [38] e o Microsoft Fabric Real-Time Intelligence envia alertas em tempo real [32][33]. Atenção aos requisitos de licença para os visualizadores (visualizadores gratuitos só a partir de capacidade Fabric F64 ou Premium), aos intervalos mínimos de atualização automática de página no Power BI (30 minutos em capacidade compartilhada) e à descontinuação do Dataverse for Teams [28][29][45].

### Quanto tempo leva para implantar a gestão de chão de fábrica?

Para uma área-piloto, o modelo do ifaa prevê uma fase de teste de cerca de três meses após a definição de metas e as oficinas de informação e introdução [2]. Estender a implantação a toda a fábrica, com uma cascata funcionando em todos os níveis, leva consideravelmente mais tempo, dependendo do porte, porque cada nível deve funcionar de forma confiável antes de se construir o seguinte.

## Conclusão

A gestão no chão de fábrica não é um quadro e não é um software, mas um sistema de liderança com mecânica clara: os líderes vão até onde o valor é criado, a equipe torna os desvios visíveis com alguns KPIs que ela consegue influenciar, reuniões curtas e programadas por níveis levam os problemas no mesmo dia até onde podem ser resolvidos, e cada solução só se torna o novo padrão depois que seu efeito é comprovado. O gemba walk é a rotina pela qual os líderes entendem em vez de presumir.

A experiência documentada mostra duas coisas. Primeiro, a gestão no chão de fábrica está difundida, mas costuma falhar pelos mesmos padrões: falta de vínculos entre os níveis, quadros sobrecarregados, reuniões que se prolongam demais e falta de envolvimento da gestão [3]. Segundo, o status quo é majoritariamente analógico, com passagens de informação rompidas entre as ferramentas, o que dificulta a escalação e o acompanhamento das ações [24]. A digitalização pode ajudar, mas somente quando as rotinas já são praticadas.

Para empresas que usam o Microsoft 365, um quadro digital com Teams, Power BI, Power Apps, Lists e Fabric é uma opção óbvia. Planeje o modelo de dados, as licenças, os intervalos de atualização e as regras de dados de funcionários desde o início. E comece onde todo projeto de implantação deve começar: com uma equipe piloto, um quadro simples, uma janela de tempo de 15 minutos e um líder que ouve.

## Leitura complementar no m365.fm

**Posts do blog**
- [O que é um gemba walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/)
- [Checklist e perguntas para o gemba walk](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/)
- [Gemba walk vs. management by walking around](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/)
- [Preparação do gemba walk: equipe e papéis](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/)
- [Erros no gemba walk: quando a caminhada vira inspeção](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/)
- [Cultura de excelência operacional no chão de fábrica](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/)
- [Otimização do chão de fábrica: caminhos para melhorar o fluxo](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/)

**Termos**
[Gestão no chão de fábrica](https://www.m365.fm/entity/shop-floor-management/) · [Gemba walk](https://www.m365.fm/entity/gemba-walk/) · [Reunião por níveis](https://www.m365.fm/entity/tier-meeting/) · [Gestão visual](https://www.m365.fm/entity/visual-management/) · [Resolução de problemas A3](https://www.m365.fm/entity/a3-problem-solving/) · [Trabalho padronizado](https://www.m365.fm/entity/standard-work/) · [5S](https://www.m365.fm/entity/5s/) · [Indicador-chave de desempenho](https://www.m365.fm/entity/key-performance-indicator/) · [Micro paradas](https://www.m365.fm/entity/micro-stops/) · [Taxa de refugo](https://www.m365.fm/entity/scrap-rate/) · [Gestão Lean](https://www.m365.fm/entity/lean-management/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)

**Guias relacionados**
- [Manufatura enxuta](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Excelência operacional](https://www.m365.fm/en/learn/operational-excellence/)
- [KPIs de manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Mapeamento do fluxo de valor](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Gêmeo digital na manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [TI de manufatura com Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** é o apresentador do m365.fm e trabalha na [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) em Stuttgart, Alemanha. No m365.fm ele escreve sobre gestão enxuta (lean), excelência operacional e a digitalização da manufatura com Microsoft 365 e Azure. Seu foco está em como rotinas lean comprovadas, como o shopfloor management e o gemba walk, podem funcionar em conjunto com plataformas de dados modernas sem perder seu núcleo.

**Nota: O autor trabalha na iFAKT GmbH.**

# Sources

All sources accessed on November 20, 2026. Sources 1 to 48 are carried over from the German version; sources 49 to 61 were added and verified for the US version. German-language sources are marked (German).

1. Shopfloor Management. Wikipedia (German). https://de.wikipedia.org/wiki/Shopfloor_Management
2. Conrad, R. W.; Eisele, O.: Shopfloor-Management: Führen am Ort der Wertschöpfung. In: Betriebspraxis & Arbeitsforschung 235, ifaa – Institut für angewandte Arbeitswissenschaft e. V., 2019, pp. 18–24 (German). https://www.arbeitswissenschaft.net/fileadmin/Downloads/Angebote_und_Produkte/Publikationen/ifaa_BA_235_Shopfloormanagement.pdf
3. Was ist Shopfloor Management? (glossary). CETPM – Centre of Excellence for Total Performance Management (with references to Gelbrich 2019, Orth, Schwarz, Hartmann/Melas 2020, Müller-Seegers 2020) (German). https://www.cetpm.de/lexikon/was-ist-shopfloor-management/141/
4. Shopfloor Management: Definition, Bedeutung, Kennzahlen. WGP – Wissenschaftliche Gesellschaft für Produktionstechnik (German). https://wgp.de/de/shopfloor-management/
5. Suzaki, K.: The New Shop Floor Management: Empowering People for Continuous Improvement. Free Press, 1993. https://books.google.com/books/about/New_Shop_Floor_Management.html?id=5vMvj0ge92IC
6. Peters, Remco: Shopfloor-Management. Führen am Ort der Wertschöpfung. LOG_X Verlag, Stuttgart 2009, ISBN 978-3-932298-39-4; quote p. 59, core elements p. 39 (cited via [1]; first name per Wikipedia and trade data; German National Library catalog not reachable at the time of access) (German).
7. Gemba Walk (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/gemba-walk/
8. Ballé, M.: Gemba, workplace, genchi genbutsu, go-and-see … What's the difference? Lean Enterprise Institute, September 14, 2015. https://www.lean.org/the-lean-post/articles/gemba-workplace-genchi-genbutsu-go-and-see-whats-the-difference/
9. Toyota Motor Corporation: 75 Years of Toyota, Section 7: The Functions that Supported Globalization (Toyota Way 2001). https://www.toyota-global.com/company/history_of_toyota/75years/text/leaping_forward_as_a_global_corporation/chapter4/section7/item4.html
10. Imai, M.: Gemba Kaizen: A Commonsense, Low-Cost Approach to Management. McGraw-Hill, 1997, ISBN 978-0-07-031446-7 (Publishers Weekly review). https://www.publishersweekly.com/9780070314467
11. Gemba and Its Meaning: The Heart of Lean Management. Kaizen Institute. https://kaizen.com/insights/gemba-meaning-lean-management/
12. Genchi Genbutsu. Wikipedia (English). https://en.wikipedia.org/wiki/Genchi_Genbutsu
13. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press, 1988 (publisher page, Routledge). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140
14. Womack, J.: Value Stream Walk, Management Walk or … Just Walking Around? Lean Enterprise Institute, June 19, 2018. https://www.lean.org/the-lean-post/articles/value-stream-walk-management-walk-or-just-walking-around/
15. Shook, J.: Foreword. In: Womack, J.: Gemba Walks, 2nd edition. Lean Enterprise Institute, 2013. https://www.lean.org/wp-content/uploads/2021/01/gemba-walks-foreward.pdf
16. Tom Peters: The four-letter word every modern manager needs to know: MBWA. Fortune, December 18, 2015. https://fortune.com/2015/12/18/tom-peters-the-four-letter-word-every-modern-manager-needs-to-know-mbwa/
17. Andon (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/andon/
18. Leader Standard Work (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/leader-standard-work/
19. Graban, M.: Book Review: Creating a Lean Culture (David Mann). Lean Blog, November 2005. https://leanblog.org/2005/11/book-review-creating-lean-culture
20. Visual Management (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/visual-management/
21. Team Leader (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/team-leader/
22. Overall Equipment Effectiveness (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/overall-equipment-effectiveness/
23. Edmondson, A.: Psychological Safety and Learning Behavior in Work Teams. Administrative Science Quarterly 44 (2), 1999, pp. 350–383. https://web.mit.edu/curhan/www/docs/Articles/15341_Readings/Group_Performance/Edmondson%20Psychological%20safety.pdf
24. wbk Institute of Production Science (KIT) and IPRI: Auf dem Weg zum digitalen Shopfloor Management. Eine Studie zum Stand der Echtzeitentscheidungsfähigkeit und des Industrie 4.0-Reifegrads (ShopfloorPulse project; 18 companies from more than eight industries; undated, probably 2018/2019) (German). https://www.wbk.kit.edu/downloads/Auf%20dem%20Weg%20zum%20digitalen%20Shopfloor%20Management.pdf
25. Bundesvereinigung Logistik (BVL), IPRI, wbk (KIT): ShopfloorPulse, final report IGF project 19372 N (2017–2019) (German). https://www.bvl.de/files/1951/2125/2131/2133/Abschlussbericht_ShopfloorPulse_19372_N.pdf
26. Hertle, C.; Siedelhofer, C.; Metternich, J.; Abele, E.: The next generation shop floor management: How to continuously develop competencies in manufacturing environments. 23rd International Conference on Production Research, Manila 2015; TUprints TU Darmstadt, 2016. https://tuprints.ulb.tu-darmstadt.de/5253
27. VDI 2870 Part 2: Lean production systems; list of methods (project page for the new edition, possible publication date according to VDI: June 2027). VDI. https://vdi.de/richtlinien/details/vdi-2870-blatt-2-lean-production-systems-list-of-methods
28. Collaborate with Power BI in Teams. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-collaborate-microsoft-teams
29. Automatic page refresh in Power BI Desktop. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/create-reports/desktop-automatic-page-refresh
30. Embed a canvas app as tab app. Microsoft Learn (Power Apps). https://learn.microsoft.com/en-us/power-apps/teams/embed-teams-tab
31. Use Power BI Metrics to track goals in Microsoft Teams. Microsoft Learn. https://learn.microsoft.com/en-us/power-bi/explore-reports/business-user-teams-goals
32. What is Real-Time Intelligence in Microsoft Fabric? Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/overview
33. What is Fabric Activator? Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/data-activator/activator-introduction
34. What is the connector for OPC UA? Microsoft Learn (Azure IoT Operations). https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector
35. Frontline team collaboration. Microsoft Learn (Microsoft 365 for frontline workers). https://learn.microsoft.com/en-us/microsoft-365/frontline/flw-team-collaboration?view=o365-worldwide
36. Simplify business processes for frontline teams. Microsoft Learn. https://learn.microsoft.com/en-us/microsoft-365/frontline/simplify-business-processes?view=o365-worldwide
37. Publish task lists to define and track work in your organization. Microsoft Support. https://support.microsoft.com/en-us/teams/shifts/publish-task-lists-to-define-and-track-work-in-your-organization
38. Manage the Lists app for your organization. Microsoft Learn (Microsoft Teams). https://learn.microsoft.com/en-us/microsoftteams/manage-lists-app
39. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource (Polaris VSM). Microsoft Tech Community, Marketplace Blog, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536
40. Polaris BSM (Business Swimlane Modeling). Microsoft AppSource. https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1
41. What is shopfloor management? SYMESTIC (German page; English page: https://www.symestic.com/en-us/what-is/shopfloor-management). https://www.symestic.com/de-de/was-ist/shopfloor-management
42. Trummer, R. (GFT Technologies SE): Digitales Shopfloor-Management ermöglicht 20 Prozent mehr Produktivität. Digital Manufacturing Magazin, November 2, 2022 (German). https://www.digital-manufacturing-magazin.de/digitales-shopfloor-management-ermoeglicht-20-prozent-mehr-produktivitaet-a-2b00c53c429d27a792ea7f51627fac4a/
43. Shopfloor Management (glossary). Haufe Akademie (German). https://www.haufe-akademie.de/blog/glossar/shopfloor-management/
44. Section 87 Works Constitution Act (Betriebsverfassungsgesetz, BetrVG): co-determination rights. Federal Ministry of Justice, gesetze-im-internet.de (German). https://www.gesetze-im-internet.de/betrvg/__87.html
45. Important changes (deprecations) coming in Power Apps, Power Automate, and Copilot Studio: Deprecation of Microsoft Dataverse for Teams environments. Microsoft Learn. https://learn.microsoft.com/en-gb/power-platform/important-changes-coming
46. Power Apps licensing FAQs. Microsoft Learn (Power Platform). https://learn.microsoft.com/en-us/power-platform/admin/powerapps-licensing-faq
47. Configure data flow endpoints. Microsoft Learn (Azure IoT Operations). https://learn.microsoft.com/azure/iot-operations/connect-to-cloud/howto-configure-dataflow-endpoint
48. Federal Labor Court (Bundesarbeitsgericht), decision of July 16, 2024, 1 ABR 16/23 (headset system; co-determination under Section 87(1) No. 6 BetrVG) (German). https://www.bundesarbeitsgericht.de/wp-content/uploads/2024/11/1-ABR-16-23.pdf
49. Safety Management – Worker Participation. Occupational Safety and Health Administration (OSHA), U.S. Department of Labor. https://www.osha.gov/safety-management/worker-participation
50. OSHA: Clarification of OSHA's Position on Workplace Safety Incentive Programs and Post-Incident Drug Testing Under 29 C.F.R. § 1904.35(b)(1)(iv). Standard interpretation memorandum, October 11, 2018. https://www.osha.gov/laws-regs/standardinterpretations/2018-10-11
51. TRIR (Total Recordable Incident Rate). National Safety Council, Injury Facts. https://injuryfacts.nsc.org/definitions/trir-total-recordable-incident-rate/
52. Morgan Lewis: Electronic Monitoring and Algorithmic Management: Permissible Labor Practice or Unlawful Oversight? LawFlash, November 8, 2022 (on NLRB GC Memo 23-02, October 31, 2022). https://www.morganlewis.com/pubs/2022/11/electronic-monitoring-and-algorithmic-management-permissible-labor-practice-or-unlawful-oversight
53. NLRB: GC 25-05 Rescission of Certain General Counsel Memoranda. National Labor Relations Board, February 14, 2025. https://www.nlrb.gov/news-outreach/news-story/gc-25-05-rescission-of-certain-general-counsel-memoranda
54. National Steel Corp. v. National Labor Relations Board, 324 F.3d 928 (7th Cir. 2003), discussing Colgate-Palmolive Co., 323 N.L.R.B. 515 (1997). Justia. https://law.justia.com/cases/federal/appellate-courts/F3/324/928/577225/
55. New York Civil Rights Law § 52-c (notice of electronic monitoring by employers). Justia, 2021 New York Laws. https://law.justia.com/codes/new-york/2021/cvr/article-5/52-c-2/
56. ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
57. ISA/IEC 62443 Series of Standards. International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
58. How should daily management be structured in a manufacturing plant? Kaizen Institute. https://kaizen.com/insights/daily-management-manufacturing-plant/
59. NIST: The NIST Cybersecurity Framework (CSF) 2.0. NIST CSWP 29, February 26, 2024. https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final
60. Best of Technology Award 2025: winners (category Produktion: 2nd place iFAKT GmbH, Polaris IMS). WirtschaftsWoche (German). https://award.wiwo.de/bot/gewinner-2025/
61. iFAKT GmbH: imprint (Curiestr. 2, 70563 Stuttgart; Amtsgericht Stuttgart HRB 22661) and home page (TÜV SÜD seal ISO 9001 & ISO/IEC 27001). https://www.ifakt.de/de/imprint and https://www.ifakt.de/
