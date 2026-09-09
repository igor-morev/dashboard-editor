import { ApplicationConfig, CSP_NONCE, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHighcharts } from 'highcharts-angular';

import { routes } from './app.routes';
import { provideNgxSkeletonLoader } from 'ngx-skeleton-loader';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { requestInterceptor } from './core/services/request-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHighcharts(),
    provideNgxSkeletonLoader({
      theme: {
        extendsFromRoot: true,
        height: '30px',
      },
    }),
    provideHttpClient(
      withFetch(),
      withInterceptors([requestInterceptor])
    ),
    { provide: CSP_NONCE, useValue: 'your-random-nonce' }
  ]
};
