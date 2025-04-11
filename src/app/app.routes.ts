import { Routes } from '@angular/router';
import { TestComponent } from './test.component';

export const routes: Routes = [
  { path: 'test', component: TestComponent },
  { path: '', redirectTo: '/test', pathMatch: 'full' }
];
