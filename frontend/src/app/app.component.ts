import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserInfo } from './models/auth.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Plazapp - Gestión de Inventarios y Ventas';
  currentUser: UserInfo | null = null;
  isLoginPage: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse a cambios de usuario
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Verificar si estamos en la página de login
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage = event.url === '/login';
    });

    // Verificar inmediatamente
    this.isLoginPage = this.router.url === '/login';
  }

  logout(): void {
    this.authService.logout();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
