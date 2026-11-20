# SEO metadata

| Field | Value |
|---|---|
| Meta title | Planejamento de Produção Aeroespacial: Guia Completo para Fornecedores |
| Meta description | Planejamento de produção aeroespacial explicado: AS9100, FAA Parte 21/145, rastreabilidade, curvas de aprendizado, rampa de taxa, APS e planejamento MRO, com exemplos. |
| Slug | `aerospace-production-planning` |

# Planejamento de Produção Aeroespacial: Guia Completo para Fornecedores e Oficinas MRO

*Em 20 de novembro de 2026 · Com base em dados do setor e das empresas, nas normas IAQG/SAE, nas regulamentações da FAA e da EASA e na literatura técnica (ver Fontes)*

> **Resposta curta:** O planejamento da produção aeroespacial consiste em equilibrar as taxas exigidas pelos clientes com uma capacidade finita, prazos de entrega longos, processos especiais certificados e rastreabilidade completa. Diferentemente de setores de alto volume, não basta cumprir a data. É preciso também comprovar como a peça foi fabricada: cada peça precisa de uma origem documentada, de uma configuração liberada e de um processo controlado, e essas evidências têm de ser planejadas da mesma forma que as horas de máquina.

Terça-feira de manhã, em um fornecedor de Tier 2 de peças estruturais. O cliente elevou as liberações do próximo trimestre em um quinto, porque o fabricante de aeronaves está aumentando sua taxa de produção. As células de usinagem de cinco eixos já operam em três turnos. O tratamento térmico é enviado a um processador terceirizado acreditado pela Nadcap, com prazo de três semanas. Acaba de chegar uma alteração de engenharia para duas numerações de peça, o que dispara uma inspeção parcial do primeiro artigo. E, desde ontem, o departamento de qualidade procura o certificado de material de um lote de titânio, porque um cliente tem uma dúvida sobre um lote que já foi embarcado.

Cada uma dessas tarefas pode ser resolvida isoladamente. A dificuldade é que todas caem no mesmo plano, ao mesmo tempo. É isso que diferencia o planejamento da produção aeroespacial do planejamento em muitos outros setores: ele planeja não apenas quantidades e datas, mas também evidências, aprovações e configurações. E faz isso em um mercado no qual as carteiras de pedidos dos fabricantes de aeronaves estão cheias por anos, enquanto a cadeia de suprimentos está travada em vários pontos ao mesmo tempo.

Este guia foi escrito para gerentes de fábrica, gerentes de planejamento e programação e gerentes de qualidade de fornecedores aeroespaciais, e para planejadores de oficinas de manutenção, reparo e revisão (MRO) e de estações de reparo. Leitores que buscam programação da produção aeroespacial encontrarão o lado da programação (capacidade finita, APS, controle de gargalos) nas Seções 5, 10 e 11. O guia aborda a situação do mercado em 2026 com números referenciados, o que torna o setor diferente, as normas e regulamentações relevantes dos dois lados do Atlântico (FAA e EASA), rastreabilidade e genealogia, curvas de aprendizado de Wright com um exemplo trabalhado, como planejar uma rampa de aumento de taxa, planejamento de capacidade com APS e simulação, planejamento de MRO com achados não planejados, KPIs, uma abordagem passo a passo e erros típicos. Uma breve introdução à relação entre prazo de entrega e rastreabilidade também está disponível no post [Planejamento da produção aeroespacial: prazo de entrega e rastreabilidade](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/) no m365.fm.

Uma nota sobre o contexto europeu: a versão original deste guia foi escrita para fornecedores alemães, e grande parte da cadeia de suprimentos global da Airbus passa pela Europa. Quando as regras europeias (EASA, normas EN) são relevantes para empresas dos EUA, por exemplo ao fornecer a clientes europeus ou ao manter aprovações duplas FAA/EASA, este guia as explica ao lado de suas equivalentes norte-americanas.

### Principais conclusões

- **A demanda existe, a capacidade não.** A Airbus tinha uma carteira de 9.310 aeronaves comerciais no fim de setembro de 2026 [3]; a Boeing informou uma carteira comercial de mais de 6.300 aviões na mesma data [47]. As taxas de produção estão subindo mais lentamente do que o planejado porque faltam motores, fundidos e forjados, matéria-prima e mão de obra qualificada [4][10].
- **Planejar aqui significa planejar sob um ônus de comprovação.** A AS9100D exige, entre outros itens, gestão de configuração, rastreabilidade e prevenção de peças falsificadas [14][44]. Os titulares de aprovação de produção da FAA precisam manter um sistema de qualidade que abranja controle de fornecedores, registros de qualidade e escapes de qualidade [41]. Cada mudança de projeto pode acionar uma inspeção completa ou parcial do primeiro artigo, conforme a AS9102 [18][46].
- **O lead time é, na maior parte, tempo de espera.** A Lei de Little diz: lead time = trabalho em processo ÷ vazão [27]. Fora dos processos especiais, os laços de inspeção e as aprovações são fontes típicas de espera.
- **As curvas de aprendizado são insumos de planejamento.** Wright demonstrou em 1936 que as horas de mão de obra por avião caíam cerca de 20 % sempre que a produção acumulada dobrava [24][25]. Se você planeja um lançamento com horas-padrão de taxa madura, planeja capacidade insuficiente.
- **Uma rampa de produção falha no gargalo, não na média.** Um aumento de 20 % na taxa atinge com muito mais força um recurso operando a 85 % de utilização do que a capacidade total sugere.
- **O planejamento de MRO precisa contar com o desconhecido.** O escopo de uma visita à oficina só é conhecido após a inspeção. Um bom planejamento de MRO trabalha com probabilidades de achados, folgas e disponibilidade de peças.
- **Nenhum algoritmo corrige dados mestres ruins.** APS, simulação e gêmeos digitais exigem roteiros, tempos-padrão, capacidades e dados de certificação corretos.

### Caminhos de leitura rápida

| Você é … | Leia primeiro |
|---|---|
| Gerente de fábrica de um fornecedor diante de um aumento de taxa | Seções 1, 9 e 10 (mercado, curva de aprendizado, rampa de produção com checklist) |
| Planejador de produção ou programador com planos de ERP irreais | Seções 5, 6 e 11 (níveis de planejamento, lead time, APS e simulação) |
| Gerente de qualidade | Seções 3, 4 e 8 (normas e regulamentações, rastreabilidade, mudanças de engenharia) |
| Planejador de MRO em uma estação de reparo | Seções 3, 4 e 13 (Part 145, peças de vida limitada, planejamento de MRO) |
| Líder de TI, digital ou de cibersegurança | Seções 3.6, 4, 11, 14 e 16 (ITAR/CMMC, modelo de dados, APS, gêmeo digital, abordagem) |

## Índice

1. [O mercado de 2026: por que o planejamento se tornou o gargalo](#1-o-mercado-de-2026-por-que-o-planejamento-se-tornou-o-gargalo)
2. [O que torna o planejamento da produção aeroespacial diferente de outros setores](#2-o-que-torna-o-planejamento-de-produção-aeroespacial-diferente-de-outras-indústrias)
3. [Normas e regulamentações que importam para o planejamento](#3-normas-e-regulamentos-que-importam-para-o-planejamento)
4. [Rastreabilidade e genealogia](#4-rastreabilidade-e-genealogia)
5. [Níveis de planejamento: da taxa do cliente à operação](#5-níveis-de-planejamento-da-taxa-do-cliente-à-operação)
6. [Entendendo e reduzindo o lead time](#6-entendendo-e-reduzindo-o-lead-time)
7. [Planejamento de processos especiais e operações terceirizadas](#7-planejamento-de-processos-especiais-e-operações-externas)
8. [Mudanças de engenharia e gestão de configuração](#8-mudanças-de-engenharia-e-gestão-de-configuração)
9. [Curvas de aprendizado de Wright: teoria e exemplo prático](#9-curvas-de-aprendizado-de-wright-teoria-e-exemplo-prático)
10. [Planejamento de uma rampa de taxa: cálculo e checklist](#10-planejamento-de-uma-rampa-de-taxa-cálculo-e-checklist)
11. [Planejamento de capacidade com APS, gestão de gargalos e simulação](#11-planejamento-de-capacidade-com-aps-gestão-de-gargalos-e-simulação)
12. [Riscos da cadeia de suprimentos de 2022 a 2026 e o que significam para o planejamento](#12-riscos-na-cadeia-de-suprimentos-de-2022-a-2026-e-o-que-significam-para-o-planejamento)
13. [Planejamento de MRO: manutenção com achados não planejados](#13-planejamento-de-mro-manutenção-com-achados-não-planejados)
14. [Gêmeo digital e fio digital](#14-gêmeo-digital-e-fio-digital)
15. [KPIs para planejamento e controle](#15-kpis-para-planejamento-e-controle)
16. [Abordagem: seis passos para um plano confiável](#16-abordagem-seis-passos-para-um-plano-confiável)
17. [Erros comuns e como evitá-los](#17-erros-comuns-e-como-evitá-los)
18. [iFAKT e o setor aeroespacial](#18-ifakt-e-aeroespacial)
19. [Glossário](#19-glossário)
20. [FAQ: perguntas frequentes sobre planejamento da produção aeroespacial](#20-faq-perguntas-frequentes-sobre-planejamento-da-produção-aeroespacial)
21. [Conclusão](#21-conclusão)

## 1. O mercado de 2026: por que o planejamento se tornou o gargalo

### 1.1 Demanda recorde, capacidade de entrega limitada

A aviação comercial vive uma situação incomum: a demanda por novas aeronaves nunca foi tão alta, mas a indústria não consegue entregar no ritmo que os clientes desejam. Segundo um estudo que a associação de companhias aéreas IATA apresentou com a Oliver Wyman em outubro de 2025, a carteira global de aeronaves comerciais atingiu um recorde de mais de 17.000 aeronaves em 2024. Entre 2010 e 2019, a média havia sido de cerca de 13.000 [9]. O estudo estima que os atrasos nas entregas custaram às companhias aéreas mais de US$ 11 bilhões em 2025. Os itens de maior peso são o consumo excessivo de combustível de aeronaves mais antigas (cerca de US$ 4,2 bilhões), a manutenção adicional (US$ 3,1 bilhões), o arrendamento de motores (US$ 2,6 bilhões) e o aumento dos estoques de peças de reposição (US$ 1,4 bilhão) [9].

Os números dos dois grandes fabricantes mostram o quadro em detalhes:

| Métrica | Airbus | Boeing |
|---|---|---|
| Entregas em 2025 | 793 aeronaves comerciais, das quais 607 da família A320 [2] | 600 aviões comerciais, dos quais 447 Boeing 737 [6] |
| Carteira de pedidos | 8.754 no fim de 2025 [2]; 9.310 no fim de setembro de 2026 [3] | mais de 6.100 no fim de 2025, avaliada em cerca de US$ 567 bilhões [6]; mais de 6.300 no fim de setembro de 2026, avaliada em US$ 611,8 bilhões [47] |
| Meta de 2026 | cerca de 870 entregas [3] | nenhuma previsão de unidades nas fontes citadas |
| Situação em 2026 | 547 entregas até 30 de setembro [3]; 621 até o fim de outubro [5] | 161 entregas no 3º trimestre de 2026, das quais 124 Boeing 737 [47]; programa 737 ainda avançando rumo à produção estabilizada de 47 por mês; 787 estável em 8 por mês [47] |

### 1.2 Metas de taxa e por que continuam mudando

Para os fornecedores, a taxa mensal do fabricante da aeronave é o insumo de planejamento mais importante, pois determina as liberações em todos os níveis da cadeia de suprimentos. No relatório dos primeiros nove meses de 2026, a Airbus apresenta estas metas: 70 a 75 aeronaves da família A320 por mês até o fim de 2027, estabilizando depois na taxa 75; taxa 12 para o A350 em 2028; taxa 13 para o A220 em 2028; e taxa 5 para o A330 em 2029 [3].

A história da meta de "taxa 75" mostra como esse tipo de premissa é volátil. A Airbus originalmente queria atingir essa taxa entre 2025 e 2026. No fim de 2024, a meta passou para 2027 [4]. Em abril de 2026, o CEO da Airbus, Guillaume Faury, responsabilizou publicamente a Pratt & Whitney por não entregar a quantidade de motores encomendada e falou em faltas que não correspondiam nem à demanda nem aos pedidos [4]. A mídia especializada considera possível um adiamento da taxa 75 para 2028 [4]. A faixa-alvo de 70 a 75 até o fim de 2027 reflete a situação em 28 de outubro de 2026 [3].

Na Boeing, a FAA limitou a produção do 737 MAX a 38 aviões por mês após a perda da tampa de porta em um voo da Alaska Airlines em janeiro de 2024. Em outubro de 2025, a FAA aprovou um aumento para 42 [7]. Em maio de 2026, o CEO da Boeing, Kelly Ortberg, disse que a linha já operava na taxa 47; ele descreveu um novo passo para 52 como um esforço maior devido aos níveis de estoque na cadeia de suprimentos [8]. O comunicado do terceiro trimestre da Boeing, de 27 de outubro de 2026, descreve o programa 737 como ainda em progresso rumo à produção estabilizada de 47 por mês [47].

**O que isso significa para o seu planejamento:** As metas de taxa de produção não são compromissos. São premissas de planejamento com incerteza significativa. Um fornecedor que constrói capacidade estritamente com base na meta oficial corre o risco de custos de ociosidade. Um fornecedor que investe tarde demais torna-se ele próprio o gargalo, em um setor no qual uma única peça faltante paralisa um avião inteiro. Um planejamento robusto, portanto, trabalha com cenários (por exemplo, taxas 60, 67 e 75) e com gatilhos de investimento definidos antecipadamente.

### 1.3 A indústria em números: Estados Unidos e Alemanha

A indústria aeroespacial e de defesa dos Estados Unidos é a maior do mundo. De acordo com a Aerospace Industries Association (AIA) e a S&P Global Market Intelligence, o setor registrou vendas totais de US$ 988,6 bilhões em 2025 (a AIA estima a atividade empresarial total em US$ 1 trilhão) e sustentou cerca de 2,1 milhões de empregos. Cerca de 1,1 milhão desses empregos e quase US$ 483 bilhões em atividade estão na cadeia de suprimentos doméstica. As exportações atingiram US$ 172,7 bilhões, um aumento de 25% em relação ao ano anterior [48]. Em outras palavras, aproximadamente metade dos empregos está com fornecedores, exatamente o grupo para o qual este guia foi escrito.

A Alemanha é uma parte menor, mas importante, da cadeia de suprimentos da Airbus e o mercado de origem da versão original deste guia. A Associação Alemã da Indústria Aeroespacial (BDLI) divulgou números recordes em maio de 2026: EUR 62 bilhões em receita em 2025 (2024: EUR 52 bilhões, alta de 19%) e 130.000 funcionários (ano anterior: 120.000). A aviação civil é o maior segmento, com receita de EUR 45 bilhões (alta de 15%), seguida pela aviação militar, com EUR 13,5 bilhões (alta de 35%), e pelo espaço, com EUR 3,5 bilhões. A participação das exportações foi de 66%, e os gastos com pesquisa e desenvolvimento foram de cerca de EUR 4 bilhões [1].

Por trás desses números, dos dois lados do Atlântico, estão muitos fornecedores pequenos e médios que atuam ao lado dos OEMs e dos grandes integradores de sistemas. Eles fabricam componentes estruturais, componentes de cabine, peças de motores, sistemas e processos especiais, ou prestam serviços de manutenção. Para essas empresas em particular, a passagem da subutilização (2020 a 2022) para uma sobrecarga sustentada é um desafio de planejamento.

### 1.4 A visão do fornecedor: o que mostram as pesquisas

A consultoria Roland Berger pesquisou 95 empresas da cadeia de suprimentos aeroespacial no início de 2026 [10]. Os resultados são reveladores para quem é responsável pelo planejamento:

- 55% das empresas relatam interrupções na cadeia de suprimentos (2025: 64%).
- Cerca de 80% percebem um risco médio a alto de escassez de matérias-primas críticas; titânio, aço, cobre, terras raras e ímãs são os mais citados.
- 56% relatam falta de pessoal qualificado (ano anterior: 65%). Isso continua sendo o freio mais comum à aceleração da produção.
- Quase 40% não têm capacidade produtiva suficiente.
- Cerca de um terço opera com margem EBIT abaixo de 5%, e 40% acumularam estoques maiores para o início da produção, o que pressiona ainda mais as margens.
- Os longos prazos de entrega afetam não apenas o material, mas também serviços como testes, tratamentos de superfície e acabamento.

Uma pesquisa anterior aponta na mesma direção sob a ótica do planejamento. Em uma avaliação de prontidão para aumento de taxa de produção com mais de 100 fornecedores na Ásia, Europa e EUA, a consultoria Vendigital constatou que 38 % tinham processos inadequados de planejamento de capacidade. Ela apontou como causas a escassez de competências, o estado desconhecido de instalações e máquinas, programas de manutenção negligenciados e a comunicação deficiente entre planejadores seniores e o chão de fábrica [55]. O artigo não mostra data de publicação; ele se refere ao plano da Airbus de 2021 para atingir a taxa 75 até 2025, portanto os dados têm vários anos.

O último ponto da lista da Roland Berger é central para o planejamento: processos especiais e inspeções tornaram-se, em muitas cadeias de suprimentos, gargalos por si mesmos. A seção 7 trata de como lidar com isso.

## 2. O que torna o planejamento de produção aeroespacial diferente de outras indústrias

Muitos princípios de planejamento valem para qualquer manufatura discreta. A indústria aeroespacial, no entanto, combina várias características que são conhecidas isoladamente, mas que, juntas, exigem uma lógica de planejamento própria.

### 2.1 Alto mix, baixo volume e muitas variantes

Um fornecedor aeroespacial normalmente fabrica muitos números de peça em pequenas quantidades. Mesmo a uma taxa de 75 aeronaves por mês, isso representa cerca de 3,5 aeronaves por dia útil (com cerca de 21 dias úteis por mês). Uma peça instalada uma vez por aeronave tem, portanto, uma quantidade diária na casa de um dígito. Some-se a isso variantes específicas de cada cliente (configuração de cabine), demanda de peças de reposição e peças para modelos mais antigos. O resultado é um ambiente de alto mix e baixo volume (HMLV), no qual preparações de máquina, trocas de programa e esforço de inspeção consomem uma parcela grande da capacidade.

### 2.2 Longos lead times e estruturas de materiais profundas

Uma peça estrutural de titânio pode levar muitas semanas entre a matéria-prima e a expedição: forjamento ou fundição, usinagem de desbaste, tratamento térmico, usinagem de acabamento, ensaios não destrutivos (END), tratamento de superfície, inspeção final. Várias dessas etapas costumam ocorrer com especialistas terceirizados. As estruturas de materiais de grandes conjuntos são profundamente aninhadas; uma aeronave é composta de milhões de peças que se reúnem em muitos níveis de fornecimento. A consequência: um atraso em um nível inferior costuma aparecer semanas depois na linha de montagem final. Se você não entende e não gerencia ativamente o [lead time](https://www.m365.fm/entity/lead-time/), está planejando com folgas que não conhece.

### 2.3 Certificação, qualificação e evidências

Na indústria aeroespacial, não basta fabricar uma peça conforme a cota. Ela precisa ser feita com um processo liberado, em equipamentos qualificados, por pessoas qualificadas, a partir de material certificado e na configuração liberada, e tudo isso precisa ser documentado. Isso tem consequências diretas para o planejamento: uma ordem não pode simplesmente ser transferida para uma máquina que está livre, mas não qualificada. Um colaborador sem qualificação válida para um processo especial não é capacidade do ponto de vista do planejamento. A troca de fornecedor pode exigir uma nova inspeção de primeiro artigo.

### 2.4 Lógica de taxa em vez de lógica de lote

Os fabricantes de aeronaves planejam em taxas mensais que são anunciadas com anos de antecedência e aumentadas gradualmente. Um fornecedor precisa traduzir essa taxa em seus próprios lotes de produção sem perder a cadência do cliente. Ao mesmo tempo, os degraus de taxa raramente são suaves: o cliente constrói estoque, adia liberações ou as antecipa. Um bom planejamento, portanto, separa a taxa do cliente (o que ele precisa no longo prazo) das liberações (o que ele pede no curto prazo) e acompanha a diferença entre as duas.

### 2.5 Ciclos de vida longos de produtos

Um tipo de aeronave costuma ser fabricado por décadas e operado por ainda mais tempo. Isso significa que revisões de desenho, especificações de material e aprovações de processo permanecem válidas por muito tempo, mas continuam mudando. Peças de reposição para configurações antigas precisam continuar disponíveis. E os registros precisam ser mantidos por períodos muito longos. Pelas regras da FAA, o titular de aprovação de produção deve manter registros de qualidade por pelo menos 5 anos para produtos e artigos fabricados sob a aprovação e por pelo menos 10 anos para componentes críticos [41]; os requisitos dos clientes frequentemente vão além. Na prática, os prazos de retenção decorrem de exigências contratuais repassadas pelos clientes e dos regulamentos aplicáveis.

### 2.6 O alto custo de um erro

Um componente defeituoso que chega ao cliente (um escape) pode desencadear retrabalho na linha de montagem final, inspeções em aeronaves já entregues ou, em casos extremos, o aterramento de frotas. A FAA trata isso como um tema próprio do sistema de qualidade: o 14 CFR 21.137 lista os "quality escapes" como um dos elementos obrigatórios do sistema de qualidade de um titular de aprovação de produção [41]. O motor Pratt & Whitney GTF mostra o que um defeito de material pode provocar (Seção 12). Para o planejamento, isso significa: inspeções de qualidade não são uma margem que se possa cortar quando o cronograma aperta. Elas são partes fixas do roteiro de fabricação.

## 3. Normas e regulamentos que importam para o planejamento

### 3.1 Visão geral da família de normas IAQG

O International Aerospace Quality Group (IAQG) desenvolve as normas de qualidade do setor. Elas são publicadas nas Américas como normas AS (pela SAE International), na Europa como normas EN e na Ásia como normas JISQ; o conteúdo é idêntico. A norma central é a 9100, complementada por normas para organizações de manutenção (9110), distribuidores (9120), inspeção de primeiro artigo (9102), gestão de variação de características-chave (9103) e outras [13]. Nos EUA, você encontrará principalmente as designações AS (AS9100D, AS9102C, AS9145); clientes e documentos europeus usam EN 9100 e assim por diante. Elas se referem aos mesmos requisitos.

No lado regulatório, dois sistemas são relevantes para a maioria dos fornecedores: a Federal Aviation Administration (FAA) dos EUA, cujas regras estão no Título 14 do Code of Federal Regulations (14 CFR), e a European Union Aviation Safety Agency (EASA). De forma confusa, ambas têm uma "Part 21" e uma "Part 145", e em ambos os sistemas a Subparte G da Part 21 trata das aprovações de produção. O conteúdo tem finalidade semelhante, mas não é idêntico.

A tabela a seguir resume o que você precisa saber como gestor de planejamento:

| Norma / regulamentação | Conteúdo | Impacto no planejamento |
|---|---|---|
| **AS9100D** (EN 9100:2018, JISQ 9100:2016) | Sistema de gestão da qualidade para aviação, espaço e defesa; inclui a ISO 9001:2015 mais cerca de 105 requisitos adicionais específicos do setor, incluindo gestão de configuração, gestão de riscos, segurança do produto, prevenção de peças falsificadas, rastreabilidade e entrega no prazo [14][44] | A entrega no prazo passa a ser um indicador auditado; a rastreabilidade de material, processos, ferramentas e pessoas deve acompanhar o fluxo da ordem [14] |
| **AS9102C** (2023; EN 9102:2024) | Inspeção do primeiro artigo (FAI): verificação completa da primeira peça do processo produtivo contra todas as características de projeto [17][18][46] | Planejar o esforço de FAI como uma operação própria; alterações de projeto, material, fonte, processo, ferramental ou local, e uma parada de produção superior a dois anos, acionam uma FAI completa ou parcial [18][34] |
| **AS9103 / EN 9103:2023** | Gestão de variação de características-chave [19] | Características-chave exigem estudos de capabilidade de processo e gráficos de controle; isso consome capacidade de inspeção e afeta tamanhos de lote e frequência de inspeção |
| **AS9145** (2016; EN 9145:2018) | Planejamento Avançado da Qualidade do Produto (APQP) e Processo de Aprovação de Peças de Produção (PPAP) para o setor aeroespacial, em cinco fases, do planejamento à produção contínua [16][35][45] | A prontidão para produção deve ser demonstrada na cadência do cliente (revisão de prontidão para produção, execuções na cadência); o planejamento do lançamento e a comprovação de capacidade passam a fazer parte da aprovação [35] |
| **AS9110 / EN 9110:2018** | Sistema de gestão da qualidade para organizações de manutenção aeronáutica [20] | Acrescenta requisitos do sistema da qualidade para a Parte 145; relevante para processos de planejamento, controle de fornecedores e indicadores de desempenho em MRO |
| **AS9120 / EN 9120** | Sistema de gestão da qualidade para distribuidores e estoquistas [13][14] | Rastreabilidade e cadeia de certificados para peças padronizadas e matéria-prima compradas |
| **Nadcap** | Programa de acreditação gerido pela indústria para processos especiais, fundado em 1990 sob a SAE e administrado pelo Performance Review Institute (PRI); as áreas incluem tratamento térmico, processamento químico, END, soldagem, revestimentos e compósitos [21][54] | Muitos clientes permitem que apenas oficinas acreditadas executem processos especiais; isso limita a escolha de fontes e frequentemente torna os processos especiais o gargalo |
| **FAA 14 CFR Parte 21, Subparte G** (certificado de produção); também Subparte K (Aprovação de Fabricante de Peças, PMA) e Subparte O (autorização TSO) | Aprovações de produção; a 14 CFR 21.137 exige um sistema da qualidade por escrito com 14 elementos, incluindo controle de dados de projeto, controle de fornecedores, controle do processo de fabricação, controle de produto não conforme, registros da qualidade e escapes da qualidade [41] | O titular da aprovação controla seus fornecedores; os registros devem ser mantidos por no mínimo 5 anos (10 anos para componentes críticos) [41]. A maioria dos fornecedores de Nível 2 e Nível 3 não possui aprovação de produção própria, mas trabalha sob o controle de fornecedores de seu cliente |
| **FAA 14 CFR Parte 145** | Certificado de estação de reparo; trabalho apenas dentro das habilitações e especificações operacionais, com dados de manutenção atualizados, programa de treinamento aprovado pela FAA e registros mantidos por no mínimo 2 anos [42] | O planejamento só pode atribuir trabalhos para os quais a estação é habilitada, a pessoal treinado, com manuais e dados atualizados disponíveis |
| **EASA Parte 21, Subparte G** | Aprovação de Organização de Produção (POA) na UE [22] | O titular da aprovação libera peças com um EASA Form 1 e supervisiona seus fornecedores; processos e pessoal devem corresponder à aprovação. Relevante para fornecedores dos EUA com clientes europeus |
| **EASA Parte 145** | Aprovação de organização de manutenção (Anexo II do Regulamento (UE) nº 1321/2014) [23] | Trabalho apenas dentro do escopo aprovado (habilitação), com pessoal certificador e dados de manutenção válidos. Uma instalação que possua aprovações da FAA e da EASA pode emitir uma liberação dupla no FAA Form 8130-3 [43] |
| **EASA Part-CAMO** | Organização de gestão da aeronavegabilidade continuada, introduzida pelo Regulamento (UE) 2019/1383 [23] | Planeja o programa de manutenção, as diretrizes de aeronavegabilidade e as peças de vida limitada na Europa e repassa os pacotes de trabalho ao MRO |
| **ITAR / EAR** (EUA) | Controles de exportação para artigos de defesa (ITAR, 22 CFR 120–130) e itens de uso dual (EAR, 15 CFR 730–774) [36] | O acesso a dados técnicos e peças pode ser restringido por pessoa e local; isso também se aplica a sistemas de planejamento e de TI |
| **DFARS / CMMC 2.0** (programas de defesa dos EUA) | Cybersecurity Maturity Model Certification; cláusula DFARS 252.204-7021 em vigor desde 10 de novembro de 2025, implantada em três anos; regra do programa 32 CFR Parte 170 [49][50] | Fornecedores que processam informações de contratos federais (FCI) ou informações controladas não classificadas (CUI) em seus sistemas de planejamento, ERP ou MES precisam do nível CMMC exigido; os contratantes principais devem verificar a situação CMMC de um subcontratado antes da adjudicação [49] |
| **DFARS 252.225-7009** (metais especiais) | Metais especiais, incluindo titânio e ligas de titânio, em itens entregues sob contratos do DoD devem ser fundidos ou produzidos nos EUA ou em um país qualificado; a exigência se estende aos subcontratos para itens que contenham metais especiais [51] | O planejamento de materiais deve rastrear a origem da fusão por lote de corrida, e não apenas a liga e a quantidade; um lote mais barato ou mais rápido de uma fonte não qualificada pode não ser utilizável |

### 3.2 AS9100 em detalhes: o que a norma significa para o planejamento

A AS9100D adota a estrutura da ISO 9001 e acrescenta requisitos que atingem diretamente o planejamento [44]. Três deles são especialmente importantes.

**Gestão de configuração.** Você precisa saber, a qualquer momento, qual revisão de projeto se aplica a cada ordem e qual revisão foi efetivamente fabricada. Isso afeta a liberação de ordens (liberar somente revisões válidas), o tratamento de ordens em aberto quando ocorrem mudanças e a documentação de desvios.

**Rastreabilidade.** A norma exige a rastreabilidade de todas as matérias-primas, materiais e processos utilizados, bem como de ferramentas e pessoas [14]. Para o planejamento, isso significa que cada apontamento de operação deve registrar, no mínimo, quem trabalhou, quando, em qual máquina, com qual material e em qual revisão de processo. A seção 4 aprofunda o tema.

**Entrega no prazo.** A AS9100 cita explicitamente a entrega no prazo como requisito [14]. Os clientes avaliam seus fornecedores quanto à entrega no prazo (OTD, on-time delivery) e à qualidade. Uma OTD ruim não é, portanto, apenas um problema comercial, mas também um problema de auditoria.

### 3.3 Aprovação de produção da FAA: o que o 14 CFR 21.137 significa para os planejadores

Se você possui um certificado de produção da FAA ou uma Aprovação de Fabricante de Peças (os titulares de PMA devem atender aos mesmos requisitos de sistema da qualidade do 14 CFR 21.307), ou se fornece para um titular desse tipo, os requisitos de sistema da qualidade do 14 CFR 21.137 moldam o seu planejamento [41]. A norma exige que cada requerente ou titular de um certificado de produção estabeleça um sistema da qualidade por escrito "que assegure que cada produto e artigo esteja em conformidade com o seu projeto aprovado e em condição de operação segura" [41]. Seus 14 elementos se assemelham a uma lista de verificação para um processo de planejamento que funciona:

- **Controle de dados de projeto e controle de documentos:** somente a revisão atual e aprovada pode ser liberada para o chão de fábrica.
- **Controle de fornecedores:** procedimentos que garantam que cada produto, artigo ou serviço fornecido esteja em conformidade com os requisitos do titular da aprovação, além de um processo de reporte de não conformidades encontradas após a liberação [41].
- **Controle do processo de fabricação, inspeção e ensaio, situação de inspeção e ensaio:** o roteiro precisa mostrar quais inspeções ocorrem onde, e a situação de cada peça deve estar visível.
- **Controle de produto não conforme e ação corretiva:** sucata, retrabalho e desvios precisam ser planejados e documentados, não tratados de forma informal.
- **Controle de registros da qualidade:** no mínimo 5 anos para produtos e artigos, no mínimo 10 anos para componentes críticos [41].
- **Retorno de campo e escapes de qualidade:** constatações de campo e escapes retornam ao sistema.

Para um fornecedor de Nível 2 ou Nível 3 sem aprovação própria, esses requisitos chegam como desdobramentos no pedido de compra do cliente e no manual de qualidade de fornecedores. A consequência para o planejamento é a mesma: as evidências precisam ser produzidas no fluxo da ordem, não reconstruídas depois.

### 3.4 Perspectiva: a AS9100D se torna a IA9100

O IAQG trabalha em uma revisão da 9100 que deverá ser publicada como IA9100. O novo nome pretende unificar as designações regionais (AS, EN, JISQ). Até meados de outubro de 2026, de acordo com uma revisão das informações disponíveis, não havia publicação oficial nem data confirmada; as estimativas variam do fim de 2026 ao início de 2027. O período de transição para os certificados também não foi definido [15]. Até lá, a AS9100D (EN 9100:2018) continua sendo a edição válida, e os certificados existentes permanecem válidos [15]. Planeje a transição como um projeto separado assim que o IAQG publicar a norma e combine o cronograma com o seu organismo certificador.

### 3.5 AS9145: comprovar a prontidão para produção na cadência do cliente

A AS9145 leva ao setor aeroespacial o APQP e o PPAP, métodos familiares à indústria automotiva [45]. Ela estrutura o caminho até a produção em cinco fases: planejamento; projeto e desenvolvimento do produto; projeto e desenvolvimento do processo; validação do produto e do processo; e produção contínua, uso e serviço pós-entrega [35]. O pacote PPAP inclui, entre outros itens, registros de projeto, um fluxograma do processo, uma FMEA de processo, um plano de controle, análise do sistema de medição, estudos iniciais de capabilidade do processo e o relatório de inspeção do primeiro artigo (FAIR) [35].

As fases 3 e 4 são decisivas para o planejamento. Na fase 3, a prontidão da produção é avaliada em uma revisão de prontidão da produção, e os processos devem atender aos requisitos na taxa de demanda do cliente. Na fase 4, as corridas de produção devem demonstrar que o processo entrega peças conformes na taxa do cliente [35]. Em outras palavras: a comprovação de capacidade faz parte da aprovação. Se a sua capacidade existe apenas no papel, é aqui que isso vai aparecer.

### 3.6 Programas de defesa: CMMC 2.0, controles de exportação e metais especiais

Muitos fornecedores aeroespaciais atendem a clientes comerciais e de defesa, frequentemente nas mesmas máquinas e no mesmo sistema ERP. Três requisitos dos EUA então afetam o planejamento:

- **CMMC 2.0.** A regra do DFARS "Assessing Contractor Implementation of Cybersecurity Requirements" entrou em vigor em 10 de novembro de 2025. Ela acrescenta a cláusula 252.204-7021 e faz a implantação gradual dos requisitos do CMMC ao longo de três anos; a regra do programa subjacente, 32 CFR Part 170, entrou em vigor em 16 de dezembro de 2024 [49]. O modelo tem três níveis e está alinhado ao NIST SP 800-171 [50]. A transferência de exigências aos subcontratados se aplica quando o subcontrato envolve FCI ou CUI, e os contratantes principais devem confirmar a situação atual de CMMC de um subcontratado antes da adjudicação [49]. Se desenhos, roteiros ou instruções de trabalho com CUI estiverem armazenados no seu sistema de planejamento, esse sistema está no escopo.
- **ITAR e EAR.** Dados técnicos de artigos de defesa só podem ser acessados por pessoas autorizadas [36]. Programadores, suporte de TI offshore e tenants de nuvem precisam ser verificados. Isso afeta onde os dados de planejamento são armazenados e quem pode ver quais ordens.
- **Metais especiais.** De acordo com a DFARS 252.225-7009, titânio e ligas de titânio (entre outros metais especiais) em itens entregues sob contratos do DoD devem ser fundidos ou produzidos nos EUA ou em um país qualificado, e a cláusula é transferida a subcontratos para itens que contenham metais especiais [51]. A alocação de material, portanto, precisa conhecer a origem da fusão de cada lote de corrida.

## 4. Rastreabilidade e genealogia

### 4.1 Por que a rastreabilidade é uma tarefa de planejamento

A rastreabilidade costuma ser tratada como um tema puramente de qualidade. Na prática, ela é criada no fluxo de ordens, onde o trabalho é planejado, executado e confirmado. Quando um planejador transfere uma ordem para outra máquina, divide um lote ou redireciona uma operação terceirizada, a genealogia da peça muda. Se essa informação faltar depois, a peça pode, no pior caso, não ser mais expedível porque seu registro está incompleto.

Um artigo recente da revista comercial alemã *Produktion* descreve evidências e qualidade de dados como o verdadeiro gargalo para fornecedores de médio porte da indústria de defesa. Ele cita uma pesquisa da BearingPoint segundo a qual apenas 10 % das empresas pesquisadas na Alemanha têm uma arquitetura de dados totalmente integrada, enquanto 38 % trabalham com sistemas fragmentados [37]. O episódio do podcast m365.fm [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/) analisa como a rastreabilidade e a genealogia podem ser implementadas tecnicamente e organizacionalmente na manufatura.

### 4.2 Termos: rastreabilidade, genealogia, as-designed e as-built

- **Rastreabilidade** é a capacidade de acompanhar a origem de uma peça (para frente e para trás): de qual material, de qual fornecedor, com qual processo, quando e por quem?
- **Genealogia** descreve as relações pai-filho entre peças, lotes e montagens. Ela responde a perguntas como: quais montagens contêm material do lote de corrida X? Quais números de série são afetados por uma corrida defeituosa de tratamento térmico?
- **As-designed** é a configuração que a engenharia especifica; **as-built** é a configuração que foi de fato fabricada, incluindo desvios aprovados. **As-maintained** descreve a condição após a manutenção em MRO.

### 4.3 O modelo de dados: o que você precisa capturar no mínimo

| Objeto | Atributos típicos | Por que o planejamento precisa dele |
|---|---|---|
| Peça / número de série | número da peça, revisão, número de série, configuração | vincula ao pedido do cliente e à revisão de projeto |
| Lote / batch | número do lote, quantidade, divisões e junções | dimensionamento de lotes, delimitação de um recall |
| Matéria-prima | material, especificação, corrida (heat), fornecedor, certificado de material, origem da fusão (para metais especiais sob DFARS [51]) | liberação do material antes do início da ordem |
| Operação | máquina, revisão do programa CN, ferramenta, parâmetros de processo, início/fim | confirmação, prazo de entrega, conciliação de capacidade |
| Pessoal | funcionário, qualificação, validade | atribuição apenas de pessoas qualificadas |
| Processo especial | processador, acreditação, número da carga do forno/tanque, certificado | planejamento das etapas terceirizadas, contenção de desvios |
| Inspeção | plano de inspeção, calibre, resultado, inspetor | liberação, FAI, evidência para características-chave |
| Desvio | concessão, retrabalho, aprovação de desvio | documentação as-built, possibilidade de expedição |
| Documento de liberação | certificado de conformidade (C of C); em organizações aprovadas, FAA Form 8130-3 ou EASA Form 1 [22][23][43] | liberação para envio; fornecedores sem aprovação de produção própria normalmente enviam ao detentor da aprovação com um certificado de conformidade |

Uma observação sobre documentos de liberação para leitores dos EUA: o FAA Form 8130-3 (Authorized Release Certificate, Airworthiness Approval Tag) documenta aprovações de aeronavegabilidade domésticas, aprovações para retorno ao serviço e aprovações de exportação. Ele só pode ser emitido por pessoas e organizações autorizadas pela FAA, e a FAA Order 8130.21H afirma que fornecedores sem aprovação de produção geralmente não podem emiti-lo para peças enviadas ao detentor de sua aprovação de produção; a ordem também observa que ele "não é um documento de entrega ou de envio" [43]. Instalações aprovadas tanto pela FAA quanto pela EASA podem emitir uma liberação dupla no 8130-3, que torna a peça elegível para instalação em aeronaves dos EUA e da UE [43]. A contrapartida europeia para liberações únicas da EASA é o EASA Form 1 [22][23].

### 4.4 Peças de vida limitada

Certas peças, especialmente componentes rotativos de motores, como discos e eixos, possuem vida aprovada em ciclos ou horas (life-limited parts, LLP). Seu consumo deve ser documentado sem lacunas ao longo de toda a vida útil. Nos EUA, proprietários e operadores devem manter registros do "status atual das peças de vida limitada" para cada célula, motor, hélice, rotor e equipamento, e esses registros são mantidos e transferidos com a aeronave quando ela é vendida [53]. Na Europa, a mesma tarefa faz parte da aeronavegabilidade continuada segundo as regras da EASA [23]. Se parte do histórico estiver ausente (a chamada rastreabilidade desde o nascimento, ou back-to-birth), uma peça tecnicamente perfeita pode tornar-se inutilizável. Para fabricantes, isso significa: o registro de origem da peça, ou seja, material, corrida, lote de forjamento e dados de fabricação, deve estar completo. Para oficinas de MRO, significa: sem um histórico completo, a peça não pode ser reinstalada, e o planejamento precisa providenciar uma substituta.

### 4.5 Peças falsificadas e não aprovadas

A AS9100 exige explicitamente medidas para prevenir peças falsificadas [14]. A Advisory Circular AC 21-29D (2016) da FAA descreve como detectar e reportar peças suspeitas de não aprovadas (suspected unapproved parts, SUP); ela define uma peça não aprovada como aquela que não atende aos critérios do 14 CFR 21.8 ou 21.9, o que inclui peças intencionalmente adulteradas e falsificadas [52]. Sua orientação para compras é diretamente relevante para os planejadores: comprar de fontes cuja documentação rastreie as peças até uma fonte aprovada pela FAA, e desconfiar de sinais de alerta, como preço muito abaixo dos demais vendedores, prazo de entrega incomumente curto ou documentação ausente [52]. Peças suspeitas de não aprovadas são reportadas no FAA Form 8120-11 [52].

Para o planejamento, isso significa: as compras só podem vir de fontes aprovadas, os certificados devem ser verificados na inspeção de recebimento, e uma substituta obtida rapidamente de uma fonte desconhecida não é uma opção, nem mesmo sob pressão de prazo. Escassez de suprimento eleva o risco, porque a pressão para recorrer a fontes do mercado paralelo aumenta.

### 4.6 Na prática: incorporando a rastreabilidade ao processo de planejamento

1. **Reservar e liberar o material antes do início da ordem.** Uma ordem só começa quando o material específico (lote de fusão, certificado) estiver atribuído e verificado.
2. **Modelar as qualificações no modelo de capacidade.** O planejamento atribui operações apenas a pessoas e máquinas com qualificações válidas.
3. **Registrar divisões e junções no sistema.** Cada divisão de lote cria um novo número de lote vinculado à sua origem.
4. **Planejar operações externas, incluindo o retorno dos certificados.** Uma peça só está de volta quando o seu certificado estiver de volta.
5. **Registrar as confirmações na estação de trabalho, não no fim do turno.** Quanto mais tarde o registro, mais informação fica faltando.
6. **Testar regularmente as suas consultas.** Execute um recall simulado: quanto tempo leva para localizar todos os números de série de um lote de fusão?

## 5. Níveis de planejamento: da taxa do cliente à operação

### 5.1 Quatro níveis, quatro horizontes de tempo

O planejamento da produção aeroespacial pode ser dividido em quatro níveis. Cada um responde a uma pergunta diferente e precisa de dados diferentes.

| Nível | Horizonte | Pergunta-chave | Ferramentas típicas |
|---|---|---|---|
| Planejamento estratégico de taxa e capacidade | 2 a 5 anos | Qual taxa podemos entregar com qual investimento? | cálculo de cenários, simulação da fábrica, planejamento de capital |
| Planejamento de vendas e operações (S&OP) e programação mestre da produção | 6 a 24 meses | Como traduzimos as taxas do cliente em um programa viável? | ERP, planejamento de capacidade grosseiro, APS |
| Planejamento de materiais e capacidade | 1 a 6 meses | De quais materiais e de qual capacidade precisamos, e quando? | ERP/MRP, portais de fornecedores, APS |
| Programação detalhada e controle do chão de fábrica | horas a 4 semanas | Qual ordem roda quando, em qual máquina, com quem? | APS, MES, quadro do chão de fábrica |

Uma causa comum de baixo desempenho na entrega no prazo não é um nível fraco, mas uma quebra entre os níveis: a programação mestre se compromete com a taxa 75, a programação detalhada conhece os gargalos que tornam isso impossível, e ninguém concilia os dois de forma sistemática.

### 5.2 ERP, APS e MES: quem faz o quê

na maioria das empresas, o [planejamento de recursos empresariais (ERP)](https://www.m365.fm/entity/enterprise-resource-planning/) é o sistema principal para pedidos, listas de materiais, roteiros, estoque e compras. Seu planejamento clássico de necessidades de materiais (MRP), em sua forma básica, calcula com prazos de entrega planejados fixos e sem limites de capacidade. Isso basta para determinar as necessidades de materiais, mas não para criar uma programação de produção viável.

Um sistema de [planejamento e programação avançados (APS)](https://www.m365.fm/entity/advanced-planning-and-scheduling/), por outro lado, programa com capacidade finita: máquinas, pessoas com qualificações, ferramentas, turnos e disponibilidade de material são considerados ao mesmo tempo. O método subjacente chama-se [programação baseada em restrições](https://www.m365.fm/entity/constraint-based-scheduling/). Por fim, um sistema de execução da manufatura (MES) controla e documenta a execução no chão de fábrica e fornece as confirmações sem as quais nem o planejamento nem a rastreabilidade funcionam.

O guia irmão [Programação da produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/) aborda em detalhe as diferenças entre ERP, APS e MES, os limites da lógica do MRP e como selecionar software de planejamento.

### 5.3 O que um modelo de planejamento aeroespacial precisa capturar além disso

Em comparação com a manufatura genérica, um modelo de planejamento na área aeroespacial precisa de algumas restrições adicionais:

- **Matriz de qualificações** para pessoas (processos especiais, autorizações de inspeção, autorizações de liberação)
- **Qualificação de máquinas** por número de peça (nem todas as máquinas são aprovadas para todas as peças)
- **Operações externas** com prazos realistas e compromissos de capacidade dos processadores
- **Etapas de inspeção e liberação** como operações programáveis com capacidade própria (laboratório de inspeção, inspetores, FAI)
- **Dados de configuração e efetividade** (qual revisão se aplica a partir de qual número de série ou aeronave)
- **Alocação de material no nível de lote de fusão** em vez de apenas disponibilidade de quantidade (incluindo a origem da fusão quando se aplicam as regras DFARS para metais especiais [51])
- **Restrições de lote** para fornos, autoclaves e tanques de processo (carga mínima, compatibilidade de peças e materiais)
- **Restrições de acesso aos dados** para pedidos controlados por ITAR ou CUI (quem pode ver e programar qual trabalho) [36][49]

## 6. Entendendo e reduzindo o lead time

### 6.1 Lei de Little: a relação entre estoque e tempo

Em 1961, John D. C. Little demonstrou uma relação válida para todo sistema produtivo estável: o estoque médio no sistema é igual à vazão multiplicada pelo tempo médio no sistema [27]. Reorganizando:

**Lead time = work in process (WIP) ÷ vazão**

**Exemplo prático:** Uma oficina de componentes de motor expede em média 40 peças por semana. Há 320 peças no sistema (em processamento, em espera, no processo externo, em inspeção). O lead time médio é então 320 ÷ 40 = 8 semanas. Se o WIP puder ser reduzido para 200 peças com a mesma vazão, o lead time cai para 5 semanas. A vazão não muda, desde que o gargalo continue plenamente abastecido.

A lei explica por que liberar mais ordens para o chão de fábrica não encurta o prazo de entrega, mas o alonga: o WIP aumenta, a vazão permanece a mesma e o lead time cresce.

### 6.2 Onde o tempo se perde

Em muitas fábricas, o tempo efetivo de processamento é apenas uma pequena parte do lead time; a parcela maior é o tempo de espera. Esta é uma regra prática amplamente difundida, não uma proporção documentada de forma geral [unverified: regra prática difundida no setor, sem fonte documentada]. A parcela depende muito da empresa e deve ser medida na sua própria fábrica, por exemplo com [mapeamento do fluxo de valor](https://www.m365.fm/en/learn/value-stream-mapping/). Na indústria aeroespacial, as causas típicas são:

- **Espera por processos especiais externos** (transporte de ida e volta, fila no processador, retorno de certificados)
- **Espera por inspeção e liberação** (laboratório de inspeção, FAI, inspeção na fonte pelo cliente, concessões)
- **Espera por material ou documentos** (certificados ausentes, alterações de engenharia em aberto)
- **Formação de lotes** (peças aguardam até que um forno ou lote esteja completo)
- **Gargalos sobrecarregados** (alta utilização cria filas desproporcionalmente longas)
- **Interrupção por pedidos urgentes** (a expedição desloca os pedidos regulares)

### 6.3 Alavancas para lead times menores

1. **Limitar o WIP.** Liberar apenas tantas ordens quantas o gargalo consegue processar. A Teoria das Restrições chama isso de "corda" (Seção 11).
2. **Agrupar e programar as etapas externas.** Dias fixos de coleta e entrega com o processador reduzem a variabilidade.
3. **Planejar a capacidade de inspeção.** O laboratório de inspeção e os inspetores são capacidade como máquinas e devem constar no plano de capacidade.
4. **Esclarecer os documentos antes do início.** Nenhuma ordem sem documentação completa, material com certificado e revisão de projeto válida.
5. **Não carregar gargalos acima de 85 a 90 % por longos períodos** quando a variabilidade for alta. Esta regra prática decorre da teoria das filas (Seção 11.1); o valor adequado depende da variabilidade da sua fábrica. Uma pequena reserva de capacidade frequentemente custa menos do que filas longas.

## 7. Planejamento de processos especiais e operações externas

### 7.1 Por que os processos especiais frequentemente se tornam o gargalo

Processos especiais são processos cujo resultado não pode ser totalmente verificado na peça acabada sem destruí-la, por exemplo tratamento térmico, tratamento de superfície, soldagem ou certos revestimentos. Sua qualidade deve, portanto, ser garantida por meio de processos, equipamentos e pessoas qualificados. Na indústria aeroespacial, muitos clientes exigem a acreditação Nadcap para eles [21][54].

Isso tem três consequências para o planejamento. Primeiro, o número de fontes aprovadas é limitado; uma mudança exige qualificação e frequentemente uma nova inspeção de primeiro artigo. Segundo, muitos desses processos operam em lotes (fornos, tanques, autoclaves), o que gera formação de lotes e tempos de espera. Terceiro, fornecedores relatam que ensaios e tratamento de superfície, em particular, têm prazos de entrega longos [10].

### 7.2 Regras de planejamento para processos especiais

- **Modelar o processo especial como um recurso,** e não como um prazo fixo. Um tratador térmico externo com duas corridas de forno por semana é uma capacidade com uma cadência, não "prazo de 10 dias".
- **Acordar compromissos de capacidade por contrato** (vagas por semana) e registrá-los no planejamento como restrição rígida.
- **Planejar a formação de lotes deliberadamente.** Quais peças podem ser processadas juntas? Qual carga mínima faz sentido? Por quanto tempo, no máximo, uma peça pode aguardar a formação de um lote?
- **Tornar a confirmação, incluindo o certificado,** uma condição para a operação seguinte.
- **Qualificar fontes alternativas** antes que o gargalo se torne crítico. A qualificação frequentemente leva meses.

### 7.3 Processos especiais internos: fazer ou comprar sob o ponto de vista da capacidade

Muitos fornecedores consideram internalizar processos especiais para reduzir sua dependência. Isso pode fazer sentido, mas é um projeto com prazo longo próprio: equipamentos, qualificação, acreditação, pessoal e aprovações de clientes. Uma simulação da utilização futura (Seção 11.4) ajuda a esclarecer se o investimento compensa ou se o equipamento interno apenas cria um novo gargalo com baixa utilização.

## 8. Mudanças de engenharia e gestão de configuração

### 8.1 Mudanças são normais na indústria aeroespacial

Ao longo da longa vida de um programa de aeronave, desenhos, materiais, processos e fornecedores mudam repetidamente. Cada mudança precisa ser avaliada, aprovada e receber uma efetividade: a partir de qual número de série, aeronave ou data a nova revisão se aplica? Para o planejamento, isso é uma fonte permanente de perturbação.

### 8.2 O que uma mudança desencadeia no planejamento

| Impacto | Consequência para o planejamento |
|---|---|
| Nova revisão de projeto | revisar pedidos em aberto: deixar esgotar, retrabalhar, sucatear ou expedir com concessão |
| Operações novas ou alteradas | atualizar roteiro, tempos padrão, programas de CNC e planos de inspeção |
| Inspeção de primeiro artigo (completa ou parcial) | programar a FAI como operação própria com capacidade de inspeção; aprovação antes das entregas de produção [18][34] |
| Mudança de material ou fornecedor | qualificação, possivelmente nova FAI, novos certificados e prazos de compra |
| Novas ferramentas ou dispositivos | prazo de compra, aceitação, possivelmente FAI para ferramental alterado |

Pela AS9102, uma mudança de projeto que afete forma, ajuste ou função, uma mudança de fonte, processo, local ou ferramental de fabricação e uma interrupção de produção superior a dois anos, entre outros casos, desencadeiam uma inspeção de primeiro artigo completa ou parcial [34]. A Revisão C da AS9102, publicada em 2023, dá mais ênfase ao planejamento, à avaliação e à repetição das inspeções de primeiro artigo [18][46]. Na Europa, a edição correspondente foi publicada como EN 9102:2024 (na Alemanha como DIN EN 9102:2025-01) [17].

### 8.3 Regras práticas para lidar com mudanças

1. **Agrupar mudanças quando o cliente permitir.** Muitas pequenas mudanças isoladas custam mais do que algumas mudanças agrupadas.
2. **Definir a efetividade cedo e transferi-la para o planejamento.** Um pedido precisa saber, no início, qual revisão está construindo.
3. **Gerenciar ativamente o estoque de revisões antigas.** Lançar grandes lotes da revisão antiga quando uma mudança é previsível gera sucata.
4. **Reservar capacidade de FAI.** Os recursos de inspeção para primeiros artigos são rapidamente sobrecarregados durante rampas de produção e ondas de mudanças.
5. **Tornar o status das mudanças visível no quadro de planejamento.** Pedidos com mudanças em aberto são pedidos de risco.

## 9. Curvas de aprendizado de Wright: teoria e exemplo prático

### 9.1 A descoberta de 1936

Em 1936, Theodore Paul Wright publicou o artigo "Factors Affecting the Cost of Airplanes" no *Journal of the Aeronautical Sciences* (vol. 3, nº 4, pp. 122–128) [24]. Ele constatou que as horas de trabalho necessárias por avião caíam cerca de 20 % a cada duplicação da produção acumulada [25]. Esse padrão é conhecido hoje como Lei de Wright ou curva de aprendizado. Uma redução de 20 % por duplicação é chamada de curva de aprendizado de 80 %; o nome indica a fração que permanece [25].

As curvas de aprendizado continuam sendo uma ferramenta padrão para estimativa de custos e planejamento de capacidade na indústria aeroespacial. O US Government Accountability Office (GAO) as descreve em seu Cost Estimating and Assessment Guide [26].

### 9.2 Duas variantes: média acumulada e modelo unitário

Existem duas formulações comuns [26]:

- **Modelo de média acumulada (Wright):** a *média* de horas entre todas as unidades produzidas até então cai um percentual fixo a cada duplicação.
- **Modelo unitário (modelo de Crawford):** as horas para a *unidade individual* caem um percentual fixo a cada duplicação.

Ambos usam a mesma fórmula, mas quantidades de referência diferentes [26][40]. Decida qual variante usar e mantenha-a. Se você transferir uma taxa de aprendizado do modelo de média acumulada para o modelo unitário, estará comparando valores reais e metas que não correspondem.

A fórmula é: **Y = A · X^b**, onde A = horas para a primeira unidade, X = unidades acumuladas e b = log(taxa de aprendizado) ÷ log(2) [26].

### 9.3 Exemplo prático: lançamento de uma nova montagem

Um fornecedor assume a montagem de um novo subconjunto. A primeira unidade exige 1.000 horas de montagem. Com base em programas comparáveis, assume-se uma curva de aprendizado de 85 % (modelo de média acumulada).

**Passo 1: Calcular o expoente.** b = log(0,85) ÷ log(2) = −0,2345.

**Passo 2: Horas médias e horas unitárias.** As horas da unidade N resultam da diferença dos totais acumulados: T(N) = N · média(N) − (N−1) · média(N−1).

| Unidades acumuladas N | Horas médias por unidade | Horas acumuladas | Horas da unidade N |
|---|---|---|---|
| 1 | 1.000,0 | 1.000 | 1.000,0 |
| 2 | 850,0 | 1.700 | 700,0 |
| 4 | 722,5 | 2.890 | 571,3 |
| 8 | 614,1 | 4.913 | 477,4 |
| 16 | 522,0 | 8.352 | 402,6 |
| 32 | 443,7 | 14.199 | 340,9 |
| 50 | 399,6 | 19.981 | 306,6 |
| 100 | 339,7 | 33.968 | 260,3 |

**Passo 3: O que isso significa para o planejamento de capacidade.** Se o fornecedor planejasse as primeiras dez unidades com as horas da centésima unidade (260 horas), chegaria a 2.603 horas. Segundo a curva de aprendizado, as primeiras dez unidades exigem de fato 5.828 horas, mais que o dobro. Um lançamento planejado com horas padrão de regime maduro é, portanto, sistematicamente subdimensionado.

**Passo 4: Verificar a sensibilidade.** Quanto o resultado depende da taxa de aprendizado assumida? Com uma curva de 90 % em vez de 85 %, a necessidade para as primeiras 100 unidades sobe de 33.968 para 49.659 horas, um aumento de 46 %. A escolha da taxa de aprendizado é, assim, uma das premissas mais determinantes em todo o plano de lançamento.

### 9.4 Regras práticas para curvas de aprendizado

- **Derive as taxas de aprendizado dos seus próprios dados,** não as copie da literatura. Registre as horas reais por unidade desde o início.
- **Diferencie as curvas de aprendizado pelo conteúdo de trabalho.** A montagem manual aprende mais do que a usinagem, em que o tempo de máquina quase não cai.
- **Considere as interrupções.** Após paradas prolongadas, trocas de pessoal ou transferências, parte do efeito de aprendizado se perde.
- **Acompanhe o realizado contra o planejado.** Se as horas reais permanecerem acima da curva, a premissa ou o processo está errado. O planejamento precisa saber qual dos dois.
- **Alterações de engenharia reiniciam parcialmente a curva.** Uma mudança relevante pode desencadear um novo processo de aprendizado.

## 10. Planejamento de uma rampa de taxa: cálculo e checklist

### 10.1 Por que as rampas falham no gargalo

Um aumento de taxa costuma ser avaliado com base na capacidade total: "Estamos com 75 % de utilização média, então podemos atender 20 % a mais." Isso raramente é verdade, porque a vazão é determinada pelo gargalo, não pela média. A [Teoria das Restrições](https://www.m365.fm/entity/theory-of-constraints/) de Eliyahu M. Goldratt popularizou esse princípio nos anos 1980 [28].

### 10.2 Exemplo prático: taxa de 60 para 72

Um fornecedor entrega um conjunto de peças de fixação por aeronave. A taxa do cliente deve subir de 60 para 72 aeronaves por mês (alta de 20 %). Os três recursos mais importantes são os seguintes:

| Recurso | Horas disponíveis/mês | Carga na taxa 60 | Utilização taxa 60 | Carga na taxa 72 | Utilização taxa 72 |
|---|---|---|---|---|---|
| Usinagem 5 eixos | 1.400 | 1.190 | 85 % | 1.428 | 102 % |
| Rebarbação e montagem | 2.000 | 1.300 | 65 % | 1.560 | 78 % |
| Laboratório de inspeção (CMM) | 600 | 420 | 70 % | 504 | 84 % |
| Total (ponderado por horas) | 4.000 | 2.910 | 73 % | 3.492 | 87 % |

A utilização total de 87 % parece viável. Mas a usinagem de 5 eixos, com 102 %, está acima de sua capacidade, e isso sem considerar interrupções, preparações para variantes adicionais ou inspeções de primeiro artigo após mudanças. Soma-se a isso o efeito da Seção 6: quanto mais a utilização se aproxima de 100 %, mais as filas crescem. Sem ação, o lead time e as entregas atrasadas aumentam, embora a capacidade total seja matematicamente suficiente.

**Ações possíveis, ordenadas pelo prazo de implementação:**

1. **Imediatamente:** proteger o gargalo (sem tempo ocioso durante as pausas, preparar as preparações fora do tempo de máquina, desacoplar a inspeção da máquina).
2. **Semanas:** turnos extras nos fins de semana, transferir peças de menor complexidade para outras máquinas qualificadas.
3. **Meses:** otimização de programas (tempo de ciclo), dispositivos para múltiplas fixações, terceirização de peças específicas para parceiros qualificados (com FAI).
4. **Trimestres a anos:** uma máquina adicional, incluindo prazo de entrega, instalação, qualificação e aprovação do cliente.

O último ponto mostra por que as rampas na indústria aeroespacial exigem tanto tempo de antecedência: entre a decisão por uma nova máquina e a primeira entrega de produção aprovada há, frequentemente, muitos meses.

### 10.3 Checklist: sua fábrica está pronta para a próxima taxa?

**Demanda e cenários**

- [ ] Taxa do cliente, liberações e demanda de peças de reposição por número de peça estão disponíveis para pelo menos 18 meses.
- [ ] Pelo menos três cenários de taxa foram calculados (conservador, planejado, ambicioso).
- [ ] Gatilhos para investimento e contratação estão definidos antecipadamente.

**Capacidade**

- [ ] O gargalo é conhecido para cada cenário, não apenas a utilização média.
- [ ] A utilização do gargalo no cenário planejado está abaixo de 85 a 90 %.
- [ ] Curvas de aprendizado para novas peças estão planejadas (Seção 9).
- [ ] A capacidade de inspeção e medição está planejada para produção, FAI e mudanças.

**Pessoas**

- [ ] A matriz de qualificação mostra quantas pessoas estão disponíveis para cada processo especial e inspeção.
- [ ] Os tempos de integração e qualificação de novos funcionários estão incluídos no plano.
- [ ] Pontos únicos de falha (qualificações concentradas em uma pessoa) estão identificados.

**Material e fornecedores**

- [ ] Os contratos de matéria-prima cobrem a taxa mais alta, incluindo os prazos de entrega.
- [ ] Processos especiais terceirizados têm compromissos de capacidade para a nova taxa.
- [ ] Segundas fontes para materiais e processos críticos estão qualificadas ou em qualificação.
- [ ] Para trabalhos de defesa: as fontes de material atendem às regras DFARS de metais especiais [51].

**Qualidade e aprovações**

- [ ] Novas máquinas, dispositivos e fontes estão planejados com prazos de FAI e aprovação do cliente.
- [ ] A comprovação de prontidão para produção na taxa do cliente (AS9145) está preparada [35].
- [ ] A rastreabilidade funciona em volumes maiores sem retrabalho manual.

**Controle**

- [ ] Os KPIs (OTD, lead time, WIP, utilização do gargalo) são acompanhados semanalmente.
- [ ] Um caminho de escalonamento para interrupções no gargalo está definido.
- [ ] O plano é regularmente conciliado com as confirmações reais.

## 11. Planejamento de capacidade com APS, gestão de gargalos e simulação

### 11.1 Por que a alta utilização custa tempo

A teoria de filas fornece uma regra prática simples: o tempo médio de espera em um recurso cresce com o fator u ÷ (1 − u), em que u é a utilização. Essa aproximação remonta a J. F. C. Kingman (1961); em sua forma completa, ela também inclui a variabilidade das chegadas e dos tempos de processamento [38]. Com 80 % de utilização, o fator é 4; com 90 %, já é 9; e com 95 %, é 19. O tempo de espera em um recurso com 95 % de utilização é, portanto, quase cinco vezes maior do que com 80 %, mantidas as demais condições.

Isso é especialmente relevante na indústria aeroespacial, com sua alta variabilidade (mudanças, retrabalho, processos externos, pedidos urgentes). Se você planejar um gargalo com 98 % de utilização, também estará planejando prazos de entrega longos.

### 11.2 Gestão de gargalos com a Teoria das Restrições

A Teoria das Restrições (TOC) descreve cinco passos de foco: identificar a restrição, explorá-la, subordinar todo o restante a ela, elevá-la e, então, recomeçar, pois a restrição se desloca [28]. Para o controle do chão de fábrica, consolidou-se o princípio tambor-pulmão-corda (DBR):

- **Tambor:** o gargalo define o ritmo. Seu cronograma é o cronograma mestre da fábrica.
- **Pulmão:** um pulmão de tempo fica antes do gargalo para que perturbações a montante não o deixem sem material.
- **Corda:** a liberação de material no início da produção é vinculada ao gargalo. Só é liberado o que o gargalo consegue processar no futuro previsível. Isso mantém o WIP limitado.

Na indústria aeroespacial, o gargalo muitas vezes não está no seu próprio prédio, mas no processo especial terceirizado ou no laboratório de inspeção. O DBR continua funcionando se você tratar a etapa externa como o tambor e vincular a sua própria liberação aos seus horários.

### 11.3 APS na indústria aeroespacial: o que ele precisa fazer

Um sistema APS para um fornecedor aeroespacial deve ser capaz de fazer pelo menos o seguinte:

| Capacidade | Por que importa na indústria aeroespacial |
|---|---|
| Programação com capacidade finita | Gargalos são a regra, não a exceção |
| Qualificações de pessoas e máquinas | Apenas recursos qualificados podem ser programados |
| Operações externas com janelas de horário | Processos especiais muitas vezes são o verdadeiro gargalo |
| Formação de lotes | Fornos, tanques e autoclaves trabalham em lotes |
| Etapas de inspeção e liberação | FAI e inspeções consomem capacidade |
| Reprogramação rápida | Mudanças, retrabalho e pedidos urgentes são frequentes |
| Cenários (what-if) | Avaliar cenários de taxa, investimentos e falhas de fornecedores |
| Retorno do chão de fábrica | Sem dados reais, todo plano fica obsoleto |
| Integração com ERP e MES | Dados mestres e pedidos vêm do ERP, dados reais do MES |
| Controle de acesso a dados controlados | Pedidos ITAR e CUI devem ser visíveis apenas para usuários autorizados [36][49] |

O guia irmão [Production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) contém uma lista de verificação para seleção e um roteiro de implementação para sistemas APS.

### 11.4 Simulação: testar decisões de capacidade antes de tomá-las

Uma [simulação de fábrica](https://www.m365.fm/entity/factory-simulation/) representa recursos, pedidos, variabilidade e regras em um modelo e percorre semanas ou meses em minutos. Ela responde a perguntas que um cálculo estático de capacidade não consegue responder:

- Como o prazo de entrega e a entrega no prazo se comportam na taxa 67 e na taxa 75?
- O que uma máquina adicional traz e onde surge o próximo gargalo?
- O que acontece se o tratamento térmico externo ficar parado por duas semanas?
- Qual regra de liberação mantém o WIP mais baixo com a mesma entrega no prazo?
- Um processo especial interno compensa, ou o equipamento ficará subutilizado?

A simulação não substitui a programação detalhada; ela prepara decisões estratégicas e táticas. É especialmente valiosa antes de investimentos com longos prazos de entrega, situação em que muitos fornecedores se encontram com os atuais planos de taxa. No m365.fm você também encontrará a página de entidade [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) sobre o tema de planejamento e simulação.

## 12. Riscos na cadeia de suprimentos de 2022 a 2026 e o que significam para o planejamento

### 12.1 O que aconteceu nos últimos anos

**Motores.** Em 2023, a Pratt & Whitney divulgou um defeito no metal em pó de determinadas peças do motor turbofan com engrenagem (GTF), que pode levar a trincas. Em setembro de 2023, a controladora RTX anunciou que outros 600 a 700 motores teriam de ser retirados para revisão em oficina até 2026 e previu que, em média, 350 aeronaves da família A320 por ano ficariam em solo. A RTX registrou uma provisão antes de impostos de US$ 3 bilhões; os custos totais foram estimados em até US$ 7 bilhões, parte dos quais recai sobre parceiros como a MTU [11]. Em 2026, a Airbus acusou a Pratt & Whitney de priorizar a manutenção em campo em detrimento da entrega de novos motores e de não entregar as quantidades encomendadas [4]. Em meados de 2026, a Airbus afirmou que já não tinha aeronaves acabadas aguardando apenas motores, mas também não tinha nenhum estoque de segurança [39].

**Titânio.** Após o ataque da Rússia à Ucrânia, a Boeing suspendeu, em março de 2022, as compras da produtora russa de titânio VSMPO-Avisma. A Airbus, que na época afirmou obter cerca de metade do seu titânio da Rússia, inicialmente continuou comprando [12]. O titânio segue como um dos riscos de matéria-prima mais citados em 2026 [10]. Para fornecedores de programas de defesa dos EUA, a cláusula DFARS sobre metais especiais acrescenta uma restrição de origem ao problema de disponibilidade [51].

**Fundidos e forjados.** A Roland Berger relata lacunas persistentes em 2026 para fundidos e forjados de componentes de motores e sistemas (como trens de pouso) e para fixadores de estruturas. Para pás de turbina, a aeronáutica concorre com turbinas a gás industriais, cuja demanda também cresce por causa da necessidade de energia dos data centers [10].

**Mão de obra qualificada.** A escassez de profissionais qualificados continua sendo o freio mais comum à aceleração da produção (56 % dos entrevistados) [10]. A situação na manutenção é semelhante (Seção 13).

**Mudança estrutural entre os fornecedores.** A Airbus está assumindo pacotes de trabalho antes realizados pela Spirit AeroSystems. A integração reduziu os resultados da Airbus nos primeiros nove meses de 2026 em EUR 235 milhões [3]. Mudanças como essa alteram as relações de fornecimento em todos os níveis abaixo.

### 12.2 Respostas de planejamento

| Risco | Resposta de planejamento |
|---|---|
| Prazos de entrega de materiais longos e variáveis | acordos de longo prazo com compromisso de capacidade, estoque de segurança direcionado a materiais críticos, atualizar regularmente os prazos de reposição |
| Fonte única para processos especiais | qualificar segundas fontes, garantir vagas por contrato, modelar o gargalo no plano |
| Liberações de clientes flutuantes | acompanhar separadamente a taxa e as liberações do cliente, sinalizar desvios cedo |
| Escassez de mão de obra | matriz de qualificação, polivalência, integração de novos colaboradores no plano de capacidade |
| Falha de fornecedor | simular cenários, acompanhar indicadores de alerta precoce (entregas atrasadas, qualidade, saúde financeira) |
| Formação de estoque contra interrupções | manter estoque de forma deliberada e em quantidades limitadas onde protege o gargalo; cada unidade de estoque alonga o prazo de entrega, conforme a Lei de Little |

Uma observação importante sobre o último ponto: estoque não é proteção gratuita. Segundo a Roland Berger, 40 % dos fornecedores aumentaram seus estoques para o início da produção, o que pressiona margens já estreitas [10]. Amortecedores direcionados antes do gargalo são mais eficazes do que estoque de segurança generalizado para todas as peças.

## 13. Planejamento de MRO: manutenção com achados não planejados

### 13.1 O mercado de MRO em 2026

Manutenção, reparo e revisão (MRO, na sigla em inglês) é um mercado grande e em crescimento. Em sua previsão publicada com a US Aeronautical Repair Station Association (ARSA), a Oliver Wyman estima o mercado global de MRO da aviação comercial em US$ 139,6 bilhões para 2026, com expectativa de crescimento para US$ 193,1 bilhões até 2036. A manutenção de motores é o maior segmento, com US$ 70,1 bilhões. A frota deve crescer de cerca de 30.000 aeronaves comerciais no início de 2026 para cerca de 41.100 em 2036 [30]. Em uma análise separada de setembro de 2026, a Oliver Wyman aponta para escassez de materiais, longos prazos de entrega de fundidos e forjados e poucos fornecedores de peças críticas de motores; quase 30 % dos entrevistados esperam que a cadeia de suprimentos se recupere totalmente apenas em mais de três anos [29].

Os atrasos nas entregas de novas aeronaves aumentam a pressão: as companhias aéreas operam aeronaves mais antigas por mais tempo, e estas exigem mais manutenção. O estudo da IATA estima o custo adicional de manutenção somente em 2025 em US$ 3,1 bilhões [9]. Ao mesmo tempo, a produção nova e a manutenção disputam as mesmas peças e capacidade, como mostra a disputa entre Airbus e Pratt & Whitney [4].

### 13.2 Estrutura regulatória

Nos EUA, uma oficina de manutenção normalmente opera sob um certificado de estação de reparo emitido de acordo com a 14 CFR Parte 145. Uma estação de reparo só pode trabalhar em artigos para os quais está habilitada e dentro de suas especificações de operação, e ela "não pode manter ou alterar nenhum artigo para o qual não esteja habilitada" [42]. Ela deve manter dados de manutenção atualizados, como diretrizes de aeronavegabilidade, manuais de manutenção, manuais de revisão e boletins de serviço, "atualizados e acessíveis quando o trabalho relevante estiver sendo executado", executar um programa de treinamento aprovado pela FAA e manter registros do trabalho por pelo menos dois anos a partir da aprovação para retorno ao serviço [42]. Os pacotes de trabalho normalmente vêm do operador da aeronave, que também é responsável por registros como o status atual de peças de vida limitada, conforme a 14 CFR 91.417 [53]. Muitas estações de reparo também são certificadas pela AS9110 [20].

Na Europa, uma organização de manutenção opera com uma aprovação segundo a EASA Parte 145. Os pacotes de trabalho frequentemente vêm de uma organização de gestão da aeronavegabilidade continuada (Part-CAMO), que gerencia o programa de manutenção, as diretrizes de aeronavegabilidade e as peças de vida limitada [23]. Estações de reparo dos EUA que também possuem aprovação da EASA podem emitir liberações duplas no formulário FAA 8130-3 [43].

Para o planejamento, os dois sistemas significam a mesma coisa: o trabalho só é permitido dentro do escopo aprovado, por pessoal autorizado e com dados de manutenção válidos, como o Manual de Manutenção da Aeronave (AMM) ou o Manual de Manutenção de Componentes (CMM) em sua revisão atual. Um técnico sem a autorização ou o treinamento adequados também não representa capacidade aqui.

### 13.3 O que torna o planejamento de MRO fundamentalmente diferente

Na produção nova, o conteúdo do trabalho é conhecido antes de a ordem começar. Na manutenção, ele só é conhecido depois que a aeronave, o motor ou o componente foi aberto e inspecionado. Por isso, o planejamento precisa lidar com três tipos de trabalho:

- **Trabalho de rotina:** tarefas programadas do programa de manutenção ou do manual da oficina, fáceis de planejar
- **Trabalho não rotineiro (achados):** corrosão, trincas, desgaste ou danos descobertos durante a inspeção; escopo e prazo são incertos
- **Trabalho adicional:** modificações, diretrizes de aeronavegabilidade ou solicitações do cliente acrescentadas ao pacote de trabalho

O KPI central é o tempo de turnaround (TAT), o tempo desde a entrada na oficina até a devolução ao cliente. Cada dia que uma aeronave ou um motor passa a mais na oficina custa dinheiro ao operador. O TAT costuma ser determinado menos pelas horas de mão de obra do que pela espera por peças, pelas decisões sobre os achados, pelas aprovações e pelos especialistas.

### 13.4 Exemplo prático: planejar os achados em vez de torcer

Uma oficina de MRO de componentes planeja a revisão de um tipo de componente. O trabalho de rotina são 80 horas. A partir do histórico da própria oficina nas últimas 50 ordens, há três achados típicos (todos os valores são premissas para o exemplo):

| Achado | Frequência | Horas adicionais | Peças necessárias |
|---|---|---|---|
| Corrosão, reparável | 40 % | 12 h | não |
| Trinca, substituição de peça | 10 % | 20 h | sim, prazo de 15 dias úteis, sem estoque |
| Desgaste, peça de reposição | 30 % | 6 h | sim, do estoque |

**Horas adicionais esperadas:** 0,4 × 12 + 0,1 × 20 + 0,3 × 6 = 4,8 + 2,0 + 1,8 = 8,6 horas. Em média, cerca de 88,6 horas por ordem podem ser planejadas. Para o planejamento de capacidade em muitas ordens, esse valor esperado é útil.

**Para o compromisso de TAT, isso não é suficiente.** Para 10 % dos pedidos, são acrescentados 15 dias úteis de espera pela peça de reposição. Se você se comprometer com um TAT médio (matematicamente, uma folga de 1,5 dia), vai falhar feio em cada décimo pedido. Opções melhores são:

1. **Manter a peça em estoque:** uma ou duas peças em estoque reduzem muito o risco de TAT. Compare o custo do estoque com o custo do atraso.
2. **Inspecionar mais cedo:** quanto antes o achado for conhecido, mais cedo é possível fazer o pedido. Agende a inspeção como primeira etapa, com prioridade.
3. **Comprometer o TAT por percentil:** por exemplo, um TAT cumprido em 80 ou 90 % dos casos, com uma regra transparente para achados que envolvam peças com longo lead time.
4. **Pool de troca:** para achados frequentes, um pool de troca de componentes rotativos pode desacoplar o TAT do ciclo de reparo.

### 13.5 Regras práticas para o planejamento de MRO

- **Registre sistematicamente o histórico de achados.** Sem dados sobre a frequência e o esforço dos achados, todo plano continua sendo uma estimativa.
- **Reserve capacidade para trabalhos não rotineiros.** Se você carregar o hangar ou a oficina com 100 % de trabalho rotineiro, não sobra espaço para os achados.
- **Verifique a disponibilidade de peças antes de aceitar o pedido.** Peças críticas com longo lead time são o maior risco de TAT.
- **Verifique a vida útil e o histórico das peças.** Peças sem rastreabilidade completa não podem ser reinstaladas (Seção 4.4).
- **Programe de forma visível os especialistas de gargalo.** Inspetores de END, pessoal autorizado a aprovar o retorno ao serviço e oficinas especializadas costumam ser o gargalo.
- **Informe os clientes cedo sobre os achados.** As decisões de aprovação do cliente são, com frequência, a espera mais longa do processo.

## 14. Gêmeo digital e fio digital

### 14.1 Termos

Um [gêmeo digital](https://www.m365.fm/entity/digital-twin/) da produção é um modelo da fábrica real, alimentado com dados atuais e usado para análise, planejamento e simulação. Ele abrange recursos, ordens, roteiros, estoques e regras. O fio digital é a ligação contínua dos dados de um produto ao longo do seu ciclo de vida: do projeto à fabricação e inspeção, até a operação e a manutenção. Na aeroespacial, o fio digital está intimamente ligado à rastreabilidade e à gestão de configuração, porque conecta o projetado, o fabricado e o mantido.

### 14.2 Benefícios para o planejamento e a qualidade

- **Planejamento:** o gêmeo da fábrica viabiliza cenários e otimização com base no estado atual (ver Seção 11.4).
- **Rastreabilidade:** o fio digital responde a perguntas sobre lotes, processos e configurações em minutos, em vez de dias.
- **Mudanças:** o impacto de uma alteração de projeto sobre ordens abertas, estoques e roteiros torna-se visível.
- **MRO:** vincular o histórico de fabricação aos achados de manutenção permite conclusões sobre fragilidades de processo e de projeto.

### 14.3 Pré-requisitos

Um gêmeo digital só é tão bom quanto os seus dados. Antes de investir em modelos, verifique roteiros, tempos padrão, calendários de capacidade, qualificações e a qualidade das confirmações. A consultoria 4flow aponta listas de materiais incorretas, prazos de entrega desatualizados e dados espalhados por plataformas de ERP, PLM e MES desconectadas como obstáculos típicos na aeroespacial, que muitas vezes levam os planejadores de volta a planilhas isoladas [33]. O guia irmão [Gêmeo digital na manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/) aborda este tema com mais profundidade; questões de arquitetura de TI, como conectar dados de máquinas e de planejamento a plataformas em nuvem, são tratadas no guia [TI de manufatura com Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/). Para dados sujeitos a controles de exportação ou às regras de CUI, o local de armazenamento e os direitos de acesso devem ser esclarecidos desde o início [36][37][49]. Em programas de defesa dos EUA, isso inclui o nível de CMMC exigido para os sistemas que armazenam os dados [49][50].

## 15. KPIs para planejamento e controle

| KPI | Definição | Por que importa na indústria aeroespacial |
|---|---|---|
| Entrega no prazo (OTD) | proporção de entregas na data comprometida (acordar a definição e a janela de tolerância com o cliente) | critério central das avaliações de fornecedores; citado como requisito na AS9100 [14] |
| Lead time | tempo desde o início do pedido até a conclusão, como média e dispersão | determina a capacidade de entrega e o estoque (Lei de Little) [27] |
| Trabalho em processo (WIP) | número ou valor dos pedidos no chão de fábrica | indicador antecedente de aumento dos lead times |
| Utilização do gargalo | tempo ocupado ÷ tempo disponível no gargalo | determina a vazão; acima de 90 % os tempos de espera aumentam fortemente [38] |
| Aderência ao cronograma | proporção de operações concluídas dentro da janela de tempo planejada | mostra se o plano é realista |
| Escapes | número de peças defeituosas que chegam ao cliente | maior impacto de custo, frequentemente uma métrica do cliente; elemento obrigatório do sistema de qualidade para detentores de aprovação de produção da FAA [41] |
| Rendimento de primeira passagem (FPY) | proporção de peças sem retrabalho ou sucata | o retrabalho consome capacidade do gargalo |
| Lead time de FAI | tempo desde a conclusão do primeiro artigo até a aprovação | fator frequentemente subestimado em partidas de produção e mudanças |
| Desvio da curva de aprendizado | horas reais por unidade versus a curva-alvo | mostra se as premissas de lançamento se confirmam |
| Tempo de turnaround (TAT) | tempo desde a entrada até o retorno em MRO, como média e percentil | principal critério para clientes de MRO |
| Taxa de achados | proporção de pedidos com trabalho não rotineiro e seu esforço | base do planejamento de capacidade de MRO |

**Uma observação sobre medição:** Defina cada KPI de forma inequívoca e aplique a definição de maneira consistente. As definições de OTD, em particular, diferem entre clientes (referência à primeira data solicitada ou à data confirmada, entrega antecipada permitida, entrega parcial ou total). Uma métrica que cada um calcula de forma diferente não controla nada. O guia irmão [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) trata das definições de KPI com mais detalhes.

## 16. Abordagem: seis passos para um plano confiável

**Passo 1: Medir a situação atual.** Levantar lead times, WIP, OTD e utilização por recurso durante pelo menos três meses. Um mapa do fluxo de valor para as famílias de peças mais importantes mostra onde o tempo se perde.

**Passo 2: Identificar gargalos.** Onde os pedidos se acumulam? Qual recurso determina a vazão? Incluir processos especiais terceirizados, inspeção e qualificações de pessoal.

**Passo 3: Limpar os dados mestres.** Roteiros, tempos padrão, tempos de setup, calendários de capacidade, qualificações, lead times de reposição. Sem essa base, qualquer ferramenta de planejamento produz resultados errados.

**Passo 4: Introduzir regras de controle.** Limitar o WIP, vincular a liberação ao gargalo, proteger o gargalo com um buffer e definir regras de prioridade.

**Passo 5: Introduzir programação baseada em restrições.** Adicionar ao ERP um sequenciamento detalhado que considere capacidade finita, qualificações e janelas de processos terceirizados. Começar com uma área piloto, de preferência no gargalo.

**Passo 6: Estabelecer cenários e um ciclo de realimentação.** Usar simulação para decisões de taxa de produção e investimento e conciliar semanalmente plano e realizado. Continuar aprimorando os parâmetros de planejamento com base nas confirmações.

> **Verificação rápida para gerentes de fábrica e de planejamento: cinco perguntas que você pode responder nesta semana**
>
> 1. Qual recurso é hoje o seu gargalo, e qual foi a sua utilização nas últimas quatro semanas?
> 2. Quantos pedidos estão agora no chão de fábrica, e quantos deles aguardam processos especiais terceirizados ou inspeção?
> 3. Quanto tempo leva para localizar todos os números de série de um lote específico de matéria-prima?
> 4. Quais tempos padrão você está usando para peças que acabaram de ser lançadas: tempos de taxa madura ou uma curva de aprendizado?
> 5. O que acontece com a sua entrega no prazo se o seu processador terceirizado mais importante ficar parado por duas semanas?
>
> Se não conseguir responder com dados a uma dessas perguntas em um dia, comece pelo Passo 1.

**Cronograma:** Os passos 1 a 4 não exigem novo software e, na experiência do autor, podem ser implementados em muitas empresas em poucos meses [unverified: afirmação baseada na experiência do autor, sem fonte]. Os passos 5 e 6 exigem a implementação de software; sua duração depende principalmente da qualidade dos dados mestres. Não há dados setoriais confiáveis sobre a duração.

## 17. Erros comuns e como evitá-los

1. **Planejar com capacidade infinita.** A lógica de MRP no ERP ignora gargalos. Resultado: planos inviáveis desde o início. *Correção:* programação detalhada com capacidade finita.
2. **Liberar mais ordens para entregar mais rápido.** De acordo com a Lei de Little, um WIP maior aumenta o lead time. *Correção:* vincular a liberação ao gargalo.
3. **Modelar processos externos como lead time fixo.** Processos externos têm capacidades, cadências e variabilidade. *Correção:* acordar janelas de atendimento e planejá-las como um recurso.
4. **Esquecer inspeção e FAI.** O laboratório de inspeção e os inspetores não são planejados e se tornam um gargalo oculto. *Correção:* etapas de inspeção como operações com capacidade.
5. **Usar tempos padrão de taxa madura durante o lançamento.** As curvas de aprendizado são ignoradas e o lançamento fica subdimensionado. *Correção:* curva de aprendizado baseada nos seus próprios dados.
6. **Avaliar a média em vez do gargalo.** Uma utilização média de 75 % não diz nada sobre o recurso gargalo. *Correção:* avaliar recurso por recurso e concentrar-se no gargalo.
7. **Reconstruir a rastreabilidade após o fato.** Confirmações ausentes são recompostas no final. *Correção:* registrar durante o processo e atribuir o material antes do início.
8. **Ignorar qualificações.** O plano atribui tarefas a pessoas sem qualificações válidas. *Correção:* matriz de qualificações como restrição.
9. **Tratar metas de taxa como compromissos.** A capacidade é construída com base em uma meta oficial que depois escorrega. *Correção:* cenários com gatilhos.
10. **Assumir compromissos com base na média em MRO.** Compromissos de TAT baseados na média são regularmente descumpridos quando surgem constatações. *Correção:* percentis e uma estratégia de peças.
11. **Deixar que pedidos urgentes virem regra.** A agilização constante destrói a estabilidade do cronograma. *Correção:* regras claras de prioridade e direitos de intervenção.
12. **Software antes dos dados.** Um APS é introduzido antes de os dados mestres estarem corretos. *Correção:* qualidade de dados como primeiro pacote de trabalho.
13. **Tratar dados controlados como um detalhe de TI.** Pedidos sob ITAR ou CUI acabam em um sistema de planejamento ou tenant de nuvem não preparado para eles. *Correção:* esclarecer o escopo de controle de exportação e CMMC antes de selecionar ou implantar software de planejamento [36][49].

## 18. iFAKT e aeroespacial

> **Nota: O autor trabalha na iFAKT GmbH.**

A [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), com sede em Stuttgart, Alemanha, desenvolve o software [Polaris](https://www.m365.fm/entity/polaris/). De acordo com o site da empresa, o Polaris conecta dados de ERP a um gêmeo digital da produção para otimizar planos. A plataforma inclui módulos para modelagem de fluxo de valor e de processos de negócio, simulação, otimização de planejamento (Optimizer), execução no chão de fábrica (Operator) e análises (Analyzer) [31]. O site lista o setor aeroespacial como um segmento específico e descreve o suporte a fornecedores e fabricantes com processos de fabricação complexos [31].

Como referência aeroespacial, a iFAKT publica um estudo de caso com a Airbus Netherlands. Desde 2018, o site produz estruturas de empuxo para os módulos de propulsão do foguete Ariane 6 (Vulcain Aft Bay e Vinci Thrust Frame). Segundo o estudo de caso, os módulos do Polaris Optimizer, Operator e Analyzer apoiam essa produção há sete anos. Os requisitos declarados foram documentação digital, garantia de qualidade durante o processo, lead times menores, programação automatizada de ordens e alocação otimizada de recursos. O estudo de caso descreve resultados qualitativos, como tempos de espera menores graças a uma resposta mais rápida a mudanças não planejadas, tempos de transferência menores e status de ordens disponível a qualquer momento; não apresenta números [32]. O gerente de AIT da Airbus Netherlands é citado afirmando que as ferramentas do Polaris ajudaram a trazer mais estrutura à produção [32].

Na sua página inicial, a iFAKT também apresenta números de melhoria com o qualificador "até" (por exemplo, para lead time e capacidade). Como nenhuma metodologia foi publicada para eles, esses números não são utilizados aqui [31].

**Contexto:** Os requisitos descritos neste guia (programação baseada em restrições, qualificações, operações externas, simulação de cenários de taxa, feedback do chão de fábrica) são neutros em relação a fornecedores. O Polaris é uma de várias soluções disponíveis no mercado. Avalie qualquer sistema pelos critérios da Seção 11.3 e com um piloto usando os seus próprios dados. O artigo irmão [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) descreve o software com mais detalhes.

## 19. Glossário

**APQP (Advanced Product Quality Planning):** Planejamento estruturado da qualidade para novos produtos e processos; no setor aeroespacial é regido pela AS9145 / EN 9145.

**APS (Advanced Planning and Scheduling):** Software de planejamento que programa a produção considerando capacidade finita e disponibilidade de materiais.

**As-built / as-designed:** A configuração efetivamente fabricada, em oposição à configuração especificada pela engenharia.

**Gargalo (constraint):** O recurso que limita a vazão de todo o sistema.

**CAMO (Continuing Airworthiness Management Organisation):** Organização aprovada pela EASA que gerencia a aeronavegabilidade continuada de uma aeronave (EASA Part-CAMO).

**CMMC (Cybersecurity Maturity Model Certification):** Programa do Departamento de Defesa dos EUA para verificar a cibersegurança de contratados que tratam FCI ou CUI; cláusula contratual DFARS 252.204-7021.

**CUI (Controlled Unclassified Information):** Informação governamental que requer salvaguarda, mas não é classificada; sua presença em sistemas de planejamento os coloca no escopo do CMMC.

**Fio digital (Digital thread):** Vínculo contínuo de todos os dados do produto ao longo do ciclo de vida.

**Drum-buffer-rope (DBR):** Princípio de controle da Teoria das Restrições no qual o gargalo define o ritmo e limita a liberação de material.

**EASA Form 1:** Certificado de liberação autorizada para peças aeronáuticas, emitido por organizações de produção ou manutenção aprovadas pela EASA.

**Effectivity:** Declaração do número de série, da aeronave ou da data a partir da qual uma configuração ou modificação se aplica.

**Escape:** Peça defeituosa que chegou ao cliente.

**FAA Form 8130-3:** Certificado de liberação autorizada da FAA (etiqueta de aprovação de aeronavegabilidade) para aprovação de aeronavegabilidade doméstica, retorno ao serviço e exportação; emitido apenas por pessoas e organizações autorizadas pela FAA.

**FAI (First Article Inspection):** Inspeção completa da primeira peça de produção em relação a todas as características de projeto, conforme AS9102 / EN 9102.

**Genealogia:** Relações de parentesco entre material, lotes, peças e conjuntos.

**HMLV (high mix, low volume):** Produção de muitas variantes em pequenas quantidades.

**Característica-chave (Key characteristic):** Característica cuja variação afeta significativamente o encaixe, a função, o desempenho ou a vida útil; regida pela AS9103 / EN 9103.

**Curva de aprendizado (Learning curve):** Relação entre a quantidade acumulada e o esforço por unidade; baseada em Wright (1936).

**LLP (life-limited part):** Peça com número máximo aprovado de ciclos ou horas.

**MRO (maintenance, repair and overhaul):** Serviços de manutenção, reparo e revisão de aeronaves e componentes.

**Nadcap:** Programa de acreditação gerido pela indústria para processos especiais, administrado pelo Performance Review Institute (PRI).

**OTD (on-time delivery):** Percentual de entregas realizadas na data comprometida.

**Part 145:** Nos EUA, o certificado de estação de reparo da FAA (14 CFR Part 145); na UE, a aprovação de organização de manutenção da EASA.

**Part 21 Subpart G:** Nos EUA, o certificado de produção da FAA (14 CFR 21.131 a 21.150); na UE, a Aprovação de Organização de Produção (POA) da EASA.

**PMA (Parts Manufacturer Approval):** Aprovação de produção da FAA para peças de reposição e modificação (14 CFR Part 21, Subpart K).

**PPAP (Production Part Approval Process):** Procedimento de aprovação de peças de produção; no setor aeroespacial, parte da AS9145 / EN 9145.

**Taxa (Rate):** Quantidade produzida por mês; por exemplo, taxa 75 = 75 aeronaves por mês.

**Estação de reparo (Repair station):** Organização de manutenção certificada pela FAA segundo 14 CFR Part 145.

**Processo especial (Special process):** Processo cujo resultado não pode ser totalmente verificado na peça acabada sem destruí-la, como tratamento térmico ou tratamento superficial.

**TAT (turnaround time):** Tempo desde a entrada de uma ordem de manutenção até a devolução ao cliente.

**Nível 1 / Nível 2 (Tier 1 / Tier 2):** Níveis de fornecimento; o Nível 1 fornece diretamente o fabricante da aeronave, o Nível 2 fornece o Nível 1.

**WIP (work in process):** Estoque em processo no chão de fábrica.

## 20. FAQ: perguntas frequentes sobre planejamento da produção aeroespacial

**O que é planejamento da produção aeroespacial?**
É o planejamento de quantidades, prazos, capacidade e materiais para a fabricação de aeronaves, motores e componentes, sob os requisitos de evidência do setor. Ele combina produção de alto mix e baixo volume, longos lead times e processos especiais terceirizados com rastreabilidade rigorosa e controle de configuração. As taxas de produção dos clientes fabricantes de aeronaves definem o ritmo em todos os níveis da cadeia de fornecimento.

**Por que o escalonamento por ERP não é suficiente para o setor aeroespacial?**
A lógica clássica do MRP calcula com lead times fixos e sem limites de capacidade. Um cronograma de produção viável precisa considerar capacidade finita, qualificações de pessoas e máquinas e vagas em processadores terceirizados. Isso é feito por sistemas APS ou por uma camada estendida de programação detalhada.

**Qual taxa de produção a Airbus planeja para a família A320?**
De acordo com seu relatório dos primeiros nove meses de 2026, a Airbus tem como meta 70 a 75 aeronaves por mês até o fim de 2027, estabilizando depois na taxa 75 [3]. A meta foi adiada várias vezes, em parte por falta de motores [4].

**Qual é a taxa de produção do 737 da Boeing?**
Em maio de 2026, o CEO da Boeing afirmou que a linha do 737 operava na taxa 47 [8]. O comunicado do terceiro trimestre de 2026 da Boeing descreve o programa como em progresso rumo à produção estabilizada de 47 por mês [47]. A FAA havia limitado a taxa em 38 após janeiro de 2024 e aprovou 42 em outubro de 2025 [7].

**Quais normas um fornecedor aeroespacial precisa conhecer?**
O núcleo é a AS9100D (EN 9100:2018). Dependendo do trabalho, acrescente AS9102 (inspeção do primeiro item), AS9103 (características-chave), AS9145 (APQP/PPAP), AS9120 (distribuidores) e, com frequência, a acreditação Nadcap para processos especiais. Detentores de aprovação de produção trabalham sob o FAA 14 CFR Part 21 (ou EASA Part 21 Subpart G); fornecedores de defesa também estão sujeitos a ITAR/EAR, DFARS e CMMC.

**Qual é a diferença entre AS9100 e EN 9100?**
Nenhuma no conteúdo. A norma do IAQG é publicada como AS9100 pela SAE International nas Américas, como EN 9100 na Europa e como JISQ 9100 na Ásia [13][14].

**A AS9100D ainda está válida?**
Sim. O IAQG trabalha em uma revisão a ser publicada como IA9100. Em outubro de 2026, a data de publicação e o período de transição não haviam sido confirmados, e os certificados AS9100D continuam válidos [15].

**O que a AS9100 exige em termos de rastreabilidade?**
Exige a rastreabilidade das matérias-primas, materiais e processos utilizados, bem como de ferramentas e pessoas [14]. Os clientes acrescentam requisitos específicos em seus requisitos de qualidade para fornecedores, e os detentores de aprovação de produção da FAA repassam seus próprios requisitos do sistema de qualidade [41].

**Quando é exigida uma inspeção do primeiro item (AS9102)?**
Para peças novas e para mudanças que possam afetar forma, encaixe ou função, por exemplo em projeto, material, fonte de fabricação, processo, ferramental ou local, e após uma parada de produção superior a dois anos. Dependendo do escopo, é exigida uma FAI completa ou parcial [34].

**O que é a curva de aprendizado na fabricação de aeronaves e por que ela importa para o planejamento?**
A curva de aprendizado descreve como o esforço por unidade cai à medida que a quantidade acumulada aumenta. Wright mostrou uma redução de cerca de 20 % a cada duplicação em 1936 [25]. Se você planeja um lançamento com tempos da taxa madura, subestima significativamente a capacidade necessária (exemplo prático na Seção 9).

**Como planejar corretamente uma rampa de taxa?**
Avalie cada recurso individualmente, especialmente o gargalo, em vez da utilização média. Calcule vários cenários de taxa, considere as curvas de aprendizado, a capacidade de inspeção, os tempos de qualificação e as aprovações, e garanta a capacidade externa por contrato. A lista de verificação da Seção 10.3 ajuda.

**O que é a Nadcap?**
A Nadcap é um programa de acreditação gerenciado pela indústria para processos especiais, como tratamento térmico, processamento químico, soldagem e ensaios não destrutivos, fundado em 1990 e administrado pelo Performance Review Institute [21][54]. Muitos clientes exigem a acreditação Nadcap para processos especiais.

**O APS consegue lidar com processos terceirizados, como o tratamento térmico?**
Sim, desde que sejam modelados como recursos com capacidade e vagas, e não como um lead time fixo. Combine vagas semanais com o processador, registre-as como restrição e torne o certificado devolvido uma condição para a operação seguinte (Seção 7.2).

**O CMMC se aplica a fornecedores do setor aeroespacial?**
Aplica-se a contratados e subcontratados de defesa cujos contratos envolvem informações de contrato federal (FCI) ou informações não classificadas controladas (CUI). A cláusula DFARS entrou em vigor em 10 de novembro de 2025 e está sendo implementada gradualmente ao longo de três anos; ela se estende aos subcontratos que envolvam FCI ou CUI [49].

**Em que o planejamento de MRO difere do planejamento de produção?**
Na manutenção, o escopo do trabalho só é conhecido após a inspeção. O planejamento precisa trabalhar com probabilidades de achados, disponibilidade de peças e folgas. O KPI central é o tempo de turnaround.

**Como uma estação de reparo pode reduzir o tempo de turnaround?**
Inspecionando cedo, mantendo estoque de peças críticas ou fornecendo-as por meio de pools de troca, reservando capacidade para trabalhos não rotineiros e acelerando as aprovações dos clientes. Os compromissos de TAT devem se basear em percentis, e não em médias.

**Quais KPIs são mais importantes para fornecedores do setor aeroespacial?**
Entrega no prazo (OTD), lead time, work in process, utilização do gargalo, escapes e first pass yield. Na manutenção, acrescentam-se o tempo de turnaround e a taxa de achados.

**O que um gêmeo digital traz para a manufatura aeroespacial?**
Permite simular cenários de taxas e investimentos, um replanejamento mais rápido durante interrupções e, junto com o digital thread, respostas rápidas a questões de rastreabilidade. Dados mestres limpos e dados de confirmação são pré-requisitos.

**Onde estão os maiores riscos na cadeia de suprimentos em 2026?**
Segundo a Roland Berger, em mão de obra qualificada, matérias-primas como titânio, fundidos e forjados, fixadores e serviços de ensaio e tratamento de superfície [10]. Para motores, a escassez de componentes está limitando as taxas de produção dos fabricantes de aeronaves [4].

## 21. Conclusão

Em 2026, a indústria aeroespacial tem carteiras de pedidos cheias, mas uma cadeia de suprimentos que só consegue atendê-las lentamente. Para fornecedores e oficinas de manutenção, o planejamento da produção se tornou um fator competitivo. Quem conhece seus gargalos, planeja curvas de aprendizado e processos especiais de forma realista, incorpora rastreabilidade ao fluxo de pedidos e calcula com antecedência cenários de taxa consegue acompanhar as rampas de produção sem abrir mão da entrega no prazo e da qualidade.

O caminho para isso raramente começa pelo software. Começa pela medição, por dados mestres limpos e por regras de controle simples, como WIP limitado e liberação baseada no gargalo. APS, simulação e gêmeos digitais fortalecem essas bases; não as substituem. Os mecanismos são bem conhecidos e documentados há décadas, desde a curva de aprendizado de Wright até a Lei de Little e a Teoria das Restrições. Aplicá-los de forma consistente é a verdadeira tarefa.

## Leitura complementar no m365.fm

**Post e podcast**

- [Planejamento da produção aeroespacial: lead time e rastreabilidade](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)
- Episódio de podcast [Rastreabilidade e genealogia](https://www.m365.fm/show/episodes/traceability-and-genealogy/)

**Páginas de entidades**

[Lead Time](https://www.m365.fm/entity/lead-time/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Constraint-based Scheduling](https://www.m365.fm/entity/constraint-based-scheduling/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) · [iFAKT](https://www.m365.fm/entity/ifakt/) · [Polaris](https://www.m365.fm/entity/polaris/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Guias relacionados**

- [Programação da produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Gêmeo digital na manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [TI de manufatura com Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Mapeamento do fluxo de valor](https://www.m365.fm/en/learn/value-stream-mapping/)
- [KPIs de manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Gestão no chão de fábrica](https://www.m365.fm/en/learn/shop-floor-management/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** é o apresentador do m365.fm e trabalha na iFAKT GmbH. No m365.fm ele escreve sobre planejamento de produção, rastreabilidade, simulação e a digitalização da manufatura. Ele se concentra em como o planejamento baseado em restrições, os gêmeos digitais e o feedback do chão de fábrica funcionam juntos para que os planos se sustentem na prática, mesmo em setores exigentes como o aeroespacial.

**Nota: O autor trabalha na iFAKT GmbH.**

# Sources

All online sources accessed on November 20, 2026. Sources 41 to 55 were added for the US version and verified online on that date.

1. BDLI (German Aerospace Industries Association): BDLI Industry Data 2026: Aerospace Industry Sets New Records for Revenue and Employment. Press release, Berlin, May 27, 2026. https://www.bdli.de/en/meldungen/bdli-branchendaten-2026-luft-und-raumfahrtindustrie-erreicht-neue-rekorde-bei-umsatz-und
2. Nasdaq/RTTNews: Airbus Delivers 793 Aircraft In 2025 As Order Backlog Reaches Record Level. January 2026. https://www.nasdaq.com/articles/airbus-delivers-793-aircraft-2025-order-backlog-reaches-record-level
3. Airbus: Airbus reports Nine-Month (9m) 2026 results. Press release, October 28, 2026. https://www.airbus.com/en/newsroom/press-releases/2026-10-airbus-reports-nine-month-9m-2026-results
4. Aerospace Global News: Airbus accuses Pratt & Whitney of failing to deliver as A320 ramp up stalls. April 15, 2026. https://aerospaceglobalnews.com/news/airbus-pratt-whitney-a320-ramp-up/
5. Terminair: Airbus delivers 74 aircraft in October, needs 249 more by year-end for its 870 target. November 5, 2026. https://terminair.com/story/113485-airbus-delivers-74-aircraft-in-october-needs-249
6. Boeing: Boeing Reports Fourth-Quarter Results. Press release, January 27, 2026. https://boeing.mediaroom.com/2026-01-27-Boeing-Reports-Fourth-Quarter-Results
7. Assembly Magazine: Boeing Cleared to Boost Production of 737 MAX. October 22, 2025. https://www.assemblymag.com/articles/99622-boeing-cleared-to-boost-production-of-737-max
8. CAPA Centre for Aviation: Boeing testing production rate of 47 aircraft per month, cautious of increasing to 52: CEO. May 28, 2026. https://centreforaviation.com/news/boeing-testing-production-rate-of-47-aircraft-per-month-cautious-of-increasing-to-52-ceo-1360867
9. ADS Group (summary of the IATA release): Supply chain challenges could cost airlines over $11bn in 2025. October 14, 2025; study "Reviving the Commercial Aircraft Supply Chain" by IATA and Oliver Wyman. https://www.adsgroup.org.uk/knowledge/industry-member-news/supply-chain-challenges-could-cost-airlines-over-11bn-in-2025/
10. Roland Berger: Global Aerospace Supply Chain Study 2026. June 2026 (survey of 95 companies, January/February 2026). https://mailing.rolandberger.com/hubfs/07_presse/Aerospace%20Supply%20Chain%20Study%202026%20Roland%20Berger.pdf
11. CNBC: RTX to take $3 billion charge on Pratt & Whitney engine problem. September 11, 2023. https://www.cnbc.com/2023/09/11/rtx-to-take-3-billion-charge-on-pratt-whitney-engine-problem.html
12. Malay Mail (Reuters): Boeing suspends Russian titanium as Airbus keeps buying. March 8, 2022. https://www.malaymail.com/news/money---international/2022/03/08/boeing-suspends-russian-titanium-as-airbus-keeps-buying/2046061
13. IAQG: Standards (overview of the 9100 family). https://ma.iaqg.org/standards
14. TÜV Rheinland: FAQ EN/AS 9100ff. series of standards (German). https://certification.tuv.com/content-media-files/master-content/services/systems/0403-tuv-rheinland-en-as-9100ff-series-of-standards/tuv-rheinland-en-as-9100-faq-de.pdf
15. The QMS Collective: The Current AS9100 Revision, and How to Read Dates That Keep Slipping. October 16, 2026. https://theqmscollective.com/blog/current-as9100-revision-confirmed-vs-expected-ia9100
16. Estonian Centre for Standardisation (EVS): EVS-EN 9145:2018 Aerospace series – Requirements for Advanced Product Quality Planning and Production Part Approval Process. https://www.evs.ee/en/evs-en-9145-2018
17. DIN Media: DIN EN 9102:2025-01, Aerospace series – Quality management systems – First article inspection requirement (EN 9102:2024). https://www.dinmedia.de/en/standard/din-en-9102/377807227
18. Net-Inspect: AS9102 First Article Inspection Report Rev B vs Rev C. https://www.net-inspect.com/blog/as9102-rev-b-vs-rev-c/
19. IAQG: 9103 Variation Management of Key Characteristics. https://iaqg.org/standard/9103-variation-management-of-key-characteristics/ ; EVS-EN 9103:2023: https://www.evs.ee/en/evs-en-9103-2023
20. EVS: EVS-EN 9110:2018 Quality Management Systems – Requirements for Aviation Maintenance Organizations. https://www.evs.ee/en/evs-en-9110-2018
21. Wikipedia: Nadcap. https://en.wikipedia.org/wiki/Nadcap
22. EASA: Easy Access Rules for Initial Airworthiness and Environmental Protection (Part 21), 21.A.131 Scope (Subpart G). https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-initial-airworthiness-and?page=13
23. EASA: Easy Access Rules for Continuing Airworthiness (Regulation (EU) No 1321/2014 with Part-M, Part-145, Part-CAMO; amending Regulation (EU) 2019/1383). https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-continuing-airworthiness?page=66
24. Wright, T. P.: Factors Affecting the Cost of Airplanes. Journal of the Aeronautical Sciences, vol. 3, no. 4 (1936), pp. 122–128. Reference: https://en.wikipedia.org/wiki/Theodore_Paul_Wright
25. Wikipedia: Experience curve effect. https://en.wikipedia.org/wiki/Experience_curve_effect
26. U.S. Government Accountability Office (GAO): Cost Estimating and Assessment Guide, Cumulative Average Formulation. https://gaoinnovations.gov/cost-guide/cumulative-average-formulation.html
27. Little, John D. C.: A Proof for the Queuing Formula L = λW. Operations Research, vol. 9, no. 3 (1961), pp. 383–387.
28. Goldratt, Eliyahu M.; Cox, Jeff: The Goal. A Process of Ongoing Improvement. North River Press, 1984.
29. Oliver Wyman: Why engine availability is a growing challenge for aviation. September 24, 2026. https://www.oliverwyman.com/our-expertise/insights/2026/sep/aviation-engine-availaibility-bottlenecks.html
30. Oliver Wyman / ARSA: Global Fleet & MRO Market Forecast 2026–2036, Executive Summary. 2026. https://arsa.org/wp-content/uploads/2026/03/ARSA-OW-2026FleetMROMarketReport-ExecSum-2026.pdf
31. iFAKT GmbH: website (home page, solutions, contact, imprint). https://www.ifakt.de/
32. iFAKT GmbH: Customer Reference Airbus Netherlands. https://www.ifakt.de/references/Airbus_Netherlands_Reference.pdf
33. 4flow: Advanced planning in multi-level production networks in aviation and aerospace. https://4flow.com/blog/advanced-planning-in-multi-level-production-networks-in-aviation-and-aerospace
34. InspectionXpert: When to Conduct a First Article Inspection. https://www.inspectionxpert.com/blog/when-to-conduct-a-first-article-inspection
35. IAQG: 9145 Guidance Presentation (APQP phases, PPAP elements). https://ma.iaqg.org/wp-content/uploads/2019/10/9145-Guidance-Presentation.pdf
36. Electronic Code of Federal Regulations: International Traffic in Arms Regulations, 22 CFR Parts 120–130 (https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M); Export Administration Regulations, 15 CFR Parts 730–774 (https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C).
37. Produktion (German trade journal): Nachweispflicht als Nadelöhr: Warum die Rückverfolgbarkeit über Millionenaufträge in der Verteidigungsindustrie entscheidet ("Evidence requirements as a bottleneck: why traceability decides multi-million defense contracts"). October 27, 2026. https://www.produktion.de/ruestung-aerospace/nachweispflicht-als-nadeloehr-warum-die-rueckverfolgbarkeit-ueber-millionenauftraege-in-der-verteidigungsindustrie-entscheidet/2758489
38. Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society, vol. 57, no. 4 (1961), pp. 902–904.
39. Defence Agenda: Airbus Keeps Production Ramp-Up Targets Unchanged. August 1, 2026. https://defenceagenda.com/airbus-production-ramp-up-targets-h1-2026
40. Martin, James R.: Learning Curve Summary (cumulative average model after Wright, incremental unit model after Crawford). Management And Accounting Web. https://maaw.info/LearningCurveSummary.htm
41. 14 CFR 21.137 Quality system (production certificates), 14 CFR 21.307 Quality system (PMA), and table of subparts of 14 CFR Part 21. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/14/21.137 ; https://www.law.cornell.edu/cfr/text/14/21.307 ; https://www.law.cornell.edu/cfr/text/14/part-21 (official text: https://www.ecfr.gov/current/title-14/chapter-I/subchapter-C/part-21/subpart-G)
42. Electronic Code of Federal Regulations: 14 CFR Part 145 Repair Stations (145.1, 145.59, 145.109, 145.163, 145.201, 145.219). https://www.ecfr.gov/current/title-14/chapter-I/subchapter-H/part-145
43. FAA: Order 8130.21H, Procedures for Completion and Use of the Authorized Release Certificate, FAA Form 8130-3, Airworthiness Approval Tag. Effective February 1, 2014. https://www.faa.gov/documentLibrary/media/Order/FAA_Order_8130.21H.pdf
44. SAE International: AS9100D Quality Management Systems – Requirements for Aviation, Space, and Defense Organizations (revised September 20, 2016). https://saemobilus.sae.org/standards/as9100d-quality-management-systems-requirements-aviation-space-defense-organizations
45. SAE International: AS9145 Aerospace Series – Requirements for Advanced Product Quality Planning and Production Part Approval Process (issued November 8, 2016). https://saemobilus.sae.org/standards/as9145-aerospace-series-requirements-advanced-product-quality-planning-production-part-approval-process
46. ANSI Webstore: SAE AS9102C-2023, Aerospace Series – First Article Inspection Requirements. https://webstore.ansi.org/standards/sae/sae9102c2023
47. Boeing: Boeing Reports Third-Quarter Results. Press release, Arlington, Va., October 27, 2026. https://boeing.mediaroom.com/2026-10-27-Boeing-Reports-Third-Quarter-Results
48. Aerospace Industries Association (AIA): 2026 AIA Facts & Figures: U.S. Aerospace & Defense Industry Leads the World with $1 Trillion in Sales. June 25, 2026 (with S&P Global Market Intelligence, 2025 data). https://www.aia-aerospace.org/?p=27492 ; overview: https://aia-aerospace.org/industry-impact
49. Federal Register, vol. 90, no. 173 (September 10, 2025): Defense Federal Acquisition Regulation Supplement: Assessing Contractor Implementation of Cybersecurity Requirements (DFARS Case 2019-D041), effective November 10, 2025. https://www.govinfo.gov/content/pkg/FR-2025-09-10/html/2025-17359.htm
50. U.S. Department of Defense, Office of Small Business Programs: Cybersecurity Maturity Model Certification (CMMC) 2.0. https://business.defense.gov/Programs/Cyber-Security-Resources/CMMC-20
51. 48 CFR 252.225-7009 Restriction on Acquisition of Certain Articles Containing Specialty Metals. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/48/252.225-7009
52. FAA: Advisory Circular AC 21-29D, Detecting and Reporting Suspected Unapproved Parts. July 12, 2016. https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_21-29D.pdf
53. 14 CFR 91.417 Maintenance records. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/14/91.417
54. Boeing Suppliers: Nadcap Accreditation FAQ (Nadcap as an "industry-managed approach to conformity assessment of 'special processes'", administered by PRI). https://www.boeingsuppliers.com/nadcap/nadcap_faq.htm
55. Aerospace Manufacturing (aero-mag.com): Lack of capacity planning adding to ramp-up challenge, report reveals (Vendigital rate readiness assessment, 100+ suppliers). Undated. https://www.aero-mag.com/lack-of-capacity-planning-adding-to-ramp-up-challenge-report-reveals
