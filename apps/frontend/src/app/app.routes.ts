import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { PrepararCompraComponent } from './features/preparar-compra/preparar-compra.component';
import { AdministracionComponent } from './features/administracion/administracion.component';
import { LoginComponent } from './features/auth/login/login.component';
import { guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canMatch: [guestGuard] },
  { path: '', component: HomeComponent },
  { path: 'preparar-compra', component: PrepararCompraComponent },
  { path: 'administracion', component: AdministracionComponent },
  { path: 'administracion/productos', component: AdministracionComponent },
  { path: 'administracion/categorias', component: AdministracionComponent },
  { path: '**', redirectTo: '' },
];
