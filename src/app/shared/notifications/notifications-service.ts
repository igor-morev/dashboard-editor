import { Injectable, signal } from '@angular/core';
import { Notification, NotificationType } from './notification.model';

/**
 * Deliberately self-contained — no imports from outside this folder beyond Angular core — so it
 * can be copied into another Angular project as-is. Pair with NotificationsHost, mounted once
 * near the app root, to actually render what gets pushed here.
 */
@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private static nextId = 0;
  private readonly defaultDurationMs = 4000;

  private readonly _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  success(message: string, durationMs = this.defaultDurationMs): void {
    this.show('success', message, durationMs);
  }

  error(message: string, durationMs = this.defaultDurationMs): void {
    this.show('error', message, durationMs);
  }

  info(message: string, durationMs = this.defaultDurationMs): void {
    this.show('info', message, durationMs);
  }

  dismiss(id: number): void {
    this._notifications.update((list) => list.filter((n) => n.id !== id));
  }

  private show(type: NotificationType, message: string, durationMs: number): void {
    const id = NotificationsService.nextId++;
    this._notifications.update((list) => [...list, { id, type, message }]);

    if (durationMs > 0) {
      setTimeout(() => this.dismiss(id), durationMs);
    }
  }
}
