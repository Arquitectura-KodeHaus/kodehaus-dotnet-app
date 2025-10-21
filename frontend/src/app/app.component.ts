import { Component, OnInit } from '@angular/core';
import { ApiService, SampleModel } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'My Web App';
  data: SampleModel[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = null;
    this.apiService.getSampleData().subscribe({
      next: (response: SampleModel[]) => {
        this.data = response;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error al cargar datos del backend';
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }
}
