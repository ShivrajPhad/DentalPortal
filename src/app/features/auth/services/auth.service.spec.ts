import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, LoginCredentials } from './auth.service';
import { AuthTokenStorageService } from './auth-token-storage.service';
import { authInterceptor } from './auth.interceptor';

describe('AuthService', () => {
  let requestedUrl: string | undefined;
  let httpTestingController: HttpTestingController;
  let storedToken: string | null;

  beforeEach(() => {
    requestedUrl = undefined;
    storedToken = null;
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        {
          provide: AuthTokenStorageService,
          useValue: {
            getToken: () => storedToken,
            setToken: (token: string) => { storedToken = token; },
            clearToken: () => { storedToken = null; },
          },
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl: (url: string) => {
              requestedUrl = url;
              return Promise.resolve(true);
            },
          },
        },
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('sends username and password to the login endpoint', () => {
    const credentials: LoginCredentials = { username: 'dentist', password: 'secret' };

    TestBed.inject(AuthService).login(credentials).subscribe();

    const request = httpTestingController.expectOne('https://localhost:44306/api/Authentication/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(credentials);
    request.flush({ accessToken: 'header.payload.signature' });
    expect(storedToken).toBe('header.payload.signature');
  });

  it('adds the stored JWT as a bearer token on subsequent requests', () => {
    storedToken = 'header.payload.signature';
    TestBed.inject(HttpClient).get('/api/patients').subscribe();

    const request = httpTestingController.expectOne('/api/patients');
    expect(request.request.headers.get('Authorization')).toBe('Bearer header.payload.signature');
    request.flush([]);
  });

  it('clears the stored JWT when an API rejects it with 401', () => {
    storedToken = 'expired.jwt.token';
    TestBed.inject(HttpClient).get('/api/patients').subscribe({ error: () => undefined });

    const request = httpTestingController.expectOne('/api/patients');
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(storedToken).toBeNull();
  });

  it('navigates to the home route', async () => {
    await TestBed.inject(AuthService).navigateToHome();

    expect(requestedUrl).toBe('/home');
  });
});