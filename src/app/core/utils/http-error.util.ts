import { HttpErrorResponse } from '@angular/common/http';

export function serverErrorMessage(httpError: HttpErrorResponse): string {
  const message = httpError.error?.message;
  if (Array.isArray(message)) return message.join(', ');
  if (typeof message === 'string') return message;
  return 'Something went wrong. Please try again.';
}
