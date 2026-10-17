import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  cards = [
    {
      number: '01',
      title: 'Vehículos',
      description: 'Consultá el inventario, el estado y las imágenes de cada vehículo.',
      icon: 'local_shipping',
      path: '/vehiculos',
    },
    {
      number: '02',
      title: 'Órdenes de mantenimiento',
      description: 'Revisá las solicitudes y sus datos de mantenimiento.',
      icon: 'assignment',
      path: '/ordenes',
    },
    {
      number: '03',
      title: 'Usuarios',
      description: 'Consultá los solicitantes y sus roles dentro de la organización.',
      icon: 'group',
      path: '/usuarios',
    },
  ];
}
