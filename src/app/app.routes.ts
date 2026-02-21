import { Routes } from '@angular/router';
import { ApplicationProjects } from './application-projects/application-projects';

export const routes: Routes = [
  {
    path: '',
    component: ApplicationProjects
  },
  {
    path: 'project/:projectId',
    loadChildren: () => import('./application-project-editor/application-project-editor.routes').then(m => m.ApplicationProjectEditorRoutes)
  },
];
