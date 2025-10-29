import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LocalesComponent } from './components/locales/locales.component';
import { OperacionesComponent } from './components/operaciones/operaciones.component';
import { InventariosLocalComponent } from './components/operaciones/inventarios-local/inventarios-local.component';
import { VentasLocalComponent } from './components/operaciones/ventas-local/ventas-local.component';
import { EmpleadosLocalComponent } from './components/operaciones/empleados-local/empleados-local.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'locales', component: LocalesComponent },
  { path: 'operaciones', component: OperacionesComponent },
  { path: 'operaciones/inventarios', component: InventariosLocalComponent },
  { path: 'operaciones/ventas', component: VentasLocalComponent },
  { path: 'operaciones/empleados', component: EmpleadosLocalComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LocalesComponent,
    OperacionesComponent,
    InventariosLocalComponent,
    VentasLocalComponent,
    EmpleadosLocalComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
