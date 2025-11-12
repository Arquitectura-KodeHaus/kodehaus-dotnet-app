import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Inventario, Venta, Empleado } from '../../models/local.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  inventarios: Inventario[] = [];
  ventas: Venta[] = [];
  empleados: Empleado[] = [];
  
  estadisticas = {
    totalInventarios: 0,
    totalVentas: 0,
    totalEmpleados: 0,
    ventasHoy: 0,
    ingresosHoy: 0
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Cargar inventarios
    this.apiService.getInventarios().subscribe({
      next: (data: Inventario[]) => {
        // Si el usuario no es Admin, filtrar por su local
        if (!this.authService.isAdmin()) {
          const userLocalId = this.authService.getUserLocalId();
          if (userLocalId) {
            data = data.filter(inv => inv.idLocal === userLocalId);
          } else {
            data = [];
          }
        }
        this.inventarios = data;
        this.estadisticas.totalInventarios = data.length;
      },
      error: (error: any) => console.error('Error cargando inventarios:', error)
    });

    // Cargar ventas
    this.apiService.getVentas().subscribe({
      next: (data: Venta[]) => {
        // Si el usuario no es Admin, filtrar por su local
        if (!this.authService.isAdmin()) {
          const userLocalId = this.authService.getUserLocalId();
          if (userLocalId) {
            data = data.filter(v => v.idLocal === userLocalId);
          } else {
            data = [];
          }
        }
        this.ventas = data;
        this.estadisticas.totalVentas = data.length;
        this.calcularVentasHoy(data);
      },
      error: (error: any) => console.error('Error cargando ventas:', error)
    });

    // Cargar empleados solo si el usuario es Admin
    if (this.authService.isAdmin()) {
      this.apiService.getEmpleados().subscribe({
        next: (data: Empleado[]) => {
          this.empleados = data;
          this.estadisticas.totalEmpleados = data.length;
        },
        error: (error: any) => console.error('Error cargando empleados:', error)
      });
    } else {
      // Si no es Admin, establecer empleados en 0
      this.empleados = [];
      this.estadisticas.totalEmpleados = 0;
    }
  }

  calcularVentasHoy(ventas: Venta[]): void {
    const hoy = new Date().toISOString().split('T')[0];
    const ventasHoy = ventas.filter(v => v.fecha.startsWith(hoy));
    this.estadisticas.ventasHoy = ventasHoy.length;
    this.estadisticas.ingresosHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
