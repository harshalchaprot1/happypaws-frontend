// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/add">Add Pet</a>
    </nav>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {}
