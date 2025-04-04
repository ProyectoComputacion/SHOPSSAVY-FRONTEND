import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChefGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    if (user && user.role === 'chef') {
      return true;
    } else {
      this.router.navigate(['/home']); // Redirigir si no es "chef"
      return false;
    }
  }
}
