import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AuthModule } from '../../auth.module';
import { AuthService, LoginCredentials } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let submittedCredentials: LoginCredentials | undefined;
  let navigationRequested: boolean;
  let loginResult: Observable<unknown>;

  beforeEach(async () => {
    submittedCredentials = undefined;
    navigationRequested = false;
    loginResult = of(undefined);

    await TestBed.configureTestingModule({
      imports: [AuthModule],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            login: (credentials: LoginCredentials) => {
              submittedCredentials = credentials;
              return loginResult;
            },
            navigateToHome: () => {
              navigationRequested = true;
              return Promise.resolve(true);
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('renders the login page', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toContain('Welcome back');
  });

  it('submits credentials and navigates only after successful authentication', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.componentInstance.username = 'dentist';
    fixture.componentInstance.password = 'secret';

    fixture.componentInstance.login();

    expect(submittedCredentials).toEqual({ username: 'dentist', password: 'secret' });
    expect(navigationRequested).toBe(true);
  });

  it('shows an error and stays on the login page when authentication fails', () => {
    loginResult = throwError(() => new HttpErrorResponse({ status: 401 }));
    const fixture = TestBed.createComponent(LoginComponent);

    fixture.componentInstance.login();

    expect(navigationRequested).toBe(false);
    expect(fixture.componentInstance.errorMessage).toBe('The username or password is incorrect.');
  });

  it('explains that the API must allow the frontend origin when the request is blocked', () => {
    loginResult = throwError(() => new HttpErrorResponse({ status: 0 }));
    const fixture = TestBed.createComponent(LoginComponent);

    fixture.componentInstance.login();

    expect(fixture.componentInstance.errorMessage).toContain('allows requests from http://localhost:4200');
  });
});