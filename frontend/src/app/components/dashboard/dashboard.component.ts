import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Local, Inventario, Venta, Empleado } from '../../models/local.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  locales: Local[] = [];
  inventarios: Inventario[] = [];
  ventas: Venta[] = [];
  empleados: Empleado[] = [];
  
  estadisticas = {
    totalLocales: 0,
    totalInventarios: 0,
    totalVentas: 0,
    totalEmpleados: 0,
    ventasHoy: 0,
    ingresosHoy: 0
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Cargar locales
    this.apiService.getLocales().subscribe({
      next: (data: Local[]) => {
        this.locales = data;
        this.estadisticas.totalLocales = data.length;
      },
      error: (error: any) => console.error('Error cargando locales:', error)
    });

    // Cargar inventarios
    this.apiService.getInventarios().subscribe({
      next: (data: Inventario[]) => {
        this.inventarios = data;
        this.estadisticas.totalInventarios = data.length;
      },
      error: (error: any) => console.error('Error cargando inventarios:', error)
    });

    // Cargar ventas
    this.apiService.getVentas().subscribe({
      next: (data: Venta[]) => {
        this.ventas = data;
        this.estadisticas.totalVentas = data.length;
        this.calcularVentasHoy(data);
      },
      error: (error: any) => console.error('Error cargando ventas:', error)
    });

    // Cargar empleados
    this.apiService.getEmpleados().subscribe({
      next: (data: Empleado[]) => {
        this.empleados = data;
        this.estadisticas.totalEmpleados = data.length;
      },
      error: (error: any) => console.error('Error cargando empleados:', error)
    });
  }

  calcularVentasHoy(ventas: Venta[]): void {
    const hoy = new Date().toISOString().split('T')[0];
    const ventasHoy = ventas.filter(v => v.fecha.startsWith(hoy));
    this.estadisticas.ventasHoy = ventasHoy.length;
    this.estadisticas.ingresosHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0);
  }
}
