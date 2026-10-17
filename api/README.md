# API de Flota Mantenida

API de las Guías API NodeJS 3 y 4 adaptada al sistema de mantenimiento vehicular. Utiliza Prisma y la estructura del ejemplo de la profesora: servicios, controladores en clases, rutas por entidad y AppRoutes.

## Desarrollo

Desde la carpeta api:

1. Instalar dependencias con npm ci.
2. Crear .env a partir de .env.example y configurar DATABASE_URL para la base del proyecto.
3. Iniciar MySQL/MariaDB. La base debe contener las tablas y datos del proyecto.
4. Ejecutar npm run dev y abrir http://localhost:3000.

PORT permite cambiar el puerto HTTP. El servidor, las migraciones y el seed usan DATABASE_URL.
El cliente Prisma se genera automáticamente antes del desarrollo y la compilación.

## Consultas disponibles

Todos estos recursos tienen GET /recurso y GET /recurso/:id.

| Recurso | Ruta |
| --- | --- |
| Vehículos | /activo |
| Roles | /rol |
| Estados de vehículos | /estadoActivo |
| Estados de órdenes | /estadoOrden |
| Categorías de vehículos | /categoriaActivo |
| Clase de mantenimiento | /claseMantenimiento |
| Prioridad | /prioridad |
| Nivel de criticidad | /nivelCriticidad |
| Tipo de combustible | /tipoCombustible |
| Unidad de medida | /unidadMedida |
| Nivel de certificación | /nivelCertificacion |
| Marca | /marca |
| Modelo | /modelo |
| Especialidad | /especialidad |
| Tipo de mantenimiento | /tipoMantenimiento |
| Técnico | /tecnico |
| Repuesto | /repuesto |
| Proveedor | /proveedor |
| Usuario | /usuario |
| Orden de mantenimiento | /orden |
| Historial de vehículo | /historialEstadoActivo |
| Historial de orden | /historialEstadoOrden |

GET /orden/usuario?usuarioId=6 permite consultar las órdenes del solicitante indicado. El parámetro es obligatorio y debe ser un entero positivo. Si no hay órdenes devuelve un arreglo vacío. Esta es una consulta de demostración como la del ejemplo de clase; no implementa autenticación ni permisos. El parámetro role no cambia el filtro.

## Respuestas

- 200/201: { "success": true, "statusCode": 200, "message": "…", "data": [...] }. En creaciones el código es 201.
- 400: ID inválido, filtro de solicitante inválido o JSON malformado.
- 404: registro o ruta inexistente.
- 409: código/placa duplicados o conflicto con el estado actual.
- 500: error interno sin datos de conexión.

Los errores incluyen success, statusCode, error, message, timestamp y path. Los errores del DTO agregan validationErrors con field y message.

Los IDs deben ser enteros positivos en el rango de Int de Prisma. GET /activo usa paginación: page=1, limit=10 por defecto, máximo 100 registros por página. Devuelve meta con total, page, limit, totalPages, hasNextPage y hasPrevPage. Los demás listados conservan sus consultas completas.
Se incluyen registros activos e inactivos cuando el modelo tiene ese indicador.
Los valores Decimal, como precios, tarifas y costos, se serializan como texto para conservar precisión. Las fechas se devuelven en formato ISO.

## Relaciones

- Modelo: su marca. Marca: sus modelos en el detalle.
- Vehículo: modelo/marca, combustible, categoría, criticidad, estado, órdenes e historial en el detalle.
- Tipo de mantenimiento: clase y especialidad.
- Técnico: especialidades y niveles de certificación; asignaciones de órdenes en el detalle.
- Repuesto: unidad de medida; ofertas de proveedores con precio y plazo de entrega en el detalle.
- Proveedor: repuestos ofrecidos en el detalle.
- Usuario: rol y datos públicos, excluyendo contrasenaHash.
- Orden: vehículo, tipo, clase, especialidad, prioridad, estado y solicitante. El detalle incluye técnicos, horas/tarifas, repuestos, cantidades/costos, proveedores e historiales.
- Historiales: estados anterior/nuevo, usuario y vehículo u orden correspondiente.

Las tablas intermedias TecnicoEspecialidad, RepuestoProveedor, OrdenTecnico y OrdenRepuesto se consultan mediante los detalles anteriores. No requieren endpoints separados con IDs artificiales.
Los hashes de contraseña se excluyen también de los usuarios relacionados en órdenes e historiales.

## Estructura

- src/config/prisma.ts: conexión a la base.
- src/services: consultas de Prisma y reglas de negocio.
- src/controllers: clases que conectan HTTP con los servicios y usan las respuestas uniformes.
- src/dtos: esquemas Zod para crear y actualizar vehículos y solicitudes.
- src/middlewares: validación del body, ruta inexistente y manejo único de errores.
- src/config/logger.ts: logs diarios con Winston, rotación de 14 días y archivos excluidos de Git.
- src/routes: rutas de cada recurso y routes.ts con AppRoutes.
- src/utils: auxiliares de errores, asyncHandler y selección de campos públicos de usuario.
- src/server.ts: configuración y arranque de Express.
- tests: pruebas automáticas HTTP con consultas simuladas.
- postman: colección para importar y probar con la base real.

## Compilación y pruebas

npm run build genera el cliente Prisma y compila a dist. npm start inicia la versión compilada.

npm test compila y ejecuta las pruebas. Estas no necesitan ni modifican la base de datos.

## Postman

1. Iniciar la API con npm run dev.
2. En Postman seleccionar Import y abrir postman/Flota Mantenida.postman_collection.json.
3. Revisar baseUrl en las variables de la colección.
4. Ejecutar la colección con Run. Los listados guardan automáticamente un ID existente para cada detalle.

La colección conserva 22 recursos y 91 solicitudes de consultas, y agrega 18 solicitudes en la carpeta «Guía 4 - Crear, actualizar y validar». Esta carpeta crea registros reales en la base de desarrollo; ejecutarla en orden después de cargar el seed. Las solicitudes de detalle necesitan datos cargados; los datos del seed sirven para estas pruebas.

## Datos iniciales

El seed ya existe en prisma/seed.ts. No se ejecuta al iniciar o compilar.

npx prisma db seed limpia los registros y carga datos de ejemplo. Usarlo solo cuando se desee reinicializar una base de desarrollo.
La implementación de consultas no modifica el esquema ni los datos existentes.

## Operaciones de la guía 4

| Método | Ruta | Acción |
| --- | --- | --- |
| POST | /activo | Crear vehículo, validando los catálogos relacionados. |
| PUT | /activo/:id | Actualizar los campos enviados; conserva los omitidos. |
| POST | /orden | Crear una solicitud en estado Solicitada (ID 1). |
| PUT | /orden/:id | Editar datos de una solicitud que todavía está en Solicitada. |

Los ejemplos de videojuegos de la profesora se adaptan al inventario de vehículos. La orden de compra se adapta a la solicitud de mantenimiento; no recibe videojuegos, ni aplica repuestos o técnicos a una orden. Esas acciones pertenecen al ciclo posterior de mantenimiento.

Los cuerpos de ejemplo están listos en la colección Postman. Los IDs numéricos no se envían como texto. Las fechas del body se envían como YYYY-MM-DD; los códigos usan CPE-0001 para vehículos y OM-2026-0001 para solicitudes (el prefijo vehicular puede tener de 2 a 5 letras mayúsculas). Se rechazan campos desconocidos y actualizaciones vacías.

La imagen se registra o actualiza mediante imagenUrl; esta guía no agrega carga de archivos. No hay borrado físico: el ejemplo de la guía 4 implementa POST y PUT. El CRUD del resto de módulos del enunciado queda pendiente.

Un cambio de estado del vehículo se rechaza si tiene órdenes abiertas; Rechazada, Completada y Cancelada se consideran finales. Las solicitudes no permiten cambiar de estado, costo, diagnóstico, técnicos o repuestos mediante estos endpoints. usuarioSolicitanteId es un dato de demostración, no una identidad autenticada.

Los errores de Prisma P2002/P2025/P2003/P2014 se traducen a 409/404/400 según el método HTTP. El servidor responde un mensaje genérico ante errores inesperados. Los logs no guardan el body ni credenciales; se generan localmente en logs/.

## Guía de imágenes

Los archivos se guardan en assets/uploads y se sirven desde /images/nombre.ext. Se aceptan JPG, PNG y WEBP, con un máximo de 2 MB y validación de extensión, tipo y firma. Los nombres nuevos son únicos. Las imágenes subidas no se versionan; las 12 ilustraciones del seed sí se incluyen.

| Método | Ruta | Uso |
| --- | --- | --- |
| POST | /images/upload | multipart/form-data, campo image; devuelve data.fileName y data.url. |
| GET | /images/files | Listar nombres y URLs de imágenes. |
| GET | /images/download/:name | Descargar un archivo. |
| GET | /images/:name | Acceder a una imagen pública. |
| PUT | /activo/:id/imagen | Subir y guardar la imagen del vehículo en una operación. |

La base guarda solo el nombre del archivo. El seed fue actualizado para usar los nombres locales; no es necesario ni recomendable volver a ejecutar el seed sobre los datos actuales. Angular reconoce también las rutas uploads/activos del seed anterior.

previousFileName es opcional al subir: elimina una imagen anterior solamente cuando ya no está asociada a vehículos. Para reemplazar imágenes de un vehículo, usar PUT /activo/:id/imagen; primero guarda el nombre nuevo y después limpia el anterior. Las imágenes compartidas y las ilustraciones del seed se conservan. Si falla la validación o la escritura en la base, se elimina la subida nueva. Las pruebas de imágenes usan una carpeta temporal, nunca los archivos del proyecto.

Las solicitudes de carga de Postman requieren seleccionar un archivo local manualmente. No establecer Content-Type: el cliente genera el boundary de multipart. La API mantiene el manejo global de errores de la guía 4; Multer responde 400 para exceso de tamaño o campo incorrecto.
