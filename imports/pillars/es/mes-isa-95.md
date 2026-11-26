# SEO metadata

| Field | Value |
|---|---|
| Meta title | Sistema MES e ISA-95: guía de funciones y niveles |
| Meta description | Qué hace un sistema MES, cómo los niveles y modelos de actividad de ISA-95 lo enmarcan, MES frente a ERP y SCADA, lista de proveedores, hoja de ruta y ROI. |
| Slug | `mes-isa-95` |

# Sistema de ejecución de la fabricación (MES) e ISA-95: funciones, niveles, selección y ROI

> **Respuesta breve:** Un sistema de ejecución de fabricación (MES, por sus siglas en inglés) es la capa de software que gestiona, supervisa y registra la ejecución de las órdenes de producción en planta, en tiempo real, entre el sistema ERP que planifica y los sistemas de control que operan las máquinas [8]. ISA-95 (ANSI/ISA-95, a nivel internacional IEC 62264) es la norma que define dónde se sitúa esta capa (Nivel 3, gestión de operaciones de fabricación), qué actividades abarca y qué información intercambia con el ERP [1][3].

> **Puntos clave**
> - Gartner define el MES como software orientado a la producción que "gestiona, supervisa y sincroniza la ejecución de procesos físicos en tiempo real" y coordina las órdenes de trabajo con los sistemas de programación, ERP, PLM y calidad [8].
> - ISA-95 consta de ocho partes. La Parte 1 (modelos y terminología) fue reeditada en 2025; la Parte 3 (modelos de actividad) data de 2013 [1][2].
> - ISA-95 describe cinco niveles. Los niveles 0 a 2 corresponden al proceso físico y su control, el Nivel 3 es la gestión de operaciones de fabricación (MES y sistemas relacionados) y el Nivel 4 es la planificación empresarial y la logística (ERP) [1].
> - El modelo de actividad de la Parte 3 divide el Nivel 3 en cuatro categorías (producción, mantenimiento, prueba de calidad e inventario) y repite las mismas ocho actividades en cada una: gestión de definiciones, gestión de recursos, programación detallada, despacho, gestión de la ejecución, recopilación de datos, seguimiento y análisis de rendimiento [3].
> - El modelo de MESA International de 1997 nombró 11 funciones del MES; ISA-95 posteriormente incorporó esa visión [9][12]. MESA cesó sus operaciones el 30 de junio de 2026, y sus contenidos pasaron a ISA [11].
> - Un espacio de nombres unificado (UNS) cambia la forma en que se mueven los datos; no sustituye la lógica del MES ni el vocabulario de ISA-95.
> - El caso de negocio de un MES suele depender de una o dos líneas de beneficio. En el ejemplo práctico siguiente, el mismo proyecto tiene un VAN a cinco años positivo en el caso base y negativo en el caso conservador.
> - Empiece por el modelo de datos y por una cadena de valor, no por la lista completa de funciones.

## Índice

1. [¿Qué es un sistema de ejecución de fabricación (MES)?](#qué-es-un-sistema-de-ejecución-de-fabricación-mes)
2. [Breve historia: del AMR y el MESA-11 a ISA-95 y más allá](#breve-historia-de-amr-y-mesa-11-a-isa-95-y-más-allá)
3. [ISA-95 explicado: la norma, sus partes y sus niveles](#isa-95-explicado-la-norma-sus-partes-y-sus-niveles)
4. [Los modelos de ISA-95 que importan en un proyecto MES](#los-modelos-de-isa-95-que-importan-en-un-proyecto-de-mes)
5. [MES vs. ERP vs. MOM vs. SCADA y otros sistemas de planta](#mes-vs-erp-vs-mom-vs-scada-y-otros-sistemas-de-planta)
6. [Funciones del MES en detalle](#funciones-mes-en-detalle)
7. [Integración: B2MML, OPC UA, MTConnect y el espacio de nombres unificado](#integración-b2mml-opc-ua-mtconnect-y-el-espacio-de-nombres-unificado)
8. [MES en industrias reguladas](#mes-en-industrias-reguladas)
9. [Opciones de despliegue y arquitectura: suite, plataforma, módulo ERP, nube](#opciones-de-despliegue-y-arquitectura)
10. [Desarrollar o comprar](#fabricar-o-comprar)
11. [Lista de verificación para la selección de proveedores de MES](#lista-de-verificación-para-la-selección-de-proveedores-de-mes)
12. [Hoja de ruta de implantación del MES](#hoja-de-ruta-de-implementación-de-mes)
13. [Coste y ROI del MES con un ejemplo práctico](#costo-y-roi-de-un-mes-con-un-ejemplo-práctico)
14. [KPI del MES: qué medir y cómo](#kpis-de-mes-qué-medir-y-cómo)
15. [Las personas y el piso de planta](#personas-y-piso-de-planta)
16. [Errores comunes en la implantación de un MES](#errores-comunes-en-la-implantación-de-un-mes)
17. [Límites del MES y de ISA-95](#límites-de-mes-e-isa-95)
18. [Glosario](#glosario)
19. [Preguntas frecuentes](#preguntas-frecuentes)
20. [Conclusión y primeros pasos](#conclusión-y-primeros-pasos)

## ¿Qué es un sistema de ejecución de fabricación (MES)?

Un sistema de ejecución de fabricación es el software que convierte una orden de producción en productos terminados y documentados. El ERP indica a la planta *qué* fabricar, cuántas unidades y para cuándo. Las máquinas y sus controladores fabrican las piezas. El MES se sitúa entre ambos: libera y secuencia el trabajo, indica a los operarios y a las máquinas qué hacer a continuación, recoge lo que realmente ocurrió (cantidades, tiempos, parámetros, materiales, defectos, quién lo hizo) e informa del resultado.

La definición de mercado de Gartner es un buen punto de referencia porque es neutral respecto a los proveedores y precisa. Describe el MES como "una clase especializada de software orientado a la producción" que "gestiona, supervisa y sincroniza la ejecución en tiempo real de los procesos físicos que transforman las materias primas en productos intermedios y/o terminados". Añade que estos sistemas coordinan las órdenes de trabajo con la programación de la producción y con los sistemas empresariales como el ERP, la gestión del ciclo de vida del producto y la gestión de la calidad, que proporcionan retroalimentación sobre el rendimiento de los procesos y dan soporte a la trazabilidad y a la genealogía hasta el nivel de componente y material [8].

### La idea central en una frase

Un MES cierra el ciclo entre el plan y la realidad, turno a turno, de modo que todos, desde el operario hasta el responsable de control, trabajan con el mismo registro oportuno de lo que ocurrió en la planta.

### Qué hace un MES en un turno típico

Un ejemplo concreto ayuda más que una lista de funciones. Tomemos una planta de tamaño medio que mecaniza y ensambla válvulas hidráulicas en cuatro líneas:

1. **06:00, inicio de turno.** El MES muestra al supervisor la lista de despacho de la Línea 2: doce órdenes liberadas desde el ERP, secuenciadas por el planificador para minimizar los cambios de formato. Dos órdenes están marcadas porque un calibre tiene la calibración vencida.
2. **06:10.** El operario escanea el documento de ruta de la primera orden (o la selecciona en un terminal). El MES comprueba que el operario está cualificado para esta operación, que la versión del programa en el CNC coincide con la ruta liberada y que el lote de materia prima en el almacén pertenece a la orden. Muestra la revisión vigente de la instrucción de trabajo.
3. **06:12 a 13:30.** La máquina informa de ciclos y estados (en marcha, parada, alarma) mediante OPC UA o MTConnect. El MES cuenta las piezas buenas y rechazadas, registra los tiempos de parada y pide al operario un código de motivo cuando una parada supera los dos minutos. Las mediciones en proceso van a gráficos SPC; un punto fuera de control detiene la siguiente operación hasta que un técnico lo autorice.
4. **11:45.** Un lote de juntas resulta sospechoso. Como el MES registró qué lote entró en cada número de serie de válvula, calidad puede aislar 140 válvulas en lugar de toda la producción de una semana.
5. **14:00, relevo de turno.** El MES informa al turno siguiente de las cantidades, la chatarra, el OEE y las incidencias abiertas, y envía al ERP las cantidades confirmadas y el consumo de materiales.

Sin un MES, gran parte de esto ocurre en documentos de ruta en papel, pizarras y hojas de cálculo, que se introducen en el ERP horas o días después. Eso funciona, hasta cierto punto. El coste aparece en forma de datos tardíos o erróneos, retiradas de producto lentas, fugas de calidad y largas investigaciones. El análisis en profundidad sobre la [fabricación sin papel](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/) cubre el paso de los documentos de ruta en papel a las instrucciones de trabajo digitales, que suele ser el primer módulo MES que utiliza una planta.

### Dónde se sitúa el MES entre los sistemas de la planta

La norma ISA-95 sitúa el MES en el **Nivel 3**, gestión de operaciones de fabricación, entre la planificación empresarial y la logística del Nivel 4 (ERP) y las capas de control de los Niveles 0 a 2 (sensores, PLC, DCS, SCADA) [1]. El Nivel 3 no es un único sistema. Esa misma capa incluye el sistema de gestión de información de laboratorio (LIMS), la gestión de almacén (WMS), la gestión del mantenimiento (CMMS) y otros; en conjunto suelen denominarse sistemas de gestión de operaciones de fabricación [14]. La sección 5 los compara.

### Beneficios de un MES y lo que dice la evidencia

La mayoría de las páginas sobre MES enumeran beneficios con porcentajes impresionantes y sin fuente. Esto es lo que se puede afirmar con rigor:

| Beneficio | Mecanismo | Qué medir | Advertencia |
|---|---|---|---|
| Datos de producción más rápidos y precisos | Datos capturados en origen, no reescritos a mano | Latencia de datos, entradas manuales por orden | Solo si los datos maestros (rutas de fabricación, BOM) son correctos |
| Tiempos de ciclo más cortos | Menos espera por papeleo, liberación y despacho más rápidos | Tiempo de entrega de la orden, tiempo en cola | *Control Engineering* informa que MESA International situó la reducción media de los tiempos de ciclo de fabricación en un 45 por ciento; considérelo una afirmación de la asociación, no un referente [9] |
| Menos fugas de calidad | Controles obligatorios, SPC, enclavamientos antes del siguiente paso | Rendimiento al primer paso, reclamaciones de clientes | Depende de si los controles están realmente configurados como paradas obligatorias |
| Retiradas de producto más rápidas y acotadas | Genealogía de lotes y números de serie | Tiempo para identificar las unidades afectadas | Requiere un escaneo disciplinado de los materiales |
| Mayor OEE en el cuello de botella | Motivos de paro visibles, respuesta más rápida | OEE, MTTR | Solo merece la pena económicamente si la producción adicional puede venderse |
| Preparación para auditorías | Registros electrónicos, pistas de auditoría, firmas electrónicas | Horas por auditoría, hallazgos | El esfuerzo de validación en industrias reguladas es considerable |

Un artículo de 2006 de *Automation World* informó de que más de 40 fabricantes globales habían utilizado ISA-95 para definir sus requisitos de MES, y que el tiempo para definir los requisitos pasó de varios meses a cuatro o seis semanas [10]. Es un efecto modesto y plausible de un vocabulario común, y una buena razón para leer las siguientes secciones antes de redactar un documento de requisitos.

## Breve historia: de AMR y MESA-11 a ISA-95 y más allá

La historia explica por qué los proveedores, analistas y estándares usan palabras ligeramente distintas para lo mismo.

### Principios de los años noventa: el término MES

Según *Automation World*, la firma de analistas de Boston AMR Research estableció el concepto de MES en 1992 como la capa entre los sistemas empresariales y los sistemas de control, proporcionando visibilidad y control [10]. Antes, las plantas utilizaban sistemas de control de piso de planta, recolección de datos y calidad, a menudo desarrollados internamente para un único propósito; sus funciones se solapaban y rara vez se comunicaban entre sí [14].

### 1997: MESA-11

MESA International (Manufacturing Enterprise Solutions Association) publicó su libro blanco sobre MES en 1997 [15] y, con él, el modelo funcional conocido como **MESA-11** [12]. Las once funciones eran [9]:

1. Asignación y estado de recursos
2. Programación de operaciones/programación detallada
3. Despacho de unidades de producción
4. Control de documentos
5. Adquisición de datos
6. Gestión de la mano de obra
7. Gestión de la calidad
8. Gestión de procesos
9. Gestión del mantenimiento
10. Seguimiento de productos y genealogía
11. Análisis de rendimiento

La definición de MESA de 1997 destacaba que un MES debe "proporcionar información que permita optimizar las actividades de producción", una formulación que *Automation World* seguía considerando práctica en 2006 [10]. Varias de las once funciones (mantenimiento, mano de obra, control de documentos) hoy suelen gestionarse con sistemas independientes, por lo que el modelo fue criticado como "demasiado amplio" incluso en aquella época [9].

### 2000 a 2013: ISA-95

El comité ISA95 se basó en el Modelo de Referencia Purdue para la fabricación integrada por computadora [1]. La Parte 1 apareció en 2000 y la Parte 3, con los modelos de actividad del Nivel 3, en 2005; fuentes secundarias describen que ISA-95 fusionó la visión funcional de MESA con la jerarquía de Purdue [12][14]. Siguieron más partes hasta 2020, y la Parte 1 se volvió a publicar en 2025 [1][2]. La sección 3 las enumera.

### Desde 2004: MOM, MES colaborativo y modelos posteriores

Como ISA-95 denominó al Nivel 3 "gestión de operaciones de fabricación", el término MOM se generalizó para el alcance más amplio (producción más operaciones de calidad, mantenimiento e inventario), con el MES como núcleo de producción [10]. La propia MESA publicó varios modelos posteriores; el artículo de *Control Engineering* sobre el modelo original señala que era uno de ocho modelos de MESA en aquel momento [9]. No pudimos verificar a partir de una fuente primaria los nombres y años de los modelos posteriores de MESA (citados a menudo como c-MES en 2004 y el modelo MESA de 2008) [unverified: no se pudo confirmar en una fuente primaria]. La página propia de MESA sobre su historia de modelos ahora redirige a ISA, y el anuncio de MESA de 2022 sobre su último modelo solo indica que había publicado "tres (ahora cuatro) modelos MESA" [43].

### 2026: MESA se disuelve, ISA asume su contenido

MESA International votó cesar sus operaciones con efecto desde el 30 de junio de 2026; ISA afirma que "el contenido y los programas educativos de MESA serán asumidos por ISA" [11]. Esto importa en la práctica porque MESA mantenía **B2MML**, la implementación XML de ISA-95 usada en muchas interfaces ERP-MES [5]. Consulte con ISA dónde se alojarán los esquemas de B2MML y cualquier versión futura antes de especificarlos en un contrato. A noviembre de 2026, los esquemas B2MML y BatchML siguen publicados en el repositorio MESAInternational de GitHub, cuyo README no menciona la transferencia [36] [unverified: el alojamiento futuro tras la transferencia no está documentado].

### Los años 2020: IIoT, nube y MES componible

Tres cambios configuran los proyectos MES actuales: recopilar datos de máquinas es más barato (OPC UA, MTConnect, MQTT), el despliegue en nube e híbrido se ha vuelto habitual, y los proveedores venden cada vez más el MES como una plataforma de aplicaciones más pequeñas en lugar de una suite monolítica (MES "componible" o de "nueva generación"). La sección 9 explica qué significa esto para su arquitectura y su contrato.

## ISA-95 explicado: la norma, sus partes y sus niveles

ISA describe ISA-95, "también conocida como ANSI/ISA-95 o IEC 62264", como un conjunto internacional de normas para integrar los sistemas de logística con los sistemas de control de fabricación [1]. Organiza los procesos tecnológicos y de negocio en capas definidas por las actividades que tienen lugar en cada una y describe cómo una empresa puede construir interfaces entre esas capas. ISA subraya que la arquitectura, basada en el modelo Purdue, puede aplicarse "independientemente de la tecnología utilizada", y que la jerarquía de equipos funciona por igual en industrias discretas, continuas y de logística [1].

De ello se derivan dos consecuencias. Primero, ISA-95 es **neutral respecto a la tecnología**: no dice nada sobre qué base de datos, protocolo o proveedor usa usted. Segundo, su enfoque principal es la **interfaz entre el Nivel 3 y el Nivel 4** [1], que es precisamente donde se atascan la mayoría de los proyectos MES (quién es responsable del enrutamiento, cuándo una cantidad se "confirma", cómo se registra la chatarra).

### ISA-95 e IEC 62264: mismo contenido, numeración distinta

ISA desarrolla la serie como ANSI/ISA-95; la IEC la publica como IEC 62264. La edición de 2025 de la Parte 1 lleva la designación ANSI/ISA-95.00.01-2025 (IEC 62264-1 Mod), donde "Mod" indica una adopción modificada [1][2]. Las ediciones no siempre coinciden. IEC 62264-1 y -2 se publicaron en 2013, la Parte 3 en 2016, la Parte 4 en 2015 y la Parte 5 en 2016 [7]; la IEC 62264-6, el modelo de servicios de mensajería, apareció como edición 1.0 el 26 de junio de 2020 [6]. Cuando un contrato o un documento de requisitos cite "ISA-95", indique la parte y la edición.

### Las ocho partes de ISA-95

| Parte | Título (ANSI/ISA-95) | Edición vigente según ISA | Alcance en términos sencillos |
|---|---|---|---|
| 1 | Modelos y terminología | 2025 (IEC 62264-1 Mod) | Alcance de las operaciones y el control de fabricación, cómo se organizan los activos físicos, funciones de interfaz, información compartida |
| 2 | Objetos y atributos para la integración empresa-sistema de control | 2018 | Los objetos y atributos que se intercambian en la interfaz Nivel 3 / Nivel 4 |
| 3 | Modelos de actividad de la gestión de operaciones de fabricación | 2013 | Las actividades dentro del Nivel 3 y parte de los datos que intercambian |
| 4 | Objetos y atributos para la integración de la gestión de operaciones de fabricación | 2018 | Modelos de objetos para la información que fluye entre las actividades del Nivel 3, independientemente del grado de automatización |
| 5 | Transacciones negocio-fabricación | 2018 | Transacciones entre los Niveles 3 y 4 (verbos como obtener, procesar, sincronizar) |
| 6 | Modelo de servicios de mensajería | 2014 | Mensajería entre los Niveles 3 y 4 y dentro del Nivel 3 |
| 7 | Modelo de servicios de alias | 2017 | Correspondencia de identificadores equivalentes entre las operaciones de fabricación y otros dominios |
| 8 | Perfiles de intercambio de información | 2020 | Perfiles para interfaces específicas entre los Niveles 4 y 3 o entre actividades del Nivel 3 |

Fuente: página de ISA sobre ISA-95 [1]. Tenga en cuenta que ISA indica 2014 para la Parte 6, mientras que la edición IEC de la Parte 6 es de 2020 [6].
Para la mayoría de los proyectos MES, las Partes 1 a 3 hacen el trabajo principal: le dan el vocabulario, el modelo de niveles y el modelo de actividades que necesita para un documento de requisitos. Las Partes 2, 4 y 5 importan al diseñar interfaces y modelos de datos. Las Partes 6 a 8 interesan sobre todo a los arquitectos de integración y a los proveedores de software.

### Qué cambió en la edición 2025 de la Parte 1

ISA anunció la nueva Parte 1 el 10 de abril de 2025. Actualiza la versión de 2010, refleja funciones empresariales específicas, aclara la frontera entre el dominio empresarial y los dominios de fabricación/control y mejora la coherencia con las otras partes [2]. El presidente del comité ISA95, Christian Monchinski, la vinculó con "arquitecturas cada vez más modulares en las operaciones empresariales y de fabricación" y con un cambio hacia diseños centrados en los datos, y afirmó que la actualización "reafirma la importancia de las interfaces de integración estandarizadas" [2]. Para los profesionales esto es una señal: ISA-95 debe seguir siendo el vocabulario común para las arquitecturas modulares y dirigidas por eventos, y no ser reemplazado por ellas.

### Los cinco niveles de ISA-95

ISA-95 hereda su modelo de niveles de Purdue. Los niveles describen *funciones*, no computadoras ni segmentos de red [1][4].

| Nivel | Nombre | Qué ocurre aquí (nuestro resumen) | Sistemas típicos | Escala de tiempo típica |
|---|---|---|---|---|
| 4 | Planificación y logística empresarial | Pedidos, necesidades de materiales, inventario, envíos, costeo para la planta | ERP, planificación de la cadena de suministro | Meses, semanas, días [4] |
| 3 | Gestión de operaciones de fabricación | Control de flujo de trabajo y recetas para producir los productos finales; programación detallada, despacho, registros, calidad, mantenimiento y operaciones de inventario | MES, LIMS, WMS, CMMS, QMS, historiador, APS (programación detallada) | Días, turnos, horas, minutos, segundos [4] |
| 2 | Monitoreo y control supervisor | Monitoreo y control del proceso físico | SCADA, HMI, DCS, PLC | Respuestas en tiempo real medidas en subsegundos [4] |
| 1 | Detección y manipulación | Sensores, actuadores, dispositivos inteligentes, válvulas | Dispositivos de campo | No especificado en las fuentes utilizadas aquí |
| 0 | Proceso físico | La maquinaria y el material que se transforma | Máquinas, líneas, equipos de proceso | No aplicable |

Dos observaciones. La propia página de ISA ubica a SCADA en la fila del Nivel 3 como ejemplo de sistema de Nivel 3 junto con MES [1], mientras que el resumen de la OPC Foundation asigna el automatismo y el control a los Niveles 1 y 2, y MOM al Nivel 3 [4]. En la práctica, SCADA abarca la frontera entre 2 y 3: sus pantallas y el manejo de alarmas son control supervisor (Nivel 2), mientras que sus funciones de historiador e informes a menudo sirven al Nivel 3. No discuta sobre la casilla; decida qué sistema es el registro maestro para cada dato. En segundo lugar, la OPC Foundation subraya que "cada nivel tiene su propia definición de tiempo real" [4]. Un MES que actualiza un panel cada 30 segundos es en tiempo real para un supervisor y demasiado lento para un enclavamiento de máquina.

### Los niveles no son zonas de red

Un error común es tratar los niveles de ISA-95 y los niveles de Purdue usados en la seguridad OT como si fueran lo mismo. ISA-95 describe funciones e información; la segmentación de red sigue una lógica diferente, ahora definida en ISA/IEC 62443 con zonas y conductos [23]. ISA señala que ISA-95 se apoya en el modelo de referencia de Purdue para describir la segmentación de red en los sistemas de control industrial [1], pero una *función* de Nivel 3 puede ejecutarse en un inquilino de nube, mientras que un *servidor* de Nivel 3 en su planta se ubica en una zona de seguridad específica. La guía [Ciberseguridad OT e ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/) cubre zonas, conductos y la DMZ; NIST SP 800-82 Rev. 3 es la guía estadounidense de seguridad OT [24].

### ¿Sigue siendo relevante ISA-95?

La respuesta de la propia ISA: los niveles siguen ayudando a describir los límites de los sistemas para la Industria 4.0 y la fabricación inteligente, aunque el modelo surgió como una jerarquía [1]. Esto coincide con la práctica. La jerarquía como *ruta de datos* (cada valor asciende nivel por nivel a través de interfaces punto a punto) ha envejecido mal, y la sección 7 muestra las alternativas. La jerarquía como *mapa de responsabilidades y vocabulario* no ha envejecido.

## Los modelos de ISA-95 que importan en un proyecto de MES

ISA-95 contiene varios modelos. Cuatro de ellos conviene conocerlos por su nombre antes de redactar un documento de requisitos de MES.

### 1. La jerarquía funcional (niveles)

Se trata en la sección anterior. Úsela para dibujar un diagrama de contexto del sistema, con cada sistema existente ubicado en su nivel y cada interfaz representada como una flecha etiquetada.

### 2. La jerarquía de equipos

ISA-95 organiza la planta física en una jerarquía de equipos basada en roles: **empresa, sitio, área, centro de trabajo, unidad de trabajo** (los nombres que usan las guías divulgativas habituales y la guía hermana sobre Azure) [1][27]. Los centros de trabajo se clasifican además por tipo; por ejemplo, celdas de proceso (lotes), unidades de producción (continuo), líneas de producción (discreto) y zonas de almacenamiento, con unidades de trabajo correspondientes como unidades, células de trabajo y unidades de almacenamiento. El modelo de información de ISA-95 de la OPC Foundation enumera exactamente estos nombres de nivel [32], y el borrador público de 1999 de la Parte 1 asigna celdas y unidades de proceso a la fabricación por lotes, unidades de producción al continuo y líneas de producción y células de trabajo a la fabricación discreta [33]. La correspondencia de la OPC Foundation señala que los equipos pueden anidarse y que el modelo describe los *roles* que desempeñan los equipos en la producción, separados de los activos físicos que los componen [5].

Por qué importa: la jerarquía de equipos se convierte en su convención de nombres en el MES, el historiador, el CMMS, el árbol de temas del espacio de nombres unificado y la plataforma de datos. Una planta que denomina la misma máquina "L2-CNC3", "Línea 2 Mazak" y "WC-4711" en tres sistemas paga por ello en cada informe y en cada integración.

**Ejemplo de jerarquía para la planta de válvulas:**

| Nivel | Ejemplo |
|---|---|
| Empresa | Acme Fluid Power |
| Sitio | Planta de Dayton |
| Área | Mecanizado; Montaje y prueba; Almacén |
| Centro de trabajo | Línea 2 (línea de producción); Célula de prueba T1 (grupo de células de trabajo); Almacén de materia prima (zona de almacenamiento) |
| Unidad de trabajo | CNC 3; Estación de lavado; Probador de fugas LT-1; Zona de racks A |

### 3. Los modelos de objetos (Partes 2 y 4)

ISA-95 describe la información intercambiada entre ERP y MES, y entre las actividades del MES, como modelos de objetos con atributos. El documento complementario de la OPC Foundation nombra cuatro modelos de recursos que intercambian los sistemas ERP y MOM: **material** (incluidas sus propiedades y lotes), **equipo** (en lo que respecta a las operaciones realizadas), **activos físicos** (los activos que componen el equipo) y **personal** (roles y cualificaciones) [4][5]. En torno a ellos, ISA-95 organiza el intercambio en cuatro categorías de información que reflejan el ciclo de vida de una orden: **definición del producto** (cómo fabricarlo), **capacidad de producción** (qué recursos están disponibles), **programa de producción** (qué fabricar y cuándo) y **rendimiento de producción** (qué se fabricó). Las categorías coinciden con los nombres de actividad de la Parte 3 [3]; el borrador público de 1999 de la Parte 1 agrupa programa y rendimiento como "información de producción" [33].

Una regla práctica de este modelo: el ERP es responsable del "qué y cuándo", y el MES, del "cómo y lo que realmente ocurrió". Cuando el ERP mantiene una ruta con tiempos de operación y el MES mantiene una definición de trabajo más detallada, con parámetros e instrucciones, decida explícitamente cuál de los dos es el maestro de cada atributo y cómo fluyen los cambios.

### 4. El modelo de actividades (Parte 3)

Esta es la parte más útil y la menos explicada de ISA-95. La Parte 3 divide la gestión de operaciones de fabricación en cuatro categorías: **operaciones de producción, operaciones de mantenimiento, operaciones de pruebas de calidad y operaciones de inventario**. Dentro de cada una, utiliza las mismas ocho actividades genéricas [3]:

| Actividad genérica | Operaciones de producción | Operaciones de mantenimiento | Operaciones de pruebas de calidad | Operaciones de inventario |
|---|---|---|---|---|
| Gestión de definiciones | Gestión de definiciones de producto (rutas, recetas, instrucciones de trabajo) | Gestión de definiciones de mantenimiento (listas de tareas, procedimientos) | Gestión de definiciones de pruebas de calidad (especificaciones de prueba, planes de muestreo) | Gestión de definiciones de inventario (reglas de almacenamiento y transferencia) |
| Gestión de recursos | Gestión de recursos de producción (personas, equipos, disponibilidad y calificación de materiales) | Gestión de recursos de mantenimiento (técnicos, repuestos, herramientas) | Gestión de recursos de pruebas de calidad (equipos de laboratorio, analistas) | Gestión de recursos de inventario (ubicaciones de almacenamiento, equipos de manipulación) |
| Programación detallada | Programación detallada de producción (secuencia en los recursos) | Programación detallada de mantenimiento | Programación detallada de pruebas de calidad | Programación detallada de inventario (movimientos, reabastecimiento) |
| Despacho | Despacho de producción (liberar trabajo a las estaciones) | Despacho de mantenimiento (órdenes de trabajo a los técnicos) | Despacho de pruebas de calidad (muestras al laboratorio) | Despacho de inventario (órdenes de transferencia) |
| Gestión de la ejecución | Gestión de la ejecución de producción (guiar y verificar la ejecución) | Gestión de la ejecución de mantenimiento | Gestión de la ejecución de pruebas de calidad | Gestión de la ejecución de inventario |
| Recopilación de datos | Recopilación de datos de producción (conteos, tiempos, parámetros) | Recopilación de datos de mantenimiento (hallazgos, horas, piezas) | Recopilación de datos de pruebas de calidad (resultados) | Recopilación de datos de inventario (movimientos, conteos) |
| Seguimiento | Seguimiento de producción (WIP, genealogía, informes al ERP) | Seguimiento de mantenimiento (historial por activo) | Seguimiento de pruebas de calidad (resultados por lote o número de serie) | Seguimiento de inventario (ubicación y estado del material) |
| Análisis de desempeño | Análisis de desempeño de producción (OEE, rendimiento, tiempo de ciclo) | Análisis de desempeño de mantenimiento (MTBF, MTTR) | Análisis de desempeño de pruebas de calidad (capacidad, tendencias) | Análisis de desempeño de inventario (rotación, exactitud) |

Los nombres de filas y columnas siguen los títulos de las cláusulas de ANSI/ISA-95.00.03-2013 (cláusulas 6 a 9) [3]; los ejemplos entre paréntesis son nuestros. *Automation World* resumió la misma división como "producción, mantenimiento, calidad e inventario" [13].

**Cómo usar la matriz en un proyecto:** Imprímala como una cuadrícula de 4 × 8. Para cada una de las 32 celdas, escriba qué sistema realiza esta actividad hoy (papel, Excel, ERP, MES, CMMS, LIMS, WMS, nadie) y qué sistema debería hacerla después del proyecto. Las celdas vacías y las celdas con tres sistemas son su discusión de alcance. Un resultado típico para una planta de manufactura discreta: la columna de producción mayormente en MES, la columna de mantenimiento en el CMMS, las pruebas de calidad divididas entre MES (controles en proceso) y LIMS o QMS (pruebas de laboratorio, CAPA), y el inventario dividido entre ERP (niveles de stock) y WMS o MES (movimientos a la línea). La programación detallada en la columna de producción suele pasar a un APS (véase [programación de producción y APS](https://www.m365.fm/en/learn/production-scheduling-aps/)).

### Una nota sobre ISA-88 y VDI 5600

Dos marcos relacionados aparecen en los proyectos de MES. **ISA-88** es la norma de control por lotes; su modelo de control procedimental (procedimientos, procedimientos de unidad, operaciones, fases) fue adoptado por la IEC como IEC 61512-1 [34] y es la forma habitual de estructurar recetas en farmacéutica, alimentaria y química. BatchML, el complemento de B2MML, implementa ISA-88 [36], y muchos productos MES implementan registros electrónicos de lote sobre él [unverified: observación de práctica]. **VDI 5600**, una directriz de la Asociación de Ingenieros Alemanes (la Parte 1 fechada en octubre de 2016), enumera las tareas de MES de forma similar a MESA-11 y es común en plantas alemanas y en RFP de matrices alemanas [21].

## MES vs. ERP vs. MOM vs. SCADA y otros sistemas de planta

"¿Cuál es la diferencia entre MES y ERP?" es una de las preguntas más frecuentes sobre MES, seguida de MES frente a SCADA. La versión corta: ERP planifica y contabiliza, MES ejecuta y registra, SCADA supervisa y controla las máquinas. La versión larga requiere una tabla, porque los límites dependen del sector y de los productos que ya tenga.

### Tabla comparativa

| Dimensión | ERP (Nivel 4) | MES (Nivel 3) | MOM (Nivel 3, más amplio) | SCADA / HMI (Nivel 2, en parte 3) | Historian |
|---|---|---|---|---|---|
| Pregunta principal | ¿Qué debemos fabricar, comprar y enviar, y cuánto costó? | ¿Cómo se fabrica exactamente esta orden y qué ocurrió realmente? | ¿Cómo funcionan juntas la producción, la calidad, el mantenimiento y el inventario? | ¿Qué está haciendo ahora mismo la máquina o el proceso y cómo lo controlo? | ¿Cuáles fueron los valores del proceso a lo largo del tiempo? |
| Horizonte temporal | Meses, semanas, días [4] | Turnos, horas, minutos, segundos [4] | Igual que MES | Subsegundos a segundos [4] | Segundos a años |
| Unidad de trabajo | Orden de producción, orden de compra, pedido de venta | Operación, paso, lote, número de serie | Orden más prueba, orden de trabajo de mantenimiento, orden de traslado | Variable, alarma, consigna | Variable de serie temporal |
| Datos típicos | BOM, hoja de ruta, coste estándar, stock, demanda | Instrucciones de trabajo, tiempos y cantidades reales, parámetros, genealogía, defectos, firmas de conformidad | Datos de MES más resultados de laboratorio, historial de mantenimiento, movimientos de material | Valores en vivo, alarmas, comandos del operador | Serie temporal comprimida |
| Usuarios | Planificación, compras, finanzas, ventas | Operarios, supervisores, calidad, ingenieros de proceso | Dirección de planta, todas las funciones de operaciones | Operadores de sala de control, técnicos de mantenimiento | Ingenieros, analistas |
| Registro de referencia para | Asientos financieros, valor del inventario, demanda | Registro tal como se fabricó, historial de ejecución | Registros de operaciones de todas las categorías | Estados de control y alarmas | Histórico de procesos |
| Fallo típico si se usa mal | Confirmaciones de planta escritas con días de retraso | Usado como herramienta de planificación o como volcado de datos sin lógica de proceso | Alcance tan amplio que nada llega a producción | Usado como sistema de gestión de pedidos | Tratado como sistema de registro de cantidades |

MOM es el nombre que da ISA-95 al conjunto del Nivel 3; MES se entiende habitualmente como su núcleo productivo [10][14]. Muchos proveedores venden "suites MOM" que incluyen módulos de calidad y mantenimiento. Que lo llame MES o MOM importa menos que el hecho de que la matriz de actividades de la sección 4 tenga un único responsable por celda.

### Otros sistemas de Nivel 3 y dónde suele estar el límite con MES

| Sistema | Función principal | Límite típico con MES |
|---|---|---|
| QMS (sistema de gestión de calidad) | No conformidades, CAPA, auditorías, control documental, calidad de proveedores | MES captura los resultados en proceso y las retenciones; QMS gestiona la investigación y la acción correctiva. Integración: la no conformidad se crea en MES y se trabaja en QMS |
| LIMS (gestión de información de laboratorio) | Muestras, ensayos de laboratorio, especificaciones, certificados de análisis | MES solicita muestras y recibe las decisiones de liberación; LIMS es propietario del registro de ensayos |
| CMMS / EAM | Órdenes de trabajo de mantenimiento, repuestos, historial de activos | MES informa de estados y contadores de máquinas; CMMS programa el mantenimiento. Los identificadores de activo compartidos son esenciales |
| WMS | Almacenamiento, preparación de pedidos, movimientos de almacén | MES solicita material a la línea y confirma el consumo; WMS ejecuta los movimientos |
| APS | Programación de capacidad finita y secuenciación | APS genera la secuencia; MES la despacha y devuelve los datos reales. Algunos productos MES incluyen un módulo APS |
| PLM | Diseño de producto, BOM de ingeniería, gestión de cambios | PLM libera la definición de ingeniería; MES consume la definición de fabricación (a menudo a través de ERP o de una herramienta de planificación de procesos de fabricación) |
| Plataforma de datos / analítica | Análisis entre plantas, IA, almacenamiento a largo plazo | MES es una fuente; no debería convertirse en el lago de datos corporativo. Véase [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) |

### ¿Es SAP un MES? ¿Basta con ERP?

Los proveedores de ERP ofrecen funciones de ejecución de fabricación, ya sea dentro del ERP (confirmaciones de planta, listas de despacho sencillas) o como productos independientes. SAP, por ejemplo, describe SAP Digital Manufacturing como una plataforma de gestión de operaciones de fabricación (MOM) basada en la nube e indica a los clientes de su anterior SAP Manufacturing Execution que migren a ella (descripción del proveedor) [35]. Que el ERP por sí solo sea suficiente depende de cuatro preguntas:

1. **Granularidad:** ¿Necesita registrar por operación y orden, o por paso, número de serie y parámetro?
2. **Latencia:** ¿Basta con confirmar al final del turno, o las decisiones dependen de minutos?
3. **Cumplimiento:** ¿El sistema debe *impedir* un paso incorrecto (material equivocado, operario no cualificado, verificación omitida), o solo registrarlo?
4. **Normativa:** ¿Necesita registros electrónicos de lote o historiales de dispositivo con pistas de auditoría y firmas electrónicas?

**Señales de que ha superado la ejecución solo con ERP:** confirmaciones introducidas con más de un turno de retraso; más de una hoja de cálculo paralela por área; un cliente o regulador que pide trazabilidad que solo puede reunir en días; fugas de calidad causadas por revisiones o materiales incorrectos; supervisores que dedican la primera hora de cada turno a recopilar datos.

Si las cuatro respuestas son "agregadas, al final del turno, solo registro, no", el control de piso de planta del ERP junto con una buena disciplina puede bastar, sobre todo en plantas pequeñas. Si dos o más respuestas apuntan en sentido contrario, necesita funciones MES, ya sea del proveedor de ERP, de un proveedor MES o de una plataforma.

## Funciones MES en detalle

Las funciones siguientes siguen la columna de producción del modelo de actividades ISA-95 [3], ampliado con las funciones MESA-11 que la mayoría de productos aún cubren [9]. Para cada una: qué hace, qué necesita y cómo suele fallar.

### 1. Gestión de la definición de producto (definiciones de trabajo, rutas, recetas)

**Qué hace:** Mantiene la definición de fabricación de cada producto: operaciones, pasos, parámetros, materiales requeridos, herramientas, habilidades, instrucciones de trabajo y verificaciones. En las industrias de proceso por lotes, esto es la receta maestra.

**Qué necesita:** Una división clara de los datos maestros entre ERP y PLM, control de versiones y un proceso de cambios de ingeniería que llegue al piso de planta antes de que empiece la siguiente orden.

**Fallo típico:** Dos maestros. La ruta del ERP dice 12 operaciones, el MES dice 14, y nadie sabe qué tiempos se usan para el costeo.

### 2. Gestión de recursos (personas, equipos, materiales)

**Qué hace:** Sabe qué recursos están disponibles y cualificados: estado de las máquinas, vida útil de las herramientas, formación y certificación de los operarios, lotes de material disponibles en la línea.

**Qué necesita:** Registros de formación (a menudo de RR. HH. o de un sistema de aprendizaje), estado de los equipos desde el CMMS y los controles, y estado de los materiales desde el ERP o el WMS.

**Fallo típico:** El MES bloquea a un operario porque su registro de formación en RR. HH. lleva tres meses de retraso. Defina el proceso de actualización de cualificaciones antes de activar un cumplimiento estricto. El análisis en profundidad sobre [habilidades de la fuerza laboral de fabricación](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/) trata las matrices de habilidades.

### 3. Programación detallada

**Qué hace:** Convierte las órdenes liberadas en una secuencia por recurso, respetando capacidades, cambios de formato, disponibilidad de material y fechas de entrega. MESA-11 la denomina programación de operaciones/detallada [9].

**Qué necesita:** Tiempos de ejecución y de cambio de formato precisos, calendarios reales de los recursos y el avance real desde el piso de planta.

**Fallo típico:** Una "programación" que en realidad es la lista de despacho del ERP ordenada por fecha de entrega. Si la programación es una restricción real en su planta, compare el módulo MES con un APS independiente.

### 4. Despacho

**Qué hace:** Libera el siguiente trabajo a un centro de trabajo u operario en el momento adecuado, con todos los documentos y materiales listos. MESA-11: despacho de unidades de producción [9].

**Fallo típico:** Listas de despacho que los operarios ignoran porque no reflejan la realidad (material faltante, máquina parada). La solución es cerrar el ciclo: el despacho debe usar el estado de los recursos en tiempo real.

### 5. Gestión de la ejecución e instrucciones de trabajo

**Qué hace:** Guía al operario o a la máquina a través de los pasos, impone la secuencia y las verificaciones, recoge las aprobaciones y detiene el proceso cuando no se cumple una condición requerida. Aquí es donde un MES se diferencia más de una herramienta de reporte.

**Qué necesita:** Instrucciones de trabajo bien redactadas y visuales; decisiones sobre qué verificaciones son paradas obligatorias y cuáles son advertencias; terminales o tabletas en la estación.

**Límite de seguridad:** Las funciones de seguridad (protecciones, paradas de emergencia, enclavamientos de seguridad) pertenecen a controles con clasificación de seguridad en los niveles 1 y 2, nunca al MES. El MES puede bloquear el *siguiente paso de la orden*; no debe ser lo único que mantenga a una persona a salvo.

**Fallo típico:** Digitalizar un procedimiento de papel de 40 páginas uno a uno. Reescriba las instrucciones para la pantalla, pruébelas con los operarios y manténgalas breves. Véase [trabajo estándar](https://www.m365.fm/en/learn/shop-floor-management/standard-work/) y [fabricación sin papel](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/).

### 6. Captura de datos (data acquisition)

**Qué hace:** Captura cantidades, tiempos, estados, parámetros y mediciones, automáticamente desde las máquinas cuando es posible y manualmente cuando no lo es.

**Qué necesita:** Conectividad con las máquinas (OPC UA, MTConnect, protocolos de fabricante o E/S simples para contadores y estados), un modelo de tiempos (qué se considera parada planificada) y listas de códigos de motivo que los operarios puedan usar realmente.

**Fallo típico:** 120 códigos de motivo de parada. Los operarios eligen el primero de la lista. Empiece con ocho a quince códigos por área y refínelos junto con las personas que los usan.

### 7. Gestión de calidad en la ejecución

**Qué hace:** Inspecciones en proceso, SPC, planes de muestreo, bloqueos y liberaciones, registro de no conformidades y enlaces con el QMS para la investigación.

**Qué necesita:** Planes de control y características de la ingeniería de calidad (en automoción, el PFMEA y el plan de control), integración de instrumentos de medida y reglas para lo que ocurre ante una verificación fallida.

**Fallo típico:** Se recogen resultados de inspección pero nunca se usan para detener el proceso. Una verificación que no puede parar la línea es un registro, no un control. El trabajo de causa raíz corresponde al sistema de calidad; véase [Six Sigma y análisis de causa raíz](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/).

### 8. Seguimiento, trazabilidad y genealogía

**Qué hace:** Sigue el trabajo en curso y construye el registro tal como se fabricó: qué lotes de material y componentes, de qué proveedores, entraron en qué números de serie o lotes, procesados en qué equipos con qué parámetros y por quién. MESA-11: seguimiento de producto y genealogía [9].

**Qué necesita:** Identificación única (códigos de barras, códigos 2D, RFID), escaneo disciplinado en cada punto de consumo de material y una regla clara para los materiales a granel (a nivel de lote frente a nivel de número de serie).

**Fallo típico:** La genealogía se reconstruye a posteriori a partir de los documentos de expedición. Debe capturarse en el propio proceso. Una prueba sencilla: tome un número de serie de producto terminado al azar y pregunte cuánto tiempo tarda en enumerar todos los lotes de componentes. Luego invierta la prueba: tome un lote de componente y enumere todas las unidades terminadas que lo contienen.

### 9. Análisis de rendimiento

**Qué hace:** OEE, rendimiento, chatarra, tiempo de ciclo, cumplimiento del programa y análisis de paradas por turno, línea y producto; es la entrada de las reuniones diarias de planta. La sección 14 cubre los KPI.

**Fallo típico:** Paneles que nadie discute. Vincule cada KPI a una reunión y a un responsable, como se describe en [gestión de planta](https://www.m365.fm/en/learn/shop-floor-management/).

### 10. Control de documentos

**Qué hace:** Entrega en el puesto la revisión vigente de planos, instrucciones y especificaciones, y registra qué revisión se utilizó. A menudo se comparte o se delega en un sistema de gestión documental o en el QMS.

### 11. Gestión de mano de obra

**Qué hace:** Registra quién trabajó en qué orden y durante cuánto tiempo, para costes, verificaciones de cualificación e interfaces de nóminas. Tenga en cuenta el aspecto humano de la sección 15: el seguimiento de la mano de obra a nivel de operación es sensible y, en plantas sindicadas, puede estar sujeto a negociación colectiva.

### 12. Funciones relacionadas con el mantenimiento

**Qué hace:** Los estados de las máquinas, contadores y alarmas del MES alimentan el mantenimiento basado en la condición o en el uso dentro del CMMS. La gestión completa del mantenimiento suele permanecer en el CMMS. Véase [TPM y OEE](https://www.m365.fm/en/learn/tpm-oee/) y [mantenimiento predictivo e IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/).

### 13. Inventario y flujo de material en la línea

**Qué hace:** Solicita material a la línea, confirma el consumo, controla los búferes de trabajo en curso y el stock junto a la línea. Las señales kanban pueden activarse a partir de los datos de consumo del MES; véase [kanban y sistemas pull](https://www.m365.fm/en/learn/kanban-pull-system/) e [intralogística](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/).

### Discreto, procesos y lotes: cómo cambia el énfasis

| Tipo de industria | Énfasis típico del MES | Ejemplos |
|---|---|---|
| Discreta, alto volumen (automoción, electrónica) | Genealogía serializada, enclavamientos, datos de máquina, OEE, Andon | Taller de carrocerías, montaje de PCB |
| Discreta, alta mezcla, bajo volumen (maquinaria, aeroespacial) | Instrucciones de trabajo, travelers, no conformidades, cualificación de operarios, configuración as-built | Montaje de máquinas herramienta, estructuras de aeronaves |
| Por lotes (farmacéutica, alimentación, químicos especiales) | Registros electrónicos de lote, ejecución de recetas, pesaje y dosificación, revisión por excepción, cumplimiento normativo | Fabricación de comprimidos, salsas |
| Continua (papel, acero, refino) | Seguimiento de producción por tiempo y lote, calidad por muestreo, energía, integración con DCS y LIMS | Máquina de papel, laminador en caliente |

Para particularidades aeroespaciales (AS9100, inspección del primer artículo, control de configuración), consulte [aerospace production planning](https://www.m365.fm/en/learn/aerospace-production-planning/).

## Integración: B2MML, OPC UA, MTConnect y el espacio de nombres unificado

Un MES es tan bueno como sus interfaces. Necesita pedidos y datos maestros desde los niveles superiores, datos de máquina desde los inferiores, y debe devolver los resultados confirmados. Se repiten cuatro bloques básicos.

### Hacia arriba: integración con ERP y B2MML

La interfaz ERP-MES transporta un número reducido de tipos de mensaje, que encajan bien con las categorías de información de ISA-95:

| Dirección | Mensaje | Contenido | Disparador |
|---|---|---|---|
| ERP -> MES | Definición de producto / ruta | Operaciones, BOM, centros de trabajo, tiempos estándar | Liberación de cambio de ingeniería |
| ERP -> MES | Orden de producción (programa) | Material, cantidad, fecha de vencimiento, referencia de ruta | Liberación de la orden |
| ERP -> MES | Maestro de materiales, lotes | Identificadores de material, características de lote | Cambio, recepción |
| MES -> ERP | Confirmación de operación (rendimiento) | Cantidades buenas y desechos, tiempos, mano de obra | Fin de operación o periódico |
| MES -> ERP | Movimientos de mercancías | Consumos, entrada de mercancía desde producción | Escaneo de consumo, cierre de orden |
| MES -> ERP | Notificación de calidad | Defectos, bloqueos | No conformidad |
| MES <-> ERP | Capacidad / estado | Disponibilidad de recursos, estado de la orden | Cambio de estado |

**B2MML** (Business To Manufacturing Markup Language) es la implementación XML de MESA de los modelos de objetos de ISA-95; la especificación complementaria de ISA-95 de la OPC Foundation sigue en lo posible el mapeo de B2MML para facilitar la traducción [5]. Usar B2MML o un equivalente en JSON no convierte una interfaz en plug-and-play, pero da a ambas partes los mismos nombres y estructuras de objetos, lo que acorta el trabajo de especificación. Con la disolución de MESA, confirme dónde se mantienen los esquemas (véase la sección 2) [11].

**Reglas que ahorran meses:**

- Defina para cada atributo qué sistema es el maestro, y nunca deje que dos sistemas escriban el mismo campo.
- Acuerde el *evento* que dispara una confirmación (fin de operación, cada 15 minutos, fin de orden), no solo el formato.
- Haga las interfaces idempotentes: un mensaje enviado dos veces no debe contabilizar las cantidades dos veces.
- Planifique la indisponibilidad del ERP. El MES debe seguir funcionando y encolar las contabilizaciones.

### Hacia abajo: integración con máquinas y control mediante OPC UA y MTConnect

**OPC UA** es la interfaz neutral y dominante entre los sistemas de control y el software de nivel 3. La OPC Foundation mantiene especificaciones complementarias que definen modelos de información para dominios concretos, entre ellos OPC 10030, que traslada el modelo común de objetos de ISA-95 a OPC UA [4][5]. En Azure IoT Operations de Microsoft, por ejemplo, el conector OPC UA lee los puntos de datos configurados y los publica en un broker MQTT [26]; la guía hermana [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) cubre esa pila.

**MTConnect** es un estándar abierto para datos de máquinas herramienta y equipos de fabricación, publicado como ANSI/MTC1.4-2018 [22]. Muchos fabricantes estadounidenses de máquinas herramienta lo soportan de forma nativa, lo que lo hace atractivo para talleres con equipos CNC.

Para líneas de envasado, el modelo de estados PackML (del informe técnico ISA-TR88.00.02, edición vigente de 2022) proporciona a las máquinas un conjunto común de estados y modos [37], lo que simplifica el cálculo del OEE entre distintos OEM.

**Lo mínimo que necesita de la máquina:** un estado (en marcha, parada, con fallo, en preparación), un contador de piezas buenas, un contador de rechazos, el programa o receta activo y los códigos de alarma. Todo lo demás es un extra para casos de uso posteriores.

### Hacia los lados y hacia afuera: el espacio de nombres unificado (UNS)

Un **espacio de nombres unificado** (*unified namespace*, UNS) es un patrón de arquitectura, no un estándar: los sistemas publican su estado actual como eventos en un broker central, normalmente MQTT, organizado en un árbol jerárquico de temas, y otros sistemas se suscriben a lo que necesitan. El árbol de temas suele seguir la jerarquía de equipos de ISA-95. El [pilar de Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/) muestra un ejemplo completo de temas y los servicios de Azure que lo implementan; esta sección se centra en lo que un UNS significa para el MES.

```
acme/dayton/machining/line-2/cnc-3/state
acme/dayton/machining/line-2/cnc-3/counts
acme/dayton/machining/line-2/order/current
acme/dayton/assembly/test-cell-t1/lt-1/result
```

**MQTT** es un protocolo ligero de publicación/suscripción; los brokers actuales soportan las versiones 3.1.1 y 5, como documenta Microsoft para el broker en Azure IoT Operations [25]. **Sparkplug**, mantenido por el Eclipse Sparkplug Working Group, añade una convención de carga útil y de estado sobre MQTT; la versión 3.0 es la vigente. Sus "certificados de nacimiento y de defunción" indican a los suscriptores si los datos de un dispositivo siguen siendo válidos [28]. La estructura de temas propia de Sparkplug (grupo, nodo de borde, dispositivo) no es la jerarquía de ISA-95, por lo que las plantas que lo usan suelen asignar la jerarquía al ID de grupo (por ejemplo `spBv1.0/Plant1:Area3:Line4:Cell2/NDATA/<edge node>`) o repartir los niveles entre varios brokers o en un segundo espacio de nombres estructurado según ISA-95; un proveedor de brokers describe ambos patrones y advierte de que el número limitado de elementos de tema de Sparkplug hace que la asignación sea ajustada [44].

**Lo que un UNS cambia para el MES:**

| Sin UNS | Con UNS |
|---|---|
| El MES se conecta punto a punto con cada máquina, ERP, QMS y panel de control | El MES se suscribe a los temas de máquinas y órdenes y publica sus propios eventos (orden iniciada, operación completada, retención aplicada) |
| Los nuevos consumidores (un panel de control, un modelo de IA) necesitan una nueva interfaz con el MES | Los nuevos consumidores se suscriben a los temas existentes |
| El estado actual está disperso entre sistemas | El estado actual es visible en un solo lugar |

**Lo que un UNS no cambia:**

- **La lógica de negocio sigue en el MES.** El broker transporta mensajes; no garantiza que se use el material correcto, que un operario esté cualificado ni que un registro de lote esté completo.
- **Los registros de referencia siguen en los sistemas de registro.** Un broker guarda el estado actual, no un historial auditable. La trazabilidad, los registros de lote y las confirmaciones deben almacenarse de forma transaccional en el MES (y en el ERP), con pistas de auditoría cuando exista regulación.
- **La semántica sigue necesitando un modelo.** Un tema llamado `counts` no sirve de nada si una máquina cuenta ciclos y otra cuenta piezas buenas. Los objetos de ISA-95 y las especificaciones complementarias de OPC UA aportan la semántica de la carga útil.
- **La seguridad se vuelve más difícil, no más fácil.** Un broker en el que todos los sistemas pueden escribir es un objetivo de alto valor; el control de acceso por tema, los clientes autenticados y la segmentación según ISA/IEC 62443 son obligatorios [23][24].

**Debate: "el UNS sustituye a ISA-95".** Se oye esta afirmación. Confunde dos cosas. La propia postura de ISA es que los niveles siguen sirviendo para describir los límites de los sistemas aunque los datos ya no fluyan nivel a nivel [1], y la edición de 2025 de la Parte 1 apunta explícitamente a arquitecturas modulares orientadas a los datos [2]. La síntesis práctica: ISA-95 para el vocabulario, la jerarquía de equipos y las responsabilidades; el UNS (u otro bus de eventos) para el transporte; el MES y el ERP como sistemas de registro transaccionales.

### Arquitectura de integración: tres patrones comparados

| Patrón | Cómo funciona | Adecuado para | Precauciones |
|---|---|---|---|
| Punto a punto | Cada sistema tiene interfaces directas con los demás | Plantas pequeñas con 3 a 5 sistemas | Hasta n × (n − 1) ÷ 2 interfaces: 10 para 5 sistemas, 45 para 10; actualizaciones frágiles |
| Middleware de integración / ESB | Una capa central de integración transforma y enruta los mensajes | Empresas centradas en el ERP con equipos de integración de TI | Puede convertirse en un cuello de botella gestionado por un equipo lejano |
| Bus de eventos / UNS | Broker de publicación/suscripción con una convención común de temas y cargas útiles | Plantas con muchas máquinas y muchos consumidores de datos | Requiere gobernanza de temas, cargas útiles y accesos; los flujos transaccionales siguen necesitando entrega garantizada |

La mayoría de las plantas acaban con una combinación: un UNS para los datos de máquinas y de estado, y una integración con entrega garantizada para las transacciones del ERP.

## MES en industrias reguladas

En las industrias reguladas, el MES forma parte del sistema de calidad, y sus registros son registros legales. Esta sección presenta las normas de EE. UU. para las que debe diseñar; no sustituye el asesoramiento de su equipo de asuntos regulatorios.

### FDA 21 CFR Parte 11: registros y firmas electrónicas

Para los sistemas cerrados, 21 CFR 11.10 exige, entre otros controles, la validación de los sistemas para garantizar la exactitud, la fiabilidad y el funcionamiento coherente previsto; la capacidad de generar copias exactas y completas de los registros; la protección de los registros durante todo el periodo de conservación; la limitación del acceso al sistema a personas autorizadas; y "pistas de auditoría seguras, generadas por ordenador y con sello de tiempo" que registren la fecha y la hora de las entradas y acciones del operador que creen, modifiquen o eliminen registros, sin ocultar la información registrada previamente [19]. Otros apartados cubren las comprobaciones operativas y de autoridad, las comprobaciones de dispositivos, la formación y las políticas escritas.

**Qué significa esto para un MES:** cuentas de usuario por persona (sin inicios de sesión compartidos en el terminal), pistas de auditoría en cada registro regulado, firmas electrónicas vinculadas al registro que muestren el nombre del firmante, la fecha, la hora y el significado, y un paquete de validación. Planifique el trabajo de validación en tiempo y presupuesto; en farmacéutica suele representar una parte importante del esfuerzo de implantación [unverified: no hay un referente público sobre dicha proporción].

### Farmacéutica: registros electrónicos de lote

Los fabricantes de medicamentos deben conservar los registros de producción y control de cada lote con arreglo a las normas de buenas prácticas de fabricación recogidas en 21 CFR Parte 211; la sección 211.188 establece que "los registros de producción y control de lotes se prepararán para cada lote de producto farmacéutico fabricado" [38]. Un MES con registros electrónicos de lote (eBR) impone la secuencia de la receta, captura pesos y parámetros en origen y permite la **revisión por excepción**: el revisor de QA verifica las desviaciones que marca el sistema en lugar de leer cada página. Es uno de los casos de negocio más sólidos del MES en cualquier industria, porque el tiempo de revisión de los registros de lote suele limitar la liberación.

### Productos sanitarios: QMSR y registros históricos del dispositivo

Desde el 2 de febrero de 2026, el Reglamento del Sistema de Gestión de la Calidad (21 CFR Parte 820) de la FDA incorpora por referencia la norma ISO 13485:2016, incluidos sus requisitos de identificación y trazabilidad [20]. El término anterior "registro histórico del dispositivo" (DHR) sigue apareciendo en muchas descripciones de productos MES y en procedimientos de planta; la página del QMSR de la FDA no utiliza el término, por lo que recomendamos asignar sus registros a los requisitos de ISO 13485:2016 que incorpora el QMSR, y no a los antiguos números de sección de la Parte 820, y confirmar la correspondencia con asuntos regulatorios. El MES suele generar el registro tal como se fabricó por lote o número de serie: componentes, operaciones, inspecciones, equipos y personal.

### Alimentación: trazabilidad FSMA 204

La norma de trazabilidad de alimentos de la FDA (sección 204 de FSMA) exige elementos de datos clave para los eventos de trazabilidad críticos (recepción, transformación, expedición) vinculados a un código de lote de trazabilidad, con registros que deben facilitarse a la FDA en un plazo de 24 horas desde una solicitud; la FDA no la aplicará antes del 20 de julio de 2028 [29]. Los eventos de transformación se producen en la producción, por lo que el MES o un módulo de trazabilidad es el lugar natural para crear los códigos de lote y vincular las entradas con las salidas.

### Automoción y aeroespacial

IATF 16949 y AS9100 añaden requisitos de trazabilidad, plan de control y primer artículo; los requisitos específicos de cada cliente suelen ir más allá. En IATF 16949, la cláusula 8.5.2.1 complementa los requisitos de identificación y trazabilidad de ISO 9001 con planes de trazabilidad documentados basados en "los niveles de riesgo o gravedad de fallo para los empleados, los clientes y los consumidores", según una matriz comparativa de un organismo de certificación [39] (fuente secundaria; la norma es un texto de pago). Ambas normas son textos de pago; la guía de [planificación de la producción aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/) trata AS9100 y AS9102 en profundidad.

### Enfoque de validación

La guía final de la FDA *Computer Software Assurance for Production and Quality Management System Software* (CDRH y CBER, febrero de 2026) describe un enfoque basado en riesgos para establecer confianza en el software de producción y de sistemas de gestión de calidad, y para decidir dónde se necesita más rigor [40]. Está escrita para fabricantes de dispositivos médicos bajo 21 CFR Parte 820; los fabricantes de medicamentos pueden usarla como orientación, no como norma propia. En la práctica: clasifique cada función del MES por riesgo, pruebe a fondo con pruebas guionizadas las funciones de alto riesgo (firmas electrónicas, enclavamientos, cálculos, trazabilidad de genealogía) y use pruebas no guionizadas o suministradas por el proveedor para la configuración de bajo riesgo. Pida a los proveedores sus aceleradores de validación y su certificación propia de sistema de calidad.

## Opciones de despliegue y arquitectura

El mercado ha pasado de "una gran suite MES por planta" a un abanico más amplio de opciones. Se diferencian en dónde se ejecuta el software y en cómo está estructurado.

### Dónde se ejecuta: local, nube, híbrido

| Opción | Descripción | Ventajas | Desventajas |
|---|---|---|---|
| Local (on-premises) | Servidores MES en la planta o en el centro de datos de la empresa | Funciona cuando la WAN está caída; control total; familiar para los equipos de validación | Hardware, parcheo y actualizaciones son responsabilidad suya; las actualizaciones a menudo se posponen durante años |
| Nube (SaaS) | El proveedor ejecuta el MES en su nube; la planta se conecta mediante pasarelas | Arranque más rápido, actualizaciones gestionadas por el proveedor, coste por suscripción | Dependencia de la WAN; latencia para los enclavamientos; residencia de los datos; la cadencia de actualizaciones impuesta debe encajar con la validación |
| Híbrido / borde más nube | La ejecución crítica en tiempo se realiza en un nodo de borde en la planta; analítica y gestión en la nube | Sigue funcionando durante cortes; escala la analítica | Dos entornos que operar y asegurar; lógica de sincronización |

**Regla práctica:** todo lo que deba detener un paso incorrecto o mantener una línea en marcha debe funcionar cuando la conexión a internet está caída. Pida a cada proveedor de nube que demuestre el comportamiento sin conexión, no que lo describa.

### Cómo está estructurado: suite, plataforma, módulo de ERP

| Enfoque | Qué obtiene | Encaja con | Riesgos |
|---|---|---|---|
| Suite MES industrial | Funcionalidad amplia y preconfigurada para una o varias industrias, a menudo con funciones regulatorias | Plantas reguladas y complejas; estandarización multisitio | Proyectos largos, personalización intensa, dependencia del proveedor, coste de licencia elevado |
| Componible / plataforma de aplicaciones ("MES de nueva generación") | Una plataforma con herramientas de bajo código y conectores; la planta construye o configura aplicaciones para casos de uso concretos | Plantas que quieren empezar pequeñas y ampliar; operaciones de alta mezcla; equipos internos sólidos | Muchas aplicaciones pequeñas sin un modelo de datos común; gobernanza; validación de aplicaciones desarrolladas por usuarios |
| MES integrado con ERP | Módulo MES o producto complementario del proveedor de ERP | Empresas centradas en el ERP con complejidad moderada de planta | La usabilidad en planta y la integración con máquinas pueden quedar por detrás de productos especializados |
| Desarrollo a medida | Software propio sobre una plataforma general | Procesos únicos, equipo de software sólido | Usted asume el mantenimiento para siempre (sección 10) |

"MES componible" es un término de marketing de proveedores y analistas, no una categoría estándar. La idea de fondo, funciones pequeñas que comparten un mismo modelo de datos y que pueden añadirse con el tiempo, es sólida y coincide con la visión por actividades de ISA-95. El riesgo es el opuesto al del monolito: veinte aplicaciones que definen "orden" y "máquina" de forma distinta. La jerarquía de equipos y los modelos de objetos de ISA-95 son el antídoto.

### Plantillas multisitio

En empresas con varias plantas, la pregunta es menos "¿qué MES?" que "¿cuánta estandarización?". Un enfoque habitual es una **plantilla global** (modelo de datos, procesos centrales, interfaces, KPI) con extensiones locales. Limite la plantilla a lo que debe ser comparable entre sitios (definiciones de KPI según ISO 22400, genealogía, interfaz con el ERP); deje que los sitios difieran donde sus procesos difieran.

## Fabricar o comprar

La mayoría de las plantas deberían comprar (o suscribirse) y configurar. Desarrollar software propio tiene sentido en menos casos de los que creen los equipos de ingeniería, pero en más de los que admiten los proveedores.

### Factores de decisión

| Factor | Apunta a comprar | Apunta a desarrollar o a un desarrollo sobre plataforma |
|---|---|---|
| Singularidad del proceso | Los procesos se parecen a la práctica del sector | Los procesos son una diferenciación competitiva real y cambian con frecuencia |
| Regulación | Entorno validado y regulado (Part 11, GMP) | Entorno no regulado o con regulación ligera |
| Capacidad interna | No hay equipo de software, o el existente está completamente ocupado con el ERP | Equipo experimentado capaz de mantener el software durante más de 10 años |
| Alcance | Amplio: ejecución, calidad, trazabilidad, programación | Acotado: captura de datos y OEE, instrucciones de trabajo digitales |
| Tiempo | Se necesitan resultados en meses | Se puede invertir en un desarrollo más largo |
| Coste total a 10 años | La licencia más la configuración es menor que un equipo | El coste del equipo ya está asumido y es estable |
| Riesgo por dependencia de personas clave | Inaceptable | Mitigado con documentación y un equipo de tamaño suficiente |

### El coste oculto de desarrollar

Un MES a medida no tiene cuota de licencia, pero hay que pagar por los requisitos, el desarrollo, las pruebas, la documentación, el alojamiento, los parches de seguridad, las actualizaciones de la plataforma subyacente, el soporte a las 3 de la madrugada y, en sectores regulados, la validación de cada cambio. El fallo más habitual no está en la primera versión, sino en el año cinco, cuando el desarrollador original ya se ha marchado y la planta funciona con un software que nadie se atreve a modificar.

### Un camino intermedio

Muchas plantas compran una plataforma o un MES para el núcleo (ejecución, trazabilidad, interfaz con el ERP) y desarrollan aplicaciones o cuadros de mando específicos encima, utilizando sus API o herramientas de bajo código. Esto funciona cuando el núcleo comprado es dueño del modelo de datos y las partes a medida solo leen de él o utilizan API documentadas.

## Lista de verificación para la selección de proveedores de MES

La tabla siguiente es una lista de verificación para la selección, con 30 criterios repartidos en ocho grupos. Asigne pesos a los grupos según su situación (los pesos sugeridos corresponden a una planta discreta de tamaño medio con regulación ligera), puntúe a cada proveedor de 0 a 4 en cada criterio y, lo más importante, utilice la columna **método de prueba**: ningún criterio debe puntuarse a partir de una presentación de diapositivas.

| # | Grupo (peso sugerido) | Criterio | Cómo probarlo |
|---|---|---|---|
| 1 | Ajuste funcional (25%) | Cubre sus principales casos de uso de la matriz de actividades ISA-95 | Demostración guiada con sus propios productos, rutas y una orden real |
| 2 | Ajuste funcional | Instrucciones de trabajo: visuales, versionadas, con cumplimiento obligatorio de los pasos | El operario crea y ejecuta una instrucción durante la demostración |
| 3 | Ajuste funcional | Trazabilidad al nivel que necesita (lote, serie, ambos) | Trazabilidad hacia adelante y hacia atrás con datos de demostración en menos de 60 segundos |
| 4 | Ajuste funcional | Calidad en la ejecución: controles, SPC, retenciones, no conformidades | Forzar un control fallido y mostrar qué se detiene |
| 5 | Ajuste funcional | Paradas y OEE según su modelo de tiempos | Configurar sus códigos de motivo y reglas de paradas planificadas |
| 6 | Ajuste funcional | Profundidad de programación y despacho (o integración con APS) | Reprogramar tras una avería de máquina |
| 7 | Integración (15%) | Conector ERP para su ERP y versión | Cliente de referencia con el mismo ERP; revisar la documentación de interfaces |
| 8 | Integración | Conectividad con máquinas: OPC UA, MTConnect, las marcas de sus PLC | Conectar una de sus máquinas en una prueba de concepto |
| 9 | Integración | APIs abiertas (REST, eventos), documentadas y versionadas | Un desarrollador lee la documentación de la API y construye una consulta sencilla |
| 10 | Integración | Soporte de objetos ISA-95 o B2MML | Solicitar el mapeo del modelo de datos a ISA-95 |
| 11 | Integración | Publicación de eventos a MQTT / UNS | Mostrar eventos en un broker durante la demostración |
| 12 | Datos y arquitectura (10%) | El modelo de datos sigue o se mapea a la jerarquía de equipos ISA-95 | Revisar la configuración del modelo de equipos |
| 13 | Datos y arquitectura | Capacidad offline en el edge | Desconectar la WAN durante la prueba de concepto |
| 14 | Datos y arquitectura | Exportación y propiedad de los datos: puede obtener todos los datos en formatos abiertos | Cláusula contractual más una exportación de prueba |
| 15 | Datos y arquitectura | Capacidad de plantillas multisitio | Referencia con tres o más sitios |
| 16 | Usabilidad (10%) | Pantallas de operario usables con guantes, en tabletas y con ruido | Dos operarios las prueban sin formación durante 30 minutos |
| 17 | Usabilidad | Configuración por supervisores e ingenieros sin código | El ingeniero modifica un paso de ruta y un control |
| 18 | Usabilidad | Idiomas que lee su plantilla | Mostrar las pantallas en cada idioma |
| 19 | Cumplimiento y seguridad (10%) | Funciones de la Parte 11 si se necesitan (pista de auditoría, firma electrónica) | Demostrar la pista de auditoría sobre un registro modificado |
| 20 | Cumplimiento y seguridad | Desarrollo seguro y certificación de seguridad del producto (p. ej., ISA/IEC 62443-4-1/4-2) | Certificados y la política de divulgación de vulnerabilidades del proveedor [23] |
| 21 | Cumplimiento y seguridad | Integración de identidad (SSO, MFA para administradores, modelo de roles) | Configurar roles de operario, supervisor y calidad |
| 22 | Cumplimiento y seguridad | Documentos de soporte para la validación | Revisar el paquete de validación |
| 23 | Proveedor y socios (10%) | Solidez financiera y propiedad | Memorias anuales o informe de solvencia; cambios de propiedad en los últimos cinco años |
| 24 | Proveedor y socios | Socio de implementación con referencias en su sector y región | Llamar a dos referencias sin la presencia del proveedor |
| 25 | Proveedor y socios | Hoja de ruta del producto y cadencia de versiones | Hoja de ruta bajo NDA; ¿con qué frecuencia actualizan realmente los clientes? |
| 26 | Proveedor y socios | Modelo de soporte y horario | Texto del SLA; ¿quién responde a las 2 a. m. de un sábado? |
| 27 | Coste (15%) | Coste total de propiedad a cinco años | Su modelo de TCO (sección 13) completado con las ofertas del proveedor |
| 28 | Coste | El modelo de licencias se ajusta al crecimiento (por sitio, por usuario, por máquina, por consumo) | Valorar hoy el escenario de expansión a 3 años |
| 29 | Coste | Coste de actualizaciones y personalizaciones | Preguntar cuánto costó una actualización a un cliente de referencia |
| 30 | Salida (5%) | Plan de salida: datos, configuraciones, documentación al terminar el contrato | Cláusula contractual; preguntar cómo migró un cliente anterior a otra solución |

**Puntuación:** puntuación ponderada = suma, para cada grupo, de (peso del grupo × puntuación media de los criterios ÷ 4). Un proveedor con 78 por ciento supera a uno con 72 por ciento solo si ninguno tiene criterio eliminatorio: cualquier criterio puntuado con 0 en ajuste funcional, capacidad offline (si se requiere) o cumplimiento debe descartar al proveedor independientemente del total.

**Consejos de proceso:**

- Redacte la solicitud de propuesta (RFP) en torno a casos de uso y a la matriz de actividades, no a una lista de funciones de 600 líneas. Las listas de funciones reciben un "sí" en cada línea.
- Exija una prueba de concepto (PoC) de pago en una línea con sus propios datos antes de la decisión final. Un rango típico es de dos a seis semanas [unverified: estimación de profesionales del sector].
- Deje que los operarios y supervisores evalúen la facilidad de uso y que finanzas evalúe el coste; mantenga las puntuaciones por separado hasta el final.
- Como punto de partida neutral respecto a proveedores, las reseñas de analistas (Gartner Peer Insights incluye el mercado de MES [8]) y las referencias de plantas homólogas resultan más útiles que las clasificaciones de proveedores publicadas por los propios proveedores.

## Hoja de ruta de implementación de MES

La hoja de ruta siguiente es para una única planta de tamaño medio. Las duraciones son supuestos de planificación para un producto configurado, no valores de referencia; las plantas reguladas y los desarrollos a medida tardan más [unverified: estimaciones de profesionales del sector].

| Fase | Duración (supuesto típico) | Actividades principales | Criterios de salida |
|---|---|---|---|
| 0. Caso y alcance | De 4 a 8 semanas | Enunciado del problema, recorrido por la cadena de valor, matriz de actividades ISA-95 en estado actual, KPI de referencia, borrador del caso de negocio | Patrocinador, rango de presupuesto y una cadena de valor piloto aprobados |
| 1. Requisitos y selección | De 8 a 16 semanas | Casos de uso, modelo de datos (jerarquía de equipos, responsable de datos maestros), RFP, demostraciones con guion, prueba de concepto | Proveedor y socio seleccionados, contrato con cláusulas de salida y de datos |
| 2. Diseño | De 6 a 10 semanas | Diseño de la solución, especificaciones de interfaces, modelo de tiempos y códigos de motivo, estándares de instrucciones de trabajo, plan de validación (si hay regulación), diseño de seguridad | Diseño firmado, plan de pruebas |
| 3. Construcción y prueba del piloto | De 10 a 20 semanas | Configuración, conectividad con máquinas, interfaz con ERP, migración de datos, ciclos de prueba, formación de operarios | Aceptación de usuario en la línea piloto |
| 4. Puesta en marcha del piloto y estabilización | De 6 a 12 semanas | Puesta en marcha con hipercare, revisión diaria de incidencias, comparación de KPI con la referencia | KPI estables durante 4 semanas consecutivas; defectos abiertos por debajo del umbral acordado |
| 5. Despliegue | De 3 a 6 meses por oleada | Más líneas y áreas; plantilla refinada | Todas las áreas incluidas en el alcance en producción |
| 6. Mejora continua | Continua | Nuevos casos de uso, actualizaciones, mejora basada en KPI | Gestionada por la planta, no por el proyecto |

### Fase 0 en detalle: empiece por la cadena de valor

Recorra primero la cadena de valor. Cartografíe dónde la información se retrasa, se vuelve a introducir a mano o falta, y dónde se originan las fugas de calidad o los plazos largos de entrega. La guía de [mapeo de la cadena de valor](https://www.m365.fm/en/learn/value-stream-mapping/) explica cómo hacerlo; un mapa del estado actual con el flujo de información dibujado es el mejor documento de requisitos de MES que puede producir en una semana. Elija un piloto lo bastante importante como para que importe y lo bastante acotado como para terminarlo: una línea o una familia de productos con un problema claro.

### Fase 1 en detalle: el modelo de datos antes que el software

Defina la jerarquía de equipos (sección 4), el responsable de datos maestros de cada objeto (material, ruta, equipos, personal), el modelo de tiempos para la OEE (qué se considera tiempo de producción planificado) y el modelo de estados de órdenes y operaciones. Si no puede acordar estos puntos con ERP, calidad y mantenimiento antes de la selección, ningún proveedor se lo resolverá.

### Lista de comprobación para la puesta en marcha

| Comprobación | Hecho |
|---|---|
| Datos maestros de los productos piloto verificados en planta (pasos de ruta, lista de materiales, instrucciones) | ☐ |
| Cada operario formado en su propio puesto con órdenes reales, no solo en aula | ☐ |
| Procedimiento de respaldo (hoja de ruta en papel) impreso y probado ante una caída del MES | ☐ |
| Interfaz con ERP probada con casos de error (ERP caído, mensaje duplicado, cantidad incorrecta) | ☐ |
| Códigos de motivo y controles revisados con los operarios | ☐ |
| Plan de guardia de hipercare para las dos primeras semanas, en todos los turnos | ☐ |
| KPI de referencia congelados para la comparación | ☐ |
| Seguridad: cuentas, roles, MFA para administradores, copias de seguridad probadas | ☐ |
| Regulado: informe resumen de validación aprobado antes del uso en producción | ☐ |

### Roles

| Rol | Responsabilidad |
|---|---|
| Patrocinador ejecutivo (director de planta o VP de operaciones) | Decide los conflictos de alcance, protege los recursos |
| Propietario del producto desde operaciones | Responsable de los casos de uso y las prioridades; firma la aceptación |
| Responsable de MES / arquitecto de soluciones | Diseño, modelo de datos, integración |
| Ingeniero de TI/OT | Infraestructura, redes, conectividad de máquinas, seguridad |
| Calidad y regulación | Controles, registros, validación |
| Usuarios clave por área y turno | Prueban, forman a sus compañeros, dan retroalimentación |
| Socio de finanzas | Caso de negocio, seguimiento de beneficios |
| Proveedor / integrador | Configuración, conocimiento del producto |

## Costo y ROI de un MES con un ejemplo práctico

"¿Cuánto cuesta un MES?" no tiene una cifra única y honesta. Los precios dependen del alcance, del número de líneas y usuarios, del modelo de despliegue, de la regulación y del esfuerzo de integración, y los proveedores rara vez los publican. Algunas páginas web citan rangos sin fuente; nosotros no los repetimos. En su lugar, aquí tiene una estructura para su propio costo total de propiedad y un ejemplo práctico con **supuestos ilustrativos** que usted debe reemplazar con sus cotizaciones y sus líneas base.

### Estructura de costos

| Bloque de costo | Único | Recurrente | Notas |
|---|---|---|---|
| Software | Licencia perpetua (si aplica) | Suscripción o mantenimiento (a menudo un porcentaje de la licencia al año) | Verifique la métrica: sitio, usuario, máquina, consumo |
| Servicios de implementación | Configuración, interfaces, migración de datos, gestión del proyecto | Solicitudes de cambio | Normalmente el mayor bloque único |
| Hardware y red | Terminales, tabletas, escáneres, impresoras de etiquetas, servidores de borde, Wi-Fi, cableado | Ciclo de reemplazo | A menudo subestimado en plantas antiguas |
| Conectividad de máquinas | Pasarelas, programación de PLC, adaptaciones para máquinas antiguas | Mantenimiento | Precio por tipo de máquina, no por máquina |
| Equipo interno | Equipo del proyecto, usuarios clave, cobertura de sus tareas habituales | Soporte MES, administración, mejora continua | Cuente el costo cargado |
| Capacitación | Diseño de la capacitación y sesiones | Nuevas contrataciones, refrescos | |
| Validación (regulada) | Plan de validación, protocolos, ejecución | Revalidación tras cambios y actualizaciones | |
| Alojamiento y operaciones | Puesta en marcha | Tarifas de nube u operación de servidores, respaldos, monitoreo de seguridad | |

**Capex frente a opex:** un MES por suscripción suele ser opex; las licencias perpetuas, el hardware y algunos costos de implementación pueden capitalizarse según su política contable. Según US GAAP, el ASC 350-40 rige el software de uso interno. Desde el ASU 2018-15 (agosto de 2018), los costos de implementación de un acuerdo de nube que es un contrato de servicio siguen las mismas etapas de capitalización, pero los costos capitalizados se presentan como las tarifas de alojamiento prepagadas, se amortizan durante el plazo de alojamiento y se muestran en la misma línea del estado de resultados que la tarifa [41]. El ASU 2025-06 (septiembre de 2025) modifica nuevamente el ASC 350-40, con vigencia para los periodos anuales que comiencen después del 15 de diciembre de 2027, y se permite la adopción anticipada [42]. Acuerde el tratamiento con su auditor. La elección contable cambia el EBITDA y el momento de los costos, no la economía.

### Estructura de beneficios

| Línea de beneficio | Fórmula | Fuente de datos |
|---|---|---|
| Producción adicional en el cuello de botella | Horas productivas añadidas × margen de contribución por hora | Registro MES o manual de paradas, finanzas (solo si existe demanda) |
| Reducción de chatarra y retrabajo | Costo anual de chatarra y retrabajo × reducción esperada | Informes de costos de calidad |
| Tiempo de mano de obra en papeleo y captura de datos | Horas ahorradas × tarifa cargada × porcentaje realmente reasignado | Estudio de tiempos, entrevistas |
| Reducción de WIP e inventario | Liberación de caja única; costo de mantenimiento × reducción por año | Valoración de inventarios |
| Liberación más rápida de lotes u órdenes | Reducción del plazo de entrega × valor (inventario, entrega a tiempo) | Tiempos de revisión de calidad, datos de órdenes |
| Costo evitado de cumplimiento o retiro de producto | Probabilidad × impacto, normalmente fuera del caso base | Registro de riesgos |

### Ejemplo práctico: una planta de válvulas de 220 empleados

**Situación (todas las cifras son ilustrativas):** cuatro líneas, dos turnos, ingresos de 85 millones de dólares. La línea 2 es el cuello de botella. Hojas de ruta en papel, confirmaciones de ERP al final del turno, sin captura automática de paradas.

**Costos únicos (año 0):**

| Concepto | Importe |
|---|---|
| Servicios de implementación | 450.000 USD |
| Hardware, red, conectividad de máquinas | 160.000 USD |
| Equipo interno del proyecto (2,5 FTE durante 12 meses a 120.000 USD cargados) | 300.000 USD |
| Capacitación y cobertura | 60.000 USD |
| **Total único** | **970.000 USD** |

**Costos recurrentes (desde el año 1):** suscripción 180.000 USD + soporte MES interno 1 FTE 120.000 USD = **300.000 USD por año**.

**Beneficios con efecto total (caso base):**

| Beneficio | Cálculo | Por año |
|---|---|---|
| OEE en la línea 2 de 62 % a 67 % | 4.000 horas planificadas × 5 puntos = 200 horas productivas adicionales × 2.000 USD de margen de contribución por hora | 400.000 USD |
| Reducción de chatarra | 1,2 millones de USD de costo de chatarra × 15 % | 180.000 USD |
| Tiempo de papeleo | 4.000 horas × 45 USD cargados × 50 % reasignado | 90.000 USD |
| Costo de mantenimiento del WIP | 3,0 millones de USD de WIP × 10 % de reducción × 20 % de tasa de mantenimiento | 60.000 USD |
| **Beneficio anual total** | | **730.000 USD** |

Además, una liberación de caja única por WIP: 3,0 millones de USD × 10 % = 300.000 USD (supuesto para el año 2).

**Rampa de arranque:** el año 1 aporta el 40 por ciento del beneficio anual (piloto y despliegue); los años 2 a 5 aportan el 100 por ciento.

**Flujos de caja (en miles de $), tasa de descuento 10 %:**

| Año | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Caso base | −970 | 730 × 0,4 − 300 = −8 | 730 − 300 + 300 = 730 | 430 | 430 | 430 |
| Acumulado | −970 | −978 | −248 | 182 | 612 | 1.042 |

VAN al 10 % = −970 − 8/1,1 + 730/1,1² + 430/1,1³ + 430/1,1⁴ + 430/1,1⁵ ≈ **+510.000 $**. Plazo de recuperación simple: el flujo de caja acumulado se vuelve positivo durante el año 3, unos 2,6 años después del inicio del proyecto (248 ÷ 430 = 0,58 del año 3).

**Caso conservador:** la mejora de OEE es solo la mitad (o no se puede vender toda la producción adicional): 200.000 $ en lugar de 400.000 $; reducción de chatarra del 10 % (120.000 $) en lugar del 15 %. Beneficio anual de 470.000 $, neto de 170.000 $ al año.

| Año | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Caso conservador | −970 | 470 × 0,4 − 300 = −112 | 470 − 300 + 300 = 470 | 170 | 170 | 170 |
| Acumulado | −970 | −1.082 | −612 | −442 | −272 | −102 |

VAN al 10 % ≈ **−334.000 $**; no hay recuperación dentro de cinco años.

**Sensibilidad:** manteniendo los beneficios de chatarra, papeleo y trabajo en curso en el caso base, el proyecto alcanza el punto de equilibrio (VAN = 0 al 10 %) con un beneficio por rendimiento de unos 243.000 $ anuales, lo que equivale a unas 121 horas productivas adicionales o aproximadamente 3 puntos de OEE en la Línea 2 en lugar de 5. Si solo se materializa la mitad de la mejora de OEE y el resto se mantiene, el VAN es de unos −139.000 $. La sensibilidad a esa única hipótesis es el verdadero hallazgo.

**Lo que enseña el ejemplo:**

1. **Una sola línea domina.** El beneficio por rendimiento supone más de la mitad del caso base. Antes de contabilizarlo, confirme con ventas que la planta está limitada por capacidad en esa línea, o use la guía de [teoría de restricciones](https://www.m365.fm/en/learn/theory-of-constraints/) para identificar primero la restricción real.
2. **El coste recurrente importa más de lo que sugiere la línea de licencias.** El soporte interno representa aquí el 40 por ciento del coste recurrente y a menudo se omite.
3. **La rampa de arranque destruye el VAN.** Un piloto que se alarga 18 meses en lugar de 12 empuja el caso conservador aún más hacia pérdidas. La velocidad hasta la primera línea estable es una variable financiera.
4. **Los beneficios no cuantificados son reales, pero se presentan aparte.** La reducción del alcance de retiradas, la preparación para auditorías y los requisitos de clientes pueden justificar por sí solos un MES en cadenas de suministro reguladas o impulsadas por OEM. Muéstrelos junto a las cifras, no dentro de ellas.
5. **Haga seguimiento de los beneficios tras la puesta en marcha** frente a la línea base congelada, junto con finanzas, durante al menos dos años.

Para las definiciones de KPI y costes en que se basan estas cifras, consulte los [KPI de fabricación](https://www.m365.fm/en/learn/manufacturing-kpis/).

## KPIs de MES: qué medir y cómo

Un MES genera los datos de la mayoría de los KPIs de planta. Dos grupos son importantes: los KPIs operativos que calcula el MES y los KPIs que indican si el propio MES funciona correctamente.

### Definiciones estándar: ISO 22400

ISO 22400-2:2014 define los indicadores clave de rendimiento para la gestión de operaciones de fabricación, con fórmula, unidad, momento de cálculo y grupo de usuarios para cada uno [16]; fuentes secundarias cuentan 34 KPIs en la norma [18], y una enmienda de 2017 añadió KPIs de gestión energética [16]. Usar sus definiciones hace que los KPIs sean comparables entre líneas y plantas. Investigadores del NIST publicaron una estructura jerárquica de estos KPIs con fórmulas, disponible de forma gratuita [17].

### KPIs operativos del MES

| KPI | Fórmula (simplificada) | Uso típico |
|---|---|---|
| OEE | Disponibilidad × rendimiento × calidad | Cuello de botella y equipos clave |
| Disponibilidad | Tiempo de funcionamiento ÷ tiempo de producción planificado | Enfoque en paradas |
| Rendimiento | (Tiempo de ciclo ideal × cantidad total) ÷ tiempo de funcionamiento | Pérdidas de velocidad, microparadas |
| Calidad (tasa) | Cantidad buena ÷ cantidad total | Scrap y retrabajo |
| Rendimiento al primer paso | Unidades que pasan sin retrabajo ÷ unidades iniciadas | Capacidad del proceso |
| Ratio de scrap | Cantidad de scrap ÷ cantidad producida | Pérdida de material |
| Cumplimiento del programa | Órdenes (o cantidad) completadas según lo programado ÷ programadas | Estabilidad del plan |
| Throughput | Unidades buenas por hora | Capacidad |
| WIP | Unidades o valor entre la primera y la última operación | Flujo |
| Lead time de orden | Tiempo de finalización − tiempo de liberación | Capacidad de respuesta al cliente |
| MTBF / MTTR | Tiempo de operación ÷ fallos; tiempo de reparación ÷ fallos | Mantenimiento |

**Ejemplo de cálculo de OEE (un turno en la Línea 2):** tiempo de producción planificado 450 minutos, paradas no planificadas 60 minutos, por lo que el tiempo de funcionamiento es 390 minutos. Tiempo de ciclo ideal 1,0 minuto, cantidad total 340, cantidad buena 323.

- Disponibilidad = 390 ÷ 450 = 86,7 %
- Rendimiento = (1,0 × 340) ÷ 390 = 87,2 %
- Calidad = 323 ÷ 340 = 95,0 %
- OEE = 0,867 × 0,872 × 0,950 = **71,8 %**

Verificación cruzada: cantidad buena × tiempo de ciclo ideal ÷ tiempo de producción planificado = 323 ÷ 450 = 71,8 %. Si su MES no supera esta verificación, su modelo de tiempos es inconsistente. Muchiri y Pintelon revisan las definiciones de OEE en uso y sus errores habituales [30]; la guía [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/) profundiza más.

### KPIs del propio MES

| KPI | Definición | Dirección del objetivo |
|---|---|---|
| Latencia de datos | Tiempo desde el evento en planta hasta su disponibilidad en MES / ERP | A la baja (minutos, no días) |
| Tasa de captura automática | Proporción de cantidades y estados capturados desde máquinas frente a los introducidos a mano | Al alza |
| Tasa de corrección manual | Correcciones por cada 100 órdenes | A la baja |
| Cobertura de códigos de motivo | Proporción de minutos de parada con un motivo válido | Al alza (por encima del 90 % es un objetivo habitual) |
| Tiempo de trazabilidad | Minutos necesarios para producir una trazabilidad hacia atrás completa de un número de serie o lote | A la baja |
| Adopción | Proporción de órdenes ejecutadas íntegramente en el MES (sin desvíos en papel, salvo el procedimiento documentado de contingencia por caída del sistema) | Al alza (el estado final es el 100 %; los desvíos persistentes indican un problema de diseño, no de operadores) |
| Tasa de error de interfaces | Registros fallidos o rechazados por día | A la baja |
| Disponibilidad del MES | Tiempo de actividad durante las horas de producción | Al alza |

## Personas y piso de planta

Un MES cambia la forma en que trabajan los operarios en cada minuto del turno. Las plantas que lo tratan como un proyecto de TI suelen acabar con soluciones alternativas; las que lo tratan como un cambio en el trabajo logran su adopción.

**Lo que ganan los operarios:** instrucciones actualizadas en el puesto en lugar de una carpeta, menos formularios, ayuda más rápida cuando algo sale mal (llamadas andon desde el terminal; véase el [andon](https://www.m365.fm/en/learn/shop-floor-management/andon/) en profundidad) y menos culpabilización cuando el sistema muestra que una parada fue causada aguas arriba.

**Lo que temen los operarios, a menudo con razón:** ser monitorizados minuto a minuto, verse bloqueados por un sistema que se equivoca y perder su criterio ante una pantalla. Aborde cada punto directamente:

- **Monitorización:** Decida y publique qué datos de mano de obra registra el MES, quién los ve y para qué se usan. Utilice los datos de rendimiento para mejorar el proceso, no para clasificar a las personas. En plantas sindicalizadas, la introducción de la monitorización electrónica y los cambios en las normas de trabajo pueden ser materia de negociación obligatoria; involucre al sindicato desde el principio y obtenga la opinión del asesor legal laboral [unverified: la valoración legal depende del convenio colectivo y de la doctrina vigente de la NLRB].
- **Verse bloqueado por un sistema erróneo:** Ofrezca a los operarios una vía rápida y visible para notificar una instrucción incorrecta o un bloqueo erróneo, y resuelva esos avisos en cuestión de días. Cada aviso sin resolver enseña a la planta a buscar una solución alternativa.
- **Criterio:** Use paradas obligatorias solo para los pasos críticos para la seguridad o la calidad. Para el resto, advierta y registre.

**Involucre a los operarios en el diseño.** Dos o tres operarios por área en los talleres de diseño, operarios que prueban las pantallas antes de la puesta en marcha y operarios como formadores entre compañeros son una opción barata y eficaz. El respeto por las personas es un dato de entrada del diseño, no una diapositiva de gestión del cambio; véase [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) para el principio.

**Ergonomía y seguridad en los terminales:** coloque los terminales donde se realiza el trabajo, a altura de pie, legibles con la iluminación de la planta y utilizables con guantes. Los escáneres no deben añadir desplazamientos. Un MES que añada 30 segundos por operación a un takt de 60 segundos ha fracasado antes de la puesta en marcha.

## Errores comunes en la implantación de un MES

| # | Error | Qué sucede | Mejor opción |
|---|---|---|---|
| 1 | Comprar funcionalidades antes de definir el modelo de datos | Las interfaces fallan por identificadores que no coinciden; los KPI difieren entre sistemas | Primero la jerarquía de equipos, los responsables de los datos maestros y el modelo temporal |
| 2 | Digitalizar uno a uno el proceso actual en papel | El mismo desperdicio, ahora en una pantalla | Simplificar primero el proceso en el recorrido por la cadena de valor |
| 3 | Abarcar "todo lo de la lista MESA-11" | Proyecto de varios años, nada en producción | Una cadena de valor, de tres a cinco casos de uso, operativos en meses |
| 4 | Personalizar en lugar de configurar | Las actualizaciones se convierten en proyectos; el proveedor rechaza dar soporte | Aceptar procesos estándar donde no sean un factor diferenciador |
| 5 | Sin participación de los operarios | Soluciones alternativas, sistemas paralelos en papel | Operarios en el diseño, las pruebas y la formación |
| 6 | ERP y MES gestionan los mismos datos | Cantidades y tiempos contradictorios | Un único maestro por atributo, documentado |
| 7 | Paradas obligatorias en todas partes | Las líneas se detienen por motivos triviales; la confianza se derrumba | Paradas obligatorias solo donde lo exijan la seguridad o la calidad |
| 8 | Ignorar la red y los terminales | Pantallas lentas, escaneos perdidos | Estudio de emplazamiento y mejora de la red en la fase 2 |
| 9 | Sin alternativa ante caídas | La producción se detiene cuando falla el MES o la WAN | Procedimiento de respaldo en papel probado y capacidad offline en el edge |
| 10 | Diseño de seguridad deficiente | Red plana entre oficina y máquinas | Zonas y conductos según ISA/IEC 62443; mínimo privilegio [23][24] |
| 11 | Sin responsable tras la puesta en marcha | El MES se degrada; baja la calidad de los datos | Equipo del MES propio de la planta e indicador de adopción |
| 12 | Beneficios nunca medidos | El caso de negocio del siguiente centro no tiene evidencias | Línea base congelada; Finanzas hace seguimiento de los beneficios durante dos años |
| 13 | Validación subestimada (sector regulado) | Retrasos de meses | Validación basada en riesgos planificada desde la fase 1 |
| 14 | Tratar el UNS o la plataforma de datos como el MES | Datos en todas partes, sin aplicación de reglas, sin registros | MES para la ejecución y los registros; UNS para la distribución |

## Límites de MES e ISA-95

Reconocer los límites ayuda a decidir qué no comprar.

### Límites del MES

1. **Un MES no arregla un proceso roto.** Si las hojas de ruta son incorrectas, faltan materiales o la planta opera sin trabajo estandarizado, el MES hace visibles estos problemas, más rápido. Eso es útil, pero no es la solución. Primero los fundamentos de Lean; véase [lean manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/) y [5S y gestión visual](https://www.m365.fm/en/learn/5s-visual-management/).
2. **La calidad de los datos depende de las personas.** Las entradas manuales, los escaneos y los códigos de motivo solo son tan buenos como la disciplina y el diseño de las pantallas.
3. **Los sistemas rígidos se resisten al cambio.** Un MES muy personalizado puede hacer más lentas las introducciones de productos y los cambios de proceso, lo contrario de lo que necesitan las plantas de alta mezcla.
4. **El coste y el esfuerzo son altos para las plantas pequeñas.** En un taller de 30 personas, el control de piso de planta del ERP, una herramienta sencilla de captura de datos y una buena gestión visual pueden aportar la mayor parte del valor.
5. **Planificar no es ejecutar.** Un MES con módulo de programación no sustituye la planificación de ventas y operaciones ni el MRP; véase [S&OP, MRP y planificación de producción](https://www.m365.fm/en/learn/sop-mrp-production-planning/).
6. **La analítica a gran escala pertenece a otro lugar.** La analítica entre plantas, la IA y el historial a largo plazo suelen corresponder a una plataforma de datos alimentada por el MES, no al interior del MES. La guía sobre el [gemelo digital](https://www.m365.fm/en/learn/digital-twin-manufacturing/) y el análisis en profundidad de [process mining](https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/) muestran lo que los datos del MES pueden alimentar.

### Límites de ISA-95

1. **Es abstracta.** ISA-95 es agnóstica respecto a la tecnología por diseño [1]. Indica qué nombrar e intercambiar, no cómo construirlo, por lo que dos productos "conformes con ISA-95" pueden seguir siendo difíciles de integrar.
2. **El modelo de niveles no es una ruta de datos.** Leído literalmente, la jerarquía sugiere que los datos se mueven nivel por nivel mediante interfaces punto a punto. Las arquitecturas modernas (UNS, streaming de eventos, nube) no funcionan así; la propia ISA enfatiza ahora los niveles como fronteras, no como tuberías [1][2].
3. **Los textos del estándar son de pago y extensos.** Muchos equipos trabajan con resúmenes secundarios, lo que lleva a interpretaciones inconsistentes. Compre al menos las Partes 1 y 3 para la biblioteca del proyecto.
4. **La conformidad no está certificada.** No existe una certificación formal de ISA-95 para productos, como sí tiene ISA/IEC 62443 con sus esquemas de certificación de seguridad de producto [unverified: no se encontró ningún programa de certificación de productos ISA-95]. "Conforme con ISA-95" en un folleto es una afirmación del proveedor.
5. **En la práctica, las fronteras se trazan de forma distinta.** La programación, la calidad y el mantenimiento residen en sistemas diferentes en cada planta; el modelo de actividades los acomoda, pero no decide por usted.

## Glosario

| Término | Significado |
|---|---|
| Modelo de actividades | Modelo de las actividades de Nivel 3 de la Parte 3 de ISA-95: cuatro categorías de operaciones, ocho actividades genéricas cada una [3] |
| APS | Planificación y programación avanzadas; software de programación de capacidad finita |
| Registro as-built | Registro de cómo se fabricó realmente una unidad o lote específico |
| B2MML | Business To Manufacturing Markup Language; implementación en XML de los objetos de ISA-95, creada por MESA [5] |
| Registro de lote (eBR) | Registro de producción y control de un lote; registro electrónico de lote cuando se conserva en un MES |
| CMMS / EAM | Sistema computarizado de gestión de mantenimiento / gestión de activos empresariales |
| MES componible | Término de proveedor para un MES construido a partir de aplicaciones más pequeñas sobre una plataforma común |
| Programación detallada | Actividad de ISA-95 que secuencia el trabajo en los recursos dentro del Nivel 3 [3] |
| Registro histórico del dispositivo (DHR) | Término de dispositivos médicos para el registro de producción de un dispositivo o lote; véase QMSR [20] |
| Despacho | Liberación del siguiente trabajo a un recurso [3] |
| Jerarquía de equipos | Estructura basada en roles de ISA-95: empresa, sitio, área, centro de trabajo, unidad de trabajo |
| ERP | Planificación de recursos empresariales; sistema empresarial de Nivel 4 de ISA-95 |
| Genealogía | Vínculos entre los materiales de entrada y las unidades de salida (trazabilidad hacia adelante y hacia atrás) |
| Historiador | Base de datos de series temporales para valores de proceso |
| IEC 62264 | Publicación internacional de ISA-95 [1][7] |
| ISA-88 | Norma para control por lotes, utilizada para las estructuras de recetas |
| ISA-95 | ANSI/ISA-95, Integración de sistemas empresariales y de control, ocho partes [1] |
| ISA/IEC 62443 | Serie de normas para la seguridad de los sistemas de automatización y control industrial [23] |
| ISO 22400 | Norma para KPI en la gestión de operaciones de fabricación [16] |
| LIMS | Sistema de gestión de información de laboratorio |
| MES | Sistema de ejecución de fabricación; software de Nivel 3 orientado a la producción para ejecutar y registrar la producción [8] |
| MESA-11 | Modelo de 11 funciones MES de MESA International de 1997 [9][12] |
| MOM | Gestión de operaciones de fabricación; Nivel 3 de ISA-95 en su conjunto |
| MQTT | Protocolo ligero de mensajería de publicación/suscripción, común en IIoT |
| MTConnect | Estándar abierto para datos de equipos de fabricación (ANSI/MTC1.4-2018) [22] |
| OEE | Eficiencia global de los equipos = disponibilidad × rendimiento × calidad |
| OPC UA | Estándar de comunicación industrial y modelado de información independiente del proveedor, de la OPC Foundation |
| Parte 11 | 21 CFR Parte 11, normas de la FDA para registros y firmas electrónicos [19] |
| Modelo de Purdue | Modelo de referencia de Purdue para la fabricación integrada por computadora, base de los niveles de ISA-95 [1] |
| QMS | Sistema de gestión de la calidad (software para no conformidades, CAPA, documentos, auditorías) |
| Revisión por excepción | Revisión de registros de lote que se centra en las desviaciones marcadas por el sistema |
| SCADA | Supervisión, control y adquisición de datos; software de supervisión de Nivel 2 |
| Sparkplug | Especificación de Eclipse sobre MQTT para cargas útiles y estados (certificados de nacimiento y defunción) [28] |
| Espacio de nombres unificado (UNS) | Patrón de arquitectura: broker central con un árbol jerárquico de temas que contiene el estado actual del negocio |
| WMS | Sistema de gestión de almacenes |
| Centro de trabajo / unidad de trabajo | Niveles de la jerarquía de equipos de ISA-95 por debajo del área |

## Preguntas frecuentes

### ¿Qué es un sistema de ejecución de fabricación en términos sencillos?

Es el software que indica a la planta qué hacer a continuación y registra lo que realmente ocurrió, orden por orden y paso a paso. Gartner lo define como software orientado a la producción que gestiona, supervisa y sincroniza en tiempo real la ejecución de los procesos físicos que convierten las materias primas en productos [8].

### ¿Cuáles son las funciones principales de un MES?

El modelo de actividades de ISA-95 enumera ocho actividades genéricas para las operaciones de producción: gestión de la definición de productos, gestión de recursos, programación detallada, despacho, gestión de la ejecución, recopilación de datos, seguimiento y análisis del rendimiento [3]. El modelo de MESA de 1997 enumeraba 11 funciones, añadiendo control de documentos, gestión de la mano de obra, gestión de la calidad, gestión de procesos y gestión del mantenimiento [9].

### ¿Cuáles son los beneficios de un MES?

Datos de producción capturados en origen en lugar de reescritos a mano, plazos de entrega de órdenes más cortos gracias a una liberación y un despacho más rápidos, menos fugas de calidad gracias a controles obligatorios, retiradas de producto más rápidas y acotadas mediante la trazabilidad de lotes y números de serie, paradas más visibles en el cuello de botella y registros electrónicos listos para auditoría. Cada beneficio depende de una condición: datos maestros correctos, controles configurados como paradas obligatorias, escaneo disciplinado de materiales y una salida que realmente pueda venderse. La sección 1 indica qué medir para cada uno de ellos.

### ¿Qué es ISA-95 en términos sencillos?

ISA-95 (IEC 62264) es la norma internacional para integrar los sistemas empresariales, como el ERP, con los sistemas de control de fabricación. Define niveles, una jerarquía de equipos, modelos de objetos y modelos de actividades para que TI, OT y el negocio utilicen el mismo vocabulario [1].

### ¿Cuáles son los cinco niveles de ISA-95?

El nivel 0 es el proceso físico, el nivel 1 la detección y manipulación, el nivel 2 la supervisión y el control de supervisión, el nivel 3 la gestión de operaciones de fabricación (MES y sistemas relacionados) y el nivel 4 la planificación empresarial y la logística (ERP) [1].

### ¿ISA-95 es lo mismo que IEC 62264?

El contenido está alineado: ISA publica ANSI/ISA-95 y la IEC publica IEC 62264. Las ediciones y la numeración difieren; la ANSI/ISA-95 Parte 1 de 2025 es una adopción modificada de IEC 62264-1 [1][2], y la IEC 62264-6 apareció en 2020 [6]. Cite siempre la parte y la edición.

### ¿Cuántas partes tiene ISA-95?

Ocho: modelos y terminología; objetos y atributos para la integración empresa-control; modelos de actividades de MOM; objetos y atributos para la integración de MOM; transacciones de negocio a fabricación; modelo de servicios de mensajería; modelo de servicios de alias; perfiles de intercambio de información [1].

### ¿Qué es el nivel 3 en ISA-95?

El nivel 3 es la gestión de operaciones de fabricación: las actividades que convierten los planes en productos, en intervalos de días, turnos, horas, minutos y segundos [4]. Abarca las operaciones de producción, mantenimiento, ensayos de calidad e inventario [3]. El MES es el sistema de nivel 3 más común.

### ¿Cuál es la diferencia entre MES y ERP?

El ERP (nivel 4) planifica qué fabricar y lo contabiliza en un intervalo de meses a días. El MES (nivel 3) ejecuta y registra cómo se fabrica realmente cada orden, en turnos hasta segundos [4]. El ERP guarda el registro financiero; el MES guarda el registro de lo realmente fabricado. Ambos intercambian órdenes, confirmaciones y movimientos de material.

### ¿Necesito un MES si ya tengo un ERP?

No necesariamente. Hágase cuatro preguntas: ¿necesita registrar por paso, número de serie y parámetro en lugar de por operación?; ¿dependen las decisiones de minutos en lugar de confirmaciones al final del turno?; ¿debe el sistema impedir un paso incorrecto en lugar de solo registrarlo?; ¿necesita registros electrónicos de historial de lotes y dispositivos? Si las cuatro respuestas son no, puede bastar con el control de taller del ERP. Si dos o más son sí, necesita funciones MES, ya sea del proveedor del ERP, de un proveedor de MES o de una plataforma (sección 5).

### ¿Cuál es la diferencia entre MES y SCADA?

El SCADA supervisa y controla máquinas y procesos en tiempo real (variables, alarmas, consignas). El MES gestiona órdenes, materiales, personal, calidad y registros. El SCADA sabe que una máquina está en marcha; el MES sabe para qué orden, con qué lote de material y para qué operario está funcionando.

### ¿Cuál es la diferencia entre MES y MOM?

MOM (gestión de operaciones de fabricación) es el término de ISA-95 que abarca todo el nivel 3, incluidas las operaciones de producción, calidad, mantenimiento e inventario. MES suele referirse al núcleo de producción; muchas "suites MOM" son productos MES con módulos adicionales [10].

### ¿Qué es B2MML?

B2MML es una implementación en XML de los modelos de objetos de ISA-95, creada por MESA International y utilizada en muchas interfaces ERP-MES; el mapeo de ISA-95 en OPC UA sigue a B2MML siempre que es posible [5]. Tras la disolución de MESA el 30 de junio de 2026, ISA asumió el contenido de MESA [11].

### ¿Cómo se integra ISA-95 con los sistemas ERP?

ISA-95 define la interfaz entre el Nivel 4 (ERP) y el Nivel 3 (MES y otros sistemas de operaciones). Las Partes 2 y 4 definen los objetos intercambiados, y la Parte 5 las transacciones. En la práctica, el ERP envía hacia abajo las definiciones de producto, las órdenes de producción y los datos de materiales; el MES devuelve hacia arriba las confirmaciones de operación, los movimientos de mercancía, las notificaciones de calidad y los estados. B2MML implementa los modelos de objetos de ISA-95 en XML [5]. Un modelo compartido reduce el trabajo de especificación, pero cada proyecto aún debe decidir qué sistema es el maestro de cada campo y qué evento dispara una contabilización (sección 7).

### ¿Reemplaza un espacio de nombres unificado a ISA-95 o al MES?

No. Un UNS es una forma de mover y compartir datos de estado actual a través de un broker. Necesita ISA-95 (u otro modelo similar) para la nomenclatura y la semántica, y necesita un MES y un ERP para la lógica de negocio y los registros auditables.

### ¿Cuánto cuesta un MES?

Depende del alcance, del número de líneas, del modelo de despliegue, de la integración y de la regulación, y los proveedores rara vez publican precios. Calcule su propio coste total de propiedad a cinco años con los bloques de costes de la sección 13; en nuestra planta ilustrativa de 220 empleados, los costes únicos fueron de 970.000 USD y los costes recurrentes de 300.000 USD al año.

### ¿Cuánto tarda una implementación de MES?

Para una planta con un producto configurado, prevea aproximadamente entre seis y doce meses hasta un piloto estable, y olas posteriores de tres a seis meses [unverified: supuesto de planificación de profesionales]. Las plantas reguladas y los desarrollos a medida tardan más.

### ¿Es SAP un MES?

El ERP central de SAP tiene funciones de control de planta; SAP también comercializa productos de ejecución de fabricación independientes. Si las funciones del ERP son suficientes depende de la granularidad, la latencia, la capacidad de imponer procesos y las necesidades regulatorias descritas en la sección 5.

### ¿Necesitan los pequeños fabricantes un MES?

No siempre. Un taller pequeño puede obtener a menudo la mayor parte del valor con las confirmaciones de planta del ERP, una monitorización sencilla de máquinas y una buena gestión visual. Un MES se vuelve necesario cuando se requiere imponer el orden de los pasos, la genealogía de números de serie, registros electrónicos de lote o decisiones casi en tiempo real. El Manufacturing Extension Partnership (MEP) del NIST, que se centra en los fabricantes pequeños y medianos, es un lugar neutral respecto a proveedores donde solicitar una evaluación [31].

### ¿Qué es un MES en la nube o MES componible?

Un MES en la nube se ejecuta como servicio en la nube del proveedor; un MES componible se construye a partir de aplicaciones más pequeñas sobre una plataforma común. Ambos pueden funcionar; compruebe el comportamiento sin conexión en el borde, el modelo de datos compartido y, si está regulado, cómo encaja la cadencia de publicación del proveedor con su validación.

### ¿Sigue siendo relevante ISA-95 con IIoT y las plataformas en la nube?

Sí. ISA afirma que los niveles siguen sirviendo para describir los límites de los sistemas en la Industria 4.0 [1], y la edición de 2025 de la Parte 1 se escribió para arquitecturas modulares centradas en los datos [2]. Lo que ha quedado obsoleto es la idea de que los datos deben subir los niveles uno a uno.

### ¿Cuáles son los inconvenientes de ISA-95?

Es abstracto y le dice qué nombrar e intercambiar, no cómo construirlo. Leído literalmente, su modelo de niveles sugiere que los datos deben subir nivel por nivel, algo que las arquitecturas modernas basadas en eventos no hacen. Los textos normativos son de pago y extensos, así que los equipos suelen trabajar con resúmenes inconsistentes. "Conforme a ISA-95" es una afirmación del proveedor, no una certificación. Y no decide dónde traza su planta el límite entre el MES, los sistemas de calidad y los de mantenimiento (sección 17).

### ¿Qué KPI debe seguir un MES?

OEE y sus componentes, rendimiento al primer paso, ratio de chatarra, cumplimiento del programa, throughput, WIP, lead time y MTBF/MTTR, definidos según ISO 22400-2 [16][17]. Siga también al propio MES: latencia de datos, tasa de captura automática, adopción y tiempo de trazabilidad.

### ¿Qué exige el 21 CFR Part 11 a un MES?

Para sistemas cerrados: validación, copias precisas de los registros, protección de los registros, acceso limitado a personas autorizadas y pistas de auditoría seguras, generadas por ordenador, con marca de tiempo y que no oculten las entradas anteriores, entre otros controles [19]. Las firmas electrónicas deben estar vinculadas a sus registros.

## Conclusión y primeros pasos

Un sistema de ejecución de fabricación se justifica por su coste cuando cierra el ciclo entre el plan y la realidad más rápido y con más fiabilidad de lo que pueden hacerlo personas con papel y hojas de cálculo. ISA-95 ofrece el mapa para ello: los niveles muestran dónde se sitúa el MES, la jerarquía de equipos da a todos los sistemas los mismos nombres, los modelos de objetos definen lo que intercambian el ERP y el MES, y la matriz de actividades 4 × 8 indica qué sistema debe encargarse de cada tarea. Un espacio de nombres unificado y las plataformas en la nube cambian la infraestructura, no esas responsabilidades.

Los proyectos que tienen éxito comparten un patrón: empiezan con una cadena de valor y un modelo de datos, piloten una línea con una línea base congelada, involucran a los operarios desde el primer taller, mantienen paradas obligatorias solo para lo que realmente importa y miden los beneficios junto con finanzas durante años. El ejemplo práctico lo demuestra: el mismo MES puede ser una buena o una mala inversión según si la mejora en el cuello de botella puede venderse y con qué rapidez se estabiliza el piloto.

**Sus primeros 30 días:**

- [ ] Recorra una cadena de valor y marque cada punto donde la información se vuelve a teclear, se retrasa o falta
- [ ] Complete la matriz de actividades ISA-95 (4 × 8) para esa cadena de valor: ¿quién realiza hoy cada actividad?
- [ ] Redacte la jerarquía de equipos para el área piloto y acuerde los nombres con mantenimiento e IT
- [ ] Congele una línea base: OEE en el cuello de botella, coste de chatarra, plazo de entrega de pedidos, tiempo de trazabilidad
- [ ] Pregunte a ventas y finanzas si la producción adicional en el cuello de botella puede venderse y con qué margen de contribución
- [ ] Enumere sus requisitos normativos de registros (Part 11, QMSR, FSMA 204, requisitos de clientes)
- [ ] Hable con dos plantas homólogas que utilicen un MES, sin la presencia de proveedores
- [ ] Adquiera ISA-95 Partes 1 y 3 para la biblioteca del proyecto

---

## Lecturas adicionales en m365.fm

**Guías relacionadas**
- [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/): arquitectura en la nube, espacio de nombres unificado en Azure IoT Operations, plataforma de datos
- [Digital Twin in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [Production Scheduling and APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Shop Floor Management and Gemba Walks](https://www.m365.fm/en/learn/shop-floor-management/)
- [Lean Manufacturing](https://www.m365.fm/en/learn/lean-manufacturing/)
- [Value Stream Mapping](https://www.m365.fm/en/learn/value-stream-mapping/)
- [Aerospace Production Planning](https://www.m365.fm/en/learn/aerospace-production-planning/)
- [OT Cybersecurity and ISA/IEC 62443](https://www.m365.fm/en/learn/ot-cybersecurity-iec-62443/)
- [Predictive Maintenance and IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/)
- [TPM and OEE](https://www.m365.fm/en/learn/tpm-oee/)
- [S&OP, MRP and Production Planning](https://www.m365.fm/en/learn/sop-mrp-production-planning/)
- [Theory of Constraints](https://www.m365.fm/en/learn/theory-of-constraints/)
- [Six Sigma and Root Cause Analysis](https://www.m365.fm/en/learn/six-sigma-root-cause-analysis/)
- [Kanban and Pull Systems](https://www.m365.fm/en/learn/kanban-pull-system/)
- [5S and Visual Management](https://www.m365.fm/en/learn/5s-visual-management/)

**Análisis en profundidad**
- [Paperless Manufacturing and Digital Work Instructions](https://www.m365.fm/en/learn/shop-floor-management/paperless-manufacturing/)
- [Standard Work](https://www.m365.fm/en/learn/shop-floor-management/standard-work/)
- [Andon System](https://www.m365.fm/en/learn/shop-floor-management/andon/)
- [Intralogistics and In-Plant Material Flow](https://www.m365.fm/en/learn/production-scheduling-aps/intralogistics/)
- [Process Mining in Manufacturing](https://www.m365.fm/en/learn/digital-twin-manufacturing/process-mining-manufacturing/)
- [Manufacturing Workforce Skills](https://www.m365.fm/en/learn/operational-excellence/manufacturing-workforce-skills/)

**Términos del glosario (entidades)**
[Enterprise resource planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Total productive maintenance](https://www.m365.fm/entity/total-productive-maintenance/) · [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) · [Standard work](https://www.m365.fm/entity/standard-work/) · [Kanban](https://www.m365.fm/entity/kanban/) · [Poka-yoke](https://www.m365.fm/entity/poka-yoke/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** es el presentador de m365.fm y trabaja en iFAKT GmbH. En m365.fm escribe sobre producción esbelta, excelencia operativa y la transformación digital de la producción, incluidos los sistemas y modelos de datos que conectan la planta con la planificación.

**Nota: El autor trabaja en iFAKT GmbH.**

# Sources

All sources accessed November 20, 2026. Status: **(F)** = opened and checked for this article; **(S)** = opened and checked on November 20, 2026 by the fact check of a related guide on m365.fm (file named), cited here with the same wording, not re-fetched for this article because the shared web-fetch budget was exhausted.

1. ISA-95 Standard: Enterprise-Control System Integration (parts list with editions, Levels 0–4, Purdue basis, scope of each part). International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard (F)
2. Update to ISA-95 Standard Addresses Integration of Enterprise and Manufacturing Control Systems. ISA press release, Durham, N.C., April 10, 2025 (ANSI/ISA-95.00.01-2025, IEC 62264-1 Mod; quotes by Christian Monchinski). https://www.isa.org/news-press-releases/2025/april/update-to-isa-95-standard-addresses-integration-of (F)
3. ANSI/ISA-95.00.03-2013, Enterprise-Control System Integration – Part 3: Activity Models of Manufacturing Operations Management, preview incl. table of contents (clauses 6–9). ANSI Webstore. https://webstore.ansi.org/preview-pages/ISA/preview_ANSI+ISA+95.00.03-2013.pdf ; ISA preview with scope: https://www.isa.org/getmedia/506c4c83-c2d3-4807-83e7-682fd98c17f8/ISA-95-00-03-2013-preview.pdf (F)
4. OPC 10030: ISA-95 Common Object Model, section 4.2.3 ISA-95 (levels, time frames, information types). OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2.3 (F)
5. OPC 10030: ISA-95 Common Object Model, section 4.2 ISA-95 Summary (object models, nesting, B2MML by MESA, OPC UA mapping follows B2MML). OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/4.2 (F)
6. IEC 62264-6:2020, Enterprise-control system integration – Part 6: Messaging service model, edition 1.0, 2020-06-26. IEC Webstore. https://webstore.iec.ch/publication/59706 (F)
7. IEC 62264 (list of parts and IEC editions). Wikipedia (secondary source). https://en.wikipedia.org/wiki/IEC_62264 (F)
8. Manufacturing Execution Systems, market definition. Gartner Peer Insights. https://www.gartner.com/reviews/market/manufacturing-execution-systems (F)
9. What Isn't an MES? (MESA International MES functional model with 11 functions, one of eight MESA models; 45 percent cycle-time claim attributed to MESA). Control Engineering. https://www.controleng.com/what-isnt-an-mes (F)
10. MES Definition Work Continues (AMR Research 1992; MESA 1997 definition; ISA-95 MOM categories; 40+ manufacturers, requirements time reduced to four to six weeks). Automation World, March 1, 2006. https://automationworld.com/products/control/news/13302768/mes-definition-work-continues (F)
11. ISA Receives MESA International Content (MESA to cease operations effective June 30, 2026; content and educational programs assumed by ISA). International Society of Automation. https://programs.isa.org/isa-receives-mesa-international-content (F)
12. Manufacturing execution system (MES), definition (MESA-11 in 1997; ISA-95 merged MESA-11 with the Purdue Reference Model). TechTarget. https://www.techtarget.com/searcherp/definition/manufacturing-execution-system-MES (F)
13. The Five Parts of ISA-95. Automation World, May 6, 2013. https://automationworld.com/products/software/article/13309288/the-five-parts-of-isa-95 (F)
14. Manufacturing execution system. Wikipedia (secondary source; ISA-95 Part 1 2000, Part 3 2005; Level 3 systems as MOMS; B2MML). https://en.wikipedia.org/wiki/Manufacturing_execution_system (F)
15. HPImpact: Report "clarifies" MES for management (MESA white paper "MES: A High Level Vision"). Hydrocarbon Processing, December 1997 issue. https://www.hydrocarbonprocessing.com/magazine/1997/december-1997/misc/hpimpact-report-clarifies-mes-for-management (F; page metadata shows a 2016 upload date)
16. ISO 22400-2:2014 Automation systems and integration – Key performance indicators (KPIs) for manufacturing operations management – Part 2: Definitions and descriptions. Edition 1, 2014-01; status "to be revised"; Amendment 1:2017 "Key performance indicators for energy management". https://www.iso.org/standard/54497.html (F, re-fetched November 20, 2026)
17. Kang, N.; Zhao, C.; Li, J.; Horst, J. A. (2016): A hierarchical structure of key performance indicators for operation management and continuous improvement in production systems. International Journal of Production Research 54(21), pp. 6333–6350. NIST version: https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=919754 (F, re-fetched November 20, 2026)
18. ISO 22400 KPI Selection Guide (secondary source for the count of 34 KPIs). Fabrico. https://www.fabrico.io/blog/iso-22400-kpi-selection-guide/ (F, re-fetched November 20, 2026)
19. 21 CFR 11.10, Controls for closed systems. Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11/subpart-B/section-11.10 (F, re-fetched November 20, 2026)
20. Quality Management System Regulation (QMSR): effective February 2, 2026; incorporates ISO 13485:2016 and clause 3 of ISO 9000:2015 by reference. U.S. Food and Drug Administration. https://www.fda.gov/quality-systems-regulation (F)
21. VDI 5600 Part 1: Manufacturing Execution Systems (MES). Edition October 2016. https://www.din.de/en/wdc-beuth:din21:251310997 (F, re-fetched November 20, 2026)
22. MTConnect Standard, ANSI/MTC1.4-2018, Part 1.0 Overview and Fundamentals. MTConnect Institute. https://docs.mtconnect.org/ANSI_MTC1_4-2018.pdf (F, re-fetched November 20, 2026)
23. ISA/IEC 62443 Series of Standards. International Society of Automation. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards (F, re-fetched November 20, 2026)
24. Stouffer, K. et al. (2023): Guide to Operational Technology (OT) Security. NIST SP 800-82 Rev. 3, September 28, 2023. DOI: [10.6028/NIST.SP.800-82r3](https://doi.org/10.6028/NIST.SP.800-82r3) (S: digital-twin-manufacturing.md)
25. Publish and subscribe MQTT messages using MQTT broker (Azure IoT Operations; MQTT 3.1.1 and MQTT 5). Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/manage-mqtt-broker/overview-broker (F, re-fetched November 20, 2026)
26. What is the connector for OPC UA? Azure IoT Operations, Microsoft Learn. https://learn.microsoft.com/en-us/azure/iot-operations/discover-manage-assets/overview-opc-ua-connector (F, re-fetched November 20, 2026)
27. What is ISA-95? The Five Levels, IEC 62264 and the Automation Pyramid (secondary source for the equipment hierarchy names enterprise, site, area, work center, work unit; vendor page). OPC Router. https://www.opc-router.com/what-is-isa-95/ (F)
28. Eclipse Sparkplug (Sparkplug Specification Version 3.0; birth and death certificates; TLS). Eclipse Foundation, Sparkplug Working Group. https://sparkplug.eclipse.org/ (F)
29. FSMA Final Rule on Requirements for Additional Traceability Records for Certain Foods. U.S. Food and Drug Administration. https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods (F, re-fetched November 20, 2026)
30. Muchiri, P.; Pintelon, L. (2008): Performance measurement using overall equipment effectiveness (OEE): literature review and practical application discussion. International Journal of Production Research 46(13), pp. 3517–3535. DOI: 10.1080/00207540601142645 (S: manufacturing-kpis.md)
31. Manufacturing Extension Partnership (MEP). National Institute of Standards and Technology (NIST). https://www.nist.gov/mep (F, re-fetched November 20, 2026)
32. 7.4.1 ISA95EquipmentElementLevelEnum, OPC 10030: ISA-95 Common Object Model. OPC Foundation. https://reference.opcfoundation.org/specs/OPC-10030/7.4.1 (F, accessed November 20, 2026)
33. Enterprise-Control System Integration, Part 1: Models and Terminology, ISA-dS95.01-1999, Draft 14, November 1999 (historical public draft, section 5.2 equipment hierarchy, section 7.1 information categories; not the current edition). https://xml.coverpages.org/ISA95Part1-Draft14-NIST.pdf (F, accessed November 20, 2026)
34. ISA-88. Wikipedia (secondary source; procedural control model; adopted by the IEC in 1997 as IEC 61512-1). https://en.wikipedia.org/wiki/ISA-88 (F, accessed November 20, 2026)
35. SAP Digital Manufacturing (product page, vendor description; MOM platform on SAP Business Technology Platform; SAP Manufacturing Execution customers advised to transition). SAP. https://www.sap.com/products/scm/digital-manufacturing.html (F, accessed November 20, 2026)
36. B2MML-BatchML (README: B2MML implements ANSI/ISA-95, BatchML implements ANSI/ISA-88). MESA International, GitHub. https://github.com/MESAInternational/B2MML-BatchML (F, accessed November 20, 2026)
37. ISA-TR88.00.02-2022, Machine and Unit States: An Implementation Example of ISA-88 (PackML), preview (sections 4 to 6: state model, modes). International Society of Automation. https://www.isa.org/getmedia/300dbd50-d549-41ac-b372-a5e52f32fc97/tr_880002_preview.pdf (F, accessed November 20, 2026; full title per ISA catalog not shown in the preview)
38. 21 CFR 211.188, Batch production and control records. Electronic Code of Federal Regulations. https://www.ecfr.gov/current/title-21/chapter-I/subchapter-C/part-211/subpart-J/section-211.188 (F, accessed November 20, 2026)
39. IATF 16949:2016 vs. ISO/TS 16949:2009 comparison matrix (section 8.5.2.1). DNV (secondary source). https://www.dnv.com/siteassets/images/pdf-documents/iatf-2009-to-2016-comparison-matrix.pdf (F, accessed November 20, 2026)
40. Computer Software Assurance for Production and Quality Management System Software, final guidance, February 2026 (CDRH, CBER). U.S. Food and Drug Administration. https://fda.gov/regulatory-information/search-fda-guidance-documents/computer-software-assurance-production-and-quality-management-system-software (F, accessed November 20, 2026)
41. FASB Amends Guidance on Cloud Computing Arrangements (ASU 2018-15, issued August 29, 2018). Deloitte DART, Heads Up. https://dart.deloitte.com/USDART/home/publications/archive/deloitte-publications/heads-up/2018/fasb-amends-guidance-cloud-computing-arrangements (F, accessed November 20, 2026)
42. FASB Amends Guidance on the Accounting for and Disclosure of Software Costs (ASU 2025-06, September 18, 2025). Deloitte DART. https://dart.deloitte.com/USDART/home/news/all-news/2025/sep/fasb-amends-guidance-on-software-costs (F, accessed November 20, 2026)
43. New MESA Model: A Framework for Smarter Manufacturing. Automation.com, April 22, 2022. https://www.automation.com/article/mesa-model-a-framework-smarter-manufacturing (F, accessed November 20, 2026)
44. Manditereza, K.: Implementing Unified Namespace (UNS) With MQTT Sparkplug. HiveMQ blog (vendor source), first published December 20, 2022, updated February 22, 2026. https://hivemq.com/blog/implementing-unified-namespace-uns-mqtt-sparkplug (F, accessed November 20, 2026)
