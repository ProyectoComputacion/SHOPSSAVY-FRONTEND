import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false; // Estado para mostrar animación de carga

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    console.log("LoginComponent: Iniciando login con:", this.username, this.password);
    this.isLoading = true; // Activar animación de carga
    this.errorMessage = ''; // Limpiar mensaje de error

    setTimeout(() => {
      this.authService.login(this.username, this.password).subscribe(
        (response: any) => {
          console.log("LoginComponent: Respuesta recibida:", response);
          sessionStorage.setItem('userRole', response.user.role);
            // Almacenar el user_id y el auth_token en sessionStorage
        sessionStorage.setItem('user_id', response.user.id);

          console.log("📌 Rol guardado en sessionStorage:", response.user.role);
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
          this.isLoading = false;
        },
        (error) => {
          console.error("LoginComponent: Error en login:", error);
          this.errorMessage = error.message || 'Credenciales incorrectas.';
          this.isLoading = false; // Desactivar animación de carga
        }
      );
    }, 1000); // Simula la espera antes de la autenticación real
  }

  /**
   * ✅ Redirige a la página de registro cuando el usuario hace clic en "Regístrate aquí".
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
