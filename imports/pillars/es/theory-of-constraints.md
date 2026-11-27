# SEO metadata

| Field | Value |
|---|---|
| Meta title | Teoría de restricciones en producción: 5 pasos y cuellos de botella |
| Meta description | Teoría de restricciones en producción: cinco pasos de enfoque, análisis de cuellos de botella, tambor-amortiguador-cuerda con cifras y plantillas. |
| Slug | `theory-of-constraints` |

# Teoría de restricciones: los cinco pasos de enfoque, cuellos de botella y tambor-amortiguador-cuerda

> **Respuesta corta:** La teoría de las restricciones (TOC, por sus siglas en inglés) es un enfoque de gestión desarrollado por Eliyahu M. Goldratt e introducido en la novela de negocios *The Goal* (1984). Afirma que la producción de cualquier sistema está limitada por muy pocas restricciones, a menudo por un único cuello de botella, por lo que el esfuerzo de mejora debe dirigirse allí primero. La TOC lo lleva a la práctica con cinco pasos de enfoque (identificar, explotar, subordinar, elevar y prevenir la inercia), el método de programación drum-buffer-rope y la contabilidad de throughput [1][4][6].

> **Puntos clave**
> - *The Goal*, de Eliyahu M. Goldratt y Jeff Cox, se publicó por primera vez en 1984 por North River Press; hasta 2011 había vendido más de 5 millones de ejemplares en 35 idiomas [1][2].
> - Los cinco pasos de enfoque son: identificar la restricción, explotarla, subordinar todo lo demás a ella, elevarla y evitar que la inercia se convierta en la restricción [4].
> - Una hora perdida en la restricción es una hora perdida para toda la planta. Una hora ahorrada en una no restricción no cambia nada, a menos que alivie la restricción.
> - Drum-buffer-rope (DBR) programa la restricción (drum), la protege con un buffer de tiempo (buffer) y libera material solo al ritmo que la restricción puede absorber (rope) [6][8].
> - La contabilidad de throughput juzga las decisiones por el throughput (ventas menos el coste variable real), por el inventario/inversión y por el gasto operativo, y ordena los productos por throughput por minuto de restricción, lo que puede invertir el orden que da la contabilidad de costes estándar [6][19][20].
> - La detección de cuellos de botella debe basarse en datos: una comprobación de carga de capacidad, la observación de colas y, cuando existan datos de estado de las máquinas, el método del periodo activo, que además muestra los cuellos de botella desplazados [13][14][15].
> - Una revisión de 2003 de más de 80 aplicaciones publicadas de TOC encontró grandes ganancias operativas y financieras y ningún fracaso notificado, lo que también dice algo sobre qué casos llegan a publicarse [10].
> - TOC, lean y Six Sigma funcionan mejor juntos: la TOC indica dónde enfocarse, lean elimina el desperdicio y crea flujo, y Six Sigma reduce la variación en el punto que importa.

## Índice

1. [¿Qué es la teoría de las restricciones? Definición e idea central](#qué-es-la-teoría-de-las-restricciones-definición-e-idea-central)
2. [Historia: Eliyahu Goldratt, OPT y The Goal](#historia-eliyahu-goldratt-opt-y-the-goal)
3. [Restricción vs. cuello de botella: tipos de restricciones](#restricción-frente-a-cuello-de-botella-tipos-de-restricciones)
4. [Los cinco pasos de enfoque](#los-cinco-pasos-de-enfoque)
5. [Ejemplo de teoría de las restricciones: los cinco pasos de enfoque en una planta de colectores](#ejemplo-de-la-teoría-de-restricciones-los-cinco-pasos-de-enfoque-en-una-planta-de-colectores)
6. [Análisis de cuellos de botella: cómo identificar el cuello de botella (seis métodos)](#análisis-de-cuellos-de-botella-cómo-identificar-el-cuello-de-botella-seis-métodos)
7. [Programación drum-buffer-rope con cifras](#programación-drum-buffer-rope-con-números)
8. [Drum-buffer-rope simplificado (S-DBR) para fabricación bajo pedido](#drum-buffer-rope-simplificado-s-dbr-para-fabricación-bajo-pedido)
9. [Gestión de buffers: el bucle de retroalimentación](#gestión-de-buffers-el-ciclo-de-retroalimentación)
10. [La física de la fábrica detrás de la TOC: la ley de Little y la variabilidad](#física-de-fábrica-detrás-de-toc-ley-de-little-y-variabilidad)
11. [Contabilidad de throughput vs. contabilidad de costes](#contabilidad-de-rendimiento-frente-a-contabilidad-de-costes)
12. [Los procesos de pensamiento](#los-procesos-de-pensamiento)
13. [TOC vs. lean vs. Six Sigma](#toc-vs-lean-vs-six-sigma)
14. [Más allá de la planta: cadena crítica y reposición](#más-allá-de-la-planta-cadena-crítica-y-reposición)
15. [Plantillas para el trabajo con TOC](#plantillas-para-el-trabajo-con-toc)
16. [Hoja de ruta de implantación: los primeros seis meses](#hoja-de-ruta-de-implementación-los-primeros-seis-meses)
17. [KPI de TOC: cómo medir el progreso](#kpi-del-toc-cómo-medir-el-progreso)
18. [Errores habituales](#errores-comunes)
19. [Críticas y límites de la teoría de las restricciones](#críticas-y-límites-de-la-teoría-de-restricciones)
20. [Personas y seguridad en la restricción](#personas-y-seguridad-en-la-restricción)
21. [TOC en la planta digital: datos, simulación y APS](#toc-en-la-planta-digital-datos-simulación-y-aps)
22. [Glosario](#glosario)
23. [Preguntas frecuentes sobre la teoría de las restricciones](#faq-preguntas-sobre-la-teoría-de-restricciones)
24. [Conclusión y primeros pasos](#conclusión-y-primeros-pasos)

**¿Qué sección se ajusta a su función?**

| Usted es... | Empiece por |
|---|---|
| Gerente de planta o director de operaciones | Secciones 4, 5, 16 y 18 |
| Planificador o programador de producción | Secciones 6 a 10 |
| Contralor de planta o director financiero | Secciones 11 y 17 |
| Responsable de CI, lean o Six Sigma | Secciones 12, 13 y 15 |
| Estudiante o nuevo en TOC | Secciones 1 a 5, y luego el glosario |

## ¿Qué es la teoría de las restricciones? Definición e idea central

La teoría de las restricciones es una forma de gestionar una organización como una cadena de pasos dependientes entre sí. Su punto de partida es sencillo: todo sistema que persigue una meta tiene al menos un factor que limita cuánto de esa meta puede alcanzar. El TOC Institute utiliza la analogía de la cadena: una cadena es tan fuerte como su eslabón más débil, y reforzar cualquier otro eslabón no la hace más fuerte [4]. Los libros posteriores de Goldratt y la comunidad TOC extendieron la idea desde el piso de planta a la distribución, los proyectos, las finanzas y la estrategia [6].

En una planta manufacturera, la meta suele expresarse como ganar dinero ahora y en el futuro. El factor limitante puede ser una máquina, una habilidad, un proveedor, una política o el propio mercado. La TOC lo llama la restricción. La afirmación central es que la mayoría de los sistemas tienen solo una o muy pocas restricciones en cada momento. El TOC Institute afirma que la mayoría de los sistemas tienen un recurso restringido en capacidad y rara vez más de dos o tres [4].

### La idea central en un párrafo

Si la producción de una planta está limitada por un solo recurso, entonces la producción de la planta equivale a la producción de ese recurso. Cada minuto que pierde ese recurso es un minuto de producción que la planta pierde para siempre. Cada minuto ahorrado en otra parte es, en el mejor de los casos, capacidad ociosa, y en el peor crea más inventario que espera frente a la restricción. Por eso la TOC sostiene que las eficiencias locales en los no restrictivos no se suman al desempeño de la planta. Intentar optimizar cada paso por separado es esfuerzo desperdiciado; la TOC mejora el sistema completo a través de su restricción.

### Teoría de las restricciones en manufactura: por qué importa en la práctica

Tres situaciones cotidianas de planta ilustran la idea:

| Situación | Reacción típica sin TOC | Reacción con TOC |
|---|---|---|
| Los pedidos llegan tarde y el WIP está en todas partes | acelerar, agregar horas extra en todas partes, iniciar los pedidos antes | identificar el único recurso que limita la producción y liberar el trabajo al ritmo de ese recurso |
| Una máquina no restrictiva está inactiva | buscarle trabajo para mantener alta la "eficiencia" | dejarla esperar; el tiempo inactivo en un no restrictivo es normal y barato |
| Se propone una máquina nueva | aprobarla porque el departamento está saturado | preguntar si agrega capacidad en la restricción y qué efecto tiene sobre el throughput |

### Beneficios de la teoría de las restricciones

Los beneficios más citados son tiempos de entrega más cortos, mejor cumplimiento de fechas de entrega, menor inventario y mayor throughput. Una revisión de aplicaciones publicadas de Mabin y Balderstone, resumida por Panizzolo, reportó mejoras promedio de 70 por ciento en el tiempo de ciclo pedido-entrega, 65 por ciento en el tiempo de ciclo de fabricación, 49 por ciento en inventario, 63 por ciento en throughput o ingresos y 44 por ciento en cumplimiento de fechas de entrega [11]. Panizzolo atribuye estos promedios a la revisión de Mabin y Balderstone *The World of the Theory of Constraints* (2000), de extensión de libro; el artículo de revista de 2003 de los mismos autores analiza el mismo cuerpo de más de 80 casos [10][11]. Considere esas cifras como el extremo superior de lo posible: provienen de casos de éxito publicados, y la revisión original no encontró ningún informe de fracaso [10]. La sección 19 analiza lo que eso significa.

Más allá de las cifras, la TOC da a una planta una respuesta compartida a la pregunta "¿por dónde debemos empezar?". Ese suele ser el cambio más grande: menos proyectos de mejora de procesos, dirigidos al lugar donde cambian el resultado.

## Historia: Eliyahu Goldratt, OPT y The Goal

Eliyahu M. Goldratt nació el 31 de marzo de 1947 y falleció el 11 de junio de 2011 en su casa de Israel. Obtuvo una licenciatura (BSc) en la Universidad de Tel Aviv y una maestría (MSc) y un doctorado (PhD) en la Universidad Bar-Ilan [2][3]. Antes de que la TOC tuviera nombre, trabajó con Creative Output, empresa que comercializaba Optimized Production Technology (OPT), un software de programación de la producción [3].

| Año | Hito | Fuente |
|---|---|---|
| antes de 1984 | Software de programación OPT vendido por Creative Output, la raíz técnica del drum-buffer-rope (año exacto de lanzamiento [unverified: no se ha confirmado la fecha exacta]) | [3] |
| 1984 | *The Goal: Excellence in Manufacturing*, de Goldratt y Jeff Cox, North River Press, 262 páginas | [1] |
| hacia 1985 | Fundación del Avraham Y. Goldratt Institute tras la salida de Goldratt de Creative Output | [3] |
| 1986 | *The Race* (con Robert E. Fox) describe en detalle el drum-buffer-rope; primera edición revisada de *The Goal* | [3][7][8] |
| 1990 a 1991 | *The Haystack Syndrome*: el throughput, el inventario y el gasto operativo como medidas para la toma de decisiones | [3][20] |
| 1992 | segunda edición revisada de *The Goal* | [3][7] |
| 1994 | *It's Not Luck*: procesos de pensamiento para marketing y estrategia | [3][12] |
| 1997 | *Critical Chain*: la TOC aplicada a la gestión de proyectos | [3] |
| 2000 | *Necessary But Not Sufficient*: la TOC y el software empresarial | [3] |
| 2004 | tercera edición revisada de *The Goal* | [7] |
| 2009 | *Isn't It Obvious?* (comercio minorista y distribución) | [3] |
| 2010 | *Theory of Constraints Handbook* (Cox y Schleier, eds.), la referencia estándar sobre DBR, S-DBR y gestión de búferes | [9] |
| 2011 | Muere Goldratt; *The Goal* aparece en la lista de Time entre los 25 libros de gestión empresarial más influyentes (lista de Time según cita Wikipedia) | [2][7] |
| 2014 | cuarta edición revisada (edición del 30.º aniversario) de *The Goal* (lista de ediciones tomada de un infobox sin citar) | [7] |

### The Goal: una novela como libro de texto

*The Goal* narra la historia de Alex Rogo, director de planta cuya fábrica tiene tres meses para dar la vuelta a la situación. Su antiguo profesor de física, Jonah, lo guía mediante preguntas en lugar de respuestas [7]. La escena más citada es una excursión de los scouts: la tropa solo puede avanzar tan rápido como el chico más lento, Herbie, y los huecos de la fila crecen a medida que los caminantes rápidos marcan el ritmo. La solución de Rogo consiste en poner a Herbie al frente, aligerarle la mochila y atar al grupo entre sí. Eso son los cinco pasos de enfoque y el drum-buffer-rope en una sola tarde: identificar a Herbie, explotarlo (mochila más ligera), subordinar la tropa a su ritmo y mantener corta la fila.

El formato novelado hizo accesibles las ideas a supervisores y operarios, no solo a ingenieros. North River Press informó en 2011 de que el libro había vendido más de 5 millones de ejemplares en 35 idiomas [2].

### De OPT a una filosofía de gestión

La TOC creció por etapas. La primera fue la programación (OPT, después DBR). La segunda fue la medición (contabilidad de throughput). La tercera fue un método general de resolución de problemas (los procesos de pensamiento). La cuarta aplicó la lógica a los proyectos (cadena crítica) y a la distribución (reposición) [6][12]. Hoy, la Theory of Constraints International Certification Organization (TOCICO), una organización sin ánimo de lucro de EE. UU. 501(c)(3), certifica a los profesionales en tres niveles: exámenes de fundamentos, exámenes de práctica y una evaluación de implantador [5].

## Restricción frente a cuello de botella: tipos de restricciones

Las palabras "restricción" y "cuello de botella" se usan a menudo como sinónimos. No son exactamente lo mismo.

- Un **cuello de botella** es un recurso cuya capacidad es menor que la demanda que recibe. Es un término de capacidad.
- Una **restricción** es cualquier cosa que limite el rendimiento del sistema frente a su objetivo. Puede ser un cuello de botella, pero también puede ser el mercado, un material, una política o una forma de pensar.
- Un **recurso con restricción de capacidad (CCR, por sus siglas en inglés)** es un recurso que, en promedio, no es un cuello de botella, pero que se convierte en uno si no se gestiona con cuidado, por ejemplo por picos en la combinación de productos.

Todo cuello de botella limita el rendimiento solo si se encuentra en la ruta de los pedidos que importan. Una planta puede tener una máquina "cuello de botella" sobrecargada con trabajo de baja prioridad mientras la restricción real es el mercado. Por eso la TOC pregunta primero: ¿qué limita el objetivo?

### Tipos de restricciones

| Tipo | Ejemplo | Cómo se detecta | Primera medida típica |
|---|---|---|---|
| Física: equipos | un centro de mecanizado de 5 ejes, un horno de tratamiento térmico, una línea de pintura | cola permanente delante, recursos ociosos detrás | explotar: ningún minuto perdido |
| Física: personas y habilidades | solo dos soldadores certificados por turno | el trabajo espera a personas concretas | polivalencia, programar según habilidades |
| Material | una fundición con plazo de entrega de 16 semanas | el montaje espera una pieza | colchón de reposición, segundo proveedor |
| Mercado | demanda inferior a la capacidad de la planta | capacidad libre en todas partes, ventas por debajo del plan | la restricción está fuera; mejorar la oferta y el plazo de entrega |
| Política | "producir solo lotes completos", "mantener cada máquina por encima del 85 % de eficiencia" | reglas que fuerzan comportamientos erróneos | procesos de pensamiento, cambiar la regla |
| Paradigma | "el inventario es un activo", "una planta ocupada es una buena planta" | resistencia a tener recursos no restrictivos inactivos | formación, juegos de simulación |

En la práctica, las restricciones de política merecen especial atención: una restricción física suele verse frenada por una regla (lotes mínimos, reglas de liberación, objetivos de utilización) más que por su capacidad real. El ejemplo práctico de la sección 5 muestra dos de estas reglas.

### Cuellos de botella estáticos, dinámicos y móviles

Un cuello de botella **estático** permanece en el mismo recurso durante meses. Un cuello de botella **dinámico** o **móvil** se desplaza entre recursos según la combinación de productos, las averías o la dotación de personal. La diferencia importa para elegir el método: un cuello de botella estático puede gestionarse con una configuración DBR fija, mientras que un cuello de botella móvil necesita datos y, a menudo, un APS que calcule la carga por recurso para la cartera de pedidos actual [13][14]. La sección 6 muestra cómo distinguirlos.

### VATI: el tipo de planta determina la restricción

La TOC clasifica las plantas según la forma de su flujo de material, conocido como análisis VATI [6][9]:

| Tipo | Forma del flujo | Ejemplo | Problema típico |
|---|---|---|---|
| V | pocas materias primas se dividen en muchos productos | acero, papel, químicos, extrusión | asignación errónea: material comprometido demasiado pronto con el producto equivocado |
| A | muchas piezas convergen en pocos productos | montaje aeronáutico, construcción de maquinaria | las piezas llegan sin sincronización, el montaje espera a la última pieza |
| T | pocos componentes, ensamblados tarde en muchas variantes | electrónica, electrodomésticos | piezas que se desvían entre variantes, desajuste de productos terminados |
| I | línea recta | líneas de mecanizado sencillas | comportamiento clásico de cuello de botella |

La mayoría de las plantas reales son combinaciones. El tipo de planta indica dónde deben colocarse los colchones: antes del montaje en una planta A, antes de la división en una planta V.

## Los cinco pasos de enfoque

Los cinco pasos de enfoque son el procedimiento central de la TOC. El TOC Institute los formula así: identificar la restricción del sistema, explotar la restricción, subordinar todo lo demás a la restricción, elevar la restricción y evitar que la inercia se convierta en la restricción [4]. Goldratt denominó al ciclo proceso de mejora continua (POOGI, por sus siglas en inglés), que también es el subtítulo de las ediciones posteriores de *La meta* [6]. Como el paso 5 conduce de nuevo al paso 1, los cinco pasos forman un ciclo de mejora continua: una vez superada una restricción del sistema, aparece una nueva restricción en otro lugar y el trabajo vuelve a empezar.

Antes del paso 1 hay que responder a dos preguntas: cuál es el objetivo del sistema y cómo medimos el avance hacia él. En una empresa, la TOC utiliza como medidas el throughput, el inventario (o la inversión) y el gasto operativo (sección 11).

| Paso | Pregunta | Qué significa en una planta | Qué no significa |
|---|---|---|---|
| 1. Identificar | ¿Qué limita el throughput en este momento? | encontrar el recurso, material, mercado o política que marca el ritmo | elegir la máquina con más averías o con el precio más alto |
| 2. Explotar | ¿Cómo sacamos el máximo partido con lo que tenemos? | ningún minuto perdido, ningún trabajo defectuoso, la mezcla de productos adecuada | comprar capacidad |
| 3. Subordinar | ¿Cómo apoya todo lo demás al paso 2? | la liberación, los tamaños de lote, el mantenimiento, la calidad y la dotación de personal siguen a la restricción | mantener ocupado cada recurso |
| 4. Elevar | Si aún no es suficiente, ¿cómo añadimos capacidad? | horas extra, subcontratación, una segunda máquina, un nuevo proveedor | el primer reflejo |
| 5. Evitar la inercia | ¿Se ha desplazado la restricción? ¿Son ahora un obstáculo las reglas antiguas? | volver al paso 1, revisar las reglas hechas para la antigua restricción | declarar la victoria |

### Paso 1: Identificar la restricción

La restricción es el recurso cuya capacidad es más baja en relación con la demanda que se le asigna. En la práctica, se empieza con un cálculo de carga (demanda por tiempo de proceso frente al tiempo disponible) y después se confirma en planta: dónde se acumula el trabajo en cola, dónde esperan las personas a un recurso, qué recurso es por el que los supervisores preguntan constantemente. El TOC Institute añade que una restricción identificada erróneamente es fácil de corregir sin daños duraderos, lo que es una buena razón para no esperar a tener datos perfectos [4]. La sección 6 describe seis métodos de detección.

### Paso 2: Explotar la restricción

Explotar significa hacer que la restricción sea lo más productiva posible sin gastar cantidades importantes de dinero. El TOC Institute afirma que una restricción suele utilizarse menos del 50 por ciento del tiempo en régimen 24/7 y que los tres primeros pasos suelen revelar al menos un 30 por ciento de capacidad oculta en pocos meses; ambas afirmaciones carecen de un conjunto de datos publicado, así que verifíquelas en su propia planta [4]. Medidas típicas de explotación:

- cubrir las pausas, los cambios de turno y las reuniones para que la restricción siga funcionando;
- trasladar la preparación de los cambios fuera del tiempo de funcionamiento de la restricción (preparación externa; véase la guía [Reducción de SMED y cambios de formato](https://www.m365.fm/en/learn/smed-changeover-reduction/));
- inspeccionar antes de la restricción para que nunca procese una pieza que ya es chatarra (en entornos AS9100 o IATF 16949, mover un punto de inspección exige actualizar el plan de control y el PFMEA);
- comprobar la calidad justo después de la restricción, porque una pieza desechada más tarde cuesta tiempo de restricción;
- mantener un colchón de trabajo delante de ella para que nunca se quede sin material;
- darle prioridad en mantenimiento, programación, utillaje y manipulación de materiales;
- elegir la mezcla de productos según el throughput por minuto de restricción (sección 11);
- descargar en otros recursos el trabajo que ellos puedan hacer, aunque sea con menor eficiencia.

### Paso 3: Subordinar todo lo demás

La subordinación es el paso más difícil porque va en contra de las métricas de eficiencia local. Los no restricciones deben tener capacidad ociosa, y deben usarla para proteger la restricción, no para acumular inventario. Ejemplos:

- **Liberación:** el material entra en la planta al ritmo de la restricción (la cuerda en DBR).
- **Tamaños de lote:** los no restricciones pueden trabajar con lotes pequeños y más cambios porque tienen capacidad ociosa; la restricción puede necesitar lotes mayores para ahorrar tiempo de preparación.
- **Mantenimiento:** una avería en la restricción recibe al siguiente técnico disponible; el mantenimiento preventivo de la restricción se programa en paradas planificadas.
- **Calidad:** la aprobación de la primera pieza en la restricción tiene prioridad sobre otras verificaciones de primera pieza.
- **Medición:** dejar de recompensar a los departamentos no restricción por la utilización o por las "horas ganadas".

El TOC Institute señala que las restricciones que cambian con frecuencia desorganizan las políticas, los procedimientos y las personas [4]. La subordinación debe incluir, por tanto, proteger la posición de la restricción, por ejemplo manteniendo los demás recursos muy por encima de la capacidad de la restricción.

### Paso 4: Elevar la restricción

Solo después de haber realizado los pasos 2 y 3 debe invertirse dinero en capacidad. Las opciones de elevación incluyen horas extra o un turno adicional solo en la restricción, subcontratar parte de su trabajo, añadir personal, comprar equipos o rediseñar el producto para que necesite menos tiempo de restricción. Muchas plantas pasan directamente a este paso y compran una máquina mientras la restricción existente sigue perdiendo una cuarta parte de su tiempo en pausas, cambios de formato y falta de material.

### Paso 5: Evitar que la inercia se convierta en la restricción

Cuando la explotación y la elevación funcionan, la restricción suele desplazarse y aparece una nueva: en otra máquina, en un proveedor o en el mercado. Las reglas que eran correctas para la restricción anterior ahora causan daño. La inercia típica: el tamaño de lote grande del antiguo cuello de botella permanece en la ruta de fabricación, una regla de liberación vinculada al antiguo tambor permanece en el ERP o el equipo de ventas sigue racionando pedidos aunque la planta ahora tenga capacidad disponible. Vuelva al paso 1 y revise las reglas.

## Ejemplo de la teoría de restricciones: los cinco pasos de enfoque en una planta de colectores

El siguiente ejemplo ha sido construido para esta guía. Las cifras son verosímiles para un pequeño taller de mecanizado estadounidense, pero no son datos de una empresa real.

### La planta

Una planta de 60 personas en el Medio Oeste fabrica bloques colectores hidráulicos en dos familias de productos:

- **Producto A** (colector estándar): precio 900 $, materia prima y piezas compradas 400 $.
- **Producto B** (colector a medida): precio 1.200 $, materia prima y piezas compradas 450 $.

La planta trabaja dos turnos de 8 horas, cinco días a la semana: 80 horas o 4.800 minutos de tiempo disponible por recurso y semana. La demanda semanal es de 100 unidades de A y 60 de B. El gasto operativo (toda la mano de obra, salarios, alquiler, energía, amortización; todo excepto el material realmente variable) es de 62.000 $ por semana.

### Paso 1: Identificar la restricción con una tabla de carga

Tiempos de proceso en minutos por unidad, tomados de las rutas de fabricación y verificados mediante cronometraje en planta:

| Recurso | A (min/unidad) | B (min/unidad) | Carga A (100 unidades) | Carga B (60 unidades) | Carga total (min) | Carga vs. 4.800 min |
|---|---|---|---|---|---|---|
| Sierra | 8 | 10 | 800 | 600 | 1.400 | 29 % |
| Célula CNC de 5 ejes | 25 | 40 | 2.500 | 2.400 | 4.900 | **102 %** |
| Desbarbado y lavado | 12 | 12 | 1.200 | 720 | 1.920 | 40 % |
| Montaje | 15 | 20 | 1.500 | 1.200 | 2.700 | 56 % |
| Prueba de presión | 10 | 15 | 1.000 | 900 | 1.900 | 40 % |

**Cálculo para la célula CNC:** 100 × 25 + 60 × 40 = 2.500 + 2.400 = 4.900 minutos frente a 4.800 disponibles, una carga de 4.900 ÷ 4.800 = 102 por ciento. Incluso sobre el papel, la célula CNC no puede cubrir la demanda.

La tabla de carga solo utiliza el tiempo teórico. La situación real es peor. Un estudio de tiempos de dos semanas en la célula CNC (registro de turnos más datos de estado de las máquinas) mostró en qué se invertían los 4.800 minutos:

| Uso del tiempo CNC por semana | Minutos | Proporción |
|---|---|---|
| Mecanizado productivo de piezas buenas | 3.600 | 75,0 % |
| Pausas y relevo de turno no cubiertos (2 turnos × 30 min × 5 días) | 300 | 6,3 % |
| Cambios de formato (15 por semana × 30 min) | 450 | 9,4 % |
| Sin material: esperando material, programas o utillajes | 250 | 5,2 % |
| Paradas no planificadas | 100 | 2,1 % |
| Piezas mecanizadas que luego se desechan en la prueba de presión | 100 | 2,1 % |
| **Total** | **4.800** | **100 %** |

Así, la capacidad efectiva de la restricción es de 3.600 minutos semanales, frente a una demanda de 4.900. La planta puede atender alrededor del 73 por ciento de la demanda (3.600 ÷ 4.900).

El taller confirmó las cifras: de media, 2,5 días de trabajo esperaban delante de la célula CNC, mientras que montaje y la prueba de presión esperaban con frecuencia a que llegaran piezas. Los supervisores habían señalado al montaje como cuello de botella porque "siempre va retrasado", pero el montaje iba retrasado porque la célula CNC le dejaba sin material.

### Paso 2a: Explotar mediante la mezcla de productos

Con 3.600 minutos efectivos, la planta no puede fabricarlo todo. ¿Qué productos debe fabricar primero? Aquí la contabilidad por throughput y la contabilidad de costes estándar dan respuestas distintas (la sección 11 explica la lógica en detalle).

| | Producto A | Producto B |
|---|---|---|
| Precio | $900 | $1,200 |
| Costo realmente variable (material) | $400 | $450 |
| Throughput por unidad (T) | $500 | $750 |
| Minutos de CNC por unidad | 25 | 40 |
| **Throughput por minuto de CNC** | **$20.00** | **$18.75** |
| Margen de costo estándar por unidad (ver Sección 11) | $161.20 | $280.52 |

El Producto B parece mejor por unidad, con ambos métodos. Pero por minuto de restricción, el A genera más.

- **Mezcla 1, B primero (lo que sugiere el informe de costos):** 60 B usan 2,400 min; los 1,200 min restantes producen 48 A. Throughput = 60 × $750 + 48 × $500 = $45,000 + $24,000 = **$69,000**. Utilidad neta = $69,000 − $62,000 = **$7,000 por semana**.
- **Mezcla 2, A primero (throughput por minuto de restricción):** 100 A usan 2,500 min; los 1,100 min restantes producen 27 B (27 × 40 = 1,080 min). Throughput = 100 × $500 + 27 × $750 = $50,000 + $20,250 = **$70,250**. Utilidad neta = $70,250 − $62,000 = **$8,250 por semana**.

La mezcla basada en la restricción gana $1,250 más por semana, unos $65,000 al año con 52 semanas, sin ninguna inversión. También cambia la conversación con ventas: los clientes del B necesitan plazos de entrega cotizados más largos o un precio que refleje el uso del B de la restricción.

### Paso 2b: Explotar mediante el tiempo perdido

Después, el equipo atacó las pérdidas del estudio de tiempos:

| Medida | Costo | Minutos recuperados por semana |
|---|---|---|
| Escalonar los descansos; un operador de relevo capacitado mantiene la celda en marcha | $1,500 por semana (parte de un operador de relevo) | 300 |
| Preparación externa del cambio: herramientas, dispositivos y programas preparados antes de que la máquina se detenga; cambio de 30 a 18 min | unos $6,000 únicos para un presetter de herramientas y carros | 180 (15 × 12 min) |
| Material y programas preparados un turno antes (un colchón de tiempo, ver Sección 7) | ninguno | 200 |
| Dimensiones críticas de los barrenos verificadas justo después del mecanizado en lugar de en la prueba de presión | calibres, unos $2,500 únicos | 70 |
| Mantenimiento preventivo trasladado a la ventana planificada del fin de semana | ninguno | 50 |
| **Total** | | **800** |

La capacidad efectiva sube de 3,600 a 4,400 minutos por semana, un aumento del 22 por ciento (800 ÷ 3,600). Con la Mezcla 2, la planta ahora produce 100 A (2,500 min) y 47 B (47 × 40 = 1,880 min, total 4,380 min).

Throughput = 100 × $500 + 47 × $750 = $50,000 + $35,250 = **$85,250 por semana**. El gasto operativo sube por el operador de relevo: $62,000 + $1,500 = $63,500. Utilidad neta = $85,250 − $63,500 = **$21,750 por semana**, frente a $8,250. El gasto único de unos $8,500 se recupera en menos de una semana.

Este es el patrón típico de la TOC: como el gasto operativo es en gran parte fijo a corto plazo, cada minuto adicional de la restricción pasa casi por completo a la utilidad.

### Paso 3: Subordinar el resto de la planta

Para conservar los 800 minutos, el resto de la planta tuvo que cambiar:

- La sierra dejó de cortar "para mantenerse ocupada". Ahora corta solo lo que requiere el programa del CNC, liberado un turno antes (la cuerda).
- La celda de CNC ejecuta una secuencia semanal fija que agrupa los productos por familia de dispositivos; la sierra y el desbarbado siguen esa secuencia.
- El mantenimiento atiende primero los llamados del CNC; el tiempo objetivo de respuesta es de 10 minutos.
- El laboratorio de calidad realiza las verificaciones de primera pieza del CNC antes que cualquier otra solicitud.
- Los supervisores de la sierra y del desbarbado ya no se miden por utilización. Su medida es "el CNC nunca espera por nosotros".

La utilización de la sierra baja de cerca del 45 por ciento (estaba acumulando inventario) a 29 por ciento. Eso es intencional. En términos de la TOC, el tiempo ocioso de la sierra es el precio de proteger la restricción.

### Paso 4: Elevar la restricción

Tras la explotación, todavía quedan 13 unidades de B por semana sin atender (60 − 47). Tres opciones de elevación:

| Opción | Minutos adicionales de restricción | Throughput adicional por semana | Gasto operativo adicional por semana | Efecto neto por semana | Comentario |
|---|---|---|---|---|---|
| Turno de sábado solo en la celda de CNC (8 h, con personal voluntario o según las reglas de horas extra del convenio laboral) | 480 | 12 B × $750 = $9,000 | $1,200 de prima de horas extra y soporte | **+$7,800** | rápida, reversible |
| Subcontratar el desbaste de B con un taller externo, $180 por unidad | 13 B no requieren los 40 min completos | 13 × ($750 − $180) = $7,410 | coordinación, unos $300 | **+$7,110** | el T por unidad baja a $570 porque el costo del taller es realmente variable |
| Comprar una segunda máquina de 5 ejes, $650,000 | 4,800 | 13 B × $750 = $9,750 (la demanda limita la ganancia) | $4,000 (operador, depreciación, servicio) | **+$5,750** | recuperación de la inversión en unas 113 semanas ($650,000 ÷ $5,750), salvo que la demanda crezca |

El turno del sábado gana. La segunda máquina solo tiene sentido si las ventas pueden llenarla, porque una vez instalada, la restricción se traslada al mercado. La comprobación financiera es sencilla: ¿la opción aumenta T menos OE, y en qué medida con respecto a la inversión? La sección 11 muestra las fórmulas.

### Paso 5: Evitar la inercia

Con el turno del sábado, la celda CNC dispone de 4.880 minutos efectivos, suficientes para casi toda la demanda de 4.900 minutos, y la demanda es ahora el límite. Nuevo panorama de carga:

| Recurso | Carga con demanda total | Carga frente a disponible |
|---|---|---|
| Celda CNC (con sábado) | 4.900 | alrededor del 100 % del tiempo efectivo |
| Montaje | 2.700 | 56 % |
| Prueba de presión | 1.900 | 40 % |

La restricción está a punto de trasladarse al mercado. En la revisión aparecieron dos trampas de inercia:

1. El ERP seguía conservando el lote mínimo antiguo de 40 unidades para B, fijado hace años para ahorrar preparaciones en CNC. Con cambios de formato más rápidos, ese lote estaba bloqueando plazos de entrega cortos. El lote se redujo a 10.
2. Ventas seguía ofreciendo seis semanas para B "porque la planta siempre está llena". El plazo ofrecido se redujo a tres semanas, lo que logró dos nuevos clientes de B en un trimestre.

Volviendo al paso 1: si los nuevos clientes de B elevan la demanda, la celda CNC vuelve a ser la restricción y la opción de segunda máquina requiere un nuevo cálculo. Ese ciclo es el proceso de mejora continua.

### Lo que enseña el ejemplo

| Lección | Evidencia en el ejemplo |
|---|---|
| El cuello de botella visible puede no ser la restricción | los supervisores culpaban al montaje, que estaba desabastecido |
| La explotación supera a la inversión | 800 minutos por 8.500 $ únicos más 1.500 $ semanales, frente a 650.000 $ |
| La contabilidad de costes puede ordenar mal los productos | B parecía mejor por unidad, pero A genera más beneficio por minuto de restricción |
| Los no restrictivos deben tener tiempo ocioso | la sierra pasó de una utilización del 45 % al 29 % |
| Las reglas antiguas sobreviven a las restricciones antiguas | el lote de 40 y la cotización de seis semanas |

## Análisis de cuellos de botella: cómo identificar el cuello de botella (seis métodos)

El análisis de cuellos de botella consiste en encontrar el recurso que limita el rendimiento, medir cuánta producción cuesta y comprobar si se desplaza. Es el paso 1 de los cinco pasos de enfoque, y debe repetirse siempre que cambien la mezcla de productos, la demanda o la programación de la producción.

El cuello de botella no siempre es la máquina más cara, la que más averías sufre ni el departamento cuyo supervisor es más ruidoso. Use más de un método y compruebe que coinciden.

### Método 1: Cálculo de carga de capacidad

Para cada recurso, compare el tiempo que requiere la demanda con el tiempo disponible.

**Fórmula:** Carga (%) = Σ (demanda por producto × tiempo de proceso por unidad, incluidas las preparaciones) ÷ tiempo disponible × 100

El recurso con mayor carga es el candidato a cuello de botella. La sección 5 muestra el cálculo; la celda CNC estaba al 102 por ciento con tiempos teóricos. Dos refinamientos hacen fiable el método:

1. **Use el tiempo efectivo, no el nominal.** Divida la carga teórica entre la proporción de tiempo en que el recurso produce piezas buenas (disponibilidad × calidad, o una proporción productiva medida). Un recurso con una carga del 85 por ciento sobre el papel y una proporción productiva del 75 por ciento está en realidad al 113 por ciento (85 ÷ 0,75).
2. **Use la mezcla real de productos del periodo que planifica.** Un recurso puede ser el cuello de botella en una semana con mucho B y no en una semana con mucho A.

Ventaja: solo necesita rutas, demanda y calendario. Desventaja: las rutas suelen ser incorrectas, y el método ignora la variabilidad y los cuellos de botella móviles.

### Método 2: Observación de colas y WIP

El trabajo se acumula delante de un cuello de botella, mientras los recursos posteriores esperan. Cuente el trabajo que hay delante de cada recurso (en horas de trabajo, no en piezas) en el mismo momento durante varios días. Un recurso con una cola grande y persistente, y recursos desabastecidos aguas abajo, es el probable cuello de botella. Precaución: una cola también puede formarse delante de un recurso que se alimenta con lotes grandes o que tiene la política de producir por adelantado.

### Método 3: El recorrido del cuello de botella

Christoph Roser recomienda el recorrido del cuello de botella como método de planta cuando faltan datos del estado de las máquinas [15]. Recorra la línea varias veces por turno y anote para cada proceso si está trabajando, desabastecido (esperando material) o bloqueado (no puede pasar el trabajo). Un proceso que trabaja la mayor parte del tiempo, con procesos bloqueados antes de él y procesos desabastecidos después, es el cuello de botella. Repita durante varios días para ver si se desplaza.

| Recorrido en | Sierra | Celda CNC | Desbarbado | Montaje | Prueba |
|---|---|---|---|---|---|
| 07:30 | bloqueada | trabajando | sin material | sin material | trabajando |
| 09:00 | trabajando | trabajando | trabajando | sin material | sin material |
| 10:30 | bloqueada | trabajando | sin material | trabajando | sin material |
| 13:00 | bloqueada | parada (herramienta) | sin material | sin material | sin material |
| Patrón | a menudo bloqueada | siempre trabajando | a menudo sin material | a menudo sin material | a menudo sin material |

### Método 4: Utilización (porcentaje activo)

Los datos de máquina de un MES, de una plataforma IIoT o del control de la máquina muestran la proporción de tiempo en que cada recurso está activo. El recurso con mayor proporción de tiempo activo es el candidato a cuello de botella. Roser, Nakano y Tanaka llaman a esto el método de carga de trabajo y lo utilizan como comparación en su artículo de 2001 [13]. Es fácil de automatizar, pero no tiene en cuenta el orden en que los recursos se interrumpen entre sí: dos recursos al 85 por ciento parecen iguales aunque uno de ellos detenga al otro.

### Método 5: El método de los periodos activos

El método de los periodos activos fue publicado por Roser, Nakano y Tanaka en la Winter Simulation Conference de 2001 y ampliado a cuellos de botella cambiantes en 2002 [13][14]. Requiere un registro de estados con marca de tiempo para cada recurso.

- Los **estados activos** son aquellos en los que el recurso puede hacer esperar a otros: procesamiento, pero también cambio de formato, avería, reparación y mantenimiento [14][15].
- Los **estados inactivos** son aquellos en los que el recurso espera a otros: sin material (esperando material o transporte) y bloqueado [14][15].
- Un **periodo activo** es una secuencia ininterrumpida de estados activos [13].
- En cada momento, **el recurso con el periodo activo ininterrumpido más largo es el cuello de botella momentáneo** [14].
- Cuando el periodo activo del cuello de botella actual se solapa con el del cuello de botella anterior o siguiente, el cuello de botella está **cambiando** entre ambos; fuera de los solapamientos, el recurso es el **único** cuello de botella [14].

**Ejemplo resuelto (dos horas de un registro de turno ilustrativo):**

| Recurso | Periodos activos | Periodos inactivos |
|---|---|---|
| Sierra | 08:00–08:20, 08:35–08:55, 09:10–09:30, 09:45–10:00 | bloqueada entre ellos |
| Celda CNC | 08:00–09:05 (65 min), 09:15–10:00 (45 min) | 09:05–09:15 sin material |
| Montaje | 08:00–08:10, 08:30–09:10 (40 min), 09:40–10:00 | sin material 08:10–08:30 y 09:10–09:40 |

Paso a paso:

1. 08:00–09:05: el periodo activo de 65 minutos de la celda CNC es el periodo continuo más largo, por lo que la celda CNC es el cuello de botella momentáneo.
2. 09:05–09:10: la celda CNC está sin material. El periodo activo más largo en este momento es el de montaje (08:30–09:10). Montaje es el cuello de botella.
3. 09:10–09:15: solo la sierra está activa (09:10–09:30). La sierra es el cuello de botella.
4. 09:15–10:00: el segundo periodo de la celda CNC (45 minutos) es el más largo. La celda CNC es el cuello de botella.
5. Solapamientos: el periodo de la CNC 08:00–09:05 se solapa con el periodo de montaje 08:30–09:10 durante 35 minutos (08:30–09:05), por lo que el cuello de botella cambia entre CNC y montaje en ese tramo. El periodo de la sierra 09:10–09:30 se solapa con el periodo de la CNC 09:15–10:00 durante 15 minutos, un cambio entre sierra y CNC.

| Recurso | Único cuello de botella | Cuello de botella cambiante | Suma | Proporción de 120 min (único / suma) |
|---|---|---|---|---|
| Celda CNC | 08:00–08:30 y 09:30–10:00 = 60 min | 35 + 15 = 50 min | 110 min | 50 % / 92 % |
| Montaje | 09:05–09:10 = 5 min | 35 min | 40 min | 4 % / 33 % |
| Sierra | 09:10–09:15 = 5 min | 15 min | 20 min | 4 % / 17 % |

Roser interpreta la proporción de cuello de botella único como límite inferior y la suma como límite superior del efecto de una mejora: si la celda CNC es el único cuello de botella el 50 por ciento del tiempo y el único o cambiante el 92 por ciento, una ganancia de un minuto en la celda CNC debería mejorar la producción del sistema en aproximadamente 0,5 a 0,9 minutos [15]. Dos horas de datos solo bastan para mostrar la mecánica; un análisis real utiliza semanas de registros.

Comparado con el método 4: la celda CNC estuvo activa 110 de 120 minutos (92 por ciento), la sierra 80 (67 por ciento) y montaje 70 (58 por ciento). La utilización señala aquí el mismo recurso, pero colocaría la sierra por delante de montaje aunque montaje forma parte con más frecuencia de un cuello de botella cambiante.

**De dónde provienen los datos:** estados de máquina del MES, pasarelas IIoT que leen el controlador o el registro de eventos de una simulación de eventos discretos. Roser señala que el método es más fácil con simulación o con sistemas muy automatizados y recomienda el recorrido del cuello de botella cuando faltan esos datos [15]. La guía [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) explica cómo las plantas recopilan los estados de los equipos.

### Método 6: Simulación y pruebas de sensibilidad

Un modelo de simulación de eventos discretos de la línea permite responder directamente a la pregunta: si cada recurso recibe en turno un 10 por ciento más de capacidad, ¿qué cambio aumenta la producción? El recurso cuya mejora más aumenta la producción es la restricción para esa combinación de productos. La simulación también muestra los cuellos de botella que se desplazan bajo variabilidad, algo que las tablas de carga estáticas no detectan. La guía sobre [simulación de fabricación](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) explica cómo construir un modelo de este tipo.

### Causas comunes de los cuellos de botella

Un análisis de cuellos de botella debe terminar con una causa, no solo con una ubicación. Las causas habituales en una planta son:

- capacidad inferior a la demanda para la combinación de productos actual (una verdadera restricción de capacidad)
- paradas no planificadas y reparaciones lentas en el recurso crítico
- cambios de formato largos combinados con reglas de lotes grandes
- falta de habilidades o de personal: solo unas pocas personas pueden operar o preparar el recurso
- pérdidas de calidad: chatarra y retrabajos que consumen tiempo del recurso restrictivo dos veces
- inanición: material, herramientas, programas o trabajo previo que llegan tarde
- políticas, como objetivos de utilización que mantienen ocupados a los no restrictivos mientras el trabajo se acumula en el lugar equivocado

La causa determina la solución. Las cinco primeras requieren primero la explotación (Sección 4, paso 2) y la elevación solo si esta no basta; la inanición requiere la subordinación (paso 3); las políticas requieren un cambio de reglas, a menudo con los procesos de pensamiento (Sección 12).

### ¿Qué método usar y cuándo?

| Método | Datos necesarios | Detecta cuellos de botella que se desplazan | Esfuerzo | Mejor uso |
|---|---|---|---|---|
| Carga de capacidad | rutas, demanda, calendario | no | bajo | primera verificación, planificación, cotización |
| Observación de colas | recuentos en piso | parcialmente | bajo | confirmación |
| Recorrido del cuello de botella | recorridos repetidos | parcialmente | bajo a medio | plantas sin datos de máquinas |
| Utilización | estados de máquinas | no | bajo una vez que fluyen los datos | paneles de control |
| Periodo activo | estados con marca de tiempo | sí | medio | líneas automatizadas, datos MES, simulación |
| Simulación | modelo más datos | sí | medio a alto | alta variedad, decisiones de inversión |

### Seis preguntas que revelan un falso cuello de botella

1. ¿El recurso realmente funciona durante todo el tiempo disponible, o a menudo está sin material?
2. ¿La cola frente a él es permanente o solo un lote que llega?
3. ¿Los recursos posteriores esperan por él, o por otra cosa?
4. Si mañana tuviera un 10 por ciento más de capacidad, ¿aumentarían los envíos?
5. ¿El "cuello de botella" está ocupado con trabajo que no se necesita en este momento?
6. ¿El límite real es una regla, como tamaños mínimos de lote o un patrón de turnos fijo?

## Programación drum-buffer-rope con números

Drum-buffer-rope (DBR, "tambor-amortiguador-cuerda") es el método de la TOC para programar y controlar la producción. Goldratt y Robert E. Fox lo describieron en *The Race* (1986), basándose en la metáfora de la tropa de exploradores de *The Goal* [3][8]. El *Theory of Constraints Handbook* describe la forma actual, incluida la gestión de amortiguadores y la clasificación de flujos VATI [9].

- **Tambor:** la programación de la restricción. Es la única programación detallada de la planta que debe mantenerse.
- **Amortiguador:** amortiguadores de tiempo que protegen el throughput de la planta frente a la variabilidad. El DBR tradicional usa amortiguadores en la restricción, en los puntos de ensamblaje donde las piezas de la restricción se encuentran con piezas que no son restricción, y en expedición [6].
- **Cuerda:** el mecanismo de liberación. El material entra en la planta un tiempo de amortiguador antes de que se necesite en la restricción; liberarlo antes solo aumenta el WIP [6].

Los amortiguadores en DBR se miden en **tiempo**, no en piezas [6]. Un amortiguador de restricción de 16 horas significa que el material se libera 16 horas laborables antes de su inicio programado en la restricción.

### Paso 1: construir la programación del tambor

Volviendo a la planta de colectores, la célula CNC es el tambor. Su programación para el miércoles (turno 1: 06:00–14:00, turno 2: 14:00–22:00), con los cambios de 18 minutos de la sección 5:

| Orden | Producto y cantidad | Preparación + ejecución (min) | Inicio CNC | Fin CNC |
|---|---|---|---|---|
| 1041 | A × 10 | 18 + 250 = 268 | Mié 06:00 | Mié 10:28 |
| 1042 | B × 5 | 18 + 200 = 218 | Mié 10:28 | Mié 14:06 |
| 1043 | A × 10 | 268 | Mié 14:06 | Mié 18:34 |
| 1044 | B × 4 | 18 + 160 = 178 | Mié 18:34 | Mié 21:32 |

La secuencia sigue la decisión de mezcla de productos de la sección 5 y la demanda semanal, con lotes lo bastante pequeños para mantener plazos de entrega cortos. Los 28 minutos que quedan al final del turno se dedican a una revisión planificada de herramientas.

### Paso 2: fijar los amortiguadores

- **Amortiguador de restricción:** 16 horas laborables (dos turnos). La sierra y la manipulación de material necesitan menos de una hora de tiempo de contacto por orden; el resto protege frente a problemas de la sierra, falta de material y programas.
- **Amortiguador de expedición:** 16 horas laborables después de la célula CNC. El desbarbado, el ensamblaje y la prueba necesitan unas dos horas de tiempo de contacto por orden.
- **Área física de amortiguador:** una zona de suelo marcada delante de la célula CNC, dimensionada para aproximadamente un día de trabajo, con carriles FIFO por familia de utillajes. Si el área se desborda, la liberación va por delante de la cuerda; si está vacía, la célula CNC está en riesgo.

¿Qué tamaño debe tener un amortiguador al principio? Gray, Felan, Umble y Umble señalan que existen reglas empíricas, pero que, según su experiencia, los tamaños de los amortiguadores suelen fijarse para lograr un sistema estable y luego se ajustan [24]; la gestión de amortiguadores (sección 9) es la que realiza el ajuste. Un valor inicial que a menudo se cita en la práctica de la TOC es alrededor de la mitad del plazo actual para ese tramo [unverified: cifra citada en la práctica de la TOC, sin fuente primaria]. En el ejemplo, el trabajo solía esperar 2,5 días delante de la célula CNC; el equipo empezó con un día y planeó ajustarlo.

### Paso 3: tensar la cuerda

Tiempo de liberación = inicio programado en la restricción − amortiguador de restricción.

| Orden | Inicio CNC | Amortiguador de restricción | Liberación a la sierra | Fecha de envío (fin CNC + amortiguador de expedición) |
|---|---|---|---|---|
| 1041 | Mié 06:00 | 16 h | Mar 06:00 | Jue 10:28 |
| 1042 | Mié 10:28 | 16 h | Mar 10:28 | Jue 14:06 |
| 1043 | Mié 14:06 | 16 h | Mar 14:06 | Jue 18:34 |
| 1044 | Mié 18:34 | 16 h | Mar 18:34 | Jue 21:32 |

No se libera material antes de su tiempo de liberación, por muy ociosa que esté la sierra. Esto es lo que mantiene bajos el WIP y el plazo de entrega.

### Paso 4: operar la planta según el estado de los amortiguadores

Los no restricciones no reciben una programación detallada. Trabajan en orden de estado de amortiguador (sección 9): primero las órdenes cuyo amortiguador está más consumido. La célula CNC sigue su secuencia.

### DBR frente a MRP push: qué cambia

| Aspecto | MRP push | DBR |
|---|---|---|
| Liberación | plazos planificados por operación, a menudo con holgura añadida | programación de la restricción menos amortiguador |
| Programaciones detalladas | para cada centro de trabajo | solo para la restricción |
| WIP | crece cuando se añaden holguras a los plazos | limitado por la cuerda |
| Prioridades en planta | listas de urgentes, expedición acelerada | códigos de color del estado de amortiguadores |
| Respuesta a la variabilidad | más plazo, más WIP | amortiguadores en unos pocos puntos, dimensionados y ajustados |

La guía [production scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/) explica cómo encaja el DBR en la programación de capacidad finita y cuándo un APS aporta valor.

### DBR en plantas de ensamblaje (tipo A)

En una planta tipo A, las piezas del recurso restrictivo se encuentran con las piezas no restrictivas en el ensamblaje. El DBR tradicional añade un **colchón de ensamblaje**: las piezas no restrictivas se liberan de forma que esperen en el ensamblaje hasta que llegue la pieza del recurso restrictivo, de modo que la salida de la restricción nunca espere a que falte un soporte [6][9]. En la industria aeroespacial y de construcción de maquinaria, donde los conjuntos requieren cientos de piezas, a menudo es aquí donde el DBR aporta más beneficios; la guía de [planificación de la producción aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/) cubre ese entorno.

## Drum-buffer-rope simplificado (S-DBR) para fabricación bajo pedido

El DBR simplificado (S-DBR) se desarrolló para plantas de fabricación bajo pedido donde normalmente la restricción es el mercado, no un recurso interno, o donde la restricción interna no está muy cargada. Utiliza un único colchón, el **colchón de expedición**, y sustituye el programa detallado del tambor por una comprobación de **carga planificada** en el recurso restrictivo de capacidad (CCR) [6][9].

### Cómo funciona el S-DBR

1. **Colchón de expedición:** cada pedido se libera un tiempo de colchón fijo antes de su fecha de entrega.
2. **Carga planificada:** la planta mantiene un total acumulado del trabajo ya comprometido en el CCR, expresado en días.
3. **Cotización de la fecha de entrega:** un nuevo pedido recibe una fecha de entrega no anterior a la fecha en que el CCR puede procesarlo, más parte del colchón de expedición para el trabajo posterior al CCR. Una convención habitual es la fecha de carga planificada más la mitad del colchón de expedición [unverified: convención habitual sin fuente específica].
4. **La gestión de colchones** establece las prioridades en planta según la proporción del colchón de expedición consumida.

### Ejemplo práctico: cotizar una fecha de entrega con S-DBR

Supongamos que la planta de colectores se ha vuelto de fabricación bajo pedido y que el mercado es la restricción la mayoría de las semanas. La célula CNC se trata como el CCR, con 4.400 minutos efectivos por semana, o 880 minutos por día laborable.

- Pedidos ya comprometidos en la célula CNC: 3.520 minutos. Carga planificada = 3.520 ÷ 880 = **4,0 días laborables**.
- Colchón de expedición: **6 días laborables** (el plazo de entrega total actual es de 12 días; el equipo parte de la mitad).
- Nuevo pedido: 10 unidades de B, 40 minutos cada una = 400 minutos = 0,45 días en la célula CNC.

Fecha de entrega segura = hoy + carga planificada + tiempo CNC del nuevo pedido + la mitad del colchón de expedición = 0 + 4,0 + 0,45 + 3,0 = **7,45, es decir, 8 días laborables**. Fecha de liberación = fecha de entrega − colchón de expedición = día 8 − 6 = **día 2**.

Si ventas quiere prometer 5 días, la comprobación muestra que el pedido adelantaría la cola en la célula CNC y retrasaría otros pedidos. Esa conversación tiene lugar en la toma del pedido, no en el taller dos semanas después.

### ¿DBR o S-DBR?

| Criterio | DBR tradicional | S-DBR |
|---|---|---|
| Restricción | interna y muy cargada | mercado, o interna pero moderadamente cargada |
| Colchones | restricción, ensamblaje, expedición | solo expedición |
| Programa de la restricción | secuencia detallada | comprobación de carga planificada |
| Esfuerzo | mayor | menor |
| Ajuste típico | cuello de botella estable, plantas tipo A o I | talleres de fabricación bajo pedido, alta mezcla |

## Gestión de buffers: el ciclo de retroalimentación

La gestión de buffers es el bucle de control y mejora de DBR y S-DBR [9]. Para cada orden abierta, la planta registra cuánto de su buffer se ha consumido y la marca según corresponda. El resumen de la Teoría de Restricciones (TOC) en Wikipedia describe la codificación en rojo, amarillo y verde según la penetración en el buffer [6].

**Fórmula (para una orden que aún no ha llegado al punto protegido):**
Penetración del buffer (%) = (1 − tiempo restante hasta la llegada programada al punto protegido ÷ tamaño del buffer) × 100

| Zona | Penetración del buffer | Significado | Respuesta |
|---|---|---|---|
| Verde | 0 a 33% | en plan | ninguna |
| Amarilla | 33 a 67% | situación ajustada | verificar dónde está la orden, preparar acción |
| Roja | 67 a 100% | el punto protegido puede quedar en espera | acelerar: pasar la orden al frente, corregir la causa |
| Negra (algunas plantas) | por encima de 100% | ya con retraso | escalar, informar al cliente si se trata de un buffer de envío |

La división en tercios es una convención, no una ley natural.

### Ejemplo práctico: estado del buffer el miércoles a las 06:00

Buffer de la restricción: 16 horas laborables. Ninguna de las cuatro órdenes ha llegado todavía a la célula CNC al inicio del turno.

| Orden | Inicio programado en CNC | Horas laborables restantes | Penetración | Zona | Acción |
|---|---|---|---|---|---|
| 1041 | Mié 06:00 | 0 | 100% | roja/negra | la CNC esperará; localizar la orden ahora |
| 1042 | Mié 10:28 | 4.5 | 1 − 4.5 ÷ 16 = 72% | roja | acelerar en la sierra |
| 1043 | Mié 14:06 | 8.1 | 1 − 8.1 ÷ 16 = 49% | amarilla | verificar estado |
| 1044 | Mié 18:34 | 12.6 | 1 − 12.6 ÷ 16 = 21% | verde | ninguna |

En un día normal, las órdenes con vencimiento en las próximas horas ya están en el buffer delante de la célula CNC. Que la orden 1041 no esté allí a las 06:00 significa que la célula CNC está a punto de perder tiempo.

### Usar los datos del buffer para mejorar

Registre el motivo cada vez que una orden pase a rojo: falta de material, avería de la sierra, programa no liberado, retención por calidad. Tras unas semanas, un diagrama de Pareto de las causas es la lista de mejoras para los no restricciones. Dos reglas prácticas para dimensionar:

- Si muchas órdenes están en rojo, el buffer es demasiado pequeño o el proceso anterior demasiado inestable. Corrija primero las causas principales y luego considere un buffer mayor.
- Si casi todas las órdenes permanecen en verde, el buffer es demasiado grande. Redúzcalo por etapas; el WIP y el lead time bajan con él.

Para los buffers de stock en distribución, la regla de gestión dinámica de buffers resumida en Wikipedia consiste en reducir un buffer en un tercio si el stock permanece en el tercio superior durante un tiempo de reposición completo, y aumentarlo en un tercio si permanece demasiado tiempo en el tercio inferior [6].

## Física de fábrica detrás de TOC: Ley de Little y variabilidad

La TOC a veces se enseña como una filosofía. Sus reglas de programación también se derivan de la teoría de colas.

### Ley de Little

John D. C. Little demostró en 1961 que, en un sistema estable, el número medio de artículos en el sistema es igual a la tasa de llegada por el tiempo medio de permanencia en el sistema [16]. En términos de fábrica (Hopp y Spearman) [17]:

**WIP = rendimiento × tiempo de ciclo**, o bien **tiempo de ciclo = WIP ÷ rendimiento**

**Ejemplo resuelto (planta de colectores, antes y después de DBR):**

| | Antes (empuje) | Después (DBR) |
|---|---|---|
| WIP entre la sierra y el envío | 640 unidades | 90 unidades |
| Rendimiento | 127 unidades por semana | 147 unidades por semana |
| Tiempo de ciclo = WIP ÷ rendimiento | 640 ÷ 127 = 5.0 semanas | 90 ÷ 147 = 0.61 semanas, unos 3 días laborables |

El WIP bajó porque la cuerda dejó de liberar material antes de tiempo; el rendimiento subió porque se explotó la restricción. El plazo de entrega se redujo más de un 80 por ciento. La Ley de Little también advierte del límite: si el WIP delante de la restricción baja tanto que esta se queda sin material, el rendimiento también cae. Por eso DBR mantiene un colchón solo en la restricción y en ningún otro punto.

### Variabilidad y utilización

La aproximación de Kingman para una sola estación muestra por qué los no restrictivos necesitan capacidad de reserva [17][18]:

**Tiempo de espera ≈ ((ca² + ce²) ÷ 2) × (u ÷ (1 − u)) × te**

donde ca y ce son los coeficientes de variación de las llegadas y de los tiempos de proceso, u es la utilización y te el tiempo medio de proceso. Es una aproximación para una sola estación con distribuciones generales de llegada y de tiempo de proceso (G/G/1), y es más precisa con utilización alta [17][18].

| Utilización u | u ÷ (1 − u) | Tiempo de espera con ca = ce = 1, te = 40 min |
|---|---|---|
| 70% | 2.3 | 93 min |
| 85% | 5.7 | 227 min |
| 95% | 19.0 | 760 min |

Al pasar del 85 al 95 por ciento de utilización, el tiempo de espera más que se triplica. Una planta que empuja cada recurso hacia el 95 por ciento crea colas largas por todas partes. La respuesta de TOC es operar la restricción a utilización muy alta, protegida por un colchón deliberado, y mantener los no restrictivos muy por debajo de ese nivel.

## Contabilidad de rendimiento frente a contabilidad de costes

La contabilidad de rendimiento es el sistema de medición de la TOC. Goldratt expuso sus tres medidas en *La meta* y *The Haystack Syndrome* [20]; *Throughput Accounting* de Thomas Corbett (North River Press) es el tratamiento de referencia en formato de libro [21].

### Las tres medidas

| Medida | Definición (Goldratt, según resume MAAW) [20] | Definición práctica en una planta |
|---|---|---|
| Rendimiento (T) | la tasa a la que el sistema genera dinero mediante las ventas | ventas menos los costes totalmente variables, normalmente materia prima, piezas compradas, comisiones y procesos externos por unidad [6][22] |
| Inventario (I), más tarde a menudo "inversión" | el dinero que el sistema invierte en comprar cosas que pretende vender | materia prima, WIP y productos terminados valorados al coste de material, más, en la definición amplia, equipos y edificios [22] |
| Gastos operativos (OE) | todo el dinero que el sistema gasta en convertir el inventario en rendimiento | salarios (incluida la mano de obra directa), alquiler, energía, mantenimiento, amortización |

La mano de obra directa forma parte de OE, no de T. Esa es la diferencia clave con el coste estándar: en la mayoría de las plantas, la mano de obra no sube ni baja con cada unidad adicional a corto plazo.

### Medidas derivadas

| Medida | Fórmula | Planta de colectores tras la explotación (semanal) |
|---|---|---|
| Beneficio neto (NP) | T − OE | $85,250 − $63,500 = $21,750 |
| Retorno de la inversión (ROI) | (T − OE) ÷ I | con I = $1.2 millones: $21,750 × 52 ÷ $1,200,000 = 94% anual |
| Productividad | T ÷ OE | $85,250 ÷ $63,500 = 1.34 |
| Rotaciones de inversión | T ÷ I | $85,250 × 52 ÷ $1,200,000 = 3.7 anuales |

El resumen de Lean Production recoge las mismas medidas derivadas y la prioridad de decisión de TOC: aumentar primero el rendimiento, después reducir la inversión y, por último, reducir los gastos operativos [22]. La cifra de inversión de $1.2 millones es un supuesto del ejemplo.

### Regla de decisión: rendimiento por unidad de restricción

Cuando existe una restricción, los productos deben clasificarse por rendimiento por unidad de tiempo de la restricción, no por margen por unidad. En los libros de contabilidad esto es el conocido "margen de contribución por unidad de factor limitante"; el equipo examinador de ACCA describe la versión de rendimiento con el retorno por hora de fábrica y el ratio de contabilidad de rendimiento (TPAR) [19]:

- **Retorno por hora de fábrica** = throughput por unidad ÷ horas por unidad en el cuello de botella
- **Costo por hora de fábrica** = costo total de fábrica ÷ horas totales disponibles en el cuello de botella
- **TPAR** = retorno por hora de fábrica ÷ costo por hora de fábrica; normalmente debe ser mayor que 1 [19].

### Ejemplo práctico: costeo estándar frente a contabilidad de throughput

El costeo estándar en la planta de colectores asigna el gasto operativo a los productos según los minutos estándar de mano de obra. Minutos estándar presupuestados a la demanda: A 70 minutos por unidad (8 + 25 + 12 + 15 + 10) × 100 unidades = 7,000; B 97 minutos (10 + 40 + 12 + 20 + 15) × 60 unidades = 5,820; total 12,820 minutos. Tasa de cargo fijo = $62,000 ÷ 12,820 = **$4.84 por minuto estándar**.

| | Producto A | Producto B |
|---|---|---|
| Precio | $900.00 | $1,200.00 |
| Material | $400.00 | $450.00 |
| Mano de obra y gastos generales (70 × $4.84; 97 × $4.84) | $338.80 | $469.48 |
| **Margen estándar por unidad** | **$161.20** | **$280.52** |
| Margen estándar % | 17.9% | 23.4% |
| Throughput por unidad | $500 | $750 |
| Horas CNC por unidad | 0.417 | 0.667 |
| **Retorno por hora CNC** | **$1,200** | **$1,125** |

Costo por hora de fábrica, usando el gasto operativo después de la explotación: $63,500 ÷ (4,400 ÷ 60 = 73.3 horas CNC) = **$865.91**. TPAR A = 1,200 ÷ 865.91 = **1.39**; TPAR B = 1,125 ÷ 865.91 = **1.30**. Ambos productos generan dinero, pero A genera más por hora de restricción.

El costeo estándar dice "empujar B": tiene mayor margen por unidad y en porcentaje. La contabilidad de throughput dice "llenar primero la restricción con A". La sección 5 mostró el resultado: $1,250 más de utilidad neta por semana con la clasificación de throughput. El costeo estándar no es incorrecto como aritmética. Responde a otra pregunta (el costo total promedio de una unidad durante un periodo), y esa no es la pregunta que necesita una decisión de mezcla de productos bajo una restricción.

### Ejemplo práctico: un pedido que solo usa capacidad ociosa

Un cliente solicita 40 placas adaptadoras por semana a $260 cada una. El material cuesta $150. Las placas requieren la sierra (15 minutos), el desbarbado (10 minutos) y el ensamble (25 minutos), pero **ningún tiempo de CNC**. Total: 50 minutos estándar.

| | Vista de costeo estándar | Vista de throughput |
|---|---|---|
| Material | $150.00 | $150.00 |
| Mano de obra y gastos generales (50 × $4.84) | $242.00 | no por unidad: el OE no cambia, los recursos tienen capacidad ociosa |
| Margen por unidad | $260 − $392 = **−$132** | T = $260 − $150 = **+$110** |
| Decisión | rechazar | aceptar |
| Efecto en la utilidad neta semanal (40 placas) | | +$4,400, siempre que la sierra, el desbarbado y el ensamble se mantengan por debajo de su capacidad |

Revise las cargas: sierra +600 minutos (hasta 2,000, 42 por ciento), desbarbado +400 (hasta 2,320, 48 por ciento), ensamble +1,000 (hasta 3,700, 77 por ciento). El ensamble se acerca más a convertirse en restricción, por lo que el pedido debe aceptarse con un límite de volumen y con seguimiento. Con costeo estándar, la planta habría rechazado $4,400 semanales.

### Inventario y utilidad reportada

Con el costeo por absorción, los gastos generales se trasladan al inventario. Si la planta de colectores produce 50 unidades adicionales de A para almacén, 50 × $338.80 = **$16,940** de los gastos generales del periodo pasan al balance general en lugar del estado de resultados, y la utilidad reportada aumenta en esa cantidad. El efectivo disminuye por el material comprado, 50 × $400 = $20,000. Con la contabilidad de throughput, la utilidad neta no cambia y el inventario aumenta en $20,000. Por eso los practicantes de TOC advierten que acumular inventario puede hacer que una planta se vea mejor en el papel mientras empeora en efectivo y en tiempo de entrega.

La información financiera externa en Estados Unidos exige incluir los gastos generales de producción en el costo del inventario (costeo por absorción): según ASC 330, el costo del inventario es la suma de los desembolsos y cargos incurridos directa o indirectamente para llevar un artículo a su condición y ubicación actuales, y los gastos generales fijos de producción se asignan al inventario con base en la capacidad normal de las instalaciones productivas [28][29]. Su contralor decide cómo aplica la planta esto. Por lo tanto, la contabilidad de throughput es una herramienta de decisiones internas. La mayoría de las plantas que la usan mantienen estados GAAP para la información externa y concilian ambos.

### Lo que el controller de planta debe vigilar

| Riesgo | Por qué importa | Mitigación |
|---|---|---|
| "Verdaderamente variable" definido de forma demasiado estrecha o demasiado amplia | T queda sobrestimado o subestimado | acordar por escrito una lista: material, piezas compradas, procesos externos, flete de salida si es por unidad, comisiones de venta |
| OE tratado como fijo a largo plazo | los cambios grandes de volumen sí modifican OE | revisar los supuestos de OE para decisiones que superen un trimestre |
| Ignorar la ubicación de la restricción | el throughput por minuto de restricción carece de sentido si la restricción se desplaza | recalcular cuando cambie la tabla de carga |
| Fijar precios por debajo del costo total de forma permanente | desaparece la capacidad ociosa y OE tiene que crecer | límites de volumen, revisión cada trimestre |
| Dos juegos de cifras | confusión en las reuniones de dirección | una hoja de conciliación única; TA para decisiones, GAAP para estados financieros |
| Mano de obra que realmente varía por unidad | el pago a destajo o la mano de obra de agencia registrada por unidad es verdaderamente variable | incluirla en el costo verdaderamente variable; los salarios regulares permanecen en OE |

La guía de [KPI de manufactura](https://www.m365.fm/en/learn/manufacturing-kpis/) cubre la rotación de inventario y otras medidas financieras-operativas.

## Los procesos de pensamiento

Los procesos de pensamiento (TP) son las herramientas de TOC para problemas que no son de capacidad: restricciones de política, conflictos y gestión del cambio. La novela de Goldratt *It's Not Luck* (1994) los dio a conocer a un público amplio; Kim, Mabin y Davies revisaron la literatura de investigación sobre ellos desde 1994, después de ese libro, hasta comienzos de 2006, y concluyeron que TOC se desarrolló principalmente a través de la práctica, con muchas áreas de aplicación y enfoques multimetodológicos [12].

Los TP responden a tres preguntas: qué cambiar, a qué cambiar y cómo provocar el cambio.

| Herramienta | Pregunta | Lógica | Resultado |
|---|---|---|---|
| Árbol de realidad actual (CRT) | ¿qué cambiar? | causa y efecto ("si ... entonces ...") desde unas pocas causas raíz hasta muchos efectos indeseables (UDE) | el problema central |
| Nube evaporativa (EC), diagrama de resolución de conflictos | ¿a qué cambiar? | necesidad ("para ... debemos ...") | el supuesto que, una vez roto, resuelve el conflicto |
| Árbol de realidad futura (FRT) | ¿a qué cambiar? | suficiencia, con inyecciones | la solución y sus efectos secundarios (ramas negativas) |
| Árbol de prerrequisitos (PRT) | ¿cómo provocar el cambio? | obstáculos y objetivos intermedios | la secuencia de hitos |
| Árbol de transición (TrT) | ¿cómo provocar el cambio? | acción, razón, efecto | un plan paso a paso |

### Ejemplo práctico: nube evaporativa sobre el tamaño de lote

En la planta de colectores, el supervisor de CNC y el gerente de ventas discutían el tamaño de lote para B.

| Casilla | Contenido |
|---|---|
| A (objetivo común) | operar una planta rentable |
| B (necesidad 1) | aprovechar bien la capacidad de la celda CNC |
| C (necesidad 2) | entregar rápido los pedidos de B |
| D (deseo 1, sirve a B) | producir lotes grandes de B (40) para ahorrar cambios |
| D' (deseo 2, sirve a C) | producir lotes pequeños de B (10) |
| Conflicto | D y D' no pueden hacerse a la vez |

El supuesto bajo B–D: "los cambios en la celda CNC duran 30 minutos, así que cada cambio adicional cuesta 30 minutos de tiempo de restricción". La inyección: reducir el cambio a 18 minutos con preparación externa y agrupar las variantes de B por familia de utillajes, de modo que los lotes pequeños cuesten poco tiempo de restricción. La nube "se evapora" porque el supuesto que sostenía el conflicto ya no es cierto.

### Ejemplo práctico: un árbol de realidad actual pequeño

El equipo directivo enumeró los efectos indeseables (UDE): pedidos atrasados, WIP alto, urgencias frecuentes, horas extra en montaje, supervisores que se disputan las prioridades. Leyendo el árbol desde abajo:

1. Si a los supervisores se les mide por utilización, entonces liberan trabajo antes de tiempo para mantener sus máquinas ocupadas.
2. Si el trabajo se libera antes de tiempo, entonces crece el WIP y se alargan las colas frente a la celda CNC.
3. Si las colas son largas, entonces la celda CNC procesa lo que está encima, no lo que vence.
4. Si la celda CNC procesa los pedidos equivocados, entonces los pedidos con fecha se retrasan, y a ello siguen las urgencias y las horas extra de montaje.

Problema central: la medida de utilización (una restricción de política). La solución no es más capacidad sino otra medida y una regla de liberación de trabajo, que es DBR.

### Usar bien los TP

- Mantenga los árboles pequeños al principio. Entre cinco y diez UDE bastan para un área.
- Compruebe cada flecha: ¿la causa realmente lleva al efecto? ¿Hay otras causas?
- Trabaje en un grupo que incluya a operarios; ellos conocen los efectos que los directivos no ven.
- La nube evaporativa es la herramienta más fácil para empezar y la más útil en los conflictos diarios.

## TOC vs. lean vs. Six Sigma

TOC, lean y Six Sigma suelen presentarse como competidores. En la práctica responden a preguntas distintas.

| Tema | Teoría de restricciones | Lean | Six Sigma |
|---|---|---|---|
| Origen | Goldratt, años 80, Israel y EE. UU. [1][3] | Sistema de Producción Toyota, Japón | Motorola, años 80, EE. UU. [27] |
| Pregunta central | ¿dónde está la palanca? | ¿dónde está el desperdicio? | ¿dónde está la variación? |
| Enfoque | la restricción y el throughput global | flujo y valor para el cliente a lo largo de la cadena de valor | defectos y capacidad del proceso |
| Herramientas principales | cinco pasos de enfoque, DBR, gestión de buffers, contabilidad de throughput, procesos de pensamiento | mapeo de la cadena de valor, 5S, SMED, kanban, trabajo estándar, kaizen | DMAIC, estadística, gráficos de control, diseño de experimentos |
| Visión de la capacidad | proteger la capacidad excedente en los no restricciones | equilibrar al takt y reducir la sobrecapacidad como desperdicio | no es central |
| Visión del inventario | buffers en unos pocos puntos elegidos, en tiempo | minimizarlo en todas partes | no es central |
| Visión financiera | throughput, inventario, gastos operativos | lead time, coste, calidad | coste de la mala calidad |
| Debilidad típica | un enfoque estrecho puede ignorar el desperdicio fuera de la restricción | aplicar las herramientas en todas partes a la vez | proyectos elegidos sin visión del sistema |

### Cómo trabajan juntos

1. **TOC fija el enfoque.** Los cinco pasos de enfoque eligen el lugar donde la mejora cambia el resultado de la planta.
2. **Lean explota la restricción.** SMED reduce los cambios de formato en la restricción, TPM aumenta su disponibilidad, y el trabajo estándar y las 5S la estabilizan. Véanse las guías de [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/), [SMED](https://www.m365.fm/en/learn/smed-changeover-reduction/) y [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/).
3. **Six Sigma elimina la variación en la restricción y antes de ella.** La chatarra en la restricción y el suministro tardío e inestable hacia su buffer son buenos proyectos DMAIC. Véase [Six Sigma and root cause analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).
4. **TOC mide el resultado.** La contabilidad de throughput muestra lo que cada proyecto aportó a T, I y OE.

### Dónde lean y TOC realmente discrepan

- **Equilibrado de línea.** Lean equilibra el contenido de trabajo al takt. TOC mantiene deliberadamente los no restricciones desequilibrados, con capacidad de sobra, para proteger la restricción. En una línea de montaje con ritmo takt, la línea en su conjunto actúa como restricción; la discrepancia pesa más en los talleres de pedido (job shops).
- **Buffers.** Lean considera el inventario como desperdicio y los buffers como una contramedida temporal. TOC considera un buffer de tiempo dimensionado en la restricción como protección permanente. Ambos reducen mucho el WIP total frente a un sistema push.
- **Mecanismos pull.** Kanban limita el WIP entre cada par de procesos; DBR lo limita entre la liberación y la restricción, similar a CONWIP, que Spearman, Woodruff y Hopp propusieron como alternativa pull a kanban [23]. Véase la guía de [kanban and pull system](https://www.m365.fm/en/learn/kanban-pull-system/).

### OEE en la restricción

El OEE (disponibilidad × rendimiento × calidad) es más útil en la restricción, donde cada minuto perdido cuesta throughput. En un no restricción, un OEE bajo puede significar simplemente que espera, como debe ser. Si su planta informa un único número de OEE para todas las máquinas, separe la restricción.

## Más allá de la planta: cadena crítica y reposición

### Gestión de proyectos por cadena crítica

En *Critical Chain* (1997), Goldratt aplicó la TOC a los proyectos [3]. Las ideas en resumen:

- **La cadena crítica** es la cadena más larga de tareas dependientes, teniendo en cuenta tanto las dependencias entre tareas como las dependencias de recursos. Una ruta crítica ignora los conflictos de recursos.
- **Estimaciones de tareas agresivas.** Se elimina el tiempo de seguridad de cada tarea individual.
- **Colchones agregados.** El margen de seguridad eliminado se agrupa en un **colchón de proyecto** al final y en **colchones de alimentación** donde las cadenas no críticas se unen a la cadena crítica.
- **Gestión de colchones.** El progreso se controla mediante un gráfico de fiebre: colchón consumido frente a cadena completada.
- **Sin multitarea perjudicial.** Los recursos terminan una tarea antes de empezar la siguiente.

El informe de PMI que compara el DBR con el colchonado de la cadena crítica describe la lógica común: ambos protegen la restricción del sistema con colchones de tiempo agregados en lugar de seguridad local en cada paso [24]. Para proyectos de utillaje, ampliaciones de planta e introducciones de nuevos productos, la cadena crítica suele ser la segunda aplicación de la TOC tras el DBR.

### Reposición y distribución

Para artículos de fabricación para stock y recambios, la TOC sustituye las previsiones en cada ubicación por colchones que se reponen según el consumo real. El colchón se dimensiona según el consumo máximo esperado dentro del tiempo medio de reposición, más un margen por suministro poco fiable; después se ajusta en un tercio al alza o a la baja según el tiempo que el stock permanezca en la zona roja o verde [6]. La guía de [gestión de inventario de fabricación](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/) compara este enfoque con las fórmulas clásicas de stock de seguridad, y la guía de [S&OP y MRP](https://www.m365.fm/en/learn/sop-mrp-production-planning/) muestra dónde encaja en la planificación.

## Plantillas para el trabajo con TOC

Copie estas tablas en una hoja de cálculo o en un tablero de planta. Son deliberadamente sencillas.

### Plantilla 1: Hoja de identificación de restricciones

| Recurso | Carga impulsada por la demanda (min/semana) | Disponible (min/semana) | Proporción productiva | % de carga efectiva | Cola media delante (horas de trabajo) | Recorrido por el cuello de botella: % en trabajo | Periodo activo: % exclusivo / suma | Veredicto |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Plantilla 2: Registro de pérdidas de la restricción (por turno)

| Fecha | Turno | Minutos planificados | Minutos productivos | Pausa no cubierta | Cambio de formato | Sin material | Bloqueado | Parada | Chatarra/retrabajo | Notas |
|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | |

### Plantilla 3: Mezcla de productos por throughput por minuto de restricción

| Producto | Precio | Coste variable real | T por unidad | Minutos de restricción por unidad | T por minuto de restricción | Demanda | Rango | Cantidad planificada |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Plantilla 4: Tablero de estado de colchones

| Pedido | Punto protegido (restricción / montaje / expedición) | Fecha de vencimiento en el punto protegido | Tamaño del colchón (h) | Restante (h) | % de penetración | Zona | Ubicación actual | Responsable |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Plantilla 5: Registro de causas de pedidos en rojo

| Fecha | Pedido | Zona alcanzada | Categoría de causa (material, máquina, calidad, programa, personas, otra) | Detalle de la causa | Minutos perdidos en la restricción | Contramedida | Responsable |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Plantilla 6: Hoja de decisión de elevación

| Opción | Minutos extra de restricción/semana | Δ T por semana | Δ OE por semana | Δ I (único) | Δ NP por semana (ΔT − ΔOE) | Plazo de recuperación en semanas (ΔI ÷ ΔNP) | ¿Dónde se desplaza la restricción a continuación? |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

### Plantilla 7: Nube evaporante

| A: objetivo común | B: necesidad 1 | C: necesidad 2 | D: lo que se quiere para servir a B | D': lo que se quiere para servir a C | Supuestos B–D | Supuestos C–D' | Supuestos D frente a D' | Inyección |
|---|---|---|---|---|---|---|---|---|
| | | | | | | | | |

### Plantilla 8: Reunión diaria de restricción (10 minutos, en la restricción)

| Minuto | Tema | Entrada |
|---|---|---|
| 0–2 | ayer: minutos productivos frente al plan, principal pérdida | Plantilla 2 |
| 2–5 | colchón: pedidos en rojo y amarillo, quién actúa | Plantilla 4 |
| 5–8 | causas de los rojos, contramedidas abiertas | Plantilla 5 |
| 8–10 | hoy: secuencia, dotación de personal, ventana de mantenimiento | programa de tambor |

La guía de [gestión de planta](https://www.m365.fm/en/learn/shop-floor-management/) muestra cómo integrar esta reunión en reuniones escalonadas.

## Hoja de ruta de implementación: los primeros seis meses

La siguiente hoja de ruta es para una planta o para una cadena de valor. Supone que existe una restricción física dentro de la planta; si el análisis del mes 1 muestra que la restricción es el mercado, pase directamente a S-DBR y al área comercial.

| Fase | Semanas | Objetivos | Actividades clave | Criterios de salida |
|---|---|---|---|---|
| 0. Preparar | 1–2 | comprensión compartida | la dirección lee *La meta* o realiza un juego de simulación de TOC; acordar la meta y las medidas (T, I, OE); involucrar pronto a los representantes sindicales o de los empleados | patrocinador designado, equipo central constituido, medidas acordadas |
| 1. Identificar | 3–6 | encontrar la restricción con datos | tabla de carga (Método 1), recuento de colas, recorridos de cuellos de botella, datos de máquinas o análisis de periodos activos si están disponibles | restricción acordada por los datos y por el piso de planta |
| 2. Explotar | 5–12 | recuperar el tiempo perdido en la restricción | registro de pérdidas en la restricción, coberturas de pausas, preparación externa, calidad antes y después de la restricción, prioridad de mantenimiento, mezcla de productos por T por minuto de restricción | minutos productivos al alza, Pareto de pérdidas en uso |
| 3. Subordinar | 9–16 | proteger la restricción, reducir el WIP | piloto de DBR o S-DBR: programa de tambor, colchones, liberación por cuerda; detener los objetivos de utilización en los no restricciones | regla de liberación en uso diario, WIP en descenso |
| 4. Gestión de colchones | 12–20 | control y aprendizaje diarios | tablero de estado de colchones, registro de causas de pedidos en rojo, reunión diaria de 10 minutos sobre la restricción, primer ajuste del tamaño de colchones | menos pedidos en rojo, causas en proceso de corrección |
| 5. Medir y decidir | 16–24 | finanzas en la mesa | visión de contabilidad de throughput para decisiones de mezcla y pedidos, conciliación con el costeo estándar | TA usada en al menos una decisión real |
| 6. Elevar y revisar | 20–26 | añadir capacidad solo cuando esté justificado; detectar la inercia | hoja de decisión de elevación (Plantilla 6), revisar rutas, reglas de lotes, reglas de cotización | ubicación de la restricción revisada de nuevo, siguiente ciclo planificado |

### Roles

| Rol | Responsabilidad |
|---|---|
| Patrocinador (gerente de planta) | meta, medidas, eliminar restricciones de política como los objetivos de utilización |
| Responsable de la restricción (supervisor de la restricción) | minutos productivos diarios, registro de pérdidas, reunión sobre la restricción |
| Planificador o programador | programa de tambor, liberación, tamaños de colchones, cotización de fechas de entrega |
| Contralor de planta | definiciones de T, I, OE; mezcla de productos y decisiones de pedidos; conciliación |
| Responsable de mantenimiento | tiempo de respuesta ante la restricción, ventanas de mantenimiento planificado |
| Responsable de calidad | inspección antes y después de la restricción, causas de pedidos en rojo en calidad |
| Operarios en la restricción y alrededor de ella | motivos de pérdida, mejora de preparaciones, ideas; ellos son los responsables de las contramedidas |

### Criterios para el área piloto

Elija una cadena de valor donde (1) una restricción sea claramente visible, (2) la entrega o el tiempo de ciclo afecten a los clientes, (3) el supervisor esté dispuesto y (4) existan datos o puedan recopilarse a mano durante unas semanas. La guía de [mapeo de la cadena de valor](https://www.m365.fm/en/learn/value-stream-mapping/) muestra cómo mapear el flujo y ver dónde se ubica la restricción dentro de la cadena de valor.

## KPI del TOC: cómo medir el progreso

| KPI | Fórmula | Nivel | Frecuencia | Comentario |
|---|---|---|---|---|
| Throughput (T) | ventas − costo verdaderamente variable | planta | semanal, mensual | la medida principal de la meta |
| Gasto operativo (OE) | todos los demás gastos | planta | mensual | debe crecer más lento que T |
| Inventario/inversión (I) | valor de materiales del stock y WIP (más activos en la visión amplia) | planta | mensual | la parte de WIP debe bajar con DBR |
| Utilidad neta | T − OE | planta | mensual | |
| ROI | (T − OE) ÷ I | planta | trimestral | |
| Minutos productivos del restricción | minutos de piezas buenas en el restricción ÷ minutos disponibles | restricción | por turno | el latido diario |
| Cumplimiento del programa en el restricción | órdenes iniciadas dentro de la ventana planificada ÷ órdenes planificadas | restricción | diario | muestra si el tambor se mantiene |
| Proporción de órdenes rojas | órdenes rojas ÷ órdenes abiertas | buffer | diario | demasiado alta: buffer muy pequeño o proceso inestable |
| Cumplimiento de fecha de entrega | órdenes enviadas en o antes de la fecha prometida ÷ órdenes enviadas | cliente | semanal | el resultado más visible |
| Lead time | liberación a envío, mediana y percentil 90 | flujo de valor | semanal | verificar con la Ley de Little |
| WIP en días | WIP ÷ throughput diario promedio | flujo de valor | semanal | |
| Throughput-dólar-días (TDD) | Σ (valor T de la orden atrasada × días de atraso) | responsabilidad | semanal | una medida del TOC de "cosas que debieron haberse hecho"; origen en el trabajo de medición de Goldratt [unverified: atribución al trabajo de medición de Goldratt no confirmada] |
| Inventario-dólar-días (IDD) | Σ (valor del inventario × días retenido) | responsabilidad | semanal | mide "cosas que no debieron haberse hecho" [unverified: definición de IDD como medida de cosas que no debieron haberse hecho no confirmada] |

Dos reglas para el tablero de KPI: mostrar los KPI del restricción en el restricción, y no mostrar la utilización de los no restricciones como meta de desempeño. La guía de [KPI de manufactura](https://www.m365.fm/en/learn/manufacturing-kpis/) define los KPI de producción estándar que acompañan a estos.

## Errores comunes

| Error | Por qué perjudica | Mejor |
|---|---|---|
| Elegir el restricción por intuición | el problema visible suele ser un síntoma (el ensamble estaba desabastecido) | tabla de carga más verificación en piso, datos de periodo activo si están disponibles |
| Saltar al paso 4 | se gasta dinero mientras el restricción sigue perdiendo entre 20 y 25 % de su tiempo | explotar y subordinar primero |
| Mantener metas de utilización en los no restricciones | liberación anticipada, más WIP, el restricción ejecuta el trabajo equivocado | medir los no restricciones por "el restricción nunca espera por nosotros" |
| Liberar trabajo antes "por seguridad" | el WIP y los lead times crecen; se pierden las prioridades | liberación estricta según la cuerda |
| Buffers definidos una vez y olvidados | muy grandes: el WIP se mantiene alto; muy pequeños: rojos constantes | ajustar con base en los datos de órdenes rojas |
| Sin puerta de calidad antes del restricción | el restricción maquina piezas que ya son desperdicio | inspección o poka-yoke antes del restricción |
| Desperdicio detectado muy aguas abajo | el tiempo del restricción se pierde silenciosamente | verificar las características críticas justo después del restricción |
| Ignorar el restricción de mercado | una planta con capacidad sobrante en todas partes sigue "optimizando" máquinas | S-DBR, ofertas de lead time, participación de ventas |
| Mezcla de productos por margen por unidad | menos utilidad con la misma capacidad | ordenar por T por minuto de restricción |
| Dos sistemas de prioridad en competencia | listas urgentes y colores de buffer entran en conflicto | una sola regla: el estado del buffer |
| El restricción se mueve, las reglas se quedan | los tamaños de lote y cotizaciones antiguos bloquean la siguiente mejora | revisión del paso 5 en cada ciclo |
| Operadores del restricción sin participación | las personas que ven las pérdidas no son consultadas | los operadores son responsables de las causas de pérdida y las contramedidas |

## Críticas y límites de la teoría de restricciones

La TOC tiene resultados sólidos en la práctica y un respaldo más débil en la investigación. Una guía seria debe cubrir ambos aspectos.

### 1. Evidencia: casos de éxito y sesgo de publicación

Mabin y Balderstone analizaron más de 80 aplicaciones exitosas de TOC publicadas y encontraron mejoras operativas y financieras significativas; a pesar de búsquedas exhaustivas, no hallaron informes de fracasos [10]. Eso es una advertencia tanto como un respaldo. Los casos publicados los escriben consultores, proveedores y empresas entusiastas; las implantaciones fallidas rara vez llegan a imprenta. Gupta y Snyder (2009) sostuvieron que la TOC aún no había demostrado su eficacia en la literatura académica y pidieron estudios que vinculen la implantación con el rendimiento financiero, según se resume en Wikipedia [6]. La encuesta de Panizzolo a 61 plantas europeas encontró que algunas prácticas de TOC, especialmente DBR, los no restricciones con capacidad excedente y un programa maestro basado en restricciones, se vinculaban a un mejor rendimiento, pero los resultados variaban según el país y dependían de las valoraciones propias de los directivos [11].

### 2. Optimalidad e investigación en programación

Los investigadores de operaciones han criticado las heurísticas de la TOC por no ser óptimas. Trietsch sostuvo que DBR es inferior a métodos competidores, y Linhares (2009) sostuvo que la regla de mezcla de productos de la TOC (ordenar por throughput por unidad de restricción) no puede garantizar resultados óptimos en general, porque el problema de mezcla de productos con varias restricciones es computacionalmente difícil [6]. La lección práctica: la regla "T por minuto de restricción" es fiable con una única restricción clara. Con dos o más restricciones que interactúan, utilice programación lineal o un APS.

### 3. Originalidad

Los críticos han señalado que muchas ideas de la TOC existían antes: el margen de contribución por factor limitante en la contabilidad de gestión (Noreen, Smith y Mackey, 1995), elementos de la dinámica de sistemas y del control estadístico de procesos, PERT/CPM en la gestión de proyectos [6]. El propio Goldratt reconoció trabajos anteriores, en particular el Sistema de Producción Toyota y las ideas de flujo de Ford, en su artículo de 2009 "Standing on the Shoulders of Giants" [6]. Para un profesional, la originalidad importa menos que si la combinación funciona; para un estudiante, conviene saber de dónde procede cada pieza.

### 4. Personas y políticas

Nave (2002) sostuvo que la TOC tiende a ignorar a los empleados y no trata las políticas que fracasan como restricciones, según se resume en Wikipedia [6]. En la práctica, el riesgo es que "subordinar" se interprete como "obedecer", y que los operarios de la restricción soporten toda la presión. La sección 20 aborda este punto.

### 5. Dónde encaja peor la TOC

- **Líneas equilibradas y con cadencia**, con takt y poca variabilidad: la propia línea es la restricción, y el equilibrado de líneas de Lean es la herramienta más adecuada.
- **Cuellos de botella muy cambiantes** en talleres de alta mezcla: resulta difícil definir un único tambor. S-DBR, el control de carga de trabajo o un APS encajan mejor.
- **Plantas donde el mercado es la restricción** durante años: el DBR interno aporta poco; la palanca está en ventas, plazo de entrega y diseño de ofertas.
- **Madurez de medición:** la contabilidad de throughput requiere un equipo financiero dispuesto a mantener una segunda visión. Sin ella, las decisiones vuelven al coste estándar.

### 6. Contexto comercial

Gran parte de la literatura sobre TOC la publica North River Press y consultoras fundadas por Goldratt o por sus colaboradores. Eso no la hace errónea, pero significa que muchas fuentes no son independientes. Esta guía utiliza fuentes revisadas por pares cuando existen y etiqueta como tales las afirmaciones de profesionales (como la cifra de "30 por ciento de capacidad oculta" del TOC Institute) [4].

## Personas y seguridad en la restricción

La TOC puede mejorar o empeorar el trabajo de las personas que están en la restricción. El método en sí es neutro; lo que decide es la forma en que se introduce.

### Lo primero que notan los operarios

- **Más atención:** los gerentes de pronto se preocupan por cada minuto en una sola máquina. Eso puede sentirse como control. Explique el porqué y deje que los operarios registren las pérdidas por sí mismos.
- **Descansos:** "cubrir descansos" significa que un operario de relevo maneja la máquina, nunca que las personas se salten sus descansos.
- **Tiempo ocioso en otras áreas:** los operarios en áreas que no son la restricción pueden preocuparse por su empleo cuando se les dice que no construyan inventario. Aclare que la capacidad sobrante es intencional y úsela para formación, mejora de preparaciones, 5S, polivalencia para la restricción y trabajo de calidad.
- **Reconocimiento:** las mejoras del equipo de la restricción (como el cambio de herramental de 30 a 18 minutos) deben ser visibles en el tablero, con los nombres si ellos están de acuerdo.

### Las reglas de seguridad no se doblan por la restricción

La presión por mantener en marcha la restricción nunca debe llevar a atajos en seguridad. El mantenimiento y las reparaciones en máquinas donde una energización inesperada pueda lesionar a las personas están sujetos a la norma de OSHA sobre control de energía peligrosa (bloqueo/etiquetado, 29 CFR 1910.147) [25]. Los cambios de herramental más rápidos deben diseñarse dentro del procedimiento (fijaciones de liberación rápida, herramientas preajustadas, material preparado por etapas), no lograrse omitiendo el bloqueo. Lo mismo aplica a protecciones y ergonomía: un operario de relevo necesita la misma formación y calificación que el operario habitual.

### Contexto sindical y laboral

En plantas sindicalizadas, los descansos escalonados, los operarios de relevo, los turnos de sábado y los cambios en la medición suelen afectar al convenio colectivo. Incorpore al sindicato o a los representantes de los empleados durante la fase 0 de la hoja de ruta, explique el objetivo y acuerden cómo se asignan las horas extra y los roles de relevo. Una implantación de la TOC que empiece con una queja sobre los horarios de descanso pierde meses.

### Respeto por las personas en términos de la TOC

La nube evaporante (Sección 12) es una herramienta práctica de respeto por las personas: parte de que ambas partes de un conflicto tienen una necesidad legítima y busca la suposición errónea que hay detrás del conflicto. Usada en un equipo que incluye a operarios, convierte "operarios contra planificadores" en un problema compartido con un objetivo compartido.

## TOC en la planta digital: datos, simulación y APS

La TOC nació con el software: OPT fue un programa de programación antes de ser una filosofía [3]. Hoy en día, las herramientas digitales ayudan en cuatro ámbitos.

### 1. Datos para la detección de cuellos de botella

Las plataformas MES e IIoT proporcionan los estados de máquina con marca de tiempo que necesita el método de períodos activos (Sección 6). La mayoría de las plantas ya dispone de los estados (en marcha, parada, avería, preparación), pero no separa "sin material" y "bloqueada" de "parada". Añadir esos dos estados suele ser el cambio individual más útil para el análisis TOC. Acuerde con los operarios y, cuando corresponda, con el comité de empresa que los datos de estado de las máquinas se usan para detectar pérdidas del sistema, no para evaluar a personas concretas. Recopile los datos de forma de solo lectura desde los controles y mantenga segmentada la red OT; la guía [ciberseguridad OT e ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) explica cómo. Compruebe que los relojes estén sincronizados entre las máquinas, porque el método de períodos activos compara marcas de tiempo entre recursos. Las guías [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) y [mantenimiento predictivo e IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/) explican el camino de los datos; la guía [TI de fabricación con Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) cubre la analítica en la nube para estos datos.

### 2. Simulación para cuellos de botella desplazados y dimensionamiento de buffers

Una simulación de eventos discretos permite probar tamaños de buffer, reglas de liberación y opciones de elevación antes de cambiar la planta. Roser, Nakano y Tanaka desarrollaron el método de períodos activos con datos de simulación [13][14]. Preguntas típicas: ¿con qué frecuencia cambia el cuello de botella con la mezcla del próximo trimestre? ¿Qué tamaño debe tener el buffer de la restricción para que la proporción de pedidos urgentes se mantenga por debajo del 10 por ciento? ¿Una segunda máquina traslada la restricción al montaje? La guía [gemelo digital en la fabricación](https://www.m365.fm/en/learn/digital-twin-manufacturing/) explica cuándo un modelo de simulación se convierte en gemelo digital.

### 3. APS para la programación con tambor

Un APS puede programar el tambor con preparaciones dependientes de la secuencia, calcular las fechas de liberación a partir de los buffers y mostrar el estado de los buffers. DBR aporta la lógica de control; el APS aporta la capacidad de cálculo, especialmente cuando la restricción se desplaza o cuando varias restricciones interactúan (donde la regla simple de mezcla de productos falla, véase la Sección 19). La guía [programación de la producción y APS](https://www.m365.fm/en/learn/production-scheduling-aps/) lo trata en profundidad, incluido cuándo basta con el ERP.

### 4. Modelos de flujo de valor para la visión del sistema

Un modelo digital del flujo de valor muestra la restricción en el contexto de todo el flujo: tiempos de ciclo, disponibilidad, tamaños de lote e inventarios. Un ejemplo de este tipo de software es iFAKT Polaris, que combina el modelado del flujo de valor con la simulación; según el proveedor, sus módulos incluyen la optimización de la programación [26]. Se trata de una descripción del proveedor, no de una prueba independiente. **Nota: El autor trabaja en iFAKT GmbH.** La guía [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) lo describe con más detalle; otras herramientas de flujo de valor y simulación pueden realizar el mismo análisis TOC.

### Secuencia: primero el método, después el software

Empiece el registro de pérdidas por restricción y el tablero de buffers en papel o en una hoja de cálculo. Automatice cuando el método funcione y la gente confíe en los números. Una pantalla de estado de buffers que nadie utiliza es peor que una pizarra que guía la reunión diaria.

## Glosario

| Término | Definición |
|---|---|
| Período activo | un tramo ininterrumpido de estados activos de un recurso; base del método del período activo [13] |
| Método del período activo | método de detección de cuellos de botella: en cualquier momento, el recurso con el período activo ininterrumpido más largo es el cuello de botella [13][14] |
| Buffer de ensamblaje | buffer de tiempo que hace que las piezas que no son restricciones esperen en el ensamblaje a la pieza restrictiva |
| Cuello de botella | un recurso cuya capacidad es inferior a la demanda que se le impone |
| Recorrido del cuello de botella | método de piso de planta que consiste en anotar los estados de trabajo, falta de material y bloqueo en recorridos repetidos [15] |
| Gestión de buffers | seguimiento del consumo de buffers por zonas de color para fijar prioridades y encontrar las causas de mejora [9] |
| Penetración del buffer | proporción de un buffer de tiempo ya consumida |
| Recurso restringido por capacidad (CCR) | recurso que está cerca de su capacidad y puede convertirse en la restricción si no se gestiona |
| Restricción | cualquier cosa que limite el desempeño de un sistema hacia su meta |
| Buffer de restricción | buffer de tiempo delante de la restricción |
| CONWIP | work in process constante; sistema pull que limita el WIP total de una línea [23] |
| Cadena crítica | la cadena más larga de tareas dependientes, considerando las dependencias de tareas y recursos |
| Árbol de realidad actual (CRT) | herramienta del proceso de pensamiento que vincula efectos indeseados con causas raíz |
| Tambor | el programa de la restricción, que marca el ritmo de la planta |
| Tambor-buffer-cuerda (DBR) | método de programación TOC: programar la restricción, protegerla con buffers de tiempo y liberar material a su ritmo [6][8] |
| Elevar | paso 4: añadir capacidad en la restricción |
| Nube que se evapora (EC) | herramienta del proceso de pensamiento para resolver un conflicto cuestionando un supuesto |
| Explotar | paso 2: sacar el máximo partido a la restricción con los recursos existentes |
| Buffer de alimentación | en la cadena crítica, buffer donde una cadena no crítica se une a la cadena crítica |
| Cinco pasos de enfoque | identificar, explotar, subordinar, elevar, prevenir la inercia [4] |
| Árbol de realidad futura (FRT) | herramienta del proceso de pensamiento para probar una solución y sus efectos secundarios |
| Inercia | reglas y hábitos que sobreviven a la restricción para la que se crearon |
| Inventario/inversión (I) | dinero inmovilizado en lo que el sistema pretende vender (y, en la visión amplia, en activos) [20] |
| Ley de Little | WIP = throughput × tiempo de ciclo [16] |
| Gasto operativo (OE) | todo el dinero gastado para convertir el inventario en throughput [20] |
| Carga planificada | en S-DBR, el trabajo comprometido en el CCR expresado en tiempo |
| POOGI | proceso de mejora continua; los cinco pasos de enfoque como ciclo |
| Árbol de prerrequisitos (PRT) | herramienta del proceso de pensamiento que enumera obstáculos y objetivos intermedios |
| Buffer de proyecto | en la cadena crítica, el tiempo de seguridad agregado al final de un proyecto |
| Cuerda | el mecanismo de liberación que vincula la liberación de material con el programa de la restricción |
| S-DBR (tambor-buffer-cuerda simplificado) | variante de DBR con un buffer de expedición y una verificación de carga planificada, para fabricación contra pedido [6][9] |
| Cuello de botella móvil | cuello de botella que se desplaza entre recursos a lo largo del tiempo [14] |
| Buffer de expedición | buffer de tiempo que protege la fecha de entrega |
| Subordinar | paso 3: alinear todos los no restrictivos con la restricción |
| Throughput (T) | ritmo al que el sistema genera dinero mediante las ventas: ventas menos costo verdaderamente variable [20] |
| Contabilidad de throughput | contabilidad de gestión basada en T, I y OE |
| Ratio de contabilidad de throughput (TPAR) | retorno por hora de fábrica ÷ costo por hora de fábrica [19] |
| Árbol de transición (TrT) | herramienta del proceso de pensamiento para la implementación paso a paso |
| TOCICO | Theory of Constraints International Certification Organization, una organización sin fines de lucro de EE. UU. 501(c)(3) [5] |
| Efecto indeseado (UDE) | un efecto negativo observado que se usa como entrada de un árbol de realidad actual |
| VATI | clasificación de plantas según la forma del flujo de material: V, A, T, I [6] |

## FAQ: preguntas sobre la teoría de restricciones

### ¿Qué es la teoría de restricciones en términos simples?

Todo sistema tiene uno o unos pocos eslabones débiles que limitan cuánto puede producir. La teoría de restricciones dice: encuentra ese eslabón débil, saca el máximo provecho de él, alinea todo lo demás con él y solo entonces invierte en él. Fue desarrollada por Eliyahu M. Goldratt y presentada en *The Goal* en 1984 [1].

### ¿Cuáles son los 5 pasos de la teoría de restricciones?

Identificar la restricción, explotar la restricción, subordinar todo lo demás a la restricción, elevar la restricción y evitar que la inercia se convierta en la restricción, y luego volver a empezar [4].

### ¿Cuál es un ejemplo de la teoría de restricciones?

En la planta de colectores de la Sección 5, una celda CNC limitaba la producción. Cubrir las pausas, acelerar los cambios de formato, preparar el material por etapas y adelantar los controles de calidad aumentaron su tiempo productivo en 800 minutos a la semana (22 por ciento), y cambiar la combinación de productos según el throughput por minuto de restricción añadió beneficio sin inversión. Una segunda máquina de 650.000 $ resultó ser la opción más débil.

### ¿Cuál es la diferencia entre un cuello de botella y una restricción?

Un cuello de botella es un recurso con menos capacidad que la demanda que recibe. Una restricción es cualquier cosa que limite el objetivo del sistema: un cuello de botella, pero también el mercado, un material, una política o una mentalidad. Todo cuello de botella que limita la producción es una restricción; no toda restricción es un cuello de botella.

### ¿Cómo se identifica un cuello de botella en un proceso?

Empieza con una tabla de carga de capacidad (demanda × tiempo de proceso frente al tiempo disponible) y luego confírmalo en planta con recuentos de colas y un recorrido de cuellos de botella. Si dispones de estados de máquina con marca de tiempo, usa el método de periodos activos, que además muestra los cuellos de botella desplazados [13][14][15]. La Sección 6 compara seis métodos.

### ¿Qué es el análisis de cuellos de botella?

El análisis de cuellos de botella identifica el recurso que limita un proceso, cuantifica cuánta producción cuesta y comprueba si se desplaza con el tiempo. En una planta, empieza con un cálculo de carga de capacidad, confírmalo con recuentos de colas y un recorrido de cuellos de botella, y utiliza datos de estado de máquina con el método de periodos activos cuando los tengas (Sección 6).

### ¿Cómo se soluciona un cuello de botella?

Sigue los cinco pasos de enfoque. Primero explota el cuello de botella (sin minutos perdidos, sin trabajo defectuoso, con la combinación de productos adecuada), luego subordina el resto de la planta a su ritmo y solo después elévalo con horas extra, subcontratación o nuevos equipos. En el ejemplo de los colectores de la Sección 5, la explotación por sí sola aumentó el tiempo productivo en la restricción un 22 por ciento antes de cualquier inversión.

### ¿Qué son las restricciones de producción?

Cualquier cosa que limite cuánto puede producir y enviar una planta: la capacidad de los equipos, las personas y sus habilidades, los materiales y proveedores, el mercado y las propias políticas de la planta, como las reglas de tamaño de lote o de utilización. Una restricción de producción no siempre es una máquina (Sección 3).

### ¿Cuáles son los cuatro tipos de restricciones?

Las clasificaciones varían. Agrupados en cuatro, los tipos de la Sección 3 son restricciones físicas (equipos, personas, materiales), restricciones de mercado, restricciones de política y restricciones de paradigma. La tabla de la Sección 3 divide el tipo físico en tres, lo que da seis.

### ¿Qué es el drum-buffer-rope?

Drum-buffer-rope es el método de programación de la TOC. El tambor es la programación de la restricción, el buffer es un buffer de tiempo que protege la restricción y la fecha de envío, y la cuerda libera material solo un tiempo de buffer antes de que la restricción lo necesite [6][8]. La Sección 7 muestra un programa de liberación con cifras.

### ¿Qué es el drum-buffer-rope simplificado (S-DBR)?

S-DBR es una variante para plantas de fabricación bajo pedido. Solo utiliza un buffer de envío y comprueba la carga planificada del recurso con restricción de capacidad al prometer las fechas de entrega, en lugar de mantener una programación detallada de la restricción [6][9].

### ¿Qué es la gestión de buffers?

La gestión de buffers controla cuánto del buffer de tiempo de cada pedido se ha consumido y clasifica los pedidos en verde, amarillo o rojo. Los pedidos en rojo tienen prioridad, y las causas de los pedidos en rojo se convierten en la lista de mejoras [9].

### ¿Qué es la contabilidad por throughput?

La contabilidad por throughput es la contabilidad de gestión de la TOC. Utiliza el throughput (ventas menos el coste realmente variable), el inventario o la inversión, y los gastos de explotación; el beneficio neto es T − OE y el ROI es (T − OE) ÷ I [20][22]. Con una restricción, clasifica los productos según el throughput por minuto de restricción.

### ¿En qué se diferencia la contabilidad de throughput de la contabilidad de costes?

La contabilidad de costes estándar reparte la mano de obra y los gastos generales entre las unidades y clasifica los productos según el margen por unidad. La contabilidad de throughput considera la mano de obra y los gastos generales como gasto operativo, que no cambia con cada unidad a corto plazo, y clasifica los productos según el throughput por unidad de tiempo de restricción. Ambas pueden dar respuestas opuestas, como muestra el ejemplo de la Sección 11.

### ¿Cuál es la diferencia entre lean y la teoría de restricciones?

Lean busca desperdicios en toda la cadena de valor y crea flujo y tirón. La TOC busca la única restricción y concentra la mejora en ella. Lean equilibra el trabajo al takt; la TOC mantiene capacidad libre en los no restricciones. Usadas juntas, la TOC indica a herramientas lean como SMED y TPM por dónde empezar.

### ¿Se pueden combinar TOC y Six Sigma?

Sí. La TOC elige el lugar, Six Sigma reduce la variación en ese punto, por ejemplo la chatarra en la restricción o un suministro inestable hacia su buffer. La contabilidad de throughput muestra después el efecto financiero de cada proyecto.

### ¿Cuáles son los procesos de pensamiento en la TOC?

Un conjunto de herramientas lógicas para problemas no físicos: el árbol de realidad actual, la nube evaporante, el árbol de realidad futura, el árbol de prerrequisitos y el árbol de transición. Responden qué cambiar, a qué cambiar y cómo provocar el cambio [12].

### ¿Qué es la gestión de proyectos por cadena crítica?

La aplicación de Goldratt de la TOC a los proyectos, a partir de su libro *Critical Chain* de 1997 [3]. Programa la cadena más larga de dependencias de tareas y recursos, elimina la holgura de cada tarea y la agrupa en buffers de proyecto y de alimentación.

### ¿Qué es la teoría de restricciones en la gestión de la cadena de suministro?

En las cadenas de suministro, la TOC sustituye el stock basado en previsiones en cada ubicación por buffers que se reponen según el consumo real y se redimensionan según su estado [6]. Considera el eslabón más débil, a menudo un proveedor, una planta o el mercado, como la restricción que marca el ritmo de todo el sistema. La Sección 14 resume las reglas de reposición.

### ¿Cuáles son las críticas a la teoría de restricciones?

Las principales críticas son el sesgo de publicación en los estudios de éxito, la falta de optimalidad de las heurísticas de la TOC cuando interactúan varias restricciones, la escasa originalidad de algunas ideas y la tendencia a descuidar a las personas y las políticas [6][10]. La Sección 19 trata cada una de ellas.

### ¿Sigue siendo relevante la teoría de restricciones?

Sí. Las plantas siguen teniendo restricciones, y la combinación de mejores datos de máquinas, simulación y APS facilita encontrar cuellos de botella cambiantes y programar un drum. Lo que ha cambiado es que la TOC rara vez se usa sola; normalmente se combina con lean, Six Sigma y la planificación digital.

### ¿Quién creó la teoría de restricciones?

Eliyahu M. Goldratt (1947 a 2011), físico y autor de negocios israelí. Introdujo la TOC en *The Goal* (1984), escrito junto con Jeff Cox [1][2].

### ¿Cuánto tiempo lleva implantar la teoría de restricciones?

En una planta o una cadena de valor, los primeros resultados medibles suelen llegar con la explotación en pocas semanas, porque requieren poco dinero. Una rutina DBR o S-DBR estable con gestión de buffers requiere varios meses; la hoja de ruta de la Sección 16 prevé seis meses para el primer ciclo completo. Estas duraciones son supuestos de planificación, no referencias de un estudio.

### ¿Existe una certificación en teoría de restricciones?

TOCICO ofrece certificación en tres niveles: exámenes de fundamentos, exámenes de practicante y una evaluación de implementador, en áreas como operaciones, cadena de suministro, gestión de proyectos (CCPM), procesos de pensamiento y finanzas [5].

## Conclusión y primeros pasos

La teoría de restricciones parte de una observación sencilla: la producción de una planta está determinada por un número muy reducido de restricciones, normalmente una sola. Eso cambia lo que deben hacer los directivos. En lugar de mejorar todo a la vez, hay que encontrar la restricción, dejar de desperdiciar su tiempo, hacer que el resto de la planta le dé servicio y gastar dinero solo cuando eso esté hecho. El tambor-amortiguador-cuerda convierte esa lógica en un programa, la gestión de amortiguadores la convierte en prioridades diarias y la contabilidad de throughput la convierte en decisiones financieras que los informes de costes estándar pueden hacer que se tomen mal.

El ejemplo práctico muestra la escala de lo que a menudo es posible sin inversión: un 22 por ciento más de tiempo de restricción gracias a pausas, preparaciones, preparación de material y controles de calidad, y un cambio en la mezcla de productos que la contabilidad de costes estándar no habría sugerido. También muestra los límites: una vez explotada, la restricción se desplaza, y las reglas antiguas se convierten en el siguiente problema. La TOC funciona mejor con una restricción clara y necesita otras herramientas (optimización, APS, equilibrado de líneas lean) cuando las restricciones se desplazan o interactúan. La base de evidencia consiste sobre todo en casos de éxito, así que pruebe las afirmaciones en su propia planta.

**Sus primeros pasos en los próximos 30 días**

- [ ] Elabore una tabla de carga para su principal familia de productos (demanda × tiempo de proceso frente al tiempo disponible) e identifique el candidato a restricción
- [ ] Confírmelo con recuentos de colas y tres recorridos de cuellos de botella por turno durante una semana
- [ ] Inicie un registro de pérdidas de la restricción (Plantilla 2) en el candidato y complételo en cada turno durante dos semanas
- [ ] Calcule el throughput por minuto de restricción para sus 10 principales productos (Plantilla 3) junto con su controller
- [ ] Elija las dos mayores pérdidas y actúe sobre ellas (cobertura de pausas, preparación externa, calidad antes de la restricción)
- [ ] Deje de aplicar al menos un objetivo de utilización en un puesto que no sea la restricción
- [ ] Informe a los representantes sindicales o de los empleados sobre los objetivos, la cobertura de pausas y el papel de la capacidad excedente
- [ ] Pregunte a TI si los datos de las máquinas pueden distinguir entre "sin material" y "bloqueado" frente a "inactivo" para el método de periodos activos
- [ ] Celebre una reunión diaria de 10 minutos en la restricción (Plantilla 8)

---

## Más lectura en m365.fm

**Guías relacionadas**
- [Programación de producción y APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [KPI de fabricación](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Excelencia operacional](https://www.m365.fm/en/learn/operational-excellence/)
- [Gestión de planta y Gemba walks](https://www.m365.fm/en/learn/shop-floor-management/)
- [Gemelo digital en fabricación](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [TI de fabricación con Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Planificación de producción aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

**Nuevas guías de esta serie**
- [SMED y reducción de cambios de formato](https://www.m365.fm/en/learn/smed-changeover-reduction/)
- [TPM y OEE](https://www.m365.fm/en/learn/tpm-oee/)
- [Kanban y sistemas pull](https://www.m365.fm/en/learn/kanban-pull-system/)
- [Six Sigma y análisis de causa raíz](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/)
- [S&OP, MRP y planificación de producción](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)
- [Mantenimiento predictivo e IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/)
- [Simulación de fabricación](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)
- [Dimensionamiento de lotes](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Gestión de inventario en fabricación](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)

**Términos del glosario (entidades)**
[Teoría de restricciones](https://www.m365.fm/entity/theory-of-constraints/) · [Programación basada en restricciones](https://www.m365.fm/entity/constraint-based-scheduling/) · [Gestión de amortiguadores](https://www.m365.fm/entity/buffer-management/) · [Takt time](https://www.m365.fm/entity/takt-time/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) · [SMED](https://www.m365.fm/entity/smed/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Sistema pull](https://www.m365.fm/entity/pull-system/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** es el anfitrión de m365.fm y trabaja en iFAKT GmbH. En m365.fm escribe sobre manufactura esbelta, excelencia operacional, planificación de la producción y la transformación digital de la producción, con énfasis en cómo los modelos de flujo de valor, la simulación y el análisis de KPI ayudan a las plantas a identificar y gestionar sus restricciones.

**Nota: El autor trabaja en iFAKT GmbH.**

# Sources

All online sources accessed November 20, 2026. Sources marked (S) were taken over from the source list of the related guide *Production Scheduling and APS* (`production-scheduling-aps.md`), where they were verified on the same date; they could not be re-fetched in this session because the shared web search and fetch budget ran out.

1. Goldratt, Eliyahu M.; Cox, Jeff: The Goal: Excellence in Manufacturing. North River Press, Croton-on-Hudson (NY) 1984, 262 pp., ISBN 978-0-88427-060-7, LCCN 85021827. Catalog record: Open Library. https://openlibrary.org/books/OL2540561M/The_goal
2. North River Press: Eliyahu M. Goldratt, Renowned Business Guru and Author of International Best Selling Business Novel The Goal, Dies at Age 64. Press release via PR Newswire, June 14, 2011. https://prnewswire.com/news-releases/eliyahu-m-goldratt-renowned-business-guru-and-author-of-international-best-selling-business-novel-the-goal-dies-at-age-64-123796619.html
3. Eliyahu M. Goldratt (biography, Creative Output and OPT, Avraham Y. Goldratt Institute, bibliography with years). Wikipedia. https://en.wikipedia.org/wiki/Eliyahu_M._Goldratt
4. Theory of Constraints Institute: Five Focusing Steps. https://www.tocinstitute.org/five-focusing-steps.html (and the overview page https://www.tocinstitute.org/theory-of-constraints.html)
5. Theory of Constraints International Certification Organization (TOCICO): About us (501(c)(3) status, certification levels, TOC Innovation Summit). https://www.tocico.org/about-us
6. Theory of constraints (five focusing steps, buffers and buffer management, DBR and S-DBR, VATI, throughput accounting, critical chain, criticism section citing Trietsch, Linhares 2009, Noreen/Smith/Mackey 1995, Gupta/Snyder 2009, Nave 2002 and Goldratt 2009). Wikipedia. https://en.wikipedia.org/wiki/Theory_of_constraints
7. The Goal (novel) (editions, characters, Time 2011 list citing Rawlings, N.: The 25 Most Influential Business Management Books, Time, August 9, 2011). Wikipedia. https://en.wikipedia.org/wiki/The_Goal_(novel)
8. (S) Goldratt, Eliyahu M.; Fox, Robert E.: The Race. North River Press 1986, 179 pp., ISBN 0-88427-062-9. Reference: https://buresund.nu/books/the-race
9. (S) Cox, James F. III; Schleier, John G. (eds.): Theory of Constraints Handbook. McGraw-Hill, New York 2010, ISBN 978-0-07-166554-4; ch. 8: Srikanth, M. L.: DBR, Buffer Management, and VATI Flow Classification; ch. 9: From DBR to Simplified-DBR for Make-to-Order. Chapter reference: https://www.toc-goldratt.com/en/product/dbr-buffer-management-and-vati-flow-classification-chapter-8-of-the-theory-of-constraints-handbook
10. Mabin, Victoria J.; Balderstone, Steven J.: The performance of the theory of constraints methodology: Analysis and discussion of successful TOC applications. International Journal of Operations & Production Management 23 (2003) 6, pp. 568–595. DOI: 10.1108/01443570310476636. https://www.emeraldinsight.com/doi/abs/10.1108/01443570310476636
11. Panizzolo, Roberto: Theory of Constraints (TOC) Production and Manufacturing Performance. International Journal of Industrial Engineering and Management 7 (2016) 1, pp. 15–23. https://www.research.unipd.it/retrieve/e14fb26b-f0bc-3de1-e053-1705fe0ac030/ijiem_vol7_no1_3.pdf
12. Kim, Sanghyun; Mabin, Victoria J.; Davies, John: The theory of constraints thinking processes: retrospect and prospect. International Journal of Operations & Production Management 28 (2008) 2, pp. 155–184. DOI: 10.1108/01443570810846883
13. Roser, Christoph; Nakano, Masaru; Tanaka, Minoru: A Practical Bottleneck Detection Method. In: Peters, B. A.; Smith, J. S.; Medeiros, D. J.; Rohrer, M. W. (eds.): Proceedings of the 2001 Winter Simulation Conference, pp. 949–953. https://informs-sim.org/wsc01papers/126.PDF
14. Roser, Christoph; Nakano, Masaru; Tanaka, Minoru: Shifting Bottleneck Detection. In: Yücesan, E.; Chen, C.-H.; Snowdon, J. L.; Charnes, J. M. (eds.): Proceedings of the 2002 Winter Simulation Conference, pp. 1079–1086. https://www.informs-sim.org/wsc02papers/145.pdf
15. Roser, Christoph: Mathematically Accurate Bottleneck Detection 2 – The Active Period Method. AllAboutLean.com, June 29, 2014 (updated May 13, 2026). https://www.allaboutlean.com/active-period-method
16. Little, John D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (1961) 3, pp. 383–387. DOI: 10.1287/opre.9.3.383 (bibliographic data confirmed via Crossref, November 20, 2026)
17. (S) Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337
18. (S) Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society 57 (1961) 4, pp. 902–904. DOI: 10.1017/S0305004100036094
19. ACCA (Performance Management examining team): Throughput accounting and the theory of constraints, part 2. Association of Chartered Certified Accountants, technical article. https://www.accaglobal.com/us/en/student/exam-support-resources/fundamentals-exams-study-resources/f5/technical-articles/throughput-constraints2.html
20. Murphy, Sean: Summary of Goldratt, E. M.: The Haystack Syndrome: Sifting Information Out of the Data Ocean. North River Press, New York 1990. Management and Accounting Web (MAAW, J. R. Martin). https://maaw.info/ArticleSummaries/ArtSumHaystackSyndrome90.htm
21. Corbett, Thomas: Throughput Accounting. North River Press, 174 pp., ISBN 978-0-88427-158-1 (retailer listing dated January 1, 1999; publisher page: https://www.toc-goldratt.com/en/product/Throughput-Accounting). Listing: https://www.booktopia.com.au/throughput-accounting-thomas-corbett/book/9780884271581.html
22. Theory of Constraints (TOC): throughput accounting measures, derived measures and decision priority. Lean Production (Vorne Industries). https://www.leanproduction.com/theory-of-constraints/
23. (S) Spearman, Mark L.; Woodruff, David L.; Hopp, Wallace J.: CONWIP: a pull alternative to kanban. International Journal of Production Research 28 (1990) 5, pp. 879–894. DOI: 10.1080/00207549008942761
24. Gray, Virginia; Felan, Joe; Umble, Elisabeth; Umble, Michael: A comparison of drum-buffer-rope (DBR) and critical chain (CC) buffering techniques. Paper presented at PMI Research Conference 2000, Paris. Project Management Institute. https://www.pmi.org/learning/library/drum-buffer-rope-critical-chain-buffering-8526
25. Occupational Safety and Health Administration (OSHA): 29 CFR 1910.147, The control of hazardous energy (lockout/tagout). US Department of Labor. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.147
26. iFAKT GmbH: Polaris Optimizer (vendor page; site navigation also lists Simulator and Value Stream Mapping). https://www.ifakt.de/en/solutions/optimizer
27. National Institute of Standards and Technology (NIST): Malcolm Baldrige National Quality Award 1988 recipient profile, Motorola Inc. ("Six Sigma Quality"). https://www.nist.gov/system/files/documents/2017/10/11/1988_Motorola_Inc.pdf
28. PwC Viewpoint: Inventory guide, section 1.3 Cost (definition of inventory cost as the sum of applicable expenditures and charges directly or indirectly incurred; references ASC 330-10-30-3 to 30-8). https://viewpoint.pwc.com/dt/us/en/pwc/accounting_guides/inventory/Inventory-Guide/Chapter-1-Inventory-costing/1_3_Cost.html (accessed November 20, 2026)
29. RSM US LLP: Inventory valuation considerations in the forecasted economy, April 2023 (fixed production overhead allocated based on normal capacity; ASC 330-10-30-6 on abnormally low production). https://rsmus.com/content/dam/rsm/insights/financial-reporting/1pdf/Inventory-valuation-considerations-in-the-forecasted-economy.pdf (accessed November 20, 2026)
