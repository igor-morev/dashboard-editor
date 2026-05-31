import { Route } from '@angular/router';
import { ApplicationProjectEditor } from './application-project-editor';
import { ScaffoldOutlet } from './components/scaffold-outlet/scaffold-outlet';
import { GenerateTemplateForm } from './components/generate-template-form/generate-template-form';

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
      {
        path: 'page/:pageId/generate',
        component: GenerateTemplateForm,
      },
    ],
  },
];
