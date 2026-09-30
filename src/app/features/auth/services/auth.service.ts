import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  navigateToHome(): Promise<boolean> {
    return this.router.navigateByUrl('/home');
  }
}