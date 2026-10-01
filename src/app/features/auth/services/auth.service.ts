import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthTokenStorageService } from './auth-token-storage.service';

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(AuthTokenStorageService);
  private readonly loginUrl = 'https://localhost:44306/api/Authentication/login';

  login(credentials: LoginCredentials): Observable<void> {
    this.tokenStorage.clearToken();

    return this.http.post<unknown>(this.loginUrl, credentials).pipe(
      map((response) => this.extractToken(response)),
      tap((token) => this.tokenStorage.setToken(token)),
      map(() => undefined),
    );
  }

  navigateToHome(): Promise<boolean> {
    return this.router.navigateByUrl('/home');
  }

  private extractToken(response: unknown): string {
    if (typeof response === 'string' && response.trim()) {
      return response.trim();
    }

    if (response && typeof response === 'object') {
      const result = response as Record<string, unknown>;
      const tokenKeys = ['token', 'accessToken', 'jwtToken', 'Token', 'AccessToken', 'JwtToken'];

      for (const key of tokenKeys) {
        const token = result[key];
        if (typeof token === 'string' && token.trim()) {
          return token.trim();
        }
      }

      if (result['data'] && typeof result['data'] === 'object') {
        return this.extractToken(result['data']);
      }
    }

    throw new Error('The sign-in API did not return a JWT token.');
  }
}