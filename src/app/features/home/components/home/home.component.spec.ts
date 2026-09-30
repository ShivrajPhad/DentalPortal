import { TestBed } from '@angular/core/testing';
import { HomeModule } from '../../home.module';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeModule],
    }).compileComponents();
  });

  it('renders an empty home page', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const main = (fixture.nativeElement as HTMLElement).querySelector('main');
    expect(main).not.toBeNull();
    expect(main?.textContent?.trim()).toBe('');
  });
});