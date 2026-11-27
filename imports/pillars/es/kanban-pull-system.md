# SEO metadata

| Field | Value |
|---|---|
| Meta title | Kanban en fabricación: sistema pull lean, dimensionamiento, reglas |
| Meta description | Kanban en fabricación explicado: cómo funciona como sistema pull lean, tipos de tarjetas, fórmula de kanban, e-kanban, CONWIP, implantación y KPIs. |
| Slug | `kanban-pull-system` |

# Sistema Kanban en la Fabricación: cómo funcionan los sistemas pull, cómo dimensionarlos y cuándo usar otra solución

> **Respuesta breve:** Un sistema kanban es una forma de control de producción y de movimiento de materiales basada en tirar (pull), en la que una señal (una tarjeta, un contenedor vacío o un mensaje electrónico) autoriza a un proceso anterior a fabricar o mover una cantidad fija solo después de que el proceso posterior la haya consumido. El número de señales en un bucle limita el inventario. El Lean Enterprise Institute define un kanban como "un dispositivo de señalización que da autorización e instrucciones para la producción o el retiro (transporte) de artículos en un sistema pull" [1]; el método fue desarrollado en Toyota bajo la dirección de Taiichi Ohno [7][10].

> **Puntos clave**
> - Un sistema pull se define por una sola propiedad: limita explícitamente el trabajo en proceso (WIP) [2]. Kanban es el sistema pull más conocido, pero CONWIP, POLCA y drum-buffer-rope también lo son.
> - El kanban de fabricación (tarjetas, contenedores, supermercados) no es lo mismo que un tablero Kanban de software, aunque el método del tablero se derivó de aquel [22].
> - Tipos principales: kanban de producción, kanban de retiro (movimiento), kanban de señal (triángulo) y kanban de proveedor [1]. Los sistemas de dos contenedores y el e-kanban son formas física y digital de la misma lógica.
> - Dimensionamiento básico: número de kanbans = demanda × tiempo de reposición × (1 + factor de seguridad) ÷ cantidad por contenedor, redondeado hacia arriba. Los bucles reales también necesitan kanbans para los intervalos de recogida y los tamaños de lote aguas arriba [12][13][15].
> - El kanban necesita una demanda estable y repetitiva por número de parte, cambios de formato cortos y procesos fiables. Para trabajo de alta variedad y bajo volumen, CONWIP o POLCA suelen encajar mejor [3][20].
> - ERP/MRP y kanban no son rivales: MRP planifica la capacidad y los materiales de largo plazo, el kanban ejecuta la reposición diaria. La mayoría de los sistemas ERP tienen un módulo de kanban con su propia fórmula de dimensionamiento [15][16].
> - El kanban elimina el inventario excedente; los colchones estratégicos frente a interrupciones son una decisión de riesgo distinta. El propio Toyota ha mantenido un colchón deliberado de semiconductores desde un plan de continuidad introducido después de 2011 [26].

## Índice de contenidos

1. [¿Qué es un sistema kanban?](#qué-es-un-sistema-kanban)
2. [Kanban de fabricación frente a tableros Kanban: aclarando la confusión de búsqueda](#kanban-de-fabricación-vs-tableros-kanban-aclarando-la-confusión-de-búsqueda)
3. [Push frente a pull: qué es realmente un sistema pull](#empujar-vs-jalar-qué-es-realmente-un-sistema-de-jalar)
4. [Historia: del taller de máquinas de Toyota a la práctica global](#historia-del-taller-de-máquinas-de-toyota-a-la-práctica-global)
5. [Cómo funciona un bucle kanban, paso a paso](#cómo-funciona-un-ciclo-kanban-paso-a-paso)
6. [Tipos de kanban](#tipos-de-kanban)
7. [Las seis reglas kanban de Toyota](#las-seis-reglas-del-kanban-de-toyota)
8. [Cómo calcular el número de kanbans: fórmulas y ejemplos resueltos](#cómo-calcular-el-número-de-kanbans-fórmulas-y-ejemplos-resueltos)
9. [Supermercados, carriles FIFO y el proceso marcapasos](#supermercados-carriles-fifo-y-el-proceso-marcapasos)
10. [Heijunka: nivelar la programación de la que depende el kanban](#heijunka-nivelar-el-programa-del-que-depende-el-kanban)
11. [Más allá del kanban: CONWIP, POLCA y drum-buffer-rope](#más-allá-del-kanban-conwip-polca-y-drum-buffer-rope)
12. [E-kanban y la interacción ERP/MRP](#kanban-electrónico-y-la-interacción-entre-erp-y-mrp)
13. [Plantillas: tarjeta, hoja de dimensionamiento, lista de verificación de supermercado, auditoría](#plantillas-tarjeta-hoja-de-cálculo-de-dimensionamiento-lista-de-verificación-del-supermercado-auditoría)
14. [Cómo implementar kanban en fabricación: una hoja de ruta de 26 semanas](#cómo-implantar-kanban-en-la-fabricación-una-hoja-de-ruta-de-26-semanas)
15. [KPI de kanban y la visión financiera](#kpi-de-kanban-y-perspectiva-financiera)
16. [Errores comunes de kanban y cómo corregirlos](#errores-comunes-con-kanban-y-cómo-corregirlos)
17. [Límites: cuándo kanban es la herramienta equivocada](#límites-cuándo-el-kanban-es-la-herramienta-equivocada)
18. [Glosario de kanban](#glosario-de-kanban)
19. [Preguntas frecuentes: sistema kanban y sistema pull](#preguntas-frecuentes-sistema-kanban-y-sistema-pull)
20. [Conclusión y primeros pasos](#conclusión-y-primeros-pasos)

## ¿Qué es un sistema kanban?

Un sistema kanban es un conjunto de reglas y señales que vincula la producción y el movimiento de materiales con el consumo real. Cuando un proceso posterior consume un contenedor de piezas, el contenedor vacío o su tarjeta regresa al proceso anterior. Esa señal es la única autorización para fabricar o mover un reemplazo. Sin señal, no hay producción. La palabra japonesa kanban significa "señal" o "letrero" [1]. En la práctica, kanban es un sistema visual. Un contenedor vacío o una tarjeta en un puesto es una señal visual, una de las pistas visuales más sencillas en el piso de producción: cualquiera puede leerla sin un informe ni una pantalla.

Tres elementos hacen que un sistema kanban funcione:

1. **Un número fijo de señales por bucle.** Cada tarjeta o contenedor representa un contenedor con una cantidad fija. El número de tarjetas en circulación es el inventario máximo que ese bucle puede contener.
2. **Un punto de almacenamiento definido.** Las piezas esperan en un supermercado o en el punto de uso, en una dirección impresa en la tarjeta [1].
3. **Reglas que todos siguen.** No se fabrica nada sin un kanban, la tarjeta permanece con las piezas y los defectos no se pasan al siguiente proceso [10][11].

Una tarjeta kanban normalmente muestra el nombre de la pieza, el número de pieza, el proveedor externo o el proceso interno de suministro, la cantidad de empaque, la dirección de almacenamiento y la dirección del proceso consumidor [1]. Los kanban pueden ser tarjetas de papel, placas metálicas, contenedores vacíos, bolas de colores o mensajes electrónicos; el medio importa menos que la disciplina.

### Kanban, pull y justo a tiempo: cómo se relacionan los términos

Los tres términos suelen usarse como sinónimos. No lo son:

| Término | Qué es | Relación |
|---|---|---|
| Justo a tiempo (JIT) | Un principio de producción: fabricar solo lo necesario, cuando se necesita, en la cantidad necesaria [8] | Uno de los dos pilares del Sistema de Producción Toyota, junto con jidoka [8] |
| Sistema pull | Una lógica de control que limita explícitamente el WIP, de modo que el trabajo solo se inicia cuando hay espacio o demanda aguas abajo [2] | El mecanismo que hace posible el JIT |
| Kanban | Un dispositivo de señalización específico y un conjunto de reglas que implementan el pull [1] | Una forma de construir un sistema pull; otras son CONWIP, POLCA y drum-buffer-rope |

Toyota describe en términos sencillos el bucle de reposición detrás del JIT: un mínimo de piezas se encuentra en la línea, y los procesos anteriores reponen lo que toman los procesos posteriores, de modo que solo se fabrica lo que se vende (parafraseado de la página TPS de Toyota) [8]. Kanban es el sistema de instrucciones que sostiene ese bucle. Por eso kanban es una de las herramientas centrales de la manufactura esbelta: convierte el principio lean de pull en una rutina diaria. Kanban no elimina por sí solo el desperdicio, pero limita la sobreproducción, uno de los siete desperdicios de Ohno, y hace visible el desperdicio restante.

### Beneficios de un sistema kanban en la manufactura

Los beneficios del kanban se derivan del límite de WIP, no de las tarjetas:

- **Inventario más bajo y predecible.** El bucle no puede contener más que tarjetas × cantidad por contenedor, lo que limita el inventario excesivo, el espacio de almacenamiento y los costos de inventario.
- **Menor tiempo de entrega.** Según la ley de Little, el tiempo de entrega promedio es igual al WIP promedio dividido por el rendimiento [6]. Limitar el WIP limita el tiempo de entrega.
- **Problemas visibles.** Cuando un bucle se queda corto, todos lo ven. Ese es el propósito de la regla de Toyota de reducir los kanban paso a paso [10].
- **Menos esfuerzo de programación.** Solo un proceso, el marcapasos, recibe un programa; los procesos anteriores siguen las señales.
- **Menos urgencias de expedición.** La reposición es rutinaria en lugar de una excepción.

Estos beneficios son condicionales. Muchas páginas web citan reducciones del 25 por ciento en inventario o del 50 por ciento en tiempo de entrega sin indicar la planta, la línea base o el método. Esta guía no repite esas cifras. Lo que es medible en su propia planta se muestra en la sección de KPI, con fórmulas.

## Kanban de fabricación vs. tableros Kanban: aclarando la confusión de búsqueda

Si buscó "sistema kanban" y esperaba notas adhesivas en una pizarra o una herramienta de gestión de proyectos, llegó a la rama de fabricación de un mismo árbol genealógico. El significado de software, a menudo escrito con K mayúscula como "el Método Kanban", se describe en Wikipedia como "un método lean para gestionar y mejorar el trabajo en sistemas humanos"; el libro de David J. Anderson de 2010 *Kanban: Successful Evolutionary Change for Your Technology Business* describió cómo evolucionó a partir de proyectos en Microsoft y Corbis, y el método tiene sus raíces en la producción just-in-time de Toyota [22].

Ambos comparten la idea de limitar la cantidad de trabajo en proceso (WIP). En casi todo lo demás difieren:

| Aspecto | Kanban de fabricación | Tablero Kanban (trabajo de conocimiento) |
|---|---|---|
| Qué fluye | Piezas físicas en contenedores estándar | Tareas, tickets, historias de usuario |
| La señal | Tarjeta, contenedor vacío o mensaje electrónico que autoriza una cantidad fija | Una tarjeta que representa un elemento de trabajo; límites de WIP por columna |
| Quién jala | El proceso posterior toma las piezas; el anterior repone exactamente esa cantidad | Un miembro del equipo toma el siguiente elemento cuando se libera capacidad |
| Dimensionamiento | Fórmula basada en demanda, tiempo de reposición, tamaño del contenedor y seguridad | Límites de WIP definidos por el criterio del equipo y métricas de flujo |
| Fallo típico | Desabastecimientos, supermercados desbordados, tarjetas perdidas | Columnas sobrecargadas, trabajo oculto |
| Textos normativos principales | Libro de Ohno sobre el TPS, léxico LEI, manuales de Toyota [1][9][11] | Anderson (2010) y posterior literatura del Método Kanban [22] |

Algunas páginas web mezclan ambos significados, por ejemplo al comparar kanban con Scrum en una página sobre inventario de fabricación. Eso confunde a los lectores de planta. El resto de esta guía trata sobre el sistema kanban de fabricación: piezas, contenedores, lazos, fórmulas. Si necesita crear un tablero kanban para un equipo de ingeniería u oficina, o para un flujo de trabajo de software ágil, los principios de los límites de WIP y de un flujo de trabajo visible se trasladan, pero las fórmulas de dimensionamiento de abajo no.

## Empujar vs. jalar: qué es realmente un sistema de jalar

La explicación cotidiana es "empujar produce para pronóstico, jalar produce para la demanda." Eso se acerca, pero no es lo bastante preciso para diseñar un sistema. Wallace Hopp y Mark Spearman propusieron una definición más clara: "Un sistema de producción pull es aquel que limita explícitamente la cantidad de trabajo en proceso que puede haber en el sistema" [2]. Su artículo sostiene que la literatura de práctica ha simplificado en exceso el pull y el lean, y que el pull es, en esencia, una forma de limitar el WIP [2].

Esa definición tiene consecuencias prácticas:

- **Una línea de producción para stock con kanban es pull,** porque las tarjetas limitan el WIP y el stock de producto terminado.
- **Una línea de producción por pedido de cliente también puede ser pull,** si los pedidos entran solo cuando un límite de WIP lo permite (CONWIP, POLCA).
- **Una planta que "fabrica según pedidos de clientes" pero libera cada pedido al taller en cuanto se registra es push,** aunque la demanda sea real. El WIP crece con la cartera de pedidos.

El enfoque tradicional de fabricación es push. Un sistema de planificación, normalmente la planificación de necesidades de materiales (MRP) dentro de un paquete de planificación de recursos empresariales (ERP), usa pronósticos y datos históricos para determinar el volumen de producción y libera órdenes de trabajo antes de recibir un pedido del cliente. En un sistema pull, las actividades de producción solo comienzan cuando el consumo posterior o un pedido del cliente libera espacio bajo el límite de WIP. En términos simples, un sistema pull es un método de control de producción impulsado por la demanda real; los dos sistemas difieren menos en sus datos que en lo que dispara el trabajo.

### La ley de Little: por qué limitar el WIP limita el lead time

John Little publicó la demostración de la fórmula de colas L = λW en 1961 [6]. En términos de fábrica: WIP promedio = throughput × lead time promedio, o lead time = WIP ÷ throughput.

**Ejemplo resuelto.** Una celda de mecanizado entrega 400 piezas por día. Un conteo en piso encuentra 3.200 piezas de WIP entre el corte y la inspección final. Lead time promedio = 3.200 ÷ 400 = 8 días. Si un sistema pull limita el WIP a 1.200 piezas y el throughput se mantiene en 400 por día, el lead time promedio baja a 1.200 ÷ 400 = 3 días. Las máquinas no se volvieron más rápidas. Las piezas simplemente esperan menos.

La ley de Little se cumple para promedios a largo plazo en un sistema estable [6]. No indica cuánto se puede reducir el WIP antes de que el throughput se resienta. Eso depende de la variabilidad, por eso los sistemas pull necesitan algún colchón y por qué las fórmulas de dimensionamiento incluyen términos de seguridad.

### Push frente a pull: diferencias clave e híbridos

| Criterio | Push (liberación impulsada por MRP) | Pull (kanban, CONWIP, POLCA) |
|---|---|---|
| Disparador de la producción | Liberación de órdenes planificadas a partir de la previsión o de los pedidos | Consumo o una autorización libre de WIP |
| WIP | Sin límite; sigue al plan y a sus errores | Limitado por el número de tarjetas o autorizaciones [2] |
| Plazo de entrega | Variable, a menudo crece con la carga | Estable mientras se mantenga el límite de WIP (ley de Little) [6] |
| Respuesta al error de previsión | Sobreproducción o escasez | Autocorrectiva dentro del rango del bucle |
| Necesidades de datos | Listas de materiales, rutas, plazos de entrega e inventario exactos | Recuento exacto de contenedores, disciplina en el uso de tarjetas |
| Adecuado para | Plazos largos, listas de materiales complejas, bajo volumen por artículo | Demanda repetitiva, tiempos de reposición cortos |

La mayoría de las plantas utilizan sistemas híbridos. Un artículo de IndustryWeek escrito por un proveedor sostiene que una combinación de push y pull puede ser lo mejor cuando la demanda es volátil [25]. En la práctica, eso suele significar que el MRP planifica la capacidad y las compras de largo plazo, mientras que kanban o CONWIP controlan la liberación diaria. La sección sobre ERP más abajo muestra cómo. Por tanto, elegir entre push o pull rara vez es una decisión única para toda la planta; se toma por número de parte y por etapa del proceso.

## Historia: del taller de máquinas de Toyota a la práctica global

Kanban surgió del Sistema de Producción Toyota. Toyota atribuye a Kiichiro Toyoda (1894–1952) el concepto de justo a tiempo y señala que introdujo el flujo con transportador de cadena en el montaje de telares en 1927 y en la línea de montaje de carrocerías de la planta de Koromo en 1938 [8]. Un pie de foto en la página de TPS de Toyota atribuye a Taiichi Ohno (1912–1990) la frase «crear el marco básico del método Justo a Tiempo» [8].

Según el artículo sobre kanban de Wikipedia, Toyota aplicó la lógica del kanban en el taller de máquinas de su planta principal en 1953 [10]. El mismo artículo indica que Toyota estudió los supermercados a finales de los años cuarenta con la idea de aplicar al piso de fábrica las técnicas de reposición de estantes; esa frase no tiene cita en dicho artículo, por lo que la fecha debe considerarse [unverified: la frase no tiene cita en la fuente]. La analogía con el supermercado es tan central que «supermercado» se convirtió en el término lean para un punto de stock controlado.

La primera descripción académica en inglés provino de ingenieros de Toyota. Sugimori y tres coautores publicaron «Toyota production system and Kanban system: Materialization of just-in-time and respect-for-human system» en el *International Journal of Production Research* en 1977 [7]. El artículo menciona dos características: la producción justo a tiempo, en la que solo se fabrican los productos necesarios, en el momento necesario y en la cantidad necesaria, y un sistema de «respeto por las personas» en el que los trabajadores utilizan toda su capacidad participando en la operación y la mejora de su taller [7]. El libro de Ohno, *Toyota Production System: Beyond Large-Scale Production*, apareció en inglés en 1988 [9].

Desde la década de 1980, los investigadores occidentales comenzaron a analizar y a variar el método. Spearman, Woodruff y Hopp presentaron CONWIP en 1990 como «una alternativa pull al kanban» [3]. Co y Moosa examinaron en 1997 la fórmula de kanban del propio Toyota [14]. Rajan Suri, que fundó y dirigió el Center for Quick Response Manufacturing de la Universidad de Wisconsin–Madison entre 1993 y 2007, creó POLCA para talleres de alta mezcla y bajo volumen [20][21]. Una revisión bibliográfica de 2010 de Lage Junior y Godinho Filho contabilizó 32 variaciones publicadas del sistema kanban y encontró una gran brecha entre las propuestas teóricas y las prácticas [17]. La lógica central del bucle de los años cincuenta ha sobrevivido a todas ellas.

## Cómo funciona un ciclo kanban, paso a paso

El diseño clásico de Toyota utiliza dos tipos de tarjetas: los kanban de retirada, que mueven piezas desde un supermercado hasta el consumidor, y los kanban de producción, que indican al proceso proveedor que fabrique las reposiciones [1]. Aquí tenemos un ciclo completo entre una línea de montaje y una célula de estampado y soldadura que suministra soportes.

| Paso | Dónde | Qué ocurre | Señal |
|---|---|---|---|
| 1 | Línea de montaje, punto de uso | El operario toma el último soporte de un contenedor; el contenedor vacío va al bastidor de retorno | El kanban de retirada se desprende y se coloca en el buzón de kanban |
| 2 | Buzón de kanban | Un operario de manutención recoge los kanban de retirada en una ruta fija, por ejemplo cada 30 o 60 minutos | Kanban de retirada recogidos |
| 3 | Supermercado tras la célula de soportes | El operario toma un contenedor lleno por cada kanban de retirada; el kanban de producción de ese contenedor se retira y se coloca en el buzón de kanban de producción | El kanban de retirada va sobre el contenedor lleno; el kanban de producción va a la célula |
| 4 | Línea de montaje | El contenedor lleno llega a su dirección de punto de uso | El kanban de retirada viaja con las piezas |
| 5 | Célula de soportes | Los kanban de producción se alinean en secuencia, a menudo en un tablero heijunka o en un simple raíl | Cada kanban de producción autoriza un contenedor |
| 6 | Célula de soportes | La célula fabrica exactamente la cantidad indicada en la tarjeta y devuelve el contenedor lleno, con el kanban de producción adherido, al supermercado | Kanban de producción de vuelta en el contenedor |

Hay dos características que suelen pasarse por alto:

- **El supermercado es el stock de seguridad, no la línea.** La línea solo mantiene lo que consume entre entregas. El supermercado absorbe la diferencia entre el ritmo por lotes de la célula y el consumo constante de la línea.
- **Las tarjetas miden el inventario.** Si existen 12 kanban de producción para el soporte B-200 y 3 esperan en la célula, 9 contenedores están llenos en el supermercado, en tránsito o en la línea. Un recuento rápido permite comprobar si se han perdido tarjetas o si se están acumulando contenedores.

Una variante más sencilla de una sola tarjeta elimina el kanban de retirada: el consumidor toma un contenedor de un almacén cercano y el contenedor vacío o una tarjeta de producción regresa directamente al proceso proveedor. Es más simple y funciona bien cuando proveedor y consumidor están cerca el uno del otro.

## Tipos de kanban

El Lean Enterprise Institute distingue dos familias básicas: el kanban de producción y el kanban de retirada, con el kanban de señal como un tipo especial de kanban de producción y el kanban de proveedor como un tipo especial de kanban de retirada [1]. Los proveedores y los libros de texto añaden otros nombres, por eso las listas de tipos de kanban varían de una página a otra. La tabla los clasifica según lo que autorizan.

| Tipo | Autoriza | Uso típico | Notas |
|---|---|---|---|
| Kanban de producción | Que el proceso anterior fabrique el tipo y la cantidad indicados en la tarjeta para un proceso posterior [1] | Células y máquinas con cambios cortos que pueden fabricar un contenedor cada vez | Una tarjeta = un contenedor |
| Kanban de señal (kanban triangular) | La producción de un lote cuando el inventario baja hasta un punto de disparo, "cuando se alcanza una cantidad mínima de contenedores" [1] | Prensas, moldeo, tratamiento térmico, pintura: procesos con cambios largos que deben funcionar por lotes | Se cuelga en el punto de reposición de la pila de contenedores; a menudo son placas metálicas triangulares |
| Kanban de retirada (kanban de transporte, de traslado) | El traslado de piezas a un proceso posterior [1] | Entre el supermercado y la línea | Kanban interno o interproceso [1] |
| Kanban de proveedor | La retirada de un proveedor externo [1] | Piezas compradas con consumo regular | LEI señala que los kanban de proveedores para proveedores lejanos suelen adoptar forma electrónica [1] |
| Sistema de dos contenedores (y de tres contenedores) | La reposición de un contenedor cuando está vacío, mientras el segundo cubre el consumo | Tornillería, consumibles, componentes C de bajo coste | El contenedor vacío es la señal; Wikipedia describe el sistema de dos contenedores como el origen más sencillo del kanban y también describe una variante de tres contenedores (línea, almacén de fábrica, proveedor) [10] |
| Kanban de emergencia o urgente | Una reposición extra única tras una falta de material o un defecto | Recuperación por chatarra o por una entrega no realizada | Debe retirarse después de usarse; de lo contrario el bucle crece sin control |
| Kanban puntual (de evento, de uso único) | Piezas extra para una demanda excepcional conocida | Promociones, un pedido de servicio, la fabricación de un prototipo | Microsoft Dynamics 365 gestiona estos casos como kanbans de uso único marcados con una regla de cantidad fija, además de kanbans de evento para demandas excepcionales por encima de una cantidad establecida [15] |
| Kanban de paso (de túnel) | Producción y retirada combinadas en una sola tarjeta | Dos procesos estrechamente vinculados que funcionan como uno, por ejemplo forja y tratamiento térmico | Citado por Cin7 entre sus seis tipos; la terminología varía entre fuentes |
| Tarjeta CONWIP | La liberación de cualquier trabajo en una línea; la tarjeta vuelve al inicio de la línea cuando un trabajo termina [5] | Líneas con muchas referencias pero una ruta común | No es específica de una pieza; véase la sección sobre CONWIP |
| E-kanban | Cualquiera de los anteriores como mensaje electrónico | Proveedores lejanos, bucles grandes, reposición integrada con ERP | Elimina los errores por tarjetas perdidas y por introducción manual de datos [10] |

### Qué tipo de kanban para cada bucle

| Situación | Tipo recomendado | Motivo |
|---|---|---|
| Célula de proveedor junto a la línea, cambio inferior a 10 minutos | Kanban de producción, tarjeta única | Puede fabricar contenedor a contenedor |
| Taller de prensas con cambios de 45 minutos que alimenta varias líneas | Kanban de señal con un supermercado | El tamaño del lote lo fija la economía del cambio, no el tamaño del contenedor |
| Almacén central que alimenta varias células | Kanban de retirada más una ruta (milk run) | Separa el traslado de la fabricación |
| Piezas estándar compradas, consumo regular, proveedor a 800 km | E-kanban de proveedor | Las tarjetas de papel viajan demasiado despacio |
| Tornillos, arandelas, etiquetas, guantes | Dos contenedores | La señal más barata posible, sin necesidad de contar |
| Muchas variantes en una misma ruta, demanda irregular por variante | Tarjetas CONWIP | Las tarjetas específicas de pieza llenarían la planta de existencias de lenta rotación |
| Taller por pedido con muchas rutas | Tarjetas POLCA | Controla el flujo entre pares de células |

## Las seis reglas del kanban de Toyota

Casi todas las páginas web enumeran "seis reglas". Circulan dos versiones, y conviene conocer ambas.

**Versión 1, según el resumen de Wikipedia** (citando a Toyota) [10]:

1. Cada proceso emite peticiones (kanban) a sus proveedores cuando consume sus suministros.
2. Cada proceso produce según la cantidad y la secuencia de las peticiones recibidas.
3. No se fabrica ni transporta ningún artículo sin una petición.
4. La petición asociada a un artículo siempre va adjunta a él.
5. Los procesos no deben enviar artículos defectuosos, para garantizar que los productos terminados estén libres de defectos.
6. Limitar el número de peticiones pendientes hace el proceso más sensible y revela ineficiencias.

**Versión 2, según el *Toyota Production System Handbook* (1973, traducido por Mark Warren), tal como la presenta Christoph Roser** [11]:

1. No envíes productos defectuosos al proceso de producción siguiente.
2. El proceso de producción siguiente viene a recoger.
3. Produce solo la cantidad que recoge el proceso siguiente.
4. Reduce las fluctuaciones.
5. El kanban es un medio de ajuste fino.
6. Estabiliza y racionaliza el proceso de producción.

Roser señala que "existen distintas versiones de las Reglas de Toyota para el Kanban" y añade una regla que aprendió en Toyota y que no aparece en ninguna de las dos listas: todo material del sistema debe llevar una tarjeta kanban adjunta [11]. También señala que la versión del manual mezcla requisitos previos (ausencia de defectos, procesos estables) con reglas de operación [11].

### Qué significan las reglas en la planta

| Regla (combinada) | Comportamiento en planta | Infracción habitual | Consecuencia |
|---|---|---|---|
| Lo posterior tira del flujo | El consumidor o manipulador toma el material; el proveedor no entrega sin que se le pida | La célula anterior "ayuda" empujando contenedores extra | Los supermercados se desbordan, las tarjetas ya no muestran el inventario real |
| Fabricar solo lo que se tomó | Las tarjetas de producción fijan la cantidad y la secuencia | Producir un turno completo "mientras se prepara" | Sobreproducción oculta, uno de los siete desperdicios de Ohno |
| Ninguna pieza sin tarjeta | Cada contenedor lleno lleva su tarjeta | Contenedores sin etiqueta en un rincón, "stock de seguridad" | Inventario en circulación desconocido; el recuento de tarjetas miente |
| La tarjeta acompaña a las piezas | Se separa solo en el momento definido | Tarjetas en bolsillos, sobre mesas, en cajones | Tarjetas perdidas = reposición perdida = rotura de stock |
| Sin defectos aguas abajo | Las piezas malas se detienen y se señalan en origen | Piezas defectuosas mezcladas en un contenedor lleno | El consumidor se queda corto con un contenedor "lleno" |
| Reducir tarjetas paso a paso | Quitar una tarjeta, observar, resolver, repetir | Eliminar la mitad de las tarjetas de una vez | La línea se detiene, se pierde la confianza, se vuelve al empuje |
| Nivelar y estabilizar | La demanda en el punto marcapasos se nivela; los procesos son capaces | Grandes oscilaciones diarias en el montaje final | El kanban amplifica las oscilaciones aguas arriba (véase heijunka) |

La regla 6 de la versión 1 es la que con más frecuencia se aplica mal en las plantas occidentales. Roser sostiene, en una respuesta a los lectores, que Toyota "tiene a) muchos menos problemas y b) mucha más mano de obra para resolverlos", por lo que las plantas sin esa capacidad de resolución de problemas deberían mantener suficientes kanbans en lugar de reducirlos para provocar problemas que todavía no saben resolver [12]. Retirar una tarjeta es un experimento. Realícelo solo cuando alguien esté preparado para corregir lo que el experimento deje al descubierto.

## Cómo calcular el número de kanbans: fórmulas y ejemplos resueltos

Esta es la pregunta que se hace la mayoría de quienes buscan esta información y que muchas páginas omiten. Las secciones siguientes parten de la fórmula básica, muestran cómo la práctica profesional la refina, comparan las fórmulas utilizadas por los proveedores de ERP y otras guías con los mismos datos, y resuelven seis casos. Los seis ejemplos de kanban son ilustrativos: usan datos típicos de planta y no ejemplos reales de una empresa concreta, de modo que pueda seguir cada paso y sustituir los números por los suyos.

Primero una advertencia, en palabras de Roser: "El cálculo del kanban no es más que una estimación muy aproximada basada en muchos supuestos" [12]. La fórmula ofrece un punto de partida. Después, el bucle se ajusta observándolo.

### La fórmula básica

> **Número de kanbans N = (D × L × (1 + α)) ÷ C**, redondeado hacia arriba
>
> D = demanda media por unidad de tiempo (por ejemplo, piezas por día)
> L = tiempo de reposición en la misma unidad de tiempo: desde el momento en que se vacía un contenedor (o se libera su tarjeta) hasta que el contenedor lleno vuelve a su punto de almacenamiento
> α = factor de seguridad (por ejemplo, 0,10 para un 10 por ciento)
> C = cantidad por contenedor (piezas por kanban)

Esta estructura, demanda durante el tiempo de reposición más una holgura de seguridad, dividida entre la cantidad por contenedor, es la base que usa Microsoft Dynamics 365 Supply Chain Management, con un "+1" añadido en sus variantes principales [15]. Smartsheet emplea una variante con el stock de seguridad expresado en días: C = [D × (L + SSD)] ÷ S, donde SSD son los días de stock de seguridad y S la cantidad por contenedor [23]. La práctica propia de Toyota, tal como la analizan Co y Moosa, fija el número de kanbans a partir de la demanda media durante un ciclo de pedido multiplicada por un factor constante de sobreplanificación [14].

**Ejemplo resuelto 1: bucle básico.** La línea de montaje final utiliza el soporte B-200. Demanda diaria D = 960 piezas en dos turnos. Tiempo de reposición desde la celda de soportes L = 0,25 días. Factor de seguridad α = 0,10. Cantidad por contenedor C = 40.

N = 960 × 0,25 × 1,10 ÷ 40 = 264 ÷ 40 = 6,6, redondeado hacia arriba a **7 kanbans**.

El bucle nunca puede contener más de 7 × 40 = 280 soportes, lo que equivale a 280 ÷ 960 = 0,29 días de demanda. Según la ley de Little, el tiempo medio que un soporte permanece en el bucle es como máximo de unos 0,29 días, aproximadamente 4,4 horas laborables en una jornada de 15 horas [6].

### De dónde sale realmente L: desglose del tiempo de reposición

La fórmula básica oculta el dato de entrada más difícil. L no es el tiempo de ciclo de la máquina que suministra. Roser desglosa el tiempo de reposición en el tiempo de flujo de material más los retrasos de información: tiempo de espera del kanban hasta que se recoge la tarjeta, espera hasta que se acumulan suficientes kanbans para formar un lote, tiempo de cola detrás de otras referencias, cambios de formato y transporte [12]. Luego añade kanbans extra por la formación del tamaño de lote, por la espera detrás de otros lotes, por el agrupamiento de pedidos del cliente y por la demanda punta, además de un margen de seguridad opcional [13].

| Componente del tiempo de reposición | Cómo medirlo | Punto ciego habitual |
|---|---|---|
| Tiempo de espera de la tarjeta en el puesto kanban | Intervalo de recogida de la ruta; use el intervalo completo para una estimación conservadora | Suponer que las tarjetas viajan al instante |
| Espera a que se forme un lote | Si la celda produce lotes de n contenedores, hasta n – 1 tarjetas esperan | Ignorar los tamaños de lote del proveedor |
| Cola detrás de otras referencias | Observe la secuencia de la celda; cuente los otros lotes delante | Suponer que la celda está libre cuando llega la tarjeta |
| Cambio de formato | Estudio de tiempos o línea base de SMED | Excluir los cambios porque "son cortos" |
| Tiempo de proceso de un lote | Tiempo de ciclo × cantidad del lote | Usar una pieza en lugar del lote completo |
| Transporte y colocación | Tiempo de la ruta hasta el supermercado | Olvidar esperas de carretilla y pausas de turno |

**Ejemplo resuelto 2: el mismo soporte con el tiempo de reposición completo.** Dos turnos dan 900 minutos de tiempo disponible, así que takt = 900 ÷ 960 = 0,9375 minutos (56,25 segundos) por soporte.

- Recogida de tarjetas cada 60 minutos: de forma conservadora, 60 minutos de espera
- Cola en la celda de soportes detrás de otras referencias: 90 minutos
- Proceso de un contenedor: 40 piezas × 30 segundos = 20 minutos
- Transporte y colocación: 15 minutos
- Tiempo de reposición sin efectos de lote: 60 + 90 + 20 + 15 = 185 minutos

Piezas consumidas durante ese tiempo: 185 ÷ 0,9375 = 197,3 piezas, que equivalen a 197,3 ÷ 40 = 4,93 kanbans.

La célula ejecuta lotes de cuatro contenedores para limitar los cambios de formato. Pueden esperar hasta tres tarjetas a que se forme un lote, así que añada 3 kanbanes: 4,93 + 3 = 7,93. Añada un margen de seguridad del 10 por ciento a la parte basada en el tiempo (0,49): 8,42, redondeado hacia arriba a **9 kanbanes**.

La fórmula básica dio 7. La diferencia de dos tarjetas procede casi por completo del tamaño de lote en la célula suministradora. Por eso SMED, que permite lotes más pequeños, es la palanca habitual para reducir kanbanes, y no unas reglas más estrictas. Más información sobre cambios de formato en la [guía de SMED y reducción de cambios de formato](https://www.m365.fm/en/learn/smed-changeover-reduction/).

### Mismos datos, distintas fórmulas

En las plantas a menudo se discute cuál es la fórmula "correcta" cuando en realidad discrepan en los datos de partida. Esta tabla aplica las fórmulas publicadas a los datos del ejemplo 1 (D = 960 por día, L = 0,25 día, α = 0,10, C = 40). En la fórmula de Smartsheet, el factor de seguridad del 10 por ciento se convierte en días de seguridad: 0,1 × 0,25 = 0,025 día.

| Fuente | Fórmula tal como se publica | Cálculo | Resultado |
|---|---|---|---|
| Forma básica de manual | D × L × (1 + α) ÷ C | 960 × 0,25 × 1,1 ÷ 40 = 6,6 | 7 |
| Smartsheet [23] | D × (L + SSD) ÷ S | 960 × (0,25 + 0,025) ÷ 40 = 6,6 | 7 |
| Microsoft Dynamics 365 SCM, sin stock de seguridad [15] | (demanda media × tiempo de entrega × (factor de seguridad + 1)) ÷ cantidad por unidad de manipulación + 1, redondeado hacia arriba | 6,6 + 1 = 7,6 | 8 |
| Oracle JD Edwards, Ecuación 1 [16] | tamaño del kanban = demanda diaria alta × (días de tiempo de entrega + días de desfase de escaneo) + stock de seguridad; tarjetas = tamaño del kanban ÷ tamaño del contenedor | con demanda diaria alta 1.100, tiempo de entrega 0,25 día, desfase de escaneo 0, stock de seguridad 40: (1.100 × 0,25 + 40) ÷ 40 = 7,9 | 8 |
| Escalonado de Roser [12][13] | tiempo de reposición ÷ takt ÷ piezas por kanban + kanbanes extra + seguridad | véase el ejemplo 2 | 9 |

Los resultados van de 7 a 9. La dispersión procede de tres decisiones: si se añade una tarjeta extra para el contenedor que se está consumiendo (el +1 de Dynamics 365), si se usa la demanda máxima o la media (JD Edwards usa la demanda del periodo más alto dentro de la ventana MRP [16]), y si se cuentan los efectos del tamaño de lote (Roser [13]). Decida estos tres puntos una vez, inclúyalos en su estándar de kanban y aplíquelos a todos los bucles.

### Ejemplo práctico 3: kanban de proveedor

En las piezas compradas, el tiempo de reposición incluye el intervalo de pedido (cada cuánto se envían tarjetas o señales), el plazo de entrega del proveedor y el tiempo de transporte. Una forma habitual es:

> **N = D × (intervalo de pedido + plazo de entrega del proveedor + tiempo de seguridad) ÷ C**

Una carcasa se consume a 300 piezas por día. Las señales se envían al proveedor una vez al día (intervalo de pedido 1 día), el proveedor necesita 3 días desde la señal hasta la entrega, y la planta quiere 1 día de tiempo de seguridad. Los contenedores contienen 100 piezas.

N = 300 × (1 + 3 + 1) ÷ 100 = 1.500 ÷ 100 = **15 kanbanes**. El inventario máximo del bucle es de 1.500 piezas, o 5 días de consumo, la mayor parte en el circuito del proveedor o en el camión y no en la planta.

Si la planta pasa de señales diarias a señales dos veces al día (intervalo de pedido 0,5 día), N = 300 × 4,5 ÷ 100 = 13,5, es decir, 14 kanbanes. Si el plazo de entrega del proveedor baja de 3 días a 2, N = 300 × 4 ÷ 100 = 12. El plazo de entrega del proveedor suele ser la palanca más importante.

### Ejemplo práctico 4: kanban de señal para un proceso por lotes

Los kanbanes de señal se dimensionan de otra manera, porque el proceso suministrador fabrica un lote mucho mayor que un contenedor. Se necesitan dos cifras: el punto de disparo (cuándo iniciar un lote) y el tamaño de lote (cuánto fabricar).

Una prensa de estampación suministra la pieza P-17, entre otras. La demanda es de 1.200 piezas por día durante 900 minutos disponibles, es decir, 1,333 piezas por minuto. Los contenedores contienen 60 piezas, así que la línea usa 20 contenedores al día. Como la prensa necesita 40 minutos para cambiar de formato, la planificación ha fijado un lote de 10 contenedores (600 piezas).

- Espera a la prensa (otras piezas por delante): hasta 120 minutos
- Cambio de formato: 40 minutos
- Ejecución de 600 piezas a 3 segundos cada una: 30 minutos
- Traslado al supermercado: 10 minutos
- Tiempo de reposición: 200 minutos

Demanda durante la reposición = 200 × 1,333 = 267 piezas = 4,44 contenedores. Con un contenedor de seguridad, el punto de disparo es 5,44, redondeado hacia arriba a 6 contenedores. El kanban triangular cuelga del sexto contenedor desde la base de la pila. Cuando la línea llega a él, la prensa recibe su señal.

Inventario máximo = punto de disparo + lote = 6 + 10 = 16 contenedores = 960 piezas, aproximadamente 0,8 días de demanda. Si SMED reduce el cambio a 10 minutos y la planificación reduce el lote a 4 contenedores, el inventario máximo baja a unos 6 + 4 = 10 contenedores, suponiendo que la cola de la prensa se mantiene igual. La lógica del dimensionamiento de lotes en sí se explica en la [guía de dimensionamiento de lotes](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/).

### Ejemplo práctico 5: sistema de dos contenedores para piezas C

Los tornillos M6 se consumen a razón de unas 1.500 piezas por semana en una estación de trabajo. El distribuidor repone un contenedor vacío en el plazo de una semana desde que el contenedor vacío se coloca en la estantería de recogida. Cada contenedor debe cubrir la demanda durante la reposición más un margen.

Tamaño del contenedor = 1.500 × 1 semana × 1,2 = 1.800 tornillos. Dos contenedores de 1.800 contienen 3.600 tornillos en total. Cuando el primer contenedor se vacía, el operario cambia al segundo y coloca el contenedor vacío, con su etiqueta, en la estantería. Nadie cuenta tornillos. Si el segundo contenedor se queda vacío con regularidad antes de que vuelva el primero, el tamaño del contenedor o el tiempo de reposición están mal calculados, y la solución es medir ambos, no añadir informalmente un tercer contenedor.

### Ejemplo práctico 6: ¿cuánta sensibilidad tiene el bucle?

Tomando el ejemplo 1 como caso base (D = 960, L = 0,25 días, α = 0,10, C = 40), la tabla muestra cuántos kanbanes da la fórmula básica cuando cambia una variable.

| Cambio | N (sin redondear) | Kanbanes | Inventario máximo del bucle |
|---|---|---|---|
| Caso base | 6,6 | 7 | 280 |
| Tiempo de reposición reducido a la mitad, 0,125 días | 3,3 | 4 | 160 |
| Tiempo de reposición duplicado, 0,5 días | 13,2 | 14 | 560 |
| Cantidad por contenedor reducida a la mitad, 20 | 13,2 | 14 | 280 |
| Cantidad por contenedor duplicada, 80 | 3,3 | 4 | 320 |
| Demanda un 25 por ciento mayor, 1.200 | 8,25 | 9 | 360 |
| Factor de seguridad 0,25 en lugar de 0,10 | 7,5 | 8 | 320 |

De aquí se extraen dos conclusiones. Primero, el tiempo de reposición es la variable con mayor efecto sobre el inventario: reducirlo a la mitad baja el inventario máximo de 280 a 160. Segundo, los contenedores más pequeños no reducen mucho el inventario máximo por sí solos (14 × 20 = 280); sobre todo suavizan el flujo y hacen visibles los problemas antes, mientras que duplicar los contenedores a 80 aumenta el inventario porque el redondeo desperdicia más.

### Redondeo, mínimos y recálculo

- **Redondear hacia arriba y después valorar.** Redondear 6,6 a 7 es obvio. Roser redondearía hacia abajo un resultado de 61,2 kanbanes en un bucle grande, pero hacia arriba 61,9 [13]. En bucles pequeños, redondee siempre hacia arriba.
- **Mínimo de dos kanbanes.** Un bucle con una sola tarjeta detiene al consumidor cada vez que la tarjeta está en tránsito. Dos es el mínimo práctico; algunas plantas fijan tres como norma interna.
- **Recalcular según un calendario.** La demanda cambia. Recalcule los tamaños de bucle mensualmente o cuando la previsión de demanda varíe más de un umbral acordado (por ejemplo, 15 por ciento). Los módulos de kanban de los ERP pueden hacerlo a partir de los periodos de demanda [15].
- **Añadir y retirar tarjetas de forma formal.** Todo cambio pasa por la persona responsable de la lista maestra de kanbanes, con una fecha. De lo contrario, las tarjetas se multiplican.
- **Planificar los picos de forma explícita.** Para los picos estacionales, añada tarjetas temporales de otro color con una fecha de fin, o use kanbanes de un solo uso [15].

## Supermercados, carriles FIFO y el proceso marcapasos

Las tarjetas son la parte visible de un sistema pull. Su estructura se decide antes, en el mapa de la cadena de valor del estado futuro: dónde colocar los supermercados, dónde conectar los procesos con carriles FIFO y qué proceso único recibe la programación. Si todavía no ha dibujado ese mapa, empiece por la [guía de mapeo de la cadena de valor](https://www.m365.fm/en/learn/value-stream-mapping/); allí se explican los símbolos kanban (kanban de producción, kanban de retirada, kanban de señal, buzón kanban).

### Tipos de sistemas pull: tres formas básicas

| Forma | Cómo funciona | Se adapta a | Stock que se mantiene |
|---|---|---|---|
| Pull de supermercado (pull de reposición) | Cada proceso mantiene un supermercado de sus salidas; el proceso posterior retira y el anterior repone lo retirado | Muchos números de pieza repetitivos con demanda estable | Se almacena cada número de pieza activo |
| Pull secuencial | Las órdenes se liberan al inicio de una cadena en la secuencia en que deben fabricarse; los procesos se unen con carriles FIFO de cantidad máxima | Muchas variantes, bajo volumen por variante, plazo de entrega corto y predecible | Poco o ningún stock de producto terminado; WIP limitado por el tamaño de los carriles |
| Pull mixto | Alta rotación en supermercados, baja rotación fabricada bajo pedido en secuencia | La mayoría de las plantas reales | Stock solo para los de alta rotación |

### Segmentar los números de pieza antes de diseñar los bucles

No todos los números de pieza pertenecen a un supermercado. Una división práctica usa el volumen y la regularidad de la demanda, a menudo llamada runners, repeaters y strangers.

| Segmento | Perfil (umbrales de ejemplo, defina los suyos) | Método de control |
|---|---|---|
| Runners | Demanda diaria, baja variación (por ejemplo, coeficiente de variación inferior a 0,5) | Supermercado con kanban de producción o de señal |
| Repeaters | Demanda la mayoría de las semanas, variación moderada | Supermercado con menos tarjetas, o fabricación bajo pedido con un pequeño buffer FIFO |
| Strangers | Esporádicos, específicos de cliente o nuevos | Fabricación bajo pedido, liberada mediante autorización CONWIP o POLCA, o planificada con MRP |

El coeficiente de variación es la desviación estándar de la demanda diaria (o semanal) dividida entre su media. Una pieza con una media de 100 al día y una desviación estándar de 30 tiene CV = 0,3. Una pieza con una media de 10 al día y una desviación estándar de 15 tiene CV = 1,5 y es un mal candidato para kanban: su bucle tendría que retener stock suficiente para picos poco frecuentes, así que la mayor parte del tiempo los contenedores simplemente estarían parados.

### Diseñar un supermercado

| Punto de diseño | Regla práctica | Por qué |
|---|---|---|
| Ubicación | Junto al proceso proveedor, no junto al consumidor | El proveedor ve su propio stock y lo repone; el manipulador solo lo recoge |
| Direccionamiento | Cada número de pieza tiene una única dirección fija (pasillo, estantería, nivel, hueco) impresa en la tarjeta [1] | Los contenedores extraviados se hacen visibles; la reposición es rápida |
| Capacidad | Huecos físicos exactamente para el número máximo de contenedores del bucle, ni uno más | La sobreproducción no tiene dónde ir; se hace visible |
| Sentido del flujo | Cargar por detrás, retirar por delante (estanterías de flujo por gravedad) | Primero en entrar, primero en salir por diseño |
| Máximo/mínimo visual | Marcas de color o posición del kanban de señal en la estantería | Cualquiera puede ver el estado sin un sistema |
| Estándar de contenedor | Contenedor acordado por número de pieza con cantidad fija; peso ergonómico | Contar por contenedores en lugar de por piezas |
| Seguridad y ergonomía | Mantener los contenedores pesados entre la altura de la rodilla y la del hombro; revisar levantamiento y alcance según la guía ergonómica de OSHA [28] | Los manipuladores repiten estos movimientos cientos de veces por turno |

### Carriles FIFO: dimensionar la cola

Un carril FIFO es una cola con cantidad máxima entre dos procesos. Cuando está lleno, el proceso proveedor se detiene; cuando está vacío, el consumidor espera. A diferencia de un supermercado, no almacena stock por número de pieza, solo una secuencia de trabajos.

**Ejemplo de dimensionamiento.** Una línea de pintura toma trabajos de una célula de soldadura. La soldadura produce un trabajo cada 10 minutos; la pintura consume al mismo ritmo medio, pero se detiene 90 minutos para cambios de color dos veces por turno. El carril FIFO debe absorber la producción de soldadura durante un cambio de color: 90 ÷ 10 = 9 trabajos. Con un margen de 3, el carril contiene 12 trabajos. Según la ley de Little, un trabajo espera como máximo unos 12 × 10 = 120 minutos en el carril [6].

Si el carril está lleno a menudo, la pintura es la restricción o el cambio de color es demasiado largo. Si está vacío a menudo, el problema es la soldadura. En ambos casos, el carril lo hace visible. Esa es su función.

### El marcapasos: un punto de programación

En un sistema pull, solo un proceso recibe un programa de producción: el marcapasos. Normalmente es el montaje final o el último proceso de flujo continuo antes del envío. Todo lo que está aguas arriba sigue las señales kanban; todo lo que está aguas abajo fluye en FIFO. Programar el marcapasos es el punto donde la [guía de programación de producción y APS](https://www.m365.fm/en/learn/production-scheduling-aps/) se encuentra con esta: el APS o el planificador decide qué construye el marcapasos y en qué orden, y los bucles kanban deciden qué reponen el resto de la planta.

### La ruta del manipulador de materiales

Los supermercados necesitan a alguien que mueva tarjetas y contenedores en un ciclo fijo. A este rol se le suele llamar araña de agua o mizusumashi. La ruta se cronometra según el pitch (véase más abajo): cada intervalo de pitch, el manipulador toma la siguiente instrucción de producción en la caja heijunka, la entrega, recoge los vacíos y los kanban de retirada, y lleva los contenedores llenos a la línea. Una ruta fija convierte el intervalo de recogida de la fórmula de dimensionamiento en un valor conocido en lugar de una suposición. Cronometre la ruta con el manipulador y deje un margen para retrasos y pausas; una ruta que nunca cabe dentro del pitch es sobrecarga (muri), y se omitirá justo cuando la línea esté más ocupada. Para rutas internas de planta y milk runs con más detalle, consulte la [guía de logística interna](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/).

## Heijunka: nivelar el programa del que depende el kanban

El kanban reacciona al consumo. Si el marcapasos fabrica 300 unidades del modelo A el lunes y ninguna el martes, cada bucle aguas arriba para el modelo A ve un pico y después nada. Los bucles deben dimensionarse para el pico, y el inventario crece. Nivelar el programa del marcapasos evita eso.

El Lean Enterprise Institute define heijunka como "nivelar el tipo y la cantidad de producción durante un periodo fijo de tiempo" [18]. Sus dos ejemplos son la referencia estándar:

- **Nivelación de volumen:** un productor recibe 500 pedidos a la semana, que van de 200 el lunes a 50 el miércoles y el viernes, mantiene un pequeño buffer de producto terminado cerca de expedición y produce un ritmo constante de 100 al día [18].
- **Nivelación de mezcla:** con una demanda semanal de 5 A, 3 B, 2 C y 2 D, un productor en masa fabrica todos los A y luego todos los B; un productor lean intercala los modelos en una secuencia repetitiva [18].

El LEI enumera como beneficios tiempos de entrega más cortos, un consumo más estable de piezas que alivia la demanda sobre los proveedores, lotes más pequeños que limitan la propagación de defectos y cargas de trabajo más equilibradas para los operarios [18].

### Pitch: la unidad de tiempo de un sistema pull

El LEI define pitch como "la cantidad de tiempo necesaria en un área de producción para fabricar un contenedor de productos", calculado como takt time × cantidad por contenedor; con un takt de un minuto y 20 piezas por contenedor, el pitch es de 20 minutos [19].

### Ejemplo práctico: una caja heijunka para la línea de soportes

Continuemos con la línea de dos turnos de la sección de dimensionamiento: takt de 0,9375 minutos, contenedores de 40 piezas.

- Pitch = 0,9375 × 40 = 37,5 minutos
- Huecos por día = 900 ÷ 37,5 = 24 (12 por turno)
- Demanda diaria de 960 piezas = 24 contenedores

La línea fabrica cuatro modelos con una demanda diaria de A = 480, B = 240, C = 160 y D = 80 piezas, es decir, 12, 6, 4 y 2 contenedores al día, o 6, 3, 2 y 1 por turno.

Un programa por lotes por turno sería A A A A A A B B B C C D. Un programa nivelado reparte cada modelo a lo largo del turno:

| Hueco (cada 37,5 min) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Modelo | A | B | A | C | A | B | A | C | A | B | A | D |

Comprobación del recuento: A aparece 6 veces, B 3, C 2 y D 1. En la caja heijunka, cada hueco contiene el kanban de producción de un contenedor. El manipulador toma un kanban cada 37,5 minutos. Si un kanban sigue en la caja cuando empieza el siguiente hueco, la línea va retrasada, y todos pueden ver cuánto.

La secuencia nivelada necesita 11 cambios de modelo por turno en lugar de 3. Eso solo es económico cuando los cambios de formato en el marcapasos tardan segundos o unos pocos minutos, que es la razón concreta por la que SMED va antes de la nivelación de mezcla. La [guía de lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) presenta la secuencia general como estabilidad antes que flujo, flujo antes que pull y pull antes que nivelación. En la práctica, la nivelación de volumen en el marcapasos suele empezar junto con los primeros bucles kanban, y la nivelación fina de mezcla llega después, cuando los cambios de formato lo permiten.

### Lo que ocurre aguas arriba al nivelar

Compare los lotes del modelo D. Con la programación por lotes, las 40 piezas de D se consumen en un bloque de 37,5 minutos al final del turno, y el bucle debe cubrir una demanda de 80 por día en hasta dos ráfagas. Con la programación nivelada, el consumo sigue siendo de 80 por día, pero repartido a lo largo del día. La demanda máxima durante el tiempo de reposición baja, y baja también la reserva de seguridad necesaria. En decenas de números de pieza, esa diferencia suele ser mayor que cualquier optimización del número de tarjetas.

## Más allá del kanban: CONWIP, POLCA y drum-buffer-rope

Los bucles de kanban específicos por número de pieza funcionan cuando cada número de pieza tiene una demanda regular. Cuando una línea fabrica cientos de variantes, un supermercado para cada una retendría más stock del que tenía la planta antes. Tres alternativas mantienen el límite de WIP sin almacenar cada número de pieza.

### CONWIP: un único límite de WIP para toda la línea

CONWIP significa trabajo constante en proceso (constant work in process). Spearman, Woodruff y Hopp lo describieron en 1990 en el *International Journal of Production Research* como "un nuevo sistema de producción en modo pull", respaldado por argumentos teóricos y estudios de simulación [3]. El mecanismo: ningún trabajo puede entrar en la línea sin una tarjeta; cuando un trabajo terminado sale de la última estación, su tarjeta vuelve a la primera estación y autoriza el siguiente trabajo [5]. Dentro de la línea, los trabajos fluyen en orden FIFO, como en una línea push.

La comparación que hace el artículo de CONWIP en Wikipedia resulta útil: kanban mantiene un control más estricto del WIP mediante tarjetas individuales en cada puesto de trabajo, mientras que CONWIP es más fácil de implantar y ajustar porque un único conjunto de tarjetas gestiona el WIP del sistema [5]. En 2022 los mismos tres autores publicaron "CONWIP Redux", una reflexión sobre 30 años de desarrollo que aborda malentendidos habituales [4].

**Ejemplo práctico: definir el nivel de CONWIP.** Una línea de cinco estaciones tiene una tasa de cuello de botella de 60 unidades por hora. El tiempo de procesamiento bruto de una unidad a través de las cinco estaciones, sin ninguna espera, es de 25 minutos (0,417 horas). Según la ley de Little, el WIP necesario para mantener ocupado el cuello de botella si no hubiera ninguna variabilidad es 60 × 0,417 = 25 unidades [6]. Las líneas reales tienen variabilidad, así que la planta empieza con 35 tarjetas y observa el rendimiento.

Si el rendimiento se mantiene en unas 60 por hora, el lead time medio = 35 ÷ 60 = 0,58 horas, unos 35 minutos. A continuación, el equipo retira tarjetas en pasos de dos. Si el rendimiento cae por debajo de la tasa del cuello de botella con 29 tarjetas, vuelve a 31. Compárese con una línea sin límite que mantiene 150 unidades: la misma producción, con un lead time de 150 ÷ 60 = 2,5 horas.

### POLCA: pull para talleres de alta mezcla y bajo volumen

POLCA significa paired-cell overlapping loops of cards with authorization (bucles solapados de tarjetas con autorización para celdas emparejadas) [21]. Rajan Suri lo creó con su trabajo en el Center for Quick Response Manufacturing de la Universidad de Wisconsin–Madison [21]. Su *Practitioner's Guide to POLCA* lo describe como "un sistema de control visual basado en tarjetas que gestiona el flujo de trabajos por la planta", "especialmente adecuado para empresas que fabrican productos de alta mezcla, bajo volumen y personalizados", y señala que kanban "no funciona bien con producción de bajo volumen o a medida" [20].

El mecanismo, en resumen: cada par de celdas que se pasan trabajo entre sí comparte un bucle de tarjetas (por ejemplo, "Fresado–Soldadura"). Un trabajo puede empezar en la celda de fresado solo cuando ha llegado su fecha de liberación y hay libre una tarjeta Fresado–Soldadura, que indica que la soldadura tiene capacidad para él. Cuando la soldadura termina el trabajo, la tarjeta vuelve a fresado. Como los bucles se solapan, cada celda queda cubierta por las tarjetas de sus parejas aguas arriba y aguas abajo. POLCA combina las fechas de liberación planificadas desde el ERP con una señal de capacidad procedente del piso de planta.

### Drum-buffer-rope: pull desde la restricción

Drum-buffer-rope (DBR) es el método de control de producción de la teoría de las restricciones, asociado a Eliyahu Goldratt (fuentes de la guía de la teoría de las restricciones enlazada más abajo). La restricción (el tambor) marca el ritmo; un buffer de tiempo la protege de las perturbaciones aguas arriba; la cuerda ata la liberación de material al consumo del tambor. DBR limita el WIP solo delante de la restricción, lo que lo convierte en un sistema pull en el sentido de Hopp y Spearman [2]. La guía de Veryable presenta CONWIP y DBR como las dos alternativas principales a kanban [24]. DBR se explica en detalle en la [guía de la teoría de las restricciones](https://www.m365.fm/en/learn/theory-of-constraints/).

### Tabla de decisión: ¿qué sistema de arrastre encaja?

| Criterio | Kanban (supermercado) | CONWIP | POLCA | Drum-buffer-rope |
|---|---|---|---|---|
| Mezcla de productos | Baja a media, números de pieza repetidos | Media a alta, ruta común | Mezcla alta, a medida, muchas rutas | Cualquiera, con una restricción clara |
| Demanda por número de pieza | Regular | Irregular es aceptable | Irregular es aceptable | Irregular es aceptable |
| Almacena piezas terminadas | Sí, en supermercados | No (es posible fabricar bajo pedido) | No | No; colchón de tiempo antes de la restricción |
| Control del WIP | Por bucle, por número de pieza | Toda la línea | Entre cada par de celdas | Antes de la restricción |
| Requiere fechas de liberación de la planificación | No para los de alta rotación | Sí, una secuencia de backlog | Sí, fechas de liberación | Sí, programa de la restricción |
| Facilidad de puesta en marcha | Media (muchos bucles que dimensionar) | Fácil (un número por línea) | Media (bucles por par de celdas) | Media (la restricción debe ser estable) |
| Fallo típico | Supermercados para piezas esporádicas | Secuencia incorrecta en el backlog | Demasiados bucles, confusión de tarjetas | La restricción se desplaza con la mezcla |

La mayoría de las plantas combinan varios: kanban para los productos de alta rotación y los componentes comprados de tipo C, CONWIP o POLCA para las variantes bajo pedido, y DBR donde un recurso limita claramente la producción.

## Kanban electrónico y la interacción entre ERP y MRP

### Qué es el kanban electrónico

El kanban electrónico sustituye las tarjetas físicas por señales electrónicas. Wikipedia señala que esto ayuda a eliminar problemas habituales como los errores de entrada manual y las tarjetas perdidas [10]. El LEI señala que los kanban de proveedores para proveedores lejanos "han adoptado típicamente una forma electrónica" [1]. La lógica no cambia: un número fijo de señales de arrastre por bucle, activado por el consumo.

**Cómo funciona un bucle típico de kanban electrónico:**

1. Cada contenedor lleva una etiqueta con código de barras, código QR o etiqueta RFID que identifica el kanban (número de pieza, bucle, número de tarjeta).
2. Cuando se vacía un contenedor, el operario o el transportista lo escanea, o un sensor detecta la posición vacía (báscula, barrera fotoeléctrica, puerta RFID).
3. El ERP o una aplicación de kanban dedicada cambia el estado de ese kanban a "vacío" y genera una señal de reposición: una orden de producción o un trabajo para un proveedor interno, o una liberación contra un pedido de compra marco para uno externo.
4. El proceso proveedor ve la señal en su cola, en una pantalla (un tablero de kanban digital en la celda) o en una tarjeta impresa.
5. Cuando el contenedor lleno se recibe y se escanea en su posición de almacenamiento, el kanban vuelve al estado "lleno".

### Físico frente a electrónico: cuándo cambiar

| Factor | Mantener tarjetas físicas | Pasar a kanban electrónico |
|---|---|---|
| Distancia entre proveedor y consumidor | Mismo edificio, a unos cientos de pies | Otra planta, proveedor externo, otro país |
| Número de bucles | Decenas | Cientos o miles |
| Tasa de pérdida de tarjetas | Baja, las tarjetas son fáciles de auditar | Pérdidas recurrentes de tarjetas, roturas de stock atribuidas a las tarjetas |
| Necesidad de datos | El control visual basta | Se necesitan tiempos de reposición, rendimiento de bucles, historial de demanda |
| Madurez | El equipo todavía aprende las reglas | Las reglas son estables y se cumplen |
| Entorno TI/OT | Sin escaneo ni red fiables en planta | Escáneres, red y módulo de kanban del ERP disponibles |

Un error frecuente es empezar directamente con el kanban electrónico. La pantalla oculta lo que muestra un rack lleno de tarjetas: quién retiene tarjetas, qué bucle se desborda, qué regla se incumple. Nuestra recomendación: ejecutar un bucle en papel hasta que las reglas se cumplan y después digitalizar.

### Cómo los sistemas ERP gestionan el kanban

Los principales sistemas ERP incluyen funciones de kanban. Dos ejemplos publicados muestran lo distintos que son sus cálculos.

- **Microsoft Dynamics 365 Supply Chain Management** calcula la cantidad de kanban a partir de una política de cálculo de cantidad de kanban que usa la demanda media en un periodo de demanda definido, el tiempo de entrega, un factor de seguridad y, opcionalmente, el stock de seguridad derivado de un nivel de servicio; con un nivel de servicio del 90 por ciento utiliza z = 1,29 [15]. Distingue entre reglas de kanban de cantidad fija, kanban de uso único y kanban por evento [15]. Las tarjetas circulantes se imprimen una vez y después se mueven entre el origen y el punto de consumo, a menudo varias veces al día [15].
- **Oracle JD Edwards** ofrece varias ecuaciones de kanban, por ejemplo "tamaño de contenedor fijo y alta demanda", donde el tamaño del kanban es igual a la demanda diaria alta × (días de tiempo de entrega + días de delta de escaneo) + stock de seguridad, y el número de tarjetas es igual al tamaño del kanban dividido entre el tamaño del contenedor [16]. La demanda diaria alta se toma del valor máximo de demanda por periodo dentro de la ventana de MRP, ajustada según la división por proveedor y ubicación [16].

Antes de confiar en los recuentos de tarjetas que sugiere el ERP, compruebe tres cosas: qué demanda utiliza (media o pico, pasada o futura), si añade una tarjeta para el contenedor en uso y cómo gestiona los tamaños de lote en el proceso proveedor. Estas decisiones explican la mayoría de las diferencias entre el número del ERP y la experiencia en planta.

### MRP y kanban: quién hace qué

MRP (planificación de necesidades de materiales) desglosa un plan maestro de producción a través de la lista de materiales y crea órdenes planificadas por fecha. Kanban sustituye solo el último paso para las piezas controladas por kanban: la liberación de órdenes individuales. Una división del trabajo viable:

| Tarea | MRP / ERP | Bucle kanban |
|---|---|---|
| Planificación de capacidad y materiales a largo plazo | Sí: S&OP, plan maestro, capacidad aproximada (rough-cut) | No |
| Contratos con proveedores, pedidos marco, previsiones a proveedores | Sí: compartir cantidades previstas para la planificación de capacidad | No |
| Piezas de largo plazo de entrega y piezas no kanban | Sí: órdenes planificadas | No |
| Liberación diaria de piezas kanban | No: suprimir las órdenes planificadas de estas piezas | Sí: señal de consumo |
| Transacciones de inventario | Sí: entradas, salidas, a menudo con backflushing | Genera las transacciones (escaneo) |
| Dimensionamiento de bucles | Calcula sugerencias a partir de la demanda | La planta valida y ajusta |
| Costeo y valoración | Sí | No |

Hay dos puntos técnicos importantes:

- **Evite la doble planificación.** Si MRP sigue creando órdenes planificadas para una pieza que también está en kanban, compradores y planificadores reciben dos señales contradictorias. La mayoría de los sistemas ERP permiten marcar una pieza como controlada por kanban, de modo que MRP solo la planifica a efectos de capacidad y previsión. La configuración varía según el sistema; consulte la documentación de su ERP.
- **El backflushing requiere listas de materiales precisas.** Cuando el sistema descuenta automáticamente los componentes en un punto de reporte, las cantidades erróneas en la lista de materiales aparecen como faltantes fantasma en el bucle kanban. Corrija la lista de materiales, no el número de tarjetas.

MRP y S&OP se tratan en profundidad en la [guía de S&OP, MRP y planificación de producción](https://www.m365.fm/en/learn/sop-mrp-production-planning/), y la política de inventario, incluido el cálculo del stock de seguridad, en la [guía de gestión de inventario en manufactura](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/).

### Dónde encaja el e-kanban en la arquitectura IT/OT

El e-kanban toca varias capas de sistemas: el ERP (planificación, compras, valoración de inventario), el MES o la aplicación de taller (señales de producción, confirmaciones), escáneres y sensores en planta, y portales de proveedores o enlaces EDI con proveedores externos. El modelo ISA-95 para la integración de sistemas empresariales y de control es una forma útil de decidir qué sistema es responsable de cada dato kanban; véase la [guía de MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/). Dos reglas prácticas:

- **Un solo sistema es responsable de los datos maestros del kanban** (bucles, número de tarjetas, cantidades por contenedor). Los duplicados en Excel, MES y ERP se desvían en cuestión de semanas.
- **Proteja contra señales duplicadas.** Un contenedor escaneado dos veces, o un sensor que parpadea, crea dos señales de reposición para un mismo contenedor vacío. Permita solo una señal abierta por ID de kanban y registre cada cambio de estado.
- **Planifique las caídas del servicio.** Si la red o la aplicación kanban fallan, la planta necesita tarjetas impresas o un procedimiento de respaldo en papel para cada bucle. Cualquier dispositivo de escaneo y conexión con proveedores también forma parte de la superficie de ataque de la planta; la [guía de ciberseguridad OT](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) explica cómo segmentar y proteger estos enlaces. Para opciones de integración basadas en la nube, véase la [guía de Azure para manufactura](https://www.m365.fm/en/learn/manufacturing-it-azure/).

### Simular bucles antes de construirlos

En plantas con muchos bucles o con una fuerte variación de la demanda, una simulación de eventos discretos puede probar recuentos de tarjetas, tamaños de supermercado e intervalos de ruta frente a la demanda histórica antes de que cambie algo en planta. La [guía de simulación de manufactura](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/) explica cómo se construyen estos modelos. El software de mapeo de flujo de valor puede ayudar a mantener coherentes entre sitios los mapas de estado futuro con supermercados y bucles kanban; la [guía de iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) describe una de estas herramientas y sus límites. **Nota: el autor trabaja en iFAKT GmbH.**

## Plantillas: tarjeta, hoja de cálculo de dimensionamiento, lista de verificación del supermercado, auditoría

Copie estas tablas en una hoja de cálculo o en su documentación de piso de planta. Son deliberadamente sencillas: un sistema kanban debe funcionar con una impresora y una plastificadora antes de necesitar software.

### Plantilla 1: diseño de la tarjeta kanban

| Campo | Ejemplo | Notas |
|---|---|---|
| Número y nombre de la pieza | B-200, soporte izquierdo | Fuente grande; legible a 6 pies (unos 2 m) |
| Tipo de kanban | Kanban de producción | Código de color por tipo (por ejemplo, blanco = producción, amarillo = retiro, rojo = emergencia) |
| Número de tarjeta | 3 de 9 | Muestra el tamaño del bucle; revela tarjetas perdidas |
| Cantidad por contenedor | 40 piezas | Nunca escriba "aprox." |
| Tipo de contenedor | Caja azul 600 × 400 mm | Coincide con la ranura del estante |
| Proceso proveedor o proveedor | Celda W2 (estampado y soldadura) | Para kanban de proveedor: nombre del proveedor e ID |
| Dirección de almacenamiento (supermercado) | SM-W2, estante 3, nivel B, ranura 07 | Ubicación a la que regresa el contenedor lleno [1] |
| Dirección del proceso consumidor | Línea 1, estación 14, estante izquierdo | Punto de uso [1] |
| Código de barras o QR | ID del bucle + número de tarjeta | Para e-kanban o escaneos de auditoría |
| Revisión y fecha | Rev. 4, nov. 2026 | Se cambia cuando se redimensiona el bucle |

### Plantilla 2: hoja de trabajo para el dimensionamiento del bucle

| Línea | Dato | Unidad | Ejemplo (soporte B-200) |
|---|---|---|---|
| 1 | Demanda diaria promedio | piezas/día | 960 |
| 2 | Tiempo disponible por día | minutos | 900 |
| 3 | Takt (línea 2 ÷ línea 1) | minutos/pieza | 0,9375 |
| 4 | Cantidad por contenedor | piezas | 40 |
| 5 | Intervalo de recolección de tarjetas | minutos | 60 |
| 6 | Cola en el proceso proveedor | minutos | 90 |
| 7 | Cambio de formato por lote (si no está en la cola) | minutos | 0 |
| 8 | Tiempo de procesamiento por contenedor | minutos | 20 |
| 9 | Transporte y colocación | minutos | 15 |
| 10 | Tiempo de reposición (líneas 5 a 9) | minutos | 185 |
| 11 | Kanbans para el tiempo de reposición (línea 10 ÷ línea 3 ÷ línea 4) | kanbans | 4,93 |
| 12 | Tamaño de lote en el proceso proveedor | contenedores | 4 |
| 13 | Kanbans adicionales por formación de lote (línea 12 – 1) | kanbans | 3 |
| 14 | Margen de seguridad (10 % de la línea 11) | kanbans | 0,49 |
| 15 | Total (líneas 11 + 13 + 14), redondeado hacia arriba | kanbans | 9 |
| 16 | Inventario máximo del bucle (línea 15 × línea 4) | piezas | 360 |
| 17 | Días de cobertura (línea 16 ÷ línea 1) | días | 0,375 |
| 18 | Próxima fecha de revisión | fecha | mensual |

### Plantilla 3: lista de verificación del diseño del supermercado

| # | Verificación | Sí / No |
|---|---|---|
| 1 | Cada número de pieza en el supermercado cumple los criterios de producto de rotación (demanda regular, baja variación) | |
| 2 | Cada número de pieza tiene exactamente una dirección fija | |
| 3 | La capacidad del estante es igual al tamaño máximo del bucle por número de pieza, sin ranuras adicionales | |
| 4 | Los estantes se cargan por detrás y se retiran por delante | |
| 5 | Las posiciones de la señal kanban o las marcas mín./máx. son visibles | |
| 6 | Pesos de los contenedores y alturas de manipulación revisados según la guía ergonómica [28] | |
| 7 | Los pasillos permiten un acceso seguro para carros o tractores, separados de las vías peatonales | |
| 8 | Puesto kanban en el consumidor y en el proceso proveedor | |
| 9 | La ruta del operario y el intervalo de recolección están escritos y cronometrados | |
| 10 | Está definida la ruta de retorno de los contenedores vacíos | |
| 11 | Se han nombrado una persona de contacto y un suplente para el supermercado | |
| 12 | Están definidos el procedimiento y el color del kanban de emergencia | |

### Plantilla 4: auditoría semanal de kanban

| Verificación | Cómo | Objetivo | Acción si no se cumple |
|---|---|---|---|
| Recuento de tarjetas por bucle | Contar tarjetas en los puestos, en el proveedor, en los contenedores llenos y en la línea | Igual a la lista maestra | Buscar; si se perdió, reemplazar y registrar la causa |
| Contenedores sin etiqueta | Recorrer el supermercado y la línea | Cero | Etiquetar o retirar; averiguar quién los creó |
| Desborde del supermercado | Contenedores fuera de las ranuras fijas | Cero | Detener la sobreproducción; revisar la regla 3 |
| Desabastecimientos | Paradas de línea o faltantes por bucles vacíos | Cero; registrar el número | Causa raíz: tarjeta, dimensionamiento, proveedor, calidad |
| Kanbans de emergencia en uso | Contar tarjetas rojas | Cero tras la recuperación | Retirar; analizar el disparador |
| Tiempo de reposición | Marcas de tiempo o muestra de 10 tarjetas | Dentro del valor usado para el dimensionamiento | Redimensionar el bucle o corregir la demora |
| Piezas defectuosas en los contenedores | Control por muestreo en el punto de uso | Cero | Contención de calidad en la fuente |

### Plantilla 5: reglas kanban para el tablero de piso de planta

| # | Regla | Quién |
|---|---|---|
| 1 | Tomamos piezas solo de nuestra propia dirección de punto de uso | Operarios |
| 2 | Cuando un contenedor está vacío, su tarjeta va de inmediato al buzón kanban | Operarios |
| 3 | Solo fabricamos lo que autorizan los kanban de producción, en su secuencia | Celda proveedora |
| 4 | Un contenedor lleno siempre lleva su tarjeta | Todos |
| 5 | Las piezas defectuosas nunca entran en un contenedor; nos detenemos y avisamos | Todos |
| 6 | Las tarjetas se añaden o se retiran solo por el responsable del lazo, con fecha | Responsable de materiales |
| 7 | Las tarjetas rojas de emergencia vuelven al responsable del lazo después de usarse | Responsable de materiales |
| 8 | Si el sistema y el estante no coinciden, confiamos en el estante e informamos de la diferencia | Todos |

## Cómo implantar kanban en la fabricación: una hoja de ruta de 26 semanas

Implantar un sistema de arrastre empieza por un proceso productivo estable, no por las tarjetas. La hoja de ruta siguiente es una secuencia típica para una cadena de valor y su equipo de fabricación en una planta de tamaño medio. Las duraciones son supuestos de planificación, no referencias de rendimiento; las plantas con experiencia previa en lean avanzan más rápido, y las de procesos inestables, más despacio.

| Fase | Semanas | Objetivo | Actividades principales | Criterios de salida |
|---|---|---|---|---|
| 0. Seleccionar y establecer la línea base | 1–2 | Elegir el piloto y medir la situación actual | Elegir una familia de productos; mapa del estado actual; medir WIP, lead time, roturas de stock y valor del inventario | KPI de línea base aprobados por operaciones y finanzas |
| 1. Estabilizar | 3–6 | Hacer el proceso capaz de funcionar en arrastre | 5S en el suministro y en el punto de uso; corregir las principales causas de paradas; reducir cambios de formato en el proceso proveedor; definir contenedores | El proceso proveedor cumple su producción planificada 9 de cada 10 días |
| 2. Diseñar | 7–10 | Estado futuro y diseño de los lazos | Segmentar piezas (runners, repeaters, strangers); elegir tipos de lazo; dimensionar los lazos con la hoja de cálculo; diseñar el supermercado y la ruta | Lista de lazos con número de tarjetas, direcciones y responsables |
| 3. Piloto | 11–14 | Poner en marcha de 5 a 15 lazos | Imprimir tarjetas, formar a operarios y transportistas, arrancar los lazos; revisión diaria en el tablero; ajustar tamaños | Dos semanas sin roturas de stock causadas por el diseño de los lazos |
| 4. Extender | 15–22 | Cubrir la cadena de valor | Añadir los runners restantes; primeros kanban de proveedores; conectar el programa del pacemaker; nivelar la mezcla | 80 % de las referencias runner en kanban; órdenes planificadas de MRP suprimidas para ellas |
| 5. Mejorar y digitalizar | 23–26 y en adelante | Reducir WIP, añadir datos | Retirar tarjetas una a una; reducir tamaños de lote; e-kanban para proveedores lejanos; redimensionado mensual | Reducciones de tarjetas documentadas; e-kanban en lazos seleccionados |

### Requisitos previos que no puede omitir

| Requisito previo | Por qué lo necesita kanban | Dónde leer más |
|---|---|---|
| Procesos proveedores estables y capaces | Un lazo dimensionado para 0,25 días falla si la máquina se detiene medio día | [Guía de TPM y OEE](https://www.m365.fm/en/learn/tpm-oee/) |
| Cambios de formato cortos | El tamaño de lote determina el número de tarjetas (ejemplo 2) | [Guía de SMED](https://www.m365.fm/en/learn/smed-changeover-reduction/) |
| Organización del puesto de trabajo | Direcciones fijas, estantes claros, estado visible | [Guía de 5S y gestión visual](https://www.m365.fm/en/learn/5s-visual-management/) |
| Trabajo estándar para transportistas y operarios | Los intervalos de ruta y el manejo de tarjetas deben ser repetibles | [Guía de trabajo estándar](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) |
| Programa de pacemaker nivelado | La demanda no nivelada infla los lazos | Sección de Heijunka anterior |
| Datos fiables | Cantidades por contenedor, BOM e historial de demanda | [Guía de KPI de fabricación](https://www.m365.fm/en/learn/manufacturing-kpis/) |

### Elegir los lazos piloto

Los primeros lazos buenos comparten cinco rasgos: demanda diaria, un proceso proveedor cercano, cambios de formato de menos de unos 15 minutos, una pieza que ha causado faltantes visibles o exceso de stock, y un líder de equipo que quiere probarlo. Evite para el primer lazo la pieza del cuello de botella más crítico de la planta; un error de diseño allí detiene toda la línea.

### Involucrar a operarios, transportistas y sus representantes

Un sistema kanban cambia el trabajo diario de los operarios y de los transportistas de material. Su compromiso decide si las reglas se mantienen.

- **Explique primero el propósito y luego las reglas.** Las personas que ven los faltantes de material y los racks desbordados suelen entender rápido por qué un límite de WIP ayuda. Quienes reciben la orden de "seguir la tarjeta" sin contexto no lo entienden.
- **Deje que los operarios definan las posiciones de los contenedores y las alturas de los racks.** Ellos saben dónde alcanzar y levantar resulta perjudicial. Use los recursos de ergonomía de OSHA como referencia para la revisión [28].
- **Acuerde qué ocurre con el tiempo y la mano de obra liberados.** Si la manipulación de inventario se reduce, la gente se preocupa por su empleo. Indíquelo desde el principio y, si aplica un convenio colectivo, por escrito, cómo se usará la capacidad liberada. La [guía de manufactura esbelta](https://www.m365.fm/en/learn/lean-manufacturing/) analiza el contexto laboral de EE. UU., incluidos los comités de participación de los empleados bajo la NLRA.
- **Haga que la regla de parada sea segura.** La regla 5 (sin defectos aguas abajo) solo funciona si detener la línea y pedir ayuda nunca es motivo de castigo.
- **Use el tablero diario.** Los problemas de los bucles pertenecen a la reunión diaria escalonada; consulte la [guía de gestión de piso de planta](https://www.m365.fm/en/learn/shop-floor-management/).

### Cómo obtener ayuda externa

Los fabricantes de EE. UU., especialmente los pequeños y medianos, pueden solicitar apoyo en manufactura esbelta y mejora de procesos a su centro estatal del Manufacturing Extension Partnership (MEP) del NIST; el NIST MEP incluye la manufactura esbelta y la mejora de procesos entre sus servicios [27]. Los métodos de mejora continua para que los bucles sigan mejorando se tratan en la [guía de kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/).

## KPI de kanban y perspectiva financiera

### KPI operativos

| KPI | Fórmula | Ejemplo | Dirección objetivo |
|---|---|---|---|
| Inventario de bucle (máx.) | Kanbans × cantidad por contenedor | 9 × 40 = 360 piezas | A la baja con el tiempo |
| Días de cobertura | Inventario máximo de bucle ÷ demanda diaria promedio | 360 ÷ 960 = 0,375 días | A la baja, dentro de los límites de seguridad |
| Faltantes por semana | Número de paros de línea o faltantes causados por un bucle vacío | 2 | Cero |
| Exactitud de tarjetas | Tarjetas encontradas en la auditoría ÷ tarjetas en la lista maestra | 87 ÷ 90 = 96,7 % | 100 % |
| Cumplimiento del tiempo de reposición | Kanbans repuestos dentro del tiempo dimensionado ÷ todos los kanbans | 182 ÷ 200 = 91 % | Al alza |
| Kanbans de emergencia | Número emitido por mes | 4 | A la baja |
| WIP (flujo de valor) | Suma de piezas entre el primer y el último proceso | 3.200 -> 1.200 | A la baja |
| Tiempo de entrega (ley de Little) | WIP ÷ rendimiento [6] | 1.200 ÷ 400 = 3 días | A la baja |
| Rotación de inventario | Costo anual de bienes vendidos ÷ valor promedio del inventario | 24 M$ ÷ 3 M$ = 8 | Al alza |
| Entrega a tiempo | Pedidos enviados a tiempo ÷ todos los pedidos | 95 % | Al alza o estable |
| Kanbans retirados | Tarjetas retiradas tras una mejora, por trimestre | 12 | Seguimiento, no una cuota |

Observe los pares. Un inventario en descenso con faltantes en aumento significa que los bucles se recortaron demasiado o que el proceso no es lo bastante estable. Una entrega a tiempo en aumento con inventario estable puede indicar que los bucles están bien y que la mejora provino de la nivelación. Las definiciones de KPI y los tableros para el resto de la planta se tratan en la [guía de KPI de manufactura](https://www.m365.fm/en/learn/manufacturing-kpis/).

### La perspectiva financiera: caja, costo de mantenimiento de inventario y utilidad reportada

Un contralor de planta observa tres efectos.

**1. Liberación de caja única.** Supongamos que 120 números de parte de producción continua pasan de puntos de reorden mín./máx. a kanban, y que el inventario promedio disponible de cada bucle baja 3.000 $ a costo estándar. Eso libera 120 × 3.000 $ = 360.000 $ de capital de trabajo, una sola vez. No se repite cada año.

**2. Ahorro continuo en costo de mantenimiento de inventario.** El costo de mantenimiento incluye costo de capital, almacenamiento, manipulación, seguros, obsolescencia y merma. El porcentaje varía mucho según la empresa y la industria; use la cifra de su propio contralor. Con un 20 por ciento anual ilustrativo (un supuesto para este ejemplo, no un referente), la reducción de 360.000 $ ahorra unos 72.000 $ al año.

**3. Un impacto temporal en la utilidad reportada bajo costeo absorbente.** En el costeo absorbente, los productos terminados y el WIP cargan una parte de los costos indirectos fijos de manufactura. Cuando el inventario baja, los costos indirectos que se capitalizaron en periodos anteriores pasan al costo de bienes vendidos, por lo que la utilidad reportada puede caer en los trimestres en que el WIP y los productos terminados disminuyen, aunque la caja mejore. Los informes internos basados en costeo variable (directo) no muestran esta caída, y esa es una razón para presentar ambas visiones en la revisión del piloto. Explique esto a la dirección antes del piloto, o el primer trimestre con kanban puede parecer un fracaso. Las materias primas y las partes compradas no cargan costos indirectos absorbidos, así que el efecto proviene principalmente del WIP y de los productos terminados.

**Costos a presupuestar.** Contenedores, racks y estanterías de flujo (capex u opex según su umbral de capitalización), impresión y plastificado de tarjetas, tiempo de capacitación, posiblemente escáneres y licencias del módulo kanban del ERP para el e-kanban (normalmente opex en un modelo de suscripción), y la ruta del manipulador de materiales. Un piloto típico de 10 a 15 circuitos consiste principalmente en costos de mano de obra y de contenedores; el dimensionamiento y las reglas no cuestan nada, solo disciplina.

**Ejemplo de caso de negocio para un piloto (todas las cifras son ilustrativas):**

| Concepto | Importe |
|---|---|
| Contenedores y racks de flujo para 15 circuitos | $18,000 |
| Capacitación: 40 personas × 4 horas × $45 tarifa cargada | $7,200 |
| Tiempo de ingeniería y coaching, 8 semanas a tiempo parcial | $20,000 |
| **Costo total del piloto** | **$45,200** |
| Reducción única de inventario, 15 circuitos × $3,000 | $45,000 |
| Ahorro anual por costo de mantenimiento de inventario a una tasa supuesta del 20% | $9,000 |
| Flete urgente evitado (datos propios de la planta, ejemplo) | $12,000 por año |

En este ejemplo, el piloto se paga aproximadamente por sí mismo en efectivo durante el primer año. El caso más relevante suele ser el despliegue a toda la cadena de valor y la reducción del lead time que lo acompaña.

## Errores comunes con kanban y cómo corregirlos

| Error | Síntoma | Solución |
|---|---|---|
| Kanban antes de la estabilidad | Faltantes frecuentes porque la máquina que abastece está detenida o la scrap es alta | Estabilizar primero (TPM, calidad en la fuente); mientras tanto, dimensionar los circuitos según el tiempo de reposición real |
| Supermercados para piezas esporádicas | Racks llenos de artículos de baja rotación, mucho inventario a pesar del "pull" | Segmentar las piezas; usar fabricación contra pedido con CONWIP o POLCA para las piezas esporádicas |
| Dimensionar con el tiempo de ciclo de la máquina en lugar del tiempo de reposición | Los circuitos siempre quedan cortos | Medir el tiempo de reposición de extremo a extremo (hojas de cálculo, líneas 5 a 10) |
| Ignorar el tamaño de lote en el proveedor | Circuitos cortos cuando el proveedor produce por lotes | Añadir kanbans de formación de lote o reducir el tamaño de lote con SMED |
| No recalcular nunca | Circuitos demasiado grandes tras una caída de la demanda, demasiado pequeños tras un aumento | Revisión mensual; sugerencias de recálculo basadas en el ERP [15] |
| Tarjetas extra informales | El circuito crece y vuelve la sobreproducción | Lista maestra de tarjetas, responsable del circuito, tarjetas de emergencia de color retiradas después de su uso |
| Retirar tarjetas demasiado rápido | La línea se detiene, se pierde la confianza | Retirar una tarjeta a la vez, solo cuando alguien pueda resolver el problema expuesto [12] |
| MRP con órdenes planificadas en paralelo | Los compradores piden dos veces las piezas kanban | Marcar las piezas kanban en el ERP; usar MRP solo para pronóstico y capacidad |
| Pacemaker sin nivelar | Los circuitos aguas arriba ven picos grandes | Caja Heijunka con pitch; lotes más pequeños en el pacemaker |
| E-kanban como atajo | Los problemas quedan ocultos en un sistema que nadie revisa | Operar con circuitos de papel hasta que las reglas se cumplan; luego digitalizar con un tablero visual |
| Falta de responsabilidad | Nadie advierte las tarjetas perdidas | Responsable nominal del circuito y auditoría semanal (plantilla 4) |
| Proveedor no involucrado | El proveedor no detecta las señales o envía de más | Acuerdo conjunto sobre el método de señal, lead time, contenedor y cantidad; empezar con unas pocas piezas |
| Lotes o revisiones mezclados en un mismo contenedor | Se pierde la trazabilidad cuando un lote es sospechoso o se retira; revisión incorrecta en la línea | Un solo lote y una sola revisión por contenedor; número de lote o código de fecha en la etiqueta; racks FIFO; regla de contención que congela las tarjetas del circuito para el lote sospechoso |

## Límites: cuándo el kanban es la herramienta equivocada

El kanban encaja en una situación concreta. Las plantas que aplican kanban en la fabricación fuera de ese contexto se encuentran con los siguientes problemas.

**Producción de alta variedad y bajo volumen, y producción a medida.** La guía de Suri afirma claramente que el kanban "no funciona bien con producción de bajo volumen o a medida" [20]. Un bucle específico para una pieza que se pide dos veces al año no es más que inventario con una tarjeta. CONWIP y POLCA se desarrollaron precisamente para estos casos [3][20].

**Demanda muy variable.** El tamaño del bucle depende de la demanda durante el tiempo de reposición más el stock de seguridad. Si la demanda oscila un factor de tres de una semana a otra y no puede nivelarse, el bucle debe dimensionarse para los picos, y la mayor parte del tiempo contiene más stock del necesario. Hay que nivelar la demanda en el pacemaker, usar un control planificado (MRP) o redimensionar los bucles de forma dinámica.

**Reposición larga y poco fiable.** Los kanban de proveedor con proveedores de ultramar y tiempos de tránsito largos inmovilizan muchas semanas de inventario en el bucle; la señal llega demasiado tarde para reaccionar a cambios reales. En estos casos, las previsiones y las liberaciones planificadas del MRP, combinadas con un almacén intermedio local, suelen funcionar mejor.

**Ciclos de vida cortos de producto y cambios de ingeniería.** Un bucle lleno de piezas de la revisión anterior se convierte en chatarra cuando cambia el diseño. Hay que planificar la retirada: congelar el bucle, agotar las tarjetas y, después, introducir el nuevo número de pieza con nuevas tarjetas.

**Riesgo de suministro y resiliencia.** Los sistemas pull reducen el inventario que cubre la variación normal. No están diseñados para cubrir interrupciones como un incendio en un proveedor o una escasez de chips. Toyota, el origen del kanban, introdujo un plan de continuidad de negocio tras el terremoto de 2011, según el cual los proveedores mantienen entre dos y seis meses de stock de semiconductores, dependiendo de la pieza [26]. Decidir qué piezas necesitan un almacén estratégico fuera del bucle kanban es una decisión de riesgo; véase la [guía de resiliencia de la cadena de suministro](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/).

**Teoría y práctica.** La literatura académica sobre kanban es amplia. Lage Junior y Godinho Filho revisaron 32 variantes del sistema kanban y encontraron una gran brecha entre el número de propuestas teóricas y el de propuestas prácticas [17]. Muchas variantes optimizadas nunca se han probado en una planta. Para la mayoría de los profesionales, el bucle clásico con un dimensionamiento honesto y reglas disciplinadas es el punto de partida adecuado.

**Dónde se sitúa el kanban en entornos regulados y de proyecto.** En aeroespacial y defensa, los bajos volúmenes, los largos plazos de entrega y los requisitos de trazabilidad limitan el kanban clásico al hardware estándar, a los consumibles y a los subconjuntos repetitivos; véase la [guía de planificación de producción aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/). En las industrias de procesos, los kanban de señal en tanques o silos pueden funcionar cuando los tamaños de lote son grandes y los cambios de formato son largos.

## Glosario de kanban

| Término | Definición |
|---|---|
| Cantidad por contenedor (cantidad de empaque) | Número fijo de piezas por kanban; la unidad del bucle |
| CONWIP | Trabajo constante en proceso; un sistema pull con un único juego de tarjetas para toda una línea [3][5] |
| Tambor-amortiguador-cuerda (DBR) | Método de control de la teoría de restricciones: la restricción marca el ritmo, un amortiguador de tiempo la protege y la liberación de material se vincula a ella |
| Kanban electrónico (e-kanban) | Señal kanban electrónica, activada por escaneo o sensor [10] |
| Kanban de emergencia | Tarjeta adicional temporal para recuperarse de una escasez; se retira después de usarse |
| Carril FIFO | Cola con una cantidad máxima entre dos procesos, primero en entrar, primero en salir |
| Heijunka | Nivelación del tipo y la cantidad de producción durante un periodo fijo [18] |
| Caja heijunka | Programa visual con tipos de producto en un eje y franjas de tiempo (pitch) en el otro [18] |
| Justo a tiempo (JIT) | Fabricar solo lo necesario, cuando se necesita, en la cantidad necesaria [8] |
| Kanban | Dispositivo de señalización que autoriza la producción o el retiro en un sistema pull; palabra japonesa que significa "señal" o "letrero" [1] |
| Buzón kanban | Caja o rack donde se recogen los kanbans para su retiro |
| Ley de Little | WIP promedio = rendimiento × tiempo de entrega promedio [6] |
| Bucle | Una relación proveedor-consumidor para un número de parte con su juego de kanbans |
| Marcapasos | El único proceso que recibe el programa de producción |
| Pitch | Tiempo para fabricar un contenedor: takt time × cantidad de empaque [19] |
| POLCA | Bucles de tarjetas con autorización y celdas emparejadas en solapamiento; pull para talleres de alta mezcla y bajo volumen [20][21] |
| Kanban de producción | Tarjeta que autoriza a un proceso a fabricar un tipo y una cantidad [1] |
| Sistema pull | Sistema de producción que limita explícitamente el WIP [2] |
| Sistema push | Sistema que libera trabajo según un programa, sin tope de WIP |
| Tiempo de reposición | Tiempo desde que se vacía un contenedor (se libera su tarjeta) hasta que el contenedor lleno vuelve a su punto de almacenamiento |
| Runners, repeaters, strangers | Segmentación de piezas por regularidad de la demanda, usada para elegir entre kanban y fabricación bajo pedido |
| Factor de seguridad | Porcentaje añadido a la demanda durante la reposición para cubrir la variación |
| Kanban de señal (kanban triangular) | Tarjeta que dispara un lote cuando el inventario alcanza el punto de activación [1] |
| Supermercado | Punto de stock controlado con direcciones fijas y cantidades máximas, del que retira el proceso aguas abajo |
| Kanban de proveedor | Kanban de retiro hacia un proveedor externo, a menudo electrónico [1] |
| Takt time | Tiempo disponible dividido entre la demanda del cliente |
| Sistema de dos contenedores | Dos contenedores por pieza; un contenedor vacío es la señal de reposición [10] |
| Retiro (kanban de retiro) | Tarjeta que autoriza mover piezas a un proceso aguas abajo [1] |
| Mizusumashi (araña de agua) | Operario de manejo de materiales en una ruta fija que mueve kanbans y contenedores |
| WIP | Trabajo en proceso: material iniciado pero no terminado |

## Preguntas frecuentes: sistema kanban y sistema pull

### ¿Qué es un sistema kanban en la fabricación?

Un sistema kanban controla la producción y el movimiento de materiales mediante señales que se activan con el consumo. Cuando un proceso posterior utiliza un contenedor, su tarjeta o el contenedor vacío regresa al proceso anterior y autoriza exactamente una reposición. El número de tarjetas limita el inventario en cada bucle [1].

### ¿Qué información aparece en una tarjeta kanban?

Normalmente el nombre y el número de la pieza, el proceso o proveedor que la suministra, la cantidad por contenedor (pack-out), la dirección de almacenamiento y la dirección del proceso consumidor [1]. La mayoría de las plantas añaden el número de tarjeta dentro del bucle (por ejemplo, 3 de 9), el tipo de kanban y un código de barras para auditorías o e-kanban.

### ¿Cuáles son los principales tipos de kanban?

Kanban de producción (fabricar esta cantidad), kanban de retiro o de movimiento (mover esta cantidad), kanban de señal o triángulo (iniciar un lote en un punto de activación) y kanban de proveedor (pedir a un proveedor externo) [1]. Los sistemas de dos contenedores, los kanban de emergencia, los kanban de un solo uso y el e-kanban son variantes de estos.

### ¿Cómo se calcula el número de tarjetas kanban?

Se parte de N = demanda × tiempo de entrega de la reposición × (1 + factor de seguridad) ÷ cantidad por contenedor, y se redondea hacia arriba. Ejemplo: 960 × 0,25 × 1,1 ÷ 40 = 6,6, es decir, 7 tarjetas. Después, hay que comprobar si los intervalos de recogida y los tamaños de lote en el proceso suministrador requieren tarjetas adicionales; en el ejemplo anterior, elevan el número a 9 [12][13].

### ¿Cuáles son las seis reglas kanban de Toyota?

En la versión habitual: el proceso posterior retira lo que utiliza, el proceso anterior produce en la cantidad y secuencia de los kanban, no se fabrica ni mueve nada sin un kanban, el kanban siempre acompaña a las piezas, nunca se envían piezas defectuosas y el número de kanban se reduce paso a paso para exponer los problemas [10]. Una segunda versión, del manual de Toyota de 1973, las formula de otra manera y añade "reducir las fluctuaciones" y "estabilizar y racionalizar el proceso de producción" [11].

### ¿Cuál es la diferencia entre sistemas push y pull?

Un sistema pull limita explícitamente el trabajo en proceso; un sistema push libera el trabajo según un calendario sin ese límite [2]. Pull no es lo mismo que fabricar bajo pedido: un bucle kanban de fabricación para stock es pull, y un taller de fabricación bajo pedido que libera todos los pedidos a la vez es push.

### ¿Es el kanban lo mismo que el just-in-time?

No. El just-in-time es el principio de fabricar solo lo que se necesita, cuando se necesita, en la cantidad necesaria [8]. El kanban es el sistema de señalización que Toyota desarrolló para llevar ese principio a la práctica [7].

### ¿Qué es un sistema kanban de dos contenedores?

Cada pieza tiene dos contenedores en el punto de uso. Cuando el primero se vacía, el operario empieza con el segundo y envía el contenedor vacío de vuelta como señal de reposición. Cada contenedor contiene lo suficiente para cubrir la demanda durante el tiempo de reabastecimiento más un margen. Es la forma más sencilla de kanban y se adapta a consumibles de bajo coste [10].

### ¿Qué es un supermercado kanban?

Un punto de stock controlado, normalmente junto al proceso suministrador, donde cada número de pieza tiene una dirección fija y una cantidad máxima. El proceso posterior o un operario de materiales retira de él, y el proveedor repone solo lo que se ha retirado.

### ¿Qué es el e-kanban?

El kanban electrónico sustituye las tarjetas físicas por escaneos, sensores o mensajes del sistema. Ayuda a eliminar los errores de introducción manual y la pérdida de tarjetas [10], y es la forma habitual con proveedores lejanos [1]. Ponga primero en marcha un bucle en papel; digitalícelo cuando las reglas funcionen.

### ¿Cuál es la diferencia entre kanban y MRP?

El MRP planifica materiales y capacidad a partir de un plan maestro y de las listas de materiales, por fechas. El kanban libera la reposición según el consumo. En la mayoría de las plantas, el MRP se encarga de la planificación a largo plazo, de los pronósticos a proveedores y de las piezas que no siguen kanban, mientras que el kanban ejecuta la reposición diaria de las piezas de rotación habitual [15][16].

### ¿Qué es CONWIP y en qué se diferencia del kanban?

CONWIP (trabajo en proceso constante) utiliza un único conjunto de tarjetas para toda una línea: un trabajo entra solo cuando hay una tarjeta libre, y la tarjeta vuelve al inicio cuando el trabajo termina [3][5]. El kanban utiliza tarjetas específicas de cada pieza en cada etapa. CONWIP es más fácil de implantar y se adapta a líneas con muchas variantes; el kanban ofrece un control más estricto por etapa [5].

### ¿Cuándo no conviene usar kanban?

Cuando la demanda por pieza es esporádica o muy variable, cuando los productos son a medida o de bajo volumen, cuando los tiempos de reposición son largos e inciertos, o cuando las piezas cambian de revisión con frecuencia. En esos casos conviene usar fabricación bajo pedido con CONWIP o POLCA, o un control planificado con MRP [20].

### ¿Es un kanban de fabricación lo mismo que un tablero Kanban?

No. Ambos limitan el trabajo en curso, pero un tablero Kanban gestiona tareas en trabajo del conocimiento y su tamaño se define a juicio del equipo, mientras que el kanban de fabricación gestiona piezas físicas y su tamaño se calcula mediante una fórmula. El método del tablero tiene sus raíces en el sistema de producción de Toyota [22].

### ¿Cuántos kanbans debe tener un bucle como mínimo?

Dos. Con una sola tarjeta, el consumidor tiene que esperar cada vez que la tarjeta está en tránsito. Algunas plantas fijan un mínimo interno de tres para los kanbans de producción.

### ¿Cuánto tiempo lleva implantar el kanban?

Para una cadena de valor, un piloto de 5 a 15 bucles puede ejecutarse en unos tres meses si los procesos proveedores son estables; la cobertura completa de una cadena de valor suele requerir unos seis meses en la hoja de ruta anterior. Los procesos inestables y los cambios de formato largos alargan ese plazo.

### ¿Puede el kanban funcionar con los proveedores?

Sí, mediante kanbans de proveedor, que suelen ser electrónicos para los proveedores alejados [1]. Acuerden el método de señalización, el plazo de entrega, el contenedor, la cantidad y qué ocurre con los picos. Compartan las previsiones de MRP para que el proveedor pueda planificar su capacidad, mientras que el kanban activa las entregas reales.

### ¿Es el just-in-time un sistema de empuje o de arrastre?

De arrastre. Toyota describe el JIT como un bucle en el que los procesos aguas arriba reponen solo lo que los procesos aguas abajo han consumido [8], y el kanban es la herramienta que lo lleva a cabo [7]. Una planta puede llamarse JIT y seguir trabajando por empuje, por ejemplo liberando cada orden en cuanto se registra; la prueba es si el WIP está limitado [2].

### ¿Qué son los sistemas de empuje y de arrastre en la gestión de la cadena de suministro?

La misma lógica aplicada entre empresas. En una cadena de suministro de empuje, las materias primas y los productos terminados se mueven y almacenan según previsiones. En una cadena de suministro de arrastre, la reposición sigue la demanda real, por ejemplo mediante kanbans de proveedor [1]. La mayoría de las cadenas de suministro combinan ambos: las previsiones planifican la capacidad y las compras con plazos largos, mientras que las señales de consumo activan las entregas.

### ¿Puede un sistema de arrastre funcionar sin previsiones de demanda?

No del todo. La reposición diaria se basa en el consumo, pero los tamaños de bucle se calculan a partir de la demanda prevista, los módulos de kanban de los ERP los recalculan a partir de los periodos de demanda [15], y los proveedores necesitan previsiones para planificar su capacidad. El arrastre sustituye la liberación de órdenes basada en previsiones, no la previsión en sí.

### ¿Es el kanban lean o Six Sigma?

Lean. El kanban procede del Sistema de Producción de Toyota [7][8], la principal fuente de la producción lean. Six Sigma es un método independiente, basado en estadística, para reducir la variación y los defectos. Muchas plantas usan ambos, porque los procesos estables y capaces permiten bucles de kanban más pequeños; véase la [guía de Six Sigma y análisis de causa raíz](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).

### ¿Es el kanban japonés o chino?

Japonés. Kanban es la palabra japonesa para «señal» o «letrero» [1], y el método se desarrolló en Toyota, en Japón [7][10].

## Conclusión y primeros pasos

Un sistema kanban es un límite de WIP hecho visible. Sus tarjetas, contenedores y supermercados convierten una idea sencilla del taller de máquinas de Toyota en los años cincuenta en práctica diaria: fabricar y mover solo lo que el siguiente proceso ha consumido. La definición más importante para el diseño procede de Hopp y Spearman: un sistema pull limita explícitamente el trabajo en curso [2]. Kanban hace esto número de pieza por número de pieza. CONWIP, POLCA y drum-buffer-rope lo hacen para líneas, pares de celdas y restricciones, y encajan allí donde los bucles específicos por pieza solo almacenarían referencias de movimiento lento.

La parte difícil es el tiempo de reposición detrás de cada tarjeta, el tamaño de lote en el proceso suministrador, un programa de pacemaker nivelado y la disciplina para seguir las reglas. Dimensione los bucles a partir de tiempos de reposición medidos, compare la sugerencia de su ERP con su propia hoja de cálculo, retire tarjetas solo cuando alguien pueda corregir lo que eso expone, y mantenga los colchones estratégicos fuera de los bucles cuando el riesgo de suministro lo exija.

**Sus primeros pasos en los próximos 30 días**

- [ ] Recorra una familia de productos desde expedición hasta recepción y cuente el WIP entre cada proceso
- [ ] Calcule el lead time actual con la ley de Little (WIP ÷ rendimiento diario)
- [ ] Segmente los números de pieza de la familia en runners, repeaters y strangers usando la demanda diaria y su coeficiente de variación
- [ ] Elija de tres a cinco bucles de runners junto a un proceso suministrador estable
- [ ] Mida el tiempo de reposición de cada bucle de extremo a extremo y complete la hoja de dimensionamiento
- [ ] Imprima y plastifique las tarjetas, marque las posiciones del supermercado y forme a operarios y transportistas en las ocho reglas de planta
- [ ] Acuerde con finanzas cómo se informará la reducción de inventario, incluido el efecto del costeo por absorción
- [ ] Compruebe con TI si su ERP tiene un módulo de kanban y cómo calcula los tamaños de bucle; evite que el MRP planifique dos veces las piezas kanban
- [ ] Revise los bucles a diario en el tablero de planta durante dos semanas, y después semanalmente con la plantilla de auditoría
- [ ] Si necesita apoyo externo, contacte con el centro MEP de NIST de su estado [27]

---

## Lecturas adicionales en m365.fm

**Guías de esta ruta de aprendizaje**
- [Lean Manufacturing: Principios, herramientas, implantación y límites](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Programación de producción y APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Planificación de ventas y operaciones, MRP y planificación de producción](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [Teoría de restricciones y Drum-Buffer-Rope](https://www.m365.fm/en/learn/theory-of-constraints/)
- [SMED y reducción de cambios de formato](https://www.m365.fm/en/learn/smed-changeover-reduction/)
- [TPM y OEE](https://www.m365.fm/en/learn/tpm-oee/)
- [5S y gestión visual](https://www.m365.fm/en/learn/5s-visual-management/)
- [Gestión de planta y Gemba walks](https://www.m365.fm/en/learn/shop-floor-management/)
- [KPI de fabricación](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)
- [Ciberseguridad OT e ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/)
- [Azure para fabricación](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Planificación de producción aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

**Análisis en profundidad**
- [Dimensionamiento de lotes](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Gestión de inventario en fabricación y stock de seguridad](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)
- [Logística interna y milk runs](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Simulación de fabricación](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)
- [Resiliencia de la cadena de suministro](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/)
- [Trabajo estándar](https://www.m365.fm/en/learn/shop-floor-management/standard-work/)
- [Kaizen](https://www.m365.fm/en/learn/lean-manufacturing/kaizen/)

**Términos del glosario (entidades)**
[Kanban](https://www.m365.fm/entity/kanban/) · [Sistema pull](https://www.m365.fm/entity/pull-system/) · [Just-in-time](https://www.m365.fm/entity/just-in-time/) · [Heijunka](https://www.m365.fm/entity/heijunka/) · [5S](https://www.m365.fm/entity/5s/) · [Trabajo estándar](https://www.m365.fm/entity/standard-work/) · [Teoría de las restricciones](https://www.m365.fm/entity/theory-of-constraints/) · [Gestión Lean](https://www.m365.fm/entity/lean-management/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** es el anfitrión de m365.fm y trabaja en iFAKT GmbH. En m365.fm escribe sobre lean manufacturing, planificación de la producción y la transformación digital de la producción, con especial atención a cómo los modelos de cadena de valor, la simulación y el análisis de KPIs ayudan a las plantas a diseñar el flujo y el sistema pull.

**Nota: El autor trabaja en iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Sources marked (V) were opened and checked for this article on that date. Sources marked (V-sister) were opened and checked on the same date for the related guide `lean-manufacturing.md`; our fetch budget ran out before a second check for this article, so the fact checker flagged them for a quick re-check before publication.

1. Kanban. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/kanban/ (V)
2. Hopp, W. J.; Spearman, M. L.: To Pull or Not to Pull: What Is the Question? *Manufacturing & Service Operations Management* 6 (2004) 2, pp. 133–148. DOI: 10.1287/msom.1030.0028. https://pubsonline.informs.org/doi/pdf/10.1287/msom.1030.0028 (V)
3. Spearman, M. L.; Woodruff, D. L.; Hopp, W. J.: CONWIP: a pull alternative to kanban. *International Journal of Production Research* 28 (1990) 5, pp. 879–894. DOI: 10.1080/00207549008942761. Reprint and abstract: Project Production Institute Journal, Vol. 3 (2018). https://projectproduction.org/journal/conwip-a-pull-alternative-to-kanban/ (V; volume, issue and pages as verified for the related guide `production-scheduling-aps.md`)
4. Spearman, M. L.; Woodruff, D. L.; Hopp, W. J.: CONWIP Redux: reflections on 30 years of development and implementation. *International Journal of Production Research* 60 (2022) 1, pp. 381–387. DOI: 10.1080/00207543.2021.1954713. https://econpapers.repec.org/RePEc:taf:tprsxx:v:60:y:2022:i:1:p:381-387 (V)
5. CONWIP. Wikipedia. https://en.wikipedia.org/wiki/CONWIP (V)
6. Little, J. D. C.: A Proof for the Queuing Formula: L = λW. *Operations Research* 9 (1961) 3, pp. 383–387. DOI: 10.1287/opre.9.3.383. https://ideas.repec.org/a/inm/oropre/v9y1961i3p383-387.html (V)
7. Sugimori, Y. et al. (four authors): Toyota production system and Kanban system: Materialization of just-in-time and respect-for-human system. *International Journal of Production Research* 15 (1977) 6, pp. 553–564. DOI: 10.1080/00207547708943149. https://scispace.com/papers/toyota-production-system-and-kanban-system-materialization-2c0g0kt2j0 (V; the record names Y. Sugimori plus three co-authors)
8. Toyota Production System. Toyota Motor Corporation. https://global.toyota/en/company/vision-and-philosophy/production-system/index.html (V)
9. Ohno, T.: Toyota Production System: Beyond Large-Scale Production. Productivity Press / Routledge (English edition 1988). https://www.routledge.com/Toyota-Production-System/Ohno/p/book/9780915299140 (V-sister)
10. Kanban. Wikipedia. https://en.wikipedia.org/wiki/Kanban (V)
11. Roser, C.: Toyota's Six Rules for Kanban. AllAboutLean. https://www.allaboutlean.com/toyotas-six-rules/ (V)
12. Roser, C.: How Many Kanbans? The Kanban Formula, Part 1. AllAboutLean. https://www.allaboutlean.com/kanban-formula-part1/ (V)
13. Roser, C.: How Many Kanbans? The Kanban Formula, Part 2. AllAboutLean. https://www.allaboutlean.com/kanban-formula-part2/ (V)
14. Co, H. C.; Moosa, S.: Overplanning Factor in Toyota's Formula for Computing the Number of Kanban. *IIE Transactions* 29 (1997) 5, pp. 409–415. DOI: 10.1080/07408179708966346. https://ink.library.smu.edu.sg/lkcsb_research/892 (V)
15. Kanban quantity calculations and circulating kanbans (Dynamics 365 Supply Chain Management training module). Microsoft Learn. https://learn.microsoft.com/en-us/training/modules/create-process-fixed-kanbans-dyn365-supply-chain-mgmt/5-calculations (V)
16. Kanban Equation 1: Fixed Container Size and High Demand. Oracle JD Edwards EnterpriseOne Kanban Management 9.2 documentation. https://docs.oracle.com/en/applications/jd-edwards/supply-chain-manufacturing/9.2/eoakm/kanban-equation-1-fixed-container-size-and-high-demand.html (V)
17. Lage Junior, M.; Godinho Filho, M.: Variations of the kanban system: Literature review and classification. *International Journal of Production Economics* 125 (2010) 1, pp. 13–21. Elsevier, ScienceDirect PII S0925-5273(10)00019-8. https://ideas.repec.org/a/eee/proeco/v125y2010i1p13-21.html (V; DOI not shown on the record page)
18. Heijunka. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/heijunka/ (V)
19. Pitch. Lean Enterprise Institute, Lean Lexicon. https://www.lean.org/lexicon-terms/pitch/ (V)
20. Suri, R.: The Practitioner's Guide to POLCA: The Production Control System for High-Mix, Low-Volume and Custom Products. Productivity Press / Taylor & Francis. https://www.taylorfrancis.com/books/9781351170765
21. Rajan Suri, Professor Emeritus, Industrial and Systems Engineering (POLCA, Center for Quick Response Manufacturing). University of Wisconsin–Madison, College of Engineering. https://engineering.wisc.edu/?p=27657 (V)
22. Kanban (development). Wikipedia. https://en.wikipedia.org/wiki/Kanban_(development) (V)
23. How the Kanban System of Inventory Management Works. Smartsheet. https://www.smartsheet.com/understanding-kanban-inventory-management-and-its-uses-across-multiple-industries (V; vendor page)
24. Kanban in manufacturing: cards, boards and supermarkets. Veryable. https://www.veryableops.com/blog/kanban-manufacturing-cards-boards-supermarkets (V; vendor page)
25. Plex: Push vs. Pull Manufacturing: Is a Kanban Pull System Right for Your Company? IndustryWeek, July 28, 2017. https://www.industryweek.com/cloud-computing/article/22023873/push-vs-pull-manufacturing-is-a-kanban-pull-system-right-for-your-company (V; vendor byline)
26. Shirouzu, N.: How Toyota thrives when the chips are down. Reuters, via nippon.com (March 2021). https://www.nippon.com/en/news/reu20210309KBN2B1004/ (V-sister)
27. Lean and Process Improvement. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/lean-and-process-improvement (V)
28. Ergonomics. Occupational Safety and Health Administration (OSHA), US Department of Labor. https://www.osha.gov/ergonomics (V)
