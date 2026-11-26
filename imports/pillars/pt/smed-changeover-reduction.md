# SEO metadata

| Field | Value |
|---|---|
| Meta title | SMED: Troca Rápida e Redução do Tempo de Setup no Lean |
| Meta description | SMED (troca de matriz em um único dígito de minuto) explicado: troca rápida em 8 etapas, setup interno vs. externo, fórmulas de tempo de troca e exemplos. |
| Slug | `smed-changeover-reduction` |

# SMED: Redução do Tempo de Troca de Ferramentas em um Único Dígito de Minuto, Passo a Passo

> **Resposta curta:** SMED (single-minute exchange of die, troca de ferramental em minutos únicos) é um método para trocar uma máquina ou linha de um produto para o seguinte no menor tempo possível, com meta de menos de dez minutos, um número de "um dígito" em minutos. Sua ideia central vem de Shigeo Shingo: separar o trabalho de preparação que só pode ser feito com a máquina parada (preparação interna) do trabalho que pode ser feito com a máquina em funcionamento (preparação externa), converter o máximo possível de trabalho interno em externo e, em seguida, simplificar tudo o que restar [1][6].

> **Pontos-chave**
> - O tempo de troca vai da última peça boa da corrida anterior até a primeira peça boa da nova corrida, na velocidade normal. O aquecimento e os ajustes contam como tempo de troca [2][21].
> - O SMED segue uma ordem fixa: observar, separar o interno do externo, converter o interno em externo, simplificar o interno, simplificar o externo, padronizar e repetir [5].
> - A maioria dos ganhos iniciais vem da organização (pré-montagem de materiais, listas de verificação, carrinhos, trabalho em paralelo), e não de equipamentos caros [19][20].
> - Uma troca mais curta só compensa totalmente quando o tempo economizado é aproveitado: lotes menores, trocas mais frequentes com um EPEI menor, ou mais capacidade em um gargalo. Decida qual dessas opções antes de iniciar o projeto.
> - O tamanho do lote e o estoque crescem com o tempo de troca. Na fórmula clássica do tamanho econômico de lote, reduzir o custo de preparação em 75 por cento reduz o lote econômico à metade.
> - Toda etapa de preparação interna acontece com o equipamento parado. Nos EUA, preparar equipamento é considerado "manutenção" pelo padrão de bloqueio e etiquetagem (lockout/tagout) da OSHA, a menos que se aplique uma exceção restrita [8][9].
> - Os ganhos de troca se perdem sem trabalho padronizado, auditorias e um indicador de troca no quadro de gestão do chão de fábrica. Pesquisas criticaram a prática do SMED por subutilizar o projeto de equipamentos e por fraca sustentação dos resultados [12][13].
> - Bons KPIs: tempo médio de troca e sua dispersão, percentual de trocas dentro do padrão, refugo no arranque, número de trocas por semana, EPEI e dias de estoque.

## Sumário

1. [O que é SMED? Definição e ideia central](#o-que-é-smed-definição-e-ideia-central)
2. [Por que o tempo de troca importa: tamanho de lote, estoque, flexibilidade e OEE](#por-que-o-tempo-de-troca-importa-tamanho-de-lote-estoque-flexibilidade-e-oee)
3. [História: de Taylor e Ford a Shingo e Toyota](#história-de-taylor-e-ford-a-shingo-e-toyota)
4. [Como medir corretamente o tempo de troca](#como-medir-o-tempo-de-troca-corretamente)
5. [O método SMED em 8 etapas](#o-método-smed-em-8-etapas)
6. [As oito técnicas de Shingo com exemplos](#as-oito-técnicas-de-shingo-com-exemplos)
7. [Técnicas de troca por tipo de equipamento](#técnicas-de-troca-de-produção-por-tipo-de-equipamento)
8. [Exemplo de SMED: um projeto completo em uma injetora](#exemplo-de-smed-um-projeto-completo-em-uma-máquina-de-injeção)
9. [De trocas mais curtas a lotes menores: EPEI e dimensionamento de lote](#de-trocas-mais-curtas-a-lotes-menores-epei-e-dimensionamento-de-lotes)
10. [Segurança: trocas, bloqueio e etiquetagem (lockout/tagout) e ergonomia](#segurança-trocas-bloqueio-e-etiquetagem-lockouttagout-e-ergonomia)
11. [Qualidade: aprovação da primeira peça, à prova de erros e liberação de linha regulamentada](#qualidade-aprovação-da-primeira-peça-à-prova-de-erros-e-liberação-regulada-da-linha)
12. [Pessoas e funções: quem faz o quê em uma troca](#pessoas-e-papéis-quem-faz-o-quê-em-uma-troca-de-ferramental)
13. [Modelos e listas de verificação do SMED](#modelos-e-listas-de-verificação-de-smed)
14. [Roteiro de implantação: do piloto a um sistema de trocas em toda a fábrica](#roteiro-de-implantação-do-piloto-a-um-sistema-de-troca-rápida-em-toda-a-fábrica)
15. [KPIs de troca: como medir o progresso](#kpis-de-troca-de-ferramentas-como-medir-o-progresso)
16. [O caso de negócio: custos, ROI e contabilização de estoque](#o-caso-de-negócio-custos-roi-e-contabilização-de-estoque)
17. [SMED e outras ferramentas lean](#smed-e-outras-ferramentas-lean)
18. [Exemplos documentados de SMED](#exemplos-documentados-de-smed)
19. [Erros comuns do SMED](#erros-comuns-no-smed)
20. [Limites e críticas ao SMED](#limites-e-críticas-do-smed)
21. [O SMED vai para o digital: dados, vídeo, MES e programação](#smed-na-era-digital-dados-vídeo-mes-e-programação)
22. [Glossário do SMED](#glossário-de-smed)
23. [FAQ: perguntas sobre SMED e trocas](#faq-perguntas-sobre-smed-e-troca-de-ferramentas)
24. [Conclusão e primeiros passos](#conclusão-e-primeiros-passos)

## O que é SMED? Definição e ideia central

O Lean Enterprise Institute (LEI) define [SMED](https://www.m365.fm/entity/smed/) como um processo para trocar equipamentos de produção de um número de peça para outro no menor tempo possível [1]. "Single-minute" não significa um minuto. Significa um número de um dígito em minutos, ou seja, menos de dez [1]. O termo "die" vem das prensas de estampagem, onde o método foi aplicado pela primeira vez, mas o SMED se aplica a qualquer troca: moldes, dispositivos de fixação, ferramentas de corte, chapas de impressão, peças de formato em uma linha de embalagem, receitas em uma máquina de envase.

Uma [troca](https://www.m365.fm/entity/setup-time/) (também chamada de setup) é o ato de mudar uma máquina ou um grupo de máquinas interligadas, como uma célula ou uma linha de montagem, de um produto para outro [2]. O LEI mede o tempo de troca desde o momento em que a última unidade do lote concluído sai do processo até que a primeira unidade aceitável do lote seguinte seja produzida [2]. Esse limite importa, e voltaremos a ele na seção de medição.

### Setup interno e setup externo

A principal percepção de Shingo foi dividir cada troca em dois tipos de trabalho [1]:

| Tipo | Definição | Exemplos |
|---|---|---|
| **Setup interno** | Trabalho que só pode ser feito com a máquina parada | Desprender e remover o molde antigo, montar o novo, trocar as peças de formato dentro da proteção, ajuste da primeira peça |
| **Setup externo** | Trabalho que pode ser feito enquanto a máquina ainda está operando o lote anterior ou já está operando o seguinte | Buscar o novo molde, ferramentas e material; pré-aquecer um molde; verificar se o novo molde está danificado; devolver o molde antigo ao estoque; documentação |

Em uma troca não melhorada, quase tudo acontece com a máquina parada: o preparador para a máquina e depois vai procurar o molde, a ponte rolante, a chave certa e o desenho. O SMED tira a "procura" e a "busca" do tempo de parada e então ataca o trabalho que realmente exige a máquina parada.

### SMED, troca rápida e redução de setup: os termos

Os termos se sobrepõem, e as fábricas dos EUA os usam como sinônimos:

- **SMED (single-minute exchange of die):** nome de Shingo para o método e para sua meta de minutos de um único dígito [1][6].
- **Troca rápida (QCO, quick changeover):** o termo mais comum no chão de fábrica nos EUA para a mesma prática, usado, por exemplo, pelos centros NIST MEP [18].
- **Redução de setup / redução do tempo de setup:** rótulo geral que abrange o SMED e também mudanças de engenharia nos equipamentos.
- **OTED (one-touch exchange of die):** uma meta mais rigorosa, uma troca em menos de 100 segundos [5].
- **Redução do tempo de troca:** o resultado. O SMED é o método mais utilizado para isso, mas não é a única alavanca; o projeto do produto, o projeto do equipamento e o planejamento também contribuem [13][15].

### A ideia central em uma frase

Não pare a máquina para nada que possa ser feito enquanto ela está funcionando, e torne simples o que precisa acontecer durante a parada, a ponto de não exigir busca, ajustes nem peças de teste.

Na prática, a abordagem SMED separa as tarefas de setup que exigem a máquina parada daquelas que podem ser executadas enquanto ela ainda está em operação, transfere o máximo possível de trabalho para o segundo grupo e, em seguida, reduz o que sobra. Isso torna o SMED um método de melhoria contínua para o processo de troca e uma das ferramentas padrão da manufatura enxuta.

### Benefícios do SMED

Muitas páginas da web listam benefícios com percentuais que raramente têm fonte. Os benefícios abaixo são os mecanismos; o tamanho de cada um depende do seu ponto de partida.

1. **Capacidade:** cada minuto retirado do setup interno devolve um minuto de tempo de máquina. Em um gargalo, isso é produção que toda a fábrica ganha.
2. **Lotes menores e menos estoque:** quando uma troca é barata, é possível produzir cada produto com mais frequência, em quantidades menores. O LEI observa que o EPEx (every product every interval) de uma máquina depende diretamente de seus tempos de troca [3].
3. **Lead times menores e melhor entrega:** menos trabalho em processo significa filas menores; lotes pequenos permitem reagir a mudanças na demanda em dias, e não em semanas.
4. **Qualidade:** trocas padronizadas, com ajustes fixos, reduzem tentativa e erro, sucata de partida e falhas na primeira peça. Menos peças produzidas por lote também significam menos peças em risco quando um defeito é encontrado.
5. **Segurança e ergonomia:** uma troca bem projetada elimina levantamentos desconfortáveis, o ato de alcançar dentro dos moldes e a pressa, desde que a segurança seja projetada na troca e não contornada (veja a seção de segurança).

## Por que o tempo de troca importa: tamanho de lote, estoque, flexibilidade e OEE

Trocas longas empurram as fábricas para uma armadilha previsível. Se uma troca custa duas horas, ninguém quer fazê-la com frequência, então a fábrica roda lotes grandes. Lotes grandes geram estoque, lead times longos e a necessidade de prever a demanda do cliente com maior antecedência. Previsões erram mais quanto mais longe alcançam, então a fábrica acumula ainda mais estoque de segurança. A troca torna-se a razão oculta de metade do estoque da planta.

### A armadilha do tamanho de lote em números

**Exemplo ilustrativo:** Uma prensa de estampagem opera 16 horas por dia (960 minutos). Cada troca leva 90 minutos. A prensa produz 8 números de peça.

- Se a prensa troca duas vezes ao dia, perde 180 minutos, ou 18,8 por cento do seu tempo (180 / 960). Produzir todos os 8 números de peça leva então 4 dias, de modo que cada peça é feita aproximadamente a cada 4 dias, e a planta precisa manter cerca de 4 dias de estoque para cada peça, além do estoque de segurança.
- Para produzir cada peça todos os dias, a prensa precisaria de 8 trocas por dia: 8 × 90 = 720 minutos, 75 por cento do seu tempo. Isso não é possível se as peças precisarem de mais de 240 minutos de tempo de operação.
- Reduza a troca para 15 minutos, e 8 trocas custam 120 minutos, 12,5 por cento do dia. Cada peça pode ser feita todos os dias, e o estoque de ciclo cai de cerca de 4 dias para cerca de 1 dia.

Essa é a razão pela qual a Toyota investiu na redução de trocas muito antes de isso virar moda: sem trocas rápidas, a produção just-in-time com lotes pequenos não funciona.

### Tempo de troca no OEE

A eficácia global do equipamento (OEE) multiplica disponibilidade, desempenho e qualidade [4]. O LEI conta os ajustes entre as seis principais perdas que o OEE visa [4]; na maioria dos esquemas de OEE, as trocas planejadas são lançadas como perda de disponibilidade, e a sucata de partida após uma troca, como perda de qualidade. Isso tem duas consequências:

- Uma redução de troca só aparece na disponibilidade do OEE se o tempo economizado for usado para produzir. Se a planta simplesmente roda menos horas, a disponibilidade do OEE não se altera.
- Se a planta usa o tempo economizado para fazer trocas mais frequentes (para reduzir os tamanhos de lote), a disponibilidade do OEE pode permanecer estável ou até cair enquanto o estoque e o lead time melhoram. Esse é um bom resultado. Avalie o SMED pelo objetivo que você escolheu, não apenas pelo OEE.

As definições detalhadas do OEE estão no guia [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/), e o lado de manutenção do OEE, no guia sobre [TPM e OEE](https://www.m365.fm/en/learn/tpm-oee/).

### Três formas de usar o tempo que você ganha

| Opção | Quando se aplica | O que medir |
|---|---|---|
| **Mais capacidade** (mesmo número de trocas) | Máquina é gargalo, demanda excede a capacidade | Produção por semana, horas extras, disponibilidade do OEE |
| **Lotes menores** (mais trocas, mesmo tempo total de troca) | Máquina tem capacidade ociosa, estoque alto, lead times longos, muitas variantes | EPEI, tamanho de lote, dias de estoque, lead time |
| **Mix** (parte em capacidade, parte em lotes menores) | A maioria das fábricas reais | Ambos os conjuntos, com uma divisão explícita acordada com o planejamento |

O motivo mais comum para projetos SMED decepcionarem é que ninguém tomou essa decisão. A troca fica mais rápida, o planejamento mantém os tamanhos de lote antigos, e o tempo economizado desaparece em períodos ociosos mais longos. Voltamos a isso na seção de erros.

## História: de Taylor e Ford a Shingo e Toyota

A redução de setup é mais antiga do que seu nome. Frederick Winslow Taylor analisou as partes sem valor agregado dos setups em *Shop Management* (1911), Frank Gilbreth descreveu a redução do tempo de setup em *Motion Study* (1911), e as fábricas de Henry Ford documentaram a redução de setup em *Ford Methods and Ford Shops* (1915) [5]. Nenhum deles a transformou em um método estruturado e amplamente adotado [5]. Por a maior parte do século 20, a resposta padrão para setups longos foi matemática: o lote econômico de compra (EOQ), que aceita o custo de setup como dado e calcula o lote grande "correto" [5].

### Toyota e a troca rápida de ferramentas

Na Toyota, as trocas de ferramentas levavam, segundo consta, de duas a oito horas nos primeiros anos do pós-guerra; o artigo da Wikipedia sinaliza que esse número precisa de citação [5]. Taiichi Ohno tornou-se gerente das oficinas de usinagem da Toyota em 1945 e, em 1955, observou prensas de estampagem Danly nos Estados Unidos; a Toyota comprou várias delas mais tarde para sua fábrica de Motomachi [5]. O programa interno de "troca rápida de matrizes" da Toyota usou as perguntas ECRS (eliminar, combinar, reordenar, simplificar), que vieram do programa americano Training Within Industry da Segunda Guerra Mundial [5][33]. Segundo a mesma fonte, os tempos de troca da Toyota caíram de horas para 15 minutos nos anos 1960 e para 3 minutos nos anos 1970 [5].

### Shigeo Shingo

Shigeo Shingo (1909–1990) foi engenheiro industrial e consultor da Japan Management Association a partir de 1945 [6]. Ele acumulou experiência de melhoria na Toyo Kogyo (hoje Mazda) em 1950 e na Mitsubishi Heavy Industries em Hiroshima em 1957, e a partir de 1969 trabalhou na Toyota na redução do tempo de troca de matrizes em prensas, onde trocas de uma a duas horas, às vezes meio dia, caíram para alguns minutos [6]. A LEI situa suas principais ideias, a separação entre setup interno e externo e a conversão de trabalho interno em externo, nas décadas de 1950 e 1960 [1].

Shingo publicou o método em inglês em 1985 como *A Revolution in Manufacturing: The SMED System* (Productivity Press) [6][7]. O livro relata que, nos casos que acompanhou entre 1975 e 1985, os tempos de setup caíram, em média, para cerca de 2,5 por cento do original, um fator de 40 [5]. Considere esse número como o resumo do próprio Shingo sobre seus casos de consultoria, e não como um benchmark independente.

Em 1988, a escola de negócios da Utah State University criou o Shingo Prize em sua homenagem; hoje o Shingo Institute, na Jon M. Huntsman School of Business, administra o prêmio [6][30].

### SMED nos EUA

Os fabricantes americanos conheceram o SMED por meio da tradução dos livros de Shingo nos anos 1980, da difusão do just-in-time e do sucesso das montadoras japonesas. Hoje ele é um módulo padrão no treinamento em lean, incluindo as ofertas de troca rápida dos centros do NIST Manufacturing Extension Partnership (MEP) [18][31]. O contexto mais amplo do lean é abordado no guia [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/).

## Como medir o tempo de troca corretamente

A maioria dos dados de troca nas fábricas está errada, e não porque as pessoas mintam. Está errada porque ninguém concordou sobre onde a troca começa e onde termina. O sistema ERP muitas vezes registra "setup" como o tempo entre duas confirmações de ordem; os operadores muitas vezes anotam o tempo em que "a máquina ficou desmontada"; os engenheiros muitas vezes cronometram apenas a troca do molde. Todos os três ficam abaixo da perda real.

### A definição: última peça boa até primeira peça boa

Use a fronteira LEI: da última unidade boa da produção antiga até a primeira unidade boa da nova produção [2]. Dois refinamentos a tornam à prova de falhas:

1. **Em velocidade normal.** A nova produção só está "em operação" quando produz peças boas na taxa padrão. A Leanproduction.com define o fim como a primeira peça boa em velocidade plena [19]. Se a linha opera à metade da velocidade por 20 minutos após o reinício, esses 20 minutos fazem parte da perda de troca.
2. **Incluindo a desaceleração.** Se a produção antiga desacelera antes da parada (por exemplo, a linha é esvaziada e opera com lotes parciais), conte também esse tempo. Algumas fábricas chamam isso de "3 Ups": limpeza, setup e start-up [24].

### As três fases de uma troca

| Fase | O que acontece | Perdas ocultas típicas |
|---|---|---|
| **Desaceleração / limpeza** | Últimas peças da ordem antiga, esvaziamento da linha, remoção de material, limpeza | Linha opera com velocidade reduzida; operadores saem para buscar o próximo trabalho |
| **Setup (troca)** | Remoção e montagem de ferramentas, moldes, peças de formato; mudança de ajustes | Procura de itens, espera por ponte rolante ou empilhadeira, peças faltantes, parafusos |
| **Subida / start-up** | Primeiras peças, medição, ajuste, aprovação, rampa até a velocidade plena | Ajustes por tentativa e erro, espera por aprovação da qualidade, sucata |

A divisão do próprio Shingo para um setup convencional, conforme relatado na Wikipédia, atribui cerca de 30 por cento à preparação e verificação de materiais e ferramentas; cerca de 5 por cento à montagem e desmontagem; cerca de 15 por cento a centralização, dimensionamento e ajuste das condições; e cerca de 50 por cento a testes e ajustes de produção [5]. Um livro didático aberto de engenharia de manufatura enxuta apresenta um quadro semelhante para estampagem de metais, com cerca de 20 a 50 por cento do tempo de setup gasto em ajustes [36]. A lição prática: a troca em si é a parte pequena. As grandes partes são a preparação e a subida.

### Fórmulas de troca

**Tempo de troca (por evento):**
Tempo de troca = horário da primeira peça boa na velocidade padrão − horário da última peça boa da produção anterior

**Tempo médio de troca:**
Tempo médio de troca = soma de todos os tempos de troca / número de trocas

**Participação da troca no tempo disponível:**
Participação da troca = tempo total de troca / tempo de produção planejado × 100%

**Razão interna:**
Razão interna = tempo de setup interno / carga total de trabalho de setup × 100%

**Custo de uma troca (modelo simples):**
Custo por troca = margem de contribuição perdida (somente se a máquina for gargalo ou estiver com vendas esgotadas) + custo de mão de obra da equipe de troca + sucata de subida + consumíveis

A MachineMetrics, fornecedora de monitoramento de máquinas, usa uma divisão comparável: perda de custo de mão de obra = horas paradas × número de pessoas × custo de mão de obra por hora; perda de valor do produto = preço unitário × taxa padrão × horas paradas [21]. Cuidado com o segundo termo: ele só conta como perda real se a produção perdida pudesse ter sido vendida. Em uma máquina com capacidade ociosa, o custo de uma troca está principalmente na mão de obra e na sucata, e o benefício do SMED está em lotes menores, não em produção recuperada.

**Exemplo trabalhado (ilustrativo):** Um centro de usinagem CNC trabalha em dois turnos de 8 horas, 5 dias por semana, com 60 minutos de pausas planejadas por dia: tempo de produção planejado = (16 − 1) × 60 × 5 = 4.500 minutos por semana. Na semana passada houve 9 trocas que levaram 52, 68, 47, 95, 61, 58, 73, 49 e 87 minutos.

- Total = 590 minutos; média = 590 / 9 = 65,6 minutos.
- Participação da troca = 590 / 4.500 = 13,1 por cento.
- Dispersão: menor 47, maior 95 minutos, uma amplitude de 48 minutos. Uma amplitude tão grande geralmente indica ausência de padrão; as trocas mais longas são as que tiveram ferramentas ou programas faltantes.
- Custo: equipe de 1 operador de setup a uma taxa carregada de US$ 48 por hora (ilustrativo) = 590 / 60 × US$ 48 = US$ 472 por semana em mão de obra. Se a máquina for gargalo com margem de contribuição de US$ 180 por hora, a margem perdida é 590 / 60 × US$ 180 = US$ 1.770 por semana, ou cerca de US$ 92.000 por ano, considerando 52 semanas. É esse número que justifica um projeto.

### Como coletar os dados

1. **Vídeo primeiro.** Filme uma troca completa, desde a última peça boa até a primeira peça boa, com um relógio visível. Uma câmera na máquina e, idealmente, uma segunda acompanhando o preparador. Peça permissão à equipe antes e explique o objetivo: o vídeo trata do processo, não das pessoas. O centro do NIST MEP em Michigan usou vídeo, um diagrama de espaguete e um gráfico de análise de setup no projeto Brighton NC Machine [17].
2. **Diagrama de espaguete.** Trace o caminho que o preparador percorre em um layout. As trocas costumam incluir centenas ou milhares de pés de caminhada; no exemplo Brighton, eram 9.121 pés por troca antes da melhoria [17].
3. **Lista de elementos.** Divida o vídeo em elementos de alguns segundos a alguns minutos: "caminhar até o almoxarifado de ferramentas, 3:20", "soltar 8 parafusos de fixação, 4:10". Uma troca típica se divide em cerca de 30 a 50 elementos, segundo o leanproduction.com [19].
4. **Duas semanas de linha de base.** Colete os horários de início e fim de todas as trocas por pelo menos duas semanas antes de mudar qualquer coisa, para conhecer a média e a dispersão [19]. A Vorne alerta que as equipes mudam seu comportamento quando sabem que estão sendo observadas (efeito Hawthorne), e por isso a primeira troca filmada pode ser mais rápida que o normal [20].

O modelo da lista de elementos está na [seção de modelos](#modelos-e-listas-de-verificação-de-smed).

## O método SMED em 8 etapas

Shingo descreveu quatro estágios conceituais, frequentemente chamados de estágios SMED: no estágio preliminar, o setup interno e externo estão misturados; o estágio 1 os separa; o estágio 2 converte o interno em externo; o estágio 3 simplifica todos os aspectos do setup [5]. Fontes de prática desdobram isso em sete passos básicos: observar, separar, converter, simplificar o interno, simplificar o externo, documentar, repetir [5]. As oito etapas abaixo acrescentam o passo que a maioria dos guias omite: preparar o projeto, incluindo segurança e a decisão sobre como o tempo economizado será usado.

| Etapa | Estágio Shingo | Resultado |
|---|---|---|
| 0. Preparar: escolher a máquina, a equipe, a meta e o uso do tempo economizado | (preliminar) | Termo de abertura, dados de linha de base, revisão de segurança |
| 1. Registrar a troca atual | estágio preliminar | Vídeo, lista de elementos com tempos, diagrama de espaguete |
| 2. Separar elementos internos e externos | estágio 1 | Cada elemento marcado como I ou E; checklist e plano de preparação antecipada |
| 3. Converter interno em externo | estágio 2 | Lista de ações: preparação, padronização de funções, gabaritos intermediários |
| 4. Simplificar elementos internos | estágio 3 | Grampos rápidos, ajustes eliminados, trabalho em paralelo |
| 5. Simplificar elementos externos | estágio 3 | Carrinhos, painéis de sombra, armazenamento próximo à máquina |
| 6. Padronizar e treinar | (acompanhamento) | Folha padrão de troca, registros de treinamento |
| 7. Sustentar e repetir | (acompanhamento) | KPI no quadro, auditorias, próximo ciclo |

### Etapa 0: Preparar o projeto

**Escolher a máquina piloto.** Bons pilotos têm uma troca de cerca de 30 a 90 minutos que ocorre várias vezes por semana, uma equipe cooperativa e uma dor de negócio visível (gargalo, estoque alto, pedidos atrasados). A Vorne sugere uma troca piloto de 30 a 60 minutos [20]; o leanproduction.com recomenda SMED quando as trocas respondem por pelo menos 20% do tempo produtivo perdido, e TPM primeiro caso contrário [19]. Ambas são regras práticas de fornecedores, não normas, mas apontam na direção certa: não comece com uma troca de 12 horas nem com uma de 5 minutos.

**Formar a equipe.** Operador(es) e preparador(es) que fazem a troca todos os dias, um técnico de manutenção, um engenheiro de manufatura, um técnico da qualidade para aprovação da primeira peça e um representante de segurança. Um supervisor patrocina a equipe. De quatro a sete pessoas é um tamanho viável.

**Acordar a meta e o uso do tempo economizado.** Registre por escrito a linha de base (média e faixa), a meta (por exemplo, redução de 50% no primeiro ciclo, como sugere a Vorne [20]) e o que o planejamento fará com o tempo: capacidade, lotes menores ou divisão de turnos.

**Revisão de segurança.** Liste as fontes de energia (elétrica, hidráulica, pneumática, gravitacional, térmica) e o procedimento atual de controle de energia. Antes da oficina, decida quais passos estão sob bloqueio e etiquetagem (lockout/tagout). Nunca aceite ideias "mais rápidas" que pulem o isolamento de energia (veja a seção de segurança).

### Etapa 1: Registrar a troca atual

Filme, monte a lista de elementos e desenhe o diagrama de espaguete. Escreva os elementos na ordem em que aconteceram, com hora de início, duração e quem os executou. Marque imediatamente os desperdícios óbvios: procurar, caminhar, esperar pela ponte rolante, testes de partida.

Perguntas a fazer para cada elemento (as perguntas do estilo clássico "cinco porquês" também funcionam):

- Por que isto é feito? (Podemos eliminá-lo?)
- Por que agora, com a máquina parada? (Pode ser externo?)
- Por que deste jeito? (Pode ser mais simples?)
- Por que esta pessoa? (Duas pessoas podem fazer em paralelo, ou o operador pode fazer?)

### Etapa 2: Separar elementos internos e externos

Marque cada elemento como I (exige máquina parada) ou E (pode ser feito enquanto a máquina roda). Não altere ainda o método; apenas pare de fazer trabalho externo durante a parada. Esta etapa é principalmente organizacional:

- **Checklist pré-troca:** tudo o que o próximo trabalho exige (matriz, ferramentas, dispositivos de fixação, insertos, material, programa, desenho, calibres, embalagem) é listado e verificado antes de a máquina parar.
- **Verificações de funcionamento:** a nova matriz é verificada quanto a danos e completude antes de ser instalada, e não após a primeira peça defeituosa.
- **Transporte:** a nova matriz é posicionada junto à máquina antes da parada; a matriz antiga volta ao armazenamento após a reinicialização.

A Leanproduction.com observa que transferir elementos para externos pode reduzir quase pela metade o tempo de troca [19]. Isso corresponde à experiência de praticantes, mas depende inteiramente de quanto tempo hoje se gasta procurando e buscando itens.

### Etapa 3: Converter internos em externos

Agora revise cada elemento I restante e pergunte o que precisaria mudar para que ele se tornasse externo. As técnicas de Shingo aqui são preparar as condições operacionais com antecedência, padronizar funções e usar gabaritos intermediários [5]:

- **Pré-aquecer** moldes e matrizes fora da máquina, para que os primeiros disparos não precisem levá-los à temperatura.
- **Pré-ajustar** ferramentas em um pré-ajustador ou em um segundo dispositivo enquanto a máquina roda.
- **Padronizar** as dimensões que importam para a máquina (altura de fixação, posições de localização, pontos de conexão), de modo que uma nova matriz não precise de ajuste.
- **Gabaritos intermediários**: montar a próxima peça ou matriz em um pallet ou subplaca padronizada fora da máquina e, então, trocar o pallet inteiro.

### Etapa 4: Simplificar os elementos internos

O que permanece interno é tornado rápido e simples:

- **Fixações funcionais** no lugar de parafusos: fixadores de quarto de volta, grampos de came, rasgos em U para que um parafuso precise de apenas meia volta, fixação hidráulica ou magnética.
- **Eliminar ajustes:** batentes fixos, pinos de localização, escalas e marcações, ajustes armazenados como receitas. O ajuste é a maior categoria isolada de tempo de preparação na divisão de Shingo [5].
- **Operações paralelas:** duas pessoas em lados opostos da máquina, cada uma com uma sequência definida, podem reduzir o tempo decorrido em mais da metade ao eliminar a caminhada em volta da máquina. Elas precisam de um sistema claro de sinalização e, sob bloqueio e etiquetagem (lockout/tagout), cada pessoa aplica o seu próprio cadeado.
- **Uma ferramenta, um tamanho:** padronizar os tamanhos dos parafusos para que uma única ferramenta sirva em todos os pontos.

### Etapa 5: Simplificar os elementos externos

O trabalho externo não para a máquina, mas ocupa pessoas e pode atrasar o início da troca. Simplifique-o com carrinhos de troca organizados por sequência, quadros de sombra, armazenamento de matrizes e ferramentas no ponto de uso seguindo o [5S](https://www.m365.fm/en/learn/5s-visual-management/), e sinais visuais claros ("próximo trabalho pronto").

### Etapa 6: Padronizar e treinar

Escreva o novo método como uma folha de troca padronizada: a sequência de elementos, quem faz o quê, pontos-chave (segurança, qualidade), tempos e as ferramentas necessárias. A LEI descreve o [trabalho padronizado](https://www.m365.fm/entity/standard-work/) como o estabelecimento de procedimentos precisos para o trabalho de cada operador [26]. Treine todos que executam a troca, não apenas a equipe piloto; o método TWI de Instrução de Trabalho, que divide uma tarefa em etapas importantes e pontos-chave, é um formato prático [33]. O conjunto sobre [trabalho padronizado](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) detalha o formato.

### Etapa 7: Sustentar e repetir

Coloque o tempo de troca no quadro de gestão à vista do chão de fábrica, revise os desvios diariamente e audite o padrão regularmente. O SMED é um ciclo de melhoria contínua, não um evento único. Execute o ciclo seguinte: o resumo da prática SMED na Wikipedia afirma que podem ser necessárias várias iterações para chegar a menos de dez minutos [5]. Um segundo ciclo normalmente ataca os elementos dependentes de hardware que o primeiro ciclo adiou.

## As oito técnicas de Shingo com exemplos

Shingo resumiu sua abordagem em oito técnicas [5]. A tabela apresenta a cada uma uma explicação simples e exemplos de diferentes setores.

| # | Técnica | O que significa | Exemplos |
|---|---|---|---|
| 1 | Separar a preparação interna da externa | Não pare a máquina para trabalhos que podem ser feitos enquanto ela funciona | Checklist, preparação do molde e do material antes da parada |
| 2 | Converter preparação interna em externa | Mudar o método para que o trabalho passe a ocorrer fora da parada | Pré-aquecimento de moldes, pré-ajuste de ferramentas, pré-montagem de peças de formato |
| 3 | Padronizar a função, não a forma | Padronizar apenas as características com as quais a máquina interage, não a ferramenta inteira | Mesma altura e borda de fixação em todos os matrizes por meio de blocos espaçadores; mesmo acoplamento em todos os moldes |
| 4 | Usar fixações funcionais ou eliminar fixadores | Fixar com um único movimento, ou não fixar | Parafusos de um quarto de volta, alavancas de came, furos em forma de pera, grampos hidráulicos, placas magnéticas |
| 5 | Usar gabaritos intermediários | Preparar em um suporte padrão fora da máquina e trocar o suporte | Paletes de fixação de ponto zero em centros de usinagem, subplacas para matrizes de prensa |
| 6 | Adotar operações paralelas | Mais de uma pessoa trabalha ao mesmo tempo em uma sequência definida | Dois preparadores nos dois lados de uma prensa; operador prepara o material enquanto o preparador troca a matriz |
| 7 | Eliminar ajustes | Substituir tentativa e erro por posições fixas e configurações armazenadas | Pinos e batentes de localização, escalas, download de receitas, leituras digitais |
| 8 | Mecanização | Usar assistência de força onde realmente ajuda, depois das outras sete | Carrinhos de matriz com roletes, elevadores de matriz, eixos de ajuste motorizados |

Duas observações sobre a lista. Primeiro, a mecanização vem por último de propósito. Equipamentos adquiridos antes das etapas organizacionais frequentemente automatizam o desperdício. Segundo, "padronizar a função, não a forma" é a técnica mais subutilizada. Uma planta não precisa reconstruir 200 matrizes; muitas vezes, um conjunto de blocos espaçadores ou placas adaptadoras que levam todas as matrizes à mesma altura de fixação e à mesma borda de localização resolve o problema.

## Técnicas de troca de produção por tipo de equipamento

Os princípios são os mesmos em toda parte, mas as principais alavancas variam de processo para processo. As tabelas abaixo são uma lista de verificação prática, não um benchmark baseado em fontes.

### Prensas de estampagem

| Alavanca | Exemplo |
|---|---|
| Altura padrão da matriz e posicionamento | Paralelas ou blocos espaçadores levam todas as matrizes à mesma altura de fechamento; pinos de localização ou um batente traseiro centralizam a matriz |
| Transporte de matrizes | Carrinhos de matriz ou bolsters rolantes preparados junto à prensa; trilhos de rolos ou esferas no bolster |
| Fixação | Grampos hidráulicos ou mecânicos de acionamento rápido; ranhuras em U e um único tamanho de parafuso, caso ainda existam parafusos |
| Ajustes | Altura de fechamento, pressão do contrapeso e ajustes de alimentação armazenados por matriz; escalas marcadas |
| Segurança | Blocos de segurança sempre que a matriz for ajustada ou reparada na prensa, conforme exigido pela OSHA [10]; procedimento de ajuste de matriz segundo 29 CFR 1910.217(d)(9) |

### Moldagem por injeção

| Alavanca | Exemplo |
|---|---|
| Pré-aquecimento | Molde pré-aquecido em uma unidade de controle de temperatura separada antes da troca |
| Conexões | Acoplamentos múltiplos para água e conexões de canal quente, codificados por cor |
| Material | Próximo material seco e pronto; composto de purga e procedimento padronizados |
| Fixação | Sistemas de troca rápida de molde (placas magnéticas ou hidráulicas), com espessura padronizada das placas de molde |
| Ajustes | Parâmetros do processo carregados a partir de uma receita, em vez de ajustados de memória |

### Usinagem CNC

| Alavanca | Exemplo |
|---|---|
| Pré-ajuste de ferramentas | Ferramentas medidas offline em um pré-ajustador, com os offsets transferidos para o comando |
| Fixação de peças | Fixação por ponto zero, paletes padronizados, dispositivos dedicados armazenados junto à máquina |
| Programas | Programas comprovados liberados e carregados antecipadamente; sem edição na máquina |
| Primeira peça | Apalpação na própria máquina substitui a medição manual para ajustar os offsets de trabalho |
| Famílias de ferramentas | Biblioteca padrão de ferramentas para que a maioria dos trabalhos exija poucas trocas de ferramenta |

### Linhas de embalagem e envase

| Alavanca | Exemplo |
|---|---|
| Peças de formato | Peças de formato codificadas por cor para cada tamanho de produto, armazenadas em um carrinho na ordem da troca |
| Ajustes | Batentes fixos e escalas numeradas no lugar de ajuste livre; eixos servo com posições armazenadas |
| Limpeza | Sequência de limpeza padronizada; limpeza a seco primeiro; limpeza em paralelo das peças removidas |
| Rótulos e materiais | Lista de verificação de desobstrução da linha; preparação de rótulos, cartuchos e tampas antes da parada |
| Partida | Verificações definidas da primeira peça; procedimento de rampa de velocidade |

### Trocas dominadas pela limpeza e reguladas (alimentos, farmacêutica, químicos)

Em fábricas de alimentos, bebidas, farmacêuticos e químicos, a "troca" em si costuma ser pequena, e a limpeza e a verificação são grandes. O pensamento SMED continua valendo: preparar antecipadamente agentes de limpeza, ferramentas e documentos; limpar as peças removíveis fora da máquina enquanto ela é remontada com um segundo conjunto; sequenciar os produtos para minimizar limpezas completas (do claro para o escuro, sem alérgenos antes dos que contêm alérgenos). A diferença é que algumas etapas são obrigatórias e não podem ser encurtadas pela sua omissão:

- Os fabricantes de medicamentos dos EUA devem inspecionar as instalações de embalagem e rotulagem imediatamente antes do uso, para garantir que todos os produtos farmacêuticos e materiais de embalagem e rotulagem impróprios de operações anteriores tenham sido removidos, e documentar os resultados nos registros de produção de lotes (21 CFR 211.130(e)) [11].
- As instalações de alimentos dos EUA sob a regra de controles preventivos devem ter controles de alérgenos alimentares que incluam procedimentos para proteger os alimentos da contaminação cruzada por alérgenos durante o armazenamento, a manipulação e o uso (21 CFR 117.135(c)(2)) [37].

Aqui, o SMED encurta o trabalho em torno das etapas obrigatórias e torna essas etapas mais rápidas e confiáveis, por exemplo, com uma lista de verificação de desobstrução da linha e uma sequência fixa. Ele nunca as elimina.

### Linhas e células de montagem

As trocas em montagem dizem respeito principalmente a material e informação: kits diferentes, instruções de trabalho diferentes, dispositivos diferentes em algumas estações. As alavancas são a preparação de kits da próxima variante antes da troca, dispositivos que atendem a várias variantes, instruções de trabalho digitais que mudam conforme a ordem, e trocas "em cascata", em que cada estação muda quando chega a primeira unidade da nova variante, de modo que a linha nunca para por inteiro.

## Exemplo de SMED: um projeto completo em uma máquina de injeção

O exemplo a seguir é ilustrativo. Os números são realistas para uma fábrica de injeção plástica de porte médio, mas não descrevem uma planta real. Eles mostram como as etapas se encaixam e como calcular o efeito.

**Situação.** Uma máquina de injeção de 300 toneladas opera 6 moldes para uma família de carcaças. Ela trabalha em 3 turnos de 8 horas, com 30 minutos de intervalo por turno, 5 dias por semana: tempo de produção planejado = 3 × 7,5 × 60 × 5 = 6.750 minutos por semana. Ela troca de molde 5 vezes por semana. Linha de base em duas semanas: troca média de 96 minutos, faixa de 78 a 131 minutos. A máquina não é gargalo; o problema são 11 dias de estoque de produto acabado e pedidos urgentes frequentes.

**Meta acordada com o planejamento.** Reduzir o tempo médio de troca em pelo menos 50 por cento no primeiro ciclo e usar o tempo liberado para fazer mais trocas, de modo que cada molde rode pelo menos a cada 3 dias em vez de a cada 6.

### Etapa 1: lista de elementos (antes)

| # | Elemento | Tempo (min) | I/E hoje | Poderia ser |
|---|---|---|---|---|
| 1 | Últimos tiros, esvaziar o funil, parar a máquina | 6 | I | I (em parte E: esvaziar o funil antes do fim da corrida) |
| 2 | Caminhar até o armazenamento de moldes, localizar o próximo molde, buscar a ponte rolante | 14 | I | E |
| 3 | Desconectar as linhas de água e de canal quente (12 engates simples) | 8 | I | I, simplificar |
| 4 | Desapertar o molde (8 parafusos), retirar | 9 | I | I, simplificar |
| 5 | Içar o novo molde, alinhar a olho, fixar (8 parafusos) | 13 | I | I, simplificar |
| 6 | Conectar as linhas de água e de canal quente, localizar a mangueira correta para cada conexão | 10 | I | I, simplificar |
| 7 | Procurar o material, secá-lo | 7 | I | E |
| 8 | Aquecer o molde até a temperatura | 12 | I | E (pré-aquecimento) |
| 9 | Ajustar parâmetros conforme a folha de setup, ajustar | 9 | I | I, eliminar ajuste |
| 10 | Tiros de teste, ajustes, aguardar aprovação da qualidade | 8 | I | I, simplificar |
| **Total interno (tempo decorrido)** | | **96** | | |

Os dois candidatos externos (elementos 2 e 7) e o pré-aquecimento (elemento 8) somam 33 minutos de máquina parada que não precisam de máquina parada.

### Etapas 2 e 3: separar e converter

- Os elementos 2 e 7 tornam-se externos com uma lista de verificação pré-troca acionada 45 minutos antes do fim planejado da corrida: molde, vaga da ponte rolante, material (seco), mangueiras, documentos, calibre da primeira peça. Economia: 21 minutos.
- O elemento 8 torna-se externo com uma estação de pré-aquecimento onde o próximo molde é levado à temperatura enquanto o anterior ainda roda. Economia: cerca de 10 minutos (restam 2 minutos para estabilização na máquina).
- Elemento 1: o funil é esvaziado nos últimos minutos da corrida em vez de após a parada. Economia: 3 minutos.

Resultado após as duas primeiras etapas: 96 − 21 − 10 − 3 = **62 minutos**, alcançado principalmente com uma lista de verificação, um pré-aquecedor e disciplina.

### Etapa 4: simplificar o interno

| # | Medida | Antes (min) | Depois (min) |
|---|---|---|---|
| 3 + 6 | Placas de engate múltiplo para água e canal quente, codificadas por cor | 18 | 4 |
| 4 + 5 | Anel de centragem e ranhuras de fixação padronizados, grampos de acionamento rápido; segunda pessoa para trabalho em paralelo | 22 | 9 |
| 9 | Parâmetros de processo armazenados por molde e carregados a partir do controlador | 9 | 2 |
| 10 | Verificação da primeira peça com calibre dedicado na máquina, técnico da qualidade avisado antecipadamente | 8 | 5 |
| 1 | Descarga com o funil já vazio | 3 | 3 |
| 8 | Estabilização após o pré-aquecimento | 2 | 2 |
| **Total** | | **62** | **25** |

O tempo decorrido agora é de 25 minutos. Observe que o trabalho em paralelo por duas pessoas reduz o tempo decorrido, mas não o tempo de mão de obra: o conteúdo de mão de obra dos elementos 4 e 5 continua em cerca de 18 homens-minuto.

### Etapa 6: padronizar

A nova sequência é registrada como uma folha padrão de troca com duas colunas (preparador A, preparador B), treinada em todos os três turnos e auditada semanalmente durante um mês. Após quatro semanas, a média é de 27 minutos, com faixa de 23 a 34 minutos.

### O efeito

| Indicador | Antes | Depois |
|---|---|---|
| Tempo médio de troca | 96 min | 27 min (−72%) |
| Faixa de troca | 78–131 min | 23–34 min |
| Trocas por semana | 5 | 10 |
| Tempo total de troca por semana | 480 min | 270 min |
| Participação da troca no tempo planejado | 7,1% | 4,0% |
| Intervalo em que cada molde roda (EPEI) | cerca de 6 dias | cerca de 3 dias |
| Estoque de produto acabado (estoque de ciclo) | cerca de 11 dias | cerca de 6 dias (meta) |

A máquina agora troca de produto duas vezes mais vezes e, ainda assim, gasta 210 minutos a menos por semana em trocas. O estoque de ciclo cai aproximadamente na proporção do intervalo. O investimento: uma estação de pré-aquecimento, seis conjuntos de engates múltiplos, padronização de grampos e dois dias do tempo da equipe. O caso de negócio para este tipo de projeto é calculado na [seção de caso de negócio](#o-caso-de-negócio-custos-roi-e-contabilização-de-estoque).

## De trocas mais curtas a lotes menores: EPEI e dimensionamento de lotes

SMED cria potencial; o planejamento transforma esse potencial em resultados. Duas ferramentas conectam o tempo de troca com o tamanho do lote e o estoque: o EPEI e a fórmula clássica de dimensionamento de lotes.

### O que significa EPEI

EPEI significa "every part every interval" (o léxico do LEI agora usa o termo EPEx, "every product every interval"). Ele descreve com que frequência uma máquina ou processo percorre todos os seus números de peça: se uma máquina é reconfigurada de modo a produzir cada número de peça a cada três dias, seu EPEx é de três dias [3]. O LEI observa que o EPEx depende dos tempos de troca e do número de números de peça; trocas longas e muitos números de peça elevam esse valor, a menos que o tempo de troca seja reduzido [3]. Um EPEI menor significa lotes menores e menos estoque. No [mapeamento do fluxo de valor](https://www.m365.fm/en/learn/value-stream-mapping/), o EPEI é um item padrão na caixa de dados de um processo com trocas [35].

### Como calcular o EPEI

Uma fórmula comum usada por praticantes (derivada do balanço de tempo de um processo; não é uma fórmula do LEI):

EPEI = tempo total de troca para um ciclo completo por todas as peças / (tempo disponível por dia − tempo de operação necessário por dia)

A ideia: a cada dia, a máquina precisa de uma quantidade fixa de tempo de operação para atender à demanda. O tempo que sobra pode ser gasto em trocas. Quanto mais tempo de troca um ciclo completo por todas as peças exige, mais dias o ciclo leva.

**Exemplo resolvido (ilustrativo):** Uma máquina tem 900 minutos de tempo disponível por dia. Ela produz 4 peças, com a seguinte demanda diária e tempos de ciclo:

| Peça | Demanda diária (peças) | Tempo de ciclo (min/peça) | Tempo de operação por dia (min) | Tempo de troca (min) |
|---|---|---|---|---|
| A | 400 | 0,8 | 320 | 40 |
| B | 300 | 0,8 | 240 | 40 |
| C | 150 | 1,0 | 150 | 60 |
| D | 50 | 1,2 | 60 | 60 |
| **Total** | | | **770** | **200** |

- Tempo restante para trocas por dia: 900 − 770 = 130 minutos.
- Um ciclo completo pelas quatro peças exige 200 minutos de tempo de troca.
- EPEI = 200 / 130 = 1,54 dia, arredondado na prática para cima em **2 dias**: cada peça é feita a cada 2 dias.
- Tamanhos de lote com EPEI de 2 dias = 2 dias de demanda: A 800, B 600, C 300, D 100 peças.

**Agora aplique o SMED.** As trocas caem para 15 minutos para A e B e 20 minutos para C e D: total = 70 minutos.

- EPEI = 70 / 130 = 0,54 dia, arredondado para cima em **1 dia**: cada peça a cada dia.
- Os tamanhos de lote caem pela metade: A 400, B 300, C 150, D 50 peças.
- O estoque médio de ciclo (cerca de metade de um lote, se a demanda for estável) cai de cerca de 1 dia de demanda para cerca de meio dia.
- Tempo folga: com EPEI de 1 dia, as trocas precisam de 70 dos 130 minutos livres; restam 60 minutos como margem para quebras e picos de demanda.

Duas observações práticas. Primeiro, nunca planeje com folga zero; máquinas reais têm quebras, e um EPEI que usa todos os minutos livres entra em colapso no primeiro dia ruim. Segundo, o EPEI pode ser diferente para itens de alto e de baixo volume: A e B todos os dias, C e D a cada dois dias costuma ser um compromisso melhor do que um intervalo uniforme. É aqui que o SMED encontra a [heijunka](https://www.m365.fm/entity/heijunka/), o nivelamento da produção por volume e mix [25].

### A fórmula do lote econômico e por que o custo de preparação importa

O lote econômico de compra (EOQ), desenvolvido por Ford W. Harris em 1913 [39] e por décadas a abordagem padrão para dimensionamento de lotes [5], equilibra o custo de preparação com o custo de manutenção:

EOQ = √(2 × D × S / H)

em que D = demanda anual, S = custo por preparação (ou pedido), H = custo anual de manutenção por unidade. Para a produção com taxa de produção finita, o lote econômico de produção (EPQ) acrescenta um fator de correção √(1 / (1 − d/p)), em que d é a taxa de demanda e p a taxa de produção. Os detalhes das duas fórmulas, incluindo suas premissas, são tratados no conjunto de artigos sobre [dimensionamento de lotes](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/).

O ponto-chave para o SMED é a raiz quadrada. Se o custo de preparação S cai para um quarto, o tamanho econômico do lote cai pela metade (√0,25 = 0,5). Se S cai para um nono, o tamanho do lote cai para um terço.

**Exemplo trabalhado (ilustrativo):** D = 24.000 peças por ano, H = US$ 2,40 por peça por ano (por exemplo, custo de manutenção de estoque de 20% sobre uma peça de US$ 12), S = US$ 160 por troca (duas horas de uma equipe de dois operadores a US$ 40 por hora com encargos).

- LEP = √(2 × 24.000 × 160 / 2,40) = √3.200.000 ≈ **1.789 peças**, cerca de 13 lotes por ano (24.000 / 1.789 ≈ 13,4).
- Depois da SMED, a troca leva 30 minutos com a mesma equipe: S = US$ 40.
- LEP = √(2 × 24.000 × 40 / 2,40) = √800.000 ≈ **894 peças**, cerca de 27 lotes por ano (24.000 / 894 ≈ 26,8).
- O estoque médio de ciclo (LEP / 2) cai de cerca de 894 para cerca de 447 peças; a US$ 12 por peça, isso libera cerca de US$ 5.400 em estoque apenas para esta peça.

A fórmula tem limites bem conhecidos: pressupõe demanda constante, custos conhecidos e ausência de restrição de capacidade, e o "custo por troca" é difícil de determinar quando o preparador é pago de qualquer forma. Por isso, os praticantes de Lean a usam como argumento de direção ("um custo de troca menor justifica lotes menores"), e não como regra de programação. Um sistema puxado com [kanban](https://www.m365.fm/en/learn/kanban-pull-system/) e um cronograma baseado em EPEI geralmente a substitui [34].

### Verificação de capacidade: você pode arcar com mais trocas?

Antes de planejar a redução dos tamanhos de lote, verifique o equilíbrio de capacidade:

Tempo necessário por semana = Σ (demanda × tempo de ciclo) + número de trocas × tempo médio de troca

Ele deve permanecer confortavelmente abaixo do tempo disponível. Em um gargalo, uma troca mais curta é, antes de tudo, um ganho de capacidade; decidir se você a usará para lotes menores é uma decisão deliberada, que o guia sobre a [teoria das restrições](https://www.m365.fm/en/learn/theory-of-constraints/) discute em detalhes. Em um não gargalo, existe capacidade ociosa por definição, e normalmente é mais sensato usar o tempo de troca economizado para realizar trocas com mais frequência.

## Segurança: trocas, bloqueio e etiquetagem (lockout/tagout) e ergonomia

Nenhuma das doze páginas amplamente lidas analisadas para este guia trata de bloqueio e etiquetagem (lockout/tagout), embora quase todos os elementos internos de preparação aconteçam dentro da zona de perigo de uma máquina. Nos EUA, isso não é opcional.

### Preparar a máquina é manutenção pela norma de bloqueio e etiquetagem da OSHA

A norma da OSHA para o controle de energia perigosa, 29 CFR 1910.147, abrange a manutenção e a conservação de máquinas e equipamentos nos quais a energização inesperada, a partida ou a liberação de energia armazenada possam causar danos aos trabalhadores [8]. Sua definição de "manutenção e/ou conservação" inclui explicitamente a preparação e o ajuste, e "preparação" é definida como qualquer trabalho realizado para deixar uma máquina ou equipamento pronto para executar sua operação normal de produção [8]. Uma troca é, portanto, por padrão, uma atividade de manutenção segundo a norma.

A norma exige um procedimento documentado de controle de energia, treinamento e uma sequência fixa de aplicação: preparação para o desligamento, desligamento da máquina, isolamento das fontes de energia, aplicação dos dispositivos de bloqueio ou etiquetagem, liberação da energia armazenada e verificação do isolamento [8]. Os empregadores devem inspecionar cada procedimento de controle de energia pelo menos uma vez por ano [8].

### A exceção para manutenção menor: estreita, não é uma brecha

Uma nota ao parágrafo de escopo isenta trocas menores de ferramentas, ajustes e outras atividades de manutenção menor que ocorram durante a operação normal de produção, desde que sejam rotineiras, repetitivas e parte integrante do uso do equipamento para produção, e somente se o trabalho for realizado com medidas alternativas que proporcionem proteção efetiva [8]. O eTool de bloqueio e etiquetagem da OSHA explica que essas atividades então se enquadram nos requisitos de proteção de máquinas do Subparte O e lista exemplos de medidas alternativas: ferramentas especialmente projetadas, dispositivos remotos, barreiras de proteção intertravadas, desconectores locais e chaves de controle sob o controle exclusivo do funcionário que executa o trabalho [9]. Se qualquer parte da exceção não for atendida, o bloqueio e a etiquetagem se aplicam [9].

O que isso significa para a SMED:

- Uma troca completa de matriz ou molde normalmente não é uma troca de ferramenta "menor" durante a produção normal; planeje-a com bloqueio e etiquetagem (lockout/tagout). Se uma tarefa específica se enquadra na exceção, essa é uma avaliação legal e de segurança do seu profissional de segurança, não da equipe SMED.
- O SMED deve tornar o bloqueio mais rápido e mais fácil, nunca dispensá-lo. Exemplos: pontos de bloqueio agrupados e identificados na máquina, uma estação de bloqueio no carrinho de troca, caixas de bloqueio em grupo para trabalhos paralelos em que cada pessoa aplica seu próprio cadeado, e etapas de verificação escritas na folha padrão de troca.
- Um padrão de tempo de troca que só possa ser atingido pulando o isolamento de energia é um padrão errado. Inclua o tempo de bloqueio na meta.

### Prensas mecânicas

Para prensas mecânicas, a OSHA exige um procedimento de montagem de matriz que garanta conformidade com as regras de proteção do ponto de operação, barras de virada com mola onde a prensa for projetada para elas, batentes de matriz em prensas inclinadas, blocos de segurança sempre que matrizes forem ajustadas ou reparadas dentro da prensa, e ferramentas como escovas ou pistolas de pressão para que operadores e montadores de matriz não alcancem o ponto de operação para lubrificar [10]. Esses itens devem constar em todo padrão de troca de prensa.

### Ergonomia

As trocas envolvem manuseio pesado e desajeitado: levantar matrizes, peças de formato e dispositivos, trabalhar curvado dentro de proteções, alcançar parafusos. A OSHA descreve a ergonomia como o ajuste do trabalho ao trabalhador para reduzir distúrbios musculoesqueléticos [32]. SMED e ergonomia geralmente apontam na mesma direção: carrinhos para matrizes, trilhos de rolos, auxiliares de levantamento, dispositivos na altura da cintura e menos parafusos são mais rápidos e menos desgastantes para o corpo. O risco está nas metas de tempo: quando a equipe é pressionada a vencer o cronômetro, a técnica de levantamento e os levantamentos em dupla são deixados de lado. As metas de tempo devem ser definidas de forma que possam ser cumpridas em um ritmo sustentável.

### Lista de verificação de segurança para projetos SMED

| Verificação | Feito |
|---|---|
| Fontes de energia da máquina listadas (elétrica, hidráulica, pneumática, gravitacional, térmica, química) | ☐ |
| Procedimento atual de controle de energia revisado; etapas de troca sob bloqueio e etiquetagem identificadas | ☐ |
| Profissional de segurança revisou qualquer alegação de que uma etapa se enquadra na exceção de manutenção menor | ☐ |
| Etapas de bloqueio e verificação escritas na folha padrão de troca, com tempo | ☐ |
| Trabalho paralelo: cada pessoa aplica seu próprio cadeado; sinais de comunicação definidos | ☐ |
| Prensas: procedimento de montagem de matriz, blocos de segurança, barras de virada e batentes de matriz verificados [10] | ☐ |
| Levantamentos pesados identificados; auxiliares de levantamento ou levantamentos em dupla definidos | ☐ |
| Superfícies quentes (moldes pré-aquecidos, matrizes aquecidas) identificadas; luvas e manuseio definidos | ☐ |
| Novo hardware de fixação rápida verificado quanto à força de fixação e comportamento à prova de falhas | ☐ |
| Primeira troca com o novo padrão observada por um supervisor | ☐ |

## Qualidade: aprovação da primeira peça, à prova de erros e liberação regulada da linha

O aquecimento e o ajuste representam a maior parte de muitas trocas de produto [5]. Os problemas de qualidade após uma troca geralmente têm as mesmas causas: ferramenta ou programa errado, ajustes feitos de memória, verificações da primeira peça ausentes ou uma aprovação da primeira peça que aguarda um inspetor ocupado em outro lugar.

### Aprovação da primeira peça sem espera

- **Defina a verificação** na folha padrão de troca: quais características, qual calibre e qual tamanho de amostra.
- **Leve o calibre até a máquina** e treine o operador para medir, com um técnico de qualidade aprovando apenas onde o plano de controle exigir.
- **Notifique a qualidade com antecedência** usando a lista de verificação pré-troca, para que o inspetor esteja presente quando a primeira peça sair.
- **Registre o resultado da primeira peça** junto com a ordem, para que seja rastreável.

### Tornando a troca à prova de erros

Dispositivos [Poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/) evitam ou detectam erros [28]. Em trocas, exemplos típicos são:

| Erro | Poka-yoke |
|---|---|
| Matriz ou molde errado para a ordem | Matriz codificada (RFID, código de barras ou chave mecânica) que o controle da máquina verifica em relação à ordem |
| Programa ou receita errados | Receita chamada automaticamente a partir do número da ordem |
| Mangueiras conectadas às portas erradas | Placas ou engates de múltiplas conexões que só encaixam de um jeito, com código de cores |
| Peça de formato montada na posição errada | Pinos de localização assimétricos |
| Etiquetas antigas ou materiais deixados na linha | Lista de verificação de liberação da linha com assinatura; recipientes dedicados para o material removido |

### Setores regulados

Em fábricas reguladas, a troca faz parte do sistema de qualidade. Na embalagem farmacêutica dos EUA, a inspeção de liberação da linha antes do uso e sua documentação no registro de lote são exigidas pelo 21 CFR 211.130(e) [11]. Em alimentos, as trocas relacionadas a alérgenos fazem parte dos controles de alérgenos exigidos pelo 21 CFR 117.135(c)(2) [37]. Nas cadeias de suprimento automotiva (IATF 16949) e aeroespacial (AS9100), os planos de controle e os requisitos específicos de cada cliente podem exigir verificação de ajuste ou verificação da primeira peça após os ajustes; verifique seus contratos e planos de controle em vez de presumir uma regra genérica. O guia de [planejamento da produção aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/) aborda o contexto aeroespacial. Projetos SMED nesses ambientes devem incluir o responsável pela qualidade desde o primeiro dia e validar qualquer alteração nas etapas de limpeza ou verificação antes de utilizá-la.

### Visão estatística

Uma troca também é uma fonte de variação. Se as peças do início de cada lote diferirem sistematicamente, um gráfico de controle separado entre "primeiros 30 minutos após a troca" e "restante do lote" torna isso visível. Cakmakci utilizou a capacidade de processo (Cpk) em um estudo SMED automotivo para avaliar a relação entre a redução do tempo de ajuste e o projeto dos equipamentos [16]. O guia [Six Sigma e análise de causa raiz](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/) aborda a análise de capacidade e os gráficos de controle.

## Pessoas e papéis: quem faz o quê em uma troca de ferramental

SMED costuma ser descrito como um método técnico. Na prática, ele muda o trabalho de operadores e preparadores mais do que qualquer outra ferramenta Lean, por isso tem sucesso ou fracasso com eles.

### Papéis

| Papel | No projeto SMED | Na troca diária |
|---|---|---|
| Operador | Membro da equipe; conhece os detalhes, filma e é filmado | Faz a preparação externa, parte do trabalho interno e a medição da primeira peça |
| Preparador / preparador de ferramentas | Membro central da equipe; é dono do método | Faz a troca interna e lidera o trabalho paralelo |
| Técnico de manutenção | Constrói e mantém o hardware de troca rápida, acoplamentos e grampos | Apoia trocas complexas; mantém matrizes e moldes em boas condições |
| Engenheiro de manufatura | Facilita, analisa o vídeo e projeta soluções técnicas | É dono do padrão; o aprimora |
| Técnico da qualidade | Define verificações da primeira peça e a prova de erros | Aprova primeiras peças quando exigido |
| Supervisor | Patrocina; libera tempo para a equipe | Planeja as trocas junto com a programação; verifica a aderência |
| Planejador de produção | Concorda sobre como o tempo economizado será usado; altera os tamanhos de lote | Sequencia as ordens para minimizar o esforço de troca |
| Representante de segurança | Revisa o controle de energia e a ergonomia | Audita o bloqueio durante as trocas |

### O que muda para operadores e preparadores

O SMED geralmente desloca o trabalho: os operadores assumem a preparação externa e partes da preparação interna, e os preparadores passam menos tempo procurando e mais tempo nas etapas técnicas. Isso é uma mudança no conteúdo do trabalho. Em fábricas sindicalizadas, descrições de cargo, classificações e faixas salariais costumam ser definidas em contrato, por isso acordem a nova divisão com o sindicato antes que o novo padrão entre em vigor. Em fábricas não sindicalizadas, a mesma questão surge informalmente: quem recebe treinamento, quem é responsável caso uma primeira peça falhe e se as novas tarefas são reconhecidas.

### Respeito às pessoas

Três regras da prática fazem a diferença entre um projeto SMED que o chão de fábrica apoia e um que ele resiste:

1. **Filme o processo, não a pessoa.** Explique o propósito antes de filmar. Deixe o preparador comentar o vídeo primeiro; ele ou ela normalmente sabe exatamente onde está o desperdício. Em fábricas sindicalizadas, informe os representantes sindicais cedo e acorde como os vídeos serão armazenados e usados.
2. **Não transforme o tempo economizado em cortes de quadro.** Se o SMED levar a demissões, o próximo projeto de melhoria não receberá ideias do chão de fábrica. Use o tempo para capacidade, lotes menores ou treinamento.
3. **Estabeleça metas que possam ser atingidas com segurança.** Um padrão de troca descreve um bom método em um ritmo normal. Analogias com a parada nos boxes ajudam a explicar o trabalho paralelo e a preparação, mas uma equipe de boxes treina para uma parada sob condições de corrida; um preparador faz a mesma troca no fim de um longo turno, muitas vezes por ano.

A Vorne recomenda começar pelas melhorias "humanas", ou seja, preparação e organização, antes das mudanças técnicas [20]; a leanproduction.com faz a mesma recomendação [19]. Essa ordem também constrói confiança: a equipe vê resultados rápidos a partir de suas próprias ideias antes que se gaste dinheiro.

## Modelos e listas de verificação de SMED

Os modelos abaixo podem ser copiados para uma planilha ou impressos em folhas A3 ou 11 × 17 pol. São formatos de trabalho testados na prática, não um padrão.

### Modelo 1: folha de observação de troca (lista de elementos)

| # | Elemento (verbo + objeto) | Início (mm:ss) | Duração (min) | Pessoa | I/E hoje | Tipo de desperdício (busca, caminhada, espera, ajuste, outro) | Ideia | Poderia ser I/E |
|---|---|---|---|---|---|---|---|---|
| 1 | Parar a máquina, última peça boa | 00:00 | | | I | | | |
| 2 | | | | | | | | |
| … | | | | | | | | |
| | **Total interno** | | | | | | | |
| | **Total externo** | | | | | | | |

Dicas: uma linha por elemento, verbos no início ("soltar", "caminhar", "procurar"), tempos lidos do vídeo. Acrescente uma coluna "distância percorrida" se a caminhada for significativa.

### Modelo 2: planilha de conversão de interno para externo

| Elemento interno | Por que a máquina precisa estar parada? | O que teria que mudar para ele ser externo? | Técnica (preparar, padronizar função, dispositivo intermediário) | Custo (baixo / médio / alto) | Responsável | Prazo |
|---|---|---|---|---|---|---|
| Aquecer o molde | O molde só aquece dentro da máquina | Estação separada de pré-aquecimento | Preparar condições de operação | Médio | | |
| Alinhar a matriz a olho | Não há referência | Pino de localização e batente | Padronizar função | Baixo | | |
| | | | | | | |

### Modelo 3: lista de verificação pré-troca (setup externo)

| Item para o próximo job | Local | Verificado por | Tempo | OK |
|---|---|---|---|---|
| Matriz / molde / formato nº … (inspecionado, completo, limpo) | Preparado junto à máquina, posição … | | | ☐ |
| Ferramentas (listar), grampos, parafusos reserva | Carrinho de troca | | | ☐ |
| Material / componentes (quantidade, lote, secagem se necessário) | | | | ☐ |
| Programa / receita liberado e carregado | Controlador | | | ☐ |
| Desenho, plano de controle, dispositivo de medição da primeira peça | Carrinho | | | ☐ |
| Embalagens e etiquetas para o próximo job | | | | ☐ |
| Ponte rolante / empilhadeira / segunda pessoa reservada para o horário … | | | | ☐ |
| Técnico de qualidade notificado (se for necessária aprovação) | | | | ☐ |
| Dispositivos de bloqueio e procedimento de bloqueio à mão | Posto de bloqueio | | | ☐ |

Gatilho: um horário fixo antes do fim da produção atual (por exemplo, quando começarem os últimos 45 minutos), indicado na máquina ou na programação.

### Modelo 4: folha de troca padrão (versão com duas pessoas)

| Passo | Ajustador A | Tempo (min) | Ajustador B | Tempo (min) | Ponto-chave (segurança / qualidade) |
|---|---|---|---|---|---|
| 1 | Parar a máquina, aplicar bloqueio | 0–2 | Aplicar o próprio bloqueio | 0–2 | Verificar energia zero antes de entrar |
| 2 | Desconectar engates (lado do operador) | 2–4 | Desconectar engates (lado traseiro) | 2–4 | Superfícies quentes: luvas |
| 3 | Desapertar, retirar o molde antigo | 4–8 | Guiar a ponte rolante, colocar no carrinho | 4–8 | Sinal de elevação com duas pessoas |
| … | | | | | |
| n | Verificação da primeira peça, liberação | | Devolver o molde antigo ao armazenamento | | Registrar o resultado da primeira peça |
| | **Tempo total alvo** | | | | |

### Modelo 5: auditoria de troca (semanal durante o primeiro mês, mensal depois)

| Pergunta | Sim / Não | Comentário |
|---|---|---|
| A lista de verificação pré-troca foi concluída antes da parada? | | |
| A sequência padrão foi seguida? | | |
| O bloqueio e a verificação foram feitos conforme escrito? | | |
| Todas as ferramentas e peças estavam no ponto de uso (sem procurar)? | | |
| A verificação da primeira peça foi feita conforme definido? | | |
| O tempo de troca foi registrado (última peça boa até a primeira peça boa)? | | |
| Desvio em relação à meta, causa registrada? | | |
| A ideia de melhoria da equipe foi capturada? | | |

### Modelo 6: carta de projeto SMED (uma página)

| Campo | Conteúdo |
|---|---|
| Máquina / linha | |
| Problema (com dados) | ex.: troca média de 96 min, faixa de 78–131 min, 11 dias de estoque |
| Meta | ex.: −50% no primeiro ciclo, cada molde a cada 3 dias |
| Uso do tempo economizado (acordado com o planejamento) | capacidade / lotes menores / divisão |
| Equipe | nomes e funções |
| Revisão de segurança feita por | |
| Cronograma | datas de linha de base, oficina, implementação e padronização |
| Limite de orçamento para hardware | |
| Patrocinador | |

## Roteiro de implantação: do piloto a um sistema de troca rápida em toda a fábrica

O cronograma abaixo é uma estimativa de profissionais para uma planta de manufatura discreta de porte médio; os prazos dependem dos equipamentos, dos prazos de entrega do hardware e do tempo que a equipe tem disponível [unverified: estimativa de profissionais, sem fonte de referência].

| Fase | Prazo | Atividades | Resultado |
|---|---|---|---|
| 1. Preparar | Semanas 1–3 | Escolher a máquina-piloto, coletar dados de referência por pelo menos duas semanas [19], termo de abertura, revisão de segurança, acordo sobre o uso do tempo economizado | Termo de abertura assinado, referência de base conhecida |
| 2. Oficina-piloto | Semana 4 (3–5 dias) | Filmar e analisar a troca, separar e converter, ganhos rápidos no chão de fábrica, primeiro teste da nova sequência | Primeiro padrão novo, lista de ações |
| 3. Implementar | Semanas 5–10 | Hardware (engates, grampos, carrinhos), pré-aquecimento ou pré-ajuste, segundo teste, treinamento de todos os turnos | Novo padrão treinado |
| 4. Estabilizar | Semanas 11–16 | KPI diário no quadro, auditorias semanais, ajuste dos tamanhos de lote e da programação | Tempo estável, lotes reduzidos |
| 5. Expandir | Meses 5–12 | Próximas 3–5 máquinas, treinamento de coaches internos de SMED, padrão de troca incluído nas especificações de novos equipamentos | Sistema de troca rápida em toda a área |

### Escolhendo as próximas máquinas

Classifique os candidatos por impacto e esforço:

| Critério | Peso | Pergunta |
|---|---|---|
| Gargalo | Alto | A máquina é a restrição do fluxo de valor? |
| Frequência × duração das trocas | Alto | Quantas horas por semana são perdidas em trocas? |
| Dor de estoque / prazo de entrega | Médio | Esta máquina gera lotes grandes e alto estoque a jusante? |
| Variação do tempo de troca | Médio | A faixa é ampla (sinal de falta de padrões)? |
| Prontidão da equipe | Médio | A equipe está disposta, e um supervisor patrocina o projeto? |
| Esforço de hardware | Baixo (negativo) | É necessário grande investimento antes de obter resultados? |

### Tornar as trocas um requisito de projeto

O projeto de SMED mais barato é aquele que não precisa ser feito. Inclua os requisitos de troca nas especificações de novos equipamentos, ferramentas e moldes: tempo máximo de troca, alturas de fixação e engates padronizados, ajustes armazenados, nenhum ajuste manual. Braglia e colegas propõem um método estruturado, o projeto de troca rápida (QCD, *quick changeover design*), para ajudar os fabricantes de máquinas a projetar para trocas rápidas desde o início [15]. Compras e engenharia precisam ser responsáveis por isso, e não apenas a equipe de Lean.

## KPIs de troca de ferramentas: como medir o progresso

| KPI | Fórmula / definição | Por que importa | Revisão típica |
|---|---|---|---|
| Tempo médio de troca | Σ tempos de troca / número de trocas (última peça boa até a primeira peça boa) | Resultado principal | Diária por máquina, tendência semanal |
| Faixa ou desvio padrão do tempo de troca | Máx − mín, ou desvio padrão das últimas 20 trocas | Mostra se existe um padrão e se ele é seguido | Semanal |
| Trocas dentro do padrão | Trocas ≤ tempo-alvo / todas as trocas × 100% | Aderência | Diária no quadro |
| Tempo de setup interno | Soma dos elementos internos | Progresso da separação e da conversão | Por ciclo SMED |
| Tempo de aquecimento e refugo | Tempo e refugo desde o reinício até a velocidade e a qualidade padrão | Frequentemente a maior perda oculta | Por troca |
| Primeira peça aprovada de primeira | Primeiras peças aprovadas na primeira verificação / todas as primeiras peças × 100% | Qualidade da troca | Semanal |
| Número de trocas por semana | Contagem | Mostra se os ganhos estão sendo usados para lotes menores | Semanal com o planejamento |
| Participação da troca no tempo planejado | Σ tempo de troca / tempo de produção planejado × 100% | Visão de capacidade | Semanal |
| EPEI | Intervalo no qual todas as peças são produzidas uma vez | Flexibilidade | Mensal |
| Tamanho médio do lote e dias de estoque | Peças por lote; estoque / demanda média diária | Resultado do negócio | Mensal |
| Disponibilidade do OEE | Conforme definido no seu esquema de OEE | Efeito no nível da máquina, se o tempo for usado para produzir | Semanal |

Mantenha o quadro simples: um gráfico por máquina com os tempos diários de troca em relação ao alvo, e uma linha para o motivo quando uma troca excedeu o alvo. As regras gerais para quadros de KPI estão descritas no guia [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/).

**Uma palavra sobre metas:** "menos de dez minutos" é uma aspiração de Shingo, não um referencial universal. Um bom tempo de troca é aquele que é estável, seguro e curto o suficiente para sustentar o EPEI que seus clientes precisam. Para uma linha grande de prensas, 20 minutos pode ser excelente; para um pequeno torno CNC, 20 minutos pode ser lento.

## O caso de negócio: custos, ROI e contabilização de estoque

As equipes financeiras fazem três perguntas sobre SMED: quanto custa, o que retorna e quando aparece nos números. As respostas dependem fortemente de a máquina ser um gargalo ou não.

### Custos

| Item de custo | Natureza típica | Contabilização |
|---|---|---|
| Tempo da equipe para oficina e acompanhamento | Horas de operadores, preparadores e engenheiros | Despesa operacional |
| Hardware de baixo custo (carrinhos, quadros de sombra, blocos espaçadores, codificação por cores) | Pequeno | Geralmente despesa operacional, dependendo do seu limite de capitalização |
| Hardware de troca rápida (engates, sistemas de fixação, pré-aquecedores, presetters) | Médio a alto | Frequentemente investimento de capital se acima do seu limite |
| Treinamento | Horas | Despesa operacional |
| Perda de produção durante testes | Geralmente pequena se os testes forem feitos durante trocas planejadas | Despesa operacional |

### Retornos

1. **Capacidade em um gargalo:** horas de troca economizadas × margem de contribuição por hora, se a produção adicional puder ser vendida. No exemplo do CNC acima, os 590 minutos de troca por semana custam cerca de US$ 92.000 por ano em margem perdida; reduzi-los pela metade recuperaria cerca de US$ 46.000 por ano, mas somente se a produção extra encontrar compradores.
2. **Redução de estoque:** uma liberação de caixa única (balanço patrimonial) mais economias recorrentes no custo de manutenção de estoque (demonstração de resultados).
3. **Menos urgências e trocas emergenciais:** horas extras, frete premium e interrupção do trabalho planejado.
4. **Sucata e retrabalho:** aquecimentos mais curtos e mais estáveis.
5. **Mão de obra:** às vezes menor, frequentemente semelhante; trabalho paralelo reduz o tempo decorrido, mas nem sempre o conteúdo de mão de obra.

### Exemplo de ROI resolvido (ilustrativo, continuando o exemplo de moldagem)

| Item | Valor |
|---|---|
| Investimento: estação de pré-aquecimento | $12,000 |
| Investimento: 6 conjuntos de engates múltiplos a $1,500 | $9,000 |
| Investimento: padronização de grampos e dispositivos de localização | $6,000 |
| Tempo da equipe: 6 pessoas × 16 horas × $45 com encargos | $4,320 |
| **Custo único total** | **$31,320** |
| Estoque de produtos acabados reduzido em 5 dias a $6,000 por dia de custo dos produtos vendidos | $30,000 de liberação única de caixa |
| Custo de manutenção de estoque evitado a 20% ao ano sobre $30,000 | $6,000 por ano |
| Menos expedições urgentes e horas extras (estimativa a partir dos registros do ano passado) | $8,000 por ano |
| Refugo na partida: 15 peças refugadas a menos por troca × 10 trocas × 50 semanas × $0.90 | $6,750 por ano |
| **Benefício recorrente** | **$20,750 por ano** |
| **Payback simples sobre os benefícios recorrentes** | 31,320 / 20,750 ≈ 1,5 ano |

O caixa liberado do estoque ($30,000) quase cobre o investimento no primeiro ano, mas se trata de um efeito no balanço patrimonial, não de lucro. Mantenha essas informações separadas no caso de negócio e não conte a mesma economia duas vezes.

### O efeito do custeio por absorção

Pelo custeio por absorção [38], que o US GAAP exige, em substância, para a divulgação externa de estoques (ASC 330-10-30-1 e 30-3 incluem uma alocação de custos indiretos fixos de fabricação com base na capacidade normal, e 330-10-30-8 afirma que excluir todos os custos indiretos do custo do estoque não é um procedimento contábil aceito [40]; pergunte ao seu controller como sua empresa aplica essa regra), parte dos custos indiretos fixos de fabricação é capitalizada no estoque. Quando o estoque diminui, os custos indiretos que haviam sido capitalizados no estoque reduzido são transferidos para o custo dos produtos vendidos nesse período. Assim, o lucro reportado pode cair temporariamente enquanto o estoque é reduzido, mesmo que o caixa melhore.

**Exemplo resolvido (ilustrativo):** Se 30 por cento do valor de estoque de $30,000 corresponderem a custos indiretos fixos, a redução do estoque libera cerca de $9,000 de custos indiretos para o custo dos produtos vendidos do período. Os controllers das fábricas devem explicar isso à gestão antes do início do programa SMED, para que um sucesso do lean não pareça um estouro de custos. O guia [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) discute como apresentar esses efeitos em um painel de indicadores da fábrica.

## SMED e outras ferramentas lean

O SMED raramente funciona sozinho. Ele depende de algumas ferramentas e viabiliza outras.

| Ferramenta | Relação com o SMED |
|---|---|
| [5S](https://www.m365.fm/en/learn/5s-visual-management/) | Pré-requisito: ferramentas e matrizes em locais definidos eliminam a busca, o maior desperdício externo [27] |
| [Trabalho padronizado](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) | Mantém os ganhos: a nova troca de ferramenta torna-se o padrão [26] |
| [TPM](https://www.m365.fm/en/learn/tpm-oee/) | Mantém matrizes, moldes e ferramentas de troca rápida em condições adequadas; o leanproduction.com recomenda o TPM primeiro quando as quebras, e não as trocas, dominam o tempo perdido [19][29] |
| [Poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/) | Previne o uso de ferramentas, programas ou conexões erradas [28] |
| [Kanban e pull](https://www.m365.fm/en/learn/kanban-pull-system/) | Utiliza lotes menores; as quantidades do kanban diminuem à medida que as trocas ficam mais curtas [34] |
| [Heijunka](https://www.m365.fm/entity/heijunka/) | O nivelamento por mix exige trocas frequentes e curtas [25] |
| [Mapeamento do fluxo de valor](https://www.m365.fm/en/learn/value-stream-mapping/) | Mostra quais trocas geram estoque e lead time; o tempo de troca e o EPEI são registros do quadro de dados [35] |
| [Kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/) | A oficina SMED é um formato clássico de evento kaizen |
| [Teoria das restrições](https://www.m365.fm/en/learn/theory-of-constraints/) | Direciona o esforço do SMED primeiro para a restrição, onde o tempo economizado se converte em produção do sistema |
| [Programação da produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/) | Sequencia as ordens para minimizar o esforço de troca e transforma trocas mais curtas em lotes menores |

## Exemplos documentados de SMED

Muitas páginas na web citam reduções "típicas" de 50 a 90 por cento sem indicar fonte. Os exemplos a seguir são documentados, com suas limitações.

### Trocas de prensas na Toyota

A Wikipédia, com base nos livros de Shingo, relata que as trocas da Toyota passaram de horas para 15 minutos nos anos 1960 e para 3 minutos nos anos 1970 [5]; o próprio relato de Shingo descreve trocas de matriz de uma a duas horas, às vezes meio dia, reduzidas para poucos minutos após ele começar a trabalhar na Toyota em 1969 [6]. Um livro didático aberto de engenharia relata a troca de uma prensa de 1.000 toneladas na Toyota reduzida de quatro horas para três minutos [36]. Os números vêm de relatos de Shingo e da Toyota e não foram auditados de forma independente, mas são consistentes entre as fontes.

### Brighton NC Machine Corporation (Michigan, NIST MEP)

A Brighton NC Machine, fabricante de Michigan com mais de 100 funcionários, trabalhou com o Michigan Manufacturing Technology Center, parte da NIST MEP National Network [17]. Antes do projeto, as trocas só podiam ser feitas no primeiro turno, levavam 8 horas e 20 minutos e exigiam 9.121 pés de deslocamento dos funcionários [17]. Um evento kaizen com vídeo, diagrama de espaguete e gráfico de análise de setup levou a uma redução de 70 por cento no tempo de troca e de 98 por cento no tempo de deslocamento; a empresa informou US$ 460.000 em novas vendas e US$ 125.000 em economia de custos [17]. Os resultados são os informados pela empresa e pelo MEP; os casos de sucesso do MEP são relatados pelos próprios clientes.

### Casos de consultoria de Shingo

Shingo relatou que, em seus casos de redução de setup entre 1975 e 1985, os tempos de setup caíram, em média, para cerca de 2,5 por cento do original [5]. Trata-se de uma média de casos selecionados pelo inventor do método e, portanto, de um referencial superior, e não de uma expectativa.

### Visão geral da pesquisa

Uma revisão do estado da arte de da Silva e Godinho Filho no *International Journal of Advanced Manufacturing Technology* (2019) classificou 130 artigos sobre SMED por área, método, ferramentas, implementação e resultados [14]. A literatura mostra o SMED aplicado em ambientes automotivos, de metalurgia, embalagens, impressão, alimentos e farmacêutico. Um caso da indústria gráfica citado em um livro didático aberto relatou uma redução de 46 por cento no tempo interno de setup [36]. Os casos publicados tendem a relatar sucessos; projetos que fracassaram ou perderam força raramente são descritos, por isso é preciso ter cautela com as médias da literatura de casos.

## Erros comuns no SMED

| Erro | Por que prejudica | Melhor abordagem |
|---|---|---|
| Nenhuma decisão sobre como usar o tempo economizado | Os ganhos desaparecem em tempo ocioso; os lotes continuam iguais | Acordar com o planejamento antes do projeto: capacidade, lotes menores ou divisão |
| Comprar equipamentos antes de tudo | Automatiza o desperdício; o orçamento acaba antes de organizar o processo | Esgotar primeiro a separação interna/externa e a conversão; a mecanização fica por último [5] |
| Medir apenas a "troca" | Deixa de fora o aquecimento e os ajustes, muitas vezes a maior parte do tempo | Do último bom produto ao primeiro bom produto na velocidade padrão [2] |
| Filmar sem explicação | A equipe se sente vigiada; surge resistência | Explicar o objetivo, envolver o operador de troca na análise, acordar o uso do vídeo |
| Piloto na máquina mais difícil | Resultados lentos, longos e caros | Fazer o piloto com uma troca de 30 a 90 minutos que ocorra com frequência |
| Uma troca "heroica" | Registra um tempo obtido com engenheiros presentes, não repetível | Padronizar, treinar todos os turnos, medir ao longo de semanas |
| Pular o bloqueio/etiquetagem (lockout/tagout) para economizar tempo | Alto risco de lesão grave; violação da OSHA | Incluir o bloqueio no padrão; torná-lo mais rápido, nunca pulá-lo [8] |
| Sem padrão e sem auditoria | Os tempos voltam ao normal em poucos meses | Folha padrão de troca, auditorias, KPI no quadro |
| Ignorar a programação | Sequências aleatórias geram trocas completas que poderiam ser parciais | Sequenciar por família de produtos; planejar as trocas em horários fixos |
| Iniciar uma troca logo antes da troca de turno | A passagem de turno ocorre no meio da preparação interna; etapas são puladas ou repetidas, e os bloqueios mudam de mãos | Planejar as trocas para que uma mesma equipe as conclua, ou definir um ponto formal de passagem com transferência do bloqueio, conforme exigido pelo seu procedimento de controle de energia |
| Custo de preparação no sistema de planejamento nunca atualizado | O ERP continua calculando lotes grandes | Atualizar os tempos de preparação e as regras de tamanho de lote no ERP após o SMED |
| Tratar o SMED como um projeto único | Não há um segundo ciclo; a etapa de equipamentos nunca acontece | Planejar ciclos; tornar o SMED parte da rotina de melhoria |

O penúltimo ponto é fácil de passar despercebido. Muitos sistemas ERP calculam os tamanhos de lote a partir dos tempos de preparação armazenados nos roteiros. Se esses valores continuarem os antigos, o sistema de planejamento seguirá recomendando os lotes grandes antigos. O guia [S&OP e MRP](https://www.m365.fm/en/learn/sop-mrp-production-planning/) explica onde esses parâmetros estão armazenados.

## Limites e críticas do SMED

O SMED é uma das ferramentas do lean com melhor documentação, mas tem limites, e a literatura de pesquisa já os apontou.

### 1. Muita organização, pouco projeto

McIntosh e colegas argumentaram em 1996 que a interpretação difundida do SMED levou os praticantes a privilegiar mudanças organizacionais de baixo custo e baseadas em equipes, deixando de lado soluções baseadas em projeto que poderiam melhorar as trocas de forma mais fundamental; eles deram atenção especial ao problema de sustentar as melhorias [13]. O mesmo grupo de pesquisa publicou depois uma avaliação crítica da metodologia de Shingo no *International Journal of Production Research* (2000) [12]. O estudo de Cakmakci sobre o setor automotivo relaciona da mesma forma os problemas de setup a equipamentos e projeto de ferramentais inadequados [16], e Braglia e colegas desenvolveram o projeto de troca rápida para incorporar a capacidade de troca ao projeto da máquina [15]. A conclusão prática: realize oficinas de SMED, mas também inclua os requisitos de troca nas especificações de novos equipamentos e projetos de produto.

### 2. Sustentar os ganhos

Os tempos de troca tendem a voltar ao patamar anterior quando o padrão não é treinado para novos funcionários, o carrinho de troca perde ferramentas ou o hardware de troca rápida não recebe manutenção. McIntosh e colegas destacaram a sustentação como uma fraqueza central [13]. As contramedidas são pouco glamourosas: trabalho padronizado, auditorias, um KPI no quadro, e manutenção do hardware sob TPM.

### 3. Nem todo processo ganha igualmente

- **Indústrias de processo** (química, alimentos, farmacêutica) costumam ter trocas dominadas por limpeza, validação e verificações obrigatórias. O SMED reduz o trabalho em torno delas, mas o planejamento de campanhas e o sequenciamento de produtos (do claro para o escuro, sem alérgenos primeiro) podem importar mais.
- **Job shops de alto mix e baixo volume** têm muitos setups únicos, que acontecem uma só vez. A análise elemento por elemento de um único setup rende menos; fixação padronizada, bibliotecas de ferramentas, programação offline e agrupamento por família de peças rendem mais.
- **Máquinas com capacidade ociosa e estoque baixo** ganham pouco com o SMED. Verifique primeiro a parcela das trocas no tempo perdido [19].

### 4. Ganhos que não chegam ao resultado

Se o tempo economizado não for utilizado (veja as três opções acima), o SMED melhora um número em um gráfico e nada mais. O método não consegue impedir isso; a gestão precisa fazê-lo, e esta é a razão mais comum de o SMED decepcionar.

### 5. Pressão sobre as pessoas

Metas de velocidade e cronômetros podem gerar pressão, trabalho apressado e atalhos que contornam a segurança. O método em si não exige isso, mas a forma como é implementado pode exigir. As boas práticas definem metas em um ritmo sustentável, protegem o tempo de bloqueio (lockout) e não usam o tempo economizado para cortar postos de trabalho.

## SMED na era digital: dados, vídeo, MES e programação

Ferramentas digitais não substituem o método SMED, mas tornam a análise mais rápida e os resultados mais fáceis de sustentar.

### Medição automática de trocas de ferramenta

Os registros manuais de troca costumam ser incompletos. Sistemas de monitoramento de máquinas podem detectar trocas a partir dos estados da máquina e da contagem de peças, de modo que cada troca recebe início, fim e duração sem papelada; fornecedores como a MachineMetrics argumentam que a captura automática de dados é mais confiável do que o registro manual [21] (alegação do fornecedor). O operador ainda precisa informar o motivo quando uma troca se prolonga. O guia sobre [sistema de execução de manufatura (MES) e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) explica como esses dados se encaixam na arquitetura de sistemas da fábrica, e [Manufacturing IT com Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) aborda as opções em nuvem para coletá-los.

Os equipamentos de troca rápida estão cada vez mais conectados: matrizes e moldes codificados que o controlador verifica contra a ordem, downloads de receitas, sistemas de fixação com sensores. Cada um desses itens é um ativo de OT na rede da fábrica, com as mesmas questões de atualização e acesso de qualquer controlador; o guia sobre [cibersegurança de OT e ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) explica como protegê-los.

### Análise em vídeo

Vídeo de smartphone ou câmera de ação é suficiente para a maioria das oficinas SMED. Software que permite à equipe dividir o vídeo em elementos e marcá-los como internos ou externos economiza horas de cronometragem manual. Combine a privacidade dos dados: quem vê os vídeos, por quanto tempo são armazenados e que eles não são usados para avaliação de desempenho individual.

### Instruções de trabalho e receitas digitais

Instruções de trabalho digitais podem trocar automaticamente conforme a ordem, exibir a folha padrão de troca passo a passo com imagens e registrar o resultado da primeira peça; isso é tratado no conjunto de conteúdos sobre [manufatura sem papel](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/). A gestão de receitas, em que as configurações da máquina são armazenadas por produto e baixadas a partir da ordem, elimina o ajuste como fonte de tempo e erro. Em setores regulados, ambos precisam ser validados.

### Programação com preparações dependentes da sequência

Quando os tempos de troca dependem da sequência (cores claras antes das escuras, formatos pequenos antes dos grandes, sem alérgenos primeiro), uma ferramenta de programação pode sequenciar as ordens para minimizar o tempo total de troca. Sistemas de planejamento e programação avançados (APS) podem modelar matrizes de preparação dependentes da sequência; o guia sobre [programação da produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/) explica como funcionam e o que exigem do chão de fábrica. A matriz de preparação no APS precisa ser atualizada após cada ciclo SMED; caso contrário, o programador otimiza com base em tempos antigos.

### Simulação e modelos de fluxo de valor

Antes que uma fábrica reduza os tamanhos de lote em todo um fluxo de valor, ela pode testar o efeito de trocas mais curtas sobre o EPEI, o estoque e o lead time em um modelo de fluxo de valor ou em uma simulação de eventos discretos. O guia sobre [gêmeo digital na manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/) e o conjunto de conteúdos sobre [simulação na manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) explicam a abordagem. Softwares de fluxo de valor como o iFAKT Polaris são um exemplo de ferramenta que mantém os tempos de troca e os tamanhos de lote por etapa do processo e calcula seu efeito sobre o fluxo de valor; veja o perfil do [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/). **Nota: O autor trabalha na iFAKT GmbH.**

### Limites

Ferramentas digitais ampliam um padrão de trabalho; elas não o criam. Um painel de monitoramento de máquinas mostrando trocas de 90 minutos não muda nada até que uma equipe filme a troca e a corrija. Comece com papel e vídeo, e digitalize a coleta de dados quando o padrão e a rotina de KPIs estiverem funcionando.

## Glossário de SMED

| Termo | Significado |
|---|---|
| **Ajuste** | Regulagem por tentativa e erro após a montagem de uma ferramenta; é a maior categoria do tempo de setup na divisão de Shingo [5] |
| **Troca de produto (changeover)** | Mudança de uma máquina ou linha de um produto para outro; também chamada de setup [2] |
| **Tempo de troca de produto** | Tempo desde a última peça boa da corrida anterior até a primeira peça boa da nova corrida [2], idealmente na velocidade padrão |
| **Carrinho de troca** | Carrinho que contém todas as ferramentas e peças de uma troca de produto na ordem de uso |
| **Estoque de ciclo** | Estoque criado pelos tamanhos de lote; em média, cerca de meio lote quando a demanda é estável |
| **Matriz** | Ferramenta usada em prensa para cortar ou conformar o material; origem do "D" em SMED |
| **ECRS** | Eliminar, combinar, reordenar, simplificar: perguntas de melhoria do Training Within Industry, usadas no programa de troca rápida de matrizes da Toyota [5] |
| **EOQ / EPQ** | Quantidade econômica de pedido / quantidade econômica de produção: fórmulas de tamanho de lote que equilibram o custo de setup e o custo de manutenção |
| **EPEI / EPEx** | Cada peça (produto) a cada intervalo: frequência com que um processo percorre todas as suas peças [3] |
| **Setup externo** | Trabalho de setup que pode ser feito com a máquina em funcionamento [1] |
| **Aprovação da primeira peça** | Verificação da primeira peça após uma troca de produto, antes de a produção continuar |
| **Grampo funcional** | Fixador que prende com um único movimento, como uma alavanca de came ou parafuso de quarto de volta [5] |
| **Gabarito intermediário** | Suporte padrão (pallet, subplaca) no qual a próxima ferramenta ou peça de trabalho é preparada fora da máquina [5] |
| **Setup interno** | Trabalho de setup que só pode ser feito com a máquina parada [1] |
| **Liberação de linha (line clearance)** | Inspeção de que todos os materiais da corrida anterior foram retirados antes do início da seguinte; exigida na embalagem farmacêutica dos EUA [11] |
| **Bloqueio e etiquetagem (LOTO)** | Procedimentos e dispositivos para controlar energia perigosa durante a manutenção, incluindo o setup, conforme 29 CFR 1910.147 [8] |
| **Exceção para manutenção menor** | Exceção restrita ao bloqueio e etiquetagem para trocas de ferramentas menores, rotineiras, repetitivas e integrais durante a produção normal, com proteção alternativa eficaz [8][9] |
| **OTED** | Troca de matriz com um toque: troca de produto em menos de 100 segundos [5] |
| **Operações paralelas** | Duas ou mais pessoas trabalhando simultaneamente em uma troca de produto, em uma sequência definida [5] |
| **Troca rápida (QCO)** | Termo comum nos EUA para a prática do SMED [18] |
| **Receita** | Conjunto armazenado de parâmetros da máquina por produto, carregado em vez de ajustado manualmente |
| **Partida (run-up)** | Fase após a reinicialização até que peças boas sejam produzidas na velocidade padrão |
| **Bloco de segurança** | Bloco colocado entre as metades da matriz de uma prensa enquanto as matrizes são ajustadas ou reparadas; exigido pela OSHA para prensas mecânicas de potência [10] |
| **Gráfico de análise de setup** | Lista de elementos de uma troca de produto, com tempos e classificação interno/externo [17] |
| **Diagrama de espaguete** | Desenho dos percursos de deslocamento em um layout |
| **Padronizar a função, não a forma** | Padronizar apenas as características de uma ferramenta que interagem com a máquina, como a altura de fixação [5] |
| **3 Ups** | Limpeza, preparação, partida: um modelo simples das fases da troca de produto [24] |

## FAQ: Perguntas sobre SMED e troca de ferramentas

### O que significa SMED?

SMED significa *single-minute exchange of die* (troca de matriz em um único minuto; às vezes escrito "dies"). "Single-minute" refere-se a um número de um único dígito de minutos, ou seja, uma troca abaixo de dez minutos [1]. O método se aplica a qualquer troca, não apenas a matrizes de prensa.

### Quem criou o SMED?

Shigeo Shingo (1909–1990), engenheiro industrial japonês, desenvolveu o método a partir da década de 1950, com trabalhos na Toyo Kogyo (Mazda), na Mitsubishi Heavy Industries e, a partir de 1969, na Toyota [6]. Ele o publicou em inglês em 1985, como *A Revolution in Manufacturing: The SMED System* [6].

### Quais são as etapas do SMED?

Observar e registrar a troca, separar elementos internos de externos, converter internos em externos, otimizar os elementos internos, otimizar os elementos externos, padronizar e repetir [5]. Este guia acrescenta à frente uma etapa de preparação (piloto, equipe, revisão de segurança, uso do tempo economizado).

### Qual é a diferença entre preparação interna e externa?

A preparação interna só pode ser feita com a máquina parada, como montar uma matriz. A preparação externa pode ser feita com a máquina em operação, como buscar e verificar a próxima matriz [1]. O SMED transfere o máximo possível de trabalho do modo interno para o externo.

### Como se calcula o tempo de troca?

Meça do último bom produto da corrida anterior até o primeiro bom produto da nova corrida, na velocidade padrão [2][21]. O tempo médio de troca é a soma de todos os tempos de troca dividida pelo número de trocas; a participação da troca é o tempo total de troca dividido pelo tempo de produção planejado. Consulte as fórmulas e o exemplo de CNC na seção de medição.

### Qual é a diferença entre tempo de troca e tempo de setup?

No uso cotidiano, costumam significar a mesma coisa, embora algumas fontes os separem explicitamente [23]. Estritamente, muitos profissionais usam "tempo de setup" para a troca em si e "tempo de troca" para toda a perda entre o último bom produto e o primeiro bom produto, incluindo desaceleração e aceleração. Use a definição mais ampla para trabalhos de melhoria.

### Qual é um bom tempo de troca?

A meta de Shingo é abaixo de dez minutos [1]. Uma resposta prática: um bom tempo de troca é estável (faixa estreita), seguro e curto o suficiente para atender aos tamanhos de lote e ao EPEI que seus clientes precisam. Para grandes linhas de prensa, 20 minutos podem ser excelentes; para uma máquina pequena, podem ser lentos.

### O que é OTED?

*One-touch exchange of die* (troca de matriz com um toque): uma troca em menos de 100 segundos [5]. É o próximo objetivo após o SMED, normalmente alcançado apenas com hardware dedicado de troca rápida.

### Como o SMED se relaciona com o OEE?

As trocas normalmente são registradas como perdas de disponibilidade, e o refugo de aquecimento como perda de qualidade no OEE [4]. Trocas mais curtas aumentam a disponibilidade do OEE somente se o tempo economizado for usado para produzir. Se for usado para fazer trocas mais frequentes, o OEE pode permanecer estável enquanto estoque e lead time melhoram.

### O SMED exige bloqueio e etiquetagem (lockout/tagout)?

Nos EUA, a preparação faz parte de "manutenção e/ou reparo" pela norma de bloqueio e etiquetagem da OSHA, 29 CFR 1910.147; por isso, as etapas internas de troca em equipamentos com energia perigosa estão sujeitas a ela por padrão [8]. Uma exceção restrita cobre pequenas trocas de ferramentas durante a produção normal que sejam rotineiras, repetitivas e integrais, e somente com proteção alternativa eficaz [8][9]. Peça ao seu profissional de segurança que decida quais etapas se enquadram.

### O que é EPEI e como o SMED o altera?

EPEI (*every part every interval*; LEI: EPEx) é o tempo em que um processo produz todos os seus números de peça uma vez [3]. Depende dos tempos de troca e do número de peças. Uma fórmula comum é o tempo total de troca de todas as peças dividido pelo tempo diário restante após o tempo de operação. No exemplo deste guia, reduzir as trocas de 200 para 70 minutos por ciclo reduz o EPEI de 2 dias para 1 dia e divide os lotes pela metade.

### Por que as melhorias de troca falham com o tempo?

Porque o padrão não é treinado em todos os turnos, o carrinho de troca perde suas ferramentas, o hardware de troca rápida não recebe manutenção ou ninguém acompanha o KPI. Pesquisas identificaram a sustentação como uma fraqueza central da prática do SMED [13]. Fontes de profissionais apontam as mesmas causas, como execução inconsistente e equipamentos que não estão prontos [22]. As contramedidas são trabalho padronizado, auditorias e um KPI diário de troca exposto no quadro.

### O SMED faz parte do TPM?

Não. SMED e TPM são métodos enxutos distintos, mas dependem um do outro. O TPM mantém matrizes, moldes e ferramentas de troca rápida em boas condições, e o leanproduction.com recomenda começar pelo TPM quando as quebras, e não as trocas de ferramenta, dominam o tempo perdido [19][29]. Na maioria dos esquemas de OEE, tanto as trocas quanto as quebras são registradas como perdas de disponibilidade.

### O SMED se aplica apenas a matrizes e prensas?

Não. O nome vem das prensas de estampagem, mas o LEI define o SMED como um processo para trocar qualquer equipamento de produção de um número de peça para outro no menor tempo possível [1]. Os mesmos passos funcionam para uma troca de linha em embalagem, a troca de um molde, a troca de um dispositivo de fixação em um centro de usinagem ou a troca de produto em uma linha de montagem.

### Qual é a diferença entre um evento SMED e um programa SMED?

Um evento SMED é uma oficina focada, geralmente um evento kaizen, em uma máquina ou linha. Um programa SMED é o sistema em toda a fábrica por trás dele: um modelo padrão de troca, equipes treinadas, indicadores de troca no quadro de chão de fábrica e um plano de implantação de máquina em máquina. Os eventos produzem os primeiros resultados; o programa os mantém e os expande (veja o roteiro de implantação).

### Quais indústrias usam o SMED?

Qualquer indústria com trocas: automotiva e estampagem de metal, plásticos, usinagem, embalagem, impressão, eletrônica, alimentos e bebidas e farmacêutica. Uma revisão de 130 artigos sobre SMED cobriu uma ampla gama de setores [14]. Nas indústrias de processo, a limpeza e as verificações obrigatórias costumam dominar, por isso o SMED é combinado com o sequenciamento e o planejamento por campanhas.

### Quanto tempo leva um projeto SMED?

Um primeiro ciclo SMED em uma máquina costuma levar cerca de três a quatro meses, da linha de base até um novo padrão estável: algumas semanas de preparação e levantamento da linha de base, uma oficina de três a cinco dias, várias semanas para hardware e treinamento e um mês de estabilização [unverified: estimativa de profissionais da área]. Os prazos de entrega de hardware podem alongar esse período.

### Quanto custa o SMED?

O primeiro ciclo costuma ser barato: tempo da equipe, checklists, carrinhos, codificação por cores e blocos espaçadores. O hardware de troca rápida, como multiacopladores, fixação hidráulica ou estações de pré-aquecimento, custa mais e deve vir depois das etapas organizacionais. O exemplo de ROI trabalhado neste guia estima um payback de cerca de 1,5 ano para uma máquina de moldagem; os seus números serão diferentes.

### O SMED pode funcionar em uma oficina de alta variedade e baixo volume?

Sim, mas com um foco diferente. Quando a maioria dos ajustes é única, padronize o que se repete: fixação de peças, bibliotecas de ferramentas, programação offline, pré-ajuste e famílias de peças. Analise o processo de ajuste, e não um ajuste específico.

## Conclusão e primeiros passos

A SMED é um dos métodos mais práticos do lean, porque sua lógica é simples e seus resultados são mensuráveis: não pare a máquina para trabalhos que poderiam ser feitos enquanto ela funciona, e torne o que precisa acontecer durante a parada simples, segura e livre de ajustes. A intuição de Shingo dos anos 1950 e 1960 continua válida, e os primeiros grandes ganhos ainda vêm de checklists, pré-preparação e trabalho paralelo, e não de equipamentos caros.

O método só compensa quando o tempo economizado é utilizado. Uma troca mais curta representa capacidade potencial ou flexibilidade potencial; a planta precisa decidir qual das duas, e então ajustar tamanhos de lote, sequências de produção, programações e parâmetros do ERP para atender à demanda do cliente. Os números deste guia mostram por que vale a pena: no exemplo da EPEI, reduzir o tempo de troca por ciclo de 200 para 70 minutos reduz os tamanhos de lote à metade, e na fórmula do tamanho econômico de lote, um quarto do custo de setup significa metade do lote econômico.

Os limites também merecem atenção. A SMED organizacional atinge um teto onde o projeto do equipamento e do produto assume o protagonismo, os ganhos se perdem sem padrões e auditorias, e a velocidade nunca deve ser obtida às custas do bloqueio e etiquetagem (lockout/tagout) ou da ergonomia.

**Seus primeiros passos nos próximos 30 dias**

- [ ] Escolha uma máquina com trocas frequentes de 30 a 90 minutos e uma dor de negócio visível
- [ ] Registre o início e o fim de cada troca durante duas semanas (última peça boa até a primeira peça boa)
- [ ] Combine com o planejamento como o tempo economizado será usado: capacidade, lotes menores ou divisão
- [ ] Revise com seu profissional de segurança o procedimento de controle de energia dessa máquina
- [ ] Filme uma troca, com a concordância da equipe, e monte a lista de elementos
- [ ] Marque cada elemento como interno ou externo e introduza um checklist de pré-troca
- [ ] Calcule a EPEI atual e os tamanhos de lote que ela implica
- [ ] Coloque o tempo de troca no quadro de gestão do chão de fábrica, com uma meta e uma coluna de motivo
- [ ] Verifique se o centro NIST MEP do seu estado oferece uma oficina de troca rápida [18][31]

---

## Leitura complementar no m365.fm

**Guias deste caminho de aprendizado**
- [Lean Manufacturing: Princípios, Ferramentas, Implementação e Limites](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Mapeamento do Fluxo de Valor](https://www.m365.fm/en/learn/value-stream-mapping/)
- [KPIs de Manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Gestão do Chão de Fábrica e Gemba Walks](https://www.m365.fm/en/learn/shop-floor-management/)
- [Programação da Produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Gêmeo Digital na Manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [TI de Manufatura com Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Excelência Operacional](https://www.m365.fm/en/learn/operational-excellence/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [5S e Gestão Visual](https://www.m365.fm/en/learn/5s-visual-management/)
- [Manutenção Produtiva Total (TPM) e OEE](https://www.m365.fm/en/learn/tpm-oee/)
- [Kanban e Sistemas Pull](https://www.m365.fm/en/learn/kanban-pull-system/)
- [Six Sigma e Análise de Causa Raiz](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/)
- [S&OP, MRP e Planejamento da Produção](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)
- [Teoria das Restrições](https://www.m365.fm/en/learn/theory-of-constraints/)

**Aprofundamentos**
- [Kaizen e eventos kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/)
- [Poka-yoke](https://www.m365.fm/en/learn/lean-manufacturing/poka-yoke/)
- [Ciclo PDCA](https://www.m365.fm/en/learn/lean-manufacturing/pdca-cycle/)
- [Trabalho padronizado](https://www.m365.fm/en/learn/shop-floor-management/standard-work/)
- [Manufatura sem papel e instruções de trabalho digitais](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/)
- [Dimensionamento de lotes: EOQ e EPQ](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Gestão de estoque na manufatura](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)
- [Simulação de manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)
- [Competências da força de trabalho na manufatura e TWI](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/)

**Termos do glossário (entidades)**
[SMED](https://www.m365.fm/entity/smed/) · [Setup time](https://www.m365.fm/entity/setup-time/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [Kanban](https://www.m365.fm/entity/kanban/) · [5S](https://www.m365.fm/entity/5s/) · [Poka-yoke](https://www.m365.fm/entity/poka-yoke/) · [TPM](https://www.m365.fm/entity/total-productive-maintenance/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Lean management](https://www.m365.fm/entity/lean-management/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** é o apresentador do m365.fm e trabalha na iFAKT GmbH. No m365.fm, ele escreve sobre manufatura enxuta, excelência operacional e a transformação digital da produção, com foco em como modelos de fluxo de valor, simulação e análise de KPIs ajudam as fábricas a colocar métodos como o SMED em prática.

**Nota: O autor trabalha na iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Regulatory texts and LEI definitions were opened and checked on that date; vendor pages are cited for vendor guidance and labeled as such in the text.

1. Single Minute Exchange of Die. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/single-minute-exchange-of-die/
2. Changeover. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/changeover/
3. Every Product Every Interval (EPEx). Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/every-product-every-interval/
4. Overall Equipment Effectiveness. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/overall-equipment-effectiveness/
5. Single-minute exchange of die (history, Shingo's eight techniques, four stages, seven basic steps, setup time breakdown, OTED; citing Shingo 1985 and 1989). Wikipedia. https://en.wikipedia.org/wiki/Single-minute_exchange_of_die
6. Shigeo Shingo. Wikipedia. https://en.wikipedia.org/wiki/Shigeo_Shingo
7. Shingo, S. (translated by Dillon, A. P.): A Revolution in Manufacturing: The SMED System. Productivity Press, Cambridge, MA, 1985, 386 pp., ISBN 978-0-915299-03-4 (publisher page, Routledge: https://www.routledge.com/A-Revolution-in-Manufacturing-The-SMED-System-1st-Edition/Shingo/p/book/9780915299034; book text not consulted directly).
8. 29 CFR 1910.147, The control of hazardous energy (lockout/tagout). Occupational Safety and Health Administration (OSHA), US Department of Labor. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147 (verbatim text cross-checked at https://www.law.cornell.edu/cfr/text/29/1910.147)
9. Lockout/Tagout eTool: Minor servicing exception (relationship to Subpart O). OSHA. https://www.osha.gov/etools/lockout-tagout/hot-topics/relationship-subpart-o/minor-servicing-exception
10. 29 CFR 1910.217, Mechanical power presses, paragraph (d)(9) Diesetting. OSHA. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.217
11. 21 CFR 211.130, Packaging and labeling operations, paragraph (e). Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/21/211.130
12. McIntosh, R. I. et al.: A critical evaluation of Shingo's "SMED" (Single Minute Exchange of Die) methodology. International Journal of Production Research, Vol. 38, No. 11 (2000), pp. 2377–2395. Record: https://acnpsearch.tweb-dev.unibo.it/singlejournalindex/73565535 (DOI not confirmed online)
13. McIntosh, R.; Culley, S.; Gest, G.; Mileham, T.; Owen, G.: An assessment of the role of design in the improvement of changeover performance. International Journal of Operations & Production Management, Vol. 16, No. 9 (1996), pp. 5–22. https://doi.org/10.1108/01443579610125552
14. da Silva, I. B.; Godinho Filho, M.: Single-minute exchange of die (SMED): a state-of-the-art literature review. International Journal of Advanced Manufacturing Technology, Vol. 102 (2019), pp. 4289–4307. https://doi.org/10.1007/s00170-019-03484-w
15. Braglia, M.; Di Paco, F.; Frosolini, M.; Marrazzini, L.: Quick changeover design: a new Lean methodology to support the design of machines in terms of rapid changeover capability. Journal of Manufacturing Technology Management, Vol. 34, No. 9 (2023), pp. 84–114. https://doi.org/10.1108/JMTM-12-2022-0430
16. Cakmakci, M.: Process improvement: performance analysis of the setup time reduction-SMED in the automobile industry. International Journal of Advanced Manufacturing Technology, Vol. 41, No. 1 (2009), pp. 168–179. https://doi.org/10.1007/s00170-008-1434-4
17. Success Story: Improvement Effort Reduces Changeover Time (Brighton NC Machine Corporation, Michigan Manufacturing Technology Center), April 6, 2018. NIST Manufacturing Innovation Blog. https://www.nist.gov/blogs/manufacturing-innovation-blog/success-story-improvement-effort-reduces-changeover-time
18. Quick Changeover (April 16, 2024). WMEP Manufacturing Solutions (Wisconsin), part of the MEP National Network. https://wmep.org/quick-changeover/
19. SMED (Single-Minute Exchange of Die). leanproduction.com (vendor-operated knowledge page). https://leanproduction.com/smed
20. Single-Minute Exchange of Die (SMED). Vorne Industries (vendor). https://www.vorne.com/tools/single-minute-exchange-of-die.htm
21. How to Reduce Changeover Time. MachineMetrics (vendor). https://www.machinemetrics.com/blog/changeover-time
22. How to Reduce Changeover Time in Manufacturing: A Practical Playbook for Maintenance and Operations. MaintainX (vendor). https://www.getmaintainx.com/blog/how-to-reduce-changeover-time-in-manufacturing
23. How To Reduce Changeover Time in Manufacturing. Tulip Interfaces (vendor). https://tulip.co/blog/reduce-changeover-time-in-manufacturing/
24. How to Reduce Changeover Time with Connected Workforce Software. L2L (vendor). https://l2l.com/blog/reduce-changeover-time
25. Heijunka. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/heijunka/
26. Standardized Work. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/standardized-work/
27. 5S. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/five-s/
28. Poka-Yoke. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/poka-yoke/
29. Total Productive Maintenance. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/total-productive-maintenance/
30. About the Shingo Institute. Shingo Institute, Jon M. Huntsman School of Business, Utah State University. https://shingo.org/about-the-shingo-institute/
31. Manufacturing Extension Partnership (MEP). National Institute of Standards and Technology (NIST). https://www.nist.gov/mep
32. Ergonomics. OSHA. https://www.osha.gov/ergonomics
33. Training Within Industry. Wikipedia. https://en.wikipedia.org/wiki/Training_Within_Industry
34. Kanban. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/kanban/
35. Value-Stream Mapping. Lean Enterprise Institute (LEI), Lean Lexicon. https://www.lean.org/lexicon-terms/value-stream-mapping/
36. Chapter 5: Single Minute Exchange of Die (SMED). In: Statistical Process Control and Lean Manufacturing (open textbook, Creative Commons). PALNI Pressbooks. https://pressbooks.palni.org/spcleanmanufacturing/?p=35
37. 21 CFR 117.135, Preventive controls, paragraph (c)(2) Food allergen controls. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/21/117.135
38. Total absorption costing. Wikipedia. https://en.wikipedia.org/wiki/Total_absorption_costing
39. Economic order quantity. Wikipedia (formula Q* = √(2DK/h); Harris 1913). https://en.wikipedia.org/wiki/Economic_order_quantity (accessed November 20, 2026)
40. Handbook: Inventory (2025), sections on ASC 330-10-30-1, 30-3, 30-6 to 30-8. KPMG LLP. https://kpmg.com/kpmg-us/content/dam/kpmg/frv/pdf/2025/inventory.pdf (accessed November 20, 2026)
