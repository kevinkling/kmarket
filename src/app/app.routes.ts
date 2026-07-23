import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { PrepararCompraComponent } from './features/preparar-compra/preparar-compra.component';
import { AdministracionComponent } from './features/administracion/administracion.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'preparar-compra', component: PrepararCompraComponent },
  { path: 'administracion', component: AdministracionComponent },
  { path: 'administracion/productos', component: AdministracionComponent },
  { path: 'administracion/categorias', component: AdministracionComponent },
  { path: '**', redirectTo: '' },
];
