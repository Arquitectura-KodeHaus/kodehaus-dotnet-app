import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Venta, Local } from '../../models/local.model';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  ventas: Venta[] = [];
  locales: Local[] = [];
  ventaSeleccionada: Venta | null = null;
  modoEdicion = false;
  mostrarFormulario = false;

  nuevaVenta: Venta = {
    id: 0,
    idLocal: 0,
    fecha: new Date().toISOString().split('T')[0],
    total: 0
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarVentas();
    this.cargarLocales();
  }

  cargarVentas(): void {
    this.apiService.getVentas().subscribe({
      next: (data) => {
        this.ventas = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      },
      error: (error) => console.error('Error cargando ventas:', error)
    });
  }

  cargarLocales(): void {
    this.apiService.getLocales().subscribe({
      next: (data) => {
        this.locales = data;
      },
      error: (error) => console.error('Error cargando locales:', error)
    });
  }

  mostrarFormularioCrear(): void {
    this.modoEdicion = false;
    this.nuevaVenta = {
      id: 0,
      idLocal: 0,
      fecha: new Date().toISOString().split('T')[0],
      total: 0
    };
    this.mostrarFormulario = true;
  }

  mostrarFormularioEditar(venta: Venta): void {
    this.modoEdicion = true;
    this.ventaSeleccionada = venta;
    this.nuevaVenta = { ...venta };
    this.mostrarFormulario = true;
  }

  guardarVenta(): void {
    if (this.modoEdicion && this.ventaSeleccionada) {
      this.apiService.actualizarVenta(this.ventaSeleccionada.id, this.nuevaVenta).subscribe({
        next: () => {
          this.cargarVentas();
          this.cancelarFormulario();
        },
        error: (error) => console.error('Error actualizando venta:', error)
      });
    } else {
      this.apiService.crearVenta(this.nuevaVenta).subscribe({
        next: () => {
          this.cargarVentas();
          this.cancelarFormulario();
        },
        error: (error) => console.error('Error creando venta:', error)
      });
    }
  }

  eliminarVenta(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
      this.apiService.eliminarVenta(id).subscribe({
        next: () => {
          this.cargarVentas();
        },
        error: (error) => console.error('Error eliminando venta:', error)
      });
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.ventaSeleccionada = null;
    this.modoEdicion = false;
  }

  obtenerNombreLocal(idLocal: number): string {
    const local = this.locales.find(l => l.id === idLocal);
    return local ? local.nombre : `Local ${idLocal}`;
  }

  calcularTotalVentas(): number {
    return this.ventas.reduce((sum, venta) => sum + venta.total, 0);
  }

  calcularVentasHoy(): number {
    const hoy = new Date().toISOString().split('T')[0];
    return this.ventas.filter(v => v.fecha.startsWith(hoy)).length;
  }
}
