import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PageIntro } from '../../../shared/components/page-intro/page-intro';
import { FlotaApi } from '../../../core/services/flota-api';
import { MaintenanceOrder } from '../../../core/models/api';
@Component({
  selector: 'app-ordenes-list',
  imports: [DatePipe, MatButtonModule, PageIntro],
  templateUrl: './ordenes-list.html',
})
export class OrdenesList {
  private api = inject(FlotaApi);
  orders = signal<MaintenanceOrder[]>([]);
  loading = signal(true);
  error = signal('');
  constructor() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.error.set('');
    this.api.orders().subscribe({
      next: (r) => {
        this.orders.set(r.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron consultar las órdenes. Verificá que la API esté iniciada.');
        this.loading.set(false);
      },
    });
  }
}
