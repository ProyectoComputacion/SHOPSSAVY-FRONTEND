// src/app/pages/recetas/recetas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { RecetaService, Recipe } from '../../services/receta.service';

declare const bootstrap: any;

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

  constructor(
    private recetaService: RecetaService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.obtenerRecetas();
    this.obtenerCategorias();
    this.obtenerTipos();
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
    // aquí el non-null assertion (!) le dice a TS que nunca será null
    const modalEl = document.getElementById('modalCategoriaFavorito')!; 
    this.modalCategoriaFavorito = new bootstrap.Modal(modalEl);

    // Listener para limpiar backdrop / scroll cuando Bootstrap termine de ocultar
    modalEl.addEventListener('hidden.bs.modal', () => {
      document.body.style.overflow = '';
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    });

    this.modalCategoriaFavorito.show();
  }

  seleccionarCategoria(category: string): void {
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
        // sólo oculta, el listener se encarga del cleanup
        this.modalCategoriaFavorito.hide();
      },
      err => {
        console.error('Error añadiendo favorito:', err);
      }
    );
  }
}
