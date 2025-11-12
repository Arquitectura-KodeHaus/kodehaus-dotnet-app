import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Inventario } from '../../models/local.model';

@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class InventariosComponent implements OnInit {
  inventarios: Inventario[] = [];
  inventarioSeleccionado: Inventario | null = null;
  modoEdicion = false;
  mostrarFormulario = false;

  nuevoInventario: Inventario = {
    id: 0,
    idLocal: 0,
    idProductoCatalogo: 0,
    precioUnitario: 0,
    stock: 0
  };

  estadisticas = {
    totalProductos: 0,
    valorTotal: 0,
    stockBajo: 0,
    stockAgotado: 0
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarInventarios();
  }

  cargarInventarios(): void {
    this.apiService.getInventarios().subscribe({
      next: (data) => {
        // Si el usuario no es Admin, filtrar por su local
        if (!this.authService.isAdmin()) {
          const userLocalId = this.authService.getUserLocalId();
          if (userLocalId) {
            this.inventarios = data.filter(inv => inv.idLocal === userLocalId);
          } else {
            this.inventarios = [];
          }
        } else {
          this.inventarios = data;
        }
        this.calcularEstadisticas();
      },
      error: (error) => console.error('Error cargando inventarios:', error)
    });
  }

  calcularEstadisticas(): void {
    this.estadisticas.totalProductos = this.inventarios.length;
    this.estadisticas.valorTotal = this.inventarios.reduce(
      (sum, inv) => sum + (inv.precioUnitario * inv.stock), 0
    );
    this.estadisticas.stockBajo = this.inventarios.filter(inv => inv.stock < 10 && inv.stock > 0).length;
    this.estadisticas.stockAgotado = this.inventarios.filter(inv => inv.stock === 0).length;
  }

  mostrarFormularioCrear(): void {
    this.modoEdicion = false;
    const userLocalId = this.authService.getUserLocalId();
    this.nuevoInventario = {
      id: 0,
      idLocal: userLocalId || 0,
      idProductoCatalogo: 0,
      precioUnitario: 0,
      stock: 0
    };
    this.mostrarFormulario = true;
  }

  mostrarFormularioEditar(inventario: Inventario): void {
    this.modoEdicion = true;
    this.inventarioSeleccionado = inventario;
    this.nuevoInventario = { ...inventario };
    this.mostrarFormulario = true;
  }

  guardarInventario(): void {
    if (this.modoEdicion && this.inventarioSeleccionado) {
      this.apiService.actualizarInventario(this.inventarioSeleccionado.id, this.nuevoInventario).subscribe({
        next: () => {
          this.cargarInventarios();
          this.cancelarFormulario();
        },
        error: (error: any) => console.error('Error actualizando inventario:', error)
      });
    } else {
      this.apiService.crearInventario(this.nuevoInventario).subscribe({
        next: () => {
          this.cargarInventarios();
          this.cancelarFormulario();
        },
        error: (error: any) => console.error('Error creando inventario:', error)
      });
    }
  }

  eliminarInventario(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este inventario?')) {
      this.apiService.eliminarInventario(id).subscribe({
        next: () => {
          this.cargarInventarios();
        },
        error: (error: any) => console.error('Error eliminando inventario:', error)
      });
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.inventarioSeleccionado = null;
    this.modoEdicion = false;
  }

  obtenerStockClass(stock: number): string {
    if (stock === 0) return 'stock-agotado';
    if (stock < 10) return 'stock-bajo';
    return 'stock-normal';
  }
}
