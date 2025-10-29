import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Local, Inventario, Venta, Empleado } from '../../models/local.model';

@Component({
  selector: 'app-operaciones',
  templateUrl: './operaciones.component.html',
  styleUrls: ['./operaciones.component.css']
})
export class OperacionesComponent implements OnInit {
  locales: Local[] = [];
  localSeleccionado: Local | null = null;
  inventarios: Inventario[] = [];
  ventas: Venta[] = [];
  empleados: Empleado[] = [];

  estadisticasLocal = {
    totalInventarios: 0,
    totalVentas: 0,
    totalEmpleados: 0,
    ventasHoy: 0,
    ingresosHoy: 0,
    valorInventario: 0
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarLocales();
  }

  cargarLocales(): void {
    this.apiService.getLocales().subscribe({
      next: (data: Local[]) => {
        this.locales = data;
        if (data.length > 0 && !this.localSeleccionado) {
          this.seleccionarLocal(data[0]);
        }
      },
      error: (error: any) => console.error('Error cargando locales:', error)
    });
  }

  seleccionarLocal(local: Local): void {
    this.localSeleccionado = local;
    this.cargarDatosLocal();
  }

  cargarDatosLocal(): void {
    if (!this.localSeleccionado) return;

    // Cargar inventarios del local
    this.apiService.getInventarios().subscribe({
      next: (data: Inventario[]) => {
        this.inventarios = data.filter(i => i.idLocal === this.localSeleccionado!.id);
        this.estadisticasLocal.totalInventarios = this.inventarios.length;
        this.calcularValorInventario();
      },
      error: (error: any) => console.error('Error cargando inventarios:', error)
    });

    // Cargar ventas del local
    this.apiService.getVentas().subscribe({
      next: (data: Venta[]) => {
        this.ventas = data.filter(v => v.idLocal === this.localSeleccionado!.id);
        this.estadisticasLocal.totalVentas = this.ventas.length;
        this.calcularVentasHoy();
      },
      error: (error: any) => console.error('Error cargando ventas:', error)
    });

    // Cargar empleados del local
    this.apiService.getEmpleados().subscribe({
      next: (data: Empleado[]) => {
        this.empleados = data.filter(e => e.localId === this.localSeleccionado!.id);
        this.estadisticasLocal.totalEmpleados = this.empleados.length;
      },
      error: (error: any) => console.error('Error cargando empleados:', error)
    });
  }

  calcularVentasHoy(): void {
    const hoy = new Date().toISOString().split('T')[0];
    const ventasHoy = this.ventas.filter(v => v.fecha.startsWith(hoy));
    this.estadisticasLocal.ventasHoy = ventasHoy.length;
    this.estadisticasLocal.ingresosHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0);
  }

  calcularValorInventario(): void {
    this.estadisticasLocal.valorInventario = this.inventarios.reduce(
      (sum, inv) => sum + (inv.precioUnitario * inv.stock), 0
    );
  }
}
