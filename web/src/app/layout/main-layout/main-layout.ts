import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { DemoRole, DemoUser, MenuItem } from '../../core/models/navigation';
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  currentUser = signal<DemoUser | null>(null);
  isCoordinator = computed(() => this.currentUser()?.role === 'COORDINADOR');
  publicMenu: MenuItem[] = [
    { label: 'Inicio', path: '/', icon: 'home' },
    { label: 'Vehículos', path: '/vehiculos', icon: 'local_shipping' },
    { label: 'Órdenes', path: '/ordenes', icon: 'assignment' },
  ];
  maintenanceMenu: MenuItem[] = [
    { label: 'Categorías', path: '/categorias', icon: 'category' },
    { label: 'Técnicos', path: '/tecnicos', icon: 'engineering' },
    { label: 'Especialidades', path: '/especialidades', icon: 'build' },
    { label: 'Repuestos', path: '/repuestos', icon: 'inventory_2' },
    { label: 'Proveedores', path: '/proveedores', icon: 'store' },
  ];
  managementMenu: MenuItem[] = [
    { label: 'Órdenes', path: '/ordenes', icon: 'assignment' },
    { label: 'Usuarios', path: '/usuarios', icon: 'group' },
  ];
  selectRole(role: DemoRole) {
    this.currentUser.set({ nombre: role === 'COORDINADOR' ? 'Coordinador' : 'Solicitante', role });
  }
}
