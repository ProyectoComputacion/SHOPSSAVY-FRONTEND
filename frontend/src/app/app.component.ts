import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public router: Router) {}

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
}
