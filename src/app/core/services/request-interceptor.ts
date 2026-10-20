import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Storage } from '../storage';
import { catchError, throwError } from 'rxjs';
import { NotificationsService } from '@app/shared/notifications';
import { serverErrorMessage } from '../utils/http-error.util';

export function requestInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const storage = inject(Storage);
  const notifications = inject(NotificationsService);
  const authToken = storage.getItem('access_token');
  // const authService = inject(AuthService);

  const newReq = req.clone({
    headers: authToken ? req.headers.append('Authorization', `Bearer ${authToken}`) : req.headers,
  });

  return next(newReq).pipe(
    catchError((err) => {
      const httpError = err as HttpErrorResponse;

      console.error('HTTP error', httpError);

      if (httpError.status === 401) {
        // TODO: handle 401
        storage.removeItem('access_token');
      }

      notifications.error(serverErrorMessage(httpError));

      // Was `return of(err)`, which emits the error as a *successful* value — every caller's
      // `.subscribe({ error })` across the app silently never ran; e.g. a failed login would
      // still hit `next()` and navigate as if it had succeeded.
      return throwError(() => err);
    })
  );
}
