import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Empleado } from '../../models/local.model';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  empleadoSeleccionado: Empleado | null = null;
  modoEdicion = false;
  mostrarFormulario = false;

  nuevoEmpleado: Empleado = {
    id: 0,
    nombre: '',
    cargo: '',
    localId: 0
  };

  estadisticas = {
    totalEmpleados: 0,
    porCargo: {} as { [key: string]: number }
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.apiService.getEmpleados().subscribe({
      next: (data: Empleado[]) => {
        // Si el usuario no es Admin, filtrar por su local
        if (!this.authService.isAdmin()) {
          const userLocalId = this.authService.getUserLocalId();
          if (userLocalId) {
            this.empleados = data.filter(emp => emp.localId === userLocalId);
          } else {
            this.empleados = [];
          }
        } else {
          this.empleados = data;
        }
        this.calcularEstadisticas();
      },
      error: (error: any) => console.error('Error cargando empleados:', error)
    });
  }

  calcularEstadisticas(): void {
    this.estadisticas.totalEmpleados = this.empleados.length;
    this.estadisticas.porCargo = {};
    
    this.empleados.forEach(emp => {
      this.estadisticas.porCargo[emp.cargo] = (this.estadisticas.porCargo[emp.cargo] || 0) + 1;
    });
  }

  mostrarFormularioCrear(): void {
    this.modoEdicion = false;
    const userLocalId = this.authService.getUserLocalId();
    this.nuevoEmpleado = {
      id: 0,
      nombre: '',
      cargo: '',
      localId: userLocalId || 0
    };
    this.mostrarFormulario = true;
  }

  mostrarFormularioEditar(empleado: Empleado): void {
    this.modoEdicion = true;
    this.empleadoSeleccionado = empleado;
    this.nuevoEmpleado = { ...empleado };
    this.mostrarFormulario = true;
  }

  guardarEmpleado(): void {
    if (this.modoEdicion && this.empleadoSeleccionado) {
      this.apiService.actualizarEmpleado(this.empleadoSeleccionado.id, this.nuevoEmpleado).subscribe({
        next: () => {
          this.cargarEmpleados();
          this.cancelarFormulario();
        },
        error: (error: any) => console.error('Error actualizando empleado:', error)
      });
    } else {
      this.apiService.crearEmpleado(this.nuevoEmpleado).subscribe({
        next: () => {
          this.cargarEmpleados();
          this.cancelarFormulario();
        },
        error: (error: any) => console.error('Error creando empleado:', error)
      });
    }
  }

  eliminarEmpleado(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      this.apiService.eliminarEmpleado(id).subscribe({
        next: () => {
          this.cargarEmpleados();
        },
        error: (error: any) => console.error('Error eliminando empleado:', error)
      });
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.empleadoSeleccionado = null;
    this.modoEdicion = false;
  }

  obtenerCargoClass(cargo: string): string {
    switch (cargo.toLowerCase()) {
      case 'gerente': return 'status-active';
      case 'supervisor': return 'status-maintenance';
      case 'vendedor': return 'status-active';
      case 'cajero': return 'status-maintenance';
      default: return 'status-active';
    }
  }

  getCargos(): string[] {
    return Object.keys(this.estadisticas.porCargo);
  }
}
