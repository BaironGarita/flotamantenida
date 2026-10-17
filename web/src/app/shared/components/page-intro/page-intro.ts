import { Component, input } from '@angular/core';
@Component({
  selector: 'app-page-intro',
  template:
    '<div class="page-intro"><span class="eyebrow">{{ eyebrow() }}</span><h1>{{ title() }}</h1><p>{{ description() }}</p></div>',
})
export class PageIntro {
  eyebrow = input('Flota Mantenida');
  title = input.required<string>();
  description = input.required<string>();
}
