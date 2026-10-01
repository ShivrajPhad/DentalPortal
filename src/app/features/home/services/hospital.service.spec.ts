import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HospitalService } from './hospital.service';

describe('HospitalService', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HospitalService, provideHttpClient(), provideHttpClientTesting()],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('gets hospital details from the authentication API', () => {
    const expectedDetails = {
      hospitalName: 'Northside Dental Hospital',
      hospitalCode: 'NSD-01',
      address: '12 Orchard Road',
    };
    let receivedDetails: typeof expectedDetails | undefined;

    TestBed.inject(HospitalService).getHospitalDetails().subscribe((details) => {
      receivedDetails = details;
    });

    const request = httpTestingController.expectOne(
      'https://localhost:44306/api/Authentication/GetHospitalDetails',
    );
    expect(request.request.method).toBe('GET');
    request.flush(expectedDetails);
    expect(receivedDetails).toEqual(expectedDetails);
  });
});