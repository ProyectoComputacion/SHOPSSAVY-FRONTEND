import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { RecetasComponent } from './pages/recetas/recetas.component';
import { ClasificadosComponent } from './pages/clasificados/clasificados.component';
import { PresupuestoComponent } from './pages/presupuesto/presupuesto.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { RecetaDetalleComponent } from './pages/receta-detalle/receta-detalle.component';
import { CrearRecetaComponent } from './pages/crear-receta/crear-receta.component';
import { FavoritosComponent } from './pages/favoritos/favoritos.component';
import { ChatGlobalComponent } from './pages/chat-global/chat-global.component';
import { MenuGeneratorComponent } from './pages/menu-generator/menu-generator.component';
import {AdminHomeComponent} from './pages/admin-home/admin-home.component';




// 🔐 Middlewares de autenticación y roles
import { AuthGuard } from './auth/auth.guard';
import { ChefGuard } from './auth/chef.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  

  // Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rutas accesibles para todos
  { path: 'home', component: HomeComponent },
  { path: 'recetas', component: RecetasComponent },
  { path: 'clasificados', component: ClasificadosComponent },
  { path: 'presupuesto', component: PresupuestoComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'receta-detalle/:id', component: RecetaDetalleComponent },
  { path: 'menu-generator', component: MenuGeneratorComponent },



  // Rutas restringidas
  { path: 'crear-receta', component: CrearRecetaComponent, canActivate: [AuthGuard] },
  { path: 'chat-global', component: ChatGlobalComponent, canActivate: [AuthGuard] },
  {path: 'admin',children: [
    { path: '', loadComponent: () => import('./pages/admin-home/admin-home.component').then(m => m.AdminHomeComponent) },
    { path: 'usuarios', loadComponent: () => import('./pages/admin-usuarios/admin-usuarios.component').then(m => m.AdminUsuariosComponent) },
    { path: 'recetas', loadComponent: () => import('./pages/admin-recetas/admin-recetas.component').then(m => m.AdminRecetasComponent) },
    { path: 'chart', loadComponent: () => import('./pages/chart/chart.component').then(m => m.ChartComponent) },

  ]
},


  // Ruta por defecto
  { path: '**', redirectTo: 'home' }
];
