# Flota Mantenida — Angular

Adaptación de la Guía aplicación Angular 1: aplicación SPA standalone con Angular Material, tema, layout, signals, inputs/outputs, navegación y rutas. Vehículos reemplaza el catálogo de videojuegos; órdenes representa solicitudes de mantenimiento. No se incorpora carrito ni compras.

## Ejecutar

1. En la carpeta api, ejecutar npm ci y npm run dev (puerto 3000).
2. En esta carpeta web, ejecutar npm ci y npm start (puerto 4200).
3. Abrir http://localhost:4200.

El proxy de desarrollo redirige /api y /images a localhost:3000. En producción se debe configurar la misma redirección en el servidor web. Los listados de vehículos, órdenes y usuarios consumen la API real; muestran carga, error y datos vacíos. Los otros catálogos son pantallas base, como en esta guía inicial.

## Estructura

- src/app/core: interfaces, servicio HTTP y espacios para guards/interceptors.
- src/app/layout: Header, Footer y MainLayout.
- src/app/pages: Inicio, vehículos, órdenes, usuarios y pantallas base de catálogos.
- src/app/shared: componentes reutilizables.
- src/material-theme.scss y src/app/styles/_theme-colors.scss: tema Material 3.

La vista demo usa signals e inputs/outputs para mostrar menús de solicitante o coordinador. No autentica ni autoriza; las rutas no están protegidas. Los listados no incluyen formularios de administración ni el ciclo de estados de las órdenes.

Las imágenes se leen de /images/nombre.ext. También se reconoce el prefijo uploads/activos del seed anterior. Las imágenes de muestra son ilustraciones de referencia, no fotos de los vehículos.

npm run build compila la aplicación. No se requiere instalar Angular CLI globalmente: npm start utiliza la versión local.
