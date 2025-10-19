// app.routes.ts
import { Routes } from '@angular/router';
import { PetListComponent } from './components/pet-list/pet-list.component';

export const routes: Routes = [
  { path: '', component: PetListComponent },
  {
    path: 'add',
    loadComponent: () =>
      import('./components/pet-form/pet-form.component').then(m => m.PetFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/pet-form/pet-form.component').then(m => m.PetFormComponent),
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./components/pet-detail/pet-detail.component').then(m => m.PetDetailComponent),
  },
];
