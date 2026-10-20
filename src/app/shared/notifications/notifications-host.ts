import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationsService } from './notifications-service';

/**
 * Mount once near the app root (e.g. app.html). Plain CSS only, no Tailwind/Material — the
 * "de-" selector prefix is the one thing specific to this project; rename it if lifting this
 * folder into another one.
 */
@Component({
  selector: 'de-notifications-host',
  templateUrl: './notifications-host.html',
  styleUrl: './notifications-host.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsHost {
  private notificationsService = inject(NotificationsService);

  notifications = this.notificationsService.notifications;

  dismiss(id: number): void {
    this.notificationsService.dismiss(id);
  }
}
