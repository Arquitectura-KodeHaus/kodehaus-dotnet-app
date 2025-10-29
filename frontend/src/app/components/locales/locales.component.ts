import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Local } from '../../models/local.model';

@Component({
  selector: 'app-locales',
  templateUrl: './locales.component.html',
  styleUrls: ['./locales.component.css']
})
export class LocalesComponent implements OnInit {
  locales: Local[] = [];
  localSeleccionado: Local | null = null;
  modoEdicion = false;
  mostrarFormulario = false;

  nuevoLocal: Local = {
    id: 0,
    idPlaza: 1,
    nombre: '',
    categoria: '',
    numeroLocal: '',
    estado: 'Activo'
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarLocales();
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
    this.nuevoLocal = {
      id: 0,
      idPlaza: 1,
      nombre: '',
      categoria: '',
      numeroLocal: '',
      estado: 'Activo'
    };
    this.mostrarFormulario = true;
  }

  mostrarFormularioEditar(local: Local): void {
    this.modoEdicion = true;
    this.localSeleccionado = local;
    this.nuevoLocal = { ...local };
    this.mostrarFormulario = true;
  }

  guardarLocal(): void {
    if (this.modoEdicion && this.localSeleccionado) {
      this.apiService.actualizarLocal(this.localSeleccionado.id, this.nuevoLocal).subscribe({
        next: () => {
          this.cargarLocales();
          this.cancelarFormulario();
        },
        error: (error) => console.error('Error actualizando local:', error)
      });
    } else {
      this.apiService.crearLocal(this.nuevoLocal).subscribe({
        next: () => {
          this.cargarLocales();
          this.cancelarFormulario();
        },
        error: (error) => console.error('Error creando local:', error)
      });
    }
  }

  eliminarLocal(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este local?')) {
      this.apiService.eliminarLocal(id).subscribe({
        next: () => {
          this.cargarLocales();
        },
        error: (error) => console.error('Error eliminando local:', error)
      });
    }
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.localSeleccionado = null;
    this.modoEdicion = false;
  }

  obtenerEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'activo': return 'estado-activo';
      case 'inactivo': return 'estado-inactivo';
      case 'mantenimiento': return 'estado-mantenimiento';
      default: return 'estado-default';
    }
  }
}
