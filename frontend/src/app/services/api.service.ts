import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SampleModel {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSampleData(): Observable<SampleModel[]> {
    return this.http.get<SampleModel[]>(`${this.baseUrl}/api`);
  }

  // Métodos para Locales
  getLocales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/locales`);
  }

  createLocal(local: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/locales`, local);
  }

  updateLocal(id: number, local: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/locales/${id}`, local);
  }

  deleteLocal(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/locales/${id}`);
  }

  // Métodos para Inventarios
  getInventarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/inventarios`);
  }

  createInventario(inventario: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/inventarios`, inventario);
  }

  updateInventario(id: number, inventario: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/inventarios/${id}`, inventario);
  }

  deleteInventario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/inventarios/${id}`);
  }

  // Métodos para Ventas
  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ventas`);
  }

  createVenta(venta: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ventas`, venta);
  }

  // Métodos para Empleados
  getEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/empleados`);
  }

  createEmpleado(empleado: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/empleados`, empleado);
  }

  updateEmpleado(id: number, empleado: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/empleados/${id}`, empleado);
  }

  deleteEmpleado(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/empleados/${id}`);
  }
}
