import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SampleModel {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://kodehaus-backend-service-616328447495.us-central1.run.app/api';

  constructor(private http: HttpClient) {}

  getSampleData(): Observable<SampleModel[]> {
    return this.http.get<SampleModel[]>(`${this.baseUrl}/api`);
  }
}
