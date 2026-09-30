import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let requestedUrl: string | undefined;

  beforeEach(() => {
    requestedUrl = undefined;
    TestBed.configureTestingModule({
      providers: [
        AuthService,
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
  });

  it('navigates to the home route', async () => {
    await TestBed.inject(AuthService).navigateToHome();

    expect(requestedUrl).toBe('/home');
  });
});