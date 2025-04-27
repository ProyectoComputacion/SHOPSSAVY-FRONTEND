// src/app/pages/recetas/recetas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { RecetaService, Recipe } from '../../services/receta.service';

declare const bootstrap: any;

interface Favorite {
  id: number;
  recipe_id: number;
  category: string;
  // otros campos si los hay...
}

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.scss']
})
export class RecetasComponent implements OnInit {
  recetasFiltradas: Recipe[] = [];
  categorias: string[] = [];
  tipos: string[] = [];
  filtroCategoria = '';
  filtroTipo = '';

  private modalCategoriaFavorito!: any;
  recetaSeleccionada!: Recipe;

  /** Lista de IDs de recetas ya en favoritos */
  favoriteRecipeIds: number[] = [];

  constructor(
    private recetaService: RecetaService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.obtenerRecetas();
    this.obtenerCategorias();
    this.obtenerTipos();
    this.cargarFavoritos();
  }

  /** Carga los favoritos del usuario para poder comprobar duplicados */
  cargarFavoritos(): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    this.http
      .get<Favorite[]>('/api/favorites', { headers })
      .subscribe(
        data => {
          this.favoriteRecipeIds = data.map(f => f.recipe_id);
        },
        err => console.error('Error cargando favoritos:', err)
      );
  }

  obtenerRecetas(): void {
    const tipoCorrecto =
      this.filtroTipo === 'Normales'
        ? 'Recetas'
        : this.filtroTipo === 'Michelin'
        ? 'Recetas Michelin'
        : '';
    this.recetaService
      .getRecetas(this.filtroCategoria, tipoCorrecto)
      .subscribe(data => (this.recetasFiltradas = data));
  }

  obtenerCategorias(): void {
    this.recetaService
      .getCategorias()
      .subscribe(data => (this.categorias = data));
  }

  obtenerTipos(): void {
    this.recetaService
      .getTipos()
      .subscribe(data => (this.tipos = data));
  }

  filtrarRecetas(): void {
    this.obtenerRecetas();
  }

  setCategoria(categoria: string): void {
    this.filtroCategoria = categoria;
    this.filtrarRecetas();
    const offEl = document.getElementById('offcanvasCategoriasRecetas')!;
    bootstrap.Offcanvas.getInstance(offEl)?.hide();
  }

  verDetalles(id: number): void {
    this.router.navigate(['/receta-detalle', id]);
  }

  abrirModalCategoria(receta: Recipe): void {
    this.recetaSeleccionada = receta;
    const modalEl = document.getElementById('modalCategoriaFavorito')!;
    this.modalCategoriaFavorito = new bootstrap.Modal(modalEl);
    modalEl.addEventListener('hidden.bs.modal', () => {
      document.body.style.overflow = '';
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    });
    this.modalCategoriaFavorito.show();
  }

  seleccionarCategoria(category: string): void {
    // 1) Comprobar duplicado
    if (this.favoriteRecipeIds.includes(this.recetaSeleccionada.id)) {
      alert('Esta receta ya está en favoritos');
      this.modalCategoriaFavorito.hide();
      return;
    }

    // 2) Si no existe, añadir
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    const body = {
      recipe_id: this.recetaSeleccionada.id,
      category
    };

    this.http.post('/api/favorites', body, { headers }).subscribe(
      () => {
        // Actualizamos el array local para futuros checks
        this.favoriteRecipeIds.push(this.recetaSeleccionada.id);
        // Cerramos modal (el listener hará el cleanup)
        this.modalCategoriaFavorito.hide();
      },
      err => {
        console.error('Error añadiendo favorito:', err);
      }
    );
  }
}
