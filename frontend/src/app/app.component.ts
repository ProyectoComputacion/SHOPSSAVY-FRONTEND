import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { RouterOutlet, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  logoutMenuOpen: boolean = false;
  user: any = null; // objeto completo

  menuItems = [
    { label: 'Inicio', link: '/home' },
    { label: 'Recetas', link: '/recetas' },
    { label: 'Carrito', link: '/carrito', protected: true },
    { label: 'Calificados', link: '/clasificados', protected: true },
    { label: 'Favoritos', link: '/favoritos', protected: true },
    { label: 'Presupuesto', link: '/presupuesto' },
    { label: 'Crea Tu Receta', link: '/crear-receta', role: 'chef' },
    { label: 'Configuración', link: '/admin', role: 'admin' }
  ];

  private authService = inject(AuthService);

  constructor(public router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.user = JSON.parse(sessionStorage.getItem('user') || 'null');

    console.log("📌 Usuario cargado al iniciar:", this.user);

    // 🔥 Filtrar menús según rol
    this.menuItems = this.menuItems.filter(item => {
      if (!item.role) return true;
      return item.role === this.user?.role?.trim().toLowerCase();
    });
  }

  isAdmin(): boolean {
    return this.user && this.user.role === 'admin';
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    sessionStorage.removeItem('user');
    this.user = null;
    this.router.navigate(['/login']);
  }

  isAuthPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }

  toggleLogoutMenu(event: Event) {
    event.preventDefault();
    this.logoutMenuOpen = !this.logoutMenuOpen;
  }

  redirigirLogin(): void {
    const modalElement = document.getElementById('authRequiredModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
    this.router.navigate(['/login']);
  }

  redirigirRegistro(): void {
    const modalElement = document.getElementById('authRequiredModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
    this.router.navigate(['/register']);
  }

  mostrarModalAuth(): void {
    const modalElement = document.getElementById('authRequiredModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  handleMenuClick(item: any, event: Event): void {
    event.preventDefault();

    const isProtected = item.protected;
    const isLoggedIn = !!sessionStorage.getItem('user');

    if (item.link === '/logout') {
      this.logout();
      return;
    }

    if (isProtected && !isLoggedIn) {
      this.mostrarModalAuth();
      return;
    }

    this.router.navigate([item.link]);
  }
}
