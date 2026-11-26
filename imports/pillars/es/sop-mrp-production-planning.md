# SEO metadata

| Field | Value |
|---|---|
| Meta title | Guía de S&OP, MPS y MRP: planificación de ventas y operaciones |
| Meta description | S&OP, MPS y MRP explicados: el ciclo mensual de S&OP, el cálculo neto de MRP paso a paso, DDMRP, opciones de ERP, KPIs y plantillas. |
| Slug | `sop-mrp-production-planning` |

# Planificación de ventas y operaciones (S&OP) y MRP: cómo funciona la planificación de producción desde el plan hasta las piezas

> **Respuesta corta:** La planificación de ventas y operaciones (S&OP, por sus siglas en inglés) es un proceso directivo mensual en el que ventas, operaciones, cadena de suministro y finanzas acuerdan un único plan de demanda, suministro e inventario por familia de productos, normalmente con un horizonte móvil de 18 a 36 meses [5][6]; las fuentes académicas describen su núcleo táctico como un alcance de hasta unos 18 meses [1]. El programa maestro de producción (MPS, por sus siglas en inglés) convierte ese plan en cantidades de artículos finales por semana, y la planificación de necesidades de materiales (MRP, por sus siglas en inglés) despliega el MPS a través de las listas de materiales en órdenes con fecha para cada componente y materia prima [7][13]. En la mayoría de las plantas, el MPS y el MRP se ejecutan dentro del sistema ERP; el S&OP se ejecuta en un ciclo de reuniones apoyado en hojas de cálculo, ERP o software de planificación específico.

> **Puntos clave**
> - El S&OP decide *cuánto* por familia de productos y mes; el MPS decide *qué artículos finales* por semana; el MRP decide *qué piezas, cuántas y cuándo*. La programación detallada (secuencia por máquina y hora) está por debajo y se trata en la [guía de programación de producción y APS](https://www.m365.fm/en/learn/production-scheduling-aps/).
> - El concepto de S&OP se remonta a la planificación agregada de la producción en la década de 1950; los consultores de Oliver Wight dieron forma al S&OP moderno en la década de 1980 y acuñaron la planificación empresarial integrada (IBP, por sus siglas en inglés) a comienzos de los años 2000 [1][2].
> - Joseph Orlicky formalizó el MRP en 1964; Black & Decker fue el primer usuario y, en 1981, unas 8.000 empresas utilizaban MRP [3][4]. Oliver Wight lo amplió a MRP II en 1983 [3].
> - Un ciclo mensual típico de S&OP tiene cinco pasos: recopilación de datos, revisión de la demanda, revisión del suministro, reunión previa de S&OP (conciliación) y reunión ejecutiva de S&OP [1].
> - El MRP supone capacidad infinita y plazos de entrega fijos; por eso necesita una comprobación de capacidad aproximada por encima y un programador de capacidad finita por debajo [8][9].
> - Un cambio pequeño en el MPS puede mover órdenes en varios niveles de la lista de materiales a la vez ("nerviosismo"). Congelar el programa a corto plazo y las reglas de coste de cambio lo amortiguan mejor que añadir más stock de seguridad [10].
> - El DDMRP sustituye la explosión impulsada por pronósticos en puntos de desacoplamiento seleccionados por buffers dimensionados (rojo, amarillo, verde) y una ecuación de flujo neto [11][12].
> - Mida el S&OP con la precisión del pronóstico (WMAPE) *y* el sesgo, el cumplimiento del plan, la estabilidad del programa y el nivel de servicio. Un pronóstico con un 94 % de precisión que siempre se queda un 2 % por encima sigue acumulando inventario.

## Índice

1. [¿Qué es la planificación de ventas y operaciones? Definición y alcance](#qué-es-la-planificación-de-ventas-y-operaciones-definición-y-alcance)
2. [La jerarquía de la planificación de la producción: S&OP, MPS, RCCP, MRP y programación](#la-jerarquía-de-planificación-de-la-producción-sop-mps-rccp-mrp-y-programación)
3. [Historia: de la planificación agregada y Orlicky a IBP y DDMRP](#historia-de-la-planificación-agregada-y-orlicky-a-ibp-y-ddmrp)
4. [El proceso S&OP: el ciclo mensual paso a paso](#el-proceso-sop-el-ciclo-mensual-paso-a-paso)
5. [Estrategias de suministro: nivelada, de persecución o híbrida (ejemplo práctico)](#estrategias-de-suministro-nivelada-persecución-o-híbrida-ejemplo-resuelto)
6. [S&OP vs. IBP vs. S&OE](#sop-vs-ibp-vs-soe)
7. [Modelos de madurez de S&OP](#modelos-de-madurez-del-sop)
8. [Programa maestro de producción (MPS) y disponible para prometer (ATP)](#programa-maestro-de-producción-mps-y-disponible-para-prometer-atp)
9. [Planificación aproximada de capacidad (RCCP)](#planificación-de-capacidad-aproximada-rccp)
10. [Planificación de necesidades de materiales (MRP): cómo funciona el cálculo](#planificación-de-necesidades-de-materiales-mrp-cómo-funciona-el-cálculo)
11. [MRP II, CRP y el bucle cerrado](#mrp-ii-crp-y-el-ciclo-cerrado)
12. [Nerviosismo del MRP: por qué los planes saltan y cómo calmarlos](#nerviosismo-del-mrp-por-qué-los-planes-saltan-y-cómo-estabilizarlos)
13. [MRP impulsado por la demanda (DDMRP)](#planificación-de-necesidades-de-materiales-impulsada-por-la-demanda-ddmrp)
14. [Planificación de la producción en ERP: qué hacen los sistemas y dónde se detienen](#planificación-de-producción-en-el-erp-qué-hacen-los-sistemas-y-dónde-se-detienen)
15. [Plantillas: calendario de S&OP, agendas, plan por familias, registros de MPS y MRP](#plantillas-calendario-sop-agendas-plan-de-familias-y-registros-mps-y-mrp)
16. [KPI de S&OP y MRP con ejemplos prácticos](#kpi-de-sop-y-mrp-con-ejemplos-resueltos)
17. [Hoja de ruta de implementación: 12 meses hasta un S&OP y MRP en funcionamiento](#hoja-de-ruta-de-implementación-12-meses-hasta-un-sop-y-un-mrp-operativos)
18. [Errores comunes](#errores-comunes)
19. [Límites del S&OP y el MRP](#límites-de-sop-y-mrp)
20. [IA y planificación digital: qué funciona hoy](#ia-y-planificación-digital-lo-que-funciona-hoy)
21. [Glosario](#glosario)
22. [Preguntas frecuentes: planificación de ventas y operaciones y MRP](#preguntas-frecuentes-planificación-de-ventas-y-operaciones-y-mrp)
23. [Conclusión y primeros pasos](#conclusión-y-primeros-pasos)

## ¿Qué es la planificación de ventas y operaciones? Definición y alcance

**La planificación de ventas y operaciones (S&OP, por sus siglas en inglés)** es un proceso de decisión recurrente que integra el pronóstico de demanda con la planificación del suministro en un único plan al que se alinean ventas, marketing, operaciones, cadena de suministro y finanzas [1]. La literatura académica lo describe como un proceso táctico con un horizonte de hasta unos 18 meses, que normalmente se ejecuta mensualmente o cuando lo dispara un evento [1]. Las fuentes de proveedores y de práctica profesional suelen describir un horizonte móvil de 18 a 36 meses [5][6]. La diferencia no es una contradicción: los primeros meses se planifican con más detalle, y los meses posteriores solo por familias y bloques de capacidad.

Tres rasgos distinguen al S&OP de una reunión de pronóstico de ventas o de una reunión de producción:

- **Un solo conjunto de cifras.** La demanda, el suministro, el inventario o el backlog y el valor financiero del plan se revisan juntos, por familia de productos, en unidades y en dólares.
- **Decisiones, no informes.** El resultado es un conjunto de decisiones: aprobar un aumento de capacidad, aceptar un nivel de servicio menor para una familia lenta, retrasar un lanzamiento, producir por anticipado antes de una parada.
- **Integración en lugar de coordinación.** Rogelio Oliva y Noel Watson demostraron en un estudio de caso que el S&OP aporta valor cuando las funciones planifican *juntas frente a objetivos compartidos*, y no cuando solo coordinan planes que cada función elaboró por su cuenta [21].

El cuerpo profesional de conocimientos sobre S&OP, programación maestra y MRP en EE. UU. lo mantiene ASCM (Association for Supply Chain Management, antes APICS). Su programa CPIM (Certified in Planning and Inventory Management) cubre el S&OP, la demanda, el suministro, el inventario y los programas detallados como módulos separados [24].

### Planificación, no programación

El S&OP no es el programa de producción. Trabaja con familias de productos, períodos mensuales y capacidad agregada, como "horas de soldadura" o "turnos de la línea 2". La pregunta "qué orden se ejecuta primero mañana en la máquina 14" pertenece a la programación detallada, que la [guía de programación de producción y APS](https://www.m365.fm/en/learn/production-scheduling-aps/) trata en profundidad, incluyendo la programación de capacidad finita y el método drum-buffer-rope. Este artículo se mantiene un nivel por encima y conecta el S&OP con el programa maestro de producción y el MRP.

### Para qué se usa S&OP

La tabla muestra decisiones típicas que solo un S&OP interfuncional puede tomar, porque ninguna función por sí sola controla tanto el coste como el beneficio.

| Decisión | Quién gana | Quién paga | Por qué necesita S&OP |
|---|---|---|---|
| Añadir un segundo turno en soldadura a partir de marzo | Ventas (nivel de servicio) | Operaciones (coste laboral), RR. HH. (contratación) | compensación entre ingresos y coste |
| Prefabricar 2.000 unidades antes de una parada de verano | Clientes, ventas | Finanzas (capital circulante), almacén | la inversión en inventario debe aprobarse |
| Eliminar una variante de bajo margen | Operaciones (menos cambios de formato) | Ventas (ingresos perdidos) | decisión de cartera con impacto en el margen |
| Aceptar un pedido grande de promoción | Ventas, marketing | Operaciones (horas extra), compras | viabilidad de capacidad y materiales |
| Homologar un segundo proveedor para una pieza crítica | Cadena de suministro (riesgo) | Compras, calidad (coste de homologación) | resiliencia frente a coste unitario, véase [resiliencia de la cadena de suministro](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/) |

### Quién participa

La reunión ejecutiva la preside el director general o el presidente de la unidad de negocio. Los miembros permanentes habituales son los responsables de ventas, marketing, operaciones, cadena de suministro, finanzas y, en productos de ingeniería, ingeniería o gestión de producto. Por debajo de la reunión ejecutiva, el planificador de demanda, el planificador maestro, el planificador de suministro y un analista financiero realizan la mayor parte del trabajo. La sección 4 detalla los roles paso a paso.

## La jerarquía de planificación de la producción: S&OP, MPS, RCCP, MRP y programación

La planificación y el control de la fabricación (MPC) se organizan como una jerarquía. Cada nivel trabaja con un horizonte más largo y datos más agregados que el nivel inferior, y transmite sus decisiones hacia abajo como objetivos. El material de curso de Stanley Gershwin en el MIT resume MRP II de esta forma: una jerarquía de planificación de largo, medio y corto plazo, con gestión de la demanda, previsión, planificación de capacidad y control de planta alrededor del núcleo MRP [8].

| Nivel | Horizonte típico | Periodo | Objeto de planificación | Pregunta clave | Resultado | Herramienta típica |
|---|---|---|---|---|---|---|
| Plan estratégico y plan de negocio | 3–5 años | año | negocio, planta, red | ¿Qué mercados, plantas e inversiones en capacidad? | presupuesto, plan de capex | herramientas financieras, Excel |
| S&OP / IBP | 18–36 meses [5][6] | mes | familia de productos, recurso agregado | ¿Cuánto vendemos y fabricamos, con qué inventario y coste? | plan aprobado por familia | software S&OP, ERP, Excel |
| Plan maestro de producción (MPS) | de unas semanas a varios meses, como mínimo el plazo acumulado de entrega | semana (día en el corto plazo) | producto final u objeto de planificación | ¿Qué productos finales, cuántos y en qué semana? | MPS, ATP | ERP |
| Planificación de capacidad aproximada (RCCP) | igual que el MPS | semana o mes | recursos críticos | ¿Es factible el MPS en el cuello de botella? | carga frente a capacidad por recurso clave | ERP, Excel |
| Planificación de necesidades de materiales (MRP) | igual que el MPS | día o semana | todos los componentes y materiales | ¿Qué piezas, cuántas y cuándo pedir o lanzar? | órdenes planificadas, solicitudes de compra, mensajes de excepción | ERP |
| Planificación de necesidades de capacidad (CRP) | semanas | día o semana | cada centro de trabajo | ¿Hay capacidad suficiente para todas las órdenes planificadas y liberadas? | perfiles de carga detallados | ERP |
| Programación detallada y despacho | de horas a unas semanas | hora, turno | operación en una máquina | ¿En qué secuencia se ejecuta cada operación? | programación, lista de despacho | APS, MES |

Dos reglas mantienen unida la jerarquía:

1. **La desagregación debe cuadrar.** La suma del MPS de todos los productos finales de una familia debe coincidir con el plan de familia del S&OP para el mismo mes, dentro de una tolerancia acordada (por ejemplo, más o menos un 5 %). De lo contrario, la decisión del S&OP no tiene efecto en planta.
2. **La factibilidad se comprueba en cada nivel.** S&OP comprueba la capacidad agregada (planificación de recursos), el MPS se comprueba mediante la planificación de capacidad aproximada, y la salida del MRP se comprueba mediante la planificación de necesidades de capacidad o mediante un programador de capacidad finita. El propio MRP no comprueba la capacidad [8][9].

### Dónde encajan ERP, APS y MES

La norma ANSI/ISA-95 separa la planificación de negocio y la logística (Nivel 4, normalmente ERP) de la gestión de operaciones de fabricación (Nivel 3, normalmente MES y programación detallada) [25]. S&OP, MPS y MRP son funciones de Nivel 4. La [guía de MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) explica el lado del Nivel 3, y la [guía de Azure para fabricación](https://www.m365.fm/en/learn/manufacturing-it-azure/) muestra cómo puede integrarse el intercambio de datos entre niveles.

### Make-to-stock, assemble-to-order, make-to-order

El entorno de producción determina dónde se sitúa el MPS en la lista de materiales:

| Entorno | El cliente espera por | MPS planificado en | Ejemplo | Enfoque del S&OP |
|---|---|---|---|---|
| Make-to-stock (MTS) | nada (se envía desde stock) | producto final | bienes de consumo, bombas estándar | objetivo de inventario por familia |
| Assemble-to-order (ATO) | el montaje final | módulos y opciones (planning bill) | escritorios configurables, camiones, PC | mezcla de módulos, porcentajes de opciones |
| Make-to-order (MTO) | la fabricación | producto final o subconjuntos clave tras el pedido | piezas de maquinaria a medida | objetivo de backlog, plazo de entrega |
| Engineer-to-order (ETO) | el diseño y la fabricación | hitos del proyecto, artículos de largo plazo de suministro | máquinas especiales, interiores de aeronaves | capacidad de ingeniería y pruebas, ver [planificación de producción aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/) |

En MTS, el S&OP equilibra la demanda con un inventario objetivo. En MTO y ETO, equilibra la demanda con un backlog objetivo o un plazo de entrega cotizado. Mezclar estas lógicas en una misma familia es una causa habitual de cifras de S&OP confusas.

## Historia: de la planificación agregada y Orlicky a IBP y DDMRP

### Planificación agregada y los primeros sistemas MRP (décadas de 1950–1960)

El S&OP comenzó a principios de los años cincuenta como planificación agregada de la producción: ajustar una tasa de producción agregada a la demanda prevista, compensando inventario, cambios de plantilla y horas extra [1]. Más o menos en la misma época, los fabricantes de motores aeronáuticos Rolls-Royce y General Electric informatizaron la planificación de materiales [3].

En 1964, Joseph Orlicky, ingeniero de IBM, formalizó la planificación de necesidades de materiales (MRP) [4]. La primera empresa en implantarla fue Black & Decker en 1964, con Dick Alban como jefe de proyecto [3]. El libro de Orlicky *Material Requirements Planning* (McGraw-Hill, 1975) se convirtió en el texto de referencia [13]. Su tercera edición, una actualización de 2011 de Carol Ptak y Chad Smith, introdujo la MRP impulsada por la demanda (DDMRP) [4].

La adopción creció rápidamente: unas 700 empresas utilizaban MRP en 1975 y unas 8.000 en 1981, según las cifras citadas en Wikipedia [3]. En 1967, George Plossl y Oliver Wight, colega de Orlicky en IBM, escribieron conjuntamente un libro sobre control de la producción e inventarios [4].

### MRP II, ERP y S&OP (décadas de 1980–1990)

En 1983, Oliver Wight amplió el MRP hasta la **planificación de recursos de fabricación (MRP II)**, añadiendo la programación maestra, la planificación de capacidad aproximada, la planificación de necesidades de capacidad, el S&OP y el vínculo con la planificación financiera [3]. La firma de Oliver Wight describe el S&OP como desarrollado por Oliver Wight en los años ochenta [2]; Wikipedia atribuye el término y su significado moderno a Richard (Dick) Ling, entonces consultor de Oliver Wight [1]. Gartner acuñó el término "planificación de recursos empresariales" (ERP) en 1990 [4]. El ERP integró finanzas, ventas, compras y RR. HH. alrededor de un núcleo de planificación que seguía siendo el MRP II.

### IBP, DDMRP y planificación concurrente (años 2000 hasta hoy)

A principios de los años 2000, Oliver Wight acuñó la **planificación integrada del negocio (IBP)**, que extiende el S&OP a toda la empresa, incluida la planificación de cartera y financiera, con un horizonte de al menos 24 meses [2]. En 2011, Ptak y Smith publicaron la tercera edición del libro de Orlicky con la **MRP impulsada por la demanda (DDMRP)** [4], y proveedores de ERP como Microsoft han incorporado desde entonces el DDMRP en sus motores de planificación [11]. Los proveedores de software de planificación promueven ahora la planificación "concurrente" o continua, que recalcula los planes en minutos en lugar de en un lote mensual [16]; esa afirmación es una afirmación del proveedor y se analiza en la sección sobre IA.

| Año | Hito | Fuente |
|---|---|---|
| inicios de los años 1950 | planificación agregada de la producción; Rolls-Royce y GE informatizan la planificación de materiales | [1][3] |
| 1964 | Orlicky formaliza el MRP en IBM; Black & Decker es el primer usuario | [3][4] |
| 1967 | Plossl y Wight publican sobre control de producción e inventarios | [4] |
| 1975 | *Material Requirements Planning* de Orlicky; unas 700 empresas con MRP | [3][13] |
| 1981 | unas 8.000 empresas con MRP | [3] |
| 1983 | Oliver Wight define el MRP II | [3] |
| años 1980 | S&OP desarrollado por Oliver Wight (Dick Ling) | [1][2] |
| 1990 | Gartner acuña "ERP" | [4] |
| inicios de los años 2000 | Oliver Wight acuña IBP | [2] |
| 2011 | tercera edición del libro de Orlicky por Ptak y Smith, que introduce el DDMRP | [4] |

## El proceso S&OP: el ciclo mensual paso a paso

La descripción académica más citada del proceso S&OP tiene cinco pasos: recopilación de datos, planificación de la demanda, planificación del suministro, reunión previa y reunión ejecutiva [1][20]. Algunos autores añaden una revisión de eventos o de productos al inicio y un paso de revisión al final [1]; Anaplan, un proveedor de software de planificación, describe seis revisiones: producto, demanda, suministro, finanzas, pre-S&OP y S&OP ejecutivo [15]. Kinaxis describe un ciclo mensual tradicional con cinco etapas [16]. Las diferencias son sobre todo de denominación: los ciclos cubren el mismo terreno y en un orden similar.

El siguiente calendario supone que el mes cierra el último día laborable y que la reunión ejecutiva tiene lugar en la tercera semana.

| Día laborable | Paso | Responsable | Entradas | Salidas | Duración de la reunión |
|---|---|---|---|---|---|
| 1–3 | 1. Recopilación de datos y actualización de la cartera | planificador de demanda, gestión de producto | datos reales del mes anterior (envíos, pedidos, producción, inventario), fechas de nuevos productos y de retirada | historial actualizado, paquete de KPI, cambios de producto | ninguna (trabajo de oficina) |
| 4–6 | 2. Revisión de la demanda | VP de ventas o marketing; el planificador de demanda prepara | previsión estadística, aportaciones de ventas, eventos de marketing, planes de grandes clientes | plan de demanda de consenso sin restricciones por familia, en unidades y dólares, con supuestos y riesgos | 60–90 minutos |
| 7–9 | 3. Revisión del suministro | VP de operaciones o de cadena de suministro; el programador maestro y el planificador de suministro preparan | demanda de consenso, objetivos de inventario o backlog, capacidad por recurso clave, restricciones de proveedores | plan de suministro restringido, problemas de capacidad y opciones con costes | 60–90 minutos |
| 10–12 | 4. Reunión pre-S&OP (conciliación) | responsable del proceso S&OP; analista financiero | planes de demanda y suministro, brechas, plan financiero | plan conciliado en unidades y dólares, decisiones preparadas con opciones, asuntos abiertos | 90–120 minutos |
| 13–15 | 5. Reunión ejecutiva S&OP | director general | recomendaciones de la reunión pre-S&OP, KPI | plan aprobado, decisiones, escalados cerrados | 60–120 minutos |
| 16–20 | Puesta en marcha | programador maestro, planificadores | plan aprobado por familia | MPS actualizado, MRP ejecutado, acciones de compra y capacidad | ninguna |

### Paso 1: Recopilación de datos y actualización de la cartera

El ciclo comienza en cuanto cierra el mes. El planificador de demanda extrae envíos, pedidos entrantes, producción, inventario y backlog por familia y SKU, depura el historial de eventos puntuales (un incendio en un cliente, una licitación única) y ejecuta la previsión estadística. Gestión de producto actualiza las fechas de lanzamiento y de retirada. Una previsión que no sabe que una variante se descontinúa en el mes 4 seguirá pidiendo sus piezas.

**Lista de verificación, paso 1**

| Elemento | Completado cuando |
|---|---|
| Datos reales cargados | envíos, pedidos, producción e inventario concilian con el cierre contable dentro de la tolerancia acordada |
| Historial depurado | valores atípicos marcados con motivo, no eliminados |
| Previsión estadística ejecutada | modelo y parámetros documentados por familia |
| Cambios de cartera | lanzamientos, retiradas, cambios de ingeniería con fechas y responsables |
| Paquete de KPI | precisión y sesgo de la previsión, cumplimiento del plan, servicio, inventario frente al objetivo |

### Paso 2: Revisión de la demanda

La revisión de la demanda produce el **plan de demanda de consenso sin restricciones**: lo que los clientes querrán si el suministro fuera ilimitado. Ventas y marketing ajustan la previsión estadística con información que el historial no contiene: cambios de precio, promociones, un cliente perdido, un nuevo distribuidor. Cada ajuste se registra con su responsable y su supuesto. Ese registro muestra después si los ajustes manuales mejoraron o empeoraron la precisión.

Los errores típicos en este paso son prever solo en ingresos (operaciones no puede fabricar dólares), prever a nivel de SKU durante 24 meses (demasiado ruido) y confundir el objetivo de ventas con la previsión. Un objetivo es lo que la empresa quiere; una previsión es lo que espera. La diferencia entre ambos es un asunto de negocio para la reunión ejecutiva, no una cifra que deba esconderse en la previsión.

**Orden del día de la revisión de la demanda (60–90 minutos)**

| Tiempo | Tema | Responsable |
|---|---|---|
| 10 min | mes anterior: precisión y sesgo de la previsión por familia, principales fallos con causa raíz | planificador de demanda |
| 20 min | línea base estadística frente al último consenso, cambios por encima del umbral | planificador de demanda |
| 30 min | aportaciones de ventas y marketing por familia: eventos, clientes, precios | ventas, marketing |
| 15 min | riesgos y oportunidades con probabilidad y cantidad | VP de ventas |
| 5 min | consenso por familia, asuntos abiertos, responsables | planificador de demanda |

### Paso 3: Revisión de suministro

La revisión de suministro contrasta la demanda consensuada con las metas de capacidad, materiales e inventario. Los planificadores convierten los volúmenes por familia en carga sobre los **recursos clave** (centros de trabajo cuello de botella, proveedores críticos, grupos de mano de obra especializada) mediante una lista de recursos: horas por unidad y por recurso. Cuando la carga supera la capacidad, desarrollan opciones con sus costos: horas extra, un turno adicional, subcontratación, producción anticipada, una fecha de entrega posterior o aceptar un nivel de servicio más bajo. La revisión de suministro no decide entre opciones con impacto financiero significativo; las prepara para la reunión pre-S&OP. La sección 5 muestra cómo se comparan estas opciones.

**Agenda de la revisión de suministro (60–90 minutos)**

| Hora | Tema | Responsable |
|---|---|---|
| 10 min | mes anterior: cumplimiento del plan, adherencia al MPS, desempeño de proveedores | programador maestro |
| 25 min | carga vs. capacidad por recurso clave y mes (rough-cut) | planificador de suministro |
| 20 min | proyección de inventario y backlog vs. metas por familia | programador maestro |
| 20 min | restricciones y opciones con costo y riesgo | VP de operaciones |
| 5 min | plan de suministro restringido, asuntos para la pre-S&OP | programador maestro |

### Paso 4: Reunión pre-S&OP (conciliación)

La reunión pre-S&OP reúne a demanda, suministro y finanzas. Finanzas valora el plan restringido a costo estándar y precio de venta, y lo compara con el presupuesto o con el último pronóstico financiero. El equipo resuelve lo que puede dentro de los derechos de decisión acordados y prepara el resto como documentos de decisión: dos o tres opciones, cada una con el impacto en volumen, servicio, costo y capital de trabajo, y una recomendación. Un buen documento de decisión cabe en una página.

### Paso 5: Reunión ejecutiva de S&OP

La reunión ejecutiva revisa los KPI, aprueba el plan y toma las decisiones preparadas. No es el lugar para reelaborar cifras. Una agenda típica:

| Hora | Tema |
|---|---|
| 10 min | revisión de KPI: servicio, precisión y sesgo del pronóstico, inventario y backlog vs. meta, cumplimiento del plan |
| 15 min | panorama del negocio por familia: plan de demanda vs. presupuesto, plan de suministro vs. demanda |
| 45 min | decisiones: un documento de decisión a la vez, opciones, recomendación, decisión registrada |
| 10 min | riesgos para los próximos 3–6 meses, estado de nuevos productos |
| 10 min | revisión del registro de decisiones, responsables y fechas |

### Puesta en marcha: del plan aprobado al MPS

En unos pocos días después de la reunión ejecutiva, el programador maestro desagrega el plan aprobado por familia en el MPS por artículo final y semana (sección 8), lo verifica con la planificación de capacidad rough-cut (sección 9) y ejecuta el MRP (sección 10). Compras recibe las órdenes planificadas nuevas o modificadas, y las decisiones de capacidad (un segundo turno, horas extra) se liberan a través de RRHH y de la planta. Sin esta puesta en marcha, el S&OP se convierte en una presentación mensual sin efecto en el piso de producción.

### Roles y derechos de decisión

| Rol | Responsabilidades |
|---|---|
| Patrocinador ejecutivo (gerente general o presidente) | preside la reunión ejecutiva, es dueño de las decisiones finales, exige asistencia y disciplina en las decisiones |
| Responsable del proceso S&OP | gestiona el calendario, prepara la pre-S&OP, mantiene los registros de decisiones y supuestos |
| Planificador de demanda | pronóstico estadístico, proceso de consenso, KPI de pronóstico |
| Líderes de ventas y marketing | inteligencia de mercado, responsabilidad sobre la cifra de demanda consensuada |
| Programador maestro | MPS, reglas de ATP, planificación de capacidad rough-cut, desagregación |
| Planificadores de suministro y materiales | excepciones del MRP, capacidad de proveedores, órdenes de compra |
| Gerente de planta u operaciones | plan de capacidad, mano de obra, decisiones de horas extra y turnos |
| Socio de finanzas | valoración en dólares, conciliación con el presupuesto, capital de trabajo |
| Gestión de productos o ingeniería | lanzamientos, retiros de productos, cambios de ingeniería |

Los derechos de decisión deben estar por escrito. Ejemplo: la revisión de suministro puede aprobar horas extra de hasta el 10 % de la capacidad de un centro de trabajo; cualquier cantidad superior, así como cualquier cambio en las metas de inventario, pasa a la reunión ejecutiva.

## Estrategias de suministro: nivelada, persecución o híbrida (ejemplo resuelto)

La planificación agregada ofrece tres estrategias clásicas de suministro, que las guías de S&OP nombran pero rara vez calculan [6]:

- **Nivelada:** producir a un ritmo constante y dejar que el inventario absorba las oscilaciones de la demanda.
- **Persecución:** cambiar el ritmo de producción cada mes para igualar la demanda, con horas extra, mano de obra temporal o turnos, y mantener el inventario plano.
- **Híbrida (mixta):** cambiar el ritmo algunas veces y aceptar cierta acumulación de inventario.

**Ejemplo resuelto (cifras ilustrativas).** Un fabricante de escritorios planifica la familia "escritorios con estructura de acero" para seis meses. El inventario inicial es de 800 unidades, el inventario final objetivo es de 800 unidades y debe haber un mínimo de 500 unidades disponibles al cierre de cada mes (stock de seguridad). El ritmo de producción anterior era de 3.000 unidades al mes. La soldadura es el cuello de botella: 5 celdas de soldadura × 2 turnos × 8 horas × 20 días = 1.600 horas al mes; cada escritorio requiere 0,4 horas de soldadura, por lo que el ritmo máximo es 1.600 / 0,4 = **4.000 escritorios al mes**. Costos: mantenimiento de 4 dólares por unidad y por mes sobre el inventario final; cada unidad de cambio en el ritmo mensual (contratación, formación, preparación de horas extra o despido) cuesta 5 dólares.

| Mes | Demanda | Nivelada: producción | Nivelada: inventario final | Persecución: producción | Persecución: inventario final | Híbrida: producción | Híbrida: inventario final |
|---|---|---|---|---|---|---|---|
| Ene | 3.000 | 3.800 | 1.600 | 3.000 | 800 | 3.500 | 1.300 |
| Feb | 3.200 | 3.800 | 2.200 | 3.200 | 800 | 3.500 | 1.600 |
| Mar | 4.200 | 3.800 | 1.800 | **4.200** | 800 | 4.000 | 1.400 |
| Abr | 4.800 | 3.800 | 800 | **4.800** | 800 | 4.000 | 600 |
| May | 4.000 | 3.800 | 600 | 4.000 | 800 | 4.000 | 600 |
| Jun | 2.800 | 3.800 | 1.600 | 2.800 | 800 | 3.000 | 800 |
| **Total** | **22.000** | **22.800** | **8.600 unidades-mes** | **22.000** | **4.800 unidades-mes** | **22.000** | **6.300 unidades-mes** |

Por qué el ritmo nivelado es 3.800: la demanda acumulada hasta mayo es de 19.200 unidades; con 500 unidades requeridas al final de mayo y 800 disponibles al inicio, la producción hasta mayo debe ser como mínimo 19.200 + 500 − 800 = 18.900, es decir, 3.780 al mes. Redondeado a 3.800, el plan nivelado termina junio con 1.600 unidades, 800 por encima del objetivo.

| Elemento de costo | Nivelada | Persecución | Híbrida |
|---|---|---|---|
| Cambios de ritmo (unidades × 5 $) | 3.000 → 3.800: 800 → 4.000 $ | +200, +1.000, +600, −800, −1.200 = 3.800 → 19.000 $ | +500, +500, −1.000 = 2.000 → 10.000 $ |
| Mantenimiento (unidades-mes × 4 $) | 8.600 → 34.400 $ | 4.800 → 19.200 $ | 6.300 → 25.200 $ |
| **Total** | **38.400 $** | **38.200 $** | **35.200 $** |
| ¿Factible con el cuello de botella de soldadura (≤ 4.000/mes)? | sí | **no** (marzo 4.200, abril 4.800) | sí |
| Inventario final frente al objetivo de 800 | +800 | en objetivo | en objetivo |

Sobre el papel, el plan de persecución parece casi tan barato como el nivelado, pero no es factible: marzo y abril superan la capacidad de soldadura a menos que la empresa añada un tercer turno, lo que tendría su propio costo. El plan híbrido es el más barato entre las opciones factibles y hace trabajar la soldadura exactamente al 100 % durante tres meses, lo que no deja capacidad de protección. Los cambios de ritmo no son solo una partida de costo. Un plan de persecución implica contratar, recurrir a mano de obra temporal, despedir o mantener horas extra sostenidas; los convenios colectivos, las normas de aviso de horas extra y los límites de fatiga condicionan la velocidad con que una planta puede cambiar su ritmo, y los operarios cargan con el costo de cada oscilación. La revisión de suministro debe preguntar a planta y a RRHH qué es realista antes de modelarlo. Finanzas añadirá un segundo efecto: con el costeo estándar, los meses de baja producción absorben menos costos fijos indirectos, de modo que un plan de persecución genera variaciones de absorción que un plan nivelado evita.

Esa es la decisión que la revisión de suministro debe llevar a la reunión ejecutiva: aprobar el plan híbrido y decidir si se califica a un subcontratista de soldadura para 200–400 escritorios al mes como seguro. Operar un cuello de botella a plena utilización dispara las colas y los plazos de entrega, como muestra la [sección de la guía de APS sobre la física de fábrica](https://www.m365.fm/en/learn/production-scheduling-aps/) con la Ley de Little y las curvas de operación, y la [guía de la teoría de restricciones](https://www.m365.fm/en/learn/theory-of-constraints/) explica cómo proteger el tambor.

## S&OP vs. IBP vs. S&OE

Los tres términos describen alcances y horizontes distintos.

| Aspecto | S&OP | Planificación integrada del negocio (IBP) | Ejecución de ventas y operaciones (S&OE) |
|---|---|---|---|
| Pregunta | ¿Coinciden la demanda y la oferta por familia? | ¿Encaja todo el plan de negocio (cartera, demanda, oferta, finanzas, estrategia)? | ¿Qué cambiamos esta semana para ejecutar el plan? |
| Horizonte | Oliver Wight: normalmente 6–12 meses; SAP y otros: 18–36 meses en rodante [2][5] | al menos 24 meses [2] | 0–3 meses (semanas) [unverified: horizonte tal como lo usan habitualmente los profesionales] |
| Cadencia | mensual | mensual | semanal |
| Unidades | unidades y dólares por familia | principalmente dólares, más unidades | unidades por SKU y cliente |
| Presidencia | director general o vicepresidente de operaciones | consejero delegado o presidente de la unidad de negocio | responsable de cadena de suministro o de planificación |
| Origen | Oliver Wight, años 80 [1][2] | Oliver Wight, principios de los 2000 [2] | término de la práctica profesional, sin origen único verificado |

Oliver Wight describe el S&OP como centrado en las compensaciones de la cadena de suministro, y el IBP como un enfoque que lleva a toda la empresa a la vista en cartera, demanda, oferta y finanzas [2]. Muchas compañías usan los términos indistintamente. La etiqueta importa menos que dos hechos: si finanzas y la cartera forman parte del proceso, y si el equipo directivo toma decisiones en él. El S&OE es el puente semanal entre el plan aprobado y el MPS: gestiona los cambios de demanda a corto plazo, las interrupciones de suministro y la asignación dentro de las zonas congelada y pastosa del MPS (Sección 8).

**Agenda semanal del S&OE (30–45 minutos, ilustrativa)**

| Hora | Tema | Responsable |
|---|---|---|
| 5 min | semana anterior: adherencia al MPS, envíos frente al plan, las tres desviaciones principales | planificador maestro |
| 10 min | cambios de demanda dentro del horizonte de tiempo de planificación: nuevos pedidos grandes, cancelaciones, asignación de escasez de suministro | planificador de demanda, servicio al cliente |
| 10 min | problemas de suministro: retrasos de proveedores, averías de máquinas, retenciones de calidad, escasez de materiales derivada de excepciones del MRP | planificador de suministro, planta |
| 10 min | decisiones dentro de las reglas del MPS; todo lo que esté fuera de las reglas se escala al siguiente paso del S&OP | responsable de cadena de suministro |
| 5 min | acciones, responsables, fechas | planificador maestro |

## Modelos de madurez del S&OP

Los modelos de madurez ayudan a una empresa a ver en qué punto se encuentra y cuál es el siguiente paso. Tres son ampliamente utilizados.

**Gartner.** Gartner publica una hoja de ruta de madurez del S&OP de cinco niveles [17]. Su página pública de presentación no enumera los nombres de los niveles; las fuentes secundarias describen los niveles aproximadamente así, desde la ausencia de objetivos compartidos y una planificación basada en hojas de cálculo y descoordinada (nivel 1), pasando por la planificación operativa de ventas, el equilibrio entre demanda y oferta en toda la cadena de suministro y una mezcla de productos orientada a la demanda y rentable, hasta una empresa conectada en la que el S&OP forma parte de la planificación empresarial global y las decisiones se basan en escenarios (nivel 5) [18]. [unverified: los nombres de niveles propios de Gartner; las descripciones anteriores siguen el resumen de Jedox, un proveedor de software de planificación.]

**Grimson y Pyke (2007).** J. Andrew Grimson y David Pyke propusieron un marco con cinco dimensiones y cinco etapas: sin proceso de S&OP, reactiva, estándar, avanzada y proactiva [1][19].

**Wagner, Ullrich y Transchel (2014).** Stephan Wagner y colegas describen cuatro dimensiones y seis etapas, desde no desarrollada hasta proactiva, junto con el proceso de cinco pasos utilizado en la Sección 4 [1][20].

Una autoevaluación sencilla, derivada de las dimensiones que comparten estos modelos (reuniones y colaboración, organización, medición, tecnología de la información, integración del plan):

| Dimensión | Etapa 1: nula o reactiva | Etapa 2: estándar | Etapa 3: avanzada | Etapa 4: proactiva |
|---|---|---|---|---|
| Reuniones | apagar incendios de forma ad hoc | ciclo mensual; el directivo asiste a veces | ciclo completo de cinco pasos; el directivo preside cada mes | el ciclo incluye escenarios y estrategia; los directivos deciden entre opciones |
| Organización | sin responsable | coordinador a tiempo parcial | responsable de proceso dedicado, derechos de decisión por escrito | el S&OP es la forma en que se dirige el negocio |
| Medición | ninguna | servicio e inventario | precisión y sesgo de la previsión, cumplimiento del plan | KPI vinculados a resultados financieros e incentivos |
| TI | hojas de cálculo separadas | hoja de cálculo compartida o informes del ERP | herramienta de planificación integrada, conciliación familia/SKU | planificación de escenarios, flujo de datos automatizado |
| Integración del plan | los planes de ventas y de producción difieren | un plan de volumen | plan de volumen conciliado con el plan financiero | un único plan impulsa el presupuesto, el MPS y las inversiones de capital |

La evidencia de la investigación sobre los efectos del S&OP es favorable, pero no uniforme. Una revisión de la literatura de Antônio Márcio Tavares Thomé y coautores, publicada en el *International Journal of Production Economics*, sintetizó la literatura sobre S&OP hasta 2012 [22], y un estudio complementario vinculó el S&OP con el desempeño empresarial [23]. Trabajos posteriores subrayan que el diseño adecuado del S&OP depende del contexto, como el tamaño de la empresa, la complejidad de los productos y la incertidumbre de la cadena de suministro [34]. Las afirmaciones sobre mejoras porcentuales fijas gracias al S&OP que aparecen en las páginas de los proveedores deben leerse como afirmaciones del proveedor.

## Programa maestro de producción (MPS) y disponible para prometer (ATP)

El **programa maestro de producción** es una declaración de lo que la empresa espera producir, basada en el plan táctico y las restricciones presupuestarias, como lo expresa la documentación de JD Edwards de Oracle [7]. Se sitúa entre el S&OP y el MRP: es lo bastante específico (artículo final, semana) como para impulsar la planificación de materiales y de capacidad, y lo bastante estable como para proteger la planta del ruido diario. El MRP calcula después las necesidades netas escalonadas en el tiempo de cada componente para respaldar el MPS [7].

### Desagregación: de familia a artículo final

El plan de S&OP aprobado para «escritorios de estructura de acero» en abril es de 4.000 unidades. El planificador maestro lo divide por artículo final usando la mezcla actual y los pedidos conocidos: 55 % D100 (2.200), 30 % D120 (1.200) y 15 % D140 (600), y después por semana. Se usan las listas de materiales de planificación cuando las opciones se planifican como porcentajes, por ejemplo 60 % de estructuras negras y 40 % blancas.

### Barreras temporales

El MPS se divide en zonas con distintas reglas de cambio. Nombres y reglas típicos de las zonas (las definiciones exactas y la duración de las zonas varían según la empresa y el ERP):

| Zona | Extensión típica | Qué puede cambiar | Quién aprueba |
|---|---|---|---|
| Congelada | desde hoy hasta la barrera temporal de demanda (por ejemplo, el plazo de montaje final) | nada, salvo emergencias | director de planta o reunión de S&OE |
| Semicongelada | desde la barrera temporal de demanda hasta la barrera temporal de planificación (por ejemplo, el plazo acumulado de las piezas compradas de largo plazo) | mezcla dentro de la familia; cantidades dentro de la tolerancia acordada | planificador maestro |
| Libre | más allá de la barrera temporal de planificación | cualquier cosa compatible con el S&OP | sistema de planificación y planificador maestro |

La zona congelada es lo que significan las diapositivas de Gershwin del MIT cuando hablan de congelar el programa a corto plazo: reduce la inestabilidad a costa de flexibilidad [8]. La sección 12 cuantifica por qué.

### Registro del MPS con saldo disponible proyectado y ATP

**Ejemplo resuelto (cifras ilustrativas).** Artículo final D100, 60 unidades en stock, tamaño de lote del MPS 200, stock de seguridad 0, barrera temporal de demanda al final de la semana 2. Dentro de la barrera temporal de demanda, la demanda proyectada son solo los pedidos de clientes; fuera de ella, es el mayor valor entre la previsión y los pedidos de clientes.

| Semana | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Previsión | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 100 |
| Pedidos de clientes | 90 | 70 | 40 | 20 | 10 | 0 | 0 | 0 |
| Demanda proyectada | 90 | 70 | 100 | 100 | 100 | 100 | 100 | 100 |
| MPS (terminaciones) | 200 | | | 200 | | 200 | | 200 |
| Saldo disponible proyectado (PAB), inicio 60 | 170 | 100 | 0 | 100 | 0 | 100 | 0 | 100 |
| ATP discreto | 60 | | | 170 | | 200 | | 200 |
| ATP acumulado | 60 | 60 | 60 | 230 | 230 | 430 | 430 | 630 |

Cómo se obtienen las cifras:

- **PAB, semana 1:** 60 + 200 − 90 = 170. Semana 2: 170 − 70 = 100. Semana 3: 100 − 100 = 0. En la semana 4 saldría −100, así que el MPS planifica un lote de 200: 0 + 200 − 100 = 100. Y así sucesivamente.
- **El ATP discreto** se calcula solo en las semanas con una entrada del MPS: stock disponible (solo en el primer periodo) más la cantidad del MPS menos todos los pedidos de clientes hasta la siguiente entrada del MPS. Semana 1: 60 + 200 − (90 + 70 + 40) = 60. Semana 4: 200 − (20 + 10) = 170. Semanas 6 y 8: 200 − 0 = 200.
- **El ATP acumulado** suma el ATP discreto a lo largo del tiempo: 60, luego 60 + 170 = 230, después 430 y, por último, 630.
- Algunos sistemas ERP usan una variante de anticipación: si los pedidos de clientes de un periodo posterior superan la entrada del MPS de ese periodo, el faltante se descuenta del ATP de los periodos anteriores para que las mismas unidades no se prometan dos veces. En este ejemplo ningún periodo queda sobrevendido, así que ambos métodos dan el mismo resultado.

Lo que ventas puede prometer: un cliente que quiere 100 escritorios en la semana 2 puede obtener como máximo 60 del plan actual; los 100 completos están disponibles desde la semana 4 (ATP acumulado 230). El PAB de 0 en la semana 3 no es un problema para la promesa, porque el ATP usa los pedidos de clientes, no el pronóstico. Es una señal para el planificador maestro de que el plan no tiene holgura si los pedidos de la semana 3 superan el pronóstico. Sistemas ERP como JD Edwards informan el ATP y el ATP acumulado como salidas estándar del MPS [7].

### Reglas del MPS que mantienen creíble el programa

| Regla | Por qué |
|---|---|
| La suma del MPS por familia se mantiene dentro de ±5 % del plan S&OP (tolerancia de ejemplo) | de lo contrario, las decisiones de S&OP no llegan a planta |
| Sin sobrecarga: carga RCCP ≤ capacidad demostrada en los recursos clave | un MPS sobrestimado vuelve ficticias las fechas de ATP y MRP |
| Los cambios dentro de la zona congelada requieren aprobación nominal | protege material y capacidad ya comprometidos |
| Órdenes planificadas firmes para el corto plazo | la ejecución de MRP no puede moverlas automáticamente |
| Se verifica el ATP antes de cada promesa de pedido | evita prometer dos veces la misma capacidad |
| Revisión semanal del MPS en la reunión S&OE | detecta desviaciones antes de que se conviertan en pedidos atrasados |

## Planificación de capacidad aproximada (RCCP)

La planificación de capacidad aproximada verifica el MPS contra unos pocos **recursos críticos** antes de que MRP lo explosione. Es "aproximada" porque usa una lista de recursos (horas por artículo final en cada recurso clave), no rutas completas, e ignora la mayoría de los desfases de tiempos de entrega.

**Ejemplo resuelto (cifras ilustrativas).** MPS semanal para los tres modelos de escritorio y su lista de recursos en tres recursos clave:

| Modelo | MPS semana 14 | Soldadura (h/unidad) | Recubrimiento en polvo (h/unidad) | Montaje final (h/unidad) |
|---|---|---|---|---|
| D100 | 550 | 0,40 | 0,10 | 0,25 |
| D120 | 300 | 0,45 | 0,12 | 0,30 |
| D140 | 150 | 0,60 | 0,15 | 0,40 |

| Recurso | Cálculo de carga | Carga (h) | Capacidad semanal (h) | Utilización |
|---|---|---|---|---|
| Soldadura | 550 × 0,40 + 300 × 0,45 + 150 × 0,60 = 220 + 135 + 90 | 445 | 400 | **111 %** |
| Recubrimiento en polvo | 550 × 0,10 + 300 × 0,12 + 150 × 0,15 = 55 + 36 + 22,5 | 113,5 | 160 | 71 % |
| Montaje final | 550 × 0,25 + 300 × 0,30 + 150 × 0,40 = 137,5 + 90 + 60 | 287,5 | 320 | 90 % |

Soldadura está sobrecargada en 45 horas. Opciones: trasladar 75 escritorios D140 (75 × 0,60 = 45 h) a la semana 15 si esa semana tiene holgura y las fechas de los clientes lo permiten, planificar 45 horas de horas extra, o trasladar parte de los bastidores D100 al subcontratista previsto en la revisión de suministro. La capacidad semanal de soldadura de 400 horas coincide con las 1.600 horas mensuales usadas en S&OP (Sección 5), y ese es el punto: RCCP usa las mismas definiciones de recursos que la revisión de suministro de S&OP, de modo que los niveles pueden conciliarse.

Tres técnicas de RCCP son habituales en la bibliografía y en los sistemas ERP: planificación de capacidad mediante factores globales (porcentajes históricos de las horas totales por centro de trabajo), listas de capacidad o listas de recursos (horas por unidad y por recurso, como arriba) y perfiles de recursos que añaden desfases de tiempo. Cuanto más detallado es el método, más se acerca a la planificación de requerimientos de capacidad (Sección 11).

## Planificación de necesidades de materiales (MRP): cómo funciona el cálculo

**La planificación de necesidades de materiales (MRP)** utiliza la lista de materiales y los registros de inventario para calcular las necesidades netas escalonadas en el tiempo de cada componente y subconjunto, y propone un plan de reposición que respalda el MPS [7]. Su lógica se basa en una idea de Orlicky: la demanda de componentes es *dependiente* de la demanda del producto final, por lo que debe calcularse, no pronosticarse [13]. Si la planta fabrica 150 escritorios en la semana 3 y cada escritorio tiene cuatro patas, necesita 600 patas antes de la semana 3, independientemente de lo que indique un pronóstico estadístico para las patas.

### Las entradas

| Entrada | Contenido | Problema típico de calidad de datos |
|---|---|---|
| Plan maestro de producción | productos finales, cantidades, fechas | MPS no conciliado con S&OP, o sobrecargado |
| Lista de materiales (BOM) | relaciones padre-componente, cantidad por unidad, factores de merma, fechas de vigencia | se usa la BOM de ingeniería en lugar de la BOM de fabricación; faltan subconjuntos fantasma; desactualizada tras cambios de ingeniería |
| Registros de inventario | existencias, asignado, stock de seguridad | recuentos erróneos; merma y consumo no registrados |
| Pedidos abiertos (recepciones programadas) | órdenes de producción y compra liberadas con fechas de vencimiento | fechas de vencimiento no mantenidas; órdenes cerradas con retraso |
| Datos de planificación del maestro de artículos | tiempo de entrega, regla de dimensionamiento de lotes, múltiplos de pedido, mínimos, rendimiento | tiempos de entrega fijados hace años y nunca revisados |

Las diapositivas del MIT de Gershwin enumeran los mismos bloques de construcción: necesidades brutas, recepciones programadas, existencias proyectadas, necesidades netas, recepciones de órdenes planificadas y liberaciones de órdenes planificadas, desplazadas según el tiempo de entrega [8].

### Los cinco pasos para cada artículo

1. **Necesidades brutas:** el MPS para productos finales, o las liberaciones de órdenes planificadas de todos los padres multiplicadas por la cantidad por unidad, para componentes.
2. **Neteo:** existencias proyectadas = existencias anteriores + recepciones programadas − necesidades brutas. Cuando caigan por debajo del stock de seguridad, el faltante es la **necesidad neta**.
3. **Dimensionamiento de lotes:** la necesidad neta se convierte en una **recepción de orden planificada** según la regla de dimensionamiento de lotes (lote a lote, cantidad de pedido fija, múltiplos, cantidad de pedido por periodo).
4. **Desplazamiento:** la recepción de orden planificada se retrasa según el tiempo de entrega del artículo para obtener la **liberación de orden planificada**.
5. **Explosión:** las liberaciones de órdenes planificadas se convierten en necesidades brutas del siguiente nivel de la BOM.

Los artículos se procesan nivel por nivel en orden de **código de nivel bajo**: a cada artículo se le asigna un código igual al nivel más bajo en el que aparece en cualquier BOM, de modo que se recojan todas las necesidades brutas de todos los padres antes de neteear el artículo [8]. El ejemplo práctico muestra por qué esto importa.

### Ejemplo práctico: explosión MRP y neteo en dos niveles de BOM

**Estructura del producto (ilustrativa).** El escritorio D100 se compone de un tablero T-20, un bastidor de patas F-10 y 1 metro de tubo de acero S-5 para un travesaño. Cada bastidor de patas F-10 se suelda con 4 metros de tubo de acero S-5. Por lo tanto, S-5 aparece en el nivel 1 (directamente en D100) y en el nivel 2 (en F-10); su código de nivel bajo es 2.

```
D100 Escritorio (nivel 0)
├── T-20 Tablero, cant. 1 (nivel 1, fabricación propia, tiempo de entrega 1 semana)
├── F-10 Bastidor de patas, cant. 1 (nivel 1, soldado en casa, tiempo de entrega 2 semanas)
│   └── S-5 Tubo de acero, 4 m (nivel 2, comprado, tiempo de entrega 2 semanas)
└── S-5 Tubo de acero, 1 m (nivel 1, travesaño)
```

Para que las tablas sean legibles, la fila del MPS muestra la semana en la que comienza el ensamblaje final de D100; los componentes deben estar disponibles al inicio de esa semana.

**MPS para D100 (inicio del ensamblaje final):**

| Semana | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Total |
|---|---|---|---|---|---|---|---|---|---|
| Inicio de ensamblaje D100 | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 | 740 |

**Artículo T-20 Tablero.** Lote a lote, tiempo de entrega 1 semana, existencias 30, recepción programada 100 en la semana 1, stock de seguridad 0.

| Semana | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Necesidades brutas | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 |
| Recepciones programadas | 100 | | | | | | | |
| Existencias proyectadas (inicio 30) | 10 | 10 | 0 | 0 | 0 | 0 | 0 | 0 |
| Necesidades netas | | | 140 | 100 | | 150 | 100 | 120 |
| Recepciones de órdenes planificadas | | | 140 | 100 | | 150 | 100 | 120 |
| Liberaciones de órdenes planificadas | | 140 | 100 | | 150 | 100 | 120 | |

Semana 1: 30 + 100 − 120 = 10. Semana 3: 10 − 150 = −140, por lo que se necesitan 140 y se liberan una semana antes, en la semana 2.

**Artículo F-10 Bastidor de patas.** Cantidad de pedido fija 200 (un lote de soldadura), tiempo de entrega 2 semanas, existencias 120, sin recepciones programadas, stock de seguridad 0.

| Semana | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Necesidades brutas | 120 | 0 | 150 | 100 | 0 | 150 | 100 | 120 |
| Disponible proyectado (inicio 120) | 0 | 0 | 50 | 150 | 150 | 0 | 100 | 180 |
| Necesidades netas | | | 150 | 50 | | | 100 | 20 |
| Recepciones de órdenes planificadas | | | 200 | 200 | | | 200 | 200 |
| Liberaciones de órdenes planificadas | 200 | 200 | | | 200 | 200 | | |

Semana 3: 0 − 150 = −150, por lo que llega un lote de 200, quedando 50. Semana 4: 50 − 100 = −50, otro lote de 200, quedando 150. La semana 6 consume exactamente los 150 restantes. Las liberaciones se desfasan dos semanas.

**Artículo S-5 Tubo de acero (código de nivel bajo 2).** Comprado, plazo de entrega de 2 semanas, pedidos en múltiplos de 500 m, disponible de 1.400 m, recepción programada de 500 m en la semana 1, stock de seguridad de 100 m. Las necesidades brutas combinan ambos padres:

| Semana | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| De liberaciones de F-10 (× 4 m) | 800 | 800 | | | 800 | 800 | | |
| De inicios de D100 (× 1 m) | 120 | | 150 | 100 | | 150 | 100 | 120 |
| **Necesidades brutas** | **920** | **800** | **150** | **100** | **800** | **950** | **100** | **120** |
| Recepciones programadas | 500 | | | | | | | |
| Disponible proyectado (inicio 1.400) | 980 | 180 | 530 | 430 | 130 | 180 | 580 | 460 |
| Necesidades netas | | | 70 | | 470 | 920 | 20 | |
| Recepciones de órdenes planificadas | | | 500 | | 500 | 1.000 | 500 | |
| Liberaciones de órdenes planificadas | 500 | | 500 | 1.000 | 500 | | | |

Semana 3: 180 − 150 = 30, por debajo del stock de seguridad de 100, por lo que la necesidad neta es 70 y se pide un múltiplo de 500 (disponible proyectado 530). Semana 6: 130 − 950 = −820; para terminar como mínimo en 100, la necesidad neta es 920, redondeada hacia arriba a 1.000.

**Lo que muestra el ejemplo**

- **La demanda dependiente es irregular.** La demanda de escritorios es bastante uniforme (de 100 a 150 a la semana), pero la demanda de tubo salta entre 100 y 950 m a la semana porque los lotes de soldadura de 200 bastidores extraen 800 m de una sola vez. Un pronóstico estadístico del consumo de tubo no detectaría esos picos; la explosión de la lista de materiales sí.
- **La codificación de nivel bajo evita faltantes.** Si S-5 se hubiera calculado en el nivel 1 (solo con la demanda de travesaños de 120 a 150 m a la semana), el MRP no habría visto necesidad hasta la semana 7 y los bastidores se habrían quedado sin tubo en la semana 2.
- **Los tamaños de lote se multiplican.** Dos reglas de dimensionamiento de lotes (200 bastidores, múltiplos de 500 m) convirtieron 740 escritorios en 2.500 m de pedidos de tubo en cinco semanas. La [guía de dimensionamiento de lotes](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/) explica cómo elegir esas reglas; la [guía de gestión de inventario en manufactura](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/) cubre el stock de seguridad.
- **La salida del ERP es una lista de acciones:** liberar 200 bastidores y comprar 500 m de tubo esta semana; liberar 140 escritorios la próxima semana. El planificador trabaja con estas como **mensajes de excepción** (liberar, reprogramar hacia adelante, reprogramar hacia atrás, cancelar) en lugar de leer las tablas completas.

### Asignación y mensajes de excepción

La **asignación** (*pegging*) vincula cada necesidad con su origen: la necesidad de tubo de 950 m de la semana 6 se asigna a la liberación de F-10 de la semana 6 (800 m) y al inicio de D100 de la semana 6 (150 m). Con la asignación, un planificador que no pueda conseguir 1.000 m de tubo en la semana 6 ve qué escritorios y qué pedidos de clientes están en riesgo.

Mensajes de excepción típicos del MRP y qué hacer:

| Mensaje | Significado | Acción típica |
|---|---|---|
| Liberar orden | la orden planificada está dentro de su ventana de liberación | convertir en orden de producción o compra tras verificar capacidad y material |
| Reprogramar hacia adelante (acelerar) | una orden abierta vence más tarde de lo necesario | pedir al proveedor o a la planta que adelante; si es imposible, escalar a un cambio en el MPS |
| Reprogramar hacia atrás (retrasar) | una orden abierta vence antes de lo necesario | aplazar para reducir inventario y liberar capacidad |
| Cancelar | una orden abierta ya no es necesaria | cancelar o reducir; revisar las condiciones de cancelación |
| Vencida | la fecha de liberación o de entrega ya pasó | el plan es inviable tal como está: corregir el MPS, no solo la orden |
| Por debajo del stock de seguridad | disponible proyectado por debajo del nivel de seguridad | comprobar si el stock de seguridad es correcto antes de acelerar |

Una planta con cientos de órdenes planificadas vencidas después de cada ejecución del MRP no tiene un problema de MRP. Tiene un MPS que no es factible, o plazos de entrega y tamaños de lote que no reflejan la realidad.

### MRP frente a punto de reorden y kanban

MRP no es la única forma de reabastecer piezas. Los sistemas de punto de reorden y kanban reponen cuando el stock cae a un nivel de disparo y funcionan bien para artículos con demanda estable y de alta frecuencia. MRP es preferible para demanda dependiente irregular, plazos de entrega largos, bajo volumen y productos de ingeniería. Muchas plantas usan ambos: kanban para tornillería y piezas de alta rotación en línea, y MRP para piezas de plazo largo y costosas. La [guía de kanban y sistema pull](https://www.m365.fm/en/learn/kanban-pull-system/) y la [guía de manufactura esbelta](https://www.m365.fm/en/learn/lean-manufacturing/) explican el lado pull.

## MRP II, CRP y el ciclo cerrado

**Planificación de recursos de fabricación (MRP II)** cierra el ciclo alrededor de MRP: S&OP y el MPS por encima, la planificación de necesidades de capacidad (CRP) y el control de piso de taller por debajo, y el vínculo con la planificación financiera [3][8]. Oliver Wight la describió en 1983 [3].

**Planificación de necesidades de capacidad (CRP)** toma todas las órdenes planificadas y liberadas de MRP, aplica las rutas completas (tiempo de preparación y de ejecución por operación y centro de trabajo) y calcula la carga por centro de trabajo y periodo. Muestra las sobrecargas pero no las resuelve: CRP, al igual que MRP, descansa sobre el supuesto de capacidad infinita [8]. Wallace Hopp y Mark Spearman sostienen en *Factory Physics* que el modelo básico de MRP asume plazos de entrega que no dependen de la carga, lo que solo es posible con capacidad ilimitada [9]. La guía de APS muestra un ejemplo resuelto de la sobrecarga que MRP no detecta y explica el **síndrome del plazo de entrega**: los planificadores alargan los plazos planificados para cubrir pedidos tardíos, lo que libera trabajo antes de tiempo, aumenta el WIP y alarga aún más los plazos [26]. En lugar de repetir esas secciones, esta guía los enlaza: véase [las debilidades de la lógica clásica de MRP](https://www.m365.fm/en/learn/production-scheduling-aps/).

| Elemento del ciclo cerrado | Verifica | Retroalimentación si falla |
|---|---|---|
| Planificación de recursos en S&OP | capacidad agregada por mes | cambiar el plan de familias, decisión de capacidad |
| RCCP | recursos clave por semana | cambiar el MPS |
| CRP | cada centro de trabajo por día o semana | horas extra, ruta alternativa, cambiar el MPS |
| Control de entradas/salidas y programación finita | colas y secuencia reales | reprogramar, control de liberación, escalar al MPS |
| Retroalimentación de piso de taller (MES) | terminaciones reales, scrap, paradas | actualizar órdenes abiertas e inventario para la siguiente corrida de MRP |

## Nerviosismo del MRP: por qué los planes saltan y cómo estabilizarlos

**Nerviosismo** significa que pequeños cambios en el MPS o en el inventario provocan cambios grandes o frecuentes en las órdenes planificadas de niveles inferiores. Las diapositivas de Gershwin describen el fenómeno como pequeñas desviaciones que causan grandes cambios en el programa [8]. Las causas son la interacción entre el dimensionamiento de lotes, los desfases por tiempo de entrega y el horizonte de planificación rodante, además del ruido en los datos de demanda, suministro e inventario.

### Ejemplo práctico: 30 escritorios más en la semana 4

Ventas acepta un pedido adicional: el inicio del ensamblaje D100 en la semana 4 aumenta de 100 a 130, un cambio del 4 % del volumen de ocho semanas (30 de 740). Al volver a ejecutar el ejemplo anterior se obtiene:

| Artículo | Antes | Después | Cambio |
|---|---|---|---|
| T-20 Sobremesa, liberaciones planificadas | sem. 2: 140, sem. 3: 100, sem. 5: 150, sem. 6: 100, sem. 7: 120 | sem. 2: 140, sem. 3: **130**, sem. 5: 150, sem. 6: 100, sem. 7: 120 | cantidad +30 |
| F-10 Bastidor de patas, liberaciones planificadas | sem. 1, 2, **5**, 6 (200 cada una) | sem. 1, 2, **4**, 6 (200 cada una) | un lote de soldadura adelantado una semana |
| S-5 Tubo de acero, liberaciones planificadas | sem. 1: 500, **sem. 3: 500**, sem. 4: 1.000, sem. 5: 500 | sem. 1: 500, **sem. 2: 500**, sem. 4: 1.000, sem. 5: 500 | una orden de compra adelantada una semana, ahora con fecha de liberación la próxima semana |

Las 30 unidades adicionales no cambiaron ninguna cantidad de tubo ni de bastidores. Cambiaron **fechas** en dos niveles inferiores, porque el lote fijo de 200 bastidores se agota ahora una semana antes. En una lista de materiales real con cientos de componentes, unas pocas de estas modificaciones cada día generan miles de mensajes de reprogramación, y los planificadores dejan de confiar en el sistema. Eso es el nerviosismo.

### Remedios

Joseph Blackburn, Dean Kropp y Robert Millen compararon cinco estrategias para amortiguar el nerviosismo en un estudio de simulación publicado en *Management Science* en 1986: congelar el programa dentro del horizonte de planificación, lote a lote por debajo del producto final, stock de seguridad, previsión más allá del horizonte de planificación y un procedimiento de coste de cambio [10]. Para el nerviosismo causado por el horizonte rodante y el dimensionamiento de lotes, el stock de seguridad y el lote a lote no resultaron rentables, mientras que las estrategias de coste de cambio y de congelación fueron en general las de mejor comportamiento [10]. El estudio no cubrió el nerviosismo causado por la incertidumbre de la demanda, del suministro o del tiempo de entrega [10].

| Remedio | Cómo funciona | Compensación |
|---|---|---|
| Zona congelada y barreras temporales | no se producen cambios automáticos dentro de la zona congelada | menor capacidad de respuesta ante cambios reales |
| Órdenes planificadas firmes | el planificador fija determinadas órdenes; el MRP no las mueve | el planificador debe mantenerlas |
| Reglas de coste de cambio o de "amortiguación" | el MRP solo propone una reprogramación si el cambio de fecha supera un umbral (por ejemplo, 3 días) o si el coste del cambio lo justifica | persisten pequeñas discrepancias |
| Lote a lote en niveles inferiores | elimina la interacción del tamaño de lote | más preparaciones y órdenes; Blackburn et al. comprobaron que no era rentable para el nerviosismo provocado por el horizonte [10] |
| Stock de seguridad | absorbe pequeños cambios | coste de inventario; tampoco rentable en ese estudio [10] |
| Datos precisos | menos cambios artificiales por inventarios o listas de materiales erróneos | requiere recuentos cíclicos y disciplina en los cambios de ingeniería |
| Desacoplamiento con buffers (DDMRP) | rompe la cadena de dependencias en puntos seleccionados | inventario de amortiguación; método nuevo que aprender |

## Planificación de necesidades de materiales impulsada por la demanda (DDMRP)

La **planificación de necesidades de materiales impulsada por la demanda (DDMRP, por sus siglas en inglés, Demand Driven Material Requirements Planning)** mantiene la lógica de lista de materiales de MRP, pero detiene la explosión de las necesidades basadas en el pronóstico en puntos de desacoplamiento seleccionados, donde coloca stocks de amortiguamiento dimensionados y gestionados activamente. Las órdenes de suministro se generan a partir de la demanda real y del estado del amortiguamiento, y no solo a partir del pronóstico. El método procede de los consultores Carol Ptak y Chad Smith: su actualización de 2011 del libro de Orlicky, *Orlicky's Material Requirements Planning, Third Edition*, añade orientaciones para planificar a partir de pedidos de venta reales en lugar de pronósticos, bajo el nombre DDMRP [4]. TechTarget señala que algunos profesionales consideran controvertido este enfoque [4]. Ptak y Smith también fundaron el Demand Driven Institute en 2011; evalúa y certifica, sin coste para los proveedores, el software conforme con DDMRP, y otorga certificados de respaldo profesional a las personas [35].

### Los cinco componentes

La documentación de Microsoft para Dynamics 365 Supply Chain Management enumera los cinco componentes de DDMRP [11]:

1. **Posicionamiento estratégico del inventario:** identificar en la cadena de suministro los puntos de desacoplamiento donde se mantiene, supervisa y reabastece un stock de amortiguamiento.
2. **Perfiles y niveles de amortiguamiento:** dimensionar cada amortiguamiento (mínimo, máximo, punto de reorden) y la cantidad de reposición.
3. **Ajustes dinámicos del amortiguamiento:** ajustar los niveles de amortiguamiento ante cambios en los parámetros operativos o en eventos planificados.
4. **Planificación impulsada por la demanda:** generar órdenes de suministro (fabricación, compra, traslado) según se requiera.
5. **Ejecución altamente colaborativa y visible:** ejecutar las órdenes de suministro con prioridad visual, normalmente por color de amortiguamiento.

### Dimensionamiento del amortiguamiento: ejemplo práctico

Cada amortiguamiento tiene tres zonas, calculadas a partir del uso medio diario (ADU, por sus siglas en inglés, Average Daily Usage), el plazo de entrega desacoplado (DLT, por sus siglas en inglés, Decoupled Lead Time), un factor de plazo de entrega y un factor de variabilidad, según documenta Microsoft [12]:

| Zona | Fórmula [12] |
|---|---|
| Amarilla | ADU × DLT |
| Roja base | ADU × DLT × factor de plazo de entrega |
| Roja de seguridad | roja base × factor de variabilidad |
| Roja | roja base + roja de seguridad |
| Verde | el mayor de: cantidad mínima de pedido; ADU × ciclo de pedido; ADU × DLT × factor de plazo de entrega |

Microsoft recomienda factores de plazo de entrega de 0,20–0,40 para plazos largos, 0,41–0,60 para medios y 0,61–1,00 para cortos, y factores de variabilidad de 0,20–0,40 para variabilidad baja, 0,41–0,60 para media y 0,61–1,00 para alta [12]. El **plazo de entrega desacoplado** es el tiempo necesario para producir o recibir un artículo si los puntos de desacoplamiento aguas arriba tienen stock; suele ser mucho más corto que el plazo de entrega acumulado [12].

**Ejemplo (cifras ilustrativas).** Un soporte comprado B-7: ADU 40 piezas, plazo de entrega desacoplado 10 días, factor de plazo de entrega 0,5 (medio), factor de variabilidad 0,5 (medio), cantidad mínima de pedido 300, ciclo de pedido 7 días.

| Zona | Cálculo | Tamaño | Acumulado (parte superior de la zona) |
|---|---|---|---|
| Roja base | 40 × 10 × 0,5 | 200 | |
| Roja de seguridad | 200 × 0,5 | 100 | |
| Roja | 200 + 100 | 300 | 300 |
| Amarilla | 40 × 10 | 400 | 700 |
| Verde | máx(300; 40 × 7 = 280; 200) | 300 | 1.000 |

### La ecuación de flujo neto

DDMRP decide la reposición con la **posición de flujo neto**: stock disponible + pedido en curso − demanda de pedidos de venta cualificada [14]. La demanda cualificada incluye normalmente los pedidos con vencimiento hoy, los pedidos atrasados y los picos cualificados dentro de un horizonte definido. Si la posición de flujo neto cae por debajo de la parte superior de la zona amarilla, se crea una orden de suministro para devolverla a la parte superior de la zona verde [14].

Siguiendo con el ejemplo: stock disponible 350, pedido en curso 400, demanda cualificada 90. Posición de flujo neto = 350 + 400 − 90 = **660**. Está por debajo de la parte superior de la zona amarilla (700), así que DDMRP propone una orden de 1.000 − 660 = **340** piezas. La orden supera la cantidad mínima de pedido de 300, por lo que se mantiene. La prioridad de ejecución se fija después según el estado del stock disponible: 350 unidades están justo por encima de la parte superior de la zona roja (300), lo que un planificador consideraría urgente.

### Cuándo encaja DDMRP y cuándo no

| Situación | Idoneidad de DDMRP | Motivo |
|---|---|---|
| Plazos de entrega acumulados largos, clientes que esperan plazos cortos | buena | el desacoplamiento comprime el plazo de entrega que percibe el cliente |
| Muchos componentes compartidos, alta variabilidad, nerviosismo frecuente de MRP | buena | los buffers absorben la variabilidad en lugar de trasladarla hacia abajo en la lista de materiales |
| Demanda estable y previsible, listas de materiales cortas | limitada | MRP clásico o kanban pueden ser más sencillos |
| Proyectos únicos de ingeniería a pedido | limitada | pocos artículos repetitivos que almacenar en buffer; domina la planificación de proyectos |
| Exactitud de inventario y datos maestros débiles | deficiente | los buffers dimensionados con un ADU o plazos de entrega erróneos protegen los artículos equivocados |

DDMRP no sustituye al S&OP. Las políticas de buffer, la capacidad y la inversión en inventario siguen necesitando una decisión mensual multifuncional, y el ERP sigue necesitando el MPS para los productos terminados que no están en buffer. En Dynamics 365, DDMRP forma parte del módulo de planificación maestra, utiliza su propio código de cobertura, no tiene cuotas de licencia adicionales y requiere el complemento Planning Optimization; Microsoft subraya que no sustituye la funcionalidad de planificación existente [11]. SAP incluye DDMRP entre los temas de su material sobre MRP [27], e IFS documenta DDMRP en IFS Cloud [14]. La evidencia independiente y revisada por pares sobre los resultados de DDMRP sigue siendo más escasa que el material de casos de proveedores y consultoras; trate los porcentajes de mejora de los proveedores de DDMRP como afirmaciones del proveedor.

## Planificación de producción en el ERP: qué hacen los sistemas y dónde se detienen

Casi todos los ERP de fabricación contienen un motor MPS y otro MRP. El S&OP se gestiona de tres formas: en el propio ERP, en una plataforma dedicada de S&OP o IBP conectada al ERP, o en hojas de cálculo alrededor del ERP.

### Funciones típicas de planificación en el ERP

| Función | Qué buscar |
|---|---|
| Gestión de la demanda y previsión | modelos estadísticos, consumo de previsión por pedidos, previsión a nivel de familia y SKU |
| MPS | ventanas temporales, órdenes planificadas firmes, listas de planificación para opciones, ATP y ATP acumulado [7] |
| RCCP | listas de recursos para recursos clave, informes de carga frente a capacidad |
| MRP | ejecuciones de cambio neto y regenerativas, códigos de nivel bajo, reglas de tamaño de lote, pegging, mensajes de excepción |
| CRP | carga por centro de trabajo a partir de las rutas |
| DDMRP | puntos de desacoplamiento, perfiles de buffer, flujo neto (cuando se admite) [11] |
| Integración | con la herramienta de S&OP, APS, MES, portales de proveedores, BI |

### Opciones en el mercado (ejemplos, no un ranking)

| Categoría | Ejemplos verificados para esta guía | Notas |
|---|---|---|
| ERP con MPS/MRP | Oracle JD Edwards EnterpriseOne (MPS, MRP, ATP) [7]; Microsoft Dynamics 365 Supply Chain Management (planificación maestra con Planning Optimization, DDMRP) [11]; SAP S/4HANA (MRP; el material de SAP cubre MRP predictivo y DDMRP) [27]; IFS Cloud (DDMRP) [14] | muchos otros proveedores de ERP ofrecen MRP; compruebe la profundidad de la planificación en una demostración con guion |
| S&OP e IBP asociados al ERP | SAP Integrated Business Planning [5]; Oracle Fusion Cloud Sales and Operations Planning [33] | más sólidos cuando el ERP es del mismo proveedor |
| Plataformas independientes de S&OP / IBP | Kinaxis, o9 Solutions, Blue Yonder, ToolsGroup, Board, Anaplan (lista de proveedores según la guía de compra de Board de 2026, escrita por uno de los proveedores) [29][15] | las clasificaciones de proveedores hechas por los propios proveedores no son independientes; use informes de analistas con metodología declarada |
| Hojas de cálculo | Excel con extractos del ERP; Power BI para informes de KPI | adecuadas para un primer ciclo de S&OP con pocas familias; frágiles a gran escala |

Para empresas centradas en Microsoft, una configuración práctica consiste en ejecutar el MPS y el MRP en el ERP, preparar el S&OP en Excel o en una herramienta de planificación, y publicar el paquete de KPI y el registro de decisiones a través de Power BI y Teams. Microsoft presenta Dynamics 365, Microsoft 365 y Azure en conjunto como "Microsoft for Manufacturing" [31], y los datos de Dataverse pueden ponerse a disposición en Microsoft Fabric sin una canalización ETL independiente [32]. La [guía de Azure para fabricación](https://www.m365.fm/en/learn/manufacturing-it-azure/) describe la arquitectura.

### Cómo el ERP ejecuta el MRP

La mayoría de los sistemas ERP ofrecen dos modos de ejecución: una ejecución **regenerativa**, que recalcula todos los artículos desde cero, a menudo cada noche o cada semana, y una ejecución de **cambio neto**, que solo recalcula los artículos cuya demanda, suministro o datos maestros han cambiado. En ambos casos, el plan es tan actual como los datos que la ejecución utiliza: si el MES registra las terminaciones y la chatarra una vez por turno, pero el MRP se ejecuta a las 2 a. m., la lista de excepciones de la mañana refleja el piso de ayer. Alinee la hora de ejecución del MRP con el ciclo de registro del MES y del inventario, y mantenga estable el MPS durante la ejecución para que los planificadores y el sistema no trabajen en contra uno del otro. La [guía de MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) cubre el intercambio de datos entre el Nivel 3 y el Nivel 4.

### Dónde termina la planificación del ERP

- **Capacidad finita.** El MRP y el CRP del ERP planifican con capacidad infinita [8]. Cuando un cuello de botella determina las fechas de entrega, se necesita un programador de capacidad finita o un APS; véase la [guía de APS](https://www.m365.fm/en/learn/production-scheduling-aps/).
- **Escenarios.** Comparar tres opciones de suministro con efectos completos en materiales y capacidad es lento en la mayoría de las ejecuciones de MRP del ERP. Las plataformas de planificación anuncian un recálculo rápido de escenarios; Kinaxis, por ejemplo, describe una planificación concurrente que reduce los ciclos de semanas a horas (afirmación del proveedor) [16].
- **Respuesta a interrupciones.** En una encuesta de IDC encargada por Kinaxis (1800 encuestados en nueve países, realizada en diciembre de 2023), el 83 % de las cadenas de suministro no pudo responder a las interrupciones en un plazo de 24 horas (investigación encargada por el proveedor) [30].
- **Ejecución.** El despacho, las confirmaciones y el WIP en tiempo real corresponden al MES (ISA-95 Nivel 3) [25].

### Lista de verificación para la selección de software de S&OP y planificación

| Pregunta | Por qué importa |
|---|---|
| ¿Puede conciliar automáticamente los planes por familia con el MPS a nivel de SKU? | el esfuerzo manual más común en S&OP |
| ¿Muestra los planes en unidades y en dólares, uno al lado del otro? | finanzas debe formar parte del proceso |
| ¿Cuánto tiempo tarda en calcularse un escenario completo (cambio de demanda + capacidad + materiales)? | determina si los escenarios se usan en las reuniones |
| ¿Qué integraciones con ERP son estándar y quién las mantiene? | la integración a menudo cuesta más que las licencias |
| ¿Pueden los planificadores cambiar los datos maestros (tiempos de entrega, tamaños de lote) con un registro de auditoría? | la calidad de los datos es el principal factor de la calidad del plan |
| ¿Se mide el valor añadido del pronóstico (ajuste manual frente a estadístico)? | muestra si los ajustes por consenso ayudan |
| ¿Cuál es el tiempo realista hasta el primer ciclo de S&OP en producción? | Anaplan, por ejemplo, recomienda esperar un valor demostrable en 8–12 semanas (orientación del proveedor) [15] |
| Costo total a 5 años, incluido el personal interno | las tarifas de licencia suelen ser la parte menor [unverified: no se verificó ningún estudio independiente de costos] |

## Plantillas: calendario S&OP, agendas, plan de familias y registros MPS y MRP

Las tablas siguientes pueden copiarse en Excel o en una lista de SharePoint como punto de partida. Las agendas de la revisión de demanda, la revisión de suministro y la reunión ejecutiva se encuentran en la Sección 4.

### Plantilla 1: plan de familia de productos (una hoja por familia, MTS)

| Fila | Real M-1 | M1 | M2 | M3 | M4–M6 (trimestre) | M7–M12 (semestre) | M13–M18 | Notas |
|---|---|---|---|---|---|---|---|---|
| Presupuesto / plan financiero (unidades) | | | | | | | | de finanzas |
| Pronóstico estadístico (unidades) | | | | | | | | modelo, versión |
| Plan de demanda consensuado (unidades) | | | | | | | | responsable: VP de ventas |
| Consenso del mes anterior (unidades) | | | | | | | | cambio visible |
| Plan de suministro (unidades) | | | | | | | | responsable: VP de operaciones |
| Inventario final (unidades) | | | | | | | | |
| Objetivo de inventario (unidades o días de suministro) | | | | | | | | política |
| Carga de recurso clave (% de capacidad) | | | | | | | | p. ej. soldadura |
| Ingresos a precio estándar ($) | | | | | | | | finanzas |
| Costo de bienes vendidos a costo estándar ($) | | | | | | | | finanzas |
| Supuestos y riesgos | | | | | | | | enlace al registro |

Para las familias de fabricación por pedido, sustituya las filas de inventario por **backlog** y **objetivo de backlog (semanas)**. Backlog final = backlog inicial + pedidos nuevos − envíos.

### Plantilla 2: registro de supuestos

| ID | Familia | Supuesto | Responsable | Fecha de alta | Impacto si es incorrecto (unidades, $) | Estado / fecha de revisión |
|---|---|---|---|---|---|---|
| A-031 | escritorios | el aumento de precio de la competencia en abril se mantiene | VP de ventas | 6 ene | −400 unidades/mes | revisión 3 feb |
| A-032 | escritorios | subcontratista de soldadura calificado para marzo | cadena de suministro | 8 ene | −300 unidades en abril | en curso |

### Plantilla 3: registro de decisiones

| ID | Reunión / fecha | Decisión | Opciones consideradas | Responsable | Vencimiento | Efecto en el plan | Estado |
|---|---|---|---|---|---|---|---|
| D-014 | S&OP ejecutivo, 15 ene | adoptar plan híbrido, ritmos 3.500 / 4.000 / 3.000 | nivelado, persecución, híbrido | VP de operaciones | 31 ene | +2.000 unidades de cambio de ritmo, $35.200 | abierto |
| D-015 | S&OP ejecutivo, 15 ene | calificar subcontratista de soldadura para 200–400 unidades/mes | ninguno / calificar / tercer turno | cadena de suministro | 1 mar | reducción de riesgo para mar–may | abierto |

### Plantilla 4: registro MPS

| Artículo | Semana | 1 | 2 | 3 | … |
|---|---|---|---|---|---|
| | Pronóstico | | | | |
| | Pedidos de clientes | | | | |
| | Demanda proyectada (regla por ventana de tiempo) | | | | |
| | MPS (firme / planificado) | | | | |
| | Saldo disponible proyectado | | | | |
| | ATP / ATP acumulado | | | | |
| | Zona de ventana de tiempo | congelada | congelada | semicongelada | libre |

### Plantilla 5: registro MRP (por artículo)

| Artículo, LLC, plazo de entrega, regla de lote, stock de seguridad, existencias | Semana | 1 | 2 | 3 | … |
|---|---|---|---|---|---|
| | Requerimientos brutos | | | | |
| | Recepciones programadas | | | | |
| | Existencias proyectadas | | | | |
| | Requerimientos netos | | | | |
| | Recepciones de órdenes planificadas | | | | |
| | Liberaciones de órdenes planificadas | | | | |

### Plantilla 6: lista de verificación de preparación S&OP antes del primer ciclo

| Elemento | Listo cuando |
|---|---|
| Familias de productos definidas | 5–15 familias por unidad de negocio, cada una con recursos y factores de demanda similares |
| Recursos clave definidos | 3–8 recursos que limitan la producción, con capacidad demostrada por mes |
| Lista de recursos | horas por unidad por recurso clave, por familia |
| Fuentes de datos | envíos, pedidos, inventario y producción por familia disponibles en los días hábiles 1–2 |
| Política de inventario o backlog | objetivo por familia aprobado por finanzas |
| Calendario | 12 meses de fechas reservadas para los cinco pasos |
| Derechos de decisión | umbrales escritos para la revisión de suministro, la pre-S&OP y la reunión ejecutiva |
| Patrocinador ejecutivo | designado, asiste en persona a los tres primeros ciclos |

## KPI de S&OP y MRP con ejemplos resueltos

Un buen paquete de KPI de S&OP es breve: unas diez medidas, cada una con una definición, un responsable y un objetivo. La [guía de KPI de manufactura](https://www.m365.fm/en/learn/manufacturing-kpis/) cubre medidas a nivel de planta, como OEE y entrega a tiempo; esta sección cubre medidas de planificación.

### Precisión del pronóstico, sesgo y MAPE: un solo conjunto de datos, cinco medidas

**Datos (ilustrativos).** Pronóstico mensual (F, elaborado con un mes de antelación) y demanda real (A) de la familia de escritorios:

| Mes | Pronóstico F | Real A | Error e = F − A | Error absoluto \|e\| | Error porcentual absoluto \|e\| / A |
|---|---|---|---|---|---|
| Ene | 3,000 | 2,850 | +150 | 150 | 5.26% |
| Feb | 3,200 | 3,350 | −150 | 150 | 4.48% |
| Mar | 4,200 | 3,900 | +300 | 300 | 7.69% |
| Abr | 4,800 | 5,100 | −300 | 300 | 5.88% |
| May | 4,000 | 3,700 | +300 | 300 | 8.11% |
| Jun | 2,800 | 2,650 | +150 | 150 | 5.66% |
| **Suma** | **22,000** | **21,550** | **+450** | **1,350** | **37.08%** |

| Medida | Fórmula | Cálculo | Resultado |
|---|---|---|---|
| MAPE (error porcentual absoluto medio) | promedio de \|e\| / A | 37.08% / 6 | **6.18%** |
| WMAPE (MAPE ponderado) | Σ\|e\| / ΣA | 1,350 / 21,550 | **6.26%** |
| Precisión del pronóstico | 1 − WMAPE | 1 − 0.0626 | **93.7%** |
| Sesgo | Σe / ΣA | +450 / 21,550 | **+2.1% (sobrepronóstico)** |
| MAD (desviación absoluta media) | Σ\|e\| / n | 1,350 / 6 | **225 unidades** |
| Señal de seguimiento | Σe / MAD | 450 / 225 | **+2.0** |

Cómo interpretarlo:

- **La precisión y el sesgo responden preguntas distintas.** Una precisión de 93.7% suena bien. Pero cuatro de los seis meses tienen sobrepronóstico y el error acumulado es de +450 unidades. Si el suministro sigue al pronóstico, el inventario crece unas 450 unidades en seis meses. El sesgo es la medida que muestra el optimismo o el pesimismo sistemáticos.
- **MAPE frente a WMAPE.** El MAPE pondera todos los meses por igual; el WMAPE pondera por volumen. A nivel de SKU, el MAPE se dispara en artículos pequeños: un SKU con pronóstico 10 y real 2 tiene un error de 400%. Use WMAPE (o MAD/media) para informar a nivel de SKU y reserve el MAPE para series estables de alto volumen.
- **Señal de seguimiento.** El error acumulado dividido entre el MAD. Un valor que se aleja de cero de forma constante indica sesgo; una regla práctica habitual considera que el modelo funciona correctamente mientras la señal de seguimiento se mantenga entre −4 y +4 [36].
- **La agregación oculta el error.** Dos SKU con pronósticos de 1,000 cada uno y reales de 1,200 y 800 dan un error de familia de 0, pero un WMAPE a nivel de SKU de 400 / 2,000 = 20%. Informe la precisión en el nivel donde se toman las decisiones: familia para el S&OP, SKU y ubicación para el MPS y la reposición.
- **El desfase importa.** Mida el pronóstico congelado con el plazo de entrega que cuenta (por ejemplo, el pronóstico elaborado tres meses antes del mes para una pieza con plazo de entrega de tres meses), no la actualización de última hora.

### Valor añadido del pronóstico

El valor añadido del pronóstico (FVA, por sus siglas en inglés) compara el error de cada paso del proceso de pronóstico con el paso anterior. Si el pronóstico estadístico tuvo un WMAPE de 7.5% y el pronóstico de consenso tras los ajustes de ventas tiene 6.3%, el proceso de consenso añadió 1.2 puntos porcentuales de precisión. Si el resultado hubiera sido 8.5%, la reunión habría empeorado el pronóstico. El FVA convierte la revisión de demanda de un concurso de opiniones en un proceso medido.

### KPI del conjunto para S&OP y MRP

| KPI | Definición | Objetivo de ejemplo (ilustrativo) | Responsable |
|---|---|---|---|
| Precisión del pronóstico (1 − WMAPE), familia, retardo 1–3 | ver arriba | ≥ 90 % | planificador de demanda |
| Sesgo del pronóstico, familia | Σ(F − A) / ΣA en 3–6 meses | dentro de ±3 % | VP de ventas |
| Cumplimiento del plan de suministro | producción real / producción planificada por familia y mes | 95–105 % | VP de operaciones |
| Adherencia al MPS | líneas del MPS completadas en la semana planificada / todas las líneas del MPS | ≥ 95 % | programador maestro |
| Estabilidad del programa | cambios del MPS dentro de la zona congelada por semana | tendencia a la baja | programador maestro |
| Servicio al cliente | entrega a tiempo y completa (OTIF) o tasa de cumplimiento por familia | por segmento | VP de ventas / cadena de suministro |
| Inventario frente al objetivo | inventario final / objetivo, o días de suministro | 90–110 % | cadena de suministro |
| Exactitud de los registros de inventario | artículos dentro de la tolerancia de conteo / artículos contados | alta 90 | almacén |
| Exactitud de las BOM | BOM verificadas como correctas / BOM auditadas | alta 90 | ingeniería |
| Carga de excepciones del MRP | mensajes de excepción por planificador por semana | tendencia a la baja | responsable de materiales |
| Órdenes planificadas vencidas | número después de cada ejecución del MRP | cercano a cero | responsable de materiales |
| Cierre del registro de decisiones | decisiones cerradas en la fecha límite / decisiones vencidas | ≥ 90 % | responsable del proceso de S&OP |

Algunas guías de MRP citan los puntos de referencia "Clase A" de Oliver Wight, como una exactitud de registros de inventario del 95 % y una exactitud de BOM del 98 % [28]. Los mismos umbrales aparecen en la literatura de programación maestra: exactitud de registros de inventario del 95 % como umbral de aceptabilidad (98 % robusto) y exactitud de BOM de al menos 98 % (99 % o más, bueno) [37]. La lista de verificación actual de Oliver Wight no estaba accesible para esta guía, por lo que la atribución a Oliver Wight sigue [unverified: la lista de verificación original no pudo consultarse]. Establezca sus propios objetivos a partir de una línea base medida.

### Vista financiera: qué aporta el S&OP al capital de trabajo

Finanzas suele plantear dos preguntas: cuánto inventario mantiene el plan y cuánto cuesta. Con el plan híbrido de la Sección 5, el inventario medio al cierre de mes es 6.300 / 6 = 1.050 escritorios. Con un costo estándar de $180 por escritorio (ilustrativo), eso equivale a $189.000 inmovilizados en promedio. El plan de nivelación mantiene 8.600 / 6 = 1.433 escritorios, o $258.000. Con una tasa de costo de mantenimiento del 20 % anual (ilustrativa; use la tasa de su empresa), la diferencia de $69.000 en inventario medio cuesta unos $13.800 al año. Estas cifras deben incluirse en el documento de decisión previo al S&OP junto con los efectos en el servicio y la capacidad.

## Hoja de ruta de implementación: 12 meses hasta un S&OP y un MRP operativos

| Fase | Meses | Actividades principales | Criterios de salida |
|---|---|---|---|
| 0. Evaluar | 0–1 | autoevaluación de madurez (Sección 7), inventario de datos, entrevistas, compromiso del patrocinador | patrocinador designado, alcance acordado, KPI base medidos |
| 1. Diseñar | 1–2 | familias de productos, recursos clave, lista de recursos, calendario, derechos de decisión, definiciones de KPI, plantillas | documento de diseño firmado por el patrocinador |
| 2. Base de datos | 1–4 (en paralelo) | exactitud de inventario (recuento cíclico), auditoría de BOM incluida la vigencia de cambios de ingeniería, revisión de tiempos de entrega, reglas de MPS y ventanas de congelación en el ERP | exactitud de inventario y de BOM medida y en mejora; tiempos de entrega revisados para el 80% superior del valor |
| 3. Primeros ciclos | 3–5 | ejecutar el ciclo de cinco pasos con hojas de cálculo; tres ciclos consecutivos con asistencia de la dirección | tres ciclos completados a tiempo, registro de decisiones en uso |
| 4. Conectar con MPS y MRP | 4–7 | reglas de desagregación, MPS conciliado con el S&OP, RCCP en recursos clave, disciplina de excepciones del MRP | MPS dentro de la tolerancia del S&OP; órdenes planificadas vencidas en descenso |
| 5. Medir y mejorar | 6–9 | exactitud y sesgo de la previsión, FVA, cumplimiento del plan; causas raíz de los incumplimientos; reglas de nerviosismo | KPI informados mensualmente; al menos un cambio de proceso basado en resultados de FVA |
| 6. Ampliar | 9–12 | integración financiera (dirección IBP), escenarios, reunión semanal de S&OE, evaluación de herramientas si las hojas de cálculo limitan el proceso | plan en unidades y dólares; S&OE en funcionamiento; decisión sobre la herramienta tomada con evidencias |

**Notas prácticas**

- **Empiece con hojas de cálculo.** Una herramienta no puede arreglar un proceso que aún no existe. La mayoría de las empresas comprenden lo que necesitan del software solo después de tres a seis ciclos.
- **Piloto en una unidad de negocio o planta.** Un S&OP en cinco plantas y veinte familias desde el primer día rara vez sobrevive al segundo mes.
- **El trabajo con datos se realiza en paralelo.** Las decisiones de S&OP solo son tan buenas como el MPS y el MRP que están por debajo; la exactitud del inventario y de la BOM determina si la salida del MRP puede ser confiable.
- **Calidad y control de configuración.** En entornos regulados o certificados (aeroespacial, automoción, médico), los cambios de BOM también son un asunto del sistema de calidad: un cambio de ingeniería debe llegar a la BOM del MRP con la fecha de vigencia correcta, o el MRP pedirá piezas de una revisión sustituida. Involucre al responsable de calidad en la auditoría de la BOM; la [guía de planificación de producción aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/) cubre la gestión de la configuración.
- **Gestión del cambio.** Los equipos de ventas temen que se les exija cumplir una previsión; las plantas temen que se les culpe por una capacidad que nunca tuvieron. Haga visible el sesgo sin culpar a las personas y reconozca las decisiones tomadas a tiempo.
- **Formación.** Los planificadores y los programadores maestros se benefician de una formación estructurada en los fundamentos de la MPC; el programa CPIM de la ASCM es la credencial común en Estados Unidos [24].

## Errores comunes

| Error | Síntoma | Solución |
|---|---|---|
| S&OP como reunión de informes | 40 diapositivas, sin decisiones | documentos de decisión con opciones; registro de decisiones |
| Los directivos no asisten a la reunión | los delegados no pueden decidir; los problemas se arrastran | asistencia del patrocinador como norma; agenda más corta y centrada en decisiones |
| Previsión = objetivo de ventas | sobreprevisión sistemática, inventario creciente | separar objetivo y previsión; medir el sesgo |
| S&OP a nivel de SKU | cientos de líneas, sin tiempo para decidir | familias para S&OP, SKU para el MPS |
| Sin finanzas en la sala | el plan en unidades no coincide con el presupuesto | socio de finanzas en el pre-S&OP; plan en unidades y dólares |
| MPS no conciliado con S&OP | la planta sigue un plan distinto | regla de desagregación y control de tolerancia cada mes |
| MPS sobrecargado | pedidos atrasados tras cada ejecución de MRP | RCCP en recursos clave; MPS con la capacidad demostrada |
| Tiempos de entrega planificados nunca revisados | lanzamientos anticipados o tardíos, WIP inflado | revisión trimestral de los tiempos de entrega; ver síndrome del tiempo de entrega [26] |
| Datos incorrectos de inventario y BOM | urgencias, faltantes pese a stock "disponible" | recuento cíclico, auditorías de BOM, proceso de cambios de ingeniería |
| Reaccionar a cada mensaje de excepción | nerviosismo, agotamiento de los planificadores | ventanas de tiempo, órdenes planificadas firmes, umbrales de amortiguación [10] |
| Comprar software primero | herramienta costosa, mismas discusiones | primero entre tres y seis ciclos manuales |
| Ignorar el cuello de botella | plan viable en promedio, inviable en meses pico | revisar la carga del recurso clave en cada revisión de suministro; ver [teoría de restricciones](https://www.m365.fm/en/learn/theory-of-constraints/) |

## Límites de S&OP y MRP

**S&OP es un proceso mensual en un mundo que cambia semanalmente.** Un plan aprobado el día 15 puede quedar obsoleto el día 25. S&OE y las actualizaciones de S&OP dirigidas por eventos abordan esto, pero requieren disciplina para no replanificar todo cada semana.

**La agregación oculta problemas.** Un plan de familia puede ser viable mientras una variante concreta carece de un componente específico. Por eso importan el MPS y el MRP por debajo de S&OP, y por eso las definiciones de familia deben agrupar artículos que comparten recursos.

**MRP es determinista; la realidad no lo es.** MRP trata previsiones, tiempos de entrega y rendimientos como números fijos [8]. El stock de seguridad y el tiempo de seguridad cubren parte de la variación, pero MRP no puede representar la incertidumbre de forma explícita. DDMRP, los modelos estocásticos y la simulación (ver [simulación de fabricación](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)) lo abordan desde distintos enfoques.

**MRP planifica con capacidad infinita.** MRP y CRP muestran las sobrecargas pero no las resuelven [8][9]. La programación finita y APS cubren esa brecha a nivel operativo.

**MRP fija tiempos de entrega que en realidad dependen de la carga.** Los tiempos de entrega planificados son entradas para MRP, pero resultados de la carga de trabajo del taller. El síndrome del tiempo de entrega muestra lo que ocurre cuando los planificadores los tratan como palancas [26].

**Dependencia de los datos.** MRP amplifica los errores de datos: una cantidad por unidad incorrecta en una BOM de nivel 2 se multiplica en cada padre. Ningún algoritmo compensa registros de inventario erróneos.

**Cultura.** La literatura académica incluye las barreras organizativas, como los silos funcionales y la falta de compromiso de la dirección, entre las principales razones por las que las iniciativas de S&OP se estancan [1]. El software no las elimina.

**No todos los negocios necesitan la pila completa.** Un taller de pedidos con plazos cortos y pedidos mayoritariamente específicos de cliente puede necesitar más una buena captación de pedidos y programación finita que un S&OP a 24 meses. Un distribuidor puede necesitar más DRP que MRP. Ajuste el método al negocio.

## IA y planificación digital: lo que funciona hoy

Los proveedores de software de planificación y de ERP comercializan ahora la previsión con aprendizaje automático, la "detección de demanda" (demand sensing), los agentes de planificación y los copilotos. Para una planta, las preguntas útiles son qué decisión de planificación mejora y cómo se mide la mejora.

| Aplicación | Qué hace | Dónde ayuda | Qué revisar |
|---|---|---|---|
| Previsión con aprendizaje automático | utiliza muchos factores (precio, promociones, clima, pedidos) además del histórico | muchos SKU con factores de demanda conocidos | medir el FVA frente a una línea base estadística sencilla; el ML a menudo la supera en algunas familias y no en otras |
| Detección de demanda a corto plazo | ajusta la previsión a corto plazo con pedidos recientes y datos de punto de venta | bienes de consumo, distribución | solo es útil si el MPS y el S&OE pueden actuar sobre cambios semanales |
| Planificación de escenarios y recálculo rápido | recalcula los efectos de una decisión en la demanda, la capacidad y los materiales | revisión de suministro, pre-S&OP | tiempo de cálculo, latencia de datos, quién puede ejecutar escenarios [16] |
| Ajuste de parámetros | sugiere plazos de entrega, stocks de seguridad, tamaños de lote y factores de buffer DDMRP a partir de datos reales | mantenimiento de datos maestros de MRP | revisión del planificador antes de los cambios; registro de auditoría |
| Priorización de excepciones | ordena los mensajes de excepción de MRP según su impacto en los pedidos de clientes | planificación de materiales | tasa de aceptación de las recomendaciones; tiempo ahorrado |
| Asistentes de IA generativa | resumen los paquetes de S&OP, redactan documentos de decisión y responden a "¿por qué cambió el plan?" a partir de los datos de planificación | preparación de reuniones | las respuestas deben citar los datos utilizados; sin cambios autónomos del plan sin aprobación |
| Gemelo digital y simulación | prueba opciones de capacidad, buffer y distribución antes de decidir | revisión de suministro para inversiones en capacidad | validación del modelo frente al rendimiento real; ver la [guía de gemelos digitales](https://www.m365.fm/en/learn/digital-twin-manufacturing/) |

Cuatro reglas mantienen útil la IA en la planificación:

1. **Corrija primero el proceso.** Una previsión de IA introducida en un proceso sin revisión de demanda, sin medición de sesgo y sin derechos de decisión produce confusión más rápida.
2. **Mida el valor añadido.** Trate cada modelo como cualquier otro paso de previsión y siga su FVA (Sección 16).
3. **Mantenga a las personas responsables de las decisiones.** Las decisiones de S&OP implican dinero, personas y clientes. Las herramientas pueden preparar opciones; el equipo directivo decide.
4. **Base de datos antes que modelos.** La mayoría de los proyectos de planificación con IA se estancan por la calidad del histórico, los datos maestros y la integración, no por los algoritmos. En entornos Microsoft, las decisiones de plataforma como Fabric y Power BI se tratan en la [guía de Azure para fabricación](https://www.m365.fm/en/learn/manufacturing-it-azure/) [31][32].

### Una configuración realista de Microsoft 365 para S&OP

| Elemento | Herramienta | Notas |
|---|---|---|
| Calendario y reuniones | Outlook, Teams | series recurrentes para los cinco pasos, reservadas con 12 meses de antelación |
| Paquete de KPI | informe de Power BI a partir de datos de ERP y planificación | una página por familia; mismo diseño cada mes |
| Planes de familia y escenarios | Excel (primeros ciclos), más adelante una herramienta de planificación | control de versiones: un archivo por ciclo, de solo lectura tras la aprobación |
| Supuestos y registros de decisiones | Microsoft Lists o una lista de SharePoint | responsable, fecha límite, estado; vinculados en la agenda ejecutiva |
| Documentos de decisión | Word o páginas de Loop, una página por decisión | opciones, impacto, recomendación |
| Apoyo a la preparación | resúmenes de Copilot del paquete de KPI y los registros | revisados por el responsable del proceso antes de su distribución |

## Glosario

| Término | Definición |
|---|---|
| Planificación agregada | planificación de tasas de producción, plantilla e inventario por familias de productos a medio plazo; el origen del S&OP [1] |
| Disponible para prometer (ATP) | la parte no comprometida del suministro planificado que puede prometerse a nuevos pedidos de clientes (Sección 8) |
| Lista de materiales (BOM) | lista de componentes, cantidades y estructura necesarios para fabricar un artículo padre |
| Lista de recursos | horas por unidad de un producto o familia en cada recurso clave; se usa en la planificación de recursos del S&OP y en RCCP |
| Planificación de necesidades de capacidad (CRP) | cálculo detallado de la carga por centro de trabajo a partir de las órdenes de MRP y las rutas, con capacidad infinita [8] |
| Tiempo de entrega acumulado | la ruta más larga de tiempos de entrega a través de la BOM, desde la compra del primer material hasta la terminación del artículo final |
| Punto de desacoplamiento | posición en la BOM o en la cadena de suministro donde un buffer de DDMRP separa la variabilidad del suministro de la de la demanda [11] |
| Horizonte de demanda firme | límite del MPS dentro del cual solo cuentan como demanda los pedidos de clientes, no el pronóstico |
| Demanda dependiente | demanda calculada a partir de la demanda de un artículo padre, a diferencia de la demanda independiente (pronóstico) [13] |
| DDMRP | planificación de necesidades de materiales impulsada por la demanda: buffers en los puntos de desacoplamiento, dimensionados por zonas y reabastecidos mediante la ecuación de flujo neto [11][12] |
| Mensaje de excepción | recomendación de MRP para lanzar, reprogramar o cancelar una orden |
| Orden planificada en firme | orden planificada que el planificador fija para que MRP no la cambie automáticamente |
| Sesgo del pronóstico | sobrepronóstico o infrapronóstico sistemático; Σ(F − A) / ΣA |
| Valor añadido del pronóstico (FVA) | cambio en el error de pronóstico provocado por una etapa del proceso de previsión |
| Requerimientos brutos | demanda total de un artículo en un periodo antes de la compensación |
| Planificación empresarial integrada (IBP) | término de Oliver Wight para una extensión a toda la empresa del S&OP, que incluye cartera y finanzas, con un horizonte de al menos 24 meses [2] |
| Código de nivel bajo | el nivel más bajo de la BOM en el que aparece un artículo; determina la secuencia de procesamiento de MRP [8] |
| Lote a lote | regla de dimensionamiento de lotes que ordena exactamente el requerimiento neto de cada periodo [8] |
| MAPE / WMAPE | error porcentual absoluto medio / MAPE ponderado (Sección 16) |
| Plan maestro de producción (MPS) | declaración de lo que la empresa espera producir por artículo final y periodo, basada en el plan táctico [7] |
| MRP | planificación de necesidades de materiales: cálculo por fases temporales de los requerimientos netos de todos los componentes a partir del MPS, la BOM y el inventario [7] |
| MRP II | planificación de recursos de fabricación: MRP más S&OP, MPS, RCCP, CRP, control de piso de taller e integración financiera [3] |
| Posición de flujo neto | DDMRP: disponible en stock + pendiente de recibir − demanda cualificada [14] |
| Nerviosismo | cambios frecuentes o grandes en las órdenes planificadas causados por pequeños cambios en los datos de entrada [8][10] |
| Requerimientos netos | requerimientos brutos menos inventario disponible y recepciones programadas, más stock de seguridad cuando proceda |
| Trazabilidad (pegging) | vínculo entre un requerimiento y su demanda de origen |
| Fecha de liberación de orden planificada | fecha y cantidad en que debe liberarse una orden planificada, desplazada por el tiempo de entrega desde su recepción |
| Horizonte de planificación en firme | límite a partir del cual el sistema de planificación puede crear o cambiar órdenes automáticamente |
| Saldo disponible proyectado (PAB) | inventario previsto al final de un periodo en el MPS |
| Planificación aproximada de capacidad (RCCP) | comprobación del MPS frente a los recursos clave mediante las listas de recursos |
| S&OE | ejecución de ventas y operaciones: proceso semanal para ejecutar el plan de S&OP a corto plazo |
| Planificación de ventas y operaciones (S&OP) | proceso mensual transversal que integra los planes de demanda y de suministro por familia, en unidades y en dólares [1] |
| Recepción programada | orden de producción o de compra abierta con fecha de vencimiento |
| Señal de seguimiento | error de pronóstico acumulado dividido entre MAD; indica sesgo |

## Preguntas frecuentes: planificación de ventas y operaciones y MRP

### ¿Qué es la planificación de ventas y operaciones en términos sencillos?

El S&OP es un ciclo de reuniones mensual en el que ventas, operaciones, cadena de suministro y finanzas acuerdan un único plan sobre lo que la empresa venderá, fabricará y almacenará en los próximos 18 a 36 meses, por familia de productos [1][5]. El equipo directivo lo utiliza para tomar decisiones de compensación, como añadir un turno o acumular inventario antes de una parada.

### ¿Cuáles son los pasos del proceso de S&OP?

Los cinco pasos habituales son la recopilación de datos, la revisión de la demanda, la revisión del suministro, el pre-S&OP (conciliación) y la reunión ejecutiva de S&OP [1][20]. Algunas empresas añaden una revisión de productos o de cartera al inicio; Anaplan, por ejemplo, enumera revisiones de producto, demanda, suministro, finanzas, pre-S&OP y ejecutiva [15].

### ¿Con qué frecuencia debe realizarse el S&OP?

Mensualmente, con un calendario fijo [1][5]; Anaplan, por ejemplo, describe ciclos mensuales con contactos semanales para los participantes clave [15]. Una reunión semanal de S&OE gestiona los cambios a corto plazo entre ciclos, y los eventos importantes (un pedido grande, una parada de planta) pueden desencadenar una revisión adicional.

### ¿Quién debe asistir a la reunión ejecutiva de S&OP?

El director general o el presidente de la unidad de negocio como presidente, junto con los responsables de ventas, marketing, operaciones, cadena de suministro y finanzas, y de gestión de productos o ingeniería cuando las decisiones de cartera figuran en el orden del día. El responsable del proceso de S&OP lo prepara y lo documenta.

### ¿Cuál es la diferencia entre S&OP e IBP?

El IBP amplía el S&OP desde el equilibrio entre demanda y suministro hasta el plan empresarial completo, incluyendo cartera, estrategia y finanzas, con un horizonte de al menos 24 meses [2]. Oliver Wight desarrolló el S&OP en la década de 1980 y acuñó el término IBP a comienzos de los años 2000 [2].

### ¿Cuál es la diferencia entre S&OP y MRP?

El S&OP decide los volúmenes por familia de productos y mes, entre funciones. El MRP calcula, para cada componente, cuántos comprar o fabricar y cuándo, a partir del programa maestro de producción, las listas de materiales y el inventario [7]. El S&OP fija el marco; el MRP lo ejecuta a nivel de pieza.

### ¿Cuál es la diferencia entre MPS y MRP?

El MPS planifica los productos terminados (o los artículos de planificación) por semana; el MRP desglosa el MPS a través de las listas de materiales para planificar componentes y materiales [7]. Ambos usan la misma lógica de compensación, pero el MPS lo fija un planificador maestro y el MRP lo calcula el sistema.

### ¿Cómo funciona el MRP?

Para cada artículo, nivel por nivel: se toman las necesidades brutas, se restan el inventario disponible y las recepciones programadas, se aplica el stock de seguridad para obtener las necesidades netas, se dimensionan los lotes, se desfasan según el plazo de entrega para obtener las órdenes planificadas y se trasladan como necesidades brutas de los componentes [8]. La sección 10 muestra un ejemplo completo resuelto.

### ¿Cuáles son las entradas del MRP?

El programa maestro de producción, las listas de materiales, los registros de inventario (disponible, stock de seguridad), los pedidos abiertos (recepciones programadas) y los datos de planificación de artículos (plazos de entrega, reglas de tamaño de lote) [7][8].

### ¿Cuál es la diferencia entre MRP y MRP II?

El MRP calcula las necesidades de materiales. El MRP II, definido por Oliver Wight en 1983, añade el S&OP, la programación maestra, la planificación de capacidad aproximada y detallada, el control de piso de fábrica y el vínculo con la planificación financiera [3].

### ¿Cuál es la diferencia entre MRP y ERP?

El MRP es un método de planificación y un módulo del ERP. El ERP es un sistema integrado para finanzas, ventas, compras, recursos humanos y fabricación, con el MRP como núcleo de planificación de materiales. Gartner acuñó el término ERP en 1990 [4].

### ¿Qué es el DDMRP?

El MRP impulsado por la demanda coloca colchones de inventario en puntos de desacoplamiento seleccionados, los dimensiona en zonas roja, amarilla y verde a partir del consumo medio diario y del plazo de entrega, y los reabastece con la ecuación de flujo neto (disponible + pedido − demanda calificada) [11][12][14]. Está diseñado para reducir la dependencia de las previsiones y la inestabilidad del MRP clásico; la evidencia independiente sobre sus resultados todavía es limitada.

### ¿Qué es el disponible para prometer?

El ATP es la parte del suministro planificado que aún no está comprometida con pedidos de clientes y puede prometerse a nuevos pedidos. En el ejemplo de la sección 8, un cliente que pide 100 unidades para la semana 2 puede recibir 60 de inmediato y el resto desde la semana 4.

### ¿Qué KPI miden el éxito del S&OP?

La precisión de la previsión (1 − WMAPE) y el sesgo a nivel de familia, el cumplimiento del plan de suministro, la adherencia al MPS, el servicio al cliente (OTIF o tasa de cumplimiento), el inventario o la cartera de pedientes frente al objetivo, y la tasa de cierre de decisiones. La sección 16 incluye fórmulas y un ejemplo resuelto.

### ¿Cómo se calcula la precisión del pronóstico?

Una fórmula habitual es 1 − WMAPE, donde WMAPE = Σ|pronóstico − real| / Σ real. Con errores absolutos de 1.350 unidades sobre una demanda real de 21.550, el WMAPE es 6,26 % y la precisión del pronóstico 93,7 %. Informe siempre el sesgo junto con ella.

### ¿Por qué fallan los procesos de S&OP?

Las razones habituales son la falta de participación de la dirección, un pronóstico que en realidad es un objetivo de ventas, la ausencia de finanzas, demasiado detalle (SKU en lugar de familias), ningún vínculo con el MPS y la compra de software antes de que el proceso funcione. La sección 18 recoge las soluciones.

### ¿Puede un fabricante pequeño hacer S&OP sin software especializado?

Sí. Una empresa con unas pocas familias de productos puede ejecutar S&OP con extractos del ERP, Excel y un registro compartido de decisiones. El software se vuelve rentable cuando la conciliación entre familias y SKU, los escenarios o la preparación de datos consumen más tiempo que las decisiones.

### ¿Qué es la nerviosidad del MRP?

La nerviosidad es la tendencia de los planes MRP a cambiar con frecuencia cuando los datos de entrada varían ligeramente. En el ejemplo de la sección 12, 30 escritorios adicionales modificaron las órdenes en dos niveles inferiores de la lista de materiales. Las ventanas de tiempo, las órdenes planificadas firmes y las reglas de coste de cambio la reducen [10].

### ¿Cuáles son los beneficios del S&OP?

El S&OP sustituye las cifras separadas de ventas, producción y finanzas por un único plan acordado por familia de productos. Las decisiones que trasladan coste de una función a otra, como un segundo turno, una prefabricación o la eliminación de una variante, las toman las personas que son responsables tanto del coste como del beneficio (sección 1). El MPS y el MRP reciben un plan que ya ha sido verificado frente a la capacidad, de modo que se necesitan menos pedidos urgentes después. Finanzas ve el efecto sobre el capital circulante antes de que se produzca: en el ejemplo ilustrativo de la sección 16, el plan híbrido mantiene de media unos 380 escritorios menos que el plan de nivelación, lo que equivale a unos 13.800 $ al año en coste de mantenimiento. Los porcentajes de beneficio publicados por proveedores y encuestas varían mucho, así que mida su propia línea base antes del primer ciclo.

### ¿Cuáles son las salidas del MRP?

Para cada artículo fabricado o comprado, el MRP produce recepciones de órdenes planificadas y liberaciones de órdenes planificadas con fechas, desfasadas según el plazo de entrega [8]. También genera mensajes de excepción para las órdenes abiertas (liberar, reprogramar hacia adelante, reprogramar hacia atrás, cancelar, vencida, por debajo del stock de seguridad) y el pegging, que vincula cada necesidad con su artículo padre y con el pedido del cliente. La sección 10 muestra las tres con un ejemplo práctico.

### ¿Cuál es la diferencia entre MRP y JIT?

El MRP es un cálculo de planificación: despliega el programa maestro de producción a través de las listas de materiales y crea órdenes con fecha antes de que surja la necesidad. El just-in-time (JIT) es un enfoque de producción lean que reabastece según el consumo real, normalmente con señales kanban, y busca lotes pequeños y bajo inventario. Ambos no son excluyentes. Muchas plantas usan MRP para piezas de plazo largo, caras y de demanda irregular, y kanban para piezas de rotación rápida en línea (sección 10). La [guía de kanban y sistema pull](https://www.m365.fm/en/learn/kanban-pull-system/) cubre el lado pull.

## Conclusión y primeros pasos

La planificación de ventas y operaciones (S&OP) y el MRP resuelven el mismo problema en dos niveles. El S&OP permite que el equipo directivo decida, una vez al mes, cuánto vender, fabricar y almacenar por familia, y cuánto cuesta. El programa maestro de producción (MPS) convierte esa decisión en productos terminados por semana, la planificación de capacidad aproximada (RCCP) la contrasta con el cuello de botella, y el MRP calcula qué necesita cada componente y cuándo. Cada nivel necesita que el superior sea realista y que el inferior se ejecute. La programación detallada y el piso de planta completan la cadena.

Los métodos son antiguos (Orlicky formalizó el MRP en 1964, Oliver Wight dio forma al S&OP en los años ochenta) y siguen siendo la columna vertebral de la planificación en los ERP [2][3][4]. Sus debilidades son conocidas: capacidad infinita, plazos de entrega fijos, nerviosismo y dependencia de los datos. Los fences de tiempo, el RCCP, los buffers del DDMRP y la programación finita las abordan. Las herramientas de IA pueden acelerar la previsión y el trabajo con escenarios, pero solo donde el proceso, los datos y los derechos de decisión ya estén establecidos.

**Sus primeros pasos en los próximos 30 días**

- [ ] Definir de 5 a 15 familias de productos y de 3 a 8 recursos clave con su capacidad mensual demostrada
- [ ] Extraer 24 meses de envíos y pedidos por familia y medir la precisión de la previsión (1 − WMAPE) y el sesgo de los últimos 6 meses
- [ ] Comprobar si la suma de su MPS por familia coincide con su plan actual de ventas y producción
- [ ] Ejecutar su MRP y contar las órdenes planificadas vencidas y los mensajes de excepción por planificador; esa es su línea base de nerviosismo
- [ ] Auditar la exactitud del inventario para los 50 artículos principales por valor y la exactitud de las listas de materiales (BOM) para los 10 productos terminados principales
- [ ] Reservar el calendario de cinco pasos del S&OP para los próximos 12 meses y designar un patrocinador ejecutivo y un responsable del proceso
- [ ] Ejecutar el primer ciclo en hojas de cálculo con las plantillas de la Sección 15 e iniciar el registro de decisiones en la primera reunión ejecutiva

---

## Lecturas adicionales en m365.fm

**Guías de esta ruta de aprendizaje**
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/): programación detallada, debilidades del MRP, síndrome del plazo de entrega, capacidad finita
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/): flujo tirado, heijunka, kanban como alternativa a la planificación empujada
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/): OEE, entrega a tiempo, medidas de inventario
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/): pruebas de escenarios para decisiones de capacidad
- [Azure for Manufacturing](https://www.m365.fm/en/learn/manufacturing-it-azure/): integración de ERP, MES y plataforma de datos
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/): planificación en entornos de ingeniería bajo pedido y de plazos largos
- [Operational Excellence](https://www.m365.fm/en/learn/operational-excellence/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/): cuellos de botella y drum-buffer-rope
- [Kanban and Pull Systems](https://www.m365.fm/en/learn/kanban-pull-system/)
- [MES and ISA-95](https://www.m365.fm/en/learn/mes-isa-95/)

**Análisis en profundidad**
- [Lot Sizing: EOQ, EPQ and MRP Lot-Sizing Rules](https://www.m365.fm/en/learn/production-scheduling-aps/lot-sizing/)
- [Manufacturing Inventory Management and Safety Stock](https://www.m365.fm/en/learn/production-scheduling-aps/manufacturing-inventory-management/)
- [Intralogistics and In-Plant Material Flow](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Supply Chain Resilience](https://www.m365.fm/en/learn/operational-excellence/supply-chain-resilience/)
- [Manufacturing Simulation](https://www.m365.fm/en/learn/digital-twin-manufacturing/manufacturing-simulation/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** es el presentador de m365.fm y trabaja en iFAKT GmbH. En m365.fm escribe sobre producción ajustada, planificación de la producción y la transformación digital de la fabricación, con un enfoque en cómo los procesos de planificación, los modelos de cadena de valor, la simulación y el análisis de KPIs funcionan juntos en la práctica.

**Nota: El autor trabaja en iFAKT GmbH.**

# Sources

All online sources accessed November 20, 2026. Sources marked "via sibling pillar" were opened and verified on the same date for the m365.fm guide on production scheduling and APS or the Azure for manufacturing guide and are reused with their verified bibliographic data.

1. Sales and operations planning (history incl. aggregate production planning and Richard "Dick" Ling; definitions; five process steps after Wagner et al. 2014; tactical horizon up to 18 months; maturity models after Grimson and Pyke 2007 and Wagner et al. 2014; enablers and barriers). Wikipedia. https://en.wikipedia.org/wiki/Sales_and_operations_planning
2. What Is the Difference Between S&OP and IBP? Oliver Wight Americas (blog). https://www.oliverwight-americas.com/blog/difference-between-sop-and-ibp/
3. Material requirements planning (Rolls-Royce and GE in the early 1950s; Orlicky 1964; Black & Decker 1964 with Dick Alban; about 700 users by 1975 and about 8,000 by 1981; Oliver Wight's MRP II 1983). Wikipedia. https://en.wikipedia.org/wiki/Material_requirements_planning
4. Material requirements planning (MRP), definition and history (Harris 1913; Orlicky at IBM 1964; Plossl and Wight 1967; Orlicky's book 1975; Wight's MRP II 1983; Gartner coins ERP 1990; third edition by Ptak and Smith 2011 with DDMRP; re-checked in review round 3). TechTarget. https://www.techtarget.com/searcherp/definition/material-requirements-planning-MRP
5. What is sales and operations planning (S&OP)? (monthly cadence, rolling 18–36 month horizon; page within SAP's Integrated Business Planning section). SAP. https://www.sap.com/resources/sop-sales-and-operations-planning and https://www.sap.com/products/scm/integrated-business-planning/what-is-supply-chain-planning/sop-sales-operations.html
6. Sales and Operations Planning (S&OP): Process, Challenges, and Expert Tips (18–36 month horizon; level, chase and mixed strategies). Smartsheet. https://www.smartsheet.com/sales-operations-planning-101
7. Master Production Scheduling and Material Requirements Planning (definitions of MPS and MRP; ATP and cumulative ATP as outputs). Oracle JD Edwards EnterpriseOne Applications Requirements Planning Implementation Guide, release 9.2. https://docs.oracle.com/en/applications/jd-edwards/supply-chain-manufacturing/9.2/eoarp/master-production-scheduling-and-material-requirements-planning.html
8. Gershwin, Stanley B.: Material Requirements Planning (MRP) and MRP II, lecture slides, MIT 2.854 Introduction to Manufacturing Systems, Fall 2016 (based on Hopp and Spearman, Factory Physics). MIT OpenCourseWare. https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/4eec617bb52d64f4ea1bed6d9905bc00_MIT2_854F16_MatrialRequire.pdf
9. Hopp, Wallace J.; Spearman, Mark L.: Factory Physics. 3rd ed., Waveland Press, Long Grove (IL) 2008, ISBN 978-1-57766-739-1. Catalog record: https://search.worldcat.org/oclc/718450337 (via sibling pillar)
10. Blackburn, Joseph D.; Kropp, Dean H.; Millen, Robert A.: A Comparison of Strategies to Dampen Nervousness in MRP Systems. Management Science 32 (1986) 4, pp. 413–429. DOI: 10.1287/mnsc.32.4.413. Record: https://ideas.repec.org/a/inm/ormnsc/v32y1986i4p413-429.html
11. Demand Driven Material Requirements Planning (DDMRP) overview. Dynamics 365 Supply Chain Management, Microsoft Learn. https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/ddmrp-overview
12. Buffer profile and levels (DDMRP zone formulas, lead time and variability factor ranges, worked example). Dynamics 365 Supply Chain Management, Microsoft Learn. https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/planning-optimization/ddmrp-buffer-profile-and-levels
13. Orlicky, Joseph: Material Requirements Planning. The New Way of Life in Production and Inventory Management. McGraw-Hill, New York 1975. (via sibling pillar; original not consulted)
14. The five steps of DDMRP (net flow equation, buffer zones). IFS blog. https://blog.ifs.com/the-five-steps-of-ddmrp/ ; DDMRP in IFS Cloud documentation: https://docs.ifs.com/ifsclouddocs/24r2/Planning/AboutDDMRP.htm
15. The ultimate guide to the sales and operations planning (S&OP) process (six reviews; deployment guidance of 8–12 weeks). Anaplan (vendor), July 24, 2023. https://anaplan.com/blog/the-myths-of-sop
16. What is sales and operations planning (S&OP)? (traditional monthly cycle with five stages; concurrent planning, vendor claim). Kinaxis (vendor), published January 6, 2023, modified December 3, 2025. https://www.kinaxis.com/en/sop
17. Supply Chain S&OP: Process Improvement (five levels of S&OP maturity). Gartner. https://www.gartner.com/en/supply-chain/trends/supply-chain-sop
18. The 5 S&OP maturity levels (secondary description of the Gartner S&OP maturity model). Jedox (planning software vendor). https://jedox.com/en/blog/5-sop-maturity-levels
19. Grimson, J. Andrew; Pyke, David F.: Sales and operations planning: an exploratory study and framework. The International Journal of Logistics Management 18 (2007) 3, pp. 322–346. DOI: 10.1108/09574090710835093 (bibliographic data confirmed via Crossref, November 20, 2026; full text not consulted)
20. Wagner, Stephan M.; Ullrich, Kristoph K. R.; Transchel, Sandra: The game plan for aligning the organization. Business Horizons 57 (2014) 2, pp. 189–201. DOI: 10.1016/j.bushor.2013.11.002 (bibliographic data confirmed via Crossref, November 20, 2026; full text not consulted)
21. Oliva, Rogelio; Watson, Noel: Cross-functional alignment in supply chain planning: A case study of sales and operations planning. Journal of Operations Management 29 (2011) 5, pp. 434–448. DOI: 10.1016/j.jom.2010.11.012 (bibliographic data confirmed via Crossref, November 20, 2026; key finding via Wikipedia [1]; full text not consulted)
22. Tavares Thomé, António Márcio; Scavarda, Luiz Felipe; Fernandez, Nicole Suclla; Scavarda, Annibal José: Sales and operations planning: A research synthesis. International Journal of Production Economics 138 (2012) 1, pp. 1–13. DOI: 10.1016/j.ijpe.2011.11.027 (DOI resolution to Elsevier record S0925527311004907 confirmed; bibliographic data and author list confirmed via Crossref, November 20, 2026; full text not consulted)
23. Tavares Thomé, António Márcio; Scavarda, Luiz Felipe; Fernandez, Nicole Suclla; Scavarda, Annibal José: Sales and operations planning and the firm performance. International Journal of Productivity and Performance Management 61 (2012) 4, pp. 359–381. DOI: 10.1108/17410401211212643 (bibliographic data and author list confirmed via Crossref, November 20, 2026; full text not consulted)
24. ASCM (Association for Supply Chain Management): APICS Certified in Planning and Inventory Management (CPIM), 2026 certification brochure. https://www.ascm.org/globalassets/ascm_website_assets/docs/credentials/2026-certification_brochures_cpim.pdf (via sibling pillar)
25. ANSI/ISA-95.00.03-2013: Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management. International Society of Automation, preview. https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf (via sibling pillar)
26. Thürer, Matthias; Fernandes, Nuno O.; Haeussler, Stefan; Stevenson, Mark: Dynamic planned lead times in production planning and control systems: does the lead time syndrome matter? International Journal of Production Research 61 (2023) 4, pp. 1268–1282. DOI: 10.1080/00207543.2022.2034193 (via sibling pillar)
27. What is material requirements planning (MRP)? (MRP vs. ERP; FAQ topics incl. MRP II, MPS, DDMRP, predictive MRP, APS). SAP. https://www.sap.com/products/erp/what-is-mrp.html
28. Material requirements planning (MRP) in manufacturing: A complete guide (cites Oliver Wight/APICS Class A benchmarks without link). Zoho Inventory Academy. https://www.zoho.com/inventory/academy/inventory-management/what-is-materials-requirement-planning-mrp-in-manufacturing.html
29. Best S&OP Software in 2026: Sales & Operations Planning Buyer's Guide (vendor list; written by Board, one of the listed vendors). Board International. https://www.board.com/guide/best-sop-software
30. Kinaxis Inc.: New Research Finds 83% of Supply Chains Can't Respond to Disruptions in 24 Hours (IDC research commissioned by Kinaxis), press release, April 16, 2024. https://investors.kinaxis.com/news-releases/news-release-details/2024/New-Research-Finds-83-of-Supply-Chains-Cant-Respond-to-Disruptions-in-24-Hours (via sibling pillar)
31. What is Microsoft for Manufacturing? Microsoft Learn. https://learn.microsoft.com/en-us/industry/manufacturing/overview (via sibling pillar)
32. Link your Dataverse environment to Microsoft Fabric. Power Apps, Microsoft Learn. https://learn.microsoft.com/en-us/power-apps/maker/data-platform/azure-synapse-link-view-in-fabric (via sibling pillar)
33. Overview of Sales and Operations Planning. Oracle Fusion Cloud SCM documentation. https://docs.oracle.com/en/cloud/saas/supply-chain-and-manufacturing/23d/fasop/overview-of-sales-and-operations-planning.html (existence of the product confirmed from the documentation title in search results; page content not fetched)
34. Kristensen, Jesper; Jonsson, Patrik: Context-based sales and operations planning (S&OP) research: A literature review and future agenda. International Journal of Physical Distribution & Logistics Management 48 (2018) 1, pp. 19–46. DOI: 10.1108/IJPDLM-11-2017-0352. https://www.emerald.com/insight/content/doi/10.1108/IJPDLM-11-2017-0352/full/html
35. About the Demand Driven Institute (founded in 2011 by Carol Ptak and Chad Smith; software compliance certification free of charge to vendors; professional endorsement certificates). Demand Driven Institute. https://demanddriveninstitute.com/about-us (accessed November 20, 2026)
36. Measuring Forecast Accuracy: Approaches to Forecasting: A Tutorial (tracking signal rule of thumb: between −4 and 4). Supply Chain Resource Cooperative, NC State University, January 25, 2011. https://scm.ncsu.edu/scm-articles/article/measuring-forecast-accuracy-approaches-to-forecasting-a-tutorial (accessed November 20, 2026)
37. World Class Master Scheduling: Best Practices and Lean Six Sigma Continuous Improvement, section "Data accuracy" (inventory record accuracy 95% acceptable, 98% robust; BOM accuracy 98% minimum, 99+% good). Excerpt on GlobalSpec Engineering360. https://www.globalspec.com/reference/47612/203279/data-accuracy (accessed November 20, 2026; author and publisher not shown on the excerpt page)
