# SEO metadata

| Field | Value |
|---|---|
| Meta title | Gemelo digital en la fabricación: la guía completa |
| Meta description | Gemelo digital en la fabricación explicado: gemelo vs. sombra vs. simulación, simulación de fábricas, puesta en marcha virtual, AGV, ISO 23247 y una hoja de ruta. |
| Slug | `digital-twin-manufacturing` |

# Gemelo digital en la fabricación: la guía completa de simulación de fábricas, flujo de material y puesta en marcha virtual

*Última actualización: 20 de noviembre de 2026 · Revisado técnicamente frente a las normas, fuentes primarias y publicaciones enumeradas en Fuentes*

> **Respuesta corta:** Un gemelo digital en la fabricación es una representación digital ejecutable de los productos, procesos y recursos de una fábrica, que se actualiza con datos de la operación real, idealmente de forma automática. Se utiliza para simular la operación, evaluar cuellos de botella y escenarios de antemano, poner en marcha virtualmente el software de control y tomar decisiones antes de cambiar nada en la planta real.

El término "gemelo digital" se usa tan a la ligera que casi ha dejado de significar algo. Un modelo 3D de un edificio se llama gemelo digital. También lo es un panel de datos de máquinas, y a veces una hoja de cálculo de capacidad con celdas en rojo, amarillo y verde. Para los responsables de planta y de operaciones esto es un problema real: si no se sabe exactamente qué se quiere construir, se compra lo equivocado, se recopilan datos sin una pregunta a la que responder y, un año después, se tiene un costoso proyecto de visualización que no mejora ni una sola decisión.

Esta guía aclara la terminología y recorre cada capa: desde el origen del concepto con Michael Grieves y la NASA, pasando por las normas (ISO 23247, ISA-95, la Asset Administration Shell y las directrices alemanas VDI sobre simulación y puesta en marcha virtual, en las que todavía se basa buena parte de la industria), hasta la cuestión práctica de cómo derivar un gemelo de producción útil a partir de los datos que ya existen en su sistema ERP. El enfoque está en lo que los equipos de fabricación deciden realmente: planificación de fábrica y de distribución en planta, capacidad y cuellos de botella, mezcla de productos, calidad de la programación, puesta en marcha virtual y dimensionamiento de flotas de vehículos guiados automáticamente (AGV). Para una definición compacta, véase la página de entidad [Digital Twin](https://www.m365.fm/entity/digital-twin/).

### Puntos clave

- Un **gemelo digital** se diferencia de un modelo digital y de una sombra digital por su **flujo automático de datos en ambos sentidos** [5]. En la planificación de fábrica, muchas soluciones productivas funcionan deliberadamente como modelo o como sombra, y eso no es un defecto.
- El núcleo de un gemelo de producción es un **modelo producto-proceso-recurso (PPR)**: qué se fabrica (lista de materiales), cómo (rutas, tiempos, secuencias) y con qué (máquinas, personas, superficie y medios de manipulación de material). La mayor parte de estos datos ya reside en su **sistema ERP**.
- La **simulación** convierte el modelo en una herramienta de decisión. En fabricación y logística domina la **simulación de eventos discretos**; la referencia metodológica clásica es la directriz alemana VDI 3633 [13], y el texto estadounidense de referencia es *Simulation Modeling and Analysis* de Law [41].
- Las normas clave son la **ISO 23247** (marco de gemelos digitales para la fabricación, partes 1 a 4 de 2021, partes 5 y 6 de 2026) [6][7][8], la **IEC 63278-1** (Asset Administration Shell) [10] y la **ISA-95 / IEC 62264** (integración empresa-control) [58]. El NIST respalda la ISO 23247 con guías de casos de uso e implementaciones de referencia para fabricantes estadounidenses [47][48].
- Empiece por **una decisión concreta**, no por una plataforma. Un gemelo sin una pregunta se convierte en un cementerio de datos.
- La **calidad de los datos** decide el éxito o el fracaso: los tiempos estándar, los tiempos de cambio de formato, los calendarios de turnos y los registros de paradas suelen ser menos precisos de lo que sugieren los datos maestros.
- En Microsoft, **Azure Digital Twins** es un servicio PaaS de disponibilidad general que admite DTDL v2 y v3 [21][22]; **digital twin builder en Microsoft Fabric** sigue etiquetado como **versión preliminar** en el momento de escribir esto [23].

### Itinerarios de lectura para lectores con poco tiempo

| Usted es ... | Lea primero |
|---|---|
| Ingeniero de fabricación o planificador de fábrica | Secciones 2, 6, 7 y 10 (definiciones, simulación, casos de uso, hoja de ruta) |
| Director de planta, vicepresidente de operaciones, directivo | Respuesta corta, secciones 4, 12 y 13 (madurez, coste y beneficio, errores frecuentes) |
| Ingeniero de control o automatización | Sección 7.5 (puesta en marcha virtual) y 14 (normas) |
| Responsable de logística interna o de proyectos AGV/AMR | Sección 7.6 (planificación de flotas de AGV y AMR) |
| Administrador de M365/Azure, arquitecto TI/OT | Secciones 5, 8 y 16 (arquitectura, servicios de Microsoft, seguridad) |

## Índice de contenidos

1. [¿Qué es un gemelo digital en la fabricación?](#1-qué-es-un-gemelo-digital-en-la-fabricación)
2. [Modelo digital vs. sombra digital vs. gemelo digital](#2-modelo-digital-vs-sombra-digital-vs-gemelo-digital)
3. [Tipos de gemelos digitales en la fabricación](#3-tipos-de-gemelos-digitales-en-la-fabricación)
4. [Niveles de madurez: de la representación al sistema autooptimizable](#4-niveles-de-madurez-de-la-representación-al-sistema-autooptimizable)
5. [Arquitectura y base de datos: ERP, MES, PLM, IoT](#5-arquitectura-y-base-de-datos-erp-mes-plm-iot)
6. [La simulación como núcleo: simulación de fábrica, de flujo de material y de cadena de valor](#6-la-simulación-como-núcleo-simulación-de-fábrica-del-flujo-de-materiales-y-del-flujo-de-valor)
7. [Casos de uso y los datos que necesita cada uno](#7-casos-de-uso-y-los-datos-que-necesita-cada-uno)
8. [Gemelos digitales con Microsoft Azure y Fabric](#8-gemelos-digitales-con-microsoft-azure-y-fabric)
9. [Inteligencia artificial y el gemelo digital](#9-inteligencia-artificial-y-el-gemelo-digital)
10. [Hoja de ruta: implantación en seis fases](#10-hoja-de-ruta-implementación-en-seis-fases)
11. [Calidad de los datos: el requisito previo subestimado](#11-calidad-de-los-datos-el-requisito-previo-subestimado)
12. [Coste y beneficio, evaluados con honestidad](#12-coste-y-beneficio-evaluados-con-honestidad)
13. [Errores habituales y cómo evitarlos](#13-errores-comunes-y-cómo-evitarlos)
14. [Normas y directrices de un vistazo](#14-normas-y-directrices-de-un-vistazo)
15. [Categorías de software: una comparación neutral](#15-categorías-de-software-una-comparación-neutral)
16. [Seguridad, propiedad de los datos y regulación](#16-seguridad-propiedad-de-los-datos-y-regulación)
17. [Construir un gemelo a partir de datos del ERP y de la cadena de valor con iFAKT Polaris](#17-construcción-de-un-gemelo-a-partir-de-datos-de-erp-y-de-flujo-de-valor-con-ifakt-polaris)
18. [Glosario](#18-glosario)
19. [Preguntas frecuentes: gemelos digitales en la fabricación](#19-preguntas-frecuentes-gemelos-digitales-en-la-fabricación)
20. [Conclusión](#20-conclusión)

## 1. ¿Qué es un gemelo digital en la fabricación?

### Una definición de trabajo

En la práctica de la fabricación, ha resultado útil una definición de trabajo con tres condiciones:

1. **Representa una contraparte real.** El gemelo representa un objeto concreto (una máquina, una línea, una planta) o un proceso concreto, no una clase genérica.
2. **Es ejecutable.** Contiene no solo estructura y geometría, sino también comportamiento. Puede avanzar estados, recorrer operaciones y responder a preguntas del tipo "¿qué pasa si ...?".
3. **Está conectado a la realidad mediante datos.** Se actualiza con datos de operación, idealmente de forma automática, y sus resultados retroalimentan las decisiones o los controles.

Sin el punto 2, se tiene una base de datos o un modelo 3D. Sin el punto 3, se tiene un modelo de simulación. Ambos son útiles, pero ninguno es un gemelo en sentido estricto.

Las instituciones estadounidenses definen el término en la misma línea. La definición del Digital Twin Consortium, del 3 de diciembre de 2020, describe un gemelo digital como "una representación virtual de entidades y procesos del mundo real, sincronizada a una frecuencia y fidelidad especificadas" [51]. El informe de consenso de 2024 de las National Academies of Sciences, Engineering, and Medicine, patrocinado por el Departamento de Defensa, el Departamento de Energía, los National Institutes of Health y la National Science Foundation de EE. UU., describe un gemelo digital como un conjunto de constructos de información virtuales que imita la estructura, el contexto y el comportamiento de un sistema, "se actualiza dinámicamente con datos de su gemelo físico, tiene capacidad predictiva e informa decisiones que generan valor", y añade: "La interacción bidireccional entre lo virtual y lo físico es central en el gemelo digital" [50]. NIST describe los gemelos digitales como representaciones electrónicas de entidades del mundo real que permiten observar esas entidades y sus cambios de estado, y analiza los problemas de seguridad y confianza que plantean [49]. Las tres definiciones contienen los mismos elementos que la definición de trabajo anterior: una contraparte real, un comportamiento y una conexión de datos.

### Gemelo digital, fábrica inteligente, fábrica digital: términos aclarados

En inglés, se ven "digital twin in manufacturing", "manufacturing digital twin", "factory digital twin" y "production digital twin" usados para el mismo concepto. La **fábrica inteligente** (o manufactura inteligente) es otra cosa: una planta conectada y en gran medida autoorganizada, como imagen objetivo de la Industria 4.0. El gemelo digital es una de sus herramientas, no un sinónimo. La **fábrica digital** es un término paraguas más antiguo y orientado a la planificación, procedente de la directriz alemana VDI 4499 para modelos, métodos y herramientas digitales (véase más abajo); en Norteamérica, los términos más cercanos en el uso cotidiano son "digital manufacturing" y "virtual manufacturing". Términos como simulación de producción, simulación de fábrica y simulación del flujo de materiales describen métodos que un gemelo digital puede utilizar. **Hilo digital** (digital thread) describe el flujo conectado de información a lo largo del ciclo de vida; la ISO 23247-5 lo aborda ahora de forma explícita [7].

### Orígenes: de Grieves y la NASA a la Industria 4.0

El concepto procede de la gestión del ciclo de vida del producto (PLM). Michael Grieves presentó en 2002 un modelo que vinculaba un espacio real, un espacio virtual y el flujo de datos e información entre ambos. Sitúa la primera presentación en un foro directivo de la Society of Manufacturing Engineers (SME) en octubre de 2002 y una presentación en la Universidad de Michigan en diciembre de 2002 [2]. El modelo se llamó primero "Mirrored Spaces Model" (2005), después "Information Mirroring Model" (2006) y más tarde "Digital Twin"; según Grieves, el concepto en sí se mantuvo igual [2]. Grieves atribuye el nombre "digital twin" a John Vickers, de la NASA [1][2]. Otros autores señalan que el origen no puede documentarse sin lagunas y que hubo precursores anteriores, como la investigación sobre fabricación virtual en la década de 1990 [4].

El término ganó gran atención a través de la aeroespacial. La NASA describió el gemelo digital en su hoja de ruta tecnológica "Modeling, Simulation, Information Technology & Processing" (Shafto et al., borrador de 2010) [4]. En 2012, Glaessgen y Stargel formularon la definición muy citada, para la NASA y la Fuerza Aérea de EE. UU., de un gemelo digital como una "simulación integrada, multifísica, multiescala y probabilística de un vehículo o sistema tal como fue construido", que combina simulación de altísima fidelidad con monitorización de salud, historial de mantenimiento y datos de flota para reflejar la vida de su gemelo en vuelo [3].

En la manufactura alemana, el término se vinculó a la Industrie 4.0 a partir de mediados de la década de 2010. Allí se encontró con una tradición anterior e independiente: la **Fábrica Digital** (VDI 4499) y la **simulación de eventos discretos del flujo de material** (VDI 3633). En EE. UU., la simulación de fábricas creció a partir de la investigación de operaciones y la ingeniería industrial, con libros de texto como el de Law [41] y herramientas comerciales de eventos discretos. A ambos lados del Atlántico, muchas herramientas que hoy se comercializan como gemelos digitales son, desde el punto de vista metodológico, descendientes de esta simulación de fábricas. Para más contexto, véase la página de entidad [Industry 4.0](https://www.m365.fm/entity/industry-4-0/).

### Definiciones formales en las normas

Existen normas formales desde 2021. La **ISO 23247** ("Automation systems and integration: Digital twin framework for manufacturing") define un marco para los gemelos digitales en la manufactura. Las partes 1 a 4 (visión general, arquitectura de referencia, representación digital de los elementos de fabricación, intercambio de información) se publicaron en octubre de 2021 (la parte 1 el 21 de octubre de 2021) [6]. La parte 5 ("Digital thread for digital twin") y la parte 6 ("Digital twin composition", publicada el 14 de julio de 2026) siguieron en 2026 [7][8]. La **ISO/IEC 30173:2023** establece términos y conceptos transversales a todas las industrias, incluidos los procesos del ciclo de vida, los tipos de gemelos digitales, una vista funcional y las partes interesadas [9].

Para los fabricantes estadounidenses, el NIST ofrece un punto de entrada práctico a la ISO 23247. Su informe *Use Case Scenarios for Digital Twin Implementation Based on ISO 23247* (NIST AMS 400-2, Guodong Shao, mayo de 2021) se escribió explícitamente para reducir la confusión sobre los gemelos digitales entre los fabricantes pequeños y medianos, y repasa tres casos de uso construidos sobre el marco [47]. El proyecto en curso del NIST "Digital Twins for Advanced Manufacturing" contribuye a la ISO 23247, trabaja en una implementación de referencia de la parte 5 (hilo digital) y propone un marco de verificación, validación y cuantificación de incertidumbre (VVUQ) como futura parte 7; señala la "falta de normas" como una de las principales barreras para la adopción [48].

Para la planificación de fábrica, sigue siendo influyente la definición alemana de la Fábrica Digital de VDI 4499 Parte 1. La edición de 2008 dice (nuestra traducción): "La Fábrica Digital es el término genérico para una red integral de modelos, métodos y herramientas digitales, incluidas la simulación y la visualización tridimensional, que se integran mediante una gestión continua de datos. Su objetivo es la planificación holística, la evaluación y la mejora continua de todas las estructuras, procesos y recursos esenciales de la fábrica real en relación con el producto." [17] En abril de 2026 apareció una nueva edición de VDI 4499 Parte 1, que aborda el término, los objetivos, los procesos, la gestión de datos y la arquitectura de sistemas de la Fábrica Digital [16]. Si la cita, compruebe si la redacción de la nueva edición difiere.

Observe la frase "estructuras, procesos y recursos ... en relación con el producto". Ya contiene el pensamiento producto-proceso-recurso sobre el que se construye un gemelo de producción (véase la sección 5, "El modelo producto-proceso-recurso como núcleo").

## 2. Modelo digital vs. sombra digital vs. gemelo digital

La distinción más citada para la fabricación procede de Kritzinger, Karner, Traar, Henjes y Sihn (Fraunhofer Austria) en 2018 [5]. Distinguen tres niveles de integración según cómo fluyen los datos entre el objeto físico y el digital.

| Atributo | Modelo digital | Sombra digital | Gemelo digital |
|---|---|---|---|
| Flujo de datos físico → digital | manual | automático | automático |
| Flujo de datos digital → físico | manual | manual | automático |
| Ejemplo típico | modelo de simulación de una línea planificada, diseño CAD | modelo de simulación actualizado a diario con pedidos y confirmaciones de ERP/MES | modelo que envía automáticamente secuencias de producción o parámetros de vuelta al sistema de control |
| Estado del objeto físico | no tiene por qué existir | existe, se observa | existe, se observa y se influye |
| Uso típico | planificación de fábrica, instalación nueva (greenfield), decisión de inversión de capital | monitorización, análisis del estado actual, previsión, validación de programación | control en bucle cerrado, programación detallada, optimización autónoma |
| Exigencias sobre TI y gobernanza | bajas | medias (interfaces, calidad de datos) | altas (tiempo real, seguridad, procesos de aprobación) |

En su revisión bibliográfica, Kritzinger et al. constataron que las publicaciones sobre el nivel más alto, el gemelo verdadero, eran escasas, mientras que los modelos y las sombras se describían con mucha más frecuencia [5]. Eso coincide con la práctica: en la planificación de fábrica y de producción, a menudo ni siquiera se desea una realimentación automática hacia los controles. Un planificador quiere comparar escenarios y luego decidir de forma deliberada. Un modelo que cambie su secuencia de producción sin aprobación sería inaceptable en muchas plantas, tanto desde el punto de vista organizativo como en términos de responsabilidad.

La consecuencia para su proyecto: no pregunte "¿Tenemos un gemelo real?". Pregunte "¿Qué nivel de integración requiere la decisión que queremos mejorar?". Para una decisión de capital sobre un nuevo edificio de montaje, basta un modelo bien validado. Para comprobar a diario si la programación de esta semana es realista, necesita una sombra con alimentación automática de datos. Solo para el control en bucle cerrado, como la secuenciación automática en una estación cuello de botella, compensa el esfuerzo de un gemelo completo.

**Una segunda mirada a la "sombra":** En la ingeniería de producción alemana, "sombra digital" a veces se usa en un sentido más estrecho, como una imagen suficientemente precisa y específica para la tarea de los datos de producción, sin capacidad de simulación. Algunos proveedores también describen la sombra como una "copia estática de datos históricos". Estas interpretaciones difieren de las de Kritzinger et al. Las fuentes estadounidenses rara vez usan el término "sombra digital" y a menudo llaman gemelo a cada nivel. Si utiliza cualquiera de estos términos en una solicitud de propuesta (RFP) o en un documento de requisitos, defínalos explícitamente.

## 3. Tipos de gemelos digitales en la fabricación

Los gemelos digitales pueden clasificarse según el objeto que representan y según la fase del ciclo de vida. La clasificación siguiente es habitual en la literatura y en la práctica, pero no está normalizada; la norma ISO/IEC 30173 describe los tipos de gemelos digitales a un nivel más general [9]. En las explicaciones de origen estadounidense suele usarse un esquema de cuatro niveles —gemelos de componente (o de pieza), de activo, de sistema (o de unidad) y de proceso—, popularizado por IBM [52]. La tabla siguiente es más específica para la fabricación.

| Tipo | Representa | Preguntas típicas | Fuentes de datos principales |
|---|---|---|---|
| Gemelo de producto | un producto a lo largo de su ciclo de vida (geometría, variantes, propiedades, estado en campo) | ¿El diseño cumple los requisitos? ¿Cómo se comporta el producto en uso? | CAD, PLM, análisis (FEA, CFD), datos de campo |
| Gemelo de proceso | un proceso de fabricación (fresado, soldadura, moldeo por inyección, montaje) | ¿Qué parámetros dan una calidad estable? ¿Dónde se generan la chatarra y el retrabajo? | controles de máquina, sensores, datos de calidad, modelos de proceso |
| Gemelo de máquina o activo | una máquina o un equipo con su cinemática, lógica de control y estado | ¿Funciona la lógica del PLC? ¿Cuándo toca el mantenimiento? | CAD mecánico, CAD eléctrico, programa del PLC, datos de estado |
| Gemelo de producción o de fábrica | la interacción de pedidos, procesos, recursos, flujo de material y logística | ¿Hay capacidad suficiente? ¿Dónde está el cuello de botella? ¿Qué distribución, qué buffer, cuántos AGV? | ERP, MES, datos de flujo de valor, distribución en planta, turnos |
| Gemelo de rendimiento u operaciones | las métricas de rendimiento en curso de un sistema | ¿Qué tendencia siguen la OEE, el lead time, la entrega a tiempo y el consumo energético? | MES, captura de datos de producción, contadores de energía, IoT |
| Gemelo de la cadena de suministro | proveedores, centros, transporte, inventario | ¿Qué ocurre si falla un proveedor? ¿Dónde conviene mantener el stock de seguridad? | ERP, SCM, datos logísticos |

Los tipos no están claramente separados, sino anidados. Un gemelo de fábrica puede incorporar un gemelo de activo más detallado para una única máquina cuello de botella. La composición de varios gemelos es precisamente lo que cubre la nueva Parte 6 de la norma ISO 23247 [8].

**Fases del ciclo de vida:** Muchos autores distinguen además el gemelo «tal como se diseñó» (estado de planificación), «tal como se construyó» (realmente construido) y «tal como se opera» o «tal como se mantiene» (en funcionamiento). Esto es relevante para la planificación de fábricas: un modelo de planificación describe una planta que todavía no existe, por lo que no debe confundirse con datos de operación que aún no pueden existir.

**Niveles de detalle:** En la simulación de eventos discretos también se distinguen niveles de agregación, desde el nivel de red y de planta, pasando por área, línea y célula, hasta la máquina individual. La norma VDI 3633 cubre la simulación a nivel de máquina con movimiento 3D, y la simulación de procesos en una parte separada [13]. La habilidad consiste en elegir el nivel tan grueso como sea posible y tan fino como sea necesario.

## 4. Niveles de madurez: de la representación al sistema autooptimizable

Los modelos de madurez le ayudan a evaluar su punto de partida y a fijar objetivos realistas. En los países de habla alemana se utiliza ampliamente el **acatech Industrie 4.0 Maturity Index** (acatech es la Academia Nacional Alemana de Ciencia e Ingeniería). Describe seis etapas de desarrollo y evalúa los recursos, los sistemas de información, la cultura y la estructura organizativa; la edición actualizada apareció en 2020 [20]. Las etapas son informatización, conectividad, visibilidad, transparencia, capacidad predictiva y adaptabilidad.

Para el gemelo digital, esto se traduce en una escala práctica:

| Nivel | Pregunta orientadora | Lo que aporta el gemelo | Requisito previo |
|---|---|---|---|
| 1 Representar | ¿Qué tenemos? | modelo estructurado de productos, procesos y recursos (datos maestros, distribución en planta) | datos maestros mantenidos, denominación coherente |
| 2 Observar | ¿Qué está ocurriendo? | estado actual a partir de confirmaciones, datos de máquinas, inventario (visibilidad) | interfaces con ERP/MES, marcas de tiempo |
| 3 Comprender | ¿Por qué ocurre? | análisis de causa raíz, identificación de cuellos de botella, análisis de desviaciones (transparencia) | datos históricos, definiciones de métricas |
| 4 Predecir | ¿Qué va a ocurrir? | simulación y previsión de plazos de entrega, utilización y fechas de vencimiento | modelo de simulación validado, datos de planificación |
| 5 Recomendar | ¿Qué deberíamos hacer? | comparación de escenarios, optimización, acciones recomendadas | función objetivo, métodos de optimización |
| 6 Actuar | ¿Qué ocurre automáticamente? | bucle cerrado hacia el control (adaptabilidad) | concepto de aprobación, seguridad de TI, responsabilidades claras |

En la documentación de consultoras y proveedores se encuentra con frecuencia una división más corta en tres tipos: gemelos descriptivos, predictivos y prescriptivos. Corresponde aproximadamente a los niveles 2 a 3, 4 y 5 a 6 de la tabla.

**Importante:** Los niveles no son una secuencia obligatoria. Un gemelo de planificación de fábrica puede aportar mucho valor en el nivel 4 sin llegar nunca al nivel 2, porque la planta planificada todavía no existe. A la inversa, un panel de monitorización en el nivel 2 no es un paso previo hacia la simulación si su modelo de datos no contiene lógica de proceso. Planifique los niveles según su pregunta, no según un modelo.

## 5. Arquitectura y base de datos: ERP, MES, PLM, IoT

### El modelo de referencia ISO 23247

La norma ISO 23247-2 organiza un gemelo digital de fabricación en dominios [6][43]:

- **Elementos observables de fabricación:** personal, equipos, material, procesos de fabricación, instalaciones, entorno, productos y documentos de apoyo [6]. Están fuera del gemelo, pero son representados por él.
- **Comunicación con dispositivos:** recopilación de datos y control de dispositivos, como conectividad de controladores, sensores y pasarelas.
- **Gemelo digital (núcleo):** representación, sincronización, aplicaciones y servicios como simulación, análisis y validación de programaciones.
- **Usuario:** personas y aplicaciones que utilizan el gemelo, como los puestos de trabajo de planificadores o los sistemas empresariales como ERP y MES.
- **Funciones transversales:** traducción de datos, aseguramiento de datos y seguridad.

Este modelo es neutral respecto a proveedores y resulta útil como esquema para un documento de requisitos o una RFP. NIST utilizó exactamente esta estructura para sus tres escenarios de caso de uso de ISO 23247 [47]. Sobre todo, deja claro un punto: el gemelo no es la visualización. Es la capa intermedia que representa, sincroniza y calcula.

### Sistemas por nivel ISA-95: ¿quién aporta qué datos?

La norma ISA-95 (ANSI/ISA-95, a nivel internacional IEC 62264) organiza los sistemas de una planta en niveles basados en el modelo de Purdue [58][19][42]: el nivel 0 es el proceso físico, el nivel 1 la detección y actuación, el nivel 2 el control de procesos (PLC, SCADA, HMI), el nivel 3 la gestión de operaciones de fabricación (MES) y el nivel 4 la planificación empresarial y la logística (ERP). ISA señala que la norma trata principalmente la interfaz entre los niveles 3 y 4 [58]. Para el gemelo digital, esto le proporciona un mapa de datos claro:

| Sistema (nivel) | Aporta al gemelo | Granularidad típica | Debilidades típicas |
|---|---|---|---|
| ERP (4) | maestro de materiales, listas de materiales, hojas de ruta, centros de trabajo, capacidades, calendarios de turnos, órdenes de venta y de producción, confirmaciones | orden, operación, día/turno | tiempos estándar desactualizados, tiempos de preparación planos, grupos de centros de trabajo demasiado gruesos |
| MES (3) | tiempos reales, motivos de paro, cantidades, chatarra, asignación de personal, secuencias | operación, minuto | códigos de motivo de paro inconsistentes, huecos en los registros manuales |
| PLM/CAD | estructura de producto (EBOM), geometría, variantes, niveles de revisión | pieza, versión | EBOM y lista de materiales de fabricación (MBOM) desincronizadas |
| Layout/CAD de planta | superficie de planta, pasillos, posiciones, transportadores | pie/metro | layouts desactualizados; en instalaciones existentes (brownfield) a menudo sin documentar |
| PLC/SCADA (2) | estados, tiempos de ciclo, señales | milisegundo a segundo | poco significado sin contexto (¿qué orden?) |
| IoT/sensores (1) | energía, temperatura, vibración, posición (p. ej., AGV) | segundo | gran volumen de datos, falta de mapeo de activos |
| Almacén/logística interna (WMS, gestor de flota AGV) | inventario, órdenes de transporte, tiempos de recorrido | orden, segundo | los tiempos de recorrido a menudo no se historizan |

Para un gemelo digital de producción y de planta, la mayor parte de la estructura que necesita se encuentra en los niveles 3 y 4. Los datos de máquina de los niveles 1 y 2 mejoran las distribuciones y los modelos de paros, pero rara vez son el punto de partida. Si conecta máquinas, importan sobre todo dos estándares abiertos: OPC UA (IEC 62541) y, frecuente en talleres de mecanizado de EE. UU., **MTConnect**, un estándar abierto para la interoperabilidad de datos de fabricación que también se publica como estándar ANSI (ANSI/MTC1.4-2018) [57]. NIST incluye una interfaz MTConnect para gemelos digitales entre sus trabajos de proyecto [48]. La entrada [From ERP to the shop floor: the digital twin](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/) muestra cómo es en la práctica ese puente entre el ERP y el piso de planta. Para los fundamentos de ERP, véase la página de entidad [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/).

### El modelo producto-proceso-recurso como núcleo

En la práctica de la fábrica digital, el **modelo producto-proceso-recurso (PPR)** se ha convertido en el principio estructurador. Vincula tres vistas:

- **Producto:** ¿Qué se fabrica? Productos terminados, conjuntos, piezas y sus relaciones (lista de materiales, variantes).
- **Proceso:** ¿Cómo se fabrica? Operaciones, secuencias, relaciones predecesor-sucesor, tiempos (preparación, ejecución, manipulación), tamaños de lote.
- **Recurso:** ¿Con qué se fabrica? Máquinas, centros de trabajo, personas con habilidades, herramental, superficie de planta, equipos de manipulación de materiales, patrones de turno.

El valor reside en las **aristas** entre los nodos: qué operación consume qué conjunto, en qué recurso, con qué tiempo, bajo qué restricción. Si modela esta red como un grafo, puede derivar automáticamente de él diagramas de red, rutas críticas, recursos cuello de botella y modelos de simulación. Dicho grafo es además la base semántica sobre la que pueden trabajar los algoritmos de planificación y los servicios de IA.

La ventaja frente a un gemelo puramente 3D o de IoT es práctica: el modelo PPR responde a las preguntas que los planificadores de producción y de planta se hacen cada día (capacidad, plazo de entrega, cuello de botella, necesidades de personal), y gran parte puede construirse a partir de datos que ya existen.

### Construir el gemelo a partir del ERP y de los datos de la cadena de valor

La historia habitual del gemelo digital empieza con los sensores. Para las cuestiones de producción, a menudo ese es el punto de partida equivocado. Su sistema ERP ya contiene el plano de su planta en forma estructurada:

| Objeto del ERP | Función en el gemelo |
|---|---|
| Maestro de materiales y lista de materiales (lista de materiales de fabricación, MBOM) | estructura del producto, explosión de necesidades, secuencia de montaje |
| Hoja de ruta con operaciones | lógica del proceso, secuencia, tiempos estándar de preparación y ejecución |
| Centro de trabajo o grupo de centros de trabajo | recursos, capacidad disponible, centro de costes |
| Calendario de fábrica y patrones de turno | tiempo disponible, pausas, turnos extra |
| Órdenes de venta y previsiones | carga, mezcla de productos, fechas de entrega |
| Órdenes de producción y confirmaciones | tiempos reales, cantidades reales, chatarra, avance |
| Parámetros de inventario y MRP | colchones, stock de seguridad, reglas de dimensionamiento de lote |

**El mapeo de la cadena de valor** ofrece la segunda perspectiva, complementaria a la primera: hace visibles los flujos de material e información, el inventario entre procesos y la lógica de control (empuje, arrastre, supermercado, FIFO), algo que las tablas del ERP solo contienen de forma indirecta. Mike Rother y John Shook popularizaron el método en 1998 con *Learning to See*, publicado por el Lean Enterprise Institute [40]. Si se combina la lógica de la cadena de valor con los datos maestros y las confirmaciones del ERP, se obtiene un modelo que captura tanto la estructura como la dinámica de un sistema productivo. El episodio [Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/) muestra cómo un mapa de la cadena de valor se convierte en un modelo de datos vivo; el método en sí se explica en la página de entidad [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) y en profundidad en nuestra guía sobre [value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/).

Este debate no es nuevo en la literatura. Ya en 2014, Türck, Weimer, Schubert y Drees describieron en la revista alemana *Zeitschrift für wirtschaftlichen Fabrikbetrieb* (ZWF) el paso del mapeo estático de la cadena de valor y sus métricas a la simulación dinámica de cadenas de valor, y plantearon qué opciones de optimización se abren cuando se añade el tiempo como dimensión [31]. En 2023, Böhm, Drees, Sai, Erlach, Stambera y Teriete presentaron en ZWF una interfaz de datos universal para servicios digitales de cadena de valor que utiliza datos de producción basados en eventos como base común para el cálculo y la visualización de métricas; se probó en el proyecto de investigación alemán ECOWERT [32].

### Semántica e interoperabilidad: Asset Administration Shell, OPC UA, DTDL

Un gemelo que vive solo en una base de datos propietaria es difícil de ampliar. Tres estándares dan forma a la interoperabilidad:

- **Asset Administration Shell (AAS):** El concepto de la Plattform Industrie 4.0 de Alemania para una representación digital normalizada de un activo. La norma IEC 63278-1:2023 (publicada el 14 de diciembre de 2023) define su estructura y pretende que las aplicaciones de software intercambien información de forma uniforme y segura; se aplica a activos físicos, digitales e intangibles a lo largo de todo el ciclo de vida [10]. El contenido se organiza en submodelos, por ejemplo para datos técnicos o datos de operación. El Modelo de Arquitectura de Referencia Alemán para Industria 4.0 (RAMI 4.0, DIN SPEC 91345:2016) describe la estructura y el comportamiento del componente Industria 4.0 que representa virtualmente un activo [12]; en el concepto de la Plattform Industrie 4.0, la AAS es la parte digital de ese componente. Su desarrollo posterior lo impulsa la **Industrial Digital Twin Association (IDTA)**, fundada el 24 de septiembre de 2020 por las asociaciones alemanas de la industria de ingeniería y electrotecnia VDMA y ZVEI junto con Bitkom y 20 empresas [11]. Una implementación de código abierto es Eclipse BaSyx, impulsada, entre otros, por Fraunhofer IESE [29].
- **OPC UA (IEC 62541):** El estándar de amplio uso para la comunicación entre máquinas independiente del fabricante, con modelos de información. Para el gemelo, OPC UA importa sobre todo en los niveles 1 a 3.
- **DTDL (Digital Twins Definition Language):** El lenguaje de modelado basado en JSON de Microsoft para Azure Digital Twins. Azure Digital Twins admite DTDL v2 y v3; Microsoft recomienda v3 [22].

Ninguno de estos estándares basta por sí solo para los gemelos de planificación de producción, porque describen principalmente activos, no la lógica de procesos ni la dinámica de los pedidos. En la práctica, por tanto, se combina un modelo de planificación (PPR, simulación) con descripciones normalizadas de activos para la conectividad.

## 6. La simulación como núcleo: simulación de fábrica, del flujo de materiales y del flujo de valor

### Qué hace la simulación y por qué los cálculos estáticos se quedan cortos

La norma VDI 3633 Parte 1 (edición de diciembre de 2014), la guía de referencia alemana, describe los fundamentos de la simulación de sistemas logísticos, de flujo de materiales y de producción, y se dirige a planificadores, proveedores y operadores [13]. Define la simulación como la reproducción de un sistema con sus procesos dinámicos en un modelo con el que se puede experimentar, con el fin de obtener conocimientos transferibles a la realidad [13][30]. El libro de texto de Law, muy utilizado en los programas de ingeniería industrial de EE. UU., aborda el mismo terreno desde el lado estadístico [41].

El punto decisivo es la **dinámica**. Un cálculo de capacidad en una hoja de cálculo trabaja con promedios: demanda por tiempo de procesamiento, dividido entre el tiempo disponible, da la utilización. Si todos los valores están por debajo del 100 por ciento, el plan parece funcionar. En la realidad, las llegadas, los tiempos de procesamiento, los tiempos de preparación y las averías varían. La teoría de colas muestra que, con tiempos variables, los tiempos de espera crecen de forma desproporcionada a medida que aumenta la utilización, y se forman grandes colas delante de una estación que funciona cerca de su límite de capacidad. Las interacciones entre estaciones (bloqueo, inanición, recursos compartidos como operarios o grúas) no pueden captarse en absoluto mediante un cálculo estático.

**Ejemplo práctico:** Para una sola estación, la aproximación de Kingman da una idea de la magnitud [46]. El tiempo de espera promedio delante de la estación es aproximadamente W ≈ (cₐ² + cₛ²) / 2 · u / (1 − u) · t, donde u es la utilización, t es el tiempo medio de procesamiento y cₐ y cₛ son los coeficientes de variación de los tiempos entre llegadas y de procesamiento. Supongamos un tiempo de procesamiento de 10 minutos y una variabilidad moderada (ambos coeficientes de variación iguales a 1):

| Utilización u | Factor u / (1 − u) | Espera promedio delante de la estación |
|---|---|---|
| 70 % | 2,3 | aprox. 23 minutos |
| 80 % | 4 | aprox. 40 minutos |
| 90 % | 9 | aprox. 90 minutos |
| 95 % | 19 | aprox. 190 minutos |

La hoja de cálculo de capacidad indica «cabe» en los cuatro casos. En realidad, el tiempo de espera casi se quintuplica entre una utilización del 80 y del 95 por ciento. En una línea con varias estaciones, preparaciones y averías, el efecto se vuelve aún más fuerte y difícil de tratar analíticamente. Aquí es donde entra la simulación.

La **Ley de Little** sigue siendo una comprobación útil de coherencia: en estado estacionario, el inventario promedio de un sistema es igual a la tasa de rendimiento promedio multiplicada por el tiempo de ciclo promedio (L = λ · W) [37]. La Ley de Little indica qué tiempo de ciclo corresponde a un inventario dado, pero no qué inventario resultará de un determinado nivel de variabilidad. Para eso se necesita la simulación.

### Comparación de los tipos de simulación

| Atributo | Simulación de eventos discretos (DES) | Simulación continua / dinámica de sistemas | Simulación basada en agentes (ABS) | Simulación física y de movimiento 3D |
|---|---|---|---|---|
| Avance del tiempo | salta de evento en evento (llegada, fin de procesamiento, avería) | continuo en pequeños pasos de tiempo, ecuaciones diferenciales | impulsado por eventos o por pasos de tiempo, según la herramienta | pasos de tiempo finos, cinemática y dinámica |
| Elementos del modelo | fuentes, sumideros, estaciones, búferes, transportadores, recursos, pedidos | stocks, flujos, bucles de retroalimentación | agentes autónomos con reglas y estados (vehículos, personas, pedidos) | cuerpos rígidos, articulaciones, sensores, señales de control |
| Preguntas típicas | rendimiento, tiempo de ciclo, utilización, cuello de botella, tamaños de búfer, necesidades de personal | capacidad estratégica y desarrollo de mercado, efecto látigo | tráfico de AGV, flujos peatonales, control descentralizado, lógica de negociación | alcanzabilidad, colisión, tiempo de ciclo de una celda robotizada, prueba de control |
| Nivel de detalle | de línea a planta | de planta a red, muy agregado | de local a red | celda, máquina |
| Fortalezas | establecida, fácil de validar, aleatoriedad incorporada | rápida, buena para retroalimentación y horizontes largos | comportamiento emergente, reglas individuales | geometría y física realistas |
| Límites | geometría normalmente simplificada | sin pedidos individuales | parametrización y validación exigentes | intensiva en cómputo, pequeña porción del sistema |
| Referencia | VDI 3633 [13], Law [41] | Forrester, *Industrial Dynamics* (MIT) [38] | no se conoce una guía VDI específica [unverified: no se encontró una fuente de referencia dedicada en el material consultado] | VDI 3633 Parte 8 (simulación a nivel de máquina) [13], VDI/VDE 3693 [14] |

En la simulación de producción y de fábricas domina la **simulación de eventos discretos**. Muchas herramientas modernas combinan paradigmas, como la producción de eventos discretos con vehículos basados en agentes o un modelo continuo de energía. El libro de texto de Law describe en detalle los fundamentos metodológicos de la simulación de eventos discretos, desde los números aleatorios y las distribuciones de entrada hasta el análisis estadístico [41].

### Simulación de flujo de materiales y simulación de fábrica

Los términos se usan a menudo como sinónimos, pero tienen énfasis distintos:

- **La simulación de flujo de materiales** sigue el recorrido del material y de los pedidos a través de la producción y la logística: transportadores, búferes, almacenamiento, manipulación de materiales, preparación de pedidos. Preguntas guía: ¿es suficiente el sistema de transportadores? ¿De qué tamaño deben ser los búferes? ¿Dónde se acumula el material?
- **La simulación de fábrica** considera la planta en su conjunto: mezcla de productos, capacidades, patrones de turnos, mano de obra, distribución en planta, logística y reglas de control. Preguntas guía: ¿puede la planta asumir el volumen? ¿Qué distribución en planta es robusta? ¿Cuánto cuesta un tercer turno frente a una máquina adicional?
- **La simulación de producción** se utiliza a menudo como término general que engloba ambas.

Para más información sobre la simulación de fábrica, consulte la página de entidad [Factory Simulation](https://www.m365.fm/entity/factory-simulation/).

### Simulación de la cadena de valor: mapeo dinámico de la cadena de valor

El mapeo clásico de la cadena de valor es una fotografía basada en promedios. Muestra inventario, plazos de entrega y flujo en un día determinado, pero no cómo se comporta la cadena de valor cuando cambia la mezcla de productos, se producen averías o cambian los tamaños de lote. La simulación de la cadena de valor cierra esta brecha tratando el mapa de la cadena de valor como un modelo ejecutable. La publicación de ZWF de 2014 mencionada anteriormente describe precisamente este paso de las métricas estáticas a una visión dinámica a lo largo del tiempo [31].

La ventaja práctica: el mapa de la cadena de valor es familiar y aceptado en la empresa. Si se deriva de él un modelo de simulación, los equipos de operaciones no tienen que aprender un nuevo mundo de modelado. Los límites aparecen en flujos de materiales muy complejos con transportadores y lógica de almacén, que requieren una simulación clásica de flujo de materiales.

### Cómo se desarrolla un estudio de simulación

La norma VDI 3633 describe la preparación, ejecución y evaluación de los estudios de simulación [13]. La siguiente secuencia ha demostrado su eficacia:

1. **Objetivo:** ¿Qué decisión se está preparando? ¿Qué métricas la determinan (rendimiento, plazo de entrega, entrega a tiempo, coste)?
2. **Frontera del sistema:** ¿Qué entra en el modelo y qué no? ¿Qué nivel de detalle se necesita?
3. **Recopilación y preparación de datos:** datos maestros, tiempos, distribuciones, averías, patrones de turnos (véase la sección 11).
4. **Construcción del modelo:** primero el modelo conceptual y después el modelo ejecutable.
5. **Verificación y validación:** ¿Está el modelo construido correctamente (verificación)? ¿Representa la realidad con suficiente precisión (validación)? Compare con datos reales y contraste con expertos en la materia.
6. **Diseño de experimentos:** escenarios, periodo de calentamiento, duración de las ejecuciones y número de réplicas.
7. **Ejecución y análisis:** métricas con intervalos de confianza en lugar de valores puntuales, análisis de sensibilidad.
8. **Documentación y traspaso:** supuestos, límites, recomendaciones.

Dos puntos se descuidan especialmente a menudo en la práctica: el **periodo de calentamiento** (un modelo que arranca vacío produce métricas distorsionadas durante los primeros días simulados) y las **réplicas** (un modelo estocástico da resultados distintos en cada ejecución; solo varias ejecuciones permiten una afirmación fiable) [41]. La misma lógica de verificación y validación es la que NIST pretende formalizar para los gemelos digitales de fabricación con su propuesta de marco VVUQ [48].

## 7. Casos de uso y los datos que necesita cada uno

La tabla siguiente clasifica los casos de uso más importantes de fabricación según su nivel de integración y sus requisitos de datos. Considérela una ayuda para la planificación: para su caso, revise primero la columna "Datos mínimos".

| Caso de uso | Decisión típica | Nivel de integración | Datos mínimos | Datos adicionales de valor |
|---|---|---|---|---|
| Planificación de la fábrica y de la distribución en planta | estructura del edificio, disposición, superficie, pasillos | modelo | programa de productos, rutas de fabricación, tiempos, requisitos de espacio, variantes de distribución | matrices de transporte, restricciones del edificio, escaneo 3D |
| Planificación de capacidad e inversiones de capital | máquina adicional, turno adicional o subcontratación | modelo o sombra | pronósticos, rutas de fabricación, centros de trabajo, patrones de turnos, disponibilidad | distribuciones de averías, matrices de preparación |
| Análisis de cuellos de botella | ¿Dónde invertir, dónde aliviar? | sombra | confirmaciones con marca de tiempo, tiempos reales, inventario | estados de las máquinas, motivos de paradas |
| Análisis de mezcla de productos y de escenarios | nuevo producto, mezcla de variantes, tamaños de lote | modelo o sombra | listas de materiales, rutas de fabricación, escenarios de mezcla | familias de preparación, reglas de secuenciación |
| Validación de la programación y APS | ¿Es factible la programación de esta semana? ¿Qué secuencia? | sombra a gemelo | órdenes, fechas de entrega, rutas de fabricación, capacidades, avance actual | disponibilidad de material, personal con habilidades |
| Puesta en marcha virtual | probar el software de control antes de la puesta en marcha física | modelo (modelo del equipo con controlador real o emulado) | diseño mecánico y eléctrico, programa del PLC, listas de E/S, modelos de comportamiento | funciones de seguridad, conceptos de operación |
| Planificación de flotas de AGV y AMR | número de vehículos, rutas, estrategia de carga | modelo, después sombra | órdenes de transporte (origen, destino, cantidad, hora), distribución, datos de los vehículos | reglas de tráfico, infraestructura de carga, tráfico mixto |
| Evaluación de energía y CO2 | picos de carga, cambios de turno, estrategias de parada | sombra | consumo eléctrico por estado, datos de estados, patrones de turnos | precios de la energía, datos medidos por máquina |
| Mantenimiento | momento del mantenimiento, almacenamiento de repuestos | sombra a gemelo | historial de fallos, horas de funcionamiento, datos de condición | sensores, modelos de daño |

### 7.1 Planificación de la fábrica y de la distribución en planta

La planificación de la fábrica es el campo clásico de la fábrica digital. En un proyecto greenfield, la planta todavía no existe, por lo que no hay datos de operación. El gemelo digital aquí es un **modelo de planificación** construido a partir del programa de productos, las rutas de fabricación y las variantes de distribución. Su función es comparar variantes bajo incertidumbre: ¿Qué distribución sigue siendo productiva si cambia la mezcla o el volumen crece un tercio?

Los proyectos brownfield son distintos: hay datos, pero a menudo no hay una distribución actual. Los escaneos láser y las nubes de puntos 3D ayudan a capturar el estado real del edificio tal como fue construido. Aun así, la lógica de procesos decide el resultado. Un modelo fotorrealista del edificio sin rutas de fabricación no responderá a ninguna pregunta de capacidad. Algunos artículos divulgativos en inglés llaman a esto la "trampa de la visualización".

Las métricas probadas para comparar variantes son el rendimiento, el tiempo de ciclo, el trabajo en proceso (WIP), el esfuerzo de transporte (tonelada-milla o viajes por hora), la superficie y los requisitos de mano de obra.

### 7.2 Análisis de capacidad y de cuellos de botella

La **Teoría de las Restricciones** de Goldratt parte de que el rendimiento de un sistema está limitado por una única restricción, y que cualquier mejora fuera de la restricción no aumenta el rendimiento [39]. El problema práctico: el cuello de botella no siempre está donde la hoja de cálculo muestra la mayor utilización. Se desplaza con la mezcla de productos, con las preparaciones y con las averías. Un modelo de simulación muestra dónde se acumulan realmente los pedidos y qué estación bloquea o deja sin trabajo a las demás. Para más información sobre el método, consulte la página de entidad [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/).

McKinsey describe un ejemplo concreto: en una línea de producción, una secuencia optimizada en la estación cuello de botella redujo el tiempo total de procesamiento en alrededor de un cuatro por ciento [26]. Cifras así suenan pequeñas, pero en un cuello de botella real se traducen directamente en rendimiento.

### 7.3 Análisis de mezcla de productos y de escenarios

Nuevos productos, más variantes, tamaños de lote más pequeños: cada uno de estos cambios desplaza la carga entre recursos. Un gemelo construido sobre un modelo PPR puede leer nuevas listas de materiales y rutas y mostrar qué recursos se vuelven críticos antes de fabricar la primera pieza. McKinsey describe una planta de fabricación metálica cuyo gemelo, con un agente de aprendizaje por refuerzo, evaluó miles de combinaciones posibles de productos en cuatro líneas de producción paralelas [26]. Los escenarios típicos incluyen:

- cambios de mezcla entre familias de productos,
- introducción de un nuevo producto en recursos existentes,
- reducción de tamaños de lote y su efecto en la proporción de tiempo de preparación,
- cambios en el modelo de turnos (de dos a tres turnos, turnos de fin de semana),
- pérdida de un recurso clave o de un proveedor.

### 7.4 Programación de la producción y planificación y programación avanzadas (APS)

Los sistemas APS crean programas y secuencias con restricciones de capacidad. Un gemelo de simulación los complementa de dos maneras: puede **ejecutar un programa por adelantado** y mostrar si se sostiene bajo una variabilidad realista, y puede servir como **función de evaluación** para los métodos de optimización que generan muchas variantes de programa. McKinsey informa de una planta de ensamblaje en la que un programa de producción rediseñado redujo las horas extra y generó ahorros de costos mensuales del 5 al 7 por ciento [26]. La página de entidad [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) explica los fundamentos de la planificación con restricciones de capacidad, y nuestra guía sobre [software de programación de la producción y APS](https://www.m365.fm/en/learn/production-scheduling-aps/) profundiza en el tema.

Mantenga claros los roles: la planificación clásica de ERP (MRP II) funciona de forma secuencial (cantidades, luego fechas, luego capacidades), a menudo con capacidad infinita. El gemelo no reemplaza al sistema ERP. Verifica y mejora sus resultados.

### 7.5 Puesta en marcha virtual

La **puesta en marcha virtual** prueba el software de control de una máquina o línea contra un modelo de simulación antes de que el equipo físico esté instalado. La guía más detallada es alemana: VDI/VDE 3693 Parte 1 (agosto de 2016) define la puesta en marcha virtual para la automatización de procesos y de fábricas, con el objetivo de encontrar y corregir errores de la ingeniería de los sistemas de automatización, y describe los tipos de modelos y los términos [14]. La Parte 2 (diciembre de 2018) aborda la introducción de la puesta en marcha virtual en las empresas; VDI ha anunciado una revisión [15]. No encontramos ninguna norma ANSI o ISA dedicada a la puesta en marcha virtual [unverified: no se halló una norma ANSI o ISA específica; búsqueda no exhaustiva]; los integradores estadounidenses suelen trabajar con estos conceptos y con los métodos propios de sus proveedores de herramientas.

Son comunes tres variantes de acoplamiento:

| Variante | Controlador | Equipo | Uso |
|---|---|---|---|
| Model-in-the-loop (MiL) | como modelo | como modelo | verificación temprana del concepto |
| Software-in-the-loop (SiL) | programa de control real en un PLC emulado o virtual | como modelo | prueba de la lógica del PLC sin hardware |
| Hardware-in-the-loop (HiL) | hardware de controlador real | como modelo en tiempo real | prueba incluyendo el comportamiento temporal y los sistemas de bus de campo |

El beneficio es trasladar la resolución de problemas de la costosa fase de puesta en marcha en planta a una fase anterior y más barata. Los porcentajes fiables de ahorro de tiempo en toda la industria son escasos; muchas cifras publicadas son afirmaciones de proveedores. Un ejemplo documentado: en una línea de preensamblaje de su planta de Saarbrücken, Alemania, ZF, trabajando con Fraunhofer IESE, esperaba poner en marcha alrededor de un 30 por ciento más rápido usando un gemelo digital y el middleware Eclipse BaSyx; en 2021 esto era una expectativa, no un valor medido en muchos proyectos [28]. Un estudio de 2024 del Fraunhofer IWU entre fabricantes de máquinas y equipos del estado alemán de Sajonia encontró que más del 90 por ciento de las empresas encuestadas conoce la puesta en marcha virtual, pero solo unas pocas aprovechan su potencial en la práctica [27].

**Puesta en marcha virtual vs. gemelo de fábrica:** La puesta en marcha virtual trabaja a nivel de señales y control, a menudo en milisegundos. Un gemelo de fábrica trabaja a nivel de pedidos y recursos, en minutos a turnos. Ambos pueden usar la misma distribución en planta, pero responden a preguntas distintas. Más información en la página de entidad [Virtual Commissioning](https://www.m365.fm/entity/virtual-commissioning/).

### 7.6 Planificación de flotas de AGV y AMR

Los vehículos de guiado automático (AGV) y los robots móviles autónomos (AMR) son un caso típico para la simulación, porque su comportamiento depende de interacciones: los vehículos se bloquean mutuamente en las intersecciones, esperan en las estaciones de transferencia, regresan vacíos y necesitan cargarse. Un cálculo estático (órdenes de transporte por hora multiplicadas por el tiempo medio de recorrido) suele subestimar el número de vehículos necesarios, porque no incluye los viajes en vacío, los tiempos de espera y las paradas para carga.

En materia de seguridad, dos normas estadounidenses enmarcan estos proyectos. **ANSI/ITSDF B56.5-2024**, *Safety Standard for Guided Industrial Vehicles*, define los requisitos de seguridad para el diseño, la operación y el mantenimiento de vehículos industriales automáticos guiados, motorizados y sin conductor, y de los sistemas de los que forman parte [53]. **ANSI/A3 R15.08-1-2020 (R2026)**, *Industrial Mobile Robots: Safety Requirements, Part 1*, se dirige a los fabricantes de robots móviles industriales y se basa en la evaluación de riesgos dentro de un entorno de operación documentado [54]. En Alemania, la directriz **VDI 2510** cubre los sistemas de AGV para el flujo de materiales en planta; la edición vigente es de 2005, y en julio de 2025 se publicó un borrador que aborda los sistemas de AGV y AMR, incluidos los tipos de vehículo, el control de flota, la navegación, el suministro de energía, la transmisión de datos, la infraestructura y la seguridad [18]. Una simulación no sustituye la evaluación de riesgos que exigen estas normas, pero muestra pronto dónde las reglas de tráfico, las zonas de velocidad y el tráfico mixto con personas generan conflictos.

Preguntas típicas para una simulación de AGV:

- ¿Cuántos vehículos necesitamos en la carga máxima y cuántos en promedio?
- ¿Qué rutas, reglas de sentido único y posiciones de espera evitan la congestión?
- ¿Qué estrategia de carga (carga de oportunidad o cambio de batería) mantiene alta la disponibilidad?
- ¿Cómo afecta el tráfico mixto con carretillas elevadoras y peatones al rendimiento?
- ¿Qué ocurre si falla un vehículo o una estación de transferencia?

**Ejemplo práctico con valores ilustrativos:** Supongamos que un área de montaje necesita 60 transportes por hora, y que un viaje cargado dura 3 minutos de media. El cálculo ingenuo da 60 × 3 = 180 minutos de recorrido por hora, es decir, 3 vehículos. Si añadimos el recorrido en vacío hasta la siguiente recogida (también 3 minutos en este caso) y 1 minuto para la recogida y otro para la entrega, cada transporte ocupa 8 minutos, o sea, 480 minutos por hora: 8 vehículos plenamente utilizados. Con una utilización objetivo del 80 por ciento y una disponibilidad del 85 por ciento debido a la carga, se obtiene 8 / (0,8 × 0,85) ≈ 11,8, es decir, 12 vehículos. Todavía no se incluyen la congestión en las intersecciones ni la espera en las estaciones de transferencia; solo la simulación permite verlas.

El requisito de datos es manejable, pero a menudo se subestima: se necesita una **matriz de transporte** (de dónde a dónde, con qué frecuencia y en qué momento), que puede derivarse de las hojas de ruta, las listas de materiales y el concepto de abastecimiento en línea. Aquí es donde un modelo PPR resulta rentable, porque ya conoce las necesidades de material por operación. Para controlar flotas mixtas reales se utilizan cada vez más entornos 3D basados en física; NVIDIA, por ejemplo, describe su blueprint "Mega" (presentado como vista previa en 2025) como un flujo de trabajo de referencia para probar flotas de robots en gemelos digitales de instalaciones [25]. Más información en la página de entidad [Automated Guided Vehicle](https://www.m365.fm/entity/automated-guided-vehicle/).

### 7.7 Energía y CO2

Un gemelo de producción puede modelar el consumo energético por estado: una máquina consume potencias distintas al procesar, en reposo, durante el cambio de utillaje y parada. Combinado con el flujo de pedidos, la simulación muestra los picos de carga y el efecto de medidas como desplazar turnos, apagar automáticamente durante las pausas o modificar secuencias. El requisito previo son los valores de potencia por estado, que se miden o se derivan de los datos del fabricante. Las cifras fiables sobre el potencial de ahorro dependen en gran medida del caso concreto; conviene desconfiar de los porcentajes generales.

### 7.8 Mantenimiento

El mantenimiento predictivo se cita a menudo como el ejemplo principal de gemelo digital. En la práctica, son dos disciplinas distintas: la monitorización del estado y la predicción de fallos trabajan con datos de sensores y modelos estadísticos o físicos de daño a nivel de activo. Un gemelo de producción puede beneficiarse si toma el tiempo de parada previsto como escenario y muestra qué pedidos se ven afectados y cuándo una ventana de mantenimiento causa el menor perjuicio.

## 8. Gemelos digitales con Microsoft Azure y Fabric

Muchos fabricantes ejecutan su TI corporativa en Microsoft 365 y Azure. Para ellos, la pregunta es qué servicios de Microsoft son candidatos para gemelos digitales y cuál es su estado. El episodio [Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/) ofrece una visión general del papel de Azure.

### Azure Digital Twins

**Azure Digital Twins** es una oferta de plataforma como servicio (PaaS) para crear grafos de gemelos basados en modelos digitales de entornos completos, como edificios, fábricas, redes energéticas o ciudades [21]. Los modelos se escriben en el **Digital Twins Definition Language (DTDL)**. Azure Digital Twins admite DTDL v2 y v3, y Microsoft recomienda v3 por sus capacidades ampliadas; una interfaz v3 puede extender una interfaz v2, pero no al revés [22]. Microsoft también proporciona ontologías que agrupan modelos DTDL basados en estándares de la industria [22]. La página de descripción general no contenía ningún aviso de retirada cuando la revisamos [21].

Azure Digital Twins es una plataforma de modelado y grafos, no un software de simulación. Representa relaciones y estados, y procesa eventos; la simulación de eventos discretos, la comparación de escenarios o la optimización deben proceder de otras herramientas.

### Digital twin builder en Microsoft Fabric (versión preliminar)

Con **digital twin builder**, Microsoft introdujo en 2025 un elemento en la carga de trabajo Real-Time Intelligence de Microsoft Fabric. Se utiliza para modelar conceptos de negocio como activos y procesos en una **ontología**, asignar datos de diversos sistemas de origen a instancias de estos tipos de entidad y crear relaciones semánticas entre ellos; los datos residen en OneLake [23]. En el momento de redactar este texto, Microsoft califica explícitamente a digital twin builder como **versión preliminar** (Microsoft Learn, página actualizada por última vez el 20 de mayo de 2026; consultada el 20 de noviembre de 2026) [23]. Microsoft también señala que digital twin builder es un servicio distinto de Azure Digital Twins [21][23]. En el blog de Fabric, Microsoft menciona ejemplos de fabricación, como gemelos de máquinas y procesos para análisis de causa raíz y preguntas de tipo "qué pasaría si", así como socios que proporcionan esquemas de datos de fabricación y consultas de KPI, por ejemplo para la eficacia global del equipo (OEE) [24].

### ¿Qué servicio para qué fin?

| Necesidad | Enfoque adecuado | Nota |
|---|---|---|
| Grafo de activos, espacios y equipos con procesamiento de eventos, en producción | Azure Digital Twins con DTDL v3 [21][22] | servicio PaaS de disponibilidad general; añadir simulación por separado |
| Ontología sobre datos de ERP, MES y sensores en una plataforma de datos Fabric | digital twin builder en Fabric [23] | versión preliminar: para pilotos y evaluación; verificar el uso en producción según los términos de versión preliminar de Microsoft |
| Capacidad, cuellos de botella, escenarios, distribución | herramienta de simulación (sección 15), resultados en Fabric o Power BI | ni Azure Digital Twins ni digital twin builder son software de simulación |

### Qué aportan los administradores de M365 y Azure

Un gemelo de producción no es un proyecto puramente OT. TI aporta bloques de construcción esenciales:

- **Identidad y permisos:** ¿Quién puede crear escenarios y quién puede aprobar resultados? Roles en Microsoft Entra ID, derechos separados para modelado, análisis y reescritura de datos.
- **Plataforma de datos:** conexión de ERP y MES a una plataforma central de datos, historización, reglas de calidad de datos, catálogos.
- **Gobernanza:** clasificación de datos de producción y de clientes, retención, registros de acceso. Para proveedores de defensa, esto incluye el manejo de información no clasificada controlada (CUI) según DFARS y CMMC; nuestra guía sobre [planificación de producción aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/) cubre esas normas.
- **Informes y colaboración:** publicación de resultados de simulación en Power BI, canales de Teams para decisiones sobre escenarios, control de versiones de los estados del modelo.
- **Seguridad:** segmentación de red entre TI y OT, sin acceso de escritura directo desde la nube a los controladores sin una cadena de aprobación definida (véase la sección 16).

Nuestra guía sobre [Azure para la fabricación](https://www.m365.fm/en/learn/manufacturing-it-azure/) trata en detalle la TI de fabricación en Azure.

## 9. Inteligencia artificial y el gemelo digital

La IA y el gemelo digital se complementan en ambas direcciones: el gemelo proporciona a la IA un contexto estructurado y un espacio seguro para experimentar, y la IA acelera y amplía el gemelo. Cinco patrones son relevantes en la fabricación:

1. **Preparación de datos:** El aprendizaje automático detecta valores atípicos en las confirmaciones, estima tiempos faltantes y deriva distribuciones a partir de datos reales. No es espectacular, pero suele ser la palanca práctica más importante.
2. **Modelos sustitutos:** Un modelo de simulación detallado se utiliza para "entrenar" una red neuronal u otro modelo sustituto con muchas ejecuciones; a partir de ese momento, el sustituto entrega aproximaciones en segundos. Es útil para optimizaciones que requieren muchísimas evaluaciones. Los límites se encuentran fuera del rango de entrenamiento.
3. **Optimización y aprendizaje por refuerzo:** Los agentes aprenden reglas de control dentro del modelo de simulación, por ejemplo para la secuenciación o el despacho de vehículos, sin perturbar la producción real. El ejemplo de McKinsey sobre fabricación metálica de la sección 7.3 utilizó este enfoque [26]. Las reglas solo son tan buenas como la fidelidad del modelo.
4. **IA generativa como interfaz:** Los modelos de lenguaje traducen preguntas como "¿Qué ocurre si la línea 3 está parada una semana?" en escenarios y explican los resultados. El requisito previo es un modelo semánticamente limpio (ontología, grafo PPR) para que la IA no adivine.
5. **IA física y robótica:** Los gemelos 3D basados en física sirven como entornos de entrenamiento y prueba para robots y vehículos autónomos; NVIDIA posiciona Omniverse y el blueprint Mega, basados en OpenUSD, con este fin [25].

**Una evaluación sobria:** La IA no reemplaza ni la validación ni la experiencia en el dominio. Un modelo de lenguaje que trabaja con un enrutamiento defectuoso produce rápidamente respuestas plausibles pero erróneas. El orden es, por tanto: primero la base de datos y el modelo, después la IA.

## 10. Hoja de ruta: implementación en seis fases

La siguiente hoja de ruta es una guía para el gemelo de una planta de producción o de una fábrica. Las duraciones corresponden a la experiencia del autor para una planta de tamaño mediano con un primer caso de uso claramente delimitado [unverified: experiencia del autor, sin datos de referencia]; McKinsey indica un rango de dos a tres meses hasta más de un año para proyectos de gemelos, según las capacidades del equipo y la complejidad de la planta [26]. La entrada [Digital twin in manufacturing: where to start](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/) también describe cómo dar el primer paso.

| Fase | Contenido | Resultado | Duración típica |
|---|---|---|---|
| 1 Pregunta | nombrar la decisión, fijar métricas y objetivos, asignar responsables | carta de proyecto de una página con la pregunta guía, métricas y límites del sistema | 2–4 semanas |
| 2 Inventario de datos | revisar datos de ERP, MES y distribución en planta, comprobar la calidad de los datos, cerrar brechas | mapa de datos, informe de calidad, lista de acciones | 3–6 semanas |
| 3 Modelo piloto | modelo PPR para una cadena de valor o área, modelo de simulación ejecutable | modelo piloto validado | 6–12 semanas |
| 4 Validación y primera decisión | comparar con datos reales, ejecutar escenarios, preparar la decisión | decisión documentada con supuestos | 2–6 semanas |
| 5 Puesta en operación | alimentación automática de datos, roles, procesos de mantenimiento, validación periódica del modelo | funcionamiento en paralelo en la operación habitual | 2–6 meses |
| 6 Escalado | más áreas, plantas y casos de uso; acoplamiento con APS, energía, AGV | cartera de gemelos sobre una base de datos común | continuo |

**Principios rectores de la hoja de ruta:**

- **Primero, una decisión.** Un gemelo que mejora una decisión concreta de inversión o planificación financia la fase siguiente.
- **Los datos antes que la plataforma.** Compruebe la calidad de los datos antes de seleccionar herramientas.
- **La operación al frente.** Planificadores y supervisores deben entender y confiar en el modelo. Un modelo que solo puede manejar el grupo de simulación desaparece con el siguiente cambio de personal.
- **El mantenimiento desde el primer día.** Decida pronto quién actualizará el modelo cuando cambien los enrutamientos, las distribuciones en planta o los patrones de turnos.

**Ayuda para pequeños y medianos fabricantes:** En EE. UU., el NIST Manufacturing Extension Partnership (MEP), un programa del National Institute of Standards and Technology del Departamento de Comercio con más de 450 centros de servicio en los 50 estados y Puerto Rico, es un punto de partida habitual para los fabricantes más pequeños que quieren apoyo externo en proyectos de digitalización [60]. El informe de casos de uso de NIST sobre la norma ISO 23247 se redactó precisamente pensando en este público [47].

## 11. Calidad de los datos: el requisito previo subestimado

En muchos proyectos de gemelo digital, la primera revisión de datos ya lo deja en evidencia: los datos maestros del sistema ERP describen la planta más como fue planificada en su momento que como funciona hoy. Esto no es una crítica a la gestión de datos maestros. Se debe a que los sistemas ERP se mantienen principalmente para el costeo y la planificación de materiales, no para la simulación.

### Problemas típicos de datos

- **Tiempos estándar** proceden de costeo o de estudios de tiempos realizados hace años (en Alemania, a menudo estudios REFA, el equivalente alemán del estudio clásico de tiempos de la ingeniería industrial) y se desvían considerablemente de los tiempos reales.
- **Tiempos de preparación** se almacenan como valores fijos, aunque en la práctica dependen de la secuencia (matriz de preparación).
- **Grupos de centros de trabajo** agrupan máquinas que en realidad difieren (antigüedad, disponibilidad, habilidades de los operarios).
- **Calendarios de turnos** no reflejan turnos adicionales, periodos de jornada reducida (en Alemania: *Kurzarbeit*, el trabajo a tiempo reducido subvencionado por el Estado) ni escasez de personal.
- **Paradas** no se registran en absoluto en el ERP y se capturan en el MES con códigos de motivo inconsistentes.
- **Listas de materiales de fabricación** se desvían de la lista de materiales de ingeniería sin que la desviación esté documentada.
- **Confirmaciones** se registran en bloque al final del turno, por lo que las marcas de tiempo no reflejan la secuencia real de eventos.
- **Tiempos de desplazamiento** y rutas internas en la planta faltan por completo.

### Lista de verificación antes de construir el modelo

| Control | Pregunta | Método |
|---|---|---|
| Completitud | ¿Tiene cada material relevante una hoja de ruta y cada operación un centro de trabajo? | consulta de vínculos faltantes |
| Vigencia | ¿Cuándo se revisaron por última vez los tiempos estándar? | fecha de modificación por hoja de ruta |
| Verosimilitud | ¿Qué tan grande es la brecha entre tiempos estándar y reales? | comparación con confirmaciones de tres a seis meses |
| Granularidad | ¿Son los centros de trabajo lo bastante detallados para la pregunta planteada? | contraste con el layout y un recorrido gemba |
| Consistencia | ¿Coinciden los nombres entre ERP, MES y layout? | tabla de correspondencias |
| Marcas de tiempo | ¿Se registran las confirmaciones con prontitud? | distribución de las horas de registro a lo largo del turno |
| Paradas | ¿Existe un catálogo único de motivos de parada? | análisis de frecuencia de los motivos |
| Responsabilidad | ¿Quién mantiene cada dato y quién aprueba los cambios? | matriz RACI |

**Regla práctica:** Un modelo de simulación puede salvar las lagunas de datos con supuestos, siempre que los supuestos estén documentados y se prueben mediante análisis de sensibilidad. Un gemelo que calcule silenciosamente con tiempos estándar erróneos es peligroso, porque aparenta precisión.

Un efecto secundario que muchas empresas subestiman: el inventario de datos necesario para un gemelo suele mejorar por sí solo la calidad de la planificación en el sistema ERP, porque deja al descubierto hojas de ruta desactualizadas y capacidades erróneas.

## 12. Coste y beneficio, evaluados con honestidad

### Factores de coste

Según la valoración del autor, el coste de un gemelo digital de producción suele estar dominado no por el software sino por el trabajo de datos y de modelado. Los principales factores de coste son:

- **Preparación de datos:** interfaces, depuración, mapeo, aclaración con el negocio.
- **Modelado y validación:** construcción del modelo PPR y del modelo de simulación, y su comparación con la realidad.
- **Mantenimiento:** actualizaciones cuando cambian productos, procesos o distribuciones. Esta partida falta en muchos casos de negocio.
- **Formación:** formación de planificadores y usuarios clave, y desarrollo de capacidad interna.
- **Software e infraestructura:** licencias, recursos en la nube, integración.

Para los estudios de simulación, una empresa alemana de servicios de simulación indica como regla práctica que el coste no debería superar el 1 por ciento de la inversión afectada, y cita estudios y benchmarks (incluido VDI) que sitúan la relación coste-beneficio en torno a 1:6 de media [30]. Estos valores proceden de una fuente del proveedor; consulte los estudios originales antes de usarlos en su propio caso de negocio.

### Ejemplos documentados de beneficio

Las cifras de beneficio fiables y recogidas de forma independiente son escasas. Los siguientes valores tienen fuente, pero son casos individuales:

| Fuente | Contexto | Valor |
|---|---|---|
| McKinsey (2024) [26] | planta de montaje, programa de producción rediseñado | ahorro de costes mensual del 5–7 % por menos horas extra |
| McKinsey (2024) [26] | optimización de secuencia en una estación cuello de botella | aprox. 4 % menos de tiempo total de procesamiento |
| McKinsey (2024) [26] | encuesta a 75 directivos industriales senior (junio de 2022) | 86 % considera aplicables los gemelos, 44 % ya ha implantado uno, 15 % planea hacerlo |
| ZF / Fraunhofer IESE (2021) [28] | línea de premontaje, Saarbrücken (Alemania), middleware Eclipse BaSyx | aprox. 30 % más rápida la puesta en marcha (expectativa, no promedio) |
| Fraunhofer IWU (2024) [27] | encuesta a fabricantes de máquinas y equipos en Sajonia (Alemania) | más del 90 % conoce la puesta en marcha virtual, pero solo unos pocos aprovechan su potencial |

Como contexto del clima de inversión en EE. UU.: en la Encuesta de Fabricación Inteligente y Operaciones 2025 de Deloitte (600 directivos de fabricantes estadounidenses con ingresos de 500 millones de dólares o más, realizada entre agosto y septiembre de 2024), el 78 por ciento de los líderes afirmó destinar más del 20 por ciento de su presupuesto de mejora a iniciativas de fabricación inteligente; los encuestados informaron de mejoras de hasta el 20 por ciento en la producción [56]. Son cifras autodeclaradas para la fabricación inteligente en general, no para los gemelos digitales en particular.

### El caso de negocio en cinco preguntas

1. **¿Qué decisión** mejora el gemelo, y con qué frecuencia se toma (una vez para un proyecto de capital, o semanalmente en la programación)?
2. **¿Cuánto cuesta una decisión errónea** (inversión sobredimensionada o infradimensionada, entregas tardías, horas extra, roturas de stock)?
3. **¿Cuánto más precisa** se vuelve la decisión con el gemelo? Un piloto le ofrece una primera comparación entre plan, simulación y resultados reales.
4. **¿Cuánto cuesta el gemelo** durante tres a cinco años, incluido el mantenimiento?
5. **¿Qué beneficios derivados** aparecen (mejores datos maestros, comprobación más rápida de presupuestos, reutilización en otras áreas)?

Para decisiones de capital de millones de dólares, un único error de dimensionamiento evitado puede justificar un proyecto de simulación. Para gemelos de planificación continua, decide la frecuencia de uso.

## 13. Errores comunes y cómo evitarlos

| Error | Consecuencia | Contramedida |
|---|---|---|
| la tecnología antes que la pregunta | plataforma costosa sin beneficio | carta de proyecto de una página con una decisión concreta y una métrica antes de seleccionar cualquier herramienta |
| confundir la visualización 3D con un gemelo digital | imágenes atractivas, sin respuestas a las preguntas de capacidad | primero la lógica de procesos (PPR), después la geometría |
| modelar todo a la vez | el proyecto nunca termina | una cadena de valor o un área como piloto |
| adoptar datos maestros sin verificar | resultados con apariencia de precisión pero incorrectos | comprobación de calidad de datos (sección 11), comparación con los tiempos reales |
| no validar | pérdida de confianza ante la primera desviación | comparación sistemática con datos reales, supuestos documentados |
| promedios en lugar de distribuciones | cuellos de botella e inventario subestimados | distribuciones a partir de datos reales, desglose de los modelos |
| una sola réplica de simulación | un resultado aleatorio presentado como la verdad | varias réplicas, intervalos de confianza [41] |
| sin plan de mantenimiento | modelo desactualizado tras unos pocos meses | roles, procesos y presupuesto para el mantenimiento |
| modelo solo para especialistas | el conocimiento se va con una sola persona | interfaces comprensibles, formación, documentación |
| bucle de retroalimentación sin aprobación | riesgo de seguridad y de responsabilidad | aprobación humana, registro, concepto de seguridad TI/OT |
| términos no definidos | malentendidos en RFP y contratos | especificar explícitamente el nivel de integración (modelo, sombra, gemelo) [5] |

## 14. Normas y directrices de un vistazo

| Norma/directriz | Título (abreviado) | Estado | Relevancia |
|---|---|---|---|
| ISO 23247-1 a -4 | Marco de gemelo digital para la manufactura: visión general, arquitectura de referencia, representación digital, intercambio de información | 2021 [6] | marco y estructura para gemelos de manufactura |
| ISO 23247-5 | Hilo digital para gemelo digital | 2026 (listada en el catálogo de ISO como Edición 1, 2026-06, y todavía mostrada como "en publicación" el 20 de noviembre de 2026) [7] | vinculación de la información del ciclo de vida |
| ISO 23247-6 | Composición de gemelos digitales | publicada el 14 de julio de 2026 [8] | composición de varios gemelos |
| NIST AMS 400-2 | Escenarios de caso de uso para la implementación de gemelos digitales basados en ISO 23247 | mayo de 2021 [47] | guía de implementación en EE. UU. para ISO 23247 |
| ISO/IEC 30173 | Gemelo digital: conceptos y terminología | noviembre de 2023 [9] | términos transversales a industrias |
| NIST IR 8356 | Consideraciones de seguridad y confianza para la tecnología de gemelos digitales | febrero de 2025 [49] | seguridad y confianza |
| IEC 63278-1 | Asset Administration Shell para aplicaciones industriales, Parte 1: Estructura | 14 de diciembre de 2023 [10] | Asset Administration Shell |
| DIN SPEC 91345 | Modelo de arquitectura de referencia Industrie 4.0 (RAMI 4.0) | 2016 [12] | marco de la Industria 4.0 (alemán) |
| ANSI/ISA-95 (IEC 62264) | Integración de sistemas de control empresarial | serie de normas [58][19] | niveles ERP/MES/control, modelos de datos |
| ANSI/MTC1.4-2018 (MTConnect) | interoperabilidad de datos de manufactura | edición 2018 [57] | datos de máquinas, común en talleres de mecanizado de EE. UU. |
| IEC 62541 (OPC UA) | OPC Unified Architecture | serie de normas | comunicación con máquinas y modelos de información |
| VDI 3633 Parte 1 | Simulación de sistemas en manejo de materiales, logística y producción: fundamentos | diciembre de 2014 [13] | método del estudio de simulación (alemán) |
| VDI/VDE 3693 Parte 1 | Puesta en marcha virtual: tipos de modelo y glosario | agosto de 2016 [14] | términos de puesta en marcha virtual (alemán) |
| VDI/VDE 3693 Parte 2 | Puesta en marcha virtual: introducción en empresas | diciembre de 2018, revisión anunciada [15] | introducción de la puesta en marcha virtual (alemán) |
| VDI 4499 Parte 1 | Fábrica digital: fundamentos | nueva edición en abril de 2026 (primera edición en febrero de 2008) [16] | término y arquitectura de la fábrica digital (alemán) |
| ANSI/ITSDF B56.5-2024 | Norma de seguridad para vehículos industriales guiados | 2024 [53] | seguridad de AGV (EE. UU.) |
| ANSI/A3 R15.08-1-2020 (R2026) | Robots móviles industriales: requisitos de seguridad, Parte 1 | ratificada en 2026 [54] | seguridad de AMR (EE. UU.) |
| VDI 2510 | Sistemas de vehículos guiados automáticamente (AGVS) | octubre de 2005, borrador de julio de 2025 [18] | AGV y AMR (alemán) |
| ISA/IEC 62443 | Seguridad para sistemas de automatización y control industrial | serie de normas [59] | seguridad de los sistemas de automatización |
| NIST SP 800-82 Rev. 3 | Guía de seguridad de tecnología operativa (OT) | septiembre de 2023 [55] | guía de seguridad OT (EE. UU.) |

## 15. Categorías de software: una comparación neutral

El mercado es difícil de navegar porque muchos proveedores llaman "gemelo digital" a su producto. Una clasificación por función resulta más útil:

| Categoría | Función principal | Fortalezas | Límites | Usuarios típicos |
|---|---|---|---|---|
| Herramientas de simulación de eventos discretos | simulación de flujo de material y de fábrica | alta libertad de modelado, método consolidado | la construcción del modelo requiere esfuerzo y necesita experiencia | expertos en simulación, planificación de fábrica |
| Herramientas de simulación multimétodo | combinación de eventos discretos, basada en agentes y dinámica de sistemas | flexibles para preguntas mixtas | curva de aprendizaje pronunciada | expertos en simulación y logística |
| Suites de fábrica digital y PLM | distribución en planta, robótica, planificación de procesos, simulación en un contexto PLM | continuidad desde el diseño hasta la producción | complejidad, coste de licencias | grandes empresas, automoción |
| Herramientas de puesta en marcha virtual | modelos de equipos con acoplamiento a PLC (SiL/HiL) | pruebas de control antes de la instalación | centradas en el equipo, no en la planta | ingenieros de control, fabricantes de máquinas |
| Herramientas de planificación basadas en cadena de valor y PPR | modelo a partir de datos de ERP y de cadena de valor, simulación, escenarios | construcción rápida a partir de datos existentes, cercanía a las operaciones | menos adecuadas para sistemas de transporte detallados | planificación de producción, lean, dirección de planta |
| Sistemas APS | planificación y secuenciación con restricciones de capacidad | programación operativa | la simulación suele ser limitada | planificación y control de producción |
| Plataformas IoT y de gemelos | modelos de activos, procesamiento de eventos, grafos (p. ej., Azure Digital Twins) | escala, integración, tiempo real | sin simulación de serie | TI, equipos de plataformas de datos |
| Plataformas 3D y de física | escenas fotorrealistas, física, entrenamiento de robots (p. ej., con OpenUSD) | visualización, robótica, entrenamiento de IA | la lógica de procesos y la dinámica de pedidos no son el foco | robótica, grandes proyectos |

**Criterios de selección:** ¿La herramienta se ajusta a la pregunta y al nivel de detalle? ¿Qué tan rápido se puede construir un modelo a partir de sus datos existentes? ¿Puede el personal de operaciones usarla por sí mismo? ¿Cómo se mantiene? ¿Qué interfaces existen con ERP, MES y su plataforma de datos? ¿Qué estándares soporta (AAS, OPC UA, MTConnect, DTDL)? ¿Dónde residen los datos y quién tiene acceso?

## 16. Seguridad, propiedad de los datos y regulación

Un gemelo de producción contiene información sensible: las estructuras de productos, los tiempos de proceso, las capacidades y los pedidos de clientes describen el saber hacer y la posición competitiva de una empresa. Cuanto mayor es el nivel de integración, mayor es el riesgo.

- **Separación TI/OT:** Un gemelo que escribe de vuelta en los controles necesita un concepto de zonas y conductos según ISA/IEC 62443, la serie que define los requisitos y procesos para sistemas de automatización y control industrial seguros [59], además de cruces definidos y registro de eventos. NIST SP 800-82 Rev. 3 (septiembre de 2023) es la guía del gobierno de EE. UU. para proteger la tecnología operativa, con arquitecturas típicas, amenazas y contramedidas [55].
- **Riesgos específicos de los gemelos:** NIST IR 8356 (versión final, febrero de 2025) analiza los desafíos de ciberseguridad tradicionales y nuevos de las arquitecturas de gemelos digitales y relaciona las consideraciones de confianza con la guía NIST existente [49]. Utilícela como lista de verificación cuando el gemelo agregue datos de muchos sistemas en un único lugar.
- **Cadenas de aprobación:** Las recomendaciones del gemelo deben ser aprobadas por personas antes de surtir efecto en ERP, MES o controles, al menos hasta que se haya demostrado su fiabilidad.
- **Propiedad de los datos:** Defina por contrato quién es propietario de los modelos y de los datos derivados, dónde se procesan y si los proveedores pueden utilizarlos para sus propios fines (como el entrenamiento de IA).
- **Regulación para exportadores a la UE:** La **Ley de Ciberresiliencia** de la Unión Europea (Reglamento (UE) 2024/2847) establece requisitos de ciberseguridad para los productos con elementos digitales comercializados en la UE. Las obligaciones de notificación de vulnerabilidades explotadas activamente se aplican desde el 11 de septiembre de 2026; las obligaciones restantes se aplican desde el 11 de diciembre de 2027 [36]. Para los fabricantes estadounidenses de máquinas conectadas y software que venden en la UE, esto es directamente relevante; para los operadores de planta, afecta de forma indirecta a través de los requisitos que imponen a sus proveedores.

## 17. Construcción de un gemelo a partir de datos de ERP y de flujo de valor con iFAKT Polaris

> **Nota: El autor trabaja en iFAKT GmbH.**

Esta sección describe un enfoque de solución que sigue el principio explicado en la sección 5: construir el gemelo de producción a partir de datos de ERP y de flujo de valor existentes mediante un modelo de producto-proceso-recurso. La información procede de las páginas de producto de iFAKT GmbH y puede comprobarse allí; el autor no dispone de pruebas comparativas independientes.

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), con sede en Stuttgart (Alemania), afirma que lleva más de 25 años en activo y desarrolla software para el mapeo del flujo de valor, la simulación de producción, la planificación y la optimización [35]. La empresa describe su plataforma [iFAKT Polaris](https://www.m365.fm/entity/polaris/) como una forma de conectar los datos del ERP con un gemelo digital de la producción para optimizar los planes y exponer los cuellos de botella; la plataforma incluye módulos para el modelado de flujo de valor y de swimlanes (VSM/BSM), Designer, Simulator, Optimizer, Operator y Analyzer [35].

**Polaris Designer:** Según la página del proveedor, Designer convierte los datos de entrada en un **grafo de conocimiento PPR** estructurado que conecta en un solo modelo los productos (listas de materiales de fabricación e ingeniería, MBOM/EBOM), los procesos (tiempos de preparación, de máquina y de manipulación) y los recursos (estaciones, equipos, zonas) con sus restricciones. Las entradas son datos del ERP, listas de materiales de fabricación, tiempos de proceso, estructuras de recursos y restricciones. A partir de ellas, Designer genera automáticamente diagramas de red basados en la lógica de producción real, muestra la ruta crítica y los recursos críticos, resalta los procesos cuello de botella, compara los plazos de entrega actuales y optimizados y asigna zonas en función de las relaciones producto-proceso. El proveedor presenta el grafo como la base común («fuente única de verdad») para la simulación y la optimización [33]. Más información en la página de la entidad [Polaris Designer](https://www.m365.fm/entity/polaris-designer/).

**Polaris Simulator:** Según el proveedor, Simulator se basa en el grafo PPR creado en Designer y ejecuta los diagramas de red mediante modelos configurables de estación, línea y nave (hall) de producción, para una o varias líneas. Su objetivo es hacer transparente la utilización de capacidad entre turnos y escenarios, detectar cuellos de botella y desequilibrios de utilización a lo largo del tiempo, mostrar la sobreutilización y la infrautilización, así como la utilización temporal de mano de obra, y evaluar escenarios de capacidad, despliegue de personal y buffers, así como mezclas de productos dinámicas en recursos compartidos [34]. Más información en la página de la entidad [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/).

**Antecedentes técnicos:** Empleados de iFAKT han publicado sobre las cuestiones de fondo en la literatura especializada alemana, por ejemplo sobre la simulación dinámica de flujos de valor (ZWF 109(11), 2014) [31] y, junto con socios de investigación, sobre una interfaz de datos universal para servicios digitales de flujo de valor (ZWF 118(5), 2023) [32].

**Valoración:** Un enfoque basado en PPR y flujo de valor es especialmente adecuado para cuestiones de planificación de producción, capacidad, cuellos de botella y despliegue de mano de obra en áreas de montaje y fabricación de alta variedad. Para sistemas de transporte detallados, celdas robotizadas o puesta en marcha virtual a nivel de señal, las categorías especializadas de la sección 15 encajan mejor. Como con cualquier herramienta, pruebe en un piloto con sus propios datos si los resultados responden a su pregunta. Nuestra guía dedicada a [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) trata la plataforma con más profundidad.

## 18. Glosario

| Término | Explicación |
|---|---|
| Planificación y programación avanzadas (APS, Advanced planning and scheduling) | software para la planificación y secuenciación con restricciones de capacidad |
| Simulación basada en agentes (ABS, Agent-based simulation) | modelado de unidades autónomas (agentes) con reglas propias, cuya interacción produce el comportamiento del sistema |
| AGV / AMR | vehículo de guiado automático / robot móvil autónomo [53][54] |
| Asset Administration Shell (AAS) | representación digital estandarizada de un activo según IEC 63278 [10] |
| Cuello de botella (restricción) | recurso que limita el rendimiento de todo el sistema [39] |
| Fábrica digital | término genérico para modelos, métodos y herramientas digitales destinados a planificar y mejorar la fábrica real (directriz alemana VDI 4499) [16][17] |
| Modelo digital | representación digital sin intercambio automático de datos con el objeto físico [5] |
| Sombra digital (digital shadow) | representación con flujo automático de datos de lo físico a lo digital, pero flujo de retorno manual [5] |
| Hilo digital (digital thread) | vinculación conectada de la información a lo largo del ciclo de vida; abordada en ISO 23247-5 [7] |
| Gemelo digital (digital twin) | representación con flujo automático de datos en ambas direcciones [5]; en la práctica se usa con un alcance más amplio |
| Simulación de eventos discretos (DES, Discrete event simulation) | simulación cuyo reloj avanza de evento en evento; es el estándar en la simulación de producción |
| DTDL | Digital Twins Definition Language, lenguaje de modelado basado en JSON para Azure Digital Twins [22] |
| ERP | planificación de recursos empresariales, el sistema empresarial central con datos maestros, pedidos y planificación de materiales |
| HiL / SiL / MiL | variantes de acoplamiento para la puesta en marcha virtual: in-the-loop con hardware, software o modelo |
| ISA-95 / IEC 62264 | serie de normas para la integración de los sistemas empresariales y de control [58] |
| Ley de Little | L = λ · W: el inventario medio es igual a la tasa de rendimiento multiplicada por el tiempo de ciclo en régimen estacionario [37] |
| Simulación de flujo de materiales | simulación de los flujos de materiales y pedidos a través de la producción y la logística, normalmente de eventos discretos |
| MBOM / EBOM | lista de materiales de fabricación / lista de materiales de ingeniería |
| MES | sistema de ejecución de la fabricación, gestión de operaciones en el nivel 3 de ISA-95 |
| MTConnect | estándar abierto para la interoperabilidad de datos de fabricación, publicado como ANSI/MTC1.4-2018 [57] |
| OPC UA | estándar de comunicación independiente del fabricante con modelos de información (IEC 62541) |
| Modelo PPR | modelo producto-proceso-recurso, el principio de estructuración de la fábrica digital |
| Replicación | ejecución repetida de la simulación con números aleatorios distintos para obtener confianza estadística [41] |
| Validación | comprobación de si un modelo representa la realidad con la precisión suficiente para su finalidad |
| Simulación de flujo de valor | simulación dinámica de un mapa de flujo de valor a lo largo del tiempo [31] |
| Verificación | comprobación de si un modelo ha sido implementado correctamente |
| Puesta en marcha virtual | prueba del software de control contra un modelo de simulación antes de la puesta en marcha física [14] |
| VVUQ | verificación, validación y cuantificación de la incertidumbre; propuesto por NIST como futura parte de ISO 23247 [48] |
| Periodo de calentamiento (warm-up) | fase inicial de una ejecución de simulación cuyos resultados se descartan por el estado inicial vacío |

## 19. Preguntas frecuentes: gemelos digitales en la fabricación

### ¿Qué es un gemelo digital en la fabricación, en términos sencillos?
Un gemelo digital es un modelo computacional ejecutable de su producción que se actualiza con datos de las operaciones reales. Puede utilizarlo para recorrer las operaciones, encontrar cuellos de botella y probar cambios antes de aplicarlos en la planta real.

### ¿Cuáles son los 4 tipos de gemelos digitales?
Un esquema común de cuatro niveles distingue gemelos de componente (pieza), gemelos de activo, gemelos de sistema (unidad) y gemelos de proceso [52]. Para las decisiones de fabricación, una división más útil es gemelo de producto, de proceso, de activo, de fábrica, de desempeño y de cadena de suministro (véase la sección 3). Ninguna de estas clasificaciones está normalizada; la norma ISO/IEC 30173 describe los tipos de gemelos solo a nivel general [9].

### ¿Cuál es la diferencia entre un gemelo digital y una sombra digital?
Según Kritzinger et al., en una sombra digital los datos fluyen automáticamente del objeto físico al digital, pero la vía de retorno es manual. En un gemelo digital, los datos fluyen automáticamente en ambas direcciones [5]. Un modelo digital no tiene intercambio automático de datos en absoluto.

### ¿Cuáles son ejemplos de gemelos digitales en la fabricación?
Ejemplos típicos son un modelo de fábrica que compara variantes de distribución antes de aprobar una nueva nave, una simulación alimentada a diario desde el ERP y el MES que verifica si la programación de esta semana se sostiene, un modelo de puesta en marcha virtual que prueba el código del PLC antes de instalar una línea y un modelo de flota de AGV que dimensiona los vehículos y la carga. McKinsey documenta casos como una programación de montaje rediseñada con ahorros de costos mensuales del 5 al 7 por ciento y una secuencia de cuellos de botella que redujo el tiempo de procesamiento en alrededor de un cuatro por ciento [26].

### ¿Cuál es la diferencia entre un gemelo digital y una simulación?
Una simulación es un modelo con el que se realizan experimentos. Se convierte en una sombra digital o en un gemelo digital cuando se alimenta automáticamente con datos operativos y sus resultados retroalimentan las decisiones o los controles. Muchos gemelos contienen una simulación en su núcleo.

### ¿Es un modelo 3D o un modelo BIM un gemelo digital?
No por sí solo. Un escaneo 3D, un plano CAD o un modelo de información de construcción (BIM) captura la geometría. Sin lógica de proceso (rutas, tiempos, recursos) y sin una conexión de datos con las operaciones, no puede responder a preguntas de capacidad o de plazos de entrega. Puede ser una capa útil de un gemelo, especialmente en la planificación de distribuciones en instalaciones existentes.

### ¿Cuál es la diferencia entre la simulación de producción y la puesta en marcha virtual?
La simulación de producción evalúa las operaciones a nivel de pedido y de recurso (rendimiento, plazo de entrega, cuellos de botella). La puesta en marcha virtual prueba el software de control de una máquina a nivel de señales frente a un modelo del equipo, antes de que el equipo físico esté construido [14].

### ¿Qué datos necesita un gemelo digital de fabricación?
Para un gemelo de producción y de fábrica, se necesitan principalmente listas de materiales, rutas con tiempos, centros de trabajo y capacidades, turnos, pedidos y confirmaciones. Estos datos proceden sobre todo del ERP y del MES. Los datos de máquinas y sensores mejoran el modelo, pero rara vez son el punto de partida.

### ¿Se puede construir un gemelo digital a partir de datos del ERP?
Sí. Para preguntas de capacidad, plazo de entrega y programación, el sistema ERP es la fuente más importante. Contiene datos de producto, proceso y recursos en forma estructurada. Una verificación de la calidad de los datos es esencial, porque los tiempos estándar y de preparación a menudo difieren de la realidad.

### ¿Qué tipo de simulación se utiliza en la fabricación?
Principalmente la simulación de eventos discretos, cuyo reloj avanza de evento en evento. Se añade la dinámica de sistemas para cuestiones estratégicas, la simulación basada en agentes para vehículos y personas, y la simulación 3D basada en la física para celdas robotizadas y pruebas de control.

### ¿Qué precisión necesita un gemelo digital?
La suficiente para la decisión que respalda, ni más ni menos. Valide el modelo frente a datos reales para las métricas que importan (por ejemplo, rendimiento o plazo de entrega), documente los supuestos y realice análisis de sensibilidad. El NIST está trabajando en un marco de verificación, validación y cuantificación de la incertidumbre para gemelos de fabricación [48].

### ¿Qué normas se aplican a los gemelos digitales en la fabricación?
Las normas centrales son ISO 23247 (marco de gemelo digital para la fabricación, Partes 1 a 6) [6][7][8], ISO/IEC 30173 (terminología) [9], IEC 63278-1 (Asset Administration Shell) [10] e ISA-95 / IEC 62264 [58]. Para la seguridad, utilice ISA/IEC 62443 [59] y NIST SP 800-82 [55]. NIST AMS 400-2 muestra cómo aplicar ISO 23247 [47]. Las directrices alemanas (VDI 3633 para simulación, VDI/VDE 3693 para puesta en marcha virtual, VDI 4499 para la fábrica digital) añaden detalle metodológico [13][14][16].

### ¿Son los gemelos digitales una buena opción para fabricantes pequeños y medianos?
Sí, si se empieza con una pregunta claramente delimitada. Un piloto para una cadena de valor o un área, basado en datos ERP existentes, requiere mucho menos esfuerzo que un proyecto de IoT para toda la planta y ofrece un beneficio verificable antes. El informe de casos de uso de ISO 23247 del NIST se dirige precisamente a este grupo [47], y los centros NIST MEP ofrecen apoyo externo [60].

### ¿Cuánto cuesta un gemelo digital?
Depende del alcance, de la situación de los datos y del nivel de integración. Los mayores costes suelen ser la preparación de datos, el modelado, la validación y el mantenimiento, no el software. Una empresa alemana de servicios de simulación ofrece como regla orientativa un máximo del 1 por ciento de la inversión afectada para estudios de simulación [30].

### ¿Cuánto tiempo lleva la implantación?
McKinsey indica un rango de dos a tres meses a más de un año para proyectos de gemelos, según las capacidades del equipo y la complejidad de la planta [26]. Un piloto centrado en una decisión concreta suele ser posible en pocos meses.

### ¿Cómo ayuda un gemelo digital a planificar flotas de AGV y AMR?
Simula los vehículos con trayectos, desplazamientos en vacío, tiempos de espera, conflictos en intersecciones y pausas de carga. Así se determinan el número de vehículos, las rutas y la estrategia de carga, aspectos que un cálculo estático suele subestimar.

### ¿Qué papel desempeña la inteligencia artificial?
La IA ayuda a preparar los datos, acelera las simulaciones mediante modelos sustitutos, aprende reglas de control dentro del modelo y hace que los gemelos sean utilizables mediante lenguaje natural. Requiere un modelo validado y datos limpios.

### ¿Es Azure Digital Twins lo mismo que digital twin builder en Fabric?
No. Microsoft indica explícitamente que se trata de servicios distintos [21][23]. Azure Digital Twins es un servicio PaaS para grafos de gemelos con DTDL; digital twin builder es una herramienta de ontología y mapeo en Microsoft Fabric y, en el momento de escribir esto, está en vista previa [23].

### ¿Quién inventó el gemelo digital?
El concepto se remonta a Michael Grieves, quien lo presentó en 2002 en el contexto de la gestión del ciclo de vida del producto; Grieves atribuye el nombre "gemelo digital" a John Vickers de la NASA [1][2]. Otros autores señalan precursores anteriores, por ejemplo en la investigación sobre fabricación virtual [4].

## 20. Conclusión

El gemelo digital en la fabricación es menos una tecnología nueva que la combinación consistente de tres componentes probados: un modelo estructurado de productos, procesos y recursos; una simulación que captura la dinámica y la variabilidad; y una alimentación de datos procedente de la operación real. Los estándares existen, desde ISO 23247 e ISA-95 hasta la Asset Administration Shell; NIST ofrece orientación de implementación en EE. UU., y el método de simulación de fábricas se ha probado durante décadas.

El error más habitual no es la tecnología equivocada, sino la falta de un propósito. Empiece por una decisión que hoy se basa con demasiada frecuencia en la intuición o en una hoja de cálculo: una inversión de capital, una nueva combinación de productos, una flota de AGV o un programa semanal que a menudo no se cumple. Revise sus datos del ERP con honestidad, construya un modelo piloto validado y, después, decida qué nivel de integración justifica el siguiente paso. Así se obtiene un gemelo digital que no solo tiene buena apariencia, sino que mejora las decisiones.

## Lecturas adicionales en m365.fm

**Entradas de blog y episodios**

- [Gemelo digital en la fabricación: por dónde empezar](https://www.m365.fm/community/u/mirko-p/blog/digital-twin-manufacturing-where-to-start/)
- [Del ERP al piso de planta: el gemelo digital](https://www.m365.fm/community/u/mirko-p/blog/erp-to-shop-floor-digital-twin/)
- [Episodio: Digital Twins on Azure](https://www.m365.fm/show/episodes/digital-twins-on-azure/)
- [Episodio: Value Stream Mapping as a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Páginas de entidades**

- [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Virtual Commissioning](https://www.m365.fm/entity/virtual-commissioning/) · [Automated Guided Vehicle](https://www.m365.fm/entity/automated-guided-vehicle/) · [Industry 4.0](https://www.m365.fm/entity/industry-4-0/)
- [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/)
- [iFAKT](https://www.m365.fm/entity/ifakt/) · [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [Polaris Designer](https://www.m365.fm/entity/polaris-designer/) · [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/)

**Guías relacionadas**

- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Production Scheduling Software and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** es el presentador de m365.fm y trabaja en iFAKT GmbH. En m365.fm escribe sobre la digitalización de la fabricación con Microsoft 365 y Azure, los métodos de cadena de valor, la planificación de la producción y los gemelos digitales. Su enfoque es cómo derivar modelos fiables para la planificación y las decisiones de inversión a partir de los datos existentes de ERP y de cadena de valor.

**Nota: el autor trabaja en iFAKT GmbH.**

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
