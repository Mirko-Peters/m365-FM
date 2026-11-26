# SEO metadata

| Field | Value |
|---|---|
| Meta title | Sistema de Execução da Manufatura (MES) e ISA-95: Guia |
| Meta description | O que faz um sistema MES, como os níveis e modelos de atividade da ISA-95 o estruturam, MES vs. ERP vs. SCADA, checklist de fornecedores, roteiro e ROI. |
| Slug | `mes-isa-95` |

# Sistema de Execução da Manufatura (MES) e ISA-95: Funções, Níveis, Seleção e ROI

> **Resposta curta:** Um sistema de execução de manufatura (MES) é a camada de software que gerencia, monitora e registra a execução das ordens de produção no chão de fábrica, em tempo real, entre o sistema ERP, que planeja, e os sistemas de controle, que operam as máquinas [8]. A ISA-95 (ANSI/ISA-95, internacionalmente IEC 62264) é a norma que define onde essa camada se situa (Nível 3, gestão de operações de manufatura), quais atividades ela cobre e quais informações ela troca com o ERP [1][3].

> **Principais conclusões**
> - A Gartner define o MES como um software orientado à produção que "gerencia, monitora e sincroniza a execução de processos físicos em tempo real" e coordena ordens de trabalho com sistemas de programação, ERP, PLM e qualidade [8].
> - A ISA-95 tem oito partes. A Parte 1 (modelos e terminologia) foi republicada em 2025; a Parte 3 (modelos de atividades) é de 2013 [1][2].
> - A ISA-95 descreve cinco níveis. Os Níveis 0 a 2 correspondem ao processo físico e seu controle, o Nível 3 é a gestão de operações de manufatura (MES e sistemas relacionados), e o Nível 4 é o planejamento de negócios e logística (ERP) [1].
> - O modelo de atividades da Parte 3 divide o Nível 3 em quatro categorias (produção, manutenção, teste de qualidade e estoque) e repete as mesmas oito atividades em cada uma: gerenciamento de definições, gerenciamento de recursos, programação detalhada, despacho, gerenciamento da execução, coleta de dados, rastreamento e análise de desempenho [3].
> - O modelo da MESA International de 1997 nomeou 11 funções do MES; a ISA-95 posteriormente incorporou essa visão [9][12]. A MESA encerrou suas atividades em 30 de junho de 2026, e seu conteúdo foi transferido para a ISA [11].
> - Um namespace unificado (UNS) muda a forma como os dados circulam; ele não substitui a lógica do MES nem o vocabulário da ISA-95.
> - O caso de negócio de um MES normalmente se sustenta ou cai com uma ou duas linhas de benefício. No exemplo trabalhado abaixo, o mesmo projeto tem um VPL de cinco anos positivo no cenário base e negativo no cenário conservador.
> - Comece pelo modelo de dados e por uma cadeia de valor, não pela lista completa de funcionalidades.

## Sumário

1. [O que é um sistema de execução de manufatura (MES)?](#o-que-é-um-sistema-de-execução-da-manufatura-mes)
2. [Um breve histórico: do AMR e do MESA-11 à ISA-95 e além](#um-breve-histórico-de-amr-e-mesa-11-à-isa-95-e-além)
3. [ISA-95 explicada: a norma, suas partes e seus níveis](#isa-95-explicada-a-norma-as-suas-partes-e-os-seus-níveis)
4. [Os modelos da ISA-95 que importam em um projeto de MES](#os-modelos-da-isa-95-que-importam-em-um-projeto-de-mes)
5. [MES vs. ERP vs. MOM vs. SCADA e outros sistemas da planta](#mes-vs-erp-vs-mom-vs-scada-e-outros-sistemas-de-planta)
6. [Funções do MES em detalhe](#funções-de-mes-em-detalhe)
7. [Integração: B2MML, OPC UA, MTConnect e o namespace unificado](#integração-b2mml-opc-ua-mtconnect-e-o-namespace-unificado)
8. [MES em setores regulados](#mes-em-setores-regulados)
9. [Opções de implantação e arquitetura: suíte, plataforma, módulo de ERP, nuvem](#opções-de-implantação-e-arquitetura)
10. [Desenvolver ou comprar](#construir-ou-comprar)
11. [Checklist para seleção de fornecedor de MES](#checklist-de-seleção-de-fornecedor-de-mes)
12. [Roteiro de implementação do MES](#roteiro-de-implementação-do-mes)
13. [Custo e ROI do MES com um exemplo trabalhado](#custo-e-roi-de-mes-com-um-exemplo-trabalhado)
14. [KPIs do MES: o que medir e como](#kpis-de-mes-o-que-medir-e-como)
15. [Pessoas e o chão de fábrica](#pessoas-e-chão-de-fábrica)
16. [Erros comuns na implementação de MES](#erros-comuns-na-implantação-de-mes)
17. [Limites do MES e da ISA-95](#limites-do-mes-e-da-isa-95)
18. [Glossário](#glossário)
19. [Perguntas frequentes](#faq)
20. [Conclusão e primeiros passos](#conclusão-e-primeiros-passos)

## O que é um sistema de execução da manufatura (MES)?

Um sistema de execução da manufatura é o software que transforma uma ordem de produção em produtos acabados e documentados. O ERP diz à fábrica *o que* fabricar, em que quantidade e até quando. Máquinas e seus controladores fazem as peças. O MES fica no meio: ele libera e sequencia o trabalho, informa operadores e máquinas sobre o próximo passo, coleta o que realmente aconteceu (quantidades, tempos, parâmetros, materiais, defeitos, quem executou) e devolve o resultado ao sistema.

A definição de mercado do Gartner é um bom ponto de referência porque é neutra em relação a fornecedores e precisa. Ela chama o MES de "uma classe especializada de software orientado à produção" que "gerencia, monitora e sincroniza a execução de processos físicos em tempo real envolvidos na transformação de matérias-primas em bens intermediários e/ou acabados". Acrescenta que esses sistemas coordenam ordens de trabalho com o sequenciamento da produção e com sistemas corporativos como ERP, gestão do ciclo de vida do produto e gestão da qualidade, além de fornecer retorno sobre o desempenho dos processos e dar suporte à rastreabilidade e à genealogia até o nível de componente e material [8].

### A ideia central em uma frase

Um MES fecha o ciclo entre planejamento e realidade, turno a turno, para que todos, do operador ao controller, trabalhem com o mesmo registro atualizado do que aconteceu no chão de fábrica.

### O que um MES faz em um turno típico

Um exemplo concreto ajuda mais do que uma lista de funcionalidades. Considere uma fábrica de porte médio que usina e monta válvulas hidráulicas em quatro linhas:

1. **06:00, início do turno.** O MES mostra ao supervisor a lista de despacho da Linha 2: doze ordens liberadas do ERP, sequenciadas pelo planejador para minimizar trocas de setup. Duas ordens estão sinalizadas porque um calibrador está com a calibração vencida.
2. **06:10.** O operador lê o apontamento (traveler) da primeira ordem ou a seleciona em um terminal. O MES verifica se o operador está qualificado para essa operação, se a versão do programa no CNC corresponde ao roteiro liberado e se o lote de matéria-prima na prateleira pertence à ordem. Ele mostra a revisão atual da instrução de trabalho.
3. **06:12 às 13:30.** A máquina informa ciclos e estados (em operação, ociosa, em alarme) via OPC UA ou MTConnect. O MES contabiliza peças boas e rejeitadas, registra paradas e pede um código de motivo quando uma parada ultrapassa dois minutos. As medições feitas durante o processo vão para gráficos de CEP; um ponto fora de controle interrompe a operação seguinte até que um técnico dê o aval.
4. **11:45.** Um lote de vedações se mostra suspeito. Como o MES registrou qual lote foi para qual número de série de válvula, a qualidade pode isolar 140 válvulas em vez de toda a produção de uma semana.
5. **14:00, passagem de turno.** O MES informa ao turno seguinte as quantidades, a sucata, o OEE e as pendências em aberto, e lança no ERP as quantidades confirmadas e o consumo de materiais.

Sem um MES, grande parte disso acontece em apontamentos em papel, quadros brancos e planilhas, digitados no ERP horas ou dias depois. Isso funciona, até certo ponto. O custo aparece em forma de dados atrasados ou incorretos, recalls lentos, escapes de qualidade e investigações longas. O estudo aprofundado sobre [manufatura sem papel](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/) trata da passagem dos apontamentos em papel para instruções de trabalho digitais, que costuma ser o primeiro módulo de MES que uma fábrica adota.

### Onde o MES se encontra entre os sistemas da fábrica

A ISA-95 posiciona o MES no **Nível 3**, gestão das operações de manufatura, entre o planejamento empresarial e a logística no Nível 4 (ERP) e as camadas de controle nos Níveis 0 a 2 (sensores, CLPs, SDCD, SCADA) [1]. O Nível 3 não é um sistema único. A mesma camada abriga o sistema de gestão de laboratório (LIMS), o sistema de gestão de armazém (WMS), o sistema de gestão da manutenção (CMMS) e outros; em conjunto, costumam ser chamados de sistemas de gestão das operações de manufatura [14]. A Seção 5 compara esses sistemas.

### Benefícios de um MES e o que dizem as evidências

A maioria das páginas sobre MES lista benefícios com percentuais impressionantes e sem fonte. Eis o que pode ser afirmado com cuidado:

| Benefício | Mecanismo | O que medir | Ressalva |
|---|---|---|---|
| Dados de produção mais rápidos e precisos | Dados capturados na origem, não redigitados | Latência dos dados, lançamentos manuais por ordem | Somente se os dados mestres (roteiros, BOMs) estiverem corretos |
| Tempos de ciclo mais curtos | Menos espera por papelada, liberação e expedição mais rápidas | Lead time da ordem, tempo em fila | *Control Engineering* relata que a MESA International atribuiu uma redução média de 45 por cento nos tempos de ciclo de fabricação; trate isso como uma afirmação de associação, não como um benchmark [9] |
| Menos escapes de qualidade | Verificações obrigatórias, CEP, intertravamentos antes da etapa seguinte | Rendimento de primeira passagem, reclamações de clientes | Depende de as verificações estarem de fato configuradas como paradas obrigatórias |
| Recalls mais rápidos e mais restritos | Genealogia de lote e de número de série | Tempo para identificar as unidades afetadas | Requer digitalização disciplinada dos materiais |
| OEE mais alto no gargalo | Motivos de parada visíveis, resposta mais rápida | OEE, MTTR | Só vale dinheiro se a produção adicional puder ser vendida |
| Prontidão para auditoria | Registros eletrônicos, trilhas de auditoria, assinaturas eletrônicas | Horas por auditoria, não conformidades | O esforço de validação em indústrias reguladas é substancial |

Um artigo da *Automation World* de 2006 relatou que mais de 40 fabricantes globais haviam usado a ISA-95 para definir seus requisitos de MES, e que o tempo para definir os requisitos caiu de vários meses para quatro a seis semanas [10]. Esse é um efeito modesto e plausível de um vocabulário compartilhado, e uma boa razão para ler as próximas seções antes de escrever um documento de requisitos.

## Um breve histórico: de AMR e MESA-11 à ISA-95 e além

A história explica por que fornecedores, analistas e normas usam palavras ligeiramente diferentes para a mesma coisa.

### Início dos anos 1990: o termo MES

Segundo a *Automation World*, a empresa de análise de Boston AMR Research estabeleceu o conceito de MES em 1992 como a camada entre os sistemas corporativos e os sistemas de controle, proporcionando visibilidade e controle [10]. Antes disso, as fábricas usavam sistemas de controle de chão de fábrica, coleta de dados e sistemas de qualidade, frequentemente desenvolvidos internamente para um único propósito; suas funções se sobrepunham e raramente se comunicavam [14].

### 1997: MESA-11

A MESA International (Manufacturing Enterprise Solutions Association) publicou seu white paper sobre MES em 1997 [15] e, com ele, o modelo funcional conhecido como **MESA-11** [12]. As onze funções eram [9]:

1. Alocação e status de recursos
2. Programação de operações/detalhada
3. Despacho de unidades de produção
4. Controle de documentos
5. Aquisição de dados
6. Gestão de mão de obra
7. Gestão da qualidade
8. Gestão de processos
9. Gestão da manutenção
10. Rastreamento de produtos e genealogia
11. Análise de desempenho

A definição da MESA de 1997 enfatizava que um MES deve "fornecer informações que permitam a otimização das atividades de produção", redação que a *Automation World* ainda considerava prática em 2006 [10]. Várias das onze funções (manutenção, mão de obra, controle de documentos) são hoje frequentemente tratadas por sistemas separados, motivo pelo qual o modelo foi criticado como "amplo demais" já na época [9].

### 2000 a 2013: ISA-95

O comitê ISA95 baseou-se no Purdue Reference Model para manufatura integrada por computador [1]. A Parte 1 surgiu em 2000 e a Parte 3, com os modelos de atividades do Nível 3, em 2005; fontes secundárias descrevem a ISA-95 como tendo unificado a visão funcional da MESA com a hierarquia de Purdue [12][14]. Outras partes se seguiram até 2020, e a Parte 1 foi republicada em 2025 [1][2]. A Seção 3 as lista.

### A partir de 2004: MOM, MES colaborativo e modelos posteriores

Como a ISA-95 denominou o Nível 3 de "gestão de operações de manufatura", o termo MOM tornou-se comum para o escopo mais amplo (produção somada a operações de qualidade, manutenção e estoque), com o MES como núcleo de produção [10]. A própria MESA publicou vários modelos posteriores; o artigo da *Control Engineering* sobre o modelo original observa que ele era um dos oito modelos da MESA na época [9]. Não conseguimos verificar, a partir de uma fonte primária, os nomes e anos dos modelos posteriores da MESA (frequentemente citados como c-MES em 2004 e o modelo MESA de 2008) [unverified: fonte primária não localizada]. A página de histórico de modelos da própria MESA agora redireciona para a ISA, e o anúncio da MESA de 2022 sobre seu modelo mais recente diz apenas que havia lançado "três (agora quatro) modelos MESA" [43].

### 2026: MESA se dissolve, e a ISA assume o seu conteúdo

A MESA International votou pela encerramento das suas operações com efeito a 30 de junho de 2026; a ISA declara que "o conteúdo e os programas educativos da MESA serão assumidos pela ISA" [11]. Isto é relevante na prática porque a MESA mantinha o **B2MML**, a implementação XML da ISA-95 usada em muitas interfaces ERP-MES [5]. Confirme junto da ISA onde os esquemas B2MML e quaisquer versões futuras serão alojados antes de os especificar num contrato. Em novembro de 2026, os esquemas B2MML e BatchML continuam publicados no repositório MESAInternational do GitHub, cujo README não menciona a transferência [36] [unverified: o alojamento futuro após a transferência não está documentado].

### Anos 2020: IIoT, nuvem e MES composável

Três mudanças moldam os projetos MES atuais: os dados das máquinas são mais baratos de recolher (OPC UA, MTConnect, MQTT), a implementação em nuvem e híbrida tornou-se normal, e os fornecedores vendem cada vez mais o MES como uma plataforma de aplicações mais pequenas em vez de uma suíte monolítica (MES "composable" ou de "nova geração"). A secção 9 explica o que isso significa para a sua arquitetura e para o contrato.

## ISA-95 explicada: a norma, as suas partes e os seus níveis

A ISA descreve a ISA-95, "também conhecida como ANSI/ISA-95 ou IEC 62264", como um conjunto internacional de normas para a integração dos sistemas de logística com os sistemas de controlo da produção [1]. Organiza os processos tecnológicos e de negócio em camadas definidas pelas atividades que nelas ocorrem e descreve como uma empresa pode construir interfaces entre essas camadas. A ISA sublinha que a arquitetura, baseada no modelo de Purdue, pode ser aplicada "independentemente da tecnologia utilizada", e que a hierarquia de equipamentos funciona de igual modo para as indústrias discretas, contínuas e de logística [1].

Daqui decorrem duas consequências. Primeiro, a ISA-95 é **neutra quanto à tecnologia**: não diz nada sobre qual a base de dados, protocolo ou fornecedor que utiliza. Segundo, o seu foco principal é a **interface entre o Nível 3 e o Nível 4** [1], que é precisamente onde a maioria dos projetos MES fica bloqueada (quem é responsável pelo roteamento, quando é que uma quantidade é "confirmada", como é registada a sucata).

### ISA-95 e IEC 62264: o mesmo conteúdo, numeração diferente

A ISA desenvolve a série como ANSI/ISA-95; a IEC publica-a como IEC 62264. A edição de 2025 da Parte 1 tem a designação ANSI/ISA-95.00.01-2025 (IEC 62264-1 Mod), em que "Mod" indica uma adoção modificada [1][2]. As edições nem sempre estão sincronizadas. A IEC 62264-1 e -2 foram publicadas em 2013, a Parte 3 em 2016, a Parte 4 em 2015 e a Parte 5 em 2016 [7]; a IEC 62264-6, o modelo de serviço de mensagens, surgiu como edição 1.0 em 26 de junho de 2020 [6]. Quando um contrato ou um documento de requisitos citar "ISA-95", indique a parte e a edição.

### As oito partes da ISA-95

| Parte | Título (ANSI/ISA-95) | Edição atual segundo a ISA | Âmbito em termos simples |
|---|---|---|---|
| 1 | Modelos e Terminologia | 2025 (IEC 62264-1 Mod) | Âmbito das operações e do controlo da produção, como os ativos físicos são organizados, funções de interface, informação partilhada |
| 2 | Objetos e Atributos para a Integração Empresa-Sistema de Controlo | 2018 | Os objetos e atributos trocados na interface Nível 3 / Nível 4 |
| 3 | Modelos de Atividades da Gestão das Operações de Fabrico | 2013 | As atividades dentro do Nível 3 e alguns dos dados que trocam |
| 4 | Objetos e Atributos para a Integração da Gestão das Operações de Fabrico | 2018 | Modelos de objetos para a informação que circula entre as atividades do Nível 3, independentemente do grau de automação |
| 5 | Transações Negócio-Fabrico | 2018 | Transações entre os Níveis 3 e 4 (verbos como obter, processar, sincronizar) |
| 6 | Modelo de Serviço de Mensagens | 2014 | Mensagens entre os Níveis 3 e 4 e dentro do Nível 3 |
| 7 | Modelo de Serviço de Alias | 2017 | Mapeamento de identificadores equivalentes entre as operações de fabrico e outros domínios |
| 8 | Perfis de Troca de Informação | 2020 | Perfis para interfaces específicas entre os Níveis 4 e 3 ou entre atividades do Nível 3 |

Fonte: página da ISA sobre a ISA-95 [1]. Note que a ISA indica 2014 para a Parte 6, enquanto a edição IEC da Parte 6 é de 2020 [6].
Para a maioria dos projetos MES, as Partes 1 a 3 fazem o trabalho pesado: dão-lhe o vocabulário, o modelo de níveis e o modelo de atividades de que precisa para um documento de requisitos. As Partes 2, 4 e 5 são importantes quando desenha interfaces e modelos de dados. As Partes 6 a 8 interessam sobretudo a arquitetos de integração e a fornecedores de software.

### O que mudou na edição de 2025 da Parte 1

A ISA anunciou a nova Parte 1 em 10 de abril de 2025. Ela atualiza a versão de 2010, reflete funções específicas da empresa, esclarece a fronteira entre o domínio empresarial e os domínios de manufatura/controle e melhora a consistência com as demais partes [2]. O presidente do comitê ISA95, Christian Monchinski, a associou a "arquiteturas cada vez mais modulares em operações de negócios e de manufatura" e a uma mudança para projetos centrados em dados, e afirmou que a atualização "reafirma a importância de interfaces de integração padronizadas" [2]. Para os profissionais, isso é um sinal: a ISA-95 deve continuar sendo o vocabulário comum para arquiteturas modulares e orientadas a eventos, e não ser substituída por elas.

### Os cinco níveis da ISA-95

A ISA-95 herda seu modelo de níveis do Purdue. Os níveis descrevem *funções*, não computadores ou segmentos de rede [1][4].

| Nível | Nome | O que acontece aqui (nosso resumo) | Sistemas típicos | Escala de tempo típica |
|---|---|---|---|---|
| 4 | Planejamento empresarial e logística | Pedidos, necessidades de materiais, estoque, expedição, custeio para a fábrica | ERP, planejamento da cadeia de suprimentos | Meses, semanas, dias [4] |
| 3 | Gestão de operações de manufatura | Controle de fluxo de trabalho e de receitas para produzir os produtos finais; programação detalhada, despacho, registros, qualidade, manutenção e operações de estoque | MES, LIMS, WMS, CMMS, QMS, historiador, APS (programação detalhada) | Dias, turnos, horas, minutos, segundos [4] |
| 2 | Monitoramento e controle supervisório | Monitoramento e controle do processo físico | SCADA, IHM, SDCD, CLP | Respostas em tempo real medidas em subsegundos [4] |
| 1 | Sensoriamento e atuação | Sensores, atuadores, dispositivos inteligentes, válvulas | Dispositivos de campo | Não especificado nas fontes aqui utilizadas |
| 0 | Processo físico | As máquinas e o material que está sendo transformado | Máquinas, linhas, equipamentos de processo | Não aplicável |

Duas observações. A própria página da ISA coloca o SCADA na linha do Nível 3, como exemplo de sistema de Nível 3 ao lado do MES [1], enquanto o resumo da OPC Foundation atribui automação e controle aos Níveis 1 e 2 e o MOM ao Nível 3 [4]. Na prática, o SCADA atravessa a fronteira entre os níveis 2 e 3: suas telas e o tratamento de alarmes são controle supervisório (Nível 2), e suas funções de historiador e de relatórios frequentemente atendem ao Nível 3. Não discuta a caixa; decida qual sistema é a fonte oficial de cada dado. Em segundo lugar, a OPC Foundation destaca que "cada nível tem sua própria definição de tempo real" [4]. Um MES que atualiza um painel a cada 30 segundos é tempo real para um supervisor e lento demais para um intertravamento de máquina.

### Níveis não são zonas de rede

Um erro comum é tratar os níveis da ISA-95 e os níveis de Purdue usados na segurança de TO como se fossem a mesma coisa. A ISA-95 descreve funções e informações; a segmentação de rede segue uma lógica diferente, agora definida na ISA/IEC 62443 com zonas e conduítes [23]. A ISA observa que a ISA-95 se apoia no modelo de referência de Purdue para descrever a segmentação de rede em sistemas de controle industrial [1], mas uma *função* de Nível 3 pode rodar em um tenant de nuvem, enquanto um *servidor* de Nível 3 na sua planta fica em uma zona de segurança específica. O guia [Segurança cibernética de TO e ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) aborda zonas, conduítes e a DMZ; o NIST SP 800-82 Rev. 3 é o guia norte-americano de segurança de TO [24].

### A ISA-95 ainda é relevante?

A resposta da própria ISA: os níveis ainda ajudam a descrever as fronteiras dos sistemas para a Indústria 4.0 e a manufatura inteligente, embora o modelo tenha se originado como uma hierarquia [1]. Isso corresponde à prática. A hierarquia como *caminho de dados* (cada valor sobe nível por nível por meio de interfaces ponto a ponto) envelheceu mal, e a seção 7 mostra as alternativas. A hierarquia como *mapa de responsabilidades e de vocabulário* não envelheceu.

## Os modelos da ISA-95 que importam em um projeto de MES

A ISA-95 contém vários modelos. Quatro deles vale conhecer pelo nome antes de você redigir um documento de requisitos de MES.

### 1. A hierarquia funcional (níveis)

Abordada acima. Use-a para desenhar um diagrama de contexto do sistema, com cada sistema existente posicionado no seu nível e cada interface representada por uma seta rotulada.

### 2. A hierarquia de equipamentos

A ISA-95 organiza a planta física em uma hierarquia de equipamentos baseada em papéis: **empresa, site, área, centro de trabalho, unidade de trabalho** (os nomes usados por explicações comuns e pelo guia irmão sobre o Azure) [1][27]. Os centros de trabalho são ainda tipificados, por exemplo, como células de processo (batelada), unidades de produção (contínuo), linhas de produção (discreto) e zonas de armazenamento, com unidades de trabalho correspondentes, como unidades, células de trabalho e unidades de armazenamento. O modelo de informação da ISA-95 da OPC Foundation lista exatamente esses nomes de nível [32], e o rascunho público de 1999 da Parte 1 associa células e unidades de processo à batelada, unidades de produção ao contínuo e linhas de produção e células de trabalho à manufatura discreta [33]. O mapeamento da OPC Foundation observa que os equipamentos podem ser aninhados e que o modelo descreve os *papéis* que os equipamentos desempenham na produção, separados dos ativos físicos que os compõem [5].

Por que isso importa: a hierarquia de equipamentos se torna a sua convenção de nomenclatura no MES, no historiador, no CMMS, na árvore de tópicos do namespace unificado e na plataforma de dados. Uma planta que chama a mesma máquina de "L2-CNC3", "Linha 2 Mazak" e "WC-4711" em três sistemas paga por isso em todos os relatórios e em todas as integrações.

**Exemplo de hierarquia para a fábrica de válvulas:**

| Nível | Exemplo |
|---|---|
| Empresa | Acme Fluid Power |
| Site | Planta de Dayton |
| Área | Usinagem; Montagem e teste; Armazém |
| Centro de trabalho | Linha 2 (linha de produção); Célula de teste T1 (grupo de células de trabalho); Estoque de matéria-prima (zona de armazenamento) |
| Unidade de trabalho | CNC 3; Estação de lavagem; Testador de vazamento LT-1; Zona de racks A |

### 3. Os modelos de objetos (Partes 2 e 4)

A ISA-95 descreve a informação trocada entre ERP e MES, e entre as atividades do MES, como modelos de objetos com atributos. O documento complementar da OPC Foundation nomeia quatro modelos de recursos que os sistemas ERP e MOM trocam: **material** (incluindo propriedades do material e lotes), **equipamento** (no que se refere às operações executadas), **ativos físicos** (os ativos que compõem o equipamento) e **pessoal** (funções e qualificações) [4][5]. Em torno deles, a ISA-95 organiza a troca em quatro categorias de informação que espelham o ciclo de vida de uma ordem: **definição do produto** (como fabricá-lo), **capacidade de produção** (quais recursos estão disponíveis), **programação da produção** (o que produzir e quando) e **desempenho da produção** (o que foi produzido). As categorias correspondem aos nomes das atividades da Parte 3 [3]; o rascunho público de 1999 da Parte 1 agrupa programação e desempenho como "informações de produção" [33].

Uma regra prática deste modelo: o ERP é dono do "o que e quando", e o MES é dono do "como e o que de fato aconteceu". Quando o ERP mantém um roteiro com tempos de operação e o MES mantém uma definição de trabalho mais detalhada, com parâmetros e instruções, defina explicitamente qual deles é o mestre para cada atributo e como as alterações fluem entre eles.

### 4. O modelo de atividades (Parte 3)

Esta é a parte mais útil e menos explicada da ISA-95. A Parte 3 divide a gestão das operações de manufatura em quatro categorias: **operações de produção, operações de manutenção, operações de teste de qualidade e operações de estoque**. Dentro de cada uma, ela usa as mesmas oito atividades genéricas [3]:

| Atividade genérica | Operações de produção | Operações de manutenção | Operações de testes de qualidade | Operações de estoque |
|---|---|---|---|---|
| Gestão de definições | Gestão de definições de produto (roteiros, receitas, instruções de trabalho) | Gestão de definições de manutenção (listas de tarefas, procedimentos) | Gestão de definições de testes de qualidade (especificações de teste, planos de amostragem) | Gestão de definições de estoque (regras de armazenagem e transferência) |
| Gestão de recursos | Gestão de recursos de produção (pessoas, equipamentos, disponibilidade e qualificação de materiais) | Gestão de recursos de manutenção (técnicos, peças de reposição, ferramentas) | Gestão de recursos de testes de qualidade (equipamentos de laboratório, analistas) | Gestão de recursos de estoque (locais de armazenagem, equipamentos de movimentação) |
| Programação detalhada | Programação detalhada da produção (sequência nos recursos) | Programação detalhada da manutenção | Programação detalhada dos testes de qualidade | Programação detalhada do estoque (movimentações, reabastecimento) |
| Despacho | Despacho da produção (liberação de trabalho para as estações) | Despacho da manutenção (ordens de serviço para os técnicos) | Despacho dos testes de qualidade (amostras para o laboratório) | Despacho de estoque (ordens de transferência) |
| Gestão da execução | Gestão da execução da produção (orientar e verificar a execução) | Gestão da execução da manutenção | Gestão da execução dos testes de qualidade | Gestão da execução de estoque |
| Coleta de dados | Coleta de dados de produção (contagens, tempos, parâmetros) | Coleta de dados de manutenção (achados, horas, peças) | Coleta de dados dos testes de qualidade (resultados) | Coleta de dados de estoque (movimentações, contagens) |
| Rastreamento | Rastreamento da produção (WIP, genealogia, reporte ao ERP) | Rastreamento da manutenção (histórico por ativo) | Rastreamento dos testes de qualidade (resultados por lote ou número de série) | Rastreamento de estoque (localização e status do material) |
| Análise de desempenho | Análise de desempenho da produção (OEE, rendimento, tempo de ciclo) | Análise de desempenho da manutenção (MTBF, MTTR) | Análise de desempenho dos testes de qualidade (capabilidade, tendências) | Análise de desempenho de estoque (giro, acurácia) |

Os nomes das linhas e colunas seguem os títulos das cláusulas da ANSI/ISA-95.00.03-2013 (cláusulas 6 a 9) [3]; os exemplos entre parênteses são nossos. A *Automation World* resumiu a mesma divisão como "produção, manutenção, qualidade e estoque" [13].

**Como usar a matriz em um projeto:** Imprima-a como uma grade de 4 × 8. Para cada uma das 32 células, escreva qual sistema executa essa função hoje (papel, Excel, ERP, MES, CMMS, LIMS, WMS, ninguém) e qual sistema deveria executá-la após o projeto. As células vazias e as células com três sistemas são o seu ponto de discussão sobre escopo. Um resultado típico para uma fábrica de manufatura discreta: a coluna de produção majoritariamente em MES, a coluna de manutenção no CMMS, os testes de qualidade divididos entre MES (verificações em processo) e LIMS ou QMS (testes de laboratório, CAPA), e o estoque dividido entre ERP (níveis de estoque) e WMS ou MES (movimentações para a linha). A programação detalhada na coluna de produção frequentemente vai para um APS (veja [programação da produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/)).

### Uma nota sobre a ISA-88 e a VDI 5600

Dois frameworks relacionados aparecem em projetos de MES. A **ISA-88** é o padrão de controle de bateladas; seu modelo de controle procedural (procedimentos, procedimentos de unidade, operações, fases) foi adotado pela IEC como IEC 61512-1 [34] e é a forma usual de estruturar receitas em farmacêutica, alimentos e químicos. O BatchML, complemento do B2MML, implementa a ISA-88 [36], e muitos produtos MES implementam registros eletrônicos de batelada sobre ela [unverified: observação de prática]. A **VDI 5600**, uma diretriz da Associação de Engenheiros Alemães (Parte 1 datada de outubro de 2016), lista as tarefas de MES de forma semelhante à MESA-11 e é comum em fábricas alemãs e em RFPs de controladoras alemãs [21].

## MES vs. ERP vs. MOM vs. SCADA e outros sistemas de planta

"Qual é a diferença entre MES e ERP?" é uma das perguntas mais comuns sobre MES, seguida de MES vs. SCADA. A versão curta: o ERP planeja e contabiliza, o MES executa e registra, o SCADA supervisiona e controla as máquinas. A versão mais longa precisa de uma tabela, porque os limites dependem do setor e dos produtos que você já possui.

### Tabela comparativa

| Dimensão | ERP (Nível 4) | MES (Nível 3) | MOM (Nível 3, mais amplo) | SCADA / HMI (Nível 2, parcialmente 3) | Historiador |
|---|---|---|---|---|---|
| Pergunta principal | O que devemos fabricar, comprar e expedir, e quanto custou? | Como exatamente esta ordem é fabricada e o que realmente aconteceu? | Como produção, qualidade, manutenção e operações de estoque funcionam em conjunto? | O que a máquina ou o processo está fazendo agora, e como eu o controlo? | Quais foram os valores do processo ao longo do tempo? |
| Horizonte de tempo | Meses, semanas, dias [4] | Turnos, horas, minutos, segundos [4] | Igual ao MES | De sub-segundos a segundos [4] | De segundos a anos |
| Unidade de trabalho | Ordem de produção, ordem de compra, pedido de venda | Operação, etapa, lote, número de série | Ordem somada a teste, ordem de trabalho de manutenção, ordem de transferência | Tag, alarme, set point | Tag de série temporal |
| Dados típicos | BOM, roteiro, custo padrão, estoque, demanda | Instruções de trabalho, tempos e quantidades reais, parâmetros, genealogia, defeitos, aprovações | Dados do MES mais resultados de laboratório, histórico de manutenção, movimentações de material | Valores ao vivo, alarmes, comandos do operador | Série temporal compactada |
| Usuários | Planejamento, compras, finanças, vendas | Operadores, supervisores, qualidade, engenheiros de processo | Gestão da planta, todas as funções de operações | Operadores de sala de controle, técnicos de manutenção | Engenheiros, analistas |
| Registro de referência para | Lançamentos financeiros, valor do estoque, demanda | Registro como construído, histórico de execução | Registros de operações em todas as categorias | Estados de controle e alarmes | Histórico de processo |
| Falha típica se usado de forma incorreta | Confirmações do chão de fábrica digitadas com dias de atraso | Usado como ferramenta de planejamento ou como depósito de dados sem lógica de processo | Escopo tão amplo que nada entra em operação | Usado como sistema de gestão de ordens | Tratado como registro oficial de quantidades |

MOM é o nome da ISA-95 para todo o Nível 3; MES costuma ser entendido como seu núcleo de produção [10][14]. Muitos fornecedores vendem "suítes MOM" que incluem módulos de qualidade e manutenção. Chamar de MES ou MOM importa menos do que ter um único responsável por célula na matriz de atividades da seção 4.

### Outros sistemas do Nível 3 e onde normalmente fica o limite do MES

| Sistema | Função principal | Limite típico com o MES |
|---|---|---|
| QMS (sistema de gestão da qualidade) | Não conformidades, CAPA, auditorias, controle de documentos, qualidade de fornecedores | O MES captura resultados e bloqueios em processo; o QMS gerencia a investigação e a ação corretiva. Integração: não conformidade criada no MES, tratada no QMS |
| LIMS (gestão de informações laboratoriais) | Amostras, testes de laboratório, especificações, certificados de análise | O MES solicita amostras e recebe as decisões de liberação; o LIMS é dono do registro de testes |
| CMMS / EAM | Ordens de trabalho de manutenção, peças de reposição, histórico de ativos | O MES informa estados e contadores das máquinas; o CMMS programa a manutenção. IDs de ativos compartilhados são essenciais |
| WMS | Armazenagem, separação, movimentações de armazém | O MES solicita material para a linha e confirma o consumo; o WMS executa as movimentações |
| APS | Programação de capacidade finita e sequenciamento | O APS produz a sequência; o MES despacha e devolve os realizados. Alguns produtos MES incluem um módulo APS |
| PLM | Projeto de produto, BOM de engenharia, gestão de mudanças | O PLM libera a definição de engenharia; o MES consome a definição de fabricação (muitas vezes via ERP ou uma ferramenta de planejamento de processo de fabricação) |
| Plataforma de dados / analítica | Análises entre plantas, IA, armazenamento de longo prazo | O MES é uma fonte; não deve se tornar o data lake corporativo. Veja [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) |

### O SAP é um MES? O ERP basta?

Fornecedores de ERP oferecem funções de execução de fabricação, seja dentro do ERP (confirmações no chão de fábrica, listas simples de despacho) seja como produtos separados. A SAP, por exemplo, descreve o SAP Digital Manufacturing como uma plataforma de gestão de operações de fabricação (MOM) em nuvem e orienta os clientes de seu produto mais antigo, SAP Manufacturing Execution, a migrar para ela (descrição do fornecedor) [35]. Se o ERP sozinho é suficiente depende de quatro perguntas:

1. **Granularidade:** Você precisa registrar por operação e ordem, ou por etapa, número de série e parâmetro?
2. **Latência:** A confirmação ao final do turno é suficiente, ou as decisões dependem de minutos?
3. **Aplicação das regras:** O sistema deve *impedir* uma etapa incorreta (material errado, operador não qualificado, verificação ausente), ou apenas registrá-la?
4. **Regulamentação:** Você precisa de registros eletrônicos de lote ou históricos de dispositivos com trilhas de auditoria e assinaturas eletrônicas?

**Sinais de que você superou a execução apenas com ERP:** confirmações digitadas com mais de um turno de atraso; mais de uma planilha paralela por área; um cliente ou órgão regulador pedindo rastreabilidade que você só consegue montar em dias; falhas de qualidade causadas por revisões ou materiais incorretos; supervisores gastando a primeira hora de cada turno coletando números.

Se todas as quatro respostas forem "grosseira, ao final do turno, apenas registro, não", o controle de chão de fábrica do ERP somado a boa disciplina pode ser suficiente, especialmente em fábricas pequenas. Se duas ou mais respostas apontarem na direção oposta, você precisa de funções de MES, seja do fornecedor do ERP, de um fornecedor de MES ou de uma plataforma.

## Funções de MES em detalhe

As funções abaixo seguem a coluna de produção do modelo de atividades ISA-95 [3], ampliado pelas funções MESA-11 que a maioria dos produtos ainda cobre [9]. Para cada uma: o que faz, o que precisa e como normalmente falha.

### 1. Gestão da definição do produto (definições de trabalho, roteiros, receitas)

**O que faz:** Mantém a definição de fabricação de cada produto: operações, etapas, parâmetros, materiais exigidos, ferramentas, habilidades, instruções de trabalho e verificações. Em indústrias de processo em batelada, isso é a receita mestra.

**O que precisa:** Uma divisão clara de dados mestres entre ERP e PLM, controle de versões e um processo de mudança de engenharia que chegue ao chão de fábrica antes do início da próxima ordem.

**Falha típica:** Dois mestres. O roteiro do ERP diz 12 operações, o MES diz 14, e ninguém sabe quais tempos são usados para custeio.

### 2. Gestão de recursos (pessoas, equipamentos, materiais)

**O que faz:** Sabe quais recursos estão disponíveis e qualificados: status da máquina, vida útil da ferramenta, treinamento e certificação do operador, lotes de material disponíveis na linha.

**O que precisa:** Registros de treinamento (muitas vezes vindos de RH ou de um sistema de aprendizagem), status dos equipamentos a partir do CMMS e dos controles, status dos materiais a partir do ERP ou do WMS.

**Falha típica:** O MES bloqueia um operador porque o registro de treinamento no RH está três meses defasado. Ajuste o processo de atualização de qualificações antes de ativar a aplicação rígida das regras. O estudo aprofundado sobre [habilidades da força de trabalho na manufatura](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/) aborda matrizes de habilidades.

### 3. Programação detalhada

**O que faz:** Transforma as ordens liberadas em uma sequência por recurso, respeitando capacidades, trocas de setup, disponibilidade de materiais e datas de entrega. O MESA-11 a chama de programação de operações/detalhada [9].

**O que precisa:** Tempos de execução e de troca precisos, calendários reais dos recursos e o progresso real vindo do chão de fábrica.

**Falha típica:** Uma "programação" que é, na prática, a lista de despacho do ERP ordenada por data de entrega. Se a programação for uma restrição real na sua fábrica, compare o módulo de MES com um APS independente.

### 4. Despacho

**O que faz:** Libera a próxima tarefa para um centro de trabalho ou operador no momento certo, com todos os documentos e materiais prontos. MESA-11: despacho de unidades de produção [9].

**Falha típica:** Listas de despacho que os operadores ignoram porque não refletem a realidade (material faltando, máquina parada). A solução é fechar o ciclo: o despacho deve usar o status dos recursos em tempo real.

### 5. Gestão de execução e instruções de trabalho

**O que faz:** Orienta o operador ou a máquina ao longo das etapas, impõe sequência e verificações, coleta assinaturas de conformidade e interrompe o processo quando uma condição exigida não é atendida. É aqui que um MES mais se diferencia de uma ferramenta de relatórios.

**O que precisa:** Instruções de trabalho bem escritas e visuais; decisões sobre quais verificações são paradas obrigatórias e quais são apenas alertas; terminais ou tablets na estação.

**Limite de segurança:** As funções de segurança (proteções, paradas de emergência, intertravamentos de segurança) pertencem a controles com classificação de segurança nos Níveis 1 e 2, nunca ao MES. O MES pode bloquear a *próxima etapa da ordem*; não deve ser o único elemento que mantém uma pessoa segura.

**Falha típica:** Digitalizar um procedimento em papel de 40 páginas um a um. Reescreva as instruções para a tela, teste-as com os operadores e mantenha-as curtas. Veja [trabalho padronizado](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) e [manufatura sem papel](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/).

### 6. Coleta de dados (aquisição de dados)

**O que faz:** Captura quantidades, tempos, estados, parâmetros e medições, automaticamente a partir das máquinas sempre que possível e manualmente quando não for.

**O que precisa:** Conectividade com as máquinas (OPC UA, MTConnect, protocolos dos fabricantes ou I/O simples para contadores e estados), um modelo de tempo (o que conta como parada planejada) e listas de códigos de motivo que os operadores realmente consigam usar.

**Falha típica:** 120 códigos de motivo de parada. Os operadores escolhem o primeiro da lista. Comece com oito a quinze códigos por área e refine-os junto com as pessoas que os utilizam.

### 7. Gestão da qualidade na execução

**O que faz:** Inspeções em processo, CEP, planos de amostragem, bloqueios e liberações, registro de não conformidades e vínculos com o SGQ para investigação.

**O que precisa:** Planos de controle e características da engenharia da qualidade (na indústria automotiva, o PFMEA e o plano de controle), integração de instrumentos de medição e regras para o que acontece em uma verificação reprovada.

**Falha típica:** Resultados de inspeção coletados, mas nunca usados para parar o processo. Uma verificação que não consegue parar a linha é um registro, não um controle. O trabalho de causa raiz pertence ao sistema de qualidade; veja [Seis Sigma e análise de causa raiz](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).

### 8. Rastreamento, rastreabilidade e genealogia

**O que faz:** Acompanha o trabalho em processo e constrói o registro as-built: quais lotes de material e componentes, de quais fornecedores, entraram em quais números de série ou lotes, processados em qual equipamento, com quais parâmetros e por quem. MESA-11: rastreamento de produto e genealogia [9].

**O que precisa:** Identificação única (códigos de barras, códigos 2D, RFID), leitura disciplinada em cada ponto de consumo de material e uma regra clara para materiais a granel (nível de lote versus nível de número de série).

**Falha típica:** Genealogia reconstruída depois, a partir de documentos de expedição. Ela precisa ser capturada no processo. Um teste simples: escolha um número de série de produto acabado aleatório e pergunte quanto tempo leva para listar todos os lotes de componentes. Depois inverta: escolha um lote de componente e liste todas as unidades acabadas que o contêm.

### 9. Análise de desempenho

**O que faz:** OEE, rendimento, sucata, tempo de ciclo, aderência ao cronograma e análise de paradas por turno, linha e produto; é a entrada para as reuniões diárias do chão de fábrica. A seção 14 trata dos KPIs.

**Falha típica:** Painéis que ninguém discute. Vincule cada KPI a uma reunião e a um responsável, conforme descrito em [gestão do chão de fábrica](https://www.m365.fm/en/learn/shop-floor-management/).

### 10. Controle de documentos

**O que faz:** Entrega a revisão atual de desenhos, instruções e especificações à estação e registra qual revisão foi utilizada. Frequentemente compartilhado com um sistema de gestão documental ou o SGQ, ou delegado a eles.

### 11. Gestão de mão de obra

**O que faz:** Registra quem trabalhou em qual ordem e por quanto tempo, para custeio, verificações de qualificação e integrações com a folha de pagamento. Observe o aspecto humano na seção 15: o rastreamento de mão de obra no nível de operação é sensível e, em fábricas sindicalizadas, pode estar sujeito a negociação coletiva.

### 12. Funções relacionadas à manutenção

**O que faz:** Estados das máquinas, contadores e alarmes do MES alimentam a manutenção baseada em condição ou em uso no CMMS. A gestão completa da manutenção normalmente permanece no CMMS. Veja [TPM e OEE](https://www.m365.fm/en/learn/tpm-oee/) e [manutenção preditiva e IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/).

### 13. Estoque e fluxo de materiais na linha

**O que faz:** Solicita material para a linha, confirma o consumo, acompanha os buffers de WIP e o estoque na linha. Sinais kanban podem ser disparados a partir dos dados de consumo do MES; veja [kanban e sistemas puxados](https://www.m365.fm/en/learn/kanban-pull-system/) e [intralogística](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/).

### Discreta, processo e batelada: como a ênfase muda

| Tipo de indústria | Ênfase típica do MES | Exemplos |
|---|---|---|
| Discreta, alto volume (automotiva, eletrônica) | Genealogia serial, intertravamentos, dados de máquina, OEE, Andon | Linha de carroceria, montagem de PCI |
| Discreta, alto mix, baixo volume (máquinas, aeroespacial) | Instruções de trabalho, travelers, não conformidade, qualificação de operadores, configuração as-built | Montagem de máquinas-ferramenta, estruturas de aeronaves |
| Batelada (farmacêutica, alimentos, química fina) | Registros eletrônicos de batelada, execução de receitas, pesagem e dosagem, revisão por exceção, conformidade | Fabricação de comprimidos, molhos |
| Contínua (papel, aço, refino) | Apontamento de produção por tempo e lote, qualidade por amostragem, energia, integração com DCS e LIMS | Máquina de papel, laminador de tiras a quente |

Para particularidades aeroespaciais (AS9100, inspeção do primeiro artigo, controle de configuração), veja [planejamento da produção aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/).

## Integração: B2MML, OPC UA, MTConnect e o namespace unificado

Um MES é tão bom quanto as suas interfaces. Ele precisa de ordens e dados mestres vindos de cima, dados de máquina vindos de baixo, e deve devolver os resultados confirmados. Quatro blocos de construção se repetem.

### Para cima: integração com ERP e B2MML

A interface ERP-MES transporta um pequeno número de tipos de mensagem, que se mapeiam bem nas categorias de informação da ISA-95:

| Direção | Mensagem | Conteúdo | Gatilho |
|---|---|---|---|
| ERP -> MES | Definição de produto / roteiro | Operações, BOM, centros de trabalho, tempos padrão | Liberação de alteração de engenharia |
| ERP -> MES | Ordem de produção (programação) | Material, quantidade, data de entrega, referência de roteiro | Liberação da ordem |
| ERP -> MES | Cadastro de materiais, lotes | IDs de material, características de lote | Alteração, recebimento |
| MES -> ERP | Confirmação de operação (desempenho) | Quantidades boas e refugo, tempos, mão de obra | Fim da operação ou periódico |
| MES -> ERP | Movimentações de estoque | Consumo, entrada de produção acabada | Leitura de consumo, encerramento da ordem |
| MES -> ERP | Notificação de qualidade | Defeitos, bloqueios | Não conformidade |
| MES <-> ERP | Capacidade / status | Disponibilidade de recursos, status da ordem | Mudança de status |

**B2MML** (Business To Manufacturing Markup Language) é a implementação XML da MESA dos modelos de objetos da ISA-95; o companion specification da ISA-95 da OPC Foundation segue o mapeamento B2MML sempre que possível para facilitar a tradução [5]. Usar B2MML ou um equivalente em JSON não torna uma interface plug-and-play, mas dá aos dois lados os mesmos nomes e estruturas de objetos, o que encurta o trabalho de especificação. Com a dissolução da MESA, confirme onde os esquemas são mantidos (veja a seção 2) [11].

**Regras que economizam meses:**

- Defina, para cada atributo, qual sistema é o mestre, e nunca deixe dois sistemas gravarem o mesmo campo.
- Acorde o *evento* que dispara uma confirmação (fim da operação, a cada 15 minutos, fim da ordem), não apenas o formato.
- Torne as interfaces idempotentes: uma mensagem enviada duas vezes não deve lançar quantidades em dobro.
- Planeje para o ERP estar indisponível. O MES deve continuar funcionando e enfileirar os lançamentos.

### Para baixo: integração com máquinas e controles via OPC UA e MTConnect

**OPC UA** é a interface neutra quanto a fornecedor dominante entre controladores e software de Nível 3. A OPC Foundation mantém companion specifications que definem modelos de informação para domínios específicos, incluindo a OPC 10030, que mapeia o modelo comum de objetos da ISA-95 para OPC UA [4][5]. No Azure IoT Operations da Microsoft, por exemplo, o conector OPC UA lê os pontos de dados configurados e os publica em um broker MQTT [26]; o guia irmão [Manufacturing IT com Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) trata dessa pilha.

**MTConnect** é um padrão aberto para dados de máquinas-ferramenta e equipamentos de manufatura, publicado como ANSI/MTC1.4-2018 [22]. Muitos fabricantes de máquinas-ferramenta dos EUA o suportam nativamente, o que o torna atraente para oficinas de usinagem com equipamentos CNC.

Para linhas de embalagem, o modelo de estados PackML (do relatório técnico ISA-TR88.00.02, edição atual de 2022) oferece às máquinas um conjunto comum de estados e modos [37], o que simplifica o cálculo de OEE entre diferentes OEMs.

**O que você precisa da máquina, no mínimo:** um estado (em operação, parada, com falha, em preparação), um contador de peças boas, um contador de refugo, o programa ou receita ativa e os códigos de alarme. Todo o resto é um bônus para casos de uso futuros.

### Lateral e para fora: o namespace unificado (UNS)

Um **namespace unificado** (unified namespace, UNS) é um padrão de arquitetura, não um padrão formal: os sistemas publicam seu estado atual como eventos em um broker central, tipicamente MQTT, organizado em uma árvore hierárquica de tópicos, e outros sistemas assinam o que precisam. A árvore de tópicos normalmente segue a hierarquia de equipamentos da ISA-95. O [pilar de Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) mostra um exemplo completo de tópicos e os serviços do Azure que o implementam; esta seção foca no que um UNS significa para o MES.

```
acme/dayton/machining/line-2/cnc-3/state
acme/dayton/machining/line-2/cnc-3/counts
acme/dayton/machining/line-2/order/current
acme/dayton/assembly/test-cell-t1/lt-1/result
```

**MQTT** é um protocolo leve de publicação/assinatura; os brokers atuais suportam as versões 3.1.1 e 5, como a Microsoft documenta para o broker no Azure IoT Operations [25]. **Sparkplug**, mantido pelo Eclipse Sparkplug Working Group, adiciona uma convenção de payload e de estado sobre o MQTT; a versão 3.0 é a atual. Seus "certificados de nascimento e de morte" (birth and death certificates) informam aos assinantes se os dados de um dispositivo ainda são válidos [28]. A estrutura de tópicos própria do Sparkplug (grupo, nó de borda, dispositivo) não é a hierarquia da ISA-95, então plantas que o utilizam normalmente mapeiam a hierarquia no ID do grupo (por exemplo `spBv1.0/Plant1:Area3:Line4:Cell2/NDATA/<edge node>`) ou dividem os níveis entre brokers diferentes ou um segundo namespace estruturado conforme a ISA-95; um fornecedor de brokers descreve ambos os padrões e alerta que o número limitado de elementos de tópico do Sparkplug torna o mapeamento apertado [44].

**O que um UNS muda para o MES:**

| Sem UNS | Com UNS |
|---|---|
| O MES se conecta ponto a ponto a cada máquina, ERP, QMS e painel | O MES assina tópicos de máquinas e de ordens e publica seus próprios eventos (ordem iniciada, operação concluída, bloqueio aplicado) |
| Novos consumidores (um painel, um modelo de IA) exigem uma nova interface com o MES | Novos consumidores assinam tópicos existentes |
| O estado atual está espalhado entre os sistemas | O estado atual fica visível em um único lugar |

**O que um UNS não muda:**

- **A lógica de negócio permanece no MES.** O broker move mensagens; não garante que o material correto seja usado, que um operador esteja qualificado ou que um registro de lote esteja completo.
- **Os registros de referência permanecem nos sistemas de registro.** Um broker guarda o estado atual, não um histórico auditável. Genealogia, registros de lote e confirmações devem ser armazenados de forma transacional no MES (e no ERP), com trilhas de auditoria onde houver regulamentação.
- **A semântica ainda precisa de um modelo.** Um tópico chamado `counts` não serve de nada se uma máquina conta ciclos e outra conta peças boas. Os objetos da ISA-95 e as especificações companheiras do OPC UA fornecem a semântica dos payloads.
- **A segurança fica mais difícil, não mais fácil.** Um broker no qual todos os sistemas podem escrever é um alvo de alto valor; controle de acesso por tópico, clientes autenticados e segmentação conforme a ISA/IEC 62443 são obrigatórios [23][24].

**Debate: "O UNS substitui a ISA-95."** Você vai encontrar essa afirmação. Ela confunde duas coisas. A própria posição da ISA é que os níveis ainda ajudam a descrever as fronteiras dos sistemas, mesmo quando os dados não fluem nível a nível [1], e a edição da Parte 1 de 2025 mira explicitamente arquiteturas modulares e orientadas a dados [2]. A síntese viável: a ISA-95 para o vocabulário, a hierarquia de equipamentos e as responsabilidades; o UNS (ou outro backbone de eventos) para o transporte; e o MES e o ERP como sistemas de registro transacionais.

### Arquitetura de integração: três padrões comparados

| Padrão | Como funciona | Indicado para | Pontos de atenção |
|---|---|---|---|
| Ponto a ponto | Cada sistema tem interfaces diretas com os demais | Plantas pequenas com 3 a 5 sistemas | Até n × (n − 1) ÷ 2 interfaces: 10 para 5 sistemas, 45 para 10; atualizações frágeis |
| Middleware de integração / ESB | Uma camada central de integração transforma e roteia mensagens | Empresas centradas em ERP, com equipes de integração de TI | Pode se tornar um gargalo sob responsabilidade de uma equipe distante |
| Backbone de eventos / UNS | Broker de publicação/assinatura com convenção compartilhada de tópicos e payloads | Plantas com muitas máquinas e muitos consumidores de dados | Exige governança de tópicos, payloads e acesso; fluxos transacionais ainda precisam de entrega garantida |

A maioria das plantas acaba com uma combinação: um UNS para dados de máquinas e de estado, e uma integração com entrega garantida para as transações do ERP.

## MES em setores regulados

Em setores regulados, o MES faz parte do sistema de qualidade, e seus registros são registros legais. Esta seção apresenta as regras dos EUA que você precisa considerar no projeto; ela não substitui a orientação da sua equipe de assuntos regulatórios.

### FDA 21 CFR Part 11: registros eletrônicos e assinaturas

Para sistemas fechados, o 21 CFR 11.10 exige, entre outros controles, a validação dos sistemas quanto à exatidão, confiabilidade e desempenho consistente conforme o uso pretendido; a capacidade de gerar cópias precisas e completas dos registros; a proteção dos registros durante todo o período de retenção; a limitação do acesso ao sistema a pessoas autorizadas; e "trilhas de auditoria seguras, geradas por computador e com carimbo de data e hora", que registrem a data e a hora das entradas e ações do operador que criam, modificam ou excluem registros, sem ocultar informações previamente registradas [19]. Outros parágrafos tratam de verificações operacionais e de autoridade, verificações de dispositivos, treinamento e políticas escritas.

**O que isso significa para um MES:** contas de usuário individuais (sem logins compartilhados no terminal), trilhas de auditoria em todos os registros regulados, assinaturas eletrônicas vinculadas ao registro que mostrem o nome do signatário, a data, a hora e o significado da assinatura, e um pacote de validação. Planeje o trabalho de validação em termos de tempo e orçamento; na indústria farmacêutica ele costuma representar uma parcela grande do esforço de implantação [unverified: não há referência pública para a parcela].

### Farmacêutica: registros eletrônicos de lote

Os fabricantes de medicamentos devem manter os registros de produção e controle de cada lote, conforme as regras de boas práticas de fabricação em 21 CFR Part 211; a seção 211.188 estabelece que "os registros de produção e controle de lote devem ser preparados para cada lote de produto farmacêutico fabricado" [38]. Um MES com registros eletrônicos de lote (eBR) impõe a sequência da receita, captura pesos e parâmetros na origem e oferece suporte à **revisão por exceção**: o revisor de QA verifica os desvios sinalizados pelo sistema, em vez de ler cada página. Esse é um dos casos de negócio mais fortes para MES em qualquer setor, porque o tempo de revisão dos registros de lote muitas vezes limita a liberação.

### Dispositivos médicos: QMSR e registros históricos do dispositivo

Desde 2 de fevereiro de 2026, o Quality Management System Regulation (21 CFR Part 820) da FDA incorpora por referência a ISO 13485:2016, inclusive seus requisitos de identificação e rastreabilidade [20]. O termo mais antigo "device history record" (DHR, registro histórico do dispositivo) ainda aparece em muitas descrições de produtos MES e procedimentos de fábrica; a página do QMSR da FDA não usa o termo. Portanto, nossa recomendação é mapear seus registros para os requisitos da ISO 13485:2016 que o QMSR incorpora, e não para as antigas numerações de seção da Part 820, e confirmar esse mapeamento com a equipe de assuntos regulatórios. O MES normalmente produz o registro as-built por lote ou número de série: componentes, operações, inspeções, equipamentos e pessoal.

### Alimentos: rastreabilidade FSMA 204

A Food Traceability Rule da FDA (FSMA Seção 204) exige elementos-chave de dados para eventos críticos de rastreamento (recebimento, transformação, expedição) vinculados a um código de lote de rastreabilidade, com os registros fornecidos à FDA em até 24 horas após uma solicitação; a FDA não fará a aplicação da norma antes de 20 de julho de 2028 [29]. Os eventos de transformação acontecem na produção, de modo que o MES ou um módulo de rastreabilidade é o lugar natural para criar os códigos de lote e vincular entradas a saídas.

### Automotivo e aeroespacial

As normas IATF 16949 e AS9100 acrescentam requisitos de rastreabilidade, plano de controle e primeiro artigo; requisitos específicos de clientes frequentemente vão além. Na IATF 16949, a seção 8.5.2.1 complementa os requisitos de identificação e rastreabilidade da ISO 9001 com planos de rastreabilidade documentados, baseados em "os níveis de risco ou gravidade de falha para colaboradores, clientes e consumidores", segundo uma matriz comparativa de um organismo de certificação [39] (fonte secundária; a norma é um texto pago). Ambas as normas são textos pagos; o guia [aerospace production planning](https://www.m365.fm/en/learn/aerospace-production-planning/) trata da AS9100 e da AS9102 em profundidade.

### Abordagem de validação

O guia final da FDA *Computer Software Assurance for Production and Quality Management System Software* (CDRH e CBER, fevereiro de 2026) descreve uma abordagem baseada em risco para estabelecer confiança no software de produção e de sistemas de gestão da qualidade e para decidir onde é necessário mais rigor [40]. Ele foi escrito para fabricantes de dispositivos médicos sob a 21 CFR Parte 820; fabricantes de medicamentos podem usá-lo como orientação, não como regra própria. Na prática: classifique cada função do MES por risco, teste com rigor as funções de alto risco (assinaturas eletrônicas, intertravamentos, cálculos, rastreabilidade de genealogia) por meio de testes roteirizados e use testes não roteirizados ou fornecidos pelo fornecedor para configurações de baixo risco. Peça aos fornecedores seus aceleradores de validação e a sua própria certificação de sistema da qualidade.

## Opções de implantação e arquitetura

O mercado passou de "uma grande suíte MES por fábrica" para um conjunto mais amplo de opções. Elas diferem quanto ao local onde o software roda e quanto à sua estrutura.

### Onde roda: local, nuvem, híbrido

| Opção | Descrição | Prós | Contras |
|---|---|---|---|
| Local (on-premises) | Servidores MES na fábrica ou no data center da empresa | Continua funcionando quando a WAN cai; controle total; familiar para as equipes de validação | Hardware, aplicação de patches e atualizações são responsabilidade sua; atualizações costumam ser adiadas por anos |
| Nuvem (SaaS) | O fornecedor executa o MES em sua nuvem; a fábrica se conecta por gateways | Início mais rápido, atualizações gerenciadas pelo fornecedor, custo por assinatura | Dependência da WAN; latência para intertravamentos; residência de dados; cadência de atualização imposta precisa se encaixar na validação |
| Híbrido / edge mais nuvem | Execução crítica em tempo em um nó de borda na fábrica; análises e gestão na nuvem | Mantém a operação durante quedas; escala as análises | Dois ambientes para operar e proteger; lógica de sincronização |

**Regra prática:** tudo o que precisa impedir uma etapa errada ou manter uma linha em operação deve funcionar quando a conexão com a internet estiver fora. Peça a cada fornecedor de nuvem que demonstre o comportamento offline, e não apenas que o descreva.

### Como é estruturado: suíte, plataforma, módulo de ERP

| Abordagem | O que você obtém | Indicada para | Riscos |
|---|---|---|---|
| Suíte MES industrial | Funcionalidade ampla e pré-construída para uma ou várias indústrias, frequentemente com recursos regulatórios | Fábricas reguladas e complexas; padronização multissite | Projetos longos, customização pesada, dependência do fornecedor, custo elevado de licença |
| Composável / plataforma de aplicativos ("MES de nova geração") | Uma plataforma com ferramentas low-code e conectores; a fábrica constrói ou configura aplicativos para casos de uso específicos | Fábricas que querem começar pequenas e expandir; operações de alto mix; equipes internas fortes | Muitos aplicativos pequenos sem um modelo de dados compartilhado; governança; validação de aplicativos criados por usuários finais |
| MES integrado ao ERP | Módulo MES ou produto complementar do fornecedor do ERP | Empresas centradas no ERP com complexidade moderada de chão de fábrica | Usabilidade no chão de fábrica e integração com máquinas podem ficar atrás de produtos especializados |
| Desenvolvimento próprio | Software próprio sobre uma plataforma genérica | Processos únicos, equipe de software forte | Você fica responsável pela manutenção para sempre (seção 10) |

"MES composável" é um termo de marketing de fornecedores e analistas, e não uma categoria padrão. A ideia subjacente, pequenas funções que compartilham um único modelo de dados e podem ser adicionadas ao longo do tempo, é sólida e corresponde à visão por atividade da ISA-95. O risco é o oposto do monólito: vinte aplicativos que cada um define "ordem" e "máquina" de forma diferente. A hierarquia de equipamentos e os modelos de objetos da ISA-95 são o antídoto.

### Modelos multissite

Para empresas com várias fábricas, a questão é menos "qual MES" e mais "quanta padronização". Uma abordagem comum é um **modelo global** (modelo de dados, processos centrais, interfaces, KPIs) com extensões locais. Mantenha o modelo restrito ao que precisa ser comparável entre os sites (definições de KPI conforme a ISO 22400, genealogia, interface com o ERP); deixe os sites variarem onde seus processos forem diferentes.

## Construir ou comprar

A maioria das fábricas deve comprar (ou assinar) e configurar. Construir faz sentido em menos casos do que as equipes de engenharia gostam de acreditar, mas em mais casos do que os fornecedores admitem.

### Fatores de decisão

| Fator | Aponta para comprar | Aponta para construir ou construir sobre plataforma |
|---|---|---|
| Singularidade do processo | Os processos se assemelham às práticas do setor | Os processos são um diferencial competitivo real e mudam com frequência |
| Regulamentação | Ambiente validado e regulamentado (Part 11, GMP) | Ambiente não regulamentado ou com pouca regulamentação |
| Capacidade interna | Sem equipe de software, ou uma equipe totalmente ocupada com o ERP | Equipe experiente, capaz de manter o software por mais de 10 anos |
| Escopo | Amplo: execução, qualidade, genealogia, programação | Restrito: coleta de dados e OEE, instruções de trabalho digitais |
| Prazo | Necessidade de resultados em meses | Possibilidade de investir em um desenvolvimento mais longo |
| Custo total em 10 anos | Licença mais configuração inferior ao custo de uma equipe | Custo da equipe já foi absorvido e é estável |
| Risco de dependência de pessoas-chave | Inaceitável | Mitigado por documentação e tamanho da equipe |

### O custo oculto de construir

Um MES próprio não tem taxa de licença, mas você paga por requisitos, desenvolvimento, testes, documentação, hospedagem, correções de segurança, atualizações da plataforma subjacente, suporte às 3 da manhã e, em setores regulamentados, validação de cada alteração. A falha mais comum não é a primeira versão; é o quinto ano, quando o desenvolvedor original saiu e a fábrica roda um software que ninguém tem coragem de alterar.

### Um caminho intermediário

Muitas fábricas compram uma plataforma ou um MES para o núcleo (execução, genealogia, interface com o ERP) e constroem aplicativos ou painéis específicos sobre ele, usando suas APIs ou ferramentas de baixo código. Isso funciona quando o núcleo adquirido é dono do modelo de dados e as partes personalizadas apenas leem dele ou utilizam APIs documentadas.

## Checklist de seleção de fornecedor de MES

A tabela abaixo é um checklist de seleção com 30 critérios em oito grupos. Pondere os grupos conforme a sua situação (os pesos sugeridos se adequam a uma fábrica discreta de porte médio e pouco regulamentada), atribua a cada fornecedor uma nota de 0 a 4 por critério e, o mais importante, use a coluna **método de teste**: nenhum critério deve ser avaliado com base em apresentações de slides.

| # | Grupo (peso sugerido) | Critério | Como testar |
|---|---|---|---|
| 1 | Adequação funcional (25%) | Cobre seus principais casos de uso da matriz de atividades ISA-95 | Demonstração roteirizada com seus próprios produtos, roteiros e um pedido real |
| 2 | Adequação funcional | Instruções de trabalho: visuais, versionadas, com imposição de etapas | O operador monta e executa uma instrução durante a demonstração |
| 3 | Adequação funcional | Genealogia no nível que você precisa (lote, serial, ambos) | Rastreamento para frente e para trás nos dados de demonstração em até 60 segundos |
| 4 | Adequação funcional | Qualidade na execução: verificações, CEP, bloqueios, não conformidades | Forçar uma verificação com falha e mostrar o que para |
| 5 | Adequação funcional | Paradas e OEE conforme o seu modelo de tempo | Configurar seus códigos de motivo e regras de paradas planejadas |
| 6 | Adequação funcional | Profundidade de programação e despacho (ou integração com APS) | Reprogramar a sequência após a quebra de uma máquina |
| 7 | Integração (15%) | Conector de ERP para o seu ERP e versão | Cliente de referência com o mesmo ERP; revisar a documentação da interface |
| 8 | Integração | Conectividade com máquinas: OPC UA, MTConnect, suas marcas de CLP | Conectar uma das suas máquinas em uma prova de conceito |
| 9 | Integração | APIs abertas (REST, eventos), documentadas e versionadas | Desenvolvedor lê a documentação da API e constrói uma pequena consulta |
| 10 | Integração | Suporte a objetos ISA-95 ou B2MML | Solicitar o mapeamento do modelo de dados para ISA-95 |
| 11 | Integração | Publicação de eventos para MQTT / UNS | Mostrar eventos em um broker durante a demonstração |
| 12 | Dados e arquitetura (10%) | O modelo de dados segue ou mapeia a hierarquia de equipamentos ISA-95 | Revisar a configuração do modelo de equipamentos |
| 13 | Dados e arquitetura | Capacidade offline na borda | Desconectar a WAN durante a prova de conceito |
| 14 | Dados e arquitetura | Exportação e propriedade dos dados: você pode obter todos os dados em formatos abertos | Cláusula contratual mais uma exportação de teste |
| 15 | Dados e arquitetura | Capacidade de modelo para múltiplas plantas | Referência com três ou mais plantas |
| 16 | Usabilidade (10%) | Telas do operador utilizáveis com luvas, em tablets, com ruído | Dois operadores testam sem treinamento por 30 minutos |
| 17 | Usabilidade | Configuração por supervisores e engenheiros sem código | Engenheiro altera uma etapa de roteiro e uma verificação |
| 18 | Usabilidade | Idiomas que sua força de trabalho lê | Mostrar as telas em cada idioma |
| 19 | Conformidade e segurança (10%) | Recursos da Parte 11, se necessários (trilha de auditoria, assinatura eletrônica) | Demonstrar a trilha de auditoria em um registro alterado |
| 20 | Conformidade e segurança | Desenvolvimento seguro e certificação de segurança do produto (ex.: ISA/IEC 62443-4-1/4-2) | Certificados e a política de divulgação de vulnerabilidades do fornecedor [23] |
| 21 | Conformidade e segurança | Integração de identidade (SSO, MFA para administradores, modelo de funções) | Configurar funções para operador, supervisor, qualidade |
| 22 | Conformidade e segurança | Documentos de suporte à validação | Revisar o pacote de validação |
| 23 | Fornecedor e parceiro (10%) | Estabilidade financeira e propriedade | Relatórios anuais ou consulta de crédito; mudanças de controle nos últimos cinco anos |
| 24 | Fornecedor e parceiro | Parceiro de implementação com referências no seu setor e região | Ligar para duas referências sem a presença do fornecedor |
| 25 | Fornecedor e parceiro | Roteiro do produto e cadência de lançamentos | Roteiro sob NDA; com que frequência os clientes realmente atualizam? |
| 26 | Fornecedor e parceiro | Modelo de suporte e horário | Texto do SLA; quem atende às 2h de um sábado? |
| 27 | Custo (15%) | Custo total de propriedade em cinco anos | Seu modelo de TCO (seção 13) preenchido com cotações dos fornecedores |
| 28 | Custo | Modelo de licenciamento compatível com o crescimento (por planta, por usuário, por máquina, consumo) | Precificar hoje o cenário de expansão de 3 anos |
| 29 | Custo | Custo de atualizações e customizações | Perguntar quanto custou uma atualização para um cliente de referência |
| 30 | Saída (5%) | Plano de saída: dados, configurações, documentação na rescisão | Cláusula contratual; perguntar como um cliente anterior migrou para outra solução |

**Pontuação:** pontuação ponderada = soma, sobre os grupos, de (peso do grupo × média das notas dos critérios ÷ 4). Um fornecedor com 78% vence um com 72% somente se nenhum dos dois tiver eliminatória: qualquer critério com nota 0 em adequação funcional, em capacidade offline (se exigida) ou em conformidade deve eliminar o fornecedor, independentemente do total.

**Dicas de processo:**

- Escreva a solicitação de proposta (RFP) com base em casos de uso e na matriz de atividades, e não em uma lista de funcionalidades de 600 linhas. Listas de funcionalidades recebem "sim" em todas as linhas.
- Exija uma prova de conceito (PoC) paga em uma linha de produção, usando os seus próprios dados, antes da decisão final. Duas a seis semanas é uma faixa típica [unverified: estimativa de profissionais da área].
- Deixe operadores e supervisores avaliarem a usabilidade; deixe a área financeira avaliar o custo; mantenha as notas separadas até o final.
- Como ponto de partida neutro em relação a fornecedores, as análises de analistas (o Gartner Peer Insights lista o mercado de MES [8]) e as referências de fábricas pares são mais úteis do que rankings de fornecedores publicados pelos próprios fornecedores.

## Roteiro de implementação do MES

O roteiro abaixo é para uma única fábrica de porte médio. As durações são premissas de planejamento para um produto configurado, e não benchmarks; fábricas reguladas e construções sob medida levam mais tempo [unverified: estimativas de profissionais da área].

| Fase | Duração (premissa típica) | Principais atividades | Critérios de saída |
|---|---|---|---|
| 0. Caso e escopo | 4 a 8 semanas | Declaração do problema, caminhada pelo fluxo de valor, matriz de atividades ISA-95 como está, KPIs de linha de base, rascunho do caso de negócio | Patrocinador, faixa de orçamento e uma cadeia de valor piloto aprovados |
| 1. Requisitos e seleção | 8 a 16 semanas | Casos de uso, modelo de dados (hierarquia de equipamentos, responsabilidade pelos dados mestres), RFP, demonstrações roteirizadas, prova de conceito | Fornecedor e parceiro selecionados, contrato com cláusulas de saída e de dados |
| 2. Projeto | 6 a 10 semanas | Projeto da solução, especificações de interface, modelo de tempo e códigos de motivo, padrões de instruções de trabalho, plano de validação (se regulado), projeto de segurança | Projeto assinado, plano de testes |
| 3. Construção e testes do piloto | 10 a 20 semanas | Configuração, conectividade com máquinas, interface com ERP, migração de dados, ciclos de teste, treinamento de operadores | Aceitação pelo usuário na linha piloto |
| 4. Entrada em operação do piloto e estabilização | 6 a 12 semanas | Entrada em operação com hypercare, revisão diária de problemas, comparação de KPIs com a linha de base | KPIs estáveis por 4 semanas consecutivas; defeitos em aberto abaixo do limite acordado |
| 5. Implantação | 3 a 6 meses por onda | Demais linhas e áreas; modelo refinado | Todas as áreas no escopo em operação |
| 6. Melhoria contínua | Contínua | Novos casos de uso, atualizações, melhoria orientada por KPIs | Gerida pela fábrica, e não pelo projeto |

### Fase 0 em detalhe: comece pelo fluxo de valor

Percorra primeiro o fluxo de valor. Mapeie onde a informação é atrasada, redigitada ou ausente, e onde escapam falhas de qualidade ou se originam prazos longos de entrega. O guia de [mapeamento do fluxo de valor](https://www.m365.fm/en/learn/value-stream-mapping/) mostra como fazê-lo; um mapa do estado atual com o fluxo de informações desenhado é o melhor documento de requisitos de MES que você pode produzir em uma semana. Escolha um piloto importante o suficiente para fazer diferença e contido o suficiente para ser concluído: uma linha ou uma família de produtos com um ponto de dor claro.

### Fase 1 em detalhe: o modelo de dados antes do software

Defina a hierarquia de equipamentos (seção 4), o responsável pelos dados mestres de cada objeto (material, roteiro, equipamentos, pessoal), o modelo de tempo para OEE (o que é tempo de produção planejado) e o modelo de status de ordens e operações. Se não for possível acordar esses pontos com ERP, qualidade e manutenção antes da seleção, nenhum fornecedor resolverá isso por você.

### Lista de verificação para entrada em operação

| Verificação | Concluído |
|---|---|
| Dados mestres dos produtos-piloto verificados no chão de fábrica (etapas do roteiro, BOM, instruções) | ☐ |
| Cada operador treinado em sua própria estação com ordens reais, e não apenas em sala de aula | ☐ |
| Procedimento de contingência (roteiro em papel) impresso e testado para uma parada do MES | ☐ |
| Interface com o ERP testada com casos de erro (ERP indisponível, mensagem duplicada, quantidade incorreta) | ☐ |
| Códigos de motivo e verificações revisados com os operadores | ☐ |
| Escala de hypercare para as duas primeiras semanas, em todos os turnos | ☐ |
| KPIs de linha de base congelados para comparação | ☐ |
| Segurança: contas, funções, MFA para administradores, backups testados | ☐ |
| Regulado: relatório resumo de validação aprovado antes do uso em produção | ☐ |

### Funções

| Função | Responsabilidade |
|---|---|
| Patrocinador executivo (gerente da fábrica ou VP de operações) | Decide conflitos de escopo, protege os recursos |
| Dono do produto pela área de operações | Responsável pelos casos de uso e prioridades, assina a aceitação |
| Líder de MES / arquiteto de solução | Projeto, modelo de dados, integração |
| Engenheiro de TI/OT | Infraestrutura, redes, conectividade com máquinas, segurança |
| Qualidade e regulatório | Verificações, registros, validação |
| Usuários-chave por área e turno | Testar, treinar colegas, dar feedback |
| Parceiro financeiro | Caso de negócio, acompanhamento de benefícios |
| Fornecedor / integrador | Configuração, conhecimento do produto |

## Custo e ROI de MES com um exemplo trabalhado

"Quanto custa um MES?" não tem um único número honesto. Os preços dependem do escopo, do número de linhas e usuários, do modelo de implantação, da regulamentação e do esforço de integração, e os fornecedores raramente os publicam. Algumas páginas da web apresentam faixas sem fonte; nós não as repetimos. Em vez disso, apresentamos aqui uma estrutura para o seu próprio custo total de propriedade e um exemplo trabalhado com **premissas ilustrativas** que você deve substituir pelas suas cotações e linhas de base.

### Estrutura de custos

| Bloco de custo | Único | Recorrente | Observações |
|---|---|---|---|
| Software | Licença perpétua (se houver) | Assinatura ou manutenção (frequentemente um percentual da licença por ano) | Verifique a métrica: site, usuário, máquina, consumo |
| Serviços de implementação | Configuração, interfaces, migração de dados, gestão de projeto | Solicitações de mudança | Geralmente o maior bloco único |
| Hardware e rede | Terminais, tablets, scanners, impressoras de etiquetas, servidores de borda, Wi-Fi, cabeamento | Ciclo de substituição | Frequentemente subestimado em fábricas antigas |
| Conectividade de máquinas | Gateways, programação de CLPs, retrofits em máquinas antigas | Manutenção | Preço por tipo de máquina, não por máquina |
| Equipe interna | Equipe de projeto, usuários-chave, cobertura de suas atividades normais | Suporte ao MES, administração, melhoria contínua | Considere o custo carregado |
| Treinamento | Desenho do treinamento e sessões | Novos contratados, reciclagens | |
| Validação (regulada) | Plano de validação, protocolos, execução | Revalidação após mudanças e atualizações | |
| Hospedagem e operações | Configuração inicial | Taxas de nuvem ou operação de servidores, backups, monitoramento de segurança | |

**Capex vs. opex:** o MES por assinatura é geralmente opex; licenças perpétuas, hardware e alguns custos de implementação podem ser capitalizados, dependendo da sua política contábil. Pelo US GAAP, o ASC 350-40 rege o software de uso interno. Desde a ASU 2018-15 (agosto de 2018), os custos de implementação de um arranjo de nuvem que é um contrato de serviço seguem as mesmas etapas de capitalização, mas os custos capitalizados são apresentados como taxas de hospedagem pagas antecipadamente, amortizados ao longo do prazo de hospedagem e exibidos na mesma linha da demonstração de resultados que a taxa [41]. A ASU 2025-06 (setembro de 2025) altera novamente o ASC 350-40, com vigência para períodos anuais que começam após 15 de dezembro de 2027, sendo permitida a adoção antecipada [42]. Acorde o tratamento com seu auditor. A escolha contábil altera o EBITDA e o momento dos custos, não a economia do projeto.

### Estrutura de benefícios

| Linha de benefício | Fórmula | Fonte de dados |
|---|---|---|
| Vazão adicional no gargalo | Horas produtivas adicionais × margem de contribuição por hora | Registro de paradas do MES ou manual, financeiro (somente se houver demanda) |
| Redução de sucata e retrabalho | Custo anual de sucata e retrabalho × redução esperada | Relatórios de custo da qualidade |
| Tempo de mão de obra com papelada e digitação | Horas economizadas × taxa carregada × parcela efetivamente realocada | Estudo de tempos, entrevistas |
| Redução de WIP e estoque | Liberação de caixa única; custo de manutenção × redução por ano | Avaliação de estoque |
| Liberação mais rápida de lotes ou pedidos | Redução do lead time × valor (estoque, entrega no prazo) | Tempos de revisão da qualidade, dados de pedidos |
| Custo evitado de conformidade e recall | Probabilidade × impacto, geralmente fora do caso-base | Registro de riscos |

### Exemplo trabalhado: uma fábrica de válvulas com 220 funcionários

**Situação (todos os valores ilustrativos):** quatro linhas, dois turnos, receita de US$ 85 milhões. A Linha 2 é o gargalo. Usam travessas de papel, confirmações de fim de turno no ERP e não há captura automática de paradas.

**Custos únicos (ano 0):**

| Item | Valor |
|---|---|
| Serviços de implementação | US$ 450.000 |
| Hardware, rede, conectividade de máquinas | US$ 160.000 |
| Equipe interna de projeto (2,5 FTE por 12 meses a US$ 120.000 carregados) | US$ 300.000 |
| Treinamento e cobertura | US$ 60.000 |
| **Total único** | **US$ 970.000** |

**Custos recorrentes (a partir do ano 1):** assinatura de US$ 180.000 + suporte interno ao MES de 1 FTE de US$ 120.000 = **US$ 300.000 por ano**.

**Benefícios em plena operação (caso-base):**

| Benefício | Cálculo | Por ano |
|---|---|---|
| OEE da Linha 2 de 62% para 67% | 4.000 horas planejadas × 5 pontos = 200 horas produtivas adicionais × US$ 2.000 de margem de contribuição por hora | US$ 400.000 |
| Redução de sucata | Custo de sucata de US$ 1,2 milhão × 15% | US$ 180.000 |
| Tempo com papelada | 4.000 horas × US$ 45 carregados × 50% realocadas | US$ 90.000 |
| Custo de manutenção do WIP | WIP de US$ 3,0 milhões × redução de 10% × taxa de manutenção de 20% | US$ 60.000 |
| **Benefício anual total** | | **US$ 730.000** |

Além disso, uma liberação de caixa única do WIP: US$ 3,0 milhões × 10% = US$ 300.000 (premissa para o ano 2).

**Rampa de implantação:** o ano 1 entrega 40 por cento do benefício anual (piloto e implantação), os anos 2 a 5 entregam 100 por cento.

**Fluxos de caixa (em milhares de dólares), taxa de desconto de 10%:**

| Ano | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Caso base | −970 | 730 × 0,4 − 300 = −8 | 730 − 300 + 300 = 730 | 430 | 430 | 430 |
| Acumulado | −970 | −978 | −248 | 182 | 612 | 1.042 |

VPL a 10% = −970 − 8/1,1 + 730/1,1² + 430/1,1³ + 430/1,1⁴ + 430/1,1⁵ ≈ **+$510.000**. Payback simples: o caixa acumulado torna-se positivo durante o ano 3, cerca de 2,6 anos após o início do projeto (248 ÷ 430 = 0,58 do ano 3).

**Caso conservador:** o ganho de OEE é apenas a metade (ou a produção adicional não pode ser vendida integralmente): $200.000 em vez de $400.000; redução de sucata de 10 por cento ($120.000) em vez de 15 por cento. Benefício anual de $470.000, líquido de $170.000 por ano.

| Ano | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Caso conservador | −970 | 470 × 0,4 − 300 = −112 | 470 − 300 + 300 = 470 | 170 | 170 | 170 |
| Acumulado | −970 | −1.082 | −612 | −442 | −272 | −102 |

VPL a 10% ≈ **−$334.000**; sem payback em cinco anos.

**Análise de sensibilidade:** mantendo os benefícios de sucata, papelada e WIP no caso base, o projeto atinge o ponto de equilíbrio (VPL = 0 a 10%) com um benefício de produtividade de cerca de $243.000 por ano, o que equivale a cerca de 121 horas produtivas adicionais ou aproximadamente 3 pontos de OEE na Linha 2, em vez de 5. Se apenas metade do ganho de OEE se materializar e todo o restante se mantiver, o VPL fica em cerca de −$139.000. A sensibilidade a essa única premissa é o achado real.

**O que o exemplo ensina:**

1. **Uma linha domina.** O benefício de produtividade representa mais da metade do caso base. Antes de contabilizá-lo, confirme com vendas que a fábrica está restrita por capacidade nessa linha, ou use o guia da [teoria das restrições](https://www.m365.fm/en/learn/theory-of-constraints/) para identificar primeiro a restrição real.
2. **O custo recorrente importa mais do que sugere a linha de licenças.** O suporte interno representa 40 por cento do custo recorrente aqui e costuma ser deixado de fora.
3. **A rampa de implantação destrói o VPL.** Um piloto que se arrasta por 18 meses em vez de 12 leva o caso conservador ainda mais para o negativo. A velocidade até a primeira linha estável é uma variável financeira.
4. **Benefícios não quantificados são reais, mas separados.** Redução do escopo de recall, prontidão para auditorias e requisitos de clientes podem justificar um MES por si só em cadeias de suprimento reguladas ou orientadas por OEMs. Apresente-os ao lado dos números, não dentro deles.
5. **Acompanhe os benefícios após o go-live** em relação à linha de base congelada, junto com a área financeira, por pelo menos dois anos.

Para as definições de KPIs e custos por trás dessas linhas, veja os [KPIs de manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/).

## KPIs de MES: o que medir e como

Um MES produz os dados para a maioria dos KPIs do chão de fábrica. Dois grupos são relevantes: os KPIs operacionais que o MES calcula e os KPIs que indicam se o próprio MES funciona.

### Definições padrão: ISO 22400

A ISO 22400-2:2014 define indicadores-chave de desempenho para o gerenciamento de operações de manufatura, com fórmula, unidade, periodicidade e grupo de usuários para cada um [16]; fontes secundárias contam 34 KPIs na norma [18], e uma emenda de 2017 acrescentou KPIs de gestão de energia [16]. Usar suas definições torna os KPIs comparáveis entre linhas e plantas. Pesquisadores do NIST publicaram uma estrutura hierárquica desses KPIs, com fórmulas, disponível gratuitamente [17].

### KPIs operacionais do MES

| KPI | Fórmula (simplificada) | Uso típico |
|---|---|---|
| OEE | Disponibilidade × performance × qualidade | Gargalo e equipamentos-chave |
| Disponibilidade | Tempo de funcionamento ÷ tempo de produção planejado | Foco em paradas |
| Performance | (Tempo de ciclo ideal × contagem total) ÷ tempo de funcionamento | Perdas de velocidade, microparadas |
| Qualidade (taxa) | Contagem de boas peças ÷ contagem total | Sucata e retrabalho |
| Rendimento de primeira passagem | Unidades aprovadas sem retrabalho ÷ unidades iniciadas | Capacidade do processo |
| Taxa de sucata | Quantidade de sucata ÷ quantidade produzida | Perda de material |
| Aderência ao cronograma | Ordens (ou quantidade) concluídas conforme programado ÷ programado | Estabilidade do plano |
| Produtividade (throughput) | Unidades boas por hora | Capacidade |
| WIP | Unidades ou valor entre a primeira e a última operação | Fluxo |
| Lead time de ordem | Tempo de conclusão − tempo de liberação | Responsividade ao cliente |
| MTBF / MTTR | Tempo de operação ÷ falhas; tempo de reparo ÷ falhas | Manutenção |

**Exemplo de cálculo do OEE (um turno na Linha 2):** tempo de produção planejado de 450 minutos, parada não planejada de 60 minutos, logo tempo de funcionamento de 390 minutos. Tempo de ciclo ideal de 1,0 minuto, contagem total de 340, contagem de boas peças de 323.

- Disponibilidade = 390 ÷ 450 = 86,7%
- Performance = (1,0 × 340) ÷ 390 = 87,2%
- Qualidade = 323 ÷ 340 = 95,0%
- OEE = 0,867 × 0,872 × 0,950 = **71,8%**

Verificação cruzada: contagem de boas peças × tempo de ciclo ideal ÷ tempo de produção planejado = 323 ÷ 450 = 71,8%. Se o seu MES não passar nesta verificação, o seu modelo de tempo é inconsistente. Muchiri e Pintelon revisam as definições de OEE em uso e suas armadilhas [30]; o guia [TPM e OEE](https://www.m365.fm/en/learn/tpm-oee/) aprofunda o tema.

### KPIs do próprio MES

| KPI | Definição | Direção desejada |
|---|---|---|
| Latência de dados | Tempo entre o evento no chão de fábrica e sua disponibilidade no MES / ERP | Para baixo (minutos, não dias) |
| Taxa de captura automática | Parcela de quantidades e estados capturados das máquinas em comparação com os digitados | Para cima |
| Taxa de correção manual | Correções por 100 ordens | Para baixo |
| Cobertura de códigos de motivo | Parcela dos minutos de parada com um motivo válido | Para cima (acima de 90% é uma meta comum) |
| Tempo de rastreabilidade | Minutos para produzir um rastreamento retroativo completo de um número de série ou lote | Para baixo |
| Adoção | Parcela das ordens executadas integralmente no MES (sem desvio em papel, exceto a contingência documentada de falha) | Para cima (o estado final é 100%; desvios persistentes apontam para um problema de projeto, não de operador) |
| Taxa de erro de interface | Lançamentos com falha ou rejeitados por dia | Para baixo |
| Disponibilidade do MES | Tempo de atividade durante o horário de produção | Para cima |

## Pessoas e chão de fábrica

Um MES muda a forma como os operadores trabalham a cada minuto do turno. Plantas que tratam o sistema como um projeto de TI tendem a receber contornos informais; plantas que o tratam como uma mudança no trabalho conseguem adoção.

**O que os operadores ganham:** instruções atualizadas na estação em vez de um fichário, menos formulários, ajuda mais rápida quando algo dá errado (chamadas andon a partir do terminal; veja o aprofundamento sobre [andon](https://www.m365.fm/en/learn/shop-floor-management/andon/)) e menos culpa quando o sistema mostra que uma parada foi causada por uma etapa anterior.

**O que os operadores temem, muitas vezes com razão:** ser monitorados minuto a minuto, ser bloqueados por um sistema que está errado e perder o julgamento para uma tela. Trate cada um desses pontos diretamente:

- **Monitoramento:** Decida e publique quais dados de mão de obra o MES registra, quem os vê e para que são usados. Use os dados de desempenho para melhorar o processo, não para classificar indivíduos. Em fábricas sindicalizadas, a introdução de monitoramento eletrônico e mudanças nas regras de trabalho podem ser um tema obrigatório de negociação coletiva; envolva o sindicato cedo e obtenha a opinião do assessor jurídico trabalhista [unverified: a avaliação jurídica depende do contrato e da doutrina atual do NLRB].
- **Ser bloqueado por um sistema errado:** Ofereça aos operadores uma forma rápida e visível de relatar uma instrução incorreta ou um bloqueio indevido, e corrija esses relatos em poucos dias. Cada relato não resolvido ensina o chão de fábrica a encontrar um contorno.
- **Julgamento:** Use paradas obrigatórias apenas para etapas críticas de segurança e qualidade. Para as demais, avise e registre.

**Envolva os operadores no projeto.** Dois ou três operadores por área nas oficinas de projeto, operadores testando as telas antes do go-live e operadores como instrutores de seus pares são baratos e eficazes. O respeito pelas pessoas é um insumo de projeto, não um slide de gestão de mudança; veja [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) para o princípio.

**Ergonomia e segurança nos terminais:** posicione os terminais onde o trabalho acontece, em altura de pé, legíveis com a iluminação da fábrica e utilizáveis com luvas. Os scanners não devem acrescentar deslocamentos. Um MES que acrescenta 30 segundos por operação em um takt de 60 segundos já fracassou antes do go-live.

## Erros comuns na implantação de MES

| # | Erro | O que acontece | Melhor prática |
|---|---|---|---|
| 1 | Comprar funcionalidades antes de definir o modelo de dados | Interfaces quebram por IDs incompatíveis; KPIs diferem entre sistemas | Primeiro a hierarquia de equipamentos, os responsáveis pelos dados mestres e o modelo de tempo |
| 2 | Digitalizar o processo atual em papel, um a um | O mesmo desperdício, agora em uma tela | Simplificar o processo na caminhada de fluxo de valor primeiro |
| 3 | Escopo "tudo da lista MESA-11" | Projeto de vários anos, nada em produção | Um fluxo de valor, de três a cinco casos de uso, em produção em meses |
| 4 | Customizar em vez de configurar | Atualizações viram projetos; o fornecedor recusa suporte | Aceitar processos padrão onde não são diferencial |
| 5 | Nenhum envolvimento dos operadores | Contornos informais, sistemas paralelos em papel | Operadores no projeto, nos testes e no treinamento |
| 6 | ERP e MES mestrando os mesmos dados | Quantidades e tempos conflitantes | Um mestre por atributo, documentado |
| 7 | Paradas obrigatórias em todo lugar | Linhas param por motivos triviais; a confiança desaba | Paradas obrigatórias apenas onde segurança ou qualidade exigem |
| 8 | Ignorar a rede e os terminais | Telas lentas, leituras de scanner perdidas | Levantamento do local e atualização da rede na fase 2 |
| 9 | Nenhum plano de contingência para falhas | A produção para quando o MES ou a WAN falham | Procedimento de contingência em papel testado e capacidade offline na borda |
| 10 | Projeto de segurança fraco | Rede plana entre escritório e máquinas | Zonas e condutos conforme ISA/IEC 62443; privilégio mínimo [23][24] |
| 11 | Nenhum responsável após o go-live | O MES se deteriora; a qualidade dos dados cai | Equipe de MES da própria planta e um KPI de adoção |
| 12 | Benefícios nunca medidos | O business case do próximo site não tem evidências | Linha de base congelada; a área financeira acompanha os benefícios por dois anos |
| 13 | Validação subestimada (setores regulados) | Atrasos de meses | Validação baseada em risco planejada desde a fase 1 |
| 14 | Tratar o UNS ou a plataforma de dados como se fosse o MES | Dados em todo lugar, sem imposição de regras, sem registros | MES para execução e registros; UNS para distribuição |

## Limites do MES e da ISA-95

Ser honesto sobre os limites ajuda a decidir o que não comprar.

### Limites do MES

1. **Um MES não corrige um processo quebrado.** Se os roteiros estiverem errados, os materiais faltarem ou a fábrica operar sem trabalho padronizado, o MES torna esses problemas visíveis, só que mais rápido. Isso é útil, mas não é a solução. Primeiro os fundamentos do Lean; veja [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) e [5S and visual management](https://www.m365.fm/en/learn/5s-visual-management/).
2. **A qualidade dos dados depende das pessoas.** Lançamentos manuais, leituras de código de barras e códigos de motivo só são tão bons quanto a disciplina das pessoas e o design das telas.
3. **Sistemas rígidos resistem à mudança.** Um MES muito personalizado pode tornar lentos o lançamento de produtos e as mudanças de processo, o oposto do que plantas de alto mix precisam.
4. **Custo e esforço são altos para plantas pequenas.** Para uma oficina de 30 pessoas, o controle de chão de fábrica pelo ERP, uma ferramenta simples de coleta de dados e uma boa gestão visual podem entregar a maior parte do valor.
5. **Planejamento não é execução.** Um MES com módulo de programação não substitui o planejamento de vendas e operações nem o MRP; veja [S&OP, MRP and production planning](https://www.m365.fm/en/learn/sop-mrp-production-planning/).
6. **Análises em escala pertencem a outro lugar.** Análises entre plantas, IA e histórico de longo prazo normalmente pertencem a uma plataforma de dados alimentada pelo MES, e não dentro dele. O guia sobre [digital twin](https://www.m365.fm/en/learn/digital-twin-manufacturing/) e o aprofundamento em [process mining](https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/) mostram o que os dados do MES podem alimentar.

### Limites da ISA-95

1. **Ela é abstrata.** A ISA-95 é agnóstica em relação a tecnologia por design [1]. Ela diz o que nomear e trocar, não como construir, então dois produtos "compatíveis com a ISA-95" ainda podem ser difíceis de integrar.
2. **O modelo de níveis não é um caminho de dados.** Lido literalmente, a hierarquia sugere que os dados se movem nível a nível por interfaces ponto a ponto. Arquiteturas modernas (UNS, event streaming, nuvem) não funcionam assim; a própria ISA agora enfatiza os níveis como fronteiras, não como tubulações [1][2].
3. **Os textos da norma são pagos e longos.** Muitas equipes trabalham com resumos secundários, o que leva a interpretações inconsistentes. Adquira pelo menos as Partes 1 e 3 para a biblioteca do projeto.
4. **Conformidade não é certificada.** Não existe certificação formal da ISA-95 para produtos, da forma como a ISA/IEC 62443 possui esquemas de certificação de segurança de produtos [unverified: no ISA-95 product certification program found]. "Compatível com a ISA-95" em um folheto é uma alegação do fornecedor.
5. **Na prática, as fronteiras são traçadas de forma diferente.** Atividades de programação, qualidade e manutenção ficam em sistemas diferentes em cada planta; o modelo de atividades acomoda essa diversidade, mas não decide isso por você.

## Glossário

| Termo | Significado |
|---|---|
| Modelo de atividades | Modelo da Parte 3 da ISA-95 para atividades de Nível 3: quatro categorias de operações, oito atividades genéricas cada [3] |
| APS | Planejamento e programação avançados (Advanced Planning and Scheduling); software de programação de capacidade finita |
| Registro as-built | Registro de como uma unidade ou lote específico foi realmente fabricado |
| B2MML | Business To Manufacturing Markup Language; implementação em XML dos objetos da ISA-95, criada pela MESA [5] |
| Registro de lote (eBR) | Registro de produção e controle de um lote; registro eletrônico de lote quando mantido em um MES |
| CMMS / EAM | Sistema computadorizado de gestão de manutenção / gestão de ativos empresariais |
| MES componível | Termo de fornecedor para um MES construído a partir de aplicativos menores em uma plataforma comum |
| Programação detalhada | Atividade da ISA-95 que sequencia o trabalho nos recursos dentro do Nível 3 [3] |
| Histórico do dispositivo (DHR) | Termo de dispositivos médicos para o registro de produção de um dispositivo ou lote; ver QMSR [20] |
| Despacho | Liberação da próxima ordem para um recurso [3] |
| Hierarquia de equipamentos | Estrutura da ISA-95 baseada em papéis: empresa, site, área, centro de trabalho, unidade de trabalho |
| ERP | Planejamento de recursos empresariais (Enterprise Resource Planning); sistema empresarial de Nível 4 da ISA-95 |
| Genealogia | Vínculos entre materiais de entrada e unidades de saída (rastreabilidade direta e reversa) |
| Historiador | Banco de dados de séries temporais para valores de processo |
| IEC 62264 | Publicação internacional da ISA-95 [1][7] |
| ISA-88 | Norma para controle de bateladas, usada para estruturas de receitas |
| ISA-95 | ANSI/ISA-95, Integração entre Sistemas Empresariais e de Controle, oito partes [1] |
| ISA/IEC 62443 | Série de normas para segurança de sistemas de automação e controle industrial [23] |
| ISO 22400 | Norma para KPIs na gestão de operações de manufatura [16] |
| LIMS | Sistema de gestão de informações laboratoriais |
| MES | Sistema de execução da manufatura (Manufacturing Execution System); software de Nível 3 orientado à produção, para executar e registrar a produção [8] |
| MESA-11 | Modelo de 1997 da MESA International com 11 funções de MES [9][12] |
| MOM | Gestão de operações de manufatura; o Nível 3 da ISA-95 como um todo |
| MQTT | Protocolo leve de mensagens publish/subscribe, comum em IIoT |
| MTConnect | Padrão aberto para dados de equipamentos de manufatura (ANSI/MTC1.4-2018) [22] |
| OEE | Eficiência global do equipamento = disponibilidade × desempenho × qualidade |
| OPC UA | Padrão de comunicação industrial e modelagem de informações independente de fornecedor, da OPC Foundation |
| Parte 11 | 21 CFR Parte 11, regras da FDA para registros e assinaturas eletrônicas [19] |
| Modelo de Purdue | Modelo de referência de Purdue para manufatura integrada por computador, base dos níveis da ISA-95 [1] |
| QMS | Sistema de gestão da qualidade (software para não conformidades, CAPA, documentos, auditorias) |
| Revisão por exceção | Revisão de registro de lote que se concentra nos desvios sinalizados pelo sistema |
| SCADA | Supervisão e aquisição de dados (Supervisory Control and Data Acquisition); software de supervisão de Nível 2 |
| Sparkplug | Especificação da Eclipse sobre MQTT para cargas úteis e estado (certificados de nascimento e morte) [28] |
| Namespace unificado (UNS) | Padrão de arquitetura: broker central com uma árvore hierárquica de tópicos contendo o estado atual do negócio |
| WMS | Sistema de gestão de armazéns |
| Centro de trabalho / unidade de trabalho | Níveis da hierarquia de equipamentos da ISA-95 abaixo da área |

## FAQ

### O que é um sistema de execução de manufatura, em termos simples?

É o software que informa o chão de fábrica o que fazer em seguida e registra o que de fato aconteceu, ordem por ordem e etapa por etapa. A Gartner o define como um software orientado à produção que gerencia, monitora e sincroniza a execução, em tempo real, dos processos físicos que transformam matérias-primas em produtos [8].

### Quais são as principais funções de um MES?

O modelo de atividades da ISA-95 lista oito atividades genéricas para as operações de produção: gerenciamento da definição de produtos, gerenciamento de recursos, programação detalhada, despacho, gerenciamento da execução, coleta de dados, rastreamento e análise de desempenho [3]. O modelo da MESA de 1997 listava 11 funções, acrescentando controle de documentos, gestão de mão de obra, gestão da qualidade, gestão de processos e gestão da manutenção [9].

### Quais são os benefícios de um MES?

Dados de produção capturados na origem, em vez de redigitados; prazos de entrega das ordens menores, graças a liberação e despacho mais rápidos; menos escapes de qualidade, graças a verificações impostas pelo sistema; recalls mais rápidos e mais restritos, graças à genealogia por lote e número de série; paradas mais visíveis no gargalo; e registros eletrônicos prontos para auditoria. Cada benefício depende de uma condição: dados mestres corretos, verificações configuradas como bloqueios obrigatórios, leitura disciplinada dos materiais e uma produção que possa de fato ser vendida. A seção 1 lista o que medir para cada um deles.

### O que é a ISA-95, em termos simples?

A ISA-95 (IEC 62264) é a norma internacional para a integração de sistemas empresariais, como o ERP, com os sistemas de controle da manufatura. Ela define níveis, uma hierarquia de equipamentos, modelos de objetos e modelos de atividades para que TI, TO e negócio usem o mesmo vocabulário [1].

### Quais são os cinco níveis da ISA-95?

O Nível 0 é o processo físico; o Nível 1, a detecção e a manipulação; o Nível 2, o monitoramento e o controle supervisório; o Nível 3, o gerenciamento das operações de manufatura (MES e sistemas correlatos); e o Nível 4, o planejamento de negócios e a logística (ERP) [1].

### A ISA-95 é a mesma coisa que a IEC 62264?

O conteúdo está alinhado: a ISA publica a ANSI/ISA-95, e a IEC publica a IEC 62264. Edições e numeração diferem; a ANSI/ISA-95 Parte 1 de 2025 é uma adoção modificada da IEC 62264-1 [1][2], e a IEC 62264-6 surgiu em 2020 [6]. Sempre cite a parte e a edição.

### Quantas partes tem a ISA-95?

Oito: modelos e terminologia; objetos e atributos para a integração empresa-controle; modelos de atividades do MOM; objetos e atributos para a integração do MOM; transações de negócio para manufatura; modelo de serviço de mensagens; modelo de serviço de alias; e perfis de troca de informações [1].

### O que é o Nível 3 da ISA-95?

O Nível 3 é o gerenciamento das operações de manufatura: as atividades que transformam planos em produtos, em horizontes de dias, turnos, horas, minutos e segundos [4]. Ele abrange as operações de produção, manutenção, testes de qualidade e estoque [3]. O MES é o sistema mais comum do Nível 3.

### Qual é a diferença entre MES e ERP?

O ERP (Nível 4) planeja o que produzir e o contabiliza em um horizonte de meses a dias. O MES (Nível 3) executa e registra como cada ordem é de fato fabricada, em turnos até segundos [4]. O ERP mantém o registro financeiro; o MES mantém o registro do que foi realmente produzido (as-built). Ambos trocam ordens, confirmações e movimentações de materiais.

### Preciso de um MES se já tenho um ERP?

Não necessariamente. Faça quatro perguntas: você precisa registrar por etapa, número de série e parâmetro, e não apenas por operação? As decisões dependem de minutos, e não de confirmações ao final do turno? O sistema deve impedir uma etapa errada, e não apenas registrá-la? Você precisa de registros eletrônicos de histórico de lote e de equipamento? Se as quatro respostas forem não, o controle de chão de fábrica do ERP pode bastar. Se duas ou mais forem sim, você precisa de funções de MES, seja do fornecedor do ERP, de um fornecedor de MES ou de uma plataforma (seção 5).

### Qual é a diferença entre MES e SCADA?

O SCADA supervisiona e controla máquinas e processos em tempo real (tags, alarmes, setpoints). O MES gerencia ordens, materiais, pessoas, qualidade e registros. O SCADA sabe que uma máquina está em operação; o MES sabe para qual ordem, qual lote de material e qual operador ela está trabalhando.

### Qual é a diferença entre MES e MOM?

MOM (manufacturing operations management, gerenciamento das operações de manufatura) é o termo da ISA-95 para todo o Nível 3, incluindo operações de produção, qualidade, manutenção e estoque. MES geralmente se refere ao núcleo de produção; muitas "suítes MOM" são produtos MES com módulos adicionais [10].

### O que é B2MML?

B2MML é uma implementação em XML dos modelos de objetos ISA-95, criada pela MESA International e usada em muitas interfaces ERP-MES; o mapeamento de OPC UA para ISA-95 segue o B2MML sempre que possível [5]. Após a dissolução da MESA, em 30 de junho de 2026, a ISA assumiu o conteúdo da MESA [11].

### Como o ISA-95 se integra aos sistemas ERP?

O ISA-95 define a interface entre o Nível 4 (ERP) e o Nível 3 (MES e outros sistemas de operações). As Partes 2 e 4 definem os objetos trocados, e a Parte 5, as transações. Na prática, o ERP envia para baixo as definições de produtos, as ordens de produção e os dados de materiais; o MES envia para cima as confirmações de operação, as movimentações de mercadorias, as notificações de qualidade e as informações de status. O B2MML implementa os modelos de objetos do ISA-95 em XML [5]. Um modelo compartilhado reduz o trabalho de especificação, mas cada projeto ainda precisa decidir qual sistema é o mestre de cada campo e qual evento dispara um lançamento (seção 7).

### Uma namespace unificada substitui o ISA-95 ou o MES?

Não. Uma UNS é uma forma de movimentar e compartilhar dados do estado atual por meio de um broker. Ela precisa do ISA-95 (ou de um modelo semelhante) para a nomenclatura e a semântica, e precisa de um MES e de um ERP para a lógica de negócio e os registros auditáveis.

### Quanto custa um MES?

Depende do escopo, do número de linhas, do modelo de implantação, da integração e da regulamentação, e os fornecedores raramente publicam preços. Elabore seu próprio custo total de propriedade em cinco anos com os blocos de custo da seção 13; em nossa fábrica ilustrativa de 220 funcionários, os custos únicos foram de US$ 970.000 e os custos recorrentes, de US$ 300.000 por ano.

### Quanto tempo leva a implementação de um MES?

Para uma fábrica com um produto configurado, planeje cerca de seis a doze meses até um piloto estável e ondas adicionais de três a seis meses [unverified: premissa de planejamento de profissionais da área]. Fábricas reguladas e projetos sob medida levam mais tempo.

### O SAP é um MES?

O ERP principal da SAP tem funções de controle do chão de fábrica; a SAP também vende produtos de execução de manufatura separados. Saber se as funções do ERP são suficientes depende da granularidade, da latência, da aplicação e das necessidades regulatórias descritas na seção 5.

### Pequenos fabricantes precisam de um MES?

Nem sempre. Uma pequena oficina por encomenda muitas vezes consegue a maior parte do valor com as confirmações do chão de fábrica feitas no ERP, um monitoramento simples de máquinas e uma boa gestão visual. Um MES torna-se necessário quando você precisa de imposição de etapas, genealogia de números de série, registros eletrônicos de lote ou decisões quase em tempo real. O Manufacturing Extension Partnership (MEP) do NIST, que se concentra em pequenos e médios fabricantes, é um lugar neutro em relação a fornecedores para solicitar uma avaliação [31].

### O que é um MES em nuvem ou MES composável?

Um MES em nuvem roda como um serviço na nuvem do fornecedor; um MES composável é construído a partir de aplicações menores sobre uma plataforma comum. Ambos podem funcionar; verifique o comportamento offline na borda, o modelo de dados compartilhado e, se for regulado, como a cadência de lançamentos do fornecedor se encaixa na sua validação.

### O ISA-95 ainda é relevante com IIoT e plataformas em nuvem?

Sim. A ISA afirma que os níveis ainda ajudam a descrever os limites dos sistemas para a Indústria 4.0 [1], e a edição de 2025 da Parte 1 foi escrita para arquiteturas modulares e orientadas a dados [2]. O que ficou defasado é a ideia de que os dados devem subir os níveis um a um.

### Quais são as desvantagens do ISA-95?

Ele é abstrato e diz o que nomear e trocar, não como construir. Lido literalmente, seu modelo de níveis sugere que os dados devem subir nível por nível, o que as arquiteturas modernas orientadas a eventos não fazem. Os textos da norma são pagos e longos, por isso as equipes costumam trabalhar com resumos inconsistentes. "Compatível com ISA-95" é uma alegação do fornecedor, não uma certificação. E ele não decide onde sua fábrica traça a fronteira entre os sistemas de MES, qualidade e manutenção (seção 17).

### Quais KPIs um MES deve acompanhar?

OEE e seus componentes, rendimento de primeira passagem, taxa de refugo, aderência ao cronograma, produtividade, WIP, lead time e MTBF/MTTR, definidos conforme ISO 22400-2 [16][17]. Acompanhe também o próprio MES: latência dos dados, taxa de captura automática, adoção e tempo de rastreabilidade.

### O que a 21 CFR Part 11 exige de um MES?

Para sistemas fechados: validação, cópias precisas dos registros, proteção dos registros, acesso restrito a pessoas autorizadas e trilhas de auditoria seguras, geradas por computador e com carimbo de data e hora, que não obscureçam entradas anteriores, entre outros controles [19]. As assinaturas eletrônicas devem estar vinculadas aos seus registros.

## Conclusão e primeiros passos

Um sistema de execução de manufatura vale o seu custo quando fecha o ciclo entre planejamento e realidade mais rápido e com mais confiabilidade do que pessoas com papel e planilhas conseguem. A ISA-95 oferece o mapa para isso: os níveis mostram onde o MES se situa, a hierarquia de equipamentos dá a todos os sistemas os mesmos nomes, os modelos de objetos definem o que ERP e MES trocam, e a matriz 4 × 8 do modelo de atividades mostra qual sistema deve ser responsável por cada tarefa. Um namespace unificado e as plataformas em nuvem mudam a infraestrutura de conectividade, não essas responsabilidades.

Os projetos bem-sucedidos seguem um padrão: começam com um fluxo de valor e um modelo de dados, fazem um piloto em uma linha com linha de base congelada, envolvem os operadores desde a primeira oficina, mantêm bloqueios rígidos apenas para o que realmente importa e medem os benefícios junto com a área financeira por anos. O exemplo trabalhado mostra por quê: o mesmo MES é um bom ou um mau investimento dependendo de o ganho no gargalo poder ser vendido e de quão rápido o piloto se estabiliza.

**Seus primeiros 30 dias:**

- [ ] Percorra uma cadeia de valor e marque cada ponto em que a informação é redigitada, atrasada ou está ausente
- [ ] Preencha a matriz de atividades ISA-95 (4 × 8) para essa cadeia de valor: quem executa cada atividade hoje?
- [ ] Esboce a hierarquia de equipamentos para a área-piloto e acorde os nomes com manutenção e TI
- [ ] Congele uma linha de base: OEE no gargalo, custo de sucata, lead time de pedidos, tempo de rastreabilidade
- [ ] Pergunte às áreas comercial e financeira se a produção extra no gargalo pode ser vendida, e com qual margem de contribuição
- [ ] Liste seus requisitos regulatórios de registros (Part 11, QMSR, FSMA 204, exigências de clientes)
- [ ] Converse com duas fábricas pares que operam um MES, sem a presença de fornecedores
- [ ] Adquira as Partes 1 e 3 da ISA-95 para a biblioteca do projeto

---

## Leitura complementar no m365.fm

**Guias relacionados**
- [Manufacturing IT com Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/): arquitetura em nuvem, namespace unificado no Azure IoT Operations, plataforma de dados
- [Gêmeo Digital na Manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Programação da Produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [KPIs da Manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Gestão no Chão de Fábrica e Gemba Walks](https://www.m365.fm/en/learn/shop-floor-management/)
- [Manufatura Enxuta (Lean)](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Mapeamento do Fluxo de Valor](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Planejamento da Produção Aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [Cibersegurança de OT e ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/)
- [Manutenção Preditiva e IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/)
- [TPM e OEE](https://www.m365.fm/en/learn/tpm-oee/)
- [S&OP, MRP e Planejamento da Produção](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [Teoria das Restrições](https://www.m365.fm/en/learn/theory-of-constraints/)
- [Six Sigma e Análise de Causa Raiz](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/)
- [Kanban e Sistemas Pull](https://www.m365.fm/en/learn/kanban-pull-system/)
- [5S e Gestão Visual](https://www.m365.fm/en/learn/5s-visual-management/)

**Aprofundamentos**
- [Manufatura Sem Papel e Instruções de Trabalho Digitais](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/)
- [Trabalho Padronizado](https://www.m365.fm/en/learn/shop-floor-management/standard-work/)
- [Sistema Andon](https://www.m365.fm/en/learn/shop-floor-management/andon/)
- [Intralogística e Fluxo de Materiais Interno](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Process Mining na Manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/)
- [Competências da Força de Trabalho na Manufatura](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/)

**Termos do glossário (entidades)**
[Enterprise resource planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Total productive maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Poka-yoke](https://www.m365.fm/entity/poka-yoke/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** é o apresentador do m365.fm e trabalha na iFAKT GmbH. No m365.fm, ele escreve sobre manufatura enxuta, excelência operacional e a transformação digital da produção, incluindo os sistemas e modelos de dados que conectam o chão de fábrica ao planejamento.

**Nota: O autor trabalha na iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Status: **(F)** = opened and checked for this article; **(S)** = opened and checked on November 20, 2026 by the fact check of a related guide on m365.fm (file named), cited here with the same wording, not re-fetched for this article because the shared web-fetch budget was exhausted.

1. ISA-95 Standard: Enterprise-Control System Integration (parts list with editions, Levels 0–4, Purdue basis, scope of each part). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard (F)
2. Update to ISA-95 Standard Addresses Integration of Enterprise and Manufacturing Control Systems. ISA press release, Durham, N.C., April 10, 2025 (ANSI/ISA-95.00.01-2025, IEC 62264-1 Mod; quotes by Christian Monchinski). https://www.isa.org/news-press-releases/2025/april/update-to-isa-95-standard-addresses-integration-of (F)
3. ANSI/ISA-95.00.03-2013, Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management, preview incl. table of contents (clauses 6–9). ANSI Webstore. https://webstore.ansi.org/preview-pages/ISA/preview_ANSI+ISA+95.00.03-2013.pdf ; ISA preview with scope: https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf (F)
4. OPC 10030: ISA-95 Common Object Model, section 4.2.3 ISA-95 (levels, time frames, information types). OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3 (F)
5. OPC 10030: ISA-95 Common Object Model, section 4.2 ISA-95 Summary (object models, nesting, B2MML by MESA, OPC UA mapping follows B2MML). OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2 (F)
6. IEC 62264-6:2020, Enterprise-control system integration – Part 6: Messaging service model, edition 1.0, 2020-06-26. IEC Webstore. https://webstore.iec.ch/publication/59706 (F)
7. IEC 62264 (list of parts and IEC editions). Wikipedia (secondary source). https://en.wikipedia.org/wiki/IEC_62264 (F)
8. Manufacturing Execution Systems, market definition. Gartner Peer Insights. https://www.gartner.com/reviews/market/manufacturing-execution-systems (F)
9. What Isn't an MES? (MESA International MES functional model with 11 functions, one of eight MESA models; 45 percent cycle-time claim attributed to MESA). Control Engineering. https://www.controleng.com/what-isnt-an-mes (F)
10. MES Definition Work Continues (AMR Research 1992; MESA 1997 definition; ISA-95 MOM categories; 40+ manufacturers, requirements time reduced to four to six weeks). Automation World, March 1, 2006. https://automationworld.com/products/control/news/13302768/mes-definition-work-continues (F)
11. ISA Receives MESA International Content (MESA to cease operations effective June 30, 2026; content and educational programs assumed by ISA). International Society of Automation. https://programs.isa.org/isa-receives-mesa-international-content (F)
12. Manufacturing execution system (MES), definition (MESA-11 in 1997; ISA-95 merged MESA-11 with the Purdue Reference Model). TechTarget. https://www.techtarget.com/searcherp/definition/manufacturing-execution-system-MES (F)
13. The Five Parts of ISA-95. Automation World, May 6, 2013. https://automationworld.com/products/software/article/13309288/the-five-parts-of-isa-95 (F)
14. Manufacturing execution system. Wikipedia (secondary source; ISA-95 Part 1 2000, Part 3 2005; Level 3 systems as MOMS; B2MML). https://en.wikipedia.org/wiki/Manufacturing_execution_system (F)
15. HPImpact: Report "clarifies" MES for management (MESA white paper "MES: A High Level Vision"). Hydrocarbon Processing, December 1997 issue. https://www.hydrocarbonprocessing.com/magazine/1997/december-1997/misc/hpimpact-report-clarifies-mes-for-management (F; page metadata shows a 2016 upload date)
16. ISO 22400-2:2014 Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions. Edition 1, 2014-01; status "to be revised"; Amendment 1:2017 "Key performance indicators for energy management". https://www.iso.org/standard/54497.html (F, re-fetched November 20, 2026)
17. Kang, N.; Zhao, C.; Li, J.; Horst, J. A. (2016): A hierarchical structure of key performance indicators for operation management and continuous improvement in production systems. International Journal of Production Research 54(21), pp. 6333–6350. NIST version: https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=919754 (F, re-fetched November 20, 2026)
18. ISO 22400 KPI Selection Guide (secondary source for the count of 34 KPIs). Fabrico. https://www.fabrico.io/blog/iso-22400-kpi-selection-guide/ (F, re-fetched November 20, 2026)
19. 21 CFR 11.10, Controls for closed systems. Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11/subpart-B/section-11.10 (F, re-fetched November 20, 2026)
20. Quality Management System Regulation (QMSR): effective February 2, 2026; incorporates ISO 13485:2016 and clause 3 of ISO 9000:2015 by reference. U.S. Food and Drug Administration. https://www.fda.gov/quality-systems-regulation (F)
21. VDI 5600 Part 1: Manufacturing Execution Systems (MES). Edition October 2016. https://www.din.de/en/wdc-beuth:din21:251310997 (F, re-fetched November 20, 2026)
22. MTConnect Standard, ANSI/MTC1.4-2018, Part 1.0 Overview and Fundamentals. MTConnect Institute. https://docs.mtconnect.org/ANSI_MTC1_4-2018.pdf (F, re-fetched November 20, 2026)
23. ISA/IEC 62443 Series of Standards. International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards (F, re-fetched November 20, 2026)
24. Stouffer, K. et al. (2023): Guide to Operational Technology (OT) Security. NIST SP 800-82 Rev. 3, September 28, 2023. DOI: [10.6028/NIST.SP.800-82r3](https://doi.org/10.6028/NIST.SP.800-82r3) (S: digital-twin-manufacturing.md)
25. Publish and subscribe MQTT messages using MQTT broker (Azure IoT Operations; MQTT 3.1.1 and MQTT 5). Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/manage-mqtt-broker/overview-broker (F, re-fetched November 20, 2026)
26. What is the connector for OPC UA? Azure IoT Operations, Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector (F, re-fetched November 20, 2026)
27. What is ISA-95? The Five Levels, IEC 62264 and the Automation Pyramid (secondary source for the equipment hierarchy names enterprise, site, area, work center, work unit; vendor page). OPC Router. https://www.opc-router.com/what-is-isa-95/ (F)
28. Eclipse Sparkplug (Sparkplug Specification Version 3.0; birth and death certificates; TLS). Eclipse Foundation, Sparkplug Working Group. https://sparkplug.eclipse.org/ (F)
29. FSMA Final Rule on Requirements for Additional Traceability Records for Certain Foods. U.S. Food and Drug Administration. https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods (F, re-fetched November 20, 2026)
30. Muchiri, P.; Pintelon, L. (2008): Performance measurement using overall equipment effectiveness (OEE): literature review and practical application discussion. International Journal of Production Research 46(13), pp. 3517–3535. DOI: 10.1080/00207540601142645 (S: manufacturing-kpis.md)
31. Manufacturing Extension Partnership (MEP). National Institute of Standards and Technology (NIST). https://www.nist.gov/mep (F, re-fetched November 20, 2026)
32. 7.4.1 ISA95EquipmentElementLevelEnum, OPC 10030: ISA-95 Common Object Model. OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/7.4.1 (F, accessed November 20, 2026)
33. Enterprise-Control System Integration, Part 1: Models and Terminology, ISA-dS95.01-1999, Draft 14, November 1999 (historical public draft, section 5.2 equipment hierarchy, section 7.1 information categories; not the current edition). https://xml.coverpages.org/ISA95Part1-Draft14-NIST.pdf (F, accessed November 20, 2026)
34. ISA-88. Wikipedia (secondary source; procedural control model; adopted by the IEC in 1997 as IEC 61512-1). https://en.wikipedia.org/wiki/ISA-88 (F, accessed November 20, 2026)
35. SAP Digital Manufacturing (product page, vendor description; MOM platform on SAP Business Technology Platform; SAP Manufacturing Execution customers advised to transition). SAP. https://www.sap.com/products/scm/digital-manufacturing.html (F, accessed November 20, 2026)
36. B2MML-BatchML (README: B2MML implements ANSI/ISA-95, BatchML implements ANSI/ISA-88). MESA International, GitHub. https://github.com/MESAInternational/B2MML-BatchML (F, accessed November 20, 2026)
37. ISA-TR88.00.02-2022, Machine and Unit States: An Implementation Example of ISA-88 (PackML), preview (sections 4 to 6: state model, modes). International Society of Automation. https://www.isa.org/getmedia/300dbd50-d549-41ac-b372-a5e52f32fc97/tr_880002_preview.pdf (F, accessed November 20, 2026; full title per ISA catalog not shown in the preview)
38. 21 CFR 211.188, Batch production and control records. Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-J/section-211.188 (F, accessed November 20, 2026)
39. IATF 16949:2016 vs. ISO/TS 16949:2009 comparison matrix (section 8.5.2.1). DNV (secondary source). https://www.dnv.com/siteassets/images/pdf-documents/iatf-2009-to-2016-comparison-matrix.pdf (F, accessed November 20, 2026)
40. Computer Software Assurance for Production and Quality Management System Software, final guidance, February 2026 (CDRH, CBER). U.S. Food and Drug Administration. https://fda.gov/regulatory-information/search-fda-guidance-documents/computer-software-assurance-production-and-quality-management-system-software (F, accessed November 20, 2026)
41. FASB Amends Guidance on Cloud Computing Arrangements (ASU 2018-15, issued August 29, 2018). Deloitte DART, Heads Up. https://dart.deloitte.com/USDART/home/publications/archive/deloitte-publications/heads-up/2018/fasb-amends-guidance-cloud-computing-arrangements (F, accessed November 20, 2026)
42. FASB Amends Guidance on the Accounting for and Disclosure of Software Costs (ASU 2025-06, September 18, 2025). Deloitte DART. https://dart.deloitte.com/USDART/home/news/all-news/2025/sep/fasb-amends-guidance-on-software-costs (F, accessed November 20, 2026)
43. New MESA Model: A Framework for Smarter Manufacturing. Automation.com, April 22, 2022. https://www.automation.com/article/mesa-model-a-framework-smarter-manufacturing (F, accessed November 20, 2026)
44. Manditereza, K.: Implementing Unified Namespace (UNS) With MQTT Sparkplug. HiveMQ blog (vendor source), first published December 20, 2022, updated February 22, 2026. https://hivemq.com/blog/implementing-unified-namespace-uns-mqtt-sparkplug (F, accessed November 20, 2026)
