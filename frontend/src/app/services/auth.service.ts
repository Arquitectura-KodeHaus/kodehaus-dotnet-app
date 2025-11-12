import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse, UserInfo } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://backend-service-java-2-616328447495.us-central1.run.app/api';
  private tokenKey = 'auth_token';
  private userInfoKey = 'user_info';
  
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Inicializar usuario desde localStorage si existe
    const userInfo = this.getUserInfo();
    if (userInfo) {
      this.currentUserSubject.next(userInfo);
    } else {
      // Si hay un token pero no hay información de usuario, decodificarlo
      const token = this.getToken();
      if (token) {
        this.decodeAndStoreUserInfo(token);
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // ✅ ADAPTADO: El servicio Java espera username y password
    const backendData = {
      username: credentials.cedula,  // Enviar cedula como username
      password: credentials.contrasena  // Enviar sin ñ
    };
    
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, backendData).pipe(
      tap(response => {
        // El servicio Java retorna accessToken en lugar de token
        const token = (response as any).accessToken || response.token;
        this.setToken(token);
        this.decodeAndStoreUserInfo(token);
      })
    );
  }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    // Mapear contrasena a Contraseña para el backend (usando notación de corchetes para caracteres especiales)
    const backendData: any = {
      nombreUsuario: userData.nombreUsuario,
      cedula: userData.cedula,
      idLocal: userData.idLocal
    };
    backendData['contraseña'] = userData.contrasena; // Usar notación de corchetes para la ñ
    return this.http.post<RegisterResponse>(`${this.baseUrl}/auth/register/user`, backendData);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userInfoKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  isAdmin(): boolean {
    const userInfo = this.getUserInfo();
    return userInfo?.rol === 'Admin' || userInfo?.rol === 'MANAGER';  // ✅ Agregar MANAGER
  }

  isUser(): boolean {
    const userInfo = this.getUserInfo();
    return userInfo?.rol === 'User' || userInfo?.rol === 'EMPLOYEE';  // ✅ Agregar EMPLOYEE
  }

  getCurrentUser(): UserInfo | null {
    return this.getUserInfo();
  }

  getUserLocalId(): number | null {
    const userInfo = this.getUserInfo();
    return userInfo?.idLocal || null;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getUserInfo(): UserInfo | null {
    const userInfoStr = localStorage.getItem(this.userInfoKey);
    if (userInfoStr) {
      return JSON.parse(userInfoStr);
    }
    return null;
  }

  private decodeAndStoreUserInfo(token: string): void {
    try {
      // JWT tiene 3 partes separadas por puntos: header.payload.signature
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      
      // ✅ Adaptado para el token del servicio Java
      const idLocal = "1";
      const username = decodedPayload.sub || decodedPayload.username;
      
      // Extraer roles del token Java (puede venir como array)
      let rol = 'User';
      if (decodedPayload.roles && Array.isArray(decodedPayload.roles)) {
        rol = decodedPayload.roles[0]; // Tomar el primer rol
      } else if (decodedPayload.role) {
        rol = decodedPayload.role;
      }
      
      const userInfo: UserInfo = {
        cedula: username || decodedPayload.Cedula || decodedPayload.cedula,
        rol: rol,
        idLocal: idLocal ? parseInt(idLocal, 10) : undefined
      };
      
      localStorage.setItem(this.userInfoKey, JSON.stringify(userInfo));
      this.currentUserSubject.next(userInfo);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
}

