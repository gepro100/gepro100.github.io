import { Routes } from '@angular/router';
import { TestComponent } from './test.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: 'test', component: TestComponent },
  { path: '', component: AppComponent, pathMatch: 'full' }
];

export const providers = [
  { provide: LocationStrategy, useClass: HashLocationStrategy }
];
