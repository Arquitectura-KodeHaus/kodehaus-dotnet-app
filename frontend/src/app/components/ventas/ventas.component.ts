import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Venta, Inventario, VentaRequest } from '../../models/local.model';

interface ProductoSeleccionado {
  inventario: Inventario;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  ventas: Venta[] = [];
  inventarios: Inventario[] = [];
  mostrarFormulario = false;

  productosSeleccionados: ProductoSeleccionado[] = [];
  totalVenta = 0;
  idLocalVenta = 0;

  estadisticas = {
    totalVentas: 0,
    ingresosTotales: 0,
    ventasHoy: 0,
    ingresosHoy: 0,
    promedioVenta: 0
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
    this.cargarInventarios();
  }

  cargarVentas(): void {
    this.apiService.getVentas().subscribe({
      next: (data) => {
        // Si el usuario no es Admin, filtrar por su local
        if (!this.authService.isAdmin()) {
          const userLocalId = this.authService.getUserLocalId();
          if (userLocalId) {
            data = data.filter(v => v.idLocal === userLocalId);
          } else {
            data = [];
          }
        }
        this.ventas = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.calcularEstadisticas();
      },
      error: (error) => console.error('Error cargando ventas:', error)
    });
  }

  cargarInventarios(): void {
    this.apiService.getInventarios().subscribe({
      next: (data) => {
        // Si el usuario no es Admin, filtrar por su local
        if (!this.authService.isAdmin()) {
          const userLocalId = this.authService.getUserLocalId();
          if (userLocalId) {
            data = data.filter(i => i.idLocal === userLocalId);
          } else {
            data = [];
          }
        }
        this.inventarios = data.filter(i => i.stock > 0);
      },
      error: (error) => console.error('Error cargando inventarios:', error)
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
    this.productosSeleccionados = [];
    this.totalVenta = 0;
    // Si el usuario no es Admin, usar su local automáticamente
    const userLocalId = this.authService.getUserLocalId();
    this.idLocalVenta = userLocalId || 0;
    this.mostrarFormulario = true;
  }

  agregarProducto(inventario: Inventario): void {
    if (this.idLocalVenta === 0) {
      alert('Por favor, selecciona primero un Local ID');
      return;
    }

    if (inventario.idLocal !== this.idLocalVenta) {
      alert('El producto debe pertenecer al mismo local');
      return;
    }

    const existente = this.productosSeleccionados.find(p => p.inventario.id === inventario.id);
    
    if (existente) {
      if (existente.cantidad < inventario.stock) {
        existente.cantidad++;
        existente.subtotal = existente.cantidad * existente.inventario.precioUnitario;
      } else {
        alert('No hay suficiente stock disponible');
      }
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

  onLocalIdChange(): void {
    // Filtrar inventarios por local seleccionado
    this.productosSeleccionados = [];
    this.calcularTotal();
  }

  guardarVenta(): void {
    if (this.idLocalVenta === 0) {
      alert('Por favor, selecciona un Local ID');
      return;
    }

    if (this.productosSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un producto');
      return;
    }

    const ventaRequest: VentaRequest = {
      idLocal: this.idLocalVenta,
      ventaInventarios: this.productosSeleccionados.map(p => ({
        idInventario: p.inventario.id,
        cantidad: p.cantidad
      }))
    };

    this.apiService.crearVenta(ventaRequest).subscribe({
      next: () => {
        this.cargarVentas();
        this.cargarInventarios(); // Recargar inventarios para actualizar stock
        this.cancelarFormulario();
      },
      error: (error: any) => console.error('Error creando venta:', error)
    });
  }

  eliminarVenta(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
      this.apiService.eliminarVenta(id).subscribe({
        next: () => {
          this.cargarVentas();
        },
        error: (error: any) => console.error('Error eliminando venta:', error)
      });
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.productosSeleccionados = [];
    this.totalVenta = 0;
    this.idLocalVenta = 0;
  }

  getInventariosDisponibles(): Inventario[] {
    if (this.idLocalVenta === 0) {
      return this.inventarios;
    }
    return this.inventarios.filter(i => i.idLocal === this.idLocalVenta && i.stock > 0);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
