import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PageIntro } from '../../../shared/components/page-intro/page-intro';
import { FlotaApi } from '../../../core/services/flota-api';
import { PublicUser } from '../../../core/models/api';
@Component({
  selector: 'app-usuarios-list',
  imports: [MatButtonModule, PageIntro],
  templateUrl: './usuarios-list.html',
})
export class UsuariosList {
  private api = inject(FlotaApi);
  users = signal<PublicUser[]>([]);
  loading = signal(true);
  error = signal('');
  constructor() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.error.set('');
    this.api.users().subscribe({
      next: (r) => {
        this.users.set(r.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron consultar los usuarios. Verificá que la API esté iniciada.');
        this.loading.set(false);
      },
    });
  }
}
