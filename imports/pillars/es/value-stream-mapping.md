# SEO metadata

| Field | Value |
|---|---|
| Meta title | Mapeo de la cadena de valor: símbolos, métricas y ejemplo |
| Meta description | Mapeo de la cadena de valor (VSM) paso a paso: símbolos, fórmulas de takt time y lead time, un ejemplo completamente calculado, diseño del estado futuro y software VSM. |
| Slug | `value-stream-mapping` |

# Mapeo de la cadena de valor: guía completa sobre símbolos VSM, métricas, diseño del estado futuro y gestión de la cadena de valor

> **Respuesta breve:** El mapeo de la cadena de valor (VSM, por sus siglas en inglés) es un método Lean para dibujar el flujo de material e información de una familia de productos, desde el proveedor hasta el cliente, en una sola página con símbolos estándar. Una línea de tiempo con el lead time, el tiempo de procesamiento y los días de inventario muestra lo poco que de ese tiempo total aporta valor. Un mapa del estado futuro diseña entonces un flujo más esbelto, y un plan de implementación lo hace realidad.

En muchas plantas un pedido permanece en la fábrica tres o cuatro semanas, mientras que el trabajo real sobre él suma apenas unos minutos. La Wikipedia en alemán ofrece un caso típico: cuatro semanas de lead time frente a diez minutos de tiempo de procesamiento puro [27]. Si solo se observan máquinas individuales, nunca se ve esa brecha. El mapeo de la cadena de valor obliga a mirar el flujo completo: ¿dónde se detiene el material?, ¿por qué se detiene allí?, ¿quién le indica a cada proceso qué producir y cuándo?

Esta guía explica el método desde cero. Incluye el conjunto completo de símbolos, una guía paso a paso, todas las métricas importantes con su fórmula y un ejemplo completamente calculado, las pautas de diseño para el estado futuro, los límites del método en papel, el mapeo de la cadena de valor dinámico y digital, el Value Stream 4.0, la gestión de la cadena de valor como tarea de liderazgo y una visión neutral de las categorías de software. Para una definición compacta, véase la página de entidad de m365.fm [Value Stream Mapping](https://www.m365.fm/entity/value-stream-mapping/).

Una nota sobre las fuentes: el mapeo de la cadena de valor (en alemán: *Wertstromanalyse*) tiene una fuerte tradición investigadora en Alemania, en Fraunhofer IPA y en la TU Darmstadt, entre otros. Cuando una fuente alemana aporta algo que falta en la literatura en inglés, se mantiene en el texto con una breve explicación.

### Puntos clave

- El mapeo de la cadena de valor siempre analiza una **familia de productos** y el flujo completo de puerta a puerta, no máquinas aisladas ni departamentos.
- Se dibuja **desde el cliente hacia atrás**, aguas arriba, con lápiz, en la planta, en el gemba (japonés para "el lugar real", aquí el piso de producción).
- Las métricas centrales son **takt time, cycle time, días de inventario, lead time y la razón de flujo** (también llamada eficiencia del proceso o razón de actividad). Los días de inventario se derivan de la Ley de Little: inventario dividido por demanda.
- El mapa del estado actual es solo la mitad del método. Los resultados llegan con el **mapa del estado futuro**, construido con pautas de diseño claras, y con un **plan de implementación** con responsables y fechas.
- El mapa clásico es una **fotografía** basada en promedios. Con alta variedad de productos y demanda volátil, la simulación dinámica y los datos recolectados automáticamente amplían el análisis.
- La **gestión de la cadena de valor** convierte un taller puntual en una tarea de liderazgo permanente, con un responsable de la cadena de valor que rinde cuentas.

### Rutas de lectura para lectores con poco tiempo

| Usted es … | Lea primero |
|---|---|
| Nuevo en Lean, o estudiante | Secciones 1 a 4 (definición, historia, objetivos, símbolos) |
| Facilitador por primera vez o coach Lean | Secciones 5 a 8 (guía paso a paso con agenda del taller, métricas, ejemplo y diseño del estado futuro) y 14 (errores comunes) |
| Gerente de planta o líder de operaciones | Sección 7 (ejemplo con cifras del estado actual y futuro), secciones 10 a 13 (límites, mapeo dinámico y digital, Value Stream 4.0, gestión de la cadena de valor) |
| Responsable de TI, MES o Microsoft 365/Azure | Secciones 11 (mapeo dinámico y digital), 12 (Value Stream 4.0) y 15 (categorías de software) |

## Índice

1. ¿Qué es el Value Stream Mapping? Definición y diferencias con el mapeo de procesos
2. Historia: del diagrama de flujo de material e información de Toyota a "Learning to See"
3. Objetivos y beneficios del Value Stream Mapping
4. Símbolos del Value Stream Mapping: tabla de referencia completa
5. Cómo crear un mapa de flujo de valor: guía paso a paso del estado actual
6. Métricas y fórmulas del Value Stream Mapping
7. Ejemplo de Value Stream Mapping: un flujo de valor completamente calculado
8. Mapeo del estado futuro: pautas de diseño de Rother/Shook y Erlach
9. Encontrar el desperdicio: los 8 desperdicios y el diagrama de espagueti
10. Límites del Value Stream Mapping tradicional
11. Value Stream Mapping dinámico y digital
12. Value Stream 4.0: la logística de la información como segunda dimensión
13. Value Stream Management: dirigir el flujo de valor como tarea de liderazgo
14. Errores habituales en el Value Stream Mapping y cómo evitarlos
15. Software de Value Stream Mapping: categorías comparadas
16. Value Stream Mapping digital con iFAKT Polaris VSM y BSM
17. Value Stream Management en el desarrollo de software: en qué se diferencia
18. Evidencia y publicaciones de investigación
19. Preguntas frecuentes sobre el Value Stream Mapping
20. Conclusión

## 1. ¿Qué es el Value Stream Mapping? Definición y diferencias con el mapeo de procesos

El Lean Enterprise Institute (LEI) define el value stream mapping como "representar gráficamente cada paso de los flujos de material e información necesarios para llevar un producto desde el pedido hasta la entrega" [45]. ASQ lo describe como "una herramienta lean que emplea un diagrama de flujo que documenta cada paso del proceso" [46]. Dicho con más precisión: para una familia de productos, un mapa de flujo de valor muestra cada actividad necesaria para llevar un producto desde la materia prima hasta el cliente. Incluye las actividades que aportan valor y las que no, el flujo físico de material y el flujo de información que lo controla. El resultado cabe en una hoja grande, normalmente de 11 × 17 in (tabloide, cercano al formato A3 usado en Europa), y se dibuja con símbolos estándar.

El **flujo de valor** es el conjunto de esas actividades. En inglés, "value stream mapping" y "VSM" son los términos estándar; "value stream analysis" también se usa, sobre todo para el trabajo sobre el estado actual. Klaus Erlach, del Instituto Fraunhofer de Ingeniería de Fabricación y Automatización IPA en Stuttgart, establece una distinción clara entre **análisis del flujo de valor** (registro y evaluación del estado actual) y **diseño del flujo de valor** (diseño del estado futuro) [3][4]. Juntos forman el método del flujo de valor. La asociación alemana de ingeniería industrial REFA define el análisis en términos similares, como un método para mostrar todos los procesos y flujos de un proceso que aporta valor [37].

Desde marzo de 2020 existe una norma internacional, **ISO 22468:2020 "Value stream management (VSM)"**. ISO la describe como directrices para recopilar, evaluar y mejorar continuamente los datos del flujo de valor y para evaluar los flujos de valor con KPI definidos, aplicables a procesos relacionados con materiales, energía y datos [40]. El índice (publicado por DIN, el organismo de normalización alemán) estructura la gestión del flujo de valor en procedimiento básico, análisis del flujo de valor, diseño del flujo de valor, planificación del flujo de valor, y evaluación y ajuste de los flujos de valor, con un anexo informativo sobre cajas de datos y ejemplos de aplicación [40]. ISO confirmó que la norma sigue vigente en su revisión de 2025 [40]. Es una referencia útil si quiere anclar el método en un sistema de producción de toda la empresa.

### Diferencias de VSM con métodos relacionados

| Método | Enfoque | Diferencia con el value stream mapping |
|---|---|---|
| Mapeo de procesos / diagrama de flujo | procedimientos individuales, a menudo dentro de un departamento | no incluye flujo de información, inventario ni línea de tiempo |
| Análisis de flujo de material | rutas de transporte, cantidades, distribución en planta | se centra en la logística, no en cómo la información controla el flujo |
| Análisis de valor / ingeniería de valor (en Alemania: VDI 2800) | funciones y coste de un producto | relacionado con el producto, no con el flujo |
| Cadena de valor de Porter | actividades estratégicas de una empresa | modelo de gestión, no un diagrama de flujo operativo; la Wikipedia en inglés hace la misma distinción [49] |
| Diagrama de calles (swimlane) / BPMN | procesos de negocio con responsabilidades | sólido en oficina, más débil en inventario y takt |
| Simulación | comportamiento de un sistema en función del tiempo | dinámica y detallada, pero con más esfuerzo; complementa el VSM (véase la sección 11) |

Lo que hace diferente al mapeo de la cadena de valor es la combinación de tres elementos en una sola página: el flujo de material, el flujo de información y una línea de tiempo. La introducción de *Learning to See* explica que Toyota enseña tres flujos en la manufactura (material, información y personas/proceso) y que el método de mapeo cubre los dos primeros para que los fabricantes "piensen en términos de flujo en lugar de procesos de producción discretos" [1].

## 2. Historia: del diagrama de flujo de material e información de Toyota a "Learning to See"

El mapeo de la cadena de valor proviene del Sistema de Producción Toyota. En Toyota, la herramienta se llama "Mapeo de flujo de material e información". Los practicantes de Toyota la usaban para representar los estados actual y futuro al planificar implementaciones de Lean, no como herramienta de formación [1]. La expresión "cadena de valor" en sí rara vez se escucha en Toyota [1]. El glosario de LEI también describe la herramienta como un desarrollo de Toyota que esta denomina diagrama de flujo de material e información [45].

Mike Rother identificó el método de mapeo mientras estudiaba las prácticas de implementación de Lean de Toyota, lo formalizó y construyó en torno a él un método de capacitación [1]. Junto con John Shook, quien había trabajado once años con Toyota en Japón y Estados Unidos [1], publicó en 1998 el cuaderno de trabajo **"Learning to See"** con LEI (la introducción está firmada en Ann Arbor, Michigan, y fechada en mayo de 1998; el subtítulo de la primera edición era "Value Stream Mapping to Create Value and Eliminate Muda", el actual dice "… to Add Value and Eliminate Muda") [1]. El libro recibió el premio Shingo de Publicaciones de Investigación y Profesionales en 1999 [1]. Su estudio de caso sobre la planta ficticia de estampado "Acme Stamping" lleva al lector desde el estado actual, pasando por la búsqueda de desperdicios, hasta el estado futuro [1]. La edición actual de LEI está fechada en 2018 (ISBN 978-0-9667843-0-5, 148 páginas) [1].

En los países de habla alemana, tres libros dieron forma a la difusión del método; uno de ellos apareció más tarde en inglés:

- **Rother/Shook: "Sehen lernen"**, la edición alemana del cuaderno de trabajo de LEI, publicada por el Lean Management Institut en Aquisgrán (versión 1.1, 2004, ISBN 978-3-9809521-1-8) [2].
- **Klaus Erlach: "Wertstromdesign. Der Weg zur schlanken Fabrik"** (Springer; 1.ª ed. 2007, 2.ª ed. 2010, ISBN 978-3-540-89867-2; 3.ª ed. 2020, ISBN 978-3-662-58906-9) [3]. Erlach sistematiza el método para la planificación de fábricas. Una edición en inglés, **"Value Stream Design: The Way Towards a Lean Factory"**, apareció con Springer en 2012 (copyright 2013, ISBN 978-3-642-12568-3) [4].
- **Thomas Klevers: "Wertstrom-Mapping und Wertstrom-Design"** (mi-Fachverlag, Landsberg am Lech 2007, ISBN 978-3-636-03097-9) [5].

El método se trasladó más tarde al trabajo de oficina y al trabajo del conocimiento, sobre todo mediante Karen Martin y Mike Osterling en "Value Stream Mapping: How to Visualize Work and Align Leadership for Organizational Transformation" (McGraw-Hill, publicado en octubre de 2013, copyright 2014, ISBN 978-0-07-182891-8) [6].

En Estados Unidos, el método forma parte del conjunto estándar de herramientas Lean que enseñan LEI, ASQ y el Programa de Socios de Extensión Manufacturera (MEP) del NIST. El NIST MEP llama al VSM "a menudo el primer paso para aplicar mejoras de procesos lean" [47]. En Alemania, forma parte de los llamados sistemas de producción integrales, cuyos fundamentos se describen en la directriz **VDI 2870 Parte 1** (julio de 2012) de la Asociación de Ingenieros Alemanes (VDI). Según el VDI, la directriz sigue vigente en parte y está en revisión [7].

## 3. Objetivos y beneficios del mapeo de la cadena de valor

El objetivo general es un flujo alineado con el cliente: el material debe recorrer la planta con la menor espera posible, y cada proceso debe fabricar solo lo que el siguiente proceso realmente necesita. De ello se derivan objetivos concretos:

- **Reducir el lead time.** La línea de tiempo muestra qué parte del lead time total es espera. Como el inventario suele explicar la mayor parte del lead time, reducirlo es la palanca más potente.
- **Hacer visible el desperdicio.** La sobreproducción, el inventario, la espera y el transporte innecesario aparecen directamente en el mapa.
- **Simplificar la programación.** El mapa muestra a cuántos puntos envía el sistema ERP órdenes. El objetivo es programar en un solo punto siempre que sea posible.
- **Crear un lenguaje común.** Producción, logística, planificación y ventas discuten el mismo flujo en la misma hoja.
- **Priorizar mejoras.** En lugar de optimización local, se obtiene un plan de implementación orientado al flujo completo.

### ¿Cuándo vale la pena el mapeo de la cadena de valor?

El método encaja mejor en la producción repetitiva y de modelos mixtos con productos recurrentes, inventario elevado y plazos de entrega largos; antes de cambios de layout, nuevos diseños de planta o inversiones en capacidad; cuando la entrega a tiempo es deficiente a pesar de una alta utilización; y como punto de partida de un programa Lean. La forma clásica encaja menos bien en la producción de taller (job shop) o de ingeniería por pedido con rutas cambiantes, porque allí es difícil definir una familia de productos estable. Los enfoques ampliados, como la simulación o el análisis basado en datos, ayudan en esos casos (ver sección 11). Los fabricantes estadounidenses pequeños y medianos que quieran facilitación externa pueden acudir a los NIST MEP Centers, que incluyen el mapeo de la cadena de valor entre los métodos Lean que ayudan a aplicar [47].

### Ventajas y desventajas de un vistazo

| Ventajas | Desventajas |
|---|---|
| visión integral del flujo desde la perspectiva del cliente | instantánea basada en promedios |
| símbolos simples y estándar | poco detalle sobre variantes y secuencias de cambio |
| baja barrera de entrada: papel, lápiz, cronómetro | la recopilación manual de datos lleva tiempo y pierde vigencia rápidamente |
| resultados cuantitativos (lead time, índice de flujo) | no se muestran la variabilidad, las averías ni los efectos del tamaño de lote |
| conecta el flujo de material con el flujo de información | los estados futuros no pueden probarse sobre el papel |
| base sólida para acciones de mejora y comunicación | el impacto depende de una implementación disciplinada |

La columna de la derecha es la razón por la que la investigación y la industria llevan más de diez años extendiendo el método hacia direcciones dinámicas y digitales [16][23]. Más sobre ello a partir de la sección 10.

## 4. Símbolos del mapa de flujo de valor: tabla de referencia completa

Los símbolos provienen de *Learning to See* [1][2] y son deliberadamente sencillos para que cualquiera pueda dibujarlos con un lápiz. Los libros y las bibliotecas de software difieren ligeramente. Lo importante es que su equipo acuerde una leyenda y la use de forma coherente. Las tablas siguientes describen los símbolos comunes tal como los emplean Rother/Shook y Erlach [1][3].

### Símbolos del flujo de proceso y de material

| Símbolo (aspecto) | Nombre | Significado y uso |
|---|---|---|
| edificio de fábrica con techo de dientes de sierra | cliente / proveedor (fuente externa) | cliente arriba a la derecha, proveedor arriba a la izquierda; debajo, un cuadro de datos con la demanda, la frecuencia de entrega y el embalaje |
| rectángulo con una línea de encabezado y el nombre del proceso | caja de proceso | un proceso por el que el material fluye de forma continua; una nueva caja comienza donde el flujo se detiene y se acumula inventario |
| rectángulo debajo de la caja de proceso | caja de datos | datos del proceso: tiempo de ciclo, tiempo de cambio, tiempo de disponibilidad/disponibilidad operativa, tamaño de lote, número de operarios, turnos, desperdicio |
| triángulo con una "I" | inventario | material situado entre dos procesos; la cantidad y los días de inventario se escriben debajo |
| flecha ancha con franjas | flecha de empuje | el material es empujado por el proceso anterior según su propio programa, no según las necesidades del proceso siguiente |
| flecha ancha hueca | envío | materia prima desde el proveedor hasta la planta, o producto terminado desde la planta hasta el cliente |
| camión (o tren, avión, barco) | envío externo | medio de transporte con frecuencia de entrega, p. ej. "2× por semana" |
| estante abierto por la izquierda | supermercado | stock de seguridad controlado del que retira el proceso cliente; el proceso proveedor solo repone lo que se retiró |
| flecha circular | retirada (pull) | retirada física del supermercado por parte del proceso posterior |
| flecha con "FIFO" y una cantidad máxima | carril FIFO | cola limitada entre dos procesos; las piezas salen en orden de llegada, y el proceso proveedor se detiene al alcanzar el máximo |
| triángulo con una nota de seguridad | stock de seguridad o de amortiguación | inventario frente a fluctuaciones de la demanda (amortiguación) o averías del proceso (seguridad) |
| círculo con la cabeza de un operario | operario | número de personas en un proceso |

### Símbolos del flujo de información

| Símbolo (aspecto) | Nombre | Significado y uso |
|---|---|---|
| flecha fina recta | flujo de información manual | información en papel o verbal, p. ej. hoja de ruta, albarán, instrucción verbal |
| flecha en forma de rayo (zigzag) | flujo de información electrónico | mensajes EDI, ERP o MES, correo electrónico |
| rectángulo "Control de producción" | control de producción | planificación, MRP o ERP, a menudo con la frecuencia de planificación |
| tarjeta con esquina cortada, sólida | kanban de producción | señal a un proceso para fabricar una cantidad definida |
| tarjeta con esquina cortada, rayada o marcada según la biblioteca | kanban de retirada | instrucción a un operador de materiales para recoger piezas del supermercado |
| triángulo apoyado sobre la punta | kanban de señal | activa un lote cuando el inventario del supermercado alcanza el punto de reposición; típico de procesos con cambios de formato |
| símbolo similar a un buzón | buzón kanban | lugar donde se recogen los kanban para su retirada |
| flecha discontinua con kanban | recorrido kanban | ruta de las tarjetas de vuelta al proceso proveedor |
| caja con una rejilla de ranuras "OXOX" | caja heijunka (caja de nivelación de carga) | herramienta para nivelar el volumen y la mezcla en el proceso marcapasos |
| gafas | programación por inspección visual (go-see) | programación mediante verificación visual en lugar de señales sistemáticas; señal de que es necesaria una mejora |

### Símbolos generales

| Símbolo (aspecto) | Nombre | Significado y uso |
|---|---|---|
| estallido dentado ("kaizen burst") | necesidad de mejora | marca un punto del mapa de estado actual o futuro donde se necesita mejorar |
| onda cuadrada a lo largo de la base | línea de tiempo (escalera de tiempo de espera) | tiempos de espera (días de inventario) en un nivel, tiempos de proceso en el otro; los totales de tiempo de entrega y de proceso a la derecha |

Algunas guías en línea describen la flecha discontinua como flujo de información electrónico [38]. En *Learning to See*, la flecha en forma de rayo representa la información electrónica y la flecha fina recta la información manual [1]. Mantenga esa convención para que los mapas sigan siendo legibles entre plantas y herramientas de software. Un recorrido ilustrado de los símbolos se encuentra en la entrada [Value Stream Mapping Symbols and Icons Explained](https://www.m365.fm/community/u/mirko-p/blog/value-stream-mapping-symbols-icons/).

Para los procesos de oficina, como la gestión de pedidos antes de la producción, Polaris BSM añade calles BPMN (swimlanes) a los símbolos del mapa de flujo de valor [30]. La investigación ha recogido la misma idea: el enfoque Value Stream Mapping 4.0 de TU Darmstadt incluye explícitamente todos los departamentos de gestión de pedidos, desde el primer contacto con el cliente [14].

## 5. Cómo crear un mapa de flujo de valor: guía paso a paso del estado actual

La guía siguiente sigue la lógica de Rother/Shook y Erlach [1][3] y añade detalle práctico. Para un primer mapa de un flujo de valor manejable, planifique de uno a dos días con un equipo pequeño [unverified: duración estimada por experiencia práctica, no validada]. Las recomendaciones sobre el tamaño del equipo difieren: ASQ considera ideales unos 10 miembros y sugiere un evento kaizen de tres días para el arranque [46], mientras que una guía práctica alemana de Mind Logistik prefiere un equipo reducido de hasta seis personas [42]. Ambas son recomendaciones de práctica, no hallazgos de investigación. Elija el equipo más pequeño si el flujo de valor es corto y el más grande si muchos departamentos intervienen en él.

> **Si va a facilitar por primera vez: una agenda probada**
>
> - **Equipo:** personas de producción (supervisor o jefe de turno), logística, planificación de la producción, mantenimiento y calidad; añada ventas o gestión de pedidos si el problema es el plazo de entrega. Debe participar el futuro responsable del flujo de valor.
> - **Materiales:** papel de 11 × 17 pulgadas o un rollo de papel kraft, lápiz y goma, portapapeles, cronómetro, hoja de recuento de inventario y una leyenda de símbolos acordada de antemano.
> - **Aclarar de antemano:** familia de productos, demanda del cliente de los últimos meses, patrón de turnos y pausas. Anuncie el recorrido por las áreas afectadas y explique que se evalúan los procesos, no a las personas.
> - **Día 1:** introducción al objetivo y a los símbolos (una hora aproximadamente), recorrer el flujo hacia atrás desde la expedición en parejas, unir los datos en un solo mapa, calcular las métricas.
> - **Día 2 o sesión de seguimiento:** validar el mapa con las áreas, añadir kaizen bursts, trabajar las preguntas del estado futuro (sección 8) e iniciar el plan de implementación con responsables.
>
> Las duraciones y la composición del equipo son valores de experiencia y dependen del tamaño del flujo de valor [unverified: valores de experiencia, no validados].

### Paso 1: Definir el objetivo y el alcance

Antes del primer recorrido, decida qué pregunta debe responder el mapa. Ejemplos: ¿por qué nuestro plazo de entrega es de 15 días cuando el cliente espera 5? ¿Cuánta superficie de planta ganamos al reducir el inventario? Establezca los límites. El alcance habitual es «de puerta a puerta», desde la recepción hasta la expedición dentro de una misma planta [1]. Un flujo de valor que abarque varias plantas o proveedores (flujo de valor extendido) es el segundo paso, no el primero.

Nombre también un responsable. Rother/Shook recomiendan asignar la responsabilidad del flujo de valor a una sola persona, el gestor del flujo de valor, en lugar de repartirla entre departamentos. LEI define este rol como «una persona a la que se asigna una responsabilidad clara por el éxito de un flujo de valor» [10]. Más en la sección 13.

### Paso 2: Definir la familia de productos

Una familia de productos es un grupo de productos que pasan por pasos de procesamiento similares en equipos compartidos. La herramienta para ello es una **matriz producto-proceso**: productos o variantes en las filas, procesos en las columnas. Los productos que comparten mayoritariamente las mismas marcas forman una familia. ASQ sugiere buscar productos que compartan alrededor del 80 % de sus pasos [46]. Como regla orientativa, el contenido de trabajo de los productos de una misma familia no debería diferir mucho [unverified: regla orientativa, no validada]. La Wikipedia en alemán subraya que los flujos de valor se forman a lo largo de cadenas de procesos o flujos de material, y que dividirlos por función es inusual porque va en contra de los plazos de entrega cortos [27].

Para su primer mapa, elija una familia con un alto porcentaje de ingresos o un problema apremiante. Un análisis de Pareto (ABC) por volumen e ingresos ayuda.

### Paso 3: Captar la demanda del cliente

Comience el mapa en la parte superior derecha con el símbolo del cliente. En el recuadro de datos, anote la demanda (p. ej., piezas al mes), la mezcla de variantes, el tamaño de lote o cantidad de embalaje, la frecuencia de entrega y el plazo de entrega requerido. A partir de la demanda y del tiempo de trabajo disponible, calcule el **tiempo takt** (fórmula en la sección 6). El tiempo takt es la referencia para toda otra evaluación.

### Paso 4: Recorrer el proceso en el gemba, desde la expedición hacia atrás

Recorra el flujo en sentido contrario a su dirección, desde la expedición hasta la recepción. Rother/Shook explican que así se empieza por los procesos más cercanos al cliente, que deben marcar el ritmo [1]. La Wikipedia en alemán también describe el registro hacia atrás, desde el cliente pasando por el productor hasta el proveedor [27].

Dibuje una caja de proceso para cada sección donde el material fluye de forma continua. Donde el material se detiene, una caja de proceso termina y comienza un triángulo de inventario. Utilice sus propias observaciones y un cronómetro, no datos del ERP. El sistema ERP conoce los tiempos estándar de las hojas de ruta, no lo que realmente ocurre en el puesto de trabajo.

### Paso 5: Complete las cajas de datos

Registre al menos los siguientes datos para cada proceso:

| Campo de datos | Abreviatura | Explicación |
|---|---|---|
| Tiempo de ciclo | C/T | tiempo entre dos piezas buenas al final del proceso |
| Tiempo de procesamiento (tiempo de valor añadido) | P/T, VA | tiempo durante el cual el trabajo realmente añade valor a la pieza |
| Tiempo de cambio | C/O | tiempo desde la última pieza buena del lote anterior hasta la primera pieza buena del nuevo lote |
| Tiempo de funcionamiento / disponibilidad | | proporción del tiempo planificado en la que el equipo puede producir realmente; decida si los cambios de formato se incluyen o se registran por separado |
| Tamaño de lote / EPEI | | piezas por lote, o "every part every interval": con qué frecuencia se produce cada variante |
| Operarios | | número de personas por turno |
| Turnos | | número de turnos y tiempo disponible por turno después de las pausas |
| Chatarra / retrabajo | | proporción de piezas defectuosas |

Para los procesos con varias máquinas en paralelo, anote el número de máquinas y calcule el tiempo de ciclo efectivo del proceso (tiempo de ciclo por máquina dividido entre el número de máquinas).

### Paso 6: Cuente el inventario

Cuente el inventario en la planta, no en el sistema. Escriba la cantidad debajo de cada triángulo de inventario y conviértala en **días de inventario** usando la demanda diaria. Cuente también el inventario que "no cuenta": piezas en áreas de espera, en carros, en rincones de retrabajo. Ahí es donde suele esconderse la mayor parte del tiempo de espera.

### Paso 7: Añada los flujos de material externos

En la parte superior izquierda, dibuje al proveedor principal (o a los proveedores de las materias primas más importantes) y conecte proveedor, recepción, expedición y cliente con símbolos de camión y frecuencias de entrega.

### Paso 8: Dibuje el flujo de información

El flujo de información es la parte que los equipos descuidan con más frecuencia, aunque explica por qué el material se queda detenido. Pregunte en cada proceso: ¿Cómo sabe este proceso qué fabricar a continuación? Las respuestas típicas son un programa semanal del ERP, una lista diaria del supervisor, un kanban, un grito desde el otro lado del pasillo o "lo que haya". Dibuje el control de producción en el centro superior, conecte cliente y proveedor con flechas electrónicas o manuales, y muestre qué información llega a cada proceso. Cuando un proceso recibe varias señales o programas mediante observación, añada el símbolo de gafas para la programación por observación (go-see scheduling).

Después marque los flujos de material entre procesos como empuje (flecha rayada), FIFO o arrastre (supermercado y retirada).

### Paso 9: Dibuje la línea de tiempo y calcule las métricas

La línea de tiempo va debajo de los procesos. En un nivel, anote los días de inventario; en el otro, los tiempos de procesamiento de los procesos. A la derecha, sume ambos para obtener el **lead time** y el **tiempo de procesamiento**, y calcule la **relación de flujo** (flow ratio). En cadenas de valor ramificadas, la ruta más larga determina el lead time [41].

### Paso 10: Marque el desperdicio y valide

Marque los problemas con kaizen bursts: procesos con tiempos de ciclo superiores al takt, inventario elevado, cambios de formato largos, baja disponibilidad, múltiples puntos de programación. Revise el mapa terminado con los empleados de las áreas afectadas. La validación por parte de las personas de la planta evita que un equipo de taller dibuje una cadena de valor que no existe en la fábrica.

### Lista de verificación del estado actual

- [ ] Objetivo, alcance y responsable de la cadena de valor definidos
- [ ] Familia de productos definida con una matriz producto-proceso
- [ ] Demanda del cliente, variantes y tiempo takt determinados
- [ ] Todos los procesos registrados en la planta y en sentido inverso
- [ ] Cajas de datos completadas con valores medidos
- [ ] Inventario contado y convertido en días
- [ ] Proveedores, cliente y transporte dibujados
- [ ] Flujo de información aclarado para cada proceso
- [ ] Línea de tiempo, lead time, tiempo de procesamiento y relación de flujo calculados
- [ ] Kaizen bursts añadidos y mapa validado con los empleados

## 6. Métricas y fórmulas del mapeo de flujo de valor

Las métricas hacen comparables los mapas de flujo de valor. En ZWF (Zeitschrift für wirtschaftlichen Fabrikbetrieb, una revista alemana de ingeniería de producción publicada por De Gruyter), Jörg Drees y Christoph Sack muestran que las métricas del flujo de valor, como la reducción de inventario, la utilización de recursos, la capacidad de entrega y los plazos de entrega cortos, parecen perseguir objetivos contrapuestos, pero, aplicadas correctamente, dan recomendaciones coherentes. Proponen un conjunto básico de métricas que, junto con métodos Lean específicos, forman bucles de control [19]. Las fórmulas siguientes cubren ese conjunto básico. Más definiciones están en las páginas de entidades [Lead Time](https://www.m365.fm/entity/lead-time/), [Cycle Time](https://www.m365.fm/entity/cycle-time/) y [Takt Time](https://www.m365.fm/entity/takt-time/).

**Una nota sobre terminología.** Las guías en inglés de EE. UU. usan varios nombres para la misma razón. Lo que los textos alemanes llaman *Flussgrad* aparece en inglés como flow ratio, process cycle efficiency (PCE), value-added ratio, flow efficiency o, en la terminología de Karen Martin, activity ratio ("la suma de los tiempos de proceso de todos los pasos individuales dividida entre el Total Lead Time") [44]. Esta guía usa **flow ratio** en todo el texto. Del mismo modo, "inventory days", "days of supply" y "days of inventory" significan lo mismo.

### Takt time

> **Takt time = tiempo de trabajo disponible por periodo ÷ demanda del cliente por periodo**

LEI pone el ejemplo de una fábrica de widgets que opera 480 minutos al día mientras los clientes demandan 240 widgets al día, lo que da un takt time de dos minutos [8]. ASQ aplica la misma fórmula con 22 000 segundos y 200 piezas, lo que da 110 segundos por pieza [46]. El tiempo de trabajo disponible es el tiempo de turno menos las pausas planificadas. El tiempo de inactividad no planificado no se resta; pertenece a la disponibilidad. La palabra "takt" es alemana (significa compás o pulso, como en la música). Según LEI, takt se utilizó por primera vez como herramienta de gestión de producción en la industria aeronáutica alemana en la década de 1930 y se extendió ampliamente en Toyota en la década de 1950 [8].

### Cycle time y effective cycle time

El cycle time es el tiempo entre dos piezas buenas al final de un proceso. Para compararlo con el takt time, hay que tener en cuenta la disponibilidad y la chatarra:

> **Effective cycle time = cycle time ÷ (disponibilidad × rendimiento al primer intento)**

Un proceso con un cycle time de 98 segundos y una disponibilidad del 85 % produce efectivamente una pieza cada 115 segundos. Frente a un takt time de 117 segundos está casi a plena carga, aunque el cycle time nominal sugiera un margen del 16 %.

Hay que tener cuidado con una confusión frecuente: algunas guías en inglés usan "cycle time" para el tiempo total que una unidad pasa en el proceso, o incluso para el plazo de entrega del proveedor. En un mapa de flujo de valor, cycle time siempre significa el intervalo entre dos piezas buenas al final de un mismo proceso.

### Inventory days y la ley de Little

> **Inventory days = inventario (piezas) ÷ demanda diaria (piezas por día)**

La Wikipedia en alemán calcula 280 piezas con una demanda diaria de 80 piezas como 3,5 días de inventario [27]. Este cálculo aplica la **ley de Little**, que John D. C. Little demostró en 1961 en la revista Operations Research [12]:

> **L = λ × W**, reordenada: **W = L ÷ λ**

L es el inventario medio en el sistema, λ la tasa media de salida y W el tiempo medio en el sistema. Aplicado a un flujo de valor: el tiempo medio que una pieza espera en un buffer es igual al inventario dividido entre la tasa de consumo. La ley de Little se cumple a largo plazo en sistemas estables. Para días sueltos con picos de demanda, o para un sistema durante el arranque, la fórmula solo es una aproximación. Esa es una de las razones del mapeo dinámico de flujo de valor (sección 11).

### Lead time

> **Production lead time = Σ inventory days + Σ tiempos de proceso (a lo largo del camino más largo)**

Como los tiempos de proceso suelen medirse en segundos o minutos y el inventario en días, la suma de los inventory days domina el resultado. Una tesis de diploma en la Hochschule Mittweida (una universidad alemana de ciencias aplicadas) resume la definición de Erlach de production lead time como la suma de los tiempos de procesamiento y de proceso más los rangos de inventario, siendo decisivo el camino más largo [41]. El glosario de Martin lo formula de manera más general: lead time es igual a tiempo de proceso más tiempo de espera [44].

### Processing time y process time

**Tiempo de procesamiento** es el tiempo durante el cual se trabaja sobre la pieza. Erlach también distingue el **tiempo de proceso** para pasos como el secado, el curado o el tratamiento térmico, que consumen tiempo sin que nadie trabaje sobre la pieza [41]. Ambos cuentan para la razón de flujo.

### Razón de flujo (eficiencia del ciclo de proceso)

> **Razón de flujo = (tiempo de procesamiento + tiempo de proceso) ÷ lead time × 100 %**

La Wikipedia en alemán describe la razón de flujo como la proporción del tiempo de procesamiento puro en el lead time total y la denomina la métrica clave del análisis de la cadena de valor [27]. Preste atención a la base temporal. Si el lead time se indica en días laborables, conviértalo a segundos usando el tiempo de trabajo diario, como hace la fórmula de Erlach con su factor de «tiempo de trabajo diario» [41]. Si calcula en días naturales, la razón de flujo baja aún más. Elija una convención y manténgala, o los estados actual y futuro no serán comparables.

### Otras métricas

| Métrica | Fórmula / definición | Uso |
|---|---|---|
| Carga respecto al takt | tiempo de ciclo efectivo ÷ tiempo takt | valores superiores al 100 % indican un cuello de botella |
| Número de operarios necesarios | Σ contenido de trabajo ÷ tiempo takt | base para el equilibrado de línea |
| EPEI | tiempo hasta haber producido una vez cada variante | muestra la flexibilidad y los efectos del tamaño de lote |
| Proporción de cambios de formato | (número de cambios × tiempo de cambio) ÷ tiempo disponible | muestra cuánta capacidad queda libre para lotes más pequeños |
| Carga incluyendo cambios de formato | (demanda diaria × tiempo de ciclo + cambios × tiempo de cambio) ÷ (tiempo disponible × disponibilidad) | comprueba si un estado futuro con lotes pequeños puede seguir cumpliendo el takt (ejemplo en la sección 7) |
| Entrega a tiempo | pedidos entregados a tiempo ÷ todos los pedidos | métrica de resultado desde la perspectiva del cliente |
| %C&A (porcentaje completo y correcto) | proporción del trabajo que el paso siguiente recibe completo y sin errores | calidad de las transferencias; se usa sobre todo en cadenas de valor administrativas [44] |
| OEE | disponibilidad × rendimiento × calidad | eficacia del equipo; el recuadro de datos suele acortarlo a tiempo de funcionamiento |

Un gráfico de equilibrado de operarios (un diagrama de barras con los tiempos de ciclo efectivos y una línea horizontal para el tiempo takt) hace visibles de un vistazo los cuellos de botella y la sobrecapacidad. Erlach lo utiliza para mostrar lo bien que la capacidad se ajusta al takt [3]. La Wikipedia en alemán señala que los tiempos de ciclo cercanos al takt indican cuellos de botella, y los tiempos de ciclo muy por debajo del takt indican sobrecapacidad y desperdicio [27].

## 7. Ejemplo de mapeo de la cadena de valor: una cadena de valor calculada por completo

El siguiente ejemplo es **ficticio y se ha elaborado para esta guía**. Muestra cómo se relacionan las métricas y calcula el estado actual y el estado futuro con los mismos datos base.

### Punto de partida

Un proveedor fabrica una familia de producto de carcasas de válvulas hidráulicas en cinco variantes con la misma ruta de fabricación: aserrado, torneado, fresado, lavado y montaje. El cliente solicita en promedio 9.200 piezas al mes, repartidas en 20 días laborables. La planta trabaja con dos turnos de 8 horas, cada uno con una pausa de 30 minutos.

**Paso A: calcular el takt time**

- Demanda diaria: 9.200 piezas ÷ 20 días = **460 piezas por día**
- Tiempo de trabajo disponible: 2 × (480 min − 30 min) = 900 min = **54.000 s por día**
- Takt time: 54.000 s ÷ 460 piezas = **117,4 s por pieza**

### Estado actual: datos de los procesos

| Proceso | Tiempo de ciclo | Tiempo de cambio | Disponibilidad | Tiempo de ciclo efectivo | Carga frente al takt |
|---|---|---|---|---|---|
| Aserrado | 45 s | 30 min | 95 % | 47,4 s | 40 % |
| Torneado | 98 s | 60 min | 85 % | 115,3 s | 98 % |
| Fresado | 125 s | 45 min | 90 % | 138,9 s | **118 %** |
| Lavado | 40 s | 0 min | 98 % | 40,8 s | 35 % |
| Montaje | 105 s | 15 min | 95 % | 110,5 s | 94 % |

Simplificaciones: aquí el tiempo de procesamiento es igual al tiempo de ciclo, porque cada proceso trabaja una pieza tras otra. Se ignora la chatarra. La disponibilidad solo cubre las averías; los cambios de formato se tratan por separado.

**Hallazgo sobre el cuello de botella:** el fresado ya supera el takt con un tiempo nominal de 125 s, y con un tiempo efectivo de 138,9 s está un 18 % por encima. En un día, el fresado produce 54.000 s × 0,90 ÷ 125 s = **389 piezas** en lugar de las 460 necesarias. Los cambios de formato reducen aún más esa cifra. La planta cierra la brecha con turnos extra de sábado. El torneado parece no crítico sobre el papel (98 s), pero, al incluir la disponibilidad, tiene una carga del 98 %. Si se ignora la disponibilidad, se pasa por alto este segundo cuello de botella casi crítico.

### Estado actual: inventario y cronograma

| Inventario | Cantidad | Días de inventario (cantidad ÷ 460) |
|---|---|---|
| Materia prima antes del aserrado | 4.600 piezas | 10,0 días |
| Tras el aserrado | 1.380 piezas | 3,0 días |
| Tras el torneado | 920 piezas | 2,0 días |
| Tras el fresado | 690 piezas | 1,5 días |
| Tras el lavado | 460 piezas | 1,0 día |
| Productos terminados | 1.150 piezas | 2,5 días |
| **Total** | **9.200 piezas** | **20,0 días** |

- **Tiempo de procesamiento:** 45 + 98 + 125 + 40 + 105 = **413 s** (algo menos de 7 minutos)
- **Lead time:** 20,0 días laborables + 413 s ≈ **20 días laborables**
- **Ratio de flujo (base de tiempo laborable):** 413 s ÷ (20 × 54.000 s) = 413 ÷ 1.080.000 = **0,038 %**
- **Ratio de flujo (base de calendario):** 20 días laborables corresponden a unos 28 días naturales; 413 s ÷ (28 × 86.400 s) = **0,017 %**

**Comprobación de plausibilidad con la Ley de Little:** inventario total de 9.200 piezas ÷ rendimiento de 460 piezas por día = 20 días [12]. La suma de los días de inventario individuales y el cálculo global coinciden. Si esta comprobación no cuadra en su mapa, es que ha omitido inventario o ha mezclado valores de referencia.

**Hallazgo sobre el flujo de información:** la planificación de producción envía un programa semanal a los cinco procesos. Cada proceso produce según su propio programa y empuja el material hacia el siguiente. No hay límite de cantidad entre procesos, por lo que el inventario se acumula delante del cuello de botella. El supervisor de montaje interviene a diario con pedidos urgentes (programación por inspección visual).

### Estado futuro: acciones de mejora

Aplicando las pautas de diseño de la sección 8, el equipo diseña este estado futuro:

1. **Eliminar el cuello de botella en fresado:** las mejoras en herramental y utillajes reducen el tiempo de ciclo de 125 a 95 s; una iniciativa TPM (mantenimiento productivo total, mantenimiento preventivo con participación de los operarios) eleva la disponibilidad del 90 al 95 %.
2. **Estabilizar el torneado:** la optimización del programa reduce el tiempo de ciclo de 98 a 90 s; el TPM eleva la disponibilidad del 85 al 92 %.
3. **Equilibrar el montaje:** el contenido de trabajo se redistribuye y el tiempo de ciclo baja de 105 a 95 s.
4. **Reducir los tiempos de cambio (SMED):** como cada variante se fabricará cada día, cada proceso necesita cinco cambios diarios. SMED (cambio de herramienta en un solo dígito de minutos: preparar el cambio mientras la máquina sigue en marcha) reduce el tiempo de cambio en torneado de 60 a 10 min, en fresado de 45 a 10 min y en montaje de 15 a 5 min. Sin este paso el estado futuro no sería viable: cinco cambios de 60 minutos cada uno no caben en la capacidad libre del torneado.
5. **Enlaces FIFO:** torneado, fresado, lavado y montaje están conectados por tres carriles FIFO con cantidades máximas de 60, 30 y 30 piezas.
6. **Supermercado tras el aserrado:** como el aserrado es mucho más rápido y tiene que cambiar de formato, un supermercado que almacena medio día de inventario (230 piezas) lo desacopla. Un kanban de señal dispara los nuevos lotes.
7. **Montaje como marcapasos:** la planificación envía los pedidos de cliente solo al montaje. Una caja heijunka reparte uniformemente las cinco variantes a lo largo del día. Con una cantidad de paquete de 20 piezas, el ritmo es 20 × 117,4 s ≈ 39 minutos.
8. **Supermercado de productos terminados:** un día de inventario (460 piezas) amortigua las fluctuaciones en las llamadas de cliente.
9. **Enlace con proveedores:** las entregas de materia prima pasan de una vez a dos veces por semana; el inventario de materia prima baja a cinco días (2.300 piezas).

### Estado futuro: verificación de capacidad con cambios

Un estado futuro debe cumplir el takt time incluso con cambios diarios. La verificación calcula, por tanto, dos valores: el tiempo de ciclo efectivo comparado con el takt y la carga incluyendo los cambios.

> **Carga incluyendo cambios = (demanda diaria × tiempo de ciclo + cambios × tiempo de cambio) ÷ (tiempo disponible × disponibilidad)**

| Proceso | Tiempo de ciclo | Tiempo de cambio | Disponibilidad | Tiempo de ciclo efectivo | Carga vs. takt | Carga incl. 5 cambios |
|---|---|---|---|---|---|---|
| Aserrado | 45 s | 30 min | 95 % | 47,4 s | 40 % | 58 % |
| Torneado | 90 s | 10 min | 92 % | 97,8 s | 83 % | 89 % |
| Fresado | 95 s | 10 min | 95 % | 100,0 s | 85 % | **91 %** |
| Lavado | 40 s | 0 min | 98 % | 40,8 s | 35 % | 35 % |
| Montaje | 95 s | 5 min | 95 % | 100,0 s | 85 % | 88 % |

Cálculo para fresado: (460 × 95 s + 5 × 600 s) ÷ (54.000 s × 0,95) = 46.700 ÷ 51.300 = 91 %. Todos los procesos se mantienen por debajo del 100 %, con el valor más alto en fresado. El marcapasos, el montaje, tiene algo de reserva para las fluctuaciones de llamadas con un 88 %.

### Estado futuro: resultado

| Métrica | Actual | Futuro | Cambio |
|---|---|---|---|
| Inventario total | 9.200 piezas | 2.300 + 230 + 120 + 460 = 3.110 piezas | −66 % |
| Lead time (Little) | 20,0 días laborables | 3.110 ÷ 460 = 6,8 días laborables | −66 % |
| Tiempo de procesamiento | 413 s | 45 + 90 + 95 + 40 + 95 = 365 s | −12 % |
| Índice de flujo (base tiempo de trabajo) | 0,038 % | 365 ÷ (6,76 × 54.000) = 0,100 % | factor 2,6 |
| Cuello de botella | fresado 118 % (sin cambios) | carga máxima en fresado 91 % incl. cambios | takt cumplido sin turnos de sábado |
| Puntos de programación | 5 (programa semanal a todos) | 1 (montaje como marcapasos) | planificación más sencilla |

Los carriles FIFO se contabilizan con sus cantidades máximas (60 + 30 + 30 = 120 piezas). En operación rara vez están llenos, por lo que el inventario futuro es un límite superior prudente.

Dos lecciones del ejemplo. En primer lugar, las medidas de programación e inventario aportan la mayor parte de la reducción del lead time, no máquinas más rápidas. El tiempo de procesamiento baja un 12 %, el lead time un 66 %. En segundo lugar, incluso el índice de flujo mejorado de 0,1 % sigue siendo bajo. Eso es típico en plantas con un colchón de materia prima. Lo que importa es la dirección y un takt time que pueda cumplirse de forma fiable incluso con cambios diarios.

## 8. Mapa del estado futuro: directrices de diseño de Rother/Shook y Erlach

El diseño del estado futuro responde a la pregunta de cómo debe fluir la cadena de valor. *Learning to See* lleva al lector desde el estado actual hasta un "mapa de un estado futuro más esbelto" y hasta un plan de cadena de valor que orienta la implementación y se revisa periódicamente [1].

### Preguntas clave para el estado futuro según Rother/Shook

Rother y Shook estructuran el diseño mediante una serie de preguntas clave [1] (parafraseadas):

1. ¿Cuál es el tiempo takt?
2. ¿Producimos para un supermercado de productos terminados o directamente para el envío?
3. ¿Dónde podemos usar flujo continuo?
4. ¿Dónde necesitamos sistemas pull con supermercados?
5. ¿En qué único punto de la cadena productiva (el proceso marcapasos) programamos la producción?
6. ¿Cómo nivelamos la mezcla de producción en el proceso marcapasos?
7. ¿Qué incremento de trabajo liberamos y retiramos de forma constante en el marcapasos?
8. ¿Qué mejoras de proceso son necesarias para que el estado futuro funcione?

### Las directrices de Rother y Shook

En un artículo para el Lean Post del LEI (19 de octubre de 2022), Mike Rother y John Shook resumen las directrices para una cadena de valor esbelta de la siguiente manera [11]:

| N.º | Directriz (redacción original) | Qué significa |
|---|---|---|
| 1 | "Produce to your takt time" | alinear la producción con la demanda del cliente |
| 2 | "Develop continuous flow wherever possible" | crear flujo de una pieza siempre que sea posible |
| 3 | "Use supermarkets to control production where continuous flow does not extend upstream" | usar supermercados donde el flujo no puede llegar aguas arriba |
| 4 | "Try to send the customer schedule only to one production process" | enviar los pedidos del cliente a un único proceso (el marcapasos) |
| 5 | "Distribute the production of different products evenly over a set time at the pacemaker process" | nivelar la mezcla de productos en el marcapasos (heijunka) |
| 6 | "Create an 'initial pull' by releasing and withdrawing small, consistent increments of work at the pacemaker process" | nivelar el volumen de producción |

Algunas fuentes secundarias mencionan una séptima directriz de *Learning to See*: la capacidad de fabricar cada pieza cada día en los procesos aguas arriba del marcapasos ("every part every day"), y más tarde cada turno o cada hora [1] [unverified: no contrastado con el texto del libro]. El ejemplo de la sección 7 muestra por qué esta directriz exige tiempos de cambio de formato cortos.

### Directrices de diseño de Erlach

Klaus Erlach organiza el diseño de la cadena de valor en ocho directrices de diseño que se construyen unas sobre otras [3]. Se agrupan en tres bloques: diseño de los procesos productivos (directrices 1 y 2), control de la producción (3 a 5) y planificación de la producción (6 a 8). Los nombres siguen el libro alemán de Erlach y la síntesis de su sitio web; la edición en inglés (Springer 2012/2013) es descrita por su editorial como una que transmite "ten design guidelines" [4], por lo que la numeración puede diferir en el texto inglés.

| N.º | Directriz de diseño [3] | Pregunta clave para su cadena de valor |
|---|---|---|
| 1 | Alineación con el tiempo takt | ¿Están todos los procesos diseñados para cumplir el tiempo takt de forma fiable, y dónde hay sobrecapacidad? |
| 2 | Integración de procesos | ¿Qué pasos de proceso pueden combinarse física y organizativamente en un flujo continuo? |
| 3 | Acoplamiento FIFO | ¿Dónde pueden enlazarse los procesos mediante carriles FIFO limitados en lugar de almacenamiento ilimitado? |
| 4 | Control kanban | ¿Dónde se necesita un supermercado con kanban porque los procesos tienen tiempos de ciclo o cambios de formato diferentes? |
| 5 | Proceso marcapasos | ¿En qué único proceso se programan los pedidos de los clientes? |
| 6 | Definición de la unidad de liberación | ¿En qué incremento de tiempo se libera el trabajo en el marcapasos (pitch)? |
| 7 | Nivelación de la mezcla de producción | ¿Cómo se distribuyen las variantes de forma uniforme, y dónde tiene sentido agrupar en campañas? |
| 8 | Control del cuello de botella | ¿Cómo se controla un cuello de botella restante para que nunca se quede sin carga? |

El orden sigue la lógica de los tres bloques: una mezcla de producción nivelada (directriz 7) presupone que los procesos están alineados con el takt y que el control mediante FIFO, kanban y marcapasos funciona (directrices 1 a 5).

### Términos del estado futuro en breve

- **Flujo continuo (flujo de una pieza):** las piezas se mueven de un proceso a otro de una en una, sin almacenamiento intermedio.
- **Supermercado y kanban:** el proceso posterior retira material y el proceso proveedor repone solo lo que se retiró. Más información en las páginas de entidad [Kanban](https://www.m365.fm/entity/kanban/) y [Pull System](https://www.m365.fm/entity/pull-system/).
- **Carril FIFO:** una cola con una cantidad máxima; cuando está llena, el proceso proveedor se detiene. FIFO es más sencillo que kanban y es adecuado para piezas de alta variedad que no deben fabricarse para stock.
- **Proceso marcapasos:** el único proceso que recibe pedidos de clientes. Los procesos anteriores se controlan mediante supermercado o carriles FIFO; los procesos posteriores funcionan en flujo continuo o FIFO.
- **Heijunka:** nivelación de volumen y mezcla, por ejemplo con una caja heijunka que tiene una ranura por cada incremento de tiempo.
- **Pitch / unidad de liberación:** el incremento de tiempo en el que se liberan los trabajos y se retiran los productos terminados: tiempo takt × cantidad de embalaje, en el ejemplo de la sección 7, 20 × 117,4 s ≈ 39 minutos.
- **SMED y TPM:** SMED reduce los tiempos de cambio preparando el trabajo de cambio mientras la máquina sigue en marcha; TPM aumenta la disponibilidad mediante mantenimiento preventivo. Ambos son con frecuencia requisitos previos para un estado futuro con lotes pequeños.

### Del estado futuro al plan de implementación

Un estado futuro sin plan es solo un cartel bonito. Divida el estado futuro en **bucles del flujo de valor**: el bucle del marcapasos (desde el marcapasos hasta el cliente) y los bucles anteriores hasta cada supermercado. Cada bucle tiene objetivos, acciones, responsables y fechas. Rother y Shook recomiendan empezar por el bucle del marcapasos porque es el más cercano al cliente [unverified: fuente sin cita precisa en el texto original]. Planifique en ciclos de unos pocos meses y revise el progreso con regularidad, por ejemplo en una revisión mensual del flujo de valor.

La valoración es un obstáculo habitual. Busch, Niehues y Maassen describen en ZWF que la industria con frecuencia no materializa el potencial del flujo de valor porque el beneficio se cuantifica mal. Amplían el método del flujo de valor con un modelo de valoración basado en costes que vincula indicadores operativos y estratégicos [25]. Para su plan de implementación, eso significa: traduzca a dinero la reducción de inventario, el espacio de planta liberado y la reducción del plazo de entrega antes de solicitar presupuesto.

## 9. Identificar el desperdicio: los 8 desperdicios y el diagrama de espagueti

El mapa de la cadena de valor es una herramienta para encontrar el desperdicio (en japonés: muda). La clasificación de los siete desperdicios se remonta a Taiichi Ohno [9][32]; LEI los enumera como sobreproducción, esperas, transporte, procesamiento, inventario, movimiento y corrección [9]. Jeffrey Liker añadió un octavo en "The Toyota Way" (2004): la creatividad y las habilidades del empleado sin utilizar [33]. En EE. UU., los ocho suelen enseñarse con el acrónimo DOWNTIME: defectos, overproduction (sobreproducción), waiting (esperas), non-utilized talent (talento no utilizado), transportation (transporte), inventory (inventario), motion (movimiento), extra processing (procesamiento extra) [51]. Un resumen compacto está en la página de entidad [Eight Wastes](https://www.m365.fm/entity/eight-wastes/).

| No. | Desperdicio | Cómo detectarlo en el mapa de la cadena de valor |
|---|---|---|
| 1 | Sobreproducción | flechas de empuje, lotes grandes, inventario tras procesos rápidos; según LEI "la peor forma de desperdicio porque contribuye a los otros seis" [9] |
| 2 | Esperas | operarios que esperan a máquinas, material o aprobaciones; carga baja respecto al takt |
| 3 | Transporte | muchas flechas de camiones y transporte, almacenamiento intermedio entre procesos |
| 4 | Sobreprocesamiento | pasos de proceso sin valor para el cliente, inspecciones duplicadas |
| 5 | Inventario | triángulos de inventario con muchos días, supermercados sin cantidades máximas |
| 6 | Movimiento | largos recorridos de los empleados, búsqueda de piezas y herramientas (se ve mejor en un diagrama de espagueti) |
| 7 | Defectos / corrección | chatarra y retrabajo en el recuadro de datos, flechas de flujo de retorno |
| 8 | Talento no utilizado | programación de go-see, sin participación en el dibujo del mapa, sin sugerencias de mejora |

### El diagrama de espagueti como complemento

El mapa de la cadena de valor muestra el flujo a un nivel abstracto. No muestra cuánto recorren realmente las piezas y las personas. Para eso sirve el **diagrama de espagueti**: sobre un plano a escala de la planta, se traza con un lápiz cada recorrido de una pieza o de una persona. El resultado a menudo parece un plato de espagueti y hace visibles de una vez los desperdicios de transporte y de movimiento. LEI relata el caso de Thrustmaster of Texas, fabricante con sede en Houston de equipos de propulsión marina, en el que un gráfico de espagueti del área de montaje de propulsores reveló más de siete millas de caminata y casi 10 horas de tiempo sin valor añadido por unidad; tras un rediseño de la distribución centrado en el flujo y el trabajo estándar, la empresa informó de un 100 % de entregas a tiempo 18 meses después [43]. Utilice el diagrama de espagueti después del mapa de la cadena de valor para los procesos con los estallidos kaizen más destacados. Detalles en la página de entidad [Spaghetti Diagram](https://www.m365.fm/entity/spaghetti-diagram/).

## 10. Límites del mapeo tradicional de la cadena de valor

El mapeo de la cadena de valor en papel es sencillo a propósito. Esa sencillez es su fortaleza y también su límite. La literatura discute principalmente cinco debilidades.

**1. Instantánea.** El mapa muestra el estado de un día o de una semana. En ZWF, Lugert y Winkler señalan que el carácter estático del mapeo de la cadena de valor se convierte en un problema creciente bajo las megatendencias actuales de la producción, y piden una gestión dinámica de la cadena de valor [23]. Fraunhofer IPA se pregunta si las instantáneas individuales bastan para analizar un proceso productivo en su totalidad [22].

**2. Promedios en lugar de distribuciones.** Las cajas de datos contienen promedios. Los tiempos de ciclo fluctuantes, las averías y los picos de demanda desaparecen en la media. La Ley de Little se cumple para el promedio a largo plazo de sistemas estables [12], pero no dice nada sobre la dispersión de los pedidos individuales.

**3. Variedad de productos.** Ya en 2011, Drees y Sack señalaron cadenas de valor más complejas, un número creciente de variantes de producto y fluctuaciones cotidianas de la demanda [19]. Con cientos de variantes y rutas distintas, se vuelve casi imposible formar una familia de productos con tiempos de ciclo uniformes.

**4. Recogida manual de datos.** Según Fraunhofer IPA, los datos anotados en papel y los promedios estimados están menos actualizados, son menos precisos y menos completos que los datos recogidos digitalmente [22]. En muchas empresas, los datos para el mapeo de la cadena de valor se recogen manualmente y solo como instantánea [21]. El esfuerzo que implica hace que los mapas rara vez se actualicen.

**5. Ningún ensayo del estado futuro.** Si los carriles FIFO de 30 piezas son suficientes, o si un supermercado se vacía durante los picos de demanda, no puede comprobarse sobre el papel. Türck, Weimer, Schubert y Drees (iFAKT GmbH) preguntan, por ello, qué nuevas oportunidades de optimización surgen al tener en cuenta el factor tiempo [16].

Existe además una carencia de contenido: el método clásico mejora principalmente el flujo de material. El flujo de información se dibuja, pero apenas se evalúa. Ahí entra el Value Stream Mapping 4.0 (sección 12) [13][15].

## 11. Mapeo dinámico y digital de la cadena de valor

El método evoluciona en dos ejes: **dinámico** (simular el comportamiento temporal y la variabilidad) y **digital** (recoger datos automáticamente y calcular indicadores de forma continua). Ambos ejes complementan el método clásico; ninguno lo reemplaza.

### Del mapa estático a la simulación

Ya en 2014, Stefan Türck, Andreas Weimer, Lars Schubert y Jörg Drees, de iFAKT GmbH, describieron en ZWF el camino desde el análisis estático de las cadenas de valor y sus indicadores hasta la **simulación dinámica** [16]. Su punto de partida era que el modelado de la cadena de valor está establecido en muchas empresas manufactureras y que las herramientas digitales para ello están ganando aceptación [16]. El mapeo dinámico de la cadena de valor pregunta no solo cuál es el inventario medio, sino cómo evoluciona en el tiempo cuando los pedidos fluctúan, las máquinas se averían o cambian las secuencias de cambio de formato.

En la práctica, el mapa de la cadena de valor se convierte en un modelo en el que cada símbolo tiene comportamiento. Un proceso ya no tiene un tiempo de ciclo fijo, sino una distribución; un supermercado tiene un punto de reposición y un máximo; la demanda del cliente sigue una serie temporal. La simulación muestra si el estado futuro funciona en condiciones realistas, dónde los buffers son demasiado pequeños y qué distribución del lead time cabe esperar. Más información sobre la simulación de fábricas en general en la página de entidad [Factory Simulation](https://www.m365.fm/entity/factory-simulation/).

### Comparación: mapeo estático frente a dinámico

| Criterio | VSM estático (clásico) | VSM dinámico / simulación |
|---|---|---|
| Base de datos | promedios de un único registro en planta | distribuciones, series temporales, datos de eventos |
| Referencia temporal | instantánea | evolución a lo largo de días, semanas, meses |
| Variedad de productos | familia de productos con valores uniformes | variantes con sus propias rutas y secuencias de cambio |
| Variabilidad y averías | no se muestran | modeladas mediante distribuciones y perfiles de avería |
| Métricas | lead time, ratio de flujo, días de inventario como valores únicos | además dispersión, percentiles, carga en el tiempo |
| Prueba del estado futuro | no es posible, solo juicio experto | escenarios comparables antes de la implementación |
| Esfuerzo | bajo: papel y cronómetro | mayor: modelado y mantenimiento de datos |
| Herramientas | papel, pizarra, software de diagramas | software VSM especializado con enlace a simulación, suites de simulación |
| Fortaleza | comprensión, comunicación, implicación | reducción del riesgo de inversiones y dimensionamiento de buffers |
| Uso típico | introducción, taller, formación en Lean | planificación de planta, producción de alta mezcla, decisiones de capacidad |

### Mapeo digital de la cadena de valor: datos de la planta en lugar del portapapeles

El segundo eje es la recogida de datos. En ZWF, Christian Urnauer muestra cómo la **minería de procesos** puede derivar procesos, sus vínculos y métricas de rendimiento a partir de marcas de tiempo de producción, aportando al mapeo de la cadena de valor una perspectiva basada en datos [24].

Fraunhofer IPA sigue un camino similar bajo el lema "Estamos automatizando el paseo por el gemba": desde la captura digital de datos en el piso de planta hasta métricas de cadena de valor visualizadas, con análisis actuales, métricas coherentes basadas en datos y una integración sencilla de KPI de energía y huella de carbono [22]. Los fabricantes estadounidenses también tienen una referencia pública para el aspecto ambiental: el Lean & Environment Toolkit de la EPA recomienda seleccionar "una o dos métricas de desempeño ambiental a medir para cada proceso de la cadena de valor", como la cantidad de residuos peligrosos por turno, y anotarlas en las cajas de proceso junto al tiempo de ciclo y la disponibilidad [48].

En términos de ISA-95 (ANSI/ISA-95, conocida internacionalmente como IEC 62264), los datos de una cadena de valor digital proceden de los sistemas de negocio de Nivel 4, como ERP, de los sistemas de operaciones de fabricación de Nivel 3, como MES, y de los sistemas de control y sensores de Nivel 2 [50]. Esa estratificación ayuda a debatir con TI qué sistema aporta qué campo de cada caja de datos.

Un ejemplo concreto es el proyecto de investigación **ECOWERT** ("análisis de la cadena de valor orientado a tiempo real para la optimización de la producción sostenible"), de Fraunhofer IPA e iFAKT GmbH. Se ejecutó del 1 de septiembre de 2021 al 31 de agosto de 2022, tuvo un presupuesto de 500.000 € y fue financiado por el estado alemán de Baden-Württemberg a través de su programa Invest BW [20]. El objetivo era un análisis de la cadena de valor que recopilara automáticamente datos de ERP, MES, máquinas y sensores, los actualizara de forma continua y añadiera datos de la cadena de valor energética [20]. Jörg Drees y Steffi Stambera (iFAKT) y Markus Böhm (Fraunhofer IPA) describen la arquitectura: los datos brutos viajan mediante una pasarela IIoT y MQTT (con la especificación de carga útil Sparkplug) hasta una base de datos de series temporales, y el software Polaris VSM los evalúa. Su conclusión: el resultado es un enfoque que puede producir análisis de la cadena de valor casi en tiempo real, y reequipar las máquinas con sensores sencillos ya basta para generar los datos [21].

Para reutilizar estos datos, Böhm, Drees, Sai, Erlach, Stambera y Teriete desarrollaron una **interfaz de datos universal para servicios digitales de cadena de valor**. Tratan los eventos del piso de planta como datos brutos estructurados para servicios de optimización y estandarizan el flujo de datos para que los servicios se conecten a través de una única interfaz. En el proyecto ECOWERT se conectó un servicio para calcular y visualizar métricas [18]. Entre los autores figura Klaus Erlach (Fraunhofer IPA), autor de la obra de referencia sobre diseño de cadenas de valor [18][3].

### Del gemelo de la cadena de valor al gemelo digital

Cuando el mapa de la cadena de valor se actualiza de forma continua a partir de datos en tiempo real y se acopla con un modelo de simulación, se convierte en un bloque constructivo de un gemelo digital de la producción. Siemens, por ejemplo, ofrece un complemento VSM Library para Plant Simulation X que permite a los usuarios "ejecutar simulaciones dinámicas de cadenas de valor" y "crear y comparar múltiples escenarios", como el estado actual y el estado futuro [35]. Más sobre el concepto en la página de entidad [Digital Twin](https://www.m365.fm/entity/digital-twin/) y en la guía [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/).

Cómo funciona una cadena de valor como modelo de datos vivo también se analiza en el episodio de m365.fm [Value Stream Mapping with a Live Data Model](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/).

**Advertencia importante:** la digitalización no corrige un flujo deficiente. TU Darmstadt recomienda explícitamente establecer primero un flujo estable y esbelto mediante el diseño clásico de cadenas de valor, y solo después abordar las mejoras digitales. Desaconseja digitalizar procesos complejos antes de que sean estables [14].

## 12. Value Stream 4.0: la logística de la información como segunda dimensión

**Value Stream Mapping 4.0** fue desarrollado en el Institute of Production Management, Technology and Machine Tools (PTW) de la TU Darmstadt, en Alemania. Tobias Meudt, Joachim Metternich y Eberhard Abele lo presentaron en 2017 en CIRP Annals con el título "Value stream mapping 4.0: Holistic examination of value stream and information logistics in production" [13]. Después apareció un libro en inglés: "Value Stream 4.0: A Systems View of Information Flow for Digitalization", de Metternich, Meudt y Hartmann (CRC Press, publicado en julio de 2025, copyright 2026) [15].

La idea central: junto al flujo de material se analiza de forma sistemática la **logística de la información**. La información debe estar disponible en el momento adecuado, en el lugar adecuado, en la cantidad y con la calidad adecuadas, con el menor desperdicio posible [14]. Según la guía "Industrie 4.0 trifft Lean" (La Industria 4.0 se encuentra con Lean) de la Asociación de la Industria de Ingeniería Mecánica alemana (VDMA), desarrollada científicamente por Metternich, Meudt y Hartmann, el método incluye estos elementos [14]:

- **Alcance ampliado:** desde el primer contacto con el cliente hasta el uso del producto, en todos los departamentos que gestionan pedidos.
- **Cajas de proceso ampliadas:** con fuentes de información, intervalos de registro, tipo de registro (automatizado, semiautomatizado, manual) y valores actuales.
- **Medios de almacenamiento como líneas:** el papel, ERP, MES, Excel y otros medios de almacenamiento se dibujan como líneas horizontales y se conectan con las fuentes mediante líneas verticales.
- **Ocho tipos de desperdicio en la logística de la información**, organizados a lo largo del ciclo de vida de los datos: en la creación y la transferencia (selección de datos, calidad de los datos, captura de datos, transferencia de datos), en el procesamiento y el almacenamiento (espera e inventario de información; transporte, movimiento y búsqueda) y en el uso (análisis de datos, apoyo a la decisión).
- **Métricas:** disponibilidad de la información, uso de la información y grado de digitalización.

En el ejemplo de un fabricante de maquinaria especial, el análisis encontró doce medios de almacenamiento en uso, entrada manual y duplicada de datos, y un grado de digitalización y de uso de datos de un 0 % en ambos casos [14].

Bega y sus colegas ampliaron Value Stream Mapping 4.0 en 2023 en la revista Production Engineering para la identificación integral de los flujos de datos e información [26]. Esto demuestra que Value Stream 4.0 no es un método terminado, sino un campo de investigación activo.

En 2018, Jörg Drees adoptó una perspectiva relacionada desde la óptica de un proveedor de software en ZWF, con el título "Wertstrom Management 4.0: Next Generation": la creciente interconexión de la información mediante la Industria 4.0 y el internet industrial de las cosas (IIoT) genera nuevas expectativas, y el método y el software deben adaptarse a las nuevas formas de organizar y controlar la cadena de valor [17].

## 13. Gestión del flujo de valor: dirigir el flujo de valor como tarea de liderazgo

Un proyecto de mapeo del flujo de valor tiene un inicio y un final. La **gestión del flujo de valor** es continua. Significa dirigir un flujo de valor a través de los límites departamentales a largo plazo, con actualizaciones periódicas del mapa, objetivos a nivel de flujo de valor y responsabilidades claras. Una introducción detallada se encuentra en la entrada [¿Qué es la gestión del flujo de valor?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/).

Lugert y Winkler sostienen que las soluciones técnicas de la Industria 4.0 por sí solas no bastan para convertir el mapeo estático del flujo de valor en un enfoque de gestión dinámico. La organización y las personas deben considerarse por igual [23]. La norma ISO 22468:2020 refleja este ciclo en su estructura: análisis, diseño, planificación, evaluación y ajuste de los flujos de valor [40].

### El ciclo de gestión del flujo de valor

1. **Analizar:** registrar el estado actual, idealmente con datos recopilados automáticamente.
2. **Diseñar:** dibujar el estado futuro utilizando las directrices de diseño, idealmente validado mediante simulación.
3. **Planificar:** plan de implementación por bucle de flujo de valor, con objetivos y responsables.
4. **Implementar:** acciones en eventos kaizen y en el trabajo diario.
5. **Evaluar:** hacer seguimiento continuo de las métricas y valorar el impacto en dinero [25].
6. **Ajustar:** actualizar el mapa y derivar el siguiente estado futuro.

### El papel del gestor del flujo de valor

LEI describe al gestor del flujo de valor como "una persona a la que se asigna una responsabilidad clara por el éxito de un flujo de valor". Esta persona identifica el valor desde la perspectiva del cliente, diseña el flujo de valor e impulsa hacia un flujo cada vez más rápido. Como el dinero, los activos y las personas suelen depender de los departamentos funcionales, el gestor del flujo de valor "lidera por influencia, no por posición". LEI señala al ingeniero jefe de Toyota como modelo del puesto [10].

En la práctica, el gestor del flujo de valor normalmente:

- es responsable de los mapas del estado actual y futuro y del plan de implementación
- facilita la revisión periódica del flujo de valor
- hace seguimiento de las métricas del flujo de valor (lead time, inventario, entrega a tiempo, productividad)
- resuelve los conflictos de objetivos entre departamentos
- escala los obstáculos a la dirección de planta

La entrada [Gestor del flujo de valor: funciones y responsabilidades](https://www.m365.fm/community/u/mirko-p/blog/value-stream-manager-role-responsibilities/) describe en detalle el perfil, la autoridad y los errores habituales de este puesto. Cómo el software respalda la gestión del flujo de valor en la fabricación se trata en [Software de gestión del flujo de valor en la fabricación](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/).

La gestión del flujo de valor está estrechamente ligada al [management Lean](https://www.m365.fm/entity/lean-management/) en su conjunto; véanse las guías [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) y [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/). Las rutinas diarias que mantienen vivo un estado futuro, como las reuniones escalonadas y los gemba walks, son el tema de la guía [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/).

## 14. Errores comunes en el mapeo de flujo de valor y cómo evitarlos

| Error | Consecuencia | Contramedida |
|---|---|---|
| mapear en el escritorio con datos del ERP | el mapa muestra tiempos estándar, no la realidad | registrar en el gemba con cronómetro y conteos |
| no definir una familia de productos | el mapa queda sobrecargado y no puede evaluarse | matriz producto-proceso antes del primer recorrido |
| demasiado detalle | el equipo de trabajo se pierde en pasos individuales | dibujar una caja de proceso solo donde el flujo se detiene |
| omitir el flujo de información | la causa del inventario sigue sin estar clara | preguntar en cada proceso: ¿cómo sabe qué producir? |
| no incluir la disponibilidad | se pasan por alto los cuellos de botella | comparar el tiempo de ciclo efectivo con el takt time |
| solo estado actual, sin estado futuro | análisis sin impacto | el diseño del estado futuro y el plan de implementación son obligatorios |
| estado futuro como imagen ideal sin plan | frustración, nada sucede | bucles del flujo de valor con objetivos, responsables y fechas |
| empleados no involucrados | resistencia, datos incorrectos | validar el mapa junto con las áreas |
| proyecto puntual sin responsable | el mapa queda desactualizado en semanas | designar un gestor del flujo de valor y fijar un ritmo de revisión |
| digitalizar antes de estabilizar | el desperdicio se automatiza | estabilizar primero el flujo, luego digitalizar [14] |
| bases de tiempo distintas para el estado actual y el futuro | las razones de flujo no son comparables | fijar la convención (días laborables o días naturales) una sola vez |

## 15. Software de mapeo de flujo de valor: categorías comparadas

Quienes buscan "software de mapeo de flujo de valor" quieren sobre todo saber qué herramienta encaja, qué funciones debe tener y si existen opciones gratuitas. En lugar de un ranking de productos individuales, resulta útil una división por categorías, porque las herramientas se diferencian menos en el dibujo que en lo que ocurre después de dibujar.

| Categoría | Ejemplos típicos | Fortalezas | Límites | Mejor para |
|---|---|---|---|---|
| Papel y pizarra | papel de embalaje, notas adhesivas, lápiz | máxima participación, no requiere habilidades con herramientas, gratuito | sin cálculo, difícil de compartir y versionar | primer mapa en el gemba, formación |
| Software general de diagramas y pizarra | Microsoft Visio, Lucidchart, Miro, EdrawMax | bibliotecas de símbolos, colaboración, a menudo niveles de entrada gratuitos | métricas mayormente manuales, sin lógica detrás de los símbolos | documentación, equipos distribuidos |
| Software VSM especializado con cálculo de métricas | iFAKT Polaris VSM, SimVSM (SimPlan), visTable | símbolos con fórmulas integradas, línea de tiempo automática, comparación de variantes y escenarios | costes de licencia, curva de aprendizaje | trabajo regular con flujos de valor, gestión del flujo de valor |
| Software VSM con enlace a simulación | SimVSM Pro [34], Plant Simulation X con VSM Library [35] | análisis dinámico, prueba del estado futuro | mayor esfuerzo de modelado y datos | producción de alta variedad, decisiones de inversión |
| Análisis basado en datos / minería de procesos | ONIQ [36], enfoques de investigación como ECOWERT [20] | métricas a partir de datos de producción, análisis continuo en lugar de puntual | la calidad de los datos y la integración de TI son decisivas | plantas con una base de datos MES/ERP |
| Plataformas de gestión del flujo de valor (entrega de software) | plataformas según la definición de mercado de Gartner [31] | medición de extremo a extremo de la cadena de entrega de software | no diseñadas para la producción física | organizaciones de TI y desarrollo de software |

Lea las afirmaciones de los proveedores con espíritu crítico. ONIQ, por ejemplo, afirma que la automatización reduce el esfuerzo del análisis del flujo de valor hasta en un 90 % [36]; no se ha publicado ninguna metodología independiente. SimPlan describe SimVSM como una herramienta que cubre el registro digital y las cifras clave estáticas, mientras que SimVSM Pro añade parámetros dinámicos y una interfaz con la simulación [34].

### Criterios de selección

- **Símbolos:** ¿La herramienta admite los símbolos habituales de Rother/Shook y se pueden añadir símbolos propios?
- **Lógica de cálculo:** ¿Se calculan automáticamente el takt time, los días de inventario, el lead time y la relación de flujo? ¿Son transparentes y ajustables las fórmulas?
- **Escenarios:** ¿Se pueden versionar y comparar los estados actual, futuro e intermedios?
- **Dinámica:** ¿Existe una simulación o un enlace a una herramienta de simulación?
- **Conexión de datos:** ¿Puede la herramienta arrancar sin conexión a ERP o MES y asumir los datos automáticamente más adelante?
- **Implantación:** ¿Se gestionan en la misma herramienta las acciones, los kaizen bursts y los responsables?
- **Colaboración y operación:** roles y permisos, multitenencia, nube o instalación local, integración en el paisaje de TI existente (para plantas basadas en Microsoft, véase la guía [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)).
- **Coste:** modelo de licencias, prueba gratuita, esfuerzo de formación.

Una buena pregunta de control: ¿la herramienta solo sirve para documentar el estado actual o también permite dirigir el estado futuro mientras la planta cambia semana tras semana?

## 16. Mapeo digital de la cadena de valor con iFAKT Polaris VSM y BSM

> **Nota: el autor trabaja en iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), con sede en Stuttgart (Alemania), fue fundada en 2001, según indica la empresa [19]. Empleados de la compañía escribieron varios de los artículos de ZWF sobre mapeo dinámico y digital de la cadena de valor citados en esta guía (resumen en la sección 18, "Publicaciones de investigación"). La familia de software [iFAKT Polaris](https://www.m365.fm/entity/polaris/) surgió de este trabajo; existe una guía aparte en [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/). Dos módulos son relevantes para el mapeo de la cadena de valor:

**[Polaris VSM](https://www.m365.fm/entity/polaris-vsm/)** es una herramienta digital de gestión Lean que los fabricantes utilizan para mapear cadenas de suministro y cadenas de valor. Según la publicación de Microsoft sobre su ficha en AppSource, las métricas pueden calcularse, verificarse y visualizarse mediante un sistema de fórmulas, complementado con tableros Kanban y Kaizen y colaboración desde cualquier ubicación [29]. En ifakt.de, el proveedor enumera estas funciones [28]:

- mapas de cadena de valor con arrastrar y soltar, con símbolos estándar y jerarquías de varios niveles
- métricas automáticas como lead time, cycle time, proporción de valor añadido y OEE en paneles, con informes listos para exportar
- escenarios ilimitados, análisis de sensibilidad, historial de versiones con restauración y comparación de métricas lado a lado
- permisos basados en roles, multitenencia y documentación PDCA
- arranque sin conexión a ERP o MES, con conexión de datos opcional más adelante

En el proyecto de investigación ECOWERT, Polaris VSM sirvió como herramienta de evaluación de los datos recopilados automáticamente (véase la sección 11) [21]. El proveedor no enumera una función de simulación en sentido estricto; para el análisis dinámico se necesita una herramienta de la categoría "enlace a simulación" (sección 15). Las cifras de beneficio de la página del proveedor (como un lead time un 25 % más corto) no se repiten aquí porque no se indica la metodología.

**[Polaris BSM](https://www.m365.fm/entity/polaris-bsm/)** (Business Swimlane Modeling) añade procesos de negocio a la vista de la cadena de valor. Según la ficha en AppSource, los pasos del proceso se agrupan en pools y lanes, y se registran y comparan factores de tiempo y métricas; los planes van desde "Read Only" hasta "Basic" (grabaciones BPMN, plantillas de swimlane, fórmulas básicas, lead time y gráfico de equilibrio), pasando por "Excellence" e "Integrate & Customize" [30]. Esto resulta útil cuando la cadena de valor no empieza en producción, sino en la cotización, la ingeniería y la gestión de pedidos.

Ambos módulos figuran en Microsoft AppSource [29][30]. El proveedor no publica precios; bajo petición hay una demostración disponible [30].

**Valoración:** Una herramienta como Polaris VSM no sustituye ir al gemba ni diseñar el estado futuro. Se encarga de los cálculos, hace comparables los escenarios y puede mantener el mapa actualizado cuando los datos fluyen automáticamente. Si encaja en su planta depende de la variedad de productos, de los datos disponibles y del paisaje de TI. Compárela con los criterios de selección de la sección 15, como cualquier otra solución.

## 17. Gestión del flujo de valor en el desarrollo de software: en qué se diferencia

Si buscas "value stream mapping" o "value stream management" en google.com, muchos resultados proceden del desarrollo de software y DevOps. Gartner describe las plataformas de gestión del flujo de valor como herramientas que "permiten a las organizaciones optimizar la entrega de productos de extremo a extremo y mejorar los resultados de negocio"; son independientes de la herramienta y se conectan a las herramientas existentes a lo largo del ciclo de vida de la entrega de software [31]. El Flow Framework de Mik Kersten en "Project to Product" (IT Revolution, 2018) introdujo para este ámbito métricas como el tiempo de flujo y la carga de flujo [39].

La idea básica es la misma que en la fábrica: hacer visible el flujo desde la solicitud del cliente hasta la entrega y reducir las esperas. Sin embargo, las diferencias son grandes. En la entrega de software fluyen elementos de trabajo en lugar de material, el inventario son tickets sin terminar y el takt time es difícil de definir de forma significativa. Martin y Osterling trasladaron el método al trabajo de oficina y al trabajo intelectual y situaron en el centro métricas como el porcentaje completo y correcto (%C&A): la proporción de trabajo que el paso siguiente encuentra completo y sin errores. Multiplicado por todos los pasos, da el %C&A acumulado, que el glosario de Martin denomina rolled first pass yield [6][44]. Para la fabricación, el método clásico con takt time, inventario y tiempo de ciclo sigue siendo el punto de referencia.

## 18. Evidencia y publicaciones de investigación

Las cifras de casos sólidas y publicadas de forma independiente para el mapeo del flujo de valor son más escasas de lo que sugieren las numerosas afirmaciones de éxito en internet. Estos están documentados:

- **Fabricante de maquinaria especial (TU Darmstadt / VDMA):** doce medios de almacenamiento y un grado de digitalización del cero por ciento (detalles en la sección 12) [14].
- **ECOWERT (Fraunhofer IPA e iFAKT):** análisis del flujo de valor casi en tiempo real con sensores retrofit (detalles en la sección 11) [20][21].
- **HELLA (ZWF 2018):** desarrollo de un modelo de valoración basado en costes para las acciones del flujo de valor junto con el proveedor de automoción alemán HELLA GmbH & Co. KGaA, para priorizar mejoras competidoras en términos de negocio [25].
- **Schaeffler (ZWF 2017):** Andreas Lugert, gestión Lean en Schaeffler AG, y Herwig Winkler (BTU Cottbus-Senftenberg) describen el camino desde el mapeo estático del flujo de valor hasta la gestión dinámica del flujo de valor [23].
- **Thrustmaster of Texas (LEI):** informe de caso sobre el diagrama de espagueti como complemento del análisis de flujo, con una entrega puntual del 100 % informada 18 meses después [43].

El conocido caso de libro de texto "Acme Stamping" de *Learning to See* es ficticio [1], pero resulta muy útil para la práctica.

### Publicaciones de investigación sobre mapeo dinámico y digital del flujo de valor

Los siguientes artículos fueron escritos por autores de iFAKT GmbH, en parte junto con Fraunhofer IPA. Están en alemán y se pueden comprobar por DOI en la editorial. En conjunto trazan la evolución desde el cálculo de métricas pasando por la simulación hasta una interfaz de datos basada en eventos:

| Año | Título (traducción al inglés) | Autores | Publicación |
|---|---|---|---|
| 2011 | Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung (Optimización de la producción mediante métricas de modelado del flujo de valor) | J. Drees, C. Sack | ZWF 106 (6), pp. 466–470, DOI 10.3139/104.110589 [19] |
| 2014 | Dynamische Simulation von Wertströmen (Simulación dinámica de flujos de valor) | S. Türck, A. Weimer, [L. Schubert](https://www.m365.fm/entity/lars-schubert/), [J. Drees](https://www.m365.fm/entity/jorg-drees/) | ZWF 109 (11), pp. 839–842, DOI 10.3139/104.111242 [16] |
| 2018 | Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation (Nuevas perspectivas para el método del flujo de valor) | J. Drees | ZWF 113 (9), pp. 605–609, DOI 10.3139/104.111974 [17] |
| 2023 | Universelle Datenschnittstelle für digitale Wertstromdienste (Interfaz de datos universal para servicios digitales de flujo de valor) | M. Böhm, J. Drees, B. Sai, K. Erlach, S. Stambera, T. Teriete | ZWF 118 (5), pp. 293–297, DOI 10.1515/zwf-2023-1062 [18] |
| 2023 | Daten für Wertstromanalysen automatisch erfassen (Captura automática de datos para análisis del flujo de valor) | J. Drees, S. Stambera, M. Böhm | IT&Production, 12 de enero de 2023 [21] |

Otros artículos independientes de ZWF sobre la ampliación del método incluyen Lugert/Winkler (2017) [23], Busch/Niehues/Maassen (2018) [25] y Urnauer (2019) [24]. En inglés, las principales líneas de investigación son Meudt et al. en CIRP Annals (2017) [13] y Bega et al. en Production Engineering (2023) [26].

## 19. FAQ: Preguntas frecuentes sobre el mapeo de la cadena de valor

### ¿Qué es el mapeo de la cadena de valor en términos sencillos?
Un mapa de la cadena de valor es un mapa de una sola página de su flujo de producción. Símbolos simples muestran por qué procesos pasa un producto, dónde se almacena el material, cuánto tiempo tarda cada paso y qué información controla los procesos. Muestra cuán poco del tiempo de entrega realmente aporta valor.

### ¿Cuáles son los pasos del mapeo de la cadena de valor?
Definir el objetivo y el alcance, definir la familia de productos, capturar la demanda del cliente y el takt time, recorrer el proceso hacia atrás desde el envío, completar los cuadros de datos, contar el inventario, agregar proveedores y transporte, dibujar el flujo de información, dibujar la línea de tiempo y calcular las métricas, y luego marcar el desperdicio y validar el mapa. Después vienen el mapa del estado futuro y el plan de implementación. La sección 5 explica cada paso.

### ¿Cuál es la diferencia entre el mapa del estado actual y el mapa del estado futuro?
El mapa del estado actual registra cómo fluyen hoy el material y la información, con datos medidos. El mapa del estado futuro diseña cómo deberían fluir, siguiendo pautas como producir al ritmo del takt time, flujo continuo cuando sea posible, supermercados cuando el flujo no sea posible y un proceso marcapasos [11]. Juntos forman el método de la cadena de valor, seguido de un plan de implementación.

### ¿Cuál es la diferencia entre el mapeo de la cadena de valor y el mapeo de procesos?
Un mapa de procesos muestra los pasos de un procedimiento, a menudo dentro de un solo departamento. Un mapa de la cadena de valor abarca una familia de productos de principio a fin y añade lo que a un mapa de procesos le falta: el inventario entre pasos, el flujo de información que controla la producción y una línea de tiempo con el tiempo de entrega y el tiempo de procesamiento.

### ¿Cuál es la diferencia entre el mapeo de la cadena de valor y la gestión de la cadena de valor?
El mapeo de la cadena de valor es un proyecto: un equipo registra el estado actual y diseña un estado futuro. La gestión de la cadena de valor es el liderazgo continuo de la cadena de valor por parte de un gerente responsable, con un mapa actualizado con regularidad, métricas y revisiones. La norma ISO 22468:2020 describe este ciclo de análisis, diseño, planificación, evaluación y ajuste [40].

### ¿Qué símbolos se usan en el mapeo de la cadena de valor?
Los más importantes son el cuadro de proceso, el cuadro de datos, el triángulo de inventario, la flecha de empuje, el supermercado, el carril FIFO, el camión, los símbolos kanban, las flechas de información manual y electrónica, la caja heijunka, la explosión kaizen y la línea de tiempo. La tabla completa está en la sección 4.

### ¿Qué métricas van en un mapa de la cadena de valor?
Por proceso: tiempo de ciclo, tiempo de cambio, disponibilidad (tiempo de operación), tamaño de lote y dotación de personal. Por punto de inventario: cantidad y días de inventario. Para toda la cadena: takt time, tiempo de entrega, tiempo de procesamiento y razón de flujo. Las fórmulas están en la sección 6.

### ¿Cómo se calcula la eficiencia del ciclo de proceso (razón de flujo)?
Divida el tiempo de procesamiento (más el tiempo de proceso, como el curado) entre el tiempo de entrega y multiplique por 100 %. Exprese ambos en la misma unidad y sobre la misma base (días laborables o días naturales). En el ejemplo de la sección 7: 413 s ÷ 1.080.000 s = 0,038 %.

### ¿Por qué se mapea desde el cliente hacia atrás?
Porque el cliente marca el ritmo. Si empieza en el envío y avanza hacia atrás, primero registra los procesos que deberían controlar el flujo y evalúa todos los demás según la demanda del cliente [1][27].

### ¿Cuánto tiempo lleva el mapeo de la cadena de valor?
Para una cadena de valor manejable en una planta, de uno a dos días para el estado actual y otro taller para el estado futuro son realistas [unverified: estimación sin fuente verificada]. ASQ describe un evento kaizen de tres días para el arranque [46]. El esfuerzo real es la implementación, que lleva meses.

### ¿Es el mapeo de la cadena de valor Lean o Six Sigma?
Es una herramienta Lean del Sistema de Producción Toyota, y ASQ la clasifica dentro de Lean [46]. La Wikipedia en inglés la llama «un método reconocido utilizado como parte de las metodologías Lean Six Sigma» [49]. No necesita estadística Six Sigma para funcionar.

### ¿Cuáles son las desventajas del mapeo de la cadena de valor?
Es una fotografía basada en promedios, muestra mal la variedad de productos y la variabilidad, requiere recolección manual de datos y no permite probar el estado futuro [22][23]. La simulación dinámica y la recolección automática de datos cierran parte de estas brechas.

### ¿Qué es el mapeo dinámico de la cadena de valor?
Es el mapeo de la cadena de valor que tiene en cuenta el comportamiento en el tiempo. Los procesos reciben distribuciones en lugar de promedios, la demanda sigue series temporales y una simulación muestra cómo evolucionan el inventario y los tiempos de entrega con el paso del tiempo [16].

### ¿Existe una norma para el mapeo de flujo de valor?
Sí. ISO 22468:2020 "Value stream management (VSM)" abarca el análisis, el diseño, la planificación y la evaluación y el ajuste de los flujos de valor [40]. ISO confirmó su vigencia en 2025. En Alemania, la directriz VDI 2870 sobre sistemas de producción holísticos también es pertinente [7].

### ¿Existe un software gratuito para el mapeo de flujo de valor?
Muchas herramientas generales de diagramación ofrecen niveles gratuitos de entrada con símbolos de VSM, y las plantillas de hoja de cálculo son habituales. Por lo general no calculan las métricas de forma automática. El software especializado de VSM suele ser de pago, a menudo con una prueba. Para tu primer mapa, el papel y el lápiz siguen siendo la mejor opción gratuita.

### ¿Puede un MES reemplazar el mapeo de flujo de valor?
No. Un MES aporta datos valiosos, como tiempos de ciclo, tiempos de parada e inventario, que pueden alimentar un mapa de flujo de valor digital [20]. Diseñar el flujo, es decir, decidir sobre supermercados, carriles FIFO y el pacemaker, sigue siendo tarea del método de flujo de valor y de las personas que lo aplican.

## 20. Conclusión

Desde la aparición de "Learning to See" en 1998, el mapeo de flujo de valor ha sido la herramienta estándar para hacer visible el flujo en la producción [1]. Su valor no está en el mapa en sí, sino en lo que el mapa desencadena: una comprensión compartida de todo el flujo, una cifra honesta para la relación de flujo y un estado futuro diseñado según pautas claras [3][11].

Quédate con tres puntos. Primero, calcula con cuidado. El takt time, el tiempo de ciclo efectivo, los días de inventario según la Ley de Little y una relación de flujo sobre una base temporal fija convierten un dibujo en una base fiable para tomar decisiones. Segundo, no te detengas en el estado actual. El diseño del estado futuro, un plan de implementación y un responsable del flujo de valor con rendición de cuentas determinan si algo cambia realmente. Tercero, utiliza las extensiones donde el método clásico alcanza sus límites. La simulación dinámica, los datos recopilados automáticamente y la visión de logística de información de Value Stream 4.0 preparan el método para una alta variedad de productos y plantas digitales [13][16][18], siempre que el flujo esté antes estabilizado [14].

Empieza con papel, un lápiz y una familia de productos. Pasa a lo digital cuando quieras actualizar el mapa con regularidad.

## Lecturas adicionales en m365.fm

**Entradas de blog**
- [¿Qué es la gestión del flujo de valor?](https://www.m365.fm/community/u/mirko-p/blog/what-is-value-stream-management/)
- [Responsable del flujo de valor: función y responsabilidades](https://www.m365.fm/community/u/mirko-p/blog/value-stream-manager-role-responsibilities/)
- [Software de gestión del flujo de valor en la fabricación](https://www.m365.fm/community/u/mirko-p/blog/value-stream-management-software-manufacturing/)
- [Símbolos e iconos del mapeo de flujo de valor explicados](https://www.m365.fm/community/u/mirko-p/blog/value-stream-mapping-symbols-icons/)

**Episodio de podcast**
- [Mapeo de flujo de valor con un modelo de datos en vivo](https://www.m365.fm/show/episodes/value-stream-mapping-live-data-model/)

**Glosario**
[Mapeo de flujo de valor](https://www.m365.fm/entity/value-stream-mapping/) · [Los ocho desperdicios](https://www.m365.fm/entity/eight-wastes/) · [Diagrama de espagueti](https://www.m365.fm/entity/spaghetti-diagram/) · [Lead time](https://www.m365.fm/entity/lead-time/) · [Tiempo de ciclo](https://www.m365.fm/entity/cycle-time/) · [Takt time](https://www.m365.fm/entity/takt-time/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Sistema pull](https://www.m365.fm/entity/pull-system/) · [Simulación de fábrica](https://www.m365.fm/entity/factory-simulation/) · [Gemelo digital](https://www.m365.fm/entity/digital-twin/) · [Gestión Lean](https://www.m365.fm/entity/lean-management/) · [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) · [Polaris BSM](https://www.m365.fm/entity/polaris-bsm/)

**Empresas y personas**
[iFAKT GmbH](https://www.m365.fm/entity/ifakt/) · [iFAKT Polaris](https://www.m365.fm/entity/polaris/) · [Lars Schubert](https://www.m365.fm/entity/lars-schubert/) · [Jörg Drees](https://www.m365.fm/entity/jorg-drees/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Guías relacionadas**
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Shop Floor Management](https://www.m365.fm/en/learn/shop-floor-management/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** es el anfitrión de m365.fm y trabaja en [iFAKT GmbH](https://www.m365.fm/entity/ifakt/) en Stuttgart, Alemania. En m365.fm escribe sobre gestión Lean, mapeo de la cadena de valor y la digitalización de la fabricación con Microsoft 365 y Azure. Su enfoque es cómo las herramientas Lean probadas, como el mapeo de la cadena de valor, se combinan con datos en tiempo real, simulación y plataformas de datos modernas sin perder su núcleo metodológico.

**Nota: el autor trabaja en iFAKT GmbH.** Los artículos de investigación de iFAKT citados pueden verificarse mediante DOI en ZWF.

# Sources

All sources accessed November 20, 2026. Sources marked "verified 11/20/2026" were opened for this English version; the others were verified for the German original on the same date and spot-checked.

1. Rother, M.; Shook, J.: Learning to See: Value Stream Mapping to Create Value and Eliminate Muda. Lean Enterprise Institute, 1998 (introduction dated May 1998, Ann Arbor); current edition subtitled "… to Add Value and Eliminate Muda", LEI, September 2018, 148 pages, ISBN 978-0-9667843-0-5. Publisher page (Shingo award 1999, Shook eleven years at Toyota): https://www.lean.org/store/workbooks/learning-to-see/ · Introduction (PDF): https://www.lean.org/wp-content/uploads/2021/01/Learning-to-See-introduction.pdf (verified 11/20/2026)
2. Rother, M.; Shook, J.: Sehen lernen. Mit Wertstromdesign die Wertschöpfung erhöhen und Verschwendung beseitigen. German edition, version 1.1. Lean Management Institut, Aachen 2004, ISBN 978-3-9809521-1-8 (German Digital Library catalog).
3. Erlach, K.: Wertstromdesign. Der Weg zur schlanken Fabrik. Springer, 1st ed. 2007; 2nd ed. 2010 (VDI-Buch), ISBN 978-3-540-89867-2; 3rd ed. Springer Vieweg, Berlin/Heidelberg 2020, ISBN 978-3-662-58906-9 (eBook 978-3-662-58907-6). Sample of 2nd ed.: https://lesejury.de/media/samples/672/9783540898672_leseprobe.pdf · Overview with the eight design guidelines: http://www.wertstromdesign.de/wertstromdesign.html (verified 11/20/2026)
4. Erlach, K.: Value Stream Design: The Way Towards a Lean Factory. Springer, Lecture Notes in Logistics, published September 2012 (copyright 2013), ISBN 978-3-642-12568-3 (hardcover), eBook 978-3-642-12569-0. https://link.springer.com/978-3-642-12568-3 · Publisher description ("ten design guidelines") via https://ebooks.mpdl.mpg.de/ebooks/Record/EB000384257 (verified 11/20/2026)
5. Klevers, T.: Wertstrom-Mapping und Wertstrom-Design. Verschwendung erkennen – Wertschöpfung steigern. mi-Fachverlag, Landsberg am Lech 2007, ISBN 978-3-636-03097-9 (bibliographic data per [27]).
6. Martin, K.; Osterling, M.: Value Stream Mapping: How to Visualize Work and Align Leadership for Organizational Transformation. McGraw-Hill, New York, published October 2013 (copyright 2014), ISBN 978-0-07-182891-8. https://www.mheducation.com/highered/mhp/product/value-stream-mapping-how-visualize-work-align-leadership-organizational-transformation.html (verified 11/20/2026)
7. VDI 2870 Part 1: Lean production systems; basic principles, introduction and review. VDI (Association of German Engineers), July 2012. https://vdi.de/richtlinien/details/vdi-2870-blatt-1-lean-production-systems-basic-principles-introduction-and-review
8. Takt Time (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/takt-time/ (verified 11/20/2026)
9. Seven Wastes (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/seven-wastes/ (verified 11/20/2026)
10. Value-Stream Manager (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/value-stream-manager/ (verified 11/20/2026)
11. Rother, M.; Shook, J.: 6 Guidelines for Moving Toward a Lean Value Stream. Lean Enterprise Institute, The Lean Post, October 19, 2022. https://www.lean.org/the-lean-post/articles/6-guidelines-for-moving-toward-a-lean-value-stream/ (verified 11/20/2026)
12. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. Operations Research 9 (3), 1961, pp. 383–387. DOI: 10.1287/opre.9.3.383. https://econpapers.repec.org/RePEc:inm:oropre:v:9:y:1961:i:3:p:383-387 (verified 11/20/2026)
13. Meudt, T.; Metternich, J.; Abele, E.: Value stream mapping 4.0: Holistic examination of value stream and information logistics in production. CIRP Annals 66 (1), 2017, pp. 413–416. DOI: 10.1016/j.cirp.2017.04.005 (bibliographic data per the reference list of [26]).
14. VDMA / PTW TU Darmstadt (Metternich, J.; Meudt, T.; Hartmann, L.): Leitfaden Industrie 4.0 trifft Lean, excerpt on Value Stream Mapping 4.0 (German). https://www.ptw.tu-darmstadt.de/media/fachgebietptw/dokumente_3/wissenssammlung_ptw/leitfaeden_2/Leitfaden_I40_Lean.pdf
15. Metternich, J.; Meudt, T.; Hartmann, L.: Value Stream 4.0: A Systems View of Information Flow for Digitalization. CRC Press, released July 20, 2025 (copyright 2026), ISBN 978-1-032-95831-6. https://www.routledge.com/Value-Stream-40-A-Systems-View-of-Information-Flow-for-Digitalization/Metternich-Meudt-Hartmann/p/book/9781032958316 (verified 11/20/2026)
16. Türck, S.; Weimer, A.; Schubert, L.; Drees, J. (iFAKT GmbH): Dynamische Simulation von Wertströmen. Zeitschrift für wirtschaftlichen Fabrikbetrieb (ZWF) 109 (11), 2014, pp. 839–842. DOI: 10.3139/104.111242. https://www.degruyterbrill.com/document/doi/10.3139/104.111242/html (verified 11/20/2026)
17. Drees, J. (iFAKT GmbH): Neue Perspektiven für die Wertstrom-Methode: Wertstrom Management 4.0 – Next Generation. ZWF 113 (9), 2018, pp. 605–609. DOI: 10.3139/104.111974. https://www.degruyterbrill.com/document/doi/10.3139/104.111974/html
18. Böhm, M.; Drees, J.; Sai, B.; Erlach, K.; Stambera, S.; Teriete, T. (Fraunhofer IPA, iFAKT GmbH): Universelle Datenschnittstelle für digitale Wertstromdienste. Eventbasierte Wertstromanalyse als einheitliche Datenbasis für individuelle Dienste zur Produktionsoptimierung. ZWF 118 (5), 2023, pp. 293–297. DOI: 10.1515/zwf-2023-1062. https://www.degruyterbrill.com/document/doi/10.1515/zwf-2023-1062/html
19. Drees, J.; Sack, C. (iFAKT GmbH): Produktionsoptimierung durch Kennzahlen der Wertstrom-Modellierung. ZWF 106 (6), 2011, pp. 466–470. DOI: 10.3139/104.110589. https://www.degruyterbrill.com/document/doi/10.3139/104.110589/html
20. ECOWERT – Echtzeitorientierte Wertstromanalyse für die nachhaltige Produktionsoptimierung (reference project). Fraunhofer IPA. https://www.ipa.fraunhofer.de/de/referenzprojekte/ECOWERT.html (verified 11/20/2026)
21. Drees, J.; Stambera, S.; Böhm, M.: Daten für Wertstromanalysen automatisch erfassen. IT&Production, January 12, 2023 (updated July 23, 2024). https://www.it-production.com/industrie-4-0-iot/wertstromanalyse-mit-iiot-anbindung/ (verified 11/20/2026)
22. Digitalized value stream analysis: We are automating the gemba walk. Fraunhofer IPA. https://www.ipa.fraunhofer.de/en/current-research/factory-planning-and-production-management/production-management-and-value-stream-mapping-and-design/WertstromDigital.html (verified 11/20/2026)
23. Lugert, A.; Winkler, H.: Von der Wertstromanalyse zum Wertstrommanagement. ZWF 112 (4), 2017, pp. 261–265. DOI: 10.3139/104.111703. https://www.degruyterbrill.com/document/doi/10.3139/104.111703/html
24. Urnauer, C.: Die digitale Wertstrommethode. ZWF 114, 2019 (issue and pages not shown at access). DOI: 10.3139/104.112203. https://www.degruyterbrill.com/document/doi/10.3139/104.112203/html
25. Busch, O.; Niehues, M.; Maassen, K.: Die monetäre Bewertung von Wertströmen. ZWF 113 (6), 2018, pp. 389–392. DOI: 10.3139/104.111935. https://www.degruyterbrill.com/document/doi/10.3139/104.111935/html
26. Bega, M.; Sapel, P.; Ercan, F.; Schramm, T.; Spitz, M.; Kuhlenkötter, B.; Hopmann, C.: Extension of value stream mapping 4.0 for comprehensive identification of data and information flows within the manufacturing domain. Production Engineering 17 (6), 2023, pp. 915–927. DOI: 10.1007/s11740-023-01207-5. https://link.springer.com/10.1007/s11740-023-01207-5
27. Wertstromanalyse. Wikipedia (German-language). https://de.wikipedia.org/wiki/Wertstromanalyse (verified 11/20/2026)
28. Polaris VSM – Digital Value Stream Tool in Lean Management (vendor page). iFAKT GmbH. https://www.ifakt.de/en/software/vsm/ (verified 11/20/2026)
29. Learn about iFAKT GmbH's ISV Success for Business Applications solution in Microsoft AppSource (Polaris VSM). Microsoft Tech Community, Marketplace Blog, July 11, 2024. https://techcommunity.microsoft.com/t5/marketplace-blog/learn-about-ifakt-gmbh-s-isv-success-for-business-applications/ba-p/4182536 (verified 11/20/2026)
30. Polaris BSM (Business Swimlane Modeling). Microsoft AppSource. https://appsource.microsoft.com/bg-bg/product/saas/ifaktgmbh.ifakt_bsm_1 (verified 11/20/2026)
31. Value Stream Management Platforms. Gartner Peer Insights. https://www.gartner.com/reviews/market/value-stream-management-platforms (verified 11/20/2026)
32. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press, 1988 (Japanese original 1978). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140
33. Liker, J. K.: The Toyota Way: 14 Management Principles from the World's Greatest Manufacturer. McGraw-Hill, New York 2004, ISBN 978-0-07-139231-0.
34. SimVSM – digital value stream analysis. SimPlan AG. https://www.simplan.de/en/software/simvsm (verified 11/20/2026)
35. Plant Simulation X – Value Stream Mapping. Siemens. https://www.siemens.com/en-us/products/tecnomatix/offerings/plant-simulation-x-value-stream-mapping/ (verified 11/20/2026)
36. Was ist eine Wertstromanalyse? (What is a value stream analysis?) ONIQ (German). https://oniq.com/de/ressourcen/was-ist-eine-wertstromanalyse (verified 11/20/2026)
37. Wertstromanalyse (REFA lexicon). REFA Bundesverband. https://refa.de/service/refa-lexikon/wertstromanalyse
38. Wertstromanalyse: Anleitung, Kennzahlen, Symbole. Industriezeitschrift (German). https://industriezeitschrift.de/qualitaet/wertstromanalyse/
39. Kersten, M.: Project to Product: How to Survive and Thrive in the Age of Digital Disruption with the Flow Framework. IT Revolution Press, Portland 2018, ISBN 978-1-942788-39-3.
40. ISO 22468:2020 Value stream management (VSM). ISO/TC 154, published March 9, 2020, confirmed June 25, 2025. https://committee.iso.org/standard/73292.html (verified 11/20/2026) · Table of contents (DIN): https://www.din.de/de/mitwirken/normenausschuesse/nia/veroeffentlichungen/wdc-beuth:din21:322285827/toc-3156892/download
41. Fuchs, H.-W.: Wertstrom-Methode (diploma thesis). Hochschule Mittweida. https://monami.hs-mittweida.de/frontdoor/deliver/index/docId/796/file/DA_Wertstrommethode.pdf
42. Wertstromanalyse (Value Stream Mapping). Mind Logistik (German). https://mind-logistik.de/knowhow/wertstromanalyse/
43. Small Chart, Big Impact: How a Simple Spaghetti Chart Led to Huge Wins at Thrustmaster of Texas. Lean Enterprise Institute, The Lean Post, February 4, 2016. https://www.lean.org/the-lean-post/articles/small-chart-big-impact-how-a-simple-spaghetti-chart-led-to-huge-wins-at-thrustmaster-of-texas/ (verified 11/20/2026)
44. The Karen Martin Group: Lean Terminology (glossary, PDF, 2014): definitions of activity ratio, lead time, process time, %C&A and rolled first pass yield. https://tkmg.com/wp-content/files/Lean-Terminology.pdf (verified 11/20/2026)
45. Value-Stream Mapping (Lexicon Term). Lean Enterprise Institute. https://www.lean.org/lexicon-terms/value-stream-mapping/ (verified 11/20/2026)
46. Value Stream Mapping. ASQ, Quality Resources (adapted from "Lean Lessons: Value Stream Mapping – An Introduction", Quality Progress). https://asq.org/quality-resources/lean/value-stream-mapping (verified 11/20/2026)
47. Lean and Process Improvement. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/lean-and-process-improvement (verified 11/20/2026)
48. Lean & Environment Toolkit, Chapter 3 (Value Stream Mapping). US Environmental Protection Agency. https://epa.gov/sustainability/lean-environment-toolkit-chapter-3 (verified 11/20/2026)
49. Value-stream mapping. Wikipedia (English). https://en.wikipedia.org/wiki/Value-stream_mapping (verified 11/20/2026)
50. ISA-95 framework and layers. Siemens. https://www.siemens.com/en-us/technology/isa-95-framework-layers/ (verified 11/20/2026)
51. 8 Wastes (DOWNTIME). GoLeanSixSigma.com. https://goleansixsigma.com/8-wastes/ (verified 11/20/2026)
