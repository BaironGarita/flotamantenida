import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DemoRole, DemoUser, MenuItem } from '../../core/models/navigation';
@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  publicMenu = input.required<MenuItem[]>();
  maintenanceMenu = input.required<MenuItem[]>();
  managementMenu = input.required<MenuItem[]>();
  currentUser = input<DemoUser | null>(null);
  isCoordinator = input(false);
  selectRole = output<DemoRole>();
  logoutUser = output<void>();
}
