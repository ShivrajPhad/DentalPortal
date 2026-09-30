import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';
import { LoginComponent } from './features/auth/components/login/login.component';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('redirects the default route to the login page', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', LoginComponent);
    const compiled = harness.routeNativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Welcome back');
  });
});
