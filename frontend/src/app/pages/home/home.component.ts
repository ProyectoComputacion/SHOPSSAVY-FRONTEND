import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { AppComponent } from '../../app.component'; // ✅ Importa el componente principal

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private app: AppComponent // ✅ Inyecta AppComponent
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.cdr.detectChanges(); // 🔄 Forzar a Angular a detectar cambios
    }, 100);
  }

  navigateTo(route: string) {
    const isLoggedIn = !!sessionStorage.getItem('user_id');
    const rutasProtegidas = ['/favoritos', '/carrito', '/clasificados'];

    if (!isLoggedIn && rutasProtegidas.includes(route)) {
      this.app.mostrarModalAuth(); // ✅ Muestra el modal si no está logueado
      return;
    }

    console.log("🔗 Navegando a:", route);
    this.router.navigate([route]);
  }
}
