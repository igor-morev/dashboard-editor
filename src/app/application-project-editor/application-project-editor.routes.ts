import { Route } from '@angular/router';
import { ApplicationProjectEditor } from './application-project-editor';
import { ScaffoldOutlet } from './components/scaffold-outlet/scaffold-outlet';
import { ApplicationEditorState } from './state/application-editor-state';

export const ApplicationProjectEditorRoutes: Route[] = [
  {
    path: '',
    component: ApplicationProjectEditor,
    providers: [ApplicationEditorState],
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
