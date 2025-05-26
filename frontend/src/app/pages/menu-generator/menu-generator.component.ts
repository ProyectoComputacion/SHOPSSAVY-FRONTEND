import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-generator.component.html',
  styleUrls: ['./menu-generator.component.scss']
})
export class MenuGeneratorComponent {
  budget: number = 50;
  recipes: any[] = [];
  distributedRecipes: any[][] = []; // 7 arrays (uno por día)
  totalPrice: number = 0;
  errorMessage: string = '';
  weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  constructor(private menuService: MenuService
, private router: Router
  ) {}

  generateMenu() {
    if (this.budget < 50 || this.budget > 100) {
      this.errorMessage = 'El presupuesto debe estar entre 50€ y 100€.';
      return;
    }

    this.errorMessage = '';
    this.recipes = [];
    this.totalPrice = 0;
    this.distributedRecipes = [];

    this.menuService.generateMenu(this.budget).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.recipes = this.shuffleArray(resp.recipes);
          this.totalPrice = parseFloat(resp.total_price.toFixed(2));
          this.distributedRecipes = this.distributeRecipes(this.recipes);
        } else {
          this.errorMessage = resp.message || 'No se pudo generar el menú.';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al generar el menú.';
      }
    });
  }

  // Aleatoriza el array
  shuffleArray(array: any[]): any[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Distribuye en 7 días con máximo 2 recetas por día
  distributeRecipes(recipes: any[]): any[][] {
    const days: any[][] = Array.from({ length: 7 }, () => []);
    let index = 0;
    recipes.forEach(recipe => {
      let added = false;
      while (!added) {
        const day = index % 7;
        if (days[day].length < 2) {
          days[day].push(recipe);
          added = true;
        }
        index++;
      }
    });
    return days;
  }

  verDetalles(recipeId: number): void {
    this.router.navigate(['/receta-detalle', recipeId]);
  }
}
