import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { InventariosComponent } from './components/inventarios/inventarios.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { EmpleadosComponent } from './components/empleados/empleados.component';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'inventarios', component: InventariosComponent, canActivate: [AuthGuard] },
  { path: 'ventas', component: VentasComponent, canActivate: [AuthGuard] },
  { path: 'empleados', component: EmpleadosComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    UsuariosComponent,
    InventariosComponent,
    VentasComponent,
    EmpleadosComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
