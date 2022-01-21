import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <router-outlet></router-outlet>
  <alert></alert>
  `
})

export class AppComponent {
  title = 'authentication';
}
