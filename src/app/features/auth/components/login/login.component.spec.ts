import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthModule } from '../../auth.module';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let navigationRequested: boolean;

  beforeEach(async () => {
    navigationRequested = false;
    await TestBed.configureTestingModule({
      imports: [AuthModule],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
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

  it('requests navigation to the home page', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    fixture.componentInstance.openHome();

    expect(navigationRequested).toBe(true);
  });
});