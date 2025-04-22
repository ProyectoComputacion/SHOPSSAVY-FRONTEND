import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { RouterOutlet, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterModule], // Importamos RouterModule
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  userRole: string | null = null;
  activeRoute: string = '';
  logoutMenuOpen: boolean = false; // 🔹 Controla la visibilidad del submenú

  menuItems = [
    { label: 'Inicio', link: '/home' },
    { label: 'Recetas', link: '/recetas' },
    { label: 'Carrito', link: '/carrito' },
    { label: 'Calificados', link: '/clasificados' },
    { label: 'Favoritos', link: '/favoritos' },
    { label: 'Presupuesto', link: '/presupuesto' },
    { label: 'Crea Tu Receta', link: '/crear-receta', role: 'chef' },
    { label: '', link: '' },
    { label: '', link: '' },
    { label: '', link: '' },
    { label: '', link: '' },
    { label: '', link: '' },
    { label: 'Cerrar sesión', link: '/logout' }
  ];

  private authService = inject(AuthService);

  constructor(private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.userRole = sessionStorage.getItem('userRole');
    this.activeRoute = this.router.url;
    console.log("📌 Rol cargado al iniciar:", this.userRole);
  
    // Filtra los elementos según el rol
    this.menuItems = this.menuItems.filter(item => {
      if (!item.role) return true;
      return item.role === this.userRole?.trim().toLowerCase();
    });
  }
  

  setActive(route: string) {
    this.activeRoute = route;
  }

  isActive(route: string): boolean {
    return this.activeRoute === route || this.router.url === route;
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    sessionStorage.removeItem('userRole');
    this.userRole = null;
    this.router.navigate(['/login']);
  }

  isAuthPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }

  // 🔹 Función para abrir/cerrar el submenú de "Cerrar sesión"
  toggleLogoutMenu(event: Event) {
    event.preventDefault(); // Evita que el enlace se active
    this.logoutMenuOpen = !this.logoutMenuOpen; // 🔄 Alternar el submenú
  }
}
