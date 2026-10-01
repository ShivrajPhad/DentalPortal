import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);

  username = '';
  password = '';
  isSubmitting = false;
  errorMessage = '';

  login(): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        void this.authService.navigateToHome().then((navigated) => {
          if (!navigated) {
            this.showNavigationError();
          }
        }).catch(() => this.showNavigationError());
      },
      error: (error: unknown) => {
        this.isSubmitting = false;
        this.errorMessage = error instanceof HttpErrorResponse
          ? error.status === 0
            ? 'Cannot reach the sign-in API. Check that it is running and allows requests from http://localhost:4200.'
            : error.status === 401
              ? 'The username or password is incorrect.'
              : 'Sign-in failed. Please try again.'
          : error instanceof Error
            ? error.message
            : 'Sign-in failed. Please try again.';
      },
    });
  }

  private showNavigationError(): void {
    this.isSubmitting = false;
    this.errorMessage = 'Sign-in succeeded, but the home page could not be opened.';
  }
}