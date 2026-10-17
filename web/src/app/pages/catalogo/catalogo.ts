import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageIntro } from '../../shared/components/page-intro/page-intro';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-catalogo',
  imports: [PageIntro, MatIconModule],
  template:
    '<app-page-intro [title]="title" [description]="description"/><section class="notice"><mat-icon>construction</mat-icon><h2>Pantalla base</h2><p>La navegación de este módulo está preparada. Los formularios se incorporarán conforme avancen las guías.</p></section>',
})
export class Catalogo {
  private route = inject(ActivatedRoute);
  title = this.route.snapshot.data['title'] as string;
  description = this.route.snapshot.data['description'] as string;
}
