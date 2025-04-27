import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecetaService, Recipe, Ingredient } from '../../services/receta.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { RatingService } from '../../services/rating.service';
import { AppComponent } from '../../app.component';

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

  constructor(
    private route: ActivatedRoute,
    private recetaService: RecetaService,
    private cartService: CartService,
    private ratingService: RatingService,
    private app: AppComponent
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
      });
    }
  }

  volver() {
    history.back();
  }

  agregarAlCarrito() {
    if (!sessionStorage.getItem('user_id')) {
      this.app.mostrarModalAuth();
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
      this.app.mostrarModalAuth();
      return;
    }
    const modalEl = document.getElementById('calificarModal');
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
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
        bootstrap.Modal.getInstance(modalEl).hide();
      }, 2000);
    });
  }
}
