# API de Flota Mantenida

## Desarrollo

Desde la carpeta `api`, instalar las dependencias con `npm ci`.
Crear `.env` a partir de `.env.example` y configurar `DATABASE_URL` para la base de datos del proyecto.
El servidor, las migraciones y el seed utilizan esa misma dirección y puerto.

Ejecutar `npm run dev`. Este comando genera el cliente Prisma antes de iniciar el servidor.
Por defecto la API escucha en `http://localhost:3000`; se puede cambiar mediante `PORT`.
La base de datos debe tener el esquema del proyecto aplicado.

## Vehículos

- `GET /activo`: lista los vehículos con su modelo, marca, categoría y estado, ordenados del más reciente al más antiguo. Respuesta: `{ "success": true, "data": [...] }`.
- `GET /activo/:id`: devuelve un vehículo y sus relaciones de modelo/marca, combustible, categoría, criticidad y estado. Respuesta: `{ "success": true, "data": {...} }`.
- Un ID que no sea un entero positivo válido devuelve `400`.
- Un vehículo inexistente devuelve `404`.
- Los errores internos devuelven `500`, sin exponer detalles de conexión.

Ejemplos para Postman: `http://localhost:3000/activo`, `http://localhost:3000/activo/1`, `http://localhost:3000/activo/abc`.
El listado no utiliza paginación en esta etapa.

## Compilación

Ejecutar `npm run build` y luego `npm start`.
La compilación genera el cliente Prisma y produce los archivos JavaScript en `dist`.

## Datos iniciales

El seed está configurado, pero no se ejecuta automáticamente al iniciar o compilar.
`npm exec prisma db seed` borra los registros existentes antes de insertar los datos de ejemplo; usarlo solo en una base de desarrollo destinada a ese propósito.

## Pruebas

Ejecutar npm test para compilar y probar las respuestas HTTP. Las pruebas usan consultas simuladas y no modifican ni necesitan la base de datos.


## Estructura siguiendo el ejemplo de clase

- `src/config/prisma.ts`: conexión compartida con Prisma.
- `src/services/activo.service.ts`: consultas de vehículos.
- `src/controllers/activo.controller.ts`: clase con las respuestas HTTP y StatusCodes.
- `src/routes/activo.routes.ts`: rutas relativas del recurso y asyncHandler.
- `src/routes/routes.ts`: clase AppRoutes con los prefijos de cada recurso.
- `src/utils`: auxiliares para manejar operaciones asíncronas y errores.
- `src/server.ts`: configuración de Express, registro de rutas y arranque del servidor.

Las entidades del ejemplo de videojuegos se adaptan al modelo de flota vehicular.
