import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  password = '';
  role = 'user'; // Default role
  errorMessage = '';
  passwordError = ''; // Mensaje de error para la contraseña
  isLoading = false; // Estado de carga

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    console.log('📩 Rol seleccionado antes de enviar:', this.role);

    if (this.role !== 'user' && this.role !== 'chef') {
      this.role = 'user';
    }

    // Validaciones antes de enviar los datos
    if (!this.username || !this.password) {
      this.errorMessage = 'Rellena todos los campos.';
      return;
    }

    if (this.password.length < 6) {
      this.passwordError = 'La contraseña debe ser de 6 caracteres o más.';
      return;
    } else {
      this.passwordError = ''; // Borra el mensaje de error si la contraseña es válida
    }

    console.log('📩 Enviando datos de registro:', {
      username: this.username,
      password: this.password,
      role: this.role
    });

    this.isLoading = true; // Activar animación de carga

    setTimeout(() => {
      this.authService.register(this.username, this.password, this.role).subscribe(
        (response) => {
          console.log('✅ Usuario registrado con éxito:', response.user.role);
          this.isLoading = false;
          this.router.navigate(['/login']); // Redirigir al login
        },
        (error) => {
          this.errorMessage = 'Error en el registro. Inténtalo de nuevo.';
          console.error('❌ Error en el registro:', error);
          this.isLoading = false;
        }
      );
    }, 1000); // Simula una espera de 1 segundo
  }

  onRoleChange(event: any) {
    this.role = event.target.value;
    console.log('🔄 Nuevo rol seleccionado:', this.role);
  }

  /**
   * ✅ Redirige a la página de login cuando el usuario hace clic en "Inicia sesión".
   */
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
