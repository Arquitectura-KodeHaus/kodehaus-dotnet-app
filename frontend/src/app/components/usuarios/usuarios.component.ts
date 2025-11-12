import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { RegisterRequest, RegisterResponse } from '../../models/auth.model';
import { Local } from '../../models/local.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  nuevoUsuario: RegisterRequest = {
    nombreUsuario: '',
    cedula: '',
    contrasena: '',
    idLocal: 0
  };
  
  locales: Local[] = [];
  mostrarFormulario = false;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Verificar que el usuario sea Admin
    if (!this.authService.isAdmin()) {
      // Esto no debería pasar si el guard está funcionando, pero por seguridad
      console.error('No tienes permisos para acceder a esta página');
    }
    this.cargarLocales();
  }

  cargarLocales(): void {
    this.apiService.getLocales().subscribe({
      next: (data) => {
        this.locales = data;
      },
      error: (error) => {
        console.error('Error cargando locales:', error);
        this.errorMessage = 'Error al cargar los locales disponibles';
      }
    });
  }

  mostrarFormularioCrear(): void {
    this.mostrarFormulario = true;
    this.nuevoUsuario = {
      nombreUsuario: '',
      cedula: '',
      contrasena: '',
      idLocal: 0
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  guardarUsuario(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    // Validar que se haya seleccionado un local
    if (!this.nuevoUsuario.idLocal || this.nuevoUsuario.idLocal === 0) {
      this.errorMessage = 'Debes seleccionar un local para el usuario';
      return;
    }
    
    this.isLoading = true;

    this.authService.register(this.nuevoUsuario).subscribe({
      next: (response: RegisterResponse) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Usuario creado correctamente';
        this.mostrarFormulario = false;
        this.nuevoUsuario = {
          nombreUsuario: '',
          cedula: '',
          contrasena: '',
          idLocal: 0
        };
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al crear el usuario';
      }
    });
  }
}

