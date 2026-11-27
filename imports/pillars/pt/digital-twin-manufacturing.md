# SEO metadata

| Field | Value |
|---|---|
| Meta title | Gêmeo Digital na Manufatura: Guia Completo |
| Meta description | Gêmeo digital na manufatura explicado: gêmeo vs. sombra vs. simulação, simulação de fábrica, comissionamento virtual, AGVs, ISO 23247 e um roteiro. |
| Slug | `digital-twin-manufacturing` |

# Gêmeo Digital na Manufatura: O Guia Completo sobre Simulação de Fábrica, Fluxo de Materiais e Comissionamento Virtual

*Última atualização: 20 de novembro de 2026 · Revisão técnica feita com base nas normas, fontes primárias e publicações listadas em Fontes*

> **Resposta curta:** Um gêmeo digital na manufatura é uma representação digital executável dos produtos, processos e recursos de uma fábrica, atualizada com dados das operações reais, idealmente de forma automática. Você o utiliza para simular operações, avaliar gargalos e cenários com antecedência, comissionar softwares de controle de forma virtual e tomar decisões antes de alterar qualquer coisa no chão de fábrica real.

O termo "gêmeo digital" é usado de forma tão livre que quase deixou de significar algo. Um modelo 3D de um prédio é chamado de gêmeo digital. Assim como um painel de dados de máquinas e, às vezes, uma planilha de capacidade com células vermelhas, amarelas e verdes. Para gestores de fábrica e de operações, isso é um problema real: se você não sabe exatamente o que quer construir, compra a coisa errada, coleta dados sem uma pergunta a responder e, um ano depois, tem um projeto de visualização caro que não melhora nenhuma decisão.

Este guia esclarece a terminologia e percorre cada camada: desde a origem do conceito com Michael Grieves e a NASA, passando pelas normas (ISO 23247, ISA-95, a Asset Administration Shell e as diretrizes alemãs VDI sobre simulação e comissionamento virtual, pelas quais grande parte da indústria ainda se orienta), até a questão prática de como derivar um gêmeo de produção útil a partir dos dados que já estão no seu sistema ERP. O foco está no que as equipes de manufatura efetivamente decidem: planejamento de fábrica e de layout, capacidade e gargalos, mix de produtos, qualidade do cronograma, comissionamento virtual e dimensionamento de frotas de veículos guiados automaticamente (AGV). Para uma definição resumida, veja a página de entidade [Digital Twin](https://www.m365.fm/entity/digital-twin/).

### Principais conclusões

- Um **gêmeo digital** se diferencia de um modelo digital e de uma sombra digital pelo **fluxo automático de dados nos dois sentidos** [5]. No planejamento fabril, muitas soluções produtivas funcionam deliberadamente como modelo ou sombra, e isso não é uma falha.
- O núcleo de um gêmeo de produção é um **modelo produto-processo-recurso (PPR)**: o que é fabricado (lista de materiais), como (roteiro, tempos, sequências) e com quê (máquinas, pessoas, área física, movimentação de materiais). Grande parte desses dados já está no seu **sistema ERP**.
- A **simulação** transforma o modelo em uma ferramenta de decisão. Na manufatura e na logística, predomina a **simulação de eventos discretos**; a referência metodológica clássica é a diretriz alemã VDI 3633 [13], e o livro-texto norte-americano padrão é *Simulation Modeling and Analysis*, de Law [41].
- As normas centrais são a **ISO 23247** (arcabouço de gêmeo digital para manufatura, Partes 1 a 4 de 2021, Partes 5 e 6 de 2026) [6][7][8], a **IEC 63278-1** (Asset Administration Shell) [10] e a **ISA-95 / IEC 62264** (integração entre empresa e controle) [58]. O NIST apoia a ISO 23247 com orientações de casos de uso e implementações de referência para fabricantes dos EUA [47][48].
- Comece com **uma decisão concreta**, não com uma plataforma. Um gêmeo sem uma pergunta vira um cemitério de dados.
- A **qualidade dos dados** decide o sucesso ou o fracasso: tempos padrão, tempos de setup, calendários de turnos e registros de paradas costumam ser menos precisos do que sugerem os dados mestres.
- Na Microsoft, o **Azure Digital Twins** é um serviço PaaS com disponibilidade geral que oferece suporte a DTDL v2 e v3 [21][22]; o **digital twin builder no Microsoft Fabric** ainda está identificado como **prévia** até a data desta redação [23].

### Caminhos de leitura para leitores com pouco tempo

| Você é um(a) ... | Leia primeiro |
|---|---|
| Engenheiro(a) de manufatura ou planejador(a) fabril | Seções 2, 6, 7 e 10 (definições, simulação, casos de uso, roteiro) |
| Gestor(a) de fábrica, vice-presidente de operações, executivo(a) | Resposta curta, seções 4, 12 e 13 (maturidade, custo e benefício, erros comuns) |
| Engenheiro(a) de controle ou automação | Seção 7.5 (comissionamento virtual) e 14 (normas) |
| Líder de projeto de intralogística, AGV/AMR | Seção 7.6 (planejamento de frotas de AGV e AMR) |
| Administrador(a) de M365/Azure, arquiteto(a) de TI/OT | Seções 5, 8 e 16 (arquitetura, serviços Microsoft, segurança) |

## Índice

1. [O que é um gêmeo digital na manufatura?](#1-o-que-é-um-gêmeo-digital-na-manufatura)
2. [Modelo digital vs. sombra digital vs. gêmeo digital](#2-modelo-digital-vs-sombra-digital-vs-gêmeo-digital)
3. [Tipos de gêmeos digitais na manufatura](#3-tipos-de-gêmeos-digitais-na-manufatura)
4. [Níveis de maturidade: da representação ao sistema autootimizável](#4-níveis-de-maturidade-da-representação-ao-sistema-autootimizador)
5. [Arquitetura e base de dados: ERP, MES, PLM, IoT](#5-arquitetura-e-base-de-dados-erp-mes-plm-iot)
6. [Simulação no centro: simulação de fábrica, de fluxo de materiais e de fluxo de valor](#6-simulação-como-base-simulação-de-fábrica-do-fluxo-de-materiais-e-do-fluxo-de-valor)
7. [Casos de uso e os dados que cada um exige](#7-casos-de-uso-e-os-dados-que-cada-um-exige)
8. [Gêmeos digitais com Microsoft Azure e Fabric](#8-gêmeos-digitais-com-microsoft-azure-e-fabric)
9. [Inteligência artificial e o gêmeo digital](#9-inteligência-artificial-e-o-gêmeo-digital)
10. [Roteiro: implementação em seis fases](#10-roteiro-implementação-em-seis-fases)
11. [Qualidade dos dados: o pré-requisito subestimado](#11-qualidade-de-dados-o-pré-requisito-subestimado)
12. [Custo e benefício, avaliados com honestidade](#12-custo-e-benefício-avaliados-com-honestidade)
13. [Erros comuns e como evitá-los](#13-erros-comuns-e-como-evitá-los)
14. [Normas e diretrizes em resumo](#14-normas-e-diretrizes-em-resumo)
15. [Categorias de software: uma comparação neutra](#15-categorias-de-software-uma-comparação-neutra)
16. [Segurança, propriedade dos dados e regulamentação](#16-segurança-propriedade-dos-dados-e-regulamentação)
17. [Construindo um gêmeo a partir de dados de ERP e de fluxo de valor com o iFAKT Polaris](#17-construindo-um-gêmeo-a-partir-de-dados-de-erp-e-de-fluxo-de-valor-com-o-ifakt-polaris)
18. [Glossário](#18-glossário)
19. [FAQ: gêmeos digitais na manufatura](#19-faq-gêmeos-digitais-na-manufatura)
20. [Conclusão](#20-conclusão)

## 1. O que é um gêmeo digital na manufatura?

### Uma definição de trabalho

Na prática da manufatura, mostrou-se útil uma definição de trabalho com três condições:

1. **Ele representa um equivalente real.** O gêmeo representa um objeto específico (uma máquina, uma linha, uma fábrica) ou um processo específico, e não uma classe genérica.
2. **Ele é executável.** Contém não apenas estrutura e geometria, mas também comportamento. Pode avançar estados, percorrer operações e responder a perguntas do tipo "o que acontece se ...?".
3. **Ele está conectado à realidade por dados.** É atualizado a partir de dados operacionais, idealmente de forma automática, e seus resultados retornam às decisões ou aos controles.

Sem o ponto 2, você tem um banco de dados ou um modelo 3D. Sem o ponto 3, você tem um modelo de simulação. Ambos são úteis, mas nenhum deles é um gêmeo no sentido estrito.

As instituições dos EUA definem o termo na mesma linha. A definição do Digital Twin Consortium, de 3 de dezembro de 2020, descreve um gêmeo digital como "uma representação virtual de entidades e processos do mundo real, sincronizada em uma frequência e fidelidade especificadas" [51]. O relatório de consenso de 2024 da National Academies of Sciences, Engineering, and Medicine, patrocinado pelo Departamento de Defesa, pelo Departamento de Energia, pelos Institutos Nacionais de Saúde e pela National Science Foundation dos EUA, descreve um gêmeo digital como um conjunto de construções virtuais de informação que imita a estrutura, o contexto e o comportamento de um sistema, "é atualizado dinamicamente com dados de seu gêmeo físico, tem capacidade preditiva e informa decisões que geram valor", e acrescenta: "A interação bidirecional entre o virtual e o físico é central para o gêmeo digital" [50]. O NIST descreve os gêmeos digitais como representações eletrônicas de entidades do mundo real que permitem observar essas entidades e suas mudanças de estado, e examina as questões de segurança e confiança que levantam [49]. As três definições contêm os mesmos elementos da definição de trabalho acima: um equivalente real, comportamento e uma conexão de dados.

### Gêmeo digital, fábrica inteligente, fábrica digital: os termos esclarecidos

Em inglês, você verá "digital twin in manufacturing", "manufacturing digital twin", "factory digital twin" e "production digital twin" usados para o mesmo conceito. A **smart factory** (ou smart manufacturing) é outra coisa: uma fábrica conectada e em grande parte auto-organizada, como imagem-alvo da Indústria 4.0. O digital twin é uma de suas ferramentas, não um sinônimo. A **digital factory** é um termo guarda-chuva mais antigo, voltado ao planejamento, da diretriz alemã VDI 4499 para modelos, métodos e ferramentas digitais (veja abaixo); na América do Norte, os termos mais próximos do uso cotidiano são "digital manufacturing" e "virtual manufacturing". Termos como production simulation, factory simulation e material flow simulation descrevem métodos que um digital twin pode utilizar. **Digital thread** descreve o fluxo conectado de informações ao longo do ciclo de vida; a ISO 23247-5 agora trata disso explicitamente [7].

### Origens: de Grieves e da NASA à Indústria 4.0

O conceito vem do gerenciamento do ciclo de vida de produtos (PLM). Michael Grieves apresentou, em 2002, um modelo que vinculava um espaço real, um espaço virtual e o fluxo de dados e informações entre eles. Ele data a primeira apresentação de um fórum de gestão da Society of Manufacturing Engineers (SME), em outubro de 2002, e uma apresentação na University of Michigan, em dezembro de 2002 [2]. O modelo foi inicialmente chamado de "Mirrored Spaces Model" (2005), depois de "Information Mirroring Model" (2006) e, por fim, de "Digital Twin"; segundo Grieves, o conceito em si permaneceu o mesmo [2]. Grieves atribui o nome "digital twin" a John Vickers, da NASA [1][2]. Outros autores apontam que a história da origem não pode ser documentada sem lacunas e que houve precursores anteriores, como as pesquisas sobre manufatura virtual na década de 1990 [4].

O termo ganhou ampla atenção por meio da indústria aeroespacial. A NASA descreveu o digital twin em seu roteiro tecnológico "Modeling, Simulation, Information Technology & Processing" (Shafto et al., rascunho de 2010) [4]. Em 2012, Glaessgen e Stargel formularam a definição muito citada, para a NASA e a Força Aérea dos EUA, de um digital twin como uma "integrated multiphysics, multiscale, probabilistic simulation of an as-built vehicle or system" (uma simulação probabilística, multifísica e multiescala integrada de um veículo ou sistema como construído), que combina simulação de altíssima fidelidade com monitoramento de saúde, histórico de manutenção e dados da frota para espelhar a vida de seu gêmeo em voo [3].

Na manufatura alemã, o termo passou a ser associado à Industrie 4.0 a partir de meados da década de 2010. Ali ele encontrou uma tradição mais antiga e independente: a **Digital Factory** (VDI 4499) e a **simulação de eventos discretos do fluxo de materiais** (VDI 3633). Nos EUA, a simulação de fábricas cresceu a partir da pesquisa operacional e da engenharia industrial, com livros-texto como o de Law [41] e ferramentas comerciais de eventos discretos. De ambos os lados do Atlântico, muitas ferramentas hoje comercializadas como digital twins são, metodologicamente, descendentes dessa simulação fabril. Para mais contexto, veja a página de entidade [Industry 4.0](https://www.m365.fm/entity/industry-4-0/).

### Definições formais em normas

Normas formais existem desde 2021. A **ISO 23247** ("Automation systems and integration: Digital twin framework for manufacturing", ou seja, Sistemas de automação e integração: estrutura de digital twin para manufatura) define uma estrutura para digital twins na manufatura. As partes 1 a 4 (visão geral, arquitetura de referência, representação digital dos elementos de manufatura e troca de informações) foram publicadas em outubro de 2021 (a Parte 1 em 21 de outubro de 2021) [6]. A Parte 5 ("Digital thread for digital twin") e a Parte 6 ("Digital twin composition", publicada em 14 de julho de 2026) seguiram em 2026 [7][8]. A **ISO/IEC 30173:2023** estabelece termos e conceitos válidos para todos os setores, incluindo processos do ciclo de vida, tipos de digital twins, uma visão funcional e as partes interessadas [9].

Para fabricantes dos EUA, o NIST oferece um ponto de entrada prático na ISO 23247. Seu relatório *Use Case Scenarios for Digital Twin Implementation Based on ISO 23247* (NIST AMS 400-2, Guodong Shao, maio de 2021) foi escrito explicitamente para reduzir a confusão sobre digital twins entre fabricantes de pequeno e médio porte, e percorre três casos de uso construídos sobre a estrutura [47]. O projeto em andamento do NIST, "Digital Twins for Advanced Manufacturing", contribui para a ISO 23247, trabalha em uma implementação de referência da Parte 5 (digital thread) e propõe um framework de verificação, validação e quantificação de incerteza (VVUQ) como uma futura Parte 7; ele aponta a "falta de normas" como uma das principais barreiras à adoção [48].

Para o planejamento de fábricas, a definição alemã de Fábrica Digital da VDI 4499 Parte 1 continua influente. A edição de 2008 diz (nossa tradução): "A Fábrica Digital é o termo genérico para uma rede abrangente de modelos, métodos e ferramentas digitais, incluindo simulação e visualização tridimensional, integrados por meio de gestão contínua de dados. Seu objetivo é o planejamento holístico, a avaliação e a melhoria contínua de todas as estruturas, processos e recursos essenciais da fábrica real em conjunto com o produto." [17] Uma nova edição da VDI 4499 Parte 1 foi publicada em abril de 2026, abrangendo o termo, os objetivos, os processos, a gestão de dados e a arquitetura de sistemas da Fábrica Digital [16]. Se você citar essa norma, verifique se a redação da nova edição difere.

Observe a expressão "estruturas, processos e recursos ... em conjunto com o produto". Ela já contém a lógica produto-processo-recurso sobre a qual um gêmeo de produção é construído (veja a seção 5, "O modelo produto-processo-recurso como núcleo").

## 2. Modelo digital vs. sombra digital vs. gêmeo digital

A distinção mais citada para a manufatura vem de Kritzinger, Karner, Traar, Henjes e Sihn (Fraunhofer Áustria) em 2018 [5]. Eles diferenciam três níveis de integração com base em como os dados fluem entre o objeto físico e o objeto digital.

| Atributo | Modelo digital | Sombra digital | Gêmeo digital |
|---|---|---|---|
| Fluxo de dados físico → digital | manual | automático | automático |
| Fluxo de dados digital → físico | manual | manual | automático |
| Exemplo típico | modelo de simulação de uma linha planejada, layout CAD | modelo de simulação atualizado diariamente com pedidos e confirmações do ERP/MES | modelo que envia automaticamente sequências ou parâmetros de produção de volta ao sistema de controle |
| Estado do objeto físico | não precisa existir | existe, é observado | existe, é observado e influenciado |
| Uso típico | planejamento de fábrica, greenfield, decisão de investimento de capital | monitoramento, análise do estado atual, previsão, validação de cronograma | controle em malha fechada, programação detalhada, otimização autônoma |
| Exigências de TI e governança | baixas | médias (interfaces, qualidade dos dados) | altas (tempo real, segurança, processos de aprovação) |

Em sua revisão da literatura, Kritzinger et al. constataram que as publicações sobre o nível mais alto, o gêmeo verdadeiro, eram raras, enquanto modelos e sombras eram descritos com muito mais frequência [5]. Isso corresponde à prática: no planejamento de fábricas e da produção, uma realimentação automática para os controles muitas vezes nem é desejada. Um planejador quer comparar cenários e então decidir deliberadamente. Um modelo que altera sua sequência de produção sem aprovação seria inaceitável em muitas plantas, tanto do ponto de vista organizacional quanto de responsabilidade.

A consequência para o seu projeto: não pergunte "Temos um gêmeo real?" Pergunte "Qual nível de integração a decisão que queremos melhorar exige?" Para uma decisão de capital sobre um novo prédio de montagem, um modelo bem validado é suficiente. Para a verificação diária de que o cronograma desta semana é realista, você precisa de uma sombra com alimentação automática de dados. Somente para controle em malha fechada, como o sequenciamento automático em uma estação gargalo, o esforço de um gêmeo completo se justifica.

**Um segundo olhar sobre a "sombra":** Na engenharia de produção alemã, "sombra digital" às vezes é usada de forma mais restrita, como uma imagem suficientemente precisa e específica para a tarefa dos dados de produção, sem capacidade de simulação. Alguns fornecedores também descrevem a sombra como uma "cópia estática de dados históricos". Essas leituras diferem de Kritzinger et al. Fontes dos EUA raramente usam o termo "sombra digital" e frequentemente chamam todos os níveis de gêmeo. Se você usar qualquer um desses termos em uma solicitação de proposta (RFP) ou em um documento de requisitos, defina-os explicitamente.

## 3. Tipos de gêmeos digitais na manufatura

Os gêmeos digitais podem ser classificados pelo objeto que representam e pela fase do ciclo de vida. A classificação abaixo é comum na literatura e na prática, mas não é padronizada; a ISO/IEC 30173 descreve os tipos de gêmeos digitais em um nível mais geral [9]. Materiais explicativos dos EUA costumam usar um esquema de quatro níveis: gêmeos de componente (ou peça), gêmeos de ativo, gêmeos de sistema (ou unidade) e gêmeos de processo, popularizado pela IBM [52]. A tabela abaixo é mais específica para a manufatura.

| Tipo | Representa | Perguntas típicas | Principais fontes de dados |
|---|---|---|---|
| Gêmeo de produto | um produto ao longo do seu ciclo de vida (geometria, variantes, propriedades, condição em campo) | O projeto atende aos requisitos? Como o produto se comporta em uso? | CAD, PLM, análises (FEA, CFD), dados de campo |
| Gêmeo de processo | um processo de fabricação (fresamento, soldagem, moldagem por injeção, montagem) | Quais parâmetros entregam qualidade estável? Onde surgem sucata e retrabalho? | controles de máquina, sensores, dados de qualidade, modelos de processo |
| Gêmeo de máquina ou ativo | uma máquina ou equipamento com cinemática, lógica de controle e condição | A lógica do CLP funciona? Quando a manutenção está prevista? | CAD mecânico, CAD elétrico, programa do CLP, dados de condição |
| Gêmeo de produção ou de fábrica | a interação entre pedidos, processos, recursos, fluxo de material e logística | Há capacidade suficiente? Onde está o gargalo? Qual layout, qual buffer, quantos AGVs? | ERP, MES, dados de fluxo de valor, layout, padrões de turno |
| Gêmeo de desempenho ou de operações | métricas contínuas de desempenho de um sistema | Como estão evoluindo OEE, lead time, entrega no prazo e consumo de energia? | MES, coleta de dados de produção, medidores de energia, IoT |
| Gêmeo da cadeia de suprimentos | fornecedores, unidades, transporte, estoques | O que acontece se um fornecedor falhar? Onde devemos manter estoque de segurança? | ERP, SCM, dados logísticos |

Os tipos não são nitidamente separados; eles se aninham. Um gêmeo de fábrica pode incorporar um gêmeo de ativo mais detalhado para uma única máquina gargalo. A composição de vários gêmeos é exatamente o que a nova Parte 6 da ISO 23247 abrange [8].

**Fases do ciclo de vida:** Muitos autores também distinguem o gêmeo "como projetado" (estado de planejamento), "como construído" (efetivamente construído) e "como operado" ou "como mantido" (em operação). Isso importa para o planejamento de fábrica: um modelo de planejamento descreve uma planta que ainda não existe, portanto não deve ser confundido com dados operacionais que ainda não podem existir.

**Níveis de detalhe:** Na simulação de eventos discretos, distinguem-se também os níveis de agregação, desde o nível de rede e planta, passando por área, linha e célula, até a máquina individual. A VDI 3633 trata da simulação em nível de máquina com movimento 3D e da simulação de processo em uma parte separada [13]. A habilidade está em escolher o nível o mais grosseiro possível e o mais fino necessário.

## 4. Níveis de maturidade: da representação ao sistema autootimizador

Modelos de maturidade ajudam a avaliar o ponto de partida e a definir metas realistas. Nos países de língua alemã, o **acatech Industrie 4.0 Maturity Index** é amplamente utilizado (a acatech é a Academia Nacional Alemã de Ciência e Engenharia). Ele descreve seis estágios de desenvolvimento e avalia recursos, sistemas de informação, cultura e estrutura organizacional; a edição atualizada foi publicada em 2020 [20]. Os estágios são computadorização, conectividade, visibilidade, transparência, capacidade preditiva e adaptabilidade.

Para o gêmeo digital, isso se traduz em uma escala prática:

| Nível | Pergunta orientadora | O que o gêmeo entrega | Pré-requisito |
|---|---|---|---|
| 1 Representar | O que temos? | modelo estruturado de produtos, processos, recursos (dados mestres, layout) | dados mestres mantidos, nomenclatura consistente |
| 2 Observar | O que está acontecendo? | estado atual a partir de apontamentos, dados de máquinas, estoque (visibilidade) | interfaces com ERP/MES, carimbos de tempo |
| 3 Entender | Por que está acontecendo? | análise de causa raiz, identificação de gargalos, análise de variações (transparência) | dados historizados, definições de métricas |
| 4 Prever | O que vai acontecer? | simulação e previsão de lead time, utilização, datas de entrega | modelo de simulação validado, dados de planejamento |
| 5 Recomendar | O que devemos fazer? | comparação de cenários, otimização, ações recomendadas | função objetivo, métodos de otimização |
| 6 Agir | O que acontece automaticamente? | malha fechada até o controle (adaptabilidade) | conceito de aprovação, segurança de TI, responsabilidade clara |

Em materiais de consultoria e de fornecedores, é comum encontrar uma divisão mais curta em três tipos: gêmeos descritivos, preditivos e prescritivos. Ela corresponde, de forma aproximada, aos níveis 2 a 3, 4 e 5 a 6 da tabela.

**Importante:** os níveis não são uma sequência obrigatória. Um gêmeo de planejamento fabril pode ser muito valioso já no nível 4, sem nunca passar pelo nível 2, porque a fábrica planejada ainda não existe. Por outro lado, um painel de monitoramento no nível 2 não é um degrau para a simulação se o seu modelo de dados não contém lógica de processo. Planeje os níveis de acordo com a sua pergunta, e não de acordo com um modelo.

## 5. Arquitetura e base de dados: ERP, MES, PLM, IoT

### O modelo de referência da ISO 23247

A ISO 23247-2 organiza um gêmeo digital de manufatura em domínios [6][43]:

- **Elementos observáveis da manufatura:** pessoal, equipamentos, material, processos de manufatura, instalações, ambiente, produtos e documentos de apoio [6]. Eles ficam fora do gêmeo, mas são por ele representados.
- **Comunicação com dispositivos:** coleta de dados e controle de dispositivos, como conectividade de controladores, sensores e gateways.
- **Gêmeo digital (núcleo):** representação, sincronização, aplicações e serviços, como simulação, análise de dados e validação de programação.
- **Usuário:** pessoas e aplicações que utilizam o gêmeo, como estações de trabalho de planejadores ou sistemas corporativos como ERP e MES.
- **Funções transversais:** tradução de dados, garantia de dados e segurança.

Esse modelo é independente de fornecedor e funciona bem como esqueleto de um documento de requisitos ou de uma RFP. O NIST utilizou exatamente essa estrutura para seus três cenários de caso de uso da ISO 23247 [47]. Acima de tudo, ele deixa claro um ponto: o gêmeo não é a visualização. É a camada intermediária que representa, sincroniza e calcula.

### Sistemas por nível da ISA-95: quem fornece quais dados?

A norma ISA-95 (ANSI/ISA-95, internacionalmente IEC 62264) organiza os sistemas de uma planta em níveis com base no modelo de Purdue [58][19][42]: nível 0 é o processo físico, nível 1 é a detecção e atuação, nível 2 é o controle de processo (CLP, SCADA, IHM), nível 3 é a gestão de operações de manufatura (MES) e nível 4 é o planejamento empresarial e a logística (ERP). A ISA observa que a norma trata principalmente da interface entre os níveis 3 e 4 [58]. Para o gêmeo digital, isso oferece um mapa de dados claro:

| Sistema (nível) | Fornece ao gêmeo | Granularidade típica | Fragilidades típicas |
|---|---|---|---|
| ERP (4) | cadastro de materiais, listas de materiais, roteiros, centros de trabalho, capacidades, calendários de turnos, ordens de vendas e de produção, apontamentos | ordem, operação, dia/turno | tempos-padrão desatualizados, tempos de setup fixos, grupos de centros de trabalho grosseiros demais |
| MES (3) | tempos reais, motivos de parada, quantidades, refugo, alocação de mão de obra, sequências | operação, minuto | códigos de motivo de parada inconsistentes, lacunas nos registros manuais |
| PLM/CAD | estrutura do produto (EBOM), geometria, variantes, níveis de revisão | peça, versão | EBOM e lista de materiais de fabricação (MBOM) fora de sincronia |
| Layout/CAD de fábrica | área do chão de fábrica, corredores, posições, transportadores | pé/metro | layouts desatualizados; fábricas antigas (brownfield) frequentemente sem documentação |
| CLP/SCADA (2) | estados, tempos de ciclo, sinais | milissegundo a segundo | pouco significado sem contexto (qual ordem?) |
| IoT/sensores (1) | energia, temperatura, vibração, posição (ex.: AGVs) | segundo | grande volume de dados, mapeamento de ativos ausente |
| Armazém/logística interna (WMS, gerenciador de frota de AGVs) | estoque, ordens de transporte, tempos de deslocamento | ordem, segundo | tempos de deslocamento frequentemente não historizados |

Para um gêmeo digital de produção e de fábrica, a maior parte da estrutura necessária está nos níveis 3 e 4. Os dados das máquinas dos níveis 1 e 2 melhoram as distribuições e os modelos de paradas, mas raramente são o ponto de partida. Se você conectar máquinas, dois padrões abertos são os mais importantes: OPC UA (IEC 62541) e, comum em oficinas de usinagem nos EUA, o **MTConnect**, um padrão aberto para interoperabilidade de dados de manufatura, também publicado como padrão ANSI (ANSI/MTC1.4-2018) [57]. O NIST inclui uma interface MTConnect para gêmeos digitais entre seus trabalhos de projeto [48]. O post [From ERP to the shop floor: the digital twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/) mostra, na prática, como é essa ponte do ERP até o chão de fábrica. Para noções básicas de ERP, veja a página de entidade [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/).

### O modelo produto-processo-recurso no centro

Na prática da fábrica digital, o **modelo produto-processo-recurso (PPR)** tornou-se o princípio estruturador. Ele relaciona três visões:

- **Produto:** O que é fabricado? Itens finais, conjuntos, peças e suas relações (lista de materiais, variantes).
- **Processo:** Como é fabricado? Operações, sequências, relações de predecessor e sucessor, tempos (setup, execução, movimentação), tamanhos de lote.
- **Recurso:** Com o que é fabricado? Máquinas, centros de trabalho, pessoas com habilidades, ferramentais, área no chão de fábrica, equipamentos de movimentação de materiais, padrões de turno.

O valor está nas **arestas** entre os nós: qual operação consome qual conjunto, em qual recurso, com qual tempo, sob qual restrição? Modele essa rede como um grafo e você poderá derivar automaticamente diagramas de rede, caminhos críticos, recursos gargalo e modelos de simulação. Esse grafo é também a base semântica sobre a qual algoritmos de planejamento e serviços de IA podem trabalhar.

A vantagem sobre um gêmeo puramente 3D ou de IoT é prática: o modelo PPR responde às perguntas que os planejadores de produção e de fábrica fazem todos os dias (capacidade, lead time, gargalo, necessidade de mão de obra), e grande parte dele pode ser construída a partir de dados que já existem.

### Construindo o gêmeo a partir de dados de ERP e de fluxo de valor

A história usual do gêmeo digital começa com sensores. Para questões de produção, muitas vezes esse é o lugar errado para começar. Seu sistema ERP já contém a planta da sua fábrica em forma estruturada:

| Objeto do ERP | Papel no gêmeo |
|---|---|
| Cadastro de materiais e lista de materiais (lista de materiais de fabricação, MBOM) | estrutura do produto, explosão de necessidades, sequência de montagem |
| Roteiro com operações | lógica de processo, sequência, tempos-padrão de setup e execução |
| Centro de trabalho ou grupo de centros de trabalho | recursos, capacidade disponível, centro de custo |
| Calendário da fábrica e padrões de turno | tempo disponível, pausas, turnos extras |
| Pedidos de venda e previsões | carga, mix de produtos, datas de entrega |
| Ordens de produção e apontamentos | tempos reais, quantidades reais, refugo, andamento |
| Parâmetros de estoque e MRP | estoques de segurança, buffers, regras de dimensionamento de lote |

**Value stream mapping** oferece a segunda visão, complementar: torna visíveis os fluxos de materiais e de informações, os estoques entre processos e a lógica de controle (puxada, empurrada, supermercado, FIFO), que as tabelas do ERP contêm apenas de forma indireta. Mike Rother e John Shook popularizaram o método em 1998 com *Learning to See*, publicado pelo Lean Enterprise Institute [40]. Combine a lógica do value stream com dados mestres e apontamentos do ERP e você obtém um modelo que captura tanto a estrutura quanto a dinâmica de um sistema de produção. O episódio [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) mostra como um mapa de value stream se torna um modelo de dados vivo; o método em si é explicado na página de entidade [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/), e em profundidade no nosso guia sobre [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

Essa discussão não é nova na literatura. Já em 2014, Türck, Weimer, Schubert e Drees descreveram na revista alemã *Zeitschrift für wirtschaftlichen Fabrikbetrieb* (ZWF) a passagem do value stream mapping estático e de suas métricas para a simulação dinâmica de value streams, e perguntaram quais opções de otimização se abrem quando o tempo é acrescentado como dimensão [31]. Em 2023, Böhm, Drees, Sai, Erlach, Stambera e Teriete apresentaram na ZWF uma interface de dados universal para serviços digitais de value stream, que usa dados de produção baseados em eventos como base comum para o cálculo e a visualização de métricas; ela foi testada no projeto de pesquisa alemão ECOWERT [32].

### Semântica e interoperabilidade: Asset Administration Shell, OPC UA, DTDL

Um gêmeo que vive apenas em um banco de dados proprietário é difícil de expandir. Três padrões moldam a interoperabilidade:

- **Asset Administration Shell (AAS):** O conceito da Plattform Industrie 4.0, da Alemanha, para uma representação digital padronizada de um ativo. A IEC 63278-1:2023 (publicada em 14 de dezembro de 2023) define sua estrutura e visa permitir que aplicações de software troquem informações de forma uniforme e segura; ela se aplica a ativos físicos, digitais e intangíveis ao longo de todo o ciclo de vida [10]. O conteúdo é organizado em submodelos, por exemplo para dados técnicos ou dados de operação. O Modelo de Arquitetura de Referência Alemão Industrie 4.0 (RAMI 4.0, DIN SPEC 91345:2016) descreve a estrutura e o comportamento do componente Industrie 4.0 que representa virtualmente um ativo [12]; no conceito da Plattform Industrie 4.0, a AAS é a parte digital desse componente. Seu desenvolvimento é conduzido pela **Industrial Digital Twin Association (IDTA)**, fundada em 24 de setembro de 2020 pelas associações alemãs de engenharia e de indústria elétrica VDMA e ZVEI, em conjunto com a Bitkom e 20 empresas [11]. Uma implementação de código aberto é o Eclipse BaSyx, desenvolvido, entre outros, pelo Fraunhofer IESE [29].
- **OPC UA (IEC 62541):** O padrão amplamente usado para comunicação de máquinas independente de fabricante, com modelos de informação. Para o gêmeo, o OPC UA importa sobretudo nos níveis 1 a 3.
- **DTDL (Digital Twins Definition Language):** A linguagem de modelagem baseada em JSON da Microsoft para o Azure Digital Twins. O Azure Digital Twins oferece suporte ao DTDL v2 e v3; a Microsoft recomenda a v3 [22].

Nenhum desses padrões, isoladamente, é suficiente para gêmeos de planejamento de produção, pois eles descrevem sobretudo ativos, e não a lógica de processo e a dinâmica das ordens. Na prática, portanto, combina-se um modelo de planejamento (PPR, simulação) com descrições padronizadas de ativos para a conectividade.

## 6. Simulação como base: simulação de fábrica, do fluxo de materiais e do fluxo de valor

### O que a simulação faz e por que os cálculos estáticos não bastam

A VDI 3633 Parte 1 (edição de dezembro de 2014), a diretriz de referência alemã, descreve os fundamentos da simulação de sistemas logísticos, de fluxo de materiais e de produção, e se dirige a planejadores, fornecedores e operadores [13]. Ela define simulação como a reprodução de um sistema com seus processos dinâmicos em um modelo com o qual se pode experimentar, a fim de obter conhecimentos transferíveis para a realidade [13][30]. O livro de Law, amplamente usado em programas de engenharia industrial dos EUA, aborda o mesmo tema pelo lado estatístico [41].

O ponto decisivo é a **dinâmica**. Um cálculo de capacidade em planilha trabalha com médias: demanda vezes tempo de processamento, dividido pelo tempo disponível, resulta na utilização. Se todos os valores estiverem abaixo de 100 por cento, o plano parece funcionar. Na realidade, chegadas, tempos de processamento, tempos de preparação e paradas variam. A teoria das filas mostra que, com tempos variáveis, os tempos de espera crescem desproporcionalmente à medida que a utilização aumenta, e formam-se filas grandes à frente de uma estação que opera perto do limite de sua capacidade. As interações entre estações (bloqueio, falta de material, recursos compartilhados como operadores ou pontes rolantes) não podem ser capturadas por um cálculo estático.

**Exemplo prático:** Para uma única estação, a aproximação de Kingman dá uma noção de ordem de grandeza [46]. O tempo médio de espera à frente da estação é aproximadamente W ≈ (cₐ² + cₛ²) / 2 · u / (1 − u) · t, em que u é a utilização, t é o tempo médio de processamento e cₐ e cₛ são os coeficientes de variação dos tempos entre chegadas e de processamento. Suponha um tempo de processamento de 10 minutos e variabilidade moderada (ambos os coeficientes de variação iguais a 1):

| Utilização u | Fator u / (1 − u) | Espera média à frente da estação |
|---|---|---|
| 70% | 2,3 | aprox. 23 minutos |
| 80% | 4 | aprox. 40 minutos |
| 90% | 9 | aprox. 90 minutos |
| 95% | 19 | aprox. 190 minutos |

A planilha de capacidade indica "cabe" em todos os quatro casos. Na prática, o tempo de espera quase quintuplica entre 80 e 95 por cento de utilização. Em uma linha com várias estações, preparações e paradas, o efeito se torna ainda mais forte e difícil de tratar analiticamente. É aqui que entra a simulação.

A **Lei de Little** continua sendo uma verificação útil de consistência: em regime permanente, o estoque médio em um sistema é igual à taxa média de throughput multiplicada pelo lead time médio (L = λ · W) [37]. A Lei de Little indica qual lead time corresponde a um determinado estoque, mas não qual estoque resultará de um dado nível de variabilidade. Para isso é necessária a simulação.

### Comparação dos tipos de simulação

| Atributo | Simulação de eventos discretos (DES) | Simulação contínua / dinâmica de sistemas | Simulação baseada em agentes (ABS) | Simulação física e de movimento 3D |
|---|---|---|---|---|
| Avanço do tempo | salta de evento em evento (chegada, fim de processamento, parada) | contínuo, em pequenos passos de tempo, equações diferenciais | orientado a eventos ou a passos de tempo, conforme a ferramenta | passos de tempo finos, cinemática e dinâmica |
| Elementos do modelo | fontes, sumidouros, estações, buffers, transportadores, recursos, pedidos | estoques, fluxos, laços de realimentação | agentes autônomos com regras e estados (veículos, pessoas, pedidos) | corpos rígidos, juntas, sensores, sinais de controle |
| Perguntas típicas | throughput, lead time, utilização, gargalo, tamanhos de buffer, necessidade de mão de obra | capacidade estratégica e desenvolvimento de mercado, efeito chicote | tráfego de AGVs, fluxos de pedestres, controle descentralizado, lógica de negociação | alcance, colisão, tempo de ciclo de uma célula robotizada, teste de controle |
| Nível de detalhe | da linha à fábrica | da fábrica à rede, altamente agregado | do local à rede | célula, máquina |
| Pontos fortes | consolidada, fácil de validar, aleatoriedade incorporada | rápida, boa para realimentação e horizontes longos | comportamento emergente, regras individuais | geometria e física realistas |
| Limitações | geometria geralmente simplificada | sem pedidos individuais | parametrização e validação exigentes | intensiva em computação, pequena fatia do sistema |
| Referência | VDI 3633 [13], Law [41] | Forrester, *Industrial Dynamics* (MIT) [38] | nenhuma diretriz VDI específica conhecida [unverified: não há diretriz VDI dedicada identificada até o momento] | VDI 3633 Parte 8 (simulação em nível de máquina) [13], VDI/VDE 3693 [14] |

Na simulação de produção e de fábrica, a **simulação de eventos discretos** predomina. Muitas ferramentas modernas combinam paradigmas, como produção por eventos discretos com veículos baseados em agentes ou um modelo contínuo de energia. O livro de Law descreve em detalhe os fundamentos metodológicos da simulação de eventos discretos, desde números aleatórios e distribuições de entrada até a análise estatística [41].

### Simulação de fluxo de materiais e simulação de fábrica

Os termos são frequentemente usados como sinônimos, mas têm ênfases diferentes:

- **Simulação de fluxo de materiais** acompanha o caminho do material e dos pedidos pela produção e pela logística: transportadores, buffers, armazenagem, movimentação de materiais, separação de itens. Perguntas orientadoras: o sistema de transportadores é suficiente? De que tamanho os buffers precisam ser? Onde o material se acumula?
- **Simulação de fábrica** analisa a planta como um todo: mix de produtos, capacidades, padrões de turnos, mão de obra, layout, logística e regras de controle. Perguntas orientadoras: a planta consegue absorver o volume? Qual layout é robusto? Quanto custa um terceiro turno em comparação com uma máquina adicional?
- **Simulação de produção** é frequentemente usada como termo guarda-chuva para ambos.

Para mais informações sobre simulação de fábrica, consulte a página de entidade [Factory Simulation](https://www.m365.fm/entity/factory-simulation/).

### Simulação de cadeia de valor: mapeamento dinâmico do fluxo de valor

O mapeamento clássico do fluxo de valor é um retrato baseado em médias. Ele mostra estoques, lead times e fluxo em um determinado dia, mas não como a cadeia de valor se comporta quando o mix de produtos muda, ocorrem paradas ou os tamanhos de lote são alterados. A simulação da cadeia de valor fecha essa lacuna ao tratar o mapa do fluxo de valor como um modelo executável. A publicação da ZWF de 2014 mencionada acima descreve exatamente essa etapa, da métrica estática para uma visão dinâmica ao longo do tempo [31].

A vantagem prática: o mapa do fluxo de valor é familiar e aceito na empresa. Se você derivar um modelo de simulação a partir dele, as equipes de operações não precisam aprender um novo mundo de modelagem. Os limites estão em fluxos de material muito complexos, com transportadores e lógica de armazém, que exigem a simulação clássica de fluxo de materiais.

### Como um estudo de simulação é conduzido

A VDI 3633 descreve a preparação, a execução e a avaliação de estudos de simulação [13]. A sequência a seguir tem se mostrado eficaz:

1. **Objetivo:** Qual decisão você está preparando? Quais métricas a decidem (vazão, lead time, entrega no prazo, custo)?
2. **Fronteira do sistema:** O que pertence ao modelo e o que não pertence? Qual nível de detalhe é necessário?
3. **Coleta e preparação de dados:** dados mestres, tempos, distribuições, paradas, padrões de turnos (ver seção 11).
4. **Construção do modelo:** primeiro o modelo conceitual, depois o modelo executável.
5. **Verificação e validação:** o modelo está construído corretamente (verificação)? Ele representa a realidade com precisão suficiente (validação)? Compare com dados reais e faça uma checagem de sanidade com especialistas no assunto.
6. **Projeto de experimentos:** cenários, período de aquecimento, duração das execuções, número de replicações.
7. **Execução e análise:** métricas com intervalos de confiança em vez de valores únicos, análises de sensibilidade.
8. **Documentação e transferência:** premissas, limites, recomendações.

Dois pontos são especialmente negligenciados na prática: o **período de aquecimento** (um modelo que começa vazio produz métricas distorcidas nos primeiros dias simulados) e as **replicações** (um modelo estocástico gera resultados diferentes a cada execução; somente várias execuções permitem uma afirmação confiável) [41]. A mesma lógica de verificação e validação é o que o NIST pretende formalizar para gêmeos digitais de manufatura com sua proposta de estrutura VVUQ [48].

## 7. Casos de uso e os dados que cada um exige

A tabela abaixo organiza os casos de uso de manufatura mais importantes por nível de integração e requisitos de dados. Use-a como apoio ao planejamento: para o seu caso, verifique primeiro a coluna "Dados mínimos".

| Caso de uso | Decisão típica | Nível de integração | Dados mínimos | Dados adicionais que agregam valor |
|---|---|---|---|---|
| Planejamento de fábrica e layout | estrutura do prédio, arranjo, área útil, corredores | modelo | programa de produtos, roteiros, tempos, requisitos de espaço, variantes de layout | matrizes de transporte, restrições do prédio, escaneamento 3D |
| Planejamento de capacidade e investimentos de capital | máquina adicional, turno adicional ou terceirização | modelo ou sombra | previsões, roteiros, centros de trabalho, padrões de turno, disponibilidade | distribuições de quebras, matrizes de setup |
| Análise de gargalos | Onde investir, onde aliviar? | sombra | apontamentos com carimbo de tempo, tempos reais, estoque | estados das máquinas, motivos de parada |
| Análise de mix de produtos e cenários | novo produto, mix de variantes, tamanhos de lote | modelo ou sombra | listas de materiais, roteiros, cenários de mix | famílias de setup, regras de sequenciamento |
| Validação de programação e APS | A programação desta semana é viável? Qual sequência? | sombra até gêmeo | ordens, datas de entrega, roteiros, capacidades, andamento atual | disponibilidade de materiais, pessoas com habilidades |
| Comissionamento virtual | testar o software de controle antes do comissionamento físico | modelo (modelo do equipamento com controlador real ou emulado) | projeto mecânico e elétrico, programa do CLP, listas de E/S, modelos de comportamento | funções de segurança, conceitos de operação |
| Planejamento de frota de AGV e AMR | número de veículos, rotas, estratégia de recarga | modelo, depois sombra | ordens de transporte (origem, destino, quantidade, hora), layout, dados dos veículos | regras de tráfego, infraestrutura de recarga, tráfego misto |
| Avaliação de energia e CO2 | picos de carga, deslocamentos de turno, estratégias de parada | sombra | consumo de energia por estado, dados de estado, padrões de turno | preços de energia, dados medidos por máquina |
| Manutenção | momento da manutenção, estoque de peças de reposição | sombra até gêmeo | histórico de falhas, horas de operação, dados de condição | sensores, modelos de dano |

### 7.1 Planejamento de fábrica e layout

O planejamento de fábrica é o campo clássico da fábrica digital. Em um projeto greenfield, a planta ainda não existe, portanto não há dados operacionais. O gêmeo digital, nesse caso, é um **modelo de planejamento** construído a partir do programa de produtos, dos roteiros e das variantes de layout. Sua função é comparar variantes sob incerteza: qual layout continua produtivo se o mix mudar ou o volume crescer um terço?

Projetos brownfield são diferentes: há dados, mas muitas vezes não há um layout atual. Escaneamento a laser e nuvens de pontos 3D ajudam a capturar o estado real do prédio. Ainda assim, a lógica de processo é que decide o resultado. Um modelo fotorrealista do prédio sem roteiros não responde a nenhuma pergunta de capacidade. Alguns textos em inglês chamam isso de "armadilha da visualização".

Métricas comprovadas para comparar variantes são produtividade (throughput), lead time, trabalho em processo (WIP), esforço de transporte (tonelada-milha ou viagens por hora), área útil e necessidade de mão de obra.

### 7.2 Análise de capacidade e de gargalos

A **Teoria das Restrições**, de Goldratt, assume que o desempenho de um sistema é limitado por uma única restrição, e que melhorias fora dela não elevam a produtividade [39]. O problema prático: o gargalo nem sempre está onde a planilha mostra a maior utilização. Ele se desloca com o mix de produtos, com os setups e com as quebras. Um modelo de simulação mostra onde as ordens realmente se acumulam e qual estação bloqueia ou deixa outras sem material. Para mais sobre o método, veja a página de entidade [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/).

A McKinsey descreve um exemplo concreto: em uma linha de produção, uma sequência otimizada na estação gargalo reduziu o tempo total de processamento em cerca de quatro por cento [26]. Números assim parecem pequenos, mas, em um gargalo real, traduzem-se diretamente em produtividade.

### 7.3 Análise de mix de produtos e de cenários

Novos produtos, mais variantes e lotes menores: cada uma dessas mudanças desloca a carga entre os recursos. Um gêmeo digital construído sobre um modelo PPR pode ler novas listas de materiais e roteiros e mostrar quais recursos se tornam críticos antes que a primeira peça seja fabricada. A McKinsey descreve uma fábrica de fabricação de metais cujo gêmeo, com um agente de aprendizado por reforço, avaliou milhares de combinações possíveis de produtos em quatro linhas de produção paralelas [26]. Cenários típicos incluem:

- mudanças no mix entre famílias de produtos,
- introdução de um novo produto em recursos existentes,
- redução dos tamanhos de lote e o efeito na parcela de setup,
- mudança do modelo de turnos (dois a três turnos, turnos de fim de semana),
- perda de um recurso-chave ou de um fornecedor.

### 7.4 Programação da produção e planejamento e programação avançados (APS)

Os sistemas APS criam programações e sequências com restrição de capacidade. Um gêmeo de simulação os complementa de duas formas: pode **executar uma programação com antecedência** e mostrar se ela se sustenta sob variabilidade realista, e pode servir como **função de avaliação** para métodos de otimização que geram muitas variantes de programação. A McKinsey relata uma fábrica de montagem em que uma programação de produção redesenhada reduziu horas extras e levou a economias mensais de custo de 5 a 7 por cento [26]. A página de entidade [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) explica os fundamentos do planejamento com restrição de capacidade, e nosso guia sobre [software de programação da produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/) aprofunda o tema.

Mantenha claros os papéis: o planejamento clássico em ERP (MRP II) funciona de forma sequencial (quantidades, depois datas, depois capacidades), frequentemente com capacidade infinita. O gêmeo não substitui o sistema ERP. Ele verifica e melhora os resultados dele.

### 7.5 Comissionamento virtual

O **comissionamento virtual** testa o software de controle de uma máquina ou linha em um modelo de simulação antes que o equipamento físico esteja instalado. A diretriz mais detalhada está em alemão: a VDI/VDE 3693 Parte 1 (agosto de 2016) define o comissionamento virtual para automação de processos e de fábrica, com o objetivo de encontrar e corrigir erros da engenharia dos sistemas de automação, e descreve tipos de modelo e termos [14]. A Parte 2 (dezembro de 2018) trata da introdução do comissionamento virtual nas empresas; a VDI anunciou uma revisão [15]. Não encontramos nenhuma norma ANSI ou ISA dedicada ao comissionamento virtual [unverified: não foi possível confirmar a existência de norma ANSI ou ISA específica]; integradores dos EUA normalmente trabalham com esses conceitos e com os métodos próprios de seus fornecedores de ferramentas.

Três variantes de acoplamento são comuns:

| Variante | Controlador | Equipamento | Uso |
|---|---|---|---|
| Model-in-the-loop (MiL) | como modelo | como modelo | verificação inicial do conceito |
| Software-in-the-loop (SiL) | programa de controle real em um CLP virtual ou emulado | como modelo | teste da lógica do CLP sem hardware |
| Hardware-in-the-loop (HiL) | hardware real do controlador | como modelo em tempo real | teste incluindo comportamento de tempo e sistemas de barramento de campo |

O benefício é deslocar a solução de problemas da fase cara de comissionamento no local para uma fase anterior e mais barata. Percentuais confiáveis e válidos para toda a indústria sobre economia de tempo são escassos; muitos números publicados são afirmações de fornecedores. Um exemplo documentado: em uma linha de pré-montagem em sua fábrica de Saarbrücken, Alemanha, a ZF, trabalhando com o Fraunhofer IESE, esperava comissionar cerca de 30 por cento mais rápido usando um gêmeo digital e o middleware Eclipse BaSyx; em 2021 isso era uma expectativa, não um valor medido em muitos projetos [28]. Um estudo de 2024 do Fraunhofer IWU entre fabricantes de máquinas e equipamentos no estado alemão da Saxônia constatou que mais de 90 por cento das empresas pesquisadas conhecem o comissionamento virtual, mas apenas algumas utilizam seu potencial na prática [27].

**Comissionamento virtual vs. gêmeo da fábrica:** O comissionamento virtual atua no nível de sinais e controle, muitas vezes em milissegundos. Um gêmeo da fábrica atua no nível de ordens e recursos, em minutos a turnos. Ambos podem usar o mesmo layout, mas respondem a perguntas diferentes. Mais informações na página de entidade [Virtual Commissioning](https://www.m365.fm/entity/virtual-commissioning/).

### 7.6 Planejamento de frotas de AGV e AMR

Veículos guiados automatizados (AGVs) e robôs móveis autônomos (AMRs) são um exemplo clássico de uso de simulação, porque seu comportamento é determinado por interações: veículos se bloqueiam em cruzamentos, esperam em estações de transferência, voltam vazios e precisam carregar. Um cálculo estático (ordens de transporte por hora multiplicadas pelo tempo médio de percurso) frequentemente subestima o número de veículos necessários, porque deixa de fora as viagens vazias, os tempos de espera e as paradas para recarga.

Em termos de segurança, duas normas americanas servem de referência para esses projetos. A **ANSI/ITSDF B56.5-2024**, *Safety Standard for Guided Industrial Vehicles*, define os requisitos de segurança para o projeto, a operação e a manutenção de veículos industriais automáticos guiados, motorizados e não tripulados, e dos sistemas dos quais fazem parte [53]. A **ANSI/A3 R15.08-1-2020 (R2026)**, *Industrial Mobile Robots: Safety Requirements, Part 1*, trata dos fabricantes de robôs móveis industriais e se apoia na avaliação de riscos dentro de um ambiente operacional documentado [54]. Na Alemanha, a diretriz **VDI 2510** trata de sistemas AGV para fluxo de materiais dentro da fábrica; a edição atual é de 2005, e um rascunho de julho de 2025 aborda sistemas AGV e AMR, incluindo tipos de veículos, controle de frota, navegação, alimentação elétrica, transmissão de dados, infraestrutura e segurança [18]. Uma simulação não substitui a avaliação de riscos exigida por essas normas, mas mostra cedo onde regras de tráfego, zonas de velocidade e tráfego misto com pessoas geram conflitos.

Perguntas típicas para uma simulação de AGVs:

- Quantos veículos precisamos na carga de pico e quantos em média?
- Quais rotas, regras de sentido único e posições de espera evitam congestionamentos?
- Qual estratégia de recarga (recarga de oportunidade, troca de bateria) mantém alta a disponibilidade?
- Como o tráfego misto com empilhadeiras e pedestres afeta o desempenho?
- O que acontece se um veículo ou uma estação de transferência falhar?

**Exemplo prático com valores ilustrativos:** Suponha que uma área de montagem precise de 60 transportes por hora, e que uma viagem carregada leve 3 minutos em média. O cálculo simples dá 60 × 3 = 180 minutos de percurso por hora, ou 3 veículos. Acrescente o percurso vazio até a próxima coleta (também 3 minutos neste caso) e 1 minuto para cada coleta e entrega, e cada transporte passa a levar 8 minutos, ou 480 minutos por hora: 8 veículos totalmente utilizados. Com uma utilização-alvo de 80 por cento e uma disponibilidade de 85 por cento devido à recarga, obtém-se 8 / (0,8 × 0,85) ≈ 11,8, ou 12 veículos. Os congestionamentos nos cruzamentos e as esperas nas estações de transferência ainda não estão incluídos; só a simulação consegue mostrá-los.

O requisito de dados é administrável, mas muitas vezes subestimado: é preciso uma **matriz de transporte** (de onde para onde, com que frequência, em que momento), que pode ser derivada dos roteiros de fabricação, das listas de materiais e do conceito de abastecimento na linha. É aqui que um modelo PPR compensa, porque já conhece as necessidades de material por operação. Para controlar frotas mistas reais, ambientes 3D baseados em física são cada vez mais usados; a NVIDIA, por exemplo, descreve seu blueprint "Mega" (apresentado como prévia em 2025) como um fluxo de trabalho de referência para testar frotas de robôs em gêmeos digitais de instalações [25]. Mais informações na página da entidade [Automated Guided Vehicle](https://www.m365.fm/entity/automated-guided-vehicle/).

### 7.7 Energia e CO2

Um gêmeo digital de produção pode modelar o consumo de energia por estado: uma máquina consome potências diferentes durante o processamento, a ociosidade, a preparação e a parada. Combinada com o fluxo de pedidos, a simulação mostra picos de carga e o efeito de medidas como a mudança de turnos, o desligamento automático durante as pausas ou sequências alteradas. O pré-requisito são os valores de potência por estado, que se medem ou se derivam de dados do fabricante. Números confiáveis sobre o potencial de economia dependem muito do caso individual; desconfie de percentuais genéricos.

### 7.8 Manutenção

A manutenção preditiva costuma ser citada como o exemplo principal de gêmeo digital. Na prática, trata-se de duas disciplinas diferentes: o monitoramento de condição e a previsão de falhas trabalham com dados de sensores e com modelos estatísticos ou físicos de dano no nível do ativo. Um gêmeo digital de produção pode se beneficiar ao tomar a parada prevista como cenário e mostrar quais pedidos são afetados e quando uma janela de manutenção causa o menor prejuízo.

## 8. Gêmeos digitais com Microsoft Azure e Fabric

Muitos fabricantes executam sua TI corporativa no Microsoft 365 e no Azure. Para eles, a questão é quais serviços da Microsoft são candidatos a gêmeos digitais e qual é o status de cada um. O episódio [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/) oferece uma visão geral do papel do Azure.

### Azure Digital Twins

**Azure Digital Twins** é uma oferta de plataforma como serviço (PaaS) para criar grafos de gêmeos com base em modelos digitais de ambientes inteiros, como edifícios, fábricas, redes de energia ou cidades [21]. Os modelos são escritos na **Digital Twins Definition Language (DTDL)**. O Azure Digital Twins oferece suporte ao DTDL v2 e v3, e a Microsoft recomenda a v3 por causa de seus recursos ampliados; uma interface v3 pode estender uma interface v2, mas não o contrário [22]. A Microsoft também disponibiliza ontologias que reúnem modelos DTDL baseados em padrões do setor [22]. A página de visão geral não continha nenhum aviso de descontinuação quando verificamos [21].

O Azure Digital Twins é uma plataforma de modelagem e grafos, não um software de simulação. Ele representa relacionamentos e estados e processa eventos; simulação de eventos discretos, comparação de cenários ou otimização precisam vir de outras ferramentas.

### Digital twin builder no Microsoft Fabric (prévia)

Com o **digital twin builder**, a Microsoft introduziu em 2025 um item na carga de trabalho Real-Time Intelligence do Microsoft Fabric. Ele é usado para modelar conceitos de negócio, como ativos e processos, em uma **ontologia**, mapear dados de diversos sistemas de origem para instâncias desses tipos de entidade e criar relacionamentos semânticos entre eles; os dados ficam no OneLake [23]. No momento da redação deste texto, a Microsoft rotula explicitamente o digital twin builder como **prévia** (Microsoft Learn, página atualizada pela última vez em 20 de maio de 2026; verificada em 20 de novembro de 2026) [23]. A Microsoft também aponta que o digital twin builder é um serviço diferente do Azure Digital Twins [21][23]. No blog do Fabric, a Microsoft cita exemplos de manufatura, como gêmeos de máquinas e processos para análise de causa raiz e perguntas do tipo "e se", além de parceiros que fornecem esquemas de dados de manufatura e consultas de KPI, por exemplo para a eficácia geral do equipamento (OEE) [24].

### Qual serviço para qual finalidade?

| Necessidade | Abordagem adequada | Observação |
|---|---|---|
| Grafo de ativos, espaços e equipamentos com processamento de eventos, em produção | Azure Digital Twins com DTDL v3 [21][22] | serviço PaaS com disponibilidade geral; adicione simulação separadamente |
| Ontologia sobre dados de ERP, MES e sensores em uma plataforma de dados do Fabric | digital twin builder no Fabric [23] | prévia: para pilotos e avaliação; verifique o uso em produção com os termos de prévia da Microsoft |
| Capacidade, gargalos, cenários, layout | ferramenta de simulação (seção 15), resultados no Fabric ou no Power BI | nem o Azure Digital Twins nem o digital twin builder são software de simulação |

### O que administradores de M365 e Azure contribuem

Um gêmeo de produção não é um projeto puramente de OT. A TI contribui com blocos essenciais:

- **Identidade e permissões:** quem pode criar cenários e quem pode aprovar resultados? Funções no Microsoft Entra ID, direitos separados para modelagem, análise e gravação de volta.
- **Plataforma de dados:** conexão de ERP e MES a uma plataforma central de dados, historização, regras de qualidade de dados, catálogos.
- **Governança:** classificação de dados de produção e de clientes, retenção, registros de acesso. Para fornecedores de defesa, isso inclui o tratamento de informações não classificadas controladas (CUI) segundo DFARS e CMMC; nosso guia sobre [planejamento de produção aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/) aborda essas regras.
- **Relatórios e colaboração:** publicação de resultados de simulação no Power BI, canais do Teams para decisões de cenários, versionamento de estados de modelo.
- **Segurança:** segmentação de rede entre TI e OT, sem acesso de gravação direta da nuvem a controladores sem uma cadeia de aprovação definida (ver seção 16).

Nosso guia sobre [Azure para manufatura](https://www.m365.fm/en/learn/manufacturing-it-azure/) aborda em detalhes a TI de manufatura no Azure.

## 9. Inteligência artificial e o gêmeo digital

IA e o gêmeo digital se complementam nas duas direções: o gêmeo fornece à IA um contexto estruturado e um ambiente seguro para experimentação, e a IA acelera e amplia o gêmeo. Cinco padrões são relevantes na manufatura:

1. **Preparação de dados:** Aprendizado de máquina detecta valores atípicos em confirmações, estima tempos ausentes e deriva distribuições a partir de dados reais. Não é algo espetacular, mas costuma ser a maior alavanca prática.
2. **Modelos substitutos:** Um modelo de simulação detalhado é usado para "treinar" uma rede neural ou outro substituto com muitas execuções; o substituto então entrega aproximações em segundos. É útil para otimizações que exigem um número muito grande de avaliações. Os limites estão fora da faixa treinada.
3. **Otimização e aprendizado por reforço:** Agentes aprendem regras de controle dentro do modelo de simulação, por exemplo para sequenciamento ou despacho de veículos, sem perturbar a produção real. O exemplo da McKinsey em fabricação metálica, na seção 7.3, usou essa abordagem [26]. As regras só são tão boas quanto a fidelidade do modelo.
4. **IA generativa como interface:** Modelos de linguagem traduzem perguntas como "O que acontece se a linha 3 ficar parada por uma semana?" em cenários e explicam os resultados. O pré-requisito é um modelo semanticamente limpo (ontologia, grafo PPR) para que a IA não precise adivinhar.
5. **IA física e robótica:** Gêmeos 3D baseados em física servem como ambientes de treinamento e teste para robôs e veículos autônomos; a NVIDIA posiciona o Omniverse e o blueprint Mega, baseado em OpenUSD, para essa finalidade [25].

**Uma avaliação sóbria:** A IA não substitui a validação nem a expertise do domínio. Um modelo de linguagem trabalhando sobre um roteiro defeituoso produz rapidamente respostas plausíveis, porém erradas. A ordem, portanto, é: primeiro a base de dados e o modelo, depois a IA.

## 10. Roteiro: implementação em seis fases

O roteiro a seguir é um guia para um gêmeo de produção ou de fábrica. As durações são a experiência do autor para uma planta de porte médio com um primeiro caso de uso claramente delimitado [unverified: experiência do autor, sem fonte independente]; a McKinsey indica uma faixa de dois a três meses até mais de um ano para projetos de gêmeos, dependendo das capacidades da equipe e da complexidade da planta [26]. O post [Digital twin in manufacturing: where to start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/) também descreve como dar o primeiro passo.

| Fase | Conteúdo | Resultado | Duração típica |
|---|---|---|---|
| 1 Questão | definir a decisão, estabelecer métricas e metas, atribuir responsáveis | carta de projeto de uma página com a questão orientadora, métricas, fronteira do sistema | 2–4 semanas |
| 2 Inventário de dados | revisar dados de ERP, MES e layout, verificar a qualidade dos dados, fechar lacunas | mapa de dados, relatório de qualidade, lista de ações | 3–6 semanas |
| 3 Modelo piloto | modelo PPR para uma cadeia de valor ou área, modelo de simulação executável | modelo piloto validado | 6–12 semanas |
| 4 Validação e primeira decisão | comparar com dados reais, executar cenários, preparar a decisão | decisão documentada com premissas | 2–6 semanas |
| 5 Operacionalização | alimentação automática de dados, papéis, processos de manutenção, validação regular do cronograma | modo shadow em operação de rotina | 2–6 meses |
| 6 Escalonamento | mais áreas, plantas, casos de uso, acoplamento com APS, energia, AGVs | portfólio de gêmeos sobre uma base de dados comum | contínuo |

**Princípios orientadores do roteiro:**

- **Uma decisão primeiro.** Um gêmeo que melhora uma decisão concreta de investimento ou planejamento paga a fase seguinte.
- **Dados antes da plataforma.** Verifique a qualidade dos dados antes de selecionar ferramentas.
- **Operação na liderança.** Planejadores e supervisores precisam entender e confiar no modelo. Um modelo que só o grupo de simulação consegue operar morre com a próxima troca de pessoal.
- **Manutenção desde o primeiro dia.** Decida cedo quem atualiza o modelo quando roteiros, layouts ou padrões de turno mudam.

**Apoio para pequenas e médias manufaturas:** Nos EUA, o NIST Manufacturing Extension Partnership (MEP), programa do National Institute of Standards and Technology do Departamento de Comércio, com mais de 450 unidades de serviço em todos os 50 estados e em Porto Rico, é um ponto de partida comum para fabricantes menores que querem apoio externo em projetos de digitalização [60]. O relatório de casos de uso da ISO 23247 do NIST foi escrito justamente para esse público [47].

## 11. Qualidade de dados: o pré-requisito subestimado

Em muitos projetos de gêmeo digital, a primeira revisão de dados já mostra o problema: os dados mestres no sistema ERP descrevem a fábrica mais como ela foi planejada um dia do que como ela funciona hoje. Isso não é uma crítica à gestão de dados mestres. Decorre do fato de que os sistemas ERP são mantidos principalmente para custeio e planejamento de materiais, e não para simulação.

### Problemas típicos de dados

- **Tempos padrão** vêm de custeio ou de estudos de tempo realizados anos atrás (na Alemanha, frequentemente estudos REFA, a versão alemã do clássico estudo de tempos da engenharia industrial) e desviam consideravelmente dos tempos reais.
- **Tempos de setup** são armazenados como valores fixos, embora na prática dependam da sequência (matriz de setup).
- **Grupos de centros de trabalho** reúnem máquinas que na prática são diferentes (idade, disponibilidade, habilidades dos operadores).
- **Calendários de turnos** não refletem turnos extras, períodos de jornada reduzida (na Alemanha: *Kurzarbeit*, trabalho de curta duração subsidiado pelo governo) ou falta de pessoal.
- **Paradas** não são registradas de forma alguma no ERP e são registradas no MES com códigos de motivo inconsistentes.
- **Listas de materiais de fabricação** divergem da lista de materiais de engenharia sem que o desvio seja documentado.
- **Apontamentos** são lançados em lote ao final do turno, de modo que os carimbos de data e hora não refletem a sequência real dos eventos.
- **Tempos de transporte** e roteiros internos à fábrica simplesmente não existem.

### Checklist antes de construir o modelo

| Verificação | Pergunta | Método |
|---|---|---|
| Completude | Todo material relevante possui um roteiro, e toda operação um centro de trabalho? | consulta de vínculos ausentes |
| Atualidade | Quando os tempos padrão foram revisados pela última vez? | data de alteração por roteiro |
| Plausibilidade | Qual é a diferença entre tempos padrão e tempos reais? | comparação com os apontamentos de três a seis meses |
| Granularidade | Os centros de trabalho são suficientemente detalhados para a questão? | cruzamento com o layout e um gemba walk |
| Consistência | Os nomes coincidem entre ERP, MES e layout? | tabela de mapeamento |
| Carimbos de data e hora | Os apontamentos são lançados com prontidão? | distribuição dos horários de lançamento ao longo do turno |
| Paradas | Existe um catálogo único de motivos de parada? | análise de frequência dos motivos |
| Responsabilidade | Quem mantém quais dados e quem aprova alterações? | matriz RACI |

**Regra prática:** Um modelo de simulação pode preencher lacunas de dados com premissas, desde que as premissas estejam documentadas e testadas em análises de sensibilidade. Um gêmeo que calcula silenciosamente com tempos padrão errados é perigoso, porque parece preciso.

Um efeito colateral que muitas empresas subestimam: o inventário de dados necessário para um gêmeo digital, por si só, muitas vezes melhora a qualidade do planejamento no sistema ERP, porque expõe roteiros desatualizados e capacidades incorretas.

## 12. Custo e benefício, avaliados com honestidade

### Fatores de custo

Na avaliação do autor, o custo de um gêmeo digital de produção geralmente é dominado não pelo software, mas pelo trabalho com dados e modelagem. Os principais fatores de custo são:

- **Preparação de dados:** interfaces, limpeza, mapeamento, esclarecimento junto ao negócio.
- **Modelagem e validação:** construção do modelo PPR e do modelo de simulação, comparação com a realidade.
- **Manutenção:** atualizações quando produtos, processos ou layouts mudam. Este item está ausente em muitos casos de negócio.
- **Treinamento:** capacitação de planejadores e usuários-chave, construção de competência interna.
- **Software e infraestrutura:** licenças, recursos em nuvem, integração.

Para estudos de simulação, uma empresa alemã de serviços de simulação indica, como regra prática, que o custo não deve exceder 1 por cento do investimento em questão, e cita estudos e benchmarks (incluindo a VDI) que colocam a relação custo-benefício em cerca de 1:6, em média [30]. Esses valores vêm de uma fonte do fornecedor; verifique os estudos originais antes de usá-los em seu próprio caso de negócio.

### Exemplos documentados de benefício

Números de benefício confiáveis e coletados de forma independente são raros. Os valores a seguir têm fonte, mas são casos individuais:

| Fonte | Contexto | Valor |
|---|---|---|
| McKinsey (2024) [26] | fábrica de montagem, programação de produção redesenhada | 5–7% de economia mensal de custos por meio de menos horas extras |
| McKinsey (2024) [26] | otimização de sequência em uma estação gargalo | aprox. 4% menos tempo total de processamento |
| McKinsey (2024) [26] | pesquisa com 75 executivos industriais seniores (junho de 2022) | 86% consideram os gêmeos aplicáveis, 44% já implementaram um, 15% planejam implementar |
| ZF / Fraunhofer IESE (2021) [28] | linha de pré-montagem, Saarbrücken (Alemanha), middleware Eclipse BaSyx | aprox. 30% mais rápido no comissionamento (expectativa, não uma média) |
| Fraunhofer IWU (2024) [27] | pesquisa com fabricantes de máquinas e equipamentos na Saxônia (Alemanha) | mais de 90% conhecem o comissionamento virtual, mas apenas poucos utilizam seu potencial |

Para contexto sobre o cenário de investimentos nos EUA: na Pesquisa Deloitte 2025 sobre Manufatura Inteligente e Operações (600 executivos de fabricantes nos EUA com receita de 500 milhões de dólares ou mais, realizada de agosto a setembro de 2024), 78 por cento dos líderes disseram destinar mais de 20 por cento do orçamento de melhoria a iniciativas de manufatura inteligente; os respondentes relataram melhorias de até 20 por cento na produção [56]. São números autorreferidos para a manufatura inteligente como um todo, não para gêmeos digitais especificamente.

### O caso de negócio em cinco perguntas

1. **Qual decisão** o gêmeo melhora, e com que frequência ela é tomada (uma vez para um projeto de capital, ou semanalmente no sequenciamento)?
2. **Quanto custa uma decisão errada** (investimento superdimensionado ou subdimensionado, entregas atrasadas, horas extras, falta de estoque)?
3. **Quanto mais precisa** a decisão se torna com o gêmeo? Um piloto oferece uma primeira comparação entre plano, simulação e resultados reais.
4. **Quanto custa o gêmeo** ao longo de três a cinco anos, incluindo a manutenção?
5. **Quais benefícios secundários** surgem (dados mestres melhores, verificações de cotação mais rápidas, reutilização em outras áreas)?

Para decisões de capital na casa dos milhões de dólares, uma única alocação errada evitada pode justificar um projeto de simulação. Para gêmeos de planejamento contínuo, a frequência de uso é o que decide.

## 13. Erros comuns e como evitá-los

| Erro | Consequência | Contramedida |
|---|---|---|
| tecnologia antes da pergunta | plataforma cara sem benefício | carta de projeto de uma página com uma decisão concreta e uma métrica antes de qualquer seleção de ferramenta |
| confundir visualização 3D com gêmeo digital | imagens bonitas, sem respostas às perguntas sobre capacidade | lógica de processo (PPR) antes da geometria |
| modelar tudo de uma vez | o projeto nunca termina | um fluxo de valor ou uma área como piloto |
| adotar dados mestres sem verificação | resultados precisos na aparência, mas errados | verificação da qualidade dos dados (seção 11), comparação com tempos reais |
| não validar | perda de confiança no primeiro desvio | comparação sistemática com dados reais, premissas documentadas |
| médias em vez de distribuições | gargalos e estoques subestimados | distribuições a partir de dados reais, decomposição do modelo |
| uma única replicação de simulação | um resultado aleatório vendido como verdade | várias replicações, intervalos de confiança [41] |
| nenhum plano de manutenção | modelo desatualizado após alguns meses | papéis, processos e orçamento para manutenção |
| modelo apenas para especialistas | o conhecimento sai com uma única pessoa | interfaces compreensíveis, treinamento, documentação |
| ciclo de realimentação sem aprovação | risco de segurança e de responsabilidade | aprovação humana, registro de logs, conceito de segurança de TI/OT |
| termos não definidos | mal-entendidos em RFP e contrato | especificar explicitamente o nível de integração (modelo, sombra, gêmeo) [5] |

## 14. Normas e diretrizes em resumo

| Norma/diretriz | Título (resumido) | Status | Relevância |
|---|---|---|---|
| ISO 23247-1 a -4 | Estrutura de gêmeo digital para manufatura: visão geral, arquitetura de referência, representação digital, troca de informações | 2021 [6] | estrutura e organização para gêmeos de manufatura |
| ISO 23247-5 | Fio digital para gêmeo digital | 2026 (listada no catálogo da ISO como Edição 1, 2026-06, ainda exibida como "em publicação" em 20 de novembro de 2026) [7] | vinculação de informações do ciclo de vida |
| ISO 23247-6 | Composição de gêmeo digital | publicada em 14 de julho de 2026 [8] | composição de vários gêmeos |
| NIST AMS 400-2 | Cenários de casos de uso para implementação de gêmeo digital com base na ISO 23247 | maio de 2021 [47] | orientação de implementação nos EUA para a ISO 23247 |
| ISO/IEC 30173 | Gêmeo digital: conceitos e terminologia | novembro de 2023 [9] | termos intersetoriais |
| NIST IR 8356 | Considerações de segurança e confiança para a tecnologia de gêmeo digital | fevereiro de 2025 [49] | segurança e confiança |
| IEC 63278-1 | Asset Administration Shell para aplicações industriais, Parte 1: Estrutura | 14 de dezembro de 2023 [10] | Asset Administration Shell |
| DIN SPEC 91345 | Modelo de Arquitetura de Referência Industrie 4.0 (RAMI 4.0) | 2016 [12] | estrutura da Indústria 4.0 (alemã) |
| ANSI/ISA-95 (IEC 62264) | Integração de sistemas de controle empresarial | série de normas [58][19] | níveis ERP/MES/controle, modelos de dados |
| ANSI/MTC1.4-2018 (MTConnect) | interoperabilidade de dados de manufatura | edição de 2018 [57] | dados de máquinas, comum em oficinas mecânicas dos EUA |
| IEC 62541 (OPC UA) | OPC Unified Architecture | série de normas | comunicação de máquinas e modelos de informação |
| VDI 3633 Parte 1 | Simulação de sistemas em movimentação de materiais, logística e produção: fundamentos | dezembro de 2014 [13] | método do estudo de simulação (alemã) |
| VDI/VDE 3693 Parte 1 | Comissionamento virtual: tipos de modelo e glossário | agosto de 2016 [14] | termos de comissionamento virtual (alemã) |
| VDI/VDE 3693 Parte 2 | Comissionamento virtual: introdução em empresas | dezembro de 2018, revisão anunciada [15] | introdução do comissionamento virtual (alemã) |
| VDI 4499 Parte 1 | Fábrica digital: fundamentos | nova edição em abril de 2026 (primeira edição em fevereiro de 2008) [16] | termo e arquitetura da fábrica digital (alemã) |
| ANSI/ITSDF B56.5-2024 | Norma de segurança para veículos industriais guiados | 2024 [53] | segurança de AGVs (EUA) |
| ANSI/A3 R15.08-1-2020 (R2026) | Robôs industriais móveis: requisitos de segurança, Parte 1 | reafirmada em 2026 [54] | segurança de AMRs (EUA) |
| VDI 2510 | Sistemas de veículos guiados automaticamente (AGVS) | outubro de 2005, rascunho de julho de 2025 [18] | AGVs e AMRs (alemã) |
| ISA/IEC 62443 | Segurança para sistemas de automação e controle industrial | série de normas [59] | segurança de sistemas de automação |
| NIST SP 800-82 Rev. 3 | Guia de segurança de tecnologia operacional (OT) | setembro de 2023 [55] | orientação de segurança OT (EUA) |

## 15. Categorias de software: uma comparação neutra

O mercado é difícil de navegar porque muitos fornecedores chamam seu produto de "gêmeo digital". Uma classificação por função é mais útil:

| Categoria | Função principal | Pontos fortes | Limites | Usuários típicos |
|---|---|---|---|---|
| Ferramentas de simulação de eventos discretos | simulação de fluxo de material e de fábrica | alta liberdade de modelagem, método consolidado | construção do modelo é trabalhosa, exige especialização | especialistas em simulação, planejamento fabril |
| Ferramentas de simulação multimétodo | combinação de eventos discretos, baseada em agentes, dinâmica de sistemas | flexível para questões mistas | curva de aprendizado íngreme | especialistas em simulação e logística |
| Suítes de fábrica digital e PLM | layout, robótica, planejamento de processos, simulação em contexto PLM | continuidade do projeto até a produção | complexidade, custo de licença | grandes empresas, setor automotivo |
| Ferramentas de comissionamento virtual | modelos de equipamentos com acoplamento a CLP (SiL/HiL) | teste de controle antes da instalação | foco no equipamento, não na planta | engenheiros de controle, fabricantes de máquinas |
| Ferramentas de planejamento baseadas em fluxo de valor e PPR | modelo a partir de dados de ERP e fluxo de valor, simulação, cenários | construção rápida a partir de dados existentes, próximo à operação | menos adequadas para sistemas de transportadores detalhados | planejamento da produção, lean, gestão da planta |
| Sistemas APS | planejamento e sequenciamento com restrição de capacidade | programação operacional | simulação frequentemente limitada | planejamento e controle da produção |
| Plataformas IoT e de gêmeos | modelos de ativos, processamento de eventos, grafos (ex.: Azure Digital Twins) | escala, integração, tempo real | sem simulação de fábrica | TI, equipes de plataforma de dados |
| Plataformas 3D e de física | cenas fotorrealistas, física, treinamento de robôs (ex.: em OpenUSD) | visualização, robótica, treinamento de IA | lógica de processo e dinâmica de pedidos não são o foco | robótica, grandes projetos |

**Critérios de seleção:** A ferramenta se adequa à questão e ao nível de detalhe necessário? Com que rapidez um modelo pode ser construído a partir dos seus dados existentes? A equipe de operação consegue usá-la por conta própria? Como ela é mantida? Quais interfaces existem com ERP, MES e sua plataforma de dados? Quais padrões (AAS, OPC UA, MTConnect, DTDL) são suportados? Onde os dados ficam armazenados e quem tem acesso?

## 16. Segurança, propriedade dos dados e regulamentação

Um gêmeo digital de produção contém informações sensíveis: estruturas de produtos, tempos de processo, capacidades e pedidos de clientes descrevem o conhecimento técnico e a posição competitiva de uma empresa. Quanto maior o nível de integração, maior o risco.

- **Separação TI/TO:** Um gêmeo que grava de volta nos controles precisa de um conceito de zonas e conduítes de acordo com a ISA/IEC 62443, série que define requisitos e processos para sistemas de automação e controle industrial seguros [59], além de passagens definidas e registro de logs. A NIST SP 800-82 Rev. 3 (setembro de 2023) é o guia do governo dos EUA para proteger a tecnologia operacional, com arquiteturas típicas, ameaças e contramedidas [55].
- **Riscos específicos de gêmeos:** A NIST IR 8356 (versão final, fevereiro de 2025) analisa os desafios de cibersegurança tradicionais e novos das arquiteturas de gêmeos digitais e relaciona considerações de confiança ao guia existente da NIST [49]. Use-a como lista de verificação quando o gêmeo agregar dados de muitos sistemas em um único lugar.
- **Cadeias de aprovação:** Recomendações do gêmeo devem ser aprovadas por pessoas antes de entrarem em vigor no ERP, MES ou controles, pelo menos até que a confiabilidade tenha sido demonstrada.
- **Propriedade dos dados:** Defina em contrato quem é dono dos modelos e dos dados derivados, onde são processados e se os fornecedores podem usá-los para fins próprios (como treinamento de IA).
- **Regulamentação para exportadores para a UE:** A **Lei de Resiliência Cibernética** da União Europeia (Regulamento (UE) 2024/2847) estabelece requisitos de cibersegurança para produtos com elementos digitais vendidos na UE. As obrigações de notificação de vulnerabilidades exploradas ativamente se aplicam desde 11 de setembro de 2026; as demais obrigações se aplicam a partir de 11 de dezembro de 2027 [36]. Para fabricantes dos EUA de máquinas conectadas e software vendidos na UE, isso é diretamente relevante; para operadores de plantas, importa indiretamente por meio dos requisitos que impõem aos seus fornecedores.

## 17. Construindo um gêmeo a partir de dados de ERP e de fluxo de valor com o iFAKT Polaris

> **Nota: O autor trabalha na iFAKT GmbH.**

Esta seção descreve uma abordagem de solução que segue o princípio explicado na seção 5: construir o gêmeo da produção a partir de dados de ERP e de fluxo de valor já existentes, por meio de um modelo produto-processo-recurso. As informações vêm das páginas de produto da iFAKT GmbH e podem ser verificadas ali; o autor não possui testes comparativos independentes.

A [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), com sede em Stuttgart, Alemanha, afirma atuar há mais de 25 anos e desenvolve software para mapeamento de fluxo de valor, simulação de produção, planejamento e otimização [35]. A empresa descreve sua plataforma [iFAKT Polaris](https://www.m365.fm/entity/polaris/) como uma forma de conectar dados de ERP a um gêmeo digital da produção, a fim de otimizar planos e expor gargalos; a plataforma inclui módulos para modelagem de fluxo de valor e de swimlane (VSM/BSM), Designer, Simulator, Optimizer, Operator e Analyzer [35].

**Polaris Designer:** De acordo com a página do fornecedor, o Designer transforma dados de entrada em um **grafo de conhecimento PPR** estruturado, que conecta produtos (listas de materiais de fabricação e de engenharia, MBOM/EBOM), processos (tempos de preparação, de máquina e de movimentação) e recursos (estações, equipes, zonas) com suas restrições em um único modelo. As entradas são dados de ERP, listas de materiais de fabricação, tempos de processo, estruturas de recursos e restrições. A partir delas, o Designer gera automaticamente diagramas de rede baseados na lógica real da produção, mostra o caminho crítico e os recursos críticos, destaca processos gargalo, compara prazos de entrega atuais e otimizados e atribui zonas com base nas relações produto-processo. O fornecedor posiciona o grafo como base comum (“fonte única da verdade”) para simulação e otimização [33]. Mais informações na página da entidade [Polaris Designer](https://www.m365.fm/entity/polaris-designer/).

**Polaris Simulator:** Segundo o fornecedor, o Simulator se baseia no grafo PPR criado no Designer e executa os diagramas de rede por meio de modelos configuráveis de estação, linha e chão de fábrica (hall), para linhas únicas e múltiplas. Ele busca tornar transparente a utilização da capacidade ao longo de turnos e cenários, detectar gargalos e desequilíbrios de utilização ao longo do tempo, mostrar superutilização e subutilização, assim como a utilização de mão de obra em função do tempo, e avaliar cenários de capacidade, alocação de mão de obra e buffers, bem como mixes dinâmicos de produtos em recursos compartilhados [34]. Mais informações na página da entidade [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/).

**Contexto técnico:** Funcionários da iFAKT publicaram sobre as questões subjacentes na literatura técnica alemã, por exemplo sobre simulação dinâmica de fluxos de valor (ZWF 109(11), 2014) [31] e, com parceiros de pesquisa, sobre uma interface de dados universal para serviços digitais de fluxo de valor (ZWF 118(5), 2023) [32].

**Avaliação:** Uma abordagem baseada em PPR e fluxo de valor é especialmente adequada a questões de planejamento da produção, capacidade, gargalos e alocação de mão de obra em áreas de montagem e fabricação de alto mix. Para sistemas de transporte detalhados, células robotizadas ou comissionamento virtual no nível de sinais, as categorias especializadas da seção 15 são mais adequadas. Como ocorre com qualquer ferramenta, teste em um piloto com seus próprios dados se os resultados respondem à sua pergunta. Nosso guia dedicado sobre o [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) aborda a plataforma com mais profundidade.

## 18. Glossário

| Termo | Explicação |
|---|---|
| Advanced planning and scheduling (APS) | software para planejamento e sequenciamento com restrição de capacidade |
| Agent-based simulation (ABS) | modelagem de unidades autônomas (agentes) com regras próprias, cuja interação produz o comportamento do sistema |
| AGV / AMR | veículo guiado automaticamente / robô móvel autônomo [53][54] |
| Asset Administration Shell (AAS) | representação digital padronizada de um ativo, conforme a IEC 63278 [10] |
| Bottleneck (constraint) | recurso que limita a taxa de produção do sistema como um todo [39] |
| Digital factory | termo genérico para modelos, métodos e ferramentas digitais para planejar e melhorar a fábrica real (diretriz alemã VDI 4499) [16][17] |
| Digital model | representação digital sem troca automática de dados com o objeto físico [5] |
| Digital shadow | representação com fluxo automático de dados do físico para o digital, mas fluxo de volta manual [5] |
| Digital thread | vinculação conectada de informações ao longo do ciclo de vida; tratada na ISO 23247-5 [7] |
| Digital twin | representação com fluxo automático de dados nos dois sentidos [5]; frequentemente usado de forma mais ampla na prática |
| Discrete event simulation (DES) | simulação cujo relógio avança de evento em evento; o padrão na simulação de produção |
| DTDL | Digital Twins Definition Language, linguagem de modelagem baseada em JSON para o Azure Digital Twins [22] |
| ERP | planejamento de recursos empresariais, o sistema empresarial central com dados mestres, pedidos e planejamento de materiais |
| HiL / SiL / MiL | loop de hardware, software ou modelo: variantes de acoplamento para comissionamento virtual |
| ISA-95 / IEC 62264 | série de normas para integração entre sistemas empresariais e de controle [58] |
| Little's Law | L = λ · W: o estoque médio é igual à taxa de produção multiplicada pelo lead time em regime permanente [37] |
| Material flow simulation | simulação dos fluxos de materiais e pedidos pela produção e logística, normalmente a eventos discretos |
| MBOM / EBOM | lista de materiais de fabricação / lista de materiais de engenharia |
| MES | sistema de execução da manufatura, gestão das operações no nível 3 da ISA-95 |
| MTConnect | padrão aberto para interoperabilidade de dados de manufatura, publicado como ANSI/MTC1.4-2018 [57] |
| OPC UA | padrão de comunicação independente de fabricante com modelos de informação (IEC 62541) |
| PPR model | modelo produto-processo-recurso, o princípio estruturante da fábrica digital |
| Replication | execução repetida da simulação com números aleatórios diferentes para obter confiança estatística [41] |
| Validation | verificação de que um modelo representa a realidade com precisão suficiente para sua finalidade |
| Value stream simulation | simulação dinâmica de um mapa do fluxo de valor ao longo do tempo [31] |
| Verification | verificação de que um modelo foi implementado corretamente |
| Virtual commissioning | teste do software de controle contra um modelo de simulação antes do comissionamento físico [14] |
| VVUQ | verificação, validação e quantificação de incertezas; proposto pelo NIST como futura parte da ISO 23247 [48] |
| Warm-up period | fase inicial de uma execução de simulação cujos resultados são descartados por causa do estado inicial vazio |

## 19. FAQ: gêmeos digitais na manufatura

### O que é um gêmeo digital na manufatura, em termos simples?
Um gêmeo digital é um modelo computacional executável da sua produção, atualizado com dados das operações reais. Você pode usá-lo para simular operações, identificar gargalos e testar mudanças antes de implementá-las no chão de fábrica.

### Quais são os 4 tipos de gêmeos digitais?
Um esquema comum de quatro níveis distingue gêmeos de componentes (peças), gêmeos de ativos, gêmeos de sistemas (unidades) e gêmeos de processos [52]. Para decisões de manufatura, uma divisão mais útil é entre gêmeos de produto, processo, ativo, fábrica, desempenho e cadeia de suprimentos (ver seção 3). Nenhuma dessas classificações é padronizada; a ISO/IEC 30173 descreve os tipos de gêmeos apenas em nível geral [9].

### Qual é a diferença entre um gêmeo digital e uma sombra digital?
Segundo Kritzinger et al., em uma sombra digital os dados fluem automaticamente do objeto físico para o digital, mas o caminho de retorno é manual. Em um gêmeo digital, os dados fluem automaticamente nos dois sentidos [5]. Um modelo digital não tem nenhuma troca automática de dados.

### Quais são exemplos de gêmeos digitais na manufatura?
Exemplos típicos são um modelo de fábrica que compara variantes de layout antes da aprovação de uma nova edificação, uma simulação alimentada diariamente pelo ERP e pelo MES que verifica se a programação da semana se sustenta, um modelo de comissionamento virtual que testa o código do CLP antes da instalação de uma linha e um modelo de frota de AGVs que dimensiona veículos e carregamento. A McKinsey documenta casos como uma programação de montagem redesenhada, com economia de custos de 5 a 7 por cento ao mês, e uma sequência de gargalos que reduziu o tempo de processamento em cerca de quatro por cento [26].

### Qual é a diferença entre um gêmeo digital e uma simulação?
Uma simulação é um modelo com o qual você executa experimentos. Ela se torna uma sombra digital ou um gêmeo digital quando é alimentada automaticamente com dados operacionais e seus resultados retornam às decisões ou aos controles. Muitos gêmeos contêm uma simulação em seu núcleo.

### Um modelo 3D ou um modelo BIM é um gêmeo digital?
Não por si só. Uma varredura 3D, um layout CAD ou um modelo de informações de construção (BIM) captura a geometria. Sem a lógica de processo (roteiros, tempos, recursos) e sem uma conexão de dados com as operações, ele não consegue responder a perguntas de capacidade ou de prazo de entrega. Pode ser uma camada útil de um gêmeo, especialmente no planejamento de layout em instalações existentes (brownfield).

### Qual é a diferença entre simulação de produção e comissionamento virtual?
A simulação de produção avalia as operações no nível de ordens e recursos (vazão, prazo de entrega, gargalos). O comissionamento virtual testa o software de controle de uma máquina no nível de sinais, contra um modelo do equipamento, antes que o equipamento físico seja construído [14].

### De quais dados um gêmeo digital de manufatura precisa?
Para um gêmeo de produção e de fábrica, você precisa principalmente de listas de materiais, roteiros com tempos, centros de trabalho e capacidades, turnos, ordens e apontamentos. Esses dados vêm sobretudo do ERP e do MES. Dados de máquinas e sensores melhoram o modelo, mas raramente são o ponto de partida.

### É possível construir um gêmeo digital a partir de dados do ERP?
Sim. Para questões de capacidade, prazo de entrega e programação, o sistema ERP é a fonte mais importante. Ele guarda dados de produto, processo e recursos de forma estruturada. Uma verificação da qualidade dos dados é essencial, porque os tempos-padrão e de preparação frequentemente divergem da realidade.

### Que tipo de simulação é usado na manufatura?
Principalmente a simulação de eventos discretos, cujo relógio avança de evento em evento. A dinâmica de sistemas é acrescentada para questões estratégicas, a simulação baseada em agentes para veículos e pessoas, e a simulação 3D baseada em física para células robotizadas e testes de controle.

### Quão preciso um gêmeo digital precisa ser?
Preciso o suficiente para a decisão que apoia, nem mais nem menos. Valide o modelo com dados reais para as métricas que importam (por exemplo, vazão ou prazo de entrega), documente as premissas e execute análises de sensibilidade. O NIST está trabalhando em um framework de verificação, validação e quantificação de incerteza para gêmeos de manufatura [48].

### Quais normas se aplicam a gêmeos digitais na manufatura?
As normas centrais são a ISO 23247 (estrutura de gêmeo digital para manufatura, Partes 1 a 6) [6][7][8], a ISO/IEC 30173 (terminologia) [9], a IEC 63278-1 (Asset Administration Shell) [10] e a ISA-95 / IEC 62264 [58]. Para segurança, use a ISA/IEC 62443 [59] e a NIST SP 800-82 [55]. A NIST AMS 400-2 mostra como aplicar a ISO 23247 [47]. Diretrizes alemãs (VDI 3633 para simulação, VDI/VDE 3693 para comissionamento virtual, VDI 4499 para a fábrica digital) acrescentam detalhes de método [13][14][16].

### Gêmeos digitais são adequados para pequenas e médias fabricantes?
Sim, desde que você comece com uma questão claramente delimitada. Um piloto para uma cadeia de valor ou uma área, baseado em dados de ERP já existentes, exige muito menos esforço do que um projeto de IoT em toda a planta e entrega um benefício verificável mais cedo. O relatório de casos de uso da NIST sobre a ISO 23247 tem exatamente esse público como alvo [47], e os centros NIST MEP oferecem apoio externo [60].

### Quanto custa um gêmeo digital?
Depende do escopo, da situação dos dados e do nível de integração. Os maiores itens de custo costumam ser preparação de dados, modelagem, validação e manutenção, e não o software. Uma empresa alemã de serviços de simulação oferece como regra prática no máximo 1% do investimento envolvido para estudos de simulação [30].

### Quanto tempo leva a implementação?
A McKinsey indica uma faixa de dois a três meses até mais de um ano para projetos de gêmeos, dependendo das capacidades da equipe e da complexidade da planta [26]. Um piloto focado em uma decisão concreta costuma ser possível em alguns meses.

### Como um gêmeo digital ajuda a planejar frotas de AGVs e AMRs?
Ele simula os veículos com viagens, deslocamentos vazios, tempos de espera, conflitos em cruzamentos e pausas para recarga. Assim, você determina o número de veículos, as rotas e a estratégia de recarga, algo que um cálculo estático frequentemente subestima.

### Qual é o papel da inteligência artificial?
A IA ajuda a preparar dados, acelera simulações por meio de modelos substitutos, aprende regras de controle dentro do modelo e torna os gêmeos utilizáveis por linguagem natural. Ela exige um modelo validado e dados limpos.

### O Azure Digital Twins é o mesmo que o digital twin builder do Fabric?
Não. A Microsoft afirma explicitamente que são serviços diferentes [21][23]. O Azure Digital Twins é um serviço PaaS para grafos de gêmeos com DTDL; o digital twin builder é uma ferramenta de ontologia e mapeamento no Microsoft Fabric e está em prévia no momento em que escrevemos [23].

### Quem inventou o gêmeo digital?
O conceito remonta a Michael Grieves, que o apresentou em 2002 no contexto da gestão do ciclo de vida de produtos; Grieves atribui o nome "gêmeo digital" a John Vickers, da NASA [1][2]. Outros autores apontam precursores anteriores, por exemplo em pesquisas sobre manufatura virtual [4].

## 20. Conclusão

O gêmeo digital na manufatura é menos uma tecnologia nova do que a combinação consistente de três blocos de construção já comprovados: um modelo estruturado de produtos, processos e recursos; uma simulação que captura a dinâmica e a variabilidade; e um fluxo de dados vindo da operação real. Os padrões existem, desde a ISO 23247 e a ISA-95 até o Asset Administration Shell, o NIST oferece orientação de implementação nos EUA, e o método de simulação de fábricas vem sendo testado há décadas.

O erro mais comum não é a tecnologia errada, mas a falta de um propósito. Comece por uma decisão que hoje se apoia com frequência excessiva na intuição ou em uma planilha: um investimento de capital, um novo mix de produtos, uma frota de AGVs, um cronograma semanal que muitas vezes não se sustenta. Verifique honestamente os dados do seu ERP, construa um modelo piloto validado e então decida qual nível de integração a próxima etapa justifica. É assim que se obtém um gêmeo que não apenas parece bom, mas melhora as decisões.

## Leitura complementar no m365.fm

**Posts de blog e episódios**

- [Gêmeo digital na manufatura: por onde começar](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/)
- [Do ERP ao chão de fábrica: o gêmeo digital](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Episódio: Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/)
- [Episódio: Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Páginas de entidades**

- [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Virtual Commissioning](https://www.m365.fm/entity/virtual-commissioning/) · [Automated Guided Vehicle](https://www.m365.fm/entity/automated-guided-vehicle/) · [Industry 4.0](https://www.m365.fm/entity/industry-4-0/)
- [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/)
- [iFAKT](https://www.m365.fm/entity/ifakt/) · [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) · [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/)

**Guias relacionados**

- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Production Scheduling Software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** é o apresentador do m365.fm e trabalha na iFAKT GmbH. No m365.fm, ele escreve sobre a digitalização da manufatura com Microsoft 365 e Azure, métodos de fluxo de valor, planejamento de produção e gêmeos digitais. Seu foco está em como derivar modelos confiáveis para planejamento e decisões de investimento a partir de dados existentes de ERP e de fluxo de valor.

**Nota: O autor trabalha na iFAKT GmbH.**

# Sources

All online sources accessed on November 20, 2026. Sources [1] to [46] are carried over from the German version; [47] to [61] are new US/English sources, each opened and verified for this version.

1. Grieves, M.; Vickers, J. (2017): Digital Twin: Mitigating Unpredictable, Undesirable Emergent Behavior in Complex Systems. In: Kahlen, F.-J.; Flumerfelt, S.; Alves, A. (eds.): Transdisciplinary Perspectives on Complex Systems. Springer, Cham. DOI: [10.1007/978-3-319-38756-7_4](https://doi.org/10.1007/978-3-319-38756-7_4)
2. Grieves, M.: Digital and Physical Twins (book chapter, provided in the ASME resource library). https://event.asme.org/Events/media/library/resources/digital-twin/Digital-and-Physical-Twins.pdf
3. Glaessgen, E. H.; Stargel, D. S. (2012): The Digital Twin Paradigm for Future NASA and U.S. Air Force Vehicles. 53rd AIAA/ASME/ASCE/AHS/ASC Structures, Structural Dynamics and Materials Conference, Honolulu, April 23–26, 2012. NASA Technical Reports Server 20120008178. https://ntrs.nasa.gov/citations/20120008178
4. Zhou, J.; Zhang, S.; Gu, M. (2022): Revisiting Digital Twins: Origins, Fundamentals and Practices. arXiv:2203.12867 (with reference to Shafto et al. 2010, NASA Modeling, Simulation, Information Technology & Processing Roadmap). https://arxiv.org/abs/2203.12867
5. Kritzinger, W.; Karner, M.; Traar, G.; Henjes, J.; Sihn, W. (2018): Digital Twin in manufacturing: A categorical literature review and classification. IFAC-PapersOnLine 51(11), pp. 1016–1022. DOI: [10.1016/j.ifacol.2018.08.474](https://doi.org/10.1016/j.ifacol.2018.08.474)
6. ISO 23247-1:2021 Automation systems and integration: Digital twin framework for manufacturing, Part 1: Overview and general principles (Parts 2 to 4 also 2021). Catalog entry: https://iteh.eu/catalog/standards/iso/7df6fef2-6487-43da-9a48-eaba332a9ffc/iso-23247-1-2021
7. ISO 23247-5 Automation systems and integration: Digital twin framework for manufacturing, Part 5: Digital thread for digital twin (Edition 1, 2026-06; status "under publication" when checked on November 20, 2026). https://www.iso.org/standard/87425.html
8. ISO 23247-6:2026 Automation systems and integration: Digital twin framework for manufacturing, Part 6: Digital twin composition (published July 14, 2026, stage 60.60). https://committee.iso.org/standard/87426.html
9. ISO/IEC 30173:2023 Digital twin: Concepts and terminology (November 2023). https://www.iso.org/standard/81442.html
10. IEC 63278-1:2023 Asset Administration Shell for industrial applications, Part 1: Asset Administration Shell structure (December 14, 2023). https://webstore.iec.ch/en/publication/65628
11. ZVEI (2020): User organization Industrial Digital Twin Association founded (founded September 24, 2020). https://www.zvei.org/en/press-media/pressarea/user-organization-industrial-digital-twin-association-founded
12. DIN SPEC 91345:2016-04 Reference Architecture Model Industrie 4.0 (RAMI4.0). https://www.dinmedia.de/de/technische-regel/din-spec-91345/250940128
13. VDI 3633 Part 1:2014-12 Simulation of systems in materials handling, logistics and production: Fundamentals. https://vdi.de/richtlinien/details/vdi-3633-blatt-1-simulation-of-systems-in-materials-handling-logistics-and-production-fundamentals ; VDI 3633 Part 8 (machine-oriented simulation, 3D motion and process simulation): https://www.vdi.de/mitgliedschaft/vdi-richtlinien/details/vdi-3633-blatt-8-simulation-of-systems-in-materials-handling-logistics-and-production-machine-oriented-simulation-3d-motion-and-process-simulation
14. VDI/VDE 3693 Part 1:2016-08 Virtual commissioning: Model types and glossary. https://vdi.de/richtlinien/details/vdivde-3693-blatt-1-virtual-commissioning-model-types-and-glossary
15. VDI/VDE 3693 Part 2:2018-12 Virtual commissioning: Introduction of virtual commissioning in companies; revision announced. https://vdi.de/en/home/vdi-standards/details/vdivde-3693-blatt-2-virtual-commissioning-introduction-of-virtual-commissioning-in-companies ; edition history: https://dinmedia.de/en/draft-technical-rule/vdi-vde-3693-blatt-2/276110751
16. VDI 4499 Part 1:2026-04 Digital factory: Fundamentals. https://vdi.de/richtlinien/details/vdi-4499-blatt-1-digital-factory-fundamentals
17. University of Duisburg-Essen, Chair VIP: lecture notes "Digitale Fabrik" (quotes the definition from VDI 4499 Part 1:2008; in German). https://www.uni-due.de/imperia/md/content/vip/scriptum_digitalefabrik.pdf
18. VDI 2510:2005-10 Automated guided vehicle systems (AGVS). https://vdi.de/richtlinien/details/vdi-2510-automated-guided-vehicle-systems-agvs ; draft VDI 2510:2025-07: https://www.dinmedia.de/de/technische-regel-entwurf/vdi-2510/388587666
19. OPC Foundation: OPC 10030 ISA-95 Common Object Model, section 4.2.3 ISA-95. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3
20. Schuh, G.; Anderl, R.; Dumitrescu, R.; Krüger, A.; ten Hompel, M. (2020): Industrie 4.0 Maturity Index. Managing the Digital Transformation of Companies. Update 2020 (acatech STUDY). https://en.acatech.de/publication/industrie-4-0-maturity-index-update-2020/
21. Microsoft Learn: What is Azure Digital Twins? https://learn.microsoft.com/azure/digital-twins/overview
22. Microsoft Learn: Learn about twin models and how to define them in Azure Digital Twins (DTDL v2 and v3). https://learn.microsoft.com/en-ca/azure/digital-twins/concepts-models
23. Microsoft Learn: What Is Digital Twin Builder (Preview)? (last updated May 20, 2026; preview label re-checked November 20, 2026). https://learn.microsoft.com/en-us/fabric/real-time-intelligence/digital-twin-builder/overview
24. Microsoft Fabric Blog: Digital twin builder in Microsoft Fabric Real-Time Intelligence. https://blog.fabric.microsoft.com/en-us/blog/digital-twin-builder-in-microsoft-fabric-real-time-intelligence-revolutionizing-digital-twin-creation-and-management
25. NVIDIA Blog (March 31, 2025): Industrial Ecosystem Adopts Mega NVIDIA Omniverse Blueprint to Train Physical AI in Digital Twins. https://blogs.nvidia.com/blog/mega-omniverse-blueprint-industrial-digital-twins/
26. Camarella, S.; Conway, M. P.; Goering, K.; Huntington, M. (2024): Digital twins: The next frontier of factory optimization. McKinsey & Company, January 10, 2024. https://www.mckinsey.com/capabilities/operations/our-insights/digital-twins-the-next-frontier-of-factory-optimization
27. Fraunhofer IWU (2024): Sächsische Maschinenbauer nutzen Vorteile der Virtuellen Inbetriebnahme oft noch nicht (press release on the SaxoVI study, August 13, 2024; in German). https://www.iwu.fraunhofer.de/content/dam/iwu/de/documents/Presse/2024-Saechsische-Maschinenbauer-nutzen-Vorteile-der-Virtuellen-Inbetriebnahme-oft-noch-nicht.pdf
28. Poll, D. (2021): Digitalisierung bei ZF: Neue Methode spart 30 Prozent Zeit. produktion.de, June 16, 2021 (in German). https://www.produktion.de/technik/digitalisierung-bei-zf-neue-methode-spart-30-prozent-zeit/1656151
29. Fraunhofer IESE: Digitaler Zwilling in der Produktion & Industrie 4.0 (in German). https://www.iese.fraunhofer.de/de/leistungen/digitaler-zwilling.html
30. SimPlan AG: FAQ Simulation (definition according to VDI 3633, cost-benefit rules of thumb). https://www.simplan.de/en/knowledge/faq-simulation-en
31. Türck, S.; Weimer, A.; Schubert, L.; Drees, J. (2014): Dynamische Simulation von Wertströmen [Dynamic simulation of value streams]. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 109(11), pp. 839–842. DOI: [10.3139/104.111242](https://doi.org/10.3139/104.111242)
32. Böhm, M.; Drees, J.; Sai, B.; Erlach, K.; Stambera, S.; Teriete, T. (2023): Universelle Datenschnittstelle für digitale Wertstromdienste [Universal data interface for digital value stream services]. ZWF 118(5), pp. 293–297. DOI: [10.1515/zwf-2023-1062](https://doi.org/10.1515/zwf-2023-1062)
33. iFAKT GmbH: Polaris Designer (product page). https://www.ifakt.de/en/solutions/designer
34. iFAKT GmbH: Polaris Simulator (product page). https://www.ifakt.de/en/solutions/simulator
35. iFAKT GmbH: home page (company and Polaris platform). https://www.ifakt.de/
36. European Commission: Cyber Resilience Act, summary (Regulation (EU) 2024/2847). https://digital-strategy.ec.europa.eu/en/policies/cra-summary
37. Little, J. D. C. (1961): A Proof for the Queuing Formula: L = λW. Operations Research 9(3), pp. 383–387. DOI: [10.1287/opre.9.3.383](https://doi.org/10.1287/opre.9.3.383)
38. Forrester, J. W. (1961): Industrial Dynamics. MIT Press, Cambridge, MA.
39. Goldratt, E. M.; Cox, J. (1984): The Goal: A Process of Ongoing Improvement. North River Press.
40. Rother, M.; Shook, J. (1998): Learning to See: Value Stream Mapping to Add Value and Eliminate Muda. Lean Enterprise Institute, Brookline, MA.
41. Law, A. M. (2015): Simulation Modeling and Analysis. 5th ed., McGraw-Hill Education, New York.
42. SYMESTIC: Was ist ISA-95? (level model, relation to IEC 62264; in German). https://www.symestic.com/de-de/was-ist/isa-95
43. Umbrex: ISO 23247 Digital Twin Framework for Manufacturing (overview of parts and reference architecture). https://umbrex.com/resources/frameworks/manufacturing-industrial-equipment-frameworks/iso-23247-digital-twin-framework-for-manufacturing/
44. NEURONwriter: analysis "digitaler zwilling fertigung", google.de, query f5135b90c13e4c59 (internal analysis for the German version, accessed November 20, 2026).
45. NEURONwriter: analysis "produktionssimulation", google.de, query 3ee168d2a2cb38f1 (internal analysis for the German version, accessed November 20, 2026).
46. Kingman, J. F. C. (1961): The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57(4), pp. 902 ff. DOI: [10.1017/S0305004100036094](https://doi.org/10.1017/S0305004100036094)
47. Shao, G. (2021): Use Case Scenarios for Digital Twin Implementation Based on ISO 23247. NIST Advanced Manufacturing Series (NIST AMS) 400-2, May 4, 2021. DOI: [10.6028/NIST.AMS.400-2](https://doi.org/10.6028/NIST.AMS.400-2); publication page: https://www.nist.gov/publications/use-case-scenarios-digital-twin-implementation-based-iso-23247
48. NIST: Digital Twins for Advanced Manufacturing (project page; ISO 23247 Part 5 reference implementation, proposed VVUQ framework as Part 7, MTConnect interface, NIST Digital Twin Testbed). https://nist.gov/programs-projects/digital-twins-advanced-manufacturing
49. Voas, J.; Mell, P.; Laplante, P.; Piroumian, V. (2025): Security and Trust Considerations for Digital Twin Technology. NIST IR 8356 (final), February 14, 2025 (initial public draft 2021 titled "Considerations for Digital Twin Technology and Emerging Standards"). DOI: [10.6028/NIST.IR.8356](https://doi.org/10.6028/NIST.IR.8356); https://csrc.nist.gov/pubs/ir/8356/final
50. National Academies of Sciences, Engineering, and Medicine (2024): Foundational Research Gaps and Future Directions for Digital Twins. Consensus Study Report, The National Academies Press, Washington, DC (definition and quotes on p. 22). https://www.nationalacademies.org/our-work/foundational-research-gaps-and-future-directions-for-digital-twins ; chapter: https://www.nationalacademies.org/read/26894/chapter/4
51. Digital Twin Consortium (2020): Digital Twin Consortium Defines Digital Twin (definition released December 3, 2020). https://www.digitaltwinconsortium.org/2020/12/digital-twin-consortium-defines-digital-twin ; current definition page: https://www.digitaltwinconsortium.org/initiatives/the-definition-of-a-digital-twin/
52. IBM: What Is a Digital Twin? (component, asset, system and process twins). https://www.ibm.com/think/topics/what-is-a-digital-twin
53. ANSI/ITSDF B56.5-2024: Safety Standard for Guided Industrial Vehicles. ANSI Blog summary: https://blog.ansi.org/ansi/ansi-itsdf-b56-5-2024-guided-industrial-vehicles/
54. ANSI/A3 R15.08-1-2020 (R2026): Industrial Mobile Robots, Safety Requirements, Part 1: Requirements for the Industrial Mobile Robot (reaffirmed 2026, no technical changes). ANSI Webstore: https://webstore.ansi.org/standards/ria/ansia3r15082020r2026
55. Stouffer, K. et al. (2023): Guide to Operational Technology (OT) Security. NIST SP 800-82 Rev. 3, September 28, 2023. DOI: [10.6028/NIST.SP.800-82r3](https://doi.org/10.6028/NIST.SP.800-82r3); https://csrc.nist.gov/pubs/sp/800/82/r3/final
56. Deloitte (2025): 2025 Smart Manufacturing and Operations Survey, press release May 1, 2025 (600 executives, US manufacturers with $500 million+ revenue, survey August–September 2024). https://www.deloitte.com/us/en/about/press-room/deloitte-2025-smart-manufacturing-survey.html
57. MTConnect Institute: MTConnect Standard, ANSI/MTC1.4-2018, Part 1.0 Overview and Fundamentals, Version 1.4.0. https://docs.mtconnect.org/ANSI_MTC1_4-2018.pdf ; about MTConnect: https://www.mtconnect.org/about
58. International Society of Automation (ISA): ISA-95 Standard: Enterprise-Control System Integration (ANSI/ISA-95, IEC 62264). https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
59. International Society of Automation (ISA): ISA/IEC 62443 Series of Standards. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
60. NIST: Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep
61. Federal Trade Commission: Guides Concerning the Use of Endorsements and Testimonials in Advertising, 16 CFR Part 255, § 255.5 (disclosure of material connections, including an employee example); FTC notice on the revised Guides. https://www.ftc.gov/system/files/ftc_gov/pdf/P204500%20Guides%20Concerning%20Endors%20and%20Testimonials.pdf
