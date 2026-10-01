import { Component, OnInit, inject } from '@angular/core';
import { HospitalDetails, HospitalService } from '../../services/hospital.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly hospitalService = inject(HospitalService);

  hospitalDetails: HospitalDetails | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadHospitalDetails();
  }

  loadHospitalDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.hospitalService.getHospitalDetails().subscribe({
      next: (details) => {
        this.hospitalDetails = details;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Hospital details could not be loaded. Please try again.';
      },
    });
  }
}