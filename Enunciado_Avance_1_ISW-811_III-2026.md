## Enunciado Avance 1

## Contenido


## 1. Descripción general del Avance 1

El Avance 1 corresponde a la primera entrega formal del proyecto de ISW-811 (Semana 7, 15% de la nota del curso) y evalúa la base estructural del backend y de la base de datos: modelo de datos, persistencia, API REST funcional y el arranque del proceso principal (Orden de Mantenimiento), respetando en todo momento el Enunciado general del Proyecto ISW-811, del cual este documento es un desarrollo detallado, ningún requisito aquí contradice o sustituye lo indicado allí, especialmente en las secciones 3 (entregables y avances), 4 (stack tecnológico), 7 (módulos obligatorios), 13 (defensa técnica), 14 (repositorio y commits) y 15 (restricciones técnicas).

Esta entrega es 100% backend y no incluye frontend, autenticación/autorización, ni el flujo completo de estados de la Orden de Mantenimiento.

La interfaz gráfica en Angular se evalúa en el Avance 2 (Semana 9); la autenticación, el ciclo de vida completo de la orden, el historial de estados, el mantenimiento preventivo y los reportes se evalúan en el Avance 3 (Semana 13).

Lo que sí se evalúa aquí es que el equipo pueda demostrar, con evidencia funcional real, que construyó correctamente los cimientos técnicos sobre los que se apoyará el resto del proyecto.

## Objetivo académico

Al finalizar esta entrega, cada estudiante debe ser capaz de demostrar que puede:

- Modelar correctamente el dominio de mantenimiento de activos y sus relaciones (1:N y N:N, incluyendo tablas puente con atributos propios).

- Implementar persistencia real en MySQL mediante Prisma 7, con el modelo definido en schema.prisma, migraciones aplicadas y seeders representativos.

- Construir una API REST funcional en Node.js con TypeScript (Express), organizada según la arquitectura vista en clase (routes, controllers, services y DTOs), con validaciones consistentes y manejo global de errores mediante middleware.


- Iniciar el proceso principal del sistema (Orden de Mantenimiento) a nivel de modelo y operaciones básicas, sin todavía implementar sus reglas de negocio completas.

- Sustentar oralmente, con dominio técnico individual, cada decisión de diseño tomada.

La ejecución funcional del sistema por sí sola no es evidencia suficiente: “no se evalúa solo que el sistema funcione, sino que el estudiante sea capaz de explicar, justificar y defender cómo lo construyó”.

## 2. Alcance funcional

## 2.1 Incluido en el Avance 1 (obligatorio, sin excepciones)

- 1. API REST funcional en Node.js con TypeScript (sin frontend). No se evalúa ninguna interfaz gráfica en esta etapa; la demostración de los endpoints se realiza con la colección de Postman del equipo (sección 3.4).

- 2. CRUD completo de todos los catálogos y entidades base: Activos, Categorías de Activo, Técnicos, Especialidades, Repuestos y Proveedores.

- 3. Relaciones 1:N y N:N correctamente implementadas y operativas, incluyendo las tablas puente con sus atributos propios.

- 4. Persistencia en MySQL mediante Prisma 7, con migraciones aplicadas y seeders con datos representativos del contexto elegido (mínimo 8–12 registros por tabla principal).

- 5. Validaciones y manejo global de excepciones en toda la API.

- 6. Campos calculados en las respuestas de la API, según la sección 3.5 y los mínimos definidos por módulo en la sección 5.

- 7. Orden de Mantenimiento: modelo de datos y CRUD básico, únicamente crear y consultar solicitudes. Sin máquina de estados, sin validación de flujo, sin historial automático (eso es Avance 3).

- 8. Arquitectura aplicada desde el inicio, respetando las capas y patrones vistos en clase (routes, controllers, services, DTOs y middlewares).


- 9. Colección de Postman obligatoria, organizada por módulo, con una solicitud por cada endpoint implementado, nombres representativos y datos de prueba (ver sección 3.4).

- 10. Repositorio en GitLab con historial de commits progresivo (ver sección 6.2 de este documento y sección 14 del enunciado general).

- 11. Defensa oral individual obligatoria.

No hay excepciones parciales a esta lista: cada punto se evalúa de forma independiente en la rúbrica de evaluación y un punto ausente o no funcional se califica en 0, sin importar la calidad del resto del sistema.

## 2.2 Explícitamente excluido de esta etapa

- Frontend en Angular 22 (cualquier interfaz gráfica queda fuera de esta entrega) Avance 2.

- Autenticación y autorización basada en roles (JWT, login, permisos por rol), Avance 3.

- Máquina de estados completa de la Orden de Mantenimiento (diagnóstico, aprobación/rechazo, ejecución, espera de repuesto, cierre, cancelación) y su matriz de transición, Avance 3.

- Historial de estados automático (activos y órdenes), Avance 3.

- Detalle de repuestos utilizados en una orden y descuento automático de stock, Avance 3.

- Asignación de técnicos a la orden y registro de horas trabajadas, Avance 3.

- Cálculo de costo total de la orden (mano de obra + repuestos), Avance 3. Los únicos campos calculados exigidos en este avance son los definidos en la sección 3.5.

- Mantenimiento preventivo dinámico (evaluación de umbrales y generación de órdenes sugeridas), Avance 3.

- Cambio automático del estado del activo entre Operativo Ä En Mantenimiento (depende de la máquina de estados de la orden, que aún no existe). El campo Estado del Activo sí debe existir y ser editable manualmente por un endpoint


administrativo (para Fuera de Servicio / Dado de Baja), pero la transición automática ligada a órdenes se implementa en el Avance 3.

- Reportes y dashboard, Avance 3.

- Consideración: cualquier equipo que implemente adicionalmente algo de esta lista en el Avance 1 puede hacerlo, pero no obtiene puntaje extra en esta entrega ni exime de la evaluación completa de ese punto en el avance que le corresponde.

## 2.3 Stack tecnológico obligatorio para este avance

| Componente | Requisito |
| --- | --- |
| Backend | API REST con Node.js y TypeScript (Express), en la versión LTS de Node.js indicada en clase. No se aceptan proyectos en JavaScript sin tipado. |
| ORM | Prisma 7, con migraciones y seeders obligatorios (configuración en prisma.config.ts). |
| Base de datos | MySQL. |
| Arquitectura | Arquitectura vista en clase: backend organizado en routes, controllers, services y DTOs, con middlewares para validación y manejo de errores. |
| Pruebas de API | Postman: colección exportada (formato Collection v2.1) y versionada en el repositorio. |
| Control de versiones | GitLab desde la primera semana del proyecto. |

Esta tabla es un subconjunto, para este avance, de la sección 4 del enunciado general, no la reemplaza.

## 3. Arquitectura, validaciones, manejo de errores, colección de Postman, campos calculados y consultas

Estos seis puntos son transversales: se evalúan en cada módulo del Avance 1, no como un tema aparte. Un módulo con CRUD funcional pero sin respetar la separación en capas, sin validaciones, sin manejo de errores, sin sus solicitudes en la colección de


Postman, sin sus campos calculados mínimos o sin el contenido mínimo de sus consultas se considera incompleto para efectos de cobertura funcional (sección 6).

## 3.1 Arquitectura en capas (obligatorio)

- Separación explícita del backend en: routes, controllers, services y DTOs.

- Los controllers no acceden directamente a Prisma Client; delegan en los services.

- Las reglas de negocio viven en los services, nunca en las routes ni en los controllers.

- Cada integrante debe poder justificar en la defensa por qué un archivo o función específica vive en la capa donde vive.

- Las rutas siguen una convención REST consistente y predecible (ej. /api/{recurso} en plural, /api/{recurso}/{id} para un elemento, sub-recursos para relaciones N:N como /api/tecnicos/{id}/especialidades).

- La configuración sensible (cadena de conexión DATABASE_URL, puerto, etc.) se maneja mediante variables de entorno; no se aceptan credenciales escritas en el código ni archivos .env subidos al repositorio.

## 3.2 Validaciones (obligatorio en cada endpoint de escritura)

- Toda validación de entrada (campos obligatorios, formatos, rangos, unicidad) se ejecuta en el backend, independientemente de la validación que se implemente en el frontend en el Avance 2.

- Se debe usar un mecanismo consistente en todo el proyecto, no una mezcla arbitraria de validaciones manuales dispersas en los controllers.

- Una solicitud inválida responde 400 Bad Request con un cuerpo que identifique el o los campos que fallaron y el motivo (no un mensaje genérico único).

- Las validaciones de reglas de negocio se distinguen de las validaciones de formato de datos, y ambas deben estar cubiertas; una sin la otra no cuenta como módulo cubierto.


## 3.3 Manejo global de errores (obligatorio)

- Middleware único de manejo de errores en Express, registrado al final de la cadena de middlewares, que centraliza la traducción de errores a respuestas HTTP; no se acepta try/catch repetido y ad-hoc en cada controller como único mecanismo.

- Errores de negocio propios: deben heredar de una clase base propia (ej. una clase AppError que extiende Error) y mapearse a códigos HTTP específicos (400/404/409 según corresponda), nunca a un 500 genérico.

- Los errores conocidos de Prisma (ej. violación de restricción única, registro no encontrado, violación de llave foránea) se traducen a su código HTTP correspondiente (409, 404, 409/400) y no se propagan como un 500.

- Toda respuesta de error sigue un formato consistente: código de estado, mensaje comprensible, marca de tiempo y ruta solicitada; en errores de validación se incluye además el detalle de los campos que fallaron.

- Los errores no controlados responden 500 con un mensaje genérico.

## 3.4 Colección de Postman (obligatorio, sin excepciones)

- El equipo debe entregar una colección de Postman exportada en formato JSON (Collection v2.1), versionada en el repositorio (ej. carpeta /postman) y adjunta en la entrega del campus virtual. Si se utiliza un environment, también debe exportarse y entregarse.

- Organización: la colección se organiza en una carpeta por módulo (Activos, Categorías de Activo, Técnicos, Especialidades, Repuestos, Proveedores y Órdenes de Mantenimiento); las relaciones N:N se ubican dentro de la carpeta del módulo principal correspondiente (ej. especialidades de un técnico dentro de Técnicos).

- Cobertura: debe existir una solicitud por cada endpoint implementado en el Avance 1, incluyendo filtros y sub-recursos. Un endpoint sin su solicitud en la colección se considera no entregado.

- Nombres representativos: cada solicitud se nombra según la acción que realiza, en español y de forma consistente (ej. “Listar activos por categoría”, “Registrar técnico”, “Asociar especialidad a técnico”); no se aceptan nombres genéricos como “New Request”, “GET 1” o la URL como nombre.

- Datos de prueba: toda solicitud que lo requiera incluye un cuerpo JSON válido y parámetros (ruta y query) con datos representativos del contexto elegido y


coherentes con los registros creados por los seeders, de modo que pueda ejecutarse de inmediato sobre una base de datos recién poblada.

- URL base: la URL del servidor correcta respectiva a la solicitud.

- Durante la defensa, la demostración funcional se realiza con esta colección; el docente puede solicitar ejecutar cualquier solicitud o modificar sus datos en vivo para verificar validaciones y códigos de respuesta.

## 3.5 Campos calculados (obligatorio)

Un campo calculado es un dato que la API devuelve en sus respuestas pero que no se almacena: se deriva, al momento de la consulta, de datos ya persistidos. Cada módulo de la sección 5 define sus campos calculados mínimos; el nombre exacto, el formato de cada campo y la forma de obtenerlo los define y justifica el equipo.

- No se persisten: un campo calculado no existe como columna en schema.prisma ni en la base de datos, ni se recibe en el cuerpo de una solicitud del cliente.

- Valor correcto y actualizado: el valor devuelto debe ser correcto y reflejar el estado actual de los datos de los que se deriva (ej. si se asocia un nuevo registro, el conteo correspondiente cambia en la siguiente consulta, sin pasos adicionales).

- Visibles en la colección de Postman: todo campo calculado debe aparecer en la respuesta de la solicitud correspondiente de la colección (sección 3.4).

- Alcance: ningún campo calculado de este avance puede depender de funcionalidades de avances posteriores (costos de la orden, horas trabajadas, historial de estados o selección de proveedor).

- Cobertura: un módulo que no expone sus campos calculados mínimos se considera incompleto para efectos del umbral de cobertura funcional (sección 6.3).

## 3.6 Contenido mínimo de las consultas (obligatorio)

Toda acción de consulta debe devolver información suficiente para comprobar que el modelo y sus relaciones funcionan de extremo a extremo. El contenido mínimo del detalle de cada módulo se indica en su contrato de acciones (sección 5); la forma del JSON (anidado o plano) la define y justifica el equipo.

- Listado: devuelve un resumen de cada registro: identificador, campos principales y los campos calculados del módulo.


- Detalle: devuelve todos los campos mínimos del módulo, sus campos calculados y sus relaciones resueltas, según lo indicado en la sección 5.

- Relaciones: toda entidad relacionada se muestra con datos que permitan identificarla (como mínimo su id y su código o nombre); no se acepta devolver únicamente la llave foránea.

- DTOs: las respuestas se construyen con los DTOs de respuesta del proyecto (sección 3.1); no se devuelven directamente los objetos tal como los retorna Prisma Client.

- Cobertura: un detalle que omite información o relaciones mínimas se considera incompleto para efectos del umbral de cobertura funcional (sección 6.3).

## 4. Persistencia: Prisma 7, migraciones y seeders

## 4.1 Modelo de datos

- El modelo de datos se define en schema.prisma y a partir de él se generan las migraciones con Prisma Migrate; no se acepta partir de una base de datos ya existente (introspección con db pull) ni de scripts SQL escritos a mano.

- Deben existir e implementarse, la entidades y relaciones necesarias para cumplir con los requerimientos del Enunciado del Proyecto.

- Los valores de dominio cerrados (estados del activo, estados de la orden, prioridad, tipo de mantenimiento) se modelan con enums de Prisma o con tablas de catálogo, según lo justifique el equipo.

- El diseño exacto de campos adicionales, tipos de dato y restricciones queda a criterio del equipo dentro de los mínimos de la sección 5, y debe poder justificarse en la defensa.

## 4.2 Migraciones

- Las migraciones de Prisma (carpeta prisma/migrations) deben estar versionadas en el repositorio y aplicarse limpiamente sobre una base de datos MySQL vacía.

## 4.3 Seeders (obligatorio)

- Deben ejecutarse sobre una base de datos limpia mediante el comando de seed configurado en prisma.config.ts, sin depender de inserciones manuales durante


la demostración o la defensa. En Prisma 7 el seed no se ejecuta automáticamente al aplicar o reiniciar migraciones: el equipo debe ejecutarlo de forma explícita.

- Cantidad mínima: 8 a 12 registros por tabla principal y datos consistentes en las tablas puente.

- Los datos deben ser representativos del contexto elegido por el equipo (sección 2 del enunciado general), nombres, descripciones y valores genéricos tipo “Activo 1”, “Activo 2” no cumplen este requisito.

- Deben incluirse registros que permitan demostrar los casos borde relevantes para este avance (ej. al menos un repuesto con stock por debajo del mínimo, al menos un activo en un estado distinto de Operativo, al menos un técnico con más de una especialidad).

- No se acepta un sistema con base de datos vacía al momento de la defensa.

## 5. Módulos funcionales obligatorios del Avance 1

Para cada módulo se listan: objetivo, campos mínimos, campos calculados mínimos (sección 3.5), acciones requeridas, validaciones/reglas de negocio y el contrato mínimo de acciones esperado, incluido el contenido mínimo del detalle (sección 3.6). Un módulo solo cuenta como cubierto si cumple la totalidad de lo exigido aquí (sección 6). El diseño exacto de tablas y restricciones de integridad queda a criterio del equipo dentro de estos mínimos.

## 5.1 Gestión de Activos

Objetivo: mantener un inventario centralizado y actualizado de los activos de la organización.

Campos mínimos: código único, nombre, descripción, fecha de adquisición, valor/costo de referencia, estado actual, imagen representativa, al menos 2 atributos adicionales propios del contexto elegido (ej. kilometraje, horas de uso, criticidad), y la categoría asociada.

Acciones requeridas: registrar, consultar (listado y detalle), actualizar, dar de baja lógica; cargar/actualizar la imagen representativa.

## Validaciones y reglas de negocio:


- El código del activo debe ser único en el sistema; el equipo debe definir y justificar su patrón de codificación.

- No se permite eliminar físicamente un activo con órdenes de mantenimiento asociadas; solo baja lógica.

- El activo debe manejar como mínimo los estados: Operativo, En Mantenimiento, Fuera de Servicio, Dado de Baja. En este avance, el cambio a Fuera de Servicio o Dado de Baja es una acción administrativa explícita vía endpoint; el cambio automático ligado a órdenes queda para el Avance 3 (sección 2.2).

Campos calculados mínimos (sección 3.5): antigüedad del activo (a partir de la fecha de adquisición); nombre de la categoría asociada, tanto en el listado como en el detalle; cantidad de órdenes de mantenimiento asociadas al activo.

Contrato mínimo de acciones (la convención de rutas la define y justifica el equipo):

- Listar activos, con filtro por categoría y por estado.

- Consultar el detalle de un activo por id (404 si no existe); debe incluir como mínimo: todos los campos mínimos (incluidos los atributos propios del contexto y la ruta o URL de la imagen), la categoría asociada con su parámetro de mantenimiento preventivo, los campos calculados del módulo y el listado resumido de sus órdenes de mantenimiento (código, fecha de solicitud, tipo, prioridad y estado).

- Registrar un activo (400 si falla una validación; 409 si el código ya existe).

- Actualizar un activo (400, 404).

- Cambiar el estado administrativo a Fuera de Servicio o Dado de Baja (400, 404, 409 si tiene una orden asociada abierta).

- Dar de baja lógica de un activo (404; 409 si tiene órdenes asociadas).

- Cargar o actualizar la imagen representativa (400, 404).

Cada acción debe responder con el código HTTP adecuado a su resultado (éxito, validación fallida, no encontrado, conflicto de regla de negocio).

## 5.2 Categoría de Activo

Objetivo: clasificar los activos y definir el parámetro de mantenimiento preventivo asociado (aunque su evaluación automática es Avance 3, el campo debe existir).

Campos mínimos: nombre, descripción, parámetro de mantenimiento preventivo asociado.


Acciones requeridas: registrar, consultar, actualizar, eliminar.

Validaciones: nombre único en el sistema; no se permite eliminar una categoría con activos asociados.

Campos calculados mínimos (sección 3.5): cantidad de activos asociados a la categoría.

## Contrato mínimo de acciones:

- Listar categorías.

- Consultar el detalle de una categoría por id (404); debe incluir como mínimo: sus campos mínimos, la cantidad de activos asociados y el listado resumido de esos activos (código, nombre y estado).

- Registrar una categoría (400; 409 si el nombre ya existe).

- Actualizar una categoría (400, 404).

- Eliminar una categoría (404; 409 si tiene activos asociados).

## 5.3 Técnicos y Especialidades

Objetivo: administrar el personal técnico y sus competencias (relación N:N con atributos propios).

## Campos mínimos:

- Técnico: nombre completo, identificación, contacto, disponibilidad, tarifa por hora

- Especialidad: nombre, descripción; por cada especialidad de un técnico: nivel de certificación y fecha desde la que la posee.

Acciones requeridas: registrar/consultar/actualizar técnicos y especialidades; asociar y desasociar especialidades a un técnico; consultar técnicos disponibles filtrando por especialidad.

Validaciones: no se permite asociar la misma especialidad dos veces al mismo técnico.

Campos calculados mínimos (sección 3.5): cantidad de especialidades del técnico; antigüedad en cada especialidad (a partir de la fecha desde la que la posee, atributo de la relación N:N).

## Contrato mínimo de acciones:

- Listar técnicos, con filtro por especialidad y por disponibilidad.


- Consultar el detalle de un técnico por id (404); debe incluir como mínimo: sus campos mínimos, la cantidad de especialidades y cada especialidad que posee con su nombre, nivel de certificación, fecha desde la que la posee y antigüedad calculada.

- Registrar un técnico (400).

- Actualizar un técnico (400, 404).

- Listar y registrar especialidades (400).

- Consultar el detalle de una especialidad por id (404); debe incluir como mínimo: sus campos mínimos y los técnicos que la poseen, con su nombre, nivel de certificación y disponibilidad.

- Actualizar una especialidad (400, 404).

- Asociar una especialidad a un técnico, con nivel de certificación y fecha (400, 404; 409 si ya estaba asociada).

- Desasociar una especialidad de un técnico (404).

## 5.4 Repuestos y Proveedores

Objetivo: controlar el inventario de repuestos, considerando que un repuesto puede ser suministrado por varios proveedores con condiciones distintas.

## Campos mínimos:

- Repuesto: código, nombre, unidad de medida, stock actual, stock mínimo

- Proveedor: nombre, contacto, dirección, condiciones generales; por cada proveedor de un repuesto: precio ofrecido y tiempo de entrega estimado.

Acciones requeridas: registrar/consultar/actualizar repuestos y proveedores; asociar un repuesto a uno o varios proveedores con sus condiciones; consultar repuestos con stock por debajo del mínimo.

Validaciones: el stock nunca puede ser negativo (en este avance no hay consumo de stock, pero el campo y la restricción deben existir y validarse en creación/edición).

Campos calculados mínimos (sección 3.5): indicador de stock bajo el mínimo; faltante para alcanzar el stock mínimo (nunca negativo: 0 cuando el stock actual es igual o mayor al mínimo); cantidad de proveedores asociados al repuesto.

## Contrato mínimo de acciones:

- Listar repuestos.


- Consultar repuestos con stock por debajo del mínimo.

- Consultar el detalle de un repuesto por id (404); debe incluir como mínimo: sus campos mínimos, los campos calculados del módulo y los proveedores asociados, cada uno con su nombre, precio ofrecido y tiempo de entrega estimado.

- Registrar un repuesto (400; 409 si el código ya existe).

- Actualizar un repuesto (400, 404).

- Listar y registrar proveedores (400).

- Consultar el detalle de un proveedor por id (404); debe incluir como mínimo: sus campos mínimos y los repuestos que suministra, cada uno con su código, nombre, precio ofrecido y tiempo de entrega estimado.

- Actualizar un proveedor (400, 404).

- Asociar un proveedor a un repuesto, con precio y tiempo de entrega (400, 404).

- Actualizar las condiciones de un proveedor para un repuesto (400, 404).

## 5.5 Orden de Mantenimiento (alcance reducido — solo Avance 1)

Objetivo: iniciar el ciclo de vida de la orden a nivel de modelo y persistencia, sin implementar todavía sus reglas de negocio completas.

Campos mínimos: número/código de orden, activo relacionado, tipo de mantenimiento, fecha de solicitud, fecha programada (opcional en esta etapa), prioridad, estado actual (fijo en “Solicitada” al crear).

## Acciones requeridas en este avance (únicamente):

- Crear una solicitud de mantenimiento.

- Consultar el listado de órdenes (con filtro mínimo por activo).

- Consultar el detalle de una orden.

Explícitamente fuera de alcance en este avance: diagnosticar/aprobar/rechazar, ejecutar, cerrar/cancelar, cambios de estado posteriores a “Solicitada”, cálculo de costo total, historial automático.

## Validaciones aplicables en esta etapa:

- Toda orden debe quedar vinculada a un único activo válido y existente.


- El estado se asigna automáticamente en 
Solicitada
; el sistema no debe permitir que el cliente envíe otro valor de estado al crear.

Campos calculados mínimos (sección 3.5): días transcurridos desde la fecha de solicitud; código y nombre del activo relacionado, tanto en el listado como en el detalle.

## Contrato mínimo de acciones (alcance reducido de este avance):

- Listar órdenes, con filtro por activo.

- Consultar el detalle de una orden por id (404); debe incluir como mínimo: todos sus campos mínimos, el activo relacionado (id, código, nombre, estado actual y categoría) y los días transcurridos desde la solicitud.

- Crear una solicitud de orden, con el estado forzado a 
Solicitada
, sin permitir que el cliente indique otro estado (400; 404 si el activo no existe).

El contrato de acciones de esta sección es cerrado para este avance: no se evalúan acciones adicionales de flujo de estados, aprobación, ejecución o cierre, aunque el equipo las implemente por adelantado, eso no otorga puntaje extra y debe quedar señalado claramente en la defensa para no generar confusión sobre el alcance evaluado. Lo que sí es abierto es la convención de rutas y nomenclatura de la API: cada equipo la define, la aplica de forma consistente en todo el proyecto y la justifica ante el docente.

## 6. Restricciones y umbral mínimo de cobertura

6.1 Restricciones técnicas (heredadas del enunciado general, sección 15, aplicables desde este avance)

- No se permite el uso de paquetes npm marcados como deprecated, sin mantenimiento activo o con vulnerabilidades no resueltas.

- No se permiten eliminaciones físicas donde el enunciado exige baja/desactivación lógica (Activos).

- No se acepta un sistema con base de datos vacía o dependiente de datos insertados manualmente durante la demostración; los seeders (sección 4.3) son la única fuente aceptada de datos de prueba.

- Cada endpoint evaluable debe evidenciar integración real: Route  Controller  Service → Prisma Client → MySQL. No se acepta un endpoint que responda datos fijos o simulados en el código.


## 6.2 Repositorio y control de versiones

- El proyecto debe llevarse en GitLab desde la primera semana, con commits propios de cada integrante (nunca un commit consolidado bajo un solo autor) y distribuidos progresivamente a lo largo de las semanas de este avance (Semana 2 a Semana 7) —no concentrados en los últimos días, según lo definido en la sección 14 del enunciado general.

- El Factor de Historial de Commits (sección 14 del enunciado general) se aplica multiplicativamente sobre la nota obtenida de este avance (Nota técnica × 40% + Nota de defensa × 60%), igual que el Factor de Defensa.

## 6.3 Umbral mínimo de cobertura funcional (regla de no revisión)

Esta regla, definida en el enunciado general, aplica íntegramente al Avance 1:

- No se revisará ni calificará el Componente Técnico de ningún equipo cuya cobertura funcional real de los módulos obligatorios de la sección 5 sea inferior al 50%.

- La cobertura se mide sobre módulos completamente implementados y operativos de extremo a extremo (CRUD completo, relaciones operativas, validaciones, manejo de errores, arquitectura en capas, solicitudes en la colección de Postman, campos calculados mínimos y contenido mínimo de las consultas según las secciones 3 y 5), no sobre líneas de código, commits o funcionalidades iniciadas pero incompletas.

- Un módulo parcial, con errores que impiden su ejecución, o que solo expone endpoints sin lógica de negocio real conectada a la base de datos, no cuenta como cubierto.

- Los equipos que no alcancen el 50% no presentan defensa oral de este avance y obtienen 0/100 en el Componente Técnico, calificación definitiva, sin importar la calidad del código, la arquitectura o el historial de commits.

- Este umbral es independiente de los factores de defensa técnica y de historial de commits: dichos factores solo se aplican a equipos que ya superaron el 50% de cobertura.


## 7. Defensa técnica del Avance 1

La defensa es individual y obligatoria, incluso siendo el trabajo grupal: la incapacidad de explicar lo implementado afecta directamente la calificación de quien no puede sustentarlo. Se centra exclusivamente en lo implementado en este avance.

Aplica la misma escala de dominio y el mismo factor multiplicativo definidos en la sección 13 del enunciado general (Dominio pleno = 1.00 … Sin dominio = 0.00), y la nota final del avance se calcula como:

Nota final = (Nota técnica × 40% + Nota de defensa × 60%) × Factor de defensa × Factor de historial de commits

La nota técnica (Componente Técnico) y el Factor de historial de commits son del equipo; la nota de defensa y el Factor de defensa son individuales. El nivel de dominio y su factor se determinan a partir de la nota de defensa de cada estudiante.

## 8. Resumen de la rúbrica del Avance 1

## Componente Técnico (nota del equipo)

| Sección | Rubros Puntos | posibles | % de la nota técnica |
| --- | --- | --- | --- |
| A. Arquitectura en capas y restricciones técnicas | 11 | 22 | 10% |
| B. Validaciones y manejo global de errores | 8 | 16 | 12% |
| C. Persistencia: Prisma 7, migraciones y seeders | 10 | 20 | 15% |
| D. Colección de Postman | 6 | 12 | 8% |
| E. Gestión de Activos | 18 | 36 | 15% |
| F. Categoría de Activo | 9 | 18 | 7% |
| G. Técnicos y Especialidades | 15 | 30 | 12% |
| H. Repuestos y Proveedores | 16 | 32 | 12% |


| I. Orden de Mantenimiento (alcance reducido) | 10 | 20 | 9% |
| --- | --- | --- | --- |
| Total | 103 | 206 | 100% |

## Defensa Técnica (nota individual)

| Criterio (sección 13 del enunciado) |   | Rubros Puntos posibles |
| --- | --- | --- |
| 1. Dominio del problema y de la solución | 2 | 4 |
| 2. Explicación técnica del código | 4 | 8 |
| 3. Justificación de decisiones técnicas | 3 | 6 |
| 4. Claridad y lenguaje técnico | 1 | 2 |
| 5. Razonamiento ante preguntas no preparadas | 1 | 2 |
| 6. Coherencia entre código, funcionalidad y discurso | 2 | 4 |
| Total | 13 | 26 (se convierte a nota sobre 100) |

## Escala de dominio (factor de defensa)

| Nota de defensa Nivel |   | Factor |
| --- | --- | --- |
| 90–100 | Dominio pleno | 1.00 |
| 75–89 | Dominio adecuado 0.85 |   |
| 60–74 | Dominio superficial 0.65 |   |
| 40–59 | Dominio insuficiente 0.40 |   |
| 0–39 | Sin dominio | 0.00 |

## Factor de historial de commits (por equipo)

| Nivel | Cobertura semanal | Participación mínima por integrante | Factor |
| --- | --- | --- | --- |
| Adecuado | ≥ 60% | ≥ 25% cada uno | 1.00 |


| Insuficiente | 30%–59% | ≥ 15% cada uno | 0.70 |
| --- | --- | --- | --- |
| Crítico (no se revisa) | < 30% | un integrante con < 10% | 0.00 |

## Cálculo final

- Ponderación: Componente Técnico (nota del equipo) 40% y Defensa Técnica (nota individual) 60%; ambas notas se expresan sobre 100 antes de ponderarse.

- Nota final del Avance 1 = (Nota técnica × 40% + Nota de defensa × 60%) × Factor de defensa × Factor de commits, sobre 100 y por estudiante.

- Umbral de cobertura: si la cobertura funcional de los módulos E a I es menor al 50%, la nota es 0/100 definitiva y el equipo no presenta defensa.

- Aporte al curso: el Avance 1 vale 15% de la nota del curso.
