# SEO metadata

| Field | Value |
|---|---|
| Meta title | Ciberseguridad OT e IEC 62443: Guía para fabricantes |
| Meta description | Ciberseguridad OT para fabricantes: ISA/IEC 62443 explicado con zonas, conductos, niveles de seguridad, un ejemplo de planta, hoja de ruta, KPIs y preguntas frecuentes. |
| Slug | `ot-cybersecurity-iec-62443` |

# Ciberseguridad OT e ISA/IEC 62443: Guía práctica para fabricantes

> **Respuesta breve:** La ciberseguridad OT (seguridad de tecnología operacional) protege los sistemas que ejecutan la producción física, como PLC, SCADA, HMI, robots, variadores y sistemas de seguridad, para que una planta se mantenga segura, disponible y produciendo piezas correctas. La referencia internacional es la serie ISA/IEC 62443: asigna responsabilidades a los propietarios de activos, integradores y proveedores de productos, agrupa los activos en zonas conectadas por conductos, establece un nivel de seguridad objetivo (SL 1 a 4) por zona y verifica cada zona frente a siete requisitos fundamentales [1][2]. En EE. UU. suele combinarse con el NIST Cybersecurity Framework 2.0 y la NIST SP 800-82 [9][11].

> **Puntos clave**
> - En OT, la disponibilidad y la seguridad son lo primero. Una regla de cortafuegos o un parche que detenga una línea puede causar más daño que el ataque que pretendía prevenir.
> - ISA/IEC 62443 es una serie de normas, no un único documento. Las partes 2-1 (programa de seguridad), 3-2 (evaluación de riesgos y zonas), 3-3 (requisitos del sistema), 4-1 y 4-2 (requisitos de proveedores) hacen la mayor parte del trabajo en una planta [1].
> - El método central es sencillo de enunciar: inventariar los activos, agruparlos en zonas, definir los conductos entre zonas, establecer un nivel de seguridad objetivo por zona y cerrar la brecha entre el nivel objetivo y el nivel alcanzado [2].
> - En la mayoría de los casos documentados, las paradas de producción comenzaron en la TI de oficina, no en los controladores. Colonial Pipeline, Norsk Hydro y Clorox detuvieron o ralentizaron sus operaciones tras ataques a sus entornos de TI [17][20][35].
> - Un primer año práctico para una planta de tamaño medio: inventario de activos, modelo de zonas y conductos, una DMZ industrial segmentada, acceso remoto controlado, copias de seguridad fuera de línea y un plan de respuesta a incidentes OT ensayado. La detección y los requisitos a proveedores llegan en el segundo año.
> - NIST SP 800-82 Rev. 3 (2023) es la guía vigente de seguridad OT en EE. UU.; NIST publicó el primer borrador público de la Rev. 4 el 21 de septiembre de 2026, reestructurado en torno a CSF 2.0, con comentarios abiertos hasta el 30 de noviembre de 2026 [9][10].
> - Existe certificación para productos (ISASecure CSA, SSA, SDLA) y, desde junio de 2025, para sitios operativos (ISASecure ACSSA, basada en 62443-2-1, 2-4, 3-2 y 3-3) [7][8].
> - Presupueste el programa como mantenimiento: una partida anual estable con KPI claros, no un proyecto puntual.

## Índice

1. [¿Qué es la ciberseguridad OT?](#qué-es-la-ciberseguridad-ot)
2. [Seguridad TI frente a OT: por qué el manual de la oficina falla en la planta](#seguridad-de-ti-vs-ot-por-qué-el-manual-de-oficina-falla-en-la-planta)
3. [Qué detiene realmente las plantas: incidentes y patrones de amenaza](#lo-que-realmente-detiene-las-plantas-incidentes-y-patrones-de-amenaza)
4. [El panorama de marcos: 62443, NIST, CISA, CMMC, NIS2 y CRA](#el-panorama-de-marcos-62443-nist-cisa-cmmc-nis2-y-la-cra)
5. [ISA/IEC 62443 explicada: estructura, roles y estado](#isaiec-62443-explicada-estructura-roles-y-estado)
6. [Requisitos fundamentales, niveles de seguridad y niveles de madurez](#requisitos-fundamentales-niveles-de-seguridad-y-niveles-de-madurez)
7. [Zonas y conductos y el modelo de Purdue](#zonas-y-conductos-y-el-modelo-de-purdue)
8. [La evaluación de riesgos 62443-3-2, paso a paso](#la-evaluación-de-riesgos-de-iec-62443-3-2-paso-a-paso)
9. [Ejemplo práctico: zonas y conductos para una planta de tamaño medio](#ejemplo-práctico-zonas-y-conductos-para-una-planta-de-tamaño-medio)
10. [Inventario de activos OT](#inventario-de-activos-ot)
11. [Segmentación de red y la DMZ industrial](#segmentación-de-red-y-la-dmz-industrial)
12. [Acceso remoto seguro para proveedores e ingenieros](#acceso-remoto-seguro-para-proveedores-e-ingenieros)
13. [Gestión de parches y de vulnerabilidades en OT](#gestión-de-parches-y-vulnerabilidades-en-ot)
14. [Cuentas, endurecimiento y medios extraíbles](#cuentas-endurecimiento-y-medios-extraíbles)
15. [Monitorización y detección](#monitorización-y-detección)
16. [Copias de seguridad, recuperación y respuesta a incidentes en OT](#copias-de-seguridad-recuperación-y-respuesta-a-incidentes-en-ot)
17. [Requisitos para proveedores y compras](#requisitos-para-proveedores-y-compras)
18. [Personas, seguridad y planta](#personas-seguridad-y-piso-de-planta)
19. [Obligaciones en EE. UU. y la UE: CMMC, SEC, CIRCIA, NIS2 y CRA](#obligaciones-en-ee-uu-y-la-ue-cmmc-sec-circia-nis2-y-la-cra)
20. [Una hoja de ruta de 12 a 24 meses](#una-hoja-de-ruta-de-12-a-24-meses)
21. [Presupuesto y ROI: cómo justificar la inversión](#presupuesto-y-roi-cómo-justificar-la-inversión)
22. [KPI de seguridad OT](#kpi-de-seguridad-ot)
23. [Errores comunes](#errores-comunes)
24. [Límites de IEC 62443 y de los programas de seguridad OT](#límites-de-iec-62443-y-de-los-programas-de-seguridad-ot)
25. [Glosario](#glosario)
26. [Preguntas frecuentes](#preguntas-frecuentes-ciberseguridad-ot-e-iec-62443)
27. [Conclusión](#conclusión)

**Quién debe leer qué parte**

| Lector | Empiece por |
|---|---|
| Director de planta o de operaciones | Secciones 1 a 3, 9, 16, 20 y 21 |
| Ingeniero de control o de automatización | Secciones 5 a 15 |
| Responsable de TI o de seguridad nuevo en OT | Secciones 2, 7, 11 a 15 |
| Compras y calidad de proveedores | Sección 17 |
| CFO o controller de planta | Secciones 3, 21 y 22 |
| Proveedor de defensa o empresa con sitios en la UE | Sección 19 |

## ¿Qué es la ciberseguridad OT?

La tecnología operativa (OT, por sus siglas en inglés) es el conjunto de hardware y software que supervisa y controla procesos físicos. NIST describe la OT como "una amplia gama de sistemas y dispositivos programables que interactúan con el entorno físico" y cita como ejemplos los sistemas de control industrial, la automatización de edificios, los sistemas de transporte, el control de acceso físico y la monitorización ambiental [9]. En una fábrica, esto incluye los controladores lógicos programables (PLC) de una línea de estampado, el sistema de control distribuido (DCS) de una cabina de pintura, el servidor de supervisión, control y adquisición de datos (SCADA) de los servicios públicos, las interfaces hombre-máquina (HMI) de las estaciones, los controladores de robots, los variadores, los sistemas de visión, las estaciones de ingeniería que programan todo lo anterior y los sistemas instrumentados de seguridad (SIS) que llevan el proceso a un estado seguro.

La ciberseguridad OT es el conjunto de políticas, controles técnicos y rutinas que evitan que esos sistemas sean interrumpidos, manipulados o utilizados como vía de acceso al resto de la empresa. El objetivo es distinto al de la seguridad TI clásica. En la oficina, la primera pregunta suele ser "¿están protegidos los datos?". En la planta, las primeras preguntas son "¿puede alguien resultar herido?" y "¿seguirá funcionando la línea y produciendo piezas correctas?".

### OT, ICS, IACS, SCADA: aclaración de los términos

En el campo se utilizan varios términos que se solapan. Importan porque las normas los emplean con precisión.

| Término | Significado | Dónde aparece |
|---|---|---|
| OT (tecnología operativa) | Término general para sistemas que interactúan con el mundo físico | NIST SP 800-82 Rev. 3 lo usa en su título [9] |
| ICS (sistema de control industrial) | Sistemas de control en la industria: PLC, DCS, SCADA y sus redes | Documentos anteriores de NIST y CISA, MITRE ATT&CK for ICS [15] |
| IACS (sistema industrial de automatización y control) | Término utilizado por ISA/IEC 62443: personas, hardware, software y políticas que intervienen en la operación de un proceso industrial | Todas las partes de 62443 [1][2] |
| SCADA | Supervisión y control de sitios distribuidos (oleoductos, servicios públicos, agua) | Servicios públicos, sistemas energéticos de toda la planta |
| DCS | Sistema de control distribuido, típico de plantas de proceso continuo | Química, alimentación, farmacia, cabinas de pintura |
| PLC | Controlador lógico programable, el elemento básico de la fabricación discreta | Máquinas, transportadores, líneas de montaje |
| SIS | Sistema instrumentado de seguridad; ejecuta funciones instrumentadas de seguridad | Seguridad de procesos, prensas, quemadores |
| IIoT | Internet Industrial de las Cosas: sensores y dispositivos que envían datos a plataformas de borde o en la nube | Mantenimiento predictivo, monitorización energética; IEC PAS 62443-1-6 [5] |

En la práctica, "seguridad OT", "ciberseguridad OT", "seguridad ICS" y "ciberseguridad industrial" se usan como sinónimos. Esta guía usa "seguridad OT" para referirse a la disciplina e "IACS" cuando se refiere a lo que exige 62443.

### Por qué la fabricación entra en el alcance

Muchos directores de planta siguen suponiendo que los ciberataques son un problema de TI y que sus máquinas están "aisladas" (air-gapped). En la mayoría de las plantas eso dejó de ser cierto hace años. MES, historiadores, interfaces con ERP, soporte remoto de los fabricantes de máquinas, paneles en la nube y sensores IIoT conectan el piso de planta con la empresa y con internet. CISA incluye la fabricación crítica (metales primarios, maquinaria, equipos eléctricos y equipos de transporte) como sector de infraestructura crítica de EE. UU., con el Departamento de Seguridad Nacional como agencia responsable de la gestión de riesgos del sector [32]; suele contarse como uno de los 16 sectores [unverified: la página de CISA citada no indica el número].

El coste de una planta parada es fácil de entender para quien ha dirigido una. Cada hora de parada supone margen de contribución perdido, horas extra para recuperar el retraso, chatarra por lotes interrumpidos, cargos por transporte urgente y, en el peor caso, penalizaciones a clientes. Los casos de la sección 3 muestran que los atacantes lo saben. Los grupos de ransomware no necesitan entender un PLC para detener la producción; solo necesitan cifrar los sistemas sin los cuales la planta no puede funcionar.

Para un contexto más amplio sobre el lado de los datos de la planta, consulte las guías sobre [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) y [Azure para fabricación](https://www.m365.fm/en/learn/manufacturing-it-azure/), que describen cómo los datos de planta llegan a los sistemas empresariales y a la nube. Cada una de esas conexiones es un conducto en el sentido de 62443.

## Seguridad de TI vs. OT: por qué el manual de oficina falla en la planta

La seguridad de TI y de OT utiliza muchas de las mismas herramientas: cortafuegos, cuentas, registros y copias de seguridad. Pero los sistemas, las prioridades y las consecuencias difieren lo suficiente como para que copiar el manual de oficina a la planta cause paradas. La guía de inicio rápido de ISAGCA resume la prioridad de planta en un concepto: las **funciones esenciales** que deben mantenerse "para preservar la salud, la seguridad, el medio ambiente y la disponibilidad del Equipo Bajo Control". Incluye la función instrumentada de seguridad, la función de control y la capacidad del operador de ver y manipular el equipo; la pérdida de estas funciones significa pérdida de protección, pérdida de control o pérdida de visibilidad [2].

| Aspecto | TI de oficina típica | OT de planta típica |
|---|---|---|
| Prioridad principal | Confidencialidad e integridad de los datos | Seguridad, disponibilidad e integridad del proceso; la confidencialidad importa, pero suele ir después |
| Consecuencia de un fallo | Pérdida de datos, multas, daño reputacional | Lesiones, liberación al medio ambiente, daños en equipos, desperdicio, pérdida de producción |
| Vida útil de los sistemas | De 3 a 5 años para portátiles y servidores | Entre 15 y 25 años es habitual en la práctica para controladores y máquinas [rango de la práctica, no verificado como estadística del sector] |
| Ventanas de cambio | Nocturnas o semanales | Paradas planificadas, a veces una o dos veces al año |
| Parcheado | Automatizado, mensual | Solo tras la aprobación y las pruebas del proveedor; algunos dispositivos no pueden parchearse en absoluto |
| Reinicios | Aceptables | Un reinicio puede detener una línea o arruinar un lote |
| Protocolos | Autenticados y cifrados (HTTPS, Kerberos) | Muchos protocolos industriales heredados se diseñaron sin autenticación ni cifrado |
| Antivirus y agentes | Estándar en cada endpoint | A menudo no soportados por el proveedor del HMI o del controlador; la lista blanca de aplicaciones es más segura |
| Rendimiento | Retrasos de segundos son molestos | Retrasos de milisegundos pueden hacer saltar un proceso |
| Propiedad | Departamento de TI | Mantenimiento, ingeniería de control, producción, a menudo el fabricante de la máquina |
| Quién hace los cambios | Administradores | Técnicos, integradores, proveedores, a veces operadores |

### Qué significa esto en la práctica

De la tabla se derivan tres reglas.

1. **Ningún escaneo activo de controladores sin una prueba.** Un escáner de vulnerabilidades inofensivo en un servidor de archivos puede bloquear un PLC o un HMI antiguo. El descubrimiento de activos en OT empieza de forma pasiva (escuchando el tráfico de red) o utiliza las herramientas de ingeniería del proveedor.
2. **Los cambios de seguridad requieren la aprobación de producción.** Toda regla de cortafuegos, cambio de cuenta o parche en una zona con funciones esenciales sigue la gestión de cambios (MOC), igual que un cambio en una receta o en un enclavamiento de seguridad.
3. **El control compensatorio es el caso normal.** Cuando un HMI con Windows 7 no puede sustituirse hasta la próxima reconstrucción de la línea, se protege situándolo en una zona pequeña, restringiendo sus conductos, eliminando el acceso por USB y vigilando su tráfico. Aceptar un control compensatorio en esa situación es exactamente lo que pretende el método 62443.

### Dónde TI y OT deben trabajar juntos

El error contrario es declarar la seguridad de OT un asunto exclusivo de la planta del que TI debe mantenerse al margen. Los incidentes de la siguiente sección muestran que los atacantes suelen entrar a través de los sistemas de identidad, el correo electrónico o la mesa de ayuda, que gestiona TI. Un programa eficaz tiene un responsable de riesgo a nivel de sitio, un equipo conjunto de seguridad de TI e ingeniería de control, y responsabilidades claramente asignadas para cada zona. La tabla de roles de la sección 18 muestra una forma de repartirlas.

## Lo que realmente detiene las plantas: incidentes y patrones de amenaza

Los casos documentados que aparecen a continuación no pretenden asustar a nadie. Muestran por dónde entraron los ataques, por qué se detuvo la producción y qué ayudó a la recuperación. Cada cifra procede de una fuente primaria o de una fuente secundaria de reputación; cuando una empresa nunca reveló una cifra, la tabla lo indica.

| Incidente | Qué ocurrió | Efecto en las operaciones | Cifras divulgadas | Lección para la seguridad OT |
|---|---|---|---|---|
| NotPetya en Merck (junio de 2017) | Malware destructivo que se propagó por todo el mundo a partir de una actualización comprometida de software de contabilidad ucraniano | Más de 40 000 equipos de Merck dañados [18] | Merck reclamó 1 400 millones de dólares a sus aseguradoras; en mayo de 2023 un tribunal de apelación de Nueva Jersey dictaminó que la exclusión por guerra no era aplicable; las partes llegaron a un acuerdo en enero de 2024 con condiciones no divulgadas [18] | Una red plana permite que el malware alcance los sistemas de producción; el seguro no sustituye la capacidad de recuperación |
| Norsk Hydro (marzo de 2019) | Ataque de ransomware que afectó a toda la organización mundial en las primeras horas del 19 de marzo de 2019 | Extruded Solutions sufrió las mayores pérdidas operativas; otras áreas de negocio siguieron produciendo casi con normalidad mediante "soluciones alternativas intensivas en mano de obra y procedimientos manuales" [17] | Hydro estimó el coste total en unos 800 millones de coronas noruegas [17] | Los procedimientos manuales de respaldo y una comunicación abierta acortaron la crisis |
| Colonial Pipeline (mayo de 2021) | Ataque de ransomware del grupo DarkSide el 7 de mayo de 2021, o en torno a esa fecha | Se paralizaron las operaciones del oleoducto [35] | Colonial pagó unos 75 bitcoins; el Departamento de Justicia de EE. UU. incautó 63,7 bitcoins, valorados en unos 2,3 millones de dólares en aquel momento [16] | Un incidente de ransomware provocó la parada de una operación física. El director ejecutivo de Colonial informó al Senado de que los atacantes cifraron los sistemas de TI y que la empresa apagó todo el sistema para evitar que el malware se extendiera a la red OT, porque se desconocían el origen y el alcance del ataque [36] |
| Clorox (agosto de 2023) | El 11 de agosto de 2023, los atacantes obtuvieron restablecimientos de credenciales y de MFA llamando a la mesa de ayuda de TI subcontratada [20] | Clorox detuvo la fabricación y pasó a gestionar los pedidos de forma manual; el volumen de ventas cayó un 6 % en los seis meses posteriores al ataque [20] | La demanda de Clorox contra Cognizant (julio de 2025) reclama 380 millones de dólares en daños, incluidos 49 millones en costes de remediación; Clorox ha informado de 100 millones de dólares recuperados de sus seguros; Cognizant impugna su responsabilidad [19][20] | Los procesos de identidad y de mesa de ayuda forman parte de la seguridad OT; una llamada de ingeniería social puede detener una planta |
| Jaguar Land Rover (agosto/septiembre de 2025) | Ciberataque que detuvo la producción de vehículos | Las líneas de producción se detuvieron durante varias semanas; el UK Cyber Monitoring Centre contabilizó más de 5 000 organizaciones británicas afectadas [21] | El Cyber Monitoring Centre estimó el impacto financiero en el Reino Unido en 1 900 millones de libras (unos 2 550 millones de dólares) [21] | Las cadenas de suministro fuertemente acopladas extienden la parada de una sola planta a miles de proveedores |

### Patrones que subyacen a los casos

Leídos en conjunto, los casos muestran cuatro patrones que determinan el resto de esta guía.

- **Entrada por TI, impacto en OT.** En ninguno de los cinco casos las fuentes citadas describen un ataque directo a los controladores. Las operaciones se detuvieron porque fallaron las redes compartidas, las identidades compartidas o los sistemas de negocio dependientes. Por eso la frontera de zonas entre la empresa y la planta (la DMZ industrial) y la higiene de identidades ocupan los primeros puestos de la hoja de ruta.
- **Paradas iniciadas por el operador.** Clorox desconectó sus sistemas y detuvo la fabricación tras detectar la intrusión, y después gestionó los pedidos manualmente [20]; el oleoducto de Colonial fue parado tras el ataque de ransomware [35]. Una planta que conoce de qué sistemas de negocio depende y puede funcionar en un modo degradado tiene más opciones.
- **La recuperación tarda semanas.** Incluso las empresas bien preparadas necesitaron semanas para recuperar la producción normal. Las copias de seguridad, la reconstrucción de las estaciones de ingeniería y la verificación de la lógica de los controladores determinan cuánto dura el hueco.
- **Los terceros forman parte de la superficie de ataque.** Las actualizaciones de software (NotPetya), las mesas de ayuda subcontratadas (Clorox) y los integradores (véase la hoja informativa de CISA/FBI en la sección 12) aparecen todos en el registro [14][18][20].

### Ataques dirigidos a los controladores

Los ataques que manipulan el propio proceso industrial son menos frecuentes, pero existen, y son la razón por la que existen los niveles de seguridad 3 y 4 de la norma 62443. MITRE mantiene una base de conocimiento pública sobre el comportamiento de los adversarios frente a sistemas de control industrial, ATT&CK for ICS. Su matriz (versión de contenido 20.1) agrupa las técnicas en 12 tácticas, desde Initial Access hasta Inhibit Response Function e Impair Process Control, pasando por Impact [15]. Dos tácticas son específicas de OT: **Inhibit Response Function** (impedir que las funciones de seguridad y protección reaccionen) e **Impair Process Control** (manipular el control del proceso) [15].

Para los equipos defensores, ATT&CK for ICS resulta útil de tres maneras:

1. Como lista de verificación para la detección: ¿qué técnicas podría ver su monitorización?
2. Como vocabulario común entre los analistas de seguridad de TI y los ingenieros de control.
3. Como insumo para los escenarios de amenaza de la evaluación de riesgos de 62443-3-2 (sección 8).

Esta guía se mantiene en el lado defensivo. No describe cómo llevar a cabo ninguna técnica.

## El panorama de marcos: 62443, NIST, CISA, CMMC, NIS2 y la CRA

Los fabricantes estadounidenses se enfrentan a un campo saturado de marcos normativos. En realidad no compiten tanto como parece; responden a preguntas distintas.

| Marco | Editor | Pregunta que responde | ¿Vinculante? | Estado (noviembre de 2026) |
|---|---|---|---|---|
| Serie ISA/IEC 62443 | ISA (comité ISA99) e IEC | ¿Cómo protegen los propietarios de activos, los integradores y los proveedores un IACS a lo largo de su ciclo de vida? | Voluntario; se vuelve vinculante mediante contratos, requisitos de clientes o reguladores | Partes principales publicadas; varias en revisión (sección 5) [1][6] |
| NIST Cybersecurity Framework (CSF) 2.0 | NIST | ¿Cómo gobierna y gestiona la organización el riesgo cibernético en general? | Voluntario | Publicado el 26 de febrero de 2024; seis funciones: Govern, Identify, Protect, Detect, Respond, Recover [11] |
| NIST SP 800-82 Rev. 3, Guide to OT Security | NIST | ¿Cómo encajan las arquitecturas, amenazas y contramedidas de OT en un marco de control estadounidense? | Voluntario (referencia para agencias federales) | Final en septiembre de 2023; Rev. 4, borrador inicial para comentario público el 21 de septiembre de 2026 [9][10] |
| NIST IR 8183 Rev. 2, CSF 2.0 Manufacturing Profile | NIST | ¿Qué resultados del CSF 2.0 son más importantes para los fabricantes? | Voluntario | Borrador inicial para comentario público el 29 de septiembre de 2025 [12] |
| CISA Cybersecurity Performance Goals (CPG) 2.0 | CISA | ¿Cuál es una línea base fundamental y medible para la infraestructura crítica? | Voluntario | CPG 2.0 publicado el 10 de diciembre de 2025, con un nuevo componente de gobernanza [13] |
| CMMC 2.0 | Departamento de Defensa de EE. UU. | ¿Protege un contratista de defensa la FCI y la CUI? | Contractual para contratos del DoD | Norma del programa en vigor desde el 16 de diciembre de 2024; norma DFARS desde el 10 de noviembre de 2025, con aplicación por fases [28][29] |
| Normas de divulgación de ciberseguridad de la SEC | Comisión de Bolsa y Valores de EE. UU. | ¿Cuándo y cómo deben las empresas cotizadas divulgar incidentes relevantes? | Obligatorio para los emisores registrados en la SEC | Adoptadas el 26 de julio de 2023 [26] |
| CIRCIA | CISA | ¿Cuándo deben las entidades de infraestructura crítica cubiertas notificar incidentes? | Obligatorio una vez que entre en vigor la norma final | Norma final bajo revisión de la Casa Blanca desde el 1 de octubre de 2026, aún no publicada a fecha del 9 de noviembre de 2026 [27][39] |
| Directiva NIS2 | Unión Europea (leyes de los Estados miembros) | ¿Qué entidades esenciales e importantes de la UE deben gestionar el riesgo cibernético y notificar incidentes? | Obligatorio para las entidades de la UE incluidas en el ámbito | Ley de transposición de Alemania en vigor desde el 6 de diciembre de 2025 [24] |
| Cyber Resilience Act (CRA) | Unión Europea | ¿Qué requisitos de seguridad deben cumplir los productos con elementos digitales comercializados en el mercado de la UE? | Obligatorio para los productos comercializados en la UE | Obligaciones de notificación vigentes desde el 11 de septiembre de 2026 [22] |

### Cómo encajan las piezas

Una combinación viable para un fabricante estadounidense tiene este aspecto:

- **CSF 2.0 para la gobernanza y el consejo de administración.** Proporciona a la dirección, a los auditores, a las aseguradoras y a los clientes un lenguaje común. La nueva función Govern cubre roles, apetito de riesgo y riesgo de proveedores [11].
- **62443 para el diseño de la planta y la cadena de suministro.** Es el único marco de la tabla que asigna obligaciones concretas a los propietarios de activos, integradores y proveedores de productos, y define zonas, conductos y niveles de seguridad [1][2].
- **SP 800-82 como puente.** Traduce las particularidades de OT al mundo de controles de NIST. El borrador Rev. 4 se reestructura en torno a CSF 2.0 y añade orientación sobre gestión de activos, monitorización de red y principios de confianza cero para las funciones de gestión de sistemas [10].
- **CPG como comprobación de cordura.** Son breves y medibles; útiles para una línea base rápida antes de iniciar el programa completo de 62443 [13].
- **CMMC, SEC, CIRCIA, NIS2 y CRA** solo cuando le sean aplicables (sección 19).

El Programa de Asociación de Extensión de Fabricación (MEP) del NIST ayuda a los fabricantes pequeños y medianos con autoevaluaciones basadas en CSF, análisis de brechas y planes de respuesta a incidentes [30]. Para muchas plantas con menos de 500 empleados, es la forma más asequible de empezar.

## ISA/IEC 62443 explicada: estructura, roles y estado

### Origen de la norma

La International Society of Automation (ISA) creó su comité ISA99 en 2002 para redactar normas de ciberseguridad para sistemas de automatización y control. Alrededor de 2010, el comité comenzó a trabajar estrechamente con la International Electrotechnical Commission (IEC), y los documentos se renumeraron como ISA/IEC 62443 [3]. Los documentos de ISA se publican como ANSI/ISA-62443-x-y; la IEC publica el mismo contenido como IEC 62443-x-y. ISA indica que la serie está respaldada por las Naciones Unidas, y la IEC la designó norma horizontal en 2021, lo que significa que se aplica a todos los sectores y no a una industria concreta [1].

Para un lector estadounidense, el punto práctico es que puede adquirir las ediciones ANSI/ISA en ISA y las ediciones IEC en la tienda web de la IEC, y son técnicamente equivalentes. Las fechas y los números de edición a veces difieren entre ambos editores, por lo que siempre debe citar la edición exacta en los contratos.

### Los cuatro grupos de documentos

La serie se organiza en cuatro grupos [1][2]:

1. **General (1-x):** terminología, conceptos, modelos y métricas.
2. **Políticas y procedimientos (2-x):** lo que el propietario del activo y los proveedores de servicios deben hacer como organización.
3. **Sistema (3-x):** evaluación de riesgos, zonas y conductos, y requisitos técnicos para toda la solución de automatización.
4. **Componente (4-x):** procesos de desarrollo seguro y requisitos técnicos para productos individuales.

### Las partes y su estado

La tabla combina el catálogo de ISA [1], la tienda web de la IEC [4][5] y una visión general secundaria [3]. Estado a noviembre de 2026.

| Parte | Título (breve) | Público principal | Edición vigente (ISA / IEC) | Nota de estado |
|---|---|---|---|---|
| 1-1 | Terminología, conceptos y modelos | Todos | ISA-62443-1-1 (2007); IEC TS 62443-1-1 (2009) | Segunda edición en preparación desde hace tiempo [3] |
| 1-5 | Esquema para los perfiles de seguridad de 62443 | Organismos sectoriales, proveedores | IEC TS 62443-1-5 (2023) [3] | Perfiles para sectores específicos |
| 1-6 | Aplicación de la serie 62443 al IIoT | Propietarios de activos, proveedores de servicios | IEC PAS 62443-1-6 (19 de diciembre de 2025) [5] | PAS, retirada automáticamente tras cuatro años [5] |
| 2-1 | Requisitos del programa de seguridad para propietarios de activos IACS | Propietarios de activos | ANSI/ISA-62443-2-1 (2024) [1]; IEC 62443-2-1 Ed. 2.0 (2024) [3] | Segunda edición; la norma central para propietarios de activos |
| 2-2 | Esquema de protección de seguridad IACS | Propietarios de activos | ISA-TR62443-2-2 (2025) [1]; IEC PAS 62443-2-2 (11 de marzo de 2025) [4] | Orientación para operar un esquema de protección de seguridad |
| 2-3 | Gestión de parches en el entorno IACS | Propietarios de activos, proveedores | ISA-TR62443-2-3 (2015) [1] | Informe técnico |
| 2-4 | Requisitos del programa de seguridad para proveedores de servicios IACS | Integradores, proveedores de mantenimiento | ANSI/ISA-62443-2-4 (2018) [1]; IEC 62443-2-4 Ed. 2.0 (diciembre de 2023) [3] | Base de los contratos con integradores |
| 3-1 | Tecnologías de seguridad para IACS | Todos | ISA-TR99.00.01 (2007) [1]; IEC TR 62443-3-1 (2009) [3] | Panorama tecnológico, desactualizado |
| 3-2 | Evaluación de riesgos de seguridad para el diseño de sistemas | Propietarios de activos, integradores | ANSI/ISA-62443-3-2 (2020) [1] | Segunda edición en curso [6] |
| 3-3 | Requisitos de seguridad del sistema y niveles de seguridad | Integradores, propietarios de activos | ISA-62443-3-3 (2013) [1] | Segunda edición en curso [6] |
| 4-1 | Requisitos del ciclo de vida seguro de desarrollo de productos | Proveedores de productos | ANSI/ISA-62443-4-1 (2018) [1] | Base de ISASecure SDLA [7] |
| 4-2 | Requisitos técnicos de seguridad para componentes IACS | Proveedores de productos | ANSI/ISA-62443-4-2 (2018) [1] | Segunda edición en curso [6]; base de ISASecure CSA [7] |
| 6-1 | Metodología de evaluación de seguridad para 62443-2-4 | Organismos de certificación | IEC TS 62443-6-1 (2024) [3] | Para evaluar proveedores de servicios |

Dos notas prácticas. En primer lugar, las fechas de las partes centrales (3-3 de 2013, 4-2 de 2018) no significan que el contenido esté obsoleto; siguen siendo las ediciones a las que se refieren las certificaciones y los contratos. En segundo lugar, hay revisiones en curso para 3-2, 3-3 y 4-2 [6]. Si redacta contratos de suministro a largo plazo, haga referencia a "la edición vigente en el momento del pedido" o indique la edición y añada una cláusula de revisión.

Una advertencia sobre las fuentes secundarias: en 2026 algunos sitios web anunciaron una nueva "IEC 62443-4-2:2026" con detección obligatoria de anomalías mediante IA. No encontramos tal publicación en el catálogo de ISA ni en la tienda web de IEC a noviembre de 2026 [1][4]. Verifique toda afirmación sobre ediciones con el editor.

### Los roles: quién debe hacer qué

62443 asigna responsabilidades a roles, no a departamentos. La guía de inicio rápido de ISAGCA los define de la siguiente manera [2]:

| Rol | Definición (ISAGCA) | Empresa típica | Partes principales de 62443 |
|---|---|---|---|
| Propietario de activos | "La organización que es responsable y rinde cuentas del IACS" | El fabricante que opera la planta | 2-1, 2-2, 2-3, 3-2 |
| Proveedor de servicios de integración | "La organización que proporciona actividades de integración para una solución de automatización" | Integrador de sistemas, fabricante de máquinas que entrega una línea, ingeniería interna | 2-4, 3-2, 3-3 |
| Proveedor de servicios de mantenimiento | Proporciona actividades de soporte para una solución de automatización según las políticas del propietario de activos | Contratista de servicios, servicio de OEM, mantenimiento interno | 2-4 |
| Proveedor de productos | "La organización que fabrica y da soporte a un producto de hardware y/o software" | Proveedores de PLC, HMI, redes, variadores y software | 4-1, 4-2 |

Una empresa puede desempeñar varios roles. Un fabricante de máquinas es proveedor de productos para el software de su armario de control y proveedor de servicios de integración cuando instala la línea. Un gran fabricante con su propio departamento de ingeniería de control es, al mismo tiempo, propietario de activos e integrador. El valor del modelo de roles es que el contrato y la auditoría pueden precisar qué requisitos corresponden a cada parte.

### Los dos ciclos de vida

La norma 62443 distingue el **ciclo de vida de desarrollo de producto** del proveedor del **ciclo de vida de la solución de automatización** en la planta, que tiene una fase de integración y una fase de operación y mantenimiento [2]. Un PLC seguro (4-2) no convierte una línea en segura; el integrador debe configurarlo correctamente (3-3), y el propietario del activo debe operarlo de forma segura durante veinte años (2-1). La mayoría de los problemas en planta surgen en el tercer paso.

## Requisitos fundamentales, niveles de seguridad y niveles de madurez

### Los siete requisitos fundamentales

Todos los requisitos técnicos de 3-3 (sistema) y 4-2 (componente) se agrupan en siete requisitos fundamentales (FR, por sus siglas en inglés) [2]. Apréndalos; son la base de todo análisis de brechas.

| FR | Nombre | Qué exige en lenguaje de planta | Medidas típicas en planta |
|---|---|---|---|
| FR 1 | Control de identificación y autenticación (IAC) | ¿Sabemos quién o qué se está conectando? | Cuentas personales en lugar de inicios de sesión compartidos de "operador", MFA para acceso remoto, certificados de dispositivo para OPC UA |
| FR 2 | Control de uso (UC) | ¿Puede cada persona hacer solo lo que exige su función? | Derechos basados en roles en HMI y herramientas de ingeniería, cuentas de administrador separadas, auditoría de quién cambió la lógica |
| FR 3 | Integridad del sistema (SI) | ¿Podemos detectar o impedir cambios no autorizados en software, lógica y datos? | Listas blancas de aplicaciones, firmware firmado, llave del controlador en RUN, detección de cambios en la lógica |
| FR 4 | Confidencialidad de los datos (DC) | ¿Está protegida la información sensible en uso, tránsito y almacenamiento? | Sesiones remotas cifradas, protección de recetas y planos, manejo de CUI para trabajos de defensa |
| FR 5 | Flujo de datos restringido (RDF) | ¿Se limita el tráfico a lo necesario entre zonas? | Segmentación, cortafuegos en los conductos, DMZ industrial, pasarelas unidireccionales cuando esté justificado |
| FR 6 | Respuesta oportuna a eventos (TRE) | ¿Detectamos los incidentes y reaccionamos a tiempo? | Recopilación de registros, monitorización de red OT, gestión de alarmas, playbook de incidentes |
| FR 7 | Disponibilidad de recursos (RA) | ¿Siguen funcionando las funciones esenciales bajo estrés o ataque? | Redundancia, copias de seguridad, restauraciones probadas, protección frente a inundaciones de red, respaldo manual |

### Niveles de seguridad (SL 1 a 4)

Un nivel de seguridad describe la fuerza del atacante que una zona o componente puede resistir. La norma 62443-3-3 define cuatro niveles [2]:

| SL | Protección frente a | Amenaza de ejemplo en planta |
|---|---|---|
| SL 0 | No se requiere protección especial | Rara vez justificado; no es un objetivo de diseño |
| SL 1 | Violación casual o fortuita | Un técnico conecta un portátil al puerto de switch equivocado |
| SL 2 | Violación intencionada con medios sencillos, pocos recursos, habilidades genéricas y baja motivación | Ransomware de uso común, un atacante oportunista con herramientas estándar |
| SL 3 | Violación intencionada con medios sofisticados, recursos moderados, habilidades específicas de IACS y motivación moderada | Un grupo criminal que estudia su sistema de control antes de actuar |
| SL 4 | Violación intencionada con medios sofisticados, recursos amplios, habilidades específicas de IACS y motivación alta | Un equipo con respaldo estatal y financiación sólida que apunta a un proceso concreto |

Cada nivel de seguridad no es un único número para toda la planta, sino un vector a lo largo de los siete FR. Una zona puede necesitar SL 3 para FR 3 (integridad, porque una lógica manipulada podría herir a alguien) pero solo SL 1 para FR 4 (confidencialidad, porque los datos no son sensibles). La visión general secundaria señala que los SL se evalúan por requisito técnico, no como una calificación general de un producto [3].

También existen tres tipos de nivel de seguridad [2]:

- **SL-T (objetivo):** el nivel deseado para una zona o conducto, fijado por la evaluación de riesgos.
- **SL-C (capacidad):** lo que un sistema (3-3) o componente (4-2) puede proporcionar cuando se integra y configura correctamente.
- **SL-A (alcanzado):** el nivel real de la solución instalada.

Todo el programa puede describirse en una frase: elegir componentes con un SL-C al menos igual al SL-T, configurarlos de modo que el SL-A alcance el SL-T y aplicar medidas compensatorias cuando no lo haga.

**Cómo fijan los objetivos la mayoría de los fabricantes medianos.** SL 2 es el objetivo habitual para las zonas de producción en fabricación discreta, y SL 3 para las zonas cuyo compromiso podría causar lesiones, liberaciones ambientales importantes o paradas largas, como los sistemas de seguridad y el control de procesos críticos. Se trata de experiencia práctica, no de una regla de la norma [unverified: cifra estadística no contrastada]. La decisión corresponde a su evaluación de riesgos, documentada y aprobada por el propietario del activo.

### Niveles de madurez

Los niveles de seguridad miden la solidez técnica. Los niveles de madurez miden lo bien que se ejecutan los procesos. El modelo de madurez de IEC 62443 se basa en CMMI y se utiliza en las partes 2-1, 2-2, 2-4 y 4-1 [2]. La descripción general secundaria describe ML 1 (inicial, ad hoc), ML 2 (gestionado, documentado y repetible), ML 3 (definido, practicado en toda la organización con evidencias) y ML 4 (en mejora, medido y mejorado continuamente) [3].

Una lectura práctica: un integrador cuyos procesos 2-4 están en ML 1 hace un buen trabajo cuando el ingeniero adecuado está en planta y un trabajo deficiente cuando no lo está. Exija ML 2 o superior en los contratos, lo que significa procedimientos escritos, personal formado y evidencias.

### Los principios de diseño que subyacen a los requisitos

La guía de inicio rápido enumera cuatro principios de diseño que recorren toda la serie: seguridad desde el diseño, reducción de la superficie de ataque (control de acceso, segmentación, mínima funcionalidad y mínimo privilegio), defensa en profundidad y protección de las funciones esenciales [2]. La defensa en profundidad se define como "la provisión de múltiples protecciones de seguridad, especialmente en capas, con la intención de retrasar o impedir un ataque" [2]. Ningún cortafuegos por sí solo debe soportar la carga.

## Zonas y conductos y el modelo de Purdue

### Definiciones

- **Zona:** "una agrupación de activos lógicos o físicos basada en el riesgo u otros criterios" [2].
- **Conducto:** "una agrupación lógica de canales de comunicación que comparten requisitos de seguridad comunes" [2].

Los activos de una misma zona comparten los mismos requisitos de seguridad; el tráfico entre zonas solo circula a través de conductos definidos, y cada conducto tiene sus propios controles (reglas de cortafuegos, restricciones de protocolo, autenticación y monitorización). Una zona puede ser una única celda con un robot y su PLC, una línea de producción completa, el sistema de servicios auxiliares o la zona desmilitarizada industrial (IDMZ).

### Cómo trazar las zonas

Agrupe los activos según estos criterios, aproximadamente en este orden:

1. **Función y consecuencias:** los sistemas de seguridad en su propia zona, separados del control de proceso básico.
2. **Ubicación física o lógica:** línea, edificio, emplazamiento.
3. **Propiedad y ciclo de vida:** una línea llave en mano de un mismo fabricante de máquinas suele formar una zona natural.
4. **Capacidad técnica:** los sistemas heredados que no pueden endurecerse pueden necesitar una zona pequeña propia con conductos muy restringidos.
5. **Necesidades de conectividad:** los sistemas que deben comunicarse con la empresa o la nube se sitúan cerca del límite, no en el interior profundo.

Evite dos extremos. Una sola zona para toda la planta no ofrece ninguna contención. Cien zonas hacen inmanejables las reglas y crean un cortafuegos que nadie se atreve a tocar. Para una planta de tamaño medio, de 8 a 20 zonas es lo habitual en la práctica [rango de la práctica, no verificado].

### El modelo de Purdue y sus límites

Muchas plantas siguen describiendo su arquitectura con la Arquitectura de Referencia Empresarial de Purdue, que la norma ISA-95 adoptó como jerarquía funcional. Sus niveles son un mapa inicial útil para las zonas:

| Nivel | Contenido | Sistemas de ejemplo | Zona típica |
|---|---|---|---|
| 4-5 | Empresa: planificación empresarial y logística, TI corporativas, internet | ERP, correo electrónico, Microsoft 365, identidad empresarial | Zona empresarial |
| 3.5 | Zona desmilitarizada industrial (no está en el modelo original; común en la práctica) | Réplica del historiador, servidor de parches, pasarela de acceso remoto, transferencia de archivos | IDMZ |
| 3 | Operaciones de planta: gestión de operaciones de fabricación | MES, historiador de planta, controlador de dominio OT, servidor de copias de seguridad | Zona de operaciones de planta |
| 2 | Control supervisor de área | SCADA, HMI, estaciones de ingeniería | Zonas de línea o área |
| 1 | Control básico | PLC, controladores DCS, controladores de robots, accionamientos | Zonas de celda o línea |
| 0 | Proceso físico | Sensores, actuadores, motores, válvulas | Dentro de las zonas de celda |
| Seguridad | Sistemas instrumentados de seguridad | PLC de seguridad, sistema de gestión de quemadores, seguridad de prensas | Zona de seguridad separada |

El modelo de Purdue es un mapa de partida, no el modelo de zonas en sí. Sus límites aparecen en tres ámbitos:

- **IIoT y nube.** Los sensores inalámbricos que envían datos directamente a una plataforma en la nube saltan niveles. La norma IEC PAS 62443-1-6 (diciembre de 2025) ofrece orientación para aplicar la serie a sistemas IIoT [5]; el borrador NIST SP 800-82 Rev. 4 también incorpora la cobertura de IIoT con la convergencia hacia la nube [10].
- **Líneas planas.** Muchas máquinas combinan el nivel 1 y el nivel 2 en un mismo armario. Las zonas siguen al riesgo, no al plano.
- **Servicios compartidos.** Un Active Directory que sirve tanto a oficinas como a planta conecta los niveles 4 y 3 de una forma que el plano no muestra. Cartografíe las dependencias reales, no las previstas.

Para el lado de la arquitectura de datos (niveles ISA-95, espacio de nombres unificado, clústeres de borde en la DMZ industrial), consulte las guías sobre [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/) y [Azure para manufactura](https://www.m365.fm/en/learn/manufacturing-it-azure/).

## La evaluación de riesgos de IEC 62443-3-2, paso a paso

IEC 62443-3-2 describe cómo pasar de "tenemos un sistema" a "conocemos las zonas, los conductos y los niveles de seguridad objetivo". La guía de inicio rápido resume el flujo de trabajo en siete requisitos de zonas y conductos (ZCR) [2]:

| Paso | ZCR | Actividad | Resultado |
|---|---|---|---|
| 1 | ZCR 1 | Identificar el sistema bajo consideración (SUC) | Límite, lista de activos, puntos de entrada |
| 2 | ZCR 2 | Realizar una evaluación inicial de riesgos de ciberseguridad | Consecuencias del peor caso suponiendo que el sistema está comprometido |
| 3 | ZCR 3 | Dividir el SUC en zonas y conductos | Diagrama de zonas y conductos |
| 4 | ZCR 4 | Decidir: ¿el riesgo inicial supera el riesgo tolerable? | Lista de zonas que requieren una evaluación detallada |
| 5 | ZCR 5 | Realizar una evaluación detallada de riesgos de ciberseguridad | Amenazas, vulnerabilidades, probabilidad, consecuencias, SL-T por zona y conducto |
| 6 | ZCR 6 | Documentar requisitos de ciberseguridad, supuestos y restricciones | Especificación de requisitos de ciberseguridad (CRS) |
| 7 | ZCR 7 | Aprobación del propietario del activo | CRS firmado |

(La guía de inicio rápido etiqueta el paso de documentación como "ZCR 4" en un punto; en la secuencia, es el sexto paso.)

### Cómo ejecutarlo en la práctica

**Paso 1: Definir el sistema.** Elija un alcance que un equipo pueda manejar en unas pocas semanas, como un edificio de producción o una línea junto con sus sistemas de soporte. Incluya las rutas de acceso remoto y las conexiones a la nube; forman parte del sistema aunque los servidores estén en otro lugar.

**Paso 2: Evaluación inicial con la perspectiva de "asumir una brecha".** Para cada zona candidata, pregunte cuál es el peor resultado plausible si un atacante obtiene control total. Use su análisis de riesgos de proceso (PHA) o HAZOP como insumo: el equipo de seguridad ya sabe qué desviaciones pueden causar daño a las personas. La evaluación inicial utiliza el riesgo no mitigado: sin crédito por los controles de seguridad existentes.

**Paso 3: Zonas y conductos.** Dibújelos según los criterios de la sección anterior. Toda conexión que cruce un límite de zona pasa a formar parte de un conducto.

**Paso 4: Riesgo tolerable.** Su empresa necesita una matriz de riesgos que indique qué combinaciones de probabilidad y consecuencia son tolerables. Muchas plantas ya cuentan con una para seguridad de procesos o gestión de riesgos empresariales; reutilícela en lugar de inventar una nueva.

**Paso 5: Evaluación detallada.** Para las zonas por encima de la línea de tolerancia, enumere los escenarios de amenaza (ATT&CK para ICS ayuda [15]), los controles existentes y las vulnerabilidades, y luego estime la probabilidad y la consecuencia. Derive el SL-T por FR.

**Paso 6: Especificación de requisitos de ciberseguridad.** Documente por zona y conducto: SL-T, medidas requeridas, supuestos (por ejemplo, "el gabinete está cerrado con llave y el área tiene control de acceso por credencial") y restricciones ("el proveedor del HMI no admite antivirus"). El CRS es el documento que entrega a un integrador o a un fabricante de máquinas.

**Paso 7: Aprobación.** El gerente de planta o el propietario del activo designado lo firma. Este paso es importante: convierte el riesgo residual en una decisión de la dirección, no en una preferencia de ingeniería.

### Un esquema de puntuación sencillo

Use la escala que utilice su gestión de riesgos empresariales. Si no tiene ninguna, el siguiente esquema 5x5 sirve para una primera aproximación.

| Puntuación | Probabilidad (con los controles actuales) | Consecuencia (peor caso plausible, por zona) |
|---|---|---|
| 1 | No plausible durante la vida útil del sistema | Sin efecto en seguridad, menos de 4 horas de inactividad, menos de 50 000 USD |
| 2 | Plausible pero poco probable | Caso de primeros auxilios, hasta 1 turno de inactividad, hasta 250 000 USD |
| 3 | Podría ocurrir en un plazo de 10 años | Lesión registrable, de 1 a 3 días de inactividad, hasta 1 millón de USD |
| 4 | Podría ocurrir en un plazo de 3 años | Lesión grave o liberación ambiental, de 1 a 2 semanas de inactividad, hasta 5 millones de USD |
| 5 | Esperable dentro de un año | Fatalidad o liberación mayor, más de 2 semanas, más de 5 millones de USD |

Los umbrales de dinero y tiempo anteriores son ilustrativos y deben ser definidos por cada empresa según su propio apetito de riesgo.

Riesgo = probabilidad x consecuencia. Una asignación habitual: 1 a 6 tolerable, 8 a 12 requiere medidas y aprobación, 15 a 25 no tolerable. Para el SL-T, una heurística práctica es la siguiente: las zonas cuya consecuencia más grave puntúa 4 o 5 reciben SL-T 3 para FR 1 a FR 3 y FR 7; las zonas con consecuencia 2 o 3 reciben SL-T 2; la consecuencia 1 recibe SL-T 1. Esta heurística es nuestra simplificación para una primera pasada; la norma exige una justificación documentada, no una fórmula.

## Ejemplo práctico: zonas y conductos para una planta de tamaño medio

Las definiciones abstractas solo llegan hasta cierto punto. Esta sección aplica 62443-3-2 a una planta ficticia pero típica. Todos los nombres y cifras son ilustrativos.

### La planta

"Midwest Components" fabrica carcasas y conjuntos metálicos para equipos agrícolas y de construcción. Un solo emplazamiento, 420 empleados, tres turnos, facturación anual de unos 150 millones de dólares. Producción:

- **Taller de prensas:** cuatro prensas servo con automatización de transferencia; una línea de prensas tiene un PLC de seguridad con cortinas de luz y un control bimanual.
- **Área de celdas de soldadura:** doce celdas de soldadura robotizada de dos fabricantes de máquinas, cada una con su propio PLC, controlador de robot y HMI.
- **Taller de pintura:** línea de pintura en polvo con horno de curado (quemador de gas natural con sistema de gestión del quemador), operado por un pequeño DCS.
- **Montaje:** dos líneas de montaje manual con herramientas de par, impresoras de etiquetas y un PLC de línea para la cinta transportadora.
- **Servicios auxiliares:** aire comprimido, agua de refrigeración, HVAC y medición de energía en un sistema SCADA.
- **Sistemas del emplazamiento:** MES con un servidor y 40 clientes, un historiador, un laboratorio de calidad con una máquina de medición por coordenadas (CMM), un Active Directory de OT y un servidor de copias de seguridad.
- **Empresa:** ERP alojado por el departamento de TI corporativo, Microsoft 365, identidad corporativa.
- **Acceso remoto:** los dos fabricantes de máquinas de soldadura y el fabricante de prensas utilizan actualmente cada uno su propio equipo de acceso remoto con módem celular. El integrador de la línea de pintura se conecta mediante una VPN del proveedor.
- **Nube:** un servicio de monitorización energética recibe datos de los contadores por internet desde una pasarela en la red de servicios auxiliares.

### Pasos 1 y 2: evaluación inicial

El equipo (responsable de ingeniería de planta, responsable de control, responsable de seguridad de TI, responsable de EHS y supervisor de mantenimiento) recorre cada área con la pregunta "¿cuál es el peor resultado plausible si un atacante controla esto?"

| Área | Peor resultado plausible (asumiendo brecha) | Puntuación de consecuencia |
|---|---|---|
| PLC de seguridad de la línea de prensas | Función de seguridad deshabilitada durante la operación, riesgo de lesiones graves | 5 |
| Control de prensas | Troqueles y prensas dañados, semanas de parada | 4 |
| Gestión del quemador del horno de pintura | Condiciones inseguras del quemador, riesgo de incendio o explosión | 5 |
| DCS de pintura | Lotes arruinados, varios días de parada | 3 |
| Celdas de soldadura | Utillajes dañados, fugas de calidad, 1 a 3 días por celda | 3 |
| Líneas de montaje | Par o etiquetas incorrectos, fuga de calidad hacia clientes | 3 |
| SCADA de servicios auxiliares | Pérdida de aire comprimido y refrigeración que detiene toda la planta | 4 |
| MES e historiador | La planta puede funcionar en modo manual degradado durante unos días | 3 |
| Laboratorio de calidad | Datos de medición erróneos, fuga de calidad | 2 |
| TI empresarial | Interrupción del negocio; la planta se detiene si los datos de pedidos y envíos no están disponibles | 4 |

### Paso 3: el modelo de zonas

| Zona | Contenido | SL-T (FR 1-3, FR 5-7 / FR 4) | Justificación |
|---|---|---|---|
| Z0 Empresa | TI corporativa, ERP, Microsoft 365 | Gestionada por la TI corporativa según CSF 2.0 | Fuera del IACS, pero la principal fuente de amenazas |
| Z1 DMZ industrial | Réplica del historiador, servidor de parches y actualizaciones antivirus, pasarela de acceso remoto, servidor de transferencia de archivos, hosts de salto | SL 3 / SL 2 | Única zona con contacto directo con Z0 y con proveedores externos |
| Z2 Operaciones de planta | Servidor MES, historiador de planta, Active Directory de OT, servidor de copias de seguridad, gestión de los sensores de monitorización de OT | SL 2 / SL 2 | Consecuencia 3, pero servicios centrales para todas las líneas |
| Z3 Control de prensas | PLC de prensas, automatización de transferencia, HMI, estación de ingeniería de prensas | SL 2, SL 3 para FR 3 / SL 1 | Consecuencia 4: la integridad de la lógica es lo más importante |
| Z4 Seguridad de prensas | PLC de seguridad, cortinas de luz, mandos a dos manos | SL 3 / SL 1 | Consecuencia 5; zona separada con conductos mínimos |
| Z5 Celdas de soldadura (fabricante de máquinas A) | Seis celdas | SL 2 / SL 1 | Consecuencia 3, llave en mano de un solo proveedor |
| Z6 Celdas de soldadura (fabricante de máquinas B) | Seis celdas | SL 2 / SL 1 | Igual, con otro proveedor y otra ruta de acceso remoto |
| Z7 DCS de pintura | Controladores DCS, estaciones de operador | SL 2 / SL 1 | Consecuencia 3 |
| Z8 Gestión de quemadores | Sistema de gestión de quemadores del horno de curado | SL 3 / SL 1 | Consecuencia 5; zona de seguridad separada |
| Z9 Montaje | PLC de línea, controladores de par, impresoras de etiquetas, HMI | SL 2 / SL 1 | Consecuencia 3 |
| Z10 Servicios auxiliares | SCADA, compresores, enfriadoras, controles de HVAC, contadores | SL 2, SL 3 para FR 7 / SL 1 | Consecuencia 4: la disponibilidad es lo más importante |
| Z11 Laboratorio de calidad | CMM, PC de laboratorio | SL 2 / SL 2 | Datos de medición y planos de clientes |
| Z12 Pasarela IIoT de energía | Pasarela de contadores con conexión a la nube | SL 2 / SL 1 | Ruta directa a internet, aislada del control de Z10 |

Doce zonas dentro de la planta, además de la empresa. Observe qué ocurre con los equipos de acceso remoto por red celular: desaparecen. Todo el acceso de los proveedores pasa a la pasarela de acceso remoto de Z1.

### Los conductos

| Conducto | Entre | Tráfico permitido | Controles |
|---|---|---|---|
| C1 | Z0 Empresa <-> Z1 DMZ industrial | Interfaz de pedidos del ERP al MES mediante el broker de la DMZ; usuarios a la réplica del historiador (solo lectura); descargas de actualizaciones | Par de cortafuegos (lado empresa y lado planta), sin tráfico directo de Z0 a Z2 o inferiores, registro de eventos |
| C2 | Z1 DMZ industrial <-> Z2 Operaciones de planta | Replicación del historiador (Z2 a Z1), interfaz MES, distribución de parches, sesiones en hosts de salto | Cortafuegos con reglas de permiso explícitas, MFA para los hosts de salto, grabación de sesiones |
| C3 | Proveedores externos <-> Z1 DMZ industrial | Sesiones de acceso remoto | Pasarela de acceso remoto con cuentas personales, MFA, aprobación por sesión, límites de tiempo, grabación |
| C4 | Z2 <-> Z3, Z5, Z6, Z7, Z9, Z10, Z11 | MES a PLC y HMI de línea (protocolos industriales definidos), recopilación de datos del historiador, copias de seguridad, acceso de ingeniería desde el host de salto | Cortafuegos internos o ACL por zona; solo protocolos y hosts nombrados |
| C5 | Z3 Control de prensas <-> Z4 Seguridad de prensas | Solo señales de estado | Cableado directo o red de seguridad dedicada; sin conexión enrutable hacia Z2 |
| C6 | Z7 DCS de pintura <-> Z8 Gestión de quemadores | Señales de estado y de permiso | E/S cableadas; sin acceso de ingeniería salvo localmente con MOC |
| C7 | Pasarela IIoT Z12 <-> internet (servicio en la nube) | Solo telemetría cifrada saliente | Pasarela en su propia VLAN, solo salida, sin conexiones entrantes |
| C8 | Z10 Servicios auxiliares -> Z12 | Valores de contadores | Flujo de datos en un solo sentido (diodo de datos o regla de cortafuegos unidireccional), sin ruta de Z12 de vuelta a Z10. Compruebe primero que el protocolo del contador funciona en un solo sentido; los protocolos de petición-respuesta necesitan una pasarela que consulte desde el lado de Z10 |

### Pasos 4 a 7: de las brechas a una especificación de requisitos

La evaluación detallada de Z4 Seguridad de prensas muestra: riesgo inicial 5 (consecuencia) x 3 (probabilidad: se puede llegar al PLC de seguridad desde la red de la HMI de la prensa y desde el módem celular de un fabricante de máquinas) = 15, no tolerable. Con las medidas previstas (zona separada, sin conducto enrutable, módem celular retirado, selector con llave protegido en RUN, suma de control de la lógica verificada semanalmente), el equipo estima una probabilidad de 1 y un riesgo residual de 5, tolerable. El propietario del activo firma la aprobación.

En el caso de Z5 y Z6, la brecha se concentra principalmente en FR 1 y FR 2: cuentas compartidas en las doce HMI y en los pendientes de programación de los robots. El CRS para la próxima compra de celda exige cuentas nominales y una HMI certificada SL-C 2; para las celdas existentes, la medida compensatoria es un jump host con cuentas personales delante de ellas y la prohibición de conexiones directas desde portátiles.

### Qué muestra el resultado al cabo de un año

| Métrica | Antes | Después de 12 meses |
|---|---|---|
| Rutas de acceso remoto no controladas | 4 (3 equipos celulares, 1 VPN de proveedor) | 0; una única pasarela con MFA y registro |
| Zonas | 1 red de planta plana, VLAN de oficina enrutada hacia ella | 12 zonas de planta más empresa, con IDMZ entre ambas |
| Activos con propietario y versión de firmware conocidos | Desconocido | 96 % de los 640 activos conectados a red inventariados |
| Controladores con copia de seguridad offline de la lógica actual | Aproximadamente la mitad (estimación) | 100 % de los 58 PLC y controladores; restauración probada en 6 |
| Playbook de incidentes | Ninguno | Escrito y probado en un ejercicio de mesa con producción |

Estas cifras son ilustrativas. Lo importante es la forma del resultado: menos rutas, activos conocidos y lógica recuperable.

## Inventario de activos OT

No se puede proteger lo que no se conoce. El inventario de activos es el paso cero de 62443-3-2 (identificar el sistema bajo consideración) y de todos los perfiles de NIST. El borrador de NIST SP 800-82 Rev. 4 amplía su guía sobre gestión de activos [10].

### Qué registrar

Un inventario útil va más allá de una lista de direcciones IP. La tabla es una plantilla; empiece por los campos en negrita y añada el resto con el tiempo.

| Campo | Ejemplo | Por qué importa |
|---|---|---|
| **ID y nombre del activo** | PR3-PLC01 | Referencia única en tickets y planos |
| **Tipo** | PLC, HMI, controlador de robot, switch, servidor, estación de trabajo | Determina qué controles se aplican |
| **Fabricante, modelo** | (fabricante), (modelo) | Cruce con avisos de seguridad del fabricante |
| **Versión de firmware / software** | v32.011 | Decisiones sobre vulnerabilidades y parches |
| **Zona** | Z3 Control de prensa | Vincula el activo con el modelo de zonas |
| **Ubicación** | Línea de prensa 3, armario +A1 | Acceso físico y mantenimiento |
| **Propietario** | Ingeniería de control, prensa | Quién decide sobre los cambios |
| **Criticidad** | Puntuación de consecuencia 4 | Priorización |
| Direcciones de red y protocolos | 10.30.3.11, EtherNet/IP | Reglas de firewall, líneas base de monitorización |
| Socios de comunicación | HMI PR3-HMI01, servidor MES | Definición de conducto |
| Acceso remoto | Solo mediante jump host | Exposición |
| Estado de la copia de seguridad | Lógica respaldada el 2026-11-05, restauración probada en 2026-06 | Preparación para la recuperación |
| Estado de soporte del fabricante | Soportado hasta (fecha) o fin de vida útil | Planificación del ciclo de vida |
| Cuentas | Cuentas nominales sí/no; contraseña por defecto cambiada sí/no | Brechas de FR 1 y FR 2 |
| Vulnerabilidades conocidas | Referencia del aviso, decisión | Parches y medidas compensatorias |
| Repuestos y sustitución | Repuesto en almacén sí/no | Tiempo de recuperación |

### Cómo construirlo sin romper nada

1. **Parta de lo que ya existe.** Los planos eléctricos, los archivos de proyecto de los PLC, las configuraciones de los switches de red, los registros del sistema de gestión del mantenimiento (CMMS), las órdenes de compra y la documentación de los fabricantes de máquinas ya contienen la mayor parte de los datos.
2. **Descubrimiento pasivo en red.** Las herramientas comerciales de monitorización OT escuchan una copia del tráfico de red (mediante puerto SPAN o TAP de red) e identifican dispositivos, versiones de firmware y patrones de comunicación sin enviar paquetes a los controladores.
3. **Herramientas del fabricante y consultas controladas.** El software de ingeniería puede leer información de los dispositivos de forma segura. Las consultas activas son aceptables cuando el fabricante las soporta y producción acuerda una ventana horaria.
4. **Recorra la planta.** Todo inventario encuentra dispositivos que no figuran en ningún plano: un router celular olvidado, un portátil dentro de un armario, un punto de acceso inalámbrico instalado por un contratista.
5. **Manténgalo vivo.** Vincule las actualizaciones a la gestión del cambio: ningún dispositivo nuevo entra en servicio sin una entrada en el inventario. Concilie mensualmente con lo que detecta la monitorización.

### Una nota sobre las herramientas

Las plataformas especializadas de seguridad OT automatizan el descubrimiento pasivo y la correlación de vulnerabilidades. Microsoft anunció que retirará el componente de seguridad OT de Defender for IoT en octubre de 2029 y remite a los clientes a soluciones de socios [31]; la [guía de Azure para manufactura](https://www.m365.fm/en/learn/manufacturing-it-azure/) cubre esa transición. Sea cual sea la herramienta que elija, el inventario pertenece al propietario del activo y debe poder exportarse; no lo encierre en la consola de un único proveedor.

## Segmentación de red y la DMZ industrial

La segmentación implementa FR 5 (flujo de datos restringido). Es la única medida que habría limitado la propagación en la mayoría de los casos de la sección 3, y es donde la mayoría de las plantas encuentra la mayor brecha.

### Arquitectura objetivo

- **Frontera de dos capas entre empresa y planta.** Una DMZ industrial (IDMZ) entre la empresa y las operaciones de planta, con cortafuegos a ambos lados. Ningún tráfico pasa directamente de la empresa a la planta; cada intercambio termina en la IDMZ (broker de datos, réplica del historiador, transferencia de archivos, host de salto, servidor de parches).
- **Segmentación interna por zonas.** Dentro de la planta, cada zona se ubica en su propia VLAN o red física, con un cortafuegos o listas de control de acceso en el conducto.
- **Sistemas de seguridad separados.** Las zonas de seguridad no tienen conexión enrutable con el resto, o solo a través de un conducto muy restringido aprobado por seguridad de procesos.
- **Sin equipos con doble conexión.** Un PC con una tarjeta de red en la oficina y otra en la planta evita todos los cortafuegos.
- **Internet solo por rutas definidas.** Las conexiones a la nube salen por la IDMZ o desde una zona IIoT dedicada, únicamente en sentido saliente.

### Un proyecto de segmentación en siete pasos

1. **Mapear primero el tráfico real.** Ejecutar monitorización pasiva durante dos a cuatro semanas para ver quién se comunica con quién. En las plantas siempre hay sorpresas.
2. **Dibujar el modelo de zonas objetivo** (sección 9) y acordarlo con producción.
3. **Construir la IDMZ** y trasladar a ella los servicios que cruzan la frontera: réplica del historiador, pasarela de acceso remoto, servidor de parches, transferencia de archivos.
4. **Configurar los cortafuegos en modo "permitir y registrar" primero.** Instalar cortafuegos en los conductos con reglas que permitan el tráfico actual y registren todo.
5. **Endurecer las reglas por etapas.** Sustituir las reglas amplias por otras específicas (origen, destino, protocolo, puerto), una zona cada vez, durante ventanas planificadas con ingenieros de control en planta.
6. **Pasar a "denegar por defecto"** una vez que los registros muestren solo el tráfico esperado.
7. **Poner las reglas bajo gestión de cambios.** Cada nueva regla necesita un solicitante, una justificación de negocio, una fecha de caducidad y una aprobación.

### Plantilla de regla de cortafuegos

| Campo | Ejemplo |
|---|---|
| ID de regla | C4-017 |
| Conducto | C4 (Z2 Operaciones de planta -> Z3 Control de prensa) |
| Origen | Servidor MES 10.20.1.15 |
| Destino | PR3-PLC01 10.30.3.11 |
| Protocolo / puerto | EtherNet/IP, TCP 44818 |
| Dirección | Solo Z2 -> Z3 |
| Justificación de negocio | El MES lee contadores de piezas y escribe números de orden |
| Solicitado por / aprobado por | Administrador MES / responsable de control, prensa |
| Válida hasta | Fecha de revisión 2027-11 |
| Registro | Sí |

### Conexiones inalámbricas y celulares

La Wi-Fi para escáneres portátiles, los sensores inalámbricos y los módems celulares en los armarios de máquinas crean rutas que no aparecen en el plano de la red cableada. Trate cada red inalámbrica como una zona propia o como parte de un conducto: SSID separados para dispositivos de planta e invitados, autenticación basada en certificados para los dispositivos de planta, ningún puenteo entre redes inalámbricas y redes de control, y un estudio periódico de radiofrecuencia para detectar puntos de acceso y módems no autorizados. Los sensores IIoT inalámbricos que envían datos directamente a un servicio en la nube pertenecen a una zona IIoT, como la Z12 del ejemplo práctico.

### Problemas habituales de segmentación

- **Portátiles de ingeniería** que se llevan entre zonas y la oficina. Solución: estaciones de ingeniería fijas por zona o un host de salto, y portátiles que nunca salgan de la red de planta.
- **Redes planas de máquinas** suministradas por los fabricantes de máquinas, donde el HMI, el PLC y un router de acceso remoto están en el mismo switch no gestionado. Solución: tratar la máquina como una sola zona y controlar el conducto en su borde.
- **Active Directory compartido.** Un dominio empresarial extendido a la planta da a un atacante que controle el dominio también el control de la planta. Solución: un dominio OT separado o cuentas locales con un modelo de confianza definido.
- **Protocolos con mucho tráfico de difusión** que no se enrutan bien. Solución: planificar los límites de VLAN con el proveedor de sistemas de control; algunos protocolos necesitan vecinos de capa 2.

## Acceso remoto seguro para proveedores e ingenieros

En muchas plantas, el acceso remoto es la mayor vía no controlada en: los fabricantes de máquinas lo necesitan para el soporte, y producción quiere ayuda rápida cuando una máquina se detiene. Prohibirlo rara vez funciona; la respuesta práctica es una única vía controlada que sea más fácil de usar que las soluciones alternativas.

En septiembre de 2026, CISA y el FBI publicaron una hoja informativa para los operadores de infraestructuras críticas que trabajan con integradores de ICS de terceros. Cita un análisis del FBI sobre una intrusión de 2025 en una empresa estadounidense de automatización y recomienda limitar el acceso de los integradores al mínimo necesario, incluir requisitos de ciberseguridad (incluidos el acceso remoto y la gestión de parches) en los contratos, reducir la exposición a internet de los dispositivos, y supervisar y registrar el acceso remoto, utilizando acceso bajo demanda siempre que sea posible [14].

### Requisitos para el acceso remoto (plantilla)

| Requisito | Detalle | 62443 FR |
|---|---|---|
| Una sola vía | Todas las sesiones remotas a través de una pasarela en la IDMZ; sin módems celulares, sin VPN de proveedores que terminen en zonas de producción | FR 5 |
| Cuentas personales | Una cuenta por persona, sin cuentas compartidas de proveedores | FR 1 |
| Autenticación multifactor | Para cada sesión remota | FR 1 |
| Aprobación por sesión | El contacto de la planta aprueba cada sesión; el acceso está desactivado por defecto | FR 2 |
| Mínimo privilegio | Acceso solo a los activos que el proveedor da soporte, durante el tiempo necesario | FR 2 |
| Grabación y registro de sesiones | Grabadas y conservadas durante un período definido | FR 6 |
| Supervisión de cambios | Cambios de lógica solo con un ingeniero de planta presente y una orden de trabajo | FR 3 |
| Transferencia de archivos | Archivos solo a través de una zona de transferencia escaneada | FR 3 |
| Contrato | Normas de acceso remoto, obligaciones de notificación y responsabilidad en el contrato de servicio | 2-4 |

### Consejos prácticos

- **Haga que la vía segura sea más fácil que la insegura.** Si la aprobación tarda dos horas por la noche, alguien conectará un router celular. Defina un aprobador de guardia por turno.
- **Elimine los equipos sobrantes.** Cuente cada dispositivo de acceso remoto en el inventario y elimine o desactive los que no pasen por la pasarela. Muchos fabricantes de máquinas entregan las líneas con su propio router; inclúyalo en la especificación de compra (sección 17).
- **Revise las cuentas trimestralmente.** Elimine las cuentas del personal del proveedor que ya no trabaje allí.

## Gestión de parches y vulnerabilidades en OT

En la TI de oficina, la regla es "parchear rápido". En OT, la regla es "decidir con deliberación". Un parche puede requerir la aprobación del proveedor, un reinicio del controlador, una revalidación en industrias reguladas o una prueba completa de la línea. En plantas reguladas por la FDA (farmacéutica, dispositivos médicos, alimentos) y bajo los requisitos de clientes del sector automotriz o aeroespacial, un cambio en un sistema validado normalmente activa su procedimiento de control de cambios y validación; planifique el tiempo de revisión del equipo de calidad dentro de la ventana de parcheo. ISA-TR62443-2-3 cubre la gestión de parches en el entorno IACS [1].

### Fuentes de información sobre vulnerabilidades

- Avisos de seguridad de los proveedores y portales de seguridad de producto de sus PLC, HMI, variadores y proveedores de software.
- Los avisos ICS de CISA, que publican vulnerabilidades de productos industriales, a menudo coordinadas con los proveedores [unverified as to current volume; check the CISA advisories page] (no verificado en cuanto al volumen actual; consulte la página de avisos de CISA).
- Su herramienta de monitoreo OT, que compara las versiones de firmware del inventario con los avisos.

### Una tabla de decisión para cada aviso

| Pregunta | Si | No |
|---|---|---|
| ¿El producto afectado está en nuestro inventario? | Continuar | Cerrar, documentar |
| ¿La función vulnerable se usa o es alcanzable en nuestra configuración? | Continuar | Documentar el motivo; revisar en el próximo cambio |
| ¿Se sabe que está siendo explotada o existe un exploit público? | Prioridad alta | Prioridad según la puntuación de consecuencias |
| ¿Se puede acceder al activo desde una zona de menor confianza o de forma remota? | Prioridad alta | Prioridad media |
| ¿El proveedor aprueba el parche para nuestra versión? | Planificar el parche en la próxima ventana | Aplicar medidas compensatorias |
| ¿El parche puede aplicarse sin parada? | Programar en mantenimiento normal | Programar en parada planificada |

### Medidas compensatorias cuando no puede parchear

Cuando el parche no está disponible, no está aprobado o no es posible antes de la próxima parada:

- Restrinja el conducto: permita solo los hosts y protocolos que necesita el activo.
- Deshabilite los servicios y puertos no utilizados.
- Coloque el selector de llave del controlador en RUN para bloquear las modificaciones remotas de programa cuando el controlador lo permita.
- Aumente el monitoreo del activo (alertas por nuevas conexiones o descargas de programa).
- Documente el riesgo residual y obtenga la aprobación del responsable del activo.

### Ejemplo de decisión

Un aviso describe una vulnerabilidad de denegación de servicio explotable de forma remota en el servidor web del modelo de PLC usado en el control de la prensa Z3. El inventario muestra cuatro PLC afectados. El servidor web está habilitado pero no se usa. La corrección de firmware está disponible, pero requiere un reinicio del controlador y el proveedor recomienda una prueba funcional. Decisión: deshabilitar el servidor web en los cuatro PLC durante la próxima ventana de fin de semana (30 minutos por prensa), bloquear HTTP y HTTPS hacia los PLC en el conducto C4, e instalar el firmware en la parada planificada dentro de ocho semanas. El riesgo provisional queda documentado y aprobado por el gerente de ingeniería de planta.

### Sistemas heredados y al final de su vida útil

Toda planta tiene sistemas que nunca recibirán otro parche: HMI con versiones de Windows sin soporte, controladores cuyo proveedor los ha descontinuado. Trátelos como un problema de ciclo de vida con presupuesto, no como una excepción de seguridad que se renueva indefinidamente. El campo de inventario "estado de soporte del proveedor" alimenta un plan de reemplazo alineado con las reconstrucciones de línea y la planificación de inversiones de capital.

## Cuentas, endurecimiento y medios extraíbles

FR 1 a FR 3 son donde las plantas tienen las brechas más visibles y las soluciones más baratas.

### Cuentas e identidades

- **Retire los inicios de sesión compartidos cuando el sistema lo permita.** Las cuentas "Operator", "maint" y "admin" compartidas por todo un turno hacen que cualquier cambio sea imposible de rastrear. Muchos HMI y sistemas SCADA actuales admiten cuentas nominales o inicio de sesión con credencial; los más antiguos quizá no.
- **Separe las cuentas de administrador.** Los ingenieros usan una cuenta normal para el correo electrónico y otra distinta para la administración OT, nunca la misma.
- **Cambie las contraseñas predeterminadas** en todos los dispositivos que las tengan: switches, routers, HMI, controladores de robots, cámaras. Hágalo un elemento de la lista de verificación de puesta en marcha.
- **Use MFA donde una persona inicie sesión de forma remota o en la IDMZ.** En el piso de planta, el MFA en un HMI suele resultar impracticable; compénselo con control de acceso físico y bloqueos de pantalla cortos donde el proceso lo permita.
- **Proteja la mesa de ayuda.** El caso de Clorox muestra que una llamada de ingeniería social a la mesa de ayuda de TI puede conducir a acceso privilegiado [20]. Exija verificación de identidad para los restablecimientos de contraseña y MFA, con comprobaciones más estrictas para las cuentas privilegiadas.

### Endurecimiento de sistemas OT basados en Windows

Los HMI, servidores SCADA, historiadores y estaciones de ingeniería son en su mayoría equipos Windows. Su endurecimiento sigue la guía del proveedor:

1. Elimine el software y los servicios que el sistema no necesita (mínima función).
2. Use listas blancas de aplicaciones en lugar de, o además de, el antivirus, cuando el proveedor lo admita.
3. Deshabilite o restrinja los puertos USB.
4. Restrinja los derechos de administrador local.
5. Mantenga una imagen en buen estado conocido y los medios de instalación para una reconstrucción rápida.

### Controladores

- Mantenga el interruptor de llave o la protección por software en RUN cuando el controlador lo ofrezca, y registre cada cambio al modo PROGRAM.
- Guarde la lógica vigente fuera de línea y compare sumas de verificación o versiones del proyecto con regularidad para detectar cambios no autorizados (FR 3).
- Deshabilite los servicios no utilizados (servidores web, FTP, acceso de escritura SNMP).

### Medios extraíbles

Las memorias USB y los portátiles introducen malware en cada límite de red. Un conjunto simple de reglas:

| Regla | Implementación |
|---|---|
| Sin medios privados | Política escrita, formación, señalización en las estaciones |
| Analizar antes de usar | Un quiosco de análisis en la entrada de la planta o en la IDMZ |
| Solo medios de la empresa | Memorias USB cifradas e inventariadas para ingeniería |
| Preferir la vía de red | Transferencia de archivos a través del servidor IDMZ en lugar de USB |
| Aplicación técnica | Puertos USB deshabilitados o restringidos por política en HMI y servidores |

## Monitorización y detección

FR 6 (respuesta oportuna a eventos) exige que usted detecte los incidentes. En OT, la detección tiene dos fuentes: los registros (logs) y el tráfico de red.

### Qué registrar

| Fuente | Eventos | Uso |
|---|---|---|
| Cortafuegos en los conductos | Conexiones permitidas y denegadas | Tráfico inesperado entre zonas |
| Pasarela de acceso remoto | Inicios de sesión, aprobaciones, grabaciones de sesión | Revisión de la actividad de proveedores |
| Active Directory de OT y hosts de salto | Inicios de sesión, cambios de privilegios, cuentas nuevas | Uso indebido de cuentas |
| Estaciones de ingeniería | Arranques de software, descargas de proyectos | Cambios no autorizados de lógica |
| Controladores (cuando sea compatible) | Cambios de modo, descargas de programas, actualizaciones de firmware | Integridad |
| Sistema de copias de seguridad | Éxito y fallo de los trabajos | Preparación para la recuperación |

### Monitorización pasiva de la red OT

Las herramientas especializadas de monitorización OT decodifican los protocolos industriales y aprenden el patrón normal de comunicación de una planta. A continuación generan alertas ante desviaciones: un dispositivo nuevo, una conexión nueva entre zonas, una descarga de programa fuera de una ventana de mantenimiento o un comando enviado desde un equipo inusual. Como solo escuchan tráfico copiado, no afectan al proceso. El borrador NIST SP 800-82 Rev. 4 amplía su guía sobre monitorización y detección de red [10].

### Quién vigila las alertas

Una alerta que nadie lee es un coste sin beneficio. Opciones para una planta de tamaño medio:

- **Centro de operaciones de seguridad (SOC) corporativo** con un playbook OT y un ingeniero de control designado de guardia en la planta.
- **Servicio de detección gestionada** de un proveedor con experiencia en OT.
- **Revisión a nivel de planta** de un número reducido de alertas de alto valor (dispositivo nuevo, descarga de programa, sesión remota fuera de lo aprobado), reenviando el resto al SOC.

Sea cual sea la opción, defina quién puede tomar qué acción. Un analista del SOC nunca debería poder parar una línea por su cuenta; el playbook establece quién decide.

## Copias de seguridad, recuperación y respuesta a incidentes en OT

FR 7 (disponibilidad de recursos) y las funciones "Respond" y "Recover" de CSF 2.0 confluyen aquí [11]. El caso de Norsk Hydro es el ejemplo clásico: la empresa mantuvo gran parte de la producción en marcha con procedimientos manuales y más tarde estimó su coste total en unos 800 millones de NOK [17].

### Qué copiar

| Elemento | Frecuencia | Almacenamiento | Prueba de restauración |
|---|---|---|---|
| Programas de PLC, PLC de seguridad y robots | Tras cada cambio y mensualmente | Copia offline y fuera de las instalaciones | Anualmente por controlador crítico, en un repuesto o simulador |
| Proyectos de HMI y SCADA | Tras cada cambio | Offline y fuera de las instalaciones | Anualmente |
| Imágenes de servidores (MES, historiador, SCADA, controlador de dominio OT) | Completa semanal, incremental diaria | Copia inmutable u offline | Dos veces al año, reconstrucción completa de un servidor |
| Configuraciones de dispositivos de red | Tras cada cambio | Offline | Anualmente |
| Firmware y medios de instalación | Al actualizarse | Biblioteca offline | Verificar que esté completa anualmente |
| Documentación (planos, modelo de zonas, inventario, exportación de la bóveda de contraseñas) | Mensualmente | Offline, copia impresa de lo esencial | Verificar durante un ejercicio de mesa |

### El playbook de incidentes OT

Un playbook OT se diferencia de uno de TI en quién decide y qué va primero.

| Fase | Contenido específico de OT |
|---|---|
| Preparación | Lista de contactos que incluya a fabricantes de máquinas y proveedores de control; derechos de decisión; portátil de ingeniería de repuesto con imágenes limpias; procedimientos de operación manual por área |
| Detección y análisis | Llamada conjunta de seguridad de TI, responsable de control y jefe de producción en un plazo definido; primera pregunta: ¿se ve afectada la seguridad? |
| Contención | Opciones acordadas de antemano: desconectar la empresa del IDMZ, desconectar el IDMZ de la planta, aislar zonas concretas. Quién puede desconectar qué, y con qué riesgo para la producción |
| Estado seguro | La seguridad de procesos decide si se sigue funcionando, se opera en manual o se para de forma segura; nunca se desactivan los sistemas de seguridad para "ayudar" a la recuperación |
| Erradicación y recuperación | Reconstruir desde imágenes conocidas como buenas; verificar la lógica de los controladores contra copias offline antes del rearranque; rearranque escalonado por zona |
| Notificación | Legal y comunicación: evaluación de materialidad ante la SEC para empresas cotizadas, notificaciones a clientes, aseguradora, cuerpos de seguridad, informes NIS2 o CRA para obligaciones en la UE (sección 19) |
| Lecciones aprendidas | Causa raíz, modelo de zonas y playbook actualizados |

### Practíquelo

Realice un ejercicio de mesa al menos una vez al año con producción, mantenimiento, TI, EHS, comunicaciones y dirección. Un primer escenario útil: "Un ransomware ha cifrado el MES y el ERP. Las líneas siguen funcionando. ¿Seguimos produciendo y cómo registramos lo que fabricamos y expedimos?" La respuesta revela si existen procedimientos manuales de contingencia.

Las CISA CPGs enfatizan la gobernanza y las prácticas fundamentales medibles, incluida la planificación de la respuesta a incidentes; la CPG 2.0 añadió un componente de gobernanza en diciembre de 2025 [13].

## Requisitos para proveedores y compras

La mayor parte del nivel de seguridad de una planta se compra, no se construye. Cada nueva máquina, línea y sistema de control es una oportunidad para elevarlo. La norma 62443 le proporciona el vocabulario para la especificación de compra: 4-1 y 4-2 para productos, 2-4 para integradores y proveedores de servicios, y 3-3 para el sistema entregado.

### Certificación que puede solicitar

ISASecure, una subsidiaria de propiedad total de ISA fundada en 2007, gestiona programas de certificación basados en la 62443 [7]:

| Programa | Qué se certifica | Basado en |
|---|---|---|
| ISASecure CSA | Componentes (controladores, HMI, dispositivos de red, software) | IEC 62443-4-2 [7] |
| ISASecure SSA | Sistemas | IEC 62443-3-3 [7] |
| ISASecure SDLA | El ciclo de vida de desarrollo seguro de un proveedor | IEC 62443-4-1 [7] |
| ISASecure ACSSA | Un IACS en operación en una planta: políticas, procedimientos, proveedores de servicios y controles técnicos, comenzando con la evaluación de riesgos del propietario del activo | IEC 62443-2-1, 2-4, 3-2 y 3-3; anunciado el 18 de junio de 2025 [8] |

También existen certificados de otros esquemas de evaluación de la conformidad (el programa de ciberseguridad IECEE de la IEC es la principal alternativa a ISASecure, como describe un documento técnico de ISA publicado por ISA [37]). Un certificado es una evidencia, no una garantía: verifique la versión del producto certificado y el nivel de seguridad frente a lo que va a comprar.

### Cláusulas para la especificación de compra (plantilla)

| Tema | Requisito de ejemplo |
|---|---|
| Norma | El proveedor cumple con IEC 62443-4-1 (producto) e IEC 62443-2-4 (integración) en la edición vigente a la fecha del pedido; evidencia: certificado o autoevaluación frente a los requisitos indicados |
| Nivel de seguridad | Los componentes y el sistema entregado cumplen SL-C 2 (SL-C 3 para las zonas Z4, Z8) según IEC 62443-4-2 / 3-3 |
| Encaje en zonas | Máquina entregada como una zona con una interfaz de conducto definida; lista documentada de todos los puertos, protocolos y servicios |
| Acceso remoto | Sin módems ni routers integrados; soporte remoto solo a través de la pasarela del propietario del activo |
| Cuentas | Cuentas de usuario nominativas con derechos basados en roles; sin cuentas codificadas o no documentadas; contraseñas predeterminadas cambiadas en la puesta en marcha |
| Endurecimiento | Servicios no utilizados deshabilitados; guía de endurecimiento entregada |
| Parches | El proveedor publica avisos de seguridad, prueba los parches de SO y firmware en un plazo indicado y da soporte al producto durante un periodo establecido |
| SBOM | Lista de materiales de software (SBOM) para el software y firmware entregados |
| Copias de seguridad | Programas y proyectos entregados en formato editable, con instrucciones de restauración |
| Documentación | Diagrama de red, lista de activos en la plantilla del propietario del activo, requisitos de reglas de cortafuegos |
| Pruebas | Prueba de aceptación de seguridad (escaneo de puertos en un entorno de prueba, revisión de cuentas) como parte de las pruebas de aceptación en fábrica y en planta |
| Obligaciones ante incidentes | El proveedor notifica al propietario del activo las vulnerabilidades e incidentes que afecten al sistema entregado en un plazo indicado |

La CRA (sección 19) convierte varios de estos requisitos en obligaciones legales para los productos comercializados en el mercado de la UE, incluidas las actualizaciones de seguridad y un SBOM [22][23]. Los compradores estadounidenses se benefician de ello incluso en plantas solo de EE. UU., porque los mismos productos se venden en todo el mundo.

### Integradores y proveedores de servicios

La hoja informativa de CISA/FBI para integradores de septiembre de 2026 añade la perspectiva del operador: incluya los requisitos de ciberseguridad y de cadena de suministro en los contratos y acuerdos de servicio, defina dónde se alojan los datos y dispositivos, y limite y supervise el acceso de los integradores [14]. Solicite a los proveedores de servicios sus evidencias conforme a la 62443-2-4, y revise su acceso remoto y el manejo de datos como revisaría el programa de seguridad de un contratista.

## Personas, seguridad y piso de planta

La seguridad OT fracasa cuando se diseña en la oficina de TI y se impone en el piso de planta. Las personas que operan las máquinas son, a la vez, la primera línea de defensa y las primeras en sufrir los controles mal diseñados.

### Roles y responsabilidades (ejemplo para una planta de tamaño medio)

| Rol | Responsabilidad de seguridad OT |
|---|---|
| Gerente de planta | Propietario del activo; aprueba las evaluaciones de riesgo y los riesgos residuales; es responsable del presupuesto |
| Responsable de seguridad OT (a menudo un ingeniero de control, a tiempo parcial al principio) | Modelo de zonas, inventario, reglas, coordinación de incidentes |
| Seguridad de TI corporativa / CISO | Zona empresarial, identidad, SOC, políticas, alineación con CSF 2.0 |
| Ingeniería de control | Configuración segura, copias de seguridad, control de cambios de lógica |
| Mantenimiento | Acceso físico, reglas para medios extraíbles, repuestos |
| EHS / seguridad de procesos | Vincula PHA/HAZOP con las consecuencias de seguridad; firma las zonas de seguridad |
| Compras | Cláusulas de seguridad en especificaciones y contratos |
| Supervisores de producción y operadores | Informan anomalías, cumplen las reglas de acceso y medios, ejecutan el respaldo manual |

### Seguridad y ciberseguridad juntas

Los ingenieros de seguridad industrial y los de ciberseguridad suelen usar palabras distintas para cosas similares: peligros y amenazas, SIL y SL, PHA y evaluación de riesgos. Reúnanlos en la misma mesa. Hay dos reglas no negociables:

- Las medidas de seguridad informática nunca deben deshabilitar ni degradar una función de seguridad.
- La respuesta a un incidente de seguridad nunca debe eludir la decisión del equipo de seguridad industrial sobre el estado seguro.

### Formación que los operadores aceptan

- Haga que reportar sea seguro. Un operador que admite haber conectado el cargador de su teléfono debe recibir agradecimiento, no una sanción; de lo contrario, el siguiente incidente no se reportará.
- Módulos cortos y específicos por rol: qué debe reportar un operador (memorias USB desconocidas, comportamiento inesperado del HMI, personas extrañas que piden acceso), no un curso genérico sobre phishing.
- Explique el porqué. Los operadores entienden el bloqueo y etiquetado (LOTO) porque saben qué previene. Las reglas de seguridad informática necesitan la misma explicación.
- Involucre a la plantilla en el diseño de los controles que la afectan, como el inicio de sesión con credencial en los HMI o el bloqueo de pantallas. En plantas sindicalizadas, los cambios en las normas laborales o en la supervisión pueden requerir negociación con el sindicato; involucre a RR. HH. y a relaciones laborales desde el principio [orientación general; verifique su convenio colectivo].

Para la rutina más amplia de resolución diaria de problemas en el piso de planta, consulte la guía sobre [gestión del piso de planta](https://www.m365.fm/en/learn/shop-floor-management/); una anomalía de seguridad es un punto más para la reunión diaria del nivel de equipo.

## Obligaciones en EE. UU. y la UE: CMMC, SEC, CIRCIA, NIS2 y la CRA

62443 en sí es voluntaria. Las obligaciones que se indican a continuación no lo son. Cuáles le aplican depende de sus clientes, de su estructura de propiedad y de los lugares donde venda.

### CMMC 2.0 para proveedores de defensa

Si fabrica piezas para el Departamento de Defensa de EE. UU., el Modelo de Madurez de Certificación de Ciberseguridad (CMMC, por sus siglas en inglés) se aplica a los sistemas que procesan, almacenan o transmiten Información Federal de Contratos (FCI) o Información No Clasificada Controlada (CUI). La norma del programa (32 CFR Parte 170) entró en vigor el 16 de diciembre de 2024 [28]. La norma DFARS que incorpora el CMMC a los contratos entró en vigor el 10 de noviembre de 2025, con una implantación por fases a lo largo de tres años: la fase 2 comenzó el 10 de noviembre de 2026 y la fase 3 está prevista para el 10 de noviembre de 2027 [29]. El Nivel 2 se basa en NIST SP 800-171 [28][29].

Lo que esto significa en la planta:

- **El alcance depende de los datos, no de las máquinas.** Una máquina CNC que recibe planos o programas marcados como CUI puede estar dentro del alcance. Un controlador que solo acciona una cinta transportadora normalmente no lo está. Deciden las marcas CUI y el contrato.
- **Use zonas para limitar el alcance.** Un modelo de zonas bien segmentado puede mantener pequeño el perímetro de evaluación del CMMC. Es uno de los argumentos económicos más claros a favor de la segmentación en las cadenas de suministro de defensa.
- **Casos especiales.** Para el Nivel 2, 32 CFR 170.19(c)(1) enumera los dispositivos OT, IIoT e IoT, los equipos de prueba, el equipo suministrado por el gobierno y los sistemas de información restringidos como "Activos Especializados": activos que pueden procesar, almacenar o transmitir CUI pero que no pueden protegerse por completo. Deben figurar en el inventario de activos, en el SSP, gestionarse con sus políticas de seguridad basadas en riesgo y aparecer en el diagrama de red; el evaluador revisa el SSP, pero no los evalúa frente a los demás requisitos del CMMC [38].

Para el lado de la planificación del trabajo de defensa, la [guía de planificación de producción aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/) cubre el CMMC, el ITAR y el DFARS en el contexto de las cadenas de suministro AS9100.

### Normas de la SEC para empresas que cotizan en bolsa

Según las normas de la SEC aprobadas el 26 de julio de 2023, los registrantes deben divulgar un incidente de ciberseguridad significativo en el Formulario 8-K en un plazo de cuatro días hábiles después de determinar que es significativo, y describir su gestión, estrategia y gobierno de los riesgos de ciberseguridad en el informe anual [26]. Un ataque de ransomware que detiene una planta es un caso típico para una evaluación de materialidad, por lo que el manual de OT necesita una vía rápida hacia el comité de divulgación.

### CIRCIA

La Ley de Notificación de Incidentes Cibernéticos para la Infraestructura Crítica exigirá a las entidades cubiertas informar a CISA de los incidentes cibernéticos cubiertos en un plazo de 72 horas y de los pagos de rescate en un plazo de 24 horas, una vez que entre en vigor la norma final de CISA. A octubre de 2026, la norma final había sido enviada a la Casa Blanca para su revisión y no había sido publicada [27]; el 9 de noviembre de 2026 seguía pendiente allí tras llegar el 1 de octubre de 2026 [39]. La fabricación crítica es un sector de infraestructura crítica [32], así que siga qué fabricantes incluye la norma final.

### NIS2 para empresas estadounidenses con sedes en la UE

La Directiva NIS2 de la UE se aplica a través de las leyes nacionales a las entidades esenciales e importantes de la UE, incluidos muchos sectores manufactureros. Una empresa estadounidense se ve afectada a través de sus filiales y plantas en la UE. La ley de transposición alemana entró en vigor el 6 de diciembre de 2025; la Oficina Federal para la Seguridad de la Información (BSI) de Alemania afirma que ahora supervisa unas 29.500 entidades en lugar de unas 4.500 [24]. En Alemania, las empresas están dentro del alcance si pertenecen a los tipos de entidad enumerados y tienen al menos 50 empleados o más de 10 millones de euros tanto en facturación anual como en total de balance; las entradas manufactureras incluyen los productos sanitarios, los ordenadores y la electrónica, los equipos eléctricos, la maquinaria y los vehículos [25][40]. Los incidentes significativos requieren una alerta temprana en un plazo de 24 horas, una notificación en un plazo de 72 horas y un informe final en un plazo de un mes [25]. Otros Estados miembros tienen normas similares con detalles locales; compruebe cada país en el que tenga una planta.

### Cyber Resilience Act para fabricantes de máquinas y de componentes

Si vende máquinas, controladores o software con elementos digitales en el mercado de la UE, se aplica el Cyber Resilience Act (Reglamento (UE) 2024/2847), incluidos los fabricantes estadounidenses. Desde el 11 de septiembre de 2026, los fabricantes deben notificar las vulnerabilidades explotadas activamente y los incidentes graves a través de la Plataforma Única de Notificación de ENISA: una alerta temprana en un plazo de 24 horas, una notificación en un plazo de 72 horas y un informe final en un plazo de 14 días después de que esté disponible una medida correctiva (vulnerabilidades) o en un plazo de un mes (incidentes) [22]. Los principales requisitos de producto se aplican a partir del 11 de diciembre de 2027 [23]. Para los fabricantes de máquinas, esto convierte el desarrollo seguro al estilo de IEC 62443-4-1 en cumplimiento de producto.

### Ciberseguro

Las aseguradoras preguntan cada vez más en detalle por la OT: segmentación, acceso remoto, copias de seguridad fuera de línea, MFA. El caso Merck muestra cuánto puede depender de la redacción de la póliza; un tribunal de apelación de Nueva Jersey dictaminó que la cláusula de exclusión por guerra de las pólizas de daños de Merck no se aplicaba a NotPetya, antes de que las partes llegaran a un acuerdo [18]. Revise con su corredor si sus pólizas cubren las pérdidas de producción derivadas de eventos cibernéticos y en qué condiciones [orientación general].

## Una hoja de ruta de 12 a 24 meses

La hoja de ruta siguiente es para un único centro de tamaño medio como el de la sección 9, con un responsable de seguridad OT de aproximadamente media jornada en el año 1 (nuestra suposición de planificación), apoyo del departamento corporativo de TI y un socio externo para tareas específicas, como el taller de evaluación de riesgos y el diseño de la segmentación. Las empresas con varios centros ejecutan la fase 0 de forma centralizada y las fases 1 a 4 por centro, empezando por la planta con mayor riesgo o con más proyectos de inversión previstos.

| Fase | Meses | Objetivos | Entregables principales | Ancla 62443 / CSF |
|---|---|---|---|---|
| 0. Mandato | 0-1 | Responsabilidad y alcance | Responsable de activos y responsable de seguridad OT designados, comité directivo, alcance del primer sistema a considerar, presupuesto del año 1 | 2-1; CSF Govern |
| 1. Conocer y frenar la hemorragia | 1-6 | Visibilidad y reducción rápida del riesgo | Inventario de activos (primera versión), mapa de tráfico, lista de rutas de acceso remoto; eliminar o canalizar el acceso remoto no controlado; copias de seguridad fuera de línea de toda la lógica de los controladores; contraseñas por defecto cambiadas; reglas para medios extraíbles; primer ejercicio de mesa | 3-2 ZCR 1-2; CSF Identify, Protect |
| 2. Arquitectura | 4-12 | Contención | Modelo de zonas y conductos con SL-T, aprobado por el responsable de activos; IDMZ construida; tráfico entre empresa y planta solo a través de la IDMZ; pasarela de acceso remoto con MFA y registro; separación de dominios o cuentas OT | 3-2 ZCR 3-7; 3-3 FR 5; CSF Protect |
| 3. Detectar y responder | 9-18 | Ver y reaccionar | Monitorización pasiva de OT en los conductos clave; recopilación de registros; playbook del SOC con derechos de decisión; playbook escrito de incidentes OT; pruebas de restauración | 3-3 FR 6, FR 7; CSF Detect, Respond, Recover |
| 4. Endurecer y comprar bien | 12-24 | Elevar el SL-A, evitar nuevas brechas | Segmentación interna completada; endurecimiento de los sistemas Windows de OT; proceso de decisión de parches en funcionamiento; cláusulas de seguridad en todas las especificaciones de compra nuevas; requisitos a integradores según 2-4; informes de KPI a la dirección | 2-3, 2-4, 4-1, 4-2; CSF Govern |
| 5. Operar y mejorar | desde el 24 | Programa en funcionamiento | Actualización anual de la evaluación de riesgos, ejercicio de mesa anual, auditoría interna, evaluación opcional ACSSA u otra evaluación del centro | 2-1; CSF todas las funciones |

### Qué hacer en los primeros 30 días

1. Designe al responsable de activos (normalmente el director de planta) y al responsable de seguridad OT.
2. Enumere todas las rutas de acceso remoto que conozca y pregunte a cada fabricante de máquinas cómo se conecta.
3. Compruebe si dispone de copias fuera de línea de los programas actuales de sus controladores más críticos.
4. Averigüe si la red de oficinas y la red de planta están enrutadas entre sí sin cortafuegos.
5. Pida a NIST MEP o a su equipo corporativo de seguridad una autoevaluación basada en CSF [30].
6. Programe una mesa de dos horas con el escenario "MES y ERP cifrados".

Ninguno de estos pasos necesita tecnología nueva. Producen los hechos sobre los que se basa el presupuesto de la fase 2.

### Encajar la hoja de ruta en la realidad de la planta

- **Aproveche las paradas planificadas.** La segmentación y los cambios de firmware necesitan ventanas; planifíquelos con un año de antelación junto con mantenimiento.
- **Apóyese en los proyectos de inversión.** Una nueva línea es el momento más económico para construir una zona limpia con acceso remoto seguro y cuentas nominales.
- **No empiece por la herramienta.** Comprar una plataforma de monitorización antes de que existan el inventario y el modelo de zonas produce alertas que nadie puede interpretar.

## Presupuesto y ROI: cómo justificar la inversión

La seguridad de OT no genera ingresos. Reduce la probabilidad y el impacto de una pérdida. Por lo tanto, el caso se compone de tres partes: la pérdida esperada evitada, el valor habilitador y las obligaciones.

### Categorías de costos

| Categoría | Partidas típicas | Capex u opex |
|---|---|---|
| Arquitectura | Cortafuegos para la IDMZ y los conductos, switches gestionados, servidores de la IDMZ, pasarela de acceso remoto | Principalmente capex (hardware), opex para suscripciones |
| Visibilidad | Plataforma de monitorización de OT, sensores, TAPs de red | Capex o suscripción |
| Personas | Responsable de seguridad de OT (a tiempo parcial o completo), formación, especialistas externos | Opex |
| Servicios | Apoyo en la evaluación de riesgos, diseño de segmentación, SOC o detección gestionada | Opex |
| Reemplazo | Actualización de HMI y controladores al final de su vida útil | Capex, idealmente dentro de las reconstrucciones de línea |
| Recuperación | Sistemas de respaldo, estaciones de ingeniería de repuesto, controladores de repuesto | Capex |

No damos aquí cifras genéricas en dólares porque ninguna fuente verificable de EE. UU. ofrece un referente fiable para una planta de un tamaño determinado; los precios dependen del número de zonas, la antigüedad de los equipos y los fabricantes. Obtenga dos o tres ofertas acotadas después de la fase 1.

### Pérdida esperada: un ejemplo trabajado

La pérdida anual esperada (ALE, por sus siglas en inglés) es una forma sencilla de expresar el riesgo en el lenguaje del equipo financiero:

ALE = tasa anual de ocurrencia (ARO) x pérdida esperada por evento (SLE)

Para Midwest Components (sección 9), el equipo de finanzas y operaciones estima el costo de un evento de ransomware que detiene la planta:

| Partida | Supuesto | Importe |
|---|---|---|
| Margen de contribución perdido | 10 días de producción x 160 000 $ de margen de contribución por día | 1 600 000 $ |
| Horas extra y aceleración para recuperar el retraso | Estimación | 350 000 $ |
| Chatarra y retrabajo por lotes interrumpidos | Estimación | 120 000 $ |
| Servicios de respuesta a incidentes y recuperación | Estimación | 400 000 $ |
| Penalizaciones a clientes | Condiciones contractuales con dos clientes OEM | 250 000 $ |
| **SLE (pérdida esperada por evento)** | | **2 720 000 $** |

Sin el programa, el equipo estima la probabilidad anual de un evento de este tipo en un 10 % (ARO 0,10); con las fases 1 a 3 completadas, espera que el evento sea tanto menos probable (ARO 0,04, porque la segmentación y el acceso remoto controlado cierran las vías más comunes) como más corto (5 días en lugar de 10, porque las copias de seguridad y los planes de respuesta se prueban), lo que reduce el SLE a unos 1 640 000 $ (5 días x 160 000 $ = 800 000 $, la mitad de las horas extra a 175 000 $, la chatarra sin cambios de 120 000 $, costos de respuesta de 300 000 $ y penalizaciones sin cambios de 250 000 $, redondeado).

- ALE antes: 0,10 x 2 720 000 $ = 272 000 $ al año
- ALE después: 0,04 x 1 640 000 $ = 65 600 $ al año
- Reducción del riesgo: 272 000 $ - 65 600 $ = 206 400 $ al año

Si el programa cuesta 450 000 $ en dos años más 120 000 $ anuales de costos de funcionamiento, el periodo de recuperación simple basado únicamente en la reducción del riesgo es: (450 000 $) / (206 400 $ - 120 000 $) = unos 5,2 años. Parece modesto, y debe presentarse con honestidad. Los supuestos son estimaciones; el ARO, en particular, es incierto. Presente un rango (por ejemplo, ARO de 0,05 a 0,20) y deje que la dirección vea cómo cambia el resultado. Con un ARO previo de 0,20 y posterior de 0,06, la reducción anual es 544 000 $ - 98 400 $ = 445 600 $, y el periodo de recuperación baja a unos 1,4 años.

Todas las cifras de este ejemplo son supuestos ilustrativos, no referentes del sector.

### Valor más allá de la evitación de pérdidas

- **Requisitos de clientes y contratos:** CMMC para trabajos de defensa [28][29], cuestionarios de seguridad de clientes OEM, obligaciones de la UE para sitios y productos en la UE [22][24].
- **Seguros:** mejores respuestas sobre segmentación, MFA y copias de seguridad afectan a la asegurabilidad y a las condiciones de la póliza [orientación general; consulte a su corredor].
- **Habilitar proyectos digitales:** un modelo limpio de IDMZ y conductos hace que los proyectos de MES, historiador y nube sean más rápidos y seguros de aprobar. Consulte [mantenimiento predictivo e IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/) y [gemelo digital en la fabricación](https://www.m365.fm/en/learn/digital-twin-manufacturing/) para los proyectos que dependen de ello.
- **Menos interrupciones autoinfligidas:** el inventario de activos, el control de cambios y las copias de seguridad probadas también acortan la recuperación de fallos ordinarios, como el fallo de un disco duro en una HMI.

### Capex y opex

Los cortafuegos y los servidores suelen capitalizarse; las suscripciones, los servicios gestionados y el personal son opex. Pasar a herramientas por suscripción desplaza el gasto de capex a opex, lo cual importa en plantas con un presupuesto de capital ajustado pero un presupuesto operativo flexible. Hable con el controller de la planta desde el principio sobre cómo se clasifica el programa; afecta a qué responsable presupuestario tiene que aprobarlo.

## KPI de seguridad OT

Mida unos pocos indicadores que impulsen el comportamiento. Infórmelos mensualmente al comité directivo y trimestralmente a la dirección. Para el diseño de KPI en general, consulte la guía sobre [KPI de fabricación](https://www.m365.fm/en/learn/manufacturing-kpis/).

| KPI | Fórmula | Objetivo de ejemplo | Por qué importa |
|---|---|---|---|
| Cobertura del inventario | Activos con todos los campos obligatorios completos / activos vistos por la monitorización x 100 | > 95% | Base de todo lo demás |
| Rutas de acceso remoto no controladas | Número de rutas remotas que no pasan por la pasarela | 0 | Vía de entrada más común |
| Zonas con SL-T aprobado | Zonas con evaluación de riesgo firmada / total de zonas x 100 | 100% | Demuestra que se aplica el método |
| Higiene de reglas de conducto | Reglas de cortafuegos con propietario, motivo y fecha de revisión válida / total de reglas x 100 | > 90% | Evita la proliferación de reglas |
| Controladores críticos con restauración probada | Controladores con restauración probada en los últimos 12 meses / controladores críticos x 100 | 100% | Preparación para la recuperación |
| Actualidad de las copias de seguridad | Controladores cuya copia de seguridad offline coincide con el programa en ejecución / total de controladores x 100 | > 98% | Detecta desviaciones y cambios no autorizados |
| Tiempo medio para decidir sobre avisos | Días medios desde la publicación del aviso hasta la decisión documentada | < 30 días | Demuestra que el proceso de parches funciona |
| Reducción de cuentas compartidas | Sistemas que aún usan inicios de sesión compartidos / sistemas en el alcance | Disminuye cada trimestre | Avance de FR 1 y FR 2 |
| Tiempo de triaje de alertas | Mediana del tiempo desde una alerta OT de alta prioridad hasta su triaje | < 1 hora | La detección es útil |
| Ejercicios de mesa | Ejercicios al año con presencia de producción | Al menos 1 | La respuesta se practica |
| Nuevos equipos con cláusulas de seguridad | Órdenes de compra de automatización con cláusulas 62443 / total de órdenes de compra de automatización x 100 | 100% | Evita nuevas brechas |

**Cálculo de ejemplo.** La monitorización ve 640 activos; 598 tienen todos los campos obligatorios. Cobertura del inventario = 598 / 640 x 100 = 93,4%. El objetivo no se alcanza por 1,6 puntos; acción: completar los 42 registros, sobre todo en el área de soldadura.

Evite métricas de vanidad como "número de conexiones bloqueadas". Un número creciente puede significar mejor protección o más configuraciones incorrectas.

## Errores comunes

1. **Copiar los controles de TI uno a uno.** El escaneo activo, la aplicación automática de parches y los agentes de endpoint en los controladores han provocado paradas de producción. Pruebe todo primero con el proveedor.
2. **Empezar por la compra de una herramienta.** Sin inventario y sin modelo de zonas, una plataforma de monitorización solo genera ruido.
3. **Una única zona gigante.** Un cortafuegos entre oficina y planta es necesario, pero una red de planta plana detrás de él permite que el malware llegue a todas las líneas.
4. **Demasiadas zonas.** Las reglas que nadie entiende se abren de par en par "temporalmente" y se quedan así.
5. **Ignorar los equipos de acceso remoto.** El router celular en un armario de máquina elude toda la arquitectura.
6. **Copias de seguridad que nunca se restauraron.** Muchas plantas descubren durante un incidente que la copia de seguridad está incompleta o es antigua.
7. **Sin derechos de decisión.** En un incidente, la pregunta "¿quién puede desconectar la planta?" debe tener ya una respuesta.
8. **Seguridad sin producción.** Los controles diseñados sin operadores ni personal de mantenimiento acaban siendo eludidos.
9. **Tratar IEC 62443 como un proyecto de certificación.** El valor está en el método y en la rutina continua, no en el papel.
10. **Olvidar la mesa de ayuda y la gestión de identidades.** El caso de Clorox demuestra que un proceso de restablecimiento de identidades puede ser el eslabón más débil [20].
11. **Comprar nuevas brechas.** Cada máquina pedida sin cláusulas de seguridad añade un problema heredado durante los próximos 20 años.
12. **Dar por hecho el "air gap".** La mayoría de las plantas que creen estar aisladas tienen al menos una conexión desconocida.

## Límites de IEC 62443 y de los programas de seguridad OT

62443 es el mejor marco disponible para la seguridad de la automatización industrial, pero tiene límites que conviene conocer antes de construir un programa sobre él.

- **Coste y acceso.** Los documentos son publicaciones de pago, y Industrial Cyber sitúa la serie completa en más de 800 páginas [34]. Las plantas pequeñas rara vez las leen enteras; las guías de inicio rápido y los consultores llenan el vacío, con calidad variable.
- **Antigüedad y revisión.** 3-3 data de 2013, y las segundas ediciones de 3-2, 3-3 y 4-2 siguen en elaboración [1][6]. Algunos temas (nube, IIoT, edge containerizado) solo se abordan en documentos PAS más recientes, como 1-6 [5].
- **Juicio, no fórmula.** La norma indica fijar el SL-T según el riesgo, pero no dice exactamente qué SL necesita una línea de prensas. Dos equipos cualificados pueden llegar a respuestas distintas.
- **Los niveles de seguridad no son garantías.** Un componente SL-C 3 mal configurado ofrece SL-A 1. La certificación cubre versiones y configuraciones concretas.
- **Realidad heredada.** Muchos sistemas instalados no pueden cumplir los requisitos de SL 2 para FR 1 y FR 2. Las medidas compensatorias funcionan, pero añaden complejidad.
- **Exigencia organizativa.** 2-1 y 2-4 requieren procesos documentados; ML 2 y superiores suponen un esfuerzo real para una planta pequeña y sus integradores.
- **Sin protección contra todo.** La segmentación y la monitorización reducen el riesgo; no impiden a un atacante decidido y con recursos. La capacidad de recuperación sigue siendo esencial.
- **Solapamiento entre marcos.** Relacionar 62443 con CSF 2.0, SP 800-82, CMMC y NIS2 requiere esfuerzo. El borrador de SP 800-82 Rev. 4, reestructurado en torno a CSF 2.0, debería facilitar el lado de NIST cuando sea definitivo [10].

## Glosario

| Término | Significado |
|---|---|
| ACSSA | Esquema de certificación ISASecure para sitios de operación, basado en 62443-2-1, 2-4, 3-2 y 3-3 [8] |
| ALE | Expectativa de pérdida anualizada = ARO x SLE |
| Propietario de activos | Organización responsable y con rendición de cuentas sobre el IACS [2] |
| ATT&CK for ICS | Base de conocimiento de MITRE sobre tácticas y técnicas de adversarios contra sistemas de control industrial [15] |
| Conducto | Agrupación lógica de canales de comunicación entre zonas que comparten requisitos de seguridad [2] |
| CPG | Metas de Desempeño en Ciberseguridad de CISA; versión 2.0 de diciembre de 2025 [13] |
| CRS | Especificación de requisitos de ciberseguridad, resultado de 62443-3-2 |
| CSA / SSA / SDLA | Certificaciones ISASecure para componentes (4-2), sistemas (3-3) y ciclos de vida de desarrollo (4-1) [7] |
| CSF 2.0 | Marco de Ciberseguridad 2.0 del NIST con seis funciones [11] |
| CUI / FCI | Información no clasificada controlada / Información federal de contratos (alcance de CMMC) |
| DCS | Sistema de control distribuido |
| Defensa en profundidad | Múltiples capas de protección para retrasar o impedir un ataque [2] |
| Funciones esenciales | Funciones necesarias para la salud, la seguridad, el medio ambiente y la disponibilidad del equipo controlado [2] |
| FR | Requisito fundamental; siete en 62443 (IAC, UC, SI, DC, RDF, TRE, RA) [2] |
| HMI | Interfaz hombre-máquina |
| IACS | Sistema de automatización y control industrial |
| IDMZ | Zona desmilitarizada industrial entre la empresa y la planta |
| IIoT | Internet industrial de las cosas |
| Nivel de madurez (ML) | Medida de la madurez de los procesos, ML 1 a ML 4 en 62443 [3] |
| MOC | Gestión del cambio |
| OT | Tecnología operativa: sistemas que interactúan con el entorno físico [9] |
| PLC | Controlador lógico programable |
| Modelo Purdue | Arquitectura de referencia por capas (niveles 0 a 5) utilizada para mapear redes de planta |
| SBOM | Lista de materiales de software |
| SCADA | Supervisión, control y adquisición de datos |
| SIS | Sistema instrumentado de seguridad |
| SL-T / SL-C / SL-A | Nivel de seguridad objetivo, de capacidad y alcanzado [2] |
| SUC | Sistema bajo consideración (62443-3-2) |
| Zona | Agrupación de activos según el riesgo u otros criterios [2] |

## Preguntas frecuentes: ciberseguridad OT e IEC 62443

### ¿Qué es la ciberseguridad OT?

La ciberseguridad OT protege los sistemas que supervisan y controlan procesos físicos, como PLC, SCADA, HMI, robots y sistemas de seguridad, contra la interrupción y la manipulación. Sus prioridades son primero la seguridad y la disponibilidad, y después la integridad y la confidencialidad. La NIST SP 800-82 Rev. 3 es la principal guía de Estados Unidos [9].

### ¿Cuál es la diferencia entre la seguridad de TI y la de OT?

La seguridad de TI protege los datos y los sistemas empresariales, normalmente dando prioridad a la confidencialidad. La seguridad de OT protege los procesos físicos, donde un control que falla puede lesionar a personas o detener la producción. Los sistemas OT tienen una vida útil más larga, son más difíciles de parchear, a menudo usan protocolos sin autenticación y solo cambian en ventanas de tiempo planificadas (sección 2).

### ¿Qué es ISA/IEC 62443?

Una serie de normas internacionales para la seguridad de los sistemas de automatización y control industrial, desarrollada por el comité ISA99 y la IEC. Se organiza en cuatro grupos (general, políticas y procedimientos, sistema y componente) y define roles, zonas y conductos, niveles de seguridad y requisitos fundamentales [1][2].

### ¿Cuál es la diferencia entre la seguridad OT y la seguridad ICS?

En el uso cotidiano, ninguna. La seguridad ICS es el término más antiguo y se refiere a los sistemas de control industrial como PLC, DCS y SCADA. La seguridad OT es más amplia y también abarca la automatización de edificios, el transporte y los sistemas de acceso físico, tal como la NIST SP 800-82 Rev. 3 define OT [9]. La seguridad IIoT es la parte que trata los sensores y pasarelas conectados que envían datos a plataformas de borde o en la nube; la IEC PAS 62443-1-6 aplica la serie 62443 a IIoT [5].

### ¿Cuáles son los roles en IEC 62443?

El propietario de activos (responsable del IACS), el proveedor de servicios de integración, el proveedor de servicios de mantenimiento y el proveedor de productos [2]. Cada rol tiene sus propias partes de la serie, lo que permite redactar contratos claros (sección 5).

### ¿Es obligatoria la IEC 62443 en Estados Unidos?

No existe ninguna ley estadounidense que exija en general la 62443. Se vuelve vinculante a través de contratos con clientes, especificaciones de compra, condiciones de seguros o normas sectoriales. Leyes de la UE como la CRA crean obligaciones que los procesos basados en la 62443 ayudan a cumplir [22].

### ¿Cuáles son los niveles de seguridad en IEC 62443?

SL 1 protege contra la violación casual o accidental, SL 2 contra la violación intencionada con medios simples, SL 3 contra atacantes sofisticados con habilidades específicas de IACS y recursos moderados, y SL 4 contra atacantes sofisticados con recursos ampliados y alta motivación [2]. Cada zona recibe un nivel objetivo, a menudo por requisito fundamental.

### ¿Cuáles son los siete requisitos fundamentales de IEC 62443?

Control de identificación y autenticación, control de uso, integridad del sistema, confidencialidad de los datos, flujo de datos restringido, respuesta oportuna a eventos y disponibilidad de recursos [2].

### ¿Qué son las zonas y los conductos?

Una zona agrupa activos con requisitos de seguridad similares; un conducto agrupa los canales de comunicación entre zonas y contiene los controles para ese tráfico [2]. La sección 9 muestra un ejemplo completo para una planta de tamaño medio.

### ¿Con qué parte de IEC 62443 debe empezar un propietario de activos?

Con 62443-2-1 para el programa de seguridad y con 62443-3-2 para la evaluación de riesgos y el modelo de zonas. 3-3 define después los requisitos del sistema por nivel de seguridad, y 2-4 y 4-1/4-2 entran en los contratos con integradores y proveedores [1].

### ¿Cómo se relaciona IEC 62443 con el Marco de Ciberseguridad del NIST?

Se complementan. CSF 2.0 aporta gobernanza y un lenguaje común para toda la empresa [11]; 62443 aporta el método técnico y organizativo para la planta. NIST SP 800-82 vincula ambos, y su borrador Rev. 4 se reestructura en torno a CSF 2.0 [10].

### ¿Qué es el modelo Purdue y sigue siendo relevante?

Es una arquitectura de referencia por capas, desde los dispositivos de campo (nivel 0) hasta la empresa (niveles 4 y 5), con frecuencia con una DMZ industrial en el nivel 3.5. Sigue siendo un mapa inicial útil para las zonas, pero las conexiones IIoT y en la nube atraviesan sus niveles, por lo que las zonas deben seguir los riesgos y flujos de datos reales (sección 7).

### ¿Cómo se aplica el enfoque de confianza cero a OT?

Confianza cero significa no confiar implícitamente en función de la ubicación en la red: cada usuario, dispositivo y conexión debe estar autorizado para el acceso específico que necesita. En una planta esto coincide con lo que 62443 ya exige: zonas con conductos explícitos y en lista de permitidos, cuentas individuales en lugar de inicios de sesión compartidos, y sesiones de acceso remoto intermediadas y aprobadas (secciones 7, 11, 12 y 14). Empiece por los conductos y por las funciones de gestión, como la ingeniería y el acceso de proveedores, porque muchos protocolos de campo no tienen autenticación integrada (sección 2). El borrador NIST SP 800-82 Rev. 4 añade orientaciones sobre los principios de confianza cero para las funciones de gestión de sistemas [10].

### ¿Se pueden parchear los PLC heredados sin detener la producción?

A menudo no de inmediato, y no es necesario. Primero compruebe si la función vulnerable se usa y es accesible. Si la corrección de firmware requiere un reinicio o una prueba funcional, aplique medidas compensatorias ahora: restrinja el conducto, desactive los servicios no utilizados, como un servidor web que no se usa, mantenga el selector de llave en RUN cuando sea compatible y vigile el activo con más atención. Documente y apruebe el riesgo residual y luego instale la corrección en la siguiente parada planificada. La sección 13 incluye una tabla de decisión y un ejemplo resuelto. Los controladores que nunca recibirán una corrección deben entrar en un plan de sustitución, no en una excepción permanente.

### ¿Se puede obtener la certificación en IEC 62443?

Sí. Los productos pueden certificarse con ISASecure CSA (4-2), los sistemas con SSA (3-3), las organizaciones de desarrollo con SDLA (4-1) [7], y desde junio de 2025 los sitios operativos con ACSSA de ISASecure [8]. Otros esquemas de evaluación de la conformidad también certifican según 62443, sobre todo el programa de ciberseguridad IECEE de la IEC [37].

### ¿Cuál es la diferencia entre 62443-4-1 y 62443-4-2?

4-1 cubre el proceso de desarrollo seguro del proveedor (cómo se construyen los productos), y 4-2 las capacidades técnicas de seguridad de un componente (qué puede hacer el producto) [1][7].

### ¿Cuánto tiempo lleva implantar IEC 62443 en una planta?

Para una sola planta de tamaño medio, una ruta realista es de 12 a 24 meses para el núcleo: inventario, modelo de zonas, IDMZ, acceso remoto, copias de seguridad, monitorización y respuesta a incidentes (sección 20). El programa continúa después como una rutina anual. Esta estimación se basa en la hoja de ruta de esta guía, no en un punto de referencia publicado.

### ¿Cuánto cuesta la seguridad de OT?

Depende del número de zonas, de la antigüedad de los equipos y de las herramientas elegidas; no encontramos ningún punto de referencia público fiable. La sección 21 muestra cómo construir el caso con la pérdida anual esperada y ofrece un ejemplo resuelto con supuestos.

### ¿Se aplica CMMC a los sistemas OT?

CMMC se aplica a los sistemas que procesan, almacenan o transmiten FCI o CUI. Las máquinas que reciben planos o programas marcados como CUI pueden estar dentro del alcance; una buena segmentación mantiene pequeño el límite de la evaluación [28][29]. En el Nivel 2, los sistemas OT que pueden manejar CUI pero no pueden protegerse por completo cuentan como "Specialized Asset": se documentan en el inventario, el SSP y el diagrama de red, pero no se evalúan frente al resto de requisitos [38].

### ¿Qué enseñó el ataque a Colonial Pipeline a los fabricantes?

Que un incidente de TI puede detener una operación OT. Colonial paralizó las operaciones de su oleoducto tras un ataque de ransomware en torno al 7 de mayo de 2021, pagó unos 75 bitcoins, y el Departamento de Justicia incautó posteriormente 63,7 bitcoins [16]. Conocer las dependencias y disponer de un modo de operación degradado importa tanto como proteger los controladores.

### ¿Deben las empresas estadounidenses con plantas en la UE cumplir NIS2?

Sus entidades en la UE podrían tener que hacerlo, si entran en los sectores y umbrales de tamaño de la ley nacional de transposición. Alemania, por ejemplo, aplica NIS2 a tipos de entidad enumerados con al menos 50 empleados o con más de 10 millones de euros tanto en ingresos como en total de balance [25][40].

## Conclusión

La ciberseguridad OT es ingeniería de planta pensando en un atacante. ISA/IEC 62443 ofrece a los fabricantes un método que encaja con la planta: conocer los activos, dividir la planta en zonas con conductos controlados, fijar niveles de seguridad objetivo según el riesgo, cerrar la brecha con medidas técnicas y organizativas, y exigir a los proveedores e integradores las mismas reglas. NIST CSF 2.0 y SP 800-82 conectan ese método con la gobernanza en EE. UU., y CMMC, las normas de la SEC, NIS2 y la CRA añaden obligaciones allí donde se aplican.

Los incidentes documentados señalan los mismos primeros pasos: separar la planta de la empresa mediante una DMZ industrial, controlar cada vía de acceso remoto, mantener copias de seguridad offline probadas de la lógica de los controladores y de los servidores, y ensayar cómo funciona la planta cuando TI no está disponible. Nada de eso requiere esperar a una arquitectura perfecta o a la próxima edición de la norma. Empiece por la lista de 30 días de la sección 20, construya el modelo de zonas durante el primer año y mida el progreso con un puñado de KPI. En dos años, una planta de tamaño medio puede pasar de "esperamos estar aislados" a un programa de seguridad documentado, probado y en mejora constante.

## Lecturas adicionales en m365.fm

**Guías relacionadas**
- [Azure para fabricación](https://www.m365.fm/en/learn/manufacturing-it-azure/): seguridad OT para arquitecturas de borde y nube, transición a Defender for IoT, CMMC y NIS2
- [MES e ISA-95](https://www.m365.fm/en/learn/mes-isa-95/): los niveles funcionales y los flujos de datos que protege el modelo de zonas
- [Mantenimiento predictivo e IIoT](https://www.m365.fm/en/learn/predictive-maintenance-iiot/): conexiones de sensores y en la nube que necesitan sus propias zonas
- [Gemelo digital en la fabricación](https://www.m365.fm/en/learn/digital-twin-manufacturing/): acceso a datos que depende de conductos limpios
- [Planificación de la producción aeroespacial](https://www.m365.fm/en/learn/aerospace-production-planning/): CMMC, ITAR y DFARS para cadenas de suministro de defensa
- [KPI de fabricación](https://www.m365.fm/en/learn/manufacturing-kpis/): diseño de sistemas de KPI
- [Gestión de planta y Gemba walks](https://www.m365.fm/en/learn/shop-floor-management/): rutinas diarias que pueden transportar anomalías de seguridad
- [TPM y OEE](https://www.m365.fm/en/learn/tpm-oee/): rutinas de mantenimiento a las que pertenecen las copias de seguridad y el control de cambios
- [Excelencia operacional](https://www.m365.fm/en/learn/operational-excellence/): sistemas de gestión que sostienen programas como este

# Author box

**[Mirko Peters](https://www.m365.fm/entity/mirko-peters/)** es el presentador de m365.fm y trabaja en iFAKT GmbH. En m365.fm escribe sobre manufactura esbelta, excelencia operacional, TI de manufactura y la transformación digital de la producción, incluido cómo las plantas conectan los sistemas de piso de planta con las plataformas empresariales y en la nube de forma segura.

**Nota: El autor trabaja en iFAKT GmbH.**

# Sources

All sources were opened and checked on November 20, 2026, unless noted otherwise.

1. ISA/IEC 62443 Series of Standards. International Society of Automation (ISA), catalog page with editions of all published parts. https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards
2. Quick Start Guide: An Overview of ISA/IEC 62443 Standards, Security of Industrial Automation and Control Systems. ISA Global Cybersecurity Alliance (ISAGCA), June 2020. https://gca.isa.org/hubfs/ISAGCA%20Quick%20Start%20Guide%20FINAL.pdf
3. IEC 62443. Wikipedia (secondary overview used for IEC edition dates, the SL 0 description and maturity level wording; checked against [1], [4], [5]). https://en.wikipedia.org/wiki/IEC_62443
4. IEC PAS 62443-2-2:2025, Security for industrial automation and control systems, Part 2-2: IACS security protection scheme. IEC webstore, published March 11, 2025. https://webstore.iec.ch/en/publication/63886
5. IEC PAS 62443-1-6:2025, Part 1-6: Application of the 62443 series to the Industrial Internet of Things (IIoT). IEC webstore, published December 19, 2025. https://webstore.iec.ch/en/publication/102885
6. Building a Resilient World: Status of the 62443 standards (second editions of 3-2, 3-3 and 4-2 in revision). ISA Global Cybersecurity Alliance blog (undated). https://gca.isa.org/blog/status-of-the-62443-standards
7. ISASecure (home page with the CSA, SSA, SDLA and ACSSA programs; "founded in 2007 and is a wholly owned subsidiary of ISA"). https://isasecure.org/
8. ISASecure Announces New IACS Security Assurance (ACSSA) Inspection and Certification Scheme. ISA press release, June 18, 2025. https://www.isa.org/news-press-releases/2025/june/isasecure-announces-new-iacs-security-assurance-ac
9. NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security. NIST CSRC, September 28, 2023. https://csrc.nist.gov/pubs/sp/800/82/r3/final
10. Guide to Operational Technology (OT) Security: NIST Requests Comments on Draft SP 800-82r4. NIST news, September 21, 2026 (comments through November 30, 2026). https://www.nist.gov/news-events/news/2026/09/guide-operational-technology-ot-security-nist-requests-comments-draft-sp
11. NIST Releases Version 2.0 of Landmark Cybersecurity Framework. NIST news release, February 26, 2024. https://www.nist.gov/news-events/news/2024/02/nist-releases-version-20-landmark-cybersecurity-framework
12. NIST IR 8183 Rev. 2 (Initial Public Draft), Cybersecurity Framework 2.0 Manufacturing Profile. NIST CSRC, September 29, 2025. https://csrc.nist.gov/pubs/ir/8183/r2/ipd (re-fetched November 20, 2026: still the initial public draft; comments closed November 17, 2025; no later version listed)
13. Cybersecurity Performance Goals 2.0 for Critical Infrastructure. CISA bulletin, released December 10, 2025. https://content.govdelivery.com/accounts/USDHSCISA/bulletins/3ff7850
14. OT Security Guidance: NIST Drafts Updated Guide, CISA, FBI Advise on ICS Integrators. SecurityWeek, September 24, 2026 (secondary report on the CISA/FBI fact sheet for operators working with third-party ICS integrators). https://www.securityweek.com/ot-security-guidance-nist-drafts-updated-guide-cisa-fbi-advise-on-ics-integrators/
15. ICS Matrix. MITRE ATT&CK for ICS, content version 20.1. https://attack.mitre.org/matrices/ics/
16. Department of Justice Seizes $2.3 Million in Cryptocurrency Paid to the Ransomware Extortionists Darkside. US Department of Justice, press release, June 7, 2021. https://www.justice.gov/archives/opa/pr/department-justice-seizes-23-million-cryptocurrency-paid-ransomware-extortionists-darkside
17. Cyber-attack on Hydro. Norsk Hydro (company page). https://hydro.com/en/media/on-the-agenda/cyber-attack
18. Merck, insurers settle NotPetya coverage case. Cybersecurity Dive, January 8, 2024. https://www.cybersecuritydive.com/news/merck-settlement-notpetya/703922/
19. Clorox files $380M suit against Cognizant over 2023 cyberattack. Cybersecurity Dive, July 23, 2025. https://www.cybersecuritydive.com/news/clorox-380-million-suit-cognizant-cyberattack/753837/
20. Clorox lawsuit against Cognizant (details of the August 11, 2023 help desk calls, $49 million remediation, 6% volume decline, $100 million insurance recoveries). The Record by Recorded Future, July 2025. https://therecord.media/clorox-cyberattack-lawsuit-cognizant-it-contractor
21. JLR Hack UK's Costliest Ever, Hitting Economy with £1.9bn Loss. Infosecurity Magazine, October 2025 (report on the Cyber Monitoring Centre assessment). https://www.infosecurity-magazine.com/news/jlr-hack-uk-costliest-ever-19bn/
22. Cyber Resilience Act: Reporting obligations. European Commission. https://digital-strategy.ec.europa.eu/en/policies/cra-reporting
23. Cyber Resilience Act. German Federal Office for Information Security (BSI), English page (all requirements apply from December 11, 2027; SBOM; support period generally five years). https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Cyber_Resilience_Act/cyber_resilience_act_node.html
24. Cybersicherheitsrecht: NIS-2-Umsetzungsgesetz ab morgen in Kraft (NIS2 implementation act in force tomorrow). BSI press release, December 5, 2025 (German). https://www.bsi.bund.de/DE/Service-Navi/Presse/Pressemitteilungen/Presse2025/251205_NIS-2-Umsetzungsgesetz_in_Kraft.html
25. Fragen und Antworten zu NIS-2 (NIS2 FAQ) and NIS-2-Meldepflicht (reporting obligation). BSI (German). https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2-regulierte-Unternehmen/NIS-2-FAQ/NIS-2-FAQ-allgemein/FAQ-zu-NIS-2.html (re-fetched November 20, 2026; the FAQ refers to the size thresholds of § 28 BSIG without the figures, see [40])
26. SEC Adopts Rules on Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure by Public Companies. SEC press release 2023-139, July 26, 2023. https://www.sec.gov/newsroom/press-releases/2023-139 (re-fetched November 20, 2026)
27. CIRCIA final rule at the White House: deadlines set, scope open. Paubox, October 8, 2026 (secondary source on rulemaking status). https://www.paubox.com/blog/circia-final-rule-white-house-deadlines-set-scope-open (re-fetched November 20, 2026; 72 hours / 24 hours confirmed)
28. DoD Publishes Final CMMC Program Rule. Greenberg Traurig, October 2024 (summary of 32 CFR Part 170, effective December 16, 2024). https://www.gtlaw.com/en/insights/2024/10/dod-publishes-final-cmmc-program-rule (re-fetched November 20, 2026; article dated October 15, 2024)
29. The CMMC DFARS Final Rule Goes Live: Ready or Not, Here It Comes. Squire Patton Boggs, September 2025 (DFARS rule effective November 10, 2025, three-year phase-in). https://www.squirepattonboggs.com/en/insights/publications/2025/09/the-cmmc-dfars-final-rule-goes-live-ready-or-not-here-it-comes (verified for the sister guide)
30. Cybersecurity Services. NIST Manufacturing Extension Partnership (MEP). https://www.nist.gov/mep/cybersecurity-services (re-fetched November 20, 2026)
31. Retirement: OT security in Microsoft Defender for IoT. Azure Updates, ID 576255, November 2, 2026. https://azure.microsoft.com/updates?id=576255 (verified for the sister guide; the Azure page renders client-side and showed no content on November 20, 2026; the same notice AZ576255, published November 2, 2026, retirement October 2029, was re-read on the message-center mirror https://mc.merill.net/message/AZ576255)
32. Critical Manufacturing Sector. CISA. https://www.cisa.gov/critical-manufacturing-sector (re-fetched November 20, 2026; four core industries and DHS as SRMA confirmed; the page does not state the number of sectors)
33. Understanding ISA/IEC 62443: A Guide for OT Security Teams. Dragos blog (competitor page, used for the SERP analysis only; not cited in the article body). https://www.dragos.com/blog/isa-iec-62443-concepts
34. The Essential Guide to the IEC 62443 industrial cybersecurity standards. Industrial Cyber (secondary; source for the "more than 800 pages" figure). https://industrialcyber.co/features/the-essential-guide-to-the-iec-62443-industrial-cybersecurity-standards/
35. U.S. Retrieves Some Of The Colonial Pipeline Ransom. NPR, June 7, 2021 (refers to "last month's shutdown of Colonial Pipeline"). https://www.npr.org/2021/06/07/1004050873/u-s-retrieves-some-of-the-colonial-pipeline-ransom
36. Testimony of Joseph Blount, President and CEO, Colonial Pipeline Company, before the US Senate Committee on Homeland Security and Governmental Affairs, June 8, 2021. https://www.hsgac.senate.gov/imo/media/doc/Testimony-Blount-2021-06-08.pdf (accessed November 20, 2026)
37. Lin, S.: White paper: Comparing ISASecure, IECEE and proprietary ISA/IEC 62443 certification schemes. Automation.com (ISA), May 15, 2026 (white paper created by ISASecure; interested party). https://www.automation.com/article/white-paper-comparing-isasecure-iecee-proprietary-isa/iec-62443-certification-schemes (accessed November 20, 2026)
38. 32 CFR 170.19, CMMC scoping, paragraph (c)(1), Table 3 (Specialized Assets). Legal Information Institute, Cornell Law School. https://www.law.cornell.edu/cfr/text/32/170.19 (accessed November 20, 2026)
39. DiMolfetta, D.: CISA updates cyber reporting form as broader incident mandate awaits approval. Nextgov/FCW, November 9, 2026. https://www.nextgov.com/cybersecurity/2026/11/cisa-updates-cyber-reporting-form-broader-incident-mandate-awaits-approval/417130/ (accessed November 20, 2026)
40. § 28 BSIG (BSI Act 2025), paragraph 2 no. 3: important entities with at least 50 employees or annual turnover and balance sheet total each above EUR 10 million. Gesetze im Internet, Federal Ministry of Justice (German). https://www.gesetze-im-internet.de/bsig_2025/__28.html (accessed November 20, 2026)
