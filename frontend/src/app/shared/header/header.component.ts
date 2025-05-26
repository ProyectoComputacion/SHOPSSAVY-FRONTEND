import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() authRequired = new EventEmitter<void>();

  isLoggedIn: boolean = false;
  logoutMenuOpen: boolean = false;
  user: any = null;

  menuItems = [
    { label: 'Inicio', link: '/home' },
    { label: 'Recetas', link: '/recetas' },
    { label: 'Carrito', link: '/carrito', protected: true },
    { label: 'Calificados', link: '/clasificados', protected: true },
    { label: 'Favoritos', link: '/favoritos', protected: true },
    { label: 'Presupuesto', link: '/presupuesto' },
    { label: 'Crea Tu Receta', link: '/crear-receta', role: 'chef' },
    { label: 'Genera tu menú', link: '/menu-generator', protected: true},
    { label: 'Configuración', link: '/admin', role: 'admin' }
  ];

  private authService = inject(AuthService);

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.user = JSON.parse(sessionStorage.getItem('user') || 'null');

    // Filtrar menús según rol
    this.menuItems = this.menuItems.filter(item => {
      if (!item.role) return true;
      return item.role === this.user?.role?.trim();
    });
  }

  isAuthPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }

  toggleLogoutMenu(event: Event): void {
    event.preventDefault();
    this.logoutMenuOpen = !this.logoutMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('user_id');
    this.user = null;
    this.router.navigate(['/login']);
  }

  handleMenuClick(item: any, event: Event): void {
    event.preventDefault();

    const isProtected = item.protected;
    const isLogged = !!sessionStorage.getItem('user');

    if (isProtected && !isLogged) {
      this.authRequired.emit(); // Le pide a AppComponent que muestre el modal
      return;
    }

    if (item.link === '/logout') {
      this.logout();
      return;
    }

    this.router.navigate([item.link]);
  }
}
