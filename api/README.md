# API de Flota Mantenida

API de consultas de la Guía API NodeJS 3 adaptada al sistema de mantenimiento vehicular. Utiliza Prisma y la estructura del ejemplo de la profesora: servicios, controladores en clases, rutas por entidad y AppRoutes.

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

- 200: { "success": true, "data": [...] } para listados o data como objeto para detalles.
- 400: ID inválido, filtro de solicitante inválido o JSON malformado.
- 404: registro o ruta inexistente.
- 500: error interno sin datos de conexión.

Los IDs deben ser enteros positivos en el rango de Int de Prisma. Los listados devuelven todos los registros; la paginación de la guía es opcional.
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
- src/services: consultas de Prisma.
- src/controllers: clases con respuestas HTTP y StatusCodes.
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

La colección tiene 22 recursos y 91 solicitudes GET, incluyendo IDs inválidos, registros inexistentes y consultas de órdenes por solicitante. Las solicitudes de detalle necesitan datos cargados; los datos del seed sirven para estas pruebas.

## Datos iniciales

El seed ya existe en prisma/seed.ts. No se ejecuta al iniciar o compilar.

npx prisma db seed limpia los registros y carga datos de ejemplo. Usarlo solo cuando se desee reinicializar una base de desarrollo.
La implementación de consultas no modifica el esquema ni los datos existentes.
