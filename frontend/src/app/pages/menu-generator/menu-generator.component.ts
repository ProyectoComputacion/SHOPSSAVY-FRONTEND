import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-generator.component.html',
  styleUrls: ['./menu-generator.component.css']
})
export class MenuGeneratorComponent {
  budget: number = 0;
  recipes: any[] = [];
  totalPrice: number = 0;
  errorMessage: string = '';

  constructor(private menuService: MenuService) {}

  generateMenu() {
    // Validar presupuesto
    if (this.budget <= 0) {
      this.errorMessage = 'Por favor, ingresa un presupuesto válido.';
      return;
    }
    this.errorMessage = '';
    this.recipes = [];
    this.totalPrice = 0;

    this.menuService.generateMenu(this.budget).subscribe({
      next: (resp) => {
        // El endpoint retorna algo como:
        // { success: true, total_price: XX, recipes: [ ... ] }
        if (resp.success) {
          this.recipes = resp.recipes;
          this.totalPrice = resp.total_price;
        } else {
          this.errorMessage = resp.message || 'No se pudo generar el menú.';
        }
      },
      error: (err) => {
        // Manejo de error
        this.errorMessage = err.error?.message || 'Error al generar el menú.';
      }
    });
  }
}
