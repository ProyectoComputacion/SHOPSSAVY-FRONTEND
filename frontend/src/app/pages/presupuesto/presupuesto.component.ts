import { Component } from '@angular/core';
import { PresupuestoService } from '../../services/presupuesto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presupuesto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './presupuesto.component.html',
  styleUrls: ['./presupuesto.component.scss']
})
export class PresupuestoComponent {
  presupuesto: number = 0;
  resultados: any[] = [];
  error: string = '';

  constructor(
    private presupuestoService: PresupuestoService,
    private router: Router
  ) {}

  buscarRecetas() {
    if (this.presupuesto <= 0) {
      this.error = 'Por favor, ingrese un presupuesto válido.';
      return;
    }
    this.error = '';
    this.presupuestoService.buscarPorPresupuesto(this.presupuesto).subscribe(
      (data) => {
        console.log('Respuesta de la API:', data);  // <-- Agrega este log
        this.resultados = data;
      },
      (err) => {
        console.error(err);
        this.error = 'Error al obtener recetas.';
      }
    );
  }
  

  /**
   * Navega a la página de detalles de la receta, pasando el ID.
   */
  verDetalles(recipeId: number): void {
    this.router.navigate(['/receta-detalle', recipeId]);
  }
}
