import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { AppBuilder } from './app-builder/app-builder';

export const routes: Routes = [
  {
    path: '',
    component: AppBuilder,
  }
];
