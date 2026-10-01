import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthTokenStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  getToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? window.sessionStorage.getItem('auth_token')
      : null;
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.setItem('auth_token', token);
    }
  }

  clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.removeItem('auth_token');
    }
  }
}