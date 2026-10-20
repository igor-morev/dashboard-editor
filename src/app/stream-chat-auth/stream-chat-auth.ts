import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { AuthService } from '@app/services/auth/auth-service';
import { RouterService } from '@app/services/router-service';

@Component({
  selector: 'sc-stream-chat-auth',
  imports: [ReactiveFormsModule, RouterLink, MatProgressSpinnerModule],
  templateUrl: './stream-chat-auth.html',
  styleUrl: './stream-chat-auth.scss',
})
export class StreamChatAuth {
  private routerService = inject(RouterService);
  private authService = inject(AuthService);

  private route = inject(ActivatedRoute);

  isLoginMode = this.route.snapshot.data['mode'] === 'login';

  private _isSubmitting = signal(false);
  isSubmitting = this._isSubmitting.asReadonly();

  authForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  onSubmit() {
    if (this.authForm.valid) {
      const { username, password } = this.authForm.value;

      const req = this.isLoginMode ? this.authService.login(username!, password!) : this.authService.register(username!, password!);
      this._isSubmitting.set(true);
      // Server errors are surfaced globally as toasts by requestInterceptor — this just needs
      // to hide the loader once the request settles, whichever way it goes.
      req.pipe(finalize(() => this._isSubmitting.set(false))).subscribe({
        next: () => {
          this.routerService.navigate(['/project']);
        },
        error: () => {
          // handled by requestInterceptor
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
