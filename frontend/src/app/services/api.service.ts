import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Local, Inventario, Venta, Empleado, VentaRequest } from '../models/local.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Locales endpoints
  getLocales(): Observable<Local[]> {
    return this.http.get<Local[]>(`${this.baseUrl}/locales`);
  }

  getLocal(id: number): Observable<Local> {
    return this.http.get<Local>(`${this.baseUrl}/locales/${id}`);
  }

  crearLocal(local: Local): Observable<Local> {
    return this.http.post<Local>(`${this.baseUrl}/locales`, local);
  }

  actualizarLocal(id: number, local: Local): Observable<Local> {
    return this.http.put<Local>(`${this.baseUrl}/locales/${id}`, local);
  }

  eliminarLocal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/locales/${id}`);
  }

  // Inventarios endpoints
  getInventarios(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(`${this.baseUrl}/inventarios`);
  }

  getInventario(id: number): Observable<Inventario> {
    return this.http.get<Inventario>(`${this.baseUrl}/inventarios/${id}`);
  }

  crearInventario(inventario: Inventario): Observable<Inventario> {
    return this.http.post<Inventario>(`${this.baseUrl}/inventarios`, inventario);
  }

  actualizarInventario(id: number, inventario: Inventario): Observable<Inventario> {
    return this.http.put<Inventario>(`${this.baseUrl}/inventarios/${id}`, inventario);
  }

  eliminarInventario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/inventarios/${id}`);
  }

  // Ventas endpoints
  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.baseUrl}/ventas`);
  }

  getVenta(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.baseUrl}/ventas/${id}`);
  }

  crearVenta(venta: VentaRequest): Observable<Venta> {
    return this.http.post<Venta>(`${this.baseUrl}/ventas`, venta);
  }

  actualizarVenta(id: number, venta: Venta): Observable<Venta> {
    return this.http.put<Venta>(`${this.baseUrl}/ventas/${id}`, venta);
  }

  eliminarVenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/ventas/${id}`);
  }

  // Empleados endpoints
  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.baseUrl}/empleados`);
  }

  getEmpleado(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.baseUrl}/empleados/${id}`);
  }

  crearEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(`${this.baseUrl}/empleados`, empleado);
  }

  actualizarEmpleado(id: number, empleado: Empleado): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.baseUrl}/empleados/${id}`, empleado);
  }

  eliminarEmpleado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/empleados/${id}`);
  }
}
