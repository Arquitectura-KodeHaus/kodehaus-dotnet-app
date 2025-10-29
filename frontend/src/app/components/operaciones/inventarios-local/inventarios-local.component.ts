import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Inventario, Local } from '../../../models/local.model';

@Component({
  selector: 'app-inventarios-local',
  templateUrl: './inventarios-local.component.html',
  styleUrls: ['./inventarios-local.component.css']
})
export class InventariosLocalComponent implements OnInit {
  inventarios: Inventario[] = [];
  local: Local | null = null;
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const localId = +params['localId']; // Convertir a number
      if (localId && localId > 0) {
        this.cargarLocal(localId);
        this.cargarInventarios(localId);
      } else {
        this.router.navigate(['/operaciones']);
      }
    });
  }

  cargarLocal(localId: number): void {
    this.apiService.getLocal(localId).subscribe({
      next: (data: Local) => {
        this.local = data;
        this.nuevoInventario.idLocal = localId;
      },
      error: (error: any) => console.error('Error cargando local:', error)
    });
  }

  cargarInventarios(localId: number): void {
    this.apiService.getInventarios().subscribe({
      next: (data: Inventario[]) => {
        this.inventarios = data.filter(i => i.idLocal === localId);
        console.log('Inventarios cargados para local', localId, ':', this.inventarios);
        this.calcularEstadisticas();
      },
      error: (error: any) => console.error('Error cargando inventarios:', error)
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
    this.nuevoInventario = {
      id: 0,
      idLocal: this.local!.id,
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
          this.cargarInventarios(this.local!.id);
          this.cancelarFormulario();
        },
        error: (error: any) => console.error('Error actualizando inventario:', error)
      });
    } else {
      this.apiService.crearInventario(this.nuevoInventario).subscribe({
        next: () => {
          this.cargarInventarios(this.local!.id);
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
          this.cargarInventarios(this.local!.id);
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
    if (stock === 0) return 'status-inactive';
    if (stock < 10) return 'status-maintenance';
    return 'status-active';
  }

  volverAOperaciones(): void {
    this.router.navigate(['/operaciones']);
  }
}
