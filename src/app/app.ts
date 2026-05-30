import { Component, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth/auth-service';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, MatIconModule, RouterLinkActive, MatTooltipModule, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private platformId = inject(PLATFORM_ID);

  protected readonly title = signal('dashboard-editor');

  private router = inject(Router);
  private authService = inject(AuthService);

  user = this.authService.user;
  isAuthenticated = this.authService.isAuthenticated;

  authEffect = effect(() => {
    console.log(this.isAuthenticated());
    if (this.isAuthenticated()) {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      // this.socketService.initialize(`${environment.wsUrl}?token=${this.authService.getToken()}`);
    }
  });

  logout() {
    this.authService.logout();
    // this.socketService.disconnect();
  }
}
