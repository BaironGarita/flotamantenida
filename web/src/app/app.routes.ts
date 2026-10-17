import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
        title: 'Inicio | Flota Mantenida',
      },
      {
        path: 'vehiculos',
        loadComponent: () =>
          import('./pages/vehiculos/vehiculos-list/vehiculos-list').then((m) => m.VehiculosList),
        title: 'Vehículos | Flota Mantenida',
      },
      {
        path: 'ordenes',
        loadComponent: () =>
          import('./pages/ordenes/ordenes-list/ordenes-list').then((m) => m.OrdenesList),
        title: 'Órdenes | Flota Mantenida',
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/usuarios/usuarios-list/usuarios-list').then((m) => m.UsuariosList),
        title: 'Usuarios | Flota Mantenida',
      },
      ...[
        {
          path: 'categorias',
          title: 'Categorías',
          description: 'Clasificación de vehículos y parámetros de mantenimiento preventivo.',
        },
        { path: 'tecnicos', title: 'Técnicos', description: 'Personal técnico y disponibilidad.' },
        {
          path: 'especialidades',
          title: 'Especialidades',
          description: 'Competencias y certificaciones de los técnicos.',
        },
        {
          path: 'repuestos',
          title: 'Repuestos',
          description: 'Inventario de repuestos y niveles de stock.',
        },
        {
          path: 'proveedores',
          title: 'Proveedores',
          description: 'Proveedores y condiciones de suministro.',
        },
      ].map((page) => ({
        path: page.path,
        loadComponent: () => import('./pages/catalogo/catalogo').then((m) => m.Catalogo),
        title: page.title + ' | Flota Mantenida',
        data: page,
      })),
    ],
  },
  { path: '**', redirectTo: '' },
];
