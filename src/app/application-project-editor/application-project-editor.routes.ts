import { Route } from '@angular/router';
import { ApplicationProjectEditor } from './application-project-editor';
import { ScaffoldOutlet } from './components/scaffold-outlet/scaffold-outlet';
import { GenerateTemplateForm } from './components/generate-template-form/generate-template-form';
import { PagePreview } from './components/page-preview/page-preview';

export const ApplicationProjectEditorRoutes: Route[] = [
  {
    // Full-viewport preview — deliberately outside ApplicationProjectEditor's children so it
    // renders without the editor chrome (toolbar/layers panel/property panel). Must come before
    // the '' route below, or that route's prefix matching would swallow it.
    path: 'page/:pageId/preview',
    component: PagePreview,
  },
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
