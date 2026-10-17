import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageIntro } from '../../../shared/components/page-intro/page-intro';
import { FlotaApi } from '../../../core/services/flota-api';
import { Vehicle, PaginationMeta } from '../../../core/models/api';
@Component({
  selector: 'app-vehiculos-list',
  imports: [DecimalPipe, MatCardModule, MatButtonModule, MatIconModule, PageIntro],
  templateUrl: './vehiculos-list.html',
  styleUrl: './vehiculos-list.css',
})
export class VehiculosList {
  api = inject(FlotaApi);
  vehicles = signal<Vehicle[]>([]);
  meta = signal<PaginationMeta | null>(null);
  loading = signal(false);
  error = signal('');
  broken = signal<Set<number>>(new Set());
  constructor() {
    this.load();
  }
  load(page = 1) {
    this.loading.set(true);
    this.error.set('');
    this.api.vehicles(page).subscribe({
      next: (response) => {
        this.vehicles.set(response.data);
        this.meta.set(response.meta);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(
          'No se pudo consultar la flota. Verificá que la API esté iniciada y volvé a intentar.',
        );
        this.loading.set(false);
      },
    });
  }
  imageFailed(id: number) {
    this.broken.update((ids) => new Set([...ids, id]));
  }
}
