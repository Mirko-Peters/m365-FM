# SEO metadata

| Field | Value |
|---|---|
| Meta title | Gestión de Piso de Fábrica y Gemba Walks: Guía Práctica |
| Meta description | Gestión de piso de fábrica explicada: reuniones por niveles, tableros SQDCP, KPI, lista de verificación de gemba walks, hoja de ruta y tablero digital en Microsoft 365. |
| Slug | `shop-floor-management` |

# Gestión de Piso de Fábrica y Gemba Walks: La Guía Completa para Liderar donde Ocurre el Trabajo

*Última actualización: 20 de noviembre de 2026 · Los detalles de Microsoft están verificados en Microsoft Learn a fecha de esta actualización*

> **Respuesta breve:** La gestión de piso de planta (también escrita shopfloor management, a menudo llamada sistema de gestión diaria o gestión por niveles) es un sistema de liderazgo en el que los responsables dirigen las operaciones donde realmente se crea valor: en la planta de producción, en el almacén o en el laboratorio. Combina la presencia de los líderes en el gemba (el "lugar real"), KPI visuales en un tablero de piso de planta, reuniones diarias breves por niveles que escalan los problemas hacia arriba en la organización y resolución estructurada de problemas, de modo que las desviaciones se detectan cada día y se corrigen de forma definitiva. El paseo gemba es la rutina de liderazgo que está en su núcleo.

Casi todos los fabricantes tienen en algún lugar una pizarra con números. Peter Gelbrich, citado por el instituto alemán de formación CETPM, estima a partir de visitas a empresas que alrededor del 80 por ciento de las empresas manufactureras cuenta con alguna herramienta de gestión visual de piso de planta [3]. Así que la pregunta real ya no es si se tiene un tablero, sino si funciona. ¿Se atienden las desviaciones en horas en lugar de semanas? ¿Acuden los líderes al gemba con preguntas o con respuestas? ¿Y los problemas que el equipo no puede resolver llegan de forma fiable al siguiente nivel el mismo día?

Esta guía explica los orígenes y los principios, describe cada elemento en detalle y ofrece una matriz de reuniones por niveles, un diseño del tablero, una guía del paseo gemba con lista de verificación, el trabajo estándar del líder, una hoja de ruta de implantación y una arquitectura de referencia para un tablero digital de piso de planta construido con Microsoft Teams, Power BI, Power Apps y Microsoft Fabric. Gran parte de la investigación sobre gestión de piso de planta procede de Alemania, donde el término "Shopfloor Management" es vocabulario habitual en las plantas; esta guía utiliza esas fuentes cuando aportan valor y explica el contexto para los lectores de Estados Unidos. También hay una definición compacta en la página de entidad [Shop floor management](https://www.m365.fm/entity/shop-floor-management/).

### Puntos clave

- La gestión de piso de planta es un sistema de liderazgo, no un tablero ni un programa informático. Consiste en líderes presentes en el piso, gestión visual, unos pocos KPI, un ritmo de reuniones fijo, resolución de problemas y estándares.
- Las reuniones por niveles a nivel de equipo duran de 10 a 15 minutos y están escalonadas de modo que un problema del primer turno llegue al director de planta el mismo día.
- Un tablero debe incluir de cuatro a seis KPI que el equipo pueda influir realmente, normalmente organizados como SQDCP (seguridad, calidad, entrega, coste, personas).
- El paseo gemba es la rutina de liderazgo central: tiene un tema, se basa en la observación y en preguntas abiertas, y siempre termina con un seguimiento.
- Una acción se cierra solo cuando su efecto se refleja en el KPI y el estándar se ha actualizado.
- Primero la rutina, después lo digital. Un tablero digital en Microsoft 365 es un conjunto de herramientas; las licencias, los intervalos de actualización, el diseño de datos y las normas de supervisión de empleados determinan el esfuerzo.

### Rutas de lectura para lectores con poco tiempo

| Usted es un/a… | Lea primero |
|---|---|
| Líder de equipo, supervisor o jefe de turno | Sección 5 (reuniones por niveles), 6 (tablero), 9 (paseo gemba), 10 (trabajo estándar del líder) |
| Director de planta o vicepresidente de operaciones | Sección 3 (beneficios), 13 (cultura y normas de supervisión de empleados), 14 (implantación), 15 (errores frecuentes) |
| Administrador de Microsoft 365 o Azure | Sección 16 (analógico o digital), 17 (Microsoft 365, incluido el plan de construcción), 18 (integración de datos) |
| Coach de Lean, responsable de mejora continua o jefe de proyecto | Sección 4 (elementos), 8 (resolución de problemas), 14 (hoja de ruta con verificación de madurez) |

## Índice

1. [¿Qué es la gestión de piso de planta? Definición y alcance](#qué-es-la-gestión-de-piso-de-planta-definición-y-alcance)
2. [Orígenes: gemba, genchi genbutsu y el Sistema de Producción Toyota](#orígenes-gemba-genchi-genbutsu-y-el-sistema-de-producción-toyota)
3. [Objetivos y beneficios](#objetivos-y-beneficios)
4. [Los seis elementos de la gestión de piso de planta](#los-seis-elementos-de-la-gestión-en-el-piso-de-producción)
5. [Reuniones escalonadas: la cascada diaria](#reuniones-escalonadas-la-cascada-diaria)
6. [El tablero de piso de planta: estructura, campos y un ejemplo de diseño](#el-tablero-de-planta-estructura-campos-y-un-diseño-de-ejemplo)
7. [KPI de piso de planta: cómo elegir métricas SQDCP que funcionen](#kpi-de-piso-de-planta-cómo-elegir-métricas-sqdcp-que-funcionen)
8. [Resolución de problemas en el piso de planta: de la contención al estándar](#resolución-de-problemas-en-el-piso-de-planta-de-la-contención-al-estándar)
9. [El recorrido gemba: pasos, preguntas y lista de verificación](#el-paseo-gemba-pasos-preguntas-y-lista-de-verificación)
10. [Trabajo estándar del líder: el liderazgo como rutina](#trabajo-estándar-del-líder-el-liderazgo-como-rutina)
11. [Andon: hacer visibles las desviaciones en tiempo real](#andon-hacer-visibles-las-desviaciones-en-tiempo-real)
12. [Roles y responsabilidades](#roles-y-responsabilidades)
13. [Cultura, seguridad psicológica y reglas para el monitoreo de empleados](#cultura-seguridad-psicológica-y-reglas-para-el-monitoreo-de-empleados)
14. [Cómo implementar la gestión de piso de planta: una hoja de ruta de seis fases](#cómo-implantar-la-gestión-en-planta-una-hoja-de-ruta-de-seis-fases)
15. [Errores comunes y cómo corregirlos](#häufige-fehler-und-wie-sie-sie-beheben)
16. [¿Analógico o digital? Comparación de la gestión digital de piso de planta](#analógico-o-digital-gestión-digital-del-piso-de-planta-en-comparación)
17. [Cómo construir un tablero digital de piso de planta con Microsoft 365](#construcción-de-un-tablero-digital-de-planta-con-microsoft-365)
18. [Integración de datos: MES, ERP y datos de máquinas](#integración-de-datos-mes-erp-y-datos-de-máquinas)
19. [Soporte de software: el ejemplo de iFAKT Polaris](#soporte-de-software-el-ejemplo-de-ifakt-polaris)
20. [Glosario](#glosario)
21. [Preguntas frecuentes: gestión de piso de planta y recorridos gemba](#faq-gestión-de-planta-y-paseos-gemba)
22. [Conclusión](#conclusión)

## ¿Qué es la gestión de piso de planta? Definición y alcance

El término combina "shop floor" (el área de producción, en sentido amplio el lugar donde se crea valor) y "management" (gestión). En las plantas de Estados Unidos, esta práctica suele conocerse con otros nombres: sistema de gestión diaria, responsabilidad escalonada, reuniones por niveles o tableros de reunión rápida (huddle boards). La idea de fondo es la misma.

El Instituto Alemán de Ciencia del Trabajo Aplicada (ifaa, un instituto de investigación en ingeniería industrial y ergonomía) describe la gestión de piso de planta como liderar en el punto de creación de valor, reuniendo en el piso de planta las tareas de planificación, control, mejora y ejecución, de modo que se aproveche el conocimiento de los "expertos en el sitio" [2]. La Asociación Académica Alemana de Tecnología de Producción (WGP) la define como un sistema de gestión integrado para el desarrollo sistemático de los procesos y de las personas en el piso de planta [4]. Remco Peters, cuyo libro de 2009 es una referencia estándar en los países de habla alemana, subraya que la gestión de piso de planta "no es simplemente una herramienta de control, sino un instrumento de liderazgo holístico" [1][6].

De estas definiciones se derivan tres características que distinguen la gestión real de piso de planta de un simple muro de KPI:

1. **Lugar:** el liderazgo ocurre donde se crea valor, no en la sala de juntas.
2. **Ritmo:** la comunicación está programada, es breve y estandarizada. Sigue una cascada fija a través de los niveles de la organización.
3. **Efecto:** cada desviación lleva a una acción con un responsable y una fecha límite, y se verifica el efecto.

### Qué no es la gestión de piso de planta

En la práctica, la gestión de piso de planta suele confundirse con términos relacionados. En Estados Unidos en particular, "shop floor management" también lo usan los proveedores de ERP y de programación para referirse al control de piso de planta: liberar, secuenciar y dar seguimiento a las órdenes de trabajo. La tabla siguiente separa los conceptos.

| Término | De qué trata | Relación con la gestión de piso de planta |
|---|---|---|
| Control de piso de planta / control de producción | Secuenciación, liberación de órdenes, equilibrado de capacidad, seguimiento de órdenes de trabajo | Una subtarea; la gestión de piso de planta utiliza sus resultados, pero es un sistema de liderazgo |
| MES (sistema de ejecución de la fabricación) | Sistema informático para registrar y controlar la producción | Fuente de datos y herramienta, no el sistema de liderazgo en sí |
| Gestión visual | Hacer visibles el estado y las desviaciones | Un elemento de la gestión de piso de planta |
| Paseo por el gemba | Un líder acude al lugar donde se realiza el trabajo, observa y pregunta | Un elemento y una rutina de liderazgo dentro de la gestión de piso de planta |
| Mejora continua / kaizen | Mejora en pasos pequeños y constantes | Resultado e impulsor; la gestión de piso de planta proporciona la plataforma diaria |
| Manufactura esbelta (lean manufacturing) | Filosofía global para eliminar el desperdicio | El marco más amplio; la gestión de piso de planta es su sistema de liderazgo diario |

Para el marco más amplio, consulte la página de entidad [Lean management](https://www.m365.fm/entity/lean-management/) y el compendio de m365.fm [Lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/). En Alemania, este marco suele denominarse "sistema de producción holístico" (Ganzheitliches Produktionssystem). La serie de directrices VDI 2870 de la Asociación de Ingenieros Alemanes (VDI) describe sus fundamentos (Parte 1, julio de 2012) y un catálogo de métodos (Parte 2, febrero de 2013). VDI ha clasificado ambas partes como parcialmente necesitadas de revisión, y hay una nueva edición de la Parte 2 en curso [27].

### Piso de planta, piso de oficinas y otras áreas

La gestión de piso de planta comenzó en la fabricación, pero se traslada a cualquier área con trabajo recurrente y un resultado medible: logística, mantenimiento, laboratorios, salas de hospital, servicio al cliente, ingeniería. Para las áreas indirectas se ha consolidado el término "gestión de piso de oficinas" [3]. Los principios siguen siendo los mismos; cambian los KPI. En lugar de producción y chatarra, el tablero muestra, por ejemplo, el tiempo de entrega de los casos, la liberación a tiempo de los planos o el backlog de tickets.

## Orígenes: gemba, genchi genbutsu y el Sistema de Producción Toyota

### Gemba: el "lugar real"

"Gemba" (a veces escrito "genba") es japonés para "el lugar real". En lean, significa el lugar donde realmente se realiza el trabajo que crea valor, normalmente el piso de planta [7][8]. Estrechamente relacionado está **genchi genbutsu**, más o menos "lugar real, cosa real". El Lean Lexicon del Lean Enterprise Institute (LEI) lo define como ir a la fuente para comprobar los hechos por uno mismo [8]. Michael Ballé, del LEI, establece la distinción así: gemba es un lugar, genchi genbutsu es una acción [8].

La centralidad de este principio para Toyota se muestra en "The Toyota Way 2001". En abril de 2001, Toyota presentó dos pilares (mejora continua y respeto por las personas) y cinco valores clave. Junto a desafío, kaizen, respeto y trabajo en equipo, genchi genbutsu es explícitamente uno de ellos, traducido como "ir a la fuente para encontrar los hechos" [9].

### Taiichi Ohno y el círculo de tiza

Taiichi Ohno (1912–1990) es considerado el arquitecto del Sistema de Producción Toyota; su libro "Toyota Production System: Beyond Large-Scale Production" se publicó en inglés por Productivity Press en 1988 [13]. Se le atribuye una historia conocida: se dice que colocaba a ingenieros nuevos dentro de un círculo trazado con tiza en el piso de planta y les hacía observar durante horas hasta que realmente veían los problemas del proceso. La historia puede estar adornada [12], pero recoge el núcleo: la comprensión surge de la observación en el lugar, no de los informes.

### Masaaki Imai y "Gemba Kaizen"

Masaaki Imai dio a conocer el término en Occidente con su libro "Gemba Kaizen: A Commonsense, Low-Cost Approach to Management" (McGraw-Hill, 1997) [10]. Las "reglas de oro de la gestión del gemba" asociadas se leen así en el resumen del Kaizen Institute [11]:

1. Cuando surge un problema, ir primero al gemba.
2. Revisar el gembutsu (máquina, herramienta, material, pieza defectuosa).
3. Tomar contramedidas temporales en el sitio.
4. Encontrar la causa raíz.
5. Estandarizar para evitar la recurrencia.

Estos cinco pasos siguen siendo el plano para la resolución de problemas en la gestión de piso de planta (véase la sección 8).

### Suzaki y la difusión del término

Kiyoshi Suzaki es considerado el pionero del término "gestión de piso de planta" (shop floor management) con su libro "The New Shop Floor Management: Empowering People for Continuous Improvement" (Free Press, 1993) [5]. El instituto alemán de formación CETPM cita a Constantin May, quien llama a Suzaki el "padre de la gestión de piso de planta" [3]. Suzaki añadió a la dirección en el lugar de trabajo una buena comunicación entre directivos y empleados, una comprensión del cliente en toda la empresa, la capacidad de aprender y una exigencia de la máxima calidad [1]. En los países de habla alemana, Remco Peters (2009) [6] y el trabajo en la Universidad Técnica de Darmstadt (incluido Hertle et al. sobre el desarrollo de competencias en la gestión de piso de planta [26]) dieron forma al debate. En Estados Unidos, las mismas prácticas se difundieron sobre todo bajo las etiquetas lean management system, daily management y leader standard work, en particular a través del libro de David Mann "Creating a Lean Culture" [19].

### ¿Qué tan extendida está hoy?

Según un estudio de 2018 citado por WGP, aproximadamente el 82,5 por ciento de las empresas participantes había introducido la gestión de piso de planta, un aumento de alrededor del 20 por ciento respecto a tres años antes. Se utilizaba sobre todo en producción y áreas adyacentes, pero no en todos los niveles de la jerarquía [4]. WGP no nombra el estudio, por lo que la muestra y el método no pueden verificarse. El hallazgo apunta a un problema central en muchas plantas, que aborda la sección 5: un tablero a nivel de equipo sin una cascada de reuniones que funcione por encima tiene poco efecto. No se encontraron en la investigación para este artículo cifras representativas comparables de Estados Unidos.

## Objetivos y beneficios

La gestión de piso de planta persigue cinco objetivos que dependen unos de otros:

| Objetivo | Qué ocurre realmente | Medido por |
|---|---|---|
| Transparencia | Objetivo y real son visibles para todos de un vistazo | Actualidad del tablero, proporción de KPI con objetivo |
| Respuesta rápida | Las desviaciones se detectan y se gestionan dentro de un turno | Tiempo desde la desviación hasta la acción, plazo de escalado |
| Resolución de problemas duradera | Se eliminan las causas raíz, no los síntomas | Tasa de repetición del mismo defecto |
| Implicación de los empleados | El conocimiento de quienes realizan el trabajo fluye hacia las decisiones | Número de ideas implementadas, participación en las reuniones breves |
| Desarrollo del liderazgo | Los líderes pasan de apagar incendios a ser coaches | Proporción de leader standard work completado, tasa de gemba walks |

### ¿Cuál es la evidencia?

Las cifras sólidas e independientes sobre el beneficio de la gestión de piso de planta son escasas, porque su efecto es difícil de separar de otras medidas lean. Aun así, los ejemplos documentados son instructivos:

- **fischer (fabricante alemán de elementos de fijación, fischerwerke):** Tras un proyecto de nueve meses, la tasa de reclamaciones bajó un 13 por ciento y los costes de proceso un 9 por ciento; el número de entregas aumentó un 11 por ciento, con la misma plantilla y a tiempo [3].
- **Schinko (fabricante austriaco de carcasas de chapa):** Tras introducir la gestión digital de piso de planta, la productividad en corte subió un 20 por ciento; en plegado, donde el sistema era más reciente, el aumento en el momento del informe fue del 10 por ciento. El artículo fue escrito por el responsable de marketing del proveedor de software implicado, GFT, y debe leerse con esa salvedad [42].
- **Investigación sobre gestión digital de piso de planta:** El estudio del wbk Institute of Production Science del Karlsruhe Institute of Technology (KIT) y del instituto IPRI en el proyecto ShopfloorPulse indica que la información digital casi en tiempo real puede reducir "considerablemente" la latencia hasta la corrección de un fallo, mientras que el seguimiento analógico de acciones depende de la disciplina individual [24][25]. El estudio se basa en 18 empresas y es, por tanto, una fotografía cualitativa más que una encuesta representativa.

Muchas páginas de proveedores en google.com citan mejoras mucho mayores (por ejemplo, entre un 25 y un 35 por ciento más de productividad) sin nombrar una fuente. Esta guía no repite tales cifras. La conclusión sobria: la gestión de piso de planta no es una herramienta con un ROI garantizado, sino un sistema de liderazgo cuyo efecto depende de lo consistentemente que se ejecute. Las siguientes secciones muestran de qué depende esa consistencia.

## Los seis elementos de la gestión en el piso de producción

La literatura estructura la gestión en el piso de producción de distintas maneras. ifaa distingue cuatro bloques visibles (gestión visual, KPI, comunicación estándar, resolución sistemática de problemas) y tres fundamentos "invisibles" (principios de trabajo, comprensión de los roles, sostenibilidad) [2]. Peters identificó cuatro elementos centrales: liderar en el sitio, reconocer las desviaciones, resolver los problemas de forma sostenible y utilizar los recursos de forma óptima [1]. WGP nombra la estabilidad y la estandarización como requisitos previos, y la gestión del rendimiento, la resolución de problemas y la gestión de mejoras, el liderazgo en el sitio, la gestión visual y el desarrollo de competencias como elementos de gestión [4]. Muchas páginas en EE. UU. suelen enumerar cinco "pilares" con contenidos similares.

El siguiente modelo reúne estas visiones y ha demostrado su valor en la práctica:

| Elemento | Pregunta clave | Herramientas principales |
|---|---|---|
| 1. Líderes presentes en el piso | ¿Los líderes ven la realidad por sí mismos? | Recorrido gemba, trabajo estándar del líder |
| 2. Gestión visual | ¿Cualquiera puede saber en segundos si las cosas van según el plan? | Tablero de piso, andon, 5S, luces de estado |
| 3. KPI | ¿Medimos lo que el equipo puede influir? | SQDCP, OEE, rendimiento de primera pasada |
| 4. Cadencia de reuniones (comunicación escalonada) | ¿La información fluye de forma fiable hacia arriba y hacia abajo cada día? | Reuniones por niveles, reglas de escalamiento |
| 5. Resolución de problemas | ¿Se eliminan las causas raíz de forma definitiva? | PDCA, 5 porqués, diagrama de espina de pescado (Ishikawa), A3 |
| 6. Estandarización | ¿Lo que aprendimos queda fijado? | Trabajo estándar, instrucciones de trabajo |

### Elemento 1: Líderes presentes en el piso

LEI describe así la mentalidad gemba: se va al gemba para comprender el trabajo, para liderar y para aprender [15]. Fujio Cho, antiguo presidente y después presidente del consejo de Toyota, resumió la actitud de los líderes lean en tres imperativos: "Ir a ver, preguntar por qué, mostrar respeto" [15]. La presencia no significa control; significa ser accesible e interesarse. La sección 9 describe en detalle cómo se ve la presencia en forma de recorrido gemba.

### Elemento 2: Gestión visual

LEI define la gestión visual como la colocación de todas las herramientas, piezas, actividades productivas e indicadores de rendimiento "a la vista", de modo que cualquier persona implicada pueda comprender el estado del sistema de un vistazo [20]. La gestión visual es, por tanto, mucho más que el tablero: las marcas en el suelo, los paneles de sombra, las tarjetas kanban, las luces andon y las luces de columna en las máquinas forman parte de ella. [5S](https://www.m365.fm/entity/5s/) suele ser la base, porque las desviaciones solo destacan en un entorno ordenado. Más: [Gestión visual](https://www.m365.fm/entity/visual-management/).

### Elemento 3: KPI

Los KPI hacen objetivas las desviaciones. Deben cumplir tres criterios: el equipo puede influir en ellos, están disponibles con prontitud y tienen un objetivo. La sección 7 explica cómo elegirlos. Los fundamentos están en la página de entidad [Indicador clave de rendimiento](https://www.m365.fm/entity/key-performance-indicator/) y en el compendio [KPI de fabricación](https://www.m365.fm/en/learn/manufacturing-kpis/).

### Elemento 4: Cadencia de reuniones

La cadencia de reuniones (las fuentes en alemán la llaman "Regelkommunikation", comunicación estándar) significa reuniones breves, programadas y estandarizadas junto al tablero. Su rasgo definitorio es la cascada: la información y los problemas fluyen desde el nivel del equipo hasta el nivel de departamento y el de planta, y el apoyo y las decisiones fluyen de vuelta [3][58]. La sección 5 ofrece una matriz completa.

### Elemento 5: Resolución de problemas

Sin resolución de problemas, la gestión en el piso degenera en una sesión de informes. Lo que importa es separar la contención rápida de la eliminación duradera de la causa raíz. La sección 8 recorre el camino desde un punto rojo en el tablero hasta un estándar actualizado.

### Elemento 6: Estandarización

Los estándares son a la vez requisito previo y resultado. Sin un estándar no hay desviación, y sin actualizar el estándar cada mejora se pierde de nuevo. Por eso WGP nombra explícitamente la estabilidad y la estandarización como requisitos previos [4]. Más: [Trabajo estándar](https://www.m365.fm/entity/standard-work/).

## Reuniones escalonadas: la cascada diaria

> **En resumen:** Cada nivel se reúne brevemente frente a su tablero, resuelve lo que puede y traslada lo demás al siguiente nivel el mismo día. Para ello hacen falta horarios fijos de reunión, criterios claros de escalado y el deber de responder.

Las reuniones escalonadas (también llamadas tier meetings, tiered huddles, stand-ups o reuniones diarias de responsabilidad) son la columna vertebral de la cadencia de reuniones. La idea: cada nivel se reúne brevemente, revisa sus KPI, resuelve lo que puede y escala el resto al nivel siguiente, que se reúne un poco más tarde. El Kaizen Institute describe la estructura típica en EE. UU. como cuatro niveles, desde los equipos de primera línea (nivel 1) pasando por los supervisores (nivel 2) y los gerentes de departamento (nivel 3) hasta la dirección de planta (nivel 4), con los problemas escalados el mismo día a un responsable nombrado [58]. CETPM describe la cadencia clásica en plantas alemanas como diaria o por turno a nivel de equipo, semanal a nivel de departamento y mensual o trimestral a nivel de planta [3]. En muchas plantas lean también es habitual una reunión diaria en los niveles 2 y 3, de modo que un problema del primer turno llegue al director de planta esa misma mañana. El estudio de ShopfloorPulse describe la misma estructura: las reuniones se escalan hacia arriba desde el piso de producción con ritmos diarios, semanales o mensuales [25]. Más información sobre el término en la página de entidad [Tier meeting](https://www.m365.fm/entity/tier-meeting/).

### ¿Cuánto debe durar una reunión escalonada?

Existen valores orientativos documentados. Gelbrich cita unos 10 a 12 minutos en el nivel operativo y 20 a 30 minutos en el nivel directivo; Orth cita 10, como máximo 20 minutos para las reuniones stand-up en áreas indirectas; Schwarz cita un máximo de 15 minutos en su ejemplo práctico, pero señala que las primeras reuniones durante la implantación suelen durar 30 minutos o más [3]. Gelbrich incluye las reuniones que se alargan demasiado, sobre todo durante la implantación, entre las diez causas más frecuentes del fracaso de la gestión en el piso de producción [3].

### Matriz de reuniones escalonadas (diseño de ejemplo)

La siguiente matriz es un diseño de ejemplo para una planta con turnos, basado en la práctica habitual. La cadencia y la duración siguen los valores orientativos documentados anteriormente; las horas y los asistentes son sugerencias que hay que adaptar a su modelo de turnos y a su organización.

| Característica | Nivel 1: equipo | Nivel 2: área / supervisor | Nivel 3: departamento / gerente de producción | Nivel 4: planta |
|---|---|---|---|---|
| Cadencia | cada turno, al inicio del turno | diaria | diaria (alternativamente semanal) | diaria o semanal, más una revisión mensual |
| Hora (ejemplo: el primer turno empieza a las 6:00 a. m.) | de 6:10 a 6:30 a. m., escalonada por línea | 8:30 a. m. | 9:15 a. m. | 10:00 a. m. |
| Duración | de 10 a 15 minutos | 15 minutos | de 15 a 20 minutos | de 20 a 30 minutos |
| Ubicación | tablero junto a la línea | tablero del área | tablero del departamento en el piso | tablero de planta (sala obeya o en el piso) |
| Moderador | líder de equipo | supervisor / jefe de turno | gerente de producción o de departamento | director de planta |
| Asistentes | equipo de la línea o celda | líderes de equipo del área, mantenimiento y calidad según sea necesario | supervisores, representantes de calidad, mantenimiento, logística, EHS (medio ambiente, salud y seguridad) | jefes de departamento, funciones de apoyo (calidad, cadena de suministro, compras, RR. HH., finanzas) |
| Horizonte temporal | último turno, turno actual | últimas 24 horas, hoy | ayer, hoy, esta semana | semana, mes, tendencia |
| KPI típicos | incidentes de seguridad, objetivo de unidades por hora frente a real, chatarra, paradas, asistencia | producción, OEE de los cuellos de botella, rendimiento al primer paso, backlog | entrega a tiempo, coste de la calidad, productividad, escalados abiertos | vista SQDCP de la planta, reclamaciones de clientes, coste, estado de proyectos |
| Decisiones | dotación, contención, ideas | reasignación de personal entre líneas, prioridades de mantenimiento | recursos entre áreas, turnos extra, equipos de resolución de problemas | inversión de capital, prioridades, cambios de objetivos |
| Escalar hacia arriba cuando | el problema no puede resolverse dentro del turno o faltan recursos | el problema afecta a varias líneas o requiere una función de apoyo | el problema afecta a clientes, al presupuesto o a varios departamentos | corporativo, cliente, proveedor |

**Segundo y tercer turno:** El nivel 1 funciona en cada turno; los niveles 2 a 4 normalmente solo durante el día. Para que los asuntos del segundo y tercer turno no se pierdan, el jefe de turno registra los escalados abiertos en el tablero o en el registro de turno y los traspasa en persona al primer turno. La reunión matinal del nivel 2 empieza con estos puntos.

### Reglas de escalado que funcionan

Una cascada solo es tan eficaz como sus reglas de escalado. Cuatro principios han demostrado su valor:

1. **Disparadores claros en lugar de intuición.** Defina para cada KPI cuándo escalar, por ejemplo: "línea parada más de 30 minutos", "chatarra por encima del límite durante dos horas consecutivas", "lesión o casi accidente: siempre".
2. **Tiempos que encajan entre sí.** La reunión del nivel superior se celebra después de la del nivel inferior, de modo que las escalaciones lleguen el mismo día. El moderador de la reunión inferior transmite la escalación en persona o a través del tablero.
3. **Obligación de responder.** Toda escalación recibe una respuesta, como muy tarde en la siguiente reunión del nivel inferior. El silencio es la forma más rápida de destruir una cultura de escalación.
4. **La seguridad es lo primero.** Los problemas de seguridad se escalan de inmediato, independientemente de la cascada.

CETPM describe un vínculo defectuoso entre los niveles de gestión de planta como un obstáculo típico [3]. Esto coincide con el estudio de KIT e IPRI: cuando las acciones se registran en papel, la escalación a niveles superiores se rompe y el seguimiento de acciones "depende de la disciplina de las personas" [24].

### Agenda estándar de una reunión de nivel 1 (15 minutos como máximo)

La agenda utiliza el límite superior de 15 minutos. Los equipos bien entrenados la completan en 10 a 12 minutos, el rango que Gelbrich cita para el nivel operativo [3].

| Minuto | Punto | Pregunta orientadora |
|---|---|---|
| 0–2 | Seguridad | ¿Hay lesiones, casi accidentes o condiciones inseguras? |
| 2–6 | KPI de ayer / último turno | ¿Dónde estamos en rojo, y por qué? |
| 6–9 | Plan para hoy | ¿Cuál es el objetivo de hoy? ¿Hay restricciones de personal, material o equipos? |
| 9–12 | Acciones | ¿Qué acciones abiertas vencen, cuáles están terminadas y cuáles necesitan ayuda? |
| 12–14 | Escalaciones | ¿Qué pasamos al nivel 2? |
| 14–15 | Cierre | ¿Quién hace qué y para cuándo? ¿Hay reconocimiento por buen trabajo? |

Importante: la reunión de nivel nombra los problemas, asigna responsables y acuerda la contención. El análisis de causa raíz se realiza después, en un grupo pequeño junto al equipo.

## El tablero de planta: estructura, campos y un diseño de ejemplo

> **En resumen:** Un buen tablero es legible desde unos 10 pies (3 m), muestra de cuatro a seis KPI con objetivos, sigue la agenda de la reunión de izquierda a derecha y vincula cada KPI en rojo con una acción. El equipo lo mantiene por sí mismo.

El tablero de planta (también llamado huddle board, tier board, SQDCP board o performance board) es la herramienta central de la cadencia de reuniones. ifaa describe sus tareas así: visualiza los KPI seleccionados de un área, muestra las acciones de mejora con su estado para que pueda rastrearse su efecto sobre los KPI, y contiene información de control diaria, sobre todo la situación actual de pedidos y capacidad [2]. Como categorías de ejemplo, ifaa enumera calidad, coste, logística, seguridad, personal, capacidad y situación de pedidos, y objetivos y acciones (mejora continua); los KPI de ejemplo incluyen el rendimiento al primer intento, las tasas de ppm, OEE, entrega a tiempo, cifras de accidentes, estado de 5S y tasa de asistencia [2].

### Reglas de diseño

- **Legible desde unos 10 pies (3 m):** Estado rojo/verde y cifras grandes, sin tablas de 30 columnas.
- **Cuatro a seis KPI:** CETPM recomienda unos cuatro a seis KPI que el equipo pueda influir [3]; el proveedor alemán de formación Haufe Akademie cita de cinco a siete como límite superior [43].
- **Objetivo junto al real:** Cada KPI tiene un objetivo y una tendencia.
- **Contar la historia de izquierda a derecha:** El tablero sigue la agenda de la reunión, de modo que el moderador simplemente avanza de izquierda a derecha.
- **Acciones visibles:** Cada KPI en rojo está vinculado a una acción o a una hoja de resolución de problemas.
- **Propiedad del equipo:** El equipo mantiene el tablero por sí mismo. Un tablero rellenado por finanzas o TI que nadie del equipo entiende será ignorado.

### Diseño de ejemplo de un tablero de nivel 1

El siguiente diseño muestra un tablero para una línea de montaje con tres filas y cinco columnas. Funciona igual de bien en una pizarra blanca (unos 6,5 × 4 pies, o 2 × 1,2 m) que en una pantalla.

| | Columna A: Seguridad (S) | Columna B: Calidad (Q) | Columna C: Entrega (D) | Columna D: Costo / productividad (C) | Columna E: Personas (P) |
|---|---|---|---|---|---|
| **Fila 1: estado actual** | Cruz de seguridad (calendario mensual, cada día verde, amarillo o rojo) | Chatarra y retrabajo por turno vs. objetivo | Objetivo del plan diario vs. real, backlog | Objetivo de unidades por hora vs. real (gráfico hora por hora) | Asistencia, matriz de habilidades (quién puede hacer qué) |
| **Fila 2: tendencia** | Casi accidentes de las últimas 4 semanas | Rendimiento de primera pasada, los 3 principales tipos de defecto (Pareto) | Entrega a tiempo de esta semana | OEE del cuello de botella, las 3 principales causas de paro, [micro paros](https://www.m365.fm/entity/micro-stops/) | Plan de vacaciones y formación |
| **Fila 3: acciones** | Acciones de seguridad abiertas | Hojas de resolución de problemas / A3 en curso | Escalamientos a nivel 2 y respuestas | Lista de acciones (qué, quién, para cuándo, estado) | Ideas y sugerencias con estado |

La mayoría de los tableros también tienen un encabezado con el nombre del equipo, el objetivo del área y la hora de la última actualización, además de un campo de "estándares y auditorías" (por ejemplo, el resultado de la última auditoría 5S). Nota sobre el orden de las columnas: el original alemán de esta guía usa SQCDP, que coloca el costo antes que la entrega; las plantas de EE. UU. suelen escribir SQDCP. El orden de C y D importa menos que poner la seguridad en primer lugar.

### Contenido del tablero por nivel

A medida que se sube de nivel, el tablero se vuelve más agregado y el horizonte temporal más largo. El proveedor de MES Symestic describe esto como dos reglas de consistencia: los KPI se condensan y se revisan con menor frecuencia a medida que se sube de nivel, pero deben remontarse a los mismos datos en todos los niveles [41].

| Nivel | Detalle | Horizonte temporal típico | Ejemplo de calidad |
|---|---|---|---|
| Nivel 1 | estación, hora | turno | defectos por hora en la estación 3 |
| Nivel 2 | línea, turno | día | tasa de chatarra por línea |
| Nivel 3 | área, día | semana | rendimiento de primera pasada y costo de calidad por área |
| Nivel 4 | planta, semana | mes | quejas de clientes en ppm, costo de mala calidad |

## KPI de piso de planta: cómo elegir métricas SQDCP que funcionen

La mayoría de los tableros siguen un orden fijo de dimensiones. El más común es **SQDCP** (o SQCDP): seguridad, calidad, entrega, costo y personas [41]. Las variantes son SQDC (sin P), SQDCM (M de moral) o SQDCE con medio ambiente. CETPM enumera los temas de seguridad, calidad, costo, confiabilidad de la entrega y personas como dimensiones típicas [3]. El orden es deliberado: la seguridad siempre va primero.

### Tres preguntas guía para elegir KPI

Gelbrich sugiere tres preguntas a partir de las cuales se pueden derivar KPI adecuados [3]:

1. ¿Cómo debe ser la salida de mi proceso en términos de tiempo y calidad?
2. ¿Cómo puedo mostrar la eficiencia de mis acciones en términos de costo y recursos?
3. ¿Qué refleja la ejecución responsable de mi proceso en términos de seguridad y medio ambiente?

Su principio central, expresado como una variación de una famosa cita de Drucker: lo que el equipo no puede influir no debería medirse en su tablero [3].

### Catálogo de KPI para el tablero de piso de planta

| Dimensión | KPI | Definición / cálculo | Nivel |
|---|---|---|---|
| S | Días desde la última lesión registrable | días calendario desde el último caso registrable ante OSHA (ver nota abajo) | 1–4 |
| S | Tasa total de incidentes registrables (TRIR) | número de lesiones y enfermedades registrables × 200,000 / total de horas trabajadas; 200,000 horas equivalen a 100 trabajadores a tiempo completo durante un año [51] | 3–4 |
| S | Casi accidentes (reportados) | reportes por semana (más reportes son al principio una buena señal) | 1–3 |
| Q | Tasa de chatarra | cantidad de chatarra / cantidad total; ver [tasa de chatarra](https://www.m365.fm/entity/scrap-rate/) | 1–3 |
| Q | Rendimiento de primera pasada (FPY) | piezas buenas en la primera pasada / piezas iniciadas | 1–3 |
| Q | Quejas de clientes | cantidad o ppm | 3–4 |
| D | Unidades objetivo vs. real | por hora o por turno | 1–2 |
| D | Entrega a tiempo | pedidos entregados a tiempo / todos los pedidos | 2–4 |
| D | Backlog | cantidad abierta vs. plan | 1–3 |
| C | OEE | disponibilidad × rendimiento × calidad [22] | 1–3 |
| C | Productividad | piezas buenas por hora de mano de obra | 2–4 |
| C | Tiempo de cambio de formato | tiempo desde la última pieza buena hasta la primera pieza buena de la siguiente orden | 1–2 |
| P | Asistencia / dotación | empleados presentes / programados | 1–2 |
| P | Nivel de polivalencia | porcentaje de tareas cubiertas en la matriz de habilidades | 1–2 |
| P | Ideas implementadas | sugerencias de mejora implementadas por mes | 1–3 |

**Nota sobre los KPI de seguridad en las plantas de EE. UU.:** Los contadores de "días sin lesiones" son populares, pero OSHA ha advertido que los incentivos basados en tasas (por ejemplo, una recompensa por un mes sin lesiones) pueden desalentar el reporte. En su memorando del 11 de octubre de 2018, OSHA afirma que tales programas son permisibles según 29 CFR 1904.35(b)(1)(iv) solo si no se implementan de una forma que desaliente el reporte, y que una política de no represalias por sí sola "may not, by itself, be adequate" [50]. OSHA recomienda un proceso para reportar lesiones, enfermedades, casi accidentes/incidentes evitados y peligros, incluida una opción anónima [49]. Para el consejo esto significa: mostrar los casi accidentes y los reportes de peligros junto al conteo de lesiones, y nunca vincular una recompensa de equipo únicamente a un historial limpio de seguridad.

La OEE (eficacia global del equipo) proviene del mantenimiento productivo total; LEI nombra seis grandes pérdidas: averías, preparación y ajuste, paradas menores, reducción de velocidad, desperdicio y retrabajo [22]. En el tablero, el número de OEE en sí importa menos que el desglose por tipo de pérdida, porque el equipo puede derivar acciones de él. El compendio de m365.fm [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) cubre estas métricas en profundidad.

### Lo que muestra la investigación sobre los KPI en la gestión de piso de planta

En el estudio de KIT e IPRI, el 94 por ciento de las empresas encuestadas seguía KPI de calidad y productividad en la gestión de piso de planta, mientras que los KPI de costos rara vez se usaban [24][25]. El uso digital de KPI casi en tiempo real fue la excepción, con poco más del 15 por ciento de las menciones, y la previsión de desviaciones no era una realidad en ninguna de las empresas encuestadas [24].

## Resolución de problemas en el piso de planta: de la contención al estándar

Un campo rojo en el tablero es el comienzo, no el final. La resolución de problemas en la gestión de piso de planta sigue un patrón derivado directamente de las reglas de oro de la gestión gemba [11]:

| Paso | Qué ocurre | Quién | Cuándo |
|---|---|---|---|
| 1. Detectar | La desviación se hace visible en el tablero o mediante andon | equipo | de inmediato o en la reunión de nivel |
| 2. Contener | La contención protege al cliente (por ejemplo, inspección al 100 por ciento, cuarentena, repuesto) | líder de equipo | en el mismo turno |
| 3. Comprender | Revisar el gembutsu en sitio, recopilar datos, observar el proceso | pequeño equipo junto al equipo | después de la reunión |
| 4. Encontrar la causa raíz | 5 porqués, diagrama de espina de pescado, A3 para problemas complejos | equipo de resolución de problemas | días a semanas |
| 5. Corregir | Implementar la contramedida permanente | responsable según la lista de acciones | según lo planeado |
| 6. Verificar el efecto | Vigilar el KPI durante un período definido | líder de equipo | después de la implementación |
| 7. Estandarizar | Actualizar el estándar, la instrucción de trabajo y la capacitación; compartir entre líneas (yokoten) | supervisor, dueño del proceso | después de comprobar el efecto |

Una acción se considera cerrada solo cuando su efecto aparece en el KPI. La regla suena trivial, pero muchas plantas la incumplen: las listas de acciones se reportan en "verde" mientras el defecto regresa la semana siguiente.

### ¿Qué método para qué problema?

| Tipo de problema | Característica | Método | Tiempo necesario |
|---|---|---|---|
| Simple, causa obvia | causa y solución claras en la reunión | acción directa con fecha límite | minutos |
| Recurrente, causa incierta | ocurre repetidamente, el equipo no está seguro de la causa | 5 porqués, espina de pescado | horas |
| Complejo, interfuncional | varias causas, varios departamentos | resolución de problemas A3 basada en PDCA | semanas |
| Sistémico, estratégico | afecta la cadena de valor, la distribución, el producto | evento kaizen, mapeo de la cadena de valor | semanas a meses |

A3 es especialmente valioso porque reúne problema, estado actual, análisis de causa raíz, estado objetivo, contramedidas y seguimiento en una sola hoja A3 (297 × 420 mm, cercana al formato tabloide US 11 × 17 in. que usan la mayoría de las plantas estadounidenses). La página de entidad [A3 problem solving](https://www.m365.fm/entity/a3-problem-solving/) ofrece una introducción, y el compendio [Value stream mapping](https://www.m365.fm/en/learn/value-stream-mapping/) cubre el nivel sistémico. El ciclo PDCA (planificar, hacer, verificar, actuar), normalmente atribuido a W. Edwards Deming (el propio Deming atribuyó el crédito a Walter A. Shewhart), es la base de todos los procesos de resolución de problemas [1].

## El paseo gemba: pasos, preguntas y lista de verificación

> **En resumen:** Un paseo gemba tiene un tema, empieza en el tablero, observa el trabajo durante varios ciclos, hace preguntas abiertas y termina con retroalimentación comprometida para el equipo. Sin tema y sin seguimiento, es solo un paseo.

El paseo gemba es la rutina de liderazgo más importante en la gestión de piso de planta. El Lean Lexicon lo define como "una práctica de gestión para comprender la situación actual mediante la observación directa y la indagación antes de actuar" [7]. Una introducción compacta también está disponible en la publicación [What is a gemba walk?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/) y en la página de entidad [Gemba walk](https://www.m365.fm/entity/gemba-walk/).

### Tres tipos de paseos gemba

Jim Womack, fundador de LEI, dice que él y Dan Jones usaron por primera vez el término "gemba walk" a comienzos de la década de 1990, originalmente para que los gerentes recorrieran toda la cadena de valor de un producto a través de departamentos y empresas [14]. Hoy distingue dos formas y separa una tercera, ahora extendida, del término [14]:

| Tipo | Propósito | Frecuencia típica | Quién |
|---|---|---|---|
| Recorrido por la cadena de valor | sensibilizar sobre la mejora fundamental de extremo a extremo | según sea necesario, p. ej., trimestral | liderazgo de planta y de área, todas las funciones a lo largo de la cadena de valor |
| Recorrido del sistema de gestión | verificar si el sistema de gestión puede mantener la estabilidad (tableros, estándares, escalamientos) | semanal a diario | líderes de todos los niveles |
| Recorrido centrado en problemas (genchi genbutsu) | llegar al fondo de un problema específico en el sitio | según sea necesario | responsables de problemas, especialistas |

Womack es crítico con el tercer uso y lo sitúa cerca de la "gestión por caminar alrededor": si la gestión diaria funciona, los problemas ya deberían resolverse en la cascada, en lugar de que directivos y personal de mejora corran al gemba a apagar incendios. Su tiempo se invierte mejor en recorridos de cadena de valor y del sistema de gestión [14].

### Las tres preguntas guía de LEI: propósito, proceso, personas

LEI recomienda estructurar el paseo gemba en torno a tres dimensiones [7]:

1. **Propósito:** ¿Qué problema resuelve este proceso para el cliente?
2. **Proceso:** ¿Cómo se realiza realmente el trabajo, en contraste con lo que describe el estándar?
3. **Personas:** ¿Participan los empleados en crear, sostener y mejorar el proceso?

LEI también recomienda seguir una familia de productos o un proceso de cara al cliente de principio a fin e involucrar a todas las personas implicadas, porque el valor fluye horizontalmente entre departamentos [7].

### Paseo gemba vs. gestión por caminar alrededor

El paseo gemba suele equipararse con la "gestión por caminar alrededor" (MBWA, por sus siglas en inglés). MBWA comenzó en Hewlett-Packard; el cofundador David Packard había adoptado la práctica en General Electric. Se hizo famosa gracias al libro "In Search of Excellence" de Tom Peters y Robert Waterman (1982) [16]. Las diferencias siguen siendo considerables:

| Característica | Paseo gemba | Gestión por caminar alrededor |
|---|---|---|
| Propósito | comprender el proceso, detectar desviaciones respecto del estándar, desarrollar la capacidad de resolución de problemas | cercanía con los empleados, intercambio informal, percepción del ambiente |
| Estructura | tema, ruta, preguntas guía, seguimiento | en su mayoría no estructurada y espontánea |
| Punto de referencia | estándar, KPI, tablero | personas y conversación |
| Resultado | observaciones concretas, coaching, acciones | relación, información |
| Anclado en | trabajo estándar del líder, ritmo fijo | estilo de liderazgo personal |

Ambos no son excluyentes: una charla informal de paso no sustituye a un paseo gemba, pero tampoco le hace daño. La publicación [Gemba walk vs. management by walking around](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/) compara ambos conceptos con más detalle.

### Cómo hacer un paseo gemba en siete pasos

**1. Defina un tema.** Todo paseo gemba tiene un foco, por ejemplo "cambio de formato en la línea 4", "uso de la nueva instrucción de inspección" o "efecto de las acciones de la reunión de nivel 3". Sin un tema, el paseo se convierte en un recorrido turístico.

**2. Prepárese.** Revise los KPI y el tablero del área, verifique las acciones abiertas y lleve el estándar (instrucción de trabajo, hoja de trabajo estándar). Avise al equipo con antelación para que la visita no se perciba como una inspección sorpresa. La publicación [Gemba walk preparation: team and roles](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/) ofrece consejos al respecto.

**3. Comience en el tablero.** El tablero muestra lo que el propio equipo considera un problema. Pregunte: "¿Qué le está diciendo hoy su tablero?"

**4. Observe.** Permanezca en un mismo puesto de trabajo y observe varios ciclos. Compare lo que ve con el estándar. Anote hechos, no interpretaciones.

**5. Haga preguntas.** Preguntas abiertas y respetuosas a la persona que realiza el trabajo. No dé soluciones.

**6. Resuma y dé las gracias.** Al final, refleje brevemente lo que aprendió y acuerde qué ocurre con las observaciones.

**7. Haga seguimiento.** Documente las observaciones, lleve las acciones a la reunión de nivel correspondiente y dé retroalimentación al equipo. Un recorrido sin retroalimentación erosiona la confianza.

**No olvide el segundo y tercer turno.** En una planta de tres turnos, los líderes que solo recorren la planta durante el turno de día ven un tercio de la operación. Programe al menos ocasionalmente un recorrido en los turnos de noche; los problemas de dotación de personal, de apoyo de mantenimiento y de relevos suelen aparecer ahí primero (recomendación práctica).

**¿Cuánto debe durar un gemba walk?** Las fuentes utilizadas aquí no dan un valor fijo. En la práctica, un recorrido de gestión centrado en un área dura de 20 a 45 minutos; un recorrido por la cadena de valor de toda una familia de productos puede durar medio día. El día de ejemplo de la sección 10 planifica 30 minutos. Son valores prácticos, no afirmaciones de las fuentes.

### Banco de preguntas para el gemba walk

**Propósito y objetivos**
- ¿Quién es el cliente de este proceso y qué necesita?
- ¿Cuál es la meta de su turno hoy y cómo sabe si la está alcanzando?
- ¿Qué KPI le importa más en este momento, y por qué?

**Proceso y estándar**
- ¿Cómo se desarrolla normalmente este paso? ¿Puede mostrármelo?
- ¿Dónde está escrito el estándar y coincide con la realidad?
- ¿Cómo se da cuenta de inmediato cuando algo no va bien aquí?
- ¿Qué ocurre cuando falta material o la máquina se detiene?
- ¿Dónde espera, busca cosas o tiene que retrabajar algo?

**Problemas y resolución de problemas**
- ¿Cuál fue el último problema que resolvió aquí?
- ¿Qué problema le cuesta más tiempo en este momento?
- ¿Qué ocurre cuando reporta un problema? ¿Qué tan rápido llega la ayuda?
- ¿Qué acción del tablero está vencida, y qué necesita?

**Personas**
- ¿Qué le impide hacer bien su trabajo?
- ¿Qué cambiaría si la decisión dependiera de usted?
- ¿Quién además de usted puede realizar esta tarea?
- ¿Qué puedo hacer yo para apoyarle?

### Lista de verificación para el gemba walk

Imprímala o conviértala en un formulario digital (véase la sección 17). Una versión más extensa con preguntas específicas por rol está en la publicación [Gemba walk checklist and questions](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/).

- [ ] El tema y el área están definidos.
- [ ] Los KPI, el estado del tablero y las acciones abiertas se revisaron de antemano.
- [ ] El estándar pertinente está a mano (impreso o en una tableta).
- [ ] Se informó al equipo o al líder de equipo.
- [ ] Se respetan el equipo de protección personal (EPP) y las normas de seguridad del área.
- [ ] Se observó al menos un puesto de trabajo durante varios ciclos.
- [ ] Las preguntas fueron abiertas; no se dictaron soluciones.
- [ ] Las observaciones se anotaron como hechos (lugar, hora, lo que se vio).
- [ ] Se reconocieron las buenas prácticas.
- [ ] Se resumieron los acuerdos.
- [ ] Las acciones se registraron en la lista de acciones o en la próxima reunión de nivel.
- [ ] Se programó la retroalimentación al equipo.

### Errores comunes en el gemba walk

| Error | Por qué perjudica | Mejor |
|---|---|---|
| Gemba walk como inspección | las personas ocultan los problemas | preguntar en lugar de auditar; tratar los problemas como un regalo |
| Dictar soluciones en el momento | el equipo deja de aprender a resolver problemas, y el líder se convierte en cuello de botella | orientar con preguntas, dejar que el equipo desarrolle la solución |
| Sin tema ni ruta | el recorrido se queda en lo superficial | fijar un enfoque, llevar el estándar |
| Solo hablan los líderes | el conocimiento de los expertos no se aprovecha | escuchar el 80 por ciento del tiempo |
| Sin seguimiento | pérdida de confianza, "al final nunca pasa nada" | retroalimentación dentro de una semana |
| Recorridos irregulares | el recorrido parece un evento especial | ritmo fijo en el trabajo estándar del líder |
| Culpar | miedo, los problemas se ocultan | cuestionar el proceso y el sistema, no a las personas |

Muchos de estos errores comparten una causa raíz: el recorrido se entiende como control. La publicación [Gemba walk mistakes: when the walk becomes an inspection](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/) profundiza en ello. Womack describe su propia actitud así: "Nunca he inventado nada. Solo doy paseos, comento lo que veo y doy valor a la gente para que lo intente" (citado en el prólogo de John Shook) [15].

## Trabajo estándar del líder: el liderazgo como rutina

El trabajo estándar del líder aplica el principio del trabajo estándar a los líderes. LEI lo describe como "kaizen para la dirección": combinado con los comportamientos de liderazgo adecuados, el trabajo estándar del líder desplaza el papel de los mandos de ser los principales resolutores de problemas a desarrollar la capacidad de resolución de problemas de su gente [18].

En "Creating a Lean Culture", David Mann nombra cuatro elementos principales de un sistema de gestión lean: el trabajo estándar del líder, los controles visuales, un proceso diario de rendición de cuentas y la disciplina de liderazgo [19]. La proporción de trabajo estandarizado disminuye con cada nivel de la jerarquía: los operarios pueden trabajar según estándar el 100 por ciento del tiempo, un supervisor alrededor del 80 por ciento de la jornada; en niveles superiores la proporción baja aún más [19].

### Ejemplo: trabajo estándar del líder para un supervisor de producción

| Hora | Actividad | Evidencia |
|---|---|---|
| 6:00–6:10 a. m. | Relevo de turno, revisión del tablero en todas las líneas | Registro de relevo firmado |
| 6:10–6:30 a. m. | Asistir a dos de las reuniones escalonadas de nivel 1 (rotativas) | Lista de asistencia |
| 6:30–6:45 a. m. | Confirmación de proceso: revisar un estándar en una línea | Tarjeta de auditoría |
| 6:45–8:15 a. m. | Presencia en planta: apoyar en averías, resolver faltantes de material y de personal, revisar tableros | Notas, lista de acciones |
| 8:30–8:45 a. m. | Moderar la reunión de nivel 2 | Tablero de nivel 2 |
| 8:45–9:00 a. m. | Preparar escalamientos para el nivel 3 | Lista de escalamientos |
| 9:15–9:35 a. m. | Asistir a la reunión de nivel 3 | Tablero de nivel 3 |
| 10:00–11:00 a. m. | Acompañar a un equipo de resolución de problemas (A3) | Estado del A3 |
| 1:00–1:30 p. m. | Recorrido gemba sobre un tema prioritario | Notas, acciones |
| 1:30–2:00 p. m. | Preparar el relevo de turno | Registro de relevo |

El plan es un ejemplo práctico, no una afirmación de fuente. En un turno de 6:00 a. m. a 2:00 p. m. estructura bien más de dos tercios de la jornada; Mann describe como alcanzable alrededor del 80 por ciento en este nivel [19]. El resto queda deliberadamente abierto para lo inesperado, los temas de personas y los proyectos. El trabajo estándar del líder también es visible: muchas plantas publican en el tablero las rutinas estándar de sus líderes y marcan los puntos completados. Eso crea responsabilidad en ambas direcciones.

### Confirmación de proceso (auditoría de procesos por capas)

Un pilar clave del trabajo estándar del líder es la confirmación de proceso: los líderes de distintos niveles verifican brevemente y con un ritmo fijo si se sigue un estándar y si el estándar sigue siendo adecuado. Varios niveles revisan los mismos procesos con frecuencias distintas, por ejemplo el jefe de equipo a diario, el supervisor semanalmente y el director de planta mensualmente. En las plantas de EE. UU., especialmente en las cadenas de suministro del sector automotriz, la práctica suele conocerse como auditoría de procesos por capas (LPA, por sus siglas en inglés). Las desviaciones no se castigan; se tratan como señal de un estándar no adecuado o de formación insuficiente.

## Andon: hacer visibles las desviaciones en tiempo real

LEI define el andon como una herramienta de gestión visual que muestra de un vistazo el estado de las operaciones en un área y señala cada vez que se produce una anomalía [17]. La señal se activa mediante un cordón o pulsador en el puesto de trabajo, o automáticamente a través de un sensor de la máquina. En Toyota la línea sigue funcionando tras accionar el cordón mientras el equipo intenta resolver el problema; si no se consigue dentro del ciclo, la línea se detiene en una posición fija al final de la estación [17]. El número de estación iluminado llama al líder de equipo, del que se espera una respuesta rápida [17].

En la gestión de piso de planta, el andon cubre el hueco entre las reuniones programadas: la reunión de nivel mira lo ocurrido ayer y planifica hoy, el andon atiende lo que pasa ahora mismo. En Toyota, un líder de equipo (hancho) dirige un equipo de cinco a ocho personas, responde a las paradas de línea y a las llamadas andon, lidera las actividades de mejora y verifica a diario el cumplimiento del trabajo estándar con hojas de auditoría [21]. Esto es importante al trasladar el modelo a plantas occidentales: el líder de equipo de Toyota es un empleado por horas sin autoridad disciplinaria y sin un puesto fijo en la línea; domina todas las tareas del equipo y cubre pausas, ausencias o acumulaciones de trabajo [21]. Si se añade este rol sobre un operador principal que está totalmente atado al tiempo de ciclo de la línea, no se obtendrá una respuesta rápida al andon. Lo mismo ocurre con un líder de equipo responsable de 25 personas.

Los eventos andon deben figurar en el tablero: número de llamadas por turno, tiempo medio de respuesta y motivos más frecuentes. Muchas llamadas no son al principio una mala señal; muestran que el equipo está haciendo visibles los problemas.

## Roles y responsabilidades

| Rol | Tareas en la gestión de piso de planta |
|---|---|
| Director de planta | modelo a seguir, facilita el nivel 4, acude al gemba con regularidad, decide sobre recursos para escalamientos, despliega objetivos (p. ej., mediante hoshin kanri) |
| Jefe de departamento / de producción | facilita el nivel 3, orienta a los supervisores, asegura que los niveles estén vinculados |
| Supervisor / jefe de turno | facilita el nivel 2, confirmación de procesos, orienta a los líderes de equipo |
| Líder de equipo | facilita el nivel 1, mantiene el tablero con el equipo, responde al andon, implanta la contención |
| Operarios y técnicos | informan de desviaciones, aportan ideas, son responsables de las acciones, mantienen partes del tablero |
| Funciones de apoyo (calidad, mantenimiento, cadena de suministro, EHS) | asisten a los niveles 2 y 3, se hacen cargo de problemas escalados, aportan datos |
| Coach de piso de planta / especialista en lean o CI | asiste a las reuniones, da retroalimentación sobre la facilitación, forma en resolución de problemas |
| Representantes de los empleados (sindicato, comité de seguridad; en Alemania, el comité de empresa) | participan desde el principio; aseguran que los KPI no se usen para vigilar el comportamiento o el rendimiento de las personas (véase la sección 13) |

CETPM describe a los coaches de piso de planta que observan las reuniones y dan retroalimentación posteriormente [3]. Este rol suele subestimarse durante la implantación: un líder de equipo que nunca ha facilitado una reunión necesita retroalimentación concreta en las primeras semanas.

### Cómo cambia el papel del líder

| Antes | En la gestión de piso de planta |
|---|---|
| resuelve los problemas personalmente | desarrolla la capacidad de resolución de problemas del equipo |
| recibe los informes en la oficina | ve la realidad en el piso de planta |
| pregunta "¿Quién hizo esto?" | pregunta "¿Qué en el proceso permitió que esto ocurriera?" |
| responde a los escalamientos por correo electrónico | responde a los escalamientos en la siguiente reunión |
| juzga los KPI | usa los KPI para iniciar una conversación |

## Cultura, seguridad psicológica y reglas para el monitoreo de empleados

La gestión de piso de planta solo funciona cuando los problemas se nombran abiertamente. Eso suena obvio, pero no es así en muchas organizaciones. Un campo rojo en el tablero que conduce a críticas contra el equipo será pintado de verde la próxima vez.

La investigadora organizacional Amy Edmondson, de Harvard, dio forma al concepto de seguridad psicológica en equipos: "una creencia compartida por los miembros de un equipo de que el equipo es seguro para asumir riesgos interpersonales" [23]. Su estudio de 51 equipos de trabajo en un fabricante de muebles con unos 5.000 empleados se publicó en Administrative Science Quarterly en 1999 [23] y es una de las obras más citadas sobre el comportamiento de aprendizaje en equipos. La implicación para la gestión de piso de planta: solo en equipos psicológicamente seguros se informan los errores, se documentan los casi accidentes y se cuestionan los estándares.

### Cómo los líderes construyen seguridad psicológica en el tablero

- **El rojo es bienvenido.** Agradezca a las personas cada problema que se haga visible. La reacción ante el primer campo rojo decide todos los que vendrán después.
- **Proceso, no persona.** Pregunte por las condiciones, no por los culpables.
- **Muestre sus propios errores.** Los líderes que nombran abiertamente sus propios fallos bajan el umbral.
- **Responda a las escalaciones.** Las personas que escalan y nunca reciben respuesta dejan de escalar.
- **Implemente las ideas.** La implementación visible de las sugerencias es la forma más fuerte de reconocimiento. El estudio de KIT y IPRI criticó que los empleados a menudo no podían ver el estado de sus sugerencias, lo que reduce la motivación [24].
- **No castigue los reportes de seguridad.** OSHA espera que los trabajadores "no sufran represalias" cuando informan lesiones, enfermedades y riesgos [49]; la reacción en el tablero es donde esa expectativa se vuelve real.

La entrada [Cultura de excelencia operacional en el piso de planta](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/) describe cómo anclar esa cultura a largo plazo; el compendio [Excelencia operacional](https://www.m365.fm/en/learn/operational-excellence/) la sitúa en un contexto más amplio. Haufe Akademie identifica el hansei, la práctica japonesa de reflexión autocrítica, como un elemento básico de una cultura positiva frente a los errores [43].

### Reglas para el monitoreo de empleados: ley laboral de EE. UU. y consejos de empresa alemanes

Un tablero digital que muestra datos de máquinas junto con los inicios de sesión de los usuarios puede interpretarse como un sistema de monitoreo. Cuánto importa eso depende de dónde esté la planta. Lo siguiente es información general, no asesoramiento jurídico; haga revisar cualquier implantación digital por un asesor laboral.

**En EE. UU.** No existe un derecho general de cogestión comparable al de Alemania, pero se aplican varias normas:

- **Plantas sindicalizadas:** La NLRB ha tratado la instalación y el uso de cámaras de vigilancia ocultas como un asunto de negociación obligatoria (Colgate-Palmolive, 1997), criterio que el Séptimo Circuito respaldó en National Steel Corp. v. NLRB (2003) [54]. Si un tablero digital concreto con datos personales entra dentro del deber de negociar es una cuestión que debe resolverse caso por caso; la vía segura es involucrar al sindicato antes de la implantación.
- **Plantas no sindicalizadas:** En octubre de 2022, el entonces Abogado General de la NLRB emitió el memorando GC 23-02, que sostenía que la vigilancia electrónica intrusiva puede interferir con los derechos del Artículo 7 de la NLRA de los empleados e instaba a divulgar las tecnologías de monitoreo [52]. El 14 de febrero de 2025, el Abogado General en funciones rescindió ese memorando (GC 25-05) [53]. La propia NLRA no ha cambiado, por lo que el monitoreo que tienda a inhibir la actividad protegida sigue representando un riesgo.
- **Leyes estatales de notificación:** Algunos estados exigen notificar el monitoreo electrónico. Nueva York, por ejemplo, obliga a los empleadores a dar aviso previo por escrito al contratar a los empleados cuyo uso del teléfono, correo electrónico o internet sea monitoreado [55]. Una aplicación de piso de planta que registra el uso individual del sistema puede quedar sujeta a esas normas.
- **Notificación de seguridad:** Como se muestra en la sección 7, las normas de OSHA protegen a los empleados que informan lesiones [49][50]. Un tablero que señala a la persona que informó un incidente va en contra de esa protección.

**En Alemania (relevante para empresas estadounidenses con plantas en Alemania o con una matriz alemana).** Involucrar al comité de empresa (Betriebsrat, el órgano elegido de representación de los empleados con derechos legales de codeterminación) no es una mera formalidad. ifaa recomienda involucrarlo desde el principio y diseñar los KPI de forma que no surja temor a la vigilancia [2]. Con cuadros digitales que utilizan datos de máquinas y datos personales, se aplica el artículo 87(1) núm. 6 de la Ley alemana de Constitución de Empresas (BetrVG): el comité de empresa tiene voz en "la introducción y el uso de dispositivos técnicos destinados a supervisar el comportamiento o el rendimiento de los empleados" [44]. Según el Tribunal Federal de Trabajo (BAG), basta con que un sistema sea objetivamente apto para recopilar datos de comportamiento o rendimiento; la intención del empleador de supervisar no importa [48]. Esto se aplica en general a Power BI, Power Apps o un MES con inicios de sesión de usuario. El RGPD se aplica además. En la práctica, un acuerdo de empresa (Betriebsvereinbarung) regula los detalles.

**Lo que funciona en ambos países:** una regla escrita que defina qué datos se muestran y con qué nivel de agregación, quién puede ver qué informes, cuánto tiempo se conservan los datos y que los KPI evalúan procesos, no personas. Ese es el mismo contenido que cubre un acuerdo de empresa alemán, y ofrece a un sindicato o a una plantilla estadounidense una respuesta clara a la pregunta "¿Se va a usar esto contra nosotros?"

## Cómo implantar la gestión en planta: una hoja de ruta de seis fases

> **En resumen:** Empiece por un área piloto, diseñe el cuadro con el equipo, ejecútelo durante unos tres meses con coaching y construya el siguiente nivel solo cuando el de abajo funcione de forma fiable.

ifaa ha descrito un modelo de implantación en seis fases y lo ha probado en varias pequeñas y medianas empresas; la evaluación demostró que el concepto puede introducirse con medios sencillos [2]. La hoja de ruta siguiente se basa en este modelo y añade el paseo gemba, la cascada y la digitalización.

| Fase | Contenido | Participantes | Duración (valor orientativo) |
|---|---|---|---|
| 1. Fijar objetivos | definir objetivos, área piloto y criterios de éxito; recorrido por la planta | dirección ejecutiva, dirección de producción, responsable del proyecto, facilitador | medio día según ifaa [2] |
| 2. Informar y generar conciencia | sesión informativa con preguntas y respuestas; implicar a los representantes de los empleados | dirección, mandos intermedios, empleados del área piloto, sindicato o comité de empresa cuando proceda | medio día según la cifra de ifaa [2] |
| 3. Introducir | diseñar el cuadro con el equipo, elegir los KPI, practicar la facilitación | mandos y empleados del área piloto, de 6 a 8 personas | dos bloques de medio día de como máximo 4 horas cada uno según ifaa [2] |
| 4. Prueba | reuniones diarias en planta, coaching, mejora iterativa del cuadro | equipo piloto, coach | unos 3 meses según ifaa [2] |
| 5. Revisión | observación neutral de las reuniones, retroalimentación | observadores internos o externos | periódicamente durante la prueba [2] |
| 6. Validar y extender | taller de evaluación, estandarizar cuadro y reunión, construir la cascada, otras áreas | todos los participantes del proyecto, después otras áreas | taller de 2 a 3 horas según ifaa [2], despliegue según el tamaño de la planta |

### Recomendaciones prácticas para cada fase

**Fase 1:** Elija un área piloto con un proceso estable, un liderazgo motivado y un problema visible. ifaa habla de un "faro" que arrastra el despliegue posterior [2]. Un área sumida en el caos no es adecuada, porque allí la estabilidad debe venir primero.

**Fase 2:** Explique el porqué, no solo el qué. Deje claro que los KPI evalúan procesos, no personas.

**Fase 3:** Deje que el equipo diseñe el cuadro. Empiece con cuatro a seis KPI como máximo [3] y una lista de acciones sencilla. Un cuadro perfecto el primer día no es necesario ni útil.

**Fase 4:** Las primeras semanas son decisivas. Las reuniones al principio duran más de lo debido [3]. Un coach observa la reunión y da al facilitador retroalimentación privada después. Orth describe unos 15 minutos para ello, que abarcan un punto fuerte, un área de mejora y una tarea concreta [3]. En las primeras semanas esto compensa a diario; después, semanalmente. Los paseos gemba por el siguiente nivel de liderazgo comienzan en esta fase.

**Fase 5:** Utilice una evaluación sencilla (véase la comprobación de madurez más abajo) para verificar que el sistema funciona.

**Fase 6:** Construya el nivel 2 solo cuando el nivel 1 funcione de forma fiable, y después los niveles 3 y 4. Sustituya las reuniones existentes en lugar de añadir otras nuevas. Gelbrich señala como error típico el no usar la gestión en planta para sustituir las reuniones existentes [3].

### Requisitos previos y factores de éxito según ifaa

ifaa nennt als Voraussetzungen das Commitment des Managements, ein Budget an Zeit und Geld, die unternehmensweite Kommunikation des Projekts, einen definierten Zielzustand (Vision und Mission), die Überzeugung der Beteiligten sowie die Einbindung des Betriebsrats [2]. Für den Erfolg betont sie außerdem Führungskräfte, die an den Besprechungen vor Ort teilnehmen, klar kommunizierte und über alle Ebenen heruntergebrochene Ziele, Mitarbeiterbeteiligung und Schulung sowie Disziplin, Konsequenz und Ausdauer, denn Shop Floor Management ist keine einmalige Kampagne [2]. In US-Werken ohne Betriebsrat gilt dieselbe Logik für die Gewerkschaft bzw. in einem gewerkschaftsfreien Werk für eine frühzeitige und offene Kommunikation mit der Belegschaft.

### Reifegradprüfung: Funktioniert Ihr Shop Floor Management?

- [ ] Das Board wurde heute aktualisiert, und das Team kann jede KPI erklären.
- [ ] Jede rote KPI hat eine Maßnahme mit Verantwortlichem und Fälligkeitsdatum.
- [ ] Besprechungen beginnen pünktlich und bleiben im Zeitrahmen.
- [ ] Eskalationen erreichen die nächste Ebene noch am selben Tag und werden beantwortet.
- [ ] Führungskräfte machen Gemba-Walks in einem festen Rhythmus.
- [ ] Maßnahmen werden erst geschlossen, wenn ihre Wirkung nachgewiesen ist.
- [ ] Die Zahl der gemeldeten Probleme und Beinahe-Unfälle ist gestiegen, nicht gesunken.
- [ ] Mindestens eine bestehende Besprechung wurde durch das Tier-Meeting ersetzt.
- [ ] Verbesserte Prozesse sind in aktualisierten Standards dokumentiert.
- [ ] Mitarbeiter können den Status ihrer Ideen einsehen.

Acht oder mehr Ja-Antworten deuten auf ein wirksames System hin; weniger als fünf deuten auf ein Board hin, das eher Ritual als Führungsinstrument ist.

## Häufige Fehler und wie Sie sie beheben

Aus Beobachtungen seit 2015 in rund 50 deutschen Unternehmen aus verschiedenen Branchen leitete Gelbrich zehn häufige Gründe ab, warum Shop Floor Management scheitert [3]. Die Tabelle stellt ihnen Gegenmaßnahmen gegenüber.

| Fehler (nach Gelbrich [3]) | Gegenmaßnahme |
|---|---|
| unrealistisch hohe Erwartungen ohne direktes Engagement der Führung | der Werksleiter moderiert Tier 4 persönlich und geht regelmäßig ins Gemba |
| fehlerhafte Verknüpfung der Ebenen des Shop Floor Managements | ineinandergreifende Kaskade, definierte Eskalationsauslöser, Antwortpflicht |
| Inhaltsüberladung mit unnötigen Informationen | vier bis sechs KPIs, alles Übrige vom Board entfernen |
| komplizierte, zeitaufwendige Aktualisierung der Informationen | Datenerfassung vereinfachen, dort automatisieren, wo es sinnvoll ist |
| für den Prozess irrelevante KPIs | KPIs mit den drei Leitfragen neu ableiten |
| KPIs, die das Team nicht beeinflussen kann | auf die nächsthöhere Ebene verlagern |
| lange Aktualisierungsschleifen und veraltete Informationen | Aktualisierung als festen Bestandteil der Schichtübergabe machen |
| keine Gegenmaßnahmen bei festgestellten Abweichungen | Regel: kein Rot ohne Maßnahme |
| Shop-Floor-Besprechungen, die zu lange dauern, besonders während der Einführung | Zeitrahmen, Stehbesprechung, Problemlösung aus dem Meeting auslagern |
| Shop Floor Management ersetzt bestehende Besprechungen nicht | Besprechungsinventur, Doppelungen streichen |

Drei weitere Fehler treten in der Praxis häufig auf:

- **KPI-Theater:** KPIs werden präsentiert, aber nicht besprochen. Die Frage „Was tun wir jetzt?“ fehlt.
- **Gemba-Tourismus:** Führungskräfte gehen ohne Thema, ohne Fragen und ohne Nachverfolgung durch das Werk.
- **Zu früh digitalisieren:** Ein Werk führt Software ein, bevor die Routinen stehen. Digitalisiert wird dann ein Prozess, den niemand lebt.

## Analógico o digital? Gestión digital del piso de planta en comparación

La pregunta "¿pizarra o pantalla?" a menudo se trata como una cuestión de principios. Puede responderse con sensatez. La investigación disponible sugiere que la situación actual es mayormente analógica: en el estudio de KIT e IPRI (18 empresas), la gestión del piso de planta se realizaba principalmente en papel y solo con apoyo digital parcial; solo alrededor del 10 por ciento de las reuniones utilizaba un tablero digital de piso de planta, y la visualización digital de los KPI normalmente empezaba solo a nivel de mandos intermedios [24][25]. El estudio también describe traspasos de información rotos entre papel, Excel y OneNote, sin un sistema líder, lo que dificulta el seguimiento entre niveles [24].

| Criterio | Tablero analógico | Tablero digital |
|---|---|---|
| Coste inicial | muy bajo | licencias, hardware, integración |
| Propiedad práctica | el equipo escribe en él, alta identificación | riesgo de que el equipo solo lo consuma |
| Actualidad | depende del mantenimiento manual | automática, hasta casi en tiempo real |
| Calidad de los datos | errores de transcripción, lagunas | consistentes, siempre que las fuentes sean fiables |
| Escalado entre niveles | manual, propenso a errores | de extremo a extremo, trazable |
| Seguimiento de acciones | disciplina individual | con soporte del sistema, con fechas límite y recordatorios |
| Equipos distribuidos, varias plantas | no es posible | posible |
| Historial y análisis | fotos, carpetas | analizable, tendencias, patrones |
| Resiliencia | siempre funciona | depende de la red y de los sistemas |
| Reglas para la supervisión de empleados | normalmente poco críticas | se recomiendan normas escritas sobre datos (sindicato, legislación estatal; acuerdo de empresa en Alemania) |
| Seguridad OT | no es un problema | se necesitan segmentación de red y control de acceso (ver sección 18) |

### ¿Qué enfoque y cuándo?

- **Empiece en analógico** cuando las rutinas sean nuevas, el equipo sea pequeño y los KPI sean fáciles de registrar a mano. La pizarra obliga a mantenerlo sencillo.
- **Pase a híbrido** cuando los datos de las máquinas fluyan automáticamente a una pantalla, pero las acciones y las ideas sigan mantenidas a mano en la pizarra. Para muchas plantas, este es el mejor compromiso.
- **Amplíe digitalmente** cuando haya que vincular varios niveles, turnos o plantas, cuando la captura manual de datos suponga demasiado esfuerzo o cuando las acciones se pierdan entre niveles.

CETPM se refiere a un modelo de cinco fases de Müller-Seegers para la digitalización: definición del proyecto y de los objetivos, prueba de proveedores y selección de herramientas, piloto (cuatro semanas como máximo), fase de ajuste (solo si es necesaria), despliegue y operación; en total, espera unos seis meses [3]. Más importante que la herramienta es el orden: primero la rutina, después lo digital. La entrada [Shop floor optimization: ways to improve flow](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/) muestra cómo mejorar el flujo de materiales en paralelo.

## Construcción de un tablero digital de planta con Microsoft 365

> **En resumen:** Teams aporta el espacio, Power BI el panel de KPI, Power Apps la captura de datos, Lists la lista de acciones y Fabric las alertas en tiempo real. Las palancas más importantes son las licencias para los usuarios que solo consultan, el intervalo de actualización de Power BI y el modelo de datos.

Muchos fabricantes ya usan Microsoft 365 para el correo, Teams y los documentos. Tiene sentido construir el tablero digital de planta donde los empleados ya trabajan. Los bloques de construcción descritos a continuación están documentados en Microsoft Learn; verifique los requisitos de licencia y la disponibilidad en su propio inquilino antes de iniciar un proyecto. Los proveedores del sector público y de defensa de EE. UU. que usan las nubes gubernamentales de Microsoft (GCC, GCC High) deben comprobar por separado la disponibilidad de las funciones en esas nubes.

### Arquitectura de referencia de un vistazo

| Función del tablero | Bloque de construcción de Microsoft | Qué hace (según la documentación de Microsoft) |
|---|---|---|
| Espacio de comunicación por área | Microsoft Teams (un equipo por área, un canal por línea o nivel) | canales con pestañas para el tablero, las acciones y las aplicaciones |
| Visualizar KPI | Power BI, integrado como pestaña en Teams | informes interactivos en canales y chats, vistas previas de enlaces, notificaciones en el feed de actividad [28] |
| KPI con objetivos | Métricas de Power BI (cuadros de mando) | métricas con responsables, valor actual y objetivo, estado, revisiones; como pestaña en canales o reuniones [31] |
| Captura de datos en el puesto de trabajo | Power Apps (aplicación de lienzo como pestaña de Teams) | pantallas de entrada personalizadas, p. ej., para motivos de paradas, desperdicio, ideas [30] |
| Lista de acciones, registro de incidencias | Microsoft Lists (p. ej., la plantilla "Issue tracker") o Planner | listas con vistas, reglas y notificaciones, almacenadas en SharePoint [38] |
| Tareas estándar en varias plantas | Planner con publicación de tareas | distribuir listas de tareas a muchos equipos y hacer seguimiento de su finalización por ubicación [37] |
| Comunicación de turnos | Aplicaciones de Teams para trabajadores de primera línea (Shifts, Walkie Talkie, Approvals, Updates) | horarios de turnos, comunicación pulsar para hablar, aprobaciones, actualizaciones periódicas [35][36] |
| Datos en tiempo real y alertas | Microsoft Fabric Real-Time Intelligence (Eventstream, Eventhouse, Real-Time Dashboard, Activator) | captura, análisis y visualización de datos en streaming, y actuación automática ante condiciones [32][33] |

### Power BI como panel de KPI

Los informes de Power BI pueden integrarse como pestaña en un canal de Teams, de modo que el equipo ve y analiza los KPI allí donde ya se comunica [28]. En la práctica, tres puntos son importantes:

1. **Permisos:** integrar un informe en Teams no concede automáticamente a los usuarios permiso para verlo; los permisos deben otorgarse de forma explícita [28].
2. **Licencias:** los usuarios con una licencia gratuita de Fabric pueden ver el contenido de un espacio de trabajo en una capacidad Premium (SKU P) o en una capacidad de Fabric F64 o superior; para crear y compartir se requiere Power BI Pro o Premium Per User [28]. Con capacidades inferiores a F64, cada usuario que consulte necesita una licencia Pro o PPU. Con muchos usuarios en planta, este es el principal factor de coste; aclare las licencias de las pantallas de visualización en la línea con su socio de licencias de Microsoft.
3. **Limitaciones:** los paneles de Power BI (a diferencia de los informes) no pueden integrarse en la pestaña de Power BI, y esta pestaña no admite filtros por URL [28].

**¿Con qué actualidad puede estar un tablero de Power BI?** La actualización automática de página funciona con orígenes DirectQuery, Direct Lake y algunos escenarios de conexión en vivo, pero no en modo importación [29]. En capacidad compartida (típica si solo se dispone de licencias Pro), el intervalo mínimo es de 30 minutos y no está disponible la detección de cambios. En capacidad dedicada (Fabric F, Premium P) y con Premium Per User, son posibles intervalos de hasta un segundo con DirectQuery si el administrador de la capacidad lo permite; el intervalo mínimo predeterminado es de cinco minutos, y de cinco segundos para la detección de cambios [29]. Eso basta para un tablero que muestre unidades por hora; para funciones de andon reales, Real-Time Intelligence es la opción más adecuada.

### Power Apps para la captura de datos en el puesto de trabajo

Las aplicaciones de lienzo creadas con Power Apps pueden añadirse a un canal de Teams mediante la pestaña "Power Apps", siempre que la aplicación se haya compartido previamente con los usuarios [30]. Aplicaciones típicas de planta:

- captura del motivo de parada con pocos botones grandes (p. ej., "falta de material", "rotura de herramienta", "calidad"),
- captura de desperdicio y retrabajo por hora,
- ideas y propuestas de mejora con foto,
- una lista de verificación digital del paseo gemba con observaciones y acciones,
- confirmación de procesos (auditoría de procesos por capas) en una tableta.

Microsoft enumera limitaciones conocidas, por ejemplo que sensores como la ubicación o la brújula no son compatibles en la aplicación de escritorio de Teams y que los archivos adjuntos no se pueden descargar en la aplicación móvil de Teams [30]. Importante para la decisión de arquitectura: los entornos de Dataverse para Teams están en desuso [30]. Según Microsoft, a partir del 15 de noviembre de 2026 no se pueden crear nuevos entornos de Dataverse para Teams; los entornos que no se hayan actualizado se suspenden el 15 de septiembre de 2027 y se dan de baja el 30 de octubre de 2027 [45]. Por ello, las nuevas soluciones deben construirse sobre un entorno regular de Dataverse, listas de SharePoint u otras fuentes de datos.

**La cuestión de licencias de Power Apps:** las tablas de Dataverse, los conectores premium y las puertas de enlace de datos locales (por ejemplo, para una base de datos MES en la planta) requieren derechos premium de Power Apps [46]. Una aplicación de captura basada en listas de SharePoint normalmente funciona con los derechos incluidos en Microsoft 365; la Guía de licencias de Power Platform describe el alcance exacto. Esta bifurcación suele determinar el coste por usuario en la línea.

### Acciones y tareas

Microsoft Lists, utilizable como pestaña en Teams, encaja bien con la lista de acciones. Microsoft describe Lists como una herramienta para hacer seguimiento de información como incidencias, activos, rutinas o incidentes, con vistas, reglas y notificaciones personalizables; hay una plantilla "Issue tracker" disponible, y los datos residen en el sitio de equipo de SharePoint [38]. Una lista con las columnas problema, KPI, causa raíz, acción, responsable, fecha límite, estado, efecto verificado y nivel de escalado refleja la columna de acciones del tablero. Un filtro por nivel muestra exactamente los elementos relevantes en cada reunión de cada nivel.

Las rutinas estandarizadas, como las comprobaciones diarias de 5S o las confirmaciones semanales de proceso en todas las líneas, pueden distribuirse mediante la publicación de tareas en Planner. Microsoft describe cómo los responsables de operaciones pueden publicar listas de tareas en equipos según una jerarquía definida y hacer seguimiento de la finalización mediante informes por tarea y por lista; las tareas pueden contener listas de verificación de hasta 20 elementos [37].

### Tiempo real y alertas con Microsoft Fabric

Para las plantas que quieran usar datos de máquinas en tiempo real, Microsoft Fabric Real-Time Intelligence ofrece varios bloques de construcción [32]:

- **Eventstream** captura, transforma y enruta grandes volúmenes de datos en tiempo real sin código; los conectores incluyen MQTT, Apache Kafka y captura de cambios de bases de datos. Las fuentes de Azure como Event Hubs e IoT Hub están disponibles en Real-Time hub.
- **Eventhouse** está optimizado para eventos de streaming basados en tiempo; las consultas usan KQL (Kusto Query Language) o, en el conjunto de consultas KQL, T-SQL.
- **Real-Time Dashboard** visualiza datos en movimiento.
- **Activator** supervisa flujos de datos con baja latencia (subsegundo para reglas sin estado sobre datos en streaming) y activa acciones cuando se alcanzan umbrales o se detectan patrones, incluida la ausencia de datos. Las acciones incluyen mensajes de Teams a personas, grupos o canales, correos electrónicos, flujos de Power Automate y elementos de Fabric como canalizaciones o cuadernos [33].

Microsoft menciona explícitamente la fabricación y el IoT como escenarios [32]. Para la gestión en el piso de producción, esto significa que una regla de Activator puede, por ejemplo, publicar un mensaje en el canal de Teams de la línea cuando una máquina lleva parada más tiempo del definido. Es un andon digital que llega al líder de equipo en su smartphone. Complementa el cordón de parada y la baliza luminosa de la línea, pero no los sustituye, mientras no todos los líderes de equipo dispongan de un teléfono de empresa.

### Ejemplo: un tablero de nivel 1 en Teams

| Pestaña del canal | Contenido | Bloque de construcción |
|---|---|---|
| "Tablero" | Página SQDCP con estado rojo/verde, objetivo frente a real por hora, 3 principales motivos de paro | Informe de Power BI |
| "Captura" | motivos de paro, chatarra, ideas | Aplicación de lienzo de Power Apps |
| "Acciones" | lista de acciones filtrada para el nivel 1 | Microsoft Lists |
| "Rutinas" | comprobaciones diarias, 5S, confirmación de proceso | Planner (tareas publicadas) |
| "Objetivos" | objetivos de área con revisiones de seguimiento | Métricas de Power BI |
| Publicaciones del canal | escalados, mensajes andon, relevo de turno | Teams, Activator, Power Automate |

### Plan de implantación: seis pasos hasta tu primer tablero digital de nivel 1

Para los administradores de Microsoft 365, el siguiente orden ha demostrado funcionar. Parte de la premisa de que el equipo piloto ya trabaja con un tablero analógico.

1. **Fotografiar el tablero y definir los KPI.** Copiar los campos y KPI del tablero analógico; para cada KPI, definir fórmula, fuente, objetivo y necesidad de actualización.
2. **Crear el equipo y los canales.** Un equipo por área, un canal por línea o nivel; permisos mediante grupos en lugar de individuos.
3. **Construir la lista de acciones en Microsoft Lists.** Columnas como en "Acciones y tareas" más arriba, una vista por nivel, recordatorio en la fecha de vencimiento.
4. **Crear la aplicación de captura.** Una aplicación de lienzo con unos pocos botones grandes para motivos de paradas y chatarra; datos en listas de SharePoint o Dataverse (atención a la cuestión de licencias).
5. **Conectar el informe de Power BI.** Una página de informe por tablero, lógica rojo/verde frente a los objetivos, DirectQuery o Direct Lake si se necesita actualizar la página; incrustar como pestaña en el canal y otorgar acceso de lectura.
6. **Probar durante cuatro semanas en la reunión y luego ampliar.** Solo cuando el equipo utilice el tablero digital en la propia reunión de nivel 1 se añadirán las alertas de Activator, las rutinas de Planner y la conexión con el nivel 2.

Acuerde las reglas de datos con los representantes de los empleados antes del paso 4 (y, en Alemania, con el comité de empresa), porque a partir de ese paso pueden generarse datos que puedan rastrearse hasta personas concretas.

### Lo que Microsoft 365 no reemplaza

Microsoft 365 es un conjunto de herramientas, no un sistema terminado de gestión visual de planta. Usted debe diseñar por sí mismo la lógica de la cascada, las reglas de escalado, el vínculo entre KPI, acción y efecto verificado, y la disciplina de facilitación. Sin un modelo de datos claro, pronto acabará con un conjunto de listas e informes sin conexión, exactamente las transferencias rotas entre herramientas que la investigación critica en la gestión visual analógica de planta [24]. Revise también pronto la cuestión del hardware: pantallas grandes en la línea, tabletas robustas y cuentas de dispositivo para equipos compartidos generan esfuerzo propio.

## Integración de datos: MES, ERP y datos de máquinas

> **En resumen:** Las unidades y las paradas llegan automáticamente desde la máquina o el MES; los motivos de parada y las ideas se capturan de forma sencilla a mano. Cada KPI se define una sola vez y se calcula igual en todos los niveles.

Un tablero digital solo es tan bueno como sus datos. Fuentes típicas:

| Fuente | Datos para el tablero | Vía típica |
|---|---|---|
| ERP (p. ej., SAP, Microsoft Dynamics 365) | pedidos, cantidades planificadas, fechas de entrega, backlog | exportación de datos o conector hacia Power BI o Fabric |
| MES / recogida de datos de producción y máquinas | unidades, paradas, motivos de parada, OEE, chatarra | conexión a base de datos o API, replicación en Fabric |
| Controles de máquina (PLC, OPC UA) | estados, contadores, valores de proceso | pasarela de borde, p. ej., Azure IoT Operations con el conector OPC UA, luego vía MQTT |
| Sistema de gestión de calidad (QMS) | resultados de inspección, reclamaciones | conexión a base de datos o API |
| Sistemas de RR. HH. y de turnos / Shifts | asistencia, plan de turnos | interfaz, agregada |
| Captura manual | motivos de parada, ideas, eventos de seguridad | Power Apps, Microsoft Lists |

En términos de ISA-95 (ANSI/ISA-95, internacionalmente IEC 62264), el tablero se sitúa sobre el nivel 3 (gestión de operaciones de fabricación, como un MES) y el nivel 4 (planificación empresarial y logística, como un ERP); la norma trata principalmente la interfaz entre estos dos niveles [56]. Usar su vocabulario para pedidos, materiales y equipos facilita alinear el modelo de datos del tablero con el MES y el ERP.

Para conectar máquinas, Microsoft describe el conector para OPC UA en Azure IoT Operations: se conecta a servidores OPC UA, lee datos y los publica como mensajes JSON en formato OPC UA PubSub hacia el broker MQTT; también puede descubrir activos automáticamente [34]. Desde allí, las rutas de datos de Azure IoT Operations envían los datos a destinos como Microsoft Fabric OneLake, Azure Data Explorer o un endpoint de Kafka [47]. La documentación revisada aquí no describe un conector OPC UA directamente en Fabric; la vía pasa por la pasarela de borde.

En cuanto las redes de máquinas se conectan a servicios en la nube, la seguridad OT forma parte del proyecto. La serie ISA/IEC 62443 aborda la seguridad de los sistemas de automatización y control industrial y conecta operaciones con TI [57]; el NIST Cybersecurity Framework (CSF) 2.0, publicado el 26 de febrero de 2024, se describe a sí mismo como una taxonomía de resultados de ciberseguridad de alto nivel y puede servir de referencia para gobernar ese trabajo [59]. Un tablero de planta debe leer datos de la red OT, no abrir un camino hacia ella.

### Principios para la arquitectura de datos

1. **Una sola verdad por KPI.** Defina cada KPI una vez (fórmula, fuente, granularidad) y use esa definición en todos los niveles. Así, el OEE del tablero de nivel 1 coincide con el OEE del informe de planta.
2. **Automatice lo que es estable.** Las unidades y las paradas proceden de la máquina o del MES. Los motivos de parada que requieren juicio humano se registran a mano, de forma sencilla y rápida.
3. **Latencia acorde con la decisión.** El nivel 1 necesita valores horarios o en tiempo real; el nivel 4, valores diarios o semanales. No todo tiene que ser en tiempo real.
4. **Privacidad y normas laborales desde el principio.** Los datos personales se agregan; los roles y permisos quedan documentados.

El compendio [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) aborda en profundidad estas cuestiones de TI para la fabricación, y [Digital twin in manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/) muestra hacia dónde llevan después los datos de planta en tiempo real.

## Soporte de software: el ejemplo de iFAKT Polaris

> **Nota: El autor trabaja en iFAKT GmbH.**

Además de construir su propio tablero con Microsoft 365, existe software especializado para la gestión lean digital. Un ejemplo es [Polaris](https://www.m365.fm/entity/polaris/) de [iFAKT GmbH](https://www.m365.fm/entity/ifakt/), con sede en Stuttgart, Alemania. Las soluciones Polaris figuran en Microsoft AppSource, incluido Polaris VSM para el mapeo digital de flujo de valor [39] y Polaris BSM para el modelado de procesos de negocio en la gestión lean digital [40]. El compendio [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) describe la familia de productos en detalle.

Según el proveedor, dos módulos son relevantes para la gestión en el piso de producción [unverified]:

- **[Polaris Operator](https://www.m365.fm/entity/polaris-operator/)** lleva las tareas directamente al piso de producción, por ejemplo las acciones de las reuniones por niveles o de los recorridos gemba, para que lleguen a los responsables en la línea y se pueda hacer seguimiento de su cumplimiento.
- **[Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)** muestra los KPI en paneles y respalda el muro de KPI del tablero en los distintos niveles.

Valoración: una solución especializada no diseña por usted la cascada, las reglas de escalado ni la disciplina de facilitación, como tampoco lo hace una solución propia. Sí puede preestructurar el vínculo entre KPI, acción y efecto verificado, y así acortar el trabajo sobre su propio modelo de datos. Lo decisivo es si la solución encaja con su paisaje de TI existente; la ficha en AppSource indica un enfoque en el ecosistema Microsoft.

Además de Polaris hay muchos otros proveedores, como módulos de piso de producción de proveedores de MES o plataformas independientes para lean y reuniones por niveles. Independientemente del proveedor, estas preguntas ayudan en la selección:

- ¿El software representa la cascada con escalado y respuesta entre varios niveles?
- ¿Puede cerrarse una acción solo después de demostrar su efecto?
- ¿Qué interfaces existen con ERP, MES y máquinas, y quién las mantiene?
- ¿Puede el software agregar KPI de la forma que exigen sus reglas de datos (convenio colectivo, legislación estatal, acuerdo de empresa)?
- ¿Qué ocurre cuando la red de la línea se cae?
- ¿Cómo se licencian los visores, y cuánto cuesta una pantalla en la línea?

Sobre la empresa: iFAKT GmbH tiene su sede en Curiestrasse 2, 70563 Stuttgart, Alemania (registro mercantil Stuttgart HRB 22661) [61]. Según la compañía, fue fundada en 2001 y tiene unos 25 empleados (información de la empresa, no verificada de forma independiente). Su sitio web muestra un sello de TÜV SÜD por la certificación ISO 9001 e ISO/IEC 27001 [61], y quedó en segundo lugar en la categoría de producción del Best of Technology Award 2025 del semanario económico alemán WirtschaftsWoche con su sistema Polaris IMS [60].

## Glosario

| Término | Significado |
|---|---|
| A3 | resolución de problemas en una sola hoja de papel A3 (en EE. UU. normalmente 11 × 17 in.): problema, situación actual, causa raíz, objetivo, contramedidas, seguimiento |
| Andon | señal (cordón, botón, luz) que hace visible una desviación de inmediato y pide ayuda |
| Escalado | traslado de un problema al siguiente nivel cuando el equipo no puede resolverlo por sí mismo |
| Gemba | término japonés para "el lugar real"; donde se crea el valor |
| Gembutsu | la "cosa real" en el gemba: máquina, herramienta, material, pieza defectuosa |
| Genchi genbutsu | ir a ver por uno mismo y comprobar los hechos en el lugar |
| Hoshin kanri | método para desplegar los objetivos de la empresa en todos los niveles (también llamado despliegue de política) |
| Auditoría de procesos por capas (confirmación de proceso) | verificación breve de un estándar por líderes de varios niveles con una cadencia fija |
| Trabajo estándar del líder | rutinas diarias fijas y visibles para los líderes |
| Obeya | "gran sala"; sala de reuniones con todos los KPI y proyectos en las paredes |
| OEE | eficacia global del equipo: disponibilidad × rendimiento × calidad |
| SQDCP | estructura del tablero por seguridad, calidad, entrega, coste y personas (también SQCDP) |
| Reunión de nivel | reunión breve y periódica en el tablero para un nivel concreto de la jerarquía |
| TRIR | tasa total de incidentes registrables: casos registrables por OSHA × 200 000 / horas trabajadas |
| Yokoten | transferir una solución probada a otras líneas o plantas |
| DirectQuery / Direct Lake | modos de conexión de Power BI en los que los datos se consultan directamente en lugar de importarse; necesarios para la actualización automática de páginas |
| F64 | tamaño de una capacidad de Microsoft Fabric a partir del cual los visores pueden ver el contenido sin licencia de pago de Power BI |

## FAQ: gestión de planta y paseos gemba

### ¿Qué es la gestión de planta en términos sencillos?

La gestión de planta significa que los líderes dirigen donde se realiza el trabajo. El equipo se reúne brevemente cada día ante un tablero con unos pocos KPI, analiza las desviaciones, acuerda acciones y traslada al siguiente nivel de dirección los problemas que no puede resolver. Los líderes acuden regularmente a la planta para verlo por sí mismos.

### ¿Cuáles son los elementos de la gestión de planta?

Seis elementos: líderes presentes en la planta (gemba), gestión visual, unos pocos KPI que el equipo puede influir, una cadencia fija de reuniones en reuniones de nivel, resolución estructurada de problemas y estandarización. Algunos institutos de investigación alemanes los agrupan de forma algo distinta [2][4], y las páginas de proveedores estadounidenses hablan a menudo de cinco pilares, pero el contenido es el mismo.

### ¿Qué significa gemba?

Gemba (también genba) es un término japonés que significa "el lugar real". En lean significa el lugar donde se crea el valor, normalmente la planta [7][8]. Genchi genbutsu, "ir a ver por uno mismo", es la acción relacionada: gemba es un lugar, genchi genbutsu es lo que se hace allí [8].

### ¿Qué es un paseo gemba?

Un paseo gemba es una visita planificada de un líder al lugar donde se crea el valor. El líder observa el trabajo, lo compara con el estándar y hace preguntas abiertas para entender la situación antes de actuar [7]. Un buen paseo tiene un tema, comienza en el tablero y termina con una retroalimentación al equipo.

### ¿Cuáles son los tres principios de un paseo gemba?

La versión más citada procede del antiguo presidente de Toyota, Fujio Cho: "Ir a ver, preguntar por qué, mostrar respeto" [15]. LEI añade tres aspectos que observar durante el paseo: propósito (qué problema resuelve el proceso para el cliente), proceso (cómo funciona realmente) y personas (si participan en su mejora) [7].

### ¿Cuál es la diferencia entre la gestión de planta y un paseo gemba?

La gestión de planta es el sistema de liderazgo completo: tablero, KPI, reuniones de nivel, resolución de problemas y estándares. El paseo gemba es una rutina dentro de ese sistema: el líder va al lugar donde se realiza el trabajo, observa y hace preguntas para entender la situación antes de actuar [7].

### ¿Cuánto debe durar una reunión en planta?

Unos 10 a 15 minutos a nivel de equipo y 20 a 30 minutos a nivel directivo. Gelbrich indica de 10 a 12 minutos en el nivel operativo y de 20 a 30 minutos en el nivel directivo; durante la implantación, las reuniones suelen durar más [3].

### ¿Qué es una reunión de nivel 1, 2 y 3?

Una reunión de nivel es una reunión breve y estandarizada ante el tablero en un nivel de la organización. El nivel 1 es el equipo de primera línea, el nivel 2 los supervisores de un área, el nivel 3 los responsables de departamento y el nivel 4 la dirección de la planta [58]. Las reuniones se escalonan para que los problemas puedan subir de nivel el mismo día.

### ¿Qué es un tablero de planta?

Un tablero de planta (también llamado huddle board o tablero SQDCP) es la pizarra blanca o pantalla donde el equipo se reúne para la reunión de nivel. Muestra unos pocos KPI con objetivo y tendencia, acciones abiertas con responsables y fechas límite, y escalamientos al siguiente nivel. Un diseño típico tiene columnas por SQDCP y filas para estado, tendencia y acciones.

### ¿Qué significa SQDCP?

SQDCP significa seguridad, calidad, entrega (delivery), coste y personas (también escrito SQCDP). El orden es el mensaje: la seguridad se trata primero en cada reunión. Las variantes son SQDC, SQDCM (moral) o SQDCE (medio ambiente).

### ¿Qué KPI deben figurar en un tablero de planta?

Entre cuatro y seis KPI que el equipo pueda influir [3], organizados por SQDCP: seguridad (lesiones registrables, casi accidentes), calidad (chatarra, rendimiento al primer intento), entrega (objetivo frente a real, entrega a tiempo), coste o productividad (OEE, unidades por hora) y personas (asistencia, polivalencia, ideas).

### ¿Con qué frecuencia debe hacerse un gemba walk?

No hay un número universal. Lo que importa es un ritmo fijo y fiable anclado en el trabajo estándar de los líderes. En la práctica, supervisores y jefes de turno hacen un recorrido diario centrado en un tema, los jefes de departamento varias veces por semana y el director de planta al menos una vez por semana; los recorridos por flujo de valor se hacen según sea necesario. Los líderes de equipo están en el gemba todo el día y, en su lugar, usan la confirmación diaria de proceso. Más importante que la frecuencia es que cada recorrido tenga un tema y un seguimiento.

### ¿Quién debe hacer un gemba walk?

Líderes de todos los niveles, cada uno con un enfoque distinto: supervisores y jefes de departamento se centran sobre todo en recorridos del sistema de gestión (¿funcionan los tableros, los estándares y los escalamientos?), la dirección de planta realiza recorridos por flujo de valor entre funciones y los especialistas hacen recorridos centrados en problemas [14]. Los líderes de equipo trabajan en el gemba de todos modos y usan la confirmación de proceso. Incluya a las personas que intervienen en el proceso, como recomienda LEI [7].

### ¿Cuánto debe durar un gemba walk?

Las fuentes revisadas no indican una duración fija. Un recorrido concentrado en un área suele durar entre 20 y 45 minutos; un recorrido por flujo de valor de una familia de productos puede durar medio día. Observar varios ciclos en un mismo puesto de trabajo es más importante que recorrer mucha distancia.

### ¿Qué preguntas conviene hacer en un gemba walk?

Funcionan mejor las preguntas abiertas, como "¿Cómo se desarrolla normalmente este paso?", "¿Cómo se da cuenta de que algo va mal?", "¿Cuál fue el último problema que resolvió aquí?" y "¿Qué puedo hacer para apoyarle?". El banco completo de preguntas está en la sección sobre el gemba walk.

### ¿Es un gemba walk lo mismo que management by walking around?

No. MBWA procede de Hewlett-Packard y se dio a conocer a través de "In Search of Excellence" (1982) [16]; trata principalmente de cercanía e intercambio informal. El gemba walk es más estructurado, se refiere a estándares y KPI y sirve para comprender el proceso y desarrollar la capacidad de resolución de problemas.

### ¿Funciona la gestión de planta en empresas pequeñas?

Sí. ifaa probó su modelo de implantación en varias empresas pequeñas y medianas y comprobó que puede introducirse con medios sencillos [2]. En empresas pequeñas suelen bastar dos niveles: una reunión de equipo y una reunión de liderazgo.

### ¿Necesito software para la gestión de planta?

No para empezar. Una pizarra blanca, imanes y rotuladores bastan para construir las rutinas. El software compensa cuando hay que vincular varios niveles, turnos o centros, cuando la captura manual de datos supone demasiado esfuerzo o cuando las acciones se pierden entre niveles [24].

### ¿Puedo crear un tablero digital de planta con Microsoft Teams y Power BI?

Sí. Los informes de Power BI pueden incrustarse como pestañas en canales de Teams [28], Power Apps se encarga de la captura de datos en el puesto de trabajo [30], Microsoft Lists gestiona la lista de acciones [38] y Microsoft Fabric Real-Time Intelligence envía alertas en tiempo real [32][33]. Tenga en cuenta los requisitos de licencia para los visores (visores gratuitos solo a partir de Fabric F64 o capacidad Premium), los intervalos mínimos de actualización automática de páginas en Power BI (30 minutos en capacidad compartida) y la retirada de Dataverse para Teams [28][29][45].

### ¿Cuánto tiempo lleva implantar la gestión de planta?

Para un área piloto, el modelo de ifaa prevé una fase de prueba de unos tres meses tras los talleres de fijación de objetivos, información e introducción [2]. Extenderlo a toda una planta con una cascada de funcionamiento fiable en todos los niveles lleva bastante más tiempo, según el tamaño, porque cada nivel debería funcionar de forma fiable antes de construir el siguiente.

## Conclusión

La gestión en piso de planta no es un tablero ni un software, sino un sistema de liderazgo con mecánicas claras: los líderes acuden a donde se crea valor, el equipo hace visibles las desviaciones con unos pocos KPI que puede influir, las reuniones de nivel cortas y programadas llevan los problemas el mismo día hasta donde pueden resolverse, y cada solución solo se convierte en el nuevo estándar después de demostrar su efecto. El recorrido gemba es la rutina mediante la cual los líderes entienden en lugar de suponer.

La experiencia documentada muestra dos cosas. En primer lugar, la gestión en piso de planta está muy extendida, pero suele fallar en los mismos patrones: falta de vínculos entre niveles, tableros sobrecargados, reuniones que se alargan demasiado y falta de participación de la dirección [3]. En segundo lugar, la situación actual es mayoritariamente analógica, con traspasos rotos entre herramientas que dificultan la escalación y el seguimiento de acciones [24]. La digitalización puede ayudar, pero solo cuando las rutinas ya están asentadas.

Para las empresas que utilizan Microsoft 365, un tablero digital con Teams, Power BI, Power Apps, Listas y Fabric es una opción evidente. Planifique desde el principio el modelo de datos, las licencias, los intervalos de actualización y las normas de datos de los empleados. Y comience por donde debería comenzar todo despliegue: con un equipo piloto, un tablero sencillo, un límite de tiempo de 15 minutos y un líder que escuche.

## Lectura adicional en m365.fm

**Entradas de blog**
- [¿Qué es un recorrido gemba?](https://www.m365.fm/community/u/mirko-p/blog/what-is-a-gemba-walk/)
- [Lista de verificación y preguntas para el recorrido gemba](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-checklist-questions/)
- [Recorrido gemba frente a gestión caminando por la planta](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-vs-management-by-walking-around/)
- [Preparación del recorrido gemba: equipo y funciones](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-preparation-team/)
- [Errores en el recorrido gemba: cuando el recorrido se convierte en inspección](https://www.m365.fm/community/u/mirko-p/blog/gemba-walk-mistakes-inspection/)
- [Cultura de excelencia operacional en el piso de planta](https://www.m365.fm/community/u/mirko-p/blog/operational-excellence-culture-shop-floor/)
- [Optimización del piso de planta: formas de mejorar el flujo](https://www.m365.fm/community/u/mirko-p/blog/shop-floor-optimization-improve-flow-ways/)

**Términos**
[Gestión en piso de planta](https://www.m365.fm/entity/shop-floor-management/) · [Recorrido gemba](https://www.m365.fm/entity/gemba-walk/) · [Reunión de nivel](https://www.m365.fm/entity/tier-meeting/) · [Gestión visual](https://www.m365.fm/entity/visual-management/) · [Resolución de problemas A3](https://www.m365.fm/entity/a3-problem-solving/) · [Trabajo estandarizado](https://www.m365.fm/entity/standard-work/) · [5S](https://www.m365.fm/entity/5s/) · [Indicador clave de rendimiento](https://www.m365.fm/entity/key-performance-indicator/) · [Microparadas](https://www.m365.fm/entity/micro-stops/) · [Tasa de desperdicio](https://www.m365.fm/entity/scrap-rate/) · [Gestión lean](https://www.m365.fm/entity/lean-management/) · [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) · [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/)

**Guías relacionadas**
- [Manufactura esbelta](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Excelencia operacional](https://www.m365.fm/en/learn/operational-excellence/)
- [KPI de manufactura](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Mapeo de la cadena de valor](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Gemelo digital en manufactura](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [TI de manufactura con Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** es el anfitrión de m365.fm y trabaja en [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) en Stuttgart, Alemania. En m365.fm escribe sobre gestión lean, excelencia operativa y digitalización de la manufactura con Microsoft 365 y Azure. Su enfoque es cómo las rutinas lean probadas, como la gestión de piso de fábrica y el gemba walk, pueden funcionar junto con plataformas de datos modernas sin perder su esencia.

**Nota: El autor trabaja en iFAKT GmbH.**

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
