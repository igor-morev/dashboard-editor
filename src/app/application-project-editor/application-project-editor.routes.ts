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
        // Placeholder segment — replaced with the project's real first page id
        // once ApplicationProjectEditor.ngOnInit() loads the project.
        path: '',
        redirectTo: 'page/default',
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
