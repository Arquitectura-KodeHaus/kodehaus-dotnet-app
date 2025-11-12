export interface LoginRequest {
  cedula: string;
  contrasena: string; // Sin ñ para evitar problemas en templates de Angular
}

export interface RegisterRequest {
  nombreUsuario: string;
  cedula: string;
  contrasena: string; // Sin ñ para evitar problemas en templates de Angular
  idLocal: number;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    nombreUsuario: string;
    cedula: string;
    rol: string;
  };
}

export interface UserInfo {
  cedula: string;
  rol: string;
  idLocal?: number;
}

