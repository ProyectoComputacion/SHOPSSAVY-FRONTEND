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
  adminKey = '';
  chefKey = '';
  errorMessage = '';
  passwordError = ''; // Mensaje de error para la contraseña
  isLoading = false; // Estado de carga

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    console.log('📩 Rol seleccionado antes de enviar:', this.role);

    if (this.role === 'admin' && this.adminKey !== 'admin123') {
      this.errorMessage = 'Clave secreta incorrecta para registrar un administrador.';
      return;
    }

    if (this.role === 'chef' && this.chefKey !== 'chef123') {
      this.errorMessage = 'Clave secreta incorrecta para registrar un administrador.';
      return;
    }

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

    this.isLoading = true;

    setTimeout(() => {
      this.authService.register(this.username, this.password, this.role, this.adminKey).subscribe(
        (response) => {
          this.isLoading = false;
          this.router.navigate(['/login']);
        },
        (error) => {
          this.errorMessage = error.message || 'Error en el registro. Inténtalo de nuevo.';
          console.error('❌ Error en el registro:', error);
          this.isLoading = false;
        }
      );
    }, 1000);
  }

  onRoleChange(event: any) {
    this.role = event.target.value;
    console.log('🔄 Nuevo rol seleccionado:', this.role);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
