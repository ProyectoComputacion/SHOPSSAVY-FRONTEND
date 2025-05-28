import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecetaService, Recipe, Ingredient } from '../../services/receta.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { RatingService } from '../../services/rating.service';

declare const bootstrap: any;

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
  recetaCargada = false;
  calificacionSeleccionada = 0;
  mensajeConfirmacion = false;
  calorias: number = 0;

  constructor(
    private route: ActivatedRoute,
    private recetaService: RecetaService,
    private cartService: CartService,
    private ratingService: RatingService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.recetaService.getReceta(id).subscribe(data => {
        this.receta = data;
        this.recetaCargada = true;
      });

      this.recetaService.getIngredientes(id).subscribe(data => {
        this.ingredientes = data;
        console.log("Ingredientes:", this.ingredientes);

        // ⚠️ Llamar aquí al método para calcular calorías
        const textoIngredientes = this.ingredientes.map(i =>
          `${i.quantity} ${i.unit} de ${i.name}`
        );
        this.calcularCalorias(textoIngredientes);
      });
    }
  }


  volver() {
    history.back();
  }

  agregarAlCarrito() {
    if (!sessionStorage.getItem('user_id')) {
      this.mostrarModalLocal();
      return;
    }
    this.cartService.addToCart(
      Number(sessionStorage.getItem('user_id')),
      this.receta.id,
      this.receta.tipo
    ).subscribe(() => {
      const modalEl = document.getElementById('carritoModal');
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    });
  }

calificar() {
  if (!sessionStorage.getItem('user_id')) {
    this.mostrarModalLocal();
    return;
  } else {   
    const modalEl = document.getElementById('calificarModal');
    if (modalEl) {
      modalEl.setAttribute('aria-hidden', 'false'); // <- Esto soluciona la advertencia
      bootstrap.Modal.getOrCreateInstance(modalEl).show();

      // Enfocar el modal por accesibilidad
      setTimeout(() => {
        modalEl.focus();
      }, 150);
    }
  }
}


  seleccionarCalificacion(valor: number) {
    this.calificacionSeleccionada = valor;
  }

confirmarCalificacion() {
  const userId = Number(sessionStorage.getItem('user_id'));
  this.ratingService.enviarCalificacion(
    userId,
    this.receta.id,
    this.calificacionSeleccionada
  ).subscribe(() => {
    this.mensajeConfirmacion = true;

    setTimeout(() => {
      this.mensajeConfirmacion = false;
      const modalEl = document.getElementById('calificarModal');
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) {
        modalInstance.hide();
      }
      if (modalEl) {
        modalEl.setAttribute('aria-hidden', 'true'); // <- ESTA LÍNEA
      }
    }, 2000);
  });
}

  cargandoCalorias = false;

  calcularCalorias(ingredientes: string[]) {
    this.cargandoCalorias = true;
    this.http.post<{ calorias: string | null }>('http://127.0.0.1:8000/api/recetas/calorias', {
      ingredientes
    }).subscribe({
      next: res => {
        console.log("Resultado recibido:", res);
        const texto = res.calorias ?? '';
        const match = texto.match(/\d+/);
        this.calorias = match ? Number(match[0]) : 0;
        this.cargandoCalorias = false;
      },

      error: err => {
        console.error('Error al calcular calorías:', err);
        this.cargandoCalorias = false;
      }
    });
  }

redirigirLogin(): void {
  const modalEl = document.getElementById('authModalLocal');
  if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  window.location.href = '/login';
}

redirigirRegistro(): void {
  const modalEl = document.getElementById('authModalLocal');
  if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
  window.location.href = '/register';
}

mostrarModalLocal() {
  const modalEl = document.getElementById('authModalLocal');
  if (modalEl) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();

    // Forzar el foco en el modal (accesibilidad)
    setTimeout(() => {
      modalEl.focus();
    }, 150);
  }
}


}
