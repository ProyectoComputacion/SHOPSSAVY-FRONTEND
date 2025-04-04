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

// 🔐 Middlewares de autenticación y roles
import { AuthGuard } from './auth/auth.guard';
import { ChefGuard } from './auth/chef.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 🔐 Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 🏠 Rutas accesibles solo para usuarios autenticados
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'recetas', component: RecetasComponent, canActivate: [AuthGuard] },
  { path: 'clasificados', component: ClasificadosComponent, canActivate: [AuthGuard] },
  { path: 'presupuesto', component: PresupuestoComponent, canActivate: [AuthGuard] },
  { path: 'carrito', component: CarritoComponent, canActivate: [AuthGuard] },
  { path: 'favoritos', component: FavoritosComponent, canActivate: [AuthGuard] },

  // 📌 Detalles de una receta
  { path: 'receta-detalle/:id', component: RecetaDetalleComponent, canActivate: [AuthGuard] },

  // 🔐 Rutas exclusivas para Chefs
  { path: 'crear-receta', component: CrearRecetaComponent, canActivate: [AuthGuard] },

  
  { path: 'chat-global', component: ChatGlobalComponent, canActivate: [AuthGuard] },

  { path: 'menu-generator', component: MenuGeneratorComponent },

  // 🛑 Ruta por defecto si la URL no coincide
  { path: '**', redirectTo: 'login' }
];
