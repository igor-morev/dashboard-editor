import { Routes } from '@angular/router';
import { ApplicationProjects } from './application-projects/application-projects';
import { VersionComparison } from './version-comparison/version-comparison';
import { guestGuard } from './services/auth/guest-guard';
import { authGuard } from './services/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./stream-chat-auth/stream-chat-auth').then(m => m.StreamChatAuth),
    canActivate: [guestGuard],
    data: { mode: 'login' }
  },
  {
    path: 'register',
    loadComponent: () => import('./stream-chat-auth/stream-chat-auth').then(m => m.StreamChatAuth),
    canActivate: [guestGuard],
    data: { mode: 'register' }
  },
  {
    path: 'project',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: ApplicationProjects
      },
      {
        path: ':projectId',
        loadChildren: () => import('./application-project-editor/application-project-editor.routes').then(m => m.ApplicationProjectEditorRoutes)
      },
    ]
  }
];
