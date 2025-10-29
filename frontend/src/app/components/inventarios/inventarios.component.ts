import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Inventario, Local } from '../../models/local.model';

@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class InventariosComponent implements OnInit {
  inventarios: Inventario[] = [];
  locales: Local[] = [];
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarInventarios();
    this.cargarLocales();
  }

  cargarInventarios(): void {
    this.apiService.getInventarios().subscribe({
      next: (data) => {
        this.inventarios = data;
      },
      error: (error) => console.error('Error cargando inventarios:', error)
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
    this.nuevoInventario = {
      id: 0,
      idLocal: 0,
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
        error: (error) => console.error('Error actualizando inventario:', error)
      });
    } else {
      this.apiService.crearInventario(this.nuevoInventario).subscribe({
        next: () => {
          this.cargarInventarios();
          this.cancelarFormulario();
        },
        error: (error) => console.error('Error creando inventario:', error)
      });
    }
  }

  eliminarInventario(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este inventario?')) {
      this.apiService.eliminarInventario(id).subscribe({
        next: () => {
          this.cargarInventarios();
        },
        error: (error) => console.error('Error eliminando inventario:', error)
      });
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.inventarioSeleccionado = null;
    this.modoEdicion = false;
  }

  obtenerNombreLocal(idLocal: number): string {
    const local = this.locales.find(l => l.id === idLocal);
    return local ? local.nombre : `Local ${idLocal}`;
  }

  obtenerStockClass(stock: number): string {
    if (stock === 0) return 'stock-agotado';
    if (stock < 10) return 'stock-bajo';
    return 'stock-normal';
  }
}
