import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface HospitalDetails {
  hospitalName: string | null;
  hospitalCode: string | null;
  address: string | null;
}

@Injectable({ providedIn: 'root' })
export class HospitalService {
  private readonly http = inject(HttpClient);
  private readonly hospitalDetailsUrl = 'https://localhost:44306/api/Authentication/GetHospitalDetails';

  getHospitalDetails(): Observable<HospitalDetails> {
    return this.http.get<HospitalDetails>(this.hospitalDetailsUrl);
  }
}