import { Route } from '@angular/router';
import { ApplicationProjectEditor } from './application-project-editor';
import { ScaffoldOutlet } from './components/scaffold-outlet/scaffold-outlet';

export const ApplicationProjectEditorRoutes: Route[] = [
  {
    path: '',
    component: ApplicationProjectEditor,
    children: [
      {
        path: '',
        redirectTo: 'page/1',
        pathMatch: 'full',
      },
      {
        path: 'page/:pageId',
        component: ScaffoldOutlet,
      },
    ],
  },
];
