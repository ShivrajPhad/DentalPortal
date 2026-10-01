import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthTokenStorageService } from './auth-token-storage.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenStorage = inject(AuthTokenStorageService);
  const isLoginRequest = request.url.endsWith('/api/Authentication/login');
  const token = isLoginRequest ? null : tokenStorage.getToken();
  const authorizedRequest = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authorizedRequest).pipe(
    catchError((error: unknown) => {
      if (!isLoginRequest && error instanceof HttpErrorResponse && error.status === 401) {
        tokenStorage.clearToken();
      }
      return throwError(() => error);
    }),
  );
};