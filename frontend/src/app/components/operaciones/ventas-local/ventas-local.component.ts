import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Venta, Local, Inventario, VentaRequest } from '../../../models/local.model';

interface ProductoSeleccionado {
  inventario: Inventario;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-ventas-local',
  templateUrl: './ventas-local.component.html',
  styleUrls: ['./ventas-local.component.css']
})
export class VentasLocalComponent implements OnInit {
  ventas: Venta[] = [];
  inventarios: Inventario[] = [];
  local: Local | null = null;
  ventaSeleccionada: Venta | null = null;
  modoEdicion = false;
  mostrarFormulario = false;

  productosSeleccionados: ProductoSeleccionado[] = [];
  totalVenta = 0;

  estadisticas = {
    totalVentas: 0,
    ingresosTotales: 0,
    ventasHoy: 0,
    ingresosHoy: 0,
    promedioVenta: 0
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
        this.cargarVentas(localId);
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
      },
      error: (error: any) => console.error('Error cargando local:', error)
    });
  }

  cargarInventarios(localId: number): void {
    this.apiService.getInventarios().subscribe({
      next: (data: Inventario[]) => {
        this.inventarios = data.filter(i => i.idLocal === localId && i.stock > 0);
        console.log('Inventarios cargados para local', localId, ':', this.inventarios);
      },
      error: (error: any) => console.error('Error cargando inventarios:', error)
    });
  }

  cargarVentas(localId: number): void {
    this.apiService.getVentas().subscribe({
      next: (data: Venta[]) => {
        this.ventas = data.filter(v => v.idLocal === localId)
          .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        console.log('Ventas cargadas para local', localId, ':', this.ventas);
        this.calcularEstadisticas();
      },
      error: (error: any) => console.error('Error cargando ventas:', error)
    });
  }

  calcularEstadisticas(): void {
    this.estadisticas.totalVentas = this.ventas.length;
    this.estadisticas.ingresosTotales = this.ventas.reduce((sum, v) => sum + v.total, 0);
    
    const hoy = new Date().toISOString().split('T')[0];
    const ventasHoy = this.ventas.filter(v => v.fecha.startsWith(hoy));
    this.estadisticas.ventasHoy = ventasHoy.length;
    this.estadisticas.ingresosHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0);
    
    this.estadisticas.promedioVenta = this.estadisticas.totalVentas > 0 
      ? this.estadisticas.ingresosTotales / this.estadisticas.totalVentas 
      : 0;
  }

  mostrarFormularioCrear(): void {
    this.modoEdicion = false;
    this.productosSeleccionados = [];
    this.totalVenta = 0;
    this.mostrarFormulario = true;
  }

  agregarProducto(inventario: Inventario): void {
    const existente = this.productosSeleccionados.find(p => p.inventario.id === inventario.id);
    
    if (existente) {
      existente.cantidad++;
      existente.subtotal = existente.cantidad * existente.inventario.precioUnitario;
    } else {
      this.productosSeleccionados.push({
        inventario: inventario,
        cantidad: 1,
        subtotal: inventario.precioUnitario
      });
    }
    
    this.calcularTotal();
  }

  actualizarCantidad(producto: ProductoSeleccionado, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminarProducto(producto);
      return;
    }
    
    if (cantidad > producto.inventario.stock) {
      cantidad = producto.inventario.stock;
    }
    
    producto.cantidad = cantidad;
    producto.subtotal = cantidad * producto.inventario.precioUnitario;
    this.calcularTotal();
  }

  actualizarCantidadFromInput(producto: ProductoSeleccionado, event: Event): void {
    const target = event.target as HTMLInputElement;
    const cantidad = parseInt(target.value) || 0;
    this.actualizarCantidad(producto, cantidad);
  }

  eliminarProducto(producto: ProductoSeleccionado): void {
    const index = this.productosSeleccionados.indexOf(producto);
    if (index > -1) {
      this.productosSeleccionados.splice(index, 1);
      this.calcularTotal();
    }
  }

  calcularTotal(): void {
    this.totalVenta = this.productosSeleccionados.reduce((sum, p) => sum + p.subtotal, 0);
  }

  guardarVenta(): void {
    if (this.productosSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un producto');
      return;
    }

    const ventaRequest: VentaRequest = {
      idLocal: this.local!.id,
      ventaInventarios: this.productosSeleccionados.map(p => ({
        idInventario: p.inventario.id,
        cantidad: p.cantidad
      }))
    };

    this.apiService.crearVenta(ventaRequest).subscribe({
      next: () => {
        this.cargarVentas(this.local!.id);
        this.cargarInventarios(this.local!.id); // Recargar inventarios para actualizar stock
        this.cancelarFormulario();
      },
      error: (error: any) => console.error('Error creando venta:', error)
    });
  }

  eliminarVenta(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
      this.apiService.eliminarVenta(id).subscribe({
        next: () => {
          this.cargarVentas(this.local!.id);
        },
        error: (error: any) => console.error('Error eliminando venta:', error)
      });
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.productosSeleccionados = [];
    this.totalVenta = 0;
  }

  volverAOperaciones(): void {
    this.router.navigate(['/operaciones']);
  }
}
