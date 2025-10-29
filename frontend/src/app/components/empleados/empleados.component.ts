import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Empleado, Local } from '../../models/local.model';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  locales: Local[] = [];
  empleadoSeleccionado: Empleado | null = null;
  modoEdicion = false;
  mostrarFormulario = false;

  nuevoEmpleado: Empleado = {
    id: 0,
    nombre: '',
    cargo: '',
    localId: 0
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarEmpleados();
    this.cargarLocales();
  }

  cargarEmpleados(): void {
    this.apiService.getEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
      },
      error: (error) => console.error('Error cargando empleados:', error)
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
    this.nuevoEmpleado = {
      id: 0,
      nombre: '',
      cargo: '',
      localId: 0
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
        error: (error) => console.error('Error actualizando empleado:', error)
      });
    } else {
      this.apiService.crearEmpleado(this.nuevoEmpleado).subscribe({
        next: () => {
          this.cargarEmpleados();
          this.cancelarFormulario();
        },
        error: (error) => console.error('Error creando empleado:', error)
      });
    }
  }

  eliminarEmpleado(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      this.apiService.eliminarEmpleado(id).subscribe({
        next: () => {
          this.cargarEmpleados();
        },
        error: (error) => console.error('Error eliminando empleado:', error)
      });
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.empleadoSeleccionado = null;
    this.modoEdicion = false;
  }

  obtenerNombreLocal(localId: number): string {
    const local = this.locales.find(l => l.id === localId);
    return local ? local.nombre : `Local ${localId}`;
  }

  obtenerCargoClass(cargo: string): string {
    switch (cargo.toLowerCase()) {
      case 'gerente': return 'cargo-gerente';
      case 'vendedor': return 'cargo-vendedor';
      case 'cajero': return 'cargo-cajero';
      case 'supervisor': return 'cargo-supervisor';
      default: return 'cargo-default';
    }
  }
}
