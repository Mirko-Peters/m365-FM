# SEO metadata

| Field | Value |
|---|---|
| Meta title | Azure para Manufatura: Guia de Arquitetura 2026 |
| Meta description | Azure para manufatura em 2026: status dos serviços, arquitetura de referência, segurança OT (IEC 62443, NIST CSF 2.0), rastreabilidade, IA e FinOps. |
| Slug | `manufacturing-it-azure` |

# Azure para Manufatura: O Guia Completo de TI Industrial na Microsoft Azure (Novembro de 2026)

**Resposta curta:** Em fins de 2026, o Azure para manufatura se resume a três camadas: Azure IoT Operations em Kubernetes habilitado para Azure Arc na planta, Microsoft Fabric (Real-Time Intelligence e OneLake) como plataforma de dados, e Microsoft Foundry, Power BI e Copilot para análise, IA e ambiente de trabalho. Blocos de construção mais antigos foram desativados (Time Series Insights, as prévias de agentes de manufatura) ou têm desativação programada (IoT Central em 2029, segurança OT no Defender for IoT). O sucesso depende menos dos serviços do que de ser dono do seu modelo de dados, de ter um projeto de segurança OT alinhado às orientações ISA/IEC 62443 e NIST, e de escolher casos de uso com uma linha de base medida.

**Principais conclusões**

- Planeje novas conexões de planta no **Azure IoT Operations**, não no IoT Central nem em cadeias de módulos IoT Edge construídas manualmente. Escolha o SKU **Standard** se suas máquinas falam OPC UA; o Essentials não inclui o conector OPC UA.
- Use o **Microsoft Fabric Real-Time Intelligence** (Eventstream, Eventhouse, Activator) para dados de séries temporais. O Time Series Insights foi desativado em 7 de julho de 2024.
- Mantenha a lógica de negócio longe de serviços em prévia. A Microsoft desativou o modelo de dados de manufatura e as prévias do agente de fábrica em 2025, cerca de um ano após o lançamento.
- Planeje agora a substituição do seu **monitoramento OT**. A Microsoft desativará totalmente a segurança OT no Defender for IoT em outubro de 2029; um blog de parceiro da Microsoft cita 31 de maio de 2028 como fim do suporte.
- Alinhe seu programa de segurança à **ISA/IEC 62443** (zonas e conduítes) e ao **NIST CSF 2.0**; fornecedores de defesa também precisam de **CMMC** para sistemas que tratam FCI ou CUI.
- Comece com casos de uso que tenham linha de base e responsável definido: OEE em tempo real e rastreabilidade costumam dar retorno antes da manutenção preditiva.

## Sumário

1. [O que significa Azure para manufatura hoje](#o-que-o-azure-para-manufatura-significa-hoje)
2. [Status dos serviços Azure de manufatura, novembro de 2026](#status-dos-serviços-do-azure-para-manufatura-novembro-de-2026)
3. [Modelo de dados primeiro: ISA-95 e o namespace unificado](#primeiro-o-modelo-de-dados-isa-95-e-o-namespace-unificado)
4. [Arquitetura de referência Azure para manufatura](#arquitetura-de-referência-azure-para-manufatura)
5. [Convergência TI/OT e segurança: ISA/IEC 62443, NIST CSF 2.0, CMMC e NIS2](#convergência-tito-e-segurança)
6. [Caso de uso 1: Manutenção preditiva no Azure](#caso-de-uso-1-manutenção-preditiva-no-azure)
7. [Caso de uso 2: Rastreabilidade e genealogia](#caso-de-uso-2-rastreabilidade-e-genealogia)
8. [Caso de uso 3: Gêmeos digitais](#caso-de-uso-3-gêmeos-digitais)
9. [Caso de uso 4: KPIs em tempo real, OEE e fluxos de valor](#caso-de-uso-4-kpis-em-tempo-real-oee-e-fluxos-de-valor)
10. [Integração com ERP e MES: SAP, Dynamics 365 e o fluxo de dados do chão de fábrica](#integração-de-erp-e-mes)
11. [IA e Copilot na manufatura: o que é realista](#ia-e-copilot-na-manufatura)
12. [FinOps para TI de manufatura](#finops-para-ti-de-manufatura)
13. [Construindo o caso de negócio do Azure na manufatura](#construindo-o-business-case-do-azure-na-manufatura)
14. [Roteiro: cinco fases até uma plataforma Azure de manufatura escalável](#roteiro-cinco-fases-para-uma-plataforma-escalável-de-manufatura-no-azure)
15. [Erros comuns em projetos Azure de manufatura](#erros-comuns-em-projetos-de-manufatura-no-azure)
16. [Aplicações industriais no ecossistema Microsoft: o exemplo do iFAKT Polaris](#aplicações-setoriais-no-ecossistema-microsoft)
17. [FAQ](#faq)
18. [Conclusão](#conclusão)

---

## O que o Azure para manufatura significa hoje

Há cinco anos, uma busca por "Azure for manufacturing" ou "Azure IoT for manufacturing" retornava uma lista conhecida: IoT Hub, IoT Edge, Stream Analytics, Time Series Insights e Synapse. Essa lista já não descreve a situação em 2026. A Microsoft reconstruiu sua estratégia de IoT industrial em três direções:

1. **Borda em vez de dispositivo:** a coleta de dados na fábrica agora roda sobre o **Azure IoT Operations**, um conjunto de serviços de dados em clusters Kubernetes gerenciados a partir da nuvem por meio do **Azure Arc**. A Microsoft descreve o serviço como um "plano de dados unificado para a borda" [3]. A disponibilidade geral foi anunciada em novembro de 2024 [5].
2. **Plataforma de dados em vez de serviços pontuais:** séries temporais, eventos e dados mestres são armazenados no **Microsoft Fabric**, em especial no Real-Time Intelligence, com Eventstream, Eventhouse e Activator. A Microsoft descontinuou o Time Series Insights e indica aos clientes o Fabric Eventhouse como destino de migração [10].
3. **Plataforma em vez de aplicação empacotada:** em IoT e manufatura, a Microsoft está recuando de suas próprias aplicações pré-configuradas. O IoT Central deixou de aceitar novas aplicações em 23 de setembro de 2026 e será desativado em 20 de setembro de 2029 [8], [64]. As prévias específicas do setor "Manufacturing data solutions" e "Factory Operations Agent" foram desativadas em 30 de maio de 2025 [2].

A oferta do setor agora se chama **Microsoft for Manufacturing** (antes "Microsoft Cloud for Manufacturing"). A Microsoft a organiza em quatro áreas de solução: engenharia digital, cadeias de suprimento resilientes, fábricas inteligentes e clientes conectados [1]. Para a fábrica inteligente, a Microsoft nomeia quatro cenários: modernizar a borda e a infraestrutura, otimizar operações com IA, conectar e capacitar a força de trabalho, e manutenção e qualidade [1]. A Microsoft aponta o Fabric como a plataforma para o "fio digital" (digital thread) [1].

Para você, como líder de TI, OT ou transformação digital, isso significa que os blocos de construção se tornaram mais genéricos, e mais da responsabilidade pelo modelo de dados, pela integração e pela operação recai sobre você ou sobre seus parceiros. Este guia mostra como assumir essa responsabilidade de forma estruturada. Ele conecta a tecnologia do Azure aos temas que decidem o sucesso: o modelo de dados, a segurança, a [Indústria 4.0](https://www.m365.fm/entity/industry-4-0/) como tema organizacional, os KPIs e os custos.

### Para quem este guia foi escrito

- **Líderes de TI e equipes de nuvem** que já operam Microsoft 365 e Azure e receberam a tarefa de conectar as fábricas.
- **Engenheiros de OT e automação** que querem entender o que Kubernetes, MQTT e Fabric significam para os seus equipamentos.
- **Gerentes de fábrica, qualidade e manutenção** que avaliam casos de uso como manutenção preditiva ou rastreabilidade.
- **Equipes de finanças e compras** que precisam tornar previsíveis os custos de nuvem na manufatura.

### Termos de manufatura para administradores de Microsoft 365 e Azure

Se você vem da TI corporativa, os projetos de manufatura trazem vocabulário próprio. Aqui estão os termos-chave usados neste guia, cada um em uma frase:

| Termo | Significado | Analogia mais próxima em TI |
|---|---|---|
| **OT** (operational technology) | Tecnologia que controla processos físicos: máquinas, controladores e sistemas de controle | Como um data center separado, em que uma indisponibilidade para a produção |
| **PLC** (programmable logic controller) | Computador industrial que controla uma máquina em tempo real | Um sistema embarcado com vida útil de 15 anos ou mais |
| **SCADA** | Sistema de supervisão para monitorar e operar várias máquinas ou linhas | Um console de monitoramento com acesso de escrita |
| **MES** (manufacturing execution system) | Controla e registra a execução das ordens de produção na fábrica | Um sistema de fluxo de trabalho entre o ERP e a máquina |
| **OPC UA** | Padrão industrial neutro quanto a fornecedor para troca de dados, com modelo de informação e segurança integrada | API REST mais esquema mais certificados, para máquinas |
| **MQTT** | Protocolo leve de publicação/assinatura | Um barramento de mensagens, semelhante a tópicos do Event Grid ou do Service Bus |
| **Unified namespace (UNS)** | Estrutura central e hierárquica de eventos em que todos os sistemas publicam seu estado atual | Um diretório corporativo de tópicos |
| **OEE** (overall equipment effectiveness) | Eficácia do equipamento a partir de disponibilidade, desempenho e qualidade | Um SLA de disponibilidade, mas para máquinas e incluindo qualidade |
| **KQL** (Kusto Query Language) | Linguagem de consulta do Fabric Eventhouse e do Azure Data Explorer | A mesma linguagem usada no Log Analytics e no Microsoft Sentinel |
| **Modelo Purdue** | Modelo de referência que organiza em camadas os sistemas da fábrica, desde os dispositivos de campo até a empresa; a ISA-95 se baseia nele [26] | Um modelo de segmentação de rede, desde a VLAN dos dispositivos até a WAN corporativa |

A linha do KQL é um bom ponto de partida para administradores: se você conhece KQL do Sentinel ou do Log Analytics, consegue consultar dados de máquinas em um Eventhouse imediatamente.

### Por onde começar como administrador de Microsoft 365 ou Azure

Você não precisa se tornar um engenheiro de automação para agregar valor em um projeto de manufatura. Cinco tarefas normalmente ficam com a TI central e podem ser preparadas antes de a primeira máquina ser conectada:

1. **Identidades e funções:** Crie grupos no Microsoft Entra ID e funções do Azure RBAC para a equipe de OT, parceiros e equipes de operações; use o Privileged Identity Management para tornar o acesso privilegiado limitado no tempo.
2. **Uma landing zone do Azure para as fábricas:** Defina uma estrutura de assinaturas e grupos de recursos por fábrica, e use o Azure Policy para impor tags (fábrica, centro de custo, caso de uso) e regiões permitidas.
3. **Teste o Azure Arc:** Conecte um servidor de teste ou um cluster Kubernetes ao Arc e obtenha a aprovação, junto à equipe de rede, dos endpoints de saída necessários na cadeia de proxies. Em muitas empresas, essas aprovações de firewall são o que mais demora.
4. **Noções básicas do Fabric:** Defina capacidade, estrutura de workspaces e modelo de acesso; mantenha a governança atual do Power BI.
5. **Construa uma relação de trabalho com a OT:** Entenda o modelo de zonas da fábrica antes de propor mudanças de rede. Na OT, a disponibilidade vem antes da confidencialidade, e as janelas de manutenção seguem a programação de produção, não o Patch Tuesday.

---

## Status dos serviços do Azure para manufatura, novembro de 2026

A Microsoft renomeia serviços, lança versões de prévia e depois os descontinua. Para projetos de manufatura com vida útil de cinco a dez anos, o ciclo de vida do produto é, portanto, um critério de arquitetura. A tabela abaixo resume o status verificado em 20 de novembro de 2026.

### Visão geral dos serviços: finalidade, status, fonte

| Serviço | Finalidade na manufatura | Status, novembro de 2026 | Fonte |
|---|---|---|---|
| **Azure IoT Operations** | Plano de dados na borda: broker MQTT, conectores (OPC UA, HTTP/REST), fluxos de dados, gerenciamento de ativos | Disponibilidade geral desde novembro de 2024; lançamentos regulares. O Microsoft Learn indica a versão 1.5.x (release 2610) como a que introduz um novo SKU, **Essentials** (somente clusters de nó único, sem conector OPC UA), ao lado do **Standard** com o conjunto completo de recursos | [3], [5], [7] |
| **Azure Device Registry** | Representação na nuvem de ativos e dispositivos, registro de esquemas | Parte integrante do Azure IoT Operations; integração com o IoT Hub em prévia | [3], [36] |
| **Azure IoT Hub** + Device Provisioning Service | Gateway na nuvem para dispositivos conectados diretamente, ciclo de vida dos dispositivos | Ativo; recomendado pela Microsoft como destino para clientes do IoT Central | [8], [64] |
| **Azure IoT Central** | SaaS de IoT de baixo código | Sem novos aplicativos desde 23 de setembro de 2026; aposentadoria em 20 de setembro de 2029 | [8], [64] |
| **Azure IoT Edge** | Runtime de contêineres para dispositivos de borda (módulos) | Produto com suporte; versão 1.5 LTS fora de suporte desde 10 de novembro de 2026 (assim como o EFLOW 1.5 para Windows); versão atual 1.6 LTS (julho de 2026) com suporte até 14 de novembro de 2028; nenhum EFLOW 1.6 LTS listado na página de versões (apenas uma trilha de lançamentos contínuos do EFLOW) | [12], [13] |
| **Microsoft Fabric Real-Time Intelligence** (Eventstream, Eventhouse, Activator, Real-Time hub) | Ingestão de streaming, análise de séries temporais com KQL, alertas | Disponibilidade geral desde o Ignite, novembro de 2024 | [18] |
| **Microsoft Fabric OneLake / Lakehouse** | Armazenamento central para dados mestres, transacionais e de sensores | Disponibilidade geral | [17] |
| **Digital twin builder** (Fabric Real-Time Intelligence) | Representações digitais baseadas em ontologia de ativos e processos | Prévia | [15] |
| **Fabric IQ ontology** | Camada semântica de negócio para análises e agentes | Prévia; a antiga experiência de ontologia será aposentada em 31 de janeiro de 2027, e as ontologias existentes devem ser copiadas para a nova experiência | [16] |
| **Azure Digital Twins** | Gêmeos baseados em grafos com DTDL | Ativo, sem aviso de aposentadoria na página de visão geral; 3D Scenes Studio em prévia | [14] |
| **Azure Data Explorer** | Banco de dados de séries temporais em KQL fora do Fabric | Ativo, sem aviso de aposentadoria; usa KQL como o Eventhouse do Fabric | [19] |
| **Microsoft Foundry** (antes Azure AI Foundry / Azure AI Studio) | Modelos, agentes e ferramentas para aplicações de IA | Ativo; "Azure AI Services" agora são "Foundry Tools"; prompt flow será aposentado em 20 de abril de 2027 | [20], [34], [37] |
| **Azure Machine Learning** | Treinamento, implantação e MLOps para modelos clássicos de ML | Ativo; a Microsoft posiciona o Foundry para IA generativa e o Azure ML para ML clássico e MLOps. A rotulagem de dados integrada foi aposentada em 30 de setembro de 2026 | [37], [38] |
| **Azure Arc** | Gerenciamento de Kubernetes e servidores fora do Azure | Ativo; base do Azure IoT Operations | [3] |
| **Azure Local** (antes Azure Stack HCI) | Infraestrutura hiperconvergente na fábrica | Ativo; renomeado em novembro de 2024 | [21] |
| **Microsoft Defender for IoT (segurança OT)** | Monitoramento passivo de redes OT, inventário de ativos, detecção de anomalias | Aposentadoria oficialmente anunciada em 2 de novembro de 2026; aposentadoria completa em outubro de 2029; até lá, somente atualizações de segurança e correções de bugs, sem novos recursos de OT. Um blog de parceiro da Microsoft cita 31 de maio de 2028 como fim do suporte. Conectores para Armis, Dragos e Forescout | [22], [24], [39] |
| **Azure Time Series Insights** | Explorador de séries temporais (legado) | Aposentado em 7 de julho de 2024; a Microsoft indica o Eventhouse do Fabric como destino da migração | [10] |
| **Azure Percept** | Kit de desenvolvimento de IA na borda | Aposentado em 30 de março de 2023 | [11] |
| **Manufacturing data solutions** (Azure) e **Factory Operations Agent** (Azure AI e Copilot Studio) | Modelo de dados de manufatura e copiloto de manufatura (prévias) | Aposentados a partir de 30 de maio de 2025 (anunciado em fevereiro de 2025) | [2] |
| **Factory Safety Agent** (Copilot Studio) | Agente de segurança do trabalho (prévia) | Aposentado a partir de 23 de junho de 2025 | [2] |
| **Manufacturing data solutions in Microsoft Fabric** | Modelo de dados de manufatura no Fabric (prévia desde abril de 2024) | Status incerto: os avisos de aposentadoria mencionam "Manufacturing data solutions" sem o sufixo Fabric e não incluem nem excluem a variante do Fabric; não há entrada separada desde abril de 2024. Não o planeje em novos projetos; consulte a Microsoft sobre seu status. | [2] |

### O que a tabela significa para a sua arquitetura

**Primeiro:** Planeje as novas conexões de fábrica no Azure IoT Operations, e não no IoT Central nem em cadeias de módulos próprias do IoT Edge, a menos que haja um motivo específico. O IoT Edge continua suportado, mas é um modelo de runtime de dispositivo; o Azure IoT Operations atende ao plano de dados da fábrica com um broker, conectores e um modelo de ativos [3]. Ao escolher o SKU, observe que o Essentials não inclui o conector OPC UA [3]. Para uma fábrica típica com máquinas OPC UA, o Standard é o ponto de partida.

**Segundo:** Mantenha a lógica de negócio longe de serviços em preview. O histórico das soluções de dados de manufatura da Microsoft mostra que um modelo de dados de manufatura pode passar de preview a aposentadoria em pouco mais de um ano [2]. O seu modelo de dados pertence a você e deve ser documentado em formatos abertos (tabelas Delta no OneLake, esquemas JSON no broker, DTDL ou modelos de informação OPC UA).

**Terceiro:** Revise a sua estratégia de segurança de OT. O aviso oficial do Azure indica outubro de 2029 como o fim da segurança de OT no Defender for IoT, enquanto um blog de parceiro da Microsoft informa 31 de maio de 2028 como o fim do suporte [22], [39]. Planeje com a data mais antecipada: a aquisição, a implantação e o aceite de novos sensores costumam levar mais de um ano em ambientes regulados.

**Quarto:** Revise a sua frota de IoT Edge. Dispositivos com IoT Edge 1.5 não recebem atualizações de segurança desde 10 de novembro de 2026. A Microsoft descreve a migração para a 1.6 LTS como simples, pois não contém grandes mudanças de funcionalidade [12]. O mesmo fim de suporte se aplica a dispositivos Windows que executam o IoT Edge para Linux no Windows (EFLOW) 1.5; a página de versões não lista um EFLOW 1.6 LTS, apenas uma trilha de lançamentos contínua [12]. Esclareça o caminho de destino para esses dispositivos com a Microsoft ou com o fornecedor do seu hardware.

> **Nota sobre atualidade:** Esta tabela é um retrato do momento. Antes de cada decisão de arquitetura, verifique as páginas da Microsoft vinculadas e o portal Azure Updates filtrado por "Retirements".

---

## Primeiro o modelo de dados: ISA-95 e o namespace unificado

Muitos projetos de manufatura fracassam não por causa da nuvem, mas porque ninguém definiu o que é uma "máquina", uma "ordem" ou um "evento de parada" no modelo de dados. Responda a essa pergunta antes de implantar o primeiro serviço do Azure.

### ISA-95 e a pirâmide de automação

A série **ANSI/ISA-95** (internacionalmente IEC 62264) descreve a integração entre sistemas empresariais e sistemas de controle [26]. A ISA a descreve como um conjunto de normas para integrar sistemas de logística com sistemas de controle de manufatura, baseado no modelo de referência de Purdue e aplicável às indústrias discreta, contínua e de logística; a série tem oito partes [26]. Ela oferece duas coisas úteis para qualquer arquitetura de nuvem:

- **Um modelo de níveis:** Os níveis 0 a 2 abrangem o processo físico, sensores, atuadores e controle (CLP, SCADA). O nível 3 é a gestão de operações de manufatura (MES, MOM). O nível 4 é o planejamento empresarial ([ERP](https://www.m365.fm/entity/enterprise-resource-planning/)). Na Europa essa hierarquia costuma ser desenhada como "pirâmide de automação"; na América do Norte, o modelo de Purdue é a representação mais comum.
- **Um modelo de objetos:** A ISA-95 define termos como a hierarquia de equipamentos (empresa, site, área, centro de trabalho, unidade de trabalho), materiais, pessoal, ordens de produção e dados de desempenho. A OPC Foundation mapeou esse modelo para a sua própria especificação complementar para OPC UA [35].

A crítica à pirâmide é bem conhecida: os dados só se movem nível a nível, cada interface é uma integração ponto a ponto e uma nova aplicação precisa se conectar a vários sistemas. O modelo de objetos, por outro lado, continua valioso porque oferece a IT, OT e negócio uma linguagem comum.

### Namespace unificado: eventos em vez da pirâmide

O **namespace unificado (UNS)** é um padrão de arquitetura, não uma norma. Todos os sistemas publicam o seu estado atual como eventos em um broker central, com estrutura hierárquica, normalmente MQTT. Os consumidores se inscrevem nos tópicos de que precisam. A hierarquia de tópicos costuma seguir a hierarquia de equipamentos da ISA-95, por exemplo:

```
acme/dayton-plant/assembly/line-3/station-20/state
acme/dayton-plant/assembly/line-3/station-20/order
acme/dayton-plant/assembly/line-3/station-20/quality
```

O Azure IoT Operations inclui um broker MQTT nativo de borda que oferece suporte a MQTT 3.1.1 e MQTT 5 [40]. O conector OPC UA publica dados de servidores OPC UA como JSON no formato OPC UA PubSub para tópicos do broker e também pode gravar valores de volta em nós OPC UA; as solicitações de escrita usam o padrão de requisição/resposta do MQTT 5 [4]. Isso permite construir um UNS na fábrica sem executar um broker separado.

Se você já executa um UNS em outro broker, não precisa substituí-lo: os fluxos de dados podem encaminhar mensagens para brokers MQTT externos [3]. Usar o broker da Microsoft como UNS da fábrica ou como alimentador de um broker existente é uma decisão operacional. O que importa é uma convenção de tópicos e payloads, independente do produto.

### ISA-95 ou UNS? Os dois.

A resposta produtiva é: use **ISA-95 como vocabulário** e **o UNS como padrão de transporte**. Na prática:

| Pergunta | Recomendação |
|---|---|
| Como nomeio os ativos? | Hierarquia de equipamentos da ISA-95, consistente em toda a empresa |
| Como estruturo os tópicos? | Pela hierarquia de equipamentos, com domínios de negócio abaixo dela (estado, ordem, qualidade, energia) |
| Como descrevo os payloads? | Esquemas JSON no registro de esquemas do Azure Device Registry [3]; para máquinas, prefira as especificações complementares (companion specifications) do OPC UA |
| Onde fica o dado mestre? | No sistema de registro (ERP, MES, PLM); o UNS apenas distribui referências e estados |
| Como trato o histórico? | Não no broker, mas no Eventhouse ou Lakehouse no Fabric |

### O modelo de dados mínimo para manufatura

Independentemente das ferramentas, os casos de uso deste guia precisam de um modelo central com sete entidades:

1. **Ativo** (máquina, estação, ferramenta) com ID único e posição na hierarquia
2. **Sinal** (tag, variável medida) com unidade, taxa de amostragem e vínculo ao ativo
3. **Estado** (em operação, parada planejada, parada não planejada, troca de setup) com código de motivo
4. **Ordem** (ordem de produção, operação) com vínculo ao ERP
5. **Material e número de lote/série** com vínculo à lista de materiais
6. **Evento** (alarme, constatação de qualidade, manutenção)
7. **Pessoa/turno**, na medida em que as regras de privacidade e os acordos trabalhistas permitirem

Se você vincular essas sete entidades de forma limpa, pode atender OEE, manutenção preditiva, rastreabilidade e gêmeo digital a partir da mesma base de dados. Discutimos como derivar esse modelo a partir de um fluxo de valor no episódio [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/); o método em si é abordado em nosso guia sobre [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

---

## Arquitetura de referência Azure para manufatura

A arquitetura de referência abaixo resume o que a Microsoft descreve na documentação do Azure IoT Operations [3] e na arquitetura de referência do Fabric "Connected Factory" [17], e acrescenta as camadas que essas fontes deixam de fora: segurança, dados mestres e o ambiente de trabalho.

### Modelo de camadas

| Camada | Função | Blocos de construção do Azure e da Microsoft | Decisões típicas |
|---|---|---|---|
| **0: Campo e controle** | Máquinas, CLPs, sensores, bancadas de teste, câmeras | Nenhum componente do Azure; servidor OPC UA no controlador ou em um gateway, sensores de retrofit onde necessário | Quais máquinas falam OPC UA? Onde é necessário retrofit? |
| **1: Infraestrutura de borda** | Computação na fábrica, segmentação de rede | PCs industriais ou servidores com Kubernetes (por exemplo, AKS Edge Essentials no Windows, clusters baseados em Ubuntu) [3], ou Azure Local [21]; gerenciados pelo Azure Arc | Cluster de nó único ou de múltiplos nós? Quem opera o hardware? Observação: a SKU Essentials é limitada a nó único [3] |
| **2: Plano de dados de borda** | Coleta, normalização, buffer, UNS local | Azure IoT Operations: broker MQTT, conector OPC UA, conector HTTP/REST (conectores Akri), fluxos de dados, experiência de operações, descoberta automática de dispositivos e ativos [3], [4] | Estrutura de tópicos, esquemas, agregação na borda, buffer em disco do broker, comportamento offline (no máximo 72 horas, possivelmente degradado [3]) |
| **3: Gestão de ativos e dispositivos** | Qual ativo é qual? Quais pontos de dados? | Azure Device Registry com namespaces e registro de esquemas [3]; para dispositivos conectados diretamente, IoT Hub e DPS [8] | Quem mantém os dados mestres de ativos? Reconciliação com o sistema de manutenção (CMMS)? |
| **4: Streaming e analytics em tempo real** | Ingerir eventos, enriquecê-los, disparar alertas | Fabric Real-Time Intelligence: Eventstream, Eventhouse (KQL), Activator, Real-Time Dashboards [17], [18]; alternativamente Azure Event Hubs e Azure Data Explorer [19] | Capacidade do Fabric ou PaaS do Azure? Retenção quente/fria? |
| **5: Plataforma de dados** | Histórico, dados de contexto, produtos de dados | OneLake, Lakehouse, Data Factory para dados de ERP, MES e turnos [17] | Estrutura medallion, responsabilidade pelos produtos de dados, modelo de acesso |
| **6: Semântica e gêmeo** | Significado, relacionamentos, ontologia | Ontologia do Fabric IQ (prévia) [16], digital twin builder (prévia) [15] ou Azure Digital Twins com DTDL [14] | Uma prévia é aceitável? Manter a propriedade do modelo |
| **7: Analytics e IA** | Modelos, previsões, agentes | Fabric Data Science [17], Azure Machine Learning, Microsoft Foundry [20] | Onde treinar, onde executar a inferência (nuvem ou borda)? |
| **8: Ambiente de trabalho e processos** | Informar as pessoas e permitir que ajam | Power BI, Teams (incluindo cenários para trabalhadores de linha de frente), Power Apps, Power Automate, Microsoft 365 Copilot, Dynamics 365 | Qual função vê o quê? Uso móvel no chão de fábrica? |
| **Transversal: segurança e governança** | Identidades, rede, monitoramento, conformidade | Microsoft Entra ID, Azure Policy, portfólio Microsoft Defender, Microsoft Purview, sensores OT (Defender for IoT apenas como transição, soluções de parceiros) [22] | Modelo de zonas conforme ISA/IEC 62443, perfil NIST CSF 2.0, caminhos de notificação de incidentes |
| **Transversal: custo** | Transparência, alocação, otimização | Microsoft Cost Management, métricas de capacidade do Fabric, práticas de FinOps [25] | Custo por planta, linha, caso de uso |

### Fluxo de dados em dez etapas

1. O controlador expõe valores de processo por meio de um servidor OPC UA.
2. O conector OPC UA no Azure IoT Operations lê os pontos de dados configurados de um ativo e os publica em um tópico do broker, por exemplo `azure-iot-operations/data/<asset>` [4].
3. O conector pode descobrir automaticamente ativos em servidores OPC UA e adicionar sua configuração ao Azure Device Registry [4].
4. Os fluxos de dados filtram, normalizam, convertem unidades e enriquecem com contexto [3], [31].
5. Aplicações locais (por exemplo, um painel andon ou uma inspeção em linha) assinam o broker diretamente.
6. Um fluxo de dados encaminha dados agregados para um endpoint na nuvem: Event Hubs/Kafka, o broker MQTT do Event Grid, Data Lake Storage, Fabric OneLake ou Azure Data Explorer [3].
7. No Fabric, um Eventstream ingere os dados e o Eventhouse os armazena para consultas KQL [17].
8. O Data Factory sincroniza dados de ERP, MES, turnos e custos para o OneLake [17].
9. Os eventos são enriquecidos com a hierarquia de ativos e a topologia de linhas; modelos são treinados e pontuados, e os resultados são armazenados no OneLake [17].
10. Painéis em tempo real e o Power BI realizam a visualização, o Activator notifica os técnicos, e o Copilot responde a perguntas em linguagem natural [17].

A Microsoft dimensiona a referência Connected Factory em mais de um milhão de eventos IIoT por hora, a partir de 30.000 tags em 40 fábricas [17]. Considere isso como uma orientação, não como uma garantia de desempenho para o seu ambiente.

### Lições de projetos

A consultoria b.telligent descreve três lições de projetos com Azure IoT Operations e Fabric [31]:

- **Configure o armazenamento do broker:** sem armazenamento persistente configurado, mensagens que não podem ser encaminhadas podem encher a memória. A Microsoft confirma o ponto indiretamente: o buffer de mensagens em disco do broker só pode ser definido durante a implantação inicial, não depois [40]. Defina o perfil de memória e o buffer antes da implantação.
- **Mantenha os esquemas estáveis:** alterações nas estruturas JSON tornam o processamento downstream frágil. Um envelope uniforme com metadados e payload ajuda.
- **Consolide os Eventstreams:** como cada Eventstream gera custos de operação, o post recomenda consolidar por fábrica em vez de por origem, e fazer as transformações no Eventhouse com políticas de atualização e KQL em vez de no Eventstream.

Essas dicas vêm de um post de março de 2025 (atualizado em junho de 2025); verifique se ainda se aplicam à sua versão.

### Caminhos alternativos

Nem todo fabricante precisa da arquitetura completa. Quatro variantes são comuns:

| Variante | Quando faz sentido | Blocos de construção |
|---|---|---|
| **Direto à nuvem** | Poucos dispositivos modernos e conectados; sem requisitos de latência | IoT Hub, DPS, Fabric Real-Time Intelligence |
| **Centrada na borda** | Muitas máquinas, OPC UA, decisões locais, rede OT sem conexão direta com a nuvem | Azure IoT Operations on Arc, Fabric |
| **Borda de parceiro** | Plataforma de borda industrial existente de um fornecedor de automação | Plataforma de parceiro mais Fabric ou Azure; a Microsoft cita, por exemplo, a execução de modelos de IA do Azure no Siemens Industrial Edge como orientação de arquitetura [2] |
| **Início enxuto (fabricante de médio porte, uma fábrica)** | Algumas linhas, sem equipe interna de Kubernetes, primeiro caso de uso OEE ou monitoramento de condição | Um cluster de nó único com Azure IoT Operations Standard (por causa do OPC UA), uma capacidade pequena do Fabric, Power BI; operação do cluster possivelmente por meio de um parceiro |

Para um fabricante de médio porte com uma fábrica, a arquitetura completa em camadas é uma imagem-alvo, não um ponto de partida. Comece com as camadas 1, 2, 4 e 8 e adicione semântica, IA e governança entre fábricas quando o primeiro caso de uso gerar resultados.

---

## Convergência TI/TO e segurança

Quando os dados das máquinas passam a fluir para a nuvem, a fábrica passa a fazer parte da sua superfície de ataque. Ao mesmo tempo, as exigências regulatórias e dos clientes estão aumentando. A CISA inclui a fabricação de metais primários, máquinas, equipamentos elétricos e componentes, e equipamentos de transporte no núcleo do **Setor Crítico de Manufatura** dos EUA [52]; por isso, muitas fábricas que enviam dados para o Azure pertencem a um setor de infraestrutura crítica.

Esta seção começa pelas normas que moldam o projeto técnico (ISA/IEC 62443, NIST CSF 2.0, NIST SP 800-82), depois trata das obrigações que se aplicam a grupos específicos de fabricantes (CMMC, SEC, CIRCIA) e, para empresas com operações na UE ou clientes na UE, da NIS2 e do Cyber Resilience Act.

### ISA/IEC 62443: zonas, conduítes e níveis de segurança

A série **ISA/IEC 62443** é o framework de referência para a segurança de sistemas de automação e controle industrial. Seus conceitos centrais são zonas (grupos de ativos com as mesmas necessidades de proteção), conduítes (caminhos de comunicação controlados entre zonas) e níveis de segurança como alvo por zona, do SL 1 (proteção contra violação casual ou acidental) ao SL 4 (proteção contra atacantes sofisticados com recursos ampliados) [27]. A norma também define sete requisitos fundamentais, desde o controle de identificação e autenticação até a disponibilidade de recursos [27]. Para uma arquitetura Azure, isso significa:

- **O cluster de borda é uma zona própria:** O cluster Kubernetes que executa o Azure IoT Operations não pertence nem à rede de escritório nem diretamente à rede de controle, mas a uma zona intermediária (frequentemente chamada de "DMZ industrial", nível 3.5 de Purdue).
- **Apenas conexões de saída:** O Arc e os fluxos de dados abrem conexões da fábrica para a nuvem. Conexões de entrada da internet para a fábrica não são necessárias e não devem ser abertas.
- **Redes em camadas:** A Microsoft afirma que o Azure IoT Operations oferece suporte à gestão segura de dispositivos em redes em camadas [3]. Planeje cedo a cadeia de proxy e firewall junto com a equipe de segurança de TO.
- **Conceda acesso de escrita de forma deliberada:** O conector OPC UA pode gravar valores de volta nos controladores [4]. Essa capacidade precisa de avaliação de risco e processo de aprovação próprios e, idealmente, começa desativada.
- **Certificados em vez de senhas:** Para OPC UA, estão disponíveis usuário/senha, certificados X.509 e acesso anônimo (apenas para testes) [4]. Use certificados e uma lista de confiança, e trate a renovação de certificados como um processo operacional recorrente.

### NIST CSF 2.0 e NIST SP 800-82: a base dos EUA

Para a maioria dos fabricantes dos EUA, o **NIST Cybersecurity Framework (CSF) 2.0** é a linguagem comum entre a fábrica, a TI e a diretoria. O NIST o publicou em 26 de fevereiro de 2024; ele amplia as cinco funções Identificar, Proteger, Detectar, Responder e Recuperar com uma nova função **Governar** e se aplica a organizações de qualquer setor e porte [49]. O framework é voluntário, mas clientes, seguradoras e auditores pedem cada vez mais um perfil CSF.

Dois documentos do NIST tornam o framework concreto para as fábricas:

- **NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security** (setembro de 2023) trata de arquiteturas, ameaças e contramedidas de TO e acrescenta um overlay de TO com linhas de base de controles SP 800-53 adaptadas para sistemas de TO de impacto baixo, moderado e alto [50].
- **NIST IR 8183 Rev. 2, Cybersecurity Framework 2.0 Manufacturing Profile**, foi publicado como rascunho público inicial em 29 de setembro de 2025; o período de comentários encerrou em 17 de novembro de 2025, e até novembro de 2026 nenhuma versão final consta na lista [51]. Use-o como referência de rascunho, não como norma final.

Como as peças se encaixam em um projeto Azure:

| Função do CSF 2.0 | O que significa para a plataforma de manufatura no Azure |
|---|---|
| Govern | Responsáveis nomeados pela plataforma da fábrica, aceitação de risco para serviços em pré-visualização, lista de fornecedores (Microsoft, integrador, fornecedores de OT) |
| Identify | Inventário de ativos de OT conciliado com o Azure Device Registry; mapa de fluxo de dados por zona e conduíte |
| Protect | Funções do Entra ID com privilégio mínimo, PIM, certificados OPC UA, conectividade somente de saída, acesso de escrita desabilitado por padrão |
| Detect | Monitoramento da rede de OT (solução de parceiro após o Defender for IoT), logs centralizados do edge e da nuvem no Sentinel ou no seu SIEM |
| Respond | Playbook de incidentes que cubra fábrica e nuvem, incluindo quem pode desconectar um cluster durante a produção |
| Recover | Reimplantação testada do cluster de edge (infraestrutura como código), backup da configuração do broker e dos ativos |

Fabricantes pequenos e médios não precisam fazer isso sozinhos: a NIST Manufacturing Extension Partnership (MEP) National Network oferece autoavaliações baseadas no CSF, análises de lacunas, planos de ação corretiva, planos de resposta a incidentes e ajuda com os requisitos do DFARS [58].

### CMMC para fornecedores de defesa

Se você fabrica peças ou presta serviços para o Departamento de Defesa dos EUA, o **Cybersecurity Maturity Model Certification (CMMC)** se aplica aos sistemas que processam, armazenam ou transmitem Federal Contract Information (FCI) ou Controlled Unclassified Information (CUI). A norma do programa (32 CFR Part 170) entrou em vigor em 16 de dezembro de 2024 [53]. A norma do DFARS que incorpora o CMMC aos contratos entrou em vigor em 10 de novembro de 2025, com implantação em fases: a fase 1 começou nessa data, a fase 2 em 10 de novembro de 2026, e a fase 3 está prevista para 10 de novembro de 2027 [54]. Os níveis são Nível 1 (autoavaliação, FCI), Nível 2 (autoavaliação ou avaliação de terceiros pela C3PAO, com base no NIST SP 800-171) e Nível 3 (avaliação pela DIBCAC, acrescentando as práticas do NIST SP 800-172) [53], [54].

O que isso significa para o Azure:

- **Defina o escopo pelos dados, não pela nuvem.** O CMMC se aplica aos seus sistemas, não ao Azure como plataforma; não existe certificado CMMC para o próprio Azure [55]. Telemetria simples de máquinas pode não ser CUI, enquanto desenhos, especificações e alguns parâmetros de processo de peças de defesa podem ser; as marcações de CUI e os termos contratuais do seu cliente decidem. Decida quais dados da UNS e do OneLake estão no escopo.
- **Escolha o ambiente de nuvem com deliberação.** A Microsoft afirma que tanto o Azure comercial quanto o Azure Government possuem autorizações FedRAMP High que cobrem o NIST SP 800-171, e que é possível obter a certificação CMMC para soluções em qualquer um deles; o Azure Government acrescenta autorizações DoD IL4/IL5 e compromissos contratuais sobre armazenamento de dados nos EUA e pessoal dos EUA submetido a triagem, e a Microsoft o considera a melhor opção para a maioria dos contratados de defesa [55]. Observe que a página de CMMC da Microsoft foi atualizada pela última vez em abril de 2023; confirme os detalhes com a sua equipe de conta da Microsoft.
- **Verifique a disponibilidade de recursos.** Nem todo serviço deste guia está disponível no Azure Government ou no ambiente Microsoft 365 GCC High. Verifique a disponibilidade do Azure IoT Operations, do Fabric e do Copilot para a nuvem de destino antes de projetar com base neles [unverified for the individual services; check Microsoft's US Government feature availability pages].

### Divulgação à SEC e notificação de incidentes sob o CIRCIA

Dois regimes de notificação dos EUA afetam a forma como você projeta o registro de logs e a resposta a incidentes da plataforma da fábrica:

- **Empresas de capital aberto:** Segundo as regras da SEC adotadas em 26 de julho de 2023, os registrantes devem divulgar um incidente de cibersegurança relevante no Formulário 8-K (Item 1.05) em até quatro dias úteis após determinar que ele é relevante, e descrever sua gestão de riscos de cibersegurança, estratégia e governança no Formulário 10-K anual [56]. Um ataque de ransomware que paralisa uma fábrica é um candidato típico para avaliação de materialidade; por isso, seu playbook de incidentes de OT precisa de um caminho rápido até o comitê de divulgação.
- **Infraestrutura crítica (CIRCIA):** A Cyber Incident Reporting for Critical Infrastructure Act exige que as entidades abrangidas notifiquem à CISA incidentes cibernéticos abrangidos em até 72 horas e pagamentos de resgate em até 24 horas, mas somente quando a norma final da CISA entrar em vigor. Em outubro de 2026, a CISA havia enviado a norma final à Casa Branca para revisão, e ela ainda não havia sido publicada [57]. Acompanhe a norma final; ela definirá quais fabricantes estão abrangidos.

### NIS2 e o Cyber Resilience Act para operações na UE

Se você administra fábricas na UE ou vende máquinas para lá, duas leis europeias também são relevantes. Os exemplos alemães abaixo vêm da edição original em alemão deste guia e mostram como as regras da UE se aplicam na prática.

**NIS2 (exemplo: Alemanha).** A lei de implementação da NIS2 na Alemanha (NIS2UmsuCG) entrou em vigor em 6 de dezembro de 2025; o Escritório Federal de Segurança da Informação da Alemanha (BSI) agora supervisiona cerca de 29.500 entidades, em vez de cerca de 4.500 [28]. As empresas estão no escopo se se enquadram em um dos tipos de entidade dos Anexos 1 e 2 da Lei do BSI e atendem aos limites da Seção 28: pelo menos 50 funcionários, ou mais de EUR 10 milhões tanto em receita anual quanto em total do balanço [41]. As categorias de manufatura no Anexo 2 incluem dispositivos médicos, computadores, produtos eletrônicos e ópticos, equipamentos elétricos, máquinas e veículos; química e alimentos são setores separados. Principais obrigações:

- **Registro** em duas etapas, pela conta "Mein Unternehmenskonto" e pelo portal do BSI, que foi aberto em 6 de janeiro de 2026 [28].
- **Gestão de riscos**, com responsabilização no nível da diretoria.
- **Medidas técnicas e organizacionais**, incluindo segurança da cadeia de suprimentos e autenticação multifator.
- **Notificação de incidentes** significativos: alerta preliminar em até 24 horas após tomar conhecimento, notificação do incidente em até 72 horas e relatório final no máximo um mês após a notificação [41].

As empresas devem avaliar por conta própria se estão no escopo; o BSI não as notifica. Ele oferece uma autoavaliação online não vinculante e recomenda consultoria jurídica em casos incertos [41]. Outros estados-membros da UE têm leis de implementação próprias com estruturas semelhantes.

**Cyber Resilience Act.** Se você fabrica máquinas ou produtos com elementos digitais e os coloca no mercado da UE, o **Cyber Resilience Act (Regulamento (UE) 2024/2847)** também se aplica, inclusive a fabricantes dos EUA. A partir de 11 de setembro de 2026, os fabricantes devem reportar vulnerabilidades ativamente exploradas e incidentes graves pela Plataforma Única de Notificação da ENISA: alerta preliminar em até 24 horas, notificação em até 72 horas e relatório final no máximo 14 dias após a disponibilização de uma correção, no caso de vulnerabilidades, ou em até um mês, no caso de incidentes [30]. A partir de 11 de dezembro de 2027, os produtos devem atender aos requisitos essenciais de cibersegurança antes de serem colocados no mercado; estes incluem configurações padrão seguras, uma lista de materiais de software (SBOM) e atualizações de segurança durante um período de suporte declarado, geralmente de pelo menos cinco anos [42]. Para fabricantes de máquinas que entregam equipamentos com serviços em nuvem, a TI de manufatura passa a fazer parte da conformidade do produto.

Para a arquitetura Azure, NIS2, CSF 2.0 e CMMC apontam na mesma direção: um inventário (o que está conectado à nuvem?), registro de logs (quem alterou o quê e quando?), transparência na cadeia de suprimentos (quais serviços e parceiros estão envolvidos?) e um caminho de notificação testado.

### Monitoramento de OT após a desativação do Defender for IoT

Em 2 de novembro de 2026, a Microsoft anunciou oficialmente, no Azure Updates, que desativará por completo o componente de segurança de OT do Defender for IoT em outubro de 2029, após um período de transição de três anos [22]. Até lá, o serviço recebe atualizações de segurança e correções de bugs, mas nenhum novo recurso de OT; contratos e renovações existentes são honrados até outubro de 2029 [22]. Os recursos de IoT corporativo no Defender for Endpoint, assim como a descoberta de dispositivos e a avaliação de vulnerabilidades, não são afetados [22]. Não há substituto de primeira parte [39]. A Microsoft oferece conectores para Armis, Dragos e Forescout que trazem dados de ativos e vulnerabilidades de OT para o Microsoft Security Exposure Management e para o portal do Defender; as soluções de parceiros exigem licenças e implantação próprias [22], [24].

Datas conflitantes: um blog de parceiro da Microsoft, de novembro de 2026, cita **31 de maio de 2028** como fim do suporte para a segurança de OT [39]. Até a redação deste texto, não se esclareceu se se trata de uma data diferente para determinados tipos de contrato ou de um erro.

Recomendação: se você está introduzindo monitoramento de OT agora, avalie diretamente as soluções de parceiros. Se utiliza o Defender for IoT, planeje a substituição para que esteja concluída antes de meados de 2028 e confirme, com a sua equipe de conta Microsoft, a data que se aplica ao seu contrato.

### Lista de verificação de segurança para a primeira conexão da planta

- [ ] Modelo de zonas conforme ISA/IEC 62443 documentado para a planta
- [ ] Cluster de borda em zona própria, apenas conexões de saída, por meio de um proxy
- [ ] Endpoints do Arc e do Azure explicitamente permitidos no firewall; todo o restante bloqueado
- [ ] Conexões OPC UA com certificados; acesso de escrita desativado ou sujeito a aprovação
- [ ] Funções do Entra ID para a equipe de OT com privilégio mínimo; acesso privilegiado com prazo limitado
- [ ] Logs da borda e da nuvem coletados centralmente
- [ ] Inventário de ativos de OT conciliado com o Azure Device Registry
- [ ] Perfil CSF 2.0 (atual e alvo) elaborado para a plataforma da planta
- [ ] Escopo do CMMC definido caso a planta trate FCI ou CUI
- [ ] Caminho de notificação de incidentes testado (SEC, CIRCIA quando em vigor, NIS2 para sites na UE)
- [ ] Processo de atualização para as versões do Azure IoT Operations e do Kubernetes definido (janelas de manutenção acordadas com a produção)

---

## Caso de uso 1: Manutenção preditiva no Azure

A manutenção preditiva é um dos casos de uso de manufatura mais citados no Azure e também um dos que mais fracassam em pilotos. Um motivo comum: o modelo vem antes dos dados. Aprofundamos este tema no episódio [Predictive Maintenance on Azure: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/).

### Mantenha os termos bem separados

| Estratégia | Gatilho | Dados necessários |
|---|---|---|
| Manutenção reativa | Falha | Nenhum |
| Manutenção preventiva | Intervalo de tempo ou contador | Horas de operação, ciclos |
| Manutenção baseada na condição (monitoramento de condição) | Limite ultrapassado | Variáveis de condição (vibração, temperatura, corrente) |
| Manutenção preditiva | Previsão da vida útil remanescente ou da probabilidade de falha | Variáveis de condição mais histórico de falhas rotulado mais contexto operacional |
| Manutenção prescritiva | Ação recomendada | Mais conhecimento de causas e ações |

Muitas empresas obtêm a maior parte do benefício apenas com a manutenção baseada na condição. Modelos preditivos compensam quando as falhas são caras, suficientemente frequentes e fisicamente anunciadas com antecedência. A [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) fornece a estratégia geral; seus pilares de manutenção autônoma e planejada também funcionam sem IA.

### Pré-requisitos de dados

Antes de treinar um modelo, você deve conseguir responder "sim" a estas perguntas:

1. **Existe histórico de falhas?** Um modelo supervisionado precisa de falhas com data e hora e tipo de falha. Normalmente elas estão no sistema de manutenção (por exemplo, SAP PM ou um CMMS) e raramente são codificadas de forma consistente.
2. **Os carimbos de tempo estão sincronizados?** O horário dos sensores, o horário dos controladores e o horário de lançamento no ERP precisam ser conciliáveis. Não é por acaso que a Microsoft adicionou mensagens de integridade específicas para servidores NTP ausentes ou inacessíveis nos sensores do Defender for IoT [23]; o mesmo vale para o seu pipeline de dados. O conector OPC UA transporta o carimbo de tempo de origem de cada valor [4]; use-o em vez do horário de chegada na nuvem.
3. **A taxa de amostragem é adequada ao modo de falha?** Danos em rolamentos aparecem em espectros de vibração na faixa de quilohertz; o desgaste de resistências de aquecimento aparece em valores na escala de minutos. Uma tag OPC UA com resolução de um segundo basta para o primeiro caso, mas não para o segundo.
4. **O contexto operacional está disponível?** Sem informações sobre produto, receita, ordem e estado (troca de formato, produção, parada), o modelo trata cada mudança de produto como anomalia.
5. **A ação está definida?** Quem responde a um alerta, com que antecedência, e como o resultado é reportado de volta?

### Seis etapas

1. **Selecionar candidatos:** Ativos com altos custos de falha, modos de falha recorrentes e sensores já existentes. Uma análise de Pareto dos motivos de paradas a partir do MES fornece a lista.
2. **Conectar os dados:** Conector OPC UA no Azure IoT Operations, pontos de dados por ativo, fluxo de dados para o Fabric [3], [4]. Agregue os dados de vibração de alta frequência na borda em características (RMS, curtose, energias de banda).
3. **Monitoramento de condição primeiro:** Limiares e detecção simples de anomalias no Eventhouse e no Activator. O Activator pode notificar os técnicos diretamente [17]. Isso gera valor em semanas, e não em meses, e ao mesmo tempo coleta rótulos.
4. **Criar rótulos:** Associe ordens de manutenção com códigos de falha às séries temporais. É aqui que está o esforço real. Planeje uma ferramenta para isso: a Microsoft desativou a rotulagem de dados integrada no Azure Machine Learning em 30 de setembro de 2026 e aponta para fornecedores terceiros [38]. Para rótulos de séries temporais provenientes da manutenção, muitas vezes basta um Power App que grave de volta no sistema de manutenção.
5. **Treinar o modelo:** No Fabric Data Science ou no Azure Machine Learning; armazene os resultados no OneLake [17]. Comece com métodos interpretáveis (gradient boosting sobre as características) antes de recorrer ao deep learning.
6. **Operacionalizar:** Envie as previsões como eventos para o processo de manutenção (notificação no sistema de manutenção, mensagem no Teams, formulário do Power Apps para feedback). Monitore a qualidade do modelo e o desvio (drift).

### Métricas de sucesso

Meça o impacto operacional, e não a acurácia do modelo: paradas não planejadas, tempo médio entre falhas (MTBF), tempo médio de reparo (MTTR), participação da manutenção planejada no total de horas de manutenção e estoque de peças de reposição. Esses [KPIs](https://www.m365.fm/entity/key-performance-indicator/) precisam de uma linha de base antes do início do projeto; caso contrário, não é possível comprovar nenhum benefício. Nosso guia sobre [KPIs de manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/) reúne as definições.

### Borda ou nuvem para a inferência?

| Critério | Inferência na nuvem | Inferência na borda |
|---|---|---|
| Latência | Segundos a minutos | Milissegundos |
| Volume de dados | Somente dados agregados são enviados | Os dados brutos permanecem locais |
| Operação | Mais simples (modelos centralizados) | Implantações distribuídas, versionamento por fábrica |
| Resiliência | Depende da conectividade | Funciona offline |
| Uso típico | Vida útil remanescente, planejamento da manutenção | Desligamento rápido, qualidade em linha |

Para a manutenção preditiva clássica, a inferência na nuvem sobre dados agregados basta na maioria dos casos. Desde a versão 2603, a Microsoft posicionou explicitamente o Azure IoT Operations para cenários de IA mais próximos da máquina ("Physical AI") [6]; para inferência na borda, consulte as notas de versão atuais [7].

### Manutenção preditiva no Azure: blocos de construção em resumo

| Etapa | Bloco de construção do Azure e da Microsoft | Alternativa |
|---|---|---|
| Coletar dados | Azure IoT Operations (conector OPC UA, fluxos de dados) [3], [4] | IoT Hub para sensores conectados diretamente [36] |
| Armazenar e analisar séries temporais | Eventhouse do Fabric com KQL [17] | Azure Data Explorer [19] |
| Limiares e alertas | Activator do Fabric [17] | Azure Monitor ou lógica personalizada |
| Treinar o modelo | Fabric Data Science, Azure Machine Learning [17], [37] | Aplicação própria do fabricante da máquina |
| Disparar ação | Power Automate, Teams, Power Apps, sistema de manutenção | API direta para o CMMS |

---

## Caso de uso 2: Rastreabilidade e genealogia

Rastreabilidade responde à pergunta "Onde esta peça está instalada e do que ela é feita?". Genealogia descreve a cadeia completa de origem de um produto, incluindo material, lote, etapa do processo, máquina, parâmetros, resultado de inspeção e operador. Em setores regulamentados ela é obrigatória; em todos os demais acelera o tratamento de reclamações e reduz o escopo de recalls. O episódio [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/) aborda o tema em profundidade.

### Requisitos por setor

| Setor / norma | Requisito de dados essenciais | Observação |
|---|---|---|
| Alimentos, FDA Food Traceability Rule (FSMA Section 204) | Elementos-chave de dados (KDEs) para cada evento crítico de rastreamento (CTE), como recebimento, transformação e expedição, vinculados a um código de lote de rastreabilidade; registros fornecidos ao FDA em até 24 horas após uma solicitação, além de uma planilha eletrônica classificável durante surtos ou recalls | [59]; o FDA não fará cumprimento antes de 20 de julho de 2028, conforme determinação do Congresso (data original: 20 de janeiro de 2026) |
| Dispositivos médicos, FDA QMSR (21 CFR Part 820) | Desde 2 de fevereiro de 2026, a Quality Management System Regulation incorpora por referência a ISO 13485:2016, incluindo seus requisitos de identificação e rastreabilidade | [61] |
| Registros eletrônicos regulados pela FDA, 21 CFR Part 11 | Trilhas de auditoria seguras, geradas por computador e com carimbo de data e hora, que registram entradas e alterações do operador sem obscurecer entradas anteriores, mantidas pelo tempo de retenção dos registros | [60]; relevante para registros de farmacêutica, dispositivos médicos e alimentos mantidos eletronicamente |
| Automotivo, IATF 16949 | A cláusula 8.5.2.1 complementa os requisitos de identificação e rastreabilidade da ISO 9001 (incluindo um plano de rastreabilidade baseado em análise de risco); a cláusula 7.5.3.2.1 trata da retenção de determinados registros, comumente interpretada como a duração do fornecimento de produção e peças de reposição mais um ano civil, salvo exigência do cliente ou do regulador | Texto da norma é pago; detalhes obtidos de fontes secundárias. Requisitos específicos de clientes OEM (CSRs) frequentemente vão além |
| Aeroespacial, AS9100D (EN 9100 na Europa, JIS Q 9100 no Japão) | Rastreabilidade ao longo do ciclo de vida do produto, identificação de configuração, capacidade de rastrear produtos fabricados a partir do mesmo lote de matéria-prima ou lote de produção | AS9100D (2016) é a revisão atual; EN 9100 é a edição europeia tecnicamente equivalente [62]. Citação de cláusula (8.5.2) não verificada contra o texto original da norma |
| Baterias vendidas na UE, EU Battery Regulation (Regulamento (UE) 2023/1542) | Passaporte eletrônico da bateria a partir de 18 de fevereiro de 2027 para baterias de tração de veículos elétricos, baterias de meios de transporte leves (por exemplo, bicicletas e patinetes elétricos) e baterias industriais acima de 2 kWh | [29]; cronograma conforme a Comissão Europeia é indicativo; relevante para exportadores dos EUA para a UE |
| Produtos vendidos na UE sob o Ecodesign Regulation (ESPR, Regulamento (UE) 2024/1781) | Passaporte digital do produto, dependendo do ato delegado; registro de DPP da UE em operação desde 20 de julho de 2026 (inicialmente com ambiente de testes); ato delegado para ferro e aço previsto para o 4º trimestre de 2026, e para têxteis, alumínio e pneus em 2027; período de transição de pelo menos 18 meses após a adoção de um ato delegado | [29]; cronograma conforme a Comissão Europeia é indicativo |

Para o setor aeroespacial, Mirko Peters explica em seu post [Aerospace Production Planning: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/) por que prazo de entrega e rastreabilidade estão intimamente ligados nesse setor; nosso guia sobre [planejamento da produção aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/) cobre o contexto da AS9100, da FAA e do controle de exportações.

### O modelo de dados da genealogia

Uma genealogia robusta precisa de três tipos de relacionamentos:

1. **Material em material:** Lote A e componente B entram no conjunto C (referência de BOM, número de série ou de lote).
2. **Material para processo:** O conjunto C foi processado na operação 30, na estação 20, com o conjunto de parâmetros X, pelo turno Y.
3. **Processo para resultado:** A operação 30 gerou o resultado de inspeção Z e, quando aplicável, uma não conformidade.

Essas relações formam um grafo. Você pode representá-lo no Fabric como uma estrutura de tabelas no Lakehouse e percorrê-lo com KQL ou SQL, ou modelá-lo como um grafo em um gêmeo digital (ontologia do Fabric ou Azure Digital Twins) [14], [16]. O que importa é que a identificação aconteça na origem: leitura por scanners, RFID ou códigos Data Matrix na estação, vinculada ao evento da ordem no UNS.

### Implementação no Azure

- **Capturar eventos na borda:** Scanners e estações publicam "peça X iniciada/concluída na estação Y" no broker MQTT do Azure IoT Operations [3]. Os parâmetros de processo chegam pelo conector OPC UA [4]; o "acionamento de conjunto de dados" permite que um ponto de dados dispare a publicação dos demais, por exemplo "ciclo concluído" [4].
- **Reunir o contexto:** No Fabric, os eventos são combinados com dados de ordens e de BOM provenientes do ERP e do MES [17].
- **Garantir imutabilidade:** Registros regulatórios exigem armazenamento imutável ou, no mínimo, um log de alterações à prova de adulteração (para registros regulados pela FDA, o requisito de trilha de auditoria da Part 11 [60]). A política de imutabilidade do OneLake atualmente se aplica apenas a logs de diagnóstico, não a dados de negócio [43]. Para arquivos de rastreabilidade à prova de auditoria, adicione o Azure Blob Storage com políticas de armazenamento imutável (WORM); o Fabric permanece como camada de análise.
- **Disponibilizar consultas:** Consultas típicas são o rastreamento para frente (quais produtos acabados contêm o lote A?) e o rastreamento para trás (do que é composto o número de série S?). Um relatório no Power BI ou um Power App para garantia de qualidade torna essas consultas utilizáveis sem conhecimento de KQL. Pela FSMA 204, a capacidade de exportar uma planilha ordenável em até 24 horas [59] é um teste de aceitação concreto para esta camada.

### Do registro de rastreabilidade ao passaporte digital do produto

Um passaporte digital do produto é, essencialmente, um extrato acessível externamente da sua genealogia, somado a dados de sustentabilidade e de materiais. Se você construir uma genealogia consistente hoje, terá feito o trabalho preparatório mais difícil. Garanta que os identificadores sejam únicos e permanentes e que você consiga separar quais dados são públicos, quais são destinados a reguladores e quais são apenas internos.

---

## Caso de uso 3: Gêmeos digitais

O termo [gêmeo digital](https://www.m365.fm/entity/digital-twin/) é usado para coisas muito diferentes: desde um modelo 3D até um modelo de simulação ou uma representação em tempo real de uma fábrica. Para fins de arquitetura, uma distinção ajuda. Nosso guia sobre [gêmeos digitais na manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/) vai além da visão do Azure.

### Três tipos de gêmeos

| Tipo | Pergunta | Dados | Ferramentas no ecossistema Microsoft |
|---|---|---|---|
| **Gêmeo de informação** | O que está onde, e como está conectado? | Hierarquia de ativos, relações, estados em tempo real | Fabric digital twin builder (prévia) [15], ontologia do Fabric IQ (prévia) [16], Azure Digital Twins [14] |
| **Gêmeo de simulação** | O que acontece se …? | Lógica de processo, tempos, capacidades, comportamento em caso de perturbação | Aplicações industriais para simulação de fluxo de material e de processo, possivelmente em infraestrutura do Azure |
| **Gêmeo de engenharia** | Como o produto ou a máquina se comporta fisicamente? | CAD, CAE, lógica de controle | PLM/CAE no Azure; a Microsoft lista, entre outros, orientações de arquitetura para Siemens NX no Azure Virtual Desktop com VMs com GPU e Ansys Discovery em VMs com GPU [2] |

O [comissionamento virtual](https://www.m365.fm/entity/virtual-commissioning/) conecta os gêmeos de engenharia e de simulação: o código de controle é testado contra um modelo da planta antes de o equipamento real existir.

### Azure Digital Twins ou Fabric?

A própria Microsoft aponta que o digital twin builder no Fabric é um produto diferente do Azure Digital Twins [14], [15]. As diferenças práticas:

| Critério | Azure Digital Twins | Fabric digital twin builder |
|---|---|---|
| Status | Ativo, sem aviso de descontinuação na página de visão geral [14] | Prévia [15] |
| Modelagem | DTDL (Digital Twins Definition Language), versão 3 [14] | Ontologia com tipos de entidade e relações [15] |
| Armazenamento | Grafo de gêmeos próprio; histórico por meio de histórico de dados no Azure Data Explorer [14] | OneLake; os dados devem estar primeiro em um lakehouse do Fabric [15] |
| Integração | Rotas de eventos para Event Hubs, Event Grid, Service Bus [14] | Nativo no Fabric Real-Time Intelligence, Power BI |
| Público | Equipes de desenvolvimento, centradas em API | Equipes de dados e de negócio, low-code |
| Visualização | 3D Scenes Studio (prévia) [14] | Experiências do Fabric, Power BI |

**Recomendação:** Se a sua plataforma de dados é o Fabric e você precisa de gêmeos analíticos para KPIs e análise de causa raiz, acompanhe o digital twin builder e a ontologia do Fabric IQ e faça pilotos com eles, mas não faça o seu modelo de dados depender de uma prévia. A Microsoft ainda não documentou como os dois componentes do Fabric vão evoluir em relação um ao outro; a ontologia já passou por uma mudança de experiência com migração obrigatória [16]. Se você está construindo hoje uma aplicação de gêmeo digital para produção, baseada em API, o Azure Digital Twins é o serviço com disponibilidade geral. Em qualquer dos casos, mantenha uma cópia da sua ontologia em um formato neutro em relação a ferramentas.

### Por onde começar?

O erro mais comum é começar pela visualização 3D. Comece por uma pergunta que o gêmeo deve responder, por exemplo "Quais pedidos são afetados se a estação 20 parar?". Essa pergunta define as entidades e os relacionamentos de que você precisa. Mirko Peters descreve essa abordagem em [Digital Twin in Manufacturing: Where to Start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/) e o caminho do ERP até um gêmeo do chão de fábrica em [From ERP to Shop Floor: Building the Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/). Discutimos a implementação técnica no Azure no episódio [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/).

---

## Caso de uso 4: KPIs em tempo real, OEE e fluxos de valor

KPIs em tempo real costumam ser a forma mais rápida de obter valor de uma conexão com a planta. Eles não precisam de IA, mas exigem um modelo de estados limpo.

### Calcule o OEE corretamente

A eficácia global do equipamento (OEE, na sigla em inglês) é o produto de disponibilidade, desempenho e qualidade. A fórmula é simples; as definições não são:

- **Disponibilidade:** Quais paradas contam como planejadas (intervalos, manutenção planejada, ausência de ordem)? Essa decisão pode alterar o OEE em muitos pontos percentuais.
- **Desempenho:** Qual tempo de ciclo serve de referência: o valor de projeto, o melhor tempo de ciclo alcançado ou o padrão no ERP?
- **Qualidade:** O retrabalho conta como peça boa ou peça ruim?

Acordem essas definições entre as plantas antes de construir um painel. Caso contrário, as plantas compararão números que não são comparáveis.

### Arquitetura para KPIs em tempo real

1. Estados das máquinas e contadores de peças fluem via OPC UA para o broker [4].
2. Um fluxo de dados mapeia os estados para um modelo de status uniforme (mapeamento de códigos específicos de cada máquina) [3].
3. O Eventhouse calcula KPIs contínuos por estação, linha e turno com KQL.
4. Um Real-Time Dashboard atende o chão de fábrica; relatórios do Power BI atendem a gestão [17].
5. O Activator dispara alertas quando os valores ficam abaixo dos limites [17].

### A cadeia de valor como modelo de dados vivo

O mapeamento do fluxo de valor é tradicionalmente um exercício em papel. Se você conectar as caixas de processo de uma cadeia de valor a dados em tempo real, obtém um modelo de dados simples, mas eficaz: lead time, estoque entre processos, tempos de ciclo e gargalos tornam-se mensuráveis. O episódio [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) mostra como isso funciona na prática. Para o sequenciamento detalhado com base nesses dados, entram em cena os sistemas de [advanced planning and scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/); veja nosso guia sobre [production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/). Como esses números são usados nas reuniões diárias de tier é o tema do nosso guia sobre [shop floor management](https://www.m365.fm/en/learn/shop-floor-management/).

### Catálogo inicial de KPIs

| KPI | Fonte de dados | Granularidade |
|---|---|---|
| OEE e seus fatores | Estado da máquina, contadores, achados de qualidade | Estação, turno |
| Lead time | Eventos de pedido (início/fim por operação) | Pedido, produto |
| Trabalho em processo | Lançamentos de estoque, leituras de scanner | Buffer, linha |
| Entrega no prazo | ERP (data solicitada vs. data real) | Cliente, grupo de produtos |
| MTBF / MTTR | Paradas, ordens de manutenção | Ativo |
| Energia por peça boa | Medidores de energia, contagem de peças | Linha, produto |
| First pass yield | Resultados de inspeção | Operação |

---

## Integração de ERP e MES

Dados do chão de fábrica sem o contexto de ordens e materiais são medições, não informação. A integração com ERP e MES determina o valor de toda a plataforma.

### Qual sistema é o system of record?

| Objeto de dados | System of record (típico) | Papel da plataforma Azure |
|---|---|---|
| Material, BOM, roteiro | ERP / PLM | Cópia para enriquecimento, sem manutenção |
| Ordem de produção (planejamento) | ERP / APS | Cópia; feedback de status como evento |
| Execução de operação, apontamento | MES | Eventos no UNS, histórico no Fabric |
| Estados de máquina, valores de processo | Controlador / edge | Fonte primária de dados |
| Ordens de manutenção | Manutenção do ERP / CMMS | Acionadas por previsões, histórico para rótulos |
| Achados de qualidade | QMS / MES | Vinculados a dados de processo |

### Integração com SAP

Há várias formas de trazer dados do SAP para o Fabric: conectores do Data Factory, soluções de open mirroring de parceiros e "SAP Business Data Cloud Connect for Microsoft Fabric", que visa disponibilizar produtos de dados SAP no OneLake sem cópia; a disponibilidade geral desta última foi anunciada para o terceiro trimestre de 2026 [44]. Não conseguimos confirmar a disponibilidade geral real na data de redação [unverified: status de disponibilidade não confirmado na data de redação]; verifique o status atual e os requisitos de licenciamento do lado SAP antes de planejar. Para integração de chão de fábrica com o SAP Digital Manufacturing, a DSAG (grupo de usuários SAP de língua alemã) publicou em abril de 2026 o guia "SAP DM Shopfloor Integration"; a página de resumo está disponível em inglês. Segundo a introdução, ele cobre arquitetura, estruturas e modelos de dados, escalabilidade, templates, modelo operacional e aquisição; o texto completo é reservado aos membros da DSAG [48]. Regra básica: os apontamentos devem entrar no SAP pelo MES ou por APIs definidas, não diretamente da plataforma de dados.

### Dynamics 365

Se você usa o Dynamics 365 Supply Chain Management, se beneficia de sua proximidade com o ecossistema Microsoft: com "Link to Microsoft Fabric", dados do Dataverse, incluindo tabelas selecionadas de finanças e operações, podem ser disponibilizados no Fabric sem um pipeline ETL próprio [45]. A Microsoft descreve sua oferta para manufatura como uma combinação de recursos do Dynamics 365, Microsoft 365 e Azure [1].

### Historiadores e SCADA existentes

Muitas fábricas nos EUA já operam um historiador de processo ao lado do SCADA. Trate-o como fonte, não como algo a ser substituído: o historiador continua atendendo operadores e engenheiros de processo localmente, enquanto a plataforma Azure recebe os sinais brutos da camada OPC UA ou dados curados do historiador. Defina, por sinal, qual caminho é o system of record do histórico, para não armazenar e pagar duas vezes pela mesma série temporal, e verifique com o fornecedor do historiador quais interfaces e licenças se aplicam antes de desenhar o fluxo de dados.

### O fluxo de dados do chão de fábrica para o ERP

Um padrão comum:

1. O ERP libera uma ordem; o evento "ordem liberada" chega ao UNS.
2. O MES inicia uma operação; o evento "operação iniciada" traz estação e ordem.
3. Os dados da máquina são enriquecidos no fluxo de dados com o número da ordem atual.
4. O MES confirma quantidades e tempos; o ERP os lança.
5. O Fabric une todos os eventos em um histórico completo da ordem para análises e genealogia.

---

## IA e Copilot na manufatura

A IA generativa chegou à manufatura, mas de forma diferente da esperada em 2024. A Microsoft aposentou suas prévias de agentes específicos para manufatura (Factory Operations Agent, Factory Safety Agent) em 2025 [2] e passou a depender de blocos de construção genéricos da plataforma: Microsoft Foundry para agentes e modelos [20], Copilot no Fabric para perguntas sobre dados [17] e Copilot Studio e Microsoft 365 Copilot para cenários de trabalho de escritório. Na Ignite 2025, o Fabric IQ e o Foundry IQ chegaram como prévias, destinados a dar aos agentes uma camada semântica e uma base de conhecimento, respectivamente [34]. A visão de ciclo de vida se aplica aqui também: o prompt flow, uma ferramenta amplamente usada no início das aplicações com LLM no Foundry e no Azure Machine Learning, será desativado em 20 de abril de 2027; a Microsoft recomenda migrar para o Microsoft Agent Framework [37].

### Cenários realistas

| Cenário | Blocos de construção | Pré-requisito |
|---|---|---|
| Perguntas em linguagem natural sobre dados de produção ("Por que a linha 3 foi mais lenta ontem?") | Copilot no Fabric, agentes de dados do Fabric, ontologia [16], [17] | Modelo de dados limpo, nomes de tabelas e colunas compreensíveis, KPIs definidos |
| Resumir passagens de turno e relatórios de incidentes | Microsoft 365 Copilot, Teams, Copilot Studio | Captura estruturada, por exemplo em formulários do Power Apps ou do Teams |
| Assistente de manutenção (pesquisa em manuais e histórico de falhas) | Microsoft Foundry com recuperação de informações, Copilot Studio | Documentos digitais e atualizados, permissões mantidas |
| Inspeção visual de qualidade | Modelos de visão computacional, inferência na borda | Dados de imagem rotulados (ferramenta de rotulagem de terceiros, já que a rotulagem de dados do Azure ML está desativada [38]), iluminação estável |
| Assistente de planejamento (comparar cenários) | Aplicação industrial (APS, simulação) mais IA | Um modelo de planejamento válido |

### Microsoft 365 como ponte para o chão de fábrica

Para organizações que já usam o Microsoft 365, a maior alavanca de curto prazo muitas vezes não está no Azure, mas na conexão entre os eventos do chão de fábrica e o ambiente de trabalho:

- **Teams para trabalhadores de linha de frente:** comunicação de turno, tarefas e notificações do Activator ou do Power Automate diretamente no Teams [17].
- **Power BI:** relatórios de KPIs para a gestão e a liderança da fábrica, construídos sobre os mesmos dados do Fabric.
- **Power Apps:** registrar motivos de paradas, achados de qualidade e retorno da manutenção em tablets na estação de trabalho. Isso cria exatamente os rótulos de que a manutenção preditiva precisa.
- **Copilot:** resumos de relatórios de turno, análises de desvios e atas de reuniões da gestão do chão de fábrica.
- **Esclareça o licenciamento cedo:** os funcionários do chão de fábrica normalmente recebem licenças para trabalhadores de linha de frente (Microsoft 365 F1 ou F3). Antes da implantação, verifique quais recursos elas incluem, como Power Apps ou Copilot, e de quais licenças adicionais você precisa; caso contrário, um bom piloto trava na escala.

### Limites e governança

- **Nenhuma decisão de controle por modelos de linguagem.** Modelos de linguagem pertencem ao papel de assistência, não ao circuito de controle fechado de uma máquina.
- **Use um framework de risco.** O **NIST AI Risk Management Framework (AI RMF 1.0)**, publicado em 26 de janeiro de 2023, é um framework voluntário organizado em quatro funções: Govern, Map, Measure e Manage [63]. É uma forma prática de documentar os riscos da IA na inspeção de qualidade ou no planejamento para clientes e auditores.
- **EU AI Act para operações na UE:** se você opera sistemas de IA em fábricas da UE ou vende produtos com IA ali, verifique se um sistema é usado como componente de segurança de um produto ou para gerenciar trabalhadores; podem surgir obrigações para sistemas de alto risco. O "Digital Omnibus on AI" (Regulamento (UE) 2026/1744, em vigor desde o final de julho de 2026) adiou esses prazos: para 2 de dezembro de 2027 no caso de sistemas de alto risco autônomos (por exemplo, em RH) e para 2 de agosto de 2028 no caso de sistemas incorporados a produtos. A IA em máquinas deve ser regulamentada por atos delegados no âmbito do Regulamento Europeu de Máquinas [46]. A classificação do seu sistema específico exige análise jurídica.
- **Força de trabalho e relações trabalhistas:** sistemas que podem avaliar o desempenho ou o comportamento dos funcionários levantam questões trabalhistas. Em fábricas sindicalizadas nos EUA, verifique se o seu acordo coletivo de trabalho cobre o monitoramento de desempenho; em fábricas alemãs, esses sistemas geralmente exigem a concordância do conselho de trabalhadores (Betriebsrat), que tem direitos de cogestão. Envolva os representantes dos trabalhadores desde cedo, em qualquer caso.
- **Permissões:** o Copilot mostra o que um usuário tem permissão para ver. Compartilhamentos excessivamente amplos no SharePoint ou no Fabric tornam-se visíveis através da IA.

---

## FinOps para TI de manufatura

Os custos de nuvem na manufatura se comportam de forma diferente das cargas de trabalho clássicas de TI: os volumes de dados crescem a cada máquina conectada, as cargas rodam 24 horas por dia e parte da infraestrutura fica dentro da fábrica. O FinOps ajuda a tornar esses custos previsíveis e a vinculá-los ao valor gerado. O episódio [FinOps for Manufacturing IT](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/) aborda as especificidades.

### O FinOps Framework em resumo

A Microsoft baseia suas orientações de FinOps no framework da FinOps Foundation [25]. Ele consiste em seis princípios (entre eles "Teams need to collaborate", "Business value drives technology decisions" e "Take advantage of the variable cost model of the cloud"), três fases do ciclo de vida (Inform, Optimize, Operate) e quatro domínios [25]:

| Domínio | O que significa para a manufatura |
|---|---|
| Entender uso e custo | Tornar visível o custo por fábrica, linha e caso de uso (tagging, capacidades ou workspaces do Fabric separados) |
| Quantificar o valor de negócio | Custo por peça boa, por máquina conectada ou por hora de parada evitada |
| Otimizar uso e custo | Reduzir o volume de dados na borda, escalonar a retenção, dimensionar corretamente as capacidades |
| Gerenciar a prática de FinOps | Responsabilidades, políticas, rateio de custos (chargeback) para as fábricas |

O framework recomenda avaliar a maturidade por capacidade, e não de forma global, e revisá-la a cada três a seis meses [25].

### As dez alavancas de custo mais importantes

1. **Agregar na borda:** Nem todo valor em resolução de um segundo precisa chegar à nuvem. Os fluxos de dados podem filtrar e agregar [3]. Esta é a alavanca individual mais importante.
2. **Enviar somente em mudança:** Por padrão, o conector OPC UA envia apenas valores alterados e adiciona quadros-chave periódicos com todos os valores para que os consumidores possam recuperar o estado [4]. Verifique também as zonas mortas (deadbands) no controlador ou no servidor OPC UA, para que ruído não seja contado como mudança.
3. **Consolidar Eventstreams:** Por fábrica, e não por fonte, com transformações no Eventhouse [31].
4. **Escalonar a retenção:** Dados quentes no cache do Eventhouse por dias ou semanas, dados mais antigos no armazenamento OneLake.
5. **Dimensionar a capacidade do Fabric com critério:** Monitorar a utilização com o aplicativo Capacity Metrics, separar cargas de desenvolvimento e produção, pausar capacidades que não são necessárias. A pausa está documentada para os SKUs F; ao pausar, os excedentes acumulados são cobrados imediatamente e o conteúdo da capacidade fica indisponível [47]. Uma capacidade que atende um Eventstream ou um painel da fábrica, portanto, não é candidata à pausa.
6. **Escolher o SKU de borda adequado:** Desde a versão 2610, o Azure IoT Operations oferece um SKU Essentials de menor custo para implantações de alto volume, ao lado do Standard, limitado a clusters de nó único e sem o conector OPC UA [3]. Ele se adapta, por exemplo, a locais cujos dados já chegam por MQTT ou HTTP. Verifique por local quais recursos você realmente precisa.
7. **Usar reservas e planos de economia** para recursos do Azure que rodam continuamente.
8. **Alocar custos:** Impor tags de fábrica, centro de custo e caso de uso (Azure Policy).
9. **Introduzir economia unitária:** Reportar o custo de nuvem por unidade produzida ou por máquina conectada. Só assim é possível comparar fábricas.
10. **Desativar o legado:** Migrar serviços que estão sendo descontinuados (IoT Central, IoT Edge 1.5) antes que estruturas paralelas dobrem seus custos.

### Não esqueça os custos de borda

Hardware da fábrica, operações de Kubernetes, licenças para serviços habilitados para Azure Arc e a equipe responsável pelas atualizações devem entrar no mesmo cálculo. Um business case que considera apenas a fatura do Azure subestima sistematicamente o custo total. Este guia deliberadamente não apresenta preços, porque eles mudam com frequência; você encontrará os modelos de preço atuais do Azure IoT Operations (Standard e Essentials), do Azure Arc e do Azure Local nas páginas de preços do Azure e na calculadora de preços do Azure.

---

## Construindo o business case do Azure na manufatura

Declarações genéricas de benefícios de estudos do setor raramente ajudam a aprovar um orçamento, porque não conhecem o seu ponto de partida. Uma lógica de cálculo que você preenche com os seus próprios números é mais robusta.

### Categorias de benefício

| Categoria | Cálculo | Fonte de dados |
|---|---|---|
| Parada não planejada evitada | Horas de parada × margem de contribuição por hora × redução esperada | Histórico de paradas do MES, finanças |
| OEE mais alto | Peças boas adicionais × margem de contribuição por peça | Linha de base do OEE |
| Menores custos de sucata e retrabalho | Quantidade de sucata × custo de fabricação × redução | QMS |
| Tratamento de reclamações mais rápido | Horas por reclamação × taxa horária × redução; escopo de recall menor | Histórico de reclamações |
| Custos de manutenção | Estoque de peças de reposição, serviços de terceiros, horas extras | Manutenção no ERP |
| Conformidade | Esforço evitado para evidências manuais (auditorias, solicitações FSMA 204, avaliações CMMC, DPP) | Equipe de qualidade e conformidade |

### Categorias de custo

- Hardware de borda e operação por planta
- Consumo do Azure e do Fabric (recorrente)
- Licenças (Power BI, Copilot, aplicações industriais, segurança de OT quando necessário)
- Implementação (interna e externa)
- Gestão da mudança e treinamento
- Retrofit de sensores para máquinas mais antigas

### Exemplo trabalhado com números fictícios

Uma linha tem 120 horas de parada não planejada por ano, e a margem de contribuição é de US$ 1.600 por hora. Se o monitoramento de condição e uma resposta mais rápida evitarem 20 por cento dessas horas, são 24 horas × US$ 1.600 = US$ 38.400 por ano. Contra isso estão os custos alocados: hardware de borda e operação, consumo do Fabric, licenças e horas internas. Os números são deliberadamente simples. O que importa é que cada premissa tenha uma fonte dentro da sua empresa (histórico do MES, finanças) e que você meça a redução em relação à linha de base após três a seis meses.

### Regra prática para priorização

Comece pelo caso de uso em que três condições se cumprem: uma linha de base mensurável, dados disponíveis e um dono de processo que queira usar os resultados. Isso costuma ser o OEE em tempo real ou a rastreabilidade, e não a manutenção preditiva.

---

## Roteiro: cinco fases para uma plataforma escalável de manufatura no Azure

O roteiro abaixo segue o padrão comum "fundação e um caso de uso pioneiro primeiro, depois escalar". As durações são orientações para a primeira planta e dependem muito do seu ponto de partida, das aprovações de rede e dos recursos disponíveis.

### Fase 1: Clareza (4 a 8 semanas)

- Portfólio de casos de uso com estimativas de benefício; selecionar um ou dois casos de uso pioneiros
- Estado atual: parque de máquinas, protocolos (o OPC UA está disponível?), rede, sistemas existentes
- Modelo de dados alvo (hierarquia ISA-95, convenção de tópicos UNS)
- Conceito de segurança cobrindo segurança de OT, perfil CSF 2.0, escopo CMMC quando aplicável, privacidade e representantes dos trabalhadores
- Verificação do ciclo de vida de todos os serviços em relação à tabela de status deste guia

### Fase 2: Fundação (6 a 12 semanas)

- Infraestrutura de borda na planta piloto, conexão Arc, Azure IoT Operations
- Estrutura de workspaces do Fabric, planejamento de capacidade, modelo de acesso
- Primeiras máquinas conectadas via OPC UA, ativos no Azure Device Registry
- Noções básicas de FinOps: tags, orçamentos, relatórios de custo por planta

### Fase 3: Primeiro valor (8 a 12 semanas)

- Caso de uso pioneiro em produção, por exemplo OEE em tempo real com captura do motivo de parada em um Power App
- Painel no chão de fábrica e relatório gerencial
- Medição da linha de base e do primeiro impacto

### Fase 4: Aprofundamento (3 a 6 meses)

- Contexto de ERP e MES integrado, histórico de pedidos e genealogia
- Monitoramento de condição, coleta de rótulos para manutenção preditiva
- Primeiros cenários de Copilot sobre dados curados

### Fase 5: Escala (do mês 9 ao 15, conforme o progresso)

- Expansão para mais linhas e plantas com infraestrutura como código e GitOps
- KPIs entre plantas com definições uniformes
- Manutenção preditiva para ativos selecionados, cenários de gêmeos digitais
- Modelo operacional: equipe de plataforma, donos de produtos de dados por domínio, gestão de releases para as versões normalmente mensais do Azure IoT Operations [7]

A mudança fundamental é de prova de conceito para produto mínimo viável: uma PoC prova que a tecnologia funciona. Um MVP prova que as pessoas trabalham melhor com ela. Se quiser ancorar essa mudança em um programa mais amplo de melhoria, veja nossos guias sobre [manufatura enxuta](https://www.m365.fm/en/learn/lean-manufacturing/) e [excelência operacional](https://www.m365.fm/en/learn/operational-excellence/).

---

## Erros comuns em projetos de manufatura no Azure

1. **Tecnologia antes da pergunta:** Construir uma plataforma sem uma unidade de negócio que queira resolver um problema específico.
2. **Preview como base:** Colocar lógica de negócio sobre serviços em preview. A descontinuação das soluções de dados de manufatura e dos agentes de fábrica mostra o risco [2].
3. **Blocos de construção desatualizados de guias antigos:** Planejar novos projetos com IoT Central, Time Series Insights ou IoT Edge 1.5 porque um artigo de 2021 recomenda [8], [10], [12].
4. **SKU errado:** Planejar o Azure IoT Operations Essentials para uma fábrica com máquinas OPC UA, embora o SKU não inclua o conector OPC UA [3].
5. **Ausência de modelo de estados:** Assumir códigos de status específicos de cada máquina sem filtro. Comparações entre plantas tornam-se impossíveis.
6. **Tudo para a nuvem:** Enviar dados brutos em resolução total e se surpreender com a fatura.
7. **Segurança de OT como reflexão tardia:** Colocar um cluster de borda na rede sem um conceito de zonas e deixar aberto o acesso de escrita aos controladores.
8. **Esquecer os rótulos:** Iniciar a manutenção preditiva sem um histórico estruturado de falhas.
9. **KPIs sem definições:** Construir dashboards de OEE antes que as plantas tenham acordado as definições de disponibilidade.
10. **Subestimar a operação:** Releases regulares, atualizações do Kubernetes, rotação de certificados e um buffer do broker que só pode ser configurado na implantação inicial [40], sem que ninguém seja responsável.
11. **Deixar as pessoas para trás:** Os funcionários do chão de fábrica só ficam sabendo do projeto quando o tablet é instalado em sua estação de trabalho.
12. **Ignorar o escopo de conformidade:** Enviar desenhos ou especificações de peças de defesa para um workspace compartilhado do Fabric sem uma decisão de escopo CMMC.

---

## Aplicações setoriais no ecossistema Microsoft

> **Nota: O autor trabalha na iFAKT GmbH.**

Uma plataforma construída sobre o Azure IoT Operations e o Fabric entrega dados, mas não lógica de negócio para planejamento, fluxos de valor ou simulação. Aplicações setoriais disponíveis pelo Microsoft AppSource ou pelo Microsoft Marketplace preenchem essa lacuna.

Um exemplo é o [Polaris](https://www.m365.fm/entity/polaris/), da [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), uma empresa de software com sede em Stuttgart, Alemanha. O fornecedor descreve o Polaris como um software para digitalizar, simular e otimizar a produção, com os módulos VSM/BSM (modelagem de fluxo de valor e de swimlanes), Simulator, Optimizer (planejamento), Operator e Analyzer (análise de KPIs). Segundo o fornecedor, o planejamento é baseado em restrições e considera recursos, qualificações, turnos e buffers; um cockpit de KPIs mostra lead time, estoque, utilização e entrega no prazo. O Polaris VSM aparece como oferta SaaS no Microsoft Marketplace [33]; a Microsoft destacou a iFAKT como parte do seu programa "ISV Success for Business Applications" [32]. Nosso guia sobre o [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) descreve o produto com mais detalhes.

Na arquitetura deste guia, uma aplicação desse tipo fica nas camadas 6 a 8: ela usa dados de processos e de pedidos para modelar fluxos de valor, simular cenários e otimizar planos. Como seria uma integração concreta com a sua plataforma de dados é algo a esclarecer com o fornecedor; este artigo não faz nenhuma afirmação a respeito.

Independentemente do fornecedor, quatro perguntas ajudam na seleção dessas aplicações: a aplicação lê dados em formatos abertos (por exemplo, tabelas Delta no OneLake ou eventos do broker), ou precisa de interfaces próprias? Qual sistema é a fonte de verdade para dados mestres, como roteiros e capacidades? Onde os dados e o processamento são executados (região, tenant)? E como os resultados, como um plano otimizado, voltam ao ERP ou ao MES de forma controlada?

---

## FAQ

### O que é o Azure para manufatura?

O Azure para manufatura é o conjunto de serviços de nuvem e de borda da Microsoft que fabricantes usam para conectar fábricas, armazenar e analisar dados de produção e construir aplicativos de IA e de trabalho sobre eles. Em 2026, o núcleo é o Azure IoT Operations em Kubernetes habilitado para Arc, na fábrica, o Microsoft Fabric como plataforma de dados e o Foundry, o Power BI e o Copilot para análises e IA [3], [17]. A Microsoft empacota sua proposta para o setor como "Microsoft for Manufacturing", que combina Azure, Dynamics 365 e Microsoft 365 [1].

### Qual é a diferença entre Azure IoT Hub e Azure IoT Operations?

O IoT Hub é um serviço em nuvem ao qual os dispositivos individuais se conectam diretamente. O Azure IoT Operations é um plano de dados que roda na fábrica, em Kubernetes habilitado para Arc, e conecta máquinas por meio de OPC UA e outros conectores a um broker MQTT local [3]. Para fábricas com muitas máquinas, o Azure IoT Operations costuma ser o ponto de partida adequado; o IoT Hub se encaixa em dispositivos distribuídos e conectados diretamente. Para as compensações em relação ao IoT Edge, veja [Azure IoT Edge vs Azure IoT Operations: Choosing the Right Industrial Architecture](https://www.m365.fm/community/u/mirko-p/blog/azure-iot-edge-vs-azure-iot-operations/).

### O Azure IoT Central está sendo descontinuado?

Sim. Desde 23 de setembro de 2026, não é mais possível criar novos aplicativos do IoT Central; os aplicativos existentes continuam em funcionamento até 20 de setembro de 2029. A Microsoft recomenda como destino o IoT Hub com o Device Provisioning Service, o Azure Device Registry e o Microsoft Fabric; painéis e análises migram para o Fabric Real-Time Intelligence [8], [64]. Um aviso de descontinuação para 31 de março de 2027 que apareceu no portal do Azure em fevereiro de 2024 foi retirado pela Microsoft na época, como mensagem de sistema errônea [9]. O anúncio de 2026, por outro lado, é um aviso regular com prazo de três anos.

### O que substituiu o Azure Time Series Insights?

O Time Series Insights foi descontinuado em 7 de julho de 2024. A Microsoft indica como destino de migração o Eventhouse do Microsoft Fabric Real-Time Intelligence [10]. Se você não usa o Fabric, o Azure Data Explorer é uma alternativa que também usa KQL [19].

### O que aconteceu com o Microsoft Cloud for Manufacturing?

A oferta para o setor agora se chama "Microsoft for Manufacturing" e reúne recursos do Azure, do Dynamics 365 e do Microsoft 365 [1]. As prévias específicas "Manufacturing data solutions" e "Factory Operations Agent" foram descontinuadas em 30 de maio de 2025, e o "Factory Safety Agent" em 23 de junho de 2025 [2]. Não há aviso separado para "Manufacturing data solutions in Microsoft Fabric"; não o inclua no planejamento de novos projetos.

### Quais serviços do Azure preciso para uma fábrica inteligente?

Para uma conexão típica na fábrica: Azure Arc e um cluster Kubernetes na fábrica, o Azure IoT Operations sobre eles (broker, conector OPC UA, fluxos de dados), o Azure Device Registry para os ativos, o Microsoft Fabric com Eventstream, Eventhouse e Activator para dados em tempo real, e o Power BI para relatórios [3], [17]. Os blocos de IA (Fabric Data Science, Azure Machine Learning, Microsoft Foundry) e os gêmeos digitais vêm depois. Entra ID, Azure Policy, Cost Management e uma solução de segurança de OT formam a estrutura de base.

### Qual é a diferença entre Azure IoT Operations Essentials e Standard?

O Standard oferece o conjunto completo de recursos. O Essentials, disponível desde a versão 2610, é uma opção de menor custo para implantações de alto volume; ele roda apenas em clusters de nó único e não inclui o conector OPC UA [3]. Para fábricas com máquinas OPC UA, o Standard é o ponto de partida.

### Preciso de conhecimento de Kubernetes para o Azure IoT Operations?

Sim, pelo menos para a operação. O Azure IoT Operations roda em clusters Kubernetes habilitados para Arc e é configurado da maneira típica do Kubernetes [3]. Para começar, a Microsoft documenta instalações em Ubuntu e no Windows com AKS Edge Essentials [3]. Planeje o desenvolvimento de competências ou um parceiro de operações.

### A produção continua funcionando se a conexão com a internet cair?

Segundo a Microsoft, o Azure IoT Operations pode operar offline por no máximo 72 horas, possivelmente com degradação, e retoma a funcionalidade completa ao reconectar [3]. Quantas mensagens são armazenadas em buffer nesse período depende da configuração do broker, definida na implantação inicial [40]. As funções de controle nunca devem depender da nuvem; o controle permanece em CLPs e sistemas locais.

### Azure Digital Twins ou digital twin builder no Fabric?

O Azure Digital Twins é um serviço com disponibilidade geral (GA), com modelos DTDL e acesso por API [14]. O digital twin builder faz parte do Fabric Real-Time Intelligence, trabalha com ontologias sobre dados do OneLake e está em prévia (preview) [15]. Para twins de produção, desenvolvidos por equipes técnicas, o Azure Digital Twins é a escolha segura hoje; para twins analíticos em uma plataforma Fabric, vale a pena fazer um piloto com o digital twin builder. Mirko Peters explica uma distinção relacionada, entre o device twin do IoT Hub e o Azure Digital Twins, em [Device Twin vs Azure Digital Twins: Choosing the Right Layer for Industrial IoT](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/).

### Quais dados eu preciso para manutenção preditiva?

Variáveis de condição com uma taxa de amostragem adequada, timestamps sincronizados, contexto operacional (ordem, produto, estado da máquina) e, acima de tudo, um histórico de falhas rotulado pela manutenção. Sem um histórico de falhas, inicialmente só é possível a detecção de anomalias.

### O que significa a descontinuação do Defender for IoT para a segurança do meu OT?

Em 2 de novembro de 2026, a Microsoft anunciou oficialmente que descontinuará totalmente o componente de segurança OT do Defender for IoT em outubro de 2029; até lá, há apenas atualizações de segurança e correções de bugs [22]. Um blog de parceiro da Microsoft cita 31 de maio de 2028 como fim do suporte [39]. Não existe um substituto de primeira parte; a Microsoft oferece conectores para Armis, Dragos e Forescout, cujas soluções são licenciadas separadamente [22]. Planeje a substituição para que esteja concluída até meados de 2028.

### O IoT Edge ainda vale a pena?

O IoT Edge, como produto, continua suportado. A versão 1.5 LTS atingiu o fim do suporte em 10 de novembro de 2026; a versão atual 1.6 LTS é suportada até 14 de novembro de 2028 [12]. Para frotas existentes de dispositivos Linux, a atualização para a 1.6 é o caminho direto. Para dispositivos Windows com EFLOW 1.5, a página de versões não lista um EFLOW 1.6 LTS; esclareça o caminho de destino nessa página. Para novos planos de dados de plantas, avalie o Azure IoT Operations.

### O Azure é compatível com CMMC?

Não existe certificação CMMC para o próprio Azure, porque o CMMC se aplica aos sistemas de um contratado, e não a uma plataforma de nuvem [55]. A Microsoft afirma que o Azure e o Azure Government possuem autorizações FedRAMP High que abrangem o NIST SP 800-171, que é possível obter certificação CMMC para soluções em qualquer uma das nuvens e que a maioria dos contratados do setor de defesa está mais bem alinhada ao Azure Government [55]. A regra do DFARS que incorpora os requisitos do CMMC aos contratos do DoD vem sendo implementada em fases desde 10 de novembro de 2025 [54].

### Qual framework de segurança um fabricante dos EUA deve usar para Azure e OT?

Use-os em conjunto. O NIST CSF 2.0 oferece a estrutura de governança e uma linguagem comum com a gestão, seguradoras e clientes [49]; a ISA/IEC 62443 oferece o modelo técnico para OT (zonas, conduítes, níveis de segurança) [27]; o NIST SP 800-82 Rev. 3 conecta os dois com orientações específicas para OT e sobreposições de controles [50]. Acrescente o CMMC se você lida com FCI ou CUI para o DoD [53], e a NIS2 para unidades na UE [41].

### Quanto custa o Azure para manufatura?

Não existe um número único e confiável. Os custos dependem do número de plantas e máquinas, do volume de dados, da retenção, da capacidade Fabric escolhida, do hardware de borda e das licenças. A alavanca mais importante é a agregação de dados na borda. Use a calculadora de preços do Azure e introduza práticas de FinOps a partir da fase 2 [25].

### Qual é o papel do Microsoft 365 na manufatura?

O Microsoft 365 é a camada de trabalho: Teams para comunicação entre turnos e notificações, Power BI para KPIs, Power Apps para a captura de dados na estação de trabalho e Copilot para resumos e perguntas sobre os dados. Para empresas com um ambiente Microsoft 365 já estabelecido, essa conexão costuma ser o caminho mais rápido para tornar os dados do chão de fábrica utilizáveis.

### Por onde começo como administrador do Microsoft 365 ou do Azure?

Pelas tarefas que já cabem à TI central: funções no Entra ID para a equipe de OT e parceiros, uma landing zone do Azure com políticas de tags por planta, um cluster de teste do Arc, incluindo as aprovações de firewall pela cadeia de proxies, e uma estrutura de workspaces do Fabric. Em paralelo, reúna-se com o responsável por OT para entender o modelo de zonas da planta. Os detalhes estão na seção "Por onde começar como administrador do Microsoft 365 ou do Azure", no início deste guia.

---

## Conclusão

O Azure para manufatura em 2026 é menos uma questão de escolher serviços e mais uma questão de disciplina. A base técnica está clara: Azure IoT Operations on Arc no chão de fábrica, Microsoft Fabric como plataforma de dados, e Foundry, Power BI e Copilot para análise e para o ambiente de trabalho. Ao mesmo tempo, a aposentadoria do Time Series Insights e das prévias de manufatura, e a aposentadoria programada do IoT Central e da segurança de OT no Defender for IoT, mostram que o gerenciamento do ciclo de vida faz parte do trabalho de arquitetura.

Três fatores fazem a diferença: um modelo de dados próprio e neutro em relação a ferramentas, baseado na ISA-95; um projeto de segurança baseado na ISA/IEC 62443 e no NIST CSF 2.0, que também cubra CMMC ou NIS2 onde se aplicarem; e um foco consistente em casos de uso com uma linha de base medida. Se você trabalhar desta forma, constrói uma plataforma que atende manutenção preditiva, rastreabilidade, gêmeos digitais e IA a partir da mesma base de dados, e que sobrevive à próxima mudança de nome da Microsoft.

### Leitura complementar no m365.fm

**Episódios**
- [Manutenção preditiva no Azure: o que você realmente precisa antes do modelo](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/)
- [FinOps para TI de manufatura](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/)
- [Rastreabilidade e genealogia](https://www.m365.fm/show/episodes/traceability-and-genealogy/)
- [Gêmeos digitais no Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/)
- [Mapeamento do fluxo de valor como modelo de dados em tempo real](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Artigos**
- [Gêmeo digital na manufatura: por onde começar](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/)
- [Do ERP ao chão de fábrica: construindo o gêmeo digital](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Planejamento de produção aeroespacial: lead time e rastreabilidade](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)
- [Azure IoT Edge vs Azure IoT Operations: escolhendo a arquitetura industrial certa](https://www.m365.fm/community/u/mirko-p/blog/azure-iot-edge-vs-azure-iot-operations/)
- [Device Twin vs Azure Digital Twins: escolhendo a camada certa para IoT industrial](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/)

**Glossário**
- [Indústria 4.0](https://www.m365.fm/entity/industry-4-0/) · [Gêmeo digital](https://www.m365.fm/entity/digital-twin/) · [ERP](https://www.m365.fm/entity/enterprise-resource-planning/) · [Planejamento e programação avançados](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Manutenção Produtiva Total](https://www.m365.fm/entity/total-productive-maintenance/) · [Indicador-chave de desempenho](https://www.m365.fm/entity/key-performance-indicator/) · [Comissionamento virtual](https://www.m365.fm/entity/virtual-commissioning/)

**Guias relacionados**
- [Gêmeo digital na manufatura](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Programação da produção e APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [KPIs de manufatura](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Gestão do chão de fábrica](https://www.m365.fm/en/learn/shop-floor-management/)
- [Excelência operacional](https://www.m365.fm/en/learn/operational-excellence/)
- [Planejamento de produção aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [Mapeamento do fluxo de valor](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Manufatura enxuta](https://www.m365.fm/en/learn/lean-manufacturing/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** é o apresentador do m365.fm e trabalha na [iFAKT GmbH](https://www.m365.fm/entity/ifakt/). No m365.fm ele escreve sobre a interseção entre planejamento de produção, gêmeos digitais e a nuvem da Microsoft, traduzindo temas de manufatura como fluxos de valor, rastreabilidade e manutenção preditiva para um público de Microsoft 365 e Azure.

**Nota: O autor trabalha na iFAKT GmbH.**

*Última revisão: 20 de novembro de 2026 (verificação de fatos com fontes primárias da Microsoft, NIST, CISA, FDA, SEC, BSI e UE). Próxima revisão da tabela de status dos serviços: fevereiro de 2027.*

# Sources

All sources retrieved on November 20, 2026, unless noted. Sources 1 to 48 are carried over from the German edition; 49 to 64 are new for the US edition.

1. What is Microsoft for Manufacturing? Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/overview
2. What's new in Microsoft for Manufacturing. Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/whats-new
3. What is Azure IoT Operations? Microsoft Learn (last updated November 11, 2026). https://learn.microsoft.com/en-us/azure/iot-operations/overview-iot-operations
4. What is the connector for OPC UA? (Azure IoT Operations). Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector
5. Azure IoT Operations now Generally Available. Microsoft Tech Community (IoT Blog). https://techcommunity.microsoft.com/blog/iotblog/azure-iot-operations-now-generally-available/4282445
6. Azure IoT Operations 2603 is now available: Powering the next era of Physical AI. Microsoft Tech Community (IoT Blog). https://techcommunity.microsoft.com/blog/iotblog/azure-iot-operations-2603-is-now-available-powering-the-next-era-of-physical-ai/4509342
7. Releases: Azure/azure-iot-operations. Microsoft on GitHub. https://github.com/Azure/azure-iot-operations/releases
8. Azure IoT Central is evolving: what you need to know. Microsoft Tech Community (IoT Blog), September 25, 2026. https://techcommunity.microsoft.com/blog/iotblog/azure-iot-central-is-evolving-what-you-need-to-know/4554570
9. Microsoft Confirms Azure IoT Central Commitment. Automation World, February 27, 2024. https://www.automationworld.com/communication/article/33037810/microsoft-confirms-azure-iot-central-commitment
10. Migrating Time Series Insights Gen2 to Real-Time Intelligence in Microsoft Fabric. Microsoft Learn (archived page; newer version at https://learn.microsoft.com/en-us/previous-versions/azure/time-series-insights/migration-to-fabric). https://learn.microsoft.com/en-us/azure/time-series-insights/how-to-tsi-gen2-migration
11. Retirement of Azure Percept DK. Microsoft Learn. https://learn.microsoft.com/en-us/azure/azure-percept/retirement-of-azure-percept-dk
12. Azure IoT Edge versions and release notes. Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-edge/version-history
13. Azure IoT Edge: Microsoft Lifecycle. Microsoft Learn. https://learn.microsoft.com/en-us/lifecycle/products/azure-iot-edge
14. What is Azure Digital Twins? Microsoft Learn. https://learn.microsoft.com/en-us/azure/digital-twins/overview
15. What is digital twin builder (preview)? Microsoft Fabric, Microsoft Learn (last updated May 20, 2026). https://learn.microsoft.com/en-us/fabric/real-time-intelligence/digital-twin-builder/overview
16. Ontology (preview) overview, Fabric IQ. Microsoft Learn (October 16, 2026). https://learn.microsoft.com/en-us/fabric/iq/ontology/overview
17. Connected Factory Reference Architecture. Microsoft Fabric, Microsoft Learn. https://learn.microsoft.com/en-us/fabric/real-time-intelligence/architectures/connected-factory
18. Transform your business with Real-Time Intelligence, now generally available. Microsoft Fabric Updates Blog. https://blog.fabric.microsoft.com/fi-fi/blog/transform-your-business-with-real-time-intelligence-now-generally-available
19. What is Azure Data Explorer? Microsoft Learn (July 23, 2026). https://learn.microsoft.com/en-us/azure/data-explorer/data-explorer-overview
20. What is Microsoft Foundry? Microsoft Learn. https://learn.microsoft.com/azure/foundry/what-is-foundry
21. New name for Azure Stack HCI / Azure Local. Microsoft Learn. https://learn.microsoft.com/en-us/azure/azure-local/rename-to-azure-local
22. Retirement: OT security in Microsoft Defender for IoT. Azure Updates, ID 576255, November 2, 2026. https://azure.microsoft.com/updates?id=576255 (full text via the Release Communications API: https://www.microsoft.com/releasecommunications/api/v2/azure/576255; mirror: https://mc.merill.net/message/AZ576255)
23. What's new in Microsoft Defender for IoT? Microsoft Learn. https://learn.microsoft.com/en-us/azure/defender-for-iot/organizations/whats-new
24. Microsoft Defender now integrates with Dragos, Forescout & Armis for OT Security. Microsoft Tech Community, July 2026. https://techcommunity.microsoft.com/blog/microsoftthreatprotectionblog/microsoft-defender-now-integrates-with-dragos-forescout--armis-for-ot-security/4534936
25. FinOps Framework. Microsoft Learn (Microsoft Cloud FinOps). https://learn.microsoft.com/en-us/cloud-computing/finops/framework/finops-framework
26. ISA-95 Standard. International Society of Automation (ISA). https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard
27. Quick Start Guide: An Overview of ISA/IEC 62443 Standards. ISA Global Cybersecurity Alliance. https://gca.isa.org/hubfs/ISAGCA%20Quick%20Start%20Guide%20FINAL.pdf
28. Cybersicherheitsrecht: NIS-2-Umsetzungsgesetz ab morgen in Kraft (NIS2 implementation act in force tomorrow). BSI press release, December 5, 2025 (German). https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2025/251205_NIS-2-Umsetzungsgesetz_in_Kraft.html; also: Zweiter Schritt zur NIS-2-Registrierung: BSI-Portal ab sofort freigeschaltet (second registration step: BSI portal open). BSI, January 6, 2026 (German). https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2026/260601_NIS2_BSI-Portal.html
29. Digital Product Passport (including the Batteries subpage). European Commission, DG GROW. https://single-market-economy.ec.europa.eu/single-market/digital-product-passport_en and https://single-market-economy.ec.europa.eu/single-market/digital-product-passport/batteries_en
30. Cyber Resilience Act: Reporting obligations. European Commission. https://digital-strategy.ec.europa.eu/en/policies/cra-reporting
31. Smart Manufacturing: Unlocking Real-Time Intelligence With Azure IoT Operations and Microsoft Fabric. b.telligent. https://www.btelligent.com/en/blog/real-time-intelligence-azure-iot-microsoft-fabric
32. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource. Microsoft Tech Community (Marketplace Blog), July 11, 2024. https://techcommunity.microsoft.com/blog/marketplace-blog/learn-about-ifakt-gmbhs-isv-success-for-business-applications-solution-in-micros/4182536
33. Polaris VSM: Digital Value Stream Mapping. Microsoft Marketplace. https://marketplace.microsoft.com/en-us/product/saas/ifaktgmbh.ifakt_vsm_1?tab=overview
34. Microsoft Ignite 2025: Ten Things You Need to Know. Directions on Microsoft, November 18, 2025. https://www.directionsonmicrosoft.com/microsoft-ignite-2025-ten-things-you-need-to-know/
35. OPC 10030: ISA-95 Common Object Model, section 4.2.3 ISA-95. OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3
36. Integration with Azure Device Registry (preview). Azure IoT Hub, Microsoft Learn. https://learn.microsoft.com/en-gb/azure/iot-hub/iot-hub-device-registry-overview
37. What is Azure Machine Learning? Microsoft Learn (includes the notice that prompt flow retires on April 20, 2027). https://learn.microsoft.com/en-us/azure/machine-learning/overview-what-is-azure-machine-learning?view=azureml-api-2
38. Labeling images and text documents. Azure Machine Learning, Microsoft Learn (retirement notice for data labeling, September 30, 2026). https://learn.microsoft.com/en-us/azure/machine-learning/how-to-label-data?view=azureml-api-2
39. November update: What's new in Security for partners. Microsoft Tech Community (Partner News), November 12, 2026. https://techcommunity.microsoft.com/blog/partnernews/november-update-what%E2%80%99s-new-in-security-for-partners/4572658
40. Publish and subscribe MQTT messages using MQTT broker. Azure IoT Operations, Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/manage-mqtt-broker/overview-broker
41. Fragen und Antworten zu NIS-2 (NIS2 FAQ). BSI (German). https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2-regulierte-Unternehmen/NIS-2-FAQ/NIS-2-FAQ-allgemein/FAQ-zu-NIS-2.html; NIS-2-Meldepflicht (NIS2 reporting obligation). BSI (German). https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2-regulierte-Unternehmen/NIS-2-Infopakete/NIS-2-Meldepflicht/NIS-2-Meldepflicht_node.html
42. Cyber Resilience Act. BSI. https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Cyber_Resilience_Act/cyber_resilience_act_node.html
43. OneLake Settings: Modify Immutability Policy. Fabric REST API, Microsoft Learn. https://learn.microsoft.com/en-us/rest/api/fabric/core/onelake-settings/modify-immutability-policy
44. SAP and Microsoft accelerate business insights and AI innovation with SAP Business Data Cloud Connect for Microsoft Fabric. Microsoft Fabric Blog. https://blog.fabric.microsoft.com/en-us/blog/29410
45. Link your Dataverse environment to Microsoft Fabric. Power Apps, Microsoft Learn. https://learn.microsoft.com/en-us/power-apps/maker/data-platform/azure-synapse-link-view-in-fabric
46. Digital Omnibus on AI has been published (Regulation (EU) 2026/1744). Cuatrecasas, July 2026. https://www.cuatrecasas.com/en/spain/intellectual-property/art/digital-omnibus-ai-has-been-published; also European Commission, Advanced Manufacturing Transition Pathway: AI Act Digital Omnibus: high-risk deadlines postponed, machinery carved out. https://transition-pathways.europa.eu/adv-man/legislation/ai-act-digital-omnibus-high-risk-deadlines-postponed-machinery-carved-out
47. Pause and resume your capacity. Microsoft Fabric, Microsoft Learn. https://learn.microsoft.com/en-us/fabric/enterprise/pause-resume
48. SAP DM Shopfloor Integration. DSAG impulsant, May 4, 2026 (guide dated April 2026). https://impulsant.dsag.de/formate/textbeitrag/sap-dm-shopfloor-integration-english/
49. NIST Releases Version 2.0 of Landmark Cybersecurity Framework. NIST news release, February 26, 2024. https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-landmark-cybersecurity-framework
50. NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security. NIST CSRC, September 28, 2023. https://csrc.nist.gov/pubs/sp/800/82/r3/final; news release: https://www.nist.gov/news-events/news/2023/09/guide-operational-technology-ot-security-nist-publishes-sp-800-82-revision
51. NIST IR 8183 Rev. 2 (Initial Public Draft), Cybersecurity Framework 2.0 Manufacturing Profile. NIST CSRC, September 29, 2025. https://csrc.nist.gov/pubs/ir/8183/r2/ipd
52. Critical Manufacturing Sector. Cybersecurity and Infrastructure Security Agency (CISA). https://www.cisa.gov/critical-manufacturing-sector
53. DoD Publishes Final CMMC Program Rule. Greenberg Traurig, October 2024 (summary of 32 CFR Part 170, effective December 16, 2024). https://www.gtlaw.com/en/insights/2024/10/dod-publishes-final-cmmc-program-rule
54. The CMMC DFARS Final Rule Goes Live: Ready or Not, Here It Comes. Squire Patton Boggs, September 2025 (summary of the DFARS rule, effective November 10, 2025). https://www.squirepattonboggs.com/en/insights/publications/2025/09/the-cmmc-dfars-final-rule-goes-live-ready-or-not-here-it-comes
55. Cybersecurity Maturity Model Certification (CMMC). Azure compliance documentation, Microsoft Learn (last updated April 5, 2023). https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-cmmc
56. SEC Adopts Rules on Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure by Public Companies. SEC press release 2023-139, July 26, 2023. https://www.sec.gov/newsroom/press-releases/2023-139
57. CIRCIA final rule at the White House: deadlines set, scope open. Paubox, October 8, 2026 (secondary source on rulemaking status). https://www.paubox.com/blog/circia-final-rule-white-house-deadlines-set-scope-open
58. Cybersecurity Services. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/cybersecurity-services
59. FSMA Final Rule on Requirements for Additional Traceability Records for Certain Foods. U.S. Food and Drug Administration. https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods
60. 21 CFR 11.10, Controls for closed systems. Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11/subpart-B/section-11.10
61. Quality Management System Regulation (QMSR). U.S. Food and Drug Administration. https://www.fda.gov/quality-systems-regulation
62. AS9100 Certification: Aerospace QMS. ANSI blog (ANAB). https://blog.ansi.org/anab/as9100-certification-aerospace-qms/
63. NIST Risk Management Framework Aims to Improve Trustworthiness of Artificial Intelligence. NIST news release, January 26, 2023. https://www.nist.gov/news-events/news/2023/01/nist-risk-management-framework-aims-improve-trustworthiness-artificial
64. AZ569914, Retirement: Azure IoT Central will be retired on September 20, 2029. Azure Updates notice, published September 29, 2026 (via the Message Center mirror mc.merill.net). https://mc.merill.net/message/AZ569914
