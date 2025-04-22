import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecetaService, Recipe, Ingredient } from '../../services/receta.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { RatingService } from '../../services/rating.service';



declare var bootstrap: any; // Para manejar el modal de Bootstrap

@Component({
  selector: 'app-receta-detalle',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './receta-detalle.component.html',
  styleUrls: ['./receta-detalle.component.scss']
})
export class RecetaDetalleComponent implements OnInit {
  receta!: Recipe;
  ingredientes: Ingredient[] = [];
  recetaCargada: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private recetaService: RecetaService,
    private cartService: CartService,
    private ratingService: RatingService // ✅ NUEVO
  ) {}
  
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.obtenerReceta(id);
      console.log(id ,'id de receta');
      this.obtenerIngredientes(id);
    } else {
      console.error('ID de receta inválido');
    }
  }

  obtenerReceta(id: number): void {
    this.recetaService.getReceta(id).subscribe(
      (data) => {
        this.receta = data;
        this.recetaCargada = true;
      },
      (error) => {
        console.error('Error obteniendo la receta:', error);
      }
    );
  }

  obtenerIngredientes(id: number): void {
    this.recetaService.getIngredientes(id).subscribe(
      (data) => {
        this.ingredientes = data;
      },
      (error) => {
        console.error('Error obteniendo ingredientes:', error);
      }
    );
  }

  calificacionSeleccionada: number = 0; // ⭐ Calificación actual
  mensajeConfirmacion: boolean = false; 
  /**
   * Boton "Calificar"
   * Abre un modal de calificación
   */
  calificar(): void {
    const modalElement = document.getElementById('calificarModal'); // 👈 Nuevo: busca el modal por ID
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement); // 👈 Nuevo: crea una instancia del modal
      modal.show(); // 👈 Nuevo: muestra el modal
    } else {
      console.error('No se encontró el modal de calificación'); // 👈 Nuevo: log de error si falta el modal
    }
  }

  /**
   * Enviar calificación 
   */

  seleccionarCalificacion(valor: number): void {
    this.calificacionSeleccionada = valor;
  }
  
  confirmarCalificacion(): void {
    const user_id = Number(sessionStorage.getItem('user_id'));
    const recipe_id = this.receta?.id;
  
    if (this.calificacionSeleccionada > 0 && user_id && recipe_id) {
      // ✅ Quitar el foco del elemento activo antes de enviar la calificación
      const active = document.activeElement as HTMLElement;
      if (active) active.blur();
  
      this.ratingService.enviarCalificacion(user_id, recipe_id, this.calificacionSeleccionada).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          this.mensajeConfirmacion = true;
  
          setTimeout(() => {
            this.mensajeConfirmacion = false;
  
            // ✅ Cierre del modal (ya sin foco en un elemento interno)
            const modalElement = document.getElementById('calificarModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
          }, 2000);
        },
        error: (error) => {
          console.error('Error al enviar la calificación:', error);
          alert('Hubo un error al enviar tu calificación. Inténtalo nuevamente.');
        }
      });
    } else {
      alert('Debes seleccionar una calificación válida.');
    }
  }
  
  
  /**
   * Botón "Volver"
   */
  volver(): void {
    history.back();
  }

  /**
   * Añadir receta al carrito (muestra modal de confirmación)
   */
  agregarAlCarrito(): void {
    if (!this.receta) {
      console.error('No hay receta cargada');
      return;
    }
  
    const userId = Number(sessionStorage.getItem('user_id')); // Asegúrate de tener el user_id
    console.log('user_id desde sessionStorage:', userId); // Verifica que el valor del user_id es correcto
  
    if (!userId) {
      console.error('No se ha encontrado un ID de usuario válido');
      return;
    }
  
    const recipeId = this.receta.id;
    const recipeType = this.receta.tipo; // Asegúrate de que 'tipo' está bien definido en el modelo
  
    this.cartService.addToCart(userId, recipeId, recipeType).subscribe({
      next: (response) => {
        console.log('Receta añadida al carrito:', response);
  
        // ✅ Mostrar modal de confirmación
        const modalElement = document.getElementById('carritoModal');
        if (modalElement) {
          const modal = new bootstrap.Modal(modalElement);
          modal.show();
        }
      },
      error: (error) => {
        console.error('Error al agregar al carrito:', error);
        console.log(userId, recipeId, recipeType);
      }
    });
  }
  
  
}
