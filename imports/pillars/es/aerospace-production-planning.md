# SEO metadata

| Field | Value |
|---|---|
| Meta title | Planificación de producción aeroespacial: guía completa |
| Meta description | Planificación de producción aeroespacial explicada: AS9100, FAA Parte 21/145, trazabilidad, curvas de aprendizaje, rampa de tasa, APS y planificación MRO, con ejemplos. |
| Slug | `aerospace-production-planning` |

# Planificación de la producción aeroespacial: la guía completa para proveedores y talleres MRO

*A partir del 20 de noviembre de 2026 · Basado en datos del sector y de empresas, normas IAQG/SAE, normativa de la FAA y la EASA y la literatura técnica (véanse las Fuentes)*

> **Respuesta breve:** La planificación de la producción aeroespacial consiste en igualar las tasas de los clientes con una capacidad finita, plazos de entrega largos, procesos especiales certificados y una trazabilidad completa. A diferencia de los sectores de gran volumen, no basta con cumplir la fecha. También hay que demostrar cómo se fabricó la pieza: cada pieza necesita un origen documentado, una configuración liberada y un proceso controlado, y esa evidencia debe planificarse igual que las horas de máquina.

Martes por la mañana en un proveedor de Nivel 2 de piezas estructurales. El cliente ha elevado un quinto las liberaciones del próximo trimestre porque el fabricante de aeronaves está aumentando su tasa de producción. Las celdas de mecanizado de cinco ejes ya funcionan en tres turnos. El tratamiento térmico se envía a un procesador externo acreditado por Nadcap, con un plazo de tres semanas. Acaba de llegar un cambio de ingeniería para dos números de pieza, lo que activa una inspección parcial del primer artículo. Y desde ayer, el departamento de calidad busca el certificado de material de un lote térmico de titanio porque un cliente tiene una pregunta sobre un lote que ya había sido enviado.

Cada una de estas tareas podría resolverse por separado. La dificultad está en que todas coinciden al mismo tiempo en el mismo plan. Eso es lo que distingue la planificación de la producción aeroespacial de la planificación en muchos otros sectores: no planifica solo cantidades y fechas, sino también evidencias, aprobaciones y configuraciones. Y lo hace en un mercado donde las carteras de pedidos de los fabricantes de aeronaves están llenas durante años, mientras la cadena de suministro se bloquea en varios puntos a la vez.

Esta guía está escrita para directores de planta, responsables de planificación y programación y responsables de calidad de proveedores aeroespaciales, así como para planificadores de talleres de mantenimiento, reparación y revisión general (MRO) y de estaciones de reparación. Los lectores que busquen la programación de la producción aeroespacial encontrarán el lado de la programación (capacidad finita, APS, control de cuellos de botella) en las secciones 5, 10 y 11. La guía abarca la situación del mercado en 2026 con cifras documentadas, lo que hace diferente a este sector, las normas y reglamentos pertinentes a ambos lados del Atlántico (FAA y EASA), la trazabilidad y la genealogía, las curvas de aprendizaje de Wright con un ejemplo práctico, la planificación de una rampa de aumento de tasa, la planificación de capacidad con APS y simulación, la planificación MRO con hallazgos no planificados, los KPI, un enfoque paso a paso y los errores habituales. También hay una breve introducción a la relación entre el plazo de entrega y la trazabilidad en la entrada [Aerospace production planning: lead time and traceability](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/) de m365.fm.

Una nota sobre el contexto europeo: la versión original de esta guía se escribió para proveedores alemanes, y gran parte de la cadena de suministro global de Airbus pasa por Europa. Cuando las normas europeas (EASA, normas EN) son relevantes para empresas estadounidenses, por ejemplo cuando se suministra a clientes europeos o se poseen aprobaciones duales FAA/EASA, esta guía las explica junto a sus equivalentes estadounidenses.

### Puntos clave

- **La demanda existe, la capacidad no.** Airbus tenía una cartera de 9.310 aviones comerciales a finales de septiembre de 2026 [3]; Boeing informó de una cartera comercial de más de 6.300 aviones en la misma fecha [47]. Las cadencias de producción aumentan más lentamente de lo previsto porque escasean los motores, las fundiciones y forjas, las materias primas y la mano de obra cualificada [4][10].
- **Planificar en este sector significa planificar bajo una carga de la prueba exigente.** La norma AS9100D exige, entre otras cosas, gestión de la configuración, trazabilidad y prevención de piezas falsificadas [14][44]. Los titulares de una aprobación de producción de la FAA deben mantener un sistema de calidad que abarque el control de proveedores, los registros de calidad y las fugas de calidad [41]. Cada cambio de diseño puede desencadenar una inspección completa o parcial del primer artículo según la norma AS9102 [18][46].
- **El plazo de entrega es sobre todo tiempo de espera.** La Ley de Little establece: plazo de entrega = trabajo en curso ÷ rendimiento [27]. Fuera de los procesos especiales, los bucles de inspección y las aprobaciones son fuentes típicas de espera.
- **Las curvas de aprendizaje son datos de entrada de la planificación.** Wright demostró en 1936 que las horas de mano de obra por avión disminuían alrededor de un 20 % cada vez que la producción acumulada se duplicaba [24][25]. Si planifica un lanzamiento con horas estándar de cadencia madura, planificará una capacidad insuficiente.
- **Una rampa de producción falla en el cuello de botella, no en la media.** Un aumento del 20 % de la cadencia afecta mucho más a un recurso que funciona al 85 % de utilización de lo que sugiere la capacidad total.
- **La planificación del MRO tiene que contar con lo desconocido.** El alcance de una visita al taller solo se conoce tras la inspección. Una buena planificación del MRO trabaja con probabilidades de hallazgos, colchones de seguridad y disponibilidad de piezas.
- **Ningún algoritmo corrige unos datos maestros incorrectos.** APS, la simulación y los gemelos digitales requieren rutas, tiempos estándar, capacidades y datos de certificación correctos.

### Rutas de lectura rápida

| Usted es … | Lea primero |
|---|---|
| Director de planta de un proveedor que afronta un aumento de cadencia | Secciones 1, 9 y 10 (mercado, curva de aprendizaje, rampa de producción con lista de verificación) |
| Planificador de producción o programador con planes ERP poco realistas | Secciones 5, 6 y 11 (niveles de planificación, plazo de entrega, APS y simulación) |
| Responsable de calidad | Secciones 3, 4 y 8 (normas y reglamentación, trazabilidad, cambios de ingeniería) |
| Planificador de MRO en una estación de reparación | Secciones 3, 4 y 13 (Parte 145, piezas con vida limitada, planificación del MRO) |
| Responsable de TI, digital o de ciberseguridad | Secciones 3.6, 4, 11, 14 y 16 (ITAR/CMMC, modelo de datos, APS, gemelo digital, enfoque) |

## Tabla de contenidos

1. [El mercado de 2026: por qué la planificación se ha convertido en el cuello de botella](#1-el-mercado-de-2026-por-qué-la-planificación-se-ha-convertido-en-el-cuello-de-botella)
2. [Qué hace diferente a la planificación de la producción aeroespacial frente a otros sectores](#2-qué-diferencia-la-planificación-de-la-producción-aeronáutica-de-otras-industrias)
3. [Normas y regulaciones que importan para la planificación](#3-normas-y-reglamentos-que-importan-para-la-planificación)
4. [Trazabilidad y genealogía](#4-trazabilidad-y-genealogía)
5. [Niveles de planificación: desde la cadencia del cliente hasta la operación](#5-niveles-de-planificación-del-ritmo-de-cliente-a-la-operación)
6. [Comprensión y reducción del lead time](#6-comprender-y-reducir-el-tiempo-de-entrega)
7. [Planificación de procesos especiales y operaciones externalizadas](#7-planificación-de-procesos-especiales-y-operaciones-externas)
8. [Cambios de ingeniería y gestión de la configuración](#8-cambios-de-ingeniería-y-gestión-de-la-configuración)
9. [Curvas de aprendizaje de Wright: teoría y ejemplo práctico](#9-curvas-de-aprendizaje-de-wright-teoría-y-ejemplo-práctico)
10. [Planificación de una rampa de cadencia: cálculo y lista de verificación](#10-planificación-de-una-rampa-de-tasa-cálculo-y-lista-de-verificación)
11. [Planificación de capacidad con APS, gestión de cuellos de botella y simulación](#11-planificación-de-capacidad-con-aps-gestión-de-cuellos-de-botella-y-simulación)
12. [Riesgos de la cadena de suministro de 2022 a 2026 y su impacto en la planificación](#12-riesgos-de-la-cadena-de-suministro-de-2022-a-2026-y-sus-implicaciones-para-la-planificación)
13. [Planificación de MRO: mantenimiento con hallazgos no previstos](#13-planificación-de-mro-mantenimiento-con-hallazgos-no-previstos)
14. [Gemelo digital e hilo digital](#14-gemelo-digital-e-hilo-digital)
15. [KPI para planificación y control](#15-kpi-para-la-planificación-y-el-control)
16. [Enfoque: seis pasos hacia un plan fiable](#16-enfoque-seis-pasos-para-un-plan-fiable)
17. [Errores habituales y cómo evitarlos](#17-errores-comunes-y-cómo-evitarlos)
18. [iFAKT y el sector aeroespacial](#18-ifakt-y-aeroespacial)
19. [Glosario](#19-glosario)
20. [Preguntas frecuentes sobre la planificación de la producción aeroespacial](#20-preguntas-frecuentes-cuestiones-habituales-sobre-la-planificación-de-la-producción-aeronáutica)
21. [Conclusión](#21-conclusión)

## 1. El mercado de 2026: por qué la planificación se ha convertido en el cuello de botella

### 1.1 Demanda récord, capacidad de entrega limitada

La aviación comercial atraviesa una situación inusual: la demanda de aviones nuevos nunca había sido tan alta, pero la industria no puede entregar al ritmo que quieren los clientes. Según un estudio que la asociación de aerolíneas IATA presentó junto con Oliver Wyman en octubre de 2025, la cartera global de aviones comerciales alcanzó un récord de más de 17.000 aviones en 2024. Entre 2010 y 2019 había promediado unos 13.000 [9]. El estudio estima que los retrasos en las entregas costaron a las aerolíneas más de 11.000 millones de dólares en 2025. Las partidas principales son el consumo de combustible excesivo de los aviones más antiguos (unos 4.200 millones de dólares), el mantenimiento adicional (3.100 millones), el arrendamiento de motores (2.600 millones) y el aumento de los inventarios de repuestos (1.400 millones) [9].

Las cifras de los dos grandes fabricantes muestran el panorama con detalle:

| Métrica | Airbus | Boeing |
|---|---|---|
| Entregas en 2025 | 793 aviones comerciales, de los cuales 607 de la familia A320 [2] | 600 aviones comerciales, de los cuales 447 Boeing 737 [6] |
| Cartera de pedidos | 8.754 a cierre de 2025 [2]; 9.310 a finales de septiembre de 2026 [3] | más de 6.100 a cierre de 2025, valorada en unos 567.000 millones de dólares [6]; más de 6.300 a finales de septiembre de 2026, valorada en 611.800 millones de dólares [47] |
| Objetivo 2026 | en torno a 870 entregas [3] | sin previsión de unidades en las fuentes citadas |
| Situación 2026 | 547 entregas hasta el 30 de septiembre [3]; 621 hasta finales de octubre [5] | 161 entregas en el tercer trimestre de 2026, de las cuales 124 del Boeing 737 [47]; el programa 737 sigue avanzando hacia una producción estabilizada de 47 al mes; el 787 estable en 8 al mes [47] |

### 1.2 Objetivos de cadencia y por qué siguen cambiando

Para los proveedores, la cadencia mensual del fabricante de aviones es el dato de planificación más importante, porque determina las liberaciones en todos los niveles de la cadena de suministro. En su informe de los primeros nueve meses de 2026, Airbus establece estos objetivos: entre 70 y 75 aviones de la familia A320 al mes a finales de 2027, estabilizándose después en la cadencia 75; cadencia 12 para el A350 en 2028; cadencia 13 para el A220 en 2028; y cadencia 5 para el A330 en 2029 [3].

La historia de la meta de "rate 75" muestra lo volátiles que son este tipo de supuestos. Airbus quería alcanzar originalmente esta tasa en 2025 y 2026. A finales de 2024, la meta se trasladó a 2027 [4]. En abril de 2026, el consejero delegado de Airbus, Guillaume Faury, culpó públicamente a Pratt & Whitney por no entregar el número de motores pedidos y habló de faltantes que no correspondían ni a la demanda ni a los pedidos [4]. Los medios especializados consideran posible que la rate 75 se retrase a 2028 [4]. El rango objetivo de 70 a 75 a finales de 2027 refleja la situación al 28 de octubre de 2026 [3].

En Boeing, la FAA limitó la producción del 737 MAX a 38 aviones al mes tras el desprendimiento del tapón de puerta en un vuelo de Alaska Airlines en enero de 2024. En octubre de 2025, la FAA aprobó un aumento a 42 [7]. En mayo de 2026, el consejero delegado de Boeing, Kelly Ortberg, afirmó que la línea operaba ya a rate 47; describió un nuevo paso a 52 como un esfuerzo mayor debido a los niveles de inventario en la cadena de suministro [8]. El comunicado trimestral de Boeing del 27 de octubre de 2026 describe el programa del 737 como aún en progreso hacia una producción estabilizada de 47 al mes [47].

**Qué significa esto para su planificación:** Las metas de tasa de producción no son compromisos. Son supuestos de planificación con una incertidumbre considerable. Un proveedor que construye capacidad estrictamente según la meta oficial corre el riesgo de incurrir en costes por inactividad. Un proveedor que construye demasiado tarde se convierte en el propio cuello de botella, en una industria donde una sola pieza que falta detiene un avión completo. Una planificación robusta trabaja, por tanto, con escenarios (por ejemplo, rate 60, 67 y 75) y con disparadores de inversión definidos de antemano.

### 1.3 La industria en cifras: Estados Unidos y Alemania

La industria aeroespacial y de defensa de Estados Unidos es la mayor del mundo. Según la Aerospace Industries Association (AIA) y S&P Global Market Intelligence, la industria registró unas ventas totales de 988.600 millones de dólares en 2025 (la AIA sitúa la actividad empresarial total en 1 billón de dólares) y sostuvo unos 2,1 millones de empleos. Alrededor de 1,1 millones de esos empleos y casi 483.000 millones de dólares de actividad corresponden a la cadena de suministro nacional. Las exportaciones alcanzaron 172.700 millones de dólares, un 25 % más interanual [48]. Dicho de otro modo, aproximadamente la mitad de los empleos están en los proveedores, que es precisamente el grupo para el que se escribe esta guía.

Alemania es una parte más pequeña pero importante de la cadena de suministro de Airbus y el mercado de origen de la versión original de esta guía. La Asociación Alemana de Industrias Aeroespaciales (BDLI) informó de cifras récord en mayo de 2026: 62.000 millones de euros de facturación en 2025 (2024: 52.000 millones de euros, un 19 % más) y 130.000 empleados (año anterior: 120.000). La aviación civil es el segmento más grande, con 45.000 millones de euros de facturación (un 15 % más), seguida por la aviación militar con 13.500 millones de euros (un 35 % más) y el espacio con 3.500 millones de euros. La cuota de exportación fue del 66 %, y el gasto en investigación y desarrollo fue de unos 4.000 millones de euros [1].

Detrás de estas cifras, a ambos lados del Atlántico, hay muchos proveedores pequeños y medianos junto a los OEM y los grandes integradores de sistemas. Fabrican piezas estructurales, componentes de cabina, piezas de motor, sistemas y procesos especiales, o prestan servicios de mantenimiento. Para estas empresas en particular, el paso de la infrautilización (2020 a 2022) a una sobrecarga sostenida supone un reto de planificación.

### 1.4 La perspectiva del proveedor: lo que muestran las encuestas

La consultora Roland Berger encuestó a 95 empresas de la cadena de suministro aeroespacial a principios de 2026 [10]. Los resultados son reveladores para cualquiera responsable de la planificación:

- El 55 % de las empresas informa de interrupciones en la cadena de suministro (2025: 64 %).
- Cerca del 80 % percibe un riesgo medio a alto de escasez de materias primas críticas; el titanio, el acero, el cobre, las tierras raras y los imanes son los más citados.
- El 56 % reporta escasez de personal cualificado (año anterior: 65 %). Sigue siendo el freno más común para la rampa de producción.
- Casi el 40 % carece de capacidad productiva.
- Alrededor de un tercio opera con un margen EBIT inferior al 5 %, y el 40 % acumuló más inventario para el inicio de la producción, lo que presiona aún más los márgenes.
- Los plazos de entrega largos afectan no solo al material, sino también a servicios como los ensayos, el tratamiento de superficies y el acabado.

Una encuesta anterior apunta en la misma dirección desde la perspectiva de la planificación. En una evaluación de preparación para la tasa de producción en la que participaron más de 100 proveedores de Asia, Europa y Estados Unidos, la consultora Vendigital constató que el 38 % tenía procesos de planificación de capacidad inadecuados. Señaló como causas la escasez de competencias, el estado desconocido de las instalaciones y la maquinaria, los programas de mantenimiento vencidos y la mala comunicación entre los planificadores de alto nivel y el taller [55]. El artículo no muestra una fecha de publicación; hace referencia al plan de Airbus de 2021 para alcanzar la tasa 75 en 2025, por lo que los datos tienen varios años.

El último punto de la lista de Roland Berger es central para la planificación: los procesos especiales y las inspecciones se han convertido en cuellos de botella en muchas cadenas de suministro. La sección 7 aborda cómo afrontar este problema.

## 2. Qué diferencia la planificación de la producción aeronáutica de otras industrias

Muchos principios de planificación se aplican a cualquier fabricación discreta. Sin embargo, la industria aeroespacial combina varias características que son familiares por separado, pero que juntas exigen una lógica de planificación propia.

### 2.1 Alta variedad, bajo volumen y muchas variantes

Un proveedor aeroespacial suele fabricar muchos números de pieza en cantidades pequeñas. Incluso con una tasa de 75 aviones al mes, se trata de unos 3,5 aviones por día laborable (con unos 21 días laborables al mes). Por tanto, una pieza instalada una vez por avión tiene una cantidad diaria de un solo dígito. A ello se suman las variantes específicas de cada cliente (configuración de cabina), la demanda de repuestos y las piezas para modelos anteriores. El resultado es un entorno de alta variedad y bajo volumen (HMLV, por sus siglas en inglés) en el que los preparativos, los cambios de programa y el esfuerzo de inspección absorben una parte importante de la capacidad.

### 2.2 Plazos de entrega largos y listas de materiales profundas

Una pieza estructural de titanio puede pasar muchas semanas entre la materia prima y el envío: forja o fundición, mecanizado en bruto, tratamiento térmico, mecanizado de acabado, ensayos no destructivos (END), tratamiento superficial e inspección final. Varios de estos pasos suelen realizarse en especialistas externos. Las listas de materiales de los grandes conjuntos tienen una estructura muy anidada; un avión está formado por millones de piezas que se unen a lo largo de muchos niveles de suministro. La consecuencia: un retraso en un nivel inferior suele notarse semanas después en la línea de montaje final. Si no se comprende y gestiona activamente el [plazo de entrega](https://www.m365.fm/entity/lead-time/), se está planificando con colchones que no se conocen.

### 2.3 Certificación, cualificación y evidencias

En el sector aeroespacial no basta con fabricar una pieza conforme a la cota. Debe fabricarse con un proceso aprobado, en equipos cualificados, por personal cualificado, con material certificado y en la configuración liberada, y todo ello debe quedar documentado. Esto tiene consecuencias directas para la planificación: un pedido no puede trasladarse sin más a una máquina que está libre pero no cualificada. Un empleado sin una cualificación válida para un proceso especial no es capacidad desde el punto de vista de la planificación. Un cambio de proveedor puede exigir una nueva inspección del primer artículo.

### 2.4 Lógica de tasas en lugar de lógica de tamaño de lote

Los fabricantes de aeronaves planifican en tasas mensuales que se anuncian con años de antelación y que se elevan paso a paso. Un proveedor debe traducir esa tasa a sus propios lotes de producción sin perder la cadencia exigida por su cliente. Al mismo tiempo, los escalones de tasa rara vez son suaves: el cliente acumula inventario, aplaza las liberaciones o las adelanta. Una buena planificación separa, por tanto, la tasa del cliente (lo que el cliente necesita a largo plazo) de las liberaciones (lo que el cliente pide a corto plazo) y hace seguimiento de la diferencia.

### 2.5 Ciclos de vida largos del producto

Un tipo de aeronave suele fabricarse durante décadas y operarse aún más tiempo. Eso significa que las revisiones de planos, las especificaciones de material y las aprobaciones de procesos siguen vigentes durante mucho tiempo, pero cambian constantemente. Los repuestos para configuraciones antiguas deben seguir disponibles. Y los registros deben conservarse durante periodos muy largos. Según las normas de la FAA, el titular de una aprobación de producción debe conservar los registros de calidad durante al menos 5 años para los productos y artículos fabricados bajo esa aprobación y al menos 10 años para los componentes críticos [41]; los requisitos de los clientes suelen ir más allá. En la práctica, los plazos de conservación se derivan de las cláusulas trasladadas por los clientes y de la normativa aplicable.

### 2.6 El alto costo de un error

Una pieza defectuosa que llega al cliente (una fuga de calidad o *escape*) puede desencadenar retrabajos en la línea de ensamblaje final, inspecciones de aeronaves entregadas o, en casos extremos, inmovilizaciones. La FAA trata esto como un tema del sistema de calidad por derecho propio: 14 CFR 21.137 enumera las "fugas de calidad" como uno de los elementos obligatorios del sistema de calidad de un titular de aprobación de producción [41]. El motor Pratt & Whitney GTF muestra a qué puede conducir un defecto de material (Sección 12). Para la planificación, esto significa que las inspecciones de calidad no son un colchón que se pueda recortar cuando el cronograma está apretado. Son partes fijas de la ruta de fabricación.

## 3. Normas y reglamentos que importan para la planificación

### 3.1 La familia de normas IAQG en resumen

El International Aerospace Quality Group (IAQG) desarrolla las normas de calidad de la industria. Se publican en América como normas AS (por SAE International), en Europa como normas EN y en Asia como normas JISQ; el contenido es idéntico. La norma central es la 9100, complementada por normas para organizaciones de mantenimiento (9110), distribuidores (9120), inspección del primer artículo (9102), gestión de la variación de características clave (9103) y otras [13]. En EE. UU. verá sobre todo las designaciones AS (AS9100D, AS9102C, AS9145); los clientes y documentos europeos usan EN 9100 y similares. Todas se refieren a los mismos requisitos.

En el ámbito regulatorio, dos sistemas son relevantes para la mayoría de los proveedores: la Federal Aviation Administration (FAA) de EE. UU., cuyas normas están en el Título 14 del Code of Federal Regulations (14 CFR), y la European Union Aviation Safety Agency (EASA). Resulta confuso que ambos tengan una "Parte 21" y una "Parte 145", y que en ambos sistemas el Subparte G de la Parte 21 cubra las aprobaciones de producción. El contenido tiene una finalidad similar pero no es idéntico.

La siguiente tabla resume lo que necesita saber como responsable de planificación:

| Norma / reglamento | Contenido | Impacto en la planificación |
|---|---|---|
| **AS9100D** (EN 9100:2018, JISQ 9100:2016) | Sistema de gestión de la calidad para aviación, espacio y defensa; incluye ISO 9001:2015 más unos 105 requisitos adicionales específicos del sector, entre ellos gestión de la configuración, gestión de riesgos, seguridad del producto, prevención de piezas falsificadas, trazabilidad y entrega a tiempo [14][44] | La entrega a tiempo pasa a ser una métrica auditada; la trazabilidad de material, procesos, herramientas y personal debe acompañar al flujo de pedidos [14] |
| **AS9102C** (2023; EN 9102:2024) | Inspección del primer artículo (FAI): verificación completa de la primera pieza del proceso productivo frente a todas las características de diseño [17][18][46] | Planificar la FAI como una operación propia; los cambios de diseño, material, fuente, proceso, utillaje o ubicación, así como una interrupción de producción de más de dos años, activan una FAI completa o parcial [18][34] |
| **AS9103 / EN 9103:2023** | Gestión de la variación de características clave [19] | Las características clave requieren estudios de capacidad de proceso y gráficos de control; esto consume capacidad de inspección y afecta a los tamaños de lote y a la frecuencia de inspección |
| **AS9145** (2016; EN 9145:2018) | Planificación avanzada de la calidad del producto (APQP) y proceso de aprobación de piezas de producción (PPAP) para aeroespacial, en cinco fases desde la planificación hasta la producción continua [16][35][45] | La preparación para la producción debe demostrarse a la cadencia del cliente (revisión de preparación para producción, ejecuciones a cadencia); la planificación del arranque y la demostración de capacidad forman parte de la aprobación [35] |
| **AS9110 / EN 9110:2018** | Sistema de gestión de la calidad para organizaciones de mantenimiento aeronáutico [20] | Añade requisitos del sistema de calidad para Parte 145; relevante para los procesos de planificación, el control de proveedores y los KPI en MRO |
| **AS9120 / EN 9120** | Sistema de gestión de la calidad para distribuidores y almacenistas [13][14] | Trazabilidad y cadena de certificados para piezas estándar compradas y materia prima |
| **Nadcap** | Programa de acreditación gestionado por la industria para procesos especiales, fundado en 1990 bajo SAE y administrado por el Performance Review Institute (PRI); las áreas incluyen tratamiento térmico, procesos químicos, END, soldadura, recubrimientos y composites [21][54] | Muchos clientes solo permiten que talleres acreditados realicen procesos especiales; esto limita la elección de fuentes y con frecuencia convierte los procesos especiales en el cuello de botella |
| **FAA 14 CFR Parte 21, Subparte G** (certificado de producción); también Subparte K (Aprobación de Fabricante de Piezas, PMA) y Subparte O (autorización TSO) | Aprobaciones de producción; 14 CFR 21.137 exige un sistema de calidad escrito con 14 elementos, entre ellos control de datos de diseño, control de proveedores, control del proceso de fabricación, control del producto no conforme, registros de calidad y fugas de calidad [41] | El titular de la aprobación controla a sus proveedores; los registros deben conservarse durante al menos 5 años (10 años para componentes críticos) [41]. La mayoría de los proveedores de Nivel 2 y Nivel 3 no poseen por sí mismos una aprobación de producción, sino que trabajan bajo el control de proveedores de su cliente |
| **FAA 14 CFR Parte 145** | Certificado de estación de reparación; trabajo solo dentro de las habilitaciones y especificaciones de operación, con datos de mantenimiento vigentes, un programa de formación aprobado por la FAA y registros conservados durante al menos 2 años [42] | La planificación solo puede asignar trabajos para los que la estación está habilitada, a personal formado, con manuales y datos vigentes disponibles |
| **EASA Parte 21, Subparte G** | Aprobación de Organización de Producción (POA) en la UE [22] | El titular de la aprobación libera piezas con un EASA Formulario 1 y supervisa a sus proveedores; procesos y personal deben corresponderse con la aprobación. Relevante para proveedores estadounidenses de clientes europeos |
| **EASA Parte 145** | Aprobación de organización de mantenimiento (Anexo II del Reglamento (UE) n.º 1321/2014) [23] | Trabajo solo dentro del alcance aprobado (habilitación), con personal certificador y datos de mantenimiento válidos. Una instalación que posea aprobaciones de FAA y EASA puede emitir una liberación dual en el FAA Formulario 8130-3 [43] |
| **EASA Part-CAMO** | Organización de gestión de la aeronavegabilidad continuada, introducida por el Reglamento (UE) 2019/1383 [23] | Planifica el programa de mantenimiento, las directivas de aeronavegabilidad y las piezas de vida limitada en Europa, y entrega paquetes de trabajo al MRO |
| **ITAR / EAR** (EE. UU.) | Controles de exportación para artículos de defensa (ITAR, 22 CFR 120–130) y artículos de doble uso (EAR, 15 CFR 730–774) [36] | El acceso a datos técnicos y piezas puede restringirse por persona y ubicación; esto también se aplica a la planificación y a los sistemas de TI |
| **DFARS / CMMC 2.0** (programas de defensa de EE. UU.) | Cybersecurity Maturity Model Certification; cláusula DFARS 252.204-7021 vigente desde el 10 de noviembre de 2025, implantada por fases a lo largo de tres años; norma del programa 32 CFR Parte 170 [49][50] | Los proveedores que procesan información federal de contratos (FCI) o información no clasificada controlada (CUI) en sus sistemas de planificación, ERP o MES necesitan el nivel CMMC exigido; los contratistas principales deben verificar el estado CMMC de un subcontratista antes de la adjudicación [49] |
| **DFARS 252.225-7009** (metales especiales) | Los metales especiales, incluidos el titanio y sus aleaciones, en artículos entregados bajo contratos del DoD deben fundirse o producirse en EE. UU. o en un país calificado; se transmite a los subcontratos para artículos que contengan metales especiales [51] | La planificación de materiales debe registrar el origen de la colada por lote de colada, no solo la aleación y la cantidad; un lote más barato o más rápido de una fuente no calificada puede no ser utilizable |

### 3.2 AS9100 en detalle: qué significa la norma para la planificación

AS9100D adopta la estructura de ISO 9001 y añade requisitos que llegan directamente a la planificación [44]. Tres de ellos son especialmente importantes.

**Gestión de la configuración.** Debe saber en todo momento qué revisión de diseño se aplica a cada pedido y qué revisión se fabricó realmente. Esto afecta a la liberación de pedidos (liberar solo revisiones válidas), a la gestión de los pedidos abiertos cuando llegan cambios y a la documentación de las desviaciones.

**Trazabilidad.** La norma exige la trazabilidad de todas las materias primas, materiales y procesos utilizados, así como de herramientas y personas [14]. Para la planificación, esto significa que cada confirmación de operación debe registrar como mínimo quién trabajó, cuándo, en qué máquina, con qué material y con qué revisión del proceso. La sección 4 profundiza en ello.

**Entrega a tiempo.** AS9100 nombra explícitamente la entrega a tiempo como requisito [14]. Los clientes evalúan a sus proveedores en cuanto a entrega a tiempo (OTD, por sus siglas en inglés) y calidad. Una OTD deficiente no es, por tanto, solo un problema comercial, sino también un problema de auditoría.

### 3.3 Aprobación de producción de la FAA: qué significa 14 CFR 21.137 para los planificadores

Si usted posee un certificado de producción de la FAA o una Aprobación de Fabricante de Piezas (los titulares de PMA deben cumplir los mismos requisitos de sistema de calidad según 14 CFR 21.307), o si suministra a un titular de este tipo, los requisitos del sistema de calidad de 14 CFR 21.137 dan forma a su planificación [41]. La norma exige que cada solicitante o titular de un certificado de producción establezca un sistema de calidad escrito "que garantice que cada producto y artículo se ajusta a su diseño aprobado y está en condiciones de operación segura" [41]. Sus 14 elementos se leen como una lista de verificación para un proceso de planificación que funciona:

- **Control de datos de diseño y control de documentos:** solo la revisión actual y aprobada puede liberarse al taller.
- **Control de proveedores:** procedimientos que garanticen que cada producto, artículo o servicio suministrado por un proveedor se ajusta a los requisitos del titular de la aprobación, más un proceso de notificación de no conformidades detectadas después de la liberación [41].
- **Control del proceso de fabricación, inspección y ensayo, estado de inspección y ensayo:** la hoja de ruta debe mostrar qué inspecciones se realizan y dónde, y el estado de cada pieza debe ser visible.
- **Control de producto no conforme y acción correctiva:** la chatarra, el retrabajo y las desviaciones deben planificarse y documentarse, no gestionarse de forma informal.
- **Control de los registros de calidad:** al menos 5 años para productos y artículos, y al menos 10 años para componentes críticos [41].
- **Retroalimentación en servicio y fugas de calidad:** los hallazgos del campo y las fugas de calidad retroalimentan el sistema.

Para un proveedor de Nivel 2 o Nivel 3 sin aprobación propia, estos requisitos llegan como trasladados (flow-downs) en la orden de compra del cliente y en el manual de calidad de proveedores. La consecuencia para la planificación es la misma: la evidencia debe generarse en el flujo del pedido, no reconstruirse después.

### 3.4 Perspectiva: AS9100D pasa a ser IA9100

El IAQG trabaja en una revisión de la 9100 que se publicará como IA9100. El nuevo nombre pretende unificar las denominaciones regionales (AS, EN, JISQ). A mediados de octubre de 2026, según una revisión de la información disponible, no existía una publicación oficial ni una fecha confirmada; las estimaciones van desde finales de 2026 hasta principios de 2027. Tampoco se ha fijado el periodo de transición para los certificados [15]. Hasta entonces, AS9100D (EN 9100:2018) sigue siendo la edición válida, y los certificados existentes permanecen vigentes [15]. Planifique la transición como un proyecto aparte una vez que el IAQG haya publicado la norma, y acuerde los plazos con su organismo de certificación.

### 3.5 AS9145: demostrar la preparación para la producción al ritmo del cliente

AS9145 lleva a la aeronáutica el APQP y el PPAP, métodos familiares de la industria automotriz [45]. Estructura el camino hacia la producción en cinco fases: planificación; diseño y desarrollo del producto; diseño y desarrollo del proceso; validación del producto y del proceso; y producción continua, uso y servicio posventa [35]. El paquete PPAP incluye, entre otros, registros de diseño, un diagrama de flujo del proceso, un AMFE de proceso, un plan de control, un análisis del sistema de medición, estudios iniciales de capacidad del proceso y el informe de inspección del primer artículo (FAIR) [35].

Las fases 3 y 4 son decisivas para la planificación. En la fase 3, la preparación para la producción se evalúa en una revisión de preparación para la producción, y los procesos deben cumplir los requisitos a la tasa de demanda del cliente. En la fase 4, las series de producción deben demostrar que el proceso entrega piezas conformes a la tasa del cliente [35]. En otras palabras: la prueba de capacidad forma parte de la aprobación. Si su capacidad existe solo sobre el papel, aquí es donde se hará evidente.

### 3.6 Programas de defensa: CMMC 2.0, controles de exportación y metales especiales

Muchos proveedores aeroespaciales atienden a clientes comerciales y de defensa, a menudo con las mismas máquinas y en el mismo sistema ERP. Tres requisitos estadounidenses llegan entonces hasta la planificación:

- **CMMC 2.0.** La norma DFARS "Assessing Contractor Implementation of Cybersecurity Requirements" entró en vigor el 10 de noviembre de 2025. Añade la cláusula 252.204-7021 y escalona los requisitos de CMMC a lo largo de más de tres años; la norma del programa subyacente, 32 CFR Part 170, entró en vigor el 16 de diciembre de 2024 [49]. El modelo tiene tres niveles y está alineado con NIST SP 800-171 [50]. La transmisión a subcontratistas se aplica cuando el subcontrato implica FCI o CUI, y los contratistas principales deben confirmar el estado CMMC vigente de un subcontratista antes de la adjudicación [49]. Si en su sistema de planificación se almacenan planos, hojas de ruta o instrucciones de trabajo con CUI, ese sistema está dentro del alcance.
- **ITAR y EAR.** Los datos técnicos de artículos de defensa solo pueden ser accesibles para personas autorizadas [36]. Hay que revisar a los planificadores, el soporte de TI externalizado en otros países y los tenants de nube. Esto afecta a dónde se almacenan los datos de planificación y a quién le son visibles qué pedidos.
- **Metales especiales.** Según DFARS 252.225-7009, el titanio y las aleaciones de titanio (entre otros metales especiales) incluidos en artículos entregados bajo contratos del DoD deben fundirse o producirse en EE. UU. o en un país calificado, y la cláusula se transmite a los subcontratos de artículos que contengan metales especiales [51]. La asignación de material, por tanto, debe conocer el origen de fusión de cada lote de colada.

## 4. Trazabilidad y genealogía

### 4.1 Por qué la trazabilidad es una tarea de planificación

La trazabilidad suele tratarse como un tema puramente de calidad. En realidad se crea en el flujo de pedidos, donde se planifica, se ejecuta y se confirma el trabajo. Cuando un planificador traslada un pedido a otra máquina, divide un lote o redirige una operación externa, cambia la genealogía de la pieza. Si después falta esa información, la pieza puede, en el peor de los casos, ya no ser expedible porque su registro está incompleto.

Un artículo reciente de la revista comercial alemana *Produktion* describe la evidencia y la calidad de los datos como el verdadero cuello de botella para los proveedores medianos de la industria de defensa. Cita una encuesta de BearingPoint según la cual solo el 10 % de las empresas encuestadas en Alemania dispone de una arquitectura de datos totalmente integrada, mientras que el 38 % trabaja con sistemas fragmentados [37]. El episodio del podcast m365.fm [Traceability and Genealogy](https://www.m365.fm/show/episodes/traceability-and-genealogy/) analiza cómo pueden implementarse técnica y organizativamente la trazabilidad y la genealogía en la fabricación.

### 4.2 Términos: trazabilidad, genealogía, as-designed y as-built

- **Trazabilidad** es la capacidad de seguir el origen de una pieza (hacia adelante y hacia atrás): ¿de qué material, de qué proveedor, con qué proceso, cuándo y por quién?
- **Genealogía** describe las relaciones padre-hijo entre piezas, lotes y conjuntos. Responde preguntas como: ¿qué conjuntos contienen material del lote de colada X? ¿Qué números de serie se ven afectados por una tanda de tratamiento térmico defectuosa?
- **As-designed** es la configuración que especifica ingeniería; **as-built** es la configuración que realmente se fabricó, incluidas las desviaciones aprobadas. **As-maintained** describe el estado tras el mantenimiento en MRO.

### 4.3 El modelo de datos: lo que debe registrar como mínimo

| Objeto | Atributos típicos | Por qué lo necesita la planificación |
|---|---|---|
| Pieza / número de serie | número de pieza, revisión, número de serie, configuración | vincular con el pedido del cliente y la revisión de diseño |
| Lote / batch | número de lote, cantidad, divisiones y fusiones | dimensionamiento de lotes, acotar un retiro del mercado |
| Materia prima | material, especificación, colada (heat), proveedor, certificado de material, origen de fundición (para metales especiales DFARS [51]) | liberación del material antes de que comience el pedido |
| Operación | máquina, revisión del programa CN, herramienta, parámetros de proceso, inicio/fin | confirmación, plazo de entrega, conciliación de capacidad |
| Personal | empleado, cualificación, validez | asignación solo de personal cualificado |
| Proceso especial | procesador, acreditación, número de carga de horno/tanque, certificado | planificación de pasos externalizados, contención de desviaciones |
| Inspección | plan de inspección, galga, resultado, inspector | liberación, FAI, evidencia de características clave |
| Desviación | concesión, retrabajo, aprobación de desviación | documentación as-built, aptitud para el envío |
| Documento de liberación | certificado de conformidad (C of C); en organizaciones aprobadas, FAA Form 8130-3 o EASA Form 1 [22][23][43] | liberación para el envío; los proveedores sin aprobación de producción propia suelen enviar al titular de la aprobación con un certificado de conformidad |

Una nota sobre los documentos de liberación para lectores de EE. UU.: el FAA Form 8130-3 (Authorized Release Certificate, Airworthiness Approval Tag) documenta las aprobaciones de navegabilidad nacionales, las aprobaciones para la puesta de nuevo en servicio y las aprobaciones de exportación. Solo pueden emitirlo las personas y organizaciones autorizadas por la FAA, y la FAA Order 8130.21H establece que los proveedores sin aprobación de producción generalmente no pueden emitirlo para piezas enviadas a su titular de aprobación de producción; la orden también señala que no es "un documento de entrega o de envío" [43]. Las instalaciones aprobadas tanto por la FAA como por la EASA pueden emitir una liberación dual en el 8130-3 que hace que una pieza sea apta para instalación en aeronaves de EE. UU. y de la UE [43]. La contraparte europea para liberaciones EASA individuales es el EASA Form 1 [22][23].

### 4.4 Piezas de vida limitada

Ciertas piezas, especialmente componentes rotativos de motor como discos y ejes, tienen una vida aprobada en ciclos u horas (life-limited parts, LLP). Su consumo debe documentarse sin lagunas durante toda su vida. En EE. UU., los propietarios y operadores deben conservar los registros de "la situación actual de las piezas de vida limitada" para cada célula, motor, hélice, rotor y equipo, y estos registros se conservan y se transfieren con la aeronave cuando se vende [53]. En Europa, la misma tarea forma parte de la navegabilidad continuada según las normas de la EASA [23]. Si falta parte del historial (la llamada trazabilidad desde el nacimiento, back-to-birth), una pieza técnicamente perfecta puede quedar inutilizable. Para los fabricantes, esto significa que el registro de origen de la pieza, es decir, material, colada, lote de forja y datos de fabricación, debe estar completo. Para los talleres MRO, significa que sin un historial completo una pieza no puede volver a instalarse, y la planificación tiene que buscar un reemplazo.

### 4.5 Piezas falsificadas y no aprobadas

La norma AS9100 exige explícitamente medidas para prevenir piezas falsificadas [14]. La Advisory Circular AC 21-29D (2016) de la FAA describe cómo detectar e informar de piezas no aprobadas sospechosas (suspected unapproved parts, SUP); define una pieza no aprobada como aquella que no cumple los criterios de 14 CFR 21.8 o 21.9, lo que incluye las piezas tergiversadas intencionadamente y las falsificadas [52]. Su orientación para compras es directamente relevante para los planificadores: comprar a fuentes cuya documentación permita rastrear las piezas hasta una fuente aprobada por la FAA, y desconfiar de señales de alerta como un precio muy inferior al de otros vendedores, un plazo de entrega inusualmente corto o documentación ausente [52]. Las piezas no aprobadas sospechosas se notifican mediante el FAA Form 8120-11 [52].

Para la planificación, esto significa que las compras solo pueden proceder de fuentes aprobadas, los certificados deben verificarse en la inspección de recepción, y un reemplazo obtenido con rapidez de una fuente desconocida no es una opción, ni siquiera bajo presión de plazos. Las escaseces de suministro aumentan el riesgo, porque crece la presión para recurrir a fuentes del mercado gris.

### 4.6 En la práctica: incorporar la trazabilidad en el proceso de planificación

1. **Reservar y liberar el material antes de que comience la orden.** Una orden solo comienza cuando el material específico (colada, certificado) está asignado y verificado.
2. **Modelar las cualificaciones en el modelo de capacidad.** La planificación asigna operaciones solo a personas y máquinas con cualificaciones válidas.
3. **Registrar las divisiones y uniones en el sistema.** Cada división de lote crea un nuevo número de lote vinculado a su origen.
4. **Planificar las operaciones externas, incluida la devolución de los certificados.** Una pieza solo se considera de vuelta cuando su certificado ha regresado.
5. **Registrar las confirmaciones en el puesto de trabajo, no al final del turno.** Cuanto más tarde se registren, más información faltará.
6. **Probar sus consultas con regularidad.** Realice un simulacro de retirada: ¿cuánto tiempo tarda en encontrar todos los números de serie de una colada?

## 5. Niveles de planificación: del ritmo de cliente a la operación

### 5.1 Cuatro niveles, cuatro horizontes temporales

La planificación de la producción aeroespacial puede dividirse en cuatro niveles. Cada uno responde a una pregunta distinta y necesita datos diferentes.

| Nivel | Horizonte | Pregunta clave | Herramientas típicas |
|---|---|---|---|
| Planificación estratégica de ritmo y capacidad | 2 a 5 años | ¿Qué ritmo podemos entregar con qué inversión? | cálculo de escenarios, simulación de fábrica, planificación de capital |
| Planificación de ventas y operaciones (S&OP) y programación maestra de producción | 6 a 24 meses | ¿Cómo traducimos los ritmos de cliente en un programa viable? | ERP, planificación de capacidad aproximada, APS |
| Planificación de material y capacidad | 1 a 6 meses | ¿Qué material y qué capacidad necesitamos y cuándo? | ERP/MRP, portales de proveedores, APS |
| Programación detallada y control de planta | horas a 4 semanas | ¿Qué orden se ejecuta cuándo, en qué máquina y con quién? | APS, MES, tablero de planta |

Una causa habitual de un bajo cumplimiento de entregas no es un nivel débil, sino una ruptura entre niveles: la programación maestra compromete el ritmo 75, la programación detallada conoce los cuellos de botella que lo hacen imposible, y nadie concilia sistemáticamente ambas.

### 5.2 ERP, APS y MES: quién hace qué

En la mayoría de las empresas, la [planificación de recursos empresariales (ERP)](https://www.m365.fm/entity/enterprise-resource-planning/) es el sistema principal para pedidos, listas de materiales, rutas de fabricación, inventario y compras. Su planificación clásica de necesidades de materiales (MRP), en su forma básica, calcula con plazos de entrega planificados fijos y sin límites de capacidad. Eso basta para determinar las necesidades de material, pero no para crear un programa de producción factible.

Un sistema de [planificación y programación avanzada (APS)](https://www.m365.fm/entity/advanced-planning-and-scheduling/), en cambio, programa con capacidad finita: máquinas, personas con cualificaciones, herramientas, turnos y disponibilidad de material se consideran al mismo tiempo. El método subyacente se denomina [programación basada en restricciones](https://www.m365.fm/entity/constraint-based-scheduling/). Por último, un sistema de ejecución de fabricación (MES) controla y documenta la ejecución en planta y proporciona las confirmaciones sin las cuales ni la planificación ni la trazabilidad funcionan.

La guía hermana [Programación de producción y APS](https://www.m365.fm/en/learn/production-scheduling-aps/) explica en detalle las diferencias entre ERP, APS y MES, los límites de la lógica MRP y cómo seleccionar software de planificación.

### 5.3 Lo que un modelo de planificación aeroespacial debe incluir además

Frente a la fabricación genérica, un modelo de planificación en el sector aeroespacial necesita algunas restricciones adicionales:

- **Matriz de cualificaciones** de personas (procesos especiales, autorizaciones de inspección, autorizaciones de liberación)
- **Cualificación de máquinas** por número de pieza (no todas las máquinas están aprobadas para todas las piezas)
- **Operaciones externas** con plazos realistas y compromisos de capacidad de los procesadores
- **Pasos de inspección y liberación** como operaciones programables con capacidad propia (laboratorio de inspección, inspectores, FAI)
- **Datos de configuración y efectividad** (qué revisión se aplica desde qué número de serie o aeronave)
- **Asignación de material a nivel de colada** en lugar de solo disponibilidad de cantidades (incluido el origen de fusión donde se aplican las normas DFARS sobre metales especiales [51])
- **Restricciones de lote** para hornos, autoclaves y tanques de proceso (carga mínima, compatibilidad de piezas y materiales)
- **Restricciones de acceso a los datos** para pedidos controlados por ITAR o CUI (quién puede ver y programar qué trabajo) [36][49]

## 6. Comprender y reducir el tiempo de entrega

### 6.1 La Ley de Little: la relación entre inventario y tiempo

En 1961, John D. C. Little demostró una relación que se cumple en todo sistema productivo estable: el inventario medio en el sistema es igual al rendimiento multiplicado por el tiempo medio en el sistema [27]. Reordenada:

**Tiempo de entrega = trabajo en proceso (WIP) ÷ rendimiento**

**Ejemplo práctico:** Un taller de componentes de motor envía una media de 40 piezas por semana. Hay 320 piezas en el sistema (en proceso, en espera, en el proveedor externo de procesos especiales, en inspección). El tiempo de entrega medio es entonces 320 ÷ 40 = 8 semanas. Si el WIP se reduce a 200 piezas con el mismo rendimiento, el tiempo de entrega baja a 5 semanas. El rendimiento no cambia mientras el cuello de botella siga completamente abastecido.

La ley explica por qué liberar más órdenes al taller no acorta el plazo de entrega, sino que lo alarga: el WIP aumenta, el rendimiento se mantiene y el tiempo de entrega crece.

### 6.2 Dónde se va el tiempo

En muchas fábricas, el tiempo real de procesado es solo una pequeña parte del tiempo de entrega; la mayor parte es tiempo de espera. Esta es una regla práctica muy extendida, no una proporción documentada de forma general [unverified: regla práctica extendida sin fuente documentada que la respalde]. La proporción depende en gran medida de la empresa y debe medirse en su propia planta, por ejemplo con el [mapeo de la cadena de valor](https://www.m365.fm/en/learn/value-stream-mapping/). En aeroespacial, las causas típicas son:

- **Espera por procesos especiales externos** (transporte de ida y vuelta, cola en el proveedor, devolución de certificados)
- **Espera por inspección y liberación** (laboratorio de inspección, FAI, inspección en origen por el cliente, concesiones)
- **Espera por material o documentos** (certificados que faltan, cambios de ingeniería abiertos)
- **Agrupación por lotes** (las piezas esperan hasta que un horno o un lote está completo)
- **Cuellos de botella sobrecargados** (una utilización alta genera colas desproporcionadamente largas)
- **Alteración por pedidos urgentes** (la gestión de urgencias desplaza los pedidos regulares)

### 6.3 Palancas para plazos más cortos

1. **Limitar el WIP.** Liberar solo tantas órdenes como el cuello de botella pueda procesar. La Teoría de Restricciones lo llama la "cuerda" (Sección 11).
2. **Agrupar y programar los pasos externos.** Días fijos de recogida y entrega con el proveedor reducen la variabilidad.
3. **Planificar la capacidad de inspección.** El laboratorio de inspección y los inspectores son capacidad igual que las máquinas y deben incluirse en el plan de capacidad.
4. **Completar los documentos antes del inicio.** Ninguna orden sin documentación completa: material con certificado y una revisión de diseño válida.
5. **No cargar los cuellos de botella por encima del 85 al 90 % durante periodos largos** cuando la variabilidad es alta. Esta regla práctica se deriva de la teoría de colas (Sección 11.1); el valor adecuado depende de la variabilidad de su planta. Una pequeña reserva de capacidad suele costar menos que colas largas.

## 7. Planificación de procesos especiales y operaciones externas

### 7.1 Por qué los procesos especiales a menudo se convierten en el cuello de botella

Los procesos especiales son aquellos cuyo resultado no puede verificarse por completo en la pieza terminada sin destruirla, por ejemplo el tratamiento térmico, el tratamiento superficial, la soldadura o ciertos recubrimientos. Por ello, su calidad debe garantizarse mediante procesos, equipos y personal cualificados. En el sector aeroespacial, muchos clientes exigen la acreditación Nadcap para ellos [21][54].

Esto tiene tres consecuencias para la planificación. En primer lugar, el número de fuentes aprobadas es limitado; un cambio requiere cualificación y, a menudo, una nueva inspección del primer artículo. En segundo lugar, muchos de estos procesos funcionan por lotes (hornos, tanques, autoclaves), lo que genera tiempos de agrupación y de espera. En tercer lugar, los proveedores informan de que los ensayos y el tratamiento superficial, en particular, tienen plazos de entrega largos [10].

### 7.2 Reglas de planificación para los procesos especiales

- **Modele el proceso especial como un recurso,** no como un plazo de entrega fijo. Un tratamiento térmico externo con dos cargas de horno por semana es una capacidad con una cadencia, no "plazo de entrega de 10 días".
- **Acuerde por contrato los compromisos de capacidad** (turnos por semana) y regístrelos en la planificación como una restricción firme.
- **Planifique la agrupación en lotes de forma deliberada.** ¿Qué piezas pueden procesarse juntas? ¿Qué carga mínima tiene sentido? ¿Cuánto tiempo puede esperar una pieza a formar lote como máximo?
- **Haga que la confirmación, incluido el certificado,** sea una condición para la siguiente operación.
- **Cualifique fuentes alternativas** antes de que el cuello de botella se vuelva crítico. La cualificación suele tardar meses.

### 7.3 Procesos especiales internos: fabricar o comprar desde el punto de vista de la capacidad

Muchos proveedores consideran internalizar los procesos especiales para reducir su dependencia. Esto puede tener sentido, pero es un proyecto con un plazo propio considerable: equipos, cualificación, acreditación, personal y aprobaciones del cliente. Una simulación de la utilización futura (sección 11.4) ayuda a aclarar si la inversión compensa o si el equipo interno solo crea un nuevo cuello de botella con baja utilización.

## 8. Cambios de ingeniería y gestión de la configuración

### 8.1 Los cambios son habituales en el sector aeroespacial

Durante la larga vida de un programa de aeronaves, los planos, los materiales, los procesos y los proveedores cambian una y otra vez. Cada cambio debe evaluarse, aprobarse y recibir una efectividad: ¿a partir de qué número de serie, aeronave o fecha se aplica la nueva revisión? Para la planificación, esto es una fuente permanente de perturbaciones.

### 8.2 Qué desencadena un cambio en la planificación

| Impacto | Consecuencia para la planificación |
|---|---|
| Nueva revisión de diseño | revisar los pedidos abiertos: agotarlos, retrabajarlos, desecharlos o enviarlos con una concesión |
| Operaciones nuevas o modificadas | actualizar la hoja de ruta, los tiempos estándar, los programas CN y los planes de inspección |
| Inspección del primer artículo (completa o parcial) | programar la FAI como operación propia con capacidad de inspección; aprobación antes de las entregas de producción [18][34] |
| Cambio de material o de proveedor | cualificación, posiblemente una nueva FAI, nuevos certificados y plazos de compra |
| Nuevas herramientas o utillajes | plazo de compra, aceptación, posiblemente FAI para herramientas modificadas |

Según AS9102, un cambio de diseño que afecte a la forma, el ajuste o la función, un cambio de fuente, proceso, ubicación o herramental de fabricación, y una interrupción de la producción de más de dos años, entre otros supuestos, desencadenan una inspección completa o parcial del primer artículo [34]. La revisión C de AS9102, publicada en 2023, hace más hincapié en la planificación, la evaluación y la repetición de las inspecciones del primer artículo [18][46]. En Europa, la edición correspondiente se publicó como EN 9102:2024 (en Alemania como DIN EN 9102:2025-01) [17].

### 8.3 Reglas prácticas para gestionar los cambios

1. **Agrupe los cambios cuando el cliente lo permita.** Muchos cambios pequeños individuales cuestan más que unos pocos agrupados.
2. **Defina la efectividad pronto y trasládela a la planificación.** Un pedido debe conocer al inicio qué revisión está fabricando.
3. **Gestione activamente el inventario de revisiones antiguas.** Lanzar grandes lotes de la revisión antigua cuando un cambio es previsible genera chatarra.
4. **Reserve capacidad para la FAI.** Los recursos de inspección para primeros artículos se saturan rápidamente durante los arranques y las oleadas de cambios.
5. **Haga visible el estado de los cambios en el tablero de planificación.** Los pedidos con cambios abiertos son pedidos de riesgo.

## 9. Curvas de aprendizaje de Wright: teoría y ejemplo práctico

### 9.1 El descubrimiento de 1936

En 1936, Theodore Paul Wright publicó el artículo "Factors Affecting the Cost of Airplanes" en el *Journal of the Aeronautical Sciences* (vol. 3, n.º 4, pp. 122–128) [24]. Constató que las horas de mano de obra necesarias por avión disminuían alrededor de un 20 % con cada duplicación de la producción acumulada [25]. Este patrón se conoce hoy como Ley de Wright o curva de aprendizaje. Una reducción del 20 % por duplicación se denomina curva de aprendizaje del 80 %; el nombre indica la proporción que queda [25].

Las curvas de aprendizaje siguen siendo una herramienta estándar para la estimación de costes y la planificación de capacidad en el sector aeroespacial. La Oficina de Responsabilidad Gubernamental de Estados Unidos (GAO) las describe en su Cost Estimating and Assessment Guide [26].

### 9.2 Dos variantes: promedio acumulado y modelo unitario

Existen dos formulaciones habituales [26]:

- **Modelo de promedio acumulado (Wright):** las horas *medias* de todas las unidades fabricadas hasta el momento disminuyen un porcentaje fijo por cada duplicación.
- **Modelo unitario (modelo de Crawford):** las horas de la unidad *individual* disminuyen un porcentaje fijo por cada duplicación.

Ambos usan la misma fórmula, pero con magnitudes de referencia distintas [26][40]. Decida qué variante utiliza y manténgala. Si traslada una tasa de aprendizaje del modelo de promedio acumulado al modelo unitario, estará comparando valores reales y objetivos que no coinciden.

La fórmula es: **Y = A · X^b**, donde A = horas de la primera unidad, X = unidades acumuladas y b = log(tasa de aprendizaje) ÷ log(2) [26].

### 9.3 Ejemplo práctico: puesta en marcha de un nuevo montaje

Un proveedor asume el montaje de un nuevo subconjunto. La primera unidad requiere 1.000 horas de montaje. Basándose en programas comparables, se supone una curva de aprendizaje del 85 % (modelo de promedio acumulado).

**Paso 1: Calcular el exponente.** b = log(0,85) ÷ log(2) = −0,2345.

**Paso 2: Horas medias y horas unitarias.** Las horas de la unidad N se obtienen de la diferencia de los totales acumulados: T(N) = N · media(N) − (N−1) · media(N−1).

| Unidades acumuladas N | Horas medias por unidad | Horas acumuladas | Horas de la unidad N |
|---|---|---|---|
| 1 | 1.000,0 | 1.000 | 1.000,0 |
| 2 | 850,0 | 1.700 | 700,0 |
| 4 | 722,5 | 2.890 | 571,3 |
| 8 | 614,1 | 4.913 | 477,4 |
| 16 | 522,0 | 8.352 | 402,6 |
| 32 | 443,7 | 14.199 | 340,9 |
| 50 | 399,6 | 19.981 | 306,6 |
| 100 | 339,7 | 33.968 | 260,3 |

**Paso 3: Consecuencias para la planificación de capacidad.** Si el proveedor planificara las primeras diez unidades con las horas de la centésima unidad (260 horas), llegaría a 2.603 horas. Según la curva de aprendizaje, las primeras diez unidades necesitan realmente 5.828 horas, más del doble. Una puesta en marcha planificada con horas estándar de régimen maduro queda, por tanto, sistemáticamente infradimensionada.

**Paso 4: Comprobar la sensibilidad.** ¿Hasta qué punto depende el resultado de la tasa de aprendizaje supuesta? Con una curva del 90 % en lugar del 85 %, la necesidad para las primeras 100 unidades pasa de 33.968 a 49.659 horas, un aumento del 46 %. La elección de la tasa de aprendizaje es, por tanto, una de las suposiciones con mayor impacto en todo el plan de puesta en marcha.

### 9.4 Reglas prácticas para las curvas de aprendizaje

- **Derive las tasas de aprendizaje de sus propios datos,** no las copie de la literatura. Registre las horas reales por unidad desde el principio.
- **Distinga las curvas de aprendizaje según el contenido de trabajo.** El montaje manual aprende más que el mecanizado, donde el tiempo de máquina apenas disminuye.
- **Tenga en cuenta las interrupciones.** Tras pausas prolongadas, cambios de personal o traslados, se pierde parte del efecto de aprendizaje.
- **Haga seguimiento de lo real frente a lo objetivo.** Si las horas reales se mantienen por encima de la curva, la suposición o el proceso son erróneos. La planificación necesita saber cuál de los dos.
- **Los cambios de ingeniería reinician parcialmente la curva.** Un cambio importante puede desencadenar un nuevo proceso de aprendizaje.

## 10. Planificación de una rampa de tasa: cálculo y lista de verificación

### 10.1 Por qué fallan las rampas en el cuello de botella

Un aumento de tasa suele evaluarse sobre la base de la capacidad total: "Estamos al 75 % de utilización de media, así que podemos asumir un 20 % más." Eso rara vez es cierto, porque el rendimiento lo determina el cuello de botella, no la media. Eliyahu M. Goldratt popularizó este principio en la década de 1980 con la [Teoría de las Restricciones](https://www.m365.fm/entity/theory-of-constraints/) [28].

### 10.2 Ejemplo práctico: de la tasa 60 a la tasa 72

Un proveedor entrega un juego de piezas de racor por avión. La tasa del cliente debe subir de 60 a 72 aviones al mes (un 20 % más). Los tres recursos más importantes presentan la siguiente situación:

| Recurso | Horas disponibles/mes | Carga con tasa 60 | Utilización tasa 60 | Carga con tasa 72 | Utilización tasa 72 |
|---|---|---|---|---|---|
| Mecanizado de 5 ejes | 1.400 | 1.190 | 85 % | 1.428 | 102 % |
| Desbarbado y montaje | 2.000 | 1.300 | 65 % | 1.560 | 78 % |
| Laboratorio de inspección (CMM) | 600 | 420 | 70 % | 504 | 84 % |
| Total (ponderado por horas) | 4.000 | 2.910 | 73 % | 3.492 | 87 % |

Una utilización total del 87 % parece viable. Pero el mecanizado de 5 ejes, con un 102 %, está por encima de su capacidad, y eso sin contar averías, preparaciones para variantes adicionales ni inspecciones de primer artículo tras los cambios. A ello se suma el efecto de la Sección 6: cuanto más se acerca la utilización al 100 %, más crecen las colas. Sin medidas, el plazo de entrega y los retrasos aumentan aunque la capacidad total sea matemáticamente suficiente.

**Acciones posibles, ordenadas por plazo de implantación:**

1. **Inmediatamente:** proteger el cuello de botella (sin tiempos muertos en las pausas, preparar los cambios de formato fuera del tiempo de máquina, desacoplar la inspección de la máquina).
2. **Semanas:** turnos adicionales en fin de semana, trasladar piezas de menor complejidad a otras máquinas cualificadas.
3. **Meses:** optimización de programas (tiempo de ciclo), utillajes para varios amarres, externalización de piezas concretas a socios cualificados (con FAI).
4. **Trimestres a años:** una máquina adicional, incluidos el plazo de entrega, la instalación, la cualificación y la aprobación del cliente.

El último punto muestra por qué las rampas en aeronáutica necesitan tanto plazo: entre la decisión de adquirir una nueva máquina y su primera entrega de producción aprobada suelen transcurrir muchos meses.

### 10.3 Lista de verificación: ¿está su planta preparada para la siguiente tasa?

**Demanda y escenarios**

- [ ] Se dispone de la tasa del cliente, las liberaciones y la demanda de recambios por número de pieza para al menos 18 meses.
- [ ] Se han calculado al menos tres escenarios de tasa (conservador, plan, ambicioso).
- [ ] Los disparadores para inversión y contratación están definidos de antemano.

**Capacidad**

- [ ] Se conoce el cuello de botella de cada escenario, no solo la utilización media.
- [ ] La utilización del cuello de botella en el escenario plan está por debajo del 85 al 90 %.
- [ ] Se han planificado las curvas de aprendizaje de las nuevas piezas (Sección 9).
- [ ] La capacidad de inspección y medición está planificada para producción, FAI y cambios.

**Personas**

- [ ] La matriz de cualificaciones muestra cuántas personas están disponibles para cada proceso especial e inspección.
- [ ] Los tiempos de incorporación y cualificación de los nuevos empleados están incluidos en el plan.
- [ ] Se han identificado los puntos únicos de fallo (cualificaciones de una sola persona).

**Material y proveedores**

- [ ] Los contratos de materia prima cubren la tasa más alta, incluidos los plazos de entrega.
- [ ] Los procesos especiales externos tienen compromisos de capacidad para la nueva tasa.
- [ ] Las segundas fuentes para materiales y procesos críticos están cualificadas o en proceso de cualificación.
- [ ] Para trabajos de defensa: las fuentes de material cumplen las normas DFARS sobre metales especiales [51].

**Calidad y aprobaciones**

- [ ] Las nuevas máquinas, utillajes y fuentes están planificados con los plazos de FAI y aprobación del cliente.
- [ ] Se prepara la prueba de preparación para la producción a la tasa del cliente (AS9145) [35].
- [ ] La trazabilidad funciona con mayores volúmenes sin retrabajos manuales.

**Control**

- [ ] Los KPI (OTD, plazo de entrega, WIP, utilización del cuello de botella) se registran semanalmente.
- [ ] Hay definida una ruta de escalado para las averías en el cuello de botella.
- [ ] El plan se concilia periódicamente con las confirmaciones reales.

## 11. Planificación de capacidad con APS, gestión de cuellos de botella y simulación

### 11.1 Por qué una alta utilización cuesta tiempo

La teoría de colas ofrece una regla práctica sencilla: el tiempo medio de espera en un recurso crece con el factor u ÷ (1 − u), donde u es la utilización. Esta aproximación se remonta a J. F. C. Kingman (1961); en su forma completa también incluye la variabilidad de las llegadas y de los tiempos de proceso [38]. Con una utilización del 80 % el factor es 4, con el 90 % ya es 9 y con el 95 % es 19. El tiempo de espera en un recurso con 95 % de utilización es, por tanto, casi cinco veces mayor que con el 80 %, manteniendo todo lo demás igual.

Esto es especialmente relevante en aeroespacial por su alta variabilidad (cambios, retrabajos, procesos externos, pedidos urgentes). Si planifica un cuello de botella al 98 % de utilización, también estará planificando plazos de entrega largos.

### 11.2 Gestión de cuellos de botella con la Teoría de Restricciones

La Teoría de Restricciones (TOC, por sus siglas en inglés) describe cinco pasos de concentración: identificar la restricción, explotarla, subordinar todo lo demás a ella, elevarla y, después, volver a empezar, porque la restricción se desplaza [28]. Para el control de la planta, se ha consolidado el principio de tambor-amortiguador-cuerda (DBR, por sus siglas en inglés):

- **Tambor:** el cuello de botella marca el ritmo. Su programa es el programa maestro del taller.
- **Amortiguador:** se coloca un amortiguador temporal delante del cuello de botella para que las perturbaciones aguas arriba no lo dejen sin trabajo.
- **Cuerda:** la liberación de material al inicio de la producción se vincula al cuello de botella. Solo se libera lo que el cuello de botella puede procesar en un horizonte previsible. Así se limita el trabajo en curso (WIP).

En aeroespacial, el cuello de botella a menudo no está en su propia nave sino en el proceso especial externo o en el laboratorio de inspección. DBR sigue funcionando si trata el paso externo como el tambor y vincula su propia liberación a sus turnos.

### 11.3 APS en aeroespacial: qué debe hacer

Un sistema APS para un proveedor aeroespacial debe ser capaz, como mínimo, de lo siguiente:

| Capacidad | Por qué importa en aeroespacial |
|---|---|
| Programación con capacidad finita | Los cuellos de botella son la norma, no la excepción |
| Cualificaciones de personas y máquinas | Solo se pueden programar recursos cualificados |
| Operaciones externas con turnos | Los procesos especiales suelen ser el verdadero cuello de botella |
| Formación de lotes | Hornos, tanques y autoclaves trabajan por lotes |
| Pasos de inspección y liberación | Las FAI y las inspecciones consumen capacidad |
| Reprogramación rápida | Los cambios, retrabajos y pedidos urgentes son frecuentes |
| Escenarios (what-if) | Evaluar escenarios de ritmo, inversiones y fallos de proveedores |
| Retroalimentación desde el taller | Sin datos reales, cada plan queda obsoleto |
| Integración con ERP y MES | Los datos maestros y los pedidos proceden del ERP; los datos reales, del MES |
| Control de acceso a datos controlados | Los pedidos ITAR y CUI solo deben ser visibles para usuarios autorizados [36][49] |

La guía hermana [Programación de producción y APS](https://www.m365.fm/en/learn/production-scheduling-aps/) contiene una lista de verificación para la selección y una hoja de ruta de implantación para sistemas APS.

### 11.4 Simulación: probar las decisiones de capacidad antes de tomarlas

Una [simulación de fábrica](https://www.m365.fm/entity/factory-simulation/) representa recursos, pedidos, variabilidad y reglas en un modelo y recorre semanas o meses en minutos. Responde a preguntas que un cálculo estático de capacidad no puede responder:

- ¿Cómo evolucionan el plazo de entrega y la entrega a tiempo con un ritmo de 67 y con uno de 75?
- ¿Qué aporta una máquina adicional y dónde aparece el siguiente cuello de botella?
- ¿Qué ocurre si el tratamiento térmico externo está parado durante dos semanas?
- ¿Qué regla de liberación mantiene el WIP más bajo con la misma entrega a tiempo?
- ¿Compensa un proceso especial interno o el equipo quedará infrautilizado?

La simulación no sustituye a la programación detallada; prepara las decisiones estratégicas y tácticas. Es especialmente valiosa antes de inversiones con plazos largos, que es exactamente la situación en la que se encuentran muchos proveedores con los planes de ritmo actuales. En m365.fm también encontrará la página de entidad [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) sobre el tema de planificación y simulación.

## 12. Riesgos de la cadena de suministro de 2022 a 2026 y sus implicaciones para la planificación

### 12.1 Lo que ocurrió en los últimos años

**Motores.** En 2023, Pratt & Whitney informó de un defecto en el metal pulvimetalúrgico de determinadas piezas del motor turbofan de engranajes (GTF), que puede provocar grietas. En septiembre de 2023, la empresa matriz RTX anunció que entre 600 y 700 motores adicionales tendrían que retirarse para visitas al taller hasta 2026 y previó que, en promedio, 350 aviones de la familia A320 al año quedarían en tierra. RTX registró un cargo antes de impuestos de 3 000 millones de dólares; los costes totales se estimaron en hasta 7 000 millones de dólares, parte de los cuales recae en socios como MTU [11]. En 2026, Airbus acusó a Pratt & Whitney de priorizar el mantenimiento en servicio sobre los motores nuevos y de no entregar las cantidades pedidas [4]. A mediados de 2026, Airbus afirmó que ya no tenía aviones terminados esperando únicamente motores, pero tampoco tenía ningún colchón [39].

**Titanio.** Tras el ataque de Rusia a Ucrania, Boeing suspendió en marzo de 2022 las compras al productor ruso de titanio VSMPO-Avisma. Airbus, que entonces afirmó que obtenía alrededor de la mitad de su titanio de Rusia, al principio siguió comprando [12]. El titanio sigue siendo una de las materias primas de riesgo más citadas en 2026 [10]. Para los proveedores de programas de defensa de EE. UU., la cláusula DFARS sobre metales especiales añade una restricción de origen además del problema de disponibilidad [51].

**Fundiciones y forjados.** Roland Berger informa de carencias persistentes en 2026 de fundiciones y forjados para componentes de motor y sistemas (como el tren de aterrizaje) y de elementos de fijación para estructuras. En el caso de los álabes de turbina, la industria aeronáutica compite con las turbinas de gas industriales, cuya demanda también crece por las necesidades energéticas de los centros de datos [10].

**Mano de obra cualificada.** La escasez de personal cualificado sigue siendo el freno más común a la rampa de producción (56 % de los encuestados) [10]. La situación en mantenimiento es similar (sección 13).

**Cambio estructural entre los proveedores.** Airbus está asumiendo paquetes de trabajo que antes correspondían a Spirit AeroSystems. La integración redujo los resultados de Airbus de los primeros nueve meses de 2026 en 235 millones de euros [3]. Cambios de este tipo modifican las relaciones de suministro en todos los niveles inferiores.

### 12.2 Respuestas de planificación

| Riesgo | Respuesta de planificación |
|---|---|
| Plazos de entrega de materiales largos y variables | acuerdos a largo plazo con compromisos de capacidad, stock de seguridad orientado a los materiales críticos, actualizar con regularidad los plazos de reposición |
| Fuentes únicas para procesos especiales | cualificar segundas fuentes, asegurar turnos por contrato, modelizar el cuello de botella en el plan |
| Liberaciones de cliente fluctuantes | seguir por separado la cadencia y las liberaciones del cliente, plantear las desviaciones con antelación |
| Escasez de personal | matriz de cualificación, formación cruzada, incorporación incluida en el plan de capacidad |
| Fallo de un proveedor | simular escenarios, vigilar indicadores tempranos de alerta (retrasos en entregas, calidad, salud financiera) |
| Acumulación de inventario frente a interrupciones | mantener inventario de forma deliberada y en cantidades limitadas allí donde proteja el cuello de botella; cada unidad de inventario alarga el plazo de entrega según la Ley de Little |

Una nota importante sobre el último punto: el inventario no es una protección gratuita. Según Roland Berger, el 40 % de los proveedores aumentó sus inventarios de cara al inicio de la producción, lo que presiona márgenes ya de por sí ajustados [10]. Los colchones dirigidos delante del cuello de botella son más eficaces que un stock de seguridad generalizado para todas las piezas.

## 13. Planificación de MRO: mantenimiento con hallazgos no previstos

### 13.1 El mercado de MRO en 2026

El mantenimiento, reparación y revisión general (MRO, por sus siglas en inglés) es un mercado grande y en crecimiento. En su previsión publicada junto con la US Aeronautical Repair Station Association (ARSA), Oliver Wyman sitúa el mercado mundial de MRO de aviación comercial en 139.600 millones de dólares para 2026 y prevé que alcance los 193.100 millones de dólares en 2036. El mantenimiento de motores es el segmento más grande, con 70.100 millones de dólares. Se espera que la flota crezca de unos 30.000 aviones comerciales a comienzos de 2026 a unos 41.100 en 2036 [30]. En un análisis aparte de septiembre de 2026, Oliver Wyman señala escasez de materiales, plazos de entrega largos para fundiciones y forjas, y pocos proveedores de piezas críticas de motor; casi el 30 % de los encuestados espera que la cadena de suministro se recupere por completo solo en más de tres años [29].

Los retrasos en la entrega de aviones nuevos aumentan la presión: las aerolíneas operan los aviones más antiguos durante más tiempo, y estos necesitan más mantenimiento. El estudio de IATA estima el coste adicional de mantenimiento solo en 2025 en 3.100 millones de dólares [9]. Al mismo tiempo, la nueva producción y el mantenimiento compiten por las mismas piezas y la misma capacidad, como muestra la disputa entre Airbus y Pratt & Whitney [4].

### 13.2 Marco normativo

En Estados Unidos, un taller de mantenimiento normalmente trabaja con un certificado de estación de reparación emitido conforme a 14 CFR Parte 145. Una estación de reparación solo puede trabajar en artículos para los que está habilitada y dentro de sus especificaciones de operación, y "no puede mantener ni modificar ningún artículo para el que no esté habilitada" [42]. Debe mantener actualizados y accesibles los datos de mantenimiento vigentes, como las directivas de aeronavegabilidad, los manuales de mantenimiento, los manuales de revisión general y los boletines de servicio, "actualizados y accesibles cuando se realiza el trabajo correspondiente", aplicar un programa de formación aprobado por la FAA y conservar los registros de trabajo durante al menos dos años desde la aprobación para la puesta en servicio [42]. Los paquetes de trabajo suelen proceder del operador de la aeronave, que también es responsable de registros como el estado actual de las piezas de vida limitada según 14 CFR 91.417 [53]. Muchas estaciones de reparación también están certificadas según AS9110 [20].

En Europa, una organización de mantenimiento trabaja con una aprobación conforme a EASA Parte 145. Los paquetes de trabajo a menudo proceden de una organización de gestión de la aeronavegabilidad continuada (Part-CAMO), que gestiona el programa de mantenimiento, las directivas de aeronavegabilidad y las piezas de vida limitada [23]. Las estaciones de reparación estadounidenses que también poseen aprobación EASA pueden emitir liberaciones duales en el formulario FAA 8130-3 [43].

Para la planificación, ambos sistemas significan lo mismo: el trabajo solo está permitido dentro del alcance aprobado, por personal autorizado y con datos de mantenimiento válidos, como el Manual de Mantenimiento de la Aeronave (AMM) o el Manual de Mantenimiento de Componentes (CMM) en su revisión vigente. Un técnico sin la autorización o formación adecuada tampoco cuenta aquí como capacidad.

### 13.3 Lo que hace fundamentalmente diferente la planificación de MRO

En la producción nueva, el contenido del trabajo se conoce antes de iniciar el pedido. En el mantenimiento, solo se conoce después de que el avión, el motor o el componente se ha abierto e inspeccionado. Por tanto, la planificación debe tratar tres tipos de trabajo:

- **Trabajo rutinario:** tareas programadas del programa de mantenimiento o del manual del taller, fáciles de planificar
- **Trabajo no rutinario (hallazgos):** corrosión, grietas, desgaste o daños descubiertos durante la inspección; el alcance y el momento son inciertos
- **Trabajo adicional:** modificaciones, directivas de aeronavegabilidad o peticiones del cliente añadidas al paquete de trabajo

El KPI central es el tiempo de respuesta o turnaround time (TAT), el tiempo desde la entrada hasta la devolución al cliente. Cada día que un avión o motor pasa de más en el taller cuesta dinero al operador. El TAT viene determinado a menudo menos por las horas de mano de obra que por la espera de piezas, las decisiones sobre los hallazgos, las aprobaciones y los especialistas.

### 13.4 Ejemplo resuelto: planificar los hallazgos en lugar de confiar en la suerte

Un taller de MRO de componentes planifica la revisión general de un tipo de componente. El trabajo rutinario son 80 horas. A partir del historial propio del taller de los últimos 50 pedidos, hay tres hallazgos típicos (todos los valores son supuestos para el ejemplo):

| Hallazgo | Frecuencia | Horas adicionales | Piezas necesarias |
|---|---|---|---|
| Corrosión, reparable | 40 % | 12 h | no |
| Grieta, sustitución de pieza | 10 % | 20 h | sí, plazo de entrega 15 días laborables, sin stock |
| Desgaste, pieza de repuesto | 30 % | 6 h | sí, desde stock |

**Horas adicionales esperadas:** 0,4 × 12 + 0,1 × 20 + 0,3 × 6 = 4,8 + 2,0 + 1,8 = 8,6 horas. En promedio, se pueden planificar unas 89 horas por pedido. Para la planificación de capacidad en muchos pedidos, este valor esperado resulta útil.

**Para el compromiso de TAT, no es suficiente.** Para el 10 % de los pedidos, se añaden 15 días laborables de espera por la pieza de repuesto. Si se compromete el TAT como promedio (matemáticamente, una holgura de 1,5 días), se incumplirá de forma grave en cada décimo pedido. Mejores opciones son:

1. **Tener la pieza en stock:** una o dos piezas en almacén reducen mucho el riesgo de TAT. Compare el coste del inventario con el coste del retraso.
2. **Inspeccionar antes:** cuanto antes se conozca el hallazgo, antes se puede hacer el pedido. Programe la inspección como primer paso, con prioridad.
3. **Comprometer el TAT por percentil:** por ejemplo, un TAT que se cumpla en el 80 o el 90 % de los casos, con una regla transparente para los hallazgos con plazos de suministro de piezas largos.
4. **Pool de intercambio:** para hallazgos frecuentes, un pool de intercambio de unidades rotables puede desacoplar el TAT del ciclo de reparación.

### 13.5 Reglas prácticas para la planificación de MRO

- **Registre sistemáticamente el historial de hallazgos.** Sin datos sobre la frecuencia y el esfuerzo de los hallazgos, todo plan seguirá siendo una estimación.
- **Reserve capacidad para trabajos no rutinarios.** Si carga el hangar o el taller al 100 % con trabajo rutinario, no queda margen para los hallazgos.
- **Compruebe la disponibilidad de piezas antes de aceptar el pedido.** Las piezas críticas con plazos de suministro largos son el mayor riesgo para el TAT.
- **Compruebe la vida útil y el historial de las piezas.** Las piezas sin trazabilidad completa no pueden volver a instalarse (sección 4.4).
- **Programe de forma visible a los especialistas cuello de botella.** Los inspectores de END, el personal autorizado para aprobar la devolución al servicio y los talleres especializados suelen ser el cuello de botella.
- **Informe pronto a los clientes sobre los hallazgos.** Las decisiones de aprobación del cliente suelen ser la espera más larga del proceso.

## 14. Gemelo digital e hilo digital

### 14.1 Términos

Un [gemelo digital](https://www.m365.fm/entity/digital-twin/) de producción es un modelo de la fábrica real que se alimenta con datos actuales y se utiliza para el análisis, la planificación y la simulación. Abarca recursos, pedidos, rutas de fabricación, inventario y reglas. El hilo digital es el vínculo continuo de los datos de un producto a lo largo de su ciclo de vida: desde el diseño, pasando por la fabricación y la inspección, hasta la operación y el mantenimiento. En aeroespacial, el hilo digital está estrechamente ligado a la trazabilidad y a la gestión de la configuración, porque conecta lo diseñado, lo fabricado y lo mantenido.

### 14.2 Beneficios para la planificación y la calidad

- **Planificación:** el gemelo de la fábrica permite escenarios y optimización basados en el estado actual (véase la sección 11.4).
- **Trazabilidad:** el hilo digital responde en minutos, en lugar de días, a preguntas sobre lotes, procesos y configuraciones.
- **Cambios:** se hace visible el impacto de un cambio de diseño en los pedidos abiertos, el inventario y las rutas de fabricación.
- **MRO:** vincular el historial de fabricación con los hallazgos de mantenimiento permite extraer conclusiones sobre debilidades del proceso y del diseño.

### 14.3 Requisitos previos

Un gemelo digital solo es tan bueno como sus datos. Antes de invertir en modelos, revise las rutas de fabricación, los tiempos estándar, los calendarios de capacidad, las cualificaciones y la calidad de la confirmación. La consultora 4flow señala como obstáculos típicos en aeroespacial las listas de materiales incorrectas, los plazos de suministro desactualizados y los datos dispersos entre plataformas ERP, PLM y MES desconectadas, que a menudo devuelven a los planificadores a hojas de cálculo aisladas [33]. La guía hermana [Gemelo digital en la fabricación](https://www.m365.fm/en/learn/digital-twin-manufacturing/) trata este tema con más profundidad; las cuestiones de arquitectura de TI, como la conexión de los datos de máquinas y de planificación con plataformas en la nube, se tratan en la guía [Manufacturing IT with Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/). Para los datos sujetos a controles de exportación o a las normas de CUI, la ubicación del almacenamiento y los derechos de acceso deben aclararse desde el principio [36][37][49]. En los programas de defensa de EE. UU., esto incluye el nivel de CMMC exigido para los sistemas que contienen los datos [49][50].

## 15. KPI para la planificación y el control

| KPI | Definición | Por qué importa en aeroespacial |
|---|---|---|
| Entrega a tiempo (OTD) | proporción de entregas realizadas en la fecha comprometida (acordar la definición y la ventana de tolerancia con el cliente) | criterio central de las evaluaciones de proveedores; citado como requisito en AS9100 [14] |
| Plazo de entrega | tiempo desde el inicio del pedido hasta su finalización, como promedio y dispersión | determina la capacidad de entrega y el inventario (Ley de Little) [27] |
| Trabajo en proceso (WIP) | número o valor de los pedidos en el taller | indicador anticipado de aumento de los plazos de entrega |
| Utilización del cuello de botella | tiempo ocupado ÷ tiempo disponible en el cuello de botella | determina el rendimiento; por encima del 90 % los tiempos de espera aumentan bruscamente [38] |
| Cumplimiento del programa | proporción de operaciones completadas dentro de la ventana de tiempo planificada | muestra si el plan es realista |
| Fugas (escapes) | número de piezas defectuosas que llegan al cliente | mayor impacto en costes, a menudo una métrica del cliente; elemento obligatorio del sistema de calidad para los titulares de aprobación de producción de la FAA [41] |
| Rendimiento al primer intento (FPY) | proporción de piezas sin retrabajo ni desecho | el retrabajo consume capacidad del cuello de botella |
| Plazo de la inspección del primer artículo (FAI) | tiempo desde la finalización del primer artículo hasta su aprobación | factor frecuentemente subestimado en arranques y cambios |
| Desviación de la curva de aprendizaje | horas reales por unidad frente a la curva objetivo | muestra si los supuestos de arranque se cumplen |
| Tiempo de respuesta (TAT) | tiempo desde la entrada hasta la devolución en MRO, como promedio y percentil | criterio principal para los clientes de MRO |
| Tasa de hallazgos | proporción de pedidos con trabajos no rutinarios y su esfuerzo | base de la planificación de capacidad de MRO |

**Una nota sobre la medición:** Defina cada KPI de forma inequívoca y aplique la definición de manera coherente. Las definiciones de OTD en particular difieren entre clientes (referencia a la primera fecha solicitada o confirmada, entregas anticipadas permitidas, entregas parciales o completas). Una métrica que cada uno calcula de forma distinta no controla nada. La guía hermana [Manufacturing KPIs](https://www.m365.fm/en/learn/manufacturing-kpis/) trata las definiciones de KPI con más detalle.

## 16. Enfoque: seis pasos para un plan fiable

**Paso 1: Medir el estado actual.** Registre los plazos de entrega, el WIP, el OTD y la utilización por recurso durante al menos tres meses. Un mapa de la cadena de valor de las familias de piezas más importantes muestra dónde se pierde tiempo.

**Paso 2: Identificar los cuellos de botella.** ¿Dónde se acumulan los pedidos? ¿Qué recurso determina el rendimiento? Incluya los procesos especiales externos, la inspección y las cualificaciones del personal.

**Paso 3: Depurar los datos maestros.** Rutas, tiempos estándar, tiempos de preparación, calendarios de capacidad, cualificaciones, plazos de reposición. Sin esta base, cualquier herramienta de planificación produce resultados erróneos.

**Paso 4: Introducir reglas de control.** Limitar el WIP, vincular la liberación al cuello de botella, proteger el cuello de botella con un colchón y establecer reglas de prioridad.

**Paso 5: Introducir la programación basada en restricciones.** Añadir al ERP una programación detallada que considere la capacidad finita, las cualificaciones y los turnos externos. Comenzar con un área piloto, idealmente en el cuello de botella.

**Paso 6: Establecer escenarios y un bucle de retroalimentación.** Utilizar la simulación para decisiones de cadencia e inversión, y conciliar semanalmente el plan con lo real. Seguir mejorando los parámetros de planificación a partir de las confirmaciones.

> **Verificación rápida para los responsables de planta y de planificación: cinco preguntas que puede responder esta semana**
>
> 1. ¿Cuál es hoy su cuello de botella y cuál fue su utilización en las últimas cuatro semanas?
> 2. ¿Cuántos pedidos hay en el taller en este momento y cuántos de ellos esperan procesos especiales externos o inspección?
> 3. ¿Cuánto tiempo lleva encontrar todos los números de serie de una colada concreta de materia prima?
> 4. ¿Qué tiempos estándar utiliza para las piezas que acaban de arrancar: tiempos de cadencia madura o una curva de aprendizaje?
> 5. ¿Qué ocurre con su entrega a tiempo si su procesador externo más importante está parado durante dos semanas?
>
> Si no puede responder con datos a una de estas preguntas en un día, comience por el Paso 1.

**Calendario:** Los pasos 1 a 4 no requieren software nuevo y, según la experiencia del autor, pueden implantarse en muchas empresas en pocos meses [unverified: afirmación basada en la experiencia del autor, sin datos verificables]. Los pasos 5 y 6 requieren la implantación de software; su duración depende principalmente de la calidad de los datos maestros. No se dispone de cifras fiables del sector sobre la duración.

## 17. Errores comunes y cómo evitarlos

1. **Planificar con capacidad infinita.** La lógica MRP del ERP ignora los cuellos de botella. Resultado: planes inviables desde el inicio. *Solución:* programación detallada con capacidad finita.
2. **Liberar más órdenes para entregar antes.** Según la Ley de Little, un mayor WIP alarga el lead time. *Solución:* vincular la liberación al cuello de botella.
3. **Modelar los procesos externos especiales como un lead time fijo.** Los procesos externos tienen capacidades, cadencias y variabilidad. *Solución:* acordar slots y planificarlos como un recurso.
4. **Olvidar la inspección y la FAI.** El laboratorio de inspección y los inspectores no se planifican y se convierten en un cuello de botella oculto. *Solución:* los pasos de inspección como operaciones con capacidad.
5. **Usar tiempos estándar de tasa madura durante el arranque.** Se ignoran las curvas de aprendizaje y el arranque queda subplanificado. *Solución:* curva de aprendizaje a partir de sus propios datos.
6. **Evaluar el promedio en lugar del cuello de botella.** Una utilización promedio del 75 % no dice nada sobre el recurso que limita. *Solución:* evaluar recurso por recurso, centrarse en el cuello de botella.
7. **Reconstruir la trazabilidad a posteriori.** Las confirmaciones faltantes se reconstruyen al final. *Solución:* capturarla en el proceso y asignar el material antes del inicio.
8. **Ignorar las cualificaciones.** El plan asigna tareas a personas sin cualificaciones válidas. *Solución:* matriz de cualificaciones como restricción.
9. **Tratar los objetivos de tasa como compromisos.** Se construye capacidad según un objetivo oficial que luego se retrasa. *Solución:* escenarios con disparadores.
10. **Comprometerse con el promedio en MRO.** Los compromisos de TAT basados en el promedio se incumplen con regularidad cuando aparecen hallazgos. *Solución:* percentiles y una estrategia de piezas.
11. **Dejar que los pedidos urgentes se conviertan en la norma.** La agilización constante destruye la estabilidad del programa. *Solución:* reglas de prioridad claras y derechos de intervención.
12. **Software antes que datos.** Se introduce un APS antes de que los datos maestros estén bien. *Solución:* la calidad de los datos como primer paquete de trabajo.
13. **Tratar los datos controlados como una cuestión secundaria de TI.** Los pedidos ITAR o CUI terminan en un sistema de planificación o en un tenant en la nube que no está preparado para ellos. *Solución:* aclarar el alcance de control de exportaciones y CMMC antes de seleccionar o implantar software de planificación [36][49].

## 18. iFAKT y aeroespacial

> **Nota: El autor trabaja en iFAKT GmbH.**

[iFAKT GmbH](https://www.m365.fm/entity/ifakt/), con sede en Stuttgart, Alemania, desarrolla el software [Polaris](https://www.m365.fm/entity/polaris/). Según el sitio web de la empresa, Polaris conecta los datos del ERP con un gemelo digital de la producción para optimizar los planes. La plataforma incluye módulos para el modelado de flujos de valor y procesos de negocio, simulación, optimización de la planificación (Optimizer), ejecución en planta (Operator) y analítica (Analyzer) [31]. El sitio web enumera la industria aeroespacial como un sector propio y describe el apoyo a proveedores y fabricantes con procesos de fabricación complejos [31].

Como referencia aeroespacial, iFAKT publica un caso de estudio con Airbus Netherlands. Desde 2018, la planta fabrica marcos de empuje para los módulos de propulsión del lanzador Ariane 6 (Vulcain Aft Bay y Vinci Thrust Frame). Según el caso de estudio, los módulos de Polaris Optimizer, Operator y Analyzer han respaldado esta producción durante siete años. Los requisitos indicados fueron documentación digital, aseguramiento de la calidad en proceso, lead times más cortos, programación automatizada de órdenes y asignación optimizada de recursos. El caso describe resultados cualitativos, como tiempos de espera más cortos gracias a una respuesta más rápida a cambios no planificados, tiempos de traspaso más reducidos y estado de las órdenes disponible en todo momento; no ofrece cifras [32]. Se cita al responsable de AIT de Airbus Netherlands diciendo que las herramientas de Polaris ayudaron a aportar más estructura a la producción [32].

En su página de inicio, iFAKT también indica cifras de mejora con el calificativo «hasta» (por ejemplo, para lead time y capacidad). Como no se ha publicado ninguna metodología para ellas, estas cifras no se utilizan aquí [31].

**Contexto:** Los requisitos descritos en esta guía (programación basada en restricciones, cualificaciones, operaciones externas, simulación de escenarios de tasa, retroalimentación desde planta) son neutrales respecto a los proveedores. Polaris es una de varias soluciones del mercado. Evalúe cualquier sistema según los criterios de la Sección 11.3 y con un piloto que utilice sus propios datos. El artículo hermano [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/) describe el software con más detalle.

## 19. Glosario

**APQP (Advanced Product Quality Planning):** Planificación estructurada de la calidad para nuevos productos y procesos; en aeroespacial está regulada por AS9145 / EN 9145.

**APS (Advanced Planning and Scheduling):** Software de planificación que programa según capacidad finita y disponibilidad de material.

**As-built / as-designed:** La configuración realmente fabricada frente a la configuración especificada por ingeniería.

**Cuello de botella (restricción):** El recurso que limita el rendimiento de todo el sistema.

**CAMO (Continuing Airworthiness Management Organisation):** Organización aprobada por EASA que gestiona la aeronavegabilidad continuada de una aeronave (EASA Part-CAMO).

**CMMC (Cybersecurity Maturity Model Certification):** Programa del Departamento de Defensa de EE. UU. para verificar la ciberseguridad de los contratistas que manejan FCI o CUI; cláusula contractual DFARS 252.204-7021.

**CUI (Controlled Unclassified Information):** Información gubernamental que requiere protección pero no está clasificada; su presencia en los sistemas de planificación los incluye en el alcance de CMMC.

**Hilo digital (digital thread):** Vínculo continuo de todos los datos del producto a lo largo de su ciclo de vida.

**Drum-buffer-rope (DBR):** Principio de control de la Teoría de las Restricciones en el que el cuello de botella marca el ritmo y limita la liberación de trabajo.

**EASA Form 1:** Certificado de liberación autorizada para piezas aeronáuticas emitido por organizaciones de producción o mantenimiento aprobadas por EASA.

**Efectividad (effectivity):** Indicación del número de serie, aeronave o fecha a partir de los cuales se aplica una configuración o un cambio.

**Escape:** Pieza defectuosa que ha llegado al cliente.

**FAA Form 8130-3:** Certificado de liberación autorizada de la FAA (etiqueta de aprobación de aeronavegabilidad) para la aprobación de aeronavegabilidad nacional, la puesta en servicio y la exportación; lo emiten únicamente personas y organizaciones autorizadas por la FAA.

**FAI (First Article Inspection):** Inspección completa de la primera pieza de producción frente a todas las características de diseño según AS9102 / EN 9102.

**Genealogía:** Relaciones padre-hijo entre materiales, lotes, piezas y conjuntos.

**HMLV (high mix, low volume):** Producción de muchas variantes en cantidades pequeñas.

**Característica clave:** Rasgo cuya variación afecta significativamente al ajuste, la función, el rendimiento o la vida útil; regulado por AS9103 / EN 9103.

**Curva de aprendizaje:** Relación entre la cantidad acumulada y el esfuerzo por unidad; según Wright (1936).

**LLP (life-limited part):** Pieza con un número máximo aprobado de ciclos u horas.

**MRO (maintenance, repair and overhaul):** Servicios de mantenimiento, reparación y revisión general de aeronaves y componentes.

**Nadcap:** Programa de acreditación gestionado por la industria para procesos especiales, administrado por el Performance Review Institute (PRI).

**OTD (on-time delivery):** Proporción de entregas realizadas en la fecha comprometida.

**Part 145:** En EE. UU., el certificado de estación de reparación de la FAA (14 CFR Part 145); en la UE, la aprobación de organización de mantenimiento de EASA.

**Part 21 Subpart G:** En EE. UU., el certificado de producción de la FAA (14 CFR 21.131 a 21.150); en la UE, la Aprobación de Organización de Producción (POA) de EASA.

**PMA (Parts Manufacturer Approval):** Aprobación de producción de la FAA para piezas de recambio y de modificación (14 CFR Part 21, Subpart K).

**PPAP (Production Part Approval Process):** Procedimiento de aprobación de piezas de producción; en aeroespacial forma parte de AS9145 / EN 9145.

**Ritmo (rate):** Cantidad de producción por mes; por ejemplo, ritmo 75 = 75 aeronaves al mes.

**Estación de reparación:** Organización de mantenimiento certificada por la FAA según 14 CFR Part 145.

**Proceso especial:** Proceso cuyo resultado no puede verificarse por completo en la pieza terminada sin destruirla, como el tratamiento térmico o el tratamiento superficial.

**TAT (turnaround time):** Tiempo desde la entrada de una orden de mantenimiento hasta la devolución al cliente.

**Nivel 1 / Nivel 2:** Niveles de proveedores; el Nivel 1 suministra directamente al fabricante de aeronaves y el Nivel 2 suministra al Nivel 1.

**WIP (work in process):** Inventario en proceso en planta.

## 20. Preguntas frecuentes: cuestiones habituales sobre la planificación de la producción aeronáutica

**¿Qué es la planificación de la producción aeronáutica?**
Es la planificación de cantidades, fechas, capacidad y material para la fabricación de aeronaves, motores y componentes, bajo los requisitos de evidencia del sector. Combina la producción de alta variedad y bajo volumen, los plazos de entrega largos y los procesos especiales externos con una trazabilidad estricta y el control de configuración. Los tasas de producción acordadas con los fabricantes de aeronaves marcan el ritmo en todos los niveles de la cadena de suministro.

**¿Por qué no basta la programación de ERP en el sector aeronáutico?**
La lógica clásica de MRP calcula con plazos de entrega fijos y sin límites de capacidad. Un plan de producción viable tiene que tener en cuenta la capacidad finita, las cualificaciones de personas y máquinas, y los turnos en los proveedores de procesos externos. Para ello se usan sistemas APS o una capa de programación detallada ampliada.

**¿Qué tasa de producción planea Airbus para la familia A320?**
Según su informe de los primeros nueve meses de 2026, Airbus aspira a 70 a 75 aviones al mes a finales de 2027 y a estabilizarse después en la tasa 75 [3]. El objetivo se ha retrasado varias veces, en parte por la falta de motores [4].

**¿Cuál es la tasa de producción del 737 de Boeing?**
En mayo de 2026, el consejero delegado de Boeing afirmó que la línea del 737 operaba a la tasa 47 [8]. El comunicado del tercer trimestre de 2026 de Boeing describe el programa como en progreso hacia una producción estabilizada de 47 al mes [47]. La FAA había limitado la tasa a 38 tras enero de 2024 y aprobó 42 en octubre de 2025 [7].

**¿Qué normas debe conocer un proveedor aeronáutico?**
El núcleo es AS9100D (EN 9100:2018). Según el trabajo, añada AS9102 (inspección del primer artículo), AS9103 (características clave), AS9145 (APQP/PPAP), AS9120 (distribuidores) y, a menudo, la acreditación Nadcap para procesos especiales. Los titulares de aprobación de producción trabajan bajo la FAA 14 CFR Parte 21 (o EASA Parte 21 Subparte G); los proveedores de defensa también están sujetos a ITAR/EAR, DFARS y CMMC.

**¿Cuál es la diferencia entre AS9100 y EN 9100?**
Ninguna en cuanto al contenido. La norma del IAQG se publica como AS9100 por SAE International en América, como EN 9100 en Europa y como JISQ 9100 en Asia [13][14].

**¿Sigue vigente AS9100D?**
Sí. El IAQG trabaja en una revisión que se publicará como IA9100. A octubre de 2026, la fecha de publicación y el periodo de transición no se habían confirmado, y los certificados AS9100D siguen siendo válidos [15].

**¿Qué exige AS9100 en materia de trazabilidad?**
Exige la trazabilidad de las materias primas, los materiales y los procesos utilizados, así como de las herramientas y las personas [14]. Los clientes añaden requisitos específicos en sus requisitos de calidad para proveedores, y los titulares de aprobación de producción de la FAA trasladan a sus proveedores sus propios requisitos del sistema de calidad [41].

**¿Cuándo se requiere una inspección del primer artículo (AS9102)?**
Para piezas nuevas y para cambios que puedan afectar a la forma, el ajuste o la función, por ejemplo en el diseño, el material, la fuente de fabricación, el proceso, las herramientas o la ubicación, y tras una interrupción de la producción de más de dos años. Según el alcance, se exige una FAI completa o parcial [34].

**¿Qué es la curva de aprendizaje en la fabricación de aeronaves y por qué importa para la planificación?**
La curva de aprendizaje describe cómo disminuye el esfuerzo por unidad a medida que aumenta la cantidad acumulada. Wright mostró en 1936 una reducción de aproximadamente el 20 % por cada duplicación [25]. Si planifica un lanzamiento con tiempos de tasa madura, subestimará de forma significativa la capacidad necesaria (ejemplo práctico en la sección 9).

**¿Cómo planifico correctamente una rampa de tasa?**
Evalúe cada recurso por separado, sobre todo el cuello de botella, en lugar de la utilización media. Calcule varios escenarios de tasa, tenga en cuenta las curvas de aprendizaje, la capacidad de inspección, los tiempos de cualificación y las aprobaciones, y asegure por contrato la capacidad externa. La lista de verificación de la sección 10.3 le ayudará.

**¿Qué es Nadcap?**
Nadcap es un programa de acreditación gestionado por la industria para procesos especiales como el tratamiento térmico, el procesado químico, la soldadura y los ensayos no destructivos. Se fundó en 1990 y lo administra el Performance Review Institute [21][54]. Muchos clientes exigen la acreditación Nadcap para los procesos especiales.

**¿Puede APS gestionar procesos externos como el tratamiento térmico?**
Sí, siempre que se modelen como recursos con capacidad y turnos, y no como un plazo de entrega plano. Acuerde turnos semanales con el proveedor, guárdelos como restricción y haga que el certificado devuelto sea una condición para la siguiente operación (sección 7.2).

**¿Se aplica CMMC a los proveedores aeroespaciales?**
Se aplica a los contratistas y subcontratistas de defensa cuyos contratos implican información federal de contratación (FCI) o información no clasificada controlada (CUI). La cláusula DFARS entró en vigor el 10 de noviembre de 2025 y se implantará de forma gradual a lo largo de tres años; se traslada a los subcontratos que implican FCI o CUI [49].

**¿En qué se diferencia la planificación de MRO de la planificación de producción?**
En mantenimiento, el alcance del trabajo solo se conoce después de la inspección. La planificación debe trabajar con probabilidades de hallazgos, disponibilidad de piezas y colchones. El KPI central es el tiempo de respuesta (turnaround time).

**¿Cómo puede una estación de reparación reducir el tiempo de respuesta?**
Inspeccionando de forma temprana, almacenando piezas críticas o proporcionándolas mediante pools de intercambio, reservando capacidad para trabajos no rutinarios y acelerando las aprobaciones del cliente. Los compromisos de TAT deben basarse en percentiles y no en promedios.

**¿Qué KPI son los más importantes para los proveedores aeroespaciales?**
Entrega a tiempo (OTD), plazo de entrega (lead time), trabajo en proceso (work in process), utilización del cuello de botella, fugas (escapes) y rendimiento al primer paso (first pass yield). En mantenimiento se añaden el tiempo de respuesta y la tasa de hallazgos.

**¿Qué aporta un gemelo digital a la fabricación aeroespacial?**
Permite simular escenarios de ritmos e inversiones, reprogramar más rápido durante las interrupciones y, junto con el hilo digital (digital thread), responder con rapidez a las preguntas sobre trazabilidad. El requisito previo son unos datos maestros limpios y datos de confirmación.

**¿Dónde están los mayores riesgos de la cadena de suministro en 2026?**
Según Roland Berger, en la mano de obra cualificada, en materias primas como el titanio, las fundiciones y las forjas, los elementos de fijación, y los servicios de ensayo y tratamiento de superficies [10]. En los motores, la escasez de suministro está limitando los ritmos de los fabricantes de aeronaves [4].

## 21. Conclusión

En 2026 la industria aeroespacial tiene carteras de pedidos llenas, pero una cadena de suministro que solo puede atenderlas con lentitud. Para los proveedores y los talleres de mantenimiento, la planificación de la producción se ha convertido en un factor competitivo. Quienes conocen sus cuellos de botella, planifican las curvas de aprendizaje y los procesos especiales de forma realista, incorporan la trazabilidad en el flujo de pedidos y calculan de antemano los escenarios de ritmo pueden acompañar las rampas de producción sin sacrificar la entrega a tiempo ni la calidad.

El camino hacia ello rara vez empieza por el software. Empieza por la medición, unos datos maestros limpios y reglas de control sencillas, como un WIP limitado y la liberación basada en el cuello de botella. APS, la simulación y los gemelos digitales refuerzan estos cimientos; no los sustituyen. Los mecanismos son bien conocidos y se han documentado durante décadas, desde la curva de aprendizaje de Wright hasta la ley de Little y la teoría de las restricciones. Aplicarlos de forma consistente es la verdadera tarea.

## Más lectura en m365.fm

**Artículo y podcast**

- [Planificación de la producción aeroespacial: plazo de entrega y trazabilidad](https://www.m365.fm/community/u/mirko-p/blog/aerospace-production-planning-lead-time-traceability/)
- Episodio del podcast [Trazabilidad y genealogía](https://www.m365.fm/show/episodes/traceability-and-genealogy/)

**Páginas de entidades**

[Lead Time](https://www.m365.fm/entity/lead-time/) · [Advanced Planning and Scheduling](https://www.m365.fm/entity/advanced-planning-and-scheduling/) · [Constraint-based Scheduling](https://www.m365.fm/entity/constraint-based-scheduling/) · [Theory of Constraints](https://www.m365.fm/entity/theory-of-constraints/) · [Enterprise Resource Planning](https://www.m365.fm/entity/enterprise-resource-planning/) · [Digital Twin](https://www.m365.fm/entity/digital-twin/) · [Factory Simulation](https://www.m365.fm/entity/factory-simulation/) · [Philip Schubert](https://www.m365.fm/entity/philip-schubert/) · [iFAKT](https://www.m365.fm/entity/ifakt/) · [Polaris](https://www.m365.fm/entity/polaris/) · [Mirko Peters](https://www.m365.fm/entity/mirko-peters/)

**Guías relacionadas**

- [Programación de la producción y APS](https://www.m365.fm/en/learn/production-scheduling-aps/)
- [Gemelo digital en la fabricación](https://www.m365.fm/en/learn/digital-twin-manufacturing/)
- [TI de fabricación con Azure](https://www.m365.fm/en/learn/manufacturing-it-azure/)
- [Mapeo de la cadena de valor](https://www.m365.fm/en/learn/value-stream-mapping/)
- [KPI de fabricación](https://www.m365.fm/en/learn/manufacturing-kpis/)
- [Gestión en piso de planta](https://www.m365.fm/en/learn/shop-floor-management/)
- [iFAKT Polaris](https://www.m365.fm/en/learn/ifakt-polaris/)

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** es el presentador de m365.fm y trabaja en iFAKT GmbH. En m365.fm escribe sobre planificación de producción, trazabilidad, simulación y la digitalización de la fabricación. Se centra en cómo la planificación basada en restricciones, los gemelos digitales y la retroalimentación del taller trabajan juntos para que los planes se cumplan en la planta, incluso en sectores exigentes como el aeroespacial.

**Nota: El autor trabaja en iFAKT GmbH.**

# Sources

All online sources accessed on November 20, 2026. Sources 41 to 55 were added for the US version and verified online on that date.

1. BDLI (German Aerospace Industries Association): BDLI Industry Data 2026: Aerospace Industry Sets New Records for Revenue and Employment. Press release, Berlin, May 27, 2026. https://www.bdli.de/en/meldungen/bdli-branchendaten-2026-luft-und-raumfahrtindustrie-erreicht-neue-rekorde-bei-umsatz-und
2. Nasdaq/RTTNews: Airbus Delivers 793 Aircraft In 2025 As Order Backlog Reaches Record Level. January 2026. https://www.nasdaq.com/articles/airbus-delivers-793-aircraft-2025-order-backlog-reaches-record-level
3. Airbus: Airbus reports Nine-Month (9m) 2026 results. Press release, October 28, 2026. https://www.airbus.com/en/newsroom/press-releases/2026-10-airbus-reports-nine-month-9m-2026-results
4. Aerospace Global News: Airbus accuses Pratt & Whitney of failing to deliver as A320 ramp up stalls. April 15, 2026. https://aerospaceglobalnews.com/news/airbus-pratt-whitney-a320-ramp-up/
5. Terminair: Airbus delivers 74 aircraft in October, needs 249 more by year-end for its 870 target. November 5, 2026. https://terminair.com/story/113485-airbus-delivers-74-aircraft-in-october-needs-249
6. Boeing: Boeing Reports Fourth-Quarter Results. Press release, January 27, 2026. https://boeing.mediaroom.com/2026-01-27-Boeing-Reports-Fourth-Quarter-Results
7. Assembly Magazine: Boeing Cleared to Boost Production of 737 MAX. October 22, 2025. https://www.assemblymag.com/articles/99622-boeing-cleared-to-boost-production-of-737-max
8. CAPA Centre for Aviation: Boeing testing production rate of 47 aircraft per month, cautious of increasing to 52: CEO. May 28, 2026. https://centreforaviation.com/news/boeing-testing-production-rate-of-47-aircraft-per-month-cautious-of-increasing-to-52-ceo-1360867
9. ADS Group (summary of the IATA release): Supply chain challenges could cost airlines over $11bn in 2025. October 14, 2025; study "Reviving the Commercial Aircraft Supply Chain" by IATA and Oliver Wyman. https://www.adsgroup.org.uk/knowledge/industry-member-news/supply-chain-challenges-could-cost-airlines-over-11bn-in-2025/
10. Roland Berger: Global Aerospace Supply Chain Study 2026. June 2026 (survey of 95 companies, January/February 2026). https://mailing.rolandberger.com/hubfs/07_presse/Aerospace%20Supply%20Chain%20Study%202026%20Roland%20Berger.pdf
11. CNBC: RTX to take $3 billion charge on Pratt & Whitney engine problem. September 11, 2023. https://www.cnbc.com/2023/09/11/rtx-to-take-3-billion-charge-on-pratt-whitney-engine-problem.html
12. Malay Mail (Reuters): Boeing suspends Russian titanium as Airbus keeps buying. March 8, 2022. https://www.malaymail.com/news/money---international/2022/03/08/boeing-suspends-russian-titanium-as-airbus-keeps-buying/2046061
13. IAQG: Standards (overview of the 9100 family). https://ma.iaqg.org/standards
14. TÜV Rheinland: FAQ EN/AS 9100ff. series of standards (German). https://certification.tuv.com/content-media-files/master-content/services/systems/0403-tuv-rheinland-en-as-9100ff-series-of-standards/tuv-rheinland-en-as-9100-faq-de.pdf
15. The QMS Collective: The Current AS9100 Revision, and How to Read Dates That Keep Slipping. October 16, 2026. https://theqmscollective.com/blog/current-as9100-revision-confirmed-vs-expected-ia9100
16. Estonian Centre for Standardisation (EVS): EVS-EN 9145:2018 Aerospace series – Requirements for Advanced Product Quality Planning and Production Part Approval Process. https://www.evs.ee/en/evs-en-9145-2018
17. DIN Media: DIN EN 9102:2025-01, Aerospace series – Quality management systems – First article inspection requirement (EN 9102:2024). https://www.dinmedia.de/en/standard/din-en-9102/377807227
18. Net-Inspect: AS9102 First Article Inspection Report Rev B vs Rev C. https://www.net-inspect.com/blog/as9102-rev-b-vs-rev-c/
19. IAQG: 9103 Variation Management of Key Characteristics. https://iaqg.org/standard/9103-variation-management-of-key-characteristics/ ; EVS-EN 9103:2023: https://www.evs.ee/en/evs-en-9103-2023
20. EVS: EVS-EN 9110:2018 Quality Management Systems – Requirements for Aviation Maintenance Organizations. https://www.evs.ee/en/evs-en-9110-2018
21. Wikipedia: Nadcap. https://en.wikipedia.org/wiki/Nadcap
22. EASA: Easy Access Rules for Initial Airworthiness and Environmental Protection (Part 21), 21.A.131 Scope (Subpart G). https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-initial-airworthiness-and?page=13
23. EASA: Easy Access Rules for Continuing Airworthiness (Regulation (EU) No 1321/2014 with Part-M, Part-145, Part-CAMO; amending Regulation (EU) 2019/1383). https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-continuing-airworthiness?page=66
24. Wright, T. P.: Factors Affecting the Cost of Airplanes. Journal of the Aeronautical Sciences, vol. 3, no. 4 (1936), pp. 122–128. Reference: https://en.wikipedia.org/wiki/Theodore_Paul_Wright
25. Wikipedia: Experience curve effect. https://en.wikipedia.org/wiki/Experience_curve_effect
26. U.S. Government Accountability Office (GAO): Cost Estimating and Assessment Guide, Cumulative Average Formulation. https://gaoinnovations.gov/cost-guide/cumulative-average-formulation.html
27. Little, John D. C.: A Proof for the Queuing Formula L = λW. Operations Research, vol. 9, no. 3 (1961), pp. 383–387.
28. Goldratt, Eliyahu M.; Cox, Jeff: The Goal. A Process of Ongoing Improvement. North River Press, 1984.
29. Oliver Wyman: Why engine availability is a growing challenge for aviation. September 24, 2026. https://www.oliverwyman.com/our-expertise/insights/2026/sep/aviation-engine-availaibility-bottlenecks.html
30. Oliver Wyman / ARSA: Global Fleet & MRO Market Forecast 2026–2036, Executive Summary. 2026. https://arsa.org/wp-content/uploads/2026/03/ARSA-OW-2026FleetMROMarketReport-ExecSum-2026.pdf
31. iFAKT GmbH: website (home page, solutions, contact, imprint). https://www.ifakt.de/
32. iFAKT GmbH: Customer Reference Airbus Netherlands. https://www.ifakt.de/references/Airbus_Netherlands_Reference.pdf
33. 4flow: Advanced planning in multi-level production networks in aviation and aerospace. https://4flow.com/blog/advanced-planning-in-multi-level-production-networks-in-aviation-and-aerospace
34. InspectionXpert: When to Conduct a First Article Inspection. https://www.inspectionxpert.com/blog/when-to-conduct-a-first-article-inspection
35. IAQG: 9145 Guidance Presentation (APQP phases, PPAP elements). https://ma.iaqg.org/wp-content/uploads/2019/10/9145-Guidance-Presentation.pdf
36. Electronic Code of Federal Regulations: International Traffic in Arms Regulations, 22 CFR Parts 120–130 (https://www.ecfr.gov/current/title-22/chapter-I/subchapter-M); Export Administration Regulations, 15 CFR Parts 730–774 (https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C).
37. Produktion (German trade journal): Nachweispflicht als Nadelöhr: Warum die Rückverfolgbarkeit über Millionenaufträge in der Verteidigungsindustrie entscheidet ("Evidence requirements as a bottleneck: why traceability decides multi-million defense contracts"). October 27, 2026. https://www.produktion.de/ruestung-aerospace/nachweispflicht-als-nadeloehr-warum-die-rueckverfolgbarkeit-ueber-millionenauftraege-in-der-verteidigungsindustrie-entscheidet/2758489
38. Kingman, J. F. C.: The single server queue in heavy traffic. Mathematical Proceedings of the Cambridge Philosophical Society, vol. 57, no. 4 (1961), pp. 902–904.
39. Defence Agenda: Airbus Keeps Production Ramp-Up Targets Unchanged. August 1, 2026. https://defenceagenda.com/airbus-production-ramp-up-targets-h1-2026
40. Martin, James R.: Learning Curve Summary (cumulative average model after Wright, incremental unit model after Crawford). Management And Accounting Web. https://maaw.info/LearningCurveSummary.htm
41. 14 CFR 21.137 Quality system (production certificates), 14 CFR 21.307 Quality system (PMA), and table of subparts of 14 CFR Part 21. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/14/21.137 ; https://www.law.cornell.edu/cfr/text/14/21.307 ; https://www.law.cornell.edu/cfr/text/14/part-21 (official text: https://www.ecfr.gov/current/title-14/chapter-I/subchapter-C/part-21/subpart-G)
42. Electronic Code of Federal Regulations: 14 CFR Part 145 Repair Stations (145.1, 145.59, 145.109, 145.163, 145.201, 145.219). https://www.ecfr.gov/current/title-14/chapter-I/subchapter-H/part-145
43. FAA: Order 8130.21H, Procedures for Completion and Use of the Authorized Release Certificate, FAA Form 8130-3, Airworthiness Approval Tag. Effective February 1, 2014. https://www.faa.gov/documentLibrary/media/Order/FAA_Order_8130.21H.pdf
44. SAE International: AS9100D Quality Management Systems – Requirements for Aviation, Space, and Defense Organizations (revised September 20, 2016). https://saemobilus.sae.org/standards/as9100d-quality-management-systems-requirements-aviation-space-defense-organizations
45. SAE International: AS9145 Aerospace Series – Requirements for Advanced Product Quality Planning and Production Part Approval Process (issued November 8, 2016). https://saemobilus.sae.org/standards/as9145-aerospace-series-requirements-advanced-product-quality-planning-production-part-approval-process
46. ANSI Webstore: SAE AS9102C-2023, Aerospace Series – First Article Inspection Requirements. https://webstore.ansi.org/standards/sae/sae9102c2023
47. Boeing: Boeing Reports Third-Quarter Results. Press release, Arlington, Va., October 27, 2026. https://boeing.mediaroom.com/2026-10-27-Boeing-Reports-Third-Quarter-Results
48. Aerospace Industries Association (AIA): 2026 AIA Facts & Figures: U.S. Aerospace & Defense Industry Leads the World with $1 Trillion in Sales. June 25, 2026 (with S&P Global Market Intelligence, 2025 data). https://www.aia-aerospace.org/?p=27492 ; overview: https://aia-aerospace.org/industry-impact
49. Federal Register, vol. 90, no. 173 (September 10, 2025): Defense Federal Acquisition Regulation Supplement: Assessing Contractor Implementation of Cybersecurity Requirements (DFARS Case 2019-D041), effective November 10, 2025. https://www.govinfo.gov/content/pkg/FR-2025-09-10/html/2025-17359.htm
50. U.S. Department of Defense, Office of Small Business Programs: Cybersecurity Maturity Model Certification (CMMC) 2.0. https://business.defense.gov/Programs/Cyber-Security-Resources/CMMC-20
51. 48 CFR 252.225-7009 Restriction on Acquisition of Certain Articles Containing Specialty Metals. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/48/252.225-7009
52. FAA: Advisory Circular AC 21-29D, Detecting and Reporting Suspected Unapproved Parts. July 12, 2016. https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_21-29D.pdf
53. 14 CFR 91.417 Maintenance records. Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/14/91.417
54. Boeing Suppliers: Nadcap Accreditation FAQ (Nadcap as an "industry-managed approach to conformity assessment of 'special processes'", administered by PRI). https://www.boeingsuppliers.com/nadcap/nadcap_faq.htm
55. Aerospace Manufacturing (aero-mag.com): Lack of capacity planning adding to ramp-up challenge, report reveals (Vendigital rate readiness assessment, 100+ suppliers). Undated. https://www.aero-mag.com/lack-of-capacity-planning-adding-to-ramp-up-challenge-report-reveals
