import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.cdr.detectChanges(); // 🔄 Forzar a Angular a detectar cambios
    }, 100);
  }

  navigateTo(route: string) {
    console.log("🔗 Navegando a:", route);
    this.router.navigate([route]); // 🔄 Ahora sí navega correctamente
  }
}
