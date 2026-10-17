# Flota Mantenida

Sistema de mantenimiento vehicular. Incluye la API de Node.js y TypeScript y la aplicación Angular de las guías de clase.

## Desarrollo

Se necesitan Node.js 24 LTS y la base de datos configurada para la API.

En una terminal, desde `api`:

```powershell
npm ci
# Configurar DATABASE_URL en .env usando .env.example.
npm run dev
```

En otra terminal, desde `web`:

```powershell
npm ci
npm start
```

Abrir http://localhost:4200. La aplicación redirige las consultas de `/api` y las imágenes de `/images` a http://localhost:3000.

La guía Angular 1 aporta el tema, layout, navegación y pantallas iniciales. Los listados de vehículos, órdenes y usuarios consultan la API. Las vistas demo no autentican ni autorizan; solo cambian el menú. Los demás catálogos tienen pantallas base para continuar con las siguientes guías.

La guía de imágenes agrega subida, listado, descarga y acceso público. También permite reemplazar la imagen de un vehículo usando `PUT /activo/:id/imagen` con un formulario cuyo archivo se llama `image`.

Consultar los README de `api` y `web` para conocer las rutas, estructura y limitaciones. El seed no debe volver a ejecutarse sobre una base con datos que se quieran conservar.
