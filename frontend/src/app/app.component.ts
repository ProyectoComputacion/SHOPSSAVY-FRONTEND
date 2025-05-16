import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from './auth/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterOutlet,
    HeaderComponent,
    HttpClientModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService); // 🧩 Ahora sí definido correctamente

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.cargarEstilosDesdeBD();
  }

  isAuthPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }

  mostrarModalAuth(): void {
    const modalEl = document.getElementById('authRequiredModal');
    if (modalEl) {
      new bootstrap.Modal(modalEl).show();
    }
  }

  redirigirLogin(): void {
    const modalEl = document.getElementById('authRequiredModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }
    this.router.navigate(['/login']);
  }

  redirigirRegistro(): void {
    const modalEl = document.getElementById('authRequiredModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }
    this.router.navigate(['/register']);
  }

  cargarEstilosDesdeBD(): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/componentes', this.authService.header()).subscribe({
      next: componentes => {
        componentes.forEach(c => {
          if (c.clave && c.valor) {
            document.documentElement.style.setProperty(`--${c.clave}`, c.valor);
          }
        });
      },
      error: err => {
        console.error('🚫 Error cargando estilos del frontend desde la base de datos:', err);
      }
    });
  }
}
