# SEO metadata

| Field | Value |
|---|---|
| Meta title | Azure para la fabricación: guía de arquitectura 2026 |
| Meta description | Azure para la fabricación en 2026: estado de servicios, arquitectura de referencia, seguridad OT (IEC 62443, NIST CSF 2.0), trazabilidad, IA y FinOps. |
| Slug | `manufacturing-it-azure` |

# Azure para la fabricación: la guía completa de TI de fabricación en Microsoft Azure (noviembre de 2026)

**Respuesta corta:** A finales de 2026, Azure para la fabricación se reduce a tres capas: Azure IoT Operations sobre Kubernetes habilitado para Azure Arc en la planta, Microsoft Fabric (Real-Time Intelligence y OneLake) como plataforma de datos, y Microsoft Foundry, Power BI y Copilot para analítica, IA y el puesto de trabajo. Los bloques de construcción más antiguos están retirados (Time Series Insights, las versiones preliminares del agente de fabricación) o programados para retirarse (IoT Central en 2029, la seguridad OT de Defender for IoT). El éxito depende menos de los servicios que de tener el control de su modelo de datos, de contar con un diseño de seguridad OT alineado con las directrices ISA/IEC 62443 y NIST, y de elegir casos de uso con una línea base medida.

**Puntos clave**

- Planifique las nuevas conexiones de planta sobre **Azure IoT Operations**, no sobre IoT Central ni sobre cadenas de módulos de IoT Edge desarrolladas a medida. Elija el SKU **Standard** si sus máquinas hablan OPC UA; el SKU Essentials no incluye el conector OPC UA.
- Use **Microsoft Fabric Real-Time Intelligence** (Eventstream, Eventhouse, Activator) para los datos de series temporales. Time Series Insights se retiró el 7 de julio de 2024.
- Mantenga la lógica de negocio alejada de los servicios en versión preliminar. Microsoft retiró en 2025 sus versiones preliminares del modelo de datos de fabricación y del agente de fábrica, aproximadamente un año después de su lanzamiento.
- Planifique ya la sustitución de su **monitorización OT**. Microsoft retirará por completo la seguridad OT de Defender for IoT en octubre de 2029; un blog de un socio de Microsoft cita el 31 de mayo de 2028 como fin del soporte.
- Alinee su programa de seguridad con **ISA/IEC 62443** (zonas y conductos) y **NIST CSF 2.0**; los proveedores de defensa también necesitan **CMMC** para los sistemas que manejan FCI o CUI.
- Empiece por casos de uso que tengan una línea base y un responsable: el OEE en tiempo real y la trazabilidad suelen dar retorno antes que el mantenimiento predictivo.

## Índice

1. [Qué significa hoy Azure para la fabricación](#qué-significa-hoy-azure-para-la-fabricación)
2. [Estado de los servicios de Azure para fabricación, noviembre de 2026](#estado-de-los-servicios-de-azure-para-fabricación-noviembre-de-2026)
3. [Primero el modelo de datos: ISA-95 y el espacio de nombres unificado](#primero-el-modelo-de-datos-isa-95-y-el-espacio-de-nombres-unificado)
4. [Arquitectura de referencia de Azure para fabricación](#arquitectura-de-referencia-de-azure-para-la-fabricación)
5. [Convergencia y seguridad IT/OT: ISA/IEC 62443, NIST CSF 2.0, CMMC y NIS2](#convergencia-itot-y-seguridad)
6. [Caso de uso 1: Mantenimiento predictivo en Azure](#caso-de-uso-1-mantenimiento-predictivo-en-azure)
7. [Caso de uso 2: Trazabilidad y genealogía](#caso-de-uso-2-trazabilidad-y-genealogía)
8. [Caso de uso 3: Gemelos digitales](#caso-de-uso-3-gemelos-digitales)
9. [Caso de uso 4: KPI en tiempo real, OEE y flujos de valor](#caso-de-uso-4-kpi-en-tiempo-real-oee-y-flujos-de-valor)
10. [Integración con ERP y MES: SAP, Dynamics 365 y el flujo de datos en planta](#integración-de-erp-y-mes)
11. [IA y Copilot en la fabricación: qué es realista](#ia-y-copilot-en-la-fabricación)
12. [FinOps para la TI de fabricación](#finops-para-la-ti-de-fabricación)
13. [Elaboración del caso de negocio de Azure en la fabricación](#elaboración-del-caso-de-negocio-para-azure-en-la-fabricación)
14. [Hoja de ruta: cinco fases hacia una plataforma escalable de Azure para fabricación](#hoja-de-ruta-cinco-fases-hacia-una-plataforma-de-fabricación-escalable-en-azure)
15. [Errores comunes en proyectos de Azure para fabricación](#errores-comunes-en-proyectos-de-fabricación-con-azure)
16. [Aplicaciones industriales en el ecosistema Microsoft: el ejemplo de iFAKT Polaris](#aplicaciones-industriales-en-el-ecosistema-de-microsoft)
17. [Preguntas frecuentes](#preguntas-frecuentes)
18. [Conclusión](#conclusión)

---

## Qué significa hoy Azure para la fabricación

Hace cinco años, una búsqueda de "Azure para fabricación" o "Azure IoT para fabricación" devolvía una lista conocida: IoT Hub, IoT Edge, Stream Analytics, Time Series Insights y Synapse. Esa lista ya no describe la situación en 2026. Microsoft ha reconstruido su estrategia de IoT industrial en tres direcciones:

1. **Edge en lugar de dispositivo:** La recopilación de datos en planta se ejecuta ahora sobre **Azure IoT Operations**, un conjunto de servicios de datos sobre clústeres de Kubernetes que se gestionan desde la nube mediante **Azure Arc**. Microsoft describe el servicio como un "plano de datos unificado para el edge" [3]. La disponibilidad general se anunció en noviembre de 2024 [5].
2. **Plataforma de datos en lugar de servicios puntuales:** Las series temporales, los eventos y los datos maestros se almacenan en **Microsoft Fabric**, en particular en Real-Time Intelligence con Eventstream, Eventhouse y Activator. Microsoft retiró Time Series Insights y recomienda a los clientes migrar a Fabric Eventhouse [10].
3. **Plataforma en lugar de aplicación empaquetada:** En IoT y fabricación, Microsoft se aleja de sus propias aplicaciones preconfiguradas. IoT Central dejó de aceptar nuevas aplicaciones el 23 de septiembre de 2026 y se retirará el 20 de septiembre de 2029 [8], [64]. Las previsualizaciones específicas del sector "Manufacturing data solutions" y "Factory Operations Agent" se retiraron el 30 de mayo de 2025 [2].

La oferta para la industria se denomina ahora **Microsoft for Manufacturing** (antes "Microsoft Cloud for Manufacturing"). Microsoft la organiza en cuatro áreas de solución: ingeniería digital, cadenas de suministro resilientes, fábricas inteligentes y clientes conectados [1]. Para la fábrica inteligente, Microsoft nombra cuatro escenarios: modernizar el edge y la infraestructura, optimizar las operaciones con IA, conectar y capacitar a la plantilla, y mantenimiento y calidad [1]. Microsoft señala a Fabric como la plataforma para el "digital thread" [1].

Para usted, como responsable de TI, OT o transformación digital, esto significa que los bloques de construcción se han vuelto más genéricos y que una mayor parte de la responsabilidad sobre el modelo de datos, la integración y las operaciones recae en usted o en sus socios. Esta guía muestra cómo asumir esa responsabilidad de forma estructurada. Relaciona la tecnología de Azure con los temas que determinan el éxito: el modelo de datos, la seguridad, [Industria 4.0](https://www.m365.fm/entity/industry-4-0/) como tema organizativo, los KPI y los costes.

### A quién va dirigida esta guía

- **Responsables de TI y equipos de nube** que ya gestionan Microsoft 365 y Azure y a quienes se ha encargado conectar las plantas.
- **Ingenieros de OT y automatización** que quieren entender qué significan Kubernetes, MQTT y Fabric para sus equipos.
- **Responsables de planta, calidad y mantenimiento** que evalúan casos de uso como el mantenimiento predictivo o la trazabilidad.
- **Equipos de finanzas y compras** que necesitan hacer predecibles los costes de la nube en la fabricación.

### Términos de fabricación para administradores de Microsoft 365 y Azure

Si proviene de la TI corporativa, los proyectos de fabricación traen su propio vocabulario. Estos son los términos clave utilizados en esta guía, cada uno en una frase:

| Término | Significado | Analogía más cercana en TI |
|---|---|---|
| **OT** (tecnología operativa) | Tecnología que controla procesos físicos: máquinas, controladores y sistemas de control | Como un centro de datos separado donde una caída detiene la producción |
| **PLC** (controlador lógico programable) | Computadora industrial que controla una máquina en tiempo real | Un sistema embebido con una vida útil de 15 años o más |
| **SCADA** | Sistema de supervisión para monitorear y operar varias máquinas o líneas | Una consola de monitoreo con acceso de escritura |
| **MES** (sistema de ejecución de manufactura) | Controla y registra la ejecución de órdenes de producción en la planta | Un sistema de flujo de trabajo entre el ERP y la máquina |
| **OPC UA** | Estándar industrial independiente del fabricante para el intercambio de datos, con modelo de información y seguridad integrada | Una API REST más un esquema y certificados, pero para máquinas |
| **MQTT** | Protocolo ligero de publicación/suscripción | Un bus de mensajes, similar a los temas de Event Grid o Service Bus |
| **Espacio de nombres unificado (UNS)** | Estructura central y jerárquica de eventos en la que todos los sistemas publican su estado actual | Un directorio de temas de toda la empresa |
| **OEE** (eficacia global del equipo) | Eficacia del equipo a partir de disponibilidad, rendimiento y calidad | Un SLA de disponibilidad, pero para máquinas e incluyendo calidad |
| **KQL** (Kusto Query Language) | Lenguaje de consulta de Fabric Eventhouse y Azure Data Explorer | El mismo lenguaje que usa en Log Analytics y Microsoft Sentinel |
| **Modelo de Purdue** | Modelo de referencia que organiza en capas los sistemas de la planta, desde los dispositivos de campo hasta la empresa; ISA-95 se basa en él [26] | Un modelo de segmentación de red, desde la VLAN de dispositivos hasta la WAN corporativa |

La fila de KQL es un buen punto de partida para los administradores: si conoce KQL de Sentinel o Log Analytics, puede consultar datos de máquinas en un Eventhouse de inmediato.

### Por dónde empezar como administrador de Microsoft 365 o Azure

No necesita convertirse en ingeniero de automatización para aportar valor en un proyecto de manufactura. Cinco tareas suelen recaer en la TI central y pueden prepararse antes de conectar la primera máquina:

1. **Identidades y roles:** Cree grupos en Microsoft Entra ID y roles de Azure RBAC para el personal de OT, los socios y los equipos de operaciones; use Privileged Identity Management para que el acceso privilegiado tenga duración limitada.
2. **Una zona de aterrizaje de Azure para las plantas:** Defina una estructura de suscripciones y grupos de recursos por planta, y use Azure Policy para exigir etiquetas (planta, centro de costos, caso de uso) y regiones permitidas.
3. **Pruebe Azure Arc:** Conecte un servidor de prueba o un clúster de Kubernetes a Arc y consiga que su equipo de red apruebe los endpoints de salida necesarios a través de la cadena de proxy. En muchas empresas, estas aprobaciones de firewall son lo que más tiempo lleva.
4. **Fundamentos de Fabric:** Decida la capacidad, la estructura de áreas de trabajo y el modelo de acceso; traslade la gobernanza de Power BI existente.
5. **Establezca una relación de trabajo con OT:** Comprenda el modelo de zonas de la planta antes de proponer cambios de red. En OT, la disponibilidad va antes que la confidencialidad, y las ventanas de mantenimiento siguen la programación de producción, no el Patch Tuesday.

---

## Estado de los servicios de Azure para fabricación, noviembre de 2026

Microsoft cambia el nombre de sus servicios, lanza versiones preliminares y luego las retira. En proyectos de fabricación con una vida útil de cinco a diez años, el ciclo de vida del producto es, por tanto, un criterio de arquitectura. La tabla siguiente resume el estado verificado a 20 de noviembre de 2026.

### Visión general de los servicios: finalidad, estado, fuente

| Servicio | Finalidad en la fabricación | Estado, noviembre de 2026 | Fuente |
|---|---|---|---|
| **Azure IoT Operations** | Plano de datos en el borde: broker MQTT, conectores (OPC UA, HTTP/REST), flujos de datos, gestión de activos | Disponibilidad general desde noviembre de 2024; versiones periódicas. Microsoft Learn indica que la versión 1.5.x (versión 2610) es la que introduce un nuevo SKU, **Essentials** (solo clústeres de un nodo, sin conector OPC UA), junto a **Standard** con el conjunto completo de funciones | [3], [5], [7] |
| **Azure Device Registry** | Representación en la nube de activos y dispositivos, registro de esquemas | Parte integral de Azure IoT Operations; integración con IoT Hub en vista previa | [3], [36] |
| **Azure IoT Hub** + Device Provisioning Service | Pasarela en la nube para dispositivos conectados directamente, ciclo de vida de los dispositivos | Activo; Microsoft lo recomienda como destino para los clientes de IoT Central | [8], [64] |
| **Azure IoT Central** | SaaS de IoT de bajo código | Sin nuevas aplicaciones desde el 23 de septiembre de 2026; retirada el 20 de septiembre de 2029 | [8], [64] |
| **Azure IoT Edge** | Entorno de ejecución de contenedores para dispositivos de borde (módulos) | Producto compatible; la versión 1.5 LTS dejó de tener soporte el 10 de noviembre de 2026 (al igual que EFLOW 1.5 para Windows); la versión actual 1.6 LTS (julio de 2026) tiene soporte hasta el 14 de noviembre de 2028; no figura ninguna EFLOW 1.6 LTS en la página de versiones (solo una línea de versiones continuas de EFLOW) | [12], [13] |
| **Microsoft Fabric Real-Time Intelligence** (Eventstream, Eventhouse, Activator, Real-Time hub) | Ingesta en streaming, analítica de series temporales con KQL, alertas | Disponibilidad general desde Ignite, noviembre de 2024 | [18] |
| **Microsoft Fabric OneLake / Lakehouse** | Almacenamiento central para datos maestros, transaccionales y de sensores | Disponibilidad general | [17] |
| **Digital twin builder** (Fabric Real-Time Intelligence) | Representaciones digitales basadas en ontologías de activos y procesos | Vista previa | [15] |
| **Fabric IQ ontology** | Capa semántica de negocio para analítica y agentes | Vista previa; la antigua experiencia de ontologías se retira el 31 de enero de 2027, y las ontologías existentes deben copiarse a la nueva experiencia | [16] |
| **Azure Digital Twins** | Gemelos basados en grafos con DTDL | Activo, sin aviso de retirada en la página de descripción general; 3D Scenes Studio en vista previa | [14] |
| **Azure Data Explorer** | Base de datos de series temporales con KQL fuera de Fabric | Activo, sin aviso de retirada; usa KQL como Fabric Eventhouse | [19] |
| **Microsoft Foundry** (antes Azure AI Foundry / Azure AI Studio) | Modelos, agentes y herramientas para aplicaciones de IA | Activo; los "Azure AI Services" pasan a llamarse "Foundry Tools"; prompt flow se retira el 20 de abril de 2027 | [20], [34], [37] |
| **Azure Machine Learning** | Entrenamiento, despliegue y MLOps para modelos de ML clásico | Activo; Microsoft sitúa Foundry para IA generativa y Azure ML para ML clásico y MLOps. El etiquetado de datos integrado se retiró el 30 de septiembre de 2026 | [37], [38] |
| **Azure Arc** | Gestión de Kubernetes y servidores fuera de Azure | Activo; base de Azure IoT Operations | [3] |
| **Azure Local** (antes Azure Stack HCI) | Infraestructura hiperconvergente en la planta | Activo; cambió de nombre en noviembre de 2024 | [21] |
| **Microsoft Defender for IoT (seguridad OT)** | Monitorización pasiva de redes OT, inventario de activos, detección de anomalías | Retirada anunciada oficialmente el 2 de noviembre de 2026; retirada completa en octubre de 2029; hasta entonces solo actualizaciones de seguridad y correcciones de errores, sin nuevas funciones OT. Un blog de un socio de Microsoft cita el 31 de mayo de 2028 como fin del soporte. Conectores para Armis, Dragos y Forescout | [22], [24], [39] |
| **Azure Time Series Insights** | Explorador de series temporales (heredado) | Retirado el 7 de julio de 2024; Microsoft indica Fabric Eventhouse como destino de migración | [10] |
| **Azure Percept** | Kit de desarrollo de IA en el borde | Retirado el 30 de marzo de 2023 | [11] |
| **Manufacturing data solutions** (Azure) y **Factory Operations Agent** (Azure AI y Copilot Studio) | Modelo de datos de fabricación y copiloto de fabricación (vistas previas) | Retirados a partir del 30 de mayo de 2025 (anunciados en febrero de 2025) | [2] |
| **Factory Safety Agent** (Copilot Studio) | Agente de seguridad laboral (vista previa) | Retirado a partir del 23 de junio de 2025 | [2] |
| **Manufacturing data solutions in Microsoft Fabric** | Modelo de datos de fabricación en Fabric (vista previa desde abril de 2024) | Estado poco claro: los avisos de retirada mencionan "Manufacturing data solutions" sin el sufijo de Fabric y no incluyen ni excluyen la variante de Fabric; no hay ninguna entrada separada desde abril de 2024. No lo planifique en proyectos nuevos; consulte a Microsoft sobre su estado. | [2] |

### Qué significa la tabla para su arquitectura

**Primero:** Planifique las nuevas conexiones de planta sobre Azure IoT Operations, no sobre IoT Central ni sobre sus propias cadenas de módulos de IoT Edge, salvo que tenga una razón específica. IoT Edge sigue siendo compatible, pero es un modelo de runtime de dispositivo; Azure IoT Operations aborda el plano de datos de la planta con un broker, conectores y un modelo de activos [3]. Al elegir el SKU, tenga en cuenta que Essentials no incluye el conector OPC UA [3]. Para una planta típica con máquinas OPC UA, Standard es el punto de partida.

**Segundo:** Mantenga la lógica de negocio alejada de los servicios en preview. La historia de las soluciones de datos de fabricación de Microsoft muestra que un modelo de datos de fabricación puede pasar de preview a retirada en algo más de un año [2]. Su modelo de datos le pertenece y debe documentarse en formatos abiertos (tablas Delta en OneLake, esquemas JSON en el broker, modelos de información DTDL u OPC UA).

**Tercero:** Revise su estrategia de seguridad OT. El aviso oficial de Azure señala octubre de 2029 como fin de la seguridad OT en Defender for IoT, mientras que un blog de un socio de Microsoft indica el 31 de mayo de 2028 como fin del soporte [22], [39]. Planifique con la fecha más temprana: la compra, el despliegue y la aceptación de nuevos sensores suelen requerir más de un año en entornos regulados.

**Cuarto:** Revise su flota de IoT Edge. Los dispositivos con IoT Edge 1.5 no han recibido actualizaciones de seguridad desde el 10 de noviembre de 2026. Microsoft describe el paso a 1.6 LTS como sencillo, porque no contiene cambios funcionales importantes [12]. El mismo fin de soporte se aplica a los dispositivos Windows que ejecutan IoT Edge para Linux en Windows (EFLOW) 1.5; la página de versiones no enumera ningún EFLOW 1.6 LTS, solo una vía de publicación continua [12]. Aclare la ruta de destino para estos dispositivos con Microsoft o con su proveedor de hardware.

> **Nota sobre la vigencia:** Esta tabla es una instantánea. Antes de cada decisión de arquitectura, consulte las páginas de Microsoft enlazadas y el portal Azure Updates filtrado por "Retirements".

---

## Primero el modelo de datos: ISA-95 y el espacio de nombres unificado

Muchos proyectos de fabricación fracasan no por la nube, sino porque nadie definió qué es una "máquina", una "orden" o un "evento de parada" en el modelo de datos. Responda a esa pregunta antes de desplegar el primer servicio de Azure.

### ISA-95 y la pirámide de automatización

La serie **ANSI/ISA-95** (internacionalmente IEC 62264) describe la integración de los sistemas empresariales y de control [26]. ISA la describe como un conjunto de normas para integrar los sistemas logísticos con los sistemas de control de fabricación, basado en el modelo de referencia Purdue y aplicable a las industrias discretas, continuas y logísticas; la serie consta de ocho partes [26]. Ofrece dos elementos útiles para cualquier arquitectura en la nube:

- **Un modelo de niveles:** Los niveles 0 a 2 abarcan el proceso físico, sensores, actuadores y control (PLC, SCADA). El nivel 3 es la gestión de operaciones de fabricación (MES, MOM). El nivel 4 es la planificación empresarial ([ERP](https://www.m365.fm/entity/enterprise-resource-planning/)). En Europa esta jerarquía suele representarse como la "pirámide de automatización"; en Norteamérica, el modelo Purdue es la representación más habitual.
- **Un modelo de objetos:** ISA-95 define términos como la jerarquía de equipos (empresa, sitio, área, centro de trabajo, unidad de trabajo), material, personal, órdenes de producción y datos de rendimiento. La OPC Foundation ha trasladado este modelo a su propia especificación complementaria para OPC UA [35].

La crítica a la pirámide es bien conocida: los datos solo se mueven de nivel en nivel, cada interfaz es una integración punto a punto y una nueva aplicación tiene que conectarse con varios sistemas. El modelo de objetos, en cambio, sigue siendo valioso porque ofrece a TI, OT y al negocio un lenguaje común.

### Espacio de nombres unificado: eventos en lugar de la pirámide

El **espacio de nombres unificado (UNS)** es un patrón de arquitectura, no una norma. Todos los sistemas publican su estado actual como eventos en un broker central con estructura jerárquica, normalmente MQTT. Los consumidores se suscriben a los temas que necesitan. La jerarquía de temas suele seguir la jerarquía de equipos de ISA-95, por ejemplo:

```
acme/dayton-plant/assembly/line-3/station-20/state
acme/dayton-plant/assembly/line-3/station-20/order
acme/dayton-plant/assembly/line-3/station-20/quality
```

Azure IoT Operations incluye un broker MQTT nativo del edge que admite MQTT 3.1.1 y MQTT 5 [40]. El conector OPC UA publica datos de los servidores OPC UA como JSON en formato OPC UA PubSub hacia los topics del broker, y también puede escribir valores de vuelta en los nodos OPC UA; las solicitudes de escritura usan el patrón de solicitud/respuesta de MQTT 5 [4]. Eso permite construir un UNS en la planta sin ejecutar un broker independiente.

Si ya ejecuta un UNS sobre otro broker, no tiene que reemplazarlo: los flujos de datos pueden reenviar mensajes a brokers MQTT externos [3]. Usar el broker de Microsoft como UNS de la planta o como alimentador de un broker existente es una decisión operativa. Lo que importa es una convención de topics y payloads vinculante, independiente del producto.

### ¿ISA-95 o UNS? Ambos.

La respuesta productiva es: use **ISA-95 como vocabulario** y **el UNS como patrón de transporte**. En la práctica:

| Pregunta | Recomendación |
|---|---|
| ¿Cómo nombro los activos? | Jerarquía de equipos ISA-95, coherente en toda la empresa |
| ¿Cómo estructuro los topics? | Por la jerarquía de equipos, con dominios de negocio debajo (estado, orden, calidad, energía) |
| ¿Cómo describo los payloads? | Esquemas JSON en el registro de esquemas de Azure Device Registry [3]; para máquinas, prefiera las especificaciones companion de OPC UA |
| ¿Dónde viven los datos maestros? | En el sistema de registro (ERP, MES, PLM); el UNS solo distribuye referencias y estados |
| ¿Cómo gestiono el histórico? | No en el broker, sino en el Eventhouse o el Lakehouse de Fabric |

### El modelo de datos mínimo de fabricación

Independientemente de las herramientas, los casos de uso de esta guía necesitan un modelo básico con siete entidades:

1. **Activo** (máquina, estación, herramienta) con un ID único y una posición en la jerarquía
2. **Señal** (tag, variable medida) con unidad, frecuencia de muestreo y un vínculo al activo
3. **Estado** (en marcha, parada planificada, parada no planificada, cambio de formato) con un código de motivo
4. **Orden** (orden de producción, operación) con un vínculo al ERP
5. **Material y número de lote/serie** con un vínculo a la lista de materiales
6. **Evento** (alarma, hallazgo de calidad, mantenimiento)
7. **Persona/turno**, en la medida en que lo permitan las normas de privacidad y los convenios laborales

Si vincula estas siete entidades de forma limpia, puede dar servicio a OEE, mantenimiento predictivo, trazabilidad y un gemelo digital a partir de la misma base de datos. Explicamos cómo derivar un modelo de este tipo a partir de una cadena de valor en el episodio [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/); el método en sí se trata en nuestra guía sobre [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

---

## Arquitectura de referencia de Azure para la fabricación

La arquitectura de referencia que se muestra a continuación resume lo que Microsoft describe en la documentación de Azure IoT Operations [3] y en la arquitectura de referencia de Fabric "Connected Factory" [17], y añade las capas que esas fuentes no cubren: seguridad, datos maestros y el puesto de trabajo.

### Modelo por capas

| Capa | Función | Componentes de Azure y Microsoft | Decisiones típicas |
|---|---|---|---|
| **0: Campo y control** | Máquinas, PLC, sensores, bancos de prueba, cámaras | Ningún componente de Azure; servidor OPC UA en el controlador o en una pasarela; sensores de retroadaptación donde sea necesario | ¿Qué máquinas hablan OPC UA? ¿Dónde hace falta retroadaptación? |
| **1: Infraestructura de borde** | Cómputo en planta, segmentación de red | PC industriales o servidores con Kubernetes (por ejemplo, AKS Edge Essentials en Windows, clústeres basados en Ubuntu) [3], o Azure Local [21]; gestionados mediante Azure Arc | ¿Clúster de un solo nodo o de varios nodos? ¿Quién opera el hardware? Nota: la SKU Essentials se limita a un solo nodo [3] |
| **2: Plano de datos de borde** | Recopilación, normalización, almacenamiento en búfer, UNS local | Azure IoT Operations: broker MQTT, conector OPC UA, conector HTTP/REST (conectores Akri), flujos de datos, experiencia de operaciones, descubrimiento automático de dispositivos y activos [3], [4] | Estructura de temas, esquemas, agregación en el borde, búfer en disco del broker, comportamiento sin conexión (máximo 72 horas, posiblemente degradado [3]) |
| **3: Gestión de activos y dispositivos** | ¿Qué activo es cuál? ¿Qué puntos de datos? | Azure Device Registry con espacios de nombres y registro de esquemas [3]; para dispositivos conectados directamente, IoT Hub y DPS [8] | ¿Quién mantiene los datos maestros de activos? ¿Conciliación con el sistema de mantenimiento (CMMS)? |
| **4: Streaming y analítica en tiempo real** | Ingerir eventos, enriquecerlos, generar alertas | Fabric Real-Time Intelligence: Eventstream, Eventhouse (KQL), Activator, Real-Time Dashboards [17], [18]; alternativamente Azure Event Hubs y Azure Data Explorer [19] | ¿Capacidad de Fabric o PaaS de Azure? ¿Retención caliente/fría? |
| **5: Plataforma de datos** | Historial, datos de contexto, productos de datos | OneLake, Lakehouse, Data Factory para datos de ERP, MES y turnos [17] | Estructura medallion, propiedad de los productos de datos, modelo de acceso |
| **6: Semántica y gemelo** | Significado, relaciones, ontología | Ontología de Fabric IQ (vista previa) [16], Digital twin builder (vista previa) [15] o Azure Digital Twins con DTDL [14] | ¿Es aceptable una vista previa? Mantener la propiedad del modelo |
| **7: Analítica e IA** | Modelos, previsiones, agentes | Fabric Data Science [17], Azure Machine Learning, Microsoft Foundry [20] | ¿Dónde entrenar y dónde ejecutar la inferencia (nube o borde)? |
| **8: Puesto de trabajo y procesos** | Informar a las personas y permitirles actuar | Power BI, Teams (incluidos escenarios para personal de primera línea), Power Apps, Power Automate, Microsoft 365 Copilot, Dynamics 365 | ¿Qué rol ve qué? ¿Uso móvil en el taller? |
| **Transversal: seguridad y gobierno** | Identidades, red, monitorización, cumplimiento | Microsoft Entra ID, Azure Policy, portafolio de Microsoft Defender, Microsoft Purview, sensores OT (Defender for IoT solo como transición, soluciones de socios) [22] | Modelo de zonas según ISA/IEC 62443, perfil NIST CSF 2.0, rutas de notificación de incidentes |
| **Transversal: coste** | Transparencia, asignación, optimización | Microsoft Cost Management, métricas de capacidad de Fabric, prácticas FinOps [25] | Coste por planta, línea, caso de uso |

### Flujo de datos en diez pasos

1. El controlador expone los valores de proceso mediante un servidor OPC UA.
2. El conector OPC UA de Azure IoT Operations lee los puntos de datos configurados de un activo y los publica en un tema del broker, por ejemplo `azure-iot-operations/data/<asset>` [4].
3. El conector puede descubrir automáticamente activos en servidores OPC UA y añadir su configuración a Azure Device Registry [4].
4. Los flujos de datos filtran, normalizan, convierten unidades y enriquecen con contexto [3], [31].
5. Las aplicaciones locales (por ejemplo, un tablero andon o una inspección en línea) se suscriben directamente al broker.
6. Un flujo de datos reenvía los datos agregados a un endpoint en la nube: Event Hubs/Kafka, el broker MQTT de Event Grid, Data Lake Storage, Fabric OneLake o Azure Data Explorer [3].
7. En Fabric, un Eventstream ingiere los datos y el Eventhouse los almacena para consultas KQL [17].
8. Data Factory sincroniza datos de ERP, MES, turnos y costes con OneLake [17].
9. Los eventos se enriquecen con la jerarquía de activos y la topología de líneas; los modelos se entrenan y puntúan, y los resultados se almacenan en OneLake [17].
10. Real-Time Dashboards y Power BI visualizan, Activator notifica a los técnicos y Copilot responde preguntas en lenguaje natural [17].

Microsoft dimensiona la referencia de Connected Factory en más de un millón de eventos IIoT por hora a partir de 30.000 tags en 40 fábricas [17]. Tómelo como orientación, no como garantía de rendimiento para su entorno.

### Lecciones de proyectos

La consultora b.telligent describe tres lecciones de proyectos con Azure IoT Operations y Fabric [31]:

- **Configurar el almacenamiento del broker:** sin almacenamiento persistente configurado, los mensajes que no pueden reenviarse pueden llenar la memoria. Microsoft confirma el punto de forma indirecta: el búfer de mensajes del broker respaldado en disco solo puede configurarse durante el despliegue inicial, no después [40]. Decida el perfil de memoria y el búfer antes de la puesta en marcha.
- **Mantener estables los esquemas:** los cambios en las estructuras JSON hacen frágil el procesamiento posterior. Un envelope uniforme con metadatos y payload ayuda.
- **Consolidar los Eventstreams:** como cada Eventstream conlleva costes de funcionamiento, la publicación recomienda consolidar por planta en lugar de por fuente, y realizar las transformaciones en el Eventhouse con políticas de actualización y KQL en lugar de hacerlo en el Eventstream.

Estos consejos proceden de una publicación de marzo de 2025 (actualizada en junio de 2025); compruebe si siguen siendo válidos en su versión.

### Rutas alternativas

No todos los fabricantes necesitan la arquitectura completa. Son habituales cuatro variantes:

| Variante | Cuándo tiene sentido | Bloques de construcción |
|---|---|---|
| **Directa a la nube** | Pocos dispositivos modernos y conectados; sin requisitos de latencia | IoT Hub, DPS, Fabric Real-Time Intelligence |
| **Centrada en el edge** | Muchas máquinas, OPC UA, decisiones locales, red OT sin conexión directa a la nube | Azure IoT Operations en Arc, Fabric |
| **Edge de partner** | Plataforma edge industrial existente de un proveedor de automatización | Plataforma del partner más Fabric o Azure; Microsoft cita, por ejemplo, la ejecución de modelos de Azure AI en Siemens Industrial Edge como orientación de arquitectura [2] |
| **Inicio reducido (fabricante mediano, una planta)** | Unas pocas líneas, sin equipo propio de Kubernetes, primer caso de uso OEE o monitorización de condición | Un clúster de nodo único con Azure IoT Operations Standard (por OPC UA), una capacidad pequeña de Fabric, Power BI; la operación del clúster posiblemente a través de un partner |

Para un fabricante mediano con una planta, la arquitectura completa por capas es una imagen objetivo, no un punto de partida. Empiece con las capas 1, 2, 4 y 8, y añada semántica, IA y gobernanza entre plantas una vez que el primer caso de uso aporte resultados.

---

## Convergencia IT/OT y seguridad

Una vez que los datos de las máquinas fluyen hacia la nube, la planta forma parte de su superficie de ataque. Al mismo tiempo, aumentan los requisitos regulatorios y de los clientes. CISA incluye la fabricación de metales primarios, maquinaria, equipos eléctricos y componentes, y equipos de transporte como núcleo del **Sector de Fabricación Crítica** de EE. UU. [52], por lo que muchas plantas que envían datos a Azure pertenecen a un sector de infraestructura crítica.

Esta sección comienza con las normas que dan forma al diseño técnico (ISA/IEC 62443, NIST CSF 2.0, NIST SP 800-82), continúa con las obligaciones que aplican a grupos específicos de fabricantes (CMMC, SEC, CIRCIA) y, para empresas con operaciones en la UE o clientes en la UE, con NIS2 y la Ley de Ciberresiliencia.

### ISA/IEC 62443: zonas, conductos, niveles de seguridad

La serie **ISA/IEC 62443** es el marco de referencia para la seguridad de los sistemas de automatización y control industrial. Sus conceptos centrales son las zonas (grupos de activos con las mismas necesidades de protección), los conductos (rutas de comunicación controladas entre zonas) y los niveles de seguridad como objetivo por zona, desde SL 1 (protección contra violaciones casuales o accidentales) hasta SL 4 (protección contra atacantes sofisticados con recursos amplios) [27]. La norma también define siete requisitos fundamentales, desde el control de identificación y autenticación hasta la disponibilidad de recursos [27]. Para una arquitectura en Azure, esto significa:

- **El clúster de borde es una zona propia:** El clúster de Kubernetes que ejecuta Azure IoT Operations no pertenece ni a la red de oficinas ni directamente a la red de control, sino a una zona intermedia (a menudo llamada "DMZ industrial", nivel 3.5 de Purdue).
- **Solo conexiones salientes:** Arc y los flujos de datos abren conexiones desde la planta hacia la nube. No se necesitan conexiones entrantes desde internet hacia la planta y no deben abrirse.
- **Redes en capas:** Microsoft indica que Azure IoT Operations admite la gestión segura de dispositivos en redes en capas [3]. Planifique la cadena de proxy y cortafuegos desde el principio junto con la seguridad OT.
- **Conceda el acceso de escritura de forma deliberada:** El conector OPC UA puede escribir valores de vuelta en los controladores [4]. Esta capacidad requiere su propia evaluación de riesgos y proceso de aprobación, e idealmente debe empezar deshabilitada.
- **Certificados en lugar de contraseñas:** Para OPC UA están disponibles usuario/contraseña, certificados X.509 y acceso anónimo (solo para pruebas) [4]. Utilice certificados y una lista de confianza, y trate la renovación de certificados como un proceso operativo recurrente.

### NIST CSF 2.0 y NIST SP 800-82: la base de EE. UU.

Para la mayoría de los fabricantes estadounidenses, el **Marco de Ciberseguridad (CSF) 2.0 del NIST** es el lenguaje común entre la planta, TI y el consejo de administración. El NIST lo publicó el 26 de febrero de 2024; amplía las cinco funciones Identificar, Proteger, Detectar, Responder y Recuperar con una nueva función **Gobernar** y se aplica a organizaciones de cualquier sector y tamaño [49]. El marco es voluntario, pero los clientes, aseguradoras y auditores piden cada vez más un perfil CSF.

Dos documentos del NIST concretan el marco para las plantas:

- **NIST SP 800-82 Rev. 3, Guía de seguridad de la tecnología operativa (OT)** (septiembre de 2023) cubre arquitecturas OT, amenazas y contramedidas, y añade un complemento OT con líneas base de controles SP 800-53 adaptadas para sistemas OT de impacto bajo, moderado y alto [50].
- **NIST IR 8183 Rev. 2, Perfil de fabricación del Marco de Ciberseguridad 2.0**, se publicó como borrador inicial para comentarios público el 29 de septiembre de 2025; el periodo de comentarios cerró el 17 de noviembre de 2025 y, a noviembre de 2026, no figura ninguna versión final [51]. Utilícelo como referencia de borrador, no como norma final.

Cómo encajan las piezas en un proyecto de Azure:

| Función de CSF 2.0 | Qué significa para la plataforma de fabricación en Azure |
|---|---|
| Govern | Responsables nombrados para la plataforma de planta, aceptación de riesgos para los servicios en vista previa, lista de proveedores (Microsoft, integrador, proveedores de OT) |
| Identify | Inventario de activos de OT conciliado con Azure Device Registry; mapa de flujos de datos por zona y conducto |
| Protect | Roles de Entra ID con mínimo privilegio, PIM, certificados OPC UA, conectividad solo saliente, acceso de escritura deshabilitado por defecto |
| Detect | Monitorización de la red OT (solución de partner tras Defender for IoT), registros centralizados del edge y de la nube en Sentinel o en su SIEM |
| Respond | Manual de respuesta a incidentes que cubra planta y nube, incluido quién puede desconectar un clúster durante la producción |
| Recover | Redespliegue del clúster de edge probado (infraestructura como código), copia de seguridad de la configuración del broker y de los activos |

Los fabricantes pequeños y medianos no tienen que hacer esto solos: la Red Nacional de la Manufacturing Extension Partnership (MEP) del NIST ofrece autoevaluaciones basadas en CSF, análisis de brechas, planes de acción correctiva, planes de respuesta a incidentes y ayuda con los requisitos de DFARS [58].

### CMMC para proveedores de defensa

Si fabrica piezas o presta servicios para el Departamento de Defensa de EE. UU., se aplica el **Modelo de Madurez de Certificación de Ciberseguridad (CMMC)** a los sistemas que procesan, almacenan o transmiten Información Contractual Federal (FCI) o Información No Clasificada Controlada (CUI). La norma del programa (32 CFR Parte 170) entró en vigor el 16 de diciembre de 2024 [53]. La norma DFARS que incorpora CMMC a los contratos entró en vigor el 10 de noviembre de 2025, con un despliegue por fases: la fase 1 comenzó en esa fecha, la fase 2 el 10 de noviembre de 2026, y la fase 3 está prevista para el 10 de noviembre de 2027 [54]. Los niveles son el Nivel 1 (autoevaluación, FCI), el Nivel 2 (autoevaluación o evaluación por tercero C3PAO, basada en NIST SP 800-171) y el Nivel 3 (evaluación DIBCAC, que añade las prácticas de NIST SP 800-172) [53], [54].

Qué significa esto para Azure:

- **Defina el alcance de los datos, no de la nube.** CMMC se aplica a sus sistemas, no a Azure como plataforma; no existe un certificado CMMC para Azure en sí [55]. Los datos de telemetría de máquinas sin más pueden no ser CUI, mientras que los planos, las especificaciones y algunos parámetros de proceso de piezas de defensa sí pueden serlo; deciden las marcas CUI y las cláusulas contractuales de su cliente. Decida qué datos del UNS y de OneLake están dentro del alcance.
- **Elija el entorno de nube de forma deliberada.** Microsoft indica que tanto Azure comercial como Azure Government cuentan con autorizaciones FedRAMP High que cubren NIST SP 800-171, y que puede obtener la certificación CMMC para soluciones en cualquiera de los dos; Azure Government añade autorizaciones DoD IL4/IL5 y compromisos contractuales sobre el almacenamiento de datos en EE. UU. y personal estadounidense examinado, y Microsoft lo considera la mejor opción para la mayoría de contratistas de defensa [55]. Tenga en cuenta que la página de CMMC de Microsoft se actualizó por última vez en abril de 2023, así que compruebe los detalles con su equipo de cuenta de Microsoft.
- **Compruebe la disponibilidad de funciones.** No todos los servicios de esta guía están disponibles en Azure Government ni en el entorno Microsoft 365 GCC High. Verifique la disponibilidad de Azure IoT Operations, Fabric y Copilot para su nube de destino antes de diseñar sobre ellos [unverified: la disponibilidad de cada servicio individual; consulte las páginas de disponibilidad de funciones de Microsoft para el gobierno de EE. UU.].

### Notificación de la SEC e incidentes CIRCIA

Dos regímenes de notificación de EE. UU. afectan al modo en que diseña el registro y la respuesta a incidentes de la plataforma de planta:

- **Empresas que cotizan en bolsa:** Según las normas de la SEC aprobadas el 26 de julio de 2023, los emisores deben divulgar un incidente de ciberseguridad significativo en el Formulario 8-K (Punto 1.05) en un plazo de cuatro días hábiles después de determinar que es significativo, y describir su gestión, estrategia y gobierno de riesgos de ciberseguridad en el Formulario 10-K anual [56]. Un ataque de ransomware que paraliza una planta es un candidato típico para una evaluación de materialidad, por lo que su manual de incidentes de OT necesita una vía rápida hacia el comité de divulgación.
- **Infraestructuras críticas (CIRCIA):** La Ley de Notificación de Incidentes Cibernéticos para Infraestructuras Críticas exige a las entidades cubiertas notificar los incidentes cibernéticos cubiertos a CISA en un plazo de 72 horas, y los pagos de rescate en un plazo de 24 horas, pero solo cuando entre en vigor la norma final de CISA. A octubre de 2026, CISA había enviado la norma final a la Casa Blanca para su revisión, y no se había publicado [57]. Siga la norma final; definirá qué fabricantes están cubiertos.

### NIS2 y la Ley de Ciberresiliencia para operaciones en la UE

Si usted dirige plantas en la UE o vende máquinas allí, también le afectan dos normativas europeas. Los ejemplos alemanes que aparecen a continuación proceden de la edición original en alemán de esta guía y muestran cómo se aplican en la práctica las normas de la UE.

**NIS2 (ejemplo: Alemania).** La ley de transposición de NIS2 de Alemania (NIS2UmsuCG) entró en vigor el 6 de diciembre de 2025; la Oficina Federal alemana de Seguridad de la Información (BSI) supervisa ahora unas 29.500 entidades, frente a las unas 4.500 de antes [28]. Las empresas están incluidas si pertenecen a uno de los tipos de entidad de los anexos 1 y 2 de la Ley BSI y cumplen los umbrales del artículo 28: al menos 50 empleados, o más de 10 millones de euros tanto de facturación anual como de balance total [41]. Las entradas de fabricación del anexo 2 incluyen dispositivos médicos, computadoras, productos electrónicos y ópticos, equipos eléctricos, maquinaria y vehículos; la química y la alimentación son sectores aparte. Obligaciones principales:

- **Registro** en dos pasos, a través de la cuenta "Mein Unternehmenskonto" y del portal de la BSI, que se abrió el 6 de enero de 2026 [28].
- **Gestión de riesgos** con responsabilidad a nivel directivo.
- **Medidas técnicas y organizativas**, incluida la seguridad de la cadena de suministro y la autenticación multifactor.
- **Notificación de incidentes** significativos: alerta temprana en un plazo de 24 horas desde que se tiene conocimiento, notificación del incidente en 72 horas e informe final a más tardar un mes después de la notificación [41].

Las empresas deben evaluar por sí mismas si están incluidas; la BSI no les notifica. Ofrece una autoevaluación en línea no vinculante y recomienda asesoramiento jurídico en los casos poco claros [41]. Otros Estados miembros de la UE tienen sus propias leyes de transposición con estructuras similares.

**Cyber Resilience Act.** Si fabrica máquinas o productos con elementos digitales y los comercializa en el mercado de la UE, también se aplica el **Cyber Resilience Act (Reglamento (UE) 2024/2847)**, incluidos los fabricantes estadounidenses. Desde el 11 de septiembre de 2026, los fabricantes deben notificar las vulnerabilidades explotadas activamente y los incidentes graves a través de la Plataforma Única de Notificación de ENISA: alerta temprana en 24 horas, notificación en 72 horas e informe final a más tardar 14 días después de que haya una corrección disponible en el caso de las vulnerabilidades, o en un mes en el caso de los incidentes [30]. Desde el 11 de diciembre de 2027, los productos deben cumplir los requisitos esenciales de ciberseguridad antes de comercializarse; estos incluyen valores predeterminados seguros, una lista de materiales de software (SBOM) y actualizaciones de seguridad durante un periodo de soporte indicado, en general de al menos cinco años [42]. Para los fabricantes de máquinas que suministran equipos con servicios en la nube, la TI de fabricación pasa a ser cumplimiento de producto.

Para la arquitectura de Azure, NIS2, CSF 2.0 y CMMC apuntan en la misma dirección: un inventario (¿qué está conectado a la nube?), registro de eventos (¿quién cambió qué y cuándo?), transparencia en la cadena de suministro (¿qué servicios y socios intervienen?) y una vía de notificación ensayada.

### Monitorización de OT tras la retirada de Defender for IoT

El 2 de noviembre de 2026, Microsoft anunció oficialmente en Azure Updates que retirará por completo el componente de seguridad OT de Defender for IoT en octubre de 2029, tras un periodo de transición de tres años [22]. Hasta entonces, el servicio recibe actualizaciones de seguridad y correcciones de errores, pero no nuevas funciones OT; los acuerdos existentes y las renovaciones se respetan hasta octubre de 2029 [22]. Las capacidades de IoT empresarial de Defender for Endpoint, así como el descubrimiento de dispositivos y la evaluación de vulnerabilidades, no se ven afectadas [22]. No existe una sustitución propia de Microsoft [39]. Microsoft ofrece conectores para Armis, Dragos y Forescout que llevan los datos de activos y vulnerabilidades OT a Microsoft Security Exposure Management y al portal de Defender; las soluciones de socios requieren sus propias licencias e implantación [22], [24].

Fechas contradictorias: un blog de un socio de Microsoft de noviembre de 2026 cita el **31 de mayo de 2028** como fin del soporte para la seguridad OT [39]. En el momento de redactar esto no se había aclarado si se trata de una fecha distinta para determinados tipos de contrato o de un error.

Recomendación: si está introduciendo ahora la monitorización OT, evalúe directamente las soluciones de socios. Si utiliza Defender for IoT, planifique la sustitución para que esté completa antes de mediados de 2028, y confirme con su equipo de cuenta de Microsoft la fecha que aplica a su contrato.

### Lista de verificación de seguridad para la primera conexión de planta

- [ ] Modelo de zonas según ISA/IEC 62443 documentado para la planta
- [ ] Clúster de borde en su propia zona, solo conexiones salientes, a través de un proxy
- [ ] Endpoints de Arc y Azure permitidos explícitamente en el cortafuegos, todo lo demás bloqueado
- [ ] Conexiones OPC UA con certificados; acceso de escritura deshabilitado o sujeto a aprobación
- [ ] Roles de Entra ID para el personal de OT con mínimo privilegio; acceso privilegiado con tiempo limitado
- [ ] Registros del borde y de la nube recopilados de forma centralizada
- [ ] Inventario de activos OT conciliado con el Azure Device Registry
- [ ] Perfil CSF 2.0 (actual y objetivo) redactado para la plataforma de planta
- [ ] Alcance de CMMC decidido si la planta maneja FCI o CUI
- [ ] Ruta de notificación de incidentes probada (SEC, CIRCIA una vez en vigor, NIS2 para las plantas de la UE)
- [ ] Proceso de actualización definido para las versiones de Azure IoT Operations y Kubernetes (ventanas de mantenimiento acordadas con producción)

---

## Caso de uso 1: Mantenimiento predictivo en Azure

El mantenimiento predictivo es uno de los casos de uso de fabricación más citados en Azure, y también uno en el que muchos pilotos fracasan. Una razón habitual: el modelo llega antes que los datos. Profundizamos en este tema en el episodio [Predictive Maintenance on Azure: What You Actually Need Before the Model](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/).

### Distinga los términos

| Estrategia | Disparador | Datos necesarios |
|---|---|---|
| Mantenimiento reactivo | Fallo | Ninguno |
| Mantenimiento preventivo | Intervalo de tiempo o contador | Horas de operación, ciclos |
| Mantenimiento basado en la condición (monitorización de condición) | Umbral superado | Variables de condición (vibración, temperatura, corriente) |
| Mantenimiento predictivo | Pronóstico de vida útil restante o probabilidad de fallo | Variables de condición más historial de fallos etiquetado más contexto operativo |
| Mantenimiento prescriptivo | Acción recomendada | Más conocimiento de causas y acciones |

Muchas empresas obtienen la mayor parte del beneficio solo con el mantenimiento basado en la condición. Los modelos predictivos resultan rentables cuando los fallos son caros, suficientemente frecuentes y se anuncian físicamente con antelación. [Total Productive Maintenance](https://www.m365.fm/entity/total-productive-maintenance/) proporciona la estrategia general; sus pilares de mantenimiento autónomo y planificado también funcionan sin IA.

### Requisitos previos de datos

Antes de entrenar un modelo, debería poder responder que sí a estas preguntas:

1. **¿Existe un historial de fallos?** Un modelo supervisado necesita fallos con marcas de tiempo y tipos de fallo. Normalmente estos datos residen en el sistema de mantenimiento (por ejemplo SAP PM o un CMMS) y rara vez están codificados de forma limpia.
2. **¿Están sincronizadas las marcas de tiempo?** El tiempo de los sensores, el de los controladores y el de contabilización en el ERP deben poder cruzarse. No es casualidad que Microsoft haya añadido mensajes de estado específicos para servidores NTP ausentes o inaccesibles en los sensores de Defender for IoT [23]; lo mismo se aplica a su canal de datos. El conector OPC UA incluye la marca de tiempo de origen de cada valor [4]; utilícela en lugar de la hora de llegada a la nube.
3. **¿Se ajusta la frecuencia de muestreo al modo de fallo?** El daño en rodamientos aparece en los espectros de vibración en el rango de kilohercios; el desgaste de las resistencias calefactoras aparece en valores de escala de minutos. Una etiqueta OPC UA con resolución de un segundo basta para lo primero, pero no para lo segundo.
4. **¿Está disponible el contexto operativo?** Sin información sobre producto, receta, orden y estado (cambio de formato, producción, parada), el modelo trata cada cambio de producto como una anomalía.
5. **¿Está definida la acción?** Quién responde a una advertencia, con cuánto tiempo de antelación y cómo se informa del resultado.

### Seis pasos

1. **Seleccionar candidatos:** Activos con altos costes de fallo, modos de fallo recurrentes y sensores ya instalados. Un análisis de Pareto de las causas de parada del MES te da la lista.
2. **Conectar los datos:** Conector OPC UA en Azure IoT Operations, puntos de datos por activo, flujo de datos hacia Fabric [3], [4]. Agrega en el edge los datos de vibración de alta frecuencia en características (RMS, curtosis, energías de banda).
3. **Primero la monitorización de condición:** Umbrales y detección de anomalías simple en Eventhouse y Activator. Activator puede notificar directamente a los técnicos [17]. Esto genera valor en semanas en lugar de meses y, al mismo tiempo, recopila etiquetas.
4. **Crear etiquetas:** Asocia las órdenes de mantenimiento con códigos de fallo a las series temporales. Aquí está el esfuerzo real. Planifica una herramienta para ello: Microsoft retiró el etiquetado de datos integrado en Azure Machine Learning el 30 de septiembre de 2026 y remite a proveedores externos [38]. Para etiquetas de series temporales procedentes del mantenimiento, a menudo basta con una Power App que escriba de vuelta en el sistema de mantenimiento.
5. **Entrenar el modelo:** En Fabric Data Science o Azure Machine Learning; guarda los resultados en OneLake [17]. Empieza con métodos interpretables (gradient boosting sobre características) antes de recurrir al deep learning.
6. **Poner en operación:** Envía las predicciones como eventos al proceso de mantenimiento (notificación en el sistema de mantenimiento, mensaje de Teams, formulario de Power Apps para la retroalimentación). Supervisa la calidad del modelo y la deriva.

### Métricas de éxito

Mide el impacto operativo, no la precisión del modelo: paradas no planificadas, tiempo medio entre fallos (MTBF), tiempo medio de reparación (MTTR), proporción de horas de mantenimiento planificado sobre el total y inventario de repuestos. Estos [KPI](https://www.m365.fm/entity/key-performance-indicator/) necesitan una línea base antes de iniciar el proyecto; de lo contrario, no puedes demostrar ningún beneficio. Nuestra guía sobre [KPI de fabricación](https://www.m365.fm/en/learn/manufacturing-kpis/) recoge las definiciones.

### ¿Edge o nube para la inferencia?

| Criterio | Inferencia en la nube | Inferencia en el edge |
|---|---|---|
| Latencia | Segundos a minutos | Milisegundos |
| Volumen de datos | Solo se envían datos agregados | Los datos brutos permanecen en local |
| Operación | Más sencilla (modelos centrales) | Despliegues distribuidos, versionado por planta |
| Resiliencia | Depende de la conectividad | Funciona sin conexión |
| Uso típico | Vida útil restante, planificación del mantenimiento | Parada rápida, calidad en línea |

Para el mantenimiento predictivo clásico, la inferencia en la nube sobre datos agregados basta en la mayoría de los casos. Desde la versión 2603, Microsoft ha posicionado explícitamente Azure IoT Operations para escenarios de IA más cerca de la máquina ("Physical AI") [6]; para la inferencia en el edge, consulta las notas de la versión actual [7].

### Mantenimiento predictivo en Azure: bloques de construcción de un vistazo

| Paso | Bloque de Azure y Microsoft | Alternativa |
|---|---|---|
| Recopilar datos | Azure IoT Operations (conector OPC UA, flujos de datos) [3], [4] | IoT Hub para sensores conectados directamente [36] |
| Almacenar y analizar series temporales | Fabric Eventhouse con KQL [17] | Azure Data Explorer [19] |
| Umbrales y alertas | Fabric Activator [17] | Azure Monitor o lógica personalizada |
| Entrenar el modelo | Fabric Data Science, Azure Machine Learning [17], [37] | Aplicación propia del fabricante de la máquina |
| Desencadenar la acción | Power Automate, Teams, Power Apps, sistema de mantenimiento | API directa al CMMS |

---

## Caso de uso 2: Trazabilidad y genealogía

La trazabilidad responde a la pregunta "¿Dónde está instalada esta pieza y de qué está hecha?". La genealogía describe la cadena completa de origen de un producto: material, lote, paso de proceso, máquina, parámetros, resultado de inspección y operario. En industrias reguladas es obligatoria; en el resto acelera la gestión de reclamaciones y permite acotar mejor los retiros del mercado. El episodio [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/) trata el tema en profundidad.

### Requisitos por industria

| Industria / norma | Requisito de datos clave | Nota |
|---|---|---|
| Alimentación, FDA Food Traceability Rule (FSMA Sección 204) | Elementos clave de datos (KDE) para cada evento crítico de trazabilidad (CTE), como recepción, transformación y expedición, vinculados a un código de lote de trazabilidad; registros entregados a la FDA en un plazo de 24 horas desde una solicitud, más una hoja de cálculo electrónica ordenable durante brotes o retiros | [59]; la FDA no aplicará la norma antes del 20 de julio de 2028, conforme a una directiva del Congreso (fecha original: 20 de enero de 2026) |
| Productos sanitarios, FDA QMSR (21 CFR Parte 820) | Desde el 2 de febrero de 2026, el Reglamento del Sistema de Gestión de la Calidad incorpora por referencia ISO 13485:2016, incluidos sus requisitos de identificación y trazabilidad | [61] |
| Registros electrónicos regulados por la FDA, 21 CFR Parte 11 | Pistas de auditoría seguras, generadas por ordenador y con sello de tiempo, que registran las entradas y cambios del operario sin ocultar las entradas anteriores, conservadas durante el tiempo que duren los registros | [60]; relevante para registros electrónicos de farmacia, productos sanitarios y alimentación |
| Automoción, IATF 16949 | La cláusula 8.5.2.1 complementa los requisitos de identificación y trazabilidad de ISO 9001 (incluido un plan de trazabilidad basado en análisis de riesgos); la cláusula 7.5.3.2.1 cubre la conservación de determinados registros, habitualmente interpretada como la duración del suministro de producción y de piezas de servicio más un año natural, salvo que el cliente o el regulador exijan otra cosa | El texto de la norma es de pago; detalles obtenidos de fuentes secundarias. Los requisitos específicos de cliente (CSR) de los OEM suelen ir más allá |
| Aeroespacial, AS9100D (EN 9100 en Europa, JIS Q 9100 en Japón) | Trazabilidad a lo largo del ciclo de vida del producto, identificación de la configuración y capacidad para rastrear productos fabricados con el mismo lote de materia prima o lote de producción | AS9100D (2016) es la revisión vigente; EN 9100 es la edición europea técnicamente equivalente [62]. La cita de cláusula (8.5.2) no se ha comprobado frente al texto original de la norma |
| Baterías vendidas en la UE, Reglamento de baterías de la UE (Reglamento (UE) 2023/1542) | Pasaporte electrónico de la batería a partir del 18 de febrero de 2027 para baterías de tracción de vehículos eléctricos, baterías de medios de transporte ligeros (por ejemplo, bicicletas eléctricas y patinetes eléctricos) y baterías industriales de más de 2 kWh | [29]; calendario según la Comisión Europea, de carácter orientativo; relevante para exportadores estadounidenses a la UE |
| Productos vendidos en la UE en el marco del Reglamento de diseño ecológico (ESPR, Reglamento (UE) 2024/1781) | Pasaporte digital de producto según el acto delegado; registro de pasaportes digitales de la UE en funcionamiento desde el 20 de julio de 2026 (inicialmente con un entorno de prueba); acto delegado para hierro y acero previsto para el cuarto trimestre de 2026, y para textiles, aluminio y neumáticos en 2027; al menos 18 meses de periodo transitorio tras la adopción de un acto delegado | [29]; calendario según la Comisión Europea, de carácter orientativo |

Para el sector aeroespacial, Mirko Peters explica en su artículo [Aerospace Production Planning: Lead Time and Traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/) por qué el plazo de entrega y la trazabilidad están estrechamente relacionados en este sector; nuestra guía sobre [planificación de la producción aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/) cubre el contexto de AS9100, FAA y control de exportaciones.

### El modelo de datos de la genealogía

Una genealogía robusta necesita tres tipos de relaciones:

1. **Material en material:** el lote A y el componente B entran en el conjunto C (referencia de lista de materiales, número de serie o de lote).
2. **Material en proceso:** el conjunto C se procesó en la operación 30, en la estación 20, con el conjunto de parámetros X, por el turno Y.
3. **Proceso en resultado:** la operación 30 generó el resultado de inspección Z y, en su caso, una no conformidad.

Estas relaciones forman un grafo. Puede representarlo en Fabric como una estructura de tablas en el Lakehouse y recorrerla con KQL o SQL, o modelarlo como un grafo en un gemelo digital (ontología de Fabric o Azure Digital Twins) [14], [16]. Lo que importa es que la identificación se produzca en origen: escaneo, RFID o códigos Data Matrix en la estación, vinculados al evento de orden en el UNS.

### Implementación en Azure

- **Capturar eventos en el borde:** Los escáneres y las estaciones publican "la pieza X inició/terminó en la estación Y" en el broker MQTT de Azure IoT Operations [3]. Los parámetros de proceso llegan a través del conector OPC UA [4]; el "disparo de conjuntos de datos" permite que un punto de datos active la publicación de otros, por ejemplo "ciclo completado" [4].
- **Reunir el contexto:** En Fabric, los eventos se unen con los datos de órdenes y de lista de materiales (BOM) procedentes de ERP y MES [17].
- **Garantizar la inmutabilidad:** Los registros regulatorios requieren almacenamiento inmutable o, como mínimo, un registro de cambios a prueba de manipulaciones (para registros regulados por la FDA, el requisito de pista de auditoría de la Parte 11 [60]). La política de inmutabilidad de OneLake se aplica actualmente solo a los registros de diagnóstico, no a los datos de negocio [43]. Para archivos de trazabilidad a prueba de auditoría, añada Azure Blob Storage con políticas de almacenamiento inmutable (WORM); Fabric sigue siendo la capa analítica.
- **Proporcionar consultas:** Las consultas típicas son el rastreo hacia adelante (¿qué productos terminados contienen el lote A?) y el rastreo hacia atrás (¿de qué está compuesto el número de serie S?). Un informe de Power BI o una aplicación de Power Apps para aseguramiento de calidad hace utilizables estas consultas sin conocimientos de KQL. Según FSMA 204, poder exportar una hoja de cálculo ordenable en un plazo de 24 horas [59] es una prueba de aceptación concreta para esta capa.

### Del registro de trazabilidad al pasaporte digital de producto

Un pasaporte digital de producto es esencialmente un extracto de acceso externo de su genealogía, junto con datos de sostenibilidad y de materiales. Si hoy construye una genealogía limpia, habrá hecho el trabajo previo más difícil. Asegúrese de que los identificadores sean únicos y permanentes, y de poder separar qué datos son públicos, cuáles son para reguladores y cuáles son solo internos.

---

## Caso de uso 3: Gemelos digitales

El término [gemelo digital](https://www.m365.fm/entity/digital-twin/) se usa para cosas muy distintas: desde un modelo 3D hasta un modelo de simulación o una representación en vivo de una planta. A efectos de arquitectura, resulta útil una distinción. Nuestra guía sobre [gemelos digitales en la fabricación](https://www.m365.fm/en/learn/digital-twin-manufacturing/) va más allá de la perspectiva de Azure.

### Tres tipos de gemelos

| Tipo | Pregunta | Datos | Herramientas en el ecosistema Microsoft |
|---|---|---|---|
| **Gemelo de información** | ¿Qué hay dónde y cómo están conectados? | Jerarquía de activos, relaciones, estados en vivo | Fabric digital twin builder (vista previa) [15], ontología de Fabric IQ (vista previa) [16], Azure Digital Twins [14] |
| **Gemelo de simulación** | ¿Qué pasa si …? | Lógica de proceso, tiempos, capacidades, comportamiento ante perturbaciones | Aplicaciones industriales para simulación de flujo de material y de procesos, posiblemente sobre infraestructura de Azure |
| **Gemelo de ingeniería** | ¿Cómo se comporta físicamente el producto o la máquina? | CAD, CAE, lógica de control | PLM/CAE en Azure; Microsoft publica guías de arquitectura para Siemens NX en Azure Virtual Desktop con máquinas virtuales con GPU y Ansys Discovery en máquinas virtuales con GPU, entre otras [2] |

La [puesta en marcha virtual](https://www.m365.fm/entity/virtual-commissioning/) conecta los gemelos de ingeniería y de simulación: el código de control se prueba contra un modelo de planta antes de que exista el equipo real.

### ¿Azure Digital Twins o Fabric?

Microsoft señala que digital twin builder en Fabric es un producto distinto de Azure Digital Twins [14], [15]. Las diferencias prácticas:

| Criterio | Azure Digital Twins | Fabric digital twin builder |
|---|---|---|
| Estado | Activo, sin aviso de retirada en la página de descripción general [14] | Vista previa [15] |
| Modelado | DTDL (Digital Twins Definition Language), versión 3 [14] | Ontología con tipos de entidad y relaciones [15] |
| Almacenamiento | Grafo de gemelos propio; historial mediante historial de datos a Azure Data Explorer [14] | OneLake; los datos deben estar primero en un lakehouse de Fabric [15] |
| Integración | Rutas de eventos a Event Hubs, Event Grid, Service Bus [14] | Nativa en Fabric Real-Time Intelligence, Power BI |
| Audiencia | Equipos de desarrollo, centrados en API | Equipos de datos y de negocio, low-code |
| Visualización | 3D Scenes Studio (vista previa) [14] | Experiencias de Fabric, Power BI |

**Recomendación:** Si su plataforma de datos es Fabric y necesita gemelos analíticos para KPI y análisis de causa raíz, observe y pruebe digital twin builder y la ontología de Fabric IQ, pero no haga que su modelo de datos dependa de una versión preliminar. Microsoft aún no ha documentado cómo evolucionarán los dos componentes de Fabric en relación con el otro; la ontología ya pasó por un cambio de experiencia con migración obligatoria [16]. Si hoy está construyendo una aplicación de gemelo digital de producción basada en API, Azure Digital Twins es el servicio de disponibilidad general. En cualquier caso, conserve una copia de su ontología en un formato independiente de la herramienta.

### ¿Por dónde empezar?

El error más común es empezar por la visualización en 3D. Empiece por una pregunta que el gemelo debe responder, por ejemplo: "¿Qué pedidos se ven afectados si la estación 20 se detiene?". Esa pregunta define las entidades y relaciones que necesita. Mirko Peters describe este enfoque en [Digital Twin in Manufacturing: Where to Start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/) y el camino desde el ERP hasta un gemelo de planta en [From ERP to Shop Floor: Building the Digital Twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/). Analizamos la implementación técnica en Azure en el episodio [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/).

---

## Caso de uso 4: KPI en tiempo real, OEE y flujos de valor

Los KPI en tiempo real suelen ser la forma más rápida de obtener valor de una conexión de planta. No requieren IA, pero sí un modelo de estados limpio.

### Calcular el OEE correctamente

La eficacia global del equipo (OEE, por sus siglas en inglés) es el producto de disponibilidad, rendimiento y calidad. La fórmula es sencilla; las definiciones no lo son:

- **Disponibilidad:** ¿Qué paradas cuentan como planificadas (descansos, mantenimiento planificado, sin orden)? Esta decisión mueve el OEE muchos puntos porcentuales.
- **Rendimiento:** ¿Qué tiempo de ciclo es la referencia: el valor de diseño, el mejor tiempo de ciclo alcanzado o el estándar del ERP?
- **Calidad:** ¿Las piezas retrabajadas cuentan como piezas buenas o malas?

Acuerde estas definiciones entre plantas antes de construir un panel. De lo contrario, las plantas compararán cifras que no son comparables.

### Arquitectura para KPI en tiempo real

1. Los estados de las máquinas y los contadores de piezas fluyen por OPC UA hacia el broker [4].
2. Un flujo de datos asigna los estados a un modelo de estado uniforme (mapeo de códigos específicos de cada máquina) [3].
3. El Eventhouse calcula KPI continuos por estación, línea y turno con KQL.
4. Un Real-Time Dashboard sirve al piso de producción; Power BI sirve a los informes de dirección [17].
5. Activator genera alertas cuando los valores caen por debajo de los umbrales [17].

### La cadena de valor como modelo de datos en vivo

El mapeo de la cadena de valor es tradicionalmente un ejercicio en papel. Si conecta las cajas de proceso de una cadena de valor a datos en vivo, obtiene un modelo de datos sencillo pero eficaz: el tiempo de entrega, el inventario entre procesos, los tiempos de ciclo y los cuellos de botella se vuelven medibles. El episodio [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) muestra cómo funciona esto en la práctica. Para la programación detallada basada en estos datos, entran en juego los sistemas de [planificación y programación avanzadas](https://www.m365.fm/entity/advanced-planning-and-scheduling/); consulte nuestra guía sobre [programación de producción y APS](https://www.m365.fm/en/learn/production-scheduling-aps/). Cómo se usan estas cifras en las reuniones diarias de tiers es el tema de nuestra guía de [gestión en el piso de producción](https://www.m365.fm/en/learn/shop-floor-management/).

### Catálogo inicial de KPI

| KPI | Fuente de datos | Granularidad |
|---|---|---|
| OEE y sus factores | Estado de la máquina, contadores, hallazgos de calidad | Estación, turno |
| Tiempo de entrega | Eventos de pedido (inicio/fin por operación) | Pedido, producto |
| Trabajo en proceso | Registros de inventario, escaneos | Buffer, línea |
| Entrega a tiempo | ERP (fecha solicitada vs. fecha real) | Cliente, grupo de productos |
| MTBF / MTTR | Paradas, órdenes de mantenimiento | Activo |
| Energía por pieza buena | Medidores de energía, conteo de piezas | Línea, producto |
| Rendimiento al primer paso | Resultados de inspección | Operación |

---

## Integración de ERP y MES

Los datos de planta sin contexto de pedido y de material son mediciones, no información. La integración con ERP y MES determina el valor de toda la plataforma.

### ¿Cuál es el sistema de registro?

| Objeto de datos | Sistema de registro (típico) | Función de la plataforma de Azure |
|---|---|---|
| Material, BOM, ruta | ERP / PLM | Copia para enriquecimiento, sin mantenimiento |
| Orden de producción (planificación) | ERP / APS | Copia; retroalimentación de estado como evento |
| Ejecución de operaciones, confirmación | MES | Eventos en el UNS, historial en Fabric |
| Estados de máquina, valores de proceso | Controlador / edge | Fuente primaria de datos |
| Órdenes de mantenimiento | Mantenimiento de ERP / CMMS | Activadas por predicciones, historial para etiquetas |
| Hallazgos de calidad | QMS / MES | Vinculados a los datos de proceso |

### Integración con SAP

Existen varias formas de llevar datos de SAP a Fabric: los conectores de Data Factory, las soluciones de open mirroring de socios y "SAP Business Data Cloud Connect for Microsoft Fabric", que pretende poner los productos de datos de SAP a disposición de OneLake sin copiarlos; la disponibilidad general de esta última se anunció para el tercer trimestre de 2026 [44]. No pudimos confirmar la disponibilidad general real en el momento de redactar esto [unverified: no pudimos confirmar la disponibilidad general real en el momento de redactar esto]; verifique el estado actual y los requisitos de licencia del lado de SAP antes de planificar. Para la integración de piso de planta con SAP Digital Manufacturing, DSAG (el grupo de usuarios de SAP de habla alemana) publicó en abril de 2026 la guía "SAP DM Shopfloor Integration"; la página de resumen está disponible en inglés. Según su introducción, cubre arquitectura, estructuras y modelos de datos, escalabilidad, plantillas, modelo operativo y adquisiciones; el texto completo está reservado para los miembros de DSAG [48]. Regla básica: las confirmaciones se envían a SAP a través del MES o de APIs definidas, no directamente desde la plataforma de datos.

### Dynamics 365

Si usa Dynamics 365 Supply Chain Management, se beneficia de su proximidad al ecosistema de Microsoft: con "Link to Microsoft Fabric", los datos de Dataverse, incluidas tablas seleccionadas de finanzas y operaciones, pueden ponerse a disposición en Fabric sin un pipeline de ETL propio [45]. Microsoft describe su oferta para manufactura como una combinación de capacidades de Dynamics 365, Microsoft 365 y Azure [1].

### Historiadores y SCADA existentes

Muchas plantas en EE. UU. ya ejecutan un historiador de procesos junto al SCADA. Trátelo como una fuente, no como algo que deba reemplazarse: el historiador sigue sirviendo localmente a operadores e ingenieros de procesos, mientras que la plataforma de Azure toma las señales sin procesar de la capa OPC UA o los datos curados del historiador. Decida, señal por señal, qué ruta es el sistema de registro para el historial, de modo que no almacene ni pague dos veces la misma serie temporal, y consulte con el proveedor del historiador qué interfaces y licencias aplican antes de diseñar el flujo de datos.

### El flujo de datos de piso de planta hacia el ERP

Un patrón habitual:

1. El ERP libera una orden; el evento "orden liberada" llega al UNS.
2. El MES inicia una operación; el evento "operación iniciada" incluye estación y orden.
3. Los datos de máquina se enriquecen en el flujo de datos con el número de orden actual.
4. El MES confirma cantidades y tiempos; el ERP los contabiliza.
5. Fabric une todos los eventos en un historial completo de la orden para análisis y genealogía.

---

## IA y Copilot en la fabricación

La IA generativa ha llegado a la fabricación, pero de forma distinta a lo esperado en 2024. Microsoft retiró sus vistas previas de agentes específicas para fabricación (Factory Operations Agent, Factory Safety Agent) en 2025 [2] y, en su lugar, se apoya en componentes genéricos de la plataforma: Microsoft Foundry para agentes y modelos [20], Copilot en Fabric para preguntas sobre datos [17], y Copilot Studio y Microsoft 365 Copilot para escenarios de trabajo de oficina. En Ignite 2025 llegaron como vistas previas Fabric IQ y Foundry IQ, destinadas a dar a los agentes una capa semántica y una base de conocimiento, respectivamente [34]. La visión del ciclo de vida también aplica aquí: prompt flow, una herramienta muy utilizada para las primeras aplicaciones con LLM en Foundry y Azure Machine Learning, se retira el 20 de abril de 2027; Microsoft recomienda migrar a Microsoft Agent Framework [37].

### Escenarios realistas

| Escenario | Componentes | Requisito previo |
|---|---|---|
| Preguntas en lenguaje natural sobre datos de producción ("¿Por qué la línea 3 fue más lenta ayer?") | Copilot en Fabric, agentes de datos de Fabric, ontología [16], [17] | Modelo de datos limpio, nombres de tablas y columnas comprensibles, KPI definidos |
| Resumir relevos de turno e informes de incidentes | Microsoft 365 Copilot, Teams, Copilot Studio | Captura estructurada, por ejemplo en Power Apps o formularios de Teams |
| Asistente de mantenimiento (búsqueda en manuales e historial de averías) | Microsoft Foundry con recuperación, Copilot Studio | Documentos digitales y actualizados, permisos mantenidos |
| Inspección visual de calidad | Modelos de visión artificial, inferencia en el borde | Datos de imagen etiquetados (herramienta de etiquetado de terceros, ya que el etiquetado de datos de Azure ML está retirado [38]), iluminación estable |
| Asistente de planificación (comparar escenarios) | Aplicación industrial (APS, simulación) más IA | Un modelo de planificación válido |

### Microsoft 365 como puente hacia la planta

Para las organizaciones que ya utilizan Microsoft 365, la mayor palanca a corto plazo a menudo no está en Azure, sino en conectar los eventos de planta con el entorno de trabajo:

- **Teams para el personal de primera línea:** Comunicación de turnos, tareas y notificaciones de Activator o Power Automate directamente en Teams [17].
- **Power BI:** Informes de KPI para la dirección y el liderazgo de planta, basados en los mismos datos de Fabric.
- **Power Apps:** Registrar motivos de parada, hallazgos de calidad y observaciones de mantenimiento en tabletas en el puesto de trabajo. Esto genera exactamente las etiquetas que necesita el mantenimiento predictivo.
- **Copilot:** Resúmenes de informes de turno, análisis de desviaciones y notas de reuniones de gestión de planta.
- **Aclarar las licencias desde el principio:** Los empleados de planta suelen recibir licencias para primera línea (Microsoft 365 F1 o F3). Antes de la implantación, compruebe qué capacidades incluyen, como Power Apps o Copilot, y qué licencias adicionales necesita; de lo contrario, un buen piloto se estancará al escalar.

### Límites y gobernanza

- **Sin decisiones de control por parte de modelos de lenguaje.** Los modelos de lenguaje pertenecen a la asistencia, no al bucle de control cerrado de una máquina.
- **Utilice un marco de riesgos.** El **NIST AI Risk Management Framework (AI RMF 1.0)**, publicado el 26 de enero de 2023, es un marco voluntario organizado en cuatro funciones: Govern, Map, Measure y Manage [63]. Es una forma práctica de documentar los riesgos de la IA en la inspección de calidad o la planificación para clientes y auditores.
- **Ley de IA de la UE para operaciones en la UE:** Si utiliza sistemas de IA en plantas de la UE o vende productos con IA allí, compruebe si un sistema se usa como componente de seguridad de un producto o para gestionar trabajadores; pueden surgir obligaciones para sistemas de alto riesgo. El "Digital Omnibus on AI" (Reglamento (UE) 2026/1744, en vigor desde finales de julio de 2026) aplazó estos plazos: al 2 de diciembre de 2027 para sistemas independientes de alto riesgo (por ejemplo, en RR. HH.) y al 2 de agosto de 2028 para sistemas integrados en productos. La IA en maquinaria se regulará mediante actos delegados en el marco del Reglamento de Máquinas de la UE [46]. La clasificación de su sistema concreto requiere una revisión jurídica.
- **Plantilla y relaciones laborales:** Los sistemas que pueden evaluar el rendimiento o el comportamiento de los empleados plantean cuestiones laborales. En plantas sindicalizadas de EE. UU., compruebe si su convenio colectivo cubre la supervisión del rendimiento; en plantas alemanas, este tipo de sistemas requiere, por regla general, el acuerdo del comité de empresa (Betriebsrat), que tiene derechos de codeterminación. En cualquier caso, involucre a los representantes de los trabajadores desde el principio.
- **Permisos:** Copilot muestra lo que un usuario tiene permitido ver. Un uso compartido excesivamente amplio en SharePoint o Fabric se hace visible a través de la IA.

---

## FinOps para la TI de fabricación

Los costes de la nube en fabricación se comportan de forma distinta a las cargas de trabajo clásicas de TI: los volúmenes de datos crecen con cada máquina conectada, las cargas funcionan las 24 horas y parte de la infraestructura está en la planta. FinOps ayuda a que estos costes sean predecibles y a vincularlos con el valor generado. El episodio [FinOps for Manufacturing IT](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/) cubre los aspectos específicos.

### El marco de FinOps en resumen

Microsoft basa su guía de FinOps en el marco de la FinOps Foundation [25]. Consta de seis principios (entre ellos "Los equipos deben colaborar", "El valor de negocio impulsa las decisiones tecnológicas" y "Aprovechar el modelo de costes variables de la nube"), tres fases del ciclo de vida (Informar, Optimizar, Operar) y cuatro dominios [25]:

| Dominio | Qué significa para la fabricación |
|---|---|
| Comprender el uso y el coste | Hacer visible el coste por planta, línea y caso de uso (etiquetado, capacidades o espacios de trabajo de Fabric independientes) |
| Cuantificar el valor de negocio | Coste por pieza buena, por máquina conectada o por hora de parada evitada |
| Optimizar el uso y el coste | Reducir el volumen de datos en el borde, escalonar la retención, dimensionar correctamente las capacidades |
| Gestionar la práctica de FinOps | Responsabilidades, políticas, refacturación a las plantas |

El marco recomienda evaluar la madurez por capacidad en lugar de hacerlo de forma general, y revisarla cada tres a seis meses [25].

### Las diez palancas de coste más importantes

1. **Agregar en el borde:** No todos los valores con resolución de un segundo necesitan llegar a la nube. Los flujos de datos pueden filtrar y agregar [3]. Es la palanca individual más importante.
2. **Enviar solo los cambios:** De forma predeterminada, el conector OPC UA envía solo los valores modificados y añade fotogramas clave periódicos con todos los valores para que los consumidores puedan recuperar el estado [4]. Compruebe también las bandas muertas en el controlador o en el servidor OPC UA para que el ruido no cuente como cambio.
3. **Consolidar los Eventstreams:** Por planta y no por origen, con transformaciones en el Eventhouse [31].
4. **Escalonar la retención:** Los datos recientes en la caché del Eventhouse durante días o semanas, los datos más antiguos en el almacenamiento de OneLake.
5. **Dimensionar la capacidad de Fabric con criterio:** Supervise la utilización con la aplicación Capacity Metrics, separe las cargas de desarrollo y de producción, y pause las capacidades que no necesite. La pausa está documentada para los SKU F; al pausar, los excesos acumulados se facturan de inmediato y el contenido de la capacidad deja de estar disponible [47]. Por tanto, una capacidad que sirve a un Eventstream o a un panel de planta no es candidata a pausarse.
6. **Elegir el SKU de borde adecuado:** Desde la versión 2610, Azure IoT Operations ofrece un SKU Essentials de menor coste para despliegues de alto volumen junto al Standard, limitado a clústeres de un solo nodo y sin el conector OPC UA [3]. Encaja, por ejemplo, en emplazamientos cuyos datos ya llegan por MQTT o HTTP. Compruebe por emplazamiento qué funciones necesita realmente.
7. **Usar reservas y planes de ahorro** para los recursos de Azure que funcionan de forma continua.
8. **Asignar los costes:** Imponga etiquetas para planta, centro de coste y caso de uso (Azure Policy).
9. **Introducir la economía unitaria:** Informe del coste de la nube por unidad producida o por máquina conectada. Solo así podrá comparar plantas.
10. **Retirar sistemas heredados:** Migre los servicios que se van a retirar (IoT Central, IoT Edge 1.5) antes de que las estructuras paralelas dupliquen sus costes.

### No olvide los costes del borde

El hardware de planta, las operaciones de Kubernetes, las licencias de los servicios habilitados para Azure Arc y el personal para las actualizaciones deben incluirse en el mismo cálculo. Un caso de negocio que solo analiza la factura de Azure subestima sistemáticamente el coste total. Esta guía no incluye precios de forma deliberada, porque cambian con frecuencia; encontrará los modelos de precios actuales de Azure IoT Operations (Standard y Essentials), Azure Arc y Azure Local en las páginas de precios de Azure y en la calculadora de precios de Azure.

---

## Elaboración del caso de negocio para Azure en la fabricación

Las afirmaciones generales sobre beneficios procedentes de estudios del sector rara vez ayudan a aprobar un presupuesto, porque no conocen su punto de partida. Una lógica de cálculo que usted completa con sus propias cifras es más sólida.

### Categorías de beneficios

| Categoría | Cálculo | Fuente de datos |
|---|---|---|
| Parada no planificada evitada | Horas de parada × margen de contribución por hora × reducción esperada | Histórico de paradas del MES, finanzas |
| Mayor OEE | Piezas buenas adicionales × margen de contribución por pieza | Línea base de OEE |
| Menores costes de chatarra y retrabajo | Cantidad de chatarra × coste de fabricación × reducción | QMS |
| Gestión más rápida de reclamaciones | Horas por reclamación × tarifa horaria × reducción; alcance de retirada más reducido | Histórico de reclamaciones |
| Costes de mantenimiento | Inventario de repuestos, servicios de contratistas, horas extra | ERP de mantenimiento |
| Cumplimiento normativo | Esfuerzo evitado en evidencias manuales (auditorías, solicitudes FSMA 204, evaluaciones CMMC, DPP) | Equipo de calidad y cumplimiento |

### Categorías de costes

- Hardware de borde y operación por planta
- Consumo de Azure y Fabric (recurrente)
- Licencias (Power BI, Copilot, aplicaciones industriales, seguridad OT cuando sea necesaria)
- Implementación (interna y externa)
- Gestión del cambio y formación
- Sensores de adaptación para máquinas antiguas

### Ejemplo práctico con cifras ficticias

Una línea tiene 120 horas de parada no planificada al año, y el margen de contribución es de 1.600 $ por hora. Si la monitorización de condición y una respuesta más rápida evitan el 20 por ciento de esas horas, eso equivale a 24 horas × 1.600 $ = 38.400 $ al año. Frente a ello están los costes asignados: hardware de borde y operación, consumo de Fabric, licencias y horas internas. Las cifras son deliberadamente sencillas. Lo importante es que cada supuesto tenga una fuente dentro de su empresa (histórico del MES, finanzas) y que mida la reducción frente a la línea base después de tres a seis meses.

### Regla práctica para priorizar

Empiece por el caso de uso en el que se cumplan tres condiciones: una línea base medible, datos disponibles y un responsable de proceso que quiera utilizar los resultados. Con más frecuencia que el mantenimiento predictivo, eso suele ser el OEE en tiempo real o la trazabilidad.

---

## Hoja de ruta: cinco fases hacia una plataforma de fabricación escalable en Azure

La hoja de ruta siguiente sigue el patrón habitual "primero la base y un caso de uso faro, después escalar". Las duraciones son orientativas para una primera planta y dependen en gran medida de su punto de partida, de las aprobaciones de red y de los recursos disponibles.

### Fase 1: Claridad (de 4 a 8 semanas)

- Cartera de casos de uso con estimaciones de beneficio; seleccionar uno o dos casos de uso faro
- Estado actual: parque de máquinas, protocolos (¿está disponible OPC UA?), red, sistemas existentes
- Modelo de datos objetivo (jerarquía ISA-95, convención de temas UNS)
- Concepto de seguridad que cubra la seguridad OT, el perfil CSF 2.0, el alcance de CMMC cuando proceda, la privacidad y los representantes de los trabajadores
- Comprobación del ciclo de vida de todos los servicios frente a la tabla de estado de esta guía

### Fase 2: Base (de 6 a 12 semanas)

- Infraestructura de borde en la planta piloto, conexión con Arc, Azure IoT Operations
- Estructura del espacio de trabajo de Fabric, planificación de capacidad, modelo de acceso
- Primeras máquinas conectadas mediante OPC UA, activos en Azure Device Registry
- Fundamentos de FinOps: etiquetas, presupuestos, informes de coste por planta

### Fase 3: Primer valor (de 8 a 12 semanas)

- Caso de uso faro en producción, por ejemplo OEE en tiempo real con captura del motivo de parada en una Power App
- Panel de planta y informe de gestión
- Línea base y primera medición del impacto

### Fase 4: Profundización (de 3 a 6 meses)

- Integración del contexto de ERP y MES, histórico de pedidos y genealogía
- Monitorización de condición, recogida de etiquetas para mantenimiento predictivo
- Primeros escenarios de Copilot sobre datos curados

### Fase 5: Escalado (del mes 9 al 15, según el progreso)

- Despliegue en más líneas y plantas con infraestructura como código y GitOps
- KPI transversales entre plantas con definiciones uniformes
- Mantenimiento predictivo para activos seleccionados, escenarios de gemelos
- Modelo operativo: equipo de plataforma, propietarios de productos de datos por dominio, gestión de versiones para las versiones, normalmente mensuales, de Azure IoT Operations [7]

El cambio clave es pasar de la prueba de concepto al producto mínimo viable: una PoC demuestra que la tecnología funciona. Un MVP demuestra que las personas trabajan mejor con ella. Si quiere anclar ese cambio en un programa de mejora más amplio, consulte nuestras guías sobre [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) y [excelencia operativa](https://www.m365.fm/en/learn/operational-excellence/).

---

## Errores comunes en proyectos de fabricación con Azure

1. **La tecnología antes que la pregunta:** Construir una plataforma sin una unidad de negocio que quiera resolver un problema concreto.
2. **La versión preliminar como cimiento:** Apoyar la lógica de negocio en servicios en versión preliminar. La retirada de las soluciones de datos de fabricación y de los agentes de fábrica muestra el riesgo [2].
3. **Bloques obsoletos de guías antiguas:** Planificar proyectos nuevos con IoT Central, Time Series Insights o IoT Edge 1.5 porque un artículo de 2021 lo recomienda [8], [10], [12].
4. **SKU equivocado:** Planificar Azure IoT Operations Essentials para una planta con máquinas OPC UA, aunque ese SKU no incluye el conector OPC UA [3].
5. **Sin modelo de estados:** Tomar los códigos de estado específicos de cada máquina sin filtrar. Las comparaciones entre plantas se vuelven imposibles.
6. **Todo a la nube:** Enviar datos brutos con la máxima resolución y sorprenderse con la factura.
7. **Seguridad OT como ocurrencia tardía:** Conectar un clúster de borde a la red sin un concepto de zonas y dejar abierto el acceso de escritura a los controladores.
8. **Olvidar las etiquetas:** Iniciar el mantenimiento predictivo sin un historial de fallos estructurado.
9. **KPI sin definiciones:** Construir paneles de OEE antes de que las plantas hayan acordado las definiciones de disponibilidad.
10. **Subestimar la operación:** Publicaciones periódicas, actualizaciones de Kubernetes, rotación de certificados y un búfer del broker que solo puede configurarse en el despliegue inicial [40], sin que nadie sea responsable.
11. **Dejar atrás a las personas:** Los empleados de la planta se enteran del proyecto cuando la tableta se monta en su puesto de trabajo.
12. **Ignorar el alcance de cumplimiento normativo:** Subir planos o especificaciones de piezas para defensa a un espacio de trabajo compartido de Fabric sin una decisión de alcance CMMC.

---

## Aplicaciones industriales en el ecosistema de Microsoft

> **Nota: el autor trabaja en iFAKT GmbH.**

Una plataforma construida sobre Azure IoT Operations y Fabric aporta datos, pero no lógica de negocio para la planificación, los flujos de valor o la simulación. Las aplicaciones industriales disponibles a través de Microsoft AppSource o Microsoft Marketplace cubren ese hueco.

Un ejemplo es [Polaris](https://www.m365.fm/entity/polaris/) de [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), una empresa de software con sede en Stuttgart (Alemania). El proveedor describe Polaris como un software para digitalizar, simular y optimizar la producción, con los módulos VSM/BSM (modelado de flujos de valor y de swimlanes), Simulator, Optimizer (planificación), Operator y Analyzer (análisis de KPI). Según el proveedor, la planificación se basa en restricciones y tiene en cuenta recursos, cualificaciones, turnos y búferes; un cuadro de mando de KPI muestra el tiempo de ciclo, el inventario, la utilización y la entrega a tiempo. Polaris VSM figura como oferta SaaS en Microsoft Marketplace [33]; Microsoft destacó a iFAKT como parte de su programa "ISV Success for Business Applications" [32]. Nuestra guía sobre [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) describe el producto con más detalle.

En la arquitectura de esta guía, una aplicación de este tipo se sitúa en las capas 6 a 8: utiliza datos de procesos y pedidos para modelar flujos de valor, simular escenarios y optimizar planes. Cómo es una integración concreta con su plataforma de datos es algo que debe aclarar con el proveedor; este artículo no hace ninguna afirmación al respecto.

Independientemente del proveedor, cuatro preguntas ayudan al seleccionar este tipo de aplicaciones: ¿la aplicación lee datos en formatos abiertos (por ejemplo, tablas Delta en OneLake o eventos del broker), o necesita sus propias interfaces? ¿Qué sistema es el sistema de registro para los datos maestros, como las rutas de fabricación y las capacidades? ¿Dónde se ejecutan los datos y los cálculos (región, tenant)? Y ¿cómo vuelven los resultados, como un plan optimizado, al ERP o al MES de forma controlada?

---

## Preguntas frecuentes

### ¿Qué es Azure para la fabricación?

Azure para la fabricación es el conjunto de servicios de nube y de borde de Microsoft que los fabricantes utilizan para conectar plantas, almacenar y analizar datos de producción, y crear aplicaciones de IA y de puesto de trabajo sobre ellos. En 2026, el núcleo está formado por Azure IoT Operations sobre Kubernetes habilitado para Azure Arc en la planta, Microsoft Fabric como plataforma de datos, y Foundry, Power BI y Copilot para análisis e IA [3], [17]. Microsoft agrupa su propuesta sectorial como "Microsoft for Manufacturing", que combina Azure, Dynamics 365 y Microsoft 365 [1].

### ¿Cuál es la diferencia entre Azure IoT Hub y Azure IoT Operations?

IoT Hub es un servicio en la nube al que los dispositivos individuales se conectan directamente. Azure IoT Operations es una capa de datos que se ejecuta en la planta sobre Kubernetes habilitado para Azure Arc y conecta las máquinas mediante OPC UA y otros conectores a un broker MQTT local [3]. Para fábricas con muchas máquinas, Azure IoT Operations suele ser el punto de partida adecuado; IoT Hub encaja con dispositivos distribuidos y conectados directamente. Para conocer las ventajas e inconvenientes frente a IoT Edge, consulte [Azure IoT Edge vs Azure IoT Operations: Choosing the Right Industrial Architecture](https://www.m365.fm/community/u/mirko-p/blog/azure-iot-edge-vs-azure-iot-operations/).

### ¿Se va a retirar Azure IoT Central?

Sí. Desde el 23 de septiembre de 2026 no se pueden crear nuevas aplicaciones de IoT Central; las aplicaciones existentes seguirán funcionando hasta el 20 de septiembre de 2029. Microsoft recomienda como destino IoT Hub con el Device Provisioning Service, Azure Device Registry y Microsoft Fabric; los paneles y el análisis pasan a Fabric Real-Time Intelligence [8], [64]. Un aviso de retirada para el 31 de marzo de 2027 que apareció en el portal de Azure en febrero de 2024 fue retirado por Microsoft en su momento como un mensaje de sistema erróneo [9]. El anuncio de 2026, en cambio, es un aviso habitual con un plazo de tres años.

### ¿Qué sustituyó a Azure Time Series Insights?

Time Series Insights se retiró el 7 de julio de 2024. Microsoft señala como destino de migración el Eventhouse de Microsoft Fabric Real-Time Intelligence [10]. Si no utiliza Fabric, Azure Data Explorer es una alternativa que también usa KQL [19].

### ¿Qué ocurrió con Microsoft Cloud for Manufacturing?

La oferta sectorial se llama ahora "Microsoft for Manufacturing" y agrupa capacidades de Azure, Dynamics 365 y Microsoft 365 [1]. Las versiones preliminares concretas "Manufacturing data solutions" y "Factory Operations Agent" se retiraron el 30 de mayo de 2025, y "Factory Safety Agent" el 23 de junio de 2025 [2]. No existe un aviso separado para "Manufacturing data solutions in Microsoft Fabric"; no lo incluya en nuevos proyectos.

### ¿Qué servicios de Azure necesito para una fábrica inteligente?

Para una conexión típica de planta: Azure Arc y un clúster de Kubernetes en la planta, Azure IoT Operations encima (broker, conector OPC UA, flujos de datos), Azure Device Registry para los activos, Microsoft Fabric con Eventstream, Eventhouse y Activator para datos en tiempo real, y Power BI para informes [3], [17]. Los componentes de IA (Fabric Data Science, Azure Machine Learning, Microsoft Foundry) y los gemelos llegan después. Entra ID, Azure Policy, Cost Management y una solución de seguridad OT completan el marco.

### ¿Cuál es la diferencia entre Azure IoT Operations Essentials y Standard?

Standard ofrece el conjunto completo de funciones. Essentials, disponible desde la versión 2610, es una opción de menor coste para despliegues de gran volumen; solo se ejecuta en clústeres de un solo nodo y no incluye el conector OPC UA [3]. Para plantas con máquinas OPC UA, Standard es el punto de partida.

### ¿Necesito conocimientos de Kubernetes para Azure IoT Operations?

Sí, al menos para la operación. Azure IoT Operations se ejecuta en clústeres de Kubernetes habilitados para Azure Arc y se configura según el modo Kubernetes [3]. Para empezar, Microsoft documenta instalaciones en Ubuntu y en Windows con AKS Edge Essentials [3]. Planifique la formación del personal o un socio de operaciones.

### ¿Sigue funcionando la producción si falla la conexión a internet?

Según Microsoft, Azure IoT Operations puede funcionar sin conexión durante un máximo de 72 horas, posiblemente con funcionalidad reducida, y recupera la funcionalidad completa al reconectarse [3]. Cuántos mensajes se almacenan en búfer durante ese tiempo depende de la configuración del broker, que se establece en el despliegue inicial [40]. Las funciones de control nunca deben depender de la nube; el control permanece en los PLC y en los sistemas locales.

### ¿Azure Digital Twins o digital twin builder en Fabric?

Azure Digital Twins es un servicio de disponibilidad general con modelos DTDL y acceso mediante API [14]. Digital twin builder forma parte de Fabric Real-Time Intelligence, trabaja con ontologías sobre datos de OneLake y está en vista previa [15]. Para producción, con gemelos digitales desarrollados por equipos de TI, Azure Digital Twins es hoy la opción segura; para gemelos analíticos sobre una plataforma Fabric, merece la pena un piloto con digital twin builder. Mirko Peters explica una distinción relacionada, entre el device twin de IoT Hub y Azure Digital Twins, en [Device Twin vs Azure Digital Twins: Choosing the Right Layer for Industrial IoT](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/).

### ¿Qué datos necesito para el mantenimiento predictivo?

Variables de condición con una frecuencia de muestreo adecuada, marcas de tiempo sincronizadas, contexto operativo (orden, producto, estado de la máquina) y, sobre todo, un historial de fallos etiquetado procedente de mantenimiento. Sin historial de fallos, al principio solo es posible la detección de anomalías.

### ¿Qué significa la retirada de Defender for IoT para la seguridad de mi OT?

El 2 de noviembre de 2026, Microsoft anunció oficialmente que retirará por completo el componente de seguridad OT de Defender for IoT en octubre de 2029; hasta entonces solo habrá actualizaciones de seguridad y correcciones de errores [22]. Un blog de un socio de Microsoft cita en cambio el 31 de mayo de 2028 como fin del soporte [39]. No existe un reemplazo propio de Microsoft; Microsoft ofrece conectores para Armis, Dragos y Forescout, cuyas soluciones se licencian por separado [22]. Planifique el reemplazo de forma que esté completo antes de mediados de 2028.

### ¿Sigue mereciendo la pena usar IoT Edge?

IoT Edge como producto sigue soportado. La versión 1.5 LTS llegó al fin del soporte el 10 de noviembre de 2026; la versión actual 1.6 LTS tiene soporte hasta el 14 de noviembre de 2028 [12]. Para flotas de dispositivos Linux existentes, actualizar a 1.6 es la vía directa. Para dispositivos Windows con EFLOW 1.5, la página de versiones no indica ninguna EFLOW 1.6 LTS; aclare allí la ruta de destino. Para nuevos planos de datos de planta, evalúe Azure IoT Operations.

### ¿Es Azure compatible con CMMC?

No existe una certificación CMMC para Azure en sí, porque CMMC se aplica a los sistemas de un contratista, no a una plataforma en la nube [55]. Microsoft afirma que Azure y Azure Government cuentan con autorizaciones FedRAMP High que cubren NIST SP 800-171, que puede obtenerse la certificación CMMC para soluciones en cualquiera de las dos nubes, y que la mayoría de los contratistas de defensa se alinean mejor con Azure Government [55]. La norma DFARS que incorpora los requisitos de CMMC a los contratos del DoD se está implantando por fases desde el 10 de noviembre de 2025 [54].

### ¿Qué marco de seguridad debe usar un fabricante estadounidense para Azure y OT?

Úselos en conjunto. NIST CSF 2.0 le ofrece la estructura de gobierno y un lenguaje común con la dirección, las aseguradoras y los clientes [49]; ISA/IEC 62443 le ofrece el modelo técnico para OT (zonas, conductos, niveles de seguridad) [27]; NIST SP 800-82 Rev. 3 conecta ambos con una guía específica para OT y superposiciones de controles [50]. Añada CMMC si maneja FCI o CUI para el DoD [53], y NIS2 para las plantas en la UE [41].

### ¿Cuánto cuesta Azure para la fabricación?

No existe una cifra global fiable. Los costes dependen del número de plantas y máquinas, el volumen de datos, la retención, la capacidad de Fabric elegida, el hardware de borde y las licencias. La palanca más importante es la agregación de datos en el borde. Utilice la calculadora de precios de Azure e introduzca prácticas de FinOps a partir de la fase 2 [25].

### ¿Qué papel desempeña Microsoft 365 en la fabricación?

Microsoft 365 es la capa del puesto de trabajo: Teams para la comunicación de turnos y las notificaciones, Power BI para los KPI, Power Apps para la captura de datos en el puesto de trabajo y Copilot para resúmenes y preguntas sobre los datos. Para empresas con un entorno de Microsoft 365 ya establecido, esta conexión suele ser la forma más rápida de hacer útiles los datos de la planta.

### ¿Por dónde empiezo como administrador de Microsoft 365 o Azure?

Con las tareas que ya corresponden a la TI central: roles de Entra ID para el personal de OT y los socios, una zona de aterrizaje de Azure con directivas de etiquetas por planta, un clúster de prueba de Arc, incluidas las aprobaciones de cortafuegos a través de la cadena de proxy, y una estructura de espacios de trabajo de Fabric. En paralelo, reúnase con el responsable de OT para comprender el modelo de zonas de la planta. Los detalles figuran en la sección «Por dónde empezar como administrador de Microsoft 365 o Azure» al principio de esta guía.

---

## Conclusión

Azure para la fabricación en 2026 es menos una cuestión de elegir servicios que de disciplina. La base técnica está clara: Azure IoT Operations on Arc en la planta, Microsoft Fabric como plataforma de datos, y Foundry, Power BI y Copilot para la analítica y el puesto de trabajo. Al mismo tiempo, la retirada de Time Series Insights y de las vistas previas de fabricación, así como la retirada programada de IoT Central y de la seguridad OT en Defender for IoT, demuestran que la gestión del ciclo de vida forma parte del trabajo de arquitectura.

Tres factores marcan la diferencia: un modelo de datos propio y neutral respecto a las herramientas, basado en ISA-95; un diseño de seguridad basado en ISA/IEC 62443 y NIST CSF 2.0 que también cubra CMMC o NIS2 cuando sean aplicables; y un enfoque constante en casos de uso con una línea base medida. Si trabaja de este modo, construye una plataforma que da servicio al mantenimiento predictivo, la trazabilidad, los gemelos digitales y la IA a partir de la misma base de datos, y que sobrevive al próximo cambio de nombre de Microsoft.

### Lecturas adicionales en m365.fm

**Episodios**
- [Mantenimiento predictivo en Azure: lo que realmente necesita antes del modelo](https://www.m365.fm/show/episodes/predictive-maintenance-on-azure-for-manufacturers-what-you-actually-need-before-the-model/)
- [FinOps para la TI de fabricación](https://www.m365.fm/show/episodes/finops-for-manufacturing-it/)
- [Trazabilidad y genealogía](https://www.m365.fm/show/episodes/traceability-and-genealogy/)
- [Gemelos digitales en Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/)
- [Mapeo de la cadena de valor como modelo de datos en vivo](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Artículos**
- [Gemelo digital en la fabricación: por dónde empezar](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/)
- [Del ERP al piso de planta: construir el gemelo digital](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Planificación de la producción aeroespacial: plazo de entrega y trazabilidad](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)
- [Azure IoT Edge frente a Azure IoT Operations: elegir la arquitectura industrial adecuada](https://www.m365.fm/community/u/mirko-p/blog/azure-iot-edge-vs-azure-iot-operations/)
- [Device Twin frente a Azure Digital Twins: elegir la capa adecuada para el IoT industrial](https://www.m365.fm/community/u/mirko-p/blog/device-twin-vs-azure-digital-twins/)

**Glosario**
- [Industria 4.0](https://www.m365.fm/entity/industry-4-0/) · [Gemelo digital](https://www.m365.fm/entity/digital-twin/) · [ERP](https://www.m365.fm/entity/enterprise-resource-planning/) · [Planificación y programación avanzadas](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Mantenimiento productivo total](https://www.m365.fm/entity/total-productive-maintenance/) · [Indicador clave de rendimiento](https://www.m365.fm/entity/key-performance-indicator/) · [Puesta en marcha virtual](https://www.m365.fm/entity/virtual-commissioning/)

**Guías relacionadas**
- [Gemelo digital en la fabricación](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Programación de la producción y APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [KPI de fabricación](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Gestión del piso de planta](https://www.m365.fm/en/learn/shop-floor-management/)
- [Excelencia operacional](https://www.m365.fm/en/learn/operational-excellence/)
- [Planificación de la producción aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [Mapeo de la cadena de valor](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Manufactura esbelta (Lean)](https://www.m365.fm/en/learn/lean-manufacturing/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** es el presentador de m365.fm y trabaja en [iFAKT GmbH](https://www.m365.fm/entity/ifakt/). En m365.fm escribe sobre la intersección entre la planificación de producción, los gemelos digitales y la nube de Microsoft, traduciendo temas de fabricación como las cadenas de valor, la trazabilidad y el mantenimiento predictivo para un público de Microsoft 365 y Azure.

**Nota: El autor trabaja en iFAKT GmbH.**

*Última revisión: 20 de noviembre de 2026 (verificación de datos frente a fuentes primarias de Microsoft, NIST, CISA, FDA, SEC, BSI y la UE). Próxima revisión de la tabla de estado de servicios: febrero de 2027.*

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
