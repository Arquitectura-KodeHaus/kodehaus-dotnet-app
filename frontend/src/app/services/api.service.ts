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

  // ========== LOCALES ==========
  getLocales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/locales`);
  }

  getLocal(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/locales/${id}`);
  }

  createLocal(local: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/locales`, local);
  }

  crearLocal(local: any): Observable<any> {
    return this.createLocal(local);
  }

  updateLocal(id: number, local: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/locales/${id}`, local);
  }

  actualizarLocal(id: number, local: any): Observable<any> {
    return this.updateLocal(id, local);
  }

  deleteLocal(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/locales/${id}`);
  }

  eliminarLocal(id: number): Observable<any> {
    return this.deleteLocal(id);
  }

  // ========== INVENTARIOS ==========
  getInventarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/inventarios`);
  }

  getInventariosPorLocal(localId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/inventarios/local/${localId}`);
  }

  createInventario(inventario: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/inventarios`, inventario);
  }

  crearInventario(inventario: any): Observable<any> {
    return this.createInventario(inventario);
  }

  updateInventario(id: number, inventario: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/inventarios/${id}`, inventario);
  }

  actualizarInventario(id: number, inventario: any): Observable<any> {
    return this.updateInventario(id, inventario);
  }

  deleteInventario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/inventarios/${id}`);
  }

  eliminarInventario(id: number): Observable<any> {
    return this.deleteInventario(id);
  }

  // ========== VENTAS ==========
  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ventas`);
  }

  getVentasPorLocal(localId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ventas/local/${localId}`);
  }

  createVenta(venta: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/ventas`, venta);
  }

  crearVenta(venta: any): Observable<any> {
    return this.createVenta(venta);
  }

  updateVenta(id: number, venta: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/ventas/${id}`, venta);
  }

  actualizarVenta(id: number, venta: any): Observable<any> {
    return this.updateVenta(id, venta);
  }

  deleteVenta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/ventas/${id}`);
  }

  eliminarVenta(id: number): Observable<any> {
    return this.deleteVenta(id);
  }

  // ========== EMPLEADOS ==========
  getEmpleados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/empleados`);
  }

  getEmpleadosPorLocal(localId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/empleados/local/${localId}`);
  }

  createEmpleado(empleado: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/empleados`, empleado);
  }

  crearEmpleado(empleado: any): Observable<any> {
    return this.createEmpleado(empleado);
  }

  updateEmpleado(id: number, empleado: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/empleados/${id}`, empleado);
  }

  actualizarEmpleado(id: number, empleado: any): Observable<any> {
    return this.updateEmpleado(id, empleado);
  }

  deleteEmpleado(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/empleados/${id}`);
  }

  eliminarEmpleado(id: number): Observable<any> {
    return this.deleteEmpleado(id);
  }
}
