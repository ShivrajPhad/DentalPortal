import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HomeModule } from '../../home.module';
import { HospitalDetails, HospitalService } from '../../services/hospital.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  const details: HospitalDetails = {
    hospitalName: 'Northside Dental Hospital',
    hospitalCode: 'NSD-01',
    address: '12 Orchard Road',
  };
  let getHospitalDetails: () => ReturnType<HospitalService['getHospitalDetails']>;

  beforeEach(async () => {
    getHospitalDetails = () => of(details);
    await TestBed.configureTestingModule({
      imports: [HomeModule],
      providers: [
        { provide: HospitalService, useValue: { getHospitalDetails: () => getHospitalDetails() } },
      ],
    }).compileComponents();
  });

  it('loads and displays the hospital details', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const main = (fixture.nativeElement as HTMLElement).querySelector('main');
    expect(main?.textContent).toContain('Northside Dental Hospital');
    expect(main?.textContent).toContain('NSD-01');
    expect(main?.textContent).toContain('12 Orchard Road');
  });

  it('shows a retry option when the hospital details request fails', () => {
    getHospitalDetails = () => throwError(() => new Error('Request failed'));
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Hospital details could not be loaded');
    expect((fixture.nativeElement as HTMLElement).querySelector('button')?.textContent).toContain('Try again');
  });
});