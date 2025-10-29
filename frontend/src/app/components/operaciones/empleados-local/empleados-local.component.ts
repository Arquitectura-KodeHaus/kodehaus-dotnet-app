import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Empleado, Local } from '../../../models/local.model';

@Component({
  selector: 'app-empleados-local',
  templateUrl: './empleados-local.component.html',
  styleUrls: ['./empleados-local.component.css']
})
export class EmpleadosLocalComponent implements OnInit {
  empleados: Empleado[] = [];
  local: Local | null = null;
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const localId = +params['localId']; // Convertir a number
      if (localId && localId > 0) {
        this.cargarLocal(localId);
        this.cargarEmpleados(localId);
      } else {
        this.router.navigate(['/operaciones']);
      }
    });
  }

  cargarLocal(localId: number): void {
    this.apiService.getLocal(localId).subscribe({
      next: (data: Local) => {
        this.local = data;
        this.nuevoEmpleado.localId = localId;
      },
      error: (error: any) => console.error('Error cargando local:', error)
    });
  }

  cargarEmpleados(localId: number): void {
    this.apiService.getEmpleados().subscribe({
      next: (data: Empleado[]) => {
        this.empleados = data.filter(e => e.localId === localId);
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
    this.nuevoEmpleado = {
      id: 0,
      nombre: '',
      cargo: '',
      localId: this.local!.id
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
          this.cargarEmpleados(this.local!.id);
          this.cancelarFormulario();
        },
        error: (error: any) => console.error('Error actualizando empleado:', error)
      });
    } else {
      this.apiService.crearEmpleado(this.nuevoEmpleado).subscribe({
        next: () => {
          this.cargarEmpleados(this.local!.id);
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
          this.cargarEmpleados(this.local!.id);
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

  volverAOperaciones(): void {
    this.router.navigate(['/operaciones']);
  }

  getCargos(): string[] {
    return Object.keys(this.estadisticas.porCargo);
  }
}
